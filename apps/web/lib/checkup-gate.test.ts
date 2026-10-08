/** cgo-100: exercise the actual asynchronous gate with real prepared tasks,
 * an in-memory journal and protocol-shaped sandbox replies. No DB/accounts. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vocabAnswers } from "@domigo/engine";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ContentCheckEvent, ContentCheckResult, ContentCheckTaskMeta } from "../../../packages/db/src/content-check-journal.ts";
import type { SandboxFrameResult } from "./studio-solve-sandbox.ts";
import { composeCheckup, prepareCheckupTasks, type PreparedCheckupTask } from "./checkup.ts";
import { checkupTaskKey, runCheckupGate, type CheckupGatePorts } from "./checkup-gate.ts";

const CLOCK = Date.UTC(2026, 9, 8, 10);
const composed = composeCheckup("g2-u03", 2, "cgo-100-gate-fixture");
assert.ok(composed.ok);
const prepared = prepareCheckupTasks(composed.sections);
assert.ok(prepared.ok);
const tasks = prepared.tasks;
const first = tasks[0]!;

function fullAnswer(task: PreparedCheckupTask): string {
  const answers = task.kind === "vocab" ? vocabAnswers(task.item as VocabItem, task.pool!) : (task.item as GrammarItem).answers;
  return answers.find((answer) => answer.tier === "full")!.text;
}

function complete(candidates: Array<{ answer: string; confidence: number }>): SandboxFrameResult {
  return { status: "complete", candidates, costUsd: null, inputTokens: 37, outputTokens: 11 };
}

function memory() {
  const rows = new Map<string, ContentCheckResult>();
  const starts: PreparedCheckupTask[] = [];
  const claims: Array<{ key: string; meta: ContentCheckTaskMeta }> = [];
  const events: Array<{ key: string; event: ContentCheckEvent }> = [];
  const eventIds = new Set<string>();
  const stops: string[] = [];
  const polls: string[] = [];
  const sequence: string[] = [];
  const replies = new Map<string, SandboxFrameResult>();
  const ports: CheckupGatePorts = {
    now: () => CLOCK,
    async read(key) { const row = rows.get(key); return row ? { ...row } : null; },
    async claim(key, meta) {
      if (rows.has(key)) return false;
      claims.push({ key, meta });
      sequence.push("claim");
      rows.set(key, { status: "checking", createdAt: new Date(CLOCK) });
      return true;
    },
    async append(key, event) {
      if (event.eventId && eventIds.has(event.eventId)) return;
      if (event.eventId) eventIds.add(event.eventId);
      events.push({ key, event });
      sequence.push(`append:${event.status}`);
      const row = rows.get(key);
      if (row?.status !== "checking") return;
      rows.set(key, { status: event.status, createdAt: row.createdAt,
        ...(event.sandboxId ? { sandboxId: event.sandboxId } : {}),
        ...(event.note ? { note: event.note } : {}),
      });
    },
    async start(task, remember) {
      starts.push(task);
      sequence.push("start");
      await remember(`stub-${checkupTaskKey(task)}`);
    },
    async poll(id) { polls.push(id); sequence.push("poll"); return replies.get(id) ?? { status: "checking" }; },
    async stop(id) { stops.push(id); sequence.push("stop"); },
  };
  function seed(task: PreparedCheckupTask, status: ContentCheckResult["status"], options: Partial<ContentCheckResult> = {}) {
    rows.set(checkupTaskKey(task), { status, createdAt: new Date(CLOCK), ...options });
  }
  function answer(task: PreparedCheckupTask, reply: SandboxFrameResult) {
    const id = `stub-${checkupTaskKey(task)}`;
    seed(task, "checking", { sandboxId: id });
    replies.set(id, reply);
    return id;
  }
  return { ports, rows, starts, claims, events, stops, polls, sequence, replies, seed, answer };
}

describe("runCheckupGate — paid-run and publication contracts", () => {
  it("without journal hits returns checking and starts at most one item per request", async () => {
    const m = memory();
    const result = await runCheckupGate(tasks, m.ports);
    assert.equal(result.status, "checking");
    assert.equal(result.checked, 0);
    assert.equal(result.total, 20);
    assert.equal(result.journalHits, 0);
    assert.equal(result.started, 1);
    assert.equal(m.starts.length, 1);
    assert.deepEqual(m.sequence.slice(0, 3), ["claim", "start", "append:checking"]);
    assert.deepEqual(m.claims[0]!.meta, { itemId: first.itemId, revision: String(first.revision), unitSlug: first.unitSlug, kind: first.kind });
    assert.ok(result.runId);
    assert.deepEqual(result.errors, []);
  });

  it("all passed journal hits publish immediately without claims, starts or polls", async () => {
    const m = memory();
    for (const task of tasks) m.seed(task, "passed");
    const result = await runCheckupGate(tasks, m.ports);
    assert.equal(result.status, "passed");
    assert.equal(result.checked, 20);
    assert.equal(result.journalHits, 20);
    assert.equal(result.started, 0);
    assert.deepEqual(m.claims, []);
    assert.deepEqual(m.starts, []);
    assert.deepEqual(m.polls, []);
  });

  it("a passed subset advances n/m but never publishes the incomplete sheet", async () => {
    const m = memory();
    tasks.slice(0, 19).forEach((task) => m.seed(task, "passed"));
    const result = await runCheckupGate(tasks, m.ports);
    assert.equal(result.status, "checking");
    assert.equal(result.checked, 19);
    assert.equal(result.total, 20);
    assert.equal(result.journalHits, 19);
    assert.equal(result.started, 1);
    assert.equal(m.starts[0]!.itemId, tasks[19]!.itemId);
  });

  it("stored blocked or failed verdicts block with a reason and never restart", async () => {
    for (const status of ["blocked", "failed"] as const) {
      const m = memory();
      m.seed(first, status, { note: "Absichtlich nicht bestanden." });
      for (let retry = 0; retry < 2; retry++) {
        const result = await runCheckupGate([first], m.ports);
        assert.equal(result.status, "blocked");
        assert.deepEqual(result.blockedItemIds, [first.itemId]);
        assert.match(result.errors.join(" "), /Absichtlich nicht bestanden/);
        assert.equal(result.checked, 0);
      }
      assert.equal(m.starts.length, 0);
      assert.equal(m.claims.length, 0);
    }
  });

  it("a confident correct solve is durably journaled before stopping and becomes a free hit", async () => {
    const m = memory();
    const id = m.answer(first, complete([{ answer: fullAnswer(first), confidence: 0.99 }]));
    const result = await runCheckupGate([first], m.ports);
    assert.equal(result.status, "passed");
    assert.equal(result.checked, 1);
    assert.equal(result.journalHits, 0);
    assert.deepEqual(m.sequence, ["poll", "append:passed", "stop"]);
    assert.deepEqual(m.stops, [id]);
    const event = m.events[0]!.event;
    assert.ok(event.eventId, "terminal event has a stable deduplication key");
    assert.deepEqual(event.evidence, { candidates: [{ answer: fullAnswer(first), confidence: 0.99, tier: "correct" }], costUsd: null, inputTokens: 37, outputTokens: 11 });
    const again = await runCheckupGate([first], m.ports);
    assert.equal(again.status, "passed");
    assert.equal(again.journalHits, 1);
    assert.equal(m.polls.length, 1);
    assert.equal(m.events.length, 1);
    assert.equal(m.starts.length, 0);
  });

  it("confident wrong, low-confidence and ambiguous candidates each block", async () => {
    const scenarios = [
      [{ answer: "zzzz definitely not a keyed answer zzzz", confidence: 0.99 }],
      [{ answer: fullAnswer(first), confidence: 0.74 }],
      [{ answer: fullAnswer(first), confidence: 0.99 }, { answer: "zzzz definitely not a keyed answer zzzz", confidence: 0.6 }],
      [],
    ];
    for (const candidates of scenarios) {
      const m = memory();
      m.answer(first, complete(candidates));
      const result = await runCheckupGate([first], m.ports);
      assert.equal(result.status, "blocked", JSON.stringify(candidates));
      assert.equal(result.checked, 0);
      assert.deepEqual(result.blockedItemIds, [first.itemId]);
      assert.match(result.errors.join(" "), /Lösungsschlüssel/);
      assert.equal(m.events[0]!.event.status, "blocked");
      assert.equal(m.stops.length, 1);
    }
  });

  it("grades grammar and translated vocabulary in their actual frame and pool", async () => {
    const specimens = [tasks.find((task) => task.kind === "grammar")!, tasks.find((task) => task.pool === "enToDe")!];
    for (const task of specimens) {
      assert.ok(task);
      const m = memory();
      m.answer(task, complete([{ answer: fullAnswer(task), confidence: 0.99 }]));
      const result = await runCheckupGate([task], m.ports);
      assert.equal(result.status, "passed", `${task.kind}/${task.pool}`);
    }
  });

  it("repeated requests for a running item never launch it twice", async () => {
    const m = memory();
    const a = await runCheckupGate([first], m.ports);
    const b = await runCheckupGate([first], m.ports);
    const c = await runCheckupGate([first], m.ports);
    assert.deepEqual([a.status, b.status, c.status], ["checking", "checking", "checking"]);
    assert.equal(a.runId, b.runId);
    assert.equal(b.runId, c.runId);
    assert.equal(m.starts.length, 1);
    assert.equal(m.claims.length, 1);
  });

  it("concurrent requests share the durable claim and launch exactly once", async () => {
    const m = memory();
    const results = await Promise.all(Array.from({ length: 8 }, () => runCheckupGate([first], m.ports)));
    assert.ok(results.every((result) => result.status === "checking"));
    assert.equal(results.reduce((n, result) => n + result.started, 0), 1);
    assert.equal(m.starts.length, 1);
    assert.equal(m.claims.length, 1);
  });

  it("concurrent completed polls append one stable terminal event", async () => {
    const m = memory();
    m.answer(first, complete([{ answer: fullAnswer(first), confidence: 0.99 }]));
    const results = await Promise.all(Array.from({ length: 5 }, () => runCheckupGate([first], m.ports)));
    assert.ok(results.every((result) => result.status === "passed"));
    assert.equal(m.events.length, 1);
    assert.equal(m.events[0]!.event.status, "passed");
    assert.equal(m.starts.length, 0);
  });

  it("setup failure is terminal and repeated requests cannot spend again", async () => {
    const m = memory();
    let attempts = 0;
    m.ports.start = async () => { attempts++; throw new Error("synthetic setup failure"); };
    const firstResult = await runCheckupGate([first], m.ports);
    const retry = await runCheckupGate([first], m.ports);
    assert.equal(firstResult.status, "blocked");
    assert.equal(retry.status, "blocked");
    assert.equal(attempts, 1);
    assert.equal(m.events[0]!.event.status, "failed");
    assert.match(retry.errors.join(" "), /konnte nicht gestartet/);
  });

  it("stale claims fail closed without relaunch, including claims with no sandbox handle", async () => {
    for (const sandboxId of [undefined, "stub-stale"]) {
      const m = memory();
      m.seed(first, "checking", { createdAt: new Date(CLOCK - 7 * 60_000 - 1), ...(sandboxId ? { sandboxId } : {}) });
      const result = await runCheckupGate([first], m.ports);
      assert.equal(result.status, "blocked");
      assert.match(result.errors.join(" "), /Zeitlimit/);
      assert.equal(m.polls.length, 0);
      assert.equal(m.starts.length, 0);
      assert.equal(m.stops.length, sandboxId ? 1 : 0);
      const retry = await runCheckupGate([first], m.ports);
      assert.equal(retry.status, "blocked");
      assert.equal(m.starts.length, 0);
    }
  });

  it("a failed sandbox result is journaled as failed and cannot publish or retry", async () => {
    const m = memory();
    m.answer(first, { status: "failed", note: "Synthetischer Prüffehler." });
    const result = await runCheckupGate([first], m.ports);
    assert.equal(result.status, "blocked");
    assert.match(result.errors.join(" "), /Synthetischer Prüffehler/);
    assert.deepEqual(m.sequence, ["poll", "append:failed", "stop"]);
    assert.equal((await runCheckupGate([first], m.ports)).status, "blocked");
    assert.equal(m.starts.length, 0);
  });

  it("journal write failure propagates, never passes, and does not stop before durable evidence", async () => {
    const m = memory();
    m.answer(first, complete([{ answer: fullAnswer(first), confidence: 0.99 }]));
    m.ports.append = async () => { throw new Error("synthetic journal unavailable"); };
    await assert.rejects(runCheckupGate([first], m.ports), /synthetic journal unavailable/);
    assert.equal(m.stops.length, 0);
    assert.equal(m.rows.get(checkupTaskKey(first))!.status, "checking");
  });

  it("a lost claim or missing post-claim read stays checking without optimistic publication", async () => {
    const m = memory();
    m.ports.claim = async () => false;
    const lost = await runCheckupGate([first], m.ports);
    assert.equal(lost.status, "checking");
    assert.equal(lost.checked, 0);
    assert.equal(m.starts.length, 0);
    const n = memory();
    n.ports.read = async () => null;
    const missing = await runCheckupGate([first], n.ports);
    assert.equal(missing.status, "checking");
    assert.equal(missing.checked, 0);
    assert.equal(n.starts.length, 1);
  });

  it("changed item, answer key, frame, revision or pool invalidates a journal fingerprint", () => {
    const original = checkupTaskKey(first);
    const changed: PreparedCheckupTask[] = [];
    const item = structuredClone(first);
    item.item.hintDe += " Weiter.";
    changed.push(item);
    const key = structuredClone(first);
    (key.item as VocabItem).sAnswers[0]!.text += " changed";
    changed.push(key);
    const frame = structuredClone(first);
    frame.frame.lines[0] += " Changed.";
    changed.push(frame);
    const revision = structuredClone(first);
    revision.item.rev += 1;
    changed.push(revision);
    changed.push({ ...first, pool: "enToDe" });
    assert.equal(new Set(changed.map(checkupTaskKey)).size, changed.length);
    for (const task of changed) assert.notEqual(checkupTaskKey(task), original);
    assert.equal(checkupTaskKey({ ...first, sectionPosition: 99, itemPosition: 77 }), original, "already resolved frame/pool determine meaning, not position");
  });
});

it("object field order does not create a second content claim", () => {
  const reordered = { ...first, item: Object.fromEntries(Object.entries(first.item).reverse()) as typeof first.item };
  assert.equal(checkupTaskKey(first), checkupTaskKey(reordered));
});
it("a known late failure prevents spending on earlier missing items", async () => {
  const m = memory(); m.seed(tasks.at(-1)!, "blocked", { note: "Blocked fixture" });
  const result = await runCheckupGate(tasks, m.ports);
  assert.equal(result.status, "blocked"); assert.equal(m.starts.length, 0);
});
