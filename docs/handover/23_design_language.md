# 23 · The DomiGo Design Language — D-1 (Fable-authored, mockup-gated)

*Fable 5, 2026-07-13. Status: **DRAFT — decisions authored, MOCKUP GATE PENDING** (rendered
mockups per grade + master are the gate artifact; nothing below is implemented before Koki's
"looks fire"). Source of truth: `design-study-og-trainers.md` (same folder — the full
source extraction of all four OG trainers: verbatim hexes, ladders, XP economy) + my eyes-on
tour (2nd-grade landing, inside the 4th-grade app) + the v2 inventory (globals.css:84-105
accent-only theming; unused leaderboard tokens :53-63; hidden `user_progress.xp`;
`paintPlayerSprite(seed)`).*

**The thesis:** the OG trainers already ARE a design system — one codebase re-skinned by a
~30-token sheet per grade. v2 ported the four accent hexes and stopped. D-1 finishes the
port: the FULL token sheet per grade, the OG's dark "aurora glass" as v2's dark mode, the
proven XP/title machinery on v2's primitives, and one new layer the OG never had — a
**master identity** for the all-grades surfaces. Student-friendly and fancy, never generic:
every choice below traces to a thing his kids already loved.

---

## 1 · Token architecture (mechanism unchanged, coverage completed)

Keep v2's `[data-grade]` cascade exactly as-is; expand each grade block from ~6 overrides to
the full sheet (from the study, verbatim where possible):

- **Light theme per grade:** pastel-wash page bg (OG: accent at ~6% over warm white), white
  cards `--radius-lg: 24px`, controls `--radius: 16px`, gradient primary buttons
  (accent→accent-deep 135° + glow + inner highlight, hover-lift 2px), 3px gradient strip
  atop profile/hero cards, accent-soft tinted chips.
- **Dark theme per grade (the OG signature, currently absent in v2):** fixed 3-ellipse
  radial **aurora** in the grade hue over near-black, cards = accent-tinted glass
  (`backdrop-filter: blur(20px)`, low-alpha borders); g3/g4 get the amber "embers" accents.
  v2 has `.dark` tokens but NO toggle — **D-2 adds the ThemeToggle (v1 has one to port) +
  per-device persistence via the existing game-feel store pattern.**
- **Grade hues stay canon:** g1 `#16a34a` · g2 `#dc2626` · g3 `#2563eb` · g4 `#7c3aed`.
  Wordmark gradients per OG: g1/g2 monochrome accent; **g3/g4 end in gold `#d4943a`.**
- **Grade personality beyond hue** (from the study §12, folded into surface copy + texture):
  g1 German-first, soft/gentle (storybook motif carried from the hub skin) · g2 warm cream
  accents (`#FFF8F0`), burnt-orange for "wrong" (never collides with the red accent) ·
  g3 dark-first studio/episodes energy · g4 dark-first journal/portal energy.

## 2 · The MASTER identity (new — the all-grades layer Koki asked for)

For surfaces that belong to no grade (landing, /signin, /join, /admin, checkup print views):
**derive from the wordmark itself** — the blue→gold spectrum (`#2563eb → #d4943a`) that
already IS the brand's only cross-grade artifact. Neutral slate inks, warm-white surfaces,
the gradient reserved for the wordmark + one primary action per screen; admin gets the
calmest treatment (editorial: more whitespace, no glow). This makes shared pages feel like
DomiGo without feeling like any one grade — and the moment you enter a grade context,
`[data-grade]` takes over.

## 3 · XP, levels, titles (adopt the proven machinery, v2-native)

- **Curve: OG verbatim** — L1 0 → L20 30,000 (50/120/220/350/500/700/950/1250/1600/2000/
  2700/3500/5000/6500/8000/11000/15000/20000/30000) + 5 prestige tiers to 120,000 (⭐).
  Zones bronze/silver/gold/diamond/prestige — **v2's dead tokens `globals.css:53-63` finally
  light up** on level pills.
- **Four ladders, mapped to primitives v2 already tracks:** vocab (`user_progress.xp`) ·
  grammar (`grammar_xp`) · **overall = sum** (First Steps → English GOAT) · **class ladder**
  (collective, Study Group → World Class) = the weekly-goal surface.
- **Title ladders: keep BOTH registers** — g1 gets the gentle ladder (Wordling → Word
  Collector → … → Grandmaster), g2–4 the gamer ladder (Spell Rookie, Letter Looter, Vocab
  Raider, Grammar Ghost, Vocab Titan, Grandmaster) with the vibe lines ("just spawned in").
- **Economy: OG XP_TABLE adopted** — typed 7–10 XP, MC 3–5, combo tiers to 3× (g1 gentler
  2/4/7), perfect-session +20, day-streak bonus min(streak,7)×5. Wire into the existing
  `xpForTier`/`recordAttempt` path. **Checkups/mocks/assignments stay 0 XP (unchanged —
  test integrity).**
- **Where it shows:** home profile card (see §5), session-end screens (already show
  per-session XP — gain a level-progress bar), the hub.

## 4 · Leaderboard (Koki-gated: yes, teacher-toggleable)

**Weekly-XP window** (Monday reset, Vienna time) — deliberately NOT the OG's all-time
ranking, so late joiners and slow starters re-enter the race every week. Three tabs like the
OG minus battle: *Meine Klasse* / *Alle Klassen* (class chips) / *Wochenziel* (the class
ladder: collective bar toward the 5,000-XP weekly goal). Row = rank medal · avatar · nickname
· zone-colored title pill · weekly XP. Per-class toggle lives on the teacher's class page
(default ON; nicknames are already pseudonyms). Excludes assignment/checkup attempts by
construction (they award 0 XP).

## 5 · Avatars & unlockables (v2's own trick beats the OG's 50 PNGs)

The OG shipped 50 avatar PNGs, class-unique. v2 already has something better: the
**per-student procedural sprite** (`paintPlayerSprite(seed)`) — every child already owns a
unique character that walks through G1's world. D-4 promotes it to THE identity:
- Profile avatar = the sprite rendered in the OG composition (circular 64px, accent halo,
  gradient ring at prestige).
- **Unlockables = seeded accessories + palettes** at level milestones (L3 cap, L5 palette
  pack, L8 companion pixel-pet, L12 background scene, prestige = golden outline …) —
  deterministic from (seed, unlocked-set), zero image assets, and the same sprite appears
  in-game and on the leaderboard. Perks beyond cosmetics: streak shield (1/week, keeps a
  missed day), hub confetti, custom vibe line at L10 (from a curated list — level-gate holds).
- Storage: one additive jsonb on `user_progress` (`cosmetics`), teacher never manages it.

## 6 · D-3 · Student preview (the spec — closes the session-collision pain)

Teacher-session, zero impersonation: a `?preview=<studentId|anon>` mode on student routes,
honored ONLY when the session role is teacher AND the student belongs to their class
(server-checked). Renders the real student components read-only with a fixed top banner
("👁 Schüler-Vorschau — nichts wird gespeichert"): attempts POST disabled at the API by the
same check (server refuses writes in preview → zero rows, verifiable). Entry points:
every class roster row ("Ansehen als…"), every assignment/checkup card ("Als Schüler
ansehen"), the builder (upgrade the static outline to the REAL task-ui render). No session
switching, no second cookie, teacher stays signed in.

## 7 · Scope fences (so D-2..4 stay shippable)

Battle Arena (Live Battle / Word Duel / Class Quiz) = **its own future lane** (needs
realtime infra; the study §9 documents the mechanics for that day) · practice-mode variants
(Sprint/Speed Round/Memory Match…) = post-D-4 candy, the pool rotation already covers the
pedagogy · 28-badge system = later (levels+titles first) · Word of the Day / Daily Challenge
= J-wave journeys territory.

## 8 · The mockup gate (next Fable session — the D-1 exit)

Per Koki's standing amendment (SRDP skins): **full conviction per mockup, every disclosure
implemented.** Deliverables: 5 rendered HTML mockups — g1/g2 light (their register), g3/g4
dark-aurora (theirs), master (signin + admin header) — each showing: home with profile card
(sprite avatar, dual XP bars, title pill, streak), one practice card, the leaderboard, and
the grade wordmark treatment. Gate = Koki's verdict on the mockups; then D-2 implements
token-sheet-first (one PR: tokens + toggle), then surface waves, each screenshot-checked
against its mockup (10A).

## 9 · Execution order (inside the approved amendment-d plan)

D-1 mockups (Fable, next session) → **mockup gate** → D-2 tokens+dark-mode+toggle (Opus) →
D-2 surface waves (Opus, per grade) → D-3 preview (Opus) → D-4 XP/titles/leaderboard/
cosmetics (Opus; one additive migration) — all interleaved with the C-1→B-2 lanes per the
plan. Every wave: standing gate + screenshot-vs-mockup + the no-second-grader / 0-XP-tests /
level-gate invariants re-asserted in tests.
