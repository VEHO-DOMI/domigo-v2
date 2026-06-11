/**
 * `content v1-snapshot` — copy the v1 corpus (parity oracle) into the repo
 * byte-verbatim, with sha256 provenance, so review generation and CI parity
 * checks never need the iCloud v1 working copy.
 *
 * Covers the vocab units (data/vocab/<grade>/unit-NN.json) and the grammar
 * modules (data/grammar/m{1-4}.json + grammar-index.json — stage-4 floor,
 * stage-5 untrusted seeds, V-19 item-count floors).
 *
 * v1 tree is READ-ONLY to us (concurrently edited + iCloud-synced — see
 * docs/handover/00_START_HERE.md). Snapshot what's there; trust the lock.
 */
import fs from "node:fs";
import path from "node:path";
import { V1Lock } from "@domigo/content-schema";
import { sha256OfFile, writeJson, writeText } from "./json.ts";
import {
  V1_BASE,
  V1_GRAMMAR_SNAPSHOT_DIR,
  V1_LOCK_PATH,
  V1_SNAPSHOT_DIR,
} from "./paths.ts";

export function runV1Snapshot(): void {
  const vocabBase = path.join(V1_BASE, "data", "vocab");
  if (!fs.existsSync(vocabBase)) {
    throw new Error(`v1 vocab dir not found: ${vocabBase} (set DOMIGO_V1_BASE?)`);
  }

  const sources: V1Lock["sources"] = [];
  let written = 0;

  /** Copy one v1 file byte-verbatim after a torn-iCloud-read guard. */
  function snapshot(
    abs: string,
    dest: string,
    meta: Pick<V1Lock["sources"][number], "grade" | "unit" | "role">,
  ): void {
    const raw = fs.readFileSync(abs, "utf8");
    JSON.parse(raw); // fail loud on a torn iCloud read
    const stat = fs.statSync(abs);
    if (writeText(dest, raw)) written += 1;
    sources.push({
      relPath: path.relative(V1_BASE, abs),
      sha256: sha256OfFile(abs),
      bytes: stat.size,
      mtime: stat.mtime.toISOString(),
      ...meta,
    });
  }

  for (const grade of [1, 2, 3, 4] as const) {
    const gradeDir = path.join(vocabBase, String(grade));
    const names = fs
      .readdirSync(gradeDir)
      .filter((n) => /^unit-\d{2}\.json$/.test(n)) // exact form — excludes iCloud "unit-03 2.json" dups
      .sort();
    for (const name of names) {
      snapshot(
        path.join(gradeDir, name),
        path.join(V1_SNAPSHOT_DIR, `g${grade}`, name),
        { grade, unit: parseInt(name.slice(5, 7), 10), role: "vocab-unit" },
      );
    }
  }

  const grammarBase = path.join(V1_BASE, "data", "grammar");
  if (!fs.existsSync(grammarBase)) {
    throw new Error(`v1 grammar dir not found: ${grammarBase} (set DOMIGO_V1_BASE?)`);
  }
  for (const grade of [1, 2, 3, 4] as const) {
    snapshot(
      path.join(grammarBase, `m${grade}.json`),
      path.join(V1_GRAMMAR_SNAPSHOT_DIR, `m${grade}.json`),
      { grade, unit: null, role: "grammar-module" },
    );
  }
  snapshot(
    path.join(V1_BASE, "data", "grammar-index.json"),
    path.join(V1_GRAMMAR_SNAPSHOT_DIR, "grammar-index.json"),
    { grade: null, unit: null, role: "grammar-index" },
  );

  sources.sort(
    (a, b) =>
      a.role.localeCompare(b.role) ||
      (a.grade ?? 0) - (b.grade ?? 0) ||
      (a.unit ?? 0) - (b.unit ?? 0),
  );
  const lock = V1Lock.parse({ schema: "v1-lock@1", base: V1_BASE, sources });
  writeJson(V1_LOCK_PATH, lock);

  const vocabCount = sources.filter((s) => s.role === "vocab-unit").length;
  const grammarCount = sources.filter((s) => s.role === "grammar-module").length;
  console.log(
    `v1-snapshot: ${vocabCount} vocab units + ${grammarCount} grammar modules + index, ${written} updated.`,
  );
}
