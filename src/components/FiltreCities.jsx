import { useContext, useEffect, useState } from "react";
import TagsContext from "../context/TagsContext";
import { MapPin } from "lucide-react";
import { orase } from "../utils/getCityName";
import InputField from "@/components/ui/input-field";
import DropdownSearch from "@/components/ui/dropdown-search";
import getCityMatch from "../utils/getCityMatch";

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
    const filtered = getCityMatch(value);

    // Update the state with the filtered list of items
    setFilteredItems(filtered);
  };

  // Reset the search back to the full list of cities
  const handleClear = () => {
    setInputValue("");
    setFilteredItems(orase);
  };

  // Effect to handle error when no results are found
  useEffect(() => {
    setError(filteredItems.length === 0 && inputValue.length > 0);
  }, [filteredItems, inputValue]);

  return (
    <div className="flex flex-col">
      <DropdownSearch
        value={inputValue}
        placeholder="Caută oraș"
        onChange={handleInputChange}
        onClear={handleClear}
      />

      <div className="flex w-[260px] h-[220px] flex-col overflow-y-auto overflow-x-hidden scrollbar-class px-2 pb-2">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
            <MapPin className="h-6 w-6 text-border_grey" aria-hidden="true" />
            <p className="text-sm text-text_grey_darker">
              Nu există rezultate pentru „{inputValue}”
            </p>
          </div>
        ) : (
          filteredItems.map((item, index) => (
            <InputField
              key={index}
              type="checkbox"
              id={item}
              name="orase"
              value={item}
              checked={fields["orase"].includes(item)}
              onChange={(e) => handleCheckBoxChange(e, "orase")}
              inputType="checkBoxType"
              label={item}
              item={item}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default FiltreCities;
