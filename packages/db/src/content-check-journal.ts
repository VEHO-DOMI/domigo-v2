/**
 * cgo-100 · Durable checkup claims and verdicts in the existing append-only
 * content_checks journal. No new table or column is needed: draft_id has no
 * foreign key (migration 0010), and the existing primary key arbitrates claims.
 *
 * A claim belongs to the exact content revision/student frame, not a teacher.
 * Sharing its sanitized result avoids paying twice for the same content. Every
 * operation still requires an authorized class; composition history remains
 * private to the teacher and class that requested it. These are server APIs:
 * callers derive access from identity, never from request-body claims.
 */
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { createHash } from "node:crypto";
import type { Db } from "./index.ts";
import { v2ContentChecks, v2ContentDrafts } from "./schema.ts";
import { assertWritableScope, inScope, type ClassScope } from "./scope.ts";

export interface ContentCheckAccess {
  scope: ClassScope;
  classId: string;
  teacherId: string;
}

export type ContentCheckStatus = "checking" | "passed" | "blocked" | "error";

export interface ContentCheckResult {
  status: ContentCheckStatus;
  /** Internal polling handle; never return it with the journal's actor data. */
  sandboxId?: string;
  batch?: boolean;
  batchMembers?: Array<{ key: string; attemptId: string }>;
  /** A retry has its own durable identity; old polls cannot finish a new run. */
  attemptId?: string;
  attemptNumber?: number;
  note?: string;
  createdAt: Date;
}

export interface ContentCheckTaskMeta {
  itemId: string;
  revision: string;
  unitSlug: string;
  kind: "vocab" | "grammar";
}

export interface ContentCheckEvent {
  status: ContentCheckStatus;
  sandboxId?: string;
  batch?: boolean;
  batchMembers?: Array<{ key: string; attemptId: string }>;
  /** Omitted only by legacy callers, whose events belong to the initial claim. */
  attemptId?: string;
  note?: string;
  evidence?: unknown;
  /** A deterministic completion UUID makes repeated polls append only once. */
  eventId?: string;
}

export interface CheckupComposition {
  unitSlug: string;
  seed: string;
  itemIds: string[];
}

function guard(access: ContentCheckAccess, operation: string): void {
  assertWritableScope(access.scope, operation);
  if (!inScope(access.scope, access.classId) || !access.teacherId.trim()) {
    throw new Error(`[@domigo/db] ${operation}: refused — class outside scope or missing teacher`);
  }
}

function object(value: unknown): Record<string, unknown> {
  if (typeof value === "string") {
    try { value = JSON.parse(value); }
    catch { return {}; }
  }
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : {};
}

function nextAttemptId(key: string, previousAttemptId: string): string {
  const hex = createHash("sha256").update(`content-check-attempt:${key}:${previousAttemptId}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}

function readBatchMembers(value: unknown): Array<{ key: string; attemptId: string }> | undefined {
  const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) return undefined;
  const members: Array<{ key: string; attemptId: string }> = [];
  for (const entry of value) {
    if (entry === null || typeof entry !== "object" || Array.isArray(entry)) return undefined;
    const member = object(entry);
    if (typeof member.key !== "string" || !uuid.test(member.key)
      || typeof member.attemptId !== "string" || !uuid.test(member.attemptId)) return undefined;
    members.push({ key: member.key, attemptId: member.attemptId });
  }
  return members;
}

/** Each attempt has one exclusive permission to start a run. Infrastructure
 * errors may be retried explicitly; a model verdict may not. All contenders
 * for the same retry derive the same primary key, so only one insert wins. */
export async function claimContentCheck(
  db: Db, access: ContentCheckAccess, key: string, task: ContentCheckTaskMeta,
  retryAttemptId?: string,
): Promise<boolean> {
  guard(access, "claimContentCheck");
  let attemptId = key;
  let attemptNumber = 1;
  if (retryAttemptId !== undefined) {
    const previous = await readContentCheck(db, access, key);
    if (previous?.status !== "error" || previous.attemptId !== retryAttemptId) return false;
    attemptId = nextAttemptId(key, retryAttemptId);
    attemptNumber = (previous.attemptNumber ?? 1) + 1;
  }
  const rows = await db.insert(v2ContentChecks).values({
    id: attemptId, draftId: key, checkKind: "checkup_claim", verdict: "checking",
    evidence: { ...task, teacherId: access.teacherId, classId: access.classId,
      attemptNumber, ...(retryAttemptId !== undefined ? { parentAttemptId: retryAttemptId } : {}) },
  }).onConflictDoNothing({ target: v2ContentChecks.id }).returning({ id: v2ContentChecks.id });
  return rows.length === 1;
}

/** Content-level read: only safe status fields leave this function. Neither an
 * old deterministic check nor a claim can masquerade as a sandbox verdict. */
export async function readContentCheck(
  db: Db, access: ContentCheckAccess, key: string,
): Promise<ContentCheckResult | null> {
  guard(access, "readContentCheck");
  const rows = await db.select({
    id: v2ContentChecks.id, checkKind: v2ContentChecks.checkKind,
    verdict: v2ContentChecks.verdict, evidence: v2ContentChecks.evidence,
    createdAt: v2ContentChecks.createdAt,
  }).from(v2ContentChecks).where(eq(v2ContentChecks.draftId, key))
    .orderBy(desc(v2ContentChecks.createdAt), desc(v2ContentChecks.id));
  const initialClaim = rows.find((row) => row.id === key && row.checkKind === "checkup_claim");
  if (!initialClaim) return null;
  let claim: typeof rows[number] = initialClaim;
  // Follow the unique successor chain from the original claim. Arrival times
  // and late verdicts cannot select an older attempt or an unrelated claim.
  let attemptNumber = 1;
  for (;;) {
    const parentAttemptId: string = claim.id;
    const expectedId = nextAttemptId(key, parentAttemptId);
    const nextClaim = rows.find((row) => row.id === expectedId && row.checkKind === "checkup_claim"
      && object(row.evidence).parentAttemptId === parentAttemptId
      && object(row.evidence).attemptNumber === attemptNumber + 1);
    if (!nextClaim) break;
    claim = nextClaim;
    attemptNumber++;
  }
  const sandboxRows = rows.filter((row) => row.checkKind === "checkup_sandbox"
    && object(row.evidence).path === "sandbox/blind-solve"
    && (object(row.evidence).attemptId ?? key) === claim.id);
  // A late in-flight append cannot turn a recorded terminal verdict back into
  // checking. Among terminal verdicts the newest wins (the SQL order above).
  const terminal = sandboxRows.find((row) => row.verdict === "passed" || row.verdict === "blocked")
    ?? sandboxRows.find((row) => row.verdict === "error" || row.verdict === "failed");
  const row = terminal ?? sandboxRows.find((entry) => entry.verdict === "checking") ?? claim;
  const evidence = object(row.evidence);
  const batchMembers = !terminal && row !== claim ? readBatchMembers(evidence.batchMembers) : undefined;
  return {
    status: terminal ? (terminal.verdict === "failed" ? "error" : terminal.verdict as ContentCheckStatus) : "checking",
    ...(row !== claim && typeof evidence.sandboxId === "string" ? { sandboxId: evidence.sandboxId } : {}),
    ...(row !== claim && typeof evidence.batch === "boolean" ? { batch: evidence.batch } : {}),
    ...(batchMembers ? { batchMembers } : {}),
    ...(row !== claim && typeof evidence.note === "string" ? { note: evidence.note } : {}),
    attemptId: claim.id, attemptNumber, createdAt: claim.createdAt,
  };
}

/** Append before any publication. Nested evidence cannot replace the protected
 * path, actor, attempt or status fields. A failed write propagates to block publication. */
export async function appendContentCheck(
  db: Db, access: ContentCheckAccess, key: string, event: ContentCheckEvent,
): Promise<void> {
  guard(access, "appendContentCheck");
  await db.insert(v2ContentChecks).values({
    id: event.eventId ?? crypto.randomUUID(), draftId: key,
    checkKind: "checkup_sandbox", verdict: event.status,
    evidence: {
      path: "sandbox/blind-solve", actor: access.teacherId, classId: access.classId,
      attemptId: event.attemptId ?? key,
      ...(event.sandboxId ? { sandboxId: event.sandboxId } : {}),
      ...(event.batch !== undefined ? { batch: event.batch } : {}),
      ...(event.batchMembers !== undefined ? { batchMembers: event.batchMembers } : {}),
      ...(event.note ? { note: event.note } : {}),
      ...(event.evidence !== undefined ? { detail: event.evidence } : {}),
    },
  }).onConflictDoNothing({ target: v2ContentChecks.id });
}

function workflowOwner(access: ContentCheckAccess) {
  return and(
    sql`${v2ContentChecks.evidence}->>'actor' = ${access.teacherId}`,
    sql`${v2ContentChecks.evidence}->>'classId' = ${access.classId}`,
  );
}

async function ownsCheckupWorkflow(db: Db, access: ContentCheckAccess, workflowId: string): Promise<boolean> {
  const rows = await db.select({ evidence: v2ContentChecks.evidence }).from(v2ContentChecks)
    .where(and(eq(v2ContentChecks.id, workflowId), eq(v2ContentChecks.draftId, workflowId),
      eq(v2ContentChecks.checkKind, "checkup_workflow"), eq(v2ContentChecks.verdict, "manual"), workflowOwner(access))).limit(1);
  const evidence = object(rows[0]?.evidence);
  return evidence.actor === access.teacherId && evidence.classId === access.classId;
}

/** Every builder starts with a server-issued workflow, including manual work.
 * Automatic provenance belongs to this workflow, never to its item history. */
export async function beginCheckupWorkflow(db: Db, access: ContentCheckAccess): Promise<string> {
  guard(access, "beginCheckupWorkflow");
  const workflowId = crypto.randomUUID();
  const rows = await db.insert(v2ContentChecks).values({
    id: workflowId, draftId: workflowId, checkKind: "checkup_workflow", verdict: "manual",
    evidence: { actor: access.teacherId, classId: access.classId },
  }).onConflictDoNothing({ target: v2ContentChecks.id }).returning({ id: v2ContentChecks.id });
  if (rows.length !== 1) throw new Error("[@domigo/db] beginCheckupWorkflow: workflow could not be recorded");
  return workflowId;
}

/** Append automatic provenance only to an existing workflow owned by the same
 * teacher/class. Further saves or item swaps never reset it to manual. */
export async function recordCheckupComposition(
  db: Db, access: ContentCheckAccess, workflowId: string, composition: CheckupComposition,
): Promise<void> {
  guard(access, "recordCheckupComposition");
  if (!await ownsCheckupWorkflow(db, access, workflowId)) {
    throw new Error("[@domigo/db] recordCheckupComposition: refused — workflow not owned by this teacher and class");
  }
  await db.insert(v2ContentChecks).values({
    id: crypto.randomUUID(), draftId: workflowId, checkKind: "checkup_composition", verdict: "composed",
    evidence: { ...composition, actor: access.teacherId, classId: access.classId },
  }).onConflictDoNothing({ target: v2ContentChecks.id });
}

export async function readCheckupComposition(
  db: Db, access: ContentCheckAccess, workflowId: string,
): Promise<(CheckupComposition & { automatic: boolean }) | null> {
  guard(access, "readCheckupComposition");
  if (!await ownsCheckupWorkflow(db, access, workflowId)) return null;
  const rows = await db.select({ evidence: v2ContentChecks.evidence }).from(v2ContentChecks)
    .where(and(eq(v2ContentChecks.draftId, workflowId), eq(v2ContentChecks.checkKind, "checkup_composition"),
      eq(v2ContentChecks.verdict, "composed"), workflowOwner(access)))
    .orderBy(desc(v2ContentChecks.createdAt), desc(v2ContentChecks.id)).limit(1);
  if (rows.length === 0) return { unitSlug: "", seed: "", itemIds: [], automatic: false };
  const evidence = object(rows[0]?.evidence);
  // Defensive shape check also makes legacy/malformed journal rows fail closed.
  if (evidence.actor !== access.teacherId || evidence.classId !== access.classId
    || typeof evidence.unitSlug !== "string" || typeof evidence.seed !== "string"
    || !Array.isArray(evidence.itemIds) || !evidence.itemIds.every((id) => typeof id === "string")) return null;
  return { unitSlug: evidence.unitSlug, seed: evidence.seed, itemIds: evidence.itemIds, automatic: true };
}

/** Studio uses the same journal claim wall. These atomic draft transitions
 * prevent a save racing a verdict from publishing different, untested bytes. */
export async function loadCheckedStudioDraft(db: Db, access: ContentCheckAccess, itemId: string) {
  guard(access, "loadCheckedStudioDraft");
  const rows = await db.select().from(v2ContentDrafts).where(and(eq(v2ContentDrafts.itemId, itemId), eq(v2ContentDrafts.updatedBy, access.teacherId))).limit(1);
  return rows[0] ?? null;
}

export async function saveCheckedStudioDraft(db: Db, access: ContentCheckAccess, draft: {
  itemId: string; unitSlug: string; kind: string; item: unknown; action: "create" | "replace" | "remove";
}, expectedDraftId?: string): Promise<boolean> {
  guard(access, "saveCheckedStudioDraft");
  const values = { ...draft, item: draft.item ?? {}, updatedBy: access.teacherId, updatedAt: new Date(), status: "draft" };
  const rows = expectedDraftId
    ? await db.update(v2ContentDrafts).set(values).where(and(
      eq(v2ContentDrafts.id, expectedDraftId), eq(v2ContentDrafts.itemId, draft.itemId),
      eq(v2ContentDrafts.updatedBy, access.teacherId), ne(v2ContentDrafts.status, "checking"),
    )).returning({ id: v2ContentDrafts.id })
    : await db.insert(v2ContentDrafts).values(values).onConflictDoNothing({ target: v2ContentDrafts.itemId }).returning({ id: v2ContentDrafts.id });
  return rows.length === 1;
}

export async function setCheckedStudioStatus(db: Db, access: ContentCheckAccess, itemId: string, expectedItem: unknown,
  status: "checking" | "check_failed" | "published"): Promise<boolean> {
  guard(access, "setCheckedStudioStatus");
  const rows = await db.update(v2ContentDrafts).set({ status, updatedAt: new Date() }).where(and(
    eq(v2ContentDrafts.itemId, itemId), eq(v2ContentDrafts.updatedBy, access.teacherId),
    sql`${v2ContentDrafts.item} = ${JSON.stringify(expectedItem)}::jsonb`,
  )).returning({ id: v2ContentDrafts.id });
  return rows.length === 1;
}

export async function loadCheckedStudioDraftsForUnit(db: Db, access: ContentCheckAccess, unitSlug: string) {
  guard(access, "loadCheckedStudioDraftsForUnit");
  return db.select().from(v2ContentDrafts).where(and(eq(v2ContentDrafts.unitSlug, unitSlug), eq(v2ContentDrafts.updatedBy, access.teacherId)));
}

export async function deleteCheckedStudioDraft(db: Db, access: ContentCheckAccess, itemId: string, draftId: string): Promise<boolean> {
  guard(access, "deleteCheckedStudioDraft");
  const rows = await db.delete(v2ContentDrafts).where(and(eq(v2ContentDrafts.itemId, itemId), eq(v2ContentDrafts.id, draftId),
    eq(v2ContentDrafts.updatedBy, access.teacherId), ne(v2ContentDrafts.status, "checking"))).returning({ id: v2ContentDrafts.id });
  return rows.length === 1;
}
