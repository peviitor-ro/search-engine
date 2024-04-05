import React, { useContext, useState } from "react";

import TagsContext from "../context/TagsContext";
import sageata from "../assets/svg/arrow_bottom.svg";
import magnifyGlass from "../assets/svg/magniy_glass_icon.svg";
// scss
import "../scss/filtre.scss";

const FiltreGrup = () => {
  const [text, setText] = useState("");

  function handleClearX() {
    setText("");
  }
  // Destructuring fields and handleCheckBoxChange from the context
  const { fields, handleCheckBoxChange } = useContext(TagsContext);

  // State for dropdown visibility
  const [dropDown, setDropDown] = useState([false, false, false]);

  // Function to handle dropdown toggle
  function handleDropDown(index) {
    // Toggle the dropdown at the specified index
    const updatedDropDown = dropDown.map((item, i) =>
      i === index ? !item : false
    );
    setDropDown(updatedDropDown);
  }

  // Rendering the component
  return (
    <div className="drop-down-parent">
      {/* Mapping through each dropdown */}
      {dropDown.map((isOpen, index) => (
        <div key={index}>
          {/* Button for toggling the dropdown */}
          <button className="drop-down" onClick={() => handleDropDown(index)}>
            {/* Dynamically set button label based on index */}
            {index === 0
              ? "Oras"
              : index === 1
              ? "Companie"
              : "Mod de lucru"}{" "}
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
            {index === 0 && (
              <React.Fragment>
                <div className="search-input">
                  <img
                    className="lupa"
                    src={magnifyGlass}
                    alt="magnify-glass"
                  />
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cauta orasul"
                  />
                  {text.length !== 0 ? (
                    <span className="clear" onClick={handleClearX}>
                      <svg
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="15px"
                        height="15px"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                      </svg>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <input
                  type="checkbox"
                  id="București"
                  name="orase"
                  value="București"
                  className="check-box"
                  checked={fields.orase.includes("București")}
                  onChange={(e) => handleCheckBoxChange(e, "orase")}
                />
                <label htmlFor="București">București</label>
              </React.Fragment>
            )}
            {index === 1 && (
              <React.Fragment>
                <div className="search-input">
                  <img
                    className="lupa"
                    src={magnifyGlass}
                    alt="magnify-glass"
                  />

                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Cauta firma"
                  />
                  {text.length !== 0 ? (
                    <span className="clear" onClick={handleClearX}>
                      <svg
                        focusable="false"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="15px"
                        height="15px"
                      >
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                      </svg>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <input
                  type="checkbox"
                  id="AxonSoft"
                  name="company"
                  value="AxonSoft"
                  className="check-box"
                  checked={fields.company.includes("AxonSoft")}
                  onChange={(e) => handleCheckBoxChange(e, "company")}
                />
                <label htmlFor="AxonSoft">AxonSoft</label>
              </React.Fragment>
            )}
            {index === 2 && (
              <React.Fragment>
                <input
                  type="checkbox"
                  id="Remote"
                  name="remote"
                  value="Remote"
                  className="check-box mdl"
                  checked={fields.remote.includes("Remote")}
                  onChange={(e) => handleCheckBoxChange(e, "remote")}
                />
                <label htmlFor="Remote">Remote</label>
              </React.Fragment>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FiltreGrup;
