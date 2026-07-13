import { describe, expect, it } from "vitest";
import { firstLetterMask, firstLetterMaskText, MASK_BLANK } from "./mask.ts";

describe("firstLetterMask — bold first letter per word, FIXED blanks (doc 21 §6)", () => {
  it("masks a single word", () => {
    expect(firstLetterMask("tell")).toEqual([{ first: "t", blank: MASK_BLANK }]);
  });

  it("masks every word of a multi-word answer", () => {
    expect(firstLetterMask("working hours")).toEqual([
      { first: "w", blank: MASK_BLANK },
      { first: "h", blank: MASK_BLANK },
    ]);
  });

  it("blank length is FIXED — a long word and a short word mask identically (no length leak)", () => {
    const short = firstLetterMask("go")[0]!;
    const long = firstLetterMask("extraordinarily")[0]!;
    expect(short.blank).toBe(long.blank);
    expect(short.blank.length).toBe(MASK_BLANK.length);
  });

  it("survives extra whitespace and empty input", () => {
    expect(firstLetterMask("  look   after  ").map((s) => s.first)).toEqual(["l", "a"]);
    expect(firstLetterMask("")).toEqual([]);
    expect(firstLetterMask("   ")).toEqual([]);
  });

  it("keeps apostrophe words as one word", () => {
    expect(firstLetterMask("don't worry").map((s) => s.first)).toEqual(["d", "w"]);
  });
});

describe("firstLetterMaskText", () => {
  it("renders the plain-text preview form", () => {
    expect(firstLetterMaskText("working hours")).toBe(`w${MASK_BLANK} h${MASK_BLANK}`);
    expect(firstLetterMaskText("tell")).toBe(`t${MASK_BLANK}`);
  });
});
