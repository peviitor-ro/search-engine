export const updateUrlParams = (paramsToUpdate, replace = false) => {
  const currentHref = window.location.href;
  const hashIndex = currentHref.indexOf("#");

  const applyChanges = (searchParams) => {
    Object.entries(paramsToUpdate).forEach(([key, value]) => {
      if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || value === "") {
        searchParams.delete(key);
      } else if (Array.isArray(value)) {
        searchParams.set(key, value.filter(Boolean).join(","));
      } else {
        searchParams.set(key, value);
      }
    });
  };

  if (hashIndex === -1) {
    const currentUrl = new URL(currentHref);
    applyChanges(currentUrl.searchParams);
    const newUrl = currentUrl.pathname + currentUrl.search;
    if (replace) {
      window.history.replaceState(null, "", newUrl);
    } else {
      window.history.pushState(null, "", newUrl);
    }
  } else {
    const baseUrl = currentHref.substring(0, hashIndex);
    const hashPathAndQuery = currentHref.substring(hashIndex);
    const qIndex = hashPathAndQuery.indexOf("?");
    let hashPath = hashPathAndQuery;
    let searchParams = new URLSearchParams();

    if (qIndex !== -1) {
      hashPath = hashPathAndQuery.substring(0, qIndex);
      searchParams = new URLSearchParams(hashPathAndQuery.substring(qIndex + 1));
    }

    applyChanges(searchParams);

    const queryString = searchParams.toString();
    const newHash = queryString ? `${hashPath}?${queryString}` : hashPath;
    const newUrl = baseUrl + newHash;

    if (replace) {
      window.history.replaceState(null, "", newUrl);
    } else {
      window.history.pushState(null, "", newUrl);
    }
  }
};

export const removeFiltersFromURL = () => {
  const currentHash = window.location.hash || "#/rezultate";
  const [baseHash, queryString] = currentHash.split("?");
  if (!queryString) return;

  const params = new URLSearchParams(queryString);
  const qParam = params.get("q");
  
  const newHash = qParam ? `${baseHash}?q=${qParam}` : baseHash;
  window.history.replaceState({}, "", newHash);
};

export const getParamsFromURL = () => {
  const queryString =
    window.location.search || window.location.hash.split("?")[1];
  const params = new URLSearchParams(queryString || "");
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
  return [];
};