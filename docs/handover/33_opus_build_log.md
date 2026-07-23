# Doc 33 — the Opus 4.8 build log (Painted-Book ch01 rebuild)

**Purpose:** Fable 5 spent its contingent at the design freeze (#228); Opus 4.8 executes
the build lane and Fable reviews later. This log is the concrete, step-by-step record of
that execution — workflow, decisions, and verified successes — so the review has ground
truth. fable-method is binding (ground-truth boot, calibration-first, hostile self-review,
independent verification, state upkeep, communication contract); opus-tuning dial sheet
applied. Baby steps, each verified before the next.

## Start point (verified 2026-07-23, handover)

- **Ground truth:** `main` HEAD = `9a1bde2` (#228 merged 15:51Z). No open PRs. All tuning-
  round PRs merged (#224 trust · #225 keen-archive · #226 playability-proof · #227 dossiers
  · #228 gate-verdict-v2). Design is FROZEN.
- **Governing spec:** `docs/design/g1/paint/ch01-dossiers/` (README verdict-log G1–G13 +
  p1/p2/p3/arena/bonus + tasks.md), `docs/study/rayman/visual-language-v2.md` (VL laws incl.
  1.2b Topic-Material), `~/.claude/plans/passover-the-shimmying-dewdrop.md`.
- **Codex:** AC (world art, 31 cards) + AD3 (hero transformation) running in the background;
  outputs land in `~/Code/codex-lab/01_PROJECTS/domigo/codex-work/`. The build does NOT block
  on art — the art honesty gate (`check-paint-art.mjs`) bridges pending stems via the dated
  allowlist.

## Build lane (baby steps, per the amended plan order ⑤→⑥→④)

- **Build-A** — gameTasks@2 schema + renderTaskText projection + 10 calibration exemplars
  (real validated JSON) + tests. Data layer only; the running game is untouched. Home:
  `@domigo/content-schema`. ← current.
- **Build-B** — card kit core (`packages/game-paint/src/cards/`): tap-first state machines
  + painted skins + CardShell + the new hint ladder + routing v2.
- **Build-C** — motion kinds: wheel (spin → tap-to-lock, G9), memory, the name-console beat.
- **Build-D** — full-stack ch01 rebuild: 5 phase grids to the dossiers (interior start,
  topic-material terrain, moving Tafel, prologue), the full 43-card v2 set, batch-AC wiring,
  proof tapes; loader migrates v1→v2. One review run with level AND tasks → Koki replay 2.

## Standing laws honored every step

One PR at a time (Koki merges); branch before first commit, never main; full gate set green
before every PR (`vitest` · `tsc` · grounding · sheets · paint-art · web build · bundle
1×Phaser); red-first tamper checks on new validators; deploy-truth + hash before any Koki
playtest; tri-surface log (repo · Mission Control · PLATFORM MASTER) after every step.

---

## STEP LOG

### Build-A — gameTasks@2 schema foundation — ✅ DONE (PR pending)
Decisions recorded up front (opus-tuning §9 — minor calls are mine, recorded):
- **Schema home:** `packages/content-schema/src/game-tasks.ts` (shared, not server-only) so
  the client card-kit imports types without a server-only cycle; `paint-content.ts` (server)
  imports it for loading in Build-D.
- **Kinds in the union now:** the 8 ch01 kinds (choice · wheel · spell · order · oddone ·
  mistake · typed · memory). match/sort/slider deferred to ch02/03/04 (G12) — added when
  those chapters build; renderers-ahead-of-need is waste.
- **No live change:** exemplars in `ch01.tasks.v2.json` (calibration file), NOT the live
  `ch01.tasks.json`; `loadPaintTasks` untouched. The loader migrates in Build-D.

**Delivered + verified:**
- `game-tasks.ts` — discriminated union on `kind`; required `stimulus` (text|image|entity,
  the F22/G10 law); cross-field invariants centralized in `taskInvariantErrors()` (reused by
  zod refine AND the CLI gate — one source of truth); `deriveGapHints` (firstLetter + per-word
  counts, the F18 ladder data, DERIVED never authored); `seededShuffle` (shared, so the
  blind-solve projection == the student's option order); `renderTaskText` (the projection).
- `ch01.tasks.v2.json` — 8 calibration exemplars, one per kind, to Koki's signed-off bar.
- Tests: `content-schema` 39/39 (was 27 → +12), incl. a red-first tamper block proving every
  invariant fires on a single-task parse, projection/hints/shuffle goldens, and the exemplar
  file parses covering all 8 kinds.
- `scripts/check-game-tasks.mjs` — the CI authoring gate: schema + grounding (every EN token
  ∈ u01) + giveaway + register, over every `*.tasks.v2.json`. Tamper-checked RED (ungrounded
  token + giveaway both fire) then green after revert. Wired into `ci.yml` + `pnpm check:game-tasks`.
- **★ Class fix found + fixed:** the register ban `"schrei"` false-positived on *schreiben*
  (to write) / *Kugelschreiber* — fatal in a writing-centric school unit. Made boundary-aware
  (`/schrei(?!b)/`) in BOTH the new gate AND the shared `check-story-grounding.mjs` so the law
  is consistent; the latter re-verified still-green. (Pitfall registry note queued.)

**Full gate set green (verified this session):** content-schema 39/39 · game-paint 144/144
(untouched) · content-schema/game-paint/web tsc 0 · web build 0 · check-story-grounding ·
check-design-sheets · check-paint-art · check-game-tasks · bundle 1×Phaser. Design fault
found during A2: I'd put invariants only on the file superRefine, so a single-task parse
skipped them — moved the refine onto the union (self-validating), file-level keeps only the
dup-id law. Caught by the red-first test failing as it should.

**As-built note for Fable's review:** the schema intentionally folds the old `storyDe` into
the framing line and ADDS `stimulus` beside it (not a replacement) — `storyDe` stays the
always-present DE instruction; `stimulus` declares the on-screen carrier. `promptEn` optional.
The name-console (G6) is NOT a task kind — it's a boss story-beat for the card kit (Build-C).

### Build-B (logic core) — ✅ DONE (PR pending) — the card kit's brains
Decisions (opus-tuning §9, recorded):
- **Split Build-B in two:** this PR = the PURE logic (state machines + hint ladder + routing),
  headless + fully tested, imported by NOTHING but its tests → zero live-game risk. The
  painted React skins + CardShell + drag hook + PaintGame wiring + loader v1→v2 migration are
  the NEXT sub-step (B-skins), which touches live rendering and gets a browser proof.
- **Uniform machine interface:** `init(task,seed) → state · act(state,action) → state ·
  grade(state) → pending|correct|wrong · solve(state) → winning actions` — solve() reads the
  ALREADY-shuffled state so parity tests drive the real solution against the real tray.

**Delivered + verified:**
- `cards/machines.ts` — 8 pure state machines (choice · typed · spell · order · oddone ·
  wheel · mistake · memory) + `MACHINES` registry + `autoSolve` + `normText`. Wheel models
  G9 (rotate then lock). Mistake is two-phase (find → fix, remove-mode = find IS the fix).
  Memory is forgiving (pending until all matched, mismatch clears on next flip).
- `cards/hint.ts` — the F18 hint ladder: `renderGapHint(answer, level)` (0 nothing · 1 first
  letter "P…" · 2 exact slots + count "P _ _ · 3 Buchstaben") + `gapSlots`.
- `cards/routing.ts` — deterministic playlists: `nextTask(items, use, state)` round-robins the
  pool in file order with a single no-repeat-kind skip. No RNG.
- Tests: +31 (game-paint 144 → 175). PARITY: all 8 exemplars auto-solve to correct against
  their real shuffled trays; per-kind wrong-path + behaviour cases (undo, reuse-guard, wheel
  wrap, memory mismatch-clear, mistake wrong-word/remove-mode); hint goldens; routing order +
  skip + per-use cursors.

**Full gate set green:** game-paint 175/175 · tsc 0 · story-grounding · game-tasks (8) ·
design-sheets · paint-art · web build 0 · bundle 1×Phaser. (Note to self, 3rd time: never
pipe a gate through grep for its exit code — grep's exit masks tsc's. Run raw.)
