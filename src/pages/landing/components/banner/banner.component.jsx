import React from 'react';
import { useNavigate } from 'react-router-dom';
import './banner.style.scss';

export const Banner = () => {
  let navigate = useNavigate();

  return (
    <section className="banner">
      <h3 className='title'>Doresți să ajuți alți oameni?</h3>
      <p className='description'>Alătură-te cauzei noastre si devino un contribuitor.</p>
      <button onClick={() => { navigate('alaturate') }} className='btn-yellow btn'>Alătură-te cauzei noastre</button>
    </section>
  )
}