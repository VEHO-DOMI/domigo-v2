/**
 * K2a · Recovery tokens — the hash-only promise and the one-shot promise.
 *
 * The assertions that matter are NEGATIVE ones (the plaintext token never reaches an
 * insert; the read path never issues an update), so the walker below has to be able
 * to see everything before "it is not there" means anything.
 */
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import type { Db } from "./index.ts";
import {
  RESET_TOKEN_TTL_MINUTES,
  consumeResetToken,
  hashResetToken,
  mintResetToken,
  newResetToken,
  peekResetToken,
} from "./reset-tokens.ts";

/**
 * The atoms of one drizzle node — its SQL fragments, bound values and column
 * references. Two lessons are baked in, each paid for once in an earlier lane:
 *
 *   · the depth cap is 16, not 8: at 8 the innermost text of a nested condition
 *     (" > now()", "is null") was silently cut off, turning negative assertions
 *     green without evidential value (K1a, three cases);
 *   · numbers are walked EXPLICITLY: drizzle embeds a number interpolated into an
 *     `sql` template as a raw number chunk, not a Param object, and a walker that
 *     early-returns on non-objects reports its absence as proof (K1b).
 *
 * It still stops AT a column, because a drizzle Column back-references its table and
 * a table lists all its columns — a naive deep walk would surface every column name
 * in the schema and make every negative assertion vacuous.
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

/**
 * The atoms of a whole clause OBJECT (a SET, a projection) — every expression in it,
 * same stop-at-a-column rule. `atomsOf` deliberately does not descend into arbitrary
 * object properties, so a `{ consumedAt: sql`now()` }` needs this door (house shape,
 * cf. class-progress.test.ts:projectionAtoms).
 */
function clauseAtoms(clause: unknown): string[] {
  if (!clause || typeof clause !== "object") return [];
  return [...new Set(Object.values(clause as Record<string, unknown>).flatMap((v) => atomsOf(v)))];
}

/** Records inserts, updates and selects separately, so "which verb ran" is testable. */
function tokenDb(opts: { updateRows?: unknown[]; selectRows?: unknown[]; fail?: Error } = {}) {
  const inserted: unknown[] = [];
  const updateSets: unknown[] = [];
  const conditions: unknown[] = [];
  let updates = 0;
  let selects = 0;
  const boom = <T>(): Promise<T> => Promise.reject(opts.fail);
  const db = {
    insert: () => ({
      values: (v: unknown) => {
        if (opts.fail) return boom();
        inserted.push(v);
        return Promise.resolve(undefined);
      },
    }),
    update: () => {
      updates += 1;
      return {
        set: (s: unknown) => {
          updateSets.push(s);
          return {
            where: (c: unknown) => {
              conditions.push(c);
              return { returning: () => (opts.fail ? boom() : Promise.resolve(opts.updateRows ?? [])) };
            },
          };
        },
      };
    },
    select: () => {
      selects += 1;
      const node: Record<string, unknown> = {
        from: () => node,
        where: (c: unknown) => { conditions.push(c); return node; },
        limit: () => (opts.fail ? boom() : Promise.resolve(opts.selectRows ?? [])),
      };
      return node;
    },
  };
  return { db: db as unknown as Db, inserted, updateSets, conditions, calls: () => ({ updates, selects }) };
}

const TEACHER = "0a1b2c3d-0000-4000-8000-000000000001";
const missingTable = () => new Error('relation "domigo_v2.teacher_reset_tokens" does not exist');

describe("hashResetToken", () => {
  it("is domain-separated — the same bytes hashed elsewhere can never match an entry", () => {
    const t = "abcdef";
    const naive = createHash("sha256").update(t, "utf8").digest("hex");
    expect(hashResetToken(t)).not.toBe(naive);
    expect(hashResetToken(t)).toBe(createHash("sha256").update(`domigo-reset:${t}`, "utf8").digest("hex"));
  });

  it("is a pure function of the token, so a lookup by hash is a primary-key probe", () => {
    expect(hashResetToken("x")).toBe(hashResetToken("x"));
    expect(hashResetToken("x")).not.toBe(hashResetToken("y"));
  });
});

describe("newResetToken", () => {
  it("is URL-safe and long enough to be a credential", () => {
    const t = newResetToken();
    expect(t).toMatch(/^[A-Za-z0-9_-]+$/); // survives being a path segment untouched
    expect(t.length).toBeGreaterThanOrEqual(40); // 32 random bytes in base64url
    expect(newResetToken()).not.toBe(t);
  });
});

describe("mintResetToken", () => {
  it("stores the HASH and never the token — the negative asserted on the written row", async () => {
    const { db, inserted } = tokenDb();
    const res = await mintResetToken(db, TEACHER);
    expect(res.ok).toBe(true);
    if (!res.ok) return;

    const row = inserted[0] as Record<string, unknown>;
    expect(row.tokenHash).toBe(hashResetToken(res.token));
    expect(row.teacherId).toBe(TEACHER);
    // THE promise of the design: the plaintext appears nowhere in what was written.
    const atoms = Object.values(row).flatMap((v) => atomsOf(v));
    expect(atoms).not.toContain(res.token);
    expect(JSON.stringify(row)).not.toContain(res.token);
  });

  it("lets the DATABASE compute the expiry, and names the window in the statement", async () => {
    const { db, inserted } = tokenDb();
    await mintResetToken(db, TEACHER, 60);
    const expiry = atomsOf((inserted[0] as Record<string, unknown>).expiresAt).join(" ");
    expect(expiry).toContain("now()"); // never a JS clock — mint and spend run on different machines
    expect(expiry).toContain("make_interval");
    expect(expiry).toContain("60"); // the number itself, seen by the number-aware walker
  });

  it("degrades honestly when the table is not there yet", async () => {
    const { db } = tokenDb({ fail: missingTable() });
    await expect(mintResetToken(db, TEACHER)).resolves.toEqual({ ok: false, reason: "no_table" });
  });

  it("re-throws a real outage", async () => {
    const { db } = tokenDb({ fail: new Error("connection terminated unexpectedly") });
    await expect(mintResetToken(db, TEACHER)).rejects.toThrow(/connection terminated/);
  });
});

describe("consumeResetToken", () => {
  it("guards all three conditions in ONE statement — the row count is the verdict", async () => {
    const { db, conditions, updateSets } = tokenDb({ updateRows: [{ teacherId: TEACHER }] });
    const res = await consumeResetToken(db, "tok");
    expect(res).toEqual({ ok: true, teacherId: TEACHER });

    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:token_hash");
    expect(where).toContain(hashResetToken("tok")); // the bound value, not just the column
    expect(where).toContain("col:consumed_at");
    expect(where).toContain("col:expires_at");
    expect(where.join(" ")).toContain("is null"); // not yet spent
    expect(where.join(" ")).toContain(" > now()"); // not yet expired — DB clock, not ours
    expect(clauseAtoms(updateSets[0]).join(" ")).toContain("now()"); // consumed_at = now()
  });

  it("a SECOND click on the same link matches zero rows", async () => {
    const { db } = tokenDb({ updateRows: [] });
    await expect(consumeResetToken(db, "tok")).resolves.toEqual({ ok: false, reason: "invalid" });
  });

  it("an expired link matches zero rows too — and looks exactly the same to the visitor", async () => {
    const { db } = tokenDb({ updateRows: [] });
    const spent = await consumeResetToken(db, "spent");
    const stale = await consumeResetToken(db, "stale");
    expect(stale).toEqual(spent); // indistinguishable by construction
  });

  it("degrades honestly when the table is not there yet", async () => {
    const { db } = tokenDb({ fail: missingTable() });
    await expect(consumeResetToken(db, "tok")).resolves.toEqual({ ok: false, reason: "no_table" });
  });
});

describe("peekResetToken", () => {
  it("READS, and issues no update — a page render must never spend a link", async () => {
    const { db, calls } = tokenDb({ selectRows: [{ teacherId: TEACHER }] });
    await expect(peekResetToken(db, "tok")).resolves.toEqual({ ok: true });
    expect(calls().selects).toBe(1);
    expect(calls().updates).toBe(0);
  });

  it("applies the same three conditions the consuming statement will apply", async () => {
    const { db, conditions } = tokenDb({ selectRows: [] });
    await peekResetToken(db, "tok");
    const where = atomsOf(conditions[0]);
    expect(where).toContain("col:token_hash");
    expect(where).toContain("col:consumed_at");
    expect(where).toContain("col:expires_at");
  });
});

describe("the TTL constant", () => {
  it("is the hour the mail and the pages both promise", () => {
    expect(RESET_TOKEN_TTL_MINUTES).toBe(60);
  });
});
