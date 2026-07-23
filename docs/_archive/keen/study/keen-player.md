I have everything I need. Note: I operate in read-only mode and have no file-writing tools, so per my operating rules I am delivering the full report inline as my final message (the parent agent consumes this text directly). The intended path was `.../scratchpad/study/keen-player.md`; the complete content follows.

---

# Commander Keen 4–6 (Galaxy engine) — COMPLETE Player Study: CK_KEEN.C + CK_KEEN2.C

**Header note — ZERO code will be copied.** This is a behavioral/numeric study of the reconstructed CK_KEEN.C (2509 lines) and CK_KEEN2.C (1605 lines) to inform a *from-scratch* TypeScript/Phaser reimplementation. No source lines are transcribed beyond the ≤1-line citations the brief permits. All file:line references are to the two named files unless another file is named.

## 0. Engine substrate you must model first (units, tick, state machine)

These govern every number below; cited from headers/CK_STATE.C so the player numbers are unambiguous.

- **Coordinate units.** Three spaces (ID_RF.H:69-71): *global* units, *pixels*, *tiles*. `G_P_SHIFT=4` → **16 global units = 1 pixel**; `G_T_SHIFT=8` → **256 global units = 1 tile**; `P_T_SHIFT=4` → 16 px = 1 tile. `PIXGLOBAL`=16, `TILEGLOBAL`=256. Keen's hitbox is stored in global (`ob->x/y/left/right/top/bottom`) and derived tile coords (`ob->tileleft…tilemidx`) (CK_DEF.H:304-313).
- **Tick rate.** The master clock `TimeCount`/`lasttimecount` runs at the Wolf/Keen **70 Hz** timer; each frame processes `tics` ticks, clamped `MAXTICS=5` (ID_RF.H:40; ID_RF.C:1590-1593). So 1 tic ≈ 14.3 ms; a lag frame can batch up to 5 tics. Demo playback forces `tics=DEMOTICS` (ID_RF.C:1568).
- **Unit→real conversion used throughout this report.** A speed value `v` in *global units/tic* equals `v/16` px/tic; at 70 tics/s that is **`v × 4.375` px/s**. (I list both forms in §3.)
- **State record** `statetype` fields, in order (CK_DEF.H:282-295): `leftshapenum, rightshapenum, progress{step,slide,think,stepthink,slidethink}, skippable, pushtofloor, tictime, xmove, ymove, *think, *contact, *react, *nextstate`. Every Keen state below is one of these records.
- **How a state advances (DoActor / StateMachine, CK_STATE.C:1042-1214).** Each frame `StateMachine` zeroes `xmove/ymove/xtry/ytry` (1141) then calls `DoActor(ob,tics)`. `ob->ticcount += numtics`; if `tictime` not yet reached (or `tictime==0`, i.e. "think forever"), it stays; else it rolls over, computes `excesstics`, and advances to `nextstate`, re-running with leftover tics (skippable/tictime logic 1158-1165). **`slide`/`slidethink` states auto-add motion** `xtry += ±numtics*xmove`, `ytry += ±numtics*ymove` scaled by `xdir/ydir` (1047-1096). `step`/`stepthink` add the full `xmove/ymove` once per state-entry, not per tic. `think`/`stepthink`/`slidethink` call the `think` routine (1058-1068, 1099-1108).
- **Movement is deferred via two globals** `xtry,ytry` (CK_STATE.C:44). Think routines and slide accumulate into them; then clipping (`ClipToWalls`/`FullClipToWalls`) applies them to `ob->x/y`, clamped to ≤239 units horizontally and ≤255 down/−239 up (one-tile max) (CK_STATE.C:473-491). This means **Keen physically cannot move more than ~15 px/frame** regardless of speed — a natural tunneling guard you must reproduce.
- **Collision result codes (`hitnorth/east/south/west`)** are the *tile wall-property value* `tinf[NORTHWALL+tile]` etc. Behavioral meanings inferred from usage across both files: `0`=no floor (open air), `1`=ordinary flat floor, `2..7`=slopes (index `&7` selects slope tables), `8..15` (`&~7==8`)=**deadly floor** (KillKeen), `17`=**pole-hole** pass-through, `25` (0x19)=**standing on a rideable sprite** (set by HandleRiding, CK_STATE.C:912), `33`=big switch / elevator floor (Keen 6 / Keen 5), `41`/`49`=leftward/rightward **conveyor/force floor**, `57`=Keen-5 **fuse** tile. These constants recur in every react routine.
- **`ChangeState` vs `NewState` vs direct `ob->state=…`.** `NewState` (1227) recalcs the hitbox with no-clip then re-clips; `ChangeState` (1279) resets `ticcount=0`, forces `needtoreact`, and re-clips unless riding (`hitnorth==25`). Directly assigning `ob->state=&s_x` (used pervasively in think routines) lets the *current* frame's tic budget carry into the new state.

---

## 1. THE COMPLETE PLAYER STATE MACHINE

Player scratch registers (documented at CK_KEEN.C:248-253 and CK_KEEN2.C:406-409): in-level `temp1`=idle pausetime, `temp2`=idle stagecount, `temp3`=walk-sound toggle; on world map `temp1`=facing dir, `temp2`=anim stage, `temp3`=shore-lock countdown. Global player timers: `jumptime` (CK_KEEN.C:239) = remaining tics of sustained upward thrust; `leavepoletime` (240) = timestamp guard against re-grabbing a pole; `moonok` (241) = Keen-4 mooning gate.

### 1.1 Spawn
`SpawnKeen(x,y,dir)` (265-276): sets `obclass=keenobj`, `active=ac_allways`, `priority=1`, positions at tile, `y -= 0xF1` (a −241-unit nudge marked "weird/TODO"), `ydir=1`, enters **s_keenstand**.

### 1.2 STANDING — `s_keenstand` (61) → think `KeenStandThink` (476-546)
- **Entry:** default resting state; also landing target from air/pogo, end of shooting, pull-up, switch, look-down-cancel.
- **State record:** stepthink, tictime 4, xmove 0, react `KeenStandReact`, self-looping.
- **Think, in priority order (485-543):**
  1. `c.xaxis≠0` → enter **s_keenwalk1**, immediately run `KeenWalkThink`, and apply a *quarter-strength* first nudge `xtry=(xdir*xmove*tics)/4` (490) — a deliberately soft start-of-walk.
  2. else `firebutton && !fireheld` → set `fireheld`; if `c.yaxis==-1` **s_keenshootup1** else **s_keenshoot1**.
  3. else `jumpbutton && !jumpheld` → `jumpheld=true`, SND_JUMP, `xspeed=0`, `yspeed=-40`, `ytry=0`, `jumptime=18`, **s_keenjump1** (vertical jump).
  4. else `pogobutton && !pogoheld` → `pogoheld=true`, SND_JUMP, `xspeed=0`, `yspeed=-48`, `ytry=0`, `jumptime=24`, **s_keenpogodown**.
  5. else on `c.yaxis`: −1 → try `CheckGrabPole`; if not and (`upheld` or `!CheckEnterHouse`) → **s_keenlookup**. +1 → try `CheckGrabPole`; else **s_keenlookdown**.
- **Keen 5 rider hook (479-482):** if `hitnorth==25` and not already, switch to **s_keenride** (a stand clone that runs `KeenStandThink`, CK_KEEN.C:64).
- **React `KeenStandReact` (2120-2153):** if `hitnorth==0` (walked off edge) → SND_PLUMMET, `xspeed=xdir*8`, `yspeed=0`, **s_keenjump3**, `jumptime=0`. If deadly floor (`&~7==8`) → KillKeen. If `hitnorth==41` → conveyor push `xtry=+8*tics`; `49` → `xtry=−8*tics`, then re-`ClipToWalls`. Always redraws.

### 1.3 IDLE / "bored" chain — `KeenPauseThink` (560-619)
Shared think of s_keenstand-family idle poses. Any input (`c.dir≠dir_None` or any button) zeroes `temp1/temp2` and returns to active stand (569-574). Otherwise **idle timer `temp1 += tics` only when not standing on a sprite** (`(hitnorth&~7)≠0x18`, 578). Stage machine on `temp2`:
- Stage 0 → after `temp1>200` tics (~2.86 s): **s_keenpauselook** (look up, 60-tic pose, CK_KEEN.C:67).
- Stage 1 → after `>300` (~4.3 s): Keen-4 only, if `moonok==1` → **s_keenmoon1** (moon animation, sets `moonok=2` so it never repeats that level, 596-602); else **s_keenwait1** (yawn/tap chain s_keenwait1-6, 69-74, total ~370 tics of animation).
- Stage 2 → after `>700` (~10 s): **s_keenread** (sit-and-read book).

### 1.4 READING — `s_keenread…read7` (82-88), think `KeenReadThink` (631-643)
Four sit-down frames (`step`, 16 tics each) then a looping read animation (read5 300-tic, read6/7 16-tic). `KeenReadThink`: if `storedemo`, abort game and clear keys (633-637) — this is the "reading the game hint ends the demo" behavior. Any dir/jump/pogo → zero idle regs, enter **s_keenstopread** (three stand-up frames, 89-91) → s_keenstand. (Note: fire does *not* wake from reading — only movement/jump/pogo.)

### 1.5 LOOK UP — `s_keenlookup/2` (93-94), think `KeenLookUpThink` (655-665)
lookup: stepthink 30-tic; lookup2: `think` with tictime 0 (hold forever), `KeenPosContact`. Any of {`yaxis≠−1`, `xaxis≠0`, fresh jump, fresh pogo, firebutton} → back to stand and immediately run `KeenStandThink` (so you can shoot-up straight out of look-up). Firing while looking up is actually handled in Stand (§1.2 step 2) producing **s_keenshootup1**.

### 1.6 LOOK DOWN & DROP-THROUGH — `s_keenlookdown1-4` (96-99), think `KeenLookDownThink` (677-718)
lookdown1 (6-tic) → lookdown2 (24-tic) → lookdown3 (hold). **Drop-through-floor mechanic (683-711):** if `jumpbutton && !jumpheld && (hitnorth&7)==1` (standing on ordinary/one-way floor) AND neither the current floor tile nor the tile below has any W/E/S wall property (693-699, prevents dropping through solid) → `jumpheld=true`, compute `ymove=max(4,tics)*16`, add rider's ymove if riding, shove Keen down that much, clear `gamestate.riding`, enter **s_keenjump3** (falling), `xspeed=yspeed=0`, SND_PLUMMET. Otherwise any change (`yaxis≠1`, x movement, fresh jump/pogo) → **s_keenlookdown4** (6-tic stand-up) → stand.

### 1.7 WALKING — `s_keenwalk1-4` (157-160), think `KeenWalkThink` (730-832)
- **Record:** slidethink, tictime 6, **xmove 24**, ymove 0, react `KeenWalkReact`. Four-frame cycle.
- **Think:** if `xaxis==0` → stand (via KeenStandThink). Set `xdir=c.xaxis`. On `yaxis==−1`: CheckGrabPole; if `upheld` return; else CheckEnterHouse. On `yaxis==+1`: CheckGrabPole. Fire → shoot (up if yaxis −1, else forward). Jump (fresh) → **running jump**: `xspeed=xdir*16`, `yspeed=−40`, `xtry=ytry=0`, `jumptime=18`, **s_keenjump1**. Pogo (fresh) → **s_keenpogodown** with `xspeed=xdir*16`, `yspeed=−48`, `jumptime=24`.
- **Slope speed injection (812-813):** `xtry += slopespeed[hitnorth&7]*tics` — walking up/down slopes adds ±4/±8 units·tic (see §3 table). This is *additive* to the slide's 24 units/tic.
- **Footstep SFX (818-831):** SND_WORLDWALK1 on frame walk1, WORLDWALK2 on walk3, `temp3` toggles so each plays once per cycle.
- **React `KeenWalkReact` (2163-2203):** edge → fall (as stand). Deadly floor → KillKeen. Conveyors 41/49 → push. **Wall hit:** `hiteast&&xdir==−1 || hitwest&&xdir==1` → stop: `ticcount=0`, snap to **s_keenstand** and set the correct standing shape immediately (2192-2200).

### 1.8 JUMPING & FALLING — `s_keenjump1-4` (166-169), think `KeenAirThink` (1026-1116)
- **Frames:** jump1/jump2 are `think` (tictime 0) rising poses; jump3 is stepthink 50-tic (apex/fall), jump4 stepthink 40-tic, jump3↔jump4 loop for the falling flutter. `nextstate` chaining is what advances rise→apex.
- **Sustained-thrust model (`jumptime`, 1034-1052):** while `jumptime>0`: if `jumptime<=tics`, apply the *remainder* `ytry=yspeed*jumptime` and zero jumptime; else `ytry=yspeed*tics` and `jumptime-=tics`. **Releasing jump mid-rise (`!jumpbutton`) sets `jumptime=0` immediately → variable jump height** (1047-1048). When jumptime hits 0 the state advances to its `nextstate` (the "second jump stage") (1050-1051).
- **Gravity once thrust ends (1053-1067):** Easy difficulty → `DoWeakGravity`; else `DoGravity`. When `yspeed>0` and not already in jump3/jump4, advance to falling stage (1063-1066).
- **Air horizontal control (1071-1079):** holding a direction → `AccelerateX(ob, xaxis*2, 24)` (accel 2 units/odd-tic, cap 24); no input → `FrictionX` (decel 1 unit/odd-tic).
- **Pole-hole special (1081-1084):** if `hitsouth==17`, kill x-speed (thread through the hole cleanly).
- **Jump-cheat (1028-1033):** with `jumpcheat` on and jump held, perpetual `yspeed=−40, jumptime=18` (fly).
- **Air fire (1086-1104):** fresh fire → up/forward/down air-shoot states by `c.yaxis`.
- **Air→pogo (1106-1112):** fresh pogo → **s_keenpogo**, `jumptime=0`.
- **Air pole-grab (1114-1115):** `yaxis==−1` → CheckGrabPole.
- **React `KeenAirReact` (2213-2351):** Side wall into travel dir → `xspeed=0`. **Ceiling `hitsouth` (2221-2254):** pole-hole 17 → nudge up 2px and center on pole; else (unless jumpcheat) SND_HELMETHIT, and if `hitsouth>1` (sloped ceiling) `yspeed+=16` clamped ≥0, else `yspeed=0`, `jumptime=0`; Keen-6 ceiling switch `33` → FlipBigSwitch. **Landing `hitnorth` (2256-2298):** `ymove=0`; deadly→KillKeen; K5 fuse 57 → SND_LANDONFUSE; K6 switch 33 → FlipBigSwitch; unless riding-with-jumptime kludge (2276), land: zero idle regs, convert air-shoot→ground-shoot if mid-shot, else walk if x held, else stand; SND_LAND. **Ledge-grab scan (2299-2348):** covered in §1.11.

### 1.9 POGO — `s_keenpogodown` (162) / `s_keenpogo` / `s_keenpogo2` (163-164)
- **Entry from stand/walk/air** as above. **pogodown** is a 1-tic `step` whose think `KeenBounceThink` (1131-1137) gives the *first* bigger bounce: `yspeed=−48`, `ytry=yspeed*6` (immediate −288-unit pop), `jumptime=24`, SND_POGOBOUNCE. Then **s_keenpogo** (rising) / **s_keenpogo2** (top) loop, think `KeenPogoThink` (1149-1230).
- **Pogo think (1151-1230):** while `jumptime>0`: **if jump held OR `jumptime<=9` → `DoTinyGravity`, else `DoGravity`** (1153-1160) — this is the *impossible pogo trick*: holding jump during the pogo bounce keeps gravity tiny, producing the very-high pogo. Decrement jumptime, advance state at 0. When jumptime=0: Easy→WeakGravity else Gravity. Horizontal: input → `AccelerateX(ob, xaxis, 24)` (note accel 1 not 2 — pogo steers slower than jump), setting `xdir` only when stopped (1186-1188); no input → coast `xtry += xspeed*tics` keeping momentum (1192-1201). Pole-hole 17 kills x. Fire → air-shoot states. Fresh pogo press → exit to **s_keenjump3** (dismount pogo mid-air, 1225-1229).
- **React `KeenPogoReact` (2390-2482):** same ceiling logic as air. On landing `hitnorth`: deadly→KillKeen; K5 fuse 57 → if `yspeed<48` just SND_LANDONFUSE else `BreakFuse` (2440-2452); K6 33→FlipBigSwitch, 41/49 → accelerate `xspeed` toward ±8 conveyor cap (2458-2469); then (unless riding-with-jumptime) **auto-rebounce**: `yspeed=−48`, `jumptime=24`, SND_POGOBOUNCE, **s_keenpogo** (2471-2477). Pogo never stops on its own — it bounces forever until you press pogo again.

### 1.10 SHOOTING (every stance/direction)
Projectile spawn offsets are all in `KeenShootThink` (1477-1548); the shot itself is §4.7.
- **Ground forward** `s_keenshoot1/2` (112-113, 9+6 tic): spawns East at `(x+16px, y+4px)` or West at `(x−8px, y+4px)` (1481-1491). shoot2 → back to stand.
- **Ground up** `s_keenshootup1/2` (115-116): North at `(x+5px, y−10px)`; returns to **s_keenlookup** (so you keep looking up after).
- **Air forward/up/down** `s_keenairshoot*` (171-181): these interleave `T_Projectile` and `KeenShootThink`. Air forward East `(x+16px,y+2px)`/West `(x, y+2px)` (1492-1502); air down South `(x+8px, y+18px)` (1503-1506); air up North `(x+5px, y−10px)` (1507-1510). Note air-shoot frames set `skippable` differently (shot2 is skippable, tictime 1) so the shot fires on the middle frame; all chain back to **s_keenjump3**.
- **Pole forward/up/down** `s_keenpoleshoot*` (148-155): forward East `(x+16,y+4)`/West `(x−8,y+4)`; up North offset depends on facing `(x+6…+12, y+4)`; down South `(x+6…+12, y+24)`. All return to **s_keenpole**.
- **Two-frame cadence:** every shoot state is 9-tic wind-up + 6-tic recovery; the shot spawns on the wind-up frame's think. This ~15-tic (≈0.21 s) lock is the fire cooldown.

### 1.11 LEDGE HANG + PULL-UP — `s_keenholdon/2` (183-184), `s_keenclimbup1-5` (186-190)
- **Grab detection (in `KeenAirReact`, 2299-2348):** only when falling (`ymove>0`). Compute the "grab line" `graby` snapped to a tile boundary +4px; only trigger on the tic Keen's top *crosses* that line (2307). Requires holding *toward* the ledge (`c.xaxis`), the target tile clear of all four walls, and the tile *below* it solid on the near side + top (2315-2318 / 2334-2336). On success: set `xdir`, `needtoclip=cl_noclip`, snap x to tile+8/+16px, y to `graby−4px`, zero yspeed/ymove, **s_keenholdon**.
- **Hold** `s_keenholdon` (12-tic) → `s_keenholdon2` (hold), think `KeenHoldThink` (1434-1465): press up OR toward-facing → **s_keenclimbup**; set `ytry` prep (−16px if facing right, −8px if left) and, if the tile above isn't foreground, raise `priority=3` so Keen draws over it. Press down or *away* → let go → **s_keenjump3** with `needtoclip=cl_midclip`.
- **Pull-up** `s_keenclimbup1-5` (10-tic each, then a 6-tic stand): thinks `T_PullUp1/2/3/T_PulledUp` (1560-1621) hand-animate the climb by setting `xtry/ytry` per frame (±8px x, −8px y steps), and `T_PulledUp` restores `needtoclip=cl_midclip`, `priority=1`, final `ytry=+8px` settle. → s_keenstand.

### 1.12 POLE: SIT / CLIMB / SLIDE / SHOOT — CK_KEEN.C:137-155, 288-1407
- **Grab** `CheckGrabPole` (288-325): guarded by `leavepoletime` (can't re-grab within 19 tics of jumping off, 295-302). Looks for `INTILE_POLE` at head (if pressing up) or just-below-feet (else). On hit: snap x to pole center (`tilemidx−1 tile + 8px`), `xtry=0`, `ytry=c.yaxis*32`, `needtoclip=cl_noclip` (climb through pole holes), state **s_keenpole**, return true.
- **Sit** `s_keenpole` (137): `think` tictime 0, react `KeenSimpleReact`. Think `KeenPoleThink` (1286-1324): up→**s_keenclimb1** (`ydir=−1`); down→**s_keenslide1** (`ydir=1`, run KeenDropThink); if x held next to ground (NORTHWALL tile beside feet) → step off pole onto floor → **s_keenjump3**, SND_PLUMMET (1304-1321); else `PoleActions`.
- **Climb up** `s_keenclimb1-3` (139-141): slidethink tictime 8, **ymove 8**. Think `KeenClimbThink` (1334-1363): if head tile no longer pole → **s_keenpole** (ran out of pole top); yaxis 0→sit, +1→slide down; then PoleActions.
- **Slide down** `s_keenslide1-4` (143-146): slide tictime 8, **ymove 24** (3× climb speed), react `KeenPoleReact`. Think `KeenDropThink` (1373-1407): checks pole 4px above bottom; if gone → **s_keenjump3**, SND_PLUMMET, `xspeed=polexspeed[xaxis+1]`; yaxis −1→climb, 0→sit; then PoleActions.
- **PoleActions (1242-1276)** — the shared pole input handler: set `xdir` from x; fire → pole-shoot states by yaxis; **jump off pole (1264-1275):** `jumpheld=true`, SND_JUMP, `xspeed=polexspeed[c.xaxis+1]` (−8/0/+8), `yspeed=−20`, `needtoclip=cl_midclip`, `jumptime=10`, **s_keenjump1**, `ydir=1`, `leavepoletime=lasttimecount`.
- **React `KeenPoleReact` (2492-2509):** if the tile at Keen's feet became solid floor (NORTHWALL==1) → pop Keen up to sit on top and switch to **s_keenlookdown** (dismount at pole base).

### 1.13 SWITCHES, KEYS/GEMS, DOORS, LINE-UP
- **Line-up** `s_keenlineup` (122), think `T_LineUp` (846-867): slides Keen horizontally at ±16 units/tic toward `temp1` (desired x) then re-tries the interaction. Used before switches/doors/gem sockets so Keen is tile-aligned.
- **Switch** `s_keenswitch/2` (118-119), `s_keenkey` (120): `KeenSwitchThink` (919-968) animates the map tile (`MANIM` offset), SND_USESWITCH, then either toggles a **bridge** (walk the bridge tile run, adding each tile's MANIM, 936-953) or toggles a **platform-blocker** tile (`tile ^ PLATFORMBLOCK`, PLATFORMBLOCK=31), with a Keen-5 direction-arrow flip branch (960-964). `CheckEnterHouse` (339-434) decides switch vs door vs keycard-door on **up-press**, aligning first via lineup if needed.
- **Gem socket** (in `CheckInTiles`, 2043-2066): standing on a `GEMSOCKET0-3` tile with the matching key, aligned, and not already keying → decrement that key, **s_keenkey**. `KeenKeyThink` (980-1014) opens the corresponding door object (spawns `s_door1`), SND_OPENDOOR.
- **Door entry** `s_keenlineup`→`s_keenenter1-5` (128-132): walk-into-door animation (5 frames, each `step` 9-tic, `ymove −64` i.e. walking *up/in*), WalkSound1/2 alternate, `priority=0` (behind foreground). `invincible=110` (~1.57 s) is set on regular doors (419). `KeenEnterThink` (879-907) reads the destination from `mapsegs[2]` info tile and teleports Keen there (level warp / door pairing). Keen-5 adds `s_keenenter0` (45-tic pre-step) and card-door handling (388-416): consumes `gamestate.keycard`, spawns `s_carddoor`, SND_OPENCARDDOOR; if no card → SND_NOWAY and stay standing. **Documented BUG (370-381):** the enter states rely on `ydir==1`; if Keen was pushed off a pole his ydir may differ, corrupting the teleport read (can warp to 0,0 = instant level win).

### 1.14 DYING — `s_keendead` (102), `s_keendie1/2` (104-105), `s_keensuitdie1/2` (108-109)
`KillKeen` (1657-1698): no-op if `invincible||godmode`. Otherwise `moonok=0`, `invincible=30` (0.43 s), `keenkilled=true`, `needtoclip=cl_noclip`, `priority=3`; picks death sprite randomly (`US_RndT()<0x80`), Keen-4 map 17 uses the scuba death variant; SND_KEENDEAD; **`yspeed=−40`, `xspeed=16`** (fixed death-pop up-and-right). Think `KeenDieThink` (1633-1639): `DoWeakGravity`, `xtry=xspeed*tics`, and only when Keen leaves the screen (`!OnScreen`) → `playstate=ex_died`. So the death animation is: pop up, arc off-screen, *then* lose the life.

### 1.15 RIDING PLATFORMS / FOOT — `HandleRiding` (1888-1940)
When `gamestate.riding` is set (a platform pushed Keen last frame, CK_STATE.C:903): if Keen slid off the platform's x-extent → drop (`riding=NULL`). If Keen is moving up (jumped) → release, and if platform also rising, add its ymove. Else stick: `xtry=plat->xmove`, `ytry=plat->top−ob->bottom−16` (glue feet to platform top), `PushObj`, and **lock Keen's x sub-tile bits to the platform's** so he rides pixel-perfectly (1919-1929: `nopan` snaps to 128-unit grid, else masks low 5 bits). Sets `hitnorth=25` unless Keen's head hit something. This is the hook that makes `KeenStandThink`/`KeenPauseThink` treat "on a sprite" specially (no idle timer, ride pose).

### 1.16 KEEN-6 STUN — `s_keenstun` (referenced 1807)
Keen-6 `KeenContact` on a `stunshotobj` with `temp4` set → `ExplodeShot`, `ChangeState(ob,&s_keenstun)`. **Documented BUG (1809):** no `break` before `platformobj` → the "impossible bullet bug".

### 1.17 WORLD-MAP KEEN (CK_KEEN2.C) — `s_worldkeen`, `s_worldkeenwalk`, waves, foot, swim, elevate
- **Spawn** `SpawnWorldKeen` (449-499): restores `gamestate.worldx/y` if set; Keen-4 `ex_foot` arrival flies in on the giant foot (`s_keenonfoot1/2`, `T_FootFly` 634-653 — timed glide `temp1` tics to a fixed map coord). Default idle **s_worldkeen** (360-tic) → wave chain `s_worldkeenwave1-5` (20-tic each).
- **Idle/wave think `T_KeenWorld` (565-577):** `c.dir≠dir_None` → **s_worldkeenwalk**; any button → `CheckEnterLevel`.
- **Walk think `T_KeenWorldWalk` (587-623):** honors `temp3` shore-lock countdown (decrement 4/frame); sets `xdir=c.xaxis, ydir=c.yaxis`; any button → CheckEnterLevel; `dir_None` → stop into s_worldkeen with the resting shape for `temp1`; else animate 4-frame cycle via `worldshapes[dir]+worldanims[stage]` (432-433) with WORLDWALK1/2 footsteps. `s_worldkeenwalk` is slide, tictime 4, **xmove 24, ymove 24** (diagonal free movement).
- **Enter level `CheckEnterLevel` (536-555):** scans Keen's tiles for info `>0xC000 && ≤0xC000+18`; sets `worldx/y`, `mapon=info−0xC000`, `playstate=ex_completed`, SND_ENTERLEVEL.
- **Shore/swim (Keen 4)** `CheckWorldInTiles` (1051-1112): stepping on a shore tile without wetsuit → SND_NOWAY + `CantSwim()` bounce-back; with wetsuit → toggle between `s_worldkeen*` and **s_worldswim** (slide, xmove/ymove 16), lock direction for 18 tics. Swim animation `T_KeenWorldSwim` (663-690) with SND_SWIM1/2.
- **Teleport (Keen 5/6)** `Teleport` (702-825): a self-contained blocking loop (owns `RF_Refresh`) that glides Keen at 2×tics/frame to the pad, cycles teleporter tiles, reads the destination info tile, warps, redraws nearby flags, then exits with a downward emerge animation. **Documented BUG (776):** destination y limited to 1..127.
- **Elevator (Keen 5)** `Elevator`/`T_Elevate` (837-1037): walks Keen into the car, closes doors, makes Keen invisible/no-clip, glides an off-screen invisible Keen (`s_worldelevate`, moving `ydir*64*tics` vertical, `xdir*12*tics` horizontal) to the destination, opens doors, walks Keen out. Must hand-maintain the hitbox because Keen has no sprite in this state (854-860).

---

## 2. INPUT HANDLING NUANCE (`PollControls`, CK_PLAY.C:1917-1990)

- **Control read:** `IN_ReadControl(0,&c)` fills `c.xaxis`(−1/0/1), `c.yaxis`(−1/0/1), `c.dir`(8-way enum), `c.button0/1`. `upheld` is cleared whenever `yaxis≠−1` (1920-1921) — this is why holding up through a door/switch needs re-press (`upheld=true` is set by CheckEnterHouse so you don't instantly re-enter).
- **Edge detection (the `*held` flags):** each of jump/pogo/fire uses a `button`+`held` pair. A think routine acts only on `button && !held`, then sets `held=true`; `held` is cleared the moment the physical button releases (1928-1933, 1983-1988). **This is the engine's rising-edge detector** — one action per press, no auto-repeat. Reproduce exactly: jump/pogo/fire must each require a fresh press.
- **Three input schemes:**
  1. **Gravis gamepad (1923-1934):** dedicated `GravisAction[ga_Jump/Pogo/Fire]` — three independent physical buttons; simplest mapping.
  2. **Two-button firing `oldshooting`/demo (1935-1977):** the classic 2-button scheme. **Both buttons together = FIRE** (and jump/pogo suppressed) (1937-1941). Button0 alone = jump. Button1 is overloaded: held **≤8 tics accumulates `oldfirecount`**, and only *past* 8 tics does it register as **pogo** (1953-1963); a quick tap of button1 (released with `oldfirecount≠0` but ≤8) *also* yields a pogo pulse on release (1966-1969). This tap/hold disambiguation is what lets two buttons produce jump+pogo+fire. Model the 8-tic threshold precisely.
  3. **Keyboard/other (1978-1989):** button0=jump, button1=pogo, and **fire is a separate key** `Keyboard[firescan]`.
- **Disabled/forced states:** During death (`s_keendead`/die), doors, line-up, pole-jump lockout (`leavepoletime` window), teleport/elevator (which own the frame loop), input is effectively ignored or overridden. `invincible` (counts down by `tics`, CK_PLAY.C:2351-2354) suppresses KillKeen but not input. `jumpcheat` and `godmode` are debug toggles (CK_PLAY.C:568,595). `storedemo` reading aborts (§1.4).

---

## 3. NUMERIC CONSTANTS — clean tables (units/tic AND px/s @70 Hz, 16px→256unit tiles)

Conversion: **px/s = (units/tic) × 4.375**; px/tic = units/16. Gravity accel converts as units/tic² likewise, but note the odd-tic gating halves effective average accel.

### 3.1 Jump / pogo / dismount impulses (by context)
| Action | file:line | yspeed (u/tic) | jumptime (tics) | xspeed (u/tic) | yspeed px/s | notes |
|---|---|---|---|---|---|---|
| Stand vertical jump | 511-513 | −40 | 18 | 0 | −175 | pure vertical |
| Running jump | 787-790 | −40 | 18 | ±16 | −175 / ±70 | x from facing |
| Stand→pogo | 522-525 | −48 | 24 | 0 | −210 | |
| Walk→pogo | 800-805 | −48 | 24 | ±16 | −210 / ±70 | |
| Pogo first bounce (KeenBounceThink) | 1133-1135 | −48 | 24 | — | −210 | `ytry=yspeed*6` instant pop |
| Pogo re-bounce (react) | 2473-2474 | −48 | 24 | — | −210 | auto every landing |
| Pole jump-off | 1268-1271 | −20 | 10 | polexspeed | −87.5 | weakest jump |
| Drop-through / walk-off-edge | 704, 2128 | 0 | 0 | ±8 (edge) | 0 | pure fall |
| Death pop (KillKeen) | 1695-1696 | −40 | — | +16 | −175 | fixed up-right |

### 3.2 Locomotion / animation move rates
| State | file:line | progress | tictime | xmove | ymove | speed px/s |
|---|---|---|---|---|---|---|
| Walk (in-level) | 157-160 | slidethink | 6 | 24 | 0 | 105 (x) |
| Walk first-nudge | 490 | — | — | (xmove·tics)/4 | — | soft start |
| Line-up slide | 853-863 | — | — | ±16·tics | — | 70 |
| Pole climb up | 139-141 | slidethink | 8 | 0 | 8 | 35 (up) |
| Pole slide down | 143-146 | slide | 8 | 0 | 24 | 105 (down) |
| Door enter walk | 128-132 | step | 9 | 0 | −64 | (per-frame) |
| World walk | 430 | slide | 4 | 24 | 24 | 105 each axis |
| World swim (K4) | 415 | slide | 6 | 16 | 16 | 70 |
| World elevate (K5) | 419,842-845 | think | 6 | — | ydir·64·tics | 280 (v) |
| Stun shot | 1335-1338 | slide | 6 | 64 | 64 | 280 |

### 3.3 Gravity variants (CK_STATE.C:1342-1430)
| Fn | accel per odd-tic | cap (u/tic) | terminal px/s | used by |
|---|---|---|---|---|
| DoGravity | +4 | 70 | 306 | normal jump/fall/pogo |
| DoWeakGravity | +3 | 70 | 306 | Easy difficulty air/pogo, death |
| DoTinyGravity | +1 (buggy `!i&3` gate → nearly every tic) | 70 | 306 | pogo while jump-held / jumptime≤9 (impossible-pogo height) |

Special ascent damp: if `−4≤yspeed<0` (or `−3` weak), that residual is applied once and zeroed (1352-1356) — smooths the apex. **Odd-tic gating** (`if (i&1)`) means accel only fires on odd `lasttimecount` values, i.e. ~half the tics → effective ~2 u/tic² normal gravity.

### 3.4 Horizontal accel/friction (CK_STATE.C:1441-1586)
| Fn | delta per odd-tic | cap | used by |
|---|---|---|---|
| AccelerateX (air) | ±(xaxis·2) | 24 | jump/fall steering (2 u/odd-tic) |
| AccelerateX (pogo) | ±(xaxis·1) | 24 | pogo steering (slower) |
| FrictionX | ∓1 toward 0 | — | air with no input; zero-crosses to full stop |

### 3.5 Slope & pole lookup tables (CK_KEEN.C:192-193)
`slopespeed[8] = {0,0,4,4,8,−4,−4,−8}` indexed by `hitnorth&7` → extra `xtry += slopespeed·tics` while walking. Types 2,3 → +4 u/tic (17.5 px/s), 4 → +8 (35), 5,6 → −4, 7 → −8. `polexspeed[3] = {−8,0,8}` indexed by `c.xaxis+1` → horizontal speed when leaving a pole.

### 3.6 Timers & misc
| Name | value | seconds @70Hz | file:line |
|---|---|---|---|
| invincible after death | 30 | 0.43 | 1666 |
| invincible entering door | 110 | 1.57 | 419 |
| pole re-grab lockout | 19 tics | 0.27 | 299 |
| idle→look | >200 tics | ~2.86 | 584 |
| idle→wait/moon | >300 | ~4.3 | 592 |
| idle→read | >700 | ~10 | 610 |
| pogo tiny-grav window | jumptime≤9 | — | 1153 |
| two-button pogo threshold | oldfirecount>8 | ~0.11 | 1955 |
| MAXTICS clamp | 5 | 0.071 | ID_RF.H:40 |
| Spawn y-offset | −0xF1 (−241u) | — | 271 |

### 3.7 Bonus / pickup values (CK_KEEN.C:195-225, 1730-1752)
`shotsinclip[4]={0,8,5,5}` (ammo per clip by difficulty). `bonuspoints[]`: gems 0, then 100/200/500/1000/2000/5000, 1UP 0, ammo 0. `temp1<4`→key[temp1]++; ==10→life; ==11→ammo+=clip; K5 ==12→keycard. Water drops: 100 drops = extra life (GiveDrop, 1986-2006).

---

## 4. INTERACTION RULES (contact / in-tile / camera / KillKeen paths)

### 4.1 Item pickup — `KeenContact` bonusobj (1712-1755)
Cases 0-11 (K5: +12): play `bonussound`, morph the bonus into an `inertobj` with the score sprite, `GivePoints`, credit key/life/ammo/keycard, then `s_bonusrise` (float-up-and-vanish).

### 4.2 In-tile effects — `CheckInTiles` (2016-2087), called every player frame
Iterates Keen's covered tiles reading `tinf[INTILE+tile]&TYPEMASK`:
- `INTILE_DEADLY`(3) → **KillKeen**.
- `INTILE_DROP`(4) → `GiveDrop` (water; 100→1UP).
- `INTILE_GEMSOCKET0-3`(7-10) → gem-door open if standing on it, aligned, holding matching key (align via lineup first).
- `INTILE_MOON`(16) → arm Keen-4 mooning (`moonok=1`).
- `INTILE_BONUS100..AMMO`(21-28) → `TileBonus` (map-embedded pickups → rise sprite + credit).
`moonok` is reset to 0 at top of every CheckInTiles unless still on a moon tile (2022-2023).

### 4.3 Doors / switches / bridges / keycard — §1.13. Bridge toggle walks a tile run adding MANIM offsets (936-953); platform-blocker toggles `tile ^ 31` (966); Keen-5 arrow tiles flip via `arrowflip[]` (58, 962).

### 4.4 Teleporters (Keen 5/6, CK_KEEN2.C) — §1.17 Teleport. Note the blocking, self-refreshing loop and the destination-read from `mapsegs[2]`.

### 4.5 Rideable sprites — `KeenContact`/`KeenPosContact` (1708-1878) + HandleRiding (§1.15)
`platformobj` (and K4 stunned-bounder, bounder) → `ClipToSpriteTop`/`ClipToSprite` unless already riding. `KeenPosContact` handles Keen landing *on top of* moving actors: platform → snap to top, become falling-onto (`s_keenjump3`, zero speeds), `ClipToSpriteTop`; deadly actors (madmushroom, arachnut, berkeloid / K5 ampton, scottie / K6 gik, flect, blooglet) either KillKeen or bounce Keen off. **Documented BUGs:** priority not reset for platform (1832,1852); K6 lets Keen stand on Blooglets/Flects (1874).

### 4.6 Enemy contact death paths — every `KillKeen` call site
KillKeen is reached from: deadly floor in `KeenStandReact`/`KeenWalkReact`/`KeenAirReact`/`KeenPogoReact` (2133,2176,2259,2433); `INTILE_DEADLY` in CheckInTiles (2036); and deadly-actor `KeenPosContact` (1841 etc.). Enemy *body* contact death lives in each enemy's own contact routine (other files) calling `KillKeen`. All funnel through the single guarded `KillKeen` (invincible/godmode gate).

### 4.7 Neural stunner shot — `SpawnShot`/`T_Shot`/`R_Shot` (CK_KEEN2.C:1351-1525)
Costs 1 ammo (SND_USESWITCH click if empty). Shot is a `stunshotobj`, speed 64 u/tic (280 px/s) in the 4 cardinal dirs. `T_Shot` (1433-1471): if on-screen do nothing; if off-screen by >½ screen remove; else manually check collisions with *inactive* objects (waking them). `R_Shot` (1481-1525): pole-hole pass-through handling, else on any wall hit → `ExplodeShot` (`s_stunhit`, SND_SHOTEXPLODE). K6 `SpawnShot` immediately checks point-blank enemy overlap (1391-1407).

### 4.8 Camera / scrolling interplay hooks
Player think never scrolls directly; it feeds the scroll routines via hitbox and the `nopan` flag. `HandleRiding` consults `nopan` to decide sub-tile x-snapping (1920). World-map `Teleport`/`Elevator` call `WorldScrollScreen`/`RF_Refresh` themselves (owning the frame). The scroll follow-box lives in CK_PLAY.C (1438-1455: 9–12 tile x margins, 5–7 tile y margins) — Keen's `left/right/top/bottom` drive it, so a reimplementation must keep those updated even in sprite-less states (the K5 elevate hand-maintains them, 854-860). `OnScreen`/`originxtile…` gate death (`KeenDieThink` waits for off-screen) and shot culling.

---

## 5. WHAT MAKES THIS **NOT MARIO** — the 10 most distinctive player-feel facts (ranked)

1. **The pogo is a permanent, self-perpetuating state, not a jump.** Once on the pogo (`s_keenpogo`) Keen auto-rebounces every landing (`yspeed=−48,jumptime=24`, 2473) forever until you press pogo again to dismount to `s_keenjump3`. Mario has no analog to a bouncing mode you toggle.
2. **The "impossible pogo" — holding jump changes gravity, not thrust.** During a pogo bounce, holding jump (or the first 9 tics) swaps `DoGravity` for `DoTinyGravity` (+1 vs +4 accel, 1153-1160), massively increasing bounce height. Skill expression comes from *sustained* input altering the gravity constant.
3. **Variable jump height is thrust-duration, not impulse-cut.** `jumptime` doles out `yspeed` per tic while the button is held; releasing sets `jumptime=0` immediately (1047-1048). It's a fuel-tank model (up to 18/24/10 tics), not Mario's "kill upward velocity on release".
4. **Two physical buttons synthesize three actions via timing.** Both-buttons=fire, button1 tap=pogo pulse but only past an 8-tic hold threshold (1937-1969). The control scheme itself is a feel signature.
5. **Ledge grab requires falling + holding into the wall + a precise crossing tic.** The grab only fires on the single tic Keen's top crosses a tile-aligned "grab line" while moving down and pressing toward the ledge (2299-2348) — deliberate, twitchy, and directional. Mario has no ledge-hang in the classics.
6. **Deliberate drop-through-floor from a crouch.** Look-down + jump on a one-way floor (with a two-tile wall check) drops Keen through (683-711). Crouch is a real traversal verb, not cosmetic.
7. **Poles are a full sub-game: climb (8 u/tic) is 3× slower than slide (24 u/tic), with a 19-tic re-grab lockout and shoot-in-3-directions.** (139-155, 299) Ladder physics in Mario are trivial by comparison.
8. **Walking has a soft ¼-strength first step and additive slope speed.** Start-of-walk applies `(xmove·tics)/4` (490), and slopes inject `slopespeed·tics` on top of the 24 u/tic base (812) — momentum feels "wound up", not instant-max like NES Mario's friction curve differs in the opposite direction.
9. **Death is a physics event you watch play out.** KillKeen pops Keen up-and-right (`yspeed=−40,xspeed=16`) under weak gravity and only registers the lost life once he flies **off-screen** (`!OnScreen`, 1637) — no instant respawn freeze.
10. **Idle is a scripted mini-theatre gated by "on a sprite" and per-level flags.** After 2.9/4.3/10 s Keen looks around, yawns, (Keen-4) *moons* the player exactly once per level (`moonok`), and reads a book that can abort the demo — and the idle timer *pauses* while riding a platform (578). Mario just stands.

---

### 10-line summary
1. Read both files completely, line by line (CK_KEEN.C 2509 lines, CK_KEEN2.C 1605 lines), plus supporting constants from CK_DEF.H, CK_STATE.C, CK_PLAY.C, ID_RF.H.
2. Units: 16 global=1px, 256=1tile; 70 Hz tick; speeds convert to px/s ×4.375; per-frame move clamped to ~1 tile (anti-tunnel).
3. State model is data-driven `statetype` records with step/slide/think progress; motion deferred through `xtry/ytry` then clipped; `hitnorth` etc. carry tile wall codes (25=riding, 17=pole-hole, 8-15=deadly).
4. Documented every player state: stand/idle-theatre, look up/down, drop-through, walk (+slopes), jump (thrust-fuel variable height), fall, pogo (perpetual + impossible-pogo gravity trick), pole sit/climb/slide/shoot, ledge hang+pull-up, all 9 shoot stances, doors/switches/gems/bridges, riding, death, world-map walk/swim/teleport/elevator.
5. Full numeric tables extracted: jump −40/pogo −48/pole −20 impulses, jumptimes 18/24/10, gravity +4/+3/+1 (cap 70=306px/s), air accel ±2 cap 24, walk 24u/tic=105px/s, slopespeed/polexspeed tables, all timers.
6. Input: rising-edge `*held` detection (one action per press), three schemes, the 8-tic two-button pogo/fire disambiguation, `upheld` semantics, disabled/override states.
7. Interaction rules mapped: pickups, in-tile effects (deadly/drop/gem/moon/bonus), switch→bridge/platform-blocker toggles, keycard doors, teleporters, rideable sprites, all KillKeen paths, shot lifecycle, camera follow-box hooks.
8. Noted the reconstruction's own flagged BUGs (door ydir warp, K6 impossible-bullet, K6 stand-on-Blooglet, priority-not-reset, teleport y≤127) for faithful/avoidable choices.
9. "Not Mario" section ranks the 10 defining feel facts, led by the toggled perpetual pogo and the hold-jump-alters-gravity trick.
10. Delivered inline (read-only agent, no write tools); intended path was `.../scratchpad/study/keen-player.md`. Every claim carries a file:line citation; no code blocks reproduced.