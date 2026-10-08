import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "./index.ts";
import { getUnitMastery as publicMastery } from "./index.ts";
import { getUnitMastery, listClassUnitProgress, listStudentProgress } from "./class-progress.ts";
import { getClassPurposes, setClassPurpose, ClassSettingsForbiddenError } from "./class-settings-service.ts";
import { listAllClassesForGrandmaster } from "./class-service.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import * as schema from "./schema.ts";

const REGULAR = "00000000-0000-4000-8000-000000000001";
const TEST = "00000000-0000-4000-8000-000000000002";
const FOREIGN = "00000000-0000-4000-8000-000000000003";
const TEACHER = "00000000-0000-4000-8000-000000000004";
const scope = classScope([REGULAR, TEST]);
function recorder(replies: (unknown[][] | Error)[] = []) {
  const log: { sql: string; params: unknown[] }[] = [];
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    const rows = replies.shift() ?? [];
    if (rows instanceof Error) return Promise.reject(rows);
    return Promise.resolve({ rows, rowCount: rows.length, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

describe("class purposes — no real database or identities", () => {
  it("defaults only inside the session scope; stored tests override regular", async () => {
    const { db, log } = recorder([[[TEST, "test"]]]);
    expect(await getClassPurposes(db, scope, [REGULAR, TEST, FOREIGN])).toEqual(new Map([[REGULAR, "regular"], [TEST, "test"]]));
    expect(log[0]!.sql).toMatch(/where \("domigo_v2"\."class_settings"\."class_id" in \(\$1, \$2\) and/);
    expect(log[0]!.params).toEqual([REGULAR, TEST, REGULAR, TEST]);
  });
  it("empty scope and wholly foreign ids do not read", async () => {
    const { db, log } = recorder();
    expect(await getClassPurposes(db, EMPTY_SCOPE, [REGULAR])).toEqual(new Map());
    expect(await getClassPurposes(db, scope, [FOREIGN])).toEqual(new Map());
    expect(log).toEqual([]);
  });
  it("unreadable settings fall back to regular without escaping scope", async () => {
    const { db } = recorder([new Error("synthetic relation missing")]);
    expect(await getClassPurposes(db, scope, [REGULAR, TEST, FOREIGN])).toEqual(new Map([[REGULAR, "regular"], [TEST, "regular"]]));
  });
  it("writes test and regular through one scoped owner-checked upsert each", async () => {
    const { db, log } = recorder([[[TEST]], [[TEST]]]);
    await setClassPurpose(db, scope, TEST, TEACHER, "test");
    await setClassPurpose(db, scope, TEST, TEACHER, "regular");
    expect(log).toHaveLength(2);
    for (const [i, { sql, params }] of log.entries()) {
      expect(sql).toMatch(/^insert into "domigo_v2"\."class_settings"/);
      expect(sql).toMatch(/select .* from "domigo_v2"\."classes" where \("domigo_v2"\."classes"\."id" in/);
      expect(sql).toMatch(/and "domigo_v2"\."classes"\."id" = .* and "domigo_v2"\."classes"\."teacher_id" =/);
      expect(sql).toMatch(/on conflict \("class_id"\) do update set "purpose" = .*"updated_at" =/);
      expect(params.slice(0, 6)).toEqual([i === 0 ? "test" : "regular", REGULAR, TEST, TEST, TEACHER, i === 0 ? "test" : "regular"]);
      expect(sql).not.toMatch(/display_name|given_name|pin_hash|practice_attempts|user_progress/);
    }
  });
  it("foreign owner inside scope is refused when the guarded statement changes no row", async () => {
    const { db } = recorder([[]]);
    await expect(setClassPurpose(db, scope, TEST, "foreign-teacher", "test")).rejects.toBeInstanceOf(ClassSettingsForbiddenError);
  });
  it("out-of-scope, empty scope, missing actor and invalid purpose cannot write", async () => {
    const { db, log } = recorder();
    await expect(setClassPurpose(db, scope, FOREIGN, TEACHER, "test")).rejects.toThrow();
    await expect(setClassPurpose(db, EMPTY_SCOPE, TEST, TEACHER, "test")).rejects.toThrow();
    await expect(setClassPurpose(db, scope, TEST, "", "test")).rejects.toThrow();
    await expect(setClassPurpose(db, scope, TEST, TEACHER, "other" as never)).rejects.toThrow();
    expect(log).toEqual([]);
  });
  it("grandmaster bypasses only ownership, never scope", async () => {
    const { db, log } = recorder([[[TEST]]]);
    await setClassPurpose(db, scope, TEST, TEACHER, "test", true);
    expect(log[0]!.sql).not.toContain('"teacher_id"');
    expect(log[0]!.sql).toMatch(/where \("domigo_v2"\."classes"\."id" in/);
    await expect(setClassPurpose(db, scope, FOREIGN, TEACHER, "test", true)).rejects.toThrow();
    expect(log).toHaveLength(1);
  });
  it("missing settings on write is a failure, never saved", async () => {
    const { db } = recorder([new Error("synthetic missing table")]);
    await expect(setClassPurpose(db, scope, TEST, TEACHER, "test")).rejects.toThrow();
  });
});

describe("aggregate boundary", () => {
  it("public mastery export is the purpose-filtered reader", () => expect(publicMastery).toBe(getUnitMastery));
  it("mastery SQL binds the regular cohort after the unchanged session scope", async () => {
    const { db, log } = recorder([[[TEST, "test"]], [["g1-u01", 2, 1, 1]]]);
    expect(await publicMastery(db, scope, 1)).toEqual([{ unitSlug: "g1-u01", attempts: 2, itemsSolved: 1, correctRate: 0.5 }]);
    expect(log[1]!.sql).toMatch(/where \("domigo_v2"\."practice_attempts"\."class_id" in \(\$1, \$2\) and "domigo_v2"\."practice_attempts"\."class_id" in \(\$3\)/);
    expect(log[1]!.params).toEqual([REGULAR, TEST, REGULAR, 1, "game:g1"]);
  });
  it("test-only cohort compiles to false; fallback cohort includes both classes", async () => {
    const only = recorder([[[TEST, "test"]], []]);
    expect(await publicMastery(only.db, classScope([TEST]), 1)).toEqual([]);
    expect(only.log[1]!.sql).toMatch(/and false and/);
    const missing = recorder([new Error("missing settings"), []]);
    await publicMastery(missing.db, scope, 1);
    expect(missing.log[1]!.params).toEqual([REGULAR, TEST, REGULAR, TEST, 1, "game:g1"]);
  });
  it("the test class's own unit and student progress remains visible without a purpose read", async () => {
    const { db, log } = recorder([[["g1-u01", 3, 2, 2]], [["synthetic-child", 3, 2, 2, null]]]);
    expect((await listClassUnitProgress(db, scope, TEST))[0]!.attempts).toBe(3);
    expect((await listStudentProgress(db, scope, TEST))[0]!.attempts).toBe(3);
    expect(log).toHaveLength(2);
    for (const call of log) expect(call.params).toEqual([REGULAR, TEST, TEST]);
  });
  it("grandmaster separates tests and excludes matching legacy rows", async () => {
    const now = new Date().toISOString();
    const { db } = recorder([
      [[REGULAR, "Synthetic A", 1, "AAAAAA", TEACHER, now], [TEST, "Synthetic B", 1, "BBBBBB", TEACHER, now]],
      [[REGULAR, 1, 1], [TEST, 1, 1]], [[TEACHER, "Synthetic teacher"]],
      [[TEST, "Synthetic B", 1]], [[TEST, 1]], [[TEST, "test"]],
    ]);
    const result = await listAllClassesForGrandmaster(db, scope);
    expect(result.v2.map((c) => c.id)).toEqual([REGULAR]);
    expect(result.v2.reduce((n, c) => n + c.studentCount, 0)).toBe(1);
    expect(result.testClasses.map((c) => c.id)).toEqual([TEST]);
    expect(result.legacy).toEqual([]);
    expect(result.v2Failed).toBe(false);
  });
  it("grandmaster fallback retains both classes and no error banner", async () => {
    const now = new Date().toISOString();
    const { db } = recorder([
      [[REGULAR, "Synthetic A", 1, "AAAAAA", TEACHER, now], [TEST, "Synthetic B", 1, "BBBBBB", TEACHER, now]],
      [[REGULAR, 1, 1], [TEST, 1, 1]], [[TEACHER, "Synthetic teacher"]], [], new Error("missing settings"),
    ]);
    const result = await listAllClassesForGrandmaster(db, scope);
    expect(result.v2).toHaveLength(2);
    expect(result.testClasses).toEqual([]);
    expect(result.v2Failed).toBe(false);
  });
});
