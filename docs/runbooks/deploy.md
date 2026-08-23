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

> **Warum zwei Namensfamilien — und warum das KEIN Fehler ist** (gemessen 2026-08-23, an
> Vercel und am Repo). Vercel trägt `NEXTAUTH_SECRET`, `NEXTAUTH_URL` und `AUTH_URL`;
> `apps/web/.env.example` nutzt lokal `AUTH_SECRET` und `AUTH_URL`. NextAuth v5 liest
> **beide** Familien (`AUTH_*` mit `NEXTAUTH_*` als Rückfall), deshalb läuft die
> Produktion mit den v4-Namen völlig korrekt. **Es fehlt also keine `AUTH_SECRET`-Variable
> in Vercel** — wer danach sucht, sucht nach etwas, das der `NEXTAUTH_SECRET`-Eintrag
> bereits ist (der GO-Plan tat es und verlor Zeit). Wer umbenennt, muss beide Namen
> gleichzeitig setzen und danach neu ausrollen; solange kein Grund dafür besteht, bleibt es
> wie es ist. _Am Quelltext nachgeprüft 2026-08-24: `next-auth@5.0.0-beta.31`,
> `lib/env.js` — `process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET` und
> `process.env.AUTH_URL ?? process.env.NEXTAUTH_URL`._
>
> **Neon-Passwörter sind nicht verloren, wenn der Dialog weg ist** (bezahlter Fund
> 2026-08-23): ein Rollen-Passwort ist über **Connect → „Show password"** jederzeit wieder
> abrufbar. Ein weggeklickter Reset-Dialog erzwingt **keinen** zweiten Reset — und ein
> zweiter Reset würde jede Verbindungs-Zeichenkette ungültig machen, die schon irgendwo
> eingetragen ist.

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

## Step 5 — Migrationen anwenden (die wirkliche Praxis)  ·  *dev: Skript · Prod: Neon-Editor + Koki*

> **Korrigiert 2026-08-24 (PLATT-K9a).** Hier stand bis heute eine Anleitung auf
> `scripts/migrate/` + `pnpm run migrate:recipe`. **Beides gibt es in diesem Repo nicht
> und hat es nie gegeben** — gemessen über die GANZE Geschichte, nicht nur den heutigen
> Stand: `git log --all -- scripts/migrate` und `git log --all -S "migrate:recipe" --
> '*package.json'` liefern beide null Commits. Die Pfade stammen aus dem v1-Repo
> (`firebase-final-import.md` sagt es selbst: „v1 repo `scripts/migrate/`, to be ported
> here"). Was hier steht, ist die Praxis, die die Plattform-Wellen P1–K2 tatsächlich
> gefahren sind.

**Der v2-DEV-Zweig: ein Skript pro Migration.** Jede Migration bekommt ihr eigenes
Anwende-Skript neben dem generierten SQL, Muster `packages/db/scripts/apply-0016-dev.mjs`:

```bash
node packages/db/scripts/apply-00NN-dev.mjs      # NN = die Nummer der Migration
```

Vier Eigenschaften machen es sicher, und ein neues Skript kopiert alle vier:
- **Host-Sperre** — das Skript bricht ab, wenn die Adresse in `apps/web/.env.local` nicht
  der v2-dev-Compute ist. Gegen die Produktion kann es nicht laufen.
- **Die Anweisungen kommen aus der GENERIERTEN Datei** (`packages/db/drizzle/00NN_*.sql`),
  nie aus abgetipptem SQL — die angewandte DDL kann so nicht von der abweichen, die
  `drizzle-kit` später gegen den Schnappschuss hält.
- **Wiederholbar** — eine schon vorhandene Tabelle/Spalte ist kein Fehler, sondern der
  Zustand „liegt bereits".
- **Belege** — Katalog-Abfragen nach dem Lauf plus gedruckte Rückroll-Zeilen.

**Die PRODUKTION: das GO-Ritual im Neon-SQL-Editor, von Koki.** Kein Skript, kein `psql`
(dieser Mac hat keins), kein Runner mit Zugriff auf Prod:
1. Identität der Datenbank prüfen, **bevor** die erste Anweisung läuft.
2. **Eine Anweisung je Lauf** — die Konsole verschluckt die Ergebnisse von
   Mehrfach-Anweisungen, und ein Rest im Editor läuft als zweite Anweisung mit.
   Editor vor jeder Anweisung leeren.
3. Nach jeder Anweisung die mitgelieferte **Verifikations-Abfrage** (`RETURNING` bzw. ein
   `SELECT`) — und ihr Ergebnis gegen die erwartete Zahl halten. „1 Zeile" allein beweist
   nichts, wenn es die Zeile der vorigen Anweisung ist.
4. Roh-SQL-Migrationen tragen **keine Anwendungs-Buchführung**: was angewandt ist, wird
   gemessen, nicht einer Notiz geglaubt.

**Das ausgearbeitete Muster** dafür ist [`rollover-snapshot.md`](rollover-snapshot.md) —
Schritt-für-Schritt mit Verifikation und STOPP-Bedingung je Schritt; die GO-Sitzung vom
2026-08-23 ist es gefahren (0012/0013/0014 auf Prod, 20 → 21 Tabellen).

> **HISTORISCH — der Firebase→Neon-Import ist gestrichen.** Bis 2026-08-23 stand hier der
> Plan, die Nachzügler-Anmeldungen seit dem 2026-05-17-Lauf nachzuimportieren und einen
> Claim-Fluss `/signin/migrate` zu bauen. **Koki-Ruling P-R4 (2026-08-23): kein Import,
> vollständige Tabula rasa** — das Schuljahr 2026/27 beginnt mit frisch angelegten Klassen
> und Konten; der Lernstand wird bei Bedarf **von Hand im Großmeister-Baukasten**
> angepasst. Das Firebase-Projekt bleibt als Archiv bestehen und wird **nie gelöscht**.
> Der Zustands-Schnappschuss (P4, #359) ist die Sicherung, nicht der Import.

---

**Done** = home + `/play/1` live · `verify-deploy` green · a student signs in, does a
practice item that persists to the prod DB, and loads a game.

[`../handover/DEPLOY_AND_HOSTING_STATUS.md`]: ../handover/DEPLOY_AND_HOSTING_STATUS.md
