/**
 * Opt-in gate for test@1 files (B2 + the W-0 wave program). NOT part of
 * `pnpm content validate`. Reference-id resolution + reading round-trip grading
 * are covered by the app E2E (content-pipeline can't import the loader/engine).
 *
 * Beyond the schema parse, the WAVE LINTS (enforced when the fields are present):
 *   V-LC1r reading cue.quote appears VERBATIM in the section's passage
 *   V-LC4r reading trickDe: <= 12 words, du-form, requires cue
 *   V-EX1  exemplar callout quotes appear VERBATIM in exemplar.textEn
 *   V-EX2  exemplar.textEn is FULLY in-bank at the unit (no gloss escape — a
 *          model answer the student can't fully read is not a model answer);
 *          uses the cumulative matcher (the probe; VS-2-grade gating happens at
 *          authoring review)
 *   V-CK1  checklistDe items are du-form
 *   pnpm content validate-test
 */
import fs from "node:fs";
import path from "node:path";
import { TestFile } from "@domigo/content-schema";
import { buildAllowedMatcher } from "./cumulative-bank.ts";
import { duFormViolation, wordCount } from "./validate-listening.ts";
import { UNITS_DIR } from "./paths.ts";

export function runValidateTest(): void {
  let files = 0;
  let sections = 0;
  let fail = 0;
  const errors: string[] = [];
  for (const slug of fs.readdirSync(UNITS_DIR).sort()) {
    const p = path.join(UNITS_DIR, slug, "test.json");
    if (!fs.existsSync(p)) continue;
    files++;
    const parsed = TestFile.safeParse(JSON.parse(fs.readFileSync(p, "utf8")));
    if (!parsed.success) {
      fail++;
      console.error(
        `✗ ${slug}/test.json:\n${parsed.error.issues.map((i) => `   ${i.path.join(".")}: ${i.message}`).join("\n")}`,
      );
      continue;
    }
    sections += parsed.data.test.sections.length;
    for (const sec of parsed.data.test.sections) {
      if (sec.kind === "reading") {
        for (const it of sec.items) {
          if (it.cue && !sec.passage.includes(it.cue.quote)) {
            errors.push(`${slug}: V-LC1r — ${it.id}: cue.quote not verbatim in the passage (${JSON.stringify(it.cue.quote.slice(0, 50))})`);
          }
          if (it.trickDe !== undefined) {
            if (wordCount(it.trickDe) > 12) errors.push(`${slug}: V-LC4r — ${it.id}: trickDe is ${wordCount(it.trickDe)} words (max 12)`);
            if (duFormViolation(it.trickDe)) errors.push(`${slug}: V-LC4r — ${it.id}: trickDe breaks du-form`);
            if (!it.cue) errors.push(`${slug}: V-LC4r — ${it.id}: trickDe without cue`);
          }
        }
      }
      if (sec.kind === "writing") {
        for (const c of sec.checklistDe ?? []) {
          if (duFormViolation(c)) errors.push(`${slug}: V-CK1 — ${sec.promptId}: checklist item breaks du-form (${JSON.stringify(c.slice(0, 40))})`);
        }
        if (sec.exemplar) {
          for (const call of sec.exemplar.calloutsDe) {
            if (!sec.exemplar.textEn.includes(call.quote)) {
              errors.push(`${slug}: V-EX1 — ${sec.promptId}: callout quote not in exemplar.textEn (${JSON.stringify(call.quote.slice(0, 40))})`);
            }
            if (duFormViolation(call.whyDe)) errors.push(`${slug}: V-EX1 — ${sec.promptId}: callout whyDe breaks du-form`);
          }
          try {
            const matcher = buildAllowedMatcher(slug);
            const unknown = matcher.unknownTokens(sec.exemplar.textEn);
            if (unknown.length > 0) {
              errors.push(`${slug}: V-EX2 — ${sec.promptId}: exemplar.textEn has out-of-bank word(s) [${unknown.join(", ")}] — a model answer must be fully readable`);
            }
          } catch (e) {
            errors.push(`${slug}: V-EX2 — matcher unavailable: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      }
    }
  }
  for (const e of errors) console.error(`  ✗ ${e}`);
  if (errors.length > 0) fail += 1;
  console.log(`test: ${files} file(s), ${sections} section(s), ${errors.length} wave error(s), ${fail} failure(s)`);
  if (fail > 0) process.exit(1);
}
