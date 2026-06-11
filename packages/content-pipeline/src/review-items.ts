/**
 * Stage 8 — `content review-doc --items --unit <slug> [--full]`.
 *
 * ONE combined review doc per unit (vocab + grammar tables + flag blocks),
 * byte-stable, mirroring the word-bank review machinery. Refuses unless the
 * deterministic validators are green; appends `validated` + `review_ready`.
 *
 * Render policy: ALWAYS full = every translation-bearing item, every glossed
 * item, every lens-warned/escalated item, every validator-warned item, every
 * changed-since-review item — plus a deterministic 10% sample of the rest.
 * `--full` renders everything (the pilot runs --full; reject-rate denominators
 * stay honest). Round ≥2 collapses reviewed-and-unchanged rows.
 */
import path from "node:path";
import type { GrammarItem as GrammarItemT, VocabItem as VocabItemT } from "@domigo/content-schema";
import { itemsContentHash, readUnitItems } from "./gen-items.ts";
import { readJsonIfExists, sha256OfString, writeText } from "./json.ts";
import { renderTable } from "./mdtable.ts";
import { UNITS_DIR } from "./paths.ts";
import { appendTransition, currentState } from "./state.ts";
import { validateUnitItems, type ValidatorWarn } from "./validate-items.ts";
import type { MergedFlag, VerifyMerged } from "./verify-items.ts";

// ---------------------------------------------------------------------------
// row models (generator + ingest must agree byte-for-byte)
// ---------------------------------------------------------------------------

export interface ItemRow {
  ref: string; // id suffix after `.w.` / `.gi.`
  artifact: "vocab" | "grammar";
  cells: Record<string, string>;
  hash: string; // sha12 of the cells
}

export const VOCAB_COLUMNS = ["ref", "en", "d", "s", "answers", "mc", "translation", "gloss", "src", "diff", "⚑"] as const;
export const GRAMMAR_COLUMNS = ["ref", "str", "fmt", "diff", "prompt", "answers", "distractors", "hintDe", "gloss", "src", "⚑"] as const;

/** Cells the reviewer may edit (diff → item-fixes patch). */
export const VOCAB_EDITABLE = new Set(["d", "s", "mc", "gloss", "hintDe"]);
export const GRAMMAR_EDITABLE = new Set(["prompt", "distractors", "gloss", "hintDe"]);

export function glossCell(gloss: Array<{ word: string; de: string }>): string {
  return gloss.map((g) => `${g.word} (= ${g.de})`).join(" ; ") || "—";
}

function tiered(answers: Array<{ text: string; tier: string }>): string {
  const fulls = answers.filter((a) => a.tier === "full").map((a) => a.text);
  const partials = answers.filter((a) => a.tier === "partial").map((a) => a.text);
  return fulls.join(" ; ") + (partials.length > 0 ? ` // ${partials.join(" ; ")}` : "");
}

export function vocabRef(id: string): string {
  return id.split(".w.")[1] ?? id;
}

export function grammarRef(id: string): string {
  return id.split(".gi.")[1] ?? id;
}

export function vocabRow(it: VocabItemT): ItemRow {
  const cells: Record<string, string> = {
    ref: vocabRef(it.id),
    en: it.w,
    d: it.d,
    s: it.s,
    answers: `s: ${tiered(it.sAnswers)} | d: ${tiered(it.dAnswers)}`,
    mc: it.mc.join(" ; "),
    translation: `→EN ${tiered(it.translation.deToEn)} | →DE ${tiered(it.translation.enToDe)}`,
    gloss: glossCell(it.gloss),
    src: it.sSource,
    diff: String(it.difficulty),
  };
  return { ref: cells["ref"]!, artifact: "vocab", cells, hash: sha256OfString(JSON.stringify(cells)).slice(0, 12) };
}

export function grammarRow(it: GrammarItemT): ItemRow {
  const cells: Record<string, string> = {
    ref: grammarRef(it.id),
    str: it.structureId.split(".s.")[1] ?? it.structureId,
    fmt: it.format,
    diff: String(it.difficulty),
    prompt: it.prompt.text + (it.format === "translation" ? ` [${it.direction}]` : ""),
    answers:
      it.pairs.length > 0
        ? it.pairs.map((p) => `${p.left} ↔ ${p.right}`).join(" ; ")
        : it.groups.length > 0
          ? it.groups.map((g) => `${g.label}: ${g.members.join(", ")}`).join(" | ")
          : tiered(it.answers),
    distractors: it.distractors.join(" ; ") || "—",
    hintDe: it.hintDe,
    gloss: glossCell(it.gloss),
    src: it.provenance.sbRef !== null ? "sb" : it.provenance.seedV1 !== null ? "v1-seed" : "new",
  };
  return { ref: cells["ref"]!, artifact: "grammar", cells, hash: sha256OfString(JSON.stringify(cells)).slice(0, 12) };
}

// ---------------------------------------------------------------------------
// flags
// ---------------------------------------------------------------------------

export interface ItemReviewFlag {
  key: string; // `${kind}:${ref}` (ref = item id or "unit")
  kind: string;
  itemId: string | null;
  title: string;
  body: string[];
  allowed: string;
}

export const ITEM_REVIEW_ALLOWED: Record<string, { vocab: string[]; grammar: string[] }> = {
  "lens-escalated": { vocab: ["ok", "fix"], grammar: ["ok", "drop", "fix"] },
  "lens-warn": { vocab: ["ok", "fix"], grammar: ["ok", "drop", "fix"] },
  "new-gloss": { vocab: ["ok", "fix"], grammar: ["ok", "fix"] },
  "translation-audit": { vocab: ["ok", "fix"], grammar: ["ok", "drop", "fix"] },
  "validator-warn": { vocab: ["ok", "fix"], grammar: ["ok", "fix"] },
  "coverage-gap": { vocab: ["ok", "add"], grammar: ["ok", "add"] },
  "changed-since-review": { vocab: ["ok", "fix"], grammar: ["ok", "drop", "fix"] },
};

export interface GeneratedItemsReview {
  slug: string;
  round: number;
  itemsHash12: string;
  full: boolean;
  markdown: string;
  openFlags: ItemReviewFlag[];
  rows: ItemRow[];
  fullyRendered: number;
}

interface PrevFlags {
  round: number;
  flags: Array<{ key: string; verdict: string }>;
}
interface PrevReviewed {
  round: number;
  rows: Record<string, string>;
}

export function buildItemsReview(slug: string, opts: { full: boolean }): GeneratedItemsReview {
  const unitDir = path.join(UNITS_DIR, slug);
  const items = readUnitItems(slug);
  if (items.vocab.length === 0) throw new Error(`${slug}: no items — run gen first`);
  const itemsHash12 = itemsContentHash(items).slice(0, 12);
  const reviewDir = path.join(unitDir, "review");
  const prevFlags = readJsonIfExists<PrevFlags>(path.join(reviewDir, "items.flags.json"));
  const prevReviewed = readJsonIfExists<PrevReviewed>(path.join(reviewDir, "items.reviewed.json"));
  const round = (prevFlags?.round ?? 0) + 1;

  const merged = readJsonIfExists<VerifyMerged>(path.join(unitDir, "verify", "verify.merged.json"));
  const validation = validateUnitItems(slug);

  const vocabRows = items.vocab.map(vocabRow);
  const grammarRows = items.grammar.map(grammarRow);
  const rows = [...vocabRows, ...grammarRows];
  const byId = new Map<string, VocabItemT | GrammarItemT>();
  for (const it of items.vocab) byId.set(it.id, it);
  for (const it of items.grammar) byId.set(it.id, it);
  const idOfRef = new Map<string, string>();
  for (const it of items.vocab) idOfRef.set(vocabRef(it.id), it.id);
  for (const it of items.grammar) idOfRef.set(grammarRef(it.id), it.id);

  // ---- flags
  const flags: ItemReviewFlag[] = [];
  const escalatedSet = new Set(merged?.escalated ?? []);
  const lensFlagsByItem = new Map<string, MergedFlag[]>(Object.entries(merged?.byItem ?? {}));

  for (const [itemId, lensFlags] of [...lensFlagsByItem.entries()].sort()) {
    for (const f of lensFlags) {
      if (f.severity === "fix" && escalatedSet.has(f.key)) {
        flags.push({
          key: `lens-escalated:${itemId}#${f.kind}`,
          kind: "lens-escalated",
          itemId,
          title: `UNRESOLVED after the fix-loop cap: ${f.kind} (lens ${f.lens})`,
          body: [f.note, "The generation loop could not satisfy this lens — the review IS the human escape hatch. Decide."],
          allowed: menuFor("lens-escalated", itemId),
        });
      } else if (f.severity === "warn") {
        flags.push({
          key: `lens-warn:${itemId}#${f.kind}`,
          kind: "lens-warn",
          itemId,
          title: `lens ${f.lens}: ${f.kind}`,
          body: [f.note],
          allowed: menuFor("lens-warn", itemId),
        });
      }
    }
  }
  for (const it of [...items.vocab, ...items.grammar]) {
    if (it.gloss.length > 0) {
      flags.push({
        key: `new-gloss:${it.id}`,
        kind: "new-gloss",
        itemId: it.id,
        title: `gloss audit for \`${it.id}\``,
        body: [it.gloss.map((g) => `\`${g.word} (= ${g.de})\`${g.scope !== null ? ` [${g.scope}]` : ""}`).join(" · "), "Every new gloss is reviewed: German correct, word genuinely above level, attached to the right surface?"],
        allowed: menuFor("new-gloss", it.id),
      });
    }
  }
  for (const it of items.vocab) {
    flags.push({
      key: `translation-audit:${it.id}`,
      kind: "translation-audit",
      itemId: it.id,
      title: `translation audit for \`${it.w}\``,
      body: [
        `→EN (${it.g}): ${tiered(it.translation.deToEn)}`,
        `→DE (${it.w}): ${tiered(it.translation.enToDe)}`,
        "Both directions independently correct, complete, natural?",
      ],
      allowed: menuFor("translation-audit", it.id),
    });
  }
  for (const it of items.grammar) {
    if (it.format !== "translation") continue;
    flags.push({
      key: `translation-audit:${it.id}`,
      kind: "translation-audit",
      itemId: it.id,
      title: `translation audit (${it.direction})`,
      body: [`prompt: ${it.prompt.text}`, `answers: ${tiered(it.answers)}`],
      allowed: menuFor("translation-audit", it.id),
    });
  }
  for (const w of validation.warns) {
    flags.push({
      key: `validator-warn:${w.itemId}#${sha256OfString(w.note).slice(0, 6)}`,
      kind: "validator-warn",
      itemId: w.itemId,
      title: "deterministic validator warning",
      body: [w.note],
      allowed: menuFor("validator-warn", w.itemId),
    });
  }
  // changed-since-review (round ≥2)
  if (prevReviewed !== null) {
    for (const row of rows) {
      const prev = prevReviewed.rows[row.ref];
      if (prev !== undefined && prev !== row.hash) {
        const itemId = idOfRef.get(row.ref) ?? row.ref;
        flags.push({
          key: `changed-since-review:${itemId}`,
          kind: "changed-since-review",
          itemId,
          title: `\`${row.ref}\` changed since the last review`,
          body: ["The row content differs from what was reviewed. Re-confirm it."],
          allowed: menuFor("changed-since-review", itemId),
        });
      }
    }
  }

  function menuFor(kind: string, itemId: string | null): string {
    const menus = ITEM_REVIEW_ALLOWED[kind]!;
    const artifact = itemId !== null && itemId.includes(".gi.") ? "grammar" : "vocab";
    return menus[artifact].join(" · ");
  }

  // sticky resolved (non-fix/add verdicts)
  const resolved = new Map<string, string>();
  for (const f of prevFlags?.flags ?? []) {
    if (f.verdict !== "fix" && f.verdict !== "add") resolved.set(f.key, f.verdict);
  }
  const openFlags = flags.filter((f) => !resolved.has(f.key));
  const resolvedEarlier = flags.filter((f) => resolved.has(f.key)).map((f) => ({ key: f.key, verdict: resolved.get(f.key)! }));

  // ---- render policy
  const flaggedIds = new Set(openFlags.filter((f) => f.itemId !== null).map((f) => f.itemId!));
  const mustRender = new Set<string>();
  for (const it of items.vocab) mustRender.add(it.id); // every vocab item carries translations
  for (const it of items.grammar) {
    if (it.format === "translation" || it.gloss.length > 0 || flaggedIds.has(it.id)) mustRender.add(it.id);
  }
  const remainder = items.grammar.map((it) => it.id).filter((id) => !mustRender.has(id));
  const sampleCount = Math.ceil(remainder.length * 0.1);
  const sampled = [...remainder]
    .sort((a, b) => sha256OfString(itemsHash12 + a).localeCompare(sha256OfString(itemsHash12 + b)))
    .slice(0, sampleCount);
  for (const id of sampled) mustRender.add(id);

  const renderRow = (row: ItemRow): boolean => {
    const id = idOfRef.get(row.ref)!;
    if (opts.full) {
      // round ≥2 still collapses reviewed-and-unchanged rows without open flags
      if (prevReviewed !== null && prevReviewed.rows[row.ref] === row.hash && !flaggedIds.has(id)) return false;
      return true;
    }
    if (prevReviewed !== null && prevReviewed.rows[row.ref] === row.hash && !flaggedIds.has(id)) return false;
    return mustRender.has(id);
  };
  const shownVocab = vocabRows.filter(renderRow);
  const shownGrammar = grammarRows.filter(renderRow);
  const fullyRendered = shownVocab.length + shownGrammar.length;
  const collapsed = rows.length - fullyRendered;

  // ---- assemble
  const flagNumber = new Map<string, number>();
  openFlags.forEach((f, i) => flagNumber.set(f.key, i + 1));
  const flagMarks = (id: string): string =>
    openFlags
      .filter((f) => f.itemId === id)
      .map((f) => `F${flagNumber.get(f.key)}`)
      .join(" ");

  const m = /^g([1-4])-u(\d{2})$/.exec(slug)!;
  const lines: string[] = [];
  lines.push(`# Item review — ${slug} (MORE! ${m[1]}, Unit ${parseInt(m[2]!, 10)})`);
  lines.push(`<!-- domigo:review items ${slug} round=${round} items=${itemsHash12} full=${opts.full ? 1 : 0} -->`);
  lines.push("");
  lines.push(`**${items.vocab.length} vocab + ${items.grammar.length} grammar item(s)** — verify round ${merged?.round ?? "—"}: ${merged?.fixCount ?? 0} fix (${escalatedSet.size} escalated), ${merged?.warnCount ?? 0} warn · validator warns: ${validation.warns.length}`);
  lines.push(`**open flags:** ${openFlags.length}${resolvedEarlier.length > 0 ? ` · resolved earlier: ${resolvedEarlier.length}` : ""}${collapsed > 0 ? ` · ${collapsed} row(s) collapsed` : ""}${opts.full ? " · FULL render" : ""}`);
  lines.push("");
  lines.push("> Reviewer: answer every flag's `> verdict:` (menu per flag), then the unit verdict at the bottom.");
  lines.push("> Editable cells — vocab: **d / s / mc / gloss / hintDe** · grammar: **prompt / distractors / gloss / hintDe**. Edits become audited item-fixes patches.");
  lines.push("> `ref`, `en`, `str`, `fmt`, `src`, `diff` and answer sets are immutable here (answer-set problems → verdict `fix`). Multi-values: ` ; ` · gloss format: `word (= deutsch)`.");
  lines.push("");
  lines.push(`## Vocab items (${shownVocab.length}/${items.vocab.length})`);
  lines.push("");
  lines.push(
    renderTable(
      [...VOCAB_COLUMNS],
      shownVocab.map((r) => VOCAB_COLUMNS.map((c) => (c === "⚑" ? flagMarks(idOfRef.get(r.ref)!) : r.cells[c] ?? ""))),
    ),
  );
  lines.push("");
  lines.push(`## Grammar items (${shownGrammar.length}/${items.grammar.length})`);
  lines.push("");
  if (shownGrammar.length > 0) {
    lines.push(
      renderTable(
        [...GRAMMAR_COLUMNS],
        shownGrammar.map((r) => GRAMMAR_COLUMNS.map((c) => (c === "⚑" ? flagMarks(idOfRef.get(r.ref)!) : r.cells[c] ?? ""))),
      ),
    );
  } else {
    lines.push("_none_");
  }
  lines.push("");

  if (openFlags.length > 0) {
    lines.push("## Flags");
    openFlags.forEach((f, i) => {
      lines.push("");
      lines.push(`### F${i + 1} · ${f.kind} · \`${f.key.slice(f.kind.length + 1)}\``);
      lines.push(f.title);
      for (const b of f.body) lines.push(`- ${b}`);
      lines.push(`Allowed: ${f.allowed}`);
      lines.push("> verdict: _");
      lines.push("> note:");
    });
    lines.push("");
  }
  if (resolvedEarlier.length > 0) {
    lines.push(`_Previously resolved (sticky): ${resolvedEarlier.map((r) => `${r.key} → ${r.verdict}`).join(" · ")}_`);
    lines.push("");
  }
  lines.push("## Unit verdict");
  lines.push("> unit: _        (ok = approve these items · changes = fixes needed, re-present)");
  lines.push("> note:");
  lines.push("");

  return { slug, round, itemsHash12, full: opts.full, markdown: lines.join("\n"), openFlags, rows, fullyRendered };
}

// ---------------------------------------------------------------------------
// CLI entry
// ---------------------------------------------------------------------------

export function runReviewDocItems(slug: string, full: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const state = currentState(unitDir)?.state ?? "—";
  if (!["verified", "validated", "review_ready", "changes_requested"].includes(state)) {
    throw new Error(`${slug}: state is ${state} — verify must pass (or escalate) before review`);
  }
  const validation = validateUnitItems(slug);
  if (validation.errors.length > 0) {
    for (const e of validation.errors.slice(0, 20)) console.error(`  ✗ ${e}`);
    throw new Error(`${slug}: ${validation.errors.length} validator error(s) — the review doc only renders on green (fix deterministically first)`);
  }
  const hash = itemsContentHash(readUnitItems(slug));
  appendTransition(unitDir, slug, {
    state: "validated",
    by: "pipeline",
    contentHash: hash,
    note: `V-1..V-22 green (${validation.warns.length} warn)`,
  });
  const review = buildItemsReview(slug, { full });
  const outPath = path.join(unitDir, "review", "items.review.md");
  writeText(outPath, review.markdown);
  appendTransition(unitDir, slug, {
    state: "review_ready",
    by: "pipeline",
    contentHash: hash,
    note: `round ${review.round} doc: ${review.openFlags.length} open flag(s), ${review.fullyRendered} row(s) rendered${full ? " (FULL)" : ""}`,
  });
  console.log(`${slug}: items review round ${review.round} — ${review.openFlags.length} open flag(s), ${review.fullyRendered}/${review.rows.length} rows\n  → ${outPath}`);
}
