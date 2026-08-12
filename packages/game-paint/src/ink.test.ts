// R5-W1 · A2 · THE INK IS AN OBJECT — the laws, proven without a browser.
//
// B1's critic measured the shipped ink moving „um kein einziges Pixel" over 45
// ticks and seeing the classroom wall map through it. Both halves of that are
// now assertable arithmetic rather than something a screenshot has to catch.
import { describe, expect, it } from "vitest";
import {
  INK_BODY,
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
  planInkColumns,
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

// ── R5-N3 · A4 · THE TWO REASONS THE CRITIC WITHHELD "WOWED" ─────────────────
// A3 proved the ink live and its blind reviewer still refused, for two reasons
// that were both measurable and both true: the body was a STAIRCASE, and the
// pigment was not INK. Neither was a taste call, so neither is left to taste.

/** hue in degrees / photometric luminance in %, from a packed RGB */
const hueOf = (hex: number): number => {
  const r = ((hex >> 16) & 255) / 255, g = ((hex >> 8) & 255) / 255, b = (hex & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (d === 0) return 0;
  const h = mx === r ? 60 * (((g - b) / d) % 6) : mx === g ? 60 * ((b - r) / d + 2) : 60 * ((r - g) / d + 4);
  return h < 0 ? h + 360 : h;
};
const lumOf = (hex: number): number =>
  (0.2126 * ((hex >> 16) & 255) + 0.7152 * ((hex >> 8) & 255) + 0.0722 * (hex & 255)) / 2.55;

describe("the ink is INK, not sky (D-43 — blind critic: H220° against a H227° room)", () => {
  // measured off the shipped art and the phase's own declared wash: the p2 far
  // shell `l1_p2_b.png` is #495685 (227.0°) and the room's engine-drawn wash
  // runs #2b3358 / #3d4470 / #565b8a (229.3° / 231.8° / 234.2°).
  const ROOM_HUES = [227.0, 229.3, 231.8, 234.2];
  const MIN_SEPARATION = 15;

  it("keeps a hue of its own — the hazard may not share the air's colour", () => {
    for (const room of ROOM_HUES) {
      const gap = Math.abs(hueOf(INK_BODY) - room);
      expect(Math.min(gap, 360 - gap), `ink ${hueOf(INK_BODY).toFixed(1)}° vs room ${room}°`)
        .toBeGreaterThanOrEqual(MIN_SEPARATION);
    }
    // and the old pigment would fail this, which is the point of writing it down
    const old = Math.abs(hueOf(0x2c3a58) - 227.0);
    expect(old).toBeLessThan(MIN_SEPARATION);
  });

  it("keeps its crown in the same hue family — a rim, not a second material", () => {
    for (const c of [INK_CROWN_LIT, INK_CROWN_DARK]) {
      const gap = Math.abs(hueOf(c) - hueOf(INK_BODY));
      expect(Math.min(gap, 360 - gap)).toBeLessThan(12);
    }
  });

  it("shimmers rather than gleams — the lip is oil, not polished metal", () => {
    // the critic read the old 52-point jump as gilded metal
    expect(lumOf(INK_CROWN_LIT) - lumOf(INK_BODY)).toBeLessThan(40);
    expect(lumOf(INK_CROWN_LIT) - lumOf(INK_BODY)).toBeGreaterThan(20);
    expect(lumOf(0xa8c0ee) - lumOf(0x2c3a58)).toBeGreaterThan(40); // the old pair fails it
  });
});

describe("the ink body is poured, not stamped (D-42 — the staircase)", () => {
  //  ....##....
  //  ...####...   a pool two columns deep in the middle, one at the edges
  const grid = [
    "..........",
    "...wwww...",
    "...wwww...",
    "...wwww...",
  ];

  it("plans ONE run per contiguous column of ink, covering every ink cell", () => {
    const cols = planInkColumns(grid);
    expect(cols).toHaveLength(4); // columns 3,4,5,6 — one run each
    for (const col of cols) {
      expect(col.r0).toBe(1);
      expect(col.r1).toBe(3);
    }
    const covered = cols.reduce((n, c) => n + (c.r1 - c.r0 + 1), 0);
    const inkCells = grid.join("").split("").filter((ch) => ch === "w").length;
    expect(covered).toBe(inkCells);
  });

  it("gives every run two DIFFERENT ends — a flat run is the staircase again", () => {
    for (const col of planInkColumns(grid)) {
      expect(col.dBot).toBeGreaterThan(col.dTop);
      expect(inkDepthTint(col.dBot)).not.toBe(inkDepthTint(col.dTop));
    }
  });

  it("reads the bottom edge one row deeper than the last cell, so it keeps falling", () => {
    const [first] = planInkColumns(grid);
    expect(first!.dTop).toBe(0);
    expect(first!.dBot).toBe(3); // two cells above the last + 1 for the edge
  });

  it("splits a column broken by a gap into separate runs", () => {
    const broken = ["w", ".", "w", "w"];
    const cols = planInkColumns(broken);
    expect(cols).toHaveLength(2);
    expect(cols[0]).toMatchObject({ r0: 0, r1: 0 });
    expect(cols[1]).toMatchObject({ r0: 2, r1: 3 });
  });

  it("is pure — the same grid plans the same pool every time", () => {
    expect(planInkColumns(grid)).toEqual(planInkColumns(grid));
  });
});
