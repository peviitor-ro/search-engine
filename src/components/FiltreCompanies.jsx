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
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [error, setError] = useState("");
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  const debouncedInput = useDebounce(inputCompany, 300);

  // Fetching company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companies = await getNameOfCompanies();
        setAllCompanies(companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchData();
  }, []);

  // Filtering companies
  useEffect(() => {
    if (debouncedInput.length >= 3) {
      const filtered = allCompanies.filter((company) =>
        company.name.toLowerCase().includes(debouncedInput.toLowerCase())
      );
      setFilteredCompanies(filtered.map((el) => el.name));
      setError("");
    } else {
      setFilteredCompanies([]);
      setError(
        "Te rugăm să introduci cel puțin 3 litere pentru a începe căutarea."
      );
    }
  }, [debouncedInput, allCompanies]);

  const handleInputChange = (e) => {
    setInputCompany(e.target.value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 border-b border-border_grey">
        <img src={magnifyGlass} alt="search" className="w-5 ml-1" />
        <InputField
          value={inputCompany}
          placeholder="Caută companie"
          onChange={handleInputChange}
          inputType="searchType"
          type="search"
        />
      </div>

      <div className="flex flex-col py-1 px-1 w-[230px] h-[220px] overflow-y-auto scrollbar-class overflow-x-hidden">
        {error && <p className="text-sm">{error}</p>}
        {filteredCompanies.map((name, index) => (
          <InputField
            key={index}
            type="checkbox"
            id={name}
            name="company"
            value={name}
            checked={fields["company"].includes(name)}
            onChange={(e) => handleCheckBoxChange(e, "company")}
            inputType="checkBoxType"
            label={name}
            item={name}
          />
        ))}
      </div>
      <div className="h-3" />
    </div>
  );
};

export default FiltreCompanies;
