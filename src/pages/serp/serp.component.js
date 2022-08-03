import React, { useEffect } from 'react';
import './serp.style.scss';

import Logo from '../../components/logo/logo.component';
import Search from '../../components/search/search.component';
import Results from '../../components/results-count/results-count.component';
import Job from '../../components/job/job.component';

import { useDispatch, useSelector } from 'react-redux'
import { addMoreJobs, getNewJobs, updateQuerySearched, updateTotal } from '../../state/slices/results.slice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleClick } from '../../helpers/handleClick';
import { baseUrl } from '../../axios/baseUrl';
import { createQueryString } from '../../helpers/createQueryString';
import { mapJobsResults } from '../../helpers/mapJobsResults';
import { updateQ } from '../../state/slices/queries.slice';

const Serp = () => {
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];
  const dispatch = useDispatch();

  const querySearched = useSelector(state => state.results.querySearched)
  const count = useSelector(state => state.results.total);
  const queries = useSelector(state => state.queries);
  const jobs = useSelector(state => state.results.jobs);
  const content = jobs.map((job, idx) => <Job key={idx} {...job} />)

  const city = searchParams.get('city');
  const company = searchParams.get('company');
  const country = searchParams.get('country');
  const page = searchParams.get('page');
  const q = searchParams.get('q');

  const paramsQuery = { city, company, country, page, q };

  let firstRun = 0;

  useEffect(() => {
    console.log(1);
    dispatch(updateQuerySearched(q));
    dispatch(updateQ(q))
    baseUrl.get(`search/?${createQueryString(paramsQuery)}`)
      .then((response) => {
        const jobsMapped = mapJobsResults(response.data.response.docs);
        dispatch(updateTotal(response.data.response.numFound));
        dispatch(getNewJobs(jobsMapped));
      })
  }, [city, company, country, q]);

  useEffect(() => {
    if (firstRun) {
      console.log(2);
      baseUrl.get(`search/?${createQueryString(paramsQuery)}`)
        .then((response) => {
          const jobsMapped = mapJobsResults(response.data.response.docs);
          dispatch(addMoreJobs(jobsMapped));
        });
    }

    firstRun++;
  }, [page]);

  const onEnterPress = (e) => {
    if (e.key === 'Enter') {
      handleClick(queries, navigate);
    }
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
        </section>
      </main>
    </section>
  )
};

export default Serp;