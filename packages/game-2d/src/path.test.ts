import { describe, expect, it } from "vitest";
import { findPath, nearestWalkable, type GridSpec } from "./path.ts";

/** Build a spec from an ascii map ("#" = blocked). */
function grid(rows: string[]): GridSpec {
  return {
    w: rows[0]!.length,
    h: rows.length,
    blocked: (c, r) => rows[r]?.[c] === "#",
  };
}

describe("findPath — 4-connected BFS over the walkable grid", () => {
  it("walks a straight corridor", () => {
    const g = grid(["....."]);
    expect(findPath(g, { c: 0, r: 0 }, { c: 3, r: 0 })).toEqual([
      { c: 1, r: 0 },
      { c: 2, r: 0 },
      { c: 3, r: 0 },
    ]);
  });

  it("detours around a wall", () => {
    const g = grid([
      ".....",
      ".###.",
      ".....",
    ]);
    const path = findPath(g, { c: 0, r: 1 }, { c: 4, r: 1 })!;
    expect(path[path.length - 1]).toEqual({ c: 4, r: 1 });
    // shortest detour is 6 steps (over or under the wall)
    expect(path).toHaveLength(6);
    expect(path.every((p) => !g.blocked(p.c, p.r))).toBe(true);
  });

  it("returns [] when already at the target and null when unreachable", () => {
    const g = grid([
      "..#..",
      "..#..",
      "..#..",
    ]);
    expect(findPath(g, { c: 1, r: 1 }, { c: 1, r: 1 })).toEqual([]);
    expect(findPath(g, { c: 0, r: 0 }, { c: 4, r: 0 })).toBeNull();
  });

  it("returns null when either end is blocked or off-grid", () => {
    const g = grid(["..#"]);
    expect(findPath(g, { c: 0, r: 0 }, { c: 2, r: 0 })).toBeNull();
    expect(findPath(g, { c: 2, r: 0 }, { c: 0, r: 0 })).toBeNull();
    expect(findPath(g, { c: 0, r: 0 }, { c: 0, r: 5 })).toBeNull();
  });

  it("breaks ties deterministically (up before left before right before down)", () => {
    // Two equally short L-paths from the center to the corner: the fixed
    // expansion order must always pick the same one — up first.
    const g = grid([
      "...",
      "...",
      "...",
    ]);
    const a = findPath(g, { c: 1, r: 1 }, { c: 0, r: 0 })!;
    const b = findPath(g, { c: 1, r: 1 }, { c: 0, r: 0 })!;
    expect(a).toEqual(b);
    expect(a[0]).toEqual({ c: 1, r: 0 }); // up expands before left
  });
});

describe("nearestWalkable — fat-finger retarget", () => {
  it("returns the cell itself when walkable and clamps off-grid taps", () => {
    const g = grid(["...", "...", "..."]);
    expect(nearestWalkable(g, 1, 1)).toEqual({ c: 1, r: 1 });
    expect(nearestWalkable(g, 99, -5)).toEqual({ c: 2, r: 0 });
  });

  it("resolves a tap on a solid prop to the floor beside it, deterministically", () => {
    const g = grid([
      "...",
      ".#.",
      "...",
    ]);
    // up is the first expansion step → the cell above the desk wins the tie
    expect(nearestWalkable(g, 1, 1)).toEqual({ c: 1, r: 0 });
  });

  it("escapes a blocked cluster to the nearest open ring", () => {
    const g = grid([
      "###.",
      "##..",
      "####",
    ]);
    expect(nearestWalkable(g, 0, 0)).toEqual({ c: 3, r: 0 });
  });

  it("returns null on a fully blocked grid", () => {
    const g = grid(["##", "##"]);
    expect(nearestWalkable(g, 0, 0)).toBeNull();
  });
});
