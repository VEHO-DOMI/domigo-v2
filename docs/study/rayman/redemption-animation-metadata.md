# S5-anim — animation timing & character motion, read off a modern remake's sprite metadata

**Status: STUDY DRAFT (2026-07-26).** Clean-room, CP-15 compliant: **not one sprite image was
opened, extracted, or viewed.** Everything below is derived from *names and numbers* in two
text tables plus our own source files.

**Sources of every number in this document**

| what | where |
|---|---|
| 1,264 sprite records — name, frame count, playback speed, speed type, width/height, origin | `/Users/veho/Code/rayman-study/decode/redemption-dump/sprites.tsv` |
| 521 object records — name, default sprite, parent | `/Users/veho/Code/rayman-study/decode/redemption-dump/objects.tsv` |
| 179 room instance lists (which creature is placed in which level) | `/Users/veho/Code/rayman-study/decode/redemption-dump/rooms.txt` |
| how the dump was made (text-only, CP-15) | `/Users/veho/Code/rayman-study/decode/extract-catalog.csx:26-35` |
| our frame-by-frame capture of the **1995 original's** movement | `/Users/veho/Code/domigo-v2/docs/Rayman X DomiGo Screenshots/Rayman Movement Physics/PHYSICS-CAPTURE.md` |
| our decomp-verified movement constants | `/Users/veho/Code/domigo-v2/packages/game-paint/src/paint.ts:26-63` |
| our hero rig (procedural, no sheet) | `/Users/veho/Code/domigo-v2/packages/game-paint/src/rig.ts:19-45` |
| our sheet-frame picker | `/Users/veho/Code/domigo-v2/packages/game-paint/src/anim.ts:6-10` |
| our enemy state→cell mapping (the 12-tick a/b flip) | `/Users/veho/Code/domigo-v2/packages/game-paint/src/PaintScene.ts:264-271` |
| our enemy state machines (telegraph durations) | `/Users/veho/Code/domigo-v2/packages/game-paint/src/entities.ts:91-93, 210-283` |
| helper scripts written for this study | `/Users/veho/Code/rayman-study/decode/anim_study.py`, `anim_study2.py`, `anim_study3.py` |

**Two terms, defined once.** A *sprite* here is one named animation strip — a bag of ordered
still images ("frames") plus a playback speed. A *tick* is one step of game logic; both the
studied game and ours run logic at 60 ticks per second, so **1 tick = 16.7 ms**, and any
duration in this document can be read either way.

---

## 0 · Two honest caveats about the data

**(a) 423 of the 1,264 sprites report their size as 1×1 pixels.** This is not a broken
extraction — the extractor reads `s.Width`/`s.Height` straight from the game data
(`extract-catalog.csx:33`), and those 423 records also have their origin collapsed to `0,0`
(413 of 423 exactly `0x0`). Their **frame counts and playback speeds are intact and real**
(416 of the 423 are multi-frame animations). So: *geometry is unusable for those sprites;
timing is usable for all 1,264.* This study is a **timing** study, so the caveat costs us
almost nothing — I only quote pixel sizes for the 841 sprites that carry real dimensions.

**(b) `rooms.txt` lists every placed instance twice** — once in the engine's legacy instance
list and once in the modern layer list (`extract-catalog.csx:43-54` walks both). Every raw
placement count is therefore exactly even. **All placement counts in §5 are halved.** Counts
of *distinct types* are unaffected.

---

## 1 · The player sprite family — where a remake spends its animation budget

56 sprites are named `sPlayer_*`, holding **1,796 individual drawn frames** for one character.

### 1.1 The full sheet (sorted by move class)

Playback speed is the remake's own number; the last two columns convert it to our clock.
"ticks@60" = how long the strip runs if you play it once on a 60 Hz logic clock.

| sprite | frames | speed | size (px) | one cycle | ticks@60 |
|---|---|---|---|---|---|
| **locomotion** | | | | | |
| `sPlayer_walk` | 32 | 60 fps | 51×68 | 533 ms | 32 |
| `sPlayer_run` | 31 | 60 fps | 68×72 | 517 ms | 31 |
| `sPlayer_run_stop` | 10 | 30 fps | 41×68 | 333 ms | 20 |
| `sPlayer_idle_fast` | 36 | 60 fps | 63×64 | 600 ms | 36 |
| `sPlayer_idle_fast_stop` | 6 | 60 fps | 55×65 | 100 ms | 6 |
| **air** | | | | | |
| `sPlayer_jump` | 30 | 30 fps | 56×60 | 1000 ms | 60 |
| `sPlayer_jump_run` | 9 | 60 fps | 51×64 | 150 ms | 9 |
| `sPlayer_jump_spin` | 28 | 60 fps | 50×56 | 467 ms | 28 |
| `sPlayer_tofall` | 10 | 30 fps | 58×66 | 333 ms | 20 |
| `sPlayer_fall` | 10 | 30 fps | 52×66 | 333 ms | 20 |
| `sPlayer_landing` | 15 | 30 fps | 51×64 | 500 ms | 30 |
| `sPlayer_heli` | 26 | 30 fps | 66×72 | 867 ms | 52 |
| `sPlayer_heli_stop` | 9 | 60 fps | 63×67 | 150 ms | 9 |
| `sPlayer_deathfall` | 24 | 60 fps | 60×84 | 400 ms | 24 |
| **the thrown fist** | | | | | |
| `sPlayer_fist_start` | 13 | 60 fps | 60×61 | 217 ms | 13 |
| `sPlayer_fist_load` | 50 | 60 fps | 61×65 | 833 ms | 50 |
| `sPlayer_fist_throw` | 22 | 60 fps | 60×57 | 367 ms | 22 |
| `sPlayer_fist_inair` | 23 | 60 fps | 68×78 | 383 ms | 23 |
| **climb / ledge** (9 sprites, 317 frames) | | | | | |
| `sPlayer_ledge` | 50 | 60 fps | 75×88 | 833 ms | 50 |
| `sPlayer_climb_fist_load` | 50 | 60 fps | 47×69 | 833 ms | 50 |
| `sPlayer_climb_idle` | 39 | 15 fps | 41×67 | 2600 ms | 156 |
| `sPlayer_climb_up` / `_down` | 36 / 36 | 60 fps | 52×71 | 600 ms | 36 |
| `sPlayer_ledge_idle` | 34 | 15 fps | 75×88 | 2267 ms | 136 |
| `sPlayer_ledge_fist_throw` | 29 | 60 fps | 77×83 | 483 ms | 29 |
| `sPlayer_ledge_fist_load` | 21 | 60 fps | 72×80 | 350 ms | 21 |
| `sPlayer_climb_fist_throw` | 22 | 60 fps | 60×60 | 367 ms | 22 |
| **crouch** | | | | | |
| `sPlayer_duck_move` | 29 | 60 fps | 71×28 | 483 ms | 29 |
| `sPlayer_duck_start` / `_stop` | 8 / 8 | 60 fps | 55×65 | 133 ms | 8 |
| `sPlayer_duck_idle` | **1** | 15 fps | 55×65 | — | — |
| **swing** | | | | | |
| `sPlayer_ring` | 34 | 15 fps | 128×89 | 2267 ms | 136 |
| **reactions** | | | | | |
| `sPlayer_hurt` | 28 | 60 fps | 74×82 | 467 ms | 28 |
| `sPlayer_drown` | 34 | 30 fps | — | 1133 ms | 68 |
| `sPlayer_plant` | 14 | 30 fps | 40×64 | 467 ms | 28 |
| `sPlayer_edge_right` / `_left` | 12 / 12 | 15 fps | — | 800 ms | 48 |
| **idle + personality** | | | | | |
| `sPlayer_idle` | 14 | 15 fps | 34×66 | 933 ms | 56 |
| `sPlayer_idle_special2` | **190** | 30 fps | — | 6333 ms | 380 |
| `sPlayer_idle_special3` | 128 | 30 fps | — | 4267 ms | 256 |
| `sPlayer_idle_scared` | 38 | 15 fps | — | 2533 ms | 152 |
| `sPlayer_idle_special1` | 32 | 15 fps | — | 2133 ms | 128 |
| `sPlayer_heads` | 24 | 15 fps | 24×32 | 1600 ms | 96 |
| `sPlayer_grimace` | 20 | 15 fps | — | 1333 ms | 80 |
| **victory / cutscene** | | | | | |
| `sPlayer_win_boss` | **158** | 15 fps | — | 10533 ms | 632 |
| `sPlayer_go_spin1` | 71 | 30 fps | — | 2367 ms | 142 |
| `sPlayer_go_turn` | 50 | 30 fps | — | 1667 ms | 100 |
| `sPlayer_win` | 49 | 15 fps | 72×77 | 3267 ms | 196 |
| `sPlayer_go_idle2` | 43 | 30 fps | — | 1433 ms | 86 |
| `sPlayer_go_spin2` | 37 | 30 fps | — | 1233 ms | 74 |
| `sPlayer_go_walk` | 32 | 30 fps | — | 1067 ms | 64 |
| `sPlayer_go_idle1` | 25 | 30 fps | — | 833 ms | 50 |
| (masks / rings, 1 frame each) | 1 | 15 fps | 16×48 | — | — |

### 1.2 Where the budget actually went

| move class | sprites | frames | share of 1,796 |
|---|---|---|---|
| gameplay moves (38 sprites: locomotion, air, fist, climb, crouch, swing, hurt) | 38 | **895** | **50 %** |
| victory + cutscene (`win`, `win_boss`, the 6 `go_*`) | 8 | 465 | 26 % |
| idle personality (`idle_special1/2/3`, `idle_scared`, `grimace`, `heads`) | 6 | 432 | **24 %** |

**The headline finding: half of a modern remake's hero-animation budget is not gameplay.**
A quarter goes to *idle personality* — animations the player only ever sees by standing still
and doing nothing (`sPlayer_idle_special2` alone is 190 frames / 6.3 seconds), and another
quarter to win/cutscene poses. The *playable* character is 895 frames across 38 strips —
**median 23.5 frames per gameplay move** (mean 23.6, min 1, max 50).

### 1.3 Which gameplay moves got the most frames — and why

Ranked, the top of the gameplay budget is not what a naive reading would predict:

1. **`fist_load` and `climb_fist_load` — 50 frames each.** The *charge-up* of the attack is
   the single most animated gameplay state, tied with `ledge` (50).
2. **`ledge` — 50 frames** (the grab-and-mount).
3. **`climb_idle` — 39, `climb_up`/`_down` — 36 each, `idle_fast` — 36.**
4. **`walk` — 32, `run` — 31, `jump` — 30.** The bread-and-butter loops sit *below* the
   charge and the ledge.

The design logic is legible: **frames are spent on states the player *dwells in* and states
the player must *read*** — a charge you hold, a hang you hover in, a climb you creep along.
Transitions get few frames (`jump_run` 9, `heli_stop` 9, `duck_start`/`_stop` 8 each,
`idle_fast_stop` 6) and one state gets exactly one frame: **`sPlayer_duck_idle` = 1 frame.**
Crouching still is a *held pose*, not an animation. (This is also the one state our
`PHYSICS-CAPTURE.md:56` flags as having **no** movement numbers in the original decompilation
at all — the remake's answer to that gap is "it's a pose, not a move".)

### 1.4 Animation length is tuned to the *mechanic* length — a cross-check

Comparing the remake's strip durations with the **original game's** decompiled constants
(`paint.ts`, `PHYSICS-CAPTURE.md §Modality table`) shows the animator was working from the
mechanic clock, not by feel:

| remake strip | length | original mechanic | source | fit |
|---|---|---|---|---|
| `sPlayer_heli` 26f@30 | **52 ticks** | helicopter glide = **50 ticks** | `PHYSICS-CAPTURE.md` row 08; `paint.ts:52` | ✅ +2 ticks — the glide loop is the glide |
| `sPlayer_fist_load` 50f@60 | **50 ticks** | ground charge caps at **63 ticks** (+1/tick) | `paint.ts:62` (`chargeMax: 63`); audit M4 | ✅ 79 % of the window, then holds the last frame |
| `sPlayer_fist_start` 13f@60 | **13 ticks** | — | — | the wind-up before the charge loop |
| `sPlayer_jump` 30f@30 | **60 ticks** | hold window ≤ **12** ticks; apex ≈ **27** ticks | `paint.ts:42`, `PHYSICS-CAPTURE.md` row 04 | ✅ outlasts the rise — covers launch → apex → hang |
| `sPlayer_hurt` 28f@60 | **28 ticks** | invulnerability = **120** ticks | `PHYSICS-CAPTURE.md` row 18 | animation is 23 % of the i-frames; the flicker carries the rest |
| `sPlayer_landing` 15f@30 | **30 ticks** | (no constant) | — | **half a second of landing recovery** |
| `sPlayer_ring` 34f@15 | **136 ticks** | 5-tick dwell at each swing extreme | `PHYSICS-CAPTURE.md` row 11 | a long slow loop over the whole arc |
| `sPlayer_duck_start` 8f@60 | **8 ticks** | 60 i-frames while crouched | audit M9 | the entry is quick, the state is a pose |

The one that should change our minds: **`sPlayer_landing` runs 30 ticks (500 ms).** Our own
landing recovery is `RIG.landRecoverTicks: 6` (`rig.ts:38`) — **5× shorter**. A remake with
"modern game feel" spends half a second selling a landing.

### 1.5 Walk/run cadence versus ours

`sPlayer_walk` = 32 frames @ 60 fps = **32 ticks (533 ms) per cycle**; `sPlayer_run` = 31
frames @ 60 fps = **31 ticks (517 ms)**. Note that walk and run are almost the same *cycle
duration* — the run reads faster because the character covers more ground per cycle, not
because the legs cycle faster.

Ours: `RIG.runCycleTicks: 16` (`rig.ts:21`, commented "one full stride at run speed"), used as
`(walkTime % RIG.runCycleTicks) / RIG.runCycleTicks` (`rig.ts:115`). If our 16 ticks is a
*full two-step cycle*, our legs cycle **2× faster** than the remake's. If it is one step
(so a full cycle is 32 ticks), we match it almost exactly. Worth resolving before the pose
program spends art on it — the number to hit is **32 ticks per full two-step cycle.**

### 1.6 The parts atlas — the remake animates its hero as POSED PARTS, like we do

28 sprites are named `sRayparts_*`, holding **3,698 cells** between them. The distribution is
the tell:

- **24 of the 28 hold exactly 150 cells each**, all at 48×34 px (one variant at 56×50),
  origin `0,0`, all at 15 fps: `sRayparts_basic`, `_dark`, `_blue`, `_snes`, `_halloween1/2`,
  `_lockjaw`, `_heavyfist`, `_vortex`, `_rocket`, `_heli`, `_ed`, `_plum`, `_jungle`,
  `_bandlnd`, `_stone`, `_image`, `_spider`, `_toys`, `_clown`, `_headdy`, `_darkgbc`,
  `_darkmgc`, `_R2`. Twenty-four costumes, **identical 150-cell layout**.
- Two variants break the pattern in a revealing way: `sRayparts_goldenfist` = **46** cells and
  `sRayparts_superheli` = **3** cells (plus `_snes` twins of both).
- **No object in `objects.tsv` uses any `sRayparts_*` as its sprite** (the only `*parts`
  assignments are `oStonemanparts→sStonemanParts`, `oLavapart→sLavaparts`,
  `oBzzitsavepoint→sPhotographerParts`).

**Inference (labelled as such, not fact — I cannot look at the images):** `sRayparts_<costume>`
is a **body-part atlas addressed by cell index from code**, not a timeline that plays. Four
pieces of evidence point the same way: (i) it is never an object's default sprite, so nothing
auto-plays it; (ii) its playback speed is 15 fps on all 28, which is the engine's *default*
value — i.e. never set, because never played; (iii) the 150-cell count is byte-identical
across 24 costumes, which is what a fixed index contract looks like; (iv) the `_superheli`
variant is **exactly 3 cells**, and our own rig already models the hover rotor as
`frame?: number; // rotor spin frame 0..2` (`rig.ts:52`) — three cells is a rotor spin.
The 46-cell `_goldenfist` variant is then the fist part in 46 poses.

If that reading is right, the remake and our `rig.ts` arrived at the same architecture from
opposite directions: **a small indexed pose library + code that places the parts.** The
transferable law is the *contract*: 150 cell slots, fixed meaning per slot, 24 re-paints
dropped in behind the same indices. That is exactly the shape our AC card kit already has
(cell→stem map, `resolvePaintArt()` auto-scan) — and it validates it.

The broader `*parts` family is 159 sprites / **7,013 cells**, 158 of them at 15 fps
(the default) — consistent with "atlas, not timeline" across the whole game, with enemy
`*Parts` sprites doubling as death-shatter debris (`oStonemanparts` proves at least one is
spawned as a debris object).

---

## 2 · Enemy animation budgets

### 2.1 What a small enemy gets

For each family I counted only genuine *state* strips (dropping `*Parts` debris atlases,
`*Editor` placement icons, `*mask`, projectiles, and single-frame stills).

| family | state strips | total frames | median frames/state | idle | walk / fly | hurt | turn |
|---|---|---|---|---|---|---|---|
| Spider | 15 | 408 | 18 | 43f@15 = 2867 ms | 24f@30 = 800 ms | 18f@30 = 600 ms | 43f@30 = 1433 ms |
| Moth | 11 | 183 | 15 | 17f@30 = 567 ms | 15f@30 = 500 ms | 22f@**60** = 367 ms | 13f@30 = 433 ms |
| Antitoon (the universal grunt) | 10 | 112 | 7 | 8f@15 = 533 ms | 36f@**60** = 600 ms | — | — |
| Livingstone big (`Lsbig`) | 10 | 251 | 21 | **72f@15 = 4800 ms** | 21f@30 = 700 ms | 22f@**60** = 367 ms | 11f@15 = 733 ms |
| Hoplite | 9 | 180 | 15 | 12f@15 = 800 ms | 16f@30 = 533 ms | — | 9f@30 = 300 ms |
| Stoneman | 9 | 362 | 25 | 10f@15 = 667 ms | 48f@**60** = 800 ms | — | 21f@30 = 700 ms |
| Livingstone small (`Lssmall`) | 8 | 177 | 22 | 33f@15 = 2200 ms | 21f@30 = 700 ms | 18f@**60** = 300 ms | 24f@15 = 1600 ms |
| Spaceflyer | 7 | 146 | 17 | 40f@30 = 1333 ms | (chase 15f@30) | 27f@15 = 1800 ms | — |
| BigClown | 6 | 137 | 22 | 33f@30 = 1100 ms | 32f@30 = 1067 ms | 15f@30 = 500 ms | 24f@20 = 1200 ms |
| Spacedash | 6 | 157 | 25 | 40f@15 = 2667 ms | — | 27f@15 = 1800 ms | — |
| Jester | 5 | 82 | 16 | 13f@30 = 433 ms | 15f@30 = 500 ms | 16f@30 = 533 ms | — |
| WaterClown | 5 | 137 | 32 | 10f@15 = 667 ms | 41f@30 = 1367 ms | 20f@30 = 667 ms | 34f@30 = 1133 ms |
| TntClown | 5 | 84 | 20 | 30f@30 = 1000 ms | — | 10f@30 = 333 ms | — |
| Hunter | 4 | 141 | 30 | 68f@30 = 2267 ms | — | 12f@30 = 400 ms | — |
| Toybot | 4 | 68 | 15 | 24f@30 = 800 ms | 14f@**60** = 233 ms | 14f@30 = 467 ms | — |
| Stonedog | 4 | 61 | 12 | 10f@15 = 667 ms | 26f@30 = 867 ms | 12f@30 = 400 ms | — |
| Redrobot | 4 | 56 | 16 | 18f@15 = 1200 ms | — | 14f@30 = 467 ms | — |
| MagicMinion | 4 | 58 | 16 | — | 21f@30 = 700 ms | 11f@30 = 367 ms | 6f@30 = 200 ms |
| Chessboy1 / Chessboy2 | 3 / 3 | 70 / 58 | 18 / 15 | 37f@30 / 33f@30 | — | 15f@30 = 500 ms | — |
| Brushboy | 3 | 35 | 11 | — | 11f@30 = 367 ms | 8f@30 = 267 ms | — |
| Megatoon | 3 | 60 | 22 | — | 16f@30 = 533 ms | 22f@30 = 733 ms | — |

**The answers to "what is typical".** Across the 22 land/air small enemies tabled above:

- **median 5 state strips per enemy**; the recurring workhorses that appear in many levels get
  **8–15** (Antitoon 10, `Lssmall` 8, `Lsbig` 10, Hoplite 9, Moth 11, Spider 15, Stoneman 9).
- **median ~16–18 frames per state** (whole-sheet medians by action: idle 24.5, walk 25, turn
  16, jump 16, hurt 16, attack 19, shoot 23.5, throw 32, dash 10, stop 8).
- **idle is the longest state, and the slowest**: idles run 2–33 frames at 15 fps or 30 fps,
  and the very long ones are deliberate — `sLsbig_idle` is 72 frames / **4.8 seconds**,
  `sStoneman_idle2` 73f / 4.87 s, `sSpider_idle` 43f / 2.87 s, `sHunter_idle` 68f / 2.27 s.
  A small enemy standing around is a 2–5 second performance.
- **hurt is the fastest state**: 53 hurt strips, median 16 frames / **467 ms**, and 9 of them
  run at **60 fps** — the impact frame-rate. Nothing else in the enemy roster does that
  except fast walks.
- **the enemy cast is animated on the same clock as the hero**: 5 of the 22 `walk` strips in
  the whole game run at 60 fps, and they belong to enemies (`sAntitoon_walk` 36f,
  `sStoneman_walk` 48f, `sMrSax_walk` 50f, `sNougatManWalk` 32f, `sSkops_walkback` 60f).

### 2.2 Bosses, for scale

| boss | state strips | total frames | notable |
|---|---|---|---|
| MrDark (final boss, phase 1) | 29 | 553 | `sMrDark_idle` 34f@15 = 2267 ms |
| MrStone | 20 | 604 | `sMrStone_anticipate` 40f@30, `_slam` 36f@30, `_throw` 37f@30 |
| Skops | 19 | 841 | `sSkops_wakeup` **190 frames** @30 = **6.3 s** |
| MrDark2 (final boss, phase 2) | 18 | 359 | 6 shoot variants (`_shoot`, `_shoot_h`, `_shoot_hands`, `_sideshoot`×3) |
| Spacemama | 14 | 358 | 3 distinct shoot strips (36f / 14f / 24f) |
| Moskito | 12 | 397 | `sMoskito_cry` **142 frames** @15 = 9.5 s |
| Pirate2 | 12 | 267 | |
| Stoneskops / Piratemama / RedBoss | 9 / 9 / 10 | 236 / 214 / 225 | |

A boss is **9–29 state strips / 214–841 frames** — roughly 2–4× a workhorse small enemy.
Note the *emotional* strips in the boss budget: `sMoskito_cry` (142 frames), `sMoskito_dizzy`
(24f), `sLsbig_scared` (28f@30), `sPainter_idle_cry` (33f@15). A remake budgets frames for
enemies *feeling things* — which is directly our redemption economy (guardian cries → is
consoled → becomes ally), and it says that beat wants **real frames**, not a tint.

---

## 3 · Telegraph timing — hard numbers for our "every hostile action is telegraphed" law

90 sprite names match wind-up / attack vocabulary. The most useful evidence is the families
that **split an attack into a separate wind-up strip and a separate release strip** — the
wind-up duration is then read directly off the data.

### 3.1 Explicit wind-up → release pairs

| wind-up strip | wind-up | release strip | release | wind-up : release |
|---|---|---|---|---|
| `sSpider_lookback` | 31f@30 = **1033 ms / 62 ticks** | `sSpider_buttshoot` | 367 ms / 22 t | **2.8 : 1** |
| `sMrStone_anticipate` | 40f@30 = **1333 ms / 80 ticks** | `sMrStone_slam` | 1200 ms / 72 t | 1.1 : 1 |
| `sSpacedash_start` | 35f@30 = **1167 ms / 70 ticks** | `sSpacedash_dash` | 500 ms / 30 t | 2.3 : 1 |
| `sHunter_aim` | 24f@30 = **800 ms / 48 ticks** | `sHunter_shoot` | 1233 ms / 74 t | 0.65 : 1 |
| `sJester_comeout` | 19f@30 = **633 ms / 38 ticks** | `sJester_attack` | 633 ms / 38 t | 1.0 : 1 |
| `sToybot_notice` | 16f@30 = **533 ms / 32 ticks** | `sToybot_run` — the charge *is* the attack | 233 ms / 14 t | 2.3 : 1 |
| `sPlayer_fist_start` (the hero's own) | 13f@60 = **217 ms / 13 ticks** | `sPlayer_fist_throw` | 367 ms / 22 t | 0.6 : 1 |
| `sSpiketHorWakeup` (a trap arming) | 21f@30 = **700 ms / 42 ticks** | `sSpiketHor` (1f) | — | — |
| `sSkops_wakeup` (boss intro, one-shot) | 190f@30 = **6333 ms / 380 ticks** | `sSkops_stomp` | 2200 ms / 132 t | 2.9 : 1 |
| `sBetilla_wakeup` (friendly NPC) | 40f@20 = **2000 ms / 120 ticks** | `sBetilla_idle` | 1133 ms / 68 t | — |

**Derived house number: a per-attack telegraph runs 500–1300 ms (30–80 ticks at 60 Hz),
clustering at 30–48 ticks for small enemies and 62–80 ticks for bosses.** Median of the seven
per-attack rows above: **800 ms / 48 ticks.** A one-shot arrival/awakening telegraph is an
order of magnitude longer (2–6 s) and is a cutscene, not a combat read.

### 3.2 Single-strip attacks (wind-up baked into the strip)

Where there is no separate wind-up sprite, the whole attack strip carries it, and the strips
are correspondingly longer than a walk:

`sLssmall_attack` 41f@**60** = 683 ms · `sLshuge_attack` 27f@30 = 900 ms · `sMoth_headbutt`
28f@30 = 933 ms · `sMoth_kick` 13f@15 = 867 ms · `sAntitoon_chomp` 17f@30 = 567 ms ·
`sBrushboy_attack` 16f@30 = 533 ms · `sRedrobot_attack` 17f@30 = 567 ms · `sJester_attack`
19f@30 = 633 ms · `sWaterClown_attack` 32f@30 = 1067 ms · `sHoplite_swing` 40f@30 = 1333 ms ·
`sStonehead_throw` 17f@30 = 567 ms · `sPest_throw` 39f@30 = 1300 ms · `sBzzitmama_shoot`
38f@30 = 1267 ms · `sPiratemama_shoot` 73f@30 = **2433 ms** · `sSkops_stomp` 66f@30 = 2200 ms.

**Whole-sheet action medians:** attack 633 ms · shoot 784 ms · throw 1050 ms · dash 333 ms ·
chomp 567 ms. The fast ones (`sAntitoon_dash` 3f@15 = 200 ms, `sMoskito_dash` 3f@30 = 100 ms,
`sSkopskito_dash` 2f@15 = 133 ms) are *dashes that follow a separate telegraph* — the strike
itself is allowed to be almost instant once it has been announced.

### 3.3 The finding we did not go looking for: **the turn is a telegraph**

Nineteen sprites are named `*_turn`, and they are real, time-consuming states:

| | | | |
|---|---|---|---|
| `sMagicMinion_turn` 200 ms / 12 t | `sRomama_turn` 267 ms / 16 t | `sHoplite_turn` 300 ms / 18 t | `sMrSax_turn` 333 ms / 20 t |
| `sMoth_turn` 433 ms / 26 t | `sTeethfish_turn` 467 ms / 28 t | `sMoskito_turn` 533 ms / 32 t | `sEyefish_turn` 533 ms / 32 t |
| `sMrStone_turn` 667 ms / 40 t | `sStoneman_turn` 700 ms / 42 t | `sLsbig_turn` 733 ms / 44 t | `sNosefish_turn` 833 ms / 50 t |
| `sWaterClown_turn` 1133 ms / 68 t | `sBigClown_turn` 1200 ms / 72 t | `sSpider_turn` 1433 ms / 86 t | `sSpacemama_turn` 1467 ms / 88 t |
| `sLssmall_turn` **1600 ms / 96 t** | `sPlayer_go_turn` 1667 ms / 100 t | | |

Median **700 ms / 42 ticks**; 13 of the 19 run at 30 fps. Compare our code: an enemy reaching
a ledge does `e.dir = (e.dir * -1)` on a single tick (`entities.ts:203`) and the renderer flips
the image instantly (`PaintScene.ts:296` `img.setFlipX(e.dir > 0)`). **We have no turn state at
all.** In the remake, a patrolling enemy changing direction is a readable, half-second event —
which for six-year-olds learning to time a jump is arguably *more* important than the attack
telegraph, because patrol turns happen constantly and attacks do not.

---

## 4 · Speed-type inventory, and the house rule it implies

**All 1,264 sprites use `FramesPerSecond`. Not one uses `FramesPerGameFrame`.** (`sprites.tsv`
column 4 — `{'FramesPerSecond': 1264}`.) The remake decoupled animation timing from the logic
tick entirely: art plays in *real seconds*, physics runs in ticks.

Speed values across the whole sheet, and across multi-frame sprites only:

| speed | all 1,264 | multi-frame only (951) | ticks per frame @60 Hz | ms per frame |
|---|---|---|---|---|
| 15 fps | 769 (61 %) | 517 | 4.00 | 66.7 |
| 30 fps | 394 (31 %) | 355 | 2.00 | 33.3 |
| 60 fps | 65 (5 %) | 55 | 1.00 | 16.7 |
| 20 fps | 20 | 13 | 3.00 | 50.0 |
| 10 fps | 8 | 7 | 6.00 | 100.0 |
| 5 fps | 5 | 2 | 12.00 | 200.0 |
| 1 / 16 / 31 fps | 1 each | 1 / 0 / 1 | — | — |

**Read the 61 % at 15 fps with suspicion — 15 is the engine's default playback speed.** The
evidence: 158 of the 159 `*parts` atlas sprites sit at 15 fps, and those are almost certainly
never played as timelines at all (§1.6); 313 sprites are single-frame, where speed is
meaningless. So "15 fps" mostly means *nobody set this value*.

The **deliberate** choices show up cleanly when you slice by action name:

| action | speeds actually used | reading |
|---|---|---|
| `walk` (22 strips) | 30 fps ×17, 60 fps ×5, **15 fps ×0** | locomotion is never slow |
| `hurt` (53) | 30 ×40, 60 ×9, 15 ×4 | impact runs at 30, escalating to 60 |
| `turn` (19) | 30 ×13, 15 ×5, 20 ×1 | 30 fps |
| `shoot` (22) | 30 ×17, 60 ×3, 20 ×1, 15 ×1 | 30 fps |
| `throw` (18) | 30 ×11, 60 ×6, 15 ×1 | 30, or 60 for a fast release |
| `jump` (25) | 30 ×18, 60 ×4, 15 ×3 | 30 fps |
| `idle` (66) | 15 ×35, 30 ×28, 60 ×3 | genuinely split — slow idles are a *choice* here |
| `stop` (7) | 30 ×4, 60 ×3 | fast |

And 60 fps is a *reserved* tier: of the 65 sprites at 60 fps, **23 are the player's core moves**
(walk, run, the whole fist chain, climb, ledge, hurt, duck, jump_spin, deathfall), and most of
the rest are **enemy hurt reactions** (`sLsbig_hurt`, `sLssmall_hurt`, `sLsflower_hurt`,
`sMoth_hurt`, `sStoneskops_hurt1/2`) and **fast enemy locomotion** (`sAntitoon_walk`,
`sStoneman_walk`, `sMrSax_walk`, `sNougatManWalk`, `sToybot_run`, `sSkops_walkback`).

The rare values are consistent with this: 20 fps is water and magic (`sWater`, `sWaterInk`,
`sWaterToy` 14f@20; `sBetilla_wakeup`/`_magic1/2/3`), 10 fps is bombs and pickups, and the only
5 fps *multi-frame* creature strip in the entire game is `sTentacle_move` (4f).

### 4.1 The house rule for our Phaser game (we run 60 Hz logic)

Our `anim.ts:6` picks frames by **ticks per frame** (`sheetFrame(ticks, frameCount,
ticksPerFrame)`), which is the right primitive — deterministic, no wall-clock, harness-safe.
The remake's fps values translate to our units exactly:

| our `ticksPerFrame` | equals | use it for |
|---|---|---|
| **1** | 60 fps | hero core moves; enemy hit-reaction; fast enemy locomotion |
| **2** | 30 fps | **the default for everything that acts** — walk, turn, jump, attack, shoot, throw, stop |
| **4** | 15 fps | slow/held idles, long ambient loops, breathing |
| 3 | 20 fps | water, magic, sparkle |
| 6 | 10 fps | thrown bombs, pickups |
| **12** | **5 fps** | **nothing in the studied remake — this is our current a/b flip** |

---

## 5 · Object taxonomy — how big is a full remake's cast?

`objects.tsv` holds **521 objects** (522 lines including the header). Parent chains (column 4)
group them:

| parent | count | what it is |
|---|---|---|
| `-` (no parent) | 399 | everything bespoke: bosses, NPCs, HUD, cameras, cutscene actors, pickups |
| `oEnemy` | **39** | the shared small-enemy base class |
| `oMovingParent` | 28 | moving platforms and rideables |
| `oBlockHalf` | 28 | terrain variants |
| `oBlockSlopeParent` | 6 | slopes |
| `oBlockHurt` | 6 | hazard terrain |
| `oBlock` 3 · `oBlockVine`, `oBlockParent`, `oBlockSlopeLeft/Left1/Left2/Right/Right1/Right2` 1 each | 11 | more terrain |
| `oPlayer`, `oFist`, `oPinkring`, `oLightbulb` | 1 each | player/fist variants |

**39 objects inherit from `oEnemy`** — that is the remake's declared small-enemy roster:
6 Antitoon variants (`oAntitoonWalk/Chomp/Dash/Fly/FlySquare/Fall`), 4 Livingstone variants
(`oLivingStoneBig/Small/Flower/Huge`), `oHunter`, `oSnare`, `oMoth`, `oMothCruel`, `oBadNote`,
`oRedbot`, `oNimbus`, `oStonedog`, `oStoneman1`, `oStonehead`, `oMagmaMan`, `oBrushboy`,
`oSpaceflyer`, `oSpacedasher`, `oSpider`, `oSpiderWalk`, `oJester`, `oToybot`, `oChessboy1`,
`oChessboy2`, `oToytrain`, `oWaterClown`, `oBigClown`, `oTntClown`, `oTntClownSuper`,
`oNougatman`, `oMegatoon`, `oMagicMinionWalk`, `oMagicMinionFly`. Bosses sit *outside* the
hierarchy (parent `-`), each hand-written.

### 5.1 Creature types per world (from the room walk, counts halved per §0b)

Counting only creatures (excluding spikes, lava balls, breakable platforms, cameras and
save-points, which my first pass over-collected):

| world | creature types | placements | of which unique to that world |
|---|---|---|---|
| Bandlnd (music) | 14 | 179 | 7 (`oBadNote`, `oMoth`, `oMothCruel`, `oNimbus`, `oRedbot`, `oSnare`, `oMrSax`) |
| Jungle | 13 | 121 | 8 (4 Livingstones, `oPiranha`, `oPiranhaSender`, `oTentacleman`, `oMoskito`) |
| Cake | 13 | 125 | 6 (`oWaterClown`, `oBigClown`, `oTntClown`, `oTntClownSuper`, `oNougatman`, `oBadcake`) |
| Toys | 13 | 196 | 6 (`oJester`, `oToybot`, `oToytrain`, `oChessboy1`, `oChessboy2`, `oChessmaster`) |
| Picturecity | 11 | 108 | 5 (`oBrushboy`, `oSpaceflyer`, `oSpacedasher`, `oRomama`, `oPirateship`) |
| Mountain | 9 | 71 | 4 (`oStoneman1`, `oStonehead`, `oStonedog`, `oMrStone`) |
| Caves | 8 | 52 | 3 (`oSpider`, `oMagmaMan`, `oSkops`) — 9 if the boss's chase form `oSkopsChase` is counted separately |
| Final | 7 | 172 | 1 (`oMegatoon`) |

**The structure is the lesson.** Only **3 creature types appear in all eight worlds**
(`oAntitoonWalk`, `oAntitoonChomp`, `oAntitoonFly`), with `oHunter` and `oAntitoonFall` in
seven of eight. So a world's roster is:

> **~4–5 shared universal grunts + 1 boss + 3–8 world-exclusive creatures = 7–14 types.**

The universal grunt is one *silhouette* re-skinned into six behaviours (walk / chomp / dash /
fly / fly-square / fall) — one art investment, six roles, present in every world.

### 5.2 Creature types per *level*, which is the number that matters for us

Across the 116 real levels that contain creatures (excluding the test room and the legacy
folder): **median 3 distinct creature types per level**, mean 3.41, range 1–9.

Histogram: 1 type → 16 levels · 2 → 27 · 3 → 23 · 4 → 20 · 5 → 13 · 6 → 11 · 7 → 3 · 8 → 2 ·
9 → 1. **86 of the 116 levels (74 %) use 4 creature types or fewer**, and only **17 (15 %)
place 6 or more.**

Our Painted Book chapter 1 runs 6 hostile roles (`chaser`, `gunner`, `flyer`, `bouncer`,
`crusher`, `swarm` — `entities.ts:200-283`) plus `guardian`. Against this data, **6 roles in one
chapter puts us in the top 15 % of a full remake's per-level creature density** — we are, if
anything, over-populated per screen, not under. The remake's answer to variety is not more
types per screen; it is the same silhouette re-skinned into more behaviours (§5.1) and a
different 3–8 world-exclusive set each world.

---

## 6 · Recommendations for the Painted Book

All numbers are in **ticks at 60 Hz** (our clock), with the millisecond equivalent, and each
cites the evidence it rests on.

**1 · Raise the enemy idle from 2 cells to 4, and the cell dwell from 12 ticks to 6.**
Our `entStateCell` flips `a`/`b` every 12 ticks (`PaintScene.ts:270`), which is **5 fps** — and
5 fps is a rate the studied remake uses for exactly one multi-frame creature strip in 1,264
sprites (`sTentacle_move`, 4f@5). The *cycle length* we chose is right: 2 cells × 12 ticks =
**400 ms**, which sits squarely in the remake's short-idle band (`sJester_idle` 433 ms,
`sAntitoon_idle` 533 ms, `sMoskito_idle` 533 ms, `sPest_idle` 600 ms). What is wrong is the
**resolution**. Keep the 400 ms feel and spend the art: **4 cells × 6 ticks/frame (10 fps)**,
or **6 cells × 4 ticks (15 fps, = 400 ms)**. `anim.ts:10`'s `bobFrame` already defaults to 24
ticks/frame — that default should move to 4 or 6, and `bobFrame` should take a frame count
instead of hard-coding 2.

**2 · Budget 5 states minimum per hostile role, 8 for the recurring ones, ~16 frames per
state.** Median across the 22 small enemies of §2.1: **5 state strips, ~16–18 frames each**. Our
`entStateCell` already emits 7 cell names (`a`, `b`, `telegraph`, `act`, `burst`, `shake`,
`dazed` — `PaintScene.ts:264-271`), so **our state count already matches the remake's median;
our gap is entirely frames-per-state (we have 1 cell where they have ~16).** Concretely, for a
Batch-AC-style commission: `idle` 4–6 cells · `walk` 4 cells · `turn` 3 cells · `telegraph`
4 cells · `act` 3 cells · `hurt/dazed` 2 cells ≈ **20–22 cells per creature**, against the
remake's ~90 frames for a mid-tier enemy. One-quarter of their budget, spent where a
procedural rig cannot fake it.

**3 · Keep our telegraph durations — the data validates them almost exactly.** Our numbers:
guardian **60 / 45 / 32** ticks for easy / medium / hard (`entities.ts:91-93`), gunner **30**
(`:224`), crusher **28** (`:271`), chaser **24** (`:212`), flyer **20** (`:243`). The remake's
per-attack telegraphs: `sToybot_notice` **32 t**, `sHunter_aim` **48 t**, `sSpider_lookback`
**62 t**, `sSpacedash_start` **70 t**, `sMrStone_anticipate` **80 t** (§3.1). Our easy tier
(60 t) sits between Spider and Spacedash; our hard tier (32 t) equals `sToybot_notice` to the
tick. **Recommended house band: 30–48 ticks (500–800 ms) for a small enemy, 60–80 ticks
(1000–1300 ms) for the guardian.** The two roles below the band — flyer at 20 t (333 ms) and
chaser at 24 t (400 ms) — should be **raised to 30 ticks**; 333 ms is under the shortest
per-attack telegraph in the whole remake.

**4 · Add a turn state. This is the biggest missing beat.** Nineteen creatures in the remake
own a dedicated `*_turn` strip, median **700 ms / 42 ticks**, cheapest **200 ms / 12 ticks**
(§3.3). We flip direction in one tick (`entities.ts:203`) and mirror the image instantly
(`PaintScene.ts:296`). Add a `turn` state of **18 ticks (300 ms)** — the value of
`sHoplite_turn` (9f@30), near the cheap end of the remake's range, whose floor is
`sMagicMinion_turn` at 12 ticks and whose median is 42 — with 2–3 art cells, entered on every
patrol reversal. For learners who are timing jumps against a patroller, a readable turn is worth
more than a longer attack telegraph, because patrol reversals happen every few seconds.

**5 · Lengthen the landing. Ours is 5× too short.** `RIG.landRecoverTicks: 6` (`rig.ts:38`) =
100 ms; the remake's `sPlayer_landing` is 15f@30 = **30 ticks / 500 ms**. Recommend **12–18
ticks (200–300 ms)** as the compromise — long enough to sell the squash (`RIG.landSquash`
sx 1.14 / sy 0.84, `rig.ts:37`), short enough not to eat platforming responsiveness for a
six-year-old. Also worth adding from the same table: a dedicated **skid-stop** of 20 ticks
(`sPlayer_run_stop` 10f@30) and an **air-to-fall transition** of 20 ticks (`sPlayer_tofall`
10f@30) — two cheap strips that the remake thought were worth having.

**6 · The pose program (20 modalities → pose cells): budget ~4–8 cells per modality, ~120
cells total, and make the cell INDEX the contract.** Two anchors from the data. First, the
remake spends **895 frames on 38 gameplay strips = median 23.5 frames per move** (§1.2) — but
that is *full-body* animation with no procedural rig. Our `rig.ts` computes in-betweens as
math (squash/stretch, hand ellipses, hair lag), so pose cells only need the **keys**: a
4–8 cell key set per modality × 20 modalities ≈ **80–160 cells**, i.e. roughly one-sixth of the
remake's per-move frame count, which is the correct discount for a rig that interpolates.
Second, and more important: the remake's own parts atlas is **150 cells at a fixed index
layout, re-painted identically across 24 costumes** (`sRayparts_basic` … `sRayparts_R2`, §1.6).
**Freeze a cell-index map before commissioning art, and every future skin is a drop-in
re-paint.** Our AC card kit already works this way (cell→stem map, `resolvePaintArt()`
auto-scan) — this is external confirmation, and the number to aim at for the whole hero is
**~150 cells**, not thousands.

**7 · Where to *not* spend: allocate ~20 % of the hero budget to idle personality anyway.**
Half the remake's 1,796 hero frames are non-gameplay: **24 % idle personality, 26 %
win/cutscene** (§1.2), including a single 190-frame / 6.3-second bored-idle
(`sPlayer_idle_special2`). This is the one place a "modern game feel" remake was most generous.
For us the cheap version is: **one 6-cell "bored" idle that triggers after ~300 ticks (5 s) of
no input**, plus the victory pose we already need. Two strips, and the hero stops looking like
a puppet between tasks. (The same logic applies to enemies: `sMoskito_cry` is 142 frames and
`sLsbig_scared` is 28 — our redeemed / consoled beat deserves more than an alpha change.)

**8 · Adopt the three-tier rate law in `anim.ts`, and drop `FramesPerGameFrame` thinking.**
The remake runs **100 % of its 1,264 sprites in real seconds, never in game frames** (§4).
Translated to our `sheetFrame(ticks, frameCount, ticksPerFrame)` primitive: **`ticksPerFrame:
1` (60 fps) for hero core moves and hit reactions; `2` (30 fps) as the default for anything
that acts — walk, turn, attack, shoot, jump, stop; `4` (15 fps) for slow held idles and
ambient loops.** These should be named constants in `anim.ts` (e.g. `TPF = { impact: 1, act: 2,
idle: 4 }`) rather than magic numbers at each call site, and the current `12` should not
survive the change.

---

## 7 · Loose ends worth a follow-up

- **§1.6 is an inference, not a fact.** The parts-atlas reading rests on naming, cell counts,
  default playback speed, and absence from `objects.tsv`. It could be confirmed without ever
  viewing an image by dumping the game's *code* strings for `draw_sprite`/index arithmetic
  against `sRayparts_*`; `strings.txt` is already on disk in the same dump.
- **Our run-cycle ambiguity (§1.5)** — resolve whether `RIG.runCycleTicks: 16` is a full
  two-step cycle or one step before art is commissioned. The target is 32 ticks per full cycle.
- **`sPlayer_walk` and `sPlayer_run` have nearly identical cycle durations** (32 vs 31 ticks).
  If we ever add a distinct walk to the Painted Book, the differentiation should come from
  ground covered per cycle, not from cadence.
- The remake carries **five separate hurt-reaction rates** across the enemy roster (15/30/60
  fps) — worth checking whether tier (easy/medium/hard) correlates with hit-reaction speed,
  which would be a free difficulty-legibility trick.
