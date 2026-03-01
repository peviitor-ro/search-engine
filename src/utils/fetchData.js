const API_URL = import.meta.env.VITE_API_URL;
// const DEPLOY_ENV = import.meta.env.VITE_DEPLOY_ENV;

const API_LOGO = import.meta.env.VITE_API_LOGO;
const API_COMPANIES = import.meta.env.VITE_API_COMPANIES;
const API_SUGGEST = import.meta.env.VITE_API_SUGGEST;
const API_TOTAL = import.meta.env.VITE_API_TOTAL;

// Fetch the jobs using the string created by user inputs/checkbox.
export const getData = async (createQueryString) => {
  try {
    const response = await fetch(`${API_URL}?${createQueryString}`);
    const data = await response.json();
    return {
      jobs: data.response.docs,
      total: data.response.numFound
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to propagate it to the caller
  }
};
// get the number of jobs in Romania.
export const getNumberOfJobs = async () => {
  try {
    const response = await fetch(API_TOTAL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

// get the number of Company we have in our DB
export const getNumberOfCompany = async () => {
  try {
    const response = await fetch(API_LOGO);
    const data = await response.json();

    return data?.companies?.length || 0;
  } catch (error) {
    console.error("Error fetching data:", error);
    return 0;
  }
};

// Fetch the list of companies
export const getNameOfCompanies = async () => {
  try {
    const response = await fetch(`${API_COMPANIES}?count=true`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.companies || [];
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const getJobSuggestion = async (value) => {
  try {
    const response = await fetch(API_SUGGEST + `?q=${value}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
