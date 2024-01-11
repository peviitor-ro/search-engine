import React from 'react';
import './topbar.style.scss';
import logo from '../../assets/svgs/peviitor_logo.svg';
import briefcase from '../../assets/svgs/briefcase.svg';
import { Link } from 'react-router-dom';

export const TopBar = ({ isBorder, resetPage }) => {
  return (
    <header className={`topbar ${isBorder ? 'topbar--border-bottom' : ''}`}>
      <Link to={'/'}>
        <img src={logo} alt="pe viitor logo" onClick={resetPage} />
      </Link>
    </header>
  );
};
