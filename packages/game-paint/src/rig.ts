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
  footStridePx: 5,
  bodyBobPx: 1.6,
  bodyLeanMaxRad: 0.16,
  handTrailPx: 3.5,
  handArcXPx: 2.5,
  handArcYPx: 1.8,
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
      pose.body.rot = rm ? 0 : RIG.bodyLeanMaxRad * speedT;
      pose.head.dy = -14 + pose.body.dy * 0.7;
      // hands (dossier): the sprinter pump — the lead hand rides closed at
      // chest height ahead of and OVERLAPPING the torso; the trail hand swings
      // open behind at hip height; both trace small arcs (never straight lines)
      pose.handF.dx = 5 + speedT * 4 + (rm ? 0 : Math.cos(a + Math.PI) * RIG.handArcXPx);
      pose.handF.dy = -1 - speedT * 5 + (rm ? 0 : Math.sin(a + Math.PI) * RIG.handArcYPx);
      pose.handB.dx = -7 - RIG.handTrailPx * speedT + (rm ? 0 : Math.cos(a) * RIG.handArcXPx);
      pose.handB.dy = 2 + (rm ? 0 : Math.sin(a) * RIG.handArcYPx);
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
      // dossier: in ballistic rise the hands stop talking — tucked compact
      // into the silhouette; hair, scarf and split feet carry the arc
      pose.handF = P(5, -4, -0.2);
      pose.handB = P(-4, 0, 0.2);
      pose.footF = P(4, 8);
      pose.footB = P(-4, 11);
      pose.hair.rot = rm ? 0 : -0.12;
      break;
    }
    case "fall": {
      // R2a: a low asymmetric reach — the old symmetric double-spread at
      // shoulder height was Koki's "jazz hands"
      pose.handF = P(8, -7, 0.3); // the loose counter-drift above the drop
      pose.handB = P(-5, 1, -0.15); // the anchor fist stays at the hip
      const dangle = rm ? 0 : Math.sin((input.tick % 14) / 14 * TAU) * 1.2;
      pose.footF = P(4 + dangle, 13);
      pose.footB = P(-4 - dangle, 13);
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

  pose.hair.hidden = true; // W0-F5: heads carry hair; the tuft double-drew
  return pose;
};

/** The throw pose hides the flying hand — the fist IS that hand, out working. */
export const withFistAway = (pose: RigPose): RigPose => ({
  ...pose,
  handF: { ...pose.handF, hidden: true },
});
