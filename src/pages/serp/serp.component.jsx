import React, { useEffect } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import { updateQ, updatCity, updateCompany, updateCountry } from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';
import { useLocation, useSearchParams } from 'react-router-dom';
import { queriesConst } from '../../constants/queries';

export const SerpPage = () => {
    const dispatch = useDispatch();
    let [, setSearchParams] = useSearchParams();
    const jobs = useSelector((state) => state.jobs.jobs);
    const queries = useSelector((state) => state.query);
    const { state } = useLocation();
    const isFromLandingPage = state?.isFromLandingPage;

    const updateQueryParam = (e) => {
        dispatch(updateQ(e.target.value));
    }

    useEffect(() => {
        // update state from query string
        if (isFromLandingPage) {
            setSearchParams(createQueryString(queries));
        } else {
            const queries = getQueryParams();
            dispatch(updateQ(queries.q));
            dispatch(updatCity(queries.city));
            dispatch(updateCompany(queries.company));
            dispatch(updateCountry(queries.country));

            // fetch data
            createQueryString(queries);
            fetch(`https://api.peviitor.ro/v1/search/?${createQueryString(queries)}`) // cors
                .then((response) => response.json())
                .then((data) => console.log(data));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp update={updateQueryParam} value={queries[queriesConst.q]} />
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