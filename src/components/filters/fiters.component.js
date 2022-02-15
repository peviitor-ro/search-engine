import './filters.style.scss';
import { filter } from '../filter/filter.component';
import { state } from '../../state';
import { query } from '../../variables/queryVariables';

export const filters = () => {
  const filters = document.createElement('div');
  filters.classList = 'filters';

  const filtersFild = ['city', 'countries', 'companies']
  const filtersFild2 = ['cities2', 'countries2', 'companies2']



  const filterDiv = filter(filtersFild, query.city, state[query.city]);
  const filterDiv2 = filter(filtersFild2, query.company, state[query.company]);
  
  filters.appendChild(filterDiv);
  filters.appendChild(filterDiv2);

  return filters;
}
