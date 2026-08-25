import { useContext, useState, useEffect, useCallback } from "react";
// components
import Job from "./Job";
import NoResults from "./NoResults";
import Button from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
// icons
import scrollUp from "../assets/svg/scroll-up.svg";
// context
import TagsContext from "../context/TagsContext";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setJobs, setTotal, setPage, setPageSize, setLoading } from "../reducers/jobsSlice";
// function to create the string
import { createSearchString } from "../utils/createSearchString";
// functions to fetch the data
import { getData } from "../utils/fetchData";
import JobSkeleton from "@/components/ui/job-skeleton";
import { findParamInURL, updateUrlParams } from "../utils/urlManipulation";

const Results = () => {
  // redux
  const dispatch = useDispatch();
  // context
  const {
    q,
    city,
    remote: workmode,
    county,
    company
  } = useContext(TagsContext);
  // jobs
  const jobs = useSelector((state) => state.jobs.jobs);
  const total = useSelector((state) => state.jobs.total);
  const page = useSelector((state) => state.jobs.page);
  const pageSize = useSelector((state) => state.jobs.pageSize);
  const loading = useSelector((state) => state.jobs.loading);
  //state
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Main data fetcher for initial load, filter changes, and page refreshes
  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        dispatch(setLoading(true));

        const pageVal = findParamInURL("page");
        const targetPage = pageVal ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1 : page;

        const searchString = createSearchString(q, city, county, company, workmode, targetPage);
        const response = await getData(searchString || "").catch(() => ({ jobs: [], total: 0 }));

        const newJobs = response?.jobs || response?.data || (Array.isArray(response) ? response : []);
        const newTotal = response?.total ?? response?.totalCount ?? newJobs.length;

        if (isMounted) {
          dispatch(setJobs(newJobs));
          dispatch(setTotal(newTotal));
          dispatch(setPage(targetPage));
          if (newJobs.length > 0) dispatch(setPageSize(newJobs.length));
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        if (isMounted) {
          dispatch(setJobs([]));
          dispatch(setTotal(0));
        }
      } finally {
        // CRITICAL: Guaranteed to turn off loading state so it never loops infinitely
        if (isMounted) {
          dispatch(setLoading(false));
        }
      }
    };

    fetchJobs();

    return () => {
      isMounted = false;
    };
  }, [q, city, workmode, county, company, page, dispatch]);

  const goToPage = useCallback(
    async (nextPage, { syncUrl = true } = {}) => {
      if (
        nextPage < 1 ||
        nextPage > totalPages ||
        nextPage === page ||
        pageLoading
      ) {
        return;
      }

      setPageLoading(true);
      const response = await getData(
        createSearchString(q, city, county, company, workmode, nextPage)
      ).catch(() => ({ jobs: [], total }));
      setPageLoading(false);

      const newJobs = response?.jobs || response?.data || (Array.isArray(response) ? response : []);
      const newTotal = response?.total ?? response?.totalCount ?? total;

      dispatch(setJobs(newJobs));
      dispatch(setTotal(newTotal));
      dispatch(setPage(nextPage));
      if (newJobs.length > 0) dispatch(setPageSize(newJobs.length));
      if (syncUrl) updateUrlParams({ page: nextPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [
      q,
      city,
      county,
      company,
      workmode,
      page,
      pageLoading,
      totalPages,
      total,
      dispatch
    ]
  );

  // Follow manual edits to the URL's page param (address bar edits, back/forward)
  useEffect(() => {
    const syncPageFromUrl = () => {
      const pageVal = findParamInURL("page");
      const urlPage = pageVal
        ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1
        : 1;
      goToPage(urlPage, { syncUrl: false });
    };

    window.addEventListener("hashchange", syncPageFromUrl);
    window.addEventListener("popstate", syncPageFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncPageFromUrl);
      window.removeEventListener("popstate", syncPageFromUrl);
    };
  }, [goToPage]);

  // Listen to window scroll height to show/hide the scroll to top button
  useEffect(() => {
    const checkScrollHeight = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", checkScrollHeight);

    return () => window.removeEventListener("scroll", checkScrollHeight);
  }, []);

  function handleScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleStringDecode(str) {
    if (!str) return "";
    const parser = new DOMParser();
    const decodedString = parser.parseFromString(str, "text/html").body
      .textContent;
    return decodedString;
  }

  return (
    <div className="w-full">
      {loading ? (
        <ul className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-14 pb-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <li key={idx}>
              <JobSkeleton />
            </li>
          ))}
        </ul>
      ) : (
        <>
          {jobs.length > 0 ? (
            <ul className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-14 pb-12">
              {jobs.map(
                (
                  {
                    location,
                    company,
                    county,
                    url,
                    title,
                    workmode: jobWorkmode,
                    salary,
                    tags,
                    cif,
                    vdate,
                    date
                  },
                  idx
                ) => (
                  <li key={idx}>
                    <Job
                      location={location}
                      company={company}
                      county={county}
                      url={url}
                      title={handleStringDecode(title)}
                      workmode={jobWorkmode}
                      salary={salary}
                      tags={tags}
                      cif={cif}
                      vdate={vdate}
                      date={date}
                    />
                  </li>
                )
              )}
            </ul>
          ) : (
            <NoResults />
          )}
        </>
      )}

      {!loading && jobs.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={goToPage}
          disabled={pageLoading}
        />
      )}

      <Button
        buttonType="scrollToTop"
        className={`${isVisible ? "opacity-100 pointer-events-auto" : ""}`}
        onClick={handleScrollToTop}
      >
        <img src={scrollUp} alt="scroll-up" />
      </Button>
    </div>
  );
};

export default Results;