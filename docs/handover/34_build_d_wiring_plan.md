# Build-D Wiring — Full-Stack Implementation Plan (checkpoint 2026-07-23, Opus 4.8)

> **Purpose.** Getting the reworked ch01 world onto the screen: import the 31 Codex sheets,
> make the handful of engine additions the new art needs, wire the five verified grids into the
> live level, re-record the proof tapes, browser-verify, and open ONE Build-D PR for Koki's
> replay. This is the single biggest step in `passover-the-shimmying-dewdrop.md`. It is authored
> as verifiable stages, each with a CHECK and a LOOP — never one blind commit. Fable: this is the
> plan Opus executes next; the state snapshot + the cell→stem map + the four engine decisions are
> the load-bearing parts.

---

## 0 · STATE SNAPSHOT (ground truth at checkpoint)

- **Branch `pb-d2-grids`** (pushed). Contains: the 5 verified phase grids staged under
  `docs/design/g1/paint/grids-v2/` (p1/p2/p3/p4/p9 + `ch01.level.assembled.json`), and the dev
  harness `scripts/check-level-candidate.mjs`. `content/.../ch01.level.json` is UNTOUCHED here
  (so the old proof tapes still pass — the branch is green).
- **Grids verified**: all five pass the real `checkLevelLaws` (parse OK · 3 phases · 6 cages ·
  1 person-cage=Merle · closed-top · slopes backed/paired · spawn-standable · reachability · no
  trap-pockets). Re-run the harness on any candidate: `node --experimental-strip-types
  scripts/check-level-candidate.mjs docs/design/g1/paint/grids-v2/p1.json`.
- **Art** (`~/Code/codex-art-lab/`): `batch-ac/` = 31 sheets, **19 accepted as-is** (all 4 plates,
  6 props, checkpoint, ent_tafel_motion, ent_falter, 4 bands, kit_p3_paving, prolog_triptych,
  name_console). `batch-ac2/` = 12 finish-unified re-runs, **11 accepted**; **`ent_platforms`
  is being re-run as AC3** (`CODEX_MASTER_PROMPT_AC3_PLATFORMS.md`, in flight). So the import
  source per sheet is: **ac2 for the 11 re-run sheets, ac for the other 19, ac2/ent_platforms
  once AC3 lands** (until then its 2 stems stay allowlisted).
- **Allowlist** (`scripts/paint-art-allowlist.json`): currently `satchelswing_a`, `ruler_a`
  pending (the ent_platforms stems). The 8 plate/band entries added earlier were REVERTED when
  level.json was reverted — they come back when the grids are wired (W5).
- **Manifest auto-scans**: `resolvePaintArt()` reads every `*.png` under
  `apps/web/public/art/g1/paint/ch01/` → `{stem: url}`; the scene loads each as `pb-<stem>`.
  **So the import just has to write correctly-named PNGs — no manifest edit.**
- **Import pattern to copy**: `docs/art/import-batch-ab.mjs` (chromaKey tol-40 → 3-pass defringe
  → content-trim → ≥1% alpha audit → write to `apps/web/public/art/g1/paint/ch01/<stem>.png`;
  plates copied as-is, audit 0.5, no key).

---

## 1 · STEM-NAMING CONTRACTS (from the renderer — the wiring targets)

- **Plates**: `pb-${phase.plates.far}` (far), plus fixed `pb-plate_sky`, `pb-strip_mid_loop`
  (mid band tileSprite), `pb-plate_near_loop` (near band tileSprite). Fallback `pb-plate_far`.
- **Bands** currently load via the FIXED `strip_mid_loop` / `plate_near_loop` names — **not
  per-phase**. Per-phase bands need a renderer edit (§3.2).
- **Entities**: `entTex(skin,state)` → `pb-<skin>_<state>` → `pb-<skin>_a` → `fb-ent-<skin>`.
  `entStateCell` returns only: `a`,`b` (walk, flips every 12 ticks), `act`, `telegraph`,
  `burst`, `shake`, `dazed`. New poses need a state hook (§3.1).
- **Terrain** (all optional `if textures.exists`): `strip_ground_loop`(+`strip_cap_l/r`) over
  every exposed solid top · `plank_loop`(+`plank_cap_l/r`) for `=` · `spikes_nibs_loop` for `^` ·
  `pool_ink_loop` for `w` · `pit_inner_tile` for deep solids · `canopy_fringe_loop` for the
  canopy top · `strip_ice_loop` for `~` · `slope45_up/down`, `slope30_up/down`.
- **Task images**: `stimulus:{type:"image", stem, altDe}` → the card renders `pb-<stem>`.

---

## 2 · THE COMPLETE CELL→STEM MAP (all 31 sheets)

`[n]` = 512px cell index L→R. **src** = which batch. Rows marked ⚠ need a §3 decision.

### Plates (src ac, copied as-is)
| file | → stem |
|---|---|
| plates/plate_p1_entrancehall | `plate_p1_entrancehall` |
| plates/plate_p2_nightwall | `plate_p2_nightwall` |
| plates/plate_p3_yardwall | `plate_p3_yardwall` |
| plates/plate_p9_inkdream | `plate_p9_inkdream` |

### Bands (src ac, keyed full sheet) ⚠ per-phase renderer edit (§3.2)
`band_p1_hallway`, `band_p2_furniture`, `band_p3_playground`, `band_p4_audience`.

### Terrain (src ac2 except kit_p3_paving = ac)
| file | [0] | [1] | [2] | [3] |
|---|---|---|---|---|
| kit_p1_hall | `strip_ground_loop` | `strip_cap_l` | `strip_cap_r` | `pit_inner_tile` |
| kit_p2_floor ⚠ | `strip_ground_p2`? | cap_l | cap_r | `ledge_windowsill` (prop) |
| kit_p3_paving ⚠ | `strip_ground_p3`? | cap_l | cap_r | corner (prop) |
| kit_p4_stage ⚠ | `strip_ground_p4`? | cap_l | cap_r | `podium_chalkcrate` (prop) |
| kit_p1_steps | `slope45_up` | `slope45_down` | `plat_coatbench` (prop) | `plank_loop` (washi) |
| kit_p2_furniture | `plat_desk` (prop) | `plat_bookpile_s` | `plat_bookpile_l` | `plank_loop` (paper Steg) |
| kit_p3_air ⚠ | `strip_ice_loop` (slide) | ruler→entity (skip) | `plank_loop` (paper) | `plat_roofarrow` (prop) |
| kit_hazards | `pool_ink_loop` | `pool_ink_wide` | `spikes_nibs_loop` | `fence_feather` (prop) |

> The renderer today places only `strip_ground_loop`/caps, `plank_loop`, `spikes_nibs_loop`,
> `pool_ink_loop`, `pit_inner_tile`, `slope*`, `strip_ice_loop`. Cells labelled "(prop)" have NO
> renderer placement path yet → §3.3 decides: extend the tile renderer to place them by glyph, OR
> treat as decorative Batch-Z-style props, OR drop for MVP. **MVP = wire the core stems; the
> bench/desk/podium richness is a fast-follow, tracked, not silently dropped.**

### Entities
| file | src | [0] | [1] | [2] | [3] |
|---|---|---|---|---|---|
| ent_states_a ⚠ | ac2 | `pencil_run` | `eraser_squash` | `ranzen_stomp` | `heft_bank` |
| ent_platforms | ac2 (AC3) | `satchelswing_a` | `satchelswing_b` | `ruler_a` | `ruler_b` |
| ent_falter ⚠ | ac | `moths_a` (overwrite) | `moths_b` (overwrite) | `moths_rest` | `moths_slate` |
| ent_tafel_motion ⚠ | ac | `tafel_roll` | `tafel_windup` | `tafel_stagger` | `tafel_win` |

> ent_states_a poses only render after §3.1. ent_falter [0][1] OVERWRITE the shipped moths (the
> redesign — intended). ent_tafel_motion states wire in the arena guardian machine (§3.4/verify).

### Vocab (src ac2) — task-card images + placeable props
| file | [0] | [1] | [2] | [3] |
|---|---|---|---|---|
| vocab_objects_a | `obj_pen` | `obj_pencil` | `obj_rubber` | `obj_ruler` |
| vocab_objects_b | `obj_book` | `obj_exercisebook` | `obj_pencilcase` | `obj_sharpener` |
| vocab_objects_c | `obj_gluestick` | `obj_schoolbag` | `obj_desk` | `obj_chair` |

> **CHECK before naming**: grep the 43-card set for `"type":"image"` stimuli and match the stem
> names EXACTLY to what those cards reference (today most cards use text/entity stimuli — confirm
> which, if any, use image, and align). If none use image yet, these are placeable-prop stems.

### Props (src ac) — doors / checkpoint / gates / dressing
| file | note |
|---|---|
| checkpoint_station | [0] `krakel_a` (overwrite) · [1] `krakel_active` (new) — the readable station |
| props_gates | [0] `door_open` · [1] `arenadoor_a` · [2] `window_exit` · [3] `klecksdoor_a` (overwrite) |
| props_p1 / p1b / p2 / p3 | decorative props (lockers, notice, pit-mouth, lamp, hopscotch, fountain, spring, planter…) → decor stems; place via a decor layer or skip for MVP |
| story/prolog_triptych | [0] `prologue_swallow` · [1] `prologue_ensemble` · [2] `prologue_caged` — ⚠ verify how the prologue reads image stems |
| story/name_console | [0] `nameconsole_empty` · [1] `nameconsole_line` — the arena write beat |

---

## 3 · THE FOUR ENGINE DECISIONS (each: STUDY → DECIDE → IMPLEMENT → VERIFY)

### 3.1 New enemy poses need an animation hook
- **Now**: `entStateCell` (PaintScene.ts:264) returns `a`/`b` alternating every 12 ticks; the
  new `*_run/_squash/_stomp/_bank` cells would never be selected.
- **Study**: read the sim's entity `state`/`vx`/`timer` fields (entities.ts) — is there a
  "moving fast" / "just landed" signal to key a run/squash pose to?
- **Decide** (default): extend `entStateCell` so a walker with |vx|>threshold returns `run`
  (falls back to `b` if `pb-<skin>_run` absent — safe), a bouncer at contact returns `squash`,
  etc. Keep the fallback chain intact so missing stems never break.
- **Verify**: browser — warp to a chaser, `press({right:true})`, step, screenshot: the run pose
  shows while moving, the a/b idle while still. Unit: extend an entTex/entStateCell test.

### 3.2 Per-phase background bands
- **Now**: renderer loads fixed `pb-strip_mid_loop` / `pb-plate_near_loop`.
- **Decide**: read `phase.plates.mid` / `phase.plates.near`; if set, load `pb-<that>` as the
  mid/near tileSprite (fall back to the fixed names). My grids already set `plates.mid` per phase
  (band_p1_hallway etc.).
- **Verify**: browser — each phase shows its own band (p1 lockers, p2 furniture, p3 playground,
  arena empty-chairs). Screenshot p1 vs p2 to confirm they differ.

### 3.3 Terrain-strip mapping (kills the F13 brown blocks)
- **Now**: `strip_ground_loop` (if present) already paints over every exposed solid top; solids
  with none show the raw `EARTH` fillRect (F13). Importing `strip_ground_loop` alone fixes the
  MAIN surface across all phases with ONE stem.
- **Decide (MVP)**: import ONE `strip_ground_loop` (kit_p1_hall floorboard-over-books) + caps +
  `pit_inner_tile` + `pool_ink_loop` + `spikes_nibs_loop` + `slope45_*` + `plank_loop`. This
  removes ALL brown fallback on the grids' geometry. **Per-phase ground look** (paving in p3,
  stage boards in p4) = fast-follow: either (a) extend the ground-strip run to pick
  `pb-strip_ground_${phaseId}` when present, or (b) request a per-phase-tinted strip set. Log the
  gap; don't pretend p3 looks like paving until it does.
- **Verify**: browser — no brown fillRect anywhere on any phase; the ground reads as
  floorboard-over-books; ink pools / spikes / slopes show their art. Screenshot each phase floor.

### 3.4 The p3 "slide" — slippery surface vs. book-stair ramp ⚠ NEEDS A BROWSER DECISION
- **Tension**: the grid uses `\` slopes (renders as book-stairs via `slope45_down`); the art
  `kit_p3_air[0]` is a slippery blackboard-slide meant for a `~` surface (→ `strip_ice_loop`).
  `~` is a FLAT slippery tile, not a ramp — so a slippery DOWN-slide isn't directly supported.
- **Study**: re-read `collide.ts` for how `surface:"slippery"` (phase-wide) and `~` behave; check
  whether momentum on a `\` slope already reads as "sliding". Re-watch the Rayman slide capture
  (`docs/.../Rayman Movement Physics/`) for the intended feel.
- **Decide** (three candidates, pick in the browser):
  (a) keep `\` book-stairs, drop the slippery mechanic — simplest, loses the "slide" feel;
  (b) make a short `~` slippery flat run at the slide's foot + book-stairs above, wire
      `strip_ice_loop` = blackboard-slide — hybrid;
  (c) extend the engine for a slippery-slope tile (new glyph) — most faithful, most work →
      **escalate to a physics/source study loop + possibly a proof-tape re-derivation** before
      committing.
- **Verify**: browser playtest of p3 — does descending feel like a slide? Tape must still reach
  the exit. If (c), re-derive the reach envelope constant and re-tamper the level test.

---

## 4 · IMPLEMENTATION PHASES (each: author → CHECK → LOOP; one small commit per phase)

**W1 · Import script** — write `docs/art/import-batch-ac.mjs` from the ab pattern + the §2 map
(ac2 for the 11, ac for the 19, skip ent_platforms until AC3). Plates copied as-is; everything
else cropped/keyed/defringed/trimmed/alpha-audited.
- CHECK: run it; every written stem passes the ≥1% alpha audit; count == expected; spot-open 3
  stems (a plate, a terrain strip, an enemy pose) in Preview. `check-paint-art` green (add the
  still-pending stems — ent_platforms, and any prop/decor deliberately deferred — to the
  allowlist with reason+until).
- LOOP: any empty/mis-cropped stem → fix the cell bounds/trim and re-run.

**W2 · Plates + bands (the F6 win)** — implement §3.2; wire nothing else yet.
- CHECK (browser): boot `/play/1/buch`; each phase far-plate + its own band render; 0 console
  errors. Screenshot p1 (entrance hall) + p2 (night wall).
- LOOP: wrong/missing plate → fix the phase.plates ref or the load path.

**W3 · Terrain strips (F13)** — §3.3 MVP.
- CHECK (browser): no brown fallback on any phase; ground = floorboard-over-books; ink/spikes/
  slopes show art. Screenshot each phase floor. `check-paint-art` still green.
- LOOP: a surface still brown → the strip run predicate missed it; fix `surface()` / the stem.

**W4 · Enemy poses** — §3.1.
- CHECK (browser): a moving chaser shows the run pose; unit test for the new entStateCell branch
  (tamper: force |vx|>thr → expect `run`).
- LOOP: pose never shows → the state signal/threshold is wrong.

**W5 · Grids into level.json + moving-platform + guardian art** — copy the 5 verified grids from
`docs/design/g1/paint/grids-v2/` into `content/.../ch01.level.json`; wire ent_platforms
(satchelswing/ruler) once AC3 lands; wire the tafel motion states in the arena.
- CHECK: `checkLevelLaws` green (it is — already assembled-verified); `check-paint-art` green
  (re-add the plate/band allowlist entries only if any stem still absent); browser boot each phase.
- LOOP: a law fails → the harness pinpoints it; re-author that spot (nuke-not-patch).

**W6 · Re-record proof tapes** — the old p1..p4 pilots are STALE under the new layouts. Author new
pilot macros in `scripts/record-paint-tape.mjs` (walk/jump/ride macros per phase); p3 needs the
swing+ruler ride timing; p4 the boss loop; p9 the flow-chain.
- CHECK: `node --experimental-strip-types scripts/record-paint-tape.mjs` reaches every exit;
  `proof-tapes.test.ts` green (record==replay determinism). Law: no level ships without its tape.
- LOOP: a pilot can't reach the exit → read the printed cell trace, retune the macro (or, if it's
  truly unreachable, the GRID is wrong — back to the harness).

**W7 · Gate + proof + PR** — full CI-parity set: game-paint vitest · tsc (game-paint+web) ·
check-story-grounding · check-design-sheets · check-paint-art · check-game-tasks · web build ·
check-bundle (Phaser 1 chunk ≤400KB) · proof-tapes. Browser screenshots of all 5 phases after
`window.location.reload()`. Then open ONE Build-D PR; deploy-truth + hash quoted before Koki
replays (P-44). Update doc 33, MC, PLATFORM MASTER, memory.

---

## 5 · ESCALATION TRIGGERS (Koki: "don't shy from new gen / study / source")

- **Terrain richness** (benches/desks/podiums/windowsills have no render path): if the MVP ground
  strip looks too flat per phase → **request per-phase ground-strip art** (Codex) AND/OR extend
  the tile renderer to place the prop cells by glyph. Don't ship p3 looking like p1.
- **Slippery slide (3.4c)**: if we choose the faithful slippery-slope → **re-study the physics
  capture + collide.ts**, derive the constant, re-tamper the level test, re-record the p3 tape.
- **New poses insufficient**: if one extra pose per enemy still reads stale in motion → **request
  more state cells** (Codex) sized to the modality (per the pose-program idea in the plan Lane 3).
- **Prologue / name-console plumbing**: if the story/arena beats need scene code beyond art → scope
  a small PR (may fold into W5 or a follow-up).
- **Any "looks wrong in the browser"** that a stem swap can't fix → stop, study the source, decide,
  THEN commit. Never brute-force a visual (three-strikes rule).

---

## 6 · WHAT KOKI DOES (gates only)
1. Run the AC3 `ent_platforms` re-run (in flight) → drop `batch-ac2/entities/ent_platforms.png`.
2. If §3.4 or §5 asks for new Codex art → paste the prompt, drop the output.
3. Merge the one Build-D PR → **replay the whole reworked ch01** (the real gate).
