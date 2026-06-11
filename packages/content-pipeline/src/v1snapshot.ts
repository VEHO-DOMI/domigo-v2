/**
 * `content v1-snapshot` — copy the v1 vocab corpus (parity oracle) into the
 * repo byte-verbatim, with sha256 provenance, so review generation and CI
 * parity checks never need the iCloud v1 working copy.
 *
 * v1 tree is READ-ONLY to us (concurrently edited + iCloud-synced — see
 * docs/handover/00_START_HERE.md). Snapshot what's there; trust the lock.
 */
import fs from "node:fs";
import path from "node:path";
import { V1Lock } from "@domigo/content-schema";
import { sha256OfFile, writeJson, writeText } from "./json.ts";
import { V1_BASE, V1_LOCK_PATH, V1_SNAPSHOT_DIR } from "./paths.ts";

export function runV1Snapshot(): void {
  const vocabBase = path.join(V1_BASE, "data", "vocab");
  if (!fs.existsSync(vocabBase)) {
    throw new Error(`v1 vocab dir not found: ${vocabBase} (set DOMIGO_V1_BASE?)`);
  }

  const sources: V1Lock["sources"] = [];
  let written = 0;

  for (const grade of [1, 2, 3, 4] as const) {
    const gradeDir = path.join(vocabBase, String(grade));
    const names = fs
      .readdirSync(gradeDir)
      .filter((n) => /^unit-\d{2}\.json$/.test(n)) // exact form — excludes iCloud "unit-03 2.json" dups
      .sort();
    for (const name of names) {
      const abs = path.join(gradeDir, name);
      const unit = parseInt(name.slice(5, 7), 10);
      const raw = fs.readFileSync(abs, "utf8");
      JSON.parse(raw); // fail loud on a torn iCloud read
      const stat = fs.statSync(abs);
      if (writeText(path.join(V1_SNAPSHOT_DIR, `g${grade}`, name), raw)) written += 1;
      sources.push({
        relPath: path.relative(V1_BASE, abs),
        sha256: sha256OfFile(abs),
        bytes: stat.size,
        mtime: stat.mtime.toISOString(),
        grade,
        unit,
      });
    }
  }

  sources.sort((a, b) => a.grade - b.grade || a.unit - b.unit);
  const lock = V1Lock.parse({ schema: "v1-lock@1", base: V1_BASE, sources });
  writeJson(V1_LOCK_PATH, lock);

  const perGrade = [1, 2, 3, 4].map((g) => sources.filter((s) => s.grade === g).length);
  console.log(
    `v1-snapshot: ${sources.length} unit files (${perGrade.join("/")}), ${written} updated.`,
  );
}
