/**
 * Pure grid pathfinding for the overworld's tap-to-move (A1-1) — Phaser-free so
 * it unit-tests headlessly. 4-connected BFS over the zone's walkable grid.
 *
 * DETERMINISM CONTRACT (Law 9): neighbor expansion order is fixed —
 * up, left, right, down — so ties always break the same way; the same tap on
 * the same grid always yields the same path. Never Math.random.
 */

export interface Cell {
  c: number;
  r: number;
}

export interface GridSpec {
  w: number;
  h: number;
  /** true = the cell cannot be walked (wall / solid prop / out of bounds). */
  blocked: (c: number, r: number) => boolean;
}

/** Fixed expansion order: up, left, right, down (the determinism contract). */
const STEPS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [-1, 0],
  [1, 0],
  [0, 1],
];

function inGrid(spec: GridSpec, c: number, r: number): boolean {
  return c >= 0 && r >= 0 && c < spec.w && r < spec.h;
}

function walkable(spec: GridSpec, c: number, r: number): boolean {
  return inGrid(spec, c, r) && !spec.blocked(c, r);
}

/**
 * Fat-finger retarget: the nearest walkable cell to a tapped cell, by BFS ring
 * (blocked cells are traversed during the SEARCH so a tap inside a solid desk
 * resolves to the floor beside it). Deterministic via the fixed step order.
 * Returns the cell itself when already walkable; null when the grid has none.
 */
export function nearestWalkable(spec: GridSpec, c: number, r: number): Cell | null {
  const c0 = Math.max(0, Math.min(spec.w - 1, c));
  const r0 = Math.max(0, Math.min(spec.h - 1, r));
  if (walkable(spec, c0, r0)) return { c: c0, r: r0 };
  const seen = new Set<number>([r0 * spec.w + c0]);
  const queue: Cell[] = [{ c: c0, r: r0 }];
  for (let qi = 0; qi < queue.length; qi++) {
    const cur = queue[qi]!;
    for (const [dc, dr] of STEPS) {
      const nc = cur.c + dc;
      const nr = cur.r + dr;
      if (!inGrid(spec, nc, nr) || seen.has(nr * spec.w + nc)) continue;
      if (!spec.blocked(nc, nr)) return { c: nc, r: nr };
      seen.add(nr * spec.w + nc);
      queue.push({ c: nc, r: nr });
    }
  }
  return null;
}

/**
 * Shortest 4-connected path from `from` to `to` over walkable cells, EXCLUDING
 * the start cell (the follower walks the returned waypoints in order). Returns
 * [] when already there, null when unreachable or either end is blocked.
 */
export function findPath(spec: GridSpec, from: Cell, to: Cell): Cell[] | null {
  if (!walkable(spec, from.c, from.r) || !walkable(spec, to.c, to.r)) return null;
  if (from.c === to.c && from.r === to.r) return [];
  const key = (c: number, r: number): number => r * spec.w + c;
  const parent = new Map<number, number>([[key(from.c, from.r), -1]]);
  const queue: Cell[] = [from];
  for (let qi = 0; qi < queue.length; qi++) {
    const cur = queue[qi]!;
    for (const [dc, dr] of STEPS) {
      const nc = cur.c + dc;
      const nr = cur.r + dr;
      if (!walkable(spec, nc, nr) || parent.has(key(nc, nr))) continue;
      parent.set(key(nc, nr), key(cur.c, cur.r));
      if (nc === to.c && nr === to.r) {
        const path: Cell[] = [];
        let k = key(nc, nr);
        while (k !== key(from.c, from.r)) {
          path.push({ c: k % spec.w, r: Math.floor(k / spec.w) });
          k = parent.get(k)!;
        }
        return path.reverse();
      }
      queue.push({ c: nc, r: nr });
    }
  }
  return null;
}
