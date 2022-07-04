import React from 'react';
import './results-count.style.scss';

const ResultsCount = ({ count, search }) => {

  return (
    <section className='results-count'>
      <p className='text'>Avem <span className='count'>{count}</span> de oportuinitatis in Romania {search ? `pentru ${search}` : ''}</p>
    </section>
  )
}

export default ResultsCount;