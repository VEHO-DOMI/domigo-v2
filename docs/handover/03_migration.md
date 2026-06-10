# 03 — Firebase → Neon Migration (status + the pending piece)

The legacy trainers were Firebase-backed. Students had accounts (username + 4-digit PIN) with XP, badges,
streaks. v1 built a pipeline to carry those into Neon so students keep their progress. **The pipeline
ran once (2026-05-17); new signups since then are NOT yet imported.**

## Complete, "pixel-perfect" import (Koki's words)
"Finish the migration to Vercel, pixel-perfect imported" = the move off the legacy trainers + Firebase to
v2 must carry **everything over with nothing dropped or mangled**: the **complete content corpus** (every
word / item / mode), **every feature** (including ones v1 dropped in its own migration — e.g. the legacy
**story mode**, see `06`/3.3), and **all student data + progress**. Treat the legacy trainers + v1 as the
parity oracle and **diff against them** so coverage is provably complete before any go-live. (Whether
"pixel-perfect" also means matching the legacy *visual* design is a question for Koki — the UX is being
overhauled (`06`/3.7), so the safe reading is total **content/feature/data fidelity**, with the legacy
look as reference, not a constraint.)

## The pipeline (`scripts/migrate/`)
Three idempotent, read-until-the-last-step scripts:
1. **`export-firebase.mjs`** (`npm run migrate:export`) — reads Firestore (project `veho-vocab`,
   `classes/*/students/*`), writes `exports/<ISO>/firestore-<classSlug>.json` + `summary.json`. Needs
   Google ADC (`gcloud auth application-default login` or `GOOGLE_APPLICATION_CREDENTIALS`). Read-only.
2. **`build-legacy-students.mjs`** (`npm run migrate:build`) — reads the export + `class_legacy_map`
   (from Neon, populated via the `/admin/legacy-map` wizard), classifies each PIN
   (`plain`→re-bcrypt / `bcrypt`→keep / `unknown`→teacher must reset), de-dupes by latest session,
   writes idempotent `legacy-students.sql` (`ON CONFLICT DO NOTHING`) + audit JSONs. Read-only.
3. **`apply-legacy-students.mjs`** (`npm run migrate:apply`) — the one write step; inserts into
   `legacy_students`. Safe to re-run.

Orchestrator: `npm run migrate:recipe`. A migrated student **claims** their account at
`/signin/migrate`: legacy username + 4-digit PIN → set a new 6-digit PIN → `realName` →
`legacy_students.newUserId` linked, XP/badges/streak copied into the new `users` row.

## Current state
- **2026-05-17 export:** 110 students across 12 class slugs (`1st-grade`, `1b`, `1c`, `2nd-grade`, `2b`,
  `2c`, `3rd-grade`, `3b`, `3c`, `4a`, `4th-grade`, `4c`), 0 errors, all PINs `plain` (re-bcrypted).
  Applied to Neon `legacy_students`. VEHO teacher owns 12 classes; slug map populated.
- **PIN quirk:** VEHO @ `3rd-grade` claims with `1234`; elsewhere `1304`.
- Counts at export time (students per slug): 1st-grade 6, 1b 4, 1c 2, 2nd-grade 31, 2b 2, 2c 2,
  3rd-grade 40, 3b 1, 3c 5, 4a 1, 4th-grade 16, 4c 0 → **110**.

## PENDING — "the new data that needs migrating"
Students who **registered in Firebase after 2026-05-17** are not in Neon. To capture them:
1. Re-run `migrate:export` → `migrate:build` → `migrate:apply`. Idempotent inserts mean already-imported
   rows are skipped (`ON CONFLICT DO NOTHING`).
2. **Do not clobber already-claimed accounts.** Before applying, check which `legacy_students` rows have
   `migratedAt`/`newUserId` set (students who already moved to Neon) and ensure the re-import doesn't
   reset their PIN/progress. The `ON CONFLICT DO NOTHING` on `(legacyClassSlug, legacyUsernameLower)`
   protects existing rows, but verify.
3. Confirm with Koki the **cutover moment** (when Firebase signups stop) so the final export is complete.
4. Spot-check: a post-May-17 student appears in `legacy_students`, can claim at `/signin/migrate`, and
   their XP/badges land correctly.

## Decommission (Phase E, later)
Once Neon is the system of record and claims have settled (the original plan allowed a 3–6 month
Firebase read-only archive window), retire Firebase. Keep `firebaseRawDoc` snapshots for audit.

## For v2
Whatever the new architecture, **preserve the migrated `users` + `legacy_students` data** (it's the real
students' real progress) and keep the `/signin/migrate` claim path working until every legacy student has
moved. Migration data is a **P0 durable asset** — design the v2 schema so this data ports cleanly.
