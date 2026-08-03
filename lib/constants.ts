// Matches the job_category Postgres enum in lib/db/schema.ts.
export const JOB_CATEGORIES = [
  "Mass Grading",
  "Fine Grading",
  "Site Utilities",
  "Demolition",
  "Clean Up",
  "Snow Removal",
  "Other",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];

export function isJobCategory(value: string): value is JobCategory {
  return (JOB_CATEGORIES as readonly string[]).includes(value);
}
