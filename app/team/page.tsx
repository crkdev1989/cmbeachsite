import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | C.M. Beach Sitework",
  description:
    "Meet the crew behind C.M. Beach Sitework — sitework, utilities, and excavation across Delaware and Maryland's Eastern Shore.",
};

const team = [
  {
    name: "Chase Beach",
    title: "Owner",
    bio: "Built C.M. Beach Sitework from the ground up, hands-on across every phase of the job — not just running the business, but running equipment when the site needs it.",
  },
  {
    name: "Samantha Beach",
    title: "Director of Operations",
    bio: "Keeps every job on schedule and every client in the loop, with a working knowledge of the field side that comes from being part of this from day one.",
  },
  {
    name: "Craig Kelley",
    title: "Utility Foreman",
    bio: "Leads water, sewer, storm, and conduit installation, with 23 years across nearly every phase of site work — utilities is where he leads, not where he's limited to.",
  },
  {
    name: "Adam Kelley",
    title: "Mass Grading & Earthwork Foreman",
    bio: "Leads mass grading and earthwork, with the field experience to step into utilities, demo, or fine grading whenever the job calls for it.",
  },
  {
    name: "Steve Eashum",
    title: "Fine Grading & Earthwork Foreman",
    bio: "Leads fine grading and precision earthwork, equally capable stepping into mass grading or demo whenever a site needs more hands on a different task.",
  },
];

export default function Team() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-center font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          The Crew Behind the Work
        </h1>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.name}
              className="border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-6 transition-colors hover:border-foreground/30 hover:border-l-gold"
            >
              <div className="flex aspect-square items-center justify-center border border-foreground/15 bg-foreground/5 text-xs font-semibold uppercase tracking-widest text-foreground/50">
                {member.name}
              </div>
              <h2 className="mt-5 font-heading text-xl font-bold uppercase tracking-wide">
                {member.name}
              </h2>
              <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-sage">
                {member.title}
              </p>
              <p className="mt-3 text-foreground/70">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
