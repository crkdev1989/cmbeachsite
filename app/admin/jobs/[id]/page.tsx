import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, media } from "@/lib/db/schema";
import JobForm from "../JobForm";
import { updateJob } from "../actions";
import MediaManager from "./MediaManager";
import DeleteJobButton from "./DeleteJobButton";

export const metadata: Metadata = {
  title: "Edit Job | Admin",
  robots: { index: false, follow: false },
};

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);
  if (!job) {
    notFound();
  }

  const jobMedia = await db
    .select()
    .from(media)
    .where(eq(media.jobId, id))
    .orderBy(asc(media.displayOrder));

  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            href="/admin"
            className="text-sm font-semibold uppercase tracking-wide text-sage hover:text-gold"
          >
            &larr; Back to Dashboard
          </Link>
          <DeleteJobButton jobId={job.id} jobTitle={job.title} />
        </div>

        <h1 className="mt-4 font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          {job.title}
        </h1>

        <div className="mt-8 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
            Job Details
          </h2>
          <div className="mt-6">
            <JobForm
              action={updateJob.bind(null, job.id)}
              submitLabel="Save Changes"
              defaultValues={{
                title: job.title,
                description: job.description,
                category: job.category,
                location: job.location,
                jobDate: job.jobDate,
              }}
            />
          </div>
        </div>

        <div className="mt-6 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
            Photos &amp; Video
          </h2>
          <div className="mt-6">
            <MediaManager jobId={job.id} initialMedia={jobMedia} />
          </div>
        </div>
      </div>
    </main>
  );
}
