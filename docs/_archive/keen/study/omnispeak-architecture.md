I have everything needed. One important constraint: I am in read-only mode and have no file-writing tools, and my instructions direct me to return findings directly as my final message rather than writing report `.md` files. So I am delivering the full report inline below (intended save path: `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/omnispeak-architecture.md`) for the parent agent to persist.

---

## 10-line summary

1. Omnispeak is a modern portable C reimplementation of the id "Galaxy" engine (Keen 4/5/6); it is GPLv2, so this is **architecture study only — zero code copied**.
2. It cleanly splits into an id-tech layer (`id_*`: memory, cache, refresh, video, input, sound, user) and a Keen game layer (`ck_*`), with per-episode files (`ck4/5/6_*`).
3. The single most imitable idea: **actors and their state machines live in editable text data** (`ACTION.CKx`), not code — each action row is 14 fields ending in think/collide/draw/next.
4. Behaviour is wired by name: C think-functions register into a string→function-pointer table (`ck_act.c`), so data references functions by string.
5. Physics is a set of small pure-ish stepping functions in `ck_phys.c` operating on unit/tile clip-rects; tile clipping uses an 8×16 slope-height lookup table.
6. Every subsystem exposes a **vtable of function pointers** (`VL_Backend`, `SD_Backend`, `IN_Backend`) chosen at build time — SDL2/GL, SDL3, Vulkan, DOS, or null.
7. Timing is a fixed **70 Hz tic** counter (`SD_GetTimeCount`) derived from the audio/PIT clock; each frame computes `SpriteSync` = tics elapsed, clamped to [minTics, maxTics].
8. Physics loops `SpriteSync` times per frame, so gameplay is frame-rate independent yet bug-for-bug faithful to DOS.
9. Build on macOS = CMake + SDL2 (`-DRENDERER=sdl2gl`); Keen 4 shareware data (`4keen14.zip`) supplies `GAMEMAPS.CK4`, `EGAGRAPH.CK4`, `AUDIO.CK4`, plus the bundled `data/keen4/*` text files.
10. The closing section lists the 10 decisions to mirror in `@domigo/game-2d` (data-driven actions, tic accumulator, backend vtable → Phaser scene-service, clip-rect physics, etc.).

Intended report path: `.../scratchpad/study/omnispeak-architecture.md` (could not be written — read-only agent; content follows).

---

# Omnispeak Architecture Study — for the @domigo/game-2d arcade engine

**Provenance / license note.** Omnispeak (https://github.com/sulix/omnispeak) is a from-source reimplementation of id Software's "Galaxy" engine that powered Commander Keen 4/5/6. It is licensed **GPLv2-or-later** (see every file header and `LICENSE`). This document is a **clean-room architecture study only**: it records *patterns, structure, and data formats*, and deliberately quotes at most one line of source. No Omnispeak code will be copied into our TypeScript/Phaser engine. Everything below is a description of how the reference organises the problem, so we can re-derive an equivalent from scratch.

Studied at commit present in the local tree (src has ~99 files). All paths are relative to `.../scratchpad/omnispeak/`.

---

## 1. Module map — how a modern codebase organises the 1991 engine

Omnispeak preserves id's original two-tier split but modernises it. There are two prefixes:

- **`id_*` — the reusable "id engine" layer.** These are the descendants of id's ID_MM/ID_CA/ID_RF/ID_VL/ID_VH/ID_IN/ID_SD/ID_US modules. They know nothing about Keen-specific creatures.
- **`ck_*` — the Commander Keen game layer.** Game states, the player, physics tuned to Keen, the story/menu code.
- **`ck4_* / ck5_* / ck6_*` — per-episode content**: each episode's creatures, maps, and misc logic, compiled in behind `WITH_KEEN4/5/6`.

### The id-engine layer (`id_*`)

| File | Responsibility |
|---|---|
| `src/id_mm.c/.h` | Memory manager. Modernised: an arena allocator (`MM_ArenaCreate`, `MM_ArenaAlloc`, `MM_ArenaStrDup`) replaces the original's hand-rolled EMS/XMS zone manager. Still exposes `MM_GetPtr` for big blocks. |
| `src/id_ca.c/.h` | "Cache Adaptor". Loads and RLEW/Huffman-decompresses the original data lumps: `EGAGRAPH` (graphics chunks), `AUDIO`, `GAMEMAPS`/`MAPHEAD` (three-plane tile maps), `TILEINFO`. Owns `ca_gfxInfoE` (the GFXINFOE sprite/tile offsets, see `id_ca.h`), the `CA_MapHeader` (3 plane offsets, width/height), and `CA_TileAtPos(x,y,plane)`. Chunk-marking/purge API (`CA_MarkGrChunk`, `CA_ClearMarks`, `CA_CacheMarks`) mirrors the original demand-cache. |
| `src/id_rf.c/.h` | "Refresh" — the scrolling tiled-world renderer + the sprite draw list. Owns scroll position (`rf_scrollXUnit/Yunit`), the dirty-tile buffers, animated-tile timers, and the `RF_SpriteDrawEntry` linked list. `RF_Refresh()` composits background tiles + masked tiles + sprites and pumps the frame clock (`RFL_CalcTics`). Defines the coordinate system: **units (1/256 tile), pixels (1/16 tile), tiles** with shift macros `RF_UnitToTile` etc. |
| `src/id_vh.c/.h` | "View Hardware" helper: sprite table lookups (`VH_GetSpriteTableEntry` → the per-sprite clip box `xl,yl,xh,yh`), bitmap/font blits. Sits between RF and VL. |
| `src/id_vl.c/.h` + `id_vl_private.h` | "Video Layer". Software EGA emulation (planar → RGBA/PAL8 blit routines, `VL_MaskedToPAL8` etc.), palette/fade, aspect/overscan. Delegates the actual "put pixels on screen" to a **backend vtable** (`VL_Backend`, §3). |
| `src/id_in.c/.h` | "Input". Abstract control frame (`IN_ControlFrame`), keyboard scancodes, joystick config, demo record/playback, binding UI. Backend vtable `IN_Backend`. |
| `src/id_sd.c/.h` | "Sound Department". OPL2/AdLib + PC-speaker synthesis, music, and — crucially — the **70 Hz timer** (`SD_GetTimeCount`, `SpriteSync`, §4). Backend vtable `SD_Backend`. |
| `src/id_us_1.c`, `id_us_2.c`, `id_us_textscreen.c`, `id_us.h` | "User" manager: menus, high-scores input, the text-screen renderer, command-line parm parsing (`US_ParmPresent`), random-table (`US_RndT`). |
| `src/id_str.c/.h` | A generic string→pointer hash table (`STR_Table`, `STR_AddEntry`, `STR_LookupEntry`) **and** a tokeniser/parser (`STR_ParserState`, `STR_GetToken`). This is the modern glue that did not exist in 1991: it powers the data-driven VAR/ACTION system. |
| `src/id_cfg.c/.h` | Key/value config file (`OMNISPK.CFG`) reader — new; the DOS game had no such thing. |
| `src/id_fs.c/.h` | Filesystem abstraction (game path vs. user path vs. bundled path) — new, for portability and XDG dirs. |
| `src/id_ti.c/.h` | TileInfo accessors (`TI_ForeTop/Left/Right/Bottom`, the per-tile collision flags). |

### The Keen game layer (`ck_*`)

| File | Responsibility |
|---|---|
| `src/ck_main.c` | Entry point + init order (see below), episode auto-detection (`isPresent()`), arg parsing. |
| `src/ck_def.h` | The master game header: the `CK_object` struct, `CK_action` struct, `CK_GameState` (savegame-compatible), all the enums (`CK_ClassType`, `CK_ActionType`, `CK_LevelState`, `CK_MiscFlag`). |
| `src/ck_act.c/.h` | **The data-driven engine**: parses `ACTION.CKx`/`EPISODE.CKx`, builds the action table and the variable table, and the string→function-pointer registry (§2). |
| `src/ck_play.c/.h` | The **main gameplay loop** (`CK_PlayLoop`), the object array (`ck_objArray[CK_MAX_OBJECTS]`), object alloc/free (`CK_GetNewObj`, `CK_RemoveObj`), and the action interpreter (`CK_ActionThink`, `CK_RunAction`). Also camera, status bar, debug keys. |
| `src/ck_phys.c/.h` | Physics + tile clipping (§2). |
| `src/ck_obj.c` | Shared spawnables (items, platforms, turrets). |
| `src/ck_keen.c` | The player: input→state machine, jump/pogo/shoot, `CK_SpawnKeen`, the huge keen action think-functions. |
| `src/ck_map.c` | World-map logic shared across episodes. |
| `src/ck_misc.c` | Shared helpers (`CK_StunCreature`, `CK_Glide`, generic draw funcs). |
| `src/ck_game.c` | Save/load, level load/teardown. |
| `src/ck_inter.c`, `ck_text.c` | Story/intro/terminator/star-wars scroller, help screens. |
| `src/ck_quit.c`, `ck_cross.c/.h` | `Quit()` + cross-platform logging/endian helpers. |
| `src/ck4_*`, `ck5_*`, `ck6_*` | Per-episode: `_ep.h` (the `CK_EpisodeDef` + class enums), `_map.c` (info-layer scanner that spawns creatures from map tiles), `_obj1/2/3.c` (creature think/collide/draw), `_misc.c` (episode specials). |

### What was cleaned up vs. the 1991 original

- **Segmented 16-bit pointers → flat structs.** The original stored 16-bit `dseg` offsets; Omnispeak keeps a `compatDosPointer` field only for savegame compatibility (`ck_def.h` `CK_action.compatDosPointer`, `CK_object.user1..4` as int16 for save-compat) and otherwise uses real pointers.
- **Hard-coded action arrays → external editable text.** In 1991 the action tables were static C arrays in the EXE. Omnispeak externalised them to `ACTION.CKx` (§2) — the single biggest architectural improvement.
- **Direct hardware I/O → backend vtables.** PIT/EGA/AdLib register pokes became `SD_Backend`/`VL_Backend`/`IN_Backend` interfaces (§3).
- **One monolith → id-layer vs. game-layer vs. episode-layer**, with episodes behind compile flags.
- **New niceties:** config file (`id_cfg`), FS abstraction with XDG (`id_fs`), quicksave, richer key/joy binding, a dumper mode (`CK_ENABLE_PLAYLOOP_DUMPER`) that logs every object every tic for regression-testing against the DOS binary (`tools/kdumper`, `tools/dumpprinter`).

Init order (from `src/ck_main.c:505`): `FS_Startup → MM_Startup → CFG_Startup → CK_ACT_SetupFunctions` (register all C funcs by name) `→ CK_{Keen,OBJ,Map,Misc}SetupFunctions → CK4/5/6_SetupFunctions → CK_VAR_Startup → episode autodetect → CK_VAR_LoadVars(EPISODE.CKx) → CK_InitGame` (which starts CA, VL, IN, SD, US, RF). Note that **all function-pointers are registered by string name before any data file is parsed** — the data then references them by name.

---

## 2. Actors and states as DATA — the pattern worth stealing

This is the centre of gravity of the whole design, and the thing we should imitate most directly.

### The action record

An "action" is one node of a creature's finite state machine. Its shape is `CK_action` in `src/ck_def.h:306`:

- `chunkLeft`, `chunkRight` — sprite graphic to show (per facing).
- `type` — one of `AT_UnscaledOnce / AT_ScaledOnce / AT_Frame / AT_UnscaledFrame / AT_ScaledFrame` (`CK_ActionType`, `ck_def.h:295`). This decides whether motion is scaled by elapsed tics and whether the think fires once or every frame.
- `protectAnimation`, `stickToGround` — behaviour flags.
- `timer` — how many tics this action lasts before advancing to `next`.
- `velX`, `velY` — built-in movement applied by the interpreter.
- `think`, `collide`, `draw` — **function pointers** to C behaviour.
- `next` — pointer to the next `CK_action` (the edge in the state graph).

Actions are authored as **plain-text rows** in `data/keen4/ACTION.CK4`. The single load-bearing line, quoted verbatim (our one code quote):

`%action CK_ACT_keenStanding 0x098C @SPR_KEENSTANDL @SPR_KEENSTANDR UnscaledFrame 0 1 4 0 32 CK_KeenStandingThink CK_KeenColFunc CK_KeenDrawFunc CK_ACT_keenStanding`

Reading left to right: name, DOS-compat offset, left sprite, right sprite, type, protectAnimation, stickToGround, timer, velX, velY, think, collide, draw, next. The `@SPR_...` tokens are indirect references resolved against the variable table (see `CK_VAR_ParseIntOrVar` in `src/ck_act.c:454`, which special-cases a leading `@`). `next` pointing back to itself makes a looping idle; pointing forward chains an animation; `NULL` deletes the object when the action runs out.

### How names become pointers

`src/ck_act.c` implements two registries built on `id_str`'s hash table:

1. **Function table** (`ck_functionTable`): C code calls `CK_ACT_AddFunction("CK4_SlugMove", &CK4_SlugMove)` at startup (see the bulk registration in `src/ck4_obj1.c:555` `CK4_Obj1_SetupFunctions`). Lookups: `CK_ACT_GetFunction(name)`.
2. **Variable/action table** (`ck_varTable`): `CK_VAR_LoadVars(filename)` (`ck_act.c:712`) tokenises the file and dispatches on a leading `%type` keyword — `%int`, `%string`, `%intarray`, `%stringarray`, `%function`, `%action`, plus `%include` and `%override` for composition/modding. `CK_VAR_ParseAction` (`ck_act.c:488`) fills a `CK_action` and resolves the three function names + the `next` action name into pointers right there.

Access from game code is via macros in `src/ck_act.h`: `CK_ACTION(name)` → `CK_GetActionByName("name")`, `CK_INT(name,def)`, `CK_STRING(name)`, `CK_SOUNDNUM(name)`, `CK_INTARRAY`. So a creature's tuning constants (`CK4_SlugSlimeChance`, spawn Y-offsets, etc.) are **also** data, read with a default: `CK_INT(CK4_SlugSlimeChance, 0x10)` (`ck4_obj1.c:104`). This is why the same C behaviour can be re-tuned per episode without recompiling.

### A creature in this idiom

`src/ck4_obj1.c` shows the whole pattern in miniature. A Slug is:
- a spawner `CK4_SpawnSlug` that allocates a `CK_object`, sets `type`, `zLayer`, position, random facing, then `CK_SetAction(obj, CK_ACTION(CK4_ACT_SlugMove0))`;
- a think `CK4_SlugMove` that rolls `US_RndT()` and may switch to the sliming action;
- a collide `CK4_SlugCol(a,b)` that branches on `b->type` (kill Keen, or get stunned by a shot via `CK_StunCreature`).

No creature "class" exists in C — the *identity* of a creature is the graph of action rows plus a handful of registered functions. Adding an enemy is: write 2–4 functions, register them, add rows to `ACTION.CKx`, and add a spawn case to the episode's info-layer scanner (`ckN_map.c`, dispatched via `CK_EpisodeDef.scanInfoLayer`, `ck_ep.h:50`).

### The interpreter

`CK_RunAction` (`src/ck_play.c:614`) and `CK_ActionThink` (`ck_play.c:500`) execute the record: they add `velX*tics` (scaled or not) into the frame's `ck_nextX/ck_nextY` accumulators, call `think` when due, and advance `currentAction = currentAction->next` when the `timer` expires — carrying leftover tics into the next action so fast frames still run multiple state transitions (the `while (ticsLeft)` loop). Motion is then committed by physics (`CK_PhysUpdateNormalObj`). Collision is resolved separately in `CK_PlayLoop` by an O(n²) AABB sweep over active objects, calling both objects' `collide` (`ck_play.c:2308`).

### How we express this in TypeScript

- **Action table → data + discriminated unions.** Author actions as a typed data table (JSON/TS const), each row `{ id, spriteLeft, spriteRight, type, timer, velX, velY, think, collide, draw, next }`. The `type` field is a perfect **discriminated union** (`'UnscaledOnce' | 'ScaledOnce' | 'Frame' | 'UnscaledFrame' | 'ScaledFrame'`) so the interpreter's `switch` is exhaustively type-checked.
- **String→function registry → a plain `Map<string, ThinkFn>`** (or, better, since we have a module system, import the functions and reference them directly, keeping the *option* of a name registry for data-driven mods/hot-reload). This removes Omnispeak's biggest wart (unresolved-name runtime warnings).
- **Function-pointer states → either** (a) a registry of free functions `(obj) => void` exactly as here, or (b) a class per behaviour with `think/collide/draw` methods. Recommendation: keep behaviours as **pure-ish free functions over a `GameObject` data record**, not deep class hierarchies — it matches the engine's "object is data, behaviour is a function of it" grain and keeps save/replay trivial.
- **`next` as graph edges → object references** resolved once at load; represent a self-loop for idles.
- Keep tuning constants (`CK_INT`) as a typed config object with defaults, so designers retune without touching logic.

---

## 2b. Physics + clipping architecture (`ck_phys.c`)

Worth calling out separately because it is small, self-contained, and highly imitable.

- **Coordinate system:** everything is in *units* = 1/256 of a tile (16 px). Macros in `id_rf.h` convert unit↔pixel↔tile by bit-shifts. Sub-pixel precision without floats.
- **Clip rectangles:** each object caches a `CK_objPhysData` (`ck_phys.h`) with both a *unit* box (`unitX1..Y2`, `unitXmid`) and a *tile* box (`tileX1..Y2`). `CK_ResetClipRects` (`ck_phys.c:51`) rebuilds them from the current sprite's `VH_GetSpriteTableEntry` clip offsets. Each frame the engine snapshots old rects (`CK_SetOldClipRects`) and computes deltas (`CK_SetDeltaClipRects`) so clipping can reason about *motion direction*.
- **Slopes via a lookup table:** `ck_physSlopeHeight[8][16]` (`ck_phys.c:31`) maps (slope-type, x-within-tile) → floor height in units. `CK_PhysClipVert` walks the tiles under the object's x-midpoint and snaps Y onto the slope. This is a clean way to do 45°/steeper terrain without per-pixel masks — we should port the table directly (it's data, not code).
- **Separate stepping functions** the action interpreter/think functions call à la carte: `CK_PhysGravityHigh/Mid/Low`, `CK_PhysDampHorz`, `CK_PhysAccelHorz`, `CK_PhysAccelVert1`. Each loops **once per elapsed tic** (`for tickCount in [last-SpriteSync, last)`) and applies acceleration on odd tics — that's how the DOS 70 Hz feel is preserved (§4). Velocities are clamped (e.g. terminal `velY = 70`).
- **Two clip modes** (`CK_ClipType`: `CLIP_not / CLIP_normal / CLIP_simple`). Normal objects do full slope+wall clipping (`CK_PhysUpdateNormalObj`); "simple" objects (fish, fireballs) use `CK_PhysFullClipToWalls` with a hard-coded bounding box per creature type. Keen gets extra special-case slope handling (`CK_PhysKeenClipDown/Up`).
- **Platform riding** is modelled as objects pushing objects: `CK_PhysPushX/Y/XY` (`ck_phys.c:663`) resolve a passenger against a moving platform and set `topTI = 0x19` as the "standing on platform" sentinel. `squish` kills Keen if crushed.

For TypeScript: replicate the **unit/tile/pixel integer coordinate system**, the **slope-height table**, the **per-tic stepping helpers**, and the **discrete clip modes**. This gives deterministic, replayable, float-free physics that Phaser's Arcade Physics does *not* give you out of the box — so we should run our own fixed-point stepper and use Phaser only for rendering.

---

## 3. Platform abstraction — lessons for Phaser layering

Every hardware-touching subsystem is a **struct of function pointers** (a C vtable), selected at compile time and returned by `X_Impl_GetBackend()`:

- **`VL_Backend`** (`src/id_vl.h:91`): ~30 pointers — `setVideoMode`, `createSurface/destroySurface`, `surfaceToSurface`, `maskedBlitToSurface`, `present(surface, scrollX, scrollY, singleBuffered)`, `waitVBLs`, `flushParams`. Implementations: `id_vl_sdl2.c`, `id_vl_sdl2gl.c`, `id_vl_sdl2vk.c` (Vulkan!), `id_vl_sdl12.c`, `id_vl_sdl3.c`, `id_vl_sdl3gpu.c`, `id_vl_dos.c` (real EGA), `id_vl_null.c`. The *EGA emulation* (planar blits, palette) lives in the shared `id_vl.c`; the backend only owns surface allocation + final present.
- **`SD_Backend`** (`src/id_sd.h:88`): `startup/shutdown`, `lock/unlock`, `alOut(reg,val)` (write an OPL register), `pcSpkOn`, `setTimer0(divisor)`, `waitTick`, `detect`, `setOPL3`. Implementations: `id_sd_sdl.c`, `id_sd_sdl3.c`, plus real-hardware ones (`id_sd_opl2alsa.c`, `id_sd_opl2lpt.c`, `id_sd_liboplhw.c`) and `id_sd_null.c`. The OPL *synthesis* (`opl/dbopl.c` DOSBox core, `opl/nuked_opl3.c`) is shared and portable.
- **`IN_Backend`** (`src/id_in.h:329`): `pumpEvents`, `waitKey`, joystick enumeration, `startTextInput/stopTextInput`. Implementations `id_in_sdl.c`, `id_in_sdl3.c`, `id_in_dos.c`, `id_in_null.c`.

The wins: the entire game/engine logic is compiled against the abstract interface; a new platform is one new file implementing one struct; a `null` backend enables headless testing/regression dumping. Backend choice is a CMake `RENDERER` option (§5), not a runtime plugin — simpler, no dynamic dispatch cost in hot paths beyond the pointer call.

**Lessons for our Phaser layering:**
- Mirror this as a small set of **service interfaces** our engine depends on, with a **Phaser implementation** and a **headless/null implementation** for tests: `IRenderer` (draw sprite at unit-pos, set scroll, palette/tint), `IAudio` (play sfx/music by id), `IInput` (produce our own `ControlFrame` each tic), `IClock` (§4). Keep the **game/physics/actor code 100% Phaser-free**, importing only these interfaces — exactly as `ck_play.c`/`ck_phys.c` never touch SDL.
- Phaser's `Scene` becomes just the renderer/input/audio *backend*, not where game logic lives. Our `CK_PlayLoop` equivalent runs inside `scene.update()` but delegates drawing to the `IRenderer` adapter. This lets us unit-test the whole simulation in Node with a null renderer, and later retarget (canvas/WebGL/server-authoritative) without touching gameplay.
- Do the EGA/palette/blit-equivalent (our sprite atlas + tint logic) in a shared, backend-agnostic module; let the Phaser adapter only own texture allocation and the final draw call — same seam as `id_vl.c` vs. `id_vl_sdl2gl.c`.

---

## 4. Timing model — reproducing 70 Hz on modern vsync

The DOS games ran their logic off the 8253 PIT reprogrammed to ~70 Hz. Omnispeak reproduces this **tic** exactly and decouples it from display refresh.

### The tic source (`src/id_sd.c`)

A monotonically increasing `sd_timeCount` is the master clock (`SD_GetTimeCount`, `id_sd.c:77`). It is advanced inside `SDL_t0Service()` (`id_sd.c:757`): the PIT service runs at the sound part-rate (`sd_sfxPartRate = 140`, `id_sd.c:58`); in AdLib mode the timer fires at 140×4 = 560 Hz and `sd_timeCount++` happens on `!(count & 7)` → 560/8 = **70 Hz**; in non-AdLib mode it fires at 140 Hz and increments on `!(count & 1)` → **70 Hz**. Either way the master clock ticks at 70 Hz, independent of frame rate.

Where does the service get called on modern hardware? In `id_sd_sdl.c` the **audio callback drives it**: `SD_SDL_CallBack` invokes `SDL_t0Service()` once per "sound part" boundary computed from the audio sample rate (`SD_SDL_SamplesInCurrentPart`, derived in `SD_SDL_SetTimer0`, `id_sd_sdl.c:101`), then broadcasts a condition variable. There is also a **system-clock fallback timer thread** (`SD_SDL_t0Thread`, `SD_SDL_useTimerFallback`) for when audio is unavailable. So the "PIT interrupt" is emulated either from the audio clock (sample-accurate) or a wall-clock thread. `README` documents the `/AUDIOSYNC` toggle choosing audio-clock vs. system-clock pacing.

### Per-frame tic accounting (`src/id_rf.c`)

Each `RF_Refresh()` calls `RFL_CalcTics()` (`id_rf.c:986`), which computes **`SpriteSync` = (current timeCount) − (last frame's timeCount)** = how many 70 Hz tics elapsed since the last rendered frame (`SD_SetSpriteSync(...)`, `id_rf.c:1010`), then:
- Busy-waits (`SD_WaitTick`) if fewer than `rf_minTics` (default 2) tics elapsed — i.e. it caps the *logic* rate so a 1000 Hz display doesn't run physics 1000×/s.
- Clamps to `rf_maxTics` (default 5): if the machine is slower than ~14 Hz, it *slows gameplay down* rather than taking huge physics steps (`id_rf.c:1022`), protecting the fixed-step physics from exploding.
- In demo record/playback it forces `rf_demoTics` (3) exactly for determinism (`id_rf.c:992`).

### How the whole loop consumes it

`SD_GetSpriteSync()` is read everywhere: physics steppers loop `SpriteSync` times (`ck_phys.c:850` etc.), timers decrement by it (`ck_play.c:2397`), acceleration applies on odd tics. So one rendered frame may advance the simulation by 2–5 tics, and each tic is a faithful 1/70 s DOS step. `CK_PlayLoop` seeds `SpriteSync=3` on entry (`ck_play.c:2232`).

**For TypeScript/Phaser:** do **not** integrate physics against Phaser's variable `delta` (ms). Instead run a **fixed-timestep accumulator at 70 Hz**: keep `accumulatorMs += delta`; while `accumulatorMs >= 1000/70` run one logic tic and subtract. Expose a `spriteSync = number of tics stepped this frame` if we want to batch (matching Omnispeak), or step one tic at a time (cleaner). Clamp the max tics per frame (their `rf_maxTics`) to avoid spiral-of-death; optionally floor at min tics for battery. Render interpolates between the last two logic states. This gives the exact deterministic, replay-safe, vsync-independent feel — the reason Keen physics survives on a 144 Hz monitor.

---

## 5. BUILD facts — a runnable macOS recipe

**Dependencies (macOS):**
- A C99 compiler (Apple Clang via Xcode Command Line Tools).
- **CMake ≥ 3.0** (the `Makefile.osx` in `src/` targets a 10.6 SDK and is obsolete — use CMake).
- **SDL2** (with CMake config package). The default renderer on non-Windows is `sdl2gl`, which additionally links the system `OpenGL` framework (already present on macOS). Install SDL2 via Homebrew: `brew install cmake sdl2`. (SDL3 and Vulkan are optional alternative backends; Vulkan needs `glslc` from the Vulkan SDK — not needed for the default build.)

**Build steps (default SDL2+OpenGL backend):**
```
cd .../scratchpad/omnispeak
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```
Key CMake options (from `CMakeLists.txt`): `-DRENDERER=sdl2gl` (default off-Windows; alternatives `sdl2`, `sdl2vk`, `sdl3`, `sdl3gpu`, `sdl1`, `dos`, or none→null), `-DWITH_KEEN4/5/6=ON` (all default ON), `-DKEENPATH=.` / `-DUSERPATH=.` / `-DOMNIPATH=.` (data + savegame + bundled-data dirs), `-DXDGUSERPATH=ON` (save to `$XDG_DATA_HOME`), `-DVANILLA=ON` (disable Omnispeak-only features), `-DWITH_ASAN=ON`. Optional real-hardware audio: `-DWITH_ALSA` / `-DWITH_IEEE1284` / `-DWITH_OPLHW` (Linux-only, irrelevant to us). The output binary is `build/omnispeak`.

**Where the Keen 4 shareware data comes from and which files are needed.** Per `README` lines 31–44:
- Download the free shareware **Keen 4 v1.4 EGA**: `https://davidgow.net/keen/4keen14.zip` (id/Apogee-distributable shareware; the Steam/GOG copies are also v1.4 and work).
- From that release you need three original lumps next to the binary (episode extension `.CK4`): **`GAMEMAPS.CK4`**, **`EGAGRAPH.CK4`**, **`AUDIO.CK4`**.
- Plus the matching **bundled text data** already in this repo at `data/keen4/`: `ACTION.CK4`, `EPISODE.CK4`, `GFXINFOE.CK4`, `GFXCHUNK.CK4`, `EGADICT.CK4`, `EGAHEAD.CK4`, `AUDINFOE.CK4`, `AUDIODCT.CK4`, `AUDIOHHD.CK4`, `MAPHEAD.CK4`, `TILEINFO.CK4`, `STRINGS.CK4`. (These are the externalised action/var/dictionary tables; `data/keen5/` and `data/keen6e14|e15/` hold the other episodes — note Keen 6 has separate v1.4 and v1.5 data dirs.)

**Run:** place `GAMEMAPS.CK4`/`EGAGRAPH.CK4`/`AUDIO.CK4` and the `data/keen4/*` files together in one directory, then `./omnispeak /EPISODE 4` (or just `./omnispeak` — it auto-detects the first episode whose files are all present via `CK_EpisodeDef.isPresent`). Useful flags (`README`): `/GAMEPATH <dir>`, `/USERPATH <dir>`, `/FULLSCREEN`, `/NOJOYS`, `/AUDIOSYNC`, `/DEMOFILE <f>`. Config persists in `OMNISPK.CFG` (see `id_cfg.c`).

For our purposes we do **not** ship or link Omnispeak; we build it once locally only to observe reference behaviour (and can use its `CK_ENABLE_PLAYLOOP_DUMPER` + `tools/dumpprinter` to capture ground-truth object traces to validate our own physics).

---

## 6. Closing — the 10 architecture decisions to mirror in `@domigo/game-2d`

1. **Actors as data, not classes.** Define each creature's state machine as a typed action table (rows of sprite/type/timer/vel/think/collide/draw/next), authored as data and loaded at boot — the `ACTION.CKx` pattern (`ck_act.c`, `ck_def.h` `CK_action`). Adding an enemy = a few functions + data rows, no engine changes.
2. **Behaviour = free functions over a data object.** Keep `GameObject` a flat serialisable record and attach behaviour as `think/collide/draw` functions referenced from the action table (registry or direct import). Avoid deep OO hierarchies — it keeps save/replay and testing trivial (`CK_object` in `ck_def.h`).
3. **A discriminated-union action interpreter.** Port `CK_ActionType` to a TS union and write one exhaustive interpreter (`CK_ActionThink`/`CK_RunAction`, `ck_play.c`) that applies built-in velocity, advances `next` on timer expiry, and carries leftover tics across state transitions.
4. **Fixed 70 Hz tic with an accumulator, decoupled from render.** Reproduce `sd_timeCount`/`SpriteSync` as a fixed-timestep loop (`id_sd.c`, `RFL_CalcTics` in `id_rf.c`); clamp min/max tics per frame; never integrate physics against Phaser's variable delta. Interpolate for rendering.
5. **Integer unit/tile/pixel coordinates (no floats in simulation).** Adopt the 256-unit-per-tile fixed-point space and shift-macro conversions (`id_rf.h`) for deterministic, replayable physics.
6. **Clip-rect + slope-table tile collision, run our own — not Phaser Arcade.** Port the dual unit/tile clip box, old/delta-rect motion reasoning, and the `ck_physSlopeHeight[8][16]` slope table (`ck_phys.c`). Use Phaser purely for drawing.
7. **À-la-carte physics steppers.** Provide small composable helpers (`gravity`, `dampHorz`, `accelHorz`, `accelVert`) that think-functions call, each looping over elapsed tics — matches `ck_phys.c` and keeps per-creature motion declarative.
8. **Backend service interfaces with a headless implementation.** Wrap render/audio/input/clock behind interfaces (`VL_/SD_/IN_Backend` analogues); Phaser is one implementation, a null backend enables Node-side unit tests and deterministic replays.
9. **Engine-core / game-layer / content-layer separation.** Keep an `id`-style reusable core (renderer, cache, input, tic clock), a game layer (player, physics, loop), and per-"episode"/per-world content modules loaded behind flags — the `id_* / ck_* / ckN_*` split. Gameplay code imports zero rendering code.
10. **Data-driven tuning + externalised config, with a golden-trace test harness.** Put every magic number behind a named config with a default (`CK_INT(name, def)`), support `%include`/`%override`-style composition for per-world overrides and modding, and build a dumper (like `CK_ENABLE_PLAYLOOP_DUMPER` + `tools/dumpprinter`) that records object state per tic so we can regression-test the simulation deterministically.

*(End of report. GPLv2 architecture study only — no Omnispeak source was or will be copied into `@domigo/game-2d`.)*