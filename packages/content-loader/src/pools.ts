/**
 * J-1 · pools — the pure partition of a unit's items into the five journey pools
 * (`practice | homework | classwork | mock | arcade`). PURE and IO-free (no
 * node:fs, no server-only) like overrides.ts / drafts.ts, so it unit-tests without
 * a filesystem or DB and can run anywhere.
 *
 * Precedence (assignPool): a class's active `reserved_items` force `mock`
 * (reserved-wins) → an authored journey override → the default `practice`. `mock`
 * comes ONLY from the reserved set — it is never authorable in a journey (the
 * schema's `poolOverrides` type excludes it), so the "mock vault" is exactly the
 * teacher's reserved items and is what self-study / review / game feeds exclude.
 *
 * "Deterministic remainder split": the default for an item that is neither
 * reserved nor authored-over is deterministically `practice`; the non-practice,
 * non-mock pools (homework / classwork / arcade) come only from authored
 * `poolOverrides` (J-2's generator authors them). The result is a TOTAL partition
 * (every item in exactly one pool).
 */
import type { AuthorablePool, JourneyPool } from "@domigo/content-schema";

/** Assign ONE item to its pool. */
export function assignPool(
  itemId: string,
  reserved: ReadonlySet<string>,
  overrides?: Record<string, AuthorablePool>,
): JourneyPool {
  if (reserved.has(itemId)) return "mock"; // reserved-wins
  return overrides?.[itemId] ?? "practice";
}

/** Partition a unit's item ids into pools — a TOTAL partition (every id in
 *  exactly one pool). */
export function partitionUnit(
  itemIds: readonly string[],
  reserved: ReadonlySet<string>,
  overrides?: Record<string, AuthorablePool>,
): Map<string, JourneyPool> {
  const m = new Map<string, JourneyPool>();
  for (const id of itemIds) m.set(id, assignPool(id, reserved, overrides));
  return m;
}

/** The item ids that fall into `pool` for a unit (what a journey node whose
 *  itemPool === pool draws from). Deterministic — corpus order preserved. */
export function itemsInPool(
  itemIds: readonly string[],
  pool: JourneyPool,
  reserved: ReadonlySet<string>,
  overrides?: Record<string, AuthorablePool>,
): string[] {
  return itemIds.filter((id) => assignPool(id, reserved, overrides) === pool);
}
