import { queriesConst } from "../constants/queries";

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);

  const q = params.get(queriesConst.q) ? params.get(queriesConst.q) : '';
  const city = params.get(queriesConst.city) ? params.get(queriesConst.city) : '';
  const company = params.get(queriesConst.company) ? params.get(queriesConst.company) : '';
  const country = params.get(queriesConst.country) ? params.get(queriesConst.country) : '';
  const page = params.get(queriesConst.page) ? params.get(queriesConst.page) : 1;

  return { q, city, company, country, page }
}
