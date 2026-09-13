// CODEX DRAFT — NOT CANON
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NUMBER_SWARM_BOUNDS, isNumberSwarm, numberSwarmLayout } from "./number-swarm.ts";
import { Sim } from "../sim.ts";
import { IDLE_PAD } from "../player.ts";
import { fromSubs } from "../paint.ts";
import type { PaintLevel } from "../level.ts";

const frame = { runSeed: "first-start", entityId: "p1-swarm-1", tick: 120, reducedMotion: false };
const values = (seed: string, entityId = frame.entityId) => numberSwarmLayout({ ...frame, runSeed: seed, entityId }).map(g => g.value);

describe("the first chapter's flying numbers", () => {
  it("limits the replacement to the intended chapter, role and skin", () => {
    expect(isNumberSwarm("ch01", { role: "swarm", skin: "moths" })).toBe(true);
    for (const [chapter, role, skin] of [["ch02", "swarm", "moths"], ["ch01", "drained", "moths"], ["ch01", "swarm", "bees"]])
      expect(isNumberSwarm(chapter!, { role: role!, skin: skin! })).toBe(false);
  });

  it("keeps six distinct, equally sized numbers in the taught 1–25 range", () => {
    for (let run = 0; run < 100; run++) {
      const glyphs = numberSwarmLayout({ ...frame, runSeed: String(run) });
      expect(glyphs).toHaveLength(6);
      expect(new Set(glyphs.map(g => g.value)).size).toBe(6);
      expect(new Set(glyphs.map(g => g.height)).size).toBe(1);
      for (const glyph of glyphs) {
        expect(glyph.value).toBeGreaterThanOrEqual(1);
        expect(glyph.value).toBeLessThanOrEqual(25);
        expect(glyph.text).toBe(String(glyph.value));
      }
    }
  });

  it("changes across level starts and encounter identities, never on retries or unrelated renders", () => {
    const first = numberSwarmLayout(frame);
    numberSwarmLayout({ ...frame, entityId: "another-encounter", tick: 840 });
    numberSwarmLayout({ ...frame, runSeed: "another-start" });
    expect(numberSwarmLayout(frame)).toEqual(first);
    expect(values("first-start")).not.toEqual(values("second-start"));
    expect(values("first-start")).not.toEqual(values("first-start", "p1-swarm-2"));
    expect(numberSwarmLayout({ ...frame, tick: 700 }).map(g => g.value)).toEqual(first.map(g => g.value));
  });

  it("removes all internal motion in reduced-motion mode", () => {
    const quiet = { ...frame, reducedMotion: true };
    expect(numberSwarmLayout({ ...quiet, tick: 0 })).toEqual(numberSwarmLayout({ ...quiet, tick: 60000 }));
    expect(numberSwarmLayout(frame)).not.toEqual(numberSwarmLayout({ ...frame, tick: 121 }));
  });

  it("keeps rotated one- and two-digit canvases inside one 40-pixel group during drift", () => {
    const b = NUMBER_SWARM_BOUNDS;
    for (let run = 0; run < 20; run++) for (let tick = 0; tick < 2000; tick += 47) {
      for (const g of numberSwarmLayout({ ...frame, runSeed: String(run), tick })) {
        const w = g.height * (g.text.length > 1 ? 1.5 : 1);
        const halfW = (Math.abs(Math.cos(g.rotation)) * w + Math.abs(Math.sin(g.rotation)) * g.height) / 2;
        const halfH = (Math.abs(Math.sin(g.rotation)) * w + Math.abs(Math.cos(g.rotation)) * g.height) / 2;
        expect(g.x - halfW).toBeGreaterThanOrEqual(b.x);
        expect(g.x + halfW).toBeLessThanOrEqual(b.x + b.width);
        expect(g.y - halfH).toBeGreaterThanOrEqual(b.y);
        expect(g.y + halfH).toBeLessThanOrEqual(b.y + b.height);
      }
    }
  });

  it("freezes the whole swarm during a real Sim overlay and resumes afterward", () => {
    const level = JSON.parse(readFileSync(new URL("../../../../content/corpus/stories/g1.st.lost-pages/paint/ch01.level.json", import.meta.url), "utf8")) as PaintLevel;
    const phase = level.phases.find(p => p.entities.some(e => isNumberSwarm(level.chapter, e)))!;
    const sim = new Sim({ level, phaseId: phase.id, grantedAbilities: () => ["jump", "run"], freedCageIds: () => [] });
    const entity = sim.world.entities.find(e => isNumberSwarm(level.chapter, e))!;
    const positions = () => numberSwarmLayout({ ...frame, entityId: entity.id, tick: sim.tickCount })
      .map(g => ({ ...g, x: fromSubs(entity.x) + g.x, y: fromSubs(entity.y) + g.y }));
    sim.step(IDLE_PAD);
    sim.setOverlay(true);
    const before = positions(), tick = sim.tickCount;
    for (let i = 0; i < 120; i++) sim.step(IDLE_PAD);
    expect(sim.tickCount).toBe(tick);
    expect(positions()).toEqual(before);
    sim.setOverlay(false);
    sim.step(IDLE_PAD);
    expect(sim.tickCount).toBeGreaterThan(tick);
    expect(positions()).not.toEqual(before);
  });
});
