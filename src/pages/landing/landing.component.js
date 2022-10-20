import React from 'react';
import { Header } from '../../components/header/header.component';
import { Title } from '../../components/title/title.component';
import './landing.style.scss';

export const LandingPage = () => {

    return (
        <section className='serp'>
            <Header />
            <Title />
        </section>
    )
}