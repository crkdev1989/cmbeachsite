import type { NextConfig } from "next";

// R2_PUBLIC_URL is a runtime env var (its host depends on which bucket/
// custom domain you've set up), so the allowlist for next/image has to be
// built dynamically here rather than hardcoded. Note this only takes
// effect on build/deploy — changing R2_PUBLIC_URL requires a rebuild
// before next/image will load images from the new host.
const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (process.env.R2_PUBLIC_URL) {
  try {
    const url = new URL(process.env.R2_PUBLIC_URL);
    remotePatterns.push({
      protocol: url.protocol === "http:" ? "http" : "https",
      hostname: url.hostname,
    });
  } catch {
    console.warn(
      `R2_PUBLIC_URL ("${process.env.R2_PUBLIC_URL}") isn't a valid URL — next/image won't be able to load gallery photos.`,
    );
  }
}

const nextConfig: NextConfig = {
  images: { remotePatterns },
};

export default nextConfig;
