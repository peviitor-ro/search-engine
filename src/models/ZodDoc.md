Documentation for Zod Schema with `Jobs.ts` as exemple

- Zod schemas are used to define and validate the structure of job-related data

- `JobSchema` defines the schema for an individual job object.

  - Each key inside the schema represents a field in the job data:
  - `id`: A required string.
  - `job_title`:An array of strings representing job titles..
  - `job_link`: An array of strings representing URLs (validated using `.url()`).
  - `company`: An array of strings representing company names.
  - `company_str`: A required string representing the company name as a single string.
  - `country`: An array of strings representing country names.
  - `city`, `county`, `remote`: Optional arrays of strings representing city names, county names, and remote work status, respectively.

- `JobsSchema`

  - `JobsSchema` defines the schema for a collection of job data.
  - `numFound`: A required number representing the total number of job documents found.
  - `docs`: An array of objects (`JobSchema`) representing individual job data.

- Type Definition

  - `Job`: Represents the TypeScript type that corresponds to the inferred type of `JobSchema`.
  - `JobsResults`: Represents the TypeScript type that corresponds to the inferred type of `JobsSchema`.

- Summary
  - The Zod schema definitions provided in your code ensure that job-related data adheres to a specific structure and format. By using Zod, you benefit from enhanced type safety, runtime validation, and clear schema definitions, which contribute to the reliability and maintainability of your TypeScript applications.
