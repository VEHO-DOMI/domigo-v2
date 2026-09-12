import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { groundCapPlacement, groundCapVisible } from "./ground-cap.ts";
import { groundSurfaceAt } from "./collide.ts";

describe("ground-strip caps at actual same-row edges", () => {
  it("does not put a left cap inside the solid neighbor of a surface run", () => {
    expect(groundCapVisible([".####.."], 1, 0)).toBe(false);
  });
  it("does not put a right cap inside the solid neighbor of a surface run", () => {
    expect(groundCapVisible([".####.."], 4, 0)).toBe(false);
  });
  it("retains the exposed left side", () => {
    expect(groundCapVisible([".####.."], 0, 0)).toBe(true);
  });
  it("retains the exposed right side", () => {
    expect(groundCapVisible([".####.."], 5, 0)).toBe(true);
  });
  it("ice is solid too, and world edges remain closed", () => {
    const grid = [".~##~.."];
    expect(groundCapVisible(grid, 1, 0)).toBe(false);
    expect(groundCapVisible(grid, 4, 0)).toBe(false);
    expect(groundCapVisible(grid, -1, 0)).toBe(false);
    expect(groundCapVisible(grid, 7, 0)).toBe(false);
  });
  it("preserves non-solid markers without adding another collision rule", () => {
    for (const glyph of ["*", "C", "X", "w", "/"]) expect(groundCapVisible([glyph], 0, 0)).toBe(true);
  });
  it("regresses the actual ch02 p1 step against a taller wall without moving the floor", () => {
    const level = JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch02.level.json", import.meta.url), "utf8"));
    const rows: string[] = level.phases.find((p: { id: string }) => p.id === "p1").rows;
    expect(groundCapVisible(rows, 8, 18)).toBe(false);
    expect(groundCapVisible(rows, 7, 11)).toBe(true);
    expect(groundCapVisible(rows, 28, 11)).toBe(false);
    expect(groundSurfaceAt(rows, 40, 17, 9)).toEqual({ yPx: 288, glyph: "#" });
    expect(groundSurfaceAt(rows, 136, 10, 16)).toEqual({ yPx: 176, glyph: "#" });
    expect(groundSurfaceAt(rows, 80, 12, 14)).toEqual({ yPx: 288, glyph: "#" });
  });
});

describe("ground cap rectangles inside their solid run", () => {
  const rows = [".####."];
  const scale = 30 / 175;
  it.each([["left", 185], ["right", 184]] as const)("places the %s cap entirely inside x16..80", (side, sourceWidth) => {
    const cap = groundCapPlacement(rows, 1, 4, 0, side, sourceWidth, scale);
    expect(cap).not.toBeNull();
    const left = cap!.x - cap!.originX * cap!.width;
    const right = left + cap!.width;
    expect(cap!.y).toBe(-7);
    expect(cap!.width).toBeCloseTo(sourceWidth * scale, 12);
    expect(left).toBeGreaterThanOrEqual(16);
    expect(right).toBeLessThanOrEqual(80);
    expect(side === "left" ? left : right).toBe(side === "left" ? 16 : 80);
  });
  it("uses each source width and prevents the two caps overlapping", () => {
    const left = groundCapPlacement(rows, 1, 4, 0, "left", 185, scale)!;
    const right = groundCapPlacement(rows, 1, 4, 0, "right", 184, scale)!;
    expect(left.width).not.toBe(right.width);
    expect(left.x + left.width).toBeLessThanOrEqual(right.x - right.width);
  });
  it.each([1, 2, 3])("suppresses both normal caps on a %i-tile run", (n) => {
    const grid = ["." + "#".repeat(n) + "."];
    expect(groundCapPlacement(grid, 1, n, 0, "left", 185, scale)).toBeNull();
    expect(groundCapPlacement(grid, 1, n, 0, "right", 184, scale)).toBeNull();
  });
  it("allows exactly half a run, then rejects a fractional oversize", () => {
    expect(groundCapPlacement([".#."], 1, 1, 0, "left", 8, 1)?.width).toBe(8);
    expect(groundCapPlacement([".#."], 1, 1, 0, "right", 8, 1)?.width).toBe(8);
    expect(groundCapPlacement([".#."], 1, 1, 0, "left", 8.001, 1)).toBeNull();
    expect(groundCapPlacement([".#."], 1, 1, 0, "right", 8.001, 1)).toBeNull();
  });
  it("suppresses an interior wall side even when there is space for its image", () => {
    expect(groundCapPlacement([".#####."], 2, 5, 0, "left", 185, scale)).toBeNull();
    expect(groundCapPlacement([".#####."], 1, 4, 0, "right", 184, scale)).toBeNull();
  });
});
