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
        console.log('country', e.target.value)
        dispatch(updateCountry(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        handleClick();
    }

    return (
        <form onSubmit={handleSubmit} className='search'>
            <div className='inputs-wrapper'>
                <div className='input-container query'>
                    <img src={magnifyGlass} alt="magnify glass icon" />
                    <input placeholder='Ce doriți să lucrați?' onChange={updateQuerySearch} value={q} />
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