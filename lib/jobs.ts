import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobCategories } from "@/lib/db/schema";
import { isJobCategory, type JobCategory } from "@/lib/constants";

export async function getCategoriesForJob(jobId: string): Promise<JobCategory[]> {
  const rows = await db
    .select({ category: jobCategories.category })
    .from(jobCategories)
    .where(eq(jobCategories.jobId, jobId));
  return rows.map((row) => row.category);
}

/** All job->categories in one query, grouped by job id. */
export async function getAllCategoriesGrouped(): Promise<
  Map<string, JobCategory[]>
> {
  const rows = await db.select().from(jobCategories);
  const map = new Map<string, JobCategory[]>();
  for (const row of rows) {
    const list = map.get(row.jobId) ?? [];
    list.push(row.category);
    map.set(row.jobId, list);
  }
  return map;
}

/** Replaces a job's category assignments wholesale. */
export async function syncJobCategories(jobId: string, categories: string[]) {
  const valid = categories.filter(isJobCategory);
  await db.delete(jobCategories).where(eq(jobCategories.jobId, jobId));
  if (valid.length > 0) {
    await db
      .insert(jobCategories)
      .values(valid.map((category) => ({ jobId, category })));
  }
}
