// THE PAINTED BOOK — the player brain (pure, Phaser-free; doc 31 §3).
// One stepPlayer() per 60Hz tick: reads a pad, drives the kernel's moveBody,
// and emits EVENTS for the scene (encounters, throws, landings, springs).
// There is NO death path anywhere in this machine — hazards and enemies open
// task encounters (the scene freezes the world); the only physical setback
// is knockback + i-frames, applied by the scene via applyKnockback().

import {
  type Grid,
  glyphAt,
  isVine,
  ledgeGrabAt,
  moveBody,
} from "./collide.ts";
import { BODY_H, BODY_W, PAINT, SUBS, TILE, fistLaunchSpeed, groundDecay } from "./paint.ts";
import { attachSwing, releaseSwing, stepSwing, type SwingState } from "./swing.ts";

export interface Pad {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  punch: boolean;
}

export const IDLE_PAD: Pad = { left: false, right: false, up: false, down: false, jump: false, punch: false };

export type PlayerPose =
  | "stand" | "walk" | "run" | "jump" | "fall" | "hover"
  | "charge" | "hang" | "vine" | "swing" | "hit";

export interface PlayerState {
  x: number; // subs, body center
  y: number; // subs, FEET line
  vx: number; // subs/tick
  vy: number; // subs/tick
  facing: 1 | -1;
  grounded: boolean;
  pose: PlayerPose;
  onIce: boolean;
  // jump machinery
  jumpTicks: number; // −1 = not in a jump arc
  holdLeft: number; // gravity-suppression ticks remaining
  coyote: number;
  buffer: number;
  // hover (the quill-rotor; unlimited while held — R5)
  hovering: boolean;
  // fist charge (the flying fist itself lives in fist.ts)
  charge: number; // −1 = not charging
  // grabs
  hangAt: { c: number; r: number } | null;
  climbing: boolean;
  swing: SwingState | null;
  // recovery
  iframes: number;
  stun: number; // hit-stun ticks (controls locked)
  // bookkeeping for the rig
  walkTime: number;
  landedAgo: number;
  jumpedAgo: number;
  tick: number;
}

export type PlayerEvent =
  | { type: "jumped" }
  | { type: "landed"; impact: number } // impact in px/t of the landing fall speed
  | { type: "hoverStart" }
  | { type: "sprung" }
  | { type: "fistThrown"; charge: number; speedSubs: number }
  | { type: "encounter"; hazard: string }
  | { type: "grabbedLedge" }
  | { type: "swingStart" };

export interface StepOpts {
  slippery?: boolean; // phase-level surface law
  canRun?: boolean; // the sprint verb (ch13 unlock)
  canHover?: boolean; // the quill-rotor verb (ch04 unlock)
  canPunch?: boolean; // the thrown-fist verb (ch01-mid unlock)
  canHang?: boolean; // the ledge verb (ch02 unlock)
  fistBusy?: boolean; // one fist in flight at a time
  ringAt?: { x: number; y: number } | null; // nearest grabbable ring anchor (subs)
}

const HANG_DROP_PX = 26; // T: feet hang this far below a grabbed ledge top
const HAND_ROW_PX = 24; // T: grab probe height above the feet
const CLIMB_V = Math.round(1.5 * SUBS); // T: vine climb speed 1.5 px/t
const SPRING_VY = -8 * SUBS; // T: spring bounce −8 px/t
const RING_REACH_PX = 14; // T: ring grab radius

export const spawnPlayer = (xPx: number, feetYPx: number): PlayerState => ({
  x: xPx * SUBS,
  y: feetYPx * SUBS,
  vx: 0,
  vy: 0,
  facing: 1,
  grounded: false,
  pose: "fall",
  onIce: false,
  jumpTicks: -1,
  holdLeft: 0,
  coyote: 0,
  buffer: 0,
  hovering: false,
  charge: -1,
  hangAt: null,
  climbing: false,
  swing: null,
  iframes: 0,
  stun: 0,
  walkTime: 0,
  landedAgo: 99,
  jumpedAgo: 99,
  tick: 0,
});

/** The scene applies this on a wrong encounter answer (never on contact). */
export const applyKnockback = (st: PlayerState, fromDir: 1 | -1, fast: boolean): PlayerState => ({
  ...st,
  vx: -fromDir * (fast ? PAINT.knockFastVx : PAINT.knockVx),
  vy: fast ? PAINT.knockFastVy : PAINT.knockVy,
  grounded: false,
  hovering: false,
  swing: null,
  hangAt: null,
  charge: -1,
  stun: 14, // T: control-lock ticks while recoiling
  iframes: PAINT.iframeTicks,
  pose: "hit",
});

export const stepPlayer = (
  st: PlayerState,
  pad: Pad,
  prevPad: Pad,
  grid: Grid,
  opts: StepOpts = {},
): { st: PlayerState; events: PlayerEvent[] } => {
  const events: PlayerEvent[] = [];
  const s: PlayerState = { ...st, tick: st.tick + 1 };
  const jumpPressed = pad.jump && !prevPad.jump;
  const punchPressed = pad.punch && !prevPad.punch;
  const punchReleased = !pad.punch && prevPad.punch;
  const dirInput = (pad.right ? 1 : 0) - (pad.left ? 1 : 0);

  s.landedAgo = Math.min(s.landedAgo + 1, 99);
  s.jumpedAgo = Math.min(s.jumpedAgo + 1, 99);
  if (s.iframes > 0) s.iframes--;

  // ── the swing (a world of its own while attached) ──
  if (s.swing) {
    const swung = stepSwing(s.swing);
    s.swing = swung.swing;
    s.x = swung.xSubs;
    s.y = swung.ySubs;
    s.vx = 0;
    s.vy = 0;
    if (jumpPressed) {
      const rel = releaseSwing(s.swing);
      s.vx = rel.vxSubs;
      s.vy = rel.vySubs;
      s.facing = rel.vxSubs >= 0 ? 1 : -1;
      s.swing = null;
      s.grounded = false;
      s.pose = "jump";
      s.jumpTicks = 0;
      s.holdLeft = 0;
      events.push({ type: "jumped" });
    } else {
      s.pose = "swing";
    }
    return { st: s, events };
  }

  // ── the hang (canonical: a static grip — NO pull-up exists; you clear the
  // ledge by JUMPING up-and-over at full strength; W0-F1) ──
  if (s.hangAt) {
    s.vx = 0;
    s.vy = 0;
    if (jumpPressed) {
      s.hangAt = null;
      s.vy = PAINT.hangJumpVy; // full −5 + the hold window: ~70px, clears any lip
      s.jumpTicks = 0;
      s.holdLeft = PAINT.jumpHoldTicks;
      s.pose = "jump";
      events.push({ type: "jumped" });
    } else if (pad.down) {
      s.hangAt = null;
      s.pose = "fall";
    } else {
      s.pose = "hang"; // UP intentionally does nothing here (camera-look later)
      return { st: s, events };
    }
    return { st: s, events };
  }

  // ── hit-stun: physics only, controls locked ──
  const controlsLocked = s.stun > 0;
  if (s.stun > 0) s.stun--;

  // ── horizontal control ──
  const slippery = opts.slippery === true || s.onIce;
  if (!controlsLocked && dirInput !== 0) {
    s.facing = dirInput as 1 | -1;
    const target = (opts.canRun ? PAINT.runMax : PAINT.walkMax) * dirInput;
    const accel = s.grounded ? PAINT.groundAccel : Math.round((PAINT.groundAccel * PAINT.airControlPct) / 100);
    if (s.vx < target) s.vx = Math.min(s.vx + accel, target);
    else if (s.vx > target) s.vx = Math.max(s.vx - accel, target);
  } else if (s.grounded) {
    s.vx = groundDecay(s.vx, slippery);
  }

  // ── vine climb ──
  const centerCol = Math.floor(s.x / SUBS / TILE);
  const midRow = Math.floor((s.y / SUBS - BODY_H / 2) / TILE);
  const vineHere = isVine(glyphAt(grid, centerCol, midRow));
  if (!s.climbing && vineHere && (pad.up || pad.down) && !s.grounded) {
    s.climbing = true;
    s.x = (centerCol * TILE + TILE / 2) * SUBS; // snap to the column
    s.vx = 0;
  }
  if (s.climbing) {
    if (!vineHere) s.climbing = false;
    else if (jumpPressed) {
      s.climbing = false;
      s.vy = PAINT.jumpVy;
      s.jumpTicks = 0;
      s.holdLeft = PAINT.jumpHoldTicks;
      events.push({ type: "jumped" });
    } else {
      s.vy = pad.up ? -CLIMB_V : pad.down ? CLIMB_V : 0;
      const ny = s.y + s.vy;
      s.y = ny;
      s.pose = "vine";
      return { st: s, events };
    }
  }

  // ── ring grab (swing start): push toward a near ring while airborne ──
  if (!s.grounded && opts.ringAt && !controlsLocked) {
    const dx = Math.abs(s.x - opts.ringAt.x) / SUBS;
    const dy = Math.abs(s.y - BODY_H * SUBS - opts.ringAt.y) / SUBS;
    if (dx <= RING_REACH_PX && dy <= RING_REACH_PX * 2) {
      s.swing = attachSwing(opts.ringAt.x, opts.ringAt.y, s.x);
      s.pose = "swing";
      s.hovering = false;
      events.push({ type: "swingStart" });
      return { st: s, events };
    }
  }

  // ── jump: press, buffer, coyote ──
  const wantsJump = jumpPressed || s.buffer > 0;
  if (!controlsLocked && wantsJump && (s.grounded || s.coyote > 0)) {
    s.vy = PAINT.jumpVy;
    s.jumpTicks = 0;
    s.holdLeft = PAINT.jumpHoldTicks;
    s.grounded = false;
    s.coyote = 0;
    s.buffer = 0;
    s.jumpedAgo = 0;
    events.push({ type: "jumped" });
  } else if (jumpPressed && !s.grounded && s.coyote === 0) {
    s.buffer = PAINT.bufferTicks;
  } else if (s.buffer > 0) {
    s.buffer--;
  }

  // ── gravity, the hold-window, the hover ──
  if (!s.grounded) {
    const inHoldWindow = s.jumpTicks >= 0 && s.holdLeft > 0 && pad.jump;
    if (inHoldWindow) {
      s.holdLeft--;
    } else {
      s.vy += PAINT.gravity;
      if (s.jumpTicks === PAINT.lateNudgeTick) s.vy += PAINT.gravity; // the studied late nudge
    }
    if (s.jumpTicks >= 0) s.jumpTicks++;

    // hover: past the apex, jump held, fuel left, verb unlocked
    const wantsHover = opts.canHover === true && pad.jump && !inHoldWindow && s.vy >= 0 && !controlsLocked;
    if (wantsHover) {
      if (!s.hovering) events.push({ type: "hoverStart" });
      s.hovering = true;
      if (s.vy > PAINT.hoverFallCap) s.vy = PAINT.hoverFallCap;
    } else {
      s.hovering = false;
    }
    if (s.vy > PAINT.fallCap) s.vy = PAINT.fallCap;
    if (s.vy < PAINT.riseCap) s.vy = PAINT.riseCap;
  }

  // ── the fist charge (throwing is an event; flight lives in fist.ts) ──
  if (opts.canPunch === true && !controlsLocked) {
    if (punchPressed && opts.fistBusy !== true) {
      if (s.grounded) {
        s.charge = 5; // the studied ground-charge seed
      } else {
        events.push({ type: "fistThrown", charge: PAINT.airCharge, speedSubs: fistLaunchSpeed(PAINT.airCharge, s.vx) });
      }
    } else if (s.charge >= 0 && pad.punch) {
      s.charge = Math.min(s.charge + 1, PAINT.chargeMax);
    } else if (s.charge >= 0 && punchReleased) {
      events.push({ type: "fistThrown", charge: s.charge, speedSubs: fistLaunchSpeed(s.charge, s.vx) });
      s.charge = -1;
    }
    if (s.charge >= 0 && !s.grounded) s.charge = -1; // walking off a ledge drops the charge
  } else if (s.charge >= 0) {
    s.charge = -1;
  }

  // ── the ledge grab ──
  if (
    opts.canHang === true && !controlsLocked && !s.grounded && s.vy > 0 && !s.hovering &&
    dirInput !== 0 && dirInput === s.facing
  ) {
    const handY = s.y / SUBS - HAND_ROW_PX;
    const c = Math.floor((s.x / SUBS + s.facing * (BODY_W / 2 + 2)) / TILE);
    const r = Math.floor(handY / TILE);
    if (ledgeGrabAt(grid, c, r, s.facing)) {
      const ledgeTop = r * TILE;
      const feet = s.y / SUBS;
      if (Math.abs(feet - (ledgeTop + HANG_DROP_PX)) <= PAINT.ledgeMagnetPx + s.vy / SUBS) {
        s.hangAt = { c, r };
        s.y = (ledgeTop + HANG_DROP_PX) * SUBS;
        // body flush against the grabbed wall face (1px of air between)
        s.x = (s.facing > 0 ? c * TILE - 1 - BODY_W / 2 : (c + 1) * TILE + 1 + BODY_W / 2) * SUBS;
        s.vx = 0;
        s.vy = 0;
        s.hovering = false;
        events.push({ type: "grabbedLedge" });
        s.pose = "hang";
        return { st: s, events };
      }
    }
  }

  // ── the world step ──
  const wasGrounded = s.grounded;
  const fallSpeedPx = s.vy / SUBS;
  const moved = moveBody(grid, s.x, s.y, s.vx, s.vy, s.grounded);
  s.x = moved.xSubs;
  s.y = moved.ySubs;
  s.vx = moved.vxSubs;
  s.vy = moved.vySubs;
  s.grounded = moved.grounded;
  s.onIce = moved.onIce;

  if (s.grounded && !wasGrounded) {
    s.landedAgo = 0;
    s.jumpTicks = -1;
    s.holdLeft = 0;
    s.hovering = false;
    events.push({ type: "landed", impact: fallSpeedPx });
  }
  if (!s.grounded && wasGrounded && s.jumpTicks === -1) {
    s.coyote = PAINT.coyoteTicks; // walked off an edge
  } else if (s.coyote > 0) {
    s.coyote--;
  }

  // ── springs ──
  if (moved.onSpring && s.grounded && !controlsLocked) {
    s.vy = SPRING_VY;
    s.grounded = false;
    s.jumpTicks = 0;
    s.holdLeft = 0;
    events.push({ type: "sprung" });
  }

  // ── hazards open encounters (the scene freezes the world) ──
  if (moved.hazard !== null && s.iframes === 0) {
    s.iframes = PAINT.iframeTicks;
    events.push({ type: "encounter", hazard: moved.hazard });
  }

  // ── bookkeeping + pose ──
  if (s.grounded && Math.abs(s.vx) > 0) s.walkTime++;
  s.pose = derivePose(s, controlsLocked);
  return { st: s, events };
};

const derivePose = (s: PlayerState, locked: boolean): PlayerPose => {
  if (locked || s.stun > 0) return "hit";
  if (s.swing) return "swing";
  if (s.hangAt) return "hang";
  if (s.climbing) return "vine";
  if (s.hovering) return "hover";
  if (!s.grounded) return s.vy < 0 ? "jump" : "fall";
  if (s.charge >= 0) return "charge";
  const speed = Math.abs(s.vx);
  if (speed >= PAINT.runEngage) return "run";
  if (speed > 0) return "walk";
  return "stand";
};
