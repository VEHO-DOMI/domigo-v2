# 21 · Checkup presets — the F-1 extraction (C-1's build contract)

*Fable 5, 2026-07-13. Status: **GATED — Koki's answers recorded in §8 (2026-07-13, same day)**.
This document is the binding spec for C-1 (`BLUEPRINT_V2.md` Part V step 13); the executor
builds against §3–§7 + §4b + §5.5 verbatim and treats §8's recorded decisions as law.*

**Sources (ground truth, not memory):**
- Koki's real checkups: 21 papers in iCloud `Domi Gym/Claude/Check up Skill Source Data/`
  (2A: u5/6/7/9 · 3AW: u1–5/7 · 4B: u2/4/5/6/7 incl. Group A/B variants), plus its
  `CHECKUP_ANALYSIS.md`. Two papers re-verified against the originals for this doc
  (2A U6 and 4B U6-A — both match the analysis exactly, both sum to /20).
- The `efl-checkup-generator` skill bundle (same folder) — the docx-generation framework.
- Repo inventory with file:line anchors (M-wave reuse surface), 2026-07-13.

**Source-of-truth amendment (Koki, 2026-07-13):** the LIVING corpus is the per-unit material
folders — `Domi Gym 2025:26/<class>/Units MORE N (2025:26)/Unit X …/` — which hold his most
recent, actually-used checkups (far more units than the Source Data folder: ~12 g2 units,
Group-A/B pairs across g3/g4). Six 2025/26 papers were structure-verified for this gate
(g2 u12/u13 · g3 u8/u9 · g4 u2/u9): **all sum to /20; section counts and point splits VARY
freely** (e.g. 4B u9 = 8+2+2+8) — confirming the model below: presets are DEFAULTS, the
teacher edits everything, only Σ=20 is enforced. Future calibration reads THESE folders first.

**The invariant that names the feature: every checkup is exactly /20.**

---

## 1 · What a checkup IS (the canon in one paragraph)

A checkup is Koki's one-page, ~15-minute unit test: first-letter gap-fills in rich sentence
contexts (the backbone — in every paper), a small translation table in both directions,
one grammar section testing exactly the unit's taught point, and (grade-dependent)
definitions or picture vocabulary. Points: ~40–50% vocabulary, ~25–35% grammar, ~10–20%
translations. The scaffolding ladder rises with grade: single first letter (g2) → multi-word
first letters and definition hints (g3) → professional multi-word vocabulary where the
student must also inflect (g4). Context is load-bearing by design: *"the sentences
deliberately avoid being trivially solvable from the first letter alone."*

## 2 · Paper → platform mapping (the 9 observed question types)

| # | Paper type (corpus) | Platform compilation | Where it lives |
|---|---------------------|----------------------|----------------|
| 1 | Words & phrases, first-letter gap-fill | vocab **carrier** pool + `mask:'first-letter'` (NEW render prop; grading unchanged) | `checkupKind:'words-phrases'` |
| 2 | Translation table De↔En | vocab **deToEn / enToDe** pools (A-6, live), mixed directions | `checkupKind:'translations'` |
| 3 | Word for definition | vocab **definition** pool (`dAnswers`), optional first-letter mask | `checkupKind:'definitions'` |
| 4 | Grammar verb-form / fill-in | grammar `gap-fill` items of the unit's point | `checkupKind:'grammar'` |
| 5 | Picture tasks | vocab `mc` distractors as multiple-choice — **gate decision §8-②** | `checkupKind:'picture-mc'` (v1: pending) |
| 6 | German prompt → English sentence | grammar `translation` format (exists) | folds into `'grammar'` |
| 7 | Definition-match fill-in (no letter) | `'definitions'` without mask | config flag |
| 8 | for/since circle-the-word | grammar `context-picker` / `multiple-choice` (exist) | folds into `'grammar'` |
| 9 | Rewrite with structure (unless…) | grammar `transformation` (exists) | folds into `'grammar'` |

Everything except the first-letter mask and picture-MC rendering already exists and is
engine-graded today. **One brain holds:** checkups introduce no new grader — every answer
runs through `@domigo/engine` exactly as practice does, `singleAttempt` (first submit is
terminal), **hints suppressed** (`hintDe` never shown — paper checkups have no hints).

## 3 · `section_config` (the single new column, migration 0009)

```jsonc
// assignment_sections.section_config (jsonb, nullable — null on non-checkup sections)
{
  "checkupKind": "words-phrases" | "translations" | "definitions" | "grammar" | "picture-mc",
  "points": 6,                      // integer ≥1; all sections sum to EXACTLY 20 (server-validated)
  "mask": "first-letter" | null,     // words-phrases default ON; definitions default OFF
  "direction": "mixed" | "deToEn" | "enToDe"  // translations only; 'mixed' = half/half, De→En gets the odd one
}
```

One item = one point (each `points` also fixes the section's item count; `TIER_POINTS`
half-credit still applies per item, so a `partial` earns 0.5). This keeps his integer-feel
paper model AND reuses the existing pure scoring unchanged.

## 4 · `GRADE_STRUCTURES` — the per-grade /20 presets (defaults, editable in the builder)

Presets are the canonical DEFAULT; the teacher may adjust sections/points in the builder,
and the server enforces Σ=20 regardless. Section order below = rendered order (one page).

### Grade 2 — modeled on the real 2A papers (e.g. U6: 3+5+6+6)
| § | checkupKind | points | config |
|---|-------------|--------|--------|
| A | picture-mc *(pending §8-②; defer ⇒ +3 to words-phrases)* | 3 | — |
| B | words-phrases | 5 | mask: first-letter |
| C | grammar | 6 | unit's taught point |
| D | translations | 6 | mixed |

### Grade 3 — modeled on the real 3AW papers (gap-fill-heavy, two grammar blocks)
| § | checkupKind | points | config |
|---|-------------|--------|--------|
| I | words-phrases | 8 | mask: first-letter (multi-word masks appear here) |
| II | translations | 4 | mixed |
| III | grammar | 5 | unit's taught point |
| IV | grammar | 3 | transformation/rewrite-weighted (type 9) |

### Grade 4 — modeled on the real 4B papers (five sections, definitions enter)
| § | checkupKind | points | config |
|---|-------------|--------|--------|
| I | words-phrases | 6 | mask: first-letter |
| II | translations | 4 | mixed |
| III | definitions | 4 | mask off (type 7) |
| IV | grammar | 4 | unit's taught point |
| V | grammar | 2 | second point / linking words where the unit has one |

### Grade 1 — **DERIVED, not extracted** (no g1 papers exist in the corpus — flag for the gate)
Rationale: g2's shape, simplified one rung (A1 kids, German-first platform chrome).
| § | checkupKind | points | config |
|---|-------------|--------|--------|
| A | words-phrases | 6 | mask: first-letter |
| B | translations | 5 | mixed, En→De-leaning acceptable |
| C | grammar | 6 | unit's taught point |
| D | picture-mc *(pending §8-②; defer ⇒ +3 to translations)* | 3 | — |

## 4b · Two creation modes, both native (Koki requirement, 2026-07-13)

The teacher chooses per checkup; both modes end in the same `mode:'checkup'` assignment:

1. **Automated generation** — pick unit + grade preset → `composeCheckup` fills the sections
   (rules in §5) → teacher reviews the composed paper, may swap any item or adjust section
   points → publish. The LLM sanity gate (§5.5) runs before publish.
2. **Manual assembly** — the teacher builds from the item library (the existing
   `AssignmentBuilder` picker, extended): choose items per section, set **points per
   section** (dynamic, teacher-controlled; server still enforces Σ=20 for `mode:'checkup'`),
   set the **timer**, schedule the **window** (`startsAt`/`dueAt` — already exist), set
   attempts. Manual mode draws on the post-A-5 curated library (every item already
   engine-verified), so the LLM gate is optional here (default off).

**Feedback & grading visibility (both modes, teacher-controlled):** new assignment-level
`display_config` jsonb (rides migration 0009 as a second additive column):
`{ feedback: 'immediate' | 'on-submit' | 'on-release', showScore: 'on-submit' | 'on-release' }`.
'immediate' = per-item verdict as the student answers (practice-like); 'on-submit' = verdicts
+ points appear when the paper is submitted (checkup default); 'on-release' = nothing until
the teacher releases results. This knob applies to mock tests too (same machinery).

**Native editability (standing platform principle, Koki 2026-07-13):** everything above is
edited IN the platform — no config files, no redeploys. Presets seed; the UI owns the values.

## 5 · Composition rules (`composeCheckup(unit, classId, config)`)

1. **Eligibility filters, in order:** items of the unit only → level-gate holds by
   construction (unit items) → **active `reserved_items` for the class are EXCLUDED** →
   per-kind format filters (below) → items whose needed pool answers exist
   (`translations` needs the direction's array non-empty; `definitions` needs `dAnswers`;
   `picture-mc` needs `mc`).
   - **⚠ Supersedes** `BLUEPRINT_V2.md:242`'s "reserved-first": composing checkups FROM the
     mock reserve would burn exactly the items being kept fresh for the Schularbeit. The
     platform-wide reserve-integrity rule (J-1: reserved items are mock-only, excluded from
     every other feed) governs checkups too. *(Koki ack at the gate, §8-⑤.)*
2. **Grammar format allowlist** (mirrors what appears on paper; no tactile/game formats in a
   test): `gap-fill, multiple-choice, context-picker, translation, transformation,
   question-formation, error-correction`. Excluded: `anagram, sentence-building, matching,
   matching-pairs, group-sort, free-form`.
3. **Deterministic sampling:** seeded by `(assignmentId, unitSlug)` — same checkup composes
   identically forever (re-render-stable, audit-stable); no `Math.random()`.
   Preference order inside a section: least-seen-in-practice first (freshness), then stable
   hash order. Group A/B split (two disjoint samples per class) = **v1.1**, noted §9.
4. **Validation (server, hard-fail):** Σ points = 20 · every section fillable from
   eligible items (else compose fails loudly listing the shortfall — never silently thinner)
   · every composed item self-grades `correct` against its own key through the real engine
   before the assignment can publish (the blind-solve spirit, deterministic tier).

## 5.5 · The LLM sanity gate (Koki principle, 2026-07-13 — cross-platform)

**Why (his words, condensed):** pure-algorithmic task assembly is what produced the v1 defect
class A-5 spent nine PRs repairing — templates that lift original wording into boxes it
doesn't fit, keys missing the answers students actually write. We do not fall victim twice.

**What:** before any AUTO-composed checkup (later: mock test) publishes, each composed task —
exactly as the student will see it — goes through an **LLM sanity pass with a proper model,
thinking enabled, in the sandboxed CLI path** (the W-2 sandbox runner pattern / the #114
account-based path; no key in the app): *Does this task make sense as rendered? Is the
expected answer the thing a student would actually write? Are acceptable variants missing?*
Verdict journaled (S-2's `content_checks` pattern); a failing task blocks composition and
routes to the curation fix-wave path. This COMPLEMENTS (never replaces) the deterministic
self-grade sweep in §5.4 — machine check for key integrity, intelligence check for sense.

**Scope note:** this is a platform principle, not a checkup feature — S-2's Studio
blind-solve gate is the same idea for created content; C-1 is its first assembly-time use.
Cross-project: banked for SRDP and domi-pup (assessment assembly there gets the same gate).

**v1 wiring (as built, C-1 2026-07-13):** the IN-APP runtime gate rides S-2's sandbox-runner
infrastructure (`content_checks` journaling, the #114 account-based path) and lands with S-2.
Until then the verify loop runs OFFLINE: `scripts/audit/blind-solve.ts --items <file.json>`
takes a JSON array of itemIds (a composed checkup's exact item set) and blind-solves it through
the existing frames/engine/triage paths — deterministic tier via `--no-llm`, intelligence tier
via `--export-frames`/`--candidates` or the live SDK path. `scripts/verify-checkup.mjs` runs the
deterministic tier (compose → Σ=20 → every composed item's key round-trips `correct` in the SAME
pool the checkup asks) corpus-wide without a database. Known v1 limit: `frameVocabItem` frames
the CARRIER view, so the LLM tier sees translations/definitions items as carrier tasks until the
pool-aware frames land with S-2 (the deterministic tier IS pool-aware already).

## 6 · Rendering rules (runner)

- **One page, sections in preset order**, paper-style header: title + `___/20`, per-section
  `___/n` — the student sees the same shape as on paper.
- **First-letter mask (NEW task-ui prop, presentation-only):** derived from the section's
  primary full answer; one bold first letter per word (`working hours` → **w**`____` **h**`____`);
  blank length is FIXED (never answer-proportional — no length leak). Grading input is the
  untouched full answer through the engine; the mask never touches keys.
- `singleAttempt` per item (the M-wave Schularbeit path), section verdicts revealed per
  M-wave behavior; **no `hintDe`, no gloss reveal** in checkup mode.
- Timing: `sessionDurationMinutes` default **10** (Koki, 2026-07-13 gate), teacher-editable
  per assignment in the builder, server wall enforced
  by the existing `canRecordAssignAttempt` gate — nothing new.

## 7 · Scoring & Notenschlüssel

- Total = Σ section points (each item = its section's per-item worth × tier factor
  1 / 0.5 / 0); display as **`X / 20`** with one decimal at most (half-credits).
- **Recommendation (gate §8-③): points-only by default.** His papers show `___/20` and no
  Note; checkups are formative. The existing per-assignment `notenSchluessel` jsonb stays
  available as an OPT-IN toggle ("show Note") using the live AHS default (90/80/65/50) —
  zero new machinery either way.

## 8 · The Koki gate (≈30 min) — decisions to record here at sign-off

**ANSWERED by Koki, 2026-07-13 (chat, same day as #149's merge) — recorded as law:**

| # | Decision | KOKI'S ANSWER |
|---|----------|----------------|
| ① | Per-grade presets as defaults | **YES** — and everything stays teacher-editable natively (see §4b) |
| ② | Picture sections | **Real images preferred** (open-source, book screenshots, or platform-drawn art if genuinely pleasing); **no emojis**; deferring is fine — explicitly "not that important, don't get sidetracked" |
| ③ | Grade display | **Points-only, no Note** for checkups |
| ④ | g1 preset | Provisional preset accepted; **NEW WORK ITEM G1-CANON**: build the grade-1 checkup canon deliberately from the MORE! 1 student's book + workbook (transcripts + `MORE1 SB Screenshots` in the 1ABC folder) — "deliberately and precisely, no half-baked things" — before the first real g1 checkup ships |
| ⑤ | Reserve handling | Explained in plain terms (below); **default = exclude stands** unless Koki objects after reading |
| ⑥ | Default timer | **10 minutes** (not 15), teacher-editable per checkup |

*⑤ in plain words: some vocabulary/grammar items are set aside per class as a locked "test
vault" so that when a big Schularbeit mock happens, students face items they could NOT have
ground in practice. The question was whether checkups may use vault items. Answer built in
here: no — checkups draw from the open pool only, so the vault stays fresh for the mocks.*

**§8 addendum (2026-07-13, recorded at C-1 build):**
- **Tested vocabulary = wordlist-derived items only.** True by construction — the corpus IS
  wordlist-derived (every vocab item traces to the MORE! unit word list), so no extra filter
  exists or is needed; recorded so the scope question never reopens.
- **Reserve semantics are ITEM-level, not word-level.** Excluding a reserved ITEM from checkups
  does not quarantine its WORD: the same word may still appear in other task types (a different
  carrier item, a grammar item's sentence). Only the exact reserved item ids are vault-locked.
- **Migration numbering, as built:** the two additive columns (`assignment_sections.section_config`,
  `assignments.display_config`) shipped as **drizzle migration `0008_checkup_config`** — this doc's
  "migration 0009" (§3, §10) predated the real sequence (0000–0007 existed; drizzle numbers from
  0000). One migration, two columns, both nullable jsonb; apply in Neon before merge.

**Calibration example for the gate (read this, not code):** g2-u06 (HAVE TO — the same unit
as the real 2A U6 paper): B pulls 5 unit vocab carriers masked to first letters ("You can
**t**____ me…"), C pulls 6 HAVE TO / NOT HAVE TO gap-fills, D pulls 6 translation pairs
(3 De→En + 3 En→De), A defers ⇒ B becomes 8. Total 20, timer 15, submit → `14.5 / 20`.

## 9 · Out of scope v1 (recorded so it can't creep)

Group A/B disjoint sampling (v1.1 toggle) · picture sections until real image assets exist
(per §8-②: real images preferred, no emojis; the +points fallback keeps /20 meanwhile) ·
the G1-CANON build (its own gated work item; the g1 preset here is provisional until then) ·
handwriting/photo capture (that's W-2's lane) · printable docx export (the paper skill
already does this; in-platform print stylesheet = later polish) · listening/reading sections
(not part of the checkup canon).

## 10 · Pointer for the C-1 executor

Build order: migration 0009 (`section_config jsonb`, additive) → `apps/web/lib/checkup.ts`
(`GRADE_STRUCTURES` from §4 verbatim + `composeCheckup` per §5) → task-ui mask prop (§6) →
builder "Checkup" template → runner one-page layout → `/20` scoring extension (§7) →
`scripts/verify-checkup.mjs` per the Part-V exit criteria. The M-wave reuse surface
(tables, wall, Notenschlüssel, pure scoring) is inventoried with file:line anchors in the
2026-07-13 session log; `mode:'checkup'` is open text — **no DDL beyond the one column.**
