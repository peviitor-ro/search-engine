import React, { useContext, useEffect, useRef, useState } from "react";

import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
// scss
import "../scss/filtre.scss";
import { getNameOfCompanies } from "../utils/fetchData";
import { orase } from "../utils/getCityName";

// CheckboxFilter component for filtering items
const CheckboxFilter = ({ items, filterKey, searchFor, dropDown }) => {
  // State to store the input value
  const [inputValue, setInputValue] = useState("");
  // State to store the filtered list of cities
  const [filteredItems, setFilteredItems] = useState(items);
  const [error, setError] = useState(false);
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  // Empty the search value when dropdown its closed
  useEffect(() => {
    if (dropDown[0] || dropDown[1]) {
      setInputValue("");
      setFilteredItems(items);
    }
  }, [dropDown, items]);

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    const value = event.target.value; // Get the current value of the input field
    setInputValue(value); // Update the state with the new input value

    // Create a regular expression to match the input value at the start of items names
    const regex = new RegExp(`^${normalizeString(value)}`, "i"); // Normalize the input value before creating the regex

    // Filter the items array based on the normalized input value
    const filtered = items.filter((data) => normalizeString(data).match(regex));

    // Update the state with the filtered list of items
    setFilteredItems(filtered);
  };

  // Function to normalize strings by removing diacritical marks (accents)
  const normalizeString = (str) => {
    // Normalize the string to decompose characters and diacritics
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // \u0300-\u036f is a range of Unicode for diacritical marks
  };

  // Effect to handle error when no results are found
  useEffect(() => {
    setError(filteredItems.length === 0 && inputValue.length > 0);
  }, [filteredItems, inputValue]);

  return (
    <div className="search-input">
      <div className="search-container">
        <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
        <input
          type="search"
          value={inputValue}
          placeholder={`Cauta ${searchFor}`}
          onChange={handleInputChange}
        />
      </div>

      <div className="checkbox-container">
        {error ? (
          <div>Nu există rezultate "{inputValue}"</div>
        ) : (
          filteredItems.map((item, index) => (
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

  // use it for closing dropdown on click
  const refDropdown = useRef();

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

  // Function to get button style based on index and fields
  const getButtonStyle = (index) => {
    if (index === 0 && fields.orase.length >= 1) {
      return { color: "#048a81" };
    } else if (index === 1 && fields.company.length >= 1) {
      return { color: "#048a81" };
    } else if (index === 2 && fields.remote.length >= 1) {
      return { color: "#048a81" };
    } else {
      return {};
    }
  };

  // Function to get button label based on index and fields
  const getButtonLabel = (index) => {
    if (index === 0) {
      return `Oraș ${
        fields.orase.length >= 1 ? `(${fields.orase.length})` : ""
      }`;
    } else if (index === 1) {
      return `Companie ${
        fields.company.length >= 1 ? `(${fields.company.length})` : ""
      }`;
    } else {
      return `Mod de lucru ${
        fields.remote.length >= 1 ? `(${fields.remote.length})` : ""
      }`;
    }
  };

  // For closing dropDown on click
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // when its clicked outside the dropdown, then will close the dropdown
      if (
        dropDown &&
        refDropdown.current &&
        !refDropdown.current.contains(e.target)
      ) {
        setDropDown([false, false, false]);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropDown]);

  // Rendering the component
  return (
    <div className="drop-down-parent" ref={refDropdown}>
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button
            className="drop-down"
            onClick={() => handleDropDown(index)}
            style={getButtonStyle(index)}
          >
            {/* Dynamically set button label based on index */}
            {getButtonLabel(index)}
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
                  dropDown={dropDown}
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
                  dropDown={dropDown}
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
                    <label htmlFor="on-site">La fața locului</label>
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
                    <label htmlFor="Remote">La distanță</label>
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
