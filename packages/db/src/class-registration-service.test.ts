import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import type { Db } from "./index.ts";
import * as schema from "./schema.ts";
import { classScope, EMPTY_SCOPE } from "./scope.ts";
import { listClassRegistrationCountsForTeacher } from "./class-service.ts";

/** Actual production SQL compiler, recording transport: no network or database. */
function recorder(rows: unknown[][] = []) {
  const log: { sql: string; params: unknown[] }[] = [];
  const client = (sql: string, params: unknown[]) => {
    log.push({ sql, params });
    return Promise.resolve({ rows, rowCount: rows.length, fields: [] });
  };
  return { log, db: drizzle(client as never, { schema }) as unknown as Db };
}

describe("own-class registration counts", () => {
  it("scope first, then owner and active class; one grouped read, no personal fields", async () => {
    const { db, log } = recorder([["fixture-a", 3]]);
    const result = await listClassRegistrationCountsForTeacher(db, classScope(["fixture-a"]), "fixture-teacher");
    expect(result).toEqual([{ classId: "fixture-a", claimedCount: 3 }]);
    expect(log).toHaveLength(1);
    const { sql, params } = log[0]!;
    expect(sql).toMatch(/where \("domigo_v2"\."classes"\."id" in \(\$1\) and "domigo_v2"\."classes"\."teacher_id" = \$2 and "domigo_v2"\."classes"\."archived_at" is null\)/);
    expect(params).toEqual(["fixture-a", "fixture-teacher"]);
    expect(sql).toMatch(/count\("domigo_v2"\."users"\."claimed_at"\)::int/);
    expect(sql).toMatch(/group by "domigo_v2"\."classes"\."id"/);
    expect(sql).not.toMatch(/given_name|display_name|nickname|pin_hash|invite_code|insert |update |delete /i);
  });
  it("empty session scope compiles to false, never to the whole platform", async () => {
    const { db, log } = recorder();
    expect(await listClassRegistrationCountsForTeacher(db, EMPTY_SCOPE, "fixture-teacher")).toEqual([]);
    expect(log[0]!.sql).toMatch(/where \(false and /);
  });
  it("a second teacher and a different scope bind their own values", async () => {
    const { db, log } = recorder();
    await listClassRegistrationCountsForTeacher(db, classScope(["fixture-b"]), "fixture-teacher-b");
    expect(log[0]!.params).toEqual(["fixture-b", "fixture-teacher-b"]);
  });
  it("transport failure propagates so the page can distinguish unavailable from zero", async () => {
    const db = drizzle((() => Promise.reject(new Error("synthetic offline"))) as never, { schema }) as unknown as Db;
    await expect(listClassRegistrationCountsForTeacher(db, classScope(["fixture-a"]), "fixture-teacher")).rejects.toThrow();
  });
});
