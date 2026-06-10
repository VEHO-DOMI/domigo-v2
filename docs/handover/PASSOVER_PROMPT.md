# PASSOVER PROMPT — paste this to start Fable

> Self-contained kickoff. Read the linked doc-set (`docs/handover/00_START_HERE.md` first) before
> building. This prompt embeds the non-negotiable guardrails so they travel with you.

---

You are taking over **DomiGo**, an EFL practice app for **Austrian AHS Klasse 1–4 (MORE! 1–4, level
A1→A2, ages ~10–14)** at the Gymnasium der Dominikanerinnen. A working **v1** exists (Next.js 16 + Neon
Postgres + NextAuth on Vercel, repo `VEHO-DOMI/domigo`, live at `https://domigo-silk.vercel.app`). Your
job: **rebuild it from scratch**, keeping the durable foundations and fixing what beta testing exposed.

## The mission
Rebuild DomiGo as a richer, **bulletproof** learning app for grades 1–4, **rooted entirely in the
original MORE! 1–4 textbooks**. **First** make the content correct and the student data complete (P0) — finish the move off the legacy
trainers + Firebase with **complete, "pixel-perfect" fidelity**: every content item, every mode/feature,
and all student data carried over and verified, nothing dropped or mangled (the legacy trainers + v1 are
the parity oracle for what must exist; note v1 itself dropped some legacy features — see Story mode).
**Then** build the new pillars: a guided **Study Path**, an engaging **Story/RPG mode**, teacher **Mock
Tests**, and **Listening**. Ship a **PWA on Vercel** first; document a native path. **Grades 1–4 only —
drop 5B** (5–8 are a separate app).

## Decisions already made (by Koki)
1. **Rebuild from scratch.** v1 is reference/prior-art. What carries forward: the corrected content
   corpus, the migrated student data, the task-format + grading specs, and the guardrails below.
2. **Content correctness + migration first (P0).** New pillars come after.
3. **PWA-first on Vercel**; native documented for later.

## Why this matters / what went wrong in beta
Real students tested v1 and hit **content** problems, not feature gaps: words they hadn't learned yet
(with no help), answers marked wrong though correct, a shaky DE↔EN translation task, and some formal
German. **A broken item in front of a real 10-year-old is the failure mode that matters.**

## GUARDRAILS (non-negotiable — re-read before every change)
1. **Source of truth = the MORE! 1–4 textbooks.** No invented content.
2. **Grades 1–4 only (A1→A2). Drop 5B.**
3. **Never show above-level vocabulary unglossed** — gloss inline on the same line: `word (= deutsches Wort)`.
4. **All student-facing German is informal "du"** (never "Sie/Ihnen/Ihre" as address).
5. **Answer-checking is forgiving + correct** — accept every variant correct *in the sentence*; accept
   multiple phrasings; **partial credit / half-XP** for near-synonyms; never demand a verbatim form that
   breaks the grammar.
6. **Translations correct both directions**, graded in the required direction.
7. **Zero meta/teacher-talk** on student surfaces.
8. **Verify, don't trust** — generate → independent verify → deterministic validator → Koki spot-check.
   Do NOT trust the existing corpus or any sub-agent import.
9. **Bulletproof for students** — never lose progress; no dead ends; no unanswerable items; test at class
   scale before go-live.
10. **Content is regenerable** — canonical source + validation gate, not hand-edited generated files.
11. **Privacy for minors** — nicknames + PIN, no student emails, realName teacher-only, opt-in social.

## Do P0 first
1. **Content rework, item by item** (~5,300 items), rooted in the textbooks, applying the rules above.
   Build a global **master vocabulary list** AND a per-unit **word bank** (words + phrases) from the
   MORE! master vocab lists; the per-unit bank defines the allowed vocabulary + level gate. Gate each unit on a green validator + Koki spot-check before any
   student sees it. (Details: `04_content_rework.md`, `07_task_formats.md`.)
2. **Finish the Firebase→Neon migration** — import students who signed up after 2026-05-17 without
   clobbering already-claimed accounts; keep the `/signin/migrate` claim flow working.
   (Details: `03_migration.md`.)

## Then the pillars (see `06_vision_pillars.md`)
Study Path (+ Smart Review) → Mock Tests (from Koki's Schularbeiten) → Listening (adapt the
`srdp-listening-comprehension` method down to A1–A2 + MORE! formats) → **Story/RPG mode — REWORK the
existing story/adventure/quest modes that live in the legacy trainers** (each grade's `index.html` has
them; v1 dropped them in the migration — study them as the starting point) into a far richer, engaging
experience: RPG mechanics, level design, ambition a navigable / possibly-3D world; tech spike first →
UX/UI overhaul → **explore hosting + "make it a real app" options**: ship an installable PWA on Vercel
first, then document/evaluate native (Capacitor wrapper or Expo/React-Native; App Store / Play Store).

## Where everything is
- **This doc-set:** `docs/handover/00_START_HERE.md` (read order inside). Mirror copy in iCloud at
  `…/Domi Gym/Claude/Cowork Space/Claude Code/DomiGo v2 Handover/`.
- **Full recap of everything v1 built/achieved** (the status-quo report Koki asked for):
  `01_status_quo.md` + `MASTER_BRIEF.md` — this prompt is the kickoff, not the recap.
- **Textbook + test + audio source material:** `05_source_materials_map.md` (exact paths per grade).
- **v1 reference:** repo `VEHO-DOMI/domigo`; legacy trainers at
  `Claude/Cowork Space/Claude Code/{1,2,3,4}*-grade-vocab-trainer/index.html`.
- **Original roadmap/prior handovers:** `~/.claude/plans/domigo-D14-tasks-and-handover.md` (+ the
  Phase-D / migration handovers).

## Working notes
- The iCloud `domigo` copy is **concurrently edited + iCloud-synced** — do all git work in a **fresh
  `/tmp` clone** (`gh repo clone VEHO-DOMI/domigo`), never in the iCloud tree.
- v1 corpus is **generated** from the legacy trainers (`npm run extract:content`); for v2, author into a
  MORE!-transcript → corpus pipeline + validator instead (don't hand-edit generated JSON).
- CI required check is `lint-and-typecheck`; the Vercel preview check fails on every PR (Neon free-tier
  branch cap) — that's infra, not your code.

Start by reading `00_START_HERE.md`, then `04` and `08`. Ask Koki the open decisions in
`09_roadmap_and_open_decisions.md` (esp. the interim beta vehicle) before committing to architecture.
