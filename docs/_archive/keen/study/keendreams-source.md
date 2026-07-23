# Keen Dreams — clean-room behavior study (Flower Power, Boobus Tuber, deltas vs Keen 4–6)

> **PROVENANCE LAW (binding):** this study documents BEHAVIOR and NUMBERS only; zero code is ever copied into our TypeScript reimplementation (the GPL/clean-room rule of docs/handover/25 §0). Source read read-only from the GPL Keen Dreams release (kd_def.h, kd_keen.c, kd_act1.c, kd_act2.c, kd_play.c, kd_main.c, kd_demo.c; id_rf.h for units).

**Units used below.** 1 tile = 256 "global units" (gu) = 16 px (id_rf.h:49–53). 16 gu = 1 px. The clock is a 70 Hz tic; speeds are gu/tic, frames consume an adaptive 2–6 tics (id_rf.h:35–36). Conversion: `px/s = (gu/tic ÷ 16) × 70`; for our 48-px tiles multiply px by 3. Examples: xspeed 64 = 4 px/tic ≈ 280 px/s (≈ 840 px/s at our scale); 70 tics ≈ 1 s.

---

## 1. FLOWER POWER — the non-lethal stun, exactly

**Throw ballistics** (kd_keen.c:60–63, 543–563):
- Horizontal throw: `xspeed = ±64`, `yspeed = −20` (a slight upward lob) — SPDPOWER=64, SPDPOWERY=−20 (kd_keen.c:61–62, 548–560).
- Up-throw: `yspeed = −64`, xspeed 0 (SPDPOWERUP, kd_keen.c:60, 545–547).
- Down-throw (only from air or pole): `yspeed = +64`, xspeed 0 (kd_keen.c:553–556).
- In flight: `ProjectileThink` = gravity + constant xspeed (kd_act1.c:183–187). Gravity: +3 gu/tic on every *odd* tic (avg +1.5/tic), terminal velocity 80 gu/tic (ACCGRAVITY=3, SPDMAXY=80, kd_def.h:41–42; kd_act1.c:74–97).
- **Air throws inherit half of Keen's velocity**: `new->xspeed += ob->xspeed/2; new->yspeed += ob->yspeed/2` (kd_keen.c:2126–2127, 2137–2138, 2148–2149) — so a running jump-throw arcs further.
- Throw directions available: standing (fwd, up), walking (fwd), air (fwd, up, down), pole (fwd, up, down) — dispatch in KeenThrow (kd_keen.c:2073–2154). No standing down-throw (duck+jump = drop-through-floor instead, kd_keen.c:1689–1719).
- Commitment: throw is a 3-state animation with release on a 1-tic middle state — windup ≈ 8–9 tics, recovery 10 tics (s_keenthrow1–4, kd_keen.c:1328–1335). You're locked ~19 tics (~0.27 s).

**On hit — the flowering** (`PowerContact`, kd_keen.c:648–682; `ChangeToFlower`, kd_act1.c:433–450):
- Flowerable classes: Brocco, Tomat, Carrot, (Celery — unused), Aspar, Tater, Frenchy, Squasher, Apel, PeaPod, PeaBrain (kd_keen.c:654–667). **Immune: Sour Grape, Melon Lips, Cantaloupe Cart** (no case — projectile does nothing to them). Boobus takes damage instead (see §2).
- Effect: enemy's class and state pointer are stashed (`temp1/temp2`), class becomes **inert** (`inertobj`), xspeed zeroed, y snapped so the 2-tile flower sprite sits on the old bottom, and a 4-frame "poof" cloud is spawned over it (kd_act1.c:436–449). The projectile is consumed (`RemoveObj`, kd_keen.c:666).
- **Flowered enemies CANNOT hurt Keen** — `inertobj` has no case in KeenContact (kd_keen.c:2195–2331), and they are not solid either (no clip). Pure harmless scenery that sways (6-state loop, 20 tics/frame, kd_act1.c:384–395).
- Flowers still obey gravity while flowered (`FlowerThink` calls ProjectileThink, kd_act1.c:461–463) — a flowered jumper falls to the floor.

**Duration — timed, difficulty-scaled, never permanent** (kd_act1.c:53, 461–474):
- `flowertime[4] = {700, 700, 350, 175}` tics indexed by difficulty (gd_Easy=1, gd_Normal=2, gd_Hard=3; id_us.h:50–53) → **Easy ≈ 10 s, Normal ≈ 5 s, Hard ≈ 2.5 s**. This is the ONLY thing difficulty changes in the whole game (only reads of `gamestate.difficulty`: kd_act1.c:464, set at kd_play.c:1839).
- The flower is `active = allways` (kd_act1.c:444) — **the timer keeps running even off-screen**; it never despawns.
- Un-flowering: a reverse poof plays and at its midpoint the enemy's original class+state are restored, y re-aligned to the ground, resuming EXACTLY the state it was in (ChangeFromFlower, kd_act1.c:485–500).

**Missed shots become pickups — recoverable ammo** (`PowerReact`, kd_keen.c:693–854):
- First wall hit (side): `xspeed = −xspeed/2` AND class flips to `bonusobj` (kd_keen.c:699–703) — from then on it can't flower anything, but touching it gives the flower back (+1, KeenContact bonus case 8, kd_keen.c:2228–2233).
- Floor hit: also flips to `bonusobj` (kd_keen.c:735) and bounces off a full 8×8 angle-reflection table (bounceangle, kd_keen.c:76–86; reflection cases kd_keen.c:771–834) until speed < 4096 gu, then it settles and **blinks for 50 tics before vanishing** (POWERCOUNT=50; s_powerblink, PowerCount, kd_keen.c:492–495, 597–605). Grab it during the blink to get it back.
- Ceiling hit: bounces down at half speed, stays potent (kd_keen.c:705–721).
- Pole-holes (wall type 17) let vertical throws pass through (kd_keen.c:707–714, 724–731).

**Ammo economy:**
- Start with 0 (NewGame, kd_demo.c:75). Pickup types: single flower (+1, type 8), 5-pack (+5, type 9, spawned one block up, kd_act1.c:550–551), Super Bonus (+8 flowers, +3 lives, +10,000 pts, type 7, kd_keen.c:2221–2227). HUD shows count, capped at "99" display (kd_keen.c:344–376).
- Throwing with 0 ammo: refusal sound, nothing happens (kd_keen.c:522–530).

---

## 2. BOOBUS TUBER — the boss fight, exactly

**Setup.** Level 15 "Boobus' Chamber" (levelnames, kd_play.c:93). Spawned from info-tile 61 (kd_play.c:546–549), positioned 11 half-blocks (5.5 tiles) above his anchor tile — a huge sprite (SpawnBoobus, kd_act2.c:1335–1345). **`temp4 = 12` hit points (kd_act2.c:1344).**

**The weapon switch.** On map 15 the throw button throws **Boobus Bombs** instead of flowers — same ballistics, same PowerContact/PowerReact pipeline, different states (`s_boobusbomb1/2`, kd_keen.c:474–477, 510–520, 565–574). The HUD scorebox swaps its flower icon for a bomb icon on map 15 only (FixScoreBox, kd_keen.c:145–166; ScoreThink kd_keen.c:344–347).

**Full state machine** (kd_act2.c:1252–1509):

| State | Sprite | Progress/tics | Think | React | Next |
|---|---|---|---|---|---|
| s_boobuswalk1–4 (kd_act2.c:1292–1299) | 4 walk frames | step, 10 tics, xmove 128 | BoobusThink | BoobusGroundReact | loop 1→2→3→4→1 |
| s_boobusjump (1301) | single jump sprite | think (every frame) | ProjectileThink (gravity) | BoobusAirReact | — |
| s_boobusdie (1304) | jump sprite | step 4 tics | FragThink | DrawReact | self-loop |
| s_boobusdie2 (1306) | none | step 4 tics | FragThink | none | self-loop (dead code in practice — see below) |
| s_boobusdie3 (1308) | none | step 250 tics | FinishThink | none | NULL (object removed) |
| s_deathboom1–6 (1311–1322) | 2 boom + 4 poof frames | step 20/20/40/30/30/30 tics | — | DrawReact3 | chain → NULL |

**Movement/attack logic — `BoobusThink` (kd_act2.c:1401–1443):**
- Always turns to face the player horizontally (left/right tests, 1406–1411).
- If vertically overlapping the player's band ("on same level") → he simply **keeps charging** (comment says "so charge!", no extra code — the walk itself is the charge, 1413–1417).
- If NOT on the player's level but horizontally lined up (`inline`):
  - Player below → **drops down through the floor**: y +8 px, tilebottom++, enter jump state with all speeds zeroed → free-falls (1423–1432).
  - Player above → **jumps up** with `yspeed = −60` (SPDBOOBUSJUMP, kd_act2.c:1264), xspeed 0 (1434–1439).
- Walk speed: 128 gu per 10-tic step = 12.8 gu/tic ≈ 0.8 px/tic ≈ 56 px/s (fast enough to chase but dodgeable).

**Ground reactions — `BoobusGroundReact` (kd_act2.c:1453–1488):**
- Hits a wall → turns around with a random 0–7-tic hesitation (`nothink = US_RndT()>>5`, 1455–1468) — same idiom as regular walkers.
- Reaches a ledge: if his feet are level with/below the player's → **runs off into a forward jump**: `yspeed = −60, xspeed = xdir × 24` (SPDBOOBUSRUNJUMP, kd_act2.c:1265, 1471–1478). If the player is lower → just drops (speeds zeroed, 1480–1483). Either way → s_boobusjump.

**Air reactions — `BoobusAirReact` (kd_act2.c:1500–1509):** ceiling stops rise (yspeed=0); landing returns to walk1. That's the whole loop: *walk-chase ↔ jump/drop to your floor*.

**Telegraphs (as they exist in data):** the single dedicated jump sprite is the only "pose" telegraph; the real telegraph is *positional* — he only jumps/drops when horizontally aligned with you on a different floor, and only leaps ledges while chasing. There is no windup timer before his jump (state change is immediate). His danger is 100 % contact: touching Boobus in ANY of his states kills Keen (boobusobj in the kill list, kd_keen.c:2325–2327).

**Getting hit — what counts, and what happens between hits** (`PowerContact` boobusobj case, kd_keen.c:668–680):
- One **bomb projectile contact** = 1 hit: `temp4−−`. The bomb detonates in place (6-frame explosion, s_bombexplode1–6, 5 tics each, kd_keen.c:479–490) with BOMBBOOMSND.
- **No hit-stun, no knockback, no i-frames, no vulnerable windows** — he keeps chasing at full speed through all 12 hits; you can land several bombs in quick succession if you have them. The fight's difficulty is purely ammo economy + dodging a relentless chaser.
- Hits only land while the bomb is still `powerobj` (in flight, before touching a wall/floor) — a bounced bomb is a pickup, not a weapon (PowerReact, kd_keen.c:699–703, 735, 836–845). On map 15 a settled bomb becomes a **permanent pickup** (never blinks out — s_bonus loops forever, kd_keen.c:838–845), so missed bombs are always recoverable. You cannot soft-lock the fight.

**Defeat sequence** (kd_keen.c:669–677; kd_act2.c:1356–1390):
1. 12th hit → `GivePoints(50000)` **twice** (= 100,000 pts; two calls because points are 16-bit unsigned), class flips to `inertobj` (he instantly becomes harmless — touch him freely), state → s_boobusdie, `temp1 = 0` (kd_keen.c:670–677).
2. s_boobusdie loops every 4 tics; each FragThink call plays BOMBBOOMSND and spawns one explosion cloud at a random offset around his body (`x/y = ob −128gu + 5×RndT()` → roughly a 5-tile splash zone) that plays boom→poof (kd_act2.c:1356–1374, 1311–1322). temp1 increments **twice per call** — a quirk that means the PREFRAGTHINK branch (odd values) never fires and s_boobusdie2 is unreachable; at temp1==60 (30th call ≈ 120 tics ≈ 1.7 s of continuous explosion shower) his sprite is removed and state → s_boobusdie3 (kd_act2.c:1356–1364, PREFRAGTHINK=POSTFRAGTHINK=60, kd_act2.c:1261–1262).
3. s_boobusdie3 waits 250 tics (~3.5 s of quiet, explosions fading) then FinishThink sets `playstate = victorious` + a "gone" jingle (kd_act2.c:1385–1390) → GameFinale text screens (kd_play.c:1654–1730).

**Arena interaction:** none coded — no bounce pads, no hazards object; the chamber is plain multi-floor geometry that his drop-through/jump-up verbs exploit. (The bouncy actor in this game is the Tomatooth enemy, not a pad.)

**The 12-bomb entry gate:** see §5.

---

## 3. Enemy vocabulary — one row each (deltas vs the Keen 4–6 set)

Contact rule reminder: an enemy only hurts Keen if its class/state appears in KeenContact (kd_keen.c:2195–2331). Several bodies are completely harmless — only their acts or projectiles are.

| Enemy | Movement idea | Threat mechanic | Delta / inspiration value (numbers) |
|---|---|---|---|
| **Broccolash** (kd_act1.c:582–718) | Fast patroller (128 gu/7 tics) | **Telegraphed ground-slam**: when Keen horizontally within ~½ tile of its front (trigger scan ±3 tiles, kd_act1.c:684–717) it stops and plays a 9-state smash; **deadly ONLY during smash frames 3–4** (3+7 tics; kd_keen.c:2291–2293). Windup frames 1–2 = 6 tics of pure telegraph. | A miniature boss-duel loop: telegraph → brief hitbox → long recovery (smash5–9 ≈ 30 tics harmless). Perfect "sending" for counter-window training. |
| **Tomatooth** (kd_act1.c:721–842) | Bouncing chaser: accelerates toward player, max xspeed 16; floor bounce `yspeed = −30 − rnd(0–15)` with a 10-tic sustained-thrust timer (SPDTOMATBOUNCE 30, TICTOMATJUMP 10, kd_act1.c:731–733, 837–838) | Contact kills (kd_keen.c:2316–2327) | Randomized bounce height = unpredictable rhythm chaser; bounce SFX only when on-screen (kd_act1.c:820–836). |
| **Carrot Courier** (kd_act1.c:845–956) | Very fast walker (128 gu/5 tics); at a ledge it **leaps the gap** (xspeed 32, yspeed −40, kd_act1.c:853–854, 925–933) instead of turning | **NEVER kills — it shoves.** Contact = pushes Keen sideways (ClipToSpriteSide) and can push him off poles (kd_keen.c:2276–2287) | A totally harmless *bumper/shover* enemy — pressure without damage. Gold for a no-kill game. |
| **Asparagusto** (kd_act1.c:960–1005) | Fastest simple patroller (100 gu/3 tics), turns at walls/edges | Contact kills | Speed-only threat; pure timing gate. |
| **Sour Grape** (kd_act1.c:1008–1129) | Ceiling lurker. Drops when player is underneath AND has clear line-of-sight (per-tile wall scan between them, kd_act1.c:1073–1088) | Deadly ONLY while falling (kd_keen.c:2312–2314). Floor bounce decays `yspeed = −(2/3)·yspeed` until slow, then sits 30 tics and **rises back up at 16 gu/tic to re-arm** (kd_act1.c:1119–1128, 1033–1036) | A patient, resetting ceiling trap with LOS check — flower-immune. "Watcher that pounces and returns" archetype. |
| **Tater Trooper** (kd_act2.c:38–166) | Patroller (128 gu/10 tics), tracks player within 1 tile ahead / turns if behind (kd_act2.c:111–146) | **Spear lunge**: sound + 12-tic windup pose (attack1) → **20-tic deadly lunge frame (attack2 — the ONLY state whose touch kills**, kd_keen.c:2272–2275) → 8-tic recover. Body is otherwise harmless — you can stand next to/walk through an idle Tater. | THE cleanest telegraph→dodge→safe-window pattern in the game (12-tic tell, 20-tic threat, then safe). Direct Punch-Out DNA for our duels. |
| **Cantaloupe Cart** (kd_act2.c:169–244) | Rolling cart (32 gu/5 tics), reverses at walls AND ledges (checks floor tile ahead, kd_act2.c:234–241); `active = allways` — runs even off-screen | Can't kill by touch; Keen rides it / is pushed by it (ClipToSprite squish, kd_keen.c:2288–2290) — **only kills by squishing Keen against a wall** (kd_play.c:1234–1247) | A *moving platform that is also a crusher* — flower-immune, indestructible. "Blocker that becomes a ride." |
| **Frenchy** (kd_act2.c:248–441) | Keep-away AI in distance bands (kd_act2.c:392–441): >8 tiles walk closer; 4–8 tiles **throw a french fry** (xspeed ±40−rnd(0–15), yspeed −20, kd_act2.c:359–381); <4 tiles **run away** (5-tic run states, nothink 8) | Body harmless (no KeenContact case); fry = shotobj, kills (kd_keen.c:2326) | A coward-thrower who maintains spacing — great "ranged sending" with a chase-to-corner counterplay. Fries ricochet off floors via the 16-angle bounce table (ProjectileReact, kd_act2.c:583–701). |
| **Melon Lips** (kd_act2.c:445–573) | Stationary wall/ceiling fixture, 3 mount directions (left/right/down, spawn dir arg, kd_act2.c:510–528); spits on a ~200-tic cycle with randomized phase (`ticcount = RndT()>>1`, kd_act2.c:526) | Body harmless; **melon seed** projectile (xspeed ±48+rnd, yspeed −20; straight down variant +20, kd_act2.c:539–573) kills | Flower-immune turret with per-instance desynced timers. |
| **Squasher** (kd_act2.c:703–827) | Patroller that **leap-attacks**: within 6 tiles and ±3 tiles vertical, jumps `yspeed = −50, xspeed = delta/60` (leads the target!, kd_act2.c:770–808) | Deadly ONLY in the second jump state (s_squasherjump2 — after 20 tics airborne; kd_keen.c:2295–2310); first 20 tics + the 10-tic landing "wait" state are harmless (it just shoves) | Homing jump with a *safe early phase* and a *recovery pause* — another duel-rhythm enemy. |
| **Apel** (kd_act2.c:830–1039) | Walker that **climbs/slides poles** to reach Keen's floor (detects pole under/over it, kd_act2.c:921–961; climb −16 gu/6 tics, slide +16) | Contact kills | Vertical-pursuit via level furniture (uses the same poles Keen climbs) — a "chaser that uses your own paths". |
| **Pea Pod** (kd_act2.c:1126–1248) | Patroller; when facing you within 3 tiles vertical, randomly (RndT<8 per think) stops and **spits a live Pea Brain** (xspeed ±48−rnd, yspeed −20), max 4 total per pod (MAXPEASPIT, kd_act2.c:1135, 1198–1248) | Pod body harmless; the spit/landed Pea Brains kill | An **enemy-spawner with a hard budget** (4). Spawned minions persist as walkers. |
| **Pea Brain** (kd_act2.c:1043–1122) | Dumb walker (think is a no-op; pure wall/edge turning) | Contact kills | The minimal minion. |
| **Boobus Tuber** | see §2 | contact kills; 12 bomb hits | the boss. |

Unused classes (declared, kill-listed, but no spawner — cut content): celery, turnip, cauliflower, brussels sprout, mushroom (kd_def.h:70–72; kd_keen.c:2317–2323).

**Door** (not an enemy): sprite-based locked gate; touching it with ≥1 key consumes a key and it slides up 32 gu/tic for 24 tics then vanishes; with 0 keys it plays a refusal sound and blocks like a wall (kd_act1.c:300–342; kd_keen.c:2256–2271).

---

## 4. Level/map format + entry/exit vs Keen 4–6

- **Same 3-plane tile map** (background, foreground, info) with tile-info property arrays (NORTHWALL/EASTWALL/… + INTILE), loaded via CA_CacheMap → RF_NewMap → ScanInfoPlane (kd_play.c:702–777). Info-plane spawn codes: 1/2 = Keen facing R/L, 19 = world-map Keen, 21–32 = bonus items (type = tile−21), 33 = door, 41–61 = enemies (HandleInfo, kd_play.c:445–554).
- **Level exit = walk off the horizontal edge of the map.** No exit door/sign object: if `player->left < originxmin` or `player->right > originxmax + 20 tiles` → `playstate = levelcomplete` (ScrollScreen, kd_play.c:799–804). Falling off the bottom = death instead (kd_play.c:809–815).
- **World map (map 0) is itself a "level"**: free 8-direction walking (s_worldwalk, 16 gu/tic each axis, kd_keen.c:915–916, 1036–1056), with an idle-animation ladder (wave → wait → sleep, kd_keen.c:893–913). Standing on an info tile 3–18 and pressing either button enters `level = tile − 2` (CheckEnterLevel, kd_keen.c:961–997).
- **The done-state patch ("boarded over")**: every time the world map loads, `PatchWorldMap` sweeps it: for each entry tile of a finished level (`leveldone[]` flags, gametype kd_def.h:92–103) it (a) deletes the info tile so the level can't be re-entered, (b) clears blocking foreground tile 130 → **the path physically opens**, and (c) replaces marker foreground 90 with tiles 131/132/133 — the comment calls it "plant done flag" — a visible 3-tile done-graphic stamped onto the map (kd_play.c:636–662, called only for map 0 at kd_play.c:722–723). Finished levels are simultaneously *visibly stamped* and *permanently sealed*. This is exactly our "flag on completed chapter" pattern, plus gating: sealed level entrances can double as progress gates.
- **Level completion flow**: `GameLoop` marks `leveldone[mapon] = true` on levelcomplete and returns you to map 0 (kd_play.c:1899–1905). Death: keys zeroed, this-level bombs revoked, life lost, then a **"Try Again / Exit to Tuberia" choice menu** (HandleDeath, kd_play.c:1742–1820) — instant retry of the same level is a first-class option.
- No save-crystals/exit signs/secret levels machinery from Keen 4–6; 17 maps total (GAMELEVELS 17, kd_def.h:56), map 20 = title screen (kd_play.c:725).

---

## 5. Scoring/economy deltas + the bomb→boss gate

**Bonus table** (SpawnBonus types 0–11, kd_act1.c:537–563; award switch kd_keen.c:2193–2253):

| Type | Item | Effect |
|---|---|---|
| 0–5 | Peppermint/Cookie/Candy cane/Candy bar/Lollipop/Cotton candy | 100 / 200 / 500 / 1000 / 2000 / 5000 pts |
| 6 | Extra Keen | +1 life |
| 7 | Super Bonus | +3 lives, +8 flower powers, +10,000 pts (4-frame animation, kd_act1.c:557–560) |
| 8 | Flower Power | +1 ammo |
| 9 | Flower Power 5-up | +5 ammo (spawns one block raised, kd_act1.c:550–551) |
| 10 | **Boobus Bomb** | `boobusbombs++` AND `bombsthislevel++` (kd_keen.c:2240–2246) |
| 11 | Magic Key | `keys++` (opens doors) |

- Extra lives at score 20k then doubling — 20k/40k/80k/160k/320k (`nextextra *= 2`, GivePoints, kd_play.c:850–859). New game: 3 lives, 0 flowers, 0 bombs (kd_demo.c:69–78). Touched items fly upward as a score-rise ghost (s_bonusrise, kd_act1.c:524–525).
- High-score table records score **plus number of cities completed** (kd_play.c:1920–1925).

**The bomb→boss gate — verified exactly:**
1. Bombs are scattered across normal levels as bonus type 10 (info tile 31 also sets `bombspresent`, which pops a **"Boobus Bombs Near!"** banner while the level loads — kd_play.c:460–461, 735–741). A collectible radar/announcement, not a counter.
2. **Entry gate:** the world-map tile for level 15 (tile 17) refuses entry with fewer than 12 bombs, showing "You can't possibly defeat King Boobus Tuber with less than 12 bombs!" (CheckEnterLevel, kd_keen.c:974–989). 12 = exactly the boss's hit points.
3. **Death escrow:** `bombsthislevel` resets to 0 at level start (kd_play.c:1870); dying subtracts it from the global count (`boobusbombs -= bombsthislevel`, kd_play.c:1747) — bombs only *bank* when you exit a level alive. Elegant side effect: on map 15 each throw *decrements* both counters (kd_keen.c:518–519), so `bombsthislevel` goes negative and **dying to the boss refunds every bomb you threw** — a retry never leaves you under the 12-bomb floor.
4. In the boss room the HUD's ammo icon switches from flower to bomb and shows `boobusbombs` (kd_keen.c:145–166, 344–347).
5. Keys are per-life (zeroed on death, kd_play.c:1746); bombs are the only cross-level collectible currency.

This is a complete "collect N tokens across chapters → unlock + fight the finale with those tokens as ammo" loop, with loss-protection so the gate can never become un-passable.

---

## 6. Ten stealable ideas, ranked for our game

1. **Timed stun with a visible countdown organism** (flower sways, then poofs back, 700/350/175 tics by difficulty; enemy resumes its *exact* saved state) → our stunned "sendings" become knotted/bookmarked for a difficulty-scaled timer, then resume mid-behavior — stun is a resource decision, not a kill substitute.
2. **Collect-N-to-unlock-the-finale with escrow** (12 bombs = gate AND boss HP; unbanked tokens lost on death, boss-room throws refunded on death) → chapter word-gems: gate the boss duel at N, make N also the number of counter-windows, refund on duel defeat so retries never soft-lock.
3. **Tater Trooper's three-beat spear lunge** (12-tic windup + sound, 20-tic deadly frame, 8-tic recover; body otherwise harmless) → the exact telegraph→dodge→punish grammar for mid-level mini-duels; port the tic ratios (≈0.17 s tell / 0.29 s threat / safe recover) as a starting rhythm.
4. **Missed shots become pickups** (thrown flower → bonusobj on wall/floor, 50-tic blink; bombs persist forever) → thrown "word-orbs" that miss stick in the world briefly and can be re-collected — forgiving ammo for kids, with the boss version never expiring.
5. **Harmless shover enemies** (Carrot Courier pushes, never harms; Cart rides/pushes and only "squishes" at walls) → pressure enemies that displace the player (off ladders, off platforms) with zero damage — difficulty without violence, ideal for our no-kill bible.
6. **Boarded-over/flag-stamped world map** (done levels: info tile deleted, blocking tile cleared, 3-tile done-flag planted) → chapter nodes get a visible "solved" stamp AND physically open the path onward; completed = sealed (no accidental re-entry, replay via a deliberate UI instead).
7. **Boss verbs = drop-through-floor + aligned jump-up** (Boobus zeroes speeds and falls through his floor when you're below; jumps −60 when you're above; ledge-leap at xdir×24) → a multi-floor duel arena where the boss changes floors only when column-aligned with you — readable positioning telegraphs ("get out of his column") that need no animation windup.
8. **Enemy-spawner with a hard budget** (Pea Pod spits max 4 Pea Brains, random trigger, spat minions persist) → a "sending" that releases up to N smaller sendings — each spit is a mini language-task opportunity, and the budget guarantees bounded chaos.
9. **Keep-away thrower with distance bands** (Frenchy: >8 tiles approach, 4–8 throw, <4 flee) → a ranged sending you must *corner* — turns a shooting-gallery threat into a chase puzzle; the counter-window opens when it's trapped.
10. **Line-of-sight drop trap that re-arms** (Sour Grape: LOS wall-scan before dropping, decaying bounce, 30-tic sit, rises back to ceiling) → ceiling lurkers that only pounce when they can "see" you and slowly reel back up — teaches scouting + patience, fully non-lethal if we make the pounce a shove.

Bonus observations worth keeping in the file: difficulty in Keen Dreams changes ONLY the stun duration — a beautifully minimal difficulty dial for us; and air-throws inheriting half the player's velocity (idea #4's cousin) makes throwing-while-moving feel physical for nearly free.
