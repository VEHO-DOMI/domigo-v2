// THE PAINTED BOOK — the rig SPEC: how the sliced 384px parts assemble into
// the ~35-logical-px hero. The import pipeline (docs/art/import-batch-aa.mjs)
// never trims rig cells, so every part registers by its CELL CENTER and one
// global scale keeps the commissioned proportions. Pure data + tiny pure fns —
// the scene's compositor consumes this; rig.ts supplies the motion.

import type { PlayerPose } from "./player.ts";

/** Source cell px → logical px (hero commissioned ≈620px, displayed ≈35px). */
export const RIG_SRC_SCALE = 35 / 620; // T: the one dial if he reads too big/small

export const RIG_CELL = 384;

/** Draw order, back to front (handB behind the body, handF in front). */
export const RIG_PART_ORDER = ["handB", "footB", "body", "head", "hair", "footF", "handF", "rotor"] as const;
export type RigPartName = (typeof RIG_PART_ORDER)[number];

export const HEAD_STEMS = ["head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate"] as const;

/** Which face a pose wears (blink cycles at idle — deterministic on the tick). */
export const faceFor = (pose: PlayerPose, tick: number, celebrating: boolean): string => {
  if (celebrating) return "head_celebrate";
  if (pose === "hit") return "head_hurt";
  if (pose === "run" || pose === "charge") return "head_determined";
  if (pose === "stand" && tick % 180 < 7) return "head_blink";
  return "head_neutral";
};

export const bodyStemFor = (pose: PlayerPose): string =>
  pose === "charge" ? "body_crouch" : pose === "run" || pose === "walk" ? "body_lean" : "body_idle";

export const handStemFor = (pose: PlayerPose): string =>
  pose === "charge" ? "hand_fist" : pose === "hang" || pose === "swing" || pose === "vine" ? "hand_grip" : "hand_open";

export const shoeStemFor = (pose: PlayerPose): string =>
  pose === "jump" || pose === "hover" ? "shoe_tucked" : "shoe_neutral";

export const hairStemFor = (pose: PlayerPose, vxSubs: number): string =>
  Math.abs(vxSubs) > 300 || pose === "fall" || pose === "hover" ? "hair_wind" : "hair_still";

export const ROTOR_STEMS = ["rotor_a", "rotor_b", "rotor_c"] as const;
