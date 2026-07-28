// THE PAINTED BOOK — deterministic sheet-frame selection (the proven game-2d
// pattern): frames advance on accumulated WALK TIME / entity ticks, never on
// wall-clock, so manual-step harness runs and real RAF agree exactly.

/** Current frame index for a cycling sheet. */
export const sheetFrame = (ticks: number, frameCount: number, ticksPerFrame: number): number =>
  frameCount <= 1 ? 0 : Math.floor(ticks / Math.max(ticksPerFrame, 1)) % frameCount;

/** doc 40 §2 · THE IDLE CYCLE stays 400 ms however many cells the art spends on
 *  it — 2 cells dwell 12 t each, 4 cells dwell 6 t (10 fps). Keeping the CYCLE
 *  constant and dividing it is what lets a richer idle sheet drop in without
 *  re-timing the world. */
export const IDLE_CYCLE_TICKS = 24;

/** The entity idle bob. `frameCount` is the number of painted idle cells the
 *  skin actually has (doc 40 §4's `bobFrame(frameCount)` upgrade). */
export const bobFrame = (ticks: number, frameCount = 2, ticksPerFrame = Math.max(1, Math.round(IDLE_CYCLE_TICKS / frameCount))): number =>
  sheetFrame(ticks, frameCount, ticksPerFrame);

/** Idle cell names in index order — `_a _b _c _d` (doc 40 §3's stem grammar). */
const IDLE_CELLS = ["a", "b", "c", "d"] as const;

// ── W4 · the entity POSE hook (batch AC's motion cells) ────────────────────
// Which sheet cell an entity shows this tick. Pure and Phaser-free so it is
// unit-testable on its own; PaintScene.entStateCell simply delegates here.
//
// The four motion poses are ADDITIVE by construction: when a `_run`/`_squash`/
// `_stomp`/`_bank` stem is absent, entTex's untouched fallback chain
// (pb-<skin>_<state> → pb-<skin>_a → fb-ent-<skin>) lands on the idle cell, so
// a missing stem can never break a render — the only-present law.
//
// Every threshold is DERIVED from the sim constant it depicts (imported, never
// re-typed), so a tuning change to the sim moves the pose with it.

import { BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX, JOY_ROLES } from "./entities.ts";
import { SUBS } from "./paint.ts";

// ── PK-R3b · R3-15 · THE DESATURATION GRAMMAR (doc 41 §2) ────────────────────
// OSWIN rained the colour out of the beings he bewitched, so a being you have
// not yet befriended renders GREY-WASHED and floods back to full colour the
// moment it is redeemed. That flood is the `restore` card's payoff made
// visible — the child's answer changes the picture, which is the whole reason
// the mechanic is worth a new task kind.
//
// It costs NO new art: the wash is a grey copy of the being's own sheet laid
// over it at this alpha, so every existing and future skin is covered by
// construction. (Phaser's `setTint` multiplies, which darkens rather than
// desaturates — an overlay is what actually drains colour.)

/** How much grey sits over an un-redeemed being. Enough that „the colour is
 *  gone" reads at 24 px, little enough that its SHAPE still names it — step 1
 *  of a restore card must stay answerable by looking. */
export const WASH_ALPHA = 0.72;
/** How long the colour takes to flood back in, in ticks (≈0.6 s at 60 Hz) —
 *  comfortably inside the joy lap (JOY_TICKS), so the flood and the
 *  Freudenrunde are one beat rather than two. */
export const COLOUR_FLOOD_TICKS = 36;

/** How opaque the grey wash over this being is right now, 0 … WASH_ALPHA.
 *  Pure: `timer` is the sim's own counter, which `redeemEntity` resets to 0 at
 *  the moment of redemption, so the flood starts exactly when the card is
 *  answered. Under reduced motion a redeemed being is simply already in
 *  colour — the end-states law, applied to the world instead of to CSS. */
export const washAlphaFor = (
  e: { role: string; redeemed: boolean; timer: number },
  reducedMotion = false,
): number => {
  if (!JOY_ROLES.has(e.role)) return 0; // static-state beings were never drained
  if (!e.redeemed) return WASH_ALPHA;
  if (reducedMotion) return 0;
  const left = 1 - Math.min(Math.max(e.timer, 0), COLOUR_FLOOD_TICKS) / COLOUR_FLOOD_TICKS;
  return WASH_ALPHA * left;
};

/** Half the patrol speed: a chaser's vx is ±ENEMY_WALK while walking and 0 at
 *  an edge turn, so this cleanly separates "striding" from "stopped". */
export const RUN_VX = ENEMY_WALK / 2;
/** The fast part of a bouncer's arc, i.e. the squash at the bottom — the art
 *  shows the body flattened wide, which is contact, not apex. */
export const SQUASH_VY = BOUNCE_UP * 0.8;
/** Near the extremes of the flyer's sweep, where it rolls into the turn — the
 *  art shows the whole body banked over, which is a turn, not a straight run. */
export const BANK_X = FLYER_SWEEP_PX * SUBS * 0.8;

export interface EntPoseInput {
  role: string;
  state: string;
  timer: number;
  redeemed: boolean;
  vx: number;
  vy: number;
  x: number;
  homeX: number;
  /** How many painted idle cells this SKIN has on disk (doc 40 §4). The scene
   *  counts them; the hook stays pure. Defaults to the shipped 2, so a skin
   *  that never gains `_c/_d` keeps exactly today's cadence. */
  idleFrames?: number;
}

export const entPoseCell = (e: EntPoseInput): string => {
  // W5/A-4: the arena guardian's own motion cells. `consoled` is its TERMINAL
  // victory state (guardianKnotSolved sets it on the last knot and never sets
  // `redeemed`), so it must be read before the dazed catch-all — otherwise the
  // console beat's payoff, the blackboard as a friend, can never show.
  if (e.role === "guardian") {
    if (e.state === "consoled") return "win";
    // R3-5: the crying beat, at last given a state (doc 38's painted-unused sheet)
    if (e.state === "sad") return "sad";
    // R3-4: the turn has no painted cell yet (doc 40 §7 keeps PK-R2 to art that
    // exists). It must NOT fall through to `_a` — that is the GREEN easel form,
    // and swapping bodies mid-duel is the identity bug PB-F1 removed. The
    // wheeled body in motion is what a turn IS, so `roll` holds it. Art debt is
    // named in doc 35: 2–3 painted `tafel_turn` cells retire this line.
    if (e.state === "turn") return "roll";
    // PB-F1/F2-25: `window` IS the counter-task moment. It used to fall through
    // to the a/b idle cells, so the boss silently swapped to a DIFFERENT drawing
    // of itself for exactly as long as the card asking you to look at it was up.
    // The stagger cell (same wheeled body, reeling) holds the identity.
    if (e.state === "stagger" || e.state === "window") return "stagger";
    if (e.state === "telegraph") return "windup";
    if (e.state === "roll") return "roll"; // PK-C3/G4: the Tafel crosses the stage
  }
  // R3-5 · THE REDEEMED-PRESENCE PAIR (doc 40 §3). Read BEFORE the dazed
  // catch-all: a freed friend is not a dazed enemy, and `moths_rest` — painted,
  // shown by nothing (doc 38 §2) — is exactly the settled cell this asks for.
  if (e.state === "joy") return "joy";
  if (e.state === "rest") return "rest";
  if (e.redeemed || e.state === "dazed" || e.state === "consoled" || e.state === "shooed") return "dazed";
  // doc 40 §2 · the turn state, for every role that patrols
  if (e.state === "turn") return "turn";
  if (e.state === "telegraph") return "telegraph";
  // a crusher's `act` IS its slam — the stomp cell is that moment
  if (e.state === "act") return e.role === "crusher" ? "stomp" : "act";
  if (e.state === "burst") return "burst";
  if (e.state === "shaking") return "shake";
  if (e.role === "bouncer" && Math.abs(e.vy) >= SQUASH_VY) return "squash";
  if (e.role === "flyer" && Math.abs(e.x - e.homeX) >= BANK_X) return "bank";
  // platforms carry a per-tick ride delta in vx that is not a gait
  if (!e.role.startsWith("platform") && Math.abs(e.vx) >= RUN_VX) return "run";
  const frames = Math.min(Math.max(e.idleFrames ?? 2, 1), IDLE_CELLS.length);
  return IDLE_CELLS[bobFrame(e.timer, frames)] ?? "a";
};
