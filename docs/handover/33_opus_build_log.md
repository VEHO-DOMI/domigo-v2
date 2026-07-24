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

### Build-B (skins) — ✅ DONE (PR pending) — the painted card faces, wired + browser-proven
Decisions (recorded):
- **All 8 kinds are tap-first** (spell/order = tap the tray in sequence, wheel = ▲▼ + tap-to-lock,
  mistake = tap word → tap fix, memory = tap to flip). Drag is a later polish, NOT a blocker —
  so this step delivers a complete, solvable card system by tap.
- **Full-stack wiring:** server `loadPaintTasksV2` (validates via GameTasksFileV2) → page.tsx →
  BuchClient (GameTaskV2[]) → PaintGame. `pickTask` replaced by cards/routing `nextTask`. The
  inline choice/typed Overlay branch replaced by `<CardHost key={task.id}>`. The live game now
  runs the v2 card kit on the 8 calibration exemplars (Build-D swaps in the full 43).
- **Bundle tradeoff (measured):** the card kit pulls zod into the lazy game chunk (largest
  non-Phaser 69→92 KB gz). Guard passes (Phaser still isolated, under budget). If it ever
  matters, split content-schema's pure helpers (seededShuffle/deriveGapHints) from the zod
  schemas — noted, not done (measure-first, it's fine).

**Delivered:**
- `cards/CardShell.tsx` (painted frame: stimulus + story + prompt + F18 hint ladder + „Später"),
  `cards/skins.tsx` (8 tap-first skins), `cards/CardHost.tsx` (machine glue: fold dispatched
  actions → grade → resolve/escalate; array-dispatch for single-tap-commit kinds).
- Wiring: `paint-content.ts` (loadPaintTasksV2), `page.tsx`, `BuchClient.tsx`, `PaintGame.tsx`
  (GameTaskV2, routing, CardHost, harness task() → {id,kind}).

**Verified — full gate set green:** game-paint 175/175 · game-paint + web tsc 0 · web build 0 ·
bundle 1×Phaser (310 KB). **BROWSER-PROVEN in the real game** (/play/1/buch, dev): three
distinct interaction models rendered + solved + resolved end-to-end — **choice** (button-tap,
door beat), **wheel** (G9 rotate → tap-to-lock, swarm→quickfire), **oddone** (multi-select
atomic array-dispatch, chaser→encounter). The v2 loader + routing served the correct card per
beat; every card showed the painted frame + stimulus + „Später"; correct answers closed the
overlay and resumed the world; ZERO console errors throughout.
- **Honest coverage note:** spell · order · mistake · memory · typed are NOT yet browser-clicked
  (spell/order render via the same proven tray-tap path; typed's input + the typing-guard are
  proven from PB-T1; all 8 kinds pass machine parity in the 175 tests). They trigger only on
  boss/quickfire beats that are fiddly to script here; Koki's playtest exercises them naturally.

### Build-D1 (PB-T9) — ✅ DONE (PR pending) — the full 43-card ch01 task set, blind-solve-hardened
The content half of the resequenced Build-D: the complete Unit-1 task set that the card kit
serves, authored to gameTasks@2 and put through the two-layer intelligence pass. (The phase-grid
rebuild + batch-AC art + tapes are the other half — Build-D2+, still ahead.)

**Delivered — 43 cards across the five ch01 pools** (`ch01.tasks.v2.json`):
- quickfire 14 (wheel×5 · spell×5 · choice×4) · encounter 10 (choice×6 · oddone×3 · mistake×1) ·
  door 8 (choice×8) · rescue 5 (spell×3 · order×2) · boss 6 (mistake×2 · order×2 · memory×1 · typed×1).
- **F17 (typing not predominant): typed is 1/43 = 2%** — every other prompt is tap/spell/pick.
- All eight kinds represented; complex kinds (memory) confined to boss, per F20.

**Two-layer intelligence pass (fable-method loop 5):**
- (a) **Deterministic:** machine `autoSolve` parity over all 43 — every card's winning path grades
  `correct` (57 spell/machine tests green).
- (b) **Independent:** 2 blind-solve agents (fresh context, student-view projection only) →
  unanimous 43/43 = provably solvable; a devil's-advocate agent found **6 real key-narrowness /
  ambiguity problems**. All six fixed as CLASSES, not instances:
  1. **Spell article-form ("a pen" longer than "pen")** → skin now shows EXACTLY answer-length
     slots and caps taps at that length, so the article form is *physically unbuildable*. Extracted
     the two decisions to pure helpers `spellSlots` / `spellTrayDisabled` (machines.ts) so the rule
     is unit-tested and can never drift from the skin.
  2. **Spell decoy collisions** (a tray that also spells another Unit-1 word of the same length,
     e.g. pen-tray→"ten"/"red") → systematic same-length-collision audit; every tray's decoys chosen
     so NO other Unit-1 word of the answer's length can be submitted (short words can't — the slots
     force full length). All 8 spell trays proven collision-free.
  3. **dt1 free-typed command ("open" vs "open the door") ambiguous** → converted typed→choice
     (Open!/Close!/Sit down!); stimulus reworded off "GESCHRIEBEN" to match a spoken-command card.
  4. **boss greeting typed accept too narrow** → accept-list broadened to hello!/hi/hi!.
  5. **c02 muddled pencil clue** → reworded to the accurate erasable-grey clue; leaking English
     prompt dropped.
  6. **enc.c06 pre-given count ("acht Punkte")** → removed so the child actually counts the 8 dots.
- **Re-verification of the 10 changed cards:** regenerated the student-view projections, diffed to
  isolate exactly the 10 touched, ran a fresh blind-solve agent on them → **10/10 unanimous with the
  key**, every tray sufficient, zero ambiguity flags; dot-count invariant (enc.c06 = 8) confirmed.

**Verified — full CI-parity gate set green:** typecheck · test (211, +1 new spell-view guard) ·
story-grounding · design-sheets · paint-art · game-tasks (43) · web build · bundle (Phaser 1×310 KB).
**Browser boot proven** (/play/1/buch, dev): server parsed the real 43-card file (200), Phaser canvas
mounted, harness live, phase p1, ZERO console errors. (Learning banked: the teacher debug-door phase
ids are p1/p2/p3 — arena/bonus are schema blocks *within* a phase, not mountable ids; `?phase=arena`
throws `Sim: unknown phase` by design, not a regression.)

### The Batch-AC art-review arc + Build-D2 grids (2026-07-23, Opus 4.8) — for Fable

This session, after #232 merged, ran the art-verification + level-authoring half of Build-D.
Full detail so you can audit the judgment calls.

**Batch AC review (31-sheet ch01 world kit).** Verified independently, never trusting Codex's
self-report. My own image-by-image pass + a re-run of every machine check in PIL (magenta
purity, loop-edge diff=0, cell-border margins, plate opacity — all clean) + TWO adversarial
critic subagents (a coverage/topic-material auditor and a quality flaw-hunter). Coverage 31/31
cell-by-cell; topic-material law 100% (no grass/earth/ice); F6/F9/G4/G10 all resolved (rich
painterly plates, readable checkpoint, moving Tafel, faceless-hooded prologue = CP-15 held).
- The flaw-hunt critic returned REDO for "style bimodality" (half glossy, half painterly). I did
  NOT rubber-stamp it: compared the flagged characters to the ALREADY-SHIPPED batch-AB enemies
  (AB-vs-AC image proof) — the new characters MATCH the shipped look, and the style key itself
  draws crisp characters on soft grounds, so character-vs-background finish difference is the
  established look, not a defect. Mined the critic for its REAL findings instead: a genuine pink
  ghost-scarf artifact on the kit_p1_steps coat-bench (verified: non-#FF00FF pink, would ship
  visible), and enemy-continuity drift in ent_states_a (pencil yellow/free vs shipped grey/roped;
  eraser palette). **Lesson banked: an adversarial critic's FINDINGS are gold, its VERDICT can
  overreach — decompose to findings, verify each, never gummistempel the verdict.**
- Art = Koki's taste authority → surfaced the finish call to him with the evidence. His verdict:
  unify the finish anyway. Wrote `CODEX_MASTER_PROMPT_AC2_FINISH.md` (12 sheets softened to the
  accepted exemplars + the 3 fixes; 19 accepted sheets untouched; continuity refs staged in
  batch-ac2/_refs/). Koki ran it.

**Batch AC2 review.** Same rigor. Folder ground-truth (all 12 present, dims ok) + PIL machine
audit (clean) + own pass + one flaw-hunt critic. Result: **30/31 accepted** — finish unified,
all 3 fixes confirmed (coat-bench ghost gone; enemies now match shipped grey/roped pencil +
blue-cream eraser + green heft, AB-vs-AC2 proof; chalk sticks legible). ONE holdout: ent_platforms
still glossy — verified directly (same ruler matte in vocab_a, glossy here). Wrote a one-sheet
re-run `CODEX_MASTER_PROMPT_AC3_PLATFORMS.md` (Koki running it); its 2 stems stay allowlisted so
it doesn't block wiring.

**Build-D2 — five ch01 phase grids, authored + verified.** Re-authored all five FROM SCRATCH
against the approved dossiers (nuke-not-patch): p1 Eingangshalle 64x22, p2 Klassenzimmer-Nacht
72x24, p3 Schulhof 64x26 (swing+ruler moving-platform crossing), p4 Tafel-Buehne arena 36x20,
p9 Kleckskammer bonus 44x20. Each verified GREEN against the REAL checkLevelLaws + reachability;
assembled = parse OK + ALL laws green (3 phases, 6 cages, 1 person-cage, closed-top, slopes,
spawn-standable, reachability, no trap-pockets).
- Built a reusable dev harness `scripts/check-level-candidate.mjs` (splices a candidate phase
  into the level, runs the real laws + a reachability map). Tamper-checked RED first (floated a
  cage → caught). It even caught a bug in ITSELF (I'd used one reach envelope for all cells;
  the real laws use (1,1,3) for letters/exit vs (2,2,4) for cages — fixed).
- **Design lesson banked**: checkLevelLaws is a conservative UNDER-approximation — a letter must
  sit <=1 row above a standable cell, so letter "arcs" are ascending platform staircases with
  letters atop; DOWN-and-across gaps fail (fall-drift is narrow at shallow depth) → chains go up,
  then fall back to the floor.
- Staged on branch `pb-d2-grids` under `docs/design/g1/paint/grids-v2/` (level.json UNTOUCHED so
  the old tapes stay green — the branch is fully green).

**Wiring scoped, not yet built.** Dug into the renderer and found the wiring is 4 deliberate
engine additions (entStateCell pose hook, per-phase bands, terrain-strip mapping, the p3
slippery-slide decision), not a blind copy — each needs a browser check. Full executable plan
with the cell->stem map, the 4 decisions, W1-W7 phases (each with CHECK+LOOP), and escalation
triggers is in **`docs/handover/34_build_d_wiring_plan.md`**. That is where the next session
picks up.
