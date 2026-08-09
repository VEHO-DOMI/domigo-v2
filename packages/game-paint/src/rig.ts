// THE PAINTED BOOK — the rig brain: the limbless hero as posed PARTS.
// This is where "alive vs. stale" is decided (Koki's anti-stale check,
// 2026-07-19, banked in the plan): the classic animation principles as pure,
// deterministic tick math — never a linear slide:
//   · squash & stretch — the round body squashes on landing, stretches at
//     the jump apex (scale transforms; the limbless body is built for it)
//   · secondary motion — the hair tuft lags the body on a spring-like phase
//   · arcs — hands travel ellipses in the run cycle, never straight lines
//   · anticipation/overshoot — landing recovery eases elastically, not
//     linearly
// Everything derives from the INPUTS (pose, walkTime, velocities, counters) —
// zero internal state, zero wall-clock, zero RNG: the same inputs give the
// same pose in a harness run and on real RAF. Reduced motion collapses every
// oscillation to its rest value.

import type { PlayerPose } from "./player.ts";
import { PAINT, SUBS } from "./paint.ts";

// T: the rig dial sheet — the motion feel-tune session diffs exactly these.
export const RIG = {
  runCycleTicks: 16, // one full stride at run speed
  footLiftPx: 4,
  // PK-R6 · H1: 5 → 6.5. The critique read every locomotion frame as the same
  // picture; the study dossier's run is „feet split in a LONG stride" (Part C),
  // and a 5-px split at a 35-px hero is not a split anybody sees.
  footStridePx: 6.5,
  bodyBobPx: 1.6,
  // PK-R6 · H1: 0.16 → 0.26 rad (≈15°). The dossier's run is „body tilts
  // forward" and the reference frame reads as a DIAGONAL at thumbnail size;
  // ours read as upright. This is the single biggest silhouette tell we had and
  // it was turned almost all the way down.
  bodyLeanMaxRad: 0.26,
  handTrailPx: 2, // PB-F3/F2-7: was 3.5 — the trail hand cleared the silhouette by more than half a body width and read as dropped
  // PK-R6 · H1: the pump amplitude, not the pump OFFSET, is what was missing —
  // F2-7 tuned the back hand IN for good reason and this leaves that where it
  // is, swinging it harder instead of hanging it further out.
  handArcXPx: 3.2,
  handArcYPx: 2.8,
  handLagTicks: 3, // PB-F3/F2-7: the trailing hand FOLLOWS the body — arms lag, they are not placed
  hairLagTicks: 3, // the secondary-motion phase lag
  hairSwayRad: 0.22,
  idleBreathTicks: 52,
  idleBreathPx: 0.8,
  jumpStretch: { sx: 0.94, sy: 1.08 },
  landSquash: { sx: 1.14, sy: 0.84 },
  landRecoverTicks: 6, // elastic ease back to 1.0
  hoverSwayRad: 0.07,
  hoverBobPx: 1.2,
  hoverBobTicks: 26,
  chargeOrbitPx: 10,
  chargeOrbitMinTicks: 6, // orbit period at full charge (fast)
  chargeOrbitMaxTicks: 18, // at zero charge (slow)
  hurtWobbleRad: 0.3,
  // ── PK-R6 · H1 · THE LANDING ABSORB (round-1 critique, finding 4) ──────────
  // The rig squashed the BODY on landing and left the pose alone, so the frame
  // the harness named „landing-squash" showed a boy standing exactly as he
  // stands in the corridor: the critique could not tell it from idle. A landing
  // is a whole-body event — the stance opens, the arms fly out for balance —
  // and it is DERIVED from landedAgo, which the rig already receives, so no
  // sim state and no new pose enum are involved.
  landStanceTicks: 9, // the absorb outlasts the scale recovery: the arms settle after the body
  landStancePx: 5, // how far each foot slides out from its standing place
  landArmOutPx: 6, // …and each hand, sideways, to balance
  landArmUpPx: 5,
} as const;

export interface PartPose {
  dx: number; // px, relative to the rig origin (body center), +x = facing dir
  dy: number;
  rot: number; // radians, sign follows facing
  hidden?: boolean;
  frame?: number; // rotor spin frame 0..2
}

export interface RigPose {
  scaleX: number; // whole-rig squash & stretch
  scaleY: number;
  body: PartPose;
  head: PartPose;
  handF: PartPose; // leading (front) hand — the fist hand
  handB: PartPose; // trailing (back) hand
  footF: PartPose;
  footB: PartPose;
  hair: PartPose;
  rotor: PartPose; // the quill — hidden unless hovering
}

export interface RigInput {
  pose: PlayerPose;
  walkTime: number;
  tick: number;
  vxSubs: number;
  vySubs: number;
  charge: number; // −1 when not charging
  landedAgo: number;
  swingLean?: number; // −1..1 — horizontal lean toward the swing anchor (scene-fed)
  /** PK-R6 · H1 · 0..1 — how strongly a collectible is being MAGNETED in right
   *  now (scene-fed from the sim's own letter positions; see PaintScene.reachT).
   *  The magnet was invisible in a still frame: the letter simply sat beside the
   *  boy with nothing connecting them (round-1 critique, finding 5). A hand that
   *  reaches for it is the half of that cue the body owes. Optional, so every
   *  existing caller and every test is unchanged at 0. */
  reach?: number;
  reducedMotion?: boolean;
}

const P = (dx = 0, dy = 0, rot = 0): PartPose => ({ dx, dy, rot });
const TAU = Math.PI * 2;

/** Elastic-ish ease-out for the landing recovery (overshoot then settle). */
const elasticOut = (t: number): number => {
  if (t >= 1) return 1;
  return 1 - Math.cos(t * Math.PI * 0.5) * (1 - t) * 0.9;
};

export const rigPose = (input: RigInput): RigPose => {
  const rm = input.reducedMotion === true;
  const speedT = Math.min(Math.abs(input.vxSubs) / PAINT.runMax, 1);

  // rest skeleton (offsets from the body center; the compositor mirrors on facing)
  const pose: RigPose = {
    scaleX: 1,
    scaleY: 1,
    body: P(0, 0),
    head: P(0, -14),
    handF: P(5, 2),
    handB: P(-4, 3),
    footF: P(4, 12),
    footB: P(-4, 12),
    hair: P(1, -20),
    rotor: { ...P(0, -26), hidden: true },
  };

  // ── landing squash + elastic recovery (applies over any grounded pose) ──
  if (!rm && input.landedAgo < RIG.landRecoverTicks) {
    const t = elasticOut(input.landedAgo / RIG.landRecoverTicks);
    pose.scaleX = RIG.landSquash.sx + (1 - RIG.landSquash.sx) * t;
    pose.scaleY = RIG.landSquash.sy + (1 - RIG.landSquash.sy) * t;
  }

  switch (input.pose) {
    case "walk":
    case "run": {
      const phase = rm ? 0 : (input.walkTime % RIG.runCycleTicks) / RIG.runCycleTicks;
      const a = phase * TAU;
      const stride = RIG.footStridePx * (0.5 + speedT * 0.5);
      // feet: opposite phases on a cycloid — lifted only on the forward half
      // W0-F4: the LIFTED foot must sweep back→front (−cos); the planted
      // foot then travels backward relative to the body — anything else reads
      // as running backwards (the feel-gate verdict).
      pose.footF.dx = 4 - Math.cos(a) * stride;
      pose.footF.dy = 12 - Math.max(Math.sin(a), 0) * RIG.footLiftPx;
      pose.footB.dx = -4 - Math.cos(a + Math.PI) * stride;
      pose.footB.dy = 12 - Math.max(Math.sin(a + Math.PI), 0) * RIG.footLiftPx;
      // body: double-frequency bob + speed lean
      pose.body.dy = rm ? 0 : -Math.abs(Math.sin(a)) * RIG.bodyBobPx;
      // the lean survives reduced motion: it is not an oscillation, it is the
      // POSE — a run drawn bolt upright is the thing the critique flagged, and
      // a child who asked for less movement did not ask for a worse picture
      pose.body.rot = RIG.bodyLeanMaxRad * speedT;
      pose.head.dy = -14 + pose.body.dy * 0.7;
      // the head LEADS the diagonal. Rotation alone barely reads at 35 px,
      // because each part turns about its OWN centre; shifting the head forward
      // over the feet is what actually draws the lean.
      pose.head.dx = speedT * 3.5;
      pose.body.dx = speedT * 1.5;
      pose.head.rot = RIG.bodyLeanMaxRad * speedT * 0.5;
      // hands (dossier): the sprinter pump — the lead hand rides closed at
      // chest height ahead of and OVERLAPPING the torso; the trail hand swings
      // open behind at hip height; both trace small arcs (never straight lines)
      // PK-R6 · H1: the lead mitt now clears the 12-px torso and rides at
      // SHOULDER height at speed (dossier Part C: „lead hand loosely closed at
      // chest height AHEAD of the torso"). At 5+4 px it sat on the chest, which
      // is the dossier's crouch/brace pose — the one the critique read as
      // „arms-clutched-to-chest" in every single frame.
      pose.handF.dx = 7 + speedT * 7 + (rm ? 0 : Math.cos(a + Math.PI) * RIG.handArcXPx);
      pose.handF.dy = -3 - speedT * 3 + (rm ? 0 : Math.sin(a + Math.PI) * RIG.handArcYPx);
      // PB-F3 · F2-7: the back hand was an open palm hanging at shoe height,
      // a body-width clear of the torso and moving in exact lockstep with the
      // feet — "one dropped glove plus one held ball" on film. It now swings on
      // a LAGGED phase (secondary motion, like the hair), closer in and higher,
      // so the pair reads as a pump. MEASURED across the cycle at full speed:
      // vertical spread 4.4–11.6 px → 3.6–9.4 px, and the hand clears the
      // 12-px body by at most 4.3 px instead of 7 — twice per cycle it now
      // tucks just inside the silhouette instead of always floating clear.
      // PK-R6 · H1: …and it swings at HIP height, not chest height. The draw
      // order puts this hand BEHIND the torso, and at chest height the torso and
      // the satchel covered it completely — in the whole round-1 capture set the
      // trailing mitt is not visible in a single frame, which is most of why
      // every state looked like the same one-armed boy. Dropped to the hip it
      // clears the satchel and the pump finally has two ends.
      const aBack = rm ? 0 : ((input.walkTime - RIG.handLagTicks) % RIG.runCycleTicks) / RIG.runCycleTicks * TAU;
      pose.handB.dx = -8 - RIG.handTrailPx * speedT + (rm ? 0 : Math.cos(aBack) * RIG.handArcXPx);
      pose.handB.dy = 4 + (rm ? 0 : Math.sin(aBack) * RIG.handArcYPx);
      // hair: lags the body's bob by a few ticks — the secondary motion
      if (!rm) {
        const lag = ((input.walkTime - RIG.hairLagTicks) % RIG.runCycleTicks) / RIG.runCycleTicks;
        pose.hair.rot = Math.sin(lag * TAU) * RIG.hairSwayRad * (0.4 + speedT * 0.6);
        pose.hair.dy = -20 - Math.abs(Math.sin(lag * TAU)) * 0.8;
      }
      break;
    }
    case "stand": {
      if (!rm) {
        const b = Math.sin((input.tick % RIG.idleBreathTicks) / RIG.idleBreathTicks * TAU) * RIG.idleBreathPx;
        pose.body.dy = b;
        pose.head.dy = -14 + b * 0.6;
        pose.hair.rot = Math.sin(((input.tick - RIG.hairLagTicks) % RIG.idleBreathTicks) / RIG.idleBreathTicks * TAU) * 0.05;
      }
      break;
    }
    case "jump": {
      if (!rm && input.vySubs < -2 * SUBS) {
        pose.scaleX = RIG.jumpStretch.sx;
        pose.scaleY = RIG.jumpStretch.sy;
      }
      // PK-R6 · H1 · THE FLARE. The dossier's forensic pass (level-anatomy.md
      // Part C, „Jump/leap") is explicit and cites two reference frames: „both
      // hands rise above shoulder line, open, fingers spread wide — the
      // silhouette FLARES. Hands lead the arc." Its own summary line one page
      // earlier says „jump rise = hands tuck compact", and that is the line this
      // rig was built on — which is how the jump ended up wearing very nearly
      // the idle silhouette. The forensic reading wins: it is the more specific
      // observation, it names its evidence, and it is what Part C's own law
      // („above = jump") requires of a pose that must read from shape alone.
      //
      // The symmetry is safe here and only here: R2a's „jazz hands" verdict was
      // about the FALL, which now keeps its asymmetric counter-drift below, so
      // the two air states no longer share a picture either.
      pose.handF = P(12, -16, -0.55);
      pose.handB = P(-12, -13, 0.55);
      pose.footF = P(6, 7); // the split feet the dossier gives the leap
      pose.footB = P(-6, 14);
      pose.hair.rot = rm ? 0 : -0.12;
      break;
    }
    case "fall": {
      // R2a: a low asymmetric reach — the old symmetric double-spread at
      // shoulder height was Koki's "jazz hands". PK-R6 · H1 opens it further:
      // the drift hand goes higher and the anchor fist lower, so „falling"
      // reads as a diagonal at thumbnail size instead of as a shrug.
      pose.handF = P(12, -12, 0.4); // the loose counter-drift above the drop
      pose.handB = P(-10, 5, -0.25); // the anchor fist stays at the hip — and CLEAR of the torso, or it is not in the picture at all
      pose.body.rot = rm ? 0 : 0.09; // tipped back off the vertical
      const dangle = rm ? 0 : Math.sin((input.tick % 14) / 14 * TAU) * 1.2;
      pose.footF = P(5 + dangle, 14);
      pose.footB = P(-5 - dangle, 12); // legs dangle UNEVENLY (dossier: loose, not paired)
      pose.hair.rot = rm ? 0 : 0.18; // streaming upward while falling
      pose.hair.dy = -21;
      break;
    }
    case "hover": {
      pose.rotor = { dx: 0, dy: -26, rot: 0, hidden: false, frame: rm ? 0 : input.tick % 3 };
      const sway = rm ? 0 : Math.sin((input.tick % RIG.hoverBobTicks) / RIG.hoverBobTicks * TAU);
      pose.body.rot = sway * RIG.hoverSwayRad;
      pose.body.dy = sway * RIG.hoverBobPx;
      pose.head.dy = -14 + sway * RIG.hoverBobPx * 0.6;
      pose.footF = P(3, 9); // tucked
      pose.footB = P(-3, 9);
      // dossier: the glide balances like a tightrope walk — both hands out
      // at the sides, palms down (strong rotation turns the open glove flat)
      pose.handF = P(11, -5, -1.15 + sway * 0.08);
      pose.handB = P(-11, -5, 1.15 - sway * 0.08);
      break;
    }
    case "charge": {
      // the fist hand orbits, accelerating with charge — pure anticipation
      const chargeT = Math.max(input.charge, 0) / PAINT.chargeMax;
      const period = RIG.chargeOrbitMaxTicks - (RIG.chargeOrbitMaxTicks - RIG.chargeOrbitMinTicks) * chargeT;
      const a = rm ? 0 : ((input.tick % Math.max(Math.round(period), 1)) / Math.max(Math.round(period), 1)) * TAU;
      // dossier: the charge winds the fist BEHIND the hip (sparkling), body
      // coiled forward — the tremble tightens as the charge grows
      const tremble = 2 + chargeT * 2;
      pose.handF.dx = -8 + Math.cos(a) * tremble;
      pose.handF.dy = 2 + Math.sin(a) * tremble;
      pose.handB.dx = 6; // the guard hand covers the chest line
      pose.handB.dy = -3;
      pose.body.rot = rm ? 0 : -0.06; // coiled
      pose.footF = P(5, 12);
      pose.footB = P(-6, 12);
      break;
    }
    case "hang": {
      // W0-F6: the mittens grip ON the painted lip (feet hang 26px below the
      // grabbed top, so dy −24/−25 puts the hands right at the edge)
      pose.handF.dx = 9; // both grips sit ON the lip corner (the wall side)
      pose.handF.dy = -24;
      pose.handB.dx = 5;
      pose.handB.dy = -26;
      pose.body.dx = -2; // the body hangs slightly off the grip axis
      pose.body.dy = -12;
      pose.head.dy = -22;
      pose.footF.dx = 3; // feet tuck right under the raised torso — no floating gap
      pose.footF.dy = 0;
      pose.footB.dx = -1;
      pose.footB.dy = 2;
      pose.body.rot = rm ? 0.06 : 0.06 + Math.sin(((input.tick % 48) / 48) * TAU) * 0.03;
      break;
    }
    case "vine": {
      const a = rm ? 0 : ((input.walkTime % 20) / 20) * TAU;
      // dossier: the reaching hand leads above the head; hands alternate on
      // the vine line while the BODY hangs beside it (the vine must never
      // bisect the face)
      pose.handF = P(-3, -26 + Math.sin(a) * 3);
      pose.handB = P(-5, -18 - Math.sin(a) * 3);
      pose.body.dx = 4;
      pose.head.dx = 4;
      pose.hair.dx = 5;
      pose.footF = P(0, 12 - Math.sin(a) * 2);
      pose.footB = P(-2, 13 + Math.sin(a) * 2);
      break;
    }
    case "swing": {
      // the grip pair shifts toward the anchor and the body tilts with the
      // pendulum — the rope, hands and lean read as ONE line (scene feeds lean)
      const lean = input.swingLean ?? 0;
      pose.handF = P(2 + lean * 7, -25, -lean * 0.3);
      pose.handB = P(-2 + lean * 7, -27, -lean * 0.3);
      pose.body.rot = -lean * 0.22;
      pose.head.rot = -lean * 0.12;
      pose.footF = P(5 - lean * 3, 13);
      pose.footB = P(-1 - lean * 3, 15);
      pose.hair.rot = rm ? 0 : 0.14 - lean * 0.2;
      break;
    }
    case "hit": {
      const w = rm ? 0 : Math.sin((input.tick % 8) / 8 * TAU) * RIG.hurtWobbleRad;
      pose.body.rot = w;
      pose.head.rot = -w * 0.6;
      pose.handF = P(10, -10, 0.6);
      pose.handB = P(-10, -6, -0.6);
      pose.footF = P(6, 11);
      pose.footB = P(-7, 12);
      break;
    }
  }

  // ── PK-R6 · H1 · THE LANDING ABSORB (finding 4) ────────────────────────────
  // Laid OVER the grounded pose the switch just built, because a landing is not
  // a state the sim has — it is the first few ticks of standing or running, and
  // `landedAgo` is the clock that says so. Eases out on the same elastic curve
  // the scale recovery uses, so the stance opening and the body decompressing
  // are one movement rather than two.
  const grounded = input.pose === "stand" || input.pose === "walk" || input.pose === "run";
  if (!rm && grounded && input.landedAgo < RIG.landStanceTicks) {
    const k = 1 - elasticOut(input.landedAgo / RIG.landStanceTicks); // 1 at contact → 0 settled
    pose.footF.dx += RIG.landStancePx * k;
    pose.footB.dx -= RIG.landStancePx * k;
    pose.handF.dx += RIG.landArmOutPx * k;
    pose.handF.dy -= RIG.landArmUpPx * k;
    pose.handF.rot -= 0.35 * k;
    pose.handB.dx -= RIG.landArmOutPx * k;
    pose.handB.dy -= RIG.landArmUpPx * k;
    pose.handB.rot += 0.35 * k;
    pose.head.dy += 1.5 * k; // the head sinks into the absorb
    pose.body.rot *= 1 - k; // whatever lean the gait had, the landing straightens
  }

  // ── PK-R6 · H1 · THE MAGNET REACH (finding 5) ──────────────────────────────
  // The lead mitt goes out toward the letter that is being pulled in, at the
  // strength of the pull. Facing is applied by the compositor, and the sim only
  // magnets what is already in front of the pickup box, so reaching along +x is
  // reaching AT it. Suppressed in the grips (hang/vine/swing) — a hand that lets
  // go of the rope to grab a letter is a picture that lies about the physics.
  const reach = Math.min(Math.max(input.reach ?? 0, 0), 1);
  if (reach > 0 && input.pose !== "hang" && input.pose !== "vine" && input.pose !== "swing" && !pose.handF.hidden) {
    pose.handF.dx += 7 * reach;
    pose.handF.dy -= 5 * reach;
    pose.handF.rot -= 0.3 * reach;
    pose.head.dx += 1.2 * reach; // he looks where he reaches
  }

  pose.hair.hidden = true; // W0-F5: heads carry hair; the tuft double-drew
  return pose;
};

/** The throw pose hides the flying hand — the fist IS that hand, out working. */
export const withFistAway = (pose: RigPose): RigPose => ({
  ...pose,
  handF: { ...pose.handF, hidden: true },
});
