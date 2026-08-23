import { describe, expect, it } from "vitest";
import {
  claimClassAsTeacher,
  inviteTokenMatches,
  listClaimableClasses,
  teacherNameTaken,
} from "./teacher-claim.ts";
import { v2Classes, v2IdentityUsers, v2RosterEvents } from "./schema.ts";
import type { Db } from "./index.ts";

/**
 * A scripted mock of the drizzle chain. Every builder method returns the same
 * thenable, so ONE queue entry is consumed per awaited statement, in call order —
 * which is exactly what these services are about (the order of the re-checks, the
 * journal before the flip). `rec` captures what was written, so a test can assert
 * the journal row itself rather than "no error was thrown".
 *
 * SCOPE OF WHAT THIS CAN PROVE: everything decided in JS — the empty-roster rule,
 * the owner membership test, fail-closed on an empty allowlist, the result mapping.
 * The parts that live in the WHERE clause (owner filter, archived filter) are proven
 * against the real database, not here; a mock would only be repeating the assertion.
 */
interface Op {
  rows?: unknown[];
  error?: unknown;
}
interface Rec {
  writes: { table: unknown; values: unknown }[];
  updates: { table: unknown; values: unknown }[];
}

function mockDb(ops: Op[], rec: Rec = { writes: [], updates: [] }): Db {
  const queue = [...ops];
  const chain = (ctx: { table?: unknown } = {}) => {
    const o: Record<string, unknown> = {};
    for (const m of ["from", "where", "limit", "orderBy", "groupBy", "returning"]) o[m] = () => o;
    o.values = (v: unknown) => {
      rec.writes.push({ table: ctx.table, values: v });
      return o;
    };
    o.set = (v: unknown) => {
      rec.updates.push({ table: ctx.table, values: v });
      return o;
    };
    o.then = (res: (v: unknown) => unknown, rej: (e: unknown) => unknown) => {
      const op = queue.shift();
      if (!op) return Promise.reject(new Error("mock: ein DB-Aufruf mehr als das Skript vorsieht")).then(res, rej);
      if (op.error) return Promise.reject(op.error).then(res, rej);
      return Promise.resolve(op.rows ?? []).then(res, rej);
    };
    return o;
  };
  return {
    select: () => chain(),
    insert: (table: unknown) => chain({ table }),
    update: (table: unknown) => chain({ table }),
    delete: (table: unknown) => chain({ table }),
  } as unknown as Db;
}

const GM = "891dfdd3-e6e5-4e94-850a-13c7afe9dea3";
const NEU = "11111111-2222-3333-4444-555555555555";
const FREMD = "048c92d3-621e-4550-a8d6-880a2487c98f";
const CLS = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

/** The call script of a SUCCESSFUL claim, so each test overrides only its own step. */
function happyOps(over: Partial<Record<"cls" | "count" | "v2name" | "v1name" | "insert" | "flip", Op>> = {}): Op[] {
  return [
    over.cls ?? { rows: [{ teacherId: GM }] }, // 1 · the class + its current owner
    over.count ?? { rows: [{ n: 0 }] }, //          2 · its roster size
    over.v2name ?? { rows: [] }, //                 3 · name free in v2?
    over.v1name ?? { rows: [] }, //                 4 · name free in the v1 mirror?
    over.insert ?? { rows: [{ id: NEU }] }, //      5 · her account
    { rows: [] }, //                                6 · the journal row
    over.flip ?? { rows: [{ id: CLS }] }, //        7 · the guarded handover
  ];
}
const claimInput = { classId: CLS, ownerIds: [GM], displayName: "TEST-Direktorin", pinHash: "hash" };

describe("inviteTokenMatches — the shared link is token-bound and fails closed", () => {
  it("matches only the exact configured value", () => {
    expect(inviteTokenMatches("DEVLEHRER2026", "DEVLEHRER2026")).toBe(true);
    expect(inviteTokenMatches("devlehrer2026", "DEVLEHRER2026")).toBe(false);
    expect(inviteTokenMatches("DEVLEHRER2026x", "DEVLEHRER2026")).toBe(false);
  });
  it("refuses a prefix — a startsWith check would open the door on one character", () => {
    expect(inviteTokenMatches("D", "DEVLEHRER2026")).toBe(false);
    expect(inviteTokenMatches("", "DEVLEHRER2026")).toBe(false);
  });
  it("is closed whenever the variable is unset, empty or blank", () => {
    expect(inviteTokenMatches("DEVLEHRER2026", "")).toBe(false);
    expect(inviteTokenMatches("DEVLEHRER2026", undefined)).toBe(false);
    expect(inviteTokenMatches("DEVLEHRER2026", null)).toBe(false);
    expect(inviteTokenMatches("   ", "   ")).toBe(false);
    expect(inviteTokenMatches(null, null)).toBe(false);
  });
});

describe("listClaimableClasses — only pre-created, still EMPTY classes are on offer", () => {
  it("keeps the empty ones and drops every class that already has a roster", async () => {
    const db = mockDb([
      {
        rows: [
          { id: "leer-1", name: "TEST-NEU-3B", grade: 3 },
          { id: "voll-1", name: "TEST-3A", grade: 3 },
          { id: "voll-2", name: "TEST-4A", grade: 4 },
        ],
      },
      { rows: [{ classId: "voll-1", n: 3 }, { classId: "voll-2", n: 3 }] },
    ]);
    const out = await listClaimableClasses(db, [GM]);
    expect(out.map((c) => c.name)).toEqual(["TEST-NEU-3B"]);
  });

  it("returns nothing — and touches the database not at all — when nobody is a grandmaster", async () => {
    // Fail closed: an unset allowlist must never publish the class stock.
    expect(await listClaimableClasses(mockDb([]), [])).toEqual([]);
    expect(await listClaimableClasses(mockDb([]), ["", "   "])).toEqual([]);
  });

  it("returns nothing when the operator owns no active class at all", async () => {
    expect(await listClaimableClasses(mockDb([{ rows: [] }]), [GM])).toEqual([]);
  });

  it("exposes only name and grade — never the invite code", async () => {
    const db = mockDb([{ rows: [{ id: "leer-1", name: "TEST-NEU-3B", grade: 3 }] }, { rows: [] }]);
    expect(await listClaimableClasses(db, [GM])).toEqual([{ id: "leer-1", name: "TEST-NEU-3B", grade: 3 }]);
  });
});

describe("teacherNameTaken — an auth check across BOTH registers, case-insensitively", () => {
  it("is taken when a v2-native teacher holds the handle", async () => {
    expect(await teacherNameTaken(mockDb([{ rows: [{ id: GM }] }]), "test-lehrkraft")).toBe(true);
  });
  it("is taken when only the v1 mirror holds it — that account can still sign in", async () => {
    expect(await teacherNameTaken(mockDb([{ rows: [] }, { rows: [{ displayName: "VEHO" }] }]), "veho")).toBe(true);
  });
  it("is free when neither register knows the name", async () => {
    expect(await teacherNameTaken(mockDb([{ rows: [] }, { rows: [] }]), "TEST-Direktorin")).toBe(false);
  });
  it("treats an empty handle as unavailable, without a query", async () => {
    expect(await teacherNameTaken(mockDb([]), "   ")).toBe(true);
  });
  it("throws rather than reporting 'free' when the lookup itself fails", async () => {
    // A silent 'free' here would let a duplicate through and shadow a real account.
    await expect(teacherNameTaken(mockDb([{ error: new Error("connection reset") }]), "X")).rejects.toBeTruthy();
  });
});

describe("claimClassAsTeacher — the handover", () => {
  it("hands the class over and journals the act under HER id", async () => {
    const rec: Rec = { writes: [], updates: [] };
    expect(await claimClassAsTeacher(mockDb(happyOps(), rec), claimInput)).toBe("ok");

    const journal = rec.writes.find((w) => w.table === v2RosterEvents);
    expect(journal?.values).toEqual({
      classId: CLS,
      kind: "teacher_claim",
      actorId: NEU, // the new teacher, not the operator whose stock it was
      payload: { classId: CLS, fromTeacherId: GM, toTeacherId: NEU, displayName: "TEST-Direktorin" },
    });
    // The journal must be written BEFORE the class flips (journal-then-flip).
    expect(rec.writes.map((w) => w.table)).toEqual([v2IdentityUsers, v2RosterEvents]);
    expect(rec.updates).toEqual([{ table: v2Classes, values: { teacherId: NEU } }]);
  });

  it("never lets the PIN hash reach the journal", async () => {
    const rec: Rec = { writes: [], updates: [] };
    await claimClassAsTeacher(mockDb(happyOps(), rec), claimInput);
    const journal = rec.writes.find((w) => w.table === v2RosterEvents);
    expect(JSON.stringify(journal?.values)).not.toContain("hash");
  });

  it("is 'gone' when a colleague won the class between the list and the flip", async () => {
    // The conditional UPDATE guards on the owner we read one step earlier: zero
    // returned rows IS the race, and the only way to see it without transactions.
    const rec: Rec = { writes: [], updates: [] };
    expect(await claimClassAsTeacher(mockDb(happyOps({ flip: { rows: [] } }), rec), claimInput)).toBe("gone");
    expect(rec.writes.some((w) => w.table === v2RosterEvents)).toBe(true); // the orphan journal row, by design
  });

  it("is 'gone' when the class is not owned by the operator any more", async () => {
    const db = mockDb([{ rows: [{ teacherId: FREMD }] }]);
    expect(await claimClassAsTeacher(db, claimInput)).toBe("gone");
  });

  it("is 'gone' when the class has meanwhile acquired students", async () => {
    const db = mockDb([{ rows: [{ teacherId: GM }] }, { rows: [{ n: 2 }] }]);
    expect(await claimClassAsTeacher(db, claimInput)).toBe("gone");
  });

  it("is 'gone' when the class row is absent or archived", async () => {
    expect(await claimClassAsTeacher(mockDb([{ rows: [] }]), claimInput)).toBe("gone");
  });

  it("is 'gone' — without any query — when the allowlist is empty or the name is blank", async () => {
    expect(await claimClassAsTeacher(mockDb([]), { ...claimInput, ownerIds: [] })).toBe("gone");
    expect(await claimClassAsTeacher(mockDb([]), { ...claimInput, displayName: "  " })).toBe("gone");
  });

  it("is 'taken' when the handle is already a teacher name, and creates no account", async () => {
    const rec: Rec = { writes: [], updates: [] };
    const db = mockDb(happyOps({ v2name: { rows: [{ id: GM }] } }), rec);
    expect(await claimClassAsTeacher(db, { ...claimInput, displayName: "test-lehrkraft" })).toBe("taken");
    expect(rec.writes).toEqual([]);
    expect(rec.updates).toEqual([]);
  });

  it("is 'taken' when the unique index catches the name race the app check cannot", async () => {
    const db = mockDb(happyOps({ insert: { error: { code: "23505" } } }));
    expect(await claimClassAsTeacher(db, claimInput)).toBe("taken");
  });

  it("rethrows any other database failure instead of swallowing it", async () => {
    const db = mockDb(happyOps({ insert: { error: { code: "08006" } } }));
    await expect(claimClassAsTeacher(db, claimInput)).rejects.toBeTruthy();
  });

  it("matches the owner id case-insensitively — a uuid pasted in upper case is the same id", async () => {
    const db = mockDb(happyOps());
    expect(await claimClassAsTeacher(db, { ...claimInput, ownerIds: [GM.toUpperCase()] })).toBe("ok");
  });

  it("trims the chosen name before it becomes the login handle", async () => {
    const rec: Rec = { writes: [], updates: [] };
    await claimClassAsTeacher(mockDb(happyOps(), rec), { ...claimInput, displayName: "  TEST-Direktorin  " });
    expect((rec.writes[0]?.values as { displayName: string }).displayName).toBe("TEST-Direktorin");
  });
});
