import "server-only";
/**
 * content-service — the unit loader WITH the Studio DB overlay applied (S-1).
 *
 * Layering: corpus + trusted git overlay (`loadUnit`, unchanged) → published
 * Studio DB overlay (prose-only, allowlist-gated at write time). The overlay is
 * applied at the point of DISPLAY: every surface that renders item prose to a
 * user calls `loadUnitWithOverrides`. Grading (`/api/attempts`,
 * `/api/assignments/attempt`) and composition (`composeCheckup`,
 * `catalogForGrade`) deliberately read canon via `loadUnit` — a prose overlay
 * can never touch a grading key, so grading must stay on the canonical path and
 * needs no per-request overlay read.
 *
 * Degrade-to-canon: any DB error (incl. the migration not yet applied) returns
 * the plain `loadUnit` result, so this is safe to ship before 0009 lands. When
 * the overlay table is empty, output is byte-identical to `loadUnit` (the
 * passthrough invariant, unit-tested against all 57 units).
 */
import { applyStudioOverlay, loadUnit, normalizePatchColumn, type ItemPatch, type UnitContent } from "@domigo/content-loader";
import { getDb, loadPublishedOverrides } from "@domigo/db";

export type { UnitContent };

export async function loadUnitWithOverrides(slug: string): Promise<UnitContent> {
  const base = loadUnit(slug); // corpus + trusted git overlay = today's output
  let rows: Awaited<ReturnType<typeof loadPublishedOverrides>>;
  try {
    rows = await loadPublishedOverrides(getDb(), slug);
  } catch {
    return base; // DB down / migration not applied → canon (safe by construction)
  }
  if (rows.length === 0) return base;

  const byItem = new Map(rows.map((r) => [r.itemId, r]));
  const overlay = <T extends UnitContent["vocab"][number] | UnitContent["grammar"][number]>(kind: "vocab" | "grammar", it: T): T => {
    const row = byItem.get(it.id);
    if (!row || row.kind !== kind) return it;
    return applyStudioOverlay(kind, it, normalizePatchColumn(row.patch) as ItemPatch);
  };
  return {
    slug: base.slug,
    vocab: base.vocab.map((it) => overlay("vocab", it)),
    grammar: base.grammar.map((it) => overlay("grammar", it)),
  };
}
