/**
 * K-3 · the Tintenlauf levels — header/layout split per the bible §4.1.
 * Geometry rows are GENERATED + LAW-CHECKED (scratchpad builder ran the same
 * BFS as checkLevelLaws; the unit tests re-verify both levels on every run).
 * Glyphs: '#' solid · '=' one-way · '^' ink spikes · 'L' letter · 'S' start
 * · 'A' artifact pedestal · 'C' checkpoint. Creatures/seals/helpers live in
 * the header with difficulty tiers (one map, three populations — §6).
 */
import { parseArcadeLevel, type ArcadeHeader, type ArcadeLevel } from "./arcade.ts";

// ---------------------------------------------------------------------------
// Level 1 · "Der Lesesaal" — the reading room the Blank ransacked. Tier E is
// the default first contact: full helper bridges, base population only.
// Verticality: rolling steps, a high one-way bridge, a secret shelf (two
// letters) reached by a ledge chain, a one-way high road over the last
// spike run. Two seals guard the pedestal: the Wortdieb and the far walker.
// ---------------------------------------------------------------------------
const LESESAAL_ROWS: string[] = [
  "#..............................................................#",
  "#..............................................................#",
  "#..............................................................#",
  "#..............................................................#",
  "#..............................................................#",
  "#..............................................................#",
  "#..............................................................#",
  "#..............LL..............................................#",
  "#.............###..............................................#",
  "#................#...L.L.......................................#",
  "#...................====.......................................#",
  "#.................#.................................L..........#",
  "#....................................L..........C.=====......A.#",
  "#.......................C............#........L.#............###",
  "#..............L.########..L........###....######..........#####",
  "#.S.#.###.L...###########..##.##..#####...#########......#######",
  "############^^##################^^#####^^^#########^^^##########",
  "################################################################",
];

const LESESAAL_HEADER: ArcadeHeader = {
  id: "lesesaal",
  name: "Der Lesesaal",
  fragment: "Seite 12 · „Die Bibliothekarin“",
  placements: [
    // base population (tier E — always present)
    { kind: "walker", c: 20, r: 12, tier: "E" }, // plateau patrol
    { kind: "hopper", c: 28, r: 14, tier: "E" }, // the dip after checkpoint 1
    { kind: "cloud", c: 30, r: 6, tier: "E" }, // area denial over the bumps
    { kind: "thief", c: 44, r: 12, tier: "E" }, // races you for the letters
    { kind: "cushion", c: 21, r: 12, tier: "E" }, // bounce to the high bridge
    { kind: "flyer", c: 37, r: 8, tier: "E" }, // bonus target over the tower
    { kind: "walker", c: 45, r: 12, tier: "E" }, // seal guard, pre-checkpoint 2
    // tier M adds…
    { kind: "walker", c: 55, r: 14, tier: "M" },
    { kind: "hopper", c: 9, r: 14, tier: "M" },
    // tier S adds…
    { kind: "flyer", c: 52, r: 8, tier: "S" },
    { kind: "walker", c: 14, r: 13, tier: "S" },
  ],
  seals: [
    { c: 46, r: 10, guard: 6 }, // released by freezing the far walker
    { c: 42, r: 10, guard: 3 }, // released by freezing the Wortdieb
  ],
  helpers: [
    { c: 12, r: 15, w: 2, maxTier: "E" }, // easy bridge over the first spikes
    { c: 39, r: 15, w: 3, maxTier: "E" }, // easy bridge over the wide pit
  ],
};

// ---------------------------------------------------------------------------
// Level 2 · "Der Tintenschacht" — the ramp proof (bible §6): played at tier M
// by default, one helper less, +1 enemy verb density, a climb-then-descend
// shaft where the spike floor punishes rushing the drop.
// ---------------------------------------------------------------------------
const SCHACHT_ROWS: string[] = [
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..............................................#",
  "#..................L.C...L.....................#",
  "#................###.##====.L..................#",
  "#..............L...........###.................#",
  "#.............###..............L...............#",
  "#.............................###..............#",
  "#................#................L..........A.#",
  "#.....L..........................###.......L.###",
  "#.....#.....L.###...................###.L.######",
  "#.S.####...######...................#####.######",
  "########^^^###################^^^^^^############",
  "################################################",
];

const SCHACHT_HEADER: ArcadeHeader = {
  id: "schacht",
  name: "Der Tintenschacht",
  fragment: "Seite 13 · „Der Keller“",
  placements: [
    { kind: "walker", c: 12, r: 18, tier: "E" },
    { kind: "hopper", c: 21, r: 10, tier: "E" }, // guards the checkpoint shelf
    { kind: "cushion", c: 15, r: 16, tier: "E" }, // the shaft's vertical assist
    { kind: "thief", c: 30, r: 12, tier: "E" },
    { kind: "cloud", c: 34, r: 8, tier: "E" }, // hangs over the descent
    { kind: "flyer", c: 25, r: 8, tier: "E" },
    // the ramp: tier M is this level's DEFAULT population
    { kind: "walker", c: 43, r: 16, tier: "M" }, // seal guard on the last shelf
    { kind: "hopper", c: 37, r: 16, tier: "M" },
    { kind: "flyer", c: 18, r: 6, tier: "M" },
    // tier S
    { kind: "walker", c: 6, r: 16, tier: "S" },
    { kind: "hopper", c: 28, r: 11, tier: "S" },
  ],
  seals: [
    { c: 44, r: 14, guard: 6 }, // the tier-M walker on the last shelf
    { c: 20, r: 9, guard: 1 }, // the checkpoint hopper
    { c: 33, r: 13, guard: 3 }, // the thief
  ],
  helpers: [
    { c: 8, r: 19, w: 3, maxTier: "E" }, // only ONE easy bridge here — the ramp
  ],
};

export const LEVELS: Record<string, { level: ArcadeLevel; defaultTier: "E" | "M" | "S" }> = {
  lesesaal: { level: parseArcadeLevel(LESESAAL_HEADER, LESESAAL_ROWS), defaultTier: "E" },
  schacht: { level: parseArcadeLevel(SCHACHT_HEADER, SCHACHT_ROWS), defaultTier: "M" },
};

export const DEFAULT_LEVEL_ID = "lesesaal";
