I now have all the concrete numbers verified across the four corpora. 

Note on delivery: I am running in read-only mode (file-search specialist) and cannot create or write files, so I cannot save `study/modality-corpus.md` to disk myself. Per my operating rules I return the full report content directly as my message text (the launching agent reads my output and can persist it verbatim to the target path). The complete report follows, then the 10-line summary and path.

---

# modality-corpus.md — A Modality Catalog for a Children's EFL NES-Era Game

**Study-only header / legal note.** Everything below is *observation and analysis*, never transcription. Console disassemblies (SMBDIS.ASM, the Contra and Punch-Out!! reconstructions) describe machine behavior that is not itself copyrightable; the modern sources (VVVVVV's officially released C++, NoelFB's Celeste `Player.cs`) are read here purely to understand *feel and structure*. **Zero code, data tables, or assets will be copied into our TypeScript/Phaser project.** Numbers are cited as design facts (a jump lasts N frames, a cap is N px/frame) the way one cites a physics measurement, and every claim points at the file it came from. Where a repo was missing I say so.

**Corpus actually studied (all under scratchpad/):**
- `SMBDIS.ASM` (16,351 lines) — Super Mario Bros disassembly (gist 1wErt3r/4048722).
- `nes-contra/` (vermiceli/nes-contra-us) — full Contra disassembly **with excellent prose docs** in `nes-contra/docs/`.
- `punchout/` (nmikstas/mike-tysons-punch-out-disassembly) — Mike Tyson's Punch-Out!! disassembly. **Note:** the repo named in the brief (`jamchamb/punch-out`) 404'd; I substituted this authoritative, heavily-commented disassembly and say so here.
- `VVVVVV/` (TerryCavanagh/VVVVVV, official source) — desktop C++.
- `Celeste_Player.cs` (5,471 lines) — fetched from NoelFB/Celeste `Source/Player/Player.cs`. **Note:** the gist ID in the brief (`7a5fa66…`) contained only an unrelated `routine.h`; the real `Player.cs` lives in the NoelFB/Celeste repo and that is what I read. Said so.
- Also present in workspace and cross-referenced for the Keen contrast: `keen4-6/`, `omnispeak/` (Commander Keen reimplementation sources).

---

## Chapter 1 — SMB movement vs Keen: momentum ground vs digital ground

### Where the model lives
The whole horizontal model is three data tables plus two routines in `SMBDIS.ASM`:
- `MaxLeftXSpdData: .db $d8,$e8,$f0` and `MaxRightXSpdData: .db $28,$18,$10` (lines ~6026–6031).
- `FrictionData: .db $e4,$98,$d0` (line ~6033).
- `PlayerPhysicsSub` (line ~6169, label `GetXPhy`) selects which index of those tables applies this frame.
- `ImposeFriction` (line ~6227) integrates a sub-pixel move-force into `Player_X_Speed`.

The speed bytes are the **high byte** of a 16-bit sub-pixel velocity, so they read straight as px/frame:

| Index | Meaning | Max right (`$xx`) | px/frame | Friction/accel adder |
|------:|---------|------------------:|---------:|---------------------:|
| 0 | Running (B held / RunningTimer set) | `$28` | **2.5** | `$e4` = 228 |
| 1 | Walking | `$18` | **1.5** | `$98` = 152 |
| 2 | Release / skid / low-traction | `$10` | **1.0** | `$d0` = 208 |

### The three things that give Mario "weight"
1. **Acceleration, not teleport-to-max.** `ImposeFriction` adds `FrictionAdderLow/High` to the current speed every frame and only *clamps* at the cap (`cmp MaximumRightSpeed`). You ramp *up* to 1.5 (walk) or 2.5 (run) over many frames — you are never instantly at top speed.
2. **A run *latch*.** Pressing B doesn't just raise the cap; `SetRTmr` writes `RunningTimer = $0a` (10 frames). So for ~10 frames *after* you release B, Mario still counts as "running." Momentum is a timed state, not an instantaneous input read.
3. **Skid as a real deceleration state.** In `GetPlayerAnimSpeed`/`ProcSkid` (line ~6180+), when `PlayerFacingDir ≠ Player_MovingDir` (you're pressing against your motion) the friction adder is **doubled** (`asl FrictionAdderLow; rol FrictionAdderHigh`, `ExitPhy`), and only once `Player_XSpeedAbsolute < $0b` does the code hard-set `Player_X_Speed = 0` and snap the moving direction to the facing direction. That is the visible "screech, pivot, then go" — a turn takes *time and distance*.

### Momentum jumps (the coupling Keen never has)
`ProcJumping` (line ~6074) reads `Player_XSpeedAbsolute` against thresholds `$09,$10,$19,$1c` to pick an index 0–4, then loads *four* coupled values:
- `JumpMForceData: .db $20,$20,$1e,$28,$28`
- `FallMForceData: .db $70,$70,$60,$90,$90`
- `PlayerYSpdData:  .db $fc,$fc,$fc,$fb,$fb`

At the top indices (running, 3–4) the initial vertical speed is `$fb` (−5 px/frame) versus `$fc` (−4) when slow, and the jump force is `$28` versus `$20`. **Translation: running makes Mario jump measurably higher and farther, from the same button.** Horizontal state feeds vertical outcome. This single coupling is why speedrun-flavored play *feels* like a physical system rather than a set of animations.

### Why Keen feels different (digital ground)
Commander Keen (studied via `keen4-6/` and the `omnispeak/` reimplementation) uses a **tile-quantized, near-digital** ground model: horizontal input maps to a small fixed set of speeds with negligible ramp, turning is nearly instantaneous, and there is no run-latch or speed→jump coupling — jump arc is essentially constant regardless of run-up. Keen's identity lives in **pogo-stick vertical control and pixel-precise platform reading**, not in momentum. The contrast a designer must feel:

| Dimension | SMB (momentum ground) | Keen (digital ground) |
|-----------|-----------------------|-----------------------|
| Reaching top speed | Ramp over many frames (accel `$98`/`$e4`) | Effectively immediate |
| Releasing input | Coast + `RunningTimer` 10-frame latch | Stops almost at once |
| Turning around | Skid state, doubled friction, distance cost | Near-instant pivot |
| Run affects jump? | **Yes** — higher/farther (index 3–4) | No — arc is constant |
| Precision felt as | "Reading the physics," commit early | "Reading the pixels," commit late |
| Failure mode | Overshoot / can't stop in time | Mistime a pogo / misjudge a gap |

**Design takeaway for a kids' EFL game:** momentum makes *stopping accurately* the skill; digital ground makes *placing yourself accurately* the skill. For young learners who must also read/parse language on screen, **digital (Keen-like) ground is friendlier** — it removes the "I slid past the answer" failure and lets attention go to the words. Reserve momentum for an optional advanced mode.

---

## Chapter 2 — Contra's modality alternation

### The switch is one byte
`nes-contra/docs/Level Headers.md`: each level header is 32 bytes; **byte 0 `LEVEL_LOCATION_TYPE`** selects the entire modality — `#$00` Outdoor (side/vertical scroller), `#$01` Indoor/Base (behind-the-back pseudo-3D), `#$80` Indoor Boss. **Byte 1 `LEVEL_SCROLLING_TYPE`** (outdoor only): `#$00` horizontal, `#$01` vertical. So the game's dramatic modality change is a *table lookup*, not a separate engine — a pattern we can copy structurally.

### Stage list and what changes
| # | Stage | Location byte | Modality | Camera | Movement DOF | Aiming |
|--:|-------|---------------|----------|--------|--------------|--------|
| 1 | Jungle | `$00` H | Side-scroll | Auto-scroll H | 2D run+jump+prone | 8-way |
| 2 | Base 1 | `$01` | **Behind-back "3D"** | Fixed/into-screen | Lateral + z-forward | z-plane, "up = forward" |
| 3 | Waterfall | `$00` V | Vertical climb | Auto-scroll up | 2D climb | 8-way |
| 4 | Base 2 | `$01` | Behind-back "3D" | Fixed/into-screen | Lateral + z-forward | z-plane |
| 5 | Snow Field | `$00` H | Side-scroll | Auto-scroll H | 2D | 8-way |
| 6 | Energy Zone | `$00` H | Side-scroll | H | 2D (+bullet-vs-BG collision, byte 25) | 8-way |
| 7 | Hangar | `$00` H | Side-scroll | H | 2D | 8-way |
| 8 | Alien Lair | `$00` H | Side-scroll | H | 2D | 8-way |

What the base/indoor mode actually changes (from `Level Headers.md` and `Contra Control Flow.md`): Bill and Lance **face away** from the player in a false-3D corridor; the player moves laterally while the world advances *into* the screen; **you cannot go prone**, and **"shooting up looks like shooting forward"** on the z-plane; the goal is not "reach the right edge" but "destroy the wall sensors and the core to open the electric gate." The `#$80` boss variant is a stripped indoor mode (no prone, forward-only aim) used for those gate/core fights and for the walk-into-screen transitions between 3D rooms.

### Aiming is where the two modes diverge mechanically
`nes-contra/docs/Aim Documentation.md`: enemies pick a `quadrant_aim_dir_xx` table by context —
- Outdoor enemies: `quadrant_aim_dir_00`, 3 dirs/quadrant → **11 aim directions**.
- Indoor/base, tanks, snipers, blobs: `quadrant_aim_dir_01`, 6 dirs/quadrant → **23 directions** (finer, because the corridor mode packs enemies denser and closer).
- Stage-3 dragon-arm seek: `quadrant_aim_dir_02`, 15/quadrant → **59 directions**.
The *player* keeps the same 8-way stick throughout; it's the **enemy targeting granularity** and the **meaning of "up"** that flip with the modality. Bullet velocities come from a shared cos/sin-style table (e.g. 45° → X=Y=`$b5`≈.707), so both modes share the projectile math even as the framing changes.

### Why the alternation refreshes rather than jars
1. **Shared verbs.** Run/aim/shoot/jump survive the cut; only *camera and the semantics of one axis* change. The player's hands don't relearn buttons.
2. **Pacing contrast, not rule contrast.** Side-scroll is lateral-traversal-under-fire; base mode is a claustrophobic aim-puzzle with a wall as the goal. The change lands as "new room, same me."
3. **Ceremony around the seam.** The `#$80` "walk into the screen" transition (an animation state, not a jump-cut) gives the brain a beat to re-orient. Alternation is *bridged*, never abrupt.

### Boss-wall anatomy
The base-stage climax is a **wall of independently-destroyable targets**: `wall_turret` (enemy type `#$13`) and a central `core` (`#$14`). Destroying the sensors/core clears the gate; turrets aim via `aim_and_create_enemy_bullet` on the 23-dir table. Difficulty is dialed *post-victory* through `GAME_COMPLETION_COUNT` (`nes-contra/docs/Game Completion Modifier.md`): soldier-spawn delay drops 40/loop, and boss HP scales `(weapon×16)+55+(completion×16)`, hard-capped at 160. The wall's *shape stays constant across loops; only its toughness and fire-rate climb* — a clean way to reuse one boss layout at many difficulties.

**Design takeaway:** we can build **one Phaser scene engine** and switch "modality" by a per-level `locationType`/`scrollType` config byte, exactly like Contra's header. Bridge each modality change with a short scripted transition so it reads as refreshing.

---

## Chapter 3 — Punch-Out!!'s facing-screen duel as a teaching machine

### The core loop: telegraph → dodge window → counter window
Every opponent is a **bytecode script** interpreted by a small state machine. The zero-page state (`punchout/…/Defines.asm`): `OppCurState $90`, `OppStateStatus $91` (`STAT_ACTIVE $80` / `STAT_FINISHED $83`), `OppStateTimer $92`, `OppStateIndex $93`, `OppStBasePtr $94/95`, `OppStRepeatCntr $96`. The script opcodes (Defines lines ~507–531) include `ST_TIMER $80`, `ST_SPRITES/_XY`, `ST_PUNCH $F9`, `ST_PNCH_ACTIVE $F0`, `ST_DEFENSE $F7`, `ST_VAR_TIME $E4`, `ST_CHK_BRANCH $F2`, `ST_CHK_REPEAT $F3`, `ST_JUMP $F1`, `ST_REPEAT $F5`, `ST_END $FF`.

Reading Glass Joe's right-hook state (`PRG_Bank000.asm`, `GJRighHook`, richly commented), the loop is *literally in the data*:
- **Telegraph** — index `#$1A`: `ST_WRITE_BYTE OppOutlineTimer $84`, commented *"Change opponent's outline color to indicate its time to dodge"* — a **4-frame colored tell** before the blow. The tell is a discrete, teachable signal, not noise.
- **Dodge window** — index `#$32`: `ST_PNCH_ACTIVE` followed by **three branch indices**: where to jump if the punch is **blocked / ducked / dodged**. The window's outcome is a switch on the player's defense (`MacDefense #$FF Dodge / #$08 Block / #$80 Duck`).
- **Counter window** — the dodged/ducked path (index `#$49`) loads a `ST_SPEC_TIMER` and opens `VulnerableTimer $04FD` ("*opponent is vulnerable while counting down*"). Land a punch inside it and you get the free-hit + a **star**.

So the machine *encodes the pedagogy*: a signal you can learn, a reaction window with graded correctness, and a reward window for the right answer.

### How patterns are sequenced and sped up
- **Sequencing:** `ST_REPEAT`/`ST_CHK_REPEAT` loop a sub-state N times; `ST_JUMP` chains to the next state's base pointer + index; `ST_CHK_BRANCH` reads memory (e.g. "is Mac throwing a super punch?") and forks. Patterns are therefore *composable scripts*, and different opponents are just different scripts over the same interpreter.
- **Speed-up:** `ST_VAR_TIME $E4` sets state duration from `VariableStTime $0581`, commented *"usually decreases after being punched."* Combined with `ReactTimer $05B8` (opponent reaction time), the same telegraph fires with a **shrinking dodge window** as the fight escalates. Later opponents reuse earlier scripts with tighter timers — the *difficulty curve is a timing multiplier on a fixed vocabulary of tells.*

### The economy (health / stars / rounds)
| Resource | Addr | Role |
|----------|------|------|
| Mac HP | `MacCurrentHP $0392` (max `MacMaxHP $0397`) | Depletes on hits; 0 = knockdown |
| Opp HP | `OppCurrentHP $0399` | Boss "life"; per-punch defense `OppHitDefense $B6+` subtracts from your damage per target zone |
| **Hearts** | `CurHearts… $0323`, `HeartTable $05A3` | *Stamina.* Throwing/whiffing/being blocked spends hearts; 0 hearts → Mac turns pink/groggy, **cannot punch** until recovered |
| **Stars** | `NumStars $0342`, `IncStars $0343`, `StarCountDown $0347` | Earned by countering a telegraph; up to 3; spent on the star/uppercut |
| Rounds | `RoundNumber $06`, `RoundClock $0301`, `CurrentCount $C2` (`#$9A`=1 … `#$A2`=9) | 3 rounds; `KnockdownSts $05`; 3 knockdowns/round or a 10-count = TKO |
| Combo | `ComboTimer $4A`, `ComboCountDown $4B` | Rewards chained clean hits |

The **hearts** system is the subtle teacher: it punishes *guessing* (mashing punch out of window costs stamina and can lock you out), so the game trains you to punch **only inside earned windows**. Stars reward *reading the tell*, not raw speed. HP+rounds give the macro-arc.

### Why it is a *teaching* machine — and its language-duel isomorphism
The duel is a pure **read → react → memorize** trainer: a fixed, legible vocabulary of telegraphs; graded feedback (blocked < ducked < dodged < countered); a stamina economy that penalizes noise and rewards precision; and difficulty that scales by tightening windows rather than adding chaos. That is exactly the shape of a **language-response drill**:

| Punch-Out!! | Language duel |
|-------------|---------------|
| Telegraph (outline tell, 4 frames) | **Prompt** appears (a word/phrase/audio cue) with a legible "cue" animation |
| Dodge/duck/block window | **Answer window** — pick the correct response type |
| Correct counter → star + VulnerableTimer | **Right answer** → bonus, opens a "free" follow-up question |
| Wrong/early punch spends hearts | Guessing/spamming spends a **stamina/attempt** resource |
| `ST_VAR_TIME` shrinking window | **Spaced-repetition speed-up** — mastered items get shorter windows |
| Different opponents = different scripts | Different **skills/units** = different prompt scripts over one engine |
| 3 rounds, knockdowns | **Levels/streaks**; miss too many = retry |

A single script interpreter (opcode list + per-"opponent" data) could drive every EFL "boss": vocabulary boss, tense boss, listening boss — each just a data file. **This is the most directly portable structure in the whole corpus for our purpose.**

---

## Chapter 4 — Modern feel synthesis: VVVVVV (one verb) + Celeste (QoL inventory)

### VVVVVV: the one-verb game and its room structure
The entire player verb, from `VVVVVV/desktop_version/src/Input.cpp` (~line 2921): on `jumppressed`, gravity flips **only if grounded or ceilinged** — `onground>0 && gravitycontrol==0 → gravitycontrol=1` (or the roof-mirror). **You cannot flip in mid-air.** The flip seeds motion with `vy=±4, ay=±3`; horizontal is `ax=±3` from left/right (`Input.cpp` ~2843), and position integrates as `xp += vx*5` (`Logic.cpp` ~427). There is **no jump, no double-jump, no dash** — the whole game is "walk left/right + flip which way is down." Constraining the verb to grounded-only flips is what makes it *readable*: at any instant you either are falling one way or the other, and one press commits the whole screen.

Room structure (from `Map.cpp`): a **static, single-screen camera** — no scrolling within a room — over a **20×20 grid of rooms** (`roomdeathsfinal[game.roomx-41 + 20*(game.roomy-48)]`), each room 40×30 tiles. Death respawns you at the room's entrance (checkpoint-dense). **The room is the atomic unit of challenge**: one screen, one idea, retry instantly. This is the ideal container for a kids' game — no lost progress, each screen a self-contained "sentence."

### Celeste QoL inventory (constants from `Celeste_Player.cs`)
Celeste is the opposite philosophy: **many verbs, exhaustively cushioned.** The tuning constants (all cited from `Player.cs`):

**Run/air (lines 23–33):** `MaxRun 90`, `RunAccel 1000`, `RunReduce 400`, `AirMult .65` (air control at 65% of ground). `Gravity 900`, `MaxFall 160`, `HalfGravThreshold 40` (reduced gravity near jump apex → floaty, controllable peak), `FastMaxFall 240`.

**Jump & the forgiveness layer (lines 48–53):**
- `JumpSpeed -105`, `JumpHBoost 40` (a jump nudges you *horizontally* toward your input — makes jumps "go where you meant").
- **`JumpGraceTime 0.1` = coyote time** — 0.1 s (~6 frames) after leaving a ledge you can still jump.
- `VarJumpTime .2` — variable jump height (hold longer = higher), with `CeilingVarJumpGrace .05`.
- **`UpwardCornerCorrection 4`** and **`DashCornerCorrection 4`** = corner correction — if a jump/dash clips a corner by ≤4 px, you're nudged clear instead of stopped. (**Input buffering** — pressing jump ~0.1 s *before* landing and having it fire on touchdown — is provided by Celeste's `VirtualButton` buffer, ~0.1 s, not a `Player.cs` constant; noted for completeness.)

**Dash (lines 75–85):** `DashSpeed 240`, `EndDashSpeed 160`, `DashTime .15`, `DashCooldown .2`, `DashRefillCooldown .1`, `DashAttackTime .3`, `EndDashUpMult .75` (upward dashes bleed a bit so they don't over-launch).

**Wall mechanics (lines 53–73, 82–99):** `WallJumpCheckDist 3`, `WallJumpForceTime .16`, `WallJumpHSpeed = MaxRun + JumpHBoost` (=130), `WallSpeedRetentionTime .06` (keep speed for 0.06 s after leaving a wall — grace for wall-to-wall), `WallSlideStartMax 20`, `WallSlideTime 1.2`; climbing: `ClimbMaxStamina 110`, `ClimbUpSpeed -45`, `ClimbJumpCost 110/4≈27.5`, `ClimbTiredThreshold 20`.

### Which QoL belongs in a kids' platformer — and which adds unwanted depth
| Feature | Constant(s) | Keep for kids? | Why |
|---------|-------------|:---:|-----|
| Coyote time | `JumpGraceTime 0.1` | ✅ **Yes** | Pure forgiveness; erases "I swear I was still on it" frustration. Invisible, only ever helps. |
| Input buffering | ~0.1 s (button buffer) | ✅ **Yes** | Same: press-early still works. Zero skill ceiling added. |
| Corner correction | `UpwardCornerCorrection 4` | ✅ **Yes** | Removes cheap head-bonk deaths; kids won't even notice, they'll just feel "fair." |
| Reduced-gravity apex | `HalfGravThreshold 40` | ✅ **Yes** | Floaty, legible peak → easier to aim a landing while also reading on-screen text. |
| Jump H-boost | `JumpHBoost 40` | ✅ mild | "Jump goes where I meant." Keep small so it's not a tech. |
| Variable jump height | `VarJumpTime .2` | ⚠️ optional | Adds nuance but also a *hold-timing* skill; fine, low-risk. |
| Dash (8-dir, refills) | `DashSpeed 240`, cooldowns | ❌ **No (default)** | Introduces a whole tech vocabulary (dash-jumps, wave-dashes, refill management). Depth we don't want competing with language attention. |
| Wall-slide / wall-jump | `WallJump*`, `WallSlide*` | ❌ **No** | Two more contact states to teach; raises the floor of "how do I move." |
| Climb + stamina | `ClimbMaxStamina 110` | ❌ **No** | A resource-management minigame orthogonal to learning English. |

**Synthesis rule for our game:** take **VVVVVV's discipline** (as few verbs as possible, one screen = one idea, instant retry, 20×20-style room grid) and bolt on **only Celeste's invisible forgiveness** (coyote + buffer + corner correction + floaty apex). Skip Celeste's *expressive* tech (dash, wall, climb). Result: a platformer where **moving is never the obstacle** — the obstacle is the language — yet nothing ever feels cheap.

---

## A modality catalog for our game

Five to seven shippable modalities, each a one-line spec + its lineage. All ride **one Phaser engine** switched by a per-level config byte (Contra's header trick).

1. **Digital-ground side-scroller** — Keen-like near-instant horizontal control, coyote + input buffer + corner correction, no momentum; single screen or gentle scroll. Answer-gates block progress. *(Keen ground + Celeste forgiveness + VVVVVV room discipline.)*

2. **One-verb gravity-flip room** — walk L/R, one button flips gravity, flippable only when grounded/ceilinged; static camera, one screen per idea, instant respawn. Collect the right word tokens on ceiling/floor. *(VVVVVV, `Input.cpp`/`Map.cpp`.)*

3. **Facing-screen language duel (the "boss" engine)** — a bytecode state machine: telegraph (legible cue) → answer window (choose response type) → counter/bonus window; hearts = attempt-stamina, stars = read-the-cue reward, rounds = streak; difficulty = shrinking windows via a `VAR_TIME` timer. Each unit/skill is a data script. *(Punch-Out!! `OppCurState` interpreter + opcode list.)*

4. **Behind-the-back corridor mode** — shared run/aim verbs, camera looks into the screen, "up = forward," goal is a **target-wall** of sub-tasks (a sentence's words as destroyable sensors) rather than a finish line. Bridged by a scripted "walk in" transition. *(Contra `LEVEL_LOCATION_TYPE $01/$80` + boss-wall anatomy.)*

5. **Vertical climb stage** — auto-scroll-up variant of modality 1 (`scrollType=1`), same verbs, camera rises; pace-change palette-cleanser between duels. *(Contra vertical outdoor + Celeste apex float for control.)*

6. **Momentum challenge (optional/advanced)** — SMB-style ramp + run-latch + skid + run-boosted jumps, gated behind an "expert" toggle; the *only* mode where stopping accurately is the skill. *(SMBDIS.ASM physics tables.)*

7. **Loop/mastery modifier** — a global "completion count" that tightens duel windows and target-wall toughness on replay without changing layouts, so authored content re-serves at many difficulties. *(Contra `GAME_COMPLETION_COUNT` scaling.)*

**Recommended core for launch:** modalities **1, 2, 3** (side-scroller, gravity-flip, duel-engine) — three distinct feels, one code engine, minimal movement tech, maximum room for the English. Add 4/5 as pacing variety, 6/7 as optional depth.

---

## 10-line summary

1. All four corpora cloned/fetched into scratchpad; two brief-named sources were wrong (Celeste gist held only `routine.h`; `jamchamb/punch-out` 404'd) — substituted NoelFB/Celeste `Player.cs` and nmikstas Punch-Out disassembly, noted in-report. Study-only; zero code copied.
2. **SMB:** momentum = accel ramp to caps (walk 1.5 / run 2.5 px/frame), a 10-frame run-latch, and a real skid state; running raises jump height/distance (`ProcJumping` index 0–4) — a physics *system*.
3. **Keen contrast:** near-digital ground, instant turns, constant jump arc — "place yourself" skill; friendlier for learners who must also read.
4. **Contra:** one header byte flips modality (outdoor scroller ↔ behind-back base ↔ boss); verbs shared, only camera + meaning-of-"up" + enemy aim granularity (11/23/59 dirs) change; transitions bridge the seam.
5. **Contra boss-wall** = destroyable turrets + core opening a gate; difficulty scales post-win via `GAME_COMPLETION_COUNT` while layout stays fixed.
6. **Punch-Out:** opponents are bytecode scripts (telegraph `OppOutlineTimer` tell → dodge window `ST_PNCH_ACTIVE` 3-way branch → counter/`VulnerableTimer` reward); hearts/stars/HP/rounds economy trains read-react-memorize and punishes guessing.
7. Punch-Out speeds up by shrinking timers (`ST_VAR_TIME`), not adding chaos — a spaced-repetition curve; maps cleanly onto a **language duel** (telegraph=prompt, counter=answer, hearts=attempts).
8. **VVVVVV:** one verb (grounded-only gravity flip, `vy=±4/ay=±3`), static single-screen camera, 20×20 room grid, instant respawn — the ideal minimal container.
9. **Celeste QoL (real constants):** keep the *invisible* forgiveness — coyote `JumpGraceTime 0.1`, input buffer ~0.1 s, corner correction `4`, floaty apex `HalfGravThreshold 40`; drop the *expressive* tech — dash (`DashSpeed 240`), wall-jump, climb-stamina — as unwanted depth.
10. **Catalog:** 7 modalities on one config-switched engine; launch core = digital side-scroller + gravity-flip room + duel-engine, so movement is never the obstacle — the English is.

**Intended report path:** `/private/tmp/claude-501/-Users-veho-Library-Mobile-Documents-com-apple-CloudDocs-Domi-Gym/3f0be190-b9d3-4744-afd2-bdbcad4e829f/scratchpad/study/modality-corpus.md` — I could not write it myself (read-only file-search role, no write tools); the full markdown above is ready to be saved verbatim to that path by the launching agent.