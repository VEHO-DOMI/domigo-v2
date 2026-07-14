import { describe, expect, it } from "vitest";
import type { ZoneLayout } from "@domigo/content-schema";
import { cellKey, mergeZoneState, migrateSave, parseCellKey, parseZoneLayout, spawnFor, zoneResume, zoneShort } from "./world.ts";

// A tiny (but ≥15-wide) test map: top wall carries a door '1' to z03; a solid
// locker 'a' and a walkable rug 'b' prop; grass nodeStyle; 2 declared battles.
const LAYOUT: ZoneLayout = {
  rows: [
    "#######1#######",
    "#.....E.......#",
    "#..a......E...#",
    "#......P......#",
    "#..b......F...#",
    "#.............#",
    "#.............#",
    "#.............#",
    "#.............#",
    "#.............#",
    "###############",
  ],
  legend: {
    "1": { door: "z03" },
    "a": { prop: "locker", solid: true },
    "b": { prop: "rug", solid: false },
  },
  nodeStyle: "grass",
  encounters: 2,
};

describe("parseZoneLayout", () => {
  const z = parseZoneLayout(LAYOUT);

  it("reads dimensions from the rows (no 15×11 hardcode)", () => {
    expect(z.w).toBe(15);
    expect(z.h).toBe(11);
  });

  it("collects walls + SOLID props as blocked; walkable props stay open", () => {
    expect(z.blocked.has(2 * 15 + 3)).toBe(true); // locker 'a'
    expect(z.blocked.has(4 * 15 + 3)).toBe(false); // rug 'b'
    expect(z.blocked.has(0)).toBe(true); // wall corner
  });

  it("doors are neither blocked nor floor — they carry their target", () => {
    expect(z.doors).toEqual([{ c: 7, r: 0, to: "z03" }]);
    expect(z.blocked.has(7)).toBe(false); // runtime decides sealed vs open
  });

  it("finds E cells in scan order, the NPC, and the start", () => {
    expect(z.encounterCells).toEqual([{ c: 6, r: 1 }, { c: 10, r: 2 }]);
    expect(z.npcCells).toEqual([{ c: 10, r: 4 }]);
    expect(z.start).toEqual({ c: 7, r: 3 });
  });

  it("carries nodeStyle + clamps encounters to the E cells available", () => {
    expect(z.nodeStyle).toBe("grass");
    expect(z.encounters).toBe(2);
    const greedy = parseZoneLayout({ ...LAYOUT, encounters: 9 });
    expect(greedy.encounters).toBe(2); // only 2 E cells exist
  });

  it("is tolerant at runtime: short rows pad as wall, unknown glyphs read as floor", () => {
    const ragged = parseZoneLayout({
      rows: ["#######", "#..?..#", "#######", "#", "#", "#", "#", "#", "#", "#", "#"],
      legend: {},
    });
    expect(ragged.w).toBe(7);
    expect(ragged.blocked.has(3 * 7 + 5)).toBe(true); // padding of the short row
    expect(ragged.blocked.has(1 * 7 + 3)).toBe(false); // '?' → floor
    expect(ragged.start).toEqual({ c: 3, r: 5 }); // no P → centre fallback
  });
});

describe("spawnFor — entering through a door", () => {
  const z = parseZoneLayout(LAYOUT);

  it("spawns on the walkable cell BELOW the door back to where you came from", () => {
    expect(spawnFor(z, "z03")).toEqual({ c: 7, r: 1 }); // below the top-wall door
  });

  it("never spawns ON a door; falls back through above/right/left", () => {
    // door at the BOTTOM wall: below is out of bounds → above wins
    const bottom = parseZoneLayout({
      rows: [
        "###############",
        "#......P......#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#.............#",
        "#######2#######",
      ],
      legend: { "2": { door: "z07" } },
    });
    expect(spawnFor(bottom, "z07")).toEqual({ c: 7, r: 9 });
  });

  it("no matching door or no from ⇒ the authored start", () => {
    expect(spawnFor(z, "z99")).toEqual(z.start);
    expect(spawnFor(z, null)).toEqual(z.start);
    expect(spawnFor(z)).toEqual(z.start);
  });
});

describe("save v2 — migration + zone slices", () => {
  it("wraps a v1 flat save into a v2 container (cleared indices ride along)", () => {
    const v2 = migrateSave({ zoneId: "g2.map.the-spill.z07", pos: [312, 456], cleared: [0, 2] })!;
    expect(v2.v).toBe(2);
    expect(v2.zoneId).toBe("g2.map.the-spill.z07");
    expect(v2.zones["z07"]!.cleared).toEqual([0, 2]);
  });

  it("passes a v2 save through, sanitizing junk", () => {
    const v2 = migrateSave({
      v: 2,
      zoneId: "g2.map.the-spill.z03",
      pos: [10, 20],
      zones: { z03: { cleared: ["1,2", 3, { evil: true }] }, z07: { cleared: ["4,5"] }, bad: null },
    })!;
    expect(v2.zones["z03"]!.cleared).toEqual(["1,2", 3]);
    expect(v2.zones["z07"]!.cleared).toEqual(["4,5"]);
    expect("bad" in v2.zones).toBe(false);
  });

  it("returns null for garbage (fresh world — saves are cosmetic by law)", () => {
    expect(migrateSave(null)).toBeNull();
    expect(migrateSave("nope")).toBeNull();
    expect(migrateSave({ zoneId: 7, pos: [1, 2] })).toBeNull();
    expect(migrateSave({ zoneId: "z", pos: [1] })).toBeNull();
    expect(migrateSave({ zoneId: "z", pos: [1, Number.NaN] })).toBeNull();
  });

  it("zoneResume: position only in the zone you left; progress everywhere", () => {
    const save = migrateSave({ v: 2, zoneId: "g2.map.the-spill.z07", pos: [99, 88], zones: { z07: { cleared: ["1,1"] }, z03: { cleared: ["2,2"] } } })!;
    expect(zoneResume(save, "g2.map.the-spill.z07")).toEqual({ pos: [99, 88], cleared: ["1,1"] });
    expect(zoneResume(save, "g2.map.the-spill.z03")).toEqual({ pos: null, cleared: ["2,2"] });
    expect(zoneResume(null, "g2.map.the-spill.z03")).toEqual({ pos: null, cleared: [] });
  });

  it("mergeZoneState folds one zone's report in without losing the others", () => {
    const save = migrateSave({ v: 2, zoneId: "g2.map.the-spill.z07", pos: [9, 9], zones: { z07: { cleared: ["1,1"] } } })!;
    const merged = mergeZoneState(save, { zoneId: "g2.map.the-spill.z03", pos: [5, 5], cleared: ["3,4"] });
    expect(merged.zoneId).toBe("g2.map.the-spill.z03");
    expect(merged.zones["z07"]!.cleared).toEqual(["1,1"]);
    expect(merged.zones["z03"]!.cleared).toEqual(["3,4"]);
    expect(mergeZoneState(null, { zoneId: "x.z01", pos: [1, 1], cleared: [] }).zones["z01"]).toEqual({ cleared: [] });
  });
});

describe("cell keys + zone shorts", () => {
  it("round-trips", () => {
    expect(parseCellKey(cellKey(12, 7))).toEqual({ c: 12, r: 7 });
    expect(parseCellKey("junk")).toBeNull();
    expect(zoneShort("g2.map.the-spill.z07")).toBe("z07");
    expect(zoneShort("z07")).toBe("z07");
  });
});
