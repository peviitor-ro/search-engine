import './serp.style.scss';

import { header } from './components/header/header.component.js';

import { searchOnEnterPress } from '../../utils/searchOnEnterKeyPress.js';
import axios from "../../axios";
import { generateQueryString } from '../../utils/generateQueryString';
// import { results } from '../../components/results/results.component.js';
import { getStateFromUrl } from '../../state/getStateFromUrl';
import { state } from '../../state';
import { query } from '../../variables/queryVariables';
import { updateStatePage } from '../../state/updateStatePage';
import { pagination } from '../../components/pagination/pagination';
import { filtersComponent } from './components/filters/filters.component';
import { resultsComponent } from './components/results/results.component';


getStateFromUrl()

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

const content = document.createElement('section');
content.classList = 'content';

const filters = filtersComponent();
content.appendChild(filters);

const results = resultsComponent();
content.append(results);

root.appendChild(content);

// axios.get(`search/?q=${generateQueryString()}`)
//     .then(response => {
//         const divResults = results(response.data.response.docs);
//         root.appendChild(divResults);
//         if (!state[query.page]) {
//             updateStatePage(1)
//         }
//         const paginationDiv = pagination(response.data.response.numFound);
//         root.appendChild(paginationDiv);
//     })

// searchOnEnterPress();
