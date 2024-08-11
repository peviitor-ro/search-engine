import React, { useContext, useEffect, useRef, useState } from "react";

import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";

import { useLocation } from "react-router-dom";

// scss
import "../scss/filtre.scss";

import FiltreCompanies from "./FiltreCompanies";
import FiltreCities from "./FiltreCities";
import { findParamInURL } from "../utils/urlManipulation";

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
      return { color: "#048a81" };
    } else if (index === 1 && fields.company.length >= 1) {
      return { color: "#048a81" };
    } else if (index === 2 && fields.remote.length >= 1) {
      return { color: "#048a81" };
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

  // Rendering the component
  return (
    <div className="drop-down-parent" ref={refDropdown}>
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button
            className="drop-down"
            onClick={() => handleDropDown(index)}
            style={getButtonStyle(index)}
          >
            {/* Dynamically set button label based on index */}
            {getButtonLabel(index)}
            {/* Arrow icon for indicating dropdown state */}
            <img
              src={sageata}
              className={`arrow-bottom ${isOpen ? "up" : ""}`}
              alt="drop-down"
            />
          </button>
          {/* Dropdown container */}
          <div className={`drop-down-container ${isOpen ? "open" : ""}`}>
            {/* Dynamically rendering checkbox based on index */}

            {/* Cities Drop-down */}
            {index === 0 && (
              <React.Fragment>
                <FiltreCities dropDown={dropDown} />
              </React.Fragment>
            )}

            {/* Companies Drop-down */}
            {index === 1 && (
              <React.Fragment>
                <FiltreCompanies dropDown={dropDown} />
              </React.Fragment>
            )}

            {index === 2 && (
              <React.Fragment>
                <div className="checkbox-remote">
                  <div>
                    <input
                      type="checkbox"
                      id="on-site"
                      name="on-site"
                      value="on-site"
                      className="mdl"
                      checked={fields.remote.includes("on-site")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="on-site">La fața locului</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="hibrid"
                      name="hibrid"
                      value="hibrid"
                      className="mdl"
                      checked={fields.remote.includes("hibrid")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="hibrid">Hibrid</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="Remote"
                      name="remote"
                      value="Remote"
                      className="mdl"
                      checked={fields.remote.includes("Remote")}
                      onChange={(e) => handleCheckBoxChange(e, "remote")}
                    />
                    <label htmlFor="Remote">La distanță</label>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltreGrup;
