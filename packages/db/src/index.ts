/**
 * @domigo/db — v2-owned persistence (Neon serverless HTTP). Server-only.
 * Additive to the shared Neon: all tables live in the `domigo_v2` schema; v1's
 * `public` is never touched (see drizzle.config.ts `schemaFilter`).
 */
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";

export type Db = NeonHttpDatabase<typeof schema>;

let _db: Db | null = null;

/** Memoized Neon HTTP client (stateless — safe across serverless invocations). */
export function getDb(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";
  if (!url) throw new Error("[@domigo/db] DATABASE_URL is not set");
  _db = drizzle(neon(url), { schema });
  return _db;
}

export { schema };
export * from "./schema.ts";
export * from "./review.ts";
export * from "./persist.ts";
export * from "./streak.ts";
export * from "./studypath.ts";
export * from "./gamesave.ts"; // Track C cosmetic game saves (clientRev LWW)
export * from "./game-progress.ts"; // Track C: solved-item derivation from the attempts ledger (Law 2)
export * from "./assignments.ts"; // M-wave: pure mock-test scoring (Note math, DB-free)
export * from "./v1.ts"; // read-only mirrors of v1's public.users/classes (auth identity)
export * from "./auth.ts"; // read-only identity lookups (lookupStudentForAuth/lookupTeacherForAuth)
