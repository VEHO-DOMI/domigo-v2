/**
 * Trusted patch (A-5 mechanical fixes) — `content patch --unit <slug> [--dry-run]`.
 *
 * Lands an item-fixes overlay on an already-APPROVED unit WITHOUT re-running the
 * four LLM verification lenses. Any item change re-stales those lenses (they are
 * content-hash-keyed), so the normal path forces a full-unit re-verification —
 * disproportionate for a mechanical fix. This command is the sanctioned shortcut
 * for that narrow class ONLY: a provably-broken answer removed, a correct article
 * added — changes that introduce **no new prose for the lenses to judge**.
 *
 * Safe because:
 *   - a machine guard (`analyzeTrustedPatch`) REFUSES if any un-materialized overlay
 *     change touches a prose field (`d/s/prompt/gloss/hintDe/mc/distractors/...`) —
 *     prose edits still go through gen → verify → review → approve;
 *   - an approved unit is exempt from the verify.merged freshness check
 *     (`validate-items.ts:820`), and a post-patch review doc is stale so its
 *     byte-regen check is skipped (`validate.ts:300`) — so no lens/review artifacts
 *     need touching;
 *   - the real gate stays the deterministic validators (`content validate`, all
 *     green) + a targeted `blind-solve --only` on the touched keys.
 *
 * Koki's decision (B), 2026-07-12. Audit trail: the `approved` transition is
 * recorded `by: "fable-trusted-patch"` with a note. See docs/runbooks/fix-waves.md.
 */
import path from "node:path";
import { readJsonIfExists } from "./json.ts";
import { ITEM_FIXES_PATH, itemsContentHash, readUnitItems, runGenItemsIngest, type ItemFixes, type UnitItems } from "./gen-items.ts";
import { UNITS_DIR } from "./paths.ts";
import { appendTransition, currentState } from "./state.ts";

/** The only fields a trusted patch may newly change — the authored answer pools.
 *  Everything else is prose the lenses grade, and needs the full review flow. */
export const ANSWER_POOL_FIELDS: ReadonlySet<string> = new Set(["answers", "sAnswers", "dAnswers", "translation"]);

export interface PatchAnalysis {
  /** item ids that carry an un-materialized answer-pool change (the fix to land). */
  touched: string[];
  /** un-materialized prose-field changes — any of these makes the patch NOT trustable. */
  proseViolations: Array<{ id: string; field: string }>;
  /** patched ids not present in the unit (V-22 will flag; surfaced for a clearer message). */
  missingIds: string[];
}

/** Pure: classify a unit's overlay patches against its committed items. A field that
 *  already equals the corpus is "already materialized" and ignored; a differing field
 *  is answer-pool (→ touched) or prose (→ violation). */
export function analyzeTrustedPatch(unitFix: ItemFixes[string] | undefined, items: UnitItems): PatchAnalysis {
  const byId = new Map<string, Record<string, unknown>>(
    [...items.vocab, ...items.grammar].map((it) => [it.id, it as unknown as Record<string, unknown>]),
  );
  const touched: string[] = [];
  const proseViolations: Array<{ id: string; field: string }> = [];
  const missingIds: string[] = [];
  for (const [id, patch] of Object.entries(unitFix?.patch ?? {})) {
    const item = byId.get(id);
    if (item === undefined) {
      missingIds.push(id);
      continue;
    }
    for (const [field, value] of Object.entries(patch)) {
      if (JSON.stringify(item[field]) === JSON.stringify(value)) continue; // already materialized
      if (ANSWER_POOL_FIELDS.has(field)) {
        if (!touched.includes(id)) touched.push(id);
      } else {
        proseViolations.push({ id, field });
      }
    }
  }
  return { touched, proseViolations, missingIds };
}

export function runTrustedPatch(slug: string, dryRun: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);

  // ---- precondition: only patch an already-approved unit
  const state = currentState(unitDir)?.state;
  if (state !== "approved") {
    throw new Error(
      `${slug}: trusted-patch requires an APPROVED unit (current: "${state ?? "none"}"). ` +
        `Use the full gen → verify → review → approve flow for non-approved units.`,
    );
  }

  // ---- guard: the un-materialized overlay may touch answer pools ONLY
  const items = readUnitItems(slug); // committed (pre-patch) items
  const unitFix = readJsonIfExists<ItemFixes>(ITEM_FIXES_PATH)?.[slug];
  const { touched, proseViolations } = analyzeTrustedPatch(unitFix, items);
  if (proseViolations.length > 0) {
    const v = proseViolations[0]!;
    throw new Error(
      `${slug}: trusted-patch refuses — un-materialized change to PROSE field "${v.field}" on ${v.id}. ` +
        `Prose edits need lens review; use the full flow. Trusted-patch is answer-pool only ` +
        `(${[...ANSWER_POOL_FIELDS].join("/")}).`,
    );
  }
  if (touched.length === 0) {
    console.log(`trusted-patch ${slug}: no un-materialized answer-pool patch found — nothing to do.`);
    return;
  }

  if (dryRun) {
    console.log(
      `trusted-patch ${slug} (dry-run): would materialize + re-approve ${touched.length} item(s) ` +
        `[${touched.join(", ")}] — LLM lenses skipped (mechanical answer-pool fix).`,
    );
    return;
  }

  // ---- 1. materialize the overlay via the sanctioned ingest (surgical for an
  //         approved unit: re-produces the committed items + the overlay; → generated)
  runGenItemsIngest(slug, false, false);

  // ---- 2. re-approve, anchored on the new content hash (skips verify/review)
  const hash = itemsContentHash(readUnitItems(slug));
  appendTransition(unitDir, slug, {
    state: "approved",
    by: "fable-trusted-patch",
    contentHash: hash,
    note:
      `trusted patch (mechanical): ${touched.length} answer-pool fix(es) [${touched.join(", ")}] — ` +
      `overlay materialized, LLM lenses carried forward; gated by content validate + blind-solve ` +
      `(Koki decision B, 2026-07-12)`,
  });
  console.log(`trusted-patch ${slug}: approved ✓ — ${touched.length} item(s) patched, lenses not re-run.`);
}
