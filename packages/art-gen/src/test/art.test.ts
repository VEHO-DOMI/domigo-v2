import assert from "node:assert/strict";
import { test } from "node:test";
import { FACINGS, TILE, TILE_KINDS, paintPlayerSprite, paintTileset } from "../index.ts";

test("tileset: 6 tiles, each a valid 16x16 indexed image", () => {
  const ts = paintTileset(7);
  assert.deepEqual(Object.keys(ts.tiles).sort(), [...TILE_KINDS].sort());
  for (const k of TILE_KINDS) {
    const img = ts.tiles[k]!;
    assert.equal(img.width, TILE);
    assert.equal(img.height, TILE);
    assert.equal(img.pixels.length, TILE * TILE);
    assert.ok(img.pixels.every((p) => p >= 0 && p < img.palette.length), `${k} indices in palette range`);
  }
});

test("tileset is deterministic per seed, and varies across seeds", () => {
  assert.deepEqual(paintTileset(7), paintTileset(7), "same seed → identical");
  assert.notDeepEqual(paintTileset(7).tiles.floor!.pixels, paintTileset(8).tiles.floor!.pixels, "different seed → different");
});

test("encounter tile actually paints the glow marker (not blank floor)", () => {
  const enc = paintTileset(3).tiles.encounter!;
  assert.ok(enc.pixels.some((p) => p === 8), "has the green glow index");
});

test("player sprite: 4 directional frames, valid indexed images", () => {
  const sp = paintPlayerSprite(42);
  assert.equal(sp.frames.length, FACINGS.length);
  for (const f of sp.frames) {
    assert.equal(f.pixels.length, TILE * TILE);
    assert.ok(f.pixels.some((p) => p !== 0), "frame is not entirely transparent");
    assert.ok(f.pixels.every((p) => p >= 0 && p < f.palette.length), "indices in palette range");
  }
});

test("player sprite is deterministic per seed, varies across seeds", () => {
  assert.deepEqual(paintPlayerSprite(42), paintPlayerSprite(42));
  // different seed → at least the palette (hair/shirt) or pixels differ
  assert.notDeepEqual(paintPlayerSprite(1), paintPlayerSprite(99));
});

test("down vs up frames differ (facing cue is real)", () => {
  const sp = paintPlayerSprite(5);
  const down = sp.frames[FACINGS.indexOf("down")]!;
  const up = sp.frames[FACINGS.indexOf("up")]!;
  assert.notDeepEqual(down.pixels, up.pixels);
});
