I have now read all four assigned core files completely (CK_GAME.C, CK_MAIN.C, CK_DEMO.C, CK_TEXT.C) plus the world-map/level-entry logic in CK_KEEN2.C, CK_KEEN.C, CK_PLAY.C, and the K4 SPEC/DEF files. 

Note on delivery: my session is in strict read-only mode and my standing instructions forbid writing report `.md` files — I must return findings directly as my final message (the parent agent reads this text, not a file). So the full exhaustive report is delivered inline below rather than written to `study/keen-metagame.md`.

---

# 10-LINE SUMMARY

1. **Hub = "level 0" map** loaded like any level; `mapon==0` triggers `PatchWorldMap` (CK_GAME.C:470-473), which reads info-plane tags to erase blocking tiles on completed levels and spawn celebration flags.
2. **Level entry** is a *walk-onto-tile + press action*: `CheckEnterLevel` (CK_KEEN2.C:536) reads info `0xC001..0xC012`, sets `gamestate.mapon`, fires `playstate=ex_completed` to leave the hub *into* the level.
3. **Completion writes back** `gamestate.leveldone[mapon]=true` and `levelcompleted=mapon`, then forces `mapon=0` to return to hub (CK_GAME.C:954-969); the done-flag animation (`SpawnThrowFlag`) plays only for the just-finished level.
4. **Death** decrements `lives`, shows a 2-choice "Try Again / Exit to worldmap" menu (`HandleDeath`, CK_GAME.C:694), and restarts the level *from scratch* (no checkpoints); `lives<0` → GameOver → high-score.
5. **Reward ladder** `bonuspoints[]={0,0,0,0,100,200,500,1000,2000,5000,1UP,ammo}` (CK_KEEN.C:206); the score→life loop doubles `nextextra` each award (20k→40k→80k…, CK_PLAY.C:1896).
6. **Two extra-life economies**: point thresholds *and* 100 lifewater drops = 1 life (`GiveDrop`, CK_KEEN.C:1991); ammo per clip is difficulty-scaled `{-,8,5,5}` (CK_KEEN.C:195).
7. **Save/load** RLE-compresses 3 map planes + dumps the whole object linked-list after the `gamestate` struct (CK_GAME.C:130-310).
8. **Demos are deterministic** via a fixed RNG seed (`US_InitRndT(false)`) and forced Normal difficulty (CK_GAME.C:445-449); any keypress aborts playback.
9. **Narrative** is delivered through the CK_TEXT.C layout interpreter (`^P/^G/^C/^L` markup) for F1 help/story pages, the Star-Wars intro crawl, and the `FinaleLayout` ending.
10. **Difficulty** filters enemy spawns at scan time (info 5/49/50 = all/Normal+Hard/Hard-only) and sets ammo-per-clip — a pure content-gating dial, not a stat multiplier.

**Report path requested:** `/private/tmp/claude-501/.../scratchpad/study/keen-metagame.md` — *not written* (read-only mode); full contents follow inline.

---

# keen-metagame.md — Commander Keen 4-6 Meta-Game Study

> **Provenance / clean-room statement:** This report documents *behavior and numeric design* only, derived by reading the K1n9_Duk3 GPL reconstruction of the CK4-6 Galaxy engine. **Zero source code is to be copied** into the TypeScript/Phaser EFL reimplementation. All snippets below are cited for understanding; reimplement from the described behavior, not the text.

---

## 1. THE WORLD MAP HUB

### 1.1 The hub is just "level 0"
The world map is not special-cased as a separate scene — it is map index **0**, loaded through the identical `SetupGameLevel` path as any action level (CK_GAME.C:440-510, `CA_CacheMap(gamestate.mapon)` at :458). The engine branches on `mapon==0` in exactly three places: to patch the map (:470), to pick the world-Keen scroll/centering rule (CK_PLAY.C:1363, :2287-2294, :2327-2338), and to select the world-walk actor instead of the platform actor. **Takeaway for EFL:** build the hub with the same tile/entity system as lessons; only the player-controller and the "enter" interaction differ.

### 1.2 Info-plane encoding of the map
Every tile position carries a 16-bit **info-plane** word (`mapsegs[2]`). On the world map this word is a packed `(tag<<8)|level` (CK_GAME.C:356-357):
- **low byte = level number** the tile belongs to (1..17 = `MINDONELEVEL`..`MAXDONELEVEL`, K4_DEF.H:58-59).
- **high byte = tag**: `0xC0` = a blocking square to remove when done; `0xD0` = also clear the *foreground* tile in plane 1; `0xF0` = spawn a completion flag.

### 1.3 PatchWorldMap — what completion writes back to the map
`PatchWorldMap` (CK_GAME.C:345-384) runs after `ScanInfoPlane` whenever `mapon==0`. For every tile whose level is done (`gamestate.leveldone[level]`):
```
tag = info >> 8;
*infoptr = 0;                       // clear the info word (see BUG note)
if (tag == 0xD0) mapsegs[1][planeoff] = 0;   // erase the blocking wall tile
else if (tag == 0xF0) { levelcompleted==level ? SpawnThrowFlag : SpawnFlag }
```
So **finishing a level physically opens the map** (removes the wall that blocked the path onward) and **plants a flag** at the level's door. There is a documented BUG (CK_GAME.C:361): the info word is zeroed for *all* tags, when it should only zero on `tag==0xC0`. Reimplement the intended behavior.

### 1.4 The map-Keen actor and its states
Map travel is a dedicated 8-direction free-roam controller, entirely separate from the platforming Keen:
- **States** (CK_KEEN2.C:415-433): `s_worldkeen` (idle; after 360 tics it plays an idle "wave" animation `s_worldkeenwave1..5`), `s_worldkeenwalk` (moving), plus K4 `s_worldswim` and K5 `s_worldelevate`.
- **Direction/animation tables:** `worldshapes[8]` maps the 8 compass directions to sprite bases; `worldanims[4]={2,3,1,3}` is the 4-frame walk cycle (CK_KEEN2.C:432-433). Footstep SFX alternate on frames 1 and 3 (`SND_WORLDWALK1/2`, CK_KEEN2.C:615-622).
- **Think logic:** `T_KeenWorld`/`T_KeenWorldWalk` (CK_KEEN2.C:565-623) read `c.xaxis/c.yaxis` (8-way), set `ob->temp1=c.dir`, and call `CheckEnterLevel` when jump/pogo/fire is pressed.
- **Spawned by** info value **3** in `ScanInfoPlane` (K4_SPEC.C:340-345 → `SpawnWorldKeen`, CK_KEEN2.C:449). On first entry Keen stands at the tile; after returning from a level he is restored to the saved `gamestate.worldx/worldy` (CK_KEEN2.C:480-489).

### 1.5 Entering a level (the door / info tile)
`CheckEnterLevel` (CK_KEEN2.C:536-555) scans the tiles Keen overlaps; if an info word lies in `(0xC000, 0xC000+18]`:
```
gamestate.worldx = ob->x; gamestate.worldy = ob->y;   // remember hub position
gamestate.mapon  = info - 0xC000;                      // which level
playstate = ex_completed;                              // leave hub
SD_PlaySound(SND_ENTERLEVEL);
```
Note the reuse of `ex_completed` as "leave the current map" — leaving the hub and finishing a level share the exit code; `GameLoop` disambiguates on `mapon` (`mapon!=0` = finished a level; `mapon==0` = left the hub into a level, CK_GAME.C:958). **EFL:** a "classroom door" tile stores the target lesson id in a parallel data plane; stepping on it + confirm loads that lesson.

### 1.6 Completion flags (the visible done-markers)
- `SpawnFlag` (CK_KEEN2.C:1174) plants a static waving flag (`s_flagwave1..4`, 4-frame loop) on every already-done level when the map loads. In K6 it also swaps the pole tile to a "flag-up" graphic (CK_KEEN2.C:1197-1199).
- `SpawnThrowFlag` (CK_KEEN2.C:1214-1263) is the **celebratory** version used for the level *just* completed: the flag is tossed from Keen's saved world position along a precomputed 30-point parabolic arc (`flagpath[]`, spin SFX, landing SFX) and settles onto the pole (`s_throwflag0..6` → `FlagAlign`). K5 has no throw flag (uses plain `SpawnFlag`).
- The choice is made in `PatchWorldMap`: `levelcompleted==level ? throw : static`. This is the single most stealable juice moment — **a visible, animated "you did this" marker that persists on the hub.**

### 1.7 Teleporters and elevators (K5/K6 map travel)
Detected via info-tile types in `CheckWorldInTiles` (CK_KEEN2.C:1051-1134):
- **Teleporter** (K5+K6, `Teleport`, CK_KEEN2.C:702-825): enter animation (Keen shrinks into pad, `SND_TELEPORT`, tiles cycle `TELEPORTERTILE1..2`), destination coords read from the info word (`tileX=tile>>8; tileY=tile&0x7F`), Keen dropped in at the target with an exit animation, and nearby dormant flags are force-activated so the new region draws correctly (CK_KEEN2.C:788-798).
- **Elevator** (K5 only, `Elevator`+`T_Elevate`, CK_KEEN2.C:938-1037): Keen walks into a car, doors close (2×2 tile animation), Keen is teleported invisibly (`cl_noclip`) and rides `s_worldelevate` to the destination, doors open, Keen walks out. This is a *narrative-flavored* teleporter — same effect, richer animation.

### 1.8 Optional vs required, and secret levels
- **Required gating is topological, not flag-checked:** the map is a physical maze; a level is "required" only insofar as its `0xC0/0xD0` block sits on the sole path forward. Completing it erases the block (§1.3). There is no explicit prerequisite list — **the level geometry encodes the progression graph.**
- **Optional levels** simply have no blocking square gating anything beyond them (e.g., pure bonus rooms). The engine does not distinguish them.
- **Secret level entry (K4):** the flying **Foot** (`ex_foot`, CK_KEEN.C:1795). Touching the Foot warps Keen airborne across the map to a secret area; `SpawnWorldKeen` handles the `ex_foot` case by launching Keen on a scripted flight (`s_keenonfoot1`, `T_FootFly`, CK_KEEN2.C:634-653) toward hardcoded coordinates, bypassing normal walls. K4 also gates the water route behind the **wetsuit** item + shore tiles (`CheckWorldInTiles`, CK_KEEN2.C:1061-1112): no wetsuit → `CantSwim` bounce-back.
- **K5 secret exit:** a level's door whose info word is 0 sends `ex_portout` (CK_KEEN.C:886-892) rather than normal completion.

---

## 2. LEVEL COMPLETION & DEATH FLOW

### 2.1 The meta-loop: GameLoop
`GameLoop` (CK_GAME.C:800-1008) is the whole session state machine, built on labels/goto:
```
reset:  gamestate.difficulty = restartgame; ...
  do { startlevel: SetupGameLevel(true); ...
       loaded:     PlayLoop();                 // one level or the hub
                   switch (playstate) { ... }
     } while (gamestate.lives >= 0);
  GameOver(); check_score: CheckHighScore(...);
```
`PlayLoop` (CK_PLAY.C:2180-2418) runs one map until `playstate != ex_stillplaying`, then `GameLoop` dispatches.

### 2.2 The exit codes (`exittype`, CK_DEF.H:122-139)
`ex_stillplaying, ex_died, ex_completed, ex_rescued(K4), ex_warped, ex_resetgame, ex_loadedgame, ex_foot(K4), ex_abortgame, ex_sandwich/hook/card/molly(K6), ex_portout/fusebroke/qedbroke(K5)`.

### 2.3 Completion path
`ex_completed | ex_foot | ex_portout` (CK_GAME.C:954-985): if `mapon!=0` (a real level) → `SND_LEVELDONE`, `gamestate.mapon=0` (**always returns to hub**), `levelcompleted=mapon`, `gamestate.leveldone[mapon]=true`. If `mapon==0` (left the hub) → just shows "One moment" and proceeds to load the chosen level. **There is no "next level" pointer — completion always deposits you back on the hub**, and the hub's newly-opened geometry guides you onward. Story-specific completions (`ex_rescued` K4 rescues a council member and checks for all 8; `ex_fusebroke` K5; `ex_hook/sandwich/card` K6 collect story items) each mark `leveldone` and return to hub, with the final one triggering `FinaleLayout` + high score (CK_GAME.C:892-953).

### 2.4 Death path & the restart-from-start rule
`ex_died` → `HandleDeath` (CK_GAME.C:694-786): clears keys, `gamestate.lives--`. If `lives>=0`, shows a flashing 2-option box **"Try Again" / "Exit to `WORLDMAPNAME`"** over the message *"You didn't make it past <level name>"*. Escape or selecting "Exit" sets `gamestate.mapon=0` (back to hub, forfeiting the level); "Try Again" leaves `mapon` unchanged. Control returns to `GameLoop`'s `do…while`, which calls `SetupGameLevel(true)` again — **the level reloads completely from its start; there are no mid-level checkpoints.** All collected keys are wiped (CK_GAME.C:701, and again at :856). If `lives<0`, the loop exits to `GameOver`.

### 2.5 Lives economy & Game Over
- Start: **3 lives** (`NewGame`, CK_GAME.C:88-94). Note lives is signed and the loop continues while `lives>=0`, so you actually get "0" as a playable last life.
- `GameOver` (CK_GAME.C:107-115): a 4-second "Game Over!" window (K5 defines its own variant).
- Then `CheckHighScore` (CK_DEMO.C:2066-2114): inserts into `Scores[]` sorted by score, then by `completed` count as tiebreak; if it places, it loads the high-score map, lets the player type their name inline (`US_LineInput`). K4's `completed` = council members rescued; K6 = count of `leveldone[]` set (CK_GAME.C:1000-1007).
- Scores are rendered by `DrawHighScores` (CK_DEMO.C:2012-2054); K4 draws a little tile per rescued member next to each entry.

---

## 3. THE FULL REWARD ECONOMY

### 3.1 The bonus ladder
`bonuspoints[]` and `bonussprite[]` (CK_KEEN.C:206-225), indexed by a pickup's `temp1`:

| index | item | points | side effect |
|---|---|---|---|
| 0-3 | keys/gems (4 colors) | 0 | `gamestate.keys[i]++` |
| 4 | sugar/point item | 100 | — |
| 5 | " | 200 | — |
| 6 | " | 500 | — |
| 7 | " | 1000 | — |
| 8 | " | 2000 | — |
| 9 | " | 5000 | — |
| 10 | 1-UP | 0 | `gamestate.lives++` |
| 11 | ammo clip | 0 | `gamestate.ammo += shotsinclip[difficulty]` |
| 12 (K5) | keycard | 0 | `gamestate.keycard=true` |

Pickups arrive two ways: as sprite actors (`KeenContact`/`bonusobj`, CK_KEEN.C:1708-1755) and as info-tiles (`TileBonus`, CK_KEEN.C:1950-1976); both call `GivePoints` and the same side-effect switch. Every pickup rises off-screen (`s_bonusrise`) as feedback.

### 3.2 The score→life loop (nextextra doubling)
`GivePoints` (CK_PLAY.C:1896-1905):
```
gamestate.score += points;
if (!DemoMode && score >= nextextra) { lives++; nextextra *= 2; }
```
Starting `nextextra=20000` (CK_GAME.C:91) yields extra lives at **20k, 40k, 80k, 160k, 320k, …** (comment at CK_PLAY.C:1891). This is the classic "score is not vanity — it buys survival" loop. Disabled in demos so playback is deterministic.

### 3.3 Lifewater drops — the second life currency
`GiveDrop` (CK_KEEN.C:1986-2006): each drop plays a splash, `++gamestate.drops`; **at 100 drops → drops resets to 0, `lives++`, `SND_EXTRAKEEN`**, and a "100-UP" sprite rises. A parallel, collection-based extra-life track independent of score. `drops` is shown in the score box as "DROPS" (K4) — a visible 0-99 progress counter toward the next free life. **Extremely stealable for EFL: "collect 100 stars → bonus."**

### 3.4 Ammo economy per difficulty
`shotsinclip[4] = {0, 8, 5, 5}` indexed by difficulty (CK_KEEN.C:195): **Easy grants 8 shots per clip, Normal & Hard 5.** Start ammo = 5 (CK_GAME.C:93). Firing: `SpawnShot` (CK_KEEN2.C:1351-1359) refuses at `ammo==0` (plays a dud sound) else `ammo--`. So Easy mode is materially more forgiving on the one consumable resource.

### 3.5 The score box (status window)
`DrawStatusWindow` (CK_PLAY.C:991-1148), shown on demand via a scroll-in/out animation (`ScrollStatusWindow`, CK_PLAY.C:~1300). Fields: **LOCATION** (current level name), **SCORE**, **EXTRA** (= `nextextra`, i.e. the next-life target is shown to the player), **LEVEL** (difficulty word), **KEYS** (4 colored icons), **AMMO**, **KEENS** (lives), **DROPS**. Per-game extras: K4 **RESCUED** row + **Wetsuit** indicator; K5 **KEYCARD**; K6 **ITEMS** (sandwich/hook/passcard icons). Showing the *next extra-life threshold* on the HUD is a deliberate motivational nudge.

---

## 4. SAVE/LOAD, DEMOS, AND NARRATIVE TEXT

### 4.1 Save/load model
`SaveTheGame` (CK_GAME.C:130-164): writes the entire `gametype` struct (score, lives, ammo, drops, `leveldone[]`, keys, mapon, difficulty, worldx/y, per-game story flags — CK_DEF.H:320-341), then RLE-compresses the **3 map planes** (`CA_RLEWCompress`, tag `0xABCD`), then dumps **every object** in the linked list verbatim. `LoadTheGame` (CK_GAME.C:176-310) reverses it: reads gamestate, re-runs `SetupGameLevel(false)` to rebuild the level, expands the planes, rebuilds the object list, and nulls out live pointers (sprites, riding). Save = full world snapshot, so you resume mid-level, not just mid-hub. K5 preserves `numfuses` across the reload because `ScanInfoPlane` would otherwise reset it (CK_GAME.C:189-195, 306-308). Two annotated memory-manager BUGs at :214-216.

### 4.2 Demo system & determinism
- **Record:** `StartDemoRecord`/`EndDemoRecord` (CK_GAME.C:624-682) — pick a level 0-21, play, then save `DEMO?.<ext>` containing `mapon`, buffer length, and the raw recorded control stream. Debug key **D** toggles recording (CK_PLAY.C:530-542).
- **Playback:** `RunDemo` (CK_DEMO.C:1974-2000) caches the `DEMO0..4` graphics chunk (demos ship *inside* the graphics archive), reads `mapon` from `demodata[0]`, feeds the byte stream to `IN_StartDemoPlayback`, and runs `PlayLoop`.
- **Determinism** rests on two things (CK_GAME.C:445-453): in demo mode the RNG is seeded with a **fixed** value (`US_InitRndT(false)`) and **difficulty is forced to `gd_Normal`**. Combined with recorded inputs, the run replays identically. Any real user input aborts to `ex_completed` (CK_PLAY.C:2383-2392). The attract loop (`DemoLoop`, CK_MAIN.C:331-431) cycles title → demo0 → intro-crawl → demo1 → high scores → demo2 → demo3.

### 4.3 Story/help text as narrative delivery (CK_TEXT.C)
CK_TEXT.C is a small **markup interpreter** for full-screen text pages (grammar at CK_TEXT.C:28-36): `^P` new page, `^E` end, `^G y,x,pic` inline graphic that pushes text margins (CK_TEXT.C:274-321), `^C<hex>` text color, `^L x,y` locate, `^B` filled bar, `^T` timed picture reveal. `PageLayout` (CK_TEXT.C:454-551) word-wraps around embedded pictures and paints a windowed frame with "pg N of M".
- **Help/story menu** (`HelpScreens`/`HelpMenu`, F1, CK_TEXT.C:654-859): a hand-cursor menu over layouts `T_HELPART, T_CONTRART, T_STORYART, T_ORDERART, T_IDART` — **the story is one selectable page-set**, browsable with arrows/PgUp/PgDn.
- **Ending** (`FinaleLayout`, CK_TEXT.C:872-971): auto-advancing story pages with a flashing "next" arrow and ending music; K5 branches on `leveldone[13]==ex_fusebroke` for an alternate ending (CK_TEXT.C:885-898).
- **Intro crawl** (`StarWars`, CK_DEMO.C:1872-1911): a scaled scrolling narrative text over a starfield — pure story-setting. **For EFL, this markup engine is a ready pattern for illustrated instruction/story screens.**

---

## 5. DIFFICULTY SELECTION — META-LEVEL EFFECTS

Difficulty (`gd_Easy/Normal/Hard`) is chosen in the control panel and delivered via `restartgame` into `gamestate.difficulty` at loop start (CK_GAME.C:823-824; TED launch path parses `easy/normal/hard` parms, CK_MAIN.C:333-354). Its effects are deliberately *content-shaped*, not stat-multiplied:
1. **Enemy population filter** — `ScanInfoPlane` uses paired info values: base value = spawn on all difficulties; a `+44/+46` or `+49/+51/+52` variant spawns **only on Normal+Hard**, and the highest **only on Hard** (K4_SPEC.C:352-388, the `if (difficulty < gd_Hard) break; case ...: if (difficulty < gd_Normal) break;` fall-through chain). Harder difficulty literally places *more* enemies, authored per-tile by the level designer.
2. **Ammo generosity** — `shotsinclip` Easy=8 vs Normal/Hard=5 (§3.4).
3. **HUD** shows the difficulty word (CK_PLAY.C:1076-1087).
4. **Demos** force Normal for determinism (§4.2).
There is no health bar to scale and no timer; difficulty = enemy density + resource generosity. **This is the cleanest possible difficulty model for a school game: author easy/normal/hard variants of each obstacle set on the same map, gate by a single enum.**

---

## 6. CLOSING — THE 8 META-GAME STRUCTURES WORTH STEALING FOR A SCHOOL-WORLD EFL GAME (ranked)

1. **Hub map with persistent, visible done-flags.** A single overworld where each completed lesson erases its blocking wall (§1.3) and plants an animated flag (§1.6). The map *is* the progress bar and the level-select — no separate menu. Highest ROI: it makes progress spatial, legible, and celebratory. (CK_GAME.C:345, CK_KEEN2.C:1174/1214)
2. **The score→extra-life doubling loop.** Points are a real currency that buys retries at 20k/40k/80k… and the *next threshold is shown on the HUD* (§3.2, §3.5). For EFL: XP that buys hints/lives with a visible "next reward at N" nudge. (CK_PLAY.C:1896)
3. **Second collection currency (100 drops = 1 life).** A parallel, tangible "collect 100 → bonus" track independent of skill/score (§3.3) — perfect for "collect 100 vocabulary stars." (CK_KEEN.C:1986)
4. **Topological gating instead of prerequisite lists.** Progression is encoded in map geometry: finishing the right level opens the only path onward, with optional side-levels off the critical path (§1.8). Reimplement as a small graph where completion unlocks edges. (CK_GAME.C:356-380)
5. **Restart-from-level-start with a dignified death menu.** On failure: "Try Again / Exit to map," full reload, keys reset, no checkpoints (§2.4). Low-stakes, low-frustration retry loop that keeps the hub as the safe home. (CK_GAME.C:694)
6. **Difficulty as content-filter, not stat-multiplier.** One enum gates *which* obstacles/enemies spawn per tile and how generous resources are (§5). Author three densities of a lesson's challenge on the same map. (K4_SPEC.C:352, CK_KEEN.C:195)
7. **Secret/optional destinations (Foot flight, teleporters).** A hidden warp that flies the player to a bonus region rewards exploration and mastery (§1.7-1.8) — a "secret challenge room" for advanced students. (CK_KEEN2.C:634, 702)
8. **Markup-driven story/help/finale screens.** A tiny `^P/^G/^C/^L` text-layout interpreter delivers all narrative, instructions, and the ending as data, not code (§4.3) — ideal for authoring illustrated EFL instruction and reward pages without new engine work. (CK_TEXT.C:214-551, 872)

*(Runner-up worth noting: the full-snapshot save model (§4.1) and deterministic-demo attract mode (§4.2) — the latter doubles as a "watch a worked example" feature for a teaching game.)*

---

**Files read in full:** CK_GAME.C (1008), CK_MAIN.C (531), CK_DEMO.C (2133), CK_TEXT.C (971). **Cross-referenced:** CK_KEEN2.C (world-Keen actor, teleporter/elevator, flags), CK_KEEN.C (reward tables, pickups, drops, death, door-entry), CK_PLAY.C (PlayLoop, GivePoints, score box, cheats, scroll/completion), CK_DEF.H (gamestate/exittype), KEEN4/K4_SPEC.C (ScanInfoPlane, level-name & enter-text arrays), KEEN4/K4_DEF.H (MINDONELEVEL/MAXDONELEVEL, WORLDMAPNAME, HIGHSCORE_MAP). Per-game deltas for K5/K6 noted inline throughout.