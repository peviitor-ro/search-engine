import './serp.style.scss';

import { header } from '../../components/header/header.component.js';
import { searchOnEnterPress } from '../../utils/searchOnEnterKeyPress.js';
import { results } from '../../components/results/results.component.js';
import { getStateFromUrl } from '../../state/getStateFromUrl';
import { pagination } from "../../components/pagination/pagination";


getStateFromUrl()

const root = document.querySelector('#root');

const headerDiv = header();
root.appendChild(headerDiv);

const resultsDiv = results();
root.append(resultsDiv);

const paginationDiv = pagination();
root.append(paginationDiv)

function currentPage() {
    let qs = new URLSearchParams(window.location.search);
    const current = qs.get("page");
    console.log("qs");
    console.log(qs);
    console.log("current")
    console.log(current)
    let currentPage = document.getElementById("page_" + current).setAttribute('style', 'color:red');
    console.log(currentPage);
    console.log('current page');
    console.log("page_" + current);

    // return current
}
currentPage()

searchOnEnterPress();
