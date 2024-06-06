import { z } from "zod";

const JobSchema = z.object({
  id: z.string(),
  job_title: z.array(z.string()),
  job_link: z.array(z.string().url()),
  company: z.array(z.string()).optional(),
  company_str: z.string().optional(),
  country: z.array(z.string()).optional(),
  city: z.array(z.string()).optional(),
  county: z.array(z.string()).optional(),
  remote: z.array(z.string()).optional()
});

export const JobsSchema = z.object({
  numFound: z.number(),
  docs: z.array(JobSchema)
});

export type Job = z.infer<typeof JobSchema>;
export type JobsResults = z.infer<typeof JobsSchema>;
