import { describe, expect, it } from "vitest";
import {
  ARCHIVE_KIND,
  MAX_CLASS_NAME_LENGTH,
  UNARCHIVE_KIND,
  UNKNOWN_TEACHER_LABEL,
  archiveClass,
  listAllClassesForGrandmaster,
  listArchivedClassesForTeacher,
  unarchiveClass,
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


// ─────────────────────────────────────────────────────────────────────────────
// K9b · ARCHIVE ↔ UNARCHIVE — the correction that turns a one-way door around.
//
// Three properties decide whether this is safe, and each of them fails silently if
// it is wrong: (1) the WHERE clause is the authorization, so an un-archive must be
// unable to reach a class the teacher does not own OR one that is not archived;
// (2) journal-then-flip means the event is written BEFORE the live change and never
// for an attempt that was refused; (3) `actorId` may NAME the grandmaster's hand and
// must never reach a WHERE clause — a leak there is the whole rank escaping into
// every ordinary teacher call.
// ─────────────────────────────────────────────────────────────────────────────

interface Step {
  rows?: unknown[];
  error?: unknown;
}

/** One statement the service issued, in order — what it was, what it wrote, what it filtered on. */
interface Call {
  op: "select" | "insert" | "update";
  table?: unknown;
  values?: unknown;
  set?: unknown;
  where: unknown[];
}

/**
 * Full chain-mock (house style, cf. teacher-claim.test.ts:mockDb) that also RECORDS
 * every call in order, because half of what matters here is sequence: the journal row
 * must exist before the flip, and must not exist at all when the guard refused.
 */
function opsDb(steps: Step[]) {
  const queue = [...steps];
  const calls: Call[] = [];
  const chain = (call: Call) => {
    calls.push(call);
    const node: Record<string, unknown> = {
      from: () => node,
      innerJoin: () => node,
      orderBy: () => node,
      groupBy: () => node,
      limit: () => node,
      returning: () => node,
      where: (c: unknown) => { call.where.push(c); return node; },
      values: (v: unknown) => { call.values = v; return node; },
      set: (v: unknown) => { call.set = v; return node; },
      then: (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => {
        const step = queue.shift();
        if (!step) return Promise.reject(new Error("mock: one DB call more than the script allows")).then(res, rej);
        if (step.error) return Promise.reject(step.error).then(res, rej);
        return Promise.resolve(step.rows ?? []).then(res, rej);
      },
    };
    return node;
  };
  const db = {
    select: (selection?: unknown) => chain({ op: "select", values: selection, where: [] }),
    insert: (table: unknown) => chain({ op: "insert", table, where: [] }),
    update: (table: unknown) => chain({ op: "update", table, where: [] }),
  };
  return { db: db as unknown as Db, calls };
}

const OWNER = "11111111-1111-1111-1111-111111111111";
const FOREIGN = "22222222-2222-2222-2222-222222222222";
const GRANDMASTER = "33333333-3333-3333-3333-333333333333";
const CLS = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

describe("unarchiveClass — one column back to NULL, and only where it may be", () => {
  it("writes the journal row BEFORE the flip, and reports the restore", async () => {
    const { db, calls } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [{ id: CLS }] }]);
    expect(await unarchiveClass(db, CLS, OWNER)).toBe(true);

    expect(calls.map((c) => c.op)).toEqual(["select", "insert", "update"]); // the order IS the law
    expect(calls[1]!.values).toMatchObject({ classId: CLS, kind: UNARCHIVE_KIND, actorId: OWNER });
    expect(calls[2]!.set).toEqual({ archivedAt: null }); // exactly one column, back to null
  });

  it("refuses a class that is foreign, gone, or not archived — WITHOUT journalling it", async () => {
    // The guard read comes back empty. Journalling before this point would let any
    // teacher write "class X was restored" into a class they cannot touch.
    const { db, calls } = opsDb([{ rows: [] }]);
    expect(await unarchiveClass(db, CLS, FOREIGN)).toBe(false);
    expect(calls).toHaveLength(1);
    expect(calls.map((c) => c.op)).toEqual(["select"]);
  });

  it("filters on owner AND on 'already archived' — in BOTH statements, not just the first", async () => {
    const { db, calls } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [{ id: CLS }] }]);
    await unarchiveClass(db, CLS, OWNER);
    for (const call of [calls[0]!, calls[2]!]) { // the guard read AND the flip
      const where = atomsOf(call.where);
      expect(where).toContain("col:teacher_id"); // owner scope
      expect(where).toContain("col:id");
      expect(where).toContain("col:archived_at");
      expect(where).toContain(" is not null"); // an inverted filter would read " is null"
      expect(where).toContain(OWNER); // the id actually bound, not just a column named
    }
  });

  it("lets RETURNING have the last word: zero flipped rows is NOT a success", async () => {
    // The guard passed, then someone else restored the class first. Reporting "ok"
    // here would tell a teacher her click worked when the row it aimed at was gone.
    const { db } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [] }]);
    expect(await unarchiveClass(db, CLS, OWNER)).toBe(false);
  });

  it("names the grandmaster's HAND in the journal while running on the OWNER's authorization", async () => {
    const { db, calls } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [{ id: CLS }] }]);
    await unarchiveClass(db, CLS, OWNER, GRANDMASTER);

    expect(calls[1]!.values).toMatchObject({ actorId: GRANDMASTER }); // the journal cannot lie about the hand
    for (const call of [calls[0]!, calls[2]!]) {
      // …and the actor reaches NO where clause. This is the assertion that keeps the
      // rank from leaking: actorId may name an actor, never widen an authorization.
      expect(atomsOf(call.where)).not.toContain(GRANDMASTER);
      expect(atomsOf(call.where)).toContain(OWNER);
    }
  });
});

describe("archiveClass — same door, now journalled, still owner-only", () => {
  it("journals 'archive' before the flip (it was the last unhistoried class mutation)", async () => {
    const { db, calls } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [{ id: CLS }] }]);
    expect(await archiveClass(db, CLS, OWNER)).toBe(true);

    expect(calls.map((c) => c.op)).toEqual(["select", "insert", "update"]);
    expect(calls[1]!.values).toMatchObject({ classId: CLS, kind: ARCHIVE_KIND, actorId: OWNER });
    expect((calls[2]!.set as { archivedAt: Date }).archivedAt).toBeInstanceOf(Date);
  });

  it("refuses a foreign or already-archived class without journalling it", async () => {
    const { db, calls } = opsDb([{ rows: [] }]);
    expect(await archiveClass(db, CLS, FOREIGN)).toBe(false);
    expect(calls).toHaveLength(1);
  });

  it("filters on 'still live' — the MIRROR of unarchive, and the proof the two differ", async () => {
    const { db, calls } = opsDb([{ rows: [{ id: CLS }] }, { rows: [] }, { rows: [{ id: CLS }] }]);
    await archiveClass(db, CLS, OWNER);
    for (const call of [calls[0]!, calls[2]!]) {
      const where = atomsOf(call.where);
      expect(where).toContain("col:archived_at");
      expect(where).toContain(" is null");
      expect(where).not.toContain(" is not null"); // if these two ever agreed, one of them is wrong
      expect(where).toContain("col:teacher_id");
    }
  });

  it("takes no actor parameter at all — the rank has no way in here", () => {
    // A structural assertion, not a stylistic one: archiveClass(db, id, teacherId).
    // The day someone adds a fourth argument, this line is the conversation.
    expect(archiveClass.length).toBe(3);
    expect(unarchiveClass.length).toBe(4); // …whereas unarchive DOES take the hand
  });
});

describe("listArchivedClassesForTeacher — the other half of the active list's filter", () => {
  const row = { id: CLS, name: "TEST-K9B", inviteCode: "TSTK9B", grade: 2, archivedAt: new Date(1), createdAt: new Date(0) };

  it("returns each archived class with its head count and its archive date", async () => {
    const { db } = opsDb([{ rows: [row] }, { rows: [{ classId: CLS, n: 3 }] }]);
    expect(await listArchivedClassesForTeacher(db, OWNER)).toEqual([
      { ...row, studentCount: 3 },
    ]);
  });

  it("is scoped to the owner and reads ONLY archived rows", async () => {
    const { db, calls } = opsDb([{ rows: [row] }, { rows: [{ classId: CLS, n: 3 }] }]);
    await listArchivedClassesForTeacher(db, OWNER);
    const where = atomsOf(calls[0]!.where);
    expect(where).toContain("col:teacher_id");
    expect(where).toContain(OWNER);
    expect(where).toContain("col:archived_at");
    expect(where).toContain(" is not null"); // the active list uses " is null"; this is its complement
  });

  it("shows an archived class with an empty roster as 0 rather than dropping it", async () => {
    const { db } = opsDb([{ rows: [row] }, { rows: [] }]);
    const list = await listArchivedClassesForTeacher(db, OWNER);
    expect(list).toHaveLength(1);
    expect(list[0]!.studentCount).toBe(0);
  });

  it("asks NO second question when there is nothing archived", async () => {
    const { db, calls } = opsDb([{ rows: [] }]);
    expect(await listArchivedClassesForTeacher(db, OWNER)).toEqual([]);
    expect(calls).toHaveLength(1); // the head count would be a query over an empty id list
  });
});
