import './filter.style.scss';
import { state } from '../../state';
import { updateStateCompany } from '../../state/updateStateCompany';
import { createNewUrl } from '../../utils/createNewUrl';
import { query } from '../../variables/queryVariables';

export const filter = (options, type, companySelected) => {
  const optionsDiv = document.createElement('div');
  optionsDiv.classList = 'filter__options  filter--hide';

  const input = document.createElement('input');
  input.classList = 'filter__dropdown';
  if (companySelected) {
    input.value = companySelected;
  }
  input.addEventListener('blur', (e) => {
    if (!!e.target.value !== !!state[query.company]) {
      updateStateCompany(e.target.value);
      window.location.href = createNewUrl(state);
    }
  });

  const filterOptions = (options) => {
    optionsDiv.innerText = '';

    options.filter(x => x.toLowerCase().includes(input.value.toLowerCase())).slice(0, 5).forEach(x => {
      const option = document.createElement('div');
      option.classList = 'filter__option';
      option.innerText = x;

      option.addEventListener('mousedown', (e) => {
        input.value = e.target.innerText;
        optionsDiv.classList.add('filter--hide');
      })

      optionsDiv.appendChild(option);
    })
  }

  const filter = document.createElement('div');
  filter.classList = `filter ${type}`;

  input.placeholder = 'Alege ceva...';
  input.classList = 'filter__input';

  input.addEventListener('click', () => { optionsDiv.classList.remove('filter--hide') });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      optionsDiv.classList.add('filter--hide');
    }, 100)
  })

  input.onkeyup = () => filterOptions(options);

  filter.appendChild(input);

  filter.appendChild(optionsDiv)

  filterOptions(options);

  return filter;
}

