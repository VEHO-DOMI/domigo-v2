# ⛔ ARCHIVED — the Commander-Keen-era game lane (parked 2026-07-23, PB-T3)

**Nothing in this folder feeds the active game.** The Painted Book lane
(doc 31, `docs/design/g1/paint/`, `packages/game-paint`) inherits NOTHING
from the Keen era — that is the FRESH-EYES LAW (doc 31 §1.6): process laws
and plumbing carried over; fiction, cast, names, tasks, modalities, and
level design did not. Koki ordered this archive sweep in the ch01 tuning
round ("no Commander Keen interference anymore").

What lives here:
- `study/` — the Keen study corpus (id-engine, actors, level cookbook, …)
- `design/` — the 15 Keen-era chapter design sheets (ch01–ch15)
- `art/` — Keen-era Codex master prompts (base + T/U/V/W) and art manifests

What deliberately did NOT move:
- `packages/game-2d` — the merged, working Keen build stays PARKED in the
  code tree as a teacher-only reference (through PR #211); it carries an
  ARCHIVED banner in its README. Its runtime content in `content/` stays,
  because parked code that ships must keep building.
- `docs/design/g1/paint/`, `grounding/`, `SHEET_TEMPLATE_V4.md` — active lane.
- `docs/art/CODEX_METHOD.md` + `import-batch-*.mjs` — lane-agnostic method
  and the ACTIVE paint import pipeline.
- The handover docs (`docs/handover/`) — historical log, never retconned.

Honest note for the record: the free-floating wedge terrain Koki flagged in
the ch01 playtest did NOT come from Keen remnants — it came from the July-20
fix round's "escape ramps" (#218), banned since PB-T1's slope-backing law.
The sweep still happened, as ordered, so the separation is structural.
