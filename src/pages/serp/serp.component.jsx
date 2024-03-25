import React, { useEffect, useState } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import {
  incrementPage,
  setPageToOne,
  updatCity,
  updateCounty,
  updateCompany,
  updateRemote,
  updateCountry,
  updatePage,
  updateQ
} from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useSearchParams } from 'react-router-dom';
import {
  addMoreJobs,
  clearJobs,
  updateIsLoadMore,
  updateTotal
} from '../../state/jobs.slice';
import { getData } from '../../utils/get-data';
import { Search } from '../../components/search/search.component';
import { ScrollTop } from './components/scroll-top/scroll-top.component';

export const SerpPage = () => {
  const dispatch = useDispatch();

  const [, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);
  const [loadOnClick, setLoadOnClick] = useState(false);

  const jobs = useSelector((state) => state.jobs.jobs);
  const total = useSelector((state) => state.jobs.total);
  const isLoadMore = useSelector((state) => state.jobs.isLoadMore);
  // const page = useSelector((state) => state.query.page);
  const queries = useSelector((state) => state.query);

  
  useEffect(() => {
    const handleBackButton = () => {
      const queryParams = getQueryParams();

      dispatch(updateQ(queryParams.q));
      dispatch(updatCity(queryParams.city));
      dispatch(updateCounty(queryParams.county));
      dispatch(updateCompany(queryParams.company));
      dispatch(updateRemote(queryParams.remote));
      dispatch(updateCountry(queryParams.country));
      // fetch data
      getJobs(queryParams);
      setCount(1);
    };

    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  const resetPage = () => {
    dispatch(setPageToOne());
  };

  const getJobs = async (queries) => {
    dispatch(clearJobs());
    const { jobs, total } = await getData({ ...queries, page: 1 });

    dispatch(addMoreJobs(jobs));
    dispatch(updateTotal(total));
    dispatch(updateIsLoadMore(jobs.length >= 10));
  };

  const handleSearchClick = () => {
    dispatch(setPageToOne());
    const newQueries = {
      ...queries,
      page: 1
    };
    setSearchParams(createQueryString(newQueries));

    getJobs(queries);
  };

  const loadMore = () => {
    dispatch(incrementPage());
    setSearchParams(createQueryString(queries));
    setLoadOnClick(!loadOnClick);
  };

  useEffect(() => {
    // update state from query string
    const queryParams = getQueryParams();

    dispatch(updateQ(queryParams.q));
    dispatch(updatCity(queryParams.city));
    dispatch(updateCounty(queryParams.county));
    dispatch(updateCompany(queryParams.company));
    dispatch(updateRemote(queryParams.remote));
    dispatch(updateCountry(queryParams.country));
    dispatch(updatePage(1));

    // fetch data
    getJobs(queryParams);
    setCount(1);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (count) {
      getData(queries).then(({ jobs }) => {
        setSearchParams(createQueryString(queries));
        dispatch(addMoreJobs(jobs));
        dispatch(updateIsLoadMore(jobs.length >= 10));
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadOnClick]);

  return (
    <section className="serp">
      <section className="top">
        <TopBar resetPage={resetPage} />
        <div className="search-wrapper">
          <Search handleClick={handleSearchClick} queries={queries} />
        </div>
      </section>
      <div className="main-wrapper flex-column margin-top-0">
        <TotalResults total={total} />
        <section className="jobs">
          {jobs.map(
            ({ jobTitle, company, link, city, county, remote }, idx) => (
              <Job
                key={idx}
                jobTitle={jobTitle}
                company={company}
                city={city}
                county={county}
                link={link}
                remote={remote}
              />
            )
          )}
        </section>
        <section className="load-more">
          {isLoadMore ? (
            <button
              className={`btn-yellow btn ${!isLoadMore ? 'btn-disabled' : ''}`}
              onClick={loadMore}
              disabled={!isLoadMore}
            >
              Încarcă mai multe
            </button>
          ) : (
            ''
          )}
        </section>
      </div>
      <ScrollTop />
      <Footer />
    </section>
  );
};
