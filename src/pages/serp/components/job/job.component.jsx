import React from 'react';
import './job.style.scss';

import mapPin from '../../../../assets/svgs/map_pin.svg';
import arrowRight from '../../../../assets/svgs/arrow_right.svg';

export const Job = ({ jobTitle, company, city, county, link, remote }) => {
  const [jobCity] = React.useState(city);
  const [jobCounty] = React.useState(county);
  const [jobRemote] = React.useState(remote);

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
        return remote.join(', ');
      }
    }
    // If remote is a string, return it
    else if (typeof remote === 'string') {
      // Capitalize the first letter of the string
      const capitalizedRemote =
        remote.charAt(0).toUpperCase() + remote.slice(1);
      return capitalizedRemote;
    }
    // If remote is not an array or string, return empty string
    return '';
  }
  function checkLocation(city, county) {
    // Check if city is 'All', return 'Toate orasele'
    if (city[0] === 'All' || city === 'All') {
      return 'Toate orasele';
    }

    let location = '';

    // Check if city is an array
    if (Array.isArray(city)) {
      if (city.length === 1) {
        location += city[0];
      } else if (city.length > 1) {
        location += city.join(', ');
      }
    } else if (typeof city === 'string') {
      location += city;
    }

    // If county is provided and not 'nespecificat', add it after the city
    if (county && county !== 'nespecificat') {
      // Ensure county is treated as string
      county = Array.isArray(county) ? county.join(', ') : String(county);
      location += `, ${county}`;
    }

    return location;
  }

  return (
    <section className="job">
      <div className="details">
        <h2
          className="position"
          dangerouslySetInnerHTML={{ __html: jobTitle }}
        ></h2>
        <p className="company">{company}</p>
        {jobRemote &&
        jobRemote.toLowerCase() !== 'nespecificat' &&
        jobRemote.toLowerCase() !== 'on-site' &&
        jobRemote.toLowerCase() !== 'on site' ? (
          <p className="location">
            <img src={mapPin} alt="map pin" className="icon" />
            {checkRemote(jobRemote)}
          </p>
        ) : (
          <p className="location">
            <img src={mapPin} alt="map pin" className="icon" />
            {checkLocation(jobCity, jobCounty)}
          </p>
        )}
      </div>
      <div className="button-position">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="btn-yellow btn"
        >
          Vezi postul{' '}
          <img src={arrowRight} alt="arrow right" className="icon" />
        </a>
      </div>
    </section>
  );
};
