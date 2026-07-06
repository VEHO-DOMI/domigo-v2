/**
 * Pure helpers for the tactile task layer (ALIVE-T T1/T2) — letter tiles for
 * anagram, word chips for sentence-building. React-free and fs-free so the
 * corpus-wide PARITY SWEEP (tactile.test.ts) can prove, item by item, that
 * assembling the tiles/chips grades `correct` through the real engine.
 *
 * The tactile renderers only ASSEMBLE TEXT — the assembled string flows into
 * the exact same GrammarInput and grading path as typing (one grading brain,
 * Law 5). Determinism: tiles shuffle via the same FNV-1a + LCG used for
 * choice options, seeded by the item id — never Math.random (Law 9).
 */

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic Fisher–Yates (the useShuffled algorithm, extracted pure). */
export function seededShuffle<T>(arr: T[], seed: string): T[] {
  let state = hash(seed) || 1;
  const next = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// ---- T2 · sentence-building word chips -------------------------------------

export interface SbChip {
  /** stable instance key — duplicate words get distinct keys */
  key: string;
  text: string;
}

/**
 * The tray chips from an sb prompt ("I'm / class / in / one"). Corpus prompt
 * conventions honored:
 *   - an optional German instruction prefix ("Bring die Wörter in die richtige
 *     Reihenfolge: never / I / …") is stripped — but ONLY when its colon comes
 *     before the first slash, so a future token like "7:30" stays intact;
 *   - pure-punctuation tokens (".", "?", ",") are dropped: canonical() strips
 *     punctuation before grading, so they are grade-neutral — the reveal shows
 *     the full sentence.
 */
export function sbChips(promptText: string): SbChip[] {
  let text = promptText;
  const slash = text.indexOf("/");
  if (slash !== -1) {
    // last ":" or "." BEFORE the first slash ends the instruction; separators
    // inside later tokens ("7:30", "3 p.m.", "8.30") sit after it and survive.
    const head = text.slice(0, slash);
    const cut = Math.max(head.lastIndexOf(":"), head.lastIndexOf("."));
    if (cut !== -1) text = text.slice(cut + 1);
  }
  const seen = new Map<string, number>();
  return text
    .split("/")
    .map((t) => t.trim())
    .filter((t) => t.length > 0 && [...t].some((c) => /[\p{L}\p{N}]/u.test(c)))
    .map((chipText) => {
      const n = (seen.get(chipText) ?? 0) + 1;
      seen.set(chipText, n);
      return { key: `${chipText}#${n}`, text: chipText };
    });
}

function canonicalWord(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/['’`.,!?;:"“”()\[\]]/g, "")
    .trim();
}

/**
 * The chip indices that assemble `answer` in order (canonical word match), or
 * null when the tray can't build it — the parity sweep's core check.
 * Two corpus realities this honors:
 *   - chips may be PHRASES ("a lot of", "next to", "a life jacket" — didactic
 *     chunking), matched as consecutive answer words;
 *   - chips may be LEFT OVER (authored distractors like g1u01's "the" beside
 *     "It isn't on my desk.") — leftovers are legitimate lures.
 * Backtracking keeps ambiguous prefixes correct; chips try in index order, so
 * the result is deterministic.
 */
export function sbAnswerOrder(chips: SbChip[], answer: string): number[] | null {
  const want = answer
    .split(/\s+/)
    .map(canonicalWord)
    .filter((w) => w.length > 0);
  const chipWords = chips.map((c) =>
    c.text
      .split(/\s+/)
      .map(canonicalWord)
      .filter((w) => w.length > 0),
  );
  const used = new Array<boolean>(chips.length).fill(false);
  const order: number[] = [];
  const solve = (pos: number): boolean => {
    if (pos === want.length) return true;
    for (let i = 0; i < chips.length; i++) {
      if (used[i]) continue;
      const cw = chipWords[i]!;
      if (cw.length === 0 || pos + cw.length > want.length) continue;
      if (!cw.every((w, k) => want[pos + k] === w)) continue;
      used[i] = true;
      order.push(i);
      if (solve(pos + cw.length)) return true;
      used[i] = false;
      order.pop();
    }
    return false;
  };
  return solve(0) ? order : null;
}

// ---- T1 · anagram letter tiles ----------------------------------------------

export interface AgSlot {
  /** pre-filled character (apostrophe/hyphen) or null = a letter the student places */
  fixed: string | null;
}

/** Slot row for an anagram answer: letters are placeable, ' and - are fixed. */
export function agSlots(answer: string): AgSlot[] {
  return [...answer.normalize("NFC")].map((ch) => ({ fixed: /['’-]/.test(ch) ? ch : null }));
}

export interface AgTile {
  key: string;
  ch: string;
}

/** The tray tiles: the answer's placeable letters, deterministically shuffled.
 *  Guaranteed complete — assembling every tile in slot order rebuilds the answer. */
export function agTiles(answer: string, seed: string): AgTile[] {
  const letters = [...answer.normalize("NFC")].filter((ch) => !/['’-]/.test(ch));
  const tiles = letters.map((ch, i) => ({ key: `${ch}#${i}`, ch }));
  return seededShuffle(tiles, seed);
}

/** Rebuild the assembled string from slots + placed tile characters (in slot order). */
export function agAssemble(slots: AgSlot[], placed: Array<string | null>): string {
  let p = 0;
  return slots
    .map((s) => {
      if (s.fixed !== null) return s.fixed;
      const ch = placed[p] ?? "";
      p += 1;
      return ch;
    })
    .join("");
}
