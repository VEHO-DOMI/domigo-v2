import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync } from "node:fs";
import { answerState, restoredAnswerState, SAVE_COPY } from "./save-state.ts";
import { automaticNavigationFailures, audienceWiringFailures } from "./source-contract.ts";

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

test("the rendered audience wiring accepts no answer-derived counts", () => {
  const game = readFileSync(new URL("./NovelGame.tsx", import.meta.url), "utf8");
  assert.deepEqual(audienceWiringFailures(game), []);
  const bad = game.replace("current={audience}", "current={audience && { ...audience, views: audience.views + 100 * Object.values(results).filter(r => r.tier === 'correct').length }}");
  assert.notEqual(bad, game);
  assert.ok(audienceWiringFailures(bad).length, "answer-derived counts must fail the source contract");
});

test("all novel sources reject scheduled or imperative navigation", () => {
  const dir = new URL("./", import.meta.url);
  for (const file of readdirSync(dir).filter(f => /\.tsx?$/.test(f) && !f.endsWith(".test.ts") && f !== "source-contract.ts")) {
    assert.deepEqual(automaticNavigationFailures(readFileSync(new URL(file, dir), "utf8")), [], file);
  }
  for (const source of [
    "queueMicrotask(() => location.assign(next));",
    "window['queueMicrotask'](() => go(next));", "location['href'] = next;",
    "window.location.replace(next);", "location.push(next);",
    "window.location['assign'](next);", "location.href = next;",
    "setTimeout(() => go(next), 1);",
    "Promise.resolve().then(() => go(next));",
    "useEffect(() => { go(next); }, []);",
  ]) assert.ok(automaticNavigationFailures(source).length, source);
  assert.deepEqual(automaticNavigationFailures('const control = <button onClick={() => go(next)}>Continue</button>;'), []);
});

function claimsSaved(copy: string): boolean {
  return [...copy.matchAll(/\b(?:saved|gespeichert)\b/gi)].some(match => !/\b(?:not(?: yet)?|never|nicht|nie)\s*$/i.test(copy.slice(0, match.index)));
}
test("unconfirmed status copy never claims storage", () => {
  for (const status of ["queued", "failed", "unknown", "preview"] as const) assert.equal(claimsSaved(SAVE_COPY[status]), false, status);
  for (const lie of ["Saved. Online bestätigt.", "Gespeichert!", "Not saved earlier. Saved now."]) assert.equal(claimsSaved(lie), true);
  for (const honest of ["Not saved.", "Not yet saved.", "Noch nicht gespeichert.", "Nie gespeichert."]) assert.equal(claimsSaved(honest), false);
  assert.equal(claimsSaved(SAVE_COPY.saved), true, "confirmed state has its receipt");
});
