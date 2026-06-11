/**
 * Stage 5 — `content gen --prepare|--ingest --unit <slug> [--fix]`.
 *
 * Item generation, agent-performed, deterministically bracketed:
 *   --prepare        gen/brief.vocab.md + gen/brief.grammar.md (pinned prompt
 *                    inlined, bank table, allowed-vocabulary digest, full
 *                    SB/WB transcripts, UNTRUSTED v1 seeds, output contract)
 *   (agents author gen/vocab.draft.json + gen/grammar.draft.json)
 *   --ingest         zod-validate drafts, mint ids (vocab id == word id;
 *                    grammar ids fingerprint-pinned in items.lock.json),
 *                    apply overlays/item-fixes.json, write vocab.json +
 *                    grammar.json, state → generated
 *   --prepare --fix  gen/brief.fix.md (ONLY flagged items + their flags)
 *   --ingest  --fix  gen/{vocab,grammar}.fixdraft.json → per-item replace,
 *                    rev bump, fingerprint re-key
 */
import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import type {
  Grade,
  GrammarFormat,
  GrammarItem as GrammarItemT,
  GrammarStructuresFile as GrammarStructuresFileT,
  TieredAnswer as TieredAnswerT,
  VocabItem as VocabItemT,
  WordBank as WordBankT,
} from "@domigo/content-schema";
import {
  countBlanks,
  FORMAT_CODES,
  GameMeta,
  Gloss,
  GrammarFile,
  GrammarFormat as GrammarFormatZ,
  Difficulty,
  SentenceSource,
  StructureId,
  TieredAnswer,
  TranslationDirection,
  UnitSlug,
  unitIdPrefix,
  VocabFile,
  WordId,
} from "@domigo/content-schema";
import { grantsForUnit, buildAllowedMatcher, cumulativeSlugs, PROPER_NOUNS_PATH, type ProperNounsFile } from "./cumulative-bank.ts";
import { loadGradeBoxes } from "./grammar-boxes.ts";
import { readJsonIfExists, sha256OfString, writeJson, writeText } from "./json.ts";
import { MULTI_SEP, renderTable } from "./mdtable.ts";
import { OVERLAYS_DIR, PROMPTS_DIR, STRUCTURES_DIR, TRANSCRIPTS_DIR, UNITS_DIR } from "./paths.ts";
import { entryMatchesWord } from "./review-wordbank.ts";
import { appendTransition, currentState } from "./state.ts";
import { wordTokens } from "./tokenize.ts";
import { loadV1GrammarModule, v1ItemsByStructure, type V1GrammarItem } from "./v1grammar.ts";

// ---------------------------------------------------------------------------
// shared unit-item plumbing (stage 6/7/8 import these)
// ---------------------------------------------------------------------------

export interface UnitItems {
  vocab: VocabItemT[];
  grammar: GrammarItemT[];
}

export function readUnitItems(slug: string): UnitItems {
  const unitDir = path.join(UNITS_DIR, slug);
  const vocab = readJsonIfExists<{ items: VocabItemT[] }>(path.join(unitDir, "vocab.json"));
  const grammar = readJsonIfExists<{ items: GrammarItemT[] }>(path.join(unitDir, "grammar.json"));
  return { vocab: vocab?.items ?? [], grammar: grammar?.items ?? [] };
}

/** Canonical content hash over a unit's item layer (all item-stage gates). */
export function itemsContentHash(items: UnitItems): string {
  return sha256OfString(JSON.stringify({ vocab: items.vocab, grammar: items.grammar }));
}

export interface ItemFixes {
  [slug: string]: {
    drop?: string[];
    patch?: Record<string, Record<string, unknown>>;
  };
}

export const ITEM_FIXES_PATH = path.join(OVERLAYS_DIR, "item-fixes.json");

/** Apply stage-8 review edits (drops + field patches) in memory. */
export function applyItemFixes(slug: string, items: UnitItems, fixes?: ItemFixes | null): UnitItems {
  const unitFix = (fixes ?? readJsonIfExists<ItemFixes>(ITEM_FIXES_PATH))?.[slug];
  if (unitFix === undefined) return items;
  const drop = new Set(unitFix.drop ?? []);
  const patch = unitFix.patch ?? {};
  const apply = <T extends { id: string }>(list: T[]): T[] =>
    list
      .filter((it) => !drop.has(it.id))
      .map((it) => {
        const p = patch[it.id];
        return p !== undefined ? ({ ...it, ...p } as T) : it;
      });
  return { vocab: apply(items.vocab), grammar: apply(items.grammar) };
}

export function promptHash(name: string): string {
  const file = path.join(PROMPTS_DIR, `${name}.md`);
  return sha256OfString(fs.readFileSync(file, "utf8")).slice(0, 12);
}

function promptText(name: string): string {
  return fs.readFileSync(path.join(PROMPTS_DIR, `${name}.md`), "utf8").trimEnd();
}

// ---------------------------------------------------------------------------
// draft contracts
// ---------------------------------------------------------------------------

const Hash12 = z.string().regex(/^[0-9a-f]{12}$/);

const VocabDraftItem = z.object({
  wordId: WordId,
  w: z.string().min(1),
  g: z.string().min(1),
  d: z.string().min(1),
  s: z.string().min(1),
  sSource: SentenceSource,
  sAnswers: z.array(TieredAnswer).min(1),
  dAnswers: z.array(TieredAnswer).min(1),
  translation: z.object({
    deToEn: z.array(TieredAnswer).min(1),
    enToDe: z.array(TieredAnswer).min(1),
  }),
  gloss: z.array(Gloss),
  mc: z.array(z.string().min(1)).length(3),
  hintDe: z.string().min(1),
  difficulty: Difficulty,
  gameMeta: GameMeta, // REQUIRED for vocab items
  seedV1: z.string().nullable(),
  sbRef: z.string().nullable(),
  note: z.string().nullable(),
});
type VocabDraftItemT = z.infer<typeof VocabDraftItem>;

const VocabDraft = z.object({
  schema: z.literal("vocab-draft@1"),
  slug: UnitSlug,
  briefBank: Hash12,
  briefPrompt: Hash12,
  items: z.array(VocabDraftItem).min(1),
});

const GrammarDraftItem = z.object({
  structureId: StructureId,
  format: GrammarFormatZ,
  difficulty: Difficulty,
  prompt: z.object({
    text: z.string().min(1),
    lang: z.enum(["en", "de"]),
    blanks: z.number().int().min(0).max(4),
  }),
  answers: z.array(TieredAnswer),
  direction: TranslationDirection.nullable(),
  distractors: z.array(z.string().min(1)),
  pairs: z.array(z.object({ left: z.string().min(1), right: z.string().min(1) })),
  groups: z.array(z.object({ label: z.string().min(1), members: z.array(z.string().min(1)).min(2) })),
  hintDe: z.string().min(1),
  hintEn: z.string().nullable(),
  explainDe: z.string().min(1),
  explainEn: z.string().nullable(),
  strict: z.boolean(),
  gloss: z.array(Gloss),
  gameMeta: GameMeta.nullable(),
  seedV1: z.string().nullable(),
  sbRef: z.string().nullable(),
  note: z.string().nullable(),
});
type GrammarDraftItemT = z.infer<typeof GrammarDraftItem>;

const GrammarDraft = z.object({
  schema: z.literal("grammar-draft@1"),
  slug: UnitSlug,
  briefBank: Hash12,
  briefPrompt: Hash12,
  items: z.array(GrammarDraftItem).min(1),
});

const VocabFixDraft = z.object({
  schema: z.literal("vocab-fixdraft@1"),
  slug: UnitSlug,
  items: z.array(VocabDraftItem).min(1), // wordId == the fixed item's id
});

const GrammarFixDraft = z.object({
  schema: z.literal("grammar-fixdraft@1"),
  slug: UnitSlug,
  items: z.array(GrammarDraftItem.extend({ id: z.string().min(1) })).min(1),
});

// ---------------------------------------------------------------------------
// grammar item ids — fingerprint-pinned (pure, exported for tests)
// ---------------------------------------------------------------------------

export interface ItemsLock {
  schema: "items-lock@1";
  slug: string;
  /** fingerprint12 → pinned id */
  items: Record<string, string>;
  tombstones: Array<{ id: string; key: string; removedWith: string }>;
}

/**
 * Identity of a grammar item: structure + format + carrier tokens (blanks
 * normalized, inline glosses stripped) + full answers + pairs/groups/
 * distractors. Gloss/punctuation/hint edits keep identity; carrier/answer/
 * format changes mint a new id.
 */
export function itemFingerprint(d: {
  structureId: string;
  format: string;
  prompt: { text: string; blanks: number };
  answers: TieredAnswerT[];
  pairs: Array<{ left: string; right: string }>;
  groups: Array<{ label: string; members: string[] }>;
  distractors: string[];
}): string {
  const promptCore = d.prompt.text.replace(/\([^()]*=[^()]*\)/g, " ");
  const payload = [
    d.structureId,
    d.format,
    String(d.prompt.blanks),
    wordTokens(promptCore).join(" "),
    d.answers
      .filter((a) => a.tier === "full")
      .map((a) => a.text.trim().toLowerCase())
      .sort()
      .join(" "),
    d.pairs.map((p) => `${p.left.trim().toLowerCase()}→${p.right.trim().toLowerCase()}`).sort().join(" "),
    d.groups.map((g) => `${g.label.trim().toLowerCase()}:${g.members.map((m) => m.trim().toLowerCase()).sort().join(",")}`).sort().join(" "),
    [...d.distractors].map((x) => x.trim().toLowerCase()).sort().join(" "),
  ].join("\n");
  return sha256OfString(payload).slice(0, 12);
}

export interface GrammarMint {
  ids: string[]; // per draft index
  lock: ItemsLock;
  lockChanged: boolean;
}

export function mintGrammarItemIds(
  slug: string,
  prefix: string,
  drafts: Array<{ fingerprint: string; structureKey: string; format: GrammarFormat }>,
  lockIn: ItemsLock | null,
  stamp: string,
): GrammarMint {
  const lock: ItemsLock = lockIn
    ? { ...lockIn, items: { ...lockIn.items }, tombstones: [...lockIn.tombstones] }
    : { schema: "items-lock@1", slug, items: {}, tombstones: [] };
  let lockChanged = lockIn === null;

  const usedIds = new Set([...Object.values(lock.items), ...lock.tombstones.map((t) => t.id)]);
  const nextSerial = new Map<string, number>();
  for (const id of usedIds) {
    const m = /\.gi\.([a-z0-9-]+)\.([a-z]{2})\.(\d{3})$/.exec(id);
    if (m === null) continue;
    const key = `${m[1]}.${m[2]}`;
    nextSerial.set(key, Math.max(nextSerial.get(key) ?? 0, parseInt(m[3]!, 10)));
  }

  const ids: string[] = [];
  const seenFps = new Set<string>();
  for (const d of drafts) {
    if (seenFps.has(d.fingerprint)) {
      throw new Error(`${slug}: two draft items share fingerprint ${d.fingerprint} — duplicate item content`);
    }
    seenFps.add(d.fingerprint);
    let id = lock.items[d.fingerprint];
    if (id === undefined) {
      const code = FORMAT_CODES[d.format];
      const serialKey = `${d.structureKey}.${code}`;
      const n = (nextSerial.get(serialKey) ?? 0) + 1;
      nextSerial.set(serialKey, n);
      id = `${prefix}.gi.${d.structureKey}.${code}.${String(n).padStart(3, "0")}`;
      if (usedIds.has(id)) throw new Error(`${slug}: minted id collision ${id}`);
      lock.items[d.fingerprint] = id;
      usedIds.add(id);
      lockChanged = true;
    }
    ids.push(id);
  }
  for (const [fp, id] of Object.entries(lock.items)) {
    if (!seenFps.has(fp)) {
      delete lock.items[fp];
      lock.tombstones.push({ id, key: fp, removedWith: stamp });
      lockChanged = true;
    }
  }
  return { ids, lock, lockChanged };
}

/** Re-key a pinned id to a new fingerprint (review patch / fix round edits). */
export function rekeyFingerprint(lock: ItemsLock, id: string, newFp: string): boolean {
  const oldFp = Object.entries(lock.items).find(([, v]) => v === id)?.[0];
  if (oldFp === newFp) return false;
  const holder = lock.items[newFp];
  if (holder !== undefined && holder !== id) {
    throw new Error(`fingerprint ${newFp} already pinned to ${holder} (collision with ${id})`);
  }
  if (oldFp !== undefined) delete lock.items[oldFp];
  lock.items[newFp] = id;
  return true;
}

// ---------------------------------------------------------------------------
// assembly draft → full item
// ---------------------------------------------------------------------------

function assembleVocabItem(d: VocabDraftItemT, rev: number): VocabItemT {
  return {
    id: d.wordId,
    rev,
    difficulty: d.difficulty,
    presentation: { variants: [], gameMeta: d.gameMeta, audio: null },
    provenance: { by: "fable", sbRef: d.sbRef, seedV1: d.seedV1, narrative: null, note: d.note },
    w: d.w,
    g: d.g,
    d: d.d,
    s: d.s,
    sSource: d.sSource,
    sAnswers: d.sAnswers,
    dAnswers: d.dAnswers,
    translation: d.translation,
    gloss: d.gloss,
    mc: d.mc,
    hintDe: d.hintDe,
  };
}

function assembleGrammarItem(d: GrammarDraftItemT, id: string, rev: number): GrammarItemT {
  return {
    id,
    structureId: d.structureId,
    format: d.format,
    rev,
    difficulty: d.difficulty,
    presentation: { variants: [], gameMeta: d.gameMeta, audio: null },
    provenance: { by: "fable", sbRef: d.sbRef, seedV1: d.seedV1, narrative: null, note: d.note },
    prompt: d.prompt,
    answers: d.answers,
    direction: d.direction,
    distractors: d.distractors,
    pairs: d.pairs,
    groups: d.groups,
    gloss: d.gloss,
    hintDe: d.hintDe,
    hintEn: d.hintEn,
    explainDe: d.explainDe,
    explainEn: d.explainEn,
    strict: d.strict,
  };
}

/** rev semantics: unchanged content keeps the old object verbatim (byte-stable). */
function withRev<T extends { id: string; rev: number }>(next: Omit<T, "rev"> & { rev: number }, prev: T | undefined): T {
  if (prev === undefined) return next as T;
  const a = { ...next, rev: 0 };
  const b = { ...prev, rev: 0 };
  if (JSON.stringify(a) === JSON.stringify(b)) return prev;
  return { ...next, rev: prev.rev + 1 } as T;
}

// ---------------------------------------------------------------------------
// shared loads
// ---------------------------------------------------------------------------

function loadBank(slug: string): WordBankT {
  const raw = readJsonIfExists<WordBankT>(path.join(UNITS_DIR, slug, "wordbank.json"));
  if (raw === null) throw new Error(`${slug}: wordbank.json missing`);
  return raw;
}

export function loadStructuresCatalog(grade: Grade): GrammarStructuresFileT | null {
  return readJsonIfExists<GrammarStructuresFileT>(
    path.join(STRUCTURES_DIR, `g${grade}`, "structures.json"),
  );
}

function gradeUnitOf(slug: string): { grade: Grade; unit: number } {
  const m = /^g([1-4])-u(\d{2})$/.exec(slug);
  if (m === null) throw new Error(`bad slug ${slug}`);
  return { grade: Number(m[1]) as Grade, unit: parseInt(m[2]!, 10) };
}

function transcriptFor(slug: string): string {
  const { grade, unit } = gradeUnitOf(slug);
  const unitRe = new RegExp(`\\bunit\\s*0*${unit}(?!\\d)`, "i");
  const parts: string[] = [];
  for (const sub of ["sb", "wb"] as const) {
    const dir = path.join(TRANSCRIPTS_DIR, `g${grade}`, sub);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".txt") || !unitRe.test(name)) continue;
      parts.push(`----- ${sub.toUpperCase()}: ${name} -----\n${fs.readFileSync(path.join(dir, name), "utf8")}`);
    }
  }
  return parts.join("\n\n");
}

interface V1VocabEntry {
  w: string;
  g?: string;
  d?: string;
  s?: string;
  a?: string[];
  cf?: string;
  mc?: string[];
}

function loadV1VocabUnit(slug: string): V1VocabEntry[] {
  const { grade, unit } = gradeUnitOf(slug);
  const p = path.join(
    UNITS_DIR,
    "..",
    "..",
    "build",
    "v1",
    "vocab",
    `g${grade}`,
    `unit-${String(unit).padStart(2, "0")}.json`,
  );
  return readJsonIfExists<{ entries: V1VocabEntry[] }>(path.resolve(p))?.entries ?? [];
}

// ---------------------------------------------------------------------------
// allowed-vocabulary digest (shared by gen + lens-1 briefs)
// ---------------------------------------------------------------------------

export function allowedVocabularyDigest(slug: string): string {
  const { grade, unit } = gradeUnitOf(slug);
  const lines: string[] = [];
  lines.push("### Allowed vocabulary (the deterministic level gate enforces exactly this)");
  lines.push("");
  lines.push("Cumulative bank — every headword below (plus its inflections and listed forms) is taught:");
  lines.push("");
  for (const s of cumulativeSlugs(grade, unit)) {
    const bank = readJsonIfExists<WordBankT>(path.join(UNITS_DIR, s, "wordbank.json"));
    if (bank === null) continue;
    lines.push(`- **${s}**: ${bank.entries.map((e) => e.en).join(", ")}`);
  }
  const allowlist = readJsonIfExists<{ tokens: Array<{ token: string }> }>(
    path.join(OVERLAYS_DIR, "core-allowlist.json"),
  );
  lines.push("");
  lines.push(`Core allowlist (closed-class, always allowed): ${(allowlist?.tokens ?? []).map((t) => t.token).join(", ")}`);
  const nouns = readJsonIfExists<ProperNounsFile>(PROPER_NOUNS_PATH);
  if (nouns !== null) {
    const allowed = new Set(cumulativeSlugs(grade, unit));
    const names = new Set<string>();
    for (const [unitKey, list] of Object.entries(nouns.units)) {
      if (!allowed.has(unitKey)) continue;
      for (const n of list) names.add(n.token);
    }
    if (names.size > 0) {
      lines.push("");
      lines.push(`Harvested proper nouns (≤ this unit): ${[...names].sort().join(", ")}`);
    }
  }
  lines.push("");
  lines.push("Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// --prepare (full)
// ---------------------------------------------------------------------------

function bankHash12(slug: string): string {
  const bank = loadBank(slug);
  return sha256OfString(JSON.stringify(bank.entries)).slice(0, 12);
}

function renderVocabBrief(slug: string): string {
  const bank = loadBank(slug);
  const bHash = bankHash12(slug);
  const pHash = sha256OfString(`${promptText("shared-rules")}\n${promptText("gen-vocab")}`).slice(0, 12);
  const v1 = loadV1VocabUnit(slug);

  const lines: string[] = [];
  lines.push(`# Vocab generation brief — ${slug} (MORE! ${bank.grade}, Unit ${bank.unit})`);
  lines.push("");
  lines.push(`<!-- domigo:gen vocab ${slug} bank=${bHash} prompt=${pHash} -->`);
  lines.push("");
  lines.push(promptText("shared-rules"));
  lines.push("");
  lines.push(promptText("gen-vocab"));
  lines.push("");
  lines.push("## Word bank (one item per row — this is your work list)");
  lines.push("");
  lines.push(
    renderTable(
      ["id", "en", "de", "kind", "theme", "exampleSb", "cf", "forms"],
      bank.entries.map((e) => [
        e.id,
        e.en,
        e.de.join(MULTI_SEP),
        e.kind,
        e.theme ?? "—",
        e.exampleSb ?? "—",
        e.cf ?? "—",
        e.forms.join(MULTI_SEP),
      ]),
    ),
  );
  lines.push("");
  lines.push(allowedVocabularyDigest(slug));
  lines.push("");
  lines.push("## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)");
  lines.push("");
  lines.push("Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.");
  lines.push("");
  for (const e of bank.entries) {
    const seed = v1.find((ve) => entryMatchesWord(e, ve.w));
    if (seed === undefined) continue;
    lines.push(`- \`${e.id}\` ← v1 \`${seed.w}\`: d=${JSON.stringify(seed.d ?? null)} · s=${JSON.stringify(seed.s ?? null)} · a=${JSON.stringify(seed.a ?? [])} · mc=${JSON.stringify(seed.mc ?? [])}`);
  }
  lines.push("");
  lines.push("## Unit transcripts (textbook sentences live here — use them first)");
  lines.push("");
  lines.push("```");
  lines.push(transcriptFor(slug));
  lines.push("```");
  lines.push("");
  lines.push("## Output contract");
  lines.push("");
  lines.push(`Write \`content/corpus/units/${slug}/gen/vocab.draft.json\`:`);
  lines.push("");
  lines.push("```jsonc");
  lines.push(`{
  "schema": "vocab-draft@1",
  "slug": "${slug}",
  "briefBank": "${bHash}",
  "briefPrompt": "${pHash}",
  "items": [
    {
      "wordId": "g2u03.w.witch",        // the bank id this item teaches (EVERY bank row exactly once)
      "w": "witch",                     // == bank en, verbatim
      "g": "Hexe",                      // one of the bank's de values (the primary sense)
      "d": "…", "s": "… ___ …", "sSource": "masterlist|sb|wb|invented",
      "sAnswers": [{ "text": "…", "tier": "full|partial" }],
      "dAnswers": [{ "text": "…", "tier": "full" }],
      "translation": { "deToEn": [{ "text": "…", "tier": "full" }], "enToDe": [{ "text": "…", "tier": "full" }] },
      "gloss": [],                      // [{ "word": "…", "de": "…", "scope": "s"|"d"|null }]
      "mc": ["…", "…", "…"],
      "hintDe": "…",
      "difficulty": 1,
      "gameMeta": { "distractorPool": ["…", "…", "…", "…"], "chipBudget": null, "minOptions": 4 },
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}`);
  lines.push("```");
  lines.push("");
  return lines.join("\n");
}

function renderGrammarBrief(slug: string): string | null {
  const bank = loadBank(slug);
  const { grade, unit } = gradeUnitOf(slug);
  const catalog = loadStructuresCatalog(grade);
  if (catalog === null) throw new Error(`g${grade}: no structures catalog — run \`content gen --structures --grade ${grade}\` first`);
  const structures = catalog.structures.filter((s) => s.unit === unit);
  if (structures.length === 0) return null;

  const bHash = bankHash12(slug);
  const pHash = sha256OfString(`${promptText("shared-rules")}\n${promptText("gen-grammar")}`).slice(0, 12);
  const v1 = loadV1GrammarModule(grade);
  const byStructure = v1ItemsByStructure(v1.module);
  const boxes = loadGradeBoxes(grade);

  const lines: string[] = [];
  lines.push(`# Grammar generation brief — ${slug} (MORE! ${grade}, Unit ${unit})`);
  lines.push("");
  lines.push(`<!-- domigo:gen grammar ${slug} bank=${bHash} prompt=${pHash} -->`);
  lines.push("");
  lines.push(promptText("shared-rules"));
  lines.push("");
  lines.push(promptText("gen-grammar"));
  lines.push("");
  lines.push("## Structures of this unit");
  lines.push("");
  for (const s of structures) {
    const seeds: V1GrammarItem[] = s.seedV1.flatMap((id) => byStructure.get(id) ?? []);
    lines.push(`### \`${s.id}\` — ${s.name} (${s.nameDe})`);
    lines.push("");
    lines.push(s.description);
    lines.push("");
    lines.push(`v1 floor for this structure: **${seeds.length} item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.`);
    lines.push("");
    for (const r of s.rules) {
      lines.push(`- rule [${r.id}]: ${r.en}`);
      lines.push(`  - DE: ${r.de}`);
      for (const ex of r.examples) lines.push(`  - "${ex.en}" — "${ex.de}"`);
    }
    if (s.commonErrors.length > 0) {
      lines.push("");
      lines.push("common errors:");
      for (const e of s.commonErrors) lines.push(`- ${e.description}: ✗ "${e.wrong}" → ✓ "${e.correct}"`);
    }
    for (const ref of s.sbRefs) {
      const file = ref.split("#")[0] ?? "";
      const box = (boxes.byFile.get(file) ?? []).find((b) => b.ref === ref);
      if (box === undefined) continue;
      lines.push("");
      lines.push(`SB box \`${ref}\` — ${box.title ?? "(untitled)"}:`);
      lines.push("```");
      for (const l of box.lines) lines.push(l);
      lines.push("```");
    }
    if (seeds.length > 0) {
      lines.push("");
      lines.push("v1 seed items (UNTRUSTED):");
      for (const it of seeds) {
        lines.push(`- \`${it.id}\` [${it.t}, d${it.d}]: p=${JSON.stringify(it.p)} c=${JSON.stringify(it.c)} a=${JSON.stringify(it.a ?? [])} ds=${JSON.stringify(it.ds ?? [])}`);
      }
    }
    lines.push("");
  }
  lines.push(allowedVocabularyDigest(slug));
  lines.push("");
  lines.push("## Unit transcripts (carrier material — the unit's world)");
  lines.push("");
  lines.push("```");
  lines.push(transcriptFor(slug));
  lines.push("```");
  lines.push("");
  lines.push("## Output contract");
  lines.push("");
  lines.push(`Write \`content/corpus/units/${slug}/gen/grammar.draft.json\`:`);
  lines.push("");
  lines.push("```jsonc");
  lines.push(`{
  "schema": "grammar-draft@1",
  "slug": "${slug}",
  "briefBank": "${bHash}",
  "briefPrompt": "${pHash}",
  "items": [
    {
      "structureId": "${structures[0]!.id}",
      "format": "gap-fill",             // gap-fill|multiple-choice|context-picker|translation|error-correction|transformation|question-formation|free-form|sentence-building|matching|anagram|group-sort|matching-pairs
      "difficulty": 1,
      "prompt": { "text": "…", "lang": "en", "blanks": 1 },
      "answers": [{ "text": "…", "tier": "full" }],
      "direction": null,                 // REQUIRED ("deToEn"|"enToDe") iff format=translation
      "distractors": [], "pairs": [], "groups": [],
      "hintDe": "…", "hintEn": null,
      "explainDe": "…", "explainEn": null,
      "strict": false,                   // true for minimal pairs (should/shouldn't!)
      "gloss": [],
      "gameMeta": null,                  // REQUIRED for multiple-choice, context-picker, sentence-building
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}`);
  lines.push("```");
  lines.push("");
  lines.push("Do NOT include ids — the pipeline mints them. No two items may share the same carrier+answers (duplicates are rejected).");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// --prepare --fix
// ---------------------------------------------------------------------------

interface MergedVerify {
  round: number;
  itemsHash: string;
  byItem: Record<string, Array<{ kind: string; severity: string; note: string; lens: string }>>;
  fixCount: number;
  escalated: string[];
}

export function collectFixTargets(slug: string): Map<string, Array<{ kind: string; note: string; source: string }>> {
  const targets = new Map<string, Array<{ kind: string; note: string; source: string }>>();
  const merged = readJsonIfExists<MergedVerify>(path.join(UNITS_DIR, slug, "verify", "verify.merged.json"));
  for (const [itemId, flags] of Object.entries(merged?.byItem ?? {})) {
    for (const f of flags) {
      if (f.severity !== "fix") continue;
      const list = targets.get(itemId) ?? [];
      list.push({ kind: f.kind, note: f.note, source: `lens:${f.lens}` });
      targets.set(itemId, list);
    }
  }
  const reviewFlags = readJsonIfExists<{
    unit: { verdict: string };
    flags: Array<{ kind: string; itemId: string | null; verdict: string; note: string }>;
  }>(path.join(UNITS_DIR, slug, "review", "items.flags.json"));
  if (reviewFlags?.unit.verdict === "changes") {
    for (const f of reviewFlags.flags) {
      if (f.verdict !== "fix" && f.verdict !== "add") continue;
      const id = f.itemId ?? "unit";
      const list = targets.get(id) ?? [];
      list.push({ kind: f.kind, note: f.note, source: "review" });
      targets.set(id, list);
    }
  }
  return targets;
}

function renderFixBrief(slug: string): string {
  const items = readUnitItems(slug);
  const targets = collectFixTargets(slug);
  if (targets.size === 0) throw new Error(`${slug}: nothing to fix (no fix-severity lens flags / review fix verdicts)`);
  const bHash = bankHash12(slug);
  const pHash = sha256OfString(`${promptText("shared-rules")}\n${promptText("gen-fix")}`).slice(0, 12);

  const byId = new Map<string, VocabItemT | GrammarItemT>();
  for (const it of items.vocab) byId.set(it.id, it);
  for (const it of items.grammar) byId.set(it.id, it);

  const lines: string[] = [];
  lines.push(`# Fix brief — ${slug}`);
  lines.push("");
  lines.push(`<!-- domigo:gen fix ${slug} bank=${bHash} prompt=${pHash} -->`);
  lines.push("");
  lines.push(promptText("shared-rules"));
  lines.push("");
  lines.push(promptText("gen-fix"));
  lines.push("");
  lines.push(allowedVocabularyDigest(slug));
  lines.push("");
  lines.push("## Flagged items");
  lines.push("");
  for (const [itemId, flags] of [...targets.entries()].sort()) {
    if (itemId === "unit") {
      lines.push(`### unit-level requests`);
      for (const f of flags) lines.push(`- [${f.source}] ${f.kind}: ${f.note}`);
      lines.push("");
      continue;
    }
    const item = byId.get(itemId);
    lines.push(`### \`${itemId}\``);
    for (const f of flags) lines.push(`- [${f.source}] **${f.kind}**: ${f.note}`);
    lines.push("");
    lines.push("```json");
    lines.push(JSON.stringify(item ?? { missing: itemId }, null, 2));
    lines.push("```");
    lines.push("");
  }
  lines.push("## Output contract");
  lines.push("");
  lines.push(`Fixed vocab items → \`content/corpus/units/${slug}/gen/vocab.fixdraft.json\` (\`vocab-fixdraft@1\`, items in the vocab-draft shape, \`wordId\` = the item id).`);
  lines.push(`Fixed grammar items → \`content/corpus/units/${slug}/gen/grammar.fixdraft.json\` (\`grammar-fixdraft@1\`, items in the grammar-draft shape PLUS \`"id"\`).`);
  lines.push("Unit-level requests (coverage gaps) → NEW grammar items in the same grammar fixdraft WITHOUT an id (the pipeline mints).");
  lines.push("Only write the file(s) you actually have fixes for.");
  lines.push("");
  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// runners
// ---------------------------------------------------------------------------

const ITEM_STATES = new Set(["generated", "verified", "validated", "review_ready", "approved", "changes_requested"]);

export function runGenItemsPrepare(slug: string, fix: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const state = currentState(unitDir)?.state ?? "—";
  if (state !== "wordbank_approved" && !ITEM_STATES.has(state)) {
    throw new Error(`${slug}: state is ${state} — items need an approved word bank first`);
  }
  if (fix) {
    const dest = path.join(unitDir, "gen", "brief.fix.md");
    writeText(dest, renderFixBrief(slug));
    console.log(`gen fix brief: ${dest}`);
    return;
  }
  const vocabDest = path.join(unitDir, "gen", "brief.vocab.md");
  writeText(vocabDest, renderVocabBrief(slug));
  const grammarBrief = renderGrammarBrief(slug);
  const grammarDest = path.join(unitDir, "gen", "brief.grammar.md");
  if (grammarBrief !== null) writeText(grammarDest, grammarBrief);
  console.log(
    `gen briefs: ${vocabDest}${grammarBrief !== null ? `\n            ${grammarDest}` : "  (no structures in this unit — vocab only)"}`,
  );
}

function structureKeyOf(structureId: string): string {
  return structureId.split(".s.")[1] ?? structureId;
}

export function runGenItemsIngest(slug: string, fix: boolean, dryRun: boolean): void {
  if (fix) {
    runGenItemsIngestFix(slug, dryRun);
    return;
  }
  const unitDir = path.join(UNITS_DIR, slug);
  const bank = loadBank(slug);
  const { grade, unit } = gradeUnitOf(slug);
  const prefix = unitIdPrefix(grade, unit);
  const bHash = bankHash12(slug);
  const prev = readUnitItems(slug);
  const errors: string[] = [];

  // ---- vocab draft
  const vocabRaw = readJsonIfExists<unknown>(path.join(unitDir, "gen", "vocab.draft.json"));
  if (vocabRaw === null) throw new Error(`${slug}: gen/vocab.draft.json missing — author it from the brief`);
  const vocabDraft = VocabDraft.parse(vocabRaw);
  if (vocabDraft.slug !== slug) errors.push(`vocab draft slug says ${vocabDraft.slug}`);
  if (vocabDraft.briefBank !== bHash) {
    throw new Error(`${slug}: STALE vocab draft (brief bank ${vocabDraft.briefBank} ≠ current ${bHash}) — re-run --prepare`);
  }

  const bankById = new Map(bank.entries.map((e) => [e.id, e]));
  const seenWordIds = new Set<string>();
  for (const d of vocabDraft.items) {
    const entry = bankById.get(d.wordId);
    if (entry === undefined) {
      errors.push(`vocab: wordId ${d.wordId} is not in the bank`);
      continue;
    }
    if (seenWordIds.has(d.wordId)) errors.push(`vocab: wordId ${d.wordId} appears twice`);
    seenWordIds.add(d.wordId);
    if (d.w !== entry.en) errors.push(`vocab ${d.wordId}: w ${JSON.stringify(d.w)} ≠ bank en ${JSON.stringify(entry.en)}`);
    if (!entry.de.includes(d.g)) errors.push(`vocab ${d.wordId}: g ${JSON.stringify(d.g)} is not one of the bank's de values`);
  }
  for (const e of bank.entries) {
    if (!seenWordIds.has(e.id)) errors.push(`vocab: bank word ${e.id} has no item`);
  }

  // ---- grammar draft (only when the unit has structures)
  const catalog = loadStructuresCatalog(grade);
  const unitStructures = (catalog?.structures ?? []).filter((s) => s.unit === unit);
  let grammarDraftItems: GrammarDraftItemT[] = [];
  if (unitStructures.length > 0) {
    const grammarRaw = readJsonIfExists<unknown>(path.join(unitDir, "gen", "grammar.draft.json"));
    if (grammarRaw === null) throw new Error(`${slug}: gen/grammar.draft.json missing — author it from the brief`);
    const grammarDraft = GrammarDraft.parse(grammarRaw);
    if (grammarDraft.slug !== slug) errors.push(`grammar draft slug says ${grammarDraft.slug}`);
    if (grammarDraft.briefBank !== bHash) {
      throw new Error(`${slug}: STALE grammar draft — re-run --prepare`);
    }
    grammarDraftItems = grammarDraft.items;
    const validStructureIds = new Set(unitStructures.map((s) => s.id));
    for (const d of grammarDraftItems) {
      if (!validStructureIds.has(d.structureId)) {
        errors.push(`grammar: structureId ${d.structureId} is not a unit-${unit} structure`);
      }
      if ((d.format === "multiple-choice" || d.format === "context-picker" || d.format === "sentence-building") && d.gameMeta === null) {
        errors.push(`grammar [${d.structureId} ${d.format}]: gameMeta is required for this format`);
      }
      if (countBlanks(d.prompt.text) !== d.prompt.blanks) {
        errors.push(`grammar [${d.structureId} ${d.format}]: ___ count ≠ blanks (${JSON.stringify(d.prompt.text)})`);
      }
    }
  }
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ✗ ${e}`);
    throw new Error(`${slug}: gen ingest — ${errors.length} error(s)`);
  }

  // ---- mint grammar ids
  const lockPath = path.join(unitDir, "items.lock.json");
  const lockIn = readJsonIfExists<ItemsLock>(lockPath);
  const draftSha = sha256OfString(JSON.stringify({ v: vocabDraft.items, g: grammarDraftItems })).slice(0, 12);
  const mint = mintGrammarItemIds(
    slug,
    prefix,
    grammarDraftItems.map((d) => ({
      fingerprint: itemFingerprint(d),
      structureKey: structureKeyOf(d.structureId),
      format: d.format,
    })),
    lockIn,
    draftSha,
  );

  // ---- assemble + rev + overlays
  const prevVocabById = new Map(prev.vocab.map((it) => [it.id, it]));
  const prevGrammarById = new Map(prev.grammar.map((it) => [it.id, it]));
  let vocabItems = vocabDraft.items.map((d) =>
    withRev<VocabItemT>(assembleVocabItem(d, prevVocabById.get(d.wordId)?.rev ?? 1), prevVocabById.get(d.wordId)),
  );
  let grammarItems = grammarDraftItems.map((d, i) =>
    withRev<GrammarItemT>(
      assembleGrammarItem(d, mint.ids[i]!, prevGrammarById.get(mint.ids[i]!)?.rev ?? 1),
      prevGrammarById.get(mint.ids[i]!),
    ),
  );
  ({ vocab: vocabItems, grammar: grammarItems } = applyItemFixes(slug, { vocab: vocabItems, grammar: grammarItems }));

  vocabItems.sort((a, b) => a.id.localeCompare(b.id));
  grammarItems.sort((a, b) => a.id.localeCompare(b.id));

  const vocabFile = VocabFile.parse({ schema: "vocab@1", grade, unit, slug, items: vocabItems });
  const grammarFile =
    grammarItems.length > 0
      ? GrammarFile.parse({ schema: "grammar@1", grade, unit, slug, items: grammarItems })
      : null;

  const hash = itemsContentHash({ vocab: vocabFile.items, grammar: grammarFile?.items ?? [] });
  const note = `gen ingest: ${vocabFile.items.length} vocab + ${grammarFile?.items.length ?? 0} grammar item(s); draft ${draftSha}`;
  if (dryRun) {
    console.log(`gen ingest ${slug} (dry-run): OK — ${note}; hash ${hash.slice(0, 12)}`);
    return;
  }
  writeJson(path.join(unitDir, "vocab.json"), vocabFile);
  if (grammarFile !== null) writeJson(path.join(unitDir, "grammar.json"), grammarFile);
  writeJson(lockPath, mint.lock);
  appendTransition(unitDir, slug, { state: "generated", by: "pipeline", contentHash: hash, note });
  console.log(`gen ingest ${slug}: OK — ${note}`);
}

function runGenItemsIngestFix(slug: string, dryRun: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const { grade, unit } = gradeUnitOf(slug);
  const prefix = unitIdPrefix(grade, unit);
  const current = readUnitItems(slug);
  if (current.vocab.length === 0) throw new Error(`${slug}: no items yet — full ingest first`);
  const bank = loadBank(slug);
  const bankById = new Map(bank.entries.map((e) => [e.id, e]));

  const vocabFixRaw = readJsonIfExists<unknown>(path.join(unitDir, "gen", "vocab.fixdraft.json"));
  const grammarFixRaw = readJsonIfExists<unknown>(path.join(unitDir, "gen", "grammar.fixdraft.json"));
  if (vocabFixRaw === null && grammarFixRaw === null) {
    throw new Error(`${slug}: no fixdraft files found in gen/`);
  }

  const vocabById = new Map(current.vocab.map((it) => [it.id, it]));
  const grammarById = new Map(current.grammar.map((it) => [it.id, it]));
  const lockPath = path.join(unitDir, "items.lock.json");
  const lock = readJsonIfExists<ItemsLock>(lockPath);
  if (lock === null) throw new Error(`${slug}: items.lock.json missing`);
  const lockCopy: ItemsLock = { ...lock, items: { ...lock.items }, tombstones: [...lock.tombstones] };

  let replaced = 0;
  let minted = 0;

  if (vocabFixRaw !== null) {
    const fixDraft = VocabFixDraft.parse(vocabFixRaw);
    for (const d of fixDraft.items) {
      const prevItem = vocabById.get(d.wordId);
      if (prevItem === undefined) throw new Error(`${slug}: vocab fix targets unknown id ${d.wordId}`);
      const entry = bankById.get(d.wordId);
      if (entry === undefined || d.w !== entry.en) throw new Error(`${slug}: vocab fix ${d.wordId} w mismatch with bank`);
      vocabById.set(d.wordId, withRev<VocabItemT>(assembleVocabItem(d, prevItem.rev), prevItem));
      replaced += 1;
    }
  }
  if (grammarFixRaw !== null) {
    const fixDraft = GrammarFixDraft.parse(grammarFixRaw);
    const stamp = sha256OfString(JSON.stringify(grammarFixRaw)).slice(0, 12);
    // serials for newly minted coverage items
    const usedIds = new Set([...Object.values(lockCopy.items), ...lockCopy.tombstones.map((t) => t.id)]);
    const nextSerial = new Map<string, number>();
    for (const id of usedIds) {
      const m = /\.gi\.([a-z0-9-]+)\.([a-z]{2})\.(\d{3})$/.exec(id);
      if (m !== null) {
        const k = `${m[1]}.${m[2]}`;
        nextSerial.set(k, Math.max(nextSerial.get(k) ?? 0, parseInt(m[3]!, 10)));
      }
    }
    for (const d of fixDraft.items) {
      const fp = itemFingerprint(d);
      const maybeId = (d as { id?: string }).id;
      if (maybeId !== undefined && maybeId.length > 0 && grammarById.has(maybeId)) {
        const prevItem = grammarById.get(maybeId)!;
        if (prevItem.structureId !== d.structureId || prevItem.format !== d.format) {
          throw new Error(`${slug}: fix for ${maybeId} changes structure/format — drop + regenerate instead`);
        }
        grammarById.set(maybeId, withRev<GrammarItemT>(assembleGrammarItem(d, maybeId, prevItem.rev), prevItem));
        rekeyFingerprint(lockCopy, maybeId, fp);
        replaced += 1;
      } else if (maybeId !== undefined && maybeId.length > 0) {
        throw new Error(`${slug}: grammar fix targets unknown id ${maybeId}`);
      } else {
        // new coverage item — mint
        const key = structureKeyOf(d.structureId);
        const code = FORMAT_CODES[d.format];
        const sKey = `${key}.${code}`;
        const n = (nextSerial.get(sKey) ?? 0) + 1;
        nextSerial.set(sKey, n);
        const id = `${prefix}.gi.${key}.${code}.${String(n).padStart(3, "0")}`;
        if (usedIds.has(id)) throw new Error(`${slug}: minted id collision ${id}`);
        if (lockCopy.items[fp] !== undefined) throw new Error(`${slug}: new item duplicates fingerprint ${fp}`);
        lockCopy.items[fp] = id;
        usedIds.add(id);
        grammarById.set(id, assembleGrammarItem(d, id, 1));
        minted += 1;
      }
    }
    void stamp;
  }

  let next: UnitItems = {
    vocab: [...vocabById.values()].sort((a, b) => a.id.localeCompare(b.id)),
    grammar: [...grammarById.values()].sort((a, b) => a.id.localeCompare(b.id)),
  };
  next = applyItemFixes(slug, next);
  const vocabFile = VocabFile.parse({ schema: "vocab@1", grade, unit, slug, items: next.vocab });
  const grammarFile =
    next.grammar.length > 0 ? GrammarFile.parse({ schema: "grammar@1", grade, unit, slug, items: next.grammar }) : null;
  const hash = itemsContentHash({ vocab: vocabFile.items, grammar: grammarFile?.items ?? [] });
  const note = `gen fix ingest: ${replaced} replaced, ${minted} new; hash ${hash.slice(0, 12)}`;
  if (dryRun) {
    console.log(`gen ingest --fix ${slug} (dry-run): OK — ${note}`);
    return;
  }
  writeJson(path.join(unitDir, "vocab.json"), vocabFile);
  if (grammarFile !== null) writeJson(path.join(unitDir, "grammar.json"), grammarFile);
  writeJson(lockPath, lockCopy);
  appendTransition(unitDir, slug, { state: "generated", by: "pipeline", contentHash: hash, note });
  console.log(`gen ingest --fix ${slug}: OK — ${note}`);
}
