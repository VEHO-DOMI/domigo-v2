# 01 — Status Quo: everything v1 does (reference implementation)

A complete inventory of the working v1 app. Treat it as **prior art to learn from and re-port**, not as
the thing to extend. Build status: ✅ shipped/working · 🟡 fresh/verify · ⛔ flagged but not built.

## Stack & deployment
- Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind v4.
- NextAuth v5 (Credentials, JWT 30-day, bcryptjs cost 12).
- Neon Postgres (`@neondatabase/serverless` HTTP) + Drizzle ORM 0.45.
- Server Actions for all writes; static JSON content under `data/`.
- Vercel hosting; CI = `lint-and-typecheck` (only required check). Neon free-tier 10-branch cap makes
  the **Vercel preview check fail on every PR** (infra, not code; prod deploys from `main` are fine).

## Routes
**Auth/landing:** `/` · `/signin` (student: invite code + nickname + 6-digit PIN) · `/signin/migrate`
(+`/complete`, legacy claim) · `/admin/signin` (teacher) · `/signout`.
**Student:** `/home` · `/onboarding` · `/profile` · `/profile/settings` (avatar).
**Vocab:** `/vocab` · `/vocab/[grade]/[unit]` · `…/play` · `…/memory-match` · `…/word-hunt` ·
`…/spelling-bee` · `/vocab/[grade]/dictionary`.
**Grammar:** `/grammar` · `/grammar/[module]` (by-topic / by-task tabs) · `…/play` · `…/blitz` ·
`…/anagram` · `…/matching-pairs` · `…/group-sort`.
**Other:** `/activity/[grade]` (+`/play`,`/results`) · `/daily` · `/leaderboard`.
**Teacher:** `/admin` · `/admin/classes/[code]` · `/admin/legacy-map`. **API:** `/api/auth/[...nextauth]`.

## Game modes (the full list)
### Vocab (per grade → unit)
| Mode | What | XP | Status | Client |
|---|---|---|---|---|
| Full | every word, mixed Q-types (context/definition/translation) | ✅ | ✅ | `…/play/VocabPlayClient.tsx` |
| Sprint | 10 random words | ✅ | ✅ | same |
| Speed | 60s timed (server deadline) | ✅ | ✅ | `…/play/SpeedRoundClient.tsx` |
| Multiple choice | 4-option tap | ✅ | ✅ | same |
| Flashcards | flip to study | none | ✅ | `…/play/FlashcardsClient.tsx` |
| Memory Match | EN↔DE pairs | ✅ | ✅ | `…/memory-match/…` |
| Word Hunt | tap all words matching a clue | ✅ | ✅ | `…/word-hunt/…` |
| Spelling Bee | spell from German prompt | ✅ | ✅ | `…/spelling-bee/…` |
| Dictionary | browse/search all words + examples | — | ✅ | `…/dictionary/…` |

### Grammar (per module m1–m4)
| Mode | What | Status |
|---|---|---|
| Play (by topic / by task) | one-question practice; **9–10 item types** | ✅ |
| Blitz | 60s grammar speed round (text + button types) | ✅ |
| Anagram | unscramble letters | 🟡 (recent) |
| Matching Pairs | flip-card pair match | 🟡 (recent) |
| Group Sort | sort into grammatical buckets | 🟡 (recent) |

Grammar Play item types: gap-fill, multiple-choice, error-correction, transformation, translation,
free-form, question-formation, context-picker, sentence-building, **matching** (now playable, #37/#41).

### Other
- **Activity Game** (team "Draw / Show / Explain", per grade) ✅.
- **Daily Challenge** (10-item, deterministic per class per Vienna day) ✅.

> **Dropped from the legacy trainers:** each legacy `{1,2,3,4}*-grade-vocab-trainer` had a **story /
> adventure / quest mode** that v1 never ported. Koki wants it **reworked** and brought back, far richer
> (see `06`/3.3). This is the main *feature* lost in the v1 migration.

## Gamification
- **XP** per attempt, type-weighted (context 8 / definition 10 / translation 7 / MC 3–5; default 5);
  **combo** 1×→1.5×(3)→2×(5)→3×(10); **session bonus** (+20 perfect ≥5 items; `min(streak,7)×5`);
  **hint penalty** −2/−3. Separate **vocab XP** and **grammar XP** pools. (`lib/xp.ts`,
  `lib/xp-formulas.ts`.)
- **Levels 1–30+** + **prestige** tiers; **class level** aggregates a class.
- **Streaks** (Vienna-day, DST-safe; `lib/streaks.ts`). **Badges** 50+ (`data/badges.json`, ~16 wired,
  rest deferred). **50 avatars**. **Leaderboard** (opt-in). **Home dashboard** + **Profile**.

## Teacher / admin
Create classes (grade 1–4), invite codes, roster with stats, **8 per-class feature toggles** (vocab,
grammar, daily, smart-review, leaderboard, battle, class-quiz, buddies), PIN reset, archive, legacy
class-mapping wizard.

## Content scope (grades 1–4)
| Grade | Module | Vocab units | Grammar structures | Grammar items |
|---|---|---|---|---|
| 1 | m1 | 15 | 34 | 858 |
| 2 | m2 | 15 | 22 | 442 |
| 3 | m3 | 14 | 18 | 606 |
| 4 | m4 | 13 | 15 | 599 |

≈2,800 vocab words, ≈2,505 grammar items. `matching` = 115 items. Grammar modules are **cumulative**
(a G3 student gets m1+m2+m3).

## Flagged but NOT built (⛔)
DB flags + admin toggles exist; **no backend**: **Battle Arena**, **Class Quiz**, **Smart Review**,
**Study Buddies**. Pusher env vars stubbed. Decide per-feature in v2 (`06`).

## Test accounts
Student `tester / 123456` (class `TST-001`, grade 1). Teacher `VEHO / 1304` (owns 12 classes 1A–4C).
110 migrated students sit unclaimed in `legacy_students` (claim at `/signin/migrate`).
