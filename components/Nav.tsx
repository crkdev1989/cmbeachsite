"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b-[3px] border-gold bg-slate px-6 py-4">
      <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        <Link
          href="/"
          aria-label="C.M. Beach Sitework home"
          className="bg-[#F5F2E8] px-2 py-1"
        >
          <Image
            src="/CMBeachlogo-nav.png"
            alt="C.M. Beach Sitework"
            width={784}
            height={370}
            className="h-12 w-auto"
          />
        </Link>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-sm font-semibold uppercase tracking-wide transition-colors hover:text-gold ${
                active
                  ? "text-gold underline decoration-2 underline-offset-4"
                  : "text-[#F5F2E8]"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
