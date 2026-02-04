// Helper function to remove diacritics (e.g., "București" -> "Bucuresti")
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createString(arr) {
  return arr
    .map((item) => (Array.isArray(item) ? item.join("+") : item))
    .join(",");
}

function removeSpecialChars(str) {
  return str.replace(/[$&]/g, (match) => {
    switch (match) {
      case "$":
        return "%24";
      case "&":
        return "%26";
      default:
        return match;
    }
  });
}

export function createSearchString(q, city, county, company, remote, page) {
  const queryParams = [];

  // Check and include q if not empty
  if (Array.isArray(q) && q.filter(Boolean).length > 0) {
    queryParams.push(
      `q=${removeSpecialChars(createString(q).replace(/,/g, "+"))}`
    );
  }

  // --- CHANGED LOGIC FOR CITIES ---
  if (Array.isArray(city) && city.filter(Boolean).length > 0) {
    // 1. Expand the search terms
    const expandedCities = city.flatMap((c) => {
      const cleanCity = removeDiacritics(c);

      // We return an array containing:
      // 1. The original name (e.g., "București")
      // 2. The cleaned name (e.g., "Bucuresti")
      // 3. The cleaned name with a wildcard (e.g., "Bucuresti*") - This catches "Sectorul 3"

      // If the name has no diacritics (e.g. "Arad"), these will be duplicates,
      // but we filter them out in the next step.
      return [c, cleanCity, `${cleanCity}*`];
    });

    // 2. Remove duplicates using Set
    const uniqueCities = [...new Set(expandedCities)];

    queryParams.push(`city=${createString(uniqueCities)}`);
  }
  // --------------------------------

  // Check and include county if not empty
  if (Array.isArray(county) && county.filter(Boolean).length > 0) {
    queryParams.push(
      `county=${removeSpecialChars(createString(county)).replace(/,/g, "+")}`
    );
  }

  // Check and include company if not empty
  if (Array.isArray(company) && company.filter(Boolean).length > 0) {
    queryParams.push(`company=${removeSpecialChars(createString(company))}`);
  }

  // Check and include remote if not empty
  if (Array.isArray(remote) && remote.filter(Boolean).length > 0) {
    queryParams.push(`remote=${createString(remote)}`);
  }

  // Always include page
  queryParams.push(`page=${page}`);

  return queryParams.join("&");
}
