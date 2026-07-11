import assert from "node:assert/strict";
import { test } from "node:test";
import { listApprovedUnits, listReleasedStories, loadUnit, resolveReleased, storyIdForGrade, type ReleasedStory } from "../index.ts";

test("loadUnit reads + schema-validates a real approved unit", () => {
  const u = loadUnit("g1-u01");
  assert.equal(u.slug, "g1-u01");
  assert.ok(u.vocab.length > 0, "vocab items present");
  assert.ok(u.grammar.length > 0, "grammar items present");
  // schema-validated shape: ids carry the unit prefix.
  assert.ok(u.vocab.every((it) => it.id.startsWith("g1u01.w.")));
  assert.ok(u.grammar.every((it) => it.id.startsWith("g1u01.gi.")));
});

test("loadUnit applies the item-fixes overlay (g4-u11 ag.001 prompt patch)", () => {
  const u = loadUnit("g4-u11");
  const patched = u.grammar.find((it) => it.id === "g4u11.gi.reflexive-pronouns.ag.001");
  assert.ok(patched, "patched item present (not dropped)");
  // the overlay set this prompt to the German du-form with blanks:0.
  assert.equal(patched.prompt.lang, "de");
  assert.equal(patched.prompt.blanks, 0);
});

test("listApprovedUnits returns all 57, sorted, g1-u01 first", () => {
  const units = listApprovedUnits();
  assert.equal(units.length, 57);
  assert.equal(units[0], "g1-u01");
  assert.ok(units.every((s) => /^g[1-4]-u\d{2}$/.test(s)));
});

test("loadUnit rejects a bad slug", () => {
  assert.throws(() => loadUnit("../etc"), /bad unit slug/);
});

test("listReleasedStories derives one story per grade from the corpus (all four grades released)", () => {
  const stories = listReleasedStories();
  assert.deepEqual(
    stories.map((s) => [s.grade, s.storyId]),
    [
      [1, "g1.st.lost-pages"],
      [2, "g2.st.wrong-name"],
      [3, "g3.st.fourteen"],
      [4, "g4.st.fourteen-live"], // B-3: Season 2 is now the released g4 game; "Lost for Words" is parked
    ],
  );
  assert.ok(stories.every((s) => s.titleEn.length > 0), "every released story carries a display title");
});

test("storyIdForGrade resolves every released grade from the corpus (no stale hand-maps)", () => {
  assert.equal(storyIdForGrade(3), "g3.st.fourteen"); // the stale app-side map missed g3 — this is the regression guard
  assert.equal(storyIdForGrade(4), "g4.st.fourteen-live"); // B-3 swap: the full FOURTEEN: LIVE season on the game-trip runtime
});

// ─────────────────────────────────────── B-0: canonical|bonus release ────

test("resolveReleased: a canonical + a bonus in one grade coexist; two canonicals throw", () => {
  const canon = (storyId: string, grade: number): ReleasedStory => ({ storyId, grade, titleEn: storyId, role: "canonical" });
  const bonus = (storyId: string, grade: number): ReleasedStory => ({ storyId, grade, titleEn: storyId, role: "bonus" });

  // the case B-2/B-3 need: a new canonical game released alongside the old story kept as a bonus.
  const ok = resolveReleased([bonus("g2.st.wrong-name", 2), canon("g2.st.the-spill", 2), canon("g1.st.lost-pages", 1)]);
  assert.deepEqual(
    ok.map((s) => [s.grade, s.storyId, s.role]),
    [
      [1, "g1.st.lost-pages", "canonical"],
      [2, "g2.st.the-spill", "canonical"],
      [2, "g2.st.wrong-name", "bonus"],
    ],
  );

  // two canonicals for one grade is the Track-C invariant breaking — it must throw, not pick one.
  assert.throws(
    () => resolveReleased([canon("g2.st.the-spill", 2), canon("g2.st.wrong-name", 2)]),
    /two canonical released stories for grade 2/,
  );
});
