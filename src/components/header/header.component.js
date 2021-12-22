import './header.style.scss';

import {searchComponent} from '../search/search.component.js';
import {logo} from '../logo/logo.component.js';
import { filters } from '../filters/fiters.component';

export const header = () => {
  const header = document.createElement('div');
  header.classList = 'header';

  const logoDiv = logo();
  header.appendChild(logoDiv);

  const searchWrapper = document.createElement('div');
  searchWrapper.classList = 'header__search__wrapper';

  const search = searchComponent();
  searchWrapper.appendChild(search);

  const filtersDiv = filters();
  searchWrapper.appendChild(filtersDiv);

  header.appendChild(searchWrapper);

  return header;
}