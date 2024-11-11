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
    <>
      <div className="flex items-center gap-1 px-[2px] border-b-[1px] border-border_grey">
        <img
          src={magnifyGlass}
          alt="magnify-glass"
          className="relative left-0 w-[20px] ml-1"
        />
        <input
          type="search"
          value={inputCompany}
          placeholder={`Cauta companie`}
          onChange={handleInputChange}
          className="border-0 outline-none py-[10px] text-sm w-[190px] rounded-full"
        />
      </div>

      <div className="flex flex-col  py-[1px] px-1 w-[230px] h-[220px] overflow-y-auto scrollbar-class overflow-x-hidden">
        {inputCompany.length > 0 && inputCompany.length < 3 && <p>{error}</p>}
        {Array.isArray(data) ? (
          data.map((item, index) => (
            <div key={index} className="checkbox-parent text-sm">
              <input
                type="checkbox"
                id={item}
                name="company"
                value={item}
                checked={fields["company"].includes(item)}
                onChange={(e) => handleCheckBoxChange(e, "company")}
                className="accent-background_green"
              />
              <label htmlFor={item} className="pl-1 cursor-pointer">
                {item}
              </label>
            </div>
          ))
        ) : (
          <div className="pl-[7px]">{data.message}</div>
        )}
      </div>
      <div className="h-3"></div>
    </>
  );
};

export default FiltreCompanies;
