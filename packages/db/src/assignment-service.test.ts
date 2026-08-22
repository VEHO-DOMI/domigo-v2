/**
 * P1 · listClasses — the split-brain repair, under test.
 *
 * Before P1 the assignment/checkup builder read v1's `public.classes` only
 * ("Koki is the sole teacher"), so every v2-native class — i.e. every class of
 * the 2026/27 school year — was invisible to it and could never receive an
 * assignment. The rules under test: v2 classes of THIS teacher come first, the
 * v1 legacy classes follow unscoped, both halves filter archived rows, and a
 * broken v2 side degrades to the v1 list instead of an empty picker.
 */
import { describe, expect, it } from "vitest";
import { LEGACY_CLASS_LABEL_SUFFIX, listClasses } from "./assignment-service.ts";
import type { Db } from "./index.ts";

/**
 * Sequential chain-mock (house style, cf. auth.test.ts:seqDb): each db.select()
 * takes the next entry of `results`; an Error entry REJECTS (a missing table
 * throws at query time). Every builder step returns the same thenable node, so
 * one mock serves .where().orderBy(), .where().groupBy() and a bare .where().
 * `conditions` records what each query filtered on, in call order.
 */
function seqDb(results: (unknown[] | Error)[]) {
  let n = 0;
  const conditions: unknown[][] = [];
  const db = {
    select: () => {
      const r = results[n++];
      const p = r instanceof Error ? Promise.reject(r) : Promise.resolve(r ?? []);
      p.catch(() => {}); // keep an unawaited rejection from surfacing as unhandled
      const here: unknown[] = [];
      conditions.push(here);
      const node: Record<string, unknown> = {
        from: () => node,
        where: (c: unknown) => { here.push(c); return node; },
        orderBy: () => node,
        groupBy: () => node,
        limit: () => node,
        then: (a: never, b: never) => p.then(a, b),
        catch: (a: never) => p.catch(a),
      };
      return node;
    },
  };
  return { db: db as unknown as Db, conditions };
}

/**
 * Everything a drizzle condition tree carries — bound parameter values, column
 * names and the SQL fragments themselves. That last part is what makes the
 * archive assertions real: `isNull` leaves " is null" in the tree and `isNotNull`
 * leaves " is not null", so an INVERTED filter fails the test instead of passing it.
 */
function conditionAtoms(cond: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 12) return;
    if (typeof o === "string") { out.push(o); return; }
    if (Array.isArray(o)) { for (const x of o) walk(x, depth + 1); return; }
    if (typeof o !== "object") return;
    const rec = o as Record<string, unknown>;
    if ("value" in rec && typeof rec.value !== "object") out.push(String(rec.value));
    if (typeof rec.name === "string") out.push(`col:${rec.name}`);
    for (const k of Object.keys(rec)) walk(rec[k], depth + 1);
  };
  walk(cond);
  return [...new Set(out)];
}

const v2Class = { id: "v2-a", name: "TEST-2A", inviteCode: "TST2ER", grade: 2, createdAt: new Date(0) };
const v1Class = { id: "v1-a", name: "2B (alt)", grade: 2 };

describe("listClasses — v2 classes of the teacher, then the v1 legacy classes", () => {
  it("returns the teacher's v2 classes FIRST, the v1 legacy ones behind them", async () => {
    // 1: v2 classes · 2: their roster counts · 3: v1 classes
    const { db } = seqDb([[v2Class], [{ classId: "v2-a", n: 3 }], [v1Class]]);
    const rows = await listClasses(db, "T-1");
    expect(rows).toEqual([
      { id: "v2-a", name: "TEST-2A", grade: 2 },
      { id: "v1-a", name: `2B (alt)${LEGACY_CLASS_LABEL_SUFFIX}`, grade: 2 },
    ]);
  });

  it("scopes the v2 half to THIS teacher and skips archived classes", async () => {
    const { db, conditions } = seqDb([[v2Class], [], [v1Class]]);
    await listClasses(db, "T-1");
    const v2Where = conditionAtoms(conditions[0]);
    expect(v2Where).toContain("T-1"); // bound as a parameter ⇒ the query IS teacher-scoped
    expect(v2Where).toContain(" is null"); // archived rows filtered OUT, not IN
  });

  it("leaves the v1 half UNSCOPED (Koki era) but still archive-filtered", async () => {
    const { db, conditions } = seqDb([[v2Class], [], [v1Class]]);
    await listClasses(db, "T-1");
    const v1Where = conditionAtoms(conditions[conditions.length - 1]);
    expect(v1Where).toContain("col:archived_at");
    expect(v1Where).toContain(" is null");
    expect(v1Where).not.toContain("T-1"); // the legacy half is deliberately unscoped
  });

  it("keeps a name that exists in BOTH registers distinguishable (prod carries '2A' twice)", async () => {
    // Measured on production 2026-08-22: "2A" exists as a v1 row AND a v2 row.
    const sameName2A = { id: "v2-2a", name: "2A", inviteCode: "AAA111", grade: 2, createdAt: new Date(0) };
    const { db } = seqDb([[sameName2A], [], [{ id: "v1-2a", name: "2A", grade: 2 }]]);
    const rows = await listClasses(db, "T-1");
    expect(rows).toHaveLength(2); // BOTH survive — no de-duplication by name
    expect(rows[0]).toEqual({ id: "v2-2a", name: "2A", grade: 2 }); // v2 first, unsuffixed
    expect(rows[1]).toEqual({ id: "v1-2a", name: `2A${LEGACY_CLASS_LABEL_SUFFIX}`, grade: 2 });
    expect(rows[0]!.name).not.toBe(rows[1]!.name); // a teacher can tell them apart
    expect(rows[0]!.id).not.toBe(rows[1]!.id); // and the ids stay untouched
  });

  it("degrades to the v1 list when the domigo_v2 tables are unreachable (never an empty picker)", async () => {
    const { db } = seqDb([new Error('relation "domigo_v2.classes" does not exist'), [v1Class]]);
    const rows = await listClasses(db, "T-1");
    expect(rows).toEqual([{ id: "v1-a", name: `2B (alt)${LEGACY_CLASS_LABEL_SUFFIX}`, grade: 2 }]);
  });

  it("returns the v1 classes alone for a teacher who owns no v2 class yet", async () => {
    const { db } = seqDb([[], [v1Class]]); // no v2 rows ⇒ the count query never runs
    const rows = await listClasses(db, "T-new");
    expect(rows).toEqual([{ id: "v1-a", name: `2B (alt)${LEGACY_CLASS_LABEL_SUFFIX}`, grade: 2 }]);
  });
});
