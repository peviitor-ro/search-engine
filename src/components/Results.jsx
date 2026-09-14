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
import {
  setJobs,
  setTotal,
  setPage,
  setPageSize,
  setLoading,
  setNetworkError
} from "../reducers/jobsSlice";
// function to create the string
import { createSearchString } from "../utils/createSearchString";
// functions to fetch the data
import { getCachedData, getData } from "../utils/fetchData";
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
  const networkError = useSelector((state) => state.jobs.networkError);
  //state
  const [isVisible, setIsVisible] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Main data fetcher for initial load, filter changes, and pagination/page refreshes
  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const pageVal = findParamInURL("page");
        const targetPage = pageVal
          ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1
          : 1;

        const searchString = createSearchString(q, city, county, company, workmode, targetPage);
        const cachedData = getCachedData(searchString || "");

        if (cachedData && isMounted) {
          dispatch(setJobs(cachedData.jobs));
          dispatch(setTotal(cachedData.total));
          dispatch(setPage(targetPage));
          dispatch(setNetworkError(false));
          dispatch(setLoading(false));
        } else {
          dispatch(setLoading(true));
        }

        const response = await getData(searchString || "");

        if (response.networkError) {
          if (isMounted) dispatch(setNetworkError(true));
          return;
        }

        const newJobs = response?.jobs || response?.data || (Array.isArray(response) ? response : []);
        const newTotal = response?.total ?? response?.totalCount ?? newJobs.length;

        if (isMounted) {
          dispatch(setJobs(newJobs));
          dispatch(setTotal(newTotal));
          dispatch(setPage(targetPage));
          dispatch(setNetworkError(false));
          if (newJobs.length > 0) dispatch(setPageSize(newJobs.length));
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        if (isMounted) {
          dispatch(setNetworkError(true));
        }
      } finally {
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
    (nextPage, { syncUrl = true } = {}) => {
      if (
        nextPage < 1 ||
        nextPage > totalPages ||
        nextPage === page ||
        loading
      ) {
        return;
      }

      dispatch(setPage(nextPage));
      if (syncUrl) {
        updateUrlParams({ page: nextPage });
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [page, totalPages, loading, dispatch]
  );

  // Follow manual edits to the URL's page param (address bar edits, back/forward)
  useEffect(() => {
    const syncPageFromUrl = () => {
      const pageVal = findParamInURL("page");
      const urlPage = pageVal
        ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1
        : 1;
      if (urlPage !== page) {
        dispatch(setPage(urlPage));
      }
    };

    window.addEventListener("hashchange", syncPageFromUrl);
    window.addEventListener("popstate", syncPageFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncPageFromUrl);
      window.removeEventListener("popstate", syncPageFromUrl);
    };
  }, [page, dispatch]);

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
      ) : networkError ? (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-14 py-24 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Conexiune eșuată
          </h2>
          <p className="text-slate-600 max-w-md mx-auto text-base leading-relaxed">
            Nu se poate încărca pagina următoare, verificați conexiunea la internet.
          </p>
        </div>
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
          disabled={loading}
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