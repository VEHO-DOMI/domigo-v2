// R5-W3 · A5 · D-45 · THE CHECKPOINT IS THE ONE PROP THAT MUST BE SEEN.
//
// B1's critic, in one sentence: the Krakel marker „hat in den hellen Leveln
// keinen Eigenkontrast und wurde beim Banking in p1 vom Spieler komplett
// verdeckt". Two defects, and the second one is the funny one — the prop whose
// entire job is to be spotted was standing behind the child who was using it.
import { describe, expect, it } from "vitest";
import {
  MARKER_H,
  MARKER_STANDOFF_PX,
  MARKER_VISIBLE_MIN,
  heroEdgeFor,
  markerEdgeFor,
  markerPlacementFor,
  markerVisibleFraction,
} from "./composition.ts";

describe("D-45 · the marker wears the room's contour", () => {
  it("is the child's own scheme, not a second table free to drift", () => {
    for (const key of [88, 86, 50, 30, 28, 14]) expect(markerEdgeFor(key)).toEqual(heroEdgeFor(key));
  });

  it("is ink in a lit room and a warm rim in a dark one", () => {
    expect(markerEdgeFor(88).tint).toBe(0x2a2333);
    expect(markerEdgeFor(28).tint).toBe(0xffe4b0);
  });

  it("always swells — an un-swollen copy is a cast shadow, not an outline", () => {
    for (const key of [88, 28]) expect(markerEdgeFor(key).swell).toBeGreaterThan(0);
  });
});

describe("D-45 · the marker steps aside", () => {
  // r is the marker's own row; r+1 must be ground for a neighbour to stand on
  const rows = (marker: string, below: string) => [marker, below];

  it("steps LEFT when the ground to its left will carry it", () => {
    //           c: 0123456
    const g = rows("...C...", "..###..");
    expect(markerPlacementFor(g, 3, 0).dx).toBe(-MARKER_STANDOFF_PX);
  });

  it("steps RIGHT when only the right has ground", () => {
    const g = rows("...C...", "...##..");
    expect(markerPlacementFor(g, 3, 0).dx).toBe(MARKER_STANDOFF_PX);
  });

  it("stays put when the ledge is one cell wide, and says so", () => {
    const g = rows("...C...", "...#...");
    const p = markerPlacementFor(g, 3, 0);
    expect(p.dx).toBe(0);
    expect(p.why).toContain("nowhere to step");
  });

  it("will not step into a wall, even where there is ground under it", () => {
    // left neighbour is solid at the marker's OWN row — that is a wall, not a spot
    const g = rows("..#C...", ".####..");
    expect(markerPlacementFor(g, 3, 0).dx).toBe(MARKER_STANDOFF_PX);
  });

  it("prefers left, because p1's only neighbour is a bouncer one cell RIGHT", () => {
    const g = rows("...C...", "..####.");
    expect(markerPlacementFor(g, 3, 0).dx).toBeLessThan(0);
  });
});

describe("D-45 · the clearance is a number, not a hope", () => {
  const markerW = 30;
  const heroW = 23;

  it("standing on the same spot, the child hides nearly all of it", () => {
    expect(markerVisibleFraction(markerW, heroW, 0)).toBeLessThan(0.2);
  });

  it("…and the shipped standoff clears the law with room to spare", () => {
    expect(markerVisibleFraction(markerW, heroW, MARKER_STANDOFF_PX)).toBeGreaterThan(MARKER_VISIBLE_MIN);
  });

  it("is monotone: stepping further aside never reveals less", () => {
    let last = -1;
    for (const dx of [0, 4, 8, 12, 16, 18, 24, 40]) {
      const v = markerVisibleFraction(markerW, heroW, dx);
      expect(v).toBeGreaterThanOrEqual(last);
      last = v;
    }
    expect(last).toBe(1);
  });

  it("is symmetric — left and right hide the same amount", () => {
    expect(markerVisibleFraction(markerW, heroW, -18)).toBeCloseTo(markerVisibleFraction(markerW, heroW, 18), 10);
  });

  it("the drawn height is the one the scene uses", () => {
    expect(MARKER_H).toBe(26);
  });
});
