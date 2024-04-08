// svg
import noLogo from "../assets/svg/no-logo.svg";
import mapPin from "../assets/svg/map_pin.svg";
// scss
import "../scss/job.scss";
// react
import React from "react";
const Job = ({
  city,
  company,
  country,
  county,
  job_link,
  job_title,
  remote
}) => {
  function displayLocation(cities) {
    return cities
      ? cities[0].toLowerCase() === "all"
        ? "Toate orasele"
        : cities.length > 5
        ? `${cities.slice(0, 5).join(", ")} + ${cities.length - 5}`
        : cities.join(", ")
      : remote.join(", ");
  }
  return (
    <div className="card">
      <img className="company-logo" src={noLogo} alt="Logo" />
      <p className="company-name">{company}</p>
      <h2 className="job-title">{job_title}</h2>
      <p className="location">
        <img src={mapPin} alt="map pin" className="icon" />
        {displayLocation(city)}
      </p>

      <a
        className="btn"
        rel="noopener noreferrer"
        target="_blank"
        href={job_link}
      >
        Către site
      </a>
    </div>
  );
};
export default Job;
