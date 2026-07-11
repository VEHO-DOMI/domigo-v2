# DomiGo v2 — Deployment & Hosting Status (verified 2026-07-11)

> **Two sanity checks, eyes-on, with evidence.** This records the true hosting/DB
> state of DomiGo v2 and the plan to actually take it live. Written after logging
> into Vercel + Neon directly (Koki's accounts) and reading the repo. TL;DR:
> **the app is 100% localhost + a Neon dev branch — nothing is hosted online yet,
> and the v2 database has never been provisioned in production.** The *code* and
> *design* are done and correct; *deployment* is the gap.

---

## Sanity check #1 — design parity (v2 vs the four OG GitHub trainers)

**Question:** did the v2 app capture the design (colours, fonts, layout) of the
original grade-1–4 vocab trainers (`veho-domi.github.io/*-grade-vocab-trainer`)?

**Verified (eyes-on both sides): YES — the brand is captured exactly; layouts are
richer by design.**

| Element | OG trainers | v2 | Result |
|---|---|---|---|
| Wordmark + "ENGLISH · VOCABULARY & GRAMMAR" | ✓ | ✓ identical | exact |
| Fonts | Inter body + Fredoka display | same | exact |
| Per-grade accent | g1 `#16a34a` · g2 `#dc2626` · g3 `#2563eb` · g4 `#7c3aed` | same hex (`globals.css` `[data-grade]`) | exact |
| White rounded cards, tinted backgrounds, accent pill buttons | ✓ | ✓ | match |
| Exercise card (type-label pill → prompt → options → accent button → green-correct) | ✓ | ✓ (v2 "Check" screen) | match |

- **OG modes captured** (via a throwaway test student profile): the gamified
  dashboard (XP/level "Wordling", leaderboards, "Story Mode · Coming Soon"), the
  unit picker, the exercise roster (Full Run / Sprint / Speed Round / Multiple
  Choice / Flashcards / Memory Match / Spelling Bee), and a live Multiple-Choice
  question with green-correct feedback.
- **v2 is intentionally richer:** themed game hubs (a storybook "Lost Pages" board
  for g1, a newsroom "rundown" for g4) instead of flat menus, plus the full story
  campaigns the OG only teased as "Coming Soon". The design tokens carried over
  1:1; the layouts are the deliberate Wave-2 "go all out on UI/UX" upgrade.
- `globals.css` states the intent outright: *"design tokens … ported from the
  legacy trainers."* Confirmed accurate.

The catch that led to sanity check #2: this could only be verified from **code +
the local build**, because the v2 app is **not deployed on Vercel**.

---

## Sanity check #2 — is anything hosted online? (Vercel + Firebase→Neon)

### Vercel — NO build of the v2 app exists

Logged into Vercel (`kokisamkuci-2080's projects`). Findings:

- **`domigo-v2` project exists** (created Jun 11) **but is NOT connected to Git.**
  Production Checklist **0/5** — "Connect Git Repository" is the first unchecked
  item. Its only "deployment" is a single manual `vercel deploy` (CLI) of the
  blank **Create Next App scaffold** — the overview thumbnail literally shows
  *"To get started, edit the page.tsx file."*
- `domigo-v2.vercel.app` therefore serves that scaffold; every real route
  (`/home`, `/play/4`, `/practice/*`) returns a **Next.js 404**.
- **⇒ The real DomiGo v2 app — VEHO-DOMI/domigo-v2, all 122 merged PRs — has never
  been built on Vercel. Zero deployments of the actual app.**
- For contrast: **`domigo`** (v1) → `domigo-silk.vercel.app` IS git-connected and
  deployed. v1 is live; v2 is not.

### Neon — v2's database is dev-branch only; prod DDL never applied

Logged into Neon (`domigo-db` project, 10 branches):

- **`main` (production) branch** has **only the `public` schema** — V1's data
  (`classes`, `legacy_students`, `class_legacy_map`, `badges`, `daily_challenges`,
  `grammar_attempts`, …). Its `_migrations` table records `0000_initial.sql`
  applied **2026-05-16** — the historical V1 Firebase→Neon migration.
- **`v2-dev` branch** has `public` **AND `domigo_v2`** — the v2 schema (drizzle
  migrations `0000`–`0005`) lives here.
- **⇒ The `domigo_v2` schema is NOT on production.** The v2 database has only ever
  been applied to the dev branch. **Prod DDL never applied** — confirmed
  on-platform, matching the repo docs.

### Firebase → Neon — partial (historical) + a documented, unfinished completion

- v2 itself has **no Firebase SDK** (not a dependency); it targets Neon only.
- V1's accounts **were** migrated into Neon's `public` schema (~2026-05-16), which
  is why v2 has read-only `v1.ts` mirrors of v1 users/classes.
- The **migration *completion*** — importing post-2026-05-17 Firebase signups into
  Neon + the `/signin/migrate` claim flow (`docs/handover/03_migration.md`) — is a
  **Track-D go-live gate, NOT done.** (The `/signin/migrate` route does not exist
  in the app yet.)

**Net:** Koki's belief was half-right — a Firebase→Neon migration *was* documented
and *did* happen for V1's pre-cutoff data. But the v2 side is entirely dev-only
(prod DDL never applied), the migration completion is pending, and **none of it is
live because the app is not deployed.**

---

## What it takes to actually host DomiGo v2 (the go-forward plan)

Ordered; each is a discrete, verifiable step. Items marked **[Koki]** need his
account access / a policy call; the rest are executable by a session.

1. **H-1 · Connect the Vercel project to Git** **[Koki + session]**
   Link the `domigo-v2` Vercel project → `VEHO-DOMI/domigo-v2`; set **Root
   Directory = `apps/web`** (it's a pnpm monorepo — this is almost certainly why a
   from-root build produced an empty default); set the build to the monorepo
   (`pnpm -w …`) / install command; add environment variables (below). Exit: a
   push to `main` triggers a real build and `domigo-v2.vercel.app` serves the app.

2. **H-2 · Environment + secrets** **[Koki]**
   `DATABASE_URL` (Neon **production** branch, `domigo_v2` search path),
   `AUTH_SECRET`/NextAuth config, `AUTH_URL`, and any keys the platform wave needs
   (Vercel Blob for writing images, `CLAUDE_CODE_OAUTH_TOKEN` for W-2 correction).
   Nothing secret lives in the repo — all via Vercel env vars.

3. **T-2 · Deploy-truth harness** (BLUEPRINT_V2 item 1, still unbuilt)
   `apps/web/app/api/version/route.ts` (returns `VERCEL_GIT_COMMIT_SHA` +
   migration-journal hash) + `scripts/verify-deploy.mjs` (fetch prod, compare to
   `origin/main`, diff applied migrations, check env names; non-zero on mismatch).
   Exit: `node scripts/verify-deploy.mjs --url https://domigo-v2.vercel.app` prints
   a green receipt — and a deliberately-empty deploy fails it. **This is the guard
   that would have caught the blank-scaffold state immediately.**

4. **GO-1 · Production DDL sitting** **[Koki co-pilots]** (BLUEPRINT_V2 Phase 6)
   Apply the v2 migrations (`0000`–`0005`, plus platform `0006+` as they land) to
   the Neon **`main`** branch per the runbook: `pg_dump --schema-only
   --schema=public` before/after must diff EMPTY (v1's `public.*` is never touched;
   all v2 tables are additive in `domigo_v2`). Exit: `domigo_v2` schema present on
   production, `public` byte-identical.

5. **Track-D · Firebase→Neon migration completion + claim flow** **[Koki policy]**
   Import post-2026-05-17 Firebase signups into Neon without clobbering claimed
   accounts; build `/signin/migrate`; dual-read auth (v2 first → v1 mirror
   fallback). (Overlaps the platform wave's P-1/P-2 identity+roster work.)

6. **Verify live (eyes + harness):** verify-deploy green; a real sign-in; a
   practice session that persists an attempt to the prod DB; one game loads;
   360×740 mobile pass. Then it is genuinely hosted.

**Sequencing note:** H-1 + H-2 (+ T-2 as the guard) get the *app* live on a Neon
dev branch immediately — good enough to demo. GO-1 + Track-D make it
*class-ready* (real prod DB + migrated accounts). Deployment is Koki's call.

---

## One-line status

Code ✅ · Design ✅ · **Hosted ❌ (never deployed)** · **Prod DB ❌ (dev-branch
only)** · **Firebase→Neon completion ❌ (Track-D, pending)**.
