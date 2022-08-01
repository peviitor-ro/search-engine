import React from 'react';
import './search.style.scss';

import { useSelector, useDispatch } from 'react-redux';
import { updateQ } from '../../state/slices/queries.slice';

import magnifyGlass from '../../assets/images/magnify-glass.svg';

const Search = ({ onClickPress }) => {
  const query = useSelector(state => state.queries.q);
  const dispatch = useDispatch();


  const onChange = (e) => {
    dispatch(updateQ(e.target.value));
  }

  return (
    <section className='search'>
      <img src={magnifyGlass} alt='' className='image' onClick={() => onClickPress()} />
      <input type='text' placeholder='Ce vrei să te faci când vei fi mare?' onChange={onChange} value={query} />
    </section>
  )
}

export default Search;