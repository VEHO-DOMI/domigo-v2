import { describe, expect, it } from "vitest";
import { listStudentsForClass } from "./assignment-session-service.ts";
import type { Db } from "./index.ts";

// ─────────────────────────────────────────────────────────────────────────────
// K1a · listStudentsForClass — the read behind the assignment RESULT roster.
//
// It used to touch the v1 register alone, so every class created since P1 showed
// "no students" after its own homework. The defect was invisible to every test
// because there were none, and invisible on screen because an empty roster looks
// exactly like a class where nobody has sat the task yet.
//
// Three properties carry the fix: v2 is read (the bug), v1 still yields exactly
// what it yielded (no regression for the legacy register), and a person present
// in BOTH registers is one row, not two.
// ─────────────────────────────────────────────────────────────────────────────

/** Sequential chain-mock, house style (cf. class-service.test.ts:seqDb). */
function seqDb(results: (unknown[] | Error)[]) {
  let n = 0;
  const conditions: unknown[][] = [];
  const selections: unknown[] = [];
  const db = {
    select: (selection?: unknown) => {
      const r = results[n++];
      const p = r instanceof Error ? Promise.reject(r) : Promise.resolve(r ?? []);
      p.catch(() => {});
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
  return { db: db as unknown as Db, conditions, selections, calls: () => n };
}

/** Atoms of one drizzle node — stop at a column (see class-progress.test.ts). */
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

function projectionAtoms(selection: unknown): string[] {
  if (!selection || typeof selection !== "object") return [];
  return [...new Set(Object.values(selection as Record<string, unknown>).flatMap((v) => atomsOf(v)))];
}

const CLASS = "class-2er";

describe("listStudentsForClass", () => {
  it("finds the students of a NEW (v2) class — the defect this fixes", async () => {
    // v2 has two, v1 has none: before the fix this returned [] and the whole
    // result roster of every v2 class rendered "Keine Schüler:innen gefunden".
    const { db, conditions } = seqDb([
      [{ id: "s1", name: "Test2" }, { id: "s2", name: "Test2b" }],
      [],
    ]);
    expect(await listStudentsForClass(db, CLASS)).toEqual([
      { id: "s1", name: "Test2" },
      { id: "s2", name: "Test2b" },
    ]);
    // A sequential mock cannot see WHICH table a select hit, so the rows alone
    // would look identical if the v2 half were deleted and v1 consumed the first
    // result instead. The first query's own filter is what tells them apart:
    // only the v2 read knows `claimed_at` (v1 has no such column).
    expect(atomsOf(conditions[0])).toContain("col:claimed_at");
  });

  it("returns a LEGACY (v1) class exactly as before — same rows, same order", async () => {
    const { db } = seqDb([
      [], // no v2 rows: a legacy class has none by construction
      [{ id: "v1-a", name: "Anouk" }, { id: "v1-b", name: "Bela" }, { id: "v1-c", name: "Cem" }],
    ]);
    expect(await listStudentsForClass(db, CLASS)).toEqual([
      { id: "v1-a", name: "Anouk" },
      { id: "v1-b", name: "Bela" },
      { id: "v1-c", name: "Cem" },
    ]);
  });

  it("merges a person present in BOTH registers into ONE row, v2 winning", async () => {
    // v2 reuses the v1 uuid wherever an identity carried over, so a double read
    // without a merge would print the same child twice.
    const { db } = seqDb([
      [{ id: "shared", name: "Neuer Spitzname" }],
      [{ id: "shared", name: "Alter Name" }, { id: "only-v1", name: "Nur Alt" }],
    ]);
    expect(await listStudentsForClass(db, CLASS)).toEqual([
      { id: "shared", name: "Neuer Spitzname" },
      { id: "only-v1", name: "Nur Alt" },
    ]);
  });

  it("reads BOTH registers, in that order, always", async () => {
    const { db, calls } = seqDb([[], []]);
    await listStudentsForClass(db, CLASS);
    expect(calls()).toBe(2); // a v2 hit must not short-circuit the legacy half
  });

  it("scopes the v2 half to the class, to students, and to CLAIMED rows only", async () => {
    const { db, conditions } = seqDb([[], []]);
    await listStudentsForClass(db, CLASS);
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:class_id");
    expect(where).toContain(CLASS);
    expect(where).toContain("col:role");
    expect(where).toContain("student");
    // A provisional row is a name on an import list with nobody behind it yet —
    // it can hold no session, so listing it would invent a pupil who scored 0.
    expect(where).toContain("col:claimed_at");
    expect(where.join(" ")).toContain("is not null");
  });

  it("never selects the PIN hash from either register", async () => {
    const { db, selections } = seqDb([[], []]);
    await listStudentsForClass(db, CLASS);
    for (const sel of selections) {
      expect(projectionAtoms(sel)).not.toContain("col:pin_hash");
    }
  });
});
