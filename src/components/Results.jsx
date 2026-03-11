import { useContext, useState, useEffect } from "react";
// svg
import loadingIcon from "../assets/svg/loading.svg";
// components
import Job from "./Job";
import NoResults from "./NoResults";
import Button from "./Button";
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
import JobSkeleton from "./JobSkeleton";
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

  // loading state for "Incarca mai multe" button
  const [loadingMore, setLoadingMore] = useState(false);

  // fetch more data changing the page value
  async function fetchMoreData() {
    const pageUrl = Number(findParamInURL("page"));
    setLoadingMore(true);
    const nextPage = pageUrl + 1;
    const { jobs } = await getData(
      createSearchString(q, city, county, company, workmode, nextPage)
    ).catch(() => ({ jobs: [] }));
    setLoadingMore(false);
    dispatch(setJobs(jobs));
    updateUrlParams({ page: nextPage });
  }

  // scrollUp Button
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
        <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-14 pb-12">
          {Array.from({ length: 6 }).map((_, idx) => (
            <JobSkeleton key={idx} />
          ))}
        </section>
      ) : (
        <>
          {jobs.length > 0 ? (
            <section className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 md:px-14 pb-12">
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
                    tags
                  },
                  idx
                ) => (
                  <Job
                    key={idx}
                    location={location}
                    company={company}
                    county={county}
                    url={url}
                    title={handleStringDecode(title)}
                    workmode={jobWorkmode}
                    salary={salary}
                    tags={tags}
                  />
                )
              )}
            </section>
          ) : (
            <NoResults />
          )}
        </>
      )}

      {loadingMore ? (
        <div className="flex justify-center items-center mx-auto my-12 w-fit p-3.5 rounded-full bg-background_green cursor-wait">
          <img
            src={loadingIcon}
            alt="loading icon"
            className="w-6 m-auto animate-spin"
          />
        </div>
      ) : (
        <>
          {total <= 10 ||
            (jobs.length === total ? null : (
              <Button buttonType="loadMore" onClick={fetchMoreData}>
                Încarcă mai multe
              </Button>
            ))}
        </>
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
