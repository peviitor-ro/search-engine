import React from 'react';
import Logo from '../../components/logo/logo.component';
import ResultsCount from '../../components/results-count/results-count.component';
import Search from '../../components/search/search.component';
import './landing.style.scss';

const LandingPage = () => (
  <section className='landing-page'>
    <section className='content'>
      <Logo />
      <Search />
      <ResultsCount />
    </section>
  </section>
);

export default LandingPage;