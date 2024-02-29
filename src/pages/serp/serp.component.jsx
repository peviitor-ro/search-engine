import React, { useEffect, useState } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';
import { useDispatch, useSelector } from 'react-redux';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useSearchParams } from 'react-router-dom';
import { getData } from '../../utils/get-data';
import { Search } from '../../components/search/search.component';
import { ScrollTop } from './components/scroll-top/scroll-top.component';

import {
  incrementPage,
  setPageToOne,
  updatCity,
  updateCounty,
  updateCompany,
  updatePage,
  updateQ
} from '../../state/query.slice';

import {
  addMoreJobs,
  clearJobs,
  updateIsLoadMore,
  updateTotal
} from '../../state/jobs.slice';

export const SerpPage = () => {
  const dispatch = useDispatch();

  const [, setSearchParams] = useSearchParams();
  const [count, setCount] = useState(0);

  const jobs = useSelector((state) => state.jobs.jobs);
  const total = useSelector((state) => state.jobs.total);
  const isLoadMore = useSelector((state) => state.jobs.isLoadMore);
  const page = useSelector((state) => state.query.page);
  const queries = useSelector((state) => state.query);

  const getJobs = (queries) => {
    dispatch(clearJobs());
    for (let i = 1; i <= queries.page; i++) {
      getData({ ...queries, page: i }).then(({ jobs, total }) => {
        dispatch(addMoreJobs(jobs));
        dispatch(updateTotal(total));
        dispatch(updateIsLoadMore(jobs.length >= 10));
      });
    }
  };

  const handleSearchClick = () => {
    dispatch(setPageToOne());
    setSearchParams(createQueryString(queries));
    getJobs(queries);
  };

  const loadMore = () => {
    dispatch(incrementPage());
    setSearchParams(createQueryString(queries));
  };

  useEffect(() => {
    // update state from query string
    const queryParams = getQueryParams();

    dispatch(updateQ(queryParams.q));
    dispatch(updatCity(queryParams.city));
    dispatch(updateCounty(queryParams.county));
    dispatch(updateCompany(queryParams.company));
    dispatch(updatePage(queryParams.page));

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
  }, [page]);

  return (
    <section className="serp">
      <section className="top">
        <TopBar />
        <div className="search-wrapper">
          <Search handleClick={handleSearchClick} queries={queries} />
        </div>
      </section>
      <div className="main-wrapper flex-column margin-top-0">
        <TotalResults total={total} />
        <section className="jobs">
          {jobs.map(({ jobTitle, company, link, city, county }, idx) => (
            <Job
              key={idx}
              jobTitle={jobTitle}
              company={company}
              city={city}
              county={county}
              link={link}
            />
          ))}
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
