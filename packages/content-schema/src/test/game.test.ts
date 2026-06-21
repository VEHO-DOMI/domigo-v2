import assert from "node:assert/strict";
import { test } from "node:test";
import { Encounter, GameMap, Quest } from "../index.ts";

function red(result: { success: boolean }, msg: string): void {
  assert.equal(result.success, false, msg);
}

// ---------------------------------------------------------------------------
// encounter@1
// ---------------------------------------------------------------------------

function encounter(over: Record<string, unknown> = {}) {
  return {
    schema: "encounter@1",
    id: "g1.enc.classroom-spawns",
    grade: 1,
    source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 5 },
    formatAllow: null,
    fallback: "scope-random",
    ...over,
  };
}

test("encounter@1 round-trips (due + scope-random, unit + grade scope)", () => {
  for (const e of [
    encounter(),
    encounter({ source: { kind: "scope-random", scope: { kind: "grade", grade: 1 }, count: 3 } }),
    encounter({ formatAllow: ["multiple-choice", "gap-fill", "anagram"] }),
  ]) {
    const parsed = Encounter.parse(e);
    assert.deepEqual(Encounter.parse(JSON.parse(JSON.stringify(parsed))), parsed);
  }
});

test("KEYSTONE (G0.1): an encounter is a scope recipe, never embedded item content", () => {
  // The source is a recipe (scope + count) the runtime resolves via getDueRefs —
  // there is no place to author a prompt/answers/distractors. Extra item-content
  // keys are stripped by the non-strict object, never persisted into the contract.
  const parsed = Encounter.parse(
    encounter({ prompt: { text: "leak" }, answers: [{ text: "x", tier: "full" }], distractors: ["y"] }),
  );
  assert.ok(!("prompt" in parsed) && !("answers" in parsed) && !("distractors" in parsed));
  assert.equal(parsed.source.scope.kind, "unit");
});

test("encounter@1 red cases", () => {
  red(Encounter.safeParse(encounter({ grade: 2 })), "id grade prefix mismatch");
  red(
    Encounter.safeParse(encounter({ source: { kind: "due", scope: { kind: "grade", grade: 2 }, count: 5 } })),
    "cross-grade grade scope",
  );
  red(
    Encounter.safeParse(encounter({ source: { kind: "due", scope: { kind: "unit", slug: "g2-u01" }, count: 5 } })),
    "cross-grade unit scope",
  );
  red(Encounter.safeParse(encounter({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 0 } })), "count < 1");
  red(Encounter.safeParse(encounter({ formatAllow: [] })), "empty formatAllow");
  red(Encounter.safeParse(encounter({ formatAllow: ["not-a-format"] })), "bad format");
  red(Encounter.safeParse(encounter({ fallback: "something-else" })), "fallback must be scope-random");
  red(Encounter.safeParse(encounter({ id: "g1.encounter.x" })), "malformed encounter id");
});

// ---------------------------------------------------------------------------
// map@1
// ---------------------------------------------------------------------------

function zone(over: Record<string, unknown> = {}) {
  return {
    id: "g1.map.lost-pages.z01",
    unit: 1,
    titleEn: "Time for School",
    titleDe: "Zeit für die Schule",
    width: 20,
    height: 15,
    tileSize: 16,
    render: null,
    ...over,
  };
}

function gameMap(over: Record<string, unknown> = {}) {
  return { schema: "map@1", id: "g1.map.lost-pages", grade: 1, zones: [zone()], ...over };
}

test("map@1 round-trips (render null + render blob)", () => {
  const m = gameMap({
    zones: [zone(), zone({ id: "g1.map.lost-pages.z02", unit: 2, render: { generator: "school-tileset", seed: 42 } })],
  });
  const parsed = GameMap.parse(m);
  assert.deepEqual(GameMap.parse(JSON.parse(JSON.stringify(parsed))), parsed);
});

test("map@1 red cases", () => {
  red(GameMap.safeParse(gameMap({ grade: 2 })), "map id grade prefix mismatch");
  red(GameMap.safeParse(gameMap({ zones: [zone({ id: "g1.map.other.z01" })] })), "zone id outside map");
  red(GameMap.safeParse(gameMap({ zones: [zone(), zone()] })), "duplicate zone id");
  red(GameMap.safeParse(gameMap({ zones: [zone({ unit: 16 })] })), "unit out of range");
  red(GameMap.safeParse(gameMap({ zones: [zone({ tileSize: 0 })] })), "tileSize < 1");
  red(GameMap.safeParse(gameMap({ zones: [] })), "no zones");
});

// ---------------------------------------------------------------------------
// quest@1
// ---------------------------------------------------------------------------

function quest(over: Record<string, unknown> = {}) {
  return {
    schema: "quest@1",
    id: "g1.q.lost-pages-ch01",
    zoneId: "g1.map.lost-pages.z01",
    clear: { kind: "story-chapter", chapterId: "g1.st.lost-pages.ch01" },
    ...over,
  };
}

test("quest@1 round-trips (all three clear kinds)", () => {
  for (const q of [
    quest(),
    quest({ clear: { kind: "encounters-cleared", encounterIds: ["g1.enc.classroom-spawns"], minTier: "correct" } }),
    quest({ clear: { kind: "due-drained", scope: { kind: "unit", slug: "g1-u01" } } }),
  ]) {
    const parsed = Quest.parse(q);
    assert.deepEqual(Quest.parse(JSON.parse(JSON.stringify(parsed))), parsed);
  }
});

test("quest@1 red cases", () => {
  red(Quest.safeParse(quest({ zoneId: "g2.map.lost-pages.z01" })), "zone grade != quest grade");
  red(
    Quest.safeParse(quest({ clear: { kind: "story-chapter", chapterId: "g2.st.lost-pages.ch01" } })),
    "chapter grade != quest grade",
  );
  red(
    Quest.safeParse(
      quest({ clear: { kind: "encounters-cleared", encounterIds: ["g2.enc.x"], minTier: "correct" } }),
    ),
    "encounter grade != quest grade",
  );
  red(
    Quest.safeParse(quest({ clear: { kind: "encounters-cleared", encounterIds: [], minTier: "correct" } })),
    "no encounter ids",
  );
  red(
    Quest.safeParse(quest({ clear: { kind: "encounters-cleared", encounterIds: ["g1.enc.x"], minTier: "perfect" } })),
    "bad minTier",
  );
  red(Quest.safeParse(quest({ id: "g1.quest.x" })), "malformed quest id");
});
