import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config: no database or bcrypt imports here. This is used
 * directly by middleware.ts (which runs on the Edge runtime) as well as
 * spread into the full config in auth.ts. Keep it free of Node-only deps.
 */
export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login";

      if (isAdminRoute && !isLoginPage) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
