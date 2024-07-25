function createString(arr, isCity = false) {
  return arr
    .map((item) => (Array.isArray(item) ? item.join("+") : item))
    .map((item) => (isCity ? item + "~" : item)) // Append ~ only for city
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
// take the props when its called and create the string for fetch
export function createSearchString(q, city, county, company, remote, page) {
  const queryParams = [];

  // Check and include q if not empty
  if (Array.isArray(q) && q.filter(Boolean).length > 0) {
    queryParams.push(
      `q=${removeSpecialChars(createString(q).replace(/,/g, "+"))}`
    );
  }

  // Check and include city if not empty
  if (Array.isArray(city) && city.filter(Boolean).length > 0) {
    queryParams.push(`city=${createString(city, true)}`);
  }

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
