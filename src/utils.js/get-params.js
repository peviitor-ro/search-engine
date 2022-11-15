import { queries } from "../constants/queries";

export const getParams = () => {
  const params = new URLSearchParams(window.location.search);

  const q = params.get(queries.q);
  const cities = params.get(queries.cities);
  const companies = params.get(queries.companies);
  const countries = params.get(queries.countries);

  return { q, cities, companies, countries };
}