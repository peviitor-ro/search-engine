import React from 'react';
import { Link } from 'react-router-dom';
import './logo.style.scss';

const Logo = () => {

  return (
    <section className='logo'>
      <h1><Link to='/' className='text'>pe viitor</Link></h1>
    </section>
  )
}

export default Logo;