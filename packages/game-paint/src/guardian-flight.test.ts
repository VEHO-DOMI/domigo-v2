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
  KNOT_SPAN_PX,
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
import {
  BOSS_BEAT_SWELL, FLIGHT_BANK_FACE, FLIGHT_PITCH_MAX_RAD, FLIGHT_PITCH_REF_VY, FLIGHT_ROLL_MIN,
  FLIGHT_ROLL_REF_VX, FLIGHT_ROLL_TICKS, GUARDIAN_DISPLAY_H, GUARDIAN_GROUNDED_CELLS,
  GUARDIAN_KEEPIN_MAX, GUARDIAN_LANDED_CELLS, entPoseCell, guardianManoeuvre,
  guardianPitchRad, guardianRollScaleX,
} from "./anim.ts";
import { GUARDIAN_RIG_CELLS } from "./artManifest.ts";
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

    // R5-W2 · H1 · THE BODY AS DRAWN, AT ITS BIGGEST — not a number typed here.
    //
    // This line used to read `const GUARDIAN_DISPLAY_H = 52;` with a comment
    // claiming it was `PaintScene.entTargetH for a guardian`. It was 68. The
    // one check that exists to prove her whole body stays on screen was
    // measuring a body 16 px shorter than the drawn one, and a copy cannot
    // drift if there is no copy — so the constants moved to anim.ts and are
    // imported (DEBT A6 / D-21).
    //
    // Height alone is still not what the child sees. Every cell is scaled from
    // the idle by its OWN proportions (`entTargetH / refFrameHOf`), and the
    // release cell swells by BOSS_BEAT_SWELL at the top of a tell. So the worst
    // case is: the tallest cell on her sheet, swollen, at the top of her band.
    // Both factors are read from the shipped art rather than asserted, so a
    // repainted sheet moves this proof with it.
    const ART = path.resolve(__dirname, "../../../apps/web/public/art/g1/paint/ch01");
    /** PNG height straight out of the IHDR — no decoder, no dependency. */
    const pngH = (stem: string): number =>
      fs.readFileSync(path.join(ART, `${stem}.png`)).readUInt32BE(20);
    const refH = pngH(`${g.skin}_a`); // the cell every other one is scaled from
    const tallest = Math.max(...GUARDIAN_RIG_CELLS.map((c) => pngH(`${g.skin}_${c}`)));
    const drawnH = (GUARDIAN_DISPLAY_H / refH) * tallest * (1 + BOSS_BEAT_SWELL);
    expect(drawnH, "die Rechnung muss die gezeichnete Höhe treffen, nicht die Ruhe-Höhe")
      .toBeGreaterThan(GUARDIAN_DISPLAY_H);

    const centreX = (g.c * TILE + TILE / 2) * SUBS;
    const centreY = (g.r + 1) * TILE * SUBS;

    for (const [i, knots] of [[3, 3], [2, 3], [1, 3]].entries()) {
      const period = KNOT_PERIOD_TICKS[i]!;
      for (let t = 0; t <= period; t++) {
        const p = flightPointAt(centreX, centreY, knots[0]!, knots[1]!, t);
        const feet = p.y / SUBS;
        // the framing clamp may push her back down by at most this much; what
        // it cannot reach is what the child loses off the top of the screen
        const head = feet - drawnH + GUARDIAN_KEEPIN_MAX;
        expect(head, `knot ${i + 1} tick ${t}: her top edge is above the view`).toBeGreaterThanOrEqual(seenTop);
        expect(feet, `knot ${i + 1} tick ${t}: her feet are below the view`).toBeLessThanOrEqual(seenBottom);
        // …and she never flies into the floor she is fighting over
        expect(feet, `knot ${i + 1} tick ${t}: she is inside the boards`).toBeLessThan(floorRow * TILE);
      }
    }
  });

  it("R5-P1 · die Buehnen-Klammer haelt jede Bahn horizontal im Sieg-freien Frame (A3-Schluss)", () => {
    // arena.md §10 Vorleistung 3: Tafel-x bleibt unter stageClamp c5–30 —
    // Westkante ≥ x80 (Auftritt-Ruhe), Ostkante ≤ x496 (Sieg-Trakt mit Käfig
    // #5 und ✕ wird nie überflogen). Gespiegelt zur Vertikal-Probe: die
    // EXTREM-Zentren (loC/hiC, entities.ts-Herleitung) fliegen jede Bahn
    // komplett; ein Amplituden-Drift über KNOT_SPAN_PX bricht hier rot.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const g = level.arena!.entities.find((e) => e.role === "guardian")!;
    expect(g.params?.stageMinC, "das Level traegt die Buehnen-Klammer (West)").toBe(5);
    expect(g.params?.stageMaxC, "das Level traegt die Buehnen-Klammer (Ost)").toBe(30);
    const stageMinPx = Number(g.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(g.params!.stageMaxC) + 1) * TILE;
    for (const [ki, knots] of ([[0, 3], [1, 3], [2, 3]] as const).entries()) {
      const span = KNOT_SPAN_PX[ki]!;
      const period = KNOT_PERIOD_TICKS[ki]!;
      for (const centreX of [(stageMinPx + span) * SUBS, (stageMaxPx - span) * SUBS]) {
        for (let t = 0; t <= period; t++) {
          const x = flightPointAt(centreX, 0, 3 - ki, knots[1], t).x / SUBS;
          expect(x, `Bahn ${ki + 1} tick ${t}: westlich der Buehne`).toBeGreaterThanOrEqual(stageMinPx);
          expect(x, `Bahn ${ki + 1} tick ${t}: im Sieg-Trakt`).toBeLessThanOrEqual(stageMaxPx);
        }
      }
    }
  });

  it("R5-W2 · H1 · die Buehnen-Klammer haelt auch den DIP auf der Buehne", () => {
    // GEMESSEN, nicht vermutet: der ausgelieferte p4-Pilot kaempft den ganzen
    // Boss auf Spalte 1,25–4,63 und zieht die Tafel bis c4,13 — westlich der
    // Buehne c5–30, mitten in die Kulisse, auf den Spawn. Dort spielt heute
    // auch der ganze Sieg-Bogen (sink → sad → consoled).
    //
    // Die Ursache ist eine Klammer, die nur die HALBE Bewegung kennt: der Dip
    // steuert `playerX ± DIP_STANDOFF_PX` an, waehrend stageMinC/stageMaxC nur
    // das Flug-ZENTRUM (`homeX`) klemmen. arena.md §3 erklaert die Westkulisse
    // aber zur RUHE-Zone („die Kulisse (x<80) wird NIE ueberflogen") und §6 den
    // Sieg-Trakt zum nie ueberflogenen Ort — beides war unwahr.
    //
    // Deshalb prueft dieses Gesetz JEDEN Zustand, nicht nur den Flug, und es
    // sucht sich die Gegenbeispiele nicht aus: es stellt das Kind der Reihe
    // nach in JEDE begehbare Spalte des ausgelieferten Raums.
    const level = JSON.parse(fs.readFileSync(levelPath, "utf8")) as PaintLevel;
    const arena = level.arena!;
    const spec = arena.entities.find((e) => e.role === "guardian")!;
    const rows = arena.rows;
    const stageMinPx = Number(spec.params!.stageMinC) * TILE;
    const stageMaxPx = (Number(spec.params!.stageMaxC) + 1) * TILE;
    const floorRow = rows.findIndex((r, i) => i > 0 && r.startsWith("####################"));

    // every column a child can actually stand in, read off the shipped rows
    const standable = [...Array(rows[0]!.length).keys()].filter(
      (c) => rows[floorRow - 1]![c] === "." && rows[floorRow]![c] === "#",
    );
    expect(standable.length, "der Boden des Raums ist leer gelesen").toBeGreaterThan(20);

    const dipped = new Set<number>();
    for (const col of standable) {
      const w: EntityWorld = spawnEntities([spec], rows);
      const g = w.entities[0]!;
      // ein Kind, das stehen bleibt, steht genau im Ziel — die i-Frames sind
      // der Grund, warum trotzdem ein Fenster aufgeht (entities.test.ts,
      // ANTI-SOFTLOCK). Ohne sie traefe jedes Stueck und nichts zaehlte.
      let iframes = 0;
      let windows = 0;
      for (let t = 0; t < 4000 && windows < 1; t++) {
        const parked = input({
          playerX: (col * TILE + TILE / 2) * SUBS,
          playerY: floorRow * TILE * SUBS,
          playerIframes: iframes,
        });
        const evs = stepEntities(w, rows, parked);
        if (iframes > 0) iframes--;
        for (const ev of evs) {
          if (ev.type === "encounter") iframes = 120; // PAINT.iframeTicks
          if (ev.type === "guardianStagger") windows++;
        }
        if (g.state === "dip") dipped.add(col);
        const x = g.x / SUBS;
        expect(x, `Kind auf c${col}, Zustand ${g.state}, Tick ${t}: westlich der Buehne`)
          .toBeGreaterThanOrEqual(stageMinPx);
        expect(x, `Kind auf c${col}, Zustand ${g.state}, Tick ${t}: im Sieg-Trakt`)
          .toBeLessThanOrEqual(stageMaxPx);
      }
      expect(windows, `Kind auf c${col}: der Lauf hat nie ein Fenster geoeffnet`).toBe(1);
    }
    // ein Gesetz, das den Dip nie gefahren hat, hat nichts bewiesen
    expect(dipped.size, "nicht jeder Lauf hat den Dip erreicht").toBe(standable.length);
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

  it("cycles the painted sticks deterministically — no RNG in the arena", () => {
    const n = CHALK_COLOURS.length;
    const colours = (): string[] => {
      const w = spawnEntities([guardianSpec("E")], []);
      const out: string[] = [];
      const seen = new Set<number>();
      for (let t = 0; t < 4000 && out.length < n + 1; t++) {
        stepEntities(w, GRID, pacing(t));
        for (const p of w.projectiles) {
          if (p.kind === "chalk" && !seen.has(p.id)) { seen.add(p.id); out.push(p.colour); }
        }
      }
      return out;
    };
    const a = colours();
    expect(a.length).toBeGreaterThanOrEqual(n);
    expect(a.slice(0, n)).toEqual([...CHALK_COLOURS]);
    expect(a[n]).toBe(CHALK_COLOURS[0]); // …and wraps
    expect(colours()).toEqual(a); // …identically, every run
  });

  // PK-R6 · H2 (round-2 finding 5): „the thrown chalk stick is a pale, thin
  // sliver close in value to the couches behind it". The stick that carried that
  // charge was `white`, and it opened the cycle — so the first piece of the fight
  // was the one with no hue to separate by. This is the law that keeps it out,
  // rather than a hope that nobody puts it back: a projectile the child must see
  // owes chroma, and the arena's own backdrop is chalk-valued.
  it("throws no white chalk — a projectile owes chroma (round-2 finding 5)", () => {
    expect(CHALK_COLOURS).not.toContain("white");
    expect(CHALK_COLOURS[0]).toBe("red"); // …and opens on the most saturated
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

// ── PK-R6 · H1 · THE FLIGHT ATTITUDE (round-1 critique, finding 2) ───────────
// The critique read the hover, the banked turn and the spiral loop as one
// picture. The painted cells alone cannot fix that — measured over a full pass
// per knot she wears a BANK cell 74 %, 74 % and 100 % of the time, and the
// zigzag (the only path with corners) never rolls at all, because its teeth are
// cut so |vy| equals |vx| exactly and `|vy| > |vx|` is false on a tie.
//
// So the attitude is drawn (anim.guardianPitchRad). These are its laws, and the
// first of them is the one the critique actually bought: each named state must
// look different from the others.
describe("she flies it — the drawn attitude (finding 2)", () => {
  const SUBS_PX = SUBS;
  /** One full pass of a knot's path, as per-tick velocities in subs. */
  const passOf = (hp: number, knots = 3): Array<{ vx: number; vy: number }> => {
    const ki = knots - hp;
    const period = KNOT_PERIOD_TICKS[ki]!;
    const c = { x: 400 * SUBS_PX, y: 200 * SUBS_PX };
    const out: Array<{ vx: number; vy: number }> = [];
    let prev = flightPointAt(c.x, c.y, hp, knots, 0);
    for (let t = 1; t <= period; t++) {
      const p = flightPointAt(c.x, c.y, hp, knots, t);
      out.push({ vx: p.x - prev.x, vy: p.y - prev.y });
      prev = p;
    }
    return out;
  };
  const pitches = (hp: number): number[] =>
    passOf(hp).map((v) => guardianPitchRad(v.vx, v.vy, v.vx >= 0 ? 1 : -1));

  it("THE ZIGZAG'S CORNERS READ: its pitch reverses, once per tooth (TAMPER)", () => {
    // This is the defect the measurement found. The climax knot spends 100 % of
    // its pass in a bank cell — every corner in the fight resolved to „crossing
    // at speed". The body now says what the cells cannot: it saws.
    // Counted against the last NON-ZERO sign: a tooth turns through a level
    // sample (vy = 0 exactly at the apex), and a counter that compared only
    // neighbours would score six of the eight reversals as „no change" — the
    // measurement lying about the fix it exists to prove.
    const reversals = (xs: readonly number[]): number => {
      let last = 0;
      let n = 0;
      for (const x of xs) {
        const s = Math.sign(x);
        if (s === 0) continue;
        if (last !== 0 && s !== last) n++;
        last = s;
      }
      return n;
    };
    // SIX, and the six are derived rather than wished for: ZIG_TEETH = 4 gives
    // eight vertical reversals per pass, the sweep's own turn at u = ½ flips the
    // leading edge once more, and where a tooth boundary lands ON that turn the
    // two flips cancel — twice, symmetrically. Measured: 6.
    expect(reversals(pitches(1))).toBeGreaterThanOrEqual(6);
    // …and the zigzag is the SAWING one: it reverses oftener than the gentle
    // first knot does, which is what „the corners read" means comparatively.
    expect(reversals(pitches(1))).toBeGreaterThan(reversals(pitches(3)));
    // TAMPER: the state before this fix — no drawn attitude at all — reverses
    // never, however many corners the path has.
    expect(reversals(passOf(1).map(() => 0))).toBe(0);
  });

  it("the three knots pitch by visibly different amounts — the escalation is in her body", () => {
    const peak = (hp: number): number => Math.max(...pitches(hp).map(Math.abs));
    const [k0, k1, k2] = [peak(3), peak(2), peak(1)];
    // the gentle first knot stays gentle, and the later two commit
    expect(k0).toBeLessThan(k1);
    expect(k1).toBeLessThanOrEqual(k2);
    // …and the spread is big enough to SEE: the first knot tilts less than half
    // as far as the last (measured peaks |vy| = 0.54 / 1.26 / 1.89 px per tick)
    expect(k0).toBeLessThan(k2 * 0.6);
    expect(k2).toBeCloseTo(FLIGHT_PITCH_MAX_RAD, 5); // the climax saturates
  });

  it("REF_VY is the real spread, not a guess — re-derived from the shipped paths", () => {
    // The constant claims 1.2 px/tick sits between the gentle knot's peak and
    // the angry ones'. If a path is ever retuned and that stops being true, the
    // escalation silently flattens — so the claim is checked against the paths
    // themselves rather than trusted.
    const peakVy = (hp: number): number => Math.max(...passOf(hp).map((v) => Math.abs(v.vy)));
    expect(peakVy(3)).toBeLessThan(FLIGHT_PITCH_REF_VY); // knot 0 never saturates
    expect(peakVy(2)).toBeGreaterThan(FLIGHT_PITCH_REF_VY); // knots 1 and 2 do
    expect(peakVy(1)).toBeGreaterThan(FLIGHT_PITCH_REF_VY);
  });

  it("a dive tips her nose toward where she is going, both ways round", () => {
    const fast = FLIGHT_PITCH_REF_VY;
    // flying right and descending (screen y grows downward) → she tips forward
    expect(guardianPitchRad(fast, fast, 1)).toBeGreaterThan(0);
    // flying LEFT and descending → the other edge leads, so the sign flips
    expect(guardianPitchRad(-fast, fast, -1)).toBeLessThan(0);
    // climbing is the mirror of diving
    expect(guardianPitchRad(fast, -fast, 1)).toBeCloseTo(-guardianPitchRad(fast, fast, 1), 9);
    // level flight is level, however fast she is crossing
    expect(guardianPitchRad(fast * 4, 0, 1)).toBe(0);
  });

  it("reduced motion draws no tilt, and the tilt is bounded and deterministic", () => {
    expect(guardianPitchRad(500, 900, 1, true)).toBe(0);
    // bounded however hard the sim ever throws her
    for (const vy of [-99999, -500, 0, 500, 99999]) {
      expect(Math.abs(guardianPitchRad(300, vy, 1))).toBeLessThanOrEqual(FLIGHT_PITCH_MAX_RAD + 1e-9);
    }
    // pure: same input, same angle, every time (a replayed tape must match)
    expect(guardianPitchRad(120, 200, 1)).toBe(guardianPitchRad(120, 200, 1));
  });

  // ── PK-R6 · H2 · THE SECOND AXIS (round-2 finding 3) ──────────────────────
  // Round 2 still read the three manoeuvres as one picture, and it was right to:
  // pitch is a rotation, and all three rotate — one axis, three amounts of the
  // same thing. The roll is the axis rotation cannot draw (anim.guardianRollScaleX).
  it("THE TIE GOES TO THE ROLL: the zigzag's corners are corkscrews (TAMPER)", () => {
    const kinds = passOf(1).map((v) => guardianManoeuvre(v.vx, v.vy));
    const spirals = kinds.filter((k) => k === "spiral").length;
    // MEASURED, not wished for: 216 of the climax knot's 220 ticks are a 45° saw
    // and roll. The other four are the apex of each tooth, where the tooth turns
    // through vy = 0 exactly and she really IS crossing level for one tick — the
    // classifier telling the truth, not an escape hatch.
    expect(spirals / kinds.length).toBeGreaterThan(0.95);
    expect(kinds.filter((k) => k === "hover").length).toBe(0);
    // TAMPER: the rule this replaces (a strict `>`), on the same velocities,
    // classifies the identical pass as 100 % bank — the measured defect, exactly
    // as anim.ts's own tally recorded it in H1.
    const strict = passOf(1).map((v) => (Math.abs(v.vy) > Math.abs(v.vx) ? "spiral" : "bank"));
    expect(new Set(strict)).toEqual(new Set(["bank"]));
  });

  it("each manoeuvre owns a WIDTH, and the three do not overlap", () => {
    // hover: square on. Nothing is turned away from a board going nowhere.
    expect(guardianRollScaleX(0, 0, 0)).toBe(1);
    // bank: a steady lean, deepening with the crossing, and never past its floor
    const slow = guardianRollScaleX(FLIGHT_ROLL_REF_VX * 0.4, 0, 0);
    const fast = guardianRollScaleX(FLIGHT_ROLL_REF_VX, 0, 0);
    expect(slow).toBeLessThan(1);
    expect(fast).toBeLessThan(slow);
    expect(fast).toBeCloseTo(FLIGHT_BANK_FACE, 9);
    // spiral: it passes right through edge-on, which is narrower than any bank
    const rolls: number[] = [];
    for (let t = 0; t < FLIGHT_ROLL_TICKS; t++) rolls.push(guardianRollScaleX(10, 400, t));
    expect(Math.min(...rolls)).toBeCloseTo(FLIGHT_ROLL_MIN, 6);
    expect(Math.max(...rolls)).toBeCloseTo(1, 6);
    // …so the roll ALONE separates a corkscrew from the deepest bank there is
    expect(Math.min(...rolls)).toBeLessThan(FLIGHT_BANK_FACE);
  });

  it("the width never mirrors her, never vanishes, and rests under reduced motion", () => {
    for (const [vx, vy, t] of [[0, 0, 0], [9999, 0, 3], [0, 9999, 7], [-500, 500, 11], [3, -80, 41]] as const) {
      const k = guardianRollScaleX(vx, vy, t);
      // a negative scale would MIRROR the cell, and mirroring is already spoken
      // for by the facing law — two mirrors in one frame is a bank drawn backwards
      expect(k).toBeGreaterThan(0);
      expect(k).toBeLessThanOrEqual(1 + 1e-9);
      expect(k).toBeGreaterThanOrEqual(FLIGHT_ROLL_MIN - 1e-9);
    }
    expect(guardianRollScaleX(500, 900, 5, true)).toBe(1);
    expect(guardianRollScaleX(120, 200, 9)).toBe(guardianRollScaleX(120, 200, 9));
  });

  it("the three PATHS now differ in width too, not only in tilt", () => {
    // How much of a pass she spends rolling rather than leaning. NOT the range
    // of widths — every path contains some roll, so the range saturates at the
    // same number for all three and would prove nothing (found by this test,
    // first draft). What separates them is how OFTEN.
    const rollShare = (hp: number): number => {
      const w = passOf(hp).map((v, i) => guardianRollScaleX(v.vx, v.vy, i));
      return w.filter((k) => k < FLIGHT_BANK_FACE).length / w.length;
    };
    // MEASURED over one full pass each — 0.130 · 0.115 · 0.491. The first two
    // paths lean their way round and dip into a roll at their turns; the CLIMAX
    // is a corkscrew from end to end, and spends nearly four times as much of
    // its pass past the deepest bank there is. That is the escalation this
    // finding asked to be visible in the pose, and it is not a claim about knots
    // 0 and 1 relative to each other — they fly comparable amounts of roll, and
    // what separates THEM is the pitch (see the tests above).
    expect(rollShare(1)).toBeGreaterThan(3 * rollShare(3));
    expect(rollShare(1)).toBeGreaterThan(3 * rollShare(2));
    // …and a leaning path still LEANS: its average width sits between edge-on
    // and square-on rather than pinned at either
    for (const hp of [3, 2, 1]) {
      const w = passOf(hp).map((v, i) => guardianRollScaleX(v.vx, v.vy, i));
      const mean = w.reduce((a, b) => a + b, 0) / w.length;
      expect(mean).toBeGreaterThan(FLIGHT_ROLL_MIN);
      expect(mean).toBeLessThan(1);
    }
  });
});
