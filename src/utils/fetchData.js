const API_URL = process.env.REACT_APP_API_URL;
// const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV;

const API_LOGO = process.env.REACT_APP_API_LOGO;
const API_COMPANIES = process.env.REACT_APP_API_COMPANIES;
const API_SUGGEST = process.env.REACT_APP_API_SUGGEST;
const API_TOTAL = process.env.REACT_APP_API_TOTAL;

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
    const response = await fetch(API_LOGO); // this was v3 for production
    const data = await response.json();
    return data.companies.length;
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error("Error fetching data:", error);
    throw error; // Re-throw the error to be handled by the caller if needed
  }
};

// fetch pentru a lua numele de la firme pentru checkbox.
export const getNameOfCompanies = async (value) => {
  try {
    const response = await fetch(API_COMPANIES + `?userInput=${value}`);
    const data = await response.json();
    return data;
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
