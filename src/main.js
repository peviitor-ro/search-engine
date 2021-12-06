import {searchComponent} from './components/search/search.component.js';

const root = document.querySelector('#root');

const search = searchComponent();
root.appendChild(search);