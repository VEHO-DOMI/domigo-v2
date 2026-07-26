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
| PK-1 | W1 — batch AC/AC2 import script + run, allowlist −2 | **DONE** — 65 stems, allowlist 2→0, art dir 82→133 |
| PK-2 | W2+W3+W4 — per-phase plates/bands · terrain strips (+`z` slide art) · enemy pose hook (+A-4 tafel study) | **PENDING** |
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

<!-- PK-2 log entry goes here -->

<!-- PK-2 log entry goes here -->

<!-- PK-3 log entry goes here -->

<!-- W7 log entry + PR link go here -->
