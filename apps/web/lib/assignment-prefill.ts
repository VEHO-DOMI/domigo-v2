/** cgo-066: read-only handoff into the existing composer. Never trust URL labels. */
import { listApprovedUnits, loadReleasedChapters, loadStory, storyIdForGrade } from "@domigo/content-loader";
import type { AssignmentDraft } from "@domigo/db";
import { catalogForGrade } from "./assignment-catalog.ts";

export type AssignmentSource = { source: "unit" | "story"; grade: number; unit: string; chapter?: string };
export interface AssignmentPrefill {
  source: AssignmentSource;
  title: string;
  returnHref: string;
  sections: Array<{ kind: "vocab" | "grammar"; itemIds: string[]; weightPct: number }>;
}

/** Duplicate, unknown and inconsistent query fields fail closed, including mode/class. */
export function resolveAssignmentPrefill(query: Record<string, unknown>): AssignmentPrefill | null {
  if (Object.keys(query).some((k) => !["source", "grade", "unit", "chapter"].includes(k))) return null;
  const { source, grade: rawGrade, unit: rawUnit, chapter } = query;
  if (source !== "unit" && source !== "story") return null;
  const grade = typeof rawGrade === "number" ? rawGrade : typeof rawGrade === "string" && /^[1-4]$/.test(rawGrade) ? Number(rawGrade) : 0;
  if (![1, 2, 3, 4].includes(grade)) return null;
  let unit: string;
  let chapterLabel: string;
  let returnHref: string;
  if (source === "story") {
    if (typeof chapter !== "string" || !/^ch\d{2}$/.test(chapter)) return null;
    const storyId = storyIdForGrade(grade);
    if (!storyId) return null;
    const found = loadStory(storyId)?.chapters.find((c) => c.id === `${storyId}.${chapter}` && loadReleasedChapters(storyId).includes(c.id));
    if (!found) return null;
    unit = `g${grade}-u${String(found.unit).padStart(2, "0")}`;
    if (rawUnit !== undefined && rawUnit !== unit) return null;
    chapterLabel = String(Number(chapter.slice(2)));
    returnHref = `/play/${grade}/${chapter}`;
  } else {
    if (typeof rawUnit !== "string" || !new RegExp(`^g${grade}-u\\d{2}$`).test(rawUnit) || chapter !== undefined) return null;
    unit = rawUnit;
    chapterLabel = String(Number(unit.slice(-2)));
    returnHref = `/practice/${unit}`;
  }
  if (!listApprovedUnits().includes(unit)) return null;
  const catalog = catalogForGrade(grade).find((u) => u.unitSlug === unit);
  if (!catalog) return null;
  const sections = (["vocab", "grammar"] as const)
    .map((kind) => ({ kind, itemIds: catalog[kind].map((item) => item.id), weightPct: 0 }))
    .filter((s) => s.itemIds.length > 0);
  if (!sections.length) return null;
  return {
    source: { source, grade, unit, ...(typeof chapter === "string" ? { chapter } : {}) },
    title: `Chapter ${chapterLabel} · Wortschatz und Grammatik`, returnHref, sections,
  };
}

/**
 * The runner only resolves approved unit vocabulary/grammar; refuse other modalities
 * for every draft, including drafts without a preview source.
 * Hör-/Schreibabschnitte: erst wenn der Builder sie erzeugt, den Index erweitern.
 */
export function assignmentContentErrors(draft: AssignmentDraft, grade: number): string[] {
  const index = new Map(catalogForGrade(grade).flatMap((u) => [
    ...u.vocab.map((v) => [v.id, "vocab"] as const),
    ...u.grammar.map((g) => [g.id, "grammar"] as const),
  ]));
  return draft.sections.some((s) =>
    (s.kind !== "vocab" && s.kind !== "grammar") || s.listeningTaskId || s.writingPromptId ||
    s.itemIds.some((id) => index.get(id) !== s.kind),
  ) ? ["Nur freigegebener Wortschatz und Grammatik aus dem Jahrgang der Klasse können zugewiesen werden."] : [];
}
