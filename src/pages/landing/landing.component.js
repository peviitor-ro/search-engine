import React from 'react';
import './landing.style.scss';

import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux'

import Logo from '../../components/logo/logo.component';
import ResultsCount from '../../components/results-count/results-count.component';
import Search from '../../components/search/search.component';

const LandingPage = () => {
  let navigate = useNavigate();
  const count = useSelector((state) => state.results.total);

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      navigate("/rezultate");
    }
  }

  return (
    <section className='landing-page' onKeyDown={onEnterPress}>
      <section className='content display-flex'>
        <Logo />
        <section className='animation display-flex'>
          <Search />
          <ResultsCount count={count} />
        </section>
      </section>
    </section>
  )
};

export default LandingPage;