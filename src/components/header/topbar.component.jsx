import React from 'react';
import './topbar.style.scss';
import logo from '../../assets/svgs/peviitor_logo.svg';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetQuery } from '../../state/query.slice';
import { locationSlice } from '../../state/location.slice';

export const TopBar = ({ isBorder }) => {
  const dispatch = useDispatch();

  return (
    <header className={`topbar ${isBorder ? 'topbar--border-bottom' : ''}`}>
      <Link to={'/'} 
        onClick={() => {
          dispatch(resetQuery());
          dispatch(locationSlice.actions.updateSelectedLocation(''));
        }}
      >
        <img src={logo} alt="pe viitor logo"/>
      </Link>
    </header>
  );
};
