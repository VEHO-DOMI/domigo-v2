/** Read the original practice booking, never recompute its award on replay. */
import { and, eq, inArray } from "drizzle-orm";
import type { Db } from "./index.ts";
import type { ClassScope } from "./scope.ts";
import { practiceAttempts } from "./schema.ts";

export async function getPracticeReceipt(db: Db, classScope: ClassScope, attempt: {
  userId: string; classId: string; clientAttemptId: string; itemId: string; mode: string;
}): Promise<{ tier: string; xpAwarded: number } | null> {
  const [row] = await db.select({ tier: practiceAttempts.tier, xpAwarded: practiceAttempts.xpAwarded })
    .from(practiceAttempts).where(and(
      inArray(practiceAttempts.classId, [...classScope]),
      eq(practiceAttempts.classId, attempt.classId), eq(practiceAttempts.userId, attempt.userId),
      eq(practiceAttempts.clientAttemptId, attempt.clientAttemptId),
      eq(practiceAttempts.itemId, attempt.itemId), eq(practiceAttempts.mode, attempt.mode),
    )).limit(1);
  return row ?? null;
}
