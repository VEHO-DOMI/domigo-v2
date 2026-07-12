import { describe, expect, it } from "vitest";
import type { TieredAnswer, VocabItem } from "@domigo/content-schema";
import type { VocabPool } from "@domigo/engine";
import { gradeVocab, vocabAnswers } from "@domigo/engine";
import { rotateVocabPool, VOCAB_POOLS, vocabPrompt } from "./vocab-pool.ts";

const full = (text: string): TieredAnswer => ({ text, tier: "full" });

// A carrier definition that deliberately does NOT contain the headword (the schema's
// V-8 guarantees this for real items) — so the definition-mode leak test is meaningful.
const item = {
  id: "g2u05.w.apple",
  difficulty: 2,
  w: "apple",
  g: "der Apfel",
  d: "a round fruit that grows on trees",
  s: "I eat an ___ every morning.",
  sAnswers: [full("apple")],
  dAnswers: [full("apple"), full("an apple")],
  translation: { deToEn: [full("apple")], enToDe: [full("Apfel"), full("der Apfel")] },
} as VocabItem;

describe("vocabPrompt — leak-safe per-pool presentation", () => {
  it("carrier shows the ___ sentence, the definition as context, and the scaffolds", () => {
    const p = vocabPrompt(item, "carrier");
    expect(p.text).toBe(item.s);
    expect(p.context).toBe(item.d);
    expect(p.instruction).toBe("");
    expect(p.scaffold).toBe(true);
  });

  it("definition asks for the word and NEVER shows the headword (or any scaffold that could leak it)", () => {
    const p = vocabPrompt(item, "definition");
    expect(p.text).toBe(item.d);
    expect(p.context).toBeNull(); // no carrier sentence — it would contain the word
    expect(p.scaffold).toBe(false); // no gloss / German hint
    expect(`${p.instruction} ${p.text}`.toLowerCase()).not.toContain(item.w.toLowerCase());
  });

  it("deToEn shows the German word (answer is English — opposite language, cannot leak)", () => {
    const p = vocabPrompt(item, "deToEn");
    expect(p.text).toBe(item.g);
    expect(p.scaffold).toBe(false);
  });

  it("enToDe shows the English word (answer is German — opposite language, cannot leak)", () => {
    const p = vocabPrompt(item, "enToDe");
    expect(p.text).toBe(item.w);
    expect(p.scaffold).toBe(false);
  });
});

describe("every pool's first authored full answer grades correct (key-solvability per pool)", () => {
  for (const pool of VOCAB_POOLS) {
    it(`${pool}: the authored first full answer grades correct through the real engine`, () => {
      const first = vocabAnswers(item, pool).find((a) => a.tier === "full");
      expect(first).toBeDefined();
      expect(gradeVocab(item, first!.text, pool).tier).toBe("correct");
    });
  }
});

describe("rotateVocabPool — deterministic, valid, distributed", () => {
  it("is a pure function of (itemId, day)", () => {
    expect(rotateVocabPool("g2u05.w.apple", "2026-07-12")).toBe(rotateVocabPool("g2u05.w.apple", "2026-07-12"));
  });

  it("always returns one of the four pools", () => {
    for (let n = 0; n < 200; n++) {
      expect(VOCAB_POOLS).toContain(rotateVocabPool(`g2u05.w.item${n}`, "2026-07-12"));
    }
  });

  it("reaches all four pools across a realistic item set (no dead pool)", () => {
    const seen = new Set<VocabPool>();
    for (let n = 0; n < 200; n++) seen.add(rotateVocabPool(`g2u05.w.item${n}`, "2026-07-12"));
    expect(seen.size).toBe(4);
  });

  it("varies day-to-day for a fixed item (it rotates, never freezes on one pool)", () => {
    const seen = new Set<VocabPool>();
    for (let d = 1; d <= 28; d++) seen.add(rotateVocabPool("g2u05.w.apple", `2026-07-${String(d).padStart(2, "0")}`));
    expect(seen.size).toBeGreaterThan(1);
  });
});
