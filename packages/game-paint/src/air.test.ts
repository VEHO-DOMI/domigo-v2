// PK-R6 · H1 · THE AIR (air.ts) — doc 36's missing middle, drawn in code.
//
// Everything the atmosphere does is arithmetic over the manifest and the world
// box, so all of it is provable here without a browser — the same contract the
// layer compositor and the carved mass already keep (a WebGL canvas cannot be
// read back; Build-D banked that false negative).
//
// The three properties worth locking, because breaking any of them turns a fix
// into a defect:
//   1 the air NEVER enters the gameplay band (a beam across a hostile is a
//     readability defect, not a fix for one);
//   2 the haze covers the camera's travel box (a visible right edge would draw a
//     vertical seam down the wall halfway through the level — Build-D's F-6);
//   3 it is DETERMINISTIC, and tick 0 is the reduced-motion base state.
import { describe, expect, it } from "vitest";
import {
  AIR_DEPTH,
  airFloor,
  hazeCovers,
  planAir,
  planHaze,
  planMotes,
  planShafts,
  planSources,
  spreadAt,
  vignetteBands,
} from "./air.ts";
import { CH01_COMPOSITION } from "./composition.ts";
import { PLANE_DEPTH } from "./layers.ts";
import { LOGICAL_H, LOGICAL_W, TILE } from "./paint.ts";

/** the live ch01 grids: p1 64×22 · p2 72×24 · p3 64×26 · p4 36×20 · p9 44×20 */
const SHAPES: Record<string, readonly [number, number]> = {
  p1: [64, 22], p2: [72, 24], p3: [64, 26], p4: [36, 20], p9: [44, 20],
};
const boxOf = (id: string): { w: number; h: number } => {
  const s = SHAPES[id] ?? [64, 22];
  return { w: s[0] * TILE, h: s[1] * TILE };
};

describe("the air is declared, per room", () => {
  it("gives every ch01 phase its own atmosphere", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      expect(spec.air, `${id} declares no air`).toBeDefined();
    }
  });

  it("gives the ink dream NO shafts — a dream inside an inkwell has no windows", () => {
    expect(CH01_COMPOSITION.p9!.air!.shafts).toBeUndefined();
    for (const id of ["p1", "p2", "p3", "p4"]) {
      expect(CH01_COMPOSITION[id]!.air!.shafts, `${id} shafts`).toBeDefined();
    }
  });

  it("draws nothing at all for a phase that declares no air (the fallback law)", () => {
    expect(planAir(undefined, 64 * TILE, 22 * TILE)).toEqual([]);
  });
});

describe("the air sits BETWEEN the painted planes", () => {
  it("hazes over the far shell and under the furniture", () => {
    expect(AIR_DEPTH.haze).toBeGreaterThan(PLANE_DEPTH.far);
    expect(AIR_DEPTH.haze).toBeLessThan(PLANE_DEPTH.mid);
  });

  it("drops its beams in FRONT of the furniture and its shadow in front of both", () => {
    expect(AIR_DEPTH.shaft).toBeGreaterThan(PLANE_DEPTH.mid);
    expect(AIR_DEPTH.vignette).toBeGreaterThan(AIR_DEPTH.shaft);
    expect(AIR_DEPTH.vignette).toBeLessThan(1); // …and under every play object
  });

  it("hangs its motes in the room WITH the child: in front of terrain, behind beings", () => {
    expect(AIR_DEPTH.mote).toBeGreaterThan(2.6); // over the slide, the deepest terrain piece
    expect(AIR_DEPTH.mote).toBeLessThan(7); // under every entity
  });
});

describe("the haze obeys the cover law (doc 36 §3)", () => {
  it("covers the camera's travel box in every ch01 phase", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      const { w, h } = boxOf(id);
      expect(hazeCovers(planHaze(spec.air!, w, h), w, h), `${id} haze`).toBe(true);
    }
  });

  it("fails a haze sized to ONE screen instead of to the plane's travel window", () => {
    // the tamper, and the exact shape of Build-D's F-6: a piece one view wide
    // looks right at camX 0 and runs out before the level ends. A 0.25 plane's
    // window is [264, 616] at the start and reaches 784 by the last camera
    // position, so 352 px of haze is 168 px short of the wall.
    const { w, h } = boxOf("p1");
    const real = planHaze(CH01_COMPOSITION.p1!.air!, w, h);
    expect(hazeCovers({ ...real, w: LOGICAL_W }, w, h)).toBe(false);
    // …and one that starts below the top of the frame leaves the wall bare
    expect(hazeCovers({ ...real, y: real.y + 40 }, w, h)).toBe(false);
  });
});

describe("the air never enters the gameplay band", () => {
  it("stops every beam and every mote at the phase's declared band", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      const { w, h } = boxOf(id);
      const air = spec.air!;
      const floor = airFloor(air, h);
      expect(floor).toBeLessThan(h); // the band is a fraction of the world, not all of it
      for (const s of planShafts(air, w, h)) {
        for (const [, y] of s.points) expect(y, `${id} shaft`).toBeLessThanOrEqual(floor + 0.001);
      }
      // …at every tick of a full drift cycle, not only at the one we happened to draw
      for (const tick of [0, 47, 95, 142, 189, 1000]) {
        for (const m of planMotes(air, w, h, tick)) {
          expect(m.y, `${id} mote @${tick}`).toBeLessThanOrEqual(floor + 0.001);
          expect(m.y).toBeGreaterThan(0);
        }
      }
    }
  });
});

describe("the air is deterministic (no Math.random anywhere near it)", () => {
  it("paints the same frame twice for the same tick", () => {
    const { w, h } = boxOf("p1");
    const air = CH01_COMPOSITION.p1!.air!;
    expect(planMotes(air, w, h, 77)).toEqual(planMotes(air, w, h, 77));
    expect(planShafts(air, w, h)).toEqual(planShafts(air, w, h));
  });

  it("moves between ticks — a mote that never drifts is not ambient motion", () => {
    const { w, h } = boxOf("p1");
    const air = CH01_COMPOSITION.p1!.air!;
    const a = planMotes(air, w, h, 0);
    const b = planMotes(air, w, h, 48);
    expect(a).toHaveLength(air.motes!.count);
    expect(a.some((m, i) => Math.abs(m.y - (b[i]?.y ?? m.y)) > 0.3)).toBe(true);
  });

  it("makes tick 0 the reduced-motion base state (the end-states law)", () => {
    // reduced motion draws the air at tick 0, so the still frame must be a
    // COMPLETE picture: every mote present, visible, inside the band
    const { w, h } = boxOf("p2");
    const air = CH01_COMPOSITION.p2!.air!;
    const still = planMotes(air, w, h, 0);
    expect(still).toHaveLength(air.motes!.count);
    for (const m of still) {
      expect(m.alpha).toBeGreaterThan(0);
      expect(m.r).toBeGreaterThan(0);
    }
  });

  it("spreads its beams without ever stacking two on one line", () => {
    const xs = [0, 1, 2, 3, 4].map(spreadAt);
    for (const x of xs) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
    expect(new Set(xs).size).toBe(xs.length);
    // …and the three beams of a real phase land in three different places
    const { w, h } = boxOf("p1");
    const shafts = planShafts(CH01_COMPOSITION.p1!.air!, w, h);
    expect(shafts).toHaveLength(3);
    expect(new Set(shafts.map((s) => s.points[0]![0].toFixed(2))).size).toBe(3);
  });
});

describe("the vignette closes the frame the camera is actually showing", () => {
  it("draws its bands inside the camera rect, top-heaviest", () => {
    const bands = vignetteBands(100, 40, 0.25);
    expect(bands).toHaveLength(4);
    for (const b of bands) {
      expect(b.x).toBeGreaterThanOrEqual(100 - 0.001);
      expect(b.y).toBeGreaterThanOrEqual(40 - 0.001);
      expect(b.x + b.w).toBeLessThanOrEqual(100 + LOGICAL_W + 0.001);
      expect(b.y + b.h).toBeLessThanOrEqual(40 + LOGICAL_H + 0.001);
    }
    const top = bands.find((b) => b.edge === "top")!;
    const bottom = bands.find((b) => b.edge === "bottom")!;
    // the dead space the critique named is ABOVE, so that is where it closes in
    expect(top.alpha).toBeGreaterThan(bottom.alpha);
    expect(top.h).toBeGreaterThan(bottom.h);
  });

  it("draws nothing when a phase asks for none", () => {
    expect(vignetteBands(0, 0, 0)).toEqual([]);
  });
});

// ── PK-R6 · H2 · THE LIGHT HAS A SOURCE (round-2 finding 9) ─────────────────
// „Unmotivated diagonal glare overlay across every frame … either remove the
// glass-streak overlay or paint a visible light source into the background that
// justifies it, so it reads as deliberate atmosphere rather than a leftover
// render artifact." Removal was the wrong branch — the haze/shaft/vignette trio
// is what put a fourth value band into round 1's two-band frame — so the beams
// keep their light and are given the lamp they always claimed to hang from.
describe("every beam that claims a fixture has one (round-2 finding 9)", () => {
  it("draws a source for the stage, and for nowhere the fiction has no lamp", () => {
    // p4 IS the boss stage — every frame the harness captured happens here, and
    // its spec has said „two stage lamps" in a comment since the day it was
    // written. A comment is not a picture.
    expect(CH01_COMPOSITION.p4!.air!.shafts!.source).toBe("lamp");
    const { w, h } = boxOf("p4");
    const shafts = planShafts(CH01_COMPOSITION.p4!.air!, w, h);
    const sources = planSources(CH01_COMPOSITION.p4!.air!, w, h);
    // one fixture per beam, and never one without the other
    expect(sources.length).toBe(shafts.length);
    expect(sources.length).toBeGreaterThan(0);
    // the daylit rooms are untouched: a hall lit by the day outside owes no sun
    for (const id of ["p1", "p2", "p3"]) {
      expect(planSources(CH01_COMPOSITION[id]!.air!, ...Object.values(boxOf(id)) as [number, number]))
        .toEqual([]);
    }
    // …and a room with no beams cannot grow a lamp
    expect(planSources(CH01_COMPOSITION.p9!.air!, ...Object.values(boxOf("p9")) as [number, number])).toEqual([]);
  });

  it("puts each fixture AT its own beam's mouth — it cannot drift off the light", () => {
    const { w, h } = boxOf("p4");
    const air = CH01_COMPOSITION.p4!.air!;
    const shafts = planShafts(air, w, h);
    const sources = planSources(air, w, h);
    shafts.forEach((s, i) => {
      const src = sources[i]!;
      const [tl, tr] = s.points;
      expect(src.x).toBeCloseTo(((tl![0]) + (tr![0])) / 2, 9);
      expect(src.y).toBeCloseTo(tl![1], 9);
      // same plane, same parallax — a lamp that scrolled differently from its own
      // light is the identical defect one layer up
      expect(src.parallax).toBe(s.parallax);
      expect(src.parallaxY).toBe(s.parallaxY);
      expect(src.depth).toBe(s.depth);
    });
  });

  it("keeps the fixture OUT of the gameplay band, like everything else in the air", () => {
    const { w, h } = boxOf("p4");
    const air = CH01_COMPOSITION.p4!.air!;
    const floor = airFloor(air, h);
    for (const src of planSources(air, w, h)) {
      // the lamp hangs ABOVE its mouth, so its whole body is above the beam's own
      // top — the band law holds by construction, and this is the check that says so
      expect(src.y).toBeLessThanOrEqual(floor + 0.001);
      expect(src.y - src.depthPx).toBeLessThan(src.y);
    }
  });

  it("is in the plan, and is deterministic", () => {
    const { w, h } = boxOf("p4");
    const air = CH01_COMPOSITION.p4!.air!;
    expect(planAir(air, w, h, 0).filter((p) => p.kind === "source").length).toBe(planSources(air, w, h).length);
    expect(planSources(air, w, h)).toEqual(planSources(air, w, h));
  });
});
