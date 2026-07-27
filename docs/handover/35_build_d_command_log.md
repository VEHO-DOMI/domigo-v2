# 35 · BUILD-D COMMAND LOG — the Opus-5 execution record

**The governing brief is the frozen passover:**
`PLATFORM MASTER/SESSION-PROMPTS/PASSOVER_PB_BUILD_D_2026-07-26.md` (iCloud).
The technical plan is [doc 34](34_build_d_wiring_plan.md) — its **§0a amendments A-1…A-7
override its older text**. Command structure: **Fable 5** = commander (wrote the plan,
made every taste call, reviews the PR) · **Opus 5** = executor (runs the packet chain
below in its own session, owns git on `pb-d2-grids`, opens the ONE Build-D PR) ·
**Koki** = merge + the chapter-1 replay gate.

Groundwork already committed by Fable (2026-07-26, `8faa9bc`):
- **D1 decided + built**: the p3 slide = new glyph `z`, slide-owned control (6 px/t target,
  ramp 48 subs/tick, brake on back-hold, momentum into jumps), guarded by `slide.test.ts`;
  grids-v2 p3 carries the `z` cells, laws NONE-failures.
- **A-7 purpose fix**: `p1-swarm` removed from grids-v2 (no dossier purpose row; the moths
  debut in p2 where the dossier stages them).
- Doc-34 amendments A-1…A-7 (vocab stems frozen, allowlist correction, tape-macro
  authorization, tafel side-study, prologue descoped to a follow-up PR).
- The Opus-5 dial sheet (fable-method `references/opus-tuning.md` §1) — grounded in
  Anthropic's official Opus 5 prompting guide; PK-1 doubles as its calibration probe.

## The packet chain (append one section per packet as it lands)

| Packet | Scope | State |
|---|---|---|
| PK-1 | W1 — batch AC/AC2 import script + run, allowlist −2 | **DONE** — 65 stems, allowlist 2→0, art dir 82→133 (PK-2's browser pass then deferred `pit_inner_tile`: **64** stems, 132 PNGs) |
| PK-2 | W2+W3+W4 — per-phase plates/bands · terrain strips (+`z` slide art) · enemy pose hook (+A-4 tafel study) | **DONE** — 221 tests, tapes green, F13 mass-fill regression caught in-browser and reverted |
| PK-3 | W5+W6 — grids-v2 splice (machine-diff fidelity) + all five proof tapes (p3 rides the slide) | **DONE** — splice IDENTICAL to source of truth, 5/5 tapes ALL GREEN, slide ridden at 6.00 px/t |
| W7 | full gate set + browser proofs + the ONE Build-D PR | **DONE** — 10/10 gates exit 0 (gate 2 caught a type error under 224 green tests), tapes byte-identical on re-record, PR open |

Logging law (Koki's condition): every packet ends with its section HERE **and** a Mission
Control update (`data/domigo.json` → sync → push). A packet without both is not finished.

---

## PK-1 · W1 — the batch AC/AC2 art import (DONE)

**What.** New `docs/art/import-batch-ac.mjs` (from the `import-batch-ab.mjs` pattern) imports
**65 stems** out of the 31 accepted sheets into `apps/web/public/art/g1/paint/ch01/`, and the
allowlist drops from 2 entries to **0**. The art dir goes 82 → 133 PNGs (51 new, 14 overwritten,
0 removed).

**The one addition to the ab pattern — a per-cell WRITE MODE.** The ch01 kit mixes three
geometry contracts, and using ab's single mode would have broken two of them:
- `sprite` (key → defringe → content-trim) — ab's behaviour. Entities/props/vocab anchor by
  their own centre, so trimming is free. 39 stems.
- `keep` (key → defringe, **no trim**) — loop strips, caps, the pit tile, the slopes and the
  parallax bands. `PaintScene` derives their scale from the SOURCE height (`tileScale =
  dispH / src.height`, lines 611/645/471/483) and forces slopes to cell size with
  `setDisplaySize` (line 539). Trimming any of them changes the tiling period or stretches the
  art, so authored cell geometry is the contract. 19 stems.
- `plate` (crop only, no key, audit 0.5) — the 4 backdrop plates **and the prologue triptych**:
  all five are full-bleed paintings, machine-verified at **0.0 % magenta pixels**, so keying
  them would be a no-op at best and trimming them destructive. 7 stems.

**Commands (unpiped, real exit codes).**

| command | exit | result |
|---|---|---|
| `node docs/art/import-batch-ac.mjs` (run 1) | **0** | 65 stems written, every alpha audit passed |
| `node docs/art/import-batch-ac.mjs` (run 2) | **0** | idempotence: all **133** files **byte-identical** (sha-256 diff empty) |
| `node scripts/check-paint-art.mjs` | **0** | `OK — 51 required stems all present` (152 painted stems on disk) |
| TAMPER: rename `kit_p1_hall.png`, re-run | **1** | `✗ source sheet MISSING: batch-ac2/terrain/kit_p1_hall.png` — loud, then restored; re-run byte-identical to run 1 |
| NUL sweep (P-11) on both changed text files | — | clean; the sweep itself was tamper-checked against a real NUL byte first |

*Harness note for anyone reusing these commands: in zsh `$'\0'` collapses to an empty pattern, so
`grep -q $'\0'` reports NUL in **every** file (it flagged a 3-byte `[]` JSON). The correct sweep is
`tr -d '\000' < f | cmp -s - f`. `PIPESTATUS` is bash-only; zsh needs `$pipestatus[1]`.*

**Stems written (65).** Plates (4): `plate_p1_entrancehall` `plate_p2_nightwall`
`plate_p3_yardwall` `plate_p9_inkdream`. Bands (4): `band_p1_hallway` `band_p2_furniture`
`band_p3_playground` `band_p4_audience`. Terrain (18): `strip_ground_loop` `strip_cap_l`
`strip_cap_r` `pit_inner_tile` `slope45_up` `slope45_down` `strip_ice_loop` `pool_ink_loop`
`pool_ink_wide` `spikes_nibs_loop` `plat_coatbench` `plat_desk` `plat_bookpile_s`
`plat_bookpile_l` `plat_roofarrow` `fence_feather` `ledge_windowsill` `podium_chalkcrate`.
Entities (16): `pencil_run` `eraser_squash` `ranzen_stomp` `heft_bank` · `satchelswing_a`
`satchelswing_b` `ruler_a` `ruler_b` · `moths_a` `moths_b` `moths_rest` `moths_slate` ·
`tafel_roll` `tafel_windup` `tafel_stagger` `tafel_win`. Vocab (12): `obj_pen` `obj_pencil`
`obj_rubber` `obj_ruler` `obj_book` `obj_exercisebook` `obj_pencilcase` `obj_sharpener`
`obj_gluestick` `obj_schoolbag` `obj_desk` `obj_chair`. Props (6): `krakel_a` `krakel_active`
`door_open` `arenadoor_a` `window_exit` `klecksdoor_a`. Story (5): `prologue_swallow`
`prologue_ensemble` `prologue_caged` `nameconsole_empty` `nameconsole_line`.

**Deferred cells — 30, imported by nobody, and per A-2 NONE of them is allowlisted.**
| cells | why |
|---|---|
| `kit_p2_floor[0..2]`, `kit_p3_paving[0..2]`, `kit_p4_stage[0..2]` (9) | **A-8**, verbatim: their caps would clobber `kit_p1_hall`'s canonical `strip_cap_l/r`. `kit_p1_hall` is the one canonical ground kit (§3.3 MVP); per-phase ground looks are the logged fast-follow. |
| `kit_p3_air[1]` (1) | §2 says "ruler→entity (skip)" — the ruler ships as an entity from `ent_platforms`. |
| `kit_p3_paving[3]` (1) | §2 names no stem for it ("corner (prop)"). A row without a stem name is not an importable row. |
| `kit_p1_steps[3]`, `kit_p2_furniture[3]`, `kit_p3_air[2]` (3) | **§2 labels all three `plank_loop` — one name, three sheets.** Writing any would silently clobber the shipped batch-AB plank, and `plank_loop` is *not* on the passover's intended-overwrite list. Verified the grids-v2 phases use **no `=` glyph at all**, so nothing needs a plank today. Same clobber class A-8 closed for the caps. |
| `props_p1`, `props_p1b`, `props_p2`, `props_p3` (16) | §2 gives them no stem names and §3.3 confirms no renderer placement path. Every PNG in the dir is preloaded as a texture (`PaintScene.preload` over `resolvePaintArt`'s scan), so importing unplaceable decor costs 16 real image loads and squats 16 names the decor-layer design has not chosen. |

So 26 of the 31 accepted sheets contribute stems; 5 (`kit_p3_paving` + the four `props_p*`) are
wholly deferred. Nothing is lost — the sheets stay in the lab and the fast-follow can name them.

**Three sample stems for Fable's visual spot-check** (opened and inspected, composited on a
checkerboard): `plate_p1_entrancehall` — painted hall, coat hooks, benches, stair rail; full-bleed
and opaque · `strip_ground_loop` — the floorboard-over-books strip doc 34 §3.3 describes, cleanly
keyed, geometry intact at 512×512 · `pencil_run` — the grey roped pencil in a run pose with
floating mitten-hands and shoes, matching the shipped AB enemy continuity.

**Extra audit run beyond the named gates (the alpha audit cannot catch this class).** Counted
residual chroma fringe on every written stem. 15 of 65 carry any pink-ish pixel; the loudest,
`band_p2_furniture` at 1.374 %, turned out to be **painted art, not fringe**: 1,491 of its 1,495
pink pixels are interior (never adjacent to a transparent pixel), spread across the full band in
muted violets like `(121,64,154)` — the night-classroom palette, not `(255,0,255)`. Classifying by
alpha-edge adjacency across the batch gives **105 genuinely fringed pixels out of ~9.5 M visible**
(0.001 %). The 3-pass defringe is doing its job; no action taken.

**Honesty clause — what I could NOT verify here.** Nothing in this packet was rendered in a
browser; whether these stems *look right in motion* belongs to PK-2/PK-3 and the aesthetic ACCEPT
is Fable's and Koki's, never mine. Specifically unproven until then: that the new cell sizes read
well on screen (see finding F-3), that per-phase bands land at the right horizon, and that the
`z`-slide art sits correctly on the slope.

**Findings (reported, not acted on — they sit outside this packet's path walls).**
- **F-1 · the passover's overwrite list is short.** It names 5 intended overwrites (`moths_a`,
  `moths_b`, `krakel_a`, `klecksdoor_a`, `door_open`); the real set is **14**. The other 9 are
  terrain — `strip_ground_loop` `strip_cap_l` `strip_cap_r` `pit_inner_tile` `slope45_up`
  `slope45_down` `strip_ice_loop` `spikes_nibs_loop` `pool_ink_loop` — and doc 34 §3.3 asks for
  exactly that ("import ONE `strip_ground_loop` … removes ALL brown fallback"), so the overwrites
  are intended; only the list was incomplete. Old art is recoverable from git if any is regretted.
- **F-2 · `plank_loop` is triple-claimed in doc 34 §2** (see the deferred table). §2 needs one
  canonical plank row plus distinct names for the other two if the per-phase plank look is wanted.
- **F-3 · the AC cells changed the tiling period, and one scale constant is now stale.**
  `strip_ground_loop` was 2048×384 and is now 512×512, so with `tileScale = dispH / src.height`
  the on-screen pattern goes from ~160×30 px to ~30×30 px. Sharper: `PaintScene.buildTerrain`
  hard-codes `const scale = 0.055; // ~56px world pattern from the 1024 source` for
  `pit_inner_tile` (line 596) — the AC cell is 512, so that comment is now wrong and the pit
  pattern renders at ~28 px. `PaintScene.ts` is PK-2's file and terrain is W3's scope; I will
  judge it against the browser there and log the outcome rather than pre-emptively changing it.

**Commit.** `Build-D W1: batch AC/AC2 import — 31 sheets → 65 stems, allowlist cleared`

## PK-2 · W2+W3+W4 — the engine wiring (DONE)

**What.** Three deliverables in `PaintScene.ts` plus one pure helper, and one PK-1 import
reverted on browser evidence.

**1 · Per-phase plates/bands (§3.2).** `buildBackdrop` now reads `phase.plates.mid` /
`.near` through one small resolver and falls back to the fixed `strip_mid_loop` /
`plate_near_loop` names. `PhaseSpec.plates` already typed `mid`/`near`, so no schema change.
A phase that names no band renders byte-identically to before.

**2 · Terrain strips + the `z` slide art (§3.3 MVP, A-6).** The `z` glyph was rendering as
*nothing*: `isSlope("z")` is true, so it entered the slope branch, but no shape arm matched it
and `slopeStem` resolved to `null`. It now draws the same 45°-down wedge as `\`, resolves to
`slope45_down`, and joins the ice-strip run predicate so `strip_ice_loop` (the blackboard
slide) paints down it exactly like a `~` run — one strip per cell down the diagonal, which is
how p3's slide is laid out (one `z` per row, cols 10→15).

**3 · Enemy pose hook (§3.1).** New pure `entPoseCell` in `anim.ts` — the package's documented
home for deterministic frame selection — and `PaintScene.entStateCell` now delegates to it.
Putting it there is what makes the brief's "unit test with a tamper case" possible at all:
`PaintScene.ts` imports Phaser, so logic living inside it cannot be tested headlessly. The
`entTex` fallback chain is **untouched**, so a missing `_run`/`_squash`/`_stomp`/`_bank` stem
still lands on `_a` and can never break a render.

Every threshold is *derived from the sim constant it depicts*, imported rather than re-typed,
so tuning the sim moves the pose with it. That meant naming three literals in `entities.ts`
(`ENEMY_WALK` now exported, plus new `BOUNCE_UP` and `FLYER_SWEEP_PX` replacing inline
`3.2 * SUBS` / `40`) — value-identical, and `proof-tapes.test.ts` stayed green, which is the
proof the sim itself did not move.

| pose | signal | why that signal |
|---|---|---|
| `run` | `\|vx\| >= ENEMY_WALK/2`, non-platform | a chaser's vx is ±ENEMY_WALK while walking and 0 at an edge turn; platforms carry a ride delta in vx that is not a gait |
| `squash` | bouncer, `\|vy\| >= 0.8 x BOUNCE_UP` | the fast part of the arc = the bottom. The art shows the body flattened wide, which is contact, not apex |
| `stomp` | crusher in `act` | a crusher's `act` **is** its slam |
| `bank` | flyer, `\|x - homeX\| >= 0.8 x sweep` | the art shows the whole body rolled over — that is a turn, so it belongs at the sweep extremes, not mid-sweep. Uses x/homeX, so it never couples to the sine's period |

I opened the four cells next to their idle counterparts before choosing signals; the art, not
the doc, decided `bank` (a roll) and `squash` (contact, not apex).

**Gates (unpiped, real exit codes).**

| command | exit | result |
|---|---|---|
| `pnpm --filter @domigo/game-paint exec vitest run` | **0** | **221 passed** (214 + 7 new), incl. `proof-tapes.test.ts` and `slide.test.ts` |
| `pnpm --filter @domigo/game-paint exec tsc --noEmit` | **0** | |
| `pnpm --filter web exec tsc --noEmit` | **0** | |
| `pnpm --filter web build` | **0** | |
| `node scripts/check-game-bundle.mjs` | **0** | 37 chunks · **Phaser in exactly 1 chunk, 310 KB gz** · no shared-chunk leak |
| `node scripts/check-paint-art.mjs` | **0** | 51 required stems present |
| TAMPER: invert `>= RUN_VX` to `< RUN_VX` | **1** | 5 of 7 pose tests went RED, then restored (the 2 that stayed green are the FSM-precedence and platform-guard cases, which is correct — they never touch vx) |
| browser: `/play/1/buch` p1 and p2 | — | scene active, **0 console errors**, 152/152 textures, screenshots taken |

**★ The browser found a real regression in PK-1 — reverted here.** p1's first screenshot showed
the deep floor in horizontal brown stripes. Cause, machine-proven: doc 34 §2 maps
`kit_p1_hall[3]` to `pit_inner_tile`, but that stem is used as a **deep-interior mass fill** —
the renderer tiles it under every solid-under-solid cell, over a brown `EARTH` fillRect. The
batch-AB tile it replaced is **1024x1024 and 100 % opaque**; the AC2 cell is **512x512 and only
27.7 % opaque**, a book-stack motif whose top 5/16 and bottom 4/16 are *empty*. Tiling it let
the brown through in bands — re-opening the exact F13 class W3 exists to close. So
`kit_p1_hall[3]` is now deferred, the proven AB tile is restored, and the import writes
**64** stems, not 65. Re-screenshotted: the deep floor is a solid mass again.

I checked the whole class rather than the one instance — old-vs-new alpha coverage on all 14
overwritten stems. **`pit_inner_tile` is the only mass-fill loss.** The other shifts
(`strip_ground_loop` 78 %→27 %, `pool_ink_loop` 91 %→22 %, …) are just the 2048x384 strip sheet
becoming a 512-square cell with more empty margin; they are tileSprites scaled by source height
and the screenshot confirms they paint their runs correctly. This is the **MASS-FILL LAW** that
doc 33 already wrote into the ch02 (AE) prompt — ch01's kit predates it, so ch01 still has no
mass-fill cell of its own. Logged as F-4.

**A-4 answer (the tafel study — reported, not implemented, per the amendment).**
The guardian FSM is `idle` to `telegraph` to (throw) back to `idle`, plus `stagger` (after a
deflect), `window` and `consoled` (both scene-driven), and `redeemed`+`dazed` on
`guardianDown`. **It is NOT 1:1 — the hook needs three changes and one cell has no sim state
at all:**

| cell | sim state | verdict |
|---|---|---|
| `tafel_windup` | `telegraph` | **override needed.** `telegraph` already resolves to the shipped `tafel_telegraph`; both stems exist, so something must choose. Trivial once decided. |
| `tafel_stagger` | `stagger` | **new branch needed.** `stagger` currently falls through to the a/b default and renders `tafel_a` — the stagger, i.e. the counter-window's own tell, is invisible today. |
| `tafel_win` | `consoled` | **new branch needed.** `consoled` is collapsed into the `dazed` arm, so the redeemed-friend pose can never show. This is the console beat's payoff (doc 31 §3). |
| `tafel_roll` | **none** | **gap.** The guardian never changes `x` — the FSM has no locomotion whatsoever. The dossier's *bewegliche* Tafel needs either a new sim state (a roll/reposition phase in `GUARDIAN_SCRIPT`) or content-side wiring. PK-3 must decide which; it is the one item here that is not a two-line renderer change. |

**Honesty clause — what is NOT proven yet.** The per-phase band code and the `z` slide art are
**wired but not visually proven**: the live `ch01.level.json` is still the OLD level, which sets
no `plates.mid`/`.near` on any phase (so both bands took the fallback path in every screenshot)
and contains no `z` cell at all. Both prove out in PK-3, after the splice. What p1/p2 *do*
prove: the new terrain art paints the current level, the far plates differ per phase, the scene
boots clean, and the mass-fill regression is gone. The look itself is Fable's and Koki's call.

**Harness learning (cost ~20 minutes; belongs in the registry).** The boot pump dance is **not
a fixed count** — the loader finishes on real wall-clock, and the ch01 art set just grew from
101 to 152 files. Two pump+wait cycles now leave it stalled at **128/152** with `list=24`,
`inflight=0`, the scene still `active:false` — and a screenshot taken there shows *missing
ground art*, which reads exactly like a bug you just introduced. Wait on the condition, not on
a count:

    for (let i=0; i<6 && (L.isLoading() || !sc.scene.isActive()); i++) {
      P.rafStep(30); await new Promise(r => setTimeout(r, 1500));
    }

Also banked: `game.canvas` cannot be pixel-read back (WebGL without `preserveDrawingBuffer`) —
a `drawImage` copy returns all-black, so "0 brown pixels found" from a canvas readback is a
**false negative**. Measure the source PNGs instead.

**Findings.**
- **F-4 · ch01 has no deep-interior mass-fill cell.** See above. Options for Fable: commission
  one ch01 mass-fill cell (the AE prompt's MASS-FILL LAW, applied retroactively), keep the AB
  tile indefinitely, or repaint the interior fill colour so any show-through reads as book
  rather than mud. Not my call — the evidence is above, the decision is a taste one.
- **F-5 · `tafel_roll` has no home** (see the A-4 table) — the only new art cell in the batch
  with no state to bind to.

**Commit.** `Build-D W2–W4: per-phase plates/bands + terrain strips (+z slide art) + enemy pose hook`

## PK-3 · W5+W6 — the content splice + the five proof tapes (DONE)

**W5 · the splice, and how fidelity was proven.** Before copying anything I diffed the two
files: every top-level field (`schema`, `id`, `chapter`, `name`, `goalDe`, `whyDe`, `hintsDe`,
`collectNounDe`, `abilities`) was already **byte-identical**, and both use the same 2-space
formatting — the files differed *only* in the five phase blocks. So the faithful splice is the
assembled file itself, and the fidelity proof is the strongest one available: **live vs
assembled deep-compare → IDENTICAL**, re-run after every later edit. The only byte I added is
the trailing newline the repo's copy carries and the design copy does not. Nothing was
"improved" in the copy step.

Invariants re-counted from the LIVE file afterwards: 3 phases + arena `p4` + bonus `p9` ·
7 cage entities = `cage1`–`cage6` plus `cage-merle` (the person cage, `params.classmate:
"merle"`) · glyphs now live `#*./BCSX^owz` — note `z` present and `=` absent, which is why PK-1
deferring the three `plank_loop` cells cost nothing.

**W6 · the tapes, and the A-3 macro extension.** The old pilots were stale on the new layouts
exactly as the plan predicted (2 phases red before re-recording). I added two closed-loop ops
to `scripts/record-paint-tape.mjs` under A-3 — `waitPlatformAt` and `rideUntil`, both reading
the sim's own entity position — because boarding a moving platform on a tick count is brittle
*by construction*: the platform's phase depends on every tick spent upstream, so any edit
earlier in the pilot silently desynchronises the boarding. Waiting on where the ruler actually
*is* cannot drift.

**Four of five pilots were green on the first attempt** (p1, p2, p3, p9). Only p4 needed a
retune — 1 of the 3 strikes. Its cause is worth banking: the pilot walked into the chalk-crate
podium at row 14 and stopped dead at c4.6. The podiums are only **one tile high, but the hero
is ~2 tiles**, so at floor level they block the *head*, not the feet — they must be jumped, not
walked past. Both podiums (c5–7, c25–27) now get a jump.

| phase | result | ticks | tasks auto-solved |
|---|---|---|---|
| p1 Die Eingangshalle | exit → p2 | 486 | 3 |
| p2 Das Klassenzimmer bei Nacht | exit → p3 | 558 | 5 |
| p3 Der Schulhof-Garten | exit → boss | 826 | 3 |
| p4 Die Tafel-Bühne | exit → done | 5076 | 3 (= the three knots) |
| p9 Die Kleckskammer | exit → p2 | 277 | 0 |

Recorder printed **ALL GREEN** — and note what that line means here: each tape is verified
OPEN-LOOP through `replayPhaseTape` (the same function CI runs) *before* it is saved, so
record == replay is proven at record time, not assumed.

**★ The p3 slide is ridden, measured, not asserted.** The passover's own tripwire is "if the
tape walks down at 2.25, the wiring regressed". I replayed the recorded p3 tape and logged the
player's speed while `onSlide`:

    ticks with player.onSlide === true : 55
    peak horizontal speed on the slide : 6.00 px/tick   (walk = 2.25, SLIDE_MAX = 6)
    t=43  cell (10, 15)   0.38 px/t     <- the lip
    t=59  cell (12, 17)   3.38 px/t
    t=67  cell (14.1, 19.1)  4.88 px/t
    t=71  cell (15.4, 20.4)  5.63 px/t  <- the foot of the slide

That is D1's acceleration curve (SLIDE_RAMP) resolving to exactly SLIDE_MAX down exactly the
six `z` cells. The physics and the tape prove each other.

**Gates (unpiped, real exit codes).**

| command | exit | result |
|---|---|---|
| splice machine-diff (live vs assembled) | **0** | **IDENTICAL** |
| `pnpm --filter @domigo/game-paint exec vitest run` | **0** | **224 passed** (221 + 3 guardian pose tests) |
| `content-levels.test.ts` (the real `checkLevelLaws`) | **0** | the spliced level parses and passes every law |
| `node --experimental-strip-types scripts/record-paint-tape.mjs` | **0** | **ALL GREEN**, 5/5 exits |
| `node scripts/check-paint-art.mjs` | **0** | **54** required stems (up from 51 — the new grids demand the plates and bands), allowlist at **ZERO** |
| TAMPER: blank p1's 119-tick walk run | **1** | p1 RED: *"tape ended after 486 ticks without the exit firing — the level changed; re-record"*; restored byte-identically, green again |
| browser: all five phases | — | each boots by its own id, **0 console errors** |

**A-4 wired (the tafel motion states).** Per my PK-2 study, three states now resolve to the new
cells — guardian `telegraph` → `windup`, `stagger` → `stagger`, `consoled` → `win` — with
`consoled` deliberately read *before* the dazed catch-all, because `guardianKnotSolved` sets
`state = "consoled"` on the last knot and never sets `redeemed`; read in the old order the
console beat's payoff (doc 31 §3, the blackboard as a friend) is literally unreachable. Three
tests pin this, including that non-guardian roles keep their plain `telegraph`.
**`tafel_roll` stays unwired** — the guardian FSM still has no locomotion at all, so there is
nothing honest to bind it to (F-5). I did not invent a sim state for it; that is a gameplay
decision, not a wiring one.

**Browser evidence — what the five screenshots actually prove.** Both PK-2 gaps are now closed:
- **Per-phase bands, proven:** p1 a locker row, p2 purple desks and chairs, p3 the climbing
  frame and planters, p4 rows of empty audience chairs — four visibly distinct mid bands. p9
  correctly shows the **fallback** band, which is A-8's stated design ("p9 sets no `plates.mid`
  by design"), not an omission.
- **Per-phase far plates, proven:** the painted entrance hall, the night blackboard wall, the
  yard wall, the ink-dream.
- **The `z` slide, proven twice over:** `slope45_down` is placed as an Image at all six z cells
  (x = 160,176,192,208,224,240), and `strip_ice_loop` is placed as a 16x30 tileSprite at depth 2
  at all six (x,y = 160,233 / 176,249 / 192,265 / 208,281 / 224,297 / 240,313) — after the
  ground strips, so it draws on top.
- **F13 stays dead:** the deep floor is the restored mass fill; the ground reads as
  floorboard-over-books across every phase.

**Honesty clause.** Everything above is mechanical proof — the level is faithful, the laws hold,
the tapes reach every exit through the real engine, the art is placed where it should be. What I
have **not** judged, and will not: whether any of it *looks* right. The 512-cell terrain art
tiles at a much shorter period than the 2048-wide sheets it replaced (a ~30 px pattern where it
used to be ~160 px), which is a real change in texture density that only Fable and Koki can
accept or reject. The p3 slide is proven mechanically at 6 px/t; whether it *feels* like a slide
is Koki's replay gate. Nothing here has been played by a human.

**Findings.**
- **F-6 · the arena's far plate does not span the arena (pre-existing, not from this change).**
  On p4 the right ~20 % of the screen falls back to the cream sky. `plateCover` sizes the plate
  from the scroll range but then centres it at `worldWpx / 2`, so with `scrollFactor 0.12` the
  plate's apparent span slides ~197 px left when the camera reaches the right edge — the widened
  image no longer covers where the camera looks. Visible on short levels (p4 is 36 tiles); the
  wide phases hide it. I did not touch the far-plate path (W2 was mid/near only), so this
  predates Build-D — but Koki will see it in the replay, so it should not go unmentioned.
- Still open from PK-2: **F-4** (ch01 has no deep-interior mass-fill cell) and **F-5**
  (`tafel_roll` has no sim state).

**Measurement pitfalls banked this packet** (both produced confident FALSE readings before I
caught them):
- Phaser **TileSprites carry auto-generated UUID texture keys**, so counting by
  `obj.texture.key` reports **zero** for art that is plainly on screen. Identify them by
  geometry (x/y/width/height/depth) instead — that is how the six ice strips were confirmed.
- A **tamper that changes nothing is not a passing guard.** My first tape tamper edited
  `pads[3]`, which was `[12,0]` — and the encoding is `[count, mask]`, so I had blanked the mask
  of an *idle* run and the suite stayed green. A real tamper (blanking the 119-tick walk) turns
  it red immediately. Always tamper a load-bearing element and confirm the failure message names
  the right thing.

**Commit.** `Build-D W5–W6: grids-v2 live in ch01 + all five proof tapes re-recorded (z slide ridden)`

## W7 · the full gate set + the ONE Build-D PR (DONE)

**The complete CI-parity set, every command unpiped with its exit echoed.** Run on the final
tree, in this order:

| # | command | exit | result |
|---|---|---|---|
| 1 | `pnpm --filter @domigo/game-paint exec vitest run` | **0** | 224 passed / 15 files |
| 2 | `pnpm --filter @domigo/game-paint exec tsc --noEmit` | **0** | (see the catch below) |
| 3 | `pnpm --filter web exec tsc --noEmit` | **0** | |
| 4 | `node scripts/check-story-grounding.mjs` | **0** | prologue, beats, headers, boss, game tasks grounded + in register |
| 5 | `node scripts/check-design-sheets.mjs` | **0** | 5 paint sheets, corpus ids + sections + register green |
| 6 | `node scripts/check-paint-art.mjs` | **0** | 54 required stems present, **allowlist at ZERO** |
| 7 | `node scripts/check-game-tasks.mjs` | **0** | 43 tasks: schema, grounding, giveaway, register green |
| 8 | `pnpm --filter web build` | **0** | |
| 9 | `node scripts/check-game-bundle.mjs` | **0** | 37 chunks · **Phaser in EXACTLY 1 chunk, 310 KB gz** · largest non-Phaser 93 KB · no shared-chunk leak |
| 10 | `node --experimental-strip-types scripts/record-paint-tape.mjs` | **0** | **ALL GREEN**, 5/5 exits |

**Gate 2 caught a real defect that the tests could not.** The first W7 run failed typecheck:
`pose.test.ts(62,80): error TS2353 — 'skin' does not exist in type 'Partial<EntPoseInput>'`. My
guardian test helper passed a `skin` field the pose hook does not take. Vitest does not
typecheck, so all 224 tests were green over a type error. Fixed by dropping the field (the hook
is skin-blind by design — it returns the *state* cell and `entTex` resolves it against whatever
skin the entity wears), and gates 1 and 2 re-run clean. Worth keeping in mind: on this package,
green tests are not evidence of a green typecheck.

**Determinism, proven rather than assumed.** Gate 10 re-recorded all five tapes from scratch;
`git status content/` came back **empty** afterwards — the regenerated proof file is
byte-identical to the committed one. Same pilots, same masks, same bytes.

**Browser proof.** All five phases booted by id after a full reload on a nuked `.next`, each
with **0 console errors**: p1 Die Eingangshalle · p2 Das Klassenzimmer bei Nacht · p3 Der
Schulhof-Garten (slide art confirmed at all six `z` cells) · p4 Die Tafel-Bühne · p9 Die
Kleckskammer. Screenshots are in the PR body's evidence list.

**Docs updated.** `docs/design/g1/paint/grids-v2/README.md`'s "Still pending" section was stale
the moment PK-3 landed — rewritten to say what actually shipped, to record that the design file
and the live level are kept deep-equal (edit the grid, re-splice; never edit the live level
directly), and to carry F-4/F-5/F-6 forward.

**PR.** `pb-d2-grids` → `main`, opened, **not merged** — the merge is Koki's.

---

## Closing summary — what Build-D actually delivered

Three packets, four commits, every gate green, and **three defects caught by evidence rather
than by assumption**:

1. **PK-1's `pit_inner_tile` overwrite re-opened F13.** Caught by looking at the first p1
   screenshot, diagnosed by measuring the art (1024² @ 100 % opaque → 512² @ 27.7 % with empty
   bands), fixed by deferring the cell, and generalised by checking all 14 overwritten stems for
   the same class (it was the only one).
2. **A type error hiding under 224 green tests** (W7 gate 2).
3. **Two of my own measurements were confidently wrong** before I checked them: a WebGL canvas
   read back all-black (so "0 brown pixels" was a false negative), and TileSprites carry UUID
   texture keys (so "0 ice strips" was too — they were all six there, confirmed by geometry).
   Both are banked as pitfalls in the PK-2/PK-3 entries.

The one thing this session did **not** do is judge whether any of it looks or feels right.
Nothing here has been played by a human. Fable's review checklists (passover §6) and Koki's
chapter-1 replay are the remaining gates, and the three open findings — F-4 (ch01 has no
mass-fill art cell), F-5 (`tafel_roll` has no sim state), F-6 (the arena far plate does not
span p4) — are decisions for them, not silent fixes for me.

---

# ★ FABLE REVIEW — Build-D (PR #234), 2026-07-26

**Verdict: MECHANICALLY SOUND → MERGE as the foundation. VISUALLY: fails the
composition standard → the next campaign (doc 36) reworks the look on top of it.**

Re-verified independently (all on my machine, this session): 224/224 tests · tsc both
packages · check-paint-art (54 required / 152 on disk) · game-tasks · grounding ·
design-sheets · allowlist = [] · **splice machine-diff vs the assembled source: ZERO
field deviations** across all five blocks · invariants re-counted (7 cages, exactly one
person-cage = Merle, p1 = 6 entities per A-7) · thin-renderer greps clean · **the tape
gate proven red-capable** (zeroing a jump run in the p3 tape → red; restore → green).
One instructive false alarm, recorded for the method: zeroing the LONGEST movement run
did NOT go red — because that run rides the slide, where input is redundant BY DESIGN
(the z-push works uninputted). A tamper that tampers nothing proves nothing; check the
check, in both directions.

Executor calibration (dial-sheet log): scope discipline excellent (three taste items
correctly flagged-not-fixed; deferrals per A-8; no silent expansions), honesty
excellent (self-disclosed two false measurements + own defect classes), report shape
per template. The visual failure is NOT an executor failure — the packet delivered the
commissioned model faithfully; the MODEL was wrong, and that is a commissioning
(Fable-side) defect. Answered here: the three open decisions from the wrap-up — (1)
deep filler → replaced by the §2 mass model (Batch AF); (2) `tafel_roll` unused → the
guardian GAINS motion in PK-C3 (gate verdict G4 demands a MOVING Tafel); (3) the p4
plate edge → the §3 cover-fit law (PK-C1).

**Next campaign: THE COMPOSITION REWORK** — law: [doc 36](36_composition_law.md) ·
engine passover: `PLATFORM MASTER/SESSION-PROMPTS/PASSOVER_PB_COMPOSITION_2026-07-26.md`
· art commission: `~/Code/codex-art-lab/CODEX_MASTER_PROMPT_AF_COMPOSITION.md`.
Koki's replay gate MOVES to after the rework (playing the current look would only
re-confirm the screenshots).

---

# ★ PK-C1 · THE COMPOSITION ENGINE (doc 36 §1–§4) — DONE

**Branch `pb-c1-composition`, two commits, art-independent.** The governing brief is
`PLATFORM MASTER/SESSION-PROMPTS/PASSOVER_PB_COMPOSITION_2026-07-26.md`; the law is
[doc 36](36_composition_law.md). Build-D (#234) merged first as the mechanical
foundation (`e4aa356`), exactly as the passover requires.

## What was built

**1 · The layer compositor (§1).** The plate+band backdrop is replaced by five planes:
L0 air (an engine-drawn 3-stop wash, parallax 0.05) · L1 far shell (tiling segments,
0.25) · L2 mid furniture (0.5) · L3 play (the existing world, 1.0) · L4 foreground
(1.2, now drawn IN FRONT of the player at depth 12, where the pre-C1 "near" band sat
at depth 0 *behind* the terrain). Driven by a per-phase **composition manifest**.

**The manifest location — decided, and why.** A sidecar TS map
(`packages/game-paint/src/composition.ts`), NOT a level-schema block. The live level
JSON is kept deep-equal to `docs/design/g1/paint/grids-v2/` ("edit the grid,
re-splice"), so art direction there would have to be authored twice and zod-typed a
third time, for data no level law reads. TS also buys types, headless unit tests, and
CI importability — `check-paint-art.mjs` now imports it, so **a phase's composition
DEMANDS its own art** (required stems 54 → 106).

**2 · The mass renderer (§2).** `mass.ts` plans crust runs with **flush** end caps,
edge trims, outer/inner corners, seamless body → fade → sediment by depth, drawn ramp
masses, the `z` slide as ONE chute, and floating platforms (≤4 cells, air above and
below) as **complete objects** covered widest-first from a palette — never stretched,
never crust-on-fill. The pre-C1 strip path survives untouched as the no-kit fallback,
and a phase whose kit art has not landed falls back to it automatically.

**3 · The placeholder kit.** `scripts/gen-placeholder-kit.mjs` emits **53 labelled
flat-tone PNGs** (235 KB total, byte-deterministic — `--check` re-verifies) at the
EXACT Batch-AF geometry contract (1024×1260 L1 segments, 2048×384 keyed bands, 512
mass cells, 1024×512 slide modules), each stamped with its own stem name and the word
PLACEHOLDER. Two properties beyond "coloured boxes": a screenshot answers "is the cap
flush?" by *reading the picture*, and every piece is generated **at its law-mandated
value band**, which is what let the audits arm for real instead of waiting for paint.

**4 · Cover-fit (§3)** — see the defect section; **5 · letter glyphs (§3)**:
`prop_letter` is a painted capital **A**, so it could only ever spell A. Retired from
the letter face (and from `GLYPH_STEMS`); the engine now draws the real character into
a per-character canvas texture in that stem's key (warm gold gradient, amber contour,
soft shadow). Characters come from the manifest's `words`, else a deterministic A→Z
walk in traversal order.

**6 · The four audits** — `scripts/check-composition.mjs`, one command, four named
audits, **each seen RED by deliberate tamper before being trusted**:

| audit | tamper | result |
|---|---|---|
| layer-value (ramp) | point p1's L1 at an L2-band piece | **exit 1** — "no depth ramp — L1 (54.4%) must be lifted above L2 (54.4%)" |
| layer-value (separation) | point L2 at the mass body | **exit 1** — "separation 1.6% lum / 0.1% sat — the law needs ≥12% or ≥25%" |
| coverage | shrink L1's height to 40 px | **exit 1** — "does NOT cover the camera travel box" |
| no-naked-fill | make the planner skip the fade band | **exit 1** — "62 solid cell(s) with NO mass covering them, first at (0,21)" |
| glyph | give p1 `words: ["A"]` | **exit 1** — "all 8 letters render the SAME character" |
| art gate: placeholder deadline | set `PLACEHOLDER_UNTIL` to a past date | **exit 1** — "53 PLACEHOLDER stems are still wired" |
| art gate: composition stem | delete `ph_slide_mid.png` | **exit 1** — "missing stem … needed by ch01.level.json p3 composition" |

All restored; `git diff --stat` clean after every tamper.

**Why the audits measure SOURCE PIXELS and PLAN ARITHMETIC, never a canvas.** PK-2
banked it: a WebGL canvas without `preserveDrawingBuffer` reads back all-black, so
canvas sampling yields confident false negatives. Composition/mass/letters are pure
planners; the scene only places what they return. That is also what made the tampers
meaningful.

## ★ Two defects the BROWSER caught — one of which every audit was blind to

**D-1 · the parallax window was modelled wrong, and the audit was green anyway.**
The first p1 screenshot showed the far shell stopping at 87.5 % of the viewport with a
cream strip beyond it — while coverage was green. Cause: `PaintScene.render` points
the camera with `centerOn()`, and Phaser's `centerOn` divides by the camera's **pixel**
width (1056) while `scrollX` is in **world** units; under zoom 3 that leaves a constant
offset, `scrollX = camX − 352`. Measured live: camX 0 → scrollX −352 → the 0.25 plane's
window is **[264, 616], not [0, 352]**. So the requirement is not `view + maxCam·p`;
it is `(maxCam − K)·p + K + view` with `K = LOGICAL_W·(RENDER_SCALE−1)/2`. L1 spanned
572 px where it needed 784. Fixed by deriving the window from the scene's own constants
(`K_X`/`K_Y`, `visibleWindow`, `coverBox`) and sizing the far shell by the cover law
itself; L1 now spans 1064 px, and `visibleWindow(0, 0.25) === [264, 616]` is pinned by
test. **This is the lesson worth keeping: a pure-geometry audit that invents its own
model of the renderer will certify its own fiction (P-18 again, one layer down).**

**D-2 · phantom inner corners at the world edge.** `glyphAt()` reports outside-the-grid
as SOLID, so the inner-corner probe fired on every ground run starting at column 0 — a
magenta trim floating at the left edge of p1. Bounds-checked; regression test added.

## Gates (unpiped, real exit codes, final tree)

| # | command | exit |
|---|---|---|
| 1 | `pnpm --filter @domigo/game-paint exec vitest run` | **0** — **255 passed** (224 + 31 new) |
| 2 | `pnpm --filter @domigo/game-paint exec tsc --noEmit` | **0** |
| 3 | `pnpm --filter web exec tsc --noEmit` | **0** |
| 4 | `node scripts/check-story-grounding.mjs` | **0** |
| 5 | `node scripts/check-design-sheets.mjs` | **0** |
| 6 | `node scripts/check-paint-art.mjs` | **0** — 106 required stems (was 54) |
| 7 | `node scripts/check-game-tasks.mjs` | **0** |
| 8 | `pnpm --filter web build` | **0** |
| 9 | `node scripts/check-game-bundle.mjs` | **0** — Phaser in **exactly 1 chunk, 310 KB gz** |
| 10 | `node --experimental-strip-types scripts/record-paint-tape.mjs` | **0** — ALL GREEN, `git status content/` **empty** afterwards |
| 11 | `node scripts/check-composition.mjs` (NEW) | **0** — 4 audits over 5 phases |
| 12 | `node scripts/gen-placeholder-kit.mjs --check` (NEW) | **0** — 53 pieces byte-identical |

**THE SIM DID NOT MOVE.** Gate 10 re-recorded all five tapes from scratch and
`content/` came back clean — byte-identical proof file, same pilots, same masks.

## Browser proof (nuked `.next`, reload + pump dance per phase, 0 console errors)

- **p1** — five planes visible and value-ramped; crust course with caps; body/fade/
  sediment mass below; complete platform objects; letters **A B C D** as distinct gold
  characters. L1 span [0, 1064] ≥ the 784 required.
- **p4 at camX = maxCamX (224)** — the exact F-6 condition. **Covered edge to edge; the
  cream void is gone.** L1 window [320, 672] inside its [0, 703] span.
- **p3** — the slide renders as **ONE unbroken 45° chute**: `slide_top` (160,240) →
  `slide_mid` (192,272) → `slide_foot` (224,304), each 45 px long × 32 px thick (the
  law's "2 cells wide") at rot 0.785 rad, over **6** under-struts. Not stepped blocks.
- **p2** — furniture band with rim-light behind the play line, platform objects, A/B/C.
- **p9** — **twelve letters D…K, all distinct**, every floating platform a complete
  object with a drawn underside; no L2 band, which is A-8's stated design.

## Honesty clause — what I did NOT verify, and what is NOT mine to judge

- **Nothing here is painted art.** Every plane and every mass piece on screen is a
  stamped placeholder. Whether the composition is *beautiful* is Fable's and Koki's
  call; PK-C2 replaces the art and re-runs the §4.5 checklist against it.
- **The absolute §1 value bands are printed, not armed** — see F-7 below. Armed
  instead: the ramp direction and the L2↔L3 separation law, both key-independent.
- **No human has played this.** The tapes prove the sim is unchanged, not that the new
  look plays well.
- The L4 foreground plane exists and is proven, but AF commissions **no L4 art**, so it
  wears a generic fringe placeholder (F-9).

## Findings — reported, not silently fixed

- **F-7 · doc 36 §1's L0 band contradicts the AF palette card.** The law puts L0 AIR at
  82–95 % lightness; the AF prompt commissions p2 as "deep blue-violet air", p4 as
  "stage-dusk" and p9 as "indigo-black". Measured now: p1 90.4 % · p3 85.8 % (in band)
  vs **p2 28.1 % · p4 26.5 % · p9 15.0 %**. No measure rescues a night room into that
  band — the bands describe a day-lit key. **Codex is about to paint 19 sheets against
  this law**, so it is worth resolving before the batch, not after. Recommendation:
  restate §1's bands as offsets from each phase's own key, keeping the widths.
- **F-8 · the mid/foreground bands anchor to the GRID BOTTOM, not the ground line.**
  On tall phases (p3 is 26 rows) that parks the furniture band well below the play
  surface. The manifest has a `lift` field; the honest fix is a per-phase horizon value
  in PK-C2, once real bands exist to place.
- **F-9 · Batch AF commissions no L4 art** (19 files: 5 L1 · 4 L2 · 7 mass · 1 slide ·
  2 platform). The foreground plane is built and proven but has nothing to wear.
- **F-10 · the AF prompt's group 4 names no FILE for the slide sheet**, and group 5's
  "wall shelf … 1.5 cells centered in a 2-cell span" at cell index [2] of a 4-cell sheet
  is ambiguous. Both need one line each before the batch is commissioned.
- **F-11 · the ch01 letter trails were never laid out for the trail-word law.** The
  design sheet says each breadcrumb run spells a real u01 word held at its end; the
  live grids place p1 7+1 · p2 5+3 · p3 1+3+1+1+1 · p9 12 loose breadcrumbs, and no
  `obj_*` vocab prop is placed at any trail's end. Only p2 happens to fit (RULER + PEN).
  I did NOT invent words — the engine takes them from the manifest and falls back to
  A→Z. Filling `words` needs a grid re-lay, which is content, not wiring.

**Commits.** `5325b56` the composition engine · `fb3fe0e` the two browser-caught defects.

---

# ★ FABLE REVIEW 2 — PB-C1 (PR #235) + Batch AF, 2026-07-26

## PR #235 — VERDICT: APPROVE (merge after the v1.1 law commit riding on this branch)

Re-verified independently: 255/255 tests · tsc both packages · check-paint-art (106
required / 205 on disk) · **check-composition: 4 audits green** and — the tamper test —
removing one placeholder plane piece turns it RED loudly ("art missing — cannot
measure"), restore → green · **sim files untouched** (diff vs main: zero sim-path
files) · **tapes byte-identical to main** (the "logic untouched" claim machine-proven)
· scope scan of all 64 files: nothing outside the expected areas. Browser (own eyes,
placeholder mode): the p3 slide is ONE continuous ramp with distinct letter glyphs
B/C/D/E on the trail; the arena's far-right camera stop shows planes to the very edge
(the cream void is dead); five planes visibly separate even in flat tones.
The self-caught camera-model defect (a checker inventing its own arithmetic model
confirms its own fiction) is a lesson worth keeping — the fix (derive audit maths from
the game's own numbers) is the right class.

**The escalated contradiction was REAL and is RESOLVED as doc 36 v1.1** (committed on
this branch, `24275c8`): value bands are now MULTIPLICATIVE in the phase's declared key
K (daylight numbers reproduce exactly; night rooms lawful; the L2↔L3 separation law
stays absolute). PK-C2 arms the audit's relative thresholds from the manifest keys:
p1 88 · p3 86 · p2 30 · p4 28 · p9 16.

## Batch AF (19 sheets) — machine audit + Fable eye pass

Machine audit (`~/Code/codex-art-lab/audit-batch-af.py`): **14/19 clean.** All five
findings are the SAME class — the dark phases painted bright (l1_p2 L71 % vs band
24–30 · l1_p4 L70 % vs 22–28 · l1_p9 L82 % vs 13–16 · l2_p2 L36 % vs 15–22 · l2_p4
L37 % + S57 % vs 14–21/≤50): the pre-v1.1 contradiction made pixels, not a craft
failure. Eye pass highlights: `mass_body` = the carved-book law exactly (strata, fade,
ink sediment — the soil is dead); `plat_a` = complete objects with drawn undersides and
brackets; `l1_p1_hall` = correct washed atmosphere, flat-on window (blue coat a touch
saturated — minor). **One BLOCKER that is a Fable spec error, not a Codex error:** the
slide sheet's modules were commissioned at 1024×512 — a full-width diagonal in a 2:1
box is ~27°, and the level's `z` diagonal is 45°; the painted modules cannot tile along
it. Also two floating chalk-dust puffs (minor halos).

**FINAL DISPOSITIONS (machine + Fable eyes + adversarial critic, reconciled):
ACCEPT 5 · RE-RUN 8 · FIX-CELL 6** — all corrections commissioned as
`CODEX_MASTER_PROMPT_AF2_FIXES.md` (15 sheets into `batch-af2/`, which SUPERSEDES
same-named AF files; the 5 accepted anchors: l1_p3*, l2_p1, l2_p3*, mass_body,
crust_p1 — *conditional fixes ride in AF2 as light re-runs).

The adversarial critic's pass (full table:
scratchpad study/af-critic-review.md, 19/19 sheets) caught four classes my machine
audit could not see — each now encoded in AF2's global laws:
1. **Tiles painted as inset portraits** (4 of 5 crusts + all edges/corners: 9–26 px
   key margins → a hole in the floor every cell; seam checkers see pure-key columns
   as "equal"). AF2 law 2 + the red-background tiling self-check.
2. **The clamp root cause**: Codex applied the value bands as HISTOGRAM CLAMPS, not
   mean targets (every L1 hard-clamped to [70.0, 87.8] — even the passing daylight
   sheets lost their wainscot/hook-rail legibility; l1_p4's range crushed to 20 levels
   = unrecoverable). AF2 law 1 ("bands are MEAN targets, paint real contrast around
   them"); the old prompt's group headers are de-poisoned and the file marked
   superseded.
3. **Stretch-smear seam gutters** on all five L1 sheets (8–71 px blurred scars
   repeating every 1024 px). AF2 law 3 (painted continuity).
4. **Angle mismatches**: slide 29°, slope cells 36° vs the game's 45° — partly MY
   commission bug (1024×512 modules cannot hold 45°); AF2 groups C/D fix the spec
   (square modules, true-45 slope cells, edges re-authored as stackable tiles in a
   neutral parchment register).
Also resolved: three affordance hits were MY commissioned content (drainpipe, climbing
dome, p4 shelf courses) — quarantine mitigations now explicit in AF2; l2_p2's
near-white globe ring (machine-invisible value spike) removed; l2_p4 repainted in the
house medium (the one style-alien sheet). Positive: zero soil/earth anywhere in the
batch; mass_body + crust_p1 + plat undersides = the law fulfilled.

## Wiring notes for PK-C2 (read before importing)

- **Platform anchoring:** `plat_a`'s bench has a backrest ABOVE the walk deck — the
  renderer must anchor platform sprites by their STANDABLE LINE (deck), not the sprite
  top. Add per-object anchor offsets to the import metadata; verify by standing the
  player on every platform object in the browser.
- The slide's under-strut is a wooden apparatus (accepted design): slide modules sit ON
  body-mass; the strut mediates. Place struts under every mid module.
- Group-4 file is `slide/chalk_slide.png` (the AF prompt forgot to name it — Codex's
  choice adopted; AF2 keeps it).

---

# ★ PK-C2 + PK-C3 · THE PAINTED WORLD (Batch AF wired) — DONE, with ONE BLOCKED ITEM

**Branch `pb-c2-composition-art`, one commit, on top of the merged PB-C1
(`758f793`).** Trigger: Koki dropped Batch AF in `~/Code/codex-art-lab/batch-af/`
— **exactly the 19 commissioned files**, and every one at the commissioned
geometry (L1 2048×1260 unkeyed & 100 % opaque · L2 2048×384 keyed · mass cells
512 · slide 2048×1024 · platforms 2048×512). `mass_body.png` measured **0.00 %
magenta, 100 % opaque** — the reject rule that bit Build-D is satisfied.

## The import (56 stems)

`docs/art/import-batch-af.mjs`, same pipeline as batch-ac (tol-40 key → 3-pass
defringe → alpha audit), plus a **third write mode the AF geometry forces**:

- **`plate`** — as-is. The L1 segments are commissioned UNKEYED and opaque; the
  four `mass_body` cells ARE the 100 %-opaque interior. Keying or trimming
  either is destructive.
- **`band`** — key → defringe → crop VERTICALLY, full width kept. The crust
  loops/caps and the L2 bands are painted as a horizontal band inside a taller
  cell (`crust_p1` occupies y 144–356 of 512; `l2_p1` y 101–333 of 384) and the
  renderer scales them from SOURCE HEIGHT — so an untrimmed cell would render
  the art at ~40 % of its slot with transparent gaps above and below. **One
  shared crop per sheet**, or the caps float off their loop.
- **`sprite`** — full content trim, for the discrete objects (edges, corners,
  ramps, the slide's under-strut, the platform objects).

Verified: re-run **byte-identical**; TAMPER (hide `mass_body.png`) → **exit 1**,
"source sheet MISSING"; restored byte-identical.

## The geometry the delivered art forced

**★ Caps lap INWARD.** Measuring every cell's content box before writing the
import table showed `crust_pN` cell[2] content starting at x 33 and cell[3]
ending at x 478 — the caps are painted as SEGMENT ENDS (a rounded end plus a
stretch of the same course), not as outboard bookends. So a cap is now laid ON
the run's last stretch with its **outer edge exactly on the run's outer edge**,
at the art's own aspect (41 px at CRUST_H 17): the rounded end lands on the
terrain boundary and the remainder blends into the identical loop beneath.
A run too short to hold two caps gets edge trims instead of squashed caps.
Crust is **0.5 H** (17 px) per the scale law; platform objects are sized by the
span they fill with the painted aspect preserved, and alternate between
same-width objects so a level of 2-cell ledges is not a level of benches.

`planMass` now takes an optional `srcSize` lookup, so the plan reads real art
geometry instead of assuming squares — the same shape `planLayers` already had.

## PK-C3 · the Tafel MOVES (gate verdict G4)

The campaign's one gameplay change. `GUARDIAN_SCRIPT` gains `rollSpeed`,
`rollRangeTiles`, `rollTicks`; after every throw the guardian enters **`roll`**
and crosses to the opposite station, direction derived from which side of home
it currently stands on — **no randomness**, so the fight stays reproducible tick
for tick. `entPoseCell` maps `roll` → the `tafel_roll` cell (Build-D's F-5 is
closed: the painted cell finally has a state).

**Proven in the LIVE game**, not asserted: stations at **216 / 280 / 344**, a
full **128 px** crossing = 2 × 4 tiles, transitions
`idle@280 → telegraph → roll → idle@344 → telegraph → roll → idle@216`.

**★ The proof tape did NOT change, and that is worth understanding.** Tapes
record the PLAYER'S INPUT PADS, not world state, so the p4 tape still replays
byte-identically at 5076 ticks — it proves the arena is still completable with
the same inputs, and it proves NOTHING about the guardian's motion. That is why
the motion needed its own live playtest plus four unit tests (enters roll,
crosses and settles, alternates, deterministic double-run).

## Two defects the LIVE PLAYTEST caught

- **D-3 · the far shell was scaled to the WORLD, not to its visible envelope.**
  A slow plane's window barely moves (the far shell's vertical window shifts
  ~11 px across a whole level), so padding the box out to the world's own bounds
  made the plane ~1.8× too tall — and since a segment's width is derived from
  its height, p1's commissioned window bay and coat rail sat **above the top of
  the screen** and the wall read as empty plaster. `coverBox` now returns the
  exact envelope. The first screenshot is what found it.
- **D-4 · the roll's safety-net timeout could not cover a crossing.** 260 ticks
  at 0.375 px/tick = 97 px, but station-to-station is 128 px, so the Tafel
  stranded at **246** instead of its **216** station. Speeds raised and the cap
  set to 320 for every tier; a test now pins the station set to exactly
  `{home−range, home, home+range}`.

**Harness pitfall banked (cost ~15 min).** `P.step(ms)` takes **milliseconds**,
not ticks, and `PaintScene.update` clamps to `MAX_TICKS_PER_FRAME` (4) per call
— so `P.step(20)` advances ~1 tick, and a loop of 60 of them is ~72 ticks, not
1200. A guardian on a 150-tick throw timer looked completely inert. Movement
proofs need `step(100)` × N. (`rafStep` is worse for this: it follows real
wall-clock, so a synchronous burst barely ticks at all.)

## Gates (unpiped, real exit codes) — 11 of 12 green, ONE HONESTLY RED

| # | command | exit |
|---|---|---|
| 1 | `vitest run` (game-paint) | **0** — **263 passed** (+5 guardian, +1 envelope) |
| 2–3 | `tsc --noEmit` ×2 | **0** |
| 4–7 | grounding · sheets · paint-art · game-tasks | **0** |
| 8 | `pnpm --filter web build` | **0** |
| 9 | `check-game-bundle` | **0** — Phaser in exactly 1 chunk |
| 10 | `record-paint-tape` | **0** — ALL GREEN, `content/` clean afterwards |
| 11 | `check-composition` | **1** — see BLOCKED below |
| 12 | `import-batch-af` re-run | **0** — byte-identical |

## ★ BLOCKED: the night phases fail the separation law

The armed L2↔L3 separation check (doc 36 §1, key-independent) **fails on p2 and
p4** and passes comfortably on p1/p3:

| phase | Δlum | Δsat | verdict |
|---|---|---|---|
| p1 Eingangshalle | 21.9 % | 13.1 % | PASS |
| p2 Klassenzimmer bei Nacht | **4.0 %** | **4.9 %** | **FAIL** (law: ≥12 % or ≥25 %) |
| p3 Schulhof-Garten | 18.8 % | 25.7 % | PASS |
| p4 Tafel-Bühne | **9.8 %** | **2.1 %** | **FAIL** |

I checked whether my instrument was at fault before calling it: sampling L3 as
terrain-only vs. the law's own definition (terrain **+ entities +** props) makes
p2/p4 *slightly worse*, not better. **They fail by any faithful reading.**

**But on screen the enemies still pop.** The executor pop test at real positions
shows the pen and the boy separating clearly from p2's purple desks, and the
Tafel from p4's blue audience — the separation is doing its work through crisp
L3 outlines and hue, which a plane-MEAN test cannot see. So the honest report is:
*the law's numeric rule and the delivered art disagree, and the visual outcome is
acceptable.* I did **not** weaken the check to make my own gate green.

**Root cause is F-7, now demonstrated rather than predicted.** Doc 36 §1's
absolute bands are day-lit-room numbers, so Codex painted the night/dusk shells
INTO them: `l1_p2_night` measures **71.2 % lum / 4.3 % saturation** and
`l1_p9_ink` **82.2 % / 6.0 %** — a "deep blue-violet" and an "indigo-black"
cannot be 4–6 % saturated. On screen p2 and p4 read as **daylit rooms in fog**,
which the screenshots show plainly. The engine-drawn L0 wash carries the real
night key but is entirely hidden behind the too-light L1.

**Two ways out, Fable's call:** (a) amend §1 so the bands are offsets from each
phase's own light key (same widths) and re-issue the 3 night L1 sheets + 2 night
L2 bands against it; or (b) keep the absolute bands and accept a day-lit
chapter. I did not tint the planes to fake (a) — that would change commissioned
art silently and hide the question.

## Composition checklist (law §4.5), self-run per phase

| | p1 | p2 | p3 | p4 | p9 |
|---|---|---|---|---|---|
| scale statement obeyed | ✓ | ✓ | ✓ | ✓ | ✓ |
| silhouette pop (on screen) | ✓ | ✓ | ✓ | ✓ | — |
| caps flush | ✓ | ✓ | ✓ | ✓ | ✓ |
| slide reads as a slide | — | — | ✓ | — | — |
| no naked fill | ✓ | ✓ | ✓ | ✓ | ✓ |
| cover-fit everywhere | ✓ | ✓ | ✓ | ✓ | ✓ |
| **value key correct** | ✓ | **✗** | ✓ | **✗** | **✗** |

## Honesty clause

Nobody has PLAYED this. The tapes prove the level is still completable with the
same inputs and the unit tests prove the guardian's machine; neither proves the
fight feels good with a moving Tafel — that is Koki's replay. Whether the
painted composition is *beautiful* remains Fable's and Koki's call; I report
that p1 and p3 look transformed and p2/p4/p9 look wrongly lit, with numbers.

## Findings carried forward

- **F-7 (now evidenced, BLOCKING for 3 phases)** — see above.
- **F-9 · Batch AF commissions no L4 art.** The foreground plane is built and
  tested but is UNWIRED in ch01 rather than left on a stamped placeholder.
- **F-10 · the AF prompt named no file for the slide sheet** — Codex chose
  `chalk_slide.png`; the group-5 "1.5 cells centered in a 2-cell span" wording
  resolved in practice to a 1-cell shelf. Both should be pinned in the prompt.
- **F-11 · the letter trails still have no words** (unchanged; content).
- **F-12 · the p1 L1 "hanging coats as soft masses" read as pale translucent
  cones** at play scale. Taste call, flagged not fixed.

**Commit.** `97a5906`.

---

# ★ FABLE REVIEW 3 — PK-C2/C3 (PR #236), 2026-07-27 (Koki AFK; review + routing on his behalf)

## Verdict: HOLD #236 OPEN — plumbing and the moving Tafel are APPROVED; the art input
## was incomplete through no fault of the executor. One more packet (PK-C2b) finishes
## the SAME PR; then a fast re-review and ONE merge.

**The timeline fact that reframes everything:** PR #236 was opened 2026-07-26 23:09;
**Batch AF2 landed 2026-07-27 00:28** — the corrected art arrived ~80 minutes AFTER the
work was done. The session wired the only batch that existed (raw AF). Not a fault.

**What I verified and approve:** the import/manifest plumbing; the p3/p1 look with my
own eyes on the branch (the wall is a washed flat-on room, the ground a carved
book-mass with paving crust, the slide one chute, letters real glyphs — doc 36 §0's
three failures are dead in the daylight phases); **the Tafel moves** (G4) with the
stranding bug found by live playtest, not by tapes; the placeholder path removed; and —
worth naming — **the executor left its own gate RED rather than soften it to look
finished, and tamper-checked its instrument before trusting the failure.** That is §6
of the method, lived.

**The two real misses (both small, both now routed):**
1. **Law state mis-read.** Doc 36 v1.1 (KEY-relative bands) and the AF dispositions
   (5 accept / 8 re-run / 6 fix-cell) were on main via #235 — the report re-litigated
   the "absolute vs relative" decision as open and proposed as option (a) exactly what
   v1.1 already is. The audit's `BANDS` were left at the v1.0 absolute numbers,
   "reported, not armed", although the passover's PK-C2 step said to arm the relative
   thresholds from the manifest keys. Root cause class: a continuation session trusting
   its prior-session memory over a boot re-read of the state surfaces — the exact
   long-horizon trap the dial sheet names. The passover trigger also gets a HARD STOP
   line now (mechanical, not narrative).
2. **The "night call" it asked Koki to make does not exist.** (a) is done (v1.1,
   merged); the five repainted dark sheets PLUS the geometry fixes are already in
   `batch-af2/` (15 sheets, delivered 00:28). Nothing to decide — only to wire.

**Confirmed on screen (matches the AF critic's measurements):** the daylight crust
lines break at cell intervals (the inset-island voids — crust_p3 was wired from AF;
AF2 closes the loops); the p3 ink region reads as an alien navy slab (rim treatment
rides the AF2 wave + a wiring look); the checkpoint easel floats above the leaf band
(anchor check for PK-C2b). Night phases (p2/p4/p9) are the known AF-clamp fog; their
AF2 repaints exist and are unwired.

**Banked method finding (the executor's own words, promoted to law):** *proof tapes
record button presses, not the world* — the arena tape came back byte-identical after
the guardian gained motion, proving nothing about the guardian. Follow-up (not in this
PR): extend the tape schema with world assertions (guardian-down tick, cages freed,
knot count at exit) so tapes can see behavior again. Until then: any behavior change =
mandatory live machine playtest (as done here — it caught the stranding).

## THE NEXT PACKET — PK-C2b (same branch `pb-c2-composition-art`, same PR #236)

1. Boot per the passover §0 (RE-READ doc 36 v1.1 §1 amendment + this review — do not
   work from memory of the C1/C2 sessions). Branch already checked out; `git pull`.
2. **Re-import with AF2 priority**: the import source rule is `batch-af2/` where a
   file exists there, else `batch-af/` (AF2 carries 15 corrected sheets: 5 L1, 3 L2,
   5 mass incl. edges_corners re-authored + true-45° slopes, the 512×512 45° slide,
   2 platform sheets re-seated). Expected overwrites: every AF2-named stem. Run the
   red-void tiling spot-check on two imported crusts (place two loop tiles side by
   side; no gap).
3. **Arm the layer-value audit at v1.1**: `BANDS` become functions of the manifest key
   K per doc 36 §1 (L0 0.93–1.08K ≤96 · L1 0.80–1.00K · L2 0.50–0.75K · L4 ≤0.45K;
   keys p1 88 · p3 86 · p2 30 · p4 28 · p9 16). L2↔L3 separation stays absolute.
   Tamper-check: mis-declare one phase key → audit red → restore.
4. Re-run ALL audits + the full gate set; the L2↔L3 red on night phases is expected to
   turn GREEN with the AF2 dark sheets. If any phase still fails, report the numbers —
   do not soften, do not re-tune the law.
5. Fix the two wiring anchors seen in review: the floating checkpoint easel in p3
   (anchor it to its platform's standable line), and confirm platform objects anchor
   by DECK line (plat_a bench backrest above the walk surface).
6. Composition checklist per phase (law §4.5) + full-phase screenshots after reload +
   pump dance; append the PK-C2b log entry here; MC update; push. Fable re-reviews,
   then Koki merges ONCE.

---

# ★ PK-C2b · THE FINISHING PACKET (Batch AF2 wired) — DONE, 2 marginal failures reported

**Same branch `pb-c2-composition-art`, same PR #236** (no new PR, per REVIEW 3).
Brief: doc 35 § FABLE REVIEW 3 items 1–6 + doc 36 §1 **v1.1**, both re-read FROM THE
FILES. The passover itself had been amended at 01:28 with a CONTINUATION NOTE I had
not seen — re-reading it rather than trusting session memory is what surfaced this
entire packet. That is miss #1 from REVIEW 3, not repeated.

## HARD STOP checks (the new mechanical rule) — both PASS, one discrepancy logged

1. **Batch folders vs the commission's file list.** `batch-af2/` holds exactly the
   enumerated set: 5 L1 (p1,p2,p3,p4,p9) · 3 L2 (p2,p3,p4) · 5 mass (crust_p2/p3/p4/p9
   + edges_corners) · 1 slide · 2 platforms. **Note:** the prose says "15 sheets" but
   the enumeration sums to **16**, and the folder matches the ENUMERATION 1:1;
   likewise "4 AF originals import unchanged" is actually **3** (l2_p1_hall, mass_body,
   crust_p1 — l1_p3/l2_p3 both exist in AF2, so AF2 wins). Prose count typos; the RULE
   (af2 where present, else af) is unambiguous and mechanical, so the check passes.
2. **Disposition.** REVIEW 3 names the exact accepted/superseded split and approves
   wiring. PASS.

Result of the rule: **46 stems from AF2, 9 from AF** (55 total — two AF-only platform
stems retired, see below).

## Two sheets changed CONTRACT — both caught by measuring cells BEFORE wiring

- **The slide is now TRUE-45° CELLS.** AF authored four 1024×512 modules to be laid
  along one diagonal; AF2 authored four **512×512** modules in the sheet's left half,
  each drawn corner-to-corner so **one module IS one `z` cell** and the under-strut is
  that cell's triangular wedge. Wiring AF's layout to AF2's sheet keyed two cells to
  nothing (caught by the importer's own alpha audit, exit 1). The renderer now places
  one module per cell — no rotation, no along-diagonal stepping, no seams to chase —
  and the importer carries a **per-batch layout override** so both contracts work.
  Live: 6 modules on p3's 6 `z` cells, each 16×16 at rot 0.
- **plat_a was RE-SEATED.** Column-occupancy measurement shows AF2 has only **two**
  objects (bench x 39–984, shelf x 1107–1963 — 2 cells each), not AF's bench+shelf+
  column. The old table would have **split the shelf down the middle and shipped two
  half-shelves as separate platforms.** New stem `plat_shelf_2`; `plat_shelf_1` and
  `plat_column_1` retired.

## The two anchors from REVIEW 3

- **Platform objects anchor by DECK line, not by their top edge.** Measured deck
  fractions off the AF2 sheets: bench **0.10** (backrest + armrests above the seat),
  shelf/plank 0, column 0.01, bundle 0.02. Top-anchoring sank the seat below the
  standable line and buried the backrest in the floor. Confirmed on screen in p2: the
  bench rails now rise above the walk surface.
- **The floating checkpoint easel.** Ground-standing props now seat on the first solid
  surface BELOW their marker instead of on the marker cell's own edge. Cause, measured:
  p3's second checkpoint is marked at **row 18 with ground only at row 22** — a 3-cell
  drop. Every other marker in ch01 sits at gap 0, so this is behaviour-neutral for them
  and simply stops the class recurring. Live: the easel moved from y 304 to **y 352**.

## The audit, ARMED at v1.1

`BANDS` are now functions of each phase's declared **key** (new `key` field in the
manifest: p1 88 · p3 86 · p2 30 · p4 28 · p9 16): L0 0.93–1.08 K (≤96) · L1 0.80–1.00 K
· L2 0.50–0.75 K · L4 ≤0.45 K · **L3 K-exempt**. The **L1↔L2 gap** is relative (≥0.10 K);
the **L2↔L3 separation stays ABSOLUTE**. Saturation caps measured and reported.

**Tamper-checked:** mis-declaring p1's key (88 → 30) turned its L0/L1/L2 red instantly;
restored. *(The first restore silently failed — my backup directory did not exist, and
`cp` said so while the tamper stayed in the file. Caught by re-printing every key
before moving on. Banked: a restore is not restored until it is re-read.)*

## What AF2 fixed, measured

| | AF (PK-C2) | AF2 (now) |
|---|---|---|
| p2 L2↔L3 separation | **4.0 %** FAIL | **12.9 %** PASS |
| p2 L1 luminance | 71.2 % (daylit fog) | **27.0 %** — in band at K=30 |
| p4 L1 luminance | 69.6 % | **25.0 %** — in band at K=28 |
| p9 L1 luminance | 82.2 % | 11.6 % |
| crust_p3 seam mismatch | inset-island voids | **0.0 % — closed loop** |

Red-void tiling spot-check (two loop tiles side by side): `crust_p3_a/b` **0.0 %** seam
mismatch — the review's named defect is gone. `crust_p1_a/b` 0.0 %, `crust_p9_a` 0.0 %.
Residuals: `crust_p2_a` 2.4 %, `crust_p4_a` 0.8 %, `l2_p3` 0.3 % of content rows — a
handful of rows at an anti-aliased tile edge, sub-pixel at the 17 px display height.
Reported as measurements, not claimed as defects.

## Gates — 11 of 12 green, the 12th honestly red

vitest **263** · tsc ×2 · grounding · sheets · paint-art · game-tasks · build · bundle
(1 Phaser chunk) · tapes **ALL GREEN with `content/` clean** · import re-run byte-stable.
**check-composition exits 1** on two MARGINAL failures, reported and NOT softened:

- **p4 L2↔L3 separation 9.2 % lum / 13.8 % sat** (needs ≥12 % or ≥25 %). Improved from
  9.8 % but still short: the audience band and the stage play plane sit close in value.
- **p9 L1 luminance 11.6 %** against a floor of 12.8 % (0.80 × K=16). Short by **1.2
  points** — either the ink wall wants a touch more light, or p9's key is 15 rather
  than 16. That is a law/art call, not a wiring one.

## Composition checklist (law §4.5), self-run

| | p1 | p2 | p3 | p4 | p9 |
|---|---|---|---|---|---|
| scale statement | ✓ | ✓ | ✓ | ✓ | ✓ |
| silhouette pop (on screen) | ✓ | ✓ | ✓ | ✓ | — |
| caps flush | ✓ | ✓ | ✓ | ✓ | ✓ |
| slide reads as a slide | — | — | ✓ | — | — |
| no naked fill | ✓ | ✓ | ✓ | ✓ | ✓ |
| cover-fit everywhere | ✓ | ✓ | ✓ | ✓ | ✓ |
| value key correct | ✓ | ✓ | ✓ | ✓ | **✗ (L1 1.2 pts low)** |

## Honesty clause

Nobody has PLAYED this. The tapes prove the level is still completable with the same
inputs; they cannot see the guardian (banked in REVIEW 3). p9 was verified by
measurement and by its audit line, not by a fresh screenshot this packet — p1/p2/p3 were
screenshotted after reload + pump dance. Whether the composition is beautiful stays
Fable's and Koki's call.

**Commit.** `e4e03e3`.

---

# ★ PK-F1 · TASKS BOUND TO THE WORLD (the F2 round's flagship) — DONE

**Branch `pb-f1-task-binding`.** Brief: `PLATFORM MASTER/SESSION-PROMPTS/
PASSOVER_PB_F2_2026-07-27.md` (PK-F1 + the EVIDENCE ADDENDUM), doc 37, and the
46-screenshot evidence file. Boot: fable-method + dial sheet §1, doc 37, the evidence
file, doc 35's three reviews, doc 36 v1.1 — all re-read from the files, none from
session memory (REVIEW 3's miss #1, not repeated).

## The three root causes, code-verified before any change

1. **A card was never told who asked for it.** `sim.ts:307` has emitted
   `ctx {type:"entity", id, skin}` on every encounter since Build-B; `routing.ts`
   `nextTask(items, use, st)` never received it and served each `use` as one blind
   playlist. That is F2-1 in one line.
2. **The arena leak has a specific mechanism.** `entities.ts:435-441` — an
   *undeflected projectile* that touches the player raises `encounter` with the
   THROWER's role and skin. The Tafel throws chalk; the chalk hits; the arena asked
   the ordinary encounter pool for a card and got p3's ruler.
3. **The boss was a different drawing while its card was up.** `entPoseCell` had no
   case for `window` (the counter-task state), so the guardian fell through to the
   a/b idle cells — `tafel_a`, the green board on an easel — while charging uses the
   wheeled `tafel_roll` body. Two boss designs, swapped exactly when the card said
   „schau sie an".

## What was built

- **Schema (`content-schema/game-tasks.ts`).** Cards carry `skins?: string[]` and
  `phases?: string[]`, plus a `finale` use. THE BINDING LAW lives in
  `taskInvariantErrors`, so it holds in the loader, the CLI gate and the tests at
  once: *an `entity` stimulus must declare skins; a card with no skins may not use an
  entity stimulus.* An unbound card is the deliberate fallback pool and therefore may
  not claim a being on screen.
- **Router v3 (`cards/routing.ts`).** `nextTask(items, use, ctx, st)` with
  `ctx {phase, skin?}`: use → phase scope → skin-bound → unbound fallback. Cursors
  are per POOL (`use|phase|skin`), so one being's progress cannot eat another's. No
  RNG, the no-repeat-kind skip is unchanged, and an empty pool still resolves rather
  than softlocks. `resolvePool` is exported so a gate can ask "what can this being
  ever be answered with?".
- **Sim.** Every world-triggered card now carries its being's skin — doors and the
  guardian gained `skin` on their ctx; `guardianDown` carries `id` + `skin`.
- **Content — 49 cards, re-authored.** Every entity stimulus names a being that is
  actually drawn (checked against the sheets, not from memory). ≥3 cards per hostile
  being; the Tafel gained its own encounter cards, so a chalk hit is answered by the
  Tafel. Copy cut to one clause + the ask (≤56 chars each; longest shipped 52/48).
  The boss set refers only to the Tafel and to things drawn in the arena — no
  invisible „Beweis", no Klecks, no stale noun between rounds.
- **The finale is played (F2-24).** The last knot serves `fin.t1` — the child types
  the greeting — and only then does the console beat run, now reading „Jetzt steht
  dein Wort da" instead of writing it for them. No finale card in the set ⇒ straight
  to the console, so the beat cannot softlock.
- **The card sits beside the being (F2-20).** `PaintScene.screenFracOf(id)` gives the
  being's position across the view; the overlay docks to the far side (46 % width,
  same 460 px cap as before — a shift, not a shrink). Hazard and text cards stay
  centred.
- **HUD (F2-33).** „🪢 Knoten: 3", „🔓 Befreit: n/6", and a counter with nothing to
  count is not drawn. („Fieberstärke" appears nowhere in the codebase — grep is
  empty; what Koki saw was this unlabelled knot counter.)
- **The wheel shows its datum (F2-22).** `WheelCard` never rendered `shown`, and the
  moth carries no painted number, so the wheel could not be solved by looking. The
  datum now sits on a slate on the card.
- **Guardian identity.** `window` maps to the `stagger` cell: the same wheeled body,
  reeling — the boss no longer changes design when its card opens.

## The gate, extended and TAMPER-CHECKED (8 laws, each seen red)

`check-game-tasks.mjs` now also reads the sibling `*.level.json`: declared skins must
exist as beings; a card scoped to a phase its being never enters is dead and fails;
every hostile skin needs ≥2 cards in the pool ITS events serve (swarm→quickfire, the
rest→encounter), a guardian needs ≥2 encounter + ≥2 boss + ≥1 finale, every cage a
rescue card, every non-bonus door a door card; an unbound quickfire card must exist
for hazards; and both card lines are length-linted. Each of the eight was broken on
purpose, seen to exit 1 with its own message, and restored — the restore verified by
sha256, not by assumption (the PK-C2b lesson: a restore is not restored until re-read).

## Blind-solve — the round that changed the content

Two fresh-context agents, frames only (`renderTaskText`, never the keys, never the
repo). **They were right and I was wrong on two cards of my own making:** a paintbox
creature whose spell answer was "floor", and a card asking the child to COUNT the
paint pans on a 22-px sprite — the same "claims something you cannot read" class this
packet exists to kill. Unanimous findings acted on: both paintbox cards, the Heft
colour card, the satchel rope-colour card and the Tafel frame-colour card removed or
replaced (visual-property questions depend on reading a sprite at 22 px); the
ambiguous Heft mistake card became an `order` card ("This is my exercise book.") so
"a exercise book" can never be built; three wheel cards whose German said "say it"
now say "turn the wheel"; „Ziffer" → „Zahl" for a two-digit number; the desk and
chair spell cards no longer read as the same question; the door card no longer asks
the child to invite a door inside; Merle's card no longer repeats the satchel's
sentence; the finale asks for a named word instead of any greeting. Single-vote
flags were judged, not auto-applied: the bare imperatives „Open!/Close!" stay — the
u01 lexicon is the source and it teaches them.

**Three rounds, and the trend is the point.** Round 1: 12 + 20 flags. Round 2 (after
the fixes): 3 + 20 — the second reader's list was almost entirely *pattern* criticism
(twins, repeated frames, Germany-German for an Austrian child), which became the
TWIN LAW in the gate. Round 3, one reader on the final set: 8 — and **five of those
eight were defects my round-2 edits had introduced** (an odd-one-out sharing its
answer word with another card, an order card rebuilding a sentence another card
displays, a door pointing at note text that is never shown, one surviving „Ranzen",
a boss card building what its own mistake card produces). All six real ones fixed;
the two held are documented above. That is the drift alarm working exactly as loop 3
promises — a fix wave is itself a draft, and it needs the same reader.

## Gates (unpiped, real exit codes)

vitest **275 game-paint / all packages green** · typecheck (15 packages + web) ·
lint · grounding · design-sheets · paint-art (108 stems) · game-tasks (49 cards, 7
layers) · build · bundle (Phaser 1 chunk, 310 KB gz) · composition (4 audits green
over 5 phases — the two marginal reds from #236 are gone on main) · proof tapes: all
five replay to their exits (p4 `done`, 3 tasks solved).

## Browser proof (dev server on :3010, own instance)

Same pencil, three touches: `enc.pencil.c1` → `enc.pencil.m1` → `enc.pencil.c1` — its
own pool, cycling. Ink hazard → the unbound pool (`qf.free.c1`), correct: a hazard has
no being. Arena chalk hit → `enc.tafel.c1`, then `enc.tafel.s1`. Finale walked: typed
„hello" → the Tafel blooms (`tafel_win`) and the console card reads „Jetzt steht dein
Wort da". Screenshots taken for p1, p2, p3 and the arena.

**Harness law banked:** while the browser pane is hidden the Phaser LOADER STALLS —
`status 3 (LOADING)`, `inflight 0`, progress frozen — and `step()` does nothing,
because `update()` never runs until `create()` has. The pump dance is the cure and it
needs REAL time: ~15 % of the queue lands per `wait ~10 s` + `rafStep ×300`. Read
`load.progress` and only drive the game at `status 5`. This is why an earlier attempt
"moved" the player 0 px for 300 ticks with no error anywhere.

## Honesty clause — what I did NOT verify

- **Nobody has PLAYED this with hands.** The pencil/arena/finale walks were driven
  through the dev harness.
- **I never landed a chalk deflect** (136 fist throws): the stagger → boss-card path
  was reached by calling the scene's own `resolveTask` per knot. The path is proven
  reachable by the p4 proof tape, not by my hands.
- **The look stays Fable's and Koki's call** — I report what is on screen and hand the
  verdict up.
- Two blocking findings for PK-F2 are recorded in doc 37 (rings unreachable without
  the `swing` ability; p1's two cages unopenable because the fist is granted in p2)
  and were NOT fixed here — they are level design, outside this brief's wall.

---

# ★ PK-F2 · FEEL & FUNCTION — the world answers back

**Branch `pb-f2-feel-and-function`, from the merged main `a4f303a` (#237).** Brief: the
F2 passover's PK-F2 section **plus the section that appeared on it at 18:48 —
"PK-F1 REVIEWED & APPROVED, rulings for PK-F2"**. Re-reading the passover file rather
than working from the copy in session memory is what surfaced those three rulings; the
mechanical hard-stop earns its place again.

## The rulings, executed

1. **`?phase=` keeps its entrance, loses its sign.** `history.replaceState` strips the
   param once the game has mounted. Verified live: navigating to
   `/play/1/buch?phase=p1` lands in „Die Eingangshalle" with the address bar reading
   `/play/1/buch`. (`?air=` is left alone — it is a dev knob that should survive a
   reload.)
2. **The rings leave ch01.** Three `o` glyphs in p3 (34,9 · 29,10 · 39,10) removed:
   swinging is gated on the `swing` ability and `ch01.level.json` grants only
   `jump, run, punch`, so they were an affordance without its verb. Level laws re-run
   green; the tapes never touched them.
3. **The two pre-fist cages.** `cage2` stays exactly where the p1 dossier put it (item
   8: the „rüttelt nur" beat) but now renders at **alpha 0.45** — the transparency
   grammar this ruling names, written into the renderer as a rule: *solid = you can act
   on this now, transparent = not yet*. It solidifies the moment the fist is granted.
   `cage5` leaves p1 for **p3 (54,17)**, standing on the platform at cols 53–55 with
   the fist long since in hand. The p1 dossier's item 9 (the „Spind-Alkoven" tease)
   is thereby amended — the tease role now belongs to cage2 alone.

## F2-4 — the "small-ledge glitch" had one cause, and it is now a law

The stub in his 12.57.28 frame is a **single `/` ramp tile at p1 (44,17)**, two tiles
right of the ink gap, with floor at the same height on both sides: an 8-px bump that
led nowhere, stood the hero's feet on a diagonal and put his torso at an odd offset —
exactly what the screenshot review measured. Removed. The CLASS became a level law,
`slope-purpose`: *a ramp must change the walk height*. Scoped to the full ramps `/`
and `\` (the 30° halves have their own pairing law; `z` is the slide, diagonal by
design). **Tamper-checked** by writing the tile back: the law goes red on that exact
cell and green again when it is removed.

## F2-9 letters and F2-5 the invisible wall — measured, and honestly reported

Both were investigated with a headless sweep over the REAL sim. Two instruments had to
be corrected before either result could be believed: the first letter check was
stricter than the law's own tolerance (it called every letter unreachable), and the
first wall sweep counted **encounter freezes as walls** — the world stopping because a
card opened is the game working.

- **F2-9 · the letter counter is honest.** placed = HUD total = reachable, in all five
  phases (p1 8/8 · p2 8/8 · p3 7/7 · p4 0/0 · p9 12/12), with the abilities actually
  granted at each phase rather than all of them. So "I feel I collected all" is not a
  counting bug — it points at **F2-31** (a letter that reads as backdrop), which is
  PK-F3's readability work.
- **F2-5 · NOT REPRODUCIBLE.** Ground-walk sweeps in BOTH directions over every
  standable column of all five phases find no invisible wall except the intended
  world-edge box at col 1. Two specific hypotheses were tested and refuted by
  measurement: the screen-box clamp never bites (the box edge stays 186–204 px away
  at run speed 2.25 px/t AND at slide speed 6.00 px/t), and no solid-but-undrawn tile
  exists. **This needs his exact spot** — the evidence file has no frame of it either.

## F2-3 — three candidates, measured, and NOT chosen

Measured cause: airborne with no direction held, `vx` is never touched, so the launch
speed rides all the way down; the landing then needs ~12 px of ground friction to stop.
And the air-snap floor (2 px/t) sits ABOVE walk speed (1.25 px/t), so **a walking hop
travels almost as far as a running leap** — which is why precise near-ledge jumps
overshoot. Traces from the real engine on a flat floor, canonical 12-tick hold:

| model | run + hold | run + release at apex | walk + hold | height / air |
|---|---|---|---|---|
| **current** (shipped) | 128.3 + 12.4 = **140.6 px** (8.8 tiles) | 140.6 px (8.8) | 113.3 px (7.7) | 101 px / 56 t |
| **airbrake** — no-input air decay | 140.6 px | **104.6 px (6.5)** | 113.3 px | 101 px / 56 t |
| **landdamp** — 50 % cut on landing | 140.6 px | 131.1 px (8.2) | 113.3 px | 101 px / 56 t |
| **softsnap** — snap floor = walk speed | 140.6 px | 140.6 px | **71.3 px (4.7)** | 101 px / 56 t |

Height and air-time are identical in every row: the vertical arc is canon and untouched.
`airbrake` gives the child mid-air aim; `landdamp` only removes the extra steps after
landing; `softsnap` is the one that restores a genuine short hop. **The default stays
`current`** — which of these FEELS right is Fable's and Koki's call. Switch in dev with
`?air=airbrake|landdamp|softsnap`; the pick is then a one-line change to
`DEFAULT_AIR_MODEL`.

## Tapes now see the world

`paintProof@1` tapes gained `expect`: the end-state a run must produce — letters got,
letters total, where the exit led, cages freed, and **`guardianDown` for p4**. That
closes the hole this program's own report named ("tapes see buttons, not the world" —
the arena tape came back byte-identical after the guardian gained motion). The recorder
stamps the block from the open-loop replay, so CI and the recorder cannot drift, and
all five tapes were re-recorded through it. **Tamper-checked:** flipping p4's
`guardianDown` to `false` fails the suite with the exact mismatch; restored, green.

**A gap named rather than hidden:** every recorded pilot frees zero cages, so
`cagesFreed` asserts 0 everywhere. The assertion will catch a cage-count regression on
a route that frees one, but no current tape takes such a route. A cage-freeing pilot is
the natural next tape.
