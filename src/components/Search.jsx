// svg
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
import logo from "../assets/svg/logo.svg";
// scss
import "../scss/search.scss";

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
  setNumberOfJobs,
  setNumberOfCompany,
  setLoading
} from "../reducers/jobsSlice";
// utils fetch functions
import { createSearchString } from "../utils/createSearchString";
// functions to fetch the data
import {
  getData,
  getNumberOfJobs,
  getNumberOfCompany
} from "../utils/fetchData";

const Fetch = () => {
  const { q, city, remote, county, country, company, removeTag, contextSetQ } =
    useContext(TagsContext);
  // fields
  const [text, setText] = useState("");

  // State to track if the form has been submitted
  const [formSubmitted, setFormSubmitted] = useState(false);

  // dispatch
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  // useEffect for localStorage
  useEffect(() => {
    localStorage.setItem("q", JSON.stringify(q));
    localStorage.setItem("city", JSON.stringify(city));
    localStorage.setItem("remote", JSON.stringify(remote));
    localStorage.setItem("company", JSON.stringify(company));
  }, [q, city, remote, company]);

  // useEffect to load the number of company and jobs
  useEffect(() => {
    const numbersInfo = async () => {
      const jobsNumber = await getNumberOfJobs();
      const companyNumber = await getNumberOfCompany();
      dispatch(setNumberOfJobs(jobsNumber));
      dispatch(setNumberOfCompany(companyNumber));
    };
    numbersInfo();
  }, [dispatch]);

  // useEffect to navigate when form is submitted or when handleUpdateQ is executed
  useEffect(() => {
    // Check if the form has been submitted or handleUpdateQ has been executed
    if (formSubmitted) {
      // Check if the search text is not empty before navigating
      if (text.trim() !== "") {
        navigate("/rezultate"); // Navigate to "/rezultate" if the search text is not empty
      }
      // Reset the formSubmitted state after navigation
      setFormSubmitted(false);
    }
  }, [formSubmitted, text, navigate]);

  // Function to handle form submission
  const handleSubmitForm = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    // Call handleUpdateQ to update the search query
    await handleUpdateQ();
    // Set formSubmitted state to true to trigger navigation in useEffect
    setFormSubmitted(true);
  };

  // Send text from input into state q.
  const handleUpdateQ = async () => {
    await contextSetQ([text]);
    if (location.pathname !== "/rezultate") {
      navigate("/rezultate"); // Use navigate to redirect to "/rezult"
    }
  };
  // fetch data when states changes values
  // this make the fetch automated when checkboxes are checked or unchec
  useEffect(() => {
    if (
      q.length === 0 &&
      city.length === 0 &&
      remote.length === 0 &&
      company.length === 0
    ) {
      dispatch(clearJobs());
      dispatch(setTotal(0));
    } else {
      // fetch the data when the stats isn't empty.
      const handleFetchData = async () => {
        // send in props the values from state to create the String for fetch.
        const { jobs, total } = await getData(
          createSearchString(q, city, county, country, company, remote, 1)
        );
        dispatch(clearJobs());
        dispatch(setJobs(jobs));
        dispatch(setTotal(total));
      };
      handleFetchData();
      dispatch(setLoading());
    }
  }, [removeTag, dispatch, q, city, remote, company, country, county]);
  // remove text from input on X button.
  function handleClearX() {
    setText("");
  }
  return (
    <div>
      <div className="input-container">
        {location.pathname === "/rezultate" && (
          <a href="/" className="logo">
            <img src={logo} alt="peviitor" />
          </a>
        )}
        <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
        <form onSubmit={handleSubmitForm}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ce doriți să lucrați?"
          />
          {text.length !== 0 ? (
            <span className="clear" onClick={handleClearX}>
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
          <button type="submit">Caută</button>
        </form>
      </div>
      {location.pathname === "/rezultate" && ( // Conditionally render the checkboxes
        <>
          <FiltreGrup />
        </>
      )}
    </div>
  );
};
export default Fetch;
