// THE PAINTED BOOK — the paintLevel@1 format: pure parse + THE LEVEL LAWS.
// The app-side zod loader (apps/web/lib/paint-content.ts) guarantees the JSON
// SHAPE; this module owns the SEMANTICS and throws loud on any violation
// (loud beats tolerant — the keen-content law). checkLevelLaws() is the
// machine gate every shipped level passes in CI: structure, exit chains, and
// an ability-parameterized reachability sweep (a cage or letter no child can
// reach is a defect, not a secret).

import { registerErrorsDe } from "@domigo/content-schema";
import { type Grid, glyphAt, isOneWay, isSlope, isSolid } from "./collide.ts";
import { PAINT, SUBS, TILE } from "./paint.ts";
import { platformPathAt } from "./entities.ts";

export const LEVEL_SCHEMA = "paintLevel@1";

// Geometry + marker glyphs (doc 31 §5). Anything with params is an ENTITY.
const LEGAL_GLYPHS = new Set([".", "#", "=", "/", "\\", "1", "2", "3", "4", "~", "^", "w", "V", "s", "U", "o", "*", "S", "C", "X", "B", "z"]);

export type EntityRole =
  | "chaser" | "gunner" | "flyer" | "bouncer" | "crusher" | "swarm"
  | "platform.move" | "platform.fall" | "platform.swing"
  | "cage" | "powerup" | "door.trigger" | "guardian"
  // PK-R6 · C1 (doc 44 §4 ch01): a DRAINED classroom object — one of the things
  // OSWIN rained the colour out of, standing grey where it fell. It has no
  // brain and no menace: it waits, wearing an ↑ cue, until the child steps up
  // and says what it is. The two-step `restore` card then gives it back its
  // name and its colour and the world keeps that colour. This is the ch01
  // rebuild's field identity — restoration spread across the whole level
  // instead of six anonymous cages in one room.
  | "drained"
  // PK-R6 · D (doc 44 §3.3): THE BEWITCHED CLASSMATE. The person inside the
  // chapter's one person-cage, standing in the world as a being of her own the
  // moment the cage opens. Opening the cage does not free her: she is ghost-pale
  // and acts out the unit's wrong classroom actions round by round, and the
  // child answers each with the command that stops or guides it (six rounds,
  // §3.3). She is the only role whose redemption is EARNED IN STAGES — every
  // other being is drained-or-restored, she is restored by degrees.
  | "classmate"
  // PK-R3b · R3-16 (doc 41 §5): the two static-state collectibles. `tip` is a
  // Regel-Seite — a rule page OSWIN tore out of the book, which shows its
  // Merksatz when picked up; `book` is a Bonus-Buch, the no-death adaptation of
  // an extra life, worth points and nothing else. Both are doc 40 §3
  // static-state: no rig, no orbit, no brain — they sit and wait.
  | "tip" | "book";

/** The pickups that are simply TAKEN on contact (no card, no fight). */
export const PICKUP_ROLES = new Set<EntityRole>(["tip", "book"]);

/**
 * Per-entity tuning. Open by design — every role brings its own knobs — but the
 * fields THE LAWS read are typed here, so a misspelt `pricee` is a compile error
 * instead of a level that ships with a door nobody can pay.
 */
export interface EntityParams {
  /** door.trigger: which door this is — "exit" | "bonus" | "seal". */
  kind?: string;
  /** door.trigger: what the door COSTS in letters. PB-R1 · R3-2 — Klecks' price
   *  was hardcoded at 10 in three places while p2 carries 8 reachable letters,
   *  so the door could be read and never paid. The `door-price` law now proves
   *  every price against the letters the child can actually hold on arrival. */
  price?: number;
  /** powerup: the ability this grant hands over. */
  grants?: string;
  /** powerup: this grant is REQUIRED later in the chapter. PB-R1 · R3-3 — the
   *  phase exit LOCKS until it has been collected; there is no backtracking
   *  between phases, so a missed essential is a dead run. */
  essential?: boolean;
  /** cage: WHO is inside — the classmate's name. Its presence is what makes a
   *  cage the chapter's one person-cage (doc 44 §2.3's `captive:"classmate"` is
   *  this field; the shipped data has carried the name itself since ch01, and a
   *  name says strictly more than a type tag). Exactly one per chapter. */
  classmate?: string;
  /** classmate: WHICH cage this person was locked in (PK-R6 · D). The pointer
   *  runs from the person to the cage rather than the other way round because
   *  the sim asks it in that direction — a cage bursts and has to find who
   *  steps out of it — and because the `classmate-pair` law can then prove both
   *  ends from one field. */
  cage?: string;
  /** tip: which of the unit's grammar topics this Regel-Seite carries. Unique
   *  per chapter — two pages of the same rule are one page and a duplicate. */
  topicDe?: string;
  /** tip: the rule itself, kid-worded. Rendered verbatim on the pickup card, so
   *  it is authored content and passes the same register + length laws every
   *  other line a six-year-old reads does (the `tip-honesty` law). */
  merksatzDe?: string;
  /** spawned hidden, revealed by a link. */
  hidden?: boolean;
  [key: string]: unknown;
}

export interface EntitySpec {
  id: string;
  role: EntityRole;
  skin: string;
  c: number;
  r: number;
  tier: "E" | "M" | "S";
  params?: EntityParams;
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
  /** PK-R6 · C · THE OBJECTIVE SCREEN'S TITLE PLATE (doc 44 §2.6 / §3.4). The
   *  painted stem the goal card wears as its header — the chapter's own picture,
   *  with the chapter name set into the plate's lower band. DECLARED in the
   *  level rather than derived from the chapter id, because the plate is a
   *  commissioned piece with a name of its own; scripts/check-paint-art.mjs
   *  requires whatever is named here, so a level cannot promise a plate the
   *  disk does not hold. Optional: a chapter without one falls back to the
   *  plain painted page the goal card has always been. */
  goalPlate?: string;
  /** PK-R6 · H2: the score page's own painted plate (round-2 finding: score and
   *  door reused one staging). Declared only once the reviewed art is imported. */
  scorePlate?: string;
  /** …and the door-out ceremony's own plate — the chapter's biggest payoff
   *  gets the biggest picture (batch-ap `ceremony_plates`). */
  doorPlate?: string;
  /** PK-R3b · R3-16 (doc 41 §5): how many Regel-Seiten this chapter hides — one
   *  per grammar topic of its unit. DECLARED here and PLACED in the phases, and
   *  the `tip-honesty` law proves the two agree; the HUD and the score page then
   *  read this one number, so „y von N" can never promise a page the world does
   *  not contain (the letter-honesty pattern, doc 41 §7). */
  tipsTotal?: number;
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

// ── REACHABILITY v2 (PB-T2: the honest UNDER-approximation of the physics) ──
// A node (c,r) = feet standing ON TOP of row r+1 at column c. Edges follow the
// real movement envelope: walk ±1 (with 1-tile step-up), jump ≤4 rows up and
// ≤3 columns across, hover stretches crossings to ≤7 columns, falls drift
// PROPORTIONALLY to depth (≈0.6 cols/row — v1's "any depth, 4 across" was the
// exact overshoot that green-lit the unreachable p3 exit), vines climb their
// column, rings bridge ≤8 columns, springs add ≤2 rows, and MOVING PLATFORMS
// are visible: their swept top cells (via entities.platformPathAt — the same
// formula the runtime rides) are boardable nodes with disembark envelopes.
//
// THE ENVELOPE LAW: every constant here must be ≤ what the real engine can do
// (level.test.ts derives the physics from stepPlayer and asserts the direction)
// — the BFS may miss a truly-reachable spot (author friction, safe) but must
// never bless an unreachable one. The PROOF of true reachability is the tape
// (proof-tapes.test.ts), never this model.

export const REACH_ENVELOPE = {
  JUMP_UP: 4,
  JUMP_DX: 3,
  HOVER_DX: 7,
  FALL_DRIFT_PER_ROW: 0.5, // cols of air-steer per row fallen (cap below; floor'd)
  FALL_DX_CAP: 4,
  RING_DX: 8,
} as const;

const { JUMP_UP, JUMP_DX, HOVER_DX, RING_DX } = REACH_ENVELOPE;
const fallDx = (depth: number, hover: boolean): number =>
  hover ? HOVER_DX : Math.min(REACH_ENVELOPE.FALL_DX_CAP, 1 + Math.floor(depth * REACH_ENVELOPE.FALL_DRIFT_PER_ROW));

const supportAt = (grid: Grid, c: number, r: number): boolean => {
  const below = glyphAt(grid, c, r + 1);
  return isSolid(below) || isOneWay(below) || isSlope(below) || isSlope(glyphAt(grid, c, r));
};

const headroom = (grid: Grid, c: number, r: number): boolean =>
  !isSolid(glyphAt(grid, c, r)) && !isSolid(glyphAt(grid, c, r - 1));

export const standable = (grid: Grid, c: number, r: number): boolean =>
  supportAt(grid, c, r) && headroom(grid, c, r);

export const reachableCells = (
  rows: readonly string[],
  abilities: readonly Ability[],
  entities: readonly EntitySpec[] = [],
): Set<string> => {
  const start = findGlyph(rows, "S");
  if (!start) return new Set();
  return reachFrom(rows, abilities, start, entities);
};

/** The swept top cells of a kinematic platform over one full period, sampled
 *  through the SAME path formula the runtime rides (platformPathAt). */
const platformSweepCells = (spec: EntitySpec): Array<{ c: number; r: number }> => {
  const homeX = (spec.c * TILE + TILE / 2) * SUBS;
  const homeY = (spec.r + 1) * TILE * SUBS;
  const params = spec.params ?? {};
  const cells = new Set<string>();
  const period = Number(params.periodTicks ?? (spec.role === "platform.move" ? 240 : 180));
  for (let t = 0; t < period; t += 4) {
    const p = platformPathAt(spec.role as "platform.move" | "platform.swing", homeX, homeY, params, t);
    const cc = Math.floor(p.x / SUBS / TILE);
    const rr = Math.floor((p.y / SUBS - 1) / TILE);
    for (let dc = -1; dc <= 1; dc++) cells.add(`${cc + dc},${rr}`); // the 40px top spans ~3 cells
  }
  return [...cells].map((k) => {
    const [c, r] = k.split(",").map(Number) as [number, number];
    return { c, r };
  });
};

/** Reachability from an arbitrary cell (settled onto its supporting node). */
export const reachFrom = (
  rows: readonly string[],
  abilities: readonly Ability[],
  from: { c: number; r: number },
  entities: readonly EntitySpec[] = [],
): Set<string> => {
  const grid = rows;
  const h = rows.length;
  const w = rows[0]?.length ?? 0;
  const hover = abilities.includes("hover");
  const crossDx = hover ? HOVER_DX : JUMP_DX;
  const key = (c: number, r: number): string => `${c},${r}`;
  const platforms = entities
    .filter((e) => e.role === "platform.move" || e.role === "platform.swing")
    .map((e) => ({ id: e.id, sweep: platformSweepCells(e), boarded: false }));

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

  // R5-A7 · THE SCREEN BOX IS PHYSICS (sim.ts W0-F7). With the camera at the
  // world's edges the centre can never enter column 0 (camX ≥ 0 ⇒ min centre
  // = screenBoxLeftPx) nor the last two columns (max centre = worldW −
  // screenBoxRightPx); mid-world the box travels with the camera and only
  // adds friction. Excluding the edge columns is the exact always-true subset.
  const minCol = Math.floor(PAINT.screenBoxLeftPx / TILE);
  const maxCol = Math.floor((w * TILE - PAINT.screenBoxRightPx) / TILE);

  const queue: Array<{ c: number; r: number }> = [{ c: start.c, r: sr }];
  const seen = new Set<string>([key(start.c, sr)]);
  const push = (c: number, r: number): void => {
    if (c < minCol || c > maxCol || r < 0 || r >= h) return;
    if (!standable(grid, c, r)) return;
    const k = key(c, r);
    if (seen.has(k)) return;
    seen.add(k);
    queue.push({ c, r });
  };

  // R5-A7 · PATH-HONEST EDGES. An edge exists only if a tile-level corridor
  // for it exists — the old edges tunnelled through backed slides, walls,
  // even the floor underfoot (that one blessed p3's sealed G). Conservative
  // by the envelope law: removing edges is the safe direction.
  const colClear = (c: number, rA: number, rB: number): boolean => {
    for (let r = Math.min(rA, rB); r <= Math.max(rA, rB); r++) if (isSolid(glyphAt(grid, c, r))) return false;
    return true;
  };
  /** colClear for a DIRECTED range — an empty range (from > to) is clear,
   *  never silently re-ordered into checking rows it was not asked about. */
  const colClearDown = (c: number, from: number, to: number): boolean => (from > to ? true : colClear(c, from, to));
  /** the body is two tiles tall — a horizontal move needs the FOOT row and
   *  the HEAD row clear (R5 verify wave: a 16px slot let the model tunnel). */
  const rowClear = (r: number, cA: number, cB: number): boolean => {
    for (let c = Math.min(cA, cB); c <= Math.max(cA, cB); c++) {
      if (isSolid(glyphAt(grid, c, r)) || isSolid(glyphAt(grid, c, r - 1))) return false;
    }
    return true;
  };
  const jumpPathClear = (c1: number, r1: number, c2: number, r2: number): boolean =>
    (colClear(c1, r2, r1) && rowClear(r2, c1, c2)) || (rowClear(r1, c1, c2) && colClear(c2, r2, r1));
  /** depth at which the drift can FIRST reach a column k away (the inverse of
   *  fallDx) — the honest cone a falling body actually sweeps. */
  const minDepthForDx = (k: number): number => {
    if (k <= 0) return 1;
    for (let d = 1; d <= h; d++) if (fallDx(d, hover) >= k) return d;
    return h + 1;
  };

  const visit = (n: { c: number; r: number }): void => {
    // walk + step-up + step-down
    for (const dc of [-1, 1]) {
      push(n.c + dc, n.r);
      push(n.c + dc, n.r - 1);
      push(n.c + dc, n.r + 1);
    }
    // jump: up to JUMP_UP rows up, JUMP_DX across — along at least one honest
    // L-path (rise-then-cross or cross-then-rise)
    for (let dr = -JUMP_UP; dr <= 0; dr++) {
      for (let dc = -JUMP_DX; dc <= JUMP_DX; dc++) {
        if (jumpPathClear(n.c, n.r, n.c + dc, n.r + dr)) push(n.c + dc, n.r + dr);
      }
    }
    // fall: drift grows with depth (never v1's flat "4 across at any depth") —
    // and the descent sweeps an honest CONE: every transit column must be
    // solid-free from the depth the drift can first enter it down to the
    // landing (R5 verify wave: checking only the landing column let the model
    // tunnel HORIZONTALLY through full walls)
    for (let dr = 1; dr <= h; dr++) {
      const dx = fallDx(dr, hover);
      for (let dc = -dx; dc <= dx; dc++) {
        const c2 = n.c + dc;
        // a sideways fall LEAVES the source column horizontally (the walk-off)
        // — its own support row must not veto it; only a straight drop (dc=0)
        // has to clear its own column
        let clear = true;
        for (let k = dc === 0 ? 0 : 1; k <= Math.abs(dc) && clear; k++) {
          const cc = n.c + Math.sign(dc) * k;
          clear = colClearDown(cc, n.r + minDepthForDx(k), n.r + dr - 1);
        }
        if (clear) push(c2, n.r + dr);
      }
    }
    // hover crossing at level height — a wall (foot OR head row) ends it
    for (const dir of [-1, 1] as const) {
      for (let d = 1; d <= crossDx; d++) {
        const c2 = n.c + d * dir;
        if (isSolid(glyphAt(grid, c2, n.r)) || isSolid(glyphAt(grid, c2, n.r - 1))) break;
        push(c2, n.r);
      }
    }
    // vines: adjacency latches (within the real jump rise); the whole column
    // then connects up + off the top — each dismount along an honest L-path
    // from the vine cell (R5 verify wave: the old push tunnelled walls)
    for (const v of vines) {
      if (Math.abs(v.c - n.c) <= 2 && v.r >= n.r - JUMP_UP && v.r <= n.r + h) {
        for (const v2 of vines.filter((x) => x.c === v.c)) {
          for (let dc = -2; dc <= 2; dc++) {
            for (let dr = -5; dr <= 2; dr++) {
              if (jumpPathClear(v2.c, v2.r, v2.c + dc, v2.r + dr)) push(v2.c + dc, v2.r + dr);
            }
          }
        }
      }
    }
    // rings bridge wide gaps — but only for a child who HOLDS the swing verb
    // (sim.ts passes ringAt only with the ability; the model must match), and
    // every landing along an honest L-path from the ring
    if (abilities.includes("swing")) {
      for (const g of rings) {
        if (Math.abs(g.c - n.c) <= RING_DX && Math.abs(g.r - n.r) <= 4) {
          for (let dc = -RING_DX; dc <= RING_DX; dc++) {
            for (let dr = -2; dr <= 6; dr++) {
              if (jumpPathClear(g.c, g.r, g.c + dc, g.r + dr)) push(g.c + dc, g.r + dr);
            }
          }
        }
      }
    }
    // springs boost a couple of rows — landings along an honest L-path from
    // the cell ABOVE the spring (the spring glyph itself may be solid)
    for (const sp of springTops) {
      if (Math.abs(sp.c - n.c) <= 1 && Math.abs(sp.r - n.r) <= 1) {
        for (let dc = -2; dc <= 2; dc++) {
          for (let dr = -3; dr <= 0; dr++) {
            if (jumpPathClear(sp.c, sp.r - 1, sp.c + dc, sp.r + dr)) push(sp.c + dc, sp.r + dr);
          }
        }
      }
    }
  };

  // drain-and-board: BFS over static nodes, then unlock any kinematic platform
  // whose swept path is boardable from a seen node, disembarking the jump
  // envelope from EVERY swept cell; repeat until nothing new unlocks
  for (;;) {
    while (queue.length > 0) {
      const n = queue.shift();
      if (!n) break;
      visit(n);
    }
    let unlocked = false;
    for (const p of platforms) {
      if (p.boarded) continue;
      const boardable = p.sweep.some((s) => {
        for (const k of seen) {
          const [c, r] = k.split(",").map(Number) as [number, number];
          if (Math.abs(s.c - c) <= JUMP_DX && s.r - r >= -JUMP_UP && s.r - r <= 6) return true;
        }
        return false;
      });
      if (!boardable) continue;
      p.boarded = true;
      unlocked = true;
      for (const s of p.sweep) {
        // R5-P1 (deklarierte Dossier-Vorleistung): die Sweep-Zellen einer
        // geboardeten Plattform sind Orte, an denen das Kind SEIN kann — sie
        // gehören in `seen`, damit die Collectible-/Entity-Toleranzen auf der
        // Fahrt selbst ankern können (E/S/T über der Tinte; das Tape beweist
        // per Ausführung, D-6).
        seen.add(key(s.c, s.r));
        visit({ c: s.c, r: s.r }); // ride + disembark anywhere along the sweep
      }
    }
    if (!unlocked && queue.length === 0) break;
  }
  return seen;
};

export interface LawFailure {
  phase: string;
  law: string;
  detail: string;
}

/** How long a Regel-Seite's Merksatz may be. Longer than a card's 56-char line
 *  (MAX_LINE_DE) because a rule page is something a child STOPS at and reads,
 *  not a framing clause they skim on the way to the ask — but still one
 *  sentence, out loud, in one breath. */
export const MAX_MERKSATZ = 78;

/** "Close enough to a reachable node to count" — the same tolerance every
 *  reachability law uses, lifted out so the staged sweeps can share it. */
const nearIn = (set: ReadonlySet<string>, c: number, r: number, dc: number, drUp: number, drDown: number): boolean => {
  for (let dr = -drUp; dr <= drDown; dr++) {
    for (let d = -dc; d <= dc; d++) if (set.has(`${c + d},${r + dr}`)) return true;
  }
  return false;
};

/** Every `*` cell of a phase. */
const letterCellsOf = (rows: readonly string[]): Array<{ c: number; r: number }> => {
  const out: Array<{ c: number; r: number }> = [];
  for (const [r, row] of rows.entries()) {
    for (let c = 0; c < row.length; c++) if (row[c] === "*") out.push({ c, r });
  }
  return out;
};

/**
 * PB-R1 · R3-3 · THE ABILITY LADDER. What the child holds ENTERING each phase:
 * the chapter's abilities minus every grant still ahead of them. PaintGame does
 * the same subtraction at chapter mount (grantSet from `params.grants`) and then
 * accumulates grants as they are taken, so a grant from an earlier phase is
 * already in hand and a grant from THIS phase is not.
 */
const abilitiesEnteringPhase = (level: PaintLevel, phaseId: string): Ability[] => {
  const order = allPhases(level).map((p) => p.id);
  const from = order.indexOf(phaseId);
  const stillAhead = new Set(
    allPhases(level)
      .filter((_, i) => i >= from)
      .flatMap((p) => p.entities.filter((e) => e.role === "powerup").map((e) => String(e.params?.grants ?? ""))),
  );
  return level.abilities.filter((a) => !stillAhead.has(a));
};

/** The machine gate. Strict for real chapters; drafts skip the shape laws. */
export const checkLevelLaws = (level: PaintLevel): LawFailure[] => {
  const failures: LawFailure[] = [];
  const draft = level.draft === true;

  if (!draft) {
    if (level.phases.length !== 3) {
      failures.push({ phase: "*", law: "phase-count", detail: `chapters are 3 phases + arena (has ${level.phases.length})` });
    }
    // R4 · doc 44 §2.3 · THE CAGE LAW (replaces PB's „six-cages"). Cages are for
    // CLASSMATES: exactly ONE per chapter, and every child must meet it. The
    // unit's OTHER bewitched beings are freed in whatever form their fiction
    // asks — bound, drained, tangled, frozen — so a cage COUNT is not a law any
    // more; it was a number the design could only break by getting better, and
    // a law a good chapter fails is a broken law.
    //
    // What replaces the count is the letter-honesty shape (doc 41 §7): the WORLD
    // is the source of every number. Nothing here declares how many cages a
    // chapter has, and nothing downstream may either — the HUD's „Befreit y/N"
    // and the Bilanz both count N off the level itself (PaintGame's
    // chapterRoleCount), which is what closed the /6-vs-7 drift: the old law
    // counted the three field phases while the world also held the arena's cage,
    // so the HUD and the law disagreed about the same chapter by one.
    //
    // Counted over allPhases for that same reason — the arena and the
    // Kleckskammer are part of the world. A second classmate parked in either of
    // them was invisible to the old count, which looked at level.phases alone.
    const cages = allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "cage"));
    if (cages.length === 0) {
      failures.push({ phase: "*", law: "cage-law", detail: "a chapter frees at least one caged being (has none)" });
    }
    const classmates = cages.filter((e) => e.params?.classmate !== undefined);
    if (classmates.length !== 1) {
      const who = classmates.map((e) => e.id).join(", ");
      failures.push({
        phase: "*",
        law: "classmate-cage",
        detail: `exactly one cage holds a classmate (has ${classmates.length}${who === "" ? "" : `: ${who}`})`,
      });
    }
    // „on-path and findable by everyone" (§2.3) — the two ways a level can break
    // that promise which no reachability sweep would catch, because both leave
    // the cage perfectly reachable. Being reachable AT ALL is the
    // `entity-reachable` law's job further down, and it covers every cage.
    const bonusId = level.bonus?.id;
    for (const e of classmates) {
      if (e.params?.hidden === true) {
        failures.push({
          phase: "*",
          law: "classmate-cage",
          detail: `the classmate cage ${e.id} spawns hidden — the one cage every child must find may not wait behind a link`,
        });
      }
      const where = allPhases(level).find((p) => p.entities.includes(e));
      if (where !== undefined && bonusId !== undefined && where.id === bonusId) {
        failures.push({
          phase: where.id,
          law: "classmate-cage",
          detail: `the classmate cage ${e.id} sits in the bonus room — a door the child pays for is not „findable by everyone"`,
        });
      }
    }
    // ── PK-R6 · D · THE CLASSMATE PAIR (doc 44 §3.3) ───────────────────────
    // A person-cage and the person in it are ONE thing in two entities: the
    // cage the child opens, and the classmate who then stands there through
    // six rounds of reawakening. The sim reveals her by walking from the
    // burst cage to the `classmate` entity that points back at it — so a
    // cage with nobody pointing at it opens onto an empty spot and the
    // chapter's one rescue silently becomes a shrug. Proven from BOTH ends
    // (a cage needs its person, a person needs her cage, and they share a
    // phase), because either half alone is a level that loads and lies.
    const mates = allPhases(level).flatMap((p) => p.entities.filter((e) => e.role === "classmate").map((e) => ({ e, p })));
    for (const c of classmates) {
      const mine = mates.filter((m) => m.e.params?.cage === c.id);
      if (mine.length !== 1) {
        failures.push({
          phase: "*",
          law: "classmate-pair",
          detail: `the classmate cage ${c.id} needs exactly one \`classmate\` entity pointing at it (has ${mine.length}) — nobody would step out of it`,
        });
        continue;
      }
      const cagePhase = allPhases(level).find((p) => p.entities.includes(c));
      if (mine[0]!.p.id !== cagePhase?.id) {
        failures.push({
          phase: mine[0]!.p.id,
          law: "classmate-pair",
          detail: `${mine[0]!.e.id} stands in ${mine[0]!.p.id} but her cage ${c.id} is in ${cagePhase?.id ?? "?"} — she can never step out of it`,
        });
      }
    }
    for (const m of mates) {
      const cageId = m.e.params?.cage;
      if (cageId === undefined) {
        failures.push({ phase: m.p.id, law: "classmate-pair", detail: `classmate ${m.e.id} declares no cage — nothing can ever reveal her` });
      } else if (!cages.some((c) => c.id === cageId && c.params?.classmate !== undefined)) {
        failures.push({ phase: m.p.id, law: "classmate-pair", detail: `classmate ${m.e.id} points at "${cageId}", which is not a person-cage in this chapter` });
      }
    }
  }

  // PK-R3b · R3-16 · THE REGEL-SEITEN HONESTY LAW (doc 41 §5, §7). The same
  // shape as the letter-honesty law: DECLARED = PLACED = REACHABLE, plus the
  // copy laws, because a Regel-Seite is the one collectible whose payload a
  // child READS. A page that is promised and not placed, placed and not
  // reachable, or reachable and blank, is a broken promise in the HUD.
  if (level.tipsTotal !== undefined) {
    const tips = level.phases.flatMap((p) => p.entities.filter((e) => e.role === "tip"));
    if (tips.length !== level.tipsTotal) {
      failures.push({ phase: "*", law: "tip-honesty", detail: `the chapter declares ${level.tipsTotal} Regel-Seiten but places ${tips.length} — the HUD would count to a page nobody can find` });
    }
    const topics = new Set<string>();
    for (const t of tips) {
      const topic = t.params?.topicDe;
      const satz = t.params?.merksatzDe;
      if (topic === undefined || topic.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} names no grammar topic` });
      } else if (topics.has(topic)) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `two Regel-Seiten carry the topic „${topic}" — one rule, one page` });
      } else topics.add(topic);
      if (satz === undefined || satz.trim() === "") {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id} has no Merksatz — the pickup would show an empty page` });
        continue;
      }
      // A Merksatz is READ, not skimmed past like a card's framing line, so it
      // gets its own (roomier) cap rather than the card lines' 56.
      if (satz.length > MAX_MERKSATZ) {
        failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: Merksatz is ${satz.length} chars (max ${MAX_MERKSATZ}) — „${satz}"` });
      }
      for (const err of registerErrorsDe(satz)) failures.push({ phase: "*", law: "tip-honesty", detail: `Regel-Seite ${t.id}: ${err}` });
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
        // PB-F2 · THE PURPOSE LAW FOR RAMPS (from Koki's F2-4 "small-ledge
        // glitch"): a 45° ramp exists to JOIN TWO WALK HEIGHTS. p1 carried a
        // single '/' between two stretches of floor at the same height — an
        // 8-px bump that led nowhere, put the hero's feet on a diagonal and
        // read on film as a glitched ledge. Scoped to the FULL ramps '/' and
        // '\': the 30° halves have their own pairing law above, and 'z' is the
        // slide — a long chute whose whole body is diagonal by design.
        if (g === "/" || g === "\\") {
          const walkTop = (col: number): number => {
            for (let rr = 0; rr < ph.rows.length; rr++) if (isSolid(glyphAt(ph.rows, col, rr)) || isSlope(glyphAt(ph.rows, col, rr))) return rr;
            return ph.rows.length;
          };
          if (walkTop(c - 1) === walkTop(c + 1)) {
            failures.push({ phase: ph.id, law: "slope-purpose", detail: `ramp '${g}' at (${c},${r}) joins two floors of the SAME height — a ramp must change the walk height` });
          }
        }
      }
    }
    // PB-T1 · walkers spawn standing on solid (the entity ground contract's
    // authoring side — a mid-air or slope spawn is a placement defect)
    for (const e of ph.entities) {
      // PK-R6 · C1: `drained` joins this law — a desk hovering an inch off the
      // floor is the same authoring defect as a mid-air chaser, and it is the
      // one the eye catches first because furniture is EXPECTED to rest.
      // PK-R6 · D: and `classmate` — she stands where she stepped out of her
      // cage and stays there for the rest of the chapter (doc 44 §1: freeing
      // changes state, never presence), so a floating spawn is a friend
      // hovering over the classroom floor for twenty minutes.
      if ((e.role === "chaser" || e.role === "bouncer" || e.role === "drained" || e.role === "classmate") && !isSolid(glyphAt(ph.rows, e.c, e.r + 1))) {
        failures.push({ phase: ph.id, law: "spawn-standable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) must stand on solid ground` });
      }
    }

    const reach = reachableCells(ph.rows, level.abilities, ph.entities);
    const has = (c: number, r: number): boolean => reach.has(`${c},${r}`);
    const nearReachable = (c: number, r: number, dc: number, drUp: number, drDown: number): boolean =>
      nearIn(reach, c, r, dc, drUp, drDown);
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
      // PK-R3b: the two new pickups join this law rather than getting one of
      // their own — a Regel-Seite or a Bonus-Buch nobody can reach is exactly
      // the same defect as an unreachable cage, and „hidden" never means
      // „impossible" (doc 31's law: a collectible no child can reach is a
      // defect, not a secret).
      // PK-R6 · C1: a drained object joins this law for the same reason a cage
      // does — it is a being the chapter PROMISES the child can free, and the
      // HUD counts it. One standing on a ledge nobody can climb is a broken
      // promise, not a secret.
      if ((e.role === "cage" || e.role === "powerup" || e.role === "drained" || PICKUP_ROLES.has(e.role)) && !nearReachable(e.c, e.r, 2, 2, 4)) {
        failures.push({ phase: ph.id, law: "entity-reachable", detail: `${e.role} ${e.id} at (${e.c},${e.r}) unreachable` });
      }
    }

    const startCell = findGlyph(ph.rows, "S");
    const letters = letterCellsOf(ph.rows);

    // PB-R1 · R3-2 · THE LETTER ECONOMY LAW. A priced door may never ask for
    // more letters than the child can be holding when they meet it. Klecks'
    // door asked for 10 in a phase carrying 8 — readable, unpayable, and no
    // backtracking to fetch the rest. Letters are counted PER PHASE because the
    // sim counts them per phase: every phase mount builds a new Sim starting at
    // zero, so p1's letters buy nothing in p2.
    //
    // "Before the door" = reachable without ever standing on the door's cell.
    // For a door on open floor that cut removes almost nothing (the child can
    // hop over one cell), and the law then reduces to „price ≤ the letters this
    // phase actually offers" — which is the defect class Koki hit. Where a door
    // genuinely gates a corridor, the cut bites harder. It can only ever make
    // the law stricter, never more permissive.
    for (const e of ph.entities) {
      if (e.role !== "door.trigger") continue;
      const price = e.params?.price;
      if (e.params?.kind === "bonus" && price === undefined) {
        failures.push({ phase: ph.id, law: "door-price", detail: `bonus door ${e.id} must declare a price (the card renders it — copy may never state a number the data does not)` });
        continue;
      }
      if (price === undefined) continue;
      if (typeof price !== "number" || !Number.isInteger(price) || price <= 0) {
        failures.push({ phase: ph.id, law: "door-price", detail: `door ${e.id}: price must be a whole number ≥ 1 (is ${JSON.stringify(price)})` });
        continue;
      }
      if (!startCell) continue; // parse already failed on a phase without S
      const sealed = ph.rows.map((row, r) => (r === e.r ? row.slice(0, e.c) + "#" + row.slice(e.c + 1) : row));
      const before = reachFrom(sealed, level.abilities, startCell, ph.entities);
      const affordable = letters.filter((l) => nearIn(before, l.c, l.r, 1, 1, 3)).length;
      if (price > affordable) {
        failures.push({
          phase: ph.id,
          law: "door-price",
          detail: `door ${e.id} at (${e.c},${e.r}) costs ${price} but only ${affordable} ${level.collectNounDe} can be collected before it — the price is unpayable`,
        });
      }
    }

    // PB-R1 · R3-3 · THE ESSENTIAL-GRANT LAW (the authoring half; the runtime
    // half locks the exit in Sim.checkExit). A grant the chapter later REQUIRES
    // must be collectable before this phase's exit, under the abilities the
    // child can actually hold at that point — the staged double sweep: reach the
    // grant WITHOUT it, then reach the exit WITH it. Fibel's fist is the case:
    // the arena guardian can only be staggered by a deflected chalk piece, and
    // deflecting needs the fist, so leaving p2 fistless was a dead run.
    const essentials = ph.entities.filter((e) => e.role === "powerup" && e.params?.essential === true);
    if (essentials.length > 0 && startCell) {
      const entryAbilities = abilitiesEnteringPhase(level, ph.id);
      const preGrant = reachFrom(ph.rows, entryAbilities, startCell, ph.entities);
      for (const e of essentials) {
        if (!nearIn(preGrant, e.c, e.r, 2, 2, 4)) {
          failures.push({
            phase: ph.id,
            law: "essential-reachable",
            detail: `essential grant ${e.id} at (${e.c},${e.r}) cannot be reached with the abilities the child holds entering ${ph.id} (${entryAbilities.join("+") || "none"})`,
          });
          continue;
        }
        if (!exitCell) continue;
        const withGrant = [...new Set([...entryAbilities, String(e.params?.grants ?? "")])].filter((a): a is Ability =>
          (["jump", "punch", "hang", "swing", "hover", "run"] as string[]).includes(a),
        );
        const afterGrant = reachFrom(ph.rows, withGrant, { c: e.c, r: e.r }, ph.entities);
        if (!nearIn(afterGrant, exitCell.c, exitCell.r, 1, 1, 3)) {
          failures.push({
            phase: ph.id,
            law: "essential-reachable",
            detail: `from essential grant ${e.id} at (${e.c},${e.r}) the exit at (${exitCell.c},${exitCell.r}) is no longer reachable — collecting it must not strand the child`,
          });
        }
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
        const sub = reachFrom(ph.rows, level.abilities, { c, r }, ph.entities);
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
