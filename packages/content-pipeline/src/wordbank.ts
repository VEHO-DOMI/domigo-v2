/**
 * Stage 2 — `content wordbank`
 *
 * Parses each grade's master vocabulary list (docx tables) into per-unit
 * wordbank.json drafts — the canonical word source + cumulative level gate.
 *
 * Safety nets:
 *  - the lists self-declare their totals; parsed counts MUST match (fail loud)
 *  - ids.lock.json pins entry ids across re-parses (stable ids, tombstones)
 *  - overlays/parse-fixes.json patches true source anomalies (audited)
 *  - byte-identical re-runs (writes are skipped when content is unchanged)
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade, WordBankEntry } from "@domigo/content-schema";
import { GRADES, UNITS_PER_GRADE, WordBank, unitIdPrefix, unitSlug } from "@domigo/content-schema";
import type { DocxBlock } from "./docx.ts";
import { parseDocxBlocks } from "./docx.ts";
import { readJsonIfExists, sha256OfFile, sha256OfString, writeJson } from "./json.ts";
import { GRADE_SOURCES, OVERLAYS_DIR, UNITS_DIR } from "./paths.ts";
import { recordState } from "./state.ts";

/** Self-declared totals as analysed at kickoff (2026-06-10). The parser also
 *  reads the declaration out of each docx; disagreement = hard error. */
const EXPECTED: Record<Grade, { total: number; wordfile: number; phrase: number }> = {
  1: { total: 786, wordfile: 303, phrase: 483 },
  2: { total: 611, wordfile: 198, phrase: 413 },
  3: { total: 599, wordfile: 143, phrase: 456 },
  4: { total: 450, wordfile: 48, phrase: 402 },
};

export interface RawEntry {
  kind: "wordfile" | "phrase";
  theme: string | null;
  en: string;
  deRaw: string;
  exampleSb: string | null;
}

interface IdsLock {
  schema: "ids-lock@1";
  slug: string;
  /** `${kind}:${lowercased headword}` → pinned id */
  words: Record<string, string>;
  tombstones: Array<{ id: string; key: string; removedWith: string }>;
}

// ---------------------------------------------------------------------------
// master-list parsing
// ---------------------------------------------------------------------------

function num(s: string): number {
  return parseInt(s.replace(/[,.]/g, ""), 10);
}

function parseDeclaredTotals(blocks: DocxBlock[]): Partial<{ total: number; wordfile: number; phrase: number }> {
  const declared: Partial<{ total: number; wordfile: number; phrase: number }> = {};
  for (const block of blocks) {
    if (block.kind !== "paragraph") continue;
    if (/^Unit\s+\d+\b/.test(block.text)) break; // intro is over
    const total = /([\d,.]+)\s+vocabulary items/i.exec(block.text);
    if (total?.[1] !== undefined) declared.total = num(total[1]);
    const wf = /([\d,.]+)\s+Word File entries/i.exec(block.text);
    if (wf?.[1] !== undefined) declared.wordfile = num(wf[1]);
    const ph = /([\d,.]+)\s+Words\s*(?:&|and)\s*Phrases entries/i.exec(block.text);
    if (ph?.[1] !== undefined) declared.phrase = num(ph[1]);
  }
  return declared;
}

function isHeaderRow(cells: string[]): boolean {
  const first = (cells[0] ?? "").trim().toLowerCase();
  const last = (cells[cells.length - 1] ?? "").trim().toLowerCase();
  return (
    /^word(\s*\/\s*phrase)?s?$/.test(first) &&
    /translation/.test(last)
  );
}

function clean(s: string): string {
  return s.replace(/\s+/g, " ").trim().normalize("NFC");
}

function parseGradeEntries(
  blocks: DocxBlock[],
  grade: Grade,
): { byUnit: Map<number, RawEntry[]>; warnings: string[] } {
  const byUnit = new Map<number, RawEntry[]>();
  const warnings: string[] = [];
  let unit: number | null = null;
  let section: "wordfile" | "phrase" | null = null;
  let theme: string | null = null;

  for (const block of blocks) {
    if (block.kind === "paragraph") {
      const u = /^Unit\s+(\d+)\b/.exec(block.text);
      if (u?.[1] !== undefined) {
        unit = parseInt(u[1], 10);
        section = null;
        theme = null;
        if (!byUnit.has(unit)) byUnit.set(unit, []);
        continue;
      }
      const wf = /^Word\s*File\b\s*:?\s*(.*)$/i.exec(block.text);
      if (wf !== null) {
        section = "wordfile";
        theme = clean(wf[1] ?? "") || null;
        continue;
      }
      if (/^Words\s*(?:&|and)\s*Phrases\b/i.test(block.text)) {
        section = "phrase";
        theme = null;
        continue;
      }
      continue;
    }

    // table
    if (unit === null) continue; // intro table
    const entries = byUnit.get(unit);
    if (entries === undefined) continue;

    for (const row of block.rows) {
      const cells = row.map(clean);
      const nonEmpty = cells.filter((c) => c.length > 0);
      if (nonEmpty.length === 0) continue;
      if (isHeaderRow(cells)) {
        // header also tells us the section when no paragraph announced it
        section = cells.length >= 3 ? "phrase" : "wordfile";
        continue;
      }
      if (nonEmpty.length === 1 && cells.length <= 2) {
        // single-cell row inside a word-file table = theme banner
        theme = nonEmpty[0] ?? theme;
        continue;
      }

      const kind: "wordfile" | "phrase" =
        section ?? (cells.length >= 3 ? "phrase" : "wordfile");
      const en = cells[0] ?? "";
      if (en.length === 0) {
        warnings.push(`g${grade} u${unit}: row with empty headword skipped (${JSON.stringify(cells)})`);
        continue;
      }
      if (kind === "phrase") {
        const example = cells.length >= 3 ? (cells[1] ?? "") : "";
        const de = cells.length >= 3 ? (cells[2] ?? "") : (cells[1] ?? "");
        if (de.length === 0) {
          warnings.push(`g${grade} u${unit}: phrase "${en}" has no translation; skipped`);
          continue;
        }
        entries.push({ kind, theme: null, en, deRaw: de, exampleSb: example.length > 0 ? example : null });
      } else {
        const de = cells[1] ?? "";
        if (de.length === 0) {
          warnings.push(`g${grade} u${unit}: word "${en}" has no translation; skipped`);
          continue;
        }
        entries.push({ kind, theme, en, deRaw: de, exampleSb: null });
      }
    }
  }
  return { byUnit, warnings };
}

// ---------------------------------------------------------------------------
// entry shaping
// ---------------------------------------------------------------------------

function slugify(s: string): string {
  const slug = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "entry";
}

/** Split on ", " only at parenthesis depth 0 — "besuchen (Universität, Veranstaltung)" stays whole. */
function splitTopLevelCommas(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i] as string;
    if (ch === "(") depth += 1;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0 && s[i + 1] === " ") {
      parts.push(cur);
      cur = "";
      i += 1; // swallow the space
      continue;
    }
    cur += ch;
  }
  parts.push(cur);
  return parts;
}

export function splitDe(deRaw: string): string[] {
  const parts = deRaw
    .split(/\n|;/)
    .flatMap((p) => splitTopLevelCommas(p))
    .map((p) => clean(p))
    .filter((p) => p.length > 0);
  const unique = [...new Set(parts)];
  return unique.length > 0 ? unique : [clean(deRaw)];
}

export function shapeEntry(raw: RawEntry, id: string): WordBankEntry {
  const parens = [...raw.en.matchAll(/\(([^)]+)\)/g)].map((m) => clean(m[1] ?? ""));
  const enClean = clean(raw.en.replace(/\([^)]*\)/g, " "));
  const cfMatch = /^to\s+(.+)$/.exec(enClean);
  const cf = cfMatch?.[1] ?? null;

  const forms = new Set<string>();
  if (enClean.length > 0) forms.add(enClean);
  if (cf !== null) forms.add(cf);
  for (const p of parens) {
    if (p.length === 0 || /^[=≈]/.test(p)) continue;
    if (/^(pl|sing)\.?$/i.test(p)) continue; // bare grammar label, e.g. "glasses (pl)"
    const pl = /^pl\.?\s+(.+)$/i.exec(p);
    if (pl?.[1] !== undefined) {
      forms.add(clean(pl[1]));
      continue;
    }
    if (/^[a-zäöüß]+(?:[ ,][a-zäöüß]+)*$/.test(p)) {
      // Lowercase particle(s): "to be proud (of)" → "be proud of". NEVER add
      // the bare particle — it would credit "of" as taught to the level gate.
      const bases = [enClean, cf].filter((b): b is string => b !== null && b.length > 0);
      for (const alt of p.split(/,\s*/)) {
        for (const base of bases) forms.add(clean(`${base} ${alt}`));
      }
      continue;
    }
    if (p.length <= 24) forms.add(p); // abbreviation / alternate label, e.g. "PE"
  }
  if (forms.size === 0) forms.add(clean(raw.en));

  return {
    id,
    kind: raw.kind,
    theme: raw.theme,
    en: clean(raw.en),
    de: splitDe(raw.deRaw),
    deRaw: clean(raw.deRaw),
    exampleSb: raw.exampleSb !== null ? clean(raw.exampleSb) : null,
    cf,
    forms: [...forms],
    taughtGloss: false,
  };
}

// ---------------------------------------------------------------------------
// ids.lock + state + overlays
// ---------------------------------------------------------------------------

function assignIds(
  slug: string,
  prefix: string,
  raws: RawEntry[],
  lock: IdsLock,
  sourceSha: string,
): { ids: string[]; lockChanged: boolean } {
  const used = new Set(Object.values(lock.words));
  const seenKeys = new Set<string>();
  const ids: string[] = [];
  let lockChanged = false;

  for (const raw of raws) {
    const enClean = clean(raw.en.replace(/\([^)]*\)/g, " ")).toLowerCase();
    let key = `${raw.kind}:${enClean}`;
    // duplicate headword within the same unit+kind → keyed occurrence
    let occurrence = 2;
    while (seenKeys.has(key)) key = `${raw.kind}:${enClean}#${occurrence++}`;
    seenKeys.add(key);

    let id = lock.words[key];
    if (id === undefined) {
      const base = `${prefix}.w.${slugify(enClean)}`;
      id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      lock.words[key] = id;
      lockChanged = true;
    }
    used.add(id);
    ids.push(id);
  }

  // tombstone keys that disappeared from the source — but never the
  // `overlay:`-prefixed keys, which are minted by review ingest, not parsing
  for (const [key, id] of Object.entries(lock.words)) {
    if (!seenKeys.has(key) && !key.startsWith("overlay:")) {
      delete lock.words[key];
      lock.tombstones.push({ id, key, removedWith: sourceSha.slice(0, 12) });
      lockChanged = true;
    }
  }
  void slug;
  return { ids, lockChanged };
}

export interface ParseFixes {
  [unitSlug: string]: {
    drop?: string[];
    patch?: Record<string, Partial<WordBankEntry>>;
    add?: WordBankEntry[];
  };
}

export function applyOverlays(slug: string, entries: WordBankEntry[]): WordBankEntry[] {
  const fixes = readJsonIfExists<ParseFixes>(path.join(OVERLAYS_DIR, "parse-fixes.json"));
  const unitFixes = fixes?.[slug];
  if (unitFixes === undefined) return entries;
  let out = entries;
  if (unitFixes.drop !== undefined) {
    const drop = new Set(unitFixes.drop);
    out = out.filter((e) => !drop.has(e.id));
  }
  if (unitFixes.patch !== undefined) {
    const patches = unitFixes.patch;
    out = out.map((e) => {
      const patch = patches[e.id];
      return patch !== undefined ? ({ ...e, ...patch } as WordBankEntry) : e;
    });
  }
  if (unitFixes.add !== undefined) out = [...out, ...unitFixes.add];
  return out;
}

/** Canonical content hash of a unit's entries (state log + approval gating). */
export function entriesContentHash(entries: WordBankEntry[]): string {
  return sha256OfString(JSON.stringify(entries));
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

export function runWordbank(onlyGrade?: Grade): void {
  const failures: string[] = [];

  for (const grade of GRADES) {
    if (onlyGrade !== undefined && grade !== onlyGrade) continue;
    const src = GRADE_SOURCES[grade];
    const sourceSha = sha256OfFile(src.masterList);
    const blocks = parseDocxBlocks(src.masterList);

    const declared = parseDeclaredTotals(blocks);
    const expected = EXPECTED[grade];
    for (const k of ["total", "wordfile", "phrase"] as const) {
      const d = declared[k];
      if (d === undefined) {
        console.warn(`g${grade}: list does not declare ${k}; using kickoff analysis (${expected[k]})`);
        declared[k] = expected[k];
      } else if (d !== expected[k]) {
        failures.push(`g${grade}: list declares ${k}=${d} but kickoff analysis said ${expected[k]} — update EXPECTED after checking the doc`);
      }
    }

    const { byUnit, warnings } = parseGradeEntries(blocks, grade);
    for (const w of warnings) console.warn(`  warn: ${w}`);

    // unit coverage
    const expectedUnits = UNITS_PER_GRADE[grade];
    const seen = [...byUnit.keys()].sort((a, b) => a - b);
    if (seen.length !== expectedUnits || seen[0] !== 1 || seen[seen.length - 1] !== expectedUnits) {
      failures.push(`g${grade}: expected units 1..${expectedUnits}, parsed [${seen.join(", ")}]`);
    }

    // totals
    let wf = 0;
    let ph = 0;
    for (const entries of byUnit.values()) {
      wf += entries.filter((e) => e.kind === "wordfile").length;
      ph += entries.filter((e) => e.kind === "phrase").length;
    }
    if (wf !== declared.wordfile || ph !== declared.phrase || wf + ph !== declared.total) {
      failures.push(
        `g${grade}: parsed ${wf} wordfile + ${ph} phrase = ${wf + ph}; ` +
          `list declares ${declared.wordfile} + ${declared.phrase} = ${declared.total}`,
      );
    }

    console.log(`g${grade}: ${wf} wordfile + ${ph} phrase = ${wf + ph} entries across ${seen.length} units`);

    // write per-unit artifacts (even when totals fail, so diffs are inspectable)
    for (const [unit, raws] of [...byUnit.entries()].sort((a, b) => a[0] - b[0])) {
      const slug = unitSlug(grade, unit);
      const prefix = unitIdPrefix(grade, unit);
      const unitDir = path.join(UNITS_DIR, slug);
      fs.mkdirSync(unitDir, { recursive: true });

      const lockPath = path.join(unitDir, "ids.lock.json");
      const lock: IdsLock =
        readJsonIfExists<IdsLock>(lockPath) ?? { schema: "ids-lock@1", slug, words: {}, tombstones: [] };
      const { ids, lockChanged } = assignIds(slug, prefix, raws, lock, sourceSha);
      if (lockChanged) writeJson(lockPath, lock);

      let entries = raws.map((raw, i) => shapeEntry(raw, ids[i] ?? `${prefix}.w.entry-${i}`));
      entries = applyOverlays(slug, entries);

      const bank = WordBank.parse({
        schema: "wordbank@1",
        grade,
        unit,
        slug,
        title: { en: null },
        source: { masterList: path.basename(src.masterList), sha256: sourceSha },
        entries,
      });
      writeJson(path.join(unitDir, "wordbank.json"), bank);
      recordState(unitDir, slug, entriesContentHash(entries));
    }
  }

  if (failures.length > 0) {
    console.error("\nTOTALS / COVERAGE FAILURES (the checksum net — fix before trusting these banks):");
    for (const f of failures) console.error(`  ✗ ${f}`);
    process.exitCode = 1;
  } else {
    console.log("\nAll declared totals matched. Word-bank drafts written.");
  }
}
