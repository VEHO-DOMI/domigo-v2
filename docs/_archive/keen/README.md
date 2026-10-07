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
- `art/` — Keen-era Codex master prompts (base + T/U/V/W/X/Y) and art manifests
- `art/commissions/` — the Keen-era commission sources, builders and generated
  commission pages (base + T…Y, `refs-t/`), moved here 2026-10-07 (cgo-086).
  The base and T–W builders read their manifest from their own folder (the
  manifests sit one level up), so they no longer run as they lie; all of it
  is record, not tooling. Batch Z (the painted
  book's style key) is NOT Keen and stays in `docs/art/`.

What deliberately did NOT move:
- `packages/game-2d` — the Keen build stayed PARKED in the code tree as a
  teacher-only reference (through PR #211) until 2026-10-07: cgo-086 deleted
  the Keen code, the `/play/[grade]/run` + `/world` routes and the Keen art
  (Koki 03.10. + 07.10.). The package now carries only the Schulhaus (active)
  and the Overworld (heritage, decision open). The Keen runtime content in
  `content/` stays — it carries learning coverage (Ledger rule 15); Welle 2
  decides about it with Koki.
- `docs/design/g1/paint/`, `grounding/`, `SHEET_TEMPLATE_V4.md` — active lane.
- `docs/art/CODEX_METHOD.md` + `import-batch-*.mjs` — lane-agnostic method
  and the ACTIVE paint import pipeline.
- The handover docs (`docs/handover/`) — historical log, never retconned.

Honest note for the record: the free-floating wedge terrain Koki flagged in
the ch01 playtest did NOT come from Keen remnants — it came from the July-20
fix round's "escape ramps" (#218), banned since PB-T1's slope-backing law.
The sweep still happened, as ordered, so the separation is structural.
