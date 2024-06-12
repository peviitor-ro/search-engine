import { z } from "zod";

export const CompaniesNameSchema = z.array(z.string());

export type CompaniesName = z.infer<typeof CompaniesNameSchema>;
