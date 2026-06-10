/**
 * `content validate` — deterministic checks over COMMITTED artifacts only.
 * Runs in CI (no iCloud sources needed). Red blocks merge.
 *
 * Stage-2 scope: wordbank schema conformance, slug/dir + id-prefix agreement,
 * corpus-wide id uniqueness, per-grade unit coverage and totals. The full
 * V1–V22 item validators land with pipeline stages 5–7.
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade } from "@domigo/content-schema";
import { GRADES, UNITS_PER_GRADE, WordBank, unitIdPrefix, unitSlug } from "@domigo/content-schema";
import { readJsonIfExists } from "./json.ts";
import { UNITS_DIR } from "./paths.ts";

/** Master-list self-declared totals (also asserted at parse time in stage 2). */
const GRADE_TOTALS: Record<Grade, { wordfile: number; phrase: number }> = {
  1: { wordfile: 303, phrase: 483 },
  2: { wordfile: 198, phrase: 413 },
  3: { wordfile: 143, phrase: 456 },
  4: { wordfile: 48, phrase: 402 },
};

export function runValidate(): void {
  const errors: string[] = [];
  const seenIds = new Map<string, string>();
  const counts: Record<Grade, { wordfile: number; phrase: number; units: Set<number> }> = {
    1: { wordfile: 0, phrase: 0, units: new Set() },
    2: { wordfile: 0, phrase: 0, units: new Set() },
    3: { wordfile: 0, phrase: 0, units: new Set() },
    4: { wordfile: 0, phrase: 0, units: new Set() },
  };

  if (!fs.existsSync(UNITS_DIR)) {
    console.error("content validate: no corpus on disk (content/corpus/units missing)");
    process.exitCode = 1;
    return;
  }

  const dirs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => fs.statSync(path.join(UNITS_DIR, n)).isDirectory())
    .sort();

  for (const dir of dirs) {
    const bankPath = path.join(UNITS_DIR, dir, "wordbank.json");
    const raw = readJsonIfExists<unknown>(bankPath);
    if (raw === null) {
      errors.push(`${dir}: missing wordbank.json`);
      continue;
    }
    const parsed = WordBank.safeParse(raw);
    if (!parsed.success) {
      errors.push(`${dir}: schema violation — ${parsed.error.issues[0]?.message ?? "unknown"} at ${parsed.error.issues[0]?.path.join(".") ?? "?"}`);
      continue;
    }
    const bank = parsed.data;
    if (bank.slug !== dir) errors.push(`${dir}: slug field says ${bank.slug}`);
    if (unitSlug(bank.grade, bank.unit) !== dir) errors.push(`${dir}: grade/unit fields disagree with dir name`);

    const prefix = unitIdPrefix(bank.grade, bank.unit);
    for (const entry of bank.entries) {
      if (!entry.id.startsWith(`${prefix}.w.`)) {
        errors.push(`${dir}: entry id ${entry.id} does not carry unit prefix ${prefix}`);
      }
      const prior = seenIds.get(entry.id);
      if (prior !== undefined) errors.push(`duplicate id ${entry.id} in ${dir} (already in ${prior})`);
      seenIds.set(entry.id, dir);
      counts[bank.grade][entry.kind] += 1;
    }
    counts[bank.grade].units.add(bank.unit);
  }

  for (const grade of GRADES) {
    const c = counts[grade];
    const want = GRADE_TOTALS[grade];
    const expectedUnits = UNITS_PER_GRADE[grade];
    if (c.units.size !== expectedUnits) {
      errors.push(`g${grade}: ${c.units.size}/${expectedUnits} units present`);
    }
    if (c.wordfile !== want.wordfile || c.phrase !== want.phrase) {
      errors.push(
        `g${grade}: totals drifted — ${c.wordfile} wordfile + ${c.phrase} phrase on disk, master list declares ${want.wordfile} + ${want.phrase}`,
      );
    }
  }

  if (errors.length > 0) {
    console.error(`content validate: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `content validate: OK — ${dirs.length} units, ${seenIds.size} entries, all schemas valid, ids unique, totals match.`,
  );
}
