import assert from "node:assert/strict";
import { test } from "node:test";
import { Encounter, type GrammarFormat, type GrammarItem, type VocabItem } from "@domigo/content-schema";
import { DEFAULT_BATTLE_FORMATS, resolveEncounterTasks, seedStoryFlags, storyItemKey, type DueItemRef } from "../index.ts";

// Minimal casts — the resolver only reads id + (grammar) format.
const g = (id: string, format: GrammarFormat): GrammarItem => ({ id, format }) as unknown as GrammarItem;
const v = (id: string): VocabItem => ({ id }) as unknown as VocabItem;
const due = (itemId: string, _kind: "vocab" | "grammar"): DueItemRef => ({ itemId });

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

test("default battle formats carry the G-A1 widened gate", () => {
  for (const f of ["multiple-choice", "gap-fill", "anagram", "context-picker", "matching", "sentence-building", "transformation"] as const) {
    assert.ok(DEFAULT_BATTLE_FORMATS.includes(f), `${f} must be battle-eligible by default`);
  }
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 5 } }), {
    due: [due("g1u01.gi.order.sb.001", "grammar")],
    pool,
  });
  // The due sentence-building item now ENTERS the battle (the BattleStage
  // renders it with the tactile chip tray), first in line as the due item.
  assert.equal(out[0]!.item.id, "g1u01.gi.order.sb.001");
  assert.equal(out.length, 5);
});

test("an explicit formatAllow still narrows below the widened default", () => {
  const out = resolveEncounterTasks(enc({ formatAllow: ["multiple-choice"], source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 5 } }), {
    due: [due("g1u01.gi.order.sb.001", "grammar")],
    pool,
  });
  assert.ok(!out.some((r) => r.item.id === "g1u01.gi.order.sb.001"));
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
  const out = resolveEncounterTasks(enc({ formatAllow: ["multiple-choice", "gap-fill"], source: { kind: "scope-random", scope: { kind: "unit", slug: "g1-u01" }, count: 2 } }), {
    due: [due("g1u01.w.cat", "vocab")],
    pool,
  });
  // Queue ignored; scope order INTERLEAVES vocab/grammar (G-A1 battle variety):
  // apple(v ✓), order.sb(g ✗ filtered), book(v ✓ — count reached) → apple, book.
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.w.apple", "g1u01.w.book"]);
});

test("scope order alternates vocab and grammar (no same-kind battle clusters)", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "scope-random", scope: { kind: "unit", slug: "g1-u01" }, count: 6 } }), {
    due: [],
    pool,
  });
  assert.deepEqual(out.map((r) => r.kind), ["vocab", "grammar", "vocab", "grammar", "vocab", "grammar"]);
});

test("stale due ref (not in pool) is skipped", () => {
  const out = resolveEncounterTasks(enc({ source: { kind: "due", scope: { kind: "unit", slug: "g1-u01" }, count: 1 } }), {
    due: [due("g1u01.w.GONE", "vocab"), due("g1u01.w.apple", "vocab")],
    pool,
  });
  assert.deepEqual(out.map((r) => r.item.id), ["g1u01.w.apple"]);
});

// ─────────────────────────────────────────── B-0 shared helpers ───────

test("storyItemKey: bare itemId with no variant; itemId#variant with one (no collision)", () => {
  assert.equal(storyItemKey("g4u01.w.guess", null), "g4u01.w.guess");
  assert.equal(storyItemKey("g4u01.w.guess", "clue"), "g4u01.w.guess#clue");
  // the whole point: one item, two variants → two distinct keys (the second no
  // longer overwrites the first in a Record<string, ResolvedItem>).
  assert.notEqual(storyItemKey("x", "a"), storyItemKey("x", "b"));
});

test("seedStoryFlags: keeps only flags the story declares (stale cross-campaign flags dropped)", () => {
  // a returning "Lost for Words" save (w04.*) loaded into FOURTEEN: LIVE, which
  // declares w06/w10/w13 — the w04 flag must not leak in and mis-resolve gates.
  assert.deepEqual(
    seedStoryFlags(["w04.said", "w06.open", "w10.private"], ["w06.open", "w06.quiet", "w10.private", "w10.public", "w13.live"]),
    ["w06.open", "w10.private"],
  );
  // a story with no declared flags carries nothing.
  assert.deepEqual(seedStoryFlags(["w04.said"], []), []);
});
