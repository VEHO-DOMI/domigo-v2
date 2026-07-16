# 26 · THE GAME MASTER PLAN — one plan for the whole game lane

*Fable 5, 2026-07-16. Status: DOCUMENT (this file) — the S1 session's governing output.
**Supersedes** the scattered game threads: B-2 "stage 2" (BLUEPRINT_V2 IV.3), the K-4 queue note,
the LOOK-3 wave sketch (IV.3b), and doc 25 §7's modality scheduling. Those documents stay canon
for their SPECS (doc 22 = the Spill's design contract; doc 25 = the arcade bible); THIS file owns
sequencing, ownership and gates. Grounded in `docs/study/S1_GAME_VERDICT_2026-07-16.md` (every
surface played 2026-07-16). Operating model: prototype-first (Fable prototypes, Opus replicates
from frozen briefs, Codex generates images from its lab, Koki gates). No deadlines — items are
done when their exit criteria pass (Wave-2 law).*

**The strategic read (from the verdict):** the arcade already IS the vision; the overworlds have
the bar proven in 2 of 15 zones; the world's people and art don't exist anywhere. So the plan is:
fix the three small broken verbs/UX truths first (they poison every demo), take the Spill to a
releasable Act 1 by replication against the proven bar, complete the arcade's doctrine (K-4 + the
world seam), and run the art program as a parallel lane that de-furnitures the NPCs and skins the
proven engines. G1's retrofit is scheduled, not drifted. Everything student-visible passes through
release.json + a device pass, as ever.

---

## Repo anchors + glossary (so a fresh executor never guesses)

**Anchors** — the game lane lives in: `packages/game-2d/src/` (`OverworldScene.ts` world engine ·
`ArcadeScene.ts`/`arcade.ts`/`levels.ts` arcade · `BattleStage.tsx` battles · `PhaserGame.tsx`
mount + pause-on-blur hook · `zone-board.tsx` hubs) · `packages/art-gen/src/theme.ts` (THEMES +
theme test) · `content/corpus/stories/g2.st.the-spill/` (`map.json` zones+layouts · `story.json`
chapters — E-node order binds to chapter task order, doc 22 §2.1) · `apps/web/app/(game)/play/`
(routes) · `docs/art/` (manifests + prep/sync/slice scripts). Frozen briefs are filed as
`docs/handover/briefs/GM-<id>.md` when written; an Opus row is **NOT STARTABLE** until its brief
exists there.

**Glossary** — *T-9*: the delegated-build brief template (fable-method canon: what+why · context ·
study-first files · numbered build · hard constraints · self-check gates · honesty clause · no
git). *LOOK-0/3/4*: BLUEPRINT_V2 IV.3b art-lane items (LOOK-0 = cast-canon truth pass over the
prompt libraries; LOOK-3 = generation waves; LOOK-4 = DOM-game art). *S2*: the queued Codex
containment + pipeline-proof session (PLATFORM MASTER/SESSION-PROMPTS/S2). *WS-C*: BLUEPRINT_V2
IV.4 campaign authoring waves. *Doors*: W-1 layout-level doors (authored `layout.legend` doors in
map.json zones, e.g. z03's six) — they connect adjacent zones IN-WORLD and coexist with doc 22
§7's linear board unlock; doc 22's 11×15 skeleton law governs THEME zones, while W-1-style
authored layouts may be larger and carry doors. *Sealed*: W-1's ink-sealed door state for
not-yet-released chapters (renders as the ink blob in the frame; bump = copy line). *Release
train*: any PR that flips a release.json.

**Calibration canon, stated once:** doc 22 §4's four exemplar layouts (z01/z07/z12/z15) remain
the DESIGN exemplars — on any layout/palette dispute, doc 22 governs. GM-B1's z02+z03 pair
calibrates the stage-2 AUTHORING TEMPLATE (the process brief Opus replicates from), not a rival
design canon.

## Wave A · TRUTH & VERBS — small, load-bearing, first

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-A1 | **Arcade input-intent fix**: fresh-press edge flags so look-up is reachable (`ArcadeScene.ts:743/:866` contradiction) and look-down engages; add the missing camY assertions to the machine playtest | **Fable — its OWN small PR, first in this wave** (GM-C1 consumes the fixed input layer; it does not carry the fix) | measured live: lookDir ±1 after a 350ms idle hold, camera peek visible; §4.2 law tests stay green; tamper-test red | PLANNED |
| GM-A2 | **Pause honesty**: the existing `visibilitychange: hidden` halt (`PhaserGame.tsx` onVisibility → `setBlurred`) gains a DOM overlay line above the canvas („Pausiert — weiter geht's, wenn du zurück bist" — auto-resume on visible, no tap needed); the SAME hook + overlay is added to `ArcadeGame.tsx` (the arcade currently has none). One code path, both campaigns + arcade | Opus (frozen brief) | sim-tick counter proves the halt on hidden (arcade + overworld); screenshot of the overlay in a visible-but-unfocused window; auto-resume observed | PLANNED |
| GM-A3 | **NPCs become people (interim, engine-side)**: replace the accent2-furniture fallback with a procedural person-silhouette (per-NPC seeded palette) + a „…" talk indicator; doors get contextual prompts naming the destination („Zum Schulhof — antippen"). The two absorbed Codex patterns (verdict §4). Applies to G1 + G2 at once (one code path) | Opus builds; **Fable authors the silhouette spec + a static mockup first; Koki eyeballs the mockup** (taste gate, 2 min) | mockup OK'd → in-game screenshot per campaign; "sprich mit Finn" is findable by a stranger in <5s | PLANNED |
| GM-A4 | **Release-integrity guardrail**: validator — a story bundle's release.json may only release chapters whose zones carry a real render (no `render:null` reachable by students), and every door target inside released chapters resolves to a released-or-sealed zone | Opus | validator hard-fails on a fabricated bad release.json (tamper-check), green on current corpus | PLANNED |

Wave A has no Koki gates except the A3 mockup glance. It unblocks honest demos of everything else.

## Wave B · THE SPILL TO ACT 1 — replication against the proven bar

The bar = z07 Schulhof + the story-in-world corridor experience (verdict §2). Remaining work: the
10 zones with no layout (z02 z04 z05 z06 z08 z09 z10 z11 z13 z14) + the z03 Halloween re-theme
(the built corridor contradicts its own chapter's story — verdict §2 miss #2). Doc 22 §2–§4 is the
binding spec per zone (palette arc, leak/pale props, diegetic E-nodes, F-blocking).

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-B1 | **Calibration pair (the prototype)**: z02 Aula built to the full doc-22 bar + the z03 → `corridor-halloween` re-theme (orange/black, paper bat + plastic spider props as world objects, the drained pale wall). z02+z03 are what students hit second and third — release-order calibration | **Fable** | **Koki LOOK gate (~15 min): plays z01→z02→z03 on dev** — his verdict freezes the stage-2 template | PLANNED — the next Fable game PR |
| GM-B2 | **Stage-2 replication wave 1**: z04 Biosaal · z05 die Stadt · z06 Bibliothek — chapters 4–6, completing every zone Act 1 needs (ch 1–7). z05's "excursion" status is board PRESENTATION only (doc 22 §1) — no new engine. Inputs: the GM-B1 brief · doc 22 §2–§4 · `g2.st.the-spill/{map,story}.json` (E order = chapter task order) · `art-gen/src/theme.ts` | Opus, from the GM-B1 frozen brief (template + hard rules + the calibration pair as process exemplars; doc 22 §4 governs design disputes). **Start-dep: GM-A4 landed** | per-zone: theme test green (11×15 · 1P/4E/1F · declared glyphs) + VS-18 green (null renders remain legal for unbuilt zones until wave 3) + in-browser walk screenshot (every E node + the F reached); wave stats in the PR (zones drafted / validator rejects / fix rounds) | PLANNED |
| GM-B3 | **Stage-2 replication wave 2**: z08 Turnhalle · z09 Kantine · z10 Jonas Straße · z11 Abstellkammer (Act 2, the drain arc) | Opus | as GM-B2; palette-arc steps verified against doc 22 §2.5 (each zone one step greyer — screenshot strip) | PLANNED |
| GM-B4 | **Stage-2 replication wave 3**: z13 Schulhof (Regen, mid-zone re-color) · z14 Sportplatz (z12/z15 already exist as themes) | Opus | as GM-B2 + the z13 mid-zone palette flip seen live | PLANNED |
| GM-B5 | **Act-1 RELEASE of the Spill** (the first student-visible new game since G1): release.json `releasedChapters` 1–7; detective remains `game:g2:bonus` | Fable assembles; **Koki gates: plays the Act-1 spine + the standing cheap-Android device pass (B-2 exit criterion)** | GM-A2/A3/A4 landed · all ch-1–7 zones at bar · device pass done · Koki's go | PLANNED |

Release philosophy: Act-based. Act 2 (ch 8–11) and Act 3 (ch 12–15) release as their waves pass
the same gates — no all-15-or-nothing coupling.

## Wave C · THE ARCADE COMPLETES ITS DOCTRINE

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-C1 | **K-4 · the Punch-Out boss duel** (bible §5.4 verbatim: scripted telegraphs, dodge = read the tell, counter-window production tasks, hearts as attempt-stamina, windows shrink with SRS mastery, duel yields the fragment). Builds on GM-A1's fixed input layer | **Fable** (the second modality prototype) | machine playtest + **Koki plays one duel** (his 2 most telling minutes); 81+ tests + the §4.2 level-law suite stay green; the §5.4 anti-guessing law tamper-tested | PLANNED — next Fable arcade PR after GM-B1 |
| GM-C2 | **The world seam (modality ④)**: arcade levels enter from Spill zones as story set-pieces — z06 Bibliothek's quest-glow shelf IS Der Lesesaal's door („Seite 12 · Die Bibliothekarin" already names the library); completion returns to the zone and the fragment assembles on the world-map story panel; `/play/2/run` stops being URL-only. This deliberately AMENDS doc 22 §2.1's declared-glyph set (a new arcade-entry glyph; theme test + VS-18 updated in the same PR — start-dep: GM-B2 has built z06) | Fable prototypes the z06↔Lesesaal seam; Opus replicates for Der Tintenschacht + future levels | seam played E2E (zone → level → fragment → zone, save consistent); the fragment visible on the hub board | PLANNED |
| GM-C3 | **Creature waves 2–3 complete the §3 table** (wave 2: rows 2 Randläufer · 4 Lauerer · 10 Klecklein · 11 Panzerklecks · 7 Stampfer if unshipped; wave 3: rows 12 Spiegelklecks · 13 Deckenzunge) as pure data + think-functions per §8.1 | Opus (the actor-table pattern is proven; brief carries the §3 rows verbatim) | per-creature law tests + machine-playtest scenarios; one new verb per level max (§6) | PLANNED — after GM-C1 (same files) |
| GM-C4 | **Meta-economy surface**: points ladder + visible next-threshold HUD per the bible's doubling law (§4.3: „Bonus bei 20.000" → 40k → 80k; kid-scale start re-derived at build if playtests demand, documented as a §4.3 amendment), 100-letters → heart/Lernkarte exchange (§5.5) | Opus | HUD screenshot; exchange e2e on dev; 0-XP assignments law untouched | PLANNED |
| GM-C5 | **Arcade release**: student-visible ONLY through GM-C2 seams (never a bare route). Rides GM-B5 if C2 lands in time; else the next release train | Fable assembles the release; Koki gates | GM-B5's gate + one full arcade run on the physical device | PLANNED |

## Wave D · THE ART PROGRAM (parallel lane; sequencing with S2)

S2 (the Codex containment session) proves the pipeline: codex-CLI channel + **ONE image
end-to-end** (generate → `prep-art.mjs` QA → `sync-art.mjs` → in-game render vs the style key)
**before any volume** — then LOOK-3 wave 1 runs. The consolidated stem-exact worklist is
**`docs/art/ART_SHOPPING_LIST.md`** (S1 deliverable, S2's direct input). Generation order is law:
**the style key first, always**; batches follow the shopping list's order. Codex generates from
its lab off Fable-written briefs; Opus integrates; Koki taste-gates each batch against the key.

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-D0 | S2 pipeline proof (one image e2e) + LOOK-3 wave 1: `_style_key` + the g1-school tile stems (per shopping list §1; `player_*` stays ON HOLD per LOOK-0) | Fable (S2) + Codex (images) | the one-image proof screenshot; then per-batch: prep-art QA green + in-game render matches the key (Koki glance) | PLANNED (S2 queued) |
| GM-D1 | Spill per-zone drops: each stage-2 zone's stems generate as its zone lands (shopping list §2; `g2-the-spill-art-files.json` manifest created with GM-B1 — it does not exist yet) | Codex generates · Opus integrates | per-zone: pale-prop treatment consistent (the Blank's outline+20% signature); in-zone screenshot | PLANNED |
| GM-D2 | Arcade slots (shopping list §3): ink-tile families + creature sheets + page-fragment illustrations; AFTER GM-C1 so boss slots are known | Codex · Opus | per-batch as D0; creatures readable at 48px in motion | PLANNED |
| GM-D3a | **LOOK-0 · cast-canon truth pass** (BLUEPRINT IV.3b, now scheduled HERE): re-key `CHAR_SPECS` in `docs/art/G1_SCHOOL_IMAGE_PROMPTS.html` to canon (Finn = floating paper-and-ink book-guide, Pixel = book-cat, no invented "Domi" mascot); decide the player-sprite question deliberately (per-student procedural stays unless Koki reverses); this NOTE amends bible §9's player-sheet slot to ON-HOLD status | Fable authors; **Koki confirms the cast (5 min)** | the prompt library contains no canon-false character; the HOLD/no-HOLD decision recorded here | PLANNED — before any character generates |
| GM-D3 | Character sheets (Finn, Pixel, Berger, Emma, Tarik, Jona + Spill cast) — **after GM-D3a only** | Codex generates · Opus integrates | per-batch style-key match; GM-A3's silhouettes swap to real sprites zone by zone (screenshot per swap) | PLANNED |
| GM-D4 | DOM-game art (LOOK-4): wire the 8 existing `*_ref` portraits; grow the 126-stem detective manifest; G3/G4 ligne-claire waves | Opus (rides WS-C) | portraits render in-chapter, fallback intact | PLANNED |

## Wave E · G1 — the retrofit, scheduled

G1 is LIVE and its 15 zones are one template room re-wallpapered (verdict §1). The fix is a
**room-variety retrofit**: per-zone authored layouts (distinct geometry, bigger rooms + camera
where the theme wants it, hidden nodes where diegetic — zoo grass, pirate crates), NPC visibility
via GM-A3, art via LOOK-3. G1 keeps its hub-of-pages fiction — **no forced inter-zone doors**;
"Die verlorenen Seiten" are pages, not a contiguous building. This deliberately AMENDS the frozen
G1 theme snapshots (Koki sign-off in the GM-E1 gate).

| id | item | owner | gate | state |
|---|---|---|---|---|
| GM-E1 | G1 retrofit exemplar: ONE zone (z02 Im Zoo — the worst offender: a zoo with no animals) re-authored to a W-1-grade layout with themed props + hidden nodes | **Fable** | Koki LOOK (plays z02); save-compat regression (existing saves resume; cleared nodes honored) | PLANNED — after GM-B1 freezes the zone-authoring template |
| GM-E2 | G1 retrofit wave: the other 14 zones from the GM-E1 frozen brief | Opus (2 waves of 7) | per-zone theme/layout tests + resume-clamp test (BLUEPRINT B-1) green; wave stats | PLANNED |

## Absorbed Codex patterns (the comparison's yield — code never merged, ideas as specs)

1. **Visible NPCs with talk indicators** → GM-A3.
2. **Contextual, destination-naming action prompts** → GM-A3.
3. **Honest state chrome** (what does my progress mean right now) → GM-A2's pause line; the
   offline-outbox already covers attempts (A4 era) — no new work beyond copy.
The sandbox itself: archive-tagged and dismantled in S2 (operating model §3). The comparison is
closed — recommendation recorded in the verdict §4 ("Amend-and-close").

## The frozen-brief list (Opus lanes, in queue order)

Every brief in T-9 shape (what+why · context · study-first file list · numbered build · hard
constraints · self-check gates · honesty clause · no git). One PR at a time; Koki merges.

1. GM-A2 pause honesty (spec: one overlay div per engine + blur hook parity).
2. GM-A3 NPC silhouettes + door prompts (after Fable's mockup passes Koki).
3. GM-A4 release-integrity validator (with tamper case).
4. GM-B2/B3/B4 stage-2 zone waves (after GM-B1 freezes the template; briefs carry the
   calibration pair + doc 22 §2 rules + per-zone §3 rows verbatim).
5. GM-C3 creature waves (after GM-C1; §3 rows + §8.1 actor-table pattern).
6. GM-C4 meta-economy surface.
7. GM-E2 G1 retrofit waves (after GM-E1).
8. GM-D1/D2/D4 art integrations (per batch, after S2's pipeline proof).

## Explicit non-goals (this program, until re-decided)

- **Modality ③ corridor-burst** — DEFERRED until K-4 + the world seam + one art wave are live
  (three new systems before a fourth modality is scope creep; doc 25 §7 keeps the spec warm).
- Free-roam zone navigation (the linear spine + floor-plan presentation stay — doc 22 §7).
- Any G3/G4 engine or campaign change; any new campaign engine.
- A fightable Blank (the campaign's law: it is never fought).
- Per-zone music/audio (AU wave); touch-control redesign (the device pass informs, nothing more).
- Codex code merges (never — patterns only); Codex work outside its lab (S2 enforces).
- Deadlines. Items exit on their gates.

## Koki's gates in this plan, in order of appearance

1. GM-A3 silhouette mockup — a 2-minute look.
2. **GM-B1: play z01→z02→z03 (~15 min)** — freezes the stage-2 template; the single most
   leveraged gate in the plan.
3. **GM-C1: play one K-4 boss duel (~10 min).**
4. GM-B5: Act-1 release walk + the cheap-Android device pass.
5. Per art batch: style-key match glance (~1 min each).
6. GM-E1: play the retrofitted Im Zoo.

*Tri-surface: this file (repo canon) · mirrored to iCloud `PLATFORM MASTER/00_BLUEPRINTS/` ·
Mission Control `data/domigo.json` plan updated same-session. STATUS_AND_ROADMAP §3 now points
here for the game lane.*
