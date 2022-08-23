import React, { useEffect, useState } from 'react';
import './serp.style.scss';

import Logo from '../../components/logo/logo.component';
import Search from '../../components/search/search.component';
import Results from '../../components/results-count/results-count.component';
import Job from '../../components/job/job.component';
import GetMoreButton from '../../components/get-more-button/get-more-button.component';

import { useDispatch, useSelector } from 'react-redux'
import { addMoreJobs, getNewJobs, updateIsMoreJobs, updateLoading, updateQuerySearched, updateTotal } from '../../state/slices/results.slice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleClick } from '../../helpers/handleClick';
import { baseUrl } from '../../axios/baseUrl';
import { createQueryString } from '../../helpers/createQueryString';
import { mapJobsResults } from '../../helpers/mapJobsResults';
import { updateQ } from '../../state/slices/queries.slice';
import Loading from '../../components/loading/loading.component';

const Serp = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [firstRun, setFirstRun] = useState(0);

  const querySearched = useSelector(state => state.results.querySearched)
  const count = useSelector(state => state.results.total);
  const queries = useSelector(state => state.queries);
  const jobs = useSelector(state => state.results.jobs);
  const isLoading = useSelector(state => state.results.isLoading);
  const isMoreJobs = useSelector(state => state.results.isMoreJobs);
  const content = jobs.map((job, idx) => <Job key={idx} {...job} />)

  const city = searchParams.get('city');
  const company = searchParams.get('company');
  const country = searchParams.get('country');
  const page = searchParams.get('page');
  const q = searchParams.get('q');

  const paramsQuery = { city, company, country, page, q };

  useEffect(() => {
    dispatch(updateQuerySearched(q));
    dispatch(updateQ(q));

    if (!firstRun) {
      paramsQuery.page = 1;
      setSearchParams(createQueryString(paramsQuery))
    }

    dispatch(updateLoading(true));
    baseUrl.get(`search/?${createQueryString(paramsQuery)}`)
      .then((response) => {
        const jobsMapped = mapJobsResults(response.data.response.docs);
        dispatch(updateTotal(response.data.response.numFound));
        dispatch(getNewJobs(jobsMapped));
        dispatch(updateLoading(false));
        if (!jobsMapped.length) {
          dispatch(updateIsMoreJobs(false));
        }
      })
  }, [city, company, country, q]);

  useEffect(() => {
    if (firstRun) {
      dispatch(updateLoading(true));
      baseUrl.get(`search/?${createQueryString(paramsQuery)}`)
        .then((response) => {
          const jobsMapped = mapJobsResults(response.data.response.docs);
          dispatch(addMoreJobs(jobsMapped));
          dispatch(updateLoading(false));
          if (!jobsMapped.length) {
            dispatch(updateIsMoreJobs(false));
          }
        });
    }

    setFirstRun(firstRun + 1);
  }, [page]);

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleClick(queries, navigate);
    }
  }

  const getMoreJobs = () => {
    paramsQuery.page = parseInt(paramsQuery.page) + 1;
    setSearchParams(createQueryString(paramsQuery))
  }

  return (
    <section className='serp'>
      <header onKeyDown={onEnterPress} >
        <Logo />
        <Search onClickPress={() => handleClick(queries, navigate)} />
      </header>
      <main className='serp__content'>
        <aside className='serp__content__aside'>
          this is some menu
        </aside>
        <section className='serp__content__results'>
          <Results count={count} search={querySearched} />
          {content}
          {!isLoading && isMoreJobs ? <GetMoreButton onClick={getMoreJobs} /> : null}
          {isLoading ? <Loading /> : null}
        </section>
      </main>
    </section>
  )
};

export default Serp;