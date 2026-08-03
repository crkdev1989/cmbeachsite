import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, media } from "@/lib/db/schema";
import { getCategoriesForJob } from "@/lib/jobs";
import CategoryBadge from "@/components/CategoryBadge";
import MediaGrid from "./MediaGrid";

async function getJobDetail(jobId: string) {
  try {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId)).limit(1);
    if (!job) return null;

    const jobMedia = await db
      .select()
      .from(media)
      .where(eq(media.jobId, jobId))
      .orderBy(asc(media.displayOrder));
    if (jobMedia.length === 0) return null;

    const categories = await getCategoriesForJob(jobId);
    return { job, jobMedia, categories };
  } catch (error) {
    console.error("Failed to load gallery job detail:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}): Promise<Metadata> {
  const { jobId } = await params;
  const detail = await getJobDetail(jobId);
  if (!detail) {
    return { title: "Project | C.M. Beach Sitework" };
  }
  return {
    title: `${detail.job.title} | C.M. Beach Sitework`,
    description:
      detail.job.description ??
      `Photos and video from the ${detail.job.title} project.`,
  };
}

export default async function GalleryJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const detail = await getJobDetail(jobId);
  if (!detail) {
    notFound();
  }

  const { job, jobMedia, categories } = detail;

  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <Link
          href="/gallery"
          className="text-sm font-semibold uppercase tracking-wide text-sage hover:text-gold"
        >
          &larr; Back to Gallery
        </Link>

        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((category) => (
            <CategoryBadge key={category} category={category} />
          ))}
        </div>

        <h1 className="mt-3 font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          {job.title}
        </h1>

        {job.location && (
          <p className="mt-2 text-foreground/70">{job.location}</p>
        )}

        {job.description && (
          <p className="mt-4 max-w-3xl text-foreground/80">
            {job.description}
          </p>
        )}

        <MediaGrid items={jobMedia} />
      </div>
    </main>
  );
}
