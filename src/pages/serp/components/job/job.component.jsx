import React from 'react';
import './job.style.scss';

import mapPin from '../../../../assets/svgs/map_pin.svg';
import arrowRight from '../../../../assets/svgs/arrow_right.svg';

export const Job = () => {

  return (
    <section className='job'>
      <h2 className='position'>Tester</h2>
      <p className='company'>EPAm Systems</p>
      <p className='location'><img src={mapPin} alt='map pin' className='icon' /> Remote | Full-time</p>
      <div className='button-position'>
        <button className='btn-yellow btn'>Vezi postul <img src={arrowRight} alt='arrow right' className='icon' /></button>
      </div>
    </section>
  )
}