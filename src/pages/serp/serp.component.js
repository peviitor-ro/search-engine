import React from 'react';
import './serp.style.scss';

import { TopBar } from '../../components/header/topbar.component';
import { SearchSerp } from './components/search/search-serp.component';

export const SerpPage = () => {

    return (
        <section className='serp'>
            <section className='top'>
                <TopBar />
                <SearchSerp />
            </section>
        </section>
    )
}