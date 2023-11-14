import React from "react";
import "./search.style.scss";
import magnifyGlass from "../../assets/svgs/magniy_glass_icon.svg";
import location from "../../assets/svgs/location_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateCountry, updateQ, updateCounty, updatCity } from "../../state/query.slice";
import { getAllJobs, getTotalRomania } from "../../utils/get-data";
import { updateAllJobs, updateTotalRomania } from "../../state/jobs.slice";
import { counties } from "./cityandcounty";

export const Search = (props) => {


const queries = props.queries;
const handleClick = props.handleClick;

  const dispatch = useDispatch();

  const q = useSelector((state) => state.query.q);
  const country = useSelector((state) => state.query.country);
  const county = useSelector((state) => state.query.county);

  const updateQuerySearch = (e) => {
    dispatch(updateQ(e.target.value));
  };

  const updateCrountrySearch = (e) => {
    if (e.target.value) {
      getTotalRomania().then((totalRomania) => {
        dispatch(updateTotalRomania(totalRomania));
      });
    } else {
      getAllJobs().then((totalRomania) => {
        dispatch(updateAllJobs(totalRomania));
      });
    }
    dispatch(updateCountry(e.target.value));
    dispatch(updatCity(""));
    dispatch(updateCounty(""));
  };

  const updateCountySearch = (e) => {
    dispatch(updateCounty(e.target.value));
   
  };

  const updateCitySearch = (e) => {
    dispatch(updatCity(e.target.value));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  const handleClearX = (e) => {
    e.preventDefault();
    dispatch(updateQ(""));
  };

  const [countiesList, setCountiesList] = React.useState([]);
  const [citiesList, setCitiesList] = React.useState([]);

  React.useEffect(() => {
    counties.map((county) => {

      setCountiesList((countiesList) => [
        ...countiesList,
        Object.keys(county)[0],
      ]);
    
    });
  }, []);

  React.useEffect(() => {
    if (county) {
      setCitiesList([]);
      counties.map((c) => {
        if (Object.keys(c)[0] === county) {
          setCitiesList(c[county]);
        }
      });
    }
  }, [county]);

//   document.addEventListener("click", (e) => {
//     if (e.target.id === "county") {
//       updateCountySearch(e);
//     }
//     if (e.target.id === "city") {
//         updateCitySearch(e);
//     }
//   });

  return (
    <form onSubmit={handleSubmit} className="search">
      <div className="inputs-wrapper">
        <div className="input-container query">
          <img src={magnifyGlass} alt="magnify glass icon" />
          <input
            placeholder="Ce doriți să lucrați?"
            onChange={updateQuerySearch}
            value={q}
          />
          {q && (
            <span className="clear" onClick={handleClearX}>
              <svg
                focusable="false"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
              </svg>
            </span>
          )}
        </div>
        <div className="option-container country">
          <img src={location} alt="location icon" />
          <select
            id="country"
            name="country"
            onChange={updateCrountrySearch}
            value={country}
          >
            <option value="România">România</option>
            <option value="">Toate</option>
          </select>
          {/* if country select is romania  show county field */}
          {country === "România" ? (
            <select id="county" name="county" onChange={updateCountySearch} value={
                queries.county ? queries.county : ""
            }>
              <option value="">Judetul</option>
              {countiesList.map((county, index) => {
                return (
                  <option key={index} value={county}>
                    {county}
                  </option>
                );
              })}
            </select>
          ) : null}
          {/* show city when county is select */}
          {country === "România" && county ? (
            <select id="city" name="city" onChange={updateCitySearch} value={
                queries.city ? queries.city : ""
            }>
              <option value="">Orașul</option>
              {citiesList.map((city, index) => {
                return <option key={index} value={city}>{city}</option>;
              })}
            </select>
          ) : null}
        </div>
      </div>
      <button type="submit" className="btn-yellow btn">
        Caută
      </button>
    </form>
  );
};
