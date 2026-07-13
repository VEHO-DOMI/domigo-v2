#!/usr/bin/env node
/**
 * E-4 blind-solve harness (A-4) — solve corpus items BLIND (student view only,
 * never the keys), grade every candidate through the REAL engine, triage the
 * divergences. Doctrine + triage classes: docs/handover/17_curation_standard.md.
 *
 * Modes:
 *   --no-llm    dry run: the item's own first full answer is the candidate.
 *               This is the KEY-SOLVABILITY audit — an authored key that does
 *               not grade "correct" through the frame's input shape is a
 *               defect (unreachable answer), reported as class "key-defect".
 *   --export-frames / --candidates   the SUBSCRIPTION path (no API key): a
 *               Claude Code session exports the student-view frames, fans them
 *               out to fresh-context subagents (each sees ONLY the frames —
 *               never keys, never the repo), collects their answers into one
 *               JSON file, and feeds it back for grading + triage. Billed to
 *               the Claude plan the session runs on, like SRDP's sandbox runner.
 *   (default)   live via ANTHROPIC_API_KEY: Claude answers each frame through
 *               the Anthropic SDK; candidates are triaged into class (a)
 *               missing-variant / (b) ambiguous-carrier / (c) noise.
 *
 * Usage (off-CI, run from repo root):
 *   node scripts/audit/blind-solve.ts --no-llm --grade all
 *   node scripts/audit/blind-solve.ts --grade g2 --export-frames /tmp/frames.json
 *   node scripts/audit/blind-solve.ts --grade g2 --candidates /tmp/answers.json
 *   ANTHROPIC_API_KEY=... node scripts/audit/blind-solve.ts --grade g2 --limit 50
 *
 * Flags:
 *   --grade g1|g2|g3|g4|all   unit scope by grade
 *   --unit <slug>             one unit (e.g. g2-u03)
 *   --only <itemId>           one item
 *   --items <file.json>       a JSON array of itemIds — the C-1 checkup gate
 *                             path (doc 21 §5.5): a composed checkup's exact
 *                             item set is exported and blind-solved offline
 *   --limit <n>               cap item count (after filtering)
 *   --model <id>              default claude-opus-4-8
 *   --effort low|medium|high  default low (routine solve work)
 *   --concurrency <n>         live-mode parallel requests, default 4
 *   --no-llm                  dry run (no API key needed)
 *   --export-frames <file>    write frames [{itemId, grade, prompt}] and exit
 *   --candidates <file>       grade+triage answers produced elsewhere:
 *                             {"<itemId>": [{"answer": "...", "confidence": 0.9}]}
 *
 * Outputs: content/build/audit/blind-solve/<scope>.json (+ worklist-<scope>.md
 * when findings exist). Live responses are cached in cache.json (gitignored)
 * keyed by (itemId, promptHash, model) so re-runs are free.
 *
 * The SDK is a ROOT devDependency only — `pnpm check:bundle` proves nothing of
 * this enters app chunks. Engine + pipeline are imported from source (node ≥22
 * type-stripping; realpaths live outside node_modules, so stripping applies).
 */
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildEngineInput,
  buildSolvePrompt,
  cannedCandidates,
  frameGrammarItem,
  frameVocabItem,
  SKIPPED_FORMATS,
  triage,
  type Frame,
  type GradedCandidate,
  type SolveCandidate,
  type Tier,
} from "../../packages/content-pipeline/src/blind-solve.ts";
import { corpusStamp } from "../../packages/content-pipeline/src/corpus-stamp.ts";
import { applyItemFixes, readUnitItems } from "../../packages/content-pipeline/src/gen-items.ts";
import { UNITS_DIR } from "../../packages/content-pipeline/src/paths.ts";
import { gradeGrammar, gradeVocab } from "../../packages/engine/src/index.ts";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = path.join(ROOT, "content", "build", "audit", "blind-solve");
const CACHE_PATH = path.join(OUT_DIR, "cache.json");

// $/MTok — for the run-cost receipt only; verify against current pricing.
const PRICES: Record<string, { input: number; output: number }> = {
  "claude-opus-4-8": { input: 5, output: 25 },
  "claude-sonnet-5": { input: 3, output: 15 },
  "claude-haiku-4-5": { input: 1, output: 5 },
  "claude-fable-5": { input: 10, output: 50 },
};

// ---------------------------------------------------------------------------
// args
// ---------------------------------------------------------------------------

interface Args {
  grade: string | null;
  unit: string | null;
  only: string | null;
  items: string | null;
  limit: number | null;
  model: string;
  effort: "low" | "medium" | "high";
  concurrency: number;
  noLlm: boolean;
  exportFrames: string | null;
  candidates: string | null;
}

function parseArgs(argv: string[]): Args {
  const a: Args = {
    grade: null,
    unit: null,
    only: null,
    items: null,
    limit: null,
    model: "claude-opus-4-8",
    effort: "low",
    concurrency: 4,
    noLlm: false,
    exportFrames: null,
    candidates: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i]!;
    const v = () => {
      const nv = argv[++i];
      if (nv === undefined) throw new Error(`${k} needs a value`);
      return nv;
    };
    if (k === "--grade") a.grade = v();
    else if (k === "--unit") a.unit = v();
    else if (k === "--only") a.only = v();
    else if (k === "--items") a.items = v();
    else if (k === "--limit") a.limit = Number(v());
    else if (k === "--model") a.model = v();
    else if (k === "--effort") a.effort = v() as Args["effort"];
    else if (k === "--concurrency") a.concurrency = Number(v());
    else if (k === "--no-llm") a.noLlm = true;
    else if (k === "--export-frames") a.exportFrames = v();
    else if (k === "--candidates") a.candidates = v();
    else throw new Error(`unknown flag ${k}`);
  }
  if (a.grade === null && a.unit === null && a.only === null && a.items === null) {
    throw new Error("scope required: --grade g1|g2|g3|g4|all, --unit <slug>, --only <itemId>, or --items <file.json>");
  }
  if (a.grade !== null && !/^(g[1-4]|all)$/.test(a.grade)) throw new Error(`bad --grade ${a.grade}`);
  if (!["low", "medium", "high"].includes(a.effort)) throw new Error(`bad --effort ${a.effort}`);
  if ([a.noLlm, a.exportFrames !== null, a.candidates !== null].filter(Boolean).length > 1) {
    throw new Error("--no-llm, --export-frames, and --candidates are mutually exclusive");
  }
  return a;
}

// ---------------------------------------------------------------------------
// corpus walk (overlay-applied view — same semantics as runtime + E-2)
// ---------------------------------------------------------------------------

interface Entry {
  slug: string;
  kind: "vocab" | "grammar";
  item: VocabItem | GrammarItem;
  frame: Frame;
  fullAnswers: string[];
}

function collectEntries(args: Args): { entries: Entry[]; skipped: Record<string, number> } {
  // --items: an explicit id set (a composed checkup, doc 21 §5.5). The walk
  // stays the overlay-applied corpus view; the set only FILTERS it.
  const itemSet: Set<string> | null =
    args.items !== null ? new Set(JSON.parse(fs.readFileSync(args.items, "utf8")) as string[]) : null;
  const slugs = fs
    .readdirSync(UNITS_DIR)
    .filter((s) => /^g[1-4]-u\d{2}$/.test(s))
    .filter((s) => (args.unit !== null ? s === args.unit : true))
    .filter((s) => (args.grade !== null && args.grade !== "all" ? s.startsWith(args.grade) : true))
    .sort();
  const entries: Entry[] = [];
  const skipped: Record<string, number> = {};
  for (const slug of slugs) {
    const items = applyItemFixes(slug, readUnitItems(slug));
    for (const item of items.vocab) {
      entries.push({
        slug,
        kind: "vocab",
        item,
        frame: frameVocabItem(item),
        fullAnswers: item.sAnswers.filter((x) => x.tier === "full").map((x) => x.text),
      });
    }
    for (const item of items.grammar) {
      const frame = frameGrammarItem(item);
      if (frame === null) {
        if (SKIPPED_FORMATS.has(item.format)) skipped[item.format] = (skipped[item.format] ?? 0) + 1;
        continue;
      }
      entries.push({
        slug,
        kind: "grammar",
        item,
        frame,
        fullAnswers: item.answers.filter((x) => x.tier === "full").map((x) => x.text),
      });
    }
  }
  let filtered = args.only !== null ? entries.filter((e) => e.item.id === args.only) : entries;
  if (itemSet !== null) {
    filtered = filtered.filter((e) => itemSet.has(e.item.id));
    const found = new Set(filtered.map((e) => e.item.id));
    const missing = [...itemSet].filter((id) => !found.has(id));
    if (missing.length > 0) {
      console.error(`  ! ${missing.length} requested item(s) not in the (frameable) corpus: ${missing.slice(0, 5).join(", ")}${missing.length > 5 ? ", …" : ""}`);
    }
  }
  if (args.limit !== null) filtered = filtered.slice(0, args.limit);
  return { entries: filtered, skipped };
}

// ---------------------------------------------------------------------------
// grading + triage
// ---------------------------------------------------------------------------

function gradeCandidate(entry: Entry, answer: string): Tier {
  if (entry.kind === "vocab") return gradeVocab(entry.item as VocabItem, answer).tier;
  return gradeGrammar(entry.item as GrammarItem, buildEngineInput(entry.frame, answer)).tier;
}

interface Finding {
  itemId: string;
  slug: string;
  format: string;
  classes: string[];
  fullAnswers: string[];
  candidates: GradedCandidate[];
}

// ---------------------------------------------------------------------------
// live solver (Anthropic SDK; cached)
// ---------------------------------------------------------------------------

const CANDIDATES_SCHEMA = {
  type: "object",
  properties: {
    candidates: {
      type: "array",
      items: {
        type: "object",
        properties: {
          answer: { type: "string" },
          confidence: { type: "number" },
        },
        required: ["answer", "confidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["candidates"],
  additionalProperties: false,
} as const;

const LEVEL: Record<string, string> = { g1: "A1", g2: "A1+", g3: "A2", g4: "A2+/B1" };

function systemPrompt(grade: string): string {
  return [
    `You are simulating a diligent Austrian AHS student (grade ${grade.slice(1)}, MORE! coursebook, CEFR ~${LEVEL[grade] ?? "A2"}) solving ONE English exercise blind — you see exactly what the student sees, nothing else.`,
    "Return your best 1–3 candidate answers:",
    "- candidates[0] is what you would actually submit.",
    "- Add a 2nd/3rd candidate ONLY if it is genuinely defensible as also correct for this exercise.",
    '- confidence = your probability (0–1) that the candidate is an accepted correct answer.',
    "- Each answer is the exact text to type into the box(es), or the exact text of one option for choice exercises.",
    '- For multiple boxes, join the fills with " | " in order.',
  ].join("\n");
}

type Cache = Record<string, SolveCandidate[]>;

function loadCache(): Cache {
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as Cache;
  } catch {
    return {};
  }
}

function cacheKey(itemId: string, prompt: string, model: string): string {
  const h = createHash("sha256").update(prompt).digest("hex").slice(0, 16);
  return `${itemId}::${h}::${model}`;
}

interface Usage {
  input: number;
  output: number;
  calls: number;
  cacheHits: number;
}

async function makeLiveSolver(args: Args, usage: Usage) {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic();
  const cache = loadCache();
  const saveCache = () => {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    fs.writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
  };
  let sinceSave = 0;

  return async (entry: Entry): Promise<SolveCandidate[]> => {
    const prompt = buildSolvePrompt(entry.frame);
    const key = cacheKey(entry.item.id, prompt, args.model);
    const hit = cache[key];
    if (hit !== undefined) {
      usage.cacheHits++;
      return hit;
    }
    const grade = entry.slug.slice(0, 2);
    const res = await client.messages.create({
      model: args.model,
      max_tokens: 8192,
      thinking: { type: "adaptive" },
      output_config: { effort: args.effort, format: { type: "json_schema", schema: CANDIDATES_SCHEMA } },
      system: systemPrompt(grade),
      messages: [{ role: "user", content: prompt }],
    });
    usage.calls++;
    usage.input += res.usage.input_tokens;
    usage.output += res.usage.output_tokens;
    if (res.stop_reason !== "end_turn") {
      console.error(`  ! ${entry.item.id}: stop_reason=${res.stop_reason} — skipping`);
      return [];
    }
    const text = res.content.find((b) => b.type === "text")?.text ?? "";
    let candidates: SolveCandidate[] = [];
    try {
      const parsed = JSON.parse(text) as { candidates: SolveCandidate[] };
      candidates = parsed.candidates
        .slice(0, 3)
        .map((c) => ({ answer: String(c.answer), confidence: Math.min(1, Math.max(0, Number(c.confidence))) }));
    } catch {
      console.error(`  ! ${entry.item.id}: unparseable response — skipping`);
      return [];
    }
    cache[key] = candidates;
    if (++sinceSave >= 20) {
      saveCache();
      sinceSave = 0;
    }
    return candidates;
  };
}

async function mapPool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx]!);
      }
    }),
  );
  return out;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const { entries, skipped } = collectEntries(args);
  const scope =
    args.only ??
    args.unit ??
    args.grade ??
    (args.items !== null ? `items-${path.basename(args.items).replace(/\.json$/i, "")}` : "scope");
  const mode = args.noLlm ? "no-llm" : args.candidates !== null ? "candidates-file" : "live";
  console.log(`blind-solve — ${mode} · scope=${scope} · ${entries.length} items` +
    (Object.keys(skipped).length > 0 ? ` (skipped: ${Object.entries(skipped).map(([f, n]) => `${f}×${n}`).join(", ")})` : ""));

  // --export-frames: emit the student view for external solving, then stop.
  if (args.exportFrames !== null) {
    const frames = entries.map((e) => ({
      itemId: e.item.id,
      grade: e.slug.slice(0, 2),
      prompt: buildSolvePrompt(e.frame),
    }));
    fs.writeFileSync(args.exportFrames, `${JSON.stringify(frames, null, 1)}\n`);
    console.log(`frames → ${args.exportFrames} (${frames.length}); solve them fresh-context, then re-run with --candidates`);
    return;
  }

  // --candidates: answers were produced elsewhere (fresh-context subagents).
  const fileCandidates: Record<string, SolveCandidate[]> | null =
    args.candidates !== null ? (JSON.parse(fs.readFileSync(args.candidates, "utf8")) as Record<string, SolveCandidate[]>) : null;
  if (fileCandidates !== null) {
    const missing = entries.filter((e) => fileCandidates[e.item.id] === undefined).length;
    if (missing > 0) console.log(`  ! ${missing} item(s) in scope have no candidates in the file — counted as unanswered`);
  }

  const usage: Usage = { input: 0, output: 0, calls: 0, cacheHits: 0 };
  const solve = args.noLlm
    ? async (e: Entry): Promise<SolveCandidate[]> => cannedCandidates(e.fullAnswers)
    : fileCandidates !== null
      ? async (e: Entry): Promise<SolveCandidate[]> =>
          (fileCandidates[e.item.id] ?? []).slice(0, 3).map((c) => ({
            answer: String(c.answer),
            confidence: Math.min(1, Math.max(0, Number(c.confidence))),
          }))
      : await makeLiveSolver(args, usage);

  const findings: Finding[] = [];
  const tierTotals: Record<Tier, number> = { correct: 0, partial: 0, close: 0, wrong: 0 };
  let done = 0;

  await mapPool(entries, args.noLlm || fileCandidates !== null ? 1 : args.concurrency, async (entry) => {
    const candidates = await solve(entry);
    const graded: GradedCandidate[] = candidates.map((c) => ({
      ...c,
      tier: gradeCandidate(entry, c.answer),
    }));
    const top = [...graded].sort((a, b) => b.confidence - a.confidence)[0];
    if (top !== undefined) tierTotals[top.tier]++;

    const classes: string[] = [];
    if (args.noLlm) {
      // key-solvability invariant: the authored key MUST grade correct
      if (graded.some((c) => c.tier !== "correct")) classes.push("key-defect");
    } else {
      const t = triage(graded, entry.fullAnswers.length);
      if (t.missingVariant) classes.push("missing-variant");
      if (t.ambiguousCarrier) classes.push("ambiguous-carrier");
    }
    if (classes.length > 0) {
      findings.push({
        itemId: entry.item.id,
        slug: entry.slug,
        format: entry.frame.format,
        classes,
        fullAnswers: entry.fullAnswers,
        candidates: graded,
      });
    }
    done++;
    if (done % 200 === 0 || done === entries.length) {
      console.log(`  ${done}/${entries.length}${usage.calls > 0 ? ` · ${usage.calls} calls · ${usage.cacheHits} cache hits` : ""}`);
    }
  });

  findings.sort((a, b) => a.itemId.localeCompare(b.itemId));

  const price = PRICES[args.model];
  const costUsd =
    mode === "live" && price !== undefined
      ? (usage.input / 1e6) * price.input + (usage.output / 1e6) * price.output
      : null;

  const report = {
    schema: "blind-solve@2",
    // Freshness stamp (V-2b): binds this committed report to the exact corpus state.
    generatedAt: new Date().toISOString(),
    corpusHash: corpusStamp(),
    mode,
    model: mode === "live" ? args.model : mode === "candidates-file" ? "external (fresh-context subagents)" : null,
    effort: mode === "live" ? args.effort : null,
    scope,
    totals: {
      items: entries.length,
      findings: findings.length,
      byClass: findings.reduce<Record<string, number>>((acc, f) => {
        for (const c of f.classes) acc[c] = (acc[c] ?? 0) + 1;
        return acc;
      }, {}),
      topCandidateTiers: tierTotals,
      skippedFormats: skipped,
    },
    usage: mode === "live" ? { ...usage, costUsd } : null,
    findings,
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const stem = `${scope}${mode === "no-llm" ? ".dry" : mode === "candidates-file" ? ".sub" : ""}`;
  const reportPath = path.join(OUT_DIR, `${stem}.json`);
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`report → ${path.relative(ROOT, reportPath)}`);

  if (findings.length > 0) {
    const lines = [
      `# blind-solve worklist — ${scope} (${mode})`,
      "",
      `${findings.length} finding(s) over ${entries.length} items.`,
      "",
    ];
    for (const f of findings) {
      lines.push(`## ${f.itemId} — ${f.classes.join(", ")} (${f.format})`);
      lines.push(`- authored full answers: ${f.fullAnswers.map((x) => `\`${x}\``).join(" · ")}`);
      for (const c of f.candidates) {
        lines.push(`- candidate \`${c.answer}\` (conf ${c.confidence.toFixed(2)}) ⇒ **${c.tier}**`);
      }
      lines.push("");
    }
    const wlPath = path.join(OUT_DIR, `worklist-${stem}.md`);
    fs.writeFileSync(wlPath, `${lines.join("\n")}\n`);
    console.log(`worklist → ${path.relative(ROOT, wlPath)}`);
  }

  const classLine = Object.entries(report.totals.byClass)
    .map(([c, n]) => `${c}: ${n}`)
    .join(" · ");
  console.log(
    `done — ${entries.length} items · ${findings.length} findings${classLine ? ` (${classLine})` : ""}` +
      (costUsd !== null ? ` · cost ~$${costUsd.toFixed(2)} (${usage.input} in / ${usage.output} out tokens)` : ""),
  );
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
