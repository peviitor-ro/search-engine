import React from 'react';
import './header.style.scss';
import logo from '../../assets/svgs/peviitor-logo.svg';
import briefcase from '../../assets/svgs/briefcase.svg';
import { Link } from "react-router-dom";

export const Header = () => {

  return (
    <header className='header'>
      <img src={logo} alt='pe viitor logo' />
      <Link to={'alaturate'}><img src={briefcase} alt='briefcase logo' className='icon-briefcase' /> Alătură-te</Link>
    </header>
  );
};