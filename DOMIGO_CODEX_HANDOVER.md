# DomiGo Codex RPG Handover

## Exact workspace

- Worktree: `/Users/veho/Code/domigo-v2-codex-rpg`
- Branch: `codex/g1-rpg-sandbox`
- Base: clean Word-Battle commit `002d31a`
- Local URL: `http://localhost:3210/dev/game-preview`
- Delivery rule: commit and back up this branch; do not open a Codex pull request during the comparison.

## Current truth

The content/data/persistence foundation and first playable calibration runtime are implemented. The application server is running on port 3210. `/dev/game-preview` and `/dev/game-preview/fresh` both return HTTP 200.

The live database gate is not complete. Neon returned “branches limit exceeded” when asked for a schema-only branch, and no existing branch was deleted because deletion requires Koki’s explicit choice. No migration or seed touched development or production.

The visual gate is not complete. Browser control failed with `Cannot redefine property: process`; the Chrome and Computer Use plugins were then installed and should be used after the task reloads. Do not claim visual completion until the real path is played.

## Verification receipts

- Content schema: 30 passing tests; strict-shape, collision/reachability, and task-ownership tamper cases included.
- Content loader: 8 passing tests.
- Game core: 19 passing tests; cached-state forgery and invalid-save fallbacks included.
- Existing 2D movement/game package: 32 passing tests; type-check green.
- Database: 161 passing, 1 skipped; type-check green.
- Web token/library tests: 10 passing; production sandbox shutoff included.
- Preview routes: HTTP 200.
- Node release gate: passed with bundled Node 24.14.0 and pnpm 11.5.3; type-check, lint, test, all-content validation, all-story validation, production build, and bundle ceiling all green. Phaser is 330 KB compressed against the 400 KB ceiling.

Hostile review fixed four rule-level gaps before commit: cached JSON cannot forge unlocks; task reward keys are one-per-world-and-task; later encounters require their preceding story flag on the server; and wrong answers are persisted for teacher review. Production APIs now return not found when the sandbox switch is off, saved positions reject collision tiles, and completed multi-step encounters replay every step without another reward.

## First continuation actions

1. Reload this task so installed Chrome/Computer Use capabilities appear.
2. Use Chrome profile “Koki”; never read or export cookies/passwords.
3. Play the Fresh calibration path and capture desktop plus 375-pixel screenshots.
4. Ask for the single verdict in `DOMIGO_FABLE_REVIEW.md` and stop visual repetition until it arrives.
5. In Neon, free one branch slot only with Koki’s explicit approval; create a schema-only `codex-g1-rpg-sandbox` branch.
6. Put its connection string only in gitignored `.env.local`, set the confirmation latch, run migration and seed, then prove Fresh/Midway/Complete.

## After calibration approval

Complete the remaining room visual pass, teacher review page, reset/map-jump UI, Playwright journey suite, deliberate tamper test, responsive/accessibility passes, documentation receipts, final tri-surface logs, and final backup push. Preserve the sandbox unchanged for the comparison.
