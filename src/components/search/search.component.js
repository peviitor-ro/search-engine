import searchStyle from './search.component.scss';
import mGlassImg from '../../images/mglass.png';
import mGlassWhiteImg from '../../images/mglass-white.png';
 
export const searchComponent = () => {
  const search = document.createElement('div');
  const form = document.createElement('form');
  const searchInput = document.createElement('input');
  const mGlass = document.createElement('div');

  search.classList = 'search';

  searchInput.id = "search-input";
  searchInput.classList = "search__input";
  searchInput.placeholder = "ce vrei sa te faci cand vei fi mare?";

  mGlass.classList = 'search__icon'
  mGlass.innerHTML = `<img src=${mGlassWhiteImg} />`;

  form.appendChild(mGlass);
  search.appendChild(form);
  form.appendChild(searchInput);

  return search;
}
