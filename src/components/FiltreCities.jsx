import React, { useContext, useEffect, useState } from "react";
import TagsContext from "../context/TagsContext";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
import { orase } from "../utils/getCityName";
import InputField from "./InputField";
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

  // Effect to handle error when no results are found
  useEffect(() => {
    setError(filteredItems.length === 0 && inputValue.length > 0);
  }, [filteredItems, inputValue]);

   
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center gap-1 border-b-[1px] border-border_grey">
        <img
          src={magnifyGlass}
          alt="magnify-glass"
          className="relative left-0 w-[20px] ml-1"
        />
        <InputField 
          value={inputValue}
          placeholder={`Caută oraș`}
          onChange={handleInputChange}
          inputType="searchType"
          type="search" />
      </div>

      <div className="flex flex-col  py-[1px] px-1 w-[230px] h-[220px] overflow-y-auto scrollbar-class overflow-x-hidden">
        {error ? (
          <div className="pl-[10px]">Nu există rezultate "{inputValue}"</div>
        ) : (
          filteredItems.map((item, index) => (
              <InputField key={index}
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
      <div className="h-3"></div>
    </div>
  );
};

export default FiltreCities;