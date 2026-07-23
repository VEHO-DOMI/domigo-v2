// TASK ROUTING v2 (PB-T7 / Build-B3) — deterministic, no RNG (repo law).
//
// Pools are ORDERED PLAYLISTS: the file order within each `use` IS the serve
// order (the author sequences variety directly in the content file). Two rules
// over the round-robin: (1) cycle through the pool in order; (2) a single
// no-repeat-kind skip — if the next item's kind equals the last-served kind and
// the pool has variety, serve the following item instead (so two wheels never
// land back to back). Replaces PaintGame's inline pickTask.
import type { GameTaskV2 } from "@domigo/content-schema";

export interface RouteState {
  cursors: Record<string, number>; // per-use position
  lastKind: GameTaskV2["kind"] | null;
}

export const initRoute = (): RouteState => ({ cursors: {}, lastKind: null });

/** The next task for a `use`, and the advanced routing state. task is null only
 *  when the pool is empty (the caller falls back to a generic pool or resolves). */
export function nextTask(
  items: readonly GameTaskV2[],
  use: string,
  st: RouteState,
): { task: GameTaskV2 | null; next: RouteState } {
  const pool = items.filter((t) => t.use === use);
  if (pool.length === 0) return { task: null, next: st };
  let i = (st.cursors[use] ?? 0) % pool.length;
  let pick = pool[i]!;
  // one deterministic skip to avoid the same kind twice in a row
  if (pool.length > 1 && st.lastKind !== null && pick.kind === st.lastKind) {
    i = (i + 1) % pool.length;
    pick = pool[i]!;
  }
  const next: RouteState = {
    cursors: { ...st.cursors, [use]: (i + 1) % pool.length },
    lastKind: pick.kind,
  };
  return { task: pick, next };
}
