/**
 * S-2 · pure constructors that turn the create-form's teacher-facing fields
 * into a FULL, schema-valid item. The teacher supplies the semantic content;
 * everything structural (gradedCore, presentation, provenance, answer-set
 * shapes) is defaulted here. The server still runs the whole thing through
 * validateFullItem + the blind-solve gate — this is just the shaping. No
 * secrets, no IO → client-safe (imported by the create form).
 */
export type Difficulty = 1 | 2 | 3;

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
