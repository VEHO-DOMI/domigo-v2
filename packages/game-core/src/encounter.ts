/**
 * Encounter resolution — turn an `encounter@1` RECIPE into the concrete tasks to
 * render. Pure + deterministic (SSR/offline-safe): no DOM, no fs, no DB calls.
 * The server resolves `getDueRefs` + `loadUnit` and passes the results in here;
 * game-core never reaches for them itself. `@domigo/db` is a TYPE-only import
 * (erased), so this stays free of the server-only db module graph.
 */
import type { DueRef } from "@domigo/db";
import type { Encounter, GrammarFormat, GrammarItem, VocabItem } from "@domigo/content-schema";

/** Grammar formats that work as quick battle cards (mc buttons / typed gap / letter tiles). */
export const DEFAULT_BATTLE_FORMATS: GrammarFormat[] = [
  "multiple-choice",
  "gap-fill",
  "anagram",
  "context-picker",
];

export type ResolvedItem =
  | { kind: "vocab"; item: VocabItem }
  | { kind: "grammar"; item: GrammarItem };

export interface EncounterPool {
  vocab: VocabItem[];
  grammar: GrammarItem[];
}

export interface EncounterInput {
  /** getDueRefs output — soonest-due first, already scope-filtered by the caller. */
  due: DueRef[];
  /** The in-scope item pool (a unit's, or a grade's, loaded server-side). */
  pool: EncounterPool;
}

function battleFormats(enc: Encounter): Set<GrammarFormat> {
  return new Set(enc.formatAllow ?? DEFAULT_BATTLE_FORMATS);
}

/** Vocab is always battle-eligible (carrier gap-fill); grammar is gated by format. */
function allowed(r: ResolvedItem, formats: Set<GrammarFormat>): boolean {
  return r.kind === "vocab" ? true : formats.has(r.item.format);
}

function indexPool(pool: EncounterPool): Map<string, ResolvedItem> {
  const m = new Map<string, ResolvedItem>();
  for (const v of pool.vocab) m.set(v.id, { kind: "vocab", item: v });
  for (const g of pool.grammar) m.set(g.id, { kind: "grammar", item: g });
  return m;
}

/** Deterministic in-scope fallback order (Law 6) — vocab+grammar sorted by id. */
function scopeOrder(pool: EncounterPool): ResolvedItem[] {
  const all: ResolvedItem[] = [
    ...pool.vocab.map((v): ResolvedItem => ({ kind: "vocab", item: v })),
    ...pool.grammar.map((g): ResolvedItem => ({ kind: "grammar", item: g })),
  ];
  return all.sort((a, b) => a.item.id.localeCompare(b.item.id));
}

/**
 * Resolve the encounter to up to `source.count` renderable items.
 * - `source.kind:"due"` → take due items soonest-first (skipping any not in the
 *   pool: stale/overlay-dropped refs), then TOP UP from the deterministic in-scope
 *   order when the queue is short or empty — a zone is never a dead end (Law 6).
 * - `source.kind:"scope-random"` → take from the deterministic in-scope order.
 * Battle-friendly format filter applies to grammar; vocab always qualifies.
 */
export function resolveEncounterTasks(enc: Encounter, input: EncounterInput): ResolvedItem[] {
  const formats = battleFormats(enc);
  const byId = indexPool(input.pool);
  const out: ResolvedItem[] = [];
  const taken = new Set<string>();

  if (enc.source.kind === "due") {
    for (const ref of input.due) {
      if (out.length >= enc.source.count) break;
      const r = byId.get(ref.itemId);
      if (r && !taken.has(ref.itemId) && allowed(r, formats)) {
        out.push(r);
        taken.add(ref.itemId);
      }
    }
  }

  if (out.length < enc.source.count) {
    for (const r of scopeOrder(input.pool)) {
      if (out.length >= enc.source.count) break;
      if (!taken.has(r.item.id) && allowed(r, formats)) {
        out.push(r);
        taken.add(r.item.id);
      }
    }
  }

  return out;
}
