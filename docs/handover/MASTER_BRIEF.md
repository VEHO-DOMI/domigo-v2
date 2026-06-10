# DomiGo v2 — Master Handover & Rebuild Brief (for Fable)

> **Post-review refinements (2026-06-10):** docs `00`–`09` + `PASSOVER_PROMPT.md` carry three additions
> made after a scope re-check — (1) **Story mode is a REWORK of the existing legacy-trainer
> story/adventure modes** that v1 dropped, not greenfield (`01`, `06`/3.3); (2) the migration must be a
> **complete, "pixel-perfect" import** — every item/mode/feature/student carried over and diffed against
> the legacy trainers (`03`); (3) the platform step is an explicit **hosting / "real app" exploration**
> (`06`/3.8). Those docs are authoritative where this snapshot differs.

> **What this is.** A complete account of what DomiGo is today, every problem found in beta, and the
> full forward vision — written so **Fable** can pick it up cold and **rebuild the project from
> scratch**, grounded in the original MORE! 1–4 textbooks. It is both the recap Koki asked for and the
> execution spec for the handover doc-set + passover prompt that get written into the folders.

---

## Context — why this exists

DomiGo is an EFL (English as a Foreign Language) practice app for Koki's students at the Gymnasium der
Dominikanerinnen — **Austrian AHS, Klasse 1–4 only, level A1 → A2** (ages ~10–14). It is the unified
successor to four legacy single-file HTML "vocab trainer" apps (`{1st,2nd,3rd,4th}-grade-vocab-trainer`)
that were Firebase-backed and deployed on GitHub Pages.

A working v1 exists (Next.js 16 + Neon Postgres + NextAuth, on Vercel) with a large vocab+grammar
corpus, full gamification, a teacher admin panel, and a Firebase→Neon student-migration pipeline.

**It just went into beta with real students, and that surfaced content-quality problems** (vocabulary
above the students' level with no help, over-strict answer checking, a shaky translation task, formal
German where it should be informal). Koki's decision: hand the whole thing to **Fable for a
from-scratch rework** that keeps the hard-won foundations (the **textbook-rooted content**, the
**migrated student data**, the **specs and guardrails** in this handover) and rebuilds the app around a
much richer experience — a guided **Study Path**, an engaging **Story/RPG mode**, teacher **Mock
Tests**, **Listening**, and a path to an installable / native app.

### Decision log (confirmed by Koki, 2026-06-10)
1. **Approach = rebuild from scratch.** v1 is reference/prior-art. The durable assets that carry
   forward are the corrected content corpus, the migrated data, the task-format + grading specs, and
   the guardrails below — not the v1 app shell.
2. **Priority = content correctness + migration first.** P0 is making the content bulletproof and the
   data complete; the new pillars (Study Path, Story/RPG, Mock Tests, Listening, native) come after.
3. **Platform = PWA-first on Vercel**, with native/App-Store paths documented for later.
4. **Docs location = repo `docs/handover/` + a copy in the iCloud `Domi Gym 2025:26/KI/` folder.**

> **Tension to resolve early (flag for Koki + Fable):** "rebuild from scratch" + "bulletproof student
> beta very soon" can't both be true of the *same* app at once. Recommended reading: the **content
> corpus + migrated data are the P0 deliverables** (they are app-agnostic and survive the rebuild), and
> the **current v1 app is the interim beta vehicle / reference** while Fable architects v2. Confirm
> whether students beta-test on hardened-v1 or wait for v2. See Part 7.

---

## PART 1 — STATUS QUO: everything that exists today (v1 reference implementation)

> Source of truth for this section: the live repo `VEHO-DOMI/domigo` (`main`), prod
> `https://domigo-silk.vercel.app`. Local working copy (iCloud, **concurrently edited — see warnings**):
> `Domi Gym/Claude/Cowork Space/Claude Code/domigo`. Most recent corpus fix shipped:
> [#41 grammar-matching data](https://github.com/VEHO-DOMI/domigo/pull/41) (2026-06-10).

### 1.1 Stack & deployment
- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**, **Tailwind v4**.
- **NextAuth v5** (Credentials, JWT 30-day, bcryptjs cost 12) — student + teacher providers.
- **Neon Postgres** (`@neondatabase/serverless` HTTP driver) + **Drizzle ORM 0.45**.
- **Server Actions** for all mutations; static JSON content under `data/{vocab,grammar,activity,arcade}/`.
- **Vercel** hosting; per-PR Neon preview branches. CI = `lint-and-typecheck` (the only required check).
  **Known infra wart:** Neon free-tier 10-branch cap makes the **Vercel preview check fail on every
  PR** — not a code problem; production deploys from `main` are unaffected.

### 1.2 Routes (current app map)
- **Auth/landing:** `/` (landing/redirect), `/signin` (student: class code + nickname + 6-digit PIN),
  `/signin/migrate` + `/signin/migrate/complete` (legacy DomiGo claim), `/admin/signin` (teacher),
  `/signout`.
- **Student:** `/home` (dashboard), `/onboarding`, `/profile`, `/profile/settings` (avatar).
- **Vocab:** `/vocab`, `/vocab/[grade]/[unit]` (mode tiles), `/vocab/[grade]/[unit]/play`,
  `.../memory-match`, `.../word-hunt`, `.../spelling-bee`, `/vocab/[grade]/dictionary` (Wörterbuch).
- **Grammar:** `/grammar`, `/grammar/[module]` (by-topic / by-task tabs), `/grammar/[module]/play`,
  `.../blitz`, `.../anagram`, `.../matching-pairs`, `.../group-sort`.
- **Other:** `/activity/[grade]` (+`/play`,`/results` — team "Draw/Show/Explain" game), `/daily`
  (daily challenge), `/leaderboard`.
- **Teacher:** `/admin` (classes), `/admin/classes/[code]` (roster + feature toggles + PIN reset),
  `/admin/legacy-map` (Firebase-slug→Neon-class mapping). API: `/api/auth/[...nextauth]`.

### 1.3 Game modes inventory + build status
**Vocab (per grade → unit):**
- `full` (every word, mixed Q-types) ✅ · `sprint` (10 random) ✅ · `speed` (60s timed) ✅ ·
  `mc` (4-option) ✅ · `flashcards` (study, no XP) ✅.
- Arcade: **Memory Match** ✅ · **Word Hunt** ✅ · **Spelling Bee** ✅.
- **Dictionary / Wörterbuch** (browse + search all words, examples) ✅.

**Grammar (per module m1–m4):**
- **Play** (one-question practice) supporting **9–10 item types** ✅ (gap-fill, multiple-choice,
  error-correction, transformation, translation, free-form, question-formation, context-picker,
  sentence-building, + **matching** now playable after #37/#41).
- Arcade: **Blitz** (60s) ✅ · **Anagram** ✅ · **Matching Pairs** ✅ · **Group Sort** ✅. (Several of
  these are recent / were being actively edited during this handover — treat their polish level as
  "fresh," verify before relying on them.)

**Other:** **Activity Game** (team Draw/Show/Explain) ✅ · **Daily Challenge** (10-item deterministic
per class/day) ✅.

### 1.4 Gamification
- **XP** per attempt (type-weighted, e.g. context 8 / definition 10 / translation 7 / MC 3–5), **combo
  multipliers** (1×→1.5×→2×→3×), **session bonuses** (perfect +20, streak bonus), **hint penalty**.
  Separate **vocab XP** and **grammar XP** pools. (`lib/xp.ts`, `lib/xp-formulas.ts`.)
- **Levels 1–30+** with **prestige** tiers; **class level** aggregates the class.
- **Streaks** (Vienna-day based, DST-safe). **50+ badges** (`data/badges.json`; ~16 wired, rest
  deferred until their features ship). **50 avatars**. **Leaderboard** (opt-in). **Home dashboard** +
  **Profile**.

### 1.5 Teacher / admin
- Create classes (grade 1–4), invite codes, student roster with stats, **8 per-class feature toggles**
  (vocab, grammar, daily, smart-review, leaderboard, battle, class-quiz, buddies), PIN reset, archive,
  legacy-class mapping wizard.

### 1.6 Units & content scope (grades 1–4, MORE! 1–4)
| Grade | Module | Vocab units | Grammar structures | Grammar items |
|---|---|---|---|---|
| 1 | m1 | 15 | 34 | 858 |
| 2 | m2 | 15 | 22 | 442 |
| 3 | m3 | 14 | 18 | 606 |
| 4 | m4 | 13 | 15 | 599 |

~**2,800 vocab words** and ~**2,505 grammar items** total. (`matching` = 115 items across modules,
all now renderable.) **Grammar modules are cumulative** — a Grade-3 student gets m1+m2+m3.

### 1.7 Content data model + item types + grading (the spec to re-port)
- **Vocab entry** (`lib/vocab-types.ts`): `w` headword · `g` German · `d` English definition (must NOT
  leak the headword) · `s` example sentence with `_____` blank · `a?` alternates · `cf?` canonical form
  (e.g. "play" for "to play") · `mc?` MC distractors · `col?` collocations (unused).
- **Grammar item** (`lib/grammar-types.ts`): `id · sid` (structure) · `u` unit · `t` type · `d`
  difficulty · `p` prompt · `c` canonical answer · `a?` alternates · `ds?` distractors/right-options ·
  `h?/hd?` hint EN/DE · `e?/ed?` explanation EN/DE · `strict?` exact-match flag.
- **Item/task types** (`t`) + grading (`lib/grammar-grading.ts`, `lib/vocab-grading.ts`):
  - **Text-input** (gap-fill, error-correction, transformation, translation, free-form,
    question-formation): exact + alternates + **Levenshtein "close"** (grammar 15% / vocab 20% budget,
    cap 2) + **partial-match fallback** (≥40% length, ≥2 words) for the free-text grammar types.
  - **Button** (multiple-choice, context-picker): exact only.
  - **sentence-building:** chip order, exact + Levenshtein, no partial.
  - **matching:** `c` is a JSON map `{"1":"b",…}`; all-or-nothing.
  - **anagram / group-sort / matching-pairs:** arcade-rendered (data shapes documented in
    `~/.claude/plans/domigo-D14-tasks-and-handover.md`).
  - **"close" = 50% XP**; alternates = full credit. **No near-synonym / half-credit beyond "close."**
- **Content is GENERATED, not hand-authored** (critical): `data/vocab/**` + `data/grammar/m*.json` are
  produced by `npm run extract:content` from the legacy trainers' inline `vocabData`/`grammarItems`
  (`scripts/migrate/extract-content.mjs` → `shared/extract-from-html.mjs`, idempotent). Hand-edits to
  the JSON are clobbered on the next run. The only hand-authored override layer is
  `scripts/migrate/cleanups/vocab-leak-fixes.json`. **For v2, decide a cleaner authoring source of
  truth — ideally regenerate the corpus directly from the MORE! textbook transcripts** (Part 3.1).

### 1.8 Database schema (Neon / Drizzle — `lib/db/schema.ts`)
`classes` (grade, invite code, 8 feature flags, `reservedTaskSlugs`) · `users` (students+teachers, role,
`pinHash`, `classId`, xp/grammarXp/level/streak/`lastSessionDate`, avatar, social/leaderboard opt-ins,
`onboardedAt`) · `legacy_students` (migration staging: legacy slug/username/pin-kind, snapshot xp/badges
/streak, `firebaseRawDoc`, `migratedAt`, `newUserId`) · `class_legacy_map` (Firebase slug → Neon class)
· `vocab_attempts` · `grammar_attempts` · `speed_round_sessions` · `grammar_blitz_sessions` · `badges`
+ `badge_awards` · `daily_challenges` + `daily_challenge_attempts`. UUID PKs, TZ timestamps, sensible
indexes.

### 1.9 Auth
Two NextAuth Credentials providers. **Student** = invite code + nickname + 6-digit PIN (unique
case-insensitive per class). **Teacher** = nickname + 4–6 digit PIN. JWT 30-day; `middleware.ts`
enforces student→`/home`, teacher→`/admin`, un-onboarded student→`/onboarding`. PINs bcrypt cost 12.

### 1.10 Firebase → Neon migration (status + the pending piece)
3-step pipeline (`scripts/migrate/`): `export-firebase` (Firestore → `exports/<ts>/*.json`) →
`build-legacy-students` (JSON + `class_legacy_map` → idempotent SQL) → `apply-legacy-students` (→ Neon
`legacy_students`). A migrated student **claims** their account at `/signin/migrate` (legacy username +
4-digit PIN → set new 6-digit PIN → XP/badges/streak copied over).
- **Done:** 2026-05-17 export of **110 students** across 12 class slugs (1st-grade … 4c), VEHO teacher
  owns 12 classes, slug map populated. PIN quirk: VEHO @ 3rd-grade = `1234`, elsewhere `1304`.
- **PENDING (Koki's "new data imported"):** students who registered in Firebase **after 2026-05-17**
  are **not** in Neon yet. v2 must **re-export → re-build → re-apply** (idempotent, `ON CONFLICT DO
  NOTHING`) to capture them, and preserve already-claimed accounts. Confirm the cutover date and whether
  any students have already claimed in Neon (don't clobber their new PINs/progress).

### 1.11 Flagged-but-unbuilt (DB flags + admin toggles exist; backends do not)
**Battle Arena** (live duels) · **Class Quiz** (Kahoot-style) · **Smart Review** (spaced repetition) ·
**Study Buddies** (pair messaging). All are Wave-5 "planned," **not implemented**. Pusher env vars are
stubbed. v2 decides which to build (Part 3.7).

---

## PART 2 — KNOWN PROBLEMS (beta testing) — the P0 content defects

Grounded in the v1 corpus + grading code. **This is the heart of P0.**

1. **Vocabulary above the students' level, no gloss.** Lower-grade example/context/definition sentences
   contain words a beginner can't infer. *Evidence:* G2 Unit 3 uses "tradition", "century", "carols",
   "apple bobbing" with no help. **Rule:** any word above the unit's A1/A1+ level that appears in a
   student-facing sentence gets an **inline gloss on the same line**, format **`(= deutsches Wort)`**.
2. **Over-strict answers / verbatim phrase breaks the sentence.** Items were built around the exact
   vocab-list form, but some carrier sentences require a *different* inflection/word-order — yet only the
   verbatim list form is accepted, which breaks the grammar. **Rule:** the accepted answer must be the
   form that is *correct in the sentence*; accept **all valid variants**; never force a form that makes
   the sentence ungrammatical.
3. **Translation task is shaky (DE↔EN).** Direction handling and answer alignment need a full audit —
   confirm every translation item's German and English are both correct and that grading accepts the
   natural variants in the required direction.
4. **Formal "Sie" in German meta-text.** Hints/instructions occasionally use formal register. **Rule:**
   all student-facing German uses informal **"du"** (never "Sie/Ihnen/Ihre" as address).
5. **No reward for near-misses beyond "close".** A near-synonym or a different-but-valid phrasing is
   marked wrong. **Rule:** accept **multiple correct iterations**; award **partial credit / half-XP**
   for a near-synonym or acceptable alternative phrasing (extend the existing "close"=50% mechanism to
   semantic near-matches, not just typos).
6. **`matching` is all-or-nothing** (3/4 pairs right → 0 XP). Consider partial credit in v2.
7. **Methodology warning (Koki, explicit):** the corpus was built by importing word lists and
   generating items around them — **do not trust that import / sub-agents got each item right.** v2
   must audit **case-by-case, item-by-item**, rooted in the textbook, with human-grade validation.

---

## PART 3 — THE VISION: what v2 builds

### 3.0 Scope guardrail
**Grades 1–4 (MORE! 1–4) ONLY. Drop 5B entirely** — grades 5–8 live in a separate app/infrastructure.
The `5b-vocab-trainer` is *not* wired into DomiGo today; just never reintroduce it.

### 3.1 Foundational — textbook-rooted content (the bedrock)
Everything must be **sourced from the original MORE! 1–4 textbooks** (Part 5 has the full map):
- A **master vocabulary list** and a **per-unit "word bank" (words + phrases)** for *every* unit of
  every grade, derived from the SB/WB transcripts + the publisher master vocab lists — the canonical
  source the whole app draws from.
- Re-derive (or validate) the practice corpus from these transcripts so vocab, definitions, example
  sentences, and grammar are textbook-faithful and level-appropriate (apply Part 2 rules during
  derivation).
- Recommended for v2: make the **textbook transcript → corpus** pipeline the explicit source of truth
  (replacing the legacy-HTML-trainer extraction), with a review/validation gate.

### 3.2 P0 — item-by-item content rework methodology
For **every** vocab entry and grammar item (~5,300 items): verify against the textbook; fix level
(gloss above-level words `(= …)`); fix over-strict answers (accept all sentence-correct variants); add
near-synonym alternates with partial credit; audit translations both directions; convert any "Sie" to
"du"; keep student-facing text free of meta/teacher-talk. **Process:** orchestrate with sub-agents for
throughput **but adversarially validate every change** (the user explicitly does not want blind trust)
— e.g. a generate→independent-verify→spot-check-by-Koki loop, with a deterministic validator (like the
matching-renderer check in #41) wherever the format allows.

### 3.3 Study Path (guided, game-like progression)
A linear, unlockable path through a unit so a student can "**play through the entire unit and learn via
every task type**," not just pick a free-choice mode:
- Per unit: **intro to the vocabulary** → **intro to the grammar** → graduated **practice across all
  task types** with varied **contexts** (not just the basic templates today) → a unit **checkpoint**.
- Game-feel: a visible map/path, stars/mastery per node, unlock-on-completion, spaced re-practice
  (fold in **Smart Review**). This is the "study path" half of the experience.

### 3.4 Story / RPG Mode (the engagement half — "sky's the limit")
A genuinely engaging narrative experience for the age group (≈10–14): **interactive elements, RPG
mechanics, level/world design — ambition includes a navigable (potentially 3D) world** where students
move through environments and solve language tasks woven into the story. This is greenfield; capture it
as a design brief with directions + a tech spike (2D scene engine vs. lightweight 3D e.g.
Three.js/React-Three-Fiber/Phaser; scope vs. effort; how tasks embed in scenes). Story content still
roots in the unit's vocab/grammar so it doubles as practice.

### 3.5 Mock Test mode (teacher-curated)
Let **Koki assemble and assign a mock test** mirroring his real Schularbeiten: pick from item banks
(Vocab / Grammar / Listening / Reading / Writing) per the MORE! Test-Builder structure, assign to a
class, auto- or hand-grade, return results. **Source:** the Schularbeiten archives + Test-Builder task
libraries (Part 5). Reuse the real test formats so practice ≈ the actual exam.

### 3.6 Listening comprehension
New skill area, **A1–A2, MORE!-faithful**. Methodology is borrowed from the **`srdp-listening-comprehension`** skill (which, for B1/B1+, finds a fitting passage, scrapes its transcript, and
generates tasks in the textbook's format) — **adapt it down to A1–A2 and the MORE! 1–4 LC task formats**
(use the Test-Builder LC sections + MORE! audio scripts as the format oracle). Lay out all LC task
formats explicitly (Part 6). Audio sourcing (use MORE! Test-Builder audio vs. TTS) is an open decision.

### 3.7 Complete the flagged features (as desired)
Decide which of **Smart Review** (strongly recommended — pairs with Study Path), **Battle Arena**,
**Class Quiz**, **Study Buddies** to actually build vs. drop. Don't ship dead toggles.

### 3.8 UX / UI overhaul
Full redesign pass for delight + clarity for the age group; consistency, motion, feedback, dark mode,
accessibility, mobile-first. Treat v1's look as a starting reference, not a constraint.

### 3.9 Platform — PWA-first → native
Ship an **installable PWA on Vercel** (offline-tolerant, home-screen install, fast on cheap phones).
**Document** the native path for later: Capacitor wrapper or Expo/React-Native, App-Store/Play-Store
requirements, push notifications, what would need to change. PWA gets students playing now without
store friction.

### 3.10 Migration completion
Re-run the Firebase→Neon pipeline to import post-2026-05-17 signups; verify no already-claimed account
is clobbered; keep the legacy-claim flow working; plan Firebase decommission once stable.

---

## PART 4 — DESIGN PRINCIPLES & GUARDRAILS (the "design posts" — durable, embed in the passover prompt)

1. **Source of truth = the MORE! 1–4 textbooks.** Every word, sentence, rule, and test format traces to
   the SB/WB transcripts, master vocab lists, check-ups, or Schularbeiten. No invented content.
2. **Grades 1–4 only. Drop 5B.** A1 → A2. Age-appropriate (≈10–14).
3. **Never show above-level vocabulary unglossed.** Above-level word in a student-facing sentence →
   inline **`(= deutsches Wort)`** on the same line.
4. **All student-facing German is informal "du."** No "Sie/Ihnen/Ihre" as address.
5. **Answer-checking is forgiving and correct.** Accept every variant that is correct *in the
   sentence*; accept multiple iterations; **partial credit / half-XP** for near-synonyms or valid
   alternative phrasings; never demand a verbatim form that breaks the grammar.
6. **Translations correct in both directions**, graded in the required direction with natural variants
   accepted.
7. **Student-facing = zero meta/teacher-talk.** Keep teacher rationale in teacher-only surfaces.
8. **Item-by-item rigor; verify, don't trust.** No blind faith in imports or sub-agents — adversarial
   validation + spot-checks, because a broken beta fails with real students.
9. **Bulletproof for students.** Data safety (never lose progress), graceful failure, no dead ends, no
   unanswerable items, tested at class scale before each go-live.
10. **Content lives in a regenerable pipeline**, not hand-edited generated files; one canonical authoring
    source with a validation gate.

---

## PART 5 — SOURCE MATERIALS MAP (where to root everything)

All under `…/Domi Gym/Domi Gym 2025:26/`:
- **MORE! 1 (G1):** `1ABC (2025:26)/MORE 1/` — `MORE 1 SB FULL.docx`, per-unit `MORE 1 SB
  Transcription/` (18) + `MORE 1 WB Transcription/` (17), `MORE1_Master_Vocabulary_List_Units_1-15.docx`,
  `MORE1 SB Screenshots/` (147 imgs). SB Grammar Appendix included.
- **MORE! 2 (G2):** `2A (2025:26)/MORE 2 Materials & Resources/MORE 2 TRANSCRIPT/` (30 SB+WB),
  `Full Vocabulary List MORE 2 Units 1-15.docx`, per-unit folders `Units MORE 2 (2025:26)/` (with
  Check-ups), `2A Schularbeiten (2025:26)/` (4 SAs + archive), Test-Builder audio. (Backup copy:
  `Claude/HTML Examples/MORE 2 TRANSCRIPT/`.)
- **MORE! 3 (G3):** `3A (2025:26)/MORE 3 Materials & Resources/MORE 3 NEW EDITION/MORE Transcript SB & WB
  Units/` (28), `Full Vocabulary List MORE 3 Units 1-14.docx`, `Units MORE 3 (2025:26)/` (14 + Check-ups),
  `3A Schularbeiten (2025:26)/`, Test-Builder + Task Library.
- **MORE! 4 (G4):** `4B (2025:26)/MORE 4 Materials & Resources/MORE 4 AKTUELLE EDITION/MORE 4 Transcript
  SB & WB Units/` (28), `Full Vocabulary List MORE 4 Units 1-13.docx`, `Units MORE 4 (2025:26)/` (+
  Check-ups), `4B Schularbeiten (2025:26)/`, Test-Builder + Task Library.
- **Cross-grade:** `EFL Allgemein/Vocabulary instructions_traffic light.pdf` (vocab-learning framework);
  per-unit **Check-ups** and **Schularbeiten archives** per grade (mock-test source); **Test-Builder
  audio** (listening source).
- **Legacy oracle (current behavior/parity):** `Claude/Cowork Space/Claude Code/{1,2,3,4}*-grade-vocab-trainer/index.html` and the v1 repo.
- **Past handovers (original roadmap, Phases A–E):** `~/.claude/plans/` —
  `domigo-D14-tasks-and-handover.md`, `SESSION_HANDOVER_PHASE_D.md`, `phase-d-feature-port.md`,
  `handover-next-zazzy-scott.md`.

---

## PART 6 — TASK / ITEM FORMAT CATALOG (the engine spec)

**Carry forward (with the Part 2 fixes):** gap-fill · multiple-choice · matching · error-correction ·
transformation · translation (DE↔EN) · free-form · question-formation · context-picker ·
sentence-building · anagram · group-sort · matching-pairs · (verb-table, minor).

**Add for v2 (root each format in the MORE! Test-Builder / SRDP oracle):**
- **Listening (A1–A2):** multiple-choice, true/false, gap/sentence-completion, matching
  speakers/sentences, short-answer — mirror MORE! Test-Builder LC. (Methodology from
  `srdp-listening-comprehension`, leveled down.)
- **Reading comprehension** (for Mock Tests): MORE!/SRDP-style RC items.
- **Writing** (for Mock Tests): prompt + rubric (teacher-graded; auto-assist optional).
- **Study-Path task variety:** richer/varied *contexts* per type (not the single basic template
  today), plus intro/teaching cards for vocab + grammar.

Document, per format: data shape, render, grading (incl. partial-credit policy), and which
skill/textbook source it roots in.

---

## PART 7 — RECOMMENDED ROADMAP & OPEN DECISIONS

**Sequencing (P0 → vision):**
1. **P0 — Bulletproof the foundation:** (a) item-by-item content rework rooted in the textbooks (Part
   3.1–3.2, all Part 4 rules); (b) finish the migration of post-May-17 signups; (c) UX/UI hardening of
   the interim beta vehicle. Gate: a "bulletproof-beta checklist" passes at class scale.
2. **Build the durable pillars:** Study Path (+ Smart Review) → Mock Tests → Listening.
3. **Story/RPG mode** (tech spike first) and **PWA install**; then evaluate native.
4. **Decide on Battle/Quiz/Buddies**; remove dead toggles either way.

**Open decisions for Koki + Fable:**
- **Interim beta vehicle:** hardened-v1 now vs. wait for v2 (given "rebuild from scratch" + imminent
  beta). *Recommend hardened-v1 for the imminent test; v2 in parallel.*
- **v2 stack/architecture** (esp. if Story/RPG needs a game engine; PWA + future native).
- **Story-mode scope & tech** (2D vs. lightweight 3D; how big).
- **Listening audio source** (MORE! Test-Builder audio rights vs. TTS).
- **Authoring source of truth** for the regenerated corpus (transcripts → corpus pipeline shape).
- **Native timing** (PWA-only vs. Capacitor/Expo, and when).

---

## PART 8 — THE DELIVERABLE (what gets written on approval)

On approval, write a **handover doc-set** to **`docs/handover/`** in the repo **and copy it to**
`…/Domi Gym/Domi Gym 2025:26/KI/DomiGo v2 Handover/`. Each file below is one of the "design posts":

- `00_START_HERE.md` — orientation, decision log, read order, links to source materials + this brief.
- `01_status_quo.md` — Part 1 (full v1 recap: routes, modes, gamification, admin, units/counts).
- `02_architecture_and_data_model.md` — stack, DB schema, auth, content model, item types + grading,
  the generation pipeline.
- `03_migration.md` — Firebase→Neon pipeline + the pending new-signup import + cutover/decommission.
- `04_content_rework.md` — Part 2 + Part 3.1–3.2: the P0 item-by-item methodology + rules + validation.
- `05_source_materials_map.md` — Part 5 (textbook/test/audio paths per grade).
- `06_vision_pillars.md` — Part 3.3–3.9 (Study Path, Story/RPG, Mock Tests, Listening, flagged
  features, UX/UI, platform).
- `07_task_formats.md` — Part 6 (format catalog + engine spec).
- `08_design_principles.md` — Part 4 (guardrails — the durable "design posts").
- `09_roadmap_and_open_decisions.md` — Part 7 + the **bulletproof-beta checklist**.
- `PASSOVER_PROMPT.md` — the single kickoff message to start Fable: a tight summary of the mission
  (rebuild from scratch, P0 content+migration, PWA-first), **the Part 4 guardrails inline**, the
  decision log, and pointers to the doc-set + source materials.

(This plan file *is* the master source for all of the above; execution = split/expand it into the
doc-set + passover prompt + iCloud copy.)

---

## Verification (how we know the handover is good — and how Fable verifies the work)

**Handover completeness (on write):** all 11 files present in `docs/handover/` + mirrored in the iCloud
KI folder; `PASSOVER_PROMPT.md` opens cleanly cold and embeds the guardrails; every claim in Part 1
cross-checked against the live repo; all source-material paths in Part 5 resolve.

**Content rework (Fable's P0 gate, per unit before any go-live):**
- A deterministic validator passes for every machine-checkable format (e.g. the matching-renderer check
  from #41; no unanswerable items; every blank has a sentence-correct accepted answer set).
- Sampled human review by Koki: no above-level word without `(= …)`; no "Sie"; translations correct
  both ways; near-synonyms accepted with partial XP; no verbatim-form-breaks-sentence cases.
- Every per-unit **word bank** matches the textbook master vocab list.

**Migration:** re-run export→build→apply; assert post-May-17 students now in `legacy_students`, zero
already-claimed accounts clobbered, a test claim still works end-to-end.

**Bulletproof-beta checklist (before students):** auth (student + teacher + legacy claim) works; no
route 500s; progress persists across sessions; no dead ends/unanswerable items; mobile + offline-tolerant
PWA; tested at class scale (≈30 concurrent).

---

### Operational note for whoever executes this
The iCloud `domigo` working copy is **concurrently edited by another session + iCloud-synced** (observed
mid-session: branch flips, files changing live). Do all git work in a **fresh `/tmp` clone**
(`gh repo clone VEHO-DOMI/domigo`); only write the iCloud *handover copy* directly into the KI folder.
The legacy trainers are outside the repo; corpus changes go through the regenerable pipeline, not raw
JSON edits. (See memories: `project_domigo_shared_clone_hazard`, `project_domigo_corpus_generated`.)
