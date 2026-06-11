/**
 * Shared test fixtures — plain objects fed to zod; intentionally untyped so
 * red-case tests can mutate any field without TS friction.
 */
import { FORMAT_CODES } from "../index.ts";
import type { GrammarFormat } from "../index.ts";

export function prov(over: Record<string, unknown> = {}) {
  return {
    by: "fable",
    sbRef: null,
    seedV1: null,
    narrative: null,
    note: null,
    ...over,
  };
}

export function pres(over: Record<string, unknown> = {}) {
  return { variants: [], gameMeta: null, audio: null, ...over };
}

export function core(over: Record<string, unknown> = {}) {
  return {
    rev: 1,
    difficulty: 1,
    presentation: pres(),
    provenance: prov(),
    ...over,
  };
}

export function variant(over: Record<string, unknown> = {}) {
  return {
    key: "watson.ch01",
    prompt: { text: "Nora says: we ___ open the door.", lang: "en" },
    glosses: [],
    audio: null,
    provenance: prov(),
    ...over,
  };
}

export function gameMeta(over: Record<string, unknown> = {}) {
  return {
    distractorPool: ["ghost", "monster", "spider", "zombie"],
    chipBudget: 8,
    minOptions: 4,
    ...over,
  };
}

// ---------------------------------------------------------------------------
// Vocab
// ---------------------------------------------------------------------------

export function vocabItem(over: Record<string, unknown> = {}) {
  return {
    id: "g2u03.w.witch",
    ...core(),
    w: "witch",
    g: "Hexe",
    d: "A woman in stories who can do magic",
    s: "The ___ flew across the sky on her broom.",
    sSource: "invented",
    sAnswers: [{ text: "witch", tier: "full" }],
    dAnswers: [{ text: "witch", tier: "full" }],
    translation: {
      deToEn: [{ text: "witch", tier: "full" }],
      enToDe: [
        { text: "Hexe", tier: "full" },
        { text: "die Hexe", tier: "partial" },
      ],
    },
    gloss: [],
    mc: ["ghost", "monster", "spider"],
    hintDe: "Sie fliegt auf einem Besen.",
    ...over,
  };
}

export function vocabFile(items: unknown[], over: Record<string, unknown> = {}) {
  return {
    schema: "vocab@1",
    grade: 2,
    unit: 3,
    slug: "g2-u03",
    items,
    ...over,
  };
}

// ---------------------------------------------------------------------------
// Grammar
// ---------------------------------------------------------------------------

const PER_FORMAT: Record<GrammarFormat, Record<string, unknown>> = {
  "gap-fill": {
    prompt: { text: "We ___ go home – it's late.", lang: "en", blanks: 1 },
    answers: [{ text: "should", tier: "full" }],
  },
  "multiple-choice": {
    prompt: { text: "You ___ eat so many sweets.", lang: "en", blanks: 1 },
    answers: [{ text: "shouldn't", tier: "full" }],
    distractors: ["should", "can", "must"],
  },
  "context-picker": {
    prompt: { text: "It's late.", lang: "en", blanks: 0 },
    answers: [{ text: "We should go home.", tier: "full" }],
    distractors: [
      "We should going home.",
      "We shoulds go home.",
      "We should goes home.",
    ],
  },
  translation: {
    prompt: { text: "Wir sollten nach Hause gehen.", lang: "de", blanks: 0 },
    answers: [{ text: "We should go home.", tier: "full" }],
    direction: "deToEn",
  },
  "error-correction": {
    prompt: { text: "We should to go home.", lang: "en", blanks: 0 },
    answers: [{ text: "We should go home.", tier: "full" }],
  },
  transformation: {
    prompt: { text: "Go home. (should)", lang: "en", blanks: 0 },
    answers: [{ text: "You should go home.", tier: "full" }],
  },
  "question-formation": {
    prompt: { text: "I / should / what / do", lang: "en", blanks: 0 },
    answers: [{ text: "What should I do?", tier: "full" }],
  },
  "free-form": {
    prompt: {
      text: "Your friend is tired. What do you say?",
      lang: "en",
      blanks: 0,
    },
    answers: [
      { text: "You should go to bed.", tier: "full" },
      { text: "You should sleep.", tier: "partial" },
    ],
  },
  "sentence-building": {
    prompt: { text: "home / should / we / go", lang: "en", blanks: 0 },
    answers: [{ text: "We should go home", tier: "full" }],
  },
  matching: {
    prompt: { text: "should / shouldn't", lang: "en", blanks: 0 },
    answers: [],
    pairs: [
      { left: "We should", right: "go home." },
      { left: "You shouldn't", right: "eat so many sweets." },
      { left: "Should I", right: "open the window?" },
    ],
  },
  anagram: {
    prompt: { text: "d-l-o-u-h-s", lang: "en", blanks: 0 },
    answers: [{ text: "should", tier: "full" }],
  },
  "group-sort": {
    prompt: { text: "should or shouldn't?", lang: "en", blanks: 0 },
    answers: [],
    groups: [
      {
        label: "should",
        members: ["go to bed early", "eat fruit"],
      },
      {
        label: "shouldn't",
        members: ["watch TV all night", "eat so many sweets"],
      },
    ],
  },
  "matching-pairs": {
    prompt: { text: "should / shouldn't", lang: "en", blanks: 0 },
    answers: [],
    pairs: [
      { left: "should", right: "sollten" },
      { left: "shouldn't", right: "sollten nicht" },
      { left: "go home", right: "nach Hause gehen" },
      { left: "it's late", right: "es ist spät" },
    ],
  },
};

export function grammarItem(
  format: GrammarFormat,
  over: Record<string, unknown> = {},
) {
  return {
    id: `g2u03.gi.should.${FORMAT_CODES[format]}.001`,
    structureId: "g2u03.s.should",
    format,
    ...core(),
    direction: null,
    distractors: [],
    pairs: [],
    groups: [],
    gloss: [],
    hintDe: "Denk an einen Ratschlag.",
    hintEn: null,
    explainDe: "Mit should sagst du, was eine gute Idee ist.",
    explainEn: null,
    strict: false,
    ...PER_FORMAT[format],
    ...over,
  };
}

export function grammarFile(
  items: unknown[],
  over: Record<string, unknown> = {},
) {
  return {
    schema: "grammar@1",
    grade: 2,
    unit: 3,
    slug: "g2-u03",
    items,
    ...over,
  };
}

// ---------------------------------------------------------------------------
// Structures
// ---------------------------------------------------------------------------

export function structure(over: Record<string, unknown> = {}) {
  return {
    id: "g2u03.s.should",
    key: "should",
    unit: 3,
    name: "should / shouldn't",
    nameDe: "should / shouldn't (Ratschläge)",
    category: "modals",
    description: "Giving advice with should and shouldn't.",
    rules: [
      {
        id: "should-advice",
        en: "Use should + base verb to say what is a good idea.",
        de: "Mit should + Grundform sagst du, was eine gute Idee ist.",
        examples: [
          { en: "We should go home.", de: "Wir sollten nach Hause gehen." },
        ],
      },
    ],
    commonErrors: [
      {
        description: "to after should",
        wrong: "We should to go.",
        correct: "We should go.",
      },
    ],
    recursIn: [],
    sbRefs: ["g2/sb/More 2 SB Unit 3.txt#grammar-1"],
    seedV1: ["m2-u3-should"],
    provenance: prov(),
    ...over,
  };
}

export function structuresFile(
  structures: unknown[],
  over: Record<string, unknown> = {},
) {
  return {
    schema: "grammar-structures@1",
    grade: 2,
    structures,
    v1Waivers: [],
    ...over,
  };
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

export function scene(over: Record<string, unknown> = {}) {
  return {
    id: "g2.st.watson.ch01.s001",
    speaker: "nora",
    textEn: "Look! The door is open.",
    scaffoldDe: "Schau! Die Tür ist offen.",
    glosses: [],
    audio: null,
    taskSlots: [],
    next: null,
    ...over,
  };
}

export function chapter(over: Record<string, unknown> = {}) {
  return {
    id: "g2.st.watson.ch01",
    unit: 1,
    titleEn: "The open door",
    titleDe: "Die offene Tür",
    scenes: [scene()],
    ...over,
  };
}

export function story(over: Record<string, unknown> = {}) {
  return {
    schema: "story@1",
    id: "g2.st.watson",
    grade: 2,
    title: { en: "Watson Manor", de: "Watson Manor" },
    chapters: [chapter()],
    ...over,
  };
}
