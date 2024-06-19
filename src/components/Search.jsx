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
  setNumberOfCompany,
  setLoading
} from "../reducers/jobsSlice";
// utils fetch functions
import { createSearchString } from "../utils/createSearchString";
// functions to fetch the data
import { getData, getNumberOfCompany } from "../utils/fetchData";

const Fetch = () => {
  const { q, city, remote, county, company, removeTag, contextSetQ } =
    useContext(TagsContext);
  // fields
  const [text, setText] = useState("");

  // dispatch
  const navigate = useNavigate(); // Get the navigate function
  const location = useLocation(); // Get the current location
  const dispatch = useDispatch();

  // useEffect to set the search input field as the user search querry
  useEffect(() => {
    if (location.pathname === "/rezultate") {
      setText(q + "");
    }
  }, [location.pathname, q]);

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
      const companyNumber = await getNumberOfCompany();
      dispatch(setNumberOfCompany(companyNumber));
    };
    numbersInfo();
  }, [dispatch]);

  // Send text from input into state q.
  const handleUpdateQ = async (e) => {
    e.preventDefault();
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
          createSearchString(q, city, county, company, remote, 1)
        );
        dispatch(clearJobs());
        dispatch(setJobs(jobs));
        dispatch(setTotal(total));
      };
      handleFetchData();
      dispatch(setLoading());
    }
  }, [removeTag, dispatch, q, city, remote, company, county]);
  // remove text from input on X button.
  function handleClearX() {
    setText("");
  }
  return (
    <>
      <div className="input-container">
        {location.pathname === "/rezultate" && (
          <a href="/" className="logo">
            <img src={logo} alt="peviitor" />
          </a>
        )}
        <form onSubmit={handleUpdateQ}>
          <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Caută un loc de muncă"
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
    </>
  );
};
export default Fetch;
