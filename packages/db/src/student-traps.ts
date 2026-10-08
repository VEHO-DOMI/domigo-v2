import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { practiceAttempts } from "./schema.ts";
import type { Db } from "./index.ts";
import type { ClassScope } from "./scope.ts";

export interface StudentTrapCount {
  trapId: string;
  count: number;
  unitSlug: string;
  itemId: string;
}

/** Own recurring mistakes only; reads the existing ledger, never writes progress.
 * created_at is the ledger's attempt time. Both door fields come from the same
 * latest occurrence, with id breaking timestamp ties. Foreign JSON shapes and
 * non-string trap values are ignored; unknown string ids remain readable.
 */
export async function listStudentTraps(
  db: Db,
  classScope: ClassScope,
  classId: string,
  userId: string,
  { sinceDays = 30, limit = 3 }: { sinceDays?: number; limit?: number } = {},
): Promise<StudentTrapCount[]> {
  const trapId = sql<string>`${practiceAttempts.context}->>'trap'`;
  const rows = await db
    .select({
      trapId,
      count: sql<number>`count(*)::int`,
      unitSlug: sql<string>`(array_agg(${practiceAttempts.unitSlug} order by ${practiceAttempts.createdAt} desc, ${practiceAttempts.id} desc))[1]`,
      itemId: sql<string>`(array_agg(${practiceAttempts.itemId} order by ${practiceAttempts.createdAt} desc, ${practiceAttempts.id} desc))[1]`,
    })
    .from(practiceAttempts)
    .where(and(
      inArray(practiceAttempts.classId, [...classScope]),
      eq(practiceAttempts.classId, classId),
      eq(practiceAttempts.userId, userId),
      eq(practiceAttempts.tier, "wrong"),
      sql`${practiceAttempts.createdAt} >= now() - ${sinceDays} * interval '1 day'`,
      sql`${practiceAttempts.context}->>'trap' is not null`,
      sql`jsonb_typeof(${practiceAttempts.context}->'trap') = 'string'`,
      sql`${practiceAttempts.context}->>'trap' <> ''`,
    ))
    .groupBy(trapId)
    .having(sql`count(*) >= 2`)
    .orderBy(desc(sql`count(*)`), desc(sql`max(${practiceAttempts.createdAt})`), trapId)
    .limit(limit);
  return rows.map((row) => ({ ...row, count: Number(row.count) }));
}
