import React from 'react';
import './job.style.scss';

import mapPin from '../../../../assets/svgs/map_pin.svg';
import arrowRight from '../../../../assets/svgs/arrow_right.svg';

export const Job = ({ jobTitle, company, city, county, link }) => {
  const [jobCity] = React.useState(city);
  const [jobCounty] = React.useState(county);

  return (
    <section className="job">
      <div className="details">
        <h2
          className="position"
          dangerouslySetInnerHTML={{ __html: jobTitle }}
        ></h2>
        <p className="company">{company}</p>
        <p className="location">
          <img src={mapPin} alt="map pin" className="icon" />
          {`${jobCity}, ${jobCounty}`}
        </p>
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
