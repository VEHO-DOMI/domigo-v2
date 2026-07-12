/**
 * V-2b · Corpus stamp — a short digest binding a generated report (variant audit,
 * blind-solve) to the EXACT corpus state it was computed over. Without it, a
 * committed report's freshness is only inferable from file mtimes and cross-
 * references (the QC gap found in the 2026-07-12 program review): a report can
 * sit in git looking authoritative long after the corpus moved on.
 *
 * The stamp hashes the bytes of every unit's vocab.json + grammar.json PLUS the
 * item-fixes overlay (reports run over the overlay-applied view, so the overlay
 * is part of the effective corpus). Any content change — a fix wave, a new unit,
 * an overlay edit — changes the stamp; a report whose corpusHash matches the
 * current stamp is provably about today's corpus.
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { ITEM_FIXES_PATH } from "./gen-items.ts";
import { UNITS_DIR } from "./paths.ts";

/** 16-hex-char digest of the effective corpus (unit items + fixes overlay). */
export function corpusStamp(): string {
  const h = createHash("sha256");
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .sort();
  for (const slug of slugs) {
    for (const file of ["vocab.json", "grammar.json"]) {
      const p = path.join(UNITS_DIR, slug, file);
      if (!fs.existsSync(p)) continue;
      h.update(`${slug}/${file}\n`);
      h.update(fs.readFileSync(p));
    }
  }
  if (fs.existsSync(ITEM_FIXES_PATH)) {
    h.update("overlays/item-fixes.json\n");
    h.update(fs.readFileSync(ITEM_FIXES_PATH));
  }
  return h.digest("hex").slice(0, 16);
}
