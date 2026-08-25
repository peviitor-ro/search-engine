import logo from "../assets/svg/logo.svg";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import TagsContext from "../context/TagsContext";
import { useNavigate, useLocation } from "react-router-dom";
import FlagMagnifyGlass from "../assets/svg/ro_flag_magnifying_glass.svg?react";
import CloseIcon from "../assets/svg/close_icon.svg?react";
import MapPinIcon from "../assets/svg/map_pin.svg?react";
import { X } from "lucide-react";

import { orase } from "../utils/getCityName";
import { comune } from "../utils/getCommuneName";
import getCityMatch from "../utils/getCityMatch";
import getCommuneMatch from "../utils/getCommuneMatch";
import { createSearchString } from "../utils/createSearchString";
import { findParamInURL, updateUrlParams } from "../utils/urlManipulation";

// Components
import FiltreGrup from "./FiltreGrup";
import Button from "@/components/ui/button";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  setJobs,
  clearJobs,
  setTotal,
  setPage,
  setPageSize,
  setNumberOfCompany,
  setLoading
} from "../reducers/jobsSlice";

// Data Fetching
import {
  getData,
  getNumberOfCompany,
  getJobSuggestion,
  getNumberOfJobs
} from "../utils/fetchData";

const FilterTags = ({ tags, removeTag }) => {
  const translateWorkmode = {
    "on-site": "Fizic",
    hybrid: "Hibrid",
    remote: "La distanță"
  };

  const getDisplayText = (key, item) => {
    if (key === "remote" || key === "workmode") {
      const normalizedItem = String(item).toLowerCase();
      return translateWorkmode[normalizedItem] || item;
    }
    return item;
  };

  return Object.entries(tags).flatMap(([key, currentArray]) =>
    currentArray.map((item) => (
      <Button
        key={`${key}-${item}`}
        buttonType="addFilters"
        onClick={() => removeTag(key, item)}
        aria-label={`Elimină filtrul ${getDisplayText(key, item)}`}
      >
        {getDisplayText(key, item)}
        <span className="flex h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:bg-background_green/25">
          <X className="w-3 h-3" />
        </span>
      </Button>
    ))
  );
};

const Search = () => {
  const {
    q,
    city,
    remote,
    county,
    company,
    removeTag,
    deleteAll,
    handleRemoveAllFilters,
    contextSetQ,
    contextSetCity,
    contextSetCounty,
    contextSetCompany,
    contextSetRemote,
    fields
  } = useContext(TagsContext);

  const [text, setText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const total = useSelector((state) => state.jobs.total);
  const [globalJobsTotal, setGlobalJobsTotal] = useState(0);
  const loading = useSelector((state) => state.jobs.loading);

  const nrJoburi =
    total >= 20 ? "de rezultate" : total === 1 ? "rezultat" : "rezultate";

  const romanianSorting = new Intl.Collator("ro", {
    sensitivity: "accent",
    numeric: true
  });

  orase.sort(romanianSorting.compare);

  const [isLocation, setLocation] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [filteredCities, setFilteredCities] = useState(orase);
  const [filteredCommunes, setFilteredCommunes] = useState(comune);
  const [jobSuggestions, setJobSuggestions] = useState([]);

fix/company-filter-url-sync
  // Wrapper ref catches clicks outside of BOTH inputs & dropdowns
  const containerRef = useRef(null);
  const prevSearchKey = useRef(null);

  const handleClearLocation = () => setLocation("");
  const handleFocus = (input) => setFocusedInput(input);
=======
  useEffect(() => {
    if (location.pathname !== "/rezultate") return;

    const fetchGlobalTotal = async () => {
      try {
        const response = await getNumberOfJobs();
        setGlobalJobsTotal(response?.total?.jobs || 0);
      } catch (error) {
        console.error("Error fetching global job count:", error);
      }
    };
    fetchGlobalTotal();
  }, [location.pathname]);
 main

  useEffect(() => {
    if (location.pathname === "/rezultate") {
      setText(q + "");
    }
  }, [location.pathname, q]);

 fix/company-filter-url-sync
  // Sync URL Params with Context
  useEffect(() => {
    if (!location.pathname.includes("/rezultate")) return;

    const qParam = findParamInURL("q");
    const cityParam = findParamInURL("orase");
    const countyParam = findParamInURL("judete");
    const companyParam = findParamInURL("company");
    const remoteParam = findParamInURL("remote");

    contextSetQ(qParam || [""]);
    contextSetCity(cityParam || [""]);
    if (contextSetCounty) contextSetCounty(countyParam || [""]);
    if (contextSetCompany) contextSetCompany(companyParam || [""]);
    if (contextSetRemote) contextSetRemote(remoteParam || [""]);
  }, [
    contextSetQ,
    contextSetCity,
    contextSetCounty,
    contextSetCompany,
    contextSetRemote,
    location.pathname,
    location.search
  ]);

  // Fetch initial company and total job metrics



 main
  useEffect(() => {
    if (!location.pathname.includes("/rezultate")) return;

    const numbersInfo = async () => {
      const companyNumber = await getNumberOfCompany();
      dispatch(setNumberOfCompany(companyNumber));

      if (typeof getNumberOfJobs === "function") {
        const jobsCount = await getNumberOfJobs();
        setGlobalJobsTotal(jobsCount || 0);
      }
    };
    numbersInfo();
  }, [dispatch, location.pathname]);

  const handleUpdateQ = async (e) => {
  e.preventDefault();
  contextSetQ([text]);

  let targetCity = city;
  if (isLocation.trim() !== "") {
    targetCity = [isLocation];
    contextSetCity(targetCity);
  }

  const params = new URLSearchParams();
  if (text) params.set("q", text);

  const appendParam = (paramName, arrayData) => {
    if (Array.isArray(arrayData)) {
      const validItems = arrayData.filter(Boolean);
      if (validItems.length > 0) {
        params.set(paramName, validItems.join(","));
      }
    }
  };

  appendParam("orase", targetCity);
  appendParam("judete", county);
  appendParam("company", company);
  appendParam("remote", remote);

 fix/company-filter-url-sync
    navigate(`/rezultate?${params.toString()}`);
  };

// Inside Search.jsx -> useEffect for fetchData
useEffect(() => {
  const fetchData = async () => {
    try {
      dispatch(setLoading(true));

      const searchKey = [q, city, county, company, remote]
        .map((value) =>
          Array.isArray(value) ? value.join("|") : String(value)
        )
        .join("::");

      const isFilterChange =
        prevSearchKey.current !== null && prevSearchKey.current !== searchKey;
      prevSearchKey.current = searchKey;

      let targetPage = 1;
      if (!isFilterChange) {
        const pageVal = findParamInURL("page");
        targetPage = pageVal
          ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1
          : 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        const pageVal = findParamInURL("page");
        const targetPage = pageVal
          ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1
          : 1;

        const searchKey = [q, city, county, company, remote]
          .map((value) =>
            Array.isArray(value) ? value.join("|") : String(value)
          )
          .join("::") + `::page=${targetPage}`;

        if (prevSearchKey.current === searchKey) {
          return;
        }
        prevSearchKey.current = searchKey;

        const searchString = createSearchString(
          q,
          city,
          county,
          company,
          remote,
          targetPage
        );

        const { jobs, total } = await getData(searchString);

        dispatch(setJobs(jobs));
        dispatch(setTotal(total));
        dispatch(setPage(targetPage));
        if (jobs.length > 0) dispatch(setPageSize(jobs.length));
        updateUrlParams({ page: targetPage });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        dispatch(setLoading(false));
 main
      }

 fix/company-filter-url-sync
      const searchString = createSearchString(
        q,
        city,
        county,
        company,
        remote,
        targetPage
      );

      const { jobs, total } = await getData(searchString);

      dispatch(setJobs(jobs));
      dispatch(setTotal(total));
      dispatch(setPage(targetPage));
      if (jobs.length > 0) dispatch(setPageSize(jobs.length));

      // ONLY update page parameter if it's explicitly set or changed
      if (findParamInURL("page") !== String(targetPage)) {
        updateUrlParams({ page: targetPage });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  if (
    q.length !== 0 ||
    city.length !== 0 ||
    remote.length !== 0 ||
    company.length !== 0 ||
    county.length !== 0
  ) {
    fetchData();
  } else {
    dispatch(clearJobs());
    dispatch(setTotal(0));
    dispatch(setPage(1));
  }
}, [dispatch, q, city, remote, company, county]);

    if (
      location.pathname === "/rezultate" ||
      q.length !== 0 ||
      city.length !== 0 ||
      remote.length !== 0 ||
      company.length !== 0
    ) {
      fetchData();
    } else {
      dispatch(clearJobs());
      dispatch(setTotal(0));
      dispatch(setPage(1));
    }
  }, [dispatch, q, city, remote, company, county, location.pathname]);
 main

  function handleCloseIcon() {
    setText("");
    updateUrlParams({ q: null });
    contextSetQ([""]);
  }

  const filterCities = useCallback((input) => {
    setFilteredCities(getCityMatch(input));
    setFilteredCommunes(getCommuneMatch(input));
  }, []);

  useEffect(() => {
    filterCities(isLocation);
  }, [isLocation, filterCities]);

  // Click outside listener for all input suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setFocusedInput(null);
      }
    };

    if (focusedInput) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [focusedInput]);

  const fetchSuggestions = async (text) => {
    try {
      const response = await getJobSuggestion(text);
      setJobSuggestions(response?.suggestions || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text) {
        fetchSuggestions(text);
      } else {
        setJobSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%"
      }}
      className={`max-w-[1440px] mx-auto ${
        location.pathname === "/rezultate" ? "md:flex-row lg:flex-row" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between flex-col mt-5 gap-2 lg:gap-0 lg:flex-row ${
          location.pathname === "/"
            ? "w-[100%] mt-0 md:flex-col sm:items-center"
            : ""
        } ${
          location.pathname === "/rezultate"
            ? "w-full max-w-[1440px] mx-auto px-4 md:px-14 md:justify-center lg:justify-between"
            : ""
        }`}
      >
        {location.pathname === "/rezultate" && (
          <a href="/" className="logo lg:mr-3" style={{ minWidth: "54px" }}>
            <img src={logo} alt="peviitor" />
          </a>
        )}

        <form
          ref={containerRef}
          onSubmit={handleUpdateQ}
          className={`flex flex-col items-center relative lg:justify-between lg:mt-0 lg:gap-0 lg:flex-row max-w-full ${
            location.pathname === "/" ? "gap-2 mt-4 md:gap-2" : ""
          } ${
            location.pathname === "/rezultate"
              ? "w-full gap-1 sm:justify-center sm:w-auto md:justify-center md:items-center md:w-[90%]"
              : ""
          }`}
        >
          <div
            className={`flex items-center justify-between rounded-full w-[300px] md:w-[480px] lg:w-[340px] ${
              location.pathname === "/" ? "relative xl:w-[485px]" : ""
            } ${
              location.pathname === "/rezultate"
                ? "sm:flex-col sm:w-[400px] md:w-[580px] lg:w-[90%] 2xl:w-[90%]"
                : ""
            }`}
          >
            {/* Job Title Input */}
            <div
              className={`flex items-center relative w-full border border-[#89969C] bg-white rounded-full h-[54px] ${
                location.pathname === "/rezultate" ? "w-full" : ""
              } ${
                location.pathname !== "/"
                  ? "lg:border-r-2 border-[#89969C]"
                  : "lg:border-r-0 lg:rounded-tr-none lg:rounded-br-none divider"
              } ${
                focusedInput === "jobTitle" &&
                text.length >= 3 &&
                location.pathname === "/"
                  ? "lg:border-b-[#eeeeee] lg:rounded-bl-none"
                  : ""
              }`}
            >
              <FlagMagnifyGlass className="ml-5" />
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onFocus={() => handleFocus("jobTitle")}
                placeholder="Caută un loc de muncă"
                className="w-full py-3 px-2 xl:pl-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
              />
              {text && (
                <CloseIcon
                  className="w-4 h-4 mr-6 fill-slate-500 cursor-pointer"
                  onClick={handleCloseIcon}
                />
              )}
            </div>

            {/* Dropdown for Job Title */}
            {location.pathname === "/" &&
              focusedInput === "jobTitle" &&
              text.length >= 3 && (
                <ul className="hidden lg:block lg:absolute lg:left-0 lg:w-full lg:border lg:border-t-0 border-[#89969C] lg:rounded-3xl lg:rounded-t-none p-0 lg:mt-4 lg:max-h-[150px] lg:overflow-y-scroll custom-scrollbar lg:bottom-0 lg:transform lg:translate-y-full lg:box-border z-10 bg-white">
                  {jobSuggestions &&
                    jobSuggestions.length > 0 &&
                    jobSuggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className={`px-12 py-2 cursor-pointer ${
                          index % 2 === 0 ? "bg-custom-gray" : "bg-white"
                        } hover:bg-gray-200`}
                        onMouseDown={() => {
                          setText(suggestion.term);
                          setFocusedInput(null);
                        }}
                      >
                        {suggestion.term}
                      </li>
                    ))}
                </ul>
              )}
          </div>

          {/* Location Input Wrapper */}
          <div className="flex items-center justify-between w-[300px] mt-1 relative md:w-[480px] lg:w-[241px] lg:mt-0">
            <div
              style={{ height: "54px" }}
              className={`flex items-center relative w-full border border-[#89969C] bg-white rounded-full lg:border-l-0 lg:rounded-tl-none lg:rounded-bl-none ${
                focusedInput === "location"
                  ? "lg:border-b-[#eeeeee] lg:rounded-br-none"
                  : ""
              }`}
            >
              <MapPinIcon className="w-6 h-6 text-gray-500 ml-5" />
              <input
                type="text"
                value={isLocation}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => handleFocus("location")}
                placeholder="Adaugă o locație"
                className="w-full py-3 px-4 pl-2 bg-transparent outline-none border-none focus:outline-none focus:ring-0"
              />
              {isLocation && (
                <CloseIcon
                  className="w-4 h-4 mr-6 fill-slate-500 cursor-pointer"
                  onClick={handleClearLocation}
                />
              )}
            </div>

            {focusedInput === "location" && (
              <ul className="hidden lg:block lg:absolute lg:left-0 lg:w-full lg:border lg:border-t-0 lg:border-[#89969C] lg:rounded-3xl lg:rounded-t-none lg:mt-4 lg:max-h-[150px] lg:overflow-y-scroll custom-scrollbar lg:bottom-0 lg:transform lg:translate-y-full lg:box-border z-10 bg-white">
                {filteredCities.map((suggestion, index) => (
                  <li
                    key={`city-${index}`}
                    className={`px-12 py-2 cursor-pointer ${
                      index % 2 === 0 ? "bg-custom-gray" : "bg-white"
                    } hover:bg-gray-200`}
                    onClick={() => {
                      setLocation(suggestion);
                      setFocusedInput(null);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
                {filteredCommunes.map((suggestion, index) => (
                  <li
                    key={`commune-${index}`}
                    className={`px-12 py-2 cursor-pointer ${
                      index % 2 === 0 ? "bg-custom-gray" : "bg-white"
                    } hover:bg-gray-200`}
                    onClick={() => {
                      setLocation(suggestion);
                      setFocusedInput(null);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button type="submit" buttonType="search">
            Caută
          </Button>
        </form>
      </div>

      {/* Results Header and Active Filters */}
      {location.pathname === "/rezultate" && (
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-14">
          <FiltreGrup />

          {loading ? (
            <div className="h-[20px] w-[50%] md:w-[16%] my-6 bg-gray-300 animate-pulse rounded-md"></div>
          ) : (
            (() => {
              const isFiltering = [q, city, county, company, remote].some(
                (param) =>
                  Array.isArray(param) && param.filter(Boolean).length > 0
              );
              const displayCount = isFiltering ? total : globalJobsTotal;
              const displayLabel = isFiltering
                ? nrJoburi
                : "locuri de muncă disponibile";

              if (displayCount > 0) {
                return (
                  <h2 className="text-start text-text_grey_darker my-6 text-lg w-full">
                    {displayCount} {displayLabel}
                  </h2>
                );
              }
              return null;
            })()
          )}

          {!deleteAll &&
            [city, county, company, remote].some(
              (param) =>
                Array.isArray(param) && param.filter(Boolean).length > 0
            ) && (
              <div className="mb-8 flex w-full flex-wrap items-center gap-2">
                <FilterTags tags={fields} removeTag={removeTag} />
                <Button
                  buttonType="deleteFilters"
                  onClick={handleRemoveAllFilters}
                >
                  Șterge filtre
                </Button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Search;
