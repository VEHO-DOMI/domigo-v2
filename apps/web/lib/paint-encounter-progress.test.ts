import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { PaintEncounter } from "@domigo/content-schema";
import { loadUnit } from "@domigo/content-loader";
import { EncounterSession, freshEncounterProgress, canContinue, encounterFeedback, type EncounterReply, type EncounterAttempt } from "../../../packages/game-paint/src/encounter/runtime.ts";
import { readPaintEncounterProgress, savePaintEncounterProgress, type EncounterProgressContext } from "./paint-encounter-progress.ts";
import { attemptSender } from "./preview-attempt.ts";
import { bindOutboxOwner } from "./attempt-outbox.ts";

const encounter = PaintEncounter.parse(JSON.parse(readFileSync(new URL("../../../content/corpus/stories/g1.st.lost-pages/paint/ch02.encounter.json", import.meta.url), "utf8")));
const grammarItems = loadUnit(encounter.unit).grammar;
const memory = () => {
  const values = new Map<string, string>();
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
};
const context = (): EncounterProgressContext => ({ playerKey: "fixture-a", encounter, preview: false, storage: memory() });
const correct: EncounterReply = { ok: true, queued: false, tier: "correct", xpAwarded: 4 };
function runtime(ctx = context(), initial = { ...freshEncounterProgress(encounter.revision), cursor: 0 }, send: (attempt: EncounterAttempt) => Promise<EncounterReply> = async () => correct) {
  const sent: EncounterAttempt[] = [];
  let serial = 0;
  const session = new EncounterSession({ encounter, grammarItems, initial, preview: ctx.preview,
    onProgress: next => savePaintEncounterProgress(ctx, next),
    onAttempt: async attempt => { sent.push(attempt); return send(attempt); },
    onChange: () => {},
    uuid: () => `00000000-0000-4000-8000-${String(++serial).padStart(12, "0")}`,
  });
  return { session, sent, ctx };
}

describe("encounter progress and submission lifecycle", () => {
  it("persists the UUID and payload before transport, then waits for explicit Continue", async () => {
    const ctx = context();
    const { session, sent } = runtime(ctx, undefined, async attempt => {
      const recovered = readPaintEncounterProgress(ctx);
      assert.equal(recovered.pendingAttemptId, attempt.clientAttemptId);
      assert.deepEqual(recovered.pendingAttempt, attempt);
      return correct;
    });
    session.setInput("in"); await session.submit();
    assert.equal(sent.length, 1); assert.equal(session.progress.cursor, 0);
    assert.equal(readPaintEncounterProgress(ctx).confirmed?.reply.tier, "correct");
    assert.deepEqual(session.progress.worldEffects, []);
    assert.ok(encounterFeedback(session.progress, false).includes("+4 Lernpunkte"));
    session.advance("p01"); assert.equal(session.progress.cursor, 1);
  });
  it("a double click and delivery retry use one frozen payload", async () => {
    let resolve!: (r: EncounterReply) => void;
    const { session, sent, ctx } = runtime(undefined, undefined, () => new Promise(r => { resolve = r; }));
    session.setInput("in"); const first = session.submit(); const second = session.submit();
    assert.equal(sent.length, 1);
    session.setInput("under"); assert.equal(session.progress.lastInput, "in");
    resolve({ ok: false, queued: false }); await Promise.all([first, second]);
    const resumed = runtime(ctx, readPaintEncounterProgress(ctx));
    await resumed.session.submit();
    assert.deepEqual(resumed.sent[0], sent[0]);
  });
  it("six answers survive reloads, with the book transition exactly once", async () => {
    const ctx = context(); let initial = { ...freshEncounterProgress(encounter.revision), cursor: 0 };
    let n = 0;
    for (const task of encounter.tasks) {
      const { session, sent } = runtime(ctx, initial);
      session.setInput(task.answer); await session.submit(); n += sent.length;
      const acknowledged = readPaintEncounterProgress(ctx);
      assert.equal(acknowledged.cursor, initial.cursor);
      const resumed = runtime(ctx, acknowledged).session;
      resumed.advance(task.id); resumed.advance(task.id);
      initial = readPaintEncounterProgress(ctx);
      assert.equal(initial.cursor, encounter.tasks.indexOf(task) + 1);
      assert.deepEqual(initial.worldEffects, initial.cursor >= 5 ? ["recover_book", "pack_book"] : []);
    }
    assert.equal(n, 6);
    assert.equal(initial.cursor, 6);
  });
  it("the effect set reconciles an already recovered transition without duplicating the book", async () => {
    const ctx = context();
    const initial = { ...freshEncounterProgress(encounter.revision), cursor: 4, worldEffects: ["recover_book", "pack_book"] };
    const { session } = runtime(ctx, initial);
    session.setInput("under"); await session.submit(); session.advance("a02");
    assert.deepEqual(session.progress.worldEffects, ["recover_book", "pack_book"]);
    const raw = JSON.parse(ctx.storage!.getItem("domigo:paint-encounter:v1:fixture-a:ch02")!);
    assert.deepEqual(raw.worldEffects, ["recover_book", "pack_book"]);
    assert.deepEqual(readPaintEncounterProgress(ctx).worldEffects, ["recover_book", "pack_book"]);
  });
  it("queued local success permits story play but publishes no correctness or points", async () => {
    const { session } = runtime(undefined, undefined, async () => ({ ok: false, queued: true, tier: "correct", xpAwarded: 99 }));
    session.setInput("in"); await session.submit();
    assert.equal(canContinue(session.progress, false), true);
    const message = encounterFeedback(session.progress, false);
    assert.ok(message.includes("Punkte folgen")); assert.doesNotMatch(message, /Richtig|99|Lernpunkte/);
    assert.notEqual(session.progress.pendingAttemptId, null);
  });
  it("wrong, close and partial replies cannot open Continue; exact retry can", async () => {
    for (const tier of ["wrong", "close", "partial"] as const) {
      const { session } = runtime(undefined, undefined, async () => ({ ok: true, queued: false, tier }));
      session.setInput("in"); await session.submit(); session.advance("p01");
      assert.equal(session.progress.cursor, 0); assert.equal(canContinue(session.progress, false), false);
    }
    const { session } = runtime(undefined, { ...freshEncounterProgress(encounter.revision), cursor: 3 });
    session.setInput("in"); await session.submit();
    assert.equal(session.progress.confirmed?.localTier, "close"); assert.equal(canContinue(session.progress, false), false);
    session.retry(); session.setInput("on"); await session.submit(); assert.equal(canContinue(session.progress, false), true);
  });
  it("help sends no attempt, and records support when a later answer is submitted", async () => {
    const { session, sent, ctx } = runtime(); session.useHint();
    assert.equal(sent.length, 0); assert.equal(readPaintEncounterProgress(ctx).hintUsed, true);
    session.setInput("in"); await session.submit(); assert.equal(sent[0]?.hintUsed, true);
  });
  it("blocked persistence stops transport and preserves the same pending identity for retry", async () => {
    let blocked = true; const storage = memory(); const ctx = context();
    ctx.storage = { getItem: storage.getItem, setItem: (k, v) => { if (blocked) throw Error("blocked"); storage.setItem(k, v); } };
    const { session, sent } = runtime(ctx); session.setInput("in"); await session.submit();
    assert.equal(sent.length, 0); const id = session.progress.pendingAttemptId;
    blocked = false; await session.submit(); assert.equal(sent[0]?.clientAttemptId, id);
  });
  it("account changes and content revisions do not reuse another draft", async () => {
    const { session, ctx } = runtime(); session.setInput("in"); await session.submit();
    assert.equal(readPaintEncounterProgress({ ...ctx, playerKey: "fixture-b" }).cursor, -4);
    assert.equal(readPaintEncounterProgress({ ...ctx, encounter: { ...encounter, revision: "next" } }).cursor, -4);
    assert.equal(readPaintEncounterProgress(ctx).cursor, 0);
  });
  it("preview neither reads nor writes browser storage", async () => {
    const ctx = { ...context(), preview: true, storage: { getItem: () => { throw Error("read forbidden"); }, setItem: () => { throw Error("write forbidden"); } } };
    assert.equal(readPaintEncounterProgress(ctx).cursor, -4);
    const { session } = runtime(ctx, undefined, async () => ({ ok: true, queued: false }));
    session.setInput("in"); await session.submit(); assert.equal(canContinue(session.progress, true), true);
    assert.doesNotMatch(encounterFeedback(session.progress, true), /Richtig|Lernpunkte/);
  });
  it("unmount discards late replies instead of persisting them into another view", async () => {
    let resolve!: (r: EncounterReply) => void;
    const { session, ctx } = runtime(undefined, undefined, () => new Promise(r => { resolve = r; }));
    session.setInput("in"); const work = session.submit(); session.dispose(); resolve(correct); await work;
    assert.equal(readPaintEncounterProgress(ctx).confirmed, null);
  });
  it("malformed recovered payloads cannot submit a different item under the old identity", async () => {
    const { session, ctx } = runtime(undefined, undefined, async () => ({ ok: false, queued: false }));
    session.setInput("in"); await session.submit();
    const stored = readPaintEncounterProgress(ctx);
    stored.pendingAttempt!.itemId = "wrong-item"; savePaintEncounterProgress(ctx, stored);
    assert.equal(readPaintEncounterProgress(ctx).cursor, -4);
  });
});

// Execute the REAL app seam with small React/dynamic stand-ins. This observes
// callbacks and effects, so replacing attemptSender(preview, …) with false bites.
it("BuchClient preview connects the mute sender and disables the outbox drain", async () => {
  const require = createRequire(import.meta.url);
  const ts = require("typescript") as typeof import("typescript");
  const source = readFileSync(new URL("../app/(game)/play/[grade]/buch/[chapter]/BuchClient.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const calls: unknown[][] = [];
  const exports: { default?: (p: Record<string, unknown>) => { type: (p: Record<string, unknown>) => { props: { onAttempt: (a: EncounterAttempt) => Promise<EncounterReply> } }; props: Record<string, unknown> } } = {};
  const hookReact = { useState: (init: unknown) => [typeof init === "function" ? init() : init, () => {}], useMemo: (fn: () => unknown) => fn(), useCallback: (fn: unknown) => fn };
  runInNewContext(compiled, { exports, require: (specifier: string) => {
    if (specifier === "react") return hookReact;
    if (specifier === "react/jsx-runtime") return { jsx: (type: unknown, props: unknown) => ({ type, props }) };
    if (specifier === "next/dynamic") return { default: () => () => null };
    if (specifier === "@/lib/preview-attempt") return { attemptSender };
    if (specifier === "@/lib/useOutboxFlush") return { useOutboxFlush: (...args: unknown[]) => calls.push(args) };
    if (specifier === "@/lib/paint-encounter-progress") return { readPaintEncounterProgress, savePaintEncounterProgress };
    return {};
  } });
  const outer = exports.default!({ playerKey: "preview-fixture", preview: true, ownerId: null, encounter: { ...encounter, grammarItems }, hubHref: "/play/1" });
  const stage = outer.type(outer.props);
  assert.deepEqual(calls, [[false, null]]);
  let posts = 0; const before = globalThis.fetch;
  const release = bindOutboxOwner(null);
  globalThis.fetch = async () => { posts++; return Response.json({ ok: true }); };
  try {
    const reply = await stage.props.onAttempt({ clientAttemptId: crypto.randomUUID(), itemId: encounter.tasks[0]!.corpusItem, mode: "game:g1", input: { kind: "choice", value: "in" }, latencyMs: 1, hintUsed: false });
    assert.deepEqual(reply, { ok: true, queued: false }); assert.equal(posts, 0);
  } finally { globalThis.fetch = before; release(); }
});
