import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | C.M. Beach Sitework",
  description:
    "Mass grading, fine grading, site utilities, demolition, clean up, and snow removal across Delaware and Maryland's Eastern Shore.",
};

const services = [
  {
    title: "Mass Grading",
    body: "Large-scale earthwork to bring a site to grade and ready for construction. We move dirt at scale — cut and fill, rough grading, site balancing — to get raw land ready for the next phase of a build.",
  },
  {
    title: "Fine Grading",
    body: "Precision finish grading for drainage, paving, and final tolerances. The detail work that makes sure water goes where it's supposed to and every surface is ready for what comes next.",
  },
  {
    title: "Site Utilities",
    body: "Water, sewer, storm, and conduit installation from the ground up. Underground infrastructure installed right the first time, so nothing has to get dug up twice.",
  },
  {
    title: "Demolition",
    body: "Structure and site demo, cleared and hauled. Whatever's coming down, we take it down clean and get the site ready to start fresh.",
  },
  {
    title: "Clean Up",
    body: "Site clearing and debris removal, start to finish. Keeping a site clean through every phase of a job, not just at the end.",
  },
  {
    title: "Snow Removal",
    body: "Commercial plowing and site clearing through the winter. Keeping properties accessible and safe when the weather doesn't cooperate.",
  },
];

export default function Services() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="px-6 pt-16 pb-4 text-center sm:pt-20">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          Services
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
          If it&rsquo;s site work, chances are we&rsquo;ve done it. Here&rsquo;s
          where we lead — but if your job doesn&rsquo;t fit neatly into a
          category, call us anyway.
        </p>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-6 transition-all duration-200 ease-out hover:border-foreground/30 hover:border-l-[4px] hover:shadow-[0_10px_20px_-6px_rgba(10,10,10,0.3)] motion-safe:hover:-translate-y-1 sm:p-8"
              >
                <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
                  {service.title}
                </h2>
                <p className="mt-3 text-foreground/70">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold px-6 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
          Don&rsquo;t See What You Need?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-foreground/80">
          This list covers where we specialize, but it&rsquo;s not the whole
          picture. C.M. Beach Sitework takes on nearly any site work job — if
          you&rsquo;re not sure whether we handle it, the fastest way to find
          out is to reach out.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row sm:items-start">
          <a
            href="tel:302-228-8789"
            className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
          >
            Call 302-228-8789
          </a>
          <div className="flex flex-col gap-2">
            <a
              href="mailto:samantha@cmbeach.com"
              className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
            >
              Email Us
            </a>
            <span className="text-sm text-foreground/70">
              samantha@cmbeach.com
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
