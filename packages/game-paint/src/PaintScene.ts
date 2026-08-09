// THE PAINTED BOOK — the phase scene: a THIN renderer over the pure brains.
// One instance renders ONE phase. All simulation runs on the fixed 60Hz
// accumulator (never wall-clock); the rig compositor applies rig.ts poses to
// the sliced parts. P-49 LAW: this scene NEVER starts/stops scenes — phase
// handoffs go through the React shell's handoff() (PaintGame.tsx).
//
// PB-C1 · COMPOSITION (doc 36). The backdrop is no longer one painting behind
// the play space and terrain is no longer strips-over-fill: a phase with a
// composition manifest renders FIVE PLANES (layers.ts) over a CARVED MASS
// (mass.ts), both planned by pure functions this scene merely places. A phase
// with no manifest — or whose kit art has not landed — renders exactly as it
// did before (the fallback law), so nothing breaks while art is pending.

import Phaser from "phaser";
import { glyphAt, isSlope, isSolid } from "./collide.ts";
import { type CompositionSpec, type MassKit, compositionFor } from "./composition.ts";
import { type LayerPiece, coverFit, planLayers } from "./layers.ts";
import { AIR_DEPTH, type AirPiece, planHaze, planMotes, planShafts, vignetteBands } from "./air.ts";
import { CRUST_MARK_DEPTH, MASS_MARK_DEPTH, type MassPiece, type SurfaceMark, claimedPlatformCells, crustGrain, hash01, ledgeGrain, massGrain, planMass } from "./mass.ts";
import { LETTER_STYLE, letterGlyphs } from "./letters.ts";
import { PICKUP_ROLES, type PaintLevel, type PhaseSpec } from "./level.ts";
import { type AirModel, LOGICAL_H, LOGICAL_W, MAX_TICKS_PER_FRAME, RENDER_SCALE, SUBS, TICK_MS, TILE, fromSubs } from "./paint.ts";
import { type FistState } from "./fist.ts";
import { type Pad, type PlayerState } from "./player.ts";
import { type EntityWorld, GUARDIAN_SCRIPT, JOY_ROLES, SHARD_TICKS, engageTargetId, telegraphTicksFor } from "./entities.ts";
import { COLLECT_ANCHOR_PX, MAGNET_FIELD_PX, Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { FOCUS_MS, focusView } from "./camera.ts";
import { CAGE_OPEN_TICKS, CELL_IS_DIRECTIONAL, type EntPoseInput, WASHED_ROLES, entPoseCell, floodBloomFor, greyLuma, guardianPitchRad, poseStateOf, washAlphaFor } from "./anim.ts";
import { RIG, rigPose, withFistAway, withBrace } from "./rig.ts";
import {
  RIG_CELL,
  RIG_PART_ORDER,
  RIG_SRC_SCALE,
  type RigPartName,
  ROTOR_STEMS,
  bodyStemFor,
  faceFor,
  handStemsFor,
  hairStemFor,
  shoeStemFor,
} from "./rigSpec.ts";

/** What the scene asks React to put on screen — lives in sim.ts now (PB-T2);
 *  re-exported so PaintGame's import path stays stable. */
export { type TaskRequest } from "./sim.ts";

/** PK-R6 · C · how many particles the contact burst throws (doc 44 §3.1.1 —
 *  the v0 build's `this.burst?.explode(22, node.x, node.y)`, verbatim). */
export const SPARK_COUNT = 22;

// ── PK-R6 · H1 · THE HERO'S OWN SHADOW (round-1 critique, finding 3) ──────────
/** The ink the cast shadow is tinted with, and how much of it shows. Dark enough
 *  to be a value STEP against the palest wall in the book (p1's key is 88), light
 *  enough that it never reads as a second boy. */
export const HERO_SHADOW_TINT = 0x2a2333;
export const HERO_SHADOW_ALPHA = 0.34;
/** …and where it falls: down and BEHIND, so the light stays where every phase's
 *  wash already puts it (top-left) and the shadow never crosses his own face. */
export const HERO_SHADOW_DX = 3;
export const HERO_SHADOW_DY = 3;

// ── PK-R6 · H1 · CONTACT + FOOTFALL (findings 4 and 6) ───────────────────────
/** A landing throws dust from this fall speed up (px/tick). Below it the boy
 *  stepped down off a kerb and dust would be noise. */
export const LAND_DUST_VY = 3;
/** The run throws a step-puff at each footfall — but only once he is actually
 *  running, so a shuffle along a ledge does not smoke. In subs/tick. */
export const STEP_DUST_VX = 300;

// ── PK-R6 · H2 · THE IMPACT MARK (round-2 finding 1) ─────────────────────────
/** How long the code-drawn landing mark lives, in sim ticks (≈0.3 s at 60). It
 *  outlasts the rig's own absorb so the dust is still settling after the boy has
 *  stood back up — which is the order those two things happen in. */
export const IMPACT_MARK_TICKS = 18;
/** The dust it throws, and the scuff it presses into the boards. */
export const IMPACT_DUST = 0xf6f2e8;
export const IMPACT_SCUFF = 0x2a2418;

// ── PK-R6 · H1 · THE FLOOR'S GRAIN (round-1 critique, finding 1 — critical) ──
// Where the marks go is planned (mass.crustGrain); what colour they are is
// decided here, because it depends on the ROOM. A scuff is the room's own shadow
// and a shine is its own light, so both are taken from the phase's declared key:
// in a bright hall the scuff carries the read and in the night classroom the
// shine does. One pair of numbers, both rooms.
const GRAIN_SCUFF = 0x2a2418;
const GRAIN_SHINE = 0xfff6e2;

// ── PK-R6 · H1 · THE HOSTILE TELL (round-1 critique, finding 3) ──────────────
// „The bee sits against bright window backlight with almost no silhouette
// contrast, and the small grey spool-shaped ground creature has no eyes or
// warning coloring to mark it as a hazard."
//
// Half of that is answered here and half of it is REFUSED, on purpose. The
// silhouette half is a real fairness defect and it is fixed: every hostile now
// carries the same two devices the boss got — a halo that separates it from
// whatever is behind it, and a contact shadow that puts it ON the floor.
//
// The „warning hue (red/orange)" half is not built, and the reason is doc 41 §2:
// OSWIN rained the COLOUR out of the beings he bewitched, and the child gives it
// back by naming them. Painting a hostile warning-orange before that would spend
// the chapter's core mechanic on a legibility problem — and it would tell the
// child the thing is angry when the fiction says it is enchanted. The separation
// is therefore done in VALUE, which is what the pop test in doc 36 §1 asks for
// anyway („≥12 % luminance OR ≥25 % saturation"), and the halo takes its colour
// from the room: ink against a bright wall, chalk against a dark one.
const HOSTILE_HALO_LIGHT = 0xfdf3dc;
const HOSTILE_HALO_DARK = 0x241f2e;
/** Above this phase key the room is bright, so the halo goes dark. */
const HOSTILE_HALO_KEY_SPLIT = 50;
const HOSTILE_HALO_ALPHA = 0.17;
const HOSTILE_HALO_RINGS = 4;
const HOSTILE_HALO_SPREAD = 1.5;
/** How much of the halo breathes (the rest is constant, so a still frame — and
 *  reduced motion — still shows a being with an edge). */
const HOSTILE_HALO_PULSE = 0.22;
const HOSTILE_SHADOW_ALPHA = 0.28;

// ── PK-R6 · H1 · THE PICKUP SHIMMER (round-1 critique, finding 6) ────────────
// „Letters 'S' and 'C' float directly among the gold book-stack platforms in the
// same warm gold tone … their silhouette reads as 'platform' rather than
// 'pickup'." True, and colour cannot fix it — the letters ARE gold and the
// book platforms ARE gold, and both are right. So the difference is made in a
// channel a platform can never use: a soft halo of light around the glyph that
// no piece of furniture in this book carries.
const LETTER_HALO_COLOUR = 0xfff4cf;
const LETTER_HALO_ALPHA = 0.30;
const LETTER_HALO_RINGS = 3;
const LETTER_HALO_R = 8.5;
/** Four sparks turning slowly around it — the „gentle bob + shimmer" of the
 *  critique's own fix direction, and the one thing on screen that ROTATES. */
const LETTER_SPARKS = 4;
// ── PK-R6 · H2 · the letters, embedded rather than pasted on (finding 8) ─────
/** How many grain specks are stamped into each drawn glyph. */
const LETTER_GRAIN_SPECKS = 130;
/** …and the shadow it drops on whatever it is floating over: how far down that
 *  surface may be before the letter is too high to cast anything readable. */
const LETTER_SHADOW_REACH_PX = 26;
const LETTER_SHADOW_TINT = 0x2a2333;

export interface PaintCallbacks {
  onExit: (next: string) => void;
  onLetters: (got: number, total: number) => void;
  onTask: (req: TaskRequest) => void;
  onPowerup: (grants: string) => void;
  onCageFreed: (id: string, skin: string, classmate: string | undefined, freedCount: number) => void;
  onGuardianDown: (id: string, skin: string) => void;
  /** PB-F3 · F2-8: the first cage the fist can open, once per phase. */
  onCageHint: () => void;
  /** PK-R3b · R3-16: a Regel-Seite was found — the shell shows its rule page. */
  onTip: (id: string, topicDe: string, merksatzDe: string) => void;
  /** PK-R3b · R3-16: a Bonus-Buch was found — score only, no card. */
  onBook: (id: string, got: number) => void;
}

export interface PaintSceneCfg {
  level: PaintLevel;
  phaseId: string;
  art: Record<string, string>; // stem → url (only-present)
  pad: Pad; // the SHARED mutable pad (touch/harness write here)
  callbacks: PaintCallbacks;
  reducedMotion: boolean;
  /** Abilities live in React (they persist across phase mounts — the Fibel
   *  grant must survive into p3); the scene reads, never owns. */
  grantedAbilities: () => readonly string[];
  /** Cages already freed in earlier mounts (ids) — they stay burst. */
  freedCageIds: () => readonly string[];
  /** PB-R1 · R3-1: chapter state again — has the fist hint already been taught?
   *  The sim must not freeze the world for a card the shell will not open. */
  cageHintShown?: () => boolean;
  /** PK-R3b · R3-16: Regel-Seiten / Bonus-Bücher already taken this chapter. */
  collectedPickupIds?: () => readonly string[];
  /** PB-F2 jump-feel candidate (dev only; undefined = the shipped model). */
  airModel?: AirModel;
}

// ── R3-12 · THE GUARDIAN'S WRITING SURFACE (doc 41 §4) ───────────────────────
// Each guardian SKIN declares where on its body chalk appears. A skin with no
// entry has no board, and its cards simply open without a writing beat — the
// only-present law again, so a new guardian can never render text into thin air.
//
// PK-R6 · E: the offsets are FRACTIONS of the sprite as drawn, not world px.
// Two things moved under the old pixel numbers. The Tafel was repainted as a
// flying board — the retired easel carried its slate high on legs (63 % of the
// body up), the flying board IS the slate (its centre measures at 47 % of the
// cell height above the feet, and it spans 67–99 % of the cell's width). And
// the rig is now drawn at ONE scale taken from its idle cell, so cell heights
// deliberately differ (the rear-up is 11 % taller) — a fixed px offset would
// slide off the slate exactly when she rears. Fractions track both.
export const GUARDIAN_BOARDS: Record<string, { dyFrac: number; wFrac: number }> = {
  tafel: { dyFrac: -0.47, wFrac: 0.62 },
};
/** How long the guardian spends writing before its card opens (doc 41 §4 asks
 *  for a 30–45 t readability telegraph). */
export const EVIDENCE_BEAT_TICKS = 36;

/** Display heights in world px for the duel's two newly-wired sheets (R3-4). */
/** PK-R6 · C1 · display height per drained-object skin, in world px (TILE=16).
 *  Measured against each Batch-AC sheet's aspect so the six read as one set of
 *  classroom things at one scale rather than six unrelated stickers. */
const DRAINED_H: Record<string, number> = {
  obj_desk: 28, // 368×353 — the biggest thing in the room
  obj_schoolbag: 26, // 378×341
  obj_book: 24, // 268×358
  obj_sharpener: 22, // 254×353
  obj_pencil: 30, // 69×393 — tall and thin; height is what makes it legible
  obj_gluestick: 28, // 124×396
};

const CHALK_DISPLAY_H = 9;
const HAND_DISPLAY_H = 18;
const HAND_OFFSET_X = 15;
const HAND_OFFSET_Y = 30;
/** PK-R6 · E: a lying shard is smaller than the stick it came off. */
const SHARD_DISPLAY_H = 6;

// ── PK-R6 · E · THE GOLDEN TRAIL, IN CODE (doc 44 B14 · the art review's
// ruling) ────────────────────────────────────────────────────────────────────
// The painted flight cells carry trail wisps baked into the pixels. They are
// pretty, but they cannot be the motion read: they are fixed to the cell, so
// they point wherever the painter pointed them rather than wherever she is
// actually going, and (measured on the shipped sheet) their tips still carry
// chroma-key pink. So the trail that has to be RIGHT is drawn here, from the
// sim's own positions.
//
// Deterministic by construction: every point is a position the sim produced on
// a numbered tick, and the only wobble is a hash of that tick — no `Math.random`
// anywhere, so a replayed tape draws the same trail it drew when it recorded.
/** How many ticks apart the trail samples her. */
const TRAIL_SAMPLE_TICKS = 3;
/** How many samples the tail holds — 14 × 3 t ≈ 0.7 s of path behind her. */
const TRAIL_POINTS = 14;
/** Chalk-gold, the colour of her own wisps. */
const TRAIL_COLOUR = 0xf2c85b;
/** How far above her feet the tail streams from (she is ~52 px tall). */
const TRAIL_ANCHOR_Y = 26;
/** The states that leave a trail: the ones where she is actually flying. A
 *  telegraph holds station and a dip is a deliberate descent — a tail on either
 *  would say „still moving" while the picture says „about to throw". */
const TRAIL_STATES: ReadonlySet<string> = new Set(["fly", "throw"]);
/** PK-R6 · H1: the states in which she is genuinely in the air, and may
 *  therefore be tilted by her own flight (finding 2). `dip` is a deliberate
 *  controlled descent to the child and `sink`/`sad`/`consoled` are the landing —
 *  a board tipped while it settles reads as a board falling over. */
const AIRBORNE_STATES: ReadonlySet<string> = new Set(["fly", "throw", "telegraph"]);

// ── PK-R6 · H1 · THE BOSS SEPARATION HALO (round-1 critique, finding 3) ──────
// „The dark wood frame and green board sit at almost the same value as the
// bookshelf directly behind them" — true, and worse than the critique knew: on
// the p4 stage her flight path crosses the wall's own painted green chalkboard,
// so for part of every pass a green board flies in front of a green board.
//
// The fix has to be code, not paint: the arena art is shared with the rest of
// the phase and darkening the shelf behind her would darken it everywhere. So
// she carries her own separation — a soft warm halo laid BEHIND her silhouette,
// bright enough to lift her off a dark shelf at a squint and far too diffuse to
// read as a light source. She is the only lit thing in the room, which is also
// what the fiction says she is.
/** The halo's colour — the stage's own candle-warm cream, not a new hue. */
const BOSS_HALO_COLOUR = 0xffe9b8;
/** How opaque the innermost ring is, and how many rings fade outward. Kept low:
 *  the halo must be felt as separation, never seen as a glow. */
const BOSS_HALO_ALPHA = 0.15;
const BOSS_HALO_RINGS = 5;
/** How far past her own half-width the outermost ring reaches. */
const BOSS_HALO_SPREAD = 1.55;

// ── PK-R6 · H1 · THE WINDUP CHARGE (round-1 critique, finding 6) ─────────────
// The painted flight cells carry a pink swoosh baked into the pixels — every
// cell, including the windup — so the sheet itself cannot tell „about to move"
// from „about to attack". The code half of that distinction is drawn here: a
// charge that gathers at the chalk hand through the tell and is gone the instant
// the chalk leaves. It is the only thing on screen that grows, so the growth IS
// the message.
// AMBER, not cream. The first build drew it in the same pale chalk-cream as the
// wisps and it was invisible in every captured frame — because the thing it
// gathers around is her painted MITT, which is pale cream itself. A tell drawn
// in the colour of the thing it sits on is not a tell.
const CHARGE_COLOUR = 0xffb02e;
/** The hot core inside it, and the ring that closes as the tell runs out. */
const CHARGE_CORE = 0xfff0b0;
const CHARGE_MAX_R = 9;

// ── PK-R6 · H1 · THE CHALK YOU CAN SEE (round-1 critique, finding 5) ─────────
// „The chalk projectile is a small cream fleck that nearly vanishes against both
// the dark bookshelf (mid-air) and the patterned floor (landed)." That is a
// FAIRNESS defect, not a polish one: the whole boss contract is a telegraph the
// child can read followed by a threat the child can dodge, and a threat nobody
// can see is an unfair hit behind a perfectly fair tell.
//
// The stick itself stays the painted stick (doc 44 asks for „colored chalk" and
// the six sheets deliver it). What is added is everything a 9-px prop needs to
// survive a busy background: its own colour thrown as a glow, a comet of the
// same colour behind it so a still frame shows where it came from, and a burst
// where it lands. The lying shard keeps a slow pulse — it is a hazard, and a
// hazard the child has stopped seeing is a hazard that bites for free.
/** The six painted sticks, as light. Keyed by `ProjectileState.colour` — the
 *  name the sim already carries — so the glow can never be a different colour
 *  from the stick it belongs to. */
const CHALK_LIGHT: Record<string, number> = {
  white: 0xfff8e6, red: 0xff8a7a, blue: 0x8fc4ff, green: 0x9be6a0, yellow: 0xffe27a, orange: 0xffb066,
};
/** The fallback for a guardian whose chapter ships no coloured set. Warm cream
 *  reads against the dark shelf; plain white did not. */
const CHALK_LIGHT_FALLBACK = 0xfff1cf;
/** How big the glow is around a flying stick, and how strong at its core. */
const CHALK_GLOW_R = 7.5;
const CHALK_GLOW_ALPHA = 0.5;
/** How many samples the chalk's comet holds, and how far apart in ticks. Short:
 *  the arc is 44 ticks long, and a tail that outlives the flight is litter. */
const CHALK_TAIL_POINTS = 6;
/** How dark a contour is drawn around the glow so it also reads on a PALE
 *  floor — a bright halo alone disappears into the honey-wood book tiles. */
const CHALK_RIM = 0x3a2a12;

// ── PK-R6 · H1 · THE GIFT ON THE BOARD (round-1 critique, finding 1 — critical)
// ─────────────────────────────────────────────────────────────────────────────
// The console beat SAYS „Jetzt steht dein Wort da — und die Tafel blüht
// sonnengelb auf", and the frames after it showed a plain green board with an
// angry face and nothing written on it. The chapter's whole payoff existed only
// as a sentence in a card. doc 44 §4 ch01 C4 asks for the opposite: „the class
// writes the first lesson back on her" — so the word the CHILD typed is now
// chalked onto her slate and stays there, and her slate warms to sunflower.
//
// It is deliberately NOT the evidence writer. Evidence is her lie, wiped the
// moment its card is answered (`clearEvidence`); this is the child's gift, and
// the one thing it must never do is wipe.
/** How long the gift takes to appear, stroke by stroke, in render ticks — a
 *  beat longer than the evidence beat (36 t): this is the sentence the chapter
 *  has been building to, so it is written slower than her scribbles. */
const GIFT_WRITE_TICKS = 54;
/** How long the sunflower bloom takes to come up under it, in render ticks.
 *  Trails the writing on purpose — the word lands first, the board answers it. */
const GIFT_BLOOM_TICKS = 96;
/** Sunflower, and the chalk it is written in. The bloom tints her whole body
 *  (a board that blooms is not a board with a yellow rectangle on it) and the
 *  halo behind her carries the same hue outward. */
const GIFT_BLOOM_TINT = 0xffd54a;
const GIFT_HALO_COLOUR = 0xffcf5c;
/** How strongly the bloom tint lands at full flower. Under 1 the sprite keeps
 *  its own painted material and is LIT by the gold rather than repainted in it. */
const GIFT_TINT_MIX = 0.72;
/** How bright the ADD-blended gold copy of her own cell goes at full flower.
 *  MEASURED in the running game: a tint alone could not do this job at all —
 *  Phaser's tint MULTIPLIES, so gold over her green slate can only ever darken
 *  toward olive, and the first build of this beat left „blüht sonnengelb auf"
 *  describing a board that was still plain green. Light has to be ADDED. */
const GIFT_ADD_ALPHA = 0.5;
/** How far BELOW the board's own centre the child's word is written, as a
 *  fraction of her drawn height. Her face is painted across the middle of the
 *  slate; the first build put the word straight through her eyes and it read as
 *  a collision rather than as writing. The lower slate is empty, and a word
 *  written under a face reads as a word written FOR it. */
const GIFT_DY_FRAC = 0.1;
// PK-R6 · H1 · the MAGNET's pull streak (round-1 critique, finding 5): the same
// device, aimed at the collectible instead of at the boss, and short — a letter
// crosses the field in a handful of ticks, so a long tail would still be drawn
// after it had been swallowed.
/** How many wisps the pull tail is drawn from, and how far it reaches back. */
const PULL_TRAIL_POINTS = 7;
const PULL_TAIL_PX = 16;
/** The letters' own warm gold and their amber contour (letters.ts LETTER_STYLE),
 *  as numbers — the streak is made of the collectible, not of a new colour. */
const PULL_COLOUR = 0xf7c93f;
const PULL_EDGE = 0xa2560f;
/** Deterministic ±1.5 px shimmer keyed on the sample's OWN tick (not its index
 *  in the buffer, which shifts every sample and would make the whole tail
 *  crawl). Knuth's multiplicative hash — the same trick the legacy build uses
 *  for its seeded picks, minus the RNG. */
const trailWobble = (tick: number): number => ((Math.imul(tick, 2654435761) >>> 28) - 7.5) * 0.2;

/** Blend two packed 0xRRGGBB colours, channel by channel. `k` = 0 keeps `a`,
 *  1 keeps `b`. Used for tints that must LIGHT a painted sprite rather than
 *  replace it — a flat `setTint(gold)` throws the painting away. */
export const mixRGB = (a: number, b: number, k: number): number => {
  const t = Math.max(0, Math.min(1, k));
  const ch = (shift: number): number =>
    Math.round(((a >> shift) & 0xff) * (1 - t) + ((b >> shift) & 0xff) * t) & 0xff;
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
};

/** R3-15 · the colour OSWIN's rain leaves behind: warm paper-grey, so a drained
 *  being still belongs to the painted book rather than turning to concrete. */
const COLOUR_DRAINED = 0x9a958c;
/** PK-R6 · H1 · the warm light the returning colour rides in on (finding 8).
 *  Amber rather than white: the book's own light is the classroom's afternoon
 *  sun, and a white flash would read as a camera rather than as a spell lifting. */
const COLOUR_RETURNING = 0xffd98f;
/** PK-R6 · H1 · the two materials every painted surface the SCENE draws is made
 *  of — the same cream and the same brown ink the overlay's parchment uses, so a
 *  bubble the world speaks and a card the book opens are one book. */
const PARCHMENT = 0xf7edd5;
const INK_LINE = 0x8a6a38;

/** The book's display face as Phaser needs it: a family NAME, not a CSS variable.
 *  next/font mints the real family at build time and publishes it through
 *  »--font-fredoka« (apps/web/app/layout.tsx · globals.css, doc 42 §5 · B19), so
 *  it is read off the document rather than guessed — and „--font-display" is not
 *  the one to read, because its value is a var() chain a canvas cannot resolve.
 *  Falls back to the same stack the CSS declares, which is also what any
 *  document-less environment (a test, a node harness) gets. */
const DISPLAY_FALLBACK = "Fredoka, system-ui, sans-serif";
const displayFace = (): string => {
  if (typeof document === "undefined") return DISPLAY_FALLBACK;
  const v = getComputedStyle(document.documentElement).getPropertyValue("--font-fredoka").trim();
  return v.length > 0 ? `${v}, ${DISPLAY_FALLBACK}` : DISPLAY_FALLBACK;
};

const EARTH = 0xa8794f;
const EARTH_DARK = 0x8a6140;
const ICE = 0xd7e9f2;
const INK = 0x243048;
const GRASS = 0x59a83c;

export class PaintScene extends Phaser.Scene {
  private cfg: PaintSceneCfg;
  /** PB-T2: ALL gameplay lives in the headless sim — the scene draws and
   *  routes events. The proof-tape replayer runs the same Sim in CI, so the
   *  scene may never grow gameplay logic of its own again. */
  private sim: Sim;

  // sim views (render + legacy call sites read through these)
  private get phase(): PhaseSpec { return this.sim.phase; }
  private get grid(): readonly string[] { return this.sim.grid; }
  private get worldWpx(): number { return this.sim.worldWpx; }
  private get worldHpx(): number { return this.sim.worldHpx; }
  private get player(): PlayerState { return this.sim.player; }
  private get fist(): FistState | null { return this.sim.fist; }
  private get world(): EntityWorld { return this.sim.world; }
  private get overlayOpen(): boolean { return this.sim.overlayOpen; }
  private get guardianDefeated(): boolean { return this.sim.guardianDefeated; }
  private get bonusLeftTicks(): number { return this.sim.bonusLeftTicks; }
  private get tickCount(): number { return this.sim.tickCount; }
  private get lettersGot(): number { return this.sim.lettersGot; }
  private get lettersTotal(): number { return this.sim.lettersTotal; }
  private get camX(): number { return this.sim.camX; }
  private get camY(): number { return this.sim.camY; }

  private entityImgs = new Map<string, Phaser.GameObjects.Image>();
  /** R3-15: the grey wash laid OVER a being OSWIN drained (doc 41 §2). One per
   *  redeemable creature, built beside its sprite and driven by washAlphaFor. */
  private washImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PK-R6 · H1 · a hostile's own cast shadow — its cell, inked, one step behind
   *  the light (finding 3). Mirrored every frame in renderEntities. */
  private hostileShadeImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PK-R6 · H1: the warm light the returning colour arrives on (anim.floodBloomFor,
   *  round-1 critique finding 8). Same sheet, same place, added rather than
   *  laid over — so the being brightens in its own shape instead of gaining a
   *  rectangle of glow. */
  private bloomImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PK-R6 · H1: which beings have already had their freeing celebrated, so the
   *  flourish fires ONCE per redeem rather than every frame of the flood. */
  private cheered = new Set<string>();
  private projG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · E: the code-drawn golden tail behind the flying guardian. */
  private trailG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H1: the separation halo that lifts her off the bookshelf (finding
   *  3). BEHIND her — a halo drawn in front is a veil over the thing it reveals. */
  private bossGlowG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H1: the charge that gathers at her chalk hand through the windup
   *  (finding 6). IN FRONT of her body and behind the hand itself — measured in
   *  the running game: drawn on the halo's canvas (6.8) her own board covered it
   *  completely, so the one tell that was supposed to distinguish „about to
   *  attack" from „about to move" was invisible in every frame. */
  private chargeG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H1: chalk dust under the written strokes (finding 9). Its own
   *  canvas at 7.9 — under the text (8), over her body (7), so the powder sits
   *  ON the slate rather than in front of the glyphs it fell off. */
  private dustG!: Phaser.GameObjects.Graphics;
  private trail: Array<{ x: number; y: number; t: number }> = [];
  private trailAt = -1;
  /** PK-R6 · C1: the ↑ cue over the being a press would engage. */
  private engageCueG!: Phaser.GameObjects.Graphics;
  /** R3-4: pooled chalk sprites (one per live projectile, reused per frame). */
  private projImgs: Phaser.GameObjects.Image[] = [];
  /** PK-R6 · H1: which shards have already thrown their landing burst, so the
   *  break fires ONCE per piece instead of on every frame it lies there
   *  (round-1 critique, finding 5 — „the landed chalk shard has no impact burst
   *  at all"). Ids are the sim's own projectile ids. */
  private burstShards = new Set<number>();
  /** R3-4: the guardian's throwing hand, shown only during its windup. */
  private handImg!: Phaser.GameObjects.Image;
  /** R3-12: chalk on the guardian's own board — the card's evidence. */
  private evidenceText: Phaser.GameObjects.Text | null = null;
  private evidenceOwner: string | null = null;
  private evidenceFull = "";
  private evidenceTick = 0;
  /** PK-R6 · H1: the child's word, chalked onto her slate for good (finding 1).
   *  Separate from the evidence in every way that matters — its own text object,
   *  its own clock, and no path that clears it. */
  private giftText: Phaser.GameObjects.Text | null = null;
  private giftOwner: string | null = null;
  private giftWord = "";
  private giftTick = 0;
  /** The warm light the bloom throws behind her — the same additive trick the
   *  colour flood uses (bloomImgs), aimed at the guardian's own silhouette. */
  private giftHaloG!: Phaser.GameObjects.Graphics;
  /** The ADD-blended gold copy of the blooming guardian's own cell, one per
   *  guardian, built on first bloom (see `giftGlow`). */
  private giftGlowImgs = new Map<string, Phaser.GameObjects.Image>();
  private acc = 0;
  /** R3-8: which being the book is leaning in on, and how far in (0…1). The
   *  lean runs on WALL-CLOCK ms, not sim ticks, because the sim is deliberately
   *  frozen for the whole time the card is up. */
  private focusId: string | null = null;
  private focusAt: { x: number; y: number } | null = null;
  private focusT = 0;
  private frameMs = 0;

  private parts = new Map<RigPartName, Phaser.GameObjects.Image>();
  private rigRoot!: Phaser.GameObjects.Container;
  /** PK-R6 · H1 · the hero's own cast shadow — the same parts again, inked and
   *  offset, drawn UNDER him (see buildRig). */
  private shadowParts = new Map<RigPartName, Phaser.GameObjects.Image>();
  private rigShadow!: Phaser.GameObjects.Container;
  /** PK-R6 · H1 · the contact ellipse + the magnet's pull streaks. */
  private groundG!: Phaser.GameObjects.Graphics;
  private pullG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H1 · the air: motes drift and the vignette follows the camera, so
   *  those two redraw; the haze, the beams and the floor's grain are placed once. */
  private moteG!: Phaser.GameObjects.Graphics;
  private vignetteG!: Phaser.GameObjects.Graphics;
  /** the hostile separation halos + their contact shadows (finding 3) */
  private hostileG!: Phaser.GameObjects.Graphics;
  /** the shimmer that says „pickup, not platform" (finding 6) */
  private letterFxG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H1 · the walk-cycle phase at the previous tick, so a footfall is
   *  detected as a CROSSING rather than tested for equality (which a variable
   *  tick budget would skip straight past). */
  private lastStridePhase = 0;
  /** PK-R6 · H2 · HOW HARD THE LAST LANDING WAS, 0…1 (round-2 finding 1). The
   *  fall speed the floor took, remembered for as long as the impact mark is
   *  drawn — the sim keeps `landedAgo` but not the speed that produced it, and
   *  a mark that cannot tell a hop from a drop is a decal, not an impact. */
  private landHardness = 0;
  private fistImg!: Phaser.GameObjects.Image;
  private ropeG!: Phaser.GameObjects.Graphics;
  private letterImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PB-F3: checkpoint art by column, so the ACTIVE one can light up. */
  private checkpointImgs = new Map<string, Phaser.GameObjects.Image>();
  private ringImgs: Array<{ img: Phaser.GameObjects.Image; baseY: number }> = [];
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  /** PB-C1: this phase's art direction, or null ⇒ the pre-C1 render path. */
  private comp: CompositionSpec | null;

  constructor(cfg: PaintSceneCfg) {
    super({ key: "paint" });
    this.cfg = cfg;
    this.comp = compositionFor(cfg.level.chapter, cfg.phaseId);
    this.sim = new Sim({
      level: cfg.level,
      phaseId: cfg.phaseId,
      grantedAbilities: cfg.grantedAbilities,
      freedCageIds: cfg.freedCageIds,
      cageHintShown: cfg.cageHintShown,
      collectedPickupIds: cfg.collectedPickupIds,
      airModel: cfg.airModel,
    });
  }

  preload(): void {
    for (const [stem, url] of Object.entries(this.cfg.art)) {
      if (!this.textures.exists(`pb-${stem}`)) this.load.image(`pb-${stem}`, url);
    }
  }

  create(): void {
    this.buildFallbackTextures();
    this.buildBackdrop();
    this.buildAir();
    this.buildTerrain();
    this.buildProps();
    this.buildRig();
    this.fistImg = this.add.image(0, 0, this.tex("hand_fist")).setScale(RIG_SRC_SCALE).setDepth(11).setVisible(false);
    this.ropeG = this.add.graphics().setDepth(9);

    // player/world/letters/bonus clock all spawned by the Sim in the constructor
    this.buildEntityImgs();
    this.projG = this.add.graphics().setDepth(8);
    // behind her (entities sit at 7) — a tail drawn in front reads as confetti
    this.trailG = this.add.graphics().setDepth(6.9);
    // PK-R6 · C1: the ↑ cue rides ABOVE the beings it points at (depth 7) and
    // below the hero (11), so it never hides the thing it is advertising.
    this.engageCueG = this.add.graphics().setDepth(9.5);
    // R3-4: the guardian's throwing hand — built once, shown only on the windup
    this.handImg = this.add.image(0, 0, "fb-ent-generic").setDepth(9).setOrigin(0.5, 0.5).setVisible(false);
    // PK-R6 · H1: the boss's separation halo and the gift's bloom share one
    // canvas BEHIND her (entities sit at 7, her trail at 6.9) — a glow drawn in
    // front of a boss is a veil over the thing it was meant to reveal.
    this.bossGlowG = this.add.graphics().setDepth(6.8);
    this.giftHaloG = this.add.graphics().setDepth(6.85);
    this.dustG = this.add.graphics().setDepth(7.9);
    // PK-R6 · H1 · the two halves of the air that cannot be placed once: motes
    // move, and the vignette is drawn in the camera's own rect every frame.
    this.moteG = this.add.graphics().setDepth(AIR_DEPTH.mote);
    this.vignetteG = this.add.graphics().setDepth(AIR_DEPTH.vignette);
    // behind every being (7) and behind the boss's own halo (6.8), so a hostile
    // in front of the guardian never draws its edge over her
    this.hostileG = this.add.graphics().setDepth(6.6);
    // under the letters (4) — a shimmer drawn OVER a glyph is a smudge on it
    this.letterFxG = this.add.graphics().setDepth(3.9);
    // the charge sits over her body (7) and under the throwing hand (9)
    this.chargeG = this.add.graphics().setDepth(8.6);

    const kb = this.input.keyboard;
    this.keys = kb
      ? (kb.addKeys("LEFT,RIGHT,UP,DOWN,A,D,W,S,SPACE,X,J") as Record<string, Phaser.Input.Keyboard.Key>)
      : {};

    this.cameras.main.setZoom(RENDER_SCALE);
    this.cameras.main.centerOn(fromSubs(this.player.x), fromSubs(this.player.y) - LOGICAL_H / 4);
    this.scale.refresh(); // the P-48 lesson: assert geometry at scene entry
  }

  /** The harness + HUD read through this (never Phaser internals). */
  getState(): {
    x: number; y: number; vx: number; vy: number; pose: string; grounded: boolean;
    onSlide: boolean;
    phase: string; letters: number; hovering: boolean; overlay: boolean;
    /** R3-16/M-B: what the Bilanz reads from — found, not held (see Sim). */
    lettersCollected: number; tips: number; books: number;
    knots: number; guardianDown: boolean; bonusLeft: number;
    camX: number;
    entities: Array<{ id: string; role: string; skin: string; state: string; redeemed: boolean; x: number; y: number }>;
    projectiles: Array<{ kind: string; x: number; y: number; deflected: boolean }>;
  } | null {
    if (!this.player) return null; // boot-safe: the HUD poll may fire pre-create
    return {
      x: fromSubs(this.player.x),
      y: fromSubs(this.player.y),
      vx: this.player.vx,
      vy: this.player.vy,
      pose: this.player.pose,
      grounded: this.player.grounded,
      onSlide: this.player.onSlide, // D1 spike visibility
      phase: this.cfg.phaseId,
      letters: this.lettersGot,
      lettersCollected: this.sim.lettersCollected,
      tips: this.sim.tipsGot,
      books: this.sim.booksGot,
      hovering: this.player.hovering,
      overlay: this.overlayOpen,
      knots: this.world?.guardianKnots ?? -1,
      guardianDown: this.guardianDefeated,
      bonusLeft: this.bonusLeftTicks,
      camX: fromSubs(this.camX),
      entities: (this.world?.entities ?? []).map((e) => ({ id: e.id, role: e.role, skin: e.skin, state: e.state, redeemed: e.redeemed, x: fromSubs(e.x), y: fromSubs(e.y) })),
      projectiles: (this.world?.projectiles ?? []).map((p) => ({ kind: p.kind, x: fromSubs(p.x), y: fromSubs(p.y), deflected: p.deflected })),
    };
  }

  warp(c: number, r: number): void {
    this.sim.warp(c, r);
  }

  /** Where a being sits across the view, 0 (left edge) … 1 (right edge), or
   *  null if it is not in this phase. PB-F1/F2-20: the task card docks to the
   *  OPPOSITE side, so a card that says „schau sie an" never covers her. */
  screenFracOf(id: string): number | null {
    const e = this.world?.entities.find((x) => x.id === id);
    if (!e) return null;
    return (fromSubs(e.x) - fromSubs(this.camX)) / LOGICAL_W;
  }

  update(_time: number, delta: number): void {
    this.frameMs = Math.min(delta, 100);
    this.acc += Math.min(delta, 100);
    let ticks = 0;
    while (this.acc >= TICK_MS && ticks < MAX_TICKS_PER_FRAME) {
      this.acc -= TICK_MS;
      ticks++;
      // PK-R6 · H1: the fall speed the tick is ABOUT to cancel — after the step
      // a landed player reads vy 0, so „how hard did that land" only exists here
      const fallVy = this.player.grounded ? 0 : fromSubs(this.player.vy);
      this.handleSimEvents(this.sim.step(this.readPad()));
      this.footwork(fallVy);
    }
    this.render();
  }

  /** Route the sim's events to Phaser/React — the only gameplay-adjacent
   *  code the scene keeps, and it must stay a dumb switch. */
  private handleSimEvents(evs: SimEvent[]): void {
    const cb = this.cfg.callbacks;
    for (const ev of evs) {
      switch (ev.type) {
        case "toast": this.toast(ev.msg); break;
        case "task": cb.onTask(ev.req); break;
        case "powerup": cb.onPowerup(ev.grants); break;
        case "cageFreed": cb.onCageFreed(ev.id, ev.skin, ev.classmate, ev.count); break;
        case "guardianDown": cb.onGuardianDown(ev.id, ev.skin); break;
        case "cageHint": cb.onCageHint(); break;
        case "letters": cb.onLetters(ev.got, ev.total); break;
        case "letterTaken": {
          const img = this.letterImgs.get(`${ev.c},${ev.r}`);
          // R3-16 · the collect beat (doc 42 §4, numbers verbatim): a burst of
          // chalk dust, then the letter rises away and fades — the letter has
          // gone INTO the tally rather than merely vanished.
          if (img) this.collectBurst(img);
          this.letterImgs.delete(`${ev.c},${ev.r}`);
          break;
        }
        case "tip": cb.onTip(ev.id, ev.topicDe, ev.merksatzDe); break;
        case "book": cb.onBook(ev.id, ev.got); break;
        case "puff": this.puff(fromSubs(ev.x), fromSubs(ev.y), ev.kind); break;
        case "exit": cb.onExit(ev.to); break;
        default: break;
      }
    }
  }

  // ── the React contract: the overlay resolves tasks through these ──────────

  setOverlay(open: boolean): void {
    this.sim.setOverlay(open);
  }

  /** PK-R6 · H1 · the restore-hold (doc 44 §3.1.7): the child stays frozen, the
   *  beings they just freed keep living, so the change is watched happening
   *  rather than found already finished. */
  setHold(open: boolean): void {
    this.sim.setHold(open);
  }

  /** Called by React when the task for `ctx` is SOLVED. */
  resolveTask(ctx: TaskRequest["ctx"]): void {
    this.handleSimEvents(this.sim.solveTask(ctx));
  }

  /** Called by React when a task card is DISMISSED („Später") — the anti-
   *  softlock exit: no redeem, no reward, the world just resumes. */
  dismissTask(ctx: TaskRequest["ctx"]): void {
    this.sim.dismissTask(ctx);
  }

  spendLetters(n: number): boolean {
    const ok = this.sim.spendLetters(n);
    if (ok) this.cfg.callbacks.onLetters(this.sim.lettersGot, this.sim.lettersTotal);
    return ok;
  }

  bonusState(): { leftTicks: number; got: number; total: number } {
    return { leftTicks: this.sim.bonusLeftTicks, got: this.sim.lettersGot, total: this.sim.lettersTotal };
  }

  private readPad(): Pad {
    const k = this.keys;
    const down = (n: string): boolean => k[n]?.isDown === true;
    const t = this.cfg.pad; // touch/harness writes
    return {
      left: t.left || down("LEFT") || down("A"),
      right: t.right || down("RIGHT") || down("D"),
      up: t.up || down("UP") || down("W"),
      down: t.down || down("DOWN") || down("S"),
      jump: t.jump || down("SPACE"), // W0-F1: jump is its OWN button — UP/W never jump
      punch: t.punch || down("X") || down("J"),
    };
  }

  private buildEntityImgs(): void {
    for (const e of this.world.entities) {
      // PK-R6 · H1: a being that is ALREADY free when this phase builds was
      // freed in an earlier visit (freedCageIds carries that across mounts), so
      // it has had its celebration. Seeding the set here is what keeps walking
      // back into p1 from throwing confetti at work the child finished ten
      // minutes ago — the flourish marks a CHANGE, and nothing changed.
      if (e.redeemed) this.cheered.add(e.id);
      const img = this.add.image(fromSubs(e.x), fromSubs(e.y), this.entTex(e.skin, "a")).setDepth(7).setOrigin(0.5, 1);
      img.setVisible(!e.hidden);
      this.entityImgs.set(e.id, img);
      // PK-R6 · H1 (round-1 critique, finding 3): a hostile casts its own shadow,
      // exactly like the hero — the same sheet, inked, offset down-and-right
      // because every phase's wash puts the light top-left. This is the „dark
      // rim … to separate it from the window glare" the critique asked for, and
      // it works for a flying moth as well as for a walking eraser, which a
      // shadow drawn on the FLOOR could not (there is no floor under a moth).
      if (JOY_ROLES.has(e.role)) {
        const shade = this.add.image(fromSubs(e.x), fromSubs(e.y), img.texture.key).setDepth(6.95).setOrigin(0.5, 1);
        shade.setTint(HERO_SHADOW_TINT);
        shade.setVisible(!e.hidden);
        this.hostileShadeImgs.set(e.id, shade);
      }
      // R3-15 · the grey wash sits a hair in front of its being, wearing the
      // SAME texture every frame — so it drains whatever cell the being is
      // showing, including cells and skins that do not exist yet.
      if (WASHED_ROLES.has(e.role)) {
        const greyKey = this.greyTexOf(img.texture.key);
        const wash = this.add.image(fromSubs(e.x), fromSubs(e.y), greyKey).setDepth(7.01).setOrigin(0.5, 1);
        // PK-R6 · H1: only a copy the canvas could NOT grey still wears the old
        // multiply — see greyTexOf. A real grey copy is drawn as it is, because
        // tinting it again would put the being's colours back into the very
        // layer that exists to take them out.
        if (greyKey === img.texture.key) wash.setTint(COLOUR_DRAINED);
        wash.setVisible(!e.hidden);
        this.washImgs.set(e.id, wash);
        // PK-R6 · H1 · and the light the colour arrives on, a hair in front of
        // the wash: same sheet, ADD blend, so it reads as the being lighting up
        // rather than as a lamp switched on beside it.
        const bloom = this.add.image(fromSubs(e.x), fromSubs(e.y), img.texture.key).setDepth(7.02).setOrigin(0.5, 1);
        bloom.setTint(COLOUR_RETURNING);
        bloom.setBlendMode(Phaser.BlendModes.ADD);
        bloom.setVisible(false);
        this.bloomImgs.set(e.id, bloom);
      }
    }
  }

  /**
   * PK-R6 · H1 · THE DRAINED COPY (round-1 critique, findings 1 and 2) — the
   * being's own cell with every pixel replaced by its LUMINANCE and its alpha
   * left alone, cached under `<key>__grey` and built at most once per cell.
   *
   * This is the fix for the pair of critical findings, and they were one defect:
   * the wash overlay was a copy of the coloured sheet with `setTint` on it, and
   * a tint MULTIPLIES — so the „grey" copy kept every hue it existed to remove
   * and only darkened it. Nothing downstream could recover from that: the bag
   * measured 0.371 chroma drained against 0.440 restored (brown either way) and
   * Merle moved 0.252 → 0.259 across half her six-round ceremony.
   *
   * Laid over the original at alpha `a`, a true grey copy composites to
   * `(1-a)·colour + a·luma` — which is exactly what `grayscale(a)` does to the
   * portrait inside the card (CardShell.Portrait). The world and the card are
   * now the same transform rather than two recipes that were meant to match.
   *
   * Returns the ORIGINAL key when a canvas cannot be had (headless, a
   * cross-origin frame, a texture with no source image). That is deliberately
   * behaviour-preserving rather than fail-loud: a chapter must still render, and
   * `washTintFor` below keeps the old darkening as the visible fallback.
   */
  private greyTexOf(key: string): string {
    const greyKey = `${key}__grey`;
    if (this.textures.exists(greyKey)) return greyKey;
    if (!this.textures.exists(key)) return key;
    const src = this.textures.get(key).getSourceImage() as HTMLImageElement | HTMLCanvasElement;
    const w = Math.round(src?.width ?? 0);
    const h = Math.round(src?.height ?? 0);
    if (w <= 0 || h <= 0) return key;
    const tex = this.textures.createCanvas(greyKey, w, h);
    if (!tex) return key; // headless/canvas-less safety, exactly like letterTex
    try {
      const ctx = tex.getContext();
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(src as CanvasImageSource, 0, 0, w, h);
      const img = ctx.getImageData(0, 0, w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = greyLuma(d[i] ?? 0, d[i + 1] ?? 0, d[i + 2] ?? 0);
        d[i] = lum;
        d[i + 1] = lum;
        d[i + 2] = lum;
        // d[i + 3] — the alpha is the being's own silhouette and is never touched
      }
      ctx.putImageData(img, 0, 0);
      tex.refresh();
      return greyKey;
    } catch {
      // a tainted canvas (art served cross-origin) throws on getImageData; drop
      // the half-built texture so a later attempt is not handed an empty one
      this.textures.remove(greyKey);
      return key;
    }
  }

  /** pb-<skin>_<state> → pb-<skin>_a → fb-ent-<skin> (the only-present law). */
  private entTex(skin: string, state: string): string {
    for (const k of [`pb-${skin}_${state}`, `pb-${skin}_a`, `fb-ent-${skin}`]) {
      if (this.textures.exists(k)) return k;
    }
    return "fb-ent-generic";
  }

  /** doc 40 §4 · how many painted idle cells a skin actually owns. Counted from
   *  the loaded textures (the only-present law), memoised per skin, so a sheet
   *  that later gains `_c/_d` enriches the idle with no code change — and one
   *  that never does keeps exactly today's two-cell cadence. */
  private idleFrameCache = new Map<string, number>();
  private idleFramesOf(skin: string): number {
    const hit = this.idleFrameCache.get(skin);
    if (hit !== undefined) return hit;
    let n = 1;
    for (const c of ["b", "c", "d"]) {
      if (!this.textures.exists(`pb-${skin}_${c}`)) break;
      n++;
    }
    const frames = Math.max(n, 1);
    this.idleFrameCache.set(skin, frames);
    return frames;
  }

  /** W4: delegated to the pure hook in anim.ts (unit-tested there). */
  private entStateCell(e: EntPoseInput): string {
    return entPoseCell(e);
  }

  /** PK-R6 · E: the native height of a skin's REFERENCE cell (its idle, `_a`) —
   *  the one scale a whole rig is drawn at, so its painted extremes keep their
   *  relative sizes. Memoised; falls back to the drawn frame when the skin has
   *  no `_a` on disk (the only-present law: a missing reference must never make
   *  a being render at zero). */
  private refFrameCache = new Map<string, number>();
  private refFrameHOf(skin: string): number {
    const hit = this.refFrameCache.get(skin);
    if (hit !== undefined) return hit;
    const key = `pb-${skin}_a`;
    // 0 means „no reference" — the caller then fits this cell on its own, which
    // is exactly today's behaviour for a rig whose idle has not landed yet.
    const h = this.textures.exists(key)
      ? ((this.textures.get(key).getSourceImage() as HTMLImageElement).height || 0)
      : 0;
    this.refFrameCache.set(skin, h);
    return h;
  }

  /** world-space display heights per role — painted cells arrive at 512px native */
  private entTargetH(e: { role: string; skin: string }): number {
    if (e.role === "guardian") return 52;
    if (e.role === "swarm") return 34;
    if (e.role === "crusher") return 30;
    if (e.role === "door.trigger") return e.skin === "klecksdoor" ? 30 : 34;
    if (e.role === "cage") return e.skin === "pencilcase" ? 24 : 22;
    // PK-R6 · C1: a drained object is FURNITURE-SIZED, and the six of them are
    // not one size — a desk the height of a pencil would read as a toy. Heights
    // are per skin, chosen against each sheet's own aspect (the tall-thin
    // stationery gets a few px more so its silhouette still names it at 1×,
    // which is what step 1 of its restore card asks the child to do).
    if (e.role === "drained") return DRAINED_H[e.skin] ?? 26;
    // PK-R6 · D: a classmate is a CHILD — the same height class as the hero,
    // not a creature. Her act cells carry props (a desk under her shoes, a
    // window, books on the floor) inside the same 512 px frame, so they read at
    // the same scale her idle does; the number is her standing height.
    if (e.role === "classmate") return 30;
    if (e.role === "powerup") return 26;
    if (e.role === "tip") return 18; // R3-16: a torn page, smaller than a being
    if (e.role === "book") return 15;
    if (e.role.startsWith("platform")) return 10;
    return 24; // chasers, gunners, flyers, bouncers
  }

  /**
   * PK-R6 · C1 · THE ↑ CUE (doc 44 §4 ch01: „each stands grey in the world with
   * an ↑ cue"). A chalk arrow bobbing over the ONE being a press would reach.
   *
   * It is drawn from `engageTargetId` — the same pure function the sim asks
   * before it opens a card — so the arrow can never point at something a press
   * would miss. That is the letter-magnet rule applied to an affordance: the
   * picture and the mechanic read from one answer.
   */
  private renderEngageCue(): void {
    const id = engageTargetId(this.world, this.player.x, this.player.y);
    const e = id === null ? null : this.world.entities.find((x) => x.id === id);
    this.engageCueG.clear();
    if (!e) return;
    const x = fromSubs(e.x);
    const bob = this.cfg.reducedMotion ? 0 : Math.sin(this.tickCount / 9) * 1.6;
    const y = fromSubs(e.y) - this.entTargetH(e) - 7 + bob;
    // a stubby chalk arrow: shaft + head, in the Tafel's own chalk white with
    // the book's ink contour, so it belongs to this world rather than to a UI
    const g = this.engageCueG;
    g.fillStyle(0xf6f2e8, 0.95);
    g.lineStyle(1, 0x243048, 0.65);
    g.fillTriangle(x, y - 5, x - 4.5, y + 1, x + 4.5, y + 1);
    g.strokeTriangle(x, y - 5, x - 4.5, y + 1, x + 4.5, y + 1);
    g.fillRect(x - 1.6, y + 1, 3.2, 4);
    g.strokeRect(x - 1.6, y + 1, 3.2, 4);
  }

  private renderEntities(): void {
    for (const e of this.world.entities) {
      const img = this.entityImgs.get(e.id);
      if (!img) continue;
      // R3-16: a taken Regel-Seite / Bonus-Buch is GONE — it went into the tally
      img.setVisible(!e.hidden && !(PICKUP_ROLES.has(e.role) && e.redeemed));
      img.setPosition(fromSubs(e.x), fromSubs(e.y));
      const cell = this.entStateCell({ ...e, idleFrames: this.idleFramesOf(e.skin) });
      img.setTexture(this.entTex(e.skin, cell));
      const targetH = this.entTargetH(e);
      const frameH = img.frame.height || 1;
      if (e.role.startsWith("platform")) img.setDisplaySize(40, targetH);
      // PK-R6 · E · ONE SCALE FOR THE WHOLE FLIGHT SHEET. Fitting every cell to
      // the same display height is right for a walker (whose cells are all the
      // same creature standing up) and wrong for a rig that PAINTS its extremes:
      // measured on the shipped sheet, the rear-up (`_windup`, 440 px native) is
      // 11 % taller than the hover (397 px) and the edge-on spiral (328 px) is
      // 17 % shorter — exactly the sizes the painter chose. Per-cell fitting
      // scales all three back to identical heights and throws that away: the
      // rear stops rearing. So a guardian is scaled by ONE factor taken from her
      // idle cell, and the sheet's own proportions survive to the screen.
      else if (e.role === "guardian") {
        img.setScale(targetH / (this.refFrameHOf(e.skin) || frameH));
        // PK-R6 · H1 (round-1 critique, finding 2): …and she FLIES it. The sheet
        // paints banks and rolls but has no cell for a dive, and her vertical
        // amplitude (26 px) is a third of her horizontal one — so the half of
        // the path that reads worst is drawn here, as body attitude taken from
        // her own velocity. Only while she is actually airborne: a sinking or
        // resting board that tilted would read as broken furniture.
        img.setRotation(
          AIRBORNE_STATES.has(e.state)
            ? guardianPitchRad(e.vx, e.vy, e.dir, this.cfg.reducedMotion)
            : 0,
        );
      }
      else {
        // PK-R6 · H1 · THE OPENING POP (round-1 critique, finding 4): a cage that
        // has just burst throws itself wide and settles, so the one shape the
        // chapter teaches is a thing that HAPPENS rather than a texture that was
        // swapped between two frames. Folded into the scale the renderer sets
        // anyway — see cagePopT for why a tween cannot live here.
        const pop = this.cagePopT(e);
        const k = targetH / frameH;
        img.setScale(k * (1 + 0.18 * pop), k * (1 - 0.16 * pop));
        if (pop > 0) img.setRotation(0.13 * pop);
        else if (e.role === "cage" && e.redeemed) img.setRotation(0);
      }
      // …and a cell that already faces a direction is never mirrored: flipping a
      // right-bank cell would draw a LEFT bank while she flies right (the facing
      // law, R3-4, applied to art that carries its own facing).
      img.setFlipX(CELL_IS_DIRECTIONAL(cell) ? false : e.dir > 0);
      // THE TRANSPARENCY GRAMMAR (PB-F2, Fable's PK-F1 review ruling 3):
      // SOLID = you can act on this now · TRANSPARENT = not yet.
      // AMENDED (PK-R6 · C2). The rule said SOLID =
      // actionable now · TRANSPARENT = not yet, and the only "not yet" the
      // chapter had was a cage before the fist. ↑ now opens a cage
      // (entities.ENGAGEABLE_ROLES) in every chapter, with no grant to wait
      // for, so there is no longer a state in which a cage is visible and
      // unactionable — the ghosting is retired rather than left as a condition
      // that can no longer be true. The grammar itself is untouched and still
      // available the moment a chapter reintroduces a gated verb.
      // PK-R6 · D: …with the CLASSMATE exempt. Measured in the running game: a
      // freed Merle rendered at 0.85 after the colour had finished flooding
      // back, so the payoff of six rounds was a girl you could still see
      // through. The 0.85 is a leftover of the „not yet" half of the grammar
      // above and stays for the beings it was written for; a person the child
      // just spent a whole ceremony bringing back is the one being that has to
      // read as completely there (doc 44 §1).
      if (e.redeemed && !e.role.startsWith("platform") && e.role !== "classmate") img.setAlpha(0.85);
      else img.setAlpha(1);
      // PK-R6 · H1 (round-1 critique, finding 1): the bloom outranks the windup
      // tint, because by the time it runs she is not winding up any more — and
      // it is a MIX toward sunflower rather than a flat repaint, so the painted
      // wood and slate are still there underneath, lit.
      const giftT = e.role === "guardian" ? this.giftBloomT(e.id) : 0;
      if (giftT > 0) img.setTint(mixRGB(0xffffff, GIFT_BLOOM_TINT, GIFT_TINT_MIX * giftT));
      else if (e.state === "telegraph") img.setTint(0xfff2b0);
      else img.clearTint();
      // …and the light the bloom ADDS. The tint above can only ever multiply,
      // which on a green slate walks toward olive and never toward sunflower —
      // so the gold is a second, ADD-blended copy of her own cell, mirroring it
      // exactly (the same trick the colour flood uses, aimed at the payoff).
      if (e.role === "guardian") this.giftGlow(e.id, img, giftT);
      // PK-R6 · H1 · the hostile's cast shadow, mirrored the same way the wash
      // is: same cell, same size, same flip, same tilt — one step down-and-right
      // of the being, so it reads as light falling past it rather than as a
      // second creature. It survives redemption on purpose: a freed moth still
      // stands in the same room and still casts a shadow; what ends at
      // redemption is the halo, which is the warning (see renderHostiles).
      const shade = this.hostileShadeImgs.get(e.id);
      if (shade) {
        shade.setVisible(img.visible);
        if (img.visible) {
          shade.setTexture(img.texture.key);
          shade.setPosition(img.x + HERO_SHADOW_DX * 0.7, img.y + HERO_SHADOW_DY * 0.7);
          shade.setScale(img.scaleX, img.scaleY);
          shade.setFlipX(img.flipX).setRotation(img.rotation);
          shade.setAlpha(HOSTILE_SHADOW_ALPHA * img.alpha);
        }
      }
      // R3-15 · THE DESATURATION GRAMMAR (doc 41 §2): the wash mirrors its
      // being exactly — same cell, same place, same flip, same size — and only
      // its opacity moves. Redeem = the colour floods back in, which is the
      // restore card's answer showing up in the world.
      const wash = this.washImgs.get(e.id);
      if (wash) {
        const a = washAlphaFor(e, this.cfg.reducedMotion);
        wash.setVisible(!e.hidden && a > 0);
        if (a > 0) {
          // the DRAINED copy of whatever cell the being is showing this tick —
          // built once per cell, so a being that changes pose mid-wash (Merle
          // acting out a round) is greyed by its own drawing rather than by the
          // last one (greyTexOf)
          const greyKey = this.greyTexOf(img.texture.key);
          wash.setTexture(greyKey);
          if (greyKey === img.texture.key) wash.setTint(COLOUR_DRAINED);
          else wash.clearTint();
          wash.setPosition(img.x, img.y);
          wash.setScale(img.scaleX, img.scaleY);
          wash.setFlipX(img.flipX);
          wash.setAlpha(a * img.alpha);
        }
      }
      // PK-R6 · H1 · THE COLOUR ARRIVING (round-1 critique, finding 8). The same
      // mirror trick as the wash, run the other way: a warm ADD-blended copy of
      // the being's own cell whose alpha spikes as the grey lets go. Driven by
      // anim.floodBloomFor off the sim's own timer, so the light is over before
      // the flood is and the being is left holding nothing but its colour.
      const bloom = this.bloomImgs.get(e.id);
      if (bloom) {
        const b = floodBloomFor(e, this.cfg.reducedMotion);
        bloom.setVisible(!e.hidden && b > 0);
        if (b > 0) {
          bloom.setTexture(img.texture.key);
          bloom.setPosition(img.x, img.y);
          bloom.setScale(img.scaleX, img.scaleY);
          bloom.setFlipX(img.flipX);
          bloom.setAlpha(b * img.alpha);
        }
      }
      // …and the once-per-freeing flourish behind it (finding 7).
      if (e.redeemed && !this.cheered.has(e.id)) {
        this.cheered.add(e.id);
        // PK-R6 · H1 (round-1 critique, finding 5): a PERSON's freeing is not a
        // moth's. Six rounds of a ceremony end here, so hers opens wider and
        // throws further — the same flourish, scaled by what the child paid for
        // it. Every other being keeps exactly the beat it already had.
        this.redeemFlourish(img.x, img.y - this.entTargetH(e) * 0.5, e.role === "classmate" ? 1.9 : 1);
        // …and the cage she was in plays its OPENING rather than swapping to a
        // picture of an open one (finding 4: the cage has to be a thing that
        // HAPPENS, or a six-year-old never learns what the shape meant).
        if (e.role === "cage") this.cageOpens(img);
      }
    }
    // R3-4 · THE PROJECTILE IS CHALK, not a white ball. `tafel_chalk` was
    // painted and drawn by nothing (doc 38 §2) while the duel threw a circle;
    // it now flies as the stick it is, tumbling so the arc reads.
    this.projG.clear();
    let used = 0;
    for (const pr of this.world.projectiles) {
      const thrower = this.world.entities.find((e) => e.id === pr.fromId);
      // PK-R6 · E · THE SIX PAINTED STICKS. The colour rides on the piece
      // (entities.CHALK_COLOURS, cycled by throw index), so the stick that flies
      // is the stick that shatters and the stick its shard is made of. The old
      // single `tafel_chalk` stem stays the fallback for any guardian whose
      // chapter has no coloured set — the only-present law, unchanged.
      const shard = pr.kind === "shard";
      const coloured = pr.colour !== "" ? `pb-chalk_${pr.colour}` : "";
      // PK-R6 · H1 (round-1 critique, finding 5) · THE LIGHT THE STICK CARRIES.
      // Drawn before the sprite so the stick sits ON its own glow, and drawn on
      // projG (depth 8, the projectile plane) so it can never end up over the
      // hero. A dark rim goes down first: the halo alone is invisible on the
      // pale book floor, and the rim alone is invisible on the dark shelf — the
      // pair survives both, which is the whole requirement.
      if (pr.kind === "chalk" || shard) {
        const lx = fromSubs(pr.x);
        const ly = fromSubs(pr.y) - (shard ? 2 : 4);
        const light = CHALK_LIGHT[pr.colour] ?? CHALK_LIGHT_FALLBACK;
        if (shard && !this.burstShards.has(pr.id)) {
          this.burstShards.add(pr.id);
          this.chalkBreak(lx, ly, light);
        }
        if (shard) {
          // a lying hazard: a slow breath, dimming with the second it has left
          // Kept SMALLER than the splinter's own glow instinct wants: at 5 px it
          // swallowed the painted shard and four of them read as soap bubbles
          // lying on the floor (measured at 4× in the running game). The job is
          // „you can still see the hazard", not „the hazard is a lamp".
          const left = Math.max(0, 1 - pr.age / SHARD_TICKS);
          const pulse = this.cfg.reducedMotion ? 0.7 : 0.6 + 0.4 * Math.sin(pr.age * 0.22);
          this.projG.fillStyle(0x2a1d0c, 0.3 * left);
          this.projG.fillEllipse(lx, ly + 2.6, 7, 2.6); // the shadow it casts, not a ring around it
          this.projG.fillStyle(light, 0.3 * left * pulse);
          this.projG.fillCircle(lx, ly, 3.4);
          this.projG.fillStyle(light, 0.5 * left);
          this.projG.fillCircle(lx, ly, 1.5);
        } else {
          // In flight: a comet of its own colour. Sampled CLOSE together (1.3
          // ticks apart) on purpose — measured at 6× in the running game, wider
          // spacing drew a row of separate grey bubbles instead of a streak.
          for (let i = CHALK_TAIL_POINTS; i >= 1; i--) {
            const back = i * 1.3; // ticks behind, turned into px by its own speed
            const tx = lx - (pr.vx / SUBS) * back;
            const ty = ly - (pr.vy / SUBS) * back;
            const k = 1 - i / (CHALK_TAIL_POINTS + 1);
            this.projG.fillStyle(light, 0.46 * k * k);
            this.projG.fillCircle(tx, ty, 0.9 + 2.2 * k);
          }
          // the glow itself: three soft rings, no dark fill under them. A filled
          // dark disc was tried first and read as a mud blob at 6× — the stick
          // has to sit in light, not in a shadow.
          for (let i = 2; i >= 0; i--) {
            const k = 1 - i / 3;
            this.projG.fillStyle(light, CHALK_GLOW_ALPHA * k * k);
            this.projG.fillCircle(lx, ly, CHALK_GLOW_R * (0.34 + i * 0.33));
          }
          // …and a thin dark contour at the glow's rim, which is what keeps the
          // piece readable on the PALE book floor where a halo alone vanishes.
          this.projG.lineStyle(0.9, CHALK_RIM, 0.38).strokeCircle(lx, ly, CHALK_GLOW_R * 0.72);
        }
      }
      // the two painted splinters, chosen by id so a shard never flickers
      const shardKey = `pb-chalk_shard_${pr.id % 2 === 0 ? "a" : "b"}`;
      const key = [shard ? shardKey : "", shard ? "" : coloured, thrower ? `pb-${thrower.skin}_chalk` : ""]
        .find((k) => k !== "" && this.textures.exists(k)) ?? "";
      if ((pr.kind === "chalk" || shard) && key !== "") {
        let img = this.projImgs[used];
        if (!img) {
          img = this.add.image(0, 0, key).setDepth(8).setOrigin(0.5, 0.5);
          this.projImgs[used] = img;
        }
        used++;
        img.setVisible(true).setTexture(key).setPosition(fromSubs(pr.x), fromSubs(pr.y) - (shard ? 2 : 4));
        img.setScale((shard ? SHARD_DISPLAY_H : CHALK_DISPLAY_H) / (img.frame.height || 1));
        // a lying splinter does not tumble; it FADES as its second runs out, so
        // „this is about to stop being dangerous" is readable without a HUD.
        img.setRotation(shard || this.cfg.reducedMotion ? 0 : (pr.deflected ? -1 : 1) * pr.age * 0.14);
        img.setAlpha(shard ? Math.max(0.35, 1 - pr.age / SHARD_TICKS) : 1);
        continue;
      }
      // the ink blob keeps its dot (no painted sheet — the only-present law)
      this.projG.fillStyle(pr.kind === "blob" ? 0x4f86c6 : 0xf6f2e8, 1);
      this.projG.fillCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "blob" ? 4 : 3);
      this.projG.lineStyle(1, 0x243048, 0.6).strokeCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "blob" ? 4 : 3);
    }
    for (let i = used; i < this.projImgs.length; i++) this.projImgs[i]?.setVisible(false);

    // R3-4 · the WINDUP shows the hand that throws (`tafel_hand`, also painted
    // and never shown). It appears only while the guardian is telegraphing, on
    // the side it is facing — so the tell and the aim are the same picture.
    const winding = this.world.entities.find((e) => e.role === "guardian" && e.state === "telegraph" && !e.redeemed);
    const handKey = winding ? `pb-${winding.skin}_hand` : "";
    if (winding && handKey !== "" && this.textures.exists(handKey)) {
      this.handImg.setVisible(true).setTexture(handKey);
      this.handImg.setPosition(fromSubs(winding.x) + winding.dir * HAND_OFFSET_X, fromSubs(winding.y) - HAND_OFFSET_Y);
      this.handImg.setScale(HAND_DISPLAY_H / (this.handImg.frame.height || 1));
      this.handImg.setFlipX(winding.dir > 0);
    } else {
      this.handImg.setVisible(false);
    }
  }

  // ── R3-12 · the boss-evidence beat (doc 41 §4) ────────────────────────────
  /**
   * Write a card's evidence onto the guardian's own board, and report how long
   * (ms) the card must wait before opening. Returns 0 when this skin declares no
   * writing surface, in which case the card opens at once — a guardian without a
   * board is a design choice, never a silent blank.
   */
  /** Where the chalk lands on THIS guardian right now, in world px — read off
   *  the sprite as it is actually drawn, so the writing follows the cell she is
   *  wearing rather than a number measured once against a retired one. */
  private boardAnchor(entityId: string): { y: number; w: number } | null {
    const e = this.world?.entities.find((x) => x.id === entityId);
    const board = e ? GUARDIAN_BOARDS[e.skin] : undefined;
    if (!e || !board) return null;
    const img = this.entityImgs.get(entityId);
    const h = img?.displayHeight || this.entTargetH(e);
    const w = img?.displayWidth || h;
    return { y: fromSubs(e.y) + board.dyFrac * h, w: Math.max(w * board.wFrac, 8) };
  }

  writeEvidence(entityId: string, lines: readonly string[]): number {
    const e = this.world?.entities.find((x) => x.id === entityId);
    const anchor = this.boardAnchor(entityId);
    if (!e || !anchor) return 0;
    this.clearEvidence();
    this.evidenceOwner = entityId;
    this.evidenceFull = lines.join("  ");
    this.evidenceTick = 0;
    this.evidenceText = this.add
      .text(fromSubs(e.x), anchor.y, "", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "6px",
        color: "#f6f2e8", // chalk on slate
        align: "center",
        wordWrap: { width: anchor.w },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(8)
      .setResolution(RENDER_SCALE * 2);
    return EVIDENCE_BEAT_TICKS * TICK_MS;
  }

  /** The board wipes itself once its card is answered or put down. */
  clearEvidence(): void {
    this.evidenceText?.destroy();
    this.evidenceText = null;
    this.evidenceOwner = null;
    this.evidenceFull = "";
    this.evidenceTick = 0;
  }

  // ── PK-R6 · H1 · THE GIFT (round-1 critique, finding 1) ────────────────────
  /**
   * The child has written the first kind word anyone ever put on her. Chalk it
   * onto her slate and let the board bloom — doc 44 §4 ch01 C4's „the class
   * writes the first lesson back on her", and the picture the console beat's
   * copy has been promising since F2-24.
   *
   * Takes the word the CHILD typed, not the task's answer key: the card says
   * „dein Wort", and a child who answered „hi" must not watch „hello" appear.
   * Falsy or blank input is ignored rather than writing an empty board.
   */
  chalkTheGift(entityId: string, word: string): void {
    const clean = word.trim().slice(0, 24);
    if (clean === "") return;
    const anchor = this.boardAnchor(entityId);
    if (!anchor) return; // a guardian with no writing surface simply keeps her face
    this.giftText?.destroy();
    this.giftOwner = entityId;
    this.giftWord = clean;
    this.giftTick = 0;
    this.giftText = this.add
      .text(0, anchor.y + this.giftDy(entityId), "", {
        fontFamily: "system-ui, sans-serif",
        fontSize: "8px", // bigger than her scribbles: it is the loudest thing on the board
        color: "#fff6d8", // fresh chalk, warmer than the evidence's slate-white
        align: "center",
        wordWrap: { width: anchor.w },
      })
      .setOrigin(0.5, 0.5)
      .setDepth(8)
      .setResolution(RENDER_SCALE * 2);
  }

  /** The sunflower light the gift brings up ON her: an ADD-blended copy of the
   *  cell she is wearing this tick, built on first use and mirrored exactly —
   *  same texture, place, scale, flip and tilt — so she blooms in her OWN shape
   *  rather than gaining a rectangle of glow. */
  private giftGlow(id: string, img: Phaser.GameObjects.Image, t: number): void {
    let glow = this.giftGlowImgs.get(id);
    if (t <= 0) { glow?.setVisible(false); return; }
    if (!glow) {
      glow = this.add.image(img.x, img.y, img.texture.key).setOrigin(img.originX, img.originY).setDepth(7.03);
      glow.setBlendMode(Phaser.BlendModes.ADD);
      glow.setTint(GIFT_BLOOM_TINT);
      this.giftGlowImgs.set(id, glow);
    }
    glow.setVisible(img.visible).setTexture(img.texture.key);
    glow.setPosition(img.x, img.y).setScale(img.scaleX, img.scaleY);
    glow.setFlipX(img.flipX).setRotation(img.rotation);
    glow.setAlpha(GIFT_ADD_ALPHA * t * img.alpha);
  }

  /** How far below the board's centre the gift is written, in world px — read
   *  off the sprite as drawn, like boardAnchor, so it tracks whatever cell she
   *  is wearing rather than a number measured once against one of them. */
  private giftDy(entityId: string): number {
    const img = this.entityImgs.get(entityId);
    const e = this.world?.entities.find((x) => x.id === entityId);
    const h = img?.displayHeight || (e ? this.entTargetH(e) : 0);
    return h * GIFT_DY_FRAC;
  }

  /** How far the bloom has opened, 0…1 — read by renderEntities so her whole
   *  body warms, not just the rectangle the word sits in. */
  private giftBloomT(entityId: string): number {
    if (this.giftOwner !== entityId) return 0;
    if (this.cfg.reducedMotion) return 1; // the end-states law: no beat to watch, so show the end
    return Math.min(1, this.giftTick / GIFT_BLOOM_TICKS);
  }

  /** The word appears stroke by stroke and then STAYS. Driven from render for
   *  the same reason the evidence is: the sim is frozen while the card is up. */
  private renderGift(): void {
    this.giftHaloG.clear();
    const t = this.giftText;
    if (!t || this.giftOwner === null) return;
    const e = this.world?.entities.find((x) => x.id === this.giftOwner);
    const anchor = this.boardAnchor(this.giftOwner);
    if (!e || !anchor) { t.setVisible(false); return; }
    t.setVisible(true).setPosition(fromSubs(e.x), anchor.y + this.giftDy(this.giftOwner));
    this.giftTick++;
    const shown = this.cfg.reducedMotion
      ? this.giftWord.length
      : Math.ceil((this.giftWord.length * Math.min(this.giftTick, GIFT_WRITE_TICKS)) / GIFT_WRITE_TICKS);
    t.setText(this.giftWord.slice(0, shown));
    this.chalkDust(t, anchor.w); // her gift is chalk too, and chalk is dusty (finding 9)
    // …and the sunflower light it brings up, thrown behind her so the bloom
    // reads as the BOARD glowing rather than as a lamp parked in front of it.
    if (this.cfg.reducedMotion) return;
    const b = this.giftBloomT(this.giftOwner);
    if (b <= 0) return;
    const img = this.entityImgs.get(this.giftOwner);
    const cx = fromSubs(e.x);
    const cy = (img?.y ?? fromSubs(e.y)) - (img?.displayHeight ?? this.entTargetH(e)) * 0.35;
    const r0 = Math.max((img?.displayWidth ?? 40) * 0.5, 14);
    for (let i = 0; i < 4; i++) {
      const k = 1 - i / 4;
      this.giftHaloG.fillStyle(GIFT_HALO_COLOUR, 0.16 * b * k);
      this.giftHaloG.fillCircle(cx, cy, r0 * (0.85 + i * 0.34));
    }
  }

  /** The chalk appears as it is WRITTEN — that stroke-by-stroke beat is the
   *  readability telegraph the card waits for. Driven from render, not the sim
   *  clock, because the world is deliberately frozen while a card is pending. */
  private renderEvidence(): void {
    this.dustG.clear();
    const t = this.evidenceText;
    if (!t || this.evidenceOwner === null) return;
    const e = this.world?.entities.find((x) => x.id === this.evidenceOwner);
    const anchor = this.boardAnchor(this.evidenceOwner);
    if (!e || !anchor) return;
    t.setPosition(fromSubs(e.x), anchor.y);
    this.evidenceTick++;
    const shown = this.cfg.reducedMotion
      ? this.evidenceFull.length
      : Math.ceil((this.evidenceFull.length * Math.min(this.evidenceTick, EVIDENCE_BEAT_TICKS)) / EVIDENCE_BEAT_TICKS);
    t.setText(this.evidenceFull.slice(0, shown));
    this.chalkDust(t, anchor.w);
  }

  /**
   * PK-R6 · H1 · CHALK IS DUSTY (round-1 critique, finding 9).
   *
   * „The eyes/numerals are clean flat strokes with no chalk-dust scatter or
   * smudge" — they read as a decal laid on the slate rather than as something
   * dragged across it. Real chalk leaves the mark AND the powder it shed making
   * it, and the powder is most of what says „this surface has tooth".
   *
   * Drawn UNDER the glyphs (depth 7.9 against the text's 8) as a soft smudge
   * band plus a scatter of motes along the writing line. Deterministic — every
   * mote's place is a hash of its own index, no `Math.random` — and it follows
   * the text box, so it lands under the strokes wherever the board is.
   */
  private chalkDust(t: Phaser.GameObjects.Text, boardW: number): void {
    const n = t.text.length;
    if (n === 0) return;
    const w = Math.max(Math.min(t.width, boardW), 4);
    const x0 = t.x - w / 2;
    // The smudge the hand leaves dragging across. Overlapping ellipses, not a
    // rectangle: measured at 5× in the running game, a filled rect read as a
    // pale BOX sitting on the slate — the one shape a smudge must never have.
    const lobes = Math.max(3, Math.round(w / 6));
    for (let i = 0; i < lobes; i++) {
      const cx = x0 + ((i + 0.5) / lobes) * w;
      const h = Math.imul(i + 7, 2654435761) >>> 0;
      this.dustG.fillStyle(0xf6f2e8, 0.05 + 0.03 * (((h >>> 12) & 0xff) / 255));
      this.dustG.fillEllipse(cx, t.y + t.height * 0.06, (w / lobes) * 2.1, t.height * 0.62);
    }
    // …and the powder that fell off the strokes making them
    for (let i = 0; i < n * 3; i++) {
      const h = Math.imul(i + 1, 2654435761) >>> 0;
      const fx = ((h >>> 8) & 0xff) / 255;
      const fy = ((h >>> 16) & 0xff) / 255;
      const fr = ((h >>> 24) & 0xff) / 255;
      this.dustG.fillStyle(0xf6f2e8, 0.1 + 0.22 * fr);
      this.dustG.fillCircle(x0 + fx * w, t.y + (fy - 0.5) * t.height * 0.95, 0.25 + 0.5 * fr);
    }
  }

  /** R3-16 · the collect beat (doc 42 §4): rise away 26 px over 320 ms on
   *  `Back.easeIn` while fading, with the puff underneath it. Reduced motion
   *  keeps the puff (it is a still picture) and simply removes the letter. */
  private collectBurst(img: Phaser.GameObjects.Image): void {
    this.puff(img.x, img.y + 4, "chalk");
    if (this.cfg.reducedMotion) { img.destroy(); return; }
    this.tweens.add({
      targets: img, y: img.y - 26, alpha: 0, ease: "Back.easeIn", duration: 320,
      onComplete: () => img.destroy(),
    });
  }

  /** PK-R6 · C · THE CONTACT SPARK (doc 44 §3.1.1, v0 `tryEncounter`) — the
   *  first beat of the entry choreography: the being BURSTS at the touch point,
   *  and the ink iris wipes over that burst a moment later. 22 particles, and
   *  their lifespans (260–520 ms) are the v0 emitter's verbatim; the SPEEDS are
   *  the same emitter's 60–220 px/s re-expressed in this world's units, because
   *  a paint tile is 16 px against the mined build's 48 and a verbatim velocity
   *  would fling the burst three screens wide. Re-skinned per the mining law:
   *  ink flecks off the page rather than Keen's warm sparks.
   *
   *  Code-drawn circles, zero image assets (B14) — and deterministic (repo law:
   *  no Math.random anywhere in the game): angle and speed come from the
   *  particle's own index, so the burst is identical in a harness replay. */
  contactSpark(id: string): void {
    if (this.cfg.reducedMotion) return; // the world simply freezes; nothing flies
    const e = this.world?.entities.find((x) => x.id === id);
    if (!e) return;
    const xPx = fromSubs(e.x);
    const yPx = fromSubs(e.y);
    const SCALE = TILE / 48; // this world's px per the mined world's px

    // ── PK-R6 · H1 · THE FLASH (round-1 critique, finding 1) ──────────────────
    // „No spark, particle or flash — it reads as a flat translucent smudge."
    // Two causes, and the count was neither of them: the flecks were 1.3–2.1 px
    // in a world drawn at 16 px per tile, and the ink veil went up in the SAME
    // frame the burst was thrown, so the whole impact happened underneath it.
    // (The veil's ramp now holds the world legible for the burst's brightest
    // moment — overlay-css, »pb-veil-in«.) What was missing on this side is a
    // CORE: a contact reads as a contact because something goes bright at the
    // point of contact, and nothing here ever did.
    const flash = this.add.circle(xPx, yPx, 3, 0xfff6d8, 0.95).setDepth(9.3);
    this.tweens.add({
      targets: flash, scale: 5.2, alpha: 0, duration: 150, ease: "Quad.easeOut",
      onComplete: () => flash.destroy(),
    });
    const halo = this.add.circle(xPx, yPx, 5, 0xffd98f, 0.6).setDepth(9.2);
    this.tweens.add({
      targets: halo, scale: 4.4, alpha: 0, duration: 260, ease: "Quad.easeOut",
      onComplete: () => halo.destroy(),
    });
    // the shock the flash leaves: a thin ring opening off the touch point, which
    // is what gives the frame a direction to read outward along
    const ring = this.add.circle(xPx, yPx, 4, undefined, 0).setStrokeStyle(1.4, 0xfff0c4, 0.9).setDepth(9.2);
    this.tweens.add({
      targets: ring, scale: 5.5, alpha: 0, duration: 320, ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
    // …and the mark it leaves ON the page, so a frame caught LATE still says
    // „something hit here" instead of showing an empty patch of classroom
    const splat = this.add.circle(xPx, yPx, 5.5, 0x2f2617, 0.34).setDepth(6.9);
    this.tweens.add({
      targets: splat, scale: 1.9, alpha: 0, duration: 620, ease: "Quad.easeIn",
      onComplete: () => splat.destroy(),
    });

    for (let i = 0; i < SPARK_COUNT; i++) {
      const ang = (i / SPARK_COUNT) * Math.PI * 2 + (i % 3) * 0.21; // 360°, un-banded
      const speed = (60 + (i % 5) * 40) * SCALE; // v0 60…220 px/s, in paint px
      const life = 260 + (i % 6) * 52; // v0 lifespan 260…520 ms, verbatim
      const colour = i % 2 === 0 ? 0x3a2f1c : 0xf6f2e8; // ink fleck · chalk mote
      const dist = (speed * life) / 1000;
      // …and every third fleck flies as a STREAK rather than a dot: a rectangle
      // laid along its own heading, which is how a still frame shows a path at
      // all (the critique's „no motion path"). The dots keep the mined sizes ×2
      // — the v0 emitter's particles were sized for a 48 px tile.
      const streak = i % 3 === 0;
      const g: Phaser.GameObjects.Shape = streak
        ? this.add.rectangle(xPx, yPx, 5.5 + (i % 4), 1.6, colour, 0.95).setRotation(ang).setDepth(9)
        : this.add.circle(xPx, yPx, 2.6 + (i % 3) * 0.8, colour, 0.95).setDepth(9);
      this.tweens.add({
        targets: g,
        x: xPx + Math.cos(ang) * dist,
        // gravityY 70 px/s² (v0), in paint px over this particle's own lifetime
        y: yPx + Math.sin(ang) * dist + 0.5 * 70 * SCALE * (life / 1000) ** 2,
        alpha: 0,
        scale: 0,
        duration: life,
        ease: "Quad.easeOut",
        onComplete: () => g.destroy(),
      });
    }
  }

  /**
   * PK-R6 · H1 · THE FREEING IS CELEBRATED (round-1 critique, finding 7:
   * „no confetti, particles, light, screen response or character reaction — the
   * payoff reads as a static UI update").
   *
   * The card's half of this is the seal and its motes (CardShell.Cheer); this is
   * the world's half, and the world's half matters more, because the restore-hold
   * exists precisely so the child is LOOKING here when it plays. A ray fan opens
   * behind the freed thing, twelve motes are thrown off it, and the arriving
   * colour is already lighting it up underneath (floodBloomFor).
   *
   * Deterministic by construction: every angle, distance and delay comes from the
   * mote's own index, so a replayed tape celebrates identically. Under reduced
   * motion the same picture is drawn STILL, at the positions the motion would
   * have reached, and cleared a beat later — a finished celebration rather than a
   * frozen one (the end-states law, applied to the world).
   */
  private redeemFlourish(xPx: number, yPx: number, size = 1): void {
    const RAYS = 8;
    const rays = this.add.graphics().setDepth(6.95);
    rays.fillStyle(0xffe3a4, 0.5);
    for (let i = 0; i < RAYS; i++) {
      const a = (i / RAYS) * Math.PI * 2;
      const w = 0.14;
      rays.fillTriangle(
        xPx, yPx,
        xPx + Math.cos(a - w) * 34 * size, yPx + Math.sin(a - w) * 34 * size,
        xPx + Math.cos(a + w) * 34 * size, yPx + Math.sin(a + w) * 34 * size,
      );
    }
    if (this.cfg.reducedMotion) {
      this.time.delayedCall(420, () => rays.destroy());
    } else {
      rays.setScale(0.35);
      this.tweens.add({
        targets: rays, scale: 1.35, alpha: 0, angle: 14, duration: 520,
        ease: "Cubic.easeOut", onComplete: () => rays.destroy(),
      });
    }

    const MOTES = 12;
    for (let i = 0; i < MOTES; i++) {
      const ang = (i / MOTES) * Math.PI * 2 + (i % 4) * 0.16;
      const dist = (16 + (i % 5) * 5) * size;
      const colour = i % 2 === 0 ? 0xf6f2e8 : 0xffd98f;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist - 6; // the lift: joy goes up
      const g = this.add.circle(xPx, yPx, 1.4 + (i % 3) * 0.6, colour, 0.95).setDepth(9.1);
      if (this.cfg.reducedMotion) {
        g.setPosition(xPx + dx, yPx + dy);
        this.time.delayedCall(420, () => g.destroy());
        continue;
      }
      this.tweens.add({
        targets: g, x: xPx + dx, y: yPx + dy, alpha: 0, scale: 0.3,
        delay: (i % 4) * 45, duration: 520 + (i % 3) * 90,
        ease: "Quad.easeOut", onComplete: () => g.destroy(),
      });
    }
  }

  /**
   * PK-R6 · H1 · THE CAGE OPENS (round-1 critique, finding 4). `pencilcase_burst`
   * is a painted OPEN case with its zip flying off — and it arrived as a texture
   * swap, one frame, no event. So the moment a chapter's core mechanic pays off
   * („one cage per chapter") had nothing in it a child could catch, and the
   * shape they were supposed to learn to recognise never did anything.
   *
   * It is a movement now: the case throws itself open with the same overshoot
   * the seal stamps with, and settles. Under reduced motion it simply arrives
   * open and level — the end-states law: that child gets the finished picture,
   * never a frozen halfway one. The rotation reset is the second half of the
   * breathing telegraph above (`renderReadability`), which stops looking at a
   * cage the moment it is freed and would otherwise leave it tilted forever.
   */
  private cageOpens(img: Phaser.GameObjects.Image): void {
    this.puff(img.x, img.y - img.displayHeight * 0.4, "chalk");
  }

  /**
   * How far through its opening pop a cage is — 1 at the burst, 0 once it has
   * settled. Squared, so the throw is fast and the settle is soft.
   *
   * It is a function of the cage's OWN freed clock rather than a tween, and that
   * is not a style choice: `renderEntities` sets every entity's scale from its
   * target height on every single frame, so a tween on the same property is
   * overwritten before it is ever composited (which is exactly what the first
   * version of this beat did — invisibly). Driving it from `freedTick` also
   * makes it deterministic: a replayed tape opens the cage identically.
   */
  private cagePopT(e: { role: string; redeemed: boolean; freedTick: number }): number {
    if (this.cfg.reducedMotion || e.role !== "cage" || !e.redeemed) return 0;
    if (e.freedTick >= CAGE_OPEN_TICKS) return 0;
    const left = 1 - Math.max(e.freedTick, 0) / CAGE_OPEN_TICKS;
    return left * left;
  }

  /** PK-R6 · C · how grey this being renders RIGHT NOW (anim.washAlphaFor). The
   *  card's portrait asks, so the painted face inside the card can be exactly as
   *  drained as the being standing in the world — a full-colour portrait over a
   *  grey desk would be the desaturation law's own defect in pixels, and on a
   *  restore card it would hand the child step 2's answer for free. */
  washOf(id: string): number {
    const e = this.world?.entities.find((x) => x.id === id);
    return e ? washAlphaFor(e, this.cfg.reducedMotion) : 0;
  }

  /** PK-R6 · D · THE POSE IS THE PROMPT (doc 44 §3.3). The reawakening round
   *  that is opening declares which painted cell of the classmate it shows
   *  (`stimulus.art`); the shell hands that stem here and the being in the
   *  WORLD strikes the same pose, so the card is a picture OF what is standing
   *  next to the child rather than a second, separate drawing of her.
   *
   *  One declaration, two readers — the alternative was a pose list in the
   *  level beside an art binding in the tasks file, i.e. the same fact written
   *  twice and free to drift. Returns the state actually set, or null when the
   *  stem is not this being's cell (in which case she simply keeps the pose she
   *  had: a mis-bound card must not dress her as somebody else). */
  setActingPose(id: string, stem: string): string | null {
    const e = this.world?.entities.find((x) => x.id === id);
    if (!e || e.redeemed) return null;
    const state = poseStateOf(stem, e.skin);
    if (state === null) return null;
    e.state = state;
    e.timer = 0;
    return state;
  }

  /**
   * PK-R6 · H1 · WHAT THE FEET DO (round-1 critique, findings 4 and 6).
   *
   * Two things the capture set caught us not doing: the frame the harness named
   * „landing-squash" had no dust, no impact mark, nothing — and the pencil enemy
   * walking past the hero threw step-puffs he never got, so the background NPC
   * read as more alive than the child's own character.
   *
   * Both are drawn from state the sim already owns, on numbered ticks, so a
   * replayed tape throws the same dust in the same places. Called once per sim
   * tick with the fall speed that tick was carrying before the floor took it.
   */
  private footwork(fallVy: number): void {
    const p = this.player;
    const feetY = fromSubs(p.y);
    const x = fromSubs(p.x);
    // ── the landing ──
    // PK-R6 · H2: the hardness is remembered whatever it was, INCLUDING a step
    // down too soft for dust — `renderContact` grades the mark by it, and a
    // recorded 0 is what stops a gentle step from drawing a crater.
    if (p.landedAgo === 0) this.landHardness = Math.min(fallVy / (LAND_DUST_VY * 3), 1);
    if (p.landedAgo === 0 && fallVy >= LAND_DUST_VY) {
      this.puff(x, feetY + 2, "chalk");
      // …and a wider skirt for a real drop, so a long fall lands harder than a
      // hop off a shelf — the impact is graded, not a switch
      if (fallVy >= LAND_DUST_VY * 2) {
        this.puff(x - 5, feetY + 2, "chalk");
        this.puff(x + 5, feetY + 2, "chalk");
      }
    }
    // ── the footfalls ──
    // The rig plants a foot at each half of the run cycle (rig.ts: the feet ride
    // opposite phases of one cycloid), so a puff belongs at each CROSSING of a
    // half — tested as a crossing because a frame that swallows several ticks
    // would step straight over an equality test and drop the puff.
    const phase = (p.walkTime % RIG.runCycleTicks) / RIG.runCycleTicks;
    const half = (v: number): number => Math.floor(v * 2);
    if (p.grounded && Math.abs(p.vx) >= STEP_DUST_VX && half(phase) !== half(this.lastStridePhase)) {
      this.puff(x - Math.sign(p.vx) * 4, feetY + 1, "chalk");
    }
    this.lastStridePhase = phase;
  }

  /** R3-4/R3-6 · a puff of chalk dust at an impact. Pure decoration with a
   *  lifetime — under reduced motion it still appears, it just does not drift. */
  private puff(xPx: number, yPx: number, kind: "chalk" | "hit"): void {
    const colour = kind === "chalk" ? 0xf6f2e8 : 0xe8dcc0;
    for (let i = 0; i < 5; i++) {
      const g = this.add.circle(xPx, yPx - 4, 1.6 + (i % 3) * 0.5, colour, 0.9).setDepth(9);
      const dx = (i - 2) * 3.5;
      const dy = -3 - (i % 2) * 3;
      if (this.cfg.reducedMotion) {
        this.time.delayedCall(220, () => g.destroy());
      } else {
        this.tweens.add({ targets: g, x: xPx + dx, y: yPx - 4 + dy, alpha: 0, scale: 0.4, duration: 260, onComplete: () => g.destroy() });
      }
    }
  }

  // ── rendering ──────────────────────────────────────────────────────────────

  /**
   * PK-R6 · E · THE GOLDEN TRAIL (doc 44 B14: „full-code animation is
   * legitimate"). Her path is the thing the child has to learn, so the path is
   * what gets drawn: a fading tail of chalk-gold sampled off the sim's own
   * positions, brightest and fattest where she just was.
   *
   * Deterministic: points are sim positions on numbered ticks and the only
   * jitter is a hash of the tick, so a replayed tape draws an identical tail.
   * Under reduced motion it is not drawn at all — it depicts nothing BUT motion,
   * and the end-states law asks for a finished picture, not a frozen smear.
   */
  /**
   * PK-R6 · H1 · SEPARATION AND CHARGE (round-1 critique, findings 3 and 6).
   *
   * Two jobs, one canvas, because both belong to the boss and both must sit
   * BEHIND her: the halo that lifts her dark frame off the dark bookshelf, and
   * the charge that gathers at her chalk hand while she rears — the one thing
   * that tells „about to attack" apart from „about to move" now that the sheet's
   * own painted swoosh appears in every cell alike.
   *
   * Deterministic: the only time-varying term is a hash of the sim tick, the
   * same device the trail uses.
   */
  /**
   * PK-R6 · H1 · THE CHALK BREAKS (round-1 critique, finding 5 / the juice
   * verdict: „the landed chalk shard has no impact burst at all").
   *
   * A piece of chalk hitting a wooden floor is the loudest thing in the fight
   * and it happened in total silence, mid-frame, with nothing to mark it — so a
   * screenshot of the moment showed a white dot on a patterned floor and the
   * child got no confirmation that the thing they dodged had actually landed.
   *
   * Code-drawn, deterministic (angles come from the fleck's index, never from
   * `Math.random` — repo law), in the chalk's OWN colour so the burst names the
   * stick it came from. Reduced motion skips it: it is nothing but motion.
   */
  private chalkBreak(xPx: number, yPx: number, light: number): void {
    if (this.cfg.reducedMotion) return;
    const flash = this.add.circle(xPx, yPx, 2.4, light, 0.9).setDepth(8.4);
    this.tweens.add({
      targets: flash, scale: 3.6, alpha: 0, duration: 170, ease: "Quad.easeOut",
      onComplete: () => flash.destroy(),
    });
    const ring = this.add.circle(xPx, yPx, 3, undefined, 0).setStrokeStyle(1.1, light, 0.85).setDepth(8.3);
    this.tweens.add({
      targets: ring, scale: 4.2, alpha: 0, duration: 300, ease: "Cubic.easeOut",
      onComplete: () => ring.destroy(),
    });
    // the dust it kicks up — eight motes on a low, wide fan, because chalk on a
    // floor sprays sideways rather than up
    for (let i = 0; i < 8; i++) {
      const ang = Math.PI + (i / 7) * Math.PI; // the upper half, left to right
      const speed = 26 + (i % 3) * 14;
      const life = 300 + (i % 4) * 90;
      const mote = this.add.circle(xPx, yPx, 0.9 + (i % 3) * 0.4, light, 0.9).setDepth(8.2);
      this.tweens.add({
        targets: mote,
        x: xPx + Math.cos(ang) * ((speed * life) / 1000),
        y: yPx + Math.sin(ang) * ((speed * life) / 1000) * 0.55 + 3,
        alpha: 0,
        duration: life,
        ease: "Quad.easeOut",
        onComplete: () => mote.destroy(),
      });
    }
  }

  /**
   * PK-R6 · H1 · HOW HARD THE CHILD IS BRACING RIGHT NOW, 0…1 (finding 7).
   *
   * Read off the boss rather than off a timer of its own, so the two are the
   * same beat by construction: he winds up WITH her (the tell's own progress),
   * holds through the release, and lets go while the chalk is still in the air.
   * Nothing to reset, nothing that can be left stuck on if a card interrupts —
   * if there is no guardian rearing, there is no brace.
   */
  private braceT(): number {
    const g = this.world?.entities.find(
      (e) => e.role === "guardian" && !e.redeemed && (e.state === "telegraph" || e.state === "throw"),
    );
    if (!g) return 0;
    if (g.state === "throw") return 1; // fully set for the release
    const need = Math.max(telegraphTicksFor(g.tier, g.hp, GUARDIAN_SCRIPT[g.tier].knots), 1);
    return Math.max(0, Math.min(1, g.timer / need));
  }

  private renderBossGlow(): void {
    this.bossGlowG.clear();
    this.chargeG.clear();
    const g = this.world?.entities.find((e) => e.role === "guardian" && !e.redeemed);
    if (!g) return;
    const img = this.entityImgs.get(g.id);
    if (!img || !img.visible) return;
    const cx = img.x;
    const cy = img.y - img.displayHeight * 0.28; // her slate, not her legs
    const r0 = Math.max(img.displayWidth, img.displayHeight) * 0.42;

    // ── the halo ──────────────────────────────────────────────────────────
    // Under reduced motion it is drawn too: it is a still picture and it is the
    // only thing separating her from the shelf.
    for (let i = 0; i < BOSS_HALO_RINGS; i++) {
      const k = 1 - i / BOSS_HALO_RINGS; // 1 at the core, 0 at the rim
      const spread = 1 + (BOSS_HALO_SPREAD - 1) * (i / Math.max(BOSS_HALO_RINGS - 1, 1));
      this.bossGlowG.fillStyle(BOSS_HALO_COLOUR, BOSS_HALO_ALPHA * k * k);
      this.bossGlowG.fillCircle(cx, cy, r0 * spread);
    }

    // ── the charge ────────────────────────────────────────────────────────
    if (g.state !== "telegraph" || this.cfg.reducedMotion) return;
    const G = this.chargeG; // in FRONT of her body — see the field's own note
    const need = Math.max(telegraphTicksFor(g.tier, g.hp, GUARDIAN_SCRIPT[g.tier].knots), 1);
    const t = Math.max(0, Math.min(1, g.timer / need)); // 0 at the rear, 1 at release
    const hx = cx + g.dir * HAND_OFFSET_X;
    const hy = img.y - HAND_OFFSET_Y;
    // it TIGHTENS as it fills: a charge that only got bigger would read as a
    // puff, and the child has to see the moment it is about to go off
    const r = CHARGE_MAX_R * (0.35 + 0.65 * t) * (1 - 0.18 * t * t);
    // the amber body, then the hot core inside it
    G.fillStyle(CHARGE_COLOUR, 0.3 + 0.5 * t * t);
    G.fillCircle(hx, hy, r);
    G.fillStyle(CHARGE_CORE, 0.35 + 0.5 * t);
    G.fillCircle(hx, hy, r * 0.42);
    // the ring that CLOSES as the tell runs out — the one shape on screen that
    // is shrinking, which is what makes „now" readable without a number
    G.lineStyle(1.4, CHARGE_CORE, 0.35 + 0.5 * t);
    G.strokeCircle(hx, hy, r * (2.3 - 1.35 * t));
    // …and the four sparks it pulls in, so the charge has a direction of travel
    for (let i = 0; i < 4; i++) {
      const ang = (i / 4) * Math.PI * 2 + this.tickCount * 0.11;
      const d = r * (2.1 - 1.5 * t); // they close in with the ring
      G.fillStyle(CHARGE_CORE, 0.6 * t);
      G.fillCircle(hx + Math.cos(ang) * d, hy + Math.sin(ang) * d, 1.4);
    }
  }

  private renderTrail(): void {
    const g = this.world?.entities.find(
      (e) => e.role === "guardian" && !e.redeemed && TRAIL_STATES.has(e.state),
    );
    if (!g) this.trail.length = 0;
    else if (this.tickCount !== this.trailAt && this.tickCount % TRAIL_SAMPLE_TICKS === 0) {
      const x = fromSubs(g.x);
      const y = fromSubs(g.y) - TRAIL_ANCHOR_Y;
      const last = this.trail[this.trail.length - 1];
      // …only where she actually WENT. Found in the live arena: a card freezes
      // the world while the renderer keeps drawing, so a tail that samples on
      // the clock alone stacked fourteen identical dots into one bright blob
      // under a motionless boss — a trail that says „moving" about a boss who
      // is holding still for a question.
      if (!last || last.x !== x || last.y !== y) {
        this.trailAt = this.tickCount;
        this.trail.push({ x, y, t: this.tickCount });
        while (this.trail.length > TRAIL_POINTS) this.trail.shift();
      }
    }
    this.trailG.clear();
    if (this.cfg.reducedMotion) return;
    for (let i = 0; i < this.trail.length; i++) {
      const p = this.trail[i];
      if (!p) continue;
      const k = (i + 1) / this.trail.length; // 0 = the oldest wisp, 1 = the newest
      this.trailG.fillStyle(TRAIL_COLOUR, 0.55 * k * k);
      this.trailG.fillCircle(p.x + trailWobble(p.t), p.y + trailWobble(p.t * 3), 0.9 + 2.3 * k);
    }
  }

  private render(): void {
    this.renderReadability();
    this.renderAir();
    this.renderLetterFx();
    this.renderBossGlow();
    this.renderTrail();
    this.renderPull();
    const pose0 = rigPose({
      pose: this.player.pose,
      walkTime: this.player.walkTime,
      tick: this.tickCount,
      vxSubs: this.player.vx,
      vySubs: this.player.vy,
      charge: this.player.charge,
      landedAgo: this.player.landedAgo,
      swingLean: this.player.swing
        ? Math.max(-1, Math.min(1, (fromSubs(this.player.swing.anchorX) - fromSubs(this.player.x)) / 48)) * this.player.facing
        : 0,
      reach: this.reachT(),
      reducedMotion: this.cfg.reducedMotion,
    });
    const pose1 = this.fist ? withFistAway(pose0) : pose0;
    // PK-R6 · H1 (round-1 critique, finding 7): …and he ANSWERS her. The brace
    // rides the boss's own telegraph clock, so he sets himself as she rears and
    // is still low through the throw — in ch01 he has no fist, so his body is
    // the only reply he owns.
    const pose = withBrace(pose1, this.braceT());

    this.rigRoot.setPosition(fromSubs(this.player.x), fromSubs(this.player.y) - 15);
    this.rigRoot.setScale(this.player.facing * pose.scaleX, pose.scaleY);
    const flicker = this.player.iframes > 0 && this.player.iframes % 8 < 4;
    this.rigRoot.setAlpha(flicker ? 0.45 : 1);
    // the cast shadow rides the same pose, offset behind the light
    this.rigShadow.setPosition(
      fromSubs(this.player.x) - this.player.facing * HERO_SHADOW_DX,
      fromSubs(this.player.y) - 15 + HERO_SHADOW_DY,
    );
    this.rigShadow.setScale(this.player.facing * pose.scaleX, pose.scaleY);
    this.rigShadow.setAlpha(flicker ? 0 : HERO_SHADOW_ALPHA);

    const apply = (name: RigPartName, dx: number, dy: number, rot: number, hidden: boolean, frame?: number): void => {
      for (const img of [this.parts.get(name), this.shadowParts.get(name)]) {
        if (!img) continue;
        img.setPosition(dx, dy).setRotation(rot).setVisible(!hidden);
        if (name === "rotor" && frame !== undefined) img.setTexture(this.tex(ROTOR_STEMS[frame] ?? "rotor_a"));
      }
    };
    apply("body", pose.body.dx, pose.body.dy, pose.body.rot, false);
    apply("head", pose.head.dx, pose.head.dy, pose.head.rot, false);
    apply("hair", pose.hair.dx, pose.hair.dy, pose.hair.rot, pose.hair.hidden === true);
    apply("handF", pose.handF.dx, pose.handF.dy, pose.handF.rot, pose.handF.hidden === true);
    apply("handB", pose.handB.dx, pose.handB.dy, pose.handB.rot, pose.handB.hidden === true);
    apply("footF", pose.footF.dx, pose.footF.dy, pose.footF.rot, false);
    apply("footB", pose.footB.dx, pose.footB.dy, pose.footB.rot, false);
    apply("rotor", pose.rotor.dx, pose.rotor.dy, pose.rotor.rot, pose.rotor.hidden === true, pose.rotor.frame);

    // PK-R6 · H2: the SKIN reads the touchdown clock too — a landing is not a
    // pose the sim owns, so every part that must change on impact (the crouched
    // torso, the shut eyes, the braced palm) asks `landedAgo` the same way the
    // rig's own absorb does.
    const landAgo = this.player.landedAgo;
    const hands = handStemsFor(this.player.pose, landAgo);
    const skin: Array<[RigPartName, string]> = [
      ["head", faceFor(this.player.pose, this.tickCount, false, landAgo)],
      ["body", bodyStemFor(this.player.pose, landAgo)],
      ["handF", hands.front],
      ["handB", hands.back],
      ["footF", shoeStemFor(this.player.pose)],
      ["footB", shoeStemFor(this.player.pose)],
      ["hair", hairStemFor(this.player.pose, this.player.vx)],
    ];
    for (const [name, stem] of skin) {
      const key = this.tex(stem);
      this.parts.get(name)?.setTexture(key);
      this.shadowParts.get(name)?.setTexture(key);
    }
    this.renderContact();

    if (this.fist) {
      this.fistImg.setVisible(true).setPosition(fromSubs(this.fist.x), fromSubs(this.fist.y)).setFlipX(this.fist.dir < 0);
    } else {
      this.fistImg.setVisible(false);
    }

    // R7: the rope — without it the pendulum's arc extreme reads as floating
    this.ropeG.clear();
    if (this.player.swing) {
      const ax = fromSubs(this.player.swing.anchorX);
      const ay = fromSubs(this.player.swing.anchorY);
      const hx = fromSubs(this.player.x);
      const hy = fromSubs(this.player.y) - 29;
      this.ropeG.lineStyle(1.6, 0x243048, 0.9).lineBetween(ax, ay, hx, hy);
      this.ropeG.fillStyle(0x243048).fillCircle(ax, ay, 2.2);
    }

    this.renderEntities();
    this.renderHostiles();
    this.renderEngageCue();
    this.renderEvidence();
    this.renderGift();

    for (const ring of this.ringImgs) {
      ring.img.y = ring.baseY + (this.cfg.reducedMotion ? 0 : Math.sin(this.tickCount / 22) * 1.5);
    }

    // the camera brain now ticks inside the Sim (deterministic — the screen
    // clamp is gameplay); the render just points the view at it …
    //
    // … and, when a card is up, LEANS IN on whoever is asking (R3-8, doc 42
    // §1). The lean is presentation only: it never touches camX/camY, so the
    // proof tapes and the headless replayer see exactly the same world they
    // always did.
    const asker = this.focusId === null ? undefined : this.world?.entities.find((e) => e.id === this.focusId);
    // the asker's place is REMEMBERED, so the lean has somewhere to ease back
    // FROM after the card closes (and after a redeemed being wanders off)
    if (asker) this.focusAt = { x: fromSubs(asker.x), y: fromSubs(asker.y) };
    const stepT = this.cfg.reducedMotion ? 1 : this.frameMs / FOCUS_MS;
    this.focusT = Math.min(1, Math.max(0, this.focusT + (asker ? stepT : -stepT)));
    if (this.focusT > 0 && this.focusAt !== null) {
      const v = focusView(
        fromSubs(this.camX), fromSubs(this.camY),
        this.focusAt.x, this.focusAt.y,
        this.focusT,
        this.worldWpx, this.worldHpx,
      );
      this.cameras.main.setZoom(RENDER_SCALE * v.zoom);
      this.cameras.main.centerOn(v.cx, v.cy);
      return;
    }
    this.focusAt = null;
    this.cameras.main.setZoom(RENDER_SCALE);
    this.cameras.main.centerOn(fromSubs(this.camX) + LOGICAL_W / 2, fromSubs(this.camY) + LOGICAL_H / 2);
  }

  // ── R3-8 · the battle framing, as the React shell drives it ────────────────

  /** A card is opening for this being: lean in on it (doc 42 §1). */
  focusOn(id: string): void {
    this.focusId = id;
  }

  /** The card is gone: ease back out to the plain follow shot. */
  clearFocus(): void {
    this.focusId = null;
  }

  // ── builders ───────────────────────────────────────────────────────────────

  private tex(stem: string): string {
    return this.textures.exists(`pb-${stem}`) ? `pb-${stem}` : `fb-${stem}`;
  }

  private buildFallbackTextures(): void {
    const g = this.add.graphics();
    const make = (key: string, draw: () => void, w: number, h: number): void => {
      if (this.textures.exists(key)) return;
      g.clear();
      draw();
      g.generateTexture(key, w, h);
    };
    // rig fallbacks are drawn at CELL size so RIG_SRC_SCALE applies uniformly
    const cell = RIG_CELL;
    make("fb-body_idle", () => { g.fillStyle(0x2e5faa); g.fillEllipse(cell / 2, cell / 2, 250, 240); }, cell, cell);
    for (const s of ["body_lean", "body_crouch"]) make(`fb-${s}`, () => { g.fillStyle(0x2e5faa); g.fillEllipse(cell / 2, cell / 2 + 10, 250, 220); }, cell, cell);
    for (const s of ["head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate"]) {
      make(`fb-${s}`, () => { g.fillStyle(0xf2c58f); g.fillCircle(cell / 2, cell / 2, 140); g.fillStyle(0x6b4a2a); g.fillEllipse(cell / 2, cell / 2 - 70, 260, 130); }, cell, cell);
    }
    for (const s of ["hand_open", "hand_fist", "hand_grip"]) make(`fb-${s}`, () => { g.fillStyle(0xf6e7c8); g.fillCircle(cell / 2, cell / 2, 55); }, cell, cell);

    // entity fallbacks: readable painted blobs until Batch AB lands (only-present law)
    const ENT_COLORS: Record<string, number> = {
      pencil: 0xd9a441, pen: 0x3b5ea8, paintbox: 0xb2543a, heft: 0x7a9e6b,
      eraser: 0x6fa8dc, ranzen: 0x8a5a3b, moths: 0xe8c34a, satchel: 0x9a7148,
      pencilcase: 0xc4657a, fibel: 0x4f7d4f, klecksdoor: 0x243048, door: 0x8a6140,
      satchelswing: 0xa8794f, ruler: 0xc9a36a, tafel: 0x3d4f3d, generic: 0x888888,
    };
    for (const [skin, color] of Object.entries(ENT_COLORS)) {
      make(`fb-ent-${skin}`, () => {
        const wpx = skin === "tafel" ? 44 : skin === "ruler" || skin === "satchelswing" ? 40 : 22;
        const hpx = skin === "tafel" ? 40 : skin === "ruler" || skin === "satchelswing" ? 8 : 24;
        g.fillStyle(color, 1);
        g.fillRoundedRect(2, 2, wpx - 4, hpx - 4, 4);
        g.lineStyle(2, 0x243048, 0.9);
        g.strokeRoundedRect(2, 2, wpx - 4, hpx - 4, 4);
        if (hpx > 12) { g.fillStyle(0x243048, 1); g.fillCircle(wpx * 0.35, hpx * 0.35, 1.6); g.fillCircle(wpx * 0.62, hpx * 0.35, 1.6); }
      }, skin === "tafel" ? 44 : skin === "ruler" || skin === "satchelswing" ? 40 : 22, skin === "tafel" ? 40 : skin === "ruler" || skin === "satchelswing" ? 8 : 24);
    }
    // R3-16 · the two new collectibles, engine-drawn until their sheets land.
    // A Regel-Seite reads as a TORN page (a ragged left edge + ruled lines) and
    // a Bonus-Buch as a small closed book with a spine — both distinguishable
    // from a letter at 15–18 px, which is the whole job of a fallback.
    make("fb-ent-regelseite", () => {
      g.fillStyle(0xfdf7e6, 1);
      g.fillRoundedRect(2, 1, 18, 22, 2);
      g.fillStyle(0xe6d6ae, 1);
      for (let i = 0; i < 4; i++) g.fillTriangle(2, 2 + i * 5, 5, 4 + i * 5, 2, 7 + i * 5); // the tear
      g.lineStyle(1, 0x8a7a58, 0.85);
      g.strokeRoundedRect(2, 1, 18, 22, 2);
      g.fillStyle(0xa8926a, 1);
      for (let i = 0; i < 4; i++) g.fillRect(6, 6 + i * 4, 11, 1); // ruled lines
    }, 22, 24);
    make("fb-ent-bonusbuch", () => {
      g.fillStyle(0x8a5a3b, 1);
      g.fillRoundedRect(2, 4, 18, 15, 2);
      g.fillStyle(0xc9a36a, 1);
      g.fillRect(4, 4, 3, 15); // the spine
      g.lineStyle(1, 0x243048, 0.85);
      g.strokeRoundedRect(2, 4, 18, 15, 2);
      g.fillStyle(0xf0c040, 1);
      g.fillCircle(14, 11, 2.4); // the seal
    }, 22, 24);
    for (const s of ["shoe_neutral", "shoe_tucked"]) make(`fb-${s}`, () => { g.fillStyle(0x9c3f2c); g.fillEllipse(cell / 2, cell / 2, 130, 75); }, cell, cell);
    for (const s of ["hair_still", "hair_wind"]) make(`fb-${s}`, () => { g.fillStyle(0x6b4a2a); g.fillEllipse(cell / 2, cell / 2, 150, 80); }, cell, cell);
    for (const s of ["rotor_a", "rotor_b", "rotor_c"]) make(`fb-${s}`, () => { g.fillStyle(0xfdf7e6, 0.9); g.fillEllipse(cell / 2, cell / 2, 260, 60); }, cell, cell);
    make("fb-satchel", () => { g.fillStyle(0x7a5230); g.fillRoundedRect(cell / 2 - 70, cell / 2 - 55, 140, 110, 24); }, cell, cell);
    // prop fallbacks at content-ish sizes
    make("fb-prop_ring", () => { g.lineStyle(26, 0xf0c040); g.strokeCircle(150, 150, 110); }, 300, 300);
    make("fb-prop_letter", () => { g.fillStyle(0xf0c040); g.fillCircle(110, 110, 90); }, 220, 220);
    make("fb-prop_exit", () => { g.fillStyle(0x8a6140); g.fillRect(150, 60, 30, 270); g.fillStyle(0xd9b98a); g.fillRoundedRect(60, 60, 220, 110, 18); }, 340, 340);
    make("fb-prop_spring", () => { g.lineStyle(20, 0xd9b98a); for (let i = 0; i < 4; i++) g.strokeEllipse(130, 60 + i * 55, 180, 44); }, 260, 260);
    make("fb-prop_vine", () => { g.fillStyle(0x3f7d33); g.fillRect(50, 0, 24, 384); }, 124, 384);
    g.destroy();
  }

  /** Source pixel size of a stem, or null when the texture never loaded. */
  private srcSize(stem: string): { w: number; h: number } | null {
    const key = `pb-${stem}`;
    if (!this.textures.exists(key)) return null;
    const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
    return src.width > 0 && src.height > 0 ? { w: src.width, h: src.height } : null;
  }

  /** Place one planned plane piece (doc 36 §1). */
  private placeLayerPiece(p: LayerPiece): void {
    const pY = p.parallaxY;
    if (p.kind === "wash") {
      // L0 AIR: the room's light, engine-drawn — 2–3 stops top→bottom
      const cols = p.colors ?? [0xffffff, 0xffffff];
      const a = cols[0] ?? 0xffffff;
      const b = cols[1] ?? a;
      const c = cols[2] ?? b;
      const g = this.add.graphics().setDepth(p.depth).setScrollFactor(p.parallax, pY);
      const half = p.h / 2;
      g.fillGradientStyle(a, a, b, b, 1);
      g.fillRect(p.x, p.y, p.w, half);
      g.fillGradientStyle(b, b, c, c, 1);
      g.fillRect(p.x, p.y + half, p.w, p.h - half);
      return;
    }
    const stem = p.stem;
    if (stem === undefined) return;
    const key = `pb-${stem}`;
    if (!this.textures.exists(key)) return; // only-present law
    if (p.kind === "loop") {
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      const t = this.add.tileSprite(p.x, p.y, p.w, p.h, key).setOrigin(0, 0).setDepth(p.depth).setScrollFactor(p.parallax, pY);
      t.setTileScale(p.h / src.height);
      if (p.alpha !== undefined) t.setAlpha(p.alpha);
      if (p.tint !== undefined) t.setTint(p.tint);
      return;
    }
    const img = this.add.image(p.x, p.y, key).setOrigin(0, 0).setDepth(p.depth).setScrollFactor(p.parallax, pY);
    img.setDisplaySize(p.w, p.h);
    if (p.alpha !== undefined) img.setAlpha(p.alpha);
    if (p.tint !== undefined) img.setTint(p.tint);
  }

  private buildBackdrop(): void {
    if (this.comp !== null) {
      for (const piece of planLayers(this.comp, this.worldWpx, this.worldHpx, (s) => this.srcSize(s))) {
        this.placeLayerPiece(piece);
      }
      return;
    }
    this.buildBackdropLegacy();
  }

  /**
   * PK-R6 · H1 · THE AIR, placed (round-1 critique, findings 2 and 4).
   *
   * The static half: the haze that lifts the far shell away from the furniture,
   * and the beams that give the empty upper band something to hold. Both are
   * planned in air.ts and merely placed here — same contract as the planes and
   * the mass, so the composition gate can audit them without a browser.
   *
   * A phase that declares no air renders exactly as it did before (the fallback
   * law): nothing in this file may make an undeclared phase worse.
   */
  private buildAir(): void {
    const air = this.comp?.air;
    if (!air) return;
    const haze = planHaze(air, this.worldWpx, this.worldHpx);
    const g = this.add.graphics().setDepth(haze.depth).setScrollFactor(haze.parallax, haze.parallaxY);
    // top-down falloff, in two stops: strongest where the room is farthest from
    // the eye, gone by the time it reaches the floor the child stands on
    const half = haze.h / 2;
    g.fillGradientStyle(haze.colour, haze.colour, haze.colour, haze.colour, haze.alphaTop, haze.alphaTop, haze.alphaTop * 0.45, haze.alphaTop * 0.45);
    g.fillRect(haze.x, haze.y, haze.w, half);
    g.fillGradientStyle(haze.colour, haze.colour, haze.colour, haze.colour, haze.alphaTop * 0.45, haze.alphaTop * 0.45, 0, 0);
    g.fillRect(haze.x, haze.y + half, haze.w, haze.h - half);

    for (const shaft of planShafts(air, this.worldWpx, this.worldHpx)) {
      const beam = this.add.graphics().setDepth(shaft.depth).setScrollFactor(shaft.parallax, shaft.parallaxY);
      // a beam is drawn as three nested quads rather than one: light has a hot
      // core and soft sides, and a single flat polygon reads as a paper cut-out
      for (let i = 0; i < 3; i++) {
        const k = 1 - i / 3; // 1 = the narrow core, 0 = the outermost skirt
        const a = shaft.alphaTop * (0.34 + 0.66 * k * k);
        const [tl, tr, fr, fl] = shaft.points;
        if (!tl || !tr || !fr || !fl) break;
        const mid = (p: readonly [number, number], q: readonly [number, number]): [number, number] =>
          [p[0] + (q[0] - p[0]) * (0.5 - 0.5 * k), p[1] + (q[1] - p[1]) * (0.5 - 0.5 * k)];
        const a0 = mid(tl, tr);
        const a1 = mid(tr, tl);
        const b0 = mid(fl, fr);
        const b1 = mid(fr, fl);
        beam.fillStyle(shaft.colour, a);
        beam.fillPoints([
          new Phaser.Geom.Point(a0[0], a0[1]),
          new Phaser.Geom.Point(a1[0], a1[1]),
          new Phaser.Geom.Point(b1[0], b1[1]),
          new Phaser.Geom.Point(b0[0], b0[1]),
        ], true);
      }
    }
  }

  /** The pre-C1 backdrop: one far plate + two fixed bands. Kept as the
   *  fallback for any phase without a composition manifest. */
  private buildBackdropLegacy(): void {
    const skyG = this.add.graphics().setScrollFactor(0).setDepth(-12);
    skyG.fillGradientStyle(0xf9edd2, 0xf9edd2, 0xf3ddb0, 0xf3ddb0, 1);
    skyG.fillRect(-LOGICAL_W, -LOGICAL_H, LOGICAL_W * 3, LOGICAL_H * 3);

    // THE COVER LAW (doc 36 §3, PB-C1): a full-bleed piece is scaled to cover
    // the camera's TRAVEL BOX and anchored on the world floor. The pre-C1
    // version used (1 − parallax) and centred the image on the world, so on a
    // short level its left edge drifted right of the camera and the page
    // showed through — Build-D's F-6 (the p4 cream void). Fixed here too, so
    // the fallback path obeys the same law as the compositor.
    const plateCover = (img: Phaser.GameObjects.Image, sfX: number, sfY: number): void => {
      const box = coverFit({ w: img.width, h: img.height }, this.worldWpx, this.worldHpx, sfX, sfY);
      img.setOrigin(0, 0).setPosition(box.x, box.y).setDisplaySize(box.w, box.h);
    };
    const farStem = this.phase.plates.far && this.textures.exists(`pb-${this.phase.plates.far}`) ? `pb-${this.phase.plates.far}` : "pb-plate_far";
    if (this.textures.exists(farStem)) {
      const far = this.add.image(0, 0, farStem).setDepth(-11).setScrollFactor(0.12, 0.06);
      plateCover(far, 0.12, 0.06);
    }
    if (this.textures.exists("pb-plate_sky")) {
      const sky = this.add.image(0, 0, "pb-plate_sky").setDepth(-11.5).setScrollFactor(0.05, 0.02);
      plateCover(sky, 0.05, 0.02);
    }
    // W2: per-phase parallax bands — the phase names its own mid/near band
    // (grids-v2 sets plates.mid per phase); the fixed stems stay the fallback,
    // so a phase that names nothing renders exactly as before.
    const bandStem = (named: string | undefined, fixed: string): string | null => {
      if (named && this.textures.exists(`pb-${named}`)) return `pb-${named}`;
      return this.textures.exists(`pb-${fixed}`) ? `pb-${fixed}` : null;
    };
    const midStem = bandStem(this.phase.plates.mid, "strip_mid_loop");
    if (midStem !== null) {
      const src = this.textures.get(midStem).getSourceImage() as HTMLImageElement;
      const dispH = 86; // sits at the horizon; the far plate + sky stay visible above
      const mid = this.add
        .tileSprite(0, this.worldHpx - dispH - 34, this.worldWpx + LOGICAL_W * 2, dispH, midStem)
        .setOrigin(0, 0)
        .setDepth(-9)
        .setScrollFactor(0.5, 0.9)
        .setAlpha(0.92);
      mid.setTileScale(dispH / src.height);
      mid.x = -LOGICAL_W;
    }
    const nearStem = bandStem(this.phase.plates.near, "plate_near_loop");
    if (nearStem !== null) {
      const src = this.textures.get(nearStem).getSourceImage() as HTMLImageElement;
      const dh = 62;
      const near = this.add
        .tileSprite(-LOGICAL_W, this.worldHpx - dh - 22, this.worldWpx + LOGICAL_W * 2, dh, nearStem)
        .setOrigin(0, 0)
        .setDepth(0)
        .setAlpha(0.95)
        .setScrollFactor(0.8, 0.97);
      near.setTileScale(dh / src.height);
    }
  }

  /** The phase's mass kit — but ONLY if its core art actually loaded. A kit
   *  whose crust/body/fade/sediment are missing would place empty textures, so
   *  it falls back to the pre-C1 strips-over-fill path instead. */
  private massKit(): MassKit | null {
    const kit = this.comp?.mass;
    if (kit === undefined) return null;
    const core = [kit.crust[0], kit.body[0], kit.fade, kit.sediment];
    for (const stem of core) {
      if (stem === undefined || !this.textures.exists(`pb-${stem}`)) return null;
    }
    return kit;
  }

  /** Place one planned mass piece (doc 36 §2). */
  private placeMassPiece(p: MassPiece): void {
    if (p.stem === null) return; // fallbackFill — the graphics pass drew it
    const key = `pb-${p.stem}`;
    if (!this.textures.exists(key)) return; // only-present law
    if (p.tile === true) {
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      const scale = p.h / src.height;
      const t = this.add.tileSprite(p.x, p.y, p.w, p.h, key).setOrigin(0, 0).setDepth(p.depth);
      t.setTileScale(scale);
      // anchor the pattern in WORLD space so neighbouring runs stay seamless
      t.tilePositionX = p.x / scale;
      t.tilePositionY = p.y / scale;
      // …and lay this segment in its OWN light (the no-metronome law): a MULTIPLY
      // by a near-white, so the course changes value without changing material
      if (p.tint !== undefined && p.tint !== 0xffffff) t.setTint(p.tint);
      return;
    }
    const img = this.add.image(p.x, p.y, key).setOrigin(p.originX ?? 0, p.originY ?? 0).setDepth(p.depth);
    img.setDisplaySize(p.w, p.h);
    if (p.tint !== undefined && p.tint !== 0xffffff) img.setTint(p.tint);
    if (p.rot !== undefined) img.setRotation(p.rot);
  }

  private buildTerrain(): void {
    const kit = this.massKit();
    const fill = this.add.graphics().setDepth(1);
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    const CANOPY = 0x2e4d33;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        // with a kit present the carved mass owns every solid and every slope;
        // the graphics pass keeps only the hazard/one-way fallbacks below
        const isCanopy = kit === null && isSolid(g) && r <= 1; // the closed top (W0-F7)
        if (kit !== null && (isSolid(g) || isSlope(g))) continue;
        if (isCanopy) {
          fill.fillStyle(CANOPY);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
          if (!isSolid(glyphAt(this.grid, c, r + 1)) && !this.textures.exists("pb-canopy_fringe_loop")) {
            fill.fillCircle(c * TILE + 4, (r + 1) * TILE, 4); // fallback fringe
            fill.fillCircle(c * TILE + 11, (r + 1) * TILE + 2, 5);
          }
        } else if (isSolid(g)) {
          fill.fillStyle(g === "~" ? ICE : isSolid(glyphAt(this.grid, c, r - 1)) ? EARTH_DARK : EARTH);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
        } else if (g === "=") {
          if (!this.textures.exists("pb-plank_loop")) {
            fill.fillStyle(0xc9a36a);
            fill.fillRoundedRect(c * TILE, r * TILE + 1, TILE, 5, 2);
          }
        } else if (g === "^") {
          if (!this.textures.exists("pb-spikes_nibs_loop")) {
            fill.fillStyle(INK);
            fill.fillTriangle(c * TILE + 1, (r + 1) * TILE, c * TILE + 8, r * TILE + 4, c * TILE + 15, (r + 1) * TILE);
          }
        } else if (g === "w") {
          fill.fillStyle(0x2c3a58, 0.92);
          fill.fillRect(c * TILE, r * TILE + 3, TILE, TILE - 3);
          fill.fillStyle(0x51689a);
          fill.fillRect(c * TILE, r * TILE + 3, TILE, 2);
        } else if (isSlope(g)) {
          fill.fillStyle(EARTH);
          const x = c * TILE;
          const y = r * TILE;
          if (g === "/") fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y);
          // D1: `z` is the slippery slide — same 45°-down wedge as `\`
          else if (g === "\\" || g === "z") fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE);
          else if (g === "1") fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y + TILE / 2);
          else if (g === "2") { fill.fillTriangle(x, y + TILE, x + TILE, y + TILE, x + TILE, y); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "3") { fill.fillTriangle(x, y, x, y + TILE, x + TILE, y + TILE); fill.fillRect(x, y + TILE / 2, TILE, TILE / 2); }
          else if (g === "4") fill.fillTriangle(x, y + TILE / 2, x, y + TILE, x + TILE, y + TILE);
          fill.lineStyle(2, GRASS);
          if (g === "/") fill.lineBetween(x, y + TILE, x + TILE, y);
          if (g === "\\" || g === "z") fill.lineBetween(x, y, x + TILE, y + TILE);
          // AA2: the painted bank wedge sits over the fill (30° pairs draw
          // once at their first tile, spanning both)
          const slopeStem = g === "/" ? "slope45_up" : g === "\\" || g === "z" ? "slope45_down" : g === "1" ? "slope30_up" : g === "3" ? "slope30_down" : null;
          if (slopeStem !== null && this.textures.exists(`pb-${slopeStem}`)) {
            const wpx = g === "1" || g === "3" ? TILE * 2 : TILE;
            this.add.image(x, y - 2, `pb-${slopeStem}`).setOrigin(0, 0).setDisplaySize(wpx, TILE + 2).setDepth(2);
          }
        }
      }
    }

    // AA2 run-based dressing: canopy fringe, planks, spikes, pool, pit soil
    const runs = (pred: (c: number, r: number) => boolean, draw: (c0: number, c1: number, r: number) => void): void => {
      for (let r = 0; r < h; r++) {
        let c = 0;
        while (c < w) {
          if (!pred(c, r)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && pred(c1 + 1, r)) c1++;
          draw(c, c1, r);
          c = c1 + 1;
        }
      }
    };
    const srcH = (stem: string): number => (this.textures.get(`pb-${stem}`).getSourceImage() as HTMLImageElement).height;
    if (this.textures.exists("pb-canopy_fringe_loop")) {
      const dh = 26;
      const ts = dh / srcH("canopy_fringe_loop");
      runs(
        (c, r) => r <= 1 && isSolid(glyphAt(this.grid, c, r)) && !isSolid(glyphAt(this.grid, c, r + 1)),
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, (r + 1) * TILE - 4, (c1 - c0 + 1) * TILE, dh, "pb-canopy_fringe_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts); },
      );
    }
    if (this.textures.exists("pb-plank_loop")) {
      const dh = 9;
      const ts = dh / srcH("plank_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "=",
        (c0, c1, r) => {
          this.add.tileSprite(c0 * TILE, r * TILE - 2, (c1 - c0 + 1) * TILE, dh, "pb-plank_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts);
          if (this.textures.exists("pb-plank_cap_l")) this.add.image(c0 * TILE + 1, r * TILE - 2, "pb-plank_cap_l").setOrigin(1, 0).setScale(ts).setDepth(2);
          if (this.textures.exists("pb-plank_cap_r")) this.add.image((c1 + 1) * TILE - 1, r * TILE - 2, "pb-plank_cap_r").setOrigin(0, 0).setScale(ts).setDepth(2);
        },
      );
    }
    if (this.textures.exists("pb-spikes_nibs_loop")) {
      const dh = 15;
      const ts = dh / srcH("spikes_nibs_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "^",
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, (r + 1) * TILE - dh, (c1 - c0 + 1) * TILE, dh, "pb-spikes_nibs_loop").setOrigin(0, 0).setDepth(3).setTileScale(ts); },
      );
    }
    if (this.textures.exists("pb-pool_ink_loop")) {
      const dh = 16;
      const ts = dh / srcH("pool_ink_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "w" && glyphAt(this.grid, c, r - 1) !== "w",
        (c0, c1, r) => { this.add.tileSprite(c0 * TILE, r * TILE, (c1 - c0 + 1) * TILE, dh, "pb-pool_ink_loop").setOrigin(0, 0).setDepth(3).setTileScale(ts); },
      );
    }
    // the interior fill + the surface strips are the RETIRED model — with a
    // kit present the carved mass draws body/fade/sediment and crust instead
    if (kit === null && this.textures.exists("pb-pit_inner_tile")) {
      const scale = 0.055; // ~56px world pattern from the 1024 source
      runs(
        (c, r) => r > 1 && isSolid(glyphAt(this.grid, c, r)) && isSolid(glyphAt(this.grid, c, r - 1)) && glyphAt(this.grid, c, r) !== "~",
        (c0, c1, r) => {
          const t = this.add.tileSprite(c0 * TILE, r * TILE, (c1 - c0 + 1) * TILE, TILE, "pb-pit_inner_tile").setOrigin(0, 0).setDepth(1).setTileScale(scale);
          t.tilePositionX = (c0 * TILE) / scale;
          t.tilePositionY = (r * TILE) / scale;
        },
      );
    }

    // painted strips along every exposed surface run (strips-over-tiles)
    if (kit === null && this.textures.exists("pb-strip_ground_loop")) {
      const src = this.textures.get("pb-strip_ground_loop").getSourceImage() as HTMLImageElement;
      const dispH = 30;
      const tileScale = dispH / src.height;
      for (let r = 0; r < h; r++) {
        let c = 0;
        while (c < w) {
          const surface = (cc: number): boolean => {
            if (r <= 2) return false; // canopy rows carry fringe, never ground strips
            const g = glyphAt(this.grid, cc, r);
            if (!isSolid(g) || g === "~") return false;
            // R6: a lip under a near ceiling reads as a double strip — suppress
            for (let k = 1; k <= 3; k++) if (isSolid(glyphAt(this.grid, cc, r - k))) return false;
            return !isSlope(glyphAt(this.grid, cc, r - 1));
          };
          if (!surface(c)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && surface(c1 + 1)) c1++;
          const runW = (c1 - c + 1) * TILE;
          this.add
            .tileSprite(c * TILE, r * TILE - 7, runW, dispH, "pb-strip_ground_loop")
            .setOrigin(0, 0)
            .setDepth(2)
            .setTileScale(tileScale);
          if (this.textures.exists("pb-strip_cap_l") && c > 0) {
            this.add.image(c * TILE + 2, r * TILE - 7, "pb-strip_cap_l").setOrigin(1, 0).setScale(tileScale).setDepth(2);
          }
          if (this.textures.exists("pb-strip_cap_r") && c1 < w - 1) {
            this.add.image((c1 + 1) * TILE - 2, r * TILE - 7, "pb-strip_cap_r").setOrigin(0, 0).setScale(tileScale).setDepth(2);
          }
          c = c1 + 1;
        }
      }
    }
    if (this.textures.exists("pb-strip_ice_loop")) {
      const src = this.textures.get("pb-strip_ice_loop").getSourceImage() as HTMLImageElement;
      const dispH = 30;
      const ts = dispH / src.height;
      for (let r = 3; r < h; r++) {
        let c = 0;
        // A-6 (pre-C1): the `z` slide wore the same blackboard art as a flat
        // `~` run. With a kit the slide is its OWN object (mass.ts, doc 36 §2),
        // so `z` leaves this path entirely.
        const icy = (cc: number): boolean => {
          const g = glyphAt(this.grid, cc, r);
          return (g === "~" || (kit === null && g === "z")) && !isSolid(glyphAt(this.grid, cc, r - 1));
        };
        while (c < w) {
          if (!icy(c)) { c++; continue; }
          let c1 = c;
          while (c1 + 1 < w && icy(c1 + 1)) c1++;
          this.add.tileSprite(c * TILE, r * TILE - 7, (c1 - c + 1) * TILE, dispH, "pb-strip_ice_loop").setOrigin(0, 0).setDepth(2).setTileScale(ts);
          c = c1 + 1;
        }
      }
    }

    // ── the carved mass (doc 36 §2) — crust + caps + trims + corners + body
    // + fade + sediment, ramps, the slide, and complete platform objects ─────
    if (kit !== null) {
      for (const piece of planMass(this.grid, kit)) this.placeMassPiece(piece);
      this.buildGrain();
    }
  }

  /**
   * PK-R6 · H1 · THE GRAIN ON THE WALK COURSE (round-1 critique, finding 1).
   *
   * Scuffs and shine along the floor, at intervals that owe the tile nothing —
   * the ingredient that actually stops the eye locking onto the loop, because
   * every other variation in the course is still a multiple of the course.
   * Placed once at build time onto ONE Graphics: it never changes, and a static
   * canvas is cheaper than several hundred sprites.
   */
  private buildGrain(): void {
    const claimed = claimedPlatformCells(this.grid);
    const draw = (marks: readonly SurfaceMark[], depth: number, round: number): void => {
      if (marks.length === 0) return;
      const g = this.add.graphics().setDepth(depth);
      for (const m of marks) {
        g.fillStyle(m.kind === "shine" ? GRAIN_SHINE : GRAIN_SCUFF, m.alpha);
        // rounded, because a hard rectangle on a painted floor reads as a sticker
        g.fillRoundedRect(m.x, m.y, m.w, m.h, Math.min(m.h / 2, round));
      }
    };
    draw(crustGrain(this.grid, claimed), CRUST_MARK_DEPTH, 1.2);
    // …and the patina on the mass below it, which is the surface the round-1
    // browser proof showed was still tiling: broader marks, far fainter, and
    // softly rounded so they read as damp and wear rather than as marks
    draw(massGrain(this.grid, claimed), MASS_MARK_DEPTH, 6);
    // PK-R6 · H2 · …and the WEAR AT EVERY DROP (round-2 finding 5): the same two
    // colours again, but placed where the floor is about to run out, so the edge
    // announces itself a stride before the child reaches it. Drawn a hair above
    // the ordinary grain — a warning that a random scuff can paint over is not a
    // warning.
    draw(ledgeGrain(this.grid, claimed), CRUST_MARK_DEPTH + 0.02, 1.2);
  }

  /** World-px size of a drawn trail letter (matches the retired `prop_letter`). */
  private static readonly LETTER_PX = 14;

  /**
   * PB-C1 · a texture per CHARACTER, drawn in the painted stem's own key
   * (warm gold gradient, amber contour, soft shadow). `prop_letter` is a
   * painted capital A, so it can only ever spell A — it is retired from the
   * letter face and the engine draws the real glyph instead (doc 36 §3).
   */
  /** PB-F3 · THE READABILITY PASS (F2-6 · F2-8/16 · F2-31). Three things a
   *  six-year-old must be able to SEE, all drawn from state the sim already
   *  owns — no new art, no gameplay change:
   *  · the checkpoint you have actually reached is the LIT Krakel, the others
   *    are the waiting one, so „Krakel skizziert dich!" has a picture;
   *  · trail letters breathe and glint, because a static gold glyph on a warm
   *    wall reads as wallpaper (his „I felt I collected all", F2-31);
   *  · a cage you can open NOW rocks when you come close — the fist has a
   *    target, instead of scenery you walk past (F2-8/16). */
  private renderReadability(): void {
    const t = this.tickCount;
    // ── the active checkpoint ──
    const activeCol = this.sim.respawnCell?.c;
    if (this.checkpointImgs.size > 0 && this.textures.exists("pb-krakel_active")) {
      for (const [col, img] of this.checkpointImgs) {
        const lit = Number(col) === activeCol;
        const want = lit ? "pb-krakel_active" : "pb-krakel_a";
        if (img.texture.key !== want) {
          const h = img.displayHeight;
          img.setTexture(want);
          img.setScale(h / (img.frame.height || 1));
        }
        // the lit one breathes; the waiting ones sit still
        img.setAlpha(lit && !this.cfg.reducedMotion ? 0.92 + Math.sin(t / 14) * 0.08 : 1);
      }
    }
    // ── the letters ──
    // R3-16 · the magnet lives in the SIM, so the letter is DRAWN wherever the
    // sim says it is — the drift and the pickup are the same number. The bob and
    // glint ride on top of that place, never instead of it.
    for (const [key, img] of this.letterImgs) {
      const p = this.sim.letterPos.get(key);
      if (!p) continue;
      const parts = key.split(",");
      const phase = (Number(parts[0]) + Number(parts[1])) * 0.7; // per-letter offset
      img.x = fromSubs(p.x);
      img.y = fromSubs(p.y) + (this.cfg.reducedMotion ? 0 : Math.sin(t / 18 + phase) * 1.6);
      const glint = this.cfg.reducedMotion ? 1 : 0.9 + Math.abs(Math.sin(t / 26 + phase)) * 0.1;
      img.setScale((PaintScene.LETTER_PX / (img.frame.width || 1)) * glint);
    }
    // ── the cages that can be opened NOW ──
    // PK-R6 · H1 · SOMETHING IS IN THERE (round-1 critique, finding 4: „a player
    // has no way to recognize this shape as ‚something caged is here'").
    //
    // The rock was gated on the FIST — and stage C2 made ↑ the verb that opens a
    // cage precisely because ch01 grants no fist. So the one telegraph the
    // chapter's one mandatory cage had was unreachable in the chapter that needs
    // it: a child walked up to the thing holding their classmate and it sat
    // there like scenery. The gate is now the same question the cue and the sim
    // ask (ENGAGEABLE_ROLES: a press opens a cage in every chapter, granted fist
    // or not), so the picture and the mechanic agree by construction.
    if (!this.cfg.reducedMotion) {
      for (const e of this.world?.entities ?? []) {
        if (e.role !== "cage" || e.redeemed || e.hidden) continue;
        const img = this.entityImgs.get(e.id);
        if (!img) continue;
        const near = Math.abs(fromSubs(e.x) - fromSubs(this.player.x)) < 42 && Math.abs(fromSubs(e.y) - fromSubs(this.player.y)) < 40;
        // …and it BREATHES even out of reach, because „someone is in here" is a
        // fact about the cage, not about where the child is standing. Small
        // enough to read as a captive shifting, and it settles the moment the
        // cage is opened (the loop skips a redeemed one, so its rotation is left
        // exactly where the burst put it: still).
        img.setRotation(near ? Math.sin(t / 5) * 0.07 : Math.sin(t / 26) * 0.022);
      }
    }
  }

  /**
   * PK-R6 · H1 · THE CONTACT ELLIPSE. The cast shadow gives the hero an edge
   * against the wall; this gives him WEIGHT on the floor. Without it the boy and
   * his shadow both float, which is the same „is he standing on that?" question
   * the value critique was really asking.
   *
   * Drawn only while he is on something: a shadow under a boy in mid-air would
   * have to be cast on a floor this renderer has not looked for, and inventing
   * one is how a platformer starts lying about where the ground is.
   */
  private renderContact(): void {
    this.groundG.clear();
    if (!this.player.grounded) return;
    const x = fromSubs(this.player.x);
    const y = fromSubs(this.player.y);
    // it spreads with the landing squash and pulls in as he settles — one more
    // read on „he just hit the floor" for a child who missed the six-tick pose
    const spread = this.player.landedAgo < RIG.landStanceTicks ? 1 + 0.5 * (1 - this.player.landedAgo / RIG.landStanceTicks) : 1;
    this.groundG.fillStyle(HERO_SHADOW_TINT, 0.34);
    this.groundG.fillEllipse(x, y - 1, 18 * spread, 5);
    this.renderImpact(x, y);
  }

  /**
   * PK-R6 · H2 · THE IMPACT MARK (round-2 finding 1: „no dust ring or impact
   * mark under the feet").
   *
   * H1 answered the same complaint with `puff()` — five tweened circles that
   * live 260 ms — and round 2 still found nothing, which is the lesson: a
   * TWEEN-owned effect exists on the wall clock, so whether it is in a given
   * frame is luck. This one is a pure function of `landedAgo` and the remembered
   * hardness, so every frame of the absorb window draws it, a replayed tape
   * draws it identically, and a screenshot cannot miss it. Doc 44 B14: code-
   * built effects are first-class.
   *
   * Three ingredients, all falling out of the same clock: a ring opening away
   * from the feet, a low skirt of dust sitting on the floor line, and a scuff
   * pressed into the boards directly under him. Reduced motion keeps the scuff
   * and the skirt — they are a finished picture of a landing — and drops the
   * expanding ring, which depicts nothing but motion.
   */
  private renderImpact(x: number, y: number): void {
    const ago = this.player.landedAgo;
    if (ago >= IMPACT_MARK_TICKS || this.landHardness <= 0) return;
    const t = ago / IMPACT_MARK_TICKS; // 0 at contact → 1 as it clears
    const k = 1 - t;
    const hard = this.landHardness;
    // the scuff: a dark smear pressed into the floor, widest under the feet
    this.groundG.fillStyle(IMPACT_SCUFF, 0.3 * k * hard);
    this.groundG.fillEllipse(x, y - 0.5, 16 * (0.6 + 0.6 * hard), 2.6);
    // the skirt: dust that has not lifted yet, lying low and wide
    for (let i = -1; i <= 1; i += 2) {
      const d = 5 + 9 * t * (0.5 + hard);
      this.groundG.fillStyle(IMPACT_DUST, 0.5 * k * k * hard);
      this.groundG.fillEllipse(x + i * d, y - 2 - 2 * t, 9 - 4 * t, 5 - 2 * t);
    }
    if (this.cfg.reducedMotion) return;
    // the ring: chalk thrown outward, opening and thinning as it goes
    const r = 6 + 16 * t * (0.6 + 0.4 * hard);
    this.groundG.lineStyle(1.4 * k + 0.3, IMPACT_DUST, 0.75 * k * hard);
    this.groundG.strokeEllipse(x, y - 2, r * 2, r * 0.72);
  }

  /**
   * PK-R6 · H1 · HOW HARD THE MAGNET IS PULLING, 0…1 (round-1 critique,
   * finding 5) — the nearest letter inside the field, measured against the field
   * itself, so the reach grows as the letter closes. Read off the SIM's own
   * positions, which are the positions the letter is actually drawn at, so the
   * gesture can never point somewhere the letter is not.
   */
  private reachT(): number {
    if (this.letterImgs.size === 0) return 0;
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y) - COLLECT_ANCHOR_PX;
    let best = 0;
    for (const key of this.letterImgs.keys()) {
      const p = this.sim.letterPos.get(key);
      if (!p) continue;
      const d = Math.hypot(px - fromSubs(p.x), py - fromSubs(p.y));
      if (d >= MAGNET_FIELD_PX) continue;
      best = Math.max(best, 1 - d / MAGNET_FIELD_PX);
    }
    return best;
  }

  /**
   * PK-R6 · H1 · THE PULL STREAK. „The collectible letter sits static beside the
   * player with no streak, trail, glow-pull or reaching animation connecting it
   * to the character — the mechanic the filename promises is illegible from the
   * image." So a letter the magnet has hold of now trails a comet tail.
   *
   * The tail is drawn along the PULL DIRECTION rather than along the path the
   * letter has actually flown, and that is a deliberate choice: the field is only
   * 1.6 tiles wide and the sim closes 22 % of the gap every tick, so a letter's
   * whole journey is a handful of pixels — a historical tail would be shorter
   * than the glyph sitting on top of it and would be invisible in exactly the
   * still frame the critique was reading. The direction is what the child needs
   * („that one is coming to ME"), and the direction is honest: it is the vector
   * the sim itself moves the letter along this tick.
   *
   * Every number comes from sim state on a numbered tick, so a replayed tape
   * draws the same streaks; and it fades in with the pull, so a letter still
   * sitting in its cell draws nothing at all.
   */
  private renderPull(): void {
    this.pullG.clear();
    if (this.cfg.reducedMotion) return; // it depicts nothing but motion (the end-states law)
    const px = fromSubs(this.player.x);
    const py = fromSubs(this.player.y) - COLLECT_ANCHOR_PX;
    for (const key of this.letterImgs.keys()) {
      const p = this.sim.letterPos.get(key);
      if (!p) continue;
      const lx = fromSubs(p.x);
      const ly = fromSubs(p.y);
      const gap = Math.hypot(px - lx, py - ly);
      if (gap >= MAGNET_FIELD_PX || gap < 1) continue;
      const t = 1 - gap / MAGNET_FIELD_PX; // 0 at the field's rim, 1 in his hands
      const ux = (lx - px) / gap; // the way it CAME, i.e. where the tail lies
      const uy = (ly - py) / gap;
      for (let i = 1; i <= PULL_TRAIL_POINTS; i++) {
        const k = i / PULL_TRAIL_POINTS; // 0 at the letter → 1 at the tail's end
        const d = 2 + k * PULL_TAIL_PX;
        const x = lx + ux * d;
        const y = ly + uy * d;
        const r = 2.8 * (1 - k) + 0.5;
        // Each wisp is the letter's own two colours, contour under fill. The
        // amber is not decoration: a gold streak alone vanished into p1's honey
        // wall in the very frame this cue exists for, and the book also has to
        // play this in a night classroom and an ink dream — one dark edge plus
        // one bright core reads on all three without a per-phase palette.
        this.pullG.fillStyle(PULL_EDGE, 0.6 * t * (1 - k));
        this.pullG.fillCircle(x, y, r + 0.9);
        this.pullG.fillStyle(PULL_COLOUR, 0.85 * t * (1 - k) * (1 - k));
        this.pullG.fillCircle(x, y, r);
      }
    }
  }

  /**
   * PK-R6 · H1 · THE AIR, per frame (round-1 critique, findings 2, 4 and 5).
   *
   * The two ingredients that cannot be placed once: the motes, which drift, and
   * the vignette, which is drawn in the CAMERA's rect and therefore moves with
   * it. Everything else about the air was placed in `buildAir`.
   *
   * Under reduced motion the motes are drawn at tick 0 rather than dropped — the
   * end-states law (doc 44 §3.1.8): the base state of an animation is its
   * finished state, and dust hanging in a shaft of light is a complete picture.
   */
  private renderAir(): void {
    this.moteG.clear();
    this.vignetteG.clear();
    const air = this.comp?.air;
    if (!air) return;
    const tick = this.cfg.reducedMotion ? 0 : this.tickCount;
    for (const m of planMotes(air, this.worldWpx, this.worldHpx, tick)) {
      this.moteG.fillStyle(m.colour, m.alpha);
      this.moteG.fillCircle(m.x, m.y, m.r);
    }
    // the room's own shadow closing the frame. Its colour is a near-black
    // carrying a little of this room's wash, so the hall closes in honey-dark
    // and the ink dream in blue-black — one device, five rooms.
    const deep = this.comp?.wash.colors[2] ?? this.comp?.wash.colors[1] ?? 0x000000;
    const colour = mixRGB(0x1a1626, deep, 0.3);
    const camX = fromSubs(this.camX);
    const camY = fromSubs(this.camY);
    for (const b of vignetteBands(camX, camY, air.vignette)) {
      const a = b.alpha;
      const [tl, tr, bl, br] =
        b.edge === "top" ? [a, a, 0, 0]
        : b.edge === "bottom" ? [0, 0, a, a]
        : b.edge === "left" ? [a, 0, a, 0]
        : [0, a, 0, a];
      this.vignetteG.fillGradientStyle(colour, colour, colour, colour, tl, tr, bl, br);
      this.vignetteG.fillRect(b.x, b.y, b.w, b.h);
    }
  }

  /**
   * PK-R6 · H1 · THE HOSTILE TELL (round-1 critique, finding 3) — the halo half.
   *
   * One soft, room-coloured halo behind every hostile that has not been freed
   * yet: ink behind a being in a bright room, chalk behind one in a dark room,
   * because separation is a VALUE question and the phase already declares its
   * own value in its key. It breathes a little, which is what makes „hazard"
   * read faster than „scenery" — but only a fifth of it breathes, so a still
   * frame (and reduced motion) still shows a being with an edge.
   *
   * It ends the moment the being is freed: at that point the child has named it,
   * its colour is coming back, and it is not a threat any more. The cast shadow
   * in `renderEntities` stays — that one is light, not warning.
   */
  private renderHostiles(): void {
    this.hostileG.clear();
    const colour = (this.comp?.key ?? 88) >= HOSTILE_HALO_KEY_SPLIT ? HOSTILE_HALO_DARK : HOSTILE_HALO_LIGHT;
    for (const e of this.world?.entities ?? []) {
      if (!JOY_ROLES.has(e.role) || e.redeemed || e.hidden) continue;
      const img = this.entityImgs.get(e.id);
      if (!img || !img.visible) continue;
      const cx = img.x;
      const cy = img.y - img.displayHeight * 0.5;
      const r0 = Math.max(img.displayWidth, img.displayHeight) * 0.44;
      // the beat's offset is the being's NAME, not its position: keying it to
      // e.x would re-seed the phase every tick (x moves in subs) and the breath
      // would come out as flicker
      const seed = e.id.length * 37 + (e.id.charCodeAt(0) | 0) * 7 + (e.id.charCodeAt(e.id.length - 1) | 0);
      const beat = this.cfg.reducedMotion
        ? 1
        : 1 - HOSTILE_HALO_PULSE + HOSTILE_HALO_PULSE * (0.5 + 0.5 * Math.sin(this.tickCount / 13 + hash01(seed) * Math.PI * 2));
      for (let i = 0; i < HOSTILE_HALO_RINGS; i++) {
        const k = 1 - i / HOSTILE_HALO_RINGS; // 1 at the core, 0 at the rim
        const spread = 1 + (HOSTILE_HALO_SPREAD - 1) * (i / Math.max(HOSTILE_HALO_RINGS - 1, 1));
        this.hostileG.fillStyle(colour, HOSTILE_HALO_ALPHA * k * k * beat);
        this.hostileG.fillCircle(cx, cy, r0 * spread);
      }
    }
  }

  /**
   * PK-R6 · H1 · THE PICKUP SHIMMER (round-1 critique, finding 6).
   *
   * „Letters 'S' and 'C' float directly among the gold book-stack platforms in
   * the same warm gold tone." Colour cannot separate them — both are gold and
   * both are right — so the separation is made in a channel no platform in this
   * book uses: a halo of light around the glyph, with four sparks turning slowly
   * around it. Nothing you can stand on shimmers.
   *
   * Drawn UNDER the letters (depth 3.9 against their 4), so the glyph stays the
   * sharpest thing in its own halo, and clipped to the letters the sim still
   * says are there — a collected letter leaves the map, so its shimmer leaves
   * with it in the same frame.
   */
  private renderLetterFx(): void {
    this.letterFxG.clear();
    if (this.letterImgs.size === 0) return;
    const t = this.cfg.reducedMotion ? 0 : this.tickCount;
    for (const [key, img] of this.letterImgs) {
      if (!img.visible) continue;
      const parts = key.split(",");
      const phase = (Number(parts[0]) + Number(parts[1])) * 0.7; // the bob's own offset
      const swell = 0.86 + 0.14 * (0.5 + 0.5 * Math.sin(t / 21 + phase));
      // ── PK-R6 · H2 · THE CONTACT SHADOW (round-2 finding 8) ────────────────
      // The hero got one in H1 for exactly this reason: a thing that casts
      // nothing is a thing lying on the glass in front of the picture. The
      // letter throws a soft ellipse onto the first surface below it, tighter
      // and darker the closer it hovers — and nothing at all once that surface
      // is out of reach, because a shadow invented for a floor nobody can see
      // is the lie the hero's own shadow was careful not to tell.
      // …measured under where the letter IS, not where it was placed: the magnet
      // flies it across cells, and a shadow anchored to its birth column would
      // slide off the thing it is supposed to be lying on
      const surfaceY = this.standLineBelow(Math.floor(img.x / TILE), Math.floor(img.y / TILE));
      const drop = surfaceY - img.y;
      if (drop > 1 && drop < LETTER_SHADOW_REACH_PX) {
        const near = 1 - drop / LETTER_SHADOW_REACH_PX;
        this.letterFxG.fillStyle(LETTER_SHADOW_TINT, 0.06 + 0.16 * near);
        this.letterFxG.fillEllipse(img.x, surfaceY - 1, 7 + 6 * (1 - near), 2.4 + 1.4 * (1 - near));
      }
      for (let i = 0; i < LETTER_HALO_RINGS; i++) {
        const k = 1 - i / LETTER_HALO_RINGS;
        this.letterFxG.fillStyle(LETTER_HALO_COLOUR, LETTER_HALO_ALPHA * k * k * swell);
        this.letterFxG.fillCircle(img.x, img.y, LETTER_HALO_R * (0.42 + 0.58 * (i / Math.max(LETTER_HALO_RINGS - 1, 1))) * swell);
      }
      for (let i = 0; i < LETTER_SPARKS; i++) {
        const ang = (i / LETTER_SPARKS) * Math.PI * 2 + t / 46 + phase;
        const d = LETTER_HALO_R * 0.92;
        this.letterFxG.fillStyle(LETTER_HALO_COLOUR, 0.55 * swell);
        this.letterFxG.fillCircle(img.x + Math.cos(ang) * d, img.y + Math.sin(ang) * d * 0.8, 0.85);
      }
    }
  }

  private letterTex(char: string): string {
    const key = `pb-glyph-${char}`;
    if (this.textures.exists(key)) return key;
    const S = 128;
    const tex = this.textures.createCanvas(key, S, S);
    if (!tex) return this.tex("prop_letter"); // headless/canvas-less safety
    const ctx = tex.getContext();
    ctx.clearRect(0, 0, S, S);
    ctx.font = LETTER_STYLE.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = LETTER_STYLE.shadow;
    ctx.shadowBlur = 7;
    ctx.shadowOffsetY = 4;
    ctx.lineJoin = "round";
    ctx.lineWidth = LETTER_STYLE.strokeWidth * 2;
    ctx.strokeStyle = LETTER_STYLE.stroke;
    ctx.strokeText(char, S / 2, S / 2 + 3);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    const grad = ctx.createLinearGradient(0, S * 0.18, 0, S * 0.86);
    grad.addColorStop(0, LETTER_STYLE.fill);
    grad.addColorStop(1, LETTER_STYLE.fillDeep);
    ctx.fillStyle = grad;
    ctx.fillText(char, S / 2, S / 2 + 3);
    // ── PK-R6 · H2 · THE PAPER UNDER THE GOLD (round-2 finding 8) ────────────
    // „The gold letters have a smooth vector-embossed look, unlike the visible
    // canvas/brush texture on the towels and wall behind them." True, and it is
    // the one thing an engine-drawn glyph gets wrong for free: a gradient is
    // perfectly smooth and nothing else in this book is. The tooth of the page
    // is stamped INTO the glyph (`source-atop` clips it to the letter, so no
    // halo appears around it) from a hash of the character and the speck index —
    // repo law, no `Math.random`: the same letter draws the same paper twice.
    ctx.globalCompositeOperation = "source-atop";
    const seed = char.charCodeAt(0);
    for (let i = 0; i < LETTER_GRAIN_SPECKS; i++) {
      const hx = hash01(seed * 977 + i * 31);
      const hy = hash01(seed * 613 + i * 71 + 5);
      const hv = hash01(seed * 251 + i * 17 + 9);
      const r = 0.9 + hv * 2.6;
      // half the specks are the paper showing through, half are gold sitting
      // in its dents — a tooth has both, and only having one reads as dirt
      ctx.fillStyle = hv < 0.5 ? `rgba(255,246,214,${0.05 + hv * 0.16})` : `rgba(120,72,20,${0.04 + (hv - 0.5) * 0.18})`;
      ctx.beginPath();
      ctx.arc(hx * S, hy * S, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    tex.refresh();
    return key;
  }

  /**
   * The world-y a ground-standing prop rests on: the TOP of the first solid
   * cell at or below the marker, not the marker cell's own bottom edge.
   * PK-C2b: p3's second checkpoint is marked at row 18 with ground only at row
   * 22, so the easel hung three cells up in the air. Every other marker in
   * ch01 sits directly on its surface, so this is behaviour-neutral for them —
   * it just stops the class from recurring whenever a marker drifts.
   */
  private standLineBelow(c: number, r: number): number {
    for (let k = r + 1; k < this.grid.length; k++) {
      if (isSolid(glyphAt(this.grid, c, k))) return k * TILE;
    }
    return (r + 1) * TILE;
  }

  private buildProps(): void {
    const h = this.grid.length;
    const w = this.grid[0]?.length ?? 0;
    const glyphs = new Map(letterGlyphs(this.grid, this.comp?.words).map((g) => [`${g.c},${g.r}`, g.char]));
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        const g = glyphAt(this.grid, c, r);
        const cx = c * TILE + TILE / 2;
        const cy = r * TILE + TILE / 2;
        if (g === "o") {
          const img = this.add.image(cx, cy, this.tex("prop_ring")).setDepth(3);
          img.setScale(15 / img.height);
          this.ringImgs.push({ img, baseY: cy }); // positions live in the Sim
        } else if (g === "*") {
          const char = glyphs.get(`${c},${r}`) ?? "A";
          const img = this.add.image(cx, cy, this.letterTex(char)).setDepth(4);
          img.setDisplaySize(PaintScene.LETTER_PX, PaintScene.LETTER_PX);
          img.setData("baseY", cy); // PB-F3: the rest line its bob returns to
          this.letterImgs.set(`${c},${r}`, img); // count lives in the Sim
        } else if (g === "X" || g === "B") {
          const img = this.add.image(cx, this.standLineBelow(c, r), this.tex("prop_exit")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(24 / img.height);
        } else if (g === "s") {
          const img = this.add.image(cx, this.standLineBelow(c, r), this.tex("prop_spring")).setOrigin(0.5, 1).setDepth(3);
          img.setScale(13 / img.height);
        } else if (g === "V") {
          const img = this.add.image(cx, cy, this.tex("prop_vine")).setDepth(3);
          img.setScale(TILE / img.height);
        } else if (g === "C") {
          // PB-F3 · F2-6: KRAKEL, not a nameless easel. `krakel_a` is the easel
          // WITH him standing beside it waving; `krakel_active` is the same
          // scene with his sketch lit warm gold. The game has always said
          // „Krakel skizziert dich!" — now the sentence has someone in it.
          const krakelStem = this.textures.exists("pb-krakel_a") ? "pb-krakel_a" : "pb-checkpoint_easel";
          if (this.textures.exists(krakelStem)) {
            const img = this.add.image(cx, this.standLineBelow(c, r), krakelStem).setOrigin(0.5, 1).setDepth(3);
            img.setScale(26 / img.height);
            this.checkpointImgs.set(`${c}`, img);
          } else if (this.textures.exists("pb-checkpoint_easel")) {
            const img = this.add.image(cx, this.standLineBelow(c, r), "pb-checkpoint_easel").setOrigin(0.5, 1).setDepth(3);
            img.setScale(24 / img.height);
          } else {
            const flag = this.add.graphics().setDepth(3);
            flag.fillStyle(0x8a6140).fillRect(cx - 1, cy - 10, 2, 26);
            flag.fillStyle(0xf0c040).fillTriangle(cx + 1, cy - 10, cx + 12, cy - 6, cx + 1, cy - 2);
          }
        }
      }
    }
    this.cfg.callbacks.onLetters(0, this.lettersTotal);
  }

  private buildRig(): void {
    // PK-R6 · H1 · THE VALUE ISLAND (round-1 critique, finding 3). Squinted down
    // to a thumbnail, the hall reduced to one flat pale-yellow wash with the boy
    // an almost invisible speck in it — no value zones, nothing for the eye to
    // land on. The reference frame the critique held us against separates its
    // hero the way painters do: he carries his own darker shape.
    //
    // So the rig is drawn TWICE — once inked near-black at low alpha and offset
    // down-and-back as a cast shadow, once as himself. That gives him a dark
    // edge against any wall, at any brightness, without repainting a single
    // background (which belongs to the composition lane, not this one), and it
    // costs no art: the shadow wears the same textures the same tick.
    this.rigShadow = this.add.container(0, 0).setDepth(9).setAlpha(HERO_SHADOW_ALPHA);
    this.groundG = this.add.graphics().setDepth(8);
    this.pullG = this.add.graphics().setDepth(9.5);
    this.rigRoot = this.add.container(0, 0).setDepth(10);
    for (const name of RIG_PART_ORDER) {
      const stem =
        name === "body" ? "body_idle"
        : name === "head" ? "head_neutral"
        : name === "hair" ? "hair_still"
        : name === "rotor" ? "rotor_a"
        : name.startsWith("hand") ? "hand_fist"
        : "shoe_neutral";
      // dossier: sprite-scale hands are ~half a head — 0.62× part scale
      const partScale = name.startsWith("hand") ? RIG_SRC_SCALE * 0.62 : RIG_SRC_SCALE;
      const shade = this.add.image(0, 0, this.tex(stem)).setScale(partScale).setTint(HERO_SHADOW_TINT);
      if (name === "handB") shade.setFlipX(true);
      if (name === "rotor") shade.setVisible(false);
      this.shadowParts.set(name, shade);
      this.rigShadow.add(shade);

      const img = this.add.image(0, 0, this.tex(stem)).setScale(partScale);
      if (name === "handB") img.setFlipX(true).setTint(0xd9cfc2); // the far hand sits a step darker — it welds to the body's light

      if (name === "rotor") img.setVisible(false);
      this.parts.set(name, img);
      this.rigRoot.add(img);
    }
  }

  /**
   * PK-R6 · H1 · THE PAINTED SPEECH BUBBLE (round-1 critique, finding 6:
   * „a plain vector rounded-rectangle with flat sans-serif text, breaking the
   * painted-world illusion").
   *
   * It was worse than the critic could see from a screenshot: this was a Phaser
   * `backgroundColor` — literally a filled rectangle behind a glyph run in
   * system-ui — sitting on top of gouache. Every „Danke!", „Autsch!" and „Husch!"
   * in the chapter wore it, which makes it the most-shown surface in the game.
   *
   * It is now drawn: a parchment bubble with an ink line that is not the same
   * weight all the way round, four corners that are each a different radius (a
   * painted bubble is never a rounded rectangle), a tail that points at whoever
   * is speaking, and the sheen the book's light leaves in every top-left. The
   * type is the book's display face — B19 binds the three-face system for the
   * overlay, and a word the WORLD speaks has no business being the one thing on
   * screen set in the operating system's font.
   */
  private toast(text: string): void {
    const x = fromSubs(this.player.x);
    const y = fromSubs(this.player.y) - 40;
    const label = this.add
      .text(0, 0, text, { fontFamily: displayFace(), fontSize: "10px", color: "#33291a" })
      .setOrigin(0.5, 0.5)
      .setResolution(RENDER_SCALE * 2);
    const w = Math.ceil(label.width) + 13;
    const h = Math.ceil(label.height) + 8;
    const top = -h - 5;
    const bottom = -5;
    label.setPosition(0, top + h / 2);

    const g = this.add.graphics();
    const radii = { tl: 7, tr: 4.5, bl: 4, br: 6.5 };
    g.fillStyle(PARCHMENT, 0.97);
    g.fillRoundedRect(-w / 2, top, w, h, radii);
    g.fillTriangle(-3.6, bottom - 1, 3.4, bottom - 1, 0.6, bottom + 6);
    g.lineStyle(1.2, INK_LINE, 0.92);
    g.strokeRoundedRect(-w / 2, top, w, h, radii);
    // the tail's own two edges, then the seam where the body's line crossed it
    g.lineBetween(-3.6, bottom - 0.5, 0.6, bottom + 6);
    g.lineBetween(0.6, bottom + 6, 3.4, bottom - 0.5);
    g.fillStyle(PARCHMENT, 1);
    g.fillRect(-3.1, bottom - 1.4, 6.2, 2);
    // the gouache sheen, top-left, where every painted surface in this book
    // catches the classroom's afternoon light
    g.lineStyle(1.3, 0xfffdf3, 0.7);
    g.lineBetween(-w / 2 + 4, top + 2.4, w / 2 - 7, top + 2.4);

    const bubble = this.add.container(x, y, [g, label]).setDepth(20);
    if (this.cfg.reducedMotion) {
      this.time.delayedCall(900, () => bubble.destroy());
      return;
    }
    bubble.setScale(0.7);
    bubble.setAlpha(0);
    this.tweens.add({ targets: bubble, scale: 1, alpha: 1, duration: 170, ease: "Back.easeOut" });
    this.tweens.add({
      targets: bubble, y: y - 5, alpha: 0, delay: 640, duration: 260, ease: "Quad.easeIn",
      onComplete: () => bubble.destroy(),
    });
  }
}
