/**
 * Opt-in schema check for listening@1 pilots (B3). NOT part of `pnpm content validate`
 * (which is monolithic on vocab/grammar and structurally never reads these files).
 * Parses every listening.json and reports schema violations. Grading-key correctness
 * is covered by the app E2E (each item is POST-graded with its authored answer).
 *   pnpm content validate-listening
 */
import fs from "node:fs";
import path from "node:path";
import { ListeningFile } from "@domigo/content-schema";
import { UNITS_DIR } from "./paths.ts";

export function runValidateListening(): void {
  let files = 0;
  let items = 0;
  let fail = 0;
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
    items += parsed.data.tasks.reduce((n, t) => n + t.items.length, 0);
  }
  console.log(`listening: ${files} file(s), ${items} item(s), ${fail} failure(s)`);
  if (fail > 0) process.exit(1);
}
