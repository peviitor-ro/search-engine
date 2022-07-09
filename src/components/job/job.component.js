import React from 'react';
import './job.style.scss';

import mapPointerIcon from '../../assets/images/map-pinter-icon.svg';

import { useNavigate } from "react-router-dom";

const Job = ({ company, city, title, link, isNew }) => {
  let navigate = useNavigate();

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
        <a className='btn' target='_blank' href='https://www.google.com'>Vezi jobul</a>
      </section>
    </section>
  )
}

export default Job;