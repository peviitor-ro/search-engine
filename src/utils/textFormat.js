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
    .split(/([ -])/g)
    .map((word) => {
      if (!word.trim() || word === "-") return word;
      if (exceptions.includes(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })

    .join("");
}
