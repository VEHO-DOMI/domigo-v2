/**
 * J-1 · journey progress — node status + stars DERIVED from the practice_attempts
 * ledger (mode='journey:<unit>:<node>'). There is NO journey-state table: a node's
 * completion is computed from whether its items have been attempted, exactly like
 * game-progress.ts derives solved items from the ledger. The pure half
 * (bestTierPerItem / deriveJourneyProgress) unit-tests without a DB.
 *
 * Model:
 *  · GATING nodes — practice / side-quest with a resolved itemPool (≥1 item): the
 *    unit's REQUIRED spine. Complete when EVERY pool item has a best tier (been
 *    attempted); stars = starsForTiers over those best tiers.
 *  · NON-GATING nodes — lesson (teaching), game (deep-links out; the campaign owns
 *    its own progress — deferred to J-2), review (the live spaced-retrieval due
 *    set, not a static pool): accessible once REACHED; they never block and are
 *    never falsely "complete". (F1: a leading lesson can't lock the spine; F5:
 *    a review with a shifting/empty due set can't either.)
 *  · Linear unlock: the FRONTIER is the first incomplete gating node. Nodes before
 *    it are reached (gating → complete+stars, non-gating → available); the frontier
 *    itself is available; nodes after it are locked.
 */
import { and, eq, like } from "drizzle-orm";
import type { Tier } from "@domigo/engine";
import type { JourneyNode, JourneyNodeKind } from "@domigo/content-schema";
import { practiceAttempts } from "./schema.ts";
import { starsForTiers } from "./studypath.ts";
import type { Db } from "./index.ts";

/** The attempt `mode` for a journey node — the single source of the format the
 *  schema's 40-char invariant guards and the node runner writes. */
export function journeyModeFor(unitSlug: string, nodeId: string): string {
  return `journey:${unitSlug}:${nodeId}`;
}

const TIER_RANK: Record<Tier, number> = { correct: 3, partial: 2, close: 1, wrong: 0 };

/** Best (highest) tier per item across a set of graded attempts. Pure. */
export function bestTierPerItem(attempts: ReadonlyArray<{ itemId: string; tier: Tier }>): Map<string, Tier> {
  const best = new Map<string, Tier>();
  for (const a of attempts) {
    const cur = best.get(a.itemId);
    if (cur === undefined || TIER_RANK[a.tier] > TIER_RANK[cur]) best.set(a.itemId, a.tier);
  }
  return best;
}

export type JourneyNodeStatus = "locked" | "available" | "complete";
export interface JourneyNodeView {
  id: string;
  kind: JourneyNodeKind;
  status: JourneyNodeStatus;
  stars: 0 | 1 | 2 | 3;
}

/** A node gates the spine iff it's a practice/side-quest node with ≥1 resolved item. */
function isGating(n: JourneyNode, nodeItems: ReadonlyMap<string, readonly string[]>): boolean {
  return (n.kind === "practice" || n.kind === "side-quest") && (nodeItems.get(n.id)?.length ?? 0) > 0;
}

/**
 * Derive per-node status + stars. `nodeItems` maps a gating node's id → its
 * resolved pool item ids (the caller computes these from the pool partition;
 * lesson/game/review nodes carry none). `best` is bestTierPerItem over the unit's
 * journey attempts. Pure + deterministic.
 */
export function deriveJourneyProgress(
  nodes: readonly JourneyNode[],
  nodeItems: ReadonlyMap<string, readonly string[]>,
  best: ReadonlyMap<string, Tier>,
): JourneyNodeView[] {
  const complete = (n: JourneyNode): boolean => (nodeItems.get(n.id) ?? []).every((id) => best.has(id));
  const starsOf = (n: JourneyNode): 0 | 1 | 2 | 3 => {
    const tiers = (nodeItems.get(n.id) ?? []).map((id) => best.get(id)).filter((t): t is Tier => t !== undefined);
    return starsForTiers(tiers);
  };

  // frontier = the first incomplete gating node (nodes.length if all gates done)
  let frontier = nodes.length;
  for (let i = 0; i < nodes.length; i++) {
    if (isGating(nodes[i]!, nodeItems) && !complete(nodes[i]!)) {
      frontier = i;
      break;
    }
  }

  return nodes.map((n, i): JourneyNodeView => {
    if (i > frontier) return { id: n.id, kind: n.kind, status: "locked", stars: 0 };
    if (i === frontier) return { id: n.id, kind: n.kind, status: "available", stars: 0 };
    // i < frontier — reached: a done gate shows complete+stars; enrichment is open.
    if (isGating(n, nodeItems)) return { id: n.id, kind: n.kind, status: "complete", stars: starsOf(n) };
    return { id: n.id, kind: n.kind, status: "available", stars: 0 };
  });
}

// ── the impure reader ────────────────────────────────────────────────────────

/** All of a user's journey attempts for a unit (mode 'journey:<unit>:%') as
 *  {itemId, tier} — feeds bestTierPerItem. Scoped to the journey mode (so a
 *  pre-journey practice/game history never counts toward journey progress). */
export async function getJourneyAttempts(
  db: Db,
  userId: string,
  unitSlug: string,
): Promise<Array<{ itemId: string; tier: Tier }>> {
  const rows = await db
    .select({ itemId: practiceAttempts.itemId, tier: practiceAttempts.tier })
    .from(practiceAttempts)
    .where(and(eq(practiceAttempts.userId, userId), like(practiceAttempts.mode, `journey:${unitSlug}:%`)));
  return rows.map((r) => ({ itemId: r.itemId, tier: r.tier as Tier }));
}
