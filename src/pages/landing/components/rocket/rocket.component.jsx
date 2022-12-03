import React from 'react';
import './rocket.style.scss';

import rocket from '../../../../assets/svgs/rocket_logo_peviitor.svg';
import arrowBottom from '../../../../assets/svgs/arrow_bottom.svg';

export const Rocket = () => {

  return (
    <section className='rocket'>
      <img src={rocket} alt='rocket peviitor' className='rocket-image' />
      {/* <p className='text'>Cele mai populare oferte de muncă <span className='action'><span className='text--orange accent'>remote</span><img src={arrowBottom} alt='arrow bottom' className='arrow-bottom' /></span></p> */}
      <p className='text'></p>
    </section>
  )
}