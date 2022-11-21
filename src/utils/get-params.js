import { queriesConst } from "../constants/queries";

const params = new URLSearchParams(window.location.search);

export const getQueryParams = () => {
  const q = params.get(queriesConst.q) ? params.get(queriesConst.q) : '';
  const city = params.get(queriesConst.city) ? params.get(queriesConst.city) : '';
  const company = params.get(queriesConst.company) ? params.get(queriesConst.company) : '';
  const country = params.get(queriesConst.country) ? params.get(queriesConst.country) : '';

  return { q, city, company, country }
}

export const getQ = () => params.get(queriesConst.q);
export const getcity = () => params.get(queriesConst.city);
export const getcompany = () => params.get(queriesConst.company);
export const getcountry = () => params.get(queriesConst.companies);