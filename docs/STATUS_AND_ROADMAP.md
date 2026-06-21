# DomiGo v2 — Build Status & Executable Roadmap

_Last updated: 2026-06-21. Single source of truth for "what's done / what's next." Pairs with `docs/handover/` (the original design) and `docs/runbooks/` (operational detail). When you finish a step, check its box and update the snapshot in §3._

---

## 1. The original plan (the baseline we're measuring against)

DomiGo v2 is a from-scratch rebuild of the grades 1–4 EFL trainer (MORE! 1–4, A1–A2), PWA-first, go-live target **September 2026**. The roadmap (`docs/handover/09_roadmap_and_open_decisions.md`):

- **P0 — bulletproof foundation:** (1) content rework item-by-item with validators, (2) Firebase→Neon migration completion + claim flow, (3) UX/UI + stability hardening.
- **P1 — durable learning pillars:** **Study Path (+ Smart Review)** → Mock Tests → Listening.
- **P2 — engagement + platform:** Story/RPG game mode (tech spike first) → PWA install → native eval.
- **P3 — social (optional):** Battle Arena / Class Quiz / Study Buddies.

The game layer is specified separately in `docs/handover/10_game_layer.md` (four standalone grade games; G1 overworld RPG first) — it's the concrete form of P2 and reuses everything P1 builds (one grading brain, one spaced-retrieval service).

---

## 2. What's been achieved

Four shipped increments, **all merged to `main`**:

### ✅ P0.1 — Content rework COMPLETE (domigo-v2 [#17](https://github.com/VEHO-DOMI/domigo-v2/pull/17))
- **All 57 units (G1–G4)** of vocab + grammar approved at **0.0% stage-8 reject**, full v1 grammar parity; **4 structure catalogs**; **5,898 items** + 2,446 word-bank entries.
- Built through the deterministic pipeline (`pnpm content`): generate → 4 verify lenses → validate (V-1…V-22 + V-A…V-F) → Fable stage-8 review. Re-runnable; corpus is canonical (`content/corpus/units/*/{vocab,grammar}.json` + overlays).
- Receipts: `pnpm content status` → `approved=57`; `pnpm content validate` green; runbook `docs/runbooks/items-wave.md`.

### ✅ Runtime seam — Foundation harness COMPLETE ([#18](https://github.com/VEHO-DOMI/domigo-v2/pull/18))
- **`@domigo/content-loader`** — `loadUnit(slug)` reads + overlay-applies + schema-validates a unit's items; `listApprovedUnits()`. Server-only.
- **`@domigo/engine`** — ported v1's 4-tier grader (canonicalize · Levenshtein 0.15/0.20 · partial-match · all-or-nothing) → `gradeGrammar`/`gradeVocab`/`xpForTier`/`breaksCombo`. Pure, DOM-free.
- **`@domigo/task-ui`** — renders + grades all 13 grammar formats + vocab; tiered XP; gloss/hint reveal.
- **`apps/web`** — stateless `/practice` + `/practice/[slug]`. **All 5,898 items self-grade as `correct`** when fed their own answer key.

### ✅ Live-app stopgap — G1 trainer upgraded (`1st-grade-vocab-trainer` [#1](https://github.com/VEHO-DOMI/1st-grade-vocab-trainer/pull/1), live on GitHub Pages)
- Full content replace of the live standalone grade-1 app with the reviewed v2 corpus (786 vocab / 1106 grammar / 35 structures) via a re-runnable generator (`TOOLS/v2-import/build-from-v2.js`); story campaign + decks preserved.
- Grammar trainer brought to v2 parity (4th "partial" tier, partial-match fallback, gloss tap-to-reveal). So real grade-1 students benefit **now**, before v2 go-live.

### ✅ P1 (start) — Smart Review backend COMPLETE ([#19](https://github.com/VEHO-DOMI/domigo-v2/pull/19))
- **`@domigo/db`** (Neon HTTP) — all tables in a dedicated **`domigo_v2` Postgres schema** (additive wall; v1's `public` untouched): `practice_attempts` (unified ledger), `review_queue` (Leitner 5-box), `user_progress` (v2 XP pool). Read-only `v1.ts` mirrors of v1's `users`/`classes`.
- **Leitner service** — `updateReviewQueue` / `getDueRefs(userId, scope, limit)` / `getDueCounts` / `recordAttempt`. Powers Smart Review **and** (later) game encounters.
- **`POST /api/attempts`** — server re-grades (one grading brain), idempotent, best-effort, failure never subtracts XP. **Dev identity** (env/header, prod-refused) is the single swap-point for real auth.
- `/practice` records attempts. Generated migration is provably additive (`CREATE`-only, 0 `public` refs).
- **⚠️ Not yet verified against a live DB** — there was no Postgres/Neon available when it was built. See **Track A1** below (the first thing to do).

---

## 3. Current-state snapshot

| Layer | State |
|---|---|
| **Content corpus** | ✅ 57 units / 5,898 items approved; canonical + re-runnable |
| **Loader / grader / renderer** | ✅ `@domigo/{content-loader,engine,task-ui}` |
| **DB / persistence** | ✅ `@domigo/db` (schema + Leitner + attempts) on `main`; **live DB not yet provisioned/verified** |
| **Practice trainer** | ✅ `/practice` (records attempts) |
| **Auth** | ✅ NextAuth v5 (student + teacher), reuses Neon accounts ([#22](https://github.com/VEHO-DOMI/domigo-v2/pull/22)) |
| **Smart Review UI** | ✅ `/review` + `/review/session` study loop (`mode:"review"`); home due-count badge (`feat/review-ui`) |
| **Streaks / offline outbox** | ✅ daily Vienna-day streak (home + summary badge) + IndexedDB attempt outbox (`feat/streaks-outbox`) |
| **Study Path (B1)** | ✅ `/learn` node map — teaching + graduated practice + checkpoint; unlock + stars (`feat/study-path`) |
| **Mock Tests / Listening** | ❌ not started |
| **Game layer** | ❌ designed (`10_game_layer.md`); not started |
| **Migration / cutover** | ◻️ v1 students in shared Neon; v2 reuse-accounts decided; cutover not done |
| `main` HEAD | `9d2ae99` (merge #22) · `pnpm -r typecheck/lint/test/content/build` green · tests: engine 24 / pipeline 60 / loader 4 / db 8 |

**Repos:** `~/Code/domigo-v2` (VEHO-DOMI/domigo-v2, prod `domigo-v2.vercel.app`) · v1 reference `VEHO-DOMI/domigo` (clone to `/tmp/domigo-v1-ref` for porting) · live grade-1 app `VEHO-DOMI/1st-grade-vocab-trainer`.

---

## 4. What's left — executable steps

> Convention: each track is a PR (or a few). Build on `main`, branch `feat/<name>`. Gate every PR on `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm build`. Deploys/merges are Koki's call.

### Track A — Finish Smart Review (P1 learning pillar)

#### A1. Provision + verify the live DB  ✅ **DONE (2026-06-19)**
Dev branch `v2-dev` created off `domigo-db`; schema applied (additive confirmed — `public` 13→13 unchanged); **17/17 DB-layer + HTTP-route checks pass on live data**. Caught + fixed a real idempotency bug (partial-index `ON CONFLICT` → full unique index, [#21](https://github.com/VEHO-DOMI/domigo-v2/pull/21)). Dev `DATABASE_URL` + `DEV_USER_ID`/`DEV_CLASS_ID` are in gitignored `.env.local`. **The next blocking item is now A2 (auth).** Steps kept below for the prod apply + re-runs:

The Smart Review backend is merged but never run against a real DB.
1. In the Neon console, open the **`domigo-db`** project (Frankfurt — the shared DomiGo Postgres DB that holds the migrated students; _not_ "veho-vocab", which is the old Firebase project). Create a **dev branch** off `main` (⚠️ `domigo-db` may be at the free-tier 10-branch cap — delete a stale `preview/*` branch first, or reuse an existing dev branch); copy its **pooled** (`…-pooler…`) connection string.
2. Find a real student identity for the dev backdoor:
   ```sql
   SELECT id AS dev_user_id, class_id AS dev_class_id FROM public.users WHERE role='student' LIMIT 1;
   ```
3. Create env files (gitignored):
   - `apps/web/.env.local` → `DATABASE_URL=…`, `DEV_USER_ID=…`, `DEV_CLASS_ID=…`
   - `packages/db/.env.local` → `DATABASE_URL=…`
4. Push the schema (additive — dev branch only):
   ```bash
   pnpm --filter @domigo/db db:push:dry   # confirm: ONLY domigo_v2 CREATEs, zero public.*
   pnpm --filter @domigo/db db:push
   ```
   Verify: `SELECT table_schema,table_name FROM information_schema.tables WHERE table_schema='domigo_v2';` → 3 tables; `public` untouched.
5. Run the DB-integration test (now that `DATABASE_URL` is set it un-skips):
   ```bash
   DATABASE_URL=$(grep DATABASE_URL packages/db/.env.local|cut -d= -f2-) pnpm --filter @domigo/db test
   ```
6. End-to-end: `pnpm --filter web dev` → `/practice/g2-u03`. Answer one **correct** (→ `practice_attempts` row, `review_queue` box=2 / dueAt≈+1d, `user_progress.xp` up) and one **wrong** (→ box=1 / dueAt≈+10m / lapses=1, **xp not decreased**). Idempotency: replay the same `clientAttemptId` (curl with `x-dev-user-id`/`x-dev-class-id` headers) → `duplicate:true`, one row.
7. Add `DATABASE_URL` to Vercel **preview/prod** env (prod tables applied via the runbook below, not a live push). Then production attempts persist.
- **Prod DDL (when ready):** `pg_dump` first; apply the committed `packages/db/drizzle/0000_*.sql` (it's `CREATE`-only in `domigo_v2`). Never `db:push` against prod.

#### A2. Real auth — port v1 NextAuth  ✅ **DONE (2026-06-19)**
NextAuth v5 (student + teacher Credentials) reusing the existing Neon accounts (class code + nickname + PIN), **read-only on `public.users`** (v1's lastSeenAt/onboardedAt writes dropped; pure callbacks). `apps/web/{auth.ts, middleware.ts, app/api/auth/[...nextauth], app/signin, app/admin/signin, app/home, app/admin}` + `@domigo/db` lookup helpers; `getActingUser` now reads the session. Verified live (dev branch, seeded fixture, cleaned up): 6/6 direct authorize + 6/6 E2E (sign-in→cookie→/home→middleware-protect→attempt records under the real id); `public` untouched. **Next blocking item is now A3 (`/review` study UI).** Original step-by-step kept below:

Reuse the ~110 migrated accounts; students log in with their existing class + PIN.
1. `cd /tmp && gh repo clone VEHO-DOMI/domigo /tmp/domigo-v1-ref` (port reference).
2. Add deps to `apps/web`: `next-auth@beta` (v5) + `bcryptjs`.
3. Create `apps/web/auth.ts` — port `/tmp/domigo-v1-ref/lib/auth.ts`: two Credentials providers — **student** (class invite-code + nickname + 6-digit PIN, case-insensitive name lookup, `bcrypt.compare` vs `public.users.pinHash`) and **teacher** (nickname + PIN). Read identity via the **`v1Users`/`v1Classes` mirrors already in `@domigo/db`** (`packages/db/src/v1.ts`) — read-only, never write.
4. Create `apps/web/middleware.ts` — port v1's: redirect unauth → `/signin` (students) / `/admin/signin` (teachers); students lacking `onboardedAt` → `/onboarding`; guard `/admin/*`. (Auth routes per memory: teacher = **`/admin/signin`**, not `/signin/teacher`.)
5. Sign-in pages: `app/signin/page.tsx`, `app/admin/signin/page.tsx`.
6. **Swap the identity seam:** in `apps/web/lib/identity.ts`, make `getActingUser` read the NextAuth session first (`const s = await auth(); if (s?.user) return {userId, classId}`); keep the dev env/header branch but only for non-prod. Nothing else changes — the endpoint already consumes `{userId, classId}`.
- Verify: student sign-in → `/practice` records attempts under the real userId; sign-out/in preserves `user_progress`.

#### A3. The `/review` study-mode UI  ✅ **DONE (2026-06-21, PR `feat/review-ui`)**
The Leitner queue now has a student surface. `app/review/page.tsx` (server) → `getDueCounts` → "N items due (X vocab · Y grammar)" + Start-review link, or an "all caught up 🎉" empty state. `app/review/session/page.tsx` (server) → `getDueRefs(userId, {kind:"all"}, 20)` → dedupe-`loadUnit` per slug + match `itemId`→item (skips overlay-dropped/stale refs) → `app/review/session/ReviewSession.tsx` (client) steps the **single mixed queue**, renders via `@domigo/task-ui`, fires `POST /api/attempts` with **`mode:"review"`**, ends on a summary. Home Review card is now a real `<Link>` with a live due-count badge (DB read try/caught so it never 500s the landing). Scope = review-all-due (per-unit/grade scope picker deferred). Gate green (typecheck/lint/test/content/build). Verified live (dev branch, seeded `TestKid`, cleaned up): login→`/review` shows "2 items due / 1 vocab · 1 grammar"→`/review/session` 200 SSR-renders the soonest-due item→correct review attempt → `review_queue` box 1→2, due_at past→+1d, reps→1, `practice_attempts` `mode='review'`; empty state after clearing; `public` untouched. **Next blocking item is now A4 (progression) / B1 (Study Path) / the game layer.** Original steps below:
1. `app/review/page.tsx` (server) — `getActingUser` → `getDueCounts(db, userId)` → render "due today" by scope (this unit / this grade / all) with counts; link into a session.
2. `app/review/[scope]/ReviewSession.tsx` (client) — `getDueRefs(userId, scope, limit)` (via a server action or `/api/review/due` route) → for each ref `loadUnit(slug)` + find item → render with `@domigo/task-ui` → on answer POST `/api/attempts` with **`mode:"review"`** → advance. Empty state when nothing's due.
3. Add a "Review (N due)" entry point on the home/practice nav.
- Verify: answer wrong in `/practice` → it appears in `/review` after its box-1 interval; answering it correctly there reschedules it forward.

#### A4. Progression polish  🟡  _(streaks + outbox done — PR `feat/streaks-outbox`, stacked on `feat/review-ui`; badges remain)_
1. **Streaks** ✅ **DONE (2026-06-21)** — v1's `recordSessionDay` ported into `@domigo/db` as pure `computeNextStreak` + Vienna-day helpers (`Intl` `Europe/Vienna`, DST-safe); `streak`/`last_session_date` added to `domigo_v2.user_progress` (additive `0001` ALTER); advanced inside `recordAttempt` on the first attempt of each Vienna day (any tier — showing up counts), returned via `/api/attempts`, shown on `/home` (active-only badge) + the session summary. Unit-tested (9) + live dev-DB E2E (fresh→1, same-day→1, consecutive→+1, gap→reset).
2. **Badges** ◻️ — port v1's badge catalog + award logic (optional; flag-gated). _Not in this PR._
3. **Offline attempt outbox** ✅ **DONE (2026-06-21)** — dependency-free IndexedDB outbox (`apps/web/lib/attempt-outbox.ts` + `useOutboxFlush`): `sendAttempt` enqueues on offline/5xx/`persist_failed` (idempotent on `clientAttemptId`), drops permanent 4xx, flushes on mount + the `online` event; wired into Practice + Review sessions. Module-tested (6 cases via an IndexedDB shim).

### Track B — Remaining P1 pillars

#### B1. Study Path (guided unlock progression)  ✅ **DONE (2026-06-21, PR `feat/study-path`, stacked on A4)**
Per-unit guided path at `/learn/[slug]`. The node graph is DERIVED (pure `buildUnitNodes`) — vocab intro (teaching) → vocab practice split by difficulty → grammar intro → grammar practice by difficulty → checkpoint (deterministic ~10-item cumulative sample from the unit, hints off). Sparse `domigo_v2.study_path_progress` (a row iff a node is completed; locked/available/stars DERIVED by `withProgress`); additive `0002` migration. Graded nodes reuse `task-ui` + the `/api/attempts` outbox (`mode:"study:<nodeId>"`) so they feed Smart Review + streaks + XP; a thin `/api/study-path` records node completion (server re-derives stars from the tier tally, validates the nodeId against the graph, keep-best via `GREATEST`). New content-loader `loadWordbank`/`loadUnitStructures` + task-ui `VocabIntroView`/`GrammarIntroView` (German-led, student-safe) + a `hideHint` checkpoint flag. Unlock enforced server-side (a locked-node URL 307-redirects to the map). 14 unit tests + live dev-DB E2E (unlock advance, attempts→`review_queue`, stars keep-best, locked-redirect); additive (`public` 13→13). Original steps below:
1. A progression model: per-(user,unit) node states (locked/available/mastered) — additive `domigo_v2.study_path_progress` table.
2. Routes `app/learn/[slug]` rendering the node map; nodes reuse `content-loader` + `task-ui` + `/api/attempts`.
3. "Teaching" nodes (vocab/grammar intro) — new non-graded card types showing the word bank / structures.

#### B2. Mock Tests  ◻️
From the Check-up material; new content type + grading (auto where machine-checkable, teacher-graded for writing — see `07_task_formats.md`). Likely its own corpus + a `/tests` surface.

#### B3. Listening  ◻️
The schema already reserves audio script fields. Decide audio source (TTS vs MORE! Test-Builder rights — `09` open decision). Generate audio → listening item formats (MC / true-false / gap / matching / short-answer tied to a clip).

### Track C — The game layer (P2) — _builds on A (auth + Smart Review)_
Per `docs/handover/10_game_layer.md`. **G1 overworld RPG first** (the Sept headline). All games reuse `getDueRefs`/`recordAttempt`/`task-ui` (no new grading).
1. **Content contract** — new schemas in `@domigo/content-schema`: `story@1` (chapters/scenes/taskSlots referencing items, never copying), `quest@1`, `map@1`, `encounter@1`; `cast.json`; `names.json` proper-noun escape.
2. **Story pipeline** — deterministic legacy importers (the m2-campaign.js → chapters; the G3 production-script parser) → `content story gen` (rewrite to in-bank-or-glossed at the chapter gate) → 4 narrative lenses → validators **VS-1…VS-10** → per-chapter review → release gating.
3. **G1 RPG** — Phaser scaffold, zone-per-unit; due `review_queue` items spawn as wandering encounters (the task renderer is a DOM overlay above the canvas). Then G2 Watson / G3 FOURTEEN / G4 Syntaxia.
- Gate: a game mode ships only when its loop + grading + offline-resume work at class scale (Law 9) — no dead toggles.

### Track D — Migration, cutover & bulletproof-beta (P0.2/P0.3 → go-live)
1. **Migration completion** (`03_migration.md`) — import post-2026-05-17 Firebase signups into Neon without clobbering claimed accounts; keep the claim flow (`/signin/migrate`) working.
2. **Bulletproof-Beta checklist** (`09` §gate, run before any student go-live): every audited unit validator-green + spot-checked · student/teacher/legacy-claim auth all work · no route 500s · progress persists across sign-out/in · combos/XP/streaks/badges correct · mobile-first on a cheap phone + PWA install + flaky-network tolerance · **class-scale ~30-concurrent attempt test** (no race/lost-write) · no dead toggles.
3. **PWA install** + offline shell. **Firebase retirement** once v2 is the live app (then a one-time reconcile of v1 frozen XP → `user_progress`).

---

## 5. Recommended order & dependencies

```
A1 (verify DB)  ──►  A2 (auth)  ──►  A3 (/review UI)  ──►  A4 (streaks/outbox)
                          │
                          ├──►  B1 (Study Path)  ──►  B2 Mock Tests  ──►  B3 Listening
                          │
                          └──►  C (game layer: G1 RPG → G2 → G3 → G4)
                                      (needs auth + Smart Review service)
D (migration + bulletproof-beta) runs in parallel; it GATES any student go-live.
```
**Do next:** A1 ✅ → A2 ✅ → A3 ✅ → A4 ✅ → B1 Study Path ✅. Next: **B2 Mock Tests** / **B3 Listening**, or **C / G1 RPG** — the game layer reuses the Study Path progression + `getDueRefs`.

---

## 6. Reference

- **Packages:** `@domigo/content-schema` (zod item/structure/story schemas) · `@domigo/content-loader` · `@domigo/engine` (grader) · `@domigo/task-ui` (renderer) · `@domigo/db` (persistence + Leitner) · `@domigo/content-pipeline` (authoring CLI: `pnpm content …`).
- **Conventions:** packages export `./src/index.ts(x)`, tsconfig extends `tsconfig.base.json` (ES2023, nodenext, strict, **erasableSyntaxOnly** → no enums). Content is regenerable (author into the canonical source + validation gate). DB is **additive-only** on the shared Neon: v2 tables in `domigo_v2`, never DDL/write `public`; prod DDL runbook-gated; CI uses a Postgres service container, never per-PR Neon branches.
- **Env:** `apps/web/.env.local` (`DATABASE_URL`, `DEV_USER_ID`, `DEV_CLASS_ID`) — gitignored; templates in `.env.example`. Prod `DATABASE_URL` never in repo.
- **Identity swap point:** `apps/web/lib/identity.ts` `getActingUser` (dev → real `auth()`).
- **v1 port reference:** `gh repo clone VEHO-DOMI/domigo /tmp/domigo-v1-ref` — `lib/db/{schema,index}.ts`, `lib/auth.ts`, `middleware.ts`, `lib/actions/vocab-practice.ts`.
- **Design docs:** `docs/handover/02` (data model), `06` (pillars), `07` (task formats), `08` (laws), `09` (roadmap), `10` (game layer). **Runbooks:** `docs/runbooks/items-wave.md`.
