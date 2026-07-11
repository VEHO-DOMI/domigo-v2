# DomiGo v2 — go-live runbook

Takes the app from "runs on localhost" to "hosted at `domigo-v2.vercel.app`".
State + the why behind each step: [`../handover/DEPLOY_AND_HOSTING_STATUS.md`].
Do the steps **in order**; each has a verify + a **STOP** condition. Who does what:

| | Vercel/Neon UI (browser) | Terminal (`git`/`pnpm`/`psql`) | Secrets |
|---|---|---|---|
| **Can do it** | Koki, or a browser agent | Koki, or a coding session | **Koki only** |

Steps 1–2 make the app live; Step 4 makes it usable; Step 5 (student data) is last.

---

## Step 1 — Connect Vercel to the repo  ·  *browser*  ✅ done 2026-07-12

Vercel → **domigo-v2** → Settings:
- **Git**: connect `VEHO-DOMI/domigo-v2`, production branch `main`.
- **Build & Deployment**: **Root Directory = `apps/web`** + enable *"Include files
  outside of the Root Directory"* (so `packages/*` resolve); **Framework = Next.js**;
  **Install = `pnpm install --frozen-lockfile`**; **Build =** default (`next build`);
  **Node = 22.x**.

Don't deploy yet — Step 2 supplies the DB URL the build needs.

## Step 2 — Environment variables + first deploy  ·  *browser + Koki (secrets)*  ✅ done 2026-07-12

Settings → Environment Variables → **Production**:
- `DATABASE_URL` = Neon **`main` (production) branch** *pooled* connection string
  (Neon → domigo-db → Connect → branch `main` → Pooled). **[Koki pastes]**
- `POSTGRES_URL` = same value. **[Koki pastes]**
- `NEXTAUTH_SECRET` = `openssl rand -base64 32`. **[Koki generates + pastes]**
- `NEXTAUTH_URL` **and** `AUTH_URL` = `https://domigo-v2.vercel.app`. *(non-secret)*
- Do **NOT** set `DEV_USER_ID` / `DEV_CLASS_ID` / `DEV_TEACHER_ID` in production.

Then trigger a Production deploy. **Verify:** `https://domigo-v2.vercel.app` shows
the DomiGo home (not the Next starter); `/play/1` renders the grade-1 hub. Still a
scaffold ⇒ the Root-Directory / include-outside-files settings are wrong — fix +
redeploy. *(DB-backed pages 500 until Step 4 — expected; do Step 4 to clear it, or
run Step 4 first so the first deploy is fully working.)*

**✅ Verified 2026-07-12:** `domigo-v2.vercel.app` serves the real DomiGo home;
`/api/version` → `{sha:66fafe4, ref:main, env:production}`. Merging #125 auto-triggered a
deploy (Git now connected); one redeploy picked up the secrets, then promoted. **Rotate
`NEXTAUTH_SECRET` before students sign in** — it transited chat during setup: `openssl rand
-base64 32` → update the Vercel var → redeploy (free now, no live sessions).

## Step 3 — Deploy-truth harness  ·  *code*  ✅ shipped #125 · verify-deploy GREEN 2026-07-12

`apps/web/app/api/version/route.ts` (advertises the build's git SHA) +
`scripts/verify-deploy.mjs`. **After the Step-2 deploy, run:**
```bash
node scripts/verify-deploy.mjs --url https://domigo-v2.vercel.app
```
Must print **✓ deploy-truth OK — production is exactly origin/main**. It fails
loudly if the URL serves no `/api/version` (i.e. a blank/placeholder deploy) — the
guard that would have caught the un-connected project immediately.

## Step 4 — Provision `domigo_v2` on the Neon **production** branch  ·  ✅ done 2026-07-12 (via Neon SQL Editor)

> **✅ DONE 2026-07-12 — but NOT via the psql commands below.** This Mac has no
> `psql` / `pg_dump` / Homebrew, so the terminal path can't run. The schema was applied
> through the **Neon SQL Editor** instead (console → `domigo-db` → SQL Editor, branch
> **`main`**, database **`neondb`**): the six migration files concatenated and wrapped in one
> `BEGIN … COMMIT`, then a `pg_tables` verify. Result: 40 statements committed, **10
> `domigo_v2` tables created, 13 v1 `public` tables verified untouched**. The pg_dump diff
> was replaced by a static read confirming the DDL only touches `domigo_v2` + the pg_tables
> check showing `public` unchanged. **For future prod DDL (platform-wave 0006+), use the Neon
> SQL Editor** (or install the client first: `brew install libpq`). The psql recipe below
> stays as reference.

The v2 schema exists only on `v2-dev`; apply it to `main`. It is **additive** —
`0000_*.sql` opens with `CREATE SCHEMA "domigo_v2";` and all 14 tables are created
in `domigo_v2`; `drizzle.config.ts` (`schemaFilter: ["domigo_v2"]`) is the backstop.
Set `PROD` to the Neon **`main`** branch **direct** (non-pooled) URL:
```bash
# 1 · safety snapshot of v1's schema — it MUST be byte-identical afterwards
pg_dump "$PROD" --schema-only --schema=public > /tmp/public_before.sql
# 2 · apply the six migrations in order; stop on the first error
for f in packages/db/drizzle/000{0,1,2,3,4,5}_*.sql; do
  echo "applying $f"
  psql "$PROD" -v ON_ERROR_STOP=1 -f "$f" || { echo "FAILED on $f — STOP"; exit 1; }
done
# 3 · verify: public untouched, domigo_v2 present
pg_dump "$PROD" --schema-only --schema=public > /tmp/public_after.sql
diff /tmp/public_before.sql /tmp/public_after.sql   # MUST be empty → else STOP
psql "$PROD" -c '\dt domigo_v2.*'                    # practice_attempts, review_queue, user_progress, game_saves, …
```
**STOP** if the diff is non-empty. Then reload a signed-in page — no more 500s.

## Step 5 — Finish the Firebase→Neon migration  ·  *terminal, Koki (student PII)*

Pipeline exists in `scripts/migrate/` and is idempotent (`ON CONFLICT DO NOTHING`).
The 2026-05-17 run imported 110 students; only signups since then are missing.
```bash
gcloud auth application-default login    # Firebase project veho-vocab
DATABASE_URL="<Neon main branch>" pnpm run migrate:recipe   # export → build → apply to public.legacy_students
```
Review the audit JSON (counts; PINs flagged `unknown` = teacher resets) **before**
trusting it. Then the **claim flow**: `/signin/migrate` **does not exist yet** —
build it per [`../handover/03_migration.md`] (legacy username + 4-digit PIN → new
6-digit PIN → real name → link `legacy_students.newUserId`, copy XP/badges/streak)
as its own PR, and do one real end-to-end claim with a test legacy account.

---

**Done** = home + `/play/1` live · `verify-deploy` green · a student signs in, does a
practice item that persists to the prod DB, and loads a game.

[`../handover/DEPLOY_AND_HOSTING_STATUS.md`]: ../handover/DEPLOY_AND_HOSTING_STATUS.md
[`../handover/03_migration.md`]: ../handover/03_migration.md
