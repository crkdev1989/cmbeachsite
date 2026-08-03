"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { authenticate } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-60"
    >
      {pending ? "Signing In..." : "Sign In"}
    </button>
  );
}

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <form action={formAction} className="mt-8 flex flex-col gap-4">
      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wide text-sage">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
        />
      </label>

      <label className="block">
        <span className="block text-xs font-semibold uppercase tracking-wide text-sage">
          Password
        </span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none"
        />
      </label>

      {errorMessage && (
        <p className="text-sm font-semibold text-red-800" role="alert">
          {errorMessage}
        </p>
      )}

      <div className="mt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
