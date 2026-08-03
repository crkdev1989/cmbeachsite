This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Admin setup (auth, database, storage)

The `/admin` area (job/media management, not built yet — this is just the
foundation) is backed by Postgres (via Drizzle ORM), Cloudflare R2 for file
storage, and Auth.js credentials login. None of this is configured out of
the box; you need to do the following once:

1. **Create a Postgres database.** Any standard Postgres works (Neon,
   Supabase, Vercel Postgres, self-hosted, etc.) — the code only uses a
   plain connection string, no provider-specific client. Copy `.env.example`
   to `.env` and set `DATABASE_URL`.
2. **Create a Cloudflare R2 bucket** and an API token (R2 → Manage API
   Tokens) with read/write access to that bucket. Fill in `R2_ACCOUNT_ID`,
   `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_BUCKET_NAME` in
   `.env`. `R2_PUBLIC_URL` can wait until the bucket is set up to serve
   files publicly (its r2.dev URL or a custom domain).
3. **Generate an auth secret:** `npx auth secret` (or any random 32+ byte
   value) and set it as `AUTH_SECRET` in `.env`.
4. **Create the database tables:** `npm run db:migrate`.
5. **Create your login:** `npm run create-admin` — you'll be prompted for
   name, email, and password interactively. Nothing is hardcoded in the
   repo; the password is hashed with bcrypt before it touches the database.
6. **Sign up for Resend** (resend.com), verify a sending domain, and create
   an API key. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` in `.env`. This
   powers the notification email sent to samantha@cmbeach.com whenever
   someone submits the `/careers` job application form. Without this set,
   applications still save to the database fine — only the email
   notification is skipped (it fails silently and logs a server error, so
   an applicant never sees a broken submission over a missing email config).

After that, `/admin/login` will authenticate against that account and
`/admin` requires a signed-in session (unauthenticated visits redirect to
the login page). Whichever host runs this app in production needs the same
env vars (`DATABASE_URL`, `AUTH_SECRET`, the `R2_*` vars, and
`RESEND_API_KEY`/`RESEND_FROM_EMAIL`) set in its environment — none of them
are Vercel-specific, so moving hosts later is just re-pointing these values.

### Careers application resumes

Resumes uploaded through `/careers` go to the same R2 bucket as everything
else, under an `applications/` prefix, and are stored **privately** — the
`applications.resume_url` database column actually holds the R2 object key,
not a public link. Both the notification email and any future admin
review UI should call `getPresignedDownloadUrl()` from
`lib/storage/r2.ts` to generate a fresh, time-limited link (currently 7
days) rather than treating that column as a permanent URL. This is
deliberate — resumes contain applicants' personal information, so nothing
here is world-readable by default.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
