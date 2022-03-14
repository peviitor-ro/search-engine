import { state } from "../state";
import { query } from '../variables/queryVariables';

export const updateStateCompany = (company) => {
  state[query.company] = company;
}