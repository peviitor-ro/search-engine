import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../assets/svgs/magniy_glass_icon.svg';
import location from '../../assets/svgs/location_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updateCountry, updateQ } from '../../state/query.slice';

export const Search = ({ handleClick }) => {
    const dispatch = useDispatch();

    const q = useSelector((state) => state.query.q);
    const country = useSelector((state) => state.query.country);

    const updateQuerySearch = (e) => {
        dispatch(updateQ(e.target.value));
    }

    const updateCrountrySearch = (e) => {
        dispatch(updateCountry(e.target.value))
    }

    return (
        <section className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container query'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='Ce doriți să lucrați?' onChange={updateQuerySearch} value={q} />
                </div>
                <div className='option-container country'>
                    <img src={location} alt="location icon" />
                    <select id="country" name="country" onChange={updateCrountrySearch}>
                        <option value="România" selected={country === "România"}>România</option>
                        <option value="" selected={country === ""}>Toate</option>
                    </select>
                </div>
            </div>
            <button onClick={handleClick} className='btn-yellow btn'>Caută</button>
        </section>
    )
}