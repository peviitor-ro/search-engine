import React, { useContext, useEffect, useState } from "react";

import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
// scss
import "../scss/filtre.scss";
import { getNameOfCompanies } from "../utils/fetchData";
import { orase } from "../utils/getCityName";

// Regular expressions for replacing special characters
const aREG = new RegExp("ș", "g");
const bREG = new RegExp("ț", "g");
const cREG = new RegExp("â", "g");
const dREG = new RegExp("ă", "g");
const eREG = new RegExp("î", "g");

// CheckboxFilter component for filtering items
const CheckboxFilter = ({ items, filterKey, searchFor }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(false);
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  // Filtering items based on search query
  const filteredItems = items.filter(
    (item) =>
      (searchQuery.length >= 1 &&
        item
          .toLowerCase()
          .replace(aREG, "s")
          .replace(bREG, "t")
          .replace(cREG, "a")
          .replace(dREG, "a")
          .replace(eREG, "i")
          .includes(searchQuery.toLowerCase())) ||
      item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Effect to handle error when no results are found
  useEffect(() => {
    setError(filteredItems.length === 0 && searchQuery.length > 0);
  }, [filteredItems, searchQuery]);

  // Displaying filtered items
  const displayItems =
    searchQuery.length >= 1 ? filteredItems : items.slice(0, 20);

  return (
    <div className="search-input">
      <div className="search-container">
        <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
        <input
          type="search"
          placeholder={`Cauta ${searchFor}`}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="checkbox-container">
        {error ? (
          <div>Nu există rezultate "{searchQuery}"</div>
        ) : (
          displayItems.map((item, index) => (
            <div key={index} className="checkbox-parent">
              <input
                type="checkbox"
                id={item}
                name={filterKey}
                value={item}
                checked={fields[filterKey].includes(item)}
                onChange={(e) => handleCheckBoxChange(e, filterKey)}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const FiltreGrup = () => {
  const [data, setData] = useState([]);

  // Destructuring fields and handleCheckBoxChange from the context
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  // State for dropdown visibility
  const [dropDown, setDropDown] = useState([false, false, false]);

  // Function to handle dropdown toggle
  function handleDropDown(index) {
    // Toggle the dropdown at the specified index
    const updatedDropDown = dropDown.map((item, i) =>
      i === index ? !item : false
    );
    setDropDown(updatedDropDown);
  }

  // Fetching company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNameOfCompanies();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Rendering the component
  return (
    <div className="drop-down-parent">
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button className="drop-down" onClick={() => handleDropDown(index)}>
            {/* Dynamically set button label based on index */}
            {index === 0
              ? "Oraș"
              : index === 1
              ? "Companie"
              : "Mod de lucru"}{" "}
            {/* Arrow icon for indicating dropdown state */}
            <img
              src={sageata}
              className={`arrow-bottom ${isOpen ? "up" : ""}`}
              alt="drop-down"
            />
          </button>
          {/* Dropdown container */}
          <div className={`drop-down-container ${isOpen ? "open" : ""}`}>
            {/* Dynamically rendering checkbox based on index */}

            {/* Cities Drop-down */}
            {index === 0 && (
              <React.Fragment>
                <CheckboxFilter
                  items={orase}
                  filterKey="orase"
                  searchFor="oras"
                />
              </React.Fragment>
            )}

            {/* Companies Drop-down */}
            {index === 1 && (
              <React.Fragment>
                <CheckboxFilter
                  items={data}
                  filterKey="company"
                  searchFor="companie"
                />
              </React.Fragment>
            )}

            {index === 2 && (
              <React.Fragment>
                <div className="checkbox-remote">
                  <div>
                    <input
                      type="checkbox"
                      id="on-site"
                      name="on-site"
                      value="on-site"
                      className="mdl"
                      checked={fields.remote.includes("on-site")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="on-site">La fata locului</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="hibrid"
                      name="hibrid"
                      value="hibrid"
                      className="mdl"
                      checked={fields.remote.includes("hibrid")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="hibrid">Hibrid</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Remote"
                      name="remote"
                      value="Remote"
                      className="mdl"
                      checked={fields.remote.includes("Remote")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="Remote">Remote</label>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltreGrup;
