/**
 * K2b · THE ONE-TIME REGISTER — the half of an ops sign-in link that lives in
 * the database.
 *
 * THE PRIMARY KEY DECIDES THE RACE. Claiming a link is a bare INSERT with
 * ON CONFLICT DO NOTHING; the number of RETURNED ROWS is the verdict, never a
 * driver rowCount (house rule, cf. teacher-claim.ts). Nothing here reads before
 * it writes, so two simultaneous presentations of one link cannot both win —
 * that is not this code being careful, it is the index being the referee.
 *
 * FAIL CLOSED WHEN THE TABLE IS NOT THERE. Raw migrations are applied by hand
 * after a merge, so there is always a window in which the code is deployed and
 * the table is not. In that window the link simply does NOT work (401), and that
 * is the declared trade: the template's platform keeps a coarser compare-and-swap
 * fallback bound to `last_seen_at`, but DomiGo's users table has no such column,
 * and inventing a weaker second mechanism for a TEST capability would be paying
 * a permanent risk for a temporary convenience. A test surface may be absent for
 * a day. A sign-in path may not be weak for a day.
 *
 * WHAT ELSE LIVES HERE. Besides the register this file holds the ops namespace's
 * whole database half — the class lookup, the roster, the scoped student lookups
 * and the provisioning insert. Not by preference: apps/web does not depend on
 * drizzle-orm (nothing under app/ has ever written a query), so a route cannot
 * hold one. That turns out to be the right wall anyway — the scope gate is an
 * authorization rule, and in this package authorization IS the WHERE clause.
 *
 * NO node:crypto HERE, deliberately. The hash arrives ready-made from
 * apps/web/lib/ops.ts (Web-Crypto), so this module is safe to re-export through
 * index.ts — unlike reset-tokens.ts, whose node:crypto import is exactly what
 * K2a had to keep OUT of the Edge middleware chain. Read the comment at the
 * bottom of index.ts before adding an import here.
 */
import { and, eq, isNull, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2Classes, v2IdentityUsers, v2OpsLinkUses } from "./schema.ts";
import { isMissingDbObject } from "./teacher-events.ts";

/** What a redeeming caller hands in. Computed by the pure half — this module
 *  performs no arithmetic and no hashing of its own. */
export type OpsLinkClaim = {
  nonceHash: string;
  userId: string;
  expiresAt: Date;
};

export type OpsLinkClaimResult =
  /** Claimed by THIS presentation: the link was unspent and is now retired. */
  | "claimed"
  /** Already spent, or the row could not be claimed — refuse the sign-in. */
  | "spent"
  /** The register does not exist yet (migration 0017 unapplied) — refuse too. */
  | "no_table";

/**
 * Retire a link by claiming its nonce. The claim IS the enforcement, not its
 * bookkeeping: a lost insert and a thrown error both refuse, because a link that
 * cannot be retired is a link that must not be honoured.
 */
export async function claimOpsLinkUse(db: Db, claim: OpsLinkClaim): Promise<OpsLinkClaimResult> {
  try {
    const inserted = await db
      .insert(v2OpsLinkUses)
      .values(claim)
      .onConflictDoNothing({ target: v2OpsLinkUses.nonceHash })
      .returning({ nonceHash: v2OpsLinkUses.nonceHash });
    if (inserted.length === 0) return "spent";
  } catch (err) {
    if (isMissingDbObject(err)) {
      console.error(
        "[ops-links] domigo_v2.ops_link_uses is missing — the sign-in link is refused "
          + "(migration 0017 not applied yet); this is fail-closed by design",
      );
      return "no_table";
    }
    // Any OTHER database error is a real failure and must not quietly downgrade
    // into an accepted sign-in.
    return "spent";
  }

  // Housekeeping only, and never allowed to fail the sign-in that just claimed.
  // Expired rows can retire nothing: the clock already refuses their tokens.
  try {
    await db.delete(v2OpsLinkUses).where(sql`${v2OpsLinkUses.expiresAt} < now()`);
  } catch {
    /* best effort */
  }
  return "claimed";
}

/** The student an accepted link resolves to. One projection, so nothing
 *  downstream can invent a different shape. */
export type OpsClassStudent = {
  id: string;
  displayName: string;
  classId: string;
};

/**
 * THE SCOPE GATE — resolve one student INSIDE the ops class, or nothing.
 *
 * This lives here rather than in the route or the provider because it is an
 * authorization rule, and in this package authorization IS the WHERE clause. The
 * distinction matters and is the reason the ops namespace is safe to extend: a
 * real student's valid uuid does not resolve to a filtered-out row, it resolves
 * to NO row. There is no code path from this function to a class the operator
 * did not name in OPS_CLASS_CODE.
 *
 * An archived class resolves to nothing too — the same rule the sign-in path
 * already applies, so an ops link can never outlive the class it belongs to.
 */
export async function findOpsClassStudent(
  db: Db,
  classCode: string,
  userId: string,
): Promise<OpsClassStudent | null> {
  const rows = await db
    .select({
      id: v2IdentityUsers.id,
      displayName: v2IdentityUsers.displayName,
      classId: v2IdentityUsers.classId,
    })
    .from(v2IdentityUsers)
    .innerJoin(v2Classes, eq(v2Classes.id, v2IdentityUsers.classId))
    .where(
      and(
        eq(v2IdentityUsers.role, "student"),
        eq(v2IdentityUsers.id, userId),
        eq(v2Classes.inviteCode, classCode),
        isNull(v2Classes.archivedAt),
      ),
    )
    .limit(1);
  const row = rows[0];
  if (!row || row.classId === null) return null;
  return { id: row.id, displayName: row.displayName, classId: row.classId };
}

/** The ops class itself. Archived counts as absent — an ops link must not
 *  outlive the class it belongs to, the same rule the sign-in path applies. */
export type OpsClass = { id: string; inviteCode: string; name: string };

export async function loadOpsClass(db: Db, classCode: string): Promise<OpsClass | null> {
  const rows = await db
    .select({ id: v2Classes.id, inviteCode: v2Classes.inviteCode, name: v2Classes.name })
    .from(v2Classes)
    .where(and(eq(v2Classes.inviteCode, classCode), isNull(v2Classes.archivedAt)))
    .limit(1);
  return rows[0] ?? null;
}

/** One student of the ops class, addressed by id OR by nickname (case-insensitive,
 *  the way the roster reads). Both forms are scoped by the same class WHERE, so a
 *  real student's valid uuid resolves to NOTHING rather than to a filtered row. */
export async function findOpsStudent(
  db: Db,
  classId: string,
  by: { id?: string; nickname?: string },
): Promise<{ id: string; displayName: string } | null> {
  const id = by.id?.trim() ?? "";
  const nickname = by.nickname?.trim() ?? "";
  if (id.length === 0 && nickname.length === 0) return null;
  const rows = await db
    .select({ id: v2IdentityUsers.id, displayName: v2IdentityUsers.displayName })
    .from(v2IdentityUsers)
    .where(
      and(
        eq(v2IdentityUsers.role, "student"),
        eq(v2IdentityUsers.classId, classId),
        id.length > 0
          ? eq(v2IdentityUsers.id, id)
          : sql`lower(${v2IdentityUsers.displayName}) = lower(${nickname})`,
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

/** The roster the token holder is allowed to see — the ops class, and nothing else. */
export async function listOpsClassStudents(
  db: Db,
  classId: string,
): Promise<{ id: string; nickname: string; claimedAt: Date | null }[]> {
  return db
    .select({
      id: v2IdentityUsers.id,
      nickname: v2IdentityUsers.displayName,
      claimedAt: v2IdentityUsers.claimedAt,
    })
    .from(v2IdentityUsers)
    .where(and(eq(v2IdentityUsers.role, "student"), eq(v2IdentityUsers.classId, classId)));
}

/**
 * Provision a test student in the ops class — the API twin of the /join claim.
 *
 * `claimedAt` is stamped because this identity was not left on a roster waiting
 * for a child to pick it: it exists already claimed, by the token holder. The
 * caller supplies the bcrypt hash (apps/web owns bcryptjs); this function never
 * sees a PIN, which is why no PIN can leak from the database layer.
 *
 * "taken" rather than a throw, because a repeated nickname is an ordinary answer
 * to an ordinary request, not a failure of the system.
 */
export async function createOpsTestStudent(
  db: Db,
  classId: string,
  displayName: string,
  pinHash: string,
): Promise<{ ok: true; id: string } | { ok: false; reason: "taken"; id: string }> {
  const existing = await db
    .select({ id: v2IdentityUsers.id })
    .from(v2IdentityUsers)
    .where(
      and(
        eq(v2IdentityUsers.role, "student"),
        eq(v2IdentityUsers.classId, classId),
        sql`lower(${v2IdentityUsers.displayName}) = lower(${displayName})`,
      ),
    )
    .limit(1);
  if (existing[0]) return { ok: false, reason: "taken", id: existing[0].id };

  const created = await db
    .insert(v2IdentityUsers)
    .values({ role: "student", displayName, pinHash, classId, claimedAt: new Date() })
    .returning({ id: v2IdentityUsers.id });
  return { ok: true, id: created[0]!.id };
}
