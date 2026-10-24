import { afterAll, beforeAll, expect, it } from "vitest";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { getPracticeReceipt } from "./practice-receipt.ts";
import { classScope } from "./scope.ts";
import type { Db } from "./index.ts";
const pg = new PGlite(), db = drizzle(pg) as unknown as Db;
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const attempt = { classId: id(1), userId: id(2), clientAttemptId: id(3), itemId: "g2u01.w.synthetic", mode: "practice" };
beforeAll(async () => {
  await pg.exec("CREATE SCHEMA domigo_v2; CREATE TABLE domigo_v2.practice_attempts (class_id text, user_id text, client_attempt_id text, item_id text, mode text, tier text, xp_awarded integer, booked_at timestamptz)");
  await pg.query("INSERT INTO domigo_v2.practice_attempts VALUES ($1,$2,$3,$4,$5,'partial',7,now())", [attempt.classId, attempt.userId, attempt.clientAttemptId, attempt.itemId, attempt.mode]);
});
afterAll(() => pg.close());
it("reads the stored award for the exact authenticated attempt", async () => {
  expect(await getPracticeReceipt(db, classScope([attempt.classId]), attempt)).toEqual({ tier: "partial", xpAwarded: 7 });
});
for (const scope of [[], [id(9)]]) it(`scope ${JSON.stringify(scope)} cannot read the receipt`, async () => {
  expect(await getPracticeReceipt(db, classScope(scope), attempt)).toBeNull();
});
for (const field of ["classId", "userId", "clientAttemptId", "itemId", "mode"] as const) it(`cannot substitute ${field} on a receipt`, async () => {
  expect(await getPracticeReceipt(db, classScope([attempt.classId, id(9)]), { ...attempt, [field]: id(9) })).toBeNull();
});

it("never acknowledges an old unmarked booking", async () => {
  await pg.query("UPDATE domigo_v2.practice_attempts SET booked_at = NULL");
  expect(await getPracticeReceipt(db, classScope([attempt.classId]), attempt)).toBeNull();
});
