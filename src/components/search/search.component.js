import './search.style.scss';
import mGlassWhiteImg from '../../images/mglass-white.png';
 
export const searchComponent = (animation) => {
  const search = document.createElement('div');
  search.classList = `search ${animation ? 'search__animation' : ''}`;

  const form = document.createElement('div');
  form.classList = 'search__wrapper';
  
  const searchInput = document.createElement('input');
  searchInput.id = "search-input";
  searchInput.classList = "search__input";
  searchInput.placeholder = "ce vrei să te faci când vei fi mare?";

  const mGlass = document.createElement('div');
  mGlass.classList = 'search__icon'
  mGlass.innerHTML = `<img src=${mGlassWhiteImg} />`;

  form.appendChild(mGlass);
  search.appendChild(form);
  form.appendChild(searchInput);

  return search;
}
