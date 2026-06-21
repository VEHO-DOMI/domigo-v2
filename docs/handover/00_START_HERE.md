# DomiGo v2 — START HERE (handover for Fable)

You are picking up **DomiGo**, an EFL practice app for **Austrian AHS Klasse 1–4 (MORE! 1–4, level
A1→A2, ages ~10–14)** at the Gymnasium der Dominikanerinnen. A working **v1** exists; you are
**rebuilding it from scratch**, keeping the durable foundations and fixing what beta testing exposed.

## The mission in one paragraph
Rebuild DomiGo as a richer, bulletproof learning app for grades 1–4, **rooted entirely in the original
MORE! 1–4 textbooks**. First make the **content correct and the student data complete** (P0), then build
the new pillars: a guided **Study Path**, an engaging **Story/RPG mode**, teacher **Mock Tests**, and
**Listening**. Ship a **PWA on Vercel** first; document a native path. Keep grades **1–4 only** — drop
5B (grades 5–8 are a separate app).

## Decision log (confirmed by Koki, 2026-06-10)
1. **Rebuild from scratch.** v1 is reference/prior-art. What carries forward: the corrected content
   corpus, the migrated student data, the task-format + grading specs, and the guardrails (`08`).
2. **Content correctness + migration first (P0).** Vision pillars come after.
3. **PWA-first on Vercel**; native/App-Store documented for later.
4. **Docs live in** `docs/handover/` (this folder) **+** a copy in iCloud at
   `…/Domi Gym/Claude/Cowork Space/Claude Code/DomiGo v2 Handover/`.

## Read order
1. `01_status_quo.md` — what v1 already does (the reference implementation), with build status.
2. `02_architecture_and_data_model.md` — stack, DB schema, auth, content model, item types + grading.
3. `03_migration.md` — Firebase→Neon pipeline + the **pending** new-signup import.
4. `04_content_rework.md` — **the P0 work**: item-by-item content fixes + methodology + rules.
5. `05_source_materials_map.md` — where the MORE! 1–4 textbooks / tests / audio live (root everything here).
6. `06_vision_pillars.md` — Study Path, Story/RPG, Mock Tests, Listening, UX/UI, platform.
7. `07_task_formats.md` — the item/task format catalog the content engine must support.
8. `08_design_principles.md` — the durable guardrails. **Non-negotiable. Re-read before every change.**
9. `09_roadmap_and_open_decisions.md` — sequencing, open decisions, the bulletproof-beta checklist.
10. `PASSOVER_PROMPT.md` — a self-contained kickoff message (also embeds the guardrails).
11. `10_game_layer.md` — the four grade games (G1 RPG first). `STATUS_AND_ROADMAP.md` (live build status) + `11_remaining_work.md` (the remaining-work passover: B2b · content waves · TTS · the G1 RPG).

## The single most important warning
Beta failed on **content quality**, not features. Students hit words they hadn't learned, answers that
were marked wrong though correct, and a shaky translation task. **Do not trust that the existing corpus
or any sub-agent import is right — verify item by item, against the textbook.** A broken item in front
of a real 10-year-old is the failure mode that matters. See `04` and `08`.

## Status as of this handover (2026-06-10)
- **2026-06-21 update:** the P0 foundation + the full **P1 learning track** are built. Merged to `main`: content (57 units / 5,898 items) + the foundation harness + the Smart-Review backend + auth. A **5-PR stack** (CI-green, unmerged for Koki) adds A3 `/review` → A4 streaks+offline-outbox → B1 Study Path → B3 Listening → B2 Mock Tests — **Track B is complete.** See [`STATUS_AND_ROADMAP.md`](../STATUS_AND_ROADMAP.md) (live) + [`11_remaining_work.md`](11_remaining_work.md) (what's left: B2b teacher-grading, the listening/test content waves, TTS, and the **G1 RPG** — Track C).
- **Live content-wave status → [`docs/runbooks/items-wave.md`](../runbooks/items-wave.md):** the items wave is ✅ **COMPLETE (2026-06-17) — 57/57 units approved at 0.0% reject** (G1 ✓, G2 ✓, G3 ✓, G4 ✓), all 4 structure catalogs generated, **5,898 items** (`pnpm content status` → `approved=57`). That runbook is the source of truth for the wave receipt, the per-unit rhythm, recurring fixes, and the now-resolved song/band bank gap (§7). Next tracks (runbook §4): merge `feat/items-wave-g2`, then wire items into the trainer surfaces (the foundation harness — loader + all-format renderer + grader).
- v1 is live at `https://domigo-silk.vercel.app` (repo `VEHO-DOMI/domigo`, private).
- Latest corpus fix merged: [#41 — grammar matching data](https://github.com/VEHO-DOMI/domigo/pull/41)
  (all 115 `matching` items now render).
- The local iCloud working copy is **concurrently edited by other sessions + iCloud-synced** — do git
  work in a fresh `/tmp` clone (`gh repo clone VEHO-DOMI/domigo`), never in the iCloud tree.
