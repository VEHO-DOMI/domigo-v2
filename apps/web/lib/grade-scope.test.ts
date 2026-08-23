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

/**
 * K1b · THE /play DECISION.
 *
 * /play was the last child-facing surface outside this scope: the chooser listed
 * every released story and /play/<year> opened any of the four. Both now ask the
 * SAME function — `visibleGradesFor`, via its DB wrapper `resolveVisibleGrades` —
 * and not a second one written for the game.
 *
 * What these cases pin is the DECISION, in the vocabulary the two pages use: which
 * stories survive the filter, and whether a deep link is in scope. What they cannot
 * pin is the wiring (a server component reading a session), so that half is proved
 * at the running system instead — the two together, not either alone.
 */
describe("die /play-Entscheidung — welche Geschichten ein Kind sieht", () => {
  // The released corpus as the chooser sees it: one story per school year.
  const stories = [
    { storyId: "g1.lost-pages", grade: 1 },
    { storyId: "g2.the-spill", grade: 2 },
    { storyId: "g3.fourteen", grade: 3 },
    { storyId: "g4.lost-for-words", grade: 4 },
  ];
  const sichtbar = (classGrade: number | null) => {
    const grades = visibleGradesFor(classGrade);
    return stories.filter((s) => grades.includes(s.grade)).map((s) => s.storyId);
  };

  it("das Stufe-2-Kind sieht GENAU seine Geschichte, keine der anderen drei", () => {
    assert.deepEqual(sichtbar(2), ["g2.the-spill"]);
  });

  it("jede Stufe bekommt ihre eigene, und nur ihre eigene", () => {
    for (const g of ALL_GRADES) assert.deepEqual(sichtbar(g), [stories[g - 1]!.storyId]);
  });

  it("die Lehrkraft (Stufe null) behält alle vier — die Vorschau ist ihr Arbeitsmittel", () => {
    assert.equal(sichtbar(null).length, 4);
  });

  it("null zeigt weiter ALLES: zu viel zeigen ist kosmetisch, nichts zeigen wäre eine tote Seite", () => {
    assert.deepEqual(visibleGradesFor(null), [1, 2, 3, 4]);
    assert.ok(sichtbar(null).length > 0);
  });

  it("der Tiefen-Link: /play/1 ist für das Stufe-2-Kind AUSSER Reichweite, /play/2 nicht", () => {
    const grades = visibleGradesFor(2);
    assert.equal(grades.includes(1), false);
    assert.equal(grades.includes(2), true);
  });

  it("das Ziel der Umleitung existiert immer — der Bereich ist nie leer", () => {
    for (const g of [null, 1, 2, 3, 4]) {
      const grades = visibleGradesFor(g);
      assert.equal(typeof grades[0], "number");
    }
  });

  it("eine Stufe ohne veröffentlichte Geschichte ergibt eine LEERE Liste, nie eine fremde", () => {
    // Nur g2 ist veröffentlicht; das Stufe-4-Kind bekommt nichts zu sehen — und
    // ganz sicher nicht die Geschichte der Zweiten.
    const nurG2 = stories.filter((s) => s.grade === 2);
    const grades = visibleGradesFor(4);
    assert.deepEqual(nurG2.filter((s) => grades.includes(s.grade)), []);
  });
});
