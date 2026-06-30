import assert from "node:assert/strict";
import { test } from "node:test";
import { THEMES, resolveZoneTheme, paintTileset, TILE_KINDS } from "../index.ts";

const GENERATORS = ["school-room", "zoo-room", "ship-room", "feelings-room", "band-room"];
const SKELETON = new Set(["#", ".", "E", "F", "P"]);

test("every shipped generator resolves to its own theme; unknown/null falls back to school", () => {
  for (const g of GENERATORS) assert.equal(resolveZoneTheme(g), THEMES[g]);
  assert.equal(resolveZoneTheme("does-not-exist"), THEMES["school-room"]);
  assert.equal(resolveZoneTheme(null), THEMES["school-room"]);
});

test("every theme layout is a save-compatible 15×11 room with the stable skeleton", () => {
  for (const [g, t] of Object.entries(THEMES)) {
    assert.equal(t.layout.length, 11, `${g}: 11 rows`);
    for (const row of t.layout) assert.equal(row.length, 15, `${g}: 15 cols`);
    assert.ok([...t.layout[0]!].every((c) => c === "#"), `${g}: top wall`);
    assert.ok([...t.layout[10]!].every((c) => c === "#"), `${g}: bottom wall`);
    for (const row of t.layout) assert.ok(row[0] === "#" && row[14] === "#", `${g}: side walls`);
    const flat = t.layout.join("");
    assert.equal([...flat].filter((c) => c === "P").length, 1, `${g}: exactly one player start`);
    assert.ok([...flat].filter((c) => c === "E").length >= 4, `${g}: at least 4 encounter nodes`);
    assert.ok([...flat].filter((c) => c === "F").length >= 1, `${g}: at least one NPC`);
  }
});

test("every layout glyph is a skeleton cell or a declared prop", () => {
  for (const [g, t] of Object.entries(THEMES)) {
    for (const ch of new Set(t.layout.join(""))) {
      assert.ok(SKELETON.has(ch) || t.props[ch] !== undefined, `${g}: glyph '${ch}' is undeclared`);
    }
  }
});

test("a theme's prop tiles paint non-blank pixels", () => {
  for (const [g, t] of Object.entries(THEMES)) {
    if (t.extraKinds.length === 0) continue;
    const ts = paintTileset(100, { palette: t.palette, kinds: [...TILE_KINDS, ...t.extraKinds] });
    for (const k of t.extraKinds) {
      assert.ok(ts.tiles[k]!.pixels.some((p) => p !== 1), `${g}: prop '${k}' is not blank floor`);
    }
  }
});

test("accent override recolours the encounter-glow slot (the brand-green node)", () => {
  const ts = paintTileset(1, { accent: "#16a34a" });
  assert.equal(ts.palette[8], "#16a34a", "encounter-glow palette slot = accent");
});
