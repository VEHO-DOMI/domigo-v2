/**
 * `content validate` — deterministic checks over COMMITTED artifacts only.
 * Runs in CI (no iCloud sources needed). Red blocks merge.
 *
 * Stage-2 structural checks plus the review-round graduations:
 *  V-A  approved unit's recorded hash == current bank entries hash
 *  V-B  approved unit has a complete, fix-free flags record + reviewed rows
 *  V-C  v1 parity per grade (exact/fuzzy across units) with explicit waivers —
 *       enforced once every unit of the grade is approved, informational before
 *  V-D  overlay integrity (drop/patch/add ids resolve; adds present + prefixed)
 *  V-E  live review docs regenerate byte-identically (verdict lines aside)
 *  V-F  per-grade structures catalogs (stage 4): schema green, ids match the
 *       lock, v1 floor mapped-XOR-waived vs the committed snapshot, state-hash
 *       drift guard, sbRefs resolve against committed transcripts + overlay
 */
import fs from "node:fs";
import path from "node:path";
import type { Grade, WordBankEntry } from "@domigo/content-schema";
import {
  GRADES,
  GrammarStructuresFile,
  UNITS_PER_GRADE,
  WordBank,
  unitIdPrefix,
  unitSlug,
} from "@domigo/content-schema";
import { diffV1Floor, structuresContentHash } from "./gen-structures.ts";
import { loadGradeBoxes, validSbRefs } from "./grammar-boxes.ts";
import { readJsonIfExists } from "./json.ts";
import {
  OVERLAYS_DIR,
  STRUCTURES_DIR,
  UNITS_DIR,
  V1_GRAMMAR_SNAPSHOT_DIR,
  V1_SNAPSHOT_DIR,
} from "./paths.ts";
import { buildWordbankReview, entryMatchesWord, loadV1Unit } from "./review-wordbank.ts";
import { readStateLog } from "./state.ts";
import { wordTokens } from "./tokenize.ts";
import { loadV1GrammarModule } from "./v1grammar.ts";
import { entriesContentHash, type ParseFixes } from "./wordbank.ts";

/** Master-list self-declared totals (also asserted at parse time in stage 2). */
const GRADE_TOTALS: Record<Grade, { wordfile: number; phrase: number }> = {
  1: { wordfile: 303, phrase: 483 },
  2: { wordfile: 198, phrase: 413 },
  3: { wordfile: 143, phrase: 456 },
  4: { wordfile: 48, phrase: 402 },
};

interface FlagsFile {
  round: number;
  bankHash: string;
  flags: Array<{ key: string; verdict: string; note: string }>;
  unit: { verdict: string; note: string };
}

interface IdsLockFile {
  words: Record<string, string>;
  tombstones: Array<{ id: string }>;
}

function stripVerdictLines(md: string): string {
  return md
    .split("\n")
    .filter((l) => !/^>\s*(verdict|note|unit):/.test(l))
    .join("\n");
}

export function runValidate(): void {
  const errors: string[] = [];
  const infos: string[] = [];
  const seenIds = new Map<string, string>();
  const counts: Record<Grade, { wordfile: number; phrase: number; units: Set<number> }> = {
    1: { wordfile: 0, phrase: 0, units: new Set() },
    2: { wordfile: 0, phrase: 0, units: new Set() },
    3: { wordfile: 0, phrase: 0, units: new Set() },
    4: { wordfile: 0, phrase: 0, units: new Set() },
  };
  // overlay-caused per-grade deltas vs the declared totals
  const delta: Record<Grade, { wordfile: number; phrase: number }> = {
    1: { wordfile: 0, phrase: 0 },
    2: { wordfile: 0, phrase: 0 },
    3: { wordfile: 0, phrase: 0 },
    4: { wordfile: 0, phrase: 0 },
  };

  if (!fs.existsSync(UNITS_DIR)) {
    console.error("content validate: no corpus on disk (content/corpus/units missing)");
    process.exitCode = 1;
    return;
  }

  const fixes = readJsonIfExists<ParseFixes>(path.join(OVERLAYS_DIR, "parse-fixes.json")) ?? {};
  const dirs = fs
    .readdirSync(UNITS_DIR)
    .filter((n) => /^g[1-4]-u\d{2}$/.test(n))
    .sort();

  const banksBySlug = new Map<string, { grade: Grade; unit: number; entries: WordBankEntry[] }>();
  const approvedSlugs = new Set<string>();

  for (const dir of dirs) {
    const unitDir = path.join(UNITS_DIR, dir);
    const raw = readJsonIfExists<unknown>(path.join(unitDir, "wordbank.json"));
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
    banksBySlug.set(dir, { grade: bank.grade, unit: bank.unit, entries: bank.entries });

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

    // ---- V-D: overlay integrity + totals delta
    const unitFix = fixes[dir];
    const lock = readJsonIfExists<IdsLockFile>(path.join(unitDir, "ids.lock.json"));
    if (unitFix !== undefined) {
      const idToKind = new Map<string, "wordfile" | "phrase">();
      for (const [key, id] of Object.entries(lock?.words ?? {})) {
        const kind = key.replace(/^overlay:/, "").split(":")[0];
        if (kind === "wordfile" || kind === "phrase") idToKind.set(id, kind);
      }
      for (const dropId of unitFix.drop ?? []) {
        const kind = idToKind.get(dropId);
        if (kind === undefined) errors.push(`${dir}: overlay drops unknown id ${dropId}`);
        else delta[bank.grade][kind] -= 1;
        if (bank.entries.some((e) => e.id === dropId)) errors.push(`${dir}: overlay drop ${dropId} did not apply`);
      }
      for (const patchId of Object.keys(unitFix.patch ?? {})) {
        const dropped = (unitFix.drop ?? []).includes(patchId);
        if (!dropped && !bank.entries.some((e) => e.id === patchId)) {
          errors.push(`${dir}: overlay patch targets missing id ${patchId}`);
        }
      }
      for (const add of unitFix.add ?? []) {
        if (!add.id.startsWith(`${prefix}.w.`)) errors.push(`${dir}: overlay add ${add.id} lacks unit prefix`);
        if (!bank.entries.some((e) => e.id === add.id)) errors.push(`${dir}: overlay add ${add.id} did not apply`);
        if (!Object.values(lock?.words ?? {}).includes(add.id)) {
          errors.push(`${dir}: overlay add ${add.id} is not registered in ids.lock.json`);
        }
        delta[bank.grade][add.kind] += 1;
      }
    }

    // ---- V-A / V-B on approved units
    const log = readStateLog(unitDir);
    const last = log?.transitions[log.transitions.length - 1];
    if (last?.state === "wordbank_approved") {
      approvedSlugs.add(dir);
      const currentHash = entriesContentHash(bank.entries);
      if (last.contentHash !== currentHash) {
        errors.push(`${dir}: V-A — approved hash ${last.contentHash?.slice(0, 12)} ≠ current bank ${currentHash.slice(0, 12)} (bank drifted after approval; re-review)`);
      }
      const flags = readJsonIfExists<FlagsFile>(path.join(unitDir, "review", "wordbank.flags.json"));
      if (flags === null) errors.push(`${dir}: V-B — approved but review/wordbank.flags.json is missing`);
      else {
        if (flags.unit.verdict !== "ok") errors.push(`${dir}: V-B — approved but recorded unit verdict is ${flags.unit.verdict}`);
        const unresolved = flags.flags.filter((f) => f.verdict === "fix" || f.verdict === "");
        if (unresolved.length > 0) errors.push(`${dir}: V-B — approved with unresolved flags: ${unresolved.map((f) => f.key).join(", ")}`);
      }
      if (readJsonIfExists<unknown>(path.join(unitDir, "review", "wordbank.reviewed.json")) === null) {
        errors.push(`${dir}: V-B — approved but review/wordbank.reviewed.json is missing`);
      }
    }

    // ---- V-E: a live (non-stale) review doc must regenerate byte-identically
    const docPath = path.join(unitDir, "review", "wordbank.review.md");
    if (fs.existsSync(docPath)) {
      const committed = fs.readFileSync(docPath, "utf8");
      const marker = /<!-- domigo:review wordbank \S+ round=(\d+) bank=([0-9a-f]{12}) -->/.exec(committed);
      if (marker !== null) {
        const regen = buildWordbankReview(dir);
        if (marker[2] === regen.bankHash12 && parseInt(marker[1] as string, 10) === regen.round) {
          if (stripVerdictLines(committed) !== stripVerdictLines(regen.markdown)) {
            errors.push(`${dir}: V-E — live review doc differs from regeneration (hand-edited structure or stale tables)`);
          }
        }
      }
    }
  }

  // ---- totals (declared ± overlay deltas)
  for (const grade of GRADES) {
    const c = counts[grade];
    const want = GRADE_TOTALS[grade];
    const expectedUnits = UNITS_PER_GRADE[grade];
    if (c.units.size !== expectedUnits) {
      errors.push(`g${grade}: ${c.units.size}/${expectedUnits} units present`);
    }
    const expWf = want.wordfile + delta[grade].wordfile;
    const expPh = want.phrase + delta[grade].phrase;
    if (c.wordfile !== expWf || c.phrase !== expPh) {
      errors.push(
        `g${grade}: totals drifted — ${c.wordfile} wordfile + ${c.phrase} phrase on disk; expected ${expWf} + ${expPh} (declared ${want.wordfile}+${want.phrase}, overlays ${delta[grade].wordfile >= 0 ? "+" : ""}${delta[grade].wordfile}/${delta[grade].phrase >= 0 ? "+" : ""}${delta[grade].phrase})`,
      );
    }
  }

  // ---- V-C: v1 parity per grade with waivers (enforced once the grade is fully approved)
  if (fs.existsSync(V1_SNAPSHOT_DIR)) {
    for (const grade of GRADES) {
      const gradeSlugs = dirs.filter((d) => d.startsWith(`g${grade}-`));
      const fullyApproved = gradeSlugs.length === UNITS_PER_GRADE[grade] && gradeSlugs.every((s) => approvedSlugs.has(s));

      // grade-wide index of token-joined forms
      const formKeys = new Set<string>();
      const gradeEntries: WordBankEntry[] = [];
      for (const slug of gradeSlugs) {
        for (const e of banksBySlug.get(slug)?.entries ?? []) {
          gradeEntries.push(e);
          for (const f of [e.en, ...e.forms]) formKeys.add(wordTokens(f).join(" "));
        }
      }
      // waivers: any unit's flags.json with v1-missing:<tokenKey> verdict ok/add
      const waived = new Set<string>();
      for (const slug of gradeSlugs) {
        const flags = readJsonIfExists<FlagsFile>(path.join(UNITS_DIR, slug, "review", "wordbank.flags.json"));
        for (const f of flags?.flags ?? []) {
          if (f.key.startsWith("v1-missing:") && (f.verdict === "ok" || f.verdict === "add")) {
            waived.add(f.key.slice("v1-missing:".length));
          }
        }
      }

      const misses: string[] = [];
      for (let unit = 1; unit <= UNITS_PER_GRADE[grade]; unit += 1) {
        for (const ve of loadV1Unit(grade, unit) ?? []) {
          const key = wordTokens(ve.w).join(" ");
          if (key.length === 0 || formKeys.has(key) || waived.has(key)) continue;
          // fuzzy fallback: THE shared matcher (article-insensitive, inflection-aware)
          const fuzzy = gradeEntries.some((e) => entryMatchesWord(e, ve.w));
          if (!fuzzy) misses.push(ve.w);
        }
      }
      if (misses.length > 0) {
        const msg = `g${grade}: V-C — ${misses.length} v1 word(s) neither in any bank nor waived: ${misses.slice(0, 8).join(", ")}${misses.length > 8 ? " …" : ""}`;
        if (fullyApproved) errors.push(msg);
        else infos.push(`${msg} (informational until the grade is fully approved)`);
      }
    }
  } else {
    infos.push("V-C skipped: no v1 snapshot on disk (run `content v1-snapshot`)");
  }

  // ---- V-F: per-grade structures catalogs (stage 4)
  let structuresCount = 0;
  if (fs.existsSync(STRUCTURES_DIR)) {
    const gradeNames = fs
      .readdirSync(STRUCTURES_DIR)
      .filter((n) => /^g[1-4]$/.test(n))
      .sort();
    for (const gradeName of gradeNames) {
      const grade = Number(gradeName.slice(1)) as Grade;
      const gradeDir = path.join(STRUCTURES_DIR, gradeName);
      const raw = readJsonIfExists<unknown>(path.join(gradeDir, "structures.json"));
      if (raw === null) continue; // brief/draft only — not yet ingested
      const parsed = GrammarStructuresFile.safeParse(raw);
      if (!parsed.success) {
        errors.push(
          `structures ${gradeName}: V-F — schema violation: ${parsed.error.issues[0]?.message ?? "unknown"} at ${parsed.error.issues[0]?.path.join(".") ?? "?"}`,
        );
        continue;
      }
      const file = parsed.data;
      structuresCount += file.structures.length;
      if (file.grade !== grade) errors.push(`structures ${gradeName}: V-F — grade field says ${file.grade}`);

      const lock = readJsonIfExists<{ structures: Record<string, string> }>(
        path.join(gradeDir, "ids.lock.json"),
      );
      if (lock === null) {
        errors.push(`structures ${gradeName}: V-F — missing ids.lock.json`);
      } else {
        for (const s of file.structures) {
          if (lock.structures[s.key] !== s.id) {
            errors.push(
              `structures ${gradeName}: V-F — ${s.key} id ${s.id} not pinned in lock (lock says ${lock.structures[s.key] ?? "nothing"})`,
            );
          }
        }
        const fileKeys = new Set(file.structures.map((s) => s.key));
        for (const key of Object.keys(lock.structures)) {
          if (!fileKeys.has(key)) {
            errors.push(
              `structures ${gradeName}: V-F — lock pins ${key} but the catalog has no such structure (should be tombstoned)`,
            );
          }
        }
      }

      const log = readStateLog(gradeDir);
      const last = log?.transitions[log.transitions.length - 1];
      const hash = structuresContentHash(file.structures);
      if (last === undefined) {
        errors.push(`structures ${gradeName}: V-F — no state.json`);
      } else if (last.contentHash !== hash) {
        errors.push(
          `structures ${gradeName}: V-F — recorded hash ${last.contentHash?.slice(0, 12)} ≠ current ${hash.slice(0, 12)} (catalog drifted after ingest)`,
        );
      }

      if (fs.existsSync(path.join(V1_GRAMMAR_SNAPSHOT_DIR, `m${grade}.json`))) {
        const v1 = loadV1GrammarModule(grade);
        const diff = diffV1Floor(
          file.structures,
          file.v1Waivers,
          v1.module.structures.map((s) => s.id),
        );
        for (const e of diff.errors) errors.push(`structures ${gradeName}: V-F — ${e}`);
        if (diff.fresh.length > 0) {
          infos.push(
            `structures ${gradeName}: ${diff.fresh.length} structure(s) without v1 ancestor (new): ${diff.fresh.join(", ")}`,
          );
        }
      } else {
        infos.push(
          `structures ${gradeName}: V-F floor check skipped — no v1 grammar snapshot (run \`content v1-snapshot\`)`,
        );
      }

      try {
        const refs = validSbRefs(loadGradeBoxes(grade));
        for (const s of file.structures) {
          for (const r of s.sbRefs) {
            if (!refs.has(r)) errors.push(`structures ${gradeName}: V-F — ${s.key} cites unknown sbRef ${r}`);
          }
        }
      } catch (e) {
        errors.push(`structures ${gradeName}: V-F — ${(e as Error).message}`);
      }

      const unitsWith = new Set(file.structures.map((s) => s.unit));
      const empty: number[] = [];
      for (let u = 1; u <= UNITS_PER_GRADE[grade]; u += 1) {
        if (!unitsWith.has(u)) empty.push(u);
      }
      if (empty.length > 0) {
        infos.push(`structures ${gradeName}: unit(s) without structures: ${empty.join(", ")}`);
      }
    }
  }

  for (const i of infos) console.log(`  ℹ ${i}`);
  if (errors.length > 0) {
    console.error(`content validate: ${errors.length} error(s)`);
    for (const e of errors) console.error(`  ✗ ${e}`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `content validate: OK — ${dirs.length} units, ${seenIds.size} entries, ${approvedSlugs.size} approved${structuresCount > 0 ? `, ${structuresCount} structures` : ""}; schemas valid, ids unique, totals match, V-A…V-F green.`,
  );
}
