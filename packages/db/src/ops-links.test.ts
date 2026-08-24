/**
 * K2b · The one-time register — the race, and the window before the migration.
 *
 * Four properties, each asserted on what the register actually DOES rather than
 * on what it returns:
 *   1. an unspent nonce is claimed, and the claim is an INSERT that names the
 *      conflict target (the primary key is what decides a race — not this code),
 *   2. a second presentation of the same link gets ZERO returned rows and loses,
 *   3. a missing table refuses the sign-in (fail closed) instead of downgrading,
 *   4. any OTHER database error also refuses.
 */
import { describe, expect, it, vi } from "vitest";
import type { Db } from "./index.ts";
import { claimOpsLinkUse } from "./ops-links.ts";

const CLAIM = {
  nonceHash: "f".repeat(64),
  userId: "0a1b2c3d-0000-4000-8000-000000000001",
  expiresAt: new Date("2026-08-24T10:00:00.000Z"),
};

/**
 * Insert-side mock. `returning` answers with the rows the real index would leave:
 * one row when the nonce was free, none when it was already spent.
 */
function insertDb(outcome: { rows: unknown[] } | { fail: unknown }) {
  const seen: { values?: unknown; target?: unknown; deleted: number } = { deleted: 0 };
  const db = {
    insert: () => ({
      values: (v: unknown) => {
        seen.values = v;
        return {
          onConflictDoNothing: (opts: { target?: unknown }) => {
            seen.target = opts?.target;
            return {
              returning: () =>
                "fail" in outcome ? Promise.reject(outcome.fail) : Promise.resolve(outcome.rows),
            };
          },
        };
      },
    }),
    delete: () => ({ where: () => { seen.deleted += 1; return Promise.resolve(undefined); } }),
  };
  return { db: db as unknown as Db, seen };
}

describe("claimOpsLinkUse", () => {
  it("claims an unspent nonce and writes exactly the row it was handed", async () => {
    const { db, seen } = insertDb({ rows: [{ nonceHash: CLAIM.nonceHash }] });
    expect(await claimOpsLinkUse(db, CLAIM)).toBe("claimed");
    expect(seen.values).toEqual(CLAIM);
    // The conflict target must be NAMED: an ON CONFLICT DO NOTHING without one
    // would swallow a conflict on any constraint, which is a different promise.
    expect(seen.target).toBeDefined();
  });

  it("prunes expired rows AFTER a successful claim, never before", async () => {
    const { db, seen } = insertDb({ rows: [{ nonceHash: CLAIM.nonceHash }] });
    await claimOpsLinkUse(db, CLAIM);
    expect(seen.deleted).toBe(1);
  });

  it("REFUSES the second presentation of one link — zero returned rows is the verdict", async () => {
    const { db, seen } = insertDb({ rows: [] });
    expect(await claimOpsLinkUse(db, CLAIM)).toBe("spent");
    // TAMPER: were the verdict read from a driver rowCount, or were an empty
    // result treated as success, this would say "claimed". It must not. And a
    // refused claim must not prune either — nothing was retired.
    expect(seen.deleted).toBe(0);
  });

  it("fails CLOSED when the register table does not exist yet (42P01)", async () => {
    const shout = vi.spyOn(console, "error").mockImplementation(() => {});
    const missing = Object.assign(new Error('relation "domigo_v2.ops_link_uses" does not exist'), { code: "42P01" });
    const { db } = insertDb({ fail: missing });
    expect(await claimOpsLinkUse(db, CLAIM)).toBe("no_table");
    // It says so out loud: a capability that is silently off is a capability
    // nobody knows to switch on.
    expect(shout).toHaveBeenCalledTimes(1);
    shout.mockRestore();
  });

  it("refuses on ANY other database error rather than downgrading", async () => {
    const { db } = insertDb({ fail: Object.assign(new Error("connection reset"), { code: "08006" }) });
    expect(await claimOpsLinkUse(db, CLAIM)).toBe("spent");
  });
});
