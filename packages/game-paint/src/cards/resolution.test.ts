// PK-R6 · C · THE RESOLUTION BEAT, asserted (doc 44 §3.1.7).
//
// doc 42 §1's second mine is „the headless presentation-brain pattern —
// decisions unit-tested outside the DOM". These are those decisions: what comes
// home, how it travels, and how long each beat runs. The ORDER itself lives in
// CardHost; what is checkable without a DOM is checked here.
import { describe, expect, it } from "vitest";
import type { GameTaskV2 } from "@domigo/content-schema";
import { COLOUR_FLOOD_TICKS } from "../anim.ts";
import { TICK_MS } from "../paint.ts";
import {
  LETTER_FLY_MS, LETTER_LEAD_MS, LETTER_MAX_CHARS, LETTER_STAGGER_MS, RESTORE_HOLD_MS,
  WORD_GLIDE_DELAY_MS, WORD_GLIDE_MS, answerTextOf, flightMs, letterFlyMs, lettersFor,
} from "./resolution.ts";

const base = {
  id: "t1",
  use: "encounter" as const,
  stimulus: { type: "entity" as const, showsDe: "Ein Ding steht da" },
  storyDe: "Sag, was es ist!",
  skins: ["thing"],
};

describe("how the answer comes home (v0 lettersFor, ported verbatim)", () => {
  it("short answers fly letter by letter on the mined 55 ms stagger", () => {
    expect(LETTER_STAGGER_MS).toBe(55);
    expect(LETTER_LEAD_MS).toBe(120);
    expect(LETTER_FLY_MS).toBe(460);
    const l = lettersFor("a pencil");
    expect(l.kind).toBe("letters");
    expect(l.kind === "letters" && l.chars.length).toBe(8);
  });

  it("long answers glide back whole — 30 staggered spans read as noise", () => {
    expect(LETTER_MAX_CHARS).toBe(14);
    const long = "Open the window please";
    expect(long.length).toBeGreaterThan(LETTER_MAX_CHARS);
    expect(lettersFor(long).kind).toBe("whole");
    // …and the boundary is inclusive, exactly as the mined function draws it
    expect(lettersFor("x".repeat(14)).kind).toBe("letters");
    expect(lettersFor("x".repeat(15)).kind).toBe("whole");
  });

  it("the beat lasts until the LAST letter has landed, never less", () => {
    expect(letterFlyMs(1)).toBe(LETTER_LEAD_MS + LETTER_FLY_MS);
    expect(letterFlyMs(8)).toBe(LETTER_LEAD_MS + 7 * LETTER_STAGGER_MS + LETTER_FLY_MS);
    expect(flightMs("a pencil")).toBe(letterFlyMs(8));
    expect(flightMs("Open the window please")).toBe(WORD_GLIDE_DELAY_MS + WORD_GLIDE_MS);
    // nothing to fly home ⇒ no beat at all, rather than an empty pause
    expect(flightMs("")).toBe(0);
  });
});

describe("the restore-hold (doc 42 §3)", () => {
  it("is DERIVED from the colour flood it waits for, not typed", () => {
    // a hold shorter than the flood celebrates over a still-grey being; a hold
    // longer than it is dead air. Either way the number belongs to the sim.
    expect(RESTORE_HOLD_MS).toBe(Math.round(COLOUR_FLOOD_TICKS * TICK_MS));
    expect(RESTORE_HOLD_MS).toBeGreaterThan(0);
  });
});

describe("what comes home, per kind", () => {
  const t = (extra: Record<string, unknown>): GameTaskV2 => ({ ...base, ...extra } as GameTaskV2);

  it("is the child's own answer on the answer-kinds", () => {
    expect(answerTextOf(t({ kind: "choice", options: ["a pencil", "a pen", "a ruler"], answer: "a pencil" }))).toBe("a pencil");
    expect(answerTextOf(t({ kind: "typed", answer: "a book", accept: [] }))).toBe("a book");
    expect(answerTextOf(t({ kind: "wheel", variant: "digit-to-word", shown: "3", values: ["two", "three"], answer: "three" }))).toBe("three");
  });

  it("is the COLOUR on a restore card — the word and the world's flood are one beat", () => {
    const card = t({
      kind: "restore", nameOptions: ["a desk", "a chair", "a door", "a book"], name: "a desk",
      colourAskDe: "Welche Farbe hatte ich?", colourOptions: ["brown", "blue", "red"], colour: "brown",
    });
    expect(answerTextOf(card)).toBe("brown");
  });

  it("is the REPAIRED sentence on a mistake card", () => {
    const card = t({
      kind: "mistake", use: "boss", sentence: ["I", "am", "a", "table"], errorIndex: 3,
      fix: { mode: "replace", correction: "board" }, evidence: ["I am a table"],
    });
    expect(answerTextOf(card)).toBe("I am a board");
  });

  it("is nothing at all on a memory board — and a beat with nothing to show is skipped", () => {
    const card = t({
      kind: "memory", use: "boss",
      pairs: [{ a: "1", b: "one" }, { a: "2", b: "two" }, { a: "3", b: "three" }],
      evidence: ["1 2 3"],
    });
    expect(answerTextOf(card)).toBe("");
    expect(flightMs(answerTextOf(card))).toBe(0);
  });
});
