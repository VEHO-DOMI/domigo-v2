import { describe, expect, it } from "vitest";
import { grantXp, markUnitDone, HAND_MARK_STARS, PROGRESS_ADJUST_KIND, type AdjustableNode } from "./progress-adjust.ts";
import { studyPathProgress, userProgress, v2RosterEvents } from "./schema.ts";
import type { Db } from "./index.ts";

// ─────────────────────────────────────────────────────────────────────────────
// K1b · the grandmaster's hand-adjustment.
//
// What is worth proving here is not that an INSERT inserts, but the four
// properties that would let this module do quiet damage while every gate stayed
// green: that XP can only ever GROW, that the streak (the one number a child
// looks at) is never invented, that the history is written BEFORE the change and
// names the hand that made it, and that the history carries no person's name.
// Three of those are negative claims, so they are asserted negatively — against
// the write's own atoms, not against a returned value.
// ─────────────────────────────────────────────────────────────────────────────

interface Write {
  table: unknown;
  values?: unknown;
  set?: unknown;
}

/**
 * Recording mock of the drizzle write chain. Every insert (and its
 * onConflictDoUpdate `set`) is appended to ONE ordered list, because the order is
 * half of what journal-then-apply means: a test that only inspected the values
 * could not tell a journal written first from one written after the fact.
 */
function recDb() {
  const writes: Write[] = [];
  const db = {
    insert: (table: unknown) => {
      const w: Write = { table };
      const node: Record<string, unknown> = {
        values: (v: unknown) => { w.values = v; writes.push(w); return node; },
        onConflictDoUpdate: (c: { set?: unknown }) => { w.set = c?.set; return node; },
        returning: () => Promise.resolve([{ stars: HAND_MARK_STARS }]),
        then: (a: never, b: never) => Promise.resolve(undefined).then(a, b),
        catch: (a: never) => Promise.resolve(undefined).catch(a),
      };
      return node;
    },
  };
  return { db: db as unknown as Db, writes };
}

/**
 * The atoms of one drizzle node — its own SQL fragments, bound values and column
 * references — walked with the house rule: **stop at a column** (a Column
 * back-references its TABLE, and a table lists every column, so a naive deep walk
 * would make every negative assertion below a vacuous statement about the table).
 * The depth cap is a CYCLE guard, not a filter: 16, the K1a size, because the SET
 * clause nests an `sql` fragment inside the clause object and the inherited cap of
 * 8 silently truncated exactly that innermost text.
 *
 * ⚠ NUMBERS are walked too, and that is not cosmetic: drizzle embeds a plain number
 * interpolated into an `sql` template as a RAW number chunk, not as a Param object.
 * The inherited walker returns early on any non-object, so `xp + 50` yielded the
 * atoms "col:xp" and " + " and NOTHING for the 50 — "the grant is fifty points"
 * would have been a vacuous assertion. Same family as the depth cap: a walker that
 * cannot see an atom reports its absence as proof.
 */
function atomsOf(node: unknown): string[] {
  const out: string[] = [];
  const walk = (o: unknown, depth = 0): void => {
    if (o == null || depth > 16) return;
    if (typeof o === "string") { out.push(o); return; }
    if (typeof o === "number") { out.push(String(o)); return; }
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

const GM = "gm-koki";
const STUDENT = "kind-1";
const CLASS = "klasse-2er";

const NODES: AdjustableNode[] = [
  { id: "vocab-intro", kind: "vocab-intro", graded: false },
  { id: "vocab-practice-1", kind: "vocab-practice", graded: true },
  { id: "checkpoint", kind: "checkpoint", graded: true },
];

describe("grantXp — points can only ever grow", () => {
  it("refuses a negative grant (there is no subtract path, and the door says so)", async () => {
    const { db, writes } = recDb();
    await expect(grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: -10, grammarXp: 0, actorId: GM })).rejects.toThrow(/negative/i);
    expect(writes).toHaveLength(0); // and nothing was journalled for a call that never happened
  });

  it("refuses a grant of nothing at all (no history about no change)", async () => {
    const { db, writes } = recDb();
    await expect(grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 0, grammarXp: 0, actorId: GM })).rejects.toThrow(/at least one/i);
    expect(writes).toHaveLength(0);
  });

  it("refuses a fractional grant (XP is whole points)", async () => {
    const { db } = recDb();
    await expect(grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 2.5, grammarXp: 0, actorId: GM })).rejects.toThrow(/whole number/i);
  });

  it("writes the journal FIRST and the pools second (journal-then-apply)", async () => {
    const { db, writes } = recDb();
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 0, actorId: GM });
    expect(writes).toHaveLength(2);
    expect(writes[0]!.table).toBe(v2RosterEvents);
    expect(writes[1]!.table).toBe(userProgress);
  });

  it("names the hand and the class in the journal — and no person's name", async () => {
    const { db, writes } = recDb();
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 7, actorId: GM });
    const ev = writes[0]!.values as { classId: string; kind: string; actorId: string; payload: Record<string, unknown> };
    expect(ev.kind).toBe(PROGRESS_ADJUST_KIND);
    expect(ev.actorId).toBe(GM); // the grandmaster, not the class owner
    expect(ev.classId).toBe(CLASS); // the column is NOT NULL — the child's class
    expect(ev.payload).toEqual({ op: "xp", studentId: STUDENT, vocabXp: 50, grammarXp: 7 });
    // The negative half: ids and numbers only, never a name.
    for (const k of ["displayName", "givenName", "name", "nickname"]) expect(ev.payload).not.toHaveProperty(k);
  });

  it("ADDS to both pools and never assigns (the atoms of the conflict clause say +)", async () => {
    const { db, writes } = recDb();
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 7, actorId: GM });
    const set = writes[1]!.set as Record<string, unknown>;
    const xp = atomsOf(set.xp).join(" ");
    const gxp = atomsOf(set.grammarXp).join(" ");
    expect(xp).toContain("col:xp");
    expect(xp).toContain(" + ");
    expect(xp).toContain("50");
    expect(gxp).toContain("col:grammar_xp");
    expect(gxp).toContain(" + ");
    expect(gxp).toContain("7");
    // The property this whole file exists for: no minus anywhere in the write.
    expect(xp).not.toContain(" - ");
    expect(gxp).not.toContain(" - ");
  });

  it("never invents a streak day — a grant is not a child showing up", async () => {
    const { db, writes } = recDb();
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 0, actorId: GM });
    const set = writes[1]!.set as Record<string, unknown>;
    const values = writes[1]!.values as Record<string, unknown>;
    for (const key of ["streak", "lastSessionDate"]) {
      expect(set).not.toHaveProperty(key);
      expect(values).not.toHaveProperty(key);
    }
  });

  it("seeds a child that has no progress row yet with exactly the granted points", async () => {
    const { db, writes } = recDb();
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 7, actorId: GM });
    const values = writes[1]!.values as Record<string, unknown>;
    expect(values.userId).toBe(STUDENT);
    expect(values.xp).toBe(50);
    expect(values.grammarXp).toBe(7);
  });
});

describe("markUnitDone — a hand may assert existence, never performance", () => {
  it("refuses a malformed unit slug", async () => {
    const { db, writes } = recDb();
    await expect(markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "u03", nodes: NODES, actorId: GM })).rejects.toThrow(/g2-u03/);
    expect(writes).toHaveLength(0);
  });

  it("refuses an empty node list (an intent about nothing)", async () => {
    const { db, writes } = recDb();
    await expect(markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: [], actorId: GM })).rejects.toThrow(/no nodes/i);
    expect(writes).toHaveLength(0);
  });

  it("journals FIRST, then writes one row per node", async () => {
    const { db, writes } = recDb();
    const res = await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: NODES, actorId: GM });
    expect(res.nodesMarked).toBe(3);
    expect(writes).toHaveLength(1 + NODES.length);
    expect(writes[0]!.table).toBe(v2RosterEvents);
    for (const w of writes.slice(1)) expect(w.table).toBe(studyPathProgress);
  });

  it("gives a GRADED node one star and an intro card none — the stars a real child gets", async () => {
    const { db, writes } = recDb();
    await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: NODES, actorId: GM });
    const byNode = new Map(writes.slice(1).map((w) => {
      const v = w.values as { nodeId: string; stars: number };
      return [v.nodeId, v.stars];
    }));
    expect(byNode.get("vocab-practice-1")).toBe(1);
    expect(byNode.get("checkpoint")).toBe(1);
    expect(byNode.get("vocab-intro")).toBe(0); // ungraded: a star here would be fabricated
    // and never the full three — that would claim measured accuracy
    for (const stars of byNode.values()) expect(stars).toBeLessThan(2);
  });

  it("derives the school year from the slug and carries the class onto every row", async () => {
    const { db, writes } = recDb();
    await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g4-u11", nodes: NODES, actorId: GM });
    for (const w of writes.slice(1)) {
      const v = w.values as { grade: number; classId: string; userId: string; unitSlug: string };
      expect(v.grade).toBe(4);
      expect(v.classId).toBe(CLASS);
      expect(v.userId).toBe(STUDENT);
      expect(v.unitSlug).toBe("g4-u11");
    }
  });

  it("is idempotent by construction: every node row keeps the BEST stars (GREATEST)", async () => {
    const { db, writes } = recDb();
    await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: NODES, actorId: GM });
    for (const w of writes.slice(1)) {
      const stars = atomsOf((w.set as Record<string, unknown>).stars).join(" ");
      expect(stars).toContain("GREATEST(");
      expect(stars).toContain("col:stars");
    }
  });

  it("journals the unit and its nodes — ids and numbers, no names", async () => {
    const { db, writes } = recDb();
    await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: NODES, actorId: GM });
    const ev = writes[0]!.values as { kind: string; actorId: string; classId: string; payload: Record<string, unknown> };
    expect(ev.kind).toBe(PROGRESS_ADJUST_KIND);
    expect(ev.actorId).toBe(GM);
    expect(ev.classId).toBe(CLASS);
    expect(ev.payload).toEqual({
      op: "unit",
      studentId: STUDENT,
      unitSlug: "g2-u03",
      nodeIds: ["vocab-intro", "vocab-practice-1", "checkpoint"],
      stars: HAND_MARK_STARS,
    });
  });

  it("never touches the review queue — hand-set Leitner boxes would corrupt the spacing", async () => {
    const { db, writes } = recDb();
    await markUnitDone(db, { studentId: STUDENT, classId: CLASS, unitSlug: "g2-u03", nodes: NODES, actorId: GM });
    await grantXp(db, { studentId: STUDENT, classId: CLASS, vocabXp: 50, grammarXp: 0, actorId: GM });
    const tables = new Set(writes.map((w) => w.table));
    expect(tables).toEqual(new Set([v2RosterEvents, studyPathProgress, userProgress]));
  });
});
