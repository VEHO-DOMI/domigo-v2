# 17 · The Curation Standard — authored, not programmed

_Written 2026-07-11 by Claude Fable 5 (A-3, BLUEPRINT_V2 IV.1 — Fable-reserved, lands BEFORE the first fix wave). Status: **binding for every authoring and curation wave** — items, story chapters, comprehension, listening/test units, lessons, feedback enrichment, journeys, checkup presets. An executor session that starts a wave without following this document is off-spec. This is the operational form of Wave-2 ledger line 6 and Principle 12._

---

## 0 · The doctrine (one paragraph)

**Anything a student learns from is authored with didactic intent and passes a human-voiced gate. Algorithms assemble, validate, audit, and route — they never author student-facing prose.** Generated output is a labeled fallback only, allowed only where an authored version does not exist yet. The machine's job is to make authored content *provably* correct (validators, blind-solve, audits) and *cheaply* fixable (the overlay) — never to write it. Existing proof points: `gen-items.ts` drafts are agent-authored against pinned briefs and transcripts, then deterministically ingested; `mint-variants` only ever *assembles*; the VS/V validator families are the machine floor, not the author.

## 1 · The four wave invariants (no wave ships without all four)

1. **Machine worklist first.** A wave's scope comes from a committed artifact (validator output, audit JSON, the coverage matrix) — never from memory or estimation. State the count in the wave's first message and in the PR body.
2. **Calibration before volume.** Every new content family opens with a **frozen calibration set** — 10–20 items, or 1 unit, or 1 chapter — authored at the intended bar, with its register sheet attached. **Koki gates the calibration BEFORE any volume is drafted.** The calibration artifact IS the bar: wave prompts embed it verbatim. (Precedents: W-0's g2-u01 "Bens Schultag"; the G1-N/G4-N/G2-N voice-test chapters; the SRDP FOUNDATIONS vocab template.)
3. **Keys touched ⇒ blind-solve.** Any change that creates or edits an answer key (new items, key rewrites, pool patches) passes an adversarial blind-solve **graded through `@domigo/engine`** — never string-compare, never a second brain, not even in audit. Until the A-4 harness lands, the floor is the dev-server spot-check: POST every touched key through `/api/attempts` and require `tier:"correct"`. **The harness is live and needs NO API key** — the subscription path: `pnpm audit:blind-solve --grade gX --export-frames F` → the Claude Code session fans F out to fresh-context subagents (they see ONLY the frames; brief in the harness header) → merge their JSON → `--candidates A` grades + triages through the real engine. **Triage calibration (Fable, 2026-07-11, 106-item live g2 sample):** thresholds CONFIDENT=0.75 / DEFENSIBLE=0.6 confirmed — 0 false positives (all 24 second-candidates were synonyms/US-spellings correctly rated ≤0.5: a vocab-carrier practices one specific headword, so low-confidence synonym seconds are EXPECTED, not defects), sensitivity tamper-proven (injected wrong + ambiguous candidates fired both classes). Every future run must repeat the tamper-check before trusting a green.
4. **Fixed sampling tier, stats in the body.** Every wave PR carries: items/scenes authored, validator rejects encountered (the drift alarm — a rising reject trend means the template or the register has rotted), glosses added, and what Koki's sample is. **≤1 unit or ≤25 items per PR.**

**Koki's sampling tiers (fixed; his voice = full pass):** listening/test units — 1-in-5 played in-app · story chapter waves — register-rubric pass per wave + 1-in-5 chapters played · lessons — 20% full read (first 10 = full calibration read) · feedback enrichment — 30-card review · fix waves — 1-in-5 patched items · checkup presets — full read of the first set per grade.

## 2 · Variant-completeness authoring rules (E-2's audit rules, applied at write time)

New items ship complete so the audit trends to zero instead of policing forever:

- **R1 — article variants:** an `enToDe` pool whose gloss is a German noun carries the bare form AND the der/die/das form as full-tier answers. **K-4 DECIDED (Koki, 2026-07-11):** the bare noun alone is a sufficient full answer ("Gebiet" is enough — students are never REQUIRED to add the article), and including a correct article must never grade wrong — so both forms are full-tier, exactly what R1 demands. His general acceptance principle, binding for every pool fix: **a correct answer with a correct addition is still correct** — this also settles R2's ambiguous-`'s` question (both grammatical expansions accepted when both are true readings). A-5 fix waves are UNBLOCKED; the 791 R1 findings are mechanical under this rule (add the missing twin as a full-tier answer).
- **R2 — contraction symmetry:** in typed text formats (`gap-fill, translation, transformation, error-correction, question-formation, free-form`), every full answer containing a contraction also accepts its expansion, and vice versa. **Never** add twins to chip/tile formats (`sentence-building`, `anagram`) — the tactile layer derives its chips from the answer surface.
- **R3 — no accidental single-answer items:** a free-form / question-formation / transformation item with exactly one accepted answer is either deliberately strict (say why in the item's authoring note) or incomplete. Enumerate the defensible variants a competent student could produce.
- **R4 — multi-blank integrity:** pipe-segment count equals the prompt's blank count on EVERY tier of every answer.
- **R5 — language purity:** `deToEn` pools read as English, `enToDe` as German, on every tier (V-23 enforces; author to it).

## 3 · The level-gate field manual (hard-won; every wave prompt embeds this section)

The cumulative bank is built from **wordlist headwords**. Its behavior is exact and unforgiving:

1. **Inflected surface forms are NOT derived.** `get` in bank ≠ `gets/getting/got` in bank. Flagged in real waves: *gets, knows, sleeping, walking, checks, stops, makes*. Gloss the surface form or rephrase to the base.
2. **Grammar-taught words are out-of-bank corpus-wide:** *said, told, took*, and irregular participles (*been, seen, gone, won, made, taught*). Chapters ABOUT those forms still gloss them deliberately.
3. **"Obvious" words are often missing.** Confirmed absent at various gates: *cat, word, things, only, okay, real, trip, team, plan, maybe, oh, just, channel, get, later*. Never assume; author simple, run the validator, iterate — one green cycle is normal, two is fine.
4. **Glossing exempts (VS-2), and the gloss ARRAY is the only escape** — never `(= …)` inline in `textEn` (the renderer draws the chip). Glosses are **per-scene**: re-gloss repeats. Multi-word glosses match contiguously ("rubbed out" works; a split phrase does not).
5. **The proper-noun registry matches full phrases:** "Detective Mo" in `names.json` does not cover bare "Mo" — say the registered form in lines, or register the short form too.
6. **VS-8 (meta-talk) bites unit vocabulary:** "lesson" is blacklisted in student lines even where it is the unit's own word (say "hour"); grammar names never appear below the register that names them (see the per-grade register sheets).
7. **`.ci.` comprehension items:** schema tag is `comprehension@1`; prompt, **answers, AND distractors** must be fully in-bank or covered by the item's own `gloss` field. Confirmed flagged in distractors: *pet, animal, little, sleeps, bag*.
8. **`scaffoldDe` is first-class prose** (L-1): natural kid-German at the same register bar as the English — never translationese. **VS-17 requires it on every scene, choice, and flagLine at grades ≤2.** Du-form always; a sentence-initial "Sie" draws a human-call ℹ — prefer a rephrase ("Die klingt…", "Alle sind…").
9. **Numbers as digits pass the gate** ("20,000" where "twenty thousand" would flag).
10. **Schema traps:** `Choice.next` must be a real SceneId (never null — route through a closing scene); a released chapter's scenes go live on merge (stage revisions as per-chapter-block PRs); a bundle with **no release.json is invisible** and exempt from the one-released-story-per-grade loader rule (the #86/#108/#109 pattern for gate packs).

## 4 · The fix path (curation waves — how corrections actually land)

**Fixes NEVER hand-edit generated corpus JSON** (Principle 8 — content stays regenerable). The one mechanism:

- **`content/overlays/item-fixes.json`**, shape `{ "<unit-slug>": { "drop": [itemId…], "patch": { "<itemId>": { <field>: <value> } } } }` — applied at ingest (`ingest-items.ts:232`) AND at runtime load (`content-loader/src/index.ts` `applyFixes`, used by `loadUnit`).
- **Patches are whole-field shallow replaces** (`{ ...item, ...patch }`): a pool patch carries the FULL replacement array (the complete new `sAnswers`/`enToDe`), never a delta. A patch that ships a partial array silently deletes the rest of the pool.
- Patched items re-validate through the full V-* suite on the next `pnpm content validate`; keys touched ⇒ rule 1.3 (blind-solve).
- Sibling content (`.li./.ri./.ti.`) gets its own overlay file when S-5 builds it; until then sibling fixes go through regeneration, not hand edits.
- When Studio v2 lands (S-1/S-2), its DB overlay **folds back into these same files** — git remains canonical; the drift counter returns to zero after every fold.

**The curation loop per wave:** committed worklist slice → LLM-curated overlay entries (full-array semantics) → `pnpm content validate` + the relevant audit re-run (touched rules' counts must drop) → blind-solve on touched keys → Koki 1-in-5 sample → PR ≤25 items with before/after counts.

## 5 · The register-sheet registry (which voice governs what)

| Content | Governing sheet |
|---|---|
| Feedback / traps / verdict copy | `handover/14_feedback_register.md` (Stark!/Fast!/Knapp!/Schau her:, per-grade word budgets, GOOD/BAD pairs) |
| G1 story waves ("The Lost Pages" revision) | `handover/18` §5 — sad-not-scary, banned-word list, ≤4 glosses/scene, Jona's flat present-tense notes, warm-hand closers, scaffoldDe-as-prose |
| G2 story waves ("The Spill") | `handover/20` §5 — one notch up from G1, the Blank's five design rules (§4 there), Emma/Tarik/Berger voice notes |
| G4 story waves ("FOURTEEN: LIVE") | `handover/19` §5 — 14-year-old register, no cartoon villains, ethics shown never lectured, live-honesty doctrine |
| Listening/test waves (A-level skills) | the G-W register embedded in `skills/domigo-listening-comprehension-a` + `-reading-test-a` (strategy fields, echo-distractor firewall, tier-complete answer sets) |
| Lessons / didactics | `BLUEPRINT.md` III.6 D-4 blocks + the kid-term glossary once K-gated |

A wave that can't name its register sheet isn't ready to start. New content families author their sheet FIRST (it rides the calibration gate).

## 6 · ID and structure conventions (so nothing collides)

- Items: `g<G>u<NN>.w.<slug>` (vocab) · `g<G>u<NN>.gi.<structure>.<fmt>.NNN` (grammar) · `g<G>u<NN>.ci.<beat-key>.<fmt>.NNN` (story comprehension — pick beat keys distinct across ALL of the grade's bundles: two g2 stories both mint `g2u01.ci.*`) · `.li./.ri./.ti.` siblings per the wave runbook.
- Story bundles: `g<G>.st.<campaign-slug>/` with `story.json` (story@1), `cast.json`, `names.json`, `comprehension.json`, optional `flags.json`/`map.json`/`art.json`/`release.json`. Scene ids `<storyId>.chNN.sNNN`, `next`-chained, last scene `next: null`.
- One campaign's canonical release per grade; everything else `role: "bonus"` (B-0) or unreleased.

## 7 · Acceptance (how this document proves itself)

The next wave PR of any kind links this file in its body and demonstrably follows §1 (worklist count, calibration reference, blind-solve line, sampling tier, stats). If a wave finds this standard wrong or incomplete, it updates THIS file in the same PR — the standard is code-adjacent, not sacred prose. Its own Ralph exit criterion: an executor session can start a compliant wave using only this document plus the relevant register sheet.
