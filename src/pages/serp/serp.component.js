import React from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';
import { TotalResults } from './components/total-results/total-results.component';
import { Job } from './components/job/job.component';
import { Footer } from './components/footer/footer.component';

export const SerpPage = () => {
    const jobs = [1,2,3,4,5];

    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp />
            </section>
            <TotalResults />
            <section className='jobs'>
                {jobs.map(job => <Job key={job} />)}
            </section>
            <section className='load-more'>
                <button className='btn-yellow btn'>Încarcă mai multe</button>
            </section>
            <Footer />
        </section>
    )
}