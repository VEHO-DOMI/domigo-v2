/**
 * Tokenizer + inflection-aware matcher.
 *
 * THE shared module: the review round's transcript tracing uses it today; the
 * V5 level-gate validator uses the exact same code later. Two modes, one core:
 *  - `phraseExact`  — contiguous, in-order phrase match (V5's level gate)
 *  - `traceLoose`   — phraseExact OR all-tokens-present (review tracing; a
 *                     loose miss is a real anomaly worth a verdict)
 *
 * Inflection families are intentionally REGULAR-only (+s/+es/y→ies, +ing/+ed
 * with e-drop and CVC doubling, +er/+est, +'s, n't-stripping). Irregular
 * forms ride in each entry's `forms[]`, seeded from master-list parentheses.
 * Overgeneration is acceptable and documented: it can only make the gate more
 * permissive about *taught* words, never invent glosses.
 */

export function normalize(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’‘`]/g, "'")
    .replace(/[“”„]/g, '"');
}

/** Word tokens; hyphens are separators ("trick-or-treat" ≡ "trick or treat"). */
export function wordTokens(s: string): string[] {
  const m = normalize(s).replace(/-/g, " ").match(/[a-zäöüß0-9']+/g);
  return (m ?? []).map((t) => t.replace(/^'+|'+$/g, "")).filter((t) => t.length > 0);
}

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

function isCvc(w: string): boolean {
  if (w.length < 3) return false;
  const a = w[w.length - 3] as string;
  const b = w[w.length - 2] as string;
  const c = w[w.length - 1] as string;
  return !VOWELS.has(a) && VOWELS.has(b) && !VOWELS.has(c) && !"wxy".includes(c);
}

/** Regular inflection family of a single token (always includes the token). */
export function inflectionFamily(word: string): Set<string> {
  const w = normalize(word);
  const fam = new Set<string>([w]);
  if (w.length < 2 || /[0-9]/.test(w)) return fam;

  // plural / 3rd person
  if (/[sxz]$|ch$|sh$/.test(w)) fam.add(`${w}es`);
  else if (/[bcdfghjklmnpqrstvwxz]y$/.test(w)) {
    fam.add(`${w.slice(0, -1)}ies`);
    fam.add(`${w.slice(0, -1)}ied`);
  } else fam.add(`${w}s`);

  // -ing / -ed
  if (w.endsWith("e") && !w.endsWith("ee")) {
    fam.add(`${w.slice(0, -1)}ing`);
    fam.add(`${w}d`);
  } else {
    fam.add(`${w}ing`);
    fam.add(`${w}ed`);
    if (isCvc(w)) {
      const dbl = w + (w[w.length - 1] as string);
      fam.add(`${dbl}ing`);
      fam.add(`${dbl}ed`);
    }
  }

  // comparative / superlative
  if (w.endsWith("e")) {
    fam.add(`${w}r`);
    fam.add(`${w}st`);
  } else if (/[bcdfghjklmnpqrstvwxz]y$/.test(w)) {
    fam.add(`${w.slice(0, -1)}ier`);
    fam.add(`${w.slice(0, -1)}iest`);
  } else {
    fam.add(`${w}er`);
    fam.add(`${w}est`);
    if (isCvc(w)) {
      const dbl = w + (w[w.length - 1] as string);
      fam.add(`${dbl}er`);
      fam.add(`${dbl}est`);
    }
  }

  // possessive / contraction host
  fam.add(`${w}'s`);
  if (w.endsWith("n't")) fam.add(w.slice(0, -3));
  return fam;
}

/** Does text token `t` count as an inflected occurrence of form token `f`? */
export function tokenMatches(t: string, f: string): boolean {
  if (t === f) return true;
  if (inflectionFamily(f).has(t)) return true;
  return inflectionFamily(t).has(f);
}

export interface TokenizedText {
  tokens: string[];
  /** every token + its family members that occur, for O(1) loose checks */
  tokenSet: Set<string>;
}

export function tokenizeText(text: string): TokenizedText {
  const tokens = wordTokens(text);
  return { tokens, tokenSet: new Set(tokens) };
}

function tokenPresentLoose(text: TokenizedText, f: string): boolean {
  if (text.tokenSet.has(f)) return true;
  for (const member of inflectionFamily(f)) if (text.tokenSet.has(member)) return true;
  // reverse direction (text token inflected relative to f) — rare, scan only then
  for (const t of text.tokenSet) if (inflectionFamily(t).has(f)) return true;
  return false;
}

/** Contiguous in-order match of the form's token sequence. */
export function phraseExact(text: TokenizedText, form: string): boolean {
  const seq = wordTokens(form);
  if (seq.length === 0) return false;
  const first = seq[0] as string;
  outer: for (let i = 0; i <= text.tokens.length - seq.length; i += 1) {
    if (!tokenMatches(text.tokens[i] as string, first)) continue;
    for (let j = 1; j < seq.length; j += 1) {
      if (!tokenMatches(text.tokens[i + j] as string, seq[j] as string)) continue outer;
    }
    return true;
  }
  return false;
}

export type TraceResult = "exact" | "loose" | "miss";

/** Function words ignored by the LOOSE check — "going for walks" must still
 *  trace "to go for a walk". Exact matching is unaffected. */
const LOOSE_SKIP = new Set(["a", "an", "the", "to", "of"]);

/** Review-mode tracing: exact, else all-content-tokens-present, else miss. */
export function traceForms(text: TokenizedText, forms: string[]): TraceResult {
  for (const form of forms) if (phraseExact(text, form)) return "exact";
  for (const form of forms) {
    const seq = wordTokens(form).filter((f) => !LOOSE_SKIP.has(f));
    if (seq.length > 0 && seq.every((f) => tokenPresentLoose(text, f))) return "loose";
  }
  return "miss";
}
