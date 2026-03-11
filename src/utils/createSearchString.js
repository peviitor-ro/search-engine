// Helper function to remove diacritics (e.g., "București" -> "Bucuresti")
function removeDiacritics(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// 1. Am schimbat 'remote' în 'workmode' în argumentele funcției
export function createSearchString(q, city, county, company, workmode, page) {
  const queryParams = [];

  // Check and include q if not empty
  if (Array.isArray(q) && q.filter(Boolean).length > 0) {
    const qValue = q.filter(Boolean).join(" ");
    queryParams.push(`q=${encodeURIComponent(qValue)}`);
  }

  if (Array.isArray(city) && city.filter(Boolean).length > 0) {
    const expandedCities = city.flatMap((c) => {
      const cleanCity = removeDiacritics(c);
      return [c, cleanCity, `${cleanCity}*`];
    });
    const uniqueCities = [...new Set(expandedCities)];

    const safeCities = uniqueCities.map((c) => encodeURIComponent(c)).join(",");
    queryParams.push(`city=${safeCities}`);
  }

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

  // Check and include workmode if not empty
  if (Array.isArray(workmode) && workmode.filter(Boolean).length > 0) {
    const safeWorkmode = workmode
      .filter(Boolean)
      .map((r) => encodeURIComponent(String(r).toLowerCase()))
      .join(",");
    queryParams.push(`workmode=${safeWorkmode}`);
  }

  // Always include page
  queryParams.push(`page=${page}`);

  return queryParams.join("&");
}
