import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Footer } from '../../components/footer/footer.component';
import { TopBar } from '../../components/header/topbar.component';
import { Search } from '../../components/search/search.component';
import { updateTotalRomania } from '../../state/jobs.slice';
import { getTotalRomania } from '../../utils/get-data';
import { Banner } from './components/banner/banner.component';
import { Rocket } from './components/rocket/rocket.component';
import { Title } from './components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {
    let navigate = useNavigate();
    const dispatch = useDispatch();

    const totalRomania = useSelector((state) => state.jobs.totalRomania);

    const handleSearchClick = () => {
        navigate('rezultate', { state: { isFromLandingPage: true } })
    }

    getTotalRomania().then((totalRomania) => {
        dispatch(updateTotalRomania(totalRomania))
    });

    return (
        <section className='landing-page'>
            <TopBar isBorder={true} />
            <section className='main-wrapper'>
                <main className='main'>
                    <Title totalRomania={totalRomania} />
                    <Search handleClick={handleSearchClick} />
                </main>
                <Rocket />
            </section>
            <Banner />
            <Footer />
        </section>
    )
};