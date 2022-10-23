import React from 'react';
import { TopBar } from '../../components/header/topbar.component';
import { Footer } from './components/footer/footer.component';
import { Search } from './components/search/search.component';
import { Title } from './components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {

    return (
        <section className='landing-page'>
            <div>
                <TopBar isBorder={true} />
                <main className='main'>
                    <Title />
                    <Search />
                </main>
            </div>
            <Footer />
        </section>
    )
};