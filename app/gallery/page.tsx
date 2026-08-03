import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { desc, asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { jobs, media } from "@/lib/db/schema";
import { getAllCategoriesGrouped } from "@/lib/jobs";
import CategoryBadge from "@/components/CategoryBadge";
import VideoPlaceholderIcon from "@/components/VideoPlaceholderIcon";

export const metadata: Metadata = {
  title: "Gallery | C.M. Beach Sitework",
  description:
    "Photos and video from C.M. Beach Sitework projects across Delaware and Maryland's Eastern Shore.",
};

type GalleryJob = {
  id: string;
  title: string;
  categories: string[];
  photoCount: number;
  videoCount: number;
  thumbnailUrl: string | null;
};

async function getGalleryJobs(): Promise<GalleryJob[]> {
  try {
    const allJobs = await db.select().from(jobs).orderBy(desc(jobs.jobDate));
    const allMedia = await db
      .select()
      .from(media)
      .orderBy(asc(media.displayOrder));
    const categoriesByJob = await getAllCategoriesGrouped();

    const mediaByJob = new Map<string, typeof allMedia>();
    for (const item of allMedia) {
      const list = mediaByJob.get(item.jobId) ?? [];
      list.push(item);
      mediaByJob.set(item.jobId, list);
    }

    const result: GalleryJob[] = [];
    for (const job of allJobs) {
      const jobMedia = mediaByJob.get(job.id) ?? [];
      if (jobMedia.length === 0) continue; // nothing to show for this job yet

      const first = jobMedia[0];
      const thumbnailUrl =
        first.type === "photo" ? first.storageUrl : first.thumbnailUrl;

      result.push({
        id: job.id,
        title: job.title,
        categories: categoriesByJob.get(job.id) ?? [],
        photoCount: jobMedia.filter((item) => item.type === "photo").length,
        videoCount: jobMedia.filter((item) => item.type === "video").length,
        thumbnailUrl,
      });
    }
    return result;
  } catch (error) {
    // Public page — degrade to the empty state rather than showing a crash,
    // consistent with how the rest of the site handles the DB not being
    // configured yet.
    console.error("Failed to load gallery jobs:", error);
    return [];
  }
}

export default async function GalleryPage() {
  const galleryJobs = await getGalleryJobs();

  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-6xl">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
            Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
            A look at recent work across Delaware and Maryland&rsquo;s
            Eastern Shore.
          </p>
        </div>

        {galleryJobs.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-10 text-center">
            <p className="text-foreground/70">
              No projects yet — check back soon.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryJobs.map((job) => (
              <Link
                key={job.id}
                href={`/gallery/${job.id}`}
                className="block border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 transition-all duration-200 ease-out hover:border-foreground/30 hover:border-l-[4px] hover:shadow-[0_10px_20px_-6px_rgba(10,10,10,0.3)] motion-safe:hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground/10">
                  {job.thumbnailUrl ? (
                    <Image
                      src={job.thumbnailUrl}
                      alt={job.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <VideoPlaceholderIcon className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-lg font-bold uppercase tracking-wide">
                    {job.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {job.categories.map((category) => (
                      <CategoryBadge key={category} category={category} />
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-foreground/60">
                    {job.photoCount} photo{job.photoCount === 1 ? "" : "s"}
                    {job.videoCount > 0 && (
                      <>
                        {" "}
                        &middot; {job.videoCount} video
                        {job.videoCount === 1 ? "" : "s"}
                      </>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
