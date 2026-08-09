// PB-C1 · THE COMPOSITION MANIFEST — doc 36 (the composition law) as data.
//
// WHY A SIDECAR TS MAP AND NOT A LEVEL-SCHEMA BLOCK (decision, PK-C1):
// the live level JSON is kept DEEP-EQUAL to its design source of truth
// (docs/design/g1/paint/grids-v2/ — "edit the grid, re-splice; never edit the
// live level directly"), so art direction in the level file would have to be
// authored twice and zod-typed a third time, for data no LEVEL LAW ever reads.
// Composition is commissioned art direction, not level layout: it belongs
// beside the renderer that consumes it. Being TS also buys three things a JSON
// block would not: types, headless unit tests, and a CI gate that can import
// it (scripts/check-paint-art.mjs + scripts/check-composition.mjs both do).
//
// A phase with NO entry here renders exactly as it did before PB-C1 (the
// fallback law) — nothing may break while art is pending.

/** A length that may be stated absolutely or bound to the phase's world box. */
export type Measure = number | "world" | "floor";

export const resolveMeasure = (m: Measure, worldHpx: number): number =>
  m === "world" || m === "floor" ? worldHpx : m;

/** L0 AIR — the room's light, engine-drawn (never an image). 2–3 stops, top→bottom. */
export interface WashSpec {
  colors: readonly [number, number] | readonly [number, number, number];
}

/** L1/L2/L4 — a plane of tiling image pieces at one parallax and value band. */
export interface ShellSpec {
  /** tiling stems laid left→right in order, repeating until the plane covers. */
  segments: readonly string[];
  /** ONE non-repeating motif dropped at a fraction (0..1) of the plane's span. */
  anchor?: { stem: string; at: number };
  /** display height in world px, or the full world height. */
  height: Measure;
  /** world-y of the plane's BOTTOM edge, or the world floor. */
  bottom: Measure;
  /** px the plane is raised above that bottom (bands sit on the horizon line). */
  lift?: number;
  parallax: number;
  parallaxY?: number;
  tint?: number;
  alpha?: number;
  /** true = tileSprite (a seamless loop band); false = discrete segment images. */
  loop?: boolean;
  /** true = this plane is sized by the COVER LAW (doc 36 §3) instead of by its
   *  declared height/bottom — the far shell must never run out mid-travel. */
  cover?: boolean;
}

/** L3 — the carved terrain mass (doc 36 §2). One kit per phase. */
export interface MassKit {
  /** walk-surface loop variants (≥1) + caps that connect FLUSH to them. */
  crust: readonly string[];
  crustCapL: string;
  crustCapR: string;
  /** seamless interior body variants (≥1), then the depth ramp. */
  body: readonly string[];
  fade: string;
  sediment: string;
  /** carved trims wherever mass meets air. */
  edgeL: string;
  edgeR: string;
  cornerBL: string;
  cornerBR: string;
  inCornerL: string;
  inCornerR: string;
  /** drawn ramp masses for the 45°/30° slope glyphs. */
  rampUp: string;
  rampDown: string;
  /**
   * Floating platforms are COMPLETE OBJECTS — a palette, widest first.
   * `deck` is where the WALK SURFACE sits inside the art, as a fraction of its
   * height: the AF2 bench carries a backrest over its seat (deck 0.10), so
   * anchoring it by its top edge would sink the seat below the standable line
   * and bury the backrest in the floor. 0 = the art's top edge IS the deck.
   */
  platObjects: readonly { stem: string; cells: number; deck?: number }[];
  /** the chalk slide (`z` runs): top / repeatable mid / run-out foot + strut. */
  slide?: { top: string; mid: string; foot: string; under: string };
}

export interface CompositionSpec {
  /**
   * THE PHASE KEY (doc 36 §1 v1.1) — the luminance of this room's air, in %.
   * Every value band except L3's is expressed as a multiple of it, so one law
   * governs a sunlit hall and an ink-black dream: L0 ∈ [0.93K, min(1.08K, 96)]
   * · L1 ∈ [0.80K, 1.00K] · L2 ∈ [0.50K, 0.75K] · L4 ≤ 0.45K. L3 is exempt —
   * lit figures against a dark room are the entire point.
   */
  key: number;
  wash: WashSpec;
  far: ShellSpec;
  mid?: ShellSpec;
  fg?: ShellSpec;
  mass: MassKit;
  /** doc 36 / ch01 sheet: a breadcrumb trail spells a REAL u01 word. Absent =
   *  the deterministic A→Z fallback in letters.ts (never a repeated glyph). */
  words?: readonly string[];
}

// ── the placeholder guard ────────────────────────────────────────────────────
// PK-C1 proved every geometry law BEFORE the art existed, against a generated
// flat-tone kit (scripts/gen-placeholder-kit.mjs, kept as a dev tool). PK-C2
// re-pointed every slot at the painted Batch-AF stems and deleted the stand-in
// PNGs — no `ph_` stem is wired today. The guard stays armed so the next kit
// built against placeholders cannot quietly ship on them either
// (check-paint-art.mjs hard-fails past the date).

export const PLACEHOLDER_PREFIX = "ph_";
/** Hard stop: placeholder slots FAIL the art gate after this date. */
export const PLACEHOLDER_UNTIL = "2026-09-30";

export const isPlaceholderStem = (stem: string): boolean => stem.startsWith(PLACEHOLDER_PREFIX);

/**
 * PK-R6 · H1 · THE TRAVERSAL SURFACES: every stem `planMass` can lay down —
 * the walk course, its caps and trims, the interior bands, the ramps, the
 * slide, and the floating platform objects. This is the art the child's feet
 * are ON for a whole chapter, and it is the only art that TILES, so a one-pixel
 * defect on its outer skin is reprinted at every loop of the floor.
 *
 * Exported (rather than inlined into `compositionStems`) because two things now
 * need exactly this list and may never drift apart: the fringe repair tool
 * (scripts/strip-key-fringe.mjs) and the gate that keeps it repaired
 * (scripts/check-paint-art.mjs).
 */
export const massStems = (m: MassKit): string[] => {
  const out = [...m.crust, m.crustCapL, m.crustCapR, ...m.body, m.fade, m.sediment];
  out.push(m.edgeL, m.edgeR, m.cornerBL, m.cornerBR, m.inCornerL, m.inCornerR, m.rampUp, m.rampDown);
  out.push(...m.platObjects.map((p) => p.stem));
  if (m.slide) out.push(m.slide.top, m.slide.mid, m.slide.foot, m.slide.under);
  return [...new Set(out)];
};

/** Every stem a spec references — the art gate's requirement list. */
export const compositionStems = (spec: CompositionSpec): string[] => {
  const out: string[] = [];
  for (const plane of [spec.far, spec.mid, spec.fg]) {
    if (!plane) continue;
    out.push(...plane.segments);
    if (plane.anchor) out.push(plane.anchor.stem);
  }
  out.push(...massStems(spec.mass));
  return [...new Set(out)];
};

// ── ch01 · THE PAINTED BOOK ──────────────────────────────────────────────────
// Value bands are doc 36 §1; the palette card is CODEX_MASTER_PROMPT_AF_
// COMPOSITION's "PALETTE CARD" section, so the engine-drawn L0 wash already
// states each phase's light and the placeholder planes sit in their bands.

/** The shared interior + trims — one body for the whole school (AF group 3). */
const sharedMass = (): Omit<MassKit, "crust" | "crustCapL" | "crustCapR" | "slide"> => ({
  body: ["mass_body_a", "mass_body_b"],
  fade: "mass_fade",
  sediment: "mass_sediment",
  edgeL: "mass_edge_l",
  edgeR: "mass_edge_r",
  cornerBL: "mass_corner_bl",
  cornerBR: "mass_corner_br",
  inCornerL: "mass_incorner_l",
  inCornerR: "mass_incorner_r",
  rampUp: "mass_ramp_up",
  rampDown: "mass_ramp_down",
  // AF group 5 ships 1- and 2-cell objects. Wider runs are covered by laying
  // COMPLETE objects side by side, never by stretching one; two objects per
  // width give the planner something to alternate between.
  // deck fractions measured off the AF2 sheets, not guessed
  platObjects: [
    { stem: "plat_bench_2", cells: 2, deck: 0.10 }, // backrest + armrests above the seat
    { stem: "plat_plank_2", cells: 2, deck: 0 },
    { stem: "plat_shelf_2", cells: 2, deck: 0 },
    { stem: "plat_column2_1", cells: 1, deck: 0.01 },
    { stem: "plat_bundle_1", cells: 1, deck: 0.02 },
  ],
});

const crustOf = (phase: string): Pick<MassKit, "crust" | "crustCapL" | "crustCapR"> => ({
  crust: [`crust_${phase}_a`, `crust_${phase}_b`],
  crustCapL: `crust_${phase}_cap_l`,
  crustCapR: `crust_${phase}_cap_r`,
});

const shell = (phase: string, parallax: number): ShellSpec => ({
  segments: [`l1_${phase}_a`, `l1_${phase}_b`],
  height: "world",
  bottom: "floor",
  cover: true,
  parallax,
  parallaxY: 0.12,
});

/** L2 furniture: 86 px ≈ 2.5 H — inside the law's 1.5–3 H band. */
const midBand = (phase: string, height = 86): ShellSpec => ({
  segments: [`l2_${phase}`],
  loop: true,
  height,
  bottom: "floor",
  lift: 34,
  parallax: 0.5,
  parallaxY: 0.9,
});

export const CH01_COMPOSITION: Record<string, CompositionSpec> = {
  // p1 Eingangshalle — morning-warm: honey light over cream walls.
  p1: {
    key: 88,
    wash: { colors: [0xfcf4e2, 0xf4e7cb, 0xe6d7b4] }, // measured 90.4 % lum / 16.3 % sat — inside the §1 L0 band
    far: shell("p1", 0.25),
    mid: midBand("p1"),
    mass: { ...sharedMass(), ...crustOf("p1") },
    // PK-R6 · B: the trail now spells the DRAINED OBJECTS this phase holds —
    // the ch01 sheet's currency law („each breadcrumb run spells a REAL u01
    // word … the trail's end holds that thing"), which only became true when
    // the objects arrived in the field. Until now every phase fell back to the
    // A→Z walk, so a child collected ABCDEFGH and read nothing.
    words: ["school", "bag", "book"],
  },
  // p2 Klassenzimmer bei Nacht — moon-cool: deep blue-violet air.
  p2: {
    key: 30,
    wash: { colors: [0x2b3358, 0x3d4470, 0x565b8a] },
    far: shell("p2", 0.25),
    mid: midBand("p2"),
    mass: { ...sharedMass(), ...crustOf("p2") },
    words: ["desk", "pencil"], // the two drained objects of the night classroom
  },
  // p3 Schulhof-Garten — afternoon-soft: sand plaster and chalk pastel.
  // The one phase with the chalk slide (`z` runs, AF group 4).
  p3: {
    key: 86,
    wash: { colors: [0xf3ecd9, 0xe6dcc0, 0xd2c9a6] },
    far: shell("p3", 0.25),
    mid: midBand("p3"),
    mass: {
      ...sharedMass(),
      ...crustOf("p3"),
      slide: { top: "slide_top", mid: "slide_mid", foot: "slide_foot", under: "slide_under" },
    },
    words: ["glue", "stick"], // the u01 phrase „glue stick", split over the yard
  },
  // p4 Tafel-Bühne — stage-dusk: dark wood shell, audience in dusk blue.
  p4: {
    key: 28,
    wash: { colors: [0x3a3348, 0x4a3f4e, 0x5d4f52] },
    far: shell("p4", 0.25),
    mid: midBand("p4", 96),
    mass: { ...sharedMass(), ...crustOf("p4") },
  },
  // p9 Kleckskammer — ink-dream: indigo-black, atmosphere not architecture
  // (AF: "this phase's L1 is almost empty"), so it carries NO furniture band.
  p9: {
    // Fable, PK-C2b review: lowered 16 → 14 — the delivered ink-dream measures
    // K≈15 air / 11.6 wall; darker is truer to the fiction, so the declaration
    // follows the truth (doc 36 v1.1 key table updated in the same commit).
    key: 14,
    wash: { colors: [0x141a30, 0x1d2542, 0x2a3255] },
    far: shell("p9", 0.25),
    mass: { ...sharedMass(), ...crustOf("p9") },
  },
};

/** chapter id → phase id → spec. Unknown chapter/phase ⇒ the fallback law. */
export const COMPOSITION: Record<string, Record<string, CompositionSpec>> = {
  ch01: CH01_COMPOSITION,
};

export const compositionFor = (chapter: string, phaseId: string): CompositionSpec | null =>
  COMPOSITION[chapter]?.[phaseId] ?? null;
