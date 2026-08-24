/**
 * P-1b · Teacher class CRUD (Neon, server-only) over the v2-native identity
 * tables. A teacher OWNS their classes: every read and write is scoped by
 * `teacherId`, so one teacher can never see or mutate another's class — the
 * authorization IS the WHERE clause (no separate ownership check to forget).
 * Writes land ONLY in `domigo_v2.classes`; v1's `public` is never touched.
 *
 * Pure name/grade validation lives here too (DB-free `validateClassName` /
 * `validateGrade`, unit-tested in class-service.test.ts) so the endpoint and the
 * service share one gate. Mirrors assignment-service.ts's shape: functions take
 * `(db, …args)`, return small row summaries, and the caller wraps in try/catch.
 */
import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2Classes, v2IdentityUsers } from "./schema.ts";
import { v1Classes, v1Users } from "./v1.ts";
import { allocateClassCode } from "./auth.ts";

/** Longest allowed class name (a roster label, not prose). */
export const MAX_CLASS_NAME_LENGTH = 80;

/**
 * Pure name check — trims, requires non-empty, caps the length. Returns a
 * human-readable error (same voice as validateAssignmentDraft) or null when the
 * name is fine. DB-free so the endpoint validates a request body with the exact
 * rule the service enforces.
 */
export function validateClassName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed === "") return "Give the class a name.";
  if (trimmed.length > MAX_CLASS_NAME_LENGTH) return `A class name can be at most ${MAX_CLASS_NAME_LENGTH} characters.`;
  return null;
}

/** Pure grade check — an Austrian AHS lower-cycle grade is 1..4 (integer). */
export function validateGrade(grade: number): boolean {
  return Number.isInteger(grade) && grade >= 1 && grade <= 4;
}

/** One class the teacher owns, plus its live roster size, for the /admin list. */
export interface ClassSummary {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  studentCount: number;
  createdAt: Date;
}

/** One class the teacher owns (core fields, no roster count) — for a detail page. */
export interface OwnedClass {
  id: string;
  name: string;
  inviteCode: string;
  grade: number;
  archivedAt: Date | null;
  createdAt: Date;
}

/**
 * Fetch ONE class by id, but only if `teacherId` owns it (else null) — the authz
 * gate for a per-class detail page (the roster view). Includes `archivedAt` so the
 * page can flag an archived class rather than 404 a still-valid bookmark.
 */
export async function getClassForTeacher(db: Db, id: string, teacherId: string): Promise<OwnedClass | null> {
  const rows = await db
    .select({
      id: v2Classes.id,
      name: v2Classes.name,
      inviteCode: v2Classes.inviteCode,
      grade: v2Classes.grade,
      archivedAt: v2Classes.archivedAt,
      createdAt: v2Classes.createdAt,
    })
    .from(v2Classes)
    .where(and(eq(v2Classes.id, id), eq(v2Classes.teacherId, teacherId)))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Create a class owned by `teacherId`. Re-validates name/grade (defense in depth —
 * the endpoint already 400s bad input) and mints a globally-unique invite code
 * (unique across v1 AND v2 — the single code space a student types), then inserts
 * and returns the created row (studentCount 0 — a fresh class has no roster yet).
 */
export async function createClass(
  db: Db,
  input: { name: string; grade: number; teacherId: string },
): Promise<ClassSummary> {
  const nameError = validateClassName(input.name);
  if (nameError) throw new Error(`createClass: ${nameError}`);
  if (!validateGrade(input.grade)) throw new Error("createClass: grade must be between 1 and 4.");

  const inviteCode = await allocateClassCode(db);
  const [row] = await db
    .insert(v2Classes)
    .values({ name: input.name.trim(), inviteCode, grade: input.grade, teacherId: input.teacherId })
    .returning({
      id: v2Classes.id,
      name: v2Classes.name,
      inviteCode: v2Classes.inviteCode,
      grade: v2Classes.grade,
      createdAt: v2Classes.createdAt,
    });
  return { id: row!.id, name: row!.name, inviteCode: row!.inviteCode, grade: row!.grade, studentCount: 0, createdAt: row!.createdAt };
}

/**
 * The teacher's own active (non-archived) classes, oldest first, each with a
 * studentCount. Two queries then joined in JS (Neon HTTP has no cheap correlated
 * count here, and the codebase already aggregates rosters this way): the classes,
 * then one grouped head-count over their rosters. Only students carry a classId
 * (teachers are null — see schema), so counting by classId IS the roster size.
 */
export async function listClassesForTeacher(db: Db, teacherId: string): Promise<ClassSummary[]> {
  const classes = await db
    .select({
      id: v2Classes.id,
      name: v2Classes.name,
      inviteCode: v2Classes.inviteCode,
      grade: v2Classes.grade,
      createdAt: v2Classes.createdAt,
    })
    .from(v2Classes)
    .where(and(eq(v2Classes.teacherId, teacherId), isNull(v2Classes.archivedAt)))
    .orderBy(v2Classes.createdAt);
  if (classes.length === 0) return [];

  const ids = classes.map((c) => c.id);
  const counts = await db
    .select({ classId: v2IdentityUsers.classId, n: sql<number>`count(*)::int` })
    .from(v2IdentityUsers)
    .where(inArray(v2IdentityUsers.classId, ids))
    .groupBy(v2IdentityUsers.classId);
  const byClass = new Map(counts.map((r) => [r.classId, r.n]));

  return classes.map((c) => ({ ...c, studentCount: byClass.get(c.id) ?? 0 }));
}

/**
 * Rename a class — only when `id` AND `teacherId` match AND it isn't archived, so
 * a teacher can't touch another's (or a retired) class. A non-matching id updates
 * zero rows (a silent no-op, like archiveAssignment). No `updatedAt` column on
 * this table, so none is set.
 */
export async function renameClass(db: Db, id: string, teacherId: string, name: string): Promise<void> {
  const nameError = validateClassName(name);
  if (nameError) throw new Error(`renameClass: ${nameError}`);
  await db
    .update(v2Classes)
    .set({ name: name.trim() })
    .where(and(eq(v2Classes.id, id), eq(v2Classes.teacherId, teacherId), isNull(v2Classes.archivedAt)));
}

/**
 * Soft-archive a class (never a hard delete — a class anchors rosters, attempts
 * and assignments that must resolve). Scoped to the owning teacher; archiving a
 * class the teacher doesn't own updates zero rows.
 *
 * ⚠ P3 OPERATING RULE — this function gets NO grandmaster branch, on purpose.
 * Every other roster action the operator performs in a foreign class is
 * correctable; archiving is not. It locks the children of that class out of their
 * logins, and there is no un-archive path in the platform today (RAHMEN_P1 blocker
 * 2). The widest rank on the platform therefore stops exactly here: only the
 * OWNING teacher may retire her own class. If un-archiving ever ships, this
 * paragraph is the place to reconsider — not before.
 */
export async function archiveClass(db: Db, id: string, teacherId: string): Promise<void> {
  await db
    .update(v2Classes)
    .set({ archivedAt: new Date() })
    .where(and(eq(v2Classes.id, id), eq(v2Classes.teacherId, teacherId)));
}

// ─────────────────────────────────────────────────────────────────────────────
// P3 · GRANDMASTER READS — the platform operator's all-classes view.
//
// Everything above this line is owner-scoped by construction. The functions below
// are deliberately UNSCOPED, and every one of them carries `ForGrandmaster` in its
// name so a call site that has NOT checked `isGrandmaster` first reads as wrong at
// a glance. The rank check itself lives in the web app (apps/web/lib/grandmaster.ts,
// an env allowlist) and is performed server-side BEFORE any of these run.
// ─────────────────────────────────────────────────────────────────────────────

/** Shown instead of an owner's name when the teacher row is in neither register. */
export const UNKNOWN_TEACHER_LABEL = "unbekannt";

/** One v2-native class in the all-classes view — WHO owns it and how far it has filled up. */
export interface GrandmasterClassRow {
  id: string;
  name: string;
  grade: number;
  inviteCode: string;
  ownerId: string;
  ownerName: string;
  studentCount: number;
  /** Students who have set a nickname + PIN (claimed_at is not null). */
  claimedCount: number;
  createdAt: Date;
}

/** One v1 legacy class — name, grade and a head count, nothing about the people in it. */
export interface GrandmasterLegacyClassRow {
  id: string;
  name: string;
  grade: number;
  studentCount: number;
}

/**
 * Both registers plus an HONEST third state. `v2Failed` is true when the domigo_v2
 * half could not be read: a diagnostic surface that silently showed an empty v2 list
 * would assert "there are no new classes" when the truth is "I could not look" — the
 * one lie a monitoring view must never tell.
 */
export interface GrandmasterOverview {
  v2: GrandmasterClassRow[];
  legacy: GrandmasterLegacyClassRow[];
  v2Failed: boolean;
  /**
   * K2b · the SAME honest third state for the legacy half. Until now only the v2
   * read could say "I could not look"; the legacy read threw, which took the whole
   * page down with a 500 — an asymmetry in a probe whose entire job is to report
   * on both registers. An empty legacy list must never be able to mean "the old
   * register is gone" when the truth is "it did not answer".
   */
  legacyFailed: boolean;
}

/**
 * Display names for a set of teacher ids — an ORDERED DUAL-READ (v2-native first,
 * then the v1 mirror), the same precedence auth.ts uses for identity: a teacher is
 * only promoted into domigo_v2 the first time they change their PIN, so a v2 class
 * owned by a not-yet-promoted teacher has its name in `public.users` alone.
 * Selects ONLY id + display_name (the login handle) — never any other person column.
 *
 * Unlike auth.ts, BOTH halves degrade here: a name is cosmetic (the caller falls
 * back to UNKNOWN_TEACHER_LABEL), so a failed lookup must never take down the class
 * list it is decorating. An identity lookup gets no such licence.
 */
export async function resolveTeacherNames(db: Db, ids: readonly string[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter((id) => id))];
  const names = new Map<string, string>();
  if (unique.length === 0) return names;

  try {
    const rows = await db
      .select({ id: v2IdentityUsers.id, displayName: v2IdentityUsers.displayName })
      .from(v2IdentityUsers)
      .where(and(inArray(v2IdentityUsers.id, unique), eq(v2IdentityUsers.role, "teacher")));
    for (const r of rows) names.set(r.id, r.displayName);
  } catch (err) {
    console.error("[class-service] v2 teacher-name lookup failed:", errText(err));
  }

  const missing = unique.filter((id) => !names.has(id));
  if (missing.length === 0) return names;
  try {
    const rows = await db
      .select({ id: v1Users.id, displayName: v1Users.displayName })
      .from(v1Users)
      .where(and(inArray(v1Users.id, missing), eq(v1Users.role, "teacher")));
    for (const r of rows) names.set(r.id, r.displayName);
  } catch (err) {
    console.error("[class-service] v1 teacher-name lookup failed:", errText(err));
  }
  return names;
}

/** Short, bounded error text for a degradation log (house shape, cf. assignment-service.ts). */
function errText(err: unknown): string {
  return err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200);
}

/**
 * EVERY active class on the platform, both registers — the operator's answer to
 * "who has set a class up, and who has actually registered?".
 *
 * v2 half: the class, its owner's display name, and one grouped aggregate giving
 * BOTH head counts at once — `count(*)` is everyone on the roster and
 * `count(claimed_at)` is those who have claimed, because count(column) does not
 * count NULLs and claimed_at is NULL exactly while a student is still provisional.
 * The head count is taken the same way listClassesForTeacher takes it (no role
 * filter — only students carry a classId), so the two admin surfaces can never
 * print different numbers for the same class.
 *
 * v1 half: a pure count(*) per class_id. No column of `public.users` other than the
 * grouping key is ever selected — the legacy register is a head count here, never
 * a list of people.
 */
export async function listAllClassesForGrandmaster(db: Db): Promise<GrandmasterOverview> {
  let v2: GrandmasterClassRow[] = [];
  let v2Failed = false;
  try {
    const classes = await db
      .select({
        id: v2Classes.id,
        name: v2Classes.name,
        grade: v2Classes.grade,
        inviteCode: v2Classes.inviteCode,
        teacherId: v2Classes.teacherId,
        createdAt: v2Classes.createdAt,
      })
      .from(v2Classes)
      .where(isNull(v2Classes.archivedAt))
      .orderBy(v2Classes.createdAt);

    if (classes.length > 0) {
      const ids = classes.map((c) => c.id);
      const counts = await db
        .select({
          classId: v2IdentityUsers.classId,
          total: sql<number>`count(*)::int`,
          claimed: sql<number>`count(${v2IdentityUsers.claimedAt})::int`,
        })
        .from(v2IdentityUsers)
        .where(inArray(v2IdentityUsers.classId, ids))
        .groupBy(v2IdentityUsers.classId);
      const byClass = new Map(counts.map((r) => [r.classId, r]));
      const names = await resolveTeacherNames(db, classes.map((c) => c.teacherId));

      v2 = classes.map((c) => ({
        id: c.id,
        name: c.name,
        grade: c.grade,
        inviteCode: c.inviteCode,
        ownerId: c.teacherId,
        ownerName: names.get(c.teacherId) ?? UNKNOWN_TEACHER_LABEL,
        studentCount: byClass.get(c.id)?.total ?? 0,
        claimedCount: byClass.get(c.id)?.claimed ?? 0,
        createdAt: c.createdAt,
      }));
    }
  } catch (err) {
    v2Failed = true; // NOT an empty list — see GrandmasterOverview
    console.error("[class-service] v2 class overview failed:", errText(err));
  }

  let legacy: GrandmasterLegacyClassRow[] = [];
  let legacyFailed = false;
  try {
    const legacyClasses = await db
      .select({ id: v1Classes.id, name: v1Classes.name, grade: v1Classes.grade })
      .from(v1Classes)
      .where(isNull(v1Classes.archivedAt))
      .orderBy(v1Classes.name);

    if (legacyClasses.length > 0) {
      const legacyIds = legacyClasses.map((c) => c.id);
      const legacyCounts = await db
        .select({ classId: v1Users.classId, total: sql<number>`count(*)::int` })
        .from(v1Users)
        .where(inArray(v1Users.classId, legacyIds))
        .groupBy(v1Users.classId);
      const byLegacyClass = new Map(legacyCounts.map((r) => [r.classId, r.total]));
      legacy = legacyClasses.map((c) => ({ ...c, studentCount: byLegacyClass.get(c.id) ?? 0 }));
    }
  } catch (err) {
    legacyFailed = true; // NOT an empty list — see GrandmasterOverview
    console.error("[class-service] legacy class overview failed:", errText(err));
  }

  return { v2, legacy, v2Failed, legacyFailed };
}

/** A v2 class the grandmaster is reaching into — the owning teacherId comes WITH it. */
export interface ForeignClass extends OwnedClass {
  teacherId: string;
}

/**
 * ONE v2 class by id, WITHOUT the owner scope — the god-mode entry point. Returns
 * the owning `teacherId` so the caller can run the ordinary, owner-scoped services
 * with the OWNER's id: the WHERE-clause authorization stays untouched as the single
 * truth, and only the id it runs with is resolved server-side. Callers gate on
 * isGrandmaster first; this function itself is deliberately unscoped.
 */
export async function getClassForGrandmaster(db: Db, id: string): Promise<ForeignClass | null> {
  const rows = await db
    .select({
      id: v2Classes.id,
      name: v2Classes.name,
      inviteCode: v2Classes.inviteCode,
      grade: v2Classes.grade,
      teacherId: v2Classes.teacherId,
      archivedAt: v2Classes.archivedAt,
      createdAt: v2Classes.createdAt,
    })
    .from(v2Classes)
    .where(eq(v2Classes.id, id))
    .limit(1);
  return rows[0] ?? null;
}

/**
 * The teacher who owns the class a given student sits in — the same resolution as
 * getClassForGrandmaster, but keyed on a STUDENT id, because the per-student roster
 * endpoints (/api/admin/roster/[studentId]) never see a class id. Unscoped by
 * design; the caller gates on isGrandmaster. Null when the student has no class or
 * does not exist.
 */
export async function getOwnerIdForStudentForGrandmaster(db: Db, studentId: string): Promise<string | null> {
  const rows = await db
    .select({ teacherId: v2Classes.teacherId })
    .from(v2IdentityUsers)
    .innerJoin(v2Classes, eq(v2IdentityUsers.classId, v2Classes.id))
    .where(eq(v2IdentityUsers.id, studentId))
    .limit(1);
  return rows[0]?.teacherId ?? null;
}
