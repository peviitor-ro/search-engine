import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../assets/svgs/magniy_glass_icon.svg';
import location from '../../assets/svgs/location_icon.svg';

export const Search = () => {

    return (
        <section className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='test'/>
                </div>
                <div className='input-container'>
                    <img src={location} alt="location icon" />
                    <input />
                </div>
            </div>
            <button className='btn-yellow btn'>Caută</button>
        </section>
    )
}