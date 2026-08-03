"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/team", label: "Team" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-gold/40 px-6 py-4">
      <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
        <Link href="/" aria-label="C.M. Beach Sitework home">
          <Image
            src="/CMBeachlogo.png"
            alt="C.M. Beach Sitework"
            width={400}
            height={300}
            className="h-14 w-auto"
          />
        </Link>
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`font-heading text-sm font-semibold uppercase tracking-wide transition-colors hover:text-gold ${
                active ? "text-gold" : "text-foreground"
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
