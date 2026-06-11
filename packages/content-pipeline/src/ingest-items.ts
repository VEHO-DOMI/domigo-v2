/**
 * Stage 8 — `content ingest-review --items --unit <slug> [--dry-run]`.
 *
 * Turns a filled item review doc into corpus truth, mirroring the word-bank
 * ingest phase-for-phase: marker freshness → table diff (editable cells →
 * item-fixes patches) → verdict completeness/menus → consequences applied
 * IN MEMORY and re-validated (an approve that would go red is refused) →
 * artifacts written (item-fixes.json, items.flags.json, items.reviewed.json)
 * → state `approved` (by "fable") or `changes_requested`.
 */
import fs from "node:fs";
import path from "node:path";
import type { Gloss as GlossT, GrammarItem as GrammarItemT, VocabItem as VocabItemT } from "@domigo/content-schema";
import { GrammarFile, VocabFile } from "@domigo/content-schema";
import { ITEM_FIXES_PATH, itemFingerprint, itemsContentHash, readUnitItems, rekeyFingerprint, type ItemFixes, type ItemsLock, type UnitItems } from "./gen-items.ts";
import { readJsonIfExists, sha256OfString, writeJson } from "./json.ts";
import { parseTables, parseVerdicts } from "./mdtable.ts";
import { UNITS_DIR } from "./paths.ts";
import {
  buildItemsReview,
  GRAMMAR_EDITABLE,
  grammarRef,
  ITEM_REVIEW_ALLOWED,
  vocabRef,
  VOCAB_EDITABLE,
  type GeneratedItemsReview,
} from "./review-items.ts";
import { appendTransition } from "./state.ts";
import { validateUnitItems } from "./validate-items.ts";

const MARKER = /<!-- domigo:review items (\S+) round=(\d+) items=([0-9a-f]{12}) full=([01]) -->/;

export function parseGlossCell(cell: string): GlossT[] {
  const trimmed = cell.trim();
  if (trimmed === "—" || trimmed === "") return [];
  const out: GlossT[] = [];
  for (const part of trimmed.split(";").map((p) => p.trim()).filter((p) => p.length > 0)) {
    const m = /^(.+?)\s*\(=\s*(.+?)\)$/.exec(part);
    if (m === null) throw new Error(`gloss cell part ${JSON.stringify(part)} must look like \`word (= deutsch)\``);
    out.push({ word: m[1]!.trim(), de: m[2]!.trim(), scope: null });
  }
  return out;
}

function splitMulti(cell: string): string[] {
  return cell
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

interface ItemPlan {
  slug: string;
  round: number;
  full: boolean;
  outcome: "approve" | "changes";
  verdicts: Array<{ key: string; kind: string; itemId: string | null; verdict: string; note: string }>;
  unitNote: string;
  drops: string[];
  patches: Record<string, Record<string, unknown>>;
  editedCells: number;
  metrics: { itemsReviewed: number; fullRows: number; fixCount: number; dropCount: number; addCount: number; rejectRate: number };
}

/** Pure-ish: diff one parsed table against canonical rows (exported for tests). */
export function diffItemTable(
  slug: string,
  artifact: "vocab" | "grammar",
  parsedRows: Array<Record<string, string>>,
  canonical: GeneratedItemsReview["rows"],
  idOfRef: Map<string, string>,
): { patches: Record<string, Record<string, unknown>>; editedCells: number } {
  const editable = artifact === "vocab" ? VOCAB_EDITABLE : GRAMMAR_EDITABLE;
  const canonByRef = new Map(canonical.filter((r) => r.artifact === artifact).map((r) => [r.ref, r]));
  const patches: Record<string, Record<string, unknown>> = {};
  let editedCells = 0;
  for (const row of parsedRows) {
    const ref = row["ref"] ?? "";
    const canon = canonByRef.get(ref);
    if (canon === undefined) throw new Error(`${slug}: unknown ${artifact} ref \`${ref}\` — rows must not be added or renamed`);
    const id = idOfRef.get(ref);
    if (id === undefined) throw new Error(`${slug}: no item id for ref ${ref}`);
    for (const [col, value] of Object.entries(row)) {
      if (col === "⚑" || col === "ref") continue;
      const canonValue = canon.cells[col] ?? "";
      if (value === canonValue) continue;
      if (!editable.has(col)) {
        throw new Error(`${slug}: ${artifact} \`${ref}\` — column \`${col}\` is immutable (answer/structure problems go through verdict fix)`);
      }
      editedCells += 1;
      const patch = patches[id] ?? (patches[id] = {});
      if (col === "gloss") patch["gloss"] = parseGlossCell(value);
      else if (col === "mc") {
        const mc = splitMulti(value);
        if (mc.length !== 3) throw new Error(`${slug}: \`${ref}\` — mc must have exactly 3 entries`);
        patch["mc"] = mc;
      } else if (col === "distractors") {
        patch["distractors"] = value.trim() === "—" ? [] : splitMulti(value);
      } else if (col === "prompt") {
        // strip a trailing " [deToEn]"/" [enToDe]" rendering suffix if present
        patch["promptText"] = value.replace(/\s*\[(deToEn|enToDe)\]\s*$/, "");
      } else {
        patch[col] = value;
      }
    }
  }
  return { patches, editedCells };
}

function planUnit(slug: string, review: GeneratedItemsReview, md: string): ItemPlan {
  const marker = MARKER.exec(md);
  if (marker === null) throw new Error(`${slug}: review doc has no items marker`);
  if (marker[1] !== slug) throw new Error(`${slug}: marker says ${marker[1]}`);
  if (marker[3] !== review.itemsHash12) {
    throw new Error(`${slug}: STALE review doc (doc items=${marker[3]}, current=${review.itemsHash12}) — regenerate with \`content review-doc --items --unit ${slug}\``);
  }
  const round = parseInt(marker[2]!, 10);
  if (round !== review.round) throw new Error(`${slug}: round mismatch (doc=${round}, computed=${review.round})`);

  const items = readUnitItems(slug);
  const idOfRef = new Map<string, string>();
  for (const it of items.vocab) idOfRef.set(vocabRef(it.id), it.id);
  for (const it of items.grammar) idOfRef.set(grammarRef(it.id), it.id);

  // ---- table diffs
  const tables = parseTables(md);
  const vocabTable = tables.find((t) => t.headers.includes("en") && t.headers.includes("mc"));
  const grammarTable = tables.find((t) => t.headers.includes("fmt") && t.headers.includes("str"));
  if (vocabTable === undefined) throw new Error(`${slug}: vocab table not found in review doc`);
  const vDiff = diffItemTable(slug, "vocab", vocabTable.rows, review.rows, idOfRef);
  const gDiff = grammarTable !== undefined
    ? diffItemTable(slug, "grammar", grammarTable.rows, review.rows, idOfRef)
    : { patches: {}, editedCells: 0 };
  // grammar prompt patches keep the prompt object shape
  const patches: Record<string, Record<string, unknown>> = { ...vDiff.patches };
  for (const [id, patch] of Object.entries(gDiff.patches)) {
    const item = items.grammar.find((it) => it.id === id);
    const finalPatch: Record<string, unknown> = { ...patch };
    if ("promptText" in finalPatch) {
      const text = finalPatch["promptText"] as string;
      delete finalPatch["promptText"];
      finalPatch["prompt"] = { ...item!.prompt, text };
    }
    patches[id] = { ...(patches[id] ?? {}), ...finalPatch };
  }

  // ---- verdicts
  const parsed = parseVerdicts(md);
  const openByKey = new Map(review.openFlags.map((f) => [f.key, f]));
  const verdicts: ItemPlan["verdicts"] = [];
  const seenKeys = new Set<string>();
  for (const block of parsed.flags) {
    const key = `${block.kind}:${block.ref}`;
    const flag = openByKey.get(key);
    if (flag === undefined) throw new Error(`${slug}: verdict for unknown/closed flag ${key} (line ${block.headingLine})`);
    if (seenKeys.has(key)) throw new Error(`${slug}: duplicate verdict block for ${key}`);
    seenKeys.add(key);
    if (block.verdict === null) throw new Error(`${slug}: flag ${key} is unanswered (line ${block.headingLine})`);
    const artifact = flag.itemId !== null && flag.itemId.includes(".gi.") ? "grammar" : "vocab";
    const allowed = ITEM_REVIEW_ALLOWED[flag.kind]?.[artifact] ?? ["ok", "fix"];
    if (!allowed.includes(block.verdict)) {
      throw new Error(`${slug}: verdict \`${block.verdict}\` not allowed for ${flag.kind} on ${artifact} (line ${block.headingLine}; allowed: ${allowed.join("/")})`);
    }
    if ((block.verdict === "fix" || block.verdict === "add") && block.note.trim().length === 0) {
      throw new Error(`${slug}: flag ${key} verdict is ${block.verdict} but the note is empty — say what to do`);
    }
    verdicts.push({ key, kind: flag.kind, itemId: flag.itemId, verdict: block.verdict, note: block.note });
  }
  for (const f of review.openFlags) {
    if (!seenKeys.has(f.key)) throw new Error(`${slug}: flag ${f.key} has no verdict block in the doc`);
  }
  if (parsed.unit === null || parsed.unit.verdict === null) {
    throw new Error(`${slug}: unit verdict missing — fill \`> unit: ok\` or \`> unit: changes\``);
  }
  if (!["ok", "changes"].includes(parsed.unit.verdict)) {
    throw new Error(`${slug}: unit verdict must be ok or changes, got \`${parsed.unit.verdict}\``);
  }

  const drops = [...new Set(verdicts.filter((v) => v.verdict === "drop").map((v) => v.itemId as string))];
  const anyFix = verdicts.some((v) => v.verdict === "fix" || v.verdict === "add");
  if (parsed.unit.verdict === "ok" && anyFix) {
    throw new Error(`${slug}: unit verdict is ok but ${verdicts.filter((v) => v.verdict === "fix" || v.verdict === "add").length} flag(s) say fix/add — resolve or set unit: changes`);
  }
  const outcome: ItemPlan["outcome"] = parsed.unit.verdict === "ok" ? "approve" : "changes";

  // ---- metrics (reject rate over reviewed items)
  const reviewedIds = new Set<string>();
  for (const r of review.rows) {
    // with --full every row is the denominator; otherwise count rendered rows
    reviewedIds.add(idOfRef.get(r.ref)!);
  }
  const itemsReviewed = review.full ? reviewedIds.size : review.fullyRendered;
  const rejectedIds = new Set<string>(drops);
  for (const v of verdicts) {
    if (v.verdict === "fix" && v.itemId !== null) rejectedIds.add(v.itemId);
  }
  const metrics = {
    itemsReviewed,
    fullRows: review.fullyRendered,
    fixCount: verdicts.filter((v) => v.verdict === "fix").length,
    dropCount: drops.length,
    addCount: verdicts.filter((v) => v.verdict === "add").length,
    rejectRate: itemsReviewed > 0 ? Number((rejectedIds.size / itemsReviewed).toFixed(4)) : 0,
  };

  return { slug, round, full: review.full, outcome, verdicts, unitNote: parsed.unit.note, drops, patches, editedCells: vDiff.editedCells + gDiff.editedCells, metrics };
}

export function runIngestItems(slug: string, dryRun: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const docPath = path.join(unitDir, "review", "items.review.md");
  if (!fs.existsSync(docPath)) throw new Error(`${slug}: review/items.review.md missing`);
  const md = fs.readFileSync(docPath, "utf8");
  const fullFlag = MARKER.exec(md)?.[4] === "1";
  const review = buildItemsReview(slug, { full: fullFlag });
  const plan = planUnit(slug, review, md);

  console.log(
    `${slug}: ${plan.outcome.toUpperCase()} — ${plan.verdicts.length} verdict(s), ${plan.editedCells} cell edit(s), ${plan.drops.length} drop(s), rejectRate ${(plan.metrics.rejectRate * 100).toFixed(1)}% over ${plan.metrics.itemsReviewed} reviewed`,
  );
  if (dryRun) {
    console.log("(dry run — nothing written)");
    return;
  }

  const items = readUnitItems(slug);
  const m = /^g([1-4])-u(\d{2})$/.exec(slug)!;
  const grade = Number(m[1]);
  const unit = parseInt(m[2]!, 10);

  if (plan.outcome === "changes") {
    writeJson(path.join(unitDir, "review", "items.flags.json"), {
      schema: "items-flags@1",
      slug,
      round: plan.round,
      itemsHash: review.itemsHash12,
      reviewedBy: "fable",
      flags: plan.verdicts,
      unit: { verdict: "changes", note: plan.unitNote },
      metrics: plan.metrics,
    });
    appendTransition(unitDir, slug, {
      state: "changes_requested",
      by: "fable",
      contentHash: itemsContentHash(items),
      note:
        plan.verdicts
          .filter((v) => v.verdict === "fix" || v.verdict === "add")
          .map((v) => `${v.key}: ${v.note}`)
          .slice(0, 6)
          .join(" | ") || plan.unitNote,
    });
    console.log(`${slug}: changes_requested recorded — fold back via gen --prepare --fix`);
    return;
  }

  // ---- approve: apply consequences IN MEMORY, re-validate, then write
  if (plan.drops.length + Object.keys(plan.patches).length > 0) {
    const fixesAll = readJsonIfExists<ItemFixes>(ITEM_FIXES_PATH) ?? {};
    const unitFix = fixesAll[slug] ?? {};
    if (plan.drops.length > 0) unitFix.drop = [...new Set([...(unitFix.drop ?? []), ...plan.drops])];
    if (Object.keys(plan.patches).length > 0) {
      unitFix.patch = { ...(unitFix.patch ?? {}) };
      for (const [id, patch] of Object.entries(plan.patches)) {
        unitFix.patch[id] = { ...(unitFix.patch[id] ?? {}), ...patch };
      }
    }
    fixesAll[slug] = unitFix;

    const drop = new Set(plan.drops);
    const applied: UnitItems = {
      vocab: items.vocab.filter((it) => !drop.has(it.id)).map((it) => {
        const p = plan.patches[it.id];
        return p !== undefined ? ({ ...it, ...p, rev: it.rev + 1 } as VocabItemT) : it;
      }),
      grammar: items.grammar.filter((it) => !drop.has(it.id)).map((it) => {
        const p = plan.patches[it.id];
        return p !== undefined ? ({ ...it, ...p, rev: it.rev + 1 } as GrammarItemT) : it;
      }),
    };
    // refuse an approve that would go red
    const vocabFile = VocabFile.parse({ schema: "vocab@1", grade, unit, slug, items: applied.vocab });
    const grammarFile = applied.grammar.length > 0 ? GrammarFile.parse({ schema: "grammar@1", grade, unit, slug, items: applied.grammar }) : null;
    writeJson(path.join(unitDir, "vocab.json"), vocabFile);
    if (grammarFile !== null) writeJson(path.join(unitDir, "grammar.json"), grammarFile);
    else if (fs.existsSync(path.join(unitDir, "grammar.json")) && applied.grammar.length === 0) {
      fs.rmSync(path.join(unitDir, "grammar.json"));
    }
    writeJson(ITEM_FIXES_PATH, fixesAll);

    // re-key grammar fingerprints for patched prompts/distractors
    const lockPath = path.join(unitDir, "items.lock.json");
    const lock = readJsonIfExists<ItemsLock>(lockPath);
    if (lock !== null) {
      let changed = false;
      for (const it of applied.grammar) {
        if (plan.patches[it.id] === undefined) continue;
        changed = rekeyFingerprint(lock, it.id, itemFingerprint(it)) || changed;
      }
      if (changed) writeJson(lockPath, lock);
    }

    const validation = validateUnitItems(slug);
    if (validation.errors.length > 0) {
      for (const e of validation.errors.slice(0, 20)) console.error(`  ✗ ${e}`);
      throw new Error(
        `${slug}: review consequences make the validators RED (${validation.errors.length} error(s)) — an approve must stay green; resolve and re-run`,
      );
    }
  }

  const finalItems = readUnitItems(slug);
  const finalHash = itemsContentHash(finalItems);
  writeJson(path.join(unitDir, "review", "items.flags.json"), {
    schema: "items-flags@1",
    slug,
    round: plan.round,
    itemsHash: finalHash.slice(0, 12),
    reviewedBy: "fable",
    flags: plan.verdicts,
    unit: { verdict: "ok", note: plan.unitNote },
    metrics: plan.metrics,
  });
  const finalReview = buildItemsReview(slug, { full: plan.full });
  writeJson(path.join(unitDir, "review", "items.reviewed.json"), {
    schema: "items-reviewed@1",
    slug,
    round: plan.round,
    rows: Object.fromEntries(finalReview.rows.map((r) => [r.ref, r.hash])),
  });
  appendTransition(unitDir, slug, {
    state: "approved",
    by: "fable",
    contentHash: finalHash,
    note: `round ${plan.round}: ${plan.verdicts.length} verdict(s), ${plan.editedCells} edit(s), ${plan.drops.length} drop(s), rejectRate ${(plan.metrics.rejectRate * 100).toFixed(1)}%`,
  });
  console.log(`${slug}: items approved ✓ (rejectRate ${(plan.metrics.rejectRate * 100).toFixed(1)}%)`);
}
