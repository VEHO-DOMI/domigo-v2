I have now read all assigned files completely (ID_CA.C/H, ID_RF.C/H, ID_IN.C/H, ID_US_1.C, ID_US.H, ID_SD.H) plus the load-bearing interfaces (ID_US_A.ASM for the random table, ID_RF_A.ASM for the tile-blit routines, ID_SD.C for the 70Hz timer, CK_KEEN2.C for the scorebox model).

One constraint note first: I operate in read-only mode and have no file-writing tool, so I cannot create `/study/keen-id-engine.md` myself. The full report is delivered inline below (the parent agent reads this text). It is written so it can be saved verbatim to that path.

---

# Commander Keen 4–6 (Galaxy / "ID" Engine) — Engine Study for a Phaser/TS Reimplementation

**Provenance / clean-room statement:** This report is a *behavioral* description derived from reading the K1n9_Duk3 reconstruction of the Keen 4–6 source (GPLv2, itself based on the Catacomb 3-D release). It documents *what the engine does and why*, in numbers and prose, so a from-scratch TypeScript/Phaser implementation can match feel. **Zero code is copied**; snippets are avoided (one short quote budget, unused). All line citations are to the files under `keen4-6/KEEN4-6/`.

---

## 1. LEVEL FORMAT (ID_CA — Caching Manager)

### 1.1 File set and the three-plane TED5 model
Keen maps are authored in TED5 and shipped as two files: a header/dictionary blob (`MAPHEAD.EXT`, linked into the EXE via `MAPHEADERLINKED`, `ID_CA.C:930`) and the tile data (`GAMEMAPS.EXT`, `ID_CA.C:938`; the editor-writable variant is `MAPTEMP.EXT`, `ID_CA.C:942`). There are **`NUMMAPS` = 30** map slots and **`MAPPLANES` = 3** planes per map (`ID_CA.H:49–50`).

The header, once located, is a `maptype` (`ID_CA.H:78–84`): `long planestart[3]`, `unsigned planelength[3]`, `unsigned width,height`, `char name[16]`. So each of the three planes is independently offset and length-prefixed inside `GAMEMAPS`, and the map is `width × height` tiles.

The three planes are:
- **Plane 0 — background** (`mapsegs[0]`): the visible scenery tile behind everything. Every non-negative tile is marked for caching and drawn (`RF_MarkTileGraphics`, `ID_RF.C:537–607`).
- **Plane 1 — foreground** (`mapsegs[1]`): masked tiles that draw *over* sprites (see §2.7). Marked from `STARTTILE16M` (`ID_RF.C:620`).
- **Plane 2 — info** (`mapsegs[2]`): TED5 "info" plane. In Keen it carries object-spawn codes for the game layer, and — critically for the renderer — it is *overwritten at load time* to hold a near-pointer into `allanims[]` for any animating tile (`ID_RF.C:562, 576, 652`). Consequence (documented at `ID_RF.C:512–518`): **a single map cell cannot have both an animating foreground and an animating background tile**, because the info word is reused to point at one animation chain.

### 1.2 The `tinf` tile-info tables
`tinf` is one linear byte array (the tail of `MAPHEAD`, a `mapfiletype`: `unsigned RLEWtag; long headeroffsets[100]; byte tileinfo[]`, `ID_CA.C:59–64`). Fixed byte offsets index parallel tables (`ID_CA.H:61–73`):

- Background tiles (`TILEINFO`): `SPEED = 402`; `ANIM = SPEED + NUMTILE16`.
- Foreground / masked tiles (`TILEINFOM`): `NORTHWALL`, then `EASTWALL`, `SOUTHWALL`, `WESTWALL` (each `+NUMTILE16M`), then `MANIM`, `INTILE`, `MSPEED`.

Semantics:
- **NORTHWALL / EASTWALL / SOUTHWALL / WESTWALL** — per-tile, per-edge solidity flags used by the game's clipping/collision layer (foreground plane). A Phaser port models these as a 4-bit collision mask per foreground tile ("can you pass through the N/E/S/W face").
- **ANIM / MANIM** — a *signed* byte giving the tile-number delta to the next animation frame (`(signed char)tinf[ANIM+tile]`, `ID_RF.C:584, 660, 931, 938`). `0` = not animated. The sequence walks `tile += delta` until it loops back to the start tile.
- **SPEED / MSPEED** — the per-frame dwell time in *tics* (the 70 Hz game tic; see §2.9). A tile advances when its countdown drops below 1.
- **INTILE** and **MISCFLAGS**-type bytes — auxiliary per-tile info consumed by the game layer (e.g. `INTILE`), not the renderer.

### 1.3 Compression pipeline (how a map is decoded)
`CA_CacheMap(mapnum)` (`ID_CA.C:1615–1713`) is the reference decoder. Per plane whose `planelength != 0`:
1. Seek to `planestart[plane]`, read `planelength` compressed bytes into either a shared scratch buffer (`bufferseg`) if `≤ BUFFERSIZE`, or a temporary locked allocation otherwise (`ID_CA.C:1677–1686`).
2. **Carmack-expand** first (LZ-style with near/far back-references; tags `0xA7`/`0xA8`, `ID_CA.C:559–618`). The Carmack chunk is prefixed by a 2-byte expanded length (`ID_CA.C:1694`).
3. **RLEW-expand** the Carmack output (word-level run-length; the run tag is `mapfiletype.RLEWtag`, `ID_CA.C:687–793, 1698`). The RLEW chunk *also* carries its own leading expanded-length word, which is skipped (`ID_CA.C:1698`, source `+1`).
4. Final expanded size is `width * height * 2` bytes = one 16-bit tile index per cell (`ID_CA.C:1663`).

The unlinked/editor path (`MAPTEMP`) is RLEW-only, no Carmack (`ID_CA.C:1706`). A Phaser port that reads original data must implement both Carmack and RLEW; if you author your own JSON/Tiled maps you can skip both, but keep the **2 bytes-per-cell, three separate planes** shape.

### 1.4 Map dimensions and limits
- Header offset table `headeroffsets[100]` (`ID_CA.C:60`), so up to 100 map-file entries though only 30 map slots are tracked. `pos < 0` ⇒ sparse/non-existent map ⇒ `Quit` (`ID_CA.C:1646–1648`).
- **Max map height** is `MAXMAPHEIGHT` = 200 (Keen 4/6) or 250 (Keen 5) (`ID_RF.H:51–59`); enforced in `RF_NewMap` (`ID_RF.C:418`). No explicit max width beyond the 64 KB segment limit (a plane is `width*height*2` bytes and must fit under 64 KB, i.e. `width*height ≤ 32768`).
- Maps are **always reloaded, never cached** across visits — plane pointers are freed and re-read every `CA_CacheMap` (`ID_CA.C:1633–1635, 1659–1660`). Only the small map *header* is kept purgeable.

### 1.5 Graphics caching model (conceptual)
Graphics chunks (tiles, sprites, pics) live in `EGAGRAPH.EXT`, indexed by 3-byte file offsets (`THREEBYTEGRSTARTS`, `ID_CA.C:143–161`); `0xFFFFFF` = sparse. Caching is **mark-then-sweep by "level bit"**:
- `grneeded[NUMCHUNKS]` is a byte bitmask; `CA_MarkGrChunk(chunk)` OR-s in `ca_levelbit` (`ID_CA.H:146`).
- `RF_MarkTileGraphics` walks planes 0/1 and marks every tile plus every frame of every animation chain (`ID_RF.C:521–684`).
- `CA_CacheMarks(title)` loads all chunks whose needed-bit is set and frees (marks purgeable, purge level 3) those that aren't (`ID_CA.C:2019–2150`). It coalesces adjacent disk reads (up to `MAXEMPTYREAD = 1024` gap, within `BUFFERSIZE`, `ID_CA.C:2098–2115`) — a disk-seek optimization irrelevant to a web port.
- `CA_UpLevel`/`CA_DownLevel` shift `ca_levelbit` (max 8 nested levels, `ID_CA.C:1728–1757`) so menu/help graphics can be cached "on top of" gameplay graphics and dropped on exit.
- Sprites are decompressed *and pre-shifted* at cache time: EGA builds up to 4 horizontally shifted copies (`CAL_CacheSprite`, `ID_CA.C:1298–1415`) for smooth 2-pixel panning; CGA needs none. A Phaser port ignores shifting entirely (GPU handles sub-pixel position) — this is a pure DOS/EGA artifact.

**Port takeaway:** model a level as three integer tile arrays (`bg`, `fg`, `info`) of `width×height`, plus a `tinf`-equivalent lookup keyed by tile id giving `{animDelta, animSpeed, edges:{n,e,s,w}, flags}`.

---

## 2. REFRESH / SCROLL ENGINE (ID_RF)

### 2.1 Coordinate systems (three of them)
The engine juggles three coordinate spaces (`ID_RF.C:150–163`):
- **Global** — actor/camera position at **1/16 pixel** precision. `TILEGLOBAL = 256` global units per tile, `PIXGLOBAL = 16` per pixel (`ID_RF.H:66–67`). Shifts: `G_T_SHIFT = 8` (global→tile), `G_P_SHIFT = 4` (global→pixel), `P_T_SHIFT = 4` (pixel→tile) (`ID_RF.H:69–71`).
- **Tile** — `originxtile = originxglobal >> 8` (`ID_RF.C:1031`).
- **Screen** — byte/pixel offsets into EGA memory; `originxscreen = originxtile << SX_T_SHIFT` where `SX_T_SHIFT = 1` (EGA, 1 byte = 8 px) or `2` (CGA) (`ID_RF.C:300, 323, 1033`).

`RFL_CalcOriginStuff` (`ID_RF.C:1027–1051`) derives everything from the global origin each move, including the sub-tile pan: `panx = (originxglobal >> 4) & 15` (EGA pans to even pixels only via `xpanmask = 6` / `pansx = panx & 8`, `ID_RF.C:318, 1038–1040`). **For Phaser:** keep the 1/16-pixel fixed-point world coordinate (it governs physics feel), but let the camera scroll to any pixel — the even-pixel restriction is an EGA latch limitation, not a design choice.

### 2.2 The viewport and the "port" over-scan
Visible area: **`SCREENTILESWIDE = 20 × SCREENTILESHIGH = 13`** tiles (`ID_RF.C:50–51`) = 320×208 px. The engine draws into a *larger* off-screen "port" of **`PORTTILESWIDE = 21 × PORTTILESHIGH = 14`** tiles (`ID_RF.H:73–74`) so a partially-scrolled tile exists on every edge. The update bookkeeping arrays are `UPDATEWIDE = PORTTILESWIDE+1 = 22` wide (`ID_RF.H:79`), the extra column holding a `0` row-terminator so word-wide clears/scans work.

### 2.3 Camera limits (`origin*min/max`)
`RF_NewMap` sets `originxmin = originymin = MAPBORDER*TILEGLOBAL = 2*256 = 512` and `originxmax = (mapwidth - MAPBORDER - SCREENTILESWIDE)*256`, `originymax = (mapheight - MAPBORDER - SCREENTILESHIGH)*256` (`ID_RF.C:291, 439–444`). `MAPBORDER = 2` (`ID_RF.H:43`). Tiny maps clamp max→min. So the camera can never show the outer 2-tile border; a Phaser port sets `camera.setBounds` to the equivalent inset rectangle.

### 2.4 Scroll blocks (camera-stop granularity)
Beyond min/max, the engine supports interior **scroll blocks** — invisible lines that stop the camera (`RF_SetScrollBlock`, `ID_RF.C:1079–1093`). A *horizontal* block (`hscrolledge[]`) stops vertical scrolling at a tile row; a *vertical* block (`vscrolledge[]`) stops horizontal scrolling at a tile column. Up to `MAXSCROLLEDGES = 6` each (`ID_RF.C:83`). `RF_NewMap` auto-installs four at the map borders (`ID_RF.C:452–455`).

Enforcement is **tile-granular** and snaps the camera to a whole tile boundary: `RFL_BoundScroll` (`ID_RF.C:1106–1159`) checks whether the *leading edge* of motion (origin tile, or +`SCREENTILESWIDE`/+`SCREENTILESHIGH` when moving right/down) hits a block, and if so masks the global origin to `&0xff00` (tile boundary). This is why in Keen the camera visibly "locks" to tile lines at level edges. **Port takeaway:** camera stops are quantized to 16-px tile boundaries — replicate that or the level-edge feel differs.

### 2.5 Scrolling and the floating update window
`RF_Scroll(dx,dy)` (`ID_RF.C:1707–1841`, CGA twin at `2416–2521`) is the heart of incremental redraw:
- Bounds-checks via `RFL_BoundScroll`, computes tile delta.
- **If the camera moved more than one tile in either axis, it bails to a full `RF_NewPosition` redraw** (`ID_RF.C:1729–1736`). The engine is explicitly designed around **≤ 1 tile of scroll per refresh** (comment `ID_RF.C:1699–1704`).
- Otherwise it "floats" the three EGA screen pointers by `screenmove = deltay*16*SCREENWIDTH + deltax*TILEWIDTH` (`ID_RF.C:1745`) — i.e. it *moves the window into EGA memory* rather than copying pixels, and floats the update arrays by the matching stride (`ID_RF.C:1779`). Only the single newly-exposed row/column is freshly drawn via `RFL_NewRow` (`ID_RF.C:1190–1248`), which also spawns/cull animating tiles on that edge (`RFL_CheckForAnimTile` / `RFL_RemoveAnimsOnX/Y`).

A Phaser port doesn't need the pointer-floating trick (it's a way to avoid blitting a whole screen on EGA), but it *should* keep the "only newly-revealed tiles are activated as animating" behavior for parity, and the tilemap follows the camera automatically.

### 2.6 Tile animation system
Two-layer design:
1. **`allanims[MAXANIMTYPES]`** — one entry per *unique* animating tile id on the map (`ID_RF.C:196`; MAXANIMTYPES = 65, Keen5 = 80). Each holds `{current, count}` (`ID_RF.C:113–122`). Built by `RF_MarkTileGraphics`. Because every instance of a given tile shares one `allanims` entry, **all copies of the same animated tile flip in lockstep** (documented `ID_RF.C:513–517`). Foreground tiles are stored with the high bit set (`current |= 0x8000`, `ID_RF.C:634`).
2. **`animarray[MAXANIMTILES]`** (90 max, `ID_RF.H:48`) — the *on-screen* active instances, a linked list `animhead` of tiles currently inside the port. Each records its map position + a pointer to its shared `allanims` chain (`ID_RF.C:733–800`).

`RFL_AnimateTiles` (`ID_RF.C:913–983`), called once per `RF_Refresh`:
- Advances every `allanims` entry: `count -= tics`; while `count < 1`, step `current += (signed char)ANIM/MANIM[tile]` and add the new tile's `SPEED/MSPEED` to `count` (`ID_RF.C:922–950`). **The cadence is driven by `tics`, the 70 Hz-based frame delta** — so animation speed is wall-clock-locked, not framerate-locked.
- Then walks the on-screen `animhead` list; where a tile's shared `current` differs from what's drawn, it writes the new tile into the map plane (`*mapplane = tile & 0x7fff`) and posts a `RFL_NewTile` update so the tile is re-blitted from master (`ID_RF.C:956–982`).

`RF_MarkTileGraphics` guards against non-terminating chains (`> 20` frames ⇒ `Quit`, `ID_RF.C:594, 670`) and against speed-without-anim.

**Keen 6 extra:** animation frames can trigger a sound (`soundtiles` table, `RFL_CheckTileSound`, `ID_RF.C:481–499`) when a *visible* animating tile reaches its `soundtile` frame (`ID_RF.C:942–947`) — e.g. the stomping/flame tiles. `visible` is refcounted as tiles enter/leave the port.

### 2.7 The foreground-plane priority trick (the "over the player" effect)
Drawing order is by **`PRIORITIES = 4`** sprite priority buckets, with a special insertion: `MASKEDTILEPRIORITY = 3`, and the comment records the plane order as **`0,1,2,MTILES,3`** (`ID_RF.H:63–64`). In `RFL_UpdateSprites` (`ID_RF.C:2155–2159`): it iterates priority 0→3, and *when it reaches priority 3 it first calls `RFL_MaskForegroundTiles`*, which draws masked foreground-plane tiles over whatever sprites (priority 0–2) were already drawn. Then priority-3 sprites draw on top of even the foreground.

So the layering, back to front, is: background tiles → priority-0/1/2 sprites → **masked foreground tiles** → priority-3 sprites (HUD/scorebox). This is exactly how Keen walks *behind* foreground scenery (bushes, pillars) while the scorebox stays on top. `RFL_MaskForegroundTiles` (ID_RF_A.ASM:528–580) scans the update array for cells marked `3` and, if the foreground plane has a masked tile there, blits it. **Port takeaway:** put foreground tiles on a layer above most sprites but below the HUD; give the player a normal priority (0–2) and the HUD priority 3.

### 2.8 Sprite draw/erase model (double-buffered "dirty master")
The engine keeps a clean **master screen** (`masterofs`) containing only tiles, plus two display pages (EGA page-flip, `screenpage`/`otherpage`, `ID_RF.C:305–309, 2333–2336`). Refresh sequence (`RF_Refresh`, `ID_RF.C:2282–2342`):
1. `RFL_AnimateTiles`.
2. `RFL_UpdateTiles` — copy freshly-scrolled/animated tiles from master → working page (write-mode 1; ID_RF_A.ASM:349–407). Update codes: **1** = tile needs copy from master.
3. `RFL_EraseBlocks` — for each sprite that moved, copy its *old* rectangle back from master, erasing it, and stamp **2** into the update array so overlapping sprites know to redraw (`ID_RF.C:2028–2127`).
4. `RFL_UpdateSprites` — for each sprite (by priority) whose covered tiles have any non-zero update code (or whose `updatecount>0`), redraw it and stamp **3** over its tiles (`ID_RF.C:2140–2264`).
5. Optional `refreshvector` hook (game draws extra), then `VW_SetScreen(bufferofs+panadjust, panx & xpanmask)` to show the page, clear the update array, flip pages, and finally `RF_CalcTics`.

`RF_PlaceSprite` (`ID_RF.C:1853–1961`) links a sprite into `prioritystart[priority]`, posts erase blocks for its old position to *both* pages (because of double buffering), computes the EGA sub-tile shift `shift = (pixx&7)/2` (`ID_RF.C:1937`), and sets `updatecount = 2` so the sprite is force-drawn on the next **two** refreshes (once per page) — CGA uses `1` (single buffer, `ID_RF.C:2624`). `RF_RemoveSprite` unlinks and posts a final erase. Two overlapping equal-priority sprites can swap draw order when updated (documented `ID_RF.C:33–35`).

**Port takeaway:** the whole master/erase/dirty-rectangle machinery is a CPU-blitting optimization. In Phaser you simply render sprites each frame; but preserve the **priority buckets** and the **foreground-between-priorities** rule (§2.7), and note that a sprite is "sticky-drawn" for a frame or two after placement.

### 2.9 Dynamic tile rewriting — `RF_MemToMap` (doors, switches, morphing terrain)
`RF_MemToMap(source, plane, destx, desty, width, height)` (`ID_RF.C:1359–1401`) writes a rectangle of new tile ids straight into a map plane at runtime, and for each changed cell: posts a `RFL_NewTile` update (so it re-blits from master) and re-evaluates it for animation via `RFL_CheckForAnimTile`. It first removes any active anims in the block (`RFL_RemoveAnimsInBlock`, `ID_RF.C:879–902`). This is the mechanism behind **doors opening, bridges appearing, switches toggling walls** — the game hands the engine a small tile array and the map mutates in place. `RF_MapToMap` (`ID_RF.C:1280–1343`) is the sibling that copies a rectangle of all three planes from elsewhere on the map (used for scrolling reveal/teleport). **Port takeaway:** expose a `putTiles(plane, x, y, tileArray)` on your tilemap that also updates collision and re-registers animation — that single primitive covers most Keen level interactivity.

### 2.10 The 70 Hz tic model
`RF_CalcTics` (`ID_RF.C:1548–1596`) is the adaptive-timing clock read by all game logic:
- `tics = TimeCount - lasttimecount`, busy-waiting until `tics ≥ MINTICS = 2` (`ID_RF.H:39`). Clamped to `MAXTICS = 5` (`ID_RF.H:40`); overflow is subtracted back from `TimeCount` so time doesn't run away (`ID_RF.C:1590–1594`).
- In demo mode it *forces* `tics = DEMOTICS = 3` and advances `TimeCount` deterministically (`ID_RF.C:1558–1569`) — see §4.4.
- `RF_NewMap` primes `lasttimecount = TimeCount; tics = 1` (`ID_RF.C:458–459`).

`TimeCount` itself is the master clock, incremented at exactly **70 Hz** by the PIT-channel-0 ISR regardless of sound mode: `TickBase = 70` (`ID_SD.H:41`); `SDL_SetIntsPerSec(1192030/ints)` (`ID_SD.C:156`); the timer runs at `TickBase*8 = 560 Hz` with AdLib music or `TickBase*2 = 140 Hz` otherwise (`ID_SD.C:886–894`), and `TimeCount++` fires every 8th or 2nd interrupt respectively (`ID_SD.C:770–801`) → a steady 70 Hz. **This is the single most important number for a port:** all Keen movement/physics is expressed as "distance × tics", where `tics` is the number of 1/70 s ticks since the last frame, clamped to [2,5]. In Phaser, run a fixed-step accumulator at **70 Hz** (14.2857 ms) and pass an integer `tics` (2–5) into movement, rather than using raw `deltaTime`. Clamping to 5 means the sim never advances more than ~71 ms per frame (slow-motion under lag, never tunneling).

---

## 3. INPUT (ID_IN — Input Manager)

### 3.1 Keyboard model
A custom keyboard ISR on IRQ1/`int 9` (`INL_KeyService`, `ID_IN.C:160–248`) maintains a **`Keyboard[NumCodes=128]` boolean array** indexed by raw scan code. Make code ⇒ `Keyboard[k]=true` and record `LastScan`/`LastASCII`; break code (bit `0x80` set) ⇒ `Keyboard[k]=false` (`ID_IN.C:180–192`). Prefix `0xE0` marks an extended key; `0xE1` sets `Paused` (the Pause key, which cannot be polled as a normal scancode — see how Keen handles it at `CK_PLAY.C:783`). Shift/CapsLock produce ASCII via `ASCIINames`/`ShiftNames`/`SpecialNames` tables (`ID_IN.C:79–140`).

`IN_KeyDown(code)` is just `Keyboard[code]` (`ID_IN.H:206`). There is **no built-in per-frame edge/"just pressed" state** — the ISR only holds level state plus the single most-recent `LastScan`. Edge detection is done by callers: `IN_WaitForKey` blocks then clears `LastScan` (`ID_IN.C:1101–1110`); `IN_ClearKey`/`IN_ClearKeysDown` reset entries; game code snapshots `LastScan`, acts, and clears it (e.g. the F1–F9 handling in `CK_PLAY.C:800–876`). **Port takeaway:** in Phaser, keep both a held-keys set and an explicit `justPressed` computed each frame — the original leans on "read `LastScan`, then zero it".

### 3.2 Controls, directions, two-button model
`ControlType` enumerates keyboard1/2, joystick1/2, mouse (`ID_IN.H:141–147`). `IN_ReadControl(player, info)` (`ID_IN.C:869–1000`) fills a `ControlInfo` with `x/y` deltas, `xaxis/yaxis` motion (−1/0/+1), a 9-way `dir` (via `DirTable[(my+1)*3+(mx+1)]`, `ID_IN.C:141–146, 975`), and `button0/button1`. A `KeyboardDef` (`ID_IN.H:173–178`) maps the two buttons plus eight directional keys (`upleft…downright`); default is Ctrl/Alt + arrow keys (`KbdDefs[0]`, `ID_IN.C:59`). So the base control abstraction is **two buttons + 8-direction d-pad** — exactly Keen's jump / pogo(+fire) scheme.

### 3.3 Gravis GamePad
A special path (`ID_IN.C:939–946`): when `GravisGamepad` is set, `INL_GetJoyButtons(2)` reads all four gamepad buttons, and each is remapped through `GravisMap[i]` into `GravisAction[i]` for the four `GravisAType` actions **Jump / Pogo / Fire / Status** (`ID_IN.H:160–165`). Keen checks `GravisAction[ga_Status]` to open the status screen (`CK_PLAY.C:772`). The joystick is analog with adaptive scaling and calibration thresholds (`IN_SetupJoy`, `INL_GetJoyDelta`, `ID_IN.C:562–585, 363–432`) — irrelevant to a keyboard/touch web port beyond "support a 4-action pad".

### 3.4 Demo record/playback hooks
Demos are a compact RLE stream in `DemoBuffer` (`ID_IN.C:869–1000`). Each event is a 2-byte pair: **`[repeatCount][packedControl]`**, where the control byte packs `(buttons << 4) | ((mx+1) << 2) | (my+1)` (`ID_IN.C:980`). Recording increments the run count while input is unchanged (up to 255) else emits a new pair (`ID_IN.C:982–998`); playback decrements the count and, when the buffer is exhausted, sets `demo_PlayDone` (`ID_IN.C:885–897`). `IN_StartDemoRecord/Playback/StopDemo` manage the buffer (`ID_IN.C:1021–1062`). Because demos replay *inputs*, deterministic playback requires the sim to be deterministic — hence the fixed `DEMOTICS=3` timestep (§2.10) and the reset RNG (§4). **Port takeaway:** if you want attract-mode demos, record the same `{buttons, dx, dy}` per fixed tic and drive the identical fixed-step sim with the same RNG seed.

---

## 4. UI / USER MANAGER (ID_US) — feel-shaping bits

### 4.1 `US_RndT` — the deterministic random table
The engine's PRNG is a **256-entry byte table with a rolling index**, not an arithmetic generator (`ID_US_A.ASM:36–114`). `US_RndT` does `rndindex = (rndindex+1) & 0xFF; return rndtable[rndindex]` — returns 0–255. `US_InitRndT(randomize)`: if `false`, `rndindex = 0` (fully deterministic sequence); if `true`, seeds `rndindex` from the DOS clock low byte (`ID_US_A.ASM:69–89`). The exact 256 bytes are fixed (begin `0, 8, 109, 220, 222, 241, 149, 107, 75, 248, 254, 140, 16, 66, …`; `ID_US_A.ASM:36`). 

**Where determinism matters:** every gameplay coin-flip (`US_RndT() & 1`, `US_RndT() % 3`, e.g. `ID_US_2.C:1490, 1501`, and pervasively across the actor code) draws from this shared table. Demos and the title attract-mode reset the index to a known value so the same enemy behaviour replays. `US_Startup` seeds with `true` for normal play (`ID_US_1.C:427`). **Port takeaway:** reproduce this table **byte-for-byte** and the same "increment index, read table" logic if you want original enemy patterns / working demos; seed = index. A modern `Math.random()` will *not* reproduce Keen's feel or its scripted-looking randomness.

### 4.2 The scorebox model
The HUD scorebox is not drawn imperatively each frame — it is a **sprite whose bitmap is edited in place** (`UpdateScore`, `CK_KEEN2.C:239–380`). Gated by `showscorebox` (config-persisted, `ID_US_1.C:278, 345`). When score/ammo/lives change vs. cached `temp1/temp2` (score hi/lo), `temp3` (ammo), `temp4` (lives), it writes digit glyphs directly into the `SCOREBOXSPR` plane data with `MemDrawChar` (blank = char 41, digits = char 42+n) at fixed byte offsets, then (EGA) regenerates the pre-shifted copies with `ShiftScore`, and re-places the sprite at **priority 3**, pinned to the viewport origin +4 px (`CK_KEEN2.C:376`). It is created as an `inertobj`, `active = ac_allways`, `needtoclip = cl_noclip`, `priority = 3` (`CK_KEEN2.C:63–70`). **Port takeaway:** a plain always-on-top HUD container that only re-renders when a tracked value changes; anchor it to the camera, top-left, above the foreground layer.

### 4.3 Window / dialog conventions
All menus/dialogs use an **8-pixel-tile grid**. `US_DrawWindow(x,y,w,h)` takes tile units, converts to pixels (`WindowX = x*8`, etc.), clears the interior to `WHITE`, and draws a border from a 9-piece masked tile8 set — corners (0,2,6,8), horizontal edges (1,7), vertical edges (3,5) (`ID_US_1.C:962–990`). `US_CenterWindow(w,h)` centers it on the 320×200 field (`MaxX=320, MaxY=200`, `ID_US.H:43–44`; `ID_US_1.C:998–1002`). Text flows from `PrintX/PrintY` via measure+draw function pointers (`USL_MeasureString`/`USL_DrawString`, default proportional font, `ID_US_1.C:86–87`); `US_Print` (left, newline-aware), `US_CPrint`/`US_CPrintLine` (centered) (`ID_US_1.C:797–941`). `US_SaveWindow`/`US_RestoreWindow` snapshot window+cursor state (`ID_US_1.C:1046–1074`); `US_CenterSaveWindow` also saves/restores the pixels behind it (`ID_US_1.C:1010–1038`) so dialogs pop over gameplay without a full redraw. `US_LineInput` is the text-entry field with a blinking XOR I-bar cursor toggled on a `TickBase/2` (35 Hz) cadence (`ID_US_1.C:1176–1358, 1329–1338`). The cache-progress "thermometer" dialog (`CAL_DialogDraw/Update/Finish`, `ID_CA.C:1896–2006`) is a themed instance of the same window system.

The loader also drives a **text-mode startup screen** (`US_TextScreen`/`US_UpdateTextScreen`, `ID_US_1.C:594–730`) reporting detected hardware — cosmetic for a port. Config is a versioned binary `CONFIG.EXT` (`ConfigVersion = 4`) holding high scores, sound/music modes, control type, key defs, `showscorebox`, `compatability`, Gravis map (`ID_US_1.C:253–358`).

### 4.4 Determinism summary
Reproducible gameplay/demos require three things to line up: (a) the fixed **70 Hz / `DEMOTICS=3`** timestep (§2.10), (b) the **`US_RndT` table + index** reset to a known value (§4.1), and (c) replayed **input events** (§3.4). Miss any one and demos desync.

---

## 5. THE 10 ENGINE FACTS A PHASER REIMPLEMENTATION MUST RESPECT (ranked)

1. **Fixed 70 Hz timestep, integer `tics` clamped [2,5].** All movement is `speed × tics`; `TimeCount` ticks at 70 Hz (`ID_SD.H:41`, `ID_SD.C:886–894`), `tics` clamped in `RF_CalcTics` (`ID_RF.C:1548–1596`). Use a 14.286 ms fixed-step accumulator, not raw `delta`. Everything else derives from this.
2. **World coordinates are 1/16-pixel fixed point; 256 units = 1 tile (16 px).** `TILEGLOBAL=256`, `PIXGLOBAL=16` (`ID_RF.H:66–67`). Physics feel lives in these units — keep them for movement math even if you render in float pixels.
3. **The foreground-plane priority trick: `0,1,2,MASKEDTILES,3`.** Masked foreground tiles draw over priority-0..2 sprites but under priority-3 (`ID_RF.H:63–64`, `ID_RF.C:2155–2159`). This makes Keen pass behind scenery while the HUD stays on top. Layer order is non-negotiable for correct look.
4. **Three-plane maps: background / foreground(collision+mask) / info.** 2 bytes per cell per plane (`ID_CA.H:50`, `ID_CA.C:1663`); collision is per-edge N/E/S/W flags on the foreground tile (`ID_CA.H:67–70`); info plane carries spawns and doubles as the animation pointer (one-anim-per-cell rule, `ID_RF.C:512–518`).
5. **Shared-chain tile animation clocked in tics; all instances lockstep.** `allanims[]` one-per-unique-tile, `ANIM` = signed next-frame delta, `SPEED` = dwell in tics (`ID_RF.C:521–684, 913–950`). Same tile everywhere flips on the same frame — don't randomize per-instance phase.
6. **`US_RndT` = 256-byte table + rolling index, seedable/resettable.** Reproduce the exact table and `(index+1)&0xFF` logic (`ID_US_A.ASM:36–114`) for authentic enemy behaviour and working demos.
7. **Camera stops are tile-quantized: min/max border inset + interior scroll blocks snapping to 16-px boundaries.** `MAPBORDER=2`, `originxmax = (w-2-20)*256`, `RFL_BoundScroll` snaps to `&0xff00` (`ID_RF.C:439–444, 1106–1159`). Level-edge and boss-arena "camera lock" feel depends on this granularity.
8. **Dynamic tile rewriting via a single primitive (`RF_MemToMap`) that also updates collision + animation.** Doors/switches/bridges mutate the map plane in place (`ID_RF.C:1359–1401`). Build `putTiles(plane,x,y,array)` that re-syncs collision and anim.
9. **Two-button + 8-direction control abstraction, with a 4-action pad (Jump/Pogo/Fire/Status).** `KeyboardDef` + `ControlInfo` + `GravisAction` (`ID_IN.H:160–178`, `ID_IN.C:869–1000`). Level-state key array; edge detection is the caller's job.
10. **HUD as an always-on-top, change-cached, camera-anchored element (priority 3), and a shared engine tic drives cursor blink / timers.** Scorebox re-renders only on value change (`CK_KEEN2.C:239–380`); dialogs are 8-px-tile windows that save/restore the background (`ID_US_1.C:962–1038`).

---

## Appendix — key constants at a glance
`NUMMAPS=30`, `MAPPLANES=3` · `SPEED=402` · tile edges `NORTHWALL/EASTWALL/SOUTHWALL/WESTWALL` then `MANIM/INTILE/MSPEED` (ID_CA.H:61–73) · `TILEGLOBAL=256`, `PIXGLOBAL=16`, shifts G_T=8/G_P=4/P_T=4 · viewport 20×13, port 21×14, UPDATEWIDE=22 · `MAPBORDER=2` · `MINTICS=2, MAXTICS=5, DEMOTICS=3` · `MAXSPRITES=60, MAXANIMTILES=90, MAXANIMTYPES=65/80` · `PRIORITIES=4, MASKEDTILEPRIORITY=3` · `MAXSCROLLEDGES=6` · `MAXMAPHEIGHT=200/250` · update codes 0=idle,1=copy-from-master,2=erased,3=sprite-drawn, `UPDATETERMINATE=0x0301` · `TickBase=70` Hz · RndT table = 256 bytes, index &0xFF.

---

## 10-line summary

1. Maps are TED5 three-plane grids (background / foreground+collision / info), 2 bytes per cell, 30 slots, Carmack-then-RLEW compressed (ID_CA.C:1615–1713); planes are always reloaded, never cached.
2. `tinf` holds per-tile ANIM/SPEED (bg), MANIM/MSPEED (fg), and per-edge NORTHWALL/EASTWALL/SOUTHWALL/WESTWALL solidity (ID_CA.H:61–73); the info plane doubles as an animation pointer, so a cell can't animate in both fg and bg.
3. The whole sim runs on a fixed **70 Hz** clock (`TimeCount`, ID_SD.C:886–894); `RF_CalcTics` yields integer `tics` clamped to [2,5], and movement is `speed×tics` (ID_RF.C:1548–1596).
4. Coordinates are 1/16-pixel fixed point, 256 units per 16-px tile; camera origin, tile, and screen spaces derive in `RFL_CalcOriginStuff` (ID_RF.C:1027–1051).
5. Rendering keeps a clean "master" tile screen and dirty-rectangle erases sprites back from it; refresh order is animate→copy tiles→erase→sprites→flip (ID_RF.C:2282–2342).
6. The signature look comes from priority order **0,1,2,masked-foreground,3**: foreground tiles draw over most sprites but under the HUD (ID_RF.H:63–64, ID_RF.C:2155–2159).
7. Tile animation uses shared `allanims` chains clocked by tics, so every instance of a tile flips in lockstep; `RF_MemToMap` rewrites tiles at runtime for doors/switches (ID_RF.C:913–950, 1359–1401).
8. Camera limits are a 2-tile border inset plus up to 6 interior scroll blocks that snap the camera to 16-px tile boundaries (ID_RF.C:439–444, 1106–1159); scrolling >1 tile forces a full redraw.
9. Input is a level-state `Keyboard[128]` array via a custom int-9 ISR, abstracted to two-button + 8-direction control (plus a 4-action Gravis pad); demos are RLE'd `[count][packedControl]` input streams (ID_IN.C:160–248, 869–1000).
10. `US_RndT` is a fixed 256-byte table with a rolling index (seedable/resettable, ID_US_A.ASM:36–114) — reproduce it exactly for authentic enemy behaviour and deterministic demos; the scorebox is a change-cached, priority-3, camera-anchored sprite (CK_KEEN2.C:239–380).

**Intended report path (could not be written — read-only mode, no file tool):** `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/keen-id-engine.md` — the full markdown above can be saved there verbatim by the parent agent.