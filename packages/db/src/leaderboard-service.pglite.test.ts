/** Real PostgreSQL behavior, local memory only; all identities are invented. */
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope } from "./scope.ts";
import { getLeaderboard } from "./leaderboard-service.ts";
import { setClassPurpose } from "./class-settings-service.ts";

const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const A = uuid(101), B = uuid(102), TEST = uuid(103), ARCHIVE = uuid(104), YEAR = uuid(105);
const ME = uuid(1), PEER = uuid(6), OTHER = uuid(2), TEACHER = uuid(99);
const at = new Date("2026-10-09T08:00:00Z");
const scope = classScope([A]);
const pg = new PGlite();
const statements: string[] = [];
const db = drizzle(pg, { schema, logger: { logQuery: (query) => { statements.push(query); } } }) as unknown as Db;
const board = () => getLeaderboard(db, scope, ME, at);
const ownRow = async () => (await board()).rows.find((row) => row.me)!;
const foreignRows = async () => (await board()).rows.filter((row) => !row.ownClass);

beforeAll(async () => {
  // Build the six queried tables from the committed 0023 snapshot, including
  // defaults and checks. No hand-maintained alternative schema, network or Neon.
  const snapshot = JSON.parse(readFileSync(new URL("../drizzle/meta/0023_snapshot.json", import.meta.url), "utf8"));
  await pg.exec("CREATE SCHEMA domigo_v2");
  type Column = { name: string; type: string; primaryKey: boolean; notNull: boolean; default?: unknown };
  for (const name of ["classes", "class_settings", "users", "user_progress", "student_profile", "practice_attempts"]) {
    const table = snapshot.tables[`domigo_v2.${name}`];
    const columns = Object.values(table.columns as Record<string, Column>).map((c) =>
      `"${c.name}" ${c.type}${c.primaryKey ? " PRIMARY KEY" : ""}${c.notNull ? " NOT NULL" : ""}${"default" in c ? ` DEFAULT ${c.default}` : ""}`);
    const checks = Object.values(table.checkConstraints as Record<string, { name: string; value: string }>).map((c) => `CONSTRAINT "${c.name}" CHECK (${c.value})`);
    await pg.exec(`CREATE TABLE "domigo_v2"."${name}" (${[...columns, ...checks].join(",")})`);
  }
  for (const [id, name, grade, purpose, archived] of [
    [A, "Synthetic A", 1, "regular", false], [B, "Synthetic B", 1, "regular", false],
    [TEST, "Synthetic Test", 1, "test", false], [ARCHIVE, "Synthetic Archive", 1, "regular", true],
    [YEAR, "Synthetic Year", 2, "regular", false],
  ] as const) {
    await db.insert(schema.v2Classes).values({ id, name, grade, teacherId: TEACHER, inviteCode: id.slice(-6), archivedAt: archived ? at : null });
    await db.insert(schema.classSettings).values({ classId: id, purpose, leaderboard: true, gradeBoardOptIn: true });
  }
  for (const [n, cls, givenName, nickname, claimed] of [
    [1, A, "Anna Muster", "Fuchs", true], [6, A, "Peer Erfunden", "Eule", true], [2, B, "Beta Erfunden", "Dachs", true],
    [3, A, "UnclaimedOwn Erfunden", "PlatzhalterA", false], [4, B, "UnclaimedOther Erfunden", "PlatzhalterB", false],
    [5, TEST, "Test Erfunden", "Test", true], [7, ARCHIVE, "Archived Erfunden", "Archiv", true], [8, YEAR, "Year Erfunden", "Jahrgang", true],
  ] as const) {
    await db.insert(schema.v2IdentityUsers).values({ id: uuid(n), classId: cls, role: "student", givenName, displayName: nickname, pinHash: "synthetic-unused", claimedAt: claimed ? at : null });
    await db.insert(schema.userProgress).values({ userId: uuid(n), xp: 40, grammarXp: 30000 });
    await db.insert(schema.studentProfile).values({ userId: uuid(n), avatar: n });
  }
}, 30000);
beforeEach(async () => { await pg.exec("BEGIN"); statements.length = 0; });
afterEach(async () => { await pg.exec("ROLLBACK"); vi.restoreAllMocks(); });
afterAll(async () => { await pg.close(); });

async function consent(own: boolean, other: boolean) {
  await pg.query("UPDATE domigo_v2.class_settings SET grade_board_opt_in = CASE WHEN class_id=$1 THEN $2::boolean ELSE $3::boolean END WHERE class_id IN ($1,$4)", [A, own, other, B]);
}
async function attempt(options: Partial<typeof schema.practiceAttempts.$inferInsert> = {}) {
  await db.insert(schema.practiceAttempts).values({ userId: ME, classId: A, itemId: "synthetic-word", kind: "vocab", unitSlug: "g1-u01", grade: 1, mode: "practice", tier: "correct", correct: true, xpAwarded: 20, createdAt: at, ...options });
}

describe("PGlite visibility and returned data", () => {
  it.each([[true, true, 1], [true, false, 0], [false, true, 0], [false, false, 0]] as const)("opt-in own=%s other=%s => %i foreign row", async (own, other, count) => {
    await consent(own, other);
    const b = await board();
    expect(b.enabled).toBe(true);
    expect(b.rows.filter((row) => row.ownClass)).toHaveLength(2);
    expect(b.rows.filter((row) => !row.ownClass)).toHaveLength(count);
  });
  it("test class cannot look out", async () => {
    await pg.query("UPDATE domigo_v2.class_settings SET purpose='test' WHERE class_id=$1", [A]);
    expect(await board()).toMatchObject({ enabled: false, rows: [] });
  });
  it("test class cannot appear to another class", async () => {
    expect((await board()).rows.map((r) => r.className)).not.toContain("Synthetic Test");
  });
  it("archived own class cannot look out", async () => {
    await pg.query("UPDATE domigo_v2.classes SET archived_at=now() WHERE id=$1", [A]);
    expect(await board()).toMatchObject({ enabled: false, rows: [] });
  });
  it("archived other class cannot appear", async () => {
    expect((await board()).rows.map((r) => r.className)).not.toContain("Synthetic Archive");
  });
  it("another grade cannot appear", async () => {
    expect((await board()).rows.map((r) => r.className)).not.toContain("Synthetic Year");
  });
  it("own leaderboard=false disables the board", async () => {
    await pg.query("UPDATE domigo_v2.class_settings SET leaderboard=false WHERE class_id=$1", [A]);
    expect(await board()).toMatchObject({ enabled: false, unavailable: false, rows: [] });
  });
  it("foreign leaderboard=false excludes that class", async () => {
    await pg.query("UPDATE domigo_v2.class_settings SET leaderboard=false WHERE class_id=$1", [B]);
    expect(await foreignRows()).toEqual([]);
  });
  it("authenticated user must belong to the supplied scope; no classId argument", async () => {
    expect(await getLeaderboard(db, classScope([B]), ME, at)).toMatchObject({ enabled: false, rows: [] });
    expect(await getLeaderboard(db, scope, OTHER, at)).toMatchObject({ enabled: false, rows: [] });
    // @ts-expect-error Argument four is a Date, never a selectable foreign class ID.
    const notAClassId: Parameters<typeof getLeaderboard>[3] = B;
    void notAClassId;
  });
  it("unclaimed own children never appear", async () => {
    expect((await board()).rows.some((r) => r.name.includes("UnclaimedOwn"))).toBe(false);
  });
  it("unclaimed foreign children never appear", async () => {
    expect((await board()).rows.some((r) => r.name.includes("UnclaimedOther"))).toBe(false);
  });
  it("first name only; response contains sequential numbers and no roster UUID", async () => {
    const b = await board();
    expect(b.rows.find((r) => r.me)?.name).toBe("Anna (Fuchs)");
    expect(b.rows.map((r) => r.id).sort((a, b) => a - b)).toEqual([1, 2, 3]);
    expect(b.rows.filter((r) => r.me)).toHaveLength(1);
    expect(JSON.stringify(b)).not.toMatch(/[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}/i);
  });
  it.each([0, 51])("invalid avatar %i falls back to 1", async (avatar) => {
    // Simulate corrupt legacy data beyond the current write-time check.
    await pg.exec('ALTER TABLE domigo_v2.student_profile DROP CONSTRAINT "student_profile_avatar_check"');
    await pg.query("UPDATE domigo_v2.student_profile SET avatar=$1 WHERE user_id=$2", [avatar, ME]);
    expect((await ownRow()).avatar).toBe(1);
  });
  it("vocabulary XP remains separate; total includes teacher's stored awards", async () => {
    expect(await ownRow()).toMatchObject({ vocabXp: 40, totalXp: 30040, weeklyXp: 0 });
  });
});

describe("PGlite week and daily", () => {
  it.each(["assign:synthetic-checkup", "assignment", "checkup"])("%s awards zero weekly XP", async (mode) => {
    await attempt(); await attempt({ mode, xpAwarded: 999 });
    expect((await ownRow()).weeklyXp).toBe(20);
  });
  it("Sunday 23:30 Vienna belongs to previous week", async () => {
    await attempt({ createdAt: new Date("2026-10-04T21:30:00Z"), xpAwarded: 999 });
    await attempt({ createdAt: new Date("2026-10-04T22:00:00Z"), xpAwarded: 7 });
    expect((await ownRow()).weeklyXp).toBe(7);
  });
  it("weekly lower boundary has no artificial current-time upper bound", async () => {
    await attempt({ createdAt: new Date("2026-10-09T09:00:00Z"), xpAwarded: 7 });
    expect((await ownRow()).weeklyXp).toBe(7);
  });
  it("daily of a foreign class is always zero", async () => {
    await attempt({ userId: OTHER, classId: B, mode: "daily" });
    expect((await foreignRows())[0]).toMatchObject({ dailyCorrect: 0, dailyTotal: 0 });
  });
  it("daily replays count distinct words, not attempts", async () => {
    await attempt({ mode: "daily" }); await attempt({ mode: "daily" });
    await attempt({ mode: "daily", itemId: "second-word", correct: false });
    expect(await ownRow()).toMatchObject({ dailyCorrect: 1, dailyTotal: 2 });
  });
  it("daily caps both counts at ten", async () => {
    for (let i = 0; i < 12; i++) await attempt({ mode: "daily", itemId: `word-${i}` });
    expect(await ownRow()).toMatchObject({ dailyCorrect: 10, dailyTotal: 10 });
  });
  it("daily counts only today's Vienna date", async () => {
    await attempt({ mode: "daily", createdAt: new Date("2026-10-08T21:59:59Z"), itemId: "yesterday" });
    await attempt({ mode: "daily", createdAt: new Date("2026-10-09T22:00:00Z"), itemId: "tomorrow" });
    await attempt({ mode: "daily", createdAt: new Date("2026-10-08T22:00:00Z"), itemId: "today" });
    expect(await ownRow()).toMatchObject({ dailyCorrect: 1, dailyTotal: 1 });
  });
});

describe("PGlite purpose and failure states", () => {
  it("test purpose atomically revokes both flags; returning to regular does not restore consent", async () => {
    await setClassPurpose(db, scope, A, TEACHER, "test");
    expect(statements).toHaveLength(1);
    const flags = await pg.query("SELECT purpose, leaderboard, grade_board_opt_in FROM domigo_v2.class_settings WHERE class_id=$1", [A]);
    expect(flags.rows).toEqual([{ purpose: "test", leaderboard: false, grade_board_opt_in: false }]);
    await setClassPurpose(db, scope, A, TEACHER, "regular");
    expect(await board()).toMatchObject({ enabled: false });
  });
  it("a foreign owner cannot change purpose or revoke consent", async () => {
    await expect(setClassPurpose(db, scope, A, uuid(98), "test")).rejects.toThrow();
    expect((await board()).enabled).toBe(true);
  });
  it("missing migration returns unavailable with only an anonymous log", async () => {
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    await pg.exec("ALTER TABLE domigo_v2.class_settings DROP COLUMN leaderboard");
    expect(await board()).toMatchObject({ enabled: false, unavailable: true, rows: [] });
    expect(warning.mock.calls).toEqual([["[leaderboard] read_failed"]]);
  });
});
