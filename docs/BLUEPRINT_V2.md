# DomiGo v2 — Blueprint V2: Program Wave 2 — "The Two Duologies + Platform Completion"

_Written 2026-07-10 by Claude Fable 5. Status: **FINAL — approved by Koki 2026-07-10** (plan approved in-session; this document is the approved plan expanded into executable per-item specs). Supersedes `docs/BLUEPRINT.md` ("v1", 2026-07-06) **Part V (the W1–W9 milestone plan) and its deadline doctrine entirely**, and specific Part 0/III items named in Part I below. v1's Part II binding principles, its Part III specs not named as superseded, and its Part IV session loops **remain in force** and are extended (not replaced) by the Ralph-loop protocol in Part III here. Durable copies: this file (canonical) · iCloud `Domi Gym/DOMIGO_BLUEPRINT_V2_2026-07-10.md` · the approved plan at `~/.claude/plans/all-right-boo-we-federated-moth.md` (volatile scratch, never authoritative)._

**How to use this document (executor sessions):** boot per v1 Part IV loop (a) → read Part 0 + Part III (the loop protocol) here → work Part V's sequence top-down, one item at a time → every item's spec lives in Part IV → never violate v1 Part II or the Wave-2 ledger below → passover per v1 loop (e). **There are no deadlines. There is no floor and no cut-order. An item is finished when its exit criteria pass, not when time runs out.** Koki squash-merges every PR.

---

## Part 0 — Canonical state & the Wave-2 decision ledger

**Canonical state (verified 2026-07-10 against `main` + `gh`):**
- `VEHO-DOMI/domigo-v2`: **103 PRs, ALL merged, 0 open.** HEAD = #102 (overworld art overhaul — the passover's "#102 open" note is stale). `docs/STATUS_AND_ROADMAP.md` was ~22 PRs behind; reconciled by T-1 (rides this blueprint's PR).
- Corpus: **5,898 approved items** (2,446 vocab + 3,452 grammar) across **57 units** (g1: 15 · g2: 15 · g3: 14 · g4: 13 — MORE! 4's "Talking turkeys" Extra Unit is NOT in the corpus and stays out by decision). Git overlay `content/overlays/item-fixes.json` (17 patches) is the only override mechanism today.
- Games: G1 "The Lost Pages" (Phaser overworld, 15 zones) · G2 "The Wrong Name" (DOM point-and-click, 15 chapters, complete) · G3 "FOURTEEN" (DOM graphic novel, 14 episodes, complete — **ch14 already ends on "No script … They go live. It is messy. It is honest."**) · G4 "Lost for Words" (DOM flag-aware, ch01–05 released).
- Engine: E-1 landed (#83: `strict` honored, echo guard, `gradeVocab(item, input, pool)` direction-aware; `/api/attempts` accepts `input.pool`). **E-2 / E-3 / E-4 are docs-only — never built.** `PARTIAL_FALLBACK_FORMATS` still contains `error-correction` + `question-formation` (`packages/engine/src/grade.ts:166-173`).
- Platform: M-wave complete (migrations 0000–0005; assignments/sections/sessions/reserved_items; mock-test loop for vocab+grammar). `writing_submissions` capture-only. No Studio tables. `/admin` = mastery view + assignments builder. Auth reads v1 `public.users`/`public.classes` **read-only**.
- Prod: `domigo-v2.vercel.app` (v2). `domigo-silk.vercel.app` is **v1** — never a v2 deploy target. Migrations applied to the Neon **dev branch only**; prod DDL never applied.
- Known landmines (verified in code, fixed by Part IV items): `listReleasedStories()` **throws** if a grade has two released stories · `storyItemsFor` keys by `itemId` alone (variantKey collisions) · `TripGame` seeds flags from old saves unconditionally (LfW flags would leak into a new g4 story) · `PhaserGame.tsx:66` hardcodes `mode:"game:g1"` · VS-15/VS-16 do not exist in `validate-story.ts`.

**The Wave-2 decision ledger (Koki, 2026-07-10 — locked; no session re-litigates; supersedes conflicting v1 ledger lines):**
1. **NO DEADLINES.** The Sept-1 hard gate, the protected floor, and the forfeit/cut order are **retired**. Doctrine: quality-gated sequential execution — one item at a time, end-to-end verified, "surgical precision and thorough dedication." Item quality is never traded for speed.
2. **The campaigns become two duologies.** Grades 1+2 share the book-world universe (G1 discovers & redeems the trapped former student; G2 he becomes your deuteragonist). Grades 3+4 share the FOURTEEN universe (G3 unchanged; G4 = the crew as investigative journalists).
3. **G4 full pivot.** v1 ledger line "G4 = Lost for Words (locked)" is **reversed**. `g4.st.lost-for-words` is **parked** (release.json → `[]`; bundle stays in repo and in CI validation). G4 becomes the FOURTEEN sequel (Part IV WS-N, G4-N) on the same `@domigo/game-trip` flag-aware runtime.
4. **G2 replacement campaign on the Phaser overworld engine** (school setting; `@domigo/game-2d` generalizes). "The Wrong Name" stays playable as a **bonus story** (role: bonus).
5. **Studio v2 = full native CRUD behind automated gates.** v1 ledger line "in-Studio task CREATION = never" is **reversed**. The blind-solve moat moves INTO the platform: every created/changed graded task passes server-side schema validation + an automated AI blind-solve (graded by the real engine) before it can publish. Fold-back to git keeps content regenerable.
6. **Content doctrine: authored, not programmed.** Algorithms assemble, validate, audit, and route; they never author student-facing prose. Every authored family opens with a Fable-authored calibration set + register sheet + Koki gate before volume.
7. Reaffirmed unchanged: ONE grading brain · additive-only `domigo_v2` DDL, journal-then-flip (Neon HTTP has no transactions) · frozen game contracts (15×11 grid, 48px display tiles, save shape `{zoneId,pos,cleared}` schemaVersion 1, `/api/game-save` semantics, Phaser ≤400KB gz / other chunks ≤150KB) · level-gate over every student-facing string · Koki squash-merges every PR, one PR at a time, never a bare `#N` in commits · method rules **10A** (validate the LOOK before you build) and **10B** (loop back and validate your own work).

---

## Part I — What changes vs Blueprint v1 (supersession map)

| v1 element | Wave-2 status |
|---|---|
| Part V milestone plan (W1–W9), floor, cut-order, gate-menu weekly cadence | **RETIRED.** Replaced by Part V here (dependency order, no dates). Gate menus remain as a batching convenience, without the 72h-default clock for anything narrative/destructive (unchanged) — and now without schedule pressure. |
| Part III.4 WS-G4 "Lost for Words" narrative + chapter plan | **SUPERSEDED** by WS-N G4-N here. The **mechanics layer specs in III.4 survive verbatim** (flags schema, VS-13/14/15/16 specs, choice-consequence doctrine, boss/gauntlet mechanics, Credit/ability invariants) and are consumed by WS-B here. `handover/16_g4_lost_for_words.md` gets a superseded banner (rides the first WS-B PR). |
| Part 0 decision 1 (G4 = Lost for Words) · standing-ledger "in-Studio task CREATION = never" | **REVERSED** (ledger lines 3 and 5 above). |
| Part III.1 WS-A (E-2/E-3/E-4/A-5..A-7) | **IN FORCE**, expanded into executable specs (WS-A here). |
| Part III.2 W-0/waves · III.3 AU audio · III.5 GX enrichment · III.6 WS-D didactics · III.7 M-2b/W-1(B2b) · III.8 Track D (D-1..D-8) · III.9 v1-parity | **RETAINED BACKLOG** — specs stay in v1; resequenced without deadlines in Part V.d here. Items already absorbed by Wave-2 specs: v1 S-1..S-5 (Studio) → WS-P S-1/S-2 here; v1 W-2/W-3/W-4 (sandbox writing) → WS-P W-1/W-2 here; v1 T-2 roster parity → WS-P P-1/P-2 here; v1 P-10 → WS-A A-6 here. |
| Part IV session loops (a)–(f) | **IN FORCE**, extended by Part III here (the Ralph protocol makes loop (b)'s verification step explicit and mandatory per item). |

---

## Part II — Binding principles

v1 Part II (the 11 principles) applies verbatim, PLUS:

12. **Authored, not programmed** (ledger line 6): student-facing prose is human/Fable/Opus-authored under a register gate; generated output is a labeled fallback only, allowed only where an authored version doesn't exist yet.
13. **Exit criteria are executable.** Every Part IV item ships with commands + expected outputs. "Done" is a passing run, written into the PR body. An item with unrunnable exit criteria is a spec bug — fix the spec first.
14. **Escalate, never brute-force.** Three consecutive failed loop iterations on the same criterion ⇒ STOP; escalate to Koki or a Fable session with the evidence. A repeated failure is design information, not an obstacle.
15. **Old campaigns are heritage, not garbage.** "The Wrong Name" (bonus) and "Lost for Words" (parked) stay validate-green in CI. Their attempts history stays valid forever.

---

## Part III — The Ralph-loop execution protocol (governs every item)

**The universal loop — every item, no exceptions:**
1. **SPEC** — restate the item's Goal + Done-means from Part IV; **re-verify the spec against the code** (specs rot; code outranks docs); announce: item · branch · gates · migration? · Koki-gate?
2. **PRODUCE** — smallest-complete implementation.
3. **SELF-EVALUATE** (the Ralph turn) — run the item's executable exit criteria verbatim; adversarially review your own diff (10B: hunt for the defect you'd find in someone else's PR); anything visual gets LOOKED AT rendered (10A: screenshot/preview — code-reading is never visual proof).
4. **COMPARE** — against Done-means; write the evidence table (passed / failed / **not verifiable and why** — e.g. headless-Phaser limits, dummy dev DB).
5. **RED ⇒ diagnose ⇒ loop to 2.** Three consecutive failures on the same criterion ⇒ escalate (Principle 14).
6. **GATE** — Koki gate if the item flags one; PR body: What / Why (tied to the vision) / Test plan / **Verification honesty** / migration paste-block with APPLY-BEFORE-MERGE banner where relevant; footer `🤖 Generated with [Claude Code]`; commits end `Co-Authored-By: <the executing model>`; never a bare `#N`.
7. **PASSOVER** — STATUS strike (≤3 merges behind), memory log, leave main clean, checkout main.

**Per-work-type instantiations:**
- **Code PR loop:** standing full gate — `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm content validate-story && pnpm build && pnpm check:bundle` — PLUS the item's own verify script green end-to-end (against a Neon dev branch where DB is involved) PLUS the negative test where the spec names one.
- **Authoring-wave loop:** machine worklist first (validator/audit output — never memory), count stated up front → frozen template + Fable calibration set → **Koki register gate BEFORE volume** → parallel drafting → machine validation hard-fails phantoms/coverage gaps → keys touched ⇒ targeted blind-solve → fixed Koki sampling tier → ≤1 unit or ≤25 items per PR → wave stats in the body (the drift alarm).
- **Narrative loop:** premise → bible → **narrative gate (Koki)** → ch1 authored through the pipeline + rendered preview (the voice test) → gate → chapter waves, each validate-story green + register-rubric self-check + every comprehension key graded `correct` through the real engine (POST spot-check).
- **Curation loop:** committed audit report → triage per the curation standard → overlay patches (whole-field replaces — **full arrays, never deltas**) → re-run audit to green → targeted blind-solve on touched keys → Koki sample → (later) fold.
- **Art loop:** style key first → generate → QA pass (seams / dimensions / transparency) → sync → **in-game screenshot compared against the reference** → integrate. AI image-gen is weak at seamless tiles/exact dims: quantize + downsample + QA every batch.
- **Deploy loop:** `verify-deploy` (+ `verify-design` once V-1 exists) green against prod after every merged batch.

**Why this shape (the backwards-engineered method, for executor sessions):** the loop encodes how the planning model works — (i) never trust a spec or a memory over the code in front of you; (ii) produce the smallest thing that could be complete, because small things can be *fully* verified; (iii) the most valuable minute is the one spent trying to break your own work before anyone else sees it; (iv) evidence beats claims — a "how I verified" line with commands is worth more than any assertion; (v) when verification keeps failing, the design is talking to you — listen, don't push.

---

## Part IV — The program (per-item specs)

_Every item inherits the standing full gate (Part III). Migration contract: `pnpm --filter @domigo/db db:generate`, apply to the Neon dev branch before merge; prod only via GO-1. Estimates are engineering-days for the executor — they order effort, they are not deadlines._

### IV.0 · WS-T — TRUTH (first PRs)

**T-1 · Doc reconciliation** (0.5d — RIDES THIS BLUEPRINT'S PR)
Goal: docs tell the truth again. Files: `docs/STATUS_AND_ROADMAP.md` (new dated banner: through #103 merged / 0 open / Wave-2 program approved, points here), this file lands, `docs/VISION.md` decision ledger gains the Wave-2 reversals. Done-means: a fresh session reading STATUS + this blueprint knows the true state without touching `gh`.

**T-2 · Deploy-truth harness** (2d)
Goal: prove GitHub→Vercel prod serves exactly what `main` contains.
Files: NEW `apps/web/app/api/version/route.ts` (returns `VERCEL_GIT_COMMIT_SHA`, build time, hash of the applied-migration journal read from the drizzle table in `domigo_v2`) · NEW `scripts/verify-deploy.mjs` (fetch `<url>/api/version`; compare SHA to `origin/main` HEAD; diff applied migrations vs `packages/db/drizzle/meta/_journal.json`; check required env-var NAMES (never values); receipt table; non-zero exit on mismatch) · NEW `docs/runbooks/deploy-verification.md` (incl. the URL truth: v2 = domigo-v2.vercel.app; -silk = v1).
Exit criteria: `node scripts/verify-deploy.mjs --url https://domigo-v2.vercel.app` → green receipt table, exit 0; from a deliberately stale checkout → exit 1 (negative test, documented in the runbook). Koki-gate: 10-min Vercel-project↔repo mapping confirm.

**T-3 · Eyes-on design parity pass** (rides T-2's session)
Goal: 10A applied to prod — an actual browser session over prod vs local build on `/home`, `/practice/<unit>`, `/learn`, `/review`, `/tests`, `/admin`, `/signin`, one game shell, at 360×740 + 1280×800, screenshots saved to the session log; discrepancies become worklist items. The automated suite is V-1 (later, after Wave-2 UI stabilizes). Done-means: a written parity verdict with screenshots in the PR/passover.

### IV.0b · WS-L — The language layer (Koki directive 2026-07-10, second session)

_A documented philosophy change: the old doctrine ("comprehensible-input-first, German on demand" — handover/12:24, handover/grades/g2.md:141) inverts for the youngest learners. **Grade 1 reads GERMAN-FIRST** (meaning first, English on demand); an always-visible toggle flips it; graded tasks are never affected. Defaults: grade 1 → de-first, grades 2–4 → en-first (flip g2 later via one constant in `resolveLangMode` if Koki prefers)._

**L-1 · Story-runtime language layer** (**SHIPPED with this section's PR**): `lang: auto|de-first|en-first` in the `game-feel` device settings (same localStorage key, defensive parse) · pure `resolveLangMode/primaryLine/secondaryLine/revealLabels/glossLabels` in `game-feel/core.ts` · shared `LangToggle`/`DialogueReveal`/`GlossReveal`/`ChoiceContent` components · all four runtimes rewired (G4 passes its flag-resolved lines; the 🔊 read-aloud always speaks the ENGLISH line) · LangToggle in all four game headers + a Sprache row in FeelGear · grade-1 chrome German unconditionally (hub, GameClient header, zone-board, overlay buttons — the toggle governs story LINES only) · **VS-17**: scaffoldDe required on every scene/choice/flagLine at grades ≤2 (German is the primary surface there — a missing scaffold would be a blank bubble).
Exit criteria: game-feel + story-pipeline unit tests (mode matrix, null-scaffold fallback, VS-17 fixtures) · standing full gate · DOM playtest — g1 dialogue renders German primary with "Auf Englisch?" reveal, the toggle flips live and persists across reload, g2 unchanged by default but toggleable, tasks unaffected.

**L-2 · Grade-1 platform chrome sweep (backlog):** German-first labels across /home, /practice, /review for grade-1 students — rides the D-6 autonomy lane.

**Authoring consequence (binding for all g1/g2 waves):** `scaffoldDe` is **first-class prose**, not a translation aid — natural kid-German at the same register bar as the English line (handover/18 §5 amendment). VS-17 enforces presence; the register gate enforces quality.

### IV.1 · WS-A — Content quality / curation machinery

_Verified baseline: the feared v1 "to go"-verbatim defect is ABSENT from graded carriers (0 such items; "to X" appears only as partial-tier tolerance). The real risks: variant gaps, ambiguous single-answer items, dormant `dAnswers`/`translation` pools. Order: A-1 → A-2 → A-3 → A-4 → A-5 (waves) → A-6._

**A-1 · E-2 `pnpm content audit-variants`** (1.5d script + fix waves)
Goal: deterministic, re-runnable enumeration of answer-pool variant gaps as a machine worklist.
Files: NEW `packages/content-pipeline/src/audit-variants.ts` (+ `test/audit-variants.test.ts`) · `packages/content-pipeline/src/content.ts` gains `case "audit-variants"` · output `content/build/audit/variant-audit.json` + `content/build/audit/worklist-g<1..4>.md` (committed). Reuse: the V-23 language detector (`validate-items.ts:421-432`), overlay-applied item reads (audit MUST see what the runtime sees), `countBlanks` from content-schema.
Rules: **R1** article variants — vocab `enToDe` full-tier sets for capitalized-German-noun glosses must contain bare AND der/die/das forms (critical if only one) · **R2** contraction symmetry — typed text formats only (`gap-fill, translation, transformation, error-correction, question-formation, free-form`); EXCLUDE `sentence-building`/`anagram` (chips fix the surface; twins would corrupt T2 chip derivation); ambiguous `'s` only ever ADDS an advisory · **R3** single-accepted-answer advisories on free-form/question-formation/transformation (the E-4 cross-check seed, not an auto-fail) · **R4** pipe-segment count == blank count on EVERY tier of EVERY text format (critical: unreachable answer) · **R5** direction/language audit view of V-23 with per-grade trend counts.
Report shape: `{schema:"variant-audit@1", totals:{critical,advisory,byRule,byGrade}, items:[{itemId,unitSlug,rule,severity,evidence,suggestion}]}`.
Exit criteria: `pnpm content audit-variants` prints `scanned: <N> · critical: <C> · advisory: <A>` + writes both artifacts (exit 0 always — audit, not gate); fixture tests (known-missing article / asymmetric contraction / bad pipe-count each yield exactly their row; clean fixture yields zero). Wave exit: re-run prints `critical: 0` on all 57 units. Koki-gate **K-4**: 20-item calibration of the first report (~30min; his pedagogy decides e.g. bare-noun-without-article = full or partial).

**A-2 · E-3 partial-fallback strictness** (1d)
Goal: retyping the uncorrected sentence (or the statement) never earns partial via the ≥2-shared-words fallback.
Steps: (1) evidence pass — for every error-correction/question-formation item, does `partialContains(prompt.text, fullAnswer)` pass? Table into the PR body (the K-2 artifact). (2) Remove both formats from `PARTIAL_FALLBACK_FORMATS` (`packages/engine/src/grade.ts:166-173`). (3) Regression tests: retyped error ⇒ `wrong` · near-echo (prompt minus one word) ⇒ `wrong` · genuine half-right on translation/gap-fill still earns partial · authored partial-TIER answers on ec/qf still grade `partial`.
Exit criteria: `pnpm --filter @domigo/engine test` green incl. the 4 new tests; evidence table present. Koki-gate **K-2** (15min policy) before merge.

**A-3 · The curation standard** (0.5–1d, **Fable-authored**, lands before the first fix wave)
Goal: codify authored-not-programmed for ALL future student-facing content.
Files: NEW `docs/handover/17_curation_standard.md` — (1) the doctrine + existing proof points; (2) E-2's R1–R4 as **authoring rules** for new items (ship variant-complete; the audit trends to zero instead of policing forever); (3) the calibration-set pattern (frozen 10–20 item batch + register sheet + Koki gate BEFORE volume — the W-0/G-W/G4-N pattern generalized); (4) overlay-only fix path + **whole-field patch semantics** (full replacement arrays, never deltas — `{...item, ...patch}` verified in `ingest-items.ts:232-239` + `content-loader/src/index.ts:66-94`); (5) blind-solve mandatory whenever keys are touched; (6) fixed sampling tiers per content kind.
Done-means: merged; the next wave PR links it and follows it.

**A-4 · E-4 blind-solve harness** (2d harness + ~0.5d/grade runs, off-CI)
Goal: find the semantic gaps mechanics can't — every item solved blind by a model, candidates graded through the REAL engine.
Architecture: NEW `scripts/audit/blind-solve.mjs`, standalone Node ≥24 (imports `@domigo/engine` + content-loader TS sources directly — same type-stripping mechanism as `pnpm content`; no build step). LLM: `@anthropic-ai/sdk` as **root devDependency** (never enters app chunks — `check:bundle` proves it); `ANTHROPIC_API_KEY` env; **never wired into CI** — runs from a dev machine; only OUTPUT JSON is committed. Cheap-tier model default, `--model` override for calibration; concurrency ~8; filters `--grade --unit --limit --only <itemId>`; responses cached by `(itemId, frameHash, model)`.
Render-fidelity contract: one pure `frameItem(item)` that mirrors task-ui EXACTLY, no keys leaked (vocab: `d` + carrier with `___`, never `w`/`g`; text formats: `prompt.text` + blank count + glosses; MC: prompt + shuffled labels; matching/sort: rows + option lists; sentence-building: chip list) — fixture-tested so drift from task-ui is testable. Model returns `{candidates:[{answer,confidence}], note}` (1–3).
Triage (engine tiers decide — no second brain even in audit): **(a)** top candidate confidence ≥0.75 AND tier `wrong` ⇒ missing variant → overlay pool patch · **(b)** ≥2 candidates ≥0.6 where only one grades `correct` and the item has 1 full answer ⇒ ambiguous carrier → rewrite via overlay · **(c)** low-confidence wrong ⇒ no action.
Exit criteria: `--no-llm` dry-run (canned candidates) exercises framing+grading+triage in fixture tests; live per grade: `node scripts/audit/blind-solve.mjs --grade g2` prints `items: N · class-a: X · class-b: Y · cost: $Z`; after fix waves class-(a) **< 1% per grade**. Output: `content/build/audit/blind-solve/<grade>.json`. Order: g2 → K-4-style calibration → g1/g3/g4. Koki-gate **K-8**: ~15 class-(b) rewrites spot-review (20min).

**A-5 · Curation fix waves** (per-wave; protocol doc 0.5d)
Goal: worklists become merged, regen-surviving, LLM-curated fixes.
Files: NEW `docs/runbooks/fix-waves.md`. The loop per wave: committed worklist slice (count up front) → parallel agents draft **overlay entries only** (never generated JSON; full-array semantics) → `pnpm content validate` + `pnpm content audit-variants` re-run (touched rules' criticals drop) → keys touched ⇒ `blind-solve --only` re-run on patched items → 0 class-(a) → Koki 1-in-5 sample → PR ≤25 items with before/after stats.
Exit criteria per wave: the PR body shows the before/after audit counts + a green re-run. Arc exit: `critical: 0` per grade AND class-(a) <1% per grade.

**A-6 · P-10 vocab exercise rotation** (1.5–2d)
Goal: the dormant `dAnswers` + `translation.deToEn/enToDe` pools of ~2,446 vocab items become live exercise modes, direction-aware by construction.
Files: `packages/task-ui/src/index.tsx` — `VocabItemView` gains `pool?: VocabPool` (default `"carrier"`); prompt source per pool (carrier: `d`+`s` · definition: `d` only, ask the word — NEVER renders `w` · deToEn: show `g` ask English · enToDe: show `w` ask German); grading via `gradeVocab(item, value, pool)`; emitted `detail.input` = `{kind:"vocab", value, pool}` (server already validates+regrades per pool); Feedback Card uses `vocabAnswers(item, pool)` — not raw `sAnswers`. `apps/web/app/practice/[slug]/…` — deterministic rotation per (itemId, Vienna-day) across existing pools + manual mode chips. **`/review` stays carrier** this PR (recorded-tier comparability; follow-up decision noted in the PR body). DO NOT TOUCH: `xpForTier`, the outbox, the retry ladder.
Exit criteria: task-ui unit tests (per-pool: authored first full answer grades `correct`; headword-leak impossible in definition mode); dev-server POST one attempt per pool ⇒ `tier:"correct"`; full gate incl. `check:bundle` (task-ui rides the ≤150KB budget).

### IV.2 · WS-N — The narrative program (**Fable-reserved**)

_Three campaign bibles authored by Fable 5 directly (Koki's instruction: curated with model intelligence, never delegated, never templated). Each bible = premise · cast sheet (canon-checked against the art prompt libraries) · per-unit beat map (**the unit's vocabulary + grammar is the level's substance — the story IS the task**; the student should feel they're solving the story, not tasks) · fork/flag manifest + endings matrix (G4) · register sheet · **chapter 1 authored through the pipeline, validate-story green, rendered preview** (the voice test). Each campaign has a Koki narrative gate BEFORE any volume authoring. Premises below are approved direction; the bibles refine them._

**G1-N · "The Lost Pages" — the revision** (retrofit; zones, tasks, cast survive; the spine gains a cause, a mystery, and a heart)
- Act 1 (z01–z05) wonder + first anomalies: the tampering made visible — words tangle, characters act wrong (the Captain afraid of the sea; Chef Luca forgetting food words). Restoring pages = the existing tasks, now diegetically motivated.
- Act 2 (z06–z10) the investigation: z06 is literally the detective unit; erased-word "shadows," pencil-smudge trails, unsigned notes ("Why should YOU get to read it? Nobody ever helped ME.").
- Act 3 (z11–z15) the discovery: the saboteur is a former student (name = Koki gate) who was so lost in English that the book swallowed him; his despair erases pages. **No defeat — the finale teaches him:** the player restores the last pages WITH him; z15's own grammar ("What are you going to do?") is his release question. Sets up G2.
- Trope answer: no bolted-on companion-girl/wise-mentor. **Finn gets an arc instead** — he remembers the day the book swallowed the boy and has been hiding it; the guide is implicated. Register: sad-not-scary, A1, du-form scaffolds, kid-German glosses; the antagonist is a hurt child, never a villain.
- Gate pack **G1-N**: revised 15-beat outline · antagonist name+cast entry · register sheet · revised ch06 or ch11 (an investigation-turn chapter) authored + rendered. (~30–45min Koki.)

**G2-N · The new G2 campaign** (working title in the bible; Phaser overworld, school setting)
- The inversion: in G1 you went into the book — now **the book leaks into YOUR school.** The redeemed G1 boy, now free, is your deuteragonist; his years inside gave him the ability to "read the ink." The residue of his erasures — **the Blank** — escaped into the school: story-logic infects it unit by unit (u03 Halloween decorations come alive · u08 the sci-fi shelf leaks into the library · u05 the town map rearranges · u04/u15 the bio-room animals talk · …all 15 MORE!-2 units map to school zones/events on the walkable overworld).
- His redemption completes by facing what his sadness created. Theme: **you fix what you broke — together.** Register: A1+/A2, comic-strip dialogue beats, du-form scaffolds.
- Gate pack **G2-N**: premise + 15-zone/unit beat map · cast sheet (carryovers + new) · register sheet · zone-1 chapter authored + rendered on the generalized overworld (after WS-B B-2 scaffolding exists).

**G3 · FOURTEEN — untouched.** Ch14 already lands the bridge. Optional later: a "Season 2" teaser card on the season board once G4 releases (1-line hub change, rides a WS-B PR).

**G4-N · "FOURTEEN: LIVE" (working title)** — one year on; the crew streams live and inherits the dying school mag. **The scandal: the school's funded-class-trip competition was rigged** — the destination vote (Dublin / New York / Sydney = u01/u03/u07, the three destination-research episodes) was bought through sponsor favors.
- Beat spine: u02 Whodunit = the tip + method (the unit is detective fiction — they learn investigation FROM it) · u04 A working life = newspaper internship; the mentor-journalist teaches verification ethics (two-source rule, source protection) · u05 Hungry? = the catering-favor trail · u06 Kids make a difference = the moral pivot + **FORK 1** (pursue openly vs quietly) · u08 Obsessed! = Leah's obsession endangers the crew (echoes G3's theme — the growth test) · u09 Body talk = the pressure arc before the key interview · u10 A fair world = the ethics core + **FORK 2** (confront privately vs publicly; humanize the person who took the favor) · u11 Ready for reading = the archive dive (old school mags hold the precedent) · u12 Space = the planetarium event; the keystone confrontation · u13 A school mag = the finale + **FORK 3** (break it live vs the measured special issue vs going to the Direktorin first).
- Endings **cluster**: the truth always comes out; what differs is who gets protected or hurt — the player's decisions shape the plot, never the grades (Law: choices are answered by the story, never scored). Epilogue: the honest re-vote, flag-flavored. Register: 14-year-olds; no cartoon villains; adult wrongdoing at plausible school-politics scale; every heavy scene ends with one warm hand.
- Gate pack **G4-N**: full outline (13 beats) · flags manifest (3 major pairs) + endings matrix · cast sheet (G3 canon carryover: Leah/Leo/Ben/Sara/You + new adults) · register sheet · ch1 (the cold-open "Previously on FOURTEEN" + the tip) authored + rendered.

### IV.3 · WS-B — Game engineering (pre-authoring infrastructure)

**B-0 · Shared small fixes** (land FIRST — each unblocks content lanes; one PR)
- **VS-15 ending coverage** (~1–1.5d): in `packages/content-pipeline/src/validate-story.ts` — enumerate major-flag combos (one flag per major pair + all-unset neutral); BFS every released chapter resolving FlagGates per combo; hard-fail (i) any combo that fails to terminate, (ii) any terminal scene of the final chapter reached by NO combo; emit the combo→ending matrix as an ℹ info artifact (the narrative-gate review aid — do NOT force 1:1). Fixture tests: 2-major reconverging story passes; orphaned ending fails.
- **Loader `role: canonical|bonus`**: `release.json` gains optional `"role"` (default canonical). `listReleasedStories()` keeps the one-CANONICAL-per-grade throw; NEW `listBonusStories(grade)`; `storyIdForGrade` returns the canonical. `.ci.` attempt resolution scans canonical AND bonus (the old campaign's comprehension keeps grading). **MUST merge before any second g2 release.json ships** — today two released stories per grade crash every page calling `storyIdForGrade`.
- **`storyItemsFor` composite key** (~10 lines): `${itemId}#${variantKey ?? ""}` in `apps/web/app/(game)/play/[grade]/[zone]/page.tsx:35-65` + the runtimes' `storyItems[...]` lookups — unlocks reusing one item with different variant carriers in a chapter.
- **G4 flag-scope guard** (0.25d): `TripGame.tsx:119` seeds flags from `initialSave.flags` unconditionally — add optional `storyId` to `TripSave` (additive cosmetic field, schemaVersion stays 1); drop restored flags on story mismatch. Unit test against a fabricated LfW save.
Exit criteria: full gate; VS-15 fixtures green; a two-story fixture grade resolves canonical+bonus without throwing; composite-key regression test.

**B-1 · G1 retrofit engineering** (1–2d; content = Phase-4 waves)
Goal: the revised spine ships as pure data. Verified: the runtime is story-agnostic — revised scenes/chapters are `story.json` + `comprehension.json` + `cast.json` edits; **zero Phaser/grid/save changes required.**
Optional (recommend deferring until the bible demands it): second walkable NPC channel (additive glyph in `ZoneTheme.layout` + `onNpc(npcId)`; ~0.5–1d) — ship the arc dialogue-first, sprite as polish. Finale zone variation: new theme in `packages/art-gen/src/theme.ts` (append-only; G1 theme snapshots stay frozen) + a one-line **`nearestWalkable` resume-clamp** in `OverworldScene.create()` (a moved wall must never strand a saved `pos`; unit-tested via `path.test.ts` fixtures).
Staged rollout: revisions to released chapters go live on merge ⇒ ship per-chapter-block PRs, each leaving the bundle validate-green and playable; a held-back finale variant is only possible as a new chapter on unit 15.
Exit criteria: full gate; `validate-story` green with new counts; `__domigo` playtest — tap to NPC cell, dialogue overlay shows new scenes, one new `.ci.` POST returns `tier:"correct"`; resume-clamp test green.

**B-2 · G2 overworld generalization + new campaign scaffold** (5–7d; content separate)
Goal: `@domigo/game-2d` becomes campaign-agnostic; the new school campaign scaffolds on it; the old detective game becomes the bonus story.
Steps: (1) Generalize (verified small couplings): `PhaserGameProps` gains `mode: string` (kills the `game:g1` hardcode at `PhaserGame.tsx:66`), `copy: WorldCopy` (npcHint/encounterLabel/moveHint …), `tileArt?: Record<string,string>`; `ZoneBoard` labels via props (G1 hub keeps passing its "Lost Pages" strings — G1 stays byte-identical, theme snapshots + `anim`/`path` tests frozen). (2) **Image-first tileset resolver**: server `resolveTileArt(storyId, generator)` in `apps/web/lib/` over `apps/web/public/art/<ns>/` (only-present discipline, mirrors `story-art.ts`); Phaser `preload()` queues real PNGs per kind; procedural `paintTileset` remains the per-kind fallback. **This also fixes G1's real-art path for free** (the `G1_SCHOOL_IMAGE_PROMPTS.html` contract). (3) New bundle `content/corpus/stories/g2.st.<new-id>/` with `map.json` (map@1, 15 school zones; NEW school theme family in art-gen, append-only) + story/cast/names/comprehension/art/release (**`releasedChapters: []` until dispatch is proven**). (4) Route dispatch becomes **bundle-derived**: `loadGameMap(storyId) != null` ⇒ overworld; else per-grade DOM fallback (detective/novel/trip) — old campaign untouched. (5) Save slots: widen `/api/game-save` regex to `^game:g[1-4](:bonus)?$`; DetectiveClient moves to `game:g2:bonus` (old cosmetic saves are simply a different slot; attempts `mode` stays `game:g2` for both — ledger-compatible). (6) Bundle budget: both grades mount the SAME `PhaserGame` module through one shared dynamic-import module — `check:bundle`'s `phaserCount === 1` is the tripwire. (7) Art pipeline: parameterize `docs/art/sync-art.mjs` (`--lib/--dest`), generate `g2-<campaign>-art-files.json`, clone the prompt library per zone (Koki keeps generating into the iCloud drop).
Riskiest bits: the two-released-stories throw (mitigated: B-0's loader role lands first + empty release.json until proven) · Phaser chunk duplication (mitigated: shared dynamic-import + check:bundle) · image-tileset jank on cheap Androids (mitigated: preload behind the loading state, source dims per the prompt library, procedural fallback, device gate before releasing chapters).
Exit criteria: full gate with both campaigns built (`Phaser in 1 chunk ≤400KB`); loader canonical/bonus + dispatch tests; `__domigo` playtest on a school zone (tap-path, encounter fires, NPC dialogue renders); regression — `/play/2` bonus card opens a Wrong-Name chapter and its `.ci.` POST returns `ok:true`; **physical cheap-Android session before any chapter release** (headless-Phaser honesty stated in the PR).

**B-3 · G4 swap engineering** (3.5–4.5d; narrative = Phase-4 waves)
Goal: the new FOURTEEN-sequel bundle rides the existing flag-aware runtime; LfW parks cleanly.
Steps: (1) new bundle `g4.st.<new-id>` (flags.json: 3 major fork pairs `major: true`; forks reconverge in-chapter — schema-forced; taskSlots on the spine only per VS-14; VS-13/15 CI-gated). (2) Park `g4.st.lost-for-words`: `releasedChapters: []`; bundle stays in CI; deliberate ℹ "story parked — 0 released chapters" line in validate-story output. (3) Per-story copy pack: `game-trip` exports `tripCopyFor(storyId): TripCopy` (title, noun, taglines, board label+verb, stamp lines, economy nouns — "lines" → the newsroom skin); the three verified hardcode leaks move into it (TripGame header `TripGame.tsx:265`, hub tagline/board label `play/[grade]/page.tsx:89,113,164`, journal-board "stamped"); grep-test asserts no "LOST FOR WORDS"/"Reisetagebuch" literal survives outside the LfW pack. (4) XP stays `xpForTier` — the reskin renames display only (Law 5).
Exit criteria: full gate; `validate-story` green incl. `VS-15 — OK (K combos → M endings)` matrix; flag-scope-guard test (fabricated LfW save does not trip new-story gates); fork walkthrough — a node walker (reuse VS-15's BFS) prints each combo's scene path, then in-browser: each major fork chosen, flagLines callbacks + all ending clusters render; one `.ci.` POST per chapter ⇒ `tier:"correct"`; grep-test green.

### IV.4 · WS-C — Campaign authoring waves (Opus under Fable calibration)

Per campaign, strictly after its narrative gate: chapter waves (≤1 chapter or ≤25 items per PR) through the **narrative loop** (Part III) — each PR: scenes + comprehension items + art beats (via the prompt libraries + parameterized sync) + release.json staging; validate-story green; register-rubric self-check against the campaign's register sheet; every `.ci.` key POST-graded `correct` through the real engine; wave stats in the body. Koki sampling: register-rubric pass per wave; plays 1-in-5 chapters in-app. Art waves follow the **art loop** with the style-key-first doctrine.

### IV.5 · WS-P — Platform wave (migrations 0006–0011, all additive `domigo_v2`)

_Order: P-1 → P-2 → C-1 → S-1 → S-2 → J-1 → J-2 → W-1 → W-2 → V-1. Donor = `~/code/srdp-practice` (file pointers verified 2026-07-10). Two standing gotchas carried from the donor: Neon HTTP no-transactions ⇒ journal-then-flip; neon-http may return jsonb as a string ⇒ always route reads through a normalizer._

**P-1 · v2-native identity — migration 0006** (4d)
Goal: teachers + classes become v2-owned writable rows; every existing v1 account keeps working.
Tables: `domigo_v2.users` (id, role student|teacher, displayName, **realName** (teacher-visible only), classId, pinHash nullable-until-claimed, status provisional|claimed, email unique nullable, createdBy, isTest, timestamps; partial unique index `lower(display_name)` per class) · `domigo_v2.classes` (id, name, **code** unique, grade, teacherId, archivedAt) · `domigo_v2.roster_events` (journal: classId, userId, action import|claim|pin_reset|rename|remove, payload jsonb, by, at).
Files: `packages/db/src/schema.ts` · NEW `packages/db/src/identity.ts` (`lookupStudentForAuthV2`/`lookupTeacherForAuthV2`/`resolveClassByCode` — v2 first, v1 mirror fallback) · `apps/web/auth.ts` (authorize calls the composed lookups; credential shapes unchanged) · `apps/web/lib/invite-code.ts` (v2 generator read-checks v1 invite codes — shared code space never collides) · NEW `/admin/classes` page + API (create/rename/archive; show code).
Exit criteria: vitest precedence table (v2 hit beats v1; archived class rejected); `node scripts/verify-identity.mjs` on a Neon dev branch: create teacher+class via API → credentials sign-in → session carries role+classId; full gate. Koki-gate: teacher-signup policy (seeded accounts + env-gated invite recommended; 15min).

**P-2 · Roster import + student claim** (3d)
Goal: teacher pastes/CSV-imports a student list → provisional accounts with real names; students claim via class code and choose display name + PIN; teacher always sees the real↔display mapping. (Bulk import exists in NEITHER repo — fresh work; the claim flow adapts donor `app/join/[code]`.)
Files: NEW `packages/db/src/roster.ts` (parser: line-per-student + CSV, dedupe, preview-before-commit; import; **claim = journal-then-flip**: INSERT roster_events THEN UPDATE user; resetPin/rename/remove) · NEW `/admin/classes/[id]` roster table (model: donor `RosterTable.tsx`) + import panel · NEW `/join/[code]` claim flow (student picks self from a **given-name + initial** list → display name + 6-digit PIN) · APIs.
Exit criteria: vitest (parser edges, claim state machine, idempotent re-import, duplicate-claim blocked); `node scripts/verify-roster.mjs` E2E: import 3 → claim 1 → sign in as claimed student → admin API returns the mapping; full gate. Koki-gate: claim-screen privacy design (~20min).

**C-1 · Checkup assignment mode — migration 0009 (one additive column)** (4d)
Goal: Koki's real one-page **/20** unit checkups as `assignments.mode='checkup'`, engine-graded.
Reuse: the ENTIRE M-wave (sections/sessions/timing wall/attemptsPerTest/Notenschlüssel/pure scoring in `packages/db/src/assignments.ts`). `mode`/`kind` are open text — the only DDL is `assignment_sections.section_config jsonb` (`{checkupKind, direction, mask:'first-letter', points}`).
One-brain compliance (no engine change): first-letter gap-fill = **presentation-only mask** in task-ui ("c____" — key + grading are the unchanged vocab item); translations use the E-1 direction pools; definitions→word uses `dAnswers`; picture vocab compiles to multiple-choice with an image prompt; the grammar section serves the unit's existing grammar items.
Files: NEW `apps/web/lib/checkup.ts` (`GRADE_STRUCTURES` presets per grade — extracted by Fable from the efl-checkup-generator framework + Koki's real class checkups — + `composeCheckup(unit, reservedItems)` summing to exactly 20, reserved-first) · builder "Checkup" template in `AssignmentBuilder.tsx` · API accepts mode+config with server-side 20-point-sum validation · one-page layout in `AssignmentRunner.tsx` · first-letter mask prop in `packages/task-ui` · /20 points-weighted scoring extension (pure, boundary-tested).
Exit criteria: composer tests (every grade preset ⇒ exactly /20, deterministic under seed); self-grade sweep (every composed item round-trips `correct` against its own key through the engine); `node scripts/verify-checkup.mjs`: teacher creates g2-u03 checkup → student session → server wall enforced → submit → scorePct+note match a hand-computed fixture. Koki-gate: per-grade preset sign-off + picture-asset decision (emoji / art / defer) (~30min).

**S-1 · Studio overlay core — migration 0007** (3d)
Goal: DB overlay for prose edits + site copy; journal-then-flip publish; byte-identical passthrough; git fold-back — the substrate S-2 rides.
Tables: `content_overrides` (itemId unique, unitSlug, kind, patch jsonb, status draft|published, foldedAt, updatedBy) · `content_revisions` (journal: patch, action publish|revert|fold, by, at) · `site_copy` (key unique, value, updatedBy).
Files: NEW `packages/content-loader/src/overrides.ts` (pure `applyOverlay` + **ALLOWLIST** validator adapted from donor `lib/content-overrides.ts` — vocab: hints/gloss/example prose only, `de`/`en` grading keys EXCLUDED; grammar: `prompt.text` with **blank-count-preserved** check + hints/explanations; answers/distractors/format/id unreachable — unknown keys 400 by construction) · NEW `apps/web/lib/content-service.ts` `loadUnitWithOverrides()` (corpus → git overlay → DB overlay; cached, tag-revalidated; the fs loader stays pure; all read surfaces switch to the service) · Studio LIST/DETAIL editor (canon values ghosted, per-field reset, locked fields explained in plain language) · API (recursive key-inspection; **journal row THEN flip**) · NEW `scripts/export-studio-overrides.ts` (fold-back into `content/overlays/item-fixes.json`, byte-preserving → normal PR → rows cleared after merge).
Exit criteria: **passthrough invariant** — empty overlay table ⇒ deep-equal output for all 57 units (vitest); allowlist fuzz (answers/format/id ⇒ 400); crash-order test (orphan journal row is harmless); E2E: patch a hint via API → `/practice` serves it → fold-back dry-run shows exactly that diff → `pnpm content validate` green on the folded tree. Koki-gate: field-list confirm (15min).

**S-2 · Studio full CRUD + automated blind-solve gate — migration 0008** (5d)
Goal: create/replace/remove tasks and relabel units natively — publishable only through automated gates. (Implements ledger reversal #5.)
Tables: `content_drafts` (itemId unique, unitSlug, kind, full item jsonb, action create|replace|remove, status draft|checking|check_failed|published, updatedBy) · `content_checks` (journal: draftId, checkKind zod|blind_solve, verdict, evidence jsonb — AI answer + engine tier + model + costUsd, at) · `unit_meta` (unitSlug unique, title overrides — unit relabeling).
Files: content-service merge precedence extends (corpus → git overlay → prose overlay → published drafts, incl. removals) · NEW `/admin/studio/new` format-aware item form driven by `@domigo/content-schema` zod · drafts + check APIs — zod first, then **blind-solve: a server-side Anthropic call answers the item WITHOUT its key; `@domigo/engine` grades the answer; only tier `correct` publishes (hard-block, no manual override)**; journal to content_checks THEN flip · fold-back extends to fold drafts into `content/corpus/units/<slug>/{vocab,grammar}.json` (+ removals via item-fixes).
Constraints biting: the verdict is the engine grading the AI's answer — never string compare (one brain); non-published drafts are structurally unservable and unassignable; fold-back keeps git canonical (regeneration never loses Studio work).
Exit criteria: merge-precedence vitest + "check_failed never serves"; `node scripts/verify-studio-crud.mjs`: create item via API → blind-solve runs + journals cost → publish → appears in `/api/admin/catalog` → self-grades `correct` through `POST /api/attempts` → fold-back dry-run passes `pnpm content validate`. Koki-gate: walkthrough + explicit ledger-reversal acknowledgment + blind-solve policy (hard-block recommended) (~30min).

**J-1 · Pools + journeys runtime — no DDL** (5d)
Goal: the corpus partitions into `practice|homework|classwork|mock|arcade` pools; `/learn` renders an authored per-unit spine; progression derives from `practice_attempts` — never a separate path-state table.
Files: `packages/content-schema` gains `Journey@1` (ordered nodes `{id, kind: lesson|practice|game|review|side-quest, itemPool, gamePointer{grade, zoneOrChapter}}`) · content-loader gains `loadJourney(slug)` + pure `pools.ts` (`assignPool(item, reservedSet)` — active `reserved_items` force mock; authored overrides in journey.json; deterministic remainder split) · NEW `packages/db/src/journey-progress.ts` (node status/stars derived from attempt best-tiers; attempts write `mode='journey:<unit>:<node>'` — open text, no DDL) · `/learn` re-rendered as the spine (game nodes deep-link into the campaigns) · `study_path_progress` kept read-only as a stars fallback · `packages/db/src/review.ts` — review/practice feeds EXCLUDE the mock pool (reserve integrity enforced platform-wide) · NEW `pnpm content validate-journeys` (every gamePointer resolves; pools non-empty).
Exit criteria: vitest — total partition (every item in exactly one pool), reserved-wins, mock never leaks into `getDueRefs`; derivation fixtures; `node scripts/verify-journey.mjs` (seed attempts → nodes unlock correctly); validate-journeys green.

**J-2 · Journey authoring: generator + pilot + wave** (3d + off-queue wave)
Goal: a deterministic generator drafts `journey.json` for all 57 units; a hand-polished g2 pilot proves the shape; the rest is an authoring wave.
Files: NEW `packages/content-pipeline/scripts/gen-journeys.ts` · pilot `content/corpus/units/g2-u03/journey.json` · NEW `docs/runbooks/journeys-wave.md` · validate-journeys wired into `pnpm content`.
Exit criteria: generator emits validator-green drafts for 57 units; the pilot walked end-to-end by script (lesson → practice attempt recorded → game pointer resolves → review). Koki-gate: pilot walkthrough — spine calibration (~30min) before the 57-unit wave.

**W-1 · Writing capture v2 — migration 0010** (4d)
Goal: teacher-authored writing tasks + a composer capturing keystroke telemetry and photo uploads of handwritten texts.
Tables: NEW `domigo_v2.writing_tasks` (slug unique, **grade 1–4 + unitSlug** — the unit-aware correction key, textType, title, prompt, bulletPoints jsonb, targetWordCount, imageUrl/Caption, blockPaste, classId nullable, archived) · additive columns on `writing_submissions`: writingTaskId, keystrokes jsonb, startedAt/lastEditedAt, status draft|submitted, imageUrls jsonb, sourceKind typed|photo.
Files: NEW `apps/web/lib/keystroke-events.ts` — near-verbatim donor port (`{t,k,m?,n?,p?}`, violation tags, **`normalizeKeystrokeColumn`**) · NEW image-upload lib + API (Vercel Blob, EXIF-stripped, ≤5 images, Blob-URL allowlist, size-capped) · NEW `packages/db/src/writing.ts` (task CRUD; 10s append-style autosave = single-row UPDATE, transaction-free by construction) · `/admin/writing` task CRUD (model: donor `WritingTaskForm.tsx`) · student composer `/writing/[slug]` · `assignment_sections.kind='writing'` wires via the existing `writingPromptId`.
Exit criteria: donor-adapted keystroke + upload tests; jsonb-as-string round-trip test through the normalizer; `node scripts/verify-writing-capture.mjs`: create task → 3 autosave flushes grow keystrokes append-only → forged non-Blob URL rejected → submit freezes content. Koki-gate: per-grade text-type lists (async confirm).

**W-2 · Sandbox AI correction + OCR + release gate — migration 0011** (6d)
Goal: the srdp correction pipeline, driven by a new vendored skill derived from the four local `efl-writing-assessment-grade1..4` skills, with an OCR branch for photo submissions and a teacher release gate.
Tables: `writing_corrections` (submissionId unique, correctionData jsonb `{format:'markdown', body, generatedAt}`, **releasedToStudent default false**, releasedAt/By) · `writing_correction_runs` (status running|succeeded|failed, model, costUsd, tokens, errorMessage, timestamps).
Files: NEW `apps/web/lib/correction-runner.ts` — donor port (start/poll split; Vercel Sandbox node22/2vcpu; 12-min timeout; 18-min stale guard; `CLAUDE_CODE_OAUTH_TOKEN`-first auth; `sandbox.stop()` in finally) · payload builder gains the **unit-coverage block** (which units the class has reached — makes only-taught-grammar flagging work) + image URLs · NEW `scripts/sandbox/run-correction.mjs` (Agent SDK; pre-fetches submission images into the sandbox) · NEW vendored skill `skills/domigo-writing-correction/` (SKILL.md + references): per-grade error-code tables (**13/17/21/25**) + unit-aware grammar ladders from the grade skills; audience-partitioned `correction.md` (`<!-- teacher-only -->` / `<!-- student-only -->`); warm du-form student register per the writing-reference-pack doctrine; **OCR branch** — when the payload lists images: pixel-perfect transcription FIRST (anti-autocorrect protocol, crossout handling, from the grade-3/4 skills), transcript emitted teacher-only, correction runs on the transcript · teacher submissions UI (run + release toggle); student view renders the student partition ONLY when released.
Constraints biting: run-row INSERT before sandbox start; success = UPDATE run THEN UPSERT correction; release is a journaled flip; **AI output is feedback, never a graded tier** — writes no attempts, no scores (mock-test writing % stays teacher-entered; manual grading remains the floor).
Exit criteria: payload-builder vitest (unit coverage per grade) + markdown sanitize; `node scripts/verify-correction.mjs`: one real sandbox run on a typed g2 fixture + one photo fixture → non-empty correction.md, partitions parse, run row has cost/tokens; release-gate test (student fetch 404s until flip); stale-guard unit test. Koki-gates: per-grade register review on 4 samples · cost ceiling · **photo-Datenschutz for minors' handwriting images (retention/access) — blocks prod enablement** (~45min total).

**V-1 · Visual design parity suite** (3d — after Wave-2 UI stabilizes)
Goal: automated pixel-parity proof between deployed design and repo design.
Files: NEW `apps/web/playwright.config.ts` + `apps/web/e2e/visual.spec.ts` (`toHaveScreenshot` committed baselines; routes: /home, /practice/<pilot>, /learn/<pilot>, /review, /assignments, /admin, /signin, one game shell; viewports 360×740 + 1280×800; dynamic regions masked, animations disabled, fonts awaited) + computed-style assertions on the `[data-grade]` accent tokens from `globals.css` (tokens checked exactly, not by pixels) · NEW `scripts/verify-design.mjs --url <localhost|prod>` · CI job.
Exit criteria: suite green locally AND against prod; a deliberate 1px token change turns it red (negative test). Koki-gate: one-time baseline blessing (15min).

### IV.6 · WS-GO — Prod DDL sitting + closing verification

**GO-1** (1.5d + 60min sitting)
Goal: migrations 0000–0011 applied to prod Neon; v2-native auth live; the wave's closing receipts.
Files: NEW `docs/runbooks/prod-ddl-sitting.md` — per-statement apply; **`pg_dump --schema-only --schema=public` before/after must diff EMPTY** (proves `public.*` untouched); env checklist (`CLAUDE_CODE_OAUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`, Anthropic key for S-2).
Exit criteria: `verify-deploy` + `verify-design` green against prod; scripted auth matrix (v1 student · claimed v2 student · v2 teacher); empty public-schema diff committed as a receipt. Koki-gate: **co-piloted sitting (60min) — destructive-class, never defaults.**

---

## Part V — Sequencing (no dates — dependency order only)

**(a) The single-file order** (deviate only when a Koki gate blocks — then pull the next unblocked item, per v1 loop (a)):

```
0. BLUEPRINT_V2 + T-1 ✅ · G1-N gate pack ✅ · L-1 language layer (IV.0b) ✅
1. T-2 deploy-truth (+T-3 eyes-on pass)
2. A-1 E-2 audit script          ← unblocks K-4 + first fix waves
3. A-2 E-3 strictness (K-2)
4. A-3 curation standard (Fable) ← before any wave
5. A-4 E-4 blind-solve harness   → g2 run → K-4/K-8 calibration
6. A-5 fix waves to green        (interleaves with everything below)
7. A-6 P-10 vocab rotation
8. B-0 shared fixes (VS-15 · loader role · composite key · flag guard)
9. WS-N gates: G1-N pack → G4-N pack → G2-N pack   (Fable authors; Koki gates)
10. B-1 G1 retrofit engineering → G1 revision waves (WS-C)
11. B-3 G4 swap engineering     → G4 chapter waves (WS-C)
12. B-2 G2 overworld engineering → G2 campaign waves (WS-C, + art loop)
13. P-1 identity → P-2 roster → C-1 checkups
14. S-1 overlay → S-2 full CRUD
15. J-1 journeys runtime → J-2 pilot + wave
16. W-1 writing capture → W-2 sandbox correction
17. V-1 visual parity suite
18. GO-1 prod DDL sitting + closing receipts
```

**(b) Rationale:** truth first (everything downstream cites the harness) → correctness machinery second (it protects real students and every later authoring wave uses blind-solve) → narrative gates early (they block the longest lanes and cost Koki minutes, not days) → game engineering before campaign volume → platform wave in donor-port order (identity unblocks the most; checkups deliver classroom value off the finished M-wave; Studio before journeys so content fixes feed the journey wave; writing last — riskiest external dependency) → visual baselines once UI is stable → prod sitting last with all receipts in hand.

**(c) Koki gate queue (in encounter order):** T-2 Vercel confirm · K-4 audit calibration · K-2 policy · G1-N (incl. antagonist name) · K-8 rewrites · G4-N · G2-N · P-1 signup policy · P-2 claim privacy · C-1 checkup presets + picture decision · S-1 field list · S-2 walkthrough + reversal acknowledgment · J-2 pilot · W-1 text types · W-2 register + cost + photo-Datenschutz · V-1 baselines · GO-1 sitting. Batch into gate menus as convenient; narrative/destructive/legal gates never default on silence.

**(d) Retained backlog (v1 specs, resequenced, no deadlines):** W-0 A-level cloud skills + the 56-unit listening/test waves · AU-1..4 ElevenLabs audio (+K-3v voice casting) · D-1..D-8 didactics (feedback backfill, lessons, listening ritual, autonomy plan, placement, mastery views) · M-2b writing/listening/reading mock sections (unblocked by W-1/W-2 here) · GX B-wave ceremonies/re-fog/teasers · v1-parity P-1..P-9 (dark mode, profile/badges, fluency arcade, Daily Challenge, dictionary, leaderboards, Activity Game) · Track D remnants (D-1 Firebase re-import, D-3 race harness, D-4 PWA, D-5 perf CI, D-6 Datenschutz — **D-6 still precedes any student seeing W-2 output**, D-7 XP reconcile, D-8 bulletproof checklist). Slot them after GO-1 or interleave when a lane is gate-blocked.

---

## Part VI — Delegation matrix

- **Fable 5 reserves:** the three campaign bibles + register sheets + each campaign's gate chapter (the voice bar) · A-3 curation standard + E-4 triage calibration · C-1 checkup preset extraction from Koki's real documents · this blueprint + any re-planning · judgment calls that change scope or voice.
- **Opus 4.8 executes:** every WS-T/A/B/P/GO engineering item · WS-C chapter waves, journey waves, fix waves — each against its Part IV spec inside the Part III loop. An executor who finds a spec↔code contradiction fixes the doc via T-1-style reconciliation or escalates; it never improvises around it.
- **Koki:** the gate queue (Part V.c) · squash-merges · plays the calibration samples · runs the GO-1 sitting and, at program end, the teacher persona of the acceptance script.

## Part VII — Verification & program acceptance

- **Per PR:** standing gate + item exit criteria + Verification-honesty section.
- **Per wave:** validators + blind-solve where keys are touched + the fixed sampling tier + wave stats trend.
- **Per phase:** a dated 3–5-line Vision-log verdict below (erase-the-teacher? one-brain held? level-gate held? authored-not-programmed held?).
- **Program acceptance (the closing script):** four student personas (one per grade, cheap Android): sign-in → journey spine → practice with pool rotation → their game campaign incl. a fork with visible consequence (g3: an episode; g1/g2: overworld zones; g4: a fork + ending) → a checkup with the server wall → writing (one typed, one photo/OCR) with released AI feedback. The teacher persona (Koki): imports a roster → builds a checkup → creates + publishes a task through Studio's blind-solve gate → runs + releases a correction → patches a typo and folds back to git → reads the deploy + design receipts. Every step a pass/fail row in the closing docs PR.

## Vision log

_(dated 3–5-line verdicts, newest first)_

- **2026-07-10 (Wave-2 program start):** plan approved in-session; deadlines retired; G4 pivoted to the FOURTEEN sequel; G2 pivoted to a Phaser overworld replacement (old game → bonus); Studio unlocked to full CRUD behind automated gates; curation machinery (E-2/E-3/E-4) promoted to the top of the queue. This blueprint + T-1 reconciliation are the first PR.
