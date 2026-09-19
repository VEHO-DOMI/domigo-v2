/**
 * dach-018 · DELETING A PERSON, for real.
 *
 * konto owns the decision (the retention job, the deletion list, a teacher going
 * inactive) and announces it: POST /api/konto/account-deleted {app_user_id}.
 * This is what DomiGo does about it.
 *
 * WHY IT HAD TO BE BUILT. There was no complete deletion path in this repo.
 * `removeStudent` (roster-service.ts) deletes the identity ROW and says so in
 * its own comment; `deleteTeacherIdentity` does the same for a teacher. Every
 * attempt, text, grade, game save and year-end snapshot stayed. The privacy page
 * said as much — "on request these are deleted too", by hand. A deletion the
 * account service performs on a schedule cannot be by hand.
 *
 * THE SHAPE. There are NO foreign keys anywhere in domigo_v2 (house rule,
 * repeated at schema.ts:368, :412, :437, :769), so there is no cascade to lean
 * on: every table is named here, on purpose, and a new table with a `user_id`
 * has to be added or it will quietly keep its rows. The count per table is
 * returned so the caller can log a number instead of a name.
 *
 * WHAT IS DELIBERATELY NOT DELETED, and why:
 *   · `assignments.created_by` — a mock test belongs to the CLASS that sits it.
 *     Deleting a teacher's assignments would take the class's tests with them,
 *     including sessions children have already submitted.
 *   · `classes.teacher_id` — a class must not disappear with its teacher. konto
 *     hands a group to someone else before it deletes an inactive account
 *     (SPEC §3b), and the nightly sync carries the new owner over.
 *   · `roster_events.actor_id` — the journal is the audit trail. It holds ids,
 *     numbers and lengths, never a name (P-R8), so what stays is a record of
 *     acts, not of a person.
 *   · `writing_submissions.graded_by` — a grade given to ANOTHER child's text.
 *     It is that child's data, not the grader's.
 * Every one of these is a row that names the person by id only; the person
 * themselves, and everything they produced, goes.
 */
import { eq, or } from "drizzle-orm";
import type { Db } from "./index.ts";
import {
  assignmentSessions,
  gameSaves,
  practiceAttempts,
  reviewQueue,
  rolloverSnapshots,
  studyPathProgress,
  userProgress,
  v2IdentityUsers,
  v2OpsLinkUses,
  v2TeacherEvents,
  v2TeacherResetTokens,
  writingSubmissions,
} from "./schema.ts";

export type Loeschbericht = {
  /** Was the person here at all? A stranger is not an error (idempotent, 204). */
  gefunden: boolean;
  /** Rows removed per table — numbers only, never a name. */
  zeilen: Record<string, number>;
};

export async function deleteUserData(db: Db, userId: string): Promise<Loeschbericht> {
  const zeilen: Record<string, number> = {};

  async function weg(name: string, lauf: () => Promise<{ id?: unknown }[]>): Promise<void> {
    try {
      zeilen[name] = (await lauf()).length;
    } catch (err) {
      // A missing table (a deployment behind on migrations) must not stop the
      // deletion of everything else. It is reported, loudly, and the caller
      // answers 500 so konto retries rather than believing it is done.
      console.error(`[konto] deletion of ${name} failed:`, err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200));
      throw err;
    }
  }

  // The learner's own trail.
  await weg("practice_attempts", () => db.delete(practiceAttempts).where(eq(practiceAttempts.userId, userId)).returning({ id: practiceAttempts.id }));
  await weg("review_queue", () => db.delete(reviewQueue).where(eq(reviewQueue.userId, userId)).returning({ id: reviewQueue.id }));
  await weg("user_progress", () => db.delete(userProgress).where(eq(userProgress.userId, userId)).returning({ id: userProgress.userId }));
  await weg("study_path_progress", () => db.delete(studyPathProgress).where(eq(studyPathProgress.userId, userId)).returning({ id: studyPathProgress.id }));
  await weg("writing_submissions", () => db.delete(writingSubmissions).where(eq(writingSubmissions.userId, userId)).returning({ id: writingSubmissions.id }));
  await weg("game_saves", () => db.delete(gameSaves).where(eq(gameSaves.userId, userId)).returning({ id: gameSaves.id }));
  await weg("assignment_sessions", () => db.delete(assignmentSessions).where(eq(assignmentSessions.userId, userId)).returning({ id: assignmentSessions.id }));
  await weg("ops_link_uses", () => db.delete(v2OpsLinkUses).where(eq(v2OpsLinkUses.userId, userId)).returning({ id: v2OpsLinkUses.nonceHash }));

  // The year-end snapshot carries a nickname AND a real name — the single most
  // personal row in the schema, and the easiest one to forget.
  await weg("rollover_snapshots", () => db.delete(rolloverSnapshots).where(eq(rolloverSnapshots.v1UserId, userId)).returning({ id: rolloverSnapshots.id }));

  // Teacher-side rows about this account.
  await weg("teacher_events", () => db.delete(v2TeacherEvents).where(or(eq(v2TeacherEvents.teacherId, userId), eq(v2TeacherEvents.actorId, userId))!).returning({ id: v2TeacherEvents.id }));
  await weg("teacher_reset_tokens", () => db.delete(v2TeacherResetTokens).where(eq(v2TeacherResetTokens.teacherId, userId)).returning({ id: v2TeacherResetTokens.tokenHash }));

  // The person last: if anything above throws, the identity row is still there
  // and konto's retry finds the same person rather than an orphaned trail.
  const identitaet = await db.delete(v2IdentityUsers).where(eq(v2IdentityUsers.id, userId)).returning({ id: v2IdentityUsers.id });
  zeilen["users"] = identitaet.length;

  const gefunden = Object.values(zeilen).some((n) => n > 0);
  return { gefunden, zeilen };
}
