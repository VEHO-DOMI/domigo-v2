> **ARCHIVAL COPY (made 2026-07-11 by Fable).** This is the verbatim Wave-2 plan as approved
> in-session on 2026-07-10, including the L-wave amendment — the ORIGIN document of the program.
> It is preserved for history and context; **it is NOT the working spec.** The authoritative,
> maintained version is `docs/BLUEPRINT_V2.md` in the domigo-v2 repo (this plan expanded into
> per-item executable specs, updated with every PR — e.g. WS-LOOK was added 2026-07-11 and does
> not appear below). Where this document and the blueprint disagree, the blueprint wins.
> Live status: https://mission-control-five-wheat-37.vercel.app (DomiGo v2 tab).

# DomiGo v2 — Program Wave 2: The Two Duologies + Platform Completion

*Plan by Claude Fable 5, 2026-07-10. Basis: PLATFORM_PASSOVER.md + DOMIGO_BLUEPRINT_2026-07-06 + 3 exploration agents (repo / srdp-donor / iCloud-canon) + 2 design agents, all findings verified against `~/code/domigo-v2` at HEAD (#103 merged, 0 open PRs, main clean).*

## Context

DomiGo v2 stands at 103 merged PRs: four story-games built (G1/G2/G3 complete, G4 Act 1 live), the M-wave mock-test loop done, E-1 grading correctness landed, corpus of 5,898 approved items (2,446 vocab + 3,452 grammar across 57 units). Koki now redirects the program on five fronts:

1. **Story campaigns become two duologies.** Grades 1+2 share one narrative universe (the book-world: a trapped former student damaged the book; G1 = discover & redeem him; G2 = he joins you as deuteragonist). Grades 3+4 share the FOURTEEN universe (G3 already ends with "They go live. It is messy. It is honest." — verified; G4 = the crew as live/investigative journalists uncovering a school scandal, with branching paths).
2. **Task quality moves from machine-validated to LLM-curated** ("authored, not programmed") — build the never-landed audit machinery (E-2/E-3/E-4 are docs-only today) and run curation fix waves; wake the dormant vocab pools (P-10).
3. **Deployment + design must be verifiably pixel-perfect** — GitHub→Vercel parity proven by harness and by eyes, not assumed.
4. **Platform completion**: v2-native teachers/classes/roster-import + student claim flow, Studio v2 with full CRUD behind automated gates, in-platform checkups (his real /20 framework), journeys-style study path for all 57 units, and the SRDP writing pipeline with grade-1–4 skills + photo-upload/OCR.
5. **A self-programming execution architecture**: every item carries executable exit criteria and runs in a Ralph loop (produce → self-evaluate → iterate → gate), written so Opus 4.8 executor sessions can't do anything but converge on the target. Fable 5 reserves the creative/calibration work.

**Decisions locked today (supersede the 2026-07-06 ledger where they conflict):**
- **No deadlines.** The Sept-1 hard gate, the floor, and the cut-order are retired. Quality-gated sequential execution: one item at a time, verified end-to-end, "surgical precision."
- **G4 full pivot** to the FOURTEEN sequel. `g4.st.lost-for-words` is parked (release.json emptied, bundle stays validate-green in repo).
- **G2 replacement campaign on the Phaser overworld engine** (school setting; the G1 engine generalizes). Old "The Wrong Name" stays playable as a bonus story.
- **Studio v2 = full CRUD + automated gates** (reverses "in-Studio task CREATION = never"; the blind-solve moat moves into the platform as an automated check).
- Unchanged and still binding: one grading brain · additive-only `domigo_v2` DDL (journal-then-flip; Neon has no transactions) · frozen game contracts (15×11 grid, save shape, `/api/game-save`, Phaser ≤400KB gz) · level-gate over every student string · Koki squash-merges every PR · the two standing method rules (10A validate-the-LOOK-first; 10B loop-back-on-own-work).

**Execution deliverable #1** is `docs/BLUEPRINT_V2.md` (+ iCloud copy): this plan expanded into the full per-item spec book with the loop architecture, superseding Part V of the old blueprint while keeping its Part II principles and unretired Part III specs (D-wave didactics, AU audio, GX enrichment, W content waves all remain in the roadmap, resequenced without deadline pressure).

---

## Phase overview (dependency-ordered; lanes may interleave, one PR at a time)

| Phase | Lane | What | Mostly |
|---|---|---|---|
| 0 | TRUTH | Doc reconciliation + deploy-truth harness + design parity baseline | Opus |
| 1 | A | Content-quality machinery (E-2/E-3/E-4) + curation standard + fix waves + P-10 | Opus (Fable: standard + triage calibration) |
| 2 | N | Three campaign bibles + narrative gates | **Fable** |
| 3 | B | Game engineering: G1 retrofit, G4 swap, G2 overworld | Opus |
| 4 | N+B | Campaign authoring waves (chapters, comprehension, art integration) | Opus under Fable calibration |
| 5 | P | Platform wave: identity/roster → checkups → Studio v2 → journeys → writing | Opus |
| 6 | GO | Prod DDL sitting + closing verification | Opus + Koki |

---

## Phase 0 — TRUTH (first PRs, ~2.5d)

- **T-1 Doc reconciliation (0.5d):** `docs/STATUS_AND_ROADMAP.md` is ~22 PRs stale (says "through #81"); the passover claims #102 is open but it merged 2026-07-09. Write the true state; record today's decision reversals in the ledger; banner the G4 III.4 spec as superseded.
- **T-2 Deploy-truth harness (2d):** new `apps/web/app/api/version/route.ts` (returns `VERCEL_GIT_COMMIT_SHA` + migration-journal hash) + `scripts/verify-deploy.mjs` (fetch prod, compare to `origin/main`, diff applied migrations vs `packages/db/drizzle/meta`, check env names; exit non-zero on mismatch) + `docs/runbooks/deploy-verification.md`. Resolves the prod-URL ambiguity in docs (v2 = `domigo-v2.vercel.app`; `domigo-silk` is v1 — never a v2 target).
- **T-3 Design parity, eyes-first (part of T-2 session):** before any harness, an actual browser session over prod vs local build on the key routes (10A: look with own eyes), logged with screenshots. The automated visual-regression suite (V-1 below) lands later, after new UI stabilizes.

Exit: `node scripts/verify-deploy.mjs --url https://domigo-v2.vercel.app` prints a green receipt table; a deliberately stale checkout fails it (negative test).

---

## Phase 1 — Lane A: content quality / curation machinery

Verified state: E-1 landed (`grade.ts` has strict, echo guard, `gradeVocab(item, input, pool)`; `/api/attempts` already accepts `input.pool`). The feared v1 defect (carriers demanding "to go" verbatim) is **absent** from the current corpus (0 such carriers; "to X" appears only as partial-tier tolerance) — the real risks are variant gaps, ambiguous single-answer items, and the dormant pools.

- **A1 · E-2 `pnpm content audit-variants` (1.5d + fix waves):** new `packages/content-pipeline/src/audit-variants.ts`, wired into `content.ts`. Rules: R1 article variants in `enToDe` pools (bare + der/die/das both present) · R2 contraction symmetry (typed text formats only; exclude chip/tile formats) · R3 single-accepted-answer advisories on free-form/question-formation/transformation · R4 pipe-count vs blank-count on every tier of every text format · R5 direction/language audit view of V-23. Output `content/build/audit/variant-audit.json` + per-grade worklists. Runs over the overlay-applied view. **Koki gate K-4** (20-item calibration, ~30min). Exit: `critical: 0` across 57 units after waves.
- **A2 · E-3 partial-fallback strictness (1d):** evidence pass first (table into PR body), then remove `error-correction` + `question-formation` from `PARTIAL_FALLBACK_FORMATS` (`packages/engine/src/grade.ts:166-173`) + regression tests (retyped error ⇒ wrong; authored partial tiers still honored). **Koki gate K-2** (15min).
- **A3 · Curation standard doc (0.5–1d, Fable-authored, before first wave):** `docs/handover/17_curation_standard.md` — the authored-not-programmed doctrine (algorithms assemble/validate/route, never author student prose), E-2's rules as authoring rules for new content, the calibration-set pattern (frozen 10–20 item batch + register sheet + Koki gate before volume), overlay-only fix path (patches are whole-field replaces — full arrays, never deltas), blind-solve mandatory whenever keys are touched, fixed sampling tiers.
- **A4 · E-4 blind-solve harness (2d + ~0.5d/grade runs):** `scripts/audit/blind-solve.mjs` — standalone Node ≥24 script importing the real engine TS sources directly; `@anthropic-ai/sdk` as root devDependency (never enters app chunks; `check:bundle` proves it); pure `frameItem()` mirrors task-ui rendering exactly (no keys leaked), fixture-tested; model returns 1–3 candidates + confidence; **every candidate graded through the real engine** — triage: (a) confident-but-graded-wrong ⇒ missing variant → overlay patch; (b) ≥2 defensible answers, 1 authored ⇒ ambiguous carrier → rewrite; (c) model wrong ⇒ no action. Cost printed per run; responses cached by (itemId, frameHash, model); off-CI. Run g2 first → calibration → all grades. Exit: class-(a) < 1% per grade. **Koki gate K-8** (~15 class-(b) rewrites spot-review).
- **A5 · Curation fix waves (per-wave):** protocol in `docs/runbooks/fix-waves.md`: committed worklist → LLM-curated overlay entries (never generated JSON) → `content validate` + audit re-run → targeted blind-solve on touched keys → Koki 1-in-5 sample → PR ≤25 items with before/after stats.
- **A6 · P-10 vocab rotation (1.5–2d):** wake the dormant pools — `task-ui` `VocabItemView` gains `pool` prop (carrier/definition/deToEn/enToDe; prompt source switches per pool, grading via `gradeVocab`; feedback card uses `vocabAnswers(item, pool)`); `/practice` rotates deterministically per (itemId, Vienna-day) + manual mode chips; `/review` stays carrier for now (comparability; follow-up decision). Exit: all four pools playable and server-graded correct against authored keys.

---

## Phase 2 — Lane N: the narrative program (Fable-reserved)

Three campaign bibles, authored by Fable 5 directly (Koki's explicit instruction: curated with model intelligence, not delegated). Each bible = premise + cast sheet + per-unit beat map (every unit's vocabulary/grammar is the level's substance — the story IS the task) + fork/flag manifest + endings matrix + register sheet + **chapter 1 authored through the pipeline, validate-story green, rendered preview** (the voice test). Each gets a narrative gate with Koki before any volume authoring.

**Universe A — the Book duology (G1+G2).**

- **G1-N · "The Lost Pages" revision** (retrofit of the existing 15-zone game — zones, tasks, and cast survive; the spine gets a cause, a mystery, and a heart):
  - Act 1 (z01–z05): wonder + first anomalies — the tampering made visible (words tangle, characters act wrong: the Captain afraid of the sea, Chef Luca forgetting food words). Restoring pages = the existing tasks, now diegetically motivated.
  - Act 2 (z06–z10): the investigation — z06 is literally the detective unit; the player finds erased-word "shadows," pencil-smudge trails, and unsigned notes ("Why should YOU get to read it? Nobody ever helped ME.").
  - Act 3 (z11–z15): the discovery — the saboteur is a former student (name via Koki gate) who was so lost in English that the book swallowed him; his despair erases pages. No defeat — the finale teaches him: the player restores the last pages WITH him, and z15's own grammar ("What are you going to do?") is his release question. Sets up G2.
  - Trope answer: no bolted-on companion-girl/mentor. Finn (canon book-guide) gets an arc instead — he remembers the day the book swallowed the boy and has been hiding it; the guide is implicated. Register: sad-not-scary, A1, du-form, kid-German glosses.
- **G2-N · The new G2 campaign** (working premise, to be developed in the bible): the inversion — in G1 you went into the book; now the book leaks into YOUR school. The redeemed G1 antagonist, now free, is your deuteragonist — his years inside gave him the ability to "read the ink." The residue of his erasures ("the Blank") escaped into the school and story-logic infects it unit by unit: Halloween decorations come alive (u03), the science-fiction shelf leaks into the library (u08 Out of this world), the town map rearranges (u05 Where's the supermarket), the bio room's animals talk (u04/u15)… All 15 MORE!-2 units map to school zones/events on a walkable school overworld. His redemption completes by facing what his sadness created. Theme: you fix what you broke — together.
- **G3 · FOURTEEN — untouched.** The ending is already the bridge ("No script… They go live"). The G4 prologue carries the "Previously on FOURTEEN" recap; optionally a "Season 2" teaser card on the G3 season board once G4 releases.
- **G4-N · "FOURTEEN: LIVE" (working title):** one year on, the crew streams live and inherits the dying school mag. The scandal: the school's funded-class-trip competition was rigged — the destination vote (Dublin / New York / Sydney = u01/u03/u07, the three destination-research episodes) was bought through sponsor favors. Beat spine: u02 Whodunit = the tip + method (the unit is detective fiction — they learn investigation FROM it) · u04 A working life = newspaper internship, the mentor-journalist teaches verification ethics (two-source rule, source protection) · u05 Hungry? = the catering-favor trail · u06 Kids make a difference = the moral pivot + **Fork 1** (pursue openly vs quietly) · u08 Obsessed! = Leah's obsession endangers the crew (echoes G3) · u09 Body talk = pressure arc before the key interview · u10 A fair world = the ethics core + **Fork 2** (confront privately vs publicly; humanize the person who took the favor) · u11 Ready for reading = the archive dive (old school mags hold evidence) · u12 Space = the school planetarium event, the keystone confrontation · u13 A school mag = the finale + **Fork 3** (break it live vs the measured special issue vs going to the Direktorin first). Endings cluster: the truth always comes out; what differs is who gets protected or hurt — decisions shape the plot. Epilogue: the honest re-vote on the destination, flavored by flags. Register: 14-year-olds, no cartoon villains, adult wrongdoing plausible at school-politics scale.

Gates: **G1-N / G2-N / G4-N** (~30–45min each, sequenced with Koki; each = outline + cast + register sheet + rendered ch1). Nothing volume-authored before its gate. Old campaigns: "The Wrong Name" → bonus story; "Lost for Words" → parked.

---

## Phase 3 — Lane B: game engineering (pre-authoring infrastructure)

Small shared fixes first (each unblocks content lanes): **VS-15 ending-coverage validator** (does not exist yet — BFS per major-flag combo: every combo terminates, every authored ending reachable; combo→ending matrix as info artifact) in `validate-story.ts` (~1–1.5d) · **loader `role: canonical|bonus`** in `content-loader` (`listReleasedStories` currently THROWS on two released stories per grade — must land before any second g2 bundle releases) · **`storyItemsFor` composite-key fix** (`itemId#variantKey`, ~10 lines, unlocks variant reuse in chapters) · **G4 flag-scope guard** (`TripGame` seeds flags from old saves unconditionally — a returning Lost-for-Words player's `w04.*` flags would corrupt the new story's gates; filter by storyId).

- **B1 · G1 retrofit engineering (1–2d):** the runtime is story-agnostic (verified) — revised scenes/chapters are pure `story.json` + `comprehension.json` + `cast.json` data; zero Phaser/grid/save changes required. Optional: second walkable NPC channel for the antagonist (~0.5–1d, additive glyph in `ZoneTheme.layout`) — recommend shipping the arc dialogue-first, sprite as polish. Finale zone variation = new theme in `art-gen/theme.ts` + a one-line `nearestWalkable` resume-clamp (a moved wall must not strand a saved position). Staged rollout = per-chapter-block revision PRs, each leaving the bundle validate-green.
- **B3 · G4 swap engineering (3.5–4.5d):** new bundle `g4.st.<new-id>` (flags.json with 3 major fork pairs, VS-13/14/15 CI-gated); park `g4.st.lost-for-words` via `releasedChapters: []` (bundle stays in CI validation; a deliberate "parked" info line in validate-story output); journal-board reskin via a per-story copy pack `tripCopyFor(storyId)` (three verified hardcode leaks: TripGame header, hub tagline/board label, journal-board "stamped" — plus a grep-test asserting no LfW literal survives outside its pack). No migration; old attempts stay valid history.
- **B2 · G2 overworld engineering (5–7d):** generalize `@domigo/game-2d` (verified couplings are small: the `mode:"game:g1"` hardcode at `PhaserGame.tsx:66`, copy strings, zone-board skin, THEMES registry) → props `mode`, `copy`, `tileArt`. Build the **image-first tileset resolver** (server `resolveTileArt(storyId, generator)` over `apps/web/public/art/<ns>/`, Phaser `preload()` queues real PNGs, procedural `paintTileset` remains the per-kind fallback — the `G1_SCHOOL_IMAGE_PROMPTS.html` contract, which also fixes G1's art path). New bundle `g2.st.<new-id>` with `map.json` (15 school zones; new school theme family in art-gen, append-only). Route dispatch becomes **bundle-derived** (`map.json` present ⇒ overworld; else per-grade DOM fallback — old detective campaign untouched). Save slots: widen `/api/game-save` regex to `^game:g[1-4](:bonus)?$`; old campaign moves to `game:g2:bonus`. Bundle budget: same lazy Phaser chunk via one shared dynamic-import module (`check:bundle` asserts `phaserCount === 1`). Art pipeline: parameterize `docs/art/sync-art.mjs` (`--lib/--dest`), clone the prompt library per zone; Koki keeps generating images into the iCloud drop.

Exit criteria per item: full standing gate + `validate-story` green + `__domigo` machine-playtest assertions + physical cheap-Android session before releasing chapters (the headless-Phaser blind spot stays a stated limit).

---

## Phase 4 — campaign authoring waves (Opus under Fable calibration)

Per campaign, after its gate: chapter waves (≤1 chapter or ≤25 items per PR) through the authoring-wave Ralph loop (below); comprehension items per chapter; art beats via the prompt libraries + sync pipeline; release.json staged rollout. Koki sampling: register-rubric pass per chapter wave; plays 1-in-5 in-app.

---

## Phase 5 — Lane P: platform wave (migrations 0006–0011, all additive `domigo_v2`)

Order: P-1 → P-2 → C-1 → S-1 → S-2 → J-1 → J-2 → W-1 → W-2 → V-1.

- **P-1 · v2-native identity (0006, 4d):** new `domigo_v2.users` / `classes` / `roster_events` tables (v2-owned, writable — `public.*` stays frozen; plain-uuid no-FK house style). Auth becomes ordered dual-read: v2 first → v1 mirror fallback (existing accounts keep working; unit-tested precedence table). Class code generator read-checks v1 invite codes (no collisions). Teacher class CRUD at `/admin/classes`.
- **P-2 · Roster import + claim (3d):** teacher pastes/CSV-imports student list → provisional accounts with real names (journal-then-flip via `roster_events`); students claim at `/join/[code]` (pick self from given-name+initial list → choose display name + PIN); teacher roster table always shows real↔display mapping (reset PIN / rename / remove). Bulk import is fresh work (exists in neither repo). **Koki gate:** claim-screen privacy design (~20min).
- **C-1 · Checkup mode (0009 = one additive `assignment_sections.section_config` jsonb column, 4d):** `assignments.mode='checkup'` reuses the entire M-wave (sections, sessions, timing wall, Notenschlüssel, pure scoring). `apps/web/lib/checkup.ts` encodes the grade-specific /20 section presets from the efl-checkup-generator framework + his real class checkups (first-letter gap-fill = presentation-only mask in task-ui — the key and grading are the unchanged item; picture vocab compiles to MC; translations use the now-live direction pools; definitions→word uses dAnswers; one grammar section). One-page checkup layout in the runner. **Koki gate:** per-grade preset sign-off + picture-asset decision (~30min). No second grader anywhere.
- **S-1 · Studio overlay core (0007, 3d):** `content_overrides`/`content_revisions`/`site_copy` tables; ALLOWLIST prose-field validator (answers/keys/format physically unreachable — unknown keys 400 by construction); `loadUnitWithOverrides()` service (corpus → git overlay → DB overlay), cached; editor UI ghosting canon values; journal-then-flip publish; fold-back script → `content/overlays/item-fixes.json` → normal PR. Passthrough invariant: empty table ⇒ byte-identical output for all 57 units (vitest deep-equal).
- **S-2 · Studio full CRUD + automated blind-solve gate (0008, 5d):** `content_drafts`/`content_checks`/`unit_meta` (unit renames). Create/replace/remove natively: zod schema validation server-side, then the automated AI blind-solve — the model answers the item WITHOUT its key and **the engine grades the answer**; only tier `correct` publishes (hard-block, no override; verdict + cost journaled to `content_checks`). Drafts in any non-published state are structurally unservable. Fold-back extends to fold drafts into the corpus files — content stays regenerable in git. **Koki gate:** walkthrough + explicit ledger-reversal acknowledgment (~30min).
- **J-1 · Pools + journeys runtime (no DDL, 5d):** corpus partitions into `practice|homework|classwork|mock|arcade` pools (pure fn; active `reserved_items` force mock; review/practice feeds exclude the mock pool — reserve integrity enforced platform-wide). `Journey@1` schema: per-unit authored spine (lesson → practice → game-chapter pointer → review + side quests); progression derived from `practice_attempts` best-tiers (`mode='journey:<unit>:<node>'`, open text column — no DDL); `/learn` re-rendered as the spine; `study_path_progress` kept read-only as fallback. New `pnpm content validate-journeys` (every gamePointer resolves; pools non-empty).
- **J-2 · Journey authoring (3d + off-queue wave):** deterministic generator drafts journey.json for 57 units → g2 pilot hand-polished, walked end-to-end → **Koki gate** (spine calibration, ~30min) → 57-unit wave per the authoring loop.
- **W-1 · Writing capture v2 (0010, 4d):** `writing_tasks` (grade + unitSlug for unit-aware correction) + additive columns on `writing_submissions` (keystrokes jsonb, status, imageUrls, sourceKind typed|photo). Ports: keystroke events `{t,k,m?,n?,p?}` + violation tags + `normalizeKeystrokeColumn` (neon-http jsonb-as-string gotcha); image upload validators (Vercel Blob, EXIF-stripped, ≤5 images). Teacher task CRUD; student composer with 10s autosave; wires into `assignment_sections.kind='writing'`.
- **W-2 · Sandbox AI correction + OCR + release gate (0011, 6d):** port `correction-runner.ts` (start/poll split, Vercel Sandbox node22, 12-min timeout, 18-min stale guard, cost columns) + `scripts/sandbox/run-correction.mjs` (Agent SDK). New vendored skill `skills/domigo-writing-correction/` derived from the four local `efl-writing-assessment-grade1..4` skills: unit-aware error codes (13/17/21/25 by grade; **only taught grammar flagged** — payload carries the class's unit coverage), audience-partitioned `correction.md` (`<!-- teacher-only -->` / `<!-- student-only -->`), warm du-form student register per the writing-reference-pack doctrine. **OCR branch:** photo submissions transcribe first (pixel-perfect, anti-autocorrect protocol from the grade-3/4 skills), transcript lands teacher-only, then correction runs on the transcript. Teacher release gate: student sees nothing until released. AI output is feedback, never a graded tier — writes no attempts, no scores. **Koki gates:** per-grade register review on 4 samples + cost ceiling + photo-Datenschutz (retention/access for minors' handwriting images) before prod enablement (~45min).
- **V-1 · Visual design parity suite (3d, after UI stabilizes):** Playwright `toHaveScreenshot` baselines on key routes × (360×740, 1280×800) + computed-style assertions on the `[data-grade]` accent tokens from `globals.css`; `scripts/verify-design.mjs --url <prod>` = the deployed-design-vs-repo proof; CI job. **Koki gate:** one-time baseline blessing.

**Phase 6 · G-1 Prod DDL sitting:** apply 0000–0011 to prod Neon per runbook (per-statement; `pg_dump --schema-only --schema=public` before/after must diff EMPTY); env wiring (`CLAUDE_CODE_OAUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`); closing receipts = verify-deploy + verify-design + scripted auth matrix (v1 student / claimed v2 student / v2 teacher). **Koki co-pilots (60min); never defaults.**

---

## The Ralph-loop execution architecture (goes verbatim into BLUEPRINT_V2 for Opus executors)

**The universal loop — every item, no exceptions:**
1. **SPEC**: restate the item's Goal + Done-means from BLUEPRINT_V2; **re-verify the spec against the code** (specs rot); announce item · branch · gates · migration? · Koki-gate?
2. **PRODUCE** smallest-complete.
3. **SELF-EVALUATE** — the Ralph turn: run the item's **executable exit criteria** (every item ships with exact commands + expected outputs); adversarially review your own diff (rule 10B); for anything visual, LOOK at it rendered (rule 10A) — screenshot or preview, never code-reading as proof.
4. **COMPARE** against Done-means; write the evidence table (what passed, what was NOT verifiable and why — e.g. headless Phaser limits).
5. **Red ⇒ diagnose ⇒ loop to 2.** Three consecutive failed iterations on the same criterion ⇒ STOP and escalate (to Koki or a Fable session) with the evidence — never brute-force past a design problem.
6. **GATE**: Koki gate if flagged; PR body carries What / Why / Test plan / Verification-honesty / migration block; never a bare `#N` in commits.
7. **PASSOVER**: STATUS strike + memory log; leave main clean.

**Per-work-type instantiations** (each with its own exit criteria set):
- **Code PR loop:** standing full gate (`pnpm -r typecheck && lint && test && content validate && validate-story && build && check:bundle`) + the item's verify script (`verify-deploy.mjs`, `verify-roster.mjs`, `verify-checkup.mjs`, …) green end-to-end on a Neon dev branch + negative test where specified.
- **Authoring-wave loop:** machine worklist first (never memory), count stated → frozen template + Fable calibration set → **Koki register gate BEFORE volume** → parallel drafting → validators hard-fail phantoms → keys touched ⇒ targeted blind-solve → fixed Koki sampling tier → ≤1 unit / ≤25 items per PR → wave stats in the body (the drift alarm).
- **Narrative loop:** premise → bible → **narrative gate** → ch1 through the pipeline + rendered preview (the voice test) → gate → chapter waves, each validate-story green + register-rubric self-check + comprehension keys graded `correct` through the real engine.
- **Curation loop:** audit report → triage per the standard → overlay patches (full-array semantics) → re-run to green → blind-solve re-check on touched keys → sample → fold.
- **Art loop:** style key first → generate → QA pass (seams/dims/transparency) → sync → **in-game screenshot compared against the reference** → integrate.
- **Deploy loop:** verify-deploy + verify-design green against prod after every merged batch.

**Delegation matrix:**
- **Fable 5 reserves:** the three campaign bibles + register sheets + each campaign's ch1 (the voice bar) · the curation standard + E-4 triage calibration · checkup preset extraction from his real docs · BLUEPRINT_V2 authoring + any later re-planning · judgment calls that change scope or voice.
- **Opus 4.8 executes:** every Phase 0/1/3/5/6 engineering item · chapter/journey/fix waves after calibration · art integration · ports — each against its written spec + exit criteria, inside the loop above.
- **Koki gates (protected, never default):** narrative gates G1-N/G2-N/G4-N · K-2/K-4/K-8 curation policy · checkup presets · Studio walkthrough + ledger reversal · writing register/cost/Datenschutz · claim-screen privacy · journey pilot · visual baselines · the prod DDL sitting.

---

## Verification (program-level)

- Per PR: the standing gate + item exit criteria + verification-honesty section.
- Per wave: validators + blind-solve + sampling tier + wave stats trend.
- Per phase: a dated Vision-log verdict in BLUEPRINT_V2 (erase-the-teacher? one-brain held? level-gate held?).
- Program acceptance (end-state): four student personas (one per grade, cheap Android) run sign-in → journey spine → practice with pool rotation → their game campaign incl. a fork with visible consequence → a checkup with server wall → writing (one typed, one photo/OCR) with released AI feedback; the teacher persona imports a roster, builds a checkup, creates+publishes a task through Studio's blind-solve gate, runs+releases a correction, patches a typo, folds back to git; `verify-deploy` + `verify-design` green against prod. Every step a pass/fail row; Koki runs the teacher persona.

## First actions on approval

1. Fable writes `docs/BLUEPRINT_V2.md` (this plan expanded into per-item specs + the loop protocol) → PR, plus iCloud copy + memory update (deadline doctrine, pivots, ledger reversals).
2. T-1 doc reconciliation PR + T-2 deploy-truth harness (and the eyes-on prod design pass, logged).
3. Fable begins the G1-N bible while Opus runs Phase 1 (E-2 first).
4. Koki gate menu #1: antagonist name + G1-N outline · K-2 · K-4 calibration.

---
---

# AMENDMENT 2026-07-10(b) — The Language Layer (L-wave) + next execution

*Status of the base plan above: #104 (BLUEPRINT_V2) and #105 (G1-N gate pack: bible + ch06 voice test, antagonist = Jona) are both MERGED. Koki's new directive: story dialogue is overwhelming in English for beginners — it must be GERMAN-FIRST for grade 1 (to a lesser extent grade 2), with an ALWAYS-AVAILABLE toggle between German and English, everywhere except the graded tasks themselves. This amendment adds the L-wave and re-sequences the immediate queue.*

## Context

Verified current state (exploration agent, file-anchored): there is **no i18n/locale concept anywhere** in the repo. Each of the four game runtimes renders dialogue bespoke: G1 (`packages/game-2d/src/PhaserGame.tsx` DialogueOverlay ~L96-147) shows English primary with German `scaffoldDe` as an **always-on subtitle**; G2/G3/G4 (`DetectiveGame.tsx` ~L264-281, `NovelGame.tsx` scaffoldNode ~L199-218, `TripGame.tsx` scaffoldNode ~L212-231) show English primary with German behind an **"Auf Deutsch?" tap-chip**. Only G4 renders `choice.scaffoldDe`. Glosses are tap-reveal `<ul>` lists everywhere. Device-scoped settings live in `packages/game-feel` (`localStorage "domigo:feel:v1"`, `useSyncExternalStore`, defensive `parseSettings`, `FeelGear` popover; house doctrine: "a profile may seed the default; the device always wins"). Grade is available at the page/wrapper level (`gameMode = "game:g\{grade\}"`; `data-grade` on the subtree). Task-ui verdicts/hints are already German ("Stark!", hintDe) — so German-first stories are tonally consistent; tasks stay English per Koki.

This is a **documented philosophy change**: the old doctrine ("comprehensible-input-first, German on demand", `docs/handover/12_g2_passover.md:24`, `docs/handover/grades/g2.md:141`) inverts for the youngest learners — **meaning-first, English on demand at grade 1**.

## Design decisions (Fable, under standing delegation — Koki can overrule at PR review)

1. **`LangMode = "de-first" | "en-first"`, stored device-scoped** as a new `lang: "auto" | "de-first" | "en-first"` field in the `game-feel` settings (`packages/game-feel/src/core.ts` FeelSettings + parseSettings; same localStorage key, add-field-compatible — no key bump). `"auto"` resolves by grade via a pure `resolveLangMode(lang, grade)`: **grade 1 → de-first; grades 2–4 → en-first**. ("To a lesser extent grade 2" = the toggle is prominent in G2 but English stays its default — G2's existing per-line "Auf Deutsch?" already covers the German need there; flip the default later with one constant if Koki prefers.)
2. **de-first rendering:** `scaffoldDe` becomes the PRIMARY line (full size, `--text`); English moves behind the same chip affordance, relabeled **"Auf Englisch?"** — the exact inverse of today's G2 pattern. `scaffoldDe == null` falls back to English (never a blank bubble). Choices render their German primary in de-first (adds the `choice.scaffoldDe` render path G1 lacks; G4 already has it). Glosses unchanged.
3. **One shared component, not four forks:** extract `DialogueLine` into `@domigo/game-core` — props `{ textEn, scaffoldDe, glosses, mode, copy, variant }` — and replace the four near-identical inline blocks. G4 passes its flag-resolved `lineText`/`lineScaffold` (the component takes strings, stays flag-agnostic). Runtimes keep their own bubble/narrator styling around it.
4. **The toggle is always visible where it matters:** a small DE/EN chip in the G1 and G2 dialogue headers (writes `setFeel({lang})` — instant, device-persistent, cross-tab), plus the setting in the `FeelGear` popover for all grades. G3/G4 keep per-line reveal as primary affordance (mode still honored if set).
5. **Grade-1 game chrome goes German unconditionally** (not toggled — the toggle governs story lines): G1 hub tagline/card labels, `GameClient` header ("← Zonen"), `zone-board` labels ("N / M Seiten zurückgeholt"), dialogue buttons ("Weiter →"). A1 kids are German speakers; English chrome at that level is pure friction. Grades 2–4 chrome unchanged in this wave.
6. **Content insurance:** a new validate-story warning — any grade-1 scene (and any grade-2 scene, info-level) missing `scaffoldDe` — since German is now load-bearing at g1. Plus a register amendment to `docs/handover/18` (the G1-N bible): `scaffoldDe` is first-class prose for g1 — natural kid-German, never translationese; the revision waves review German lines at the same bar as English.
7. **Scope control:** platform-wide grade-1 German chrome (/home, /practice, /review labels) = **L-2, backlog** — folds into the existing D-6 autonomy/onboarding work (already German-heavy), not this wave.

## The work items

**L-1 · Language layer for the story runtimes (~1.5–2d, one PR — Fable executes):**
- `packages/game-feel/src/core.ts` + `index.tsx`: `lang` field, `resolveLangMode`, FeelGear entry, exported `LangToggle` chip.
- NEW `packages/game-core/src/dialogue-line.tsx` (+ tests): both modes, null-scaffold fallback, choice-label helper.
- Thread `grade` into the four `*Client` wrappers → runtimes (recoverable from `gameMode`; pass explicitly).
- Rewire the four runtimes' line/scaffold/choice blocks onto `DialogueLine`; mount the toggle in G1/G2 headers; relabel copy banks (`deShow`/`enShow` pairs).
- G1 chrome German pass (hub g1 card, GameClient, zone-board, overlay buttons).
- validate-story scaffoldDe-coverage warning.
- Exit criteria: unit tests (resolveLangMode; DialogueLine both modes + fallback); standing full gate; `__domigo`/DOM playtest — g1 dialogue renders German primary with "Auf Englisch?" reveal, toggle flips live and persists across reload, g2 unchanged by default but toggle works, G4 flagLine variant renders correctly in both modes; screenshots in the PR body.

**L-2 · Grade-1 platform chrome sweep (backlog):** German-first labels across /home, /practice, /review for grade-1 students; rides the D-6 autonomy lane.

**BLUEPRINT_V2 bookkeeping (rides the L-1 PR):** add L-1/L-2 to Part IV + the Part V queue; note the philosophy change + the g2-default constant; amend handover/18 §5 with the scaffoldDe-as-prose rule.

## Re-sequenced immediate queue

1. **L-1** (this — Fable executes now; the G1 revision waves must land on top of the corrected UX, and every future g1 chapter is authored knowing German is the primary surface).
2. **G4-N bible** ("FOURTEEN: LIVE" — the standing most-daunting Fable item; next PR after L-1).
3. Then the base queue resumes (T-2 deploy-truth, A-1 E-2, …) — unchanged.

## Verification

Per L-1 exit criteria above; plus the deploy loop after merge (prod serves the toggle; a quick eyes-on pass at 360×740 on /play/1/z06 — German primary, chip reveals English, toggle persists).
