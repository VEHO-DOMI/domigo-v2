I have everything needed. Note: I am a read-only exploration agent with no file-writing tools, and my operating rules forbid creating files. So I am delivering the full report inline below (this is what the parent agent consumes). The intended path was `.../scratchpad/study/keen-framework.md`.

---

# Commander Keen 4–6 (Galaxy Engine) — Framework Study: CK_STATE.C, CK_PLAY.C, CK_DEF.H

**PROVENANCE / LEGAL:** This report documents *behavior and numeric constants only*, derived from the GPL "Reconstructed Commander Keen 4-6 Source Code" (© 2021 K1n9_Duk3). **ZERO code will be copied** into the TypeScript/Phaser reimplementation; this is a black-box behavioral spec for a from-scratch clean-room rebuild. All quotes are ≤1 line and used only to pin down exact numbers. Files studied line-by-line: `CK_STATE.C` (1968 lines), `CK_PLAY.C` (2422 lines), `CK_DEF.H` (775 lines), plus supporting reads of `KEEN4/K4_SPEC.C` (ScanInfoPlane), `CK_GAME.C` (level flow), `CK_KEEN2.C` (scorebox), `ID_RF.C`/`ID_RF.H`/`ID_SD.H` (timing/units).

---

## 0. UNITS & GLOBAL CONSTANTS (the number system everything below uses)

The engine has three coordinate spaces (`CK_DEF.H:43-48`):
- **Global** (sub-pixel fixed point): the native unit of `x, y, xspeed, yspeed, xtry, ytry`.
- **Pixel**: `global >> 4` (`G_P_SHIFT = 4`, ID_RF.H:70). So **16 global = 1 pixel**.
- **Tile**: `global >> 8` (`G_T_SHIFT = 8`, ID_RF.H:69). So **256 global = 1 tile = 16 pixels** (`TILEGLOBAL=256`, `PIXGLOBAL=16`, ID_RF.H:66-67; `P_T_SHIFT=4`, ID_RF.H:71).

**Time:** the tick rate is **70 Hz** (`TickBase 70`, ID_SD.H:41). The variable `tics` is the number of 1/70-second ticks elapsed since the last frame. It is clamped to **MINTICS=2 … MAXTICS=5** (ID_RF.H:39-40) in `RF_CalcTics` (ID_RF.C:1548-1596). Demo mode forces exactly **DEMOTICS=3** tics/frame (ID_RF.H:41, ID_RF.C:1563-1568), which is why demos are deterministic.

**Clean speed conversion:** a speed of `v` global-units/tic = `v/16` px/tic = **`v × 70/16 = v × 4.375` px/s**. Keep speeds in global/tic internally and multiply by 4.375 only for reasoning in px/s.

**Key sizes:** `MAXACTORS = 100` (CK_DEF.H:39), `GAMELEVELS = 25` (CK_DEF.H:41), viewport `PORTTILESWIDE=21 × PORTTILESHIGH=14` tiles (ID_RF.H:73-74). `INACTIVATEDIST` = **4 tiles in Keen 4 & 6**, **6 tiles in Keen 5** (K4_DEF.H:61 / K5_DEF.H:61).

---

## 1. THE OBJECT / ACTOR MODEL

### 1.1 `objtype` — the actor struct (CK_DEF.H:297-318)

Every actor is one `objtype`. Fields, with meaning:

| Field | Meaning |
|---|---|
| `classtype obclass` | Enum tag identifying the actor type (CK_DEF.H:184-280). Drives collision dispatch. `nothing=0`, `inertobj=1`, `keenobj=2`, `stunshotobj=3`, then game-specific. `stunnedobj` marks a stunned enemy. |
| `active` (enum) | `ac_no=0` (asleep/off-screen), `ac_yes=1` (thinking), `ac_allways=2` (never sleeps), `ac_removable=3` (delete when off-screen). CK_DEF.H:300. |
| `boolean needtoreact` | If set, the react function runs this frame (redraw/side-effects). |
| `needtoclip` (enum) | `cl_noclip=0`, `cl_midclip=1` (normal tile clipping), `cl_fullclip=2` (bounding-box clip via `FullClipToWalls`). CK_DEF.H:302. |
| `Uint16 nothink` | Countdown that *suppresses* the think function for N think-invocations. Decremented instead of thinking (see §1.3). Used to freeze AI briefly after turning. |
| `Uint16 x, y` | Position, global units (top-left origin of the actor's logical point). |
| `Sint16 xdir, ydir` | Facing/travel direction, each −1, 0, or +1. `xdir` selects left vs right sprite. |
| `Sint16 xmove, ymove` | *Actual* displacement applied this frame (filled by the clip routines) — used by riding/scroll/contact math. |
| `Sint16 xspeed, yspeed` | Velocity, global/tic. |
| `Sint16 ticcount` | Accumulated tics in current state (for `tictime` animation timing). |
| `statetype *state` | Current state (see §1.2). |
| `Uint16 shapenum` | Current sprite chunk to draw (0 = invisible). |
| `Uint16 priority` | Sprite draw priority / z-order passed to RF. |
| `left,top,right,bottom,midx` | Global-space bounding box + horizontal midpoint (recomputed from sprite table each clip). |
| `tileleft..tilebottom,tilemidx` | Same box in tile coords (box >> 8). |
| `hitnorth,hiteast,hitsouth,hitwest` | Collision result flags for this frame. **`hitnorth`/`hitsouth` carry the wall's slope index (0=no floor, 1=flat, 2..7 = slope tables, plus special values). `hitnorth==25` is the sentinel meaning "standing on a sprite/platform" (set in ClipToSpriteTop/ClipToSprite, CK_STATE.C:912,988).** `hiteast`/`hitwest` are 0 or the wall value (normally 1). |
| `temp1..temp4` | Per-actor scratch (AI counters; for `stunnedobj`, `temp4` stores original `obclass`, `temp3` the star-sprite handle — see StunObj/R_Stunned). |
| `void *sprite` | Opaque RF sprite handle. |
| `next, prev` | Doubly linked active list. |

### 1.2 `statetype` — the state/animation node (CK_DEF.H:282-295)

```
leftshapenum, rightshapenum   // sprite for each facing; 0 => think set it; -1 => invisible
progress  (step,slide,think,stepthink,slidethink)   // how this state advances
skippable  (boolean)          // may excess-tic logic skip past it
pushtofloor (boolean)         // keep glued to a 45° slope while moving
tictime                       // duration in tics before nextstate (0 = infinite / think-only)
xmove, ymove                  // per-tic slide displacement for slide/slidethink states
(*think)(ob)                  // AI, runs during the state
(*contact)(ob, hit)           // sprite-vs-sprite collision handler
(*react)(ob)                  // post-move: draw + side effects
*nextstate                    // state entered when tictime elapses
```

The `progress` field is the dispatch selector in `DoActor`:
- **`think`**: pure think state; calls `think(ob)` every frame, never advances by time, no movement (CK_STATE.C:1026-1040). Used for idle/AI-driven states.
- **`slide`**: adds `xmove/ymove × tics` to `xtry/ytry` (movement accumulators), advances by `tictime`.
- **`step`**: advances by `tictime`, movement only applied as a lump at state transition.
- **`stepthink` / `slidethink`**: like step/slide but *also* call `think` each frame.

Two module-level singletons: `sc_deadstate` (all-null think state, CK_STATE.C:1965) and `sc_badstate` (points `think/contact/react` all at `BadState`→`Quit`, CK_STATE.C:1967) as a poison value.

### 1.3 Dispatch: `DoActor` → `StateMachine` (the per-actor update)

**`DoActor(ob, numtics)` (CK_STATE.C:1019-1121)** advances one actor by `numtics` and returns *excess* tics that overflow into the next state:
1. If `progress==think`: run think (honoring nothink), return 0. No timing.
2. Else `ticcount += numtics`. If still within `tictime` (or `tictime==0`): accumulate slide movement into `xtry/ytry` (`xtry += ±numtics*state->xmove`, sign from `xdir`; CK_STATE.C:1051-1056), run think for slidethink/stepthink, return 0.
3. Else the state's time is exhausted: compute `usedtics`/`excesstics`, apply the remaining slide movement (or the lump step move), run think, then advance `ob->state = state->nextstate` (unless think already changed state, or think removed the object → state==NULL, return 0). Return `excesstics` (CK_STATE.C:1071-1120).

**`nothink` optimization (CK_STATE.C:1030-1037, 1060-1067, 1101-1108):** every place a think would fire, if `ob->nothink != 0` it decrements `nothink` and *skips the think* instead. This cheaply freezes an actor's AI for N frames (e.g. R_Walk sets `nothink = US_RndT()>>5`, 0..7, after turning around — CK_STATE.C:1779). **Reimplement:** `if (nothink>0){nothink--; skip think}`.

**`StateMachine(ob)` (CK_STATE.C:1136-1214)** is the top-level driver called once per active actor per frame:
1. Zero `xmove,ymove,xtry,ytry`; remember `oldshapenum`.
2. `excesstics = DoActor(ob, tics)`; if state changed, reset `ticcount=0`.
3. **Excess-tic loop (1153-1171):** while `excesstics`, keep running `DoActor` through subsequent states so a single 5-tic frame can traverse multiple short states. Guard: if a state is *not* `skippable` and `tictime <= excesstics`, it runs `DoActor(ob, tictime-1)` so the state is not skipped over entirely (guarantees non-skippable states are seen at least a frame).
4. If `state==NULL` → object removed itself → `RemoveObj` and return.
5. Resolve `shapenum` from `rightshapenum`/`leftshapenum` by `xdir` (unless `rightshapenum==0`, meaning think set it). `shapenum==-1` → 0 (invisible this frame).
6. **If anything moved or the shape changed or `hitnorth==25`** (CK_STATE.C:1199): run collision — `FullClipToWalls` if `cl_fullclip`, else `ClipToWalls`.

`NewState` (1227-1266) sets a state and recomputes the box *without* re-running think (used to enter a state cleanly); `ChangeState` (1279-1308) sets state, zeroes `ticcount`, flags `needtoreact`, and re-clips unless `hitnorth==25`.

### 1.4 Active / inactive regions (sleep & wake) — exact rules

Computed in `CenterActor`/`ScrollScreen`/`WorldScrollScreen` (CK_PLAY.C:1393-1414 etc.): after each scroll the engine derives, in **tile** coords,
```
originxtilemax = originxtile + PORTTILESWIDE - 1;   originytilemax = originytile + PORTTILESHIGH - 1;
inactivateleft   = max(0, originxtile   - INACTIVATEDIST);
inactivateright  = max(0, originxtilemax + INACTIVATEDIST);
inactivatetop    = max(0, originytile   - INACTIVATEDIST);
inactivatebottom = max(0, originytilemax + INACTIVATEDIST);
```
(`INACTIVATEDIST` = 4 tiles Keen4/6, 6 tiles Keen5.)

**Wake rule** (PlayLoop, CK_PLAY.C:2211-2217): an inactive actor (`!active`) whose tile-box overlaps the *screen expanded by 1 tile* (`tileright >= originxtile-1 && tileleft <= originxtilemax+1 && tiletop <= originytilemax+1 && tilebottom >= originytile-1`) is woken: `needtoreact=true; active=ac_yes`.

**Sleep rule** (CK_PLAY.C:2220-2241): an active actor whose tile-box lies entirely outside the inactivate rectangle (`tileright<inactivateleft || tileleft>inactivateright || tiletop>inactivatebottom || tilebottom<inactivatetop`):
- if `active==ac_removable` → `RemoveObj` immediately;
- else if `active != ac_allways` → **probabilistic sleep**: only if `US_RndT() < tics*2` (or screen faded / just loaded) does it remove its sprite and set `active=ac_no`. The randomness spreads deactivation over several frames so a whole screen-edge doesn't pop at once.
- `ac_allways` actors never sleep.

Newly-spawned actors are marked `active=ac_no` at the end of ScanInfoPlane (except `ac_allways`, K4_SPEC.C:620-624), so they wake only when the camera reaches them.

---

## 2. PHYSICS HELPERS (complete, with numbers)

All accumulate into the frame's `xtry`/`ytry` (global units), which `ClipToWalls` later consumes. **The "odd-tic" trick:** to keep 16-bit precision, acceleration is applied only on *odd* absolute tic indices — the loop `for(i=lasttimecount-tics; i<lasttimecount; i++) if(i&1){…}` (e.g. CK_STATE.C:1348-1350). Since `lasttimecount` counts real 70 Hz ticks, roughly half of elapsed ticks accelerate. Velocity is added *every* tic regardless.

### 2.1 Gravity

- **`DoGravity` (CK_STATE.C:1342-1366):** per odd tic `yspeed += 4`, clamped to **max 70** global/tic (≈306 px/s terminal). Special: if rising with `yspeed` in `[-4,-1]`, it applies the residual then zeroes `yspeed` and returns (soft apex). Every tic: `ytry += yspeed`.
- **`DoWeakGravity` (1377-1401):** identical but `+3` per odd tic; same 70 cap; apex window `[-3,-1]`.
- **`DoTinyGravity` (1412-1430):** `+1` per **every-4th** tic, cap 70. **Documented bug:** the cadence test `if (!i & 3)` parses as `((!i) & 3)` (true only when `i==0`), so in practice it barely accelerates — replicate the *intended* "every 4th tic +1" only if you want the bug-free version; the shipped game effectively applies near-zero extra gravity here.

### 2.2 Horizontal acceleration

- **`AccelerateX(ob, dir, maxspeed)` (1441-1471):** per odd tic `xspeed += dir`, clamped to ±`maxspeed`. **On a sign flip of `xspeed` it also flips `ob->xdir`** (so the sprite faces the new travel direction). Every tic `xtry += xspeed`.
- **`AccelerateXv` (1484-1507):** same but **does not touch `xdir`** (the "v" = velocity-only variant; use when facing must stay fixed while sliding).

### 2.3 Vertical acceleration

- **`AccelerateY(ob, dir, maxspeed)` (1518-1541):** per odd tic `yspeed += dir`, clamp ±maxspeed; every tic `ytry += yspeed`. (No sign/direction coupling.)

### 2.4 Friction

- **`FrictionX` (1552-1586):** picks `friction = -sign(xspeed)`; per odd tic `xspeed += friction`; if `xspeed` crosses zero (sign changed vs. captured `oldsign`) it snaps `xspeed=0`. Adds `xspeed` to `xtry` each tic. Net decel ≈ 1 global/tic per odd tic.
- **`FrictionY` (1597-1629):** same for `yspeed`/`ytry`. **Known bug:** `oldsign` is never initialized (1622), so the zero-cross snap is unreliable — in a clean reimplementation just snap when the sign actually flips.

### 2.5 Projectile / velocity thinks

- **`T_Projectile` (1665-1669):** `DoGravity(ob); xtry = xspeed*tics;` — ballistic arc with full gravity, constant horizontal speed. Used by thrown/lobbed objects.
- **`T_WeakProjectile` (1680-1684):** same with `DoWeakGravity`.
- **`T_Velocity` (1695-1699):** `xtry = xspeed*tics; ytry = yspeed*tics;` — straight-line constant-velocity, no gravity (shots, flying things).
- **`ProjectileThink1`** declared (CK_DEF.H:498) but defined per-game.

Support: `SetReactThink` (1710) just sets `needtoreact`; `T_Stunned` (1724-1730) animates stun stars (cycles `temp2` 0→1→2); `C_Lethal` (1741-1748) is the generic contact that calls `KillKeen()` when the hit object is `keenobj`.

---

## 3. REUSABLE REACTORS (react functions in CK_STATE.C)

React functions run in PlayLoop's *third* pass (post-movement) when `needtoreact` is set. The shared ones defined here:

- **`R_Draw(ob)` (1759-1762):** the universal reactor — `RF_PlaceSprite(&ob->sprite, x, y, shapenum, spritedraw, priority)`. **Used ~138× across Keen 4 actors** (the default "just draw me"). Any actor that only needs to appear on screen uses this.

- **`R_Walk(ob)` (1773-1797):** ground-walker turn logic + draw. If moving right and `hitwest` (hit a wall) → undo x (`x -= xmove`), flip `xdir` to −1, set `nothink = US_RndT()>>5` (0..7), `ChangeState` to re-enter same state; symmetric for left/`hiteast`; **and if `!hitnorth` (no floor ahead — walked off a ledge)** → also turn around. Then draw. **Effect: patrols a platform, reversing at walls *and* edges.** Used by ~17 Keen-4 actors (basic walkers).

- **`R_WalkNormal(ob)` (1810-1834):** like R_Walk but the edge/hazard test is `!hitnorth || (hitnorth & ~7)` — i.e. turn around at walls, at true ledges, **or when the floor tile ahead has a *special* (non-slope) north wall value (>7, e.g. a deadly tile)**. On reversal it steps back `xmove*2` (not `*1`). **Effect: a walker that refuses to step onto hazardous/special floor tiles.** Used 3× in Keen 4 (comment at 1805: "will not walk onto tiles with special (e.g. deadly) north walls").

- **`R_Stunned(ob)` (1859-1961):** the shared reactor for any `stunnedobj`. Kills horizontal speed on side hits, vertical on floor hit; on `hitnorth` (landed) zeroes both speeds and advances to `nextstate` if present. Draws the body sprite, then draws orbiting **stun-stars** at a per-original-class offset (big `switch(temp4)` giving `starx/stary` per enemy type, 1879-1949) cycling `temp2` every 10 tic-units. This is why every stunnable enemy shows the same spinning stars.

- **`BadState()` (1845-1848):** `Quit("Object with bad state!")` — poison.

**Note on "R_Bounce":** there is **no shared `R_Bounce` in CK_STATE.C.** Bouncing reactors are per-game (e.g. `R_MimBounce`, `R_Bounder` in `KEEN4/K4_ACT2.C`/`K4_ACT3.C`). The reusable set is exactly `R_Draw`, `R_Walk`, `R_WalkNormal`, `R_Stunned` (+ `R_Shot` in CK_KEEN2.C). Treat bounce as actor-specific.

---

## 4. CLIPPING & COLLISION RESOLUTION

### 4.1 The wallclip slope table (CK_STATE.C:33-42)

`Sint16 wallclip[8][16]` gives, **for each of 16 horizontal pixel columns in a tile, the surface height (in global units, 0..256) of a floor/ceiling slope**. Row index = the wall's slope value (`wall & 7`):
- Row 0 = all 256 (solid full-height).
- Row 1 = all 0 (flat floor at tile top).
- Rows 2,3 = gentle up-slopes (0→0x78, 0x80→0xf8).
- Row 4 = steep up-slope (0→0xf0 in steps of 0x10).
- Rows 5,6 = down-slopes (mirror of 2,3).
- Row 7 = steep down-slope.

A floor tile is "flat" when its NORTHWALL value is 1; values 2..7 are slopes; higher values (& masking) encode special/deadly floors used by `R_WalkNormal`. Ceilings use SOUTHWALL similarly.

### 4.2 `ClipToWalls(ob)` — the main tile clipper (CK_STATE.C:434-601)

Per-frame order:
1. **Pushtofloor pre-adjust (450-468):** if the state has `pushtofloor` and the actor isn't already on a sprite (`hitnorth!=25`), force `ytry = |xtry|+16` so it hugs a 45° slope (or `ytry=145` if `hitnorth==25`).
2. **Clamp the move (473-488):** `xtry` to ±239, `ytry` to −239..+255 (+16 headroom for push-to-floor) — **movement is capped to under one tile per frame**, guaranteeing collision only needs to check adjacent tiles.
3. Apply `x += xtry; y += ytry`; set `needtoreact`. Bail if `shapenum==0` (no hitbox).
4. Save `old*` box, recompute box from the sprite table (`shape->xl/xh/yl/yh`) and tile coords; zero all four `hit*`.
5. **If `needtoclip`:** compute `*moved` deltas, then resolve in this axis order:
   - **`ClipToEnds(ob)` (vertical, 213-257):** scans the column at `tilemidx` from `oldtilebottom-1..tilebottom` looking for a NORTHWALL (floor); computes penetration via `wallclip[wall&7][midxpix]`; if within `maxmove` window, sets `hitnorth=wall` and `MoveObjVert` up to rest on the floor. Then scans upward for SOUTHWALL (ceiling) and pushes down. (Documented bugs: unsigned loop underflow if `tiletop==0`; missing `return` after ceiling hit.)
   - **Player-only edge kludges (541-551):** when the player is pushed and hasn't hit a floor/ceiling, `PlayerBottomKludge`/`PlayerTopKludge` (109-203) do a "zero tolerance near the edge" correction so Keen doesn't clip through corners of slopes.
   - **`ClipToSides(ob)` (horizontal, 267-302):** for each tile row spanned (top adjusted +1 if on a steep ceiling, bottom −1 if on a steep floor), check EASTWALL on the left column → push right to the tile boundary and set `hiteast`; else check WESTWALL on the right column → push left and set `hitwest`. First hit wins (returns).
   - **Keen-6 slope-unstick hack (554-578):** extra corner correction when the player is simultaneously on a slope and hitting a side wall.
6. **Pushtofloor finalize (581-597):** if pushed but found no floor, revert Y and keep only the X move.
7. Accumulate the *actual* applied delta into `ob->xmove/ymove` (599-600) — this is what riding/scroll/sprite-contact math reads.

**Per-axis order is therefore: vertical (floor then ceiling) → player corner kludges → horizontal (east then west).** Vertical resolves first so slopes read correctly before side pushes.

### 4.3 `FullClipToWalls(ob)` (CK_STATE.C:613-747)

Bounding-box clipper for `cl_fullclip` actors (big flyers/swimmers). Uses a **hardcoded w×h per obclass** (e.g. Keen4 `keenobj` 40×24 px, `eggbird` 64×32, `dopefish` 88×64, `schoolfish` 16×8; default → `Quit`). Moves both axes, then via `CheckPosition` (312-364, scans every tile in the box for any of the 4 wall flags) does an **undo-X-then-undo-Y** resolution: try removing horizontal move; if that frees it set hiteast/hitwest; else it was the vertical move, set hitnorth/hitsouth and undo Y. Coarser than ClipToWalls (no slopes), suitable for free-swimming/flying.

`PushObj` (759-820) is a lightweight ClipToWalls (no pushtofloor, no clamp) used when one sprite shoves another.

### 4.4 Sprite-vs-sprite contact

Dispatch happens in PlayLoop (CK_PLAY.C:2254-2282): O(n²) over active pairs; AABB overlap test (`right>left && left<right && top<bottom && bottom>top`); if overlapping, call **both** objects' `state->contact(self, other)` (each side gets a turn). The helpers:

- **`ClipToSpriteSide(push, solid)` (835-870):** horizontal-only push: computes `leftinto`/`rightinto` penetration vs the solid, moves `push` out via `ClipToWalls`, sets `hiteast`/`hitwest`. Bounded by how far the solid actually moved (`solid->xmove - push->xmove`) so you can only be pushed as fast as the pusher moves.
- **`ClipToSpriteTop(push, solid)` (885-915):** lets `push` **stand on** `solid`. If bottom penetration is within the vertical closing speed, sets `gamestate.riding = solid` (when push is the player), snaps `push` onto the top, and marks **`hitnorth = 25`** (the "on a platform" sentinel) unless it hit real ground. This is the moving-platform ride mechanic.
- **`ClipToSprite(push, solid, squish)` (930-1002):** full 4-side solid-sprite clip. Left/right first (zeroing `xspeed`, `PushObj`), then bottom (ride, `hitnorth=25`) / top. If `squish` is set and the push gets pinned against a wall on the opposite side, `KillKeen()` (crush death). (Documented bug at 992: the top-penetration test compares against `ymove` instead of `-ymove`.)

**Reimplementation guidance:** platforms/solids should expose their `xmove/ymove` this frame; the player's carry/crush logic keys off `hitnorth==25` and `gamestate.riding`.

---

## 5. THE GAME LOOP

### 5.1 `PlayLoop` (CK_PLAY.C:2180-2422)

Setup: `StartMusic(mapon)`; clear held-button latches; `ingame=true`; `playstate=ex_stillplaying`; `invincible=keenkilled=oldfirecount=0`; `CenterActor(player)`; seed RNG (`US_InitRndT(!DemoMode)` — deterministic in demos, 2194-2199); `TimeCount=lasttimecount=tics=3` (2200).

Each frame (`do…while(playstate==ex_stillplaying)`):
1. **`PollControls()`** (1917-1990) — reads keyboard/joystick/Gravis, resolves jump/pogo/fire buttons; handles the "two-button" and Gravis mappings and button-hold latches.
2. **Think/move pass (2209-2244):** iterate the linked list from `player`. Wake/sleep per §1.4, then `StateMachine(obj)` for active objects.
3. **Riding (2246-2249):** if `gamestate.riding` set, `HandleRiding(player)` (in CK_KEEN.C) carries Keen with the platform.
4. **Contact pass (2254-2282):** pairwise AABB → dual `contact` dispatch (§4.4).
5. **In-tiles (2287-2294):** `CheckInTiles(player)` on a level, or `CheckWorldInTiles(player)` on the world map — handles item pickups, doors, hazards, teleporters (INTILE_* enum, CK_DEF.H:141-182).
6. **React pass (2299-2322):** for each active obj: **if `tilebottom >= mapheight-1`** (fell out the bottom of the map) → if it's Keen `playstate=ex_died`, else `RemoveObj`. Otherwise, if `needtoreact && state->react`, clear the flag and run react (draw + effects).
7. **Camera + scorebox (2327-2343):** `ScrollScreen(player)` on levels (Keen4: except mapon 0 and 17, which use `WorldScrollScreen`), else `WorldScrollScreen`; then `UpdateScore(scoreobj)`.
8. **`RF_Refresh()`** (2349) — blits, and recomputes `tics` via `RF_CalcTics` for the *next* iteration (adaptive timing, MINTICS..MAXTICS).
9. **Timers (2351-2363):** decay `invincible` and (Keen6) `groundslam` by `tics`.
10. **Debug pacing (2367-2378):** `singlestep` → `VW_WaitVBL(14)` (~5 fps slow-mo); `extravbls` → extra vblanks.
11. **Input/exit (2383-2416):** in demo playback any user input ends the level; otherwise `CheckKeys()`. The `E-N-D` chord triggers the game-specific "rescue/win" exit.

Exit: `ingame=false; StopMusic()`.

**MAXTICS role:** because `tics` is capped at 5 and each frame's movement is further capped to <1 tile in ClipToWalls, the simulation can never tunnel through walls even on a slow machine (long frames just make things move in a capped step and `TimeCount` is rolled back, ID_RF.C:1590-1594).

### 5.2 Camera — `ScrollScreen` (CK_PLAY.C:1527-1723), exact rules

- **Bail if `keenkilled`.** (1532)
- **Level-complete edges (1538-1542):** if `left < originxmin` or `right > originxmax + 320px` → `playstate=ex_completed` (walked off the level's side).
- **Fell off the world bottom (1547-1554):** if `bottom > originymax + 13 tiles` → nudge back, `SND_PLUMMET`, disable godmode, `KillKeen()`.
- **Horizontal dead-zone (1558-1565):** scroll only when Keen's `x` is left of `originxglobal + 9 tiles` or right of `originxglobal + 12 tiles`. **So the horizontal dead zone is tiles 9–12 of the 21-wide viewport (a 3-tile band roughly centered).**
- **Look-up / look-down (1567-1592):** in `s_keenlookup2` the camera pans up (`centerlevel` toward 167), in `s_keenlookdown3` pans down (toward 33), at `tics` px/frame.
- **Vertical follow (1607-1661):** when Keen is grounded (`hitnorth`), noclip, or holding on: target `bottom = originyglobal + centerlevel(px)`; move the camera toward Keen's bottom at a speed = `(Δpx global)>>7`, capped at 0x30, ×tics, with a floor of 0x10 (or the exact remaining distance if <0x10). `centerlevel` defaults to 140 (CenterActor sets it, 1354) — **Keen sits ~140 px down the 200-px view when grounded.** When airborne and not grounded, `centerlevel` resets to 140 (1660).
- **Vertical clamp (1663-1672):** keep Keen's bottom within `[bottom-32px, bottom+32px]` of the view edges (prevents the camera lagging too far).
- **Keen-6 ground-slam screen shake (1594-1604):** a `shaketable` offsets `yscroll` during a pogo slam.
- **Speed clamp + apply (1680-1696):** `xscroll`/`yscroll` each clamped to ±0xFF (≤1 tile/frame), then `RF_Scroll`; recompute the active-region limits (§1.4).

`WorldScrollScreen` (1429-1512) is simpler: horizontal dead zone tiles 9–12, vertical dead zone tiles 5–7, both clamped to ±0xFF/frame; no look/slam/fall logic.

`CenterActor` (1350-1415): snaps the camera so Keen sits 152 px from the left; vertically 80 px (world map) or `bottom-140px` (levels); then rebuilds active-region limits.

### 5.3 Spawning — `ScanInfoPlane` (Keen 4, K4_SPEC.C:303-636) — COMPLETE TABLE

Called by `SetupGameLevel` (CK_GAME.C:440-510) after `CA_CacheMap`+`RF_NewMap`. It walks **map plane 2 (the info/objects plane)**, and for each nonzero tile value `info` dispatches a spawn. `InitObjArray()` (CK_PLAY.C:1761-1785) first clears the actor list and reserves slot 0 = player, slot 1 = scoreobj.

**Difficulty gating pattern (fall-through cases):** high-numbered "hard-only" and "normal-only" copies of an actor fall through into the base case, guarded by `if (difficulty < gd_Hard) break;` / `if (difficulty < gd_Normal) break;`. Difficulty enum: `gd_Continue=0, gd_Easy=1, gd_Normal=2, gd_Hard=3` (ID_US.H:80-86). So an Easy game skips both guarded tiers; Normal spawns the "≥Normal" copies; Hard adds the "≥Hard" copies. (In demos, difficulty is forced `gd_Normal`, CK_GAME.C:448.)

**Complete Keen-4 info-plane spawn table** (info value → action → graphics lump):

| info | Spawn | Difficulty | Lump |
|---|---|---|---|
| 1 | `SpawnKeen(x,y,+1)` + Score | all | KEEN_LUMP |
| 2 | `SpawnKeen(x,y,-1)` + Score | all | KEEN_LUMP |
| 3 | `SpawnWorldKeen` + Score | all | WOLRDKEEN_LUMP |
| 4 | `SpawnCouncil` | all | COUNCIL_LUMP |
| 5 / 49 / 50 | `SpawnBerkeloid` | 5=all, 49=≥Normal, 50=≥Hard | BERKELOID_LUMP |
| 6 | `SpawnLindsey` | all | LINDSEY_LUMP |
| 7 / 51 / 52 | `SpawnWormMouth` | 7=all, 51=≥Normal, 52=≥Hard | WORMOUTH_LUMP |
| 8 / 45 / 46 | `SpawnSkypest` | 8=all, 45=≥Normal, 46=≥Hard | SKYPEST_LUMP |
| 9 | `SpawnCloudster` | all | THUNDERCLOUD_LUMP |
| 10 | `SpawnFoot` (+ marks SMOKE1..4) | all | INCHWORM_LUMP |
| 11 | `SpawnInchworm` (+ SMOKE1..4) | all | INCHWORM_LUMP |
| 12 | `SpawnBounder` | all | BOUNDER_LUMP |
| 13 | `SpawnEggbird` | all | EGGBIRD_LUMP + EGG_LUMP |
| 14 / 47 / 48 | `SpawnLick` | 14=all, 47=≥Normal, 48=≥Hard | LICK_LUMP |
| 15 / 87 / 88 | `SpawnDopefish` | 15=all, 87=≥Normal, 88=≥Hard | DOPEFISH_LUMP |
| 16 | `SpawnSchoolfish` | all | SCHOOLFISH_LUMP |
| 17 / 23 / 24 | `SpawnPixie` | 17=all, 23=≥Normal, 24=≥Hard | SPRITE_LUMP |
| 18 | `SpawnEater` (Treasure Eater) | all | EATER_LUMP |
| 19 | `SpawnMimrock` | all | MIMROCK_LUMP |
| 20 / 73 / 74 | `SpawnArachnut` | 20=all, 73=≥Normal, 74=≥Hard | ARACHNUT_LUMP |
| 21 | `SpawnMadMushroom` | all | MADMUSHROOM_LUMP |
| 22 / 43 / 44 | `SpawnSlug` | 22=all, 43=≥Normal, 44=≥Hard | SLUG_LUMP |
| 25 | `RF_SetScrollBlock(x,y,1)` (horiz scroll stop) | all | — |
| 26 | `RF_SetScrollBlock(x,y,0)` (vert scroll stop) | all | — |
| 27–30 | `SpawnPlatform(x,y,info-27)` (dir 0..3) | all | PLATFORM_LUMP |
| 32 | `SpawnDropPlat` | all | PLATFORM_LUMP |
| 33 | `SpawnMiragia` | all | — |
| 34 | `SpawnBonus(x,y,11)` **only if `ammo<5`** | all | bonuslump[11] |
| 35 | `SpawnScuba` (+ mark SCUBASPR) | all | — |
| 42 | `SpawnSwimKeen` + Score (+ mark pickup shapes) | all | SCUBAKEEN_LUMP |
| 53–56 | `SpawnDartShooter(x,y,info-53)` (dir 0..3) | all | DARTS_LUMP |
| 79–82 | `SpawnDartShooter(info-79)` | ≥Normal | DARTS_LUMP |
| 83–86 | `SpawnDartShooter(info-83)` | ≥Hard | DARTS_LUMP |
| 57–68 | `SpawnBonus(x,y,info-57)` (12 pickup types) | all | bonuslump[info-57] |
| 69–72 | `SpawnMine(x,y,info-69)` (dir 0..3) | all | MINE_LUMP |
| 75 | (mark MOON_LUMP only — the exit moon) | all | MOON_LUMP |
| 76 / 77 / 78 | `SpawnEggbirdOut` | 76=all, 77=≥Normal, 78=≥Hard | EGGBIRD_LUMP |

After the scan: all non-`ac_allways` actors are set `active=ac_no` (asleep until camera arrives, 620-624), and every marked lump's graphics chunks are queued via `CA_MarkGrChunk` (626-635). **Lumps** = contiguous sprite-chunk ranges; marking one loads all frames for that actor class at once.

### 5.4 Level restart / death / completion flow (`GameLoop`, CK_GAME.C:800-991; `HandleDeath`, 694+)

`GameLoop` is the outer loop around `PlayLoop`:
- Sets `gamestate.difficulty = restartgame` on a fresh start (824), then `restartgame=gd_Continue`.
- `SetupGameLevel(true)` loads map + spawns; on out-of-memory, drops the player to the world map (mapon 0) and retries; hard-fails only if even the world map won't fit.
- Runs `PlayLoop()`, then dispatches on `playstate`:
  - `ex_died` → **`HandleDeath()`**: clears keys, `lives--`; if `lives>=0` shows a "You didn't make it past <level> / Try Again / Exit to <world>" menu (694-786) — Try Again re-enters the same level, Exit sends Keen to the world map (`mapon=0`).
  - `ex_completed`/`ex_foot`/`ex_portout` → play `SND_LEVELDONE`, mark `leveldone[mapon]=true`, return to world map (mapon 0).
  - `ex_rescued` (Keen4) → mark rescue; when all 8 council members rescued → finale + high score.
  - `ex_resetgame`/`ex_loadedgame` → `goto reset`/`loaded` (restart or resume a loaded save).
  - `ex_abortgame` → leave to menu.
- The whole loop continues `while (gamestate.lives >= 0)`; when lives go negative → `GameOver()` → high-score check.

Keys reset between levels (856-859); on death keys are cleared and a life is spent. Level state persists in `gamestate.leveldone[]`.

---

## 6. DIFFICULTY FLAGS — every mechanism

Enum `gd_Continue=0, gd_Easy=1, gd_Normal=2, gd_Hard=3` (ID_US.H:80-86). Stored in `gamestate.difficulty` (CK_DEF.H:339). Chosen at new-game via the menu (`restartgame` set to gd_Easy/Normal/Hard, CK_KEEN.C references), copied into `gamestate.difficulty` in `GameLoop` (CK_GAME.C:824). **Forced to `gd_Normal` during demos** (CK_GAME.C:448, and SetupGameLevel).

Effects observed:
1. **Spawn gating (the main effect):** the fall-through `if (difficulty < gd_Hard) break;` / `if (difficulty < gd_Normal) break;` pattern throughout `ScanInfoPlane` (K4_SPEC.C:353-611). Every enemy with "extra" copies (Berkeloid, Wormmouth, Skypest, Lick, Dopefish, Pixie, Arachnut, Slug, dart shooters, Eggbird-out) gets **more instances on Normal, even more on Hard**. Easy spawns only the base (all-difficulty) copies. This is the primary difficulty lever — the maps physically contain three tiers of enemy placements.
2. **Status window readout:** `DrawStatusWindow` prints "Easy/Normal/Hard" (CK_PLAY.C:1076-1087).
3. **No global speed/HP scalar:** difficulty does **not** multiply enemy speed, gravity, or hitpoints anywhere in these files — the game is made harder purely by *quantity and placement* of hazards (and by which enemies exist at all). Individual actor thinks may branch on difficulty inside the per-game K4/K5/K6 files, but the shared framework does not.
4. **Item tile `34`** spawns an ammo bonus only if `gamestate.ammo < 5` (K4_SPEC.C:526) — an ammo-starvation catch-up, independent of difficulty but part of the same spawn scan.

**Reimplementation note:** model three placement layers in your Tiled/info data (all / normal+ / hard+) and filter at level-load by the chosen difficulty, exactly mirroring the fall-through gating. Force Normal for any recorded/deterministic playback.

---

## 7. IMPLEMENTATION CHECKLIST / GOTCHAS FOR THE PHASER PORT

- Fixed-point everything: keep positions & velocities in **global units (÷16 = px, ÷256 = tile)**; convert to screen px only at draw. Run the sim at a fixed **70 Hz tick**, batching 2–5 ticks per rendered frame (adaptive), never more than 5.
- Reproduce the **odd-tic acceleration cadence** or physics will feel ~2× too strong.
- Movement is **capped <1 tile/frame** before clipping — preserve this to keep tunneling impossible.
- `hitnorth==25` is a **magic sentinel for "riding a sprite"** — keep an explicit boolean instead of a numeric collision code.
- Resolve tile collision **vertical-first (floor, then ceiling), then horizontal**, with slope heights from a 8×16 `wallclip` lookup.
- The **nothink** counter and the **probabilistic off-screen deactivation** (`US_RndT() < tics*2`) are behavioral fingerprints — replicate for faithful feel, or replace with deterministic timers if determinism matters more than fidelity.
- Several **documented original bugs** exist (FrictionY uninit `oldsign`, DoTinyGravity `!i & 3`, ClipToEnds unsigned underflow & missing return, ClipToSprite top test) — reimplement the *intended* behavior, not the bug, for a children's game.

---

## 10-LINE SUMMARY

1. Actors are `objtype` structs in a 100-slot doubly-linked active list; each carries a `statetype*` whose `progress` field (think/step/slide/…) drives `DoActor`→`StateMachine` dispatch each 70 Hz tick.
2. `nothink` cheaply freezes an actor's AI for N think-calls; off-screen actors sleep probabilistically (`US_RndT()<tics*2`) beyond an INACTIVATEDIST (4 tiles K4/6, 6 K5) margin and wake when the camera's screen+1-tile touches them.
3. Physics accumulate into `xtry/ytry` (global units, 16=1px); acceleration fires only on odd ticks; DoGravity +4/tic (cap 70≈306 px/s), DoWeakGravity +3, DoTinyGravity +1 (buggy cadence).
4. `AccelerateX` (flips xdir) vs `AccelerateXv` (doesn't); `AccelerateY`; `FrictionX/Y` decay ~1/odd-tic to zero; `T_Projectile/T_WeakProjectile/T_Velocity` are the motion thinks. Speed→px/s = ×4.375.
5. Shared reactors: `R_Draw` (draw, ~138 users), `R_Walk` (turn at walls+ledges), `R_WalkNormal` (also refuse special/deadly floor tiles), `R_Stunned` (stun-star animation); "R_Bounce" is per-actor, not shared.
6. `ClipToWalls` clamps motion to <1 tile, then resolves vertical (floor→ceiling via the 8×16 `wallclip` slope table) → player corner kludges → horizontal (east→west); `FullClipToWalls` is a per-class AABB clipper; `hitnorth==25` = riding a sprite.
7. Sprite-vs-sprite: PlayLoop's O(n²) AABB pass calls both objects' `contact`; helpers `ClipToSpriteSide/Top/Sprite` push/carry/crush, setting `gamestate.riding`.
8. PlayLoop = poll→think/move(+wake/sleep)→riding→contact→intiles→react(+bottom-of-map death)→ScrollScreen+UpdateScore→RF_Refresh(recompute tics, MINTICS 2/MAXTICS 5).
9. Camera dead-zone: horizontal tiles 9–12, grounded vertical target `centerlevel≈140px`; `ScanInfoPlane` walks map plane 2 with a full spawn table whose fall-through cases gate enemies by `difficulty < gd_Hard/gd_Normal`.
10. Difficulty (Continue/Easy/Normal/Hard, forced Normal in demos) changes **only enemy quantity/placement** via three spawn tiers — no speed/HP scaling in the shared framework; death/restart flows through GameLoop↔HandleDeath (Try Again vs exit to world map), lives<0 → GameOver.

**Report status:** delivered inline (read-only agent; no file written). Intended path was `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/keen-framework.md`.