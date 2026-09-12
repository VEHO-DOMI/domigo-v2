import { readZooJson } from "./test-fixtures/zoo/read-fixture.ts";
// CODEX DRAFT — NOT CANON
import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { ZOO_CELLS, ZOO_HERO_STEMS, zooSkinStems, zooEntityCell, zooStageCell, collectCell, collectStems, effectiveCollectSkin, bubblePopAlive, zooHeroCell } from "./zoo-visuals.ts";
import { phaseRequiredStems, phaseArtScope } from "./artScope.ts";
import { sceneDrawItems, createSceneState, beginSceneBeat, snapshotScene } from "./scene-v2.ts";
import { rigPose, withFistAway, withZooAction } from "./rig.ts";
import { entPoseCell, entDisplayH } from "./anim.ts";
import { spawnEntities, stepEntities, type WorldInput } from "./entities.ts";
import { SUBS, TILE } from "./paint.ts";
import type { PaintLevel } from "./level.ts";
import { PaintArtLevel, PaintArtPhase, PaintArtParams } from "../../content-schema/src/paint-art.ts";
const read = (ch: string): PaintLevel => JSON.parse(fs.readFileSync(new URL(`../../../content/corpus/stories/g1.st.lost-pages/paint/${ch}.level.json`, import.meta.url), "utf8"));
const level = readZooJson("ch02.level.json") as PaintLevel;
const input = (x: number, y: number): WorldInput => ({ playerX: x, playerY: y, playerIframes: 0, playerOverlayOpen: false, fist: null });
describe("M-5 opt-in art is a complete runtime contract", () => {
  it("keeps bonus bubbles, inherits missing room skins, and uses 18-tick cells plus six real-event pop ticks", () => {
    const p = level.bonus!;
    const skin = effectiveCollectSkin(level, p);
    expect(skin).toBe("bubble");
    expect(effectiveCollectSkin(level, {})).toBe("feather");
    expect([0, 17, 18, 35, 36].map(t => collectCell(skin, p.collectAnimation, t))).toEqual(["collect_bubble_a", "collect_bubble_a", "collect_bubble_b", "collect_bubble_b", "collect_bubble_a"]);
    expect(Array.from({ length: 8 }, (_, i) => bubblePopAlive(100, 99 + i))).toEqual([false, true, true, true, true, true, true, false]);
    const scope = phaseArtScope(level, p.id, []), required = phaseRequiredStems(level, p.id);
    for (const stem of collectStems(skin, p.collectAnimation)) {
      expect(scope.has(stem)).toBe(true);
      expect(required.has(stem)).toBe(true);
    }
    // Tamper: a feather sheet in the aquarium cannot satisfy the real requirement.
    const wrong = new Set(collectStems("feather", "zoo-v2"));
    expect(collectStems(skin, p.collectAnimation).filter(s => !wrong.has(s))).toHaveLength(3);
  });
  it("retains every art field through JSON and Zod, and rejects invalid opt-ins", () => {
    const objects = [{ schema: PaintArtLevel, value: { collectSkin: "feather", heroArtSet: "zoo-v2" } }, { schema: PaintArtPhase, value: { collectSkin: "bubble", collectAnimation: "zoo-v2" } }, { schema: PaintArtParams, value: { artSet: "zoo-v2", gunnerAim: "lock-on-telegraph", projectileSkin: "ticket" } }];
    for (const { schema, value } of objects)
      expect(schema.parse(JSON.parse(JSON.stringify(value)))).toEqual(value);
    expect(PaintArtParams.safeParse({ gunnerAim: "follow-player" }).success).toBe(false);
  });
  it("pins throw direction at warning entry, while the old gunner still follows at release", () => {
    const def = level.phases[1]!.entities.find(e => e.role === "gunner")!;
    for (const locked of [true, false]) {
      const d = structuredClone(def);
      delete d.params!.taskSequenceV2;
      if (!locked)
        delete d.params!.gunnerAim;
      const world = spawnEntities([d], []), e = world.entities[0]!;
      e.timer = 999;
      stepEntities(world, level.phases[1]!.rows, input(e.x + 40 * SUBS, e.y));
      expect(e.state).toBe("telegraph");
      if (locked)
        expect(e.dir).toBe(1);
      // Tamper movement crosses the monkey during the actual 30-tick warning.
      for (let i = 0; i < 31; i++)
        stepEntities(world, level.phases[1]!.rows, input(e.x - 40 * SUBS, e.y));
      const projectile = world.projectiles[0]!;
      expect(projectile.skin).toBe("ticket");
      expect(Math.sign(projectile.vx)).toBe(locked ? 1 : -1);
      expect(e.projectileReleaseTick).toBe(0);
      expect(zooEntityCell(e)).toBe("throw0");
    }
  });
  it("keeps both bus observers safe from real ticket trajectories in either announced direction", () => {
    const phase = level.phases[1]!, original = phase.entities.find(e => e.role === "gunner")!;
    const observers = phase.entities.find(e => e.skin === "bus_buehne")!.params!.stageV2!.groups.map(g => g.observer);
    for (const observer of observers)
      for (const direction of [-1, 1]) {
        const d = structuredClone(original);
        delete d.params!.taskSequenceV2;
        const world = spawnEntities([d], []), e = world.entities[0]!;
        e.state = "telegraph";
        e.timer = 30;
        e.dir = direction as -1 | 1;
        const inp = input((observer.c + .5) * TILE * SUBS, (observer.r + 1) * TILE * SUBS);
        let hits = 0;
        let flew = false;
        for (let tick = 0; tick < 180; tick++) {
          const ev = stepEntities(world, phase.rows, inp);
          flew ||= world.projectiles.length > 0;
          hits += ev.filter(e => e.type === "encounter").length;
        }
        expect(flew).toBe(true);
        expect(hits, `${observer.c},${observer.r} direction ${direction}`).toBe(0);
      }
  });
  it("all opted-in families require their full used cell set, and one missing cell in each family fails the art inventory", () => {
    const phase = level.phases[0]!;
    for (const [skin, cells] of Object.entries(ZOO_CELLS)) {
      const fixture = { ...level, phases: [{ ...phase, entities: [{ id: "probe", role: skin === "fenn" ? "classmate" : "chaser", skin, params: { artSet: "zoo-v2" } }] }], arena: undefined, bonus: undefined };
      const required = phaseRequiredStems(fixture, phase.id), present = new Set(required.keys());
      for (const cell of cells)
        expect(required.has(`${skin}_${cell}`)).toBe(true);
      const removed = zooSkinStems(skin).at(-1)!;
      present.delete(removed);
      expect([...required.keys()].filter(s => !present.has(s))).toEqual([removed]);
    }
    const fenn = { skin: "fenn", role: "classmate", state: "roam", timer: 27, redeemed: true, vy: 0, vx: 0, x: 0, homeX: 0, params: { artSet: "zoo-v2" } };
    expect(entPoseCell(fenn)).toBe("walk3");
    expect(zooStageCell("giraffe", "moving", 36)).toBe("walk3");
    expect(zooStageCell("frosch", "moving", 9)).toBe("hop1");
    expect(zooEntityCell({ skin: "affe", role: "gunner", state: "rest", timer: 100, redeemed: true, vy: 0 })).toBe("rest");
    expect(entDisplayH(level.arena!.entities[0]!)).toBe(64);
  });
  it("the scene and frozen card use registered mask rectangles and explicit actor occlusion", () => {
    const entity = level.phases[0]!.entities.find(e => e.params?.stageV2)!;
    const spec = entity.params!.stageV2!, state = createSceneState(spec);
    beginSceneBeat(state, spec.beats[0]!);
    const snap = snapshotScene(entity.id, entity.c * TILE * SUBS, entity.r * TILE * SUBS, state, spec);
    const items = sceneDrawItems(snap), masks = items.filter(i => i.id.startsWith("car:"));
    expect(masks.map(m => m.stem).sort()).toEqual(["auto_base", "auto_front", "auto_interior"]);
    expect(new Set(masks.map(m => JSON.stringify([m.x, m.y, m.w, m.h]))).size).toBe(1);
    const scope = phaseRequiredStems(level, "p1");
    for (const mask of masks)
      expect(scope.has(mask.stem)).toBe(true);
    const tampered = structuredClone(masks);
    tampered[1]!.x += 4;
    expect(new Set(tampered.map(m => JSON.stringify([m.x, m.y, m.w, m.h]))).size).toBe(2);
  });
  it("keeps the fist attached throughout charging, absent during a long run/jump flight, and catches only on its event", () => {
    expect(zooHeroCell({ pose: "charge", charge: 42 }, 10, false, {})).toBe("hero2_charge2");
    for (const pose of ["run", "jump"] as const) {
      const parts = rigPose({ pose, walkTime: 30, tick: 50, vxSubs: 256, vySubs: -256, charge: 0, landedAgo: 99, jumpedAgo: 30 });
      expect(withFistAway(withZooAction(parts, null)).handF.hidden).toBe(true);
      expect(withZooAction(parts, "hero2_charge2").handF.hidden).not.toBe(true);
    }
    const clock = { throwAt: 10 };
    expect(zooHeroCell({ pose: "run", charge: 0 }, 10, true, clock)).toBe("hero2_throw0");
    expect(zooHeroCell({ pose: "jump", charge: 0 }, 13, true, clock)).toBe("hero2_throw1");
    for (let tick = 16; tick < 90; tick++)
      for (const pose of ["run", "jump", "fall"])
        expect(zooHeroCell({ pose, charge: 0 }, tick, true, clock)).toBeNull();
    expect(zooHeroCell({ pose: "stand", charge: 0 }, 90, false, clock)).toBeUndefined();
    expect(zooHeroCell({ pose: "stand", charge: 0 }, 90, false, { ...clock, catchAt: 90 })).toBe("hero2_catch0");
    expect(zooHeroCell({ pose: "hang", charge: 0 }, 11, false, { grabAt: 10 })).toBe("hero2_grab");
    expect(zooHeroCell({ pose: "fall", charge: 0 }, 20, false, { releaseAt: 20 })).toBe("hero2_release");
    const old = read("ch01");
    const scope = phaseArtScope(old, "p1", ZOO_HERO_STEMS);
    for (const stem of ZOO_HERO_STEMS)
      expect(scope.has(stem)).toBe(false);
  });
});
