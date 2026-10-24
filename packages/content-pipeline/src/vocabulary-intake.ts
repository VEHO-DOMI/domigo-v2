/** P0 review evidence, NOT the frozen vocabulary-index@1 or a runtime word identity. */
import { createHash } from "node:crypto";
import type { DocxBlock } from "./docx.ts";

export type IntakeGrade = 1 | 2 | 3 | 4;
export interface AppendixSource { grade: IntakeGrade; sha256: string; blocks: DocxBlock[] }
export interface BankOccurrence { id: string; slug: string; grade: IntakeGrade; unit: number; en: string; deRaw: string }
export interface TaskOccurrence { id: string; slug: string; w: string }
export type AppendixReference =
  | { kind: "unit"; grade: IntakeGrade; unit: number; code: string }
  | { kind: "prior-grade"; grade: IntakeGrade; unit: null; code: string }
  | { kind: "section"; grade: IntakeGrade; unit: null; code: string };
export interface IntakeRow {
  id: string;
  grade: IntakeGrade;
  sourceSha256: string;
  locator: { block: number; row: number | null };
  raw: string[];
  state: "metadata" | "parsed" | "quarantined";
  reason: string;
  entry: { en: string; de: string; phonetics: string | null; reference: AppendixReference } | null;
}

const UNIT_COUNTS = { 1: 15, 2: 15, 3: 14, 4: 13 };
export const fingerprint = (value: unknown): string => createHash("sha256").update(JSON.stringify(value)).digest("hex");
/** Only typography/case/spacing; never strip articles, 'to', parentheses or inflect. */
export const exactTextKey = (text: string): string => text.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase();
const ordered = (a: string, b: string): number => a < b ? -1 : a > b ? 1 : 0;

export function parseAppendixReference(raw: string, grade: IntakeGrade): AppendixReference | null {
  const code = raw.trim();
  const prior = /^MORE ([1-3])$/.exec(code);
  if (prior) {
    const previous = Number(prior[1]) as IntakeGrade;
    return previous < grade ? { kind: "prior-grade", grade: previous, unit: null, code } : null;
  }
  // These source legends name episodes/sections, not curriculum units.
  if (/^(?:(?:OYW|TGND|T|S)\d+|G|F|D|DSC)$/.test(code)) return { kind: "section", grade, unit: null, code };
  const local = /^U(\d{1,2})(?:\/[A-Za-z0-9]+(?:[-–.,][A-Za-z0-9]+)*)?$/.exec(code);
  if (!local) return null;
  const unit = Number(local[1]);
  return unit >= 1 && unit <= UNIT_COUNTS[grade] ? { kind: "unit", grade, unit, code } : null;
}

function metadata(text: string): string | null {
  if (text === "WORDLIST") return "title";
  if (/^[A-Z]$/.test(text)) return "alphabet-heading";
  if (/^(?:\d+|— p\. \d+ —)$/.test(text)) return "page-marker";
  if (/^U\d+\/\d+ = Unit \d+ Exercise \d+;/.test(text)) return "reference-legend";
  if (/^(?:Note:|Transcription note:)/.test(text)) return "source-note";
  return null;
}

export function sourceRows(source: AppendixSource): IntakeRow[] {
  if (![1, 2, 3, 4].includes(source.grade) || !/^[a-f0-9]{64}$/.test(source.sha256)) throw Error("invalid source identity");
  const result: IntakeRow[] = [];
  source.blocks.forEach((block, bi) => {
    const make = (raw: string[], ri: number | null): IntakeRow => ({
      id: `g${source.grade}.${source.sha256}.b${bi + 1}${ri === null ? "" : `.r${ri + 1}`}`,
      grade: source.grade, sourceSha256: source.sha256, locator: { block: bi + 1, row: ri === null ? null : ri + 1 },
      raw, state: "quarantined", reason: "unstructured-source-block", entry: null,
    });
    if (block.kind === "paragraph") {
      const row = make([block.text], null);
      const reason = metadata(block.text);
      if (reason) { row.state = "metadata"; row.reason = reason; }
      result.push(row);
      return;
    }
    let columns = 0;
    block.rows.forEach((cells, ri) => {
      const row = make([...cells], ri);
      const heading = cells.join("\t");
      if (heading === "Headword\tReference\tPhonetics\tGerman" || heading === "Headword\tReference\tGerman") {
        columns = cells.length;
        row.state = "metadata"; row.reason = "column-header";
      } else if (cells.length === 1 && metadata(cells[0] ?? "")) {
        row.state = "metadata"; row.reason = metadata(cells[0]!)!;
      } else if (columns === 0 || cells.length !== columns) {
        row.reason = "unrecognized-table-shape";
      } else {
        const en = cells[0]!; const ref = parseAppendixReference(cells[1]!, source.grade);
        const de = cells[columns - 1]!;
        if (!en.trim() || !de.trim()) row.reason = "empty-word-or-meaning";
        else if (!ref) row.reason = "unrecognized-or-out-of-course-reference";
        else {
          row.state = "parsed"; row.reason = "explicit-table-columns";
          row.entry = { en, de, phonetics: columns === 4 ? cells[2]! : null, reference: ref };
        }
      }
      result.push(row);
    });
    // An empty table still occupies an input block and must not disappear.
    if (block.rows.length === 0) {
      const row = make([], null); row.reason = "empty-table"; result.push(row);
    }
  });
  return result;
}

/** Each non-empty paragraph/table row from the existing DOCX reader survives exactly once. */
export function assertSourceAccounting(sources: AppendixSource[], rows: IntakeRow[]): void {
  const expected = sources.flatMap(sourceRows);
  if (rows.length !== expected.length || new Set(rows.map(r => r.id)).size !== rows.length) throw Error("source accounting: missing or duplicate row");
  const byId = new Map(rows.map(r => [r.id, r]));
  for (const original of expected) {
    const actual = byId.get(original.id);
    if (!actual || fingerprint({ raw: actual.raw, locator: actual.locator, grade: actual.grade, sourceSha256: actual.sourceSha256 }) !==
      fingerprint({ raw: original.raw, locator: original.locator, grade: original.grade, sourceSha256: original.sourceSha256 })) {
      throw Error(`source accounting: altered source row ${original.id}`);
    }
  }
}

export function buildVocabularyIntake(sources: AppendixSource[], banks: BankOccurrence[], tasks: TaskOccurrence[], pins: Array<{ path: string; sha256: string }>) {
  if (sources.length !== 4 || new Set(sources.map(s => s.grade)).size !== 4) throw Error("exactly one appendix source for each of four grades is required");
  const bankIds = new Set<string>(); const taskIds = new Set<string>();
  for (const bank of banks) {
    if (bankIds.has(bank.id) || bank.slug !== `g${bank.grade}-u${String(bank.unit).padStart(2, "0")}` ||
      bank.unit < 1 || bank.unit > UNIT_COUNTS[bank.grade] || !bank.id.startsWith(`g${bank.grade}u${String(bank.unit).padStart(2, "0")}.w.`)) throw Error("invalid or duplicate bank occurrence");
    bankIds.add(bank.id);
  }
  for (const task of tasks) {
    if (taskIds.has(task.id)) throw Error("duplicate effective task ID");
    taskIds.add(task.id);
  }
  const rows = [...sources].sort((a, b) => a.grade - b.grade).flatMap(sourceRows);
  assertSourceAccounting(sources, rows);
  const bankMap = new Map<string, BankOccurrence[]>();
  for (const bank of banks) {
    const key = exactTextKey(bank.en);
    bankMap.set(key, [...(bankMap.get(key) ?? []), bank]);
  }
  const duplicateMap = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.entry) continue;
    const key = JSON.stringify([row.grade, exactTextKey(row.entry.en), row.entry.reference.code, exactTextKey(row.entry.de)]);
    duplicateMap.set(key, [...(duplicateMap.get(key) ?? []), row.id]);
  }
  const reconciled = rows.map(row => {
    if (!row.entry) return { ...row, reconciliation: null };
    const entry = row.entry;
    const all = [...(bankMap.get(exactTextKey(entry.en)) ?? [])].sort((a,b) => ordered(a.id,b.id));
    const scoped = all.filter(b => b.grade === entry.reference.grade && (entry.reference.unit === null || b.unit === entry.reference.unit));
    const duplicateKey = JSON.stringify([row.grade, exactTextKey(entry.en), entry.reference.code, exactTextKey(entry.de)]);
    const duplicateRows = (duplicateMap.get(duplicateKey) ?? []).filter(id => id !== row.id);
    const translationEqual = scoped.length === 1 && exactTextKey(scoped[0]!.deRaw) === exactTextKey(entry.de);
    const state = all.length === 0 ? "unmatched" : entry.reference.kind === "section" ? "section-reference-review" : scoped.length === 0 ? "reference-conflict" : scoped.length > 1 || duplicateRows.length > 0 ? "ambiguous" : translationEqual ? "exact-text-reference-match" : "meaning-review";
    return { ...row, reconciliation: { state, candidates: all.map(b => ({ id: b.id, slug: b.slug, en: b.en, de: b.deRaw,
      inReferenceScope: scoped.some(s => s.id === b.id), effectiveTaskPresent: taskIds.has(b.id) })), duplicateRows,
      // Even an exact textual join is not permission to merge meanings or publish.
      verifiedMeaning: false as const, firstTaught: null } };
  });
  const byTask = new Map(tasks.map(t => [t.id,t]));
  const bankCoverage = [...banks].sort((a,b) => ordered(a.id,b.id)).map(bank => {
    const task = byTask.get(bank.id);
    return { ...bank, taskState: !task ? "missing-or-dropped" : task.slug !== bank.slug ? "unit-conflict" : exactTextKey(task.w) !== exactTextKey(bank.en) ? "headword-differs" : "linked",
      appendixRows: reconciled.filter(r => r.reconciliation?.candidates.some(c => c.id === bank.id)).map(r => r.id) };
  });
  const states: Record<string, number> = {};
  for (const row of reconciled) {
    const state = row.reconciliation?.state ?? row.state;
    states[state] = (states[state] ?? 0) + 1;
  }
  return {
    schema: "vocabulary-intake-review@1", status: "CODEX DRAFT — NOT CANON",
    scope: "committed-wordbanks-and-git-effective-tasks", studioLayers: "not-read; live coverage unverified",
    policy: "Exact text produces candidates, not shared word senses. Appendix occurrence is not proof of teaching or learner knowledge. Quarantine must be reconciled before index freeze.",
    sources: [...sources].sort((a,b) => a.grade-b.grade).map(s => ({ grade: s.grade, sha256: s.sha256, blocksSha256: fingerprint(s.blocks), blocks: s.blocks.length })),
    corpusPins: [...pins].sort((a,b) => ordered(a.path,b.path)),
    counts: { inputBlocks: sources.reduce((n,s) => n+s.blocks.length,0), accountedRows: rows.length, parsedRows: rows.filter(r=>r.state === "parsed").length,
      quarantinedRows: rows.filter(r=>r.state === "quarantined").length, bankOccurrences: banks.length, effectiveTasks: tasks.length, states },
    rows: reconciled, bankCoverage, orphanTasks: [...tasks].filter(t => !bankIds.has(t.id)).sort((a,b) => ordered(a.id,b.id)),
  };
}
