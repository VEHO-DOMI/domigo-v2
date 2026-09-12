// CODEX DRAFT — NOT CANON
import { describe, expect, it } from "vitest";
import { Sim } from "./sim.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import type { PaintLevel } from "./level.ts";
import { ZooRide } from "../../content-schema/src/paint-zoo.ts";

const ride = { mode: "shuttle" as const, from: { c: 8, r: 11 }, to: { c: 18, r: 11 }, speedPxPerTick: 1.5, deckWidthPx: 40 as const, dwellTicks: 60, startOnBoard: true as const, requiredForExit: true, requires: [] };
const level: PaintLevel = {
  schema: "paintLevel@1", id: "test", chapter: "ch99", draft: true, name: "Test", goalDe: "x", whyDe: "x", hintsDe: [], collectNounDe: "x", abilities: ["jump"],
  phases: [{ id: "p1", nameDe: "Test", surface: "normal", plates: {}, rows: ["#".repeat(30), ...Array.from({length:10},(_,i)=> i===5 ? "..S..........................." : ".".repeat(30)), ".........................X....", "#".repeat(30), "#".repeat(30)],
    entities: [{ id: "train", role: "platform.move", skin: "zoozug", c: 8, r: 11, tier: "E", params: { ride } }], links: [], exit: { to: "done" }, exitRequires: { rides: ["train"] } }],
};
const make = () => new Sim({ level: structuredClone(level), phaseId: "p1", grantedAbilities: () => ["jump"], freedCageIds: () => [] });
const board = (sim: Sim) => {
  sim.warp(8, 8);
  for (let i = 0; i < 100 && sim.ridingId === null; i++) sim.step(IDLE_PAD);
  expect(sim.ridingId).toBe("train");
};

describe("M-4 zoo shuttle", () => {
  it("waits at the start, freezes with a card, completes only at the target, and waits for disembarkation", () => {
    const sim = make(), train = sim.world.entities[0]!;
    for (let i=0; i<300; i++) sim.step(IDLE_PAD);
    expect(train.x).toBe(8.5*TILE*SUBS); expect(sim.completedRides.size).toBe(0);
    board(sim); const start = train.x;
    sim.setOverlay(true); for (let i=0; i<200; i++) sim.step(IDLE_PAD);
    expect(train.x).toBe(start); sim.setOverlay(false);
    let completions = 0;
    for (let i=0; i<200; i++) completions += sim.step(IDLE_PAD).filter(e=>e.type==="rideCompletion").length;
    expect(completions).toBe(1); expect(train.x).toBe(18.5*TILE*SUBS); expect(train.state).toBe("shuttle-target");
    for (let i=0; i<150; i++) sim.step(IDLE_PAD);
    expect(train.state).toBe("shuttle-target");
    sim.warp(24, 11); sim.step(IDLE_PAD);
    expect(train.state).toBe("shuttle-dwell");
    for (let i=0; i<59; i++) sim.step(IDLE_PAD);
    expect(train.state).toBe("shuttle-dwell"); sim.step(IDLE_PAD); expect(train.state).toBe("shuttle-back");
  });
  it("an early jump and ink-style warp invalidate the journey; the empty cart returns and a fresh boarding succeeds", () => {
    const sim = make(), train = sim.world.entities[0]!;
    board(sim); for (let i=0; i<20; i++) sim.step(IDLE_PAD);
    sim.step({...IDLE_PAD,jump:true}); expect(train.shuttle?.valid).toBe(false);
    sim.warp(2, 11); expect(sim.ridingId).toBe(null);
    for (let i=0; i<340; i++) sim.step(IDLE_PAD);
    expect(sim.completedRides.size).toBe(0); expect(train.state).toBe("shuttle-wait");
    expect(train.x).toBe(8.5*TILE*SUBS);
    board(sim); for (let i=0; i<130; i++) sim.step(IDLE_PAD);
    expect(sim.completedRides.has("train")).toBe(true);
  });
  it("tamper: target contact and reboarding an abandoned outbound journey cannot earn a ride", () => {
    const sim = make(), train = sim.world.entities[0]!;
    sim.warp(25,11);
    for (let i=0;i<30;i++) expect(sim.step(IDLE_PAD).some(e=>e.type==="exit")).toBe(false);
    board(sim); for(let i=0;i<30;i++) sim.step(IDLE_PAD);
    const c = train.x/SUBS/TILE-.5;
    sim.warp(c,10); // detach and land back on the still moving cart
    for(let i=0;i<250;i++) sim.step(IDLE_PAD);
    expect(sim.completedRides.size).toBe(0);
  });
  it("roundtrips the ride and rejects a fake deck width or zero route", () => {
    expect(ZooRide.parse(ride)).toEqual(ride);
    expect(ZooRide.safeParse({...ride,deckWidthPx:200}).success).toBe(false);
    expect(ZooRide.safeParse({...ride,to:ride.from}).success).toBe(false);
  });
});
