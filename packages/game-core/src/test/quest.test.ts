import assert from "node:assert/strict";
import { test } from "node:test";
import { Quest } from "@domigo/content-schema";
import { isZoneCleared, tierAtLeast, type ClearState } from "../index.ts";

function quest(clear: unknown) {
  return Quest.parse({ schema: "quest@1", id: "g1.q.lost-pages-ch01", zoneId: "g1.map.lost-pages.z01", clear });
}

const emptyState: ClearState = { encounterBestTier: {}, dueCountInScope: 0, chapterCompleted: false };

test("tierAtLeast ranks correct > partial > close > wrong", () => {
  assert.ok(tierAtLeast("correct", "partial"));
  assert.ok(tierAtLeast("partial", "partial"));
  assert.ok(!tierAtLeast("close", "partial"));
  assert.ok(!tierAtLeast("wrong", "close"));
  assert.ok(tierAtLeast("correct", "wrong"));
});

test("encounters-cleared: all listed encounters must meet minTier", () => {
  const q = quest({ kind: "encounters-cleared", encounterIds: ["g1.enc.a", "g1.enc.b"], minTier: "partial" });
  assert.ok(!isZoneCleared(q, { ...emptyState, encounterBestTier: { "g1.enc.a": "correct" } }), "b missing");
  assert.ok(!isZoneCleared(q, { ...emptyState, encounterBestTier: { "g1.enc.a": "correct", "g1.enc.b": "close" } }), "b below bar");
  assert.ok(isZoneCleared(q, { ...emptyState, encounterBestTier: { "g1.enc.a": "correct", "g1.enc.b": "partial" } }), "both meet bar");
});

test("due-drained: cleared iff nothing due in scope", () => {
  const q = quest({ kind: "due-drained", scope: { kind: "unit", slug: "g1-u01" } });
  assert.ok(isZoneCleared(q, { ...emptyState, dueCountInScope: 0 }));
  assert.ok(!isZoneCleared(q, { ...emptyState, dueCountInScope: 3 }));
});

test("story-chapter: cleared iff the chapter was completed", () => {
  const q = quest({ kind: "story-chapter", chapterId: "g1.st.lost-pages.ch01" });
  assert.ok(isZoneCleared(q, { ...emptyState, chapterCompleted: true }));
  assert.ok(!isZoneCleared(q, { ...emptyState, chapterCompleted: false }));
});
