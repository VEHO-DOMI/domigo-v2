# 11 — Remaining work (B2b · Content waves · TTS · the grade games)

> **⚠ 2026-06-28 status.** Since this doc was written, **Track C shipped two games to `main`**: the **G1 overworld RPG** (5 zones — §4 below is now **DONE**) and the **G2 "The Wrong Name"** detective game (15 chapters + Clues/Evidence/Case economy + wired ligne-claire art + a task-ui a11y pass; PRs #40–#49, no open PRs). The G2 **pedagogy upgrade** is mid-flight — see plan `~/.claude/plans/domigo-v2-velvet-squid.md` Part 6 and the paste-ready **[`12_g2_passover.md`](12_g2_passover.md)**. Still open from this doc: **§1 B2b**, **§2 content waves**, **§3 TTS**. Still ahead in Track C: **G3 FOURTEEN + G4 Syntaxia**, plus a cheap-Android perf pass before go-live.

> **How to use this doc.** DomiGo v2's full P1 learning track is built and verified (see `STATUS_AND_ROADMAP.md`). Four things remain. Each section below is **self-contained** — a fresh session can pick up **one** of them cold. Work in `~/Code/domigo-v2`. **Read `08_design_principles.md` (the 11 guardrails) before any change.** Pick by priority: B2b (small, closes the Mock-Test loop) · content waves (large, multi-session) · TTS (small) · Track C / G1 RPG (the September headline — its full design is `10_game_layer.md`).

---

## 0. Where v2 stands (the foundation you build on)

Next 16 / React 19 pnpm monorepo. Grades 1–4 EFL (MORE! 1–4, A1→A2), PWA-first, go-live **Sept 2026**.

**Merged to `main`:** content (57 units / 5,898 items, [#17]) · foundation harness ([#18]) · Smart-Review backend ([#19]) · auth ([#22]).
**A 5-PR stack adds the rest — all CI-green, UNMERGED for Koki, off `main`. Merge in order:**

| PR | Feature | Base |
|----|---------|------|
| [#23](https://github.com/VEHO-DOMI/domigo-v2/pull/23) | A3 `/review` (Smart Review UI) | `main` |
| [#24](https://github.com/VEHO-DOMI/domigo-v2/pull/24) | A4 streaks + offline outbox | `feat/review-ui` |
| [#25](https://github.com/VEHO-DOMI/domigo-v2/pull/25) | B1 Study Path | `feat/streaks-outbox` |
| [#26](https://github.com/VEHO-DOMI/domigo-v2/pull/26) | B3 Listening | `feat/study-path` |
| [#27](https://github.com/VEHO-DOMI/domigo-v2/pull/27) | B2 Mock Tests | `feat/listening` |

GitHub auto-retargets each to `main` as the one below it merges.

**Reuse map (do NOT rebuild):**
- **`@domigo/content-schema`** — zod: `VocabItem`/`GrammarItem`/`WordBank`/`GrammarStructure`; `listening@1` + `test@1` (inline at the end of `index.ts`); `AudioRef {script, voice, file}` (reserved); sibling refs `ItemRef` / `ListeningRef` / `TestRef`; story scaffolding `TaskSlot`/`StoryItems` already exist. Exported primitives: `GrammarFormat`, `TieredAnswer`, `Gloss`, `Difficulty`, `UnitSlug`, `GradeZ`.
- **`@domigo/content-loader`** (server-only, `node:fs`) — `loadUnit`, `loadWordbank`, `loadUnitStructures`, `loadListening`, `loadTest`, `listApprovedUnits` / `listListeningUnits` / `listTestUnits`.
- **`@domigo/engine`** — `gradeVocab`/`gradeGrammar` (13 formats), `Tier`, `xpForTier`, `XP_WEIGHT`. **The one grading brain.**
- **`@domigo/task-ui`** (client) — `GrammarItemView`/`VocabItemView` (`hideHint`), `VocabIntroView`/`GrammarIntroView`, `AudioClip`, `ListeningTaskView`. The DOM renderer.
- **`@domigo/db`** (Neon, `domigo_v2` schema) — tables `practice_attempts`, `review_queue` (Leitner 5-box), `user_progress` (xp/grammarXp/streak), `study_path_progress`, `writing_submissions`. Services: `recordAttempt` (idempotent; **queues vocab/grammar, skips listening/reading**), `getDueRefs`/`getDueCounts`, `studypath` helpers, `getUserProgress`, `recordWritingSubmission`, streak helpers. Migrations `0000`–`0003`. **Additive-only — never DDL/write `public.*`.** Apply to the dev branch via `@neondatabase/serverless` `sql.query()` per statement (or `db:push` to dev); **prod DDL is runbook-gated** (`pg_dump` → committed SQL).
- **apps/web** — routes `/home /practice /review /learn /listening /tests /admin`; APIs `/api/attempts` (3-ref grading: vocab/grammar via `parseItemRef`, listening via `parseListeningRef`, reading via `parseTestRef`), `/api/study-path`, `/api/writing-submission`. `auth()` (NextAuth v5) + `middleware.ts` matcher; `getActingUser` (session **or** non-prod `x-dev-user-id`/`x-dev-class-id` headers); `lib/attempt-outbox.ts` (IndexedDB) + `useOutboxFlush`.

**Conventions.** tsconfig `erasableSyntaxOnly` (no enums — string unions), `verbatimModuleSyntax` (`import type`), `noUncheckedIndexedAccess` (guard every index). Server-only loaders never import into `"use client"`. **Gate:** `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm build` (+ opt-in `pnpm content validate-listening` / `validate-test`). Dev DB = Neon branch `v2-dev` (URL + `DEV_USER_ID`/`DEV_CLASS_ID` in gitignored `apps/web/.env.local`). **E2E recipe:** seed a test student in `public.users` (bcrypt PIN via `apps/web/lib/pin.ts`), cookie-jar login (`csrf → /api/auth/callback/student`), POST via `x-dev-*` headers, assert, cleanup, confirm `public` baseline. **Commit hygiene:** branch off the relevant stack tip; **never a bare `#N`** in a commit message (auto-closes that PR); end commits with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`; **leave PRs unmerged for Koki**. Zsh gotcha: `UID`/`EUID` are reserved — use another var in shell loops.

---

## 1. B2b — Teacher writing-grading UI
**Why.** B2 captures `writing_submissions` but no teacher can see/grade them; `/admin` is a "coming soon" placeholder (`apps/web/app/admin/page.tsx`, teacher-guarded). Close the loop.

**Build (one PR `feat/teacher-grading`, off the stack tip):**
1. **Migration `0004`** — additively `ALTER domigo_v2.writing_submissions ADD` `graded_at timestamptz`, `score smallint`, `feedback text`, `graded_by uuid` (all nullable). Edit `packages/db/src/schema.ts` → `pnpm --filter @domigo/db db:generate` → apply to dev. (Already flagged in the table's comment.)
2. **`@domigo/db`** (new `submissions.ts` or in `persist.ts`, barrel-exported): `getWritingSubmissions(db, {classId?, unitSlug?, graded?})` → rows **joined to `v1Users` (`packages/db/src/v1.ts`) for the student `displayName`**; `gradeWritingSubmission(db, {id, score, feedback, gradedBy})` → set the 4 columns + `graded_at=now()`; `getMyWritingSubmissions(db, userId)` for the student's own graded view.
3. **THE gotcha — teacher→class.** Teachers have `classId=null` in the session and the v1 mirrors carry no teacher→class map. **MVP (single-teacher Koki):** `/admin/submissions` shows **all** submissions (optionally filtered by unit). If multi-teacher is ever needed, add an additive `domigo_v2.teacher_classes` map or read v1 `public.classes` — **flag it, don't build it now.**
4. **`apps/web/app/admin/submissions/page.tsx`** (server, teacher-guard mirroring `/admin`): `getWritingSubmissions` → list grouped by unit with student name + word count + graded/ungraded badge; each links to a grading view (`/admin/submissions/[id]` or an inline client form). Reuse the `/admin` inline-style.
5. **`apps/web/app/api/admin/grade-submission/route.ts`** (POST): resolve the **teacher** via `auth()` directly (`session.user.role === "teacher"`, `gradedBy = session.user.id`) — **not** `getActingUser` (it requires `classId`, null for teachers). Validate `{submissionId, score, feedback}` → `gradeWritingSubmission`. `runtime="nodejs"`, best-effort.
6. **Student grade view** (optional, same PR or follow-up): in `/tests`, after submitting, show the score + feedback from `getMyWritingSubmissions`.
7. **Edits:** `/admin` gets a link to `/admin/submissions`; `middleware.ts` already guards `/admin/:path*`.

**Verify.** Gate; apply `0004` (dev, additive, `public` unchanged); as a student POST `/api/writing-submission` → seed a submission; login as a **teacher** (seed a test teacher in `public.users` with a known bcrypt PIN — the dev teachers' PINs are unknown — or drive via `x-dev-*`); `GET /admin/submissions` lists it → POST grade → assert `graded_at/score/feedback/graded_by` set → student view shows the grade; cleanup; `public` baseline.

---

## 2. Content waves — listening.json + test.json for all 57 units
**Why.** Only the `g2-u03` pilots exist; the runtime is done, the corpus isn't. **Large, multi-session content effort** (like the original items wave) — scope per session.

**The chain (proven by the pilot).** Schemas `listening@1`/`test@1` → author JSON at `content/corpus/units/<slug>/{listening,test}.json` → `pnpm content validate-listening` / `validate-test` (schema parse) → loaders surface them automatically (`listListeningUnits`/`listTestUnits`) → app grades via `/api/attempts`. The main `pnpm content validate` is **blind** to these files (keys on `vocab.json`/`grammar.json`) — it stays green.

**Authoring method (Koki's call):** the **`srdp-listening-comprehension`** + **`srdp-reading-comprehension`** skills, **re-leveled to A1/A1+/A2/A2+**. Per unit:
- **Listening:** a short A1–A2 transcript (monologue or simple dialogue; vocab within the cumulative bank by that unit, else glossed via the item `gloss` field) + ~5 items across MC / TF (→`multiple-choice` with True/False — there is **no** `true-false` format) / gap / matching / short-answer (`free-form`), grounded in the transcript (firewall: **not answerable without the audio, no verbatim lifts, plausible distractors, locked key**). `audio.file:null` → Web Speech until TTS (§3). Ids `g<G>u<NN>.li.<key>.<fmt>.<NNN>`, task `…lt.<key>`.
- **Test:** an auto-assembled `test@1` = REFERENCE sections (a few **approved** vocab/grammar ids + the unit's listening ids — never forward-ref future units) + an embedded READING section (passage + ~3–4 `ri` items, srdp-reading) + a WRITING prompt (`ti.wr`). Ids `…ri.<key>.<fmt>.<NNN>`, `…ti.wr.<NNN>`, test `…tt.<key>`.
- **Items are sibling gradeable schemas** (own `.li.`/`.ri.` id, no `structureId`) — author GrammarItem-shaped (format/prompt/answers/distractors/pairs/groups/gloss/difficulty/hintDe/explainDe/strict/rev/direction).

**Per-unit rhythm (mirror `docs/runbooks/items-wave.md` §3 / see `docs/runbooks/content-waves.md`):** author (skill, re-leveled) → `validate-*` (schema) → fix-loop → app E2E spot-check (POST each item with its key → all `correct`; refs resolve) → commit per unit. **Wave order:** one grade at a time (start g2). **Level gate:** applies to **prompt + distractor** text (gloss above-level words); the transcript may introduce ~3–5 new words (glossed).

---

## 3. Pre-generated TTS files
**Why.** Web Speech is device-variant and ships the `script` in page source. Real files fix both. The player **already prefers `audio.file`** (Web Speech is the fallback) → this is content + a pipeline stage, **zero runtime change** except a one-line URL fix.

**Build (one PR `feat/tts-audio`):**
1. **`packages/content-pipeline/src/gen-audio.ts`** + a `pnpm content gen-audio` command (wire into the `content.ts` switch like `validate-listening`): walk every `listening.json`; for each `AudioRef` with `file===null`: `hash = sha256(script + (voice??""))` → if `apps/web/public/audio/<hash>.mp3` is missing, call the TTS provider → write the mp3 → set `AudioRef.file = "audio/<hash>.mp3"` (+ `voice`) back into the JSON. **Idempotent** (re-run = no-op via the hash).
2. **`AudioClip` URL fix** (`packages/task-ui/src/index.tsx`): `audio.file` is corpus-relative `"audio/<hash>.mp3"`; the player does `new Audio(audio.file)` → make it `new Audio(\`/${audio.file}\`)` so it resolves to the public root `/audio/<hash>.mp3`.
3. **Provider + config:** recommend **OpenAI `tts-1`** (simplest; ~$15/1M chars = pennies for the corpus) or Google Cloud Neural for finer accent/rate control. Add the key to `apps/web/.env.example` + Vercel env. Pipeline-only secret (never shipped to the client).
4. **Hosting:** `apps/web/public/audio/<hash>.mp3` (served at `/audio/<hash>.mp3`, Vercel static) — fine for ~285 clips (<100 MB). Upgrade to **Vercel Blob** if it grows (the schema's `audio/<sha256>.mp3` path anticipates content-addressed storage).

**Verify.** `gen-audio` on the `g2-u03` pilot → an mp3 written + `listening.json` `file` populated → `/listening/g2-u03` plays the **file** (not Web Speech); re-run is a no-op; the `script` no longer leaks for file-backed clips.

---

## 4. Track C — the grade games  ✅ G1 + G2 SHIPPED (2026-06-28)
**The full design is `10_game_layer.md` — READ IT FIRST.** This is the kickoff + reuse seams only; do not re-document the game design.

> **Status (2026-06-28).** **G1 overworld RPG (this section) is DONE** — hub + 5 story zones u1–5, encounters, zone-scoped saves, the bundle gate, all on `main`. **G2 "The Wrong Name"** detective game is also live (15 chapters; its pedagogy upgrade = plan Part 6, passover `12_g2_passover.md`). **Remaining in Track C: G3 FOURTEEN + G4 Syntaxia** (not started). The seams below (the 9 Laws, `getDueRefs` encounters, the task-ui overlay, `/api/attempts`, `game_saves`) are exactly what G3/G4 reuse — the kickoff text is retained as the template.

**Unblocked:** every item carries `presentation.gameMeta` (distractor pools / chip budgets / minOptions) + `difficulty` 1–3, and the cumulative level gate is in force. **Non-negotiable:** the 9 Laws (game physics) + the 11 design principles (`08`). Key laws — **L5** one grading brain (task-ui DOM overlay + `@domigo/engine` + `practice_attempts`, `mode:"game:g1"`), **L6** spaced retrieval is world physics (`getDueRefs` due items spawn as encounters; cleared areas re-fog as retention decays), **L2** progress only by language, **L3** failure changes pace not position (no HP/lives/XP-loss), **L9** bulletproof (checkpoint ≤90 s, offline outbox, no dead toggles).

**G0 (freeze contracts first):**
- New **content-schema** schemas: `story@1` (chapters: `speaker`/`textEn`/`scaffoldDe`/`glosses`/`audio`/`next | Choice[]`), `quest@1`, `map@1` (Tiled-JSON, generated as code), `encounter@1`; `cast.json`, `names.json` (proper-noun level-gate escape). These **reference item ids** (`TaskSlot`/`StoryItems` already exist) — never copy content.
- New **packages**: `game-core` (pure TS: quest state machines, encounter rolls, `game_saves` schema + migrations, perf presets), `game-2d` (Phaser 3 scenes), `art-gen` (procedural tileset/sprite generators). Games never import each other — they meet at `game-core`/`content-schema` contracts.
- **Story pipeline** (`content-pipeline`): `content story import` (legacy importers — the g1 "Lost Pages" premise lives in the 1st-grade trainer `index.html` `campaignLevels`) → `content story gen` (rewrite to in-bank-or-glossed at the chapter gate) → 4 narrative lenses → validators **VS-1…VS-10** (level gate over every line via `tokenize.ts`, du-form, taskRefs ≤ gate unit, choice-graph reachability/no-dead-ends, speakers resolve, gloss correctness, meta-talk blacklist, asset refs, storyItems pass the item validators) → per-chapter review → `release.json` gating (chapter N needs units ≤ N).

**The first vertical slice (the GO/NO-GO at ~W6).** Phaser 3 scaffold; **one zone** (unit-1 theme); on zone entry `getDueRefs(userId, scope, limit)` → spawn 3–5 wandering encounters (fall back to in-scope random if the queue is empty); each encounter mounts the **task-ui DOM overlay** above the canvas; answer → `POST /api/attempts` `mode:"game:g1"` + `context` jsonb → grade + XP inline → resume; **offline-resume checkpoint** (≤90 s) + the **A4 attempt outbox**; **procedural art** (tileset + 4-direction sprite); **cheap-Android perf** (60fps target / 30 floor, ≤50 draw calls, pause-on-blur, `?perf=1` HUD). Route `app/(game)/play/[grade]` via `next/dynamic` `ssr:false`; overworld bundle ≤600 KB (size-limit CI). **Reuse seams:** `getDueRefs` = encounter source; `recordAttempt` via `/api/attempts` = grading+XP+Leitner; `task-ui` = overlay; the outbox = offline; `auth`/`getActingUser`. **New:** an additive `game_saves` table (cosmetic state ≤64 KB; XP/unlocks derive server-side from attempts).

**Sequencing / open decisions.** Track C order = story tooling → G0 contracts → **g1 slice (~W6, GO/NO-GO w/ Koki + 2–4 kid testers + art approval)** → g1 zones u1–5 → g2 Watson → g3 FOURTEEN → g4 Syntaxia. Open: TTS provider (~W4 — see §3), art-style sign-off at the slice gate, g4 3D budget, native (PWA vs Capacitor). Forfeit order on slip: g4 → g3 → g2 → g1 zones → (never) the floor or item quality.

---

_Created 2026-06-21 alongside the B-track completion. Mirrored to the iCloud handover folder + `~/.claude/plans/domigo-v2-remaining-passover.md`._
