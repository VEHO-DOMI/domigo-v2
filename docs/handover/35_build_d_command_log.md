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
| PK-3 | W5+W6 — grids-v2 splice (machine-diff fidelity) + all five proof tapes (p3 rides the slide) | **PENDING** |
| W7 | full gate set + browser proofs + the ONE Build-D PR | **PENDING** |

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

<!-- PK-3 log entry goes here -->

<!-- W7 log entry + PR link go here -->
