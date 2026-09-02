// PB-C1 · THE TERRAIN MASS MODEL — doc 36 §2 as a PURE planner.
//
// Retired: strips-over-fill (a thin painted strip laid over a flat tan box,
// caps floating detached beside platforms, SOIL below every floor). Terrain is
// now a CARVED MASS with painted anatomy — crust + flush caps on every exposed
// top, edge trims on every exposed side, corners at every turn, a seamless
// body, a fade band at depth, ink-dark paper sediment below. Floating
// platforms are COMPLETE OBJECTS. The `z` slide is its own object.
//
// The planner is pure so the audits can run in CI without a browser: it takes
// a grid + a kit and returns WHERE every piece goes. `fallbackFill` is the one
// kind that means "no kit — the scene draws a flat rectangle here"; the
// no-naked-fill audit asserts a kit-present plan contains ZERO of them.

import { type ColumnObject, type MassKit } from "./composition.ts";
import { bodyCells, bodyPartitionErrors } from "./visualBodies.ts";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { TILE, mixMultiply } from "./paint.ts";

// ── the anatomy's dimensions (world px) ──────────────────────────────────────
/** doc 36 §1's scale law: "a crust course ~0.5 H thick". H ≈ 34 px drawn. */
export const CRUST_H = 17;
/** the painted board surface IS the standing line, so the lip is only a hint */
export const CRUST_LIP = 2;
/** carved side trim: mostly inside the mass, 2 px proud of it */
export const EDGE_W = 8;
export const EDGE_OUT = 2;
export const CORNER = 12;
/**
 * How far the carved trims are laid back from the room's full light.
 *
 * A cut edge SHOULD catch more light than the face beside it — that is what
 * makes it read as carved. Measured, though, the trim art is 71.5 % mean
 * luminance against a 46.2 % body: 25 points, which stops being a highlight and
 * becomes a rail. 0.76 lands it about eight points over the body, which is a
 * lit edge; the rest of its separation now comes from the depth ramp, because a
 * trim six rows down should be as deep as the paper it is carved into.
 *
 * CRITIC ROUND 2 took it further, from 0.76 to 0.62. Both blind reviewers still
 * named it independently — "the pale stone pillar sides sit as a visibly
 * separate material against the warm book colour — a joint, not a blend",
 * "lacks the soft falloff into the books that the reference achieves on every
 * beam-to-background transition". A trim that announces itself is a trim that
 * has stopped being anatomy.
 *
 * ── R5-W4 · A6: 0.62 OVERSHOT, AND A GREY MULTIPLY WAS THE WRONG INSTRUMENT ──
 * Two findings, both measured by `check-composition` audit 11 and both visible
 * in Koki's frames of 2026-08-15.
 *
 * 1 · 0.62 draws the trim at 44.3 % against a 46.6 % body — **1.9 points UNDER
 *     it**. Round 2 was chasing a rail and walked past the target: a cut edge
 *     darker than the face it is cut into is a groove. §5's law is +6…12, and
 *     the audit now holds a signed window rather than a cap, so this cannot
 *     drift again without a red light.
 *
 * 2 · A GREY multiply cannot fix what was actually wrong. It scales all three
 *     channels alike, so it moves value and leaves the family untouched — and
 *     the family is the complaint: „die vertikalen Kanten haben graue und braune
 *     Blöcke, die nicht zum Rest passen", „die Außenwand ist hässlich mit diesen
 *     Grautönen". The strip is painted at 37.2 % saturation beside a 60.2 % body;
 *     no amount of grey darkening makes it belong.
 *
 * So the lay-back is now a COLOUR, derived rather than chosen. The trim is the
 * cut face of the body, so its target is the body's own colour direction carried
 * to the body's value + 8:
 *
 *   body   (155.4, 113.3,  65.6)   46.60 %   sat 60.2 %
 *   trim   (212.9, 177.8, 135.8)   71.45 %   sat 37.2 %
 *   target (182.1, 132.8,  76.9)   54.60 %  = body direction at body + 8
 *   tint   target / trim           = (0.855, 0.747, 0.566) = 0xdabe90
 *
 * Drawn result, measured: 54.6 % (carve +8.0, inside §5's window) and saturation
 * 57.7 % against the body's 60.2 % — 2.5 points apart where 23.0 stood. The grey
 * is gone as a number, not as an impression.
 *
 * THIS IS A CORRECTION, NOT A COMMISSION, and Koki said so when he chose it on
 * 2026-08-15: it buys the four unpainted rooms a trim that belongs to their mass
 * until AS5 paints them one. It cannot fix what it does not touch — the walk
 * course of the night classroom is still 138° of hue from the body under it,
 * because that is the BODY's sheet and no trim tint reaches it. Audit 11 keeps
 * saying so, under a dated waiver.
 *
 * One number rather than four because there is one kit: p2/p3/p4/p9 share
 * `mass_edge_l/r` and `mass_body_a/b`. A room that paints its own gets its own
 * (`composition.ts#TRIM_SHADE_BY_PHASE`), which is where p1's now lives.
 */
export const TRIM_SHADE = 0xdabe90;
/**
 * R5-W1 · A1 · THE PAINTED-SCALE LAW (Koki's „Lego, das nicht zusammenpasst").
 *
 * A tiled surface used to derive its texture scale from the PIECE it filled:
 * `scale = piece.h / source.h`. The interior body is planned one grid row tall,
 * so a 512×512 painting was squeezed into a 16×16 box — and because the world
 * anchor then landed on an exact multiple of the source width, EVERY solid cell
 * in the world drew the byte-identical stamp. Not "a painting that repeats": one
 * stamp, 550 times, which is why the terrain read as extruded plastic bricks
 * rather than as painted matter.
 *
 * The walk course never had that defect, and the reason is the whole fix: its
 * height is pinned by CRUST_H, so its 512-wide art lands over 41 px of world —
 * about 2.57 cells, a period the 16-px grid cannot line up with. So the course
 * is not just the surface that looked right, it is the surface that DEFINES what
 * one painted centimetre of this world is worth. Every other painted mass
 * surface now draws at that same scale.
 *
 * Deliberately NOT an integer cell count: at 2, 3 or 4 cells the painting's own
 * repeat would land on the cell grid forever — the same metronome one octave up,
 * and invisible to the no-metronome audit, which carries no tile phase at all.
 */
export const paintScaleOf = (kit: MassKit, srcSize?: SrcSizeLookup): number => {
  const s = srcSize?.(kit.crust[0] ?? "") ?? null;
  return s !== null && s.h > 0 ? CRUST_H / s.h : FALLBACK_PAINT_SCALE;
};

/** The shipped ch01 course (crust_p1_a is 512×212) — the ratio the law means
 *  when the art cannot be measured. 17/212 ⇒ a 512-wide painting every 41.06 px. */
export const FALLBACK_PAINT_SCALE = CRUST_H / 212;

/**
 * The INTERIOR's scale: the course's, de-locked.
 *
 * The course itself must keep its scale EXACTLY — its band is one course tall
 * and has to fit CRUST_H. The interior has no such obligation, and it needs the
 * freedom: each phase's course sheet is cut to its own height (212 · 211 · 262 ·
 * 237 · 246 px), and p3's 262 puts a 512-wide painting at 2.08 cells — near
 * enough to two that the painting's own repeat would sit in phase with the cell
 * grid, the plank joints and the trims forever. That is the original defect one
 * octave up, and it is invisible to every audit that reads labels instead of
 * scales (which is why audit 10 measures the scale and why this exists).
 *
 * So: take the course's scale, and if it lands on the grid, step it off — in
 * increments small enough that the material's apparent size does not change,
 * and always inside audit 10's own parity tolerance.
 */
export const bodyScaleOf = (kit: MassKit, srcSize?: SrcSizeLookup): number => {
  const base = paintScaleOf(kit, srcSize);
  const w = srcSize?.(kit.body[0] ?? "")?.w ?? 512;
  // clear the audit's threshold with margin, so a rounding difference between
  // the planner and the check can never decide whether the build ships
  const locked = (s: number): boolean => {
    const period = (w * s) / TILE;
    if (period < MIN_PAINT_PERIOD_CELLS) return true;
    for (let n = 1; n <= 8; n++) if (Math.abs(period - n) <= MIN_GRID_LOCK_DISTANCE * 2) return true;
    return false;
  };
  let s = base;
  for (let i = 1; i <= 12 && locked(s); i++) s = base * (1 + 0.025 * i);
  return s;
};

/** The smallest painted period the law tolerates, in cells, and how far it must
 *  stay off a whole number of cells. Both are enforced by check-composition
 *  audit 10; the second is what forbids the integer answer. */
export const MIN_PAINT_PERIOD_CELLS = 2;
export const MIN_GRID_LOCK_DISTANCE = 0.08;

/** doc 36 §2: the slide's drawn surface is 2 cells wide so the `z` line reads */
export const SLIDE_BAND_PX = 2 * TILE;
export const SLIDE_ABOVE_FRAC = 0.22;
/**
 * R5-W1 · A1 · THE DEPTH LAW — the ramp is a RAMP now, not a cliff.
 *
 * doc 36 §2 asks for "a darkening fade into ink-dark paper-sediment below", and
 * the kit ships exactly that in three painted sheets. Measured mean luminance of
 * the shipped ch01 sheets: body 46.2 % · fade 16.6 % · sediment 4.8 %. The old
 * depths gave the middle sheet ONE row, so the terrain fell 41 points of value
 * in two cells and everything past the fourth row was the same near-black — 54 %
 * of p1's interior, 57 % of p3's. At the old 16-px stamp scale that sheet's
 * books were unresolvable, so it did not read as deep paper at all. It read as a
 * hole punched through the picture, which is what Koki saw as „schwarze Löcher".
 *
 * Two changes, and the second is the one that matters. The bands get room (four
 * rows, then five). And each band is laid under a MULTIPLY that walks it down to
 * meet the next band's own value BEFORE the paper changes — so the material
 * changes where the eye has nothing to catch. The steps that remain are 24→17
 * and 7→5 instead of 46→17 and 17→5.
 */
export const FADE_DEPTH = 4;
/**
 * CRITIC ROUND 2 pushed this from 9 to 14. Two independent blind reviewers,
 * measuring pixels rather than opinions, both reported the same surviving
 * defect: "deep terrain still collapses toward flat darkness … 32.5 % of that
 * band is functionally black", "needs a hue-preserving shadow ramp".
 *
 * The cause is the art, not the ramp: `mass_sediment` is 4.8 % mean luminance —
 * near-black AS A PAINTING — so any depth that reaches it reaches a hole no
 * multiply can rescue. So the sheet is moved to where it belongs, the true floor
 * of the world, and the readable middle sheet carries everything above it.
 * Measured against the shipped grids this means p1, p3, p4 and p9 never touch
 * sediment at all, and p2 only in its deepest columns.
 */
export const SEDIMENT_DEPTH = 14;
/** How far past the sediment line the light keeps falling, in cells. */
export const RAMP_ROWS = 10;
/**
 * The multiply a band wears at its LAST row — i.e. how far it must be walked
 * down to arrive at the next band's painted value. body·0.52 ≈ 24 % (fade is
 * 16.6) · fade·0.42 ≈ 7 % (sediment is 4.8) · sediment·0.86 for the last of the
 * light. Never near zero: the composed tint must keep the five no-metronome
 * lights distinguishable, and they only collide below ≈0.05.
 */
export const BAND_HANDOVER = { body: 0.52, fade: 0.55, sediment: 0.86 } as const;
/** The darkest any channel of a composed depth tint may go. Guards the
 *  no-metronome law: below this the five lights round together. */
export const DEPTH_TINT_FLOOR = 0x1a;
/**
 * How much COOLER the deep gets, per channel, at the bottom of the ramp.
 *
 * Critic round 2, both reviewers independently: the reference's darkest matter
 * "is still recognizably blue wood, not black", and the losing frame's deep band
 * measured a saturation of 0.029 — grey. Darkening alone always trends grey,
 * because a multiply pulls every channel toward zero together. Letting red fall
 * faster than blue turns the same amount of darkness into a HUE, which is the
 * difference between shadow and absence.
 */
export const DEPTH_COOL = { r: 0.34, g: 0.18 } as const;

/**
 * R5-NACHSTEUER-3 · A4 · WHERE THE PAINTED DEEP ROW TAKES OVER.
 *
 * The body band is FADE_DEPTH rows deep, and until now all four of those rows
 * drew the SAME painting and got their darkness from a multiply. That is the
 * "tile with a filter" the whole Massen-Kit exists to end: a multiply pulls
 * every channel toward zero together, so depth arrived as an absence of light
 * rather than as different paint.
 *
 * SPEC_MASSEN_KIT §3 commissions row 2 of the body sheet as "dieselben vier,
 * eine Blende tiefer". From this depth down, the interior draws THAT row.
 */
export const BODY_DEEP_AT = 2;
/**
 * …and how much darker that row actually is, measured on the shipped p1 sheet:
 * 30.30 % against row 1's 46.01 %. The multiply is divided by this, so the
 * composed value keeps following the same smooth curve while the darkness
 * itself moves out of the tint and into the pigment.
 *
 * It is a MEASUREMENT, not a preference, so `composition.test.ts` re-derives it
 * from the shipped art: repaint the deep row and the test says so.
 */
export const BODY_DEEP_SHADE = 0.659;
/**
 * …and where the body band has to ARRIVE when a kit is painted (D-50, come due).
 *
 * `BAND_HANDOVER.body = 0.52` is not a general truth — it was measured to land
 * the shared body (46.2 %) on the shared fade (16.6 %). p1's painted deep paper
 * is 13.84 %, darker relative to its own body, so the same walk stops 10 points
 * short and the band change becomes a visible edge. The handover is therefore
 * ART, and a painted kit brings its own:
 *
 *   H = BODY_DEEP_SHADE × (fade / bodyDeep) = 0.659 × (13.84 / 30.30) = 0.301
 *
 * which lands the last body row exactly on the fade paper's own value — the drawn
 * chain becomes 46.0 → 35.3 → 24.6 → 13.8, three even steps and no join at all.
 * `check-composition` re-derives it from the shipped sheets, so a repaint that
 * moves either value fails loudly instead of reopening the seam.
 */
export const BODY_HANDOVER_PAINTED = 0.301;

/** Which painted sheet a cell this deep is laid in. */
export const bandAt = (d: number): "body" | "fade" | "sediment" =>
  d >= SEDIMENT_DEPTH ? "sediment" : d >= FADE_DEPTH ? "fade" : "body";

/** The multiply a cell this deep wears, 1 at the surface, falling monotonically. */
export const depthShadeAt = (d: number, bodyHandover: number = BAND_HANDOVER.body): number => {
  const band = bandAt(d);
  if (band === "body") return 1 - (1 - bodyHandover) * (Math.min(d, FADE_DEPTH - 1) / (FADE_DEPTH - 1));
  if (band === "fade") {
    return 1 - (1 - BAND_HANDOVER.fade) * ((d - FADE_DEPTH) / (SEDIMENT_DEPTH - 1 - FADE_DEPTH));
  }
  return 1 - (1 - BAND_HANDOVER.sediment) * Math.min(1, (d - SEDIMENT_DEPTH) / RAMP_ROWS);
};

/**
 * …expressed as a MULTIPLY tint. Cooler as it deepens — red loses the most,
 * blue the least, the same rule the near plane already uses — so depth reads as
 * distance rather than as dirt, and the darkest dark in the book is still a
 * colour rather than an absence of one.
 */
export const depthTintAt = (d: number, pigmentShade = 1, bodyHandover: number = BAND_HANDOVER.body): number => {
  const total = depthShadeAt(d, bodyHandover);
  // The multiply only has to carry the part of the fall the PAINT does not.
  // `cool` still tracks the TRUE depth, not the reduced multiply — otherwise a
  // deeper-painted row would read as nearer, which is the opposite of the point.
  const s = Math.min(1, total / pigmentShade);
  const cool = 1 - total;
  const ch = (bias: number): number =>
    Math.max(DEPTH_TINT_FLOOR, Math.round(255 * s * (1 - bias * cool))) & 0xff;
  return (ch(DEPTH_COOL.r) << 16) | (ch(DEPTH_COOL.g) << 8) | ch(0);
};

/** How the run-merger and the audits bucket depth: past the ramp everything is
 *  the same light, so one deep mass stays ONE piece instead of a stack of rows. */
export const depthBucketAt = (d: number): number => Math.min(d, SEDIMENT_DEPTH + RAMP_ROWS);
/** floating platform = an isolated run this wide or narrower with air below */
export const MAX_PLATFORM_CELLS = 4;

/**
 * PK-R6 · H1 · THE COURSE-VARIATION LAW (round-1 critique, finding 1).
 *
 * A crust run used to be ONE tileSprite carrying ONE painted variant, so the
 * ch01 hall floor looped a single 41-px course about twenty-six times across the
 * screen and hundreds of times across the level — a metronome under the child's
 * feet for the whole traversal band, which is what the critique called
 * „mechanically obvious". The kit has always shipped two painted variants of
 * every course; only one was ever reaching the floor.
 *
 * So a run is now laid as SEGMENTS that alternate the variants. The lengths are
 * coprime-ish and irregular on purpose: a fixed segment length would just move
 * the metronome up one level (A-B-A-B every 2n cells), whereas walking this
 * table shifts the boundaries as the run goes on. Everything is derived from the
 * run's own cell coordinates, so it is deterministic — the same level always
 * paints the same floor, and the audits can assert it without a browser.
 *
 * The segments share the WORLD-space tile anchor (PaintScene.placeMassPiece), so
 * two neighbouring segments of the same variant are seamless and a change of
 * variant lands exactly on a cell boundary, where the course already draws a
 * plank joint.
 */
export const CRUST_SEGMENT_CELLS = [5, 3, 7, 4, 6] as const;

/**
 * PK-R6 · H1 · THE NO-METRONOME LAW (round-1 critique, finding 1 — CRITICAL,
 * round 2 of the same defect).
 *
 * Round 1 said the ch01 floor „repeats identically with a hard seam every few
 * units, reading as a wallpaper tile rather than hand-painted ground", and the
 * fix that round was the segment table above: two painted variants instead of
 * one. That halved the beat; it did not remove it, for two measured reasons.
 *
 *  · The pattern still CYCLES. The segment lengths walk a 5-long table and the
 *    variants a 2-long list, so the whole course repeats exactly every 10
 *    segments — 50 cells, 800 px (measured, composition.test.ts asserts the 50).
 *  · Worse, and invisible to any cycle test on a shorter floor: the run only
 *    ever holds TWO different cells. ch01's longest hall floor is 41 cells, so
 *    it never completes that 50-cell cycle and looks aperiodic to arithmetic
 *    while giving the eye exactly two things to look at.
 *
 * Two more ingredients kill both, and both are code (doc 44 B14) because the
 * kit is what it is and no more painted variants are coming this round:
 *
 *  1 · VALUE. Each segment is laid at one of five near-white tints — a ±5 %
 *      value jitter over the painted course. This is the critique's own first
 *      instruction („repaint the ground strip with irregular value … variation"),
 *      done to the light rather than to the pigment, so the painting survives.
 *  2 · GRAIN. Scuffs and shine marks scattered along the walk surface at
 *      irregular intervals — the critique's „scattered highlights, occasional
 *      gaps", drawn rather than commissioned. They are the one ingredient whose
 *      spacing owes nothing to the tile size, so they are what actually breaks
 *      the eye's lock on the loop.
 *
 * Both are keyed to the cell's OWN coordinates through a multiplicative hash, so
 * a level always paints the same floor and the audits can assert it headlessly.
 * The law they make checkable is stated once here and enforced in
 * scripts/check-composition.mjs (audit 6), in the two halves the two failures
 * above demand: **no crust run repeats with a period of NO_METRONOME_MIN_PERIOD
 * cells or less, AND a run holds at least one different-looking cell per five of
 * its length (never fewer than three).** Tamper-proven in both directions —
 * flattening the tint and the grain turns all ten shipped runs red on the
 * variety half while every one of them still passes the cycle half.
 */
export const NO_METRONOME_MIN_PERIOD = 9;

/** Knuth's multiplicative hash over two cell coordinates plus a salt, in 0…1.
 *  One source of determinism for every scattered thing the renderer draws. */
export const hash01 = (n: number): number => (Math.imul(n | 0, 2654435761) >>> 8) / 0x1000000;
export const hash2 = (c: number, r: number, salt: number): number =>
  hash01(Math.imul(c + 0x9e37, 0x85eb) ^ Math.imul(r + 0x79b9, 0xc2b2) ^ Math.imul(salt + 0x165667, 0x27d4));

/**
 * THE INTERIOR SEGMENTS. Seen in the running build (browser proof, p1): the
 * course above was already varying while the MASS BELOW it — which is four times
 * as much of the frame — was one tileSprite 656 px wide carrying ONE variant.
 * That is the „stacked books floor strip repeats identically" the critique was
 * actually looking at: a grid of identical book spines under the whole hall.
 *
 * So the interior is laid in segments too, and the table is deliberately NOT the
 * crust's: if the two layers changed variant at the same columns, their seams
 * would stack into one visible vertical joint through the whole floor instead of
 * cancelling each other out.
 */
export const BODY_SEGMENT_CELLS = [6, 4, 9, 5, 7] as const;

/**
 * The five lights a segment may be laid in. Near-white on purpose: these
 * MULTIPLY the painted stem, so they change its value and never its material.
 */
export const CRUST_TINTS = [0xffffff, 0xf3ede2, 0xfdf8ef, 0xe9e2d6, 0xf7f1e6] as const;

/** Which of them this segment wears — from the segment's own start cell, so two
 *  neighbouring runs of the same variant still differ in value. `salt` keeps the
 *  course and the mass under it on different sequences. */
export const courseTintAt = (c: number, r: number, k: number, salt = 3): number =>
  CRUST_TINTS[Math.floor(hash2(c, r, k * 17 + salt) * CRUST_TINTS.length) % CRUST_TINTS.length] ?? 0xffffff;
export const crustTintAt = (c: number, r: number, k: number): number => courseTintAt(c, r, k, 3);

/** A drawn mark on a laid surface: a dark scuff or a light shine. The scene
 *  picks the two colours from the phase's key (a scuff on a night floor is not
 *  the scuff on a morning one); the plan owns only where they go. */
export interface SurfaceMark {
  kind: "scuff" | "shine";
  c: number;
  r: number;
  x: number;
  y: number;
  w: number;
  h: number;
  alpha: number;
}

/** Above the course (2) and below its caps (2.3) — grain is IN the wood. */
export const CRUST_MARK_DEPTH = 2.15;
/** …and just above the interior bands (1), under everything laid on them. */
export const MASS_MARK_DEPTH = 1.4;
/** Roughly how often a walk-surface cell carries a mark. Under a half: the floor
 *  is being grained, not gravelled. */
export const CRUST_MARK_RATE = 0.44;
/** The interior takes MORE, and fainter: it is four times as much of the frame
 *  as the course is, it is the surface the critique was actually reading, and
 *  patina over a book-spine wall has to be nearly subliminal to stay a wall. */
export const MASS_MARK_RATE = 0.62;

/**
 * R5-A3 · WHICH MASS PIECES ARE "THE NEAREST STANDABLE PLANE".
 *
 * Exported from the planner rather than written into the scene, because the
 * composition audit has to weigh exactly these stems by exactly this push when
 * it measures L3 — otherwise the shipped terrain and the audited terrain drift
 * apart, and the L2↔L3 separation law goes on passing while the room it governs
 * stops obeying it.
 */
export const NEAR_PLANE_KINDS: ReadonlySet<string> = new Set([
  "crust", "capL", "capR", "ramp", "platform",
]);

export type MassKind =
  | "body" | "fade" | "sediment"
  | "crust" | "capL" | "capR"
  // `edgeD` — the underside band (R5-W7 · A8, D-27). Deliberately NOT in
  // NEAR_PLANE_KINDS above: that law answers „can I stand on this?", and the
  // underside is the face over the child's head. Its five siblings are out for
  // the same reason, and `composition.test.ts` states that as law.
  | "edgeL" | "edgeR" | "edgeD" | "cornerBL" | "cornerBR" | "inCornerL" | "inCornerR"
  | "ramp" | "platform" | "joint" | "postJoin"
  // `bodyMount` — ein deklarierter Sicht-Körper als EIN Gemälde (R6 Ein-Block-
  // Welt, visualBodies.ts). Nicht in NEAR_PLANE_KINDS: seine Kruste, Tiefe und
  // Verschattung sind BESTELLTE Malerei; ein Engine-Tint würde genau die
  // Pigment-Tiefe wieder in einen Multiply verwandeln, den das Massen-Kit
  // abgeschafft hat.
  | "bodyMount"
  | "slideUnder" | "slideTop" | "slideMid" | "slideFoot"
  | "fallbackFill";

/** Source pixel size of a stem — the plan reads real art geometry through this. */
export type SrcSizeLookup = (stem: string) => { w: number; h: number } | null;

/** Unter dieser GEZEIGTEN Breite ist eine gefensterte Kappe kein Ende mehr,
 *  sondern ein Splitter. Am schmalsten Fall des Kapitels nachgesehen (vier
 *  1-Zellen-Laeufe in p3, je 8 px je Seite): dort liest der Lauf als kleiner
 *  Stumpf mit zwei runden Enden, nicht als Splitter. */
export const CAP_MIN_PX = 6;

export interface MassPiece {
  kind: MassKind;
  /** null ⇒ engine-drawn (fallbackFill only) */
  stem: string | null;
  c: number;
  r: number;
  x: number;
  y: number;
  w: number;
  h: number;
  /** radians — the slide modules ride the 45° diagonal */
  rot?: number;
  /** anchor within the piece; default (0,0) = x/y is its top-left corner.
   *  Rotated pieces anchor ON the diagonal, so they need an explicit origin. */
  originX?: number;
  originY?: number;
  /** mirrored connector at the left end of a platform group */
  flipX?: boolean;
  /** true ⇒ a tileSprite (seamless run); false ⇒ one Image */
  tile?: boolean;
  /**
   * R5-W9 · F10 · D-639 · EIN FENSTER AUF DAS BLATT, im BILD-Zweig.
   *
   * Die gekachelten Stuecke haben ihr Quellfenster seit R5-W3 (`srcW`); ein
   * BILD hatte keins und zeichnete immer sein ganzes Blatt in seinen Kasten.
   * Fuer eine Kappe auf einem kurzen Lauf ist genau das der Unterschied
   * zwischen »halbe Kappe im richtigen Massstab« und »ganze Kappe gequetscht«
   * — und Gequetschtes faellt seit M1 (D-632) durch das Verzogen-Gesetz.
   *
   * `fw` ist der ANTEIL der Blattbreite, der gezeigt wird, `from` die Seite,
   * von der aus gemessen wird. Der Massstab bleibt der des ungeschnittenen
   * Stueckes (`w`/`h` aendern sich NICHT) — das Tor misst also weiter dieselbe
   * Zahl, und das ist Absicht: ein Fenster ist kein anderer Massstab.
   */
  crop?: { fw: number; from: "left" | "right" };
  /** world px drawn per SOURCE px — the painted-scale law. Undefined keeps the
   *  legacy rule (one source height = the piece's own height). */
  srcScale?: number;
  /**
   * R5-W3 · A5 · R3 · HOW MANY SOURCE PIXELS THIS PIECE SHOWS ACROSS ITS WIDTH.
   *
   * The field this replaces (`srcScaleX`) declared the DESTINATION — „a trim is
   * 8 px wide" — and let the sheet's own width decide the scale. The result was
   * measured: `mass_edge_l/r` are 248 px wide and drew at 8 / 248 = 0.0323 world
   * px per source px against the world's 0.0802, so **every carved trim in the
   * chapter was squashed 2.49× horizontally** — while the comment beside the
   * arithmetic promised the exact opposite, that „its page-edges come out the
   * same physical size as the books beside them". Nothing could report it,
   * because audit 10 SKIPPED any piece that declared the override.
   *
   * Declaring the SOURCE WINDOW instead makes the arithmetic checkable against
   * the sheet: `x = w / srcW`, a window wider than the painting is a red light
   * rather than a squash, and the trim shows PART of its texture at true scale
   * instead of all of it at the wrong one — which is what a trim is: a cut
   * through matter, not a shrunken picture of matter.
   */
  srcW?: number;
  /**
   * Which axes the pattern is anchored to world space on.
   *
   * "xy" is what a CONTINUUM wants: a column of interior pieces then draws
   * successive horizontal slices of one tall painting instead of restamping it.
   *
   * "x" is what a single COURSE wants, and the crust is one. Phaser offsets the
   * pattern by `tilePositionY mod sourceHeight`; a course drawn exactly one
   * period tall therefore wraps by `p.y mod CRUST_H` — `(16r − 2) mod 17`, which
   * is non-zero on every row but one in seventeen. The painted board's lit top
   * lip was being cut off and re-attached under its own underside, by a
   * different amount on every floor of the school.
   */
  tileAnchor?: "xy" | "x";
  /** a MULTIPLY tint (near-white) — the value jitter of the no-metronome law */
  tint?: number;
  /** source-pixel phase for a run-local tile origin; does not alter the sheet */
  tileOffsetX?: number;
  /**
   * R6 · die Zellen, die ein `bodyMount` wirklich besitzt. Ein Körper-Blatt ist
   * fast nie ein volles Rechteck (das Exemplar füllt 34 % seiner Box) — eine
   * rechteckige Ableitung aus w/h würde Luftzellen als »gedeckt« melden und
   * das Deckungs-Audit falsch-grün färben. Nur bodyMount trägt das Feld.
   */
  cells?: ReadonlyArray<{ c: number; r: number }>;
  depth: number;
}

/**
 * THE ONE PLACE the drawn scale of a tiled piece is decided — called by the
 * renderer AND by the audits, because `mass.ts`'s own rule is that a check may
 * never measure a model of the thing instead of the thing. Two copies of this
 * arithmetic is how the shipped build and its green gates came to disagree.
 */
export const tileScaleFor = (p: MassPiece, src: { w: number; h: number }): { x: number; y: number } => {
  const y = p.srcScale ?? (src.h > 0 ? p.h / src.h : 1);
  // a declared WINDOW divides; an undeclared one keeps the painting square
  return { x: p.srcW !== undefined && p.srcW > 0 ? p.w / p.srcW : y, y };
};

/**
 * R5-W9 · M1 · DER GEZEICHNETE MASSSTAB EINES STUECKS — EGAL WELCHEN WEG ES GEHT.
 *
 * `tileScaleFor` beantwortet die Frage nur fuer den Kachel-Weg. Der Renderer
 * hat aber zwei: gekachelt (`setTileScale`) und als Bild (`setDisplaySize`).
 * Audit 10 hat den Bild-Weg bis heute UEBERSPRUNGEN (`if (p.tile !== true)
 * continue`) — und genau dort sassen die drei Befunde, die drei Wellen
 * ueberlebt haben: die Ecken 3,42-mal feiner als der Trim daneben,
 * `mass_incorner_r` 18,1 % gestaucht, die Moebel bei 0,42…1,17.
 *
 * Ein Tor, das nur die Haelfte der Wege misst, ist gruen ueber der anderen
 * Haelfte. Deshalb gibt es diese eine Funktion, und Renderer, Tor und das
 * Massen-Lineal fragen SIE — nicht drei Kopien derselben Rechnung
 * (das 10c-Gesetz „anchor honesty", eine Ebene weiter gedacht).
 */
export const drawnScaleFor = (p: MassPiece, src: { w: number; h: number }): { x: number; y: number } =>
  p.tile === true
    ? tileScaleFor(p, src)
    : { x: src.w > 0 ? p.w / src.w : 1, y: src.h > 0 ? p.h / src.h : 1 };

/** Where the pattern is pinned, in SOURCE px (Phaser's `tilePosition`).
 *  Each axis divides by ITS OWN scale — Phaser's offset is
 *  `tilePosition mod sourceSize` per axis, so one shared divisor would slide a
 *  non-uniform piece off its own anchor. */
export const tileAnchorFor = (p: MassPiece, scale: { x: number; y: number }): { x: number; y: number } => ({
  x: scale.x > 0 ? p.x / scale.x + (p.tileOffsetX ?? 0) : 0,
  y: p.tileAnchor === "x" || scale.y <= 0 ? 0 : p.y / scale.y,
});

/**
 * N6 · THE OUTSIDE JOINS. A platform run may be covered by two complete
 * painted objects, but the child should read one built ledge. This planner
 * emits one bookbinder at each outside end of a contiguous object group;
 * internal object boundaries stay clean and do not grow a third seam.
 *
 * The connector is painted at the course's scale. Its collar sits at 43 % of
 * the source width (measured on the delivered sheet), so the saddle overlaps
 * the platform edge while the page fold tucks into the object.
 */
export const platformJoinPieces = (
  platforms: readonly MassPiece[],
  stem: string,
  paintScale: number,
  source: { w: number; h: number } = { w: 320, h: 220 },
): MassPiece[] => {
  if (platforms.length === 0 || source.w <= 0 || source.h <= 0 || paintScale <= 0) return [];
  const groups = new Map<number, MassPiece[]>();
  for (const p of platforms.filter((q) => q.kind === "platform")) {
    const row = groups.get(p.r) ?? [];
    row.push(p);
    groups.set(p.r, row);
  }
  const out: MassPiece[] = [];
  const collar = 0.43;
  const w = source.w * paintScale;
  const h = source.h * paintScale;
  for (const row of groups.values()) {
    row.sort((a, b) => a.x - b.x);
    let first: MassPiece | undefined;
    let last: MassPiece | undefined;
    const emit = (): void => {
      if (first === undefined || last === undefined) return;
      const leftX = first.x - w * (1 - collar);
      const rightX = last.x + last.w - w * collar;
      const y = first.y + (first.h - h) / 2;
      out.push(
        { kind: "joint", stem, c: first.c, r: first.r, x: leftX, y, w, h, depth: DEPTH.joint, flipX: true },
        { kind: "joint", stem, c: last.c, r: last.r, x: rightX, y, w, h, depth: DEPTH.joint, flipX: false },
      );
    };
    for (const p of row) {
      if (first === undefined || last === undefined) { first = p; last = p; continue; }
      // A shrunken image still owns its original grid span; the half-cell
      // allowance bridges only that deliberate painted inset.
      if (p.x <= last.x + last.w + TILE * 0.6) { last = p; continue; }
      emit();
      first = p;
      last = p;
    }
    emit();
  }
  return out;
};

/**
 * R233 · THE POST CONNECTIONS. The bookbinder join closes a platform's
 * horizontal edge; this painted saddle closes the other missing relationship:
 * a timber post entering a stack top or sitting beneath a platform lip.
 *
 * The same outside-group rule is used for platforms, so an object run gets two
 * supports rather than a support at every internal object boundary. Elevated
 * mass tops get one at each exposed side. Both are visual-only pieces: they do
 * not claim grid cells and therefore cannot change walkability.
 */
export const postJoinPieces = (
  grid: readonly string[],
  platforms: readonly MassPiece[],
  stem: string,
  paintScale: number,
  source: { w: number; h: number } = { w: 320, h: 265 },
): MassPiece[] => {
  if (source.w <= 0 || source.h <= 0 || paintScale <= 0) return [];
  const w = source.w * paintScale;
  const h = source.h * paintScale;
  const collar = 0.43;
  const out: MassPiece[] = [];
  const emit = (p: MassPiece, x: number, y: number, flipX: boolean): void => {
    out.push({ kind: "postJoin", stem, c: p.c, r: p.r, x, y, w, h, depth: DEPTH.postJoin, flipX });
  };

  // Platform groups: place the saddle under each outside lip, with the post
  // descending below the object instead of leaving the edge unsupported.
  const groups = new Map<number, MassPiece[]>();
  for (const p of platforms.filter((q) => q.kind === "platform")) {
    const row = groups.get(p.r) ?? [];
    row.push(p);
    groups.set(p.r, row);
  }
  for (const row of groups.values()) {
    row.sort((a, b) => a.x - b.x);
    let first: MassPiece | undefined;
    let last: MassPiece | undefined;
    const emitGroup = (): void => {
      if (first === undefined || last === undefined) return;
      const y = first.y + first.h - h * 0.45;
      emit(first, first.x - w * (1 - collar), y, true);
      emit(last, last.x + last.w - w * collar, y, false);
    };
    for (const p of row) {
      if (first === undefined || last === undefined) { first = p; last = p; continue; }
      if (p.x <= last.x + last.w + TILE * 0.6) { last = p; continue; }
      emitGroup();
      first = p;
      last = p;
    }
    emitGroup();
  }

  // Elevated mass corners: a post that meets the stack from the side receives
  // the same fitting. The outside-grid convention deliberately suppresses
  // world-edge fittings, just as the existing trims do.
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < (grid[0]?.length ?? 0); c++) {
      if (!isMass(glyphAt(grid, c, r))) continue;
      const airU = !isMass(glyphAt(grid, c, r - 1));
      const airD = !isMass(glyphAt(grid, c, r + 1));
      if (!airU || airD) continue;
      const p = { c, r } as MassPiece;
      const y = r * TILE - h * 0.45;
      if (!isMass(glyphAt(grid, c - 1, r))) emit(p, c * TILE - w * (1 - collar), y, true);
      if (!isMass(glyphAt(grid, c + 1, r))) emit(p, (c + 1) * TILE - w * collar, y, false);
    }
  }
  return out;
};

const DEPTH = {
  body: 1, ramp: 1.5, crust: 2, trim: 2.2, cap: 2.3, platform: 2.5, joint: 2.65, postJoin: 2.66, slide: 2.6,
  // Körper liegen über Kit-Kruste (2): in der Teilmigration darf keine
  // Nachbar-Kruste in das Gemälde hineinzeichnen. Anbau-Kragen stapeln per
  // Deklarations-Reihenfolge ein Epsilon darüber (planMass).
  bodyMount: 2.05,
} as const;

const gridSize = (grid: readonly string[]): { w: number; h: number } => ({
  w: grid[0]?.length ?? 0,
  h: grid.length,
});

/** mass = anything the player stands on or bumps into. Ice keeps its own dressing. */
const isMass = (g: string): boolean => isSolid(g);

/**
 * How many contiguous mass cells sit directly above (0 = the exposed top).
 *
 * R5-W1 · A1: the walk STOPS at the grid's top edge. `glyphAt` reports
 * everything outside the grid as solid (collide.ts — the world edge is a wall),
 * so this loop used to run straight past row 0 and out into the void, hit its
 * own guard and answer 64 — which the depth ramp reads as "buried deeper than
 * anything", i.e. ink-dark sediment. Every phase's ceiling row is `#` full
 * width, so the top of the world was drawn as a hard black bar: 64 cells in p1,
 * 129 in p2, 36 of p4's 48 sediment cells, and ALL 44 of p9's. Those bars are
 * most of what read as „schwarze Löcher dahinter".
 *
 * The same trap has been caught twice before in this file — the patina's spill
 * check and the inner-corner probe both bounds-check for exactly this reason.
 * This walk was the one that was missed.
 */
const depthAt = (grid: readonly string[], c: number, r: number): number => {
  let d = 0;
  while (d < 64 && r - 1 - d >= 0 && isMass(glyphAt(grid, c, r - 1 - d))) d++;
  return d;
};

/**
 * An isolated horizontal run with air above AND below, ≤4 cells: a floating
 * platform. Doc 36: these are drawn as COMPLETE OBJECTS with their own
 * silhouette and underside — never a crust laid on a filler box.
 * (glyphAt treats outside-the-grid as solid, so a run touching the world edge
 * is anchored terrain, not a platform.)
 */
export const floatingPlatformRuns = (grid: readonly string[]): Array<{ c0: number; c1: number; r: number }> => {
  const { w, h } = gridSize(grid);
  const runs: Array<{ c0: number; c1: number; r: number }> = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!isMass(glyphAt(grid, c, r))) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && isMass(glyphAt(grid, c1 + 1, r))) c1++;
      const width = c1 - c + 1;
      let airAround = width <= MAX_PLATFORM_CELLS
        && !isMass(glyphAt(grid, c - 1, r))
        && !isMass(glyphAt(grid, c1 + 1, r));
      for (let k = c; airAround && k <= c1; k++) {
        if (isMass(glyphAt(grid, k, r - 1)) || isMass(glyphAt(grid, k, r + 1))) airAround = false;
        if (isSlope(glyphAt(grid, k, r - 1)) || isSlope(glyphAt(grid, k, r + 1))) airAround = false;
      }
      if (airAround) runs.push({ c0: c, c1, r });
      c = c1 + 1;
    }
  }
  return runs;
};

/**
 * R4/R5b · one-piece vertical book objects. A standing column starts where a
 * narrow solid run meets air above; an optional hanging column starts directly
 * beneath a broad ceiling run. Both own their uninterrupted vertical rectangle
 * until the first break/support. The support threshold deliberately ignores
 * neighbouring 2–6-cell book fragments, so the p2 stepped pillars remain
 * separate objects instead of becoming one accidental wall.
 */
export const columnRuns = (
  grid: readonly string[],
  options: { includeHanging?: boolean } = {},
): Array<{ c0: number; c1: number; r0: number; r1: number; hanging?: boolean }> => {
  const { w, h } = gridSize(grid);
  const MIN_SUPPORT_WIDTH = 8;
  const candidates: Array<{ c0: number; c1: number; r0: number; r1: number; hanging?: boolean }> = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!isMass(glyphAt(grid, c, r)) || isMass(glyphAt(grid, c, r - 1))) continue;
      for (const width of [2, 1]) {
        const c1 = c + width - 1;
        if (c1 >= w || !Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, r))).every(Boolean)) continue;
        if (Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, r - 1))).some(Boolean)) continue;
        let end = r;
        while (end + 1 < h && Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, end + 1))).every(Boolean)) end++;
        const support = Array.from({ length: h - r - 1 }, (_, i) => r + i + 1)
          .find((rr) => {
            let left = c;
            while (left > 0 && isMass(glyphAt(grid, left - 1, rr))) left--;
            let right = c1;
            while (right + 1 < w && isMass(glyphAt(grid, right + 1, rr))) right++;
            return right - left + 1 >= MIN_SUPPORT_WIDTH;
          });
        const r1 = support === undefined ? end : Math.min(end, support - 1);
        if (r1 - r + 1 >= 2) candidates.push({ c0: c, c1, r0: r, r1 });
      }
    }
  }
  if (options.includeHanging === true) {
    // A hanging column is attached to a broad ceiling row, then continues down
    // as a narrow uninterrupted run until its first break. Requiring both side
    // neighbours to be air prevents the full ceiling and ordinary floor walls
    // from becoming hundreds of false one-cell candidates.
    for (let r = 1; r < h; r++) {
      for (const width of [2, 1]) {
        for (let c = 0; c < w; c++) {
          const c1 = c + width - 1;
          if (c1 >= w) continue;
          if (!Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, r))).every(Boolean)) continue;
          if (!Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, r - 1))).every(Boolean)) continue;
          if (isMass(glyphAt(grid, c - 1, r)) || isMass(glyphAt(grid, c1 + 1, r))) continue;
          let aboveLeft = c;
          while (aboveLeft > 0 && isMass(glyphAt(grid, aboveLeft - 1, r - 1))) aboveLeft--;
          let aboveRight = c1;
          while (aboveRight + 1 < w && isMass(glyphAt(grid, aboveRight + 1, r - 1))) aboveRight++;
          if (aboveRight - aboveLeft + 1 < MIN_SUPPORT_WIDTH) continue;
          let end = r;
          while (end + 1 < h && Array.from({ length: width }, (_, i) => isMass(glyphAt(grid, c + i, end + 1))).every(Boolean)) end++;
          if (end - r + 1 >= 2) candidates.push({ c0: c, c1, r0: r, r1: end, hanging: true });
        }
      }
    }
  }
  // Longest first resolves the overlapping 1-wide sub-candidates inside a
  // 2-wide tower; the remaining cells then select the stepped pillars cleanly.
  candidates.sort((a, b) => (b.r1 - b.r0) - (a.r1 - a.r0) || a.r0 - b.r0 || a.c0 - b.c0 || (b.c1 - b.c0) - (a.c1 - a.c0));
  const claimed = new Set<string>();
  const out: Array<{ c0: number; c1: number; r0: number; r1: number; hanging?: boolean }> = [];
  for (const candidate of candidates) {
    let overlaps = false;
    for (let rr = candidate.r0; rr <= candidate.r1 && !overlaps; rr++) {
      for (let cc = candidate.c0; cc <= candidate.c1; cc++) if (claimed.has(`${cc},${rr}`)) overlaps = true;
    }
    if (overlaps) continue;
    out.push(candidate);
    for (let rr = candidate.r0; rr <= candidate.r1; rr++) {
      for (let cc = candidate.c0; cc <= candidate.c1; cc++) claimed.add(`${cc},${rr}`);
    }
  }
  return out.sort((a, b) => a.r0 - b.r0 || a.c0 - b.c0 || Number(a.hanging ?? false) - Number(b.hanging ?? false));
};

/**
 * PK-R6 · H2 · WHAT THE FURNITURE THROWS (round-2 finding 9, major).
 *
 * „Almost no dark anchor shapes to organise the eye … push the darkest darks in
 * each scene meaningfully deeper (deep shadow under furniture …)." The floating
 * platforms are the objects nearest the eye in every frame and they had nothing
 * under them at all, so a bench read as a sticker on a wall and the middle of the
 * picture held no dark at all.
 *
 * One soft pool per LEDGE — not per object, which is the whole reason this reads
 * the plan rather than the grid: a four-cell ledge is drawn as two objects side
 * by side, and two shadows with a seam between them is a second wallpaper defect.
 * Contiguous platform pieces on the same row are merged first, so the shadow is
 * the shape of the thing the child sees.
 *
 * Where it falls is not a choice: every phase's wash puts the light top-left and
 * the hero's own shadow has been thrown down-and-right since H1, so this one is
 * too. Same light, same room, one direction.
 */
export const PLAT_SHADOW = {
  /** how far the pool leans away from the light, in world px. */
  dx: 4,
  /** how far it drops below the object's own bottom edge. */
  dy: 2,
  /** how deep the pool reaches before it is gone. */
  h: 11,
  /** how much narrower than its object it is (a shadow is not a stamp). */
  inset: 2,
  alpha: 0.30,
} as const;

export interface PlatformShadow {
  x: number; y: number; w: number; h: number;
  /** opacity where it touches the object; it reaches 0 at its own bottom edge. */
  alpha: number;
}

export const planPlatformShadows = (plan: readonly MassPiece[]): PlatformShadow[] => {
  const ledges = plan.filter((p) => p.kind === "platform").sort((a, b) => a.r - b.r || a.x - b.x);
  const merged: Array<{ x: number; x1: number; y: number; r: number }> = [];
  for (const p of ledges) {
    const last = merged[merged.length - 1];
    if (last !== undefined && last.r === p.r && p.x <= last.x1 + 0.5) {
      last.x1 = Math.max(last.x1, p.x + p.w);
      last.y = Math.max(last.y, p.y + p.h);
      continue;
    }
    merged.push({ x: p.x, x1: p.x + p.w, y: p.y + p.h, r: p.r });
  }
  return merged.map((m) => ({
    x: m.x + PLAT_SHADOW.dx + PLAT_SHADOW.inset,
    y: m.y + PLAT_SHADOW.dy,
    w: Math.max(m.x1 - m.x - PLAT_SHADOW.inset * 2, 2),
    h: PLAT_SHADOW.h,
    alpha: PLAT_SHADOW.alpha,
  }));
};

/** Diagonal runs of the slide glyph `z` (each step goes one right, one down). */
export const slideRuns = (grid: readonly string[]): Array<{ c: number; r: number; n: number }> => {
  const { w, h } = gridSize(grid);
  const seen = new Set<string>();
  const runs: Array<{ c: number; r: number; n: number }> = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (glyphAt(grid, c, r) !== "z" || seen.has(`${c},${r}`)) continue;
      if (glyphAt(grid, c - 1, r - 1) === "z") continue; // not the head of the run
      let n = 0;
      while (glyphAt(grid, c + n, r + n) === "z") { seen.add(`${c + n},${r + n}`); n++; }
      runs.push({ c, r, n });
    }
  }
  return runs;
};

/**
 * The cells a floating platform object owns outright. Exported so the audits ask
 * the SAME question the planner does instead of re-deriving it — a second copy
 * of a rule is a second rule.
 */
export const claimedPlatformCells = (
  grid: readonly string[],
  columnObjects: readonly ColumnObject[] = [],
  // R7 · Zellen, die ein Sicht-Körper VOR den Läufen besitzt (planMass §0).
  // Ohne diesen Parameter beantwortete diese Funktion die Frage ANDERS als
  // planMass (dessen §1 geclaimte Ursprünge überspringt, mass.ts) — im
  // heutigen Grid zufällig folgenlos, aber zwei Antworten auf eine Frage sind
  // zwei Regeln. Läufe, deren Ursprung einem Körper gehört, zählen nicht.
  blocked: ReadonlySet<string> = new Set(),
): Set<string> => {
  const out = new Set<string>();
  for (const run of floatingPlatformRuns(grid)) {
    if (blocked.has(`${run.c0},${run.r}`)) continue;
    for (let k = run.c0; k <= run.c1; k++) out.add(`${k},${run.r}`);
  }
  const sizes = new Set(columnObjects.map((o) => `${o.cellsW}x${o.cellsH}:${Boolean(o.hanging)}`));
  for (const run of columnRuns(grid, { includeHanging: true })) {
    if (blocked.has(`${run.c0},${run.r0}`)) continue;
    if (!sizes.has(`${run.c1 - run.c0 + 1}x${run.r1 - run.r0 + 1}:${Boolean(run.hanging)}`)) continue;
    for (let r = run.r0; r <= run.r1; r++) {
      for (let c = run.c0; c <= run.c1; c++) out.add(`${c},${r}`);
    }
  }
  return out;
};

/** Die Körper-Zellen eines Kits als Set — der `blocked`-Parameter oben, aus der
 *  einen Quelle abgeleitet, damit Szene, Audits und Planer dieselbe Antwort geben. */
export const claimedBodyCells = (kit: Pick<MassKit, "bodies"> | null): Set<string> => {
  const out = new Set<string>();
  for (const body of kit?.bodies ?? []) {
    for (const { c, r } of bodyCells(body)) out.add(`${c},${r}`);
  }
  return out;
};

/**
 * R7/N7 · IST DIESE PHASE EINE EIN-BLOCK-WELT? — die berechnete Eigenschaft,
 * an der der Kit-Cutover hängt.
 *
 * Eine Phase ist fertig gemalt, wenn ihre deklarierten Sicht-Körper JEDE solide
 * Zelle besitzen, die nicht ohnehin einem Möbel-Objekt gehört. Dann plant
 * `planMass` kein einziges Kit-Stück mehr (§0 claimt die Körper-Zellen VOR
 * allem anderen), und Kruste, Masse, Trims und Unterseite dieses Raums werden
 * von niemandem mehr geladen.
 *
 * Warum gerechnet und nicht aufgeschrieben: eine Handliste „diese Räume sind
 * fertig" wäre genau die Sorte Wahrheit, die an einer Grid-Änderung still
 * veraltet — und das Ergebnis wäre ein Raum mit Löchern oder ein Raum, der
 * 26 Blätter lädt, die er nie zeichnet. Diese Funktion fragt stattdessen das
 * Raster.
 */
export const phaseIsOneBlock = (grid: readonly string[], kit: MassKit | null): boolean => {
  const bodies = kit?.bodies ?? [];
  if (bodies.length === 0) return false;
  const byBodies = claimedBodyCells(kit);
  const otherClaimed = claimedPlatformCells(grid, kit?.columnObjects ?? [], byBodies);
  return bodyPartitionErrors(grid, bodies, { fullyPainted: true, otherClaimed }).length === 0;
};

/** A connected mass's shared material anchor and its stable origin cell. */
export interface MassComponent {
  minC: number;
  minR: number;
}

/**
 * Returns the four-neighbour connected components of unclaimed solid cells.
 * `minC/minR` is deliberately the only origin: every piece in that component
 * receives the same source phase, while separate masses may start their own
 * painted material field.
 */
export const massComponents = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): Map<string, MassComponent> => {
  const { w, h } = gridSize(grid);
  const seen = new Set<string>();
  const out = new Map<string, MassComponent>();
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const start = `${c},${r}`;
      if (seen.has(start) || claimed.has(start) || !isMass(glyphAt(grid, c, r))) continue;
      const cells: Array<[number, number]> = [[c, r]];
      seen.add(start);
      let minC = c, minR = r;
      for (let i = 0; i < cells.length; i++) {
        const [cc, rr] = cells[i] ?? [c, r];
        minC = Math.min(minC, cc); minR = Math.min(minR, rr);
        for (const [dc, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
          const nc = cc + dc, nr = rr + dr, key = `${nc},${nr}`;
          if (nc < 0 || nc >= w || nr < 0 || nr >= h) continue;
          if (seen.has(key) || claimed.has(key) || !isMass(glyphAt(grid, nc, nr))) continue;
          seen.add(key); cells.push([nc, nr]);
        }
      }
      const component = { minC, minR };
      for (const [cc, rr] of cells) out.set(`${cc},${rr}`, component);
    }
  }
  return out;
};

/**
 * THE WALK COURSE, as runs. Extracted from `planMass` because three things now
 * need exactly this definition and may never drift apart: the course itself, the
 * grain scattered over it, and the audit that proves the pair aperiodic. (The
 * method's own rule: hand the check the SOURCE, never a second copy of it.)
 *
 * `claimed` = cells a floating platform object owns outright; a platform draws
 * its own top, so it never wears a crust.
 */
export const crustRuns = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): Array<{ c: number; c1: number; r: number }> => {
  const { w, h } = gridSize(grid);
  const wears = (c: number, r: number): boolean => {
    const g = glyphAt(grid, c, r);
    if (!isMass(g) || g === "~" || claimed.has(`${c},${r}`)) return false;
    if (isMass(glyphAt(grid, c, r - 1))) return false; // buried
    return !isSlope(glyphAt(grid, c, r - 1)); // a ramp sits on it — it carries the crust
  };
  const runs: Array<{ c: number; c1: number; r: number }> = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!wears(c, r)) { c++; continue; }
      let c1 = c;
      while (c1 + 1 < w && wears(c1 + 1, r)) c1++;
      runs.push({ c, c1, r });
      c = c1 + 1;
    }
  }
  return runs;
};

/**
 * R5-W7 · A8 · D-27 · THE UNDERSIDE RUNS — `crustRuns`' mirror image.
 *
 * A crust run is the contiguous stretch of an exposed TOP; this is the
 * contiguous stretch of an exposed BOTTOM, and it is the geometry the chapter
 * has been missing since R5-W1: wherever a mass forms a ceiling or an overhang
 * it ends in a raw horizontal cut, because `planMass` knew five faces and not
 * the sixth.
 *
 * Measured over ch01's five surfaces before this was written — the numbers are
 * why it plans RUNS rather than one piece per cell:
 *
 *   p1  1 run   64 cells (the full-width ceiling row)
 *   p2 18 runs 137 cells (longest 22 — the room with real overhangs)
 *   p3  2 runs  66 cells
 *   p4  1 run   36 cells
 *   p9  2 runs  49 cells
 *   ────────────────────────  24 runs, 352 cells, longest 64
 *
 * A 64-cell run is 1024 world px. Laid as ONE tileSprite of ONE variant that is
 * wallpaper — the exact defect the round-1 critique named on the floor and that
 * `CRUST_SEGMENT_CELLS` exists to answer — so an underside is segmented and
 * value-jittered like the course above it.
 *
 * `thin` splits a run rather than being decided per piece: a cell with air ABOVE
 * as well as below is a one-cell-tall ledge, where a full-width band top and
 * bottom would leave no material visible between them. That is the same
 * reasoning as the side trims' one-cell column (`EDGE_W * 0.55`), turned 90°,
 * and a run may not mix the two because one tileSprite carries one height.
 *
 * `claimed` = cells a floating platform object owns outright; the object draws
 * its own underside, so it never wears this band.
 */
export const undersideRuns = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): Array<{ c: number; c1: number; r: number; thin: boolean }> => {
  const { w, h } = gridSize(grid);
  // `glyphAt` reports everything outside the grid as solid (the world edge is a
  // wall), so the grid's own bottom row has no air under it and grows no band —
  // the same guard the side trims get for free, and the reason this needs none.
  const wears = (c: number, r: number): boolean =>
    isMass(glyphAt(grid, c, r)) && !claimed.has(`${c},${r}`) && !isMass(glyphAt(grid, c, r + 1));
  const thinAt = (c: number, r: number): boolean => !isMass(glyphAt(grid, c, r - 1));
  const runs: Array<{ c: number; c1: number; r: number; thin: boolean }> = [];
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      if (!wears(c, r)) { c++; continue; }
      const thin = thinAt(c, r);
      let c1 = c;
      while (c1 + 1 < w && wears(c1 + 1, r) && thinAt(c1 + 1, r) === thin) c1++;
      runs.push({ c, c1, r, thin });
      c = c1 + 1;
    }
  }
  return runs;
};

/**
 * THE GRAIN — scuffs and shine marks over the walk surface (the no-metronome
 * law, ingredient 2). Everything about a mark comes out of its own cell's hash:
 * whether it exists at all, which kind it is, how long it is, and where in the
 * cell it sits. Nothing here knows the tile size, which is the point — this is
 * the layer whose rhythm owes the loop nothing.
 */
export const crustGrain = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): SurfaceMark[] => {
  const out: SurfaceMark[] = [];
  for (const { c, c1, r } of crustRuns(grid, claimed)) {
    for (let cc = c; cc <= c1; cc++) {
      if (hash2(cc, r, 1) >= CRUST_MARK_RATE) continue;
      const shine = hash2(cc, r, 2) < 0.38;
      const len = 4 + hash2(cc, r, 3) * 9; // 4…13 px — under a cell, always
      const thick = shine ? 0.8 + hash2(cc, r, 6) * 0.7 : 1.1 + hash2(cc, r, 6) * 1.3;
      out.push({
        kind: shine ? "shine" : "scuff",
        c: cc,
        r,
        x: cc * TILE + hash2(cc, r, 4) * Math.max(TILE - len, 1),
        // inside the course, never on its lip: a mark on the very edge reads as
        // a chipped floor rather than as wear
        y: r * TILE - CRUST_LIP + 2 + hash2(cc, r, 5) * (CRUST_H - 5),
        w: len,
        h: thick,
        alpha: shine ? 0.07 + hash2(cc, r, 7) * 0.07 : 0.08 + hash2(cc, r, 7) * 0.09,
      });
    }
  }
  return out;
};

// ── PK-R6 · H2 · THE LEDGE (round-2 finding 5) ───────────────────────────────
// „The book-spine floor band runs unbroken across the entire visible width with
// no gap, drop-off, or edge marking near the character — the player gets no
// visual cue before the ground runs out."
//
// The chapter's grids DO end their runs over air; what they never did was SAY
// so. Every walkable run — the laid course and every floating platform object
// alike — now declares its dangerous ends here, and the scene wears them as
// wear: the boards nearest a drop are the boards a school's worth of feet have
// scuffed pale, and the very lip catches the light. That is the classic edge
// treatment (a value change that intensifies toward the danger), it is drawn
// from the SAME grid the collision reads, and it costs the level design nothing.
//
// A drop is a drop, not a step: the neighbouring column must be open for
// `LEDGE_MIN_DROP` cells before the edge counts. Otherwise every one-cell stair
// in the chapter would light up like a cliff and the cue would mean nothing.

/** How many open cells must hang below a run's end before it is a real drop. */
export const LEDGE_MIN_DROP = 2;
/** How far back from the lip the warning wear reaches, in cells. */
export const LEDGE_WEAR_CELLS = 2;

export interface LedgeLip {
  /** the SURFACE cell the lip belongs to (the last solid one before the air) */
  c: number;
  r: number;
  /** which way the floor runs out */
  side: "l" | "r";
}

/** Is `(c, r)` standing over a genuine fall rather than a single step down? */
const dropsAway = (grid: readonly string[], c: number, r: number): boolean => {
  for (let d = 0; d < LEDGE_MIN_DROP; d++) {
    if (isMass(glyphAt(grid, c, r + d)) || isSlope(glyphAt(grid, c, r + d))) return false;
  }
  return true;
};

/**
 * Every walkable end that hangs over a fall — the course's runs and the floating
 * platforms in one list, because the child's question („does the floor stop
 * here?") does not care which of the two they are standing on.
 */
export const ledgeLips = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): LedgeLip[] => {
  const out: LedgeLip[] = [];
  const push = (c: number, c1: number, r: number): void => {
    if (dropsAway(grid, c - 1, r)) out.push({ c, r, side: "l" });
    if (dropsAway(grid, c1 + 1, r)) out.push({ c: c1, r, side: "r" });
  };
  for (const run of crustRuns(grid, claimed)) push(run.c, run.c1, run.r);
  for (const run of floatingPlatformRuns(grid)) push(run.c0, run.c1, run.r);
  return out;
};

/**
 * The wear that warns: pale, worn boards stepping toward the lip and brightest
 * ON it. Deterministic (every number comes from the cell's own hash, as the
 * grain's do) and expressed as ordinary `SurfaceMark`s, so the scene draws them
 * with the phase's own scuff and shine colours and no new drawing path exists.
 */
export const ledgeGrain = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): SurfaceMark[] => {
  const out: SurfaceMark[] = [];
  for (const lip of ledgeLips(grid, claimed)) {
    // …stepping BACK from the lip, onto the boards the child is still standing
    // on; the cell past the lip is the air they are about to walk into
    const back = lip.side === "r" ? -1 : 1;
    for (let step = 0; step < LEDGE_WEAR_CELLS; step++) {
      const c = lip.c + back * step;
      // …fading back from the lip, so the cue has a gradient to read, not a line
      const near = 1 - step / LEDGE_WEAR_CELLS;
      const len = TILE * (0.42 + 0.3 * near);
      const x = lip.side === "r" ? (c + 1) * TILE - len - 1 : c * TILE + 1;
      out.push({
        kind: "shine",
        c, r: lip.r,
        x,
        y: lip.r * TILE - CRUST_LIP + 1.6 + hash2(c, lip.r, 11) * 2,
        w: len,
        h: 1.5 + near,
        // …a shade stronger than ordinary grain (which tops out at 0.2): this
        // one is not texture, it is a warning, and it has to survive a wall the
        // squint test says is the same value as the floor
        alpha: 0.1 + 0.14 * near,
      });
      // …with the board's own dark line under the worn part, so the pale band
      // reads as a raised, rubbed edge rather than as a smear of fog
      out.push({
        kind: "scuff",
        c, r: lip.r,
        x: x + 0.6,
        y: lip.r * TILE - CRUST_LIP + 4.4 + hash2(c, lip.r, 12) * 2,
        w: len * 0.82,
        h: 1,
        alpha: 0.08 + 0.09 * near,
      });
    }
  }
  return out;
};

/**
 * THE PATINA on the mass below the course — the second half of the same law, and
 * the one the browser proof said was missing. Softer, broader and fainter than
 * the course's grain: this surface is a WALL of book spines and it has to stay
 * one, so its variation works by damp patches and worn light rather than by
 * scratches. Marks may overhang their cell (up to half a cell either side): a
 * patch that stops exactly on a cell boundary would draw the very grid it exists
 * to break.
 */
export const massGrain = (
  grid: readonly string[],
  claimed: ReadonlySet<string> = new Set(),
): SurfaceMark[] => {
  const { w, h } = gridSize(grid);
  const out: SurfaceMark[] = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!isMass(glyphAt(grid, c, r)) || claimed.has(`${c},${r}`)) continue;
      if (hash2(c, r, 21) >= MASS_MARK_RATE) continue;
      const shine = hash2(c, r, 22) < 0.42;
      // a patch may spill into a NEIGHBOURING cell of the same mass, and only
      // there: a smudge hanging in the air beside a ledge would read as a
      // rendering fault, not as wear.
      // The bounds check is not optional — glyphAt calls everything OUTSIDE the
      // grid SOLID, so without it every mark on column 0 spills off the world
      // (the same trap that grew phantom inner corners on every ground run
      // starting at column 0, caught then in the browser and here by the
      // containment battery in composition.test.ts).
      // …and it spills along ONE axis only. Two axes at once reach the DIAGONAL
      // cell, which the four straight neighbours say nothing about — a patch on
      // an inside corner then hangs off the terrain's step (caught by the
      // containment battery in composition.test.ts, at cell 5,3 of a stair
      // fixture). One axis makes containment true by construction.
      const open = (cc: number, rr: number): boolean =>
        cc >= 0 && cc < w && rr >= 0 && rr < h && isMass(glyphAt(grid, cc, rr)) && !claimed.has(`${cc},${rr}`);
      const wide = hash2(c, r, 29) < 0.6; // most patches lie along the course
      const spillL = wide && open(c - 1, r) ? TILE * 0.5 : 0;
      const spillR = wide && open(c + 1, r) ? TILE * 0.5 : 0;
      const spillU = !wide && open(c, r - 1) ? TILE * 0.35 : 0;
      const spillD = !wide && open(c, r + 1) ? TILE * 0.5 : 0;
      const mw = Math.min(TILE * (0.5 + hash2(c, r, 23) * 1.1), TILE + spillL + spillR);
      const mh = Math.min(TILE * (0.32 + hash2(c, r, 24) * 0.55), TILE + spillU + spillD);
      const x0 = c * TILE - spillL;
      const y0 = r * TILE - spillU;
      out.push({
        kind: shine ? "shine" : "scuff",
        c,
        r,
        x: x0 + hash2(c, r, 25) * Math.max(TILE + spillL + spillR - mw, 0),
        y: y0 + hash2(c, r, 26) * Math.max(TILE + spillU + spillD - mh, 0),
        w: mw,
        h: mh,
        alpha: shine ? 0.035 + hash2(c, r, 27) * 0.045 : 0.045 + hash2(c, r, 28) * 0.055,
      });
    }
  }
  return out;
};

/**
 * THE FINGERPRINT of a laid surface, cell by cell: which painted stem it wears,
 * at which value, carrying how much grain. Two cells with the same fingerprint
 * draw the same picture; a run whose fingerprints repeat on a short cycle IS the
 * wallpaper the critique saw.
 *
 * Read off the PLAN the renderer places rather than re-derived from the grid.
 * That matters: a second copy of the segmentation rule is a second rule, and the
 * one thing an audit may never do is measure a model of the thing instead of the
 * thing (the browser proof of p1 caught exactly this — the crust was varying and
 * the mass under it was not, because only one of them had been given the law).
 *
 * Returns one entry per contiguous row-run, keyed by its first cell.
 */
export const surfaceSignature = (
  pieces: readonly MassPiece[],
  kinds: readonly MassKind[],
  grain: readonly SurfaceMark[] = [],
): Map<string, string[]> => {
  // A mark's KIND and its rough SIZE both change what the cell looks like, so
  // both belong in the fingerprint; its exact pixel offset does not, and folding
  // that in would make every cell trivially unique and the audit worthless.
  const marks = new Map<string, string>();
  for (const m of grain) {
    const token = `${m.kind[0] ?? "?"}${Math.round((m.w / TILE) * 2)}`;
    const at = `${m.c},${m.r}`;
    marks.set(at, [...(marks.get(at) ?? "").split("+").filter(Boolean), token].sort().join("+"));
  }
  const want = new Set(kinds);
  /** row → column → the look drawn there */
  const byRow = new Map<number, Map<number, string>>();
  for (const p of pieces) {
    if (!want.has(p.kind)) continue;
    const cells = Math.max(1, Math.round(p.w / TILE));
    for (let k = 0; k < cells; k++) {
      const c = p.c + k;
      const row = byRow.get(p.r) ?? new Map<number, string>();
      row.set(c, `${p.stem ?? "-"}:${(p.tint ?? 0xffffff).toString(16)}:${marks.get(`${c},${p.r}`) ?? "-"}`);
      byRow.set(p.r, row);
    }
  }
  const out = new Map<string, string[]>();
  for (const [r, row] of byRow) {
    const cols = [...row.keys()].sort((a, b) => a - b);
    let start = null as number | null;
    let sig: string[] = [];
    let prev = -99;
    for (const c of cols) {
      if (start === null || c !== prev + 1) {
        if (start !== null) out.set(`${start},${r}`, sig);
        start = c;
        sig = [];
      }
      sig.push(row.get(c) ?? "");
      prev = c;
    }
    if (start !== null) out.set(`${start},${r}`, sig);
  }
  return out;
};

/** The smallest p ≥ 1 the sequence repeats on, or its length when it never does. */
export const shortestPeriod = (sig: readonly string[]): number => {
  for (let p = 1; p < sig.length; p++) {
    let ok = true;
    for (let i = 0; i + p < sig.length && ok; i++) if (sig[i] !== sig[i + p]) ok = false;
    if (ok) return p;
  }
  return sig.length;
};

/**
 * Cover a run of `cells` with COMPLETE objects, widest first (never stretched).
 * Where the palette offers several objects of the same width, `seed` picks
 * between them deterministically, so a level of 2-cell ledges is not a level
 * of identical benches.
 */
type PlatObject = { stem: string; cells: number; deck?: number };
const coverWithObjects = (
  cells: number,
  palette: readonly PlatObject[],
  seed: number,
): PlatObject[] => {
  const sorted = [...palette].filter((p) => p.cells >= 1).sort((a, b) => b.cells - a.cells);
  const out: PlatObject[] = [];
  let left = cells;
  let guard = 0;
  while (left > 0 && guard++ < 32) {
    const widest = sorted.find((p) => p.cells <= left)?.cells ?? sorted[sorted.length - 1]?.cells;
    if (widest === undefined) break;
    const sameWidth = sorted.filter((p) => p.cells === widest);
    const pick = sameWidth[(seed + out.length) % sameWidth.length];
    if (pick === undefined) break;
    out.push(pick);
    left -= pick.cells;
  }
  return out;
};

/**
 * THE PLAN. Every solid cell gets interior mass; every exposed face gets its
 * carved trim; every exposed top gets a crust RUN with flush end caps.
 * A null kit reproduces the old behaviour as `fallbackFill` pieces.
 */
export const planMass = (
  grid: readonly string[],
  kit: MassKit | null,
  srcSize?: SrcSizeLookup,
): MassPiece[] => {
  const { w, h } = gridSize(grid);
  const out: MassPiece[] = [];
  const claimed = new Set<string>(); // cells owned by a platform object
  let massByCell = new Map<string, MassComponent>();
  /** width ÷ height of a stem's art, 1 when the art is not (yet) resolvable */
  const aspect = (stem: string): number => {
    const s = srcSize?.(stem) ?? null;
    return s !== null && s.h > 0 ? s.w / s.h : 1;
  };
  /** the course's own scale (it must fit CRUST_H exactly) and the interior's,
   *  which is the same number stepped off the cell grid where it would land on it */
  const crustScale = kit !== null ? paintScaleOf(kit, srcSize) : FALLBACK_PAINT_SCALE;
  const paintScale = kit !== null ? bodyScaleOf(kit, srcSize) : FALLBACK_PAINT_SCALE;

  // ── 0 · deklarierte Sicht-Körper (R6 Ein-Block-Welt) ──────────────────────
  // VOR allem anderen, denn der Claim ist der Generalschlüssel: jeder spätere
  // Erzeuger (Kurs, Trims, Innenmasse, Grain, Säulen) respektiert `claimed`
  // und lässt die Körper-Zellen aus — die Migration läuft körperweise.
  if (kit !== null) {
    (kit.bodies ?? []).forEach((body, bodyIdx) => {
      const cells = bodyCells(body);
      for (const cell of cells) claimed.add(`${cell.c},${cell.r}`);
      const s = TILE / body.pxPerCell;
      const maskW = Math.max(...body.rows.map((row) => row.length), 1);
      const sheetW = maskW * body.pxPerCell + body.overpaint.l + body.overpaint.r;
      const sheetH = body.rows.length * body.pxPerCell + body.overpaint.t + body.overpaint.b;
      const x0 = body.c0 * TILE - body.overpaint.l * s;
      const y0 = body.r0 * TILE - body.overpaint.t * s;
      // Anbau-Kragen (attachTo) liegen per Deklarations-Reihenfolge ein
      // Epsilon über ihrem Wirt — gewachsen, nie gestoßen (K9).
      const depth = DEPTH.bodyMount + bodyIdx * 0.001;
      const slices = body.slices ?? [{ stem: body.stem, srcX: 0, srcW: sheetW }];
      for (const slice of slices) {
        out.push({
          kind: "bodyMount", stem: slice.stem, c: body.c0, r: body.r0,
          x: x0 + slice.srcX * s, y: y0, w: slice.srcW * s, h: sheetH * s,
          srcScale: s, cells, depth,
        });
      }
    });
  }

  // ── 1 · complete platforms and vertical book objects ──────────────────────
  if (kit !== null) {
    const columnObjects = kit.columnObjects ?? [];
    for (const run of columnRuns(grid, { includeHanging: true })) {
      // Zellen, die ein Sicht-Körper besitzt, stehen keiner Säule mehr zu —
      // sonst zeichnete ein registriertes Maß doppelt in das Gemälde.
      if (claimed.has(`${run.c0},${run.r0}`)) continue;
      const obj = columnObjects.find((candidate) =>
        candidate.cellsW === run.c1 - run.c0 + 1
          && candidate.cellsH === run.r1 - run.r0 + 1
          && Boolean(candidate.hanging) === Boolean(run.hanging));
      if (obj === undefined) continue;
      out.push({
        kind: "platform", stem: obj.stem, c: run.c0, r: run.r0,
        x: run.c0 * TILE, y: run.r0 * TILE, w: obj.cellsW * TILE, h: obj.cellsH * TILE,
        depth: DEPTH.platform,
      });
    }
    for (const run of floatingPlatformRuns(grid)) {
      if (claimed.has(`${run.c0},${run.r}`)) continue; // Körper-Zellen (§0)
      const width = run.c1 - run.c0 + 1;
      let x = run.c0 * TILE;
      for (const obj of coverWithObjects(width, kit.platObjects, run.c0 + run.r)) {
        // sized by the span it fills; the height follows the PAINTED aspect so
        // a bench stays a bench instead of being stretched to the cell box
        const span = obj.cells * TILE;
        const wantH = span / Math.max(aspect(obj.stem), 0.05);
        // ── R5-W9 · M1 · DER DECKEL QUETSCHT NICHT MEHR, ER VERKLEINERT ──────
        //
        // Hier stand `objH = Math.min(objW / aspect, TILE * 2)` — die Hoehe
        // wurde bei zwei Zellen abgeschnitten und die BREITE blieb stehen. Das
        // ist ein gequetschtes Bild, und bis zu dieser Runde war es latent:
        // kein Objekt des Kapitels erreichte den Deckel. Mit der Anhebung von
        // `plat_bookpile_l` (1 → 2 Zellen, Posten 2) erreicht es ihn — gemessen
        // 33,2 px gewollt gegen 32 px erlaubt, also **3,8 % senkrecht
        // gestaucht**, und das neue Verzogen-Gesetz in Audit 10 hat es beim
        // ersten Lauf rot gemeldet. Genau dafuer ist es gebaut.
        //
        // WOFUER der Deckel da ist, bleibt richtig: ein hochformatiges Blatt
        // auf einem breiten Sims wuerde sonst zu einem Turm, der den Raum
        // verstellt. Was falsch war, ist der WEG dorthin. Jetzt schrumpfen
        // beide Achsen mit demselben Faktor, und was an Breite fehlt, wird in
        // der Spanne ZENTRIERT: die Spanne gehoert dem Gitter (`x` rueckt
        // weiter um `span`, damit die Objekte eines Laufes auf dem Raster
        // bleiben), das Bild gehoert der Malerei.
        // R7: der Deckel begrenzt die UNTER-DECK-Tiefe, nicht die Gesamthöhe —
        // sein Warum ist »kein Turm, der den Raum verstellt«, und was über der
        // Steh-Linie aufragt (Lehne, Pult-Aufsatz), ist deck-verankertes Motiv,
        // kein Raumverbau. Das Stand-Pult-Regal (170 px, deck 0,39) fiel sonst
        // auf 75 % und ließ seine vierte Zelle nackt (gemessen, no-naked-fill).
        const belowWant = wantH * (1 - (obj.deck ?? 0));
        const shrink = belowWant > TILE * 2 ? (TILE * 2) / belowWant : 1;
        const objW = span * shrink;
        const objH = wantH * shrink;
        // anchored by its DECK, not its top edge: whatever the art draws above
        // the walk surface (the bench's backrest) rises above the standable
        // line instead of being buried in the floor
        out.push({
          kind: "platform", stem: obj.stem, c: Math.floor(x / TILE), r: run.r,
          x: x + (span - objW) / 2, y: run.r * TILE - (obj.deck ?? 0) * objH, w: objW, h: objH,
          depth: DEPTH.platform,
        });
        x += span;
      }
    }
    for (const cell of claimedPlatformCells(grid, columnObjects, claimedBodyCells(kit))) claimed.add(cell);
    massByCell = massComponents(grid, claimed);
    const platformPieces = out.filter((p) => p.kind === "platform");
    if (kit.joint !== undefined) {
      const source = srcSize?.(kit.joint) ?? undefined;
      out.push(...platformJoinPieces(platformPieces, kit.joint, crustScale, source));
    }
    if (kit.postJoin !== undefined) {
      const postSource = srcSize?.(kit.postJoin) ?? undefined;
      out.push(...postJoinPieces(grid, platformPieces, kit.postJoin, crustScale, postSource));
    }
  }

  // ── 2 · interior mass: body → fade → sediment, as seamless per-row runs ────
  for (let r = 0; r < h; r++) {
    let c = 0;
    while (c < w) {
      const g = glyphAt(grid, c, r);
      if (!isMass(g) || claimed.has(`${c},${r}`)) { c++; continue; }
      if (kit === null) {
        out.push({ kind: "fallbackFill", stem: null, c, r, x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.body });
        c++;
        continue;
      }
      // A run now shares its DEPTH BUCKET, not merely its painted sheet: two
      // cells of the same paper at different depths owe the room different
      // amounts of light, and one tileSprite can only carry one tint. Past the
      // ramp every depth buckets together, so a deep mass is still one piece.
      const bucket = depthBucketAt(depthAt(grid, c, r));
      const band = bandAt(bucket);
      let c1 = c;
      while (
        c1 + 1 < w
        && isMass(glyphAt(grid, c1 + 1, r))
        && !claimed.has(`${c1 + 1},${r}`)
        && depthBucketAt(depthAt(grid, c1 + 1, r)) === bucket
      ) c1++;
      // Below BODY_DEEP_AT the interior draws the deeper-PAINTED row instead of
      // wearing more multiply — when the phase has one. Phases still on the
      // shared kit keep the single-row behaviour exactly.
      const deepBody = band === "body" && bucket >= BODY_DEEP_AT ? kit.bodyDeep : undefined;
      const variants = band === "body"
        ? (deepBody ?? kit.body)
        : (band === "fade" ? kit.fade : [kit.sediment]);
      // A connected mass owns one source phase. The old run-local hash made each
      // row restart the painting and exposed the assembler as a vertical seam.
      // Separate masses may still own separate material fields.
      const component = massByCell.get(`${c},${r}`);
      const componentTileOffsetX = component === undefined ? 0 : (component.minC * TILE) / paintScale;
      // …laid in SEGMENTS, like the course above it and on its own table, so the
      // mass under the hall stops being one 656-px tileSprite of one variant
      // (measured in the running p1 — the wallpaper the critique was reading)
      let seg = c;
      for (let k = 0; seg <= c1; k++) {
        const want = BODY_SEGMENT_CELLS[(c + r + k) % BODY_SEGMENT_CELLS.length] ?? 5;
        const segEnd = Math.min(seg + want - 1, c1);
        const componentStep = component === undefined
          ? c + r + k
          : Math.floor((c - component.minC) + (r - component.minR) * 0.5 + k);
        const stem = variants[Math.abs(componentStep) % variants.length] ?? variants[0] ?? kit.fade[0] ?? "";
        out.push({
          kind: band, stem, c: seg, r, x: seg * TILE, y: r * TILE,
          w: (segEnd - seg + 1) * TILE, h: TILE,
          // the interior is a CONTINUUM: anchored on both axes, so the row below
          // draws the next slice of the same painting instead of restamping it
          tile: true, srcScale: paintScale, tileAnchor: "xy", tileOffsetX: componentTileOffsetX,
          // Restrained value variation follows the component's material walk,
          // rather than restarting from a different random seed at each run.
          tint: mixMultiply(
            CRUST_TINTS[Math.abs(componentStep + Math.floor((r - (component?.minR ?? r)) / 4)) % CRUST_TINTS.length] ?? 0xffffff,
            kit.bodyDeep === undefined
              ? depthTintAt(bucket)
              : depthTintAt(bucket, deepBody === undefined ? 1 : BODY_DEEP_SHADE, BODY_HANDOVER_PAINTED),
          ),
          depth: DEPTH.body,
        });
        seg = segEnd + 1;
      }
      c = c1 + 1;
    }
  }
  if (kit === null) return out;

  // ── 3 · crust runs + FLUSH end caps on every exposed top ───────────────────
  for (const { c, c1, r } of crustRuns(grid, claimed)) {
    const x = c * TILE;
    const runW = (c1 - c + 1) * TILE;
    const y = r * TILE - CRUST_LIP;
    // the course, laid in alternating segments (CRUST_SEGMENT_CELLS) at
    // alternating values (CRUST_TINTS) — the no-metronome law
    let seg = c;
    for (let k = 0; seg <= c1; k++) {
      const want = CRUST_SEGMENT_CELLS[(c + r + k) % CRUST_SEGMENT_CELLS.length] ?? 4;
      const segEnd = Math.min(seg + want - 1, c1);
      const stem = kit.crust[(c + r + k) % kit.crust.length] ?? kit.crust[0] ?? "";
      out.push({
        kind: "crust", stem, c: seg, r, x: seg * TILE, y,
        w: (segEnd - seg + 1) * TILE, h: CRUST_H, tile: true,
        // a COURSE, not a continuum: pinned horizontally so neighbouring
        // segments stay seamless, and never vertically — see MassPiece.tileAnchor
        srcScale: crustScale, tileAnchor: "x",
        tint: crustTintAt(c, r, k), depth: DEPTH.crust,
      });
      seg = segEnd + 1;
    }
    if (kit.integratedCrustEnds) continue;
    // CAPS OVERLAP INWARD. The AF caps are painted as SEGMENT ENDS — a
    // rounded end followed by a stretch of the same course — not as outboard
    // bookends. So a cap is laid ON the run's last stretch with its outer
    // edge exactly at the run's outer edge: the rounded end lands on the
    // terrain boundary and the rest blends into the identical loop beneath.
    // (Hanging them outside is what made Build-D's caps read as floating.)
    const capW = CRUST_H * Math.max(aspect(kit.crustCapL), 0.2);
    // ── R5-W9 · F10 · D-639 · DER VERWAISTE L-WINKEL ──────────────────────────
    //
    // Hier stand `capsFit = runW >= 2 * capW`: ein Lauf musste doppelt so breit
    // sein wie eine Kappe, sonst bekam er GAR KEINE. M1 hat nachgezaehlt, was
    // das kostet — die Kappe ist 2,08…2,58 Zellen breit, die Schwelle also
    // 4,15…5,16 Zellen, und **25 von 42 Kruste-Laeufen in ch01 liegen darunter**.
    // Sie enden roh-quadratisch; die einzige Anatomie an ihrem Ende sind die
    // 8-px-Seitentrims. Kokis Stelle ist p2 r18 c12–14 mit einem 1-Zellen-Bein
    // bei r19 c14: drei Zellen, 48 px, gegen eine Schwelle von 82.
    //
    // Ein blinder Leser hat den Bestand ohne jedes Vorwissen genau so gelesen:
    // »wirkt wie eine Roehre, die mitten in der Laenge abgeschnitten wurde …
    // der deutlichste Schnitt-Eindruck von allen sechs untersuchten Enden«.
    //
    // WAS HIER NICHT GEHT: die Kappe schmal quetschen. M1s Verzogen-Gesetz
    // (`SCALE_ANISO_TOL`, 2 %) macht »quer anders als hoch« rot — und zu Recht,
    // eine gestauchte Kappe ist genau das »Lego, das nicht zusammenpasst«.
    //
    // WAS STATTDESSEN GESCHIEHT: die Kappe wird GEFENSTERT. Sie behaelt ihren
    // Massstab (`w` bleibt `capW`, das Tor misst unveraendert) und zeigt nur ihr
    // AEUSSERES Stueck — die gemalte Rundung sitzt am Ende, der Rest der Kappe
    // ist ohnehin »eine Strecke desselben Kurses«. Zwei halbe Kappen sind damit
    // nie breiter als der Lauf, und jeder Lauf ab 12 px bekommt zwei Enden.
    //
    // Gemessen ueber alle fuenf Raeume: **17 von 42 Laeufen mit Kappe → 41 von
    // 42** (der eine Rest liegt an der Weltkante, wo das Gesetz die Kappe seit
    // jeher unterdrueckt). Ein blindes Paar mit getauschter Reihenfolge nennt
    // das Ergebnis an beiden Enden »gewollt« und den Bestand »abgeschnitten«
    // (2:0); zwischen »eine Kappe« und »zwei gefensterte« sah keiner der beiden
    // einen Unterschied — den Ausschlag gab deshalb die Deckung, nicht der
    // Geschmack.
    const zeig = Math.min(capW, runW / 2);
    const fw = zeig / capW;
    if (zeig >= CAP_MIN_PX) {
      if (c > 0) {
        out.push({ kind: "capL", stem: kit.crustCapL, c, r, x, y, w: capW, h: CRUST_H, depth: DEPTH.cap, ...(fw < 1 ? { crop: { fw, from: "left" as const } } : {}) });
      }
      if (c1 < w - 1) {
        out.push({ kind: "capR", stem: kit.crustCapR, c: c1, r, x: x + runW - capW, y, w: capW, h: CRUST_H, depth: DEPTH.cap, ...(fw < 1 ? { crop: { fw, from: "right" as const } } : {}) });
      }
    }
  }

  // ── 3b · THE UNDERSIDE BAND on every exposed bottom (R5-W7 · A8 · D-27) ────
  //
  // The sixth face. Until this round a mass that formed a ceiling or an overhang
  // simply stopped at a raw horizontal cut — five faces had anatomy and one had
  // none, in all five rooms.
  //
  // ★ THE WHOLE BLOCK IS BEHIND ONE `undefined` CHECK, AND THAT IS THE DESIGN.
  // No accepted delivery has ever contained this cell (AS3 rejected on tiling,
  // AS5b/c/d/e rejected), so no kit on `main` declares `edgeD` and not one piece
  // is planned: the plan, the display list and the picture are identical to what
  // they were before the hook existed (measured, five surfaces). SPEC §9.4's
  // rule — no hook without art — is about hooks that DRAW; this one cannot.
  // See `composition.ts#MassKit.edgeD` for the long form.
  //
  // Laid like the course above it rather than like the side trims beside it,
  // because that is what it IS: a band that repeats sideways. So it takes the
  // course treatment — segments from `CRUST_SEGMENT_CELLS`, alternating
  // variants, `tileAnchor: "x"` (a band whose drawn height is not its source
  // height must never be pinned vertically, or Phaser slices it by
  // `y mod sourceHeight` — the defect `MassPiece.tileAnchor` documents on the
  // crust) — and no `srcW`: a window is what a one-cell-wide STRIP wants; a
  // 1024-px run would declare a window wider than its own painting.
  //
  // It does NOT take the crust's value jitter. Its five siblings (the two side
  // trims, the four corners) wear the lay-back and the depth ramp and nothing
  // else, and a trim that announces its own rhythm is the thing `TRIM_SHADE`'s
  // note calls „a trim that has stopped being anatomy".
  if (kit.edgeD !== undefined && kit.edgeD.length > 0) {
    const variants = kit.edgeD;
    for (const { c, c1, r, thin } of undersideRuns(grid, claimed)) {
      // the same one-cell rule as the side trims (`trimW`), turned 90°: on a
      // ledge one cell tall the crust already owns the top, so a full-depth band
      // under it would leave none of the material it is cut from visible.
      const bandH = thin ? EDGE_W * 0.55 : EDGE_W;
      const y = r * TILE + TILE + EDGE_OUT - bandH; // 2 px proud, the rest inside
      let seg = c;
      for (let k = 0; seg <= c1; k++) {
        const want = CRUST_SEGMENT_CELLS[(c + r + k) % CRUST_SEGMENT_CELLS.length] ?? 4;
        const segEnd = Math.min(seg + want - 1, c1);
        const stem = variants[(c + r + k) % variants.length] ?? variants[0] ?? "";
        out.push({
          kind: "edgeD", stem, c: seg, r,
          x: seg * TILE, y, w: (segEnd - seg + 1) * TILE, h: bandH,
          tile: true, srcScale: paintScale, tileAnchor: "x",
          tint: mixMultiply(kit.trimShade ?? TRIM_SHADE, depthTintAt(depthBucketAt(depthAt(grid, seg, r)))),
          depth: DEPTH.trim,
        });
        seg = segEnd + 1;
      }
    }
  }

  // ── 4 · edges + corners wherever mass meets air ────────────────────────────
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!isMass(glyphAt(grid, c, r)) || claimed.has(`${c},${r}`)) continue;
      const x = c * TILE;
      const y = r * TILE;
      const airL = !isMass(glyphAt(grid, c - 1, r));
      const airR = !isMass(glyphAt(grid, c + 1, r));
      const airD = !isMass(glyphAt(grid, c, r + 1));
      const airU = !isMass(glyphAt(grid, c, r - 1));
      // R5-W1 · A1 · THE TRIMS BELONG TO THE MASS THEY TRIM.
      //
      // A trim used to be one stretched Image per cell: the 248×512 strip of cut
      // page-edges squashed into an 8×16 box and stacked, so a four-cell shaft
      // wall was four stamps with a joint at every cell (p2 places 117 of them),
      // and it wore the room's full light at 71.5 % luminance against a 46.2 %
      // body — a bright rail down the side of every mass, which is what the
      // pale "rope columns" in Koki's screenshots are.
      //
      // The art is a TEXTURE, not a designed piece, so it tiles: laid at the
      // painting's own vertical scale and anchored in world space, the joints
      // stop existing and its page-edges come out the same physical size as the
      // books beside them. And it takes the same depth light as the mass, so a
      // trim six rows down is as deep as the paper it is carved into.
      // R5-W3 · A5 · R3: the window is sized by the WORLD's paint scale, so the
      // page-edges really do come out the same physical size as the books beside
      // them — which is what the paragraph above has always promised and what
      // the old `EDGE_W / srcW(stem)` did the opposite of (2.49× squash).
      // R5-W4 · A6: the lay-back is the KIT's, not the school's. `TRIM_SHADE` was
      // calibrated against one sheet (71.5 % over a 46.2 % body); applied to a
      // room that has painted its own trims it turns a carved edge into a groove.
      // See `composition.ts#TRIM_SHADE_BY_PHASE`.
      const trim = (stem: string, wPx: number): Partial<MassPiece> => ({
        tile: true,
        srcScale: paintScale,
        srcW: wPx / paintScale,
        tileAnchor: "xy",
        tint: mixMultiply(kit.trimShade ?? TRIM_SHADE, depthTintAt(depthBucketAt(depthAt(grid, c, r)))),
      });
      const cornerTint = mixMultiply(kit.trimShade ?? TRIM_SHADE, depthTintAt(depthBucketAt(depthAt(grid, c, r))));
      // ── R5-W9 · M1 · DIE ECKEN GEHOEREN ZUR MASSE, DIE SIE ABRUNDEN ────────
      //
      // Bis hierher war eine Ecke ein Bild in einem Kasten von `CORNER` = 12 px,
      // und der Kasten war eine gewaehlte Zahl. Gemessen heisst das: ein 512er
      // Blatt zeichnet bei 12 px 0,0234 Welt-px je Quell-px, waehrend der Trim
      // EINEN Bildpunkt daneben bei `paintScale` = 0,0802 zeichnet — dieselbe
      // Malerei, **3,42-mal feiner**, an einer gemeinsamen Naht. Genau das
      // meint Kokis „Lego, das nicht zusammenpasst": nicht die Farbe, die
      // GROESSE der Buchruecken springt am Stoss.
      //
      // Und `mass_incorner_r` (510x432) war zusaetzlich **18,1 % senkrecht
      // gestaucht**, weil ein quadratischer Kasten ein nicht-quadratisches
      // Blatt quetscht. Das ist kein Geschmack, das ist ein verzogenes Bild.
      //
      // ── ★ NARBE: DIE ECKE AUF WELT-MASSSTAB ZU HEBEN IST GEBAUT, GEMESSEN
      //    UND VON ZWEI BLINDEN LESERN VERWORFEN WORDEN (M1, 2026-08-22) ──────
      //
      // Der naheliegende Schluss aus den Zahlen oben war: der Kasten waechst auf
      // das, was das Blatt im Welt-Massstab misst — also 512 x 0,0802 = **41,1
      // px statt 12**, dieselbe Bauart, die die Kruste-Kappe schon hat. Das ist
      // gebaut worden, die Zahlen wurden perfekt (alle vier Ecken 1,00 x 1,00),
      // und das BILD wurde schlechter: eine Ecke von 41 px ist 2,6 Zellen breit
      // und legt sich als heller Holzkeil ueber das Buchmaterial, das sie
      // abrunden soll.
      //
      // Zwei blinde Leser (Sonnet 5, dasselbe Bildpaar in GETAUSCHTER
      // Reihenfolge, p3 Warp 16,17, Takt 276, Kamera 179/164) haben beide und
      // unabhaengig den ALTEN Stand als das Bild genannt, das sich eher wie EIN
      // Material liest — 2:0. Einer beschrieb den neuen Stand woertlich als
      // „zusaetzliche schmale, rechteckige Vorspruenge, die wie einzeln
      // angesetzte Holzkloetze wirken statt wie aus dem Buecherstapel
      // herausgearbeitete Stufen".
      //
      // Was daraus folgt, ist keine Meinung, sondern eine BESTELLUNG: die vier
      // Eckblaetter sind fuer ihre Rolle zu gross gemalt. Eine Ecke, die eine
      // 16-px-Zelle abrundet, braucht ein Blatt von rund 150 px, nicht 512. So
      // lange sie 512 sind, ist „im Welt-Massstab" und „so gross wie die
      // Anatomie" nicht dasselbe, und die Anatomie gewinnt — genau wie bei
      // `EDGE_W` fuer den Trim und `CRUST_H` fuer den Kurs. Die verbleibende
      // Untergroesse steht als benannte Ausnahme in
      // `check-composition.mjs#SCALE_WAIVERS` und faellt mit AS6.
      //
      // ── WAS BLEIBT, UND WARUM ES KEINE GESCHMACKSFRAGE IST ─────────────────
      // Der Kasten war QUADRATISCH (12 x 12) und bekam Blaetter von 512x504,
      // 512x503, 512x494 und **510x432**. Das letzte wurde damit **18,1 %
      // senkrecht gestaucht** — ein verzogenes Bild, kein kleineres. Der Kasten
      // traegt ab jetzt das Seitenverhaeltnis seines eigenen Blattes: die
      // laengere Seite ist `CORNER`, die kuerzere folgt. Beide Achsen zeichnen
      // damit denselben Massstab, und das neue Verzogen-Gesetz in Audit 10
      // (`SCALE_ANISO_TOL`) haelt das fest.
      const cornerBox = (stem: string): { w: number; h: number } => {
        const s = srcSize?.(stem) ?? null;
        if (s === null || s.w <= 0 || s.h <= 0) return { w: CORNER, h: CORNER };
        const k = CORNER / Math.max(s.w, s.h);
        return { w: s.w * k, h: s.h * k };
      };
      // THE ONE-CELL COLUMN (critic round 2, both final reviewers, independently:
      // "reads as a flat translucent placeholder box", "an ivory baluster inserted
      // NEXT TO a book stack, not grown from the same stuff").
      //
      // A trim is 8 px of a 16 px cell. On a column one cell wide BOTH faces are
      // exposed, so the two trims tile the whole width and the book material they
      // are supposed to be carved out of never appears at all — the pillar stops
      // being terrain and becomes a bar. Narrowing them leaves a strip of the
      // room's own paper down the middle, which is the whole read: an edge is a
      // cut through matter, and you have to be able to see the matter.
      const trimW = airL && airR ? EDGE_W * 0.55 : EDGE_W;
      if (airL) out.push({ kind: "edgeL", stem: kit.edgeL, c, r, x: x - EDGE_OUT, y, w: trimW, h: TILE, ...trim(kit.edgeL, trimW), depth: DEPTH.trim });
      if (airR) out.push({ kind: "edgeR", stem: kit.edgeR, c, r, x: x + TILE + EDGE_OUT - trimW, y, w: trimW, h: TILE, ...trim(kit.edgeR, trimW), depth: DEPTH.trim });
      if (airL && airD) {
        const b = cornerBox(kit.cornerBL);
        out.push({ kind: "cornerBL", stem: kit.cornerBL, c, r, x: x - EDGE_OUT, y: y + TILE - b.h + EDGE_OUT, w: b.w, h: b.h, tint: cornerTint, depth: DEPTH.trim });
      }
      if (airR && airD) {
        const b = cornerBox(kit.cornerBR);
        out.push({ kind: "cornerBR", stem: kit.cornerBR, c, r, x: x + TILE + EDGE_OUT - b.w, y: y + TILE - b.h + EDGE_OUT, w: b.w, h: b.h, tint: cornerTint, depth: DEPTH.trim });
      }
      // inner corners: where a wall rises out of the floor beside this cell.
      // glyphAt reports OUTSIDE the grid as solid, so the diagonal probe has to
      // be bounds-checked or every ground run grows a phantom corner against
      // the world edge (seen in the p1 browser proof before this guard).
      const inGrid = (cc: number, rr: number): boolean => cc >= 0 && cc < w && rr >= 0 && rr < h;
      if (airU && inGrid(c - 1, r - 1) && isMass(glyphAt(grid, c - 1, r - 1))) {
        const b = cornerBox(kit.inCornerL);
        out.push({ kind: "inCornerL", stem: kit.inCornerL, c, r, x, y: y - b.h + EDGE_OUT, w: b.w, h: b.h, tint: cornerTint, depth: DEPTH.trim });
      }
      if (airU && inGrid(c + 1, r - 1) && isMass(glyphAt(grid, c + 1, r - 1))) {
        const b = cornerBox(kit.inCornerR);
        out.push({ kind: "inCornerR", stem: kit.inCornerR, c, r, x: x + TILE - b.w, y: y - b.h + EDGE_OUT, w: b.w, h: b.h, tint: cornerTint, depth: DEPTH.trim });
      }
    }
  }

  // ── 5 · slopes as drawn ramp masses (the crust runs diagonally) ────────────
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const g = glyphAt(grid, c, r);
      if (g === "z" || !isSlope(g)) continue; // `z` is the slide, handled below
      const up = g === "/" || g === "1" || g === "2";
      const wide = g === "1" || g === "3"; // the 30° pairs span two cells
      const stem = up ? kit.rampUp : kit.rampDown;
      // R5-W6 · A7 · D-324. The ramp sheets are optional now, and this is the one
      // place that would have drawn them. Pushing an undefined stem here would
      // put an invisible hole in the floor exactly where a child expects to walk
      // up — silent, and only findable from a screenshot. ch01 carries no slope
      // glyph at all, so this cannot fire today; the moment a surface grows one,
      // it should stop the build and be answered with a commission (R109), not
      // with a placeholder revived by accident.
      if (stem === undefined) {
        throw new Error(
          `planMass: the grid carries the slope glyph "${g}" at column ${c}, row ${r}, but this kit declares no `
            + `${up ? "rampUp" : "rampDown"} sheet. The shared ramp placeholders were deleted in R5-W5 · E6 (D-267); `
            + "a surface with slopes needs its own ramp art ordered (SPEC_MASSEN_KIT §10).",
        );
      }
      out.push({
        kind: "ramp", stem, c, r,
        x: c * TILE, y: r * TILE - CRUST_LIP, w: (wide ? 2 : 1) * TILE, h: TILE + CRUST_LIP,
        depth: DEPTH.ramp,
      });
    }
  }

  // ── 6 · the chalk slide: ONE module per `z` cell ───────────────────────────
  // Batch AF2 re-authored the slide as TRUE-45° CELLS — each module is drawn
  // corner-to-corner inside a 512² cell, and the under-strut is that cell's
  // triangular wedge. So the chute is assembled by the grid itself: no
  // rotation, no along-diagonal stepping, no seams to chase. (AF's earlier
  // sheet wanted a rotated band laid along the run; the art changed contract,
  // and the renderer follows the art.)
  if (kit.slide) {
    const slide = kit.slide;
    for (const run of slideRuns(grid)) {
      for (let k = 0; k < run.n; k++) {
        const c = run.c + k;
        const r = run.r + k;
        out.push({
          kind: "slideUnder", stem: slide.under, c, r,
          x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.ramp,
        });
        const first = k === 0;
        const last = k === run.n - 1;
        out.push({
          kind: first ? "slideTop" : last ? "slideFoot" : "slideMid",
          stem: first ? slide.top : last ? slide.foot : slide.mid,
          c, r, x: c * TILE, y: r * TILE, w: TILE, h: TILE, depth: DEPTH.slide,
        });
      }
    }
  }

  return out;
};

/** The audit's question: did anything render as a naked engine fill? */
export const nakedFills = (pieces: readonly MassPiece[]): MassPiece[] =>
  pieces.filter((p) => p.kind === "fallbackFill");

/**
 * The OTHER naked class, and the one only a kit can produce: a solid cell no
 * interior piece covers, so the wash shows straight through the ground. The
 * plan must account for every solid cell in the world — not every screen.
 */
export const uncoveredSolids = (
  grid: readonly string[],
  pieces: readonly MassPiece[],
): Array<{ c: number; r: number }> => {
  const covers: MassKind[] = ["body", "fade", "sediment", "platform", "fallbackFill", "bodyMount"];
  const covered = new Set<string>();
  for (const p of pieces) {
    if (!covers.includes(p.kind)) continue;
    // R6: ein Körper deckt genau SEINE Zellen — die Rechteck-Ableitung darunter
    // würde bei 34 % Füllgrad Luft als gedeckt melden (falsch-grünes Audit 3).
    if (p.cells !== undefined) {
      for (const cell of p.cells) covered.add(`${cell.c},${cell.r}`);
      continue;
    }
    const cellsW = Math.max(1, Math.round(p.w / TILE));
    const cellsH = p.kind === "platform" ? Math.max(1, Math.round(p.h / TILE)) : 1;
    for (let y = 0; y < cellsH; y++) {
      for (let x = 0; x < cellsW; x++) covered.add(`${p.c + x},${p.r + y}`);
    }
  }
  const out: Array<{ c: number; r: number }> = [];
  const { w, h } = gridSize(grid);
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (isMass(glyphAt(grid, c, r)) && !covered.has(`${c},${r}`)) out.push({ c, r });
    }
  }
  return out;
};
