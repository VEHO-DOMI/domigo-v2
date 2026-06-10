# 02 — Architecture & Data Model

The technical reference: DB schema, auth, the content data model, every item type + how it's graded,
and the content-generation pipeline. Re-port the **specs** even if you re-architect the app.

## Code conventions (v1)
- Pure helpers in `lib/*`; server actions in `lib/actions/*` (`"use server"`, return `{error}` or data,
  never throw to client); pages are server components that `await auth()` and gate; interactive UI in
  colocated `*Client.tsx` (`"use client"`).
- Tests: `scripts/test-<n>.mjs` spawns `node --experimental-strip-types scripts/test-<n>.inner.mts`;
  inner files import `../lib/foo.ts` (extension-ful) — `@/` extensionless ESM breaks the strip-types
  runner.
- **iCloud path gotcha:** Node "run as main" guards must use `import.meta.url ===
  pathToFileURL(process.argv[1]).href` — the ``file://${argv[1]}`` idiom silently fails on the
  space-containing iCloud path. Delete `* 2.*` iCloud dup files before committing.

## Database schema (Neon / Drizzle — `lib/db/schema.ts`)
UUID PKs, TZ timestamps, sensible indexes throughout.
- **`classes`** — `teacherId`, `name`, `inviteCode` (unique, dashed 6-char, ambiguous chars excluded),
  `grade` (1–4), `archivedAt`, 8 feature booleans (`vocabEnabled`, `grammarEnabled`, `battleEnabled`,
  `classQuizEnabled`, `leaderboardEnabled`, `dailyChallengeEnabled`, `smartReviewEnabled`,
  `buddiesEnabled`), `reservedTaskSlugs[]`.
- **`users`** — students + teachers (`role`), `displayName` (lower-cased; unique per class for
  students), `pinHash` (bcrypt 12), `email?` (teachers), `classId?`, `realName?` (teacher-visible only),
  `onboardedAt?`, `socialOptIn`, `leaderboardOptIn`, `avatarKey?`, and progression: `xp`, `grammarXp`,
  `level`, `grammarLevel`, `streak`, `lastSessionDate` (`'YYYY-MM-DD'` Vienna), `totalSprints`,
  `totalFlashcards`, `lastSeenAt`.
- **`legacy_students`** (migration staging) — `legacyClassSlug`, `legacyUsername(+Lower)`,
  `legacyPinHash?`, `legacyPinHashKind` (`plain`|`bcrypt`|`unknown`), snapshot `legacyXp/GrammarXp/Level/
  Streak`, `legacyBadges[]`, `legacyLastSession`, `firebaseRawDoc` (jsonb), `migratedAt?`, `newUserId?`.
  Unique `(legacyClassSlug, legacyUsernameLower)`.
- **`class_legacy_map`** — `legacyClassSlug` (unique) → `classId`, `grade`.
- **`vocab_attempts`** / **`grammar_attempts`** — one row per item answered (`userId`, `classId`,
  unit/structure + `itemId`, `mode`/`type`, `correct`, `latencyMs`, `xpAwarded`, `hintUsed`, `createdAt`).
- **`speed_round_sessions`** / **`grammar_blitz_sessions`** — durable 60s timers (`startedAt`,
  `deadlineAt` = +60s +3s grace, `itemsCorrect`) for stateless lambdas.
- **`badges`** (catalog, seeded from `data/badges.json`) + **`badge_awards`** (unique `(userId,badgeId)`).
- **`daily_challenges`** (per class/day, `seed`, `items` jsonb) + **`daily_challenge_attempts`**.

Migrations in `lib/db/migrations/` (`npm run db:generate`). **Do NOT run `db:push`/`migrate:apply`
against prod Neon without the owner** — prod `main` branch tables are applied manually.

## Auth (`lib/auth.ts`, `middleware.ts`)
Two Credentials providers. **Student** = invite code + nickname + 6-digit PIN; **Teacher** = nickname +
4–6 digit PIN. JWT 30-day; `lastSeenAt` debounced bump in the JWT callback; `onboardedAt` self-heals.
Middleware: unauth → `/signin` (or `/admin/signin`); un-onboarded student → `/onboarding`; non-teacher
on `/admin/*` → `/home`. PIN hashing in `lib/pin.ts`; legacy token helpers in `lib/legacy.ts`.

## Content data model
### Vocab entry (`lib/vocab-types.ts`)
`w` headword · `g` German · `d` English definition (**must not leak `w`**) · `s` example sentence with
`_____` blank · `a?` alternates · `cf?` canonical form (e.g. "play" for "to play") · `mc?` 3 MC
distractors · `col?` collocations (unused). Files: `data/vocab/{grade}/unit-NN.json` →
`{slug,grade,unit,title,entries[]}`.

### Grammar item (`lib/grammar-types.ts`)
`id` · `sid` structure · `u` unit · `t` type · `d` difficulty 1–5 · `p` prompt · `c` canonical answer ·
`a?` alternates · `ds?` distractors/right-options · `h?/hd?` hint EN/DE · `e?/ed?` explanation EN/DE ·
`strict?` exact-match flag. Files: `data/grammar/m{1..4}.json` → `{module,grade,structures[],items[]}`.
Structures carry `n/nd` (name EN/DE), `cat`, `desc`, `kf` (key forms), `errs` (common errors).

### Manifests (`data/*-index.json`)
Slim summaries built by `npm run build:*-manifest` — grammar index keeps structures + **item counts**
(not item bodies), vocab index keeps unit summaries, plus activity/arcade indexes.

## Item/task types + grading (`lib/grammar-grading.ts`, `lib/vocab-grading.ts`)
- **Canonicalize:** lowercase, trim, strip trailing `.!?`. **Levenshtein "close":** grammar budget
  `min(2, max(len≥4?2:1, floor(len×0.15)))`; vocab uses 0.20. **"close" = 50% XP**, resets combo.
- **Text-input** (gap-fill, error-correction, transformation, translation, free-form,
  question-formation): exact + alternates + close; the free-text grammar types also get a
  **partial-match fallback** (normalized containment, ≥40% length ratio, ≥2 words). `strict:true`
  disables close + partial.
- **Button** (multiple-choice, context-picker): exact match only.
- **sentence-building:** join chips, grade like gap-fill (exact + close), **no** partial.
- **matching:** `c` = JSON map `{"1":"b",…}`; compared order-independently, **all-or-nothing**.
  Renderer `lib/grammar-matching.ts` parses lefts from `p`, rights from `ds`.
- **anagram / group-sort / matching-pairs:** arcade-rendered; data shapes in
  `~/.claude/plans/domigo-D14-tasks-and-handover.md` (group-sort `c` = `{group:[ "display|key",…]}`,
  matching-pairs `c` = `[["child","children"],…]`, anagram `c` = the target word).
- **Alternates = full credit.** There is **no semantic near-synonym / partial-credit** path beyond the
  typo-level "close" — `04`/`08` require adding one.

## Content generation pipeline (important — content is GENERATED)
`data/vocab/**` + `data/grammar/m*.json` are produced by `npm run extract:content`
(`scripts/migrate/extract-content.mjs` → `shared/extract-from-html.mjs`), which runs the legacy
trainers' inline `vocabData`/`grammarItems` `<script>` blocks in a `vm` sandbox and writes deterministic
JSON. **Idempotent** (byte-identical re-runs). **Editing the JSON directly is clobbered** on the next
run. The only hand-authored override is `scripts/migrate/cleanups/vocab-leak-fixes.json` (applied to
vocab during extraction). Manifests rebuilt via `npm run build:manifests`.

**For v2:** replace this legacy-HTML source of truth with a **MORE!-textbook-transcript → corpus**
pipeline + a validation gate (`04`), so content is regenerable and textbook-faithful rather than
inherited from the old trainers.
