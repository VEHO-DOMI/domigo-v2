// PB-C1 · the composition engine's pure brains: the layer compositor
// (doc 36 §1), the carved mass (§2), cover-fit (§3) and the letter glyphs.
// Everything the renderer places is planned here, so everything the renderer
// places can be proven WITHOUT a browser — which is the point: a WebGL canvas
// cannot be read back (Build-D banked that false negative), so composition is
// verified by arithmetic over the plan, not by sampling the screen.
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { CH01_COMPOSITION, HERO_EDGE_KEY_SPLIT, MID_FAR_ALPHA, type MassKit, compositionFor, compositionStems, heroEdgeFor, massStems, nearPlaneTint } from "./composition.ts";
import { K_X, K_Y, PLANE_DEPTH, coverBox, coverFit, coversAxis, planLayers, planeCovers, travelBox, visibleWindow } from "./layers.ts";
import {
  CRUST_H,
  CRUST_LIP,
  CRUST_TINTS,
  FADE_DEPTH,
  EDGE_W,
  EDGE_OUT,
  MAX_PLATFORM_CELLS,
  MIN_GRID_LOCK_DISTANCE,
  MIN_PAINT_PERIOD_CELLS,
  NEAR_PLANE_KINDS,
  NO_METRONOME_MIN_PERIOD,
  RAMP_ROWS,
  BODY_DEEP_AT,
  BODY_DEEP_SHADE,
  BODY_HANDOVER_PAINTED,
  SEDIMENT_DEPTH,
  bandAt,
  depthBucketAt,
  depthShadeAt,
  depthTintAt,
  type MassPiece,
  paintScaleOf,
  tileAnchorFor,
  tileScaleFor,
  claimedPlatformCells,
  crustGrain,
  crustRuns,
  undersideRuns,
  floatingPlatformRuns,
  ledgeGrain,
  ledgeLips,
  massGrain,
  nakedFills,
  PLAT_SHADOW,
  planMass,
  planPlatformShadows,
  shortestPeriod,
  surfaceSignature,
  slideRuns,
} from "./mass.ts";
import { letterGlyphs } from "./letters.ts";
import { LOGICAL_H, LOGICAL_W, TILE, mixMultiply } from "./paint.ts";

const kit: MassKit = {
  crust: ["crust_a", "crust_b"],
  crustCapL: "cap_l",
  crustCapR: "cap_r",
  body: ["body_a", "body_b"],
  fade: ["fade"],
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
/** the AF cap aspect: a 512×212 band cell — caps are 2.4× as wide as tall */
// The shipped AF geometry: the walk course and its end caps are cut from ONE
// band sheet (crust_p1_a and crust_p1_cap_l are both 512×212), everything else
// is a 512² cell. The course's own ratio is what the painted-scale law reads,
// so a fixture that called it square would let the law pass on a lie.
const afSrc = (stem: string): { w: number; h: number } | null =>
  stem.startsWith("cap") || stem.startsWith("crust") ? { w: 512, h: 212 } : { w: 512, h: 512 };

describe("cover-fit (doc 36 §3) — the p4 cream-void law", () => {
  it("models the RENDERER's parallax window, not an invented one", () => {
    // measured in the browser on p1: camX 0 → Phaser scrollX −352, so the far
    // shell at 0.25 sees [264, 616] — NOT [0, 352]. A model that assumes the
    // naive window passes its own audit while the page shows through.
    expect(K_X).toBe(LOGICAL_W); // RENDER_SCALE 3
    expect(visibleWindow(0, 0.25, LOGICAL_W, K_X)).toEqual({ lo: 264, hi: 616 });
    expect(visibleWindow(0, 1, LOGICAL_W, K_X)).toEqual({ lo: 0, hi: LOGICAL_W });
  });

  it("covers the camera's window at BOTH extremes", () => {
    // p4's shape: 36 tiles wide, 20 tall — the level that showed the void
    const worldW = 36 * TILE;
    const worldH = 20 * TILE;
    const box = coverFit({ w: 2048, h: 1152 }, worldW, worldH, 0.12, 0.06);
    const { maxCamX, maxCamY } = travelBox(worldW, worldH);
    expect(coversAxis(box.x, box.x + box.w, 0.12, LOGICAL_W, maxCamX, K_X)).toBe(true);
    expect(coversAxis(box.y, box.y + box.h, 0.06, LOGICAL_H, maxCamY, K_Y)).toBe(true);
  });

  it("fits the plane's VISIBLE ENVELOPE, not the world's bounds", () => {
    // a slow plane is only ever seen through a narrow band; sizing it to the
    // world instead makes it oversized and pushes its painted content out of
    // frame (PK-C2 found p1's window bay above the top of the screen)
    const worldW = 64 * TILE;
    const worldH = 26 * TILE;
    const { maxCamY } = travelBox(worldW, worldH);
    const box = coverBox(worldW, worldH, 0.25, 0.12);
    const seen = visibleWindow(maxCamY, 0.12, LOGICAL_H, K_Y).hi - visibleWindow(0, 0.12, LOGICAL_H, K_Y).lo;
    expect(box.h).toBeLessThan(worldH); // NOT stretched to the world box
    expect(box.h).toBeCloseTo(seen, 5); // exactly the window it is seen through
    // and the far shell's pieces inherit that height, so the painted segment
    // maps its full artwork into the band the camera actually shows
    const l1 = planLayers(CH01_COMPOSITION.p3!, worldW, worldH, () => ({ w: 1024, h: 1260 }))
      .filter((q) => q.plane === "L1");
    expect(l1[0]!.h).toBeCloseTo(box.h, 5);
  });

  it("holds for every real ch01 phase geometry, at every plane's parallax", () => {
    // p1 64×22 · p2 72×24 · p3 64×26 · p4 36×20 · p9 44×20 (the live grids)
    const shapes = [[64, 22], [72, 24], [64, 26], [36, 20], [44, 20]] as const;
    for (const [cols, rows] of shapes) {
      const worldW = cols * TILE;
      const worldH = rows * TILE;
      const { maxCamX, maxCamY } = travelBox(worldW, worldH);
      for (const p of [0.05, 0.12, 0.25, 0.5, 1.2]) {
        const box = coverFit({ w: 2048, h: 1152 }, worldW, worldH, p, p / 2);
        expect(coversAxis(box.x, box.x + box.w, p, LOGICAL_W, maxCamX, K_X), `${cols}×${rows} @${p} x`).toBe(true);
        expect(coversAxis(box.y, box.y + box.h, p / 2, LOGICAL_H, maxCamY, K_Y), `${cols}×${rows} @${p} y`).toBe(true);
      }
    }
  });

  it("scales UP a source too small to cover, never letterboxes it", () => {
    const box = coverFit({ w: 320, h: 180 }, 64 * TILE, 22 * TILE, 0.25, 0.12);
    expect(box.w).toBeGreaterThan(320);
    expect(coversAxis(box.x, box.x + box.w, 0.25, LOGICAL_W, travelBox(64 * TILE, 22 * TILE).maxCamX, K_X)).toBe(true);
  });
});

describe("the five planes (doc 36 §1)", () => {
  const worldW = 64 * TILE;
  const worldH = 22 * TILE;

  it("plans L0 + L1 + L2 for a manifest phase", () => {
    const pieces = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, src512);
    expect(pieces.filter((p) => p.plane === "L0")).toHaveLength(1);
    expect(pieces.filter((p) => p.plane === "L1").length).toBeGreaterThan(0);
    expect(pieces.filter((p) => p.plane === "L2")).toHaveLength(1);
    // L4 is BUILT but unwired: Batch AF commissions no foreground art (F-9),
    // and shipping a stamped placeholder in front of the player is worse than
    // shipping no foreground at all.
    expect(pieces.filter((p) => p.plane === "L4")).toHaveLength(0);
  });

  it("holds the parallax ramp 0.05 → 0.25 → 0.5 → 1", () => {
    const pieces = planLayers(CH01_COMPOSITION.p1!, worldW, worldH, src512);
    const of = (plane: string): number => pieces.find((p) => p.plane === plane)?.parallax ?? -1;
    expect(of("L0")).toBeCloseTo(0.05);
    expect(of("L1")).toBeCloseTo(0.25);
    expect(of("L2")).toBeCloseTo(0.5);
  });

  it("still PLANS a foreground plane the moment one is declared", () => {
    const withFg = {
      ...CH01_COMPOSITION.p1!,
      fg: { segments: ["fg"], loop: true, height: 26, bottom: "floor" as const, lift: 22, parallax: 1.2, parallaxY: 1.02 },
    };
    const fg = planLayers(withFg, worldW, worldH, src512).filter((p) => p.plane === "L4");
    expect(fg).toHaveLength(1);
    expect(fg[0]!.parallax).toBeGreaterThanOrEqual(1.15);
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

  it("puts a crust on every exposed top, one course thick, with no gap and no overlap", () => {
    // PK-R6 · H1: a run is now laid in ALTERNATING SEGMENTS (CRUST_SEGMENT_CELLS)
    // so the floor stops looping one 41-px course under the player for a whole
    // level. Counting pieces would therefore only test the segment table; what
    // the law actually says is that the exposed tops are COVERED — exactly once,
    // edge to edge — so that is what this asserts.
    const p = planMass(grid, kit, afSrc);
    const crusts = p.filter((q) => q.kind === "crust");
    expect(crusts.length).toBeGreaterThanOrEqual(2); // at least the two ground runs
    for (const q of crusts) {
      expect(q.y).toBeCloseTo(3 * TILE - CRUST_LIP, 5);
      expect(q.h).toBe(CRUST_H);
    }
    // every exposed-top cell is crusted once and only once
    const cover = new Map<number, number>();
    for (const q of crusts) {
      for (let k = 0; k < Math.round(q.w / TILE); k++) cover.set(q.c + k, (cover.get(q.c + k) ?? 0) + 1);
    }
    for (let c = 0; c < 20; c++) {
      const exposed = c < 6 || c >= 14; // the two ground runs of this fixture
      expect(cover.get(c) ?? 0, `column ${c}`).toBe(exposed ? 1 : 0);
    }
    // …and the segments actually alternate the painted variants
    expect(new Set(crusts.map((q) => q.stem)).size).toBe(kit.crust.length);
  });

  it("laps the caps INWARD so the painted end lands on the run's own edge", () => {
    // the AF caps are painted as SEGMENT ENDS (a rounded end plus a stretch of
    // the same course), not outboard bookends: the cap's OUTER edge must sit
    // exactly on the run's outer edge, with the rest overlapping the loop.
    const p = planMass(grid, kit, afSrc);
    // the LEFT run touches the world edge, so only its right end is capped;
    // the RIGHT run is the mirror case. PK-R6 · H1: a run is now several crust
    // SEGMENTS, so the run's extent is read off all of them — a cap belongs to
    // the RUN, never to whichever segment happens to end it.
    const crusts = p.filter((q) => q.kind === "crust");
    const leftEnd = Math.max(...crusts.filter((q) => q.c < 6).map((q) => q.x + q.w));
    const rightStart = Math.min(...crusts.filter((q) => q.c >= 14).map((q) => q.x));
    const capR = p.find((q) => q.kind === "capR")!;
    const capL = p.find((q) => q.kind === "capL")!;
    expect(capR.x + capR.w).toBeCloseTo(leftEnd, 5);
    expect(capL.x).toBeCloseTo(rightStart, 5);
    expect(capL.w).toBeCloseTo(CRUST_H * (512 / 212), 3); // aspect-preserved
    expect(capL.depth).toBeGreaterThan(crusts[0]!.depth); // drawn over the loop
  });

  it("suppresses caps where a run runs into the world edge", () => {
    const p = planMass(grid, kit, afSrc);
    expect(p.some((q) => q.kind === "capL" && q.c === 0)).toBe(false);
    expect(p.some((q) => q.kind === "capR" && q.c === 19)).toBe(false);
  });

  // ── R5-W9 · F10 · D-639 · HIER STAND DAS GEGENTEIL ─────────────────────────
  // »omits caps entirely on a run too short to hold two of them« — das Verhalten
  // war als Gesetz gepinnt, und es IST der Befund: M1 hat nachgezaehlt, dass
  // 25 von 42 Kruste-Laeufen in ch01 unter der alten Schwelle liegen und
  // roh-quadratisch enden; ein blinder Leser nannte den Bestand unabhaengig
  // »wie eine Roehre, die mitten in der Laenge abgeschnitten wurde«. Das Tor
  // pinnt ab jetzt das reparierte Gesetz.
  it("gibt auch einem zu kurzen Lauf ZWEI Enden — gefenstert, nicht gequetscht (D-639)", () => {
    // Kokis Geometrie: drei Zellen (48 px), zu wenig fuer zwei volle 41-px-Kappen
    const stub = ["..........", "..........", "..###.....", "....#....."];
    const p = planMass(stub, kit, afSrc);
    const caps = p.filter((q) => q.kind === "capL" || q.kind === "capR");
    expect(p.some((q) => q.kind === "crust")).toBe(true);
    expect(caps.length, "beide Enden, nicht eines und nicht keines").toBe(2);
    // …und KEINE davon ist gequetscht: `w` bleibt die volle Kappenbreite, das
    // Verzogen-Gesetz (D-632) misst also weiter denselben Massstab
    for (const cap of caps) expect(cap.w).toBeCloseTo(CRUST_H * (512 / 212), 3);
    // gefenstert wird auf die Haelfte des Laufs, von aussen nach innen
    const links = caps.find((q) => q.kind === "capL")!;
    const rechts = caps.find((q) => q.kind === "capR")!;
    expect(links.crop?.from).toBe("left");
    expect(rechts.crop?.from).toBe("right");
    expect(links.crop!.fw * links.w).toBeCloseTo(48 / 2, 5);
  });

  it("laesst ein volles Kappenblatt ungefenstert, wenn der Lauf es traegt", () => {
    // ein 8-Zellen-Lauf (128 px) traegt zwei ganze Kappen — kein Fenster noetig,
    // und ein Fenster, das nichts abschneidet, waere eine Behauptung ohne Wirkung
    const lang = ["..........", "..........", ".########.", ".########."];
    const caps = planMass(lang, kit, afSrc).filter((q) => q.kind === "capL" || q.kind === "capR");
    expect(caps.length).toBe(2);
    for (const cap of caps) expect(cap.crop).toBeUndefined();
  });

  it("bleibt unter dem Splitter-Boden ohne Kappe (CAP_MIN_PX)", () => {
    // ein Lauf von 8 px zeigte je Seite 4 px Kappe — das ist kein Ende mehr
    const winzig = ["..........", "..........", "..#.......", "..#......."];
    const caps = planMass(winzig, kit, afSrc).filter((q) => q.kind === "capL" || q.kind === "capR");
    expect(caps.length, "16 px Lauf ⇒ 8 px je Seite, das traegt gerade noch").toBe(2);
  });

  it("ramps the interior body → fade → sediment with depth", () => {
    const p = planMass(grid, kit);
    const at = (c: number, r: number) => p.find((q) => ["body", "fade", "sediment"].includes(q.kind) && q.r === r && q.x <= c * TILE && q.x + q.w > c * TILE);
    expect(at(0, 3)?.kind).toBe("body"); // depth 0
    expect(at(0, 5)?.kind).toBe("body"); // depth 2
    // …and deep enough to reach both changes of paper (the shipped grids are
    // 20-26 rows; this fixture is 7, so the bands need their own column)
    const deep = ["..........", ...Array.from({ length: SEDIMENT_DEPTH + 2 }, () => "##########")];
    const col = planMass(deep, kit).filter((q) => ["body", "fade", "sediment"].includes(q.kind));
    const kindAtRow = (r: number) => col.find((q) => q.r === r)?.kind;
    expect(kindAtRow(1)).toBe("body");
    expect(kindAtRow(1 + FADE_DEPTH)).toBe("fade");
    expect(kindAtRow(1 + SEDIMENT_DEPTH)).toBe("sediment");
  });

  // ── R5-W1 · A1 · THE DEPTH LAW ────────────────────────────────────────────
  // The old ramp gave the middle sheet ONE row, so terrain fell 41 points of
  // luminance in two cells and everything past the fourth row was the same
  // near-black: 48 % of the chapter's interior cells, measured over the shipped
  // grids. What the law promises now is not a set of band boundaries — those are
  // tuning — but that the light falls SMOOTHLY and never reaches a hole.
  describe("the depth law (R5-W1 · A1 — Koki's »schwarze Löcher«)", () => {
    // measured mean luminance of the shipped sheets; the ramp exists to make the
    // DRAWN values continuous across the two places the paper changes
    // …and R5-N3 · A4 adds a second kit to the same law. p1 now draws its OWN
    // painted paper, including a deep body row, so the ramp has to hold for two
    // different sets of measured values — a law that only worked for the sheets
    // it was tuned on would be a coincidence, not a law.
    const ART_LUM = { body: 46.2, bodyDeep: null, fade: 16.6, sediment: 4.8 } as const;
    const P1_LUM = { body: 46.01, bodyDeep: 30.30, fade: 13.84, sediment: 4.8 } as const;
    const lumOfTint = (t: number): number =>
      (((t >> 16) & 255) * 0.2126 + ((t >> 8) & 255) * 0.7152 + (t & 255) * 0.0722) / 255;
    /** what the child actually sees: painted value × the multiply laid over it */
    const drawnWith = (art: { body: number; bodyDeep: number | null; fade: number; sediment: number }) =>
      (d: number): number => {
        const painted = art.bodyDeep !== null;
        const H = painted ? BODY_HANDOVER_PAINTED : undefined;
        const band = bandAt(d);
        if (band !== "body") return art[band] * depthShadeAt(d, H);
        const deep = painted && d >= BODY_DEEP_AT;
        const pigment = deep && art.bodyDeep !== null ? art.bodyDeep : art.body;
        // the deep row's own darkness is divided back out of the multiply
        const shade = deep ? Math.min(1, depthShadeAt(d, H) / BODY_DEEP_SHADE) : depthShadeAt(d, H);
        return pigment * shade;
      };
    const drawnAt = drawnWith(ART_LUM);
    const KITS = [["the shared kit", ART_LUM], ["p1's painted kit", P1_LUM]] as const;

    it("never brightens, and never lifts a surface cell", () => {
      expect(depthShadeAt(0)).toBe(1);
      expect(depthTintAt(0)).toBe(0xffffff);
      for (let d = 1; d < 30; d++) expect(depthShadeAt(d)).toBeLessThanOrEqual(1);
    });

    it.each(KITS)("falls MONOTONICALLY through both changes of paper — no cliff, no step back up (%s)", (_name, art) => {
      const drawn = drawnWith(art);
      // 0.01 rather than 0: ART_LUM/P1_LUM are MEASUREMENTS of the shipped
      // sheets, carried to two decimals. A painted kit's handover is derived
      // from them, so the last body row lands on the fade paper to within a few
      // ten-thousandths of a point — equality beyond the inputs' own precision
      // is noise, not brightening.
      for (let d = 1; d < 30; d++) {
        expect(drawn(d)).toBeLessThanOrEqual(drawn(d - 1) + 0.01);
      }
    });

    it.each(KITS)("closes the two cliffs the old ramp left at the band joins (%s)", (_name, art) => {
      // the joins are where a hard edge would show; both used to be enormous
      const drawn = drawnWith(art);
      const joinA = drawn(FADE_DEPTH - 1) - drawn(FADE_DEPTH);
      const joinB = drawn(SEDIMENT_DEPTH - 1) - drawn(SEDIMENT_DEPTH);
      expect(joinA).toBeLessThan(10); // was 46.2 → 16.6 = 29.6 points in one row
      expect(joinB).toBeLessThan(5); //  was 16.6 →  4.8 = 11.8 points in one row
      expect(joinA).toBeGreaterThanOrEqual(-0.01);
      expect(joinB).toBeGreaterThanOrEqual(-0.01);
    });

    it("swapping in the painted deep row does NOT double-darken the band", () => {
      // The point of BODY_DEEP_SHADE and BODY_HANDOVER_PAINTED together: the
      // darkness moves into PIGMENT without the multiply darkening it a second
      // time. Drop either and depth 3 falls off a cliff — with the division gone
      // it would land near 46.01 × 0.659 × 0.52 = 15.8 while its neighbour sits
      // at 24.6. So the law is that the body band falls in EVEN steps.
      const painted = drawnWith(P1_LUM);
      const steps: number[] = [];
      for (let d = 1; d < FADE_DEPTH; d++) steps.push(painted(d - 1) - painted(d));
      const biggest = Math.max(...steps);
      const smallest = Math.min(...steps);
      expect(smallest).toBeGreaterThan(0);
      expect(biggest / smallest).toBeLessThan(1.35);
      // …and it arrives exactly on the fade paper it hands over to
      expect(Math.abs(painted(FADE_DEPTH - 1) - P1_LUM.fade)).toBeLessThan(0.01);
    });

    it.each(KITS)("keeps the deepest paper READABLE — the darkest dark is still a colour (%s)", (_name, art) => {
      // "a hole" is what an interior under ~6 % luminance reads as. Nothing the
      // ramp can reach may fall there, at any depth, ever.
      const drawn = drawnWith(art);
      for (let d = 0; d < 60; d++) expect(drawn(d)).toBeGreaterThan(3.5);
      // …and it stays a hue rather than going grey: blue keeps the most
      const deep = depthTintAt(SEDIMENT_DEPTH + RAMP_ROWS);
      expect(deep & 0xff).toBeGreaterThan((deep >> 16) & 0xff);
    });

    it("SCALES the no-metronome lights instead of replacing them", () => {
      // the five lights are what audit 6 counts as variety. A ramp that flattened
      // them would turn a long deep floor back into wallpaper while looking, to
      // the eye, exactly like a fix — so this is the coupling that must hold.
      for (const d of [0, 3, 4, 8, 9, SEDIMENT_DEPTH + RAMP_ROWS]) {
        const composed = new Set(CRUST_TINTS.map((t) => mixMultiply(t, depthTintAt(d))));
        expect(composed.size).toBe(CRUST_TINTS.length);
      }
    });

    it("buckets past the ramp, so one deep mass stays ONE piece", () => {
      expect(depthBucketAt(SEDIMENT_DEPTH + RAMP_ROWS + 40)).toBe(depthBucketAt(SEDIMENT_DEPTH + RAMP_ROWS));
      expect(depthBucketAt(2)).toBe(2);
    });

    it("stops the walk at the world's ceiling — outside the grid is NOT deeper mass", () => {
      // glyphAt calls everything outside the grid solid, so the depth walk used
      // to run past row 0, hit its own guard at 64 and answer "ink-dark
      // sediment". Every phase's ceiling row is `#` full width, so the top of
      // the world was drawn as a hard black bar — 64 cells in p1, all 44 of p9.
      const ceiling = ["########", "........", "........", "########"];
      const p = planMass(ceiling, kit);
      const top = p.find((q) => ["body", "fade", "sediment"].includes(q.kind) && q.r === 0);
      expect(top?.kind).toBe("body");
      // …and it wears the room's full light, because it IS the exposed face
      expect(lumOfTint(top?.tint ?? 0xffffff)).toBeGreaterThan(0.9);
    });
  });

  // ── R5-W1 · A1 · THE PAINTED-SCALE LAW ────────────────────────────────────
  describe("the painted-scale law (Koki's »Lego, das nicht zusammenpasst«)", () => {
    const SRC = { w: 512, h: 512 };
    const TRIM_KINDS = ["edgeL", "edgeR", "cornerBL", "cornerBR", "inCornerL", "inCornerR"];
    const lumOfTintTop = (t: number): number =>
      (((t >> 16) & 255) * 0.2126 + ((t >> 8) & 255) * 0.7152 + (t & 255) * 0.0722) / 255;

    it("draws the interior at the WALK COURSE's scale, not the cell's", () => {
      // the bug in one line: a 512² painting whose scale came from a 16 px piece
      const p = planMass(grid, kit, afSrc).filter((q) => q.kind === "body");
      expect(p.length).toBeGreaterThan(0);
      for (const q of p) {
        expect(tileScaleFor(q, SRC).y).toBeCloseTo(paintScaleOf(kit, afSrc), 6);
        expect(tileScaleFor(q, SRC).x).toBeCloseTo(paintScaleOf(kit, afSrc), 6);
      }
    });

    // R5-W3 · A5 · R3 · THIS TEST USED TO ASSERT THE DEFECT.
    //
    // It read `expect(512 * tileScaleFor(q, SRC).x).toBeCloseTo(EDGE_W)` — i.e.
    // the WHOLE painting squeezed across 8 px — and called it „their own width",
    // under a planner comment promising „page-edges the same physical size as
    // the books they run beside". Those two sentences cannot both be true. The
    // shipped trims drew 0.0323 world px per source px across against 0.0802
    // down: a 2.49× horizontal squash, asserted by its own unit test and skipped
    // by audit 10 because declaring the override was what bought the exemption.
    //
    // The trim shows a WINDOW of its texture at the world's scale instead.
    it("gives the carved trims the painting's scale on BOTH axes, and a window", () => {
      const trims = planMass(grid, kit, afSrc).filter((q) => q.kind === "edgeL" || q.kind === "edgeR");
      expect(trims.length).toBeGreaterThan(0);
      const want = paintScaleOf(kit, afSrc);
      for (const q of trims) {
        expect(q.tile).toBe(true);
        expect(tileScaleFor(q, SRC).y).toBeCloseTo(want, 6);
        // …and across, which is the whole repair
        expect(tileScaleFor(q, SRC).x).toBeCloseTo(want, 6);
        // the window is DECLARED, and it is exactly the source that fits
        expect(q.srcW).toBeDefined();
        expect((q.srcW ?? 0) * want).toBeCloseTo(q.w, 6);
      }
    });

    it("…and the squash it replaced can no longer be expressed", () => {
      // the old law, run against the new planner: a 512-px sheet across an 8-px
      // trim would mean a scale of 0.0156, and nothing draws at that any more
      const q = planMass(grid, kit, afSrc).find((p) => p.kind === "edgeL");
      expect(q).toBeDefined();
      const old = EDGE_W / 512;
      expect(tileScaleFor(q as MassPiece, SRC).x).not.toBeCloseTo(old, 4);
    });

    it("leaves the room's own paper showing down a ONE-CELL column", () => {
      // both faces exposed ⇒ two full-width trims tile the whole cell and the
      // book material never appears; the pillar stops being terrain and becomes
      // a bar. Named independently by two blind reviewers.
      const pillar = ["..#...", "..#...", "..#...", "######"];
      const trims = planMass(pillar, kit, afSrc).filter((q) => (q.kind === "edgeL" || q.kind === "edgeR") && q.r === 1);
      expect(trims).toHaveLength(2);
      const covered = trims.reduce((s, q) => s + q.w, 0);
      expect(covered).toBeLessThan(TILE); // …paper survives in the middle
      // …and a normal wall keeps its full trim
      const wall = ["..###.", "..###.", "..###.", "######"];
      const wide = planMass(wall, kit, afSrc).filter((q) => q.kind === "edgeL" && q.r === 1);
      expect(wide[0]?.w).toBe(EDGE_W);
    });

    it("lays every trim BACK from the room's full light", () => {
      // measured: the trim art is 71.5 % mean luminance against a 46.2 % body.
      // Unshaded that is a rail down the side of every mass, not a carved edge.
      const trims = planMass(grid, kit, afSrc).filter((q) => TRIM_KINDS.includes(q.kind));
      expect(trims.length).toBeGreaterThan(0);
      for (const q of trims) expect(lumOfTintTop(q.tint ?? 0xffffff)).toBeLessThan(0.8);
    });

    it("never lets the painting repeat on the cell grid", () => {
      // 2 cells is the floor; landing ON a whole number of cells is the SAME
      // defect one octave up, and no existing audit could see it
      const period = (512 * paintScaleOf(kit, afSrc)) / TILE;
      expect(period).toBeGreaterThanOrEqual(MIN_PAINT_PERIOD_CELLS);
      for (let n = 1; n <= 8; n++) expect(Math.abs(period - n)).toBeGreaterThan(MIN_GRID_LOCK_DISTANCE);
    });

    it("calls the old rule out: at the cell's own scale the period IS the grid", () => {
      // the tamper — a piece with no srcScale falls back to the shipped defect
      const legacy = { kind: "body", stem: "body_a", c: 0, r: 0, x: 0, y: 0, w: TILE, h: TILE, tile: true, depth: 1 } as const;
      expect((512 * tileScaleFor(legacy, SRC).y) / TILE).toBe(1);
    });

    it("anchors a CONTINUUM on both axes and a COURSE on one", () => {
      // a column of interior pieces must draw successive slices of one painting…
      const body = planMass(grid, kit, afSrc).filter((q) => q.kind === "body");
      const s = paintScaleOf(kit, afSrc);
      const scale = { x: s, y: s };
      for (const q of body) expect(tileAnchorFor(q, scale).y).toBeCloseTo(q.y / s, 6);
      // …while a one-course-tall crust must never wrap, at any row. Phaser
      // offsets by `tilePositionY mod sourceHeight`, so the old world anchor
      // shifted the board by (16r − 2) mod 17 — non-zero on sixteen rows in
      // seventeen, cutting the painted top lip off and re-attaching it under
      // the board's own underside, differently on every floor of the school.
      const crust = planMass(grid, kit, afSrc).filter((q) => q.kind === "crust");
      expect(crust.length).toBeGreaterThan(0);
      for (const q of crust) expect(tileAnchorFor(q, scale).y).toBe(0);
    });
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

  // ── R5-W7 · A8 · THE UNDERSIDE BAND (D-27) ─────────────────────────────────
  // The sixth face. Two halves, and the FIRST one is the load-bearing one: with
  // no sheet declared — which is every kit on `main` — the hook must produce
  // nothing at all, or it is the placeholder SPEC §9.4 forbids wearing a new name.
  describe("the underside band (R5-W7 · A8 · D-27)", () => {
    // 5 cells wide ⇒ an overhang, not a platform object (see the corner test)
    const thinLedge = ["........", ".#####..", "........", "########"];
    const thickLedge = ["........", ".#####..", ".#####..", "........", "########"];
    const longLedge = [".................", ".###############.", ".................", "#################"];
    const withSheet: MassKit = { ...kit, edgeD: ["ed_l", "ed_r"] };
    const lumOfTint = (t: number): number =>
      (((t >> 16) & 255) * 0.2126 + ((t >> 8) & 255) * 0.7152 + (t & 255) * 0.0722) / 255;

    it("plans NOTHING without a sheet — and the geometry is there, so that is the sheet's absence and not a missing hook", () => {
      // both directions in one test on purpose: if `undersideRuns` found nothing
      // either, this test would pass on a planner that had simply been given a
      // grid with no undersides, and would prove nothing about the guard.
      for (const g of [thinLedge, thickLedge, longLedge]) {
        expect(undersideRuns(g).length).toBeGreaterThan(0);
        expect(planMass(g, kit, afSrc).filter((q) => q.kind === "edgeD")).toHaveLength(0);
      }
    });

    it("leaves the rest of the plan untouched without a sheet — piece for piece", () => {
      // the display-list proof in miniature: adding an UNDECLARED optional field
      // may not move one number anywhere else in the plan.
      const bare: MassKit = { ...kit };
      for (const g of [thinLedge, thickLedge, longLedge, grid]) {
        expect(JSON.stringify(planMass(g, kit, afSrc))).toBe(JSON.stringify(planMass(g, bare, afSrc)));
      }
    });

    it("bands every exposed bottom once the sheet is declared", () => {
      const p = planMass(thickLedge, withSheet, afSrc).filter((q) => q.kind === "edgeD");
      expect(p.length).toBeGreaterThan(0);
      // the run is row 2, columns 1…5 — covered exactly once, edge to edge
      const covered = new Set<number>();
      for (const q of p) {
        expect(q.r).toBe(2);
        for (let x = q.x; x < q.x + q.w; x += TILE) covered.add(x / TILE);
      }
      expect([...covered].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
      expect(p.reduce((s, q) => s + q.w, 0)).toBe(5 * TILE);
    });

    it("sits 2 px proud of the mass and the rest inside it — the side trims, turned 90°", () => {
      const q = planMass(thickLedge, withSheet, afSrc).find((x) => x.kind === "edgeD");
      expect(q).toBeDefined();
      expect(q?.h).toBe(EDGE_W);
      expect(q?.y).toBeCloseTo(2 * TILE + TILE + EDGE_OUT - EDGE_W, 6);
      // …and its bottom edge really is EDGE_OUT below the cell it hangs from
      expect((q?.y ?? 0) + (q?.h ?? 0)).toBeCloseTo(3 * TILE + EDGE_OUT, 6);
    });

    it("narrows on a ledge one cell tall, for the reason the side trims narrow on a column one cell wide", () => {
      // crust above, band below: at full depth no book would be left to see
      // between them. Same arithmetic as `trimW`, same 0.55.
      const thin = planMass(thinLedge, withSheet, afSrc).filter((q) => q.kind === "edgeD");
      expect(thin.length).toBeGreaterThan(0);
      for (const q of thin) expect(q.h).toBeCloseTo(EDGE_W * 0.55, 6);
      // and the thick ledge does NOT narrow — otherwise the rule is a constant
      for (const q of planMass(thickLedge, withSheet, afSrc).filter((q) => q.kind === "edgeD")) {
        expect(q.h).toBe(EDGE_W);
      }
    });

    it("never mixes the two heights inside one piece — one tileSprite carries one height", () => {
      // a ledge whose left half is one cell tall and whose right half is two:
      // the run has to SPLIT there, not average
      const mixed = ["........", "..####..", "....##..", "........", "########"];
      const runs = undersideRuns(mixed);
      expect(runs.length).toBeGreaterThan(1);
      for (const q of planMass(mixed, withSheet, afSrc).filter((x) => x.kind === "edgeD")) {
        expect([EDGE_W, EDGE_W * 0.55]).toContain(q.h);
      }
    });

    it("is a BAND, not wallpaper: a long run is segmented and alternates its variants", () => {
      // measured on ch01 before this was built: 24 runs, 352 cells, longest 64
      // (1024 world px). One tileSprite of one variant over that span is the
      // wallpaper the round-1 critique named on the floor.
      const p = planMass(longLedge, withSheet, afSrc).filter((q) => q.kind === "edgeD");
      expect(p.length).toBeGreaterThan(1);
      expect(new Set(p.map((q) => q.stem)).size).toBe(2);
      for (const q of p) expect(["ed_l", "ed_r"]).toContain(q.stem);
    });

    it("is pinned horizontally and never vertically — its drawn height is not its source height", () => {
      // the crust's lesson (`MassPiece.tileAnchor`): Phaser offsets by
      // `tilePositionY mod sourceHeight`, so a band pinned in world space would
      // be sliced by a different amount on every floor of the school.
      const s = paintScaleOf(withSheet, afSrc);
      for (const q of planMass(thickLedge, withSheet, afSrc).filter((x) => x.kind === "edgeD")) {
        expect(q.tile).toBe(true);
        expect(q.tileAnchor).toBe("x");
        expect(q.srcW).toBeUndefined(); // a window is what a one-cell STRIP wants
        expect(tileAnchorFor(q, { x: s, y: s }).y).toBe(0);
      }
    });

    it("wears the lay-back and the depth ramp, like its five siblings", () => {
      for (const q of planMass(thickLedge, withSheet, afSrc).filter((x) => x.kind === "edgeD")) {
        expect(lumOfTint(q.tint ?? 0xffffff)).toBeLessThan(0.8);
      }
    });

    it("never bands the world's own floor — outside the grid is solid", () => {
      // the bottom row of every phase has no air under it, so it grows no band
      const p = planMass(thickLedge, withSheet, afSrc).filter((q) => q.kind === "edgeD");
      expect(p.some((q) => q.r === thickLedge.length - 1)).toBe(false);
    });

    it("adds its stems to the art gate's list only when it has them", () => {
      const bare = massStems(kit);
      const armed = massStems(withSheet);
      expect(bare).not.toContain("ed_l");
      expect(armed).toContain("ed_l");
      expect(armed).toContain("ed_r");
      expect(armed.length).toBe(bare.length + 2);
    });
  });

  it("never trims against the world edge — outside the grid is solid", () => {
    const p = planMass(grid, kit);
    expect(p.some((q) => q.kind === "cornerBR" && q.r === 6)).toBe(false);
    expect(p.some((q) => q.kind === "edgeL" && q.c === 0)).toBe(false);
    // the browser caught this one: glyphAt() calls outside-the-grid SOLID, so
    // an unguarded diagonal probe grew a phantom inner corner on every ground
    // run that starts at column 0
    expect(p.some((q) => q.kind === "inCornerL" && q.c === 0)).toBe(false);
    expect(p.some((q) => q.kind === "inCornerR" && q.c === 19)).toBe(false);
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

  it("assembles the z run from TRUE-45° cells: top, mids, foot, each on its own wedge", () => {
    // AF2 re-authored the slide as per-cell modules drawn corner-to-corner, so
    // the grid assembles the chute — no rotation, no along-diagonal stepping
    const slideGrid = ["......", ".z....", "..z...", "...z..", "....z.", "######"];
    expect(slideRuns(slideGrid)).toEqual([{ c: 1, r: 1, n: 4 }]);
    const p = planMass(slideGrid, kit, afSrc);
    expect(p.filter((q) => q.kind === "slideUnder")).toHaveLength(4);
    const surface = p.filter((q) => q.kind.startsWith("slide") && q.kind !== "slideUnder");
    expect(surface.map((q) => q.kind)).toEqual(["slideTop", "slideMid", "slideMid", "slideFoot"]);
    for (const m of surface) {
      expect(m.rot).toBeUndefined(); // the art carries the 45°, not a transform
      expect(m.w).toBe(TILE);
      expect(m.h).toBe(TILE);
      expect(m.x).toBe(m.c * TILE); // cell-exact, so the run cannot drift
      expect(m.y).toBe(m.r * TILE);
    }
    // every module sits on its own cell of the diagonal
    expect(surface.map((q) => `${q.c},${q.r}`)).toEqual(["1,1", "2,2", "3,3", "4,4"]);
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

describe("the no-metronome law (round-1 critique, finding 1 — critical)", () => {
  /** one long, uninterrupted hall floor — the shape the critique was reading.
   *  Deliberately longer than the retired model's own repeat (50 cells), or the
   *  „why" test below could not see the beat it is about. */
  const hall = ["".padEnd(120, "."), "".padEnd(120, "."), "".padEnd(120, "#")];

  /** the fingerprints of one surface of the hall, as the audit reads them */
  const sigOf = (kinds: Parameters<typeof surfaceSignature>[1], grain: ReturnType<typeof crustGrain>): string[] =>
    surfaceSignature(planMass(hall, kit, afSrc), kinds, grain).get("0,2") ?? [];

  it("lays a long run APERIODICALLY: value and grain, not just two variants", () => {
    const sig = sigOf(["crust"], crustGrain(hall));
    expect(sig).toHaveLength(120);
    expect(shortestPeriod(sig)).toBe(120); // never repeats at all, at any period
  });

  it("gives the MASS below the course the same treatment", () => {
    // the browser proof of p1: the walk course was already varying while the
    // mass under it — four times as much of the frame — was ONE tileSprite
    // 656 px wide carrying one variant. That was the wallpaper.
    const sig = sigOf(["body", "fade", "sediment"], massGrain(hall));
    expect(sig).toHaveLength(120);
    expect(shortestPeriod(sig)).toBeGreaterThan(NO_METRONOME_MIN_PERIOD);
    expect(new Set(sig).size).toBeGreaterThanOrEqual(Math.ceil(120 / 5));
    // …and the two surfaces change segment on DIFFERENT columns, or their seams
    // would stack into one visible joint through the whole floor
    const seamAt = (s: string[]): number[] => s.map((v, i) => (v.split(":")[0] !== s[i - 1]?.split(":")[0] ? i : -1)).filter((i) => i > 0);
    const course = seamAt(sigOf(["crust"], []));
    const mass = seamAt(sig);
    expect(course.filter((i) => mass.includes(i)).length).toBeLessThan(course.length);
  });

  it("shows WHY the segment table alone was not enough", () => {
    // the retired state, reconstructed: variant alternation over the segment
    // table and nothing else. Its cycle is exactly 50 cells — 10 segments, the
    // point where the 5-long length table and the 2-long variant list line up
    // again — i.e. 800 px, so a child walking a hall meets the same floor twice.
    const sig = sigOf(["crust"], crustGrain(hall));
    expect(shortestPeriod(sig.map((s) => s.split(":")[0] ?? ""))).toBe(50);
    // value alone already breaks it, and grain breaks it independently
    expect(shortestPeriod(sig.map((s) => s.split(":")[1] ?? ""))).toBe(120);
    expect(shortestPeriod(sig.map((s) => s.split(":")[2] ?? ""))).toBeGreaterThan(NO_METRONOME_MIN_PERIOD);
  });

  it("gives every crust segment one of the declared lights, never a repaint", () => {
    const crusts = planMass(hall, kit, afSrc).filter((q) => q.kind === "crust");
    expect(crusts.length).toBeGreaterThan(4);
    for (const q of crusts) {
      expect(CRUST_TINTS, `${q.c},${q.r}`).toContain(q.tint);
      // near-white by law: these MULTIPLY the painted course, so a strong tint
      // would repaint the material instead of relighting it
      const r = ((q.tint ?? 0) >> 16) & 255;
      const g = ((q.tint ?? 0) >> 8) & 255;
      const b = (q.tint ?? 0) & 255;
      expect(Math.min(r, g, b)).toBeGreaterThanOrEqual(0xd0);
    }
    expect(new Set(crusts.map((q) => q.tint)).size).toBeGreaterThan(1);
  });

  it("scatters grain along the walk course and nowhere else", () => {
    const marks = crustGrain(hall);
    expect(marks.length).toBeGreaterThan(8);
    const surface = new Set(crustRuns(hall).map((r) => r.r));
    for (const m of marks) {
      expect(surface.has(m.r), `mark at row ${m.r}`).toBe(true);
      expect(m.x).toBeGreaterThanOrEqual(m.c * TILE - 0.001);
      expect(m.x + m.w).toBeLessThanOrEqual((m.c + 1) * TILE + 0.001);
      expect(m.y).toBeGreaterThanOrEqual(m.r * TILE - CRUST_LIP);
      expect(m.y + m.h).toBeLessThanOrEqual(m.r * TILE - CRUST_LIP + CRUST_H + 0.001);
      expect(m.alpha).toBeLessThan(0.2); // grain, never gravel
    }
    expect(crustGrain(hall)).toEqual(marks); // deterministic: no Math.random
  });

  it("keeps the mass patina inside the mass — never a smudge hanging in the air", () => {
    // A battery of shapes, not one: a single fixture proves nothing here, because
    // whether a mark exists in a boundary cell at all is decided by that cell's
    // own hash. (Found by tampering: with the spill guard removed, the first
    // fixture tried still passed — its edge cells happened to carry no mark.)
    const shapes = [
      ["........", ".#####..", ".#####..", "########"],
      ["........", "..##....", "........", "########"],
      ["#.......", "#.......", "#....#..", "########"],
      ["........", ".#......", ".#......", ".#......"],
      ["..####..", "..####..", "..#..#..", "..#..#.."],
      ["........", "#......#", "#......#", "########"],
      ["...#....", "...#....", "########", "########"],
      ["########", "########", "########", "########"],
    ];
    let checked = 0;
    for (const grid of shapes) {
      const cells = new Set<string>();
      for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < (grid[0]?.length ?? 0); c++) if (grid[r]![c] === "#") cells.add(`${c},${r}`);
      }
      for (const m of massGrain(grid)) {
        checked++;
        const c0 = Math.floor(m.x / TILE);
        const c1 = Math.floor((m.x + m.w - 0.001) / TILE);
        const r0 = Math.floor(m.y / TILE);
        const r1 = Math.floor((m.y + m.h - 0.001) / TILE);
        for (let c = c0; c <= c1; c++) {
          for (let r = r0; r <= r1; r++) {
            expect(cells.has(`${c},${r}`), `mark from ${m.c},${m.r} touches open air at ${c},${r}`).toBe(true);
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(40); // the battery has to actually draw marks
  });

  // ── PK-R6 · H2 · THE LEDGE (round-2 finding 5) ─────────────────────────────
  // „The floor band runs unbroken with no gap, drop-off or edge marking near
  // the character — no visual cue before the ground runs out."
  it("marks every end that hangs over a real fall, and only those", () => {
    //  0 ........
    //  1 ....##..   a two-cell shelf, air all round it (a platform object)
    //  2 ........
    //  3 ###..###   the floor, with a pit in the middle
    //  4 ###..###
    const grid = ["........", "....##..", "........", "###..###", "###..###"];
    const lips = ledgeLips(grid, claimedPlatformCells(grid));
    const at = (c: number, r: number, side: "l" | "r"): boolean =>
      lips.some((l) => l.c === c && l.r === r && l.side === side);
    expect(at(2, 3, "r")).toBe(true); // the near side of the pit
    expect(at(5, 3, "l")).toBe(true); // …and its far side
    expect(at(4, 1, "l")).toBe(true); // the shelf, both ends
    expect(at(5, 1, "r")).toBe(true);
    // the world's own outer edges are not ledges: outside the grid is solid
    expect(at(0, 3, "l")).toBe(false);
    expect(at(7, 3, "r")).toBe(false);
    // …and a single step down is NOT a drop, or every stair would cry wolf
    const stair = ["........", "..###...", "#####..."];
    expect(ledgeLips(stair).some((l) => l.r === 1 && l.side === "l")).toBe(false);
    expect(ledgeLips(stair).some((l) => l.r === 1 && l.side === "r")).toBe(true); // …but this end really falls
  });

  it("wears the boards pale toward a drop, brightest ON the lip", () => {
    const grid = ["........", "###..###", "###..###"];
    const marks = ledgeGrain(grid);
    expect(marks.length).toBeGreaterThan(4);
    expect(ledgeGrain(grid)).toEqual(marks); // deterministic: no Math.random
    const shine = marks.filter((m) => m.kind === "shine");
    // every mark sits on a surface row, inside the course's own band
    for (const m of marks) {
      expect(m.r).toBe(1);
      expect(m.y).toBeGreaterThanOrEqual(m.r * TILE - CRUST_LIP);
      expect(m.y + m.h).toBeLessThanOrEqual(m.r * TILE - CRUST_LIP + CRUST_H + 0.001);
      expect(m.alpha).toBeLessThan(0.3); // wear, never paint
    }
    // the cue GRADES: the board at the lip is brighter than the one behind it
    const lipMark = shine.find((m) => m.c === 2);
    const backMark = shine.find((m) => m.c === 1);
    expect(lipMark).toBeDefined();
    expect(backMark).toBeDefined();
    expect(lipMark!.alpha).toBeGreaterThan(backMark!.alpha);
    // TAMPER: a floor with nothing to fall off wears nothing at all
    expect(ledgeGrain(["........", "########", "########"])).toEqual([]);
  });

  it("never grains a platform's own top — the object draws its own", () => {
    const withLedge = ["........", "..##....", "........", "########"];
    const claimed = new Set(["2,1", "3,1"]);
    expect(crustGrain(withLedge, claimed).some((m) => m.r === 1)).toBe(false);
    expect(crustRuns(withLedge, claimed).some((r) => r.r === 1)).toBe(false);
  });

  it("calls a metronome a metronome (the audit's own tamper)", () => {
    expect(shortestPeriod(["a", "b", "a", "b", "a", "b"])).toBe(2);
    expect(shortestPeriod(["a", "b", "c", "d", "e"])).toBe(5); // no period at all
  });
});

describe("the per-zone platform palettes (round-1 critique, finding 8)", () => {
  it("gives every zone a palette that can cover 1-, 2-, 3- and 4-cell runs", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      const widths = new Set(spec.mass.platObjects.map((p) => p.cells));
      expect(widths.has(1), `${id} has no 1-cell object (a 3-cell run is 2+1)`).toBe(true);
      expect(widths.has(2), `${id} has no 2-cell object`).toBe(true);
    }
  });

  it("furnishes no two rooms out of the same box", () => {
    const seen = new Map<string, string>();
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      const fingerprint = [...spec.mass.platObjects.map((p) => p.stem)].sort().join("|");
      const twin = seen.get(fingerprint);
      expect(twin, `${id} and ${twin} draw the identical platform set`).toBeUndefined();
      seen.set(fingerprint, id);
    }
  });

  it("anchors every object by a deck inside its own art", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      for (const p of spec.mass.platObjects) {
        expect(p.deck ?? 0, `${id}/${p.stem}`).toBeGreaterThanOrEqual(0);
        expect(p.deck ?? 0, `${id}/${p.stem}`).toBeLessThan(1);
      }
    }
  });

  it("keeps two objects at a width where a phase's ledges are all that width", () => {
    // p9's twelve ledges are every one of them 2 cells wide: with a single
    // 2-cell object the seeded pick has nothing to alternate between and the
    // dream draws the same plank twelve times.
    const twoCell = CH01_COMPOSITION.p9!.mass.platObjects.filter((p) => p.cells === 2);
    expect(twoCell.length).toBeGreaterThanOrEqual(2);
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
    // PK-R6 · H2 (round-2 finding 12): the yard's bench went back to the hall it
    // was borrowed from; the sill it kept is the one this phase's own painted
    // wall implies (four arched windows), and it is what the kit names now.
    for (const want of ["crust_p3_a", "mass_body_a", "mass_sediment", "slide_mid", "ledge_windowsill", "l1_p3_a", "l2_p3"]) {
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

// ── PK-R6 · H2 · THE NEAREST PLANE (round-2 finding 7) ──────────────────────
// „Bookshelf-platform (foreground), locker band, and blurred foliage (midground)
// all sit within a narrow warm-midtone band … compare to the reference forest
// frame, which holds a true dark-silhouette-to-pale-sky value spread."
//
// Measured on the shipped hall: the floating platform objects average 49.3 %
// luminance against the L2 furniture band's 54.5 % — a 5-point step, which is
// nothing under a squint. The near plane is now laid in its own light. What is
// checkable here is the LAW rather than the pixels: it darkens, it cools, and it
// backs off in a dark room, because separation is the law and not darkness.
describe("R5-A3 · which plane is the NEAR plane (B1: no material separation in the sunny levels)", () => {
  it("pushes everything you can STAND ON", () => {
    for (const k of ["crust", "capL", "capR", "ramp", "platform"]) expect(NEAR_PLANE_KINDS.has(k)).toBe(true);
  });

  it("leaves the mass BELOW the standing line alone", () => {
    // body/fade/sediment already carry A1's depth ramp; pushing them too would
    // darken the depths back toward the holes that round removed, and they are
    // not the thing the child is asking a question about
    for (const k of ["body", "fade", "sediment"]) expect(NEAR_PLANE_KINDS.has(k)).toBe(false);
  });

  it("leaves the carved trims alone — they are the mass's edge, not its surface", () => {
    // R5-W7 · A8: `edgeD` joins the list rather than the set. The law's question
    // is „can I stand on this?", and the underside is the face over the child's
    // head — the one trim where pushing it forward would be actively wrong.
    for (const k of ["edgeL", "edgeR", "edgeD", "cornerBL", "cornerBR", "inCornerL", "inCornerR"]) {
      expect(NEAR_PLANE_KINDS.has(k)).toBe(false);
    }
  });
});

describe("PK-R6 · H2 · the near plane's own light", () => {
  const ch = (t: number, shift: number): number => (t >> shift) & 0xff;

  it("darkens the nearest standable plane — it is a multiply, never a lift", () => {
    for (const key of [88, 86, 30, 28]) {
      const t = nearPlaneTint(key);
      for (const shift of [16, 8, 0]) expect(ch(t, shift), `K=${key}`).toBeLessThan(255);
    }
  });

  // ── ★ R5-W7 · A8 · R194 · IT TAKES LIGHT, NOT COLOUR (D-270) ───────────────
  // What stood here was the exact opposite law: „cools it: red loses the most,
  // blue the least", asserting r < g < b. It was true of the code and wrong
  // about the picture — a multiply that scales three channels differently does
  // not cool a surface, it drains it (D-184: twelve of p1's 22.4 ΔS points came
  // from here), and P6 measured that drain as the grey wedge in Koki's frame
  // `07.29.42`. The replacement holds both halves of the ruling: the cast goes,
  // the push stays.
  it("takes LIGHT, not colour — one factor for all three channels", () => {
    for (const key of [0, 1, 30, 44, 88, 100, 400]) {
      const t = nearPlaneTint(key);
      expect(ch(t, 16), `K=${key} r vs g`).toBe(ch(t, 8));
      expect(ch(t, 8), `K=${key} g vs b`).toBe(ch(t, 0));
    }
  });

  it("keeps the push it always had — the purpose survives the repair", () => {
    // the separation was never carried by the cast: weighted as a luminance is
    // weighted, the old triple (1 − 1.15d, 1 − d, 1 − 0.6d) came to 1 − 0.9968·d
    // and the neutral one comes to 1 − d. At the law's full push that is 0.6412
    // against 0.6400 — three tenths of one level out of 255.
    const lum = (t: number): number =>
      (ch(t, 16) * 0.2126 + ch(t, 8) * 0.7152 + ch(t, 0) * 0.0722) / 255;
    const old = (key: number): number => {
      const d = Math.min(0.36, Math.max(0.1, 0.36 * (key / 88)));
      return (Math.round(255 * (1 - d * 1.15)) * 0.2126
        + Math.round(255 * (1 - d)) * 0.7152
        + Math.round(255 * (1 - d * 0.6)) * 0.0722) / 255;
    };
    for (const key of [30, 44, 88, 100]) {
      expect(Math.abs(lum(nearPlaneTint(key)) - old(key)), `K=${key}`).toBeLessThan(0.005);
    }
  });

  it("the tamper: the red-heavy factor is what this test would catch", () => {
    // a check that cannot fail is decoration. Reinstating the 1.15 on red — the
    // one number R194 removes — has to break the neutrality law above.
    const tampered = (key: number): number => {
      const d = Math.min(0.36, Math.max(0.1, 0.36 * (key / 88)));
      const r = Math.round(255 * (1 - d * 1.15));
      const g = Math.round(255 * (1 - d));
      const b = Math.round(255 * (1 - d * 0.6));
      return (r << 16) | (g << 8) | b;
    };
    const t = tampered(88);
    expect(ch(t, 16)).not.toBe(ch(t, 8));
    expect(ch(t, 8)).not.toBe(ch(t, 0));
  });

  it("backs off in a dark room, because the law is SEPARATION, not darkness", () => {
    // the night classroom's platforms already read by being LIGHTER than a
    // 19 %-luminance room; pushing them down would erase the very separation
    // this exists to build (doc 36 §1 v1.1's L2↔L3 rule)
    const bright = nearPlaneTint(88);
    const dark = nearPlaneTint(30);
    for (const shift of [16, 8, 0]) expect(ch(dark, shift)).toBeGreaterThan(ch(bright, shift));
    expect(ch(dark, 8)).toBeGreaterThan(210); // …and barely touched at all
  });

  it("is bounded at both ends — no room gets a black plane or an untouched one", () => {
    for (const key of [0, 1, 30, 88, 100, 400]) {
      const t = nearPlaneTint(key);
      expect(ch(t, 16), `K=${key}`).toBeGreaterThan(120);
      expect(ch(t, 0), `K=${key}`).toBeLessThan(250);
    }
  });
});

// ── PK-R6 · H2 · THE CHILD'S EDGE (round-2 finding 1, CRITICAL) ──────────────
// The finding said his colour collapses into the wall; the measurement says his
// value gap is 44 points and what collapses is his MASS at thumbnail size. These
// lock the repair that follows from the measurement rather than from the guess.
describe("the hero's own edge", () => {
  it("is his shade in a lit room and his rim in a dark one", () => {
    const hall = heroEdgeFor(88);
    const night = heroEdgeFor(30);
    // ink against a pale wall, warm light against a dark one
    expect(hall.tint).toBeLessThan(0x808080);
    expect(night.tint).toBeGreaterThan(0x808080);
    // a shadow leans; a rim hugs
    expect(hall.dx).toBeGreaterThan(night.dx);
    expect(hall.dy).toBeGreaterThan(night.dy);
  });

  it("always SWELLS — that is the half a squint cannot average away", () => {
    for (const key of [14, 28, 30, 86, 88]) {
      const e = heroEdgeFor(key);
      expect(e.swell).toBeGreaterThan(0.05);
      expect(e.swell).toBeLessThan(0.2); // past this it is a second boy, not a rim
      expect(e.alpha).toBeGreaterThan(0);
      expect(e.alpha).toBeLessThan(0.6);
    }
  });

  it("flips on the split, and no room in the book sits near the line", () => {
    expect(heroEdgeFor(HERO_EDGE_KEY_SPLIT).tint).toBe(heroEdgeFor(100).tint);
    expect(heroEdgeFor(HERO_EDGE_KEY_SPLIT - 1).tint).toBe(heroEdgeFor(0).tint);
    for (const spec of Object.values(CH01_COMPOSITION)) {
      expect(Math.abs(spec.key - HERO_EDGE_KEY_SPLIT)).toBeGreaterThan(15);
    }
  });
});

// ── PK-R6 · H2 · THE MIDDLE DISTANCE (round-2 finding 8) ─────────────────────
describe("L2b — the same furniture, one room further back", () => {
  it("recedes on every axis a further row must recede on", () => {
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      if (!spec.mid) { expect(spec.midFar).toBeUndefined(); continue; }
      const far = spec.midFar!;
      expect(far).toBeDefined();
      expect(far.parallax).toBeGreaterThan(spec.far.parallax);
      expect(far.parallax).toBeLessThan(spec.mid.parallax);
      expect(Number(far.height)).toBeLessThan(Number(spec.mid.height));
      expect(far.lift!).toBeGreaterThanOrEqual((spec.mid.lift ?? 0) + Number(spec.mid.height));
      // GHOSTED — doc 36 §1's affordance quarantine is what licenses a second
      // copy of operable-looking furniture at all, and the alpha IS the licence
      expect(far.alpha!).toBeGreaterThan(0);
      expect(far.alpha!).toBeLessThan(1);
      expect(id).toBeTruthy();
    }
  });

  it("is planned as its own plane, between the shell and the furniture", () => {
    const spec = CH01_COMPOSITION.p1!;
    const pieces = planLayers(spec, 64 * TILE, 22 * TILE, () => ({ w: 400, h: 200 }));
    const l2b = pieces.filter((p) => p.plane === "L2b");
    expect(l2b.length).toBeGreaterThan(0);
    for (const p of l2b) {
      expect(p.depth).toBeLessThan(PLANE_DEPTH.mid);
      expect(p.depth).toBeGreaterThan(PLANE_DEPTH.far);
      expect(p.alpha).toBe(MID_FAR_ALPHA);
    }
    // and it changes nothing about the two planes that owe the cover law
    for (const plane of ["L0", "L1"] as const) {
      expect(planeCovers(pieces.filter((p) => p.plane === plane), 64 * TILE, 22 * TILE, "both")).toBe(true);
    }
  });

  it("costs no new art — the art gate asks for its stems all the same", () => {
    const stems = compositionStems(CH01_COMPOSITION.p1!);
    expect(stems).toContain("l2_p1");
    // the further row quotes the near one, so the required list does not grow
    expect(new Set(stems).size).toBe(stems.length);
  });
});

// ── PK-R6 · H2 · WHAT THE FURNITURE THROWS (round-2 finding 9) ───────────────
describe("the platform shadows", () => {
  const KIT: MassKit = {
    crust: ["c_a", "c_b"], crustCapL: "cl", crustCapR: "cr",
    body: ["b_a"], fade: ["f"], sediment: "s",
    edgeL: "el", edgeR: "er", cornerBL: "bl", cornerBR: "br",
    inCornerL: "il", inCornerR: "ir", rampUp: "ru", rampDown: "rd",
    platObjects: [{ stem: "o2", cells: 2 }, { stem: "o1", cells: 1 }],
  };

  it("draws ONE pool per ledge, not one per object", () => {
    // a four-cell ledge is covered by two objects; two shadows with a seam
    // between them is the wallpaper defect again, one layer down
    const grid = [
      "................",
      "....####........",
      "................",
      "################",
    ];
    const plan = planMass(grid, KIT);
    expect(plan.filter((p) => p.kind === "platform").length).toBe(2);
    expect(planPlatformShadows(plan).length).toBe(1);
  });

  it("leans the way every phase's light says it should", () => {
    const grid = ["........", "..##....", "........", "########"];
    const plan = planMass(grid, KIT);
    const obj = plan.find((p) => p.kind === "platform")!;
    const [sh] = planPlatformShadows(plan);
    expect(sh).toBeDefined();
    // down and to the RIGHT: the wash puts the light top-left in every room, and
    // the hero's own shadow has been thrown that way since H1
    expect(sh!.x).toBeGreaterThan(obj.x);
    expect(sh!.y).toBeGreaterThan(obj.y);
    expect(sh!.w).toBeLessThan(obj.w + PLAT_SHADOW.dx);
    expect(sh!.alpha).toBeGreaterThan(0);
  });

  it("is empty where there is nothing to cast one", () => {
    expect(planPlatformShadows([])).toEqual([]);
    expect(planPlatformShadows(planMass(["####", "####"], KIT))).toEqual([]);
  });
});

// ── PK-R6 · H2 · ONE OBJECT, AT MOST TWO ROOMS (round-2 finding 12) ──────────
describe("the zone palettes", () => {
  it("lets a motif be quoted once and never twice", () => {
    const rooms = new Map<string, string[]>();
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      for (const o of spec.mass.platObjects) {
        rooms.set(o.stem, [...(rooms.get(o.stem) ?? []), id]);
      }
    }
    for (const [stem, where] of rooms) {
      expect(where.length, `${stem} furnishes ${where.join(", ")}`).toBeLessThanOrEqual(2);
    }
  });

  it("leaves the outdoor room sharing nothing with either indoor one", () => {
    const of = (id: string): Set<string> =>
      new Set(CH01_COMPOSITION[id]!.mass.platObjects.map((o) => o.stem));
    const yard = of("p3");
    for (const indoor of ["p1", "p2"]) {
      for (const stem of of(indoor)) expect(yard.has(stem)).toBe(false);
    }
  });
});

// ── R5-W5 · E6 · D-267 · DIE RAMPEN, UND DAS GESETZ, DAS SIE ZURÜCKHOLT ──────
//
// `mass_ramp_up`/`_down` lagen in allen fünf Phasen-Scopes und wurden nie
// gezeichnet: `planMass` legt ein Rampen-Stück nur für die Steigungs-Glyphen
// `/ \ 1 2 3 4` an (`z` ist die Kreide-Rutsche mit eigenem Zweig), und ch01 hat
// davon null. Die zwei Blätter sind gelöscht und aus `massStems` heraus.
//
// Damit entsteht eine neue Falle: gibt eine spätere Fläche ihrem Gitter eine
// Steigung, plant `planMass` wieder ein Rampen-Stück — und das Blatt dazu ist
// weg. Genau das prüft dieses Gesetz. Es wäre heute leer (ch01 hat keine
// Steigung), also wird die Regel ZUERST an erfundenen Gittern in beide
// Richtungen vorgeführt: ein Gesetz, dessen rotes Licht niemand gesehen hat,
// ist Dekoration (P-56).
const RAMP_GLYPHS = new Set(["/", "\\", "1", "2", "3", "4"]);
const needsRampSheets = (rows: readonly string[]): boolean =>
  rows.some((row) => [...row].some((g) => RAMP_GLYPHS.has(g)));

describe("D-267 · Rampen-Blätter und Gitter dürfen nicht auseinanderlaufen", () => {
  it("erkennt eine Steigung im Gitter — und erkennt ihre Abwesenheit", () => {
    expect(needsRampSheets(["####", "#..#"])).toBe(false);
    expect(needsRampSheets(["#..#", "#/.#"])).toBe(true); // 45° hinauf
    expect(needsRampSheets(["#..#", "#\\.#"])).toBe(true); // 45° hinunter
    for (const g of ["1", "2", "3", "4"]) expect(needsRampSheets([`#${g}#`])).toBe(true);
    expect(needsRampSheets(["#z.#"])).toBe(false); // die Kreide-Rutsche ist kein Rampen-Stück
  });

  it("deklariert in keiner Phase ein Rampen-Blatt und lädt keines (D-267 + D-324)", () => {
    // R5-W6 · A7 · D-324: die Kit-Felder sind jetzt optional, und genau deshalb
    // prueft dieses Gesetz die DEKLARATION und nicht nur den Scope. Solange die
    // Felder Pflicht waren, trugen sie den Namen einer geloeschten Datei — haette
    // hier weiter `not.toContain(spec.mass.rampUp)` gestanden, verglichen die
    // beiden Zeilen ab sofort gegen `undefined` und gingen leer durch.
    for (const [id, spec] of Object.entries(CH01_COMPOSITION)) {
      expect(spec.mass.rampUp, `${id} deklariert wieder ein rampUp-Blatt`).toBeUndefined();
      expect(spec.mass.rampDown, `${id} deklariert wieder ein rampDown-Blatt`).toBeUndefined();
      const ramps = compositionStems(spec).filter((stem) => stem.startsWith("mass_ramp"));
      expect(ramps, `${id} laedt ein Rampen-Blatt`).toEqual([]);
    }
  });

  it("haelt an, statt ein Loch in den Boden zu zeichnen, wenn ein Kit ohne Rampen auf eine Steigung trifft (D-324)", () => {
    // Beide Richtungen, sonst beweist der Fall nichts: dasselbe Gitter, einmal
    // mit Rampen-Blaettern im Kit und einmal ohne. Mit ihnen MUSS ein Stueck
    // geplant werden, ohne sie MUSS es knallen — ein stilles Ueberspringen waere
    // genau der unsichtbare Boden, den D-324 abstellt.
    const slope = ["#..#", "#/.#"];
    const withRamps = planMass(slope, kit, afSrc).filter((q) => q.kind === "ramp");
    expect(withRamps.length, "ein Kit MIT Rampen plant das Stueck").toBe(1);
    expect(withRamps[0]?.stem).toBe("ramp_up");
    const { rampUp: _u, rampDown: _d, ...noRamps } = kit;
    expect(() => planMass(slope, noRamps, afSrc)).toThrow(/declares no rampUp sheet/);
    // …und ohne Steigung darf dasselbe rampenlose Kit ganz normal planen.
    expect(() => planMass(["####", "#..#"], noRamps, afSrc)).not.toThrow();
  });

  it("verlangt die Blätter zurück, sobald ein Gitter eine Steigung trägt", () => {
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint");
    const onDisk = new Set<string>();
    const walkArt = (dir: string): void => {
      if (!fs.existsSync(dir)) return;
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walkArt(p);
        else if (e.name.endsWith(".png")) onDisk.add(e.name.replace(/\.png$/, ""));
      }
    };
    walkArt(ART);

    const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");
    let phasesChecked = 0;
    let phasesWithSlope = 0;
    if (fs.existsSync(CONTENT)) {
      for (const story of fs.readdirSync(CONTENT)) {
        const paintDir = path.join(CONTENT, story, "paint");
        if (!fs.existsSync(paintDir)) continue;
        for (const f of fs.readdirSync(paintDir).filter((x) => x.endsWith(".level.json"))) {
          const level = JSON.parse(fs.readFileSync(path.join(paintDir, f), "utf8")) as {
            chapter: string;
            draft?: boolean;
            phases: Array<{ id: string; rows: string[] }>;
            arena?: { id: string; rows: string[] } | null;
            bonus?: { id: string; rows: string[] } | null;
          };
          if (level.draft === true) continue;
          const all = [...level.phases, ...(level.arena ? [level.arena] : []), ...(level.bonus ? [level.bonus] : [])];
          for (const ph of all) {
            phasesChecked += 1;
            if (!needsRampSheets(ph.rows)) continue;
            phasesWithSlope += 1;
            const spec = compositionFor(level.chapter, ph.id);
            if (spec === null) continue;
            for (const [field, stem] of [["rampUp", spec.mass.rampUp], ["rampDown", spec.mass.rampDown]] as const) {
              expect(
                stem !== undefined && onDisk.has(stem),
                `${f}/${ph.id} trägt eine Steigung, aber sein Kit `
                  + (stem === undefined ? `deklariert kein ${field}-Blatt` : `nennt ${stem}, und ${stem}.png liegt nicht auf der Platte`)
                  + " — die Rampen wurden in R5-W5 · E6 gelöscht (D-267) und ihre Kit-Felder in R5-W6 · A7 "
                  + "optional gemacht (D-324). Eine Fläche mit Steigungen braucht eine neue Bestellung (R109), "
                  + "keine stille Wiederbelebung.",
              ).toBe(true);
            }
          }
        }
      }
    }
    // Der Lauf muss überhaupt etwas gesehen haben — sonst prüft er nichts.
    expect(phasesChecked).toBeGreaterThan(0);
    // Heute ist der Stand: keine einzige Steigung im ganzen Bestand (D-267).
    expect(phasesWithSlope).toBe(0);
  });
});
