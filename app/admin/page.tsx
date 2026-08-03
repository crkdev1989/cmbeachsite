import type { Metadata } from "next";
import { auth, signOut } from "@/auth";

export const metadata: Metadata = {
  title: "Admin | C.M. Beach Sitework",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await auth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-20">
      <div className="w-full max-w-md text-center">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          Admin
        </h1>
        <p className="mt-4 text-foreground/80">
          Signed in as {session?.user?.name ?? session?.user?.email}.
        </p>
        <p className="mt-2 text-sm text-foreground/60">
          Job and media management tools aren&rsquo;t built yet — this page
          only confirms the protected route and login flow are working.
        </p>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
