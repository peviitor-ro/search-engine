import { query } from "../variables/queryVariables";

export const queryUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const q = params.get(query.q);
  // console.log(q);
}