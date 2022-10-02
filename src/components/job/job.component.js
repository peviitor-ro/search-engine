import React from 'react';
import './job.style.scss';

import mapPointerIcon from '../../assets/images/map-pinter-icon.svg';

const Job = ({ company, city, title, link, isNew }) => {

  return (
    <article className='job'>
      {/* <section className={`new ${isNew ? '' : 'hide'}`}>Nou</section> */}
      <section className='description'>
        <section className='details'>
          <section className='company'>{company}</section>
          <section className='section'>
            <section className='title'>{title}</section>
            {/* <section className='location'><img src={mapPointerIcon} alt="location-icon" /> {city}</section> */}
          </section>
          <section className='url'>{link}</section>
        </section>
        <a className='btn' target='_blank' rel="noopener noreferrer" href={link}>Vezi jobul</a>
      </section>
    </article>
  )
}

export default Job;