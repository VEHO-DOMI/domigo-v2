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
