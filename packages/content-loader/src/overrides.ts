/**
 * @domigo/content-loader/overrides — the Studio overlay security core (S-1).
 *
 * PURE and IO-free (no `node:fs`, no `server-only`) so it is unit-testable and
 * importable from any layer (the API route, the content-service, scripts).
 *
 * The one job of this module: let a teacher edit **prose** on a task item —
 * hints, glosses, explanations, the definition, the carrier/prompt SENTENCE —
 * while making the **grading keys physically unreachable**. It is an ALLOWLIST,
 * not a blocklist: it permits exactly the known-safe prose fields and rejects
 * everything else, so answer keys (`g`/`w`/`translation`/`sAnswers`/`dAnswers`/
 * `answers`/`mc`/`distractors`/`pairs`/`groups`/`strict`) and structure
 * (`id`/`format`/`direction`/`prompt.blanks`) can never enter a patch — and no
 * future field slips through by being forgotten (the pattern is adapted from
 * the srdp-practice donor's `lib/content-overrides.ts`).
 *
 * This gates ONLY the untrusted Studio (DB) layer. The trusted, PR-reviewed git
 * overlay (`content/overlays/item-fixes.json`, which legitimately carries the
 * A-5 curation's answer-pool fixes) is applied by `loadUnit` and is out of
 * scope here.
 */
import { countBlanks, type GrammarItem, type VocabItem } from "@domigo/content-schema";

export type ItemKind = "vocab" | "grammar";

/** A gloss entry (inline `word (= deutsches Wort)`); the only structured prose. */
interface GlossPatch {
  word: string;
  de: string;
  scope: string | null;
}

/** Per-item prose patch. A flat field→value map for ONE item (keyed by itemId
 *  in the DB). Every key here is prose; the validator rejects anything else. */
export interface VocabPatch {
  d?: string; // EN definition (leak-guarded: must not contain the headword)
  s?: string; // carrier sentence (blank-guarded: keeps exactly one ___)
  hintDe?: string; // German hint
  gloss?: GlossPatch[]; // inline glosses
}

export interface GrammarPatch {
  prompt?: { text: string }; // ONLY the prose text (blank count is preserved)
  hintDe?: string;
  hintEn?: string | null;
  explainDe?: string;
  explainEn?: string | null;
  gloss?: GlossPatch[];
}

export type ItemPatch = VocabPatch | GrammarPatch;

/**
 * THE FIELD LIST (the Koki-gated allowlist). One Set per item kind — editing
 * this Set is the whole policy surface. Everything absent is locked forever.
 * Grammar's `prompt` is the one nested field; it gets its own inner allowlist
 * (`GRAMMAR_PROMPT_KEYS`) so only `prompt.text` is reachable, never
 * `prompt.blanks` / `prompt.lang`.
 */
export const VOCAB_PROSE_KEYS = new Set<keyof VocabPatch>(["d", "s", "hintDe", "gloss"]);
export const GRAMMAR_PROSE_KEYS = new Set<keyof GrammarPatch>(["prompt", "hintDe", "hintEn", "explainDe", "explainEn", "gloss"]);
const GRAMMAR_PROMPT_KEYS = new Set(["text"]);
/** Prose fields that may be cleared to null (optional helper text). */
const GRAMMAR_NULLABLE = new Set<keyof GrammarPatch>(["hintEn", "explainEn"]);

const MAX_FIELD_LEN = 8000;

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** V-8 leak check, re-expressed: the definition must not contain the headword. */
function leaksHeadword(definition: string, headword: string): boolean {
  const w = headword.toLowerCase();
  if (w === "") return false;
  return new RegExp(`(?<![a-z])${escapeRegExp(w)}(?![a-z])`).test(definition.toLowerCase());
}

function checkGloss(value: unknown, where: string, errors: string[]): void {
  if (!Array.isArray(value)) {
    errors.push(`${where}: gloss must be an array`);
    return;
  }
  for (const [i, g] of value.entries()) {
    if (!isPlainObject(g)) {
      errors.push(`${where}[${i}]: gloss entry must be an object`);
      continue;
    }
    for (const k of Object.keys(g)) {
      if (k !== "word" && k !== "de" && k !== "scope") {
        errors.push(`${where}[${i}].${k}: only word/de/scope allowed on a gloss`);
      }
    }
    if (typeof g.word !== "string" || g.word.length === 0) errors.push(`${where}[${i}].word: required non-empty string`);
    if (typeof g.de !== "string" || g.de.length === 0) errors.push(`${where}[${i}].de: required non-empty string`);
    if (!(g.scope === null || typeof g.scope === "string")) errors.push(`${where}[${i}].scope: must be a string or null`);
  }
}

function checkText(value: unknown, where: string, nullable: boolean, errors: string[]): void {
  if (value === null) {
    if (!nullable) errors.push(`${where}: null not allowed here`);
    return;
  }
  if (typeof value !== "string") {
    errors.push(`${where}: must be a string (got ${Array.isArray(value) ? "array" : typeof value}) — key/structure fields cannot be patched here`);
    return;
  }
  if (value.length === 0) errors.push(`${where}: must be non-empty`);
  if (value.length > MAX_FIELD_LEN) errors.push(`${where}: too long (${value.length} > ${MAX_FIELD_LEN})`);
}

/**
 * Validate an incoming patch against the live base item. Returns collected
 * errors (never throws) — the caller returns 400 with `errors` on `!ok`. The
 * base is re-loaded fresh at every call site (save AND publish), so a stale
 * patch that no longer fits its item is caught.
 */
export function validatePatch(kind: ItemKind, patch: unknown, base: VocabItem | GrammarItem): ValidationResult {
  const errors: string[] = [];
  if (!isPlainObject(patch)) return { ok: false, errors: ["patch must be an object"] };

  if (kind === "vocab") {
    const v = base as VocabItem;
    for (const [k, val] of Object.entries(patch)) {
      if (!VOCAB_PROSE_KEYS.has(k as keyof VocabPatch)) {
        errors.push(`${k}: not an editable field (grading keys — g, w, translation, sAnswers, dAnswers, mc — are locked by construction)`);
        continue;
      }
      if (k === "gloss") {
        checkGloss(val, "gloss", errors);
      } else if (k === "s") {
        checkText(val, "s", false, errors);
        if (typeof val === "string" && countBlanks(val) !== 1) errors.push("s: the carrier sentence must keep exactly one ___ blank");
      } else if (k === "d") {
        checkText(val, "d", false, errors);
        if (typeof val === "string" && leaksHeadword(val, v.w)) errors.push(`d: the definition must not contain the headword "${v.w}"`);
      } else {
        checkText(val, k, false, errors);
      }
    }
  } else {
    const g = base as GrammarItem;
    for (const [k, val] of Object.entries(patch)) {
      if (!GRAMMAR_PROSE_KEYS.has(k as keyof GrammarPatch)) {
        errors.push(`${k}: not an editable field (answers, distractors, pairs, groups, format, direction, strict are locked by construction)`);
        continue;
      }
      if (k === "gloss") {
        checkGloss(val, "gloss", errors);
      } else if (k === "prompt") {
        if (!isPlainObject(val)) {
          errors.push("prompt: must be an object with only { text }");
          continue;
        }
        for (const pk of Object.keys(val)) {
          if (!GRAMMAR_PROMPT_KEYS.has(pk)) errors.push(`prompt.${pk}: only prompt.text is editable (blanks/lang are locked)`);
        }
        checkText(val.text, "prompt.text", false, errors);
        // blank-count preserved: the ___ markers must still equal the base's
        // declared blank count, or the answers would no longer fit.
        if (typeof val.text === "string" && countBlanks(val.text) !== g.prompt.blanks) {
          errors.push(`prompt.text: must keep exactly ${g.prompt.blanks} ___ blank(s) (matches the answer key)`);
        }
      } else {
        checkText(val, k, GRAMMAR_NULLABLE.has(k as keyof GrammarPatch), errors);
      }
    }
  }

  return { ok: errors.length === 0, errors };
}

/**
 * Apply a (validated) patch onto a base item, returning a new item. Iterates
 * the ALLOWLIST, not the patch's keys — so even an un-validated or stale patch
 * cannot write a non-prose field, and an empty patch returns a deep-equal
 * clone (the byte-identical passthrough the loader relies on).
 */
export function applyStudioOverlay<T extends VocabItem | GrammarItem>(kind: ItemKind, base: T, patch: ItemPatch | null | undefined): T {
  const clone = structuredClone(base);
  if (!patch) return clone;
  const p = patch as Record<string, unknown>;

  if (kind === "vocab") {
    const c = clone as VocabItem;
    for (const k of VOCAB_PROSE_KEYS) {
      if (k in p && p[k] !== undefined) (c as unknown as Record<string, unknown>)[k] = structuredClone(p[k]);
    }
  } else {
    const c = clone as GrammarItem;
    for (const k of GRAMMAR_PROSE_KEYS) {
      if (!(k in p) || p[k] === undefined) continue;
      if (k === "prompt") {
        const pt = p.prompt as { text?: unknown } | undefined;
        if (isPlainObject(pt) && typeof pt.text === "string") c.prompt = { ...c.prompt, text: pt.text };
      } else {
        (c as unknown as Record<string, unknown>)[k] = structuredClone(p[k]);
      }
    }
  }
  return clone;
}

/**
 * Coerce a jsonb `patch` column from the DB into an object. The neon-http
 * driver may hand back jsonb as a STRING (the standing donor gotcha), so route
 * every read of the patch column through this — never trust that Drizzle
 * already parsed it. Returns an empty patch on anything unusable.
 */
export function normalizePatchColumn(raw: unknown): Record<string, unknown> {
  if (isPlainObject(raw)) return raw;
  if (typeof raw === "string") {
    if (raw.length === 0) return {};
    try {
      const parsed = JSON.parse(raw);
      if (isPlainObject(parsed)) return parsed;
    } catch {
      return {};
    }
  }
  return {};
}

/** Order-stable "field" labels for the revision timeline + fold-back diff. */
export function fieldsChanged(patch: ItemPatch | null | undefined): string[] {
  if (!patch) return [];
  return Object.keys(patch)
    .filter((k) => (patch as Record<string, unknown>)[k] !== undefined)
    .sort();
}
