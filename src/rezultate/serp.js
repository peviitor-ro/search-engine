import './serp.style.scss';

import {header} from '../components/header/header.component.js';
import { searchOnEnterPress } from '../utils/searchOnEnterKeyPress';

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

searchOnEnterPress();
