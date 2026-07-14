/**
 * @domigo/db · Studio content-overlay data access (S-1, migration 0009).
 *
 * Pure data access — this module NEVER validates a patch (that is the app's
 * job, via `@domigo/content-loader` `validatePatch` against a fresh base) and
 * never imports the content loader (the `packages/db` ↔ content boundary, cf.
 * checkup.ts). It returns the raw jsonb `patch` value; the caller normalizes it
 * (neon-http may hand jsonb back as a string) and applies the allowlist merge.
 *
 * Every mutation is journal-then-flip (Neon HTTP has no multi-statement
 * transactions): append a `content_revisions` row FIRST, then flip the live
 * `content_overrides` row — a crash between the two leaves a harmless orphan
 * history row, never an unhistoried live edit.
 */
import { and, desc, eq } from "drizzle-orm";
import type { Db } from "./index.ts";
import { v2ContentOverrides, v2ContentRevisions } from "./schema.ts";

export interface OverrideRow {
  itemId: string;
  unitSlug: string;
  kind: string;
  patch: unknown; // raw jsonb — caller normalizes (jsonb-as-string gotcha)
  status: string;
  updatedAt: Date;
}

export interface RevisionRow {
  patch: unknown;
  action: string;
  actorId: string | null;
  createdAt: Date;
}

/** Published overrides for one unit — the read path the content-service layers
 *  on. Returns raw rows; the caller normalizes `patch` + applies the overlay. */
export async function loadPublishedOverrides(db: Db, unitSlug: string): Promise<OverrideRow[]> {
  const rows = await db
    .select({
      itemId: v2ContentOverrides.itemId,
      unitSlug: v2ContentOverrides.unitSlug,
      kind: v2ContentOverrides.kind,
      patch: v2ContentOverrides.patch,
      status: v2ContentOverrides.status,
      updatedAt: v2ContentOverrides.updatedAt,
    })
    .from(v2ContentOverrides)
    .where(and(eq(v2ContentOverrides.unitSlug, unitSlug), eq(v2ContentOverrides.status, "published")));
  return rows as OverrideRow[];
}

/** The current row for one item (any status) — for the editor. */
export async function loadOverrideRow(db: Db, itemId: string): Promise<OverrideRow | null> {
  const rows = await db
    .select({
      itemId: v2ContentOverrides.itemId,
      unitSlug: v2ContentOverrides.unitSlug,
      kind: v2ContentOverrides.kind,
      patch: v2ContentOverrides.patch,
      status: v2ContentOverrides.status,
      updatedAt: v2ContentOverrides.updatedAt,
    })
    .from(v2ContentOverrides)
    .where(eq(v2ContentOverrides.itemId, itemId))
    .limit(1);
  return (rows[0] as OverrideRow) ?? null;
}

/** All overlay statuses (for the LIST view's per-unit / per-item chips). */
export async function loadOverrideStatuses(db: Db): Promise<Array<{ itemId: string; unitSlug: string; status: string }>> {
  const rows = await db
    .select({ itemId: v2ContentOverrides.itemId, unitSlug: v2ContentOverrides.unitSlug, status: v2ContentOverrides.status })
    .from(v2ContentOverrides);
  return rows;
}

/** Every override row for one unit (ANY status) — for the editor DETAIL page. */
export async function loadOverridesForUnit(db: Db, unitSlug: string): Promise<OverrideRow[]> {
  const rows = await db
    .select({
      itemId: v2ContentOverrides.itemId,
      unitSlug: v2ContentOverrides.unitSlug,
      kind: v2ContentOverrides.kind,
      patch: v2ContentOverrides.patch,
      status: v2ContentOverrides.status,
      updatedAt: v2ContentOverrides.updatedAt,
    })
    .from(v2ContentOverrides)
    .where(eq(v2ContentOverrides.unitSlug, unitSlug));
  return rows as OverrideRow[];
}

/** Revision timeline for one item, newest first. */
export async function loadRevisions(db: Db, itemId: string, limit = 25): Promise<RevisionRow[]> {
  const rows = await db
    .select({ patch: v2ContentRevisions.patch, action: v2ContentRevisions.action, actorId: v2ContentRevisions.actorId, createdAt: v2ContentRevisions.createdAt })
    .from(v2ContentRevisions)
    .where(eq(v2ContentRevisions.itemId, itemId))
    .orderBy(desc(v2ContentRevisions.createdAt))
    .limit(limit);
  return rows as RevisionRow[];
}

/**
 * Upsert a DRAFT override (the editor's Save). The `patch` MUST already have
 * passed `validatePatch` in the caller against a fresh base — this layer does
 * not re-check. Upserts on the unique `item_id` so one item has one row.
 */
export async function saveOverrideDraft(db: Db, args: { itemId: string; unitSlug: string; kind: string; patch: unknown; updatedBy: string | null }): Promise<void> {
  await db
    .insert(v2ContentOverrides)
    .values({ itemId: args.itemId, unitSlug: args.unitSlug, kind: args.kind, patch: args.patch, status: "draft", updatedBy: args.updatedBy, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: v2ContentOverrides.itemId,
      set: { patch: args.patch, kind: args.kind, unitSlug: args.unitSlug, status: "draft", foldedAt: null, updatedBy: args.updatedBy, updatedAt: new Date() },
    });
}

/**
 * Publish an override — journal-then-flip. Returns false if there is no row to
 * publish. The revision row lands FIRST (durable history), then the status is
 * flipped live; a crash between the two just leaves an orphan history row.
 */
export async function publishOverride(db: Db, args: { itemId: string; actorId: string | null }): Promise<boolean> {
  const row = await loadOverrideRow(db, args.itemId);
  if (!row) return false;
  // 1) history first
  await db.insert(v2ContentRevisions).values({ itemId: row.itemId, unitSlug: row.unitSlug, patch: row.patch, action: "publish", actorId: args.actorId });
  // 2) then flip live
  await db.update(v2ContentOverrides).set({ status: "published", updatedBy: args.actorId, updatedAt: new Date() }).where(eq(v2ContentOverrides.itemId, args.itemId));
  return true;
}

/**
 * Revert an override back to canon — journal-then-flip. Snapshots the patch
 * being removed into history, then deletes the live row (item falls back to
 * corpus + git overlay).
 */
export async function revertOverride(db: Db, args: { itemId: string; actorId: string | null }): Promise<boolean> {
  const row = await loadOverrideRow(db, args.itemId);
  if (!row) return false;
  await db.insert(v2ContentRevisions).values({ itemId: row.itemId, unitSlug: row.unitSlug, patch: row.patch, action: "revert", actorId: args.actorId });
  await db.delete(v2ContentOverrides).where(eq(v2ContentOverrides.itemId, args.itemId));
  return true;
}

/** Mark published overrides folded (after `export-studio-overrides` PR merges).
 *  Journals a 'fold' revision per item, then clears the live rows. */
export async function foldOverrides(db: Db, itemIds: string[], actorId: string | null): Promise<number> {
  let folded = 0;
  for (const itemId of itemIds) {
    const row = await loadOverrideRow(db, itemId);
    if (!row || row.status !== "published") continue;
    await db.insert(v2ContentRevisions).values({ itemId: row.itemId, unitSlug: row.unitSlug, patch: row.patch, action: "fold", actorId });
    await db.delete(v2ContentOverrides).where(eq(v2ContentOverrides.itemId, itemId));
    folded += 1;
  }
  return folded;
}
