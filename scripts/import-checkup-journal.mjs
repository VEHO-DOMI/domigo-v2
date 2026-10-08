#!/usr/bin/env node
/**
 * cgo-100 · OFFLINE ONLY. Prepare a reviewed, one-time content_checks import.
 * This script never opens a database connection or starts a sandbox/model.
 *
 *   node scripts/import-checkup-journal.mjs --out /tmp/checkup-import
 *   node scripts/import-checkup-journal.mjs --evidence /outside/reviewed.json --out /tmp/checkup-import
 *   node scripts/import-checkup-journal.mjs --selftest
 *
 * Historical evidence JSON:
 * { protocol: "checkup-journal-evidence-v1", records: [{
 *   checkupTaskKey: "<UUID>",
 *   task: { itemId, unitSlug, kind, revision, item, frame, pool },
 *   source: "sandbox/blind-solve", sourceRef: "<reviewable archived run reference>",
 *   model: "claude-sonnet-5" | "claude-opus-4-8",
 *   thinking: { type: "adaptive" } | { type: "enabled", budget_tokens: 1024 },
 *   teacherId: "<UUID>", classId: "<UUID>", checkedAt: "<ISO timestamp>",
 *   candidates: [{ answer: "<blind answer>", confidence: 0.9 }]
 * }] }
 *
 * Evidence must originate in an archived sandbox run. This offline validator
 * checks consistency, not authenticity: GG must verify sourceRef against that
 * original before applying import.sql in its authorized operations workflow.
 * Old S-2 rows without exact item bytes/frame are NOT reusable intelligence.
 * Deterministic rows are checkup_deterministic and NEVER intelligence passes.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { composeCheckup, prepareCheckupTasks, gradeCheckupCandidate } from "../apps/web/lib/checkup.ts";
import { checkupTaskKey, contentCheckKey } from "../apps/web/lib/checkup-gate.ts";
import { listApprovedUnits } from "../packages/content-loader/src/index.ts";
import { CHECKUP_TOTAL } from "../packages/db/src/checkup.ts";
import { vocabAnswers } from "../packages/engine/src/index.ts";

const REPO = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."));
const PROTOCOL = "checkup-journal-evidence-v1";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CAPABLE_MODELS = new Set(["claude-sonnet-5", "claude-opus-4-8"]);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const plainObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const taskBytes = (task) => JSON.stringify({ item: task.item, frame: task.frame, pool: task.pool });

function collectTasks() {
  const units = listApprovedUnits().sort();
  const tasks = new Map();
  let occurrences = 0;
  for (const slug of units) {
    const composed = composeCheckup(slug, Number(slug[1]), `verify-${slug}`);
    if (!composed.ok) throw new Error(`${slug}: composition failed (${composed.errors.length} errors).`);
    const ids = composed.sections.flatMap((section) => section.itemIds);
    assert.equal(composed.sections.reduce((sum, section) => sum + section.sectionConfig.points, 0), CHECKUP_TOTAL, `${slug}: total`);
    assert.equal(new Set(ids).size, CHECKUP_TOTAL, `${slug}: duplicate or missing item`);
    assert.ok(composed.sections.every((section) => section.itemIds.length === section.sectionConfig.points), `${slug}: item points`);
    assert.deepEqual(composeCheckup(slug, Number(slug[1]), `verify-${slug}`), composed, `${slug}: nondeterministic composition`);
    // The actual runtime deterministic gate checks every full-tier answer, in
    // the same direction/pool and visible frame, before any import is emitted.
    const prepared = prepareCheckupTasks(composed.sections);
    if (!prepared.ok) throw new Error(`${slug}: deterministic gate failed (${prepared.errors.length} errors).`);
    assert.equal(prepared.tasks.length, CHECKUP_TOTAL, `${slug}: incomplete prepared tasks`);
    for (const task of prepared.tasks) {
      occurrences++;
      tasks.set(checkupTaskKey(task), task);
    }
  }
  return { units, tasks, occurrences };
}

function validateEvidence(record, tasks) {
  if (!plainObject(record) || !plainObject(record.task)) return { ok: false, reason: "missing-exact-task" };
  const task = tasks.get(record.checkupTaskKey);
  if (!task || checkupTaskKey(record.task) !== record.checkupTaskKey || taskBytes(record.task) !== taskBytes(task)) {
    return { ok: false, reason: "task-or-student-frame-mismatch" };
  }
  if (["itemId", "unitSlug", "kind", "revision"].some((field) => record.task[field] !== task[field])) {
    return { ok: false, reason: "task-metadata-mismatch" };
  }
  if (record.source !== "sandbox/blind-solve" || typeof record.sourceRef !== "string" || !record.sourceRef.trim()) {
    return { ok: false, reason: "missing-historical-sandbox-source" };
  }
  if (!CAPABLE_MODELS.has(record.model)) return { ok: false, reason: "unsupported-model" };
  const thinking = record.thinking;
  if (!plainObject(thinking) || !(thinking.type === "adaptive"
    || (thinking.type === "enabled" && Number.isInteger(thinking.budget_tokens) && thinking.budget_tokens >= 1024))) {
    return { ok: false, reason: "thinking-not-enabled" };
  }
  if (!UUID.test(record.teacherId ?? "") || !UUID.test(record.classId ?? "")) return { ok: false, reason: "missing-actor-or-class" };
  if (typeof record.checkedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(record.checkedAt)
    || !Number.isFinite(Date.parse(record.checkedAt)) || Date.parse(record.checkedAt) > Date.now()) {
    return { ok: false, reason: "invalid-historical-timestamp" };
  }
  if (!Array.isArray(record.candidates) || record.candidates.length === 0 || record.candidates.some((candidate) =>
    !plainObject(candidate) || typeof candidate.answer !== "string" || !candidate.answer.trim()
    || typeof candidate.confidence !== "number" || !Number.isFinite(candidate.confidence)
    || candidate.confidence < 0 || candidate.confidence > 1)) return { ok: false, reason: "invalid-candidates" };
  const graded = record.candidates.map((candidate) => ({ answer: candidate.answer, confidence: candidate.confidence,
    tier: gradeCheckupCandidate(task, candidate.answer) })).sort((a, b) => b.confidence - a.confidence);
  const top = graded[0];
  // Exactly the runtime gate's confidence contract; historical self-reported
  // tiers/verdicts are ignored and answers are regraded through today's engine.
  const passed = !!top && top.confidence >= 0.75 && top.tier === "correct"
    && !graded.some((candidate) => candidate.confidence >= 0.6 && candidate.tier !== "correct");
  if (!passed) return { ok: false, reason: "blind-answer-did-not-pass" };
  return { ok: true, record, task, graded };
}

function parseEvidence(raw, tasks) {
  if (!plainObject(raw) || raw.protocol !== PROTOCOL || !Array.isArray(raw.records)) throw new Error("Unsupported historical evidence document.");
  const accepted = new Map();
  const rejected = [];
  raw.records.forEach((record, index) => {
    const result = validateEvidence(record, tasks);
    if (!result.ok) rejected.push({ index, reason: result.reason });
    else if (accepted.has(record.checkupTaskKey)) rejected.push({ index, reason: "duplicate-task-evidence" });
    else accepted.set(record.checkupTaskKey, result);
  });
  return { supplied: raw.records.length, accepted, rejected };
}

// standard_conforming_strings is enabled in the transaction so escaping quotes
// is sufficient even if a prompt or historical answer contains backslashes.
const literal = (value) => `'${String(value).replaceAll("'", "''")}'`;
const json = (value) => `${literal(JSON.stringify(value))}::jsonb`;

function importSql(tasks, accepted) {
  const sql = ["-- CODEX DRAFT — NOT CANON. GG must review source evidence before applying.",
    "-- OFFLINE ARTIFACT ONLY: this script never executes SQL.",
    "BEGIN;", "SET LOCAL standard_conforming_strings = on;"];
  for (const [key, task] of tasks) {
    const id = contentCheckKey({ key, event: "deterministic", protocol: "checkup-import-v1" });
    const evidence = { path: "deterministic/roundtrip", checkupTaskKey: key, itemId: task.itemId, revision: task.revision,
      unitSlug: task.unitSlug, kind: task.kind, pool: task.pool, seed: `verify-${task.unitSlug}`, intelligence: false };
    sql.push(`INSERT INTO domigo_v2.content_checks (id, draft_id, check_kind, verdict, evidence) VALUES (${literal(id)}::uuid, ${literal(key)}::uuid, 'checkup_deterministic', 'passed', ${json(evidence)}) ON CONFLICT (id) DO NOTHING;`);
  }
  for (const [key, { task, record, graded }] of accepted) {
    const claimEvidence = { itemId: task.itemId, revision: String(task.revision), unitSlug: task.unitSlug, kind: task.kind,
      teacherId: record.teacherId, classId: record.classId };
    const passEvidence = { path: "sandbox/blind-solve", actor: record.teacherId, classId: record.classId,
      detail: { sourceRef: record.sourceRef, model: record.model, thinking: record.thinking, candidates: graded,
        checkedAt: record.checkedAt, taskBytesSha256: sha256(taskBytes(task)), imported: true } };
    const terminalId = contentCheckKey({ key, event: "terminal" });
    // Only a NEW claim gets its historical pass. Existing running/failed claims
    // remain untouched, so importing cannot bless a failed run or overwrite it.
    sql.push(`WITH claimed AS (INSERT INTO domigo_v2.content_checks (id, draft_id, check_kind, verdict, evidence, created_at) VALUES (${literal(key)}::uuid, ${literal(key)}::uuid, 'checkup_claim', 'checking', ${json(claimEvidence)}, ${literal(record.checkedAt)}::timestamptz) ON CONFLICT (id) DO NOTHING RETURNING id) INSERT INTO domigo_v2.content_checks (id, draft_id, check_kind, verdict, evidence, created_at) SELECT ${literal(terminalId)}::uuid, id, 'checkup_sandbox', 'passed', ${json(passEvidence)}, ${literal(record.checkedAt)}::timestamptz FROM claimed ON CONFLICT (id) DO NOTHING;`);
  }
  sql.push("COMMIT;", "");
  return sql.join("\n");
}

/** Resolve through any existing symlink before creating anything. Reports and
 * SQL must remain outside the repository, including via a symlink into it. */
function outsideRepo(directory) {
  const absolute = path.resolve(directory);
  let ancestor = absolute;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const real = path.resolve(fs.realpathSync(ancestor), path.relative(ancestor, absolute));
  if (real === REPO || real.startsWith(`${REPO}${path.sep}`)) throw new Error("--out must be outside the repository.");
  return real;
}

/** cgo-100 Nachzug 1: inspect executable syntax, not comments or the inert
 * source strings below. This is a change guard, not an execution sandbox.
 * The importer may prepare SQL, but cannot gain a shell/database capability
 * merely by adding a new import or a process-launch call. */
function offlineSourceViolations(source, ts) {
  const tree = ts.createSourceFile("import-checkup-journal.mjs", source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const violations = [];
  const allowedImports = new Set([
    "node:assert/strict", "node:crypto", "node:fs", "node:module", "node:path", "node:url",
    "../apps/web/lib/checkup.ts", "../apps/web/lib/checkup-gate.ts",
    "../packages/content-loader/src/index.ts", "../packages/db/src/checkup.ts", "../packages/engine/src/index.ts",
  ]);
  const forbiddenNames = new Set([
    "execFileSync", "execFile", "execSync", "exec", "spawn", "spawnSync", "fork",
    "psql", "pg", "eval", "Function", "binding", "_linkedBinding", "getBuiltinModule",
  ]);
  const propertyName = (node) => ts.isIdentifier(node) ? node.text
    : ts.isPropertyAccessExpression(node) ? node.name.text
      : ts.isElementAccessExpression(node) && ts.isStringLiteralLike(node.argumentExpression) ? node.argumentExpression.text : null;
  const visit = (node) => {
    if (ts.isIdentifier(node) && ["createRequire", "parserRequire"].includes(node.text)) {
      const parent = node.parent;
      const declaration = ts.isVariableDeclaration(parent) && parent.name === node && node.text === "parserRequire";
      const imported = ts.isImportSpecifier(parent) && node.text === "createRequire" && !parent.propertyName;
      const invoked = ts.isCallExpression(parent) && parent.expression === node;
      if (!declaration && !imported && !invoked) violations.push("require-alias");
    }
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      if (!ts.isStringLiteralLike(node.moduleSpecifier) || !allowedImports.has(node.moduleSpecifier.text)) violations.push("non-offline-module");
      if (ts.isImportDeclaration(node) && node.moduleSpecifier.text === "node:module") {
        const names = node.importClause?.namedBindings;
        if (node.importClause?.name || !names || !ts.isNamedImports(names) || names.elements.length !== 1
          || names.elements[0].name.text !== "createRequire" || names.elements[0].propertyName) violations.push("require-alias");
      }
    }
    if (ts.isIdentifier(node) && forbiddenNames.has(node.text)) violations.push("forbidden-capability");
    if (ts.isElementAccessExpression(node) && forbiddenNames.has(propertyName(node))) violations.push("forbidden-capability");
    if (ts.isCallExpression(node) || ts.isNewExpression(node)) {
      if (node.expression.kind === ts.SyntaxKind.ImportKeyword) violations.push("dynamic-import");
      if (propertyName(node.expression) === "createRequire" && !(ts.isIdentifier(node.expression)
        && ts.isVariableDeclaration(node.parent) && ts.isIdentifier(node.parent.name) && node.parent.name.text === "parserRequire"
        && node.arguments.length === 1 && node.arguments[0].getText(tree) === 'path.join(REPO, "packages/db/package.json")')) violations.push("require-alias");
      if (propertyName(node.expression) === "require") violations.push("unreviewed-require");
      if (propertyName(node.expression) === "parserRequire"
        && !(node.arguments?.length === 1 && ts.isStringLiteralLike(node.arguments[0]) && node.arguments[0].text === "typescript")) violations.push("unreviewed-require");
      if (node.arguments?.some((argument) => ts.isStringLiteralLike(argument) && ["psql", "pg"].includes(argument.text))) violations.push("database-command");
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  if (tree.parseDiagnostics.length) violations.push("invalid-source");
  return [...new Set(violations)];
}

function selftest() {
  // TypeScript is already a packages/db devDependency, also used by the
  // existing claim-filter guard. No new runtime dependency or provider.
  const parserRequire = createRequire(path.join(REPO, "packages/db/package.json"));
  const ts = parserRequire("typescript");
  const composed = composeCheckup("g2-u03", 2, "verify-g2-u03");
  assert.equal(composed.ok, true);
  const prepared = prepareCheckupTasks(composed.sections);
  assert.equal(prepared.ok, true);
  const task = prepared.tasks.find((entry) => entry.kind === "grammar");
  assert.ok(task);
  const key = checkupTaskKey(task);
  const tasks = new Map([[key, task]]);
  const answer = (task.kind === "vocab" ? vocabAnswers(task.item, task.pool) : task.item.answers).find((entry) => entry.tier === "full").text;
  const valid = { checkupTaskKey: key, task, source: "sandbox/blind-solve", sourceRef: "synthetic-selftest-not-real-evidence",
    model: "claude-sonnet-5", thinking: { type: "adaptive" }, teacherId: "10000000-0000-4000-8000-000000000001",
    classId: "10000000-0000-4000-8000-000000000002", checkedAt: "2026-01-01T00:00:00.000Z", candidates: [{ answer, confidence: 0.9 }] };
  let checks = 0;
  const check = (fn) => { fn(); checks++; };
  const source = fs.readFileSync(fileURLToPath(import.meta.url), "utf8");
  check(() => assert.deepEqual(offlineSourceViolations(source, ts), [], "importer must remain offline"));
  const forbiddenSources = [
    'import { execFileSync } from "node:child_process";',
    'import { execFileSync as launch } from "child_process";',
    'import postgres from "pg";',
    'export { Client } from "pg";',
    'const database = require("pg");',
    'const database = await import("pg");',
    'const database = await import(moduleName);',
    'execFileSync("psql", []);',
    'child["execFileSync"]("psql", []);',
    'launch("psql", []);',
    'const launch = execFileSync;',
    'const database = parserRequire("pg");',
    'const load = createRequire(import.meta.url); const database = load("postgres");',
    'const load = parserRequire; const database = load("postgres");',
    'import { createRequire as load } from "node:module"; const database = load(import.meta.url)("postgres");',
    'import * as moduleTools from "node:module"; const database = moduleTools.createRequire(import.meta.url)("postgres");',
    'const database = parserRequire.call(null, "postgres");',
    'const database = parserRequire("post" + "gres");',
    'const shell = process.getBuiltinModule("child_process");',
    'eval("process launch hidden in a string");',
    'new Function("process launch hidden in a string");',
  ];
  for (const mutation of forbiddenSources) check(() => assert.ok(offlineSourceViolations(`${source}\n${mutation}`, ts).length > 0, "offline guard must reject capability mutation"));
  check(() => assert.deepEqual(offlineSourceViolations(`${source}\n// execFileSync("psql");\nconst inertFixture = 'import database from "pg"';`, ts), []));
  const ci = fs.readFileSync(path.join(REPO, ".github/workflows/ci.yml"), "utf8");
  check(() => assert.equal(ci.split("\n").filter((line) => /^\s*- run: node scripts\/import-checkup-journal\.mjs --selftest(?:\s+#.*)?\s*$/.test(line)).length, 1, "offline importer selftest needs its own CI run line"));
  check(() => assert.equal(validateEvidence(valid, tasks).ok, true));
  const rejects = [
    { task: undefined }, { checkupTaskKey: crypto.randomUUID() },
    { task: { ...task, frame: { ...task.frame, lines: ["changed question"] } } },
    { task: { ...task, item: { ...task.item, rev: task.item.rev + 1 } } },
    { task: { ...task, unitSlug: "g2-u99" } },
    { source: "deterministic/roundtrip" }, { sourceRef: "" }, { model: "unreviewed-model" },
    { thinking: { type: "disabled" } }, { thinking: { type: "enabled", budget_tokens: 0 } },
    { teacherId: "" }, { classId: "" }, { checkedAt: "invalid" }, { checkedAt: "2999-01-01T00:00:00Z" },
    { candidates: [] }, { candidates: [{ answer, confidence: 1.1 }] },
    { candidates: [{ answer, confidence: 0.749 }] },
    { candidates: [{ answer: "zzz definitely not correct zzz", confidence: 0.9 }] },
    { candidates: [{ answer, confidence: 0.9 }, { answer: "zzz definitely not correct zzz", confidence: 0.6 }] },
  ];
  for (const mutation of rejects) check(() => assert.equal(validateEvidence({ ...valid, ...mutation }, tasks).ok, false));
  check(() => assert.equal(validateEvidence({ ...valid, candidates: [{ answer, confidence: 0.75 }, { answer: "zzz definitely not correct zzz", confidence: 0.599 }] }, tasks).ok, true));
  check(() => assert.equal(parseEvidence({ protocol: PROTOCOL, records: [valid, valid] }, tasks).rejected.length, 1));
  check(() => assert.throws(() => parseEvidence({ records: [valid] }, tasks)));
  const deterministic = importSql(tasks, new Map());
  check(() => assert.match(deterministic, /'checkup_deterministic'/));
  check(() => assert.doesNotMatch(deterministic, /'checkup_claim'|'checkup_sandbox'/));
  const intelligence = importSql(tasks, parseEvidence({ protocol: PROTOCOL, records: [valid] }, tasks).accepted);
  check(() => assert.ok(intelligence.includes(literal(contentCheckKey({ key, event: "terminal" })))));
  check(() => assert.match(intelligence, /ON CONFLICT \(id\) DO NOTHING RETURNING id\) INSERT/));
  check(() => assert.match(intelligence, /FROM claimed ON CONFLICT \(id\) DO NOTHING/));
  check(() => assert.equal(literal("x'; DROP TABLE ignored; --\\"), "'x''; DROP TABLE ignored; --\\'"));
  check(() => assert.throws(() => outsideRepo(path.join(REPO, "reports")), /outside/));
  console.log(JSON.stringify({ selftest: "passed", checks }));
}

function main(args) {
  if (args.length === 1 && args[0] === "--selftest") return selftest();
  let out;
  let evidenceFile;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out" && args[i + 1]) out = args[++i];
    else if (args[i] === "--evidence" && args[i + 1]) evidenceFile = args[++i];
    else throw new Error("Usage: --out <outside-directory> [--evidence <reviewed-file>] | --selftest");
  }
  if (!out) throw new Error("--out <outside-directory> is required; no database operation is available.");
  out = outsideRepo(out);
  const { units, tasks, occurrences } = collectTasks();
  const bytes = evidenceFile ? fs.readFileSync(evidenceFile, "utf8") : null;
  const historical = bytes ? parseEvidence(JSON.parse(bytes), tasks) : { supplied: 0, accepted: new Map(), rejected: [] };
  const receipt = {
    label: "CODEX DRAFT — NOT CANON", protocol: "checkup-journal-import-v1", generatedAt: new Date().toISOString(),
    seed: "verify-${slug}", deterministic: { approvedUnits: units.length, taskOccurrences: occurrences,
      uniqueItemIds: new Set([...tasks.values()].map((task) => task.itemId)).size, uniqueStudentFrames: tasks.size,
      passed: tasks.size, checkKind: "checkup_deterministic", intelligence: false },
    historical: { supplied: historical.supplied, acceptedIntelligenceFrames: historical.accepted.size,
      rejected: historical.rejected, evidenceSha256: bytes ? sha256(bytes) : null,
      sourceAuthenticity: "UNVERIFIZIERT: GG must review archived source references before SQL application." },
    database: "UNVERIFIZIERT — no database connection or SQL execution", sandboxRuns: 0,
    units, tasks: [...tasks].map(([key, task]) => ({ key, itemId: task.itemId, unitSlug: task.unitSlug,
      revision: task.revision, kind: task.kind, pool: task.pool, taskBytesSha256: sha256(taskBytes(task)) })),
  };
  // Reject a partially invalid historical batch as a whole. Only the receipt
  // is written; a reviewer must fix/remove rejected records and run again.
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, "receipt.json"), JSON.stringify(receipt, null, 2) + "\n", { flag: "wx" });
  if (historical.rejected.length) {
    console.log(JSON.stringify({ deterministic: receipt.deterministic, historicalRejected: historical.rejected.length, sqlWritten: false }));
    process.exitCode = 1;
    return;
  }
  fs.writeFileSync(path.join(out, "import.sql"), importSql(tasks, historical.accepted), { flag: "wx" });
  fs.writeFileSync(path.join(out, "REVIEW.txt"), [
    "CODEX DRAFT — NOT CANON", "Offline import artifact. Nothing has been written to a database.",
    "1. GG compares receipt units/counts and hashes with the reviewed source revision.",
    "2. For each historical intelligence row, GG verifies the archived sandbox source reference, exact task/frame, model, thinking and actor/class attribution.",
    "3. GG applies import.sql only through the separately authorized database operations workflow; Codex does not execute it.",
    "4. GG checks inserted counts. ON CONFLICT preserves all existing claims/verdicts. The SQL can therefore insert fewer rows than the receipt's candidate coverage.",
    "Deterministic-only rows do not unlock the LLM gate; without accepted historical evidence, reusable intelligence coverage is zero.",
    "This script cannot prove historical source authenticity or current database journal coverage.", "",
  ].join("\n"), { flag: "wx" });
  console.log(JSON.stringify({ deterministic: receipt.deterministic, reusableIntelligenceFrames: historical.accepted.size, sandboxRuns: 0, sqlWritten: true }));
}

try { main(process.argv.slice(2)); }
catch (error) {
  // Do not echo arbitrary input records, actor/class ids, or environment data.
  console.error(`Offline checkup import failed: ${error instanceof Error && error.name !== "SyntaxError" ? error.message : "invalid input"}`);
  process.exitCode = 1;
}
