/** Typed item factories for validator tests (g2-u03 vocabulary: Halloween). */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";

export function prov(over: Partial<VocabItem["provenance"]> = {}): VocabItem["provenance"] {
  return { by: "fable", sbRef: null, seedV1: null, narrative: null, note: null, ...over };
}

export function pres(over: Partial<VocabItem["presentation"]> = {}): VocabItem["presentation"] {
  return {
    variants: [],
    gameMeta: { distractorPool: ["ghost", "monster", "spider", "zombie"], chipBudget: null, minOptions: 4 },
    audio: null,
    ...over,
  };
}

export function vocabItem(over: Partial<VocabItem> = {}): VocabItem {
  return {
    id: "g2u03.w.witch",
    rev: 1,
    difficulty: 1,
    presentation: pres(),
    provenance: prov(),
    w: "witch",
    g: "Hexe",
    d: "A woman in stories who can do magic",
    s: "The ___ has a black cat and a big hat.",
    sSource: "invented",
    sAnswers: [{ text: "witch", tier: "full" }],
    dAnswers: [{ text: "witch", tier: "full" }],
    translation: {
      deToEn: [{ text: "witch", tier: "full" }],
      enToDe: [{ text: "Hexe", tier: "full" }],
    },
    gloss: [],
    mc: ["ghost", "monster", "spider"],
    hintDe: "Sie fliegt auf einem Besen.",
    ...over,
  };
}

export function grammarItem(over: Partial<GrammarItem> = {}): GrammarItem {
  return {
    id: "g2u03.gi.should.gf.001",
    structureId: "g2u03.s.should",
    format: "gap-fill",
    rev: 1,
    difficulty: 1,
    presentation: { variants: [], gameMeta: null, audio: null },
    provenance: prov(),
    prompt: { text: "We ___ go home now.", lang: "en", blanks: 1 },
    answers: [{ text: "should", tier: "full" }],
    direction: null,
    distractors: [],
    pairs: [],
    groups: [],
    gloss: [],
    hintDe: "Denk an einen Ratschlag.",
    hintEn: null,
    explainDe: "Mit should sagst du, was eine gute Idee ist.",
    explainEn: null,
    strict: true,
    ...over,
  };
}
