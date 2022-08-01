import React, { useEffect } from 'react';
import './landing.style.scss';

import Logo from '../../components/logo/logo.component';
import ResultsCount from '../../components/results-count/results-count.component';
import Search from '../../components/search/search.component';

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';

import { handleClick } from '../../helpers/handleClick';
import { baseUrl } from '../../axios/baseUrl';
import { updateTotal } from '../../state/slices/results.slice';
import { updateQ } from '../../state/slices/queries.slice';

const LandingPage = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const count = useSelector((state) => state.results.total);
  const queries = useSelector(state => state.queries);

  useEffect(() => {
    dispatch(updateQ(''));

    baseUrl.get(`total/`)
      .then((response) => {
        dispatch(updateTotal(response.data.total.jobs));
      })
  }, []);


  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleClick(queries, navigate);
    }
  }

  return (
    <section className='landing-page' onKeyDown={onEnterPress}>
      <section className='content display-flex'>
        <Logo />
        <section className='animation display-flex'>
          <Search onClickPress={() => handleClick(queries, navigate)} />
          <ResultsCount count={count} />
        </section>
      </section>
    </section>
  )
};

export default LandingPage;