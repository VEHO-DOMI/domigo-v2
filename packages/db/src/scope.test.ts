/**
 * dach-018 · scope.ts — the constructor's fail-closed reflexes, and the drizzle
 * fact the whole wall rests on.
 *
 * The last case is the important one: it does not test our code, it PINS a
 * behaviour of drizzle-orm that the design depends on. If a future drizzle
 * renders an empty `inArray` as anything but `false`, every "empty scope ⇒ no
 * rows" claim in this repo silently becomes false — and this test goes red
 * before that reaches a child.
 */
import { and, eq, inArray, notInArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { describe, expect, it } from "vitest";
import { assertWritableScope, classScope, EMPTY_SCOPE, inScope } from "./scope.ts";
import * as schema from "./schema.ts";

describe("classScope", () => {
  it("drops blank ids — `classId ?? \"\"` must not look like a real scope", () => {
    expect([...classScope(["", "  ", null, undefined, "A"])]).toEqual(["A"]);
    expect([...classScope([""])]).toEqual([]);
  });

  it("de-duplicates, so length is a count of classes and not of call sites", () => {
    expect([...classScope(["A", "A", "B"])]).toEqual(["A", "B"]);
  });

  it("EMPTY_SCOPE is empty, and inScope never says yes to nothing", () => {
    expect(EMPTY_SCOPE.length).toBe(0);
    expect(inScope(EMPTY_SCOPE, "A")).toBe(false);
    expect(inScope(classScope(["A"]), null)).toBe(false);
    expect(inScope(classScope(["A"]), "A")).toBe(true);
  });

  it("a write under an empty scope throws instead of changing zero rows quietly", () => {
    expect(() => assertWritableScope(EMPTY_SCOPE, "renameClass")).toThrow(/no class scope/);
    expect(() => assertWritableScope(classScope(["A"]), "renameClass")).not.toThrow();
  });
});

describe("the drizzle behaviour this design rests on (pinned, not assumed)", () => {
  /** A recording client: drizzle's neon-http session accepts a bare function. */
  function recorder() {
    const log: { sql: string; params: unknown[] }[] = [];
    const client = (sql: string, params: unknown[]) => {
      log.push({ sql, params });
      return Promise.resolve({ rows: [], rowCount: 0, fields: [] });
    };
    return { log, db: drizzle(client as never, { schema }) };
  }

  const t = schema.practiceAttempts;

  it("an empty inArray compiles to `false` — for reads AND writes", async () => {
    const { log, db } = recorder();
    await db.select().from(t).where(and(inArray(t.classId, [...EMPTY_SCOPE]), eq(t.userId, "u1")));
    await db.update(t).set({ xpAwarded: 1 }).where(and(inArray(t.classId, [...EMPTY_SCOPE]), eq(t.userId, "u1")));
    expect(log[0]!.sql).toContain("where (false and");
    expect(log[1]!.sql).toContain("where (false and");
  });

  it("a filled scope binds as the FIRST parameter of the FIRST conjunct", async () => {
    const { log, db } = recorder();
    await db.select().from(t).where(and(inArray(t.classId, [...classScope(["A"])]), eq(t.userId, "u1")));
    expect(log[0]!.sql).toMatch(/where \("domigo_v2"\."practice_attempts"\."class_id" in \(\$1\)/);
    expect(log[0]!.params[0]).toBe("A");
  });

  it("TAMPER: the negative form inverts the wall — an empty notInArray is `true`", async () => {
    const { log, db } = recorder();
    await db.select().from(t).where(and(notInArray(t.classId, [...EMPTY_SCOPE]), eq(t.userId, "u1")));
    expect(log[0]!.sql).toContain("where (true and");
  });
});
