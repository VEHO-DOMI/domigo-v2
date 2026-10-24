import assert from "node:assert/strict";
import { it } from "node:test";
import { available, defaults, endGame, markWord, newGame, nextTurn, remainingWords, resetRound, standings, startRound, tick, undoLast, undoRound, type ActivityWord, type Game } from "./game.ts";
const words: ActivityWord[] = Array.from({ length: 40 }, (_, i) => ({ id: `synthetic-${i}`, chapter: i < 20 ? 1 : 2, word: `word ${i}`, german: `Wort ${i}`, mode: i % 2 ? "show" : "draw" }));
const setup = () => ({ ...defaults(words), seconds: 30, rounds: 3 });
const ready = (pool = words) => newGame(pool, { ...setup(), chapters: [1, 2] }, ["Example A", "Example B"], 123)!;
const answer = (g: Game, correct = true, now = 100) => markWord(g, g.current!.id, correct, now);
it("A01 selection and setup reject empty/invalid games; seeded deck is repeatable", () => {
  assert.equal(available(words, { ...setup(), chapters: [2], modes: ["draw"] }).length, 10);
  assert.equal(newGame(words, { ...setup(), chapters: [] }, ["A", "B"], 1), null);
  for (const seconds of [-1, 0, 31, Infinity]) assert.equal(newGame(words, { ...setup(), seconds }, ["A", "B"], 1), null);
  for (const rounds of [-1, 1, Infinity]) assert.equal(newGame(words, { ...setup(), rounds }, ["A", "B"], 1), null);
  assert.equal(newGame(words, setup(), ["A"], 1), null);
  assert.deepEqual(ready().deck, ready().deck); assert.equal(new Set(ready().deck.map(w => w.id)).size, 40);
});
it("A02 one physical word counts once; stale double-click does not answer the next word", () => {
  const g = startRound(ready(), 0), id = g.current!.id, scored = markWord(g, id, true, 100);
  assert.equal(scored.marks.length, 1); assert.notEqual(scored.current?.id, id);
  assert.equal(markWord(scored, id, true, 110), scored); assert.equal(scored.groups[0]!.score, 0);
});
it("A03 clock deadline is authoritative, including after a hidden-tab delay", () => {
  const g = startRound(ready(), 1000);
  assert.equal(tick(g, 30999).phase, "play");
  const expired = markWord(g, g.current!.id, true, 31000);
  assert.equal(expired.phase, "summary"); assert.equal(expired.groups[0]!.score, 0);
  assert.equal(tick(g, 999999).remaining, 0); assert.equal(tick(expired, 999999), expired);
  assert.equal(undoLast(expired, 999999), expired);
});
it("A04 undo last restores the exact word without adding time", () => {
  const g = startRound(ready(), 0), id = g.current!.id;
  for (const correct of [false, true]) {
    const undone = undoLast(markWord(g, id, correct, 100), 1000);
    assert.equal(undone.current!.id, id); assert.equal(undone.marks.length, 0); assert.equal(undone.deadline, g.deadline);
    assert.equal(answer(undone, true, 1100).marks.length, 1);
  }
});
it("A05 round score, used pool and all counters undo together", () => {
  let g = startRound(ready(), 0);g = answer(g);g = answer(g, false);g = answer(g);
  const finished = tick(g, 30000);assert.deepEqual(finished.groups[0], { name: "Example A", score: 2, correct: 2, skipped: 1, turns: 1 });
  assert.equal(finished.used.length, 2); assert.equal(remainingWords(finished).length, 38);
  const restored = undoRound(finished);assert.equal(restored.phase, "ready");assert.equal(restored.used.length, 0);assert.equal(restored.groups[0]!.score, 0);assert.equal(restored.groups[0]!.turns, 0);
  assert.equal(startRound(restored, 40000).current?.id, startRound(ready(), 0).current?.id);
});
it("A06 skipping entire pool ends the round, earns no bonus, and makes skipped words available to next group", () => {
  const pool = words.slice(0, 2);let g = newGame(pool, { ...setup(), bonus: true }, ["A", "B"], 5)!;
  g = startRound(g, 0);g = answer(g, false);g = answer(g, false);
  assert.equal(g.phase, "summary");assert.equal(g.bonus, 0);assert.equal(g.groups[0]!.score, 0);
  g = nextTurn(g);assert.equal(g.turn, 1);assert.equal(remainingWords(g).length, 2);assert.equal(startRound(g, 1000).phase, "play");
});
it("A07 clearing every word can earn exactly one session bonus and undo removes it", () => {
  let g = newGame(words.slice(0, 2), { ...setup(), bonus: true }, ["A", "B"], 5)!;
  g = answer(answer(startRound(g, 0)));assert.equal(g.phase, "summary");assert.equal(g.bonus, 1);assert.equal(g.groups[0]!.score, 3);
  assert.equal(nextTurn(g).phase, "final");assert.equal(tick(g, 50000), g);
  const back = undoRound(g);assert.equal(back.groups[0]!.score, 0);assert.equal(back.used.length, 0);
  let skipped = newGame(words.slice(0, 2), { ...setup(), bonus: true }, ["A", "B"], 5)!;
  skipped = answer(answer(startRound(skipped, 0), false));assert.equal(skipped.bonus, 0);
});
it("A08 each group gets exactly the configured rounds; unlimited continues", () => {
  let g = ready();
  for (let turn = 0; turn < 6; turn++) {
    assert.equal(g.turn, turn % 2);g = answer(startRound(g, turn * 40000), true, turn * 40000 + 100);g = nextTurn(tick(g, turn * 40000 + 30000));
  }
  assert.equal(g.phase, "final");assert.deepEqual(g.groups.map(x => x.turns), [3, 3]);assert.deepEqual(g.groups.map(x => x.score), [3, 3]);
  g = newGame(words, { ...setup(), rounds: 0 }, ["A", "B"], 1)!;
  for (let turn = 0; turn < 8; turn++) g = nextTurn(tick(startRound(g, turn * 40000), turn * 40000 + 30000));
  assert.equal(g.phase, "ready");assert.deepEqual(g.groups.map(x => x.turns), [4, 4]);
});
it("A09 resetting a round restores this round's words but preserves previous scores", () => {
  let g = nextTurn(tick(answer(startRound(ready(), 0)), 30000));const previous = g.used[0];
  g = answer(startRound(g, 40000), true, 40100);g = resetRound(g);
  assert.equal(g.phase, "ready");assert.deepEqual(g.used, [previous]);assert.deepEqual(g.groups.map(x => x.score), [1, 0]);assert.equal(g.marks.length, 0);
});
it("A10 ranking follows score/correct/fewest skips and equal records share first rank", () => {
  const g = { name: "Example", score: 4, correct: 4, skipped: 1, turns: 1 };
  const list = standings([{ ...g, name: "B" }, { ...g, name: "C", skipped: 2 }, { ...g, name: "A" }, { ...g, name: "D", score: 3 }]);
  assert.deepEqual(list.map(x => x.rank), [1, 1, 3, 4]);assert.deepEqual(list.map(x => x.name), ["B", "A", "C", "D"]);
  assert.equal(endGame(ready()).phase, "final");const playing = startRound(ready(), 0);assert.equal(endGame(playing), playing);
});
