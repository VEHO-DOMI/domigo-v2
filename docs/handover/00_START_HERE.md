# DomiGo v2 — START HERE (handover for Fable)

> **📋 Reviewing or picking up this project? Read [`../HANDOVER_FOR_REVIEW.md`](../HANDOVER_FOR_REVIEW.md) first** — the review-oriented master handover (scope · intent · execution · how-it-works · **known gaps / risks / review-targets** · open decisions · how-to-pick-up). This doc (`00`) is the original design entry-point; the review guide is the current, gap-focused overlay on top of it.

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
11. `10_game_layer.md` — the four grade games (G1/G2/G3 done; **G4 Syntaxia** remains). `../STATUS_AND_ROADMAP.md` (live build status) + `11_remaining_work.md` (remaining-work passover: G4 · content waves · B2b · TTS · Track D).
12. `12_g2_passover.md` — the G2 "The Wrong Name" detective + pedagogy passover (now **complete**, #40–#60).
13. `13_g4_syntaxia.md` — **the G4 "Syntaxia" design + build plan** (the last grade game; PLANNED, not started — one narrative decision open for Koki).

## The single most important warning
Beta failed on **content quality**, not features. Students hit words they hadn't learned, answers that
were marked wrong though correct, and a shaky translation task. **Do not trust that the existing corpus
or any sub-agent import is right — verify item by item, against the textbook.** A broken item in front
of a real 10-year-old is the failure mode that matters. See `04` and `08`.

## Status (live: [`../STATUS_AND_ROADMAP.md`](../STATUS_AND_ROADMAP.md) — read it first)
- **2026-06-30 — most of the build is done (78 PRs on `main`).** The full **P0 content** (57 units / 5,898 items), the entire **P1 learning track** (Smart Review + Study Path + Listening + Mock Tests + auth + streaks/outbox), **three of the four grade games** (G1 "Lost Pages" — a full 15-zone uplift #72–#78 · G2 "The Wrong Name" — 15 ch + complete Part-6 pedagogy #40–#60 · G3 "FOURTEEN" — 14 episodes #61–#71), and a brand **design system** across all 4 grades (#62/#63) are all merged. No open PRs.
- **What's left:** **G4 "Syntaxia"** (the last game) · the **listening/test content waves** (1/57 units authored) · **TTS** audio · **B2b** teacher writing-grading · **Track D** (migration cutover + bulletproof-beta + PWA install + cheap-Android perf — gates the Sept-2026 go-live). Full breakdown in `../STATUS_AND_ROADMAP.md` §4 + `11_remaining_work.md`.
- **G2 pedagogy passover:** [`12_g2_passover.md`](12_g2_passover.md). The grade-game plans (`~/.claude/plans/passover-g2-the-wrong-precious-forest.md` G1, `domigo-v2-velvet-squid.md` G2) are COMPLETE.
- **Live content-wave status → [`docs/runbooks/items-wave.md`](../runbooks/items-wave.md):** the items wave is ✅ **COMPLETE (2026-06-17) — 57/57 units approved at 0.0% reject** (G1 ✓, G2 ✓, G3 ✓, G4 ✓), all 4 structure catalogs generated, **5,898 items** (`pnpm content status` → `approved=57`). That runbook is the source of truth for the wave receipt, the per-unit rhythm, recurring fixes, and the now-resolved song/band bank gap (§7). Next tracks (runbook §4): merge `feat/items-wave-g2`, then wire items into the trainer surfaces (the foundation harness — loader + all-format renderer + grader).
- v1 is live at `https://domigo-silk.vercel.app` (repo `VEHO-DOMI/domigo`, private).
- Latest corpus fix merged: [#41 — grammar matching data](https://github.com/VEHO-DOMI/domigo/pull/41)
  (all 115 `matching` items now render).
- The local iCloud working copy is **concurrently edited by other sessions + iCloud-synced** — do git
  work in a fresh `/tmp` clone (`gh repo clone VEHO-DOMI/domigo`), never in the iCloud tree.
