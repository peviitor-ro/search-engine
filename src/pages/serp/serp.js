import './serp.style.scss';

import { header } from '../../components/header/header.component.js';
import { searchOnEnterPress } from '../../utils/searchOnEnterKeyPress.js';
import { results } from '../../components/results/results.component.js';
import { getStateFromUrl } from '../../state/getStateFromUrl';
import { state } from '../../state';


getStateFromUrl()
console.log(state)

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

const resultsDiv = results();
root.append(resultsDiv);

searchOnEnterPress();
