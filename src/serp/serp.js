import './serp.style.scss';

import {header} from '../components/header/header.component.js';
import { searchOnEnterPress } from '../utils/searchOnEnterKeyPress.js';
import {results} from '../components/results/results.component.js';

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

const resultsDiv = results();
root.append(resultsDiv);

searchOnEnterPress();