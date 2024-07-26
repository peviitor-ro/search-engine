import { useContext, useState, useEffect } from "react";
// scss
import "../scss/rezults.scss";
// svg
import removeIcon from "../assets/svg/remove.svg";
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

function tagMapper([key, currentArray]) {
  return currentArray.map((item) => (
    <div key={item} className="tags">
      <h3>{item}</h3>
      {/* Call removeTag with the specific type and value */}
      <button onClick={() => this.removeTag(key, item)}>
        <img src={removeIcon} alt="x" />
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
  const [page, setPage] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  // fetch more data changing the page value
  async function fetchMoreData() {
    const nextPage = page + 1;
    const { jobs } = await getData(
      createSearchString(q, city, county, company, remote, nextPage)
    ).catch(() => ({ jobs: [] }));
    dispatch(setJobs(jobs));
    setPage(nextPage);
  }

  // scrollUp Button

  useEffect(() => {
    const checkScrollHeight = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", checkScrollHeight);

    return () => window.removeEventListener("scroll", checkScrollHeight);
  }, []);

  return (
    <div className="rezults-container">
      {loading && (
        <h3 className="total-rezultate">
          {total} {total !== 0 ? "de" : ""} rezultate
        </h3>
      )}
      {!deletAll && (
        <div className="taguri-container">
          {Object.entries(fields).map(tagMapper.bind({ removeTag }))}
          {!deletAll && (
            <button className="remove-all" onClick={handleRemoveAllFilters}>
              Sterge filtre
            </button>
          )}
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="cards-containter">
          {jobs.map(
            (
              {logoUrl, city, company, county, job_link, job_title, remote },
              idx
            ) => (
              <Job
                key={idx}
                logoUrl={logoUrl}
                city={city}
                company={company}
                county={county}
                job_link={job_link}
                job_title={job_title}
                remote={remote}
              />
            )
          )}
        </div>
      ) : (
        <FaraRezultate />
      )}
      {total <= 10 ||
        (jobs.length === total ? null : (
          <button className="load-more" onClick={fetchMoreData}>
            Incarca mai multe
          </button>
        ))}

      <button
        className={`scrol-up ${isVisible && "is-visible"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <img src={scrollUp} alt="scroll-up" />
      </button>
    </div>
  );
};
export default Results;
