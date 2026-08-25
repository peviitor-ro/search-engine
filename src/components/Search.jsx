import logo from "../assets/svg/logo.svg";
import { useEffect, useState, useContext, useCallback, useRef, useMemo } from "react";
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

// Sorted once outside the component scope to avoid mutating imports
const sortedOrase = [...orase].sort(
  new Intl.Collator("ro", { sensitivity: "accent", numeric: true }).compare
);

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
  const loading = useSelector((state) => state.jobs.loading);
  const [globalJobsTotal, setGlobalJobsTotal] = useState(0);

  const [isLocation, setLocation] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [filteredCities, setFilteredCities] = useState(sortedOrase);
  const [filteredCommunes, setFilteredCommunes] = useState(comune);
  const [jobSuggestions, setJobSuggestions] = useState([]);

  // Wrapper ref catches clicks outside of BOTH inputs & dropdowns
  const containerRef = useRef(null);
  const prevSearchKey = useRef(null);

  const isOnResultsPage = useMemo(
    () => location.pathname.includes("rezultate") || window.location.hash.includes("rezultate"),
    [location.pathname]
  );

  const nrJoburi =
    total >= 20 ? "de rezultate" : total === 1 ? "rezultat" : "rezultate";

  const handleClearLocation = () => setLocation("");
  const handleFocus = (input) => setFocusedInput(input);

  useEffect(() => {
    if (!isOnResultsPage) return;
    setText(q ? String(q) : "");
  }, [isOnResultsPage, q]);

  // Sync URL Params with Context
  useEffect(() => {
    if (!isOnResultsPage) return;

    const qParam = findParamInURL("q");
    const cityParam = findParamInURL("orase");
    const countyParam = findParamInURL("judete");
    const companyParam = findParamInURL("company");
    const remoteParam = findParamInURL("remote");

    if (contextSetQ) contextSetQ(qParam || [""]);
    if (contextSetCity) contextSetCity(cityParam || [""]);
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
    location.search,
    location.hash
  ]);

  useEffect(() => {
    if (!isOnResultsPage) return;

    let isSubscribed = true;
    const fetchNumbersInfo = async () => {
      try {
        const companyNumber = await getNumberOfCompany();
        if (isSubscribed) dispatch(setNumberOfCompany(companyNumber));

        if (typeof getNumberOfJobs === "function") {
          const jobsCount = await getNumberOfJobs();
          if (isSubscribed) {
            const numericalTotal = typeof jobsCount === "object" && jobsCount !== null 
              ? (jobsCount?.total?.jobs || jobsCount?.total || 0) 
              : Number(jobsCount) || 0;
            setGlobalJobsTotal(numericalTotal);
          }
        }
      } catch (error) {
        console.error("Failed to load metrics:", error);
      }
    };

    fetchNumbersInfo();
    return () => {
      isSubscribed = false;
    };
  }, [dispatch, isOnResultsPage]);

  const handleUpdateQ = (e) => {
    e.preventDefault();

    let targetCity = city;
    if (isLocation.trim() !== "") {
      targetCity = [isLocation];
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

    navigate(`/rezultate?${params.toString()}`, { replace: false });
  };

  useEffect(() => {
    if (!isOnResultsPage) return;

    let active = true;

    const fetchData = async () => {
      const cleanParam = (val) => {
        if (Array.isArray(val)) return val.filter(Boolean).join("|");
        return val ? String(val).trim() : "";
      };

      const qStr = cleanParam(q);
      const cityStr = cleanParam(city);
      const countyStr = cleanParam(county);
      const companyStr = cleanParam(company);
      const remoteStr = cleanParam(remote);

      const pageVal = findParamInURL("page");
      const targetPage = pageVal ? Number(Array.isArray(pageVal) ? pageVal[0] : pageVal) || 1 : 1;

      const searchKey = `${qStr}::${cityStr}::${countyStr}::${companyStr}::${remoteStr}::page=${targetPage}`;

      if (prevSearchKey.current === searchKey) return;
      prevSearchKey.current = searchKey;

      try {
        dispatch(setLoading(true));

        const searchString = createSearchString(q, city, county, company, remote, targetPage);
        const response = await getData(searchString);

        const jobs = response?.jobs || response?.data || (Array.isArray(response) ? response : []);
        const totalCount = response?.total ?? response?.totalCount ?? jobs.length;

        if (active) {
          dispatch(setJobs(jobs));
          dispatch(setTotal(totalCount));
          dispatch(setPage(targetPage));
          if (jobs.length > 0) dispatch(setPageSize(jobs.length));

          if (findParamInURL("page") !== String(targetPage)) {
            updateUrlParams({ page: targetPage });
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        if (active) {
          dispatch(clearJobs());
          dispatch(setTotal(0));
        }
      } finally {
        if (active) {
          dispatch(setLoading(false));
        }
      }
    };

    if (
      q.length !== 0 ||
      city.length !== 0 ||
      remote.length !== 0 ||
      company.length !== 0 ||
      county.length !== 0 ||
      location.pathname === "/rezultate"
    ) {
      fetchData();
    } else {
      dispatch(clearJobs());
      dispatch(setTotal(0));
      dispatch(setPage(1));
    }

    return () => {
      active = false;
    };
  }, [dispatch, q, city, remote, company, county, location.pathname, isOnResultsPage]);

  function handleCloseIcon() {
    setText("");
    updateUrlParams({ q: null });
    if (contextSetQ) contextSetQ([""]);
  }

  const filterCities = useCallback((input) => {
    setFilteredCities(getCityMatch(input));
    setFilteredCommunes(getCommuneMatch(input));
  }, []);

  useEffect(() => {
    filterCities(isLocation);
  }, [isLocation, filterCities]);

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

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      if (text.length >= 3) {
        try {
          const response = await getJobSuggestion(text);
          if (active) {
            setJobSuggestions(Array.isArray(response?.suggestions) ? response.suggestions : []);
          }
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        }
      } else {
        setJobSuggestions([]);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
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
        isOnResultsPage ? "md:flex-row lg:flex-row" : ""
      }`}
    >
      <div
        className={`flex items-center justify-between flex-col mt-5 gap-2 lg:gap-0 lg:flex-row ${
          !isOnResultsPage ? "w-[100%] mt-0 md:flex-col sm:items-center" : ""
        } ${
          isOnResultsPage
            ? "w-full max-w-[1440px] mx-auto px-4 md:px-14 md:justify-center lg:justify-between"
            : ""
        }`}
      >
        {isOnResultsPage && (
          <a href="/" className="logo lg:mr-3" style={{ minWidth: "54px" }}>
            <img src={logo} alt="peviitor" />
          </a>
        )}

        <form
          ref={containerRef}
          onSubmit={handleUpdateQ}
          className={`flex flex-col items-center relative lg:justify-between lg:mt-0 lg:gap-0 lg:flex-row max-w-full ${
            !isOnResultsPage ? "gap-2 mt-4 md:gap-2" : ""
          } ${
            isOnResultsPage
              ? "w-full gap-1 sm:justify-center sm:w-auto md:justify-center md:items-center md:w-[90%]"
              : ""
          }`}
        >
          <div
            className={`flex items-center justify-between rounded-full w-[300px] md:w-[480px] lg:w-[340px] ${
              !isOnResultsPage ? "relative xl:w-[485px]" : ""
            } ${
              isOnResultsPage
                ? "sm:flex-col sm:w-[400px] md:w-[580px] lg:w-[90%] 2xl:w-[90%]"
                : ""
            }`}
          >
            <div
              className={`flex items-center relative w-full border border-[#89969C] bg-white rounded-full h-[54px] ${
                isOnResultsPage ? "w-full" : ""
              } ${
                isOnResultsPage
                  ? "lg:border-r-2 border-[#89969C]"
                  : "lg:border-r-0 lg:rounded-tr-none lg:rounded-br-none divider"
              } ${
                focusedInput === "jobTitle" &&
                text.length >= 3 &&
                !isOnResultsPage
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

            {!isOnResultsPage &&
              focusedInput === "jobTitle" &&
              text.length >= 3 && (
                <ul className="hidden lg:block lg:absolute lg:left-0 lg:w-full lg:border lg:border-t-0 border-[#89969C] lg:rounded-3xl lg:rounded-t-none p-0 lg:mt-4 lg:max-h-[150px] lg:overflow-y-scroll custom-scrollbar lg:bottom-0 lg:transform lg:translate-y-full lg:box-border z-10 bg-white">
                  {jobSuggestions?.map((suggestion, index) => (
                    <li
                      key={suggestion.term || index}
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
                    key={`city-${suggestion}-${index}`}
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
                    key={`commune-${suggestion}-${index}`}
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

      {isOnResultsPage && (
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