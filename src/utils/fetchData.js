const API_URL = import.meta.env.VITE_API_URL;
const API_LOGO = import.meta.env.VITE_API_LOGO;
const API_COMPANIES = import.meta.env.VITE_API_COMPANIES;
const API_SUGGEST = import.meta.env.VITE_API_SUGGEST;
const API_TOTAL = import.meta.env.VITE_API_TOTAL;

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

    return {
      jobs: data.response.docs,
      total: data.response.numFound || 0
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return { jobs: [], total: 0 };
  }
};

// get the number of jobs in Romania.
export const getNumberOfJobs = async () => {
  try {
    const response = await fetch(API_TOTAL);
    if (!response.ok) throw new Error("Invalid response");

    const data = await response.json();
    return data || 0;
  } catch (error) {
    console.error("Error fetching total jobs:", error);
    return 0;
  }
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
export const getNameOfCompanies = async () => {
  try {
    const response = await fetch(`${API_COMPANIES}?count=true`);
    if (!response.ok) throw new Error("Invalid response");

    const data = await response.json();
    return data?.companies || [];
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
