const API_URL = process.env.REACT_APP_API_URL;
const DEPLOY_ENV = process.env.REACT_APP_DEPLOY_ENV;

const API_LOGO = process.env.REACT_APP_API_LOGO;
const API_COMPANIES = process.env.REACT_APP_API_COMPANIES;


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
    let response = "";
    if (DEPLOY_ENV === "local") {
      response = await fetch("http://localhost:8080/api/v0/jobs/");
    } else {
      response = await fetch(`${API_URL}?country=România`);
    }
    const data = await response.json();
    return data.response.numFound;
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
export const getNameOfCompanies = async () => {
  try {
    const response = await fetch(API_COMPANIES);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

// fetch pentru a lua logo-urile pentru firme
export const getLogoOfCompanies = async () => {
  try {
    const response = await fetch(API_LOGO); // this was v1 instead of v3 for production
    const data = await response.json();

    return data.companies;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
