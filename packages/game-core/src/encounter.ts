/**
 * Encounter resolution — turn an `encounter@1` RECIPE into the concrete tasks to
 * render. Pure + deterministic (SSR/offline-safe): no DOM, no fs, no DB calls.
 * The server resolves `getDueRefs` + `loadUnit` and passes the results in here;
 * game-core never reaches for them itself. `@domigo/db` is a TYPE-only import
 * (erased), so this stays free of the server-only db module graph.
 */
import type { DueRef } from "@domigo/db";
import type { Encounter, GrammarFormat, GrammarItem, VocabItem } from "@domigo/content-schema";

/** Grammar formats that work as battle cards. G-A1 widened the gate (EZ-1 §2):
 *  matching renders as dropdown rows, sentence-building/anagram get the tactile
 *  trays inside the BattleStage, transformation is a typed spell — so battles
 *  rotate through the full breadth instead of the original quick-card slice. */
export const DEFAULT_BATTLE_FORMATS: GrammarFormat[] = [
  "multiple-choice",
  "gap-fill",
  "anagram",
  "context-picker",
  "matching",
  "sentence-building",
  "transformation",
];

export type ResolvedItem =
  | { kind: "vocab"; item: VocabItem }
  | { kind: "grammar"; item: GrammarItem };

/**
 * B-0: the stable map key for a story task slot's resolved item. A chapter may
 * use the SAME itemId twice under different presentation `variantKey`s (variant
 * reuse); keying a `Record<string, ResolvedItem>` by itemId alone would let the
 * second slot silently overwrite the first. Compose `itemId#variantKey` (bare
 * itemId when no variant) so both the builder (`storyItemsFor`) and every
 * runtime look the item up by the same non-colliding key.
 */
export function storyItemKey(itemId: string, variantKey: string | null): string {
  return variantKey ? `${itemId}#${variantKey}` : itemId;
}

/**
 * B-0 flag-scope guard: when a cosmetic save is loaded into a story, keep only
 * the flags that story actually DECLARES (its flags.json). Two campaigns per
 * grade share one save slot (e.g. g4 "Lost for Words" and the new "FOURTEEN:
 * LIVE" both live at `game:g4`), so a returning player's stale `w04.*` flags
 * must NOT survive into the new story and mis-resolve its FlagGates. `declared`
 * empty (a story with no flags.json) ⇒ no flags survive, which is correct.
 */
export function seedStoryFlags(saveFlags: readonly string[], declared: readonly string[]): string[] {
  const ok = new Set(declared);
  return saveFlags.filter((f) => ok.has(f));
}

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

/** Deterministic in-scope fallback order (Law 6) — vocab and grammar each
 *  sorted by id, then INTERLEAVED (v, g, v, g, …). A flat id sort clustered
 *  all `gi.*` grammar ahead of all `w.*` vocab, so a fresh zone (empty due
 *  queue) served four same-shaped grammar battles in a row — G-A1's battle
 *  variety (vocab pool rotation, word banks) never fired. Still pure and
 *  order-stable: same pool ⇒ same order, no RNG. */
function scopeOrder(pool: EncounterPool): ResolvedItem[] {
  const v = [...pool.vocab].sort((a, b) => a.id.localeCompare(b.id)).map((it): ResolvedItem => ({ kind: "vocab", item: it }));
  const g = [...pool.grammar].sort((a, b) => a.id.localeCompare(b.id)).map((it): ResolvedItem => ({ kind: "grammar", item: it }));
  const out: ResolvedItem[] = [];
  for (let i = 0; i < Math.max(v.length, g.length); i += 1) {
    if (v[i]) out.push(v[i]!);
    if (g[i]) out.push(g[i]!);
  }
  return out;
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
