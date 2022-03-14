import { state } from '../state';

export const generateQueryString = () => {
  const queriesArray = Object.entries(state);
  const existingQuery = queriesArray.filter(query => query[1]);
  const queryString = existingQuery.map(query => query.join('='));

  return queryString.join('&');
}