# Runbook — Firebase final import (Workstream 2)

**Status:** Firebase stays OPEN through school year 2025/26 (Koki's decision, 2026-06-10). This
runbook is written now, executed at cutover (late August 2026). A catch-up run is safe **any time**
(everything is idempotent); the *final* run happens after the freeze.

**What it does:** carries every legacy-trainer student who registered in Firebase after the
2026-05-17 export into Neon `legacy_students`, without touching anyone who already claimed an
account, so they can claim at `/signin/migrate`.

## Ground truth (from v1 / docs/handover/03_migration.md)

- 2026-05-17 export: **110 students** across 12 class slugs (`1st-grade`, `1b`, `1c`, `2nd-grade`,
  `2b`, `2c`, `3rd-grade`, `3b`, `3c`, `4a`, `4th-grade`, `4c`), all PINs `plain` → re-bcrypted;
  applied to Neon. VEHO teacher owns the 12 mapped classes.
- Teacher PIN quirk: VEHO claims with `1234` at `3rd-grade`, `1304` everywhere else.
- Firestore project `veho-vocab`, layout `classes/*/students/*`. Export needs Google ADC
  (`gcloud auth application-default login`) — read-only.
- Pipeline scripts (v1 repo `scripts/migrate/`, to be ported here in Phase 1):
  1. `migrate:export` — Firestore → `exports/<ISO>/firestore-<classSlug>.json` + `summary.json` (read-only)
  2. `migrate:build` — export + `class_legacy_map` → idempotent `legacy-students.sql` (`ON CONFLICT
     (legacyClassSlug, legacyUsernameLower) DO NOTHING`) + audit JSONs (read-only)
  3. `migrate:apply` — the one write step; inserts into `legacy_students`; safe to re-run
- Claim flow: `/signin/migrate` → legacy username + 4-digit PIN → new 6-digit PIN + realName →
  `legacy_students.newUserId` linked, XP/badges/streak copied into `users`.

## Pre-flight (any run)

- [ ] Working from a clean clone of THIS repo (never the iCloud v1 tree).
- [ ] `gcloud auth application-default login` done; `migrate:export` smoke-reads one class.
- [ ] Confirm target DB: catch-up/rehearsal runs go to the Neon `rehearsal` or `dev` branch first;
      only the final run targets prod, with Koki present.
- [ ] `pg_dump` of `legacy_students` + `users` taken and stored locally before any prod apply.

## Catch-up run (optional, any time — e.g. to test v2's claim flow with realistic data)

1. `npm run migrate:export` → note new export dir.
2. `npm run migrate:build` → review `summary.json`: new-student count per slug, PIN-kind histogram
   (`plain`/`bcrypt`/`unknown` — `unknown` rows need a teacher PIN reset after claim).
3. `npm run migrate:apply` against the **rehearsal** branch; run `verify-no-clobber` (below).
4. Nothing else. Prod stays untouched.

## Final run (cutover day, outside school hours, Koki present)

1. **Freeze**: stop sending students to the legacy trainers (announce in class/Schoolfox; the
   trainers are static GitHub Pages — practically the freeze is social, not technical). Record the
   freeze timestamp here: `____________`.
2. `npm run migrate:export` — the definitive export. Archive the export dir (cold storage copy).
3. `npm run migrate:build` — review `summary.json`. Expected: every slug's count ≥ its 2026-05-17
   count; investigate any slug that shrank (renames/deletions in Firebase).
4. `npm run migrate:apply` against **prod** (after the pre-flight `pg_dump`).
5. **`verify-no-clobber`** (script ported in Phase 1, `scripts/migrate/verify-no-clobber.mjs`):
   - every `legacy_students` row that had `migratedAt`/`newUserId` set before the apply is
     byte-identical after it (claimed accounts untouched);
   - every post-2026-05-17 Firebase signup now has a `legacy_students` row;
   - row count delta == new-signup count from `summary.json`.
6. **End-to-end claim test**: one real post-May-17 student (coordinated with Koki) claims at
   `/signin/migrate` on v2 prod; their XP/badges/streak land; sign-out/in works.
7. Teacher pass: Koki signs in (`VEHO`), checks rosters; resets PINs for any `unknown`-hash rows.

## Decommission (T+3–6 months after cutover, per 03_migration.md)

- [ ] Claims have settled (track: `SELECT count(*) FROM legacy_students WHERE migratedAt IS NULL`).
- [ ] Final Firestore export archived to cold storage (keep `firebaseRawDoc` snapshots until here).
- [ ] Firebase project `veho-vocab` deleted / downgraded; legacy trainer pages get a redirect note.
- [ ] Schema cleanup migration: drop `legacy_students.firebaseRawDoc`; then the wider v1-table
      cleanup per the cutover runbook.

## Rollback

- Export/build are read-only; apply is insert-only (`DO NOTHING` on conflict). Worst case after a
  bad apply: `DELETE FROM legacy_students WHERE migratedAt IS NULL AND created_at > <freeze ts>`
  then restore from the pre-flight `pg_dump` if anything else looks off. Claimed rows are never
  updated by the pipeline, so student progress is not at risk by construction — `verify-no-clobber`
  exists to prove that, not to fix it.
