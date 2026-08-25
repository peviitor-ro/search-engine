export const updateUrlParams = (paramsObj) => {
  const currentHash = window.location.hash || "#/rezultate";
  const [baseHash, queryString] = currentHash.split("?");
  const params = new URLSearchParams(queryString ? queryString : "");

  Object.entries(paramsObj).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(","));
      } else {
        params.delete(key);
      }
    } else {
      value ? params.set(key, value) : params.delete(key);
    }
  });

  const newQueryStr = Array.from(params)
    .map(([key, val]) => `${key}=${val}`)
    .join("&");

  const newHash = newQueryStr ? `${baseHash}?${newQueryStr}` : baseHash;
  window.history.replaceState({}, "", newHash);
};

export const removeFiltersFromURL = () => {
  const currentUrl = window.location.href;
  const [baseUrl, queryString] = currentUrl.split("?");
  if (!queryString) return;

  const params = new URLSearchParams(queryString);
  const qParam = params.get("q");
  const newUrl = qParam ? `${baseUrl}?q=${qParam}` : baseUrl;

  window.history.pushState({}, "", newUrl);
};

export const getParamsFromURL = () => {
  const queryString =
    window.location.search || window.location.hash.split("?")[1];
  const params = new URLSearchParams(queryString);
  const paramsObj = {};

  for (const [key, value] of params.entries()) {
    paramsObj[key] = value.includes(",") ? value.split(",") : value;
  }

  return paramsObj;
};

export const findParamInURL = (key) => {
  const paramsObj = getParamsFromURL();
  if (paramsObj[key]) {
    const val = paramsObj[key];
    const arr = Array.isArray(val) ? val : [val];
    return arr.filter(Boolean);
  }
 fix/company-filter-url-sync
  return null;
};

  return [];
};
 main
