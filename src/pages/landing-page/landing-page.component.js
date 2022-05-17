import './landing-page.style.scss';
import { searchComponent } from '../../components/search/search.component.js';
import { logo } from '../../components/logo/logo.component';
import { searchOnEnterPress } from '../../utils/searchOnEnterKeyPress';
import { setFavicon } from '../../utils/setFavicon';


setFavicon();

const root = document.querySelector('#root');
const landingPage = document.createElement('div');
const overlay = document.createElement('div');
const logoDiv = logo();

overlay.classList = 'overlay'

const search = searchComponent(true);

const totalJobsCount = document.createElement('div');
totalJobsCount.classList = 'total-jobs';

landingPage.classList = 'landing-page';
landingPage.appendChild(logoDiv);
landingPage.appendChild(search);
landingPage.appendChild(totalJobsCount);

overlay.appendChild(landingPage);
root.appendChild(overlay);

searchOnEnterPress();
