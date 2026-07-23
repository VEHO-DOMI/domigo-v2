I have now read every target file completely (K5: ACT1/2/3 + SPEC + DEF.H; K6: ACT1/2/3 + SPEC + DEF.H) plus the shared `statetype`/`objtype` structs in `CK_DEF.H`.

A note on delivery: my instructions forbid creating files (read-only study mode) and direct me to return findings directly as my message text for the parent agent to consume. So the full report follows inline. Intended path for the parent to save it: `/private/tmp/claude-501/.../scratchpad/study/keen56-actors.md`.

---

# Commander Keen 5 & 6 — Exhaustive Actor Study (Galaxy engine)

**Reimplementation stance:** This report records BEHAVIOR ONLY (numbers, state graphs, intents) to inform a from-scratch TypeScript/Phaser build. ZERO source code is copied; at most one line is quoted per the brief. All citations are `file:line` into the reconstructed K1n9_Duk3 source.

## Reading conventions

`statetype` struct field order (`CK_DEF.H:282`): `{leftshapenum, rightshapenum, progress(step|slide|think|stepthink|slidethink), skippable(bool), pushtofloor(bool), tictime, xmove, ymove, *think, *contact, *react, *nextstate}`.
- `progress`: `step` = advance animation + move by `xmove/ymove` scaled per tic; `think` = physics/velocity driven; `slide` = constant velocity `xmove/ymove`; the `*think` variants run the think fn every tic.
- Units: `TILEGLOBAL` = 256 global = 16px tile; `PIXGLOBAL` = 16 global = 1px. `US_RndT()` returns 0–255 (probability gates read as `x/256`). `tics` = elapsed frame ticks.
- `obclass` drives collision routing; `keenobj`, `stunshotobj` (player's stun shot), `mshotobj` (enemy shot), `bonusobj`, `platformobj`, etc.
- Difficulty gating pattern in both `ScanInfoPlane`s: each enemy has 3 consecutive info-tile IDs; `case Hard: if(<gd_Hard)break; case Normal: if(<gd_Normal)break; case Easy: Spawn…` — fall-through means base ID spawns on all difficulties, +1 on Normal+, +2 on Hard only.
- Common helpers: `KillKeen()` (death), `StunObj(ob,shot,state)` (non-lethal defeat → dizzy stars), `ExplodeShot(hit)` (consume player shot without killing enemy), `ClipToSpriteSide/Top` (make enemy a solid surface), `C_Lethal` (any touch kills Keen), `T_Projectile` (gravity), `R_Walk`/`R_Draw`/`R_Stunned` (shared react fns).

---

# EPISODE 5 — "The Armageddon Machine" (Omegamatic)

Level/world data: `K5_SPEC.C:210-280` (levels: Ion Ventilation System … Quantum Explosion Dynamo … Korath III). Win path is fuse-gated (below).

## Sparky — `K5_ACT2.C:48-258`
- **Spawn** (`:81`): one tile up (`y -= TILEGLOBAL`), random facing (`US_RndT()<0x80`). Info tiles 4/5/6 (`K5_SPEC.C:403-412`), Normal/Hard gated.
- **States:** walk1-4 (`:48-51`, step, tictime 8, xmove 128) → patrol. `T_Sparky` (`:109`) on walk1: `US_RndT()<0x40` → enter `s_sparkylook1` scan animation, zero xtry.
- **Scan:** look1-8 (`:52-59`); at look4 `T_SparkyLookL` (`:140`) and look8 `T_SparkyLookR` (`:163`) test vertical distance `player.bottom+TILE - ob.bottom ≤ 2*TILE`; if player on ~same level and on the correct side → `SND_SPARKYCHARGE`, enter `s_sparkyspeed1`, set `temp1=3`.
- **Charge:** speed1-4 (`:60-63`, tictime 4, xmove 0 = wind-up, skippable) count down via `T_ChargeCount` (`:126`) `temp1`; at 0 → charge1-4 (`:64-67`, tictime 4, **xmove 128 at half the walk frame-time = double speed**), plays `SND_WORLDWALK1` footfalls.
- **Movement/turn:** `R_Sparky` (`:234`) reverses at walls (`hitwest`/`hiteast`) and refuses to walk off ledges (`!hitnorth` → reverse), entering turn1-3 (`:68-70`) with random `nothink` cooldown.
- **Reactions:** `C_Sparky` (`:214`): Keen→`KillKeen`; `stunshotobj`→`StunObj`→`s_sparkystun` (`:71`, falls via T_Projectile). Pogo (stomp) not special — lethal on contact.
- **Intent:** patrolling sentry that periodically looks around and does a fast telegraphed horizontal charge when it spots Keen at its level. Stunnable. The archetypal "line-of-sight dasher."

## Little Ampton — `K5_ACT2.C:268-531`
- **Spawn** (`:293`): 8px up, random facing. Info 42/43/44 (`K5_SPEC.C:544-553`).
- **Walk:** walk1-4 (`:268-271`, xmove 128). `T_Ampton` (`:321`) every walk frame: footstep sounds; reads infoplane tile ahead (`map + …tileleft + 1`). If `INTILE_AMPTONCOMPUTER` → **fiddle** (fiddle1-5 `:278-282`, harmless idle animation, returns to walk). If `INTILE_POLE` and `US_RndT()<196` → grab pole, choose up/down (checks pole tiles ±2 rows), set noclip, climb.
- **Climb:** `s_amptonclimb` (`:275`, slidethink, ymove 32, noclip). `T_AmptonClimb` (`:397`) walks the pole, detecting pole ends via `NORTHWALL` transitions, then releases (release1-2 `:276-277`) back to walking.
- **Reactions:** `C_Ampton` (`:479`): Keen only dies if Ampton is in `s_amptonclimb` (**electrified on the pole**); otherwise `ClipToSpriteSide` — Ampton is a **solid, non-lethal body** while walking/fiddling. `stunshotobj`→ midclip, fall, `SND_AMPTONDIE`, `s_amptonstun` (`:283`).
- **Intent:** comic robot that patrols, stops to tinker with wall computers, and rides poles vertically; only dangerous while climbing (electric). Introduces the **pole/infoplane-interaction** verb reused by Shikadi.

## Slicestar — `K5_ACT2.C:543-679`
- **Two spawns.** Slide (`SpawnSlicestarSlide`, `:555`): orthogonal dir 0-3, **temp4 = 20 "health"**. Bounce (`SpawnSlicestarBounce`, `:593`): fullclip, random diagonal, **temp4 = 50 health**. Info 10/11/12 & 19/20/21 & 22/23/24 (`K5_SPEC.C:425-478`).
- **Movement:** slide state reuses `T_Platform` to travel straight and bounce off `PLATFORMBLOCK`; bounce state (`:544`, slide xmove/ymove 24) uses `R_Slicestar` (`:656`) reflecting off all four wall flags with `SND_SLICESTARBOUNCE`.
- **Reactions:** `C_Slicestar` (`:632`): Keen→`KillKeen`; `stunshotobj`→`ExplodeShot` and `--temp4`; only at 0 → `s_slicestarboom` (`:545`). 20–50 shots ⇒ **effectively unkillable**.
- **Intent:** a bouncing/sliding buzzsaw — a pure environmental hazard with nominal but impractical health. Teaches "some threats are to be dodged, not fought."

## Shelley — `K5_ACT2.C:689-906`
- **Spawn** (`:714`): note `obclass = sparkyobj` (source-flagged bug `:717`), random facing.
- **Behavior:** walk1-4 (`:689-692`). `R_Shelly` (`:861`): at a ledge (`!hitnorth`) → `s_shellylook` (`:693`, 100-tic pause). `T_ShellyLook` (`:742`): if player below its top and horizontally 1–3 tiles ahead in facing dir → leap (`xspeed 16, yspeed -24`, `s_shellyjump1`, T_Projectile arc).
- **Death is explosive:** `C_Shelly` (`:818`): Keen→`ClipToSpriteSide` then explode only if Keen's midx overlaps its body; `stunshot`/`mshot`→explode. Explosion spawns `s_shellyboom1-4` (`:699-702`, **C_Lethal** 4-frame blast) plus two shrapnel `s_shellypiece1/2` (`:703-704`, C_Lethal, R_Bounce, xspeed ±32 yspeed -24). `R_Shell` (`:889`): landing (`hitnorth`) also detonates.
- **Intent:** fragile leaping shell whose *death is the danger* — shooting it point-blank sprays lethal shrapnel. Punishes reckless firing; rewards distance.

## Shikadi Mine — `K5_ACT3.C:44-592`
- **Spawn** (`:77`): 2×3 noclip float body with a separate "eye" sprite (temp2/temp3 = eye offset, temp4 = eye sprite ptr). Seeds initial direction via `Walk` (`:133`)/`MinePosCheck` (`:107`, checks the 2×3 footprint is wall-free). Info 7/8/9 (`K5_SPEC.C:414-423`).
- **Chase AI:** `T_Mine` (`:284`) — if player within box (`xdist -5..2 tiles`, `ydist` band) → detonate (`s_mineboom1`, `SND_MINEEXPLODE`, remove eye). Else move `tics*10` using `ChaseThink` (`:188`): a full 4-direction pursuit that biases toward the axis of greater distance, forbids immediate reversal (`dopposite[]` `:56`), and falls back to random valid directions. Direction changes route through `s_minecenter`/`s_mineshift` (`:59-60`) which animate the eye sliding to its new offset (`T_MineCenter` `:379`, `T_MineShift` `:446`).
- **Detonation:** pulse frames (`:61-64`) → `T_MineFrag` (`:533`) spawns **six** `s_minepiece` shrapnel (bouncing, lethal via `C_MineFrag`) → boom (`:65-66`).
- **Reactions:** `C_Solid` (`:331`): `stunshot`→`ExplodeShot` only — the mine **cannot be shot down**, only triggered. `C_MineFrag` (`:348`): shrapnel kills Keen; **crucially handles `qedobj`** (`:358-368`) — mine debris overlapping the QED triggers `SpawnFuseFlash`×4, map reveal (`RF_MapToMap`), `SpawnDeadMachine`, and removes the QED.
- **Intent:** proximity mine with slow open-space homing; the deliberate **key to destroying the final machine (QED)** — you lure it in. Introduces maze-chase pathfinding to the roster.

## Robo Red — `K5_ACT3.C:597-760`
- **Spawn** (`:621`): 4 tiles up. Info 13/14/15 (`K5_SPEC.C:436-445`).
- **Behavior:** `s_robored` walk (`:604`, xmove 64). `T_RoboRed` (`:647`): when x-aligned to a 4px grid and vertically overlapping Keen and `US_RndT()<16` → face Keen, `temp1=10`, `s_roboredfire0` (`:605`, tictime 40 wind-up).
- **Fire:** fire1/2 loop (`:606-607`); `T_RoboShoot` (`:695`) spawns `s_rshot1` at `xspeed ±60`, **alternating `yspeed ±8` spread**, `SND_ENEMYSHOT`, recoils; decrements temp1 to 0 then returns to walk.
- **Reactions:** `C_RoboRed` (`:672`): `stunshot`→`ExplodeShot` and **retaliates** (faces Keen, temp1=10, opens fire) — **invulnerable**; Keen→`KillKeen`. Shots via `C_RShot`/`R_RShot` (`:735/:752`).
- **Intent:** armored gun-robot that cannot be killed and *punishes shooting it* by returning fire. The "do not engage, evade" enemy.

## Spirogrip — `K5_ACT3.C:765-859`
- **Spawn** (`:799`): sits on a surface. Info 16/17/18 (`K5_SPEC.C:447-456`).
- **Behavior:** sit states per facing (down/left/right/up, `:770-777`, tictime 150) → launch (slide, speed 64) → spin sequence spin1-8 (`:778-785`). `T_SpiroLaunch` (`:819`) at spin2/4/6/8: `US_RndT()<=20` → fly off in that cardinal direction (`s_gripfly*`, speed 48, `SND_SPIROFLY`).
- **Re-attach:** `R_SpiroFly` (`:851`): on hitting any wall → `nextstate` (sit on that surface), `SND_SPIROGRAB`.
- **Reactions:** shares `C_Spindread` (`:965`): Keen→`KillKeen`; `stunshot`→`ExplodeShot` — **invulnerable**.
- **Intent:** wall/ceiling gripper that periodically shoots itself across the room in a straight line and re-grips whatever it hits. Unkillable spatial/timing hazard.

## Spindred — `K5_ACT3.C:864-1026`
- **Spawn** (`:884`): 8px up, ydir 1. Info 77/78/79 (`K5_SPEC.C:646-655`). temp1 = bounce counter.
- **Physics:** spindred1-4 (`:871-874`, stepthink). `T_Spindread` (`:904`) integrates vertical velocity with gravity ±3 per odd tic, cap ±70 (source notes a double-move bug `:908-911`).
- **Bounce:** `R_Spindred` (`:985`): on floor/ceiling reverse; **every 3rd contact** (`temp1==3`) → big flip `yspeed ±68` (`SND_SPINDREDFLIP`), else normal `±40` (`SND_SPINDREDBOUNCE`).
- **Reactions:** `C_Spindread`: Keen→kill; `stunshot`→ExplodeShot — **invulnerable**.
- **Intent:** vertical floor-to-ceiling pogo hazard that occasionally bounces higher; pure timing gate.

## Shikadi Master — `K5_ACT3.C:1031-1320`
- **Spawn** (`:1065`): 24px up. Info 88/89/90 (`K5_SPEC.C:673-682`). temp1 toggles next action.
- **Behavior:** float master1-4 (`:1038-1041`). `T_Master` (`:1083`): `US_RndT()<0x40` → alternate **shoot** vs **teleport**. Shoot (`s_mastershoot1`, `:1042`) → `T_MasterShoot` (`:1119`) fires `s_mshot` toward Keen (`xspeed ±48, yspeed -16`, `SND_MASTERATTACK`). Teleport (`:1044-1047`) → `T_MasterTPort` (`:1170`) spawns floor-spark sprays, then relocates to a random collision-free tile near the player (up to 10 tries, `SND_MASTERBLAST`).
- **Shots:** `R_MShot` (`:1277`) bounces off walls; on ceiling spawns lethal floor `s_mspray*` (`:1052-1055`).
- **Reactions:** `C_Master` (`:1147`): `stunshot`→`ExplodeShot` and forced to shoot — **invulnerable**; Keen→kill.
- **Intent:** the invincible teleporting caster guarding the QED. You never kill it — you destroy the QED with a mine and escape. Introduces teleport-relocation and a "boss you outmaneuver, not out-shoot."

## Shikadi — `K5_ACT3.C:1325-1576`
- **Spawn** (`:1357`): **temp2 = 4 health**, temp3 = flash counter. Info 99/100/101 (`K5_SPEC.C:686-695`).
- **Behavior:** hover shikadi1-4 → walk1-4 (`:1334-1341`). `T_Shikadi` (`:1384`): closes on the player; if a `INTILE_POLE` tile sits at its leading edge → grab pole (`s_shikadigrab`, `SND_SHIKADIATTACK`).
- **Pole attack:** `T_PoleShock` (`:1481`) spawns a lethal `s_polespark` (`:1346-1347`, C_Lethal) that travels along the pole toward the player (`T_PoleSpark` `:1521` moves ±48/tic, dies when off the pole).
- **Reactions:** `C_Shikadi` (`:1450`): Keen→kill; `stunshot`→`--temp2`; at 0→`StunObj` (`s_shikadistun` `:1344`); else flash white twice (`temp3=2`, `needtoreact`, `ExplodeShot`). `R_Shikadi` (`:1544`) draws `maskdraw` (white) while `temp3`>0 — **hit-flash feedback**.
- **Intent:** the signature energy-being: walks, mounts poles, and shoots lethal sparks along them; 4-hit health with clear white-flash damage feedback.

## Shocksund / "Pet" — `K5_ACT3.C:1581-1869`
- **Spawn** (`:1613`): **temp2 = 2 health**. Info 102/103/104 (`K5_SPEC.C:697-706`).
- **Behavior:** run pet1-4 (`:1594-1597`). `T_Pet` (`:1633`): face player; random sit (`s_petsit`, temp1=10 loops); if not on player's level → jump (`s_petjump`, xspeed ±40 yspeed -40); random bark (`s_petbark` → `T_PetBark` `:1696` fires `s_pshot` spark, xspeed ±60, `SND_SHOCKSHUNDBARK`).
- **Gap-leaping:** `R_Pet` (`:1755`): at a ledge, if the player is ahead → **jump the gap to keep chasing**, else reverse. `R_PetJump` (`:1813`) lands back to run.
- **Reactions:** `C_Pet` (`:1724`): Keen→kill; `stunshot`→`--temp2`; at 0 stun; else flash. 2 hits.
- **Intent:** the most aggressive K5 chaser — a robotic dog that leaps gaps to pursue and spits lightning; 2-hit kill with flash feedback.

## Sphereful — `K5_ACT3.C:1874-2022`
- **Spawn** (`:1894`): fullclip float; temp1-4 = four orbiting guard sprite ptrs. Info 105/106/107 (`K5_SPEC.C:708-717`).
- **Behavior:** `T_Sphereful` (`:1914`) drifts with faux-gravity, accelerating x toward the player (cap ±8), yspeed cap 8. `R_Sphereful` (`:1954`) bounces off all walls (with a ceiling player-relative nudge, clamped `-4..-12`) and renders four guards orbiting on a `circle[16]` table (`:1956`) with front/back priority swap.
- **Reactions:** `C_Spindread`: Keen→kill; `stunshot`→ExplodeShot — **invulnerable**.
- **Intent:** slow floating orb with a lethal decorative escort; homes horizontally and bounces; unkillable ambient danger with strong visual identity (the orbiting guards).

## Scottie — `K5_ACT3.C:2027-2108`
- **Spawn** (`:2047`): random facing. Info 124 (`K5_SPEC.C:721-724`) — **not difficulty-gated** (always present).
- **Behavior:** fast walk scottie1-4 (`:2032-2035`, xmove 128). `T_Scottie` (`:2073`): random stop-and-face (`s_scottieface`), randomly flips direction.
- **Reactions:** `C_Scottie` (`:2098`): Keen→`ClipToSpriteSide` only (**solid, harmless — does NOT kill**); `stunshot`→`StunObj` (`s_scottiestun`).
- **Intent:** harmless ambient critter (a little dog) that merely blocks/pushes; stunnable comic filler. Important as a design foil: not every mover is a threat.

## QED & Fuse specials — `K5_ACT3.C:2113-2141`, `K5_ACT1.C:426-502`, `K5_SPEC.C:1104-1158`
- **QED** (`:2128`): a 34px static `qedobj` with a NULL do-nothing state. Destroyed only by mine shrapnel (`C_MineFrag`), which fires `SpawnFuseFlash`, reveals the broken machine tiles, and calls `SpawnDeadMachine`.
- **Dead Machine** (`K5_ACT1.C:475-502`): `T_DeadMachine` sets `playstate = ex_qedbroke` on map 12 (final) else `ex_fusebroke` — the level-complete trigger.
- **Fuse counting** (`K5_SPEC.C:531-542`): info tile 41 either seeds `numfuses=4` + `SpawnQed` (map 12) or increments the level's fuse count. `FinishedFuse` (`:1112`) shows the "one of four machines — toast!" message.
- **Intent:** K5's meta-progression: four guarded "machine" levels each hide a fuse; breaking them and finally destroying the QED (via a lured mine) wins. **Fuse-gated, tool-mediated win condition** — a distinct progression grammar from "reach the exit."

### K5 platform/utility actors (`K5_ACT1.C`)
- **Bonus items** (`:291-381`): gems/sugar/1-up/ammo/keycard; `bonusshape[]` table (`:301`); fly variants fall with gravity.
- **Platform / Slotplat** (`:512-561`, `T_Platform` `:571`): rides `PLATFORMBLOCK` tracks in one axis, reversing at blocks; slot variant offset +4px (source notes tictime-0 bug `:515`).
- **Dropping platform** (`:761-859`): sits until Keen rides (`gamestate.riding==ob`), falls after 8px, rises back when vacated.
- **Static platform** (`:871-893`): inert rider surface; **difficulty-inverse spawn** (easy/normal only, see gating below).
- **GoPlat** (`:906-1052`, `T_GoPlat` `:953`): follows infoplane direction-arrow tracks (`pdirx/pdiry[]` `:52-53`), speed `tics*12`.
- **Volte-Face** (`:1160-1345`): a lethal orb that patrols an arrow track at `tics<<5`; `C_Volte` (`:1334`): Keen→kill; `stunshot`→`ExplodeShot`+`s_voltestun` (`:1172`, 300-tic disable) then resumes. Temporarily stunnable moving hazard.
- **Sneaky platform** (`:1350-1416`): sits until Keen jumps toward it within 4 tiles, then **dodges away** (`s_sneakplatdodge`) — a troll platform.
- **Cannon** (`:1421-1524`): timed directional laser turret (`s_cannon` 120-tic cycle → fire), 4 directions.

---

# EPISODE 6 — "Aliens Ate My Baby Sitter!" (Fribbulus Xax)

Level data `K6_SPEC.C:202-284`. K6 replaces fuses with **quest items + world-map gates** and **big switches**; win = rescue Molly.

## World-map quest gates (`K6_ACT1.C`)

### Grabbiter — `K6_ACT1.C:376-478`
- **Spawn** (`:394`): sleeping if `sandwichstate==2`, else awake. Info 88 (`K6_SPEC.C:589`).
- **Gate logic:** `C_Grabbiter` (`:421`): `sandwichstate 0` → "Get me lunch and I'll tell ya a secret!" dialog, **pushes Keen back** (impassable). `state 1` (after collecting the sandwich) → eats it, reveals secret, sleeps (`s_grabbitersleep`), `sandwichstate=2` → path opens.
- **Intent:** an item-gated NPC blocking a world-map route. Not lethal — a **traversal puzzle**.

### Rocket — `K6_ACT1.C:483-716`
- `C_Rocket` (`:540`): `passcardstate 0` → "Passcard required" block; `state 1` → flies Keen along an arrow path (`s_rocketfly`, `T_RocketFly` `:613`) to a new map region, toggling `rocketstate`. Passcard-gated vehicle.

### Grapple spot — `K6_ACT1.C:721-894`
- Cliff top/bottom (`temp1` type). `C_GrappleSpot` (`:838`): `hookstate 0` → "Wish I had a rope and grappling hook" block; `state 1` → throw rope (`s_throwrope`, `T_ThrowRope` spawns rope sprite), `hookstate=2`; `state 2` → climb up/down (`s_climbrope`, `T_ClimbRope`). **Rope-climb traversal**, hook-gated.

### Satellite — `K6_ACT1.C:897-1093`
- Rides an arrow path (reuses `T_GoPlat` via `T_Satellite` `:981`) between `satellitestop` spots (type 1/2). `C_Satellite` (`:1019`): grabs Keen at a new stop (`s_worldkeensatellite`) and ferries him to the paired stop, then drops him. **Rideable waypoint shuttle** on the map.

### Quest items & Molly — `K6_ACT1.C:1096-1255`
- Sandwich/Hook/Passcard/Molly all use `C_Molly` (`:1192`): touching sets `playstate = ex_sandwich | ex_hook | ex_card | ex_molly`. Molly = rescue = victory. `GotSandwich/GotHook/GotPasscard` (`K6_SPEC.C:796-887`) set `sandwichstate/hookstate/passcardstate = 1`, unlocking the gates above.
- **Intent:** K6's progression grammar is an **item→gate quest chain** on the overworld, not fuses. Explicit "fetch X to pass Y."

## Combat actors

### Bloog — `K6_ACT1.C:1755-1835`
- **Spawn** (`:1774`): 2 tiles up. Info 4/5/6 (`K6_SPEC.C:349-358`).
- Walk1-4 (`:1760-1763`). `T_BloogWalk` (`:1802`): `US_RndT()<0x20` → re-face player. `C_Bloog` (`:1825`): Keen→kill; `stunshot`→`s_bloogstun`. **One-hit stun**, occasional re-targeting.
- **Intent:** the baseline grunt (Fribbulus's Yorp-equivalent). Simplest walker.

### Blooguard — `K6_ACT1.C:1838-2003`
- **Spawn** (`:1866`): 40px up, **temp2 = 3 health**, temp1 = flash. Info 85/86/87 (`K6_SPEC.C:578-587`).
- Walk1-4 + attack. `T_BlooguardWalk` (`:1895`): random re-face; if lined up on same level and `rnd<0x20` → club swing `s_blooguardattack1` (`:1852`). `T_BlooguardAttack` (`:1924`): `SND_SMASH`, `groundslam=23` (screen-shake), and if `player->hitnorth` (grounded) → **stun Keen** (`s_keenstun`) — a disabling, non-lethal melee.
- `C_Blooguard` (`:1942`): Keen→kill; `stunshot`→`--temp2` (3 hits), flash white; `R_Blooguard` (`:1971`) flash render.
- **Intent:** heavy club-wielder whose ground-pound **stuns rather than kills**; 3-hit health. Introduces a disabling attack.

### Blooglet — `K6_ACT1.C:2006-2136`
- **Spawn** (`:2051`): four colors (red/yellow/blue/green, `type%4`); `temp1>3` flags a hidden key gem. Info 7-14 (`K6_SPEC.C:360-372`).
- Fast walk (tictime 5). `C_Blooglet` (`:2097`): Keen→`ClipToSpriteSide` (**solid, harmless**); `stunshot`→ if `temp1>3` **spawn a flying key gem** (`SND_DROPKEY`) then stun.
- **Intent:** harmless colored swarm critters; some drop collectibles when stunned — shooting is *rewarded*, not just defensive. Great low-threat variety.

### Nospike — `K6_ACT2.C:43-347`
- **Spawn** (`:76`): 24px up, **temp4 = 4 health**; temp1 = air-step counter, temp2 = running flag(lo)/flash(hi), temp3 = question-mark sprite. Info 47/48/49 (`K6_SPEC.C:472-481`).
- Stand→walk. `T_NospikeWalk` (`:105`): random stop; if same level & `rnd≤0x20` → **run** toward player (tictime 4). `T_NospikeRun` (`:153`): keeps running; stops if it overran Keen or went off-screen.
- **Cliff comedy:** `R_NospikeRun` (`:313`): if it runs off a ledge, `temp1` counts air-steps; at 6 → **confused** (`s_nospikeconfused`, spawns a "?" sprite) → **falls** (`s_nospikefall`) → self-stuns on landing (`SND_SMASH`).
- **Enemy-vs-enemy:** `C_Nospike` (`:195`, `:239-253`): two Nospikes running head-on into each other **stun both**.
- `stunshot`→`--temp4` (4 hits), on hit it turns to run at Keen.
- **Intent:** Looney-Tunes runner — can be **baited into running off cliffs** to self-destruct, and collides with its own kind. Rich, teachable behavior.

### Gik — `K6_ACT2.C:349-532`
- **Spawn** (`:373`). Info 50/51/52 (`K6_SPEC.C:483-492`).
- Walk (`C_ClipTop` — harmless on top). `T_GikWalk` (`:401`): if player within ~7 tiles and on/above its level → **leap** toward Keen (`xspeed ±40, yspeed -28`, `SND_GIKJUMP`). Lands → **slide** (`s_gikslide`, **C_Lethal while sliding**) with slope-based friction (`rticmask/lticmask[8]` keyed to `hitnorth & 7` slope type, `:452-453`). Slides to a stop → stand → walk.
- **Intent:** only lethal *mid-slide*; introduces **slope-aware sliding friction**. Timing/positioning enemy.

### Cannon — `K6_ACT2.C:534-640`
- Timed 4-direction laser turret (same as K5); source notes shot-not-removable bug (`:586`).

### Orbatrix — `K6_ACT2.C:642-868`
- **Spawn** (`:679`): 24px up; temp3/temp4 = float bob offset/dir, temp1 = bounce counter. Info 70/71/72 (`K6_SPEC.C:523-532`).
- Floats with a vertical bob (`R_Orbatrix` `:756`, ±8px). `T_OrbatrixFly` (`:708`): random idle; if same level & within 5 tiles → **curl** (`s_orbatrixcurl`) then **bounce** as a lethal ball (`s_orbatrixbounce`, `C_OrbatrixBounce` kills Keen) for **temp1=5 bounces** (`T_OrbatrixCurl` `:818`), then **uncurl** and resume floating.
- `C_Orbatrix` (floating) `stunshot`→interrupt to idle (float form unkillable); bounce form `stunshot`→stop.
- **Intent:** floating enemy that periodically becomes a lethal bouncing ball for a fixed count, then reverts. The bob gives it life; not really killable.

### Bip & Bipship — `K6_ACT2.C:870-1134`
- **Bipship** (`:936`): flying saucer, `AccelerateX` cruise; `T_BipshipFly` (`:1016`) turns at east/west walls and non-floor ahead, and **shoots at Keen** when aligned (`mshot`, xspeed ±64). `C_Bipship` (`:1127`): `stunshot`→**explode** (`s_bipshipexplode`) → `T_BipshipExplode` (`:1090`) spawns smoke + ejects a **Bip pilot** that walks out.
- **Bip** (`:878`): pilot walker; `T_BipWalk` (`:893`) follows player on same level else random turn. `C_Bip` (`:918`): Keen stomping it (`hit->ymove>0`) → **squish** (`SND_BIPSQUISH`, inert).
- **Intent:** two-stage enemy — shoot the ship, then **stomp** the ejected pilot. Introduces Mario-style stomp-to-kill (`ymove>0` check).

### Flect — `K6_ACT2.C:1136-1311`
- **Spawn** (`:1160`). Info 76/77/78 (`K6_SPEC.C:545-554`).
- Always faces the player (`T_FlectStand/Walk` `:1188/:1224`, turns via `s_flectturn`). `C_Flect` (`:1258`): Keen→`ClipToSpriteSide` (**solid, harmless body**); `stunshot`→ if shot `xdir==0` (a dropped/vertical shot) stun; else if the shot comes **opposite to its facing** → **reflect it back** (`hit->xdir = ob->xdir; hit->temp4 = true` so the shot can now stun *Keen*), `SND_SHOTBOUNCE`.
- **Intent:** a front shield that **turns your own weapon against you** unless flanked. New verb: approach-direction puzzle enemy.

### Fleex — `K6_ACT3.C:39-155`
- **Spawn** (`:68`): 40px up, **temp2 = 4 health**, temp1 = flash. Info 18/19/20 (`K6_SPEC.C:381-390`).
- Walk (reuses `R_Blooguard`). `T_FleexWalk` (`:97`): **if the player stands still** (`!player->xmove`) → pause and "look" (`s_fleexlook`); else face+chase. `T_FleexLook` (`:117`) re-aims; after looking → run (`s_fleexrun`). `C_Fleex` (`:130`): Keen→kill; `stunshot`→`--temp2` (4 hits), flash; hit while looking → resume walking.
- **Intent:** a pursuer whose behavior **keys off player motion** — it watches when you hold still, chases when you move. 4-hit health.

### Bobba — `K6_ACT3.C:158-348`
- Hopping cannon (mini-boss). `T_BobbaStand` (`:233`): every 3rd landing fires an arcing lethal shot (`s_bobbashot`, `SND_BOBBASHOT`), else jumps (edge-checks infoplane `NORTHWALL`, reverses at ledges). `C_Bobba` (`:285`): Keen→kill; `stunshot`→`ExplodeShot`+knockback reverse — **invulnerable**.
- **Intent:** invincible hopping artillery; dodge, don't fight.

### Babobba — `K6_ACT3.C:350-563` (K6 final boss)
- **Spawn** (`:387`). Jumps + fires bouncing shots (`s_babobbashot`, vanish after time). `T_BabobbaStand` (`:415`): random **sleep** (`s_babobbasleep`, long, `C_BabobbaSleep`), else every 3rd → fire, else jump. `C_Babobba` (`:473`): Keen→kill; `stunshot`→`StunObj` (`s_babobbastun`) — **KILLABLE** (unlike Bobba), including while sleeping.
- **Intent:** the defeatable end boss — a bigger Bobba with **vulnerable sleep windows**; stun to win.

### Blorb — `K6_ACT3.C:565-644`
- **Spawn** (`:585`): fullclip, random diagonal. `R_Blorb` (`:621`) bounces off all four walls (`SND_BLORBBOUNCE`); `C_Lethal` (touch kills), no stun handling → **unkillable**.
- **Intent:** DVD-logo diagonal bouncing hazard for the dark-dome levels. Pure ambient danger.

### Ceilick — `K6_ACT3.C:646-765`
- **Spawn** (`:687`): noclip, disguised as a ceiling tile (`TONGUE1`, `s_ceilickhidden`). `T_CeilickHidden` (`:708`): if player is within **40px below** and horizontally aligned → **tongue attack** downward (`s_ceilickattack1-11`, lethal `C_Lethal` frames), then **laughs** exposed (`s_ceilicklaugh`, `T_CeilickLaugh`), then re-hides.
- `C_Ceilick` (`:754`): only during the laugh (exposed) does `stunshot`→stun (`s_ceilickstun`).
- **Intent:** ambush ceiling-dweller — threat from above, camouflaged as scenery, vulnerable only in its taunt window. A genuinely new spatial verb.

## Big switches & force fields — `K6_SPEC.C:669-784`
- `FlipBigSwitch` (`:669`): toggles the switch tile art, then toggles whatever it's linked to (tile coords packed in the infoplane): **direction arrows** (`arrowflip`), **platform-track blocks** (`PLATFORMBLOCK` XOR — enable/disable goplat paths), **bridges** (extend/retract animated tiles), and **force fields** (activate/deactivate lethal barriers, `INTILE_FORCEFIELD`/`FORCEFIELDEND`).
- **Intent:** K6's signature environmental verb — **lever/light-switch interactions reconfigure the level** (open bridges, drop force fields, redirect platforms). Turns levels into stateful puzzles.

## K6 platform/utility actors (`K6_ACT1.C`)
Platform (`:1265`), dropping platform (`:1399`), static platform (`:1509`, difficulty-inverse), GoPlat (`:1545`, now rendered with a decorative "Bip" rider sprite `R_GoPlat` `:1674`), sneaky platform (`:1690`). Bonus items (`:280-371`) drop the K5 keycard type (K6 uses passcard/hook/sandwich instead).

---

# META-ANALYSIS: How id scaled enemy design across episodes

The Galaxy engine's actor model (state table + think/contact/react + info-plane spawns + difficulty fall-through) stayed constant from K4→K6. What id scaled was the **vocabulary of verbs** layered on top, and the **axes of difficulty**. (K4 baseline is documented in the sibling K4 study; here I characterize what K5 and K6 *add*.)

### 1. New enemy verbs by episode
**Keen 5 additions (electric/space-station theme):**
- **Multi-hit health as identity** — Shikadi (4hp, `K5_ACT3.C:1364`), Shocksund (2hp, `:1620`) with **white hit-flash** feedback (`temp3`/`maskdraw`), teaching "this one takes several shots."
- **The invulnerable attrition/avoid enemy as a whole class** — Slicestar (20–50 "health"), Robo Red, Shikadi Master, Sphereful, Spirogrip, Spindred, Volte-Face all consume shots via `ExplodeShot` without dying. K5 leans hard into "you cannot kill everything; route around it."
- **Retaliation** — Robo Red and the Master *fire back when shot* (`C_RoboRed:672`, `C_Master:1147`). Shooting can make things worse.
- **Info-plane terrain interaction** — Ampton rides poles (`INTILE_POLE`) and fiddles with computers (`INTILE_AMPTONCOMPUTER`); Shikadi sends sparks down poles. Enemies now read and use the map's semantic layer.
- **Maze-chase pathfinding** — the Mine's `ChaseThink` 4-direction pursuit (`:188`).
- **Composite/orbiting actors** — Sphereful's 4 escort sprites and the Mine's separate "eye" (multi-sprite single object).
- **Teleportation** — the Master relocates near the player.
- **Tool-mediated, fuse-gated win** — you destroy the QED by *luring a Mine into it* (`C_MineFrag:358`), and progression is gated by breaking four fuse-machines (`ScanInfoPlane` case 41). The win condition itself became a verb.

**Keen 6 additions (organic/overworld-quest theme):**
- **Reflection** — Flect returns your shots (and makes them able to stun *you*), forcing flanking (`C_Flect:1258`).
- **Ceiling ambush / disguised-as-scenery** — Ceilick (`:708`).
- **Stomp-to-kill** — Bip squished by a downward-moving Keen (`ymove>0`, `C_Bip:918`).
- **Two-stage enemies** — Bipship → ejected Bip pilot.
- **Enemy self-destruction via terrain** — Nospike overruns cliffs and self-stuns (`R_NospikeRun:313`); the player can *bait* it.
- **Enemy-vs-enemy** — head-on Nospikes stun each other (`C_Nospike:239`).
- **Slope-aware physics** — Gik's per-slope sliding friction (`:452`).
- **Player-behavior-reactive AI** — Fleex reacts to whether Keen is moving (`T_FleexWalk:97`).
- **Non-lethal disabling attacks** — Blooguard's ground-slam **stuns Keen** instead of killing (`:1924`).
- **World-map quest gating + rideables** — item→gate NPCs (Grabbiter/Rocket/Grapple/Satellite) and rope-climb/vehicle traversal (`K6_ACT1.C`).
- **Light-switch level reconfiguration** — force fields, bridges, platform tracks toggled by switches (`FlipBigSwitch:669`).
- **A killable boss with vulnerability windows** — Babobba sleeps (`:415`); contrast K5's untouchable Master. K6 re-grants the "defeat the boss" fantasy but *conditionally* (stun during sleep).

### 2. How the difficulty vocabulary grew
The core mechanism never changed: three consecutive info-tile IDs per enemy with `if(difficulty<gd_X)break;` fall-through controls **spawn density** (Easy = base only, Hard = all three). Both episodes use it identically (`K5_SPEC.C:403-724`, `K6_SPEC.C:349-633`). What grew *around* it:
- **Inverse scaffolding.** Static helper platforms are gated the *other* way — case 33 spawns only on Easy, case 34 on Easy+Normal (`K5_SPEC.C:511-516`, `K6_SPEC.C:427-438`). Easier difficulties literally get **more crutches**. This is differentiated instruction encoded in the tile grammar.
- **Resource-adaptive spawns.** Ammo pickups suppress themselves when the player is flush (`case 69: if(ammo>=5) break;` → downgrade to a lesser item, `K5_SPEC.C:599-602`, `K6_SPEC.C:502-505`).
- **Per-enemy HEALTH as a second difficulty axis** (K5/K6 innovation over pure density): Shikadi 4, Shocksund 2, Blooguard 3, Nospike 4, Fleex 4. Hardness is now "how many hits AND how many of them," not just "how many."
- **Behavioral hardness** independent of tiers: retaliation (K5), reflection (K6), disabling attacks (K6) raise skill demand without changing counts.

### 3. Reuse discipline
Scaling was cheap because id **reused think/react fns across actors**: `C_Spindread` is the shared "invulnerable, kill-on-touch" contact for six K5 enemies; `T_GoPlat` drives platforms *and* the K6 Satellite; `R_Blooguard` renders Fleex; `T_Projectile`/`R_Bounce`/`R_Stunned`/`R_Walk` are universal. New enemies are mostly new *state tables* wired to a small library of behaviors — a composition model, not bespoke code per monster. For a reimplementation this is the key lesson: build a **behavior library + data-driven state tables**, not one class per enemy.

---

# Six ideas that transfer best to a school-themed EFL platformer

1. **Item-gated NPC gates (Grabbiter / Rocket / Grapple).** A "hall monitor / locked door" that only opens when the learner brings the right thing — a vocabulary card, a correct answer, a completed mini-task. This is the cleanest mapping of *lesson objectives → traversal* and is inherently non-violent. Reuse the `state`-machine gate: block + prompt → (condition met) → open/transport.

2. **Multi-hit + hit-flash feedback (Shikadi / Fleex / Blooguard).** Encode "this needs several correct responses" as enemy health with a white-flash per hit (`temp3`/`maskdraw`). Perfect for spaced repetition: the learner sees tangible progress per correct answer, and the enemy's color/flash is unambiguous feedback.

3. **Reflection / must-flank puzzle enemy (Flect).** A creature you can't beat by "spamming" — you must approach from the correct side / use the correct form. Teaches that some problems require the *right strategy*, not brute force (e.g., a grammar-guardian that bounces back wrong tenses; you must use the correct one to get past).

4. **Non-lethal stun/disable as the default outcome (stun everywhere; Blooguard's dizzy ground-slam).** The entire K5/K6 roster's "defeat" is `StunObj` → dizzy stars, and Blooguard *stuns* rather than kills. For a children's EFL game, make the whole failure/win vocabulary **"stunned / dizzy / snoozing,"** never death — directly reusable and age-appropriate.

5. **Light-switch level reconfiguration (FlipBigSwitch: bridges / force fields / platform tracks).** Tie knowledge to the world's shape: answer correctly → flip a switch → a bridge extends or a barrier drops. This binds *comprehension to spatial reward* far more memorably than a score counter, and the toggling-tile mechanic is straightforward to reimplement.

6. **Reward-bearing harmless critters + motion-reactive life (Blooglets drop gems; Scottie is harmless; Fleex watches when you stand still).** Populate levels with **low-threat, collectible-bearing critters** so shooting/interacting is *rewarding*, not just risky — essential for younger learners' confidence. Layer in a Fleex-style "the world reacts to what you do" creature (looks at you when you pause) for a gentle sense of an attentive, responsive environment.

*(Honorable mention for older students: Nospike's "bait the enemy off a cliff" and enemy-vs-enemy collisions teach systems thinking — the environment, not just the avatar, is a tool.)*

---

## 10-line summary

1. Read completely: K5 `ACT1/2/3`+`SPEC`+`DEF.H` and K6 `ACT1/2/3`+`SPEC`+`DEF.H`, plus the shared `statetype`/`objtype` structs in `CK_DEF.H`.
2. Documented every K5 actor — Sparky, Ampton, Slicestar, Shelley, Mine, Robo Red, Spirogrip, Spindred, Shikadi Master, Shikadi, Shocksund, Sphereful, Scottie, QED/fuse specials, plus all platform/cannon/Volte utilities — with spawn, full numbered state graphs, movement, contact/stun reactions, and intent.
3. Documented every K6 actor — Bloog, Blooguard, Blooglet, Nospike, Gik, Orbatrix, Bip/Bipship, Flect, Fleex, Bobba, Babobba, Blorb, Ceilick, Grabbiter, and the sandwich/hook/passcard/Molly + rocket/grapple/satellite/big-switch specials — same template.
4. K5's identity: multi-hit health + hit-flash (Shikadi 4hp, Shocksund 2hp) alongside a large class of **invulnerable "avoid me" enemies**; retaliation (Robo Red, Master); pole/computer info-plane interaction; maze-chase Mine; teleporting Master; **fuse-gated, mine-destroys-QED win**.
5. K6's identity: **reflection (Flect)**, **ceiling ambush (Ceilick)**, **stomp-to-kill (Bip)**, two-stage enemies (Bipship→Bip), self-destruct-via-terrain and enemy-vs-enemy (Nospike), slope friction (Gik), motion-reactive AI (Fleex), stun-attacks (Blooguard), **world-map item-gates + rideables**, **light-switch level reconfiguration**, and a **killable boss with sleep windows (Babobba)**.
6. Difficulty vocabulary: constant 3-tier density fall-through, but scaled with **inverse helper-platform gating** (easy gets more scaffolding), resource-adaptive ammo spawns, and **per-enemy health as a new axis**.
7. Scaling method: heavy **reuse of shared think/react fns** (`C_Spindread`, `T_GoPlat`, `R_Blooguard`, `T_Projectile`) + data-driven state tables — new monsters are mostly new tables, not new code.
8. Cited throughout as `file:line`; one line quoted maximum per the brief; behavioral knowledge only, zero code copied.
9. Six EFL transfers proposed: item-gated NPCs, multi-hit+flash feedback, must-flank reflection puzzles, universal non-lethal "stun/dizzy" outcomes, switch-driven level reconfiguration, and reward-bearing harmless critters + motion-reactive life.
10. Delivery: report returned inline (read-only mode forbids file creation); intended save path `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/keen56-actors.md`.