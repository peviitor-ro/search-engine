import { useContext, useState, useEffect, useRef, useCallback } from "react";
// svg
import loadingIcon from "../assets/svg/loading.svg";
// components
import Job from "./Job";
import NoResults from "./NoResults";
import Button from "@/components/ui/button";
// icons
import scrollUp from "../assets/svg/scroll-up.svg";
// context
import TagsContext from "../context/TagsContext";
// redux
import { useSelector, useDispatch } from "react-redux";
import { setJobs } from "../reducers/jobsSlice";
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
  const loading = useSelector((state) => state.jobs.loading);
  //state
  const [isVisible, setIsVisible] = useState(false);

  // loading state for infinite scroll
  const [loadingMore, setLoadingMore] = useState(false);
  const observerTarget = useRef(null);

  const fetchMoreData = useCallback(async () => {
    if (loadingMore) return;
    const pageVal = findParamInURL("page");
    const pageUrl = pageVal ? Number(pageVal[0] || pageVal) : 1;
    setLoadingMore(true);

    const nextPage = pageUrl + 1;
    const { jobs: nextJobs } = await getData(
      createSearchString(q, city, county, company, workmode, nextPage)
    ).catch(() => ({ jobs: [] }));

    setLoadingMore(false);
    dispatch(setJobs(nextJobs));
    updateUrlParams({ page: nextPage });
  }, [q, city, county, company, workmode, loadingMore, dispatch]);

  // Infinite scroll logic
  useEffect(() => {
    if (jobs.length >= total || total === 0) return;

    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          fetchMoreData();
        }
      },
      { threshold: 0.1 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [jobs, total, loadingMore, fetchMoreData]);

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

      {jobs.length < total && (
        <div
          ref={observerTarget}
          className="flex justify-center items-center mx-auto my-12 w-fit p-3.5 rounded-full bg-background_green cursor-wait"
        >
          <img
            src={loadingIcon}
            alt="loading icon"
            className="w-6 m-auto animate-spin"
          />
        </div>
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
