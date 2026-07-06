# DomiGo v2 — Build Status & Executable Roadmap

_Last updated: **2026-07-06**. Single source of truth for "what's done / what's next." Pairs with `docs/handover/` (the original design) and `docs/runbooks/` (operational detail). When you finish a step, check its box and update the snapshot in §3._

> **2026-07-06 — the completion program.** Koki approved the **Ultimate Vision Blueprint**: `docs/BLUEPRINT.md` (the program — audit verdicts, all workstreams, the W1–W9 milestone plan to the **hard Sept-1 go-live**, the session loops) + `docs/VISION.md` (north star, binding principles, decision ledger). Highlights: engine-hardening first (the `strict`-flag and direction/pool fixes), the 56-unit listening/test waves via **new A1–A2+ cloud skills**, ElevenLabs audio, **G4 pivoted to the real-life "Lost for Words" / Sprachwoche story — the fantasy design in `handover/13` is superseded by BLUEPRINT Part III.4**, the teacher mock-test designer + Studio + sandbox AI writing correction, Track D go-live, and the full v1-parity port. **Executor sessions boot from `docs/VISION.md` + `docs/BLUEPRINT.md` Part V — they supersede §4/§5 below for the W1–W9 window.** Status through **PR #81** (the blueprint, merged). Execution started 2026-07-06 with **A-1 quick wins**: the story games are now reachable from `/home` (+ a `/play` chooser), the admin stub became an honest all-grades mastery view, and the grade→story map is derived from the corpus — fixing a live bug where the attempts API's stale hardcoded map (missing g3) 400'd **every FOURTEEN `.ci.` comprehension attempt**, which also blocked all 14 episode wraps on the season board.

> **2026-07-06(c) — the ALIVE playability program approved** (`docs/BLUEPRINT.md` **Part VII**): the game-feel expansion — mobile controls for the Phaser overworld (it had NO touch input), the `@domigo/game-feel` juice kit + the app's first reduced-motion handling, the G1 RPG showcase wave, the tactile task layer (letter tiles / word chips / pair boards / buckets replacing text inputs + dropdowns), G2 point-and-click + G3 studio passes, and the autumn Fluency Arcade (supersedes P-3/P-4). Zero migrations, zero engine edits. Preceded by **E-1** (own PR): the unread `strict` flag on 662 items, the prompt-echo guard (8 error-correction items where typing the error graded correct), direction-aware vocab pools, validator V-23. Merged through **PR #82**; in flight: E-1 + this docs PR, then ALIVE-0.

> **2026-06-30 — major reconciliation.** This doc had drifted ~6 weeks behind `main`. The reality per the **78 merged PRs (#1–#78)**: the full P0 content, the entire P1 learning track, **and three of the four grade games are shipped** — G1 (now a full 15-zone uplift), G2 "The Wrong Name" (15 chapters + its complete Part-6 pedagogy), and G3 "FOURTEEN" (14 episodes), plus a brand design system across all 4 grades. **What's actually left to go-live: G4 "Syntaxia", the listening/test content waves, TTS, B2b teacher-grading, and Track D (migration cutover + bulletproof-beta).**

---

## 1. The original plan (the baseline we're measuring against)

DomiGo v2 is a from-scratch rebuild of the grades 1–4 EFL trainer (MORE! 1–4, A1–A2), PWA-first, go-live target **September 2026**. The roadmap (`docs/handover/09_roadmap_and_open_decisions.md`):

- **P0 — bulletproof foundation:** (1) content rework item-by-item with validators, (2) Firebase→Neon migration completion + claim flow, (3) UX/UI + stability hardening.
- **P1 — durable learning pillars:** **Study Path (+ Smart Review)** → Mock Tests → Listening.
- **P2 — engagement + platform:** Story/RPG game mode (tech spike first) → PWA install → native eval.
- **P3 — social (optional):** Battle Arena / Class Quiz / Study Buddies.

The game layer is specified separately in `docs/handover/10_game_layer.md` (four standalone grade games; G1 overworld RPG first) — it's the concrete form of P2 and reuses everything P1 builds (one grading brain, one spaced-retrieval service). **September floor (never preempted):** P0–P1 + Study Path + bulletproof checklist + g1 u1–5 + g2 ch1–5 + g3 ep1–5 + g4 first act. **Forfeit order on slip:** g4 depth → g3 → g2 → g1 zones → (never) the floor or item quality.

---

## 2. What's been achieved (78 PRs merged to `main`)

### ✅ P0.1 — Content rework COMPLETE ([#1](https://github.com/VEHO-DOMI/domigo-v2/pull/1)–[#17](https://github.com/VEHO-DOMI/domigo-v2/pull/17))
- **All 57 units (G1–G4)** of vocab + grammar approved at **0.0% stage-8 reject**, full v1 grammar parity; **4 structure catalogs (96 structures)**; **5,898 items** + 2,446 word-bank entries.
- Deterministic pipeline (`pnpm content`): generate → 4 verify lenses → validate (V-1…V-22 + V-A…V-F) → Fable stage-8 review. Re-runnable; corpus canonical. Receipts: `pnpm content status` → `approved=57`. Runbook `docs/runbooks/items-wave.md`.

### ✅ Runtime seam — Foundation harness COMPLETE ([#18](https://github.com/VEHO-DOMI/domigo-v2/pull/18))
`@domigo/content-loader` (load + overlay + validate) · `@domigo/engine` (the one 4-tier grader, 13 formats) · `@domigo/task-ui` (renders + grades all formats + vocab) · `apps/web` `/practice`. **All 5,898 items self-grade `correct`** against their own key.

### ✅ Live-app stopgap — G1 trainer upgraded (`1st-grade-vocab-trainer` [#1](https://github.com/VEHO-DOMI/1st-grade-vocab-trainer/pull/1))
Full content replace of the live standalone grade-1 app with the reviewed v2 corpus + v2 grammar parity, so real grade-1 students benefit **now**.

### ✅ P1 Track A — Smart Review COMPLETE ([#19](https://github.com/VEHO-DOMI/domigo-v2/pull/19), [#21](https://github.com/VEHO-DOMI/domigo-v2/pull/21)–[#24](https://github.com/VEHO-DOMI/domigo-v2/pull/24))
`@domigo/db` (Neon, `domigo_v2` schema, additive wall) — `practice_attempts` ledger + `review_queue` (Leitner 5-box) + `user_progress`. `getDueRefs`/`recordAttempt` powers Smart Review **and** game encounters. `POST /api/attempts` (one grading brain, idempotent). **Live-DB verified** (A1, #21 fixed a real idempotency bug). **Real auth** NextAuth v5 student+teacher (A2, [#22](https://github.com/VEHO-DOMI/domigo-v2/pull/22)). **`/review`** study UI (A3, #23). **Daily streaks + IndexedDB offline outbox** (A4, #24).

### ✅ P1 Track B — learning pillars COMPLETE ([#25](https://github.com/VEHO-DOMI/domigo-v2/pull/25)–[#27](https://github.com/VEHO-DOMI/domigo-v2/pull/27))
- **B1 Study Path** `/learn/[slug]` — derived node map (vocab intro → practice → grammar intro → practice → checkpoint), sparse `study_path_progress`, server-side unlock, stars; feeds Smart Review (#25).
- **B3 Listening** `/listening` — `listening@1`, Web-Speech/file player, sibling-gradeable `.li.` items, Leitner-skipped (#26).
- **B2 Mock Tests** `/tests` — `test@1` ref/reading/writing sections, `writing_submissions` capture (#27). _Teacher-grading deferred → B2b._

### ✅ P2 Track C — the game layer (3 of 4 games SHIPPED)
**Foundation:** `game_saves` + `/api/game-save` (#30) · `@domigo/game-core` + `@domigo/art-gen` (#31) · story pipeline + **VS-1…VS-12** validators (#32) · G0 contracts `story@1`/`map@1`/`quest@1`/`encounter@1` (#39). All on the 9 Laws (one grading brain, spaced-retrieval-as-physics, failure-changes-pace-not-position, bulletproof).

- **✅ G1 — "The Lost Pages" overworld RPG (Phaser).** Shipped u1–5 (#34/#36/#33/#37) then **fully uplifted to the G2/G3 bar** ([#72](https://github.com/VEHO-DOMI/domigo-v2/pull/72)–[#78](https://github.com/VEHO-DOMI/domigo-v2/pull/78)): a per-zone theming engine + **all 15 units as bespoke themed zones** (each a cameo + story arc), per-zone comprehension `.ci.`, a "Lost Pages" hub progress board, and an art-prompt pipeline. (See `~/.claude/plans/passover-g2-the-wrong-precious-forest.md` — COMPLETE.)
- **✅ G2 — "The Wrong Name" detective (DOM+SVG).** 15-chapter fair-play mystery (#40–#46) + ligne-claire raster art (#44/#45) + **the complete Part-6 pedagogy** (#47–#60): task-ui a11y, Clues/Evidence/Case economy + German-as-hint, Input→Guided→Output ladder, persistent hub Evidence Board, forgiving retries, scene-embedded variant carriers (all 15 ch), dialogue-comprehension `.ci.`, spaced-retrieval re-interview + scaffold fade + fair-play deduction, the "Solve the Case" finale, a teacher mastery view, and read-aloud. (Plan `~/.claude/plans/domigo-v2-velvet-squid.md` Part 6 — COMPLETE.)
- **✅ G3 — "FOURTEEN" graphic novel (DOM+SVG).** All 14 episodes (#61/#64/#66/#67/#68) — the warm→tense→reckoning→redemption arc with the comment-section consequence — + a season board (#69), story-comprehension `.ci.` (#70), and an art-prompt pipeline (#71).
- **❌ G4 — "Syntaxia"** — NOT started (the one remaining grade game).

### ✅ Cross-cutting — Brand design system ([#62](https://github.com/VEHO-DOMI/domigo-v2/pull/62), [#63](https://github.com/VEHO-DOMI/domigo-v2/pull/63))
A grade-indexed token system (G1 green / G2 red / G3 blue / G4 purple; Fredoka/Inter/Quicksand; glass+gradient) applied across all 4 grades' app-shell + task-ui + the 3 games.

---

## 3. Current-state snapshot

| Layer | State |
|---|---|
| **Content corpus** | ✅ 57 units / 5,898 items approved; canonical + re-runnable |
| **Loader / grader / renderer** | ✅ `@domigo/{content-loader,engine,task-ui}` |
| **DB / persistence** | ✅ `@domigo/db` (schema + Leitner + attempts + game_saves + writing_submissions); live-DB verified |
| **Auth** | ✅ NextAuth v5 (student + teacher), reuses Neon accounts |
| **Practice / Smart Review** | ✅ `/practice` · `/review` + session · streaks + offline outbox |
| **Study Path (B1)** | ✅ `/learn` node map (teach + practice + checkpoint) |
| **Listening (B3)** | ✅ `/listening` (runtime done; **content = pilot only**) |
| **Mock Tests (B2)** | ✅ `/tests` (runtime done; **content = pilot only**; teacher-grading → B2b) |
| **Game layer** | ✅✅✅ **G1 (15 zones), G2 (15 ch + full pedagogy), G3 (14 eps)** live · ❌ **G4 not started** |
| **Design system** | ✅ all 4 grades themed (#62/#63) |
| **Listening/Test content** | 🟡 **1 / 57 units** (g2-u03 pilot) — the big remaining content wave |
| **TTS audio** | ❌ Web-Speech fallback only; pre-generated files not built |
| **Teacher writing-grading (B2b)** | ❌ submissions captured, not surfaced |
| **Migration cutover / bulletproof-beta / PWA install** | ◻️ Track D — gates go-live; not done |
| `main` HEAD | merge #78 · full gate green (`typecheck/lint/test/content validate/validate-story/build/check:bundle`) |

**Repos:** `~/Code/domigo-v2` (VEHO-DOMI/domigo-v2, prod `domigo-v2.vercel.app`) · v1 reference `VEHO-DOMI/domigo` · live grade-1 app `VEHO-DOMI/1st-grade-vocab-trainer`.

---

## 4. What's left — executable steps (priority order)

> Each is a PR (or a wave). Build on `main`, branch `feat/<name>`. Gate: `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm content validate-story && pnpm build && pnpm check:bundle`. Deploys/merges are Koki's call.

### 1. G4 — "Syntaxia" (the last grade game) — _the biggest remaining build; full design in `10_game_layer.md`_
Grammar-structure mastery unlocks themed portal-worlds (past-tense pirate cove, conditional mirror maze, …); **real branching** story (choice graphs proven dead-end-free by VS-5); party members with a hint-economy (scaffolds, never answers); a structure boss per world. Stretch: one Three.js low-poly set-piece within the 30fps cheap-phone budget. Minimal German. Reuses every seam the other 3 games proved (story pipeline, task-ui overlay, `getDueRefs` encounters, `/api/attempts`, `game_saves`). Mirror the G2/G3 build: G0 story+map → vertical slice (GO/NO-GO) → act/world waves → enrichment (comprehension/board/art).

### 2. Content waves — `listening.json` + `test.json` for the other 56 units — _large, multi-session_
The runtime is done; the corpus is the pilot only (`g2-u03`). Author per `docs/runbooks/content-waves.md` (the `srdp-listening`/`srdp-reading` skills re-leveled A1–A2), validate (`pnpm content validate-listening` / `validate-test`), E2E spot-check, one grade at a time. **The single largest remaining effort.**

### 3. TTS audio (one PR `feat/tts-audio`) — _small_
`gen-audio.ts` + `pnpm content gen-audio`: hash each `listening.json` script → call the provider → write `public/audio/<hash>.mp3` → backfill `AudioRef.file`. One-line `AudioClip` URL fix. **Open decision: provider** (OpenAI `tts-1` recommended). Zero runtime change otherwise (the player already prefers `audio.file`).

### 4. B2b — Teacher writing-grading UI (one PR `feat/teacher-grading`) — _small, closes the Mock-Test loop_
Migration `0004` (additive `graded_at/score/feedback/graded_by` on `writing_submissions`) → `@domigo/db` getters/setter joined to v1 user names → `/admin/submissions` list + grade view → `/api/admin/grade-submission`. MVP = single-teacher (all submissions). Optional student grade-view in `/tests`.

### 5. Track D — Migration, cutover & bulletproof-beta — _gates any student go-live_
- **Migration completion** (`03_migration.md`): import post-2026-05-17 Firebase signups into Neon without clobbering claimed accounts; keep `/signin/migrate`.
- **Bulletproof-Beta checklist** (`09` §gate): every audited unit validator-green + spot-checked · all auth paths work · no route 500s · progress persists across sign-out/in · combos/XP/streaks correct · mobile-first on a cheap phone + PWA install + flaky-network · **~30-concurrent class-scale attempt test** · no dead toggles.
- **PWA install** + offline shell. **Firebase retirement** once v2 is live (+ one-time v1 frozen-XP → `user_progress` reconcile).
- **Cheap-Android perf pass** — the Law-9 perf budget (60/30fps, ≤50 draw calls, pause-on-blur, `?perf=1` HUD), a Playwright perf gate in CI.

### 6. Optional / polish
- **Real art PNGs** — run the committed prompt libraries (`docs/art/g1-lost-pages-prompts.html`, `g3-fourteen-prompts.html`; G2 already has wired raster art) → `public/art/g<n>/`. Procedural fallback until then.
- **Dark mode** pass across the surfaces. **Native eval** (Capacitor/Expo) per the open decision.
- **P3 social** (Battle Arena / Class Quiz / Study Buddies) — decide build-vs-drop; remove dead toggles either way.

---

## 5. Recommended order & dependencies

```
DONE: P0 content ─► harness ─► A (Smart Review) ─► B (Study Path/Listening/Tests) ─► design system
                                                  └─► C games: G1 ✓  G2 ✓  G3 ✓
NEXT (parallelisable):
  ① G4 Syntaxia (the last game)        ┐
  ② Content waves (listening/test)     ├─ all independent; pick by appetite
  ③ TTS · ④ B2b teacher-grading        ┘
  ⑤ Track D (migration + bulletproof-beta + PWA + perf)  ── GATES go-live (Sept 2026)
```
**Against the September floor:** the game layer is *well past* its floor for 3 of 4 grades (g1 all 15 / g2 all 15 / g3 all 14, vs. the floor's u1–5 / ch1–5 / ep1–5). The headline gaps to a shippable beta are now **G4**, the **content waves**, and **Track D** — not the learning spine or the first three games.

---

## 6. Reference

- **Packages:** `@domigo/content-schema` (zod item/structure/story/listening/test schemas) · `content-loader` · `engine` (grader) · `task-ui` (renderer) · `db` (persistence + Leitner + saves) · `content-pipeline` (`pnpm content …`) · **`game-core`** (quest/encounter/saves, pure) · **`game-2d`** (Phaser overworld; Phaser-free `/board` subpath for the hub) · **`art-gen`** (procedural tileset/sprite + per-zone `theme.ts`) · **`game-detective`** (G2) · **`game-novel`** (G3). _Games never import each other — they meet at `game-core`/`content-schema`._
- **Conventions:** packages export `./src/index.ts(x)`; tsconfig `erasableSyntaxOnly` (no enums), `verbatimModuleSyntax`, `noUncheckedIndexedAccess`. Content regenerable. DB **additive-only** on shared Neon (`domigo_v2`, never DDL/write `public`; prod DDL runbook-gated). Server-only loaders never import into `"use client"`. **Commit hygiene:** branch off `main`; never a bare `#N` in a commit message; end with `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`; leave PRs unmerged for Koki.
- **Identity swap point:** `apps/web/lib/identity.ts` `getActingUser`. **v1 port ref:** `gh repo clone VEHO-DOMI/domigo /tmp/domigo-v1-ref`.
- **Design docs:** `docs/handover/02` (data model) · `06` (pillars) · `07` (task formats) · `08` (the laws) · `09` (roadmap) · `10` (game layer) · `11` (remaining-work spec) · `12` (G2 passover). **Runbooks:** `docs/runbooks/{items-wave,content-waves}.md`.
- **The grade-game plans (all COMPLETE):** G1 uplift `~/.claude/plans/passover-g2-the-wrong-precious-forest.md` · G2 `~/.claude/plans/domigo-v2-velvet-squid.md` (Part 6) · G2 passover `docs/handover/12_g2_passover.md`.
