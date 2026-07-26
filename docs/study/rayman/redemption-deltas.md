# REDEMPTION DELTAS — what the fan remake changed, and what the Painted Book takes

**STUDY doc (CP-15 — source names appear as citations only; no asset from any studied
work exists in this repo). Written by Fable 5, 2026-07-26. Status: AWAITING KOKI'S WALK —
every disposition below is a recommendation until his verdict; adopted rows then land in
the surfaces named in §9, cited back here.**

**What this is.** Rayman Redemption (2020) is a fan designer's critique-by-rebuild of the
exact 1995 game our design canon studies: every change he made — regating, checkpoints,
economy, assists, redrawn animation — is a documented design decision about our own raw
material, tested on a real audience (the wiki's reception section records the outcome).
This table distills five companion studies into one decision surface. Companion docs (all
in this folder): [redemption-changelog-decisions.md](redemption-changelog-decisions.md)
(S1 — 121 release posts mined) · [redemption-systems.md](redemption-systems.md) (S2 —
the wiki systems map) · [redesigner-format.md](redesigner-format.md) (S4 — the level
editor's format + ontology) · [redemption-campaign-anatomy.md](redemption-campaign-anatomy.md)
(S5-R — 179 rooms, 20,424 placed instances, statistics + close-reads) ·
[redemption-animation-metadata.md](redemption-animation-metadata.md) (S5-A — 1,264
sprites' timing metadata). Citations here are two-tier: each row cites the companion doc
§, which carries the primary citation (wiki URL / changelog version / room+object name).

**Audience translation, stated once.** His players are nostalgic adults; ours are
6–7-year-old English beginners in a kindness fiction (enemies redeemed via language
tasks, never killed — doc 31 §1). Rows marked ALREADY-OURS are independent convergence:
the fan designer, working from the same original, arrived where our canon already stands
— that is evidence the canon is right, and it is recorded as such.

Dispositions: **ADOPT** (take as law/spec) · **ADAPT** (take the principle, change the
mechanism) · **ALREADY-OURS** (convergence — reaffirm, cite) · **REJECT** (with reason).

---

## §1 · Progression & ability gating

| # | Original → Redemption | Why he did it | Disposition for the Painted Book |
|---|---|---|---|
| 1 | Five powers drip-fed by fixed level → **everything at t=0**, gate moved into the world (helper objects freed per act) — S2 §1 | The original's gates strand players; verbs you own always work | **ADAPT.** Our per-chapter grant ceremony stays (the pedagogy IS the ceremony, doc 31 §4) — but we adopt his law's core: **once granted, a verb is never conditioned, disabled, or re-gated again.** |
| 2 | Future affordances invisible → **un-freed helpers render as transparent ghosts in their final position**; collected things ghost too; emptied cages turn golden — S2 §3.1 | Progress state legible in-world, no menus, no memory burden | **ADOPT — the transparency grammar** (solid = live · transparent = not-yet / already-done · golden = completed-and-paying): a VL 1.8 addendum. Our ch01 Alkoven-Tease already does the "visible, unreachable" half; this completes the grammar. |
| 3 | Ending required all 102 cages → **completion decoupled**; cages gate only bonus content — S2 §1, S5-R §5.3 | The collect-all-before-ending gate was the original's most-hated wall | **ADAPT.** Our finale gate (all 12 person-cages, doc 31 §5) is safe from his critique because every person-cage is a main-path story beat — finish the chapter, free the classmate. The law we take: **hidden or missable collectibles may gate BONUSES only, never the ending** — binding for ch02–05 sheets. |
| 4 | One difficulty → **per-save difficulty identity** (Classic / Casual / Demise), assists toggleable — S1 #1, S2 §3.2. Reception: "considerably easier and fairer"; complaints landed only on the opt-in hard tail — S2 §3.4 | One content build serves every player without re-authoring | **ADAPT (platform-later).** A per-child "help level" in teacher settings (assist toggles, not physics changes). Queue after the game lane stabilizes; not Build-D. |
| 5 | (Redemption removed a boss skip: "you gotta beat it fair and square" — S1 §9) | Fairness doctrine for adults | **REJECT — inverted for our audience.** Six-year-olds keep every skip and dismiss ("Später" stays a right, F-decomposition). Any tightening of a forgiving path is treated as a regression risk (his own 1.1.1→1.1.2 gap-widening reversal proves the class). |

## §2 · Checkpoints & the death economy

| # | Original → Redemption | Why | Disposition |
|---|---|---|---|
| 6 | Sparse checkpoints → 118 checkpoint objects, positioned at ~33 %/50 %/66 %, **before the spike**, bracketing the payload screen; retry median 4.0 screens — S5-R §4 | Death loses little; retries stay local | **ADOPT the positioning law** (checkpoint before the risk, and our worst dead-walk capped at ~4 screens). Our density (≤1/phase) stays — our phases are already the retry unit. His own worst seams (20.7 screens, no checkpoint) violate his own median and our anti-law 3 — the cap is the lesson. |
| 7 | The Photographer (a character) → a mute save **board** (character kept only on flight levels) — S5-R §4 | Cheap to place | **REJECT the board, ALREADY-OURS the character.** Krakel stays a drawn character at the easel (source-audit G9): density from the remake, staging from the original. |
| 8 | Manual save icons → **autosave on level exit**; free replay of everything, any order; story beats never locked away — S2 §3.3 | Progress can never be lost or missed | **ALREADY-OURS** (our progress model + replay). Note banked for the re-fog vision: his "replay pays" (golden ex-cages still yield 8 Tings) is the economic half of replay-as-review. |
| 9 | Button-mashing rides → **autofire** — S1 #2 | Motor speed must not gate progress | **ADOPT as law: a child's hand is never the bottleneck for showing what she knows.** Task input stays tap-first; no mash, no timed typing on the main path (F17 already caps typing at 1/43). |
| 10 | A single progress-blocking crash justified an emergency release — S1 #3 | A stuck player stops playing and never reports | **ALREADY-OURS** (the playability law: no level ships without its proof tape; softlocks = P0 class). Reaffirmed. |

## §3 · Economy & collectibles

| # | Original → Redemption | Why | Disposition |
|---|---|---|---|
| 11 | 100 Tings auto-convert to a life → **Tings are money** (three vendors; lives are pickups/purchases) — S2 §2 | A currency that resets can't fund anything | **ALREADY-OURS** (letters pay the Klecks door — a real, spendable economy). Convergence recorded. |
| 12 | Nothing marks what's missing → **locators sold as assists** (cage locator 1,500 Tings), ghost markers everywhere, all toggleable — S2 §3.3 | "What am I missing?" answered by the game | **ADAPT-LATER.** The transparency grammar (row 2) covers most of it in-world. A Klecks hint-helper for the last missing letters is a platform-later idea, not a chapter mechanic. |
| 13 | Scattered collectibles → **trails are sentences**: 517 ting clusters, median 5, only 17 % singletons, arcs draw the jump lines — S5-R §5.6 | Collectibles are the level's handwriting | **ALREADY-OURS, verbatim** (cookbook §2: runs of 5–8 that point at things). Independent quantitative confirmation of the exact dial. |
| 14 | Loose secrets → **exactly two named, countable secrets per level** (1 Magician token + 1 Gift, game-wide) — S5-R §5.7 | A player can hold two named goals; not "some hidden things" | **ADOPT for ch02–05:** per chapter one Klecks-token + one hidden Gift-analog, HUD-counted "1 von 1". Six-year-olds get named goals, never vague ones. |
| 15 | Secrets bait risk → **reveal-pockets always pay** (36 % of cages within 250 px of a reveal trigger vs 5 % control; last cage 64 px from the exit sign; pure payout rooms exist) — S5-R §5.10 | Curiosity must never be punished, reward sits after the risk | **ADOPT into the cookbook:** every peel-pocket contains something; a chapter's last cage sits beside the exit so no child loses it by walking forward. |

## §4 · Enemies, encounters, and the task-zone law

| # | Original → Redemption | Why | Disposition |
|---|---|---|---|
| 16 | Threats from screen 1 → **the first room is threat-free and holds ALL the teaching** (Jungle1_1: 0 enemies, 0 hazards, and all 3 tutorial signs in the entire game; 23 of 35 openings enemy-free) — S5-R §5.1 | Teach before testing | **ALREADY-OURS** (p1 dossier rows 1–3: the quiet wake-up, the trail-as-tutor) — now backed by campaign-wide data. Keep p1's zone A enemy-free forever. |
| 17 | Uniform pressure → **the educational level cuts platforming pressure to a third** (Brain Games: 0.7 enemies/screen vs 2.15 world average; a helper NPC parked beside the two hardest puzzle screens; reveal-pockets keep flowing) — S5-R §5.9 | Cognitive load budgets are real | **ADOPT AS LAW — the strongest transfer in the whole study.** We are MORE task-heavy than his math level: on any task-dense phase, encounters ≤0.5/screen, a helper (Fibel/Klecks) parked beside the hardest task, reward pockets keep paying so the phase stays a place, not a worksheet. Cookbook + every ch02–05 sheet. |
| 18 | Difficulty stacks → **the difficulty axis ROTATES per world** (enemies peak world 6, hazards worlds 4–5, verticality mid-game, length world 7 — never all at once) — S5-R §5.8 | One new pressure at a time stays learnable | **ADOPT for the chapter arc:** ch02 population → ch03 verticality → ch04 timing → ch05 length (mapped onto the frozen sheet riffs at amendment time). Tier dial stays population/placement/timers, never physics. |
| 19 | Kill-everything → two redeem-precedents: the **Chessmaster** is never attacked and surrenders after a *task* (checkmate); **Darktoon** is stripped, disowned by the villain, and joins the cast as a friend; Livingstones are dispelled by a grimace, not a hit — S2 §6 | Even a straight remake found non-violent resolutions compelling | **KEEP as external validation** of the redemption economy (ours pre-dates; his convergence is evidence, not source). The grimace = idea-mine for a future comfort/console verb. |
| 20 | — | Cast sizing: a world carries 7–14 creature types but a LEVEL medians **3** (74 % use ≤4); our 6 hostile roles/chapter = top-15 % density — S5-A §5 | **ALREADY-OURS, confirmed rich.** Do not grow the per-chapter roster; spend on states-per-creature instead (row 26). |

## §5 · Readability & accessibility

| # | Original → Redemption | Why | Disposition |
|---|---|---|---|
| 21 | Invisible triggers → sparkles on them (1,488 sparkle markers for 1,159 hazards) — S1 #4, S5-R anti-lesson | Findability | **ADAPT with his own anti-lesson:** every affordance signposted, yes — but marker inflation is what readability looks like when silhouettes fail. STYLE_PAINT_V1 silhouettes carry the load; if we ever need glitter on a spike, the art has failed. |
| 22 | Color-only signals → **ColorADD symbols + red glow on lethal hazards** — color never the only channel — S1 #8 | Color-blind players exist; so do learners | **ADOPT:** every task-critical distinction carries shape or symbol alongside color (card kit + VL). |
| 23 | Fixed audio → sensory off-switches that **persist** (the skid-sound toggle + its save-bug fix) — S1 #5 | Sensory comfort is accessibility | **ADAPT (platform-later):** settings with persistence-law (a preference that doesn't persist is worse than none). |
| 24 | Free destructive actions → **confirm-gates on restart/exit; defaults chosen to visibly work** — S1 #10 | Children mis-tap constantly | **ADOPT (small UX item, post-replay round):** restart/exit confirm in the game shell; every default = the value that visibly works. |
| 25 | 4:3 → 16:9 as a **level-design contract** (bosses keep bounded arenas so wide screens gain no advantage) — S1 #9 | Viewport is a difficulty dial | **ALREADY-OURS** (22×14 @ RS3 locked; the arena is bounded per G6). Convergence recorded. |

## §6 · Animation & feel (the numbers lane — S5-A §6, all ticks at 60 Hz)

| # | Finding | Disposition |
|---|---|---|
| 26 | Our 2-cell/12-tick idle flip = 5 fps — a rate the remake uses ONCE in 1,264 sprites. Cycle length (400 ms) is right; resolution is the gap. | **ADOPT: 4 cells × 6 ticks** (10 fps, same 400 ms feel) as the enemy idle standard; `bobFrame` takes a frame count. Art arrives via the next state-cell batch; engine change = post-replay tuning PR. |
| 27 | Small-enemy budget: median 5 state strips × ~16 frames. With our procedural rig discount: **~20–22 cells per creature** (idle 4–6 · walk 4 · turn 3 · telegraph 4 · act 3 · hurt 2). | **ADOPT as the commissioning spec** for future entity batches (incl. the ch02 AE build-alignment — AE's 4-cell states are the floor, this is the target). |
| 28 | Telegraph band: 30–48 t small enemies, 60–80 t guardian. Ours: guardian 60/45/32 ✓, gunner 30 ✓, crusher 28 ≈, **chaser 24 and flyer 20 sit BELOW the remake's shortest telegraph**. | **ADOPT: raise chaser + flyer telegraphs to 30 ticks** (entities.ts constants; post-replay tuning PR with red→green feel proof). |
| 29 | **The turn is a telegraph**: 19 creatures own a turn strip, median 42 t; we flip direction in 1 tick with an instant mirror. | **ADOPT: an 18-tick turn state** (2–3 cells) on every patrol reversal — for a child timing a jump against a patroller, the readable turn beats a longer attack telegraph. |
| 30 | Landing recovery: ours 6 t (100 ms) vs the remake's 30 t (500 ms) — 5× short. Also missing: skid-stop (20 t), air-to-fall (20 t). | **ADAPT: 12–18 t landing** (sell the squash, keep responsiveness), add the two cheap transition strips when hero art lands. |
| 31 | The remake's hero parts atlas: **150 cells at a frozen index, re-painted across 24 costumes** — external confirmation of our rig+cell-map architecture. Gameplay median 23.5 frames/move, but a rig interpolates: 4–8 KEY cells per modality suffice. | **ADOPT as the pose-program spec** (Lane 3, after Koki's AD2 style pick): ~150 cells total, frozen cell-index map BEFORE commissioning, every future skin a drop-in re-paint. |
| 32 | Half the hero budget is personality: 24 % idles (one 190-frame bored idle), 26 % win/cutscene; `sMoskito_cry` alone is 142 frames. | **ADOPT the cheap version:** one 6-cell bored idle after ~5 s of no input + the victory pose; and the **redeemed→consoled beat gets real cells** — our kindness fiction deserves more than an alpha change. |
| 33 | 100 % of the remake's sprites run in real seconds; deliberate rates are 60 fps (impact) / 30 fps (action) / 15 fps (idle). | **ADOPT: named constants `TPF = {impact:1, act:2, idle:4}`** in anim.ts; the magic 12 does not survive. Post-replay tuning PR. |

## §7 · Level structure (the anatomy lane)

| # | Finding | Disposition |
|---|---|---|
| 34 | The author's own rebuild of level 1 **stretches every part +25–75 % at identical height** — more runway between beats, not more beats. Campaign averages 7–12 travel screens/room — S5-R §1, §5.2 | **ADOPT: "stretch, don't densify"** into the cookbook — a thin phase gets runway before it gets encounters. License for ch02+ to breathe. |
| 35 | The rebuild cuts cages 6→4, empties the first room, and moves the fairy ceremony to a **terminal, replay-persistent beat** — S5-R §1 | **ALREADY-OURS in staging** (ceremonies close beats); the "replay-persistent story" half is banked with row 8's re-fog note. |
| 36 | ReDesigner's authoring ontology: 16 px cells, a 32-type painted collision palette, ordered ramp pairs, and the **Gen/Kill ID reveal system** (662 reveal triggers; 99 % paired with appear-blocks) — S4 | **KEEP as idea-mine.** Our door.trigger + peel-pockets already cover the mechanics; S4's format spec stays the reference if we ever build a level-authoring tool for teachers. |

---

## §8 · What the study could NOT see (honesty)

Both games are YYC-compiled (GameMaker code compiled into the exe) — **no GML source
exists in the data files**, so: enemy step-event LOGIC, physics constants, and shop
price tables were unrecoverable (three structural attempts, then stopped per
three-strikes; the miss is logged in each companion doc). Behavior claims therefore rest
on the wiki + changelogs, not code. Sprite TIMING, room LAYOUTS, and the object catalog
are hard data (they live in the data chunks). Nothing was executed; no image or audio
was extracted (CP-15). The five companion docs each carry their own coverage/honesty
section — including S1's declared deviation (the saved captures lacked changelog bodies;
the agent recovered all 121 posts via GameJolt's public read endpoints and audited its
counts, 0 mismatches).

## §9 · Where adopted rows land (after Koki's walk — nothing moves before it)

1. **Post-replay tuning PR** (engine feel, red→green proofs): rows 26, 28, 29, 30, 33 (+24's confirm-gates).
2. **Cookbook / visual-language addenda**: rows 2 (transparency grammar), 6 (checkpoint positioning + 4-screen cap), 15, 17 (the task-zone law), 18, 21, 34.
3. **ch02–05 design-sheet amendments** (at their build time, frozen sheets untouched until then): rows 3, 14, 17, 18.
4. **Pose program spec** (Lane 3, post-AD2-pick): rows 31, 32 — with row 27 as the entity-batch commissioning spec (incl. ch02 AE).
5. **Platform-later queue**: rows 4 (help-level mode), 12 (hint helper), 23 (persistent settings).
6. **No action, recorded as convergence**: rows 1, 8, 10, 11, 13, 16, 19, 20, 25, 35, 36; row 5 (regating skips) and row 7 (mute checkpoint) as REJECTED with reasons — the decision log that prevents re-litigation.
