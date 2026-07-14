# DomiGo Grade 1 RPG Comparison Sandbox

Status: calibration build ready; visual review and isolated database proof pending.
Updated: 2026-07-14 (Europe/Zagreb).

## Purpose

This branch is an independent implementation of the Grade 1 “Lost Pages” opening. It is a comparison sandbox, not a replacement for the existing game and not a production release.

A worktree — a second checkout of the same Git repository — keeps the experiment at `/Users/veho/Code/domigo-v2-codex-rpg` on branch `codex/g1-rpg-sandbox`. It started from the clean Word-Battle commit `002d31a`. Claude Code’s active checkout at `/Users/veho/Code/domigo-v2` has not been switched, cleaned, stashed, edited, rebased, or committed by this work.

## Implemented foundation

- Additive `world@1` content schema; frozen `map@1` is unchanged.
- Six authored 32-pixel-tile areas and ten directed connections.
- Exact learning references from Grade 1 Unit 1; no copied answer keys and no second grader.
- Pure state projection for task steps, encounter completion, flags, routes, variants, items, and experience points.
- Append-only world-event and experience ledgers with retry-safe unique keys.
- Server endpoints for world load, location, interactions, review, reset, and world-aware task attempts.
- Signed, per-tab preview identity for Fresh, Midway, Complete, and teacher review.
- Guarded seed script for three predictable test students.
- Camera-following Phaser runtime with variable bounds, collision, depth, keyboard, touch pad, tap-to-move, shared Action input, contextual prompts, localization, and an opt-in debug panel.
- Non-production preview index at `/dev/game-preview`, served locally on port 3210.

## Gate ledger

| Gate | State | Evidence / remaining proof |
|---|---|---|
| Isolation | Blocked | Worktree, branch, no-touch proof, offline dependency install, and baseline tests complete. The required Node 24.14.0 checks, tests, production build, and bundle ceiling pass. Neon refused a new branch because the project is at its branch limit; no database was changed. |
| Data | Blocked | Schema, migration, event-authoritative projection, retry-safe rewards, prerequisite enforcement, API, and guarded seed code pass the full local gate. Live migration/seed proof waits for a schema-only Neon branch. |
| Calibration | Review | Book Atrium → Courtyard → Corridor → Classroom path, camera, character, contextual action, and pencil task are wired. Both preview pages return HTTP 200. No visual claim: the browser bridge failed before opening a tab; Chrome and Computer Use plugins were installed for the next continuation. |
| Vertical slice | Next | Do not replicate or polish the remaining visual language until Koki/Fable gives the calibration verdict. |
| Review | Later | Teacher UI, full browser suite, device screenshots, accessibility and tamper receipts. |
| Selection | Later | Sandbox remains local and unchanged until Koki chooses between versions. No Codex pull request is open. |

## Safety boundaries

- `DOMIGO_SANDBOX_ENABLED=1` is required and is rejected in production.
- `DOMIGO_SANDBOX_DATABASE_CONFIRMED=1` is an explicit manual latch before seed work.
- No real connection string or signing secret is committed; `.env.local` is gitignored.
- Reset is restricted to rows marked `is_test_profile=true`.
- The client supplies only answers or interaction IDs, never experience amounts.
- Successful replay remains available but immutable reward keys prevent duplicate experience.

## Local commands

```text
pnpm run sandbox:dev       # local server on port 3210
pnpm run sandbox:migrate   # isolated Neon branch only
pnpm run sandbox:seed      # guarded test-profile seed
pnpm run sandbox:verify    # full repository gate
```

The seed command deliberately fails before database access unless all sandbox guards are present.

## Hostile-review receipt

Before the calibration commit, the server boundary was attacked as if the client were untrusted. The resulting fixes make cached JSON unable to forge flags/rewards, prevent one task from earning twice across encounters, enforce classroom/library story order during reward reconciliation, record wrong attempts for teacher review, reject collision-tile saves and out-of-area collectibles, and return not found for sandbox APIs in production. Regression tests prove the schema, save, reward-key, and production-switch cases.
