/**
 * Stage 4 — `content gen --structures --grade N --prepare|--ingest`.
 *
 * Agent stage bracketed by deterministic tooling:
 *   --prepare  emits an evidence brief (SB grammar boxes + the v1 structure
 *              catalog as floor) → content/corpus/structures/g{n}/brief.md
 *   (an agent authors structures.draft.json from the brief)
 *   --ingest   validates the draft (evidence freshness, sbRefs resolve,
 *              v1 floor mapped-XOR-waived), mints ids against the per-grade
 *              lock, writes structures.json + v1-diff.md + state transition.
 *
 * All inputs are COMMITTED artifacts (transcripts + v1 snapshot) — CI-safe.
 */
import path from "node:path";
import { z } from "zod";
import type { Grade, GrammarStructuresFile as GrammarStructuresFileT } from "@domigo/content-schema";
import {
  GradeZ,
  GrammarRule,
  GrammarStructuresFile,
  StructureCategory,
  UNITS_PER_GRADE,
  unitIdPrefix,
  unitSlug,
} from "@domigo/content-schema";
import type { GradeBoxes } from "./grammar-boxes.ts";
import { loadGradeBoxes, validSbRefs } from "./grammar-boxes.ts";
import { readJsonIfExists, sha256OfString, writeJson, writeText } from "./json.ts";
import { renderTable } from "./mdtable.ts";
import { STRUCTURES_DIR } from "./paths.ts";
import { appendTransition } from "./state.ts";
import type { V1GrammarModule } from "./v1grammar.ts";
import { loadV1GrammarModule, v1ItemsByStructure } from "./v1grammar.ts";

// ---------------------------------------------------------------------------
// Draft contract (authoring shape — final field validation happens on the
// assembled GrammarStructuresFile, which carries the cross-field refinements)
// ---------------------------------------------------------------------------

const StructureDraft = z.object({
  key: z.string().regex(/^[a-z0-9-]+$/),
  unit: z.number().int().min(1).max(15),
  name: z.string().min(1),
  nameDe: z.string().min(1),
  category: StructureCategory,
  description: z.string().min(1),
  rules: z.array(GrammarRule).min(1),
  commonErrors: z.array(
    z.object({
      description: z.string().min(1),
      wrong: z.string().min(1),
      correct: z.string().min(1),
    }),
  ),
  recursIn: z.array(z.number().int().min(1).max(15)),
  sbRefs: z.array(z.string().min(1)),
  seedV1: z.array(z.string().min(1)),
});

const GrammarStructuresDraft = z.object({
  schema: z.literal("grammar-structures-draft@1"),
  grade: GradeZ,
  briefEvidence: z.string().regex(/^[0-9a-f]{12}$/),
  structures: z.array(StructureDraft).min(1),
  v1Waivers: z.array(
    z.object({ v1Id: z.string().min(1), note: z.string().min(1) }),
  ),
});
type GrammarStructuresDraftT = z.infer<typeof GrammarStructuresDraft>;

// ---------------------------------------------------------------------------
// Pure pieces (exported for tests)
// ---------------------------------------------------------------------------

/** Evidence fingerprint over everything the brief shows the author. */
export function computeEvidence(boxes: GradeBoxes, v1Raw: string): string {
  const stable = {
    boxes: [...boxes.byFile.entries()].map(([file, list]) => [
      file,
      list.map((b) => [b.ref, b.title, b.lines]),
    ]),
    appendix: [...boxes.appendix.entries()].map(([file, text]) => [
      file,
      sha256OfString(text).slice(0, 12),
    ]),
    v1: sha256OfString(v1Raw).slice(0, 12),
  };
  return sha256OfString(JSON.stringify(stable)).slice(0, 12);
}

export interface StructureIdsLock {
  schema: "structure-ids-lock@1";
  grade: Grade;
  structures: Record<string, string>;
  tombstones: Array<{ id: string; key: string; removedWith: string }>;
}

export interface MintResult {
  ids: Map<string, string>;
  lock: StructureIdsLock;
  lockChanged: boolean;
  /** Keys whose pinned id had to change (structure moved units) — reported loudly. */
  remints: string[];
}

export function mintStructureIds(
  grade: Grade,
  drafts: Array<{ key: string; unit: number }>,
  lockIn: StructureIdsLock | null,
  stamp: string,
): MintResult {
  const lock: StructureIdsLock = lockIn
    ? {
        ...lockIn,
        structures: { ...lockIn.structures },
        tombstones: [...lockIn.tombstones],
      }
    : { schema: "structure-ids-lock@1", grade, structures: {}, tombstones: [] };
  const ids = new Map<string, string>();
  const remints: string[] = [];
  let lockChanged = lockIn === null;
  const seen = new Set<string>();

  for (const d of drafts) {
    seen.add(d.key);
    const want = `${unitIdPrefix(grade, d.unit)}.s.${d.key}`;
    const existing = lock.structures[d.key];
    if (existing === undefined) {
      lock.structures[d.key] = want;
      lockChanged = true;
    } else if (existing !== want) {
      // unit moved — ids never silently change meaning: tombstone + re-mint
      lock.tombstones.push({ id: existing, key: d.key, removedWith: stamp });
      lock.structures[d.key] = want;
      lockChanged = true;
      remints.push(d.key);
    }
    ids.set(d.key, lock.structures[d.key]!);
  }

  for (const [key, id] of Object.entries(lock.structures)) {
    if (!seen.has(key)) {
      delete lock.structures[key];
      lock.tombstones.push({ id, key, removedWith: stamp });
      lockChanged = true;
    }
  }
  return { ids, lock, lockChanged, remints };
}

export interface FloorDiff {
  mapped: Array<{ v1Id: string; v2Key: string }>;
  fresh: string[];
  waived: Array<{ v1Id: string; note: string }>;
  errors: string[];
}

export function diffV1Floor(
  drafts: Array<{ key: string; seedV1: string[] }>,
  waivers: Array<{ v1Id: string; note: string }>,
  v1Ids: string[],
): FloorDiff {
  const v1Set = new Set(v1Ids);
  const claimedBy = new Map<string, string>();
  const mapped: Array<{ v1Id: string; v2Key: string }> = [];
  const fresh: string[] = [];
  const errors: string[] = [];

  for (const d of drafts) {
    if (d.seedV1.length === 0) fresh.push(d.key);
    for (const v1Id of d.seedV1) {
      if (!v1Set.has(v1Id)) {
        errors.push(`${d.key}: seedV1 references unknown v1 id ${v1Id}`);
        continue;
      }
      const prior = claimedBy.get(v1Id);
      if (prior !== undefined) {
        errors.push(`v1 id ${v1Id} mapped by both ${prior} and ${d.key}`);
        continue;
      }
      claimedBy.set(v1Id, d.key);
      mapped.push({ v1Id, v2Key: d.key });
    }
  }
  const waivedSet = new Set<string>();
  for (const w of waivers) {
    if (!v1Set.has(w.v1Id)) errors.push(`waiver references unknown v1 id ${w.v1Id}`);
    if (claimedBy.has(w.v1Id)) errors.push(`v1 id ${w.v1Id} both mapped and waived`);
    if (waivedSet.has(w.v1Id)) errors.push(`duplicate waiver for ${w.v1Id}`);
    waivedSet.add(w.v1Id);
  }
  for (const v1Id of v1Ids) {
    if (!claimedBy.has(v1Id) && !waivedSet.has(v1Id)) {
      errors.push(`v1 id ${v1Id} is neither mapped (seedV1) nor waived — the v1 floor must be accounted for`);
    }
  }
  return { mapped, fresh, waived: waivers, errors };
}

export function structuresContentHash(
  structures: GrammarStructuresFileT["structures"],
): string {
  return sha256OfString(JSON.stringify(structures));
}

// ---------------------------------------------------------------------------
// --prepare
// ---------------------------------------------------------------------------

function fmtCounts(counts: Map<string, number>): string {
  return (
    [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([k, n]) => `${k} ${n}`)
      .join(" · ") || "—"
  );
}

function renderBrief(grade: Grade, boxes: GradeBoxes, v1: V1GrammarModule, evidence: string): string {
  const lines: string[] = [];
  const byStructure = v1ItemsByStructure(v1);
  const v1ByUnit = new Map<number, V1GrammarModule["structures"]>();
  for (const s of v1.structures) {
    const list = v1ByUnit.get(s.u);
    if (list === undefined) v1ByUnit.set(s.u, [s]);
    else list.push(s);
  }

  lines.push(`# Grammar structures — g${grade} (stage-4 authoring brief)`);
  lines.push("");
  lines.push(`<!-- domigo:structures g${grade} evidence=${evidence} -->`);
  lines.push("");
  lines.push("## Authoring contract");
  lines.push("");
  lines.push(`Write \`content/corpus/structures/g${grade}/structures.draft.json\`:`);
  lines.push("");
  lines.push("```jsonc");
  lines.push("{");
  lines.push('  "schema": "grammar-structures-draft@1",');
  lines.push(`  "grade": ${grade},`);
  lines.push(`  "briefEvidence": "${evidence}",`);
  lines.push('  "structures": [');
  lines.push("    {");
  lines.push('      "key": "should",                  // [a-z0-9-]+, GRADE-unique (item ids embed it)');
  lines.push('      "unit": 3,                        // introducing (gate) unit');
  lines.push('      "name": "should / shouldn\'t",     // teacher-facing EN');
  lines.push('      "nameDe": "…",                    // teacher-facing DE');
  lines.push('      "category": "modals",             // articles|comparison|conditionals|connectors|modals|other|passive|prepositions|pronouns|reported-speech|tenses|word-formation');
  lines.push('      "description": "…",');
  lines.push('      "rules": [{ "id": "…", "en": "…", "de": "…", "examples": [{ "en": "…", "de": "…" }] }],');
  lines.push('      "commonErrors": [{ "description": "…", "wrong": "…", "correct": "…" }],');
  lines.push('      "recursIn": [],                   // later same-grade units where it recurs (revision boxes)');
  lines.push('      "sbRefs": ["…#grammar-1"],        // cite the box refs below (or …#appendix)');
  lines.push('      "seedV1": ["m2-u3-should"]        // v1 ids this covers (many-to-one ok; [] = NEW)');
  lines.push("    }");
  lines.push("  ],");
  lines.push('  "v1Waivers": [{ "v1Id": "…", "note": "…" }]   // v1 structures intentionally NOT carried');
  lines.push("}");
  lines.push("```");
  lines.push("");
  lines.push("Rules:");
  lines.push("- **The textbook is the source of truth.** One structure per SB GRAMMAR box; the v1 catalog is a FLOOR (untrusted seed): every v1 id below must land in exactly one `seedV1[]` or in `v1Waivers` with a reasoned note.");
  lines.push("- Revision boxes become their own structure (name suffixed \"(revision)\") in their own unit; link via `recursIn` on the original.");
  lines.push("- `rules` are teaching content (grammar intro cards): rewrite from the SB box + v1 `rules` seed; German in du-form; pedagogical German terms (Grundform, Vergangenheit …) are allowed here.");
  lines.push("- Difficulty seed map for later stages (hint only): v1 1–2→1, 3→2, 4–5→3.");
  lines.push("- Keys should match v1 key style where sensible (e.g. `should`, `past-simple-questions`) so seeds stay traceable.");
  lines.push("");

  // Units table
  lines.push("## Units");
  lines.push("");
  const fileOfUnit = new Map<number, string>();
  for (const [file, unit] of boxes.unitOf.entries()) {
    if (unit !== null && !fileOfUnit.has(unit)) fileOfUnit.set(unit, file);
  }
  const unitRows: string[][] = [];
  for (let unit = 1; unit <= UNITS_PER_GRADE[grade]; unit += 1) {
    const file = fileOfUnit.get(unit);
    const boxCount = file !== undefined ? (boxes.byFile.get(file)?.length ?? 0) : 0;
    const v1Count = v1ByUnit.get(unit)?.length ?? 0;
    unitRows.push([
      String(unit),
      unitSlug(grade, unit),
      file ?? "—",
      String(boxCount),
      v1Count === 0 ? "0 ⚠ hole — fill from the SB box" : String(v1Count),
    ]);
  }
  lines.push(renderTable(["unit", "slug", "transcript", "boxes", "v1 structures"], unitRows));
  lines.push("");

  // SB grammar boxes
  lines.push("## SB grammar boxes (verbatim)");
  lines.push("");
  for (const [file, list] of boxes.byFile.entries()) {
    if (list.length === 0) continue;
    const unit = boxes.unitOf.get(file);
    lines.push(`### ${file}${unit !== null && unit !== undefined ? ` (unit ${unit})` : ""}`);
    lines.push("");
    for (const b of list) {
      lines.push(`#### \`${b.ref}\` — ${b.title ?? "(untitled)"}`);
      lines.push("");
      lines.push("```");
      for (const l of b.lines) lines.push(l);
      lines.push("```");
      lines.push("");
    }
  }

  // Appendix
  for (const [file, text] of boxes.appendix.entries()) {
    lines.push(`## Grammar appendix (verbatim) — \`${file}#appendix\``);
    lines.push("");
    lines.push("```");
    for (const l of text.split("\n")) lines.push(l);
    lines.push("```");
    lines.push("");
  }

  // v1 floor catalog
  lines.push(`## v1 floor catalog — m${grade} (UNTRUSTED seed: mine for ideas, map or waive every id)`);
  lines.push("");
  for (const s of [...v1.structures].sort((a, b) => a.u - b.u || a.id.localeCompare(b.id))) {
    const items = byStructure.get(s.id) ?? [];
    const formats = new Map<string, number>();
    const difficulties = new Map<string, number>();
    for (const it of items) {
      formats.set(it.t, (formats.get(it.t) ?? 0) + 1);
      difficulties.set(`d${it.d}`, (difficulties.get(`d${it.d}`) ?? 0) + 1);
    }
    lines.push(`### \`${s.id}\` — unit ${s.u} · ${s.cat}`);
    lines.push("");
    lines.push(`**${s.n}** / ${s.nd}`);
    lines.push("");
    lines.push(s.desc);
    lines.push("");
    lines.push(`items: ${items.length} — ${fmtCounts(formats)} | ${fmtCounts(difficulties)}`);
    if (s.rules !== undefined && s.rules.length > 0) {
      lines.push("");
      lines.push("rules (seed):");
      for (const r of s.rules) {
        lines.push(`- [${r.id}] ${r.t}`);
        lines.push(`  - DE: ${r.td}`);
        for (const ex of r.ex ?? []) lines.push(`  - "${ex.en}" — "${ex.de}"`);
      }
    }
    if (s.kf !== undefined && Object.keys(s.kf).length > 0) {
      lines.push("");
      lines.push("key forms (seed):");
      for (const [cat, examples] of Object.entries(s.kf)) {
        lines.push(`- ${cat}: ${examples.join(" · ")}`);
      }
    }
    if (s.errs !== undefined && s.errs.length > 0) {
      lines.push("");
      lines.push("common errors (seed):");
      for (const e of s.errs) lines.push(`- ${e.d}: ✗ "${e.w}" → ✓ "${e.c}"`);
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function runGenStructuresPrepare(grade: Grade): void {
  const boxes = loadGradeBoxes(grade);
  const v1 = loadV1GrammarModule(grade);
  const evidence = computeEvidence(boxes, v1.raw);
  const dest = path.join(STRUCTURES_DIR, `g${grade}`, "brief.md");
  const changed = writeText(dest, renderBrief(grade, boxes, v1.module, evidence));
  const boxCount = [...boxes.byFile.values()].reduce((n, l) => n + l.length, 0);
  console.log(
    `structures brief g${grade}: ${boxCount} boxes, ${v1.module.structures.length} v1 structures, evidence ${evidence} — ${changed ? "written" : "unchanged"}\n  → ${dest}`,
  );
}

// ---------------------------------------------------------------------------
// --ingest
// ---------------------------------------------------------------------------

function renderV1Diff(grade: Grade, diff: FloorDiff, ids: Map<string, string>): string {
  const lines: string[] = [];
  lines.push(`# v1 structure floor — g${grade}`);
  lines.push("");
  lines.push("<!-- generated by `content gen --structures --ingest`; do not hand-edit -->");
  lines.push("");
  lines.push(`## Mapped (${diff.mapped.length})`);
  lines.push("");
  lines.push(
    renderTable(
      ["v1 id", "v2 structure"],
      diff.mapped.map((m) => [m.v1Id, ids.get(m.v2Key) ?? m.v2Key]),
    ),
  );
  lines.push("");
  lines.push(`## New in v2 (${diff.fresh.length})`);
  lines.push("");
  for (const key of diff.fresh) lines.push(`- ${ids.get(key) ?? key}`);
  if (diff.fresh.length === 0) lines.push("—");
  lines.push("");
  lines.push(`## Waived (${diff.waived.length})`);
  lines.push("");
  lines.push(
    renderTable(
      ["v1 id", "note"],
      diff.waived.map((w) => [w.v1Id, w.note]),
    ),
  );
  lines.push("");
  return lines.join("\n");
}

export function runGenStructuresIngest(grade: Grade, dryRun: boolean): void {
  const gradeDir = path.join(STRUCTURES_DIR, `g${grade}`);
  const draftPath = path.join(gradeDir, "structures.draft.json");
  const draftRaw = readJsonIfExists<unknown>(draftPath);
  if (draftRaw === null) {
    throw new Error(`no draft at ${draftPath} — author it from brief.md (run --prepare first)`);
  }
  const draft: GrammarStructuresDraftT = GrammarStructuresDraft.parse(draftRaw);
  if (draft.grade !== grade) {
    throw new Error(`draft says grade ${draft.grade}, command says ${grade}`);
  }

  const boxes = loadGradeBoxes(grade);
  const v1 = loadV1GrammarModule(grade);
  const evidence = computeEvidence(boxes, v1.raw);
  if (draft.briefEvidence !== evidence) {
    throw new Error(
      `stale draft: briefEvidence ${draft.briefEvidence} ≠ current ${evidence} — re-run --prepare and re-author`,
    );
  }

  const errors: string[] = [];
  const refs = validSbRefs(boxes);
  for (const s of draft.structures) {
    for (const r of s.sbRefs) {
      if (!refs.has(r)) errors.push(`${s.key}: unknown sbRef ${r}`);
    }
  }
  const diff = diffV1Floor(
    draft.structures,
    draft.v1Waivers,
    v1.module.structures.map((s) => s.id),
  );
  errors.push(...diff.errors);
  if (errors.length > 0) {
    for (const e of errors) console.error(`  ✗ ${e}`);
    throw new Error(`structures ingest g${grade}: ${errors.length} error(s)`);
  }

  const draftSha = sha256OfString(JSON.stringify(draftRaw)).slice(0, 12);
  const lockIn = readJsonIfExists<StructureIdsLock>(path.join(gradeDir, "ids.lock.json"));
  const mint = mintStructureIds(grade, draft.structures, lockIn, draftSha);
  for (const key of mint.remints) {
    console.warn(`  ⚠ ${key}: unit moved — old id tombstoned, new id minted`);
  }

  const structures = draft.structures
    .map((d) => ({
      id: mint.ids.get(d.key)!,
      ...d,
      provenance: {
        by: "fable",
        sbRef: d.sbRefs[0] ?? null,
        seedV1: null,
        narrative: null,
        note: null,
      },
    }))
    .sort((a, b) => a.unit - b.unit || a.key.localeCompare(b.key));
  const file = GrammarStructuresFile.parse({
    schema: "grammar-structures@1",
    grade,
    structures,
    v1Waivers: draft.v1Waivers,
  });
  const hash = structuresContentHash(file.structures);
  const note = `structures ingest: ${structures.length} total, ${diff.fresh.length} new, ${diff.mapped.length} v1-mapped, ${draft.v1Waivers.length} waived`;

  if (dryRun) {
    console.log(`structures ingest g${grade} (dry-run): OK — ${note}; hash ${hash.slice(0, 12)}`);
    return;
  }
  writeJson(path.join(gradeDir, "structures.json"), file);
  writeJson(path.join(gradeDir, "ids.lock.json"), mint.lock);
  writeText(path.join(gradeDir, "v1-diff.md"), renderV1Diff(grade, diff, mint.ids));
  appendTransition(gradeDir, `g${grade}-structures`, {
    state: "generated",
    by: "fable",
    contentHash: hash,
    note,
  });
  console.log(`structures ingest g${grade}: OK — ${note}`);
}
