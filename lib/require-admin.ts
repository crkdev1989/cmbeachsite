import { auth } from "@/auth";

/**
 * Defense-in-depth: proxy.ts already gates /admin/* page navigation, but
 * Server Actions can be invoked in ways that don't go through it, so every
 * mutating admin action calls this explicitly rather than trusting proxy
 * alone (per Next.js's own guidance on Server Function auth).
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated.");
  }
  return session.user;
}
