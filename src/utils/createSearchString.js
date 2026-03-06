// Helper function to remove diacritics (e.g., "București" -> "Bucuresti")
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function createSearchString(q, city, county, company, remote, page) {
  const queryParams = [];

  // Check and include q if not empty
  if (Array.isArray(q) && q.filter(Boolean).length > 0) {
    const qValue = q.filter(Boolean).join(" ");
    queryParams.push(`q=${encodeURIComponent(qValue)}`);
  }

  // --- CITIES ---
  if (Array.isArray(city) && city.filter(Boolean).length > 0) {
    const expandedCities = city.flatMap((c) => {
      const cleanCity = removeDiacritics(c);
      return [c, cleanCity, `${cleanCity}*`];
    });
    const uniqueCities = [...new Set(expandedCities)];

    const safeCities = uniqueCities.map((c) => encodeURIComponent(c)).join(",");
    queryParams.push(`city=${safeCities}`);
  }
  // --------------------------------

  // Check and include county if not empty
  if (Array.isArray(county) && county.filter(Boolean).length > 0) {
    const safeCounties = county
      .filter(Boolean)
      .map((c) => encodeURIComponent(c))
      .join(",");
    queryParams.push(`county=${safeCounties}`);
  }

  // Check and include company if not empty
  if (Array.isArray(company) && company.filter(Boolean).length > 0) {
    const safeCompanies = company
      .filter(Boolean)
      .map((c) => encodeURIComponent(c))
      .join(",");
    queryParams.push(`company=${safeCompanies}`);
  }

  // Check and include remote if not empty
  if (Array.isArray(remote) && remote.filter(Boolean).length > 0) {
    const safeRemote = remote
      .filter(Boolean)
      .map((r) => encodeURIComponent(r))
      .join(",");
    queryParams.push(`remote=${safeRemote}`);
  }

  // Always include page
  queryParams.push(`page=${page}`);

  return queryParams.join("&");
}
