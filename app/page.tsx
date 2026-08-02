import Image from "next/image";

const badges = [
  "Licensed & Insured",
  "Sitework · Utilities · Excavation",
  "Serving Delaware and Maryland's Eastern Shore",
];

const photos = ["Project Photo 1", "Project Photo 2", "Project Photo 3"];

const services = [
  {
    title: "Mass Grading",
    description:
      "Large-scale earthwork to bring a site to grade and ready for construction.",
  },
  {
    title: "Fine Grading",
    description:
      "Precision finish grading for drainage, paving, and final tolerances.",
  },
  {
    title: "Site Utilities",
    description: "Water, sewer, and storm installation from the ground up.",
  },
  {
    title: "Demolition",
    description: "Structure and site demo, cleared and hauled.",
  },
  {
    title: "Clean Up",
    description: "Site clearing and debris removal, start to finish.",
  },
  {
    title: "Snow Removal",
    description: "Commercial plowing and site clearing through the winter.",
  },
];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center px-6 pt-16 pb-12 text-center sm:pt-20">
        <Image
          src="/CMBeachlogo.png"
          alt="C.M. Beach Sitework logo"
          width={400}
          height={300}
          priority
        />
        <h1 className="mt-8 font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl md:text-6xl">
          C.M. Beach Sitework
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
          Site work and excavation done right, from the ground up.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="border border-gold px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sage sm:text-sm"
            >
              {badge}
            </span>
          ))}
        </div>

        <p className="mt-10 max-w-3xl text-base text-foreground/80 sm:text-lg">
          From mass grading to final clean up, C.M. Beach Sitework handles
          every phase of the site — utilities, demolition, and everything in
          between.
        </p>
      </section>

      {/* Photos */}
      <section className="border-y border-foreground/10">
        <div className="mx-auto grid max-w-5xl grid-cols-1 sm:grid-cols-3">
          {photos.map((label, i) => (
            <div
              key={label}
              className={`flex aspect-video items-center justify-center border-foreground/10 bg-foreground/5 text-xs font-semibold uppercase tracking-widest text-foreground/40 sm:text-sm ${
                i > 0 ? "border-t sm:border-t-0 sm:border-l" : ""
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            Services
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="border border-foreground/15 border-l-4 border-l-gold bg-background p-6 transition-colors hover:border-foreground/30 hover:border-l-gold"
              >
                <h3 className="font-heading text-xl font-bold uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="mt-3 text-foreground/70">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gold px-6 py-16 text-center">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-wide text-foreground sm:text-3xl">
          Get an estimate.
        </h2>
        <a
          href="tel:302-228-8789"
          className="mt-6 inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
        >
          Call 302-228-8789
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold px-6 py-8 text-center text-sm text-foreground/70">
        <p>&copy; 2026 C.M. Beach Sitework &middot; All Rights Reserved</p>
        <p className="mt-2">
          Built by{" "}
          <a
            href="https://crkdev.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:underline"
          >
            CRK Dev
          </a>
        </p>
      </footer>
    </main>
  );
}
