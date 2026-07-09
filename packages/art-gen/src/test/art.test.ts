import assert from "node:assert/strict";
import { test } from "node:test";
import { FACINGS, TILE, TILE_KINDS, paintPlayerSprite, paintTileset } from "../index.ts";

test("tileset: base tiles, each a valid TILE×TILE indexed image", () => {
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
  const glowIdx = enc.palette.indexOf("#22c55e"); // default encounterGlow slot
  assert.ok(glowIdx > 0, "palette carries the glow colour");
  assert.ok(enc.pixels.some((p) => p === glowIdx), "the ✦ star is actually painted");
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

// ── A1-3 walk cycle ──────────────────────────────────────────────────────────

/** The 0-based row a pixel index lives in (TILE-wide image). */
const rowOf = (i: number) => Math.floor(i / TILE);
/** Walk steps only ever touch the legs — at or below this row (matches sprite.ts LEG_TOP). */
const LEG_TOP = 34;

test("walk: two valid step frames per facing", () => {
  const sp = paintPlayerSprite(42);
  assert.deepEqual(Object.keys(sp.walk).sort(), [...FACINGS].sort());
  for (const f of FACINGS) {
    const steps = sp.walk[f];
    assert.equal(steps.length, 2);
    for (const img of steps) {
      assert.equal(img.pixels.length, TILE * TILE);
      assert.ok(img.pixels.every((p) => p >= 0 && p < img.palette.length), "indices in palette range");
    }
  }
});

test("walk steps differ from the neutral frame ONLY in the leg rows (34+)", () => {
  const sp = paintPlayerSprite(7);
  for (const f of FACINGS) {
    const neutral = sp.frames[FACINGS.indexOf(f)]!.pixels;
    for (const step of sp.walk[f]) {
      let differed = false;
      for (let i = 0; i < neutral.length; i++) {
        if (step.pixels[i] !== neutral[i]) {
          differed = true;
          assert.ok(rowOf(i) >= LEG_TOP, `${f}: change at row ${rowOf(i)} is above the legs — head/torso must stay identical`);
        }
      }
      assert.ok(differed, `${f}: a walk step must actually move a foot`);
    }
  }
});

test("the two walk steps alternate feet (step 1 ≠ step 2)", () => {
  const sp = paintPlayerSprite(7);
  for (const f of FACINGS) {
    assert.notDeepEqual(sp.walk[f][0].pixels, sp.walk[f][1].pixels);
  }
});

test("walk cycle is deterministic per seed", () => {
  assert.deepEqual(paintPlayerSprite(42).walk, paintPlayerSprite(42).walk);
});
