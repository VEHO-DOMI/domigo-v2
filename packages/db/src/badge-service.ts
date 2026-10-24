import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import type { Db } from "./index.ts";
import { duels, practiceAttempts, userProgress, v2IdentityUsers } from "./schema.ts";
import { inScope, type ClassScope } from "./scope.ts";

export type StudentBadgeId = "streak-3" | "streak-7" | "prestige-1" | "prestige-2" | "prestige-3" | "duo-champion" | "daily-first";

/** cgo-156/E1–2: current confirmed server totals, not a historical award ledger.
 * One read, no names, writes, new tables or inferred completed exercise rounds.
 * XP/streak are the existing server counters; daily requires the atomic receipt
 * marker. Word Duels include both existing vocab and grammar duel modes.
 */
export async function getStudentBadges(db: Db, classScope: ClassScope, classId: string, userId: string): Promise<StudentBadgeId[] | null> {
  if (!inScope(classScope, classId)) return null;
  const [row] = await db.select({
    xp: userProgress.xp, streak: userProgress.streak,
    wins: sql<number>`(select count(*)::int from ${duels} where ${duels.classId} = ${v2IdentityUsers.classId} and ${duels.winner} = ${v2IdentityUsers.id} and ${duels.status} = 'complete')`,
    daily: sql<boolean>`exists(select 1 from ${practiceAttempts} where ${practiceAttempts.classId} = ${v2IdentityUsers.classId} and ${practiceAttempts.userId} = ${v2IdentityUsers.id} and ${practiceAttempts.mode} = 'daily' and ${practiceAttempts.bookedAt} is not null)`,
  }).from(v2IdentityUsers).leftJoin(userProgress, eq(userProgress.userId, v2IdentityUsers.id))
    .where(and(inArray(v2IdentityUsers.classId, [...classScope]), eq(v2IdentityUsers.classId, classId), eq(v2IdentityUsers.id, userId), eq(v2IdentityUsers.role, "student"), isNotNull(v2IdentityUsers.claimedAt)));
  if (!row) return null;
  const earned: StudentBadgeId[] = [];
  if ((row.streak ?? 0) >= 3) earned.push("streak-3");
  if ((row.streak ?? 0) >= 7) earned.push("streak-7");
  if ((row.xp ?? 0) >= 30000) earned.push("prestige-1");
  if ((row.xp ?? 0) >= 45000) earned.push("prestige-2");
  if ((row.xp ?? 0) >= 65000) earned.push("prestige-3");
  if (Number(row.wins) >= 5) earned.push("duo-champion");
  if (row.daily) earned.push("daily-first");
  return earned;
}
