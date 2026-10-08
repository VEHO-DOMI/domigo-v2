/** cgo-100: no automatic checkup is persisted before every exact student frame
 * has a journaled intelligence verdict. Dependencies are explicit so tests can
 * exercise the real state machine without accounts, student data or paid runs. */
import { createHash } from "node:crypto";
import { gradeCheckupCandidate, type PreparedCheckupTask } from "./checkup.ts";
import type { ContentCheckEvent, ContentCheckResult, ContentCheckTaskMeta } from "../../../packages/db/src/content-check-journal.ts";
import type { SandboxFrameResult, SandboxBatchResult } from "./studio-solve-sandbox.ts";

export function contentCheckKey(value: unknown): string {
  // jsonb may reorder object fields. Identical content must retain its claim
  // across source JSON, PostgreSQL reads, and offline imports.
  const stable = (input: unknown): unknown => Array.isArray(input) ? input.map(stable)
    : input && typeof input === "object" ? Object.fromEntries(Object.entries(input).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, child]) => [key, stable(child)])) : input;
  const hash = createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
  return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-5${hash.slice(13, 16)}-a${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
}

export function checkupTaskKey(task: PreparedCheckupTask): string {
  // Position does not affect a question's meaning once its exact pool/frame is
  // resolved. Changed wording, keys, revision, mask or direction invalidate it.
  return contentCheckKey({ protocol: "checkup-student-frame-v1", item: task.item, frame: task.frame, pool: task.pool });
}

export interface CheckupGatePorts {
  read(key: string): Promise<ContentCheckResult | null>;
  claim(key: string, meta: ContentCheckTaskMeta, retryAttemptId?: string): Promise<boolean>;
  append(key: string, event: ContentCheckEvent): Promise<void>;
  start(task: PreparedCheckupTask, remember: (sandboxId: string) => Promise<void>): Promise<void>;
  startBatch(tasks: PreparedCheckupTask[], remember: (sandboxId: string) => Promise<void>): Promise<void>;
  poll(sandboxId: string, createdAt: Date): Promise<SandboxFrameResult>;
  pollBatch(sandboxId: string, createdAt: Date): Promise<SandboxBatchResult>;
  stop(sandboxId: string): Promise<void>;
  now?: () => number;
}
export interface CheckupGateResult {
  status: "passed" | "checking" | "blocked" | "error";
  checked: number;
  total: number;
  journalHits: number;
  started: number;
  runId: string;
  errors: string[];
  blockedItemIds: string[];
}

export const CHECK_INTERRUPTED = "Prüfung konnte nicht laufen — später erneut.";

/** Claim every missing item before starting one shared environment/session.
 * Claims remain per item, so overlapping teachers never solve a revision twice.
 * A retry needs the preceding error attempt; old polls cannot replace its result. */
export async function runCheckupGate(tasks: PreparedCheckupTask[], ports: CheckupGatePorts,
  options: { single?: boolean; retryErrors?: boolean } = {}): Promise<CheckupGateResult> {
  const keys = tasks.map(checkupTaskKey);
  const result: CheckupGateResult = { status: "checking", checked: 0, total: tasks.length,
    journalHits: 0, started: 0, runId: contentCheckKey(keys), errors: [], blockedItemIds: [] };
  const initial = await Promise.all(keys.map((key) => ports.read(key)));
  const terminal = (key: string, row: ContentCheckResult, event: ContentCheckEvent) => {
    const attemptId = row.attemptId ?? key;
    return ports.append(key, { ...event, attemptId, eventId: contentCheckKey({ key, attemptId, event: "terminal" }) });
  };
  // A known rejection forbids NEW spending. Existing shared batches still
  // need their remaining answers journaled before the environment can close.
  const knownBlocked = initial.some((row) => row?.status === "blocked");
  const owned: Array<{ key: string; task: PreparedCheckupTask; row: ContentCheckResult }> = [];
  for (const [i, task] of tasks.entries()) {
    // A competing request already owns pending work; wait for its batch.
    if (knownBlocked || initial.some((entry) => entry?.status === "checking")) break;
    const key = keys[i]!;
    const row = initial[i];
    const retry = row?.status === "error";
    if (row && (!retry || options.retryErrors === false)) continue;
    if (await ports.claim(key, { itemId: task.itemId, revision: String(task.revision), unitSlug: task.unitSlug, kind: task.kind },
      retry ? row.attemptId ?? key : undefined)) {
      const claimed = await ports.read(key);
      // No paid work unless the durable attempt can be read back.
      if (claimed?.status === "checking") owned.push({ key, task, row: claimed });
    } else break;
  }
  if (owned.length) {
    result.started = 1;
    try {
      const remember = async (sandboxId: string) => {
        for (const entry of owned) await ports.append(entry.key, { status: "checking", sandboxId,
          batch: !options.single, attemptId: entry.row.attemptId ?? entry.key,
          ...(!options.single ? { batchMembers: owned.map((member) => ({ key: member.key, attemptId: member.row.attemptId ?? member.key })) } : {}) });
      };
      if (options.single) await ports.start(owned[0]!.task, remember);
      else await ports.startBatch(owned.map((entry) => entry.task), remember);
    } catch {
      for (const entry of owned) await terminal(entry.key, entry.row, { status: "error", note: CHECK_INTERRUPTED });
    }
  }
  const rows = await Promise.all(keys.map((key) => ports.read(key)));
  const groups = new Map<string, Array<{ key: string; task: PreparedCheckupTask; row: ContentCheckResult }>>();
  const stopped = new Set<string>();
  for (const [i, row] of rows.entries()) {
    if (row?.status !== "checking") continue;
    const key = keys[i]!;
    const timeout = (row.batch || !options.single ? 16 : 7) * 60_000;
    if ((ports.now?.() ?? Date.now()) - row.createdAt.getTime() > timeout) {
      await terminal(key, row, { status: "error", note: CHECK_INTERRUPTED });
      if (row.sandboxId) stopped.add(row.sandboxId);
    } else if (row.sandboxId) {
      const group = groups.get(row.sandboxId) ?? [];
      group.push({ key, task: tasks[i]!, row }); groups.set(row.sandboxId, group);
    }
  }
  for (const [sandboxId, group] of groups) {
    if (stopped.has(sandboxId)) {
      for (const entry of group) await terminal(entry.key, entry.row, { status: "error", note: CHECK_INTERRUPTED });
      continue;
    }
    const row = group[0]!.row;
    let response: SandboxFrameResult | SandboxBatchResult;
    try { response = row.batch ? await ports.pollBatch(sandboxId, row.createdAt) : await ports.poll(sandboxId, row.createdAt); }
    catch { response = { status: "error", note: CHECK_INTERRUPTED }; }
    if (response.status === "checking") continue;
    for (const entry of group) {
      const polled = response.status === "complete" && "results" in response
        ? response.results[entry.key] ?? { status: "error" as const, note: CHECK_INTERRUPTED } : response;
      if (polled.status === "checking") continue;
      if (polled.status === "error" || polled.status === "failed") {
        await terminal(entry.key, entry.row, { status: "error", note: CHECK_INTERRUPTED });
      } else if ("candidates" in polled) {
        const graded = polled.candidates.map((candidate) => ({ ...candidate, tier: gradeCheckupCandidate(entry.task, candidate.answer) }))
          .sort((a, b) => b.confidence - a.confidence);
        const top = graded[0];
        const passed = !!top && top.confidence >= 0.75 && top.tier === "correct"
          && !graded.some((c) => c.confidence >= 0.6 && c.tier !== "correct");
        await terminal(entry.key, entry.row, { status: passed ? "passed" : "blocked",
          note: passed ? undefined : "Die unabhängige Lösung passt nicht eindeutig zum Lösungsschlüssel. Item tauschen.",
          evidence: { candidates: graded, costUsd: polled.costUsd, inputTokens: polled.inputTokens, outputTokens: polled.outputTokens } });
      }
    }
    if (!row.batch) stopped.add(sandboxId);
    else if (row.batchMembers?.length) {
      // Another teacher may poll just a subset of this shared batch. Its other
      // answers must remain readable until every original attempt is settled.
      const members = await Promise.all(row.batchMembers.map(async (member) => ({ member, current: await ports.read(member.key) })));
      if (members.every(({ member, current }) => current && ((current.attemptId ?? member.key) !== member.attemptId
        || current.status === "passed" || current.status === "blocked" || current.status === "error"))) stopped.add(sandboxId);
    }
  }
  // Only release a finished environment after all of its item verdicts persist.
  for (const sandboxId of stopped) await ports.stop(sandboxId);
  const final = await Promise.all(keys.map((key) => ports.read(key)));
  let interrupted = false;
  for (const [i, row] of final.entries()) {
    if (row?.status === "passed") { result.checked++; if (initial[i]?.status === "passed") result.journalHits++; }
    else if (row?.status === "blocked") {
      result.errors.push(`${tasks[i]!.itemId}: ${row.note ?? "Prüfung nicht bestanden. Item tauschen."}`);
      result.blockedItemIds.push(tasks[i]!.itemId);
    } else if (row?.status === "error") interrupted = true;
  }
  result.status = result.blockedItemIds.length ? "blocked" : interrupted ? "error" : result.checked === result.total ? "passed" : "checking";
  if (result.status === "error") result.errors = [CHECK_INTERRUPTED];
  return result;
}

/** Runtime wiring is loaded only when the checkup route calls it. Pure gate
 * tests do not initialize the database or the sandbox client. */
export async function checkAssignmentCheckup(
  draft: import("@domigo/db").AssignmentDraft,
  access: import("../../../packages/db/src/content-check-journal.ts").ContentCheckAccess,
  options: { compositionId?: string; alsoCheck?: boolean },
): Promise<CheckupGateResult> {
  const [{ getDb, loadPublishedDrafts, loadPublishedOverrides }, journal, loader, checkup] = await Promise.all([
    import("@domigo/db"), import("../../../packages/db/src/content-check-journal.ts"),
    import("@domigo/content-loader"), import("./checkup.ts"),
  ]);
  const db = getDb();
  const blocked = (errors: string[]): CheckupGateResult => ({ status: "blocked", checked: 0, total: draft.sections.reduce((n, s) => n + s.itemIds.length, 0),
    journalHits: 0, started: 0, runId: "", errors, blockedItemIds: [] });
  if (!options.compositionId) return blocked(["Die Zusammenstellung hat keine bestätigte Herkunft. Öffne einen neuen Checkup."]);
  const origin = await journal.readCheckupComposition(db, access, options.compositionId);
  if (!origin) return blocked(["Die Zusammenstellung gehört nicht zu dieser Lehrkraft und Klasse."]);
  const automatic = origin.automatic;
  const readUnits = async () => {
  const units = new Map<string, import("@domigo/content-loader").UnitContent>();
  for (const id of draft.sections.flatMap((s) => s.itemIds)) {
    const match = /^(g[1-4])u(\d{2})\./.exec(id);
    if (!match) throw new Error("Aufgabe nicht gefunden.");
    const slug = `${match[1]}-u${match[2]}`;
    if (units.has(slug)) continue;
    const base = loader.loadUnit(slug);
    // Same layers as the student display, but errors MUST block publication.
    const overrides = await loadPublishedOverrides(db, slug);
    const drafts = await loadPublishedDrafts(db, slug);
    const byId = new Map(overrides.map((r) => [r.itemId, r]));
    const overlay = <T extends import("@domigo/content-schema").VocabItem | import("@domigo/content-schema").GrammarItem>(kind: "vocab" | "grammar", item: T): T => {
      const row = byId.get(item.id);
      return row && row.kind === kind ? loader.applyStudioOverlay(kind, item, loader.normalizePatchColumn(row.patch) as import("@domigo/content-loader").ItemPatch) : item;
    };
    const merged = loader.mergeDrafts(base.vocab.map((v) => overlay("vocab", v)), base.grammar.map((g) => overlay("grammar", g)), drafts.map((d) => ({
      itemId: d.itemId, kind: d.kind, action: d.action, item: d.action === "remove" ? null : loader.normalizePatchColumn(d.item) as import("@domigo/content-loader").DraftApply["item"],
    })));
    units.set(slug, { ...base, ...merged });
  }
  return units;
  };
  const sections: import("./checkup.ts").ComposedCheckupSection[] = [];
  for (const section of draft.sections) {
    if ((section.kind !== "vocab" && section.kind !== "grammar") || !section.sectionConfig) return blocked(["Checkup-Abschnitt ist nicht prüfbar."]);
    sections.push({ position: section.position, kind: section.kind, itemIds: section.itemIds, sectionConfig: section.sectionConfig });
  }
  const prepared = checkup.prepareCheckupTasks(sections, await readUnits());
  if (!prepared.ok) return blocked(prepared.errors);
  const result: CheckupGateResult = !automatic && !options.alsoCheck
    ? { status: "passed", checked: prepared.tasks.length, total: prepared.tasks.length,
      journalHits: 0, started: 0, runId: "", errors: [], blockedItemIds: [] }
    : await runCheckupGate(prepared.tasks, await sandboxGatePorts(access));
  if (result.status !== "passed") return result;
  // Publication rereads the current display after asynchronous model/journal
  // work. An observed concurrent Studio change sends the new bytes back through
  // the gate on the next poll; the old verdict cannot release that change.
  const latest = checkup.prepareCheckupTasks(sections, await readUnits());
  if (!latest.ok) return blocked(latest.errors);
  const before = prepared.tasks.map(checkupTaskKey);
  const after = latest.tasks.map(checkupTaskKey);
  if (JSON.stringify(before) !== JSON.stringify(after)) return { ...result, status: "checking", checked: 0, runId: contentCheckKey(after) };
  return result;
}

export async function recordAutomaticCheckup(
  access: import("../../../packages/db/src/content-check-journal.ts").ContentCheckAccess,
  composition: import("../../../packages/db/src/content-check-journal.ts").CheckupComposition,
  compositionId: string,
): Promise<string> {
  const [{ getDb }, { recordCheckupComposition }] = await Promise.all([import("@domigo/db"), import("../../../packages/db/src/content-check-journal.ts")]);
  await recordCheckupComposition(getDb(), access, compositionId, composition);
  return compositionId;
}

export async function sandboxGatePorts(access: import("../../../packages/db/src/content-check-journal.ts").ContentCheckAccess): Promise<CheckupGatePorts> {
  const [{ getDb }, journal, sandbox, models] = await Promise.all([import("@domigo/db"), import("../../../packages/db/src/content-check-journal.ts"), import("./studio-solve-sandbox.ts"), import("./studio-solver-models.ts")]);
  const db = getDb();
  return {
    read: (key) => journal.readContentCheck(db, access, key),
    claim: (key, meta, retryAttemptId) => journal.claimContentCheck(db, access, key, meta, retryAttemptId),
    append: (key, event) => journal.appendContentCheck(db, access, key, { ...event,
      evidence: { ...(event.evidence && typeof event.evidence === "object" ? event.evidence : {}), model: models.DEFAULT_STUDIO_SOLVER_MODEL, thinking: "adaptive", revisionKey: key } }),
    start: (task, remember) => sandbox.startSandboxFrame({ ...task, model: models.DEFAULT_STUDIO_SOLVER_MODEL }, remember),
    startBatch: (tasks, remember) => sandbox.startSandboxBatch(tasks.map((task) => ({ ...task, key: checkupTaskKey(task), model: models.DEFAULT_STUDIO_SOLVER_MODEL })), remember),
    poll: sandbox.pollSandboxFrame, pollBatch: sandbox.pollSandboxBatch, stop: sandbox.stopSandboxFrame,
  };
}

export async function beginManualCheckup(access: import("../../../packages/db/src/content-check-journal.ts").ContentCheckAccess): Promise<string> {
  const [{ getDb }, { beginCheckupWorkflow }] = await Promise.all([import("@domigo/db"), import("../../../packages/db/src/content-check-journal.ts")]);
  return beginCheckupWorkflow(getDb(), access);
}
