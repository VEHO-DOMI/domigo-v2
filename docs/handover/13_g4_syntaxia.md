# 13 — G4 "Syntaxia": design & build plan (the last grade game)

> **Status: PLANNED, not started (2026-06-30).** No G4 story/map/code exists. This doc is the full design + roadmap + the exact code seams, ready to build. **One decision is open:** which of the 3 narratives (§3) — Koki is reviewing them. The build resumes once he picks. Mirror of the working plan `~/.claude/plans/passover-g2-the-wrong-precious-forest.md`.

G4 "Syntaxia" is the **one unbuilt grade game** (G1 "Lost Pages" #72–78, G2 "The Wrong Name" #40–60, G3 "FOURTEEN" #61–71 all shipped). It is the design's "full-blown branching game" (`10_game_layer.md` §G4) — a Phaser overworld where each of the 13 grade-4 grammar structures is a themed portal-world, with real branching choices, a party/hint-economy, boss battles, and an optional 3D set-piece. Building it completes the game layer 4/4 and clears the September floor's "g4 first act".

---

## 1. Why this is low-risk despite the ambition (the 3-agent seam investigation)

Three parallel Explore agents mapped the exact seams. The headline: **most of what G4 needs already exists and is proven on the first three games.**

- **Branching is FREE.** `Scene.next` is `string | Choice[] | null` (`content-schema/src/index.ts`); the overworld `DialogueOverlay` (in `packages/game-2d/src/PhaserGame.tsx`) **and** `DetectiveGame` already render `Choice[]` as buttons → `go(c.next)`. **VS-5** proves every scene reaches an ending (forward + reverse BFS, no dead-ends); **VS-2** gates BOTH branches. G2 already authors 2- and 3-way converging branches (`g2.st.wrong-name/story.json`). No "branch engine" to build.
- **The overworld reuses as-is.** `OverworldScene.ts` (player, `E`-node encounters, `F`-NPC, cosmetic save), `DialogueOverlay`, `game-core/resolveEncounterTasks`, `game_saves` (opaque ≤64 KB JSON) — all grade-agnostic. G1 is the proof.
- **The authoring contract is proven.** Per-story files `story.json`/`cast.json`/`names.json`/`comprehension.json`/`release.json`/`variants.json`/`draft.json`/`map.json`; the `content story import` → gen → `validate-story` (VS-1…VS-12) → `content story variants` → release pipeline; the cumulative level gate (`buildAllowedMatcher("g4-uNN")`, loosest at G4 since the G1–G4 bank is largest).
- **The hint-economy has clean seams.** `task-ui` already has `HintRow`/`GlossRow`/`useRetryGrading` scaffolds + the `hideHint` prop; `/api/attempts` already carries `hintUsed` + a `context` JSONB. The G2 economy (Clues/Evidence) is purely a re-skin of XP **derived from `practice_attempts`** via `getSolvedGameItemIds` — no new pool, no engine change.

**The corpus is ready:** 13 G4 units · 933 grammar items · **13 advanced A2 structures** — past-continuous-revision, past-perfect, reported-speech(-statements/-questions), past-perfect-connectors, adverbs-of-manner + question-tags, present-simple-future + want-someone-to, tense review, modals-of-possibility, third-conditional, reflexive-pronouns, phrasal-verbs, word-formation. **The grammar is the fantasy.**

**Legacy seed:** `VEHO-DOMI/4th-grade-vocab-trainer` `index.html` (`campaignLevels` ~L12746, `campaignCharacters` ~L12860) carries a strong premise + party + world-shell (Professor Syntax, a portal, recover the grammar "Pages", companions **Penny the Pencil** / **Rex the Word-Hound** whose abilities are scaffolds, boss-per-world). ⚠️ Its content is placeholder grade-1-level and only 2 of 15 levels are authored — **re-invent through the pipeline, never port** (legacy prose isn't level-gated).

---

## 2. The genuinely NEW work (the G4-distinctive layer)

1. **Party / hint-economy** — the one new mechanic. **Companions unlock by clearing worlds → DERIVED from solved items** (permanent, uncheatable — the G2-Evidence pattern via `getSolvedGameItemIds`). **"Ink" (the spendable hint-currency) is COSMETIC** in `game_saves.state` — safe because it buys *scaffolds, not answers* (Law 2 stays intact; abusing it only yields more hints, never free progress). Abilities trigger **new `task-ui` scaffold reveals** (`reveal-letter`, `sniff-option` via `gameMeta.distractorPool`, `force-gloss`) through a new `onAbility` prop + log to `context` — **no `@domigo/engine` change**, no tier/XP penalty (Law 3: scaffold use never changes the grade).
2. **Boss battles** — a must-pass gauntlet of the world's structure items that "seals" the world (an `encounter@1 isBoss` flag or a sealed-node gauntlet).
3. **The Syntaxia surface** — a new `@domigo/game-syntaxia` package composing the shared overworld engine + the party/boss overlay, plus a `SyntaxiaClient` route + the grade-4 dispatch.
4. **The content** — 13 branching worlds, re-invented + leveled + validated.
5. **Enrichment** — comprehension `.ci.` + a hub board + an art pipeline (lift from G1/G3).
6. **Optional stretch** — the Three.js "Fog Gate" 3D set-piece (new `@domigo/game-3d`), forfeit-first.

---

## 3. Narrative options (PICK ONE — Koki is reviewing; the mechanics are identical for all three)

All three share the conceit (each of 13 grammar structures = a themed world; mastering it re-seals the world), the cast slots (guide + party of scaffold-companions + antagonist), and the mechanics (branching, bosses, hint-economy). They differ in **tone + throughline**. The embedded practice tasks (via variant carriers) always carry the story — the grammar sequence IS the plot sequence.

> The 13 structures, in order, form a latent emotional arc: past-perfect (buried history) → reported speech/questions (truth twisted to rumor) → connectors (piecing it together) → modals (uncertainty) → **third conditional (regret, the unchangeable "if only")** → reflexive (looking inward) → phrasal verbs (action) → **word-formation (creation)**.

### Option A — "Syntaxia: The Unmaking" — regret & redemption *(deepest; G3-FOURTEEN register)*
A student is pulled into Syntaxia as it comes apart; to save it they uncover a buried mistake, see past the rumors that twisted it, and face **Cael the Unmaker** — the Loremaster's lost apprentice, wronged by a rumor + an unanswered question, now trying to *erase* the past so the hurt never happened. **Theme:** the past can't be undone, only redeemed (erasure vs creation). **Twist (fair-play):** the "villain" was wronged — a rumor (W3) twisted a clumsy act (W6) into "betrayal"; by W10 you know it, so the **erase-vs-repair moral fork** is a real test. **Ending:** can't change it (third conditional) → face yourself (reflexive) → act (phrasal verbs) → **forge a new Syntaxia from the roots** (word-formation). Companions: Inkling (*Trace*: reveal a letter), Tace (*Sniff*: narrow options), Echo (*Recall*: the true word), Mara (*Glimpse*: possibility hint).

| W | Structure | Beat |
|---|---|---|
|1|past continuous|Portal mid-lesson; "while we slept, the words came loose." Meet Inkling. *(tutorial)*|
|2|past perfect|Syntaxia *had* a golden age + a keeper who *had* a partner. First hint.|
|3|reported speech|Rumors: "They said Cael betrayed the Loremaster." Echo joins; truth ≠ hearsay.|
|4|reported questions|The questions no one answered. **FORK: how you ask** → which truth.|
|5|pp-connectors|Sequence the night it broke; W4 branches converge into the chronology. *(first-act close)*|
|6|adverbs + tags|"His fault, wasn't it?" — done *clumsily, not cruelly*.|
|7|present-future + want-sb-to|Unravels "at dawn." **FORK: Loremaster's plan vs Cael's plea.**|
|8|tense review|Mini-boss. **TURN: the Unmaker is Cael.**|
|9|modals|Cael *might* be saved… *may* be too late. Mara joins.|
|**10**|**third conditional**|**CORE.** Cael lost in "if I had stayed…", erasing the past. **MORAL FORK: help erase, or refuse & repair.**|
|11|reflexive|"You have to forgive *yourself*." Cael turns.|
|12|phrasal verbs|Not undoing — *doing*: make up, look after, never give up.|
|**13**|**word-formation**|**FINALE.** Forge a *new* Syntaxia from the roots: from *regret*, *renewal*.|

### Option B — "Syntaxia: The Last Word" — heroic adventure *(lightest; G1 spirit, scaled up)*
A creeping silence — **the Hush** — is swallowing words and muting world after world. As Word-Bearer you relight the 13 worlds and forge the **Last Word** to drive it back. **Theme:** words have power; speaking up relights the world. Wonder, courage, humour. **Comic antagonist:** the Mumble, a lonely word-hoarding gremlin feeding the Hush by accident — befriend him. **Twist (gentle):** the Hush is the world's own silence, banished by speaking up, not violence. **Forks** are playful (riddle-paths, platforms, which companion leads). Worlds: Waking Classroom · Hall of Echoes · Whispering Bazaar · Riddle Gate · Chrono Bridge · Carnival of Manner · Clockwork Station · Hourglass Hall · Fog of Maybe · Maze of If · Hall of Mirrors · Workshop of Doing · Forge of the Last Word. Easiest to write; least branching weight.

### Option C — "Syntaxia: The Wrong Word" — mystery / whodunit *(G2 detective register)*
The **Keystone Word** that held Syntaxia together was *unspoken* — on purpose. As the realm's Investigator you follow clues through 13 worlds, weigh witnesses, and uncover who unspoke the world, and why. **Theme:** every word leaves a trace. **Cast:** a suspect roster (an ambitious archivist, a slighted rival, a grieving apprentice, the Loremaster himself) + companions as informants; **tasks = evidence** (the G2 model). **Twist (fair-play):** the obvious culprit is innocent; the real one unspoke the Keystone to *undo an earlier injustice* (a word stolen first) — echoing G2's "The Wrong Name." **Forks = deductions** — who you press (W4), whose alibi (W7), **your accusation (W10 — a 3-way "It was ___" fork like G2 ch11)**. Reuses the proven deduction-fork tech most directly. Worlds: Scene of the Silence · Cold Archive · Hall of Hearsay · Interrogation Gate · Timeline Bridge · Masked Ball · The Appointment · Crossroads of Time · Cloud of Doubt · Hall of Alibis · Room of Reflection · The Reckoning · The True Word.

**At a glance:** A = emotional drama (deepest, most ambitious); B = light heroic romp (fastest to write, most fun); C = detective mystery (reuses G2's deduction pattern most directly). All three equally buildable on the same mechanics.

---

## 4. Architecture & reuse
- **New `@domigo/game-syntaxia`** composes the shared overworld engine (`game-2d` `OverworldScene` + `DialogueOverlay`, exposed via a small G0 export refactor so **G1 stays byte-identical**) + `task-ui`. Owns the party/hint-economy + boss overlay + the `SyntaxiaSave` type. Mirrors the per-game package pattern (`game-detective`/`game-novel`); never imports another game.
- **Route:** add `4: "g4.st.syntaxia"` to `STORY_BY_GRADE` and `4: "syntaxia"` to `GAME_TYPE` in `apps/web/app/(game)/play/[grade]/[zone]/page.tsx`; new `SyntaxiaClient.tsx` (mirror `GameClient`).
- **State split:** companions = **derived** (`getSolvedGameItemIds`); Ink charges = **cosmetic** (`SyntaxiaSave` in `game_saves`, replenished on world-clear). `mode:"game:g4"` (already supported).
- **Theming:** `art-gen/theme.ts` gets 13 world themes (proven G1 pattern — palette + layout + props per zone).
- **3D (deferred):** new `@domigo/game-3d` (raw Three.js), one set-piece; the game ships complete without it.

## 5. The phased PR roadmap (~12 PRs; each off `main`, Koki merges)
- **Phase A (G0):** `@domigo/game-syntaxia` + grade-4 dispatch + `SyntaxiaClient` + `map.json` (13 worlds) + `cast.json`/`names.json` + `draft.json` premise scaffold; renders world 1 via the shared engine (no party/boss yet). Small `game-2d` export refactor (G1 unaffected).
- **Phase B (vertical slice → GO/NO-GO):** B1 world-1 branching chapter (validate-story green) · B2 party/hint-economy (`SyntaxiaSave` + party overlay + the `onAbility` scaffold hooks + first 2 companions) · B3 boss battles. → GO/NO-GO with Koki (kid testers on a real cheap Android + art sign-off).
- **Phase C (content waves):** worlds 2–13 branching chapters + tasks, ~3 worlds/PR, re-invented + leveled + validated. (September floor ≈ worlds 1–5.)
- **Phase D (enrichment):** D1 comprehension `.ci.` · D2 the Syntaxia hub board (worlds-sealed map + companion roster; derived; Phaser-free subpath) · D3 art pipeline (13 themes + `build-g4-prompts.mjs` + `art.json`).
- **Phase E (optional stretch, forfeit-first):** the Three.js "Fog Gate" 3D set-piece (`@domigo/game-3d`, 30fps budget, WebGL-absent fallback). Complete + shippable without it.

## 6. Critical files
- **New package:** `packages/game-syntaxia/src/{index.ts, SyntaxiaGame.tsx, party.ts, boss.ts, save.ts}`.
- **Engine (small refactor):** `packages/game-2d/src/{index.ts, OverworldScene.ts, PhaserGame.tsx}` — export the scene + a configurable surface; G1 usage unchanged.
- **Scaffold hooks:** `packages/task-ui/src/index.tsx` — a new `onAbility` prop + `reveal-letter`/`sniff-option`/`force-gloss`.
- **Encounter/save:** `packages/game-core/src/encounter.ts` (`isBoss`), `packages/content-schema/src/index.ts` (`encounter@1 isBoss`).
- **Derived economy:** `packages/db/src/game-progress.ts` `getSolvedGameItemIds` (confirm grade-4 path).
- **Route:** `apps/web/app/(game)/play/[grade]/[zone]/page.tsx` + `apps/web/app/(game)/play/[grade]/SyntaxiaClient.tsx` (new).
- **Content:** `content/corpus/stories/g4.st.syntaxia/{story,cast,names,comprehension,release,variants,draft,map}.json`.
- **Theming/art:** `packages/art-gen/src/theme.ts` (13 themes) + `docs/art/build-g4-prompts.mjs` + `content/corpus/stories/g4.st.syntaxia/art.json`.

## 7. Verification (per PR) & gotchas
- **Gate:** `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm content validate-story && pnpm build && pnpm check:bundle` (overworld ≤600 KB; 3D ≤420 KB).
- **⚠️ The G1-overworld verification limit applies:** Phaser ignores synthetic/untrusted keyboard events, so the in-canvas dialogue/tasks/boss **can't be driven headless**. Rely on `validate-story` + data-path resolution checks (every taskSlot/`.ci.`/variant resolves to a renderable item) + the **DOM surfaces that ARE screenshottable** (the party overlay + Ink meter, the hub board). The GO/NO-GO slice needs a real device + kid testers (Koki).
- **Gotchas:** re-invent don't port (legacy is placeholder) · both branches gate (VS-2) + converge dead-end-free (VS-5) · **charges COSMETIC / companions DERIVED** (Ink buys scaffolds not answers) · never touch `@domigo/engine` · the `game-2d` export refactor must keep G1 byte-identical (determinism + save-compat frozen) · the 3D is forfeit-first · always branch fresh off `main` (squash-merge stranding).
