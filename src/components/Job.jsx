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
  const [jobRemote] = React.useState(remote);
  const [jobCity] = React.useState(city);
  // Function to check and format remote location
  function checkRemote(remote) {
    // Check if remote is an array
    if (Array.isArray(remote)) {
      // If remote array contains only one element, return it
      if (remote.length === 1) {
        return remote[0];
      }
      // If remote array contains more than one element, join them with comma
      else if (remote.length > 1) {
        return remote.join(", ");
      }
    }
    // If remote is a string, return it
    else if (typeof remote === "string") {
      // Capitalize the first letter of the string
      const capitalizedRemote =
        remote.charAt(0).toUpperCase() + remote.slice(1);
      return capitalizedRemote;
    }
    // If remote is not an array or string, return empty string
    return "";
  }
  function checkLocation(city) {
    // Check if city is 'All', return 'Toate orasele'
    if (city[0] === "All" || city === "All") {
      return "Toate orasele";
    }

    let location = "";

    // Check if city is an array
    if (Array.isArray(city)) {
      if (city.length === 1) {
        location += city[0];
      } else if (city.length > 1) {
        location += city.join(", ");
      }
    } else if (typeof city === "string") {
      location += city;
    }

    return location;
  }
  return (
    <div className="card">
      <img className="company-logo" src={noLogo} alt="Logo" />
      <p className="company-name">{company}</p>
      <h2
        className="job-title"
        dangerouslySetInnerHTML={{ __html: job_title }}
      ></h2>
      {jobRemote &&
      jobRemote !== "nespecificat" &&
      jobRemote !== "on-site" &&
      jobRemote !== "on site" ? (
        <p className="location">
          <img src={mapPin} alt="map pin" className="icon" />
          {checkRemote(jobRemote)}
        </p>
      ) : (
        <p className="location">
          <img src={mapPin} alt="map pin" className="icon" />
          {checkLocation(jobCity)}
        </p>
      )}
      <a className="btn" target="_blank" href={job_link}>
        Către site
      </a>
    </div>
  );
};
export default Job;
