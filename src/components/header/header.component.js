import './header.style.scss';

import {searchComponent} from '../search/search.component.js';
import {logo} from '../logo/logo.component.js';


export const header = () => {
  const header = document.createElement('div');
  header.classList = 'header';

  const logoDiv = logo();
  header.appendChild(logoDiv);

  const searchWrapper = document.createElement('div');
  searchWrapper.classList = 'header__search__wrapper';

  const search = searchComponent();
  searchWrapper.appendChild(search);

  header.appendChild(searchWrapper);

  return header;
}