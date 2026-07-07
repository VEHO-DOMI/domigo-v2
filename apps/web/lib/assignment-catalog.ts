/**
 * M-2 · The teacher builder's item catalog. Server-only (content-loader uses
 * node:fs). Turns a grade's approved units into a COMPACT pick-list — just what
 * the composer's checklist needs, never the full items (those re-resolve server-
 * side at grade time). Vocab + grammar only (M-2 scope); reference kinds land in
 * M-2b.
 */
import { listApprovedUnits, loadUnit } from "@domigo/content-loader";

export interface CatalogItem {
  id: string;
  /** a short human label for the checklist row (the prompt/word, trimmed) */
  label: string;
  format: string; // grammar format, or "vocab"
  difficulty: number;
}

export interface CatalogUnit {
  unitSlug: string;
  vocab: CatalogItem[];
  grammar: CatalogItem[];
}

/** Approved unit slugs for a grade, in order (g2-u01, g2-u02, …). */
export function unitsForGrade(grade: number): string[] {
  const prefix = `g${grade}-`;
  return listApprovedUnits().filter((s) => s.startsWith(prefix));
}

function clip(s: string, n = 80): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/** The compact catalog for one grade, unit by unit. `reserved` ids are dropped. */
export function catalogForGrade(grade: number, reserved: ReadonlySet<string> = new Set()): CatalogUnit[] {
  const out: CatalogUnit[] = [];
  for (const unitSlug of unitsForGrade(grade)) {
    const unit = loadUnit(unitSlug);
    const vocab: CatalogItem[] = unit.vocab
      .filter((v) => !reserved.has(v.id))
      .map((v) => ({ id: v.id, label: clip(`${v.w} — ${v.d}`), format: "vocab", difficulty: v.difficulty }));
    const grammar: CatalogItem[] = unit.grammar
      .filter((g) => !reserved.has(g.id))
      .map((g) => ({ id: g.id, label: clip(g.prompt.text), format: g.format, difficulty: g.difficulty }));
    if (vocab.length > 0 || grammar.length > 0) out.push({ unitSlug, vocab, grammar });
  }
  return out;
}

/** Flat id → CatalogItem index (for resolving a draft's picks to labels in preview). */
export function catalogIndex(grade: number): Map<string, CatalogItem & { unitSlug: string; kind: "vocab" | "grammar" }> {
  const idx = new Map<string, CatalogItem & { unitSlug: string; kind: "vocab" | "grammar" }>();
  for (const u of catalogForGrade(grade)) {
    for (const v of u.vocab) idx.set(v.id, { ...v, unitSlug: u.unitSlug, kind: "vocab" });
    for (const g of u.grammar) idx.set(g.id, { ...g, unitSlug: u.unitSlug, kind: "grammar" });
  }
  return idx;
}
