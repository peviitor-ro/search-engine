import React, { useContext, useEffect, useRef, useState } from "react";
import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";
import { useLocation } from "react-router-dom";
import FiltreCompanies from "./FiltreCompanies";
import FiltreCities from "./FiltreCities";
import { findParamInURL } from "../utils/urlManipulation";
import InputField from "./InputField";

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

  // Function to get button style based on index and fields
  const getButtonStyle = (index) => {
    if (index === 0 && fields.orase.length >= 1) {
      return { color: "#F3781D" };
    } else if (index === 1 && fields.company.length >= 1) {
      return { color: "#F3781D" };
    } else if (index === 2 && fields.remote.length >= 1) {
      return { color: "#F3781D" };
    } else {
      return {};
    }
  };

  // Function to get button label based on index and fields
  const getButtonLabel = (index) => {
    if (index === 0) {
      return `Oraș ${
        fields.orase.length >= 1 ? `(${fields.orase.length})` : ""
      }`;
    } else if (index === 1) {
      return `Companie ${
        fields.company.length >= 1 ? `(${fields.company.length})` : ""
      }`;
    } else {
      return `Mod de lucru ${
        fields.remote.length >= 1 ? `(${fields.remote.length})` : ""
      }`;
    }
  };

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
      className="flex items-center justify-center flex-wrap mt-2 md:mx-auto w-fit gap-4 md:gap-4 relative font-PoppinsRegular z-10"
      ref={refDropdown}
    >
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button
            className={`${
              isOpen ? "text-background_green" : ""
            } ${getButtonStyle(
              index
            )} flex items-baseline bg-none border-none px-4 py-2 cursor-pointer hover:text-background_green`}
            onClick={() => handleDropDown(index)}
            style={getButtonStyle(index)}
          >
            {/* Dynamically set button label based on index */}
            {getButtonLabel(index)}
            {/* Arrow icon for indicating dropdown state */}
            <img
              src={sageata}
              className={`${isOpen ? "rotate-180" : ""} ml-2`}
              alt="drop-down"
            />
          </button>
          {/* Dropdown container */}
          <div
            className={`${
              isOpen ? "block" : "hidden"
            }  text-lg py-1 border border-background_green rounded-3xl shadow-checbox_shadow absolute bg-white left-1/2 transform -translate-x-1/2 md:left-auto md:transform-none`}
          >
            {/* Cities Drop-down */}
            {index === 0 && <FiltreCities dropDown={dropDown} />}

            {/* Companies Drop-down */}
            {index === 1 && <FiltreCompanies dropDown={dropDown} />}

            {index === 2 && (
              <div
                key={index}
                className="w-[190px] flex flex-col px-2 pt-[30px] pb-[30px]"
              >
                <InputField
                  type="checkbox"
                  id="on-site"
                  name="on-site"
                  value="on-site"
                  checked={fields.remote.includes("on-site")}
                  onChange={(e) => handleCheckBoxChange(e, "remote")}
                  inputType="checkBoxType"
                  label="La fața locului"
                  item="on-site"
                />
                <InputField
                  type="checkbox"
                  id="Hybrid"
                  name="Hybrid"
                  value="Hybrid"
                  checked={fields.remote.includes("Hybrid")}
                  onChange={(e) => handleCheckBoxChange(e, "remote")}
                  inputType="checkBoxType"
                  label="Hibrid"
                  item="Hybrid"
                />
                <InputField
                  type="checkbox"
                  id="Remote"
                  name="remote"
                  value="Remote"
                  checked={fields.remote.includes("Remote")}
                  onChange={(e) => handleCheckBoxChange(e, "remote")}
                  inputType="checkBoxType"
                  label="La distanță"
                  item="Remote"
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltreGrup;
