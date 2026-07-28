// PK-R3a · R3-11 — THE SPEAKER LAW (doc 41 §3), proven in the engine.
//
// Two halves, both of which Koki's Replay 2 asked for:
//  1. ENVIRONMENTAL HAZARDS NEVER ASK. Walking into spikes or an ink pool used
//     to freeze the world and float an English question from nobody. Contact is
//     now knockback (and, for ink, the checkpoint return) — no card, no freeze.
//  2. A CARD IS SERVED ONLY BY AN ASKER THE CHILD CAN SEE. A request raised for
//     an off-screen being WAITS; the world keeps running while it waits (the
//     freeze happens at delivery), so a parked card can never deadlock a
//     chapter the way the cage hint once did.
import { describe, expect, it } from "vitest";
import { Sim, type SimEvent } from "./sim.ts";
import { IDLE_PAD, type Pad } from "./player.ts";
import { type EntitySpec, type PaintLevel } from "./level.ts";
import { SUBS, TILE } from "./paint.ts";

const WIDE = 60; // wider than the 320 px view, so "off screen" is reachable

const row = (fill: string): string => fill.repeat(WIDE);
const put = (base: string, at: number, glyph: string): string =>
  base.slice(0, at) + glyph + base.slice(at + 1);

const level = (rows: string[], entities: EntitySpec[] = []): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "run", "punch"],
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

/** A flat corridor: closed top, a floor, the child on the left, the exit far
 *  right — long enough that the right end is genuinely off camera. */
const corridor = (over: (floorRow: string, airRow: string) => [string, string] = (f, a) => [f, a]): string[] => {
  let air = row(".");
  let floor = row("#");
  air = put(air, 3, "S");
  air = put(air, WIDE - 4, "X");
  [floor, air] = ((): [string, string] => { const [f, a] = over(floor, air); return [f, a]; })();
  return [row("#"), ...Array.from({ length: 16 }, () => row(".")), air, floor, floor];
};

const idle = (over: Partial<Pad> = {}): Pad => ({ ...IDLE_PAD, ...over });

/** Step until `stop` says so (or the budget runs out), collecting every event. */
const runUntil = (sim: Sim, pad: Pad, stop: (evs: SimEvent[]) => boolean, budget = 600): SimEvent[] => {
  const all: SimEvent[] = [];
  for (let i = 0; i < budget; i++) {
    const evs = sim.step(pad);
    all.push(...evs);
    if (stop(evs)) break;
  }
  return all;
};

describe("R3-11 · environmental hazards never ask", () => {
  it("spikes knock the child back and raise NO card", () => {
    // a spike strip two cells right of the spawn
    const rows = corridor((floor, air) => [floor, put(put(air, 6, "^"), 7, "^")]);
    const sim = new Sim({ level: level(rows), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    const evs = runUntil(sim, idle({ right: true }), (e) => e.some((x) => x.type === "toast"));

    expect(evs.some((e) => e.type === "toast" && e.msg === "Autsch!")).toBe(true);
    expect(evs.some((e) => e.type === "task")).toBe(false);
    expect(sim.overlayOpen).toBe(false); // the world was never frozen
    expect(sim.pendingAsk).toBe(null); // and nothing is waiting to ask, either
  });

  it("ink returns the child to the checkpoint ON CONTACT, not after a card", () => {
    const rows = corridor((floor, air) => [floor, put(put(air, 6, "w"), 7, "w")]);
    const sim = new Sim({ level: level(rows), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    const startC = sim.respawnCell!.c;
    const evs = runUntil(sim, idle({ right: true }), (e) => e.some((x) => x.type === "toast"));

    expect(evs.some((e) => e.type === "toast" && e.msg === "Platsch!")).toBe(true);
    expect(evs.some((e) => e.type === "task")).toBe(false);
    // back at the checkpoint the same tick the ink was touched
    expect(Math.floor(sim.player.x / SUBS / TILE)).toBe(startC);
  });
});

describe("R3-11 · a card is served only by an asker the child can see", () => {
  /** A swarm sitting on the player's cell: it raises an encounter at once. */
  const swarmAt = (c: number, r: number): EntitySpec => ({
    id: "sw1", role: "swarm", skin: "moths", c, r, tier: "E", params: {},
  });

  it("serves the card immediately when the asker is on screen", () => {
    const rows = corridor();
    const sim = new Sim({ level: level(rows, [swarmAt(4, 17)]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    const evs = runUntil(sim, idle({ right: true }), (e) => e.some((x) => x.type === "task"));

    const task = evs.find((e) => e.type === "task");
    expect(task).toBeDefined();
    expect(sim.overlayOpen).toBe(true);
  });

  // NOTE ON HOW THESE ARE DRIVEN. Every card-raising event in ch01 fires on
  // CONTACT, and the screen clamp (sim.step) boxes the player inside the view —
  // so a being touching the child is on screen by construction and the parking
  // branch is unreachable through contact alone. That is the point: the guard
  // is a WALL for the asker classes still to come (a distant console, a
  // scripted call-out), not a live branch today. So the guard predicate is
  // exercised directly, and the parking/delivery machinery through the real
  // `pendingAsk` the raise path writes.

  it("canServe: false while the asker is out of view, true once it is in", () => {
    const rows = corridor();
    const sim = new Sim({ level: level(rows, [swarmAt(4, 17)]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    const ctx = { type: "entity", id: "sw1", skin: "moths" } as const;

    expect(sim.canServe(ctx)).toBe(true); // spawn: swarm and child share the view
    sim.camX = (WIDE - 12) * TILE * SUBS; // look at the far end of the corridor
    expect(sim.onScreen("sw1")).toBe(false);
    expect(sim.canServe(ctx)).toBe(false);
    // a shell ceremony has no asker and is therefore always servable
    expect(sim.canServe({ type: "ceremony", beat: "grant" })).toBe(true);
  });

  /** A cage far down the corridor: static (it never walks into view on its
   *  own), so "the request waits" is the child's journey, not the being's. */
  const farCage: EntitySpec = { id: "cg1", role: "cage", skin: "ranzen", c: 40, r: 17, tier: "E", params: {} };
  const cageAsk = { use: "rescue", ctx: { type: "cage", id: "cg1", skin: "ranzen" } } as const;

  it("PARKS an out-of-view request — the world keeps running, nothing is served", () => {
    const sim = new Sim({ level: level(corridor(), [farCage]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    expect(sim.onScreen("cg1")).toBe(false);
    sim.pendingAsk = { ...cageAsk };

    const before = sim.tickCount;
    const evs = runUntil(sim, idle(), () => false, 60); // the child stands still

    expect(sim.pendingAsk).not.toBe(null); // still waiting
    expect(evs.some((x) => x.type === "task")).toBe(false); // nothing served
    expect(sim.overlayOpen).toBe(false); // NOT frozen — the world runs on
    expect(sim.tickCount).toBeGreaterThan(before);
  });

  it("serves the parked request the moment the asker comes into view", () => {
    const sim = new Sim({ level: level(corridor(), [farCage]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    sim.pendingAsk = { ...cageAsk };
    runUntil(sim, idle(), () => false, 20);
    expect(sim.pendingAsk).not.toBe(null);

    // the child walks down the corridor until the cage is in the view
    const evs = runUntil(sim, idle({ right: true }), (x) => x.some((y) => y.type === "task"), 1200);

    expect(evs.some((x) => x.type === "task")).toBe(true);
    expect(sim.onScreen("cg1")).toBe(true); // served BECAUSE it is visible
    expect(sim.pendingAsk).toBe(null);
    expect(sim.overlayOpen).toBe(true); // NOW the world holds its breath
  });

  it("drops a parked request whose asker has left the phase", () => {
    const sim = new Sim({ level: level(corridor(), [farCage]), phaseId: "p1", grantedAbilities: () => [], freedCageIds: () => [] });
    sim.pendingAsk = { ...cageAsk };
    sim.world.entities = sim.world.entities.filter((x) => x.id !== "cg1");

    const evs = runUntil(sim, idle(), () => false, 5);

    expect(sim.pendingAsk).toBe(null);
    expect(evs.some((x) => x.type === "task")).toBe(false);
    expect(sim.overlayOpen).toBe(false);
  });
});
