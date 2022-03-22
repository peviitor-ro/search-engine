import { state } from "../state";
import { query } from '../variables/queryVariables';

export const updateStatePage = (page) => {
  state[query.page] = page.toString();
}