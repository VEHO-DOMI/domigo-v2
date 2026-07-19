# The 1995 painted-platformer grammar — clean-room study (2026-07-19)

**Status: STUDY (system of record for doc 31's evidence). Sources are STUDY-ONLY (CP-15): we
transcribe behavior, constants, and structure in our own words; no code, assets, or names are
ever copied into the product. Compiled from three research passes (two source-repo scouts + a
design-space scout), load-bearing claims cross-verified.**

Primary sources: `github.com/Falcury/rayverse` — a C reconstruction of the game's PC v1.21,
built from the disassembly (original French source names; playable; CC0 by the reconstructor,
but the underlying logic is Ubisoft's → study-only) · `github.com/malespiaut/rayman-from-scratch`
— symbol dumps from the 2016 mobile re-release (provenance confirmation + name dictionary
only) · `github.com/BinarySerializer/Ray1Map` + raym.app ("Ray Maps") — the community map
viewer, authoritative for on-disk level structure; the PC + PS1 originals are browsable there
(Game/Level dropdowns) · the community wiki (event catalogs, Designer documentation).
Trust order on conflicts: rayverse behavior → Ray1Map data → symbols → wiki.

## 1 · Architecture verdict (the load-bearing surprise)

Under its painted skin, the 1995 game is a **16×16 px tile-collision platformer**: a level is
N parallax background layers + ONE tile layer (each tile = graphic id + collision type) + an
event list. Logic runs at a **fixed 60 Hz tick**; horizontal motion uses a **sub-pixel momentum
accumulator** (~1/256 px units, Bresenham-style fractional carry). Consequence for us: glyph-grid
authoring survives the pivot; painted plates ride on top.

## 2 · The player spec (constants per 60 Hz tick, 16 px tiles)

- **Ground movement:** momentum accumulator with world-dependent friction — **6** normal, **3**
  in the slippery world. A run state engages above a momentum threshold. Raw walk/run top speeds
  are data-driven in the original (external state tables, not source literals) → we hand-tune.
- **Jump:** initial vy **−5** (**−3** from the hang state). **Variable height by gravity
  suppression**: gravity (+1/tick) is skipped while the button is held, up to **12 ticks**; a
  one-time extra nudge fires at tick 23. Fall caps **+4** down / **−10** up. **No coyote time
  in the original** — jumping is gated purely by ground flags + button edge (we add coyote +
  buffer deliberately).
- **Hover ("helicopter"):** hold jump in air → **50-tick** glide with counted slow-fall.
  Super variant: gravity applies only every **20th** tick; a second click within **20 ticks**
  gives a horizontal dash burst; from standstill a small upward nudge.
- **Telescopic fist:** ground press charges **+1/tick to 63** (air throw = fixed **32**).
  Damage = **(charge>>4)+1** → 1–4 (a gold variant adds +2). Projectile speed **5/8/11** by
  charge tier, plus a run boost capped at **16**. Travel distance ∝ charge; at zero it
  **U-turns and returns**, accelerating; it can GRAB objects and rings (follow linkage).
- **Ring swing:** a true pendulum — position = anchor + len·(cos, −sin), rope length ~**95–100
  px**, angle on a **512-unit circle**, angular step fastest at the arc bottom, direction flips
  at the extremes with a **5-tick dwell**; release converts swing velocity into a jump.
- **Ledge hang** (grab cliff-edge tiles, pull up, jump −3) and **vine climb** (snap to a 16-px
  column).
- **Damage:** knockback vx ±**2** vy **−3** (fast enemies ±5/−6); **120-tick invulnerability**.
  In the original, spikes/water/pits kill instantly and death costs a life; checkpoints are a
  photographer NPC (pose → photo → respawn point), deliberately sparse. (Our game replaces every
  death path with task encounters — doc 31 §3.)
- **Camera:** horizontal /4-eased follow toward a direction-dependent look-ahead edge (moving
  right targets the left third and vice versa), minimum follow speed 3; vertical holds the
  player near ~57% height, scrolling only past thresholds; platform velocity is added while
  riding; per-level scroll locks and autoscroll exist for arenas/gimmicks.

## 3 · Collision tile vocabulary

air · solid · one-way (enter from below) · 45° slopes · 30° slopes (two-tile pairs) · slippery
variants of all slopes · flat ice · hurt · spring/bounce · water · climbable vine · spikes
(instant-kill there; tasked here) · grabbable cliff edge · enemy U-turn marker. Slope flags
deflect momentum each tick; jumping off a slope converts slope speed into extra height.

## 4 · The event/object system

Each level carries a flat object list. An object = type + position + a **two-level state
machine** (main/sub state indexing per-state tables: per-state speed, animation, next state,
gravity mode, flags) + one or more hitboxes + **link groups** (circular chains so related
objects activate/reset together). AI in the original is a **34-opcode bytecode VM** (move/wait/
state-change/loops/branches) — we replace it with typed declarative behaviors. **Activation:**
an object wakes within ≈1 screen of margin (+60 px hysteresis once active); leaving either
kills, or re-initializes for a fresh spawn; **collectibles never respawn**. Bosses and a few
hazards are always-active.

Representative behaviors (for our role vocabulary): patrol walkers that U-turn on walls or
marker tiles (chaser) · aimed/timed projectile shooters (gunner) · scripted flyers · ceiling
spiders that drop when you pass beneath · falling/rising/pathed platforms the player attaches
to (platform velocity carries into camera) · the bouncy plum: rebound vy **−5** free / **−3**
ridden, with horizontal friction and slope deflection · cages: multi-hit by the fist, then
burst (freed sprites spray out with per-index velocities) · small collectibles with **100 → 1
reward** economy and breadcrumb-trail placement · power-ups (fist upgrades, capacity raise,
one-ups) · trigger doors ("gendoors" in community parlance — proximity-, punch-, or
collect-all-N-fired spawn/reveal primitives with sized trigger ranges; the Designer's per-world
event manifests show the palette was world-scoped).

## 5 · Structure & progression (design-space)

- **Worlds → levels → phases:** 6 worlds; 17 cage-bearing levels + a finale gauntlet. A level
  chains several short horizontally-scrolling phases, each closed by an **exit sign**; bosses
  get single-screen arenas. Original level counts per world: 22/18/13/13/12/4 internal maps.
- **The cage spine:** 6 cages hidden per level (102 total across the game); **freeing ALL of
  them gates the finale**. Many need later powers → designed backtracking. Small-collectible
  trails breadcrumb toward hidden cages.
- **Ability progression:** powers arrive at fixed story beats from a mentor fairy (punch →
  ledge-hang → ring-swing → helicopter → run), each granted right before the world that
  stress-tests it; TWO powers come from helper NPCs after the player does them a favor. Later
  powers retro-open earlier secrets.
- **Boss grammar:** one screen, one telegraphed pattern, one exploitable weak point — almost
  always *deflect-the-boss's-own-projectile-back* or *use-the-arena*; never a damage race. The
  finale recombines earlier bosses. The flagship tone beat: a defeated mini-boss **cries, is
  consoled, and becomes the player's mount/ally**.
- **Tone:** death is slapstick and bloodless; enemies are toys/instruments/critters; helper
  favors and redemption beats throughout. The difficulty (not the content) was the only edge.

## 6 · Art register (for STYLE_PAINT_V1's evidence)

1995 traits: hand-painted gouache backgrounds in layered parallax silhouettes; saturated
per-world total-theme palettes; thick soft hand-inked character outlines; limbless mascot
characters (floating hands/feet) with big expressive eyes; mascotized everyday objects;
glowing collectibles; strong figure-ground readability. The modern fan remake adds (optional,
not adopted): posterized color banding, CRT filter, era toggle.

## 7 · IP caution list (binding, CP-15)

Never on any surface, in any prompt, ref folder, or filename: the game's name and hero design
(the SPECIFIC limbless character — the limbless technique itself is free), all world/level
names, all character/boss/creature names (the fairy, the photographer, the bosses, the minions),
the lore nouns (the cage-sprites, the blue collectibles), and the community term "gendoor"
(strongly associated; we say trigger). Freely usable: every mechanic, constant, structure, and
grammar documented above.
