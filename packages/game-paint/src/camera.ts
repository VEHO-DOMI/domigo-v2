// THE PAINTED BOOK — the camera brain (dossier-faithful): an eased look-ahead
// follow. Horizontal: the player rides a third off-center, ahead of his
// facing; scroll eases toward the target by /4 per tick with a minimum
// follow speed. Vertical: a rest line at ~57% of the view height that only
// follows once the player leaves a one-tile band. Pure targets + steps —
// the scene applies the scroll.

import { LOGICAL_H, LOGICAL_W, PAINT, SUBS, TILE } from "./paint.ts";

const AHEAD_PX = PAINT.camAheadTiles * TILE;
const REST_Y_PX = Math.floor((LOGICAL_H * PAINT.camVertBandPct) / 100); // ≈127

/** Where the horizontal scroll wants to be for a player at x, facing dir. */
export const cameraTargetX = (playerXSubs: number, facing: 1 | -1): number =>
  playerXSubs - (Math.floor(LOGICAL_W / 2) - facing * AHEAD_PX) * SUBS;

/** Where the vertical scroll wants to be for feet at y. */
export const cameraTargetY = (feetYSubs: number): number => feetYSubs - REST_Y_PX * SUBS;

/** One eased tick of one axis: /4 toward the target, min speed, no overshoot. */
export const stepCameraAxis = (currentSubs: number, targetSubs: number): number => {
  const diff = targetSubs - currentSubs;
  if (diff === 0) return currentSubs;
  let step = Math.trunc(diff / PAINT.camEaseDiv);
  const sign = diff > 0 ? 1 : -1;
  if (Math.abs(step) < PAINT.camMinSpeed) step = sign * Math.min(PAINT.camMinSpeed, Math.abs(diff));
  if (Math.abs(step) > Math.abs(diff)) step = diff;
  return currentSubs + step;
};

/** Vertical follows only outside the ±1-tile comfort band (D). */
export const stepCameraY = (currentSubs: number, feetYSubs: number): number => {
  const desired = cameraTargetY(feetYSubs);
  if (Math.abs(desired - currentSubs) <= PAINT.camVertThresholdPx * SUBS) return currentSubs;
  return stepCameraAxis(currentSubs, desired);
};

/** Keep a scroll inside the world. */
export const clampScroll = (scrollSubs: number, worldPx: number, viewPx: number): number => {
  const max = Math.max(worldPx - viewPx, 0) * SUBS;
  return Math.min(Math.max(scrollSubs, 0), max);
};

// ── PK-R3a · R3-8 — THE BATTLE FRAMING (doc 42 §1) ──────────────────────────
// Mined from Keen's phase-overlay system: when a card opens the world does not
// merely stop, the book LEANS IN toward whoever is asking — "the single cheapest
// 'this is a BATTLE' signal we own". Timings taken verbatim (1.18× over 160 ms);
// only the reason is ours: in the Painted Book the lean says WHO is talking, so
// the child's eyes are already on the being when the question arrives.
//
// Pure, and therefore testable: the scene only hands the result to Phaser.

/** How far in the view pushes at full focus (doc 42 §1, verbatim). */
export const FOCUS_ZOOM = 1.18;
/** How long it takes to get there, in ms (doc 42 §1, verbatim). */
export const FOCUS_MS = 160;
/** How far the centre travels toward the asker. Not all the way: the child must
 *  stay in frame — the lean is a glance at the speaker, not a cutaway. */
export const FOCUS_PULL = 0.6;

/** Keep a view centre such that the visible rect stays inside the world. */
const clampCentre = (centre: number, viewPx: number, worldPx: number): number =>
  (worldPx <= viewPx
    ? worldPx / 2
    : Math.min(Math.max(centre, viewPx / 2), worldPx - viewPx / 2));

/**
 * Where the camera looks, and how close, at focus progress `t` (0 = the plain
 * follow shot, 1 = fully leaned in on the asker). All arguments in world px.
 * `t = 0` reproduces the un-focused view exactly, so the same call site serves
 * both states and there is no second code path to drift.
 */
export const focusView = (
  scrollX: number, scrollY: number,
  askerX: number, askerY: number,
  t: number,
  worldW: number, worldH: number,
  viewW: number = LOGICAL_W, viewH: number = LOGICAL_H,
): { cx: number; cy: number; zoom: number } => {
  const k = Math.min(1, Math.max(0, t));
  const zoom = 1 + (FOCUS_ZOOM - 1) * k;
  const seenW = viewW / zoom;
  const seenH = viewH / zoom;
  const baseCx = scrollX + viewW / 2;
  const baseCy = scrollY + viewH / 2;
  return {
    cx: clampCentre(baseCx + (askerX - baseCx) * FOCUS_PULL * k, seenW, worldW),
    cy: clampCentre(baseCy + (askerY - baseCy) * FOCUS_PULL * k, seenH, worldH),
    zoom,
  };
};
