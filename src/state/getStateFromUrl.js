import { state } from '../state';
import { query } from '../variables/queryVariables';

export const getStateFromUrl = () => {
  const params = new URLSearchParams(window.location.search)

  state[query.q] = params.get(query.q)
  state[query.city] = params.get(query.city)
  state[query.company] = params.get(query.company)
  state[query.country] = params.get(query.country)
  state[query.page] = params.get(query.page)
}
