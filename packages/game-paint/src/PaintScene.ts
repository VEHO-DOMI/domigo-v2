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
import { type CompositionSpec, type MassKit, ROOM_SHADOW_INK, compositionFor, heroEdgeFor, nearPlaneTint } from "./composition.ts";
import { phaseArtScope } from "./artScope.ts";
import { type LayerPiece, coverFit, planLayers } from "./layers.ts";
import { AIR_DEPTH, LIFE_PARALLAX, type AirPiece, planBandShade, planHaze, planLife, planMotes, planShafts, planSources, shaftQuads, vignetteBands } from "./air.ts";
import { NEAR_PLANE_KINDS, CRUST_MARK_DEPTH, MASS_MARK_DEPTH, type MassPiece, type SurfaceMark, claimedPlatformCells, crustGrain, hash01, ledgeGrain, massGrain, planMass, planPlatformShadows, tileAnchorFor, tileScaleFor } from "./mass.ts";
import { LETTER_STYLE, letterGlyphs } from "./letters.ts";
import { type PhraseSlot, bonusPhrase } from "./cards/ceremony.ts";
import { PICKUP_ROLES, type PaintLevel, type PhaseSpec } from "./level.ts";
import { type AirModel, LOGICAL_H, LOGICAL_W, MAX_TICKS_PER_FRAME, RENDER_SCALE, SUBS, TICK_MS, TILE, fromSubs, mixMultiply } from "./paint.ts";
import { INK_BODY, INK_CROWN_DARK, INK_CROWN_LIT, INK_DEPTH_ROWS, inkCrownPoints, inkDepthAt, inkDepthTint, inkScrollAt } from "./ink.ts";
import { type FistState } from "./fist.ts";
import { type Pad, type PlayerState } from "./player.ts";
import { CHALK_COLOURS, type EntityState, type EntityWorld, GUARDIAN_SCRIPT, JOY_ROLES, SHARD_TICKS, engageTargetId, telegraphTicksFor } from "./entities.ts";
import { COLLECT_ANCHOR_PX, MAGNET_FIELD_PX, Sim, type SimEvent, type TaskRequest } from "./sim.ts";
import { FOCUS_MS, focusView } from "./camera.ts";
import {
  AWAKEN_ROOM_MS, CAGE_AT_REST, CAGE_OPEN_TICKS, CELL_IS_DIRECTIONAL, type EntPoseInput, REST_SQUASH, RESTORE_SPARKLE_MS, WASHED_ROLES,
  awakenRoomBloom, awakenRoomSweep, bouncerSquash, cageBreath, cageNearT, entPoseCell, entSeed, floodBloomFor, greyLuma,
  guardianManoeuvre, guardianPitchRad, guardianRollScaleX, poseStateOf, washAlphaFor,
} from "./anim.ts";
import { CUE_CHALK, CUE_HALO, chalkArrow } from "./cue.ts";
import { RIG, rigPose, withCheer, withFistAway, withBrace } from "./rig.ts";
import {
  BURST_CORE, BURST_HOT, BURST_INK, BURST_SPIKES,
  SPARK_COUNT, burstShape, contactPoint, fleckOf, shardOutline, starPoints,
} from "./burst.ts";
import {
  HERO2_SRC_SCALE,
  heroFullCell,
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
 *  the v0 build's `this.burst?.explode(22, node.x, node.y)`, verbatim).
 *  PK-R6 · H2: the burst's arithmetic moved to `burst.ts` so it could be unit-
 *  tested; the constant is re-exported here so every existing import path is
 *  unchanged. */
export { SPARK_COUNT };

// ── PK-R6 · H2 · THE CONTACT FLASH LIGHTS THE HERO (round-2 findings 2 and 8) ─
/** „Separate the two characters' silhouettes with a rim-light so the collision
 *  pose stays legible even mid-merge." He already carries a cast-shadow copy of
 *  his own rig (HERO_SHADOW_*), so the rim costs no new object: for the length
 *  of the flash that copy is re-lit in the burst's own core colour and thrown to
 *  the FAR side of the impact, which is what a bright flash beside a boy
 *  actually does to his outline. */
export const CONTACT_RIM_TINT = 0xfff3c8;
export const CONTACT_RIM_ALPHA = 0.62;
/** How tall the boy is drawn, in world px — READ OFF the compositor rather than
 *  guessed: the rig root sits 15 px above his feet and his head part hangs at
 *  −14 from that, so the drawing runs from y−29 to his soles. The one place that
 *  number is needed is the touch point (burst.contactPoint), and a hero height
 *  invented for it would put the burst at the wrong height on every contact. */
export const HERO_DRAW_H = 30;
/** PK-R6 · H2 · how long the child's own celebration runs, in ms (round-2
 *  finding 4). Tied to the card's verdict beat rather than picked: the seal is
 *  stamped over VERDICT_MS and the two are one moment, so a cheer that ended
 *  first would leave a boy standing to attention under his own fanfare. */
export const CHEER_MS = 720;
/** How far the lit copy leans away from the impact, in px. SMALL: the light is
 *  a direction, not a displacement, and a bright copy shifted far enough to see
 *  as a shift is a second boy (measured — at 4 px his own hand drew twice). */
export const CONTACT_RIM_PX = 1.2;
/** How much bigger the lit copy is drawn. This, not the offset, is what makes
 *  the rim a rim: scaled up around the same centre it shows ONLY past his own
 *  silhouette, which is the outline the finding asks for. */
export const CONTACT_RIM_SWELL = 0.14;

// ── PK-R6 · H1 · THE HERO'S OWN SHADOW (round-1 critique, finding 3) ──────────
// PK-R6 · H2 (round-2 finding 1, CRITICAL): the numbers below are now the
// FALLBACK for a phase with no manifest. A phase that declares a key gets
// `heroEdgeFor(key)` instead — ink and thrown in a lit room, warm and hugging in
// a dark one, and in both cases SWOLLEN, so the copy shows past his silhouette
// on every side. The measurements and the reasoning are in composition.ts; the
// short version is that his value gap against p1's wall is 44 points and he
// still vanishes, because what a squint destroys is his MASS, not his colour.
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
// PK-R6 · H2 · …AND WHAT SHAPE THAT HALO IS (round-2 findings 10 and 11).
// „The gray halo behind the rabbit/bunny character is a crisp, perfectly circular
// disc with a visible flat edge, reading as a UI/VFX sprite stamped onto the
// painting rather than ambient light" — and, one finding later, „its head touches
// the underside of the book-stack legs of the floating bench above it, reading as
// one connected shape rather than hazard + platform."
//
// Both are the same object failing in both directions. Four concentric
// `fillCircle`s draw a hard-rimmed disc (nothing in this book is a circle) and a
// disc cannot separate a silhouette from a shape it overlaps, because it is not
// the silhouette's shape. The boss's halo hit exactly this in the same round and
// was answered by mirroring her own outline; the same answer serves here, and it
// costs no new object: every hostile has ALREADY carried a full sprite copy of
// itself since H1 (`hostileShadeImgs`, the cast shadow). That copy is now blown
// up around its own centre, so it shows past the being on every side — a rim in
// the shape of the thing it rims, which is what the ground enemy needed against
// the bench above it and what the moth needed instead of a bubble.
//
// The disc is gone. `HOSTILE_HALO_*` below is what remains of it: a colour split
// and a breath, now carried by the copy.
/** How far past its own outline the copy reaches. Small — this is separation,
 *  not a glow: at 22 px of moth that is a little over 1 px of rim. */
const HOSTILE_RIM_SPREAD = 1.14;
/** …and its cast-shadow lean, which the same copy still owes: a rim at full
 *  offset is a second creature, so the throw shrinks as the rim grows. */
const HOSTILE_RIM_DX = 1.4;
const HOSTILE_RIM_DY = 1.4;

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
/** How strongly the rim shows. Ink is laid flat over the wall and can afford to
 *  be read; chalk is ADDED into a dark room, where the same number would glow. */
const HOSTILE_RIM_ALPHA_INK = 0.52;
const HOSTILE_RIM_ALPHA_CHALK = 0.34;
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
  /** R5-A2: a letter CELL was consumed — the shell's ledger records it so a
   *  phase remount cannot respawn it. */
  onLetterTaken?: (c: number, r: number) => void;
  onTask: (req: TaskRequest) => void;
  onPowerup: (grants: string) => void;
  onCageFreed: (id: string, skin: string, classmate: string | undefined, freedCount: number) => void;
  onGuardianDown: (id: string, skin: string) => void;
  /** PB-F3 · F2-8: the first cage the fist can open, once per phase.
   *  R5-C1: with the id of the cage it fired at, so the card can name it. */
  onCageHint: (id: string) => void;
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
  /** R5-A2: the Kleckskammer round-trip — spawn override + surviving letter
   *  state (see SimCfg; the scene only forwards). */
  spawnCell?: { c: number; r: number };
  letterLedger?: () => { takenCells: readonly string[]; purse: number; found: number };
  /** R5-A6: draw the collision grid over the world (teacher door, ?grid=1). */
  debugGrid?: boolean;
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

/** PK-R6 · H2 (round-2 finding 5): 9 → 12. Measured off the frame the critique
 *  cited: at 9 px the stick is 27 screen px of a 1056-px picture, thinner than
 *  the seam between two couch cushions behind it. */
const CHALK_DISPLAY_H = 12;
/** PK-R6 · E: a lying shard is smaller than the stick it came off. */
const SHARD_DISPLAY_H = 6;

// ── PK-R6 · H2 · HOW BIG A BOSS IS (round-2, the side-by-side verdict) ───────
// „Mr. Sax fills 40 % of the frame … so scale alone tells you 'this is the boss'
// before anything moves — DomiGo's Tafel is the same size as the player
// character." Measured rather than argued: at 52 the sheet's ink box renders
// 156 screen px against the boy's ~100 head-to-shoe, and 30 % of that is the
// painted swoosh, so the BOARD — the part that reads as a body — came out at
// 110 px. The same size as the child, in the frame where the fight happens.
//
// 68 puts the board at roughly one and a half children while keeping her whole
// silhouette inside the room: her flight band tops out at world y 166, the
// arena's camera is pinned at y 96 (a 20-row world under a 14-row view), so 70
// is the ceiling and the tallest cell on the sheet (`windup`, 11 % over the idle
// it is scaled from) is what spends the rest. See `guardianKeepIn` for the last
// few px of that arithmetic.
const GUARDIAN_DISPLAY_H = 68;
/** How far past the top of the view her drawing may be pushed back down, in px.
 *  Small on purpose: this is a framing clamp for the tallest cell at the top of
 *  her band, not a second camera. */
const GUARDIAN_KEEPIN_MAX = 6;
/** PK-R6 · H2 (round-2 finding 8: „boss scale-up on key attack beats"). How much
 *  bigger she gets at the top of a tell. Enough to be felt at a glance, small
 *  enough that it reads as her rearing rather than as a zoom. */
const BOSS_BEAT_SWELL = 0.13;

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
/** How far above her feet the tail streams from — half her drawn height, so it
 *  leaves the middle of the board and follows her when she is re-scaled. */
const TRAIL_ANCHOR_Y = GUARDIAN_DISPLAY_H * 0.5;
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
// PK-R6 · H2 · …AND WHAT SHAPE IT IS. Round 2, at 6×: the halo is a pale DISC.
// Five concentric circles behind a rectangular board draw a soap bubble she is
// sitting inside — visible as such in 01, 04 and 06 — and a circle is the one
// shape in this book that no brush made. A separation halo has exactly one job,
// which is to trace the edge of the thing it separates, so it is now HER OWN
// SILHOUETTE: an ADD-blended copy of whatever cell she is wearing, blown up a
// little and laid behind her (the same mirror device the colour flood and the
// gift bloom already use). It cannot go out of register with her, it cannot be
// the wrong shape, and it disappears the moment her outline does.
/** The halo's colour — the stage's own candle-warm cream, not a new hue. */
const BOSS_HALO_COLOUR = 0xffe9b8;
/** How far past her own outline the blown-up copy reaches, and how strongly it
 *  is added. Kept low: felt as separation, never seen as a glow. */
const BOSS_HALO_SPREAD = 1.1;
const BOSS_HALO_ADD = 0.4;

// ── PK-R6 · H2 · THE TELL IS CHALK DUST (round-2 finding 1, critical) ────────
// „The attack telegraph is a flat clip-art glove, not a painted object … a flat
// white vector glove icon that doesn't belong to the painted world at all."
//
// It is worse than a style clash. `tafel_hand` is a cartoon MITTEN gripping a
// stick — a hand, on a being that has no hands — drawn at a hard vector outline
// over gouache, and (measured in the captured frame) pinned by a fixed 15/30 px
// offset that at her size lands it squarely on her FACE. The one moment of the
// fight the child must read was a white glove covering the boss's expression.
//
// The sheet already tells this beat: `windup0 → windup1 → windup` is a dip and a
// rear with the chalk raised, painted by the person who painted her. What the
// code owes is not a second hand — it is the DUST. She is a blackboard: what
// gathers before she throws is chalk powder, pulled off her own tray, in the
// colour of the stick that is about to fly. Soft edges, no outline, no icon.
//
// The glove is retired from the render path (its PNG stays on disk — deleting
// art is the art lane's call, not this one's).
/** The tell's fallback colour when no stick colour is known yet. */
const CHARGE_COLOUR = 0xffb02e;
const CHARGE_CORE = 0xfff0b0;
/** How wide the gathering dust reaches at the top of the tell, in world px. */
const CHARGE_MAX_R = 11;
/** How many grains gather. Deterministic — index-hashed, never random. */
const CHARGE_MOTES = 9;

// ── PK-R6 · H2 · THE KNOT CORD (round-2 finding 4) ──────────────────────────
// „No persistent boss-progress or threat indicator on screen … only a transient
// text bubble." True as charged: the chapter counts the fight in KNOTS, and the
// only place a knot was ever said out loud was a toast that lives 1.4 s, plus a
// HUD chip on the page OUTSIDE the picture. So the count is now IN the world,
// tied to the boss it measures: a chalk cord over her easel with one knot per
// window, each one coming UNDONE as the child answers.
// PK-R6 · H2 · …AND IT IS DRAWN IN CHALK, NOT IN UI. Measured in the running
// arena (first build of this meter, captured at 5×): three perfectly round flat-
// white discs joined by an even white bar — a barbell, and precisely the „flat
// clip-art that doesn't belong to the painted world" this round's CRITICAL
// finding is about. The repair is the one the bubble already banked: nothing
// perfectly round, nothing filled pure white, every line laid twice (a soft wide
// pass under a fine one), every point nudged by a hash so the same cord is drawn
// the same way twice and no two knots are twins.
/** The cord's chalk, the slate its shadow falls on, and the spent chalk an
 *  untied knot leaves behind. */
const KNOT_CHALK = 0xf1e4c2;
const KNOT_CHALK_LIT = 0xfffaea;
const KNOT_SHADOW = 0x241c2e;
const KNOT_DONE = 0x8e8270;
/** How far above her top edge the cord hangs, and how far apart the knots sit. */
const KNOT_CORD_LIFT = 8;
const KNOT_SPACING = 12;
/** How big a tied knot's lump is, in world px. */
const KNOT_R = 2.9;

// ── PK-R6 · H2 · THE STAGE LAMP (round-2 finding 9) ─────────────────────────
/** The fixture's iron, and the filament inside the lens. */
const STAGE_LAMP_BODY = 0x2b2333;
const STAGE_LAMP_CORE = 0xfff4dc;

// ── PK-R6 · H2 · THE ROLL'S OWN BLUR (round-2 finding 3) ────────────────────
/** How many of her recent cells stay on screen behind a corkscrew, and how
 *  strongly the freshest one is drawn. Three: enough for the eye to read a turn,
 *  few enough that she never becomes a smear of blackboards. */
const GHOST_COUNT = 3;
const GHOST_ALPHA = 0.3;

/** PK-R6 · H2 · how long the fight's own push-in lasts, in ms (round-2 finding
 *  8). Long enough to be felt, short enough that it never becomes the shot the
 *  child is playing in. */
const BOSS_PUSH_MS = 1150;

/** Which stick she will throw NEXT, so the dust that gathers is the colour of
 *  the piece that flies. Mirrors the sim's own cycle (`entities.stepEntities`)
 *  by reading the same array and the same index — a second copy of the rule
 *  would be a second thing to drift. */
const nextChalkColourFor = (throws: number): string =>
  CHALK_COLOURS[throws % CHALK_COLOURS.length] ?? CHALK_COLOURS[0];

/** The splinter's outline as Phaser wants it — the shape itself is pure and
 *  lives in `burst.ts` with the rest of the code-drawn FX, so its law can be
 *  asserted without a canvas. */
const shardPoints = (id: number, cx: number, cy: number): Phaser.Geom.Point[] =>
  shardOutline(id, cx, cy, SHARD_R).map((p) => new Phaser.Geom.Point(p.x, p.y));

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
// PK-R6 · H2 (round-2 finding 5): the glows were PASTELS — `red` was 0xff8a7a,
// a salmon, and the whole table sat at the same tint the couches do. The
// reference the harness measured us against punches a saturated magenta note
// against dark blue and is „unmissable in one glance"; a wash of the backdrop's
// own value cannot be. Every entry is now the chroma of the stick it belongs to
// rather than a pale memory of it, and the light is drawn hot at the core (see
// the comet below) instead of only as a halo.
const CHALK_LIGHT: Record<string, number> = {
  white: 0xfff8e6, red: 0xff3b5c, blue: 0x3d9bff, green: 0x3ed46a, yellow: 0xffd21e, orange: 0xff7a1e,
};
/** The fallback for a guardian whose chapter ships no coloured set. Warm cream
 *  reads against the dark shelf; plain white did not. */
const CHALK_LIGHT_FALLBACK = 0xfff1cf;
/** How big the glow is around a flying stick, and how strong at its core. */
const CHALK_GLOW_R = 9;
const CHALK_GLOW_ALPHA = 0.62;
/** PK-R6 · H2 (round-2 finding 5): 6 → 11 samples. „With a visible motion trail
 *  so it reads instantly against the mid-value couch backdrop, the way the
 *  reference's glowing note does" — the reference's trail is roughly as long as
 *  the note is far from the thrower; at 6 samples ours was two stick-lengths. */
const CHALK_TAIL_POINTS = 11;
/** …and the sparkles that ride it. The reference's note carries a sparkle trail,
 *  not a smear; these are the specks that fall off a piece of chalk in flight. */
const CHALK_SPARKS = 5;
/** How dark a contour is drawn around the glow so it also reads on a PALE
 *  floor — a bright halo alone disappears into the honey-wood book tiles. */
const CHALK_RIM = 0x3a2a12;

// ── PK-R6 · H2 · A SHARD IS A SPLINTER (round-2 finding 6) ──────────────────
// „'Shards on floor' are smooth round dust puffs, not broken chalk … redesign
// the ground hazard as an actual jagged broken-chalk-fragment shape with its own
// silhouette and drop shadow, distinct from the round ambient dust particles."
//
// The cause is measurable: `chalk_shard_a/b` are not shards, they are SPRAYS —
// a 245×259 sheet holding ten separate chunks. Fitted to a 6-px display height
// the whole spray becomes 6 px, so each chunk lands at well under one pixel and
// what survives to the screen is a soft light blob. Ten shards drawn that way
// are ten blobs, and the arena floor already carries the footstep dust, which is
// round and pale — so the hazard and the ambience became the same mark.
//
// It is drawn now (doc 44 B14): one angular fragment per piece, its corners
// hashed off the projectile's own id so a given shard always has a given shape
// and no two neighbours share one. Painted the way every other surface in this
// book is: a cast shadow first, then the body, then a lit facet and a shaded
// one, then a contour laid twice — soft and wide under fine and dark.
/** How big a lying splinter is, corner to corner, in world px. Its SHAPE (and
 *  the law that keeps it from being round) is `burst.shardOutline`. */
const SHARD_R = 4.6;
/** The ink its contour and its shadow are drawn in, and the chalk its body is
 *  made of — a broken stick is mostly pale, whatever colour it was dyed. */
const SHARD_INK = 0x3a2a12;
const SHARD_BODY = 0xf6ead0;

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
/** PK-R6 · H2 · the room's own light when a classmate comes back (finding 3).
 *  The same sunflower the arriving colour rides in on, one stop paler at its
 *  core — this is the spell letting go of a whole room, not a second lamp. */
const AWAKEN_ROOM_WARM = 0xffd08a;
const AWAKEN_ROOM_CORE = 0xfff2cf;
/** PK-R6 · H1 · the two materials every painted surface the SCENE draws is made
 *  of — the same cream and the same brown ink the overlay's parchment uses, so a
 *  bubble the world speaks and a card the book opens are one book. */
const PARCHMENT = 0xf7edd5;
const INK_LINE = 0x8a6a38;
/** PK-R6 · H2 · …and where the wash POOLED while that paper dried (round-2
 *  finding 6). The card's parchment rule already lays two of these in CSS; the
 *  bubble the world speaks now carries the same two, in the same brown, so the
 *  two surfaces are one material rather than two that merely share a hex. */
const PARCHMENT_POOL = 0xe8d6ad;

/**
 * PK-R6 · H2 · THE HAND-DRAWN BUBBLE RIM (round-2 finding 6: „hard rounded-
 * rectangle outline … standard messaging-app chrome").
 *
 * A superellipse rather than a rounded rectangle (four perfect arcs joined by
 * four straight runs is the shape of a UI control and of nothing a brush has
 * ever made), and every point on it is nudged twice: a slow wobble that gives
 * the whole rim a lean, and a per-point jitter. Both come out of a hash of the
 * SPOKEN WORD, so „Danke!" and „Autsch!" are visibly different bubbles, the same
 * word always draws the same bubble, and no `Math.random` is anywhere near it
 * (repo law) — a replayed tape speaks in identical bubbles.
 *
 * Points run clockwise from the right-hand side, which is what lets the sheen
 * be a SLICE of the rim (the top-left run) rather than a straight bar laid
 * across it.
 */
export const BUBBLE_RIM_POINTS = 46;
export const paintedBubblePath = (
  w: number, h: number, top: number, seed: number,
): Array<{ x: number; y: number }> => {
  const cy = top + h / 2;
  const hw = w / 2;
  const hh = h / 2;
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < BUBBLE_RIM_POINTS; i++) {
    const a = (i / BUBBLE_RIM_POINTS) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // squircle: |cos|^(1/2) keeps the sides fairly flat and the corners round
    const sx = Math.sign(ca) * Math.abs(ca) ** 0.62;
    const sy = Math.sign(sa) * Math.abs(sa) ** 0.62;
    const j = (((Math.imul(i + 1, 2246822519) ^ seed) >>> 24) & 0xff) / 255;
    const wobble = 1 + 0.045 * Math.sin(a * 2 + (seed & 0xff) / 40);
    const k = wobble + (j - 0.5) * 0.045;
    pts.push({ x: sx * hw * k, y: cy + sy * hh * k });
  }
  return pts;
};
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
  // ── PK-R6 · H2 · THE CONTACT BURST (round-2 findings 1 and 2) ──────────────
  /** Where the last contact happened, in world px — the TOUCH POINT between the
   *  two bodies (burst.contactPoint), not either body's centre. */
  private burstAt: { x: number; y: number } | null = null;
  /** How old that burst is, in ms of REAL time. A presentation clock on purpose:
   *  `Sim.tickCount` stops the instant a card opens, and this beat exists to
   *  punctuate exactly that instant (see burst.ts's header). */
  private burstMs = 0;
  /** The burst's light, UNDER the two bodies — the backlight that gives the
   *  being an edge (depth 6.9, below entities at 7). */
  private burstBackG!: Phaser.GameObjects.Graphics;
  /** …and its ink, OVER both of them (depth 10.4, above the hero's rig at 10),
   *  because the one place the collision has to stay legible is where the two
   *  drawings overlap. */
  private burstG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H2 · how long the hero has been cheering, in ms of the same
   *  presentation clock. Set when a being is freed; the world is frozen for the
   *  card at that moment, so a sim-tick clock would never move. */
  private cheerMs = Number.POSITIVE_INFINITY;
  /** PK-R6 · H2 (round-2 finding 3): how long ago the sixth answer landed, on the
   *  same presentation clock — the world is frozen for the ceremony card at that
   *  moment, so a sim-tick clock would leave the payoff stopped on frame one.
   *  Infinity = no reawakening has been completed, i.e. nothing to light. */
  private awakenRoomMs = Number.POSITIVE_INFINITY;
  /** …and where in the world she was standing when it landed, so the light has a
   *  source instead of being a screen-wide tint. */
  private awakenRoomAt: { x: number; y: number } | null = null;
  /** The room's own light: camera-space, over everything, for one beat only. */
  private awakenRoomG!: Phaser.GameObjects.Graphics;
  /** R5-W1 · A2 — the ink's animated surface: the drifting texture strips, the
   *  runs they cover, and the crown redrawn over them each tick. */
  private readonly inkSurfaces: Phaser.GameObjects.TileSprite[] = [];
  private readonly inkRuns: Array<{ x0: number; x1: number; y: number }> = [];
  private inkCrownG: Phaser.GameObjects.Graphics | null = null;
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
  /** PK-R6 · H2 · the boss's separation halo, as her OWN outline: one ADD-blended
   *  copy of the cell she is wearing, blown up behind her (round-2 finding 1's
   *  neighbour — the disc it replaces read as a bubble she was sitting in). */
  private bossRimImgs = new Map<string, Phaser.GameObjects.Image>();
  /** PK-R6 · H2 · the motion blur behind a barrel roll (round-2 finding 3): the
   *  last few cells she wore, redrawn where she wore them. */
  private ghostImgs: Phaser.GameObjects.Image[] = [];
  private ghosts: Array<{ key: string; x: number; y: number; rot: number; sx: number; sy: number; flip: boolean }> = [];
  /** PK-R6 · H2 · the knot cord over her easel (round-2 finding 4). */
  private knotG!: Phaser.GameObjects.Graphics;
  /** PK-R6 · H2 · the fight's own push-in (round-2 finding 8), in ms since the
   *  beat that called for it. Wall-clock, like every other presentation clock in
   *  this scene, and subordinate to the card lean — see the camera block. */
  private bossPushMs = Number.POSITIVE_INFINITY;
  private bossPushId: string | null = null;
  /** which guardian beats have already spent their push, so a held state cannot
   *  re-trigger one every tick. */
  private pushedBeats = new Set<string>();
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
  /** PK-R6 · H3 · the full-pose override pair (hero v2) — one authored cell
   *  drawn whole when rigSpec.heroFullCell speaks; the parts hide meanwhile. */
  private heroFull!: Phaser.GameObjects.Image;
  private heroFullShadow!: Phaser.GameObjects.Image;
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
  /** PK-R6 · H2 · the leaves turning over the scenery (round-2 finding 13) */
  private lifeG!: Phaser.GameObjects.Graphics;
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
  /** R5-W1 · E1: the stems this phase may ask for (artScope.ts). */
  private readonly scope: ReadonlySet<string>;

  constructor(cfg: PaintSceneCfg) {
    super({ key: "paint" });
    this.cfg = cfg;
    this.comp = compositionFor(cfg.level.chapter, cfg.phaseId);
    this.scope = phaseArtScope(cfg.level, cfg.phaseId, Object.keys(cfg.art));
    this.sim = new Sim({
      level: cfg.level,
      phaseId: cfg.phaseId,
      grantedAbilities: cfg.grantedAbilities,
      freedCageIds: cfg.freedCageIds,
      cageHintShown: cfg.cageHintShown,
      collectedPickupIds: cfg.collectedPickupIds,
      airModel: cfg.airModel,
      spawnCell: cfg.spawnCell,
      letterLedger: cfg.letterLedger,
    });
  }

  /** R5-W1 · E1: what THIS phase may ask for. A ceiling, not a guess — see
   *  artScope.ts for why it is closed over what exists on disk. */
  artScope(): ReadonlySet<string> {
    return this.scope;
  }

  preload(): void {
    // R5-W1 · E1 · LOAD THIS PHASE, NOT THE CHAPTER. This used to walk the
    // whole art map: 290 stems / 111 MB queued before phase one's first frame,
    // where ~20 MB is what the phase draws. Both guards below are unchanged —
    // a stem with no URL keeps its procedural fallback (the keen-art law), and
    // textures already in the game-wide manager are never re-fetched, so a
    // later phase still pays only for what its predecessors did not load.
    for (const stem of this.scope) {
      const url = this.cfg.art[stem];
      if (url === undefined) continue;
      if (!this.textures.exists(`pb-${stem}`)) this.load.image(`pb-${stem}`, url);
    }
    this.keepLoaderMoving();
  }

  /**
   * R5-W2 · E2 · THE LOADER MUST NOT DEPEND ON THE FRAME CLOCK.
   *
   * Phaser starts `maxParallelDownloads` files (32; 6 on Android) and then
   * advances the queue from exactly ONE place: `LoaderPlugin.update`, which it
   * binds to `SceneEvents.UPDATE`. `nextFile()` — the callback that runs when a
   * file finishes — deletes the file from `inflight` and updates progress, but
   * never starts the next one. So the queue only moves on a rendered frame.
   *
   * Whenever requestAnimationFrame stops, loading therefore stops dead with
   * capacity to spare. Measured on this branch, tab hidden: `done: 32`,
   * `inflight: 0`, `list: 60`, unchanged over six seconds — nothing in flight,
   * sixty files waiting, and no tick to start them.
   *
   * For a child that is a backgrounded tab: open the chapter, switch away while
   * it loads, and it loads NOTHING until they come back, instead of being ready
   * when they return. (It is also why every automated session so far had to
   * hand-pump the queue — that recipe now has no reason to exist.)
   *
   * The fix is to advance the queue on the event that already fires for every
   * finished file. `queueMicrotask` breaks the synchronous chain, because
   * `checkLoadQueue` can complete a cached file inline and re-enter through the
   * same event; the flag collapses a burst of completions into one advance.
   */
  private keepLoaderMoving(): void {
    // checkLoadQueue is the method Phaser's own `update` calls; it is real at
    // runtime but marked internal, so it is absent from the published types.
    const loader = this.load as Phaser.Loader.LoaderPlugin & { checkLoadQueue?: () => void };
    let pending = false;
    const advance = (): void => {
      if (pending) return;
      pending = true;
      queueMicrotask(() => {
        pending = false;
        // the scene may be gone by the time this runs (phase handoff mid-load)
        if (loader.state === Phaser.Loader.LOADER_LOADING) loader.checkLoadQueue?.();
      });
    };
    this.load.on(Phaser.Loader.Events.PROGRESS, advance);
    this.load.once(Phaser.Loader.Events.COMPLETE, () => {
      this.load.off(Phaser.Loader.Events.PROGRESS, advance);
    });
  }

  create(): void {
    this.buildFallbackTextures();
    this.buildBackdrop();
    this.buildAir();
    this.buildTerrain();
    this.buildProps();
    this.buildRig();
    // R5-A6 · the picture-vs-grid instrument (teacher door, ?grid=1): outline
    // every cell the collision owns, in world space. A Schein-Lücke — drawn
    // matter and claimed matter telling different stories — shows in one
    // glance, without reading JSON against a screenshot.
    if (this.cfg.debugGrid === true) {
      const dbg = this.add.graphics().setDepth(90);
      for (const [r, row] of this.sim.grid.entries()) {
        for (let c = 0; c < row.length; c++) {
          const g = row[c] ?? ".";
          if (g === "." || g === "S") continue;
          const colour = isSolid(g) ? 0xff3333 : isSlope(g) ? 0x3355ff : g === "w" ? 0x33ccff : 0xcc8800;
          dbg.lineStyle(1, colour, 0.85).strokeRect(c * TILE, r * TILE, TILE, TILE);
        }
      }
    }
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
    // PK-R6 · H1: the boss's separation halo and the gift's bloom share one
    // canvas BEHIND her (entities sit at 7, her trail at 6.9) — a glow drawn in
    // front of a boss is a veil over the thing it was meant to reveal.
    this.bossGlowG = this.add.graphics().setDepth(6.8);
    // PK-R6 · H2 · the knot cord (round-2 finding 4). Over her (7) and under the
    // hero (10): the one thing on screen that must never be hidden by the boss
    // it measures, and must never hide the child reading it.
    this.knotG = this.add.graphics().setDepth(9.55);
    this.giftHaloG = this.add.graphics().setDepth(6.85);
    this.dustG = this.add.graphics().setDepth(7.9);
    // PK-R6 · H1 · the two halves of the air that cannot be placed once: motes
    // move, and the vignette is drawn in the camera's own rect every frame.
    this.moteG = this.add.graphics().setDepth(AIR_DEPTH.mote);
    // PK-R6 · H2 · the scenery's own life (finding 13) — on the furniture plane's
    // scroll factors, so it drifts with the hedge it is turning over
    this.lifeG = this.add.graphics().setDepth(AIR_DEPTH.life).setScrollFactor(LIFE_PARALLAX.x, LIFE_PARALLAX.y);
    this.vignetteG = this.add.graphics().setDepth(AIR_DEPTH.vignette);
    // behind every being (7) and behind the boss's own halo (6.8), so a hostile
    // in front of the guardian never draws its edge over her
    this.hostileG = this.add.graphics().setDepth(6.6);
    // under the letters (4) — a shimmer drawn OVER a glyph is a smudge on it
    this.letterFxG = this.add.graphics().setDepth(3.9);
    // the charge sits over her body (7) and under the throwing hand (9)
    this.chargeG = this.add.graphics().setDepth(8.6);
    // PK-R6 · H2 · the contact burst, in two halves: its LIGHT under both bodies
    // (6.9, below entities at 7) so the being gains an edge, and its INK over
    // both of them (10.4, above the hero's rig at 10) so the frame where the two
    // drawings merge still has a hard line through it.
    this.burstBackG = this.add.graphics().setDepth(6.9);
    this.burstG = this.add.graphics().setDepth(10.4);
    // PK-R6 · H2 · the room's own light when a classmate comes back (finding 3).
    // Over everything, because that is where light is: it falls ON the picture,
    // it is not a layer inside it. Depth 12 clears the hero's rig (10) and his
    // fist (11); it is redrawn in the camera's own rect every frame, the same
    // convention the vignette follows (see renderAwakenRoom).
    this.awakenRoomG = this.add.graphics().setDepth(12).setBlendMode(Phaser.BlendModes.ADD);

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
    this.stepInk();
  }

  /**
   * R5-W1 · A2 — the ink's motion, once per frame.
   *
   * Driven by the SIM tick, not a wall clock: a replayed tape has to draw the
   * same water it drew the first time, and `Math.random`/`Date.now` are a
   * standing wall in gameplay code. The consequence is deliberate and correct —
   * while a card freezes the sim the ink holds still too, because the world is
   * holding still, which is the same rule the whole frame already obeys.
   */
  private stepInk(): void {
    if (this.inkRuns.length === 0) return;
    const drift = inkScrollAt(this.tickCount);
    for (const t of this.inkSurfaces) t.tilePositionX = drift / t.tileScaleX;
    this.drawInkCrown();
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
        case "cageHint": cb.onCageHint(ev.id); break;
        case "letters": cb.onLetters(ev.got, ev.total); break;
        case "letterTaken": {
          this.cfg.callbacks.onLetterTaken?.(ev.c, ev.r);
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
    // PK-R6 · H2 · THE CONTACT BEAT IS OVER (round-2 finding 1). The burst
    // punctuates the moment the card OPENS; by the time the child has answered
    // it, it belongs to a scene that has ended. Its own clock already runs out
    // 620 ms in — before the card has finished landing — but a clock is not a
    // guarantee, and „the impact is still burning while the answer flies home"
    // is exactly the frame the round-2 critic photographed five times. So the
    // beat is ENDED by the event that ends it, not merely left to expire.
    this.burstAt = null;
    this.handleSimEvents(this.sim.solveTask(ctx));
  }

  /** Called by React when a task card is DISMISSED („Später") — the anti-
   *  softlock exit: no redeem, no reward, the world just resumes. */
  dismissTask(ctx: TaskRequest["ctx"]): void {
    this.burstAt = null;
    this.sim.dismissTask(ctx);
  }

  spendLetters(n: number): boolean {
    const ok = this.sim.spendLetters(n);
    if (ok) this.cfg.callbacks.onLetters(this.sim.lettersGot, this.sim.lettersTotal);
    return ok;
  }

  /** R5-C1: `phrase` is added here rather than in the shell because THIS is the
   *  only place that holds both halves of it — the phase's grid and the phase's
   *  declared trail words (`this.comp`). The shell has neither. */
  bonusState(): { leftTicks: number; got: number; total: number; phrase: PhraseSlot[][] } {
    return {
      leftTicks: this.sim.bonusLeftTicks,
      got: this.sim.lettersGot,
      total: this.sim.lettersTotal,
      phrase: bonusPhrase(this.grid, this.comp?.words, this.sim.runTakenCells),
    };
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
      // PK-R6 · H2 (round-2 finding 4): …and a CAGE gets one too. The night
      // classroom is dark green furniture against dark blue air, and the one
      // shape the chapter teaches was the only large object in it carrying no
      // edge at all — which is most of why the opened case read as „an
      // amorphous green blob". Same device, same numbers, one more role.
      if (JOY_ROLES.has(e.role) || e.role === "cage") {
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
  private entTargetH(e: { role: string; skin: string; params?: Record<string, unknown> }): number {
    if (e.role === "guardian") return GUARDIAN_DISPLAY_H;
    if (e.role === "swarm") return 34;
    if (e.role === "crusher") return 30;
    if (e.role === "door.trigger") return e.skin === "klecksdoor" ? 30 : 34;
    // PK-R6 · H2 (round-2 finding 4: „the object the characters are draped over
    // and celebrating on is an amorphous green quilted blob with no bars, hinge,
    // door or face"). The art is none of those things — `pencilcase_burst` is a
    // painted case with its lid thrown wide, its zip flying off and a dark well
    // where somebody was. It was being drawn 24 px tall. At that size a 413-px
    // sheet keeps its outline and loses everything inside it, and what survives
    // is a green shape.
    //
    // A PERSON-CAGE is therefore sized like what it is: the one container in the
    // chapter big enough to have held the girl standing next to it (she renders
    // 30). The other cages are unchanged — they hold a moth, and a pencil case
    // the size of a desk would be the opposite lie.
    if (e.role === "cage") return this.holdsAPerson(e) ? 34 : e.skin === "pencilcase" ? 24 : 22;
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

  /** Does this cage hold a classmate? The level's own pointer answers — the
   *  `classmate-pair` law proves it exists before ship — so the renderer never
   *  has to know that ch01's person-cage happens to be a pencil case. */
  private holdsAPerson(e: { role: string; params?: Record<string, unknown> }): boolean {
    return e.role === "cage" && typeof e.params?.classmate === "string";
  }

  /**
   * PK-R6 · C1 · THE ↑ CUE (doc 44 §4 ch01: „each stands grey in the world with
   * an ↑ cue"). A chalk arrow bobbing over the ONE being a press would reach.
   *
   * It is drawn from `engageTargetId` — the same pure function the sim asks
   * before it opens a card — so the arrow can never point at something a press
   * would miss. That is the letter-magnet rule applied to an affordance: the
   * picture and the mechanic read from one answer.
   *
   * PK-R6 · H2 (round-2 finding 1): …and it is DRAWN BY HAND now. The shape it
   * fills comes from `cue.chalkArrow` — a soft-edged, wavering, dust-shedding
   * chalk mark instead of the four straight machine edges this method used to
   * put down. The geometry is pure and unit-tested; what lives here is only the
   * filling of it, and the seed is the being's own name so the mark over the
   * schoolbag is not the identical twin of the mark over the desk.
   */
  private renderEngageCue(): void {
    const id = engageTargetId(this.world, this.player.x, this.player.y);
    const e = id === null ? null : this.world.entities.find((x) => x.id === id);
    this.engageCueG.clear();
    if (!e) return;
    const x = fromSubs(e.x);
    // R5-W1 · F1: das Wippen ist nach cue.ts gezogen — dort ist es eine reine
    // Funktion mit einem Namen und einem Test, hier war es ein Literal in einer
    // Datei ohne Testabdeckung. Diese Methode füllt nur noch, was sie bekommt.
    const y = fromSubs(e.y) - this.entTargetH(e) - 7;
    const seed = entSeed(e.id);
    const cue = chalkArrow(x, y, 11, seed, this.tickCount, this.cfg.reducedMotion);
    const g = this.engageCueG;
    // the gilded light first, behind everything: the same glow the collectible
    // letters wear, so an affordance is an affordance wherever the child meets it
    for (const ring of cue.halo) {
      g.fillStyle(CUE_HALO, ring.alpha);
      g.fillCircle(ring.cx, ring.cy, ring.r); // …das Licht hängt der Marke nach
    }
    // …then the mark itself, widest and faintest first — the stack IS the edge
    for (const band of cue.bands) {
      g.fillStyle(band.colour, band.alpha);
      g.fillPoints(band.pts.map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
    }
    // …and the powder it shed putting itself down
    for (const d of cue.dust) {
      g.fillStyle(CUE_CHALK, d.alpha);
      g.fillCircle(d.x, d.y, d.r);
    }
  }

  /**
   * R5-W1 · F1 · EINE AUFLAGE FOLGT IHREM KÖRPER GANZ, oder sie verrät ihn.
   *
   * Der Grauschleier und das Flut-Leuchten spiegelten Position, Größe und
   * Spiegelung — aber NICHT die Drehung. Bei 1,5 px Käfig-Wackeln fiel das
   * niemandem auf; mit dem lesbaren Ausschlag unten wäre daraus ein
   * verschmiertes Doppelbild mit 72 % Deckkraft geworden, und ein Kritiker
   * hätte es zu Recht einen Render-Fehler genannt. Ein Helfer statt drei
   * kopierter Zeilen, damit die nächste Transformation nicht wieder vergessen
   * wird — dieselbe Regel, die diese Datei oben schon aufschreibt: zwei
   * Methoden, die ein Objekt schreiben, sind der Grund, warum ein Rand seinem
   * Körper hinterherhinkt.
   */
  private syncOverlay(copy: Phaser.GameObjects.Image, img: Phaser.GameObjects.Image): void {
    copy.setPosition(img.x, img.y);
    copy.setScale(img.scaleX, img.scaleY);
    copy.setRotation(img.rotation);
    copy.setFlipX(img.flipX);
  }

  private renderEntities(): void {
    for (const e of this.world.entities) {
      const img = this.entityImgs.get(e.id);
      if (!img) continue;
      // R3-16: a taken Regel-Seite / Bonus-Buch is GONE — it went into the tally
      img.setVisible(!e.hidden && !(PICKUP_ROLES.has(e.role) && e.redeemed));
      img.setPosition(fromSubs(e.x), fromSubs(e.y));
      const cell = this.entStateCell({
        ...e,
        idleFrames: this.idleFramesOf(e.skin),
        // R5-A8: the resting open state BOBS over open0/open1 — `hasOpen`
        // must vouch for the whole pair, because entTex falls back to `_a`
        // (the closed cage, captive behind bars) on any missing cell.
        hasOpen: this.textures.exists(`pb-${e.skin}_open0`) && this.textures.exists(`pb-${e.skin}_open1`),
        // R5-W1 · F1 · derselbe Nur-was-da-ist-Vertrag für die Streck-Zelle des
        // Hüpfers: liegt sie eines Tages auf der Platte, zeigt der Flug sie —
        // ohne eine Zeile Code hier oder in anim.ts.
        hasStretch: this.textures.exists(`pb-${e.skin}_stretch`),
      });
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
        const airborne = AIRBORNE_STATES.has(e.state);
        const base = targetH / (this.refFrameHOf(e.skin) || frameH);
        // PK-R6 · H2 · TWO MORE AXES ON THE SAME ONE SCALE (round-2 findings 3
        // and 8). The one-factor law above is untouched — the sheet's own
        // proportions still reach the screen — and both of these multiply it
        // rather than replace it, so a rear is still 11 % taller than a hover
        // whatever else is happening to her.
        //  · ROLL: horizontal foreshortening, the axis rotation cannot draw. A
        //    hover is square on, a bank turns its face into the turn, a spiral
        //    corkscrews through edge-on (anim.guardianRollScaleX).
        //  · BEAT: she swells through a tell and is at her biggest at the
        //    release — „boss scale-up on key attack beats", and the moment the
        //    child most needs to look at her.
        const roll = airborne ? guardianRollScaleX(e.vx, e.vy, e.flightTick, this.cfg.reducedMotion) : 1;
        const beat = 1 + BOSS_BEAT_SWELL * this.bossBeatT(e);
        img.setScale(base * roll * beat, base * beat);
        // PK-R6 · H1 (round-1 critique, finding 2): …and she FLIES it. The sheet
        // paints banks and rolls but has no cell for a dive, and her vertical
        // amplitude (26 px) is a third of her horizontal one — so the half of
        // the path that reads worst is drawn here, as body attitude taken from
        // her own velocity. Only while she is actually airborne: a sinking or
        // resting board that tilted would read as broken furniture.
        img.setRotation(
          airborne ? guardianPitchRad(e.vx, e.vy, e.dir, this.cfg.reducedMotion) : 0,
        );
        // …and the last few px of the size arithmetic: a boss cropped by the top
        // of the frame is a worse picture than a boss one px lower (see
        // GUARDIAN_DISPLAY_H).
        img.y += this.guardianKeepIn(img);
      }
      else {
        // PK-R6 · H1 · THE OPENING POP (round-1 critique, finding 4): a cage that
        // has just burst throws itself wide and settles, so the one shape the
        // chapter teaches is a thing that HAPPENS rather than a texture that was
        // swapped between two frames. Folded into the scale the renderer sets
        // anyway — see cagePopT for why a tween cannot live here.
        const pop = this.cagePopT(e);
        const k = targetH / frameH;
        // R5-W1 · F1 · DIE QUETSCHUNG DES HÜPFERS, in dieselbe Zeile gefaltet,
        // aus demselben Grund wie der Käfig-Pop: renderEntities setzt die
        // Skalierung JEDE Frame neu, ein Tween daneben wäre überschrieben.
        // Nur solange er hüpft — ein erlöster Radierer wird von stepRedeemed
        // über x/y bewegt, sein `vy` friert ein, und eine Verformung aus
        // stehengebliebener Geschwindigkeit bliebe für immer platt.
        const sq = e.role === "bouncer" && !e.redeemed
          ? bouncerSquash(e.bounceTick, e.vy, this.cfg.reducedMotion)
          : REST_SQUASH;
        // R5-W1 · F1 · …und das Käfig-Wackeln liegt aus demselben Grund HIER
        // und nicht mehr in renderReadability: dort setzte renderEntities die
        // Skalierung eine Zeile später ohnehin neu, also konnte das Rütteln nur
        // drehen, nie die Silhouette verformen. Ein Besitzer für die
        // Transformation eines Sprites. Geschenk obendrauf: renderHostiles
        // läuft NACH dieser Methode und kopiert Drehung und Skalierung in den
        // Schattenwurf — der Schatten wackelt gratis mit.
        const br = e.role === "cage" && !e.redeemed && !e.hidden
          ? cageBreath(this.tickCount, entSeed(e.id), this.cageNearT(e), targetH, this.cfg.reducedMotion)
          : CAGE_AT_REST;
        img.setScale(k * (1 + 0.18 * pop) * sq.sx * br.sx, k * (1 - 0.16 * pop) * sq.sy * br.sy);
        img.y += br.dy;
        if (pop > 0) img.setRotation(0.13 * pop);
        else if (e.role === "cage") img.setRotation(e.redeemed ? 0 : br.rot);
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
      // PK-R6 · H2 (round-2 finding 4): …and the OPENED CAGE with her. The same
      // 0.85 sat on the object at the centre of the climax — the thing the two
      // of them are celebrating on — so the frame that has to say „this opened"
      // was showing the room through it. Every other freed being keeps the fade
      // that means „you already did this"; the cage is the shape the chapter is
      // teaching, and a shape you can see through is the illegibility itself.
      if (e.redeemed && !e.role.startsWith("platform") && e.role !== "classmate" && e.role !== "cage") img.setAlpha(0.85);
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
      // redemption is the WARNING it carries.
      // PK-R6 · H2 (round-2 findings 10 and 11): that copy is now also the
      // separation rim, so it has ONE owner — `renderHostiles`, which runs after
      // this and reads the sprite exactly as this method has just left it. Two
      // methods writing one object is how a rim ends up lagging its own body.
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
          this.syncOverlay(wash, img);
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
          this.syncOverlay(bloom, img);
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
        // PK-R6 · H2 (round-2 finding 3): …and when the being is a PERSON, the
        // ROOM answers. Six rounds end here and nothing outside her own 30-px
        // silhouette used to change, so the payoff frame and the progress frame
        // before it were the same picture. Fires once, on the sixth answer only.
        if (e.role === "classmate") {
          this.awakenRoomMs = 0;
          this.awakenRoomAt = { x: img.x, y: img.y - this.entTargetH(e) * 0.55 };
        }
        // PK-R6 · H2 (round-2 finding 4): …and the CHILD celebrates too. The
        // flourish on the freed thing was the whole payoff, and the one person on
        // screen who had just done the work stood at attention through it.
        this.cheerMs = 0;
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
          // ── PK-R6 · H2 · A SPLINTER, DRAWN (round-2 finding 6) ────────────
          // See SHARD_R for why the painted sheet cannot do this job at 6 px.
          // The order is the order a brush would lay it: the shadow it casts
          // (which is what puts it ON the floor rather than in front of it), the
          // body, a lit facet and a shaded one, then a contour laid twice.
          const left = Math.max(0, 1 - pr.age / SHARD_TICKS);
          const pulse = this.cfg.reducedMotion ? 0.85 : 0.78 + 0.22 * Math.sin(pr.age * 0.22);
          const poly = shardPoints(pr.id, lx, ly);
          // its shadow: an ellipse under the sliver, offset the way every other
          // cast shadow in this book is — this is what puts it ON the floor
          this.projG.fillStyle(SHARD_INK, 0.36 * left);
          this.projG.fillEllipse(lx + 1, ly + SHARD_R * 0.62, SHARD_R * 2.3, SHARD_R * 0.72);
          // THE BODY IS CHALK, not a coloured disc. A broken stick is mostly the
          // pale stuff it is made of; the hue rides on the face that caught the
          // light. Filling it with the saturated `light` was what made the first
          // build read as three billiard balls in the running arena.
          this.projG.fillStyle(SHARD_BODY, 0.96 * left);
          this.projG.fillPoints(poly, true);
          // the two facets: one face turned toward the room's light (in the
          // stick's own colour, so a shard still names the piece it came off),
          // one turned away from it
          const p0 = poly[0] ?? { x: lx, y: ly };
          const p1 = poly[1] ?? p0;
          const p3 = poly[3] ?? p0;
          const p4 = poly[4] ?? p0;
          const p2 = poly[2] ?? p0;
          this.projG.fillStyle(light, 0.72 * left * pulse);
          this.projG.fillTriangle(p0.x, p0.y, p1.x, p1.y, lx, ly);
          this.projG.fillTriangle(p1.x, p1.y, p2.x, p2.y, lx, ly);
          this.projG.fillStyle(SHARD_INK, 0.24 * left);
          this.projG.fillTriangle(p3.x, p3.y, p4.x, p4.y, lx, ly);
          // the contour, laid twice — the brushed edge, and the thing that gives
          // a 9-px prop a silhouette against a patterned floor. Kept LIGHT: at a
          // 0.85-alpha fine pass the outline was heavier than the body and four
          // shards read as dark blades lying on a bookshelf.
          this.projG.lineStyle(1.7, SHARD_INK, 0.2 * left).strokePoints(poly, true, true);
          this.projG.lineStyle(0.7, SHARD_INK, 0.6 * left).strokePoints(poly, true, true);
          continue; // it is drawn: no sprite, no sheet, nothing to fit to 6 px
        } else {
          // In flight: a comet of its own colour. Sampled CLOSE together (1.3
          // ticks apart) on purpose — measured at 6× in the running game, wider
          // spacing drew a row of separate grey bubbles instead of a streak.
          for (let i = CHALK_TAIL_POINTS; i >= 1; i--) {
            const back = i * 1.3; // ticks behind, turned into px by its own speed
            const tx = lx - (pr.vx / SUBS) * back;
            const ty = ly - (pr.vy / SUBS) * back;
            const k = 1 - i / (CHALK_TAIL_POINTS + 1);
            this.projG.fillStyle(light, 0.5 * k * k);
            this.projG.fillCircle(tx, ty, 0.9 + 2.6 * k);
          }
          // PK-R6 · H2 (round-2 finding 5): …and the SPARKLE the reference's note
          // carries. Specks thrown off the tail, offset across the flight line
          // rather than along it, so the trail has grain instead of being one
          // smooth smear. Deterministic: hashed off the piece's id and its age.
          if (!this.cfg.reducedMotion) {
            const sp = Math.hypot(pr.vx, pr.vy) || 1;
            const nx = -pr.vy / sp;
            const ny = pr.vx / sp;
            for (let i = 0; i < CHALK_SPARKS; i++) {
              const back = 2 + i * 2.4;
              const h = hash01(pr.id * 131 + i * 977 + Math.floor(pr.age / 3) * 17);
              const off = (h - 0.5) * 5.2;
              const tx = lx - (pr.vx / SUBS) * back + nx * off;
              const ty = ly - (pr.vy / SUBS) * back + ny * off;
              this.projG.fillStyle(0xfffdf3, 0.8 * (1 - i / CHALK_SPARKS));
              this.projG.fillCircle(tx, ty, 0.55 + h * 0.7);
            }
          }
          // the glow itself: three soft rings, no dark fill under them. A filled
          // dark disc was tried first and read as a mud blob at 6× — the stick
          // has to sit in light, not in a shadow.
          for (let i = 2; i >= 0; i--) {
            const k = 1 - i / 3;
            this.projG.fillStyle(light, CHALK_GLOW_ALPHA * k * k);
            this.projG.fillCircle(lx, ly, CHALK_GLOW_R * (0.34 + i * 0.33));
          }
          // PK-R6 · H2 · …and a HOT CORE at full alpha. The rings alone are a
          // wash: at 0.62 × k² the brightest pixel of a „saturated" projectile
          // still sat below the couches' own value, which is the finding.
          this.projG.fillStyle(light, 1);
          this.projG.fillCircle(lx, ly, CHALK_GLOW_R * 0.3);
          // …and a thin dark contour at the glow's rim, which is what keeps the
          // piece readable on the PALE book floor where a halo alone vanishes.
          this.projG.lineStyle(0.9, CHALK_RIM, 0.38).strokeCircle(lx, ly, CHALK_GLOW_R * 0.72);
        }
      }
      const key = [shard ? "" : coloured, thrower ? `pb-${thrower.skin}_chalk` : ""]
        .find((k) => k !== "" && this.textures.exists(k)) ?? "";
      if (pr.kind === "chalk" && key !== "") {
        let img = this.projImgs[used];
        if (!img) {
          img = this.add.image(0, 0, key).setDepth(8).setOrigin(0.5, 0.5);
          this.projImgs[used] = img;
        }
        used++;
        img.setVisible(true).setTexture(key).setPosition(fromSubs(pr.x), fromSubs(pr.y) - 4);
        img.setScale(CHALK_DISPLAY_H / (img.frame.height || 1));
        img.setRotation(this.cfg.reducedMotion ? 0 : (pr.deflected ? -1 : 1) * pr.age * 0.14);
        img.setAlpha(1);
        continue;
      }
      // the ink blob keeps its dot (no painted sheet — the only-present law)
      this.projG.fillStyle(pr.kind === "blob" ? 0x4f86c6 : 0xf6f2e8, 1);
      this.projG.fillCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "blob" ? 4 : 3);
      this.projG.lineStyle(1, 0x243048, 0.6).strokeCircle(fromSubs(pr.x), fromSubs(pr.y) - 4, pr.kind === "blob" ? 4 : 3);
    }
    for (let i = used; i < this.projImgs.length; i++) this.projImgs[i]?.setVisible(false);
    // R3-4's `tafel_hand` — a cartoon mitten holding a stick, drawn over her own
    // face — is RETIRED from the render path (round-2 finding 1, critical). The
    // tell it was doing is now `renderBossGlow`'s chalk dust and chalk sketch.
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

  /**
   * PK-R6 · C · THE CONTACT SPARK (doc 44 §3.1.1, v0 `tryEncounter`) — the first
   * beat of the entry choreography: the world BURSTS at the touch point, and the
   * ink iris wipes over that burst a moment later.
   *
   * PK-R6 · H2 · IT IS NOW DRAWN, NOT SPAWNED (round-2 findings 1 and 2). The old
   * version threw 26 tweened game objects and handed their lives to Phaser's
   * tween manager. Measured in the running build, that is what the round-2 critic
   * photographed as „an unexplained ghost icon fixed in screen space over the
   * hero in every frame": with the capture harness parking the game loop between
   * shots, no tween ever ticked, so the spawn frame survived into all five
   * screenshots. (Live, the same probe counts 26 shapes at 180 ms and zero at
   * 880 ms — the mechanism in the finding is refuted; the DEFECT under it is not.)
   *
   * This records two numbers. `renderContactBurst` draws the whole thing fresh
   * every frame from `burst.ts`, so there is no object that can outlive its own
   * clock — the same move H2 made one commit earlier when `puff()` became
   * `renderImpact`, and for the same stated reason: an effect that belongs to the
   * wall clock is a lottery in any given frame.
   *
   * The place is the TOUCH POINT the spec asks for, between the two bodies —
   * the old code used the being's own centre, which put the burst on the hero's
   * hips whenever he engaged something standing beside him.
   */
  contactSpark(id: string): void {
    if (this.cfg.reducedMotion) return; // the world simply freezes; nothing flies
    const e = this.world?.entities.find((x) => x.id === id);
    if (!e) return;
    this.burstAt = contactPoint(
      { x: fromSubs(this.player.x), y: fromSubs(this.player.y), h: HERO_DRAW_H },
      { x: fromSubs(e.x), y: fromSubs(e.y), h: this.entTargetH(e) },
    );
    this.burstMs = 0;
  }

  /**
   * PK-R6 · H2 · THE BURST, drawn (round-2 finding 2: „the contact frame has the
   * player, the enemy and the spark all sitting at the same washed-out
   * beige-gray value, so the collision reads as a blur, not a hit").
   *
   * Three value bands, all of them already in this book's palette and every one
   * of them a real step away from the warm classroom the hit happens in
   * (burst.ts): a chalk-white CORE above the room, a saturated amber HOT band
   * across it, and the book's own contour INK far below it. The ink is the band
   * that was missing entirely — the old burst's „dark" fleck was 0x3a2f1c, a warm
   * brown sitting inside the room's own value range.
   *
   * And it is drawn in two places on purpose: the light goes UNDER the two
   * bodies (a backlight, so the being gets an edge), the ink and the keyline go
   * OVER them (so the frame where the two drawings merge still has a hard line
   * through it). That is the „separate the silhouettes so the collision pose
   * stays legible mid-merge" half of the finding; the hero's own half is the rim
   * light in `renderPlayer`.
   */
  private renderContactBurst(): void {
    this.burstBackG.clear();
    this.burstG.clear();
    const at = this.burstAt;
    if (!at) return;
    const s = burstShape(this.burstMs);
    if (!s.alive) { this.burstAt = null; return; }
    const { x, y } = at;

    // ── the light, behind everything: a soft backlight that lifts both bodies
    // off the midground for as long as the flash lasts
    if (s.flash > 0) {
      for (let i = 0; i < 3; i++) {
        const k = 1 - i / 3;
        this.burstBackG.fillStyle(BURST_HOT, 0.26 * k * k * s.flash);
        this.burstBackG.fillCircle(x, y, s.ringR * (1.1 + i * 0.9));
      }
    }
    // …and the mark it leaves ON the page, so a frame caught late still says
    // „something hit here" instead of showing an empty patch of classroom
    this.burstBackG.fillStyle(BURST_INK, 0.26 * (1 - s.t) ** 2);
    this.burstBackG.fillCircle(x, y, 3.5 + 4 * s.t);

    // ── THE STAR: three spiked silhouettes stacked outward, one per band. This
    // is the shape a hit has and a lens does not — the first rebuild drew two
    // concentric rings here and the running game read them as a magnifier parked
    // over the collision, which is the very „circular icon" the critic filed.
    if (s.flash > 0) {
      const star = (r: number, inner: number, colour: number, alpha: number): void => {
        this.burstG.fillStyle(colour, alpha);
        this.burstG.fillPoints(starPoints(x, y, BURST_SPIKES, r, inner, 0.31), true);
      };
      // the bands hold FULL strength through the first half of the flash and
      // only let go at the tail: a band at half alpha is a tint, not a band, and
      // a tint is exactly what the round-2 squint test failed on
      const hold = Math.min(1, s.flash / 0.5);
      star(s.spokeLen * 1.18, s.ringR * 0.62, BURST_INK, 0.9 * hold);
      star(s.spokeLen * 0.9, s.ringR * 0.48, BURST_HOT, hold);
      star(s.spokeLen * 0.44, s.ringR * 0.24, BURST_CORE, 0.6 + 0.4 * hold);
    }
    // ── the keyline: the ink edge the star leaves behind, so a frame caught
    // after the flash still has one hard mark where the two bodies met. Drawn as
    // an ARC pair rather than a closed ring — a full circle is the lens again.
    const ka = 0.9 * (1 - s.t);
    if (ka > 0.02) {
      this.burstG.lineStyle(1.1 * s.flash + 0.5, BURST_INK, ka);
      this.burstG.beginPath();
      this.burstG.arc(x, y, s.keyR, 0.5, 2.5, false);
      this.burstG.strokePath();
      this.burstG.beginPath();
      this.burstG.arc(x, y, s.keyR * 1.08, 3.5, 5.4, false);
      this.burstG.strokePath();
    }

    // ── the flecks, thrown along their own headings and falling as they go
    for (let i = 0; i < SPARK_COUNT; i++) {
      const f = fleckOf(i);
      const life = Math.min(s.t / (0.45 + (i % 5) * 0.11), 1); // each has its own reach
      if (life >= 1) continue;
      const d = f.reach * life;
      const fx = x + Math.cos(f.ang) * d;
      const fy = y + Math.sin(f.ang) * d + 5 * life * life; // gravity, as the v0 emitter had
      const a = (1 - life) * 0.95;
      this.burstG.fillStyle(f.ink ? BURST_INK : BURST_CORE, a);
      if (f.streak) {
        // a streak is a wedge laid along its own heading — a still frame's only
        // way of showing that this speck is travelling
        const n = f.ang + Math.PI / 2;
        const half = f.size * 0.55;
        this.burstG.fillTriangle(
          fx + Math.cos(f.ang) * f.size * 3.2, fy + Math.sin(f.ang) * f.size * 3.2,
          fx + Math.cos(n) * half, fy + Math.sin(n) * half,
          fx - Math.cos(n) * half, fy - Math.sin(n) * half,
        );
      } else {
        this.burstG.fillCircle(fx, fy, f.size * (1 - 0.4 * life));
      }
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
   *
   * PK-R6 · H2 (round-2 finding 5: „the ‚shine' cue is two soft-edged flat white
   * ellipses … with no radiating rays or sparkle flecks"). Two things were true
   * at once: the fan above DID exist, and it was over in 520 ms — long gone by
   * the frame a still capture calls „restored" — leaving only the ADD bloom's
   * two blown-out buckle plates as the entire light. So the flourish now (a)
   * out-lives the colour flood (anim.RESTORE_SPARKLE_MS) and (b) is built out of
   * the two things a flat ellipse cannot fake: a SOFT OUTWARD LIGHT that keeps
   * spreading, and THIN STAR FLECKS with a direction — drawn in the gilded key
   * the collectible letters already wear, so the light of this book is one light.
   */
  private redeemFlourish(xPx: number, yPx: number, size = 1): void {
    const life = RESTORE_SPARKLE_MS;
    // ── the soft outward light: four rings, faintest outermost, expanding past
    // the thing they lit. Behind the being (6.94) — a glow drawn in front is a
    // veil over what it reveals, the same rule the boss's halo follows.
    const glow = this.add.graphics().setDepth(6.94);
    for (let i = 0; i < 4; i++) {
      const k = 1 - i / 4;
      glow.fillStyle(LETTER_HALO_COLOUR, 0.16 * k * k);
      glow.fillCircle(xPx, yPx, (11 + i * 7) * size);
    }
    if (this.cfg.reducedMotion) {
      this.time.delayedCall(420, () => glow.destroy());
    } else {
      glow.setScale(0.4);
      this.tweens.add({
        targets: glow, scale: 1.7, alpha: 0, duration: life,
        ease: "Sine.easeOut", onComplete: () => glow.destroy(),
      });
    }

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
        targets: rays, scale: 1.35, alpha: 0, angle: 14, duration: life * 0.62,
        ease: "Cubic.easeOut", onComplete: () => rays.destroy(),
      });
    }

    // ── the star flecks: five thin four-pointed sparks that travel outward and
    // turn as they go. `starPoints` with a small inner radius is what makes a
    // spark THIN — a fat star is a blob, which is the shape this beat was
    // filed for. Each is placed by its own index, so a replayed tape sparkles
    // identically (repo law: no Math.random anywhere in the game).
    const STARS = 5;
    for (let i = 0; i < STARS; i++) {
      const ang = (i / STARS) * Math.PI * 2 + 0.4;
      const reach = (20 + (i % 3) * 9) * size;
      const r = (2.6 + (i % 2) * 1.1) * size;
      const s = this.add.graphics().setDepth(9.15);
      s.fillStyle(i % 2 === 0 ? LETTER_HALO_COLOUR : 0xfffdf6, 0.95);
      s.fillPoints(starPoints(0, 0, 4, r, r * 0.16, i * 0.3).map((p) => new Phaser.Geom.Point(p.x, p.y)), true);
      s.setPosition(xPx, yPx);
      if (this.cfg.reducedMotion) {
        s.setPosition(xPx + Math.cos(ang) * reach, yPx + Math.sin(ang) * reach - 5);
        this.time.delayedCall(420, () => s.destroy());
        continue;
      }
      this.tweens.add({
        targets: s,
        x: xPx + Math.cos(ang) * reach,
        y: yPx + Math.sin(ang) * reach - 5,
        alpha: 0, scale: 0.35, angle: 90 + i * 18,
        delay: (i % 3) * 70, duration: life - (i % 3) * 120,
        ease: "Quad.easeOut", onComplete: () => s.destroy(),
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
        delay: (i % 4) * 45, duration: life * 0.8 + (i % 3) * 90,
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
  /**
   * PK-R6 · H2 · HOW HARD THE CHILD IS CHEERING, 0…1 (round-2 finding 4).
   *
   * A ramp rather than a switch, and a shape rather than a fade: he snaps into
   * the flare over the first sixth of the beat and comes down out of it over the
   * rest, so a still caught anywhere in the first half of the celebration shows
   * a boy with his arms up.
   *
   * Under reduced motion he is simply AT the flare for the whole beat and then
   * standing again — the same treatment `redeemFlourish` gives its own motes
   * (drawn still at the places the motion would have reached, cleared a beat
   * later). That is what the end-states law asks for here: a finished
   * celebration, never a half-raised arm frozen on its way up.
   */
  private cheerT(): number {
    const t = this.cheerMs / CHEER_MS;
    if (!(t >= 0) || t >= 1) return 0;
    if (this.cfg.reducedMotion) return 1;
    return t < 0.16 ? t / 0.16 : 1 - (t - 0.16) / 0.84;
  }

  /** PK-R6 · H2 · how lit the hero's rim is by the contact flash, 0…1 — the
   *  burst's own flash curve, so the light on him and the light in the air can
   *  never disagree about when the impact happened. */
  private contactRimT(): number {
    if (this.burstAt === null || this.cfg.reducedMotion) return 0;
    return burstShape(this.burstMs).flash;
  }

  private braceT(): number {
    const g = this.world?.entities.find(
      (e) => e.role === "guardian" && !e.redeemed && (e.state === "telegraph" || e.state === "throw"),
    );
    if (!g) return 0;
    if (g.state === "throw") return 1; // fully set for the release
    const need = Math.max(telegraphTicksFor(g.tier, g.hp, GUARDIAN_SCRIPT[g.tier].knots), 1);
    return Math.max(0, Math.min(1, g.timer / need));
  }

  /** How far into an attack beat she is, 0…1 — the tell's own progress, held at
   *  1 through the release. One read, used by her swell, by the child's brace and
   *  by the tell's dust, so the three can never disagree about when „now" is. */
  private bossBeatT(e: { role: string; state: string; timer: number; tier: "E" | "M" | "S"; hp: number }): number {
    if (e.role !== "guardian") return 0;
    if (e.state === "throw") return 1;
    if (e.state !== "telegraph") return 0;
    const need = Math.max(telegraphTicksFor(e.tier, e.hp, GUARDIAN_SCRIPT[e.tier].knots), 1);
    return Math.max(0, Math.min(1, e.timer / need));
  }

  /** How far DOWN her drawing has to be nudged so the top of the frame does not
   *  crop her, in px (0 almost always). A framing clamp, capped, presentation
   *  only — it never touches a byte of sim state, exactly like the camera lean. */
  private guardianKeepIn(img: Phaser.GameObjects.Image): number {
    const top = img.y - img.displayHeight;
    const camTop = fromSubs(this.camY) + 2;
    return Math.min(GUARDIAN_KEEPIN_MAX, Math.max(0, camTop - top));
  }

  /**
   * PK-R6 · H2 · HER OWN OUTLINE, LIT (round-2: the halo half of finding 1's
   * neighbourhood). An ADD-blended copy of the cell she is wearing, blown up
   * BOSS_HALO_SPREAD and laid behind her, so the separation is the shape of the
   * thing it separates. Built lazily per guardian, exactly like `giftGlow`.
   */
  private bossRim(id: string, img: Phaser.GameObjects.Image): void {
    let rim = this.bossRimImgs.get(id);
    if (!rim) {
      rim = this.add.image(img.x, img.y, img.texture.key).setOrigin(img.originX, img.originY).setDepth(6.8);
      rim.setBlendMode(Phaser.BlendModes.ADD).setTint(BOSS_HALO_COLOUR);
      this.bossRimImgs.set(id, rim);
    }
    rim.setVisible(img.visible).setTexture(img.texture.key);
    rim.setPosition(img.x, img.y + img.displayHeight * (BOSS_HALO_SPREAD - 1) * 0.5);
    rim.setScale(img.scaleX * BOSS_HALO_SPREAD, img.scaleY * BOSS_HALO_SPREAD);
    rim.setFlipX(img.flipX).setRotation(img.rotation).setAlpha(BOSS_HALO_ADD * img.alpha);
  }

  private renderBossGlow(): void {
    this.bossGlowG.clear();
    this.chargeG.clear();
    const g = this.world?.entities.find((e) => e.role === "guardian" && !e.redeemed);
    if (!g) { for (const r of this.bossRimImgs.values()) r.setVisible(false); return; }
    const img = this.entityImgs.get(g.id);
    if (!img || !img.visible) return;

    // ── the halo ──────────────────────────────────────────────────────────
    // Drawn under reduced motion too: it is a still picture, and it is the only
    // thing separating her from the shelf.
    this.bossRim(g.id, img);

    // ── the tell ──────────────────────────────────────────────────────────
    // PK-R6 · H2 (round-2 finding 1, critical). Chalk dust, gathering off her own
    // tray in the colour of the stick that is about to fly, plus the chalk
    // SKETCH of the throw drawn beside it — the diegetic pair the finding asked
    // for, in place of the vector glove.
    if (g.state !== "telegraph" || this.cfg.reducedMotion) return;
    const G = this.chargeG; // in FRONT of her body — see the field's own note
    const t = this.bossBeatT(g); // 0 at the rear, 1 at release
    // WHERE. On the chalk she is actually holding up — read off her drawing, not
    // off two fixed offsets (15/30 px landed the old glove squarely on her face).
    // The windup cells paint the raised stick near the TOP OUTSIDE corner of the
    // sheet, and the sheet's own facing is what `flipX` follows, so the side is
    // taken from the flip rather than from `dir`: measured in the running arena,
    // taking it from `dir` put the dust on the empty side while the painted chalk
    // sat on the other one.
    const side = img.flipX ? -1 : 1;
    const hx = img.x + side * img.displayWidth * 0.3;
    const hy = img.y - img.displayHeight * 0.9;
    const light = CHALK_LIGHT[nextChalkColourFor(g.throws)] ?? CHARGE_COLOUR;
    // the powder itself: soft, edgeless, in the colour of the stick that is about
    // to fly, drawn from the outside in as the tell runs out — so the cloud
    // TIGHTENS, and is the one shape on screen that is closing.
    const r = CHARGE_MAX_R * (1.05 - 0.4 * t);
    for (let i = 2; i >= 0; i--) {
      const k = 1 - i / 3;
      G.fillStyle(light, (0.16 + 0.3 * t) * k * k);
      G.fillCircle(hx, hy, r * (0.4 + i * 0.32));
    }
    G.fillStyle(CHARGE_CORE, 0.2 + 0.5 * t * t);
    G.fillCircle(hx, hy, r * 0.3);
    // the grains, pulled in along their own spokes. Angles are index-derived and
    // the drift is the sim's tick — deterministic, repo law.
    for (let i = 0; i < CHARGE_MOTES; i++) {
      const ang = (i / CHARGE_MOTES) * Math.PI * 2 + this.tickCount * 0.05;
      const d = r * (1.6 - 1.1 * t) * (0.7 + hash01(i * 977 + 13) * 0.6);
      G.fillStyle(light, 0.3 + 0.6 * t);
      G.fillCircle(hx + Math.cos(ang) * d, hy + Math.sin(ang) * d * 0.8, 0.6 + hash01(i * 31 + 5) * 0.8);
    }
    // …and the chalk SKETCH: three short strokes stepping out along the throw,
    // hand-drawn (each one laid twice, a soft wide pass under a fine one — the
    // same brushed edge the bubble's rim uses) and appearing one after another as
    // the tell runs out. It is her own hand showing the child where the piece is
    // going, in the piece's own colour, and it points at the CHILD (`dir`) rather
    // than at whichever side the sheet happens to have painted the stick on.
    for (let i = 0; i < 3; i++) {
      const on = Math.max(0, Math.min(1, t * 3 - i));
      if (on <= 0) break;
      const step = (i + 1) * CHARGE_MAX_R * 0.9;
      const sx = hx + g.dir * step;
      const sy = hy + step * 0.5 + Math.sin(i * 1.7) * 1.4;
      const len = 3.6 + i * 0.7;
      G.lineStyle(2.4, light, 0.2 * on);
      G.lineBetween(sx - g.dir * len * 0.5, sy - len * 0.24, sx + g.dir * len * 0.5, sy + len * 0.28);
      G.lineStyle(1.05, CHARGE_CORE, 0.7 * on);
      G.lineBetween(sx - g.dir * len * 0.5, sy - len * 0.24, sx + g.dir * len * 0.5, sy + len * 0.28);
    }
  }

  /**
   * PK-R6 · H2 · THE KNOT CORD (round-2 finding 4).
   *
   * „Anchor a persistent progress meter near the boss's easel so the player
   * always sees how far into the fight they are." It is a cord, not a bar: the
   * chapter's own unit for this fight is the KNOT (doc 44 §4 ch01 C4 — „three
   * knots of 5 windows"), the toast already says „Noch 2 Knoten!", and a health
   * bar would be the one piece of arcade furniture in a hand-painted book.
   *
   * Persistent whenever a live guardian is on screen, tied to her drawing so it
   * travels with her, and clamped into the frame so it survives her flying to the
   * top of her band. Read straight off `world.guardianKnots` — no second counter
   * to drift out of step with the one the HUD chip and the toast already share.
   */
  private renderKnotCord(): void {
    this.knotG.clear();
    const g = this.world?.entities.find((e) => e.role === "guardian" && !e.redeemed);
    if (!g) return;
    const img = this.entityImgs.get(g.id);
    if (!img || !img.visible) return;
    const total = GUARDIAN_SCRIPT[g.tier].knots;
    const left = Math.max(0, Math.min(total, this.world?.guardianKnots ?? total));
    if (total <= 0) return;
    const G = this.knotG;
    const w = (total - 1) * KNOT_SPACING;
    const cx = img.x;
    // above her top edge, and never above the top of the frame
    const cy = Math.max(fromSubs(this.camY) + 8, img.y - img.displayHeight - KNOT_CORD_LIFT);
    // THE CORD. It sags under its own weight, and every point on it is nudged by
    // a hash of its index — a cord drawn with a compass is a UI rule with a bend
    // in it. Deterministic: same index, same nudge, forever.
    const SEG = 18;
    const sag = (t: number): number =>
      cy + Math.sin(t * Math.PI) * 2.4 + (hash01(Math.round(t * 100) * 733 + 17) - 0.5) * 0.7;
    const pts: Phaser.Geom.Point[] = [];
    for (let i = 0; i <= SEG; i++) {
      const t = i / SEG;
      pts.push(new Phaser.Geom.Point(cx - w / 2 - 3 + (w + 6) * t, sag(t)));
    }
    // laid twice: the slate's shadow under a chalk line that is not the same
    // weight all the way along (the brushed edge — see paintedBubblePath)
    G.lineStyle(2.4, KNOT_SHADOW, 0.26).strokePoints(pts, false);
    G.lineStyle(1.4, KNOT_CHALK, 0.5).strokePoints(pts, false);
    G.lineStyle(0.7, KNOT_CHALK_LIT, 0.9).strokePoints(pts, false);
    for (let i = 0; i < total; i++) {
      const t = w <= 0 ? 0.5 : (i * KNOT_SPACING + 3) / (w + 6);
      const x = cx - w / 2 - 3 + (w + 6) * t;
      const y = sag(t);
      const tied = i < left; // knots come undone from the LEFT as she loses them
      const lean = (hash01(i * 977 + 31) - 0.5) * 0.9; // each knot sits its own way
      if (tied) {
        // A KNOT IS A LUMP, NOT A BEAD. The cord doubles back on itself: a fat
        // short stroke across the line, a loop thrown over it, and the crease
        // where the two bights bite. Nothing here is a circle and nothing is
        // filled pure white.
        G.lineStyle(2.9, KNOT_SHADOW, 0.28);
        G.lineBetween(x - KNOT_R + 0.7, y + 1.2 + lean, x + KNOT_R + 0.7, y + 0.7 - lean);
        G.lineStyle(2.7, KNOT_CHALK, 0.92);
        G.lineBetween(x - KNOT_R, y + 0.5 + lean, x + KNOT_R, y - lean);
        G.lineStyle(1.5, KNOT_CHALK_LIT, 0.75);
        G.lineBetween(x - KNOT_R * 0.7, y - 0.5 + lean, x + KNOT_R * 0.55, y - 0.9 - lean);
        // the bight thrown over the top, and the crease under it
        G.lineStyle(1.2, KNOT_CHALK, 0.8);
        G.beginPath();
        G.arc(x, y - 0.2, KNOT_R * 0.86, Math.PI * 0.9, Math.PI * 2.2, false);
        G.strokePath();
        G.lineStyle(0.8, KNOT_SHADOW, 0.4);
        G.lineBetween(x - 0.9, y + 0.9 + lean, x + 1.1, y + 0.4 - lean);
      } else {
        // UNDONE: the cord has gone slack here. An open bight that does not close,
        // in spent chalk, with the loose end falling out of it — „you already did
        // this", said in the material the cord is made of.
        G.lineStyle(1.6, KNOT_SHADOW, 0.2);
        G.beginPath();
        G.arc(x + 0.6, y + 0.9, KNOT_R * 0.72, Math.PI * 1.15, Math.PI * 2.6, false);
        G.strokePath();
        G.lineStyle(1.1, KNOT_DONE, 0.85);
        G.beginPath();
        G.arc(x, y + 0.3, KNOT_R * 0.72, Math.PI * 1.15, Math.PI * 2.6, false);
        G.strokePath();
        G.lineStyle(0.9, KNOT_DONE, 0.5);
        G.lineBetween(x + KNOT_R * 0.5, y + KNOT_R * 0.6, x + KNOT_R * 1.3, y + KNOT_R * 1.6);
      }
    }
  }

  /**
   * PK-R6 · H2 · THE MOTION BLUR OF A BARREL ROLL (round-2 finding 3).
   *
   * „A corkscrew rotation with a motion-blur trail for the spiral loop." The
   * golden tail says WHERE she has been; it cannot say what her body was doing on
   * the way. So the ghosts are her, three cells back, drawn where she wore them
   * and at the width she wore them — which is what makes a still frame of a roll
   * show a roll rather than a board at an angle.
   *
   * Only while she is actually corkscrewing (the same classifier the cell and the
   * roll read), and never under reduced motion: it is nothing but movement.
   */
  private renderGhosts(): void {
    const g = this.world?.entities.find((e) => e.role === "guardian" && !e.redeemed);
    const img = g ? this.entityImgs.get(g.id) : undefined;
    const rolling = g !== undefined && img !== undefined && img.visible
      && !this.cfg.reducedMotion
      && AIRBORNE_STATES.has(g.state)
      && guardianManoeuvre(g.vx, g.vy) === "spiral";
    if (!rolling || !img) { this.ghosts.length = 0; for (const i of this.ghostImgs) i.setVisible(false); return; }
    // sampled on the SIM's tick, so a card that freezes the world freezes the
    // blur with it (the lesson `renderTrail` banked: a presentation clock keeps
    // stacking copies under a boss who is holding still)
    if (this.tickCount !== this.trailAt) {
      this.ghosts.push({
        key: img.texture.key, x: img.x, y: img.y, rot: img.rotation,
        sx: img.scaleX, sy: img.scaleY, flip: img.flipX,
      });
      while (this.ghosts.length > GHOST_COUNT) this.ghosts.shift();
    }
    for (let i = 0; i < GHOST_COUNT; i++) {
      const p = this.ghosts[this.ghosts.length - 1 - i];
      let ghost = this.ghostImgs[i];
      if (!ghost) {
        ghost = this.add.image(0, 0, img.texture.key).setOrigin(0.5, 1).setDepth(6.93);
        this.ghostImgs[i] = ghost;
      }
      if (!p) { ghost.setVisible(false); continue; }
      ghost.setVisible(true).setTexture(p.key).setPosition(p.x, p.y).setRotation(p.rot);
      ghost.setScale(p.sx, p.sy).setFlipX(p.flip);
      ghost.setAlpha(GHOST_ALPHA * (1 - i / (GHOST_COUNT + 1)));
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
    // PK-R6 · H2 · THE TWO PRESENTATION CLOCKS (round-2 findings 1, 2 and 4).
    // Both beats they drive — the contact burst and the child's cheer — happen at
    // moments the SIM is deliberately frozen for a card (`Sim.step` returns early
    // and never increments `tickCount`), so a sim-tick clock would leave both of
    // them stopped on their first frame. The camera lean already runs on exactly
    // this clock for exactly this reason and, like the lean, neither of these
    // touches a single byte of sim state: the shapes they draw are pure functions
    // of indices, so a replayed tape draws them identically.
    this.burstMs += this.frameMs;
    this.cheerMs += this.frameMs;
    this.awakenRoomMs += this.frameMs;
    this.renderAwakenRoom();
    this.renderReadability();
    this.renderAir();
    this.renderLetterFx();
    this.bossPushMs += this.frameMs;
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
    const pose2 = withBrace(pose1, this.braceT());
    // PK-R6 · H2 (round-2 finding 4): …and he CHEERS when the answer lands. The
    // beat runs on the presentation clock because the world is frozen for the
    // card while it plays — see `cheerT`.
    const cheer = this.cheerT();
    const pose = withCheer(pose2, cheer);

    // ── PK-R6 · H3 · THE FULL-POSE OVERRIDE ────────────────────────────────
    // When a hero2 cell exists for this frame's state, the authored full-body
    // painting replaces the composed parts whole (rigSpec.heroFullCell — the
    // answer to two rounds of „run reads as idle / no squash / frozen face").
    // The container keeps position + facing; the PROCEDURAL squash is dropped
    // under the override because the landing cell carries its squash in paint —
    // stacking both would over-squash the one frame that finally has it.
    const fullCell = heroFullCell(
      this.player.pose, this.player.walkTime, this.player.vy,
      this.player.landedAgo, cheer > 0, this.heroAtEdge(), this.tickCount,
    );
    const full = fullCell !== null && this.textures.exists(this.tex(fullCell)) ? fullCell : null;
    this.rigRoot.setPosition(fromSubs(this.player.x), fromSubs(this.player.y) - 15);
    this.rigRoot.setScale(this.player.facing * (full !== null ? 1 : pose.scaleX), full !== null ? 1 : pose.scaleY);
    const flicker = this.player.iframes > 0 && this.player.iframes % 8 < 4;
    this.rigRoot.setAlpha(flicker ? 0.45 : 1);
    // ── PK-R6 · H2 · THE CONTACT RIM (round-2 findings 2 and 8) ───────────────
    // „Separate the two characters' silhouettes with a rim-light so the collision
    // pose stays legible even mid-merge." He already carries a full copy of his
    // own rig for the cast shadow, so the rim costs nothing new: for the length
    // of the burst's flash that copy is re-lit in the burst's core colour and
    // thrown to the far side of the impact — which is what a bright flash beside
    // a boy actually does to his outline. It fades with the flash, so nothing can
    // leave him permanently glowing.
    const rim = this.contactRimT();
    // …and it leans TOWARD the flash, not away from it: a light to his right
    // lights his right edge, and his right edge is exactly where his drawing and
    // the being's drawing overlap. The swell does most of the work (it rims him
    // all round); this bias puts the thickest part of it at the merge.
    const rimToward = this.burstAt !== null && this.burstAt.x >= fromSubs(this.player.x) ? 1 : -1;
    // PK-R6 · H2 (round-2 finding 1): the copy is the ROOM's — see `heroEdgeFor`.
    // In a lit hall it is his shade, thrown down-and-behind; in the night
    // classroom and on the dusk stage it is his rim, hugging him, because a dark
    // outline on a dark wall separates nothing.
    const edge = this.heroEdge();
    this.rigShadow.setPosition(
      fromSubs(this.player.x) + (-this.player.facing * edge.dx) * (1 - rim) + rimToward * CONTACT_RIM_PX * rim,
      fromSubs(this.player.y) - 15 + edge.dy * (1 - rim) - 0.5 * rim,
    );
    // …and it SWELLS rather than slides: a bright copy merely offset reads as a
    // second boy standing behind him (measured in the running build — his own
    // hand appeared twice). Scaled up a little around the same centre, the copy
    // shows only past his edges, which is what an outline is.
    // PK-R6 · H2: that swell is now his BASE state and not only the flash's — it
    // is the one device that survives a 25 % squint, because blurring a dark ring
    // leaves a dark ring while blurring a small dark figure leaves the wall.
    const swell = 1 + edge.swell + (CONTACT_RIM_SWELL - edge.swell) * rim;
    this.rigShadow.setScale(
      this.player.facing * (full !== null ? 1 : pose.scaleX) * swell,
      (full !== null ? 1 : pose.scaleY) * swell,
    );
    this.rigShadow.setAlpha(flicker ? 0 : edge.alpha * (1 - rim) + CONTACT_RIM_ALPHA * rim);

    // the override sprite and its shadow twin follow the same texture; the
    // composed parts hide while it speaks and return the frame it goes null
    // (hang, swing, vine — the states the v2 sheet does not paint).
    this.heroFull.setVisible(full !== null);
    this.heroFullShadow.setVisible(full !== null);
    if (full !== null) {
      const key = this.tex(full);
      this.heroFull.setTexture(key);
      this.heroFullShadow.setTexture(key).setTint(rim > 0 ? CONTACT_RIM_TINT : edge.tint);
    }

    const apply = (name: RigPartName, dx: number, dy: number, rot: number, hidden: boolean, frame?: number): void => {
      for (const img of [this.parts.get(name), this.shadowParts.get(name)]) {
        if (!img) continue;
        img.setPosition(dx, dy).setRotation(rot).setVisible(!hidden && full === null);
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
    const hands = handStemsFor(this.player.pose, landAgo, cheer > 0);
    const skin: Array<[RigPartName, string]> = [
      // PK-R6 · H2 (round-2 findings 4 and 9): `celebrating` used to be a
      // hard-coded `false` here, which is why the boy wore the same near-neutral
      // face through „receiving", „Danke!" and „winning" — the commissioned
      // celebrate cell was unreachable in the running game.
      ["head", faceFor(this.player.pose, this.tickCount, cheer > 0, landAgo, this.focusId !== null)],
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
      const shade = this.shadowParts.get(name);
      // the shadow copy is the RIM copy while a contact flash is on him
      shade?.setTexture(key).setTint(rim > 0 ? CONTACT_RIM_TINT : edge.tint);
    }
    this.renderContact();
    this.renderContactBurst();

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
    // PK-R6 · H2: the boss's halo, her roll-blur and her knot cord are all READ
    // OFF her sprite as `renderEntities` has just left it (position, scale, roll,
    // cell) — so they run after it. Before it they would have been drawing last
    // frame's boss, which at the sizes and speeds this round introduces is a
    // halo visibly lagging its own body.
    this.renderBossGlow();
    this.renderGhosts();
    this.renderHostiles();
    this.renderEngageCue();
    this.renderEvidence();
    this.renderGift();
    this.renderKnotCord();

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
    // PK-R6 · H2 · THE FIGHT'S OWN PUSH-IN (round-2 finding 8: „add camera
    // push-in at fight start … to create real depth and rising stakes").
    //
    // The same device as the card lean, on the same clock, through the same pure
    // `focusView` — so it inherits the property that matters: the zoom only ever
    // goes UP. That is not taste, it is the coverage law (doc 36 §4.2, audit 2 of
    // check-composition): the painted planes are proven to cover the camera's
    // travel box AT RENDER_SCALE, and a view that ever zoomed OUT would be
    // showing world the backdrop was never sized for. A push-in cannot.
    //
    // It fires on the two beats the fight actually has — the child arriving in
    // the arena with her already in the air, and each counter-window opening as
    // she comes down — and each beat spends its push once (`pushedBeats`), so a
    // held state cannot re-trigger it every tick.
    this.pumpBossPush();
    const push = this.bossPushT();
    const asker = this.focusId === null ? undefined : this.world?.entities.find((e) => e.id === this.focusId);
    // the asker's place is REMEMBERED, so the lean has somewhere to ease back
    // FROM after the card closes (and after a redeemed being wanders off)
    if (asker) this.focusAt = { x: fromSubs(asker.x), y: fromSubs(asker.y) };
    const stepT = this.cfg.reducedMotion ? 1 : this.frameMs / FOCUS_MS;
    this.focusT = Math.min(1, Math.max(0, this.focusT + (asker ? stepT : -stepT)));
    // a card outranks the fight's own framing: when somebody is asking, the book
    // leans on THEM (R3-8), and two leans at once would be a wrestle
    if (this.focusT <= 0 && push > 0 && this.bossPushId !== null) {
      const boss = this.world?.entities.find((e) => e.id === this.bossPushId);
      if (boss) {
        const v = focusView(
          fromSubs(this.camX), fromSubs(this.camY),
          fromSubs(boss.x), fromSubs(boss.y),
          push,
          this.worldWpx, this.worldHpx,
        );
        this.cameras.main.setZoom(RENDER_SCALE * v.zoom);
        this.cameras.main.centerOn(v.cx, v.cy);
        return;
      }
    }
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

  /** Which boss beat, if any, wants the camera this frame — and starts its clock
   *  the first time it is seen. Named beats, so a held state spends one push. */
  private pumpBossPush(): void {
    const g = this.world?.entities.find((e) => e.role === "guardian" && !e.redeemed);
    if (!g) return;
    // „the fight starts" = the first frame the child and the boss are in the same
    // room with her in the air; „the window opens" = every dip.
    const beat = g.state === "dip" ? `dip:${g.hp}` : this.bossPushId === null ? "enter" : "";
    if (beat === "" || this.pushedBeats.has(beat)) return;
    this.pushedBeats.add(beat);
    this.bossPushId = g.id;
    this.bossPushMs = 0;
  }

  /** How far the fight's push-in has pushed, 0…1 — in and back out over
   *  BOSS_PUSH_MS. 0 under reduced motion: it is a camera move and nothing else. */
  private bossPushT(): number {
    if (this.cfg.reducedMotion) return 0;
    const t = this.bossPushMs / BOSS_PUSH_MS;
    if (!(t >= 0) || t >= 1) return 0;
    // in over the first fifth, held, then out — the shape a stakes beat wants
    return t < 0.2 ? t / 0.2 : t < 0.55 ? 1 : 1 - (t - 0.55) / 0.45;
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
      // PK-R6 · H2 (round-2 finding 5): the beam is filled as a GRID of thin
      // pieces — rings across it and bands down it — so its rim accumulates to
      // nothing sideways and it runs out rather than stopping. The three flat
      // nested quads this replaces are the „crisp, unblended straight edge" the
      // critique cropped off the arena bookshelf. Geometry unchanged: every piece
      // is bilinear INSIDE the planned quad, so the gameplay-band clamp holds.
      for (const q of shaftQuads(shaft)) {
        beam.fillStyle(shaft.colour, q.alpha);
        beam.fillPoints(q.points.map(([x, y]) => new Phaser.Geom.Point(x, y)), true);
      }
    }

    // ── PK-R6 · H2 · THE FURNITURE'S FOOT (round-2 finding 9) ────────────────
    // The room's dark gathering where the furniture band meets the ground, on
    // the band's own plane and at its own scroll factors. This is the horizon
    // line the whole frame organises around, and it was one flat value.
    const shade = planBandShade(this.comp?.mid, this.worldWpx, this.worldHpx);
    if (shade !== null) {
      const ink = mixRGB(ROOM_SHADOW_INK, this.comp?.wash.colors[2] ?? ROOM_SHADOW_INK, 0.25);
      const sg = this.add.graphics().setDepth(shade.depth).setScrollFactor(shade.parallax, shade.parallaxY);
      sg.fillGradientStyle(ink, ink, ink, ink, 0, 0, shade.alphaBottom, shade.alphaBottom);
      sg.fillRect(shade.x, shade.y, shade.w, shade.h);
    }

    // ── PK-R6 · H2 · THE FIXTURE (round-2 finding 9) ────────────────────────
    // The beam's own source, drawn where the beam starts. Three marks, in the
    // order a painter would lay them: the housing (a dark trapezoid hanging
    // mouth-down, so the shape reads as a lamp rather than as a blob), the hot
    // lens across its mouth, and the bloom that spills past the rim. Placed
    // once, on the beam's plane and at the beam's scroll factor — a lamp that
    // parallaxed differently from its own light is the same defect one layer up.
    for (const src of planSources(air, this.worldWpx, this.worldHpx)) {
      const lamp = this.add.graphics().setDepth(src.depth - 0.01).setScrollFactor(src.parallax, src.parallaxY);
      const hw = src.halfW;
      const d = src.depthPx;
      // the housing: narrow at the ceiling, open at the mouth
      lamp.fillStyle(STAGE_LAMP_BODY, 0.9);
      lamp.fillPoints([
        new Phaser.Geom.Point(src.x - hw * 0.46, src.y - d),
        new Phaser.Geom.Point(src.x + hw * 0.46, src.y - d),
        new Phaser.Geom.Point(src.x + hw * 0.94, src.y),
        new Phaser.Geom.Point(src.x - hw * 0.94, src.y),
      ], true);
      // the rim it hangs from — a bar of the same iron, so it is FITTED to the
      // ceiling rather than floating in front of it
      lamp.fillStyle(STAGE_LAMP_BODY, 0.75);
      lamp.fillRect(src.x - hw * 0.16, src.y - d - 5, hw * 0.32, 5);
      // the lens, and the bloom that spills past its rim
      lamp.fillStyle(src.colour, src.alpha);
      lamp.fillEllipse(src.x, src.y - 0.5, hw * 1.7, d * 0.42);
      lamp.fillStyle(src.colour, src.alpha * 0.45);
      lamp.fillEllipse(src.x, src.y, hw * 2.5, d * 0.8);
      lamp.fillStyle(STAGE_LAMP_CORE, Math.min(1, src.alpha * 1.5));
      lamp.fillEllipse(src.x, src.y - 1, hw * 0.85, d * 0.24);
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

  /**
   * R5-W1 · A2 · THE CROWN — the ink's surface, redrawn every tick.
   *
   * Two strokes, never one: a lit lip on the wave and a dark line under it. A
   * single lighter band (what shipped before) reads as a change of fill colour;
   * a boundary between two values is what the eye reads as the place where one
   * material stops and another begins.
   */
  private drawInkCrown(): void {
    const g = this.inkCrownG;
    if (g === null || this.inkRuns.length === 0) return;
    const tick = this.tickCount;
    g.clear();
    for (const run of this.inkRuns) {
      const pts = inkCrownPoints(run.x0, run.x1, tick);
      // the dark line first, a hair lower — it is the shadow the lip casts into
      // its own liquid, so it must never be drawn over the lip
      g.lineStyle(1.6, INK_CROWN_DARK, 0.85).beginPath();
      pts.forEach((p, i) => (i === 0 ? g.moveTo(p.x, run.y + p.y + 2.2) : g.lineTo(p.x, run.y + p.y + 2.2)));
      g.strokePath();
      g.lineStyle(1.4, INK_CROWN_LIT, 0.95).beginPath();
      pts.forEach((p, i) => (i === 0 ? g.moveTo(p.x, run.y + p.y) : g.lineTo(p.x, run.y + p.y)));
      g.strokePath();
    }
  }

  /** Place one planned mass piece (doc 36 §2). */
  private placeMassPiece(p: MassPiece): void {
    if (p.stem === null) return; // fallbackFill — the graphics pass drew it
    const key = `pb-${p.stem}`;
    if (!this.textures.exists(key)) return; // only-present law
    // PK-R6 · H2 (round-2 finding 7): the nearest standable plane is laid in its
    // own light — see composition.nearPlaneTint for the measurements and for why
    // the push is scaled by the room's key rather than fixed. Combined with
    // whatever the plan already asked for, so the no-metronome value jitter on a
    // tiled run survives being pushed forward.
    // R5-A3 · THE SEPARATION IS FOR EVERYTHING YOU CAN STAND ON.
    //
    // B1's critic named the systemic cause of the sunny rooms: „in den sonnigen
    // Leveln gibt es keine materielle Trennung zwischen dem, worauf man stehen
    // kann, und dem, was nur gemalt ist" — and pointed at p2 as the proof we can
    // do it. p2 works because it is a DARK room: its lit terrain separates from
    // its own walls for free. p1 and p3 are pale rooms with pale terrain, and
    // there the child has to read affordance out of hue alone.
    //
    // The near-plane law already existed and already said the right thing; it
    // was only ever asked of the floating platform objects. It is now asked of
    // every WALK SURFACE — the course, its end caps, the ramps and the platform
    // objects. Deliberately NOT of body/fade/sediment: those are the mass BELOW
    // the standing line, they already carry A1's depth ramp, and pushing them
    // too would darken the depths back toward the holes that round removed.
    // The question the law answers is "can I stand on this?", so it is exactly
    // the standable things that get the answer.
    if (NEAR_PLANE_KINDS.has(p.kind)) {
      p = { ...p, tint: mixMultiply(p.tint ?? 0xffffff, nearPlaneTint(this.comp?.key ?? 88)) };
    }
    if (p.tile === true) {
      const src = this.textures.get(key).getSourceImage() as HTMLImageElement;
      // the drawn scale and the world anchor both come from mass.ts, because the
      // audits ask the same two functions — a second copy of this arithmetic is
      // what let the shipped build and its green gates disagree (R5-W1 · A1)
      const scale = tileScaleFor(p, { w: src.width, h: src.height });
      const anchor = tileAnchorFor(p, scale);
      const t = this.add.tileSprite(p.x, p.y, p.w, p.h, key).setOrigin(0, 0).setDepth(p.depth);
      t.setTileScale(scale.x, scale.y);
      t.tilePositionX = anchor.x;
      t.tilePositionY = anchor.y;
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
          // R5-W1 · A2 · THE INK IS OPAQUE NOW (B1's critic: „halbtransparent —
          // man sieht in p2 die Wandkarte durch den See"). Ink is the one
          // substance in the chapter whose whole fiction is that it swallows
          // things; at alpha 0.92 the classroom's wall map showed straight
          // through the lake. Full alpha, and a value that DEEPENS with depth,
          // so a pool reads as having a bottom the way the terrain does.
          const depth = Math.min(inkDepthAt(this.grid, c, r), INK_DEPTH_ROWS);
          fill.fillStyle(mixMultiply(INK_BODY, inkDepthTint(depth)), 1);
          fill.fillRect(c * TILE, r * TILE, TILE, TILE);
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
    // R5-W1 · A2 · THE INK MOVES, ALWAYS. The surface strip was a STATIC
    // tileSprite: B1's critic measured it moving „um kein einziges Pixel" over
    // 45 ticks, which is what made a lake read as a painted rectangle. Its
    // texture now drifts and it carries a crown that rises and falls — both
    // pure functions of the SIM TICK (ink.ts), so a replay draws the same water
    // twice and the wave is assertable without a screenshot.
    if (this.textures.exists("pb-pool_ink_loop")) {
      const dh = 16;
      const ts = dh / srcH("pool_ink_loop");
      runs(
        (c, r) => glyphAt(this.grid, c, r) === "w" && glyphAt(this.grid, c, r - 1) !== "w",
        (c0, c1, r) => {
          const t = this.add.tileSprite(c0 * TILE, r * TILE, (c1 - c0 + 1) * TILE, dh, "pb-pool_ink_loop")
            .setOrigin(0, 0).setDepth(3).setTileScale(ts);
          this.inkSurfaces.push(t);
          this.inkRuns.push({ x0: c0 * TILE, x1: (c1 + 1) * TILE, y: r * TILE });
        },
      );
      // …and the crown rides just above them
      this.inkCrownG = this.add.graphics().setDepth(3.1);
      this.drawInkCrown();
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
      // R5-W1 · A1 — THE PLAN THE AUDITS SEE IS NOW THE PLAN THAT SHIPS.
      // This call omitted `srcSize`, so `planMass`'s `aspect()` answered 1 for
      // every stem in the browser while every audit and every test fed it the
      // real PNG geometry. The build was therefore drawing crust end caps at
      // 17 px instead of 41, admitting caps on 2-cell runs the audit believes
      // are too short to carry them, and sizing every floating platform object
      // by its WIDTH alone — a 946×259 bench rendered 32×32 instead of 32×9.
      // Three visible defects that no green gate could ever have reported.
      const plan = planMass(this.grid, kit, (stem) => {
        const tex = this.textures.exists(`pb-${stem}`) ? this.textures.get(`pb-${stem}`) : null;
        const img = tex?.getSourceImage() as HTMLImageElement | undefined;
        return img === undefined ? null : { w: img.width, h: img.height };
      });
      // ── PK-R6 · H2 · WHAT THE FURNITURE THROWS (round-2 finding 9) ─────────
      // Read off the SAME plan the renderer is about to place, never re-planned:
      // a shadow computed from a second call would be a shadow of a different
      // bench the moment either side of that arithmetic moves.
      // Depth 0.8 — behind every piece of terrain (mass starts at 1) and a whole
      // plane in front of the furniture band, which is where a near object's
      // shadow belongs.
      const shadows = planPlatformShadows(plan);
      if (shadows.length > 0) {
        const ink = mixRGB(ROOM_SHADOW_INK, this.comp?.wash.colors[2] ?? ROOM_SHADOW_INK, 0.22);
        const g = this.add.graphics().setDepth(0.8);
        for (const s of shadows) {
          // darkest where it touches the object, gone at its own foot — and
          // drawn in three inset steps so the pool has no straight sides either
          for (let i = 0; i < 3; i++) {
            const k = i / 3;
            g.fillStyle(ink, (s.alpha / 3) * (1 - k * 0.35));
            g.fillEllipse(s.x + s.w / 2, s.y + s.h * 0.35, s.w * (1 - k * 0.22), s.h * (1.1 - k * 0.3));
          }
        }
      }
      for (const piece of plan) this.placeMassPiece(piece);
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
    //
    // R5-W1 · F1 (Kokis Replay, 07:26:32: „bewegt sich nicht deutlich"). Das
    // Rütteln stand hier und war ±0,07 rad — auf einem 22-px-Körper, unten
    // gelagert, sind das 1,5 logische Pixel. Es war nicht kaputt, es war zu
    // klein, und es konnte an dieser Stelle auch gar nicht mehr sein als eine
    // Drehung: renderEntities überschreibt die Skalierung eine Methode später.
    // Beides ist nach `anim.cageBreath` + `renderEntities` gezogen — dort ist
    // der Ausschlag in PIXELN definiert, die Silhouette darf sich verformen,
    // und der Schattenwurf macht es mit.
  }

  /** Wie nah steht das Kind an diesem Käfig? (0…1, als Rampe — siehe anim.) */
  private cageNearT(e: EntityState): number {
    return cageNearT(
      fromSubs(e.x) - fromSubs(this.player.x),
      fromSubs(e.y) - fromSubs(this.player.y),
    );
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
    // PK-R6 · H2 · the leaves (round-2 finding 13). Drawn on their own canvas
    // because they ride the FURNITURE plane's scroll factors, not the room's:
    // they are turning over in the scenery, a whole plane behind the child.
    this.lifeG.clear();
    for (const l of planLife(air, this.worldWpx, this.worldHpx, tick)) {
      // an ellipse whose short axis IS how far the leaf has turned — edge-on it
      // is a line and nearly transparent, face-on it is a leaf. One number, and
      // it is the difference between „a leaf" and „a green speck".
      this.lifeG.fillStyle(l.colour, l.alpha);
      this.lifeG.save();
      this.lifeG.translateCanvas(l.x, l.y);
      this.lifeG.rotateCanvas(l.rot * 0.4);
      this.lifeG.fillEllipse(0, 0, l.r * 2, l.r * 2 * l.face);
      this.lifeG.restore();
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
    // a bright room separates a being with INK, a dark one with CHALK — the H1
    // split, unchanged; only the shape it is painted in has changed
    const ink = (this.comp?.key ?? 88) >= HOSTILE_HALO_KEY_SPLIT;
    const colour = ink ? HOSTILE_HALO_DARK : HOSTILE_HALO_LIGHT;
    for (const e of this.world?.entities ?? []) {
      const shade = this.hostileShadeImgs.get(e.id);
      if (!shade) continue;
      const img = this.entityImgs.get(e.id);
      if (!img || !img.visible) { shade.setVisible(false); continue; }
      // the WARNING half ends at redemption (the being has been named and is not
      // a threat any more); the plain cast shadow does not, because a freed moth
      // still stands in the same room. So a redeemed being keeps the copy at its
      // H1 numbers and loses only the rim.
      const warn = JOY_ROLES.has(e.role) && !e.redeemed;
      // the beat's offset is the being's NAME, not its position: keying it to
      // e.x would re-seed the phase every tick (x moves in subs) and the breath
      // would come out as flicker
      const seed = entSeed(e.id);
      const beat = this.cfg.reducedMotion || !warn
        ? 1
        : 1 - HOSTILE_HALO_PULSE + HOSTILE_HALO_PULSE * (0.5 + 0.5 * Math.sin(this.tickCount / 13 + hash01(seed) * Math.PI * 2));
      const spread = warn ? HOSTILE_RIM_SPREAD : 1;
      shade.setVisible(true);
      shade.setTexture(img.texture.key);
      // grown around its own centre (the sprite is anchored at its feet, so the
      // half-height correction is what keeps the rim even rather than pushing the
      // being up out of its own shadow), and thrown less the more it is a rim
      shade.setPosition(
        img.x + (warn ? HOSTILE_RIM_DX : HERO_SHADOW_DX * 0.7),
        img.y + (warn ? HOSTILE_RIM_DY : HERO_SHADOW_DY * 0.7) + img.displayHeight * (spread - 1) * 0.5,
      );
      shade.setScale(img.scaleX * spread, img.scaleY * spread);
      shade.setFlipX(img.flipX).setRotation(img.rotation);
      shade.setTint(warn ? colour : HERO_SHADOW_TINT);
      // chalk is ADDED (a dark room takes light) and ink is laid flat (a bright
      // room takes shade) — the same asymmetry the hero's own edge follows
      shade.setBlendMode(warn && !ink ? Phaser.BlendModes.ADD : Phaser.BlendModes.NORMAL);
      const rimAlpha = ink ? HOSTILE_RIM_ALPHA_INK : HOSTILE_RIM_ALPHA_CHALK;
      shade.setAlpha((warn ? rimAlpha : HOSTILE_SHADOW_ALPHA) * beat * img.alpha);
    }
  }

  /**
   * PK-R6 · H2 · THE ROOM ANSWERS (round-2 finding 3: „06 midwash, 07 final
   * flood and 08 joy share the same dim navy-purple room, the same lighting, and
   * no added glow/particle/bloom layer — flipping between the labeled ‚midwash'
   * and ‚final flood' frames shows no discernible difference in intensity").
   *
   * Every light the ceremony owned was drawn ON A BEING — `floodBloomFor` is a
   * copy of Merle's own 30-px silhouette in a 384-px-wide room, which is a
   * change roughly three percent of the frame wide. Six rounds of work ended in
   * a picture indistinguishable from the round before it.
   *
   * This is the beat's own light, and it belongs to the ROOM: a warm bloom born
   * at her, sweeping outward past the frame (`awakenRoomSweep`), over an ADD
   * wash that warms the whole palette for as long as it lasts. It is drawn in
   * CAMERA space so it covers whatever the child can see, and it fires on the
   * sixth answer only — the five rounds before it are progress, and a beat that
   * marks everything marks nothing.
   *
   * Scaled by the room's own key: light reads against darkness, so the night
   * classroom (K=30) takes nearly all of it and a sunlit hall would take a third.
   * Reduced motion draws none of it — a bloom is nothing but a change over time,
   * and the end-states law asks for the finished picture, which is the room
   * afterwards (the same rule `floodBloomFor` follows).
   */
  private renderAwakenRoom(): void {
    this.awakenRoomG.clear();
    const at = this.awakenRoomAt;
    if (!at || this.cfg.reducedMotion) return;
    // the beat is retired by its own CLOCK, never by „it is drawing nothing
    // right now": the light is legitimately 0 on the frame it is fired (the rise
    // starts from nothing), and a single zero-delta frame there would otherwise
    // cancel the chapter's payoff before it had drawn once
    if (this.awakenRoomMs >= AWAKEN_ROOM_MS) { this.awakenRoomAt = null; return; }
    const a = awakenRoomBloom(this.awakenRoomMs);
    if (a <= 0) return;
    // how much light this room can take before it stops reading as light
    const key = this.comp?.key ?? 88;
    const room = 1 - Math.min(key, 100) / 140;
    // drawn in WORLD coordinates at the camera's own rect, exactly as the
    // vignette is: the camera carries a zoom (RENDER_SCALE, and more during a
    // focus lean), and a scroll-factor-0 rectangle would be scaled about the
    // camera's centre instead of covering the frame
    const camX = fromSubs(this.camX);
    const camY = fromSubs(this.camY);
    // ── the palette warms, everywhere at once
    this.awakenRoomG.fillStyle(AWAKEN_ROOM_WARM, a * room * 0.46);
    this.awakenRoomG.fillRect(camX, camY, LOGICAL_W, LOGICAL_H);
    // ── …and the light itself travels out of her
    const sweep = awakenRoomSweep(this.awakenRoomMs);
    for (let i = 0; i < 5; i++) {
      const k = 1 - i / 5; // 1 at the core, 0 at the front
      this.awakenRoomG.fillStyle(i === 0 ? AWAKEN_ROOM_CORE : AWAKEN_ROOM_WARM, a * room * 0.34 * k * k);
      this.awakenRoomG.fillCircle(at.x, at.y, (10 + i * 26) * sweep);
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
    // R5-A2: seed the HUD from the sim, not from zero — a ledger remount
    // starts with the purse the child left with (a fresh mount stays 0).
    this.cfg.callbacks.onLetters(this.sim.lettersGot, this.sim.lettersTotal);
  }

  /** PK-R6 · H2 · the child's own edge, in THIS room (round-2 finding 1). A
   *  phase with no manifest keeps the H1 numbers exactly — the fallback law. */
  private heroEdge(): ReturnType<typeof heroEdgeFor> {
    if (this.comp === null) {
      return { tint: HERO_SHADOW_TINT, alpha: HERO_SHADOW_ALPHA, swell: 0, dx: HERO_SHADOW_DX, dy: HERO_SHADOW_DY };
    }
    return heroEdgeFor(this.comp.key);
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
    // PK-R6 · H2 (round-2 finding 1): …and the copy is the room's, not a fixed
    // ink — see `heroEdgeFor`. Its swell is applied per frame with the pose, so
    // it is set in `renderPlayer` rather than here.
    const edge = this.heroEdge();
    this.rigShadow = this.add.container(0, 0).setDepth(9).setAlpha(edge.alpha);
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
      const shade = this.add.image(0, 0, this.tex(stem)).setScale(partScale).setTint(edge.tint);
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
    // PK-R6 · H3: the full-pose override pair — one authored v2 cell drawn
    // whole, in each container. Feet-anchored at the container's foot line
    // (the rig root sits 15 px above the feet), so every cell — squashed
    // landing, stretched leap — stands on the same ground.
    this.heroFullShadow = this.add.image(0, 15, "__DEFAULT").setOrigin(0.5, 1)
      .setScale(HERO2_SRC_SCALE).setVisible(false).setTint(edge.tint);
    this.rigShadow.add(this.heroFullShadow);
    this.heroFull = this.add.image(0, 15, "__DEFAULT").setOrigin(0.5, 1)
      .setScale(HERO2_SRC_SCALE).setVisible(false);
    this.rigRoot.add(this.heroFull);
  }

  /** PK-R6 · H3 · standing at a walkable edge? (the teeter's trigger). True
   *  when he is grounded-standing and the tile ahead-below his leading foot
   *  has no floor — the classic look-before-you-step probe, read from the
   *  same grid the collider reads. Presentation-only: no sim state moves. */
  private heroAtEdge(): boolean {
    if (this.player.pose !== "stand" || !this.player.grounded) return false;
    const c = Math.floor((fromSubs(this.player.x) + this.player.facing * (TILE * 0.6)) / TILE);
    const r = Math.floor(fromSubs(this.player.y) / TILE);
    const below = glyphAt(this.grid, c, r);
    const below2 = glyphAt(this.grid, c, r + 1);
    return !isSolid(below) && !isSlope(below) && !isSolid(below2);
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

    // ── PK-R6 · H2 · THE BUBBLE IS PAINTED PAPER (round-2 finding 6) ─────────
    // „A flat vector UI sticker pasted over painted art: hard rounded-rectangle
    // outline, drop shadow, and a glossy top highlight bar — standard messaging-
    // app chrome sitting directly on top of the softly painted bookshelf." Three
    // named things, three causes, all of them here:
    //   · the OUTLINE was `strokeRoundedRect`, which is four perfect arcs at one
    //     even weight. It is now a hand-drawn closed path: every point along the
    //     rim is nudged by a hash of the SPOKEN TEXT, so „Danke!" and „Autsch!"
    //     are visibly different bubbles and neither is a rounded rectangle —
    //     while the same word always draws the same bubble (deterministic, repo
    //     law), so a replayed tape is identical.
    //   · the GLOSSY BAR was a straight `lineBetween` across the top: the single
    //     most app-like mark in the game. It is gone. What replaces it is the
    //     gouache sheen every other painted surface in this book carries — a
    //     brushed arc that follows the rim's own top-left curve and fades out.
    //   · the FILL was one flat colour. It now carries the card's own paper:
    //     two pools where the wash gathered and a warm bloom at the lit corner,
    //     the same three moves the parchment `.pb-card` rule makes in CSS.
    const seed = [...text].reduce((a, c) => Math.imul(a ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
    const rim = paintedBubblePath(w, h, top, seed);
    const g = this.add.graphics();
    g.fillStyle(PARCHMENT, 0.97);
    g.fillPoints(rim, true);
    // the paper's own wash: two pools and a lit corner, under the ink line
    g.fillStyle(PARCHMENT_POOL, 0.5);
    g.fillEllipse(w * 0.16, top + h * 0.66, w * 0.42, h * 0.4);
    g.fillEllipse(-w * 0.24, top + h * 0.38, w * 0.3, h * 0.34);
    g.fillStyle(0xfffdf3, 0.55);
    g.fillEllipse(-w * 0.2, top + h * 0.26, w * 0.44, h * 0.36);
    // the tail, pointing at whoever is speaking
    g.fillStyle(PARCHMENT, 0.97);
    g.fillTriangle(-3.6, bottom - 1, 3.4, bottom - 1, 0.6, bottom + 6);
    // ── the ink line: drawn TWICE, a soft wide pass under a fine one, which is
    // what a brushed edge is and what a single even stroke can never be
    g.lineStyle(2.1, INK_LINE, 0.22);
    g.strokePoints(rim, true, true);
    g.lineStyle(1.1, INK_LINE, 0.9);
    g.strokePoints(rim, true, true);
    g.lineBetween(-3.6, bottom - 0.5, 0.6, bottom + 6);
    g.lineBetween(0.6, bottom + 6, 3.4, bottom - 0.5);
    g.fillStyle(PARCHMENT, 1);
    g.fillRect(-3.1, bottom - 1.4, 6.2, 2);
    // …and the sheen: a brushed run along the rim's OWN top-left curve, pulled
    // a hair inside it. The straight bar this replaces was the single most
    // app-like mark in the game — light does not lie in a rectangle.
    const cy = top + h / 2;
    const lit = rim
      .slice(Math.round(BUBBLE_RIM_POINTS * 0.55), Math.round(BUBBLE_RIM_POINTS * 0.87))
      .map((p) => ({ x: p.x * 0.86, y: cy + (p.y - cy) * 0.8 }));
    g.lineStyle(1.3, 0xfffdf3, 0.6);
    g.strokePoints(lit, false, false);

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
