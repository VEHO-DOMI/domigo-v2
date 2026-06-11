# DomiGo v2

EFL practice app for Austrian AHS Klasse 1–4 (MORE! 1–4, A1→A2) at the Gymnasium der
Dominikanerinnen. From-scratch rebuild of [domigo](https://github.com/VEHO-DOMI/domigo) (v1, the
reference implementation, live until cutover). **Go-live: school year 2026/27.**

**Start here: [`docs/handover/00_START_HERE.md`](docs/handover/00_START_HERE.md).**
The guardrails in [`docs/handover/08_design_principles.md`](docs/handover/08_design_principles.md)
are non-negotiable — re-read them before every content or feature change.

## Layout

| Path | What |
|---|---|
| `apps/web` | the Next.js app (PWA) |
| `packages/content-schema` | zod schemas — the pipeline ↔ app contract |
| `packages/engine` | pure TS grading (4-tier) + XP/streak/level core — no React imports, ever |
| `packages/content-pipeline` | corpus generation + validators (`pnpm content <cmd>`) |
| `content/` | **committed** corpus artifacts + per-unit audit state (CI validates these; no iCloud needed) |
| `docs/handover/` | the authoritative v2 handover doc-set |
| `docs/runbooks/` | operational runbooks (cutover, content release, Firebase final import, …) |

## Dev

Node ≥ 24, pnpm ≥ 11.

```sh
pnpm install
pnpm typecheck && pnpm lint && pnpm test   # what CI runs
pnpm content status                        # per-unit corpus state
```

## Content pipeline

Generation stages read the MORE! source materials from Koki's iCloud (read-only; several folder
names have trailing spaces — always quote). Override the base with `DOMIGO_SOURCE_BASE`. CI never
touches iCloud: it validates the committed artifacts only.

```sh
pnpm content extract      # stage 1: docx → content/build/transcripts + sources.lock.json
pnpm content wordbank     # stage 2: master lists → content/corpus/units/*/wordbank.json
pnpm content v1-snapshot  # v1 vocab corpus → content/build/v1/ (parity oracle, sha-locked)
pnpm content validate     # CI-safe deterministic checks (red blocks merge)
```

Both generation stages are deterministic and byte-stable: re-runs with unchanged sources change
nothing. Word-bank totals are asserted against each master list's self-declared counts
(786 / 611 / 599 / 450). Entry ids are pinned in per-unit `ids.lock.json` and never reused.

## Database rules (shared Neon project with live v1 — do not skip)

- Shared tables (`users`, `legacy_students`, `classes`, …) are **additive-only** until v1 retires.
- Prod `DATABASE_URL` never lives in this repo or local `.env`; prod DDL is manual, runbook-gated,
  `pg_dump` first.
- Never enable per-PR Neon branches (free-tier 10-branch cap — the v1 trap). CI uses a Postgres
  service container.
