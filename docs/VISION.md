# DomiGo v2 — Vision (the durable why)

_Created 2026-07-06 with the completion-program blueprint (`docs/BLUEPRINT.md`). This file changes only when Koki changes his mind — sessions read it at boot (2 minutes) and must not violate it. STATUS_AND_ROADMAP.md is the live ledger; the blueprint is the program; this is the constitution._

## North star — the erase-the-teacher test (ages 10–14)

A Klasse 1–4 student can open DomiGo on a cheap phone and get from any starting point to A2+ mastery **without Koki in the room** — every concept taught before it is tested, every wrong answer turned into a transferable skill named in kid-German, every unit carried by story-pull, nothing above their level unglossed, and nothing they do able to lose their progress. Koki's class time converts to speaking and projects; parents can read honest progress in German.

Three vision tests applied to every merged PR (the weekly Vision log in BLUEPRINT.md):
1. **Standalone** — does this move a child closer to needing no teacher for it?
2. **Trust** — could this ever mark a correct child wrong, show them something untaught, or lose their progress?
3. **One brain** — does anything grade, score, or award outside `@domigo/engine` + `practice_attempts`?

## Binding principles (violating these fails the PR, whatever else it achieves)

1. MORE! 1–4 is the only content source; verify-don't-trust (generate → independent verify → deterministic validate → Koki-sample).
2. Level gate over every student-facing string incl. games/flavor/choices/teasers; du-form; zero meta/teacher-talk; glosses `(= deutsches Wort)`.
3. ONE grading brain; every economy is a re-skin of `xpForTier`; grading is forgiving AND correct (complete variant coverage).
4. Progress derives from `practice_attempts` server-side; saves are cosmetic (≤64KB, LWW, wipeable); failure changes pace, never position; timers only on mastered material.
5. Spaced retrieval is world physics — `getDueRefs` powers review, encounters, bosses, re-fog; review disguised as play.
6. Additive-only `domigo_v2` DDL; never touch `public.*`; one migration per PR, applied to dev before merge; prod DDL only via the runbook sitting.
7. Bulletproof: checkpoints ≤90s, offline outbox, no dead ends, class-scale-tested, no dead toggles.
8. Content is regenerable — fix at canonical source or the git overlays (`content/overlays/*-fixes.json`); never hand-edit generated JSON; Studio folds target the overlays, never generated corpus.
9. Student-data-first (minors): DSGVO posture, pseudonymous students, teacher-only real names, AI/telemetry disclosure before any released AI output.
10. The blueprint lives in-repo; code outranks docs; STATUS reconciled ≤3 merges behind; plans-dir and session memory are volatile scratch.
11. Koki's gates are sacred: he squash-merges every PR; register/voice gates precede authoring waves; blind-solve on key changes; fixed sampling tiers; never a bare `#N` in a commit message.

## Koki decision ledger (do not re-litigate; append with dates)

- **2026-07-06 · G4 narrative:** the three fantasy options (handover/13) REJECTED — "no rehash of grade 1 elements; a fully fresh angle rooted in a suitable real-life conflict for 14-year-olds." The program builds **"Lost for Words" / "Sprachlos"** (BLUEPRINT Part III.4), gated by G4-N.
- **2026-07-06 · v1 parity:** FULL Law-compliant port (arcades/speed modes as mastered-only fluency arcade; Daily Challenge; profile/badges/avatars; Word of the Day; dictionary; dark mode; dual-opt-in leaderboards; Activity Game later). v1's hint penalty is deliberately NOT ported (Law 4).
- **2026-07-06 · TTS:** ElevenLabs quality tier, per-character voices; pipeline provider-abstracted; costs printed per wave.
- **2026-07-06 · Timeline:** September 1, 2026 is a HARD go-live gate with the protected floor + pre-agreed forfeit order (BLUEPRINT Part V).
- **Standing (inherited):** grades 1–4 only; PWA-first; teacher hand-grades writing by default (AI correction is teacher-released); in-Studio task creation = never (the pipeline + blind-solve is the moat); XP/unlock math never editable in UI.

## Artifact roles

`docs/BLUEPRINT.md` = the program (workstreams, milestones, loops, gates — updated by strike-through, not rewrites) · `docs/VISION.md` = this constitution · `docs/STATUS_AND_ROADMAP.md` = live status ledger · `docs/handover/**` = the original design encyclopedia (13_g4_syntaxia.md is superseded by BLUEPRINT III.4) · `docs/runbooks/**` = operational how-tos · `~/.claude/plans/` + session memory = volatile, never authoritative.

## How to run a session (the loops, in one breath)

Boot: pull main → read this file + the BLUEPRINT status → verify docs vs `gh` → pick the topmost unblocked item → re-verify its spec against code → announce. Per PR: fresh branch, smallest-complete, full gate, Verification-honesty section, migration applied-to-dev-before-merge, leave the PR for Koki. Waves: worklist → template + calibration → **Koki register gate before volume** → agents draft → validators hard-fail → blind-solve on keys → fixed sampling → ≤1 unit/PR → stats in the PR body. Weekly: write the Vision-log verdict. Session end: passover (STATUS line, in-flight note, gate queue). Full text: BLUEPRINT Part IV.
