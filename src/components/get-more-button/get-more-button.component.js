import React from 'react';
import './get-more-button.style.scss';

const GetMoreButton = ({ onClick }) => {

  return (
    <button className='get-more-btn' onClick={onClick}>Mai multe joburi</button>
  )
}

export default GetMoreButton;