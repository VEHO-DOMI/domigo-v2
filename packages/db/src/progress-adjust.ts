/**
 * K1b · THE GRANDMASTER'S HANDS — progress adjusted by hand.
 *
 * Koki's ruling P-R5 replaced the (struck) Firebase import with a manual path:
 * the platform operator credits a child the XP it earned in the old system and
 * marks the study-path units it had already worked through, so a returning class
 * does not start the school year at zero. Nothing here is a teacher feature — both
 * functions are reachable ONLY behind a server-side `isGrandmaster` check
 * (apps/web/lib/grandmaster.ts, an env allowlist no write path can reach).
 *
 * THREE PROPERTIES, each by construction rather than by care:
 *
 *   1. XP IS NEVER SUBTRACTED (Law 3). There is no minus path in this file: the
 *      inputs are validated as non-negative integers and the write is `xp + n`.
 *      A "correction downwards" is therefore not a thing this module can do, which
 *      is the point — a hand that can take points away is a hand that can lose a
 *      child's work.
 *   2. THE JOURNAL NAMES THE HAND. Every call appends a `roster_events` row FIRST
 *      (journal-then-apply, the house pattern — Neon HTTP has no multi-statement
 *      transactions), carrying `actorId` = the grandmaster. A crash between the two
 *      leaves a harmless orphan journal row, never an unhistoried change.
 *   3. THE JOURNAL CARRIES NO NAMES. Payloads are ids and numbers only. The
 *      journal lives in the database, but frugality with person data is a law here,
 *      not a preference.
 *
 * NOT touched, deliberately: the Leitner review queue. Setting review boxes without
 * real attempts behind them would corrupt the spacing logic that decides when a
 * child sees a card again (Koki's decision, P-R5). A hand-granted unit is "you have
 * been here", never "you have proven this".
 */
import { sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { userProgress, v2RosterEvents } from "./schema.ts";
import { recordNodeCompletion } from "./studypath.ts";
import type { NodeKind } from "./studypath.ts";

/** The `roster_events.kind` this module writes. Named once so a typo is one place. */
export const PROGRESS_ADJUST_KIND = "progress_adjust";

/** Stars a HAND-marked graded node receives. See markUnitDone for the argument. */
export const HAND_MARK_STARS = 1;

/** A unit slug as every corpus surface spells it: g<year>-u<NN>. */
const UNIT_SLUG = /^g([1-4])-u\d{2}$/;

export interface GrantXpInput {
  studentId: string;
  /** The student's class — resolved SERVER-SIDE by the caller, never client-claimed. */
  classId: string;
  vocabXp: number;
  grammarXp: number;
  /** The grandmaster: whose hand pulled the lever (goes into the journal only). */
  actorId: string;
}

/**
 * Credit a child XP in the two v2 pools. Vocabulary XP and grammar XP are separate
 * pools (schema.ts: `xp` / `grammar_xp`) and stay separate here — folding them into
 * one number would make a child look busy on a path it never walked.
 *
 * The upsert mirrors persist.ts:88-110 with ONE deliberate difference: it does NOT
 * touch `streak` / `lastSessionDate`. The streak means "showed up today"; a grant
 * from the operator is not a child showing up, and inventing a streak day would put
 * a lie into the one number a child actually looks at.
 *
 * Throws on a non-integer, a negative value, or a total of zero — a no-op write
 * that still journals would fill the history with events that changed nothing.
 */
export async function grantXp(db: Db, input: GrantXpInput): Promise<void> {
  const { studentId, classId, vocabXp, grammarXp, actorId } = input;
  for (const [name, n] of [["vocabXp", vocabXp], ["grammarXp", grammarXp]] as const) {
    if (!Number.isInteger(n)) throw new Error(`grantXp: ${name} must be a whole number.`);
    if (n < 0) throw new Error(`grantXp: ${name} must not be negative (XP is never subtracted).`);
  }
  if (vocabXp + grammarXp <= 0) throw new Error("grantXp: grant at least one point.");

  const now = new Date();
  // journal-then-apply: the intent lands FIRST, naming the hand …
  await db.insert(v2RosterEvents).values({
    classId,
    kind: PROGRESS_ADJUST_KIND,
    actorId,
    payload: { op: "xp", studentId, vocabXp, grammarXp },
  });
  // … then the pools. `+ n` on conflict — there is no path here that writes a
  // smaller number than it found.
  await db
    .insert(userProgress)
    .values({ userId: studentId, xp: vocabXp, grammarXp, updatedAt: now })
    .onConflictDoUpdate({
      target: userProgress.userId,
      set: {
        xp: sql`${userProgress.xp} + ${vocabXp}`,
        grammarXp: sql`${userProgress.grammarXp} + ${grammarXp}`,
        updatedAt: now,
      },
    });
}

/** One node of the unit's graph, as `buildUnitNodes` emits it (id + kind + graded). */
export interface AdjustableNode {
  id: string;
  kind: NodeKind;
  graded: boolean;
}

export interface MarkUnitDoneInput {
  studentId: string;
  classId: string;
  unitSlug: string;
  /**
   * The unit's node graph. Passed IN rather than derived here: @domigo/db has no
   * dependency on the content loader (its deps are content-schema + engine), so the
   * caller builds the graph with `loadUnit` + `buildUnitNodes` — exactly what
   * apps/web/app/api/study-path/route.ts already does on the ordinary write path.
   * One definition of "the nodes of this unit", shared by hand and by child.
   */
  nodes: readonly AdjustableNode[];
  actorId: string;
}

/**
 * Mark every node of one unit as completed for one child.
 *
 * Built on the EXISTING primitive `recordNodeCompletion` (studypath.ts): idempotent
 * and monotonic via `GREATEST`, so running this twice changes nothing and a hand
 * mark can never lower a star a child actually earned.
 *
 * STARS — the one place this file makes a judgement call. A graded node gets ONE
 * star: a hand-unlock may assert existence ("this child has been through this
 * unit"), never performance (two or three stars mean accuracy the platform measured).
 * An UNGRADED node — the vocabulary/grammar intro cards — gets ZERO, because that is
 * exactly what a real child gets there (route.ts: `node.graded ? starsFor(…) : 0`).
 * ⚠ The frozen brief says "stars = 1" without splitting the two; giving an intro
 * card a star no child can earn would print a fabricated performance mark on the
 * learn page, which is the very thing the brief's own reasoning forbids. Declared,
 * not silent.
 *
 * Throws on a malformed slug or an empty node list — both mean the caller resolved
 * nothing, and journaling an empty intent would be history about nothing.
 */
export async function markUnitDone(db: Db, input: MarkUnitDoneInput): Promise<{ nodesMarked: number }> {
  const { studentId, classId, unitSlug, nodes, actorId } = input;
  const m = UNIT_SLUG.exec(unitSlug);
  if (!m) throw new Error("markUnitDone: unitSlug must look like g2-u03.");
  if (nodes.length === 0) throw new Error("markUnitDone: that unit has no nodes to mark.");
  const grade = Number(m[1]);

  // journal-then-apply: the intent (ids + numbers, no names) lands FIRST …
  await db.insert(v2RosterEvents).values({
    classId,
    kind: PROGRESS_ADJUST_KIND,
    actorId,
    payload: { op: "unit", studentId, unitSlug, nodeIds: nodes.map((n) => n.id), stars: HAND_MARK_STARS },
  });
  // … then the nodes, through the ordinary completion primitive.
  for (const node of nodes) {
    await recordNodeCompletion(db, {
      userId: studentId,
      classId,
      unitSlug,
      grade,
      nodeId: node.id,
      kind: node.kind,
      stars: node.graded ? HAND_MARK_STARS : 0,
    });
  }
  return { nodesMarked: nodes.length };
}
