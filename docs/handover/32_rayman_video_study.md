# 32 · THE RAYMAN VIDEO STUDY — per-level design dossiers + frame-by-frame physics

**Status: STUDY (W1+), signpost (2026-07-22).** Extends the `docs/study/rayman/` evidence base
under doc 31 (THE PAINTED BOOK). Does not supersede anything; it *adds* two new study surfaces
built from a full-length retrospective playthrough and hands them to the next Fable session.
Clean-room throughout (CP-15): the studied game's mechanics/structure/feel are ours to learn; its
**image assets stay git-ignored and local**, only our-own-words docs are committed.

## §1 · What was built
From Koki's 720p capture of *"Was It Any Good — Rayman 1"* (Josh Strife Hayes, ~52 min; the .mp4
sits in `docs/`, git-ignored):
1. **138 curated per-level reference frames** — one folder per video chapter, `README.md` indexed.
2. **16 per-level design dossiers** (`00_DESIGN.md` in each chapter folder) — the level-anatomy
   6-slot schema (Structure · Mechanic · Terrain · Enemy/hazard · Secrets/cages · Set-pieces),
   mapped to video timestamps, frames embedded, **boss levels carry frame-annotated attack
   patterns** (Mr Sax, Mr Stone, Space Mama, Mr Scops, Mr Dark) — the white space `level-anatomy.md`
   left open (no video-chapter index, no per-attack boss timing).
3. **Frame-by-frame movement-physics capture** — 20 modalities, native 60 fps.

## §2 · Where it lives (all git-ignored — local study only)
- Frames + dossiers: `docs/Rayman X DomiGo Screenshots/July 22nd Rayman Game/` (folder name has a
  trailing space — resolve via glob) → `NN-<level>/00_DESIGN.md` + `README.md`.
- Physics: `docs/Rayman X DomiGo Screenshots/Rayman Movement Physics/` → `NN-<modality>/f_####.png`
  + **`PHYSICS-CAPTURE.md`** (the spec).
- Raw working sets: `…/_raw-frames/` (~727 MB) and the physics frame folders (~3,780 frames) —
  deletable; regenerate from the .mp4 with the ffmpeg lines in each spec.

## §3 · How it feeds the lane (doc 31)
- **§3 feel contract → `packages/game-paint/src/paint.ts`.** The physics capture is a **timing
  validation dataset**: because the footage is true 60 fps and the game is 60 Hz, **1 frame = 1
  tick**, so frame-counts directly check the tick-constants (12-tick jump hold, 50-tick helicopter,
  5-tick swing dwell, the mod-3 gravity clock → ~105 px held apex). `PHYSICS-CAPTURE.md` keys every
  modality to its `source-audit-r3.md` / `rayman-grammar.md §2` constant + **D/T** marker, and calls
  out the audit deltas to validate: **M1** gravity (our code 3× too strong), **M2** air-snap, **M5**
  the 6/3 slope-additive relabel. It also fills the **two gaps** with no decomp numbers: crouch/
  lie-down, and raw walk/run top speeds.
- **§7 unit→level method → `docs/design/g1/paint/`.** The 16 dossiers are per-chapter design
  evidence (screen/phase beats + boss patterns) to mine when authoring our chapter sheets.

## §4 · Known caveats (honest)
- **`10-ledge-hang-pullup`** — no clean isolated hang exists in the footage (only mid-platforming
  grabs); geometry comes from the decomp. A clean locked-camera re-record is the documented
  **Option 2** (Koki, 2026-07-22): capture ~10 s in an emulator if the visual is ever needed.
- **Pixel geometry** is only exact on the camera-**LOCKED** clips (boss arenas: jump-hold, fall,
  punch, crouch, knockback in the Space Mama / mosquito arenas). On scrolling clips **timing** is
  exact but absolute px-arc is approximate — use the decomp constant there (flagged per-row).
- **Two crossed frame filenames** (kept exact, captions corrected in-dossier): fairy
  `08_save-game-screen.png` ↔ `09_pink-plant-woods-daytime.png` are swapped in content; mr-scops
  `00_title-…` is actually the "help me" cutscene, not a title card.

## §5 · Next for the Fable session
1. **Consume the physics** into `paint.ts` — validate M1/M2/M5 against the LOCKED clips; set the
   walk/run **T** speeds + originate crouch numbers from `14-crouch-liedown`.
2. **Mine the dossiers** into the `docs/design/g1/paint/` chapter sheets (boss patterns especially).
3. **Reconcile 3 stale Mission-Control surfaces** (pre-existing drift, flagged not fixed here):
   `data/domigo.json` → `plan.phases` still reads the old "B-0 … Keen" game phase; the legacy
   `plan.title`/`plan.steps` ("GAME v4 UNIT-MAGIC") are dead/unrendered; `context/domigo.md`
   describes the pre-pivot v5 Keen lane. Replacing the plan object is the governing-plan owner's call.

## §6 · Truth pointers
- Study frames + dossiers: `docs/Rayman X DomiGo Screenshots/July 22nd Rayman Game/` (git-ignored)
- Physics: `docs/Rayman X DomiGo Screenshots/Rayman Movement Physics/PHYSICS-CAPTURE.md` (git-ignored)
- Physics constants of record: `docs/study/rayman/source-audit-r3.md` + `rayman-grammar.md §2` → `packages/game-paint/src/paint.ts`
- Design laws of record: `docs/study/rayman/level-anatomy.md`
- Governing canon: `docs/handover/31_the_painted_book.md`
- Dashboard: Mission Control `domigo` card (this study logged there)
- iCloud mirror: `Domi Gym/PLATFORM MASTER/` (this doc)

*Author: Fable-method session (Opus), 2026-07-22.*
