import React from 'react';
import './search.style.scss';

import { useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from 'react-redux';
import { updateQ } from '../../state/slices/queries.slice';

import magnifyGlass from '../../assets/images/magnify-glass.svg';

const Search = () => {
  const query = useSelector(state => state.queries.q);
  const dispatch = useDispatch();

  let navigate = useNavigate();

  const onChange = (e) => {
    dispatch(updateQ(e.target.value));
  }

  return (
    <section className='search'>
      <img src={magnifyGlass} alt='' className='image' onClick={() => navigate("/rezultate")} />
      <input type='text' placeholder='Ce vrei să te faci când vei fi mare?' onChange={onChange} value={query} />
    </section>
  )
}

export default Search;