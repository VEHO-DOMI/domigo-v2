/**
 * Read-only identity lookups for auth. Query v1's `public.users`/`public.classes`
 * (via the mirrors) and return the row INCLUDING the bcrypt hash for the caller
 * to verify. NEVER writes `public.*`. Keeps drizzle out of the web app.
 */
import { and, eq, sql } from "drizzle-orm";
import { v1Users, v1Classes } from "./v1.ts";
import type { Db } from "./index.ts";

export interface AuthUserRow {
  id: string;
  displayName: string;
  classId: string | null;
  pinHash: string;
}

const cols = {
  id: v1Users.id,
  displayName: v1Users.displayName,
  classId: v1Users.classId,
  pinHash: v1Users.pinHash,
};

/** Student by class invite code + nickname (case-insensitive). Null if class/user absent or class archived. */
export async function lookupStudentForAuth(
  db: Db,
  inviteCode: string,
  nickname: string,
): Promise<AuthUserRow | null> {
  const clsRows = await db
    .select({ id: v1Classes.id, archivedAt: v1Classes.archivedAt })
    .from(v1Classes)
    .where(eq(v1Classes.inviteCode, inviteCode))
    .limit(1);
  const cls = clsRows[0];
  if (!cls || cls.archivedAt) return null;
  const rows = await db
    .select(cols)
    .from(v1Users)
    .where(
      and(
        eq(v1Users.role, "student"),
        eq(v1Users.classId, cls.id),
        sql`lower(${v1Users.displayName}) = lower(${nickname})`,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** Grade (1–4) of a class by id — read-only `public.classes` lookup for grade-aware surfaces (the session carries classId, not grade). Null if the class is absent. */
export async function getClassGrade(db: Db, classId: string): Promise<number | null> {
  const rows = await db
    .select({ grade: v1Classes.grade })
    .from(v1Classes)
    .where(eq(v1Classes.id, classId))
    .limit(1);
  return rows[0]?.grade ?? null;
}

/** Teacher by nickname (case-insensitive). */
export async function lookupTeacherForAuth(db: Db, nickname: string): Promise<AuthUserRow | null> {
  const rows = await db
    .select(cols)
    .from(v1Users)
    .where(and(eq(v1Users.role, "teacher"), sql`lower(${v1Users.displayName}) = lower(${nickname})`))
    .limit(1);
  return rows[0] ?? null;
}
