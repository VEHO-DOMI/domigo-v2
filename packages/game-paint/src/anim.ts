// THE PAINTED BOOK — deterministic sheet-frame selection (the proven game-2d
// pattern): frames advance on accumulated WALK TIME / entity ticks, never on
// wall-clock, so manual-step harness runs and real RAF agree exactly.

/** Current frame index for a cycling sheet. */
export const sheetFrame = (ticks: number, frameCount: number, ticksPerFrame: number): number =>
  frameCount <= 1 ? 0 : Math.floor(ticks / Math.max(ticksPerFrame, 1)) % frameCount;

/** A two-state bob (wild/calm entity idle): frame 0/1 on a gentle cycle. */
export const bobFrame = (ticks: number, ticksPerFrame = 24): number => sheetFrame(ticks, 2, ticksPerFrame);

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

import { BOUNCE_UP, ENEMY_WALK, FLYER_SWEEP_PX } from "./entities.ts";
import { SUBS } from "./paint.ts";

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
}

export const entPoseCell = (e: EntPoseInput): string => {
  // W5/A-4: the arena guardian's own motion cells. `consoled` is its TERMINAL
  // victory state (guardianKnotSolved sets it on the last knot and never sets
  // `redeemed`), so it must be read before the dazed catch-all — otherwise the
  // console beat's payoff, the blackboard as a friend, can never show.
  if (e.role === "guardian") {
    if (e.state === "consoled") return "win";
    if (e.state === "stagger") return "stagger";
    if (e.state === "telegraph") return "windup";
    if (e.state === "roll") return "roll"; // PK-C3/G4: the Tafel crosses the stage
  }
  if (e.redeemed || e.state === "dazed" || e.state === "consoled" || e.state === "shooed") return "dazed";
  if (e.state === "telegraph") return "telegraph";
  // a crusher's `act` IS its slam — the stomp cell is that moment
  if (e.state === "act") return e.role === "crusher" ? "stomp" : "act";
  if (e.state === "burst") return "burst";
  if (e.state === "shaking") return "shake";
  if (e.role === "bouncer" && Math.abs(e.vy) >= SQUASH_VY) return "squash";
  if (e.role === "flyer" && Math.abs(e.x - e.homeX) >= BANK_X) return "bank";
  // platforms carry a per-tick ride delta in vx that is not a gait
  if (!e.role.startsWith("platform") && Math.abs(e.vx) >= RUN_VX) return "run";
  return Math.floor(e.timer / 12) % 2 === 0 ? "a" : "b";
};
