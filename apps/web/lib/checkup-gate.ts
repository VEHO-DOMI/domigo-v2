/** cgo-100: no automatic checkup is persisted before every exact student frame
 * has a journaled intelligence verdict. Dependencies are explicit so tests can
 * exercise the real state machine without accounts, student data or paid runs. */
import { createHash } from "node:crypto";
import { gradeCheckupCandidate, type PreparedCheckupTask } from "./checkup.ts";
import type { ContentCheckEvent, ContentCheckResult, ContentCheckTaskMeta } from "../../../packages/db/src/content-check-journal.ts";
import type { SandboxFrameResult } from "./studio-solve-sandbox.ts";

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
  claim(key: string, meta: ContentCheckTaskMeta): Promise<boolean>;
  append(key: string, event: ContentCheckEvent): Promise<void>;
  start(task: PreparedCheckupTask, remember: (sandboxId: string) => Promise<void>): Promise<void>;
  poll(sandboxId: string, createdAt: Date): Promise<SandboxFrameResult>;
  stop(sandboxId: string): Promise<void>;
  now?: () => number;
}
export interface CheckupGateResult {
  status: "passed" | "checking" | "blocked";
  checked: number;
  total: number;
  journalHits: number;
  started: number;
  runId: string;
  errors: string[];
  blockedItemIds: string[];
}

/** At most one new sandbox setup per request keeps the server's 60s budget.
 * Polling rechecks ALL journal rows; losing a concurrent claim never starts a
 * second run. Errors remain terminal for this revision, including setup errors. */
export async function runCheckupGate(tasks: PreparedCheckupTask[], ports: CheckupGatePorts): Promise<CheckupGateResult> {
  const keys = tasks.map(checkupTaskKey);
  const result: CheckupGateResult = { status: "checking", checked: 0, total: tasks.length,
    journalHits: 0, started: 0, runId: contentCheckKey(keys), errors: [], blockedItemIds: [] };
  const terminal = async (key: string, event: ContentCheckEvent) => ports.append(key, {
    ...event, eventId: contentCheckKey({ key, event: "terminal" }),
  });
  const initial = await Promise.all(keys.map((key) => ports.read(key)));
  // Known failures block before any other item can incur a new run.
  for (const [i, row] of initial.entries()) {
    if (row?.status === "blocked" || row?.status === "failed") {
      result.errors.push(`${tasks[i]!.itemId}: ${row.note ?? "Prüfung nicht bestanden. Item tauschen."}`);
      result.blockedItemIds.push(tasks[i]!.itemId);
    }
  }
  if (result.errors.length) return { ...result, status: "blocked" };
  for (const [i, task] of tasks.entries()) {
    const key = keys[i]!;
    let row = initial[i];
    if (row?.status === "passed") { result.checked++; result.journalHits++; continue; }
    if (!row) {
      if (result.started > 0) continue;
      if (await ports.claim(key, { itemId: task.itemId, revision: String(task.revision), unitSlug: task.unitSlug, kind: task.kind })) {
        result.started++;
        try {
          await ports.start(task, (sandboxId) => ports.append(key, { status: "checking", sandboxId }));
        } catch {
          await terminal(key, { status: "failed", note: "Die Sandbox-Prüfung konnte nicht gestartet werden. Item tauschen oder den Betrieb prüfen lassen." });
        }
      }
      row = await ports.read(key);
      // A durable claim exists before launch. A missing read is NOT a pass.
      if (!row) continue;
    }
    if (row.status === "checking") {
      if ((ports.now?.() ?? Date.now()) - row.createdAt.getTime() > 7 * 60_000) {
        await terminal(key, { status: "failed", note: "Die Prüfung hat das Zeitlimit erreicht. Für diese Fassung wird kein zweiter Lauf gestartet." });
        if (row.sandboxId) await ports.stop(row.sandboxId);
        row = await ports.read(key);
      } else if (row.sandboxId) {
        const polled = await ports.poll(row.sandboxId, row.createdAt);
        if (polled.status !== "checking") {
          if (polled.status === "failed") await terminal(key, polled);
          else {
            const graded = polled.candidates.map((candidate) => ({ ...candidate, tier: gradeCheckupCandidate(task, candidate.answer) }))
              .sort((a, b) => b.confidence - a.confidence);
            const top = graded[0];
            // High-confidence wrong alternatives also signal ambiguous/missing
            // keys; a weak top answer is not evidence of a successful solve.
            const passed = !!top && top.confidence >= 0.75 && top.tier === "correct"
              && !graded.some((c) => c.confidence >= 0.6 && c.tier !== "correct");
            await terminal(key, { status: passed ? "passed" : "blocked",
              note: passed ? undefined : "Die unabhängige Lösung passt nicht eindeutig zum Lösungsschlüssel. Item tauschen.",
              evidence: { candidates: graded, costUsd: polled.costUsd, inputTokens: polled.inputTokens, outputTokens: polled.outputTokens } });
          }
          await ports.stop(row.sandboxId);
          row = await ports.read(key);
        }
      }
    }
    if (row?.status === "passed") result.checked++;
    else if (row?.status === "blocked" || row?.status === "failed") {
      result.errors.push(`${task.itemId}: ${row.note ?? "Prüfung nicht bestanden. Item tauschen."}`);
      result.blockedItemIds.push(task.itemId);
      break;
    }
  }
  result.status = result.errors.length ? "blocked" : result.checked === result.total ? "passed" : "checking";
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
    claim: (key, meta) => journal.claimContentCheck(db, access, key, meta),
    append: (key, event) => journal.appendContentCheck(db, access, key, { ...event,
      evidence: { ...(event.evidence && typeof event.evidence === "object" ? event.evidence : {}), model: models.DEFAULT_STUDIO_SOLVER_MODEL, thinking: "adaptive", revisionKey: key } }),
    start: (task, remember) => sandbox.startSandboxFrame({ ...task, model: models.DEFAULT_STUDIO_SOLVER_MODEL }, remember),
    poll: sandbox.pollSandboxFrame, stop: sandbox.stopSandboxFrame,
  };
}

export async function beginManualCheckup(access: import("../../../packages/db/src/content-check-journal.ts").ContentCheckAccess): Promise<string> {
  const [{ getDb }, { beginCheckupWorkflow }] = await Promise.all([import("@domigo/db"), import("../../../packages/db/src/content-check-journal.ts")]);
  return beginCheckupWorkflow(getDb(), access);
}
