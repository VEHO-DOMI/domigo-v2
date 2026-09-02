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

import { TERRAIN_JOIN_STEM, TERRAIN_POST_JOIN_STEM } from "./artManifest.ts";
import { CH01_BODIES, type VisualBody } from "./visualBodies.ts";

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

/** One complete multi-cell vertical book object. The image owns every cell in
 * its rectangle, so the planner must not add a crust, trim, or join there. */
export interface ColumnObject {
  stem: string;
  cellsW: number;
  cellsH: number;
  /** true when the object is attached to the ceiling and terminates downward. */
  hanging?: boolean;
}

/** L3 — the carved terrain mass (doc 36 §2). One kit per phase. */
export interface MassKit {
  /** walk-surface loop variants (≥1) + caps that connect FLUSH to them. */
  crust: readonly string[];
  crustCapL: string;
  crustCapR: string;
  /** seamless interior body variants (≥1), then the depth ramp. */
  body: readonly string[];
  /**
   * The same body variants painted one stop deeper (SPEC_MASSEN_KIT §3). Where
   * a phase has them, the lower half of the body band draws THESE instead of
   * wearing a heavier multiply — see BODY_DEEP_AT. Optional: phases still on
   * the shared kit have no deep row and keep the single-row behaviour.
   */
  bodyDeep?: readonly string[];
  /** deep-paper variants (≥1) — the middle sheet the ramp hands over to. */
  fade: readonly string[];
  sediment: string;
  /** carved trims wherever mass meets air. */
  edgeL: string;
  edgeR: string;
  cornerBL: string;
  cornerBR: string;
  inCornerL: string;
  inCornerR: string;
  /**
   * R5-W7 · A8 · THE UNDERSIDE — the one exposed face that had no anatomy (D-27).
   *
   * Variants of the band that runs along the bottom of an overhang, in the order
   * the edge sheet delivers them (`_l`, `_r`). It is a BAND, not a pair of ends:
   * `planMass` lays it along a whole run and alternates the variants, which is
   * why this is an array and `edgeL`/`edgeR` are not — a side trim repeats DOWN
   * one cell-wide column, an underside repeats SIDEWAYS across a whole ledge.
   *
   * OPTIONAL, and that is the entire design. `SPEC_MASSEN_KIT` §9.4 forbids a
   * hook without art as firmly as art without a hook, and no delivery of this
   * sheet has yet been accepted (AS3 rejected, AS5b/c/d/e rejected). Absent, the
   * planner pushes no underside piece at all: no placeholder, no `massStems`
   * entry, no claim on the dead-art ceiling, and the display list is identical
   * object for object (measured, R5-W7 · A8 report §1). Present, the band
   * appears with no other change anywhere — `PaintScene#placeMassPiece` is
   * generic over `MassKind`.
   */
  edgeD?: readonly string[];
  /**
   * Drawn ramp masses for the 45°/30° slope glyphs — OPTIONAL since R5-W6 · A7
   * (D-324).
   *
   * These were mandatory fields, and the only thing that filled them was
   * `sharedRamps()`, which named two PNGs that no longer exist: R109 struck the
   * ramps from the commission and E6 deleted `mass_ramp_up`/`_down` after
   * measuring that ch01 carries ZERO slope glyphs across all five surfaces, so
   * `planMass` never plans a ramp piece. A required field whose only value is
   * the name of a deleted file is worse than an absent one — it type-checks, it
   * reads as a promise, and the first surface that grows a slope would have
   * drawn a hole in the floor.
   *
   * Absent is now the honest state, and it is enforced from both ends: `planMass`
   * throws rather than draw nothing if a slope ever meets a kit without ramp art,
   * and `composition.test.ts`'s D-267 law fails any phase whose grid carries
   * `/ \ 1 2 3 4` unless its kit both DECLARES the sheets and has them on disk.
   */
  rampUp?: string;
  rampDown?: string;
  /**
   * R5-W4 · A6 — HOW FAR THIS ROOM LAYS ITS TRIMS BACK, as a multiply.
   *
   * `mass.ts#TRIM_SHADE` is one number for the whole school, and it was
   * calibrated against ONE sheet: the shared 71.5 %-luminance trim over a 46.2 %
   * body. That was defensible while every room drew the same two strips. It stops
   * being defensible the moment a room has trims of its own — 0.62 applied to
   * p1's painted 54.9 % lands at 34 %, twelve points UNDER its own body, and the
   * carved edge turns into a groove.
   *
   * So the lay-back belongs to the kit, beside the art it is calibrated for.
   * Absent, the global still applies, which is what every unpainted room wants.
   */
  trimShade?: number;
  /**
   * Floating platforms are COMPLETE OBJECTS — a palette, widest first.
   * `deck` is where the WALK SURFACE sits inside the art, as a fraction of its
   * height: the AF2 bench carries a backrest over its seat (deck 0.10), so
   * anchoring it by its top edge would sink the seat below the standable line
   * and bury the backrest in the floor. 0 = the art's top edge IS the deck.
   */
  platObjects: readonly { stem: string; cells: number; deck?: number;
    /** R7 · Auflösungs-Stufe eines NEU gemalten Blatts (Quell-px je Zelle).
     *  Deklariert nimmt Audit 10 das Blatt aus der Kurs-Paritäts-Messung —
     *  seine Stufe ist Absicht (Ein-Block-Welt), nicht Drift. */
    pxPerCell?: number }[];
  /** Complete vertical book objects, matched to `columnRuns` by cell size. */
  columnObjects?: readonly ColumnObject[];
  /**
   * R6 · deklarierte Sicht-Körper (visualBodies.ts): je Körper EIN Gemälde in
   * exakter Zellmaske. `planMass` claimt ihre Zellen VOR allem anderen; alles
   * Nachgelagerte (Kurs, Trims, Innenmasse, Grain, Säulen) lässt sie aus.
   */
  bodies?: readonly VisualBody[];
  /** p1/p2 crust ends are painted into the one-piece/phase family. */
  integratedCrustEnds?: boolean;
  /** false disables the legacy procedural rectangle grain for this phase. */
  proceduralGrain?: boolean;
  /** the chalk slide (`z` runs): top / repeatable mid / run-out foot + strut. */
  slide?: { top: string; mid: string; foot: string; under: string };
  /** Painted bindery at the outside ends of platform-object groups. */
  joint?: string;
  /** Painted saddle/collar where a post meets a mass top or platform lip. */
  postJoin?: string;
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

/**
 * The MULTIPLY tint the nearest standable plane wears in a room of this key.
 *
 * ── ★ R5-W7 · A8 · IT TAKES LIGHT, NOT COLOUR (Ruling R194, D-270 closed) ────
 * This used to read „cooler than it is dark: red loses the most, blue the
 * least", and the arithmetic said so — (1 − 1.15d, 1 − d, 1 − 0.6d). The
 * sentence describes a shadow; what the formula actually does is DESATURATE,
 * and two independent measurements caught it:
 *
 *  · `check-composition`'s own audit-11 note (D-184, R5-W4 · A6): of p1's 22.4
 *    ΔS between walk course and body, „roughly twelve points are nearPlaneTint
 *    rather than the paint" — the course is drawn greyer than it was painted.
 *    Filed at the time as a property of a declared law rather than a fault.
 *  · P6, 2026-08-20: the grey wedge in Koki's frame `07.29.42` IS this. The
 *    crust — the surface the child stands on — measures 53.5 % colour strength
 *    on the sheet and 14.2 % on screen. This formula predicts 12.2. Two points
 *    from a photograph is not a coincidence; it is the cause.
 *
 * So all three channels now take the SAME factor. The purpose survives intact —
 * the near plane still separates from the room behind it — because separation
 * was always carried by VALUE, and value barely moves: weighted the way a
 * luminance is weighted (0.2126 · 0.7152 · 0.0722), the old triple came to
 * 1 − 0.9968·d against the new 1 − d. At d = 0.36 that is 0.6412 against 0.6400
 * — three tenths of one level out of 255. What goes is the cast, not the push.
 * `composition.test.ts` holds both halves of that sentence as law.
 *
 * (The push itself, and why it scales with the room's key, is unchanged — see
 * NEAR_PLANE_PUSH above.)
 */
export const nearPlaneTint = (key: number): number => {
  const d = Math.min(NEAR_PLANE_PUSH, Math.max(0.1, NEAR_PLANE_PUSH * (key / 88)));
  const v = Math.round(255 * (1 - d));
  return (v << 16) | (v << 8) | v;
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

// ── R5-W3 · A5 · D-45 · THE CHECKPOINT GETS THE SAME EDGE THE CHILD DOES ─────
//
// B1's critic: the Krakel marker „hat in den hellen Leveln keinen Eigenkontrast
// und wurde beim Banking in p1 vom Spieler komplett verdeckt". Two defects in
// one sentence, and both are measurable.
//
// THE VALUE, measured with check-composition's own formula: `krakel_a` is
// 48.8 % mean luminance. p1's furniture band is 54.6 % and p3's is 51.1 % — so
// the one prop in the chapter whose entire job is to be spotted from across the
// room stands 5.8 and 2.3 points from the furniture it stands against. That is
// less separation than the child himself had before H2 gave him a contour, and
// audit 9 could not see it because audit 9 only ever looked at him.
//
// The repair is not new art and not a new idea: it is HIS contour, pointed at
// the marker. `heroEdgeFor` is already room-aware — ink in a lit hall, warm rim
// in a dark one — which is exactly the property a marker needs across five
// rooms. Aliasing rather than copying is the point: one scheme, two readers, no
// second table to drift.
export const markerEdgeFor = (key: number): HeroEdge => heroEdgeFor(key);

/** The marker's drawn height in world px (PaintScene.buildProps). */
export const MARKER_H = 26;

/**
 * D-45's second half. The marker stood dead-centre on the very cell the child
 * stands on to bank: 30.0 × 26.0 px at depth 3, behind a 23.0 × 35.6 px boy at
 * depth 10, origins both (0.5, 1) on one standing line. That hides 598 of its
 * 780 px² — 77 % — and the 23 % that survives is two slivers three pixels wide.
 * „Completely hidden" was very nearly literal, and no contour can fix an object
 * that is not on the screen.
 *
 * So Krakel steps aside — which is also the truer picture, because a person
 * sketching you stands BESIDE you. He only steps where the grid has ground to
 * step onto; where it has none he stays, and the audit says so out loud rather
 * than letting him quietly disappear.
 */
export const MARKER_STANDOFF_PX = 18;
/** How much of the marker must clear the child who is banking at it. */
export const MARKER_VISIBLE_MIN = 0.55;

const SOLID_GLYPHS = new Set(["#", "~", "="]);
const solidAt = (rows: readonly string[], c: number, r: number): boolean =>
  r >= 0 && r < rows.length && c >= 0 && c < (rows[r]?.length ?? 0) && SOLID_GLYPHS.has(rows[r]?.[c] ?? " ");

/** Which way the marker steps, and how far. LEFT is tried first: in p1 the only
 *  other thing near the checkpoint is a bouncer homing one cell to its RIGHT. */
export const markerPlacementFor = (rows: readonly string[], c: number, r: number): { dx: number; why: string } => {
  const standable = (cc: number): boolean => solidAt(rows, cc, r + 1) && !solidAt(rows, cc, r);
  if (standable(c - 1)) return { dx: -MARKER_STANDOFF_PX, why: "stepped left onto its own ground" };
  if (standable(c + 1)) return { dx: MARKER_STANDOFF_PX, why: "stepped right onto its own ground" };
  return { dx: 0, why: "nowhere to step — the cell is one wide" };
};

/** The fraction of the marker's drawn box the child does NOT cover, both boxes
 *  origin (0.5, 1) on one standing line. An axis-aligned FLOOR, not a pixel
 *  truth: two painted silhouettes overlap less than their boxes do, so a number
 *  that clears the law here clears it on the screen too. */
export const markerVisibleFraction = (markerW: number, heroW: number, dx: number): number => {
  const overlap = Math.max(0, (markerW + heroW) / 2 - Math.abs(dx));
  return markerW <= 0 ? 0 : Math.max(0, 1 - Math.min(overlap, markerW) / markerW);
};

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
export const massStems = (m: MassKit, oneBlock = false): string[] => {
  // R7/N7 · DER BERECHNETE CUTOVER. `oneBlock` kommt aus `mass.ts#phaseIsOneBlock`
  // und ist keine Meinung: es sagt, dass die Sicht-Koerper dieser Phase JEDE
  // solide Zelle besitzen, die nicht einem Moebel gehoert. Dann plant planMass
  // kein Kit-Stueck mehr, und diese Liste — die entscheidet, was ein Raum
  // LAEDT — darf die Kruste, die Masse, die Trims und die Unterseite nicht
  // laenger nennen. Was sie weiter nennt: die Moebel, die Saeulen, die Koerper
  // selbst und die Rutsche. Ein Raum, der sein Kit noch listet, obwohl er es
  // nie zeichnet, ist genau der stille Speicherfresser, gegen den die
  // Tot-Kunst-Ratsche gebaut wurde.
  const out: string[] = [];
  if (!oneBlock) out.push(...m.crust, m.crustCapL, m.crustCapR, ...m.body, ...(m.bodyDeep ?? []), ...m.fade, m.sediment);
  // ★ R5-W5 · E6 · D-267 · `m.rampUp` und `m.rampDown` stehen hier NICHT MEHR.
  // Diese Liste ist es, die entscheidet, was eine Phase lädt (über
  // `compositionStems` → `phaseArtScope`), und ch01 hat null Steigungs-Glyphen
  // (`/ \ 1 2 3 4`), also plant `planMass` nie ein Rampen-Stück. Beide Blätter
  // lagen trotzdem in allen fünf Phasen-Scopes und kosteten Texturspeicher für
  // ein Bild, das nicht vorkommen kann. Die zwei PNGs sind in diesem PR gelöscht
  // (Kokis Entscheidung 17.08.: löschen statt dulden — die Versionsgeschichte
  // hält sie, und eine Fläche mit echten Steigungen bestellt Rampen ohnehin neu,
  // R109). Die Kit-Felder selbst bleiben, weil `mass.ts#planMass` sie verlangt;
  // dass beides zusammenpassen MUSS, hält jetzt ein Gesetz in
  // `composition.test.ts` fest: sobald irgendein Gitter einen Steigungs-Glyph
  // trägt, müssen die Rampen-Blätter seines Kits auf der Platte liegen.
  if (!oneBlock) out.push(m.edgeL, m.edgeR, m.cornerBL, m.cornerBR, m.inCornerL, m.inCornerR);
  if (!oneBlock && m.joint !== undefined) out.push(m.joint);
  if (!oneBlock && m.postJoin !== undefined) out.push(m.postJoin);
  // ★ R5-W7 · A8 · D-27. Conditional, like the ramps above are absent: this list
  // decides what a phase LOADS (`compositionStems` → `phaseArtScope`) and it is
  // the floor `check-paint-art` measures against, so an unconditional underside
  // would demand a PNG that no accepted delivery has ever contained — the exact
  // failure mode D-27's own register line names. A kit without the sheet lists
  // nothing extra and the stem count does not move (53 before, 53 after).
  if (!oneBlock && m.edgeD !== undefined) out.push(...m.edgeD);
  out.push(...m.platObjects.map((p) => p.stem));
  out.push(...(m.columnObjects ?? []).map((p) => p.stem));
  // Körper-Blätter: gemountet werden die Slices (falls geschnitten), sonst das
  // eine Blatt — exakt enumeriert, kein Laufzeit-Raten (check-paint-art bleibt hart).
  out.push(...(m.bodies ?? []).flatMap((b) => (b.slices ?? []).length > 0
    ? (b.slices ?? []).map((s) => s.stem)
    : [b.stem]));
  if (m.slide) out.push(m.slide.top, m.slide.mid, m.slide.foot, m.slide.under);
  return [...new Set(out)];
};

/** Every stem a spec references — the art gate's requirement list. */
export const compositionStems = (spec: CompositionSpec, oneBlock = false): string[] => {
  const out: string[] = [];
  for (const plane of [spec.far, spec.midFar, spec.mid, spec.fg]) {
    if (!plane) continue;
    out.push(...plane.segments);
    if (plane.anchor) out.push(plane.anchor.stem);
  }
  out.push(...massStems(spec.mass, oneBlock));
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
  // R4 deck measurement: each RGBA sheet was scanned from the top; the deck
  // is the first row reaching 90% of the maximum opaque span. The source rows
  // are recorded in the R4 delivery note, so these fractions are reproducible
  // measurements rather than visual guesses.
  // p1 Eingangshalle — folio, tied bundle, reading bench, and two carved shelves.
  p1: [
    { stem: "terrain_reading_bench_p1", cells: 2, deck: 62 / 194 },
    { stem: "terrain_book_bundle_p1", cells: 2, deck: 33 / 185 },
    { stem: "terrain_book_shelf_p1", cells: 3, deck: 104 / 210 },
    { stem: "terrain_book_shelf_p1_alt", cells: 3, deck: 36 / 232 },
    { stem: "terrain_book_folio_p1", cells: 1, deck: 22 / 79 },
  ],
  // p2 Klassenzimmer — night folios, bundles, lecterns, and continuous shelves.
  p2: [
    { stem: "terrain_night_lectern_shelf_p2", pxPerCell: 64, cells: 4, deck: 66 / 170 },
    { stem: "terrain_night_shelf_p2", pxPerCell: 64, cells: 3, deck: 4 / 96 },
    { stem: "terrain_night_bundle_p2", pxPerCell: 64, cells: 2, deck: 8 / 138 },
    { stem: "terrain_night_lectern_p2", cells: 2, deck: 22 / 215 },
    { stem: "terrain_night_folio_p2", pxPerCell: 64, cells: 1, deck: 6 / 33 },
    { stem: "terrain_night_dictionary_p2", pxPerCell: 64, cells: 1, deck: 4 / 33 },
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
    // R5-W9 · M1: 2 → 4 Zellen (gemalt 3,82 in diesem Raum; 0,52x → 1,05x).
    { stem: "plat_plank_2", cells: 4, deck: 0 },
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

/** R4 · one-piece columns. These are deliberately phase-owned: p1/p2 are the
 * commissioned replacement for the old join/saddle construction; other phases
 * keep their existing scenery until a matching sheet is ordered. */
const COLUMN_OBJECTS: Record<string, NonNullable<MassKit["columnObjects"]>> = {
  p1: [{ stem: "terrain_atlas_podest_p1", cellsW: 2, cellsH: 2 }],
  // R7: p2 ist Ein-Block-Welt — alle Säulen/Pfeiler sind von den Körpern
  // ABSORBIERT (Treppe in der Ostwand, Hänger in den Deckenbahnen); die sieben
  // Blätter sind gelöscht. Kokis "tilted"-Befund stirbt per Löschung.
  p2: [],
};

/**
 * R5-NACHSTEUER-3 · A4 · WHICH PHASES OWN A PAINTED MASS KIT.
 *
 * The Massen-Kit is commissioned per room (SPEC_MASSEN_KIT: three sheet classes
 * × five phases). It arrives one room at a time, calibration first, so this set
 * is the seam between "painted" and "still on the shared body".
 *
 * It has to be a DECLARED list rather than a probe, because `massStems` feeds
 * `check-paint-art`, which hard-fails on a stem with no PNG (D-27) — naming a
 * phase here before its sheets land reds the gate. Add a phase on the same
 * commit that adds its art, never before.
 *
 * Batch AS2 was REJECTED here for a measured reason worth keeping: every one of
 * its cells duplicated its boundary row and column, so a naive seam test read a
 * perfect 0.00 while the picture jumped 25–52 one pixel further in. AS3 re-cut
 * the same sheets with a real cross-fade — the join is still 0.00, but now the
 * picture climbs out of it at 0.26–0.62× the painting's own texture instead of
 * jumping. The import gate tells the two apart and holds both cases as fixtures.
 */
/**
 * R5-W9 · M1 · WELCHE RAEUME EINE ECHTE AUSSENKANTE HABEN (Posten 4, R212a).
 *
 * `canopy_fringe_loop` ist eine HECKE: gemalte Blattbueschel, die von der
 * obersten Reihe herabhaengen, damit eine Welt unter freiem Himmel nicht an
 * einer geraden Kante aufhoert. `PaintScene#buildTerrain` hat sie bis heute
 * KIT-UNABHAENGIG gezeichnet — auf jeder Solid-Zelle in Reihe ≤ 1, deren
 * Unternachbar Luft ist, in allen fuenf Raeumen. Gemessen in der laufenden p3:
 * EIN TileSprite ueber die volle Weltbreite (1024 x 26 px, Tiefe 2).
 *
 * In ch01 spielt jeder Raum INNERHALB des Buches: Eingangshalle, Nacht-
 * Klassenzimmer, der gemalte Schulhof (eine Wand mit Rundbogenfenstern und
 * einer Laterne — sein Himmel ist Malerei, keine Kante), die Tafel-Buehne, die
 * Kleckskammer. Eine Hecke an der Decke eines Klassenzimmers ist genau die
 * Art von unverwandter Kunst-Familie, die R212 den „Block-Mess" nennt.
 *
 * Die Menge ist deshalb LEER — und das ist eine Deklaration, keine Loeschung.
 * Das Blatt bleibt auf der Platte und in der Bibliothek; der erste Raum mit
 * einer echten Aussenkante (ch02+) traegt sich hier ein und bekommt seine
 * Hecke zurueck, ohne dass jemand Code sucht.
 *
 * ⚠ FOLGE, im selben PR gebucht: ohne Eintrag laedt kein Raum das Blatt mehr,
 * also zaehlt `check-paint-art` es als tote Kunst — die Decke steigt um eins.
 * Genau so soll eine Ratsche sich anfuehlen: sichtbar, begruendet, datiert.
 */
export const CANOPY_PHASES = new Set<string>([]);

const PAINTED_MASS_PHASES = new Set(["p1", "p2"]);

const paintedInterior = (phase: string): Pick<MassKit, "body" | "bodyDeep" | "fade" | "sediment"> => ({
  // Four variants where the shared body has two — and Audit 6 counts variety.
  body: phase === "p2"
    ? ["mass_body_p2_a", "mass_body_p2_b"]
    : [`mass_body_${phase}_a`, `mass_body_${phase}_b`, `mass_body_${phase}_c`, `mass_body_${phase}_d`],
  ...(phase === "p2"
    ? {}
    : { bodyDeep: [`mass_bodydeep_${phase}_a`, `mass_bodydeep_${phase}_b`, `mass_bodydeep_${phase}_c`, `mass_bodydeep_${phase}_d`] }),
  fade: phase === "p2" ? ["mass_fade_p2_a", "mass_fade_p2_b"] : [`mass_fade_${phase}_a`, `mass_fade_${phase}_b`],
  // R5b: p1/p2 use phase-owned readable depth sheets. The shared near-black
  // `mass_sediment` remains only for p3/p4/p9, where that depth family has not
  // landed yet; the healing is therefore scoped to the two commissioned rooms.
  sediment: phase === "p1" ? "mass_depth_p1" : "mass_depth_p2",
});

/** The shared interior + trims — one body for the whole school (AF group 3),
 *  now only for the phases whose own paper has not been painted yet. */
const sharedInterior = (): Pick<MassKit, "body" | "fade" | "sediment"> => ({
  body: ["mass_body_a", "mass_body_b"],
  fade: ["mass_fade"],
  sediment: "mass_sediment",
});

/**
 * R5-W4 · A6 · WHICH PHASES OWN PAINTED TRIMS.
 *
 * A second declared list, and deliberately not the same one as
 * `PAINTED_MASS_PHASES`, because the two arrive on different sheets: p1's body
 * landed in AS3 last week and its edges landed today. Folding them together
 * would mean a room could not have one without the other, and the next room will
 * be in exactly that position.
 *
 * Same law as §9.2, for the same reason: `massStems` feeds `check-paint-art`,
 * which hard-fails on a stem with no PNG. **A phase joins this list on the same
 * commit that adds its art, never before.**
 *
 * R5b status: p1 and p2 now use phase-owned side and corner sheets. The
 * original AS3 side motif was held because it showed book covers face-on rather
 * than the cut edge of the mass; the R5b sheets below are the scoped replacement.
 * Their colour and scale are checked by `check-composition` audit 10/11.
 *
 * ── ★ R5-W7 · A8: THE HOOK IS BUILT, AND §9.4 IS ANSWERED RATHER THAN BROKEN ─
 * This paragraph used to end „so there is no `edgeD` field and no `MassKind` for
 * one — SPEC §9.4 cuts both ways, and a hook without art is the same mistake as
 * art without a hook". Both halves of that sentence were right about the DANGER
 * and wrong about the remedy, and the difference is worth writing down, because
 * it is the difference between an empty promise and an inert one.
 *
 * What §9.4 forbids is a hook that DRAWS something when the art is missing — a
 * placeholder in the floor, a stretched neighbour, a silent hole. Every one of
 * those is a picture the child sees and nobody ordered. What it cannot sensibly
 * forbid is a hook that does NOTHING: `MassKit.edgeD` is optional, `massStems`
 * skips it when it is absent, and `planMass` never enters its branch, so a kit
 * without the sheet produces byte-for-byte the same plan and the same display
 * list as before this change (measured across all five surfaces — 236 · 481 ·
 * 331 · 103 · 118 objects, unchanged). The one thing that DID exist without art
 * — a raw horizontal cut along the bottom of every overhang, five rooms wide —
 * is the defect D-27 has been carrying since R5-W1.
 *
 * R5b closes that order for p1/p2: `edgeD` is phase-owned, listed by
 * `massStems`, and emitted by `planMass`; p3/p4/p9 remain on the shared kit
 * until their own underside deliveries land.
 */
const PAINTED_TRIM_PHASES = new Set<string>(["p1", "p2"]);

/**
 * R5-W4 · A6 · THE LAY-BACK, PER ROOM (Koki's ruling of 2026-08-15).
 *
 * `mass.ts#TRIM_SHADE` = 0x9e9e9e stays the default for any room not named here.
 * These are the rooms whose own measurement says the default is wrong for them.
 * Every number is derived by `scripts/check-composition.mjs` audit 11 from the
 * kit's own PNGs and re-checked on every CI run, so a repainted sheet cannot
 * leave a stale constant behind — the audit fails on the drift, by name.
 *
 * p1 — the painted trims (AS3) are commissioned to §5's target: 55.09 % against a
 * 46.01 % body, +9.08. The global 0.62 would drag them to 34.2 %, a groove twelve
 * points UNDER the body.
 *
 * ── AND WHY IT IS NOT 1.0, WHICH IS WHERE THIS FIRST LANDED ──────────────────
 * Taking the room's light unchanged satisfied the carve window on the MEAN and
 * blew the highlights. A blind critic caught it in the frame before any gate did:
 * at the walking-surface row the flank drew **(255, 255, 254)** — "the terrain's
 * edge is brighter than the sunlit window behind it".
 *
 * The measurement behind that sentence, and the reason a mean could not see it:
 *
 *            mean     p95      max
 *   body     46.01   84.27    87.1
 *   trim     55.09   92.74   100.0     ← its painted page-edges are pure white
 *
 * The sheet has a WIDER RANGE than the body it is cut into, so one multiply
 * cannot match both ends: 1.00 matches the mean and overshoots the peak by 8.5;
 * 0.85 matches nothing. 0.92 is the value where the peaks meet (85.3 against
 * 84.27, +1.0) and the mean still clears §5's floor (+4.7, window +2…+14).
 *
 * Audit 11 now holds BOTH ends — `COHERENCE_MAX.peak` — so this class cannot
 * come back through a gate that was only ever looking at averages.
 *
 * ── AND WHY IT IS EMPTY TODAY ────────────────────────────────────────────────
 * p1's entry (0xebebeb) was calibrated for the PAINTED sheet, and that sheet is
 * held (see `PAINTED_TRIM_PHASES`). Left behind it would apply a painted sheet's
 * lay-back to the shared placeholder and draw p1's trims at +19.1 — audit 11
 * catches exactly that, which is the point of deriving the number instead of
 * choosing it. It comes back with the re-cut, not before.
 */
const TRIM_SHADE_BY_PHASE: Record<string, number | undefined> = {
  // ── R5-W9 · M1 · p1 IST DER EINE RAUM, DEN DER SCHUL-STANDARD FALSCH KLEIDET
  //
  // ★ ERKLAERTES INTERIM. Der Schluss ist die MALEREI (AS6): sobald p1 sein
  // eigenes Kit bekommt, wird diese Zahl an der neuen Lieferung nachgemessen
  // und faellt oder aendert sich. Sie kauft keine Ruhe, sie kauft die Zeit bis
  // dahin — und Audit 11 leitet sie bei jedem CI-Lauf aus den Blaettern selbst
  // ab, kann also nicht als schale Konstante zurueckbleiben.
  //
  // ── DIE ABLEITUNG, MIT DEN GEMESSENEN ZAHLEN ────────────────────────────────
  // Dieselbe Methode wie `mass.ts#TRIM_SHADE` (dort in Langform): Ziel = die
  // FARBRICHTUNG der Flaeche, aus der die Kante geschnitten ist, getragen auf
  // Koerperwert + 8; Tint = Ziel / Trim.
  //
  //   p1-Koerper (mass_body_p1_a…d)  rgb 164,0 · 110,7 · 46,9   Wert 46,05 %  Saettigung 71,2 %
  //   Trim       (mass_edge_l/r)     rgb 212,9 · 177,8 · 135,8  Wert 71,45 %  Saettigung 37,5 %
  //   Ziel = p1-Koerper-Richtung auf 54,05 %                 ⇒  Tint 0xe7ba67
  //   Gezeichnet: Wert 54,05 % (Kerbe +8,0, Fenster +2…+14) · Saettigung 71,4 %
  //   gegen einen Koerper von 71,2 % — **0,2 Punkte auseinander.**
  //
  // Heute traegt p1 den Schul-Standard 0xdabe90. Der ist aus dem GETEILTEN
  // Koerper (mass_body_a/b, Saettigung 59,5 %) abgeleitet und deshalb fuer die
  // vier ungemalten Raeume richtig — aber p1 hat seit AS3 sein EIGENES Papier,
  // und das ist waermer und um 11,7 Punkte satter. Gemessen zieht der Standard
  // p1s Kante auf 57,8 % Saettigung gegen einen 71,2-%-Koerper: **13,4 Punkte**,
  // wo die Ableitung 0,2 erreicht. Das ist genau der Bruch, den `TRIM_SHADE`s
  // eigener Kommentar mit „eine Zahl, weil es EIN Kit gibt" fuer den Tag
  // angekuendigt hat, an dem ein Raum sein eigenes bekommt.
  //
  // ── UND WARUM NICHT „Richtung Kurs-Familie", wie der Auftrag vorschlug ──────
  // Beide Richtungen sind gerechnet worden, je Raum. Die Kurs-Richtung ist
  // gemessen SCHLECHTER, und in zwei Raeumen bricht sie das Kohaerenz-Gesetz:
  //   p9  Tint 0xb2c0ff → Trim-Saettigung  9,6 % gegen Koerper 59,5 % (49,9 auseinander)
  //   p3  Tint 0xc3c2cc → 33,6 % gegen 59,5 % (25,9 — ueber der 25er-Linie)
  //   p4  Tint 0xff9ae1 → rosa, Kerbe faellt auf +4,6
  //   p2  Tint 0xbdaeff → 22,8 % gegen 59,5 %, Kerbe +4,4
  //   p1  Tint 0xe2ba85 → 62,4 % gegen 71,2 % (8,8) — auch hier schlechter als 0,2
  // Der Grund ist kein Geschmack: eine Kante ist der SCHNITT durch den Koerper,
  // nicht durch den Laufkurs, der obendrauf liegt. Ein Trim in Kurs-Farbe faerbt
  // die Schnittflaeche nach der Farbe der Oberseite — bei p2/p4/p9 heisst das
  // violett/rosa/blau geschnittenes Buchpapier. Gemeldet, nicht still umgesetzt.
  //
  // R5b: p2 now has phase-owned blue-violet edge sheets. They already carry
  // the p2 material direction, so the correct pass is neutral: do not lay the
  // global grey multiply over them. This places the cut edge about eight
  // luminance points above the p2 body and removes the former waiver.
  p1: 0xe7ba67,
  p2: 0xffffff,
};

const paintedTrims = (phase: string): Pick<MassKit, "edgeL" | "edgeR" | "cornerBL" | "cornerBR" | "inCornerL" | "inCornerR"> => ({
  edgeL: `mass_edge_${phase}_l`,
  edgeR: `mass_edge_${phase}_r`,
  cornerBL: `mass_corner_${phase}_bl`,
  cornerBR: `mass_corner_${phase}_br`,
  inCornerL: `mass_incorner_${phase}_l`,
  inCornerR: `mass_incorner_${phase}_r`,
});

/**
 * R5-W7 · A8 · D-27 · WHICH ROOMS HAVE AN ACCEPTED UNDERSIDE BAND.
 *
 * Its own set rather than a field inside `paintedTrims`, and the reason is the
 * history: the underside is the cell that keeps failing ALONE. AS3 delivered
 * eight cells, six of which were good enough to import and two of which — 2 and
 * 3, the undersides — did not tile sideways at any width or offset (75.73
 * against a texture step of 5.58). Tying the band to `PAINTED_TRIM_PHASES` would
 * mean a room could not take its side trims until its underside also passed,
 * which is exactly the coupling that left D-27 open for three waves.
 *
 * R5b: p1 and p2 are now admitted. Each entry is earned by a phase-owned
 * sheet, the art gate, and the seam audit; unpainted rooms remain outside it.
 */
const PAINTED_UNDERSIDE_PHASES = new Set<string>(["p1", "p2"]);

/** the underside band's two variants, in the order the edge sheet cuts them.
 *  ⚠ the class name is `edgeD`, camel-cased, because that is what
 *  `docs/art/import-batch-as.mjs#AS5_EDGE_CELLS` already writes to disk — the
 *  two sides of this contract must spell it the same or the art is invisible. */
const paintedUnderside = (phase: string): Pick<MassKit, "edgeD"> => ({
  edgeD: [`mass_edgeD_${phase}_l`, `mass_edgeD_${phase}_r`],
});

/**
 * ── THE RAMPS ARE NOT DRAWN AT ALL, AND NEVER HAVE BEEN (R5-W4b · A6b) ──────
 * This round set out to give four rooms a painted ramp. Batch AS5 delivered
 * them, eight of its cells passed the import gate, and one — p3's — was even
 * correct against the body it would really lie on. It was imported, wired behind
 * a `PAINTED_RAMP_PHASES` switch, and then taken out again, because of a
 * question nobody in this lane had asked:
 *
 *   `planMass` pushes a `ramp` piece only for the slope glyphs `/ \ 1 2 3 4`
 *   (`z` is the chalk slide and is handled by its own branch). Counted across
 *   EVERY surface of ch01 — p1, p2, p3 and the arena/bonus grids p4, p9 —
 *   there are ZERO such glyphs. Not few: none.
 *
 * So no ramp piece is ever planned, `mass_ramp_up`/`_down` are never drawn, and
 * a painted ramp would have been texture memory spent on a picture that cannot
 * appear. `massStems` lists them unconditionally, so both placeholders ARE
 * loaded into all five phase scopes today, paying for nothing (D-267).
 *
 * ⚠ The corollary matters more than the ramps: the "grey wedge" in Koki's
 * `07.29.42`, which A6's report and this round's brief both attribute to
 * `mass_ramp_up`, CANNOT be that sheet. Whatever he photographed is something
 * else, and it is still there. Report §2.
 */
/** the shared placeholder trims — one set of strips for every unpainted room */
const sharedTrims = (): Pick<MassKit, "edgeL" | "edgeR" | "cornerBL" | "cornerBR" | "inCornerL" | "inCornerR"> => ({
  edgeL: "mass_edge_l",
  edgeR: "mass_edge_r",
  cornerBL: "mass_corner_bl",
  cornerBR: "mass_corner_br",
  inCornerL: "mass_incorner_l",
  inCornerR: "mass_incorner_r",
});

const sharedMass = (phase: string): Omit<MassKit, "crust" | "crustCapL" | "crustCapR" | "slide"> => ({
  ...(PAINTED_MASS_PHASES.has(phase) ? paintedInterior(phase) : sharedInterior()),
  ...(PAINTED_TRIM_PHASES.has(phase) ? paintedTrims(phase) : sharedTrims()),
  // …and the underside separately (D-27). There is no shared fallback on
  // purpose: the placeholder set has no underside strip, and inventing one out
  // of a side trim would draw a book's cut face where the bottom of the stack
  // belongs — §10.3's motif law, drawn by the engine instead of by a painter.
  ...(PAINTED_UNDERSIDE_PHASES.has(phase) ? paintedUnderside(phase) : {}),
  trimShade: TRIM_SHADE_BY_PHASE[phase],
  integratedCrustEnds: phase === "p1" || phase === "p2",
  proceduralGrain: phase !== "p1" && phase !== "p2",
  // R4: p1/p2 now use complete one-piece art; joins remain available for the
  // untouched phases until their own one-piece commission arrives.
  ...(phase === "p1" || phase === "p2" ? {} : { joint: TERRAIN_JOIN_STEM, postJoin: TERRAIN_POST_JOIN_STEM }),
  // No ramp sheets: R109 withdrew them and E6 deleted the two placeholders. A
  // surface that grows a slope orders its own (D-324, and the field's own note).
  platObjects: PLAT_OBJECTS[phase] ?? PLAT_OBJECTS.p1 ?? [],
  columnObjects: COLUMN_OBJECTS[phase] ?? [],
  // R6 · Ein-Block-Welt: deklarierte Sicht-Körper. Ein Eintrag in CH01_BODIES
  // kommt erst MIT seinem angenommenen PNG (check-paint-art bleibt hart).
  bodies: CH01_BODIES[phase] ?? [],
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
    // ── R5-T10 · DIE SCHLUESSELZAHL FOLGT DER NACHT (R231, 2026-08-31) ───────
    //
    // K ist die Helligkeit der Raumluft, und aus ihr leitet `bandsFor(K)` JEDES
    // Ebenen-Fenster ab. 28 war der Wert des HELLEN Saals. Seit AQ13C7 ist die
    // Buehne ein Nacht-Saal, und seit heute sind es auch die zwei Moebelbaender
    // davor (AQ22, Wareneingang 30.08., beide Blaetter Panel-abgenommen und
    // byte-eingefroren). Die Deklaration folgt der Wahrheit — genau wie bei p9,
    // das aus demselben Grund von 16 auf 14 ging.
    //
    // Gemessen am Stand DIESES Commits, gegen `bandsFor(19)`:
    //   L0 Waesche   19,07 %  Fenster 17,67–20,52  (Rand 1,40 / 1,45)
    //   L1 Wand      16,3  %  Fenster 15,20–19,00
    //   L2 Band      11,6  %  Fenster  9,50–14,25
    //   L1↔L2-Kluft   4,7 Punkte      Gesetz >= 0,10·K = 1,9
    //   L2b rendert  ~14,5 %          Gesetz >= 0,04·K = 0,76 von beiden
    // Damit faellt `DEPTH_WAIVERS["ch01/p4"]` (D-672) ersatzlos — die Ausnahme
    // hatte GENAU DIESE Lieferung gekauft, und sie ist da.
    //
    // ⚠ EINE NIEDRIGERE SCHLUESSELZAHL ALLEIN LOEST ES NICHT, und der alte
    //   Kommentar in check-composition.mjs sagt das zu Recht: durchgemessen an
    //   der HELLEN Kunst ergab K = 19 sogar VIER Befunde statt drei. Was hier
    //   traegt, ist der Zug aus K + neuer Kunst + neuer Waesche zusammen.
    //
    // ⚠ K IST KEIN REINES MESS-STELLRAD. `nearPlaneTint(key)` multipliziert die
    //   begehbare Nahebene zur LAUFZEIT (PaintScene): 28 ergibt 0xe2e2e2, 19
    //   ergibt 0xe6e6e6 — die Formel laeuft bei K=19 in ihren eigenen Boden
    //   (d = 0,1), der Laufkurs wird also um 4 von 255 heller GEZEICHNET.
    //   `heroEdgeFor` dagegen ist eine Stufe bei K = 50; 28 und 19 liegen beide
    //   darunter, die Kontur des Kindes bleibt unveraendert. Beides gemessen,
    //   nicht angenommen.
    key: 19,
    // Die Waesche zieht mit, als WERT-Pass im Sinn des Malers: EIN
    // multiplikativer Faktor k = 0,72094 auf R, G und B (26,486 % → 19,073 %,
    // die Mitte des neuen Fensters). Leuchtdichte ist linear in den Kanaelen,
    // also bewegt k den Mittelwert um exakt k; Farbton und Saettigung bleiben
    // die des Malers, weil (max − min) / max massstabsinvariant ist — gemessen
    // 21,150 % → 21,138 %.
    // ⚠ Die Saettigung lag schon VOR diesem Zug ueber der 20er-Kappe und liegt
    //   danach genauso darueber. Das Tor MELDET sie (audit 1 laesst nur die
    //   Leuchtdichte durchfallen); dieser Zug hat sie nicht bewegt.
    wash: { colors: [0x2a2534, 0x352d38, 0x43393b] },
    far: shell("p4", 0.25),
    // R5-W2 · H1 · THE CLASS IS MISSING, AND NOW YOU CAN SEE IT.
    //
    // The arena's whole premise is the story bible's own line: „Reihen leerer
    // Stühle in der Ferne — die Klasse fehlt, und das Loch ist die Erzählung."
    // The art for it has been on disk all along and the level declares it —
    // `arena.plates.mid = "band_p4_audience"`, rows of empty wooden SCHOOL
    // chairs. It has never been drawn: `plates` feeds only the legacy backdrop,
    // and `buildBackdrop` returns early for any composed phase, which p4 is.
    // `pnpm check:paint-art` has been listing it under „loaded by nothing" the
    // whole time. What rendered instead was `l2_p4` — blue Victorian armchairs
    // and a sofa. The chapter fought its boss in a parlour.
    //
    // R5-W3 · A5 · …AND NOW THEY ARE THE ROW YOU ARE STANDING IN.
    //
    // H1 could only get the chairs into the room, not to the front of it. It
    // put them in the FAR row and wrote down exactly why: the value law reads
    // L2 off `mid`, and the school chairs' wood measured 22.3 % against a
    // 14–21 % window, with the L1↔L2 lift collapsing to 2.8 %. Its last line
    // was „repainting a sheet this session may not". Koki's verdict on the
    // result was that the armchairs were still in front — his „Ohrensessel
    // statt Schulstühle" was half-answered — so this session may, and did.
    //
    // `scripts/set-plane-value.mjs` took the sheet to a DECLARED 14.8 %: one
    // multiplicative pass, hue and saturation untouched, the same painting at
    // a different key. That number is not taste, it is the only window two
    // laws leave open — audit 1's band [14.0, 21.0], and the ABSOLUTE L2↔L3
    // separation of 12 points against this room's L3 of 27.5 %, which caps L2
    // at 15.5. So the chairs take the near row, and the armchairs fall back to
    // where `midFarBand` puts anything behind: 0.68 of the height, lifted past
    // the near row's top edge, parallax 0.36, ghosted to 0.62 — the back of a
    // hall. Nothing is deleted; the parlour becomes the depth behind the class.
    //
    // The victory beat needed this too: „warmes Licht überm Stuhl-Band" had no
    // chair band to warm while the chairs were the far row.
    mid: { ...midBand("p4", 96), segments: ["band_p4_audience"] },
    midFar: midFarBand("p4", midBand("p4", 96)),
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
