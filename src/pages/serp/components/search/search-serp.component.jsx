import React from 'react';
import './search-serp.style.scss';

import magnifyIcon from '../../../../assets/svgs/magnify_class_icon_bg_orange.svg';
import { useSearchParams } from 'react-router-dom';
import { createQueryString } from '../../../../utils/create-query-string';
import { useSelector } from 'react-redux';

export const SearchSerp = ({ value, update }) => {
  let [, setSearchParams] = useSearchParams();
  const queries = useSelector((state) => state.query)

  const handleClick = () => {
    setSearchParams(createQueryString(queries));
  }

  return (
    <section className='search-serp'>
      <input className='input-serp' placeholder='what now?' value={value} onChange={update} />
      <img src={magnifyIcon} alt='magnify icon' className='magnify' onClick={handleClick} />
    </section>
  )
}