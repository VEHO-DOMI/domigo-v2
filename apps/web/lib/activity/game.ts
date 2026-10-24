/** cgo-113: one-device classroom game. Scores are session points, never XP.
 * All time is supplied by the caller's monotonic clock; no persistence or IO.
 */
export const MODES = ["draw", "show", "explain"] as const;
export type ActivityMode = typeof MODES[number];
export type ActivityWord = { id: string; chapter: number; word: string; german: string; mode: ActivityMode };
export type Settings = { seconds: number; rounds: number; chapters: number[]; modes: ActivityMode[]; bonus: boolean };
export type Group = { name: string; score: number; correct: number; skipped: number; turns: number };
export type Mark = { word: ActivityWord; correct: boolean };
export type Game = {
  phase: "ready" | "play" | "summary" | "final";
  settings: Settings; groups: Group[]; turn: number; deck: ActivityWord[]; used: string[];
  marks: Mark[]; current: ActivityWord | null; deadline: number; remaining: number; bonus: number;
};
export const defaults = (words: ActivityWord[]): Settings => ({ seconds: 60, rounds: 5, chapters: [...new Set(words.map(w => w.chapter))], modes: [...MODES], bonus: false });
export const available = (words: ActivityWord[], settings: Settings) => words.filter(w => settings.chapters.includes(w.chapter) && settings.modes.includes(w.mode));
export function newGame(words: ActivityWord[], settings: Settings, names: string[], seed: number): Game | null {
  const deck = available(words, settings);
  if (![30, 60, 90].includes(settings.seconds) || ![0, 3, 5, 8].includes(settings.rounds) || names.length < 2 || names.length > 8 || !deck.length) return null;
  // Fisher-Yates, seeded once so undo never invents a different deck.
  let n = seed >>> 0;
  for (let i = deck.length - 1; i > 0; i--) {
    n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
    const j = n % (i + 1); [deck[i], deck[j]] = [deck[j]!, deck[i]!];
  }
  return { phase: "ready", settings: { ...settings, chapters: [...settings.chapters], modes: [...settings.modes] }, groups: names.map(name => ({ name: name.trim().slice(0, 30), score: 0, correct: 0, skipped: 0, turns: 0 })), turn: 0, deck, used: [], marks: [], current: null, deadline: 0, remaining: settings.seconds, bonus: 0 };
}
export function remainingWords(game: Game): ActivityWord[] {
  return game.deck.filter(w => !game.used.includes(w.id));
}
function nextWord(game: Game): ActivityWord | null {
  const roundIds = new Set(game.marks.map(m => m.word.id));
  return remainingWords(game).find(w => !roundIds.has(w.id)) ?? null;
}
export function startRound(game: Game, now: number): Game {
  if (game.phase !== "ready" || !Number.isFinite(now)) return game;
  const current = remainingWords(game)[0];
  if (!current) return { ...game, phase: "final" };
  return { ...game, phase: "play", marks: [], bonus: 0, current, deadline: now + game.settings.seconds * 1000, remaining: game.settings.seconds };
}
function finishRound(game: Game, now: number): Game {
  if (game.phase !== "play") return game;
  const correct = game.marks.filter(m => m.correct);
  const used = [...game.used, ...correct.map(m => m.word.id)];
  // Skipping every remaining word is not clearing the pool.
  const bonus = game.settings.bonus && correct.length > 0 && now < game.deadline && game.deck.every(w => used.includes(w.id)) ? 1 : 0;
  return { ...game, phase: "summary", used, current: null, bonus, remaining: Math.max(0, Math.ceil((game.deadline - now) / 1000)), groups: game.groups.map((g, i) => i !== game.turn ? g : { ...g, score: g.score + correct.length + bonus, correct: g.correct + correct.length, skipped: g.skipped + game.marks.length - correct.length, turns: g.turns + 1 }) };
}
export function tick(game: Game, now: number): Game {
  if (game.phase !== "play" || !Number.isFinite(now)) return game;
  if (now >= game.deadline) return finishRound(game, now);
  const remaining = Math.ceil((game.deadline - now) / 1000);
  return remaining === game.remaining ? game : { ...game, remaining };
}
export function markWord(game: Game, id: string, correct: boolean, now: number): Game {
  const timed = tick(game, now);
  if (timed.phase !== "play" || timed.current?.id !== id) return timed;
  const next = { ...timed, marks: [...timed.marks, { word: timed.current, correct }] };
  const current = nextWord(next);
  return current ? { ...next, current } : finishRound(next, now);
}
export function undoLast(game: Game, now: number): Game {
  const timed = tick(game, now);
  if (timed.phase !== "play" || !timed.marks.length) return timed;
  return { ...timed, marks: timed.marks.slice(0, -1), current: timed.marks.at(-1)!.word };
}
export function undoRound(game: Game): Game {
  if (game.phase !== "summary") return game;
  const correct = game.marks.filter(m => m.correct);
  const removed = new Set(correct.map(m => m.word.id));
  return { ...game, phase: "ready", used: game.used.filter(id => !removed.has(id)), marks: [], bonus: 0, groups: game.groups.map((g, i) => i !== game.turn ? g : { ...g, score: g.score - correct.length - game.bonus, correct: g.correct - correct.length, skipped: g.skipped - game.marks.length + correct.length, turns: g.turns - 1 }) };
}
export function resetRound(game: Game): Game {
  if (game.phase !== "play") return game;
  return { ...game, phase: "ready", marks: [], current: null, bonus: 0, deadline: 0, remaining: game.settings.seconds };
}
export function nextTurn(game: Game): Game {
  if (game.phase !== "summary") return game;
  const limit = game.settings.rounds;
  if (!remainingWords(game).length || limit > 0 && game.groups.every(g => g.turns >= limit)) return { ...game, phase: "final" };
  for (let offset = 1; offset <= game.groups.length; offset++) {
    const turn = (game.turn + offset) % game.groups.length;
    if (!limit || game.groups[turn]!.turns < limit) return { ...game, phase: "ready", turn, marks: [], bonus: 0 };
  }
  return { ...game, phase: "final" };
}
export function endGame(game: Game): Game {
  return game.phase === "ready" ? { ...game, phase: "final" } : game;
}
/** Equal scores use the original correct/skip tiebreakers; equal records share a rank. */
export function standings(groups: Group[]): (Group & { rank: number })[] {
  const sorted = [...groups].sort((a, b) => b.score - a.score || b.correct - a.correct || a.skipped - b.skipped);
  let rank = 1;
  return sorted.map((g, i) => { const before = sorted[i - 1]; if (before && (g.score !== before.score || g.correct !== before.correct || g.skipped !== before.skipped)) rank = i + 1; return { ...g, rank }; });
}
