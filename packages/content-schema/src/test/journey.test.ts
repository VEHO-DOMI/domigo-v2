import assert from "node:assert/strict";
import { test } from "node:test";
import { Journey } from "../index.ts";

function green(r: { success: boolean; error?: { issues: unknown } }, msg: string): void {
  assert.equal(r.success, true, `${msg}${r.success ? "" : ": " + JSON.stringify(r.error?.issues)}`);
}
function red(r: { success: boolean }, msg: string): void {
  assert.equal(r.success, false, msg);
}

function journey(over: Record<string, unknown> = {}) {
  return {
    schema: "journey@1",
    grade: 2,
    unit: 3,
    slug: "g2-u03",
    nodes: [
      { id: "vokabeln", kind: "lesson", titleDe: "Neue Wörter", titleEn: "New words" },
      { id: "uben-1", kind: "practice", titleDe: "Üben", titleEn: null, itemPool: "practice" },
      { id: "spiel", kind: "game", titleDe: "Spiel", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "ch03" } },
      { id: "wdh", kind: "review", titleDe: "Wiederholung", titleEn: null },
    ],
    poolOverrides: { "g2u03.w.smudge": "arcade" },
    ...over,
  };
}

test("journey@1 round-trips a valid spine (lesson/practice/game/review)", () => {
  green(Journey.safeParse(journey()), "valid journey");
  green(Journey.safeParse(journey({ poolOverrides: undefined })), "no overrides is fine");
  green(Journey.safeParse(journey({ nodes: [{ id: "z07", kind: "game", titleDe: "Welt", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "z07" } }] })), "overworld z-pointer");
});

test("slug must equal grade+unit", () => {
  red(Journey.safeParse(journey({ slug: "g2-u04" })), "wrong slug rejected");
  red(Journey.safeParse(journey({ grade: 3 })), "grade/slug mismatch rejected");
});

test("duplicate node ids are rejected", () => {
  red(Journey.safeParse(journey({ nodes: [
    { id: "x", kind: "lesson", titleDe: "a", titleEn: null },
    { id: "x", kind: "practice", titleDe: "b", titleEn: null, itemPool: "practice" },
  ] })), "dup id");
});

test("the mode-length invariant caps node ids (journey:<unit>:<node> ≤ 40)", () => {
  // journey:g2-u03: = 15 chars → a 25-char id passes the charset regex but the
  // full mode is 40 (ok); a 26-char id → 41 > 40, rejected by the superRefine.
  green(Journey.safeParse(journey({ nodes: [{ id: "a".repeat(25), kind: "lesson", titleDe: "x", titleEn: null }] })), "25-char id (mode=40) ok");
  red(Journey.safeParse(journey({ nodes: [{ id: "a".repeat(26), kind: "lesson", titleDe: "x", titleEn: null }] })), "26-char id (mode=41) rejected");
});

test("gamePointer belongs to game nodes only, and its grade must match", () => {
  red(Journey.safeParse(journey({ nodes: [{ id: "g", kind: "game", titleDe: "S", titleEn: null }] })), "game node without gamePointer");
  red(Journey.safeParse(journey({ nodes: [{ id: "l", kind: "lesson", titleDe: "L", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "ch03" } }] })), "lesson with gamePointer");
  red(Journey.safeParse(journey({ nodes: [{ id: "g", kind: "game", titleDe: "S", titleEn: null, gamePointer: { grade: 3, zoneOrChapter: "ch03" } }] })), "gamePointer grade mismatch");
  red(Journey.safeParse(journey({ nodes: [{ id: "g", kind: "game", titleDe: "S", titleEn: null, gamePointer: { grade: 2, zoneOrChapter: "x9" } }] })), "malformed zoneOrChapter");
});

test("itemPool belongs to practice/side-quest only, and mock is not authorable", () => {
  green(Journey.safeParse(journey({ nodes: [{ id: "sq", kind: "side-quest", titleDe: "Extra", titleEn: null, itemPool: "homework" }] })), "side-quest may carry a pool");
  red(Journey.safeParse(journey({ nodes: [{ id: "l", kind: "lesson", titleDe: "L", titleEn: null, itemPool: "practice" }] })), "lesson with itemPool");
  red(Journey.safeParse(journey({ nodes: [{ id: "p", kind: "practice", titleDe: "P", titleEn: null, itemPool: "mock" }] })), "mock is not an authorable pool");
  red(Journey.safeParse(journey({ poolOverrides: { "g2u03.w.smudge": "mock" } })), "mock override not allowed");
});
