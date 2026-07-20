import { describe, expect, it } from "vitest";
import {
  applyLinks,
  guardianKnotSolved,
  redeemEntity,
  rideAttachCheck,
  spawnEntities,
  stepEntities,
  GUARDIAN_SCRIPT,
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
    expect(g.state).toBe("consoled");
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
