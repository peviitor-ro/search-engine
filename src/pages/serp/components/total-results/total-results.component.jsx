import React from 'react';
import './total-results.style.scss';

import menuIcon from '../../../../assets/svgs/manu_icon.svg';
import { useNavigate } from 'react-router-dom';

export const TotalResults = ({ total }) => {
  let navigate = useNavigate();

  return (
    <section className="total-results">
      <p>
        <span className="bold">{total}</span> (de) rezultate
      </p>
      <button
        className="btn-menu"
        onClick={() => {
          navigate('filtre');
        }}
      >
        <img src={menuIcon} alt="menu-icon" className="icon" />
        Filter
      </button>
    </section>
  );
};
