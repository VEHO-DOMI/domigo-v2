import assert from "node:assert/strict";
import test from "node:test";
import type { WorldDefinition } from "@domigo/content-schema";
import { applyWorldEffects, emptyWorldState, projectWorldState, worldEncounterRewardKey, worldTaskRewardKey } from "../world.ts";

const world = {
  id: "g1.world.test",
  entry: { areaId: "a", spawnId: "start" },
  areas: [{
    id: "a",
    width: 5,
    height: 5,
    tileSize: 32,
    layers: {
      ground: { rows: Array(5).fill("....."), legend: {} },
      objects: { rows: Array(5).fill("....."), legend: {} },
      foreground: { rows: Array(5).fill("....."), legend: {} },
      collision: { rows: Array(5).fill("....."), blockedTokens: "#" },
    },
    spawns: [{ id: "start", position: { x: 1, y: 2 } }],
    interactables: [],
  }],
  connections: [{ id: "open", requiredFlag: null }, { id: "locked", requiredFlag: "ready" }],
  encounters: [{ id: "lesson", completionFlag: "ready", effects: [{ kind: "open-connection", connectionId: "locked" }, { kind: "set-area-variant", areaId: "a", variantId: "restored" }], reward: { xp: 5, itemId: "page", unlockId: "door" } }],
} as unknown as WorldDefinition;

test("empty state starts at the authored spawn and only opens ungated routes", () => {
  const state = emptyWorldState(world);
  assert.deepEqual(state.position, [48, 80]);
  assert.deepEqual(state.openedConnectionIds, ["open"]);
});

test("projector turns an immutable completion event into flags, routes and variants", () => {
  const state = projectWorldState(world, [
    { eventId: "task:lesson:pencil", eventType: "task-completed", sourceId: "g1u01.w.pencil", areaId: "a" },
    { eventId: "encounter:lesson", eventType: "encounter-completed", sourceId: "lesson", areaId: "a" },
  ], 15, null, 40);
  assert.equal(state.storyFlags.ready, true);
  assert.deepEqual(state.openedConnectionIds.sort(), ["locked", "open"]);
  assert.equal(state.mapVariants.a, "restored");
  assert.deepEqual(state.completedTaskIds, ["g1u01.w.pencil"]);
  assert.deepEqual(state.itemIds, ["page"]);
  assert.deepEqual(state.unlockIds, ["door"]);
  assert.equal(state.worldXp, 15);
  assert.equal(state.xp, 55);
});

test("effects and reward keys are idempotent by construction", () => {
  const once = applyWorldEffects(emptyWorldState(world), [{ kind: "open-connection", connectionId: "locked" }]);
  const twice = applyWorldEffects(once, [{ kind: "open-connection", connectionId: "locked" }]);
  assert.deepEqual(twice.openedConnectionIds, once.openedConnectionIds);
  assert.equal(worldTaskRewardKey(world.id, "g1u01.w.pencil"), worldTaskRewardKey(world.id, "g1u01.w.pencil"));
  assert.notEqual(worldTaskRewardKey(world.id, "g1u01.w.pencil"), worldEncounterRewardKey(world.id, "lesson"));
});

test("cached projections cannot forge flags, rewards or completion", () => {
  const state = projectWorldState(world, [], 0, {
    storyFlags: { ready: true },
    completedTaskIds: ["g1u01.w.pencil"],
    completedEncounterIds: ["lesson"],
    openedConnectionIds: ["locked"],
    itemIds: ["forged-item"],
    unlockIds: ["forged-unlock"],
    worldXp: 999,
    xp: 999,
  }, 7);
  assert.deepEqual(state.storyFlags, {});
  assert.deepEqual(state.completedTaskIds, []);
  assert.deepEqual(state.completedEncounterIds, []);
  assert.deepEqual(state.openedConnectionIds, ["open"]);
  assert.deepEqual(state.itemIds, []);
  assert.deepEqual(state.unlockIds, []);
  assert.equal(state.worldXp, 0);
  assert.equal(state.xp, 7);
});

test("invalid or collision-blocked saved positions fall back to an authored spawn", () => {
  const blockedWorld = structuredClone(world) as unknown as WorldDefinition;
  const area = blockedWorld.areas[0]!;
  area.width = 5;
  area.height = 5;
  area.layers = {
    ground: { rows: Array(5).fill("....."), legend: {} },
    objects: { rows: Array(5).fill("....."), legend: {} },
    foreground: { rows: Array(5).fill("....."), legend: {} },
    collision: { rows: [".....", ".#...", ".....", ".....", "....."], blockedTokens: "#" },
  };
  const blocked = projectWorldState(blockedWorld, [], 0, { position: [48, 48] });
  assert.deepEqual(blocked.position, [48, 80]);
  const outside = projectWorldState(blockedWorld, [], 0, { position: [999, 999] });
  assert.deepEqual(outside.position, [48, 80]);
});
