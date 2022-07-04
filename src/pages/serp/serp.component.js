import React from 'react';
import './serp.style.scss';

import Logo from '../../components/logo/logo.component';
import Search from '../../components/search/search.component';
import Results from '../../components/results-count/results-count.component';
import Job from '../../components/job/job.component';

const Serp = () => {

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
          <Results count={2} search={'tester'} />
          <Job />
          <Job />
          <Job />
        </section>
      </section>
    </section>
  )
};

export default Serp;