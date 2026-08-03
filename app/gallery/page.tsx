import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery | C.M. Beach Sitework",
  description:
    "Our project gallery is coming soon — photos from jobs across Delaware and Maryland's Eastern Shore.",
};

export default function Gallery() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
          Gallery
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground/80 sm:text-xl">
          Our project gallery is coming soon — we&rsquo;re putting together
          photos from jobs across Delaware and Maryland&rsquo;s Eastern Shore
          to show the work firsthand. Check back soon, or call to talk
          through a project directly.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row sm:items-start">
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
      </div>
    </main>
  );
}
