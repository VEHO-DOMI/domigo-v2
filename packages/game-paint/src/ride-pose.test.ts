// R5-A1 (doc 45) · THE RIDE POSE — standing on a moving platform must read as
// standing. moveBody sees only the grid, so every ridden tick clears
// `grounded` before the ride block re-grounds it; the pose bridges that gap
// through the coyote window (player.ts), and attaching counts as a landing
// (sim.ts) so a jump-attach feeds that window too — the grid landing never
// fires on a mover, and jumpTicks would otherwise stay >= 0 for the whole ride.
import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { type EntitySpec, type PaintLevel } from "./level.ts";
import { SUBS } from "./paint.ts";

const W = 40;
const row = (fill: string): string => fill.repeat(W);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

const level = (rows: string[], entities: EntitySpec[]): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "run"],
  phases: [{
    id: "p1",
    nameDe: "Test",
    surface: "normal",
    plates: {},
    rows,
    entities,
    links: [],
    exit: { to: "done" },
  }],
});

const pad = (p: Partial<Pad>): Pad => ({ ...IDLE_PAD, ...p });

const platform = (over: Partial<EntitySpec>): EntitySpec => ({
  id: "ride1", role: "platform.move", skin: "ruler", c: 10, r: 14, tier: "E",
  params: { dxTiles: 4, periodTicks: 400 },
  ...over,
});

const feetOn = (sim: Sim): boolean => {
  const e = sim.world.entities.find((x) => x.id === "ride1")!;
  return sim.player.y === e.y - 6 * SUBS;
};

describe("R5-A1 · the ride pose", () => {
  it("falling onto a slow mover and riding it reads as standing, not falling", () => {
    // S high over the platform, no other floor near — the child falls, attaches,
    // rides. Far below: a safety floor that failing attach would land on.
    const rows = [
      row("#"),
      ...Array.from({ length: 3 }, () => row(".")),
      put(row("."), 10, "S"),
      ...Array.from({ length: 17 }, () => row(".")),
      row("#"),
    ];
    const sim = new Sim({ level: level(rows, [platform({ c: 10, r: 14 })]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    for (let t = 0; t < 90 && !feetOn(sim); t++) sim.step(IDLE_PAD);
    expect(feetOn(sim), "the fall must end on the mover, not the safety floor").toBe(true);

    const poses = new Set<string>();
    for (let t = 0; t < 200; t++) {
      sim.step(IDLE_PAD);
      if (!feetOn(sim)) break;
      poses.add(sim.player.pose);
    }
    expect(feetOn(sim), "still riding after 200 ticks").toBe(true);
    expect([...poses]).toEqual(["stand"]);
  });

  it("a jump-attach counts as a landing: jumpTicks resets and the pose reads ground", () => {
    // A ledge (c0–7) with the child near its lip; a STATIONARY mover
    // (dxTiles 0) at the same height across a 2-cell gap. One held jump+right
    // arcs onto it deterministically.
    const rows = [
      row("#"),
      ...Array.from({ length: 13 }, () => row(".")),
      put(row("."), 6, "S"),
      ...Array.from({ length: 3 }, () => row(".")),
      "########".padEnd(W, "."),
      ...Array.from({ length: 3 }, () => row(".")),
      row("#"),
    ];
    const sim = new Sim({ level: level(rows, [platform({ c: 11, r: 18, params: { dxTiles: 0, periodTicks: 400 } })]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    for (let t = 0; t < 60 && !sim.player.grounded; t++) sim.step(IDLE_PAD); // settle on the ledge
    expect(sim.player.grounded).toBe(true);

    // a TAP jump (3 held ticks, apex ~50px) arcs exactly into the ±20px
    // attach window around the mover's centre — a full hold overflies it
    let jumpedAt = -1;
    for (let t = 0; t < 160 && !feetOn(sim); t++) {
      if (jumpedAt < 0 && sim.player.x / SUBS >= 100) jumpedAt = t;
      sim.step(pad({ right: true, jump: jumpedAt >= 0 && t - jumpedAt < 3 }));
    }
    expect(feetOn(sim), "the arc must land on the mover").toBe(true);
    expect(sim.player.jumpTicks).toBe(-1); // the attach IS a landing

    const poses = new Set<string>();
    for (let t = 0; t < 120; t++) {
      sim.step(IDLE_PAD);
      if (!feetOn(sim)) break;
      poses.add(sim.player.pose);
    }
    expect(feetOn(sim), "still riding after 120 ticks").toBe(true);
    expect(poses.has("fall"), "riding never draws the fall pose").toBe(false);
    expect(poses.has("jump")).toBe(false);
  });
});
