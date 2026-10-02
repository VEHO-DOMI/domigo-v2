// cgo-047 · lib/studio-publish.ts + its one caller: a failed save never publishes.
import assert from "node:assert/strict";
import fs from "node:fs";
import { describe, it } from "node:test";
import { saveThenPublish, type StudioStep } from "./studio-publish.ts";

function recorder(results: Partial<Record<StudioStep, boolean>>) {
  const sent: StudioStep[] = [];
  return { sent, send: async (step: StudioStep) => { sent.push(step); return results[step] ?? true; } };
}

describe("saveThenPublish", () => {
  it("does not publish when the save before it failed", async () => {
    const r = recorder({ save: false });
    assert.equal(await saveThenPublish(true, r.send), false);
    assert.deepEqual(r.sent, ["save"]);
  });
  it("saves, then publishes, when both are confirmed", async () => {
    const r = recorder({});
    assert.equal(await saveThenPublish(true, r.send), true);
    assert.deepEqual(r.sent, ["save", "publish"]);
  });
  it("publishes an already saved draft directly", async () => {
    const r = recorder({ publish: false });
    assert.equal(await saveThenPublish(false, r.send), false);
    assert.deepEqual(r.sent, ["publish"]);
  });
  it("the Studio editor publishes only through it, and post reports failure", () => {
    const src = fs.readFileSync(new URL("../app/admin/studio/[slug]/StudioEditor.tsx", import.meta.url), "utf8");
    assert.match(src, /saveThenPublish\(dirty,/);
    assert.match(src, /async function post\([^)]*\): Promise<boolean>/);
    assert.match(src, /setErrors\(d\.errors \?\? \[d\.error \?\? "Fehler"\]\);\s*return false;/);
    assert.match(src, /setErrors\(\["Netzwerkfehler"\]\);\s*return false;/);
    assert.doesNotMatch(src, /action: "publish"[^\n]*\n[^\n]*\bawait post\(/, "no unconditional publish after a save");
  });
});
