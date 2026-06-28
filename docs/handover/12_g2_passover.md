# 12 — PASSOVER: G2 "The Wrong Name" + pedagogy track

> **Paste this to continue DomiGo v2's Grade-2 detective game and its pedagogy upgrade in a fresh session.** Self-contained; the linked docs/memory go deeper. Last refreshed **2026-06-28** (after PR #49 merged).

---

## 0 · Do this first
1. `cd ~/Code/domigo-v2 && git checkout main && git pull` — your local HEAD may be a merged `feat/*` branch; the tree should be clean. ~18 merged `feat/*` branches are stale and safe to prune.
2. Read the plan of record: `~/.claude/plans/domigo-v2-velvet-squid.md` — **Part 6** = the pedagogy roadmap, **Part 5** = art placement, **Parts 1–2** = the story bible. Skim the **9 Laws** at `10_game_layer.md:24–51`.
3. **Next task = the persistent hub Evidence Board** (see §3). Cadence: build **one PR off `main`**, browser-verify, hand to Koki to merge, then continue.

## 1 · Who & what
- **Koki** (Orhan Vehabovic): EFL teacher at Gymnasium der Dominikanerinnen (Vienna), MA on AI in EFL. Audience = **AHS 2. Klasse, ~11–12 yo, A1+/A2, MORE! 2**. Go-live **Sept 2026**.
- **DomiGo v2:** Next 16 / React 19 **pnpm monorepo**, repo `VEHO-DOMI/domigo-v2` at `~/Code/domigo-v2`, prod **domigo-v2.vercel.app** (Vercel deploys **pre-approved**, incl. `--prod`). Neon Postgres (schema `domigo_v2`, **additive-only — never touch `public.*`**). Do git work **here, not the iCloud clone**.
- **The G2 game = "The Wrong Name"** — a fair-play, moral-twist **"Correction" mystery**: the apparent medal theft is actually someone *righting* an earlier injustice; the real culprit cheated first. Detectives **Mina & Theo**; **Lena** (wronged inventor, seen sad early → happy at the end), **Ben** (sympathetic "thief"), **Dani** (real cheat), **Max** (red herring). **Each MORE! 2 unit's grammar IS a deduction tool** — past-simple = reconstruct, comparatives (U4) = the crack, directions (U5) = alibis, time-markers (U8) = timeline, *whose* (U11) = ownership, present-perfect (U12/14) = proof. Fair-play: every reveal rests on a clue the student personally solved as a task.

## 2 · What's live on `main` (PRs #40–#49 merged; no open PRs)
The **complete 15-chapter game**:
- DOM+SVG renderer `@domigo/game-detective`; per-grade dispatch (`/play/[grade]` hub → `/play/[grade]/[zone]`).
- **56 taskSlots** = a **receptive → guided → production** ladder in every chapter (all existing approved items).
- The **detective economy**: Clues / Case Progress bar / Hot Trail streak / a per-chapter Evidence Board.
- **German-as-hint** (G2 only — behind an "Auf Deutsch?" toggle; G1 keeps its always-on subtitle).
- **Ligne-claire art** wired via a decoupled `art.json` manifest with procedural fallback (126-prompt library at `docs/art/`, ~8 images generated so far).
- A **task-ui accessibility pass** (benefits every mode).

G1 overworld RPG (5 story zones) and Track B (Review / Study Path / Listening / Mock Tests) are also live.

## 3 · Part 6 pedagogy phases — status + what's next
**Governing rule (HARD):** *every task is a clever, natural in-story detective move — never a drill* ("tasks ARE clues", elevated; the **diegetic-QA gate** enforces it: read a chapter's dialogue + tasks with grammar labels hidden — it must play as one continuous investigation). Bar = the **9 Laws**. Reuse-first; **no new XP pool** (Law 5 — Clues are re-labelled XP).

- **Phase 0 (bulletproof + a11y):** a11y SHIPPED (#47); checkpoint-on-answer effectively present (`DetectiveGame` saves via `addClue` on every solve + on scene change). **Remaining: pause-on-blur veil** (`visibilitychange→hidden` → paused veil + flush; resume on focus) + confirm throttled mid-chapter resume.
- **Phase 1:** 1a ladder (#49) ✓ · 1b German-as-hint (#48) ✓ · 1c economy (#48) ✓ **EXCEPT → NEXT TASK: the persistent hub Evidence Board** — `/play/2` shows **all** Evidence Pieces (the chapters' real clues; art already mapped in `art.json` `clues{}`), **locked/unlocked derived from completed chapters** (from the ledger, no new pool). Extend `EvidenceBoard` in `packages/game-detective/src/art.tsx`; derive the unlocked set in `apps/web/lib/story-art.ts`/loader; render in `apps/web/app/(game)/play/[grade]/page.tsx`. · **1d forgiving retries** (task-ui): 1st wrong → "False clue! Try again" (re-enable), 2nd → reveal `hintDe` Tipp, 3rd → show example; no points lost, item still re-queues. Shared renderer → benefits every mode.
- **Phase 2** scene-embedded carriers via `presentation.variants` + `taskSlot.variantKey` (a comparatives clue reads "Lena's machine flew ___ (far) than Dani's", not a generic sentence). · **Phase 3** dialogue-comprehension as a new `.ci.` sibling-gradeable type (per-chapter `comprehension.json`, cast to GrammarItem like `.ri.`/`.li.`). · **Phase 4** in-story spaced retrieval — reuse `getDueRefs` + `resolveEncounterTasks` as "re-interview" beats. · **Phase 5** scaffold fade (derive `scaffoldLevel` from `chapter.unit`; pass the existing `hideHint` prop from ~ch10+). · **Phase 6** deduction choices + the **"Solve the Case" finale** (consumes the hub Evidence Board — the collected pieces crack the final deduction). · **Phase 7 (later)** teacher mastery view + audio/TTS.

## 4 · Architecture & reusable seams (DO NOT rebuild)
- **One grading brain:** `@domigo/engine` `gradeVocab`/`gradeGrammar` (13 formats), 4-tier (`correct/partial/close/wrong`), `xpForTier(difficulty*10, tier)`, wrong = 0, never negative.
- **One DOM renderer:** `@domigo/task-ui` `GrammarItemView`/`VocabItemView` — props `hideHint`, `hideXp`, `autoFocus`; `FeedbackBar`. All 13 formats render+grade incl. production (tf/qf/sb/anagram).
- **Ledger + Leitner:** every task → `POST /api/attempts` `mode:"game:g2"` `context:{chapterId,sceneId,slot}` → `recordAttempt` (idempotent; queues vocab/grammar) + `review_queue` 5-box. `getDueRefs`/`updateReviewQueue` in `packages/db/src/review.ts`.
- **Story content:** `story@1` (Chapter.unit non-decreasing gate; Scene{speaker, textEn, scaffoldDe, glosses[], audio, taskSlots[], next:SceneId|Choice[]|null}); validator `packages/content-pipeline/src/validate-story.ts` = **VS-1…VS-10** (VS-2 level gate, VS-3 du-form, VS-4 taskRefs ≤ gate unit, VS-5 reachability). Gate matcher = `buildAllowedMatcher(slug)` in `packages/content-pipeline/src/cumulative-bank.ts`.
- **G2 renderer:** `packages/game-detective/src/{DetectiveGame.tsx, detective-copy.ts, art.tsx}`. `DetectiveGame` renders **one** `scene.taskSlots[0]` per scene → multiple tasks need multiple scenes. `detective-copy.ts` = the text bank (`COPY`, `resultLine`, `trailLabel`, `EVIDENCE` map).
- **Art:** `content/corpus/stories/g2.st.wrong-name/art.json` (story-art@1: cover/endCard/chapters/portraits/beats/clues) → `loadStoryArt` (content-loader) → `apps/web/lib/story-art.ts` resolves only-present files from `public/art/g2/` → all render slots have **procedural fallback**. Generators: `docs/art/{build-g2-prompts,build-art-json,sync-art}.mjs`.
- **Save/offline:** cosmetic `game_saves` (chapter/board progress; XP/unlocks derive from attempts), `apps/web/lib/attempt-outbox.ts` (IndexedDB) + `useOutboxFlush`.

## 5 · The detective economy (Koki's model — already built)
The student never sees "XP" inside the case. **Clues = re-labelled awarded XP** ("+10 clues") with a **Case Progress** bar; **Hot Trail** = the streak; **"False clue! Try again"** = a wrong answer (nothing shown lost, Law 3). **A Case File = one chapter** (not standalone mini-cases). Completing a Case File unlocks its **Evidence Piece = the chapter's real clue** (the card, the chart, the medal, the key…) — which the Phase-6 **"Solve the Case"** finale consumes. The UI lexicon (clue/case/evidence/trail) is level-gated + glossed-on-first-use; avoid hard words (investigation/alibi/suspect). All strings live in `detective-copy.ts`.

## 6 · Conventions, cadence & gotchas (the landmines)
- **Cadence:** one PR per turn off `main`; **Koki merges himself**; then continue. Browser-verify before handing over.
- **Commit trailer:** `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`. **PR body ends with** `🤖 Generated with [Claude Code](https://claude.com/claude-code)`. **Never a bare `#N`** in a commit message (it auto-closes that PR).
- **Gate:** `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm build` (+ `pnpm content validate-story` for story edits, `pnpm check:bundle` for game bundles). New packages test via `node --test "src/test/*.test.ts"`.
- **tsconfig:** `erasableSyntaxOnly` (string unions, **no enums**), `verbatimModuleSyntax` (`import type`), `noUncheckedIndexedAccess` (guard every index). Server-only loaders never import into `"use client"`. Lint bans setState-in-effect → use **lazy `useState` init**, not `useEffect`.
- **story.json edits = TEXT-level, never `JSON.stringify` re-serialize** — scenes are mixed compact/multi-line; re-serialize = a ~1600-line diff. (Phase 1a used a string-replace script.)
- **g2 level-gate banlist (the big one):** the cumulative gate is FAR stricter than intuition. A unit's **headline grammar lives in the TASK ITEMS, not free dialogue** (should/might/will/whose/ever/never/just/so-do-i all fail VS-2 in dialogue), plus everyday words (someone/say/took/went/name/card/medal/only/real/old/gone/brother/true/won…). Workarounds: indefinite culprit = "a friend"; gloss cognates (medal/card/name/case); compositional phrases (have to / turn left) pass. **Probe EVERY student line vs `buildAllowedMatcher("g2-uNN")` BEFORE writing** (a ~30-line script catches it all).
- **Dev server:** preview name is **`domigo-web`** (global; do NOT add a repo `.claude/launch.json`). Dev identity via `apps/web/.env.local` (`DEV_USER_ID`/`DEV_CLASS_ID` + dev Neon branch). `/play` is intentionally **out of the middleware matcher** (page self-guards) — keep it out or dev-login breaks. Zsh: `UID`/`EUID` are reserved — use another var in loops.
- **Stacked-merge hazard:** if you stack PRs, retarget children to `main` **before** deleting a base branch (deleting a base CLOSES child PRs). Prefer independent PRs off `main`.

## 7 · Key files & pointers
- Story bundle: `content/corpus/stories/g2.st.wrong-name/{story,cast,names,release,art}.json`.
- Renderer: `packages/game-detective/src/{DetectiveGame.tsx, detective-copy.ts, art.tsx}`.
- Hub/route: `apps/web/app/(game)/play/[grade]/{page.tsx, [zone]/page.tsx, GameClient.tsx}`; art resolver `apps/web/lib/story-art.ts`; attempts `apps/web/app/api/attempts/route.ts`.
- Plan: `~/.claude/plans/domigo-v2-velvet-squid.md` (Part 6 pedagogy, Part 5 art). Bible: `docs/handover/10_game_layer.md`. Remaining work: `docs/handover/11_remaining_work.md`. Memory: `project_domigo_v2_track_c.md` (running log), `project_domigo_v2_g2_art_prompts.md` (art library).

## 8 · Verify the next slice (hub Evidence Board)
Gate green; dev server `domigo-web`; `/play/2` shows the case-file hub **plus** a cross-story Evidence Board where pieces for completed chapters are unlocked (with their `clues{}` art) and the rest are locked; completing a chapter unlocks its piece on return; missing images fall back to procedural; 0 console errors; screenshot. No `validate-story` needed (no story content change).

## 9 · Beyond G2
G3 **FOURTEEN** + G4 **Syntaxia** games (Track C, not started); **content waves** (listening.json/test.json for 57 units); **B2b** teacher writing-grading UI; **TTS** (`gen-audio` stage; the player already prefers `audio.file`); a physical **cheap-Android perf pass** before go-live. Full detail in `11_remaining_work.md` + `10_game_layer.md`.

---
_Created 2026-06-28. Paste-ready copy at `~/.claude/plans/domigo-v2-g2-passover.md`. Supersedes the broad rebuild-era `PASSOVER_PROMPT.md` for the current G2/pedagogy work._
