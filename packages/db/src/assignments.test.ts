import { describe, expect, it } from "vitest";
import {
  AHS_DEFAULT_NOTENSCHLUESSEL,
  combineSectionPercents,
  firstAttemptTiers,
  gradeMockTest,
  isValidNotenschluessel,
  noteForPercent,
  scoreSection,
  sectionWeightsValid,
  tierPoints,
  type NotenSchluessel,
  type ScorableAttempt,
} from "./assignments.ts";

describe("tierPoints — the K-5 policy", () => {
  it("scores correct=1, partial=close=0.5, wrong=0", () => {
    expect(tierPoints("correct")).toBe(1);
    expect(tierPoints("partial")).toBe(0.5);
    expect(tierPoints("close")).toBe(0.5);
    expect(tierPoints("wrong")).toBe(0);
  });
});

describe("firstAttemptTiers — a mock grade never rewards retrying", () => {
  const at = (s: number) => new Date(2026, 0, 1, 10, 0, s);

  it("keeps the earliest attempt's tier per item", () => {
    const attempts: ScorableAttempt[] = [
      { itemId: "a", tier: "wrong", createdAt: at(10) },
      { itemId: "a", tier: "correct", createdAt: at(20) }, // retry — must NOT count
      { itemId: "b", tier: "correct", createdAt: at(15) },
    ];
    const tiers = firstAttemptTiers(attempts);
    expect(tiers.get("a")).toBe("wrong");
    expect(tiers.get("b")).toBe("correct");
    expect(tiers.size).toBe(2);
  });

  it("is order-independent (earliest timestamp wins regardless of array order)", () => {
    const forward = firstAttemptTiers([
      { itemId: "a", tier: "correct", createdAt: at(5) },
      { itemId: "a", tier: "wrong", createdAt: at(9) },
    ]);
    const reversed = firstAttemptTiers([
      { itemId: "a", tier: "wrong", createdAt: at(9) },
      { itemId: "a", tier: "correct", createdAt: at(5) },
    ]);
    expect(forward.get("a")).toBe("correct");
    expect(reversed.get("a")).toBe("correct");
  });
});

describe("scoreSection", () => {
  it("computes the exact percent from tiers", () => {
    // 1 + 0.5 + 0.5 + 0 = 2 of 4 → 50%
    expect(scoreSection(["correct", "partial", "close", "wrong"]).pct).toBe(50);
  });

  it("counts unanswered items as 0 when itemCount exceeds the tiers given", () => {
    // 3 correct answered, but the section had 5 items → 3/5 = 60%
    expect(scoreSection(["correct", "correct", "correct"], 5).pct).toBe(60);
  });

  it("an empty section is 0%, never NaN", () => {
    expect(scoreSection([]).pct).toBe(0);
    expect(scoreSection([], 0).pct).toBe(0);
  });
});

describe("combineSectionPercents — weighted overall", () => {
  it("weights sections by weightPct", () => {
    // 100% @ 70 + 50% @ 30 = (70 + 15)/100 = 85
    expect(combineSectionPercents([
      { weightPct: 70, pct: 100 },
      { weightPct: 30, pct: 50 },
    ])).toBe(85);
  });

  it("divides by the actual weight sum (robust to non-100 totals)", () => {
    expect(combineSectionPercents([
      { weightPct: 1, pct: 100 },
      { weightPct: 1, pct: 0 },
    ])).toBe(50);
  });

  it("returns 0 for zero total weight", () => {
    expect(combineSectionPercents([{ weightPct: 0, pct: 100 }])).toBe(0);
    expect(combineSectionPercents([])).toBe(0);
  });
});

describe("noteForPercent — AHS boundaries are INCLUSIVE minimums", () => {
  it("lands each Note exactly on its cutoff", () => {
    expect(noteForPercent(90)).toBe(1);
    expect(noteForPercent(80)).toBe(2);
    expect(noteForPercent(65)).toBe(3);
    expect(noteForPercent(50)).toBe(4);
  });

  it("drops a Note just below each cutoff", () => {
    expect(noteForPercent(89.999)).toBe(2);
    expect(noteForPercent(79.999)).toBe(3);
    expect(noteForPercent(64.999)).toBe(4);
    expect(noteForPercent(49.999)).toBe(5);
  });

  it("caps at 1 and floors at 5", () => {
    expect(noteForPercent(100)).toBe(1);
    expect(noteForPercent(0)).toBe(5);
  });

  it("honors a custom Notenschlüssel", () => {
    const strict: NotenSchluessel = { 1: 92, 2: 82, 3: 70, 4: 55 };
    expect(noteForPercent(91, strict)).toBe(2);
    expect(noteForPercent(92, strict)).toBe(1);
    expect(noteForPercent(54.9, strict)).toBe(5);
  });
});

describe("the rounding trap — the Note comes from the EXACT percent", () => {
  it("89.6% is Note 2, not Note 1 (a display round to 90 must not steal a grade)", () => {
    // 43 of 48 points → 89.5833…% — rounds to 89.58 for display, but the Note
    // must be decided on the exact value.
    const pct = (43 / 48) * 100;
    const grade = gradeMockTest([{ weightPct: 100, pct }]);
    expect(grade.note).toBe(2);
    expect(grade.displayPct).toBe(89.58);
    // guard: computing the Note from the rounded display value would be wrong
    expect(noteForPercent(Math.round(pct))).toBe(1); // <- the bug we avoid
    expect(noteForPercent(pct)).toBe(2); // <- what we actually do
  });
});

describe("gradeMockTest — end to end", () => {
  it("composes sections into an exact percent + a display percent + a Note", () => {
    const grade = gradeMockTest([
      { weightPct: 40, pct: 100 }, // vocab, perfect
      { weightPct: 40, pct: 75 }, // grammar
      { weightPct: 20, pct: 50 }, // reading
    ]);
    // 40 + 30 + 10 = 80 → Note 2
    expect(grade.pct).toBe(80);
    expect(grade.displayPct).toBe(80);
    expect(grade.note).toBe(2);
  });

  it("a real section-tier pipeline: tiers → section % → weighted Note", () => {
    const vocab = scoreSection(["correct", "correct", "correct", "correct", "wrong"]); // 80%
    const grammar = scoreSection(["correct", "partial", "wrong"]); // (1+0.5)/3 = 50%
    const grade = gradeMockTest([
      { weightPct: 60, pct: vocab.pct },
      { weightPct: 40, pct: grammar.pct },
    ]);
    // 0.6*80 + 0.4*50 = 48 + 20 = 68 → Note 3
    expect(grade.pct).toBeCloseTo(68, 10);
    expect(grade.note).toBe(3);
  });
});

describe("validation guards", () => {
  it("isValidNotenschluessel requires a strictly descending [0,100] schedule", () => {
    expect(isValidNotenschluessel(AHS_DEFAULT_NOTENSCHLUESSEL)).toBe(true);
    expect(isValidNotenschluessel({ 1: 80, 2: 90, 3: 65, 4: 50 })).toBe(false); // not descending
    expect(isValidNotenschluessel({ 1: 90, 2: 90, 3: 65, 4: 50 })).toBe(false); // not strict
    expect(isValidNotenschluessel({ 1: 110, 2: 80, 3: 65, 4: 50 })).toBe(false); // out of range
  });

  it("sectionWeightsValid requires an exact sum of 100", () => {
    expect(sectionWeightsValid([40, 40, 20])).toBe(true);
    expect(sectionWeightsValid([40, 40, 21])).toBe(false);
    expect(sectionWeightsValid([50, 50])).toBe(true);
    expect(sectionWeightsValid([])).toBe(false);
  });
});
