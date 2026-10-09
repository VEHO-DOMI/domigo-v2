import { describe, expect, it, vi } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import { readFileSync } from "node:fs";
import * as schema from "./schema.ts";
import type { Db } from "./index.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import { assignAvailableAvatars, getAvailableAvatar, getDailyChallengeCount, getStudentAvatar, getStudentChapterProgress, setStudentAvatar, validAvatar } from "./student-profile-service.ts";
import { deleteUserData } from "./konto-loeschung.ts";

const C = "aaaaaaaa-0000-4000-8000-000000000001", U = "bbbbbbbb-0000-4000-8000-000000000002";
const scope = classScope([C]);
function recorder(rows: (unknown[][] | Error)[] = [], failTable?: { name: string; error: Error }) {
  const log: { sql: string; params: unknown[] }[] = [];
  let n = 0;
  const client = async (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    if (failTable && sql.startsWith(`delete from "domigo_v2"."${failTable.name}"`)) throw failTable.error;
    const result = rows[n++];
    if (result instanceof Error) throw result;
    return { rows: result ?? [], rowCount: 0, fields: [] };
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

describe("cgo-108 avatar allocation", () => {
  it("accepts only integer 1..50", () => {
    for (const x of [0, 51, -1, 1.5, NaN, "1", null]) expect(validAvatar(x)).toBe(false);
    expect(validAvatar(1)).toBe(true); expect(validAvatar(50)).toBe(true);
  });
  it("chooses the first free figure in stable roster order, respecting saved choices", () => {
    expect(getAvailableAvatar([3, 1])).toBe(2);
    expect(getAvailableAvatar(Array.from({ length: 50 }, (_, i) => i + 1))).toBe(1);
    expect([...assignAvailableAvatars(["a", "b", "c"], new Map([["c", 1]]))]).toEqual([["a", 2], ["b", 3], ["c", 1]]);
  });
  it("falls back only for missing table; no read-side writes or names", async () => {
    const missing = Object.assign(new Error("missing"), { code: "42P01" });
    const r = recorder([[["older"], [U]], missing]);
    expect(await getStudentAvatar(r.db, scope, C, U)).toBe(2);
    expect(r.log).toHaveLength(2);
    for (const q of r.log) {
      expect(q.sql).not.toMatch(/insert|update|display_name|given_name/i);
      expect(q.sql).toMatch(/where \("domigo_v2"\."users"\."class_id" in \(\$1\)/);
      expect(q.params.slice(0, 3)).toEqual([C, C, "student"]);
    }
    expect(r.log[0]!.sql).toMatch(/order by .*created_at.*id/s);
    await expect(getStudentAvatar(recorder([[[U]], new Error("outage")]).db, scope, C, U)).rejects.toThrow();
  });
  it("reads neither foreign class nor unrostered user", async () => {
    const r = recorder();
    expect(await getStudentAvatar(r.db, EMPTY_SCOPE, C, U)).toBeNull();
    expect(r.log).toHaveLength(0);
    expect(await getStudentAvatar(r.db, scope, C, U)).toBeNull();
    expect(r.log).toHaveLength(1);
  });
  it("write is one statement scoped to class, own id and student role", async () => {
    const r = recorder([[[U]]]);
    await setStudentAvatar(r.db, scope, C, U, 7);
    expect(r.log).toHaveLength(1);
    const q = r.log[0]!;
    expect(q.sql).toMatch(/insert into "domigo_v2"\."student_profile"/);
    expect(q.sql).toMatch(/where \("domigo_v2"\."users"\."class_id" in .* and .*class_id.* and .*id.* and .*role.*on conflict/s);
    expect(q.params).toEqual(expect.arrayContaining([C, U, "student", 7]));
    expect(q.params.filter((x) => x === C)).toHaveLength(2);
    expect(q.sql).toMatch(/on conflict \("user_id"\) do update/);
    await expect(setStudentAvatar(recorder().db, scope, C, U, 7)).rejects.toThrow("forbidden");
  });
  it("rejects empty/foreign scopes and invalid avatar before DB", async () => {
    const r = recorder();
    await expect(setStudentAvatar(r.db, EMPTY_SCOPE, C, U, 7)).rejects.toThrow();
    await expect(setStudentAvatar(r.db, scope, "foreign", U, 7)).rejects.toThrow();
    await expect(setStudentAvatar(r.db, scope, C, U, 51)).rejects.toThrow();
    expect(r.log).toHaveLength(0);
  });
  it("deletes the profile with exactly the account and before identity", async () => {
    const r = recorder();
    const result = await deleteUserData(r.db, U);
    const q = r.log.find((x) => x.sql.startsWith('delete from "domigo_v2"."student_profile"'));
    expect(q, "avatar row must not survive account deletion").toBeDefined();
    expect(q!.params).toEqual([U]);
    expect(result.zeilen).toHaveProperty("student_profile", 0);
    expect(r.log.at(-2)!.sql).toMatch(/delete from "domigo_v2"\."student_profile"/);
    expect(r.log.at(-1)!.sql).toMatch(/delete from "domigo_v2"\."users"/);
  });
  it("deletion journals a missing optional profile after mandatory tables and still deletes identity", async () => {
    const info = vi.spyOn(console, "info").mockImplementation(() => {});
    try {
      const r = recorder([], { name: "student_profile", error: Object.assign(new Error("missing"), { code: "42P01" }) });
      const result = await deleteUserData(r.db, U);
      expect(result.zeilen.student_profile).toBe(0);
      expect(Object.keys(result.zeilen).slice(-2)).toEqual(["student_profile", "users"]);
      expect(r.log.at(-2)!.sql).toMatch(/delete from "domigo_v2"\."student_profile"/);
      expect(r.log.at(-1)!.sql).toMatch(/delete from "domigo_v2"\."users"/);
      expect(info).toHaveBeenCalledWith(expect.stringMatching(/student_profile: missing relation \(42P01\), 0 rows/));
    } finally { info.mockRestore(); }
  });
  it("deletion rejects non-missing profile errors and missing mandatory tables", async () => {
    const errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      for (const [name, code] of [["student_profile", "42501"], ["student_profile", "08006"], ["practice_attempts", "42P01"]]) {
        const r = recorder([], { name: name!, error: Object.assign(new Error("synthetic failure"), { code }) });
        await expect(deleteUserData(r.db, U)).rejects.toThrow();
        expect(r.log.some((q) => q.sql.startsWith('delete from "domigo_v2"."users"'))).toBe(false);
      }
    } finally { errorLog.mockRestore(); }
  });
});

describe("cgo-108 truthful own progress", () => {
  it("daily counts distinct own current-grade daily words on the Vienna day", async () => {
    const r = recorder([[[3]]]);
    expect(await getDailyChallengeCount(r.db, scope, C, U, 2, "2026-10-08", ["g2u1v1", "g2u1v2"])).toBe(3);
    const q = r.log[0]!;
    expect(q.sql).toMatch(/count\(distinct/);
    expect(q.sql).toMatch(/AT TIME ZONE 'Europe\/Vienna'/);
    expect(q.params).toEqual([C, C, U, 2, "daily", "vocab", "g2u1v1", "g2u1v2", "2026-10-08"]);
    for (const column of ["class_id", "user_id", "grade", "mode", "kind", "item_id", "created_at"]) expect(q.sql).toContain(`"${column}"`);
  });
  it("empty daily set never queries; count caps at ten", async () => {
    const r = recorder([[[11]]]);
    expect(await getDailyChallengeCount(r.db, scope, C, U, 1, "2026-10-08", [])).toBe(0);
    expect(r.log).toHaveLength(0);
    expect(await getDailyChallengeCount(r.db, scope, C, U, 1, "2026-10-08", ["x"])).toBe(10);
  });
  it("chapter and XP history both restrict class, own user and grade", async () => {
    const r = recorder([[['g2-u01', 'vocab', 4, 3, 5]], [["2026-10-08", 6]]]);
    const result = await getStudentChapterProgress(r.db, scope, C, U, 2);
    expect(result.chapters[0]).toEqual({ unitSlug: "g2-u01", kind: "vocab", practiced: 4, correct: 3, attempts: 5 });
    expect(result.days).toEqual([{ day: "2026-10-08", xp: 6 }]);
    expect(r.log).toHaveLength(2);
    for (const q of r.log) expect(q.params.slice(0, 4)).toEqual([C, C, U, 2]);
    expect(r.log[0]!.sql).toContain("'correct'");
    expect(r.log[1]!.sql).toMatch(/sum\(.*"xp_awarded"/);
  });
  it("migration 0022 is additive and journal/snapshot agree", () => {
    const read = (p: string) => readFileSync(new URL(`../drizzle/${p}`, import.meta.url), "utf8");
    const sql = read("0022_student_profile.sql").replace(/--.*$/gm, "");
    expect(sql).toMatch(/CREATE TABLE IF NOT EXISTS "domigo_v2"\."student_profile"/);
    expect(sql).toMatch(/CHECK \("avatar" between 1 and 50\)/);
    expect(sql).not.toMatch(/\b(ALTER|DROP|DELETE|UPDATE|INSERT)\b/i);
    const journal = JSON.parse(read("meta/_journal.json"));
    expect(journal.entries.slice(0, 23).map((e: { idx: number }) => e.idx)).toEqual(Array.from({ length: 23 }, (_, i) => i));
    expect(journal.entries.slice(20, 23).map((e: { tag: string }) => e.tag)).toEqual(["0020_story_world_settings", "0021_class_settings", "0022_student_profile"]);
    expect(journal.entries.filter((e: { idx: number }) => e.idx === 22)).toEqual([expect.objectContaining({ tag: "0022_student_profile", version: "7" })]);
    const snapshot = JSON.parse(read("meta/0022_snapshot.json"));
    const previous = JSON.parse(read("meta/0021_snapshot.json"));
    expect(snapshot.prevId).toBe(previous.id);
    expect(Object.keys(snapshot.tables).sort()).toEqual([...Object.keys(previous.tables), "domigo_v2.student_profile"].sort());
    for (const [name, table] of Object.entries(previous.tables)) expect(snapshot.tables[name]).toEqual(table);
    expect(Object.keys(snapshot.tables["domigo_v2.student_profile"].columns)).toEqual(["user_id", "avatar", "updated_at"]);
    expect(snapshot.tables["domigo_v2.student_profile"].checkConstraints.student_profile_avatar_check.value).toContain("between 1 and 50");
  });
});
