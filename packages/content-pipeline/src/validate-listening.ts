/**
 * Opt-in gate for listening@1 files (B3 + the W-0 wave program). NOT part of
 * `pnpm content validate` (monolithic on vocab/grammar). Grading-key correctness
 * is covered by the app E2E (each item POST-graded with its authored answer).
 *
 * Beyond the schema parse, the STRATEGY LINTS (wave-mandated fields; enforced
 * when present, so pre-wave files stay valid until retrofitted):
 *   V-LC1  cue.quote appears VERBATIM in the task transcript (anti-hallucination
 *          — feedback may only quote audio that exists)
 *   V-LC2  phase discipline: when any item in a task carries `phase`, the task
 *          has 1–2 gist items and every item carries a phase
 *   V-LC3  echo-lure firewall: distractorMeta is parallel to distractors, and an
 *          MC item at difficulty >= 2 carries >= 1 lure-tagged distractor (the
 *          "you heard the word, wrong question" trap IS the pedagogy)
 *   V-LC4  trickDe budget + register: <= 12 words, du-form (no mid-sentence
 *          Sie/Ihnen/Ihr*), and requires `cue` (a move without its moment
 *          teaches nothing)
 *   V-LC5  (WARN-ONLY) prompt/distractor level probe: unknown tokens vs the
 *          unit's cumulative matcher are reported, never fatal (speaker names +
 *          era differences make this advisory; the authoring skill mandates
 *          clean prompts for new waves)
 * Plus a strategy-coverage line: items carrying the full set / total.
 *   pnpm content validate-listening
 */
import fs from "node:fs";
import path from "node:path";
import { ListeningFile } from "@domigo/content-schema";
import { buildAllowedMatcher } from "./cumulative-bank.ts";
import { UNITS_DIR } from "./paths.ts";

const SIE_MID = /(?<!^)(?<![.!?]\s)(Sie|Ihnen|Ihr(?:e|em|en|er|es)?)\b/;

/** Mid-sentence Sie-form scan (sentence-initial stays a human call, as in VS-3). */
export function duFormViolation(text: string): boolean {
  return SIE_MID.test(text);
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function runValidateListening(): void {
  let files = 0;
  let items = 0;
  let fail = 0;
  let strategyComplete = 0;
  let levelWarns = 0;
  const errors: string[] = [];
  for (const slug of fs.readdirSync(UNITS_DIR).sort()) {
    const p = path.join(UNITS_DIR, slug, "listening.json");
    if (!fs.existsSync(p)) continue;
    files++;
    const parsed = ListeningFile.safeParse(JSON.parse(fs.readFileSync(p, "utf8")));
    if (!parsed.success) {
      fail++;
      console.error(
        `✗ ${slug}/listening.json:\n${parsed.error.issues.map((i) => `   ${i.path.join(".")}: ${i.message}`).join("\n")}`,
      );
      continue;
    }
    let matcher: ReturnType<typeof buildAllowedMatcher> | null = null;
    try {
      matcher = buildAllowedMatcher(slug);
    } catch {
      /* probe unavailable — warnings skipped */
    }
    for (const task of parsed.data.tasks) {
      const phased = task.items.filter((it) => it.phase !== undefined);
      if (phased.length > 0) {
        const gist = task.items.filter((it) => it.phase === "gist").length;
        if (gist < 1 || gist > 2) errors.push(`${slug}: V-LC2 — ${task.id}: ${gist} gist item(s) (want 1–2)`);
        if (phased.length !== task.items.length) {
          errors.push(`${slug}: V-LC2 — ${task.id}: ${task.items.length - phased.length} item(s) missing \`phase\` while others carry it`);
        }
      }
      for (const it of task.items) {
        items++;
        if (it.cue && !task.transcript.includes(it.cue.quote)) {
          errors.push(`${slug}: V-LC1 — ${it.id}: cue.quote not verbatim in the transcript (${JSON.stringify(it.cue.quote.slice(0, 50))})`);
        }
        if (it.distractorMeta) {
          if (it.distractorMeta.length !== it.distractors.length) {
            errors.push(`${slug}: V-LC3 — ${it.id}: distractorMeta has ${it.distractorMeta.length} entrie(s) for ${it.distractors.length} distractor(s)`);
          }
          if (it.format === "multiple-choice" && it.difficulty >= 2 && !it.distractorMeta.some((m) => m.lure !== undefined)) {
            errors.push(`${slug}: V-LC3 — ${it.id}: MC at difficulty ${it.difficulty} needs >=1 lure-tagged distractor`);
          }
        }
        if (it.trickDe !== undefined) {
          if (wordCount(it.trickDe) > 12) errors.push(`${slug}: V-LC4 — ${it.id}: trickDe is ${wordCount(it.trickDe)} words (max 12)`);
          if (duFormViolation(it.trickDe)) errors.push(`${slug}: V-LC4 — ${it.id}: trickDe breaks du-form (mid-sentence Sie/Ihnen/Ihr*)`);
          if (!it.cue) errors.push(`${slug}: V-LC4 — ${it.id}: trickDe without cue (a move needs its moment)`);
        }
        if (it.cue && it.phase !== undefined && it.trickDe !== undefined) strategyComplete++;
        if (matcher && it.prompt.lang === "en") {
          const unknown = matcher.unknownTokens([it.prompt.text, ...it.distractors].join(" "));
          if (unknown.length > 0) {
            levelWarns++;
            console.warn(`  ℹ ${slug}: V-LC5 — ${it.id}: out-of-bank token(s) in prompt/distractors [${unknown.join(", ")}] (advisory)`);
          }
        }
      }
    }
  }
  for (const e of errors) console.error(`  ✗ ${e}`);
  if (errors.length > 0) fail += 1;
  console.log(
    `listening: ${files} file(s), ${items} item(s), ${errors.length} strategy error(s), ${levelWarns} level warn(s), ${fail} failure(s); strategy-complete ${strategyComplete}/${items}`,
  );
  if (fail > 0) process.exit(1);
}
