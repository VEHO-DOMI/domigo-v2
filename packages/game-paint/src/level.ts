// THE PAINTED BOOK — the paintLevel@1 format: pure parse + THE LEVEL LAWS.
// The app-side zod loader (apps/web/lib/paint-content.ts) guarantees the JSON
// SHAPE; this module owns the SEMANTICS and throws loud on any violation
// (loud beats tolerant — the keen-content law). checkLevelLaws() is the
// machine gate every shipped level passes in CI: structure, exit chains, and
// an ability-parameterized reachability sweep (a cage or letter no child can
// reach is a defect, not a secret).

import { type Grid, glyphAt, isOneWay, isSlope, isSolid } from "./collide.ts";

export const LEVEL_SCHEMA = "paintLevel@1";

// Geometry + marker glyphs (doc 31 §5). Anything with params is an ENTITY.
const LEGAL_GLYPHS = new Set([".", "#", "=", "/", "\\", "1", "2", "3", "4", "~", "^", "w", "V", "s", "U", "o", "*", "S", "C", "X", "B"]);

export type EntityRole =
  | "chaser" | "gunner" | "flyer" | "bouncer" | "crusher" | "swarm"
  | "platform.move" | "platform.fall" | "platform.swing"
  | "cage" | "powerup" | "door.trigger" | "guardian";

export interface EntitySpec {
  id: string;
  role: EntityRole;
  skin: string;
  c: number;
  r: number;
  tier: "E" | "M" | "S";
  params?: Record<string, unknown>;
}

export interface LinkSpec {
  trigger: string; // entity id
  on: "redeemed" | "opened" | "collected" | "pressed";
  action: "spawn" | "open" | "reveal";
  targets: string[];
}

export type Ability = "jump" | "punch" | "hang" | "swing" | "hover" | "run";

export interface PhaseSpec {
  id: string;
  nameDe: string;
  surface: "normal" | "slippery";
  plates: Partial<Record<"sky" | "far" | "mid" | "near" | "fg", string>>;
  rows: string[];
  entities: EntitySpec[];
  links: LinkSpec[];
  exit: { to: string }; // a phase id, "boss", or "done"
}

export interface PaintLevel {
  schema: typeof LEVEL_SCHEMA;
  id: string;
  chapter: string;
  draft?: boolean; // drafts skip the chapter-shape laws (phase/cage counts)
  /** The one-screen guardian arena (sheet law: 3 phases + arena — the arena is
   *  NOT one of the 3; it rides beside them). Same shape as a phase. */
  arena?: PhaseSpec;
  /** Klecks' bonus room (one per chapter): entered via a door.trigger, timed
   *  scene-side, exits back to its source phase. */
  bonus?: PhaseSpec;
  name: string;
  goalDe: string;
  whyDe: string;
  hintsDe: string[];
  collectNounDe: string;
  abilities: Ability[];
  phases: PhaseSpec[];
}

const fail = (msg: string): never => {
  throw new Error(`paintLevel: ${msg}`);
};

/** Semantic validation — the shape is already zod-checked app-side. */
/** phases + arena + bonus, flattened for validation and law passes. */
export const allPhases = (level: PaintLevel): PhaseSpec[] => [
  ...level.phases,
  ...(level.arena ? [level.arena] : []),
  ...(level.bonus ? [level.bonus] : []),
];

export const parsePaintLevel = (level: PaintLevel): PaintLevel => {
  if (level.schema !== LEVEL_SCHEMA) fail(`schema must be ${LEVEL_SCHEMA}`);
  if (level.phases.length === 0) fail("no phases");
  const ids = new Set<string>();
  for (const ph of allPhases(level)) {
    if (ids.has(ph.id)) fail(`duplicate phase id ${ph.id}`);
    ids.add(ph.id);
    const w = ph.rows[0]?.length ?? 0;
    if (w === 0 || ph.rows.length < 8) fail(`${ph.id}: grid too small`);
    for (const [ri, row] of ph.rows.entries()) {
      if (row.length !== w) fail(`${ph.id}: row ${ri} is ragged (${row.length} ≠ ${w})`);
      for (const g of row) if (!LEGAL_GLYPHS.has(g)) fail(`${ph.id}: illegal glyph "${g}" in row ${ri}`);
    }
    const count = (g: string): number => ph.rows.join("").split(g).length - 1;
    if (count("S") !== 1) fail(`${ph.id}: needs exactly one start S (has ${count("S")})`);
    if (count("X") + count("B") !== 1) fail(`${ph.id}: needs exactly one exit (X or B)`);
    for (const e of ph.entities) {
      if (e.r < 0 || e.r >= ph.rows.length || e.c < 0 || e.c >= w) fail(`${ph.id}: entity ${e.id} off-grid`);
    }
    const entityIds = new Set(ph.entities.map((e) => e.id));
    if (entityIds.size !== ph.entities.length) fail(`${ph.id}: duplicate entity ids`);
    for (const l of ph.links) {
      if (!entityIds.has(l.trigger)) fail(`${ph.id}: link trigger ${l.trigger} unknown`);
      for (const t of l.targets) if (!entityIds.has(t)) fail(`${ph.id}: link target ${t} unknown`);
    }
  }
  // the exit chain: every exit resolves; the chain from phase 1 terminates
  let cursor: string | undefined = level.phases[0]?.id; // non-empty is checked above
  const seen = new Set<string>();
  while (cursor !== undefined && cursor !== "done" && cursor !== "boss") {
    if (seen.has(cursor)) fail(`exit chain loops at ${cursor}`);
    seen.add(cursor);
    const ph = level.phases.find((p) => p.id === cursor);
    if (!ph) fail(`exit chain names unknown phase ${cursor}`);
    cursor = ph?.exit.to;
  }
  if (seen.size !== level.phases.length) fail("some phases are unreachable from the first");
  return level;
};

/** Find the marker cell of a glyph in a phase. */
export const findGlyph = (rows: readonly string[], glyph: string): { c: number; r: number } | null => {
  for (const [r, row] of rows.entries()) {
    const c = row.indexOf(glyph);
    if (c >= 0) return { c, r };
  }
  return null;
};

// ── REACHABILITY (the honest, coarse model of the PR-② physics) ─────────────
// A node (c,r) = feet standing ON TOP of row r+1 at column c. Edges follow the
// real movement envelope: walk ±1 (with 1-tile step-up), jump ≤4 rows up and
// ≤3 columns across (the 70px hold-jump), hover stretches crossings to ≤7
// columns, falls go any depth ≤4 columns across, vines climb their column,
// rings bridge ≤8 columns, springs add ≤2 rows.

const JUMP_UP = 4;
const JUMP_DX = 3;
const HOVER_DX = 7;
const FALL_DX = 4;
const RING_DX = 8;

const supportAt = (grid: Grid, c: number, r: number): boolean => {
  const below = glyphAt(grid, c, r + 1);
  return isSolid(below) || isOneWay(below) || isSlope(below) || isSlope(glyphAt(grid, c, r));
};

const headroom = (grid: Grid, c: number, r: number): boolean =>
  !isSolid(glyphAt(grid, c, r)) && !isSolid(glyphAt(grid, c, r - 1));

export const standable = (grid: Grid, c: number, r: number): boolean =>
  supportAt(grid, c, r) && headroom(grid, c, r);

export const reachableCells = (rows: readonly string[], abilities: readonly Ability[]): Set<string> => {
  const start = findGlyph(rows, "S");
  if (!start) return new Set();
  return reachFrom(rows, abilities, start);
};

/** Reachability from an arbitrary cell (settled onto its supporting node). */
export const reachFrom = (
  rows: readonly string[],
  abilities: readonly Ability[],
  from: { c: number; r: number },
): Set<string> => {
  const grid = rows;
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const hover = abilities.includes("hover");
  const crossDx = hover ? HOVER_DX : JUMP_DX;
  const key = (c: number, r: number): string => `${c},${r}`;

  const start = from;
  // settle to the supporting node under the cell
  let sr = start.r;
  while (sr < h - 1 && !supportAt(grid, start.c, sr)) sr++;

  const springTops: Array<{ c: number; r: number }> = [];
  const vines: Array<{ c: number; r: number }> = [];
  const rings: Array<{ c: number; r: number }> = [];
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const g = glyphAt(grid, c, r);
      if (g === "s") springTops.push({ c, r });
      if (g === "V") vines.push({ c, r });
      if (g === "o") rings.push({ c, r });
    }
  }

  const queue: Array<{ c: number; r: number }> = [{ c: start.c, r: sr }];
  const seen = new Set<string>([key(start.c, sr)]);
  const push = (c: number, r: number): void => {
    if (c < 0 || c >= w || r < 0 || r >= h) return;
    if (!standable(grid, c, r)) return;
    const k = key(c, r);
    if (seen.has(k)) return;
    seen.add(k);
    queue.push({ c, r });
  };

  while (queue.length > 0) {
    const n = queue.shift();
    if (!n) break;
    // walk + step-up + step-down
    for (const dc of [-1, 1]) {
      push(n.c + dc, n.r);
      push(n.c + dc, n.r - 1);
      push(n.c + dc, n.r + 1);
    }
    // jump: up to JUMP_UP rows up, JUMP_DX across
    for (let dr = -JUMP_UP; dr <= 0; dr++) {
      for (let dc = -JUMP_DX; dc <= JUMP_DX; dc++) push(n.c + dc, n.r + dr);
    }
    // cross/fall: any depth below within the crossing envelope
    for (let dr = 1; dr <= h; dr++) {
      for (let dc = -Math.max(crossDx, FALL_DX); dc <= Math.max(crossDx, FALL_DX); dc++) push(n.c + dc, n.r + dr);
    }
    // hover crossing at level height
    for (let dc = -crossDx; dc <= crossDx; dc++) push(n.c + dc, n.r);
    // vines: adjacency latches; the whole column then connects up + off the top
    for (const v of vines) {
      if (Math.abs(v.c - n.c) <= 2 && v.r >= n.r - 5 && v.r <= n.r + h) {
        for (const v2 of vines.filter((x) => x.c === v.c)) {
          for (let dc = -2; dc <= 2; dc++) for (let dr = -5; dr <= 2; dr++) push(v2.c + dc, v2.r + dr);
        }
      }
    }
    // rings bridge wide gaps
    for (const g of rings) {
      if (Math.abs(g.c - n.c) <= RING_DX && Math.abs(g.r - n.r) <= 4) {
        for (let dc = -RING_DX; dc <= RING_DX; dc++) for (let dr = -2; dr <= 6; dr++) push(g.c + dc, g.r + dr);
      }
    }
    // springs boost a couple of rows
    for (const sp of springTops) {
      if (Math.abs(sp.c - n.c) <= 1 && Math.abs(sp.r - n.r) <= 1) {
        for (let dc = -2; dc <= 2; dc++) for (let dr = -3; dr <= 0; dr++) push(sp.c + dc, sp.r + dr);
      }
    }
  }
  return seen;
};

export interface LawFailure {
  phase: string;
  law: string;
  detail: string;
}

/** The machine gate. Strict for real chapters; drafts skip the shape laws. */
export const checkLevelLaws = (level: PaintLevel): LawFailure[] => {
  const failures: LawFailure[] = [];
  const draft = level.draft === true;

  if (!draft) {
    if (level.phases.length !== 3) {
      failures.push({ phase: "*", law: "phase-count", detail: `chapters are 3 phases + arena (has ${level.phases.length})` });
    }
    const cages = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "cage"));
    if (cages.length !== 6) {
      failures.push({ phase: "*", law: "six-cages", detail: `chapters hide exactly 6 cages (has ${cages.length})` });
    }
    const person = cages.filter((e) => e.params?.classmate !== undefined);
    if (person.length !== 1) {
      failures.push({ phase: "*", law: "person-cage", detail: `exactly one cage holds a person (has ${person.length})` });
    }
  }

  for (const ph of allPhases(level)) {
    // W0-F8: worlds must be tall enough for the camera to breathe, and
    // W0-F7: the top row is authored solid — the world is CLOSED (no
    // reachable-looking painted "outside" above the playfield).
    if (ph.rows.length < 20) {
      failures.push({ phase: ph.id, law: "min-height", detail: `worlds are ≥20 rows (has ${ph.rows.length})` });
    }
    if (!(ph.rows[0] ?? "").split("").every((g) => g === "#")) {
      failures.push({ phase: ph.id, law: "closed-top", detail: "row 0 must be fully solid (the canopy)" });
    }

    // PB-T1 · THE SLOPE LAWS: ramps are carved INTO mass, never free-standing
    // wedges — the "looks standable, isn't solid" playtest class. Every slope
    // cell is backed by solid directly below; 30° halves come as adjacent
    // pairs (a lone half-ramp is meaningless geometry).
    for (const [r, row] of ph.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        const g = row[c] ?? ".";
        if (!isSlope(g)) continue;
        if (!isSolid(glyphAt(ph.rows, c, r + 1))) {
          failures.push({ phase: ph.id, law: "slope-backing", detail: `slope '${g}' at (${c},${r}) has no solid below — free wedges are banned` });
        }
        if (g === "1" && glyphAt(ph.rows, c + 1, r) !== "2") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'1' at (${c},${r}) is missing its '2' to the right` });
        }
        if (g === "2" && glyphAt(ph.rows, c - 1, r) !== "1") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'2' at (${c},${r}) is missing its '1' to the left` });
        }
        if (g === "3" && glyphAt(ph.rows, c + 1, r) !== "4") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'3' at (${c},${r}) is missing its '4' to the right` });
        }
        if (g === "4" && glyphAt(ph.rows, c - 1, r) !== "3") {
          failures.push({ phase: ph.id, law: "slope-pairing", detail: `'4' at (${c},${r}) is missing its '3' to the left` });
        }
      }
    }
    // PB-T1 · walkers spawn standing on solid (the entity ground contract's
    // authoring side — a mid-air or slope spawn is a placement defect)
    for (const e of ph.entities) {
      if ((e.role === "chaser" || e.role === "bouncer") && !isSolid(glyphAt(ph.rows, e.c, e.r + 1))) {
        failures.push({ phase: ph.id, law: "spawn-standable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) must stand on solid ground` });
      }
    }

    const reach = reachableCells(ph.rows, level.abilities);
    const has = (c: number, r: number): boolean => reach.has(`${c},${r}`);
    const nearReachable = (c: number, r: number, dc: number, drUp: number, drDown: number): boolean => {
      for (let dr = -drUp; dr <= drDown; dr++) {
        for (let d = -dc; d <= dc; d++) if (has(c + d, r + dr)) return true;
      }
      return false;
    };
    const exitCell = findGlyph(ph.rows, "X") ?? findGlyph(ph.rows, "B");
    if (exitCell && !nearReachable(exitCell.c, exitCell.r, 1, 1, 3)) {
      failures.push({ phase: ph.id, law: "exit-reachable", detail: `the exit at (${exitCell.c},${exitCell.r}) cannot be reached` });
    }
    for (const [r, row] of ph.rows.entries()) {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === "*" && !nearReachable(c, r, 1, 1, 3)) {
          failures.push({ phase: ph.id, law: "collectible-reachable", detail: `letter at (${c},${r}) unreachable` });
        }
      }
    }
    for (const e of ph.entities) {
      if ((e.role === "cage" || e.role === "powerup") && !nearReachable(e.c, e.r, 2, 2, 4)) {
        failures.push({ phase: ph.id, law: "entity-reachable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) unreachable` });
      }
    }

    // W0-F3 · THE TRAP-POCKET LAW: from every node the player can reach, the
    // exit must REMAIN reachable — no enterable pocket without an exit path.
    if (exitCell) {
      // Deliberately un-memoized: "reachable FROM a good node" does not imply
      // "can reach the exit" (falling into a pit is one-way). Worlds are small;
      // honesty beats cleverness here.
      for (const k of reach) {
        const parts = k.split(",").map(Number);
        const c = parts[0] ?? 0;
        const r = parts[1] ?? 0;
        if (!standable(ph.rows, c, r)) continue;
        const sub = reachFrom(ph.rows, level.abilities, { c, r });
        let exitOk = false;
        for (let dr = -1; dr <= 3 && !exitOk; dr++) {
          for (let d = -1; d <= 1 && !exitOk; d++) {
            if (sub.has(`${exitCell.c + d},${exitCell.r + dr}`)) exitOk = true;
          }
        }
        if (!exitOk) {
          failures.push({ phase: ph.id, law: "trap-pocket", detail: `standing at (${c},${r}) the exit is no longer reachable (softlock)` });
          break; // one report per phase is enough to fail the gate
        }
      }
    }
  }
  return failures;
};
