/** Runs the original readers with an explicit in-memory transport; NOT real SQL.
 * The compiled Drizzle WHERE clauses determine which synthetic rows are returned.
 * A separate real local SQL failure/authorization pass still requires cgo-009. */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { listClassesForTeacher, listArchivedClassesForTeacher, type Db, type ClassScope } from "@domigo/db";
import { readTeacherClassLists } from "../app/admin/_lib/teacher-classes.ts";

const dbRequire = createRequire(new URL("../../../packages/db/package.json", import.meta.url));
const { PgDialect } = dbRequire("drizzle-orm/pg-core");
const dialect = new PgDialect();
const owner = "synthetic-owner";
const scope = ["own", "foreign", "archived"] as unknown as ClassScope;
const rows = [
  { id: "own", teacherId: owner, name: "1A", grade: 1, archivedAt: null },
  { id: "foreign", teacherId: "synthetic-other", name: "FOREIGN", grade: 2, archivedAt: null },
  { id: "outside", teacherId: owner, name: "OUTSIDE", grade: 3, archivedAt: null },
  { id: "archived", teacherId: owner, name: "4A", grade: 4, archivedAt: new Date("2025-07-01T00:00:00Z") },
].map((row) => ({ ...row, inviteCode: "SYNTHETIC", createdAt: new Date("2024-01-01T00:00:00Z") }));

function transport(failAt: "classes" | "counts" | null = null) {
  let queries = 0;
  return {
    queryCount: () => queries,
    db: {
      select: (selection: Record<string, unknown>) => {
        const isCount = "n" in selection;
        let where: { sql: string; params: unknown[] };
        const execute = async () => {
          queries++;
          if (failAt === (isCount ? "counts" : "classes")) throw new Error("synthetic transport rejection");
          assert.ok(where, "Reader must send a WHERE clause");
          if (isCount) return [];
          // Interpret only this existing query contract. Unsupported query changes
          // fail loudly rather than making a permissive fake database.
          assert.doesNotMatch(where.sql, /\bor\b|\bnot in\b/i);
          const idFilter = /"id" in \(([^)]+)\)/.exec(where.sql);
          const ownerFilter = /"teacher_id" = \$(\d+)/.exec(where.sql);
          const isEmptyScope = /\bfalse\b/.test(where.sql);
          const ids = idFilter ? [...idFilter[1]!.matchAll(/\$(\d+)/g)].map((m) => where.params[Number(m[1]) - 1]) : null;
          const teacher = ownerFilter ? where.params[Number(ownerFilter[1]) - 1] : null;
          const archived = /"archived_at" is not null/.test(where.sql);
          assert.ok(archived || /"archived_at" is null/.test(where.sql), "Missing archive predicate");
          return rows
            .filter((row) => !isEmptyScope && (!ids || ids.includes(row.id)) && (!teacher || row.teacherId === teacher) && Boolean(row.archivedAt) === archived)
            .map((row) => Object.fromEntries(Object.keys(selection).map((key) => [key, row[key as keyof typeof row]])));
        };
        const chain = {
          from: () => chain,
          where: (condition: unknown) => { where = dialect.sqlToQuery(condition); return chain; },
          orderBy: () => chain,
          groupBy: () => chain,
          then: (resolve: (value: unknown) => unknown, reject: (reason: unknown) => unknown) => execute().then(resolve, reject),
        };
        return chain;
      },
    } as unknown as Db,
  };
}

describe("original owned class readers with failing and adversarial transport", () => {
  it("keeps the owner wall even when a broader scope includes a foreign class", async () => {
    const t = transport();
    const actual = await listClassesForTeacher(t.db, scope, owner);
    assert.deepEqual(actual.map((row) => row.id), ["own"]);
    assert.equal(actual[0]!.studentCount, 0);
  });
  it("keeps the same owner and scope wall for archived classes", async () => {
    const t = transport();
    assert.deepEqual((await listArchivedClassesForTeacher(t.db, scope, owner)).map((row) => row.id), ["archived"]);
  });
  it("returns no rows for missing access, with no roster count query", async () => {
    const t = transport();
    assert.deepEqual(await listClassesForTeacher(t.db, [] as unknown as ClassScope, owner), []);
    assert.equal(t.queryCount(), 1);
  });
  for (const failure of ["classes", "counts"] as const) {
    for (const failed of ["active", "archived", "both"] as const) {
      it(`catches rejected ${failure} queries in ${failed} without masking failure`, async () => {
        const active = transport(failed !== "archived" ? failure : null);
        const archived = transport(failed !== "active" ? failure : null);
        const result = await readTeacherClassLists({
          active: () => listClassesForTeacher(active.db, scope, owner),
          archived: () => listArchivedClassesForTeacher(archived.db, scope, owner),
        });
        assert.equal(result.active.status, failed !== "archived" ? "error" : "ready");
        assert.equal(result.archived.status, failed !== "active" ? "error" : "ready");
        if (result.active.status === "ready") assert.deepEqual(result.active.value.map((row) => row.id), ["own"]);
        if (result.archived.status === "ready") assert.deepEqual(result.archived.value.map((row) => row.id), ["archived"]);
      });
    }
  }
});
