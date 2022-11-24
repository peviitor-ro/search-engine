import React from 'react';
import './topbar.style.scss';
import logo from '../../assets/svgs/peviitor_logo.svg';
import briefcase from '../../assets/svgs/briefcase.svg';
import { Link } from "react-router-dom";

export const TopBar = ({ isBorder, resetPage }) => {

  return (
    <section className={`topbar ${isBorder ? 'topbar--border-bottom' : ''}`}>
      <Link to={'/'}><img src={logo} alt='pe viitor logo' onClick={resetPage} /></Link>
      <a href="https://www.oportunitatisicariere.ro/voluntari" target="_blank" rel='noreferrer'><img src={briefcase} alt='briefcase logo' className='icon-briefcase' /> Alătură-te</a>
    </section>
  );
};