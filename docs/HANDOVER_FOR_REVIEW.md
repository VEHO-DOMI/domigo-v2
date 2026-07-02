# DomiGo v2 — Handover for Review

_Written 2026-06-30 for the next AI (or engineer) who will **pick up, review, and improve** this project. It lays out what was intended, what shipped, how it all works, and — explicitly — where the gaps, risks, and review-targets are. Read this first, then follow the pointers._

> **One-line state:** the full learning app + 3 of the 4 grade games are built and merged (**78 PRs**); what remains is **G4 Syntaxia**, the **listening/test content waves**, **TTS**, **teacher writing-grading (B2b)**, and **Track D (migration cutover + bulletproof-beta + PWA)** — the last of which gates the **September 2026** go-live. Live status: [`STATUS_AND_ROADMAP.md`](STATUS_AND_ROADMAP.md).

---

## 0. Orientation — where everything lives

- **Repo:** `VEHO-DOMI/domigo-v2` (this repo), local `~/Code/domigo-v2`. Prod: `domigo-v2.vercel.app`. A pnpm monorepo (Next 16 / React 19 / TypeScript / Tailwind v4 / Neon Postgres / Phaser).
- **v1 (reference only):** `VEHO-DOMI/domigo` (`domigo-silk.vercel.app`) — the prior app being rebuilt. Clone to `/tmp/domigo-v1-ref` for porting. Also the standalone grade trainers `1st/2nd/3rd/4th-grade-vocab-trainer` (legacy game IP source).
- **Docs (`docs/`):**
  - **`STATUS_AND_ROADMAP.md`** — the single source of truth for *what's done / what's next* (current as of the 78 PRs).
  - **`handover/00_START_HERE.md`** → the read-order for the original design docs `01`–`13`.
  - `handover/01`–`09` — the original design (status quo, architecture/data-model, migration, content rework, source materials, **06 vision/pillars**, **07 task formats**, **08 the design principles/Laws**, 09 roadmap/open-decisions).
  - `handover/10_game_layer.md` — the game-layer bible (the 9 Laws, the 4 games, architecture, asset pipeline). **Read before touching any game.**
  - `handover/11_remaining_work.md` — self-contained passovers for B2b · content waves · TTS.
  - `handover/12_g2_passover.md` — the G2 detective + pedagogy passover (now complete).
  - `handover/13_g4_syntaxia.md` — **the G4 Syntaxia design + roadmap (planned, not built; one narrative decision open).**
  - `runbooks/{items-wave,content-waves}.md` — operational how-tos for the content waves.
  - `art/` — the procedural art prompt libraries + generators (`build-g{2,3,1}-prompts.*`).
- **Memory (Claude's persistent notes, outside the repo):** `~/.claude/projects/…/memory/` — `MEMORY.md` is the index; `project_domigo_v2_master_status.md` is the authoritative inventory; per-area memories (`_track_c`, `_g3_fourteen`, `_g1_uplift`, `_design_system`, `_smart_review`, …) go deeper.
- **Plans (outside the repo):** `~/.claude/plans/` — notably `passover-g2-the-wrong-precious-forest.md` (the G4 plan, mirrored into `handover/13`).

**How to read this doc:** §1 intent · §2 execution · §3 how-it-works (architecture) · **§4 gaps/risks/review-targets (the part a reviewer wants)** · §5 open decisions · §6 how to pick up & review.

---

## 1. Intent — what this is meant to be

**Mission (`handover/06`):** rebuild DomiGo as a bulletproof EFL practice app for **Austrian AHS Klasse 1–4** (MORE! 1–4 textbooks, level **A1→A2**, ages ~10–14), rooted entirely in those textbooks. PWA-first on Vercel; grades 1–4 only (5B dropped). Go-live **September 2026**.

**The original phase plan (`handover/09`):** P0 bulletproof foundation (content rework · migration · stability) → P1 durable learning pillars (Study Path + Smart Review → Mock Tests → Listening) → P2 engagement (the 4 grade games + PWA) → P3 optional social.

**Why the rebuild (the single most important fact):** the v1 **beta failed on content quality, not features** — students hit untaught words, correct answers marked wrong, a shaky translation task. The whole architecture exists to make that impossible: a *level gate* over everything a student sees, a *forgiving 4-tier grader*, and *item-by-item verification against the textbook*. **A reviewer should treat content correctness as the #1 risk, not a solved problem.**

**The 10 content principles + the 9 game Laws (`handover/08`, `10`)** are the non-negotiable guardrails. The load-bearing ones a reviewer must be able to check:
- **Level gate:** nothing student-facing above the learner's cumulative unit unless glossed inline `(= deutsches Wort)`.
- **Du-form only** in student German; **zero meta/teacher-talk** (grammar jargon lives in teacher views).
- **One grading brain (Law 5):** every mode grades via `@domigo/engine`; no second grader, no third XP pool.
- **Progress derives from attempts (Law 2):** XP/streak/unlocks derive server-side from `practice_attempts`; game saves are cosmetic — a wiped save loses position, never progress.
- **Failure changes pace, not position (Law 3):** no HP/lives/energy, no XP loss; wrong → reveal + re-queue.
- **Spaced retrieval is one service (Law 6):** `getDueRefs` powers Smart Review *and* game encounters.
- **Bulletproof (Law 9):** checkpoints ≤90 s, offline outbox, no dead ends, class-scale tested before go-live.

---

## 2. Execution — what shipped and how it was built

**78 PRs merged to `main`** (`#1`–`#78`; verify with `gh pr list --state merged`). The arc:

| Range | What | 
|---|---|
| #1–#17 | **P0 content** — the deterministic pipeline (generate → 4 verify lenses → validate V-1…V-22 → Fable stage-8 review) → **57/57 units, 5,898 items, 0.0% reject**, 96 structures. |
| #18 | **Foundation harness** — `content-loader` + `engine` (the 4-tier grader) + `task-ui` (renders/grades all formats) + `/practice`. All 5,898 items self-grade correct. |
| #19–#24 | **Track A Smart Review** — `@domigo/db` (Neon, Leitner) + `/api/attempts` + live-DB verify + NextAuth + `/review` + streaks + offline outbox. |
| #25–#27 | **Track B** — Study Path `/learn` + Listening `/listening` + Mock Tests `/tests`. |
| #30–#39 | **Game foundation** — `game_saves` + `game-core` + `art-gen` + the story pipeline (VS-1…VS-12) + G0 contracts + the G1 overworld slice. |
| #40–#60 | **G2 "The Wrong Name"** — 15-ch detective + the complete Part-6 pedagogy (economy, Evidence Board, Input→Guided→Output ladder, retries, variant carriers, comprehension, spaced retrieval, finale, teacher mastery, read-aloud). |
| #61–#71 | **G3 "FOURTEEN"** — 14 episodes + season board + comprehension + art (+ the #62/#63 brand design system across all 4 grades). |
| #72–#78 | **G1 "Lost Pages" uplift** — a per-zone theming engine + all 15 units authored as bespoke zones + comprehension + hub board + art pipeline. |
| #79 | **Docs status reconcile** (this session). |

**The build playbook (used for every game — reuse it for G4):** **G0 contracts → a vertical slice (formal GO/NO-GO with Koki) → content waves (chapter/episode/zone-by-zone) → enrichment (comprehension + hub board + art).** Each step is one or a few PRs, off `main`, gate-green, Koki merges.

**The content pipeline (`packages/content-pipeline`, `pnpm content …`):** content is **regenerable, not hand-edited** — you author into the canonical source (word banks / drafts / variants) and re-run; the gate is the safety net. Stories go `import` (legacy → `draft.json`) → gen (rewrite every line in-bank-or-glossed) → `validate-story` → `variants` → release. **Hand-editing generated JSON is a mistake — fix at source.**

**The additive-DB discipline:** all v2 tables live in the `domigo_v2` Postgres schema on the shared Neon DB; **v1's `public.*` is never DDL'd or written.** Migrations are `CREATE`-only; prod DDL is runbook-gated (`pg_dump` first, apply committed SQL, never `db:push` to prod). Dev work uses a Neon branch + gitignored `.env.local`.

---

## 3. How it works — the architecture end to end

**Monorepo packages (`packages/`):**
- **`content-schema`** — zod schemas for every content type: `VocabItem`/`GrammarItem`/`WordBank`/`GrammarStructure`, the sibling gradeables `listening@1`/`test@1`/`comprehension@1`, the game contracts `story@1`/`map@1`/`quest@1`/`encounter@1`, and `cast`/`names`/`variants`/`release`. Also `presentation.gameMeta` (distractor pools, chip budgets) + `difficulty`.
- **`content-loader`** (server-only, `node:fs`) — `loadUnit`/`loadWordbank`/`loadStory`/`loadGameMap`/`loadStoryComprehension`/… — reads + overlay-applies + schema-validates. Never imported into a `"use client"` module.
- **`engine`** — the one 4-tier grader (`gradeVocab`/`gradeGrammar`, 13 formats: canonicalize · Levenshtein · partial-match · all-or-nothing) → `Tier` (correct/partial/close/wrong) + `xpForTier`. Pure, DOM-free. **The single grading brain.**
- **`task-ui`** (client) — renders + grades all formats + vocab; the gloss/hint reveal, the `hideHint` scaffold-fade, the forgiving-retry escalation. **The one place tasks are drawn** — every game mounts it as a DOM overlay.
- **`db`** (Neon HTTP, `domigo_v2`) — tables `practice_attempts` (the ledger), `review_queue` (Leitner 5-box), `user_progress` (xp/streak), `study_path_progress`, `writing_submissions`, `game_saves` (cosmetic ≤64 KB, last-write-wins). Services: `recordAttempt` (idempotent), `getDueRefs`/`getDueCounts`, streak helpers, `getSolvedGameItemIds` (derives game economies). Read-only `v1.ts` mirrors of v1's users/classes.
- **`content-pipeline`** — the `pnpm content` CLI (generate/verify/validate/status/story/variants + `validate-listening`/`validate-test`/`validate-story`) + the cumulative level gate (`cumulative-bank.ts` `buildAllowedMatcher`).
- **`game-core`** (pure TS) — quest/encounter state machines (`resolveEncounterTasks`), save schemas, perf presets. **`game-2d`** (Phaser overworld: `OverworldScene` + `PhaserGame` + `DialogueOverlay`) → G1. **`game-detective`** (DOM+SVG) → G2. **`game-novel`** (DOM+SVG) → G3. **`art-gen`** (procedural tileset/sprite/theme generators). Games never import each other — they meet at `game-core`/`content-schema` contracts.

**The app (`apps/web`):** routes `/home /practice /review /learn /listening /tests /admin` + `/play/[grade]/[zone]` (the games, mounted `next/dynamic` ssr:false). APIs `/api/attempts` (3-ref grading), `/api/study-path`, `/api/writing-submission`, `/api/game-save`. Auth = NextAuth v5 (student + teacher, read-only on `public.users`); the identity seam is `lib/identity.ts` `getActingUser`.

**The core data flow (every practice/game task):** render via `task-ui` → answer → `POST /api/attempts` (server re-grades via `engine`, idempotent on `clientAttemptId`, best-effort, offline-outboxed) → `recordAttempt` bumps XP + updates the Leitner queue + advances the streak → games derive their surfaces (Evidence/Season/Zone boards, unlocks) from `getSolvedGameItemIds`. **One grading path, everywhere.**

**The game runtime (overworld = G1, the model for G4):** a `map@1` zone → a released `story@1` chapter; `OverworldScene` renders the player + `E`-node encounters (`getDueRefs` due items, else in-scope random) + the `F`-NPC (opens `DialogueOverlay`, which walks scenes, renders `taskSlots` inline via `task-ui`, and renders `Choice[]` branches as buttons). Cosmetic position/cleared-nodes checkpoint to `game_saves`; progression derives from attempts.

---

## 4. ⚠️ Known gaps, risks, tech-debt & review-targets — *start here if you're reviewing*

### 4a. Gaps (unbuilt / incomplete — measured against the plan)
- **G4 "Syntaxia" — not started.** The one unbuilt grade game. Full design + roadmap in `handover/13_g4_syntaxia.md`; **one narrative decision is open** (Koki reviewing 3 options). Completes the game layer 4/4.
- **Listening/Test content waves — 1 of 57 units.** The runtimes (`/listening`, `/tests`) are done, but only the `g2-u03` pilot has `listening.json`/`test.json`. **This is the single largest remaining effort and the biggest lever on actual learning value.** See `runbooks/content-waves.md`.
- **TTS audio — not generated.** All listening uses the Web-Speech fallback (device-variant, leaks the transcript in page source). A `gen-audio` pipeline + a provider pick is spec'd in `handover/11` §3.
- **B2b teacher writing-grading — not surfaced.** `/tests` captures `writing_submissions`, but no teacher UI grades them. Spec in `handover/11` §1.
- **Track D (gates go-live) — none done:** migration of post-2026-05-17 Firebase signups; the **Bulletproof-Beta checklist** (esp. the **~30-concurrent class-scale attempt test** — never run); PWA install + offline shell; Firebase retirement + a v1 frozen-XP reconcile.
- **Real art — mostly procedural.** G2 has wired ligne-claire raster art; G1/G3 have committed *prompt libraries* but the PNGs aren't generated (procedural fallback renders). G4 art is unstarted.
- **Not done:** dark mode; native (Capacitor) eval; P3 social.

### 4b. Risks & review-targets (what to scrutinize, and why)
1. **Content correctness at scale — the original beta failure.** 5,898 items are pipeline-generated + Fable-reviewed and self-grade correct, but "self-grades correct" ≠ "correct against the textbook." **A reviewer should spot-check a sample of items against MORE! 1–4** (answer keys complete? distractors plausible? translations right both ways? above-level words glossed?). This is the highest-value review.
2. **The level gate has a known over-grant.** The quick probe (`buildAllowedMatcher(...).unknownTokens`) is *looser* than `validate-story` VS-2 — it grants structure/everyday words (been/by/let/say/only) that VS-2 flags as above-level. **`validate-story` is authoritative; the probe is a first pass.** Verify story content was validated, not just probed. (This bit every content wave.)
3. **Game verification is partial by construction.** The Phaser overworld (G1, and G4) **cannot be driven headless** — Phaser ignores synthetic/untrusted keyboard events, so in-canvas dialogue/tasks/encounters/bosses were validated via `validate-story` + data-path resolution checks + the *DOM* surfaces (boards/overlays), **not** live E2E. The DOM games (G2/G3) are more testable but their deep interactions likewise lean on data-path checks. **A reviewer should run the games on a real device** — this is the least-covered surface.
4. **Class-scale is unproven (Law 9).** The DB layer is verified on a dev branch, but the ~30-concurrent attempt test is not done and **prod DDL has not been applied** (runbook-gated). Persistence/idempotency under real load is a go-live gate, not a done item.
5. **Law adherence — audit each game against `handover/08`+`10`.** Concretely: no game defines a second grader or XP pool (Law 5)? progression never reads the cosmetic save (Law 2)? no HP/lives/timers-on-new-material (Law 3/8)? VS-5 proves no dead-end branches? no unglossed flavor text (the level gate over *every* student-facing string, incl. NPC lines/signs/choices)? no meta-talk (VS-8)?
6. **The derive-vs-cosmetic boundary is subtle.** `game_saves` is cosmetic-trust (wipeable, LWW, ≤64 KB); anything that must not be cheatable derives from `practice_attempts`. For the planned G4 hint-economy this is *why* companion unlocks derive but Ink charges can be cosmetic (they buy scaffolds, not answers). **A reviewer should check nothing progression-bearing leaked into a save.**
7. **Bundle budgets (Law 9 / `check:bundle`).** Phaser must stay isolated in one lazy chunk (≤600 KB overworld; other chunks ≤150 KB). The G1 zone-board needed a Phaser-free subpath export (`@domigo/game-2d/board`) to avoid leaking Phaser into the server-rendered hub. **Any new game/board import must respect this** — `check:bundle` is the guard.
8. **Regenerable content + squash-merge gotchas.** Hand-edited generated JSON gets overwritten on regen — fix at source. After a squash-merge, branches are stranded — always branch fresh off `main`.
9. **Docs drift.** These docs drifted ~6 weeks before the #79 reconcile. `STATUS_AND_ROADMAP.md` is the source of truth; keep it and `00_START_HERE.md` current when work lands.

### 4c. Improvement opportunities (beyond closing the gaps)
- Prioritize the **content waves** — the largest learning lever, and mechanical enough to parallelize.
- A **real cheap-Android perf gate in CI** (Playwright, 4× CPU throttle) per the Law-9 budget — currently only `check:bundle` guards perf statically.
- Generate the **real art** (the prompt libraries exist for G1/G3).
- The **G4 hint-economy** is a novel mechanic — worth design scrutiny before it ships (see `handover/13`).
- A **memory/docs consolidation** pass (many per-area memories; the `consolidate-memory` skill exists).

---

## 5. Open decisions (need Koki, flagged in `handover/09` + this session)
- **G4 narrative** — which of the 3 options (`handover/13` §3). *Blocking the G4 build.*
- **TTS provider** (OpenAI `tts-1` recommended) · **native timing** (PWA-only vs Capacitor, and when) · **mock-test grading split** (auto vs teacher hand-grading) · **P3 social** (build which, or drop + remove dead toggles) · **interim beta vehicle** (hardened-v1 vs wait for v2).

## 6. How to pick up & review
- **Work in `~/Code/domigo-v2`.** Read `handover/08` (the guardrails) before any change. Branch off `main` (`feat/<name>` or `docs/<name>`); **never a bare `#N` in a commit message** (it auto-closes that PR); end commits `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`; **leave PRs unmerged for Koki**.
- **The gate (every code PR):** `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm content validate-story && pnpm build && pnpm check:bundle`.
- **Verify in the browser** via the `preview_*` tools (dev server on the domigo-web preview): screenshot the DOM surfaces; for games, remember the headless-Phaser limit (§4b.3) and lean on `validate-story` + data-path checks; the real proof is a device + kid testers.
- **Content work:** author into the canonical source + re-run the pipeline; `validate-story` is authoritative over the probe. Corpus is regenerable.
- **DB work:** additive-only in `domigo_v2`; dev Neon branch; prod DDL runbook-gated.
- **To resume G4:** get the narrative pick, then follow `handover/13` §5 (G0 → slice → GO/NO-GO → waves → enrichment).
