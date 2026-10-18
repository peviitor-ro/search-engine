const EXCEPTIONS = ["de", "lui"];

export function removeDiacritics(str) {
  if (!str) return "";
  return String(str)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function isRomania(str) {
  if (!str) return false;
  const normalized = removeDiacritics(String(str).trim().toLowerCase());
  return normalized === "romania";
}

export function formatCityName(name) {
  if (!name) return "";
  const trimmed = String(name).trim();
  if (trimmed.toLowerCase() === "all") return "Toate orașele";

  return trimmed
    .toLowerCase()
    .split(/([ -])/g)
    .map((word) => {
      if (!word) return "";
      return EXCEPTIONS.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
}

export function processLocations(locationProp) {
  const rawItems = (
    Array.isArray(locationProp)
      ? locationProp
      : typeof locationProp === "string"
        ? [locationProp]
        : []
  )
    .flatMap((item) => (item ? String(item).split(",") : []))
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && !isRomania(item));

  const formatted = rawItems
    .map(formatCityName)
    .filter(Boolean);

  const unique = [...new Set(formatted)];

  unique.sort((a, b) => a.localeCompare(b, "ro", { sensitivity: "base" }));

  return unique;
}
