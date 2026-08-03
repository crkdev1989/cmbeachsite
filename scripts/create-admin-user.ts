/**
 * One-off setup script: creates a user in the `users` table with a
 * bcrypt-hashed password. Run with `npm run create-admin` and answer the
 * prompts — the password is never written to shell history or source code.
 *
 * Requires DATABASE_URL to be set (see .env.example).
 */
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";

async function main() {
  const rl = createInterface({ input: stdin, output: stdout });

  const name = await rl.question("Name: ");
  const emailRaw = await rl.question("Email: ");
  const password = await rl.question("Password: ");

  rl.close();

  const email = emailRaw.trim().toLowerCase();

  if (!name.trim() || !email || password.length < 8) {
    console.error(
      "\nName and email are required, and password must be at least 8 characters.",
    );
    process.exit(1);
  }

  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing) {
    console.error(`\nA user with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const [created] = await db
    .insert(users)
    .values({ name: name.trim(), email, passwordHash })
    .returning({ id: users.id, email: users.email });

  console.log(`\nCreated user ${created.email} (id: ${created.id}).`);
  process.exit(0);
}

main().catch((error) => {
  console.error("\nFailed to create user:", error);
  process.exit(1);
});
