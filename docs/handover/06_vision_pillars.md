# 06 — Vision Pillars (what v2 builds after P0)

After the content is correct (`04`) and the data is complete (`03`), build these. All content roots in
the MORE! 1–4 textbooks (`05`) and obeys the guardrails (`08`).

## 3.1 Foundational — textbook-rooted content + per-unit word bank (do this first, it underpins all)
- Produce a **master vocabulary list** and a **per-unit "word bank" (words + phrases)** for **every unit
  of every grade**, derived from the MORE! master vocab lists + SB/WB transcripts. This is the canonical
  source the whole app draws from and the level gate for `04`.
- Re-derive/validate the practice corpus from the transcripts (textbook-faithful, level-correct) through
  a regenerable pipeline + validation gate.

## 3.2 Study Path (guided, game-like progression)
A linear, unlockable path through each unit so a student can **play the whole unit and learn via every
task type**, not just free-pick a mode.
- Per unit: **vocabulary intro** (the word bank, taught) → **grammar intro** (the unit's structures,
  taught — not just drilled) → **graduated practice across all task types** with **varied contexts**
  (not the single basic template v1 uses) → **unit checkpoint** (from the Check-up material).
- Game feel: a visible path/map, per-node stars/mastery, unlock-on-completion, and **spaced re-practice**
  (this is where **Smart Review** lives). The "learn" spine of the app.

## 3.3 Story / RPG Mode (the engagement spine — "sky's the limit")
A genuinely fun narrative experience for ages ~10–14, distinct from the Study Path.
- **Not greenfield — REWORK what already exists.** The legacy trainers each ship a story / adventure /
  quest mode (`{1,2,3,4}*-grade-vocab-trainer/index.html`, ~11–24 references each) that **v1 dropped in
  the migration**. Study these as the baseline and expand far beyond them — this is what Koki means by
  "the story modes need to be reworked."
- **Interactive elements, RPG mechanics, level/world design** — the ambition includes a **navigable
  (potentially 3D) world** the student moves through, solving language tasks woven into the story.
- Story content still draws on the unit's vocab/grammar, so play = practice.
- **Start with a tech spike + design brief:** 2D scene engine vs. lightweight 3D (e.g. Phaser, or
  React-Three-Fiber/Three.js); how tasks embed in scenes; art/asset pipeline; scope vs. effort; how it
  shares the content engine with Study Path. Decide scope with Koki before committing build effort.

## 3.4 Mock Test mode (teacher-curated)
Let **Koki assemble and assign a mock test** that mirrors his real Schularbeiten.
- Teacher picks from **item banks** (Vocab / Grammar / Listening / Reading / Writing) per the MORE!
  Test-Builder structure, assigns to a class, sets timing; the app auto-grades the objective parts and
  supports hand-grading writing; results return to teacher + student.
- **Source:** the `Schularbeiten` archives + `Test Builder` task libraries (`05`). Reuse the real exam
  formats so practice ≈ the real test. (Reading/Writing formats may borrow from the
  `srdp-reading-comprehension` / writing skills, leveled to A1–A2.)

## 3.5 Listening comprehension (new skill)
A1–A2, MORE!-faithful.
- **Methodology** from the `srdp-listening-comprehension` skill (finds a fitting passage, scrapes its
  transcript, generates tasks in the book's format) — **adapt it down** to A1–A2 and the **MORE!
  Test-Builder LC formats** (use the LC subsections + MORE! audio scripts as the format oracle).
- **Task formats** to support: see `07` (multiple-choice, true/false, gap/sentence-completion, matching
  speakers/sentences, short-answer).
- **Open decision:** audio source — MORE! Test-Builder audio (rights?) vs. generated TTS.

## 3.6 Complete or drop the flagged features
v1 has dead toggles. Decide and either build or remove: **Smart Review** (recommended — pairs with Study
Path), **Battle Arena** (live duels), **Class Quiz** (Kahoot-style), **Study Buddies** (pair messaging).
Don't ship toggles with no backend.

## 3.7 UX / UI overhaul
A full redesign pass for delight + clarity for the age group: consistent design system, motion, instant
feedback, dark mode, accessibility (young readers), mobile-first, no dead ends. Treat v1's look as a
reference, not a constraint.

## 3.8 Platform — explore hosting + "make it a real app" (PWA-first → native)
This is Koki's ask to *explore different hosting options / build it into an actual app on the app
stores*. Recommended path (decide native timing with Koki):
- Ship an **installable PWA on Vercel**: offline-tolerant, home-screen install, fast on cheap phones,
  no app-store friction → students play immediately.
- **Document** the native path for later: Capacitor wrapper (fastest reuse of the web app) or Expo/
  React-Native; App-Store / Play-Store requirements; push notifications; what changes. Decide native
  timing with Koki.

## 3.9 Migration completion (also P0 — see `03`)
Re-run Firebase→Neon to import post-2026-05-17 signups without clobbering claimed accounts; keep the
claim flow live; plan Firebase decommission.
