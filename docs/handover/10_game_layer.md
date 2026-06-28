# 10 — The Game Layer (four standalone grade games)

> Added 2026-06-11 (Increment 2 of the kickoff plan) after Koki studied the June-2026 Fable 5
> capability reports (`Domi Gym/YT Video Transcripts/June 2026/`). Supersedes
> `docs/runbooks/story-mode-spike.md`. The guardrails in `08_design_principles.md` apply to every
> pixel of this — re-read them first. Item quality (04) keeps right-of-way over everything here.

> **Content prerequisite SATISFIED (2026-06-17):** the items wave is complete — all 57/57 units
> approved at 0.0% reject, every item carries `presentation.gameMeta` (distractor pools / chip
> budgets / minOptions) + `difficulty` 1–3, and the cumulative level gate is in force. The game
> layer is therefore unblocked on content; what it now needs is the runtime (the foundation harness:
> loader + all-format renderer + grader) plus the story/quest/map/encounter schemas below.

## Mission

Real game worlds where **progression is always earned by solving vocabulary/grammar/language
tasks** — "CLT on steroids in a gaming environment." Didactically rich, age/level-appropriate,
German-scaffolded for lower grades, fully playable on the installed PWA on cheap phones.

**Owner decisions (2026-06-11):** bigger game launch for September with per-grade formats (g1 first)
· four STANDALONE grade games, not a shared universe · ALL-procedural art (no external packs —
SVG/canvas/shader, everything coded) · item review is Fable-performed with digests to Koki.

## The Laws (guardrails as game physics — every mechanic obeys these by construction)

1. **Nothing student-facing exists outside the cumulative word bank unless glossed**
   `word (= deutsches Wort)` — enforced by the SAME `tokenize.ts` level gate over all dialogue,
   signs, item names, and flavor text. Atmosphere is not exempt from i+1.
2. **Progress is only ever earned by language.** No grinding, no luck, no purchases. Doors open
   because you understood; bosses fall because you produced.
3. **Failure changes pace, never position.** No HP-death, no lives/hearts/energy, no XP loss.
   A wrong answer pauses the world, reveals, and re-queues the item later (receptive form first).
4. **Du-form German everywhere; zero meta-talk.** Grammar names live in teacher views only —
   the student just opens the past-tense pirate cove.
5. **One grading brain.** Every mode renders tasks through one shared task renderer
   (`packages/task-ui`, a DOM overlay above every canvas) and grades server-side through
   `@domigo/engine` 4-tier (`correct/partial/close/wrong` → full/half/half/none XP) into the
   EXISTING xp/grammarXp pools. No third XP pool. Cosmetic currency ("Ink") is earned alongside XP
   and can never buy progress, answers, or retries.
6. **Spaced retrieval is world physics.** Due `review_queue` items spawn as wandering encounters /
   NPC re-asks; cleared areas visibly "re-fog/fade" as scheduled retention decays — re-clearing IS
   the review session. Exposure always converts: nothing is shown without being retrieved at least
   once in-session.
7. **Input → Guided → Output inside every quest.** Receptive checks before supported production
   before free production; scaffolds fade by grade.
8. **Timers only on mastered material** (fluency arcade). Never on new material. An A1 child
   thinking for 20 seconds is the system working.
9. **Bulletproof:** checkpoint ≤90s apart, resume mid-battle, offline attempt outbox, pause-on-blur.
   A game mode ships when its loop + grading + offline resume work at class scale — else it does
   not appear in the UI (no dead toggles).

## The four games

### G1 — the starter overworld RPG (build FIRST)
2D top-down Pokémon-style world (Phaser 3). Zone-per-unit — the 15 approved unit themes ARE the
level plan. Wandering encounters = battles answered via task cards (multiple-choice as move
buttons, gap-fill, anagram as letter-tile spell-casting). NPC dialogue = comprehensible input with
dual-language bubbles (EN + lighter DE subtitle, du-form); failed comprehension → the NPC rephrases
simpler (scripted negotiation of meaning), then offers the gloss. Doors/bridges = grammar locks
(sentence-building/transformation). Unit boss = the unit checkpoint material wearing a costume.
Heaviest scaffolds: auto-audio (TTS), ≤2 lines/bubble, ≤60 EN words/scene, chip-based production,
tap-any-word gloss. Premise seed: "The Lost Pages" (Finn; a world whose words fade — fading = the
review mechanic made visible).

### G2 — Watson Manor: the complete rework
Detective adventure: DOM+SVG investigation scenes + case-file/evidence board. **Tasks ARE clues:**
error-correction = lie detection (the forged race document carries a tense error that proves it was
written after the fact); question-formation = interrogations (the NPC answers the question you
actually built); translation = Felix's German diary (in-fiction reason for DE↔EN); group-sort =
evidence sorting; gap-fill = smudged notes. The complete legacy 15-chapter mystery
(Nora & Elias investigate; Felix planted evidence to protect his brother Lukas; Coach Martinez took
the trophy to engrave the TRUE result; headmaster Kramer falsified the race) is re-authored through
the story pipeline at the g2 gate — chapter N gated on units ≤ N (the legacy chapter themes already
align 1:1 with the g2 units). All-new procedural art (the 118 legacy JPGs are reference only).

> **⚠ Status update (2026-06-28) — G2 shipped as "The Wrong Name", a full reinvention (NOT Watson Manor).**
> A fair-play moral-twist "Correction" mystery (the apparent theft = righting an earlier injustice; the
> real culprit cheated first); new cast Mina & Theo / Lena / Ben / Dani / Max; same A1+/A2 + unit-gate
> discipline + "tasks ARE clues". Two deliberate departures from the rules above: (a) **generated
> ligne-claire raster art** (a 126-prompt library at `docs/art/`, wired via a decoupled `art.json`
> manifest with **procedural fallback**) is an approved owner exception to "all-procedural art" for G2;
> (b) the in-G2 surface re-labels XP as a **Clues / Evidence / Case** economy — a re-skin only, **no new
> XP pool** (Law 5 intact). The pedagogy upgrade (Input→Guided→Output ladder, comprehension, in-story
> spaced retrieval, the "Solve the Case" finale) is tracked in `~/.claude/plans/domigo-v2-velvet-squid.md`
> Part 6. **Paste-ready passover: `12_g2_passover.md`.**

### G3 — FOURTEEN: the interactive graphic novel
Panel-based visual novel (DOM + motion, SVG panel art). Four students run a YouTube channel; the
internet laughs at Ben's grammar without him knowing. **The moral engine is the design:** the student
corrects Ben's script (error-correction/transformation) BEFORE the comment section renders — your
accuracy decides how the internet treats your friend. Task order creates consequence. Source: the
complete 14-level production script, regenerated at the g3 gate. Lightest engine, richest text;
A2 reading-load limits (≤200 words/scene); German only in grammar scaffolds.

### G4 — Syntaxia: the full-blown branching game
The biggest scope. 2D overworld + genre-portal structure: grammar-structure mastery unlocks themed
worlds (past-tense pirate cove, conditional mirror maze, …) — the fantasy is literally a transcript
of the grammar curriculum. **Real story branches:** choice graphs with consequences; the VS-5
validator proves every path reaches an ending (no dead ends, ever). Party members with hint-economy
abilities (seeded from legacy `campaignCharacters`): abilities spend on scaffolds — reveal a letter,
sniff a preposition — never on answers. Boss battles per structure. Stretch: one Three.js low-poly
3D set-piece zone ("Fog Gate" expedition) within a 30fps cheap-phone budget. Minimal German.

## Anti-patterns (banned)

XP for grinding without retrieval (re-answering before due pays ~10% XP, no Ink — farming is
structurally unprofitable) · time pressure on new material · hearts/lives/energy gates · loot
boxes/random answer rewards (rewards are deterministic and celebrate competence) · fake choices
(every choice changes something real; choices are never graded) · public failure (class events show
anonymous-by-default contributions) · unglossed flavor text · streak cruelty (1-day flicker grace,
relight = one review session, nothing paid) · dead toggles.

## Architecture

- **Rendering:** Phaser 3 (~3.90) for 2D overworlds (g1, g4) — Tiled-JSON maps authored as code
  (generator scripts emit TMJ), automatic Canvas2D fallback; DOM + `motion` for g2/g3 (no engine);
  raw Three.js (no R3F) for the g4 3D set piece. Mounted via `next/dynamic` ssr:false on
  `app/(game)/play/[grade]` routes; engines live ONLY in their route chunks.
- **Bundle budgets (gzipped, size-limit CI gates):** story/novel routes ≤230 KB · overworld ≤600 KB
  · 3D ≤420 KB. Maps/atlases/audio streamed + runtime-cached (content-addressed, CacheFirst,
  dedicated SW bucket with quota care; precache = app shell only).
- **Cheap-phone perf contract:** 2D 60fps target/30 floor; 3D 30fps stable; dpr caps (2D min(dpr,2),
  3D min(dpr,1.5)); ≤50 draw calls 2D / ≤60 3D; no shadow maps; fog = draw-distance culling;
  zero-allocation render loops; adaptive quality ratchet (<28fps for 3s → preset down);
  pause-on-blur; `?perf=1` FPS HUD; Playwright perf gate in CI (4× CPU throttle, p5-fps floor) +
  physical cheap-Android gate per phase. WebGL unavailable → friendly du-form message + the story
  rendition of the content (no dead ends).
- **Procedural asset pipeline** (all-procedural by decision): deterministic build-time generators —
  canvas tileset painter + 4-direction walk-cycle sprite generator (palette/accessory compositing),
  SVG scene/portrait libraries per grade (consistent per-game style packs), texture-atlas packer
  (content-addressed `atlas-<sha8>.png`), WebAudio procedural SFX + chiptune sequencer (zero
  licensing). TTS dialogue audio rides the Blob plan (provider pick ~W4). Koki approves each
  grade's art style at the slice gate.
- **Data:** embedded game tasks reuse `practice_attempts` verbatim (same idempotent
  `POST /api/attempts`, `mode: 'game:g1'|…`, context jsonb) — P3 defines `mode` as a validated open
  string. New additive `game_saves` (userId, gradeGame, slot, schema_version, state jsonb ≤64 KB,
  client_rev last-write-wins). XP/stars/unlocks derive server-side from attempts; saves are
  cosmetic-trust + plausibility-validated.
- **Monorepo:** `packages/task-ui` (THE shared task renderer — one place for glosses/scaffolds/
  a11y), `packages/game-core` (pure TS: quest state machines, encounter rolls, save schemas +
  migrations, perf presets), `packages/game-2d` (Phaser scenes), `packages/game-3d` (later),
  `packages/art-gen` (procedural generators). Games never import each other; they meet at
  game-core/content-schema contracts (frozen in G0) → parallel build sessions without merge hell.

## Content contract (narrative through the SAME pipeline)

New schemas in `packages/content-schema`: **`story@1`** (chapters: scenes[] with
speaker/textEn/scaffoldDe/glosses[]/audio + `next`: linear-or-Choice[]; taskSlots REFERENCING items —
never copying; storyItems = narrative-locked items with the FULL item schema; `cast.json`;
`names.json` = per-story proper-noun level-gate escape, approved once like the core-allowlist),
plus `quest@1`, `map@1`, `encounter@1`.

Stages: `content story import` (deterministic legacy importers — m2-campaign.js → 15 draft
chapters; the G3 production-script parser) → `content story gen` (rewrite every line down to
in-bank-or-glossed at the chapter gate) → 4 narrative lenses (level/gloss · German+age-
appropriateness · story coherence · task-embedding quality) → deterministic validators
**VS-1..VS-10** (ids/lock conformance · level gate over EVERY student-facing line via tokenize.ts ·
du-form · taskRefs resolve ≤ gate unit · choice-graph reachability/no-dead-ends · speakers resolve ·
gloss correctness · meta-talk blacklist · asset refs exist · storyItems pass the full item
validators) → per-chapter review docs (the wordbank review machinery verbatim) → per-chapter
release gating in `release.json` (chapter N requires units ≤ N released).

**Items serve both worlds (stages 4–7 contract):** ONE item + presentation variants — a variant
changes ONLY carrier/framing text, never blank/answers/distractors/direction (validator-enforced);
`presentation.gameMeta` (distractor pools ≥4 in-bank, chip budgets ≤12, minOptions); `difficulty`
1–3 required (encounter scaling + path graduation); audio script fields reserved. Attempt history,
ids, and grading are IDENTICAL everywhere. Variants are minted on demand by story production.

**Spaced retrieval:** Leitner 5-box `review_queue` updated by EVERY graded attempt regardless of
context; one service `getDueRefs(userId, scope, limit)` powers Smart Review AND game encounters;
games degrade to in-scope random items before P6 lands.

## Sequencing + the September bar

Track C order: story tooling + Watson drafts → G0 contracts/skeleton → **g1 vertical slice
(~W6): one zone + battle loop + real graded tasks on a cheap Android — formal GO/NO-GO with Koki +
2–4 kid testers + art-style approval** → g1 zones u1–5 → g2 Watson ch1–5 → g3 novel ep1–5 → g4
first act + branch engine. Autumn: remaining chapters/episodes/acts weekly, the 3D set piece,
class events.

**September bar:** the learning-app floor (P0–P5 + Study Path + first ~5 audited units/grade +
bulletproof checklist) unchanged and never preempted + g1 overworld u1–5 + g2 ch1–5 + g3 ep1–5 +
g4 first act. Each game is standalone ⇒ independently descopable. Pre-agreed forfeit order on any
slip: g4 depth → g3 episodes → g2 chapters → g1 zones → (never) the floor or item quality.

## Legacy IP source map (read-only archive; import provenance via sha256)

- **Watson Manor (g2):** `…/Domi Gym/Claude/Cowork Space/Claude Code/2nd-grade-vocab-trainer/data/m2-campaign.js`
  (997 lines, newest copy 2026-05-01; older mirror in `…/Claude/Grammar trainer Grades 1 to 4/data/`).
  Prologue scenes, 15 evidence cards, 15 complete chapters, 67 embedded tasks, cast + German
  scaffolding patterns (`contextDe`/`hintDe`). Legacy art (~118 JPGs) under the trainer folders —
  reference only.
- **FOURTEEN (g3):** `…/Claude/Grammar trainer Grades 1 to 4/Campaign Mode Production Plan and story
  explorations/Grade3_Campaign_Production_Script.md` (3,861 lines — story bible, cast voice rules,
  scene-by-scene dialogue + tasks for all 14 levels).
- **Lost Pages (g1) + Syntaxia (g4):** premises/mechanics in the trainers' `index.html`
  (`campaignLevels` ~15919 / ~12820; `campaignCharacters` ~12934). Stories get re-invented; the
  fading-world metaphor and the party/portal mechanics carry.
- ⚠️ Legacy prose is NOT level-gated — every line must be rewritten-or-glossed through the pipeline.
