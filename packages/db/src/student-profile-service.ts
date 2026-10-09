import { and, asc, eq, inArray, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { practiceAttempts, studentProfile, v2IdentityUsers } from "./schema.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

export class StudentProfileForbiddenError extends Error {
  constructor() { super("student_profile_forbidden"); }
}

export function validAvatar(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 50;
}

/** Original getAvailableAvatar rule. After fifty occupied figures, reuse 1. */
export function getAvailableAvatar(taken: readonly number[]): number {
  const used = new Set(taken);
  for (let avatar = 1; avatar <= 50; avatar++) if (!used.has(avatar)) return avatar;
  return 1;
}

/** Missing profiles are assigned in stable class order without a read-side write.
 * Explicit selections occupy their numbers first; two new children consequently
 * see different free figures. No classmates' names leave the database.
 */
export function assignAvailableAvatars(ids: readonly string[], saved: ReadonlyMap<string, number>): Map<string, number> {
  const assigned = new Map<string, number>();
  const used = ids.flatMap((id) => validAvatar(saved.get(id)) ? [saved.get(id)!] : []);
  for (const id of ids) {
    const avatar = saved.get(id);
    if (validAvatar(avatar)) assigned.set(id, avatar);
    else { const free = getAvailableAvatar(used); assigned.set(id, free); used.push(free); }
  }
  return assigned;
}

function missingProfileTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: unknown; cause?: unknown };
  return e.code === "42P01" || (e.cause !== error && missingProfileTable(e.cause));
}

export async function getStudentAvatar(db: Db, classScope: ClassScope, classId: string, userId: string): Promise<number | null> {
  if (!inScope(classScope, classId)) return null;
  const roster = await db.select({ id: v2IdentityUsers.id }).from(v2IdentityUsers)
    .where(and(inArray(v2IdentityUsers.classId, [...classScope]), eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.role, "student")))
    .orderBy(asc(v2IdentityUsers.createdAt), asc(v2IdentityUsers.id));
  if (!roster.some((row) => row.id === userId)) return null;
  const ids = roster.map((row) => row.id);
  let saved = new Map<string, number>();
  try {
    const rows = await db.select({ userId: studentProfile.userId, avatar: studentProfile.avatar }).from(studentProfile)
      .innerJoin(v2IdentityUsers, eq(studentProfile.userId, v2IdentityUsers.id))
      .where(and(inArray(v2IdentityUsers.classId, [...classScope]), eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.role, "student")));
    saved = new Map(rows.map((row) => [row.userId, row.avatar]));
  } catch (error) {
    if (!missingProfileTable(error)) throw error;
  }
  return assignAvailableAvatars(ids, saved).get(userId) ?? null;
}

/** Trusted identity and class membership are checked inside the SAME statement
 * that inserts/updates. Body-supplied account ids never reach this function.
 */
export async function setStudentAvatar(db: Db, classScope: ClassScope, classId: string, userId: string, avatar: number): Promise<void> {
  assertWritableScope(classScope, "setStudentAvatar");
  if (!inScope(classScope, classId) || !userId) throw new StudentProfileForbiddenError();
  if (!validAvatar(avatar)) throw new TypeError("invalid_avatar");
  const changed = await db.insert(studentProfile).select(
    db.select({ userId: v2IdentityUsers.id, avatar: sql<number>`${avatar}::smallint`.as("avatar"), updatedAt: sql<Date>`now()`.as("updated_at") })
      .from(v2IdentityUsers)
      .where(and(inArray(v2IdentityUsers.classId, [...classScope]), eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.id, userId), eq(v2IdentityUsers.role, "student"))),
  ).onConflictDoUpdate({ target: studentProfile.userId, set: { avatar, updatedAt: new Date() } })
    .returning({ userId: studentProfile.userId });
  if (changed.length === 0) throw new StudentProfileForbiddenError();
}

/** Own, distinct daily words actually recorded by the existing attempt writer.
 * Replays, foreign days/grades/modes and words outside today's set do not count.
 */
export async function getDailyChallengeCount(db: Db, classScope: ClassScope, classId: string, userId: string, grade: number, day: string, itemIds: readonly string[]): Promise<number> {
  if (itemIds.length === 0) return 0;
  const [row] = await db.select({ count: sql<number>`count(distinct ${practiceAttempts.itemId})::int` }).from(practiceAttempts)
    .where(and(inArray(practiceAttempts.classId, [...classScope]), eq(practiceAttempts.classId, classId), eq(practiceAttempts.userId, userId),
      eq(practiceAttempts.grade, grade), eq(practiceAttempts.mode, "daily"), eq(practiceAttempts.kind, "vocab"), inArray(practiceAttempts.itemId, [...itemIds]),
      sql`(${practiceAttempts.createdAt} AT TIME ZONE 'Europe/Vienna')::date = ${day}::date`));
  return Math.min(10, Number(row?.count ?? 0));
}

export interface ChapterProgress { unitSlug: string; kind: string; practiced: number; correct: number; attempts: number }
export interface XpDay { day: string; xp: number }

/** Counts describe attempts, not an invented mastery rule. Only current-grade,
 * own rows are aggregated. The chart uses awarded XP, never recomputed rewards.
 */
export async function getStudentChapterProgress(db: Db, classScope: ClassScope, classId: string, userId: string, grade: number): Promise<{ chapters: ChapterProgress[]; days: XpDay[] }> {
  const own = and(inArray(practiceAttempts.classId, [...classScope]), eq(practiceAttempts.classId, classId), eq(practiceAttempts.userId, userId), eq(practiceAttempts.grade, grade));
  const chapters = await db.select({ unitSlug: practiceAttempts.unitSlug, kind: practiceAttempts.kind,
    practiced: sql<number>`count(distinct ${practiceAttempts.itemId})::int`,
    correct: sql<number>`count(distinct ${practiceAttempts.itemId}) filter (where ${practiceAttempts.tier} = 'correct')::int`,
    attempts: sql<number>`count(*)::int`,
  }).from(practiceAttempts).where(and(own, inArray(practiceAttempts.kind, ["vocab", "grammar"])))
    .groupBy(practiceAttempts.unitSlug, practiceAttempts.kind).orderBy(asc(practiceAttempts.unitSlug));
  const day = sql<string>`to_char(${practiceAttempts.createdAt} AT TIME ZONE 'Europe/Vienna', 'YYYY-MM-DD')`;
  const days = await db.select({ day, xp: sql<number>`sum(${practiceAttempts.xpAwarded})::int` }).from(practiceAttempts)
    .where(own).groupBy(day).orderBy(asc(day));
  return { chapters: chapters.map((r) => ({ ...r, practiced: Number(r.practiced), correct: Number(r.correct), attempts: Number(r.attempts) })), days: days.map((r) => ({ ...r, xp: Number(r.xp) })) };
}
