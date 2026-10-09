import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import { getLeaderboard, leaderboardName, sortLeaderboard, viennaMonday } from "./leaderboard-service.ts";
import { getClassLeaderboardSettings, setClassLeaderboardSettings, setClassPurpose, ClassSettingsForbiddenError } from "./class-settings-service.ts";

const CLASS = "00000000-0000-4000-8000-000000000001";
const USER = "00000000-0000-4000-8000-000000000002";
const TEACHER = "00000000-0000-4000-8000-000000000003";
const OTHER = "00000000-0000-4000-8000-000000000004";
const scope = classScope([CLASS]);
const at = new Date("2026-10-09T08:00:00Z");
function recorder(replies: (unknown[][] | Error)[] = []) {
  const log: { sql: string; params: unknown[] }[] = [];
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params }); const rows = replies.shift() ?? [];
    return rows instanceof Error ? Promise.reject(rows) : Promise.resolve({ rows, rowCount: rows.length, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}
const row = (id = USER, cls = CLASS, xp = 80, grammar = 40, weekly = 35, last = "2026-10-08") =>
  [CLASS, "Synthetic A", true, id, "Beispiel", "Fuchs", cls, cls === CLASS ? "Synthetic A" : "Synthetic B", null, xp, grammar, 4, last, weekly, 2, 3];

describe("cgo-111 migration 0023", () => {
  const read = (file: string) => JSON.parse(readFileSync(new URL(`../drizzle/meta/${file}`, import.meta.url), "utf8"));

  it("pins the journal prefix and entry 23 while allowing later migrations", () => {
    const { entries } = read("_journal.json");
    expect(entries.slice(0, 24).map((entry: { idx: number }) => entry.idx)).toEqual(Array.from({ length: 24 }, (_, i) => i));
    expect(entries.slice(22, 24).map((entry: { tag: string }) => entry.tag)).toEqual(["0022_student_profile", "0023_class_leaderboard"]);
    expect(entries.filter((entry: { idx: number }) => entry.idx === 23)).toEqual([
      expect.objectContaining({ idx: 23, tag: "0023_class_leaderboard", version: "7" }),
    ]);
  });

  it("snapshot is 0022 plus exactly the two disabled non-null boolean settings", () => {
    const previous = read("0022_snapshot.json");
    const snapshot = read("0023_snapshot.json");
    const settings = previous.tables["domigo_v2.class_settings"];
    expect(snapshot.id).not.toBe(previous.id);
    expect(snapshot).toEqual({
      ...previous,
      id: expect.any(String),
      prevId: previous.id,
      tables: {
        ...previous.tables,
        "domigo_v2.class_settings": {
          ...settings,
          columns: {
            ...settings.columns,
            leaderboard: { name: "leaderboard", type: "boolean", primaryKey: false, notNull: true, default: false },
            grade_board_opt_in: { name: "grade_board_opt_in", type: "boolean", primaryKey: false, notNull: true, default: false },
          },
        },
      },
    });
  });
});

describe("cgo-111 leaderboard: fake database, invented identities", () => {
  it("empty scope / no user short circuits without reading", async () => {
    const { db, log } = recorder();
    expect((await getLeaderboard(db, EMPTY_SCOPE, USER, at)).enabled).toBe(false);
    expect((await getLeaderboard(db, scope, "", at)).rows).toEqual([]);
    expect(log).toEqual([]);
  });
  it("one query carries both consent directions, year, archive and roster walls", async () => {
    const { db, log } = recorder([[]]);
    const board = await getLeaderboard(db, scope, USER, at);
    expect(board.enabled).toBe(false); expect(log).toHaveLength(1);
    const q = log[0]!;
    expect(q.sql).toContain('"board_viewer"."class_id" in');
    expect(q.sql).toContain('"board_viewer"."id" =');
    expect(q.sql).toContain('"classes"."grade" = "board_own"."grade"');
    expect(q.sql).toContain('"classes"."archived_at" is null');
    expect(q.sql).toContain('"board_own"."archived_at" is null');
    expect(q.sql).toMatch(/"board_own_settings"\."grade_board_opt_in" = .* and "domigo_v2"\."class_settings"\."grade_board_opt_in" =/);
    expect(q.sql.match(/"purpose" =/g)).toHaveLength(2);
    expect(q.sql.match(/"leaderboard" =/g)).toHaveLength(2);
    expect(q.sql).toContain('"users"."class_id" = "domigo_v2"."classes"."id"');
    expect(q.sql).toContain('"user_progress"."user_id" = "domigo_v2"."users"."id"');
    expect(q.sql).toContain('"student_profile"."user_id" = "domigo_v2"."users"."id"');
    expect(q.params).toContain(CLASS); expect(q.params).toContain(USER);
    expect(q.sql).not.toMatch(/\b(?:insert|update|delete)\b/i);
  });
  it("week + daily use Vienna midnight, current class AND roster; assignments never count", async () => {
    const { db, log } = recorder([[]]); await getLeaderboard(db, scope, USER, at);
    const q = log[0]!;
    expect(q.params).toContain("2026-10-05"); expect(q.params).toContain("2026-10-09");
    expect(q.sql.match(/at time zone 'Europe\/Vienna'/g)).toHaveLength(3);
    expect(q.sql).toContain('sum("domigo_v2"."practice_attempts"."xp_awarded")');
    expect(q.sql).toContain("not like 'assign:%'");
    expect(q.sql).toContain("not in ('assignment', 'checkup')");
    expect(q.sql.match(/"mode" = 'daily'/g)).toHaveLength(2);
    expect(q.sql.match(/"practice_attempts"\."class_id" = "board_own"\."id"/g)).toHaveLength(2);
    expect(q.sql).toContain('"practice_attempts"."correct" = true');
  });
  it("sums both XP pools, roster defaults, names, active streak and own-only aggregates", async () => {
    const { db } = recorder([[row(), row(OTHER, OTHER, 900, 400, 100, "2026-10-06")]]);
    const b = await getLeaderboard(db, scope, USER, at);
    expect(b.enabled).toBe(true); expect(b.gradeOptIn).toBe(true);
    expect(b.weeklyXp).toBe(35); expect(b.totalXp).toBe(120); expect(b.target).toBe(5000);
    const own = b.rows.find(r => r.me)!;
    expect(own).toMatchObject({ name: "Beispiel (Fuchs)", avatar: 1, totalXp: 120, streak: 4, dailyCorrect: 2, dailyTotal: 3 });
    expect(b.rows[0]).toMatchObject({ id: 2, streak: 0, dailyCorrect: 0, dailyTotal: 0 });
    expect(sortLeaderboard(b.rows, "total")[0]!.id).toBe(2);
  });
  it("zero-XP roster members remain present and deterministic tie order", async () => {
    const { db } = recorder([[row(USER, CLASS, 0, 0, 0), row(OTHER, CLASS, 0, 0, 0)]]);
    const b = await getLeaderboard(db, scope, USER, at); expect(b.rows).toHaveLength(2);
    expect(sortLeaderboard([...b.rows].reverse(), "week").map(r => r.id)).toEqual([1, 2]);
  });
  it("missing migration/unavailable database fail closed without error details", async () => {
    const { db } = recorder([new Error("synthetic missing 0023")]);
    expect(await getLeaderboard(db, scope, USER, at)).toMatchObject({ enabled: false, gradeOptIn: false, rows: [] });
  });
  it("name rule omits duplicate and missing first names", () => {
    expect(leaderboardName("Beispiel", "Beispiel")).toBe("Beispiel");
    expect(leaderboardName("Anna Muster", "Fuchs")).toBe("Anna (Fuchs)");
    expect(leaderboardName(null, "Fuchs")).toBe("Fuchs");
    expect(leaderboardName(" Beispiel ", "Fuchs")).toBe("Beispiel (Fuchs)");
  });
  it.each([
    ["2026-10-04T21:59:59Z", "2026-09-28"], ["2026-10-04T22:00:00Z", "2026-10-05"],
    ["2026-03-29T21:59:59Z", "2026-03-23"], ["2026-03-29T22:00:00Z", "2026-03-30"],
    ["2026-10-25T22:59:59Z", "2026-10-19"], ["2026-10-25T23:00:00Z", "2026-10-26"],
  ])("Vienna Monday %s => %s", (instant, expected) => expect(viennaMonday(new Date(instant))).toBe(expected));
});

describe("cgo-111 settings: one guarded write", () => {
  it("purpose before 0023 retries only the missing-column error through the original guarded writer", async () => {
    const missing = Object.assign(new Error("synthetic missing column"), { code: "42703" });
    const { db, log } = recorder([missing, [[CLASS]]]);
    await setClassPurpose(db, scope, CLASS, TEACHER, "test");
    expect(log).toHaveLength(2);
    expect(log[1]!.sql).not.toMatch(/leaderboard|grade_board_opt_in/);
    expect(log[1]!.sql).toContain('"classes"."id" in');
    expect(log[1]!.sql).toContain('"classes"."teacher_id" =');
  });
  it("purpose never retries other database errors", async () => {
    const { db, log } = recorder([Object.assign(new Error("synthetic failure"), { code: "08006" })]);
    await expect(setClassPurpose(db, scope, CLASS, TEACHER, "test")).rejects.toThrow();
    expect(log).toHaveLength(1);
  });
  it("settings default to all off before migration; foreign class does not read", async () => {
    const { db, log } = recorder([new Error("missing")]);
    expect(await getClassLeaderboardSettings(db, scope, CLASS)).toEqual({ leaderboard: false, gradeBoardOptIn: false });
    expect(await getClassLeaderboardSettings(db, scope, OTHER)).toEqual({ leaderboard: false, gradeBoardOptIn: false });
    expect(log).toHaveLength(1);
  });
  it("owner, scope, regular purpose and archive are checked in the write statement", async () => {
    const { db, log } = recorder([[[CLASS]]]);
    await setClassLeaderboardSettings(db, scope, CLASS, TEACHER, { leaderboard: true, gradeBoardOptIn: true });
    expect(log).toHaveLength(1);
    expect(log[0]!.sql).toMatch(/^insert into/);
    expect(log[0]!.sql).toContain('"classes"."id" in');
    expect(log[0]!.sql).toContain('"classes"."teacher_id" =');
    expect(log[0]!.sql).toContain('"classes"."archived_at" is null');
    expect(log[0]!.sql).toContain("coalesce(\"domigo_v2\".\"class_settings\".\"purpose\", 'regular') = 'regular'");
    expect(log[0]!.sql).toMatch(/on conflict.*where "domigo_v2"\."class_settings"\."purpose" =/);
    expect(log[0]!.sql).not.toMatch(/given_name|display_name|user_progress|practice_attempts/);
  });
  it("test, archived or foreign owner returning no row refuses; missing column never saves", async () => {
    for (const reply of [[], new Error("missing 0023")]) {
      const { db } = recorder([reply]);
      await expect(setClassLeaderboardSettings(db, scope, CLASS, TEACHER, { leaderboard: true, gradeBoardOptIn: false })).rejects.toThrow();
    }
  });
  it("B without A, foreign scope, empty scope and missing teacher refuse before SQL", async () => {
    const { db, log } = recorder();
    await expect(setClassLeaderboardSettings(db, scope, CLASS, TEACHER, { leaderboard: false, gradeBoardOptIn: true })).rejects.toThrow();
    await expect(setClassLeaderboardSettings(db, scope, OTHER, TEACHER, { leaderboard: true, gradeBoardOptIn: true }, true)).rejects.toBeInstanceOf(ClassSettingsForbiddenError);
    await expect(setClassLeaderboardSettings(db, EMPTY_SCOPE, CLASS, TEACHER, { leaderboard: true, gradeBoardOptIn: false })).rejects.toThrow();
    await expect(setClassLeaderboardSettings(db, scope, CLASS, "", { leaderboard: true, gradeBoardOptIn: false })).rejects.toThrow();
    expect(log).toEqual([]);
  });
  it("grandmaster bypasses ownership only, and A/B can both be revoked", async () => {
    const { db, log } = recorder([[[CLASS]]]);
    await setClassLeaderboardSettings(db, scope, CLASS, TEACHER, { leaderboard: false, gradeBoardOptIn: false }, true);
    expect(log[0]!.sql).not.toContain('"teacher_id"');
    expect(log[0]!.sql).toContain('"classes"."id" in');
    expect(log[0]!.params.slice(0, 2)).toEqual([false, false]);
  });
});
