"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitContact, type ContactFormState } from "@/app/contact/actions";

const projectTypes = [
  "Mass Grading",
  "Fine Grading",
  "Site Utilities",
  "Demolition",
  "Clean Up",
  "Snow Removal",
  "Other",
];

const fieldClasses =
  "mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none";

const labelClasses =
  "block text-xs font-semibold uppercase tracking-wide text-sage";

const initialState: ContactFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-60"
    >
      {pending ? "Sending..." : "Send Message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState);

  if (state.status === "success") {
    return (
      <div className="text-center">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
          Message Sent
        </h2>
        <p className="mt-3 text-foreground/70">
          Thanks for reaching out. We&rsquo;ll be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <h2 className="font-heading text-xl font-bold uppercase tracking-wide sm:col-span-2">
        Send a Message
      </h2>

      <label className="block">
        <span className={labelClasses}>Name</span>
        <input type="text" name="name" required className={fieldClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Phone</span>
        <input type="tel" name="phone" required className={fieldClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Email</span>
        <input type="email" name="email" required className={fieldClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Project Type / Service Needed</span>
        <select
          name="projectType"
          required
          className={fieldClasses}
          defaultValue=""
        >
          <option value="" disabled>
            Select a service
          </option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Message</span>
        <textarea name="message" required rows={5} className={fieldClasses} />
      </label>

      {state.status === "error" && state.message && (
        <p
          className="text-sm font-semibold text-red-800 sm:col-span-2"
          role="alert"
        >
          {state.message}
        </p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
