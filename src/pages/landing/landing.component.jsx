import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Footer } from '../../components/footer/footer.component';
import { TopBar } from '../../components/header/topbar.component';
import { updateQ } from '../../state/query.slice';
import { Banner } from './components/banner/banner.component';
import { Rocket } from './components/rocket/rocket.component';
import { Search } from './components/search/search.component';
import { Title } from './components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {
    const dispatch = useDispatch();
    const q = useSelector((state) => state.query.q)

    const updateQuerySearch = (e) => {
        dispatch(updateQ(e.target.value));
    }

    return (
        <section className='landing-page'>
            <div>
                <TopBar isBorder={true} />
                <main className='main'>
                    <Title />
                    <Search update={updateQuerySearch} value={q} />
                </main>
            </div>
            <section>
                <Rocket />
                <Banner />
                <Footer />
            </section>
        </section>
    )
};