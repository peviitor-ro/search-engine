import React from 'react';
import './title.style.scss';

import { useSelector } from 'react-redux';

export const Title = ({ allJobs }) => {
  const isRomania = useSelector((state) => state.query.country);


  return (
    <section className='title'>
      <h1>Găsește-ți <span className='text--orange'>jobul dorit</span> acum</h1>
      {allJobs ? <p className='description'>Avem <span className='bold'>{allJobs} </span>de oportunități în acest moment {isRomania ? 'în România' : ''}</p> : ''}
    </section>
  );
};