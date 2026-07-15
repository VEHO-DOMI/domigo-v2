import assert from "node:assert/strict";
import { test } from "node:test";
import { Journey } from "@domigo/content-schema";
import { validateJourney } from "../validate-journeys.ts";

// a valid PARSED journey (g2-u03): a lesson, a practice node, a resolvable game node
function makeJourney(over: Record<string, unknown> = {}) {
  return Journey.parse({
    schema: "journey@1",
    grade: 2,
    unit: 3,
    slug: "g2-u03",
    nodes: [
      { id: "lesson", kind: "lesson", titleDe: "Wörter", titleEn: null },
      { id: "uben", kind: "practice", titleDe: "Üben", titleEn: null, itemPool: "practice" },
      { id: "spiel", kind: "game", titleDe: "Spiel", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "ch03" } },
    ],
    ...over,
  });
}
const ITEMS = ["g2u03.w.smudge", "g2u03.w.door"];
const resolveCh03 = (g: number, s: string) => g === 2 && s === "ch03";

test("a valid journey passes (gamePointer resolves, pool non-empty)", () => {
  assert.deepEqual(validateJourney(makeJourney(), resolveCh03, ITEMS), []);
});

test("J1 — an unreleased gamePointer fails", () => {
  const errs = validateJourney(makeJourney(), () => false, ITEMS);
  assert.equal(errs.length, 1);
  assert.match(errs[0]!, /does not resolve to a released stop/);
});

test("J2 — an empty referenced pool fails", () => {
  const j = makeJourney({ nodes: [{ id: "sq", kind: "side-quest", titleDe: "X", titleEn: null, itemPool: "arcade" }] });
  const errs = validateJourney(j, resolveCh03, ITEMS);
  assert.equal(errs.length, 1);
  assert.match(errs[0]!, /itemPool "arcade" is empty/);
});

test("J2 — an arcade pool with an authored override IS non-empty", () => {
  const j = makeJourney({
    nodes: [{ id: "sq", kind: "side-quest", titleDe: "X", titleEn: null, itemPool: "arcade" }],
    poolOverrides: { "g2u03.w.smudge": "arcade" },
  });
  assert.deepEqual(validateJourney(j, resolveCh03, ITEMS), []);
});

test("J3 — a poolOverrides key that isn't a unit item fails", () => {
  const errs = validateJourney(makeJourney({ poolOverrides: { "g2u03.w.ghost": "arcade" } }), resolveCh03, ITEMS);
  assert.ok(errs.some((e) => /poolOverrides key "g2u03\.w\.ghost" is not an item/.test(e)));
});
