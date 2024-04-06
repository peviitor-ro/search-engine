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
  function renderCity() {
    return (
      <p className="location">
        <img src={mapPin} alt="map pin" className="icon" />
        {city.length > 0 && city[0].toLowerCase() === "all"
          ? "Toate orasele"
          : city.length > 5
          ? `${city.slice(0, 5).join(", ")} +${city.length - 5}`
          : city.join(", ")}
      </p>
    );
  }
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
          {remote && remote.length > 1
            ? `${remote.slice(0, 5).join(", ")} +${remote.length - 5}`
            : remote
            ? remote.join(", ")
            : null}
        </p>
      ) : (
        renderCity()
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
