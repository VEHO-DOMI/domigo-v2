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
/**
 * PK-R6 · H2 · …AND ONE MORE BEAT GETS ITS OWN (round-2 finding 9: „the boy has
 * an identical near-neutral face and idle stance while receiving an item, saying
 * »Danke!« and winning — no beat gets its own expression").
 *
 * `attending` is true while a card is open: somebody in the world is asking him
 * something and the whole screen is leaning in on them. He wears `head_determined`
 * for it — the face he already wears when he is going at something — because it
 * is the one commissioned cell that says „I am on this". It ranks BELOW the
 * cheer (the answer landing outranks listening for it) and below a hurt or a
 * touchdown, both of which are events happening TO him.
 *
 * The third expression the finding asks for — surprise at the moment of contact
 * — is deliberately NOT invented here: the sheet has five faces, four of them
 * are now spoken for, and the fifth (`head_hurt`) would tell a child that
 * walking up to a school bag hurt him. A surprise cell is a commission, and
 * inventing one out of `head_hurt` is the picture-disagrees-with-the-world
 * class this rig exists to end.
 */
export const faceFor = (
  pose: PlayerPose, tick: number, celebrating: boolean, landedAgo = 99, attending = false,
): string => {
  if (celebrating) return "head_celebrate";
  if (pose === "hit") return "head_hurt";
  if (isLanding(pose, landedAgo)) return "head_blink";
  if (attending) return "head_determined";
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
// PK-R6 · H2: …and the CHEER is the second one, read first because it is a
// whole-body event that outranks whatever locomotion he happens to be in — the
// flare is only a flare with two open hands in it, and `withCheer` has already
// put them above his shoulders.
export const handStemsFor = (pose: PlayerPose, landedAgo = 99, cheering = false): { front: string; back: string } =>
  cheering ? { front: "hand_open", back: "hand_open" }
  : pose === "hang" || pose === "swing" || pose === "vine" ? { front: "hand_grip", back: "hand_grip" }
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
