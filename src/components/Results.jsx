import { useContext, useState, useEffect, useCallback } from "react";
// components
import Job from "./Job";
import NoResults from "./NoResults";
import Button from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
// icons
// context
import TagsContext from "../context/TagsContext";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setNetworkError } from "../reducers/jobsSlice";
// function to create the string
import { createSearchString } from "../utils/createSearchString";
// central data fetching manager
import { fetchAndHandleJobs } from "../utils/fetchData";
import JobSkeleton from "@/components/ui/job-skeleton";
import { findParamInURL } from "../utils/urlManipulation";
import { AlertTriangle, ArrowLeft, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Results = () => {
  // redux
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // context
  const {
    q,
    city,
    remote: workmode,
    county,
    company
  } = useContext(TagsContext);
  // jobs slice state
  const jobs = useSelector((state) => state.jobs.jobs);
  const total = useSelector((state) => state.jobs.total);
  const page = useSelector((state) => state.jobs.page);
  const pageSize = useSelector((state) => state.jobs.pageSize);
  const loading = useSelector((state) => state.jobs.loading);
  const networkError = useSelector((state) => state.jobs.networkError);

  // local UI state
  const [isVisible, setIsVisible] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Centralized page switching using fetchAndHandleJobs
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

      const targetQueryKey = createSearchString(
        q,
        city,
        county,
        company,
        workmode,
        nextPage
      );

      try {
        await fetchAndHandleJobs(targetQueryKey, nextPage, dispatch);
        if (!syncUrl) {
          // URL syncing logic handled internally by fetchAndHandleJobs
        }
      } catch (error) {
        console.error("Pagination fetch error:", error);
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
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-14 py-24 text-center flex flex-col items-center justify-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Conexiune eșuată
          </h2>
          <p className="text-slate-600 max-w-md text-base leading-relaxed">
            Nu se poate încărca pagina următoare în modul offline. Puteți reveni
            la pagina anterioară sau continuați cu rezultatele deja încărcate.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-background_green px-6 py-3 font-medium text-white transition hover:shadow-button_shadow"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Înapoi
            </button>
            {jobs.length > 0 && (
              <button
                type="button"
                onClick={() => dispatch(setNetworkError(false))}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-background_green px-6 py-3 font-medium text-background_green transition hover:bg-background_green/10"
              >
                Continuă cu rezultatele
              </button>
            )}
          </div>
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
        <ArrowUp aria-label="Derulează în sus" />
      </Button>
    </div>
  );
};

export default Results;