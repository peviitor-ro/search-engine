import { createContext, useState, useEffect } from "react";

const TagsContext = createContext();

export const TagsProvider = ({ children }) => {
  const [fields, setFields] = useState(() => {
    const storedFields = JSON.parse(localStorage.getItem("fields"));
    return (
      storedFields || {
        orase: [],
        remote: [],
        company: [],
        experienta: [],
      }
    );
  });
  // string values
  // make them empty if in localStorage they don't exist.
  const [q, setQ] = useState(() => JSON.parse(localStorage.getItem("q")) || []);
  const [city, setCity] = useState(
    () => JSON.parse(localStorage.getItem("city")) || []
  );
  const [remote, setRemote] = useState(
    () => JSON.parse(localStorage.getItem("remote")) || []
  );
  const [company, setCompany] = useState(
    () => JSON.parse(localStorage.getItem("company")) || []
  );
  const [county] = useState([""]);
  const [country] = useState("România");

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
      [type]: updatedArray,
    }));
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

    // Update state with the updated array
    setFields((prevFields) => ({
      ...prevFields,
      [type]: updatedArray,
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
  function contextSetQ(text) {
    setQ(text);
  }
  // Update fields state from localStorage when component mounts
  useEffect(() => {
    setFields({
      orase: city,
      remote: remote,
      company: company,
      experienta: [],
    });
  }, [city, remote, company]);
  return (
    <TagsContext.Provider
      value={{
        q,
        city,
        county,
        remote,
        country,
        company,
        fields,
        handleCheckBoxChange,
        removeTag,
        contextSetQ,
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export default TagsContext;
