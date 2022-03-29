import './search.style.scss';
import mGlassWhiteImg from '../../asset/images/mglass-white.png';
import { state } from '../../state';
import { query } from '../../variables/queryVariables';
import { updateStateUserInput } from '../../state/updateStateUserInput';
import { totalJobs } from '../total-posts/total-posts.component';




export const searchComponent = (animation) => {
  const search = document.createElement('div');
  const form = document.createElement('div');
  form.classList = 'search__wrapper';
  const searchInput = document.createElement('input');
  searchInput.addEventListener('input', (e) => {
    updateStateUserInput(e.target.value)
  })

  const mGlass = document.createElement('div');

  totalJobs()

  search.classList = `search ${animation ? 'search__animation' : ''}`;

  searchInput.id = "search-input";
  searchInput.classList = "search__input";
  searchInput.placeholder = "ce vrei să te faci când vei fi mare?";
  searchInput.autocomplete = "off";
  if (state[query.q]) {
    searchInput.value = state[query.q];
  }

  const totalJobsCount = document.createElement('div');
  totalJobsCount.classList = 'total-jobs';

  mGlass.classList = 'search__icon'
  mGlass.innerHTML = `<img src=${mGlassWhiteImg} />`;

  form.appendChild(mGlass);
  search.appendChild(form);
  search.appendChild(totalJobsCount);
  form.appendChild(searchInput);

  return search;
}





