import { comune } from "./getCommuneName";

//function to remove diacritics
const removeDiacritics = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getCommuneMatch = (input) => {
    const normalizedInput = removeDiacritics(input.toLowerCase());
    // Create a regular expression to match the input value at the start of items names
    const regex = new RegExp(`^${normalizedInput}`, "i"); // Normalize the input value before creating the regex

    const filtered = comune.filter(
      (city) => removeDiacritics(city.toLowerCase()).match(regex));

    return filtered;
}

export default getCommuneMatch;