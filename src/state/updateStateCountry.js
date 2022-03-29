import { state } from "../state";
import { query } from '../variables/queryVariables';

export const updateStateCountry = (country) => {
  state[query.country] = country;
}