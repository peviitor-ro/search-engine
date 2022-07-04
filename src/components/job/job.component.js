import React from 'react';
import './job.style.scss';

const Job = ({ company, city, title, link, isNew }) => {

  return (
    <section className='job'>
      <section className={`job__new ${isNew ? '' : 'hide'}`}>Nou</section>
      <section className='job__description'>
        <section className='job__details'>
          <section className='job__company'>Company</section>
          <section className='job__section'>
            <section className='job__title'>Title</section>
            <section className='job__location'><img /> Location</section>
          </section>
          <section className='job__url'>url</section>
        </section>
        <section className='job__tipe'>full-tite | mid</section>
        <button className='job__btn'>Vezi jobul</button>
      </section>
    </section>
  )
}

export default Job;