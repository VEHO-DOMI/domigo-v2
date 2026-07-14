/**
 * S-1 · Fold Studio prose overrides back into git (the "fold-back").
 *
 * Reads PUBLISHED `content_overrides` from the DB and merges each prose patch
 * into `content/overlays/item-fixes.json` — the same trusted git overlay the
 * pipeline uses — byte-preservingly. The result is a normal working-tree diff:
 * commit it as a fold-back PR; after it merges, clear the folded DB rows (the
 * db `foldOverrides` helper, or a manual delete). Git stays canonical.
 *
 *   node scripts/export-studio-overrides.ts           # dry-run (lists changes)
 *   node scripts/export-studio-overrides.ts --write    # apply to item-fixes.json
 *
 * Grammar `prompt.text` is folded as the FULL prompt object ({text,lang,blanks})
 * so the git overlay's shallow merge preserves lang + blank count.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyStudioOverlay, loadUnit, normalizePatchColumn, type ItemKind, type ItemPatch } from "@domigo/content-loader";
import { getDb, loadOverrideStatuses, loadPublishedOverrides } from "@domigo/db";

const write = process.argv.includes("--write");

function repoRoot(): string {
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    if (fs.existsSync(path.join(dir, "content", "overlays"))) return dir;
    dir = path.dirname(dir);
  }
  return process.cwd();
}

/** The item-fixes-shaped patch for one folded item (top-level fields; grammar
 *  prompt.text → the full prompt object so the shallow merge keeps lang/blanks). */
function itemFixPatch(kind: ItemKind, base: ReturnType<typeof loadUnit>["vocab"][number] | ReturnType<typeof loadUnit>["grammar"][number], patch: ItemPatch): Record<string, unknown> {
  const merged = applyStudioOverlay(kind, base, patch) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(patch as Record<string, unknown>)) {
    if (key === "prompt") out.prompt = merged.prompt; // full {text,lang,blanks}
    else out[key] = merged[key];
  }
  return out;
}

async function main(): Promise<void> {
  const root = repoRoot();
  const fixesPath = path.join(root, "content", "overlays", "item-fixes.json");
  const raw = fs.readFileSync(fixesPath, "utf8");
  const fixes = JSON.parse(raw) as Record<string, { drop?: string[]; patch?: Record<string, Record<string, unknown>> }>;

  const db = getDb();
  const statuses = await loadOverrideStatuses(db);
  const publishedUnits = [...new Set(statuses.filter((s) => s.status === "published").map((s) => s.unitSlug))];

  const changed: string[] = [];
  for (const slug of publishedUnits) {
    const rows = await loadPublishedOverrides(db, slug);
    const unit = loadUnit(slug);
    for (const row of rows) {
      const kind: ItemKind = row.kind === "grammar" ? "grammar" : "vocab";
      const base = kind === "vocab" ? unit.vocab.find((v) => v.id === row.itemId) : unit.grammar.find((g) => g.id === row.itemId);
      if (!base) continue;
      const prosePatch = itemFixPatch(kind, base, normalizePatchColumn(row.patch) as ItemPatch);
      const entry = (fixes[slug] ??= {});
      const patchMap = (entry.patch ??= {});
      patchMap[row.itemId] = { ...(patchMap[row.itemId] ?? {}), ...prosePatch };
      changed.push(`${slug} · ${row.itemId} · ${Object.keys(prosePatch).join(", ")}`);
    }
  }

  const next = JSON.stringify(fixes, null, 2) + (raw.endsWith("\n") ? "\n" : "");
  if (next === raw) {
    console.log("fold-back: no changes (already folded).");
    return;
  }
  console.log(`fold-back: ${changed.length} item(s) would fold into item-fixes.json:`);
  for (const c of changed) console.log("   " + c);
  if (write) {
    fs.writeFileSync(fixesPath, next);
    console.log(`\n✓ wrote ${fixesPath}. Commit as a fold-back PR, then clear the published rows (db foldOverrides).`);
  } else {
    console.log("\n(dry-run — pass --write to apply. Then `pnpm content validate` on the folded tree.)");
  }
}

main().catch((e) => {
  console.error("fold-back failed:", (e as Error).message);
  process.exit(1);
});
