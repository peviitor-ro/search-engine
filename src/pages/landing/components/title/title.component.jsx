import React from 'react';
import './title.style.scss';

import { useSelector } from 'react-redux';

export const Title = ({ allJobs, totalJobs }) => {
  const isRomania = useSelector((state) => state.query.country);
  const totalCompanies = useSelector((state) => state.jobs.totalCompanies);

  return (
    <section className="title">
      <h1 className="text--orange main-heading">
        Locul de munca <br /> visat, la un clic <br /> distanta
      </h1>
      {allJobs && totalCompanies ? (
        <p className="description">
          Peste <span className="bold">{isRomania ? allJobs : totalJobs} </span>
          locuri de munca {isRomania ? 'în România' : 'în toate țările'} <br />
          actualizate zilnic
        </p>
      ) : (
        ''
      )}
    </section>
  );
};
