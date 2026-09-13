import { glyphAt, isHazard, moveBody } from "./collide.ts";
import { BODY_H, BODY_W, PAINT, SUBS, TILE } from "./paint.ts";

/** A real post-movement hero sample, in integer subpixels, once per sim tick.
 * epoch changes on checkpoint respawn/warp; phase changes require a NEW trail. */
export interface CompanionLeaderFrame {
  phaseId: string;
  tick: number;
  epoch: number;
  x: number;
  y: number;
  grounded: boolean;
  dir: 1 | -1;
  paused?: boolean;
}
export interface CompanionPoint { x: number; y: number; grounded: boolean; dir: 1 | -1 }
interface TrailPoint extends CompanionPoint { tick: number }
export type CompanionPose = "stand" | "walk" | "jump";
export interface CompanionTrail {
  phaseId: string;
  point: CompanionPoint;
  pose: CompanionPose;
  status: "joining" | "following" | "waiting";
  lastTick: number | null;
  epoch: number | null;
  /** The first safe point of the actual leader path; walked to, never warped to. */
  anchor: CompanionPoint | null;
  joined: boolean;
  lastLeader: TrailPoint | null;
  /** Airborne segments become playable only after a safe grounded endpoint. */
  pending: TrailPoint[];
  ready: TrailPoint[];
  recovering: boolean;
}
export const COMPANION_DELAY_TICKS = 24;
export const COMPANION_MAX_BUFFER = 600;
export const COMPANION_JOIN_RANGE = 3 * TILE * SUBS;
const MAX_SAMPLE_STEP = 12 * SUBS; // larger than ch01's 5px jump/4px fall, smaller than a cell warp
const JOIN_SPEED = PAINT.runMax;
const samePoint = (a: CompanionPoint, b: CompanionPoint): boolean => a.x === b.x && a.y === b.y;
const validPoint = (p: CompanionPoint): boolean => Number.isSafeInteger(p.x) && Number.isSafeInteger(p.y) && typeof p.grounded === "boolean" && (p.dir === 1 || p.dir === -1);

/** Same body and collision core as the hero. Does not trigger any game events. */
export function companionPointSafe(grid: readonly string[], p: CompanionPoint): boolean {
  if (!validPoint(p)) return false;
  const m = moveBody(grid, p.x, p.y, 0, 0, p.grounded);
  return m.hazard === null && !m.ejected && m.xSubs === p.x && m.ySubs === p.y && (!p.grounded || m.grounded);
}
/** Validate both the original collision move and its swept body, so a newly
 * closed wall/pool blocks playback instead of letting the drawing pass through. */
export function companionSegmentSafe(grid: readonly string[], a: CompanionPoint, b: CompanionPoint): boolean {
  if (!companionPointSafe(grid, a) || !companionPointSafe(grid, b)) return false;
  const dx = b.x - a.x, dy = b.y - a.y;
  if (Math.max(Math.abs(dx), Math.abs(dy)) > MAX_SAMPLE_STEP) return false;
  const m = moveBody(grid, a.x, a.y, dx, dy, a.grounded);
  if (m.hazard !== null || m.ejected || m.xSubs !== b.x || m.ySubs !== b.y) return false;
  // The real mover resolves Y, then X. A diagonal interpolation would pass
  // through the corner it just jumped OVER and reject a valid book-edge jump.
  const hazardAt = (x: number, y: number): boolean => {
    const left = Math.floor((x / SUBS - BODY_W / 2) / TILE);
    const right = Math.floor((x / SUBS + BODY_W / 2 - .001) / TILE);
    const top = Math.floor((y / SUBS - BODY_H + 1) / TILE);
    const bottom = Math.floor((y / SUBS - 1) / TILE);
    for (let r = top; r <= bottom; r++) for (let c = left; c <= right; c++) if (isHazard(glyphAt(grid, c, r))) return true;
    return false;
  };
  const vertical = Math.max(1, Math.ceil(Math.abs(dy) / SUBS));
  for (let i = 1; i <= vertical; i++) if (hazardAt(a.x, a.y + Math.round(dy * i / vertical))) return false;
  const horizontal = Math.max(1, Math.ceil(Math.abs(dx) / SUBS));
  for (let i = 1; i <= horizontal; i++) if (hazardAt(a.x + Math.round(dx * i / horizontal), b.y)) return false;
  return true;
}

/** Explicit phase entry is the only place a new companion position is created.
 * Returns null for a hazardous/unsupported spawn instead of inventing a place. */
export function createCompanionTrail(phaseId: string, spawn: CompanionPoint, grid: readonly string[]): CompanionTrail | null {
  if (phaseId === "" || !spawn.grounded || !companionPointSafe(grid, spawn)) return null;
  return { phaseId, point: { ...spawn }, pose: "stand", status: "waiting", lastTick: null, epoch: null, anchor: null, joined: false, lastLeader: null, pending: [], ready: [], recovering: false };
}

const stop = (s: CompanionTrail): void => { s.pose = "stand"; s.status = "waiting"; };
const breakRecording = (s: CompanionTrail): void => {
  // Completed safe arcs stay queued. Dropping them while the follower is
  // airborne would strand her in midair after the hero's unrelated respawn.
  s.pending = [];
  s.lastLeader = null;
  s.recovering = true;
};
const moveTo = (s: CompanionTrail, target: CompanionPoint): void => {
  const moving = !samePoint(s.point, target);
  s.point = { ...target };
  s.pose = !target.grounded ? "jump" : moving ? "walk" : "stand";
  s.status = "following";
};

/** Walk to the start of the recorded route along real supporting ground.
 * No interpolation across an airborne gap, no offscreen relocation. */
function joinStep(s: CompanionTrail, grid: readonly string[]): boolean {
  const goal = s.anchor;
  if (!goal || !s.point.grounded || Math.hypot(goal.x - s.point.x, goal.y - s.point.y) > COMPANION_JOIN_RANGE) return false;
  if (samePoint(goal, s.point)) { s.joined = true; return true; }
  const dx = Math.sign(goal.x - s.point.x) * Math.min(JOIN_SPEED, Math.abs(goal.x - s.point.x));
  const m = moveBody(grid, s.point.x, s.point.y, dx, 0, true);
  const next: CompanionPoint = { x: m.xSubs, y: m.ySubs, grounded: m.grounded, dir: dx < 0 ? -1 : dx > 0 ? 1 : s.point.dir };
  if (!m.grounded || m.hazard !== null || m.ejected || samePoint(s.point, next) || !companionSegmentSafe(grid, s.point, next)) return false;
  // A supported slope may change height; stop before overshooting the anchor.
  if (Math.abs(goal.x - next.x) > Math.abs(goal.x - s.point.x)) return false;
  moveTo(s, next);
  s.status = "joining";
  if (samePoint(goal, next)) s.joined = true;
  return true;
}

/** One fixed tick. Mutates only this trail; never the hero, level, tasks or enemies.
 * A held card must pass paused=true or omit the frame. Duplicate/old ticks do
 * nothing. A phase mismatch does nothing: the caller must remount explicitly. */
export function stepCompanionTrail(s: CompanionTrail, grid: readonly string[], frame?: CompanionLeaderFrame): void {
  if (!frame || frame.paused || frame.phaseId !== s.phaseId || !Number.isSafeInteger(frame.tick) || !Number.isSafeInteger(frame.epoch) || frame.tick < 0 || frame.epoch < 0 || (s.lastTick !== null && frame.tick <= s.lastTick)) return;
  const point: TrailPoint = { x: frame.x, y: frame.y, grounded: frame.grounded, dir: frame.dir, tick: frame.tick };
  const discontinuity = s.lastTick !== null && (frame.tick !== s.lastTick + 1 || s.epoch !== frame.epoch);
  s.lastTick = frame.tick;
  s.epoch = frame.epoch;
  s.pose = "stand";
  if (discontinuity) breakRecording(s);
  const safe = companionPointSafe(grid, point);
  if (!safe) breakRecording(s);

  if (s.recovering && s.ready.length === 0 && s.point.grounded) {
    // A nearby returning hero can provide a fresh physical route. A far-away
    // checkpoint cannot drag the companion through the intervening scenery.
    s.anchor = null;
    s.joined = false;
    s.recovering = false;
  }
  if (!s.recovering && safe) {
    if (s.lastLeader === null) {
      if (point.grounded) {
        s.anchor = { ...point };
        s.lastLeader = point;
        s.joined = samePoint(s.point, point);
      }
    } else if (!companionSegmentSafe(grid, s.lastLeader, point)) {
      breakRecording(s);
    } else {
      s.pending.push(point);
      s.lastLeader = point;
      if (point.grounded) {
        if (s.ready.length + s.pending.length > COMPANION_MAX_BUFFER) breakRecording(s);
        else { s.ready.push(...s.pending); s.pending = []; }
      } else if (s.pending.length > COMPANION_MAX_BUFFER) breakRecording(s);
    }
  }

  if (!s.joined) {
    if (!joinStep(s, grid)) stop(s);
    return;
  }
  const next = s.ready[0];
  if (!next || frame.tick - next.tick < COMPANION_DELAY_TICKS) { stop(s); return; }
  if (!companionSegmentSafe(grid, s.point, next)) {
    // A changed room invalidates the whole remaining route. The caller may
    // arrange a new safe route; this function never resolves it with a warp.
    s.ready = [];
    breakRecording(s);
    stop(s);
    return;
  }
  s.ready.shift();
  moveTo(s, next);
}
