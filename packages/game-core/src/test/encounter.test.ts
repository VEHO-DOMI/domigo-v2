import assert from "node:assert/strict";
import { test } from "node:test";
import { Encounter, type GrammarFormat, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import type { DueRef } from "@domigo/db";
import { DEFAULT_BATTLE_FORMATS, resolveEncounterTasks } from "../index.ts";

// Minimal casts — the resolver only reads id + (grammar) format.
const g = (id: string, format: GrammarFormat): GrammarItem => ({ id, format }) as unknown as GrammarItem;
const v = (id: string): VocabItem => ({ id }) as unknown as VocabItem;
const due = (itemId: string, kind: "vocab" | "grammar"): DueRef => ({
  itemId, kind, unitSlug: "g1-u01", grade: 1, box: 1, dueAt: new Date(),
});

function enc(over: Partial<Record<string, unknown>> = {}) {
  return Encounter.parse({
    schema: "encounter@1",
    id: "g1.enc.classroom",
    grade: 1,
    source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 3 },
    formatAllow: null,
    fallback: "scope-random",
    ...over,
  });
}

const pool = {
  vocab: [v("g1u01.w.apple"), v("g1u01.w.book"), v("g1u01.w.cat")],
  grammar: [
    g("g1u01.gi.plural.mc.001", "multiple-choice"),
    g("g1u01.gi.plural.gf.001", "gap-fill"),
    g("g1u01.gi.order.sb.001", "sentence-building"), // not battle-friendly by default
  ],
};

test("due path: returns due items soonest-first, up to count", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 2 } }), {
    due: [due("g1u01.w.book", "vocab"), due("g1u01.gi.plural.mc.001", "grammar"), due("g1u01.w.apple", "vocab")],
    pool,
  });
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.w.book", "g1u01.gi.plural.mc.001"]);
});

test("formatAllow filters grammar; vocab always allowed (due path, count exact)", () => {
  const out = resolveEncounterTasks(enc({ formatAllow: ["multiple-choice"], source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 2 } }), {
    due: [due("g1u01.gi.plural.gf.001", "grammar"), due("g1u01.gi.plural.mc.001", "grammar"), due("g1u01.w.apple", "vocab")],
    pool,
  });
  // gap-fill grammar is filtered out (not in formatAllow); mc + vocab survive, filling the count.
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.gi.plural.mc.001", "g1u01.w.apple"]);
});

test("default battle formats exclude sentence-building", () => {
  assert.ok(!DEFAULT_BATTLE_FORMATS.includes("sentence-building"));
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 5 } }), {
    due: [due("g1u01.gi.order.sb.001", "grammar")],
    pool,
  });
  // The sb due item is dropped; the zone tops up from scope order instead (Law 6).
  assert.ok(!out.some((r) => r.item.id === "g1u01.gi.order.sb.001"));
  assert.equal(out.length, 5);
});

test("short/empty queue tops up from deterministic scope order (sorted by id)", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 4 } }), {
    due: [due("g1u01.w.cat", "vocab")],
    pool,
  });
  // cat first (the due item), then the rest in id order, no duplicate cat.
  assert.equal(out[0]!.item.id, "g1u01.w.cat");
  assert.equal(out.length, 4);
  assert.equal(new Set(out.map((r) => r.item.id)).size, 4);
  // Determinism: same inputs → same output.
  const again = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 4 } }), {
    due: [due("g1u01.w.cat", "vocab")],
    pool,
  });
  assert.deepEqual(out.map((r) => r.item.id), again.map((r) => r.item.id));
});

test("scope-random kind ignores the queue, draws from scope order (battle-filtered)", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "scope-random", scope: { kind: "unit", slug: "g1-u01" }, count: 2 } }), {
    due: [due("g1u01.w.cat", "vocab")],
    pool,
  });
  // Queue ignored; scope order by id with sentence-building filtered out → gf, then mc.
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.gi.plural.gf.001", "g1u01.gi.plural.mc.001"]);
});

test("stale due ref (not in pool) is skipped", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 1 } }), {
    due: [due("g1u01.w.GONE", "vocab"), due("g1u01.w.apple", "vocab")],
    pool,
  });
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.w.apple"]);
});
