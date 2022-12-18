import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../../../assets/svgs/magniy_glass_icon.svg';
import location from '../../../../assets/svgs/location_icon.svg';
import { useNavigate } from "react-router-dom";

export const Search = ({ updateQuery, updateCountry, value }) => {
    let navigate = useNavigate();

    return (
        <section className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container query'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='Ce doriți să lucrați?' onChange={updateQuery} value={value} />
                </div>
                <div className='option-container country'>
                    <img src={location} alt="location icon" />
                    <select id="country" name="country" onChange={updateCountry}>
                        <option value="România">România</option>
                        <option value="">Toate</option>
                    </select>
                </div>
            </div>
            <button onClick={() => { navigate('rezultate', { state: { isFromLandingPage: true } }) }} className='btn-yellow btn'>Caută</button>
        </section>
    )
}