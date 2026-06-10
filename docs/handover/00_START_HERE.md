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

## The single most important warning
Beta failed on **content quality**, not features. Students hit words they hadn't learned, answers that
were marked wrong though correct, and a shaky translation task. **Do not trust that the existing corpus
or any sub-agent import is right — verify item by item, against the textbook.** A broken item in front
of a real 10-year-old is the failure mode that matters. See `04` and `08`.

## Status as of this handover (2026-06-10)
- v1 is live at `https://domigo-silk.vercel.app` (repo `VEHO-DOMI/domigo`, private).
- Latest corpus fix merged: [#41 — grammar matching data](https://github.com/VEHO-DOMI/domigo/pull/41)
  (all 115 `matching` items now render).
- The local iCloud working copy is **concurrently edited by other sessions + iCloud-synced** — do git
  work in a fresh `/tmp` clone (`gh repo clone VEHO-DOMI/domigo`), never in the iCloud tree.
