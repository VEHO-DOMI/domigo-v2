/**
 * @domigo/content-loader — read approved corpus items for the runtime.
 *
 * Server-only (uses node:fs). The runtime reads the committed JSON directly —
 * there is no build/export step. This MIRRORS the pipeline's read path
 * (`packages/content-pipeline/src/gen-items.ts` readUnitItems + applyItemFixes)
 * so a unit reads identically in the trainer and in the content pipeline:
 *   - parse vocab.json / grammar.json against the frozen file schemas, then
 *   - apply the stage-8 review overlay (item-fixes.json: drops + field patches).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GrammarFile, GrammarStructuresFile, ListeningFile, TestFile, VocabFile, WordBank } from "@domigo/content-schema";
import type { GrammarItem, GrammarStructure, VocabItem } from "@domigo/content-schema";

/**
 * Repo root. The pipeline derives it from the module path (paths.ts:22), but a
 * bundler (Next/Turbopack) can rewrite `import.meta.url`, so we treat that as
 * one candidate and otherwise walk up from cwd looking for the corpus marker.
 */
function findRepoRoot(): string {
  const candidates: string[] = [];
  try {
    candidates.push(path.resolve(fileURLToPath(import.meta.url), "../../../.."));
  } catch {
    /* import.meta.url unavailable under some bundlers */
  }
  let dir = process.cwd();
  for (let i = 0; i < 10; i++) {
    candidates.push(dir);
    const up = path.dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, "content", "corpus", "units"))) return c;
  }
  return candidates[0] ?? process.cwd();
}

export const REPO_ROOT = findRepoRoot();
const CONTENT_DIR = path.join(REPO_ROOT, "content");
const UNITS_DIR = path.join(CONTENT_DIR, "corpus", "units");
const ITEM_FIXES_PATH = path.join(CONTENT_DIR, "overlays", "item-fixes.json");
const STRUCTURES_DIR = path.join(CONTENT_DIR, "corpus", "structures");

const UNIT_SLUG = /^g[1-4]-u\d{2}$/;

function readJson<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

/** Stage-8 review overlay shape (one entry per unit). */
export interface ItemFixes {
  [slug: string]: {
    drop?: string[];
    patch?: Record<string, Record<string, unknown>>;
  };
}

function applyFixes<T extends { id: string }>(list: T[], fix: ItemFixes[string] | undefined): T[] {
  if (fix === undefined) return list;
  const drop = new Set(fix.drop ?? []);
  const patch = fix.patch ?? {};
  return list
    .filter((it) => !drop.has(it.id))
    .map((it) => {
      const p = patch[it.id];
      return p !== undefined ? ({ ...it, ...p } as T) : it;
    });
}

export interface UnitContent {
  slug: string;
  vocab: VocabItem[];
  grammar: GrammarItem[];
}

/** Load + schema-validate + overlay-apply one unit's approved items. */
export function loadUnit(slug: string): UnitContent {
  if (!UNIT_SLUG.test(slug)) throw new Error(`content-loader: bad unit slug "${slug}"`);
  const dir = path.join(UNITS_DIR, slug);
  const vraw = readJson<unknown>(path.join(dir, "vocab.json"));
  const graw = readJson<unknown>(path.join(dir, "grammar.json"));
  const vocab = vraw !== null ? VocabFile.parse(vraw).items : [];
  const grammar = graw !== null ? GrammarFile.parse(graw).items : [];
  const fix = (readJson<ItemFixes>(ITEM_FIXES_PATH) ?? {})[slug];
  return { slug, vocab: applyFixes(vocab, fix), grammar: applyFixes(grammar, fix) };
}

/** Load + validate one unit's word bank (teaching source for the vocab-intro node). Server-only. */
export function loadWordbank(slug: string): WordBank {
  if (!UNIT_SLUG.test(slug)) throw new Error(`content-loader: bad unit slug "${slug}"`);
  const raw = readJson<unknown>(path.join(UNITS_DIR, slug, "wordbank.json"));
  if (raw === null) throw new Error(`content-loader: no wordbank for "${slug}"`);
  return WordBank.parse(raw);
}

/** The grammar structures introduced in this unit (teaching source for the grammar-intro node). Server-only. */
export function loadUnitStructures(slug: string): GrammarStructure[] {
  const m = /^g([1-4])-u(\d{2})$/.exec(slug);
  if (m === null) throw new Error(`content-loader: bad unit slug "${slug}"`);
  const grade = Number(m[1]);
  const unit = Number(m[2]);
  const raw = readJson<unknown>(path.join(STRUCTURES_DIR, `g${grade}`, "structures.json"));
  if (raw === null) return [];
  return GrammarStructuresFile.parse(raw).structures.filter((s) => s.unit === unit);
}

/** Load + validate one unit's listening tasks (B3). Null if the unit has none. Server-only. */
export function loadListening(slug: string): ListeningFile | null {
  if (!UNIT_SLUG.test(slug)) throw new Error(`content-loader: bad unit slug "${slug}"`);
  const raw = readJson<unknown>(path.join(UNITS_DIR, slug, "listening.json"));
  return raw === null ? null : ListeningFile.parse(raw);
}

/** Unit slugs that have a listening.json (the listening "approval" signal), sorted. */
export function listListeningUnits(): string[] {
  if (!fs.existsSync(UNITS_DIR)) return [];
  return fs
    .readdirSync(UNITS_DIR)
    .filter((n) => UNIT_SLUG.test(n))
    .filter((slug) => fs.existsSync(path.join(UNITS_DIR, slug, "listening.json")))
    .sort();
}

/** Load + validate one unit's mock test (B2). Null if the unit has none. Server-only. */
export function loadTest(slug: string): TestFile | null {
  if (!UNIT_SLUG.test(slug)) throw new Error(`content-loader: bad unit slug "${slug}"`);
  const raw = readJson<unknown>(path.join(UNITS_DIR, slug, "test.json"));
  return raw === null ? null : TestFile.parse(raw);
}

/** Unit slugs that have a test.json (the mock-test "approval" signal), sorted. */
export function listTestUnits(): string[] {
  if (!fs.existsSync(UNITS_DIR)) return [];
  return fs
    .readdirSync(UNITS_DIR)
    .filter((n) => UNIT_SLUG.test(n))
    .filter((slug) => fs.existsSync(path.join(UNITS_DIR, slug, "test.json")))
    .sort();
}

interface StateLogFile {
  transitions: Array<{ state: string; at: string }>;
}

/** Unit slugs whose latest state transition is `approved`, sorted. */
export function listApprovedUnits(): string[] {
  if (!fs.existsSync(UNITS_DIR)) return [];
  return fs
    .readdirSync(UNITS_DIR)
    .filter((n) => UNIT_SLUG.test(n))
    .filter((slug) => {
      const st = readJson<StateLogFile>(path.join(UNITS_DIR, slug, "state.json"));
      return st?.transitions.at(-1)?.state === "approved";
    })
    .sort();
}
