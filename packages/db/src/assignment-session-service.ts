/**
 * M-3 · Assignment-session persistence (Neon, server-only, best-effort). The
 * lifecycle/timing/scoring LOGIC is pure in assignment-session.ts; this file is
 * the CRUD + the attempt read-back for scoring. Grading itself stays in the
 * endpoint (it needs the content loaders + engine, which the db package must
 * not import).
 */
import { and, asc, desc, eq, isNull, lte, or } from "drizzle-orm";
import type { Db } from "./index.ts";
import { assignments, assignmentSections, assignmentSessions, practiceAttempts } from "./schema.ts";
import { v1Users } from "./v1.ts";
import { sessionExpiry } from "./assignment-session.ts";
import type { ScorableAttempt } from "./assignments.ts";
import type { SubmittedScore } from "./assignment-session.ts";

/** Non-archived, already-started assignments for a class (the student list). */
export async function listAssignmentsForStudent(db: Db, classId: string, now: Date) {
  return db
    .select()
    .from(assignments)
    .where(and(eq(assignments.classId, classId), isNull(assignments.archivedAt), or(isNull(assignments.startsAt), lte(assignments.startsAt, now))))
    .orderBy(desc(assignments.createdAt));
}

/** One assignment + its sections + THIS student's sessions (null if not found). */
export async function getStudentAssignmentView(db: Db, assignmentId: string, userId: string) {
  const [a] = await db.select().from(assignments).where(eq(assignments.id, assignmentId)).limit(1);
  if (!a) return null;
  const sections = await db.select().from(assignmentSections).where(eq(assignmentSections.assignmentId, assignmentId)).orderBy(asc(assignmentSections.position));
  const sessions = await db
    .select()
    .from(assignmentSessions)
    .where(and(eq(assignmentSessions.assignmentId, assignmentId), eq(assignmentSessions.userId, userId)))
    .orderBy(asc(assignmentSessions.attemptNumber));
  return { assignment: a, sections, sessions };
}

/** The student's current unsubmitted session for an assignment (the wall + submit use it). */
export async function getLiveSessionForUser(db: Db, assignmentId: string, userId: string) {
  const [s] = await db
    .select()
    .from(assignmentSessions)
    .where(and(eq(assignmentSessions.assignmentId, assignmentId), eq(assignmentSessions.userId, userId), isNull(assignmentSessions.submittedAt)))
    .orderBy(desc(assignmentSessions.attemptNumber))
    .limit(1);
  return s ?? null;
}

export type StartResult =
  | { ok: true; sessionId: string; expiresAt: Date | null; attemptNumber: number }
  | { ok: false; reason: "no_attempts_left" };

/**
 * Resume the live sitting if one exists, else open the next attempt (up to
 * `attemptsPerTest`). `expiresAt` is stamped server-side from the assignment's
 * duration + now — the client can never extend its own clock.
 */
export async function startOrResumeSession(
  db: Db,
  assignment: { id: string; attemptsPerTest: number; sessionDurationMinutes: number | null },
  userId: string,
  now: Date,
): Promise<StartResult> {
  const live = await getLiveSessionForUser(db, assignment.id, userId);
  if (live) return { ok: true, sessionId: live.id, expiresAt: live.expiresAt, attemptNumber: live.attemptNumber };

  const prior = await db
    .select({ n: assignmentSessions.attemptNumber })
    .from(assignmentSessions)
    .where(and(eq(assignmentSessions.assignmentId, assignment.id), eq(assignmentSessions.userId, userId)));
  const used = prior.length;
  if (used >= assignment.attemptsPerTest) return { ok: false, reason: "no_attempts_left" };

  const expiresAt = sessionExpiry(now, assignment.sessionDurationMinutes);
  const [row] = await db
    .insert(assignmentSessions)
    .values({ assignmentId: assignment.id, userId, attemptNumber: used + 1, expiresAt, startedAt: now })
    .returning({ id: assignmentSessions.id });
  return { ok: true, sessionId: row!.id, expiresAt, attemptNumber: used + 1 };
}

/** A session's graded attempts, scoped by the sessionId stamped in each attempt's context. */
export async function getSessionAttempts(db: Db, userId: string, assignmentId: string, sessionId: string): Promise<ScorableAttempt[]> {
  const rows = await db
    .select({ itemId: practiceAttempts.itemId, tier: practiceAttempts.tier, createdAt: practiceAttempts.createdAt, context: practiceAttempts.context })
    .from(practiceAttempts)
    .where(and(eq(practiceAttempts.userId, userId), eq(practiceAttempts.mode, `assign:${assignmentId}`)));
  return rows
    .filter((r) => (r.context as { sessionId?: string } | null)?.sessionId === sessionId)
    .map((r) => ({ itemId: r.itemId, tier: r.tier as ScorableAttempt["tier"], createdAt: r.createdAt }));
}

// ── M-4 · teacher results roster reads ───────────────────────────────────────

/** Every student's sittings for an assignment (all attempts), for the roster. */
export async function listSessionsForAssignment(db: Db, assignmentId: string) {
  return db
    .select()
    .from(assignmentSessions)
    .where(eq(assignmentSessions.assignmentId, assignmentId))
    .orderBy(asc(assignmentSessions.userId), asc(assignmentSessions.attemptNumber));
}

export interface StudentRow {
  id: string;
  name: string;
}

/** The students of a class (read-only SELECT on v1 public.users) — the roster's names. */
export async function listStudentsForClass(db: Db, classId: string): Promise<StudentRow[]> {
  const rows = await db
    .select({ id: v1Users.id, name: v1Users.displayName })
    .from(v1Users)
    .where(and(eq(v1Users.classId, classId), eq(v1Users.role, "student")));
  return rows.map((r) => ({ id: r.id, name: r.name }));
}

/** Finalize a submitted sitting with its exact score (from the pure scorer).
 *  `note` is null for checkups — they are points-only by decision (doc 21 §8-③). */
export async function submitSession(
  db: Db,
  sessionId: string,
  score: Pick<SubmittedScore, "displayPct"> & { note: SubmittedScore["note"] | null },
  submittedAt: Date,
): Promise<void> {
  await db
    .update(assignmentSessions)
    .set({ submittedAt, scorePct: score.displayPct.toFixed(2), note: score.note, updatedAt: submittedAt })
    .where(eq(assignmentSessions.id, sessionId));
}
