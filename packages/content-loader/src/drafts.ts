/**
 * @domigo/content-loader/drafts — the S-2 full-CRUD pure core.
 *
 * `validateFullItem` runs a whole teacher-created/replaced item through the
 * content-schema zod (every superRefine: blank counts, distractor rules, id ↔
 * unit coherence, definition-leak). `mergeDrafts` is the pure precedence layer:
 * PUBLISHED drafts apply LAST (create adds, replace supersedes by id, remove
 * drops) over corpus + git + prose overlay. IO-free, unit-tested.
 */
import { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { GrammarItem as GrammarItemT, VocabItem as VocabItemT } from "@domigo/content-schema";
import type { ItemKind } from "./overrides.ts";

export interface FullValidation {
  ok: boolean;
  errors: string[];
}

/** Validate a full item against its schema. The zod parse enforces EVERYTHING
 *  (ids, answer sets, blank counts, distractor rules) — a created item is only
 *  structurally sound if this passes. (The blind-solve gate then proves it is
 *  actually solvable; the two together are the publish bar.) */
export function validateFullItem(kind: ItemKind, item: unknown): FullValidation {
  const schema = kind === "vocab" ? VocabItem : GrammarItem;
  const r = schema.safeParse(item);
  if (r.success) return { ok: true, errors: [] };
  return { ok: false, errors: r.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`) };
}

export interface DraftApply {
  itemId: string;
  kind: string; // 'vocab' | 'grammar'
  action: string; // 'create' | 'replace' | 'remove'
  item: VocabItemT | GrammarItemT | null; // the full item (null for remove)
}

function applyOne<T extends { id: string }>(items: T[], action: string, itemId: string, item: T | null): T[] {
  if (action === "remove") return items.filter((x) => x.id !== itemId);
  if (!item) return items;
  const idx = items.findIndex((x) => x.id === itemId);
  if (idx === -1) return [...items, item]; // create
  const next = [...items];
  next[idx] = item; // replace
  return next;
}

/** Apply published drafts over the base item lists (LAST in precedence). */
export function mergeDrafts(vocab: VocabItemT[], grammar: GrammarItemT[], drafts: DraftApply[]): { vocab: VocabItemT[]; grammar: GrammarItemT[] } {
  let v = vocab;
  let g = grammar;
  for (const d of drafts) {
    if (d.kind === "vocab") v = applyOne(v, d.action, d.itemId, d.item as VocabItemT | null);
    else if (d.kind === "grammar") g = applyOne(g, d.action, d.itemId, d.item as GrammarItemT | null);
  }
  return { vocab: v, grammar: g };
}
