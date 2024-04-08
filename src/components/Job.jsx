// svg
import noLogo from "../assets/svg/no-logo.svg";
import mapPin from "../assets/svg/map_pin.svg";
// scss
import "../scss/job.scss";
// react
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getLogoOfCompanies } from "../utils/fetchData";
const Job = ({
  city,
  company,
  country,
  county,
  job_link,
  job_title,
  remote
}) => {
  const [logoData, setLogoData] = useState([]);

  // fetch data for logo
  useEffect(() => {
    const fetchLogoData = async () => {
      const logoData = await getLogoOfCompanies();
      setLogoData(logoData);
    };

    fetchLogoData();
  }, []);

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

  const renderCompanyLogo = (companyName) => {
    // check if copmany name is the same as logo name
    const company = logoData.find((item) => item.name === companyName);
    if (company) {
      return company.logo;
    } else {
      // If company logo doesn't exist return "noLogo" placeholder
      return noLogo;
    }
  };

  return (
    <div className="card">
      <div className="container-logo">
        <img
          className="company-logo"
          src={renderCompanyLogo(company !== undefined && company[0])}
          alt={company}
          onError={(e) => (e.target.src = noLogo)}
        />
      </div>

      <div className="card-info">
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
    </div>
  );
};
export default Job;
