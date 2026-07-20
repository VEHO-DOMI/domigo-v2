import { describe, expect, it } from "vitest";
import {
  checkLevelLaws,
  findGlyph,
  type PaintLevel,
  parsePaintLevel,
  reachableCells,
  standable,
} from "./level.ts";

const phase = (rows: string[], over: Record<string, unknown> = {}) => ({
  id: "p1",
  nameDe: "Test",
  surface: "normal" as const,
  plates: {},
  rows,
  entities: [],
  links: [],
  exit: { to: "done" },
  ...over,
});

const level = (rows: string[], over: Partial<PaintLevel> = {}): PaintLevel => ({
  schema: "paintLevel@1",
  id: "g1-ch99",
  chapter: "ch99",
  draft: true,
  name: "Test",
  goalDe: "x",
  whyDe: "x",
  hintsDe: [],
  collectNounDe: "x",
  abilities: ["jump", "hover"],
  phases: [phase(rows) as PaintLevel["phases"][number]],
  ...over,
});

// a LAWFUL minimal world: ≥20 rows, closed top, floor, exit on the path
const OK_ROWS = [
  "############",
  ...Array.from({ length: 16 }, () => "............"),
  "..S....*..X.",
  "############",
  "############",
];

describe("parsePaintLevel (loud semantics)", () => {
  it("accepts a well-formed level", () => {
    expect(() => parsePaintLevel(level(OK_ROWS))).not.toThrow();
  });

  it("rejects ragged rows", () => {
    const bad = [...OK_ROWS];
    bad[2] = "...........";
    expect(() => parsePaintLevel(level(bad))).toThrow(/ragged/);
  });

  it("rejects illegal glyphs", () => {
    const bad = [...OK_ROWS];
    bad[3] = "....Z.......";
    expect(() => parsePaintLevel(level(bad))).toThrow(/illegal glyph/);
  });

  it("demands exactly one start and one exit per phase", () => {
    const noStart = [...OK_ROWS];
    noStart[17] = ".......*..X.";
    expect(() => parsePaintLevel(level(noStart))).toThrow(/exactly one start/);
    const twoExits = [...OK_ROWS];
    twoExits[5] = "X...........";
    expect(() => parsePaintLevel(level(twoExits))).toThrow(/exactly one exit/);
  });

  it("rejects broken and looping exit chains", () => {
    const lvl = level(OK_ROWS);
    lvl.phases[0]!.exit.to = "p9";
    expect(() => parsePaintLevel(lvl)).toThrow(/unknown phase/);
    const loop = level(OK_ROWS);
    loop.phases[0]!.exit.to = "p1";
    expect(() => parsePaintLevel(loop)).toThrow(/loops/);
  });

  it("rejects off-grid entities and dangling links", () => {
    const lvl = level(OK_ROWS);
    lvl.phases[0]!.entities = [{ id: "c1", role: "cage", skin: "satchel", c: 99, r: 1, tier: "E" }];
    expect(() => parsePaintLevel(lvl)).toThrow(/off-grid/);
    const lnk = level(OK_ROWS);
    lnk.phases[0]!.entities = [{ id: "c1", role: "cage", skin: "satchel", c: 2, r: 6, tier: "E" }];
    lnk.phases[0]!.links = [{ trigger: "ghost", on: "opened", action: "open", targets: ["c1"] }];
    expect(() => parsePaintLevel(lnk)).toThrow(/trigger ghost unknown/);
  });
});

describe("reachability (the honest movement envelope)", () => {
  it("walks flats, climbs a one-tile step, and jumps small gaps", () => {
    const rows = [
      "............",
      "............",
      "............",
      "............",
      "............",
      "........####",
      "..S....#####",
      "####...#####",
      "############",
    ];
    const reach = reachableCells(rows, ["jump"]);
    expect(reach.has("2,6")).toBe(true); // the start deck
    expect(reach.has("8,4")).toBe(true); // up the step stack
  });

  it("cannot cross a wide gap without hover — and can with it", () => {
    const rows = [
      "..............",
      "..............",
      "..............",
      "..............",
      "..S...........",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "###......#####",
      "##############",
    ];
    const without = reachableCells(rows, ["jump"]);
    expect(without.has("10,4")).toBe(false); // 6 columns of gap > the 3-tile jump
    const withHover = reachableCells(rows, ["jump", "hover"]);
    expect(withHover.has("10,4")).toBe(true);
  });

  it("bridges an even wider gap with a ring", () => {
    const rows = [
      "................",
      "................",
      "................",
      ".......o........",
      "..S.............",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "###..........###",
      "################",
    ];
    const noRing = reachableCells(rows.map((r) => r.replace("o", ".")), ["jump", "hover"]);
    expect(noRing.has("14,4")).toBe(false); // 10 columns > the hover envelope
    const withRing = reachableCells(rows, ["jump", "hover"]);
    expect(withRing.has("14,4")).toBe(true);
  });

  it("standable respects support and headroom (the world edge is solid)", () => {
    const rows = ["....", "....", "..#.", "..#.", "####"];
    expect(standable(rows, 0, 3)).toBe(true); // floor top
    expect(standable(rows, 2, 1)).toBe(true); // atop the pillar
    expect(standable(rows, 2, 3)).toBe(false); // inside the pillar
    expect(standable(rows, 0, -1)).toBe(false); // above the world: no headroom
  });
});

describe("checkLevelLaws", () => {
  it("passes the draft toy shape and fails a floating exit (tamper)", () => {
    expect(checkLevelLaws(parsePaintLevel(level(OK_ROWS)))).toEqual([]);
    const gutted = [...OK_ROWS];
    gutted[17] = "..S....*...."; // exit moved unreachably high
    gutted[5] = "..........X.";
    const fails = checkLevelLaws(parsePaintLevel(level([...gutted])));
    expect(fails.some((f) => f.law === "exit-reachable")).toBe(true);
  });

  it("flags unreachable letters", () => {
    const rows = [
      "############",
      ...Array.from({ length: 7 }, () => "............"),
      "*...........",
      ...Array.from({ length: 8 }, () => "............"),
      "..S.......X.",
      "############",
      "############",
    ];
    const fails = checkLevelLaws(parsePaintLevel(level(rows)));
    expect(fails.some((f) => f.law === "collectible-reachable")).toBe(true);
  });

  it("enforces the chapter shape on non-drafts (3 phases, 6 cages, 1 person)", () => {
    const strict = level(OK_ROWS, { draft: false });
    const fails = checkLevelLaws(strict);
    expect(fails.some((f) => f.law === "phase-count")).toBe(true);
    expect(fails.some((f) => f.law === "six-cages")).toBe(true);
    expect(fails.some((f) => f.law === "person-cage")).toBe(true);
  });

  it("W0-F3: flags a trap pocket (enterable, no way back to the exit)", () => {
    const F = "############";
    const W = "####....####"; // pit walls
    const deck = "..S......X..";
    const air = (n: number) => Array.from({ length: n }, () => "............");
    // a 7-deep pit: falling in = softlock (jump-out is 4 rows max)
    const trapped = [F, ...air(10), deck, W, W, W, W, W, W, W, F, F];
    const fails = checkLevelLaws(parsePaintLevel(level(trapped)));
    expect(fails.some((f) => f.law === "trap-pocket")).toBe(true);
    // a 3-deep pit is jump-out-able — lawful
    const shallow = [F, ...air(10), deck, W, W, W, F, F, F, F, F, F];
    const okFails = checkLevelLaws(parsePaintLevel(level(shallow)));
    expect(okFails.some((f) => f.law === "trap-pocket")).toBe(false);
  });

  it("W0-F7/F8: enforces the closed top and the minimum height", () => {
    const open = [...OK_ROWS];
    open[0] = "............";
    expect(checkLevelLaws(parsePaintLevel(level(open))).some((f) => f.law === "closed-top")).toBe(true);
    const short = OK_ROWS.slice(0, 8).concat(["..S....*..X.", "############"]);
    short[0] = "############";
    expect(checkLevelLaws(parsePaintLevel(level([...short]))).some((f) => f.law === "min-height")).toBe(true);
  });

  it("findGlyph locates markers", () => {
    expect(findGlyph(OK_ROWS, "S")).toEqual({ c: 2, r: 17 });
    expect(findGlyph(OK_ROWS, "B")).toBeNull();
  });
});
