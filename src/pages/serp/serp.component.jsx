import React, { useEffect, useState } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import { incrementPage, setPageToOne, updatCity, updateCompany, updateCountry, updatePage, updateQ } from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useSearchParams } from 'react-router-dom';
import { addMoreJobs, clearJobs, updateIsLoadMore, updateTotal } from '../../state/jobs.slice';
import { getData } from '../../utils/get-data';
import { Search } from '../../components/search/search.component';

export const SerpPage = () => {
    const dispatch = useDispatch();

    const [, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(0);

    const jobs = useSelector((state) => state.jobs.jobs);
    const total = useSelector((state) => state.jobs.total);
    const isLoadMore = useSelector((state) => state.jobs.isLoadMore);
    const page = useSelector((state) => state.query.page);
    const queries = useSelector((state) => state.query);

    const resetPage = () => {
        dispatch(setPageToOne());
    }

    const getJobs = (queries) => {
        dispatch(clearJobs());

        for (let i = 1; i <= queries.page; i++) {
            getData({ ...queries, page: i }).then(({ jobs, total }) => {
                dispatch(addMoreJobs(jobs));
                dispatch(updateTotal(total));
                dispatch(updateIsLoadMore(jobs.length >= 10));
            })
        }
    };

    const handleSearchClick = () => {
        dispatch(setPageToOne());
        setSearchParams(createQueryString(queries));
        getJobs(queries);
    }

    const loadMore = () => {
        dispatch(incrementPage());
        setSearchParams(createQueryString(queries));
    }

    useEffect(() => {
        // update state from query string
        const queryParams = getQueryParams();

        dispatch(updateQ(queryParams.q));
        dispatch(updatCity(queryParams.city));
        dispatch(updateCompany(queryParams.company));
        dispatch(updateCountry(queryParams.country));
        dispatch(updatePage(queryParams.page));

        // fetch data
        getJobs(queryParams);
        setCount(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (count) {
            getData(queries).then(({ jobs }) => {
                setSearchParams(createQueryString(queries));
                dispatch(addMoreJobs(jobs));
                dispatch(updateIsLoadMore(jobs.length >= 10));
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])


    return (
        <section className='serp'>
            <section className='top'>
                <TopBar resetPage={resetPage} />
                <div className='search-wrapper'>
                    <Search handleClick={handleSearchClick} />
                </div>

            </section>
            <div className="main-wrapper">
                <TotalResults total={total} />
                <section className='jobs'>
                    {jobs.map(({ jobTitle, company, location, link }, idx) => <Job key={idx} jobTitle={jobTitle} company={company} location={location} link={link} />)}
                </section>
                <section className='load-more'>
                    {isLoadMore ? <button className={`btn-yellow btn ${!isLoadMore ? 'btn-disabled' : ''}`} onClick={loadMore} disabled={!isLoadMore}>Încarcă mai multe</button> : ''}
                </section>
            </div>
            <Footer />
        </section>
    )
}