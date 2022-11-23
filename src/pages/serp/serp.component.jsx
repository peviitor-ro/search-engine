import React, { useEffect } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import { updatCity, updateCompany, updateCountry, updatePage, updateQ } from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useLocation, useSearchParams } from 'react-router-dom';

export const SerpPage = () => {
    const dispatch = useDispatch();
    let [, setSearchParams] = useSearchParams();
    const jobs = useSelector((state) => state.jobs.jobs);
    const q = useSelector((state) => state.query.q);
    const queries = useSelector((state) => state.query);
    const { state } = useLocation();
    const isFromLandingPage = state?.isFromLandingPage;

    const updateQParam = (e) => {
        dispatch(updateQ(e.target.value));
    }

    const getData = () => {
        fetch(`https://api.peviitor.ro/v1/search/?${createQueryString(queries)}`)
            .then((response) => response.json())
            .then((data) => console.log(data));
    }

    useEffect(() => {
        // update state from query string
        if (isFromLandingPage) {
            setSearchParams(createQueryString(queries));
        } else {
            const queryParams = getQueryParams();
            dispatch(updateQ(queryParams.q));
            dispatch(updatCity(queryParams.city));
            dispatch(updateCompany(queryParams.company));
            dispatch(updateCountry(queryParams.country));
            dispatch(updatePage(queryParams.page));

            // fetch data
            getData();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp update={updateQParam} value={q} />
            </section>
            <TotalResults />
            <section className='jobs'>
                {jobs.map(({ jobTitle, company, location, link }, idx) => <Job key={idx} jobTitle={jobTitle} company={company} location={location} link={link} />)}
            </section>
            <section className='load-more'>
                <button className='btn-yellow btn'>Încarcă mai multe</button>
            </section>
            <Footer />
        </section>
    )
}