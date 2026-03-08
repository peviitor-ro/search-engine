export function capitalizeJobTitle(title) {
  if (!title) return "";

  const exceptions = [
    "și",
    "si",
    "de",
    "în",
    "in",
    "la",
    "pentru",
    "cu",
    "fara",
    "fără"
  ];

  return title
    .toLowerCase()
    .split(/([ \/-])/g)
    .map((word) => {
      if (!word.trim() || word === "-") return word;
      if (exceptions.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })

    .join("");
}

export function formatSalary(salaryArray) {
  if (!salaryArray || !Array.isArray(salaryArray) || salaryArray.length === 0) {
    return null;
  }

  const rawSalary = salaryArray[0];
  const regex = /([\d]+)\s*(?:-\s*([\d]+))?\s*([A-Za-z]+)?/;
  const match = rawSalary.match(regex);

  if (!match) return rawSalary;

  const min = match[1];
  const max = match[2];
  const currency = match[3] || "";

  const formatNumber = (num) => {
    return Number(num).toLocaleString("ro-RO");
  };

  if (min && max) {
    return `${formatNumber(min)} - ${formatNumber(max)} ${currency}`.trim();
  } else if (min) {
    return `${formatNumber(min)} ${currency}`.trim();
  }

  return rawSalary;
}
