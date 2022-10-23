import React from 'react';
import './topbar.style.scss';
import logo from '../../assets/svgs/peviitor_logo.svg';
import briefcase from '../../assets/svgs/briefcase.svg';
import { Link } from "react-router-dom";

export const TopBar = ({ isBorder }) => {

  return (
    <section className={`topbar ${isBorder ? 'topbar--border-bottom' : ''}`}>
      <img src={logo} alt='pe viitor logo' />
      <Link to={'/alaturate'} ><img src={briefcase} alt='briefcase logo' className='icon-briefcase' /> Alătură-te</Link>
    </section>
  );
};