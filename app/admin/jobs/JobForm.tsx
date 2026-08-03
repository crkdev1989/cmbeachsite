"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { JOB_CATEGORIES } from "@/lib/constants";
import type { JobFormState } from "./actions";

const fieldClasses =
  "mt-1 w-full border-2 border-foreground/20 bg-[#F5F4F0] px-3 py-2 text-foreground placeholder:text-foreground/40 focus:border-gold focus:outline-none";

const labelClasses =
  "block text-xs font-semibold uppercase tracking-wide text-sage";

const initialState: JobFormState = { status: "idle" };

export type JobFormDefaults = {
  title: string;
  description: string | null;
  category: string;
  location: string | null;
  jobDate: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-sm font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export default function JobForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prevState: JobFormState, formData: FormData) => Promise<JobFormState>;
  defaultValues?: JobFormDefaults;
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className={labelClasses}>Title</span>
        <input
          type="text"
          name="title"
          required
          defaultValue={defaultValues?.title}
          className={fieldClasses}
        />
      </label>

      <label className="block">
        <span className={labelClasses}>Category</span>
        <select
          name="category"
          required
          defaultValue={defaultValues?.category ?? ""}
          className={fieldClasses}
        >
          <option value="" disabled>
            Select a category
          </option>
          {JOB_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className={labelClasses}>Job Date</span>
        <input
          type="date"
          name="jobDate"
          required
          defaultValue={defaultValues?.jobDate}
          className={fieldClasses}
        />
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Location (optional)</span>
        <input
          type="text"
          name="location"
          defaultValue={defaultValues?.location ?? ""}
          className={fieldClasses}
        />
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Description (optional)</span>
        <textarea
          name="description"
          rows={3}
          defaultValue={defaultValues?.description ?? ""}
          className={fieldClasses}
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
      {state.status === "success" && (
        <p className="text-sm font-semibold text-sage sm:col-span-2">
          Saved.
        </p>
      )}

      <div className="sm:col-span-2">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
