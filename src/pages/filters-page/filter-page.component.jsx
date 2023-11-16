import React from 'react';
import './filter-page.style.scss';

import { Filter } from '../serp/components/filter/filter.component';

export const FiltersPage = () => {

    return (
        <section className='filters-page'>
            <Filter />
        </section>
    )
}