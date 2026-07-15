import { describe, expect, it } from "vitest";
import { bestTierPerItem, deriveJourneyProgress, journeyModeFor, type JourneyNodeView } from "./journey-progress.ts";
import type { JourneyNode } from "@domigo/content-schema";

const lesson = (id: string): JourneyNode => ({ id, kind: "lesson", titleDe: "L", titleEn: null });
const game = (id: string): JourneyNode => ({ id, kind: "game", titleDe: "G", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "ch03" } });
const review = (id: string): JourneyNode => ({ id, kind: "review", titleDe: "R", titleEn: null });
const practice = (id: string): JourneyNode => ({ id, kind: "practice", titleDe: "P", titleEn: null, itemPool: "practice" });

const items = (m: Record<string, string[]>): Map<string, readonly string[]> =>
  new Map(Object.entries(m).map(([k, v]) => [k, v as readonly string[]]));
const statuses = (v: JourneyNodeView[]) => v.map((n) => `${n.id}:${n.status}`);

describe("bestTierPerItem", () => {
  it("keeps the highest tier per item (correct > partial > close > wrong)", () => {
    const best = bestTierPerItem([
      { itemId: "a", tier: "wrong" }, { itemId: "a", tier: "correct" }, { itemId: "a", tier: "partial" },
      { itemId: "b", tier: "close" }, { itemId: "b", tier: "wrong" },
    ]);
    expect(best.get("a")).toBe("correct");
    expect(best.get("b")).toBe("close");
  });
});

describe("deriveJourneyProgress — linear unlock over the gating spine", () => {
  it("a leading LESSON never locks the spine (F1)", () => {
    const nodes = [lesson("l"), practice("p1")];
    expect(statuses(deriveJourneyProgress(nodes, items({ p1: ["a"] }), new Map()))).toEqual(["l:available", "p1:available"]);
  });

  it("seeding a gating node's items unlocks the next", () => {
    const nodes = [practice("p1"), practice("p2")];
    const ni = items({ p1: ["a"], p2: ["b"] });
    expect(statuses(deriveJourneyProgress(nodes, ni, new Map()))).toEqual(["p1:available", "p2:locked"]);
    const best = bestTierPerItem([{ itemId: "a", tier: "correct" }]);
    expect(statuses(deriveJourneyProgress(nodes, ni, best))).toEqual(["p1:complete", "p2:available"]);
  });

  it("a REVIEW node is non-gating: locked past the frontier, available once reached (F5)", () => {
    const nodes = [practice("p1"), review("r"), practice("p2")];
    const ni = items({ p1: ["a"], p2: ["b"] });
    expect(statuses(deriveJourneyProgress(nodes, ni, new Map()))).toEqual(["p1:available", "r:locked", "p2:locked"]);
    const best = bestTierPerItem([{ itemId: "a", tier: "correct" }]);
    expect(statuses(deriveJourneyProgress(nodes, ni, best))).toEqual(["p1:complete", "r:available", "p2:available"]);
  });

  it("a GAME node is non-gating (its campaign owns its own progress — F4)", () => {
    const nodes = [game("g"), practice("p1")];
    expect(statuses(deriveJourneyProgress(nodes, items({ p1: ["a"] }), new Map()))).toEqual(["g:available", "p1:available"]);
  });

  it("a completed node's stars come from its item best-tiers", () => {
    const nodes = [practice("p1"), practice("p2")];
    const ni = items({ p1: ["a", "b"], p2: ["c"] });
    const best = bestTierPerItem([{ itemId: "a", tier: "correct" }, { itemId: "b", tier: "correct" }]);
    expect(deriveJourneyProgress(nodes, ni, best)[0]).toMatchObject({ id: "p1", status: "complete", stars: 3 });
    // a half-right node completes with fewer stars
    const best2 = bestTierPerItem([{ itemId: "a", tier: "correct" }, { itemId: "b", tier: "wrong" }]);
    expect(deriveJourneyProgress(nodes, ni, best2)[0]).toMatchObject({ status: "complete", stars: 1 });
  });

  it("all gates done → everything reached (complete/available), nothing locked", () => {
    const nodes = [practice("p1"), review("r")];
    const best = bestTierPerItem([{ itemId: "a", tier: "correct" }]);
    expect(statuses(deriveJourneyProgress(nodes, items({ p1: ["a"] }), best))).toEqual(["p1:complete", "r:available"]);
  });
});

describe("journeyModeFor", () => {
  it("builds journey:<unit>:<node>", () => {
    expect(journeyModeFor("g2-u03", "uben-1")).toBe("journey:g2-u03:uben-1");
  });
});
