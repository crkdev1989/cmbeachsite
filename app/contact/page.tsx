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

          {/* Service area graphic */}
          <div className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 text-center sm:p-10">
            <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
              Where We Work
            </h2>
            <svg
              viewBox="0 0 200 260"
              role="img"
              aria-label="Illustrative map of the C.M. Beach Sitework service area, covering Delaware and Maryland's Eastern Shore"
              className="mx-auto mt-6 w-full max-w-[220px]"
            >
              <polygon
                points="60,10 140,10 150,40 145,90 160,120 150,160 130,200 110,230 95,250 80,230 70,190 55,150 45,100 50,50"
                fill="rgba(10,10,10,0.05)"
                stroke="#D4A017"
                strokeWidth="3"
              />
              <circle
                cx="100"
                cy="120"
                r="95"
                fill="none"
                stroke="#D4A017"
                strokeWidth="1.5"
                strokeDasharray="6 6"
                opacity="0.6"
              />
              <circle cx="95" cy="55" r="3.5" fill="#0A0A0A" />
              <circle cx="90" cy="190" r="3.5" fill="#0A0A0A" />
              <text
                x="100"
                y="35"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                letterSpacing="0.5"
                fill="#0A0A0A"
              >
                DELAWARE
              </text>
              <text
                x="100"
                y="215"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.3"
                fill="#0A0A0A"
              >
                MD EASTERN
              </text>
              <text
                x="100"
                y="227"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                letterSpacing="0.3"
                fill="#0A0A0A"
              >
                SHORE
              </text>
            </svg>
            <p className="mt-4 text-sm text-foreground/60">
              Illustrative coverage area — not a literal map.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="mt-6 border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10">
          <h2 className="font-heading text-xl font-bold uppercase tracking-wide">
            Send a Message
          </h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
