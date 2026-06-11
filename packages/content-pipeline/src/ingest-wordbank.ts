/**
 * `content ingest-review --wordbank` — turn a filled review doc into corpus
 * truth: cell edits → overlay patches, verdicts → drops/adds/state, then
 * re-run the wordbank stage and record the approved content hash.
 *
 * Refuses stale docs (marker bank-hash must equal the current bank). All
 * verdicts land in review/wordbank.flags.json with provenance; the unit state
 * log gains `wordbank_approved` (by the reviewer) or `changes_requested`.
 */
import fs from "node:fs";
import path from "node:path";
import type { FlagKind, Grade, WordBankEntry } from "@domigo/content-schema";
import { unitIdPrefix } from "@domigo/content-schema";
import { readJsonIfExists, writeJson } from "./json.ts";
import { MULTI_SEP, parseTables, parseVerdicts } from "./mdtable.ts";
import { OVERLAYS_DIR, UNITS_DIR } from "./paths.ts";
import { buildWordbankReview, loadV1Unit, rowsForEntries } from "./review-wordbank.ts";
import { appendTransition } from "./state.ts";
import { wordTokens } from "./tokenize.ts";
import { entriesContentHash, runWordbank, shapeEntry, type ParseFixes } from "./wordbank.ts";

const ALLOWED: Record<FlagKind, string[]> = {
  "duplicate-headword": ["ok", "drop", "fix"],
  "de-split-suspect": ["ok", "fix"],
  "ascii-umlaut-suspect": ["ok", "fix"],
  "not-in-transcript": ["ok", "drop", "fix"],
  "no-transcript": ["ok", "fix"],
  "v1-missing": ["ok", "add", "fix"],
  "v1-unit-mismatch": ["ok", "fix"],
  "forms-suspect": ["ok", "fix"],
  "changed-since-review": ["ok", "drop", "fix"],
};

const MARKER = /<!-- domigo:review wordbank (\S+) round=(\d+) bank=([0-9a-f]{12}) -->/;

interface UnitPlan {
  slug: string;
  grade: Grade;
  round: number;
  outcome: "approve" | "changes";
  verdicts: Array<{ key: string; kind: FlagKind; entryId: string | null; verdict: string; note: string }>;
  unitNote: string;
  drops: string[];
  adds: WordBankEntry[];
  patches: Record<string, Partial<WordBankEntry>>;
  editedCells: number;
}

function splitMulti(cell: string): string[] {
  return cell
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function planUnit(slug: string): UnitPlan | null {
  const docPath = path.join(UNITS_DIR, slug, "review", "wordbank.review.md");
  if (!fs.existsSync(docPath)) return null;
  const md = fs.readFileSync(docPath, "utf8");

  const marker = MARKER.exec(md);
  if (marker === null) throw new Error(`${slug}: review doc has no marker line`);
  if (marker[1] !== slug) throw new Error(`${slug}: marker says ${marker[1]}`);

  const canonical = buildWordbankReview(slug);
  if (marker[3] !== canonical.bankHash12) {
    throw new Error(
      `${slug}: STALE review doc (doc bank=${marker[3]}, current=${canonical.bankHash12}) — regenerate with \`content review-doc --wordbank --unit ${slug}\``,
    );
  }
  const round = parseInt(marker[2] as string, 10);
  if (round !== canonical.round) {
    throw new Error(`${slug}: round mismatch (doc=${round}, computed=${canonical.round})`);
  }

  const grade = canonical.grade as Grade;
  const prefix = unitIdPrefix(grade, canonical.unit);

  // ---- table diff → patches
  const tables = parseTables(md);
  const entryTable = tables.find((t) => t.headers[0] === "ref");
  if (entryTable === undefined) throw new Error(`${slug}: entry table not found in review doc`);
  const canonicalByRef = new Map(canonical.rows.map((r) => [r.ref, r]));

  const patches: Record<string, Partial<WordBankEntry>> = {};
  let editedCells = 0;
  const seenRefs = new Set<string>();
  for (const row of entryTable.rows) {
    const ref = row["ref"] ?? "";
    const canon = canonicalByRef.get(ref);
    if (canon === undefined) throw new Error(`${slug}: unknown ref \`${ref}\` in table — rows must not be added or renamed`);
    seenRefs.add(ref);
    if ((row["en"] ?? "") !== canon.cells.en) {
      throw new Error(`${slug}: \`en\` is immutable (ref ${ref}) — use a drop verdict plus a v1-missing/add or overlay instead`);
    }
    const id = `${prefix}.w.${ref}`;
    const patch: Partial<WordBankEntry> = {};
    if ((row["de"] ?? "") !== canon.cells.de) {
      const de = splitMulti(row["de"] ?? "");
      if (de.length === 0) throw new Error(`${slug}: ref ${ref} — de cannot be emptied`);
      patch.de = de;
      editedCells += 1;
    }
    if ((row["example"] ?? "") !== canon.cells.example) {
      const ex = (row["example"] ?? "").trim();
      patch.exampleSb = ex === "—" || ex === "" ? null : ex;
      editedCells += 1;
    }
    if ((row["forms"] ?? "") !== canon.cells.forms) {
      const forms = splitMulti(row["forms"] ?? "");
      if (forms.length === 0) throw new Error(`${slug}: ref ${ref} — forms cannot be emptied`);
      patch.forms = forms;
      editedCells += 1;
    }
    if (Object.keys(patch).length > 0) patches[id] = patch;
  }
  if (round === 1) {
    for (const r of canonical.rows) {
      if (!seenRefs.has(r.ref)) {
        throw new Error(`${slug}: row \`${r.ref}\` was deleted from the table — deletion is not an edit; use a drop verdict`);
      }
    }
  }

  // ---- verdicts
  const parsed = parseVerdicts(md);
  const openByKey = new Map(canonical.openFlags.map((f) => [f.key, f]));
  const verdicts: UnitPlan["verdicts"] = [];
  const seenKeys = new Set<string>();
  for (const block of parsed.flags) {
    const key = `${block.kind}:${block.ref}`;
    const flag = openByKey.get(key);
    if (flag === undefined) throw new Error(`${slug}: verdict for unknown/closed flag ${key} (line ${block.headingLine})`);
    if (seenKeys.has(key)) throw new Error(`${slug}: duplicate verdict block for ${key}`);
    seenKeys.add(key);
    if (block.verdict === null) throw new Error(`${slug}: flag ${key} is unanswered (line ${block.headingLine})`);
    const allowed = ALLOWED[flag.kind] ?? ["ok", "fix"];
    if (!allowed.includes(block.verdict)) {
      throw new Error(`${slug}: verdict \`${block.verdict}\` not allowed for ${flag.kind} (line ${block.headingLine}; allowed: ${allowed.join("/")})`);
    }
    if (block.verdict === "fix" && block.note.trim().length === 0) {
      throw new Error(`${slug}: flag ${key} verdict is fix but the note is empty — say what to fix`);
    }
    verdicts.push({ key, kind: flag.kind, entryId: flag.entryId, verdict: block.verdict, note: block.note });
  }
  for (const f of canonical.openFlags) {
    if (!seenKeys.has(f.key)) throw new Error(`${slug}: flag ${f.key} has no verdict block in the doc`);
  }
  if (parsed.unit === null || parsed.unit.verdict === null) {
    throw new Error(`${slug}: unit verdict missing — fill \`> unit: ok\` or \`> unit: changes\``);
  }
  if (!["ok", "changes"].includes(parsed.unit.verdict)) {
    throw new Error(`${slug}: unit verdict must be ok or changes, got \`${parsed.unit.verdict}\``);
  }

  // ---- consequences
  const drops = verdicts.filter((v) => v.verdict === "drop").map((v) => v.entryId as string);
  const adds: WordBankEntry[] = [];
  for (const v of verdicts.filter((x) => x.verdict === "add")) {
    const wKey = v.key.slice(v.kind.length + 1);
    const v1 = loadV1Unit(grade, canonical.unit) ?? [];
    const v1e = v1.find((e) => wordTokens(e.w).join(" ") === wKey);
    if (v1e === undefined) throw new Error(`${slug}: cannot find v1 entry for add-flag ${v.key}`);
    const entry = shapeEntry(
      { kind: "phrase", theme: null, en: v1e.w, deRaw: v1e.g ?? "", exampleSb: null },
      "placeholder", // id minted at apply time against ids.lock
    );
    if (entry.de.join("").length === 0) throw new Error(`${slug}: v1 entry \`${v1e.w}\` has no German — cannot add`);
    adds.push({ ...entry, origin: "v1-recovery" });
  }

  const anyFix = verdicts.some((v) => v.verdict === "fix");
  const outcome: UnitPlan["outcome"] = parsed.unit.verdict === "ok" && !anyFix ? "approve" : "changes";
  if (parsed.unit.verdict === "ok" && anyFix) {
    throw new Error(`${slug}: unit verdict is ok but ${verdicts.filter((v) => v.verdict === "fix").length} flag(s) say fix — resolve or set unit: changes`);
  }

  return {
    slug,
    grade,
    round,
    outcome,
    verdicts,
    unitNote: parsed.unit.note,
    drops,
    adds,
    patches,
    editedCells,
  };
}

interface IdsLockFile {
  schema: "ids-lock@1";
  slug: string;
  words: Record<string, string>;
  tombstones: Array<{ id: string; key: string; removedWith: string }>;
}

function slugifyEn(s: string): string {
  const slug = s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug.length > 0 ? slug : "entry";
}

export function runIngestWordbank(filter: { grade?: number; unit?: string }, dryRun: boolean): void {
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .filter((n) => (filter.unit !== undefined ? n === filter.unit : true))
    .filter((n) => (filter.grade !== undefined ? n.startsWith(`g${filter.grade}-`) : true))
    .sort();

  const plans: UnitPlan[] = [];
  for (const slug of slugs) {
    const plan = planUnit(slug);
    if (plan !== null) plans.push(plan);
  }
  if (plans.length === 0) {
    console.log("ingest-review: no filled review docs found for the filter.");
    return;
  }

  for (const p of plans) {
    console.log(
      `${p.slug}: ${p.outcome.toUpperCase()} — ${p.verdicts.length} verdict(s), ${p.editedCells} cell edit(s), ${p.drops.length} drop(s), ${p.adds.length} add(s)`,
    );
  }
  if (dryRun) {
    console.log("(dry run — nothing written)");
    return;
  }

  // ---- phase 2: write overlays + ids, re-run affected grades once, record
  const fixesPath = path.join(OVERLAYS_DIR, "parse-fixes.json");
  const fixes = readJsonIfExists<ParseFixes>(fixesPath) ?? {};
  const gradesToRerun = new Set<Grade>();

  for (const p of plans) {
    if (p.outcome !== "approve") continue;
    if (p.drops.length + p.adds.length + Object.keys(p.patches).length === 0) continue;

    const unitFix = fixes[p.slug] ?? {};
    if (p.drops.length > 0) unitFix.drop = [...new Set([...(unitFix.drop ?? []), ...p.drops])];
    if (Object.keys(p.patches).length > 0) {
      unitFix.patch = { ...(unitFix.patch ?? {}) };
      for (const [id, patch] of Object.entries(p.patches)) {
        unitFix.patch[id] = { ...(unitFix.patch[id] ?? {}), ...patch };
      }
    }
    if (p.adds.length > 0) {
      const canonical = buildWordbankReview(p.slug);
      const prefix = unitIdPrefix(p.grade, canonical.unit);
      const lockPath = path.join(UNITS_DIR, p.slug, "ids.lock.json");
      const lock = readJsonIfExists<IdsLockFile>(lockPath) ?? { schema: "ids-lock@1", slug: p.slug, words: {}, tombstones: [] };
      const used = new Set([...Object.values(lock.words), ...lock.tombstones.map((t) => t.id)]);
      const withIds: WordBankEntry[] = [];
      for (const add of p.adds) {
        const lockKey = `overlay:${add.kind}:${slugifyEn(add.en)}`;
        let id = lock.words[lockKey];
        if (id === undefined) {
          const base = `${prefix}.w.${slugifyEn(add.en)}`;
          id = base;
          let n = 2;
          while (used.has(id)) id = `${base}-${n++}`;
          lock.words[lockKey] = id;
        }
        used.add(id);
        withIds.push({ ...add, id });
      }
      writeJson(lockPath, lock);
      const existingAdds = (unitFix.add ?? []).filter((e) => !withIds.some((w) => w.id === e.id));
      unitFix.add = [...existingAdds, ...withIds];
    }
    fixes[p.slug] = unitFix;
    gradesToRerun.add(p.grade);
  }
  if (gradesToRerun.size > 0) {
    writeJson(fixesPath, fixes);
    for (const grade of [...gradesToRerun].sort()) runWordbank(grade);
    if (process.exitCode === 1) throw new Error("wordbank re-run failed after overlay application — investigate before approving");
  }

  for (const p of plans) {
    const unitDir = path.join(UNITS_DIR, p.slug);
    const reviewDir = path.join(unitDir, "review");

    if (p.outcome === "changes") {
      const current = buildWordbankReview(p.slug);
      writeJson(path.join(reviewDir, "wordbank.flags.json"), {
        schema: "wordbank-flags@1",
        slug: p.slug,
        round: p.round,
        bankHash: current.bankHash12,
        reviewedBy: "fable",
        flags: p.verdicts,
        unit: { verdict: "changes", note: p.unitNote },
      });
      appendTransition(unitDir, p.slug, {
        state: "changes_requested",
        by: "fable",
        contentHash: current.bankHash12,
        note: p.verdicts.filter((v) => v.verdict === "fix").map((v) => `${v.key}: ${v.note}`).join(" | ") || p.unitNote,
      });
      console.log(`${p.slug}: changes_requested recorded`);
      continue;
    }

    // approve: verify consequences landed, then record
    const bankRaw = readJsonIfExists<{ entries: WordBankEntry[] }>(path.join(unitDir, "wordbank.json"));
    if (bankRaw === null) throw new Error(`${p.slug}: bank vanished after re-run`);
    const entries = bankRaw.entries;
    for (const dropId of p.drops) {
      if (entries.some((e) => e.id === dropId)) throw new Error(`${p.slug}: drop of ${dropId} did not land`);
    }
    for (const [id, patch] of Object.entries(p.patches)) {
      const e = entries.find((x) => x.id === id);
      if (e === undefined) throw new Error(`${p.slug}: patched entry ${id} missing after re-run`);
      if (patch.de !== undefined && JSON.stringify(e.de) !== JSON.stringify(patch.de)) {
        throw new Error(`${p.slug}: de patch on ${id} did not land`);
      }
    }
    const newHash = entriesContentHash(entries);
    writeJson(path.join(reviewDir, "wordbank.flags.json"), {
      schema: "wordbank-flags@1",
      slug: p.slug,
      round: p.round,
      bankHash: newHash.slice(0, 12),
      reviewedBy: "fable",
      flags: p.verdicts,
      unit: { verdict: "ok", note: p.unitNote },
    });
    writeJson(path.join(reviewDir, "wordbank.reviewed.json"), {
      schema: "wordbank-reviewed@1",
      slug: p.slug,
      round: p.round,
      rows: Object.fromEntries(rowsForEntries(entries).map((r) => [r.ref, r.hash])),
    });
    appendTransition(unitDir, p.slug, {
      state: "wordbank_approved",
      by: "fable",
      contentHash: newHash,
      note: `round ${p.round}: ${p.verdicts.length} verdict(s), ${p.editedCells} edit(s), ${p.drops.length} drop(s), ${p.adds.length} add(s)`,
    });
    console.log(`${p.slug}: wordbank_approved ✓`);
  }
}
