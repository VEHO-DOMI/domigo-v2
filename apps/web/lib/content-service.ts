import "server-only";
/**
 * content-service — the unit loader WITH the Studio overlays applied.
 *
 * Precedence (each layer degrades to the previous on any DB error, so this is
 * safe before the migrations land and when the DB is down):
 *   corpus + trusted git overlay (`loadUnit`, unchanged)
 *     → S-1 published PROSE overrides (allowlist-gated, keys unreachable)
 *       → S-2 published full-item DRAFTS (create adds · replace supersedes ·
 *         remove drops — only ever PUBLISHED drafts; non-published are unservable)
 * When both overlay tables are empty, output is byte-identical to `loadUnit`
 * (the passthrough invariant). Applied at the point of DISPLAY only; grading
 * and composition read canon.
 */
import { applyStudioOverlay, loadUnit, mergeDrafts, normalizePatchColumn, type DraftApply, type ItemPatch, type UnitContent } from "@domigo/content-loader";
import { getDb, loadPublishedDrafts, loadPublishedOverrides } from "@domigo/db";

export type { UnitContent };

export async function loadUnitWithOverrides(slug: string): Promise<UnitContent> {
  const base = loadUnit(slug); // corpus + trusted git overlay = today's output
  let vocab = base.vocab;
  let grammar = base.grammar;

  // ── S-1 · prose overrides ──
  try {
    const rows = await loadPublishedOverrides(getDb(), slug);
    if (rows.length > 0) {
      const byItem = new Map(rows.map((r) => [r.itemId, r]));
      const overlay = <T extends UnitContent["vocab"][number] | UnitContent["grammar"][number]>(kind: "vocab" | "grammar", it: T): T => {
        const row = byItem.get(it.id);
        if (!row || row.kind !== kind) return it;
        return applyStudioOverlay(kind, it, normalizePatchColumn(row.patch) as ItemPatch);
      };
      vocab = vocab.map((it) => overlay("vocab", it));
      grammar = grammar.map((it) => overlay("grammar", it));
    }
  } catch {
    return base; // DB down / migration not applied → canon (safe by construction)
  }

  // ── S-2 · published full-item drafts (LAST in precedence) ──
  try {
    const drafts = await loadPublishedDrafts(getDb(), slug);
    if (drafts.length > 0) {
      const applies: DraftApply[] = drafts.map((d) => ({
        itemId: d.itemId,
        kind: d.kind,
        action: d.action,
        item: d.action === "remove" ? null : (normalizePatchColumn(d.item) as DraftApply["item"]),
      }));
      const merged = mergeDrafts(vocab, grammar, applies);
      vocab = merged.vocab;
      grammar = merged.grammar;
    }
  } catch {
    /* drafts table unavailable → serve the prose-overlaid version */
  }

  return { slug: base.slug, vocab, grammar };
}
