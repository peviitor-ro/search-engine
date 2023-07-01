import React, { useEffect, useState } from 'react';
import './scroll-top.style.scss';
import arrowTop from '../../../../assets/png/arrow_top.png';

export const ScrollTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const checkScrollHeight = () => {
    setIsVisible(window.pageYOffset > 500);
  };

  useEffect(() => {
    window.addEventListener('scroll', checkScrollHeight);

    return () => window.removeEventListener('scroll', checkScrollHeight)
  }, []);

  return (
    <div className={`scroll-top ${isVisible && 'is-visible'}`}>
      <button className='scroll-top-btn' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <img src={arrowTop} alt='arrow rop' />
      </button>
    </div>
  )
};