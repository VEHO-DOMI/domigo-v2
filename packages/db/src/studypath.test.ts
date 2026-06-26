import { describe, expect, it } from "vitest";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import {
  buildUnitNodes,
  checkpointItemIds,
  nodeItemIds,
  starsFor,
  starsForTiers,
  withProgress,
  type NodeDef,
} from "./studypath.ts";

// Pure helpers only read id + difficulty — build minimal items.
const v = (id: string, difficulty: 1 | 2 | 3): VocabItem => ({ id, difficulty }) as unknown as VocabItem;
const g = (id: string, difficulty: 1 | 2 | 3): GrammarItem => ({ id, difficulty }) as unknown as GrammarItem;

describe("buildUnitNodes (granular graph from present difficulties)", () => {
  it("emits intro + one practice node per present difficulty, then a checkpoint", () => {
    const vocab = [v("v1", 1), v("v2", 1), v("v3", 3)]; // d1,d1,d3 — no d2
    const grammar = [g("a1", 2)]; // d2 only
    const ids = buildUnitNodes(vocab, grammar).map((n) => n.id);
    expect(ids).toEqual([
      "vocab-intro", "vocab-practice-1", "vocab-practice-3",
      "grammar-intro", "grammar-practice-2",
      "checkpoint",
    ]);
  });

  it("itemCount + graded flags are correct", () => {
    const nodes = buildUnitNodes([v("v1", 1), v("v2", 1)], [g("a1", 1)]);
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    expect(byId["vocab-intro"]!.graded).toBe(false);
    expect(byId["vocab-practice-1"]!.graded).toBe(true);
    expect(byId["vocab-practice-1"]!.itemCount).toBe(2);
    expect(byId["checkpoint"]!.itemCount).toBe(3); // min(10, 2+1)
  });

  it("omits a skill with no items; empty unit → no nodes", () => {
    expect(buildUnitNodes([v("v1", 1)], []).map((n) => n.id)).toEqual(["vocab-intro", "vocab-practice-1", "checkpoint"]);
    expect(buildUnitNodes([], [])).toEqual([]);
  });

  it("checkpoint itemCount caps at CHECKPOINT_SIZE (10)", () => {
    const vocab = Array.from({ length: 14 }, (_, i) => v(`v${i}`, 1));
    expect(buildUnitNodes(vocab, []).at(-1)!.itemCount).toBe(10);
  });
});

describe("nodeItemIds", () => {
  const vocab = [v("v1", 1), v("v2", 2), v("v3", 1)];
  const grammar = [g("a1", 3)];
  it("practice node → its kind's items at its difficulty, in corpus order", () => {
    const node: NodeDef = { id: "vocab-practice-1", kind: "vocab-practice", graded: true, title: "", difficulty: 1, itemCount: 2 };
    expect(nodeItemIds(node, vocab, grammar)).toEqual(["v1", "v3"]);
  });
  it("intro node → no items", () => {
    const node: NodeDef = { id: "vocab-intro", kind: "vocab-intro", graded: false, title: "", difficulty: null, itemCount: 0 };
    expect(nodeItemIds(node, vocab, grammar)).toEqual([]);
  });
});

describe("checkpointItemIds (deterministic round-robin)", () => {
  it("returns all when ≤ CHECKPOINT_SIZE", () => {
    expect(checkpointItemIds([v("v1", 1), v("v2", 2)], [g("a1", 3)]).sort()).toEqual(["a1", "v1", "v2"]);
  });
  it("caps at 10 and is stable across calls", () => {
    const vocab = Array.from({ length: 8 }, (_, i) => v(`v${i}`, 1));
    const grammar = Array.from({ length: 8 }, (_, i) => g(`a${i}`, 2));
    const a = checkpointItemIds(vocab, grammar);
    const b = checkpointItemIds(vocab, grammar);
    expect(a).toHaveLength(10);
    expect(a).toEqual(b); // deterministic
  });
  it("spreads across difficulty buckets (alternating d1/d2 here)", () => {
    const vocab = [v("v1", 1), v("v2", 1), v("v3", 1)];
    const grammar = [g("a1", 2), g("a2", 2)];
    expect(checkpointItemIds(vocab, grammar)).toEqual(["v1", "a1", "v2", "a2", "v3"]);
  });
});

describe("starsFor / starsForTiers", () => {
  it("accuracy thresholds: 0→0, 100%→3, 80%→2, below→1", () => {
    expect(starsFor(0, 0)).toBe(0);
    expect(starsFor(5, 5)).toBe(3);
    expect(starsFor(4, 5)).toBe(2); // 0.8
    expect(starsFor(3.5, 5)).toBe(1); // 0.7
    expect(starsFor(1, 5)).toBe(1); // finishing always ≥1★
  });
  it("from a tier tally (partial/close = 0.5, wrong = 0)", () => {
    expect(starsForTiers(["correct", "correct"])).toBe(3);
    expect(starsForTiers(["correct", "wrong"])).toBe(1); // 0.5
    expect(starsForTiers(["correct", "correct", "correct", "partial"])).toBe(2); // 3.5/4 = 0.875
  });
});

describe("withProgress (unlock derivation)", () => {
  const nodes = buildUnitNodes([v("v1", 1)], [g("a1", 1)]);
  // → [vocab-intro, vocab-practice-1, grammar-intro, grammar-practice-1, checkpoint]
  it("nothing done → first available, rest locked", () => {
    const s = withProgress(nodes, new Map()).map((n) => n.status);
    expect(s).toEqual(["available", "locked", "locked", "locked", "locked"]);
  });
  it("completing a node unlocks the next + surfaces its stars", () => {
    const completed = new Map([["vocab-intro", { stars: 0 }], ["vocab-practice-1", { stars: 2 }]]);
    const views = withProgress(nodes, completed);
    expect(views.map((n) => n.status)).toEqual(["completed", "completed", "available", "locked", "locked"]);
    expect(views.find((n) => n.id === "vocab-practice-1")!.stars).toBe(2);
  });
  it("all completed → all completed (unit done)", () => {
    const completed = new Map(nodes.map((n) => [n.id, { stars: 3 }]));
    expect(withProgress(nodes, completed).every((n) => n.status === "completed")).toBe(true);
  });
});
