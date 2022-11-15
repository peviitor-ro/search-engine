import React from 'react';
import './search-serp.style.scss';

import magnifyIcon from '../../../../assets/svgs/magnify_class_icon_bg_orange.svg';

export const SearchSerp = ({ value, update }) => {

  return (
    <section className='search-serp'>
      <input className='input-serp' placeholder='what now?' value={value} onChange={update} />
      <img src={magnifyIcon} alt='magnify icon' className='magnify' />
    </section>
  )
}