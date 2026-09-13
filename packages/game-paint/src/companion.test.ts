import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { createCompanionTrail, stepCompanionTrail, companionPointSafe, COMPANION_DELAY_TICKS, COMPANION_MAX_BUFFER, type CompanionLeaderFrame, type CompanionPoint } from "./companion.ts";
import { IDLE_PAD, spawnPlayer, stepPlayer, type Pad } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { spawnEntities, stepEntities, stepRedeemedOnly } from "./entities.ts";
import type { PaintLevel } from "./level.ts";
import { decodePads, maskToPad } from "./tape.ts";
const grid = [...Array.from({ length: 10 }, () => ".".repeat(60)), "#".repeat(60), "#".repeat(60)];
const p = (x: number, y = 160, grounded = true): CompanionPoint => ({ x: Math.round(x * SUBS), y: Math.round(y * SUBS), grounded, dir: 1 });
const f = (tick: number, point: CompanionPoint, extra: Partial<CompanionLeaderFrame> = {}): CompanionLeaderFrame => ({ ...point, phaseId: "p2", tick, epoch: 0, ...extra });

describe("rescued companion follows the actual safe path", () => {
  it("walks to the trail start, follows past the old four-cell corner, then stands", () => {
    const s = createCompanionTrail("p2", p(40), grid)!;
    for (let t = 0; t < 200; t++) stepCompanionTrail(s, grid, f(t, p(56 + Math.min(t, 150))));
    expect(s.point.x).toBe(206 * SUBS);
    expect(s.point.grounded).toBe(true);
    expect(s.pose).toBe("stand");
    expect(s.ready.length).toBeLessThanOrEqual(COMPANION_DELAY_TICKS + 1);
  });
  it("is deterministic and does not advance on pause, missing/duplicate ticks or a different phase", () => {
    const a = createCompanionTrail("p2", p(40), grid)!;
    const b = createCompanionTrail("p2", p(40), grid)!;
    for (let t = 0; t < 80; t++) { stepCompanionTrail(a, grid, f(t, p(40 + t))); stepCompanionTrail(b, grid, f(t, p(40 + t))); }
    expect(a).toEqual(b);
    const old = structuredClone(a);
    stepCompanionTrail(a, grid);
    stepCompanionTrail(a, grid, f(80, p(120), { paused: true }));
    stepCompanionTrail(a, grid, f(79, p(120)));
    stepCompanionTrail(a, grid, f(80, p(600), { phaseId: "p3" }));
    expect(a).toEqual(old);
  });
  it("replays the real player jump only after a verified landing, including its height", () => {
    const s = createCompanionTrail("p2", p(48), grid)!;
    let player = spawnPlayer(48, 160);
    player.x = 48 * SUBS; player.y = 160 * SUBS; player.grounded = true;
    let prev = { ...IDLE_PAD }, landed = false, airStarted = false, followerJump = false;
    let heroMinY = player.y, followerMinY = s.point.y;
    for (let t = 0; t < 180; t++) {
      const pad: Pad = { ...IDLE_PAD, right: t < 100, jump: t >= 10 && t < 22 };
      player = stepPlayer(player, pad, prev, grid, { canRun: true, canPunch: false, canHover: false, canHang: false, slippery: false }).st;
      prev = pad;
      if (!player.grounded) airStarted = true;
      if (airStarted && player.grounded) landed = true;
      heroMinY = Math.min(heroMinY, player.y);
      stepCompanionTrail(s, grid, f(t, { x: player.x, y: player.y, grounded: player.grounded, dir: player.facing }));
      if (s.pose === "jump") { expect(landed).toBe(true); followerJump = true; }
      followerMinY = Math.min(followerMinY, s.point.y);
      expect(companionPointSafe(grid, s.point)).toBe(true);
    }
    expect(followerJump).toBe(true);
    expect(followerMinY).toBe(heroMinY);
    expect(s.point.grounded).toBe(true);
    expect(s.point.x).toBe(player.x);
  });
  it("does not follow an unlanded fall into ink or a checkpoint warp", () => {
    const pool = [...grid]; pool[9] = ".".repeat(10) + "w".repeat(6) + ".".repeat(44);
    const s = createCompanionTrail("p2", p(140), pool)!;
    stepCompanionTrail(s, pool, f(0, p(140)));
    for (let t = 1; t <= 30; t++) stepCompanionTrail(s, pool, f(t, p(140 + t, 160 - Math.max(0, 16 - t), false)));
    for (let t = 31; t < 90; t++) stepCompanionTrail(s, pool, f(t, p(500), { epoch: 1 }));
    expect(s.point).toEqual(p(140));
    expect(s.pose).toBe("stand");
    expect(s.status).toBe("waiting");
    expect(s.pending.length).toBe(0);
  });
  it("cannot join through a wall or over a gap, and refuses an unsafe spawn", () => {
    const wall = [...grid]; for (let r = 6; r < 10; r++) wall[r] = wall[r]!.slice(0, 5) + "#" + wall[r]!.slice(6);
    const s = createCompanionTrail("p2", p(72), wall)!;
    for (let t = 0; t < 100; t++) stepCompanionTrail(s, wall, f(t, p(104)));
    expect(s.point.x).toBeLessThan(80 * SUBS);
    expect(createCompanionTrail("p2", p(88), wall)).toBeNull();
    const gap = [...grid]; gap[10] = "#".repeat(5) + "...." + "#".repeat(51); gap[11] = gap[10]!;
    const q = createCompanionTrail("p2", p(72), gap)!;
    for (let t = 0; t < 100; t++) stepCompanionTrail(q, gap, f(t, p(152)));
    expect(q.point.x).toBe(72 * SUBS);
    expect(createCompanionTrail("p2", p(104), gap)).toBeNull();
  });
  it("starts a new phase only at an explicitly safe entry and keeps queues bounded", () => {
    const s = createCompanionTrail("p3", p(40), grid)!;
    for (let t = 0; t < 2000; t++) stepCompanionTrail(s, grid, f(t, p(400), { phaseId: "p3" }));
    expect(s.ready.length).toBeLessThanOrEqual(COMPANION_MAX_BUFFER);
    expect(s.pending.length).toBeLessThanOrEqual(COMPANION_MAX_BUFFER);
    expect(s.point).toEqual(p(40));
  });
  it("has valid real chapter entrances and identifies the actual Merle rescue floor", () => {
    const level = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url), "utf8")) as PaintLevel;
    for (const ph of [...level.phases.filter(x => x.id === "p3"), level.arena!]) {
      let start: CompanionPoint | undefined;
      ph.rows.forEach((row, r) => { const c = row.indexOf("S"); if (c >= 0) start = p((c + .5) * TILE, (r + 1) * TILE); });
      expect(start).toBeDefined();
      // Actual S can initially be above the floor: settle through the shared mover first.
      let player = spawnPlayer(start!.x / SUBS, start!.y / SUBS);
      for (let t = 0; t < 90 && !player.grounded; t++) player = stepPlayer(player, IDLE_PAD, IDLE_PAD, ph.rows, { canRun: true, canPunch: false, canHover: false, canHang: false, slippery: false }).st;
      expect(createCompanionTrail(ph.id, { x: player.x, y: player.y, grounded: player.grounded, dir: 1 }, ph.rows)).not.toBeNull();
    }
    const ph = level.phases.find(x => x.id === "p2")!;
    const merle = ph.entities.find(x => x.role === "classmate")!;
    expect(createCompanionTrail("p2", p((merle.c + .5) * TILE, (merle.r + 1) * TILE), ph.rows)).not.toBeNull();
  });
  it("follows actual p3 terrain using its recorded movement keys, including ramps and platforms", () => {
    const level = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url), "utf8")) as PaintLevel;
    const proof = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.proof.json", import.meta.url), "utf8"));
    const ph = level.phases.find(x => x.id === "p3")!;
    const r = ph.rows.findIndex(row => row.includes("S")), c = ph.rows[r]!.indexOf("S");
    let player = spawnPlayer((c + .5) * TILE, (r + 1) * TILE);
    let prev = { ...IDLE_PAD };
    let companion: ReturnType<typeof createCompanionTrail> = null;
    let firstX = 0, lastX = 0, jumps = 0;
    const masks = [...decodePads(proof.phases.p3.pads), ...Array.from({ length: 150 }, () => 0)];
    for (const [tick, mask] of masks.entries()) {
      const pad = maskToPad(mask);
      player = stepPlayer(player, pad, prev, ph.rows, { canRun: true, canPunch: false, canHover: false, canHang: false, slippery: false }).st;
      prev = pad;
      const point: CompanionPoint = { x: player.x, y: player.y, grounded: player.grounded, dir: player.facing };
      if (!companion && player.grounded) { companion = createCompanionTrail("p3", point, ph.rows); firstX = player.x; }
      if (!companion) continue;
      stepCompanionTrail(companion, ph.rows, f(tick, point, { phaseId: "p3" }));
      expect(companionPointSafe(ph.rows, companion.point)).toBe(true);
      if (companion.pose === "jump") jumps++;
      lastX = Math.max(lastX, companion.point.x);
    }
    expect(lastX - firstX).toBeGreaterThan(15 * TILE * SUBS);
    expect(jumps).toBeGreaterThan(0);
    expect(companion!.point.x).toBe(player.x);
    expect(companion!.point.y).toBe(player.y);
    expect(companion!.point.grounded).toBe(true);
  });
  it("entity integration moves only an opted-in redeemed classmate and freezes during holds", () => {
    const w = spawnEntities([{ id: "merle", role: "classmate", skin: "merle", c: 2, r: 9, tier: "E", params: {} }], []);
    const e = w.entities[0]!; e.redeemed = true;
    e.companion = createCompanionTrail("p2", { x: e.x, y: e.y, grounded: true, dir: 1 }, grid)!;
    for (let t = 0; t < 100; t++) expect(stepEntities(w, grid, { playerX: (40 + t) * SUBS, playerY: 160 * SUBS, playerIframes: 0, playerOverlayOpen: false, fist: null, companionLeader: f(t, p(40 + t)) })).toEqual([]);
    expect(e.x).toBeGreaterThan(80 * SUBS);
    expect(e.state).toBe("follow");
    const before = structuredClone(e);
    stepRedeemedOnly(w, grid);
    expect(e).toEqual(before);
  });
});
