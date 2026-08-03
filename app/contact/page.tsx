import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact | C.M. Beach Sitework",
  description:
    "Get in touch with C.M. Beach Sitework to talk through your project or request an estimate.",
};

export default function Contact() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold uppercase tracking-wide sm:text-5xl">
            Contact
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-foreground/80 sm:text-xl">
            Get in touch to talk through your project or request an estimate.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
          {/* Contact info */}
          <div className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
              Get In Touch
            </h2>
            <dl className="mt-6 space-y-5">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-sage">
                  Phone
                </dt>
                <dd className="mt-1">
                  <a
                    href="tel:302-228-8789"
                    className="text-lg font-semibold text-foreground hover:text-gold"
                  >
                    302-228-8789
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-sage">
                  Email
                </dt>
                <dd className="mt-1">
                  <a
                    href="mailto:samantha@cmbeach.com"
                    className="text-lg font-semibold text-foreground hover:text-gold"
                  >
                    samantha@cmbeach.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-sage">
                  Service Area
                </dt>
                <dd className="mt-1 text-foreground/80">
                  Delaware and Maryland&rsquo;s Eastern Shore. We work job
                  sites across the region rather than a single office
                  location.
                </dd>
              </div>
            </dl>
          </div>

          {/* Service area map */}
          <div className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 text-center sm:p-10">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
              Where We Work
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-sage">
              Serving Delaware and Maryland&rsquo;s Eastern Shore.
            </p>
            <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden border-[3px] border-gold">
              <iframe
                src="https://www.google.com/maps?q=38.76,-75.56&z=7&output=embed"
                title="Map of C.M. Beach Sitework's service area covering Delaware and Maryland's Eastern Shore"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="mt-6 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
