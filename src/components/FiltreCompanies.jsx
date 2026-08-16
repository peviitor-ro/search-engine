import { useContext, useEffect, useState } from "react";
import { getNameOfCompanies } from "../utils/fetchData";
import TagsContext from "../context/TagsContext";
import { Building2, Loader2 } from "lucide-react";
import InputField from "@/components/ui/input-field";
import DropdownSearch from "@/components/ui/dropdown-search";

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

const FiltreCompanies = () => {
  const [inputCompany, setInputCompany] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  // idle = nothing typed, hint = fewer than 3 letters, loading, empty, results
  const [status, setStatus] = useState("idle");
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  const debouncedInput = useDebounce(inputCompany, 300);

  useEffect(() => {
    let cancelled = false;

    const fetchFilteredCompanies = async () => {
      const searchTerm = debouncedInput.trim();

      if (searchTerm.length === 0) {
        setFilteredCompanies([]);
        setStatus("idle");
        return;
      }

      if (searchTerm.length < 3) {
        setFilteredCompanies([]);
        setStatus("hint");
        return;
      }

      setStatus("loading");
      try {
        const companies = (await getNameOfCompanies(searchTerm)) || [];
        // Ignore a response that arrived after the query moved on
        if (cancelled) return;
        setFilteredCompanies(companies);
        setStatus(companies.length > 0 ? "results" : "empty");
      } catch (err) {
        console.error("Error fetching companies:", err);
        if (cancelled) return;
        setFilteredCompanies([]);
        setStatus("empty");
      }
    };

    fetchFilteredCompanies();

    return () => {
      cancelled = true;
    };
  }, [debouncedInput]);

  const handleInputChange = (e) => {
    setInputCompany(e.target.value.toUpperCase());
  };

  const handleClear = () => {
    setInputCompany("");
    setFilteredCompanies([]);
    setStatus("idle");
  };

  return (
    <div className="flex flex-col">
      <DropdownSearch
        value={inputCompany}
        placeholder="Caută companie"
        onChange={handleInputChange}
        onClear={handleClear}
      />

      <div className="flex w-[260px] h-[220px] flex-col overflow-y-auto overflow-x-hidden scrollbar-class px-2 pb-2">
        {status === "results" ? (
          filteredCompanies.map((name, index) => (
            <InputField
              key={index}
              type="checkbox"
              id={name}
              name="company"
              value={name}
              checked={fields["company"]?.includes(name) || false}
              onChange={(e) => handleCheckBoxChange(e, "company")}
              inputType="checkBoxType"
              label={name}
              item={name}
            />
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            {status === "loading" ? (
              <Loader2 className="h-5 w-5 animate-spin text-background_green" />
            ) : (
              <Building2
                className="h-6 w-6 text-border_grey"
                aria-hidden="true"
              />
            )}
            <p className="text-sm text-text_grey_darker">
              {status === "idle" &&
                "Scrie numele unei companii pentru a o căuta."}
              {status === "hint" && "Introdu cel puțin 3 litere."}
              {status === "loading" && "Se caută…"}
              {status === "empty" && (
                <>Nu există rezultate pentru „{inputCompany.trim()}”</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltreCompanies;
