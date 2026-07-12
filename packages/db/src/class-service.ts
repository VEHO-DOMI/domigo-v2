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
 */
export async function archiveClass(db: Db, id: string, teacherId: string): Promise<void> {
  await db
    .update(v2Classes)
    .set({ archivedAt: new Date() })
    .where(and(eq(v2Classes.id, id), eq(v2Classes.teacherId, teacherId)));
}
