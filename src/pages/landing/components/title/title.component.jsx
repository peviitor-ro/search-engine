import React from 'react';
import './title.style.scss';

export const Title = ({ totalRomania }) => {

  return (
    <section className='title'>
      <h1>Găsește-ți <span className='text--orange'>jobul dorit</span> acum</h1>
      {totalRomania ? <p className='description'>Avem <span className='bold'>{totalRomania} </span>de oportunități în acest moment în România</p> : ''}
    </section>
  );
};