# S5-rooms — comparative level anatomy of a fan remake, from extracted room data

Date: 2026-07-26 · Study lane S5-rooms · Draft study doc for the Painted Book design canon
Subject: **Rayman Redemption** (fan remake, author "Ryemanni"), whole campaign as machine-readable
room walks — compared against our clean-room study of the 1995 original.

> **Study-only, text-only.** This document names the source game and its objects because that is
> the only way to make the data checkable. Nothing named, drawn, or laid out here transfers into
> `@domigo/game-paint`: every transfer note is written in OUR vocabulary (chapter, phase, guardian,
> cage, letters, Klecks-door, favor). No layout is traced; no asset is copied. (CP-15.)

---

## 0 · Sources, method, and what the data cannot tell us

### 0.1 Inputs

| What | Path |
|---|---|
| Room walks (179 rooms, 41,669 lines) | `/Users/veho/Code/rayman-study/decode/redemption-dump/rooms.txt` |
| Object table (521 objects: index/name/sprite/parent) | `/Users/veho/Code/rayman-study/decode/redemption-dump/objects.tsv` |
| Asset-name dump (tilesets, music, sprites) | `.../redemption-dump/strings.txt` |
| Our canon — original per-level anatomy + laws | `/Users/veho/Code/domigo-v2/docs/study/rayman/level-anatomy.md` |
| Our canon — composition commandments | `/Users/veho/Code/domigo-v2/docs/study/rayman/level-cookbook-v2.md` |
| Our canon — decompiled-engine gold mechanics | `/Users/veho/Code/domigo-v2/docs/study/rayman/source-audit-r3.md` |
| Original-game facts (RayWiki, archived) | `/Users/veho/Code/rayman-study/wiki/*/_*.html` |
| Original engine source (for object semantics) | `/Users/veho/Code/rayman-study/src/rayverse/src/*.c,*.h` |
| Remake's own documentation (fan wiki text) | `/Users/veho/Code/rayman-study/decode/rayfanpedia.txt` |
| The same author's editor game, bundled recreation of the original level 1 | `/Users/veho/Code/rayman-study/decode/level-stats.txt` (`Pink_Plant_Woods.txt` entry) |

### 0.2 Method

- **Script:** `/Users/veho/Code/rayman-study/decode/redemption_stats.py` (written for this study).
  Modes: default (world + level tables + coverage), `--rooms`, `--ckpt`, `--watch`, `--roster`,
  `--detail ROOM`, `--flow ROOM`, `--tings ROOM`. Full archived output:
  `/Users/veho/Code/rayman-study/decode/redemption-stats.txt` (422 lines) — every table below is
  reproducible from it.
- **Dedupe (important).** Every instance line appears **exactly twice** in `rooms.txt` — once with
  layer `-`, once with its real layer name. Verified: for all 179 rooms the two counts are equal
  (20,424 / 20,424; `oCage` 153 / 153). The script keeps the layer-`-` copies. **True placed-instance
  count: 20,424.**
- **Classification** is by GameMaker parent chain plus explicit rosters: an object counts as an
  *enemy* if `oEnemy` is in its parent chain (`objects.tsv`: 39 such objects, e.g. `oAntitoonWalk`,
  `oHunter`, `oToybot`); *moving platform* if `oMovingParent` is in the chain (28 objects); bosses, static
  hazards, creature-spawners, collectibles, checkpoints, cages, signs, scenery and system objects
  are named rosters. **Coverage check passes with zero unclassified placed objects** — the class
  totals below account for all 20,424 instances.
- **Screen unit = 480 × 270 px.** Inferred, not documented: the smallest arena and ceremony rooms
  are exactly that size (`rooms.txt ROOM BossLobby 480x270`, `ROOM Jungle1_4 480x270`), and boss
  arenas are 480 px wide with varying height (`ROOM BossSpider 480x640`). Pacing figures below use
  the **travel axis** (long side of the room) in 480 px units — "screen-widths" — because
  area-normalised density flatters tall rooms.
- **Hazard sparkles are counted separately.** `oSpikeSparkle1/2` (1,488 instances) are read as
  hazard *markers*, not hazards; folding them into hazard counts inflated Blue Mountains from
  171 to 804. This is itself a finding (see §2.3).

### 0.3 Four things this data cannot tell us

1. **Reachability.** The dump contains instances only; the tile collision layers (`layer Collision
   Tiles` headers exist in `rooms.txt` but carry no cell data) are not included. So "can a 6-year-old
   reach this cage on the first pass" is never *proven* here — it is argued from gating changes and
   from object adjacency.
2. **Entry side of vertical rooms.** For rooms taller than wide the start could be top or bottom;
   §1/§4 flag where this matters.
3. **Code-spawned content.** Some objects are certainly created at runtime (e.g. `oMasterKey` exists
   in `objects.tsv` with **zero** placements — the remake's own wiki says the Chessmaster hands it
   over in a cutscene, `rayfanpedia.txt:266`). Static counts are therefore lower bounds.
4. **The original's exact geometry.** We hold no room dimensions for the 1995 game. §1 uses the
   author's *own* recreation of the original level 1 inside his editor game as a proxy, clearly
   labelled as such.

---

## 1 · Pink Plant Woods: the original vs the remake (`Jungle1`)

### 1.1 The baseline — what the original level is

- **4 parts on first play, 3 on replay**, because part 3 was the fairy's fist-grant ceremony
  (`wiki/dream-forest/_Pink_Plant_Woods.html`).
- **Part 2 shows cages you cannot open**: "Rayman will have to ignore all of the cages in this
  phase… Once he is granted powers… he will be able to reach them… when revisiting the level"
  (same page). **Part 4**: "Rayman can now use his telescopic fist to break the three cages of this
  level open" (same page).
- **Six cages per level** is the game-wide rule: "Each of these worlds excluding Candy Château
  contains three or four levels, each with six cages with Electoons to find" and the final level is
  gated on all 102 (`wiki/overview/_Rayman_1.html`).
- **Checkpoint = a character.** "The Photographer: This character acts as checkpoint… Should Rayman
  lose a life, he will return to where he last had his photograph taken"
  (`wiki/overview/_Rayman_1.html`); engine side, `TYPE_21_PHOTOGRAPHE` banks respawn x/y plus object
  flags (`source-audit-r3.md` G9).
- **Our canon's reading:** part 1 = walk/jump only, over-signposted; rhythm "teach → tease → grant →
  test"; hunters stand ON the path at hero height, one per ledge; no aerial enemies in level 1;
  cages shown before they are reachable, and "bonus levels hang off parts 2 and 4"
  (`level-anatomy.md` PART B §1, PART E laws 1–2 and 5).
- **Part dimensions (proxy).** The same author rebuilt this level faithfully inside his own editor
  game; its bundled file reports sections **1280×448 / 3200×512 / 3520×448** plus two bonus sections
  (640×480, 480×1600) — `decode/level-stats.txt`, entry `=== Pink_Plant_Woods.txt ===`, description
  "The first level of the original Rayman game recreated within ReDesigner".

### 1.2 The remake in numbers

Rooms (`rooms.txt`): `Jungle1_1 2208x448`, `Jungle1_2 4000x512`, `Jungle1_3 4512x448`,
`Jungle1_4 480x270`.

| Measure | Original (canon + wiki + author's recreation) | Redemption `Jungle1` | Δ |
|---|---|---|---|
| Parts / rooms | 4 (part 3 = ceremony, deleted on replay) | 4 rooms: 3 playable + `Jungle1_4` ceremony **at the end** | ceremony moved, never deleted |
| Playable width | 1280 + 3200 + 3520 = 8,000 px ≈ 16.7 screens | 2208 + 4000 + 4512 = 10,720 px ≈ **22.3 screens** | **+34 %** |
| Vertical envelope | 448 / 512 / 448 | 448 / 512 / 448 | **identical** |
| Cages | 6 (3 teased in part 2, 3 breakable in part 4) | **4** — `Jungle1_2` at x=1488 (37 %), 2928 (73 %), 3624 (90 %); `Jungle1_3` at x=4416 (97 %) | −2, and re-spread |
| Ability gate on cages | yes — fist needed, granted mid-level | **none** — "Rayman starting with all of his abilities unlocked" (`rayfanpedia.txt:98`) | gate deleted |
| Checkpoints | photographer, sparse | **2** `oSavepoint`: `Jungle1_2` x=2832 (71 %), `Jungle1_3` x=2944 (65 %) | one per playable room after the first |
| Enemies | hunters (Livingstones) only; no flyers | **17** in 5 species + 2 spawner species (below) | roster widened, count still low |
| Tings | not documented | **69** (66 `oTing_normal` + 3 `oTing_rainbow`) in **15 clusters**, median cluster 4 | trails, not confetti |
| Consumables | occasional 1-up | **16 pickups**: 3 `oPowerfist`, 2 `oGoldfist`, 6 `oOneup`, 4 `oBigpower`/`oMediumpower`, 1 `oGift` | new economy layer |
| Bonus access | 2 bonus levels hanging off parts 2 and 4 | **1 `oMagicianToken`** collectible (`Jungle1_2` x=1008, 25 %) + **1 hidden `oGift`** (`Jungle1_3`, last screen) | bonus rooms became world-level map nodes; per-level secrets became two named collectibles |
| Tutorial signage | signboards in part 1 | **3 `oSignTutorial`** at x=360, 1279, 1551 of `Jungle1_1` — **the only 3 in the entire game** | teaching front-loaded once, ever |
| First-screen safety | hunters appear on the path early | `Jungle1_1` contains **zero enemies and zero hazards** across all 4.6 screens; game-wide, **23 of 35 level-opening rooms have no enemy in their first screen-width, 18 have neither enemy nor hazard** | absolute safe onboarding |

Enemy roster of `Jungle1` (`--detail`): `Jungle1_2` = `oAntitoonChomp`×4, `oLivingStoneSmall`×2,
`oHunter`×2, `oAntitoonWalk`×1, `oLivingStoneBig`×1 (+ `oPiranhaSender`×2, `oPlumGenerator`×1);
`Jungle1_3` = `oLivingStoneSmall`×4, `oHunter`×2, `oLivingStoneBig`×1 (+ `oPlumGenerator`×6,
`oPiranhaSender`×2). Linear density: **17 enemies over 8,512 px of enemy-bearing rooms = 1 per 501 px
≈ 0.96 per screen-width.**

### 1.3 Screen-by-screen (from `--flow`, 480 px buckets)

**`Jungle1_1` (4.6 screens) — the pure teaching room**

| scr | contents |
|---|---|
| 0 | 4 tings, `oBigpower`, `oOneup`, tutorial sign #1, 1 vine |
| 1 | 4 tings, 3 vines |
| 2 | 3 tings, `oOneup`, tutorial sign #2 |
| 3 | 2 `oGendoor` (hidden-block reveal), tutorial sign #3 |
| 4 | 1 `oTing_rainbow`, exit sign (x=2144, 97 %) |

No enemy, no hazard, no cage, no checkpoint. Three signs at 16 %, 57 %, 70 %. Two one-ups and a
health orb given away before the first threat exists.

**`Jungle1_2` (8.3 screens) — the tease-and-test room**

| scr | enemies | other |
|---|---|---|
| 0–1 | — | 3 tings, 2 gendoors, 4 vines |
| 2 | 1 `oLivingStoneSmall` | 4 tings, `oMediumpower`, **`oMagicianToken`**, 2 gendoors |
| 3 | 2 (`oAntitoonChomp`, `oLivingStoneSmall`) | 4 tings, **cage #1** (80 px from a gendoor → inside a reveal pocket), 1 gendoor |
| 4 | **4** (`oAntitoonChomp`, `oAntitoonWalk`, `oHunter`) | 10 tings, `oBigpower` |
| 5 | 1 | 8 tings, **checkpoint**, 2 `oMovingLily`, 1 gendoor |
| 6 | 1 `oLivingStoneBig` | **cage #2**, `oPiranhaSender`, 1 `oMovingLily` |
| 7 | — | 6 tings, **cage #3**, `oPiranhaSender`, `oPlumGenerator`, exit sign |
| 8 | 1 `oHunter` | 2 vines (post-exit tail) |

The composition rule is legible: **encounter peak (scr 4) → checkpoint (scr 5) → water/piranha
crossing on moving lilies with the two remaining cages (scr 6–7).** The checkpoint sits immediately
*before* the risk spike, not after it.

**`Jungle1_3` (9.4 screens) — the tool room**

Tings 22 in 5 clusters (2, 10, 1, 1, 8). Six `oPlumGenerator` (the ridable/throwable fruit) spread
across scr 0, 1, 5, 6, 8, 9 — one mechanic rehearsed six times. Nine gendoors — the densest
hidden-content room in the level. `oPowerfist`×3 and `oGoldfist`×2 in the first three screens.
Checkpoint at 65 %. The **single cage sits at x=4416, 64 px before the exit sign at x=4480** — the
last thing you can do before leaving.

**`Jungle1_4`** — 480×270, one object of consequence: `oCS_Betilla` at x=336. The fairy ceremony is
now a *terminal story beat*, not a mid-level gate. `oCS_Betilla` appears exactly **twice in the whole
game**: here, and in `ROOM BetillaShop` (see §2.6).

### 1.4 Divergences and the plausible why

| # | What he changed | Evidence | Plausible why |
|---|---|---|---|
| D1 | Stretched every part ~25–75 % while keeping the exact height | 1280→2208, 3200→4000, 3520→4512; heights identical | **Pacing, not difficulty.** More room between beats at the same vertical grammar; a 16:9 camera needs more horizontal runway per idea. |
| D2 | First room emptied of all threat | `Jungle1_1`: 0 enemies, 0 hazards, 3 tutorial signs, 12 tings | **Onboarding.** Nothing can punish you while the verbs are being taught. Directly matches our anti-law 2 ("first encounter survivable at walking pace"). |
| D3 | Every teaching sign in the game lives in this one room | 3 of 3 `oSignTutorial` | **Teach once, then trust the level.** After screen 5 of the game, all teaching is environmental. |
| D4 | Cage count cut 6 → 4, and spread across two rooms with the last beside the exit | positions 37/73/90/97 % | **De-grinding.** Fewer, better-placed cages; nothing missable by walking forward. |
| D5 | Ability gate on cages removed | `rayfanpedia.txt:98`, `:324` | **First-pass completeness.** The original's signature "come back later" loop is optional now, not structural. |
| D6 | Checkpoints added inside parts (2 in the level), placed before the water crossing | x=2832 (71 %), x=2944 (65 %) | **Retry cost.** The original's photographer was placed sparsely and version-dependently (`wiki/picture-city/_Space_Mama's_Crater.html` documents ports moving "the last checkpoint"). |
| D7 | Enemy roster widened (Antitoon family + piranha/plum spawners) while density stayed ~1 per screen-width | roster above | **Texture, not pressure.** Variety early, pressure later (§2.3). |
| D8 | Two bonus levels replaced by one token + one hidden gift | 1 `oMagicianToken`, 1 `oGift` per level, game-wide (36 and 30 instances, 1 per level) | **Legible completion.** Two named, countable secrets per level beats an unnamed count of hidden doors. |
| D9 | Ceremony moved to the end and made permanent | `Jungle1_4`; "all boss segments, dialogs and story events are always accessible in replays" (`rayfanpedia.txt:336`) | **No deleted content on replay** — the original removed part 3 and boss parts on revisit. |

### 1.5 "Are all six cages in reachable-first-pass spots?"

**There are four, not six** (`rooms.txt ROOM Jungle1_2`, `ROOM Jungle1_3`). Of those four:
one sits inside a reveal pocket (80 px from `oGendoor`), one 304 px from the nearest gendoor, two in
open ground (1000 px / 256 px). The instance data cannot prove reachability (§0.3), **but the two
mechanisms that made original cages unreachable are both gone**: the ability gate
(`rayfanpedia.txt:98`) and the vanishing parts (`:336`). The remaining question — whether all four
are reachable without the later movement toys — needs a play-check (§6).

Note also the game-wide arithmetic: the remake's own wiki claims "four primary levels, each with six
Electoon cages" per world (`rayfanpedia.txt:323`), i.e. 7 × 4 × 6 = 168; the dump holds **153 placed
`oCage`** (143 in the seven worlds + 10 in `ROOM BonusDarkMagician`). Either ~15 cages are
code-spawned, or the wiki idealises. Flagged, not resolved.

---

## 2 · Composition statistics across the campaign

### 2.1 Scale

| Scope | Rooms | Placed instances | Travel (screen-widths) |
|---|---|---|---|
| Whole file | 179 | 20,424 | — |
| Seven main worlds (incl. the optional flight levels) | 115 | 16,029 | **1,032** |

Campaign class totals (7 worlds): tings 3,961 · editor enemies 936 · boss objects 40 · static
hazards 1,159 · creature-hazards/spawners 411 · hazard markers 1,488 · pickups 743 · **cages 143** ·
**checkpoints 112** · gendoors 607 · signs 105 · moving platforms 359 · traversal furniture 686 ·
scenery 2,285.

**Levels per world (from room prefixes):** every returning world now has 4 main levels plus, from
world 2 on, one optional flight level: `Bandlnd1–4 + BandlndBzzit`, `Mountain1–4 + MountainBzzit`,
`Picturecity1–4 + PicturecityBzzit`, `Caves1–4 + CavesBzzit + CavesSecret`, `Toys1–4 + ToysBzzit`,
`Cake1–4 + CakeBzzit`, plus `Final1–6`, `Legacy1–5`, `LonelyCliff`, `BonusDarkMagician`,
7 boss-rush arenas and 8 arcade rooms. The original had 4/4/3/3/3/1 levels
(`wiki/dream-forest/_Pink_Plant_Woods.html` navbox) — the remake normalises every world to 4 and
adds a seventh world; its own wiki states 37 levels across 9 worlds (`rayfanpedia.txt:489`,
`:493`).

Rooms per level run 2–6 (`Caves2` and `Caves3` have 6; `Mountain1` has 2), so "the part" is still the
authoring unit, but its length is elastic.

### 2.2 Per-world composition (linear, per 480 px of travel)

| # | World (prefix) | Rooms | Travel scr | inst/scr | enemy/scr | hazard/scr | ting/scr | ckpt/scr | cage/scr | gendoor/scr | vertical rooms | avg room height (scr) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Dream Forest (`Jungle`) | 17 | 121 | 11.8 | 0.87 | 1.12 | 2.28 | 0.091 | 0.148 | 0.42 | 2 | 2.3 |
| 2 | Band Land (`Bandlnd`) | 17 | 175 | 18.7 | 1.28 | 0.95 | 5.70 | 0.131 | 0.125 | 0.38 | 1 | 5.1 |
| 3 | Blue Mountains (`Mountain`) | 15 | 143 | 16.6 | 0.57 | 1.19 | 3.46 | 0.084 | 0.146 | 0.77 | 4 | 5.0 |
| 4 | Picture City (`Picturecity`) | 16 | 155 | 17.7 | 0.72 | **3.01** | 4.46 | 0.135 | 0.129 | 0.56 | 1 | 3.1 |
| 5 | Caves of Skops (`Caves`) | 21 | 150 | 14.9 | **0.39** | 2.33 | 2.96 | 0.100 | 0.120 | 0.49 | 4 | 4.8 |
| 6 | **Playtopia — new** (`Toys`) | 13 | 101 | **20.7** | **2.15** | 1.27 | **5.41** | **0.187** | **0.207** | **1.22** | 4 | 5.0 |
| 7 | Candy Château (`Cake`) | 16 | **186** | **9.9** | 0.74 | **0.81** | 2.70 | **0.059** | 0.124 | 0.50 | 2 | 4.1 |
| 8 | Final Showdown — new (`Final`) | 6 | 41 | 12.9 | **4.20** | 1.66 | 3.91 | 0.073 | 0 | 0.34 | 3 | 12.0 |
| 9 | Dark Legacy — new (`Legacy`) | 5 | 31 | 14.5 | 1.07 | **3.41** | 5.62 | 0.097 | 0 | 0.49 | 3 | 6.5 |
| — | Bonus/secret rooms | 22 | 169 | 15.1 | 1.12 | 2.92 | 2.78 | **0** | 0.059 | 0.35 | 5 | — |

Biggest single rooms: `Cake2_1 14608x1040` (30 screen-widths), `BandlndBzzit 12432x1360`,
`Mountain1_2 12000x960`, `Cake4_3 10400x800`.

### 2.3 The difficulty curve as data — it is not a slope, it is a rotating axis

Read the columns in world order and no metric rises monotonically:

- **Enemy pressure** peaks in world 2 (1.28/scr), *falls* to a game-low in world 5 (0.39/scr), then
  triples in the new world 6 (2.15/scr) and quadruples in the finale (4.20/scr).
- **Hazard pressure** does the opposite: worlds 4–5 are the hazard worlds (3.01 and 2.33/scr, e.g.
  `oYinyangEvil`×67 and `oScissors`×22 in Picture City; `oLavaball`×33 in the Caves) precisely where
  enemy counts dip. **He swaps the threat channel rather than stacking channels.**
- **Verticality** carries the mid-game: avg room height climbs from 2.3 screens (world 1) to ~5
  (worlds 2, 3, 6) and 12 in the finale; vertical rooms (h>w) appear from world 3 on
  (`Mountain2_3 1280x2496`, `Caves3_1 480x3232`, `Caves4_2 496x4928`).
- **Length** carries the finale world: Candy Château is the *longest* (186 travel screens) and the
  *emptiest* per screen (9.9 inst/scr, 0.81 hazards/scr, 0.059 checkpoints/scr). Difficulty there is
  endurance and set-pieces (`Cake2_1` alone is 30 screens wide with 1 checkpoint).
- **Density of everything** peaks in the new world, world 6 — the designer's own world is the one he
  fills most (20.7 instances, 5.41 tings, 2.15 enemies, 1.22 gendoors, 0.207 cages per screen).
- **Legibility scaffolding scales with hazards.** 1,488 `oSpikeSparkle1/2` markers exist for 1,159
  static hazards — in `Toys1_1` 17 `oPrickly` carry 36 sparkle instances (`--detail Toys1_1`).
  Every dangerous surface is annotated with glitter. This is the data signature of our own
  readability law ("hazards read at a squint", `level-cookbook-v2.md` §6).

### 2.4 Collectible grammar

- **Tings are sentences, not confetti.** 517 clusters across the 7 worlds (split at 200 px gaps):
  median **5**, mean 7.7; 17 % singletons, 31 % of 2–4, 25 % of 5–8, 25 % of 9+, max 77. Our
  cookbook's dial ("a run of 5–8 leading somewhere", §2) sits exactly on his median.
- **Two named per-level secrets:** `oMagicianToken` — **36 instances = one in each of the 28 main
  levels + one in each of the 6 flight levels + `Final4` + `Legacy2`**; `oGift` — **30 instances = one
  in each of the 28 main levels + `Final3` + `Legacy5`** (flight levels get a token, not a gift).
  `rayfanpedia.txt:323` names both as the remake's new collectibles; `:324` says the tokens gate the
  Magician's Challenges and, collected in full, a boss rush.
- **Cages: 143 in-world (+10 in `BonusDarkMagician`), 4–6 per level, median 5.** Position along the
  travel axis: q1 26 %, median 51 %, q3 69 % — deliberately spread, not back-loaded.
- **Consumables per level average 26.5 pickups**: `oPowerfist` 190, `oBigpower` 147, `oMediumpower`
  102, `oOneup` 118, `oGoldfist` 59, `oSuperpower` 8 (**exactly one per world**), `oTing_rainbow`
  214.
- **Economy sinks exist as rooms:** `NormalShop`, `BonusShop`, `GambleShop`, `BetillaShop`,
  `JoeShop` (all 320×240/480×270 with an `oShopNpc` or `oCS_Betilla` + `oCS_Text`). Tings are no
  longer only a 1-up counter; they are currency.
- **Reward vaults.** `ROOM LonelyCliff 2400x2512`: zero enemies, zero tings, **33 `oPowerfist`** laid
  in a 32-px grid row plus 17 rings/springs/poles — a pure movement playground.
  `ROOM Legacy5 1184x1200`: 95 tings (46 rainbow) + 23 `oOneup` + the gift, zero enemies — the payout
  room at the end of the hardest content.

### 2.5 The hidden-content engine (and a correction to the brief)

The brief guessed `oGendoor` = secret door. The data says **trigger volume**:

- 662 `oGendoor` instances carry non-unit scales — `rooms.txt ROOM Jungle1_1` has `oGendoor` at
  (1456, 256) with scale 1×5 and at (1632, 384) with scale 9×1, i.e. rectangles 1 cell wide × 5 tall
  and 9 × 1. Only 34 `oGendoor_hint` (a sparkle, `sEffect_spark_small`) exist — hints are rare;
  triggers are everywhere.
- **99 % of gendoors (657/662) have an `oAppear_common` block within 400 px**; there are 1,869
  `oAppear_common` instances, clustered at 16-px spacing (e.g. six of them at (1520–1552, 320–352)
  beside the `Jungle1_1` gendoor). Trigger + block cluster = a passage or platform group that
  appears.
- The name is inherited from the original engine: `TYPE_164_GENERATING_DOOR = 164, // gendoor`
  (`src/rayverse/src/types.h:955`) with a link-list of objects it brings into being
  (`moteur.c:2005 linkListHoldsAGendoor`).
- **What is behind them:** within 250 px of a gendoor sit 1,610 tings, 739 pickups and **69 cages**.
  Control test (because dense rooms make proximity cheap): a cage is within 250 px of a gendoor in
  36 % of cases (median Chebyshev distance 320 px) versus **5 %** for a checkpoint (median 832 px)
  and 5 % for a sign (median 1,951 px). **Cages are systematically associated with reveal triggers;
  roughly a third of them live in revealed pockets.**
- Gendoor density is the clearest per-world *authoring* signature: 0.38/scr in Band Land, 1.22/scr
  in the new world — his own world is three times as full of secrets as his most faithful remake.

### 2.6 What he deleted (the three de-gatings)

1. **The grind gate.** Original: the final level unlocks only after all 102 cages
   (`wiki/overview/_Rayman_1.html`). Remake: "breaking all cages is not mandatory to access Mr
   Dark's Dare, the Final Showdown or the end credits; however, it is required to open the bonus
   world" (`rayfanpedia.txt:324`) — the collect-all moved off the critical path and onto
   `Legacy1–5` + `Breakout1–8`. Data agrees: `Final*` and `Legacy*` contain **0 cages**.
2. **The ability gates.** All abilities unlocked from the start (`rayfanpedia.txt:98`). The original's
   permanent fairy grants survive only as **level-local consumables**: `oPowerup_superheli` 17
   instances confined to `Mountain3_1/3_2`, `Picturecity3_2`, `Cake2_2`, `Legacy2` + one bonus room;
   `oPowerup_seeds` 6; `oPowerup_paintfist` 6 (`Picturecity2_3`, `Toys2_2`). A power now exists where
   the level needs it, instead of gating the levels behind it. The fairy herself became a shop
   (`ROOM BetillaShop`), and the one staged ceremony left in the game is `Jungle1_4`.
3. **Vanishing parts.** Boss and ceremony parts persist on replay (`rayfanpedia.txt:336`); the
   original deleted them (`wiki/dream-forest/_Moskito's_Nest.html`: "Once Moskito is beaten, this
   phase will not appear again"; our canon records the same, `level-anatomy.md` PART B §1/§4).

---

## 3 · Close-read of a brand-new level: Playtopia 1 (`Toys1`)

Playtopia is the remake's invented sixth world ("an entire new world known as Playtopia",
`rayfanpedia.txt:98`, `:263`); its four levels are named Child's Play, Playhouse, Lair of the
Chessmaster and Brain Games, plus the optional flight level Playful Flight (`:265`, `:266`, `:495`).
Rooms: `Toys1_1 4800x752`, `Toys1_2 4880x480`, `Toys1_3 1280x2496` (vertical), then
`ToysBzzit 8704x272`. Total for `Toys1`: 525 instances, 72 enemies, 132 tings, 5 cages,
**6 checkpoints**, 13 gendoors, 20 pickups.

### 3.1 Room 1 — `Toys1_1`, 10 screens, "the wide introduction"

| scr | enemies | hazards | rewards / structure |
|---|---|---|---|
| 0 | 1 `oHunter` | 2 | 3 tings, gendoor |
| 1 | **6** (`oAntitoonChomp/Walk/Hunter`) | — | 10 tings, `oBigpower`, `oPowerfist` |
| 2 | 2 (+ first `oJester`) | 1 | **cage**, gendoor, 3 `oPuzzlepiece` moving platforms |
| 3 | 3 (first `oAntitoonFall`) | 3 | 11 tings, `oOneup` |
| 4 | 1 | 2 | **cage**, **checkpoint**, 1 moving platform |
| 5 | — | 4 | 6 tings — a pure breather screen |
| 6 | 1 `oJester` | 2 | 10 tings, `oGoldfist`+`oPowerfist`+`oMediumpower`, **checkpoint**, 2 gendoors |
| 7 | 3 | 3 | 6 tings |
| 8 | 2 `oAntitoonFall` | — | 3 tings |
| 9 | 1 `oJester` | — | 3 tings, gendoor, exit sign |

Reading: an **encounter bloom in screen 1** (six enemies, immediately after a single-enemy screen 0)
teaches the whole roster in one place at ground level; the two cages come at 20 % and 40 %; the two
checkpoints bracket the mid-level payload screen (6) which holds the biggest consumable stack in the
room. Screen 5 is deliberately empty of enemies — **the breather is authored, not accidental.**

### 3.2 Room 2 — `Toys1_2`, 10 screens, "the vehicle room"

Enemy count collapses to 7, and the room's identity becomes **18 `oToycar` moving platforms**
(`objects.tsv oToycar sRacecar oMovingParent`) plus 28 `oPrickly` spikes and 45 sparkle markers.
Flow: toy-car ride (scr 0), two flyers (scr 1), ride + tings (2), checkpoint (3), cage + a
`oBadEyes` + flyers (4), checkpoint (5), four-car convoy (6), gendoor pocket (7), jesters (8), the
climax at scr 9 — **12 hazards and 7 moving platforms in one screen** — then a quiet tail screen
holding the level's hidden `oGift`. **One new mechanic per room, its hardest expression at the end,
the secret gift after the climax** (reward *after* the risk, never bait over the pit).

### 3.3 Room 3 — `Toys1_3`, a 9.2-screen vertical shaft, "the enemy exam"

45 enemies in 1280×2496 — the densest room in the level by a factor of six. Bucketed along y:
7 enemies (band 0), 7 + cage + checkpoint (1), 5 + checkpoint (2), **18** (3, with the level's
`oMagicianToken`), 4 + exit sign (4), 4 + cage (5). Six enemy species appear
(`oAntitoonWalk`×21, `oToybot`×11, `oAntitoonFlySquare`×5, `oJester`×4, `oAntitoonChomp`×2,
`oHunter`×2) plus 5 `oPlumGenerator`. Two checkpoints sit in the first half; the 18-enemy band is
covered by the checkpoint immediately above it; the token sits *inside* the hardest band (the
reward for surviving is in the danger, not after it). Exact y positions: `oSavepoint` 704,
`oCage` 784, `oSavepoint` 1248, `oMagicianToken` 1600, `oSignExit` 2384, `oCage` 2448 — i.e. **the
second cage sits 64 px past the exit sign on the same axis**, the same "last cage beside the door"
figure as `Jungle1_3` (traversal direction unverified, §0.3).

### 3.4 How he composes when not copying — five observable rules

1. **One identity per room:** wide-and-populated → vehicle-ride → vertical exam. Enemy counts 20/7/45
   across the three rooms; moving platforms 5/21/7. The rooms differ by *what they are made of*, not
   by "more of the same".
2. **A shared enemy chassis plus a world specialist set.** The `oAntitoon*` family (7 variants:
   Walk, Chomp, Dash, Fly, FlySquare, Fall) appears in every world — 25 in world 1 up to 68 in
   Playtopia and 78 in the finale — while each world adds 3–6 specialists (`oToybot`, `oToytrain`,
   `oChessboy1/2`, `oJester` here; `oBadNote`×61 + `oTrumpet`×27 in Band Land; `oYinyangEvil`×67 in
   Picture City). Distinct worlds are made by *casting*, not by new brains — precisely our
   "role vocabulary is the palette" law (`level-cookbook-v2.md` §4).
3. **Secrets are dense but cheap.** 13 gendoors in the level, each a small revealed pocket of tings
   or a consumable; the *named* secrets (token, gift) are exactly one each.
4. **Reward rhythm = payload screens.** Consumables are not smeared: they arrive in stacks at
   screens 1, 6 (room 1), 3, 9 (room 2), bands 1, 3 (room 3) — 1–4 screens apart, each stack next to
   a checkpoint or right after a spike.
5. **Checkpoint saturation in his own world:** 0.187 per screen versus 0.059 in Candy Château. Where
   he owns the design, he pays for failure generously.

### 3.5 The other three Playtopia levels — mechanics invented, not inherited

- `Toys3_1/3_2` = **key-and-door level**: 13 `oToyKey` and 14 `oDoor` instances (`Toys3_1` 8 keys /
  9 doors, `Toys3_2` 5 / 5; the remake's wiki names the NPC who hands over the first key,
  `rayfanpedia.txt:443`).
  The doors are placed *between* encounter bands, so each key is a small delimited quest.
- `Toys4_1/4_2` = **"Brain Games", a maths level**: 65 `oCalculation` instances
  (`objects.tsv oCalculation sFont_toys` — a number font), 33 in room 1 and 32 in room 2, with an
  `oFairy` helper at scr 7 and scr 10 and only 8 enemies in 11 screens. Its own wiki: "a level filled
  with math puzzles similar to Rayman Junior" (`rayfanpedia.txt:266`). **A fan designer, given a free
  slot in a platformer, built an educational level — and to make room he cut enemy density to 0.7 per
  screen and put a helper NPC beside the two hardest puzzle screens.** This is the closest existing
  analogue to what we are building, and its dial settings are worth copying (§5, lesson 9).
- `ToysBzzit` = the optional flight level: 8704×272 (18 screens), 23 enemies, 2 checkpoints, no cages
  — pure ride, and the extra `oMagicianToken` is the reason to fly it (`rayfanpedia.txt:495`).

---

## 4 · Checkpoint and death economy in the data

### 4.1 Counts

- **118 checkpoint objects in the whole game**: 107 `oSavepoint` (sprite `sSaveBoard` — a signboard)
  + 11 `oBzzitsavepoint` (sprite `sPhotographerParts`). By scope: 112 in the seven worlds, 3 in
  `Final*`, 3 in `Legacy*`, **0 in all 22 bonus rooms**.
- **Per world (per screen of travel):** Playtopia 0.187 > Picture City 0.135 > Band Land 0.131 >
  Caves 0.100 > Legacy 0.097 > Dream Forest 0.091 > Blue Mountains 0.084 > Final 0.073 > Candy
  Château 0.059.
- **Per level** 1–9 (mean 3.6): `Bandlnd1` carries 9 across 5 rooms; `Mountain1`, `Caves3`, `Cake4`
  carry 1 each.
- **Per room:** 112 checkpoints in the 115 rooms of the seven worlds, but the distribution is uneven:
  **74 rooms have ≥1, 41 have none**, and 21 of those checkpoint-free rooms are longer than 3 screens
  — longest `Cake4_1 9920x864` (20.7 screens), `CakeBzzit 9664x480` (20.1), `Cake4_2 6720x1120`
  (14.0), `Bandlnd3_3 5600x560` (11.7), `Jungle4_3 5200x448` (10.8). Full list in
  `redemption-stats.txt` §D.

### 4.2 Placement discipline

Position along the travel axis (n=112): min 1 %, **q1 33 %, median 50 %, q3 66 %**, max 96 %. Rooms
with two checkpoints put them near 30–45 % and 60–80 % (`Jungle4_1` 47 %/81 %, `Picturecity3_1`
27 %/79 %, `Bandlnd2_3` 42 %/79 %). **Retry segments** (room start → checkpoint → … → room end,
n=227): median **4.0 screens**, p75 5.9, p90 8.3, worst **20.7** (`Cake4_1`, a 20.7-screen room with
no checkpoint at all), then `CakeBzzit` 20.1 and both halves of `Cake2_1` (15.4 and 15.0 — a
30-screen room with a single checkpoint at 49 %). **A quarter of all segments exceed 6 screens.**

### 4.3 Against our canon's claim about the original

Our canon does not fix an original per-level checkpoint count — it records the *mechanism* (a
photographer character who banks respawn state, `source-audit-r3.md` G9) and notes that no
checkpoint image exists in our reference set (`level-anatomy.md` §5 "Signs / checkpoints"). The wiki
gives one hard datum on sparsity: ports disagree about where "the last checkpoint" sits in Space
Mama's Crater (`wiki/picture-city/_Space_Mama's_Crater.html`) — a handful per level, tuned per
version. Against that, the remake's numbers read as a **deliberate 2–4× multiplication**: ~3.6 per
level, one per playable room on average, always subdividing a part that in the original was itself
the retry unit.

Two structural notes that matter more than the raw count:

1. **The room boundary is the real retry unit.** Deaths without a checkpoint return you to the start
   of the room (part), not the level — so the remake's *effective* dead-walk is the retry segment in
   §4.2 (median 4 screens), and adding checkpoints is a *within-part* subdivision.
2. **The checkpoint stopped being a character.** The photographer sprite survives **only on the six
   flight levels** (`oBzzitsavepoint`, 11 instances in `Jungle2_4`, `BandlndBzzit`, `MountainBzzit`,
   `PicturecityBzzit`, `CavesBzzit`, `ToysBzzit`); everywhere else a mute board replaced him
   (`objects.tsv oSavepoint sSaveBoard`). Our canon flags the character version as the better idea
   ("a character with a moment, not a marker", `source-audit-r3.md` G9). **A remake that improved the
   economy made the presentation duller** — for 6-year-olds this is the wrong trade, and we should
   take his density with the original's staging.
3. **Bonus rooms have zero checkpoints** — consistent with the original's timed-trial design
   (per-room seconds budget, `source-audit-r3.md` G1): a timed room cannot host a checkpoint without
   breaking its clock.

---

## 5 · Ten design lessons for a grade-1 educational platformer

Our players are 6–7-year-old English beginners; enemies are redeemed with language tasks, never
killed; the chapter unit is 3 phases + a one-screen guardian arena
(`level-cookbook-v2.md` §1).

| # | Lesson | Data evidence | Transfer note (ours) |
|---|---|---|---|
| 1 | **Make the first room threat-free and put ALL teaching in it.** | `Jungle1_1` (4.6 screens): 0 enemies, 0 hazards, 12 tings, 2 one-ups — and all 3 `oSignTutorial` in the game. Game-wide, 23 of 35 level-opening rooms have zero enemies in the first screen-width (18 have zero hazards too). | Chapter 1 phase 1 stays enemy-free until the fist ceremony; every taught verb gets its sign *there* and nowhere else. Our tutorial affordances are diegetic (Fibel), so "signs" = one grant scene + one red-orb loop. |
| 2 | **Stretch, don't densify, when you have more room.** | Every part of level 1 grew 25–75 % in width with **identical height**; the whole game averages 7–12 screens of travel per room. | If a phase feels thin, add runway between beats before adding encounters. Our dial (0.5–0.75 encounters/screen) is already below his 0.87–2.15 — keep it, and buy readability with length. |
| 3 | **Delete every gate that can strand a child.** | Abilities unlocked from the start (`rayfanpedia.txt:98`); permanent power-grants demoted to level-local consumables (17 `oPowerup_superheli`, all in 5 rooms); collect-all moved off the critical path (`:324`); `Final*`/`Legacy*` hold 0 cages. | Keep cages/letters gating **bonuses only** (our anti-law 9). The later-verb cage stays, but as a *marked* revisit invitation, and its chapter must be completable without it. |
| 4 | **Checkpoint before the spike, twice per long room, at ~1/3 and ~2/3.** | Checkpoint positions q1 33 % / median 50 % / q3 66 %; `Jungle1_2` puts its only checkpoint one screen before the piranha-and-lily crossing; retry segments median 4.0 screens. | Our rule (≤1 per phase, before the risk) is stricter than his mean. Adopt his *positioning* (before the spike, bracketing the payload screen) and cap our worst dead-walk at ~4 screens — his p90 of 8.3 and worst of 20.7 are exactly the failure our anti-law 3 forbids. |
| 5 | **Keep the checkpoint a character.** | He replaced the photographer with a board (`oSavepoint sSaveBoard`), keeping the character only on flight levels (11 `oBzzitsavepoint`). | Our sketch-checkpoint should be the *drawn* moment (a margin-sketch of the child, per `source-audit-r3.md` G9), not a glyph. Density from the remake, staging from the original. |
| 6 | **Collectible trails are sentences of 5.** | 517 ting clusters, median 5, mean 7.7; only 17 % singletons; the arcs in `Jungle1_2` scr 4 (10 tings) and `Toys1_1` scr 3 (11) mark jump lines. | Confirms our currency dial verbatim (`level-cookbook-v2.md` §2). Author letter/ting runs of 5–8 that *point at* a cage, a bonus door, or a jump; never scatter. |
| 7 | **Give exactly two named, countable secrets per level.** | 36 `oMagicianToken` and 30 `oGift` — precisely one of each per level, game-wide; the remake's wiki names both as its new collectibles (`:323`). | Per chapter: one Klecks-door token + one hidden gift, both shown on the HUD as "1 of 1". A 6-year-old can hold two named goals; they cannot hold "some hidden things". |
| 8 | **Rotate the difficulty axis per world instead of stacking pressure.** | Enemies 1.28/scr (world 2) → 0.39 (world 5) → 2.15 (world 6) → 4.20 (finale), while hazards peak in worlds 4–5 (3.01, 2.33) and length peaks in world 7 (186 screens, 9.9 inst/screen). | Our year plan should ramp one channel per chapter — population, then verticality, then timing, then length — never all at once. Tier dial stays population/placement/timers, never physics. |
| 9 | **An educational level survives only if you cut the platforming pressure around it.** | "Brain Games" (`Toys4_1/4_2`): 65 `oCalculation` objects, 8 enemies in 11 screens (0.7/scr vs 2.15 for its world), a helper `oFairy` beside the two hardest screens, and 61 gendoor reveal-pockets to keep exploration paying. | Our task overlays are the *whole point*, so this is a law, not an option: on a task-heavy phase drop encounters to ≤0.5/screen, park a helper (Fibel/Klecks) beside the hardest task, and keep the reward pockets flowing so the phase still feels like a place, not a worksheet. |
| 10 | **Pay curiosity, always, and never take anything back.** | 1,610 tings + 739 pickups + 69 cages sit within 250 px of a reveal trigger (36 % of all cages, vs a 5 % control rate against checkpoints); `Jungle1_3` and `Toys1_3` both put their last cage 64 px from the exit sign; `Toys1_2` puts the hidden gift in the quiet tail after the climax; `LonelyCliff` and `Legacy5` are pure payout rooms (33 power-fists / 95 tings, 0 enemies). | Our reveal-pockets (punch a wall, a strip of page peels) must always contain something, and the last cage of a chapter should sit beside the exit sign so no child loses it by walking forward. Reward *after* the risk, never bait over it (anti-law 8). |

Two anti-lessons worth recording, because his data shows the seams:

- **A 20.7-screen room with no checkpoint at all** (`Cake4_1`; `Cake2_1` is 30 screens with one) is a
  difficulty spike delivered by *length*. Our phases stay short enough that a phase IS the retry unit.
- **Hazard-marker inflation** (1,488 sparkles for 1,159 hazards) is what "make it readable" looks
  like when the underlying shapes are not readable on their own. We get the same effect for free from
  STYLE_PAINT_V1 silhouettes (`level-cookbook-v2.md` §6) — we should not need glitter on every spike,
  and if we do, the art is failing.

---

## 6 · Open questions for a play-check (cheap, high-value)

1. Are all four `Jungle1` cages actually reachable on the first pass without later movement toys?
   (Instance data cannot answer; §1.5.)
2. Where do the ~15 unplaced cages come from — code-spawned, or is the "6 per level" claim
   idealised? (`rayfanpedia.txt:323` vs 143 placed.)
3. What exactly does an `oGendoor` reveal in play — appearing platforms, or a vanishing wall?
   (99 % adjacency to `oAppear_common` proves the pairing, not the direction.)
4. Which side is the entry of the vertical rooms (`Picturecity2_1` shows 5 enemies + 4 hazards in its
   top screen — either a hostile opening or a hostile *ending*)?
5. Do the shops sell abilities, consumables, or cosmetics? (`BetillaShop`/`NormalShop`/`GambleShop`
   contain only an NPC + `oCS_Text`; the item list is in code, not in the dump.)

**Provenance:** all tables reproducible via
`python3 /Users/veho/Code/rayman-study/decode/redemption_stats.py [--rooms|--ckpt|--watch|--roster|--detail ROOM|--flow ROOM]`;
archived output at `/Users/veho/Code/rayman-study/decode/redemption-stats.txt`. No git repository was
modified by this study.
