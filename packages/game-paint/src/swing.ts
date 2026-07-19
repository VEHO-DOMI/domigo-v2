// THE PAINTED BOOK — the ring swing: a true pendulum (dossier-faithful).
// Angle lives on the studied 512-unit circle; 256 = the arc bottom. The
// angular step is fastest at the bottom ((|cos|·4)+1 units/tick ≈ the studied
// (|cos|>>7)+1), the swing dwells 5 ticks at each extreme before reversing,
// and releasing converts the tangential speed into a jump.

import { PAINT, SUBS } from "./paint.ts";

export interface SwingState {
  anchorX: number; // subs — the ring
  anchorY: number;
  angle: number; // 512-circle units, clamped to [128, 384]; 256 = bottom
  dir: 1 | -1; // +1 = angle increasing (toward the right extreme)
  dwell: number; // ticks left holding at an extreme
}

const SWING_MIN = 128;
const SWING_MAX = 384;
const SWING_BODY_PX = 22; // T: feet hang this far under the gripping hands

const theta = (angle: number): number => ((angle - 256) / 512) * Math.PI * 2;

/** Angular units per tick at this angle — fastest at the arc bottom (D shape). */
export const swingStep = (angle: number): number => Math.floor(Math.abs(Math.cos(theta(angle))) * 4) + 1;

/** Hands + feet position for an angle (subs). */
export const swingPos = (s: SwingState): { handX: number; handY: number; xSubs: number; ySubs: number } => {
  const t = theta(s.angle);
  const handX = s.anchorX + Math.round(PAINT.swingRopePx * Math.sin(t) * SUBS);
  const handY = s.anchorY + Math.round(PAINT.swingRopePx * Math.cos(t) * SUBS);
  return { handX, handY, xSubs: handX, ySubs: handY + SWING_BODY_PX * SUBS };
};

/** Grab the ring: start on the side the player came from, swinging inward. */
export const attachSwing = (anchorX: number, anchorY: number, playerX: number): SwingState => ({
  anchorX,
  anchorY,
  angle: playerX <= anchorX ? 210 : 302, // T: entry amplitude
  dir: playerX <= anchorX ? 1 : -1,
  dwell: 0,
});

export const stepSwing = (s: SwingState): { swing: SwingState; xSubs: number; ySubs: number } => {
  const next: SwingState = { ...s };
  if (next.dwell > 0) {
    next.dwell--;
    if (next.dwell === 0) next.dir = next.dir === 1 ? -1 : 1; // the flip, after the dwell
  } else {
    next.angle += next.dir * swingStep(next.angle);
    if (next.angle >= SWING_MAX) {
      next.angle = SWING_MAX;
      next.dwell = PAINT.swingDwellTicks;
    } else if (next.angle <= SWING_MIN) {
      next.angle = SWING_MIN;
      next.dwell = PAINT.swingDwellTicks;
    }
  }
  const pos = swingPos(next);
  return { swing: next, xSubs: pos.xSubs, ySubs: pos.ySubs };
};

/** Release = a jump: tangential speed becomes vx, plus the studied −2 lift. */
export const releaseSwing = (s: SwingState): { vxSubs: number; vySubs: number } => {
  const mag = swingStep(s.angle); // 1..5 px/t, biggest at the bottom
  return { vxSubs: s.dir * mag * SUBS, vySubs: -2 * SUBS };
};
