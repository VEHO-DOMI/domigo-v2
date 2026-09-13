# CODEX DRAFT — NOT CANON

## Delivered contract checks

Repository changes in this assignment are limited to:

- `scripts/paint-pilots/ch01.pilots.mjs` — actual existing pilot path; p2 walks the widened rescue area and p3 no longer jumps onto the deleted door pedestal.
- `content/corpus/stories/g1.st.lost-pages/paint/ch01.proof.json` — regenerated from actual input recording and open-loop replay for all five phases.
- `packages/game-paint/src/ch01-story-contracts.test.ts` — seven new integration tests against the real simulation, authored chapter data, real task solver and recorded keys.

No engine, scene, UI, art, schema, policy or foreign gate was changed. No existing test was relaxed or deleted. Existing generic chapter-99 awakening tests remain intact and green, preserving the older chapters’ behavior.

## Proof changes, with measured reasons

The real repository recorder was run under Node 24 / nice 15 for p1, p2, p3, p4 and p9. Every phase completed its open-loop verification before its proof was saved. `contracts-bands.log` ends ALL GREEN, exit 0.

| Phase | Destination | Ticks | Letters | Tasks | Other actual outcomes |
| --- | --- | --- | --- | --- | --- |
| p1 | p2 | 705 | 9/9 | 3 | 2 tips, 1 clothing piece |
| p2 | p3 | 973 | 9/9 | 13 | 1 freed cage, Merle awake 1, 2 tips, 2 clothing pieces |
| p3 | boss | 633 | 9/9 | 2 | 3 clothing pieces |
| p4 | done | 3533 | 0/0 | 5 | guardian down, writes low, consoled, landed, picture cage freed, score page shown |
| p9 | p2 | 498 | 12/12 | 0 | 4 clothing pieces |

The p2 task count rises 12→13 and clothing count 1→2 because the revised route really encounters the new lower-room content. Merle remains mandatory in the proof outcome at 1, not lowered to hide the prior follow-state counter bug. The p4 count changes 12→5 because the authorized mechanic removes seven questions raised by chalk hits. Its earned counter-window sequence, all three physical wipes and full finale are preserved and independently asserted by the new integration test. The p4 pilot program itself is unchanged; its actual final timing is re-recorded after the mechanic change. p1/p9 were rerun, not assumed unaffected.

Before regeneration, `contracts-before.log` reports 366 passed and exactly three failures: old p2 tape could not exit (including the whole-chapter run), and old p4 expected 12 tasks while the actual game correctly produced 5. These were stale movement/outcome data, not failing assertions deleted from a test.

## Test-file change and adversarial verification

**New file `ch01-story-contracts.test.ts`:** actual p2 recording earns Merle through rounds 1–6, counts exactly one rescue and follows farther than her former four-cell roaming zone. The earned ledger is then passed into fresh p3 and p4 simulations; each has exactly one visible, rescued Merle at the safe hero entry point, and she walks and jumps along the full actual input tape without unsafe body positions, repeat rescue tasks or enemy-trigger requests. Unrescued and wrong-cage ledgers create no follower. A real overlay pause freezes both the complete companion state and the simulation clock. Clothing tests collect all nine words through real Sim pickup events, preserve them through remount and suppress corresponding bonus-room twins; the current 61-card data set contains no pickupset quiz. The boss test witnesses real knockback hits with no surprise entity task, four earned guardian requests and physical wipes `[2, 1, 0]`, then the defeated guardian and freed picture.

Six deliberate engine mutations were made **only in an isolated copied tree**, never in the live working repository. The same seven-test file ran green against the unmodified copy (exit 0) and red for each mutation (exit 1). `contracts-tamper.json`, `contracts-tamper.mjs` and the individual logs preserve exact evidence. The verified copied tree is retained at `contracts-sandbox-verified/` in this report directory.

| Deliberate defect | Test detects |
| --- | --- |
| Remove actual simulation pause guard | paused tick counter advances from 40 to 130 |
| Remove fresh rescue’s companion trail | Merle never reaches the required following state/distance |
| Remove carryover into later phases | p3/p4 contain zero Merles instead of one |
| Spawn Merle in later rooms without her earned rescue | negative unearned-rescue assertion fails |
| Restore chalk-hit surprise quiz | hit tick emits forbidden guardian entity task |
| Remove pickup memory on remount | previously collected clothes become available again |

The first pause mutant initially survived a coordinates-only assertion because the entity layer supplies a second freeze guard. That was a useful real counterexample: Merle’s picture stayed still but the shared delay clock advanced. The test was strengthened to assert `tickCount` as well. The final mutation now fails precisely on this clock assertion, while the original remains green. No production fix was necessary.

## Commands and outcomes

All commands started with Node 24 and ran with nice 15.

- `contracts-after.log`: **385/385 tests passed across 12 files**, exit 0. Files: new story contracts, companion, awakening, proof tapes, pickups, guardian flight, guardian after-solve, hit knockback, shipped content levels, level laws, card variety and ceremony.
- `contracts-new.log`: **7/7 passed**, exit 0, rerun after adding the stricter pause-clock assertion.
- `contracts-types.log`: `pnpm --filter @domigo/game-paint typecheck`, exit 0.
- `contracts-tamper-run.log`: baseline exit 0, all six deliberate mutants exit 1, overall exit 0.
- `contracts-gate-paint-copy.log`: `pnpm check:paint-copy`, exit 0, cloak/register/quote laws hold across 90 shell files and 12 content files.
- `contracts-gate-game-tasks.log`: `pnpm check:game-tasks`, exit 1 with 17 failures, handed to Root as detailed below.

The 385-test run precedes the added pause-clock assertion; the final seven-test run and all six final mutants include it. The unchanged other 378 tests were not rerun merely to repeat the same checks. Root still runs the full final-head battery.

## Foreign gate failures reported to Root

These were measured, not changed here. Exact failing lines are `contracts-gate-game-tasks.log:2–18`.

- Picture task: 18b considers “Bild” a giveaway for picture in “Welcher Satz passt zu dem Bild?”. Content owner should phrase the question without revealing the answer.
- Scissors, glue stick and sharpener: coverage currently demands at least two cards for every hostile skin; each newly attacking restored object has its one intended restore card. This needs an explicit contract decision by that gate’s owner; inventing a redundant second question solely to satisfy the old classification would undermine the user’s mechanic.
- Chair: `obj_chair_a` is not yet painted/imported. Root/art lane owns it.
- Removed clothing quiz family: `uniform-naming` is stale (0a) and its 14c/15d/14d exceptions are now unused (0k). Policy owner should remove the obsolete family, not retain dead exemptions.
- Duplicate task wording 16b: Ranzen q3/q4, moth word/number families, tablet/sound-system questions. Resolve through actual authored wording or an honest family declaration, not blanket silence.
- Vocabulary ledger 17a: hairband, sunglasses, hat and shoe need truthful pickup-based coverage entries after quiz removal. Their words are actually collected in the new integration test; claiming a task still teaches them would be false.

Draft-only warnings for chapters 3–6 remain explicitly informational in that command and were not confused with the 17 chapter-1 failures.

## Practical limits

The no-every-third-clothing-quiz decision lives in `PaintGame.tsx`’s UI callback. The simulation itself already emitted pickup events without quizzes. The new tests prove collection, persistence, bonus-twin suppression and removal of quiz cards; they cannot by themselves detect someone reverting only that UI callback. Root must verify collecting the third piece in the actual browser. No source-regex test is offered as a substitute.

Art alignment, Merle’s visible proportions, the actual Hello chalk drawing and prologue presentation require the rendering/browser pass owned by Root. These tests prove mechanics, not how the final illustrations look. Local player-name persistence has its separate already-delivered profile tests.

No PR or merge is performed by this assignment. Final-head battery, blind reader and gate-owner accounting remain with Root.
