import { defineConfig } from "vitest/config";

// B1 · Why this file exists at all (there was none before 2026-08-11):
// the level laws are not unit-sized. `checkLevelLaws` runs a reachability
// sweep FROM EVERY reachable standing node of a real 5-phase chapter — that is
// O(nodes × BFS) by design, and the design is deliberate (level.ts: "honesty
// beats cleverness here", because "reachable from a good node" does not imply
// "can reach the exit"). On the shipped ch01 one call costs ~2–4 s, and
// content-levels.test.ts / pickups.test.ts call it repeatedly.
//
// Vitest's 5 s default was therefore ALREADY expiring on this suite before any
// of B1's changes (measured on origin/main: 2 tests red, both on
// checkLevelLaws, neither an assertion failure). B1 made the sweep more
// expensive still — the healed p1 cellar is no longer a 4-node dead pocket, so
// its nodes now run full sweeps — which turned 2 red into 7.
//
// B1 paid down what it could WITHOUT touching the edge logic (the safety
// property lives there): reachFrom no longer re-scans the grid for
// springs/vines/rings, nor re-samples platform paths, on every one of its ~308
// calls — those are facts about (rows, entities), now memoized on object
// identity. Measured in one process on the same level: 6849/6766 ms (shipped
// law) → 5227/5026 ms (this one), gates included.
//
// It is still seconds, and under a 30-file parallel run seconds become tens of
// seconds. So the timeout is the honest lever for the remainder: nothing is
// hanging, the law is slow on purpose. The real fix — ONE reverse BFS from the
// exit instead of one forward BFS per node, O(V+E) instead of O(V·(V+E)) —
// means duplicating the edge logic in reverse, which is exactly the code that
// must never drift. Filed for the architect, not smuggled into a level PR.
// 120 s is chosen from measurement, not taste: the two law-heavy tests cost
// ~20 s and ~30 s ALONE, and vitest runs 30 files in parallel workers, so under
// contention they land in the tens of seconds. At 30 s the suite was FLAKY —
// three consecutive runs went red/red/green on the same commit. A ceiling this
// far above the real cost still fails fast on an actual hang, and it never
// fails on a busy machine.
export default defineConfig({
  test: {
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
