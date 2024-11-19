import React, { useContext, useEffect, useState } from "react";
import { getNameOfCompanies } from "../utils/fetchData";
import TagsContext from "../context/TagsContext";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
import InputField from "./InputField";
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
    <div className="flex flex-col">
      <div className="flex justify-center items-center gap-1 border-b-[1px] border-border_grey">
        <img
            src={magnifyGlass}
            alt="magnify-glass"
            className="relative left-0 w-[20px] ml-1"
          />

        <InputField 
          value={inputCompany}
          placeholder={`Caută companie`}
          onChange={handleInputChange}
          inputType="searchType"
          type="search" />
      </div>

      <div className="flex flex-col  py-[1px] px-1 w-[230px] h-[220px] overflow-y-auto scrollbar-class overflow-x-hidden">
        {inputCompany.length > 0 && inputCompany.length < 3 && <p>{error}</p>}
        {Array.isArray(data) ? (
            // data.sort((a, b) => a.localeCompare(b)).map((item, index) => (
            data.map((item, index) => (
            <InputField key={index}
              type="checkbox"
              id={item}
              name="company"
              value={item}
              checked={fields["company"].includes(item)}
              onChange={(e) => handleCheckBoxChange(e, "company")}
              inputType="checkBoxType"
              label={item}
              item={item}
            />
          ))
        ) : (
          <div className="pl-[7px]">{data.message}</div>
        )}
      </div>
      <div className="h-3"></div>
    </div>
  );
};

export default FiltreCompanies;
