import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers | C.M. Beach Sitework",
  description:
    "Careers at C.M. Beach Sitework — we're always reviewing applications from exceptional people who want to do this kind of work.",
};

export default function Careers() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-3xl text-center">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          Careers
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 sm:text-xl">
          We&rsquo;re not currently hiring for a specific position, but
          we&rsquo;re always reviewing applications and resumes from
          exceptional people who want to do this kind of work. If you&rsquo;ve
          got the experience and the drive, we want to hear from you —
          openings come up, and we&rsquo;d rather already know who&rsquo;s out
          there.
        </p>
      </div>

      <div className="mx-auto mt-12 w-full max-w-2xl">
        {/* Application placeholder — swap this card's contents for an embedded
            form or file-upload component when the application flow is ready. */}
        <div className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 text-center sm:p-10">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
            Apply
          </h2>
          <p className="mt-3 text-foreground/70">
            Application form coming soon. In the meantime, send your resume
            to{" "}
            <a
              href="mailto:samantha@cmbeach.com"
              className="font-semibold text-gold underline decoration-gold underline-offset-2 hover:opacity-80"
            >
              samantha@cmbeach.com
            </a>{" "}
            or call{" "}
            <a
              href="tel:302-228-8789"
              className="font-semibold text-gold underline decoration-gold underline-offset-2 hover:opacity-80"
            >
              302-228-8789
            </a>
            .
          </p>
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-xl text-center text-sm font-semibold uppercase tracking-wide text-foreground/70">
        We hire for skill, reliability, and the ability to do the job right
        the first time.
      </p>
    </main>
  );
}
