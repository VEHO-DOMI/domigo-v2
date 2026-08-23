import { describe, expect, it } from "vitest";
import {
  listClassTraps,
  listClassUnitProgress,
  listStudentMeta,
  listStudentPathSummary,
  listStudentProgress,
  trapLabel,
} from "./class-progress.ts";
import type { Db } from "./index.ts";

// ─────────────────────────────────────────────────────────────────────────────
// K1a · the class-scoped teacher readers.
//
// What is worth proving here is not that an aggregate adds up — Postgres does
// that — but the two properties that would make this page LIE without ever
// failing: that every read is narrowed to ONE class (a grade-wide number would
// look perfectly plausible while averaging in the whole school), and that the
// unit roll-up is NOT narrowed to the story game (the documented blind spot of
// the /admin dashboard this page exists to replace). Both are negative claims,
// so both are asserted negatively, against the query's own atoms.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sequential chain-mock (house style, cf. class-service.test.ts:seqDb): each
 * db.select() takes the next entry of `results`; one node serves every builder
 * step. Records each call's WHERE conditions and its SELECTION, because half of
 * what matters lives in the projection rather than the filter.
 */
function seqDb(results: (unknown[] | Error)[]) {
  let n = 0;
  const conditions: unknown[][] = [];
  const selections: unknown[] = [];
  const groupings: unknown[] = [];
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
        groupBy: (g: unknown) => { groupings.push(g); return node; },
        limit: () => node,
        then: (a: never, b: never) => p.then(a, b),
        catch: (a: never) => p.catch(a),
      };
      return node;
    },
  };
  return { db: db as unknown as Db, conditions, selections, groupings, calls: () => n };
}

/**
 * The atoms of ONE drizzle node — its own SQL fragments, bound values and column
 * references — walked with a hard rule: **stop at a column**. A drizzle Column
 * back-references its TABLE and a table lists all its columns, so a naive deep
 * walk would surface `mode` from a query that never mentions it and turn every
 * negative assertion below into a vacuous statement about the table.
 *
 * The depth cap is a CYCLE guard, not a filter, and it is deeper here than in
 * class-service.test.ts on purpose: these WHERE clauses nest one level further
 * (an `and(...)` wrapping an `inArray(...)` wrapping its chunks), and at the
 * sibling's cap of 8 the innermost text — " <= now()", "->>'trap'" — was silently
 * cut off, which would have made three assertions below pass for the wrong reason.
 */
function atomsOf(node: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 16) return;
    if (typeof o === "string") { out.push(o); return; }
    if (Array.isArray(o)) { for (const x of o) walk(x, depth + 1); return; }
    if (typeof o !== "object") return;
    const rec = o as Record<string, unknown>;
    if (typeof rec.name === "string" && "table" in rec) { out.push(`col:${rec.name}`); return; }
    if (Array.isArray(rec.queryChunks)) { walk(rec.queryChunks, depth + 1); return; }
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

const CLASS = "class-2er";

describe("listStudentProgress", () => {
  it("is scoped to ONE class, and to no other coordinate", async () => {
    const { db, conditions } = seqDb([[]]);
    await listStudentProgress(db, CLASS);
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:class_id");
    expect(where).toContain(CLASS); // the bound value, not just the column
    // The negative half: this is NOT the grade-wide dashboard read.
    expect(where).not.toContain("col:grade");
    expect(where).not.toContain("col:mode");
  });

  it("counts an item as solved when it was better than wrong, and correct only when correct", async () => {
    const { db, selections } = seqDb([[]]);
    await listStudentProgress(db, CLASS);
    const proj = projectionAtoms(selections[0]);
    expect(proj.join(" ")).toContain("<> 'wrong'"); // itemsSolved admits partial/close
    expect(proj.join(" ")).toContain("= 'correct'"); // the rate does not
    expect(proj).toContain("col:user_id");
  });

  it("derives the rate in JS with a zero-guard (no rows ⇒ 0, never NaN)", async () => {
    const { db } = seqDb([[{ userId: "u1", attempts: 0, itemsSolved: 0, correct: 0, lastActiveAt: null }]]);
    const [row] = await listStudentProgress(db, CLASS);
    expect(row!.correctRate).toBe(0);
    expect(row!.lastActiveAt).toBeNull();
  });
});

describe("listStudentPathSummary", () => {
  it("is scoped to ONE class", async () => {
    const { db, conditions } = seqDb([[]]);
    await listStudentPathSummary(db, CLASS);
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:class_id");
    expect(where).toContain(CLASS);
    expect(where).not.toContain("col:grade");
  });

  it("keys the map by student", async () => {
    const { db } = seqDb([[{ userId: "u1", completed: 3, stars: 7 }]]);
    const m = await listStudentPathSummary(db, CLASS);
    expect(m.get("u1")).toEqual({ completedNodes: 3, totalStars: 7 });
  });
});

describe("listStudentMeta", () => {
  it("short-circuits an EMPTY id list without touching the database", async () => {
    const { db, calls } = seqDb([[], []]);
    const m = await listStudentMeta(db, []);
    expect(m.size).toBe(0);
    expect(calls()).toBe(0); // `IN ()` is a syntax error — it must never be built
  });

  it("filters BOTH reads on the id list, and the due read on the due date", async () => {
    const { db, conditions } = seqDb([[], []]);
    await listStudentMeta(db, ["u1", "u2"]);
    const progressWhere = atomsOf(conditions[0]);
    expect(progressWhere).toContain("col:user_id");
    expect(progressWhere).toContain("u1");
    expect(progressWhere).toContain("u2");
    const dueWhere = atomsOf(conditions[1]);
    expect(dueWhere).toContain("col:user_id");
    expect(dueWhere).toContain("col:due_at");
    expect(dueWhere.join(" ")).toContain("<= now()");
  });

  it("merges the due count onto a student who has an XP row, and onto one who has none", async () => {
    const { db } = seqDb([
      [{ userId: "u1", xp: 40, grammarXp: 10, streak: 3 }],
      [{ userId: "u1", due: 5 }, { userId: "u2", due: 2 }],
    ]);
    const m = await listStudentMeta(db, ["u1", "u2"]);
    expect(m.get("u1")).toEqual({ xp: 40, grammarXp: 10, streak: 3, dueCount: 5 });
    expect(m.get("u2")).toEqual({ xp: 0, grammarXp: 0, streak: 0, dueCount: 2 });
  });

  it("de-duplicates repeated ids", async () => {
    const { db, conditions } = seqDb([[], []]);
    await listStudentMeta(db, ["u1", "u1"]);
    expect(atomsOf(conditions[0]).filter((a) => a === "u1")).toHaveLength(1);
  });

  it("treats a list of only blank ids as empty — no query, not an `IN (\'\')`", async () => {
    const { db, calls } = seqDb([[], []]);
    const m = await listStudentMeta(db, ["", ""]);
    expect(m.size).toBe(0);
    expect(calls()).toBe(0);
  });
});

describe("listClassUnitProgress", () => {
  it("is scoped to ONE class and to NO mode — every way of practising counts", async () => {
    const { db, conditions } = seqDb([[]]);
    await listClassUnitProgress(db, CLASS);
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:class_id");
    expect(where).toContain(CLASS);
    // THE point of this reader: the /admin dashboard filters `mode = game:g<n>`
    // and therefore cannot see a child who only ever practised. This one must not.
    expect(where).not.toContain("col:mode");
    expect(where.join(" ")).not.toContain("game:");
    expect(where).not.toContain("col:grade");
  });

  it("sorts by unit slug so the table order is stable", async () => {
    const { db } = seqDb([[
      { unitSlug: "g2-u03", attempts: 1, itemsSolved: 1, correct: 1 },
      { unitSlug: "g2-u01", attempts: 2, itemsSolved: 2, correct: 1 },
    ]]);
    const rows = await listClassUnitProgress(db, CLASS);
    expect(rows.map((r) => r.unitSlug)).toEqual(["g2-u01", "g2-u03"]);
    expect(rows[1]!.correctRate).toBe(1);
  });
});

describe("listClassTraps", () => {
  it("counts only WRONG attempts that actually carry a trap, in this class", async () => {
    const { db, conditions } = seqDb([[]]);
    await listClassTraps(db, CLASS);
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:class_id");
    expect(where).toContain(CLASS);
    expect(where).toContain("wrong"); // the bound tier value
    expect(where).toContain("col:tier");
    const text = where.join(" ");
    expect(text).toContain("->>'trap'");
    expect(text).toContain("is not null"); // a null trap is the common case, never a row
  });

  it("reads the trap out of the context jsonb, not out of a column", async () => {
    const { db, selections } = seqDb([[]]);
    await listClassTraps(db, CLASS);
    const proj = projectionAtoms(selections[0]);
    expect(proj).toContain("col:context");
    expect(proj.join(" ")).toContain("->>'trap'");
  });

  it("returns the counted pairs", async () => {
    const { db } = seqDb([[{ trapId: "wilde-verben", count: 4 }]]);
    expect(await listClassTraps(db, CLASS)).toEqual([{ trapId: "wilde-verben", count: 4 }]);
  });
});

describe("trapLabel", () => {
  const known = new Map([
    ["wilde-verben", { nameDe: "Wilde Verben", icon: "🦁", oneLinerDe: "go → went." }],
  ]);

  it("names a trap the registry knows", () => {
    expect(trapLabel(known, "wilde-verben")).toEqual({
      nameDe: "Wilde Verben", icon: "🦁", oneLinerDe: "go → went.", known: true,
    });
  });

  it("renders an UNKNOWN id as its own raw text instead of breaking the page", () => {
    // The ledger is history and the registry is content: a trap retired or renamed
    // tomorrow must not turn yesterday's attempts into a crash.
    const label = trapLabel(known, "gibt-es-nicht");
    expect(label.known).toBe(false);
    expect(label.nameDe).toBe("gibt-es-nicht");
    expect(label.icon).toBeNull();
  });

  it("treats an EMPTY registry as unknown, not as an error", () => {
    expect(trapLabel(new Map(), "wilde-verben").known).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// K1b · Rider A — THE READERS MUST NOT SWALLOW.
//
// The class page now shows an honest third state: a section whose reader failed
// says UNVOLLSTÄNDIG instead of rendering the empty-list copy ("Noch niemand auf
// der Liste") over a full class. That state is only reachable if a broken read
// arrives as a REJECTION. If any reader below ever grew its own `.catch(() => [])`,
// the page would silently go back to telling the plausible lie — and no test would
// notice, because the return type is identical.
//
// So this is a negative property about the SHAPE of failure, and it is pinned per
// reader rather than once: they are five separate functions, and the next one added
// is the one that will forget.
// ─────────────────────────────────────────────────────────────────────────────
describe("Rider A · a broken read is a rejection, never an empty result", () => {
  const boom = () => new Error('relation "domigo_v2.practice_attempts" does not exist');

  it("listStudentProgress rejects", async () => {
    const { db } = seqDb([boom()]);
    await expect(listStudentProgress(db, CLASS)).rejects.toThrow(/does not exist/);
  });

  it("listStudentPathSummary rejects", async () => {
    const { db } = seqDb([boom()]);
    await expect(listStudentPathSummary(db, CLASS)).rejects.toThrow(/does not exist/);
  });

  it("listClassUnitProgress rejects", async () => {
    const { db } = seqDb([boom()]);
    await expect(listClassUnitProgress(db, CLASS)).rejects.toThrow(/does not exist/);
  });

  it("listClassTraps rejects", async () => {
    const { db } = seqDb([boom()]);
    await expect(listClassTraps(db, CLASS)).rejects.toThrow(/does not exist/);
  });

  it("listStudentMeta rejects on the progress half AND on the due-count half", async () => {
    await expect(listStudentMeta(seqDb([boom()]).db, ["u1"])).rejects.toThrow(/does not exist/);
    // The second query is the one a partial repair would leave unguarded.
    await expect(listStudentMeta(seqDb([[], boom()]).db, ["u1"])).rejects.toThrow(/does not exist/);
  });

  it("still answers an EMPTY roster without a query — an empty class is not a failure", async () => {
    const { db, calls } = seqDb([]);
    expect(await listStudentMeta(db, [])).toEqual(new Map());
    expect(calls()).toBe(0); // and the page's two states stay distinguishable
  });
});
