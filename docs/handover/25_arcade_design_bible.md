# 25 · The Arcade Design Bible — Tintenlauf and the arcade layer, designed from the ground truth

> **2026-07-19 — PARTLY SUPERSEDED by doc 31 (THE PAINTED BOOK pivot):** the doctrine here
> (study boundary, nothing-dies, difficulty-by-population) stays reference; the Keen verb set,
> creature vocabulary, and goal grammar retire with the Keen shape. Doc 31 governs.

**Status: DOCUMENT (this file) — the K-2 gate artifact. Koki reads this before any K-3 code is written; his verdict shapes the rebuild.**

*Fable-authored 2026-07-14, synthesized from a complete source study: all ~44k lines of the
Commander Keen 4–6 reconstruction (the player and physics files read personally, line by line;
the rest via nine exhaustive deep-read reports in `docs/study/keen/`), the Omnispeak portable
reimplementation (architecture only), pokefirered's overworld model, and a modality corpus
(Super Mario Bros, Contra, Punch-Out!!, VVVVVV, Celeste). This replaces KA-1's skim-informed
design with a studied one.*

---

## 0 · Provenance and the study boundary (binding)

Everything in this document is **behavioral knowledge — numbers, state graphs, design intent —
re-expressed from scratch**. Zero code is copied from any reference: the keen4-6 reconstruction
and the console disassemblies (Contra, Punch-Out, SMB) are legally uncopyable; Omnispeak is
GPLv2 (incompatible with our license); pokefirered is a Nintendo decompilation. We cite them
the way a physicist cites a measurement ("Keen's jump impulse is −40 units/tic for up to 18
tics") and then write our own TypeScript. This boundary statement rides every artifact and PR
in this arc.

Where a number below says "Keen:", it is a verified fact from the source (spot-checked against
the files themselves, not just the reports). Where it says "ours:", it is our re-derivation for
48px tiles at 60fps, with deviations documented and justified.

---

## 1 · The honest diagnosis — what KA-1 got wrong and what this fixes

KA-1 mined Keen through one summary pass and sprinkled its constants over a generic platformer.
The verdict ("a Mario clone") was correct, and the study explains *why* it read that way:

1. **Wrong jump model.** KA-1 used the modern impulse-cut (release = clamp velocity). Keen uses
   a **thrust-fuel model**: the jump button feeds upward speed for up to 18 tics and release
   cuts the fuel, not the speed. The arcs feel completely different (Keen's is flat-topped and
   "held"; Mario's is parabolic). §2 specifies the fuel model.
2. **No pogo.** The pogo is Keen's identity verb — a *toggled, self-perpetuating state* with its
   own gravity trick — and KA-1 didn't have it at all. §2.4.
3. **No ledge grab, no look-up/down, no drop-through as a camera-and-verb system.** These three
   verbs are what make Keen levels vertical and legible. §2.5–2.7.
4. **Enemies were a difficulty knob, not a vocabulary.** KA-1's walker/hopper/flyer were three
   speeds of the same idea. Keen 4 alone ships ~27 actors of which a third are *harmless* —
   thieves, rideables, set-dressing, bait. §3 builds the vocabulary.
5. **No goal grammar.** KA-1's exit gate counted popped enemies. Keen levels are built around
   gem-gated exits, secrets, and (in our design) the artifact story goal. §4.
6. **The tasks interrupted the arcade instead of being its economy.** §5 designs where language
   actually lives — including the death loop, which Koki specified: *losing lives is expected;
   you're just gonna solve tasks.*

---

## 2 · Movement spec — the Keen feel, exactly, then our deviations

### 2.0 Units and the tick

Keen runs at 70Hz with fixed integer tics (clamped 2–5 per frame) and fixed-point positions
(256 units = 1 tile = 16px, so 16 units = 1px). Speeds convert as **px/s = units-per-tic ×
4.375**. All movement is `speed × tics` — never wall-clock delta. Omnispeak (the modern port)
keeps exactly this and it is why Keen physics survives on a 144Hz monitor.

**Ours:** a fixed-step accumulator at **60Hz** inside Phaser's update (Phaser renders whenever
it wants; the simulation steps in whole ticks, max 4 per frame — the anti-tunneling clamp Keen
gets from MAXTICS=5 + its one-tile-per-frame move cap). Positions stay float (Phaser-native) but
every speed is defined in tiles/second and derived from Keen's ratios below. The pure module
(`arcade.ts`) owns every constant; the scene consumes them.

### 2.1 Ground: digital. Air: analog. (The signature split — KA-1 had this right)

- **Keen:** ground walk is 24 units/tic ≈ 6.6 tiles/s, applied as slide movement with **no
  acceleration and no skid** — full speed the frame you press, stop the frame you release. The
  one softening touch: the *first* step out of standing applies ¼ of the movement (a subtle
  wind-up that reads as animation, not physics).
- **Keen air:** analog — held direction accelerates ±2 units per odd tic toward a cap of 24;
  no input bleeds speed via friction (1/odd-tic). So you steer jumps fully but the ground never
  slides. Contrast SMB, where ground itself is momentum (accelerate to 1.5/2.5 px per frame,
  10-frame run latch, skid states, and running raises your jump). That contrast IS the
  Keen-vs-Mario distinction. We are Keen: **place yourself, don't manage momentum** — the right
  choice for 9-year-olds who must also read German/English on screen.
- **Ours:** runSpeed 6 tiles/s digital ground with the ¼-first-step; airAccel reaching cap in
  ~0.35s; air friction ~half of airAccel.

### 2.2 Jump: the thrust-fuel model (CHANGED from KA-1)

- **Keen:** jump sets `yspeed = −40` (≈175 px/s up) and `jumptime = 18` tics of thrust. Each tic
  of held button applies the speed; **releasing sets the remaining fuel to zero** — the arc
  stops rising almost immediately but keeps its current speed into gravity. Gravity is +4 per
  odd tic (effectively ~2/tic), terminal 70 (≈306 px/s), with a softened apex (tiny residual
  upward speeds get zeroed in one step). Easy difficulty uses weak gravity (+3) — *gravity
  itself is a difficulty dial.*
- **Ours:** jumpFuelMs ≈ 260ms of sustained −760 px/s thrust; release zeroes the remaining fuel;
  gravity tuned so a full-fuel jump clears ~3.2 tiles and a tap clears ~1.2. Easy mode may
  lower gravity by ~12% (the Keen dial, better than changing the level).

### 2.3 Running jump

- **Keen:** jumping from a walk carries xspeed 16 (≈70 px/s) — less than walk speed, so jumps
  launch slightly *slower* than you run and the air accel makes up the rest. This tiny detail
  makes air control feel generous instead of slippery.
- **Ours:** carry 60% of runSpeed on takeoff; air accel closes the gap.

### 2.4 The pogo — first-class verb, new in the rebuild

The pogo is a **toggle**: press once to mount, press again mid-air to dismount. While mounted:

- **Keen:** every landing auto-rebounces at `yspeed = −48, jumptime = 24` (a taller-than-jump
  bounce, forever, hands-free). Steering is **half-authority** (accel ±1 vs the air's ±2) and
  momentum coasts when no direction is held. The magic trick: **holding jump during a bounce
  swaps gravity for tiny-gravity (+1 instead of +4)** — the "impossible pogo" that nearly
  doubles bounce height. Skill expression through *sustained input changing a constant*, not
  through timing a press.
- **Ours:** identical structure — auto-rebounce, toggle dismount, half-authority steering,
  hold-jump = 40% gravity while ascending on a pogo bounce. The pogo is how kids will cross the
  tall rooms, and its floatiness buys reading time in the air (a hidden pedagogical affordance:
  the highest-mobility state is also the calmest).
- German name in-game: **der Federstab** (the spring staff — Tinte-flavored art slot later).

### 2.5 Ledge grab + pull-up

- **Keen:** while *falling* and *holding toward* a wall, if the tile at hand height is clear and
  the tile below it is solid, Keen snaps into a hang exactly when his hitbox top crosses the
  grab line. From the hang: up/toward = a fixed 4-step scripted pull-up; down/away = drop.
- **Ours:** same trigger triple (falling + held-toward + clear-above-solid-below), same
  scripted pull-up. This single verb removes the "missed the platform by 2px" frustration class
  entirely — it *is* corner forgiveness, expressed diegetically.

### 2.6 Look up / look down + the Keen camera

- **Keen:** idle + up tilts the camera up (to ~167px of the 200px view); idle + down tilts down
  (to ~33px). The camera's grounded resting line keeps Keen's feet ~140px down the view — you
  see MORE above than below (Keen levels go up). Horizontal dead-band: the camera only scrolls
  when Keen crosses tiles 9–12 of the 21-tile view. Vertical follow engages **only when
  grounded** (or on a pole/hang) — mid-jump the camera holds, so jumps don't slosh the screen.
  Scroll speed is clamped ≤1 tile/frame and camera stops snap to tile boundaries.
- **Ours:** all of it — dead-band ~3 tiles, grounded-gated vertical follow, look up/down as held
  verbs (they double as "scout before you commit", which our level grammar §4 exploits), and
  scroll-block lines for arena locks (the boss-room camera lock is one data line, not code).
- **Drop-through:** look down + jump on a one-way platform drops through (Keen checks the tile
  isn't backed by a wall). Kept from KA-1, now correctly gated through the look-down state.

### 2.7 One-hit vs hearts, and death as physics

- **Keen:** one-hit death — the corpse pops up-and-right under weak gravity and the life is only
  deducted when it leaves the screen. Death is a *watched physics event*, not a cut.
- **Ours (kid deviation, kept from KA-1):** 3 hearts. But the **death animation doctrine
  transfers**: losing a heart is a visible knock-back + invulnerability blink (~0.5s); losing
  the last heart plays the full Keen-style pop-off-screen before the Rettungsaufgabe (§5.3).
  Nothing is instant; the kid always sees cause.
- **Modern forgiveness (documented deviations, from the Celeste inventory):** coyote time 90ms,
  input buffer 130ms, corner correction ≤6px, floaty apex. These four are *invisible* — they
  only ever help. We deliberately do NOT take Celeste's expressive tech (dash, wall-jump,
  climb-stamina): more movement depth would compete with the language for attention. VVVVVV's
  lesson bounds the whole spec: the fewer the verbs, the more each one reads.

### 2.8 The verb list (complete)

run · jump (fuel) · pogo (toggle) · ledge-grab/pull-up · look up · look down · drop-through ·
enter door (up) · use switch (up). Poles/climbing: deferred to the school-world integration
(W-2) where ladders/Kletterstangen belong naturally. No shooting — our "stun" is the quickfire
freeze (§5.2); the EFL game's projectile is the word.

---

## 3 · The enemy vocabulary — threats are a language, not a difficulty knob

The single deepest lesson from the actor corpus (46 actors across three episodes): **id built
enemies as a vocabulary of readable verbs, and a third of them don't hurt you.** Every enemy is
one *idea* — a verb + a tell + a counter. Difficulty never changes an enemy's nature; it changes
the population (§6). And in Keen 5/6, *nothing dies* — defeated enemies are stunned with dizzy
stars, which is exactly the register a children's school game needs.

Our cast — all Schluckwort-family ink creatures (die Tintenwesen), all defeats non-violent
(freeze → word-pop → the creature dissolves into the letters it swallowed):

| # | Name (working) | Archetype (source) | Verb | Tell | Counter | Task? |
|---|---|---|---|---|---|---|
| 1 | **Tintenläufer** | Slug/Bloog patrol (R_Walk) | walks, turns at walls AND ledges | plodding gait | jump over, or contact→quickfire | yes |
| 2 | **Randläufer** | R_WalkNormal | as 1 but refuses hazard tiles — patrols *safe* floor, herding the player toward hazards | keeps to clean ground | as 1 | yes |
| 3 | **Hüpfer** | Lick | hops toward you; short-range directional lunge on arrival | crouch before lunge | its *body* is safe from behind — flank it | yes |
| 4 | **Lauerer** | Mimrock | disguised as a prop; sneaks ONLY while you walk toward it; freezes when you face away; pounces at 4 tiles | subtle wobble when it moves | look at it (it can't move); or bait the pounce | yes |
| 5 | **Flatterklecks** | Skypest | erratic drift flyer; rests on ceilings | rest = wings fold | unpoppable in flight; **pogo-bounce reaches its ceiling rest** | yes (at rest) |
| 6 | **Schattenwolke** | Thundercloud | sleeps; wakes on contact; drifts to your column; drops a vertical ink bolt | flash + alignment pause | never stand under it; it can't be popped | no — pure area denial |
| 7 | **Stampfer** | Mad Mushroom | perpetual hopper toward you, every 3rd bounce higher | count the rhythm | unpoppable — pure avoidance | no |
| 8 | **Wortdieb** | Treasure Eater | **harmless** — races you to letter pickups, teleports between hoards | greedy dash toward letters | freeze it with a quickfire to protect your letters | yes — protects loot, not life |
| 9 | **Sprungkissen** | Bounder | **harmless rideable** — a bouncing ink cushion; steers toward your side while ridden; bounces straight up twice after dismount so you can re-board | — | ride it to height | no |
| 10 | **Klecklein** | Blooglet | harmless swarm critter; some carry a letter — freezing one **drops the letter** | color variant | pop for reward, not defense | yes — rewarded shooting |
| 11 | **Panzerklecks** | Shikadi (4hp) | multi-hit chaser: needs 2–3 quickfires to freeze, **flashes white per correct answer** | flash feedback | persistence — the SRS "hard word" made flesh | yes ×N |
| 12 | **Spiegelklecks** | Flect | front-shielded: quickfires bounce off its face; must be engaged from behind | mirror face always tracks you | flank via ledge/pogo | yes (from behind) |
| 13 | **Deckenzunge** | Ceilick | hides in the ceiling as scenery; tongue-lashes straight down when you pass; laughs (exposed) after | ceiling tile looks *slightly* off | vulnerable only during the laugh | yes (in window) |

Rules the table encodes:
- **Directional safety** (3, 12, 13): bodies safe from the right side — teaches positioning.
- **Reading beats reflex** (4, 6, 7): the three unpoppables are all *rhythm/tell* creatures.
- **Rewarded engagement** (8, 10): some tasks protect loot or grant it — task ≠ punishment.
- **Multi-hit + flash** (11): visible progress per correct answer; this is where the SRS queue
  surfaces its due-review words (a "hard" word literally takes more hits).
- Wave 1 (K-3 rebuild) ships 1, 3, 5, 8, 9 + one of 6/7. Wave 2 adds 4, 10, 11. Wave 3: 12, 13.

---

## 4 · Level grammar

### 4.1 The data model (pokefirered's two-file lesson + our rows-and-legend idiom)

A level splits into **layout** (the glyph grid — geometry only) and **header** (metadata +
events: spawns, doors, triggers, artifact placement, difficulty tiers). Our authoring format
extends the W-1 rows+legend idiom; VS-19 (the arcade sibling of VS-18) enforces the laws below
in the content pipeline. Enemy placements carry a tier: `all | plus | hard` — one map, three
populations (§6).

### 4.2 The laws (validator-enforced)

1. Rectangular grid; every glyph resolves; exactly one start, one artifact pedestal, one exit.
2. **Reachability with the real physics**: a BFS over the movement envelope (jump 3.2 tiles,
   pogo 5+, ledge-grab +1) must reach every letter, the artifact, and the exit — on the EASY
   population (helper platforms count; see inverse scaffolding §6).
3. **Fairness geometry**: ≤3-tile flat gaps without pogo; no blind drops onto hazards
   (look-down must be able to see every landing); every hazard pit has a recovery route
   (no unwinnable states — the KA-1 spike-pit lesson, now law).
4. **The secret quota**: every level has ≥1 secret alcove holding letters or a Klecklein
   cluster, reachable by a *readable* risk (a pogo line, a drop-through, a ledge chain) —
   Keen's risk-reward baiting, kid-dosed.
5. Verticality quota: the main path must change elevation ≥4 times per screen-width. (Keen
   levels are towers and bowls; Mario levels are corridors. This is the visible difference.)

### 4.3 The goal grammar: the artifact (Koki's directive, structural)

Each arcade level's goal is **recovering one torn page fragment** of the story the Blank
shredded. The grammar:

- The fragment sits on a pedestal behind the level's deepest challenge, **gem-socket style**:
  the pedestal needs 2–4 **Tintensiegel** (ink seals) slotted, Keen's gem-and-socket re-themed.
  Seals are earned, not found: each guarded by a mini-arena or a themed enemy (freeze the
  Panzerklecks → it releases the seal).
- Collecting the fragment **is** the level exit trigger (Keen's scuba pickup ends its level —
  same shape). The fragment then *visibly assembles* into the page on the world-map story panel
  (Keen's hub flags: completion physically changes the map — a flag plants, a wall clears; our
  version: the torn page fills in, one fragment per level, and the finished page IS a story
  beat read in BattleStage register).
- Letters (the ambient pickup) remain the drops economy: **100 letters = +1 heart refill or a
  Lernkarte** (§5.5). Points ladder on enemies: 100/200/500/1000/2000 with combo escalation
  (Keen's bonus ladder), and the score's *next reward threshold is always visible on the HUD*
  (Keen shows "EXTRA at 20,000" — motivation on the glass, doubling thresholds).

### 4.4 Dynamic tiles

One primitive covers doors, bridges, seals and story mutations: `putTiles(x, y, block)` —
rewrite a tile rectangle, re-derive collision, re-register animation (Keen's RF_MemToMap, the
mechanism behind every switch and bridge in the trilogy). Slotting a seal repaints the pedestal;
the exit gate physically opens; a story trigger can reshape a corridor between visits
(pokefirered's ON_LOAD reconcile hook: the map stores the default, story state applies deltas).

---

## 5 · The task economy — where the language lives (the EFL/CLT core)

Design premise (Koki's): **the game makes you lose lives by design — and losing lives means
solving tasks.** Failure recycles into meaning-focused practice; it never just repeats pain.
Communicative Language Teaching (CLT) grounding per register is noted inline.

### 5.1 The four registers

| Register | Trigger | Cognitive mode | Duration | Difficulty (CEFR-ish) |
|---|---|---|---|---|
| **Quickfire** | enemy contact | recognition under light pressure | 3–6s | at or below level (fluency, automatization) |
| **Rettungsaufgabe** | losing the last heart | calm recall + production | 30–90s | at level (i+1 lives here) |
| **Siegel-Aufgabe** | seal guardians | applied recognition, 2-step | 10–20s | at level |
| **Boss duel** | level climax (K-4) | production + pattern reading | 2–4 min | stretch (scaffolded) |

### 5.2 Quickfire (kept from KA-1, tuned)

Contact freezes the world (a held breath, not a scene change): one word, three chips, one tap.
Prompts from the SHORT pools only (translations/definitions — carrier sentences are unreadable
mid-jump), decoys language-consistent, everything seeded. Correct → the creature pops into its
swallowed letters + combo points. Wrong → the creature escapes AND takes a letter (loss framed
as theft, not as the child's failure), no heart loss from the task itself. **Words return
win-or-lose** (battle doctrine, the KA-1 unwinnable-gate lesson). One grading brain: chips
grade through @domigo/engine, attempts post through the normal API.
*CLT: recognition-level retrieval practice under mild time pressure = fluency building; the
affective filter stays low because the stake is points, not survival.*

### 5.3 The Rettungsaufgabe (the death loop — new, structural)

Losing the last heart does NOT restart the level. The screen dips into the BattleStage register
(calm, full-screen, familiar from the story mode) and the level's Tintengeist offers the
rescue: **solve 2–3 fuller tasks to re-enter** — carrier-sentence cloze, dropdown grammar, a
short definition match, drawn from the level's unit at full difficulty. Solve them → respawn at
the last checkpoint with 2 hearts; the practice WAS the price, there is no other penalty.
Fail them → one more, easier round (scaffolded down); the loop always exits upward.
*CLT: this is the task cycle's post-task focus-on-form, placed exactly where motivation to
re-enter is highest. Krashen's i+1 belongs here, not in the quickfire. Deaths are expected by
design (§6), so this register is the game's real workhorse — the arcade is the spaced-repetition
delivery vehicle, and the Rettungsaufgabe is its deep-practice chamber.*

### 5.4 Boss duels (K-4 — the second modality)

Punch-Out's teaching machine, re-keyed to language production. A giant Schluckwort fills the
facing-the-enemy screen (Contra's base-screen framing). Its attacks are **scripted patterns
with legible telegraphs** (a color tell ~0.5s before each attack — Punch-Out's outline flash).
Dodge = read the tell. Each dodged attack opens a **counter window** where a production task
fires: assemble the sentence, type the word (Punch-Out's star = our correct production).
- **Hearts as attempt-stamina** (Punch-Out's genius): answering *outside* a window, or
  guess-mashing, spends stamina — the design punishes guessing, never not-knowing.
- **Windows shrink with mastery**: the same boss re-fought later (SRS re-serve) uses the same
  script with tighter timers — Punch-Out's difficulty curve IS a spaced-repetition curve.
- Beating the boss yields the level's page fragment: the duel is the artifact climax.

### 5.5 The meta-economy (Keen's, re-keyed)

- Points → visible next-threshold ("Bonus bei 5.000") → thresholds double (20k→40k→80k).
- Letters (drops): 100 → heart refill or Lernkarte (a collectible story-lore card — the
  Blank's world-building drip-fed as collection rewards).
- **Assignments/checkups remain 0 XP and outside the arcade entirely** (standing law).
- Every attempt (quickfire, rescue, duel) posts through the attempts API — the SRS queue feeds
  which words surface in which register: due words → quickfire; struggling words → the
  Rettungsaufgabe picks them deliberately; mastered words → boss-duel windows tighten.

---

## 6 · Difficulty doctrine — Keen's dial, verified

The most verified finding of the whole study: **id never scales speed or damage. Difficulty is
population and placement.** Every enemy has up to three placements in the same map (base /
Normal+ / Hard-only), and the *helper platforms invert* — Easy maps get MORE scaffolding
(static platforms that spawn only below Normal). Resource spawns self-tune (extra ammo appears
only if you're low; our version: letter caches appear when hearts are low).

Ours, per level:
- **Tier E** (default, new unit): base enemies only, all helper platforms, gravity −12%,
  quickfire timer 6s.
- **Tier M** (unit in review): +plus-tier enemies, some helpers gone, 5s.
- **Tier S** (unit mastered / replay): +hard-tier, minimal helpers, 4s, boss windows tightened.
The tier is chosen by the SRS mastery of the level's unit — **difficulty follows the learning
curve automatically**, and deaths on M/S are *planned* (they route into the Rettungsaufgabe).
Across levels, the ramp adds one new enemy verb per level (never two), hazard density +~15%,
and one secret depth step — Keen 4's own progression, measured.

Checkpoints: every ~1.5 screens and always before the seal arenas and pedestal (age-band
policy: G1/G2 dense, G4 sparser). Restart-from-checkpoint, never restart-level (the Keen 1991
policy softened for 2026 nine-year-olds — a deliberate, documented deviation).

---

## 7 · The modality catalog (one engine, one config switch)

Contra's lesson: its dramatic side-scroll ↔ behind-the-back alternation is **one header byte** —
same verbs, same engine, different camera semantics, bridged by a walk-in transition. Our
`ArcadeLevel` header gets a `modality` field:

| # | Modality | Source doctrine | Ships |
|---|---|---|---|
| ① | **Side-scroller** (Tintenlauf) | Keen grammar (this doc) | K-3 rebuild |
| ② | **Facing-screen boss duel** | Punch-Out script machine | K-4 |
| ③ | **Corridor burst** | Contra base screens: lateral movement, into-the-screen framing, goal = a word-wall of destroyable targets (the sentence's words as Contra's wall sensors) | W-2 era |
| ④ | **World hub** | already LIVE — the W-1 overworld; arcade levels enter from zones as story set-pieces; completion mutates the map (fragment assembles, flag plants) | integration in W-2 |

Between-modality seams always get ceremony (Contra's walk-into-the-screen; our ink-swirl,
already built for battles).

---

## 8 · Engine doctrine (from Omnispeak — the architecture we imitate, not copy)

1. **Actors as data.** Every creature is a table row: `{sprite, type, timerTics, velX, velY,
   think, contact, react, next}` — a typed TS discriminated union; behaviors are free functions
   over a flat object record; adding an enemy = a few functions + rows, no engine changes.
   (Keen's statetype; Omnispeak externalized it to text files — we author in TS consts, typed.)
2. **Fixed-step accumulator** (§2.0), leftover-tic carry across state transitions.
3. **Phaser is a backend, not a home.** The simulation (movement, clipping, actors, tasks) lives
   in the pure module, unit-tested headless; the scene draws and forwards input. This is
   already our pattern (arcade.ts vs ArcadeScene) — the study confirms it as THE architecture
   (Omnispeak's id-layer/game-layer split, null backend for tests).
4. **The machine-playtest harness stays** (it caught four real design flaws in KA-1) and gains
   assertions from §4.2's laws.
5. **Determinism where it pays**: seeded RNG for enemy staggers (Keen's rndtable staggers
   patrol turns so levels never feel metronomic — we keep a seeded equivalent), enabling
   recorded attract-demos later (a "watch a worked example" feature for a teaching game —
   Keen's demo mode, reborn pedagogically).

---

## 9 · Visuals-last doctrine (the slots for Koki's art lane)

Procedural placeholders (current tileset painters + seeded SVG creatures) until Koki generates
art. The bible specs the SLOTS so the generation lane starts from a list, not a guess:

- **Player**: 9 states × 2 facings (stand, walk×4, jump, fall, pogo×2, hang, pull-up, look-up,
  look-down, hurt, victory) — sprite sheet, 48px grid.
- **Creatures**: per §3 table, 3–6 frames each + freeze/dissolve burst.
- **Tiles**: ink-world families (solid, one-way, spike, conveyor-later, pedestal, seal, gate,
  door) + per-zone palettes (the school-world zones re-skin the same families).
- **The page fragments**: one illustration per level, torn-edge masked, assembling on the map.
- HUD/skins ride the existing WorldCopy pack system (×3 story skins already live).

---

## 10 · The Koki gate (15 minutes)

**One question: is THIS the game — the verbs (§2), the creature language (§3), the
death-means-tasks loop (§5.3), and the artifact goal (§4.3) — the thing to build?**

Suggested pass:
1. Play real Keen 4 for 10 minutes first (calibration ritual):
   https://archive.org/details/msdos_Commander_Keen_4_-_Secret_of_the_Oracle_1991 — click the
   power button, any key past the setup screen, then E/N/T-er through the menu (arrows + Ctrl =
   jump, Alt = pogo). Feel the pogo, the held jump, a ledge grab, the camera.
2. Read §1 (what was wrong), §2.4 (the pogo), §3 (the cast), §5.3 (the death loop), §4.3 (the
   artifact goal). Skim the rest.
3. Verdict options: **(a)** build K-3 to this bible as written · **(b)** amend specific
   sections (say which) · **(c)** the direction is still off (say where — cheap now, expensive
   after K-3).

My recommendation: (a). The design now derives from the studied source, not from genre memory;
every section cites its ground truth; and the task economy finally makes the arcade serve the
learning instead of interrupting it.

---

*Study artifacts: `docs/study/keen/` (nine reports: player, framework, K4 actors, K5+K6 actors,
id engine, metagame, Omnispeak architecture, pokefirered overworld, modality corpus). Personal
full reads: CK_KEEN.C (2509 lines), CK_STATE.C (1967 lines). Five numeric spot-checks verified
against source before this document was written. Zero code copied from any reference — see §0.*
