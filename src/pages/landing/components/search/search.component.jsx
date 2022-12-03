import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../../../assets/svgs/magniy_glass_icon.svg';
import location from '../../../../assets/svgs/location_icon.svg';
import { useNavigate } from "react-router-dom";

export const Search = ({ update, value }) => {
    let navigate = useNavigate();

    return (
        <section className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='Ce doriți să lucrați?' onChange={update} value={value} />
                </div>
                <div className='input-container'>
                    <img src={location} alt="location icon" />
                    <input />
                </div>
            </div>
            <button onClick={() => { navigate('rezultate', { state: { isFromLandingPage: true } }) }} className='btn-yellow btn'>Caută</button>
        </section>
    )
}