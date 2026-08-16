import { useContext, useEffect, useRef, useState } from "react";
import TagsContext from "../context/TagsContext";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
import FiltreCompanies from "./FiltreCompanies";
import FiltreCities from "./FiltreCities";
import { findParamInURL } from "../utils/urlManipulation";
import InputField from "@/components/ui/input-field";
import { cn } from "@/lib/utils";

const FiltreGrup = () => {
  const location = useLocation();
  // use it for closing dropdown on click
  const refDropdown = useRef();

  // Destructuring fields and handleCheckBoxChange from the context
  const { fields, handleCheckBoxChange, contextSetField } =
    useContext(TagsContext);

  // State for dropdown visibility
  const [dropDown, setDropDown] = useState([false, false, false]);

  useEffect(() => {
    //Keeping the state in sync with the URL params
    const cityParam = findParamInURL("orase");
    const remoteParam = findParamInURL("remote");
    const companyParam = findParamInURL("company");
    contextSetField("orase", cityParam);
    contextSetField("remote", remoteParam);
    contextSetField("company", companyParam);
  }, [contextSetField, location.search]);

  // Function to handle dropdown toggle
  function handleDropDown(index) {
    // Toggle the dropdown at the specified index
    const updatedDropDown = dropDown.map((item, i) =>
      i === index ? !item : false
    );
    setDropDown(updatedDropDown);
  }

  // Label + the field each dropdown filters on, in dropdown order
  const filterMeta = [
    { label: "Localitate", field: "orase" },
    { label: "Companie", field: "company" },
    { label: "Mod de lucru", field: "remote" }
  ];

  // How many values are currently selected for the dropdown at `index`
  const getSelectedCount = (index) =>
    fields[filterMeta[index].field]?.length || 0;

  // For closing dropDown on click
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      // when its clicked outside the dropdown, then will close the dropdown
      if (
        dropDown &&
        refDropdown.current &&
        !refDropdown.current.contains(e.target)
      ) {
        setDropDown([false, false, false]);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [dropDown]);

  return (
    <div
      className="flex items-center justify-center flex-wrap mt-2 mx-auto w-fit gap-2 md:gap-4 relative font-PoppinsRegular z-10"
      ref={refDropdown}
    >
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => {
        const selectedCount = getSelectedCount(index);
        const hasSelection = selectedCount > 0;

        return (
          // `static` on mobile so the panel centers under the whole group,
          // `relative` from md up so it anchors to its own trigger.
          <div key={index} className="static md:relative">
            {/* Button for toggling the dropdown */}
            <button
              type="button"
              aria-expanded={isOpen}
              className={cn(
                "flex items-center gap-2 rounded-full border px-4 py-2 text-sm cursor-pointer transition-colors",
                hasSelection
                  ? "border-background_green bg-background_green text-white"
                  : "border-border_grey bg-white text-text_grey hover:border-background_green hover:text-background_green",
                isOpen &&
                  !hasSelection &&
                  "border-background_green text-background_green"
              )}
              onClick={() => handleDropDown(index)}
            >
              {filterMeta[index].label}
              {hasSelection && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs">
                  {selectedCount}
                </span>
              )}
              {/* Arrow icon for indicating dropdown state */}
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            {/* Dropdown container */}
            <div
              className={cn(
                "absolute top-full mt-2 z-20 overflow-hidden rounded-2xl border border-border_grey bg-white shadow-checbox_shadow",
                "left-1/2 -translate-x-1/2 md:translate-x-0",
                index === 2 ? "md:left-auto md:right-0" : "md:left-0",
                isOpen ? "block" : "hidden"
              )}
            >
              {/* Cities Drop-down */}
              {index === 0 && <FiltreCities dropDown={dropDown} />}

              {/* Companies Drop-down */}
              {index === 1 && <FiltreCompanies dropDown={dropDown} />}

              {index === 2 && (
                <div className="flex w-[240px] flex-col p-3">
                  <InputField
                    type="checkbox"
                    id="on-site"
                    name="on-site"
                    value="on-site"
                    checked={fields.remote.includes("on-site")}
                    onChange={(e) => handleCheckBoxChange(e, "remote")}
                    inputType="checkBoxType"
                    label="Fizic"
                    item="on-site"
                  />
                  <InputField
                    type="checkbox"
                    id="hybrid"
                    name="hybrid"
                    value="hybrid"
                    checked={fields.remote.includes("hybrid")}
                    onChange={(e) => handleCheckBoxChange(e, "remote")}
                    inputType="checkBoxType"
                    label="Hibrid"
                    item="hybrid"
                  />
                  <InputField
                    type="checkbox"
                    id="remote"
                    name="remote"
                    value="remote"
                    checked={fields.remote.includes("remote")}
                    onChange={(e) => handleCheckBoxChange(e, "remote")}
                    inputType="checkBoxType"
                    label="La distanță"
                    item="remote"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FiltreGrup;
