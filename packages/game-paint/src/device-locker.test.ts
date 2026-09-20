// CODEX DRAFT — NOT CANON. Paket A: passing is not an invitation to a card.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { Sim, type SimEvent } from "./sim.ts";
import type { PaintLevel } from "./level.ts";
import { IDLE_PAD } from "./player.ts";
import { SUBS, TILE } from "./paint.ts";
import { engageTargetId } from "./entities.ts";

const level = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url), "utf8")) as PaintLevel;
const make = (phaseId: string) => new Sim({ level, phaseId, grantedAbilities: () => ["jump", "run"], freedCageIds: () => [] });

describe("chapter-one device lockers", () => {
  it.each([["p1", "p1-cage1"], ["p2", "p2-cage-tablet"]])("%s stays quiet on approach; its local cue and deliberate rescue still work", (phaseId, id) => {
    const sim = make(phaseId!);
    const cage = sim.world.entities.find(e => e.id === id)!;
    sim.warp(cage.x / SUBS / TILE - 2, cage.y / SUBS / TILE - 1);
    const events: SimEvent[] = [];
    for (let t = 0; t < 10; t++) events.push(...sim.step({ ...IDLE_PAD, right: true }));
    expect(events.some(e => e.type === "cageHint" || e.type === "task")).toBe(false);
    expect(sim.overlayOpen).toBe(false);
    expect(sim.cageHintFired).toBe(false);
    expect(engageTargetId(sim.world, sim.player.x, sim.player.y)).toBe(id);
    const opened = sim.step({ ...IDLE_PAD, up: true });
    const task = opened.find(e => e.type === "task");
    expect(task?.type === "task" && task.req.ctx).toMatchObject({ type: "cage", id });
    if (task?.type !== "task") throw new Error("Missing deliberate locker task");
    const solved = sim.solveTask(task.req.ctx);
    expect(solved.some(e => e.type === "cageFreed" && e.id === id)).toBe(true);
    expect(cage.redeemed).toBe(true);
  });

  it("passing the tablet does not consume Merle's person-rescue hint", () => {
    const sim = make("p2");
    for (const id of ["p2-cage-tablet", "p2-cage-merle"]) {
      const cage = sim.world.entities.find(e => e.id === id)!;
      sim.warp(cage.x / SUBS / TILE - .5, cage.y / SUBS / TILE - 1);
      const events = sim.step(IDLE_PAD);
      expect(events.filter(e => e.type === "cageHint")).toEqual(id === "p2-cage-merle" ? [{ type: "cageHint", id }] : []);
    }
    expect(sim.overlayOpen).toBe(true);
  });
});
