// R5-W2 · J1-D — the law that makes a trap a TRAP.
//
// „Nicht: I'am — richtig: I'm." A wrong form struck through beats three right
// ones when the mistake is about PLACEMENT. But only if the wrong form really is
// the right one mis-set: a trap built from a different sentence teaches a child
// to distrust a word instead of to place an apostrophe.
import { describe, expect, it } from "vitest";
import { sameFormMisplaced } from "../level.ts";

describe("R5-W2 · J1-D · sameFormMisplaced", () => {
  it("accepts a word-order slip — the same words, laid down wrong", () => {
    expect(sameFormMisplaced("How you are?", "How are you?")).toBe(true);
    expect(sameFormMisplaced("three-twenty", "twenty-three")).toBe(true);
  });

  it("counts punctuation as no part of a word (the case that caught the law)", () => {
    // the first real content this law ever saw was rejected because the question
    // mark rode on a different word: »are?« vs »you?«. The law was right and the
    // tokenizer was wrong, which is the good way round.
    expect(sameFormMisplaced("How you are", "How are you")).toBe(true);
    expect(sameFormMisplaced("How you are?", "How are you?")).toBe(true);
  });

  it("accepts a small in-word slip — the apostrophe in the wrong place", () => {
    expect(sameFormMisplaced("I'am", "I'm")).toBe(true);
    expect(sameFormMisplaced("its", "it's")).toBe(true);
    expect(sameFormMisplaced("isnt", "isn't")).toBe(true);
  });

  it("REJECTS a different sentence, which is the whole point", () => {
    expect(sameFormMisplaced("Good morning.", "How are you?")).toBe(false);
    expect(sameFormMisplaced("I am tired", "I'm fine")).toBe(false);
    expect(sameFormMisplaced("She is nice", "I'm")).toBe(false);
  });

  it("rejects a form that only ADDS words rather than misplacing them", () => {
    // „How are you today?" is not „How are you?" mis-set — it is a longer line,
    // and a child correcting it would learn to delete a word they did nothing
    // wrong by writing
    expect(sameFormMisplaced("How are you today?", "How are you?")).toBe(false);
  });
});
