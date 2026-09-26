/** Year 2 classroom. Uses the existing orthogonal world grid and pathfinder.
 * Progress is supplied from graded attempts; this module never grades answers. */
import { findPath, type Cell, type GridSpec } from "./path.ts";
export type Direction = "down" | "left" | "right" | "up";
export const SCHOOL_TILE = 24;
// Footprint bounds measured on the 720×528 painted room, including chair backs.
const FOOTPRINTS = [
  [0, 0, 720, 123], [0, 123, 57, 405], [665, 123, 55, 405],
  [58, 100, 160, 88],
  ...[172, 317, 463].flatMap((x) => [177, 255, 333].map((y) => [x, y, 91, 62])),
  [0, 442, 270, 86], [457, 442, 263, 86],
];
export const SCHOOL_GRID: GridSpec = {
  w: 30, h: 22,
  blocked: (c, r) => c < 0 || r < 0 || c >= 30 || r >= 22 ||
    FOOTPRINTS.some(([x, y, w, h]) => c * 24 + 12 >= x! && c * 24 + 12 < x! + w! && r * 24 + 12 >= y! && r * 24 + 12 < y! + h!),
};
export const SCHOOL_START: Cell = { c: 14, r: 20 };
export const SCHOOL_STATIONS: Record<string, Cell> = {
  verdacht: { c: 11, r: 12 },
  "spur-1": { c: 23, r: 5 },
  "spur-2": { c: 3, r: 11 },
  "spur-3": { c: 9, r: 13 },
  "spur-4": { c: 23, r: 15 },
  alibi: { c: 15, r: 5 },
  zettel: { c: 18, r: 16 },
  "frei-1": { c: 11, r: 8 },
  "frei-2": { c: 9, r: 6 },
  "frei-3": { c: 3, r: 8 },
  "frei-4": { c: 26, r: 6 },
  "frei-5": { c: 6, r: 9 },
  "frei-6": { c: 16, r: 6 },
  "frei-7": { c: 13, r: 16 },
};
export const CLUES = ["spur-1", "spur-2", "spur-3", "spur-4"];
export const REQUIRED_STATIONS = ["verdacht", ...CLUES, "alibi", "zettel"];
export const MERLE_ROAM: Cell[] = [{ c: 11, r: 12 }, { c: 12, r: 12 }, { c: 12, r: 13 }, { c: 11, r: 13 }];
export function availableStation(station: string, solved: readonly string[]): boolean {
  if (!(station in SCHOOL_STATIONS)) return false;
  if (station === "verdacht") return true;
  if (!solved.includes("verdacht")) return false;
  if (station === "alibi") return CLUES.every((s) => solved.includes(s));
  if (station === "zettel") return solved.includes("alibi") && CLUES.every((s) => solved.includes(s));
  return true;
}
export function schoolComplete(solved: readonly string[]): boolean {
  return REQUIRED_STATIONS.every((s) => solved.includes(s));
}
export function schoolPath(from: Cell, to: Cell): Cell[] | null { return findPath(SCHOOL_GRID, from, to); }
export function schoolStep(from: Cell, direction: Direction): Cell {
  const [dc, dr] = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[direction]!;
  const next = { c: from.c + dc!, r: from.r + dr! };
  return SCHOOL_GRID.blocked(next.c, next.r) ? from : next;
}
export function directionBetween(from: Cell, to: Cell): Direction {
  return to.c < from.c ? "left" : to.c > from.c ? "right" : to.r < from.r ? "up" : "down";
}
export function validSchoolPosition(raw: unknown): Cell {
  if (raw && typeof raw === "object" && "c" in raw && "r" in raw &&
    typeof raw.c === "number" && typeof raw.r === "number" &&
    Number.isInteger(raw.c) && Number.isInteger(raw.r) && !SCHOOL_GRID.blocked(raw.c, raw.r)) return { c: raw.c, r: raw.r };
  return { ...SCHOOL_START };
}
