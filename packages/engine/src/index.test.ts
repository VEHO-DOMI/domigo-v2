import { describe, expect, it } from "vitest";
import { XP_WEIGHT, breaksCombo, xpForTier } from "./index.ts";

describe("4-tier XP contract (07_task_formats.md)", () => {
  it("weights tiers full / half / half / none", () => {
    expect(XP_WEIGHT).toEqual({ correct: 1, partial: 0.5, close: 0.5, wrong: 0 });
  });

  it("awards rounded XP per tier", () => {
    expect(xpForTier(10, "correct")).toBe(10);
    expect(xpForTier(10, "partial")).toBe(5);
    expect(xpForTier(7, "close")).toBe(4); // v1 rounds half-up
    expect(xpForTier(10, "wrong")).toBe(0);
    expect(xpForTier(0, "correct")).toBe(0);
  });

  it("close and wrong break combos; correct and partial keep them", () => {
    expect(breaksCombo("close")).toBe(true);
    expect(breaksCombo("wrong")).toBe(true);
    expect(breaksCombo("correct")).toBe(false);
    expect(breaksCombo("partial")).toBe(false);
  });
});
