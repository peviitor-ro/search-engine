import './filter.style.scss';

export const filter = (options, type, option) => {
  const optionsDiv = document.createElement('div');
  optionsDiv.classList = 'filter__options  filter--hide';

  const input = document.createElement('input');
  input.classList = 'filter__dropdown';
  if(option) {
    input.value = option;
  }

  const filterOptions = (options) => {
    optionsDiv.innerText = '';
  
    options.filter(x => x.includes(input.value)).slice(0, 5).forEach(x => {
      const option = document.createElement('div');
      option.classList = 'filter__option';
      option.innerText = x;
  
      option.addEventListener('click', (e) => {
        input.value = e.target.innerText;
        optionsDiv.classList.add('filter--hide')
      })
  
      optionsDiv.appendChild(option);
    })
  }

  const filter = document.createElement('div');
  filter.classList = `filter ${type}`;
  // filter.innerText = text;

  input.placeholder = 'Alege ceva...';
  input.classList = 'filter__input';

  input.addEventListener('click', () => {optionsDiv.classList.remove('filter--hide')})
  input.addEventListener('blur', () => {
    setTimeout(()=>{
      optionsDiv.classList.add('filter--hide');
    }, 100)
  })

  input.onkeyup = () => filterOptions(options);
  filter.appendChild(input);
 
  filter.appendChild(optionsDiv)

  filterOptions(options);

  return filter;
}

