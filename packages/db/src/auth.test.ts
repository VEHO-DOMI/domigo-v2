/**
 * Dual-read resilience (the 2026-07-12 incident, encoded as a regression suite):
 * migration 0006 was merged but never applied to prod, so every v2-first
 * identity query threw "relation domigo_v2.users does not exist" — and because
 * the throws happened BEFORE the v1 fallback, every sign-in on production
 * (student and teacher) died with "invalid credentials". The rule under test:
 * a missing/broken v2 table must NEVER take down v1 logins that predate it,
 * while a v1 failure is a real outage and must still throw.
 */
import { describe, expect, it, vi } from "vitest";
import { allocateClassCode, getClassGrade, lookupStudentForAuth, lookupTeacherForAuth } from "./auth.ts";
import type { Db } from "./index.ts";

/**
 * Sequential chain-mock (house style, cf. roster-service.test.ts): each
 * db.select() call resolves the next entry of `results` in order — an Error
 * entry REJECTS at the end of the chain (a missing table throws at query time,
 * not at builder time). Dual-read functions issue v2 queries first, so entry 0
 * is always the v2 side.
 */
function seqDb(results: (unknown[] | Error)[]): Db {
  let n = 0;
  const step = () => {
    const r = results[n++];
    return r instanceof Error ? Promise.reject(r) : Promise.resolve(r ?? []);
  };
  const chain = () => {
    const p = step();
    // Support every chain shape used in auth.ts: .from().where().limit() and .from() bare.
    const tail = { where: () => ({ limit: () => p }), limit: () => p, then: p.then.bind(p), catch: p.catch.bind(p) };
    return { from: () => tail };
  };
  return { select: chain } as unknown as Db;
}

const missing = () => new Error('relation "domigo_v2.users" does not exist');
const v1Student = { id: "u1", displayName: "anna", classId: "c1", pinHash: "$2b$12$x" };
const v1Teacher = { id: "t1", displayName: "VEHO", classId: null, pinHash: "$2b$12$x" };

describe("dual-read degrades to v1 when v2 tables are unreachable", () => {
  it("student login: v2 class lookup throws → v1 student still found", async () => {
    const db = seqDb([missing(), [{ id: "c1", archivedAt: null }], [v1Student]]);
    const row = await lookupStudentForAuth(db, "ABC123", "anna");
    expect(row?.id).toBe("u1");
  });

  it("teacher login: v2 teacher lookup throws → v1 teacher still found (the VEHO lockout)", async () => {
    const db = seqDb([missing(), [v1Teacher]]);
    const row = await lookupTeacherForAuth(db, "veho");
    expect(row?.id).toBe("t1");
  });

  it("getClassGrade: v2 throws → v1 grade still returned", async () => {
    const db = seqDb([missing(), [{ grade: 2 }]]);
    expect(await getClassGrade(db, "c1")).toBe(2);
  });

  it("allocateClassCode: v2 code read throws → still mints against v1 codes", async () => {
    const db = seqDb([[{ code: "AAAAAA" }], missing()]);
    const code = await allocateClassCode(db);
    expect(code).toMatch(/^[A-Z0-9]{6}$/);
    expect(code).not.toBe("AAAAAA");
  });

  it("v1 failure is NOT degraded — a real outage must surface", async () => {
    const db = seqDb([missing(), new Error("v1 mirror down")]);
    await expect(lookupTeacherForAuth(db, "veho")).rejects.toThrow("v1 mirror down");
  });

  it("healthy v2 path unchanged: v2 teacher wins without touching v1", async () => {
    const v2Teacher = { id: "t2", displayName: "VEHO", classId: null, pinHash: "$2b$12$y" };
    // Only ONE result seeded: if the v1 query ran anyway, the mock would return
    // [] for it — but the early return means it must never be issued at all.
    const db = seqDb([[v2Teacher]]);
    const row = await lookupTeacherForAuth(db, "veho");
    expect(row?.id).toBe("t2");
  });

  it("degradation logs the failure (visible in server logs, never silent)", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const db = seqDb([missing(), [v1Teacher]]);
    await lookupTeacherForAuth(db, "veho");
    expect(spy).toHaveBeenCalledWith(expect.stringContaining("falling back to the v1 mirror"), expect.stringContaining("domigo_v2"));
    spy.mockRestore();
  });
});
