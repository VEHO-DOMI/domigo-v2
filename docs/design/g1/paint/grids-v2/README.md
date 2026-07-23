# ch01 phase grids v2 (Build-D2) — authored + verified, STAGED for wiring

The five phase-grid layouts, re-authored FROM SCRATCH against the approved
`../ch01-dossiers/` (nuke-not-patch), each verified GREEN against the real
`checkLevelLaws` + reachability envelope via `scripts/check-level-candidate.mjs`.

- `p1.json` — Die Eingangshalle (64×22): wake → S-C-H/O-O-L bench+ledge arcs → Krakel → ink-pit → alkoven cage5 tease → "Come in!" door.
- `p2.json` — Das Klassenzimmer bei Nacht (72×24): window entry → furniture staircase → Fibel grants the fist → deflect duel → ink-lake bridge → **Merle** person-cage → "Open!".
- `p3.json` — Der Schulhof-Garten (64×26): terrace+Krakel → chalk-slide → **swing+ruler moving-platform** crossing of the ink-pond → crusher block + alkoven cage4 → shaft → "Knock!".
- `p4.json` — Die Tafel-Bühne arena (36×20): one-screen stage, 2 chalk-crate podiums, the moving Tafel guardian (3 knots), name-console beat, cage6 post-victory → done.
- `p9.json` — Die Kleckskammer bonus (44×20): flat dream-room, a 12-letter flow-line jump-chain → p2.
- `ch01.level.assembled.json` — all five spliced into the full level: **parse OK + checkLevelLaws ALL GREEN** (3 phases · 6 cages · 1 person-cage · closed-top · slopes · spawn-standable · reachability · no trap-pockets).

## Still pending (assembled into the Build-D PR when Codex batch AC2 art lands)
1. Wire these into `content/.../ch01.level.json` (plates already reference the AC stems).
2. Import batch AC2 art → the plate/band/terrain/entity stems resolve (removing the pending allowlist entries).
3. **Re-record the proof tapes** — the old p1..p4 pilots are stale under the new layouts; author new pilot macros (`scripts/record-paint-tape.mjs`), esp. p3's swing/ruler timing.
4. Browser screenshot proofs after reload; full gate set green; then open the PR for Koki's replay.
