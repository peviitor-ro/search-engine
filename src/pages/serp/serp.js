import './serp.style.scss';
import a from '../../axios';

import {header} from '../../components/header/header.component.js';
import { searchOnEnterPress } from '../../utils/searchOnEnterKeyPress.js';
import {results} from '../../components/results/results.component.js';
import { queryUrl } from '../../utils/queryUrl';

queryUrl();

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

const resultsDiv = results();
root.append(resultsDiv);

searchOnEnterPress();