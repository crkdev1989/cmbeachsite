import type { Metadata } from "next";
import Image from "next/image";

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
    photo: "/team-chase-beach.jpg",
  },
  {
    name: "Samantha Beach",
    title: "Director of Operations",
    bio: "Keeps every job on schedule and every client in the loop, with a working knowledge of the field side that comes from being part of this from day one.",
    photo: "/team-samantha-beach.jpg",
  },
  {
    name: "Craig Kelley",
    title: "Utility Foreman",
    bio: "Leads water, sewer, storm, and conduit installation, with 23 years across nearly every phase of site work — utilities is where he leads, not where he's limited to.",
    photo: "/team-craig-kelley.jpg",
  },
  {
    name: "Adam Kelley",
    title: "Mass Grading & Earthwork Foreman",
    bio: "Leads mass grading and earthwork, with the field experience to step into utilities, demo, or fine grading whenever the job calls for it.",
    photo: "/team-adam-kelley.jpg",
  },
  {
    name: "Steve Eashum",
    title: "Fine Grading & Earthwork Foreman",
    bio: "Leads fine grading and precision earthwork, equally capable stepping into mass grading or demo whenever a site needs more hands on a different task.",
    photo: "/team-steve-eashum.jpg",
  },
];

export default function Team() {
  return (
    <main className="flex flex-1 flex-col px-6 py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="text-center font-heading text-3xl font-bold uppercase tracking-wide sm:text-4xl">
          The Crew Behind the Work
        </h1>

        <div className="mt-12 flex flex-col gap-10">
          {team.map((member, i) => {
            const photoRight = i % 2 === 1;
            return (
              <div key={member.name} className="grid grid-cols-1 sm:grid-cols-2">
                <div
                  className={`relative aspect-[4/5] self-start overflow-hidden ${
                    photoRight ? "sm:order-2" : "sm:order-1"
                  }`}
                >
                  <Image
                    src={member.photo}
                    alt={`${member.name}, ${member.title} at C.M. Beach Sitework`}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                </div>
                <div
                  className={`flex flex-col justify-center border-[3px] border-foreground/15 border-l-[3px] border-l-gold bg-[#F5F2E8]/75 p-8 sm:p-10 ${
                    photoRight ? "sm:order-1" : "sm:order-2"
                  }`}
                >
                  <h2 className="font-heading text-2xl font-bold uppercase tracking-wide">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-sage">
                    {member.title}
                  </p>
                  <p className="mt-3 text-foreground/70">{member.bio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
