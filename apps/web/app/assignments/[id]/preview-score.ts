/** Browser-only preview scoring. The server supplies the canonical tier values
 * and grade thresholds; parity tests compare these calculations with the real
 * assignment and checkup scorers. Nothing here persists or sends a request. */
import type { Tier } from "@domigo/engine";

export interface PreviewScoring {
  tierPoints: Record<Tier, number>;
  notenSchluessel: { 1: number; 2: number; 3: number; 4: number };
}

export function rememberPreviewTier(attempts: Map<string, Tier>, itemId: string, tier: Tier): void {
  if (!attempts.has(itemId)) attempts.set(itemId, tier);
}

function earned(itemIds: readonly string[], attempts: ReadonlyMap<string, Tier>, policy: PreviewScoring): number {
  return itemIds.reduce((sum, id) => {
    const tier = attempts.get(id);
    return sum + (tier === undefined ? 0 : policy.tierPoints[tier] ?? 0);
  }, 0);
}

export function scorePreviewAssignment(
  mode: "practice" | "mock_test",
  sections: readonly { itemIds: string[]; weightPct: number }[],
  attempts: ReadonlyMap<string, Tier>,
  policy: PreviewScoring,
): { note: number; displayPct: number } {
  const rows = sections.map((s) => ({
    itemCount: s.itemIds.length,
    pct: s.itemIds.length > 0 ? earned(s.itemIds, attempts, policy) / s.itemIds.length * 100 : 0,
    weightPct: s.weightPct,
  }));
  const total = rows.reduce((n, s) => n + (mode === "mock_test" ? s.weightPct : s.itemCount), 0);
  const contribution = rows.reduce((n, s) => n + (mode === "mock_test" ? s.pct * s.weightPct : s.pct / 100 * s.itemCount), 0);
  const exactPct = total > 0 ? contribution / total * (mode === "mock_test" ? 1 : 100) : 0;
  const ns = policy.notenSchluessel;
  const note = exactPct >= ns[1] ? 1 : exactPct >= ns[2] ? 2 : exactPct >= ns[3] ? 3 : exactPct >= ns[4] ? 4 : 5;
  return { note, displayPct: Math.round(exactPct * 100) / 100 };
}

export function scorePreviewCheckup(
  sections: readonly { position: number; itemIds: string[]; points: number }[],
  attempts: ReadonlyMap<string, Tier>,
  policy: PreviewScoring,
) {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const perSection = sections.map((s) => {
    const worth = s.itemIds.length > 0 ? s.points / s.itemIds.length : 0;
    // Multiply each item before summing, exactly as the canonical scorer does.
    let points = 0;
    for (const id of s.itemIds) {
      const tier = attempts.get(id);
      if (tier !== undefined) points += (policy.tierPoints[tier] ?? 0) * worth;
    }
    return { position: s.position, points: round2(points), outOf: s.points };
  });
  return {
    points: round2(perSection.reduce((sum, s) => sum + s.points, 0)),
    outOf: sections.reduce((sum, s) => sum + s.points, 0),
    perSection,
  };
}
