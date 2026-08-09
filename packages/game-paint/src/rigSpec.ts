// THE PAINTED BOOK — the rig SPEC: how the sliced 384px parts assemble into
// the ~35-logical-px hero. The import pipeline (docs/art/import-batch-aa.mjs)
// never trims rig cells, so every part registers by its CELL CENTER and one
// global scale keeps the commissioned proportions. Pure data + tiny pure fns —
// the scene's compositor consumes this; rig.ts supplies the motion.

import type { PlayerPose } from "./player.ts";
import { RIG, isGrounded } from "./rig.ts";

/**
 * PK-R6 · H2 · THE TOUCHDOWN WINDOW, for the SKIN (round-2 findings 1 and 4).
 *
 * The pose absorbs a landing for `landStanceTicks`; the painted parts change for
 * the first two thirds of that, so the crouched torso and the shut eyes have
 * settled back to standing a beat BEFORE the stance does. That ordering is the
 * animation principle the whole rig is built on — the extremities finish last —
 * and it also means a still caught anywhere in the absorb shows at least one of
 * the two tells rather than an all-or-nothing switch.
 */
export const LAND_SKIN_TICKS = Math.round(RIG.landStanceTicks * 0.66);

/** Is this frame the first moments of a touchdown? Poses only ask this once. */
export const isLanding = (pose: PlayerPose, landedAgo: number): boolean =>
  isGrounded(pose) && landedAgo < LAND_SKIN_TICKS;

/** Source cell px → logical px (hero commissioned ≈620px, displayed ≈35px). */
export const RIG_SRC_SCALE = 35 / 620; // T: the one dial if he reads too big/small

export const RIG_CELL = 384;

/** Draw order, back to front (handB behind the body, handF in front). */
export const RIG_PART_ORDER = ["handB", "footB", "body", "head", "hair", "footF", "handF", "rotor"] as const;
export type RigPartName = (typeof RIG_PART_ORDER)[number];

export const HEAD_STEMS = ["head_neutral", "head_blink", "head_determined", "head_hurt", "head_celebrate"] as const;

/**
 * Which face a pose wears (blink cycles at idle — deterministic on the tick).
 *
 * PK-R6 · H2 · A FACE PER STATE (round-2 finding 4: „the same wide-open mouth
 * and eyebrow shape appears in the idle, run, jump-apex and landing frames").
 * Five faces were commissioned and three of them were doing nothing: the book
 * paid for expressions the game never asked for. Both new readings are honest
 * ones rather than a shuffle to make a critic count four —
 *   · TOUCHDOWN wears `head_blink`: eyes screwed shut is what a body does when
 *     the floor arrives, and it is the one face that cannot be confused with any
 *     other at 15 px. It outranks the idle blink because it is a real event.
 *   · THE RISE wears `head_celebrate`: the open-mouthed „whee" — the dossier's
 *     leap is the flare, and a flare with a closed polite smile is half a leap.
 *     `celebrating` still outranks it, so the ceremony portrait is unchanged;
 *     `fall` deliberately does not get it, so the two air halves differ in FACE
 *     as well as in hands.
 */
export const faceFor = (pose: PlayerPose, tick: number, celebrating: boolean, landedAgo = 99): string => {
  if (celebrating) return "head_celebrate";
  if (pose === "hit") return "head_hurt";
  if (isLanding(pose, landedAgo)) return "head_blink";
  if (pose === "jump") return "head_celebrate";
  if (pose === "run" || pose === "charge") return "head_determined";
  if (pose === "stand" && tick % 180 < 7) return "head_blink";
  return "head_neutral";
};

/** PK-R6 · H2: …and the touchdown wears the CROUCHED torso — the one painted
 *  body that is wider than it is tall (17.5 × 11.3 px against the idle's
 *  16.0 × 13.8). A landing that only squashes the transform lets the painted
 *  shading fight the pose; this makes the compression part of the drawing. */
export const bodyStemFor = (pose: PlayerPose, landedAgo = 99): string =>
  pose === "charge" || isLanding(pose, landedAgo) ? "body_crouch"
  : pose === "run" || pose === "walk" ? "body_lean"
  : "body_idle";

// The study dossier's hand language (level-anatomy.md): fist = doing (the
// neutral mitt), open = feeling/effort, grip = holds. At most ONE hand opens
// in any locomotion pose — twin open palms was the jazz-hands read; the run
// pairs a closed lead with an open trail, the fall the inverse.
// PK-R6 · H1: …and the LEAP is the dossier's one sanctioned symmetric flare
// („both hands rise above shoulder line, OPEN, fingers spread wide"), which is
// what stops the jump from wearing the idle's two closed mitts. The fall keeps
// its asymmetry, so the two air states differ in hand SHAPE as well as place.
// PK-R6 · H2: the touchdown opens the LEAD palm and keeps the trailing fist —
// the brace, and the one-open-hand law kept intact. It is the run's pairing
// inverted, which is exactly what it should be: he was running, he hit the
// floor, and the hand that was pumping is now the hand taking his weight.
export const handStemsFor = (pose: PlayerPose, landedAgo = 99): { front: string; back: string } =>
  pose === "hang" || pose === "swing" || pose === "vine" ? { front: "hand_grip", back: "hand_grip" }
  : isLanding(pose, landedAgo) ? { front: "hand_open", back: "hand_fist" }
  : pose === "fall" || pose === "hit" ? { front: "hand_open", back: "hand_fist" }
  : pose === "run" ? { front: "hand_fist", back: "hand_open" }
  : pose === "hover" || pose === "jump" ? { front: "hand_open", back: "hand_open" }
  : { front: "hand_fist", back: "hand_fist" };

export const shoeStemFor = (pose: PlayerPose): string =>
  pose === "jump" || pose === "hover" ? "shoe_tucked" : "shoe_neutral";

export const hairStemFor = (pose: PlayerPose, vxSubs: number): string =>
  Math.abs(vxSubs) > 300 || pose === "fall" || pose === "hover" ? "hair_wind" : "hair_still";

export const ROTOR_STEMS = ["rotor_a", "rotor_b", "rotor_c"] as const;
