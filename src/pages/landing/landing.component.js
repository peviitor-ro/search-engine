import React from 'react';
import { Header } from '../../components/header/header.component';
import { Search } from '../../components/search/search.component';
import { Footer } from './components/footer/footer.component';
import { Title } from './components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {

    return (
        <section className='landing-page'>
            <div>
                <Header />
                <main className='main'>
                    <Title />
                    <Search />
                </main>
            </div>
            <Footer />
        </section>
    )
};