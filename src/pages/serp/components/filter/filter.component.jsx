import React from 'react';
import './filter.style.scss';

export const Filter = () => {

    return (
        <section className='filter'>
            <h3 className='title'>Filtre</h3>
            <section className='checkbox'>
                <input id='remote' type='checkbox' className='remote'/>
                <label htmlFor='remote'>Remote</label>
            </section>
            <h4 className='job-type'>Tip de angajare</h4>
            <section className='types'>
                <section className='checkbox'>
                    <input id='full-time' type='checkbox' />
                    <label htmlFor='full-time'>Full-time</label>
                </section>
                <section className='checkbox'>
                    <input id='part-time' type='checkbox' />
                    <label htmlFor='part-time'>Part-time</label>
                </section>
                <section className='checkbox'>
                    <input id='internship' type='checkbox' />
                    <label htmlFor='internship'>Internship</label>
                </section>
            </section>
        </section>
    )
}