/**
 * @domigo/db · Studio full-CRUD drafts (S-2, migration 0010). A teacher
 * creates/replaces/removes a whole task as a `content_drafts` row; it can only
 * reach `status: 'published'` after the blind-solve gate records a passing
 * `content_checks` row (the orchestration lives in the API — this layer is the
 * primitives). Journal-then-flip: record the check FIRST, then flip the status.
 * Pure data access — never validates or grades (that is the app + engine).
 */
import { and, desc, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2ContentChecks, v2ContentDrafts } from "./schema.ts";

export type DraftStatus = "draft" | "checking" | "check_failed" | "published";
export type DraftAction = "create" | "replace" | "remove";

export interface DraftRow {
  id: string;
  itemId: string;
  unitSlug: string;
  kind: string;
  item: unknown; // raw jsonb — caller normalizes
  action: string;
  status: string;
  updatedAt: Date;
}

export interface CheckRow {
  checkKind: string;
  verdict: string;
  evidence: unknown;
  createdAt: Date;
}

/** Published drafts for one unit — the content-service layers these last
 *  (create adds, replace supersedes, remove drops). */
export async function loadPublishedDrafts(db: Db, unitSlug: string): Promise<DraftRow[]> {
  const rows = await db
    .select()
    .from(v2ContentDrafts)
    .where(and(eq(v2ContentDrafts.unitSlug, unitSlug), eq(v2ContentDrafts.status, "published")));
  return rows as DraftRow[];
}

export async function loadDraft(db: Db, itemId: string): Promise<DraftRow | null> {
  const rows = await db.select().from(v2ContentDrafts).where(eq(v2ContentDrafts.itemId, itemId)).limit(1);
  return (rows[0] as DraftRow) ?? null;
}

export async function loadDraftsForUnit(db: Db, unitSlug: string): Promise<DraftRow[]> {
  const rows = await db.select().from(v2ContentDrafts).where(eq(v2ContentDrafts.unitSlug, unitSlug));
  return rows as DraftRow[];
}

/** Upsert a draft (the editor's Save). Resets status to 'draft' — a re-saved
 *  draft must pass the gate again before it can publish. */
export async function saveDraft(db: Db, args: { itemId: string; unitSlug: string; kind: string; item: unknown; action: DraftAction; updatedBy: string | null }): Promise<string> {
  const rows = await db
    .insert(v2ContentDrafts)
    .values({ itemId: args.itemId, unitSlug: args.unitSlug, kind: args.kind, item: args.item, action: args.action, status: "draft", updatedBy: args.updatedBy, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: v2ContentDrafts.itemId,
      set: { unitSlug: args.unitSlug, kind: args.kind, item: args.item, action: args.action, status: "draft", updatedBy: args.updatedBy, updatedAt: new Date() },
    })
    .returning({ id: v2ContentDrafts.id });
  return rows[0]!.id;
}

export async function setDraftStatus(db: Db, itemId: string, status: DraftStatus): Promise<void> {
  await db.update(v2ContentDrafts).set({ status, updatedAt: new Date() }).where(eq(v2ContentDrafts.itemId, itemId));
}

/** Append a check to the journal (the blind-solve/zod evidence). Written BEFORE
 *  the status flip so a crash leaves an unflipped draft with its evidence, never
 *  a published draft with no recorded check. */
export async function recordCheck(db: Db, args: { draftId: string; checkKind: "zod" | "blind_solve"; verdict: string; evidence: unknown }): Promise<void> {
  await db.insert(v2ContentChecks).values({ draftId: args.draftId, checkKind: args.checkKind, verdict: args.verdict, evidence: args.evidence });
}

export async function loadDraftChecks(db: Db, draftId: string, limit = 10): Promise<CheckRow[]> {
  const rows = await db
    .select({ checkKind: v2ContentChecks.checkKind, verdict: v2ContentChecks.verdict, evidence: v2ContentChecks.evidence, createdAt: v2ContentChecks.createdAt })
    .from(v2ContentChecks)
    .where(eq(v2ContentChecks.draftId, draftId))
    .orderBy(desc(v2ContentChecks.createdAt))
    .limit(limit);
  return rows as CheckRow[];
}

/** Discard a draft entirely (revert to corpus/overlay). */
export async function deleteDraft(db: Db, itemId: string): Promise<void> {
  await db.delete(v2ContentDrafts).where(eq(v2ContentDrafts.itemId, itemId));
}

/** All draft statuses (LIST view chips). */
export async function loadDraftStatuses(db: Db): Promise<Array<{ itemId: string; unitSlug: string; status: string; action: string }>> {
  return db.select({ itemId: v2ContentDrafts.itemId, unitSlug: v2ContentDrafts.unitSlug, status: v2ContentDrafts.status, action: v2ContentDrafts.action }).from(v2ContentDrafts);
}
