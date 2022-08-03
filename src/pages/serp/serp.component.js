import React, { useEffect } from 'react';
import './serp.style.scss';

import Logo from '../../components/logo/logo.component';
import Search from '../../components/search/search.component';
import Results from '../../components/results-count/results-count.component';
import Job from '../../components/job/job.component';

import { useDispatch, useSelector } from 'react-redux'
import { getNewJobs, updateQuerySearched, updateTotal } from '../../state/slices/results.slice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleClick } from '../../helpers/handleClick';
import { baseUrl } from '../../axios/baseUrl';
import { createQueryString } from '../../helpers/createQueryString';
import { mapJobsResults } from '../../helpers/mapJobsResults';

const Serp = () => {
  const navigate = useNavigate();
  const searchParams = useSearchParams()[0];
  const searchedQ = searchParams.get('q');

  const querySearched = useSelector(state => state.results.querySearched)
  const q = useSelector(state => state.queries.q)
  const count = useSelector(state => state.results.total);
  const queries = useSelector(state => state.queries);
  const jobs = useSelector(state => state.results.jobs);
  const content = jobs.map(job => <Job key={job.link} {...job} />)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(updateQuerySearched(q));
    baseUrl.get(`search/?${createQueryString(queries)}`)
      .then((response) => {
        const jobsMapped = mapJobsResults(response.data.response.docs);
        dispatch(updateTotal(response.data.response.numFound));
        dispatch(getNewJobs(jobsMapped));
      })


  }, [searchedQ]);

  useEffect(() => {
    return () => {
      localStorage.removeItem('isInternal')
    }
  });

  return (
    <section className='serp'>
      <header>
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
          {/* <Job isNew={true} />
          <Job isNew={true} />
          <Job /> */}
        </section>
      </main>
    </section>
  )
};

export default Serp;