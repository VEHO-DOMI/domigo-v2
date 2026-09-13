# CODEX DRAFT — NOT CANON

## Result

All 17 reported chapter-one content-rule conflicts are resolved in the assembled tree. `pnpm check:game-tasks` exits 0, checking 199 tasks across six files. Chapter one remains at 61 genuine cards. The chair artwork that previously failed its portrait check was supplied by the separate art lane; this assignment did not modify art.

Changed here: `scripts/check-game-tasks.mjs`, `packages/game-paint/src/cards/variety.ts`, `packages/game-paint/src/cards/variety.test.ts`, `content/corpus/stories/g1.st.lost-pages/paint/ch01.policy.json`, and one story line in `ch01.tasks.v2.json`. Root explicitly extended ownership to the pure variety helper and its tests. No engine/UI/art/commit changes. The unit lexicon classes already correctly contained the ten taught colours after the other lane’s work; they required no additional change here.

## Gate change 1 — complete restore objects retain one two-step lesson

`check-game-tasks.mjs` now distinguishes the user-authorized object mechanic from an ordinary enemy deck. The exception requires **all** of: chapter one, role chaser, an `obj_` skin, exactly one entity of that skin in the phase, and exactly one bound restore card that includes both its name and colour among its offered choices plus a nonempty colour question. Parsed schema validation still runs before this classification. It therefore does not excuse a missing answer, a single ordinary choice question, an ordinary pencil enemy, a duplicate same-skin enemy, or an existing other chapter. All previous hostile minimums remain for those cases.

The same script gains six `--selftest` cases against copies of actual chapter-one content: original full chapter green; restore card removed red; name-only choice red; two same-skin objects with one card red; ordinary pencil deck shortened red; same restoration claim outside ch01 red. These call the real `checkAgainstLevel` and inspect captured failures, not a reimplementation. The existing layer-19 and layer-18 selftests remain intact. Full-process content mutations independently prove missing scissors restore and shortened ordinary pencil deck fail with the intended coverage messages.

## Gate change 2 — independently verified passive vocabulary

`variety.ts` accepts a separate optional `PassiveCoverage[]` input. Each claim gives a unit word ID, phase ID, entity ID and reason. It never adds a card, answered exercise, offered option, or synthetic wordbank entry. The checker always validates each claim against the actual supplied chapter: exactly one original cloth entity, visible rather than hidden, no bonus repeat, a nonempty trimmed English `wordEn` exactly matching a wordbank form, and a reachable position. Reachability uses the existing level model and its existing pickup envelope; the entity’s own cell must also be non-solid and non-hazardous. No thresholds were lowered. Reused words or bodies produce a duplicate-claim failure.

New law 17p rejects an invalid pickup claim; 17q rejects duplicates. A rejected claim does **not** enter the passive set, so an otherwise unexercised word still fails 17a. Accepted collected vocabulary remains separate from words answered or offered by cards. This evidence has no expiry exemption: it is revalidated against the current level on every run. Existing chapters without this input behave exactly as before, including their ledger and grammar requirements.

The script passes only the chapter’s explicit policy declarations into this validator. Chapter one now declares the nine actual original clothing pickups. Each item still needs its genuine entity and displayed English payload. Removing a claim does not grant coverage; removing or renaming the entity does not preserve coverage.

## Test-file change — real pickup counterexamples

`cards/variety.test.ts` adds ten cases, bringing its total to 49. It starts from the shipped hat placement. The valid labelled reachable pickup passes without any quiz card; the same word with no declaration fails 17a. Eight independent corruptions—removed body, renamed ID, wrong English word, empty label, hidden body, non-collectible role, unreachable position, bonus twin—must raise both 17p and 17a. A repeated claim raises 17q. Existing 39 variety tests are unchanged and still pass.

## Content policy and single wording change

The dead `uniform-naming` pickupset family and its unused 14c/15d/14d exemptions are removed. Three narrowly matched functional families permit only 16b, identical German task instructions: wheel/quickfire/moths, oddone/encounter/ranzen, and choice/rescue/satchel. Every family requires distinct actual answers, with an explicit pedagogical reason. This permits a stable instruction while preventing duplicated tasks. Negative full-process mutations make each family repeat an answer; each fails its own 0f obligation. No broad form, vocabulary or rhythm exception was added.

The picture task’s “Welcher Satz passt zu dem Bild?” becomes “Welcher Satz passt dazu?”. The word Bild no longer supplies the English answer picture. The depicted class photo remains its stimulus and the English answer remains unchanged. Root must include this new line in the blind-reader extract.

## Evidence

All runs used Node 24 and nice 15.

- `content-contract-gate.log`: full `check:game-tasks`, exit 0, 199 tasks / six files.
- `content-contract-selftest.log`: exit 0; six new restore-coverage cases, nine existing layer-19 cases and 22 existing layer-18 cases.
- `content-contract-variety-tests.log`: 49/49 Vitest cases, exit 0.
- `content-contract-types.log`: game-paint TypeScript check, exit 0.
- `content-contract-copy.log`: cloak/register/quote check, exit 0.
- `content-contract-tamper.json` and `content-contract-tamper-run.log`: original copied content exits 0; ten corruptions each exit 1 **and emit the intended named gate failure**.

The ten whole-process corruptions are missing/renamed/wrong-label/hidden/unreachable hat; missing scissors restoration; shortened normal pencil enemy deck; duplicate moth-family answer; duplicate schoolbag-family answer; duplicate locked-equipment-family answer. `content-contract-tamper.mjs` recreates the isolated copied-content run. It copies scripts/content into the lab and reads packages/art/docs by symlink; it never writes through those links. The source working tree is never tampered with.

A targeted root `pnpm exec eslint` attempt could not run because this workspace has no root eslint executable. This is recorded in `content-contract-lint.log` and is not represented as a successful lint. game-paint has a typecheck/test script and no lint script. Root’s normal workspace lint remains part of the final battery.

## Limits and handoff

This gate proves actual collectible declarations and their English event payload, using the same reachability model as level authoring. The already-added integration test proves all nine pickups through real Sim events and remounts. The browser still proves that the English pickup labels are visibly presented and that no third-piece quiz opens; a static content gate cannot certify a future UI regression. No false claim of active answer production is made for passively collected words.

The measured pass belongs to this current assembled tree. Root must rerun the required complete battery on the final PR head and include each gate/test change and its negative evidence in the PR description. No commits were made here.
