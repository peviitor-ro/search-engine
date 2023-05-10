import React from 'react';
import './title.style.scss';

import { useSelector } from 'react-redux';

export const Title = ({ allJobs }) => {
  const isRomania = useSelector((state) => state.query.country);
  const totalCompanies = useSelector((state) => state.jobs.totalCompanies);

  return (
    <section className='title'>
      <h1>Găsește-ți <span className='text--orange'>jobul dorit</span> acum</h1>
      {allJobs && totalCompanies ? <p className='description'>Avem <span className='bold'>{allJobs} </span>de oportunități de la <span className='bold'>{totalCompanies}</span> firme {isRomania ? 'în România' : ''}</p> : ''}
    </section>
  );
};