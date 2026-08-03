import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | C.M. Beach Sitework",
  description: "Admin login for C.M. Beach Sitework.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:py-20">
      <div className="w-full max-w-md">
        <h1 className="text-center font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          Admin Login
        </h1>
        <div className="mt-8 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
