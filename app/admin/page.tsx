import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import { jobs, media } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin | C.M. Beach Sitework",
  robots: { index: false, follow: false },
};

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminPage() {
  const session = await auth();

  const allJobs = await db.select().from(jobs).orderBy(desc(jobs.jobDate));
  const allMedia = await db.select().from(media);

  const mediaByJob = new Map<string, typeof allMedia>();
  for (const item of allMedia) {
    const list = mediaByJob.get(item.jobId) ?? [];
    list.push(item);
    mediaByJob.set(item.jobId, list);
  }

  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-foreground/70">
              Signed in as {session?.user?.name ?? session?.user?.email}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="border-2 border-foreground bg-foreground px-4 py-2 font-heading text-xs font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
            >
              Sign Out
            </button>
          </form>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
            Jobs
          </h2>
          <Link
            href="/admin/jobs/new"
            className="inline-block border-2 border-foreground bg-foreground px-6 py-3 font-heading text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
          >
            + Create New Job
          </Link>
        </div>

        {allJobs.length === 0 ? (
          <div className="mt-6 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 text-center">
            <p className="text-foreground/70">
              No jobs yet. Create one to start uploading photos and video.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {allJobs.map((job) => {
              const jobMedia = mediaByJob.get(job.id) ?? [];
              const thumbnail = jobMedia.find((item) => item.type === "photo");
              const photoCount = jobMedia.filter(
                (item) => item.type === "photo",
              ).length;
              const videoCount = jobMedia.filter(
                (item) => item.type === "video",
              ).length;

              return (
                <Link
                  key={job.id}
                  href={`/admin/jobs/${job.id}`}
                  className="flex items-center gap-4 border-2 border-foreground/15 bg-[#F5F2E8]/75 p-4 transition-colors hover:border-gold"
                >
                  <div className="flex h-16 w-24 flex-shrink-0 items-center justify-center overflow-hidden bg-foreground/10">
                    {thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnail.storageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs uppercase tracking-wide text-foreground/40">
                        No photo
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-heading text-lg font-bold uppercase tracking-wide">
                      {job.title}
                    </p>
                    <p className="text-sm text-foreground/70">
                      {job.category} &middot; {formatDate(job.jobDate)}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-right text-sm text-foreground/60">
                    <p>{photoCount} photo{photoCount === 1 ? "" : "s"}</p>
                    <p>{videoCount} video{videoCount === 1 ? "" : "s"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
