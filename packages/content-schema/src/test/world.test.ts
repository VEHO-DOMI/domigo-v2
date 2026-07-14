import assert from "node:assert/strict";
import test from "node:test";
import { WorldDefinition } from "../index.ts";

const layer = (width: number, height: number, token = ".") => ({ rows: Array.from({ length: height }, () => token.repeat(width)), legend: {} });
const world = {
  schema: "world@1",
  id: "g1.world.test-school",
  storyId: "g1.st.lost-pages",
  zoneId: "g1.map.lost-pages.z01",
  grade: 1,
  entry: { areaId: "atrium", spawnId: "start" },
  assets: [{ id: "npc.finn", kind: "npc", width: 32, height: 32, recipe: { shape: "npc", base: "#31583f", accent: "#f3c969", shadow: "#173525" }, replacementPath: null }],
  areas: [
    { id: "atrium", title: { de: "Buchhalle", en: "Book Atrium" }, width: 5, height: 5, tileSize: 32, ambience: "book", layers: { ground: layer(5, 5), objects: layer(5, 5), collision: { rows: Array(5).fill("....."), blockedTokens: "#" }, foreground: layer(5, 5) }, spawns: [{ id: "start", position: { x: 2, y: 2 }, facing: "down" }], npcs: [{ id: "finn", assetId: "npc.finn", position: { x: 3, y: 2 }, moveWhenFlag: null, dialogue: [{ de: "Hallo!", en: "Hello!" }] }], interactables: [], variants: [] },
    { id: "classroom", title: { de: "Klasse", en: "Classroom" }, width: 5, height: 5, tileSize: 32, ambience: "school", layers: { ground: layer(5, 5), objects: layer(5, 5), collision: { rows: Array(5).fill("....."), blockedTokens: "#" }, foreground: layer(5, 5) }, spawns: [{ id: "door", position: { x: 2, y: 3 }, facing: "up" }], npcs: [], interactables: [], variants: [] },
  ],
  connections: [{ id: "atrium-classroom", from: { areaId: "atrium", position: { x: 2, y: 0 }, trigger: "edge" }, to: { areaId: "classroom", spawnId: "door" }, requiredFlag: null, lockedText: null }],
  encounters: [{ id: "pencil-help", taskRefs: ["g1u01.w.pencil"], completion: "all", requiresFlag: null, intro: [{ de: "Hilf!", en: "Help!" }], success: [{ de: "Danke!", en: "Thanks!" }], retry: [{ de: "Noch einmal.", en: "Try again." }], completionFlag: "pencil-found", effects: [{ kind: "set-flag", flag: "pencil-found" }], reward: { xp: 5, itemId: null, unlockId: null } }],
} as const;

test("world@1 validates connected typed layers and item references", () => {
  const parsed = WorldDefinition.parse(world);
  assert.equal(parsed.areas.length, 2);
  assert.equal(parsed.encounters[0]?.taskRefs[0], "g1u01.w.pencil");
});

test("world@1 rejects malformed grid widths", () => {
  const bad = structuredClone(world) as any;
  bad.areas[0].layers.collision.rows[0] = "....";
  assert.equal(WorldDefinition.safeParse(bad).success, false);
});

test("world@1 rejects unreachable areas and unknown encounter links", () => {
  const bad = structuredClone(world) as any;
  bad.areas.push({ ...bad.areas[1], id: "library" });
  bad.areas[0].interactables.push({ id: "bad-page", kind: "page", position: { x: 1, y: 1 }, assetId: null, prompt: { de: "Seite", en: "Page" }, dialogue: [], encounterId: "missing", connectionId: null, eventId: null, requiresFlag: null, hiddenUntilFlag: null, moveWhenFlag: null, assetWhenFlag: null, effects: [] });
  assert.equal(WorldDefinition.safeParse(bad).success, false);
});

test("world@1 rejects unknown fields, blocked spawns and collision-isolated exits", () => {
  const unknown = structuredClone(world) as any;
  unknown.unplanned = true;
  assert.equal(WorldDefinition.safeParse(unknown).success, false);

  const blockedSpawn = structuredClone(world) as any;
  blockedSpawn.areas[0].layers.collision.rows[2] = "..#..";
  assert.equal(WorldDefinition.safeParse(blockedSpawn).success, false);

  const isolatedExit = structuredClone(world) as any;
  isolatedExit.areas[0].layers.collision.rows[1] = "#####";
  assert.equal(WorldDefinition.safeParse(isolatedExit).success, false);
});

test("world@1 assigns each learning task to exactly one encounter", () => {
  const bad = structuredClone(world) as any;
  bad.encounters.push({ ...bad.encounters[0], id: "second-help", completionFlag: "second-found" });
  assert.equal(WorldDefinition.safeParse(bad).success, false);
});
