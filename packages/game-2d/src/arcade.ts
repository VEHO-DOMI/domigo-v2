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

  // Source-exact where kind (Keen 4 via Omnispeak, ck_keen.c/ck_phys.c/ACTION.CK4;
  // conversion: 1 unit/tic = 13.125 of-our-px/s, 1 unit/tic² = 918.75 px/s²).
  runSpeed: 315, // 24 u/tic exact (ACTION.CK4 run actions) = 6.56 tiles/s
  firstStepScale: 0.25, // Keen's ¼-strength step out of standing
  airAccel: 919, // 1 u/tic² exact (CK_PhysAccelHorz ±2 on odd tics)
  airFriction: 459, // 0.5 u/tic² exact (CK_PhysDampHorz)
  jumpRunCarry: 0.667, // takeoff velX = 16 u/tic of the 24 run (ck_keen.c:733)

  gravity: 1840, // 2 u/tic² exact (CK_PhysGravityHigh +4 on odd tics)
  gravityEasyScale: 0.75, // Keen's REAL easy dial: GravityMid 3 vs High 4
  maxFall: 900, // 70 u/tic ≈ 919 px/s terminal (kept a hair kinder)

  jumpThrust: -525, // -40 u/tic exact — with 255ms fuel: max ≈ 4.3 tiles, tap ≈ 1.9
  jumpFuelMs: 255, // Keen's 18 tics @70Hz
  pogoThrust: -560, // above the jump's -525 (Keen: 48 vs 40 u/tic, same ordering)
  pogoFuelMs: 280, // ≈ 24 tics (base bounce ≈ 5 tiles at g=1840; hold-trick higher)
  pogoSteerScale: 0.5, // half-authority air control on the stick
  pogoHoldGravityScale: 0.4, // the "impossible pogo": hold jump → tiny gravity

  coyoteMs: 90,
  bufferMs: 130,
  regrabLockMs: 280, // after releasing a ledge (Keen's 19-tic pole lockout)
  pullUpMs: 260, // the scripted 4-step pull-up, condensed

  // poles (v2.2, Keen's climb/slide split: up is deliberate, down is a ride).
  // Authoring law: a ledge served by a pole sits ≤1 row above the pole's top.
  poleClimbVy: 150, // Keen's 105 is authentic but tedious — kept kinder (flagged)
  poleSlideVy: 315, // 24 u/tic exact — the slide IS run speed
  poleExitVy: -450, // jump-off: rise v²/2g ≈ 55px ≈ 1.15 tiles (Keen's hop ≈ 1.17)
  poleTopVy: -520, // top-out pop ≈ 73px ≈ 1.5 tiles — clears a '=' hatch one row up

  knockbackX: 240,
  knockbackY: -420,
  iframesMs: 1200,

  // camera (bible §2.6): dead-band = tiles 6..9 of the 15-wide view;
  // vertical follow ONLY while grounded/hanging; look offset = ±2 tiles.
  camBandLeft: 6,
  camBandRight: 9,
  camRestY: 0.62, // player sits 62% down the view when grounded
  camLerp: 0.12,
  // Keen's look is asymmetric (up ≈1.7 tiles, down ≈51% of the view!) — the
  // verb exists so kids can SCOUT A DROP before committing (ck_play.c:2087)
  lookUpTiles: 2,
  lookDownTiles: 4,
  lookDelayMs: 350, // hold up/down this long before the camera commits
  // mid-air safety clamp (ck_play.c:2176): even airborne, feet never pass
  // these view fractions — long falls CHASE the player, no blind drops
  camAirClampLo: 0.8,
  camAirClampHi: 0.12,

  // slopes ('/' and '\' — Keen's steep 1:1 pair; ck_phys.c slope table type 4/7):
  // running downhill gets a push, uphill a drag (±8 u/tic = 105 px/s ours)
  slopePush: 105,

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
  // pogo COASTING (ck_keen.c:1380): stick neutral → velX is kept EXACTLY —
  // the pogo holds its line over gaps. Friction only applies to plain jumps.
  if (onPogo && dir === 0) return vx;
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
  const tiles = lookDir === 1 ? ARCADE.lookDownTiles : ARCADE.lookUpTiles;
  return playerY - viewH * ARCADE.camRestY + lookDir * tiles * TILE_PX;
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

// v5.2 sharpness law: the canvas renders at ×2 while the WORLD keeps its
// coordinates — camera zoom bridges the two. A 480px-wide view painted into a
// 480px canvas then CSS-stretched to ~900px decimated the HD art (Koki: "still
// super pixelated"); at ×2 the art rasterizes at ~2× the texels before CSS
// touches it. Physics, level data and every world coordinate stay untouched.
export const RENDER_SCALE = 2;

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
  /** v2.1 (bible 27 §6.1): palette family for the level's look (procedural
   *  until art lands). Absent = the ink default. */
  theme?: string;
  /** v2.1: the story chapter this level belongs to ("ch01"). */
  chapter?: string;
  /** v2.2 (the calibration round, corpus-studied): patrolling platforms —
   *  Keen's thruster platforms. Kinematic, player-carrying, ping-pong between
   *  the two cell anchors over `periodMs`. */
  movers?: Mover[];
  /** v2.2: the level's GOAL line, shown on the start card + objective chip
   *  (Koki: "the goal should be laid out — take the student by the hand"). */
  goalDe?: string;
  /** doc 28 §1.2: the CLT Warum-Zeile — why this level matters, in-story;
   *  shown on the goal card above the mission text. */
  whyDe?: string;
  /** v4 (doc 30 §3): number-swarm barriers — a rect of swirling digits that
   *  blocks passage until its rapid chain is cleared. */
  swarms?: Array<{ c: number; r: number; w: number; h: number }>;
  /** v4: the restoration room's drained objects (↑ to name + colour each;
   *  all restored → the room's seal releases). stem = cr_<stem> art pair. */
  restoreRoom?: { objects: Array<{ c: number; r: number; stem: string }>; seal: number };
  /** v4: the command-duel post (the ghost-student). Winning releases `seal`. */
  duel?: { c: number; r: number; seal: number };
  /** v4 (doc 30 §1.2): per-unit goal-card explainer bullets — the chrome
   *  speaks THIS unit's fiction, never a cross-unit formula. */
  hintsDe?: string[];
  /** v4: the per-unit name of the level's locks (HUD chip; ch01 = Stundenseiten). */
  sealNounDe?: string;
}

/** A patrolling platform (both anchors in cells; w in tiles). */
export interface Mover {
  c1: number;
  r1: number;
  c2: number;
  r2: number;
  w: number;
  periodMs: number;
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
  /** legacy exit (K-3 levels): the artifact pedestal. */
  pedestal: { c: number; r: number };
  /** v2.1 exit (bible §2b): the guardian's door — seals unseal it; entering
   *  starts the boss duel. A level has exactly one of pedestal ('A') or
   *  bossDoor ('B'). */
  bossDoor: { c: number; r: number } | null;
  /** v2.1: Glühwörter — the collectible that becomes Hinweis-Funken (§5.2). */
  gluehwoerter: Array<{ c: number; r: number }>;
  /** v2.2: climbable poles ('|') — Keen's vertical connective tissue
   *  (climb up/down, slide fast, jump off; threads floor holes). */
  poles: Array<{ c: number; r: number }>;
  /** v2.2: in-level door PAIRS ('1'–'4', two cells each) — Keen's interiors:
   *  disconnected sub-rooms on one canvas, linked by walk-in doors. */
  doors: Array<{ id: string; a: { c: number; r: number }; b: { c: number; r: number } }>;
  /** v2.3: sloped ground — '/' rises rightward (dir 1), '\' falls rightward
   *  (dir -1). Keen's steep 1:1 pair (ck_phys.c slope types 4/7); the scene
   *  ground-follows via slopeSurfaceY, no AABB body. */
  slopes: Array<{ c: number; r: number; dir: 1 | -1 }>;
}

/** The walkable surface height of a slope cell at in-cell x fraction fx∈[0,1]:
 *  y in px from the LEVEL top. '/' (dir 1): left edge = cell bottom, right
 *  edge = cell top. '\' (dir -1): mirrored. */
export function slopeSurfaceY(cell: { c: number; r: number; dir: 1 | -1 }, fx: number): number {
  const t = Math.min(Math.max(fx, 0), 1);
  const rise = cell.dir === 1 ? t : 1 - t;
  return (cell.r + 1) * TILE_PX - rise * TILE_PX;
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

/** Parse a level. Throws on authoring mistakes (loud beats tolerant).
 *  v2.1 glyphs: 'G' Glühwort · 'B' boss door (the v2.1 exit; exactly one of
 *  'A' or 'B' per level — bible 27 §2b). */
export function parseArcadeLevel(header: ArcadeHeader, rows: string[]): ArcadeLevel {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  if (rows.some((r) => r.length !== w)) throw new Error(`${header.id}: rows must be rectangular`);
  const level: ArcadeLevel = { header, w, h, rows, solids: [], oneWays: [], hazards: [], letters: [], checkpoints: [], start: { c: 1, r: 1 }, pedestal: { c: w - 2, r: 1 }, bossDoor: null, gluehwoerter: [], poles: [], doors: [], slopes: [] };
  const doorCells = new Map<string, Array<{ c: number; r: number }>>();
  let sawStart = 0;
  let sawPedestal = 0;
  let sawBoss = 0;
  for (let r = 0; r < h; r += 1) {
    for (let c = 0; c < w; c += 1) {
      const ch = rows[r]![c]!;
      if (ch === "#") level.solids.push({ c, r });
      else if (ch === "=") level.oneWays.push({ c, r });
      else if (ch === "^") level.hazards.push({ c, r });
      else if (ch === "L") level.letters.push({ c, r });
      else if (ch === "G") level.gluehwoerter.push({ c, r });
      else if (ch === "C") level.checkpoints.push({ c, r });
      else if (ch === "S") { level.start = { c, r }; sawStart += 1; }
      else if (ch === "A") { level.pedestal = { c, r }; sawPedestal += 1; }
      else if (ch === "B") { level.bossDoor = { c, r }; sawBoss += 1; }
      else if (ch === "|") level.poles.push({ c, r });
      else if (ch === "/" || ch === "\\") level.slopes.push({ c, r, dir: ch === "/" ? 1 : -1 });
      else if (ch >= "1" && ch <= "4") {
        const arr = doorCells.get(ch) ?? [];
        arr.push({ c, r });
        doorCells.set(ch, arr);
      }
      else if (ch !== ".") throw new Error(`${header.id}: unknown glyph "${ch}" at ${c},${r}`);
    }
  }
  if (sawStart !== 1) throw new Error(`${header.id}: needs exactly one S (got ${sawStart})`);
  if (sawPedestal + sawBoss !== 1) throw new Error(`${header.id}: needs exactly one exit — one A or one B (got A=${sawPedestal}, B=${sawBoss})`);
  for (const [id, cells] of doorCells) {
    if (cells.length !== 2) throw new Error(`${header.id}: door '${id}' needs exactly two cells (got ${cells.length})`);
    level.doors.push({ id, a: cells[0]!, b: cells[1]! });
  }
  for (const m of header.movers ?? []) {
    for (const [c, r] of [[m.c1, m.r1], [m.c2, m.r2]] as const) {
      if (c < 0 || c + m.w > w || r < 0 || r >= h) throw new Error(`${header.id}: mover anchor out of bounds at ${c},${r}`);
    }
    if (m.w < 1 || m.periodMs < 800) throw new Error(`${header.id}: mover needs w ≥ 1 and periodMs ≥ 800`);
  }
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
  // v2.3: a slope cell IS its own footing (the surface lives inside the cell)
  for (const s of level.slopes) out.add(`${s.c},${s.r}`);
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
  // v2.2: poles are climbable cells; a mover's top at BOTH anchors is a
  // standable platform; both extend the envelope (corpus-studied verbs)
  const poleKeys = new Set(level.poles.map((p) => `${p.c},${p.r}`));
  for (const k of poleKeys) stand.add(k);
  const moverTops = new Map<string, string[]>(); // top-cell key → the OTHER anchor's top cells
  for (const m of level.header.movers ?? []) {
    const tops = (c0: number, r0: number) => Array.from({ length: m.w }, (_, i) => `${c0 + i},${r0 - 1}`);
    const a = tops(m.c1, m.r1);
    const b = tops(m.c2, m.r2);
    for (const k of [...a, ...b]) stand.add(k);
    for (const k of a) moverTops.set(k, b);
    for (const k of b) moverTops.set(k, a);
  }
  const doorAt = new Map<string, { c: number; r: number }>();
  for (const d of level.doors) {
    doorAt.set(`${d.a.c},${d.a.r}`, d.b);
    doorAt.set(`${d.b.c},${d.b.r}`, d.a);
  }
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
    const key = `${c},${r}`;
    // v2.2 edges: a pole reaches its whole column (+ step-offs happen via
    // the normal moves from each pole cell); a door reaches its pair; a
    // mover top reaches the other anchor's top (the ride)
    if (poleKeys.has(key)) { tryVisit(c, r - 1); tryVisit(c, r + 1); }
    const pair = doorAt.get(key);
    if (pair) tryVisit(pair.c, pair.r);
    for (const k of moverTops.get(key) ?? []) { const [mc, mr] = k.split(",").map(Number); tryVisit(mc!, mr!); }
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

  const exit = level.bossDoor ?? level.pedestal;
  const mustReach: Array<[string, { c: number; r: number }]> = [
    [level.bossDoor ? "boss door" : "pedestal", exit],
    ...level.checkpoints.map((cp, i) => [`checkpoint ${i}`, cp] as [string, { c: number; r: number }]),
  ];
  for (const [name, cell] of mustReach) {
    // the target itself or a standable within 1 cell (pickups float)
    const near = [[0, 0], [0, 1], [-1, 0], [1, 0], [0, -1]].some(([dc, dr]) => seen.has(`${cell.c + dc!},${cell.r + dr!}`));
    if (!near) errors.push(`${name} at ${cell.c},${cell.r} unreachable from start`);
  }
  // pickups (letters + Glühwörter): reachable at tier E — the Glühwort law
  // (bible 27 §6.6): every collectible must be earnable on the easy population
  for (const [what, list] of [["letter", level.letters], ["Glühwort", level.gluehwoerter]] as const) {
    for (const l of list) {
      const near = [[0, 1], [0, 0], [-1, 1], [1, 1], [0, 2]].some(([dc, dr]) => seen.has(`${l.c + dc!},${l.r + dr!}`));
      if (!near) errors.push(`${what} at ${l.c},${l.r} unreachable`);
    }
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
/** The WS-HINT ladder carried by hand-authored story tasks (doc 29 §4.5). */
export interface GameTaskHints {
  firstLetter?: string;
  length?: number;
  deDesc: string;
  deWord: string;
}

export interface Quickfire {
  itemId: string;
  kind: "vocab" | "grammar";
  pool: VocabPool | null;
  ask: string;
  prompt: string;
  chips: string[];
  answer: string;
  /** present on story tasks only — renders the hint ladder */
  hints?: GameTaskHints;
  /** v4: optional art stem for the prompt display. */
  art?: string;
}

const QF_POOLS: readonly VocabPool[] = ["deToEn", "enToDe", "definition"];

/** v5 W0 SHUFFLE LAW (Koki's verdict round): authored task JSON lists the
 *  answer FIRST (that's the content format's contract) — so every card
 *  SURFACE must shuffle its chips before display, seeded by task id: stable
 *  across re-renders of the same card, different across tasks. */
export function displayChips(chips: readonly string[] | null | undefined, seed: string): string[] {
  if (!chips || chips.length === 0) return [];
  return seededPick([...chips], `${seed}#display`, chips.length);
}

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
  /** present on story tasks only — renders the hint ladder */
  hints?: GameTaskHints;
  /** v4: the character/antic art stem whose image IS the prompt. */
  art?: string;
  /** v4 colorroom: the second stage (colour pick). */
  colour?: { promptEn: string; answer: string; options: string[] };
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

/** THE STORY-TASK PACK (doc 29 §4): hand-authored per-chapter tasks, mapped by
 *  the page into the game's native task shapes. When present, the game NEVER
 *  falls back to the imported unit pools (the story-task law). */
export interface StoryTaskPack {
  quickfire: Quickfire[];
  rescue: RescueTask[];
  boss: RescueTask[];
  seal: RescueTask[];
  /** v4 modality pools (doc 30 §3) — empty arrays when the chapter has none. */
  battle: RescueTask[];
  swarm: Quickfire[];
  colorroom: RescueTask[];
  duel: RescueTask[];
  finale: RescueTask[];
}

/** Story tasks grade locally against their authored answer (their g1.game.*
 *  ids are not unit-corpus items). Tolerant: case/space-insensitive, one typo
 *  forgiven on words of 4+ letters (the "knapp" spirit). */
export function gradeStoryAnswer(answer: string, input: string): boolean {
  const norm = (s: string): string => s.toLowerCase().trim().replace(/\s+/g, " ");
  const a = norm(answer);
  const b = norm(input);
  if (a === b) return true;
  if (a.length < 4 || b.length < 3) return false;
  // ≤1 edit (insert/delete/replace)
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i += 1; j += 1; continue; }
    edits += 1;
    if (edits > 1) return false;
    if (a.length > b.length) i += 1;
    else if (b.length > a.length) j += 1;
    else { i += 1; j += 1; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}
