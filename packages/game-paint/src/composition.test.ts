// PB-C1 · the composition engine's pure brains: the layer compositor
// (doc 36 §1), the carved mass (§2), cover-fit (§3) and the letter glyphs.
// Everything the renderer places is planned here, so everything the renderer
// places can be proven WITHOUT a browser — which is the point: a WebGL canvas
// cannot be read back (Build-D banked that false negative), so composition is
// verified by arithmetic over the plan, not by sampling the screen.
import { describe, expect, it } from "vitest";
import { CH01_COMPOSITION, type MassKit, compositionFor, compositionStems } from "./composition.ts";
import { coverFit, coversAxis, planLayers, planeCovers, travelBox } from "./layers.ts";
import { CRUST_H, CRUST_LIP, MAX_PLATFORM_CELLS, floatingPlatformRuns, nakedFills, planMass, slideRuns } from "./mass.ts";
import { letterGlyphs } from "./letters.ts";
import { LOGICAL_H, LOGICAL_W, TILE } from "./paint.ts";

const kit: MassKit = {
  crust: ["crust_a", "crust_b"],
  crustCapL: "cap_l",
  crustCapR: "cap_r",
  body: ["body_a", "body_b"],
  fade: "fade",
  sediment: "sediment",
  edgeL: "edge_l",
  edgeR: "edge_r",
  cornerBL: "corner_bl",
  cornerBR: "corner_br",
  inCornerL: "incorner_l",
  inCornerR: "incorner_r",
  rampUp: "ramp_up",
  rampDown: "ramp_down",
  platObjects: [{ stem: "plat_2", cells: 2 }, { stem: "plat_1", cells: 1 }],
  slide: { top: "slide_top", mid: "slide_mid", foot: "slide_foot", under: "slide_under" },
};

const src512 = (): { w: number; h: number } => ({ w: 512, h: 512 });

describe("cover-fit (doc 36 §3) — the p4 cream-void law", () => {
  it("covers the camera's travel box at BOTH extremes", () => {
    // p4's shape: 36 tiles wide, 20 tall — the level that showed the void
    const worldW = 36 * TILE;
    const worldH = 20 * TILE;
    const box = coverFit({ w: 2048, h: 1152 }, worldW, worldH, 0.12, 0.06);
    const { maxCamX, maxCamY } = travelBox(worldW, worldH);
    expect(coversAxis(box.x, box.x + box.w, 0.12, LOGICAL_W, maxCamX)).toBe(true);
    expect(coversAxis(box.y, box.y + box.h, 0.06, LOGICAL_H, maxCamY)).toBe(true);
  });

  it("anchors on the world floor, never letterboxed above it", () => {
    const worldH = 20 * TILE;
    const box = coverFit({ w: 2048, h: 1152 }, 36 * TILE, worldH, 0.12, 0.06);
    expect(box.y + box.h).toBeCloseTo(worldH, 5);
    expect(box.y).toBeLessThanOrEqual(0);
  });

  it("holds for every real ch01 phase geometry, at every plane's parallax", () => {
    // p1 64×22 · p2 72×24 · p3 64×26 · p4 36×20 · p9 44×20 (the live grids)
    const shapes = [[64, 22], [72, 24], [64, 26], [36, 20], [44, 20]] as const;
    for (const [cols, rows] of shapes) {
      const worldW = cols * TILE;
      const worldH = rows * TILE;
      const { maxCamX, maxCamY } = travelBox(worldW, worldH);
      for (const p of [0.05, 0.12, 0.25, 0.5]) {
        const box = coverFit({ w: 2048, h: 1152 }, worldW, worldH, p, p / 2);
        expect(coversAxis(box.x, box.x + box.w, p, LOGICAL_W, maxCamX), `${cols}×${rows} @${p} x`).toBe(true);
        expect(coversAxis(box.y, box.y + box.h, p / 2, LOGICAL_H, maxCamY), `${cols}×${rows} @${p} y`).toBe(true);
      }
    }
  });

  it("scales UP a source too small to cover, never letterboxes it", () => {
    const box = coverFit({ w: 320, h: 180 }, 64 * TILE, 22 * TILE, 0.25, 0.12);
    expect(box.w).toBeGreaterThan(320);
    expect(coversAxis(box.x, box.x + box.w, 0.25, LOGICAL_W, travelBox(64 * TILE, 22 * TILE).maxCamX)).toBe(true);
  });
});

describe("the five planes (doc 36 §1)", () => {
  const worldW = 64 * TILE;
  const worldH = 22 * TILE;

  it("plans L0 + L1 + L2 + L4 for a manifest phase", () => {
    const pieces = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, src512);
    expect(pieces.filter((p) => p.plane === "L0")).toHaveLength(1);
    expect(pieces.filter((p) => p.plane === "L1").length).toBeGreaterThan(0);
    expect(pieces.filter((p) => p.plane === "L2")).toHaveLength(1);
    expect(pieces.filter((p) => p.plane === "L4")).toHaveLength(1);
  });

  it("holds the parallax ramp 0.05 → 0.25 → 0.5 → 1 → 1.15+", () => {
    const pieces = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, src512);
    const of = (plane: string): number => pieces.find((p) => p.plane === plane)?.parallax ?? -1;
    expect(of("L0")).toBeCloseTo(0.05);
    expect(of("L1")).toBeCloseTo(0.25);
    expect(of("L2")).toBeCloseTo(0.5);
    expect(of("L4")).toBeGreaterThanOrEqual(1.15);
  });

  it("L0 and L1 cover the travel box — no page may show through", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      const pieces = planLayers(spec, worldW, worldH, src512);
      expect(planeCovers(pieces.filter((p) => p.plane === "L0"), worldW, worldH, "both"), `${id} L0`).toBe(true);
      expect(planeCovers(pieces.filter((p) => p.plane === "L1"), worldW, worldH, "both"), `${id} L1`).toBe(true);
    }
  });

  it("lays L1 segments edge to edge — a gap between them is a hole", () => {
    const l1 = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, src512).filter((p) => p.plane === "L1");
    const sorted = [...l1].sort((a, b) => a.x - b.x);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i]!.x).toBeCloseTo(sorted[i - 1]!.x + sorted[i - 1]!.w, 5);
    }
  });

  it("renders NOTHING for a phase with no manifest (the fallback law)", () => {
    expect(compositionFor("ch01", "p7")).toBeNull();
    expect(compositionFor("ch99", "p1")).toBeNull();
  });

  it("skips planes whose art has not landed (only-present)", () => {
    const pieces = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, () => null);
    expect(pieces.filter((p) => p.kind !== "wash")).toHaveLength(0);
    expect(pieces.filter((p) => p.kind === "wash")).toHaveLength(1); // the wash is engine-drawn
  });
});

describe("the carved mass (doc 36 §2)", () => {
  //  0 ....................
  //  1 ....##..............   ← a 2-cell floating platform
  //  2 ....................
  //  3 ######........#######  ← ground, then a gap, then ground
  //  4 ######........#######
  //  5 ######........#######
  //  6 ######........#######
  const grid = [
    "....................",
    "....##..............",
    "....................",
    "######........######",
    "######........######",
    "######........######",
    "######........######",
  ];

  it("puts a crust with FLUSH caps on every exposed top", () => {
    const p = planMass(grid, kit);
    const crusts = p.filter((q) => q.kind === "crust");
    expect(crusts.length).toBe(2); // the two ground runs
    const left = crusts.find((q) => q.c === 0)!;
    const capR = p.find((q) => q.kind === "capR" && q.r === left.r)!;
    expect(capR.x).toBeCloseTo(left.x + left.w, 5); // flush: no floating bookend
    expect(left.y).toBeCloseTo(3 * TILE - CRUST_LIP, 5);
    expect(left.h).toBe(CRUST_H);
  });

  it("suppresses caps where a run runs into the world edge", () => {
    const p = planMass(grid, kit);
    expect(p.some((q) => q.kind === "capL" && q.c === 0)).toBe(false);
    expect(p.some((q) => q.kind === "capR" && q.c === 19)).toBe(false);
  });

  it("ramps the interior body → fade → sediment with depth", () => {
    const p = planMass(grid, kit);
    const at = (c: number, r: number) => p.find((q) => ["body", "fade", "sediment"].includes(q.kind) && q.r === r && q.x <= c * TILE && q.x + q.w > c * TILE);
    expect(at(0, 3)?.kind).toBe("body"); // depth 0
    expect(at(0, 5)?.kind).toBe("body"); // depth 2
    expect(at(0, 6)?.kind).toBe("fade"); // depth 3
  });

  it("trims every exposed side", () => {
    const p = planMass(grid, kit);
    expect(p.some((q) => q.kind === "edgeR" && q.c === 5 && q.r === 3)).toBe(true);
    expect(p.some((q) => q.kind === "edgeL" && q.c === 14 && q.r === 3)).toBe(true);
  });

  it("turns an OUTER corner where a side face meets an underside", () => {
    // 5 cells wide, so it is an overhang and not a platform object
    const ledge = ["........", ".#####..", "........", "########"];
    const p = planMass(ledge, kit);
    expect(p.some((q) => q.kind === "cornerBL" && q.c === 1 && q.r === 1)).toBe(true);
    expect(p.some((q) => q.kind === "cornerBR" && q.c === 5 && q.r === 1)).toBe(true);
  });

  it("turns an INNER corner where a wall rises out of the floor", () => {
    const step = ["........", "..#.....", "..#.....", "########"];
    const p = planMass(step, kit);
    expect(p.some((q) => q.kind === "inCornerL" && q.c === 3 && q.r === 3)).toBe(true);
  });

  it("never trims against the world edge — outside the grid is solid", () => {
    const p = planMass(grid, kit);
    expect(p.some((q) => q.kind === "cornerBR" && q.r === 6)).toBe(false);
    expect(p.some((q) => q.kind === "edgeL" && q.c === 0)).toBe(false);
  });

  it("draws a floating platform as ONE complete object, never crust-on-fill", () => {
    const runs = floatingPlatformRuns(grid);
    expect(runs).toEqual([{ c0: 4, c1: 5, r: 1 }]);
    const p = planMass(grid, kit);
    const plats = p.filter((q) => q.kind === "platform");
    expect(plats).toHaveLength(1);
    expect(plats[0]!.stem).toBe("plat_2");
    expect(plats[0]!.w).toBe(2 * TILE);
    // and NO anatomy is emitted on the cells it owns
    for (const kind of ["crust", "body", "edgeL", "edgeR", "capL", "capR"]) {
      expect(p.some((q) => q.kind === kind && q.r === 1), kind).toBe(false);
    }
  });

  it("covers a 3-cell platform with complete objects, never one stretched", () => {
    const g3 = ["........", "..###...", "........", "########"];
    const plats = planMass(g3, kit).filter((q) => q.kind === "platform");
    expect(plats.map((q) => q.stem)).toEqual(["plat_2", "plat_1"]);
    expect(plats.reduce((s, q) => s + q.w, 0)).toBe(3 * TILE);
  });

  it("treats an anchored ledge as terrain, not as a platform object", () => {
    const anchored = ["........", "###.....", "###.....", "########"];
    expect(floatingPlatformRuns(anchored)).toHaveLength(0);
    expect(planMass(anchored, kit).some((q) => q.kind === "platform")).toBe(false);
  });

  it(`never treats a run wider than ${MAX_PLATFORM_CELLS} cells as one object`, () => {
    const wide = ["........", ".#####..", "........", "########"];
    expect(floatingPlatformRuns(wide)).toHaveLength(0);
  });

  it("draws the z run as ONE chute: top → mid → foot, plus its under-structure", () => {
    const slideGrid = ["......", ".z....", "..z...", "...z..", "....z.", "######"];
    expect(slideRuns(slideGrid)).toEqual([{ c: 1, r: 1, n: 4 }]);
    const p = planMass(slideGrid, kit);
    expect(p.filter((q) => q.kind === "slideUnder")).toHaveLength(4);
    const surface = p.filter((q) => q.kind.startsWith("slide") && q.kind !== "slideUnder");
    expect(surface[0]!.kind).toBe("slideTop");
    expect(surface[surface.length - 1]!.kind).toBe("slideFoot");
    // the modules butt up along the diagonal — one unbroken slide
    for (const m of surface) expect(m.rot).toBeCloseTo(Math.PI / 4, 5);
    const travelled = surface.reduce((s, m) => s + m.w, 0);
    expect(travelled).toBeCloseTo(Math.hypot(4 * TILE, 4 * TILE), 4);
  });

  it("NO NAKED FILL anywhere once a kit is present", () => {
    expect(nakedFills(planMass(grid, kit))).toHaveLength(0);
  });

  it("falls back to engine fills with no kit (and the audit can see them)", () => {
    const fills = nakedFills(planMass(grid, null));
    expect(fills.length).toBeGreaterThan(0);
    expect(fills.every((f) => f.stem === null)).toBe(true);
  });
});

describe("the letter trail (doc 36 §3)", () => {
  const rows = ["..*...*...", "......*...", "*........."];

  it("gives every collectible its OWN character — not eight painted A's", () => {
    const glyphs = letterGlyphs(rows);
    expect(glyphs).toHaveLength(4);
    expect(new Set(glyphs.map((g) => g.char)).size).toBe(4);
  });

  it("orders them the way a player walks: left to right", () => {
    expect(letterGlyphs(rows).map((g) => g.c)).toEqual([0, 2, 6, 6]);
  });

  it("spells the phase's word when the manifest names one", () => {
    expect(letterGlyphs(rows, ["pen", "cil"]).map((g) => g.char).join("")).toBe("PENC");
  });
});

describe("the manifest", () => {
  it("names every stem the kit needs, deduplicated", () => {
    const stems = compositionStems(CH01_COMPOSITION.p3!);
    for (const want of ["ph_crust_p3_a", "ph_mass_body_a", "ph_mass_sediment", "ph_slide_mid", "ph_plat_2", "ph_l1_p3_a", "ph_l2_p3"]) {
      expect(stems, want).toContain(want);
    }
    expect(new Set(stems).size).toBe(stems.length);
  });

  it("gives p9 no furniture band (AF: its L1 is atmosphere, almost empty)", () => {
    expect(CH01_COMPOSITION.p9!.mid).toBeUndefined();
  });

  it("gives the slide to p3 and to nobody else", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      expect(spec.mass.slide !== undefined, id).toBe(id === "p3");
    }
  });
});
