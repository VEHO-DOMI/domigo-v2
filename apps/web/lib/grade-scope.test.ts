/**
 * P1 · the grade-scoping decision, proved without a DB (node --test, like
 * lib/checkup.test.ts — apps/web has no vitest). Only the PURE half is under
 * test here; `resolveVisibleGrades` is the DB wrapper around exactly these
 * functions, and its own failure paths all collapse to `visibleGradesFor(null)`.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ALL_GRADES, gradeOfSlug, isSlugAllowed, visibleGradesFor } from "./grade-scope.ts";

describe("visibleGradesFor — a child sees its own school year only", () => {
  it("narrows a resolved grade to exactly that year (the g2 student)", () => {
    assert.deepEqual(visibleGradesFor(2), [2]);
  });

  it("narrows every one of the four years the same way", () => {
    for (const g of ALL_GRADES) assert.deepEqual(visibleGradesFor(g), [g]);
  });

  it("opens ALL four years when the grade is null — teacher, no player, or a DB hiccup", () => {
    assert.deepEqual(visibleGradesFor(null), [1, 2, 3, 4]);
  });

  it("never returns an empty scope (a child must never face a blank page)", () => {
    for (const g of [null, 1, 2, 3, 4]) assert.ok(visibleGradesFor(g).length > 0);
  });

  it("returns a fresh array, so a caller cannot mutate ALL_GRADES", () => {
    const first = visibleGradesFor(null);
    first.pop();
    assert.deepEqual(visibleGradesFor(null), [1, 2, 3, 4]);
  });
});

describe("gradeOfSlug — the year a unit slug belongs to", () => {
  it("reads the year off a normal unit slug", () => {
    assert.equal(gradeOfSlug("g1-u01"), 1);
    assert.equal(gradeOfSlug("g4-u13"), 4);
  });

  it("returns null for a slug that carries no year", () => {
    assert.equal(gradeOfSlug("intro"), null);
    assert.equal(gradeOfSlug("g5-u01"), null); // outside the lower cycle
    assert.equal(gradeOfSlug("xg2-u01"), null); // year must start the slug
  });
});

describe("isSlugAllowed — the deep-link gate", () => {
  it("lets the g2 student into a g2 unit", () => {
    assert.equal(isSlugAllowed("g2-u03", visibleGradesFor(2)), true);
  });

  it("keeps the g2 student out of a g4 unit (the deep-link that must redirect)", () => {
    assert.equal(isSlugAllowed("g4-u01", visibleGradesFor(2)), false);
  });

  it("lets a teacher (grade null) into every year", () => {
    const all = visibleGradesFor(null);
    for (const slug of ["g1-u01", "g2-u03", "g3-u07", "g4-u01"]) {
      assert.equal(isSlugAllowed(slug, all), true);
    }
  });

  it("never hides a slug it cannot classify", () => {
    assert.equal(isSlugAllowed("intro", visibleGradesFor(2)), true);
  });
});
