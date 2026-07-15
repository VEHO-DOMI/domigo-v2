/**
 * M-2 · Assignment persistence + read helpers (Neon, server-only). Best-effort
 * like every service here (review.ts/gamesave.ts): grading + rendering must
 * survive a DB hiccup, so callers wrap in try/catch. Pure score math lives in
 * assignments.ts; pure draft validation in assignment-draft.ts — this file is
 * only the CRUD + the read-only v1 class list.
 */
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "./index.ts";
import { assignments, assignmentSections, reservedItems } from "./schema.ts";
import { v1Classes } from "./v1.ts";
import type { AssignmentDraft } from "./assignment-draft.ts";

export interface ClassRow {
  id: string;
  name: string;
  grade: number;
}

/** Non-archived v1 classes for the teacher's class picker (read-only SELECT on
 *  public — never a write). Koki is the sole teacher, so all classes are his. */
export async function listClasses(db: Db): Promise<ClassRow[]> {
  const rows = await db
    .select({ id: v1Classes.id, name: v1Classes.name, grade: v1Classes.grade })
    .from(v1Classes)
    .where(isNull(v1Classes.archivedAt));
  return rows.map((r) => ({ id: r.id, name: r.name, grade: r.grade }));
}

export interface AssignmentRow {
  id: string;
  classId: string;
  title: string;
  mode: string;
  dueAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
}

/** A teacher's assignments, newest first (archived ones included, flagged). */
export async function listAssignmentsByCreator(db: Db, createdBy: string): Promise<AssignmentRow[]> {
  const rows = await db
    .select({
      id: assignments.id,
      classId: assignments.classId,
      title: assignments.title,
      mode: assignments.mode,
      dueAt: assignments.dueAt,
      archivedAt: assignments.archivedAt,
      createdAt: assignments.createdAt,
    })
    .from(assignments)
    .where(eq(assignments.createdBy, createdBy))
    .orderBy(desc(assignments.createdAt));
  return rows;
}

/** One assignment + its ordered sections (null if it doesn't exist). */
export async function getAssignmentWithSections(db: Db, id: string) {
  const [a] = await db.select().from(assignments).where(eq(assignments.id, id)).limit(1);
  if (!a) return null;
  const sections = await db
    .select()
    .from(assignmentSections)
    .where(eq(assignmentSections.assignmentId, id))
    .orderBy(assignmentSections.position);
  return { assignment: a, sections };
}

/**
 * Persist a validated draft as an assignment + its sections. The caller MUST have
 * run validateAssignmentDraft first (the endpoint does). Sections are inserted in
 * draft order; itemIds are stored verbatim and RE-RESOLVED via the loaders at
 * grade time (never trusted from this jsonb). Returns the new assignment id.
 */
export async function createAssignment(db: Db, draft: AssignmentDraft, createdBy: string): Promise<string> {
  const [row] = await db
    .insert(assignments)
    .values({
      classId: draft.classId,
      createdBy,
      title: draft.title.trim(),
      descriptionDe: draft.descriptionDe?.trim() || null,
      mode: draft.mode,
      startsAt: draft.startsAt ? new Date(draft.startsAt) : null,
      dueAt: draft.dueAt ? new Date(draft.dueAt) : null,
      sessionDurationMinutes: draft.sessionDurationMinutes ?? null,
      attemptsPerTest: draft.attemptsPerTest,
      notenSchluessel: draft.notenSchluessel ?? null,
      displayConfig: draft.displayConfig ?? null,
    })
    .returning({ id: assignments.id });
  const assignmentId = row!.id;

  if (draft.sections.length > 0) {
    await db.insert(assignmentSections).values(
      draft.sections.map((s) => ({
        assignmentId,
        position: s.position,
        kind: s.kind,
        itemIds: s.itemIds,
        listeningTaskId: s.listeningTaskId ?? null,
        writingPromptId: s.writingPromptId ?? null,
        timerMinutes: s.timerMinutes ?? null,
        weightPct: s.weightPct,
        sectionConfig: s.sectionConfig ?? null,
      })),
    );
  }
  return assignmentId;
}

/** Active reserved item ids for a class (held out of assignments, self-study,
 *  Smart Review + game encounters — the J-1 `mock` pool). */
export async function listReservedForClass(db: Db, classId: string): Promise<Set<string>> {
  const rows = await db
    .select({ itemId: reservedItems.itemId })
    .from(reservedItems)
    .where(and(eq(reservedItems.classId, classId), eq(reservedItems.active, true)));
  return new Set(rows.map((r) => r.itemId));
}

/** Reserve items for a class → the `mock` pool (held out of practice/review/games
 *  so a mock test can use them unseen). Idempotent: re-reserving re-activates a
 *  released row. The teacher-facing UI is a later item; this is the DB primitive. */
export async function reserveItems(db: Db, classId: string, itemIds: readonly string[]): Promise<void> {
  if (itemIds.length === 0) return;
  await db
    .insert(reservedItems)
    .values(itemIds.map((itemId) => ({ classId, itemId, active: true })))
    .onConflictDoUpdate({ target: [reservedItems.classId, reservedItems.itemId], set: { active: true, releasedAt: null } });
}

/** Release reserved items back into the practice pool (active=false + releasedAt). */
export async function releaseItems(db: Db, classId: string, itemIds: readonly string[]): Promise<void> {
  if (itemIds.length === 0) return;
  await db
    .update(reservedItems)
    .set({ active: false, releasedAt: new Date() })
    .where(and(eq(reservedItems.classId, classId), inArray(reservedItems.itemId, [...itemIds])));
}

/** Soft-archive (assignments are never hard-deleted — a taken session must resolve). */
export async function archiveAssignment(db: Db, id: string, createdBy: string): Promise<void> {
  await db
    .update(assignments)
    .set({ archivedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(assignments.id, id), eq(assignments.createdBy, createdBy)));
}
