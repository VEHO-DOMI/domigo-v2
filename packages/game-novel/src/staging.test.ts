import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { answerState, restoredAnswerState, SAVE_COPY } from "./save-state.ts";

test("preview acknowledgements never become storage receipts or saved copy", () => {
  for (const ok of [false, true]) for (const queued of [false, true]) {
    const state = answerState(true, { ok, queued });
    assert.equal(state, "preview");
    assert.doesNotMatch(SAVE_COPY[state], /saved|gespeichert|bestätigt/i);
  }
  assert.equal(restoredAnswerState(true, "saved"), "preview");
  const client = readFileSync(new URL("../../../apps/web/app/(game)/play/[grade]/NovelClient.tsx", import.meta.url), "utf8");
  assert.match(client, /<NovelGame\s+preview=\{preview\}/);
  assert.doesNotMatch(client, /Your episode is saved/);
});

test("only acknowledged answers are saved; queued and old answers remain honest", () => {
  assert.equal(answerState(false, { ok: true, queued: false }), "saved");
  assert.equal(answerState(false, { ok: false, queued: true }), "queued");
  assert.equal(answerState(false, { ok: false, queued: false }), "failed");
  assert.equal(restoredAnswerState(false, "queued"), "unknown");
  assert.equal(restoredAnswerState(false), "unknown");
  assert.equal(restoredAnswerState(false, "invented"), "unknown");
  for (const status of ["saving", "saved", "queued", "failed"] as const) assert.ok(SAVE_COPY[status]);
});

test("story steps never advance themselves or impose timers", () => {
  const game = readFileSync(new URL("./NovelGame.tsx", import.meta.url), "utf8");
  // Timers in the outer persistence client only debounce saves; the story has none.
  assert.doesNotMatch(game, /\b(?:setTimeout|setInterval|requestAnimationFrame)\s*\(|\bautoPlay\b|\bautoplay\b/i);
  assert.doesNotMatch(game, /http-equiv\s*=\s*["']refresh/i);
  assert.match(game, /props\.nextEpisode && <a[^>]+href=\{props\.nextEpisode\.href\}/);
  const route = readFileSync(new URL("../../../apps/web/app/(game)/play/[grade]/[zone]/page.tsx", import.meta.url), "utf8");
  assert.match(route, /following && released\.includes\(following\.id\)/);
  assert.match(game, /status === "saved" \? reply\.xpAwarded : undefined/);
});
