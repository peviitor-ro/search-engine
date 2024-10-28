import { useContext, useState, useEffect } from "react";
// svg
import removeIcon from "../assets/svg/remove.svg";
import loadingIcon from "../assets/svg/loading.svg";
// components
import Job from "./Job";
import FaraRezultate from "./FaraRezultate";
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

function tagMapper([key, currentArray]) {
  return currentArray.map((item) => (
    <div
      key={item}
      className="py-2 px-4 bg-background_green_light rounded-3xl flex items-center"
    >
      <h3>{item}</h3>
      {/* Call removeTag with the specific type and value */}
      <button onClick={() => this.removeTag(key, item)}>
        <img src={removeIcon} alt="x" className="cursor-pointer ml-2" />
      </button>
    </div>
  ));
}

const Results = () => {
  // redux
  const dispatch = useDispatch();
  // context
  const {
    q,
    city,
    remote,
    county,
    company,
    fields,
    removeTag,
    deletAll,
    handleRemoveAllFilters
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
      createSearchString(q, city, county, company, remote, nextPage)
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

  const nrJoburi =
    total >= 20 ? "de rezultate" : total === 1 ? "rezultat" : "rezultate";

  // Aligning the h2 with the first card
  const [h2Width, setH2Width] = useState("auto");
  const calculateH2Width = () => {
    const screenWidth = window.innerWidth;
    const gap = 28;
    let cardWidth;
    const breakpoint = 1024;

    if (screenWidth > breakpoint) {
      cardWidth = 384;
    } else {
      cardWidth = 300;
    }

    // Avoid setting the width for h2 between 741px and 767px to prevent alignment issues
    if (screenWidth >= 741 && screenWidth <= 767) {
      setH2Width("auto");
    } else {
      const cardsNo =
        Math.floor((screenWidth - gap * 4 - cardWidth) / (cardWidth + gap)) + 1;
      const totalCardsWidth = cardsNo * cardWidth + (cardsNo - 1) * gap;
      setH2Width(totalCardsWidth);
    }
  };

  useEffect(() => {
    calculateH2Width();
    window.addEventListener("resize", calculateH2Width);
    return () => {
      window.removeEventListener("resize", calculateH2Width);
    };
  }, []);

  return (
    <div>
      {loading ? (
        <div className="h-[20px] w-[50%] md:w-[16%] mx-auto my-8 md:mx-0 bg-gray-300 animate-pulse rounded-md"></div>
      ) : (
        total > 0 && (
        <h2
          className="text-center md:text-start text-text_grey_darker my-8 text-lg"
          style={{ width: h2Width, margin: "32px auto" }}
        >
          {total} {nrJoburi}
        </h2>)
      )}

      {!deletAll && (
        <div className="pb-9 flex gap-2 flex-wrap justify-center lg:justify-start"
        style={{ width: h2Width, margin: "0 auto" }}>
          {Object.entries(fields).map(tagMapper.bind({ removeTag }))}
          {!deletAll && (
            <div className="flex gap-2 ml-4">
              <hr className="h-auto w-[1px] bg-black" />
              <button
                className="self-center cursor-pointer"
                onClick={handleRemoveAllFilters}
              >
                Șterge filtre
              </button>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7 w-fit mx-auto">
          {Array.from({ length: 6 }).map((_, idx) => (
            <JobSkeleton key={idx} />
          ))}
        </section>
      ) : (
        <>
          {jobs.length > 0 ? (
            <section className="grid gap-7 px-14 w-full mx-auto md:grid-cols-2 lg:flex lg:flex-wrap lg:justify-center">
              {jobs.map(
                (
                  { city, company, county, job_link, job_title, remote },
                  idx
                ) => (
                  <Job
                    key={idx}
                    city={city}
                    company={company}
                    county={county}
                    job_link={job_link}
                    job_title={job_title}
                    remote={remote}
                  />
                )
              )}
            </section>
          ) : (
            <FaraRezultate />
          )}
        </>
      )}

      {loadingMore ? (
        <div className="flex justify-center items-center  mx-auto my-12 w-fit  p-3.5 rounded-full bg-background_green  cursor-wait">
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
              <button
                className="flex justify-center items-center px-8 py-3 rounded-full  bg-background_green text-white font-medium text-lg leading-6 hover:shadow-button_shadow cursor-pointer mx-auto my-12"
                onClick={fetchMoreData}
              >
                Încarcă mai multe
              </button>
            ))}
        </>
      )}

      <button
        className={`fixed bottom-12 right-[-40px] md:right-2.5 transition-opacity ease-in-out duration-300 pointer-events-none opacity-0 ${
          isVisible && "opacity-100 pointer-events-auto"
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src={scrollUp} alt="scroll-up" />
      </button>
    </div>
  );
};
export default Results;
