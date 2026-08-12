import { describe, expect, it } from "vitest";
import { rectGap, warmOrder, warmTake, WARM_MPX_PER_FRAME, type WarmCandidate, type WarmItem } from "./warm.ts";

// R5-N3 · E4. These are the laws the level-start fix stands on. Each one is
// here because breaking it reintroduces a defect we can name:
//   • a texture the opening screen samples but the plan calls "rest"  ⇒ the
//     224 ms hitch survives, just for fewer textures.
//   • a plan that is not the same twice                              ⇒ the
//     determinism law breaks, and a proof tape stops proving anything.
//   • a slice that can be 0 with work left                           ⇒ the
//     queue stalls forever and later textures hitch mid-level instead.

const VIEW = { x: 0, y: 0, w: 352, h: 224 };
const at = (key: string, x: number, y: number, w = 16, h = 16): WarmCandidate => ({ key, x, y, w, h });

describe("rectGap — the distance that decides what is warmed next", () => {
  it("is zero when the rectangles overlap or merely touch", () => {
    expect(rectGap({ x: 10, y: 10, w: 20, h: 20 }, VIEW)).toBe(0);
    expect(rectGap({ x: 352, y: 0, w: 10, h: 10 }, VIEW)).toBe(0); // edge-to-edge
  });

  it("measures the GAP, not the centre — a level-wide backdrop is on screen", () => {
    // 4000 px wide, centred far off to the right, but it covers the view.
    const plate = { x: -100, y: -50, w: 4000, h: 400 };
    expect(rectGap(plate, VIEW)).toBe(0);
  });

  it("grows with the real gap in both axes", () => {
    expect(rectGap({ x: 452, y: 0, w: 10, h: 10 }, VIEW)).toBe(100);
    expect(rectGap({ x: 0, y: 424, w: 10, h: 10 }, VIEW)).toBe(200);
    expect(rectGap({ x: 452, y: 424, w: 10, h: 10 }, VIEW)).toBeCloseTo(Math.sqrt(100 * 100 + 200 * 200), 6);
  });
});

describe("warmOrder — what the opening screen needs comes first", () => {
  it("puts every on-screen texture in `first` and never in `rest`", () => {
    const plan = warmOrder([at("a", 10, 10), at("b", 900, 10), at("c", 100, 100)], VIEW);
    expect([...plan.first].sort()).toEqual(["a", "c"]);
    expect(plan.rest).toEqual(["b"]);
  });

  it("judges a texture by its CLOSEST object — one tile on screen is enough", () => {
    // The same floor tile drawn 3× off screen and once on it.
    const plan = warmOrder([at("floor", 2000, 0), at("floor", 3000, 0), at("floor", 20, 20)], VIEW);
    expect(plan.first).toEqual(["floor"]);
    expect(plan.rest).toEqual([]);
  });

  it("names every texture exactly once, however many objects use it", () => {
    const plan = warmOrder([at("x", 10, 10), at("x", 12, 10), at("y", 900, 0), at("y", 950, 0)], VIEW);
    expect([...plan.first, ...plan.rest].sort()).toEqual(["x", "y"]);
  });

  it("sorts `rest` nearest-first — what scrolls in next is warmed next", () => {
    const plan = warmOrder([at("far", 3000, 0), at("near", 400, 0), at("mid", 1000, 0)], VIEW);
    expect(plan.rest).toEqual(["near", "mid", "far"]);
  });

  it("is deterministic: same input, byte-identical plan (no clock, no random)", () => {
    const items = [at("b", 900, 0), at("a", 10, 0), at("c", 500, 0), at("d", 900, 0)];
    const runs = Array.from({ length: 5 }, () => JSON.stringify(warmOrder(items, VIEW)));
    expect(new Set(runs).size).toBe(1);
  });

  it("breaks distance ties by first appearance, so equal neighbours keep their order", () => {
    const plan = warmOrder([at("second", 400, 0), at("first", 400, 0)], VIEW);
    expect(plan.rest).toEqual(["second", "first"]);
  });

  it("survives an empty scene", () => {
    expect(warmOrder([], VIEW)).toEqual({ first: [], rest: [] });
  });
});

describe("warmTake — the ration, so warming never becomes the hitch", () => {
  const q = (...mpx: number[]): WarmItem[] => mpx.map((m, i) => ({ key: `k${i}`, mpx: m }));

  it("takes as many as fit the ration and stops", () => {
    expect(warmTake(q(0.2, 0.2, 0.2, 0.2), 0.5)).toBe(2);
  });

  it("THE OVERSHOOT LAW: one texture cannot be half-warmed, so it always takes ≥ 1", () => {
    // plate_yard is 2.58 Mpx — five rations by itself, and still indivisible.
    expect(warmTake(q(2.58, 0.1), WARM_MPX_PER_FRAME)).toBe(1);
  });

  it("never stalls: work left and a ration always yields progress", () => {
    for (const budget of [0.001, 0.1, 0.5, 4]) expect(warmTake(q(1, 1, 1), budget)).toBeGreaterThanOrEqual(1);
  });

  it("takes nothing when there is nothing to do, or no ration at all", () => {
    expect(warmTake([], 0.5)).toBe(0);
    expect(warmTake(q(1, 1), 0)).toBe(0);
    expect(warmTake(q(1, 1), -5)).toBe(0);
  });

  it("obeys a ceiling of zero — a caller that forbids warming is not overruled", () => {
    // Found by the tamper round: a "never return 0" guard looks protective and
    // is in fact the one way this function can disobey its caller.
    expect(warmTake(q(0.1, 0.1), 0.5, 0)).toBe(0);
  });

  it("never exceeds the queue or the per-frame ceiling", () => {
    expect(warmTake(q(0.01, 0.01), 10_000)).toBe(2);
    expect(warmTake(Array.from({ length: 200 }, () => ({ key: "k", mpx: 0.001 })), 10_000, 64)).toBe(64);
  });

  it("rations MEGAPIXELS, not milliseconds — the unit the card is billed in", () => {
    // The bug this replaced: a wall-clock ration read 0.43 ms/Mpx (CPU queueing
    // time) and let a whole phase through in one frame. Measured consequence on
    // p2: a 257 ms first frame against a 159 ms control. Two textures of 0.3 Mpx
    // exceed a 0.5 ration however fast the machine is.
    expect(warmTake(q(0.3, 0.3, 0.3), WARM_MPX_PER_FRAME)).toBe(1);
    expect(warmTake(q(0.25, 0.25, 0.25), WARM_MPX_PER_FRAME)).toBe(2);
  });

  it("the shipped ration stays well inside one frame's spare GPU time", () => {
    // ~3.5 ms of GPU per megapixel (dose ladder), settled frames cost 1.7–1.9 ms,
    // and the frame budget is 16.67 ms.
    expect(WARM_MPX_PER_FRAME * 3.5 + 2).toBeLessThan(1000 / 60);
  });
});
