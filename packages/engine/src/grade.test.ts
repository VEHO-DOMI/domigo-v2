import { describe, expect, it } from "vitest";
import type { GrammarItem, TieredAnswer, VocabItem } from "@domigo/content-schema";
import { canonical, canonicalEcho, gradeGrammar, gradeVocab } from "./grade.ts";

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

describe("canonicalEcho (case + apostrophes preserved — the echo-guard form)", () => {
  it("keeps case and apostrophes, normalizes typographic ones, strips other punctuation", () => {
    expect(canonicalEcho("The child loves it's book.")).toBe("The child loves it's book");
    expect(canonicalEcho("The child loves it\u2019s  book!")).toBe("The child loves it's book");
    expect(canonicalEcho("I have two Desks here.")).toBe("I have two Desks here");
  });
  it("distinguishes what canonical() collapses (apostrophe + case errors)", () => {
    expect(canonical("it's")).toBe(canonical("its")); // the collapse that hid the bug
    expect(canonicalEcho("it's")).not.toBe(canonicalEcho("its"));
    expect(canonical("two Desks")).toBe(canonical("two desks"));
    expect(canonicalEcho("two Desks")).not.toBe(canonicalEcho("two desks"));
  });
});

describe("strict items — exact-only against authored answers (662 corpus items carry the flag)", () => {
  const strictItem = gi({ format: "gap-fill", strict: true, answers: [full("went"), part("did go")] });
  const looseItem = gi({ format: "gap-fill", answers: [full("went"), part("did go")] });
  it("exact full still correct; authored partial still partial (strict disables fuzz, not intent)", () => {
    expect(gradeGrammar(strictItem, { kind: "text", value: "Went." }).tier).toBe("correct");
    expect(gradeGrammar(strictItem, { kind: "text", value: "did go" }).tier).toBe("partial");
  });
  it("a typo grades wrong under strict (close on the same non-strict item)", () => {
    expect(gradeGrammar(looseItem, { kind: "text", value: "wemt" }).tier).toBe("close");
    expect(gradeGrammar(strictItem, { kind: "text", value: "wemt" }).tier).toBe("wrong");
  });
  it("the word-overlap fallback is off under strict", () => {
    const strictSentence = gi({ format: "transformation", strict: true, prompt: { text: "She goes to school.", lang: "en", blanks: 0 }, answers: [full("She is going to school")] } as Partial<GrammarItem>);
    expect(gradeGrammar(strictSentence, { kind: "text", value: "she going school" }).tier).toBe("wrong");
  });
});

describe("E-3: no partial fallback on error-correction / question-formation", () => {
  it("a NEAR-echo of the error sentence grades wrong (one word changed — the echo guard alone missed this)", () => {
    const item = gi({ format: "error-correction", prompt: { text: "She play football every day.", lang: "en", blanks: 0 }, answers: [full("She plays football every day.")] } as Partial<GrammarItem>);
    // a word-shuffled retype of the error — full word overlap, far from the
    // answer by edit distance (so the close tier can't catch it either)
    expect(gradeGrammar(item, { kind: "text", value: "Football she play every day." }).tier).toBe("wrong");
  });
  it("question-formation: retyping the statement (near-echo) grades wrong", () => {
    const item = gi({ format: "question-formation", prompt: { text: "He plays football.", lang: "en", blanks: 0 }, answers: [full("Does he play football?")] } as Partial<GrammarItem>);
    expect(gradeGrammar(item, { kind: "text", value: "He play football" }).tier).toBe("wrong");
  });
  it("authored partial-TIER answers on error-correction still grade partial (only the fallback closed)", () => {
    const item = gi({ format: "error-correction", prompt: { text: "She play football.", lang: "en", blanks: 0 }, answers: [full("She plays football."), { text: "She does play football.", tier: "partial" } as TieredAnswer] } as Partial<GrammarItem>);
    expect(gradeGrammar(item, { kind: "text", value: "She does play football." }).tier).toBe("partial");
  });
  it("the fallback stays alive on translation and gap-fill (a genuinely half-right answer earns partial)", () => {
    const tr = gi({ format: "translation", direction: "deToEn", prompt: { text: "Ich spiele jeden Tag Fußball im Park.", lang: "de", blanks: 0 }, answers: [full("I play football in the park every day.")] } as Partial<GrammarItem>);
    expect(gradeGrammar(tr, { kind: "text", value: "I play football every day" }).tier).toBe("partial");
  });
});

describe("prompt-echo guard (translation / transformation / error-correction / question-formation)", () => {
  it("error-correction: retyping the apostrophe-error prompt grades wrong; the fix grades correct (g1u01 ec.004 shape)", () => {
    const item = gi({ format: "error-correction", prompt: { text: "The child loves it's book.", lang: "en", blanks: 0 }, answers: [full("The child loves its book.")] } as Partial<GrammarItem>);
    // Before the guard, the echo graded CORRECT (canonical strips the apostrophe).
    expect(gradeGrammar(item, { kind: "text", value: "The child loves it's book." }).tier).toBe("wrong");
    expect(gradeGrammar(item, { kind: "text", value: "The child loves it\u2019s book." }).tier).toBe("wrong");
    expect(gradeGrammar(item, { kind: "text", value: "The child loves its book." }).tier).toBe("correct");
  });
  it("error-correction: case-error items stay solvable while the echo grades wrong (g1u01 plurals ec.002 shape)", () => {
    const item = gi({ format: "error-correction", prompt: { text: "I have two Desks here.", lang: "en", blanks: 0 }, answers: [full("I have two desks here.")] } as Partial<GrammarItem>);
    expect(gradeGrammar(item, { kind: "text", value: "I have two Desks here." }).tier).toBe("wrong");
    expect(gradeGrammar(item, { kind: "text", value: "I have two desks here." }).tier).toBe("correct");
  });
  it("question-formation: retyping the statement no longer earns partial via the word-overlap fallback", () => {
    const item = gi({ format: "question-formation", prompt: { text: "She plays tennis.", lang: "en", blanks: 0 }, answers: [full("Does she play tennis?")] } as Partial<GrammarItem>);
    expect(gradeGrammar(item, { kind: "text", value: "She plays tennis." }).tier).toBe("wrong");
    expect(gradeGrammar(item, { kind: "text", value: "Does she play tennis?" }).tier).toBe("correct");
  });
  it("translation: copying the source sentence grades wrong", () => {
    const item = gi({ format: "translation", direction: "deToEn", prompt: { text: "Mein Bruder ist gross.", lang: "de", blanks: 0 }, answers: [full("My brother is tall.")] } as Partial<GrammarItem>);
    expect(gradeGrammar(item, { kind: "text", value: "Mein Bruder ist gross." }).tier).toBe("wrong");
    expect(gradeGrammar(item, { kind: "text", value: "My brother is tall." }).tier).toBe("correct");
  });
});

describe("gradeVocab pools (direction-aware answer selection)", () => {
  const item = {
    sAnswers: [full("apple")],
    dAnswers: [full("apple"), full("an apple")],
    translation: { deToEn: [full("apple")], enToDe: [full("Apfel"), full("der Apfel")] },
  } as VocabItem;
  it("defaults to the carrier pool (today's only live mode — behavior unchanged)", () => {
    expect(gradeVocab(item, "apple").tier).toBe("correct");
  });
  it("definition pool honors its own alternates", () => {
    expect(gradeVocab(item, "an apple", "definition").tier).toBe("correct");
  });
  it("enToDe accepts the authored article variant; deToEn does not accept German", () => {
    expect(gradeVocab(item, "der Apfel", "enToDe").tier).toBe("correct");
    expect(gradeVocab(item, "Apfel", "enToDe").tier).toBe("correct");
    expect(gradeVocab(item, "Apfel", "deToEn").tier).toBe("wrong");
  });
});
