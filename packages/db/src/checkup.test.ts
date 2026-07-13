import { describe, expect, it } from "vitest";
import type { ScorableAttempt } from "./assignments.ts";
import {
  CHECKUP_TOTAL,
  checkupSectionKind,
  checkupVocabPool,
  formatCheckupPoints,
  parseCheckupSectionConfig,
  parseDisplayConfig,
  scoreCheckup,
  translationPoolFor,
  validateCheckupSections,
  type CheckupDraftSection,
  type CheckupSectionConfig,
} from "./checkup.ts";

const at = (s: number) => new Date(2026, 8, 1, 10, 0, s);

describe("parseCheckupSectionConfig — tolerant jsonb reader", () => {
  it("round-trips a full config", () => {
    const cfg = parseCheckupSectionConfig({ checkupKind: "translations", points: 6, mask: null, direction: "mixed" });
    expect(cfg).toEqual({ checkupKind: "translations", points: 6, direction: "mixed" });
  });

  it("keeps the first-letter mask", () => {
    expect(parseCheckupSectionConfig({ checkupKind: "words-phrases", points: 8, mask: "first-letter" })).toEqual({
      checkupKind: "words-phrases",
      points: 8,
      mask: "first-letter",
    });
  });

  it("rejects malformed rows instead of throwing", () => {
    expect(parseCheckupSectionConfig(null)).toBeNull();
    expect(parseCheckupSectionConfig("words-phrases")).toBeNull();
    expect(parseCheckupSectionConfig({ checkupKind: "poetry", points: 5 })).toBeNull();
    expect(parseCheckupSectionConfig({ checkupKind: "grammar", points: 0 })).toBeNull();
    expect(parseCheckupSectionConfig({ checkupKind: "grammar", points: 2.5 })).toBeNull();
  });
});

describe("parseDisplayConfig", () => {
  it("accepts the three feedback modes", () => {
    expect(parseDisplayConfig({ feedback: "immediate" })).toEqual({ feedback: "immediate" });
    expect(parseDisplayConfig({ feedback: "on-submit", showScore: "on-submit" })).toEqual({
      feedback: "on-submit",
      showScore: "on-submit",
    });
    expect(parseDisplayConfig({ feedback: "on-release" })).toEqual({ feedback: "on-release" });
  });

  it("rejects unknown modes", () => {
    expect(parseDisplayConfig({ feedback: "whenever" })).toBeNull();
    expect(parseDisplayConfig(null)).toBeNull();
  });
});

describe("translationPoolFor — mixed gives De→En the odd one (doc 21 §3)", () => {
  it("splits 6 as 3 deToEn + 3 enToDe", () => {
    const pools = [0, 1, 2, 3, 4, 5].map((i) => translationPoolFor(i, 6, "mixed"));
    expect(pools).toEqual(["deToEn", "deToEn", "deToEn", "enToDe", "enToDe", "enToDe"]);
  });

  it("splits 5 as 3 deToEn + 2 enToDe (De→En gets the odd one)", () => {
    const pools = [0, 1, 2, 3, 4].map((i) => translationPoolFor(i, 5, "mixed"));
    expect(pools).toEqual(["deToEn", "deToEn", "deToEn", "enToDe", "enToDe"]);
  });

  it("single-direction sections stay single-direction", () => {
    expect(translationPoolFor(3, 4, "deToEn")).toBe("deToEn");
    expect(translationPoolFor(0, 4, "enToDe")).toBe("enToDe");
  });
});

describe("checkupVocabPool — section kind → engine pool", () => {
  it("words-phrases grades the carrier gap-fill", () => {
    expect(checkupVocabPool({ checkupKind: "words-phrases", points: 8 }, 0, 8)).toBe("carrier");
  });
  it("definitions grade the definition pool", () => {
    expect(checkupVocabPool({ checkupKind: "definitions", points: 4 }, 2, 4)).toBe("definition");
  });
  it("translations default to mixed", () => {
    const cfg: CheckupSectionConfig = { checkupKind: "translations", points: 4 };
    expect(checkupVocabPool(cfg, 0, 4)).toBe("deToEn");
    expect(checkupVocabPool(cfg, 3, 4)).toBe("enToDe");
  });
});

describe("checkupSectionKind", () => {
  it("maps only grammar to grammar sections", () => {
    expect(checkupSectionKind("grammar")).toBe("grammar");
    expect(checkupSectionKind("words-phrases")).toBe("vocab");
    expect(checkupSectionKind("translations")).toBe("vocab");
    expect(checkupSectionKind("definitions")).toBe("vocab");
    expect(checkupSectionKind("picture-mc")).toBe("vocab");
  });
});

describe("validateCheckupSections — the Σ=20 gate", () => {
  const sec = (kind: string, checkupKind: CheckupSectionConfig["checkupKind"], points: number, n = points): CheckupDraftSection => ({
    kind,
    itemIds: Array.from({ length: n }, (_, i) => `${checkupKind}.${i}`),
    sectionConfig: { checkupKind, points },
  });

  it("passes the g2 preset shape (8+6+6)", () => {
    const errors = validateCheckupSections([
      sec("vocab", "words-phrases", 8),
      sec("grammar", "grammar", 6),
      sec("vocab", "translations", 6),
    ]);
    expect(errors).toEqual([]);
  });

  it(`rejects a sum other than ${CHECKUP_TOTAL}`, () => {
    const errors = validateCheckupSections([sec("vocab", "words-phrases", 8), sec("grammar", "grammar", 6)]);
    expect(errors.some((e) => e.includes("/20") && e.includes("14"))).toBe(true);
  });

  it("rejects an item count that doesn't match the points (one item = one point)", () => {
    const errors = validateCheckupSections([
      sec("vocab", "words-phrases", 8, 7),
      sec("grammar", "grammar", 6),
      sec("vocab", "translations", 6),
    ]);
    expect(errors.some((e) => e.includes("one item = one point"))).toBe(true);
  });

  it("rejects a missing config, a kind mismatch, and picture-mc (deferred)", () => {
    expect(validateCheckupSections([{ kind: "vocab", itemIds: ["a"] }]).length).toBeGreaterThan(0);
    expect(
      validateCheckupSections([sec("grammar", "words-phrases", 20)]).some((e) => e.includes("must be a vocab section")),
    ).toBe(true);
    expect(validateCheckupSections([sec("vocab", "picture-mc", 20)]).some((e) => e.includes("deferred"))).toBe(true);
  });

  it("rejects an empty checkup", () => {
    expect(validateCheckupSections([])).toEqual(["A checkup needs at least one section."]);
  });
});

describe("scoreCheckup — the /20 scorer (doc 21 §7)", () => {
  it("hand-computed half-credit case: 2.0/5 + 2/3 = 4/8", () => {
    const sections = [
      { position: 0, itemIds: ["a", "b", "c", "d", "e"], points: 5 },
      { position: 1, itemIds: ["f", "g", "h"], points: 3 },
    ];
    const attempts: ScorableAttempt[] = [
      { itemId: "a", tier: "correct", createdAt: at(1) }, // 1
      { itemId: "b", tier: "partial", createdAt: at(2) }, // 0.5
      { itemId: "c", tier: "wrong", createdAt: at(3) }, // 0
      // d unanswered — 0 against the full section
      { itemId: "e", tier: "close", createdAt: at(4) }, // 0.5
      { itemId: "f", tier: "correct", createdAt: at(5) }, // 1
      { itemId: "g", tier: "correct", createdAt: at(6) }, // 1
      // h unanswered
    ];
    const score = scoreCheckup(sections, attempts);
    expect(score.points).toBe(4);
    expect(score.outOf).toBe(8);
    expect(score.perSection).toEqual([
      { position: 0, points: 2, outOf: 5 },
      { position: 1, points: 2, outOf: 3 },
    ]);
  });

  it("never rewards a retry (first attempt per item wins)", () => {
    const sections = [{ position: 0, itemIds: ["a"], points: 1 }];
    const attempts: ScorableAttempt[] = [
      { itemId: "a", tier: "wrong", createdAt: at(1) },
      { itemId: "a", tier: "correct", createdAt: at(9) }, // must NOT count
    ];
    expect(scoreCheckup(sections, attempts).points).toBe(0);
  });

  it("ignores attempts for items not on the paper", () => {
    const sections = [{ position: 0, itemIds: ["a"], points: 1 }];
    const attempts: ScorableAttempt[] = [{ itemId: "smuggled", tier: "correct", createdAt: at(1) }];
    expect(scoreCheckup(sections, attempts).points).toBe(0);
  });

  it("a full paper of blanks scores 0/20, all sections intact", () => {
    const sections = [
      { position: 0, itemIds: Array.from({ length: 8 }, (_, i) => `w${i}`), points: 8 },
      { position: 1, itemIds: Array.from({ length: 6 }, (_, i) => `g${i}`), points: 6 },
      { position: 2, itemIds: Array.from({ length: 6 }, (_, i) => `t${i}`), points: 6 },
    ];
    const score = scoreCheckup(sections, []);
    expect(score.points).toBe(0);
    expect(score.outOf).toBe(20);
    expect(score.perSection.map((s) => s.outOf)).toEqual([8, 6, 6]);
  });

  it("defensive fractional worth: 3 points over 4 items keeps the section's cap", () => {
    // Validation enforces itemIds.length === points, so worth is 1 in practice —
    // but the scorer must stay honest if a legacy row ever disagrees.
    const sections = [{ position: 0, itemIds: ["a", "b", "c", "d"], points: 3 }];
    const attempts: ScorableAttempt[] = [
      { itemId: "a", tier: "correct", createdAt: at(1) },
      { itemId: "b", tier: "correct", createdAt: at(2) },
      { itemId: "c", tier: "correct", createdAt: at(3) },
      { itemId: "d", tier: "correct", createdAt: at(4) },
    ];
    expect(scoreCheckup(sections, attempts).points).toBe(3);
  });

  it("an empty section contributes 0 and never divides by zero", () => {
    const score = scoreCheckup([{ position: 0, itemIds: [], points: 5 }], []);
    expect(score.points).toBe(0);
    expect(score.perSection[0]!.points).toBe(0);
  });
});

describe("formatCheckupPoints — at most one decimal (doc 21 §7)", () => {
  it("14.5 stays 14.5, 14 stays 14, never 14.50", () => {
    expect(formatCheckupPoints(14.5)).toBe("14.5");
    expect(formatCheckupPoints(14)).toBe("14");
    expect(formatCheckupPoints(20)).toBe("20");
    expect(formatCheckupPoints(0)).toBe("0");
  });
});
