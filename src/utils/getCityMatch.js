import { orase } from "./getCityName";

const removeDiacritics = (text) => {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getCityMatch = (input) => {
  const normalizedInput = removeDiacritics(input.toLowerCase());
  const regex = new RegExp(`^${normalizedInput}`, "i");

  const filtered = orase.filter((city) =>
    removeDiacritics(city.toLowerCase()).match(regex)
  );

  return filtered;
};

export default getCityMatch;
