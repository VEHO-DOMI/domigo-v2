import { afterAll, beforeAll, beforeEach, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import * as schema from "./schema.ts";
import type { Db } from "./index.ts";
import { recordHttpAttempt } from "./http-attempt.ts";
import { getPracticeReceipt } from "./practice-receipt.ts";
import { recordAttempt, type RecordAttemptInput } from "./persist.ts";
import { classScope } from "./scope.ts";
import { nextBox, nextDueAt } from "./review.ts";
import { computeNextStreak, viennaDayBefore, viennaDayString } from "./streak.ts";

const pg = new PGlite(), db = drizzle(pg, { schema }) as unknown as Db;
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const now = new Date("2026-10-24T10:00:00Z");
const input: RecordAttemptInput = { userId: id(1), classId: id(2), clientAttemptId: id(3), itemId: "g2u01.w.synthetic",
  kind: "vocab", unitSlug: "g2-u01", grade: 2, mode: "practice", tier: "correct", xpAwarded: 20 };
const scope = classScope([input.classId]);
const receipt = () => getPracticeReceipt(db, scope, input);
async function counts() {
  return (await pg.query<{ attempts: number; xp: number; reps: number }>(`SELECT
    (SELECT count(*)::int FROM domigo_v2.practice_attempts) attempts,
    COALESCE((SELECT sum(xp)::int FROM domigo_v2.user_progress),0) xp,
    COALESCE((SELECT sum(reps)::int FROM domigo_v2.review_queue),0) reps`)).rows[0];
}
let legacyMigrationRow: unknown;
beforeAll(async () => {
  const snapshot = JSON.parse(readFileSync(new URL("../drizzle/meta/0026_snapshot.json", import.meta.url), "utf8"));
  await pg.exec("CREATE SCHEMA domigo_v2");
  for (const table of Object.values(snapshot.tables) as Array<{ name: string; columns: Record<string, { name: string; type: string; primaryKey: boolean; notNull: boolean; default?: string }>; indexes: Record<string, { name: string; isUnique: boolean; columns: Array<{ expression: string; isExpression: boolean }>; where?: string }> }>) {
    if (!["practice_attempts", "review_queue", "user_progress"].includes(table.name)) continue;
    const columns = Object.values(table.columns).map(c => `"${c.name}" ${c.type}${c.primaryKey ? " PRIMARY KEY" : ""}${c.notNull ? " NOT NULL" : ""}${"default" in c ? ` DEFAULT ${c.default}` : ""}`);
    await pg.exec(`CREATE TABLE domigo_v2."${table.name}" (${columns.join(",")})`);
    for (const index of Object.values(table.indexes)) await pg.exec(`CREATE ${index.isUnique ? "UNIQUE " : ""}INDEX "${index.name}" ON domigo_v2."${table.name}" (${index.columns.map(c => c.isExpression ? c.expression : `"${c.expression}"`).join(",")})${index.where ? ` WHERE ${index.where}` : ""}`);
  }
  await pg.query(`INSERT INTO domigo_v2.practice_attempts(user_id,class_id,item_id,kind,unit_slug,grade,mode,tier,correct,xp_awarded,client_attempt_id)
    VALUES($1,$2,'g2u01.w.synthetic','vocab','g2-u01',2,'practice','correct',true,20,$3)`, [input.userId,input.classId,input.clientAttemptId]);
  await pg.exec(readFileSync(new URL("../drizzle/0027_atomic_attempt_booking.sql", import.meta.url), "utf8"));
  legacyMigrationRow = (await pg.query("SELECT xp_awarded,booked_at FROM domigo_v2.practice_attempts")).rows[0];
  await pg.exec(`CREATE FUNCTION domigo_v2.synthetic_failure() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN IF current_setting('cgo154.fail_step',true) = TG_ARGV[0] THEN RAISE EXCEPTION 'synthetic_failure'; END IF; RETURN NEW; END $$;
    CREATE TRIGGER fail_attempt AFTER INSERT ON domigo_v2.practice_attempts FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_failure('attempt');
    CREATE TRIGGER fail_queue AFTER INSERT OR UPDATE OF box, reps ON domigo_v2.review_queue FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_failure('queue');
    CREATE TRIGGER fail_due AFTER UPDATE OF due_at ON domigo_v2.review_queue FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_failure('due');
    CREATE TRIGGER fail_progress AFTER INSERT OR UPDATE ON domigo_v2.user_progress FOR EACH ROW EXECUTE FUNCTION domigo_v2.synthetic_failure('progress');
    CREATE TRIGGER fail_mark AFTER UPDATE ON domigo_v2.practice_attempts FOR EACH ROW WHEN (NEW.booked_at IS NOT NULL) EXECUTE FUNCTION domigo_v2.synthetic_failure('mark');`);
});
beforeEach(async () => { await pg.exec("SET cgo154.fail_step = ''; TRUNCATE domigo_v2.practice_attempts, domigo_v2.review_queue, domigo_v2.user_progress"); });
afterAll(() => pg.close());

it("migration preserves old awards without inventing completed bookings", () => {
  expect(legacyMigrationRow).toEqual({ xp_awarded: 20, booked_at: null });
});
for (const seeded of [false, true]) for (const step of ["attempt", "queue", "due", "progress", "mark"]) it(`rolls back after ${step} (existing=${seeded}); replay books exactly once`, async () => {
  if (seeded) await recordHttpAttempt(db, scope, { ...input, clientAttemptId: id(99) }, now);
  const old = seeded ? 1 : 0;
  await pg.exec(`SET cgo154.fail_step = '${step}'`);
  await expect(recordHttpAttempt(db, scope, input, now)).rejects.toThrow();
  expect(await counts()).toEqual({ attempts: old, xp: old * 20, reps: old });
  expect(await receipt()).toBeNull();
  await pg.exec("SET cgo154.fail_step = ''");
  const booked = await recordHttpAttempt(db, scope, input, now);
  expect(booked).toMatchObject({ duplicate: false, box: 2 + old, streak: 1, receipt: { tier: "correct", xpAwarded: 20 } });
  expect(booked.dueAt).toEqual(nextDueAt(2 + old, now));
  for (let i = 0; i < 3; i++) expect(await recordHttpAttempt(db, scope, { ...input, tier: "wrong", xpAwarded: 0 }, now))
    .toMatchObject({ duplicate: true, receipt: { tier: "correct", xpAwarded: 20 } });
  expect(await counts()).toEqual({ attempts: old + 1, xp: (old + 1) * 20, reps: old + 1 });
  expect(await receipt()).toEqual({ tier: "correct", xpAwarded: 20 });
});
it("preserves unmarked legacy partial or complete rows and never grants their receipt", async () => {
  await recordAttempt(db, scope, input);
  const before = await counts();
  await expect(recordHttpAttempt(db, scope, input, now)).rejects.toThrow();
  expect(await counts()).toEqual(before);
  expect(await receipt()).toBeNull();
});
for (const field of ["classId", "itemId", "mode", "kind", "unitSlug", "grade"] as const) it(`rejects a replay with different ${field}`, async () => {
  await recordHttpAttempt(db, scope, input, now);
  const changed = { ...input, [field]: field === "classId" ? id(9) : field === "grade" ? 3 : field === "kind" ? "grammar" : "synthetic-different" } as RecordAttemptInput;
  await expect(recordHttpAttempt(db, classScope([input.classId, id(9)]), changed, now)).rejects.toThrow();
  expect(await counts()).toEqual({ attempts: 1, xp: 20, reps: 1 });
});
it("one owner cannot replay another owner's key and empty scopes cannot write", async () => {
  await expect(recordHttpAttempt(db, classScope([]), input, now)).rejects.toThrow();
  await recordHttpAttempt(db, scope, input, now);
  await recordHttpAttempt(db, scope, { ...input, userId: id(9) }, now);
  expect(await counts()).toEqual({ attempts: 2, xp: 40, reps: 2 });
});
for (const kind of ["vocab", "grammar", "listening", "reading"] as const) it(`${kind} writes the existing XP pool and review policy`, async () => {
  await recordHttpAttempt(db, scope, { ...input, kind }, now);
  expect((await pg.query("SELECT xp,grammar_xp FROM domigo_v2.user_progress")).rows[0])
    .toEqual({ xp: kind === "vocab" ? 20 : 0, grammar_xp: kind === "vocab" ? 0 : 20 });
  expect((await counts())?.reps).toBe(kind === "vocab" || kind === "grammar" ? 1 : 0);
});
for (const tier of ["correct", "partial", "close", "wrong"] as const) it(`${tier} matches existing five-box policy`, async () => {
  for (let box = 1; box <= 5; box++) {
    await pg.exec("TRUNCATE domigo_v2.practice_attempts, domigo_v2.review_queue, domigo_v2.user_progress");
    await pg.query("INSERT INTO domigo_v2.review_queue(user_id,item_id,kind,unit_slug,grade,box,reps,lapses) VALUES($1,$2,'vocab','g2-u01',2,$3,4,2)", [input.userId,input.itemId,box]);
    const result = await recordHttpAttempt(db, scope, { ...input, tier }, now), expectedBox = nextBox(box, tier);
    expect(result.box).toBe(expectedBox); expect(result.dueAt).toEqual(nextDueAt(expectedBox, now));
    expect((await pg.query("SELECT reps,lapses FROM domigo_v2.review_queue")).rows[0]).toEqual({ reps: 5, lapses: tier === "wrong" ? 3 : 2 });
  }
});
for (const last of [null, viennaDayString(now), viennaDayBefore(now), "2026-10-01"]) it(`streak matches policy from ${last}`, async () => {
  await pg.query("INSERT INTO domigo_v2.user_progress(user_id,streak,last_session_date) VALUES($1,4,$2)", [input.userId,last]);
  const booked = await recordHttpAttempt(db, scope, input, now);
  expect(booked.streak).toBe(computeNextStreak({ lastSessionDate: last, currentStreak: 4, today: viennaDayString(now), yesterday: viennaDayBefore(now) }).newStreak);
});
it("retries and distinct answers are additive without duplicate queue promotions", async () => {
  await Promise.all(Array.from({length:5}, () => recordHttpAttempt(db, scope, input, now)));
  expect(await counts()).toEqual({ attempts: 1, xp: 20, reps: 1 });
  await Promise.all([4,5].map(n => recordHttpAttempt(db, scope, { ...input, clientAttemptId: id(n) }, now)));
  expect(await counts()).toEqual({ attempts: 3, xp: 60, reps: 3 });
});
it("story grammar is reviewed while legacy scene-only items stay out of review", async () => {
  await recordHttpAttempt(db, scope, { ...input, kind: "grammar", reviewContext: "story", itemId: "g2u01.ci.synthetic" }, now);
  await recordHttpAttempt(db, scope, { ...input, clientAttemptId:id(4), kind:"grammar", reviewContext:"story" }, now);
  expect((await counts())?.reps).toBe(1);
});
