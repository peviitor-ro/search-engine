import React from 'react';
import './search.style.scss';
import magnifyGlass from '../../assets/svgs/magniy_glass_icon.svg';
import location from '../../assets/svgs/location_icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { updateCountry, updateQ } from '../../state/query.slice';
import { getAllJobs, getTotalRomania } from '../../utils/get-data';
import { updateAllJobs, updateTotalRomania } from '../../state/jobs.slice';

export const Search = ({ handleClick }) => {
    const dispatch = useDispatch();

    const q = useSelector((state) => state.query.q);
    const country = useSelector((state) => state.query.country);

    const updateQuerySearch = (e) => {
        dispatch(updateQ(e.target.value));
    }

    const updateCrountrySearch = (e) => {
        if (e.target.value) {
            getTotalRomania().then((totalRomania) => {
                dispatch(updateTotalRomania(totalRomania))
            });
        } else {
            getAllJobs().then((totalRomania) => {
                dispatch(updateAllJobs(totalRomania))
            });
        }
        dispatch(updateCountry(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClick();
    }

    const handleClearX = (e) => {
        e.preventDefault();
        dispatch(updateQ(''));
    }

    return (
        <form onSubmit={handleSubmit} className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container query'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='Ce doriți să lucrați?' onChange={updateQuerySearch} value={q} />
                    {q &&
                        <button className="clear" onClick={handleClearX}>
                            <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                            </svg>
                        </button>
                    }
                </div>
                <div className='option-container country'>
                    <img src={location} alt="location icon" />
                    <select id="country" name="country" onChange={updateCrountrySearch} value={country}>
                        <option value="România">România</option>
                        <option value="">Toate</option>
                    </select>
                </div>
            </div>
            <button type='submit' className='btn-yellow btn'>Caută</button>
        </form>
    )
}