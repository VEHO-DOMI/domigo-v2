import { describe, expect, it } from "vitest";
import {
  MAX_CLASS_NAME_LENGTH,
  UNKNOWN_TEACHER_LABEL,
  listAllClassesForGrandmaster,
  validateClassName,
  validateGrade,
} from "./class-service.ts";
import type { Db } from "./index.ts";
import { eq, sql } from "drizzle-orm";
import { v2Classes } from "./schema.ts";

describe("validateClassName", () => {
  it("accepts a normal name and returns null", () => {
    expect(validateClassName("2A")).toBeNull();
    expect(validateClassName("Englisch 3B (Nachmittag)")).toBeNull();
  });

  it("rejects an empty or whitespace-only name", () => {
    expect(validateClassName("")).toBe("Give the class a name.");
    expect(validateClassName("   ")).toBe("Give the class a name.");
    expect(validateClassName("\t\n")).toBe("Give the class a name.");
  });

  it("trims before checking, so a padded name is accepted (not empty)", () => {
    expect(validateClassName("  2A  ")).toBeNull();
  });

  it("accepts a name exactly at the max length but rejects one past it", () => {
    const atMax = "x".repeat(MAX_CLASS_NAME_LENGTH);
    const overMax = "x".repeat(MAX_CLASS_NAME_LENGTH + 1);
    expect(validateClassName(atMax)).toBeNull();
    expect(validateClassName(overMax)).toBe(`A class name can be at most ${MAX_CLASS_NAME_LENGTH} characters.`);
  });

  it("measures length AFTER trimming (trailing spaces don't push it over)", () => {
    const padded = "x".repeat(MAX_CLASS_NAME_LENGTH) + "     ";
    expect(validateClassName(padded)).toBeNull();
  });
});

describe("validateGrade — Austrian AHS lower cycle is 1..4", () => {
  it("accepts each of 1, 2, 3, 4", () => {
    expect(validateGrade(1)).toBe(true);
    expect(validateGrade(2)).toBe(true);
    expect(validateGrade(3)).toBe(true);
    expect(validateGrade(4)).toBe(true);
  });

  it("rejects the out-of-range boundaries 0 and 5", () => {
    expect(validateGrade(0)).toBe(false);
    expect(validateGrade(5)).toBe(false);
  });

  it("rejects non-integers and non-finite values", () => {
    expect(validateGrade(2.5)).toBe(false);
    expect(validateGrade(NaN)).toBe(false);
    expect(validateGrade(Infinity)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// P3 · listAllClassesForGrandmaster — the operator's all-classes view.
//
// This is the ONE read on the platform that is deliberately not owner-scoped, so
// the properties worth proving are the ones that would quietly make it lie: that
// it filters archived rows OUT (not in), that "claimed" really is the claimed
// count and not a copy of the head count, that a broken v2 register is reported
// as BROKEN rather than as an empty platform, and that the legacy half stays a
// head count and never reaches for a person column.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sequential chain-mock (house style, cf. assignment-service.test.ts:seqDb and
 * auth.test.ts): each db.select() takes the next entry of `results`; an Error entry
 * REJECTS (a missing table throws at query time). One node serves every builder
 * step. Beyond the sibling mock it also records each call's SELECTION, because
 * half of what matters here is WHICH COLUMNS are read — the privacy rule and the
 * claimed-count rule both live in the projection, not in the WHERE clause.
 */
function seqDb(results: (unknown[] | Error)[]) {
  let n = 0;
  const conditions: unknown[][] = [];
  const selections: unknown[] = [];
  const db = {
    select: (selection?: unknown) => {
      const r = results[n++];
      const p = r instanceof Error ? Promise.reject(r) : Promise.resolve(r ?? []);
      p.catch(() => {}); // keep an unawaited rejection from surfacing as unhandled
      const here: unknown[] = [];
      conditions.push(here);
      selections.push(selection);
      const node: Record<string, unknown> = {
        from: () => node,
        innerJoin: () => node,
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
  return { db: db as unknown as Db, conditions, selections };
}

/**
 * The atoms of ONE drizzle node — its own SQL fragments, bound values and column
 * references — walked with a hard rule: **stop at a column**.
 *
 * That rule is the whole point. A drizzle Column carries a back-reference to its
 * TABLE, and a table lists every one of its columns; a naive deep walk therefore
 * surfaces `display_name` from a query that only ever reads `class_id`, which
 * would turn every NEGATIVE assertion below ("this projection reads no person
 * column", "this query is not teacher-scoped") into a vacuous statement about the
 * table. Walking only the node's own chunks keeps those assertions real: an
 * `and(...)` shows both its halves, an `sql`count(x)`` shows "count(" and its
 * column, and nothing shows a sibling it never touched.
 *
 * K1b · THE DEPTH CAP IS A CYCLE GUARD, NOT A FILTER — and at 8 it was acting as
 * one. K1a measured this in the sister file (class-progress.test.ts): a WHERE that
 * nests one level further — an `and(...)` around an `inArray(...)` around its
 * chunks — had its innermost text (" <= now()", "->>'trap'") silently cut off, so
 * three NEGATIVE assertions passed because the walker never reached the atom, not
 * because the atom was absent. A green test that cannot see what it denies has no
 * evidential value. 16 is past the deepest real nesting here, with room to spare.
 */
function atomsOf(node: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 16) return;
    if (typeof o === "string") { out.push(o); return; }
    // K2b (Rider D) · THE NUMBER BRANCH. drizzle puts a number interpolated into an
    // sql`` template into queryChunks as a RAW number — only `eq()` and friends wrap
    // one in a Param, which the `value` branch below already catches. Without this
    // line the walker cannot SEE such an atom, and a walker that cannot see an atom
    // reports its absence as proof: every negative assertion about a numeric bound
    // ("the cap is sixteen", "the grant is fifty") passes vacuously. Paid for once
    // in K1b; unified across all three walkers here so it cannot come back per file.
    if (typeof o === "number") { out.push(String(o)); return; }
    if (Array.isArray(o)) { for (const x of o) walk(x, depth + 1); return; }
    if (typeof o !== "object") return;
    const rec = o as Record<string, unknown>;
    // A column: its own name, and NOT its table.
    if (typeof rec.name === "string" && "table" in rec) { out.push(`col:${rec.name}`); return; }
    // An sql`` fragment / condition tree: its chunks (strings, params, columns).
    if (Array.isArray(rec.queryChunks)) { walk(rec.queryChunks, depth + 1); return; }
    // A StringChunk holds string[]; a Param holds one bound value.
    if (Array.isArray(rec.value)) { walk(rec.value, depth + 1); return; }
    if ("value" in rec && (typeof rec.value === "string" || typeof rec.value === "number")) out.push(String(rec.value));
  };
  walk(node);
  return [...new Set(out)];
}

/** The atoms of a whole SELECT projection — every selected expression, same rule. */
function projectionAtoms(selection: unknown): string[] {
  if (!selection || typeof selection !== "object") return [];
  return [...new Set(Object.values(selection as Record<string, unknown>).flatMap((v) => atomsOf(v)))];
}

const v2Row = { id: "v2-a", name: "TEST-K1", grade: 1, inviteCode: "TSTK1A", teacherId: "T-2", createdAt: new Date(0) };
const legacyRow = { id: "v1-a", name: "2B", grade: 2 };

/** The full happy-path call order: v2 classes · counts · v2 names · legacy classes · legacy counts. */
function happyDb(overrides: Partial<{ v2: unknown[]; counts: unknown[]; names: unknown[]; legacy: unknown[]; legacyCounts: unknown[] }> = {}) {
  return seqDb([
    overrides.v2 ?? [v2Row],
    overrides.counts ?? [{ classId: "v2-a", total: 5, claimed: 2 }],
    overrides.names ?? [{ id: "T-2", displayName: "TEST-Kollegin" }],
    overrides.legacy ?? [legacyRow],
    overrides.legacyCounts ?? [{ classId: "v1-a", total: 21 }],
  ]);
}

describe("listAllClassesForGrandmaster — every class on the platform, both registers", () => {
  it("returns each v2 class with its OWNER's name and both head counts", async () => {
    const { db } = happyDb();
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2).toEqual([
      {
        id: "v2-a",
        name: "TEST-K1",
        grade: 1,
        inviteCode: "TSTK1A",
        ownerId: "T-2",
        ownerName: "TEST-Kollegin",
        studentCount: 5,
        claimedCount: 2,
        createdAt: new Date(0),
      },
    ]);
    expect(view.v2Failed).toBe(false);
  });

  it("returns the legacy register as name + grade + a head count, nothing more", async () => {
    const { db } = happyDb();
    const view = await listAllClassesForGrandmaster(db);
    expect(view.legacy).toEqual([{ id: "v1-a", name: "2B", grade: 2, studentCount: 21 }]);
  });

  it("counts CLAIMED students with count(claimed_at), not a second head count", async () => {
    const { db, selections } = happyDb();
    await listAllClassesForGrandmaster(db);
    const countSelection = projectionAtoms(selections[1]); // call 2 = the grouped roster counts
    expect(countSelection).toContain("col:claimed_at"); // the claimed half reads the claim stamp …
    expect(countSelection.some((a) => a.includes("count("))).toBe(true); // … inside a count()
    expect(countSelection).toContain("col:class_id"); // grouped per class
  });

  it("never selects a person column from the legacy register (a head count, not a list)", async () => {
    const { db, selections } = happyDb();
    await listAllClassesForGrandmaster(db);
    const legacyCounts = projectionAtoms(selections[4]); // call 5 = the v1 grouped counts
    expect(legacyCounts).toContain("col:class_id");
    for (const forbidden of ["col:display_name", "col:given_name", "col:pin_hash", "col:id"]) {
      expect(legacyCounts).not.toContain(forbidden);
    }
  });

  it("filters archived rows OUT of BOTH registers (not in)", async () => {
    const { db, conditions } = happyDb();
    await listAllClassesForGrandmaster(db);
    for (const idx of [0, 3]) { // call 1 = v2 classes, call 4 = legacy classes
      const where = atomsOf(conditions[idx]);
      expect(where).toContain("col:archived_at");
      expect(where).toContain(" is null"); // an inverted filter leaves " is not null"
    }
  });

  it("is NOT scoped to any teacher — that is the whole point of the rank", async () => {
    const { db, conditions } = happyDb();
    await listAllClassesForGrandmaster(db);
    expect(atomsOf(conditions[0])).not.toContain("col:teacher_id");
  });

  it("reports a broken v2 register as BROKEN, never as an empty platform", async () => {
    // v2 classes throw ⇒ counts + names never run; the legacy half continues.
    const { db } = seqDb([
      new Error('relation "domigo_v2.classes" does not exist'),
      [legacyRow],
      [{ classId: "v1-a", total: 21 }],
    ]);
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2Failed).toBe(true); // the honest third state
    expect(view.v2).toEqual([]);
    expect(view.legacy).toHaveLength(1); // the register that COULD be read still is
  });

  it("K2b · reports a broken LEGACY register as BROKEN too, instead of taking the page down", async () => {
    // Before K2b this half had no try/catch at all: it threw, the server component
    // 500'd, and the grandmaster lost the v2 list as well — a probe whose whole job
    // is to report on both registers could be killed by one of them.
    const { db } = seqDb([
      [v2Row],
      [{ classId: "v2-a", total: 5, claimed: 2 }],
      [{ id: "T-2", displayName: "TEST-Kollegin" }],
      new Error('relation "public.classes" does not exist'),
    ]);
    const view = await listAllClassesForGrandmaster(db);
    expect(view.legacyFailed).toBe(true); // the honest third state, now on both sides
    expect(view.legacy).toEqual([]);
    expect(view.v2).toHaveLength(1); // the register that COULD be read still is
    expect(view.v2Failed).toBe(false); // and it is NOT tarred with the other's failure
  });

  it("K2b · both flags are false on a healthy read — the symmetry is the point", async () => {
    const { db } = happyDb();
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2Failed).toBe(false);
    expect(view.legacyFailed).toBe(false);
  });

  it("K2b · a legacy register that is merely EMPTY is not a failure", async () => {
    // TAMPER on the meaning: were legacyFailed derived from `legacy.length === 0`
    // instead of from a caught throw, this case would report a broken register on a
    // platform that simply has no old classes left.
    const { db } = happyDb({ legacy: [], legacyCounts: [] });
    const view = await listAllClassesForGrandmaster(db);
    expect(view.legacy).toEqual([]);
    expect(view.legacyFailed).toBe(false);
  });

  it("labels an owner it cannot resolve in EITHER register, instead of blanking it", async () => {
    // v2 names empty ⇒ the v1 fallback runs and is empty too.
    const { db } = seqDb([
      [v2Row],
      [{ classId: "v2-a", total: 5, claimed: 2 }],
      [], // no v2 teacher row
      [], // no v1 teacher row either
      [legacyRow],
      [{ classId: "v1-a", total: 21 }],
    ]);
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2[0]!.ownerName).toBe(UNKNOWN_TEACHER_LABEL);
    expect(view.v2[0]!.ownerId).toBe("T-2"); // the id is still exact
  });

  it("falls back to the v1 mirror for a teacher not yet promoted into v2", async () => {
    const { db } = seqDb([
      [v2Row],
      [{ classId: "v2-a", total: 5, claimed: 2 }],
      [], // not in domigo_v2.users …
      [{ id: "T-2", displayName: "Koki" }], // … but in public.users
      [legacyRow],
      [{ classId: "v1-a", total: 21 }],
    ]);
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2[0]!.ownerName).toBe("Koki");
  });

  it("shows a class with an empty roster as 0/0 rather than dropping it", async () => {
    const { db } = happyDb({ counts: [] });
    const view = await listAllClassesForGrandmaster(db);
    expect(view.v2).toHaveLength(1);
    expect(view.v2[0]!.studentCount).toBe(0);
    expect(view.v2[0]!.claimedCount).toBe(0);
  });
});

describe("Rider D · the atom walker can SEE a raw number", () => {
  it("finds a number interpolated into an sql`` template — the branch this asserts is not decoration", () => {
    // Measured against drizzle itself: sql`… ${2}` lands in queryChunks as a bare
    // `2`, while eq(col, 2) wraps it in a Param. A walker without the number branch
    // returns the column and drops the bound value — so a test that asserts a bound
    // is ABSENT would pass no matter what the code does. This is the tamper: remove
    // the number branch from atomsOf above and this case goes red.
    const atoms = atomsOf(sql`${v2Classes.grade} >= ${2}`);
    expect(atoms).toContain("2");
    expect(atoms).toContain("col:grade");
    // And the Param form keeps working, so the branch ADDS reach, never replaces it.
    expect(atomsOf(eq(v2Classes.grade, 3))).toContain("3");
  });
});
