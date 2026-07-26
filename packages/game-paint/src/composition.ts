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
  /** floating platforms are COMPLETE OBJECTS — a palette, widest first. */
  platObjects: readonly { stem: string; cells: number }[];
  /** the chalk slide (`z` runs): top / repeatable mid / run-out foot + strut. */
  slide?: { top: string; mid: string; foot: string; under: string };
}

export interface CompositionSpec {
  wash: WashSpec;
  far: ShellSpec;
  mid?: ShellSpec;
  fg?: ShellSpec;
  mass: MassKit;
  /** doc 36 / ch01 sheet: a breadcrumb trail spells a REAL u01 word. Absent =
   *  the deterministic A→Z fallback in letters.ts (never a repeated glyph). */
  words?: readonly string[];
}

// ── the placeholder profile ──────────────────────────────────────────────────
// PK-C1 proves every geometry law BEFORE the art exists, against a generated
// flat-tone kit (scripts/gen-placeholder-kit.mjs). Placeholder stems all carry
// the `ph_` prefix and are stamped PLACEHOLDER on the piece, so they can never
// be mistaken for painted art on screen. PK-C2 re-points these slots at the
// Batch-AF stems and deletes the PNGs; the guard below is what forces that to
// happen instead of quietly shipping (check-paint-art.mjs enforces the date).

export const PLACEHOLDER_PREFIX = "ph_";
/** Hard stop: placeholder slots FAIL the art gate after this date. */
export const PLACEHOLDER_UNTIL = "2026-09-30";

export const isPlaceholderStem = (stem: string): boolean => stem.startsWith(PLACEHOLDER_PREFIX);

/** Every stem a spec references — the art gate's requirement list. */
export const compositionStems = (spec: CompositionSpec): string[] => {
  const out: string[] = [];
  for (const plane of [spec.far, spec.mid, spec.fg]) {
    if (!plane) continue;
    out.push(...plane.segments);
    if (plane.anchor) out.push(plane.anchor.stem);
  }
  const m = spec.mass;
  out.push(...m.crust, m.crustCapL, m.crustCapR, ...m.body, m.fade, m.sediment);
  out.push(m.edgeL, m.edgeR, m.cornerBL, m.cornerBR, m.inCornerL, m.inCornerR, m.rampUp, m.rampDown);
  out.push(...m.platObjects.map((p) => p.stem));
  if (m.slide) out.push(m.slide.top, m.slide.mid, m.slide.foot, m.slide.under);
  return [...new Set(out)];
};

// ── ch01 · THE PAINTED BOOK ──────────────────────────────────────────────────
// Value bands are doc 36 §1; the palette card is CODEX_MASTER_PROMPT_AF_
// COMPOSITION's "PALETTE CARD" section, so the engine-drawn L0 wash already
// states each phase's light and the placeholder planes sit in their bands.

/** The shared interior + trims — one body for the whole school (AF group 3). */
const sharedMass = (): Omit<MassKit, "crust" | "crustCapL" | "crustCapR" | "slide"> => ({
  body: [`${PLACEHOLDER_PREFIX}mass_body_a`, `${PLACEHOLDER_PREFIX}mass_body_b`],
  fade: `${PLACEHOLDER_PREFIX}mass_fade`,
  sediment: `${PLACEHOLDER_PREFIX}mass_sediment`,
  edgeL: `${PLACEHOLDER_PREFIX}mass_edge_l`,
  edgeR: `${PLACEHOLDER_PREFIX}mass_edge_r`,
  cornerBL: `${PLACEHOLDER_PREFIX}mass_corner_bl`,
  cornerBR: `${PLACEHOLDER_PREFIX}mass_corner_br`,
  inCornerL: `${PLACEHOLDER_PREFIX}mass_incorner_l`,
  inCornerR: `${PLACEHOLDER_PREFIX}mass_incorner_r`,
  rampUp: `${PLACEHOLDER_PREFIX}mass_ramp_up`,
  rampDown: `${PLACEHOLDER_PREFIX}mass_ramp_down`,
  // AF group 5 ships 1-cell and 2-cell objects; wider runs are covered by
  // laying complete objects side by side, never by stretching one.
  platObjects: [
    { stem: `${PLACEHOLDER_PREFIX}plat_2`, cells: 2 },
    { stem: `${PLACEHOLDER_PREFIX}plat_1`, cells: 1 },
  ],
});

const crustOf = (phase: string): Pick<MassKit, "crust" | "crustCapL" | "crustCapR"> => ({
  crust: [`${PLACEHOLDER_PREFIX}crust_${phase}_a`, `${PLACEHOLDER_PREFIX}crust_${phase}_b`],
  crustCapL: `${PLACEHOLDER_PREFIX}crust_${phase}_cap_l`,
  crustCapR: `${PLACEHOLDER_PREFIX}crust_${phase}_cap_r`,
});

const shell = (phase: string, parallax: number): ShellSpec => ({
  segments: [`${PLACEHOLDER_PREFIX}l1_${phase}_a`, `${PLACEHOLDER_PREFIX}l1_${phase}_b`],
  height: "world",
  bottom: "floor",
  parallax,
  parallaxY: 0.12,
});

/** L2 furniture: 86 px ≈ 2.7 H — inside the law's 1.5–3 H band. */
const midBand = (phase: string, height = 86): ShellSpec => ({
  segments: [`${PLACEHOLDER_PREFIX}l2_${phase}`],
  loop: true,
  height,
  bottom: "floor",
  lift: 34,
  parallax: 0.5,
  parallaxY: 0.9,
});

/** L4: sparse occluders only — thin, dark, and never a wall in front of play. */
const fgFringe = (): ShellSpec => ({
  segments: [`${PLACEHOLDER_PREFIX}fg_fringe`],
  loop: true,
  height: 26,
  bottom: "floor",
  lift: 22,
  parallax: 1.2,
  parallaxY: 1.02,
  alpha: 0.9,
});

export const CH01_COMPOSITION: Record<string, CompositionSpec> = {
  // p1 Eingangshalle — morning-warm: honey light over cream walls.
  p1: {
    wash: { colors: [0xfcf4e2, 0xf4e7cb, 0xe6d7b4] }, // measured 90.4 % lum / 16.3 % sat — inside the §1 L0 band
    far: shell("p1", 0.25),
    mid: midBand("p1"),
    fg: fgFringe(),
    mass: { ...sharedMass(), ...crustOf("p1") },
  },
  // p2 Klassenzimmer bei Nacht — moon-cool: deep blue-violet air.
  p2: {
    wash: { colors: [0x2b3358, 0x3d4470, 0x565b8a] },
    far: shell("p2", 0.25),
    mid: midBand("p2"),
    fg: fgFringe(),
    mass: { ...sharedMass(), ...crustOf("p2") },
  },
  // p3 Schulhof-Garten — afternoon-soft: sand plaster and chalk pastel.
  // The one phase with the chalk slide (`z` runs, AF group 4).
  p3: {
    wash: { colors: [0xf3ecd9, 0xe6dcc0, 0xd2c9a6] },
    far: shell("p3", 0.25),
    mid: midBand("p3"),
    fg: fgFringe(),
    mass: {
      ...sharedMass(),
      ...crustOf("p3"),
      slide: {
        top: `${PLACEHOLDER_PREFIX}slide_top`,
        mid: `${PLACEHOLDER_PREFIX}slide_mid`,
        foot: `${PLACEHOLDER_PREFIX}slide_foot`,
        under: `${PLACEHOLDER_PREFIX}slide_under`,
      },
    },
  },
  // p4 Tafel-Bühne — stage-dusk: dark wood shell, audience in dusk blue.
  p4: {
    wash: { colors: [0x3a3348, 0x4a3f4e, 0x5d4f52] },
    far: shell("p4", 0.25),
    mid: midBand("p4", 96),
    fg: fgFringe(),
    mass: { ...sharedMass(), ...crustOf("p4") },
  },
  // p9 Kleckskammer — ink-dream: indigo-black, atmosphere not architecture
  // (AF: "this phase's L1 is almost empty"), so it carries NO furniture band.
  p9: {
    wash: { colors: [0x141a30, 0x1d2542, 0x2a3255] },
    far: shell("p9", 0.25),
    fg: fgFringe(),
    mass: { ...sharedMass(), ...crustOf("p9") },
  },
};

/** chapter id → phase id → spec. Unknown chapter/phase ⇒ the fallback law. */
export const COMPOSITION: Record<string, Record<string, CompositionSpec>> = {
  ch01: CH01_COMPOSITION,
};

export const compositionFor = (chapter: string, phaseId: string): CompositionSpec | null =>
  COMPOSITION[chapter]?.[phaseId] ?? null;
