/**
 * Identity lookups for auth — an ORDERED DUAL-READ. v2-native identity
 * (domigo_v2.users/classes, writable) is queried FIRST; if it has no row we fall
 * through to v1's read-only mirrors (public.users/classes). This lets new
 * v2-native rosters take precedence while every existing v1 login keeps working
 * unchanged. Reads return the row INCLUDING the bcrypt hash for the caller to
 * verify. NEVER writes `public.*`. Keeps drizzle out of the web app.
 */
import { and, eq, isNull, sql } from "drizzle-orm";
import { v1Users, v1Classes } from "./v1.ts";
import { v2Classes, v2IdentityUsers } from "./schema.ts";
import { nextInviteCode, pickIdentity } from "./identity.ts";
import type { Db } from "./index.ts";

export interface AuthUserRow {
  id: string;
  displayName: string;
  classId: string | null;
  pinHash: string;
}

// Identical projection (AuthUserRow) from each identity source, so a v2-native or
// v1-mirror hit is interchangeable to the caller.
const cols = {
  id: v1Users.id,
  displayName: v1Users.displayName,
  classId: v1Users.classId,
  pinHash: v1Users.pinHash,
};

const v2Cols = {
  id: v2IdentityUsers.id,
  displayName: v2IdentityUsers.displayName,
  classId: v2IdentityUsers.classId,
  pinHash: v2IdentityUsers.pinHash,
};

/**
 * Student by class invite code + nickname (case-insensitive). Dual-read: the
 * v2-native active class + its student first, else the v1 mirror path. Null if
 * class/user absent or class archived. Invite codes are globally unique across
 * v1+v2 (see allocateClassCode), so a v2 code can never also match a v1 class.
 */
export async function lookupStudentForAuth(
  db: Db,
  inviteCode: string,
  nickname: string,
): Promise<AuthUserRow | null> {
  // v2-native first: active class by invite code, then its student by nickname.
  const v2ClsRows = await db
    .select({ id: v2Classes.id })
    .from(v2Classes)
    .where(and(eq(v2Classes.inviteCode, inviteCode), isNull(v2Classes.archivedAt)))
    .limit(1);
  const v2Cls = v2ClsRows[0];
  let v2Row: AuthUserRow | null = null;
  if (v2Cls) {
    const rows = await db
      .select(v2Cols)
      .from(v2IdentityUsers)
      .where(
        and(
          eq(v2IdentityUsers.role, "student"),
          eq(v2IdentityUsers.classId, v2Cls.id),
          sql`lower(${v2IdentityUsers.displayName}) = lower(${nickname})`,
        ),
      )
      .limit(1);
    v2Row = rows[0] ?? null;
  }
  if (v2Row) return pickIdentity(v2Row, null);

  // v1 fallback: the existing read-only mirror query, unchanged in shape.
  const clsRows = await db
    .select({ id: v1Classes.id, archivedAt: v1Classes.archivedAt })
    .from(v1Classes)
    .where(eq(v1Classes.inviteCode, inviteCode))
    .limit(1);
  const cls = clsRows[0];
  if (!cls || cls.archivedAt) return pickIdentity(v2Row, null);
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
  return pickIdentity(v2Row, rows[0] ?? null);
}

/**
 * Grade (1–4) of a class by id — for grade-aware surfaces (the session carries
 * classId, not grade). Dual-read: v2-native class first, then the v1 mirror.
 * Null if the class is absent in both.
 */
export async function getClassGrade(db: Db, classId: string): Promise<number | null> {
  const v2Rows = await db
    .select({ grade: v2Classes.grade })
    .from(v2Classes)
    .where(eq(v2Classes.id, classId))
    .limit(1);
  const v2Grade = v2Rows[0]?.grade ?? null;
  if (v2Grade != null) return v2Grade; // != null (not truthiness) so a 0 grade wouldn't fall through
  const rows = await db
    .select({ grade: v1Classes.grade })
    .from(v1Classes)
    .where(eq(v1Classes.id, classId))
    .limit(1);
  return pickIdentity(v2Grade, rows[0]?.grade ?? null);
}

/** Teacher by nickname (case-insensitive). Dual-read: v2-native teacher first, then the v1 mirror. */
export async function lookupTeacherForAuth(db: Db, nickname: string): Promise<AuthUserRow | null> {
  const v2Rows = await db
    .select(v2Cols)
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.role, "teacher"), sql`lower(${v2IdentityUsers.displayName}) = lower(${nickname})`))
    .limit(1);
  const v2Row = v2Rows[0] ?? null;
  if (v2Row) return pickIdentity(v2Row, null);
  const rows = await db
    .select(cols)
    .from(v1Users)
    .where(and(eq(v1Users.role, "teacher"), sql`lower(${v1Users.displayName}) = lower(${nickname})`))
    .limit(1);
  return pickIdentity(v2Row, rows[0] ?? null);
}

/**
 * Mint a class invite code that collides with NEITHER an existing v1 code NOR a
 * v2 one — both pools share the single code space a student types in. Reads every
 * code from both tables into one set (uppercased, since a generated code is always
 * uppercase, so a differently-cased legacy code can't slip through as a dupe),
 * then delegates to the pure nextInviteCode.
 */
export async function allocateClassCode(db: Db): Promise<string> {
  const [v1Rows, v2Rows] = await Promise.all([
    db.select({ code: v1Classes.inviteCode }).from(v1Classes),
    db.select({ code: v2Classes.inviteCode }).from(v2Classes),
  ]);
  const taken = new Set<string>();
  for (const r of v1Rows) taken.add(r.code.toUpperCase());
  for (const r of v2Rows) taken.add(r.code.toUpperCase());
  return nextInviteCode(taken);
}
