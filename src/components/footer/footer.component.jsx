import React from 'react';
import './footer.style.scss';

import { Link } from "react-router-dom";

import logoBlack from '../../assets/svgs/peviitor_logo_black.svg';
import facebook from '../../assets/svgs/facebook_icon.svg';
import instagram from '../../assets/svgs/instagram_icon.svg';
import linkedin from '../../assets/svgs/linkedin_icon.svg';

export const Footer = () => {

    return (
        <footer className='footer'>
            <section>
                <img src={logoBlack} alt="peviitor logo" />
                <section className='social-media'>
                    <Link to={'#'}><img src={facebook} alt='facebook icon' className='icon' /></Link>
                    <Link to={'#'}><img src={instagram} alt='instagram icon' className='icon' /></Link>
                    <a href="https://www.linkedin.com/company/asociatia-oportunitati-si-cariere/" target="_blank" rel='noreferrer'><img src={linkedin} alt='linkedin icon' className='icon' /></a>
                </section>
                <section className='company'>
                    <h3 className='title'>Organizație</h3>
                    <nav>
                        <ul>
                            <li><a href="https://www.oportunitatisicariere.ro/" target="_blank" rel='noreferrer'>Despre noi</a></li>
                            <li><a href="https://www.oportunitatisicariere.ro/voluntari" target="_blank" rel='noreferrer'>Alătură-te cauzei noastre</a></li>
                        </ul>
                    </nav>
                </section>
                <section className='info'>
                    <h3 className='title'>Informații suplimentare</h3>
                    <nav>
                        <ul>
                            <li><a href="https://legal.peviitor.ro/" target="_blank" rel='noreferrer'>Condiții de utilizare</a></li>
                            <li><a href="https://legal.peviitor.ro/confidentialitate" target="_blank" rel='noreferrer'>Politica de confidențialitate</a></li>
                        </ul>
                    </nav>
                </section>
            </section>
            <section className='all-rights-reserved'>© 2022 - Toate drepturile rezervate PE VIITOR.</section>
        </footer>
    )
}