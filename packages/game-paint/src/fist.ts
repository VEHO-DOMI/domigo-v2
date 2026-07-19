// THE PAINTED BOOK — the thrown fist (dossier-faithful flight).
// Out at the launch speed for its charge, travel ∝ charge, then a U-turn and
// an ACCELERATING flight home; caught when it reaches the player. One fist in
// the air at a time (the player brain gates on fistBusy). Collision with
// entities/triggers is the scene's job via fistRect().

import { PAINT, SUBS, fistTravelPx } from "./paint.ts";

export interface FistState {
  active: boolean;
  x: number; // subs, fist center
  y: number;
  dir: 1 | -1;
  vSubs: number; // current speed, subs/tick
  travelLeftSubs: number;
  returning: boolean;
  charge: number;
}

const FIST_HAND_PX = 20; // T: launch height above the feet
const FIST_CATCH_PX = 10; // T: caught within this of the player's hand
export const FIST_BOX_PX = 12; // the scene's collision square

export const throwFist = (
  playerXSubs: number,
  playerFeetYSubs: number,
  facing: 1 | -1,
  charge: number,
  speedSubs: number,
): FistState => ({
  active: true,
  x: playerXSubs + facing * 8 * SUBS,
  y: playerFeetYSubs - FIST_HAND_PX * SUBS,
  dir: facing,
  vSubs: speedSubs,
  travelLeftSubs: fistTravelPx(charge) * SUBS,
  returning: false,
  charge,
});

/** One tick of flight. `bounced` = the scene reports it struck something. */
export const stepFist = (
  f: FistState,
  playerXSubs: number,
  playerFeetYSubs: number,
  bounced = false,
): { fist: FistState; caught: boolean } => {
  if (!f.active) return { fist: f, caught: false };
  const n: FistState = { ...f };
  const handY = playerFeetYSubs - FIST_HAND_PX * SUBS;

  if (!n.returning) {
    n.x += n.dir * n.vSubs;
    n.travelLeftSubs -= n.vSubs;
    if (bounced || n.travelLeftSubs <= 0) n.returning = true; // the U-turn
  } else {
    n.vSubs = Math.min(n.vSubs + PAINT.fistReturnAccel, PAINT.fistRunBoostCap);
    const dx = playerXSubs - n.x;
    const step = Math.min(Math.abs(dx), n.vSubs);
    n.x += Math.sign(dx) * step;
    n.y += Math.trunc((handY - n.y) / 4); // ease back to hand height
    if (Math.abs(playerXSubs - n.x) <= FIST_CATCH_PX * SUBS) {
      n.active = false;
      return { fist: n, caught: true };
    }
  }
  return { fist: n, caught: false };
};

export const fistRect = (f: FistState): { xPx: number; yPx: number; wPx: number; hPx: number } => ({
  xPx: f.x / SUBS - FIST_BOX_PX / 2,
  yPx: f.y / SUBS - FIST_BOX_PX / 2,
  wPx: FIST_BOX_PX,
  hPx: FIST_BOX_PX,
});
