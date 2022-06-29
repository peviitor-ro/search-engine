import React from 'react';
import './search.style.scss';

import { useSelector, useDispatch } from 'react-redux';
import { updateQ } from '../../state/slices/queries.slice';

import magnifyGlass from '../../assets/images/magnify-glass.svg';

const Search = () => {
  const query = useSelector(state => state.queries.q);
  const dispatch = useDispatch();

  const onChange = (e) => {
    dispatch(updateQ(e.target.value));
  }

  return (
    <section className='search'>
      <img src={magnifyGlass} alt='' className='image' />
      <input type='text' placeholder='hehe' onChange={onChange} value={query} />
    </section>
  )
}

export default Search;