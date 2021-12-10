import LandingPage from './styles/landing-page.style.scss';
import { searchComponent } from './components/search/search.component.js';
import { motoComponent } from './components/moto/moto.component.js';


const root = document.querySelector('#root');
const landingPage = document.createElement('div');
const overlay = document.createElement('div');
const title = document.createElement('div');

title.classList = 'logo';
title.innerText = 'pe viitor';

overlay.classList = 'overlay'

const search = searchComponent();
const moto = motoComponent();

landingPage.classList = 'landing-page';
landingPage.appendChild(title);
landingPage.appendChild(search);
landingPage.appendChild(moto);

overlay.appendChild(landingPage);
root.appendChild(overlay);