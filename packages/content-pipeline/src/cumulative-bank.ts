/**
 * The cumulative level gate (V-5 engine): which English tokens may a student
 * at unit N of grade G read unglossed?
 *
 * Membership = every form of every bank entry of (all units of lower grades +
 * units 1..N of grade G)  ∪  the approved core allowlist  ∪  harvested proper
 * nouns (≤ N, cumulative)  ∪  bare integers  ∪  the item's own gloss words
 * ∪  audited level grants. Greedy longest-phrase-first walk; inflection-aware
 * per token (tokenize.ts). Overgeneration is acceptable; it can only make the
 * gate more permissive about TAUGHT words, never invent glosses.
 */
import path from "node:path";
import type { CoreAllowlist, Grade, WordBank } from "@domigo/content-schema";
import { GRADES, UNITS_PER_GRADE, unitSlug } from "@domigo/content-schema";
import { readJsonIfExists } from "./json.ts";
import { CONTENT_DIR, OVERLAYS_DIR, UNITS_DIR } from "./paths.ts";
import { inflectionFamily, tokenMatches, wordTokens } from "./tokenize.ts";

export const PROPER_NOUNS_PATH = path.join(CONTENT_DIR, "build", "proper-nouns.json");
export const LEVEL_GRANTS_PATH = path.join(OVERLAYS_DIR, "level-grants.json");

export interface ProperNounsFile {
  schema: "proper-nouns@1";
  units: Record<string, Array<{ token: string; count: number }>>;
}

export interface LevelGrant {
  slug: string;
  /** null = unit-wide grant. */
  itemId: string | null;
  /** null = any field of the item/unit. */
  field: string | null;
  token: string;
  reason: string;
  by: string;
  round: number;
}

export interface LevelGrantsFile {
  schema: "level-grants@1";
  grants: LevelGrant[];
}

/** Units whose banks are taught at-or-before `slug` (lower grades fully). */
export function cumulativeSlugs(grade: Grade, unit: number): string[] {
  const slugs: string[] = [];
  for (const g of GRADES) {
    if (g > grade) break;
    const top = g === grade ? unit : UNITS_PER_GRADE[g];
    for (let u = 1; u <= top; u += 1) slugs.push(unitSlug(g, u));
  }
  return slugs;
}

export interface AllowedMatcher {
  slug: string;
  /** Single-token membership (family-expanded bank singles + allowlist + nouns). */
  has(token: string): boolean;
  /** Whole-string membership: the string is one bank phrase / single / number. */
  hasPhrase(s: string): boolean;
  /**
   * Tokens of `text` not covered by the gate. `extraPhrases` (the item's own
   * gloss words) and `grantedTokens` are honored for this call only.
   */
  unknownTokens(
    text: string,
    opts?: { extraPhrases?: string[]; grantedTokens?: Set<string> },
  ): string[];
}

interface MatcherIndex {
  /** First-token (family-expanded) → multi-token form sequences, longest first. */
  phrases: Map<string, string[][]>;
  /** Family-expanded single-token forms + allowlist + proper nouns. */
  singles: Set<string>;
}

function addPhrase(index: MatcherIndex, seq: string[]): void {
  if (seq.length === 0) return;
  if (seq.length === 1) {
    for (const m of inflectionFamily(seq[0]!)) index.singles.add(m);
    return;
  }
  for (const head of inflectionFamily(seq[0]!)) {
    const list = index.phrases.get(head);
    if (list === undefined) index.phrases.set(head, [seq]);
    else list.push(seq);
  }
}

function sortPhraseIndex(index: MatcherIndex): void {
  for (const list of index.phrases.values()) list.sort((a, b) => b.length - a.length);
}

/** Longest contiguous inflection-aware match of any indexed phrase at `i`. */
function phraseSpanAt(index: MatcherIndex, tokens: string[], i: number): number {
  const candidates = index.phrases.get(tokens[i]!);
  if (candidates === undefined) return 0;
  outer: for (const seq of candidates) {
    if (i + seq.length > tokens.length) continue;
    for (let j = 0; j < seq.length; j += 1) {
      if (!tokenMatches(tokens[i + j]!, seq[j]!)) continue outer;
    }
    return seq.length;
  }
  return 0;
}

const matcherCache = new Map<string, AllowedMatcher>();

export function buildAllowedMatcher(
  slug: string,
  opts: { nouns?: boolean } = {},
): AllowedMatcher {
  const includeNouns = opts.nouns ?? true;
  const cacheKey = `${slug}:${includeNouns ? "n1" : "n0"}`;
  const cached = matcherCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const m = /^g([1-4])-u(\d{2})$/.exec(slug);
  if (m === null) throw new Error(`bad unit slug: ${slug}`);
  const grade = Number(m[1]) as Grade;
  const unit = parseInt(m[2]!, 10);

  const index: MatcherIndex = { phrases: new Map(), singles: new Set() };

  for (const s of cumulativeSlugs(grade, unit)) {
    const bank = readJsonIfExists<WordBank>(path.join(UNITS_DIR, s, "wordbank.json"));
    if (bank === null) throw new Error(`cumulative bank missing: ${s}/wordbank.json`);
    for (const e of bank.entries) {
      for (const form of [e.en, ...e.forms]) addPhrase(index, wordTokens(form));
    }
  }

  const allowlist = readJsonIfExists<CoreAllowlist>(
    path.join(OVERLAYS_DIR, "core-allowlist.json"),
  );
  for (const t of allowlist?.tokens ?? []) {
    for (const member of inflectionFamily(t.token)) index.singles.add(member);
  }

  if (includeNouns) {
    const nouns = readJsonIfExists<ProperNounsFile>(PROPER_NOUNS_PATH);
    if (nouns !== null) {
      const allowed = new Set(cumulativeSlugs(grade, unit));
      for (const [unitKey, list] of Object.entries(nouns.units)) {
        if (!allowed.has(unitKey)) continue;
        for (const n of list) {
          // a name licenses its possessive ("Sarah's") — but NOT verb/plural
          // inflections (full family expansion would let "Carol" license "carols")
          const lower = n.token.toLowerCase();
          index.singles.add(lower);
          index.singles.add(`${lower}'s`);
        }
      }
    }
  }

  sortPhraseIndex(index);

  const matcher: AllowedMatcher = {
    slug,
    has(token: string): boolean {
      const t = wordTokens(token)[0];
      if (t === undefined) return false;
      if (/^\d+$/.test(t)) return true;
      return index.singles.has(t);
    },
    hasPhrase(s: string): boolean {
      const tokens = wordTokens(s);
      if (tokens.length === 0) return false;
      if (tokens.length === 1) {
        return /^\d+$/.test(tokens[0]!) || index.singles.has(tokens[0]!);
      }
      return phraseSpanAt(index, tokens, 0) === tokens.length;
    },
    unknownTokens(text, callOpts = {}): string[] {
      const extra: MatcherIndex = { phrases: new Map(), singles: new Set() };
      for (const p of callOpts.extraPhrases ?? []) addPhrase(extra, wordTokens(p));
      sortPhraseIndex(extra);
      const granted = callOpts.grantedTokens ?? new Set<string>();

      const tokens = wordTokens(text);
      const unknown: string[] = [];
      let i = 0;
      while (i < tokens.length) {
        const t = tokens[i]!;
        if (/^\d+$/.test(t) || granted.has(t)) {
          i += 1;
          continue;
        }
        const span = Math.max(
          phraseSpanAt(index, tokens, i),
          phraseSpanAt(extra, tokens, i),
        );
        if (span > 0) {
          i += span;
          continue;
        }
        if (index.singles.has(t) || extra.singles.has(t)) {
          i += 1;
          continue;
        }
        unknown.push(t);
        i += 1;
      }
      return unknown;
    },
  };
  matcherCache.set(cacheKey, matcher);
  return matcher;
}

/** Grants for one unit, grouped for V-5 consumption. */
export function grantsForUnit(slug: string): {
  unitWide: Set<string>;
  byItem: Map<string, Set<string>>;
  all: LevelGrant[];
} {
  const file = readJsonIfExists<LevelGrantsFile>(LEVEL_GRANTS_PATH);
  const unitWide = new Set<string>();
  const byItem = new Map<string, Set<string>>();
  const all: LevelGrant[] = [];
  for (const g of file?.grants ?? []) {
    if (g.slug !== slug) continue;
    all.push(g);
    const token = g.token.toLowerCase();
    if (g.itemId === null) {
      unitWide.add(token);
    } else {
      const set = byItem.get(g.itemId) ?? new Set<string>();
      set.add(token);
      byItem.set(g.itemId, set);
    }
  }
  return { unitWide, byItem, all };
}
