// PK-R6 · E · THE FLYING TAFEL — the laws of the boss fight, as machine checks.
//
// Two of these are the packet's named guardrails and BOTH are tamper-proven:
//   · the fairness law — no tell shorter than 500 ms, on any tier, at any knot;
//   · the identity law — no state she can be in mid-flight may resolve to the
//     retired grounded easel (`tafel_sad`/`_dazed`/`_stagger`/`_telegraph`).
//
// The identity check does not carry a hand-written list of states: it DRIVES the
// real machine across every tier and every knot and asserts against whatever
// states that machine actually produces. A state added later is covered the day
// it is added, which is the difference between a guard and a comment.

import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import {
  CHALK_ARM_TICKS,
  CHALK_COLOURS,
  CHALK_FLIGHT_TICKS,
  DODGES_PER_WINDOW,
  FLIGHT_BAND_PX,
  GUARDIAN_SCRIPT,
  KNOT_PERIOD_TICKS,
  SHARD_TICKS,
  TELEGRAPH_FLOOR_TICKS,
  flightPointAt,
  guardianKnotSolved,
  spawnEntities,
  stepEntities,
  telegraphTicksFor,
  throwEveryFor,
  type EntityWorld,
  type WorldInput,
} from "./entities.ts";
import { GUARDIAN_GROUNDED_CELLS, GUARDIAN_LANDED_CELLS, entPoseCell } from "./anim.ts";
import { KNOT_PATHS, flightUnitAt, pathForKnot } from "./flight.ts";
import { LOGICAL_H, SUBS, TICK_MS, TILE } from "./paint.ts";
import { cameraTargetY, clampScroll } from "./camera.ts";
import type { EntitySpec, PaintLevel } from "./level.ts";

const TIERS = ["E", "M", "S"] as const;

// a 40×14 room with the floor at row 12 — the entities suite's own fixture
const GRID: string[] = [
  ...Array.from({ length: 8 }, () => "........................................"),
  "....................########............",
  "........................................",
  "........................................",
  "........................................",
  "########################################",
  "########################################",
];

const guardianSpec = (tier: "E" | "M" | "S"): EntitySpec =>
  ({ id: "tafel", role: "guardian", skin: "tafel", c: 17, r: 11, tier, params: {} }) as EntitySpec;

const input = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 17 * TILE * SUBS,
  playerY: 12 * TILE * SUBS,
  playerIframes: 0,
  playerOverlayOpen: false,
  fist: null,
  ...over,
});

/** A child who paces — the chapter's own answer to a thrower. */
const pacing = (t: number): WorldInput =>
  input({ playerX: (16 + (Math.floor(t / 40) % 2 === 0 ? 8 : -8)) * TILE * SUBS });

// ── THE FAIRNESS LAW ────────────────────────────────────────────────────────
describe("the telegraph is never shorter than 500 ms (doc 44 §4 ch01 C4)", () => {
  it("holds on EVERY tier and EVERY knot, through the sim's own function", () => {
    // 30 ticks IS 500 ms on the 60 Hz contract — state the conversion, so a
    // change to the tick rate cannot quietly shorten the law.
    expect(TELEGRAPH_FLOOR_TICKS * TICK_MS).toBeGreaterThanOrEqual(500);
    for (const tier of TIERS) {
      const knots = GUARDIAN_SCRIPT[tier].knots;
      for (let hp = knots; hp >= 1; hp--) {
        const ticks = telegraphTicksFor(tier, hp, knots);
        expect(
          ticks * TICK_MS,
          `tier ${tier}, ${hp} knots left: a ${Math.round(ticks * TICK_MS)} ms tell is unanswerable`,
        ).toBeGreaterThanOrEqual(500);
      }
    }
  });

  it("the escalation really does shorten the clocks — the floor is load-bearing", () => {
    // If the knots did not tighten anything, the floor above would be proving
    // nothing. Tier E has room to shorten and does; tier S is already AT the
    // floor by its last knot, which is exactly what the clamp exists for.
    expect(telegraphTicksFor("E", 2, 3)).toBeLessThan(telegraphTicksFor("E", 3, 3));
    expect(throwEveryFor("E", 1, 3)).toBeLessThan(throwEveryFor("E", 3, 3));
    expect(telegraphTicksFor("S", 1, 5)).toBe(TELEGRAPH_FLOOR_TICKS);
  });

  it("a thrown piece is INERT until it has visibly left her hand", () => {
    // the second half of the same law — see CHALK_ARM_TICKS
    expect(CHALK_ARM_TICKS).toBeGreaterThan(0);
    expect(CHALK_ARM_TICKS).toBeLessThan(CHALK_FLIGHT_TICKS);
  });
});

// ── THE IDENTITY LAW ────────────────────────────────────────────────────────
describe("the flying Tafel never wears the retired grounded easel (PB-F1)", () => {
  /** Drive the real machine and collect every state it produces, tier by tier,
   *  knot by knot, including the terminal beats. */
  const statesReached = (): { flight: Set<string>; terminal: Set<string> } => {
    const flight = new Set<string>();
    const terminal = new Set<string>();
    for (const tier of TIERS) {
      const w: EntityWorld = spawnEntities([guardianSpec(tier)], []);
      const g = w.entities[0]!;
      const knots = GUARDIAN_SCRIPT[tier].knots;
      let solved = 0;
      for (let t = 0; t < 20000 && solved <= knots; t++) {
        const evs = stepEntities(w, GRID, pacing(t));
        flight.add(g.state);
        for (const ev of evs) {
          if (ev.type === "guardianStagger") {
            // the shell's move: the window opens, the card is answered
            g.state = "window";
            flight.add(g.state);
            guardianKnotSolved(w, g.id);
            solved++;
          }
        }
        if (g.state === "sink" || g.state === "sad" || g.state === "consoled") terminal.add(g.state);
      }
      expect(solved, `tier ${tier} never reached its last knot`).toBeGreaterThanOrEqual(knots);
    }
    return { flight, terminal };
  };

  const cellFor = (state: string, timer = 0): string =>
    entPoseCell({ role: "guardian", state, timer, redeemed: false, vx: 0, vy: 0, x: 0, homeX: 0 });

  it("reaches the whole machine — flight, window and the consolation", () => {
    const { flight, terminal } = statesReached();
    // the states the fight is made of are all actually exercised
    for (const s of ["fly", "telegraph", "throw", "dip", "stagger", "window"]) {
      expect(flight, `the run never reached the ${s} state`).toContain(s);
    }
    expect([...terminal].sort()).toEqual(["consoled", "sad", "sink"]);
  });

  it("TAMPER TARGET: no state resolves to a grounded-easel cell", () => {
    const { flight, terminal } = statesReached();
    for (const state of [...flight, ...terminal]) {
      // sweep the timer too — the windup cycles cells on it
      for (const timer of [0, 5, 11, 17, 23, 40, 90]) {
        const cell = cellFor(state, timer);
        expect(
          GUARDIAN_GROUNDED_CELLS.has(cell),
          `state "${state}" (timer ${timer}) resolves to "${cell}" — that is the RETIRED easel, and swapping bodies mid-fight is PB-F1`,
        ).toBe(false);
      }
    }
  });

  it("grounded is right in exactly ONE place: when she has landed, beaten", () => {
    expect(GUARDIAN_LANDED_CELLS.has(cellFor("sad"))).toBe(true);
    expect(GUARDIAN_LANDED_CELLS.has(cellFor("consoled"))).toBe(true);
    // …and nowhere else — a flying board may not wear a landed cell
    for (const s of ["fly", "telegraph", "throw"]) {
      expect(GUARDIAN_LANDED_CELLS.has(cellFor(s))).toBe(false);
    }
  });
});

// ── THE READABLE PATHS ──────────────────────────────────────────────────────
describe("the three knot paths (doc 44 §4 ch01 C4)", () => {
  it("escalates spiral → figure-eight → zigzag, gentlest first", () => {
    expect(KNOT_PATHS).toEqual(["spiral", "eight", "zigzag"]);
    expect(pathForKnot(3, 3)).toBe("spiral"); // knot 1: full health
    expect(pathForKnot(2, 3)).toBe("eight");
    expect(pathForKnot(1, 3)).toBe("zigzag"); // knot 3: the last one
    // a longer fight (tier S has five knots) never runs off the end
    expect(pathForKnot(1, 5)).toBe("zigzag");
    expect(pathForKnot(5, 5)).toBe("spiral");
  });

  it("every shape is CLOSED — she can trace it forever with no seam", () => {
    for (const p of KNOT_PATHS) {
      const a = flightUnitAt(p, 0);
      const b = flightUnitAt(p, 1);
      expect(b.fx).toBeCloseTo(a.fx, 9);
      expect(b.fy).toBeCloseTo(a.fy, 9);
    }
  });

  it("every shape stays inside its own amplitudes (the arena decides the size)", () => {
    for (const p of KNOT_PATHS) {
      for (let i = 0; i <= 400; i++) {
        const { fx, fy } = flightUnitAt(p, i / 400);
        expect(Math.abs(fx)).toBeLessThanOrEqual(1.0000001);
        expect(Math.abs(fy)).toBeLessThanOrEqual(1.0000001);
      }
    }
  });

  it("the figure-eight really crosses itself, and the zigzag really has corners", () => {
    // the eight passes through its own centre twice per lap (u = 0 and u = ½)
    expect(flightUnitAt("eight", 0.5).fx).toBeCloseTo(0, 9);
    expect(flightUnitAt("eight", 0.5).fy).toBeCloseTo(0, 9);
    // …and reaches both extremes on the way
    expect(flightUnitAt("eight", 0.25).fx).toBeCloseTo(1, 9);
    expect(flightUnitAt("eight", 0.75).fx).toBeCloseTo(-1, 9);
    // the zigzag sweeps corner to corner, linearly (constant speed, sharp turns)
    expect(flightUnitAt("zigzag", 0).fx).toBeCloseTo(-1, 9);
    expect(flightUnitAt("zigzag", 0.5).fx).toBeCloseTo(1, 9);
    // the spiral pulls IN at the middle of its pass and comes back out
    const r0 = Math.abs(flightUnitAt("spiral", 0).fx);
    const rMid = Math.hypot(flightUnitAt("spiral", 0.5).fx, flightUnitAt("spiral", 0.5).fy);
    expect(rMid).toBeLessThan(r0);
  });
});

// ── THE PATH IS ON SCREEN (the fairness law's geometric half) ───────────────
describe("her whole body stays in the visible band (readable = seeable)", () => {
  const CONTENT = path.resolve(__dirname, "../../../content/corpus/stories");
  const levelPath = path.join(CONTENT, "g1.st.lost-pages", "paint", "ch01.level.json");

  it("every knot's full path stays inside the camera's band over the arena", () => {
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const arena = level.arena;
    expect(arena, "ch01 has no arena phase").toBeTruthy();
    const rows = arena!.rows;
    const worldHpx = rows.length * TILE;
    const g = arena!.entities.find((e) => e.role === "guardian")!;
    expect(g, "the arena has no guardian").toBeTruthy();

    // where the camera sits with the child standing on the arena floor — the
    // worst case for a boss who flies HIGH. Recomputed from camera.ts, so a
    // change to the follow rest-line moves this check with it.
    const floorRow = rows.findIndex((r, i) => i > 0 && r.startsWith("####################"));
    const feetY = floorRow * TILE * SUBS;
    const scrollY = clampScroll(cameraTargetY(feetY), worldHpx, LOGICAL_H) / SUBS;
    const seenTop = scrollY;
    const seenBottom = scrollY + LOGICAL_H;

    const GUARDIAN_DISPLAY_H = 52; // PaintScene.entTargetH for a guardian
    const centreX = (g.c * TILE + TILE / 2) * SUBS;
    const centreY = (g.r + 1) * TILE * SUBS;

    for (const [i, knots] of [[3, 3], [2, 3], [1, 3]].entries()) {
      const period = KNOT_PERIOD_TICKS[i]!;
      for (let t = 0; t <= period; t++) {
        const p = flightPointAt(centreX, centreY, knots[0]!, knots[1]!, t);
        const feet = p.y / SUBS;
        const head = feet - GUARDIAN_DISPLAY_H;
        expect(head, `knot ${i + 1} tick ${t}: her top edge is above the view`).toBeGreaterThanOrEqual(seenTop);
        expect(feet, `knot ${i + 1} tick ${t}: her feet are below the view`).toBeLessThanOrEqual(seenBottom);
        // …and she never flies into the floor she is fighting over
        expect(feet, `knot ${i + 1} tick ${t}: she is inside the boards`).toBeLessThan(floorRow * TILE);
      }
    }
  });

  it("the band constant is the one the paths are actually flown at", () => {
    const p = flightPointAt(0, 0, 3, 3, 0);
    // spiral at u=0 sits on the +x axis, so dy is 0 there; a quarter later it is
    // at full band height — this pins the constant to the geometry, not a copy
    const q = flightPointAt(0, 0, 3, 3, Math.round(KNOT_PERIOD_TICKS[0]! / 4));
    expect(p.y).toBe(0);
    expect(Math.abs(q.y) / SUBS).toBeGreaterThan(FLIGHT_BAND_PX * 0.4);
  });
});

// ── THE THROW, THE ARC, THE SHARD ───────────────────────────────────────────
describe("the arced chalk and its shard (doc 44 §3.2 + §4 ch01 C4)", () => {
  const untilThrow = (w: EntityWorld, inp: WorldInput, max = 900) => {
    for (let t = 0; t < max; t++) {
      stepEntities(w, GRID, inp);
      const c = w.projectiles.find((p) => p.kind === "chalk");
      if (c) return c;
    }
    return null;
  };

  it("solves its own arc — the piece arrives at the child's feet on schedule", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    // a child far to the left, standing on the floor: a real lob across the room
    const inp = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    const c = untilThrow(w, inp);
    expect(c).not.toBeNull();
    const targetX = inp.playerX;
    const targetY = inp.playerY;
    // it is ABOVE the target when it starts and falls onto it (an arc, not a dart)
    expect(c!.vy).toBeLessThan(0); // thrown upward first
    let closest = Infinity;
    for (let t = 0; t < CHALK_FLIGHT_TICKS + 4; t++) {
      stepEntities(w, GRID, inp);
      const live = w.projectiles.find((p) => p.id === c!.id && !p.dead);
      if (!live) break;
      closest = Math.min(closest, Math.hypot(live.x - targetX, live.y - targetY) / SUBS);
    }
    // it lands ON the spot it was aimed at — which is why MOVING is the answer
    expect(closest).toBeLessThan(6);
  });

  it("leaves a shard that lingers ~1 s and then blows away as dust", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const inp = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    expect(untilThrow(w, inp)).not.toBeNull();
    let shard = null;
    for (let t = 0; t < 200 && !shard; t++) {
      stepEntities(w, GRID, inp);
      shard = w.projectiles.find((p) => p.kind === "shard") ?? null;
    }
    expect(shard, "a landed piece must leave a splinter").not.toBeNull();
    expect(SHARD_TICKS * TICK_MS).toBeCloseTo(1000, 6); // doc 44's „1 s", stated
    let alive = 0;
    for (let t = 0; t < SHARD_TICKS + 30; t++) {
      stepEntities(w, GRID, inp);
      if (w.projectiles.some((p) => p.id === shard!.id && !p.dead)) alive++;
    }
    expect(alive).toBeGreaterThanOrEqual(SHARD_TICKS - 4);
    expect(alive).toBeLessThanOrEqual(SHARD_TICKS + 1);
  });

  it("a lying shard opens a TASK, and never a death (doc 44 §4 ch01 C4)", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const away = input({ playerX: 4 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerIframes: 999 });
    expect(untilThrow(w, away)).not.toBeNull();
    let shard = null;
    for (let t = 0; t < 200 && !shard; t++) {
      stepEntities(w, GRID, away);
      shard = w.projectiles.find((p) => p.kind === "shard") ?? null;
    }
    expect(shard).not.toBeNull();
    // now the child steps onto it, out of i-frames
    const onIt = input({ playerX: shard!.x, playerY: shard!.y, playerIframes: 0 });
    const evs = stepEntities(w, GRID, onIt);
    const enc = evs.find((e) => e.type === "encounter");
    expect(enc, "standing on a shard must ask a card").toBeTruthy();
    expect(w.projectiles.some((p) => p.id === shard!.id && !p.dead)).toBe(false);
  });

  it("cycles the six painted sticks deterministically — no RNG in the arena", () => {
    const colours = (): string[] => {
      const w = spawnEntities([guardianSpec("E")], []);
      const out: string[] = [];
      const seen = new Set<number>();
      for (let t = 0; t < 4000 && out.length < 7; t++) {
        stepEntities(w, GRID, pacing(t));
        for (const p of w.projectiles) {
          if (p.kind === "chalk" && !seen.has(p.id)) { seen.add(p.id); out.push(p.colour); }
        }
      }
      return out;
    };
    const a = colours();
    expect(a.length).toBeGreaterThanOrEqual(6);
    expect(a.slice(0, 6)).toEqual([...CHALK_COLOURS]);
    expect(a[6]).toBe(CHALK_COLOURS[0]); // …and wraps
    expect(colours()).toEqual(a); // …identically, every run
  });
});

// ── THE ECONOMY ─────────────────────────────────────────────────────────────
describe("the counter-window economy (doc 44 §4 ch01 C4)", () => {
  it("she comes DOWN to the child to write — the window is low and near", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    let flightY = 0;
    for (let t = 0; t < 6000; t++) {
      stepEntities(w, GRID, pacing(t));
      if (g.state === "fly") flightY = g.y;
      if (g.state === "stagger") break;
    }
    expect(g.state).toBe("stagger");
    // she is lower than she flew, and within arm's reach of the child
    expect(g.y).toBeGreaterThan(flightY);
    expect(Math.abs(g.x - pacing(0).playerX) / SUBS).toBeLessThan(200);
  });

  it("REDEMPTION CHANGES STATE, NEVER PRESENCE — she is still there afterwards", () => {
    // doc 44 §1 / R3-5, the law stage D proved for Merle, proved here for the
    // guardian she was fighting: the consoled Tafel is not parked, not removed
    // and not left mid-fall. She lands, rests, brightens — and STAYS, on the
    // ground, in her `win` cell, for as long as the child is in the arena.
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    for (let k = 0; k < GUARDIAN_SCRIPT.E.knots; k++) guardianKnotSolved(w, g.id);
    expect(g.state).toBe("sink");
    for (let t = 0; t < 2000; t++) stepEntities(w, GRID, pacing(t));
    expect(g.state).toBe("consoled");
    expect(w.entities.some((e) => e.id === g.id)).toBe(true); // never removed
    expect(entPoseCell({ ...g, flightTick: g.flightTick })).toBe("win");
    const restedAt = { x: g.x, y: g.y };
    // …and she does not drift for the rest of the chapter
    for (let t = 0; t < 3000; t++) stepEntities(w, GRID, pacing(t));
    expect(g.state).toBe("consoled");
    expect({ x: g.x, y: g.y }).toEqual(restedAt);
  });

  it("being HIT never unties a knot — knots are earned in the window only", () => {
    const w = spawnEntities([guardianSpec("E")], []);
    const g = w.entities[0]!;
    const hp0 = g.hp;
    // stand on the aim point with no i-frames: every piece connects
    for (let t = 0; t < 2000; t++) stepEntities(w, GRID, input({ playerIframes: 0 }));
    expect(g.hp).toBe(hp0);
    expect(DODGES_PER_WINDOW).toBe(3); // stage B's economy, unchanged
  });
});
