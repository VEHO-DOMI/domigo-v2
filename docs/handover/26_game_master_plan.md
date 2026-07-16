# 26 · THE GAME MASTER PLAN v3 — sequencing the Keen-shape build

*Fable 5, 2026-07-16 (v3 — supersedes v2 of the same day; Koki's pivot directive arrived after
#174 merged, and evidence-based pivots are the method). Status: DOCUMENT. **The design canon is
`docs/handover/27_the_book_and_the_school.md` (the game bible)** — this file only sequences it:
owners, gates, states. Doc 25 (arcade bible) stays binding for the level layer; docs 18/20 for
story; keen-metagame.md for the map grammar. No deadlines — items exit on their gates.*

**What changed from v2:** the FireRed top-down retires as a play surface (hub-map duty only);
platformer levels + per-chapter boss duels become THE game; Word-Battles retired (Koki).
v2 lanes GM-B (Spill room-authoring), GM-E (G1 room retrofit) and GM-A3 (room-NPC silhouettes)
are dead — none had started, nothing is wasted. GM-A1/A2 survive unchanged in W0; GM-A4's
validator moves to GM-V2d (its new spec needs post-slice objects). The S2 session (Codex
containment + art pipeline proof) is unaffected and remains next in the overall session queue.

## Repo anchors + glossary

Anchors: `packages/game-2d/src/` — `ArcadeScene.ts`/`arcade.ts`/`levels.ts` level layer ·
`OverworldScene.ts`/`PhaserGame.tsx` map layer · `zone-board.tsx` retiring hubs ·
`packages/art-gen/src/theme.ts` themes · `content/corpus/stories/g1.st.lost-pages/` +
`g2.st.the-spill/` story bundles + `content/corpus/units/` (task corpora — §3 table cells are
pointers into these) · `apps/web/app/(game)/play/` routes · `docs/art/` pipeline.
Frozen briefs: `docs/handover/briefs/GM-<id>.md`; an Opus row is NOT STARTABLE until its brief
exists. Glossary (self-contained, v2 retired): *T-9* = the delegated-build brief template
(fable-method canon: what+why · context · study-first files · numbered build · hard constraints
· self-check gates · honesty clause · no git) · *S2/S3* = the queued sessions (Codex lab
containment + art-pipeline proof / vocab prototypes) · *LOOK-0* = the cast-canon truth pass over
the art prompt libraries (players stay procedural; precedes any character generation) · *WS-C* =
BLUEPRINT_V2 IV.4 campaign authoring waves · *slice* = the W1 vertical-slice prototype ·
*guardian* = per-chapter boss identity (bible §3 table) · *Funken* = the hint-spark economy
(bible §5) · *inversion mode* = the no-damage duel variant (bible §2b).

## W0 · Truth & verbs (carried from v2, unchanged scope)

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-A1 | Arcade input-intent fix (look-up dead code `ArcadeScene.ts:743/:866`; look-down inert) — own small PR, first | **Fable** | lookDir ±1 measured live; §4.2 law tests green; tamper red | PLANNED |
| GM-A2 | Pause honesty — full spec inline: the existing `visibilitychange:"hidden"` halt (`PhaserGame.tsx` onVisibility → setBlurred) gains a DOM overlay line above the canvas („Pausiert — weiter geht's, wenn du zurück bist"; auto-resume on visible, no tap); the SAME hook + overlay added to `ArcadeGame.tsx` (currently none). One code path, every game surface | Opus (brief) | sim-tick-counter halt proof (both engines) + overlay screenshot in a visible-but-unfocused window + auto-resume observed | PLANNED |

*(v2's GM-A4 release-integrity validator moves to GM-V2d: its new spec — the bible §6.6
map↔level↔chapter bijection — checks objects that only exist after the slice.)*

## W1 · THE VERTICAL SLICE — the calibration exemplar (the next Fable game session)

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-V1 | **Chapter 01 end-to-end in the new shape** (bible §9.2): hub map mode with the **15-building map SKELETON** (macro-geography + act chokepoints, buildings as silhouettes — the slice owns the map layout) and one building fully built (ground + flag parabola + blocking terrain + Finn/Pixel visible + a Jona note) · level 01 themed (v2.1 header: modality/theme/chapter/collectibles) · **Der Stundenplan-Schlinger** duel (the boss engine's first instance) · beats staged by the beat renderer (ch01 scenes) · economy live (letters · Glühwörter → Funken pouch server-side · XP · HUD) · restoration beat (color flood + flag). ALL procedural art (visuals-last law). The slice's sanctioned design freedoms are listed in bible §9.2. Machine playtest + in-browser proof per the S1 method (real Chrome, harness-driven) | **Fable** | **Koki plays ch01 (~15 min)** — his verdict freezes the chapter template; full standing gate; save-shape v3 in; bundle ≤400KB; honesty section (device pass NOT yet required — dev-only) | PLANNED — the next GAME session (S2 stays next in the OVERALL queue; order between them is Koki's call, default S2 first) |

The slice deliberately builds first cuts of ALL five engine deltas (bible §6.1–.5) in one
chapter's scope — the risk (five systems at once) is bounded by chapter-01's smallness and is
the point: the template must prove the whole loop, or the waves replicate a broken shape.

## W2 · Engine completion (post-slice, frozen-brief Opus lanes unless noted)

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-V2a | Hub polish: optional/secret spots + Pixel-ride · map-NPC schedule per act · act chokepoints | Opus | map laws green; played spot-check | PLANNED |
| GM-V2b | Boss-engine generalization: script-table loader for all guardian identities + inversion mode (ch15/care-duels) + mastery-window tightening. The brief INCLUDES authoring the ch02 guardian script as its fixture (acknowledged content work inside an engine lane — it becomes W3a's first replica) | Opus (Fable reviews the inversion mode) | per-script law tests; the ch02 guardian played E2E | PLANNED |
| GM-V2c | Economy completion: unlockables registry + thresholds + catalog v1 (bible §5.4) · Funken spend-before-XP across task-ui (checkups exempt) · HUD final | Opus | e2e: collect → pouch → spend in /practice with 0 XP cost; checkup exemption tamper-tested | PLANNED |
| GM-V2d | Validators: VS-18v3 bijection + Glühwort-reachability law + release integrity (GM-A4 folds in) | Opus | tamper red/green | PLANNED |

## W3 · Year-1 content waves (chapters 02–15)

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-W3a | Act 1 wave: ch02–05 (buildings/grounds · levels · guardians per bible §3 tables · beats staged). **Level authoring follows `docs/study/keen/level-design-cookbook.md`** (study round 2, 2026-07-16: sizes/shapes, seal-loop grammar, density, secret conventions, per-chapter archetypes, the wave checklist) — the cookbook is the level-design half of every W3 brief. Ch01 resizes to cookbook §1 in this wave (the slice's known deviation) | Opus, from the frozen slice template + the cookbook | per-chapter: cookbook checklist + laws green + machine playtest + wave stats; **Koki act gate: plays one chapter per act** | PLANNED |
| GM-W3b | Act 2 wave: ch06–11 (incl. the Radierer + Rotstift + Flatterbuchstaben creature builds — doc 25 §3 grammar) | Opus | as W3a + new-creature law tests | PLANNED |
| GM-W3c | Act 3 wave: ch12–14 + **ch15 the rescue duel (Fable-authored — the inversion is the campaign's soul)** | Opus + Fable (ch15) | as W3a; ch15 additionally: hearts-cannot-lose tamper test | PLANNED |
| GM-W3d | **Year-1 RELEASE** (replaces the live G1 top-down; holiday rebuild — no migration machinery, Koki 2026-07-16): release.json act-staged or full, journeys deep-links re-targeted, old G1 surfaces removed | Fable assembles; **Koki: full playthrough + the physical-device pass** | standing release law | PLANNED |

## W4 · Year-2 (The Spill, same machine — doc 20 story · doc 22 geography · bible §4 mediation)

Sequenced AFTER the year-1 template is proven through at least Act 1 (GM-W3a).

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-W4a | Year-2 slice: the school hub map (three bands + palette arc) + chapter 01 in the missing-not-thrown inversion + ally-Jona hint wiring (Funken-integrated) | **Fable** | Koki plays it (~15 min); the year-2 template freezes | PLANNED |
| GM-W4b | Year-2 content waves per act (leak set-pieces acts 1–2 · care duels act 3; ch12/14/15 climaxes Fable-authored — the campaign's soul, like ch15 year 1) | Opus + Fable (climaxes) | as W3 (laws + machine playtest + act gates) | PLANNED |
| GM-W4c | Year-2 release | Fable assembles; **Koki: playthrough + device pass** | standing release law | PLANNED |

## W5 · The art program (S2's lane, re-cut)

`docs/art/ART_SHOPPING_LIST.md` v2 is the worklist. State: PLANNED (batches open per the list's
§5 order once S2 proves the pipeline). Sequencing law unchanged: style key first, one image
proven through prep→sync→in-game render before ANY volume. **New law from the pivot: no art
batch for a surface whose engine slot isn't built** — the slice freezes the year-1 slot list;
batches follow the build (hub grounds + buildings after GM-V1; guardians per act wave; beat
illustrations per act; year-2 after W4 starts). **GM-D3a** (= LOOK-0: the cast-canon truth pass
over the art prompt libraries — Fable authors, Koki confirms the cast, ~5 min) still precedes
any character sheet; player sprite stays procedural-unlockable (bible §5.4). Owner: Codex
generates (lab) · Opus integrates · Koki taste-gates per batch.

## Non-goals (standing)

Corridor-burst modality (still deferred) · G3/G4 changes · Word-Battle resurrection (retired,
Koki 2026-07-16) · fighting/defeating the Blank (never) · gameplay-relevant unlockables ·
deadlines · Codex code merges.

## Koki's gates, in order

1. **The bible read** (§9.1 — the pivot's design: guardians, economy, year-2 inversion). ~20 min.
2. **The vertical slice** (GM-V1): play chapter 01. ~15 min. Freezes everything downstream.
3. Act gates (one chapter per act, W3) · 4. Year-1 release playthrough + device pass ·
5. Art batch glances (1 min each) · 6. Year-2 act gates.

*Tri-surface: repo (this file + the bible) · iCloud PLATFORM MASTER/00_BLUEPRINTS mirrors · MC
plan/cards same-session. STATUS §3 game rows point here + the bible.*
