# Keen 4 feel & look — the deep source audit and what we shipped (v2.3)

*Fable 5, 2026-07-16 (study round 3). Sources: **Omnispeak** (faithful disassembly-derived
Keen 4 reimplementation — its `data/keen4/ACTION.CK4` is the original game's action database
as text, so per-state speeds/timings are primary data) + **id Software's Keen Dreams GPL
source** for cross-checks. Two fresh-context audits (physics · presentation) + first-hand
spot-verification. PROVENANCE LAW upheld: numbers and mechanisms only, ZERO code copied.*

**Unit ruler:** Keen: 16px tiles, 256 units/tile, 70Hz tics. Ours: 48px tiles (3×), 60Hz.
1 unit/tic = 13.125 of-our-px/s · 1 unit/tic² = 918.75 px/s². Keen accelerates on odd tics
only, so "+N/odd tic" halves.

## §1 · What v2.3 ships SOURCE-EXACT (each: Keen raw → ours)

| Thing | Keen 4 (cited in the audit transcripts) | ARCADE now |
|---|---|---|
| Run speed | 24 u/tic (ACTION.CK4 run) | `runSpeed 315` (was 288) |
| Air control accel | 1 u/tic² (CK_PhysAccelHorz ±2/odd) | `airAccel 919` (was 820) |
| Air drag | 0.5 u/tic² | `airFriction 459` (was 410) |
| Running-jump carry | velX=16 of 24 run = 2/3 | `jumpRunCarry 0.667` (was 0.6) |
| Gravity | 2 u/tic² (GravityHigh +4/odd) | `gravity 1840` (was 2200) |
| Easy gravity | GravityMid 3 vs High 4 = 0.75× | `gravityEasyScale 0.75` (was 0.88) |
| Jump thrust · fuel | −40 u/tic · 18 tics — **timer-suspended gravity, release cuts the TIMER never the velocity** (we already modeled this correctly) | `jumpThrust −525` · `jumpFuelMs 255` → max ≈4.3 tiles, tap ≈1.9 (was 3.1/1.1 — the single biggest feel gap, closed) |
| Pogo coasting | stick-neutral keeps velX EXACTLY (ck_keen.c:1380) | `airVx` returns vx unchanged when pogo+neutral |
| Pole slide | 24 u/tic — the slide IS run speed | `poleSlideVy 315` |
| Hold-to-land jump | `jumpWasPressed` latch (ck_play.c:1326): a jump pressed mid-air and still held fires ON LANDING | implemented (space/pad-jump only — up stays gated for look/doors) |
| Look asymmetry | up ≈1.7 tiles, down ≈6.7 tiles (51% of view!) — look-down exists to SCOUT DROPS | `lookUpTiles 2 · lookDownTiles 4` |
| Mid-air camera clamp | even airborne, feet hard-clamped into the view (ck_play.c:2176) — falls chase the player | `camAirClampLo 0.8 / Hi 0.12` in updateCamera — no more blind drops |
| Mover carry | rider inherits the platform's exact deltaX (ck_keen.c:627) | position-delta carry (was velocity-add) |
| Run anim | 4 frames × 6 tics = 86ms | 4-frame cycle @86ms |
| Pose grammar | velocity picks the pose (rise/fall split), pogo = squash→extended | pose machine in update() |
| SLOPES | 8×16 surface-height table, mid-column single-point sample, crossing-bound snap, feet-row skipped in horizontal clip, downhill push ±8 u/tic | `/` `\` glyphs (steep 1:1 pair) · `slopeSurfaceY` + ground-follow in scene · flanking solids drop slope-side collision · `slopePush 105` |

## §2 · Deliberate deviations (authentic-but-NOT-copied — kids first)

- **One-hit death, zero i-frames** (Keen): we keep hearts + iframes + Rettungsaufgabe. The product's point.
- **Walk-off-ledge speed cut to 8 u/tic** (Keen brakes you to ⅓ run mid-air): feels like a handbrake; we keep momentum.
- **No coyote time** (Keen has none): we keep 90ms.
- **Pole climb 8 u/tic (105 px/s)**: tediously slow for kids; ours stays 150.
- **Pole top-out = SIT** (Keen never auto-exits a pole top): our courtesy pop (−520) stays — kinder, and it powers the hatch top-out.
- **Pogo base height** Keen 2.9 tiles unheld / 6.75 held: ours ≈5 base with a smaller hold bonus — kinder default, less mastery-gating.
- **Pull-up 571ms** (Keen's scripted 4×10 tics): ours 260ms.
- **Parallax**: Keen 4 has NONE (one scroll offset; depth = masked fore-foreground tiles + z-layers). We keep our soft parallax AND adopted the z-sandwich (below).

## §3 · The look doctrine we adopted (presentation audit)

- **The z-ladder** (Keen's 4 sprite layers + fore-foreground tile pass): terrain 0 · props 1–2 ·
  items 3 · player/creatures 4 · **fore-foreground 6** (door arches render OVER the player —
  walking into a doorway reads as stepping INSIDE). HUD/arrow 30.
- **Core pose economy**: Keen ships ~59 unique poses but plays ~95% of the time in 13.
  Our hero ships 12: stand · run×4 · jump · fall · pogo×2 (squash/extended) · climb×2 · hang.
  (Keen-scale luxury like the idle sit-and-read book ladder = W5 juice backlog.)
- **Everything alive, never lockstep**: creatures 2-frame @320ms with per-creature phase offset;
  collectible shimmer/bob already phase-offset (kept).
- **Art system**: side-view platformer art now lives in `art-gen/src/platform.ts` as
  IndexedImage painters (deterministic, Node-testable): auto-tiled terrain (16 edge-exposure
  variants — grass lip ONLY on top-exposed faces, ruled paper lines + letter fossils inside
  the earth: the world IS a book), slope wedges, plank one-ways, ink-thorn spikes, the
  12-pose hero (same hair/shirt seed pools as the map avatar — same kid on every surface),
  6 redesigned creatures (the flyer is a POSSESSED BOOK; movers are FLYING BOOKS), props
  (banner poles, wax seals, glowing Glühwort scraps, checkpoint banners, the rune boss door),
  and the far skyline silhouette (page-hills + book-spine towers).
- **Preview harness**: `scratchpad/art-preview.mjs` rasterizes IndexedImages to PNG contact
  sheets — procedural art is now iterated BY EYE, never blind. (Session tooling; rebuild as
  needed, ~60 lines.)

## §4 · Still banked for later waves (from the audits, not yet built)

1. **Door-enter ceremony** (walk-to-center 1px/tic → z-drop behind arch → 5 rising steps →
   teleport + camera snap; NO fade) — the arch-over-player half is done; the staged walk is W2.
2. **Stepped 4-level fades** (343ms, palette-style) for level entry/exit; entry flavor line
   ("Keen slips into…" grammar — ours: one German line per chapter).
3. **Item pickup ghost** (silhouette drifts up 20px/571ms) + per-item sounds.
4. **The idle ladder** (glance 2.9s → fidget → sit-and-read-a-Glühwort-book ~17s) — the most
   remembered Keen juice; pure charm, zero mechanics.
5. **Map flag ceremony** (30-point parabola, end-over-end flip @171ms, lands on the building) —
   partially built in MapScene already; sync the timings.
6. **Animated tile cycles** (global sync, uneven per-frame holds): ink pools, torches, flags.
7. **Two-tile gentle slopes** (Keen types 2/3/5/6 — 1:2 grade) if W3 levels want rolling meadows.
8. **Status panel** (scroll-down over frozen game) when the HUD grows past three chips.

## §5 · Level-authoring deltas (cookbook §7b addendum)

- **Slopes**: `/` rises rightward, `\` falls rightward, exactly one tile each (1:1). The cell
  under a slope's LOW edge must be solid (no hanging wedges). Flanking solids automatically
  drop their slope-facing wall collision. Slope cells count as footing for every law.
- **Jump envelope grew**: max jump ≈4.3 tiles (was ≈3.1). The laws' BFS envelope (≤3 rows)
  is now CONSERVATIVE — levels stay provable; authors may hand-place taller optional jumps
  knowing the real engine clears 4.
- Mover rides are now drift-free — collectibles may sit directly on long ride lines' anchors
  (unchanged law), and the ride feel is Keen-exact.
