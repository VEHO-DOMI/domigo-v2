// cgo-047 Welle 2 · Minor 1 (GG-Prüfung 02.10.): the `enabled` switch of
// useOutboxFlush was untested — a tamper that ignored it stayed green. This is
// its behaviour, through the hook's own effect body.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { startOutboxFlush, type OnlineTarget } from "./useOutboxFlush.ts";

function recorder() {
  let flushes = 0;
  const listeners = new Set<() => void>();
  const target: OnlineTarget = {
    addEventListener: (_t, l) => { listeners.add(l); },
    removeEventListener: (_t, l) => { listeners.delete(l); },
  };
  return { target, listeners, flush: async () => { flushes++; }, get flushes() { return flushes; } };
}

describe("startOutboxFlush — the effect behind useOutboxFlush", () => {
  it("disabled (teacher preview): never flushes and never listens", () => {
    const r = recorder();
    const cleanup = startOutboxFlush(false, "fixture-a", undefined, r.flush, r.target);
    assert.equal(typeof cleanup, "function");
    cleanup();
    assert.equal(r.flushes, 0);
    assert.equal(r.listeners.size, 0);
  });
  it("enabled (a child): flushes once, again on every reconnect, and cleans up", () => {
    const r = recorder();
    const cleanup = startOutboxFlush(true, "fixture-a", undefined, r.flush, r.target);
    assert.equal(r.flushes, 1);
    assert.equal(r.listeners.size, 1);
    for (const l of r.listeners) l();
    assert.equal(r.flushes, 2);
    cleanup?.();
    assert.equal(r.listeners.size, 0);
  });
  it("the hook passes its switch to the effect and re-runs when it changes", () => {
    const src = fs.readFileSync(new URL("./useOutboxFlush.ts", import.meta.url), "utf8");
    assert.match(src, /useEffect\(\(\) => startOutboxFlush\(enabled, ownerId, onReply\), \[enabled, ownerId, onReply\]\);/);
  });
});

// Exercise the production effect body with a recording subscription boundary.
// This observes registration/cleanup, rather than inferring them from the UI.
import { transpileModule } from "typescript";
import type { OutboxReplyListener } from "./attempt-outbox.ts";
function effectHost() {
  const src = fs.readFileSync(new URL("./useOutboxFlush.ts", import.meta.url), "utf8");
  const body = src.slice(src.indexOf("export function startOutboxFlush("), src.indexOf("/** The server"))
    .replace("export function", "function");
  const events: string[] = [];
  const live = new Set<OutboxReplyListener>();
  const start = new Function("bindOutboxOwner", "subscribeOutboxReplies", `${transpileModule(body, {}).outputText}; return startOutboxFlush;`)(
    (owner: string | null) => { events.push(`bind:${owner}`); return () => { events.push("release"); }; },
    (owner: string, listener: OutboxReplyListener) => {
      events.push(`subscribe:${owner}`); live.add(listener);
      return () => { events.push("unsubscribe"); live.delete(listener); };
    },
  ) as typeof startOutboxFlush;
  return { start, events, live };
}
describe("optional reply effect lifetime", () => {
  it("subscribes before the initial drain and releases on every cleanup including StrictMode", () => {
    const h = effectHost(), r = recorder();
    const reply: OutboxReplyListener = () => {};
    const flush = async () => { assert.equal(h.live.has(reply), true); h.events.push("flush"); };
    for (let mount = 0; mount < 2; mount++) {
      const stop = h.start(true, "fixture-a", reply, flush, r.target);
      assert.equal(h.live.size, 1); assert.equal(r.listeners.size, 1);
      stop(); assert.equal(h.live.size, 0); assert.equal(r.listeners.size, 0);
    }
    assert.deepEqual(h.events, Array(2).fill(["bind:fixture-a", "subscribe:fixture-a", "flush", "unsubscribe", "release"]).flat());
  });
  for (const [enabled, owner] of [[false, "fixture-a"], [true, null]] as const) {
    it(`no subscription when disabled or ownerless (${enabled}/${owner})`, () => {
      const h = effectHost(), r = recorder();
      const stop = h.start(enabled, owner, () => {}, r.flush, r.target);
      assert.deepEqual(h.events, ["bind:null"]); assert.equal(h.live.size, 0); assert.equal(r.flushes, 0);
      stop(); assert.deepEqual(h.events, ["bind:null", "release"]);
    });
  }
  it("existing callers without onReply do not subscribe", () => {
    const h = effectHost(), r = recorder();
    const stop = h.start(true, "fixture-a", undefined, r.flush, r.target);
    assert.deepEqual(h.events, ["bind:fixture-a"]); assert.equal(r.flushes, 1);
    stop(); assert.deepEqual(h.events, ["bind:fixture-a", "release"]);
  });
});
