/** Real POST + real history writer + PostgreSQL in local memory. Synthetic identities only. */
import assert from "node:assert/strict";
import { before, beforeEach, after, describe, it } from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fixture, resetSchoolFixture } from "../scripts/lib/school-test-harness.mjs";
import { loadUnit } from "@domigo/content-loader";
import { vocabAnswers, vocabularyContentSnapshot } from "@domigo/engine";
import { deleteUserData } from "@domigo/db";
import { VocabularyCheckInput } from "./vocabulary-check.ts";
const requireDb = createRequire(new URL("../../../packages/db/package.json", import.meta.url));
const { PGlite } = requireDb("@electric-sql/pglite"), { drizzle } = requireDb("drizzle-orm/pglite");
const { POST } = await import("../app/api/attempts/route.ts");
const pg = new PGlite(), db = drizzle(pg);
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const A = id(1), B = id(2), C = id(3), OUTSIDE = id(4), TEACHER = id(5);
const item = loadUnit("g2-u01").vocab[0]!;
const hash = createHash("sha256").update(vocabularyContentSnapshot(item)).digest("hex");
type Col = { name: string; type: string; primaryKey: boolean; notNull: boolean; default?: unknown };
type Index = { name: string; isUnique: boolean; where?: string; columns: { expression: string; isExpression: boolean; asc: boolean }[] };
type Table = { columns: Record<string, Col>; checkConstraints: Record<string, { name: string; value: string }>; indexes: Record<string, Index> };
before(async () => {
  const snapshot = JSON.parse(readFileSync(new URL("../../../packages/db/drizzle/meta/0025_snapshot.json", import.meta.url), "utf8")) as { tables: Record<string, Table> };
  await pg.exec("CREATE SCHEMA domigo_v2");
  for (const [full, table] of Object.entries(snapshot.tables)) {
    const name = full.replace("domigo_v2.", "");
    const columns = Object.values(table.columns).map(c => `"${c.name}" ${c.type}${c.primaryKey ? " PRIMARY KEY" : ""}${c.notNull ? " NOT NULL" : ""}${"default" in c ? ` DEFAULT ${c.default}` : ""}`);
    const checks = Object.values(table.checkConstraints).map(c => `CONSTRAINT "${c.name}" CHECK (${c.value})`);
    await pg.exec(`CREATE TABLE "domigo_v2"."${name}" (${[...columns, ...checks].join(",")})`);
    for (const idx of Object.values(table.indexes)) await pg.exec(`CREATE ${idx.isUnique ? "UNIQUE " : ""}INDEX "${idx.name}" ON "domigo_v2"."${name}" (${idx.columns.map(c => `${c.isExpression ? c.expression : `"${c.expression}"`}${c.asc ? "" : " DESC"}`).join(",")})${idx.where ? ` WHERE ${idx.where}` : ""}`);
  }
  await pg.exec(readFileSync(new URL("../../../packages/db/drizzle/0026_vocabulary_checks.sql", import.meta.url), "utf8"));
  for (const classId of [C, OUTSIDE]) await pg.query("INSERT INTO domigo_v2.classes (id,name,grade,teacher_id,invite_code) VALUES ($1,'Synthetic fixture',2,$2,$3)", [classId, TEACHER, classId]);
});
beforeEach(async () => {
  resetSchoolFixture(); fixture.db = db;
  fixture.session = { user: { id: A, classId: C, role: "student", scope: [C] } };
  await pg.exec("TRUNCATE domigo_v2.vocabulary_checks, domigo_v2.vocabulary_visits, domigo_v2.practice_attempts, domigo_v2.review_queue, domigo_v2.user_progress, domigo_v2.reserved_items, domigo_v2.content_overrides, domigo_v2.content_drafts");
  await pg.exec("UPDATE domigo_v2.classes SET grade=2");
});
after(async () => { await pg.close(); });
for (const sourceMode of ["practice", "test:vocab"]) describe(sourceMode, () => {
const evidence = () => ({ schema: "vocabulary-check@1", visitId: id(10), checkNumber: 1, maxChecks: 3,
  itemRevision: item.rev, displayedContentSha256: hash, sourceMode,
  checkedAt: "2026-10-24T07:30:00.000Z", reportedTier: "wrong", helpShown: [] as string[],
});
function body(check: Record<string, unknown> = {}, patch: Record<string, unknown> = {}) {
  return { ownerId: A, clientAttemptId: id(20), itemId: item.id, mode: "vocabulary-check",
    input: { kind: "vocab", value: "synthetic impossible qzx", pool: "carrier" },
    vocabularyCheck: { ...evidence(), ...check }, ...patch,
  };
}
const post = async (value: unknown) => {
  const response = await POST(new Request("https://synthetic.invalid/api/attempts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(value) }));
  return { status: response.status, data: await response.json() };
};
const rows = async () => (await pg.query("SELECT * FROM domigo_v2.vocabulary_checks ORDER BY check_number")).rows;
async function noRewards() {
  for (const table of ["practice_attempts", "review_queue", "user_progress"]) assert.equal((await pg.query(`SELECT count(*)::int AS n FROM domigo_v2.${table}`)).rows[0].n, 0, table);
}
it("a first wrong check persists without a completed attempt, points or review scheduling", async () => {
  const result = await post(body()); assert.equal(result.status, 200); assert.equal(result.data.ok, true);
  assert.equal("tier" in result.data, false); assert.equal("xpAwarded" in result.data, false); assert.equal("receipt" in result.data, false);
  const [row] = await rows(); assert.equal(row.evidence.serverTier, "wrong"); assert.equal(row.evidence.reportedComplete, false);
  assert.equal(row.item_id, item.id); assert.equal(row.unit_slug, "g2-u01"); assert.equal(row.grade, 2);
  assert.equal(row.evidence.contentMatch, true); assert.equal(row.evidence.gradedContent.sha256, hash);
  assert.equal(row.client_checked_at.toISOString(), evidence().checkedAt);
  assert.ok(row.received_at instanceof Date); assert.ok(row.recorded_at instanceof Date);
  assert.equal(JSON.stringify(row).includes("synthetic impossible qzx"), false); await noRewards();
});
it("out-of-order arrival retains each check number and does not invent missing checks", async () => {
  const correct = vocabAnswers(item, "carrier").find(a => a.tier === "full")!.text;
  assert.equal((await post(body({ checkNumber: 2, reportedTier: "correct", helpShown: ["hint"] }, { clientAttemptId: id(21), input: { kind: "vocab", value: correct, pool: "carrier" } }))).status, 200);
  assert.deepEqual((await rows()).map((row: {check_number: number}) => row.check_number), [2]);
  assert.equal((await post(body())).status, 200);
  const saved = await rows(); assert.deepEqual(saved.map((row: {check_number: number}) => row.check_number), [1, 2]);
  assert.deepEqual(saved.map((row: {evidence: {helpShown: string[]}}) => row.evidence.helpShown), [[], ["hint"]]);
  assert.equal(saved[1].evidence.serverTier, "correct"); await noRewards();
});
for (const pool of ["carrier", "definition", "deToEn", "enToDe"] as const) it(`server grades ${pool} independently of the reported grade`, async () => {
  const value = vocabAnswers(item, pool).find(a => a.tier === "full")!.text;
  assert.equal((await post(body({}, { input: { kind: "vocab", value, pool } }))).status, 200);
  const [row] = await rows(); assert.equal(row.pool, pool); assert.equal(row.evidence.reportedTier, "wrong"); assert.equal(row.evidence.serverTier, "correct"); await noRewards();
});
it("exact replay preserves all first-write bytes and acknowledges before renewed eligibility checks", async () => {
  const payload = body(); assert.equal((await post(payload)).data.duplicate, false); const first = (await rows())[0];
  await pg.exec("UPDATE domigo_v2.classes SET grade=1");
  const replay = await post(payload); assert.equal(replay.status, 200); assert.equal(replay.data.duplicate, true);
  assert.deepEqual(await rows(), [first]); await noRewards();
});
it("a repeated visit/check number with a new transport ID deduplicates identical content", async () => {
  await post(body()); const r = await post(body({}, { clientAttemptId: id(99) }));
  assert.equal(r.status, 200); assert.equal(r.data.duplicate, true); assert.equal((await rows()).length, 1);
});
for (const change of ["answer", "hint", "time", "visit"] as const) it(`reused event ID with changed ${change} is a conflict, never a rewrite`, async () => {
  await post(body()); const first = (await rows())[0];
  const changed = body(change === "hint" ? { helpShown: ["hint"] } : change === "time" ? { checkedAt: "2026-10-25T07:30:00.000Z" } : change === "visit" ? { visitId: id(30) } : {},
    change === "answer" ? { input: { kind: "vocab", value: "changed input", pool: "carrier" } } : {});
  assert.equal((await post(changed)).status, 409); assert.deepEqual(await rows(), [first]);
});
for (const change of ["pool", "revision", "hash", "mode", "word"] as const) it(`one visit cannot mix ${change} across check numbers`, async () => {
  await post(body());
  const patch = change === "pool" ? { input: { kind: "vocab", value: "wrong", pool: "definition" } } : change === "word" ? { itemId: loadUnit("g2-u01").vocab[1]!.id } : {};
  const detail = change === "revision" ? { itemRevision: item.rev + 1 } : change === "hash" ? { displayedContentSha256: "a".repeat(64) } : change === "mode" ? { sourceMode: "review" } : {};
  assert.equal((await post(body({ checkNumber: 2, ...detail }, { clientAttemptId: id(21), ...patch }))).status, 409);
  assert.equal((await rows()).length, 1); await noRewards();
});
it("unknown displayed hashes remain unknown; a later check may provide a known hash", async () => {
  await post(body({ displayedContentSha256: null, checkedAt: null }));
  assert.equal((await post(body({ checkNumber: 2 }, { clientAttemptId: id(21) }))).status, 200);
  const saved = await rows(); assert.equal(saved[0].evidence.contentMatch, null); assert.equal(saved[0].client_checked_at, null); assert.equal(saved[1].evidence.contentMatch, true);
});
it("same transport ID belongs independently to different owners", async () => {
  await post(body()); fixture.session!.user.id = B;
  assert.equal((await post(body({}, { ownerId: B }))).status, 200); assert.equal((await rows()).length, 2);
});
it("foreign owner and foreign class scope fail before any record", async () => {
  assert.equal((await post(body({}, { ownerId: B }))).status, 409);
  fixture.session!.user.scope = [OUTSIDE]; assert.equal((await post(body())).status, 403); assert.equal((await rows()).length, 0);
});
it("a new reserved or wrong-year check is refused", async () => {
  await pg.query("INSERT INTO domigo_v2.reserved_items (class_id,item_id,active) VALUES ($1,$2,true)", [C, item.id]);
  assert.equal((await post(body())).status, 403);
  await pg.exec("TRUNCATE domigo_v2.reserved_items; UPDATE domigo_v2.classes SET grade=1");
  assert.equal((await post(body())).status, 403); assert.equal((await rows()).length, 0);
});
for (const patch of [{ checkNumber: 0 }, { checkNumber: 4 }, { maxChecks: 1, checkNumber: 2 }, { helpShown: ["hint", "hint"] }, { sourceMode: "game:g2" }, ...["test:grammar", "test:listening", "test:reading", "test:writing", "test:vocab-extra", "assignment", "assign:00000000-0000-4000-8000-000000000010", "speed", "arena", "duel:00000000-0000-4000-8000-000000000010", "live:00000000-0000-4000-8000-000000000010", "quiz:00000000-0000-4000-8000-000000000010"].map(sourceMode => ({ sourceMode })), { visitId: "not-a-uuid" }, { checkedAt: "yesterday" }, { input: "forbidden raw copy" }, { displayedContentSha256: "bad" }]) it(`rejects malformed check ${JSON.stringify(patch)}`, async () => {
  assert.equal(VocabularyCheckInput.safeParse({ ...evidence(), ...patch }).success, false);
  assert.equal((await post(body(patch))).status, 400); assert.equal((await rows()).length, 0);
});
it("metadata cannot redirect another mode, and history mode requires metadata and a direction", async () => {
  for (const payload of [body({}, { mode: "practice" }), body({}, { vocabularyCheck: undefined }), body({}, { input: { kind: "vocab", value: "x" } }), body({}, { vocabularyHistory: { schema: "vocabulary-completion@1", itemRevision: 1, displayedContentSha256: null, maxChecks: 3, checks: [{ reportedTier: "correct", helpShown: [] }] } })]) assert.equal((await post(payload)).status, 400);
  assert.equal((await rows()).length, 0); await noRewards();
});
it("rejects non-vocabulary input, unknown pools and grammar item references", async () => {
  for (const patch of [
    {input:{kind:"text",value:"x"}},
    {input:{kind:"vocab",value:"x",pool:"invented"}},
    {itemId:loadUnit("g2-u01").grammar[0]!.id},
  ]) assert.equal((await post(body({}, patch))).status, 400);
  assert.equal((await rows()).length,0); await noRewards();
});
it("third-first-second delivery and duplicate retain a hole until the missing check arrives", async () => {
  const make = (n: number) => body({checkNumber:n}, {clientAttemptId:id(20+n)});
  await post(make(3)); await post(make(1)); await post(make(3));
  assert.deepEqual((await rows()).map((r: {check_number:number})=>r.check_number),[1,3]);
  await post(make(2)); await post(make(2));
  assert.deepEqual((await rows()).map((r: {check_number:number})=>r.check_number),[1,2,3]); await noRewards();
});
it("history storage failure cannot claim success or fall into the reward writer", async () => {
  await pg.exec("ALTER TABLE domigo_v2.vocabulary_checks RENAME TO vocabulary_checks_unavailable");
  try { const reply = await post(body()); assert.equal(reply.status, 503); assert.equal(reply.data.ok, false); await noRewards(); }
  finally { await pg.exec("ALTER TABLE domigo_v2.vocabulary_checks_unavailable RENAME TO vocabulary_checks"); }
});
it("account deletion removes both checks and visit headers, preserving the other owner", async () => {
  await post(body()); fixture.session!.user.id = B; await post(body({}, { ownerId: B }));
  const deleted = await deleteUserData(db, A);
  assert.equal(deleted.zeilen.vocabulary_checks, 1); assert.equal(deleted.zeilen.vocabulary_visits, 1);
  assert.deepEqual((await rows()).map((row: {user_id: string}) => row.user_id), [B]);
  assert.equal((await pg.query("SELECT count(*)::int AS n FROM domigo_v2.vocabulary_visits")).rows[0].n, 1);
});

it("concurrent exact requests converge on one check and one visit", async () => {
  const answers = await Promise.all([post(body()), post(body())]);
  assert.ok(answers.every(a => a.status === 200)); assert.equal(answers.filter(a => a.data.duplicate).length, 1);
  assert.equal((await rows()).length, 1); assert.equal((await pg.query("SELECT count(*)::int AS n FROM domigo_v2.vocabulary_visits")).rows[0].n, 1); await noRewards();
});
it("concurrent incompatible visit directions cannot both be stored", async () => {
  const results = await Promise.all([post(body()), post(body({ checkNumber: 2 }, { clientAttemptId: id(21), input: { kind: "vocab", value: "wrong", pool: "definition" } }))]);
  assert.deepEqual(results.map(r => r.status).sort(), [200, 409]); assert.equal((await rows()).length, 1); await noRewards();
});
it("a later known fingerprint never silently rewrites an unknown initial visit", async () => {
  await post(body({ displayedContentSha256: null }));
  await post(body({ checkNumber: 2 }, { clientAttemptId: id(21) }));
  assert.equal((await pg.query("SELECT displayed_sha256 FROM domigo_v2.vocabulary_visits")).rows[0].displayed_sha256, null);
  assert.equal((await rows())[1].evidence.displayedContent.sha256, hash);
});

it("an insert failure leaves only a provisional header; retry persists exactly one check", async () => {
  await pg.exec(`CREATE FUNCTION domigo_v2.fail_check_insert() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic insert failure'; END; $$;
    CREATE TRIGGER fail_check_insert BEFORE INSERT ON domigo_v2.vocabulary_checks FOR EACH ROW EXECUTE FUNCTION domigo_v2.fail_check_insert();`);
  try {
    assert.equal((await post(body())).status, 503); assert.equal((await rows()).length, 0);
    assert.equal((await pg.query("SELECT count(*)::int AS n FROM domigo_v2.vocabulary_visits")).rows[0].n, 1); await noRewards();
  } finally { await pg.exec("DROP TRIGGER fail_check_insert ON domigo_v2.vocabulary_checks; DROP FUNCTION domigo_v2.fail_check_insert()"); }
  assert.equal((await post(body())).data.duplicate, false); assert.equal((await rows()).length, 1); await noRewards();
});
it("same-revision wording changes are visible; a saved event survives later content removal unchanged", async () => {
  await pg.query("INSERT INTO domigo_v2.content_overrides (item_id,unit_slug,kind,patch,status) VALUES ($1,'g2-u01','vocab',$2,'published')", [item.id, JSON.stringify({s:"A different synthetic context: ___."})]);
  assert.equal((await post(body())).status, 200); const first = (await rows())[0];
  assert.equal(first.evidence.gradedContent.revision, item.rev); assert.notEqual(first.evidence.gradedContent.sha256, hash); assert.equal(first.evidence.contentMatch, false);
  await pg.query("INSERT INTO domigo_v2.content_drafts (item_id,unit_slug,kind,item,action,status) VALUES ($1,'g2-u01','vocab','{}','remove','published')", [item.id]);
  assert.equal((await post(body())).data.duplicate, true); assert.deepEqual(await rows(), [first]);
  assert.equal((await post(body({visitId:id(40)}, {clientAttemptId:id(41)}))).status, 400);
});
it("single-attempt and third-wrong terminal claims are explicit without a reward", async () => {
  await post(body({maxChecks:1}));
  await post(body({visitId:id(30),checkNumber:3}, {clientAttemptId:id(31)}));
  assert.deepEqual((await rows()).map((r: {evidence: {reportedComplete: boolean}}) => r.evidence.reportedComplete), [true,true]); await noRewards();
});
it("account deletion remains compatible before migration 0026", async () => {
  await pg.exec("ALTER TABLE domigo_v2.vocabulary_checks RENAME TO vocabulary_checks_before_0026; ALTER TABLE domigo_v2.vocabulary_visits RENAME TO vocabulary_visits_before_0026");
  try { const result = await deleteUserData(db,A); assert.equal(result.zeilen.vocabulary_checks,0); assert.equal(result.zeilen.vocabulary_visits,0); }
  finally { await pg.exec("ALTER TABLE domigo_v2.vocabulary_checks_before_0026 RENAME TO vocabulary_checks; ALTER TABLE domigo_v2.vocabulary_visits_before_0026 RENAME TO vocabulary_visits"); }
});
it("account deletion propagates other history-storage failures so deletion can retry", async () => {
  await post(body());
  await pg.exec(`CREATE FUNCTION domigo_v2.fail_check_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'synthetic delete failure'; END; $$;
    CREATE TRIGGER fail_check_delete BEFORE DELETE ON domigo_v2.vocabulary_checks FOR EACH ROW EXECUTE FUNCTION domigo_v2.fail_check_delete();`);
  try { await assert.rejects(() => deleteUserData(db,A)); assert.equal((await rows()).length,1); }
  finally { await pg.exec("DROP TRIGGER fail_check_delete ON domigo_v2.vocabulary_checks; DROP FUNCTION domigo_v2.fail_check_delete()"); }
});

it("a UI-gradeable answer longer than 500 characters is still recorded", async () => {
  const payload = body({}, {input:{kind:"vocab",value:"q".repeat(501),pool:"carrier"}});
  assert.equal((await post(payload)).status,200); assert.equal((await rows()).length,1);
  assert.equal((await rows())[0].evidence.serverTier,"wrong"); await noRewards();
});

});
