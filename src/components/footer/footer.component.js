import React from 'react';
import './footer.style.scss';

import { Link, useNavigate } from 'react-router-dom';
import facebookIcon from '../../assets/images/facebook-icon.svg';
import linkeInIcon from '../../assets/images/linkedin-icon.svg';

const Footer = () => {
  const navigate = useNavigate();

  const goToSocialMedia = (socialMedia) => {
    navigate(`${socialMedia}`)
  }

  return (
    <footer className='footer'>
      <section className='copyright'>© 2022 ASOCIATIA OPORTUNITATI SI CARIERE</section>
      <section className='social-media'>
        <button type='button' onClick={() => goToSocialMedia('facebook')} className='facebook'>
          <img alt='facebook-icon' width="" height="" src={facebookIcon} />
        </button>
        <button type='button' onClick={() => goToSocialMedia('linkedin')} className='linkedin'>
          <img alt='linked-icon' width="" height="" src={linkeInIcon} />
        </button>
      </section>
      <nav className='navigation'>
        <ul>
          <li><Link to='/contact'>Contact</Link></li>
          <li><Link to='/despre-noi'>Despre noi</Link></li>
          <li><Link to='/confidentialitate'>Confidentialitate</Link></li>
          <li><Link to='/termeni-si-conditii'>Termeni si Conditii</Link></li>
        </ul>
      </nav>
    </footer>
  )
}

export default Footer;