import './filter.style.scss';

const optionsDiv = document.createElement('div');
optionsDiv.classList = 'filter__options';

const input = document.createElement('input');
input.classList = 'filter__dropdown';

export const filter = (options) => {
  const filter = document.createElement('div');
  filter.classList = 'filter';
  // filter.innerText = text;

  input.placeholder = 'Alege ceva...';
  input.onkeyup = () => filterOptions(options);
  filter.appendChild(input);
 
  filter.appendChild(optionsDiv)

  options.forEach(x => {
    const option = document.createElement('div');
    option.classList = 'filter__option';
    option.innerText = x;
    optionsDiv.appendChild(option);
  })


  return filter;
}

const filterOptions = (options) => {
  optionsDiv.innerText = '';
  options.filter(x => x.includes(input.value)).forEach(x => {
    const option = document.createElement('div');
    option.classList = 'filter__option';
    option.innerText = x;
    optionsDiv.appendChild(option);
  })
}