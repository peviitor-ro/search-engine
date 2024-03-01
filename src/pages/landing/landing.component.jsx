import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/footer/footer.component';
import { TopBar } from '../../components/header/topbar.component';
import { Search } from '../../components/search/search.component';
import {
  clearJobs,
  updateTotalCompanies,
  updateTotalRomania,
  updateTotal
} from '../../state/jobs.slice';
import { setPageToOne, updatCity, updateCounty } from '../../state/query.slice';
import { createQueryString } from '../../utils/create-query-string';
import { getNumberOfJobsAndCompanies } from '../../utils/get-data';
import { Banner } from './components/banner/banner.component';
import { Rocket } from './components/rocket/rocket.component';
import { Title } from './components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const queries = useSelector((state) => state.query);

  const allJobs = useSelector((state) => state.jobs.allJobs);
  const totalJobs = useSelector((state) => state.jobs.total);

  useEffect(() => {
    dispatch(setPageToOne());
    dispatch(updatCity(''));
    dispatch(updateCounty(''));
    dispatch(clearJobs());
    getNumberOfJobsAndCompanies().then((data) => {
      dispatch(updateTotal(data.jobs.all));
      dispatch(updateTotalRomania(data.jobs.ro));
      dispatch(updateTotalCompanies(data.companies));
    });

  }, [dispatch]);

  const handleSearchClick = () => {
    navigate(
      `${queries ? `rezultate?${createQueryString(queries)}` : 'rezultate'}`
    );
  };

  return (
    <>
      <TopBar isBorder={true} />
      <main>
        <section className="main-wrapper">
          <div className="main">
            <Title allJobs={allJobs} totalJobs={totalJobs} />
            <Search
              handleClick={handleSearchClick}
              queries={queries}
              landing={true}
            />
          </div>
          <Rocket />
        </section>
        <Banner />
      </main>
      <Footer />
    </>
  );
};
