/**
 * K2a · The sign-in brake.
 *
 * Two things are tested that a "does it count?" test would miss: WHERE the boundary
 * sits (the ninth failure is the refused one, not the eighth), and that every failure
 * mode of the brake itself ends in ALLOW. A brake that jams shut locks a class out of
 * its own lesson, so fail-open is not a fallback here — it is the specification.
 */
import { describe, expect, it, vi } from "vitest";
import type { Db } from "./index.ts";
import {
  RESET_REQUEST_POLICY,
  SIGNIN_POLICY,
  bumpAndCheck,
  clearThrottle,
  resetThrottleKey,
  studentThrottleKey,
  teacherThrottleKey,
} from "./auth-throttle.ts";

/** Number-aware, depth-16 walker — see reset-tokens.test.ts for why both matter. */
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

function clauseAtoms(clause: unknown): string[] {
  if (!clause || typeof clause !== "object") return [];
  return [...new Set(Object.values(clause as Record<string, unknown>).flatMap((v) => atomsOf(v)))];
}

function throttleDb(opts: { rows?: unknown[]; fail?: Error } = {}) {
  const inserted: unknown[] = [];
  const sets: unknown[] = [];
  const deleteConds: unknown[] = [];
  let statements = 0;
  const db = {
    insert: () => ({
      values: (v: unknown) => {
        inserted.push(v);
        return {
          onConflictDoUpdate: (cfg: { set: unknown }) => {
            sets.push(cfg.set);
            return {
              returning: () => {
                statements += 1;
                return opts.fail ? Promise.reject(opts.fail) : Promise.resolve(opts.rows ?? []);
              },
            };
          },
        };
      },
    }),
    delete: () => ({
      where: (c: unknown) => {
        deleteConds.push(c);
        return opts.fail ? Promise.reject(opts.fail) : Promise.resolve(undefined);
      },
    }),
  };
  return { db: db as unknown as Db, inserted, sets, deleteConds, statements: () => statements };
}

describe("the keys", () => {
  it("are lower-cased and trimmed — a brake a capitalisation walks around is not a brake", () => {
    expect(teacherThrottleKey("  TEST-Kollegin ")).toBe("teacher:test-kollegin");
    expect(studentThrottleKey(" TST2ER ", " Pelle ")).toBe("student:tst2er:pelle");
    expect(resetThrottleKey("TEST-Lehrkraft")).toBe("reset:test-lehrkraft");
  });

  it("name their surface, so a child's counter and a teacher's never collide", () => {
    expect(teacherThrottleKey("anna")).not.toBe(resetThrottleKey("anna"));
    expect(teacherThrottleKey("anna")).not.toBe(studentThrottleKey("abc123", "anna"));
  });
});

describe("the policies", () => {
  it("are Koki's ruling of 2026-08-23: eight failures, ten minutes", () => {
    expect(SIGNIN_POLICY).toEqual({ limit: 8, windowMinutes: 10 });
  });

  it("hold recovery mails to three an hour — a different risk, a different number", () => {
    expect(RESET_REQUEST_POLICY).toEqual({ limit: 3, windowMinutes: 60 });
  });
});

describe("bumpAndCheck — where the boundary sits", () => {
  it("allows the eighth failure", async () => {
    const { db } = throttleDb({ rows: [{ count: 8 }] });
    await expect(bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY)).resolves.toBe(true);
  });

  it("REFUSES the ninth", async () => {
    const { db } = throttleDb({ rows: [{ count: 9 }] });
    await expect(bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY)).resolves.toBe(false);
  });

  it("refuses a fourth recovery mail inside the hour", async () => {
    const { db } = throttleDb({ rows: [{ count: 4 }] });
    await expect(bumpAndCheck(db, "reset:anna", RESET_REQUEST_POLICY)).resolves.toBe(false);
  });
});

describe("bumpAndCheck — one statement turns the window AND the counter", () => {
  it("issues exactly one statement per attempt", async () => {
    const { db, statements } = throttleDb({ rows: [{ count: 1 }] });
    await bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY);
    expect(statements()).toBe(1); // read-then-write would be the race this design avoids
  });

  it("starts a fresh row at one, with the database's own clock", async () => {
    const { db, inserted } = throttleDb({ rows: [{ count: 1 }] });
    await bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY);
    const row = inserted[0] as Record<string, unknown>;
    expect(row.key).toBe("teacher:anna");
    expect(row.count).toBe(1);
    expect(atomsOf(row.windowStart).join(" ")).toContain("now()");
  });

  it("names the window length in the statement, as a number the walker can see", async () => {
    const { db, sets } = throttleDb({ rows: [{ count: 1 }] });
    await bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY);
    const text = clauseAtoms(sets[0]).join(" ");
    expect(text).toContain("make_interval");
    expect(text).toContain("10"); // windowMinutes — the K1b number-blindness trap
    expect(text).toContain("col:window_start");
    expect(text).toContain("col:count");
    expect(text).toContain(" + 1"); // otherwise it would reset instead of counting
  });

  it("uses the policy it is GIVEN, not a hidden default", async () => {
    const { db, sets } = throttleDb({ rows: [{ count: 1 }] });
    await bumpAndCheck(db, "reset:anna", RESET_REQUEST_POLICY);
    expect(clauseAtoms(sets[0]).join(" ")).toContain("60");
  });
});

describe("fail-open is the specification, not a fallback", () => {
  it("allows the attempt when the table is not there yet", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = throttleDb({ fail: new Error('relation "domigo_v2.auth_throttle" does not exist') });
    await expect(bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY)).resolves.toBe(true);
    expect(shout).toHaveBeenCalled();
    shout.mockRestore();
  });

  it("allows the attempt on ANY other database failure too", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = throttleDb({ fail: new Error("connection terminated unexpectedly") });
    await expect(bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY)).resolves.toBe(true);
    shout.mockRestore();
  });

  it("does not invent a refusal when nothing comes back", async () => {
    const { db } = throttleDb({ rows: [] });
    await expect(bumpAndCheck(db, "teacher:anna", SIGNIN_POLICY)).resolves.toBe(true);
  });
});

describe("clearThrottle", () => {
  it("wipes exactly the key it was given", async () => {
    const { db, deleteConds } = throttleDb();
    await clearThrottle(db, "teacher:anna");
    const where = atomsOf(deleteConds[0]);
    expect(where).toContain("col:key");
    expect(where).toContain("teacher:anna");
  });

  it("never surfaces its own failure — success has already happened by then", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = throttleDb({ fail: new Error("connection terminated unexpectedly") });
    await expect(clearThrottle(db, "teacher:anna")).resolves.toBeUndefined();
    expect(shout).toHaveBeenCalled();
    shout.mockRestore();
  });
});
