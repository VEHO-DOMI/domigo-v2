/**
 * K-3 · the arcade brain (pure, unit-tested — the anim/path/world.ts pattern).
 *
 * "Tintenlauf" rebuilt to the Arcade Design Bible (docs/handover/25). Every
 * number here derives from the studied Keen 4–6 source (behavior re-expressed
 * from scratch — ZERO code copied from any reference; see the bible §0):
 * digital ground / analog air, the THRUST-FUEL jump (KA-1's impulse-cut was
 * wrong), the pogo as a first-class toggle verb with the tiny-gravity hold
 * trick, the ledge-grab predicate, Keen's camera dead-band + grounded-gated
 * vertical follow, a six-creature vocabulary, and the header/layout level
 * format v2 (tier placements, seals, checkpoints, the artifact pedestal).
 *
 * One grading brain: quickfire chips and rescue tasks grade through
 * @domigo/engine and post through the normal attempts path — this file only
 * decides presentation and physics.
 */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { vocabAnswers, type VocabPool } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { hash32 } from "./battle.ts";
import { vocabPrompt } from "@domigo/task-ui/vocab-pool";

// ---------------------------------------------------------------------------
// Physics — the Keen feel for 48px tiles at a fixed 60Hz step (px, px/s, ms).
// Keen ground truth (16px tiles @70Hz; px/s = units-per-tic × 4.375):
//   walk 24 u/tic ≈ 105 px/s ≈ 6.6 tiles/s, DIGITAL (zero accel, zero skid;
//   ¼-strength first step); air accel ±2 u/odd-tic cap 24 (fully analog);
//   jump yspeed −40 for up to 18 tics of held THRUST (release = fuel to zero,
//   not velocity to zero); pogo −48 for 24 tics, auto-rebounce forever,
//   half-authority steering, hold-jump swaps gravity for tiny-gravity;
//   gravity +4/odd-tic cap 70 (Easy: +3 — gravity itself is a difficulty
//   dial); ledge grab only while falling + holding toward the wall.
// Documented kid deviations (bible §2.7): coyote time, input buffering,
// 3 hearts, checkpoints. All invisible forgiveness, no expressive tech.
// ---------------------------------------------------------------------------
export const ARCADE = {
  /** Fixed simulation step (Phaser arcade fixedStep@60 — bible §2.0). */
  tickMs: 1000 / 60,
  maxTicksPerFrame: 4,

  runSpeed: 288, // px/s = 6 tiles/s — DIGITAL on ground
  firstStepScale: 0.25, // Keen's ¼-strength step out of standing
  airAccel: 820, // px/s² toward held direction (analog air)
  airFriction: 410, // px/s² bleed when nothing held mid-air
  jumpRunCarry: 0.6, // takeoff keeps 60% of run speed; air accel closes it

  gravity: 2200, // px/s²
  gravityEasyScale: 0.88, // tier E: Keen's weak-gravity dial
  maxFall: 900, // px/s terminal

  jumpThrust: -440, // px/s held during the fuel window
  jumpFuelMs: 240, // ≈ Keen's 18 tics @70Hz (tuned in-browser: hold ≈ 3.2 tiles)
  pogoThrust: -500,
  pogoFuelMs: 280, // ≈ 24 tics (pogo ≈ 4.3 tiles; hold-trick ≈ 6)
  pogoSteerScale: 0.5, // half-authority air control on the stick
  pogoHoldGravityScale: 0.4, // the "impossible pogo": hold jump → tiny gravity

  coyoteMs: 90,
  bufferMs: 130,
  regrabLockMs: 280, // after releasing a ledge (Keen's 19-tic pole lockout)
  pullUpMs: 260, // the scripted 4-step pull-up, condensed

  knockbackX: 240,
  knockbackY: -420,
  iframesMs: 1200,

  // camera (bible §2.6): dead-band = tiles 6..9 of the 15-wide view;
  // vertical follow ONLY while grounded/hanging; look offset = ±2 tiles.
  camBandLeft: 6,
  camBandRight: 9,
  camRestY: 0.62, // player sits 62% down the view when grounded
  camLerp: 0.12,
  lookTiles: 2,
  lookDelayMs: 350, // hold up/down this long before the camera commits

  // creatures
  walkerSpeed: 70,
  hopperVx: 110,
  hopperVy: -560,
  flyerAmp: 42,
  flyerHz: 0.6,
  flyerRestEveryMs: 5200, // Skypest doctrine: erratic flight, then a ceiling rest
  flyerRestMs: 2400,
  thiefSpeed: 132, // Wortdieb: races you to letters
  thiefTeleportAt: 9 * 48, // farther than this from its target → teleport near it
  cloudWakeTiles: 4,
  cloudDriftAccel: 240, // px/s² toward the player's column
  cloudDriftMax: 120,
  cloudTelegraphMs: 650, // the flash before the bolt — always dodgeable
  cloudCooldownMs: 2600,
  boltSpeed: 620,
  cushionBounceVy: -820, // Sprungkissen: a pogo-grade launch

  quickfireSeconds: { E: 6, M: 5, S: 4 },
} as const;

export type Tier = "E" | "M" | "S";

/** Gravity for a tier (Keen: Easy difficulty literally weakens gravity). */
export function gravityFor(tier: Tier): number {
  return tier === "E" ? Math.round(ARCADE.gravity * ARCADE.gravityEasyScale) : ARCADE.gravity;
}

// ---------------------------------------------------------------------------
// The thrust-fuel jump (bible §2.2) — pure so the arc is pinned by tests.
// While fuel remains AND the button is held, vertical speed IS the thrust
// (gravity suspended); releasing zeroes the FUEL (Keen: jumptime=0), never
// the velocity. A ceiling bump also ends the fuel.
// ---------------------------------------------------------------------------
export interface FuelState {
  fuelMs: number;
  thrust: number;
}

export function startJump(kind: "jump" | "pogo"): FuelState {
  return kind === "jump"
    ? { fuelMs: ARCADE.jumpFuelMs, thrust: ARCADE.jumpThrust }
    : { fuelMs: ARCADE.pogoFuelMs, thrust: ARCADE.pogoThrust };
}

/** One tick of the fuel window. Returns the new state and the velocity to
 *  impose (null = fuel spent, gravity owns the frame). */
export function stepFuel(s: FuelState | null, held: boolean, hitCeiling: boolean, dtMs: number): { next: FuelState | null; vy: number | null } {
  if (s === null || s.fuelMs <= 0 || !held || hitCeiling) return { next: null, vy: null };
  const rem = s.fuelMs - dtMs;
  return { next: rem > 0 ? { ...s, fuelMs: rem } : null, vy: s.thrust };
}

/** Grounded-enough to jump? (coyote + buffer — documented deviations). */
export function canJump(now: number, lastGroundedAt: number, pressedAt: number): boolean {
  return now - lastGroundedAt <= ARCADE.coyoteMs && now - pressedAt <= ARCADE.bufferMs;
}

/** Air-control acceleration for one tick (analog air; pogo halves authority). */
export function airVx(vx: number, dir: -1 | 0 | 1, onPogo: boolean, dtMs: number): number {
  const target = dir * ARCADE.runSpeed;
  const rate = (dir === 0 ? ARCADE.airFriction : ARCADE.airAccel) * (onPogo ? ARCADE.pogoSteerScale : 1);
  const dv = (rate * dtMs) / 1000;
  if (Math.abs(target - vx) <= dv) return target;
  return vx + Math.sign(target - vx) * dv;
}

/** Effective gravity multiplier: the impossible-pogo hold trick. */
export function pogoGravityScale(onPogo: boolean, rising: boolean, jumpHeld: boolean): number {
  return onPogo && rising && jumpHeld ? ARCADE.pogoHoldGravityScale : 1;
}

// ---------------------------------------------------------------------------
// Ledge grab (bible §2.5) — the Keen trigger triple: FALLING + holding TOWARD
// the wall + (hand cell ahead empty ∧ cell below it solid). Pure over the
// glyph grid; the scene snaps the sprite to the returned hang cell.
// ---------------------------------------------------------------------------
export interface HangSpot {
  c: number; // the SOLID cell's column (the ledge being held)
  r: number; // the SOLID cell's row
}

export function ledgeGrabAt(level: ArcadeLevel, px: number, py: number, vy: number, held: -1 | 0 | 1): HangSpot | null {
  if (vy <= 0 || held === 0) return null;
  const c = Math.floor(px / TILE_PX);
  const top = py - TILE_PX * 0.4; // hands ride at the sprite's top edge
  const r = Math.floor(top / TILE_PX); // the row the hands are in right now
  const ahead = c + held;
  if (!solidAt(level, ahead, r)) return null; // must be gripping a solid
  if (solidAt(level, ahead, r - 1)) return null; // a LIP, not a wall face
  if (solidAt(level, c, r - 1) || solidAt(level, c, r)) return null; // player column clear
  // only on the crossing window past the lip (Keen grabs on the crossing tic)
  if (top - r * TILE_PX > TILE_PX * 0.6) return null;
  return { c: ahead, r };
}

/** Where the player's center sits while hanging from a spot. */
export function hangPx(spot: HangSpot, side: -1 | 1): { x: number; y: number } {
  return { x: (spot.c - side) * TILE_PX + TILE_PX / 2 + side * 10, y: spot.r * TILE_PX + TILE_PX * 0.35 };
}

/** Where the pull-up ends (standing on the held cell). */
export function pullUpPx(spot: HangSpot): { x: number; y: number } {
  return { x: spot.c * TILE_PX + TILE_PX / 2, y: (spot.r - 1) * TILE_PX + TILE_PX / 2 };
}

// ---------------------------------------------------------------------------
// The Keen camera (bible §2.6) — pure targets; the scene lerps toward them.
// ---------------------------------------------------------------------------
export function cameraTargetX(camX: number, playerX: number, viewW: number): number {
  const left = camX + (ARCADE.camBandLeft / 15) * viewW;
  const right = camX + (ARCADE.camBandRight / 15) * viewW;
  if (playerX < left) return camX - (left - playerX);
  if (playerX > right) return camX + (playerX - right);
  return camX;
}

/** Vertical target — ONLY meaningful when anchored (grounded or hanging);
 *  the scene holds Y still mid-air (Keen gates vertical follow to ground). */
export function cameraTargetY(playerY: number, viewH: number, lookDir: -1 | 0 | 1): number {
  return playerY - viewH * ARCADE.camRestY + lookDir * ARCADE.lookTiles * TILE_PX;
}

// ---------------------------------------------------------------------------
// Level format v2 (bible §4.1) — HEADER (entities, tiers, seals, checkpoints)
// split from LAYOUT (glyph geometry). Geometry glyphs only:
//   '#' solid · '=' one-way · '^' ink spikes · 'L' letter · 'S' start
//   'A' artifact pedestal · 'C' checkpoint · '.' air
// Enemies/seals/helpers live in the header with difficulty tiers — one map,
// three populations (Keen's verified difficulty dial, §6).
// ---------------------------------------------------------------------------
export const TILE_PX = 48;

export type CreatureKind = "walker" | "hopper" | "flyer" | "thief" | "cushion" | "cloud";

/** Which creatures can trigger a quickfire on contact (the rest are hazards,
 *  rideables or set-pieces — threats are a vocabulary, not a knob). */
export const TASKABLE: Record<CreatureKind, boolean> = {
  walker: true,
  hopper: true,
  flyer: true,
  thief: true,
  cushion: false,
  cloud: false,
};

export interface Placement {
  kind: CreatureKind;
  c: number;
  r: number;
  /** minimum tier at which this placement spawns ("E" = always). */
  tier: Tier;
}

export interface Seal {
  /** where the seal hovers until released */
  c: number;
  r: number;
  /** index into placementsFor(...) — freezing THIS creature releases the seal.
   *  null = free-floating (touch to collect). */
  guard: number | null;
}

export interface HelperPlatform {
  c: number;
  r: number;
  w: number;
  /** spawns at tiers ≤ this (inverse scaffolding: easy gets MORE, §6). */
  maxTier: Tier;
}

export interface ArcadeHeader {
  id: string;
  name: string;
  /** the story fragment this level recovers (HUD + completion copy) */
  fragment: string;
  placements: Placement[];
  seals: Seal[];
  helpers: HelperPlatform[];
}

export interface ArcadeLevel {
  header: ArcadeHeader;
  w: number;
  h: number;
  rows: string[];
  solids: Array<{ c: number; r: number }>;
  oneWays: Array<{ c: number; r: number }>;
  hazards: Array<{ c: number; r: number }>;
  letters: Array<{ c: number; r: number }>;
  checkpoints: Array<{ c: number; r: number }>;
  start: { c: number; r: number };
  pedestal: { c: number; r: number };
}

const TIER_RANK: Record<Tier, number> = { E: 0, M: 1, S: 2 };

/** The population for a tier: base ∪ (M adds "M") ∪ (S adds "S"). */
export function placementsFor(header: ArcadeHeader, tier: Tier): Placement[] {
  return header.placements.filter((p) => TIER_RANK[p.tier] <= TIER_RANK[tier]);
}

/** Helper platforms for a tier (present at tiers ≤ maxTier). */
export function helpersFor(header: ArcadeHeader, tier: Tier): HelperPlatform[] {
  return header.helpers.filter((h) => TIER_RANK[tier] <= TIER_RANK[h.maxTier]);
}

/** Parse a level. Throws on authoring mistakes (loud beats tolerant). */
export function parseArcadeLevel(header: ArcadeHeader, rows: string[]): ArcadeLevel {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  if (rows.some((r) => r.length !== w)) throw new Error(`${header.id}: rows must be rectangular`);
  const level: ArcadeLevel = { header, w, h, rows, solids: [], oneWays: [], hazards: [], letters: [], checkpoints: [], start: { c: 1, r: 1 }, pedestal: { c: w - 2, r: 1 } };
  let sawStart = 0;
  let sawPedestal = 0;
  for (let r = 0; r < h; r += 1) {
    for (let c = 0; c < w; c += 1) {
      const ch = rows[r]![c]!;
      if (ch === "#") level.solids.push({ c, r });
      else if (ch === "=") level.oneWays.push({ c, r });
      else if (ch === "^") level.hazards.push({ c, r });
      else if (ch === "L") level.letters.push({ c, r });
      else if (ch === "C") level.checkpoints.push({ c, r });
      else if (ch === "S") { level.start = { c, r }; sawStart += 1; }
      else if (ch === "A") { level.pedestal = { c, r }; sawPedestal += 1; }
      else if (ch !== ".") throw new Error(`${header.id}: unknown glyph "${ch}" at ${c},${r}`);
    }
  }
  if (sawStart !== 1 || sawPedestal !== 1) throw new Error(`${header.id}: needs exactly one S and one A (got ${sawStart}/${sawPedestal})`);
  for (const p of header.placements) {
    if (p.c < 0 || p.c >= w || p.r < 0 || p.r >= h) throw new Error(`${header.id}: placement out of bounds at ${p.c},${p.r}`);
  }
  for (const s of header.seals) {
    if (s.guard !== null && (s.guard < 0 || s.guard >= header.placements.length)) throw new Error(`${header.id}: seal guard ${s.guard} out of range`);
  }
  return level;
}

export function solidAt(level: ArcadeLevel, c: number, r: number): boolean {
  return level.rows[r]?.[c] === "#";
}

/** Standable ground for creatures/BFS ('#' or a one-way top). */
export function groundAt(level: ArcadeLevel, c: number, r: number): boolean {
  const ch = level.rows[r]?.[c];
  return ch === "#" || ch === "=";
}

// ---------------------------------------------------------------------------
// The level laws (bible §4.2) — validator-grade lints, unit-tested. These run
// in tests over every shipped level; a violated law fails the build.
// ---------------------------------------------------------------------------
export interface LawReport {
  ok: boolean;
  errors: string[];
}

/** Standable cells: empty-ish cell with ground directly below. */
function standables(level: ArcadeLevel): Set<string> {
  const out = new Set<string>();
  for (let r = 0; r < level.h - 1; r += 1) {
    for (let c = 0; c < level.w; c += 1) {
      const ch = level.rows[r]![c]!;
      if (ch !== "#" && ch !== "^" && groundAt(level, c, r + 1)) out.add(`${c},${r}`);
    }
  }
  return out;
}

/** Reachability BFS over the movement envelope: walk ±1, jump up ≤2 rows,
 *  jump across ≤4 columns, fall any depth, ledge/pogo bonus +1 row. Runs on
 *  the EASY population (helpers included as ground). */
export function checkLevelLaws(level: ArcadeLevel): LawReport {
  const errors: string[] = [];
  // helpers count as one-way ground for the law pass
  const rows = level.rows.map((row) => row.split(""));
  for (const hp of helpersFor(level.header, "E")) {
    for (let i = 0; i < hp.w; i += 1) if (rows[hp.r]?.[hp.c + i] === ".") rows[hp.r]![hp.c + i] = "=";
  }
  const patched: ArcadeLevel = { ...level, rows: rows.map((r) => r.join("")) };

  const stand = standables(patched);
  const startKey = `${level.start.c},${level.start.r}`;
  if (!stand.has(startKey)) errors.push(`start ${startKey} is not standable`);

  // BFS
  const seen = new Set<string>([startKey]);
  const queue: Array<[number, number]> = [[level.start.c, level.start.r]];
  const tryVisit = (c: number, r: number): void => {
    const k = `${c},${r}`;
    if (stand.has(k) && !seen.has(k)) { seen.add(k); queue.push([c, r]); }
  };
  while (queue.length > 0) {
    const [c, r] = queue.shift()!;
    // walk
    tryVisit(c - 1, r);
    tryVisit(c + 1, r);
    // jump up (≤3 rows: jump 2 + ledge/pogo bonus 1) onto nearby columns
    for (let dr = 1; dr <= 3; dr += 1) {
      for (const dc of [-1, 0, 1]) tryVisit(c + dc, r - dr);
    }
    // jump across gaps ≤4 columns (same row or one up/down)
    for (let dc = 2; dc <= 4; dc += 1) {
      for (const dir of [-1, 1]) {
        for (const dr of [-1, 0, 1]) tryVisit(c + dir * dc, r + dr);
      }
    }
    // fall: straight down and one sideways column, any depth
    for (const dc of [-1, 0, 1]) {
      for (let rr = r + 1; rr < level.h; rr += 1) {
        const k = `${c + dc},${rr}`;
        if (stand.has(k)) { tryVisit(c + dc, rr); break; }
        if (solidAt(patched, c + dc, rr)) break;
      }
    }
  }

  const mustReach: Array<[string, { c: number; r: number }]> = [
    ["pedestal", level.pedestal],
    ...level.checkpoints.map((cp, i) => [`checkpoint ${i}`, cp] as [string, { c: number; r: number }]),
  ];
  for (const [name, cell] of mustReach) {
    // the target itself or a standable within 1 cell (pickups float)
    const near = [[0, 0], [0, 1], [-1, 0], [1, 0], [0, -1]].some(([dc, dr]) => seen.has(`${cell.c + dc!},${cell.r + dr!}`));
    if (!near) errors.push(`${name} at ${cell.c},${cell.r} unreachable from start`);
  }
  for (const l of level.letters) {
    const near = [[0, 1], [0, 0], [-1, 1], [1, 1], [0, 2]].some(([dc, dr]) => seen.has(`${l.c + dc!},${l.r + dr!}`));
    if (!near) errors.push(`letter at ${l.c},${l.r} unreachable`);
  }

  // gap law: interior columns with NO standable footing at all (bottomless
  // or spike-only) may run at most 5 wide — the pogo's reach (helpers count;
  // they exist exactly to bridge easy-mode gaps)
  const hasStand = new Set<number>();
  for (const key of stand) hasStand.add(Number(key.split(",")[0]));
  let run = 0;
  for (let c = 1; c < level.w - 1; c += 1) {
    if (hasStand.has(c)) run = 0;
    else {
      run += 1;
      if (run > 5) errors.push(`columns ending ${c}: ${run}-wide footing-less run exceeds pogo reach (5)`);
    }
  }

  // spike-recovery law: every spike run has non-spike ground within 4 cells
  // on at least one side at its own row (a safe footing to return to)
  for (const hz of level.hazards) {
    let safe = false;
    for (let d = 1; d <= 4 && !safe; d += 1) {
      for (const dir of [-1, 1]) {
        const c = hz.c + dir * d;
        if (level.rows[hz.r]?.[c] !== "^" && groundAt(level, c, hz.r + 1)) { safe = true; break; }
        if (level.rows[hz.r + 1]?.[c] === "#" && level.rows[hz.r]?.[c] === ".") { safe = true; break; }
      }
    }
    if (!safe) errors.push(`spikes at ${hz.c},${hz.r}: no safe footing within 4 cells`);
  }

  // verticality quota (§4.2 law 5): the standable floor's elevation must
  // change ≥4 times per 15-column screen-width
  const floorAt: number[] = [];
  for (let c = 0; c < level.w; c += 1) {
    for (let r = 0; r < level.h; r += 1) {
      if (stand.has(`${c},${r}`)) { floorAt[c] = r; break; }
    }
  }
  for (let s = 0; s + 15 <= level.w; s += 15) {
    let changes = 0;
    for (let c = s + 1; c < s + 15; c += 1) {
      if (floorAt[c] !== undefined && floorAt[c - 1] !== undefined && floorAt[c] !== floorAt[c - 1]) changes += 1;
    }
    if (changes < 4) errors.push(`columns ${s}-${s + 14}: only ${changes} elevation changes (law: ≥4 per screen)`);
  }

  return { ok: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Creature stepping (pure) — the scene calls these each tick and applies the
// returned intents. Every creature is one readable idea (bible §3).
// ---------------------------------------------------------------------------

/** Tintenläufer: turn at walls AND cliff edges (Keen's R_Walk). */
export function walkerShouldTurn(level: ArcadeLevel, c: number, r: number, dir: 1 | -1): boolean {
  const ahead = c + dir;
  if (level.rows[r]?.[ahead] === "#") return true;
  return !groundAt(level, ahead, r + 1);
}

/** Flatterklecks flight bob. */
export function flyerOffset(tMs: number, seed: number): number {
  return Math.sin((tMs / 1000) * ARCADE.flyerHz * Math.PI * 2 + (seed % 7)) * ARCADE.flyerAmp;
}

/** Flatterklecks rest cycle: flying | resting (on the nearest ceiling). */
export function flyerPhase(tMs: number, seed: number): "fly" | "rest" {
  const cycle = ARCADE.flyerRestEveryMs + ARCADE.flyerRestMs;
  const at = (tMs + (seed % 5) * 900) % cycle;
  return at < ARCADE.flyerRestEveryMs ? "fly" : "rest";
}

/** Wortdieb target: the nearest letter not yet taken (by player or thief).
 *  Returns null when nothing is left to steal (the thief then idles). */
export function thiefTarget(
  letters: Array<{ c: number; r: number; taken: boolean }>,
  x: number,
  y: number,
): { c: number; r: number } | null {
  let best: { c: number; r: number } | null = null;
  let bestD = Infinity;
  for (const l of letters) {
    if (l.taken) continue;
    const d = Math.abs(l.c * TILE_PX - x) + Math.abs(l.r * TILE_PX - y);
    if (d < bestD) { bestD = d; best = { c: l.c, r: l.r }; }
  }
  return best;
}

export type CloudState =
  | { kind: "sleep" }
  | { kind: "drift"; vx: number }
  | { kind: "telegraph"; untilMs: number }
  | { kind: "cooldown"; untilMs: number };

/** Schattenwolke brain: sleep → drift toward the player's column → telegraph
 *  (a readable flash) → bolt (the scene spawns it) → cooldown. Pure. */
export function stepCloud(
  s: CloudState,
  self: { x: number; y: number },
  player: { x: number; y: number },
  now: number,
  dtMs: number,
): { next: CloudState; vx: number; spawnBolt: boolean } {
  const dx = player.x - self.x;
  const dyDown = player.y - self.y;
  switch (s.kind) {
    case "sleep": {
      const near = Math.abs(dx) < ARCADE.cloudWakeTiles * TILE_PX && dyDown > 0 && dyDown < 7 * TILE_PX;
      return { next: near ? { kind: "drift", vx: 0 } : s, vx: 0, spawnBolt: false };
    }
    case "drift": {
      const dv = (ARCADE.cloudDriftAccel * dtMs) / 1000;
      let vx = s.vx + Math.sign(dx) * dv;
      vx = Math.max(-ARCADE.cloudDriftMax, Math.min(ARCADE.cloudDriftMax, vx));
      const aligned = Math.abs(dx) < TILE_PX * 0.6 && dyDown > 0 && dyDown < 7 * TILE_PX;
      if (aligned) return { next: { kind: "telegraph", untilMs: now + ARCADE.cloudTelegraphMs }, vx: 0, spawnBolt: false };
      return { next: { kind: "drift", vx }, vx, spawnBolt: false };
    }
    case "telegraph":
      if (now >= s.untilMs) return { next: { kind: "cooldown", untilMs: now + ARCADE.cloudCooldownMs }, vx: 0, spawnBolt: true };
      return { next: s, vx: 0, spawnBolt: false };
    case "cooldown":
      if (now >= s.untilMs) return { next: { kind: "drift", vx: 0 }, vx: 0, spawnBolt: false };
      return { next: s, vx: 0, spawnBolt: false };
  }
}

// ---------------------------------------------------------------------------
// QUICKFIRE — one word, three chips, one tap (unchanged doctrine; §5.2).
// Wrong/timeout now costs a LETTER (the creature escapes with it), never a
// heart — hearts belong to the physical world.
// ---------------------------------------------------------------------------
export interface Quickfire {
  itemId: string;
  kind: "vocab" | "grammar";
  pool: VocabPool | null;
  ask: string;
  prompt: string;
  chips: string[];
  answer: string;
}

const QF_POOLS: readonly VocabPool[] = ["deToEn", "enToDe", "definition"];

function seededPick<T>(arr: T[], seed: string, n: number): T[] {
  const s = [...arr];
  let h = hash32(seed) || 1;
  const next = () => {
    h = (Math.imul(h, 1664525) + 1013904223) >>> 0;
    return h / 0x100000000;
  };
  for (let i = s.length - 1; i > 0; i -= 1) {
    const j = Math.floor(next() * (i + 1));
    [s[i], s[j]] = [s[j]!, s[i]!];
  }
  return s.slice(0, n);
}

function primary(r: ResolvedItem, pool: VocabPool | null): string {
  const answers = r.kind === "vocab" ? vocabAnswers(r.item as VocabItem, pool ?? "carrier") : (r.item as GrammarItem).answers;
  return answers.find((a) => a.tier === "full")?.text ?? "";
}

export function quickfireFor(items: ResolvedItem[], idx: number): Quickfire | null {
  const r = items[idx % Math.max(items.length, 1)];
  if (!r) return null;

  if (r.kind === "grammar") {
    const g = r.item as GrammarItem;
    const answer = g.answers.find((a) => a.tier === "full")?.text ?? "";
    if (answer === "" || g.distractors.length < 2) return null;
    const decoys = seededPick(g.distractors.filter((d) => d.toLowerCase() !== answer.toLowerCase()), g.id, 2);
    if (decoys.length < 2) return null;
    return {
      itemId: g.id,
      kind: "grammar",
      pool: null,
      ask: "Schnell — was passt?",
      prompt: g.prompt.text,
      chips: seededPick([answer, ...decoys], `${g.id}#chips`, 3),
      answer,
    };
  }

  const v = r.item as VocabItem;
  const pool = QF_POOLS[idx % QF_POOLS.length]!;
  const answer = primary(r, pool);
  if (answer === "") return null;
  const decoys: string[] = [];
  const seen = new Set([answer.toLowerCase()]);
  for (const sib of items) {
    if (decoys.length >= 2) break;
    if (sib === r || sib.kind !== "vocab") continue;
    const d = primary(sib, pool).trim();
    if (d === "" || seen.has(d.toLowerCase()) || d.length > 24) continue;
    seen.add(d.toLowerCase());
    decoys.push(d);
  }
  if (decoys.length < 2) return null;
  const ask = vocabPrompt(v, pool);
  return {
    itemId: v.id,
    kind: "vocab",
    pool,
    ask: ask.instruction,
    prompt: ask.text,
    chips: seededPick([answer, ...decoys], `${v.id}#${pool}#chips`, 3),
    answer,
  };
}

/** Escalating point ladder (Keen's 100/200/500…: capped combo escalation). */
export function comboPoints(streak: number): number {
  return 100 * Math.min(Math.max(streak, 1), 8);
}

// ---------------------------------------------------------------------------
// The RETTUNGSAUFGABE (bible §5.3) — losing the last heart opens the rescue:
// 2 calm, fuller tasks earn re-entry at the checkpoint. Round 1 asks for
// TYPED production (carrier cloze); a failed task scaffolds DOWN to chips on
// its retry — the loop always exits upward. Pure plan; UI in ArcadeGame.
// ---------------------------------------------------------------------------
export interface RescueTask {
  itemId: string;
  kind: "vocab" | "grammar";
  /** typed carrier cloze (production) or chips (scaffolded recognition) */
  presentation: "typed" | "chips";
  ask: string;
  prompt: string;
  /** for typed: the pool to grade against; for chips: options incl. answer */
  pool: VocabPool | null;
  chips: string[] | null;
  answer: string;
}

export function rescuePlan(items: ResolvedItem[], deathCount: number, count = 2): RescueTask[] {
  const vocab = items.filter((r) => r.kind === "vocab");
  const grammar = items.filter((r) => r.kind === "grammar");
  const picked: ResolvedItem[] = [];
  // deterministic rotation by death count — later deaths meet later words
  for (let i = 0; i < count; i += 1) {
    const fromVocab = i % 2 === 0 || grammar.length === 0;
    const poolArr = fromVocab && vocab.length > 0 ? vocab : grammar.length > 0 ? grammar : items;
    if (poolArr.length === 0) break;
    picked.push(poolArr[(deathCount * count + i) % poolArr.length]!);
  }
  return picked
    .map((r): RescueTask | null => {
      if (r.kind === "grammar") {
        const g = r.item as GrammarItem;
        const answer = g.answers.find((a) => a.tier === "full")?.text ?? "";
        if (answer === "" || g.distractors.length < 2) return null;
        return {
          itemId: g.id,
          kind: "grammar",
          presentation: "chips",
          ask: "Was passt in den Satz?",
          prompt: g.prompt.text,
          pool: null,
          chips: seededPick([answer, ...seededPick(g.distractors, g.id, 3)], `${g.id}#rescue`, Math.min(4, 1 + g.distractors.length)),
          answer,
        };
      }
      const v = r.item as VocabItem;
      const ask = vocabPrompt(v, "carrier");
      const answer = vocabAnswers(v, "carrier").find((a) => a.tier === "full")?.text ?? "";
      if (answer === "") return null;
      return {
        itemId: v.id,
        kind: "vocab",
        presentation: "typed",
        ask: ask.instruction,
        prompt: ask.text,
        pool: "carrier",
        chips: null,
        answer,
      };
    })
    .filter((t): t is RescueTask => t !== null);
}

/** The scaffolded fallback for a failed typed task: same item, chips. */
export function rescueScaffold(task: RescueTask, items: ResolvedItem[]): RescueTask {
  if (task.presentation === "chips") return task;
  const decoys: string[] = [];
  const seen = new Set([task.answer.toLowerCase()]);
  for (const sib of items) {
    if (decoys.length >= 2) break;
    if (sib.kind !== "vocab" || sib.item.id === task.itemId) continue;
    const d = primary(sib, task.pool).trim();
    if (d === "" || seen.has(d.toLowerCase())) continue;
    seen.add(d.toLowerCase());
    decoys.push(d);
  }
  return { ...task, presentation: "chips", chips: seededPick([task.answer, ...decoys], `${task.itemId}#scaffold`, Math.min(3, 1 + decoys.length)) };
}
