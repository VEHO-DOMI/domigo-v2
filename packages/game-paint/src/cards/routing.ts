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
// Within the resolved pool there is now exactly ONE rule: cycle in file order.
// FILE ORDER IS SERVE ORDER.
//
// R5-W2 · G1 retired the fourth rule — "one deterministic skip so the same kind
// never lands twice in a row" — and the reason is worth keeping, because it will
// look like a regression to anyone who reads only the old comment. The skip
// advanced the cursor PAST the card it skipped, so on a pool where it fired
// every other serve the cursor moved by two and could only ever visit one
// parity class. Measured against the shipped chapter: 10 of 62 field cards were
// unreachable, among them five of the ten door cards — which quietly repealed
// law M-E (doc 41 §1: the door series covers ALL the unit's imperatives,
// questions and negations). And it could not even buy what it cost: the skip
// only fires when ONE being's pool is served twice running, and Koki's own
// replay findings all want the opposite there —
//   · B13 wants a second meeting to bring NEW content (the skip served
//     c1, q1, c1, q1 … and stranded c2 forever);
//   · B10 wants the moth corridor to ask 3–4 number wheels IN A ROW (the skip
//     forced a choice card between every wheel);
//   · B12 wants a being's KIND to be predictable and only its content to vary,
//     which is precisely what an anti-same-kind rule cannot allow.
// Kind variety is therefore an AUTHORING property, declared in file order and
// policed by the variety laws (./variety.ts, layers 13–17 of the gate) — not a
// runtime correction. The router's one job is to be fair to the cards.
//
// Cursors are kept PER POOL, and the key is the POOL'S IDENTITY rather than the
// request's context (see `resolvePool`), so binding a skin cannot make one
// pool's progress eat another's — and a pool that is the same set of cards in
// every phase keeps ONE series across the chapter instead of restarting at card
// one behind every door.
import { seededShuffle } from "@domigo/content-schema";
import type { GameTaskV2 } from "@domigo/content-schema";

/** Where and for whom a card is being served. `skin` is the addressed being's
 *  skin (entity, cage, door, guardian); a hazard has none. */
export interface ServeCtx {
  phase: string;
  skin?: string;
}

export interface RouteState {
  cursors: Record<string, number>; // per-pool position
}

export const initRoute = (): RouteState => ({ cursors: {} });

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
  const pool = bound.length > 0 ? bound : scoped.filter((t) => t.skins === undefined);
  const skinKey = bound.length > 0 ? ctx.skin! : "*";
  // R5-W2 · G1 — THE KEY IS THE POOL, NOT THE REQUEST. The phase belongs in the
  // cursor key only when the phase actually changes which cards are eligible.
  // The ten door cards declare no `phases`, so `door|p1|door`, `door|p2|door`
  // and `door|p3|door` resolved to the IDENTICAL ten cards behind three
  // separate cursors — every exit in the chapter therefore asked the child slot
  // one of the same series. A card's *absence* of `phases` already is the
  // declaration "I am not phase-scoped", so the key reads it off the pool
  // instead of taking a second declaration on trust.
  const phaseKey = pool.some((t) => t.phases !== undefined) ? ctx.phase : "*";
  return { pool, key: `${use}|${phaseKey}|${skinKey}` };
}

/**
 * PK-R6 · D · THE ORDERED SERVE (doc 44 §3.3). A reawakening is not a playlist:
 * round 3 must be the card authored as round 3, because its picture is the pose
 * the classmate is striking in the world at that moment. `nextTask` cannot do
 * this and must not be taught to — and the reason is not the anti-repeat skip
 * (retired in R5-W2 · G1; the old wording here blamed it and would now read as
 * an argument for deleting this function). The real reason survives the skip:
 * THE ROUND IS THE WORLD'S COUNTER, not the playlist's position. `sim.ts:497`
 * asks for `round: mate.awakenStep + 1`, and `dismissTask` (`sim.ts:585`) leaves
 * `awakenStep` alone on purpose — so „Später" and then ↑ must re-ask the SAME
 * round (`awakening.test.ts:210-218`: "round: 3 — not 4, not 1"). A cursor has
 * already moved by then and would answer that resume with round 4, putting a
 * picture on the card that the girl in the world is not striking. The same
 * argument covers a phase remount and any second classmate sharing the pool.
 * So the ceremony asks for its round by INDEX, out of the same resolved pool
 * every other card comes from, and the routing state is left untouched (an
 * ordered serve has no cursor to advance — the world's own counter is it).
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

/**
 * R5-W5 · G4 · D-195 · WHERE A POOL OPENS.
 *
 * Koki: a freshly loaded game always served the same first three cards. Until
 * now every pool started at index 0, so the first fight of a run asked card 0,
 * the next pool's first serve asked ITS card 0, and a child who replayed the
 * chapter met the identical opening three times.
 *
 * What this is NOT: a random start. `routing.ts` is deterministic by repo law
 * (header, line 1), the proof tapes replay recorded input against an exact
 * expected world, and there is no run seed anywhere in the package to seed from
 * — `sim.ts` has none and `PaintGameProps` has none. A per-session shuffle would
 * need a new prop and would invalidate every tape; that is filed for the
 * architect, not smuggled in here.
 *
 * What this IS: the debt entry's own words — „deterministisch gedrehte
 * Startposition JE KAMPF". The pool key already names the fight (`use|phase|
 * skin`), so each pool opens at its own fixed offset instead of all of them
 * opening at zero. Same input, same cards, every time; different pools, different
 * openings. The offset comes from `seededShuffle`, the hash the cards already
 * run on, rather than a third FNV variant of its own — the package has two
 * incompatible ones already, and that is exactly one too many.
 */
const startOf = (key: string, n: number): number =>
  n <= 1 ? 0 : (seededShuffle(Array.from({ length: n }, (_, i) => i), key)[0] ?? 0);

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
  // exactly one step per serve — the fairness the whole pool depends on: a
  // cursor that ever advances by more than one strands a parity class of cards
  // forever (see the header, and ./variety.ts's reachability law).
  const i = (st.cursors[key] ?? startOf(key, pool.length)) % pool.length;
  const pick = pool[i]!;
  const next: RouteState = { cursors: { ...st.cursors, [key]: (i + 1) % pool.length } };
  return { task: pick, next };
}
