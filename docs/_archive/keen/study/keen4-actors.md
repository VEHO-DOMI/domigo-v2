I have now read all five assigned files completely (K4_DEF.H, K4_ACT1.C, K4_ACT2.C, K4_ACT3.C, K4_SPEC.C) plus the shared engine primitives they depend on (`statetype` struct, gravity/acceleration/stun/lethal helpers, tile constants). Here is the exhaustive report.

---

# Keen 4 (Galaxy engine) — Complete Actor Study

**Provenance / zero-code statement.** This report is behavioral analysis of the K1n9_Duk3 2021 reconstruction of the Keen 4 source (GPL). It is written for a from-scratch TypeScript/Phaser reimplementation. **No source code is copied**; only observed behavior, numeric constants, and design intent are recorded. Every claim cites `FILE:line`. Files studied in full: `K4_ACT1.C` (1221 ll.), `K4_ACT2.C` (1392 ll.), `K4_ACT3.C` (1316 ll.), `K4_SPEC.C` (1305 ll.), `K4_DEF.H` (510 ll.), with supporting reads of `CK_DEF.H` and `CK_STATE.C`.

## Engine primitives you must internalize first (numbers are load-bearing)

- **Units** (`ID_RF.H:66-69`): `TILEGLOBAL = 256` global units = one 16-pixel tile; `PIXGLOBAL = 16` global units = one pixel. So all the speed numbers below are in global-units-per-tic; divide by 16 for pixels, by 256 for tiles.
- **`statetype` fields** (`CK_DEF.H:282-295`), the 12-tuple each state literal uses, in order: `{leftshapenum, rightshapenum, progress, skippable, pushtofloor, tictime, xmove, ymove, think(), contact(), react(), nextstate}`. So in every state row: **field 6 = tictime** (how many tics the state lasts / animation cadence — bigger is slower), **field 7 = xmove**, **field 8 = ymove** (per-step movement magnitudes for `step`/`slide` progress).
- **`progress` enum** (`CK_DEF.H:285`): `step` (advance by xmove/ymove per animation tick), `slide` (continuous sub-tile glide), `think` (no auto-move, run think()), `stepthink`, `slidethink`.
- **The three callbacks**: `think()` runs AI each frame; `contact(ob,hit)` fires on object overlap and branches on `hit->obclass`; `react()` runs after the move-attempt to resolve wall hits (`hitnorth/east/south/west` flags).
- **Gravity** (`CK_STATE.C:1342-1401`): `DoGravity` adds +4/odd-tic, terminal velocity 70; `DoWeakGravity` adds +3/odd-tic, cap 70 (floatier). `T_Projectile`=DoGravity+x-velocity; `T_WeakProjectile`=DoWeakGravity+x-velocity (`CK_STATE.C:1665-1684`).
- **`StunObj`** (`CK_STATE.C:1641-1653`): explodes the shot, flips the victim to `stunnedobj` (harmless, throwable), stashes old class in temp4. **Critical Keen-4 quirk**: the upward pop-out bounce is wrapped `#ifndef KEEN4`, so in Keen 4 `StunObj` gives **no knock-up** — every Keen-4 enemy that wants a recoil sets `yspeed` itself afterward (Slug `-24`, Lick `-16`, Bounder `-32`, Eater/Mimrock `-16`).
- **`C_Lethal`** (`CK_STATE.C:1741-1748`): generic "touch = KillKeen, shots pass through harmlessly." Actors using it are unkillable-by-shot.
- **Difficulty gating** (`K4_SPEC.C:303-636`): `ScanInfoPlane` reads the infoplane (`mapsegs[2]`). The gating idiom is C case fall-through: a Hard-only info code does `if (difficulty < gd_Hard) break;` then falls into the Normal code `if (difficulty < gd_Normal) break;` then falls into the base spawn. So most combat enemies occupy **three** info codes — base (all difficulties), Normal+, Hard-only — letting designers add copies as difficulty rises. Order is `gd_Easy < gd_Normal < gd_Hard`.
- **Activation**: after spawning, every non-`ac_allways` object is set `ac_no` (`K4_SPEC.C:620-624`) and only wakes within `INACTIVATEDIST = 4` tiles (`K4_DEF.H:61`).

---

## WORLD-MAP & SET-DRESSING ACTORS

### Miragia (world-map mirage) — `K4_ACT1.C:50-188`
- **Spawn**: info `33`, no gating (`K4_SPEC.C:521-523`); `inertobj`, `ac_allways`.
- **State machine**: 8-state loop `s_miragia0..7` (`K4_ACT1.C:50-57`). tictimes: `0`=300, `1..3`=30, `4`=300, `5..7`=30 — a slow breathing cycle. Each think calls `RF_MapToMap` to blit a 6×4 tile block from a source region into the map, cross-fading the town of Miragia into and out of existence on the overworld.
- **Player interaction**: none lethal. `T_Miragia0` (`K4_ACT1.C:85-97`) checks whether world-Keen is standing inside the 6×4 footprint; if so it jumps to `s_miragia7` so the solid town tiles never materialize under the player (anti-softlock).
- **Stun/pogo**: N/A (inert). **Design intent**: the signature overworld illusion — a town that shimmers in and out, enterable only when the tiles are solid, teaching the player that the map itself is a puzzle.

### Bonus items (gems/keys/sugar/1-up/ammo) — `K4_ACT1.C:202-267`
- **Spawn**: info `57-68` → type `0-11` (`K4_SPEC.C:578-592`); info `34` spawns an ammo drop **only if `gamestate.ammo < 5`** (`K4_SPEC.C:525-531`) — a mercy-ammo mechanic. Types 0-3 are the four keygems, 4-9 sugar treats, 10 = 1-up, 11 = ammo clip (`K4_ACT1.C:210`).
- **State**: `s_bonus1/2` two-frame idle (tictime 20); `s_bonusrise` (`slide`, ymove 8) floats the sprite up when collected (`K4_ACT1.C:202-204`). `T_Bonus` cycles `shapenum` between temp2..temp3 (`K4_ACT1.C:262-267`).
- **Design intent**: standard collectibles; the ammo-gating and the "float up on pickup" are the only mechanics. `SpawnSplash` (`:243`) is the water-drop splash cousin.

### Council Member (in-cage NPC) — `K4_ACT1.C:277-329`
- **Spawn**: info `4`, ungated (`K4_SPEC.C:347-350`); `oracleobj`, spawned `-0x171` (≈23px) above tile (`:296`, flagged "wierd" in-source), random initial facing.
- **State**: walk `s_councilwalk1/2` (tictime 10, **xmove 64** = ¼-tile/step, slow shuffle) via `R_Walk`; `s_councilstand` (tictime 120, xmove 128) idles. `T_Council` (`:317-329`): `randnum=US_RndT(); if (tics*8 > randnum)` → stop and stand — a frame-rate-scaled random pause. Source flags a bug: the stand state doesn't use `R_Walk`, so stopping at a ledge edge can strand it.
- **Player contact**: `oracleobj` is the rescue-target class — touching it is engine-handled as a rescue (`ex_rescued`; see `C_KeenSwim` `K4_SPEC.C:1281-1283` for the underwater path). Not lethal, not stunnable.
- **Design intent**: the imprisoned Gnosticene council member — the level's rescue objective, pacing back and forth in his cell.

### Princess Lindsey — `K4_ACT3.C:1111-1155`
- **Spawn**: info `6`, ungated (`K4_SPEC.C:363-365`); `lindseyobj`, remembers spawn-y in temp1.
- **State**: 4-frame idle `s_lindsey1-4` (tictime 20); `T_Lindsey` bobs ±2px around temp1 via `AccelerateY` max 8 (`:1144-1155`) — a gentle hover.
- **Contact**: none (NULL) in-actor; touching triggers the `PrincessLindsey()` cutscene (`K4_SPEC.C:670-732`) which prints location hints (swim-gear is in Miragia; the Forbidden pyramid is under the Moons pyramid).
- **Design intent**: quest-giver NPC delivering the two critical progression clues.

### Schoolfish — `K4_ACT3.C:850-905`
- **Spawn**: info `16`, ungated (`K4_SPEC.C:447-450`); `schoolfishobj`, `cl_fullclip`.
- **State/movement**: `s_schoolfish1/2` stepthink tictime 20; `T_SchoolFish` (`:882-905`) homes toward Keen exactly like the Dopefish think but at accel-cap 10 — drifts toward the player in x and y. `R_Fish` shared wall-bounce (`:822-838`).
- **Contact**: **NULL — completely harmless.** Its only role: the Dopefish eats it (`C_Dope` `:783-785`).
- **Design intent**: living underwater ambience that follows Keen, and prey that baits/feeds the Dopefish — pure atmosphere with a food-chain gag.

---

## GROUND PATROLLERS & CHASERS

### Poison Slug — `K4_ACT1.C:339-447`
- **Spawn**: info `22` (all), `43` (Normal+), `44` (Hard) (`K4_SPEC.C:489-498`); `slugobj`, `-0x71` above tile, random facing.
- **State machine**: walk `s_slugwalk1/2` tictime **8**, **xmove 64** (slow) via `R_WalkNormal`; `T_Slug` only on walk2 (`:383-399`): `US_RndT() < 16` (~6% per eval) → turn toward Keen, enter `s_slugpiss1` (tictime 60), play `SND_SLUGPOO`. `T_SlugPiss` (`:409-418`) drops a slime puddle `s_slugslime` (tictime 300) → `s_slugslime2` (60): a **lingering ~360-tic lethal trail** (`C_Lethal`).
- **Contact**: `C_Slug` (`:428-447`) — Keen → KillKeen; stunshot → 50/50 `s_slugstun`/`s_slugstunalt`, then manual recoil `yspeed=-24, xspeed=xdir*8`.
- **Stun/pogo**: **stunnable** (permanently — stun state's react is `R_Stunned`); no pogo interaction. **Design intent**: a slow, low patroller whose real threat is the poison it leaves behind — punishes players who chase or backtrack over its trail.

### Arachnut — `K4_ACT1.C:936-1028`
- **Spawn**: info `20` (all), `73` (Normal+), `74` (Hard) (`K4_SPEC.C:473-482`); `-0x171` above tile, random facing.
- **State machine**: 4-frame walk `s_arach1-4` tictime **6**, **xmove 128** (½-tile/step — **fast**) via `R_Walk`; `T_Arach` on frame 4 (`:982-992`) always sets xdir toward Keen — a pure horizontal homing pursuer.
- **Contact**: `C_Arach` (`:1002-1012`) — Keen → KillKeen; stunshot → `s_arachstun`. Stun is a **temporary blink-and-recover**: `s_arachstun` (240) → alternating 20-tic flashes `arachstun2-5` → loops back to `s_arach1` (`:940-944`). So stun only buys ~5 seconds.
- **Design intent**: the fast relentless spiny-nut chaser; you can't outrun it on the flat, and stun is only a brief reprieve — forces vertical escape or precise shots.

### Mad Mushroom — `K4_ACT1.C:459-559`
- **Spawn**: info `21`, ungated (`K4_SPEC.C:484-487`); `-0xF1` above tile, xdir=1.
- **State machine**: `s_mushroom1/2` stepthink tictime 8. `T_Mushroom` (`:491-507`) faces Keen every frame and calls `DoWeakGravity` — perpetual floaty hopping toward the player. `R_Mushroom` (`:538-559`): on landing (`hitnorth`) increments temp1; **every 3rd bounce** `yspeed=-68` + `SND_BOUNCE2` (big hop), otherwise `yspeed=-40` + `SND_BOUNCE1`.
- **Contact**: `C_Mushroom` (`:517-528`) — Keen → KillKeen; **stunshot → `ExplodeShot` only, no effect.** 
- **Stun/pogo**: **IMMUNE — cannot be stunned or killed.** **Design intent**: the pure-avoidance chaser — an unkillable rhythmic hopper (every third bounce higher) that turns a room into a dodging challenge; the floaty weak-gravity arc makes its menace readable.

### Mimrock — `K4_ACT3.C:321-507`
- **Spawn**: info `19`, ungated (`K4_SPEC.C:468-470`); `mimrockobj`, `-13px` above tile.
- **State machine**: disguised idle `s_mimrock` (looks like a rock, uses `R_Walk` but doesn't move). `T_MimrockWait` (`:363-387`): only acts if Keen is within 5 tiles vertically and **more than 3 tiles** away horizontally **and walking toward it** (`player->xdir` toward the rock) → begins sneaking `s_mimsneak1-6` (tictime 6, xmove 64). `T_MimrockSneak` (`:397-411`): creeps toward Keen; **reverts to rock if Keen turns away** or the vertical gap exceeds 5 tiles; if Keen closes within 4 tiles → **pounce** `s_mimbonk1` (`xspeed=xdir*20, yspeed=-40`). Pounce uses `T_WeakProjectile`; on ceiling/landing it bonks (`SND_HELMETHIT`, `R_MimAir`/`R_MimBounce` `:466-507`) and returns to rock disguise.
- **Contact**: `C_MimLethal` while pouncing (`:446-456`) kills Keen; `C_Mimrock` otherwise (`:421-436`) only handles shots → stun (manual recoil `yspeed-=16`).
- **Stun/pogo**: stunnable in any state; lethal only mid-pounce. **Design intent**: the "Boo"-style fake-out — a fake rock that reads the player's facing and ambushes only when approached, freezing the instant you look away. One of the cleverest reads-the-player designs in the game.

### Council Member: see set-dressing above. (Its walk logic doubles as a patrol.)

---

## FLYERS & AERIAL THREATS

### Egg + Eggbird — `K4_ACT1.C:572-926`
- **Spawn**: as **egg** info `13` (`K4_SPEC.C:419-423`, ungated) or as a free-roaming **Eggbird** info `76` (all), `77` (Normal+), `78` (Hard) via `SpawnEggbirdOut` (`K4_SPEC.C:606-615`).
- **Egg** (`s_egg`, `eggobj`, `:572`): stationary; `C_Egg` (`:664-718`) — **shooting OR touching it hatches it**: it breaks into `s_eggbroke`, spawns an Eggbird in `s_eggbirdpause`, plus three shell chips (`eggchip1/2/3`, xspeed ∓28/0, yspeed -40/-56). Punishes reflexive shooting.
- **Eggbird ground** (`eggbirdobj`): `s_eggbirdpause` 120-tic settle, then walk `s_eggbirdwalk1-4` tictime 7, **xmove 128** via `R_Eggbird` (turns at walls, and if it walks off a ledge it starts flying). `T_Eggbird` (`:728-747`): faces Keen; **if Keen is ≥3 tiles above and standing on ground (`player->hitnorth`)** → take off (`s_eggbirdfly1`, `cl_fullclip`, yspeed -8).
- **Eggbird flight**: `slidethink`; `T_EggbirdFly` (`:757-779`) homes toward Keen via `AccelerateXv`/`AccelerateY` (cap 16) in both axes. `R_Eggbirdfly` (`:894-926`) lands it back to walking when it reaches Keen's level.
- **Contact**: `C_Eggbird` — Keen → KillKeen; stunshot → `s_eggbirdstun` (`cl_midclip`). Stun **recovers**: `s_eggbirdstun` (240) → four 20-tic blinks → `T_EggUnstun` restores it to `eggbirdobj` and it walks again (`:588-592, 623-626`).
- **Design intent**: a two-stage threat — dormant eggs that *hatch when disturbed*, and birds that patrol ledges but launch into homing flight to reach Keen wherever he perches. Teaches "don't shoot everything."

### Skypest — `K4_ACT1.C:1038-1221`
- **Spawn**: info `8` (all), `45` (Normal+), `46` (Hard) (`K4_SPEC.C:379-388`); random x and y direction.
- **State machine**: fly `s_pestfly1/2` stepthink tictime 5; `T_PestFly` (`:1102-1120`) is a random drift — flips xdir/ydir on `US_RndT()<tics` rolls, accelerates x and y at cap 20. `R_Pest` (`:1198-1221`) bounces it off floor/walls; on hitting a **ceiling** it perches and runs a long 17-frame rest wing-flap (`s_pestrest1-17`, `:1041-1057`), then `T_PestRest` launches it back down (`ytry=-144`).
- **Contact**: `C_PestFly` (`:1130-1155`) — Keen → KillKeen; stunshot → shoved in the shot's direction (not stunned) + ExplodeShot. **Pogo**: `C_Squashable` on the rest states (`:1165-1173`) — if Keen's state is `s_keenpogo/pogodown/pogo2` it is **squashed** (`SND_SQUISH`, becomes inert).
- **Design intent**: the erratic flying nuisance (the classic "Bloog/Blooglet" fly). You can't reliably shoot it (shots only bat it around), but you **can pogo-stomp it while it rests on the ceiling** — a skill-expression kill. Comic-relief pest.

### Thundercloud + Lightning — `K4_ACT2.C:225-369`
- **Spawn**: info `9`, ungated (`K4_SPEC.C:390-392`); `thundercloudobj`, starts **dormant** `s_cloudsleep`.
- **State machine**: `s_cloudsleep` (`C_CloudSleep` `:363-369`) → wakes on Keen touch → `s_cloudwake` (100) → `s_cloud`. `T_Cloud` (`:275-287`) drifts horizontally (`AccelerateX` cap 10) tracking Keen's column; when Keen is below within 64px and horizontally overlapping → `s_cloudalign`. `T_CloudAlign` (`:297-310`) snaps to an 8px grid, then `s_cloudattack1`: a 9-frame flashing charge (`cloudattack1-9`, alternating charge sprite) with `T_CloudShoot` on frame 4 firing a **lightning bolt straight down** (`s_bolt1`, `lightningobj`, `cl_noclip`, `SND_THUNDER`). Bolt is a 6-frame `C_Lethal` column (`:240-245`). Then `s_cloudcharge` (T_Velocity, 60) resumes drifting.
- **Contact**: cloud body itself is **not lethal** once awake (walk states have NULL contact); only the **bolt** kills.
- **Stun/pogo**: not stunnable. **Design intent**: a positional area-denial hazard — sleeps until provoked, then chases your horizontal position and drops a lethal vertical lightning shaft, punishing anyone who lingers beneath it.

### Berkeloid + Fireball — `K4_ACT2.C:382-627`
- **Spawn**: info `5` (all), `49` (Normal+), `50` (Hard) (`K4_SPEC.C:352-361`); `berkeloidobj`, 2 tiles above tile, `temp2=8` (float speed).
- **State machine**: float `s_berkefloat1-4` (`slide`, **xmove 8** — very slow), think `BerkeThink`, react `BerkeWalkReact`, draw `BerkeDrawReact` which bobs the sprite ±1 tile via temp1/temp2 (`:577-593`). `BerkeThink` (`:449-480`): random turn toward Keen; `US_RndT()<8` → throw; or if Keen is within ±1 tile vertically and in front → throw (`SND_BERKELOIDATTACK`). Throw = 12-frame animation `s_berkethrow1-12`; `BerkeThrowThink` (`:490-511`) spawns a **fireball** (`s_fire1`, xspeed ±48, yspeed -8).
- **Fireball**: stepthink `T_WeakProjectile`, `C_Lethal`; `FireReact` (`:556-567`) — on landing plays `SND_FIREBALLLAND` and becomes a 9-frame **burning ground puddle** `s_fireland1-9` (long-lived terrain hazard).
- **Contact**: `C_Berke` (`:535-546`) — Keen → KillKeen; **stunshot → ExplodeShot only. INVINCIBLE.** `BerkeWalkReact` also turns it at ledges (won't walk off, `:619-625`).
- **Design intent**: the invincible floating fire-elemental — a slow but unkillable pursuer that lobs arcing fireballs which leave burning floor, denying terrain and forcing constant repositioning. The mini-boss dread of the fire levels.

### Pixie / Sprite (turret) — `K4_ACT3.C:915-1033`
- **Spawn**: info `17` (all), `23` (Normal+), `24` (Hard) (`K4_SPEC.C:452-461`); `pixieobj`, `cl_noclip`, hovers around spawn-y (temp1).
- **State machine**: `s_pixie` (`T_Pixie` `:953-977`) floats ±2px; when Keen enters its vertical band → face Keen, `s_pixielook`. `T_PixieCheck` confirms alignment → `s_pixieshoot`; `T_PixieShoot` (`:1001-1013`) fires a horizontal `mshotobj` bolt (`s_pixiefire1-4`, `slide` xmove 64, `C_Lethal`, `SND_SPRITEFIRE` — with a bug that also plays `SND_KEENFIRE`). `R_Mshot` removes the bolt on any wall hit (`:1023-1033`).
- **Contact**: **all pixie states are `C_Lethal`** — touching the sprite kills Keen; it ignores shots.
- **Design intent**: a floating turret — invulnerable, lethal to touch, fires when horizontally aligned. Controls sightlines and forces the player out of open lanes.

---

## MELEE / LUNGING ENEMIES

### Wormouth — `K4_ACT2.C:50-215`
- **Spawn**: info `7` (all), `51` (Normal+), `52` (Hard) (`K4_SPEC.C:368-377`); `wormouthobj`, `+0x8F` below tile.
- **State machine**: crawl `s_worm` (`slide`, tictime 4, **xmove 16** — the slowest patroller in the game), `T_Worm`. Periodic "peek" look-around `s_wormpeek1-8` (`:51-58`) when Keen is far (`US_RndT()<6`). `T_Worm` (`:156-175`): if Keen within ±1 tile vertically and in front within an 8–24px band → **bite** `s_wormbite1-5` (`SND_WORMOUTHATTACK`).
- **Contact**: `C_Worm` (`:185-191`) — shots only → `s_wormstun` (stunnable). `C_WormKill` during bite (`:201-215`) — kills Keen **only if Keen is on the biting side** (directional). Crawl-state contact is NULL — **the body is harmless; only the front-facing bite kills.**
- **Design intent**: a telegraphed ambush biter — it peeks to acquire you, then lunges with a short-range directional chomp. Reward for reading the tell; safe to touch from behind.

### Lick — `K4_ACT2.C:956-1098`
- **Spawn**: info `14` (all), `47` (Normal+), `48` (Hard) (`K4_SPEC.C:425-434`); `lickobj`, random facing, random initial `nothink` delay.
- **State machine**: `s_lick1` (`LickJumpThink`) → airborne `s_lick2/3` (`T_Projectile`, `LickAirReact` lands it, `:1092-1098`) → `s_lick4`. `LickJumpThink` (`:1008-1041`): faces Keen; if within ±1 tile vertically and in front → **flame-lick** `s_licklick1-8` (`SND_LICKATTACK`); else hops toward Keen (far: `xspeed=xdir*32, yspeed=-32`; near: half).
- **Contact**: `LickKillContact` during the lick (`:1068-1082`) — kills Keen only on the **licking side** (directional); `LickContact` otherwise (`:1051-1058`) — shots only → `s_lickstun` (manual recoil `yspeed-=16`). Hopping body is non-lethal.
- **Stun/pogo**: stunnable; lethal only mid-lick. **Design intent**: the aggressive mobile counterpart to Wormouth — a hopping flame that closes distance and lunges with a directional tongue. Combines pursuit with a telegraphed melee window.

### Treasure Eater — `K4_ACT3.C:53-311`
- **Spawn**: info `18`, ungated (`K4_SPEC.C:463-465`); `treasureeaterobj`, 24px above tile, random facing.
- **State machine**: idle `s_eaterstand1/2`; `T_EaterJump` (`:111-185`) is a treasure-seeking hop AI — scans for bonus **objects** above (within 3 tiles) or bonus **map tiles** (INTILE_DROP/BONUS100..AMMO) and jumps straight up (`yspeed=-48`) to grab; else hops toward a floor in its facing (`xspeed=xdir*20, yspeed=-24`), turning around when blocked; after checking both directions (temp1≥2) it **teleports** (`s_eatertport` smoke, `SND_TREASUREEATERVANISH`) via `T_EaterTeleport` (`:195-211`) to the next remaining bonus. `EaterInTile` (`:254-283`) devours bonus tiles on contact.
- **Contact**: `C_Eater` (`:221-244`) — **bonusobj → eats it** (`s_eatenbonus` animation, `SND_EATBONUS`; source flags a soft-lock bug if it eats a key); stunshot → stun (manual recoil `yspeed-=16`). **Keen contact does NOT kill** — the Eater is harmless to Keen.
- **Design intent**: a thief, not a killer — it races you to the treasure and teleports between hoards, converting a collectathon into a time-pressure chase. Stun it to protect your score; the design tension is greed vs. speed.

---

## RIDEABLE & PLATFORM ACTORS

### Bounder — `K4_ACT2.C:812-946`
- **Spawn**: info `12`, ungated (`K4_SPEC.C:414-416`); `bounderobj`, xdir=0 (starts bouncing straight up).
- **State machine**: `s_bounderup1/2` (vertical) / `s_bounderside1/2` (moving), all `T_Projectile`, react `R_Bounder`. `R_Bounder` (`:873-946`): on landing (`hitnorth`) bounces `yspeed=-50` (`SND_BOUNCE2`); **if Keen is riding (`gamestate.riding==ob`)** it steers toward Keen's side (`xspeed=xdir*24`) — a controllable trampoline; otherwise, temp1/temp2 counters force it to bounce straight up at least twice after Keen dismounts before it randomly picks a direction (`randnum<100`→left, `<200`→right, else up). Reverses at walls.
- **Contact**: `C_Bounder` (`:848-863`) — stunshot → stun (manual recoil `yspeed-=32`). **No KillKeen — the Bounder is rideable, not lethal.**
- **Design intent**: a living trampoline / vertical elevator you ride to reach heights, that also can be frozen; its "straight up twice after dismount" logic keeps it recoverable so you can re-board.

### Platform (tracked) — `K4_ACT2.C:1111-1285`
- **Spawn**: info `27-30` → dir up/right/down/left (`K4_SPEC.C:508-514`); `platformobj`, `ac_allways`.
- **Movement**: `T_Platform` (`:1159-1234`) glides at `12*tics` per tic along its axis and **reverses when the next tile in the infoplane equals 31** (a track-boundary marker); at track dead-ends it stops and requests a react. `R_Platform` (`:1244-1285`) draws the platform plus animated thruster sprites (side/up/down) using two extra sprite handles in temp2/temp3.
- **Contact/stun**: none — inert rideable. **Design intent**: rider transport that follows level-authored track markers; the thruster animation sells the motion.

### Dropping Platform — `K4_ACT2.C:1297-1392`
- **Spawn**: info `32` (`K4_SPEC.C:516-519`); `platformobj`, `cl_noclip`, remembers start-y in temp1.
- **State machine**: `s_dropplatsit` (`T_DropPlatSit` `:1331-1340`) — when Keen boards (`gamestate.riding==ob`) it sags at `16*tics`; after dropping 8px → `s_dropplatfall` (`DoGravity`, capped at 15px/tic, `:1350-1370`), falling until it meets a marker-31 tile; when Keen steps off it rises back (`s_dropplatrise`, `slide` ymove -32) to temp1.
- **Design intent**: a weight-triggered timing platform — stand and it plunges, leave and it resets — the classic "cross before it falls" beat.

---

## UNDERWATER ACTORS & SYSTEMS

### Dopefish — `K4_ACT3.C:523-838`
- **Spawn**: info `15` (all), `87` (Normal+), `88` (Hard) (`K4_SPEC.C:436-445`); `dopefishobj`, `cl_fullclip`, 3 tiles above tile.
- **State machine**: swim `s_dopefish1/2` stepthink tictime 20; `T_Dope` (`:591-614`) homes toward Keen in both axes (`AccelerateXv`/`AccelerateY` cap 10) unless blocked (temp1). `R_Fish` shared wall react. On contact it enters a scripted **swallow**: `s_dopeattack` → `T_DopeHunt` (`:624-682`) draws the target pixel-by-pixel into its mouth; `s_dopeeat` (60) → `s_dopeburp1/2` (`T_Burp` spawns rising bubbles, `SND_BURP`) → `s_dopereturn` glides back to its pre-attack position (temp2/temp3).
- **Contact**: `C_Dope` (`:781-812`) — **schoolfish → eats it**; **Keen (not godmode) → swallowed** (`hit->obclass=inertobj` to lock out other kills, `SND_KEENDEAD`, `s_keendopefood` → `s_keendieslow` → `T_EatenKeen` sets `ex_died`). Not stunnable.
- **Design intent**: the franchise-iconic apex predator — slow, dumb, relentless homing, and an instant unavoidable-once-caught death with a comedic swallow-and-burp. Its danger is dread and spacing, not reflex. (Source notes temp4 target-pointer is save-game-fragile.)

### Swimming Keen + bubbles (Wetsuit system) — `K4_SPEC.C:1013-1305`
- **Spawn**: info `42` → `SpawnSwimKeen` converts the player to underwater control (`K4_SPEC.C:538-548, 1042-1053`); `cl_fullclip`.
- **Control model**: `T_KeenSwimSlow` (`:1108-1185`) is momentum swimming — pressing jump gives a stroke burst (axis*18), and a per-8-tic drag routine bleeds `xspeed`/`yspeed` back toward rest (±1/±3 correction) so Keen coasts. Bubbles spawn every 60 accumulated tics (`SpawnKbubble`, `SND_BLUB`, `:1063-1098`) rising via `T_Bubble`. `T_KeenSwim` (`:1195-1230`) is an unused floatier variant (adds `tics*4` downward drift). `R_KeenSwim` (`:1296-1305`) zeroes velocity against walls.
- **Contact**: `C_KeenSwim` (`:1240-1286`) collects bonuses underwater (keys/1-up/ammo, `s_bonusrise`) and, on touching an `oracleobj`, sets `ex_rescued` — this is how the **final council member is rescued underwater**.
- **Wetsuit acquisition**: `SpawnScuba` (info `35`, `K4_ACT3.C:1288-1296`); `C_Scuba` (`:1306-1317`) — when Keen lands on it from above (`hit->hitnorth`) it sets `gamestate.wetsuit=true`, `SND_MAKEFOOT`, runs `GotScuba()` dialog, and **completes the level** (`ex_completed`).
- **Design intent**: the game's mid-point gating item — the scuba gear (hidden in Miragia) unlocks Three-Tooth Lake; underwater levels swap Keen's physics entirely to momentum swimming, and the Dopefish makes that water genuinely frightening.

---

## STATIC TRAPS

### Mine — `K4_ACT3.C:1042-1100`
- **Spawn**: info `69-72` → dir up/right/down/left (`K4_SPEC.C:594-600`); `mineobj`, `ac_allways`.
- **Behavior**: reuses `T_Platform` (`:1042`) — it **patrols a track** like a platform. `C_Mine` (`:1092-1100`) — Keen → explode (`s_mineboom1/2`, `SND_MINEEXPLODE`, KillKeen). Not stunnable.
- **Design intent**: a moving contact-bomb on rails — a lethal patrolling hazard that borrows platform track-following, so it sweeps a lane you must time.

### Dart Shooter + Dart — `K4_ACT3.C:1167-1269`
- **Spawn**: shooter info `53-56` (all), `79-82` (Normal+), `83-86` (Hard) → dir up/right/down/left (`K4_SPEC.C:550-576`); `inertobj`, `cl_noclip`.
- **Behavior**: `s_dartthrower` fires every **150 tics** via `T_DartShoot` (`:1225-1256`) — spawns an `mshotobj` dart in one of four directions (`s_dart1/2` horizontal xmove 64, `s_dartup/down` vertical ymove 64), all `C_Lethal`, `SND_SHOOTDART`. `R_Mshot` removes darts on wall contact.
- **Design intent**: authored directional turret trap — a metronomic lethal projectile the player times and slips past. Difficulty adds more shooters, not faster ones.

---

## INCHWORM & FOOT (emergent gag) — `K4_ACT2.C:640-796`
- **Spawn**: Inchworm info `11`, Foot info `10`, both ungated (`K4_SPEC.C:395-412`); `inchwormobj`/`footobj`.
- **Inchworm**: `s_inch1/2` step tictime 30, **xmove 128**, `InchThink` faces Keen (`:705-715`). **`InchContact` ignores Keen entirely** — `if (hit->obclass != inchwormobj) return;` — so inchworms are **harmless** to the player. It only counts collisions between inchworms (temp2).
- **The merge**: when one inchworm has touched **11 others** (i.e., 12 clustered), `InchContact` (`:725-782`) transmutes it into a giant **Foot** (`SND_MAKEFOOT`, rises 5 tiles, spawns four smoke puffs) and **removes every remaining inchworm** from the level.
- **Foot**: `s_footwait` is inert; `FootContact` is a no-op (source: "completely useless", `:792-796`).
- **Design intent**: a pure Monty Python easter-egg / emergent puzzle — herd twelve harmless worms together and they stack into the giant foot. Rewards curiosity; zero combat value. (`s_footchange` at `:646` is dead code, "never used".)

---

## SPECIAL / CUTSCENE LOGIC (`K4_SPEC.C`)

- **`ScanInfoPlane`** (`:303-636`): the master spawn dispatcher — one `switch` over every infoplane code that spawns actors, marks the graphics lumps each needs (`lumpneeded[]` → `CA_MarkGrChunk`, the memory-budget mechanism), sets scroll-blocks (info 25/26), and applies the three-tier difficulty fall-through described above. This is the single source of truth for **what appears at what difficulty**.
- **Rescue council members** (`RescuedMember`, `:949-1011`): each rescue increments `gamestate.rescued` (there are 8) and prints a rotating quip; the **Well of Wishes (mapon 17)** underwater version deliberately garbles the councilman's speech into bubble-talk ("...Blub.").
- **RescueJanitor** (`:763-836`): the running gag — the "final" rescue turns out to be, in the janitor's own words, *"just the janitor for the High Council."* A pure narrative beat, no gameplay.
- **CantSwim** (`:848-867`): guard cutscene — entering water without the wetsuit prints "I can't swim!" and bounces you out (source flags a possible out-of-memory bug in its caching).
- **PrincessLindsey / GotScuba**: clue and pickup dialogs (covered above).

---

## TAXONOMY TABLE

| Actor | Archetype | Lethal to touch? | Directional? | Rideable? | Shot reaction | Pogo-squash? | Difficulty-gated |
|---|---|---|---|---|---|---|---|
| Miragia | set-dressing (map) | no | – | no | – | no | no |
| Bonus/Key | pickup | no (beneficial) | – | no | – | no | ammo(34) conditional |
| Council Member | rescue NPC | no (rescue) | – | no | – | no | no |
| Lindsey | quest NPC | no | – | no | – | no | no |
| Schoolfish | set-dressing (follower) | no | – | no | ignored | no | no |
| Poison Slug | patrol + trail hazard | yes (+slime) | no | no | **stun (permanent)** | no | 22/43/44 |
| Arachnut | fast chaser | yes | no | no | **stun (recovers)** | no | 20/73/74 |
| Mad Mushroom | homing hopper | yes | no | no | **immune** | no | no |
| Mimrock | ambush (fake rock) | only pouncing | no | no | stun | no | no |
| Eggbird | patrol→flyer (homing) | yes | no | no | stun (recovers) | no | 76/77/78 (+egg 13) |
| Egg | trap (hatches) | hatches on touch/shot | – | no | hatches | no | no |
| Skypest | erratic flyer | yes | no | no | knockback only | **yes (resting)** | 8/45/46 |
| Thundercloud | ambush/area-denial | bolt only | no (vertical) | no | – | no | no |
| Berkeloid | invincible flyer + zoner | yes | no | no | **immune** | no | 5/49/50 |
| Fireball | projectile → ground fire | yes | no | no | – | no | (with Berke) |
| Wormouth | ambush biter | bite only | **yes** | no | stun | no | 7/51/52 |
| Lick | hopping lunger | lick only | **yes** | no | stun | no | 14/47/48 |
| Treasure Eater | thief | **no** | no | no | stun | no | no |
| Bounder | rideable trampoline | **no** | no | **yes** | stun | no | no |
| Platform | rideable transport | no | no | **yes** | – | no | no |
| Dropping Platform | rideable timing hazard | no | no | **yes** | – | no | no |
| Dopefish | homing apex predator | yes (swallow) | no | no | **immune** | no | 15/87/88 |
| Sprite/Pixie | floating turret | yes | no | no | **immune (C_Lethal)** | no | 17/23/24 |
| Mine | lethal patroller (rails) | yes | no | no | immune | no | 69-72 |
| Dart Shooter | static trap turret | dart only | no | no | – | no | 53-56/79-82/83-86 |
| Inchworm | harmless / merge-gag | **no** | – | no | ignored | no | no |
| Foot | inert prop | no | – | no | – | no | (via merge / info 10) |
| Scuba/Wetsuit | pickup (level-ender) | no (grant) | must land on top | no | – | no | no |

---

## THE 8 CLEVEREST ENEMY DESIGN IDEAS HERE (ranked)

1. **Mimrock reads the player's facing** (`K4_ACT3.C:363-411`). It only sneaks when Keen is *walking toward it* and freezes the instant Keen looks away — an AI that turns your own camera-attention into the trigger. The purest "the level watches you back" mechanic in the game.
2. **The Egg-as-trap hatching on any disturbance** (`K4_ACT1.C:664-718`). Shooting or brushing an egg *creates* the enemy plus shrapnel. It weaponizes the player's trained "shoot everything" reflex and teaches restraint — a single contact function that inverts a core habit.
3. **Skypest: shot-proof but pogo-squashable only while perched** (`K4_ACT1.C:1130-1173`). Splitting kill-methods by the enemy's *state* (shots merely bat it around; a pogo-stomp works only during the ceiling rest) creates a skill-expression window without a health bar.
4. **Treasure Eater as a non-lethal thief** (`K4_ACT3.C:221-283`). An enemy that can't hurt you but *destroys your score/keys and teleports between hoards* reframes a room as a greed-vs-speed race. Threatening the reward instead of the life is a rare and elegant pressure.
5. **Inchworm → Foot emergent merge** (`K4_ACT2.C:725-782`). Twelve individually harmless wanderers that self-assemble into the giant foot when clustered — a hidden, physics-of-crowding easter egg with its own bespoke counter, pure delight-reward for experimentation.
6. **Dopefish's slow, inevitable swallow** (`K4_ACT3.C:591-682`). Danger built from dread and spacing rather than reflex: a dumb homing fish, an instant-once-caught scripted gulp, and a comedic burp. It proves an enemy can be terrifying while being mechanically trivial.
7. **Directional melee windows (Wormouth & Lick)** (`K4_ACT2.C:201-215, 1068-1082`). The lunge kills *only from the attacking side*, so the body is safe from behind. This makes both enemies fully readable and rewards positioning over avoidance — the tell (peek / wind-up hop) is honest.
8. **Bounder's recoverable ride logic** (`K4_ACT2.C:873-946`). A rideable trampoline that steers toward you while boarded, then deliberately bounces *straight up at least twice* after you dismount so you can always re-board — a self-correcting transport that never strands the player. Thoughtful anti-frustration state design.

---

### 10-line summary

1. Read completely: `K4_ACT1/2/3.C`, `K4_SPEC.C`, `K4_DEF.H`, plus engine primitives in `CK_DEF.H`/`CK_STATE.C`.
2. Units: `TILEGLOBAL=256`=16px, `PIXGLOBAL=16`; state tuple field 6=tictime, 7=xmove, 8=ymove; gravity +4 (strong)/+3 (weak), cap 70.
3. Keen-4-specific: `StunObj` gives **no** knock-up bounce (`#ifndef KEEN4`), so enemies set recoil `yspeed` manually.
4. Difficulty gating lives entirely in `ScanInfoPlane` via case fall-through: most combat enemies have base/Normal+/Hard info codes (e.g. Slug 22/43/44).
5. Covered every actor: Miragia, bonuses, Council, Slug, Mushroom, Egg/Eggbird, Arachnut, Skypest, Wormouth, Thundercloud/bolt, Berkeloid/fireball, Inchworm/Foot, Bounder, Lick, Platform, Dropping Platform, Treasure Eater, Mimrock, Dopefish, Schoolfish, Sprite/Pixie, Mine, Lindsey, Darts, Scuba/swim-Keen.
6. Stun taxonomy: immune (Mushroom, Berkeloid, Dopefish, Sprite, Mine); permanent-stun (Slug); recover-stun (Arachnut, Eggbird); knockback-only (Skypest).
7. Non-lethal actors that still matter: Treasure Eater (thief), Bounder/Platforms (rideable), Inchworm (harmless + merge gag), Schoolfish (bait).
8. Directional lethality: Wormouth bite, Lick lick, Mimrock pounce — safe from the wrong side.
9. Included a full taxonomy table (archetype × lethal/directional/rideable/shot-reaction/pogo/gating) and the 8 cleverest ideas ranked.
10. **Note on delivery**: I am in read-only mode and did not write `keen4-actors.md`; this message IS the report (300+ lines, prose+numbers, `file:line` cited, one quoted line). Intended path was `/private/tmp/claude-501/.../scratchpad/study/keen4-actors.md` — have the parent persist it if a file copy is needed.