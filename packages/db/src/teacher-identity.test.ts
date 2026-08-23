/**
 * K2a · The teacher identity primitive — the test file P3 never wrote.
 *
 * This one function stands under every way a teacher's PIN can change: her own, the
 * operator's rescue, and the recovery link. Two of its properties are load-bearing
 * and both are invisible from the outside:
 *
 *   1. IT NEVER RENAMES HER. `displayName` is her sign-in handle. It is written on
 *      first promotion and must never appear in the update clause afterwards — a
 *      rename hidden inside a PIN change locks her out of her own account (K1b).
 *   2. IT NEVER MENTIONS A COLUMN IT WAS NOT ASKED ABOUT. `email` joins the statement
 *      only when the caller passed the key. That keeps "undefined overwrites" from
 *      erasing an address on every PIN change AND keeps the statement legal in the
 *      window before migration 0016 is applied by hand — a statement naming a column
 *      that does not exist yet fails as a whole, which would take PIN changes down.
 */
import { describe, expect, it, vi } from "vitest";
import type { Db } from "./index.ts";
import { getTeacherEmail, upsertTeacherIdentity } from "./teacher-identity.ts";

/**
 * Number-aware, depth-16, stop-at-a-column walker (see reset-tokens.test.ts). A
 * drizzle condition back-references its table, so JSON.stringify on one throws on a
 * circular structure — this is the door that exists for reading them.
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

function identityDb(opts: { selectRows?: unknown[]; fail?: Error } = {}) {
  const values: unknown[] = [];
  const sets: unknown[] = [];
  const conditions: unknown[] = [];
  const db = {
    insert: () => ({
      values: (v: unknown) => {
        values.push(v);
        return {
          onConflictDoUpdate: (cfg: { set: unknown }) => {
            sets.push(cfg.set);
            return opts.fail ? Promise.reject(opts.fail) : Promise.resolve(undefined);
          },
        };
      },
    }),
    select: () => {
      const node: Record<string, unknown> = {
        from: () => node,
        where: (c: unknown) => { conditions.push(c); return node; },
        limit: () => (opts.fail ? Promise.reject(opts.fail) : Promise.resolve(opts.selectRows ?? [])),
      };
      return node;
    },
  };
  return { db: db as unknown as Db, values, sets, conditions };
}

const ID = "0a1b2c3d-0000-4000-8000-000000000001";
const HASH = "$2b$12$0123456789012345678901";

describe("upsertTeacherIdentity — the PIN-only call, unchanged from before K2a", () => {
  it("updates the hash and NOTHING else", async () => {
    const { db, sets } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "TEST-Kollegin", pinHash: HASH });
    const set = sets[0] as Record<string, unknown>;
    expect(Object.keys(set)).toEqual(["pinHash"]); // exactly the pre-K2a shape
    expect(set.pinHash).toBe(HASH);
  });

  it("never puts her sign-in handle in the update clause", async () => {
    const { db, sets } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "TEST-Kollegin", pinHash: HASH });
    expect(Object.keys(sets[0] as object)).not.toContain("displayName");
  });

  it("does not NAME the email column at all — the statement stays legal before 0016", async () => {
    const { db, values, sets } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "TEST-Kollegin", pinHash: HASH });
    expect(Object.keys(values[0] as object)).not.toContain("email");
    expect(Object.keys(sets[0] as object)).not.toContain("email");
  });

  it("writes the handle and a claimed timestamp on the INSERT half (first promotion)", async () => {
    const { db, values } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "  TEST-Kollegin  ", pinHash: HASH });
    const row = values[0] as Record<string, unknown>;
    expect(row.id).toBe(ID); // the live session id is reused, so owned rows stay attached
    expect(row.displayName).toBe("TEST-Kollegin"); // trimmed
    expect(row.role).toBe("teacher");
    expect(row.classId).toBeNull();
    expect(row.claimedAt).toBeInstanceOf(Date);
  });
});

describe("upsertTeacherIdentity — the email-aware call", () => {
  it("writes the address on both halves when the key is passed", async () => {
    const { db, values, sets } = identityDb();
    await upsertTeacherIdentity(db, {
      id: ID,
      displayName: "TEST-Kollegin",
      pinHash: HASH,
      email: "kollegin@example.invalid",
    });
    expect((values[0] as Record<string, unknown>).email).toBe("kollegin@example.invalid");
    expect((sets[0] as Record<string, unknown>).email).toBe("kollegin@example.invalid");
  });

  it("clears the address when null is passed EXPLICITLY", async () => {
    const { db, sets } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "TEST-Kollegin", pinHash: HASH, email: null });
    const set = sets[0] as Record<string, unknown>;
    expect(Object.keys(set)).toContain("email"); // the key WAS passed …
    expect(set.email).toBeNull(); // … so clearing is what was meant
  });

  it("still refuses to rename her, even on the email path", async () => {
    const { db, sets } = identityDb();
    await upsertTeacherIdentity(db, { id: ID, displayName: "TEST-Kollegin", pinHash: HASH, email: "a@b.invalid" });
    expect(Object.keys(sets[0] as object)).not.toContain("displayName");
  });

  // CONTROL — the "not.toContain" assertions above must be able to fail. Passing the
  // key is the only difference between this case and the PIN-only one, which is the
  // whole claim being made.
  it("control: the key's presence is what puts the column in the statement", async () => {
    const ohne = identityDb();
    await upsertTeacherIdentity(ohne.db, { id: ID, displayName: "K", pinHash: HASH });
    const mit = identityDb();
    await upsertTeacherIdentity(mit.db, { id: ID, displayName: "K", pinHash: HASH, email: undefined });
    // `email: undefined` still COUNTS as passed ("email" in input) and clears — which
    // is why callers that must not touch it omit the key entirely, and why every such
    // call site in this lane is written that way.
    expect(Object.keys(ohne.sets[0] as object)).not.toContain("email");
    expect(Object.keys(mit.sets[0] as object)).toContain("email");
  });
});

describe("getTeacherEmail", () => {
  it("reads the address for a teacher id", async () => {
    const { db, conditions } = identityDb({ selectRows: [{ email: "kollegin@example.invalid" }] });
    await expect(getTeacherEmail(db, ID)).resolves.toBe("kollegin@example.invalid");
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:id");
    expect(where).toContain(ID); // the bound value, not merely the column
    expect(where).toContain("col:role");
    expect(where).toContain("teacher"); // scoped to the role — no student row has one
  });

  it("returns null when nothing is stored", async () => {
    const { db } = identityDb({ selectRows: [{ email: null }] });
    await expect(getTeacherEmail(db, ID)).resolves.toBeNull();
  });

  it("returns null when the row does not exist", async () => {
    const { db } = identityDb({ selectRows: [] });
    await expect(getTeacherEmail(db, ID)).resolves.toBeNull();
  });

  it("returns null — never throws — when the column is not there yet", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = identityDb({ fail: new Error('column "email" does not exist') });
    await expect(getTeacherEmail(db, ID)).resolves.toBeNull();
    expect(shout).toHaveBeenCalled();
    shout.mockRestore();
  });

  it("swallows a real outage too, because a settings page must not 500 for an optional field", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const { db } = identityDb({ fail: new Error("connection terminated unexpectedly") });
    await expect(getTeacherEmail(db, ID)).resolves.toBeNull();
    shout.mockRestore();
  });
});
