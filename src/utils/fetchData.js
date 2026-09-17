import {
  setJobs,
  setTotal,
  setPage,
  setPageSize,
  setLoading,
  setNetworkError
} from "../reducers/jobsSlice";
import { updateUrlParams } from "./urlManipulation";

const API_URL = import.meta.env.VITE_API_URL;
const API_LOGO = import.meta.env.VITE_API_LOGO;
const API_COMPANIES = import.meta.env.VITE_API_COMPANIES;
// const API_SUGGEST = import.meta.env.VITE_API_SUGGEST; // DEACTIVATED UNTIL FIXED IN BACKEND
const API_TOTAL = import.meta.env.VITE_API_TOTAL;
const JOBS_CACHE_PREFIX = "search-engine:jobs:";
const JOBS_CACHE_TTL = 24 * 60 * 60 * 1000;

class JobsNetworkError extends Error {
  constructor(message, cause) {
    super(message, { cause });
    this.name = "JobsNetworkError";
  }
}

class JobsServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "JobsServerError";
  }
}

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
    let response;
    try {
      response = await fetch(`${API_URL}?${createQueryString}`);
    } catch (error) {
      throw new JobsNetworkError("Unable to reach the jobs API", error);
    }

    const data = await response.json();

    if (
      !response.ok ||
      data.error ||
      !data.response ||
      !Array.isArray(data.response.docs)
    ) {
      const errorMessage =
        data?.error ||
        `Invalid server response: ${response.status || "unknown"}`;
      console.warn(
        "Solr / Backend error. Re-throwing for caller fallback.",
        data
      );
      throw new JobsServerError(errorMessage);
    }

    const result = {
      jobs: data.response.docs,
      total: data.response.numFound || 0
    };
    writeCachedData(createQueryString, result);
    return result;
  } catch (error) {
    if (error instanceof JobsNetworkError) {
      const cachedData = readCachedData(createQueryString);
      if (cachedData) return cachedData;
    }

    console.error("Error fetching jobs:", error);
    throw error;
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
// DEACTIVATED UNTIL FIXED IN BACKEND
export const getJobSuggestion = async (/* value */) => {
  return [];
};

let currentFetchId = 0;

/**
 * Centralized data fetching, caching, and Redux state handling.
 * Distinguishes between true network/offline failures and server/Solr errors.
 */
export const fetchAndHandleJobs = async (
  searchString,
  targetPage,
  dispatch,
  { syncUrl = true, replaceUrl = false } = {}
) => {
  const fetchId = ++currentFetchId;

  try {
    dispatch(setLoading(true));
    dispatch(setNetworkError(false)); // Reset error state on new attempt

    const { jobs, total } = await getData(searchString);

    if (fetchId !== currentFetchId) return;

    dispatch(setJobs(jobs));
    dispatch(setTotal(total));
    dispatch(setPage(targetPage));
    if (jobs.length > 0) {
      dispatch(setPageSize(jobs.length));
    }
    if (syncUrl) {
      updateUrlParams({ page: targetPage }, replaceUrl);
    }
  } catch (error) {
    if (fetchId !== currentFetchId) return;

    console.error("Fetch error encountered:", error);

    // 1. Determine if this is a true offline or network failure
    const isNetworkError = error instanceof JobsNetworkError;

    if (isNetworkError) {
      console.warn("Network error detected (Offline or connection lost). Checking cache...");

      // Attempt cache fallback for offline scenarios
      const cachedData = readCachedData(searchString);
      if (fetchId !== currentFetchId) return;

      if (cachedData) {
        dispatch(setJobs(cachedData.jobs));
        dispatch(setTotal(cachedData.total));
        dispatch(setPage(targetPage));
        if (cachedData.jobs.length > 0) {
          dispatch(setPageSize(cachedData.jobs.length));
        }
        if (syncUrl) {
          updateUrlParams({ page: targetPage }, replaceUrl);
        }
      } else {
        // Truly offline with no cache available
        dispatch(setNetworkError(true));
        dispatch(setJobs([]));
        dispatch(setTotal(0));
      }
    } else {
      // 2. Server-side or Solr error (Network is fine, but server failed / returned bad data)
      console.warn("Server-side or Solr error encountered. Not an offline issue.");
      dispatch(setNetworkError(false)); // Explicitly keep network error false
      dispatch(setJobs([]));
      dispatch(setTotal(0));
    }
  } finally {
    if (fetchId === currentFetchId) {
      dispatch(setLoading(false));
    }
  }
};