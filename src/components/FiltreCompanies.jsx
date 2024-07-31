import React, { useContext, useEffect, useState } from "react";
import { getNameOfCompanies } from "../utils/fetchData";
import TagsContext from "../context/TagsContext";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";

// Custom debounce hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const FiltreCompanies = ({ dropDown }) => {
  const [inputCompany, setInputCompany] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  const debouncedInputCompany = useDebounce(inputCompany, 300);

  // Empty the search value when dropdown its closed
  useEffect(() => {
    if (dropDown[0] || dropDown[1]) {
      setInputCompany("");
    }
  }, [dropDown]);

  // Fetching company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getNameOfCompanies(debouncedInputCompany);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (
      debouncedInputCompany.length > 2 ||
      debouncedInputCompany.length === 0
    ) {
      fetchData();
    } else if (
      debouncedInputCompany.length > 0 &&
      debouncedInputCompany.length < 3
    ) {
      setData([]);
      setError(
        "Te rugăm să introduci cel puțin 3 litere pentru a începe căutarea."
      );
    }
  }, [debouncedInputCompany, fields]);

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputCompany(value);
  };

  return (
    <div className="search-input">
      <div className="search-container">
        <img className="lupa" src={magnifyGlass} alt="magnify-glass" />
        <input
          type="search"
          value={inputCompany}
          placeholder={`Cauta companie`}
          onChange={handleInputChange}
        />
      </div>

      <div className="checkbox-container">
        {inputCompany.length > 0 && inputCompany.length < 3 && (
          <p className="info-message">{error}</p>
        )}
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <div key={index} className="checkbox-parent">
              <input
                type="checkbox"
                id={item}
                name="company"
                value={item}
                checked={fields["company"].includes(item)}
                onChange={(e) => handleCheckBoxChange(e, "company")}
              />
              <label htmlFor={item}>{item}</label>
            </div>
          ))
        ) : (
          <div className="error-message">{data.message}</div>
        )}
      </div>
    </div>
  );
};

export default FiltreCompanies;
