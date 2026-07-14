/**
 * KA-1 · the arcade brain (pure, unit-tested — the anim/path/world.ts pattern).
 *
 * "Tintenlauf": a side-scrolling ink-run in the Spill universe. This module
 * owns everything DOM-free: the level format (glyph rows + fixed legend — the
 * W-1 data idiom, kept in code until the mock passes its gate), the physics
 * constants (Keen-informed, re-expressed from scratch — no code from the
 * reference sources), enemy step logic, and the QUICKFIRE chip builder (one
 * grading brain: chips grade through @domigo/engine and post through the
 * normal attempts path — this file only decides presentation).
 */
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import { vocabAnswers, type VocabPool } from "@domigo/engine";
import type { ResolvedItem } from "@domigo/game-core";
import { hash32 } from "./battle.ts";
import { vocabPrompt } from "@domigo/task-ui/vocab-pool";

// ---------------------------------------------------------------------------
// Physics — the Keen feel, re-expressed for 48px tiles at 60fps (px, px/s).
// Keen's numbers (16px tiles, ~35Hz tics) translate to roughly these ratios:
// jump ≈ 3.5 tiles of height, variable by early release; strong air control;
// short edge-forgiveness so a late jump at a ledge still fires.
// ---------------------------------------------------------------------------
// Keen-4 measured feel (mined from the reconstruction, re-expressed): ground
// movement is DIGITAL (instant 6.5 tiles/s, zero acceleration or skid — all
// precision lives in snappy ground control), while the AIR is analog (ramping,
// fully-steerable momentum). Keen's terminal fall ≈ 4.4 px/tic @70Hz ≈ 19
// tiles/s on 16px tiles — we run gentler for 9-year-olds. Deliberate
// deviations from Keen, documented: coyote time + jump buffering (Keen has
// none — modern QoL kids deserve), 3 hearts instead of one-hit death.
export const ARCADE = {
  gravity: 2300, // px/s² — snappy fall, floaty enough to steer
  runSpeed: 280, // px/s ≈ 5.8 tiles/s — INSTANT on ground (digital), see scene
  airAccel: 1500, // px/s² — the analog air ramp (Keen: ±2 u/odd-tic toward held dir)
  airFriction: 700, // px/s² bleed when no direction is held mid-air (Keen's FrictionX)
  jumpVelocity: -760, // px/s — ≈3.2 tiles apex held (Keen: ~4 tiles via thrust window)
  jumpCutVelocity: -240, // release clamps ascent (models Keen's jumptime=0 on release)
  maxFall: 900, // px/s terminal fall
  coyoteMs: 90, // edge forgiveness (deviation: Keen drops instantly)
  bufferMs: 130, // early-press buffer (deviation: Keen needs a fresh grounded press)
  hopperVy: -560, // enemy hop impulse (Lick-style toward-player hops)
  hopperVx: 110, // enemy hop drift toward the player
  flyerAmp: 42, // px — flyer sine amplitude (Skypest drift, tamed)
  flyerHz: 0.6, // flyer sine frequency
  walkerSpeed: 70, // px/s patrol (R_WalkNormal: turn at walls AND cliff edges)
} as const;

/** Variable jump height: ascending faster than the cut when the button lifts ⇒
 *  clamp to the cut velocity. Pure so the feel is pinned by tests. */
export function jumpCut(vy: number): number {
  return vy < ARCADE.jumpCutVelocity ? ARCADE.jumpCutVelocity : vy;
}

/** Grounded-enough to jump? True while on ground or within the coyote window;
 *  a buffered press (pressed within bufferMs before landing) also counts. */
export function canJump(now: number, lastGroundedAt: number, pressedAt: number): boolean {
  return now - lastGroundedAt <= ARCADE.coyoteMs && now - pressedAt <= ARCADE.bufferMs;
}

// ---------------------------------------------------------------------------
// Level format — glyph rows with a FIXED legend (a mock needs no schema):
//   '#' solid block · '=' one-way platform (jump through from below)
//   '^' ink spike (hurts) · 'L' letter collectible · 'S' start · 'X' exit gate
//   'w' walker (edge-turn patrol) · 'h' hopper · 'f' flyer · '.' air
// ---------------------------------------------------------------------------
export type EnemyKind = "walker" | "hopper" | "flyer";

export interface ArcadeLevel {
  w: number;
  h: number;
  rows: string[];
  solids: Array<{ c: number; r: number }>;
  oneWays: Array<{ c: number; r: number }>;
  hazards: Array<{ c: number; r: number }>;
  letters: Array<{ c: number; r: number }>;
  enemies: Array<{ kind: EnemyKind; c: number; r: number }>;
  start: { c: number; r: number };
  exit: { c: number; r: number };
}

const ENEMY_GLYPH: Record<string, EnemyKind> = { w: "walker", h: "hopper", f: "flyer" };

/** Parse a level. Throws on authoring mistakes (this is code-side content —
 *  the unit tests are its validator; loud beats tolerant here). */
export function parseArcadeLevel(rows: string[]): ArcadeLevel {
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  if (rows.some((r) => r.length !== w)) throw new Error("arcade level rows must be rectangular");
  const level: ArcadeLevel = { w, h, rows, solids: [], oneWays: [], hazards: [], letters: [], enemies: [], start: { c: 1, r: 1 }, exit: { c: w - 2, r: 1 } };
  let sawStart = false;
  let sawExit = false;
  for (let r = 0; r < h; r += 1) {
    for (let c = 0; c < w; c += 1) {
      const ch = rows[r]![c]!;
      if (ch === "#") level.solids.push({ c, r });
      else if (ch === "=") level.oneWays.push({ c, r });
      else if (ch === "^") level.hazards.push({ c, r });
      else if (ch === "L") level.letters.push({ c, r });
      else if (ch === "S") { level.start = { c, r }; sawStart = true; }
      else if (ch === "X") { level.exit = { c, r }; sawExit = true; }
      else if (ch in ENEMY_GLYPH) level.enemies.push({ kind: ENEMY_GLYPH[ch]!, c, r });
      else if (ch !== ".") throw new Error(`arcade level: unknown glyph "${ch}" at ${c},${r}`);
    }
  }
  if (!sawStart || !sawExit) throw new Error("arcade level needs one S and one X");
  return level;
}

/** Is a cell solid ground (walkers stand on it; edges turn them)? */
export function groundAt(level: ArcadeLevel, c: number, r: number): boolean {
  const ch = level.rows[r]?.[c];
  return ch === "#" || ch === "=";
}

/**
 * The walker's edge-turn rule (the classic Keen slug): given its direction,
 * turn around when the NEXT cell ahead has no ground under it, or is solid.
 * Pure: the scene calls this with grid coords each time a walker crosses a
 * cell boundary.
 */
export function walkerShouldTurn(level: ArcadeLevel, c: number, r: number, dir: 1 | -1): boolean {
  const ahead = c + dir;
  if (level.rows[r]?.[ahead] === "#") return true; // wall ahead
  return !groundAt(level, ahead, r + 1); // cliff ahead
}

/** The flyer's vertical offset (gentle sine bob around its spawn row). */
export function flyerOffset(tMs: number, seed: number): number {
  return Math.sin((tMs / 1000) * ARCADE.flyerHz * Math.PI * 2 + (seed % 7)) * ARCADE.flyerAmp;
}

// ---------------------------------------------------------------------------
// QUICKFIRE — one word, three chips, one tap. Punchy by construction:
// prompts come from the SHORT pools (translations/definitions — the carrier
// sentence is too long to read mid-jump); chips are language-consistent
// (German answers get German decoys); everything is seeded, never random.
// ---------------------------------------------------------------------------
export interface Quickfire {
  itemId: string;
  kind: "vocab" | "grammar";
  /** The vocab pool the chips grade against (null for grammar). */
  pool: VocabPool | null;
  /** One-line instruction ("Auf Deutsch:" / the grammar prompt). */
  ask: string;
  /** Big display word/line the kid reacts to. */
  prompt: string;
  chips: string[]; // exactly 3, shuffled, contains the answer
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

/**
 * Build the quickfire for one enemy contact. Vocab rotates through the short
 * recall pools; grammar uses its authored distractors (multiple-choice /
 * context-picker only — the route's formatAllow guarantees that). Returns
 * null only when an item can't field 2 decoys (the scene then skips the
 * freeze — the enemy just pops; a dead-end quiz would stall the run).
 */
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
  // language-consistent decoys: same pool, sibling vocab items only
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

/** Score for a pop at a given streak (escalating, Keen-style point ladders). */
export function comboPoints(streak: number): number {
  return 100 * Math.min(Math.max(streak, 1), 8);
}

// ---------------------------------------------------------------------------
// The mock level — authored here (code-side content until the gate passes).
// A left-to-right run with verticality, one-way platforms, a secret alcove
// below the midway bridge, and an ink floor. 64×15.
// ---------------------------------------------------------------------------
export const TINTENLAUF_ROWS: string[] = [
  "................................................................",
  "................................................................",
  "................................................................",
  "................................................................",
  "........................L...........f...........................",
  ".......................====....................L.......L........",
  "..L...........................................======.....w...X..",
  ".===..L..............h..............L...............############",
  "..........w....##############....................h..############",
  "..S....######..................####...####......################",
  "#####..######..................####...####......################",
  "#####..######..................####...####..####################",
  "#####..######.....L.L..........####...####..####################",
  "#####^^######^^..............^^####.^^####^^####################",
  "################################################################",
];
