/**
 * K6a · WHAT THE CHILDREN WROTE — the reader `writing_submissions` never had, and
 * the teacher's mark on it.
 *
 * THE HOLE THIS FILLS. Since B2 (July) children have typed real short texts into the
 * mock tests. The table has had exactly ONE writer (persist.ts) and ZERO readers —
 * repo-wide, measured. Every one of those texts has been captured and never seen. For
 * a teacher that is her children's work, lost.
 *
 * AUTHORIZATION IS THE WHERE CLAUSE, NOT A CHECK. `gradeSubmission` does not ask
 * "may she?" and then act; the UPDATE simply cannot reach a row whose class does not
 * belong to the acting teacher, because ownership is part of the statement. A foreign
 * teacher therefore matches ZERO ROWS — the same shape `consumeResetToken` uses, and
 * the reason a mistake here fails closed instead of failing open. The pre-read that
 * resolves the class is a COURTESY (it lets the journal name the class before the
 * write); the authority is always the guarded UPDATE.
 *
 * JOURNAL-THEN-APPLY, and the payload is frugal by construction. A `roster_events`
 * row (kind `writing_graded`) lands FIRST, naming the class and the HAND — then the
 * mark. Neon's HTTP driver has no multi-statement transactions, so a crash between
 * the two leaves a harmless orphan history row and never an unhistoried change (the
 * house pattern, cf. progress-adjust.ts).
 *
 * ⚠ THE PAYLOAD NEVER CARRIES THE CHILD'S TEXT, AND NEVER A NAME. A child's writing
 * is person-near data of the most sensitive kind this platform holds: it is what the
 * child chose to say. It lives in exactly one column, is read by exactly one surface,
 * and is copied nowhere — not into the journal, not into a log line, not into an
 * error message. `textLength` is everything the history needs to be a history.
 *
 * ⚠ THE CHILD SEES NOTHING OF THIS. No mark, no comment, no "your teacher read it"
 * reaches any student surface — deliberately, pending the D-6 privacy gate and a
 * design of its own. This file is a teacher surface end to end.
 *
 * ⚠ EDGE-SAFE. This module imports no `node:crypto` and nothing that does, so it is
 * safe to re-export through `index.ts` — which reaches the Edge middleware chain via
 * auth.ts. K2a paid full price for the opposite (see the note in index.ts).
 *
 * DEGRADATION IS DELIBERATE AND NARROW. Migration 0018 is applied to production BY
 * HAND after the merge, so there is always a window where this code is deployed and
 * the four grading columns are not. In that window the page must still SHOW the
 * children's texts — it simply cannot mark them, and it says so. Anything other than
 * a missing column or table is a real outage and is re-thrown.
 */
import { and, desc, eq, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2Classes, v2RosterEvents, writingSubmissions } from "./schema.ts";
import { isMissingDbObject } from "./teacher-events.ts";

/** The `roster_events.kind` this module writes. Named once so a typo is one place. */
export const WRITING_GRADED_KIND = "writing_graded";

/** Score bounds. Inclusive on both ends; app-validated (see schema.ts for why not a CHECK). */
export const MIN_SCORE = 0;
export const MAX_SCORE = 100;

/** Longest teacher comment we store. Generous for a paragraph, bounded against a paste. */
export const MAX_FEEDBACK_LENGTH = 2000;

/**
 * One submission, as the teacher's page needs it.
 *
 * `userId` is an ID, not a person: this projection reads `writing_submissions` and
 * NOTHING else — no join to either user register — so no display name, PIN hash or
 * legacy person column can travel through this file. The page pairs the ids with
 * `listStudentsForClass`, which is the one place that resolves names.
 */
export interface WritingSubmissionRow {
  id: string;
  userId: string;
  unitSlug: string;
  testId: string;
  promptId: string;
  /** The child's own words. The one place they are read. */
  text: string;
  wordCount: number;
  submittedAt: Date;
  /** null on every row until a teacher marks it — "unread", never "zero". */
  score: number | null;
  feedback: string | null;
  gradedAt: Date | null;
  /** Whose hand set the mark (teacher uuid), null while unmarked. */
  gradedBy: string | null;
}

export interface ClassSubmissions {
  /**
   * False = migration 0018 has not reached this database yet. The texts are readable,
   * the marking is not, and the surface says exactly that. This is a STATE, not a
   * fault — telling the two apart is the whole reason the flag exists.
   */
  gradingAvailable: boolean;
  rows: WritingSubmissionRow[];
}

/** The columns that exist in every deployment, 0018 or not. */
const BASE_COLUMNS = {
  id: writingSubmissions.id,
  userId: writingSubmissions.userId,
  unitSlug: writingSubmissions.unitSlug,
  testId: writingSubmissions.testId,
  promptId: writingSubmissions.promptId,
  text: writingSubmissions.text,
  wordCount: writingSubmissions.wordCount,
  submittedAt: writingSubmissions.submittedAt,
} as const;

/** …plus the four 0018 adds. */
const GRADED_COLUMNS = {
  ...BASE_COLUMNS,
  score: writingSubmissions.score,
  feedback: writingSubmissions.feedback,
  gradedAt: writingSubmissions.gradedAt,
  gradedBy: writingSubmissions.gradedBy,
} as const;

/**
 * Every submission of ONE class, newest first.
 *
 * CLASS-SCOPED BY CONSTRUCTION. The WHERE clause is the only scope there is; the
 * caller has already established that this class belongs to (or is adopted by) the
 * acting teacher, exactly as the K1a readers are called. The index this rides —
 * `writing_submissions_class_unit_idx` on (class_id, unit_slug) — has been in place
 * and unused since migration 0003.
 *
 * Newest first because a teacher's question is "what came in?", not "what is oldest?".
 */
export async function listSubmissionsForClass(db: Db, classId: string): Promise<ClassSubmissions> {
  try {
    const rows = await db
      .select(GRADED_COLUMNS)
      .from(writingSubmissions)
      .where(eq(writingSubmissions.classId, classId))
      .orderBy(desc(writingSubmissions.submittedAt));
    return { gradingAvailable: true, rows: rows.map(normalise) };
  } catch (err) {
    // A missing COLUMN (42703) means 0018 is not here yet; a missing TABLE (42P01)
    // would mean 0003 is not, which cannot happen in any live deployment but costs
    // nothing to survive. Everything else is a genuine outage and belongs upstairs.
    if (!isMissingDbObject(err)) throw err;
    const rows = await db
      .select(BASE_COLUMNS)
      .from(writingSubmissions)
      .where(eq(writingSubmissions.classId, classId))
      .orderBy(desc(writingSubmissions.submittedAt));
    return { gradingAvailable: false, rows: rows.map(normalise) };
  }
}

/**
 * One row from either projection, brought to one shape. The four grading fields are
 * simply absent from the narrow read — absent and null mean the same thing to the
 * page ("not marked"), and collapsing them here keeps that decision in one place.
 */
function normalise(r: Record<string, unknown>): WritingSubmissionRow {
  return {
    id: String(r.id),
    userId: String(r.userId),
    unitSlug: String(r.unitSlug),
    testId: String(r.testId),
    promptId: String(r.promptId),
    text: String(r.text),
    wordCount: Number(r.wordCount),
    submittedAt: new Date(r.submittedAt as string | Date),
    score: r.score == null ? null : Number(r.score),
    feedback: r.feedback == null ? null : String(r.feedback),
    gradedAt: r.gradedAt == null ? null : new Date(r.gradedAt as string | Date),
    gradedBy: r.gradedBy == null ? null : String(r.gradedBy),
  };
}

export interface GradeSubmissionInput {
  submissionId: string;
  /** 0-100, whole points. */
  score: number;
  /** The teacher's words. Empty or blank is stored as null — "no comment", not "". */
  feedback: string | null;
  /**
   * WHOSE CLASSES may be reached. For an ordinary teacher this is herself; when the
   * grandmaster works in a colleague's class it is the OWNER's id, resolved
   * server-side (the adoption pattern the K1a page established).
   */
  teacherId: string;
  /** WHOSE HAND pulled the lever. Equal to teacherId on the ordinary path. */
  actorId: string;
}

export type GradeSubmissionResult =
  | { ok: true; classId: string }
  /**
   * Does not exist, or does not belong to this teacher — deliberately the SAME
   * answer. Distinguishing them would turn this route into an oracle that confirms
   * the existence of another teacher's submissions by id.
   */
  | { ok: false; reason: "not_found" }
  /** Migration 0018 has not reached this database yet. */
  | { ok: false; reason: "no_grading_columns" };

/**
 * Mark one submission.
 *
 * OVERWRITING IS ALLOWED AND IS THE POINT. A teacher who mis-clicks 87 for 78 must be
 * able to say so, and every version is journalled — the history is what makes the
 * correction safe, not a lock that makes it impossible.
 *
 * The bounds throw rather than return: the route validates the same numbers with zod
 * before this is ever called, so a value arriving out of range here is a programming
 * error, and a programming error that returns a tidy result object is a programming
 * error nobody finds (house shape, cf. grantXp).
 */
export async function gradeSubmission(db: Db, input: GradeSubmissionInput): Promise<GradeSubmissionResult> {
  const { submissionId, score, feedback, teacherId, actorId } = input;
  if (!Number.isInteger(score)) throw new Error("gradeSubmission: score must be a whole number.");
  if (score < MIN_SCORE || score > MAX_SCORE) {
    throw new Error(`gradeSubmission: score must be between ${MIN_SCORE} and ${MAX_SCORE}.`);
  }
  const kommentar = feedback == null || feedback.trim() === "" ? null : feedback.trim();
  if (kommentar !== null && kommentar.length > MAX_FEEDBACK_LENGTH) {
    throw new Error(`gradeSubmission: feedback must be at most ${MAX_FEEDBACK_LENGTH} characters.`);
  }

  // WHICH CLASS — resolved under the very same ownership condition the write will
  // apply, so a foreign submission is already gone here and no journal row is ever
  // written for a change that cannot happen. A courtesy, not the gate (see header).
  let gehoert: { classId: string }[];
  try {
    gehoert = await db
      .select({ classId: writingSubmissions.classId })
      .from(writingSubmissions)
      .where(and(eq(writingSubmissions.id, submissionId), gehoertZuLehrkraft(teacherId)))
      .limit(1);
  } catch (err) {
    if (isMissingDbObject(err)) return { ok: false, reason: "no_grading_columns" };
    throw err;
  }
  const treffer = gehoert[0];
  if (!treffer) return { ok: false, reason: "not_found" };

  // journal-then-apply: the intent lands FIRST, naming the class and the hand.
  // Ids, numbers and lengths only — the child's text and the teacher's words both
  // stay out (see the header; `textLength` is the history, the text is not).
  await db.insert(v2RosterEvents).values({
    classId: treffer.classId,
    kind: WRITING_GRADED_KIND,
    actorId,
    payload: {
      op: "grade",
      submissionId,
      score,
      feedbackLength: kommentar === null ? 0 : kommentar.length,
      onBehalfOf: actorId === teacherId ? null : teacherId,
    },
  });

  // … then the mark, behind the ownership condition a second time. The ROW COUNT is
  // the verdict: one winner, or nobody.
  try {
    const rows = await db
      .update(writingSubmissions)
      .set({ score, feedback: kommentar, gradedAt: new Date(), gradedBy: actorId })
      .where(and(eq(writingSubmissions.id, submissionId), gehoertZuLehrkraft(teacherId)))
      .returning({ classId: writingSubmissions.classId });
    const gewonnen = rows[0];
    return gewonnen ? { ok: true, classId: gewonnen.classId } : { ok: false, reason: "not_found" };
  } catch (err) {
    if (isMissingDbObject(err)) return { ok: false, reason: "no_grading_columns" };
    throw err;
  }
}

/**
 * "…and this submission's class belongs to that teacher."
 *
 * ONE definition, used by the resolving read AND by the write, so the two can never
 * drift apart — a guard that is stated twice in two ways is a guard with two chances
 * to be wrong. Written as a subquery rather than a join because it must sit inside an
 * UPDATE's WHERE clause, where a join is not available.
 */
function gehoertZuLehrkraft(teacherId: string) {
  return sql`${writingSubmissions.classId} in (select ${v2Classes.id} from ${v2Classes} where ${v2Classes.teacherId} = ${teacherId})`;
}
