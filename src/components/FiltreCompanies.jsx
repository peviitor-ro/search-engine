import React, { useContext, useEffect, useState } from "react";
import { getNameOfCompanies } from "../utils/fetchData";
import TagsContext from "../context/TagsContext";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";

const FiltreCompanies = ({ dropDown }) => {
  const [inputCompany, setInputCompany] = useState("");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

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
        const response = await getNameOfCompanies(inputCompany);
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (inputCompany.length > 2 || inputCompany.length === 0) {
      fetchData();
    } else if (inputCompany.length > 0 && inputCompany.length < 3) {
      setData([]);
      setError(
        "Te rugăm să introduci cel puțin 3 litere pentru a începe căutarea."
      );
    }
  }, [inputCompany, fields]);

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    const value = event.target.value; // Get the current value of the input field
    setInputCompany(value); // Update the state with the new input value
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
