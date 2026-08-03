import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center sm:py-20">
      <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-foreground/80">
        The page you&rsquo;re looking for doesn&rsquo;t exist or may have
        been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
      >
        Back to Home
      </Link>
    </main>
  );
}
