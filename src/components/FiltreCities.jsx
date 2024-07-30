import React, { useContext, useEffect, useState } from "react";
import TagsContext from "../context/TagsContext";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
import { orase } from "../utils/getCityName";

const FiltreCities = ({ dropDown }) => {
  // State to store the input value
  const [inputValue, setInputValue] = useState("");
  // State to store the filtered list of cities
  const [filteredItems, setFilteredItems] = useState(orase);
  const [error, setError] = useState(false);
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  // Empty the search value when dropdown its closed
  useEffect(() => {
    if (dropDown[0] || dropDown[1]) {
      setInputValue("");
      setFilteredItems(orase);
    }
  }, [dropDown]);

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    const value = event.target.value; // Get the current value of the input field
    setInputValue(value); // Update the state with the new input value

    // Create a regular expression to match the input value at the start of items names
    const regex = new RegExp(`^${normalizeString(value)}`, "i"); // Normalize the input value before creating the regex

    // Filter the items array based on the normalized input value
    const filtered = orase.filter((data) => normalizeString(data).match(regex));

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
          placeholder={`Cauta oras`}
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
                name="orase"
                value={item}
                checked={fields["orase"].includes(item)}
                onChange={(e) => handleCheckBoxChange(e, "orase")}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FiltreCities;
