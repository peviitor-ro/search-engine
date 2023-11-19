import { queriesConst } from "../constants/queries";

export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);

  const q = params.get(queriesConst.q) ? decodeURIComponent(params.get(queriesConst.q)) : '';
  const city = params.get(queriesConst.city) ? decodeURIComponent(params.get(queriesConst.city)) : '';
  const county = params.get(queriesConst.county) ? decodeURIComponent(params.get(queriesConst.county)) : '';
  const company = params.get(queriesConst.company) ? decodeURIComponent(params.get(queriesConst.company)) : '';
  const country = params.get(queriesConst.country) ? decodeURIComponent(params.get(queriesConst.country)) : '';
  const page = params.get(queriesConst.page) ? decodeURIComponent(params.get(queriesConst.page)) : 1;

  return { q, city, county, company, country, page }
}
