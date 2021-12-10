import LandingPage from './styles/landing-page.scss';
import {searchComponent} from './components/search/search.component.js';


const root = document.querySelector('#root');
const landingPage = document.createElement('div');

const title = document.createElement('p');
title.innerText = 'pe viitor';

const search = searchComponent();

landingPage.classList = 'landing-page';
landingPage.appendChild(title);
landingPage.appendChild(search);

root.appendChild(landingPage);