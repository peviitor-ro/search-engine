import React from 'react';
import './banner.style.scss';

export const Banner = () => {

  return (
    <section className="banner">
      <h3 className='title'>Dorești să ajuți alți oameni?</h3>
      <p className='description'>Alătură-te cauzei noastre și devino un contribuitor.</p>
      <a href='https://www.oportunitatisicariere.ro/voluntari' target="_blank" rel="noreferrer" className='btn-yellow btn'>Alătură-te cauzei noastre</a>
    </section>
  )
}