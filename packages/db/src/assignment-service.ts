/**
 * M-2 · Assignment persistence + read helpers (Neon, server-only). Best-effort
 * like every service here (review.ts/gamesave.ts): grading + rendering must
 * survive a DB hiccup, so callers wrap in try/catch. Pure score math lives in
 * assignments.ts; pure draft validation in assignment-draft.ts — this file is
 * only the CRUD + the teacher's class list (v2-native + the read-only v1 mirror).
 */
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import type { Db } from "./index.ts";
import { assignments, assignmentSections, reservedItems } from "./schema.ts";
import { v1Classes } from "./v1.ts";
import { listAllClassesForGrandmaster, listClassesForTeacher } from "./class-service.ts";
import type { AssignmentDraft } from "./assignment-draft.ts";

export interface ClassRow {
  id: string;
  /** DISPLAY label — a v1 legacy class carries LEGACY_CLASS_LABEL_SUFFIX (see listClasses). */
  name: string;
  grade: number;
}

/**
 * Display suffix that marks a class from the v1 legacy register. Class NAMES
 * collide across the two registers — production carries "2A" twice (a v1 row and
 * a v2 row, measured 2026-08-22) — and a picker showing "2A" twice with no way to
 * tell them apart is a trap for a teacher. The suffix is presentation only: ids,
 * grades and every write path stay untouched.
 */
export const LEGACY_CLASS_LABEL_SUFFIX = " · Altbestand";

/**
 * Non-archived classes for the teacher's class picker — a UNION, v2 first.
 *
 * P1 (split-brain fix): this list used to read v1's `public.classes` ONLY, on the
 * assumption "Koki is the sole teacher, so all classes are his". From 2026/27 every
 * NEW class is v2-native and belongs to a DIFFERENT teacher, so that assumption
 * silently starved every new class of assignments and checkups. Now:
 *
 *   1. the teacher's OWN v2 classes (scoped by teacherId, non-archived) — reusing
 *      listClassesForTeacher so the picker shows exactly what /admin/classes shows,
 *      one definition of "this teacher's classes" rather than two;
 *   2. then the v1 legacy classes (non-archived, UNSCOPED — the Koki era predates
 *      per-teacher ownership), each labelled with LEGACY_CLASS_LABEL_SUFFIX. The id
 *      spaces are disjoint (separate schemas, random UUIDs), so no de-duplication is
 *      needed — and a NAME that exists in both registers stays distinguishable.
 *
 * `teacherId` is a REQUIRED parameter, never a default: a default would silently
 * bind future call sites to one teacher — the very defect being repaired here.
 * Reads only; `public` is never written.
 */
export async function listClasses(db: Db, teacherId: string): Promise<ClassRow[]> {
  // v2 half degrades like auth.ts's v2Safe(): if the domigo_v2 tables are
  // unreachable on this deployment, the picker keeps its v1 classes instead of
  // falling empty. (v2Safe itself is module-private to auth.ts.)
  let v2: ClassRow[] = [];
  try {
    const owned = await listClassesForTeacher(db, teacherId);
    v2 = owned.map((c) => ({ id: c.id, name: c.name, grade: c.grade }));
  } catch (err) {
    console.error(
      "[assignment-service] v2 class query failed — falling back to the v1 mirror only:",
      err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200),
    );
  }

  const v1 = await db
    .select({ id: v1Classes.id, name: v1Classes.name, grade: v1Classes.grade })
    .from(v1Classes)
    .where(isNull(v1Classes.archivedAt));

  return [
    ...v2,
    ...v1.map((r) => ({ id: r.id, name: `${r.name}${LEGACY_CLASS_LABEL_SUFFIX}`, grade: r.grade })),
  ];
}

/**
 * P3 · the GRANDMASTER's class picker — EVERY active class on the platform, not
 * just one teacher's. Same shape and same order as listClasses (v2 first, the v1
 * legacy register behind it), with one addition: each v2 label carries its owner,
 * "2A · Frau Beispiel", because the operator is now looking at classes that are
 * not his and a bare "2A" would say nothing about whose roster he is about to
 * assign work to.
 *
 * Deliberately a SEPARATE export rather than a flag on listClasses: the two are
 * different authorizations, and a call site must say WHICH one it means (the two
 * builder pages branch explicitly on isGrandmaster). A default parameter is what
 * P1 had to repair — it silently bound every future caller to one reading.
 *
 * Built on listAllClassesForGrandmaster so "every class on the platform" has ONE
 * definition: the picker and the all-classes view can never disagree about which
 * classes exist or who owns them.
 */
export async function listClassesForGrandmaster(db: Db): Promise<ClassRow[]> {
  const overview = await listAllClassesForGrandmaster(db);
  return [
    ...overview.v2.map((c) => ({ id: c.id, name: `${c.name} · ${c.ownerName}`, grade: c.grade })),
    ...overview.legacy.map((c) => ({ id: c.id, name: `${c.name}${LEGACY_CLASS_LABEL_SUFFIX}`, grade: c.grade })),
  ];
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
