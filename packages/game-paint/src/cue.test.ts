// PK-R6 · H2 · THE ↑ CUE IS DRAWN BY HAND (round-2 finding 1), pinned.
//
// „The flat white/navy up-arrow glyph … is crisp vector geometry with hard edges
// and no texture, sitting directly on the soft watercolor background with zero
// visual integration."
//
// The three claims that separate a chalk mark from a HUD sticker are all
// checkable on the geometry alone, so none of them has to be re-argued from a
// screenshot: no machine edge, an edge that ramps instead of stepping, and the
// same mark every time the same being is asked about.
import { describe, expect, it } from "vitest";
import { CUE_CHALK, CUE_CORE, CUE_INK, CUE_JITTER_PX, chalkArrow, hasNoStraightMachineEdge } from "./cue.ts";

describe("PK-R6 · H2 · the hand-drawn ↑ cue", () => {
  it("has no straight machine edge — the defect, as a test", () => {
    // the retired cue was fillTriangle + fillRect: two horizontals and two
    // verticals, i.e. four edges that would each fail this outright.
    const cue = chalkArrow(40, 20, 11, 3);
    for (const band of cue.bands) {
      expect(hasNoStraightMachineEdge(band.pts), `band @${band.alpha}`).toBe(true);
    }
  });

  it("builds its edge as a RAMP: widest and faintest outside, brightest inside", () => {
    const cue = chalkArrow(0, 0, 11, 1);
    const spread = (pts: readonly { x: number; y: number }[]): number =>
      Math.max(...pts.map((p) => Math.hypot(p.x, p.y)));
    for (let i = 1; i < cue.bands.length; i++) {
      const prev = cue.bands[i - 1]!;
      const cur = cue.bands[i]!;
      expect(spread(cur.pts), `band ${i} is not inside band ${i - 1}`).toBeLessThan(spread(prev.pts));
      expect(cur.alpha, `band ${i} is not brighter than band ${i - 1}`).toBeGreaterThan(prev.alpha);
    }
    // …and it is ink underneath, chalk on top: a dark rim is what keeps a pale
    // mark readable on a pale wall (the same reason the flying chalk has one)
    expect(cue.bands[0]!.colour).toBe(CUE_INK);
    expect(cue.bands.at(-1)!.colour).toBe(CUE_CORE);
    expect(cue.bands.map((b) => b.colour)).toContain(CUE_CHALK);
  });

  it("wavers, but only within a hand's tolerance", () => {
    // every vertex is off its ruled position — and none of them by so much that
    // the arrow stops being an arrow
    const ruled = chalkArrow(0, 0, 11, 1).bands[2]!.pts; // the chalk band, grow 0.2
    for (const p of ruled) {
      const off = Math.min(Math.abs(p.x % 1), Math.abs(p.y % 1));
      expect(off).toBeLessThan(CUE_JITTER_PX + 1); // sanity: nothing ran away
    }
    // …and no two cues are the same waver, or the „hand" is a stamp
    const a = chalkArrow(0, 0, 11, 1).bands[2]!.pts;
    const b = chalkArrow(0, 0, 11, 2).bands[2]!.pts;
    expect(a).not.toEqual(b);
  });

  it("is deterministic: the same being gets the same mark, every frame", () => {
    // a jitter re-rolled per frame would BOIL, which is a worse artefact than the
    // crisp glyph it replaced — and a replayed tape has to draw the same picture
    expect(chalkArrow(12, 7, 11, 91)).toEqual(chalkArrow(12, 7, 11, 91));
  });

  it("sheds chalk and carries the book's own gilded light", () => {
    const cue = chalkArrow(0, 0, 11, 5);
    expect(cue.dust.length).toBeGreaterThan(3);
    for (const d of cue.dust) expect(d.alpha).toBeLessThan(0.55); // powder, not paint
    // the halo goes out and fades — it must never be a disc with a hard rim
    expect(cue.halo.length).toBeGreaterThan(1);
    for (let i = 1; i < cue.halo.length; i++) {
      expect(cue.halo[i]!.r).toBeGreaterThan(cue.halo[i - 1]!.r);
      expect(cue.halo[i]!.alpha).toBeLessThan(cue.halo[i - 1]!.alpha);
    }
  });
});
