import { describe, expect, it } from "vitest";
import type { GrammarItem, TieredAnswer, VocabItem } from "@domigo/content-schema";
import { canonical, gradeGrammar, gradeVocab } from "./grade.ts";

const full = (text: string): TieredAnswer => ({ text, tier: "full" });
const part = (text: string): TieredAnswer => ({ text, tier: "partial" });

// Minimal grammar item — the grader only reads format/answers/pairs/groups.
function gi(over: Partial<GrammarItem>): GrammarItem {
  return {
    format: "gap-fill",
    answers: [],
    pairs: [],
    groups: [],
    distractors: [],
    ...over,
  } as GrammarItem;
}

describe("canonical", () => {
  it("lowercases, strips punctuation, collapses spaces, keeps umlauts", () => {
    expect(canonical("  Don't,  GO! ")).toBe("dont go");
    expect(canonical("Ört")).toBe("ört");
  });
});

describe("text formats (gap-fill / transformation / …)", () => {
  const item = gi({ format: "gap-fill", answers: [full("unhappy"), part("not happy")] });
  it("exact full → correct (case/punctuation-insensitive)", () => {
    expect(gradeGrammar(item, { kind: "text", value: "Unhappy." }).tier).toBe("correct");
  });
  it("exact partial-tier → partial", () => {
    expect(gradeGrammar(item, { kind: "text", value: "not happy" }).tier).toBe("partial");
  });
  it("one typo within budget → close", () => {
    expect(gradeGrammar(item, { kind: "text", value: "unhapy" }).tier).toBe("close");
  });
  it("unrelated → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "banana" }).tier).toBe("wrong");
  });
  it("empty → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "   " }).tier).toBe("wrong");
  });
  it("partial-match fallback: enough shared words → partial", () => {
    const sent = gi({ format: "transformation", answers: [full("She is going to school")] });
    expect(gradeGrammar(sent, { kind: "text", value: "she going school" }).tier).toBe("partial");
  });
});

describe("multi-blank (pipe-joined)", () => {
  const item = gi({ format: "gap-fill", answers: [full("did | go")] });
  it("both blanks exact → correct", () => {
    expect(gradeGrammar(item, { kind: "text", value: "did | go" }).tier).toBe("correct");
  });
  it("one blank wrong → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "did | run" }).tier).toBe("wrong");
  });
  it("blank-count mismatch → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "did" }).tier).toBe("wrong");
  });
});

describe("multiple-choice / context-picker (exact-only)", () => {
  const item = gi({ format: "multiple-choice", answers: [full("unhappy")], distractors: ["inhappy"] });
  it("exact selection → correct", () => {
    expect(gradeGrammar(item, { kind: "choice", value: "unhappy" }).tier).toBe("correct");
  });
  it("near-miss does NOT get close credit → wrong", () => {
    expect(gradeGrammar(item, { kind: "choice", value: "unhapy" }).tier).toBe("wrong");
  });
  it("wrong input kind → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "unhappy" }).tier).toBe("wrong");
  });
});

describe("sentence-building (exact + close, NO partial)", () => {
  const item = gi({ format: "sentence-building", answers: [full("This exercise is impossible."), part("impossible")] });
  it("exact order → correct", () => {
    expect(gradeGrammar(item, { kind: "text", value: "This exercise is impossible." }).tier).toBe("correct");
  });
  it("partial-tier match does NOT yield partial → wrong", () => {
    expect(gradeGrammar(item, { kind: "text", value: "impossible" }).tier).toBe("wrong");
  });
});

describe("matching / matching-pairs (all-or-nothing)", () => {
  const item = gi({ format: "matching", pairs: [{ left: "happy", right: "unhappy" }, { left: "legal", right: "illegal" }] });
  it("all pairs right → correct", () => {
    expect(gradeGrammar(item, { kind: "matching", value: { happy: "unhappy", legal: "illegal" } }).tier).toBe("correct");
  });
  it("one pair wrong → wrong", () => {
    expect(gradeGrammar(item, { kind: "matching", value: { happy: "illegal", legal: "unhappy" } }).tier).toBe("wrong");
  });
});

describe("group-sort (all-or-nothing)", () => {
  const item = gi({
    format: "group-sort",
    groups: [
      { label: "-ful", members: ["careful", "helpful"] },
      { label: "-less", members: ["hopeless"] },
    ],
  });
  it("every member in its group → correct", () => {
    const ok = { careful: "-ful", helpful: "-ful", hopeless: "-less" };
    expect(gradeGrammar(item, { kind: "groupSort", value: ok }).tier).toBe("correct");
  });
  it("one misplaced → wrong", () => {
    const bad = { careful: "-ful", helpful: "-less", hopeless: "-less" };
    expect(gradeGrammar(item, { kind: "groupSort", value: bad }).tier).toBe("wrong");
  });
});

describe("anagram (exact + close)", () => {
  const item = gi({ format: "anagram", answers: [full("school")] });
  it("exact → correct; one typo → close", () => {
    expect(gradeGrammar(item, { kind: "text", value: "school" }).tier).toBe("correct");
    expect(gradeGrammar(item, { kind: "text", value: "schol" }).tier).toBe("close");
  });
});

describe("gradeVocab (carrier fill vs sAnswers, vocab ratio)", () => {
  const item = { sAnswers: [full("address"), part("e-mail address")] } as VocabItem;
  it("exact → correct; typo → close; partial-tier → partial; junk → wrong", () => {
    expect(gradeVocab(item, "address").tier).toBe("correct");
    expect(gradeVocab(item, "adress").tier).toBe("close");
    expect(gradeVocab(item, "e-mail address").tier).toBe("partial");
    expect(gradeVocab(item, "zzz").tier).toBe("wrong");
  });
});
