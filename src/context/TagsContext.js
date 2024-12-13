import { createContext, useState, useEffect, useCallback } from "react";
import {
  updateUrlParams,
  findParamInURL,
  removeFiltersFromURL
} from "../utils/urlManipulation";

const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [fields, setFields] = useState({
    orase: [],
    remote: [],
    company: [],
    experienta: []
  });
  // string values
  // make them empty if they don't exist in the URL.
  const [q, setQ] = useState(() => findParamInURL("q") || []);
  const [city, setCity] = useState(() => findParamInURL("orase") || []);
  const [remote, setRemote] = useState(() => findParamInURL("remote") || []);
  const [company, setCompany] = useState(() => findParamInURL("company") || []);
  const [county] = useState([""]);
  // take data from checkbox
  const handleCheckBoxChange = (e, type) => {
    const { value, checked } = e.target;

    // Clone the current array
    const updatedArray = [...fields[type]];

    if (checked) {
      // Add value to array
      updatedArray.push(value);
    } else {
      // Remove value from array
      const index = updatedArray.indexOf(value);
      if (index !== -1) {
        updatedArray.splice(index, 1);
      }
    }
    // Update state with updated array
    setFields((prevFields) => ({
      ...prevFields,
      [type]: updatedArray
    }));
    updateUrlParams({ [type]: updatedArray });
    // Update the state for string creation.
    if (type === "orase") {
      setCity(updatedArray);
    } else if (type === "remote") {
      setRemote(updatedArray);
    } else if (type === "company") {
      setCompany(updatedArray);
    }
  };

  // modify removeTag function to accept a parameter indicating the type of field
  const removeTag = (type, value) => {
    // Clone the current array based on the type
    const updatedArray = [...fields[type]];

    // Find the index of the value to be removed
    const index = updatedArray.indexOf(value);

    // If the value is found in the array, remove it
    if (index !== -1) {
      updatedArray.splice(index, 1);
    }

    updateUrlParams({ [type]: updatedArray });

    // Update state with the updated array
    setFields((prevFields) => ({
      ...prevFields,
      [type]: updatedArray
    }));
    // Update the city array specifically to remove the corresponding text
    if (type === "orase") {
      const updatedCity = city.filter((city) => city !== value);
      setCity(updatedCity);
    }
    if (type === "remote") {
      const updatedRemote = remote.filter((remote) => remote !== value);
      setRemote(updatedRemote);
    }
    if (type === "company") {
      const updatedCompany = company.filter((company) => company !== value);
      setCompany(updatedCompany);
    }
  };

  const contextSetQ = useCallback((text) => {
    setQ(text);
    if (Array.isArray(text)) {
      updateUrlParams({ q: text[0] });
    } else {
      updateUrlParams({ q: text });
    }
  }, []);

  const contextSetCity = useCallback((text) => {
    if (text[0]) {
      setCity(text);
    }
    if (Array.isArray(text)) {
      updateUrlParams({ 'orase': text[0] });
    } else {
      updateUrlParams({ 'orase': text });
    }
  }, []);

  const contextSetField = useCallback((fieldName, value) => {
    const allowedFields = ["orase", "remote", "company"];
    if (!allowedFields.includes(fieldName) || !value) {
      return;
    }
    const newValue = Array.isArray(value) ? value : [value];

    switch (fieldName) {
      case "orase":
        setCity(newValue);
        break;
      case "remote":
        setRemote(newValue);
        break;
      case "company":
        setCompany(newValue);
        break;
      default:
        return;
    }

    setFields((prev) => ({
      ...prev,
      [fieldName]: newValue
    }));
  }, []);

  // Update fields state from URL when component mounts
  useEffect(() => {
    setFields({
      orase: city,
      remote: remote,
      company: company,
      experienta: []
    });
  }, [city, remote, company]);
  // state that have bolean true if fileds.array are empty.
  const [deletAll, setDeletAll] = useState(false);
  // set the fileds back to empty
  const handleRemoveAllFilters = () => {
    setFields({
      orase: [],
      remote: [],
      company: [],
      experienta: []
    });
    setCity([]);
    setCompany([]);
    setRemote([]);
    removeFiltersFromURL();
  };
  useEffect(() => {
    // Function to check if all arrays in fields object are empty
    const checkFieldsEmpty = () => {
      const { orase, remote, company, experienta } = fields;
      const allFieldsEmpty =
        orase.length === 0 &&
        remote.length === 0 &&
        company.length === 0 &&
        experienta.length === 0;
      setDeletAll(allFieldsEmpty); // Set isEmpty to true if all fields are empty
    };

    checkFieldsEmpty(); // Call the function initially

    // Add fields dependency to re-run the effect whenever fields change
  }, [fields]);

  return (
    <TagsContext.Provider
      value={{
        q,
        city,
        county,
        remote,
        company,
        deletAll,
        fields,
        handleRemoveAllFilters,
        handleCheckBoxChange,
        removeTag,
        contextSetQ,
        contextSetCity,
        contextSetField
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export default TagsContext;
