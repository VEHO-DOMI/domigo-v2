/** cgo-100: exercise the actual asynchronous gate with real prepared tasks,
 * an in-memory journal and protocol-shaped sandbox replies. No DB/accounts. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { vocabAnswers } from "@domigo/engine";
import type { GrammarItem, VocabItem } from "@domigo/content-schema";
import type { ContentCheckEvent, ContentCheckResult, ContentCheckTaskMeta } from "../../../packages/db/src/content-check-journal.ts";
import type { SandboxFrameResult, SandboxBatchResult } from "./studio-solve-sandbox.ts";
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
  const batches: PreparedCheckupTask[][] = [];
  const batchReplies = new Map<string, SandboxBatchResult>();
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
    async claim(key, meta, retryAttemptId) {
      const previous = rows.get(key);
      if (previous && (previous.status !== "error" || previous.attemptId !== retryAttemptId)) return false;
      claims.push({ key, meta });
      sequence.push("claim");
      rows.set(key, { status: "checking", createdAt: new Date(CLOCK), attemptId: previous ? `${key}-retry-${previous.attemptNumber}` : key, attemptNumber: (previous?.attemptNumber ?? 0) + 1 });
      return true;
    },
    async append(key, event) {
      if (event.eventId && eventIds.has(event.eventId)) return;
      if (event.eventId) eventIds.add(event.eventId);
      events.push({ key, event });
      sequence.push(`append:${event.status}`);
      const row = rows.get(key);
      if (row?.status !== "checking" || (event.attemptId && event.attemptId !== (row.attemptId ?? key))) return;
      rows.set(key, { ...row, ...event, status: event.status, createdAt: row.createdAt,
        ...(event.sandboxId ? { sandboxId: event.sandboxId } : {}),
        ...(event.note ? { note: event.note } : {}),
      });
    },
    async start(task, remember) {
      starts.push(task);
      sequence.push("start");
      await remember(`stub-${checkupTaskKey(task)}`);
    },
    async startBatch(group, remember) {
      batches.push(group); starts.push(...group); sequence.push("start-batch"); await remember(`batch-${batches.length}`);
    },
    async pollBatch(id) { polls.push(id); sequence.push("poll-batch"); return batchReplies.get(id) ?? { status: "checking" }; },
    async poll(id) { polls.push(id); sequence.push("poll"); return replies.get(id) ?? { status: "checking" }; },
    async stop(id) { stops.push(id); sequence.push("stop"); },
  };
  function seed(task: PreparedCheckupTask, status: ContentCheckResult["status"], options: Partial<ContentCheckResult> = {}) {
    rows.set(checkupTaskKey(task), { status, createdAt: new Date(CLOCK), attemptId: checkupTaskKey(task), attemptNumber: 1, ...options });
  }
  function answer(task: PreparedCheckupTask, reply: SandboxFrameResult) {
    const id = `stub-${checkupTaskKey(task)}`;
    seed(task, "checking", { sandboxId: id });
    replies.set(id, reply);
    return id;
  }
  return { ports, rows, starts, batches, batchReplies, claims, events, stops, polls, sequence, replies, seed, answer };
}

describe("runCheckupGate — paid-run and publication contracts", () => {
  it("twenty missing items share exactly one frame start and twenty item claims", async () => {
    const m = memory();
    const result = await runCheckupGate(tasks, m.ports);
    assert.equal(result.status, "checking");
    assert.equal(result.checked, 0);
    assert.equal(result.total, 20);
    assert.equal(result.journalHits, 0);
    assert.equal(result.started, 1);
    assert.equal(m.starts.length, 20);
    assert.equal(m.batches.length, 1);
    assert.equal(m.batches[0]!.length, 20);
    assert.equal(m.claims.length, 20);
    assert.equal(m.sequence.indexOf("start-batch"), 20, "all claims precede the sole start");
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

  it("stored blocked verdicts block with a reason and never restart", async () => {
    for (const status of ["blocked"] as const) {
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

  it("setup failure is an error and the next publication attempt retries once", async () => {
    const m = memory(); let attempts = 0;
    const start = m.ports.startBatch;
    m.ports.startBatch = async (...args) => { attempts++; if (attempts === 1) throw new Error("synthetic setup failure"); await start(...args); };
    const failed = await runCheckupGate(tasks, m.ports);
    assert.equal(failed.status, "error"); assert.deepEqual(failed.blockedItemIds, []);
    assert.match(failed.errors.join(" "), /Prüfung konnte nicht laufen — später erneut/);
    assert.ok(m.events.every(({ event }) => event.status === "error"));
    const retry = await runCheckupGate(tasks, m.ports);
    assert.equal(retry.status, "checking"); assert.equal(attempts, 2);
    assert.equal(m.batches.length, 1); assert.equal(m.batches[0]!.length, 20);
    assert.equal(m.claims.length, 40);
    m.batchReplies.set("batch-1", { status: "complete", results: Object.fromEntries(tasks.map(task=>[checkupTaskKey(task), complete([{answer:fullAnswer(task),confidence:.99}])])) });
    assert.equal((await runCheckupGate(tasks,m.ports)).status,"passed","retry completion has its own terminal event identity");
  });

  it("timeouts end without judgment and permit a later attempt, including missing handles", async () => {
    for (const sandboxId of [undefined, "stub-stale"]) {
      const m = memory(); m.seed(first, "checking", { createdAt: new Date(CLOCK - 16 * 60_000 - 1), ...(sandboxId ? { sandboxId } : {}) });
      const failed = await runCheckupGate([first], m.ports);
      assert.equal(failed.status, "error"); assert.deepEqual(failed.blockedItemIds, []);
      assert.equal(m.polls.length, 0); assert.equal(m.starts.length, 0);
      assert.equal(m.stops.length, sandboxId ? 1 : 0);
      const retry = await runCheckupGate([first], m.ports);
      assert.equal(retry.status, "checking"); assert.equal(m.batches.length, 1);
    }
  });

  it("infrastructure poll failures journal error, never an item rejection", async () => {
    const m = memory(); m.answer(first, { status: "error", note: "synthetic failure" });
    const failed = await runCheckupGate([first], m.ports);
    assert.equal(failed.status, "error"); assert.deepEqual(failed.blockedItemIds, []);
    assert.deepEqual(m.sequence, ["poll", "append:error", "stop"]);
    assert.equal((await runCheckupGate([first], m.ports)).status, "checking");
    assert.equal(m.batches.length, 1);
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
    assert.equal(n.starts.length, 0);
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

it("a complete twenty-item batch journals each answer, polls once, and reuses all hits", async () => {
  const m = memory(); await runCheckupGate(tasks, m.ports);
  const results = Object.fromEntries(tasks.map((task) => [checkupTaskKey(task), complete([{ answer: fullAnswer(task), confidence: .99 }])]));
  m.batchReplies.set("batch-1", { status: "complete", results }); m.polls.length = 0;
  const result = await runCheckupGate(tasks, m.ports);
  assert.equal(result.status, "passed"); assert.equal(result.checked, 20); assert.equal(m.polls.length, 1);
  assert.equal(m.events.filter(({ event }) => event.status === "passed").length, 20);
  assert.equal(m.stops.length, 1); assert.equal(m.batches.length, 1);
  const again = await runCheckupGate(tasks, m.ports);
  assert.equal(again.journalHits, 20); assert.equal(again.started, 0); assert.equal(m.batches.length, 1);
});
it("a missing batch answer retries only that item; valid siblings remain free hits", async () => {
  const m = memory(); await runCheckupGate(tasks, m.ports);
  m.batchReplies.set("batch-1", { status: "complete", results: Object.fromEntries(tasks.slice(1).map((task) => [checkupTaskKey(task), complete([{ answer: fullAnswer(task), confidence: .99 }])])) });
  const failed = await runCheckupGate(tasks, m.ports);
  assert.equal(failed.status, "error"); assert.equal(failed.checked, 19); assert.deepEqual(failed.blockedItemIds, []);
  const retry = await runCheckupGate(tasks, m.ports);
  assert.equal(retry.journalHits, 19); assert.deepEqual(m.batches[1]!.map(t=>t.itemId), [first.itemId]);
});
it("one wrong answer in a batch blocks only its item, with all other results journaled", async () => {
  const m = memory(); await runCheckupGate(tasks, m.ports);
  m.batchReplies.set("batch-1", { status: "complete", results: Object.fromEntries(tasks.map((task, i) => [checkupTaskKey(task), complete([{ answer: i === 7 ? "zzzzz" : fullAnswer(task), confidence: .99 }])])) });
  const result = await runCheckupGate(tasks, m.ports);
  assert.equal(result.status, "blocked"); assert.equal(result.checked, 19);
  assert.deepEqual(result.blockedItemIds, [tasks[7]!.itemId]);
});
it("Studio remains one ordinary single-item frame and polling errors never auto-retry", async () => {
  const m = memory(); await runCheckupGate([first], m.ports, { single: true });
  assert.equal(m.starts.length, 1); assert.equal(m.batches.length, 0);
  m.seed(first, "error");
  const result = await runCheckupGate([first], m.ports, { single: true, retryErrors: false });
  assert.equal(result.status, "error"); assert.equal(m.starts.length, 1);
});
it("parallel twenty-item requests never duplicate a claimed item", async () => {
  const m = memory(); await Promise.all(Array.from({length: 8},()=>runCheckupGate(tasks,m.ports)));
  assert.equal(m.starts.length,20); assert.equal(new Set(m.starts.map(checkupTaskKey)).size,20);
  assert.equal(m.batches.length,1);
});

it("a subset cannot close the shared environment before the other item verdicts persist",async()=>{
  const m=memory();await runCheckupGate(tasks,m.ports);
  m.batchReplies.set("batch-1",{status:"complete",results:Object.fromEntries(tasks.map(task=>[checkupTaskKey(task),complete([{answer:fullAnswer(task),confidence:.99}])]))});
  const subset=await runCheckupGate([first],m.ports);assert.equal(subset.status,"passed");assert.equal(m.stops.length,0);
  assert.equal(m.events.filter(e=>e.event.status==="passed").length,1);
  const sheet=await runCheckupGate(tasks,m.ports);assert.equal(sheet.status,"passed");assert.equal(sheet.checked,20);assert.equal(m.stops.length,1);assert.equal(m.batches.length,1);
});

it("a blocked subset still lets existing batch siblings journal without new spending",async()=>{
  const m=memory();await runCheckupGate(tasks,m.ports);
  m.batchReplies.set("batch-1",{status:"complete",results:Object.fromEntries(tasks.map((task,i)=>[checkupTaskKey(task),complete([{answer:i===0?"zzz wrong":fullAnswer(task),confidence:.99}])]))});
  assert.equal((await runCheckupGate([first],m.ports)).status,"blocked");assert.equal(m.stops.length,0);
  const sheet=await runCheckupGate(tasks,m.ports);assert.equal(sheet.status,"blocked");assert.equal(sheet.checked,19);assert.equal(m.stops.length,1);assert.equal(m.batches.length,1);
  assert.equal(m.events.filter(e=>e.event.status==="passed").length,19);
});

it("a partly claimed pending batch holds new spending until that owner finishes",async()=>{
  const m=memory();m.seed(first,"checking");
  const result=await runCheckupGate(tasks,m.ports);assert.equal(result.status,"checking");
  assert.equal(m.claims.length,0);assert.equal(m.batches.length,0);
});
