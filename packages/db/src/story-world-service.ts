/** Platform-wide visibility only. No progress, names or class identifiers are stored. */
import { and, inArray, isNull } from "drizzle-orm";
import type { Db } from "./index.ts";
import { storyWorldSettings, v2Classes } from "./schema.ts";
import { v1Classes } from "./v1.ts";
import { assertWritableScope, type ClassScope } from "./scope.ts";

export class StoryWorldForbiddenError extends Error {
  constructor() { super("story_world_forbidden"); }
}

/** Public platform configuration, never a class/student query (see allowlist). */
export async function listStoryWorldSettings(db: Db): Promise<{ grade: number; isOpen: boolean }[]> {
  return db.select({ grade: storyWorldSettings.grade, isOpen: storyWorldSettings.isOpen })
    .from(storyWorldSettings);
}

/** Only year numbers from active classes admitted by the trusted session scope. */
export async function listStoryWorldGrades(db: Db, classScope: ClassScope): Promise<number[]> {
  const current = await db.select({ grade: v2Classes.grade }).from(v2Classes)
    .where(and(inArray(v2Classes.id, [...classScope]), isNull(v2Classes.archivedAt)));
  const legacy = await db.select({ grade: v1Classes.grade }).from(v1Classes)
    .where(and(inArray(v1Classes.id, [...classScope]), isNull(v1Classes.archivedAt)));
  return [...new Set([...current, ...legacy].map((row) => row.grade))]
    .filter((grade) => Number.isInteger(grade) && grade >= 1 && grade <= 4).sort();
}

/** Role and scope come from the server session, never the submitted form. */
export async function setStoryWorld(
  db: Db,
  classScope: ClassScope,
  role: string,
  grade: number,
  isOpen: boolean,
): Promise<void> {
  if (role !== "teacher" || classScope.length === 0) throw new StoryWorldForbiddenError();
  assertWritableScope(classScope, "setStoryWorld");
  if (!Number.isInteger(grade) || grade < 1 || grade > 4 || typeof isOpen !== "boolean") {
    throw new TypeError("invalid_story_world_setting");
  }
  const allowedGrades = await listStoryWorldGrades(db, classScope);
  if (!allowedGrades.includes(grade)) throw new StoryWorldForbiddenError();
  await db.insert(storyWorldSettings).values({ grade, isOpen })
    .onConflictDoUpdate({ target: storyWorldSettings.grade, set: { isOpen, updatedAt: new Date() } });
}
