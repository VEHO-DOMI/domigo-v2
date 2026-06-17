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
| `docs/handover/` | the authoritative v2 handover doc-set (incl. `10_game_layer.md` — the game bible) |
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
pnpm content extract        # stage 1: docx → content/build/transcripts + sources.lock.json
pnpm content wordbank       # stage 2: master lists → content/corpus/units/*/wordbank.json
pnpm content v1-snapshot    # v1 vocab+grammar corpus → content/build/v1/ (parity oracle, sha-locked)
pnpm content gen --structures --grade N --prepare|--ingest [--dry-run]
                            # stage 4: SB grammar boxes + v1 floor → per-grade structures catalog
pnpm content gen --prepare|--ingest --unit g2-u03 [--fix] [--dry-run]
                            # stage 5: generation briefs → drafts → vocab.json/grammar.json
pnpm content verify --prepare|--ingest --unit g2-u03 [--dry-run]
                            # stage 6: 4 adversarial lens briefs → merged flags, fix loop ≤2, escalate
pnpm content harvest-nouns  # proper-noun harvest → content/build/proper-nouns.json (V-5 input)
pnpm content review-doc --items --unit g2-u03 [--full]        # stage 8: item review doc (V-1…22 must be green)
pnpm content ingest-review --items --unit g2-u03 [--dry-run]  # stage 8: verdicts/edits → item-fixes + state
pnpm content review-doc --wordbank [--grade N|--unit g2-u03]   # thorough review docs (+ --allowlist)
pnpm content ingest-review --wordbank [--dry-run]              # verdicts/edits → overlays + state
pnpm content validate       # CI-safe checks: V-A…V-F + item validators V-1…V-22 (red blocks merge)
pnpm content status         # per-unit state dashboard (round, flags)
```

Both generation stages are deterministic and byte-stable: re-runs with unchanged sources change
nothing. Word-bank totals are asserted against each master list's self-declared counts
(786 / 611 / 599 / 450). Entry ids are pinned in per-unit `ids.lock.json` and never reused.

**Status (2026-06-17): the items wave is ✅ COMPLETE.** All **57/57 units `approved` at 0.0% stage-8
reject** (full v1 grammar parity), all **4 structure catalogs** generated (g1 35 / g2 28 / g3 18 /
g4 15), **5,898 reviewed items** + 2,446 word-bank entries — `pnpm content status` → `approved=57`,
`pnpm content validate` green (V-1…V-22 + V-A…V-F), `pnpm test` 60/60. Progress receipt + the per-unit
rhythm live in [items-wave](docs/runbooks/items-wave.md); the g2-u03 pilot that gated the waves is in
[item-pilot-g2-u03](docs/runbooks/item-pilot-g2-u03.md). Schemas frozen (vocab@1 / grammar@1 /
grammar-structures@1 / story@1, PR #10); core allowlist approved (137 tokens incl. the song/band
fix, `content/overlays/core-allowlist.json`). **Next:** merge `feat/items-wave-g2`, then wire the
approved items into the trainer surfaces (foundation harness — loader + all-format renderer + grader),
ahead of the [game layer](docs/handover/10_game_layer.md) (four standalone grade games).

## Database rules (shared Neon project with live v1 — do not skip)

- Shared tables (`users`, `legacy_students`, `classes`, …) are **additive-only** until v1 retires.
- Prod `DATABASE_URL` never lives in this repo or local `.env`; prod DDL is manual, runbook-gated,
  `pg_dump` first.
- Never enable per-PR Neon branches (free-tier 10-branch cap — the v1 trap). CI uses a Postgres
  service container.
