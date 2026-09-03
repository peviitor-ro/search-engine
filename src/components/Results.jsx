import { useContext, useState, useEffect, useCallback, useRef } from "react";
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
import { setJobs, setTotal, setPage, setPageSize } from "../reducers/jobsSlice";
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
  // state
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [networkError, setNetworkError] = useState(false);

  // Robust Cache keyed by the exact search query string for that specific page
  const pageCache = useRef({});

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Automatically cache successfully loaded data mapped to its exact search query string
  useEffect(() => {
    if (jobs.length > 0) {
      const currentQueryKey = createSearchString(
        q,
        city,
        county,
        company,
        workmode,
        page
      );
      pageCache.current[currentQueryKey] = { jobs, total };
    }
  }, [jobs, page, total, q, city, county, company, workmode]);

  const goToPage = useCallback(
    async (nextPage, { syncUrl = true } = {}) => {
      if (
        nextPage < 1 ||
        nextPage > totalPages ||
        (nextPage === page && jobs.length > 0) ||
        pageLoading
      ) {
        return;
      }

      setPageLoading(true);
      setNetworkError(false);

      const targetQueryKey = createSearchString(
        q,
        city,
        county,
        company,
        workmode,
        nextPage
      );

      try {
        // Try fetching fresh data from the network
        const { jobs: newJobs, total: newTotal } =
          await getData(targetQueryKey);

        // Success: update state normally
        dispatch(setJobs(newJobs));
        dispatch(setTotal(newTotal));
        dispatch(setPage(nextPage));
        if (newJobs.length > 0) dispatch(setPageSize(newJobs.length));
        if (syncUrl) updateUrlParams({ page: nextPage });
      } catch (error) {
        // Network failed (offline). Check if this exact page/filter combination is in cache!
        if (pageCache.current[targetQueryKey]) {
          const cachedData = pageCache.current[targetQueryKey];
          dispatch(setJobs(cachedData.jobs));
          dispatch(setTotal(cachedData.total));
          dispatch(setPage(nextPage));
          if (cachedData.jobs.length > 0)
            dispatch(setPageSize(cachedData.jobs.length));
          if (syncUrl) updateUrlParams({ page: nextPage });
        } else {
          // Never visited or cached, trigger inline network error view
          setNetworkError(true);
        }
      } finally {
        setPageLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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
      jobs.length,
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

  const hasActiveSearch = Boolean(q || city || county || company || workmode);
  const shouldShowNoResults =
    !loading && hasActiveSearch && !networkError && jobs.length === 0;

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
        // Inline layout matching the second picture style
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-14 py-24 text-center flex flex-col items-center justify-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl">
            ⚠️
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Conexiune eșuată
          </h2>
          <p className="text-slate-600 max-w-md text-base leading-relaxed">
            Nu se poate încărca pagina următoare în modul offline. Puteți reveni
            la pagina anterioară sau continuați cu rezultatele deja încărcate.
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
            shouldShowNoResults && <NoResults />
          )}
        </>
      )}

      {!loading && jobs.length > 0 && !networkError && (
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
