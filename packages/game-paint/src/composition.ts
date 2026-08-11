// PB-C1 · THE COMPOSITION MANIFEST — doc 36 (the composition law) as data.
//
// WHY A SIDECAR TS MAP AND NOT A LEVEL-SCHEMA BLOCK (decision, PK-C1;
// R5-P1 updated the design regime): the level JSON is built cell-for-cell
// from the gated dossiers (docs/design/g1/paint/ch01-dossiers-v2/ §10) and
// machine-bound to them via check:level-design, so art direction in the
// level file would have to be authored twice and zod-typed a third time,
// for data no LEVEL LAW ever reads.
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

/**
 * PK-R6 · H1 · THE AIR (round-1 critique, findings 2 and 4).
 *
 * The critique's two majors were one defect wearing two hats: „panels collapse to
 * flat solid-color rectangles under the squint test" and „blank wall fills roughly
 * half the frame while all platforms, enemies, and the player are compressed into
 * the bottom third". Both say the same thing — BETWEEN the far shell and the
 * furniture there is nothing at all, so the room has two value bands where the
 * reference has four, and the upper two thirds of every frame are empty.
 *
 * doc 36 §1 provides for a fifth plane (L4 FOREGROUND) and it is deliberately
 * unwired: Batch AF commissions no foreground art, and a stamped placeholder in
 * front of the player is worse than no foreground at all (composition.test.ts
 * states that as law). So the depth this needs is drawn in CODE — legitimate by
 * doc 44 B14 — and it is declared here, per phase, because it is art direction:
 * a morning hall and an ink dream do not breathe the same air.
 *
 * Four ingredients, in the order the eye meets them:
 *  · HAZE — aerial perspective. The room's own light laid over the far shell,
 *    strongest at the top of the frame and gone by the floor. This is what puts
 *    a measurable value step between L1 and L2 in the RENDERED picture rather
 *    than only in the source sheets.
 *  · SHAFTS — where that light comes FROM. Sparse, low-contrast beams across the
 *    upper band, so the eye has somewhere to travel that never competes with a
 *    platform or a hostile.
 *  · MOTES — what hangs in it. The chapter's only ambient world motion; the
 *    critique's finding 5 („no ambient or idle motion cues").
 *  · VIGNETTE — the room's own shadow closing the frame, so the back wall stops
 *    reading as a lit rectangle of the same value corner to corner.
 *
 * Every number is either a fraction of the phase's own world box or of its
 * declared key, and every position is derived from an index — no clock, no
 * randomness, so two runs of the same phase paint the same air.
 */
export interface AirSpec {
  /** Aerial perspective over L1, 0…1 at the top of the air band → 0 at the floor. */
  haze: number;
  /** The colour the haze washes toward — the room's light, normally wash[0]. */
  hazeColour: number;
  /** Beams through the upper band. Absent = a room with no windows (p9). */
  shafts?: {
    count: number;
    colour: number;
    /** peak opacity at the beam's mouth; it fades to 0 down its length. */
    alpha: number;
    /** radians off vertical — which way the light leans in. */
    tilt: number;
    /** the beam's width at its mouth, in world px. */
    width: number;
    /** PK-R6 · H2 (round-2 finding 9): what the child can SEE throwing this
     *  light. Absent = the source is off-frame and needs no fixture (a hall lit
     *  by the day outside owes nobody a sun). Present = the fixture is part of
     *  the set and is drawn at each beam's mouth (air.planSources). */
    source?: "lamp";
  };
  /** What drifts in that light. Absent = still air. */
  motes?: { count: number; colour: number; alpha: number; radius: number };
  /**
   * PK-R6 · H2 · WHAT LIVES BELOW THE LIGHT (round-2 finding 13: „a wide patch
   * of bush/foliage with nothing happening in it … the reference fills every
   * quadrant of the frame with some living detail").
   *
   * The motes above are DUST and they are clamped into the air band on purpose —
   * a beam or a speck across a hostile is a readability defect. This is the other
   * half: a few leaves turning over the yard's foliage, in the LOWER band, where
   * the dead pocket actually is. It is allowed down there because of what it is
   * NOT: it rides the furniture plane's own parallax and is drawn on that plane's
   * depth, so it can never pass in front of a platform, a pickup or a being — it
   * lives behind the whole gameplay layer, in the scenery it belongs to.
   */
  life?: {
    count: number;
    colour: number;
    alpha: number;
    /** one leaf's long axis, in world px. */
    size: number;
    /** the world-height fractions it drifts between, top then bottom. */
    band: readonly [number, number];
  };
  /** How hard the room's shadow closes the frame's edges, 0…1. */
  vignette: number;
  /** How far down the world the air band reaches, as a fraction of world height.
   *  Below it the gameplay band starts and nothing atmospheric is drawn — the
   *  critique asked for the DEAD space to be populated, not the live one. */
  band: number;
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
  /**
   * PK-R6 · H2 · L2b · THE MIDDLE DISTANCE (round-2 finding 8, major).
   *
   * „Each is just a back wall texture plus a foreground platform strip; none show
   * a softened, slightly-blurred middle-distance layer the way the reference does
   * with its receding tree/mountain layers." Counted in the shipped manifest, the
   * critique is exactly right: between L1 at parallax 0.25 and L2 at 0.5 there is
   * nothing, so a room offers the eye two planes and calls itself a world.
   *
   * The fix is not new art — it is the SAME furniture standing further back. One
   * more row of the phase's own L2 band, smaller (a further row subtends less),
   * higher (a further row stands higher on the same ground plane), slower
   * (parallax between the shell and the furniture), and GHOSTED, which is what
   * does the work: at alpha ≈ 0.62 over the lit far shell the row renders between
   * the two planes in value without a single new pixel being painted, because
   * aerial perspective IS the far wall showing through the near thing.
   *
   * Measured rendered luminance (source PNGs, blend arithmetic, gate audit 8):
   *   p1 L1 78.0 → L2b 63.5 → L2 54.7 · p3 80.0 → 62.1 → 51.1
   *   p2 27.0 → 21.8 → 18.6 · p4 25.0 → 20.7 → 18.0
   * — a real third band in every room that has a furniture plane at all.
   *
   * doc 36 §1's affordance quarantine allows exactly this and no more:
   * „Background versions of interactive things are allowed only ghosted/faded per
   * the transparency grammar." The alpha is therefore not a taste dial; it is the
   * licence. AMENDMENT PROPOSED to doc 36 §1's five-plane table (executor,
   * PK-R6 H2) — implemented here, pending architect ratification.
   */
  midFar?: ShellSpec;
  mid?: ShellSpec;
  fg?: ShellSpec;
  mass: MassKit;
  /** The engine-drawn depth between the planes (see AirSpec). */
  air?: AirSpec;
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

// ── PK-R6 · H2 · THE NEAREST PLANE (round-2 finding 7) ───────────────────────
// „Bookshelf-platform (foreground), locker band, and blurred foliage (midground)
// all sit within a narrow warm-midtone band; compare to the reference forest
// frame, which holds a true dark-silhouette-to-pale-sky value spread."
//
// Measured on the shipped ch01 hall: the floating platform objects average 49.3 %
// luminance and the L2 furniture band behind them 54.5 % — a 5-point step, which
// is nothing under a squint. The hall's depth was therefore being carried almost
// entirely by outline overlap, exactly as the critique read it.
//
// The fix is a value, not a new asset: the nearest standable plane is laid in its
// own light — darker, and cooler, because near-shade in a warm room goes blue.
// Measured after: 31.0 % against the same 54.5 %, i.e. the step grows from 5.2 to
// 23.5 points and the foreground becomes the frame's dark anchor.
//
// And it is SCALED BY THE ROOM'S OWN KEY, which is the whole reason this is a
// function rather than a constant. Separation is the law (doc 36 §1 v1.1's
// L2↔L3 rule), not darkness: in the night classroom (K=30) the platforms already
// read by being LIGHTER than a 19 %-luminance room, and pushing them down would
// erase the very separation it is meant to build. At K=88 the push is its full
// 0.36; at K=30 it is 0.12 and the night room keeps its own contrast (measured:
// 45.5 % → 39.7 % against L2 at 19.1 %).

/** How far down the near plane is pushed at the brightest room the law allows. */
export const NEAR_PLANE_PUSH = 0.36;

/** The MULTIPLY tint the nearest standable plane wears in a room of this key.
 *  Cooler than it is dark: red loses the most, blue the least, which is what
 *  turns „darker" into „further forward in a warm room" instead of „dirtier". */
export const nearPlaneTint = (key: number): number => {
  const d = Math.min(NEAR_PLANE_PUSH, Math.max(0.1, NEAR_PLANE_PUSH * (key / 88)));
  const r = Math.round(255 * (1 - d * 1.15));
  const g = Math.round(255 * (1 - d));
  const b = Math.round(255 * (1 - d * 0.6));
  return (r << 16) | (g << 8) | b;
};

// ── PK-R6 · H2 · THE CHILD KEEPS HIS EDGE (round-2 finding 1, CRITICAL) ──────
// „At a 25 % squint the boy's blue/brown figure collapses into the pale yellow
// wall (scene 1) and vanishes almost entirely into the tan stucco wall (scene
// 3)." The finding is right and its stated CAUSE is not, which matters, because
// the proposed repair (deepen his outfit, „navy shirt instead of mid-blue")
// would have repainted the hero for a defect he does not have:
//
//   measured over the commissioned rig sheets (body · head · hair · shoe · hand,
//   visible pixels only): the boy is 34.0 % mean luminance. p1's wall is 78.0 %,
//   p3's is 80.0 %, the furniture band he usually stands against is 54.7 %. His
//   value gap is 44 points against the wall and 21 against the furniture — two
//   and four times the law's own separation minimum. He is not the same value as
//   the wall. He is 35 px tall in a 352-px frame with a hand-painted, broken
//   outline, and a 25 % blur AVERAGES a small busy dark shape into a large calm
//   bright one. What fails the squint is not his colour, it is his MASS.
//
// So the repair is mass at the edge, and it costs no art: the rig already draws
// a full second copy of itself for the cast shadow (H1). That copy is now also
// blown up a little around the same centre, so it shows past his silhouette on
// every side — a contour that a blur cannot average away, because blurring a
// dark ring leaves a dark ring.
//
// …and it flips with the room, which is the half a fixed ink shadow could never
// do: in a bright hall the contour is the room's own shade, and in the night
// classroom and on the dusk stage the same copy is lit warm instead, because a
// dark rim on a dark wall separates nothing. That is the critique's own
// „consistent warm rim-light" — spent where it actually buys contrast.
export interface HeroEdge {
  /** the copy's tint — ink in a lit room, candle-warm in a dark one. */
  tint: number;
  alpha: number;
  /** how far past his own outline the copy reaches (fraction of his scale). */
  swell: number;
  /** and how far it is thrown, in px: a shadow leans, a rim barely moves. */
  dx: number;
  dy: number;
}

/** Above this key the room lights the child and the contour is his shade; below
 *  it the room is dark and the contour is his rim. ch01's keys are 88/86 and
 *  30/28/14 — nothing in the book sits anywhere near the line. */
export const HERO_EDGE_KEY_SPLIT = 50;

export const heroEdgeFor = (key: number): HeroEdge =>
  key >= HERO_EDGE_KEY_SPLIT
    // a lit room: the ink of the H1 shadow, deepened, and now swollen
    ? { tint: 0x2a2333, alpha: 0.46, swell: 0.11, dx: 3, dy: 3 }
    // a dark room: the same copy, lit — and barely offset, because a warm shape
    // thrown 3 px down-right reads as a spill, while one that hugs him reads as
    // the light of the room finding his edge
    : { tint: 0xffe4b0, alpha: 0.30, swell: 0.13, dx: 1, dy: 1 };

// ── PK-R6 · H2 · THE DARKS GO DEEPER (round-2 finding 9, major) ──────────────
// „The compositions collapse into near-uniform pale yellow/tan colour fields with
// almost no dark anchor shapes to organise the eye … push the darkest darks in
// each scene meaningfully deeper (deep shadow under furniture, inside archways,
// in wall corners)."
//
// Three answers, in the three places the finding names, none of them a repaint:
//   · UNDER THE FURNITURE — every floating platform now throws a shadow
//     (mass.planPlatformShadows). That is the dark shape the middle of the frame
//     was missing, and it is where the eye already is.
//   · AT THE FURNITURE'S FOOT — the L2 band darkens into its own bottom edge, so
//     the horizon line stops being a flat stripe of one value (air.planBandShade).
//   · IN THE CORNERS — the vignette, which existed but was set for a room that
//     had no other darks in it, is deepened in the two high-key rooms (p1 0.22 →
//     0.30, p3 0.20 → 0.30; the law's ceiling is 0.5 and the dark rooms are
//     already there).
/** The colour every room's own shadow is mixed toward before it takes the room's
 *  deepest wash stop — a near-black that still belongs to a painted book. */
export const ROOM_SHADOW_INK = 0x1a1626;

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
  for (const plane of [spec.far, spec.midFar, spec.mid, spec.fg]) {
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

/**
 * PK-R6 · H1 · THE PER-ZONE PLATFORM PALETTES (round-1 critique, finding 8).
 *
 * „The same book-stack shelf silhouette and proportions appear in both the
 * entrance hall and classroom, differing only in color." The colour half was a
 * misread — every phase drew the SAME five objects, unrecoloured — but the
 * complaint underneath it was exactly right: one shared palette means the hall
 * and the classroom are furnished out of one box, so neither space reads as
 * designed for what happens in it.
 *
 * Four painted objects were sitting on disk unwired (`plat_coatbench`,
 * `plat_desk`, `plat_bookpile_l`, `plat_bookpile_s`), which is enough to give
 * every zone its own silhouette set out of REAL commissioned art rather than a
 * recolour of one asset. So the palette moves from `sharedMass` to a per-phase
 * table: coat benches in the entrance hall, desks and book stacks in the
 * classroom, planks and a garden bench in the yard, stage boards on the Bühne,
 * paper adrift in the ink dream.
 *
 * Two rules the table has to keep, or the planner misbehaves:
 *  · every palette carries at least one 2-cell AND one 1-cell object, because
 *    `coverWithObjects` fills widest-first and the live grids hold 2-, 3- and
 *    4-cell runs (3 = 2+1);
 *  · a phase whose runs are all the same width needs TWO objects at that width,
 *    or the seeded pick has nothing to alternate between (p9's twelve 2-cell
 *    ledges were the case that made this explicit).
 *
 * NOT wired: `plat_roofarrow`. It carries a chalk arrow pointing down — that is
 * a signposted one-way, i.e. an instruction, and laying it as generic scenery
 * would have the world tell the child something untrue.
 *
 * `deck` = where the walk surface sits inside the art, as a fraction of its
 * height. Measured off each sheet's opaque-width profile (the row where the top
 * surface reaches its full span), never guessed.
 */
const PLAT_OBJECTS: Record<string, MassKit["platObjects"]> = {
  // p1 Eingangshalle — the hall's own furniture: coat benches, a hall shelf,
  // tied bundles. TWO 2-cell objects, because the hall's ledges are 3 and 4
  // cells wide and a 4-cell ledge built from one object is two identical benches
  // side by side — which is what the round-1 browser proof showed.
  p1: [
    { stem: "plat_bench_2", cells: 2, deck: 0.10 },
    { stem: "plat_shelf_2", cells: 2, deck: 0 },
    { stem: "plat_coatbench", cells: 1, deck: 0.58 }, // the seat plank, backboard + coats above it
    { stem: "plat_bundle_1", cells: 1, deck: 0.02 },
  ],
  // p2 Klassenzimmer — desks, a wall shelf, and the book stacks off them.
  p2: [
    { stem: "plat_desk", cells: 2, deck: 0.03 },
    { stem: "plat_shelf_2", cells: 2, deck: 0 },
    { stem: "plat_bookpile_l", cells: 1, deck: 0.06 },
    { stem: "plat_bookpile_s", cells: 1, deck: 0.08 },
  ],
  // p3 Schulhof-Garten — PK-R6 · H2 (round-2 finding 12): the yard shared its
  // bench AND its bundles with the entrance hall, which is most of why „the same
  // book-stack desk/bench silhouette appears in 01, 02 and 03, differing only by
  // colour grading" survived H1's per-zone split. Both are gone: the outdoor room
  // now shares NOTHING with either indoor room.
  //
  // What replaces the bench is not a recolour — it is `ledge_windowsill`, a
  // commissioned sheet that has been sitting on disk unwired since Batch AF, and
  // it is the one prop in the box this phase can justify: the yard's own painted
  // back wall carries four arched windows, so a sill under them is furniture the
  // room already implies. Measured off its opaque profile: the top plank IS the
  // walk surface (deck 0.02 — a hair, so the lip does not float).
  p3: [
    { stem: "plat_plank_2", cells: 2, deck: 0 },
    { stem: "ledge_windowsill", cells: 2, deck: 0.02 },
    { stem: "plat_column2_1", cells: 1, deck: 0.01 },
  ],
  // p4 Tafel-Bühne — stage boards on crates, nothing soft.
  p4: [
    { stem: "plat_plank_2", cells: 2, deck: 0 },
    { stem: "plat_column2_1", cells: 1, deck: 0.01 },
  ],
  // p9 Kleckskammer — furniture adrift in ink; two 2-cell objects because every
  // ledge in the dream is exactly two cells wide.
  // PK-R6 · H2: plank and shelf traded for a desk and a bench, so that no single
  // object furnishes more than two of the chapter's five rooms (the ≤2 law armed
  // in check-composition audit 7). The dream is where the school's furniture
  // drifts, so it may quote — but a quote repeated three times is a template.
  p9: [
    { stem: "plat_desk", cells: 2, deck: 0.03 },
    { stem: "plat_bench_2", cells: 2, deck: 0.10 },
    { stem: "plat_bundle_1", cells: 1, deck: 0.02 },
  ],
};

/** The shared interior + trims — one body for the whole school (AF group 3).
 *  Floating platform objects are NOT shared: see PLAT_OBJECTS. */
const sharedMass = (phase: string): Omit<MassKit, "crust" | "crustCapL" | "crustCapR" | "slide"> => ({
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
  platObjects: PLAT_OBJECTS[phase] ?? PLAT_OBJECTS.p1 ?? [],
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

/**
 * PK-R6 · H2 · L2b — THE SAME FURNITURE, ONE ROOM FURTHER BACK.
 *
 * Everything about it is the recession stated four times over, so the eye reads
 * distance rather than „a second band":
 *   · SMALLER — 0.68 of the near band's height (a further row subtends less).
 *   · HIGHER — lifted past the near row's own top edge, because on one ground
 *     plane the further thing stands higher in the frame.
 *   · SLOWER — parallax 0.36, exactly between the far shell (0.25) and the
 *     furniture (0.5), and the vertical factor eased with it.
 *   · GHOSTED — alpha 0.62, which is what puts its RENDERED value between the
 *     two planes (the far shell shows through it) and is also the licence doc 36
 *     §1 gives background copies of operable things.
 */
export const MID_FAR_PARALLAX = 0.36;
export const MID_FAR_ALPHA = 0.62;
export const MID_FAR_HEIGHT_FRAC = 0.68;

const midFarBand = (phase: string, near: ShellSpec): ShellSpec => {
  const nearH = typeof near.height === "number" ? near.height : 86;
  const h = Math.round(nearH * MID_FAR_HEIGHT_FRAC);
  return {
    segments: [`l2_${phase}`],
    loop: true,
    height: h,
    bottom: "floor",
    // clear of the near row's top edge (lift + its own height), so the two rows
    // never collapse into one silhouette
    lift: (near.lift ?? 0) + nearH,
    parallax: MID_FAR_PARALLAX,
    parallaxY: 0.82,
    alpha: MID_FAR_ALPHA,
  };
};

export const CH01_COMPOSITION: Record<string, CompositionSpec> = {
  // p1 Eingangshalle — morning-warm: honey light over cream walls.
  p1: {
    key: 88,
    wash: { colors: [0xfcf4e2, 0xf4e7cb, 0xe6d7b4] }, // measured 90.4 % lum / 16.3 % sat — inside the §1 L0 band
    far: shell("p1", 0.25),
    midFar: midFarBand("p1", midBand("p1")),
    mid: midBand("p1"),
    // morning sun through the hall windows, and the dust it finds
    air: {
      haze: 0.20,
      hazeColour: 0xfcf4e2,
      shafts: { count: 3, colour: 0xfff3d0, alpha: 0.09, tilt: 0.34, width: 26 },
      motes: { count: 22, colour: 0xfff6de, alpha: 0.30, radius: 0.8 },
      // PK-R6 · H2 (round-2 finding 9): 0.22 → 0.30. The hall is the brightest
      // room in the book and it had the second-shallowest corners in it.
      vignette: 0.30,
      band: 0.52,
    },
    mass: { ...sharedMass("p1"), ...crustOf("p1") },
    // PK-R6 · B: the trail now spells the DRAINED OBJECTS this phase holds —
    // the ch01 sheet's currency law („each breadcrumb run spells a REAL u01
    // word … the trail's end holds that thing"), which only became true when
    // the objects arrived in the field. Until now every phase fell back to the
    // A→Z walk, so a child collected ABCDEFGH and read nothing.
    words: ["school", "bag"], // R5-P1: Trail SCHOOLBAG = 9 (B21: die ersten sechs buchstabieren SCHOOL, die letzten drei die BAG)
  },
  // p2 Klassenzimmer bei Nacht — moon-cool: deep blue-violet air.
  p2: {
    key: 30,
    wash: { colors: [0x2b3358, 0x3d4470, 0x565b8a] },
    far: shell("p2", 0.25),
    midFar: midFarBand("p2", midBand("p2")),
    mid: midBand("p2"),
    // moonlight through two classroom windows; a dark room hazes less, because
    // aerial perspective in the dark works by silhouette (doc 36 §1 v1.1's own
    // reasoning for making the L1↔L2 gap relative to the key)
    air: {
      haze: 0.14,
      hazeColour: 0x9fb2e0,
      shafts: { count: 2, colour: 0xbcd0ff, alpha: 0.08, tilt: 0.28, width: 30 },
      motes: { count: 14, colour: 0xd7e2ff, alpha: 0.26, radius: 0.8 },
      vignette: 0.30,
      band: 0.50,
    },
    mass: { ...sharedMass("p2"), ...crustOf("p2") },
    words: ["projector"], // R5-P1: Trail PROJECTOR = 9 (p2.md §4 — der Projektor wirft die Zahlen)
  },
  // p3 Schulhof-Garten — afternoon-soft: sand plaster and chalk pastel.
  // The one phase with the chalk slide (`z` runs, AF group 4).
  p3: {
    key: 86,
    wash: { colors: [0xf3ecd9, 0xe6dcc0, 0xd2c9a6] },
    far: shell("p3", 0.25),
    midFar: midFarBand("p3", midBand("p3")),
    mid: midBand("p3"),
    // afternoon light over the yard wall, leaning further because the sun is low
    air: {
      haze: 0.18,
      hazeColour: 0xf3ecd9,
      shafts: { count: 3, colour: 0xffeec4, alpha: 0.07, tilt: 0.42, width: 22 },
      motes: { count: 18, colour: 0xfff2d8, alpha: 0.24, radius: 0.8 },
      // PK-R6 · H2 (round-2 finding 13): the yard's own foliage, turning. The
      // finding names this room by name — „lower-left third: a wide patch of
      // bush/foliage with nothing happening in it" — and this is the phase whose
      // painted L2 is a hedge, so leaves are what lives here. Ten of them across
      // the bottom two fifths, on the furniture plane, behind everything playable.
      life: { count: 10, colour: 0x8fa86a, alpha: 0.34, size: 3.2, band: [0.58, 0.94] },
      // PK-R6 · H2 (round-2 finding 9): 0.20 → 0.30, the shallowest corners in
      // the book under the largest area of flat plaster in it.
      vignette: 0.30,
      band: 0.48,
    },
    mass: {
      ...sharedMass("p3"),
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
    midFar: midFarBand("p4", midBand("p4", 96)),
    mid: midBand("p4", 96),
    // two stage lamps, nearly vertical and wider than a window's beam — the one
    // room in the chapter whose light is aimed rather than let in.
    // PK-R6 · H2 (round-2 finding 9): …and the lamps are now DRAWN. This phase
    // is the boss stage — every frame of the fight is captured here — and it is
    // the one room in the chapter whose light has a fixture in the fiction, so
    // it is the one room that could answer „what is throwing that streak?" with
    // a picture instead of a comment.
    air: {
      haze: 0.12,
      hazeColour: 0xc2a5a0,
      shafts: { count: 2, colour: 0xffd9a8, alpha: 0.10, tilt: 0.14, width: 34, source: "lamp" },
      motes: { count: 12, colour: 0xffe6c0, alpha: 0.22, radius: 0.8 },
      vignette: 0.34,
      band: 0.55,
    },
    mass: { ...sharedMass("p4"), ...crustOf("p4") },
  },
  // p9 Kleckskammer — ink-dream: indigo-black, atmosphere not architecture
  // (AF: "this phase's L1 is almost empty"), so it carries NO furniture band.
  p9: {
    // Fable, PK-C2b review: lowered 16 → 14 — the delivered ink-dream measures
    // K≈15 air / 11.6 wall; darker is truer to the fiction, so the declaration
    // follows the truth (doc 36 v1.1 key table updated in the same commit).
    key: 14,
    // R5-P1 (p9-Dossier-Vorleistung): die Welle buchstabiert die u01-Phrase —
    // ohne words fiele letters.ts auf A→Z zurück und die Kette hieße ABCDEFGHIJKL.
    words: ["school", "things"],
    wash: { colors: [0x141a30, 0x1d2542, 0x2a3255] },
    far: shell("p9", 0.25),
    // NO shafts: a dream inside an inkwell has no windows, and the AF sheet's
    // own word for this phase is „atmosphere, not architecture". What it does
    // have is ink hanging in the water, and the deepest vignette in the book.
    air: {
      haze: 0.10,
      hazeColour: 0x2a3255,
      motes: { count: 16, colour: 0x8fa3d8, alpha: 0.30, radius: 0.9 },
      vignette: 0.38,
      band: 0.60,
    },
    mass: { ...sharedMass("p9"), ...crustOf("p9") },
  },
};

/** chapter id → phase id → spec. Unknown chapter/phase ⇒ the fallback law. */
export const COMPOSITION: Record<string, Record<string, CompositionSpec>> = {
  ch01: CH01_COMPOSITION,
};

export const compositionFor = (chapter: string, phaseId: string): CompositionSpec | null =>
  COMPOSITION[chapter]?.[phaseId] ?? null;
