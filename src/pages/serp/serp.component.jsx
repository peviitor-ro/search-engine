import React, { useEffect, useState } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import { incrementPage, setPageToOne, updatCity, updateCompany, updateCountry, updatePage, updateQ } from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useLocation, useSearchParams } from 'react-router-dom';
import { addMoreJobs, updateIsLoadMore, updateNewSearch, updateTotal } from '../../state/jobs.slice';
import { getData } from '../../utils/get-data';

export const SerpPage = () => {
    const dispatch = useDispatch();
    const [, setSearchParams] = useSearchParams();
    const [count, setCount] = useState(0);
    const jobs = useSelector((state) => state.jobs.jobs);
    const total = useSelector((state) => state.jobs.total);
    const isLoadMore = useSelector((state) => state.jobs.isLoadMore);
    const q = useSelector((state) => state.query.q);
    const page = useSelector((state) => state.query.page);
    const queries = useSelector((state) => state.query);
    const { state } = useLocation();
    const isFromLandingPage = state?.isFromLandingPage;

    const updateQParam = (e) => {
        dispatch(updateQ(e.target.value));
    }

    const resetPage = () => {
        dispatch(setPageToOne());
    }

    const getJobs = (queries) => getData(queries).then(({jobs, total} )=>{ 
        dispatch(updateNewSearch(jobs));
        dispatch(updateTotal(total));
        dispatch(updateIsLoadMore(jobs.length >= 10));
    }); 

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
        if (isFromLandingPage) {
            setSearchParams(createQueryString(queries));
            getJobs(queries);

        } else {
            const queryParams = getQueryParams();
            dispatch(updateQ(queryParams.q));
            dispatch(updatCity(queryParams.city));
            dispatch(updateCompany(queryParams.company));
            dispatch(updateCountry(queryParams.country));
            dispatch(updatePage(queryParams.page));
            setSearchParams(createQueryString(queries));

            // fetch data
            getJobs(queryParams);
        }
        setCount(1);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(count) {
            getData(queries).then(({jobs}) => {
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
                <TopBar resetPage={resetPage}/>
                <SearchSerp update={updateQParam} value={q} handleClick={handleSearchClick}/>
            </section>
            <TotalResults total={total} />
            <section className='jobs'>
                {jobs.map(({ jobTitle, company, location, link }, idx) => <Job key={idx} jobTitle={jobTitle} company={company} location={location} link={link} />)}
            </section>
            <section className='load-more'>
                <button className='btn-yellow btn' onClick={loadMore} disabled={!isLoadMore}>Încarcă mai multe</button>
            </section>
            <Footer />
        </section>
    )
}