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
    handF: P(6, -1),
    handB: P(-6, -1),
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
      // hands: trailing, tracing small ARCS (never straight lines)
      pose.handF.dx = 9 - RIG.handTrailPx * speedT + (rm ? 0 : Math.cos(a + Math.PI) * RIG.handArcXPx);
      pose.handF.dy = -2 + (rm ? 0 : Math.sin(a + Math.PI) * RIG.handArcYPx);
      pose.handB.dx = -9 - RIG.handTrailPx * speedT + (rm ? 0 : Math.cos(a) * RIG.handArcXPx);
      pose.handB.dy = -2 + (rm ? 0 : Math.sin(a) * RIG.handArcYPx);
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
      pose.handF = P(7, -12, -0.4);
      pose.handB = P(-7, -12, 0.4);
      pose.footF = P(4, 8);
      pose.footB = P(-4, 10);
      pose.hair.rot = rm ? 0 : -0.12;
      break;
    }
    case "fall": {
      pose.handF = P(11, -8, 0.5);
      pose.handB = P(-11, -8, -0.5);
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
      pose.handF = P(8, -4, -0.2);
      pose.handB = P(-8, -4, 0.2);
      break;
    }
    case "charge": {
      // the fist hand orbits, accelerating with charge — pure anticipation
      const chargeT = Math.max(input.charge, 0) / PAINT.chargeMax;
      const period = RIG.chargeOrbitMaxTicks - (RIG.chargeOrbitMaxTicks - RIG.chargeOrbitMinTicks) * chargeT;
      const a = rm ? 0 : ((input.tick % Math.max(Math.round(period), 1)) / Math.max(Math.round(period), 1)) * TAU;
      pose.handF.dx = 6 + Math.cos(a) * RIG.chargeOrbitPx;
      pose.handF.dy = -4 + Math.sin(a) * RIG.chargeOrbitPx;
      pose.body.rot = rm ? 0 : -0.06; // coiled
      pose.footF = P(5, 12);
      pose.footB = P(-6, 12);
      break;
    }
    case "hang": {
      // W0-F6: the mittens grip ON the painted lip (feet hang 26px below the
      // grabbed top, so dy −24/−25 puts the hands right at the edge)
      pose.handF.dx = 7;
      pose.handF.dy = -24;
      pose.handB.dx = 3;
      pose.handB.dy = -25;
      pose.body.dy = -12;
      pose.head.dy = -22;
      pose.footF.dx = 1;
      pose.footF.dy = 10;
      pose.footB.dx = -3;
      pose.footB.dy = 11;
      pose.body.rot = rm ? 0.06 : 0.06 + Math.sin(((input.tick % 48) / 48) * TAU) * 0.03;
      break;
    }
    case "vine": {
      const a = rm ? 0 : ((input.walkTime % 20) / 20) * TAU;
      pose.handF = P(3, -20 + Math.sin(a) * 2);
      pose.handB = P(-3, -20 - Math.sin(a) * 2);
      pose.footF = P(2, 12 - Math.sin(a) * 2);
      pose.footB = P(-2, 12 + Math.sin(a) * 2);
      break;
    }
    case "swing": {
      pose.handF = P(4, -24);
      pose.handB = P(-4, -24);
      pose.footF = P(5, 13);
      pose.footB = P(-1, 15);
      pose.hair.rot = rm ? 0 : 0.14;
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
