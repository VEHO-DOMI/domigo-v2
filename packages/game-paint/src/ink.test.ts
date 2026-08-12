// R5-W1 · A2 · THE INK IS AN OBJECT — the laws, proven without a browser.
//
// B1's critic measured the shipped ink moving „um kein einziges Pixel" over 45
// ticks and seeing the classroom wall map through it. Both halves of that are
// now assertable arithmetic rather than something a screenshot has to catch.
import { describe, expect, it } from "vitest";
import {
  INK_CROWN_DARK,
  INK_CROWN_LIT,
  INK_DEPTH_FLOOR,
  INK_DEPTH_ROWS,
  INK_WAVE_AMPL_PX,
  inkCrownOffsetAt,
  inkCrownPoints,
  inkDepthAt,
  inkDepthTint,
  inkScrollAt,
} from "./ink.ts";

describe("the ink moves, always (B1 critic: bewegt sich in 45 Ticks um kein einziges Pixel)", () => {
  it("drifts a visible distance over the window the critic measured", () => {
    // his instrument was 45 ticks; whatever we do has to be visible in ONE of
    // his measurements, not merely over a minute
    const moved = inkScrollAt(45) - inkScrollAt(0);
    expect(moved).toBeGreaterThan(2); // world px — over a tenth of a cell
  });

  it("keeps drifting — the motion is not a one-off settle", () => {
    const a = inkScrollAt(600) - inkScrollAt(555);
    const b = inkScrollAt(45) - inkScrollAt(0);
    expect(a).toBeCloseTo(b, 6);
  });

  it("has a surface that rises and falls at every x", () => {
    for (const x of [0, 37, 128, 613]) {
      const over = Array.from({ length: 160 }, (_, t) => inkCrownOffsetAt(x, t));
      expect(Math.max(...over) - Math.min(...over)).toBeGreaterThan(0.6);
    }
  });

  it("never lies about where the ink is — the crown stays inside its amplitude", () => {
    // the collision line is flat; a surface that swung further than this would
    // draw water where the physics says there is none
    for (let t = 0; t < 400; t++) {
      for (let x = 0; x < 200; x += 7) {
        expect(Math.abs(inkCrownOffsetAt(x, t))).toBeLessThanOrEqual(INK_WAVE_AMPL_PX + 1e-9);
      }
    }
  });

  it("is a WAVE, not a rigid bar sliding along", () => {
    // two points a half-wavelength apart must disagree about where the surface
    // is; a single offset applied to the whole run would move them together
    const t = 33;
    expect(Math.abs(inkCrownOffsetAt(0, t) - inkCrownOffsetAt(21, t))).toBeGreaterThan(0.3);
  });

  it("is DETERMINISTIC — the same tick draws the same water", () => {
    const a = inkCrownPoints(0, 64, 91);
    const b = inkCrownPoints(0, 64, 91);
    expect(a).toEqual(b);
    expect(inkScrollAt(91)).toBe(inkScrollAt(91));
  });

  it("samples the full run, both ends included", () => {
    const pts = inkCrownPoints(16, 99, 5);
    expect(pts[0]?.x).toBe(16);
    expect(pts[pts.length - 1]?.x).toBe(99);
  });
});

describe("the ink hides what is behind it (B1 critic: halbtransparent)", () => {
  it("darkens with depth and bottoms out ABOVE black — the darkest dark keeps its hue", () => {
    const surface = inkDepthTint(0);
    expect(surface).toBe(0xffffff); // the surface wears the room's full light
    let prev = 256;
    for (let d = 0; d <= INK_DEPTH_ROWS; d++) {
      const v = inkDepthTint(d) & 0xff;
      expect(v).toBeLessThanOrEqual(prev);
      prev = v;
    }
    expect(inkDepthTint(INK_DEPTH_ROWS) & 0xff).toBeGreaterThanOrEqual(Math.round(255 * INK_DEPTH_FLOOR) - 1);
  });

  it("stops the depth walk at the world's ceiling — outside the grid is not deeper ink", () => {
    // the same trap the terrain's walk fell into (A1): glyphAt calls everything
    // outside the grid solid, and a naive walk answers "infinitely deep"
    const pool = ["wwww", "wwww", "####"];
    expect(inkDepthAt(pool, 1, 0)).toBe(0);
    expect(inkDepthAt(pool, 1, 1)).toBe(1);
  });

  it("counts only ink above ink", () => {
    const grid = ["....", "wwww", "wwww"];
    expect(inkDepthAt(grid, 0, 1)).toBe(0); // air above ⇒ this IS the surface
    expect(inkDepthAt(grid, 0, 2)).toBe(1);
  });
});

describe("the crown is a boundary, not a band", () => {
  it("carries a lit lip AND a dark line, far enough apart to read as an edge", () => {
    const lum = (c: number) => (((c >> 16) & 255) * 0.2126 + ((c >> 8) & 255) * 0.7152 + (c & 255) * 0.0722) / 255;
    // a single lighter strip is what shipped and what read as a change of fill;
    // two values with a real step between them is what reads as a surface
    expect(lum(INK_CROWN_LIT) - lum(INK_CROWN_DARK)).toBeGreaterThan(0.4);
  });
});
