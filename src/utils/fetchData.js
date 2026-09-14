const API_URL = import.meta.env.VITE_API_URL;
const API_LOGO = import.meta.env.VITE_API_LOGO;
const API_COMPANIES = import.meta.env.VITE_API_COMPANIES;
const API_SUGGEST = import.meta.env.VITE_API_SUGGEST;
const API_TOTAL = import.meta.env.VITE_API_TOTAL;
const JOBS_CACHE_PREFIX = "search-engine:jobs:";
const JOBS_CACHE_TTL = 24 * 60 * 60 * 1000;

const getCacheKey = (query) => `${JOBS_CACHE_PREFIX}${query}`;

const readCachedData = (query) => {
  try {
    const cached = sessionStorage.getItem(getCacheKey(query));
    if (!cached) return null;

    const parsed = JSON.parse(cached);
    if (
      !parsed ||
      !Number.isFinite(parsed.timestamp) ||
      Date.now() - parsed.timestamp > JOBS_CACHE_TTL ||
      !Array.isArray(parsed.jobs) ||
      typeof parsed.total !== "number"
    ) {
      sessionStorage.removeItem(getCacheKey(query));
      return null;
    }

    return { jobs: parsed.jobs, total: parsed.total };
  } catch (error) {
    console.warn("Unable to read cached jobs:", error);
    return null;
  }
};

const writeCachedData = (query, data) => {
  try {
    sessionStorage.setItem(
      getCacheKey(query),
      JSON.stringify({ ...data, timestamp: Date.now() })
    );
  } catch (error) {
    console.warn("Unable to cache jobs:", error);
  }
};

export const getCachedData = (query) => readCachedData(query);

// Fetch the jobs using the string created by user inputs/checkbox.
export const getData = async (createQueryString) => {
  try {
    const response = await fetch(`${API_URL}?${createQueryString}`);
    const data = await response.json();

    if (
      !response.ok ||
      data.error ||
      !data.response ||
      !Array.isArray(data.response.docs)
    ) {
      console.warn("Solr / Backend error. Fallback to empty data.", data);
      return { jobs: [], total: 0 };
    }

    const result = {
      jobs: data.response.docs,
      total: data.response.numFound || 0
    };

    writeCachedData(createQueryString, result);
    return result;
  } catch (error) {
    console.error("Error fetching jobs:", error);

    const cachedData = readCachedData(createQueryString);
    if (cachedData) return cachedData;

    return { jobs: [], total: 0, networkError: true };
  }
};

let totalCachePromise = null;

// get the number of jobs in Romania.
export const getNumberOfJobs = async () => {
  if (totalCachePromise) {
    return totalCachePromise;
  }

  totalCachePromise = (async () => {
    try {
      const response = await fetch(API_TOTAL);
      if (!response.ok) throw new Error("Invalid response");

      const data = await response.json();
      return data || 0;
    } catch (error) {
      console.error("Error fetching total jobs:", error);
      totalCachePromise = null;
      return 0;
    }
  })();

  return totalCachePromise;
};

// get the number of Company we have in our DB
export const getNumberOfCompany = async () => {
  try {
    const response = await fetch(API_LOGO);
    if (!response.ok) throw new Error("Invalid response");

    const data = await response.json();
    return data?.companies?.length || 0;
  } catch (error) {
    console.error("Error fetching total companies:", error);
    return 0;
  }
};

// Fetch the list of companies
export const getNameOfCompanies = async (searchQuery = "") => {
  try {
    const url = searchQuery
      ? `${API_COMPANIES}?name=${encodeURIComponent(searchQuery)}`
      : `${API_COMPANIES}?rows=100`;
    const response = await fetch(url);

    if (!response.ok) throw new Error("Invalid response");

    const data = await response.json();
    const companiesArray = data?.companies || [];
    return companiesArray.map((item) => item.company);
  } catch (error) {
    console.error("Error fetching company list:", error);
    return [];
  }
};

// Fetch job suggestions
export const getJobSuggestion = async (value) => {
  try {
    const response = await fetch(`${API_SUGGEST}?q=${value}`);
    if (!response.ok) throw new Error("Invalid response");

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};