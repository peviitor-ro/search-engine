import React from "react";
import "./search.style.scss";
import magnifyGlass from "../../assets/svgs/magniy_glass_icon.svg";
import location from "../../assets/svgs/location_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateCountry,
  updateQ,
  updateCounty,
  updatCity,
} from "../../state/query.slice";
import { getAllJobs, getTotalRomania } from "../../utils/get-data";
import { updateAllJobs, updateTotalRomania } from "../../state/jobs.slice";
import { counties } from "./cityandcounty";

export const Search = (props) => {
  // Props
  const queries = props.queries;
  const handleClick = props.handleClick;

  // Redux
  const dispatch = useDispatch();
  const q = useSelector((state) => state.query.q);
  const country = useSelector((state) => state.query.country);
  const county = useSelector((state) => state.query.county);

  // Transform counties object to array
  const counties_list = counties.map((county) => {
    return Object.keys(county)[0];
  });

  // States
  const [countiesList, setCountiesList] = React.useState([counties_list]);
  const [citiesList, setCitiesList] = React.useState([]);

  React.useEffect(() => {
    if (country === "România") {
      setCountiesList(counties_list);
    } else {
      setCountiesList([]);
    }
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

  // Functions
  // Update query search
  const updateQuerySearch = (e) => {
    dispatch(updateQ(e.target.value));
  };

  // Update country search
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

  // Update county search
  const updateCountySearch = (e) => {
    dispatch(updateCounty(e.target.value));
    setCountiesList(
      counties_list.filter((c) => {
        return c.toLowerCase().includes(e.target.value.toLowerCase());
      })
    );
  };

  // Update city search
  const updateCitySearch = (e) => {
    dispatch(updatCity(e.target.value));

    counties.map((c) => {
      if (Object.keys(c)[0] === county) {
        setCitiesList(
          c[county].filter((city) => {
            return city.toLowerCase().includes(e.target.value.toLowerCase());
          })
        );
      }
    });
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleClick();
  };

  // Handle clear X
  const handleClearX = (e) => {
    e.preventDefault();
    dispatch(updateQ(""));
  };

  // Handle click input
  const handleClickInput = (e) => {
    const dataList = e.target.nextElementSibling;

    dataList.addEventListener("click", (d) => {
      e.target.value = d.target.getAttribute("data");
      switch (e.target.id) {
        case "country":
          dispatch(updateCountry(e.target.value));
          dispatch(updateCounty(""));
          dispatch(updatCity(""));
          if (e.target.value === "România") {
            setInputs(2);
          }
          break;
        case "county":
          dispatch(updateCounty(e.target.value));
          dispatch(updatCity(""));
          if (e.target.value) {
            setInputs(3);
          }
          break;
        case "city":
          dispatch(updatCity(e.target.value));
          break;
        default:
          break;
      }
    });
  };

  // Handle click input
  const [inputs, setInputs] = React.useState(1);

  const ref = React.useRef(false);

  const [show, setShow] = React.useState(false);

  document.addEventListener("click", (e) => {
    try {
      if (
        e.target.childNodes[2] === ref.current ||
        e.target.parentNode.childNodes[2] === ref.current
      ) {
        setShow(true);
      } else {
        setShow(false);
      }
    } catch (e) {}
  });

  return (
    <form onSubmit={handleSubmit} className="search">
      <div className="inputs-wrapper">
        <div className="input-container">
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
        <div className="option-container ">
          {inputs === 1 ? (
            <div className="country query">
              <img src={location} alt="location icon" />
              <input
                type="text"
                id="country"
                placeholder="Alege Tara"
                autoComplete="off"
                value={country}
                onChange={updateCrountrySearch}
                onClick={handleClickInput}
              />

              <ul
                name="country"
                value={country}
                className={show ? "" : "hide"}
                ref={ref}
              >
                <li data="România">România</li>
                <li data="">Toate</li>
              </ul>
              {country ? (
                <span
                  className="clear"
                  onClick={() => {
                    dispatch(updateCountry(""));
                    dispatch(updateCounty(""));
                    dispatch(updatCity(""));
                    setInputs(1);
                  }}
                >
                  <svg
                    focusable="false"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                  </svg>
                </span>
              ) : null}
            </div>
          ) : null}
          {country === "România" && inputs === 2 ? (
            <div className="county query">
              <img src={location} alt="location icon" />
              <input
                id="county"
                type="text"
                placeholder="Alege Judetul"
                autoComplete="off"
                onChange={updateCountySearch}
                onClick={handleClickInput}
              />
              <ul
                name="county"
                ref={ref}
                className={show ? "" : "hide"}
                value={queries.county ? queries.county : ""}
              >
                <li data="">Toate Judetele</li>
                {countiesList.map((county, index) => {
                  return (
                    <li key={index} data={county}>
                      {county}
                    </li>
                  );
                })}
              </ul>

              <span
                className="clear"
                onClick={() => {
                  dispatch(updateCountry(""));
                  dispatch(updateCounty(""));
                  dispatch(updatCity(""));
                  setInputs(1);
                }}
              >
                <svg
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </span>
            </div>
          ) : null}
          {country === "România" && county && inputs === 3 ? (
            <div className="city query">
              <img src={location} alt="location icon" />
              <input
                id="city"
                type="text"
                placeholder="Alege Orașul"
                autoComplete="off"
                onChange={updateCitySearch}
                onClick={handleClickInput}
              />
              <ul
                name="city"
                ref={ref}
                className={show ? "" : "hide"}
                value={queries.city ? queries.city : ""}
              >
                <li data="">Toate Orasele din Judetul {county}</li>
                {citiesList.map((city, index) => {
                  return (
                    <li key={index} data={city}>
                      {city}
                    </li>
                  );
                })}
              </ul>
              <span
                className="clear"
                onClick={() => {
                  dispatch(updateCountry(""));
                  dispatch(updateCounty(""));
                  dispatch(updatCity(""));
                  setInputs(1);
                }}
              >
                <svg
                  focusable="false"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                </svg>
              </span>
            </div>
          ) : null}
        </div>
      </div>
      <button type="submit" className="btn-yellow btn">
        Caută
      </button>
    </form>
  );
};
