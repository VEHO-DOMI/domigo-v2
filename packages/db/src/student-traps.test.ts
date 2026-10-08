import { describe, expect, it } from "vitest";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema.ts";
import { classScope } from "./scope.ts";
import { listStudentTraps } from "./student-traps.ts";

// Compile and execute the real query builder. Only its transport is replaced:
// no credentials, Neon connection or imitation of the query's filter logic.
async function capture(scope = ["allowed-class"], options?: { sinceDays?: number; limit?: number }) {
  let query = "";
  const queries: string[] = [];
  let params: unknown[] = [];
  const client = { query: async (text: string, values: unknown[]) => {
    query = text; params = values; queries.push(text);
    return { rows: [["future-trap", "4", "g1-u02", "latest-item"]] };
  } };
  const db = drizzle(client as never, { schema });
  const rows = await listStudentTraps(db, classScope(scope), "requested-class", "own-child", options);
  return { query, params, rows, queries, where: query.split(" where ")[1]!.split(" group by ")[0]! };
}

describe("student trap ledger", () => {
  it("executes exactly one read and no writes", async () => {
    const { queries } = await capture();
    expect(queries).toHaveLength(1);
    expect(queries[0]).toMatch(/^select /);
  });
  it("puts the allowed class scope first, before the requested class", async () => {
    const { where, params } = await capture();
    expect(where).toMatch(/^\("domigo_v2"\."practice_attempts"\."class_id" in \(\$1\) and "domigo_v2"\."practice_attempts"\."class_id" = \$2/);
    expect(params.slice(0, 2)).toEqual(["allowed-class", "requested-class"]);
    expect((await capture([])).where).toMatch(/^\(false and /);
  });
  it("binds the actual child id and wrong tier, across practice modes", async () => {
    const { where, params } = await capture();
    expect(where).toContain('"user_id" = $3');
    expect(where).toContain('"tier" = $4');
    expect(params.slice(2, 4)).toEqual(["own-child", "wrong"]);
    expect(where).not.toContain('"mode"');
  });
  it("uses an inclusive rolling window on the existing attempt timestamp", async () => {
    const { where, params } = await capture();
    expect(where).toContain('"created_at" >= now() - make_interval(days => $5::int)');
    expect(params[4]).toBe(30);
    expect((await capture(undefined, { sinceDays: 7 })).params[4]).toBe(7);
  });
  it("extracts only a nonempty string trap from arbitrary JSON", async () => {
    const { where } = await capture();
    expect(where).toContain('"context"->>\'trap\' is not null');
    expect(where).toContain('jsonb_typeof("domigo_v2"."practice_attempts"."context"->\'trap\') = \'string\'');
    expect(where).toContain('"context"->>\'trap\' <> \'\'');
  });
  it("groups by trap, requires two occurrences, ranks and limits in SQL", async () => {
    const { query, params } = await capture();
    expect(query).toContain('count(*)::int');
    expect(query).toContain('group by "domigo_v2"."practice_attempts"."context"->>\'trap\' having count(*) >= 2');
    expect(query).toContain('order by count(*) desc, max("domigo_v2"."practice_attempts"."created_at") desc, "domigo_v2"."practice_attempts"."context"->>\'trap\' limit $6');
    expect(params[5]).toBe(3);
    expect((await capture(undefined, { limit: 2 })).params[5]).toBe(2);
  });
  it("takes both door coordinates from the same latest occurrence", async () => {
    const { query } = await capture();
    for (const field of ["unit_slug", "item_id"]) {
      expect(query).toContain(`(array_agg("${field}" order by "created_at" desc, "id" desc))[1]`);
    }
  });
  it("returns numeric counts and preserves unknown ids and the latest door", async () => {
    expect((await capture()).rows).toEqual([{ trapId: "future-trap", count: 4, unitSlug: "g1-u02", itemId: "latest-item" }]);
  });
});
