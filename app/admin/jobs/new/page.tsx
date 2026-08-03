import type { Metadata } from "next";
import Link from "next/link";
import JobForm from "../JobForm";
import { createJob } from "../actions";

export const metadata: Metadata = {
  title: "New Job | Admin",
  robots: { index: false, follow: false },
};

export default function NewJobPage() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href="/admin"
          className="text-sm font-semibold uppercase tracking-wide text-sage hover:text-gold"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="mt-4 font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          New Job
        </h1>

        <div className="mt-8 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <JobForm action={createJob} submitLabel="Create Job" />
        </div>
      </div>
    </main>
  );
}
