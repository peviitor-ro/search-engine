import { JobsResults } from "@/models/Jobs";
import { JobsSchema } from "@/models/Jobs";
import { CompaniesName, CompaniesNameSchema } from "@/models/dataSchema";
import { API_COMPANIES, API_JOBS, API_JOBS_NUMBERS } from "./apiUrl";

export default async function fetchData(
  createQueryString?: string
): Promise<JobsResults | undefined> {
  try {
    let url = `${API_JOBS}`;

    // Append params to the URL if they exist
    if (createQueryString) {
      url += `?${createQueryString}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Fetch error: Server responded with an error");
    }

    const jobsResults = await res.json();
    if (!jobsResults || !jobsResults.response) {
      throw new Error("Response data is missing or invalid");
    }

    const parsedData = JobsSchema.parse(jobsResults.response);

    return parsedData as JobsResults;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Fetch for checkbox companies
export const getNameOfCompanies = async (): Promise<
  CompaniesName | undefined
> => {
  try {
    const res = await fetch(API_COMPANIES);

    if (!res.ok)
      throw new Error(
        "Fetch error data (companies name): Server responded with an error"
      );

    const data: CompaniesName = await res.json();

    if (!data)
      throw new Error("Response data (companies name) is missing or invalid");

    const parsedData = CompaniesNameSchema.parse(data);

    return parsedData as CompaniesName;
  } catch (e) {
    console.error("Error fetching data (companies name):", e);
  }
};

// get number of Jobs
export async function getNumberOfJobs(): Promise<number | undefined> {
  try {
    const res = await fetch(API_JOBS_NUMBERS);

    if (!res.ok) {
      throw new Error("Fetch error: Server responded with an error");
    }

    const jobsResults = await res.json();
    return jobsResults.response.numFound;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
