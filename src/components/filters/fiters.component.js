import './filters.style.scss';
import { filter } from '../filter/filter.component';

export const filters = () => {
  const filters = document.createElement('div');
  filters.classList = 'filters';

  const filtersFild = ['cities', 'countries', 'companies']
  const filtersFild2 = ['cities2', 'countries2', 'companies2']

  const filterDiv = filter(filtersFild, 'country');
  const filterDiv2 = filter(filtersFild2);
  // filterDiv2.innerText = filter(filtersFild2)
  filters.appendChild(filterDiv);
  filters.appendChild(filterDiv2);
  // filters.appendChild(filterDiv2);

  return filters;
}
