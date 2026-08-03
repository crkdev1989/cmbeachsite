"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitApplication, type ApplicationFormState } from "./actions";

const positions = [
  "Utility",
  "Mass Grading",
  "Fine Grading",
  "Demolition",
  "Equipment Operator",
  "General Labor",
  "Other",
];

const availabilityOptions = ["Full-time", "Part-time", "Seasonal"];

const fieldClasses =
  "mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none";

const labelClasses =
  "block text-xs font-semibold uppercase tracking-wide text-sage";

const fileFieldClasses =
  "mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground file:mr-4 file:border-0 file:bg-foreground file:px-4 file:py-2 file:font-heading file:text-xs file:font-bold file:uppercase file:tracking-wide file:text-gold";

const initialState: ApplicationFormState = { status: "idle" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-60"
    >
      {pending ? "Submitting..." : "Submit Application"}
    </button>
  );
}

export default function ApplicationForm() {
  const [state, formAction] = useActionState(submitApplication, initialState);

  if (state.status === "success") {
    return (
      <div className="text-center">
        <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
          Application Received
        </h2>
        <p className="mt-3 text-foreground/70">
          Thanks for reaching out. We review every application and will
          contact you if there&rsquo;s a fit.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <h2 className="text-center font-heading text-xl font-bold uppercase tracking-wide sm:col-span-2">
        Apply
      </h2>

      <label className="block">
        <span className={labelClasses}>Name</span>
        <input type="text" name="name" required className={fieldClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Phone</span>
        <input type="tel" name="phone" required className={fieldClasses} />
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Email</span>
        <input type="email" name="email" required className={fieldClasses} />
      </label>

      <label className="block">
        <span className={labelClasses}>Position Interested In</span>
        <select name="position" required className={fieldClasses} defaultValue="">
          <option value="" disabled>
            Select a position
          </option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelClasses}>Years of Relevant Experience</span>
        <input
          type="text"
          name="yearsExperience"
          required
          placeholder="e.g. 5"
          className={fieldClasses}
        />
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>
          Tell us about the type of work you&rsquo;ve done
        </span>
        <textarea
          name="experienceDescription"
          required
          rows={5}
          className={fieldClasses}
        />
      </label>

      <label className="block">
        <span className={labelClasses}>Valid Driver&rsquo;s License?</span>
        <select name="hasLicense" required className={fieldClasses} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label className="block">
        <span className={labelClasses}>CDL?</span>
        <select name="hasCdl" required className={fieldClasses} defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Availability</span>
        <select
          name="availability"
          required
          className={fieldClasses}
          defaultValue=""
        >
          <option value="" disabled>
            Select one
          </option>
          {availabilityOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>
          Anything else you want us to know?
        </span>
        <textarea name="notes" rows={3} className={fieldClasses} />
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Resume (PDF or Word, max 10MB)</span>
        <input
          type="file"
          name="resume"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={fileFieldClasses}
        />
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
