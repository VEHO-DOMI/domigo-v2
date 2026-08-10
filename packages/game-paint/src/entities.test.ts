import { describe, expect, it } from "vitest";
import {
  applyLinks,
  engageTargetId,
  guardianKnotSolved,
  redeemEntity,
  rideAttachCheck,
  spawnEntities,
  stepEntities,
  flightPointAt,
  GUARDIAN_SCRIPT,
  JOY_TICKS,
  KNOT_PERIOD_TICKS,
  SAD_TICKS,
  type EntityWorld,
  type WorldInput,
} from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import type { EntitySpec } from "./level.ts";

// a 40×14 room: floor at row 12, a ledge at row 8 (cols 20–27), honest depth
const GRID: string[] = [
  ...Array.from({ length: 8 }, () => "........................................"),
  "....................########............",
  "........................................",
  "........................................",
  "........................................",
  "########################################",
  "########################################",
];

const spec = (over: Partial<EntitySpec>): EntitySpec => ({
  id: "e1", role: "chaser", skin: "pencil", c: 10, r: 11, tier: "E", ...over,
});

const idleInput = (over: Partial<WorldInput> = {}): WorldInput => ({
  playerX: 2 * TILE * SUBS,
  playerY: 12 * TILE * SUBS,
  playerIframes: 0,
  playerOverlayOpen: false,
  fist: null,
  ...over,
});

const run = (w: EntityWorld, inp: WorldInput, ticks: number) => {
  const all = [];
  for (let t = 0; t < ticks; t++) all.push(...stepEntities(w, GRID, inp));
  return all;
};

// ── PK-R6 · C1/C2 · the drained object and the ↑ engage (doc 44 §4 ch01) ─────
describe("drained objects + the ↑ engage", () => {
  /** the player standing AT an entity spawned at (c,r) */
  const atEntity = (c: number, r: number, over: Partial<WorldInput> = {}): WorldInput =>
    idleInput({ playerX: (c * TILE + TILE / 2) * SUBS, playerY: (r + 1) * TILE * SUBS, ...over });

  const drained = (over: Partial<EntitySpec> = {}): EntitySpec =>
    spec({ id: "obj1", role: "drained", skin: "obj_desk", c: 10, r: 11, ...over });

  it("does NOTHING on contact — a desk is not an ambush", () => {
    const w = spawnEntities([drained()], []);
    // stand on it for two seconds without pressing anything
    expect(run(w, atEntity(10, 11), 120)).toEqual([]);
  });

  it("raises `engaged` on the ↑ PRESS, and only for the tick of the press", () => {
    const w = spawnEntities([drained()], []);
    const evs = stepEntities(w, GRID, atEntity(10, 11, { playerEngage: true }));
    expect(evs.filter((e) => e.type === "engaged").map((e) => e.id)).toEqual(["obj1"]);
    // the sim hands in an EDGE, so a held ↑ is not a second engage
    expect(run(w, atEntity(10, 11), 60).filter((e) => e.type === "engaged")).toEqual([]);
  });

  it("is out of reach from across the room", () => {
    const w = spawnEntities([drained()], []);
    const far = idleInput({ playerX: 30 * TILE * SUBS, playerY: 12 * TILE * SUBS, playerEngage: true });
    expect(stepEntities(w, GRID, far).filter((e) => e.type === "engaged")).toEqual([]);
  });

  it("ONE press engages ONE being — the nearest — never both at once", () => {
    const w = spawnEntities([drained({ id: "near", c: 10 }), drained({ id: "far", c: 11 })], []);
    const evs = stepEntities(w, GRID, atEntity(10, 11, { playerEngage: true }));
    expect(evs.filter((e) => e.type === "engaged").map((e) => e.id)).toEqual(["near"]);
  });

  it("engageTargetId names exactly what a press would reach (the cue reads from it)", () => {
    const w = spawnEntities([drained()], []);
    const px = (10 * TILE + TILE / 2) * SUBS;
    const py = 12 * TILE * SUBS;
    expect(engageTargetId(w, px, py)).toBe("obj1");
    expect(engageTargetId(w, 30 * TILE * SUBS, py)).toBeNull();
    // a restored object no longer advertises itself
    redeemEntity(w, "obj1");
    expect(engageTargetId(w, px, py)).toBeNull();
  });

  it("↑ opens a CAGE — the fist-less chapter can still free its classmate", () => {
    // PK-R6 · C2: ch01 grants no fist (doc 44 §4), and cages used to answer to
    // nothing else. Without this the chapter's one classmate cage would be
    // unopenable and the chapter uncompletable.
    const w = spawnEntities([spec({ id: "cage-merle", role: "cage", skin: "pencilcase", c: 10, r: 11 })], []);
    const evs = stepEntities(w, GRID, atEntity(10, 11, { playerEngage: true }));
    expect(evs.filter((e) => e.type === "cageBurst").map((e) => e.id)).toEqual(["cage-merle"]);
    expect(w.entities[0]!.redeemed).toBe(true);
  });
});

describe("the fist-less dodge window (PK-R6 · C2, flying under · E)", () => {
  const tafel = (): EntityWorld =>
    spawnEntities([spec({ id: "tafel", role: "guardian", skin: "tafel", c: 17, r: 11, tier: "E" })], []);
  /** A child who PACES, which is what the chapter teaches and what the proof
   *  tape's pilot does. The chalk is aimed at where they stand, so walking is
   *  the whole answer — a stationary child is standing on the target. */
  const pacing = (t: number): WorldInput =>
    idleInput({ playerX: (16 + (Math.floor(t / 40) % 2 === 0 ? 8 : -8)) * TILE * SUBS });

  it("opens a counter-window after DODGES_PER_WINDOW chalks reach the floor", () => {
    const w = tafel();
    const g = w.entities[0]!;
    let staggers = 0;
    for (let t = 0; t < 3000 && staggers === 0; t++) {
      for (const ev of stepEntities(w, GRID, pacing(t))) if (ev.type === "guardianStagger") staggers++;
    }
    expect(staggers).toBe(1);
    expect(g.dodges).toBe(0); // the tally resets when it is spent
  });

  it("never opens mid-telegraph — an interrupted tell is a throw that never comes", () => {
    // PK-C3's rule („never mid-crossing", which stranded her off-station) has an
    // aerial twin: the child has already begun READING a windup when the third
    // dodge lands, and cutting it turns the fairness beat into a feint.
    const w = tafel();
    const g = w.entities[0]!;
    const entriesIntoDip: string[] = [];
    let dips = 0;
    let prev = g.state;
    for (let t = 0; t < 5000; t++) {
      stepEntities(w, GRID, pacing(t));
      if (g.state !== prev) {
        if (g.state === "dip") { entriesIntoDip.push(prev); dips++; }
        prev = g.state;
      }
      // a settled window never carries travel — she would drift out from under
      // her own chalked words while the child is reading them
      if (g.state === "stagger" || g.state === "window") expect(g.vx).toBe(0);
    }
    expect(dips).toBeGreaterThan(0); // the run actually exercised the beat
    // EVERY entry into the dip came out of level flight — never out of a tell
    expect([...new Set(entriesIntoDip)]).toEqual(["fly"]);
  });

  it("ANTI-SOFTLOCK: even a child who never moves gets into the fight", () => {
    // A six-year-old who freezes is standing exactly where the chalk is aimed,
    // so every piece would hit and no window could ever open — except that a hit
    // grants i-frames, and chalk passes THROUGH an invulnerable child to the
    // floor, where it counts as the dodge it effectively was. The fight
    // therefore always progresses; this pins that it does.
    const w = tafel();
    const g = w.entities[0]!;
    let iframes = 0;
    let staggers = 0;
    for (let t = 0; t < 4000 && staggers === 0; t++) {
      const inp = idleInput({ playerX: 17 * TILE * SUBS, playerIframes: iframes });
      const evs = stepEntities(w, GRID, inp);
      if (iframes > 0) iframes--;
      for (const ev of evs) {
        if (ev.type === "encounter") iframes = 120; // PAINT.iframeTicks
        if (ev.type === "guardianStagger") staggers++;
      }
    }
    expect(staggers).toBe(1);
    expect(g.state === "stagger" || g.state === "window").toBe(true);
  });
});

describe("chaser", () => {
  it("patrols and turns at a ledge instead of walking off", () => {
    const w = spawnEntities([spec({ c: 21, r: 7 })], []); // on the ledge
    const e = w.entities[0]!;
    const leftEdge = 20 * TILE * SUBS;
    const rightEdge = 28 * TILE * SUBS;
    for (let t = 0; t < 600; t++) stepEntities(w, GRID, idleInput());
    expect(e.x).toBeGreaterThan(leftEdge);
    expect(e.x).toBeLessThan(rightEdge);
  });

  it("opens an encounter on player contact — never a kill", () => {
    const w = spawnEntities([spec({})], []);
    const e = w.entities[0]!;
    const evs = run(w, idleInput({ playerX: e.x, playerY: e.y }), 2);
    expect(evs.some((v) => v.type === "encounter")).toBe(true);
  });

  it("respects i-frames and the frozen overlay", () => {
    const w = spawnEntities([spec({})], []);
    const e = w.entities[0]!;
    expect(run(w, idleInput({ playerX: e.x, playerY: e.y, playerIframes: 10 }), 2)
      .some((v) => v.type === "encounter")).toBe(false);
    expect(run(w, idleInput({ playerX: e.x, playerY: e.y, playerOverlayOpen: true }), 2)
      .some((v) => v.type === "encounter")).toBe(false);
  });
});

describe("gunner + projectiles", () => {
  it("telegraphs then fires an arcing blob when the player is in range", () => {
    const w = spawnEntities([spec({ role: "gunner", skin: "paintbox", c: 12, r: 11 })], []);
    const inp = idleInput({ playerX: 8 * TILE * SUBS });
    run(w, inp, 400);
    expect(w.projectiles.length + 0).toBeGreaterThanOrEqual(0); // fired at least once overall:
    // the projectile may have landed and been culled — assert via a fresh run's event trail
    const w2 = spawnEntities([spec({ role: "gunner", skin: "paintbox", c: 12, r: 11 })], []);
    let fired = false;
    for (let t = 0; t < 400 && !fired; t++) { stepEntities(w2, GRID, inp); fired = w2.projectiles.length > 0; }
    expect(fired).toBe(true);
  });

  it("a projectile touching the player opens an encounter from the shooter", () => {
    const w = spawnEntities([spec({ role: "gunner", skin: "paintbox", c: 12, r: 11 })], []);
    const inp = idleInput({ playerX: 14 * TILE * SUBS, playerY: 12 * TILE * SUBS });
    const evs = run(w, inp, 600);
    const enc = evs.filter((v) => v.type === "encounter");
    expect(enc.length).toBeGreaterThan(0);
  });
});

describe("crusher", () => {
  it("slams only when the player walks beneath, then recovers home", () => {
    const w = spawnEntities([spec({ role: "crusher", skin: "ranzen", c: 22, r: 7 })], []);
    const e = w.entities[0]!;
    run(w, idleInput(), 120);
    expect(e.state).toBe("patrol"); // nobody underneath
    run(w, idleInput({ playerX: e.x, playerY: 12 * TILE * SUBS }), 40);
    expect(["telegraph", "act", "recover"]).toContain(e.state);
  });
});

describe("cages (fist-only, hp 2, burst event)", () => {
  it("takes two fist hits to burst and never reacts to touch", () => {
    const w = spawnEntities([spec({ role: "cage", skin: "satchel", c: 12, r: 11 })], []);
    const e = w.entities[0]!;
    const touch = run(w, idleInput({ playerX: e.x, playerY: e.y }), 3);
    expect(touch.some((v) => v.type === "encounter")).toBe(false);
    const fist = { active: true, x: e.x, y: e.y - 14 * SUBS };
    const evs1 = run(w, idleInput({ fist }), 1);
    expect(evs1.some((v) => v.type === "cageHit")).toBe(true);
    // wait out the shaking cooldown, then hit again
    run(w, idleInput(), 40);
    const evs2 = run(w, idleInput({ fist }), 1);
    expect(evs2.some((v) => v.type === "cageBurst")).toBe(true);
    expect(e.redeemed).toBe(true);
  });
});

describe("powerup + door + links", () => {
  it("powerup grants on touch; door fires its kind; links reveal hidden targets", () => {
    const w = spawnEntities(
      [
        spec({ id: "pw", role: "powerup", skin: "fist", c: 10, r: 11, params: { grants: "punch" } }),
        spec({ id: "dr", role: "door.trigger", skin: "door", c: 14, r: 11, params: { kind: "bonus" } }),
        spec({ id: "hid", role: "cage", skin: "satchel", c: 20, r: 7, params: { hidden: true } }),
      ],
      [{ trigger: "dr", on: "opened", action: "reveal", targets: ["hid"] }],
    );
    const pw = w.entities.find((e) => e.id === "pw")!;
    const evs = run(w, idleInput({ playerX: pw.x, playerY: pw.y }), 2);
    expect(evs.some((v) => v.type === "powerupTaken" && v.grants === "punch")).toBe(true);
    const dr = w.entities.find((e) => e.id === "dr")!;
    const evs2 = run(w, idleInput({ playerX: dr.x, playerY: dr.y }), 2);
    expect(evs2.some((v) => v.type === "doorTouched" && v.kind === "bonus")).toBe(true);
    const hid = w.entities.find((e) => e.id === "hid")!;
    expect(hid.hidden).toBe(true);
    applyLinks(w, "opened", "dr");
    expect(hid.hidden).toBe(false);
  });
});

describe("the guardian machine (G11 grammar)", () => {
  it("throws chalk on its clock, staggers on a deflected hit, unknots via solved windows", () => {
    const w = spawnEntities([spec({ id: "g", role: "guardian", skin: "tafel", c: 30, r: 11, tier: "E" })], []);
    const g = w.entities.find((e) => e.id === "g")!;
    const inp = idleInput({ playerX: 24 * TILE * SUBS, playerY: 12 * TILE * SUBS });
    let chalk = null;
    for (let t = 0; t < 400 && !chalk; t++) { stepEntities(w, GRID, inp); chalk = w.projectiles.find((p) => p.kind === "chalk") ?? null; }
    expect(chalk).not.toBeNull();
    // deflect it with a fist placed on the chalk, then let it fly home
    let staggered = false;
    for (let t = 0; t < 300 && !staggered; t++) {
      const c = w.projectiles.find((p) => p.kind === "chalk");
      const fist = c ? { active: true, x: c.x, y: c.y - 8 * SUBS } : null;
      const evs = stepEntities(w, GRID, { ...inp, fist: c && !c.deflected ? fist : null });
      staggered = evs.some((v) => v.type === "guardianStagger") || staggered;
    }
    expect(staggered).toBe(true);
    // three solved windows = down (tier E)
    expect(GUARDIAN_SCRIPT.E.knots).toBe(3);
    expect(guardianKnotSolved(w, "g").some((v) => v.type === "guardianKnot")).toBe(true);
    expect(guardianKnotSolved(w, "g").some((v) => v.type === "guardianKnot")).toBe(true);
    expect(guardianKnotSolved(w, "g").some((v) => v.type === "guardianDown")).toBe(true);
    // R3-5 kept, PK-R6 · E re-staged: the last knot no longer jumps to the
    // victory cell. She comes DOWN first (`sink` — the flight sheet's land
    // cells), rests exhausted on the boards (`sad`), and only then is consoled.
    expect(g.state).toBe("sink");
    for (let t = 0; t < 400 && g.state === "sink"; t++) stepEntities(w, GRID, inp);
    expect(g.state).toBe("sad");
    for (let t = 0; t <= SAD_TICKS + 1; t++) stepEntities(w, GRID, inp);
    expect(g.state).toBe("consoled");
  });

  it("R3-4: it FACES the player to throw, and the chalk leaves on that side", () => {
    for (const playerSide of [-1, 1] as const) {
      const w = spawnEntities([spec({ id: "g", role: "guardian", skin: "tafel", c: 20, r: 11, tier: "E" })], []);
      const g = w.entities.find((e) => e.id === "g")!;
      const inp = idleInput({ playerX: (20 + playerSide * 9) * TILE * SUBS, playerY: 12 * TILE * SUBS });
      g.dir = -playerSide as 1 | -1; // start it turned AWAY — Koki's 11.50.09
      let chalk = null;
      let dirAtThrow = 0;
      for (let t = 0; t < 600 && !chalk; t++) {
        stepEntities(w, GRID, inp);
        if (g.state === "telegraph") dirAtThrow = g.dir;
        chalk = w.projectiles.find((p) => p.kind === "chalk") ?? null;
      }
      expect(chalk).not.toBeNull();
      // PK-R6 · E: the turn beat retires with the ground roll — a flying board
      // has no wheels to swing round. The LAW it protected is untouched and is
      // asserted here instead: by the time she releases, she is facing the
      // child, and the chalk leaves on that side. This is what kills the
      // „projectile appears behind you" class (Koki's 11.50.09).
      expect(dirAtThrow).toBe(playerSide);
      expect(Math.sign(chalk!.x - g.x)).toBe(playerSide);
      expect(Math.sign(chalk!.vx)).toBe(playerSide);
    }
  });

  it("R3-5: a redeemed being flies its lap of joy and then settles AT HOME, never gone", () => {
    const w = spawnEntities([spec({ id: "m", role: "swarm", skin: "moths", c: 20, r: 10, tier: "E" })], []);
    const e = w.entities.find((x) => x.id === "m")!;
    const inp = idleInput({ playerX: 0, playerY: 0 });
    for (let t = 0; t < 40; t++) stepEntities(w, GRID, inp); // it drifts while cross
    redeemEntity(w, "m");
    expect(e.state).toBe("joy");
    let movedDuringJoy = false;
    const at = e.x;
    for (let t = 0; t < JOY_TICKS; t++) { stepEntities(w, GRID, inp); if (e.x !== at) movedDuringJoy = true; }
    expect(movedDuringJoy, "the Freudenrunde is a LAP — it has to move").toBe(true);
    for (let t = 0; t < 400; t++) stepEntities(w, GRID, inp);
    expect(e.state).toBe("rest");
    expect(e.x).toBe(e.homeX); // settled at home, not drifted off the page
    expect(e.y).toBe(e.homeY);
    expect(e.hidden).toBe(false); // presence is never removed (doc 31's kindness economy)
  });
});

// ── R5-A3 · the bouncer contract (doc 45: "clips out of the top of the screen")
// The forgiving groundAt probe scans from one row ABOVE the feet, so the old
// bouncer, drifting sideways near a higher surface, was SNAPPED up onto it —
// and his horizontal step was contract-free even in the air. Land only by
// crossing; probe the wall ahead every tick.
describe("R5-A3 · bouncer contract", () => {
  const put = (base: string, at: number, glyph: string, len = 1): string =>
    base.slice(0, at) + glyph.repeat(len) + base.slice(at + len);
  const air = ".".repeat(40);
  const floorRows = [air, "#".repeat(40), "#".repeat(40)];
  const bouncer = (c: number, dir: 1 | -1 = 1) =>
    spec({ role: "bouncer", c, r: 11, params: {}, ...(dir === -1 ? { } : {}) });
  const FLOOR_TOP = 12 * TILE * SUBS; // feet resting on the r12 floor

  it("a floating platform one tile up is a WALL, not an elevator (the up-ratchet)", () => {
    // old code: drifting under the c12–13 shelf, the next landing snapped him
    // THROUGH it onto its top — one rung of the ladder that carried him off-screen
    const grid = [...Array.from({ length: 11 }, () => air), put(air, 12, "#", 2), ...floorRows.slice(1)];
    const w = spawnEntities([bouncer(8)], []);
    const e = w.entities[0]!;
    let minFeet = e.y;
    for (let t = 0; t < 2500; t++) { stepEntities(w, grid, idleInput()); minFeet = Math.min(minFeet, e.y); }
    expect(minFeet, "never above the floor by more than his own hop").toBeGreaterThanOrEqual(FLOOR_TOP - 12 * SUBS);
  });

  it("a high bridge (3 tiles of clearance) is passed under, not turned at", () => {
    const grid = [...Array.from({ length: 9 }, () => air), put(air, 12, "#", 2), air, air, ...floorRows.slice(1)];
    const w = spawnEntities([bouncer(8)], []);
    const e = w.entities[0]!;
    let maxX = e.x;
    for (let t = 0; t < 800; t++) { stepEntities(w, grid, idleInput()); maxX = Math.max(maxX, e.x); }
    expect(maxX).toBeGreaterThan(15 * TILE * SUBS); // crossed beneath the bridge
  });

  it("corridor walls flip him — he never phases through solid columns", () => {
    // walls at c5 and c15, full body height; old code walked straight through
    const wall = (row: string): string => put(put(row, 5, "#"), 15, "#");
    const grid = [...Array.from({ length: 8 }, () => air), wall(air), wall(air), wall(air), wall(air), ...floorRows.slice(1)];
    const w = spawnEntities([bouncer(10)], []);
    const e = w.entities[0]!;
    let minX = e.x, maxX = e.x, flips = 0, lastDir = e.dir;
    for (let t = 0; t < 3000; t++) {
      stepEntities(w, grid, idleInput());
      minX = Math.min(minX, e.x); maxX = Math.max(maxX, e.x);
      if (e.dir !== lastDir) { flips++; lastDir = e.dir; }
    }
    expect(minX).toBeGreaterThan(5 * TILE * SUBS);
    expect(maxX).toBeLessThan(16 * TILE * SUBS);
    expect(flips).toBeGreaterThan(2); // it patrols the corridor, not a wall face
  });

  it("flat floor: he bounces in his lane — never sinks, never gains height", () => {
    const grid = [...Array.from({ length: 12 }, () => air), ...floorRows.slice(1)];
    const w = spawnEntities([bouncer(10)], []);
    const e = w.entities[0]!;
    for (let t = 0; t < 2000; t++) {
      stepEntities(w, grid, idleInput());
      expect(e.y).toBeLessThanOrEqual(FLOOR_TOP); // never inside the floor
      expect(e.y).toBeGreaterThanOrEqual(FLOOR_TOP - TILE * SUBS); // never a tile above it
    }
  });

  it("the ledge turn stays: he patrols his shelf and never hops off its edge", () => {
    const shelf = put(air, 10, "#", 8); // c10–17 at r10
    const grid = [...Array.from({ length: 10 }, () => air), shelf, ...Array.from({ length: 4 }, () => air), ...floorRows.slice(1)];
    const w = spawnEntities([spec({ role: "bouncer", c: 13, r: 9, params: {} })], []);
    const e = w.entities[0]!;
    let minFeet = e.y;
    for (let t = 0; t < 3000; t++) { stepEntities(w, grid, idleInput()); minFeet = Math.min(minFeet, e.y); }
    expect(e.y).toBeLessThanOrEqual(10 * TILE * SUBS); // still on the shelf…
    expect(e.x).toBeGreaterThan(10 * TILE * SUBS);
    expect(e.x).toBeLessThan(18 * TILE * SUBS);
    expect(minFeet).toBeGreaterThanOrEqual(10 * TILE * SUBS - TILE * SUBS); // …and never above it
  });
});

describe("platforms + the G3 ride contract", () => {
  it("platform.move traces its waypoint triangle and exposes per-tick deltas", () => {
    const w = spawnEntities([spec({ role: "platform.move", skin: "ruler", c: 10, r: 10, params: { dxTiles: 4, periodTicks: 120 } })], []);
    const e = w.entities[0]!;
    const x0 = e.x;
    run(w, idleInput(), 60);
    expect(e.x).toBeGreaterThan(x0);
    run(w, idleInput(), 60);
    expect(Math.abs(e.x - x0)).toBeLessThan(SUBS); // back home after a full period
  });

  it("rideAttachCheck follows the studied tolerance max(|vy|+2, 4)", () => {
    const w = spawnEntities([spec({ role: "platform.move", skin: "ruler", c: 10, r: 10 })], []);
    const e = w.entities[0]!;
    const top = e.y - 6 * SUBS;
    expect(rideAttachCheck(e, top + 3 * SUBS, e.x, SUBS)).toBe(true); // within 4px default tol
    expect(rideAttachCheck(e, top + 9 * SUBS, e.x, SUBS)).toBe(false); // beyond
    expect(rideAttachCheck(e, top + 9 * SUBS, e.x, 8 * SUBS)).toBe(true); // fast fall widens (8+2=10)
    expect(rideAttachCheck(e, top, e.x, -SUBS)).toBe(false); // rising never lands
  });
});

describe("redeem + shoo", () => {
  it("a redeemed being leaves play; the fist only shoos", () => {
    const w = spawnEntities([spec({})], []);
    const e = w.entities[0]!;
    const fist = { active: true, x: e.x, y: e.y - 14 * SUBS };
    const evs = run(w, idleInput({ fist }), 1);
    expect(evs.some((v) => v.type === "shooed")).toBe(true);
    expect(e.redeemed).toBe(false); // shooed ≠ redeemed
    redeemEntity(w, e.id);
    expect(e.redeemed).toBe(true);
    const evs2 = run(w, idleInput({ playerX: e.x, playerY: e.y }), 2);
    expect(evs2.some((v) => v.type === "encounter")).toBe(false);
  });
});

// ── PB-T1 · the entity ground contract (walkers respect edges) ───────────────
// Red-first: the pencil "walking off where he was standing… down this ledge"
// playtest class. v1's groundAt scanned 4 rows down and counted slopes as
// ground, so walkers strolled down ramps and off 2–3-tile ledges.

describe("PB-T1 · walker edge contract", () => {
  // a ledge at r8 (c20–26) descending via a backed `\` ramp (c27, solid under
  // it) onto a lower shelf (c28–32 at r9); floor at r12 — honest thick masses
  const RAMP_GRID: string[] = [
    ...Array.from({ length: 8 }, () => "........................................"),
    "....................#######\\............", // r8: ledge + `\` at c27
    "...........................######.......", // r9: ramp backing + lower shelf
    "........................................",
    "........................................",
    "########################################",
    "########################################",
  ];

  it("a patrolling pencil turns at a ramp-top instead of walking down it", () => {
    const w = spawnEntities([spec({ c: 22, r: 7 })], []);
    const e = w.entities[0]!;
    let maxX = e.x;
    let maxY = e.y;
    for (let t = 0; t < 900; t++) {
      stepEntities(w, RAMP_GRID, idleInput());
      maxX = Math.max(maxX, e.x);
      maxY = Math.max(maxY, e.y);
    }
    // never descends the ramp: x stays on the flat ledge run, y never drops
    expect(maxX).toBeLessThan(27 * TILE * SUBS);
    expect(maxY).toBeLessThanOrEqual(8 * TILE * SUBS);
  });

  it("a pencil turns at a 2-tile drop (v1's 4-row scan walked off)", () => {
    // shelf at r10 next to the floor at r12: a 2-tile drop off the right end
    const DROP_GRID: string[] = [
      ...Array.from({ length: 10 }, () => "........................................"),
      "....................########............", // shelf r10, ends at c27
      "........................................",
      "########################################",
      "########################################",
    ];
    const w = spawnEntities([spec({ c: 22, r: 9 })], []);
    const e = w.entities[0]!;
    let maxY = e.y;
    for (let t = 0; t < 900; t++) {
      stepEntities(w, DROP_GRID, idleInput());
      maxY = Math.max(maxY, e.y);
    }
    expect(maxY).toBeLessThanOrEqual(10 * TILE * SUBS); // never fell off
  });

  it("a role can OPT IN to ramp-walking (walkSlopes param)", () => {
    const w = spawnEntities([spec({ c: 22, r: 7, params: { walkSlopes: true } })], []);
    const e = w.entities[0]!;
    let reachedRamp = false;
    for (let t = 0; t < 900; t++) {
      stepEntities(w, RAMP_GRID, idleInput());
      if (e.x > 27 * TILE * SUBS) reachedRamp = true;
    }
    expect(reachedRamp).toBe(true); // walked onto/past the ramp deliberately
  });
});

// ── PK-R6 · E · the guardian's locomotion (doc 44 §4 ch01 C4: the Tafel FLIES)
// PK-C3's two-station ground roll retires with the R4 canon. What replaces it is
// asserted here in the same spirit: she MOVES, the movement is a shape, and the
// shape is the same shape every run.
describe("the arena guardian flies her knot's path", () => {
  const arena = (): EntityWorld =>
    spawnEntities([spec({ id: "tafel", role: "guardian", skin: "tafel", c: 17, r: 11, tier: "E", params: { knots: 3 } })], []);
  const far = (): WorldInput => idleInput({ playerX: 30 * TILE * SUBS });

  it("is airborne from the first tick and never touches the boards while it fights", () => {
    const w = arena();
    const g = w.entities[0]!;
    expect(g.state).toBe("fly");
    const floorY = 16 * TILE * SUBS; // the arena's walking surface
    for (let t = 0; t < 3000; t++) {
      stepEntities(w, GRID, far());
      if (g.state === "sink" || g.state === "sad" || g.state === "consoled") break;
      expect(g.y).toBeLessThan(floorY);
    }
  });

  it("traces a CLOSED shape — a full pass returns her to where it began", () => {
    const w = arena();
    const g = w.entities[0]!;
    // drive the path directly: one period of flightTick, same centre
    const a = flightPointAt(g.homeX, g.homeY, g.hp, 3, 0);
    const b = flightPointAt(g.homeX, g.homeY, g.hp, 3, KNOT_PERIOD_TICKS[0]!);
    expect(b.x).toBe(a.x);
    expect(b.y).toBe(a.y);
  });

  it("actually leaves her centre — the shape has size on both axes", () => {
    const w = arena();
    const g = w.entities[0]!;
    const xs = new Set<number>();
    const ys = new Set<number>();
    for (let t = 0; t < KNOT_PERIOD_TICKS[0]!; t++) {
      const p = flightPointAt(g.homeX, g.homeY, g.hp, 3, t);
      xs.add(p.x);
      ys.add(p.y);
    }
    expect((Math.max(...xs) - Math.min(...xs)) / SUBS).toBeGreaterThan(60);
    expect((Math.max(...ys) - Math.min(...ys)) / SUBS).toBeGreaterThan(20);
  });

  it("is DETERMINISTIC — two identical runs land on the same tick trace", () => {
    const trace = (): string => {
      const w = arena();
      const g = w.entities[0]!;
      const out: string[] = [];
      for (let t = 0; t < 1200; t++) { stepEntities(w, GRID, far()); out.push(`${g.state}:${g.x}:${g.y}`); }
      return out.join("|");
    };
    expect(trace()).toBe(trace());
  });
});
