/**
 * M-2 · The assignment DRAFT — the shape the teacher builder edits and the save
 * endpoint validates, plus a pure `validateAssignmentDraft`. DB-free so it
 * unit-tests without Neon and runs identically on the client (live weight/error
 * feedback in the builder) and the server (the authoritative gate at save).
 *
 * The draft is NOT the DB row: it is the pre-persist editable form. On save the
 * endpoint splits it into an `assignments` row + N `assignment_sections` rows.
 */
import { AHS_DEFAULT_NOTENSCHLUESSEL, isValidNotenschluessel, sectionWeightsValid, type NotenSchluessel } from "./assignments.ts";

export type AssignmentMode = "practice" | "mock_test";

/** The five authored section kinds (mirrors the test.json / TestSession model). */
export type SectionKind = "vocab" | "grammar" | "listening" | "reading" | "writing";

/** Kinds that carry a picked list of graded items (vs. listening/reading/writing
 *  which reference an authored task/passage/prompt). M-2's builder ships these
 *  two; the reference kinds are wired in M-2b. */
export const ITEM_SECTION_KINDS: SectionKind[] = ["vocab", "grammar"];

export interface DraftSection {
  position: number;
  kind: SectionKind;
  /** picked graded-item ids (vocab/grammar); empty for reference kinds */
  itemIds: string[];
  listeningTaskId?: string | null;
  writingPromptId?: string | null;
  timerMinutes?: number | null;
  /** 0..100; sums to 100 across a mock test's sections */
  weightPct: number;
}

export interface AssignmentDraft {
  title: string;
  descriptionDe?: string | null;
  mode: AssignmentMode;
  classId: string;
  startsAt?: string | null;
  dueAt?: string | null;
  sessionDurationMinutes?: number | null;
  attemptsPerTest: number;
  /** null ⇒ the AHS default; a custom schedule must be well-formed */
  notenSchluessel?: NotenSchluessel | null;
  sections: DraftSection[];
}

export interface ValidateOpts {
  /** item ids currently reserved for the class (must not be assignable). */
  reservedIds?: ReadonlySet<string>;
}

/**
 * The authoritative publish gate. Returns a list of human-readable errors (empty
 * ⇒ the draft is publishable). Practice mode ignores weights; mock mode requires
 * weights summing to 100 with each section weighted. Shared verbatim by the
 * builder (live feedback) and the endpoint (never trust the client).
 */
export function validateAssignmentDraft(draft: AssignmentDraft, opts: ValidateOpts = {}): string[] {
  const errors: string[] = [];
  const reserved = opts.reservedIds ?? new Set<string>();

  if (draft.title.trim() === "") errors.push("Give the assignment a title.");
  if (draft.classId.trim() === "") errors.push("Choose a class.");
  if (!Number.isInteger(draft.attemptsPerTest) || draft.attemptsPerTest < 1 || draft.attemptsPerTest > 3) {
    errors.push("Attempts per test must be between 1 and 3.");
  }
  if (draft.sections.length === 0) errors.push("Add at least one section.");

  // positions must be the contiguous run 0..n-1 (the builder keeps them so; the
  // endpoint re-checks in case a client reorders badly).
  const positions = [...draft.sections].map((s) => s.position).sort((a, b) => a - b);
  const contiguous = positions.every((p, i) => p === i);
  if (!contiguous) errors.push("Section positions are not contiguous.");

  const seenItems = new Set<string>();
  for (const [i, sec] of draft.sections.entries()) {
    const where = `Section ${i + 1}`;
    if (sec.weightPct < 0 || sec.weightPct > 100) errors.push(`${where}: weight must be 0–100%.`);

    if (sec.kind === "vocab" || sec.kind === "grammar") {
      if (sec.itemIds.length === 0) errors.push(`${where}: pick at least one item.`);
      for (const id of sec.itemIds) {
        if (reserved.has(id)) errors.push(`${where}: “${id}” is reserved and can’t be assigned.`);
        if (seenItems.has(id)) errors.push(`${where}: “${id}” is used more than once.`);
        seenItems.add(id);
      }
    } else if (sec.kind === "listening") {
      if (!sec.listeningTaskId) errors.push(`${where}: choose a listening task.`);
    } else if (sec.kind === "reading") {
      if (sec.itemIds.length === 0) errors.push(`${where}: the reading section has no questions.`);
    } else if (sec.kind === "writing") {
      if (!sec.writingPromptId) errors.push(`${where}: choose a writing prompt.`);
    }
  }

  if (draft.mode === "mock_test") {
    if (!sectionWeightsValid(draft.sections.map((s) => s.weightPct))) {
      errors.push("Mock-test section weights must add up to exactly 100%.");
    }
    if (draft.sections.some((s) => s.weightPct === 0)) {
      errors.push("Every mock-test section needs a weight above 0%.");
    }
    if (draft.notenSchluessel != null && !isValidNotenschluessel(draft.notenSchluessel)) {
      errors.push("The Notenschlüssel must descend strictly from Note 1 to Note 4 (0–100%).");
    }
  }

  return errors;
}

/** The schedule that will actually grade this draft (custom or AHS default). */
export function effectiveNotenschluessel(draft: AssignmentDraft): NotenSchluessel {
  return draft.notenSchluessel ?? AHS_DEFAULT_NOTENSCHLUESSEL;
}
