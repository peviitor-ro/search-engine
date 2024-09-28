import { ReactComponent as LupeIcon } from "../assets/svg/lupe.svg";
import { ReactComponent as XIcon } from "../assets/svg/x.svg";
import { ReactComponent as MapPinIcon } from "../assets/svg/map_pin.svg";
import { orase } from "../utils/getCityName";

// svg
/* import magnifyGlass from "../assets/svg/magniy_glass_icon.svg"; */
import logo from "../assets/svg/logo.svg";

import { useEffect, useState, useContext } from "react";
import TagsContext from "../context/TagsContext";
import { useNavigate, useLocation } from "react-router-dom"; // Import useNavigate and useLocation
// components
import FiltreGrup from "./FiltreGrup";
// redux
import { useDispatch } from "react-redux";
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

const Fetch = () => {
  const { q, city, remote, county, company, removeTag, contextSetQ } =
    useContext(TagsContext);
  // fields
  const [text, setText] = useState("");

  // dispatch
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  //new
  const [jobTitle, setJobTitle] = useState("");
  const [locationn, setLocation] = useState("");

  /* const [locationTest, setLocationSuggestions] = useState([]); */

  const [focusedInput, setFocusedInput] = useState(null);

  const handleClearJobTitle = () => setJobTitle("");
  const handleClearLocation = () => setLocation("");

  /* const handleFocus = (input) => setFocusedInput(input);
  const handleBlur = () => setFocusedInput(null); // Optional, depending on whether you want to hide the dropdown when blurred
 */
  const jobSuggestions = [
    "Relatii clineti",
    "Mecanic Auto",
    "Web Developer (somer)",
    "Back-end Developer PHP",
    "Relatii clineti",
    "Mecanic Auto",
    "Web Developer (somer)",
    "Back-end Developer PHP",
    "Relatii clineti",
    "Mecanic Auto",
    "Web Developer (somer)",
    "Back-end Developer PHP",
    "Relatii clineti",
    "Mecanic Auto",
    "Web Developer (somer)",
    "Back-end Developer PHP"
  ];
  //new

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

  return (
    <>
      <div className="m-10 p-10">
        <div className="flex items-center relative flex-col gap-2 lg:gap-0 lg:flex-row lg:h-[50px] ">
          {location.pathname === "/rezultate" && (
            <a href="/" className="logo mr-2">
              <img src={logo} alt="peviitor" />
            </a>
          )}
          <form
            onSubmit={handleUpdateQ}
            className="flex flex-col items-center justify-between md:flex-row relative "
          >
            <div className="flex items-center justify-between relative lg:w-[522px]">
              {/* Job Title Input */}
              <div
                className={`flex items-center relative w-full border border-[#89969C] rounded-lg lg:border-r-0 lg:rounded-tl-lg lg:rounded-tr-none lg:rounded-br-none divider ${
                  focusedInput === "jobTitle"
                    ? "lg:border-b-[#eeeeee] lg:rounded-bl-none"
                    : ""
                }`}
              >
                <LupeIcon className="w-5 h-5 text-gray-500 ml-3" />
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  /* We need to remove this 2 lines until we have the filter on the side like in v4.0 */

                  /* onFocus={() => handleFocus("jobTitle")}
                  onBlur={handleBlur} */

                  /* until here */
                  placeholder="Cauta un loc de munca"
                  className="w-full py-2 px-2 pl-10 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
                {text && (
                  <XIcon
                    className="w-4 h-4 text-gray-700 mr-3 cursor-pointer"
                    onClick={handleClearX}
                  />
                )}
              </div>

              {/* Dropdown for Job Title */}
              {focusedInput === "jobTitle" && (
                <ul className="hidden lg:block lg:absolute lg:left-0 lg:w-full lg:border lg:border-t-0 border-[#89969C] lg:rounded-lg lg:rounded-t-none lg:pt-2 lg:mt-4 lg:max-h-48 lg:overflow-y-scroll custom-scrollbar lg:bottom-0 lg:transform lg:translate-y-full lg:box-border">
                  {jobSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-12 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => setJobTitle(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Location Input */}
            <div className="flex items-center justify-between relative lg:w-[325px]">
              <div
                className={`flex items-center relative w-full border border-[#89969C] rounded-lg lg:border-l-0 lg:rounded-tl-none lg:rounded-bl-none lg:rounded-tr-lg ${
                  focusedInput === "location"
                    ? "lg:border-b-[#eeeeee] lg:rounded-br-none"
                    : ""
                }`}
              >
                <MapPinIcon className="w-7 h-7 text-gray-500 ml-3" />
                <input
                  type="text"
                  value={locationn}
                  onChange={(e) => setLocation(e.target.value)}
                  /* We need to remove this 2 lines until we have the filter on the side like in v4.0 */

                  /* onFocus={() => handleFocus("location")}
                  onBlur={handleBlur} */

                  /* until here */
                  placeholder="Adauga o locatie"
                  className="w-full py-2 px-4 pl-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
                />
                {locationn && (
                  <XIcon
                    className="w-7 h-7 text-gray-500 mr-3 cursor-pointer"
                    onClick={handleClearLocation}
                  />
                )}
                <button
                  type="submit"
                  className="m-1 bg-[#E08D22] text-white w-[122px] h-[30px] text-base px-10 rounded-md transition duration-300 ease-out hover:shadow-button_shadow focus:outline-none"
                >
                  Caută
                </button>
              </div>

              {/* Dropdown for Location */}
              {focusedInput === "location" && (
                <ul className="hidden lg:block lg:absolute lg:left-0 lg:w-full lg:border lg:border-t-0 lg:border-[#89969C] lg:rounded-lg lg:rounded-t-none lg:pt-2 lg:mt-4 lg:max-h-48 lg:overflow-y-scroll custom-scrollbar lg:bottom-0 lg:transform lg:translate-y-full lg:box-border">
                  {orase.map((suggestion, index) => (
                    <li
                      key={index}
                      className="px-12 py-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => setLocation(suggestion)}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        </div>
        {location.pathname === "/rezultate" && ( // Conditionally render the checkboxes
          <>
            <FiltreGrup />
          </>
        )}
      </div>
    </>
  );
};
export default Fetch;
