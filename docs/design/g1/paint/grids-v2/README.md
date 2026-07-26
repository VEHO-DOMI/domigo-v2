# ch01 phase grids v2 (Build-D2) — authored, verified, and now LIVE

The five phase-grid layouts, re-authored FROM SCRATCH against the approved
`../ch01-dossiers/` (nuke-not-patch), each verified GREEN against the real
`checkLevelLaws` + reachability envelope via `scripts/check-level-candidate.mjs`.

- `p1.json` — Die Eingangshalle (64×22): wake → S-C-H/O-O-L bench+ledge arcs → Krakel → ink-pit → alkoven cage5 tease → "Come in!" door.
- `p2.json` — Das Klassenzimmer bei Nacht (72×24): window entry → furniture staircase → Fibel grants the fist → deflect duel → ink-lake bridge → **Merle** person-cage → "Open!".
- `p3.json` — Der Schulhof-Garten (64×26): terrace+Krakel → chalk-slide → **swing+ruler moving-platform** crossing of the ink-pond → crusher block + alkoven cage4 → shaft → "Knock!".
- `p4.json` — Die Tafel-Bühne arena (36×20): one-screen stage, 2 chalk-crate podiums, the moving Tafel guardian (3 knots), name-console beat, cage6 post-victory → done.
- `p9.json` — Die Kleckskammer bonus (44×20): flat dream-room, a 12-letter flow-line jump-chain → p2.
- `ch01.level.assembled.json` — all five spliced into the full level: **parse OK + checkLevelLaws ALL GREEN** (3 phases · 6 cages · 1 person-cage · closed-top · slopes · spawn-standable · reachability · no trap-pockets).

## Status: ALL FOUR SHIPPED in Build-D (PK-1 → PK-3, branch `pb-d2-grids`)

This directory is now the **design source of truth** for a level that is live, not a staging
area. `ch01.level.assembled.json` and `content/.../ch01.level.json` are kept **deep-equal**;
the splice is re-verified by machine diff, so edit the grid here and re-splice — never edit
the live level directly, or the two drift apart silently.

1. ✅ **Wired into `content/.../ch01.level.json`** — splice proven IDENTICAL to the assembled
   file by deep-compare (PK-3).
2. ✅ **Batch AC/AC2 art imported** (`docs/art/import-batch-ac.mjs`, 64 stems) — every plate,
   band, terrain and entity stem resolves and the allowlist is at **ZERO** entries (PK-1).
   Nine cells stay deliberately deferred (A-8's per-phase grounds, the duplicate planks, the
   unnamed decor); the full table with reasons is in `docs/handover/35`.
3. ✅ **All five proof tapes re-recorded** — recorder ALL GREEN, each verified open-loop before
   saving, and a re-run reproduces them byte-identically. The p3 pilot **rides the chalk slide**
   at a measured 6.00 px/tick (walk = 2.25). The recorder gained two closed-loop ops
   (`waitPlatformAt`, `rideUntil`) under amendment A-3 for the ruler crossing (PK-3).
4. ✅ **Browser-proven** — all five phases boot by id with 0 console errors; four visibly
   distinct per-phase bands, the four far plates, and the `z` slide wearing both
   `slope45_down` and `strip_ice_loop` at all six cells.

Open, and deliberately not fixed inside Build-D (see `docs/handover/35` for the evidence):
**F-4** ch01 has no deep-interior mass-fill art cell · **F-5** `tafel_roll` has no sim state to
bind to (the guardian FSM has no locomotion) · **F-6** the arena's far plate does not span the
short p4 level (pre-existing parallax-coverage math).

The remaining gate is human: Fable's review, then Koki's chapter-1 replay — the feel verdict
belongs to them, not to the gates above.
