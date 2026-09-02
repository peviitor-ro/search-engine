import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  findParamInURL,
  updateUrlParams
} from "../utils/urlManipulation";

const TagsContext = createContext();

function arraysEqual(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b)) return a === b;
  if (a.length !== b.length) return false;
  return a.every((value, idx) => value === b[idx]);
}

export const TagsProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [fields, setFields] = useState({
    orase: [],
    remote: [],
    company: [],
    county: [],
    experienta: []
  });

  // State hooks initialized from URL
  const [q, setQ] = useState(() => findParamInURL("q") || []);
  const [city, setCity] = useState(() => findParamInURL("orase") || []);
  const [remote, setRemote] = useState(() => findParamInURL("remote") || []);
  const [company, setCompany] = useState(() => findParamInURL("company") || []);
  const [county, setCounty] = useState(() => findParamInURL("judete") || []);

  const getCurrentParams = useCallback(() => {
    const rawSearch = location.hash.includes("?")
      ? location.hash.split("?")[1]
      : location.search;
    return new URLSearchParams(rawSearch);
  }, [location.hash, location.search]);

  // Use replace: false only for explicit user actions (like checkboxes)
  const handleCheckBoxChange = (e, type) => {
    const { value, checked } = e.target;
    const params = getCurrentParams();

    const currentValues = params.get(type) ? params.get(type).split(",") : [];
    let updatedValues = [...currentValues];

    if (checked) {
      if (!updatedValues.includes(value)) updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    if (updatedValues.length > 0) {
      params.set(type, updatedValues.join(","));
    } else {
      params.delete(type);
    }

    const targetPath = location.pathname.includes("rezultate") ? location.pathname : "/rezultate";
    navigate(`${targetPath}?${params.toString()}`, { replace: false });
  };

  const removeTag = (type, value) => {
    const params = getCurrentParams();
    const currentParam = params.get(type);

    if (!currentParam) return;

    const updatedValues = currentParam
      .split(",")
      .filter((item) => item.trim() !== String(value).trim());

    if (updatedValues.length > 0) {
      params.set(type, updatedValues.join(","));
    } else {
      params.delete(type);
    }

    const targetPath = location.pathname.includes("rezultate") ? location.pathname : "/rezultate";
    navigate(`${targetPath}?${params.toString()}`, { replace: false });
  };

  // Context Setters - use replace: true so they don't bloat the history stack
  const contextSetQ = useCallback((text) => {
    const cleanText = Array.isArray(text) ? text.filter(Boolean) : (text ? [text] : []);
    setQ((prev) => {
      if (arraysEqual(prev, cleanText)) return prev;
      updateUrlParams({ q: cleanText }, true); // Pass true for replaceState
      return cleanText;
    });
  }, []);

  const contextSetCity = useCallback((text) => {
    const cleanText = Array.isArray(text) ? text.filter(Boolean) : (text ? [text] : []);
    setCity((prev) => {
      if (arraysEqual(prev, cleanText)) return prev;
      updateUrlParams({ orase: cleanText }, true);
      return cleanText;
    });
  }, []);

  const contextSetCounty = useCallback((text) => {
    const cleanText = Array.isArray(text) ? text.filter(Boolean) : (text ? [text] : []);
    setCounty((prev) => {
      if (arraysEqual(prev, cleanText)) return prev;
      updateUrlParams({ judete: cleanText }, true);
      return cleanText;
    });
  }, []);

  const contextSetCompany = useCallback((text) => {
    const cleanText = Array.isArray(text) ? text.filter(Boolean) : (text ? [text] : []);
    setCompany((prev) => {
      if (arraysEqual(prev, cleanText)) return prev;
      updateUrlParams({ company: cleanText }, true);
      return cleanText;
    });
  }, []);

  const contextSetRemote = useCallback((text) => {
    const cleanText = Array.isArray(text) ? text.filter(Boolean) : (text ? [text] : []);
    setRemote((prev) => {
      if (arraysEqual(prev, cleanText)) return prev;
      updateUrlParams({ remote: cleanText }, true);
      return cleanText;
    });
  }, []);

  const contextSetField = useCallback((fieldName, value) => {
    const allowedFields = ["orase", "remote", "company", "judete"];
    if (!allowedFields.includes(fieldName) || !value) return;

    const newValue = Array.isArray(value) ? value : [value];

    switch (fieldName) {
      case "orase":
        setCity(newValue);
        updateUrlParams({ orase: newValue }, true);
        break;
      case "remote":
        setRemote(newValue);
        updateUrlParams({ remote: newValue }, true);
        break;
      case "company":
        setCompany(newValue);
        updateUrlParams({ company: newValue }, true);
        break;
      case "judete":
        setCounty(newValue);
        updateUrlParams({ judete: newValue }, true);
        break;
      default:
        return;
    }

    setFields((prev) => ({ ...prev, [fieldName]: newValue }));
  }, []);

  useEffect(() => {
    setFields({
      orase: city.filter(Boolean),
      remote: remote.filter(Boolean),
      company: company.filter(Boolean),
      county: county.filter(Boolean),
      experienta: []
    });
  }, [city, remote, company, county]);

  const [deleteAll, setDeleteAll] = useState(false);

  const handleRemoveAllFilters = () => {
    const params = getCurrentParams();
    const qValue = params.get("q");
    const newParams = new URLSearchParams();
    if (qValue) newParams.set("q", qValue);

    const targetPath = location.pathname.includes("rezultate") ? location.pathname : "/rezultate";
    navigate(`${targetPath}?${newParams.toString()}`, { replace: false });
  };

  useEffect(() => {
    const { orase, remote, company, county, experienta } = fields;
    const allFieldsEmpty =
      orase.length === 0 &&
      remote.length === 0 &&
      company.length === 0 &&
      county.length === 0 &&
      experienta.length === 0;
    setDeleteAll(allFieldsEmpty);
  }, [fields]);

  return (
    <TagsContext.Provider
      value={{
        q,
        city,
        county,
        remote,
        company,
        deleteAll,
        deletAll: deleteAll,
        fields,
        handleRemoveAllFilters,
        handleCheckBoxChange,
        removeTag,
        contextSetQ,
        contextSetCity,
        contextSetField,
        contextSetCounty,
        contextSetCompany,
        contextSetRemote
      }}
    >
      {children}
    </TagsContext.Provider>
  );
};

export default TagsContext;