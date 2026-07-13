#!/usr/bin/env node
/**
 * C-1 · verify-checkup — the offline exit-criteria receipt (BLUEPRINT_V2 Part V
 * step 13; doc 21 §10). Runs WITHOUT a database:
 *
 *   1. compose g2-u06 (the §8 calibration unit) under a FIXED seed → Σ=20,
 *      one item = one point, no duplicates, deterministic re-compose
 *   2. corpus sweep: EVERY approved unit composes /20 under its grade preset
 *   3. self-grade sweep: every composed item's own primary full answer
 *      round-trips "correct" through the REAL engine, in the SAME pool the
 *      checkup asks (carrier / definition / direction-aware translation) —
 *      the deterministic tier of the §5.5 gate
 *   4. scoring fixture: a hand-computed half-credit sitting scores exactly
 *      16 / 20 (retries ignored, blanks 0)
 *   5. tamper check: a wrong answer must NOT grade correct, and an unfillable
 *      preset must fail LOUDLY — proves the green light can turn red
 *
 * Prints a receipt table; exits non-zero on any failure. Engine + compose are
 * imported from source like scripts/audit/blind-solve.ts (node type-stripping;
 * realpaths outside node_modules).
 */
import { composeCheckup, GRADE_STRUCTURES } from "../apps/web/lib/checkup.ts";
import {
  checkupVocabPool,
  scoreCheckup,
  CHECKUP_TOTAL,
} from "../packages/db/src/checkup.ts";
import { listApprovedUnits, loadUnit } from "../packages/content-loader/src/index.ts";
import { gradeGrammar, gradeVocab, vocabAnswers } from "../packages/engine/src/index.ts";
import { buildEngineInput, frameGrammarItem } from "../packages/content-pipeline/src/blind-solve.ts";

const rows = [];
let failures = 0;

function check(name, ok, detail = "") {
  rows.push({ check: name, result: ok ? "PASS" : "FAIL", detail });
  if (!ok) failures++;
}

const gradeOf = (slug) => Number(slug[1]);

// ── 1 · the calibration compose (g2-u06, fixed seed) ─────────────────────────
const SEED = "c1-verify";
const cal = composeCheckup("g2-u06", 2, SEED);
check("g2-u06 composes (seed c1-verify)", cal.ok, cal.ok ? "" : cal.errors.join(" · "));
if (cal.ok) {
  const total = cal.sections.reduce((s, x) => s + x.sectionConfig.points, 0);
  check(`g2-u06 Σ = ${CHECKUP_TOTAL}`, total === CHECKUP_TOTAL, `Σ=${total}`);
  check(
    "one item = one point, every section",
    cal.sections.every((s) => s.itemIds.length === s.sectionConfig.points),
    cal.sections.map((s) => `${s.sectionConfig.checkupKind}:${s.itemIds.length}/${s.sectionConfig.points}`).join(" "),
  );
  const all = cal.sections.flatMap((s) => s.itemIds);
  check("no duplicate items on the paper", new Set(all).size === all.length);
  const again = composeCheckup("g2-u06", 2, SEED);
  check("deterministic under the same seed", JSON.stringify(cal) === JSON.stringify(again));
}

// ── 2+3 · corpus sweep + self-grade sweep (the §5.5 deterministic tier) ──────
const slugs = listApprovedUnits();
let composedUnits = 0;
let selfGraded = 0;
let selfGradeFails = [];
const composeFails = [];

for (const slug of slugs) {
  const res = composeCheckup(slug, gradeOf(slug), `verify-${slug}`);
  if (!res.ok) {
    composeFails.push(`${slug}: ${res.errors.join(" · ")}`);
    continue;
  }
  const total = res.sections.reduce((s, x) => s + x.sectionConfig.points, 0);
  if (total !== CHECKUP_TOTAL) {
    composeFails.push(`${slug}: Σ=${total}`);
    continue;
  }
  composedUnits++;

  const unit = loadUnit(slug);
  const vocabById = new Map(unit.vocab.map((v) => [v.id, v]));
  const grammarById = new Map(unit.grammar.map((g) => [g.id, g]));

  for (const sec of res.sections) {
    for (const [i, id] of sec.itemIds.entries()) {
      if (sec.kind === "vocab") {
        const item = vocabById.get(id);
        if (!item) { selfGradeFails.push(`${id}: not in unit`); continue; }
        const pool = checkupVocabPool(sec.sectionConfig, i, sec.itemIds.length);
        const key = vocabAnswers(item, pool).find((a) => a.tier === "full")?.text ?? "";
        const tier = gradeVocab(item, key, pool).tier;
        if (tier !== "correct") selfGradeFails.push(`${id} [${pool}] "${key}" ⇒ ${tier}`);
        else selfGraded++;
      } else {
        const item = grammarById.get(id);
        if (!item) { selfGradeFails.push(`${id}: not in unit`); continue; }
        const frame = frameGrammarItem(item);
        if (frame === null) { selfGradeFails.push(`${id}: allowlisted format ${item.format} not frameable`); continue; }
        const key = item.answers.find((a) => a.tier === "full")?.text ?? "";
        const tier = gradeGrammar(item, buildEngineInput(frame, key)).tier;
        if (tier !== "correct") selfGradeFails.push(`${id} [${item.format}] "${key}" ⇒ ${tier}`);
        else selfGraded++;
      }
    }
  }
}
check(`corpus sweep: all ${slugs.length} approved units compose /20`, composeFails.length === 0,
  composeFails.length > 0 ? composeFails.slice(0, 3).join(" · ") : `${composedUnits} units`);
check(`self-grade sweep: every composed item's key ⇒ correct (same pool)`, selfGradeFails.length === 0,
  selfGradeFails.length > 0 ? `${selfGradeFails.length} fail(s): ${selfGradeFails.slice(0, 3).join(" · ")}` : `${selfGraded} items round-tripped`);

// ── 4 · scoring fixture (hand-computed half-credit sitting) ──────────────────
// Paper 8+6+6. A: 6 correct + 1 partial + 1 wrong = 6.5/8 · B: 6 correct = 6/6
// C: 3 correct + 1 close + 2 blank = 3.5/6 → total 16/20. A retry on the wrong
// item must NOT change anything.
{
  const t = (s) => new Date(2026, 8, 15, 10, 0, s);
  const ids = (p, n) => Array.from({ length: n }, (_, i) => `${p}${i}`);
  const sections = [
    { position: 0, itemIds: ids("a", 8), points: 8 },
    { position: 1, itemIds: ids("b", 6), points: 6 },
    { position: 2, itemIds: ids("c", 6), points: 6 },
  ];
  const attempts = [
    ...ids("a", 6).map((id, i) => ({ itemId: id, tier: "correct", createdAt: t(i) })),
    { itemId: "a6", tier: "partial", createdAt: t(6) },
    { itemId: "a7", tier: "wrong", createdAt: t(7) },
    { itemId: "a7", tier: "correct", createdAt: t(99) }, // retry — must not count
    ...ids("b", 6).map((id, i) => ({ itemId: id, tier: "correct", createdAt: t(10 + i) })),
    ...ids("c", 3).map((id, i) => ({ itemId: id, tier: "correct", createdAt: t(20 + i) })),
    { itemId: "c3", tier: "close", createdAt: t(23) },
    // c4, c5 unanswered — 0 against the full section
  ];
  const score = scoreCheckup(sections, attempts);
  check("scoring fixture: 16 / 20 exactly", score.points === 16 && score.outOf === 20,
    `got ${score.points} / ${score.outOf} (per section: ${score.perSection.map((s) => `${s.points}/${s.outOf}`).join(" · ")})`);
  check("per-section half-credits: 6.5 · 6 · 3.5",
    score.perSection[0].points === 6.5 && score.perSection[1].points === 6 && score.perSection[2].points === 3.5);
}

// ── 5 · tamper checks — the red light must be reachable ─────────────────────
{
  const unit = loadUnit("g2-u06");
  const item = unit.vocab[0];
  const tier = gradeVocab(item, "zzz-definitely-wrong-zzz", "carrier").tier;
  check("tamper: a wrong answer does NOT grade correct", tier !== "correct", `⇒ ${tier}`);
  const impossible = composeCheckup("g2-u06", 2, "seed", { presets: [{ checkupKind: "grammar", points: 50 }] });
  check("tamper: an unfillable preset fails LOUDLY", !impossible.ok && impossible.errors.some((e) => e.includes("only")),
    impossible.ok ? "composed?!" : impossible.errors[0]);
}

// ── receipt ───────────────────────────────────────────────────────────────────
const w = Math.max(...rows.map((r) => r.check.length));
console.log("\nC-1 verify-checkup receipt");
console.log("─".repeat(w + 30));
for (const r of rows) {
  console.log(`${r.result === "PASS" ? "✓" : "✗"} ${r.result}  ${r.check.padEnd(w)}  ${r.detail}`);
}
console.log("─".repeat(w + 30));
console.log(
  `${rows.length - failures}/${rows.length} checks passed · seed "${SEED}" · presets: g1..g4 Σ=` +
    [1, 2, 3, 4].map((g) => GRADE_STRUCTURES[g].reduce((s, p) => s + p.points, 0)).join("/"),
);
if (failures > 0) {
  console.error(`\n${failures} check(s) FAILED`);
  process.exit(1);
}
