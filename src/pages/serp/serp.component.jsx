import React, { useEffect } from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from '../../components/footer/footer.component';
import { useSelector } from 'react-redux';
import { getParams } from '../../utils.js/get-params';

export const SerpPage = () => {
    const jobs = useSelector((state) => state.jobs.jobs);

    useEffect(() => {

    }, [])


    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp />
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