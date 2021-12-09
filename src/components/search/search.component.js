import searchStyle from './search.component.scss';

export const searchComponent = () => {
  const search = document.createElement('div');
  const form = document.createElement('form');
  const searchInput = document.createElement('input');
  const label = document.createElement('label');
  const btn = document.createElement('button');

  search.classList = 'search';

  label.innerText = "type a job title";
  label.htmlFor = 'search-input';
  label.classList = 'search__label'

  searchInput.id = "search-input";
  searchInput.classList = "search__input";
  searchInput.placeholder = "say something..."

  btn.innerText = 'Search';
  btn.classList = 'search__btn'

  search.appendChild(form);
  form.appendChild(searchInput);
  form.appendChild(label);
  form.appendChild(btn);

  return search;
}
