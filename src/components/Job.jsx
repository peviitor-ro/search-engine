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
  return (
    <div className="card">
      <img className="company-logo" src={noLogo} alt="Logo" />
      <p className="company-name">{company}</p>
      <h2
        className="job-title"
        dangerouslySetInnerHTML={{ __html: job_title }}
      ></h2>
      {city === undefined ? (
        <p className="location">
          <img src={mapPin} alt="map pin" className="icon" />
          {remote.length > 1 ? `${remote.join(", ")},` : `${remote}`}
        </p>
      ) : (
        <p className="location">
          <img src={mapPin} alt="map pin" className="icon" />
          {city.length > 0 && (city.includes("All") || city.includes("all"))
            ? "Toate orasele"
            : city.join(",")}
        </p>
      )}
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
