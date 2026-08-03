"use client";

import { useState } from "react";

const services = [
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

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = data.get("name");
    const phone = data.get("phone");
    const email = data.get("email");
    const service = data.get("service");
    const message = data.get("message");

    const subject = `Website inquiry from ${name} — ${service}`;
    const body = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\nProject type: ${service}\n\n${message}`;

    window.location.href = `mailto:samantha@cmbeach.com?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        <select name="service" required className={fieldClasses} defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          {services.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </label>

      <label className="block sm:col-span-2">
        <span className={labelClasses}>Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className={fieldClasses}
        />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className="inline-block border-2 border-foreground bg-foreground px-8 py-3 font-heading text-lg font-bold uppercase tracking-wide text-gold transition-colors hover:bg-transparent hover:text-foreground"
        >
          Send Message
        </button>
        <p className="mt-3 text-sm text-foreground/60">
          Submitting opens your email client with this message pre-filled,
          addressed to samantha@cmbeach.com.
          {sent && " Your email client should be open now."}
        </p>
      </div>
    </form>
  );
}
