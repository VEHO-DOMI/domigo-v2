/**
 * Stage 6 — `content verify --prepare|--ingest --unit <slug>`.
 *
 * Four independent adversarial lenses (level+gloss · answers · translation ·
 * German register), each a FRESH agent session that never generated the items
 * it verifies. --prepare writes one brief per lens; lenses write
 * verify/<lens>.flags.json; --ingest merges (all four mandatory + fresh),
 * drives the fix loop (max 2), escalates leftovers to the stage-8 review.
 */
import path from "node:path";
import { z } from "zod";
import type { GrammarItem as GrammarItemT, VocabItem as VocabItemT } from "@domigo/content-schema";
import { UnitSlug } from "@domigo/content-schema";
import { allowedVocabularyDigest, itemsContentHash, promptHash, readUnitItems } from "./gen-items.ts";
import { readJsonIfExists, sha256OfString, writeJson, writeText } from "./json.ts";
import { renderTable } from "./mdtable.ts";
import { PROMPTS_DIR, UNITS_DIR } from "./paths.ts";
import { appendTransition, currentState } from "./state.ts";
import fs from "node:fs";

export const LENSES = ["level-gloss", "answers", "translation", "register"] as const;
export type Lens = (typeof LENSES)[number];

export const ITEM_FLAG_KINDS = [
  "above-level",
  "gloss-missing",
  "gloss-wrong",
  "gloss-unneeded",
  "answer-incomplete",
  "answer-ungrammatical",
  "distractor-plausible-correct",
  "translation-meaning",
  "translation-direction",
  "translation-unnatural",
  "register-sie",
  "meta-talk",
  "unnatural-german",
  "other",
] as const;

export const VerifyFlags = z.object({
  schema: z.literal("verify-flags@1"),
  slug: UnitSlug,
  lens: z.enum(LENSES),
  itemsHash: z.string().regex(/^[0-9a-f]{12}$/),
  promptHash: z.string().regex(/^[0-9a-f]{12}$/),
  round: z.number().int().min(1),
  by: z.string().min(1),
  flags: z.array(
    z.object({
      key: z.string().min(1), // `${kind}:${itemId}`
      kind: z.enum(ITEM_FLAG_KINDS),
      itemId: z.string().min(1),
      severity: z.enum(["fix", "warn"]),
      note: z.string().min(1),
      suggestion: z.unknown().nullable(),
    }),
  ),
  summary: z.object({ itemsSeen: z.number().int(), flagged: z.number().int() }),
});
export type VerifyFlagsT = z.infer<typeof VerifyFlags>;

export interface MergedFlag {
  key: string;
  kind: string;
  itemId: string;
  severity: "fix" | "warn";
  note: string;
  lens: Lens;
}

export interface VerifyMerged {
  schema: "verify-merged@1";
  slug: string;
  round: number;
  itemsHash: string;
  lenses: Record<string, { by: string; flagged: number }>;
  byItem: Record<string, MergedFlag[]>;
  fixCount: number;
  warnCount: number;
  /** Flag keys left unresolved at the loop cap — forced into the stage-8 doc. */
  escalated: string[];
}

function itemsHash12(slug: string): string {
  return itemsContentHash(readUnitItems(slug)).slice(0, 12);
}

function nextRound(slug: string, hash12: string): number {
  const merged = readJsonIfExists<VerifyMerged>(path.join(UNITS_DIR, slug, "verify", "verify.merged.json"));
  if (merged === null) return 1;
  return merged.itemsHash === hash12 ? merged.round : merged.round + 1;
}

// ---------------------------------------------------------------------------
// lens-scoped rendering
// ---------------------------------------------------------------------------

function vocabSurface(it: VocabItemT): Record<string, string> {
  return {
    id: it.id,
    w: it.w,
    g: it.g,
    d: it.d,
    s: it.s,
    sAnswers: it.sAnswers.map((a) => `${a.text} (${a.tier})`).join(" ; "),
    dAnswers: it.dAnswers.map((a) => `${a.text} (${a.tier})`).join(" ; "),
    deToEn: it.translation.deToEn.map((a) => `${a.text} (${a.tier})`).join(" ; "),
    enToDe: it.translation.enToDe.map((a) => `${a.text} (${a.tier})`).join(" ; "),
    gloss: it.gloss.map((g) => `${g.word} (= ${g.de})`).join(" ; ") || "—",
    mc: it.mc.join(" ; "),
    pool: it.presentation.gameMeta?.distractorPool.join(" ; ") ?? "—",
    hintDe: it.hintDe,
    diff: String(it.difficulty),
  };
}

function grammarSurface(it: GrammarItemT): Record<string, string> {
  return {
    id: it.id,
    str: it.structureId,
    fmt: it.format,
    prompt: `${it.prompt.text} [${it.prompt.lang}${it.prompt.blanks > 0 ? `, ${it.prompt.blanks} blank(s)` : ""}]`,
    answers: it.answers.map((a) => `${a.text} (${a.tier})`).join(" ; ") || "—",
    direction: it.direction ?? "—",
    distractors: it.distractors.join(" ; ") || "—",
    pairs: it.pairs.map((p) => `${p.left} ↔ ${p.right}`).join(" ; ") || "—",
    groups: it.groups.map((g) => `${g.label}: ${g.members.join(", ")}`).join(" | ") || "—",
    gloss: it.gloss.map((g) => `${g.word} (= ${g.de})`).join(" ; ") || "—",
    hintDe: it.hintDe,
    explainDe: it.explainDe,
    strict: String(it.strict),
    diff: String(it.difficulty),
  };
}

const LENS_COLUMNS: Record<Lens, { vocab: string[]; grammar: string[] }> = {
  "level-gloss": {
    vocab: ["id", "d", "s", "mc", "pool", "gloss"],
    grammar: ["id", "fmt", "prompt", "answers", "distractors", "pairs", "groups", "gloss"],
  },
  answers: {
    vocab: ["id", "w", "d", "s", "sAnswers", "dAnswers", "mc"],
    grammar: ["id", "fmt", "prompt", "answers", "direction", "distractors", "pairs", "groups", "strict"],
  },
  translation: {
    vocab: ["id", "w", "g", "deToEn", "enToDe"],
    grammar: ["id", "fmt", "prompt", "answers", "direction"],
  },
  register: {
    vocab: ["id", "g", "s", "d", "hintDe", "gloss"],
    grammar: ["id", "fmt", "prompt", "answers", "hintDe", "explainDe", "gloss"],
  },
};

function renderLensBrief(slug: string, lens: Lens, hash12: string, round: number): string {
  const items = readUnitItems(slug);
  const pHash = promptHash(`verify-${lens}`);
  const cols = LENS_COLUMNS[lens];

  const grammarRows =
    lens === "translation" ? items.grammar.filter((g) => g.format === "translation") : items.grammar;

  const lines: string[] = [];
  lines.push(`# Verify lens — ${lens} — ${slug} (round ${round})`);
  lines.push("");
  lines.push(`<!-- domigo:verify ${lens} ${slug} items=${hash12} prompt=${pHash} round=${round} -->`);
  lines.push("");
  lines.push(fs.readFileSync(path.join(PROMPTS_DIR, `verify-${lens}.md`), "utf8").trimEnd());
  lines.push("");
  if (lens === "level-gloss") {
    lines.push(allowedVocabularyDigest(slug));
    lines.push("");
  }
  lines.push(`## Vocab items (${items.vocab.length})`);
  lines.push("");
  lines.push(renderTable(cols.vocab, items.vocab.map((it) => {
    const s = vocabSurface(it);
    return cols.vocab.map((c) => s[c] ?? "");
  })));
  lines.push("");
  lines.push(`## Grammar items (${grammarRows.length}${lens === "translation" ? " — translation format only" : ""})`);
  lines.push("");
  if (grammarRows.length > 0) {
    lines.push(renderTable(cols.grammar, grammarRows.map((it) => {
      const s = grammarSurface(it);
      return cols.grammar.map((c) => s[c] ?? "");
    })));
  } else {
    lines.push("_none_");
  }
  lines.push("");
  lines.push("## Output contract");
  lines.push("");
  lines.push(`Write \`content/corpus/units/${slug}/verify/${lens}.flags.json\`:`);
  lines.push("");
  lines.push("```jsonc");
  lines.push(`{
  "schema": "verify-flags@1",
  "slug": "${slug}",
  "lens": "${lens}",
  "itemsHash": "${hash12}",
  "promptHash": "${pHash}",
  "round": ${round},
  "by": "fable-lens-${lens}",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": ${items.vocab.length + grammarRows.length}, "flagged": 0 }
}`);
  lines.push("```");
  lines.push("");
  lines.push("A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).");
  lines.push("");
  return lines.join("\n");
}

export function runVerifyPrepare(slug: string): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const state = currentState(unitDir)?.state ?? "—";
  if (!["generated", "verified", "changes_requested", "validated", "review_ready"].includes(state)) {
    throw new Error(`${slug}: state is ${state} — run gen --ingest first`);
  }
  const hash12 = itemsHash12(slug);
  const round = nextRound(slug, hash12);
  for (const lens of LENSES) {
    const dest = path.join(unitDir, "verify", `brief.${lens}.md`);
    writeText(dest, renderLensBrief(slug, lens, hash12, round));
  }
  console.log(`verify briefs (round ${round}, items ${hash12}): ${LENSES.join(", ")}\n  → ${path.join(unitDir, "verify")}/brief.<lens>.md`);
}

// ---------------------------------------------------------------------------
// merge (pure core exported for tests)
// ---------------------------------------------------------------------------

export function mergeLensFlags(
  slug: string,
  lensFiles: VerifyFlagsT[],
  currentHash12: string,
  round: number,
): { merged: VerifyMerged; errors: string[] } {
  const errors: string[] = [];
  const present = new Set(lensFiles.map((f) => f.lens));
  for (const lens of LENSES) {
    if (!present.has(lens)) errors.push(`lens ${lens}: flags file missing — all four lenses are mandatory`);
  }
  const byItem: Record<string, MergedFlag[]> = {};
  let fixCount = 0;
  let warnCount = 0;
  const lenses: VerifyMerged["lenses"] = {};
  for (const f of lensFiles) {
    if (f.slug !== slug) errors.push(`lens ${f.lens}: slug says ${f.slug}`);
    if (f.itemsHash !== currentHash12) {
      errors.push(`lens ${f.lens}: STALE (flags for items ${f.itemsHash}, current ${currentHash12}) — re-run the lens`);
    }
    if (f.round !== round) errors.push(`lens ${f.lens}: round ${f.round} ≠ expected ${round}`);
    lenses[f.lens] = { by: f.by, flagged: f.flags.length };
    const seenKeys = new Set<string>();
    for (const flag of f.flags) {
      if (flag.key !== `${flag.kind}:${flag.itemId}`) {
        errors.push(`lens ${f.lens}: flag key ${flag.key} ≠ ${flag.kind}:${flag.itemId}`);
      }
      const dupKey = `${f.lens}|${flag.key}`;
      if (seenKeys.has(dupKey)) errors.push(`lens ${f.lens}: duplicate flag ${flag.key}`);
      seenKeys.add(dupKey);
      const merged: MergedFlag = { key: flag.key, kind: flag.kind, itemId: flag.itemId, severity: flag.severity, note: flag.note, lens: f.lens };
      const list = byItem[flag.itemId] ?? [];
      list.push(merged);
      byItem[flag.itemId] = list;
      if (flag.severity === "fix") fixCount += 1;
      else warnCount += 1;
    }
  }
  return {
    merged: {
      schema: "verify-merged@1",
      slug,
      round,
      itemsHash: currentHash12,
      lenses,
      byItem,
      fixCount,
      warnCount,
      escalated: [],
    },
    errors,
  };
}

export const VERIFY_LOOP_CAP = 3; // initial round + 2 fix loops

export function runVerifyIngest(slug: string, dryRun: boolean): void {
  const unitDir = path.join(UNITS_DIR, slug);
  const verifyDir = path.join(unitDir, "verify");
  const hash12 = itemsHash12(slug);
  const round = nextRound(slug, hash12);

  const lensFiles: VerifyFlagsT[] = [];
  for (const lens of LENSES) {
    const raw = readJsonIfExists<unknown>(path.join(verifyDir, `${lens}.flags.json`));
    if (raw === null) continue;
    lensFiles.push(VerifyFlags.parse(raw));
  }
  const { merged, errors } = mergeLensFlags(slug, lensFiles, hash12, round);
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ✗ ${e}`);
    throw new Error(`${slug}: verify ingest — ${errors.length} error(s)`);
  }

  const itemFlags = Object.values(merged.byItem).flat();
  const fixFlags = itemFlags.filter((f) => f.severity === "fix");

  if (merged.fixCount > 0 && round >= VERIFY_LOOP_CAP) {
    merged.escalated = fixFlags.map((f) => f.key).sort();
  }

  if (dryRun) {
    console.log(
      `verify ingest ${slug} (dry-run): round ${round} — ${merged.fixCount} fix, ${merged.warnCount} warn${merged.escalated.length > 0 ? `, ${merged.escalated.length} would escalate` : ""}`,
    );
    return;
  }
  writeJson(path.join(verifyDir, "verify.merged.json"), merged);

  if (merged.fixCount === 0) {
    appendTransition(unitDir, slug, {
      state: "verified",
      by: "pipeline",
      contentHash: itemsContentHash(readUnitItems(slug)),
      note: `verify round ${round}: 0 fix, ${merged.warnCount} warn`,
    });
    console.log(`verify ingest ${slug}: VERIFIED — round ${round}, 0 fix, ${merged.warnCount} warn`);
    return;
  }
  if (merged.escalated.length > 0) {
    appendTransition(unitDir, slug, {
      state: "verified",
      by: "pipeline",
      contentHash: itemsContentHash(readUnitItems(slug)),
      note: `verify round ${round}: ${merged.escalated.length} unresolved lens flag(s) ESCALATED to review; ${merged.warnCount} warn`,
    });
    console.log(
      `verify ingest ${slug}: loop cap reached — ${merged.escalated.length} fix flag(s) ESCALATED to the stage-8 review (forced flag blocks).`,
    );
    return;
  }
  console.log(
    `verify ingest ${slug}: round ${round} — ${merged.fixCount} fix flag(s) on ${Object.keys(merged.byItem).length} item(s).\n  next: pnpm content gen --prepare --unit ${slug} --fix   (fix loop ${round}/${VERIFY_LOOP_CAP - 1})`,
  );
}
