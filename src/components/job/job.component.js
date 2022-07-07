import React from 'react';
import './job.style.scss';

import mapPointerIcon from '../../assets/images/map-pinter-icon.svg';

const Job = ({ company, city, title, link, isNew }) => {

  return (
    <section className='job'>
      <section className={`new ${isNew ? '' : 'hide'}`}>Nou</section>
      <section className='description'>
        <section className='details'>
          <section className='company'>Company</section>
          <section className='section'>
            <section className='title'>Title of a job that is job</section>
            <section className='location'><img src={mapPointerIcon} /> Location longer</section>
          </section>
          <section className='url'>https://peviitor.ro/dream-job-of-best-jobs-you-can-dream</section>
        </section>
        <section className='type'>full-tite | mid</section>
        <button className='btn'>Vezi jobul</button>
      </section>
    </section>
  )
}

export default Job;