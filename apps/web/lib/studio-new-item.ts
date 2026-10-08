/**
 * S-2 · pure constructors that turn the create-form's teacher-facing fields
 * into a FULL, schema-valid item. The teacher supplies the semantic content;
 * everything structural (gradedCore, presentation, provenance, answer-set
 * shapes) is defaulted here. The server still runs the whole thing through
 * validateFullItem + the blind-solve gate — this is just the shaping. No
 * secrets, no IO → client-safe (imported by the create form).
 */
import { countBlanks, nextGrammarItemId, type GrammarItem, type TieredAnswer } from "@domigo/content-schema";

export type Difficulty = 1 | 2 | 3;

export const STUDIO_GRAMMAR_FORMATS = ["multiple-choice", "gap-fill", "context-picker"] as const;
export type StudioGrammarFormat = (typeof STUDIO_GRAMMAR_FORMATS)[number];
export interface StudioUnitOptions {
  slug: string;
  structures: Array<{ id: string; nameDe: string }>;
  occupiedIds: string[];
}

export interface NewGrammarInput {
  unitSlug: string;
  structureId: string;
  format: StudioGrammarFormat;
  occupiedIds: readonly string[];
  prompt: string;
  lang: "de" | "en";
  answers: TieredAnswer[];
  distractors: string[];
  hintDe: string;
  explainDe: string;
  difficulty: Difficulty;
}

/** Shape only: all semantic answers remain authored by the teacher. The same
 * server pre-gate and blind solve used by vocabulary decides publishability. */
export function buildGrammarItem(input: NewGrammarInput): { id: string; item: GrammarItem } {
  if (!input.structureId.startsWith(`${idStem(input.unitSlug)}.s.`)) {
    throw new Error("Die Grammatik-Struktur gehört nicht zur gewählten Einheit.");
  }
  const id = nextGrammarItemId(input.structureId, input.format, input.occupiedIds);
  const prompt = input.prompt.trim();
  return { id, item: {
    id, structureId: input.structureId, format: input.format,
    rev: 1, difficulty: input.difficulty,
    presentation: { variants: [], gameMeta: null, audio: null },
    provenance: { by: "studio", sbRef: null, seedV1: null, narrative: null, note: "In Studio erstellt." },
    prompt: { text: prompt, lang: input.lang, blanks: countBlanks(prompt) },
    answers: input.answers.map((answer) => ({ text: answer.text.trim(), tier: answer.tier })),
    direction: null,
    distractors: input.format === "gap-fill" ? [] : input.distractors.map((text) => text.trim()).filter(Boolean),
    pairs: [], groups: [], gloss: [],
    hintDe: input.hintDe.trim(), hintEn: null,
    explainDe: input.explainDe.trim(), explainEn: null,
    strict: false,
  } };
}

export interface StudioCreateRequest {
  draftId?: string;
  kind: "vocab" | "grammar";
  unitSlug: string;
  id: string;
  item: unknown;
}
export interface StudioCreateResult {
  draftId?: string;
  ok?: boolean;
  status?: string;
  runId?: string;
  error?: string;
  errors?: string[];
}

/** Both authoring kinds use one ordered pipeline; failed pre-gate/save never
 * reaches the paid sandbox publish step. The server repeats every check. */
export async function submitStudioItem<T extends StudioCreateResult>(
  item: StudioCreateRequest,
  publish: boolean,
  post: (body: Record<string, unknown>) => Promise<T>,
): Promise<T> {
  const checked = await post({ action: "pregate", kind: item.kind, item: item.item });
  if (!checked.ok) return checked;
  const saved = await post({ action: "save", itemId: item.id, unitSlug: item.unitSlug, kind: item.kind, draftAction: "create", item: item.item, ...(item.draftId ? { draftId: item.draftId } : {}) });
  if (!saved.ok || !publish) return saved;
  try {
    return { ...await post({ action: "publish", itemId: item.id }), draftId: saved.draftId };
  } catch {
    return { ...saved, ok: false, error: "publish_unconfirmed", errors: ["Der Entwurf ist gespeichert. Öffne ihn im Studio und setze die Prüfung fort; der Prüfstatus konnte nicht bestätigt werden."] };
  }
}

/** "g2-u03" → "g2u03" (the id stem); "" if malformed. */
export function idStem(unitSlug: string): string {
  const m = /^(g[1-4])-u(\d{2})$/.exec(unitSlug);
  return m ? `${m[1]}u${m[2]}` : "";
}

export interface NewVocabInput {
  unitSlug: string;
  /** kebab id suffix, e.g. "apple-bobbing" → id g2u03.w.apple-bobbing */
  slug: string;
  w: string; // English headword
  g: string; // German
  d: string; // English definition (must NOT contain the headword — V-8)
  s: string; // carrier with exactly one ___
  sAnswer: string; // the correct fill for the blank
  distractors: string[]; // ≥4 wrong options (mc uses 3; the game pool uses all)
  hintDe: string; // German hint (du-form)
  difficulty: Difficulty;
  gloss: Array<{ word: string; de: string }>; // above-level words in d/s
}

const full = (text: string) => [{ text: text.trim(), tier: "full" as const }];

export function buildVocabItem(input: NewVocabInput): { id: string; item: unknown } {
  const id = `${idStem(input.unitSlug)}.w.${input.slug.trim()}`;
  const distractors = input.distractors.map((s) => s.trim()).filter(Boolean);
  const item = {
    id,
    rev: 1,
    difficulty: input.difficulty,
    presentation: {
      variants: [],
      // mc = exactly 3; the game distractor pool needs ≥4 — reuse all distractors.
      gameMeta: { distractorPool: distractors, chipBudget: null, minOptions: 4 },
      audio: null,
    },
    provenance: { by: "studio", sbRef: null, seedV1: null, narrative: null, note: "In Studio erstellt." },
    w: input.w.trim(),
    g: input.g.trim(),
    d: input.d.trim(),
    s: input.s.trim(),
    sSource: "invented",
    sAnswers: full(input.sAnswer),
    dAnswers: full(input.w),
    translation: { deToEn: full(input.w), enToDe: full(input.g) },
    gloss: input.gloss.map((x) => ({ word: x.word.trim(), de: x.de.trim(), scope: "d" })),
    mc: distractors.slice(0, 3),
    hintDe: input.hintDe.trim(),
  };
  return { id, item };
}
