import React, { useEffect } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';

import { useDispatch, useSelector } from 'react-redux';
import { updateQ, updatCities, updateCompanies, updateCountries } from '../../state/query.slice';
import { getQueryParams } from '../../utils/get-params';
import { createQueryString } from '../../utils/create-query-string';

export const SerpPage = () => {
    const dispatch = useDispatch();
    const jobs = useSelector((state) => state.jobs.jobs);
    const q = useSelector((state) => state.query.q)

    const updateQueryParam = (e) => {
        dispatch(updateQ(e.target.value));
    }

    useEffect(() => {
        // update state from query string
        const queries = getQueryParams();
        dispatch(updateQ(queries.q));
        dispatch(updatCities(queries.cities));
        dispatch(updateCompanies(queries.companies));
        dispatch(updateCountries(queries.countries));

        // fetch data
        createQueryString(queries);
        fetch(`https://api.peviitor.ro/v1/search/?${createQueryString(queries)}`) // cors
            .then((response) => response.json())
            .then((data) => console.log(data));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp update={updateQueryParam} value={q} />
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