import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// A separate, minimal NextAuth instance built only from the DB-free config,
// used solely to decode the session JWT and run the `authorized` callback
// for route protection. The DB-backed Credentials provider lives in auth.ts
// and never runs here, keeping this request-gating layer lightweight.
export const { auth: proxy } = NextAuth(authConfig);

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
