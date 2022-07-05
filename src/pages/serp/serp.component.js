import React from 'react';
import './serp.style.scss';

import Logo from '../../components/logo/logo.component';
import Search from '../../components/search/search.component';
import Results from '../../components/results-count/results-count.component';
import Job from '../../components/job/job.component';

import { useSelector, useDispatch } from 'react-redux'

const Serp = () => {
  const q = useSelector(state => state.queries.q);
  const count = useSelector(state => state.results.total);


  return (
    <section className='serp'>
      <header>
        <Logo />
        <Search />
      </header>
      <section className='serp__content'>
        <aside className='serp__content__aside'>
          this is some menu
        </aside>
        <section className='serp__content__results'>
          <Results count={count} search={q} />
          <Job isNew={true} />
          <Job isNew={true} />
          <Job />
        </section>
      </section>
    </section>
  )
};

export default Serp;