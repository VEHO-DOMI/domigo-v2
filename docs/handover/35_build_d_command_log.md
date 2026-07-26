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
