# CODEX DRAFT — NOT CANON

Independent review of the final chapter 1 gate correction, 2026-09-13.

Result: PASS for the reviewed scope; no actionable release blocker found. This is a code and focused-test review, not a full-battery or visual acceptance claim.

Reviewed the uncommitted delta against shipping-app commit `718845f6` in exactly two repository files. No repository files were edited by this reviewer.

- `packages/game-paint/src/composition.test.ts`, SHA-256 `a0591c42ba87a1d1a3e1380f052181a3add7e0102175465444f0169834a6097e`.
- `scripts/check-png-seams.mjs`, SHA-256 `54a756be0e589c1fb4ff76e937998f22c9aafe0ab7a2216f5d8b1d54b4813ec9`.

The composition test now compares the registered phases with the actual level phases and checks every actual floating cell. The interval calculation uses mounted pixel widths from the shipping planner and actual source-image dimensions; declared cell counts alone cannot make a shrunken painting pass. Complete bodies are excluded by their actual cell ownership. The negative cases exercise missing bonus furniture (all ten affected cells are identified) and excessive image height causing real planner shrinkage. This replaces a stale palette assumption with a stronger check of the current level's actual horizontal coverage. It deliberately does not assert hypothetical platform widths absent from the level.

The seam gate keeps its pixel classification and thresholds unchanged. Its empty active tile set is admitted only after each registered mass phase supplies a rectangular, nonempty actual level grid and the shipping `phaseIsOneBlock`/`bodyPartitionErrors` partition proof succeeds. The self-test proves clean and dirty colors, missing and empty grids, an empty composition, a broken body returning the legacy palette to scope, and an uncovered body with no replacement palette. Missing files in an active legacy scope now fail rather than silently disappearing. Removing the four obsolete allowances is correct because those tiles are no longer mounted. Future active legacy tile scopes still undergo the original color and allowance checks.

Executed independently with Node 24 and nice level 15:

1. `pnpm --filter @domigo/game-paint exec vitest run src/composition.test.ts`: exit 0; 115/115 tests passed.
2. `node --experimental-strip-types scripts/check-png-seams.mjs --selftest`: exit 0; all eleven assertions passed, including deliberate failure fixtures.
3. `node --experimental-strip-types scripts/check-png-seams.mjs`: exit 0; 5/5 mass phases proved as whole-body worlds, 0 active opaque legacy tiles, 0 allowances.

Limits: the composition assertion checks mounted horizontal image bounds, not alpha-pixel contact, PNG decoding validity, or vertical deck placement; the separate image/ground-contact/body gates remain necessary. The seam gate continues to cover opaque legacy tiles only, not all whole-body paintings, whose true violet palette makes this particular fixed color rule unsuitable. These are explicit existing scope boundaries, not removed checks. Separate temporary-file counterprobes being prepared by the gate owner were not relied on for this independent PASS. The complete 74-command battery on the final committed head is still required.
