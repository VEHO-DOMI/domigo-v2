/**
 * M-3 · The student test-taking core — PURE and DB-free (unit-tests without
 * Neon, like the M-1/M-2 spines). Three responsibilities, all server-
 * authoritative so a timed mock test cannot be cheated and its Note is exact:
 *   1. session lifecycle  — when a sitting is live / expired / submitted
 *   2. the timing wall    — whether an attempt may be recorded RIGHT NOW
 *   3. scoring            — raw attempts → per-section % → weighted → Note
 *
 * The runner UI and the /api endpoints are thin shells over these functions;
 * the correctness proof lives in assignment-session.test.ts.
 */
import {
  combineSectionPercents,
  firstAttemptTiers,
  noteForPercent,
  scoreSection,
  AHS_DEFAULT_NOTENSCHLUESSEL,
  type NotenSchluessel,
  type Note,
  type ScorableAttempt,
} from "./assignments.ts";
import type { AssignmentMode, SectionKind } from "./assignment-draft.ts";

// ── session lifecycle ────────────────────────────────────────────────────────

/** When a fresh sitting expires: startedAt + duration, or null (untimed). */
export function sessionExpiry(startedAt: Date, sessionDurationMinutes: number | null): Date | null {
  if (sessionDurationMinutes == null) return null;
  return new Date(startedAt.getTime() + sessionDurationMinutes * 60_000);
}

export interface SessionState {
  expiresAt: Date | null;
  submittedAt: Date | null;
}

/** A sitting is live iff it is unsubmitted and (untimed OR before its wall). */
export function isSessionLive(s: SessionState, now: Date): boolean {
  if (s.submittedAt !== null) return false;
  return s.expiresAt === null || now.getTime() < s.expiresAt.getTime();
}

// ── the timing wall ──────────────────────────────────────────────────────────

/** The full item set an assignment can grade (server re-resolves the loaders;
 *  here we only collect the authored ids to gate attempts against). */
export function assignmentItemIds(sections: ReadonlyArray<{ itemIds: readonly string[] }>): Set<string> {
  const out = new Set<string>();
  for (const s of sections) for (const id of s.itemIds) out.add(id);
  return out;
}

export type WallReason = "no_session" | "submitted" | "expired" | "not_in_assignment";

/**
 * The server timing wall: may THIS attempt be recorded against an assignment
 * right now? An assignment attempt requires a live session AND the item to
 * belong to the assignment — so a spoofed client can neither record after time
 * is up nor smuggle in an off-test item.
 */
export function canRecordAssignAttempt(args: {
  session: SessionState | null;
  allowedItemIds: ReadonlySet<string>;
  itemId: string;
  now: Date;
}): { ok: true } | { ok: false; reason: WallReason } {
  const { session, allowedItemIds, itemId, now } = args;
  if (session === null) return { ok: false, reason: "no_session" };
  if (session.submittedAt !== null) return { ok: false, reason: "submitted" };
  if (session.expiresAt !== null && now.getTime() >= session.expiresAt.getTime()) return { ok: false, reason: "expired" };
  if (!allowedItemIds.has(itemId)) return { ok: false, reason: "not_in_assignment" };
  return { ok: true };
}

// ── scoring a submitted sitting ──────────────────────────────────────────────

export interface SectionSpec {
  position: number;
  kind: SectionKind;
  /** the section's authored item ids (its denominator — blanks score 0) */
  itemIds: string[];
  weightPct: number;
}

export interface SectionResult {
  position: number;
  kind: SectionKind;
  pct: number;
  itemCount: number;
}

export interface SubmittedScore {
  perSection: SectionResult[];
  /** exact overall percent (weighted for a mock, unweighted mean for practice) */
  overallPct: number;
  /** overallPct rounded to 2 dp for storage/display — never fed back into the Note */
  displayPct: number;
  note: Note;
}

/**
 * Grade a submitted sitting from its raw attempts. First-attempt-per-item only
 * (no retry credit), each section scored against its FULL item count (an
 * unanswered item is 0), then:
 *   mock_test → weighted by section weightPct, Note from the exact percent;
 *   practice  → an unweighted mean over every item (informational Note).
 */
export function scoreSubmittedSession(args: {
  mode: AssignmentMode;
  sections: SectionSpec[];
  attempts: ScorableAttempt[];
  notenSchluessel?: NotenSchluessel | null;
}): SubmittedScore {
  const { mode, sections, attempts } = args;
  const ns = args.notenSchluessel ?? AHS_DEFAULT_NOTENSCHLUESSEL;
  const tierOf = firstAttemptTiers(attempts);

  const perSection: SectionResult[] = sections.map((sec) => {
    const tiers = sec.itemIds.map((id) => tierOf.get(id)).filter((t): t is NonNullable<typeof t> => t !== undefined);
    const s = scoreSection(tiers, sec.itemIds.length);
    return { position: sec.position, kind: sec.kind, pct: s.pct, itemCount: s.itemCount };
  });

  let overallPct: number;
  if (mode === "mock_test") {
    overallPct = combineSectionPercents(sections.map((s) => ({ weightPct: s.weightPct, pct: perSection.find((r) => r.position === s.position)!.pct })));
  } else {
    // practice: a plain mean over all items (weights ignored). Points = Σ section
    // points; total = Σ section item counts.
    const totalItems = sections.reduce((n, s) => n + s.itemIds.length, 0);
    const points = perSection.reduce((p, r) => p + (r.pct / 100) * r.itemCount, 0);
    overallPct = totalItems > 0 ? (points / totalItems) * 100 : 0;
  }

  return {
    perSection,
    overallPct,
    displayPct: Math.round(overallPct * 100) / 100,
    note: noteForPercent(overallPct, ns),
  };
}
