// svg
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
import logo from "../assets/svg/logo.svg";
import removeIcon from "../assets/svg/remove.svg";

import { useEffect, useState, useContext } from "react";
import TagsContext from "../context/TagsContext";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
// components
import FiltreGrup from "./FiltreGrup";
// redux
import { useSelector, useDispatch } from "react-redux";
// functions to update the jobSlice state.
import {
  setJobs,
  clearJobs,
  setTotal,
  setNumberOfCompany,
  setLoading
} from "../reducers/jobsSlice";
// utils fetch functions
import { createSearchString } from "../utils/createSearchString";
// functions to fetch the data
import { getData, getNumberOfCompany } from "../utils/fetchData";
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

const Fetch = (props) => {
  const { inputWidth } = props;

  const {
    q,
    city,
    remote,
    county,
    company,
    removeTag,
    contextSetQ,
    deletAll,
    handleRemoveAllFilters,
    fields
  } = useContext(TagsContext);
  // fields
  const [text, setText] = useState("");

  // dispatch
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  // jobs
  const total = useSelector((state) => state.jobs.total);
  const loading = useSelector((state) => state.jobs.loading);
  const nrJoburi =
    total >= 20 ? "de rezultate" : total === 1 ? "rezultat" : "rezultate";

  // useEffect to set the search input field as the user search querry
  useEffect(() => {
    if (location.pathname === "/rezultate") {
      setText(q + "");
    }
  }, [location.pathname, q]);

  useEffect(() => {
    if (!location.pathname.includes("/rezultate")) {
      return;
    }
    //Keeping the state in sync with the URL param
    const qParam = findParamInURL("q");
    contextSetQ(qParam || [""]);
  }, [contextSetQ, location.pathname, location.search]);

  // useEffect to load the number of company and jobs
  useEffect(() => {
    const numbersInfo = async () => {
      const companyNumber = await getNumberOfCompany();
      dispatch(setNumberOfCompany(companyNumber));
    };
    numbersInfo();
  }, [dispatch]);

  // Send text from input into state q.
  const handleUpdateQ = async (e) => {
    e.preventDefault();
    if (location.pathname !== "/rezultate") {
      navigate("/rezultate"); // Use navigate to redirect to "/rezult"
    }
    contextSetQ([text]);
  };
  // fetch data when states changes values
  // this make the fetch automated when checkboxes are checked or unchec
  useEffect(() => {
    // Function to fetch data and update state
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        // Create the search string
        const searchString = createSearchString(
          q,
          city,
          county,
          company,
          remote,
          1
        );

        // Fetch the data
        const { jobs, total } = await getData(searchString);

        // Update the Redux state
        dispatch(clearJobs());
        dispatch(setJobs(jobs));
        dispatch(setTotal(total));
        updateUrlParams({ page: 1 });
      } catch (error) {
        // Handle any errors that occur during fetch
        console.error("Failed to fetch data:", error);
      } finally {
        // Ensure loading is set to false after data is fetched or an error occurs
        dispatch(setLoading(false));
      }
    };

    // Only fetch data if any of the query parameters are set
    if (
      q.length !== 0 ||
      city.length !== 0 ||
      remote.length !== 0 ||
      company.length !== 0
    ) {
      fetchData();
    } else {
      // Clear jobs and total if no query parameters are set
      dispatch(clearJobs());
      dispatch(setTotal(0));
    }
  }, [dispatch, q, city, remote, company, county, removeTag]);
  // remove text from input on X button.
  function handleClearX() {
    setText("");
    updateUrlParams({ q: null });
  }

  // Aligning the h2 with the first card
  const [h2Width, setH2Width] = useState("auto");
  const calculateH2Width = () => {
    const screenWidth = window.innerWidth;
    const gap = 28;
    let cardWidth;
    const breakpoint = 1024;

    cardWidth = screenWidth > breakpoint ? 384 : 300;

    screenWidth >= 740 && screenWidth <= 767
      ? setH2Width(300)
      : setH2Width(
          (Math.floor((screenWidth - gap * 4 - cardWidth) / (cardWidth + gap)) + 1) * cardWidth +
          (Math.floor((screenWidth - gap * 4 - cardWidth) / (cardWidth + gap)) + 1 - 1) * gap);
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
      <div
        className="flex flex-col md:flex-row items-center justify-center pt-5 gap-2 mx-auto"
        style={{ width: h2Width }}
      >
        {location.pathname === "/rezultate" && (
          <a href="/" className="logo">
            <img src={logo} alt="peviitor" style={{ maxWidth: "none" }} />
          </a>
        )}
        <form
          onSubmit={handleUpdateQ}
          className="flex flex-col items-center md:flex-row relative gap-2"
        >
          <img
            src={magnifyGlass}
            alt="magnify-glass"
            className="absolute top-4 left-4"
          />
          <input
            type="text"
            value={text}
            style={{ width: inputWidth }}
            onChange={(e) => setText(e.target.value)}
            placeholder="Caută un loc de muncă"
            className="pl-12 w-[290px] h-[54px] mb-3 md:mb-0 border rounded-full border-border_grey outline-none "
          />
          {text.length !== 0 ? (
            <span
              className="absolute right-5 md:right-[148px] top-5 cursor-pointer"
              onClick={handleClearX}
            >
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="15px"
                height="15px"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </span>
          ) : (
            ""
          )}
          <button
            type="submit"
            className="m-auto bg-background_green text-white w-[122px] h-[54px]  text-base px-10 py-3 rounded-full transition duration-300 ease-out hover:shadow-button_shadow focus:outline-none"
          >
            Caută
          </button>
        </form>
      </div>
      {location.pathname === "/rezultate" && ( // Conditionally render the checkboxes
        <>
          <FiltreGrup />
        </>
      )}

      {loading ? (
        <div className="h-[20px] w-[50%] md:w-[16%] mx-auto my-8 md:mx-0 bg-gray-300 animate-pulse rounded-md"></div>
      ) : (
        total > 0 && (
          <h2
            className="text-center text-start text-text_grey_darker my-8 text-lg"
            style={{ width: h2Width, margin: "32px auto" }}
          >
            {total} {nrJoburi}
          </h2>
        )
      )}

      {!deletAll && (
        <div
          className="pb-9 flex gap-2 flex-wrap"
          style={{ width: h2Width, margin: "0 auto" }}
        >
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
    </div>
  );
};
export default Fetch;
