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
    const cleanup = startOutboxFlush(false, "fixture-a", r.flush, r.target);
    assert.equal(typeof cleanup, "function");
    cleanup();
    assert.equal(r.flushes, 0);
    assert.equal(r.listeners.size, 0);
  });
  it("enabled (a child): flushes once, again on every reconnect, and cleans up", () => {
    const r = recorder();
    const cleanup = startOutboxFlush(true, "fixture-a", r.flush, r.target);
    assert.equal(r.flushes, 1);
    assert.equal(r.listeners.size, 1);
    for (const l of r.listeners) l();
    assert.equal(r.flushes, 2);
    cleanup?.();
    assert.equal(r.listeners.size, 0);
  });
  it("the hook passes its switch to the effect and re-runs when it changes", () => {
    const src = fs.readFileSync(new URL("./useOutboxFlush.ts", import.meta.url), "utf8");
    assert.match(src, /useEffect\(\(\) => startOutboxFlush\(enabled, ownerId\), \[enabled, ownerId\]\);/);
  });
});
