# DISCREPANCY AUDIT — game-paint vs. the canonical 1995 decompilation

Sources read (actual C, this session, not prior-round summaries):
`~/Code/rayman-study/src/rayverse/src/` — `ray.c` (all 2,834 lines), `moteur.c`
(engine loop, gravity, mover, camera, activation), `blocs.c` (slope/floor
functions, spring blocks, surface-follow), `basic.c` (`calc_btyp_square`,
`calc_btyp`), `collision.c` (`RAY_HIT`), `poing.c` (all), `bonus.c` (all),
`cage.c` (all), `objupdate.c` (`DO_WIZARD`/`TEST_WIZARD`, `OBJ_IN_THE_AIR`).
The secondary witness (`rayman-from-scratch/`) is two 600KB flat text files;
it was not needed — the decomp answered everything.

Ours read: `packages/game-paint/src/` — `paint.ts`, `collide.ts`, `player.ts`,
`swing.ts`, `camera.ts`, `rig.ts`, `level.ts`, plus `fist.ts` (the fist audit
target lives there).

Unit note used throughout: the original's `decalage_en_cours` is a 1/256-px/tick
momentum accumulator (`ray_inertia_speed` → `speed_x = instantSpeed(decalage>>4)`,
`instantSpeed` = `>>4` with fractional dithering) — **identical in scale to our
"subs/tick"**. Original tile = 16px, ours = 16px. So all numbers below compare
1:1. Its `eta` speed tables are in 1/16 px/tick (32 = 2 px/t).

---

## 1 · CONFIRMED MATCHES

1. **Momentum in 1/256-px integer subs** — `decalage_en_cours` + `instantSpeed()` (`ray.c: ray_inertia_speed`, `moteur.c: instantSpeed`) = our SUBS=256 accumulator, including the fractional-dither idea (ours: exact integers, theirs: dithered `>>4`).
2. **Mover order: vertical resolve before horizontal** — `DO_RAYMAN` (`ray.c`): `STOPPE_RAY_EN_XY` → `move_up_ray/move_down_ray` → `RAY_TO_THE_RIGHT/LEFT`; our `moveBody` does vertical-first then horizontal.
3. **Jump velocity −5 px/t** — `ray_jump` (`ray.c`): `ray.speed_y = -5`; ours `jumpVy = -5*256`.
4. **Gravity suppressed while the button is held, ≤ 12 ticks** — `RAY_IN_THE_AIR`: `DO_PESANTEUR` gated on `(!fire1 || jump_time > 12 || in_air_because_hit …)`; ours `jumpHoldTicks = 12` + `pad.jump`.
5. **The tick-23 late nudge** — `RAY_IN_THE_AIR`: `if (jump_time == 23) ++ray.speed_y`; ours `lateNudgeTick = 23`.
6. **Fall cap +4 px/t, rise cap −10 px/t** — `RAY_IN_THE_AIR` tail: `speed_y > 4 → 4`, `< -10 → -10`; ours `fallCap`/`riseCap` exactly.
7. **Hover slow-fall capped at +1 px/t** — `DO_PESANTEUR` case 3 (helicopter mode) drives `speed_y` toward exactly 1; ours `hoverFallCap = 256`.
8. **Hang = static grip; UP does nothing (it is a camera peek); DOWN drops; exit is a full −5 jump** — `RAY_RESPOND_TO_UP` case 5 sets only `v_scroll_speed = 255` (look-up), `RAY_RESPOND_TO_DOWN` case 5 drops, `ray_jump` from `main_etat 5` takes the `-5` branch. Our hang machine mirrors all three (camera-peek noted as later work).
9. **Ledge-grab requires an airborne state, motion into the wall, air above the lip** — `CAN_RAY_HANG_BLOC` (`ray.c`): `MUR` on the hand-side cell + five `AIR` cells above/around + `main_etat == 2`; our `ledgeGrabAt` requires solid target, air above, clear approach column.
10. **Landing snap to the surface + never end a tick inside a solid** — `recale_position` (`blocs.c`) snaps y via per-block-type recale functions; our landing snap + 3-try eject invariant.
11. **Slope surface shapes** — `blocs.c` floor functions: 45° = `15-x`/`x`; 30° pairs = `15-(x>>1)`, `7-(x>>1)`, `x>>1`, `(x>>1)+8` — our `slopeSurfaceYPx` cases `/ \ 1 2 3 4` are these exact ramps.
12. **Grounded surface-follow with a step allowance (~3px lip)** — `CALC_MOV_ON_BLOC` (`blocs.c`) recomputes floor y at `x + speed_x` and accepts `dist_to_bloc_floor < 3` steps; our follow pass with `GROUND_SNAP_PX`.
13. **Wall lookahead probes a doubled step at several body heights** — `STOPPE_RAY_EN_XY` (`moteur.c`) probes `x + 2*speed_x` at y−8/−24/−40/−56; ours sweeps the moved edge over head→feet rows.
14. **Knockback ±2 / −3, fast enemies ±5 / −6** — `RAY_HIT` (`collision.c`): hazard hit `speed_x = ∓2, speed_y = -3`; enemy `bump_speed` 2 (normal) or 5 (`flags1_4_fast_bump`), `speed_y = ~bump` = −3 / −6. Ours `knockVx/Vy`, `knockFastVx/Vy` exactly.
15. **120-tick i-frames on a standard hit** — `RAY_HURT`: `iframes_timer = 120`; ours `iframeTicks = 120`.
16. **Spring bounce = jump −5 then −3 more = −8 px/t, hold window dead** — `IS_ON_RESSORT_BLOC` (`blocs.c`): `ray_jump(); speed_y -= 3; jump_time = 12`. Our `SPRING_VY = -8*256` with `holdLeft = 0` — numerically identical arc (see M8 for the one nuance). *Upgrade our T marker to D.*
17. **Fist charge: ground seed 5, +1/tick, cap 63; air throw = fixed charge 32** — `RAY_PREPARE_FIST` (`poing.c`): `charge = 5` ground / `charge = 32` air; `RAY_GROW_FIST`: `++charge; >= 64 → 63`. Ours: seed 5, `chargeMax 63`, `airCharge 32`.
18. **Fist damage = (charge>>4)+1 → 1..4** — `RAY_THROW_FIST`: `poing.damage = ashr16(charge,4)+1`; our `fistDamage`.
19. **Fist speeds 5 / 8 / 11 px/t, run boost `max(|vx|−5,0)` only when momentum agrees with facing, total cap 16 px/t** — `RAY_THROW_FIST`: tier speeds 5/8/11, `+= MAX(Abs(speed_x)-5, 0)` under the facing-alignment test, `MIN(speed_x, 16)`. Our `fistSpeeds`, `fistLaunchSpeed`, `fistRunBoostCap` (but see M5 on the tier *selector*).
20. **Swing: 512-unit circle, arc clamped [128, 384], step `(|cos|>>7)+1` = 1..5 units/tick fastest at the bottom, 5-tick dwell at each extreme** — `RAY_BALANCE` (`ray.c`): `timer = 5` at the extremes, `v4 = (abs_cosinus(angle)>>7)+1`, flip at ≤128 / ≥384. Our `swing.ts` clamps [128,384], `swingStep = ⌊|cos|·4⌋+1`, `swingDwellTicks 5`.
21. **Swing rope ≈ 95–100 px; release adds a −2 lift on top of the tangential speed** — `RAY_BALANCE`: `follow_y` regulated into 95..100; `ray_jump` from `main_etat 7`: `decalage = speed_x<<7; speed_y -= 2`. Ours: rope 96, release `vy = -2*256` + tangential vx.
22. **Vine: snap the body to the 16px column, ±1 px/t climb *direction* semantics, jump exits the vine** — `recale_ray_on_liane` masks x to the tile (`& ~0xF`); `RAY_RESPOND_TO_UP/DOWN` case 4 set `speed_y = ∓1`. Ours snaps to column center and climbs (speed differs, see M7).
23. **Entity activation zone with a +60 hysteresis margin once active** — `in_action_zone` (`moteur.c`): `zdiff_x += 60; zdiff_y += 60` when already active; ours `activationMarginPx = 60`.
24. **Camera vertical: rest line ≈ 57–64% of view height, /4 easing, minimum step 3** — `recale_ray_pos` (`moteur.c`): `v_scroll = ashr16(screen_y - rest, 2)` with `MAX_2(spd, 3)` floor; rest = `(zdc_h>>1) - offset_by + 114` on a 200-line view. Ours: `camVertBandPct 57`, `camEaseDiv 4`, `camMinSpeed 3`.
25. **Magician bonus entry costs exactly 10 tings** — `DO_WIZARD` (`objupdate.c`): gate `num_wiz >= 10` (case 1), payment loop decrements `num_wiz` every 2nd tick until `link - num_wiz == 10` (case 3).
26. **Run is a distinct state resumed on landing only if fast enough** — `RAY_IN_THE_AIR` landing: run resumes iff `Abs(speed_x) >= eta[1][3].speed_x_right >> 4`; our run/walk pose split with speed hysteresis is the same idea (thresholds are ours, T).

---

## 2 · MISMATCHES (ranked by feel-impact)

### M1 — Gravity cadence: theirs is +1 px/t every **3rd tick**, ours every tick (HIGH)
**Canonical:** `RAY_IN_THE_AIR` (`ray.c`) increments `gravity_value_1` mod 3 and
`gravity_value_2` mod 4 every airborne tick; `DO_PESANTEUR` (`moteur.c`) then adds
`speed_y += 1` **only when the counter wraps to 0** — case 1 (the standard air
nibble, the one the code resets stray states back to): every 3 ticks ≈ **0.33 px/t²
≈ 85 subs/t²**; case 2 states: every 4 ticks. Full arithmetic of a held jump:
12 hold ticks at −5 (60 px) + decay −5→0 at 1-per-3-ticks (45 px) ≈ **105 px apex
(~6.5 tiles)**; a tap still gets ~60 px. The famous float lives in that mod-3 clock.
**Ours:** `gravity: 256 // D: +1 px/t per tick` (`paint.ts`) — **3× the canonical
gravity**. Our held jump ≈ 75 px (60 + 15), tap ≈ 30 px.
**Fix (minimal):** either (a) adopt the clock — apply `+256` subs only when
`jumpTicks % 3 == 0` (one line in the gravity branch of `stepPlayer`), or
(b) keep the snappier arc as a deliberate small-body retune but **relabel the
constant T, not D** — the current D marking is factually wrong and will mislead
every future feel session. Given the fresh-eyes law I recommend (b) only if the
feel-gate explicitly prefers it; (a) is what "do not reinvent the wheel" says.
Whichever way: retest `lateNudgeTick` (at 1/3 gravity the tick-23 nudge is
proportionally stronger and is what tucks the apex in).

### M2 — Default air control is **instant**, not inertial (HIGH)
**Canonical:** `RAY_RESPOND_TO_DIR` case 2 (`ray.c`): on a normal jump
(`nb_cmd == 0`, not helicopter) a direction press does `decalage_en_cours = 0`
then `RAY_SWIP` re-derives speed from the air state's table — `Reset_air_speed`
sets normal air states to 32 (= **2 px/t**) toward input / 16 (1 px/t) against,
48 (3 px/t) for rolling jumps, stretched up to the launch momentum (capped 112 =
7 px/t) when you jumped moving. Net: air steering **snaps** to ±2 px/t the tick
you press — no ramp. The inertial mode (`nb_cmd = 1`, friction 8/12 per
`RAY_SWIP` var_s0) engages only after slippery-ground launches or wind
(`determineRayAirInertia`).
**Ours:** air accel = 50% of `groundAccel` = 16 subs/t² always — reaching 2 px/t
takes 32 ticks (half a second). Mid-air corrections feel heavy vs. the studied game.
**Fix:** in `stepPlayer`'s horizontal block, when airborne and `dirInput != 0`,
set vx directly toward `min(max(|vxLaunch|, 2px/t), 7px/t) * dirInput` (snap, no
ramp), and keep the slow ramp only for a future "slippery-launch" flag. This is
the single biggest feel gap after M1.

### M3 — Slippery slopes push you downhill; slope jumps convert speed to height. Both absent (MEDIUM)
**Canonical:** `RAY_SWIP` grounded switch: slippery 45° blocks (types 18/19) add
`x_accel = ±6`, slippery 30° (20–23) `±4` (fed as the `a2` slot of
`ray_inertia_speed`, i.e. a per-tick downhill push on the momentum accumulator);
**solid** slopes push nothing. And `ray_jump` converts slope speed to launch:
on 45° with `speed_x >= 6`, `speed_y = -(speed_x+1)`; on 30° with `speed_x > 10`,
`speed_y = -(speed_x/2)-1` — running downhill and jumping launches you *higher
than −5*.
**Ours:** slopes are pure geometry (`slopeSurfaceYPx`); no downhill force, no
slope-jump conversion; ice (`~`) is flat-only.
**Fix:** (1) add a slope-slide term when `surfaceGlyph` is a slope AND the phase
surface is slippery: `vx += dirDownhill * (45° ? 6 : 4)` subs-scaled per tick
(×16 subs to match their units: ±96/±64 subs/t²  — verify against feel; their a2
unit passes through `ashl16(a2,2)` in the accumulator, so start at `a2*4*16 ≈
384/256 subs` and tune). (2) in the jump branch: if grounded on `/ \` with
`|vx| >= 6*256`, `vy = -(|vx|/256 + 1) * 256`; on `1 2 3 4` with `|vx| > 10*256`,
`vy = -((|vx|/512) + 1) * 256`. Ch. levels with painted hills will feel dead
without this.

### M4 — The fist's turn is a smooth deceleration, not a hard U-turn; return accel is a staircase (MEDIUM)
**Canonical:** `DO_POING` (`poing.c`): flight out at the launch speed while the
charge meter drains (`charge -= field_A` per tick; distance ∝ charge); at 0 the
fist **decelerates** via `alter_fist_speed` — −2 px/t² while |v|>10, −1 while
|v|>7, −0.5 (every 2nd tick) below — passes through v=0 (that tick flips
`is_returning`), then **re-accelerates home on the same staircase**, homing on
the hand in y. So the far end of a throw is a readable, ballistic hang.
**Ours (`fist.ts`):** constant speed to `travelLeftSubs = 0`, instant direction
flip, uniform `+0.5 px/t²` (`fistReturnAccel 128`) home, `y` eased /4.
**Fix:** replace the hard flip with signed velocity + the staircase (`accel =
|v|>10 ? 512 : |v|>7 ? 256 : 128 subs`), flip `returning` when v crosses 0.
~10 lines in `stepFist`; keeps `bounced` early-return as-is.
**Also (provenance, no code change needed):** the 5/8/11 tiers in the source are
selected by the fist **upgrade level** (`poing_obj->init_sub_etat` 1/3/5 normal,
8/10/12 golden — golden adds +2 damage), *not* by charge amount. Our
charge-tiered speeds are an invention (marked T — fine), but the paint.ts comment
block implies the tiering is studied; annotate it as our own economy.

### M5 — "Slippery friction 3 vs 6" is a misattributed constant (MEDIUM, correctness-of-record)
**Canonical:** the 6/3 pair in `ray_inertia_speed` (`unk_5`) is a **slope-term
additive** that is 6 in worlds 1/2/4/6 and 3 in world 3 (Mountain) — it is not a
slippery-ground friction. Real slippery behavior is built from three parts:
(a) `calc_btyp` marks `ray_last_ground_btyp = false` on slippery block types;
(b) turning on slippery ground goes through the slow-turn state (`RAY_RESPOND_TO_DIR`:
`set_main_and_sub_etat(1, 4)` instead of an instant flip); (c) jumps from
slippery ground carry momentum into the inertial air mode (`determineRayAirInertia`:
`nb_cmd = 1` when `|decalage| > 256`). The convergence gain itself (`a1`) is
**16 normal / 32 in the Mountain world** (`RAY_SWIP` `var_s4`), i.e. Mountain
converges *harder*, not softer.
**Ours:** `frictionNormal 6 / frictionSlippery 3` marked **D** with the claim
"slippery decays half as fast".
**Fix:** relabel both T (the halved-decay *feel* is a fine simplification and
already shipped past the feel gate), and bank the three real mechanisms above as
the reference model for the ice chapter: the studied ice feel is mostly the
slow-turn state + momentum-preserving jumps, not lower friction. Consider adding
(b): on ice, a direction reversal first decays vx to 0 at normal friction before
accelerating the other way (a two-line change in the horizontal block) — that is
the recognizable "skid turn."

### M6 — Camera horizontal: theirs ramps a follow *velocity*; ours eases position (MEDIUM-LOW)
**Canonical:** `recale_ray_pos` (`moteur.c`): horizontal keeps a persistent
`dhspeed` that moves ±1 per tick toward `(screen_x − windowEdge)/4` and is
applied as `h_scroll += dhspeed>>2`, **plus** the full `speed_x` is added while
the player is outside the window (edges at `112 − offset_bx` and
`special_right + 128` — an asymmetric window that produces the strong facing
look-ahead). Result: the camera *accelerates* into motion and *decays* out of
it — no minimum speed horizontally (the ≥3 floor is vertical only).
**Ours (`camera.ts`):** stateless `/4` position ease toward a look-ahead target
with `camMinSpeed 3` on **both** axes.
**Fix if the feel session reports "camera stops/starts abruptly":** keep a
`camVx` that steps ±1·256 subs/tick toward `diff/4` and apply it (≈6 lines);
drop the horizontal min-speed (it causes a visible 3px/t crawl on tiny
corrections; canonical only floors the vertical). Not urgent — ours passed the
movement-toy gate — but this is the exact source shape if it ever feels off.

### M7 — Vine numbers: jump off a vine is −3, climb is ±1 px/t, grab needs 10 airborne ticks (LOW)
**Canonical:** `ray_jump`: `main_etat == 4 → speed_y = -3` (the vine jump is
*weaker* than a ground jump); climb speed ±1 px/t (`RAY_RESPOND_TO_UP/DOWN`
case 4); `IS_RAY_ON_LIANE` only attaches when `jump_time > 10` (no instant
re-grab), and a downward vine exit sets a 10-tick no-regrab timer (`ray.timer = 10`).
**Ours:** vine jump = full `jumpVy` −5; climb `CLIMB_V` 1.5 px/t; attach any
airborne tick.
**Fix:** vine jump −3 (one constant), and add a 10-tick regrab cooldown after a
vine exit (prevents the flicker-regrab when jumping up a vine column). Climb
speed 1.5 is a fine T (theirs ±1 reads slow at our body size).

### M8 — Spring/jump bookkeeping: theirs sets `jump_time = 12`, ours resets to 0 (LOW)
**Canonical:** `IS_ON_RESSORT_BLOC` sets `jump_time = 12` after the boosted
jump — the hold window is *over* (fixed-height bounce ✓ ours too via
`holdLeft = 0`) **and** the tick-23 nudge arrives 11 ticks into the bounce.
**Ours:** `jumpTicks = 0` → our nudge fires 23 ticks in.
**Fix:** set `jumpTicks = 12` in the spring branch. One character; makes the
bounce arc tick-exact against the source.

### M9 — I-frame variants: 60 when crouched, clamp-to-90 on landing/state-exit (LOW)
**Canonical:** `RAY_HURT`: 120 normally but **60** if hit while crouched under a
low ceiling; `RAY_IN_THE_AIR` landing in the hit state clamps remaining i-frames
to 90 (`MIN(iframes, 90)`), and several grab/attach paths (`Make_Ray_Hang`,
`IS_RAY_ON_LIANE`, `SET_RAY_BALANCE`) grant 90 when escaping a hit into a grip.
**Ours:** flat 120.
**Fix:** optional — add the clamp-to-90-on-landing (one line in the landed
branch: `s.iframes = Math.min(s.iframes, 90)`). The 60-crouched case has no
analogue until we have a crouch.

### M10 — A 3-tick minimum airtime before landing can register (LOW)
**Canonical:** `RAY_IN_THE_AIR` requires `jump_time >= 3` before the landed
branch may run — the source's anti-jitter for launch frames overlapping the
floor; `CAN_RAY_HANG_BLOC` likewise requires `jump_time > 8` before a ledge can
be grabbed (no instant regrab of the ledge you just jumped from).
**Ours:** landing may trigger on any tick (our `freshLanding` handles the
geometric case but not the launch-overlap case); ledge grab has no post-jump
cooldown — a hang-exit jump with the stick still held into the wall *can* regrab
on early ticks (vy>0 comes quickly at our gravity).
**Fix:** gate landing on `jumpTicks == -1 || jumpTicks >= 3`, and the ledge probe
on `jumpTicks == -1 || jumpTicks > 8`. Two conditions; kills two classes of
flicker bugs we would otherwise meet in the ch01 Durchlauf.

---

## 3 · UNMINED GOLD (built in the source, not yet in game-paint)

**G1 · Bonus rooms with a per-level time budget.** `init_allowed_time`
(`moteur.c`) hardcodes a seconds budget per bonus map (20–50s: e.g. 30 for the
swinging-plums room, 45 flower platforms, 25 grass, 40 slippery, 20 bouncing
clouds); `calc_left_time` (`bonus.c`) starts the clock 120 ticks in
(`left_time = 60*seconds − map_time + 120`), and running out warps you home with
your tings restored (`nb_wiz_save`). `do_perfect_bonus` shows a results card —
first-time perfect pays a 1-up + is banked in a per-level bitfield
(`bonus_perfect`, `set_bonus_map_complete`). Entry is the magician: `TEST_WIZARD`
(`objupdate.c`) needs Rayman standing/walking beside him, snaps Rayman to a
16px-aligned spot 12px off the magician's edge, then `DO_WIZARD` charges exactly
10 tings (1 every 2nd tick — the counter visibly drains) before the fade-out.
Design can adopt: paid secret rooms, drained-counter payment feedback, timed
"perfect" replay bonus with a per-room budget table.

**G2 · Ting drip-back + 100-for-a-life economy.** Tings collected inside a bonus
map are held in `nb_wiz_collected` and dripped into the visible counter 1 per 4
ticks after returning (`DO_WIZ_AFTER_BONUS_MAP`, `bonus.c`); crossing 100 rolls
the counter and fires a status-bar celebration (`NOVA_STATUS_BAR`) + extra life
(`Add_One_RAY_lives`). The slow drip is the juice: rewards count themselves up.

**G3 · The moving-platform ride system.** `rayMayLandOnAnObject` (`ray.c`) is a
complete "stand on an object" contract: land when the feet-to-platform distance
is inside `max(|Δvy|+2, 4)` (8 when tiny), remember it as `follow_id`, then
`RAY_FOLLOW` adds the platform's per-tick velocity (with `instantSpeed` dithering
for fractional movers) to Rayman every tick; detach at distance ≥ 9 →
airborne state. Landing triggers per-type behavior: fall-platforms arm
(`skipToLabel` on `TYPE_FALLPLAT/LIFTPLAT`), move-on-touch platforms start
(`TYPE_MOVE_START_PLAT`), bouncy platforms store `MAX(speed_y, 2)` and throw it
back (`TYPE_BOING_PLAT`), crumble platforms begin their break state. Our
`platform.move`/`platform.fall` entity roles should copy the tolerance and the
detach-at-9 numbers verbatim.

**G4 · Plum physics (ride-a-bouncing-fruit).** `DO_FRUIT_REBOND` +
`do_boing` (`moteur.c`): a bounce halves and reflects vertical speed
(`speed_y = 1 - (speed_y>>1)` on flats, evaluated on the 2-tick clock) and adds
a slope kick (±2 on 45°, ±1 on 30°) so a plum thrown onto a hill hops downhill;
under ~2 px/t it settles. Riding = the same follow contract as G3. A thrown
plum is also a projectile platform: the studied "swinging plums" bonus is
plums hanging from pendulums. Everything needed for a ridable bouncing object
is in these two functions.

**G5 · Rising/falling water + drowning.** Water is a block type
(`BTYP_WATER`): `RAY_DEAD` (`ray.c`) detects feet-in-water and calls
`rayfallsinwater` (drown anim, 120 i-frames, splash via `allocate_splash`,
control cut). The water *level* is an object (`TYPE_157_EAU`) that stays active
across the level (`in_action_zone` special-case) and is nudged by scroll
triggers (`DO_AUTO_SCROLL` case 3 pauses/frees it via `iframes_timer`) — i.e.
rising-water chase sequences are trigger-driven, not scripted. For us: hazard
`w` already exists; the gold is the *moving waterline object* + freeze/release
triggers.

**G6 · Auto-scroll segments.** `DO_AUTO_SCROLL` (`moteur.c`): invisible
`TYPE_64_SCROLL` triggers with a mode number (0 = start forced scroll right,
1 = stop, 2/3 = vertical modes incl. a half-speed mode on the 2-tick clock);
forced scroll pushes `h_scroll_speed = 1..2`/t, and the map border kills on
contact (`RAY_DEAD`: `x < LEFT_MAP_BORDER - 10`). A ready-made "the page
scrolls, keep up" chapter mechanic — for us the border would open an encounter
instead of killing.

**G7 · Wind.** `ray_wind_force` (`RAY_SWIP`): a signed constant force added as
±10 to the momentum feed each tick while airborne, and it flips the air-control
mode to inertial (`determineRayAirInertia` → `nb_cmd = 1`). One variable plus
two hooks = wind corridors.

**G8 · Darkness levels + the firefly.** `dark.c` + `luciole.c`: a level flag
draws the scene through a small light circle; the firefly object enlarges it and
follows with lag. `fin_dark` releases it at the exit. (Read at surface level —
the render trick is palette-based; ours would be a paint-vignette shader, but
the *pacing* — darkness as a chapter modifier with a helper creature — is the
design-usable part.)

**G9 · The photographer checkpoint.** `TYPE_21_PHOTOGRAPHE`
(`DO_PHOTOGRAPHE_CMD`, `objupdate.c`; init in `objinit.c`): a character who
plays a camera animation when you pass, banking respawn `x/y` + object flags
(`save_objects_flags`); death restores the photographed state. Distinct from
our `C` glyph: the checkpoint is a *character with a moment*, not a marker —
worth stealing for the book fiction (a sketch-artist who draws you into the
margin?).

**G10 · Cage-break ceremony.** `DoCagePoingCollision` (`cage.c`): cages have
HP (fist-only damage), a hit state, and on the final hit: the grille flies up
(`allocateGrille`, vy −4 then −8), six pink captives burst out on a preset
velocity fan (`allocate_toons` with per-toon vx/vy tables and 20-tick
i-frames), a medallion overlay **freezes the whole world** (`gele = 1`,
`DO_MEDAILLON_TOON_GELE` runs its own mini-loop with sounds keyed to frames 41
and 64) while the world-map completion count ticks up. Our person-cage finale
per chapter wants exactly this ceremony shape: freeze → burst → medallion →
resume.

**G11 · Boss arena grammar.** Every boss file (`bbmont.c`, `moskito.c`,
`stoneman.c`, `skops.c`, `pmama.c`, `saxo.c`, `clown.c`) shares a frame:
`IsBossThere` flips when the boss enters the active zone (`in_action_zone`
boss flag), the camera locks (`scrollLocked`, `bossScrollStartX/EndX` set in
`action.c`), the fight is a `main_etat/sub_etat` pattern machine gated on the
shared animation clocks (`horloge[n]`), and `fin_boss` → `TEST_SIGNPOST`
(exit sign appears only after the win). The reusable rules: camera-lock defines
the arena; patterns are clock-gated states, not timers; the exit spawns on
victory. `bbmont.c` additionally shows a chase-boss (scroll edge advances with
the boss — `scroll_end_x` pushed per tick).

**G12 · Idle-animation carousel.** `RAY_RESPOND_TO_NOTHING` (`ray.c`): after
500 idle ticks (~8s) Rayman plays idle skit #1, then a new skit every 100 ticks
(counter rolls back by 100), cycling five distinct animations in a fixed
order before repeating. Our rig has one breathing idle; the carousel (rig-level
skits on the same 500/100 cadence) is cheap and is exactly the "alive vs.
stale" texture Koki gates on.

**G13 · Landing-impact dust threshold.** `ray.link` accumulates `speed_y` every
airborne tick (`RAY_IN_THE_AIR`); landing with an accumulated ≥ 200 spawns the
landing-smoke effect (`allocateRayLandingSmoke`). Ours has the `landed{impact}`
event carrying only the final tick's speed — copying the *accumulator* (total
fall, not instantaneous speed) makes tall-fall dust trigger exactly like the
studied game.

**G14 · Tiny-Rayman modifier.** `RayEvts.tiny` halves everything through the
pipeline: `ray_jump` (`speed_y = speed_y/2 − 1`), `SET_X_SPEED` (`xspeed /= 2`),
`calc_typ_trav` (halved probe heights), landing tolerance doubled (8 not 4).
A shrink-potion chapter modifier comes almost free if we thread one flag the
same way.

---

### Executive note on markers
`paint.ts` constants whose D/T markers this audit changes:
- `gravity` — D is wrong as stated (M1): source is +1 px/t **per 3 ticks**.
- `frictionNormal/frictionSlippery` — relabel T (M5): the 6/3 pair in the source
  is a world-dependent slope additive, not friction.
- `fistTier*` selection by charge — the tier *selector* is ours; speeds are D (M4).
- Spring −8 (`SPRING_VY` in player.ts) — may be promoted to D (match 16).
- Swing entry amplitude 210/302 — stays T (source computes the entry angle from
  the approach geometry via `ANGLE_RAYMAN`; ours is a fixed pose — fine).
