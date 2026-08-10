// TASK ROUTING v3 (PB-F1) — deterministic, no RNG (repo law), and BOUND TO THE
// WORLD.
//
// v2 served each `use` as one ordered playlist and was blind to the being that
// triggered it: a pencil creature could be answered with "a rubber", and an
// ordinary p3 card could fire inside the Tafel arena (Koki's REPLAY 1, F2-1 /
// F2-21). v3 keeps the playlist idea and adds the SCOPE, in this order:
//
//   1. `use`   — which pool the event asks for (encounter/door/rescue/boss/…)
//   2. PHASE   — a card may declare `phases`; undeclared = servable anywhere
//   3. SKIN    — a card may declare `skins`; if the triggering being's skin has
//                bound cards, ONLY those are eligible
//   4. FALLBACK— otherwise the UNBOUND cards of that use (no `skins`), which by
//                the schema's binding law never claim a being on screen
//
// Within the resolved pool the v2 rules are unchanged: cycle in file order,
// with one deterministic skip so the same kind never lands twice in a row.
// Cursors are kept PER POOL (use|phase|skin), so binding a skin cannot make one
// pool's progress eat another's.
import type { GameTaskV2 } from "@domigo/content-schema";

/** Where and for whom a card is being served. `skin` is the addressed being's
 *  skin (entity, cage, door, guardian); a hazard has none. */
export interface ServeCtx {
  phase: string;
  skin?: string;
}

export interface RouteState {
  cursors: Record<string, number>; // per-pool position
  lastKind: GameTaskV2["kind"] | null;
}

export const initRoute = (): RouteState => ({ cursors: {}, lastKind: null });

const inPhase = (t: GameTaskV2, phase: string): boolean => t.phases === undefined || t.phases.includes(phase);

/** The pool a request resolves to, and the cursor key that pool owns. Exported
 *  for the gate/tests: "which cards can this being ever be answered with?" */
export function resolvePool(
  items: readonly GameTaskV2[],
  use: string,
  ctx: ServeCtx,
): { pool: GameTaskV2[]; key: string } {
  const scoped = items.filter((t) => t.use === use && inPhase(t, ctx.phase));
  const bound = ctx.skin === undefined ? [] : scoped.filter((t) => t.skins?.includes(ctx.skin!) === true);
  if (bound.length > 0) return { pool: bound, key: `${use}|${ctx.phase}|${ctx.skin}` };
  return { pool: scoped.filter((t) => t.skins === undefined), key: `${use}|${ctx.phase}|*` };
}

/**
 * PK-R6 · D · THE ORDERED SERVE (doc 44 §3.3). A reawakening is not a playlist:
 * round 3 must be the card authored as round 3, because its picture is the
 * pose the classmate is striking in the world at that moment. `nextTask` cannot
 * do this and must not be taught to — its cursor-plus-skip is what keeps a
 * child from meeting the same KIND twice in a row, and on a pool of six choice
 * cards that skip would serve rounds 1, 3, 5, 1, … So the ceremony asks for its
 * round by INDEX, out of the same resolved pool every other card comes from,
 * and the routing state is left untouched (an ordered serve has no cursor to
 * advance — the world's own counter is the cursor).
 *
 * Out of range ⇒ null, and the caller resolves rather than softlocks.
 */
export function orderedTask(
  items: readonly GameTaskV2[],
  use: string,
  ctx: ServeCtx,
  index: number,
): GameTaskV2 | null {
  const { pool } = resolvePool(items, use, ctx);
  return index >= 0 && index < pool.length ? pool[index]! : null;
}

/** The next task for a `use` in this context, and the advanced routing state.
 *  task is null only when the resolved pool is empty (the caller falls back to
 *  the generic pool or just resolves — never a softlock). */
export function nextTask(
  items: readonly GameTaskV2[],
  use: string,
  ctx: ServeCtx,
  st: RouteState,
): { task: GameTaskV2 | null; next: RouteState } {
  const { pool, key } = resolvePool(items, use, ctx);
  if (pool.length === 0) return { task: null, next: st };
  let i = (st.cursors[key] ?? 0) % pool.length;
  let pick = pool[i]!;
  // one deterministic skip to avoid the same kind twice in a row
  if (pool.length > 1 && st.lastKind !== null && pick.kind === st.lastKind) {
    i = (i + 1) % pool.length;
    pick = pool[i]!;
  }
  const next: RouteState = {
    cursors: { ...st.cursors, [key]: (i + 1) % pool.length },
    lastKind: pick.kind,
  };
  return { task: pick, next };
}
