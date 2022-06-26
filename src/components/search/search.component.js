import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../assets/images/magnify-glass.svg';

const Search = () => {

  return (
    <section className='search'>
      <img src={magnifyGlass} alt='' className='image' />
      <input type='text' placeholder='hehe' />
    </section>
  )
}

export default Search;