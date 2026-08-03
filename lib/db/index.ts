import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

declare global {
  var __dbClient: ReturnType<typeof postgres> | undefined;
}

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | undefined;

// Lazily creates the connection on first real use instead of at import
// time. This matters because Next.js evaluates route modules (including
// this one, transitively, via auth.ts) during `next build`'s page-data
// collection step — if we connected/threw at module scope, the entire
// site would fail to build whenever DATABASE_URL isn't set yet, even
// though the public marketing pages never touch the database.
function getDb(): Db {
  if (cached) return cached;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. See .env.example.");
  }

  // Reuse the connection across hot reloads in dev instead of opening a
  // new one on every file save.
  const client = global.__dbClient ?? postgres(connectionString, { max: 10 });
  if (process.env.NODE_ENV !== "production") {
    global.__dbClient = client;
  }

  cached = drizzle(client, { schema });
  return cached;
}

export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb() as object, prop, receiver);
  },
});
