import './filters.style.scss';
import { filter } from '../filter/filter.component';

export const filters = () => {
  const filters = document.createElement('div');
  filters.classList = 'filters';

  const filtersFild = ['cities', 'countries', 'companies']

  const filterDiv = filter(filtersFild);
  filters.appendChild(filterDiv);

  return filters;
}
