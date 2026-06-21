/**
 * Opt-in schema check for test@1 pilots (B2). NOT part of `pnpm content validate`.
 * Parses every test.json and reports schema violations. Reference-id resolution +
 * reading round-trip grading are covered by the app E2E (content-pipeline can't
 * import the loader/engine).
 *   pnpm content validate-test
 */
import fs from "node:fs";
import path from "node:path";
import { TestFile } from "@domigo/content-schema";
import { UNITS_DIR } from "./paths.ts";

export function runValidateTest(): void {
  let files = 0;
  let sections = 0;
  let fail = 0;
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
  }
  console.log(`test: ${files} file(s), ${sections} section(s), ${fail} failure(s)`);
  if (fail > 0) process.exit(1);
}
