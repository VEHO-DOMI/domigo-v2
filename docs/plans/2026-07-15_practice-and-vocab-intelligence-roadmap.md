# DomiGo practice + vocabulary intelligence roadmap

**State: PLANNED**  
**Opened:** 2026-07-15  
**Trigger:** Koki's live walkthrough of Grade 2, Unit 3 practice  
**Governing program:** `docs/BLUEPRINT_V2.md`  
**Calibration slice:** `g2-u03` — 34 vocabulary items, 27 grammar items

## Outcome

Make DomiGo practice teachable on its own: a student meets a meaningful,
visual vocabulary set; each exercise is solvable from its own surface; help
escalates instead of repeating; and any unknown word can become a later,
personal review item. The same work must support Grades 1–4, the existing
rotating vocabulary pools, unit-aware correction, the future grammar-help
layer, and the teacher's source-of-truth word index.

An **index** is a searchable record that connects one word to its meaning,
first appearance, task references, and practice material. A **schema** is the
machine-checked shape of that record. A **vault** is the student's private
list of words to practise later. An **LLM** is a language model used here as
an authoring assistant, never as a second grading brain.

## Ground truth captured in this session

- The practice route is `apps/web/app/practice/[slug]/PracticeSession.tsx`.
  It currently starts in Grammar mode, then exposes Vocab mode and four pools:
  carrier gap-fill, definition, German-to-English, and English-to-German.
- The shared renderer is `packages/task-ui/src/index.tsx`, where
  `VocabItemView` currently renders one authored `hintDe`, then repeats the
  same hint in the retry nudge. The existing first-letter mask is only wired
  for checkups, not progressive practice help.
- The content contract is `packages/content-schema/src/index.ts`.
  `VocabItem` has `w`, `g`, `d`, `s`, four answer pools, glosses, distractors,
  and one `hintDe`; it has no hint ladder, occurrence index, or vault link.
- `g2-u03` is approved and validator-clean, but approval predates the new
  cold-student standard. The user's examples are present exactly:
  `guys`, `wild`, `apple bobbing`, `shall`, and `keep`.
- The current word-bank contract is `wordbank@1`. It retains the master-list
  source hash and unit, but not the appendix's precise occurrence code.
- The MORE! 2 Student's Book Appendix is a 37-page image-based PDF. The
  visible word-list pages include entries such as `sticker U3/3`; ordinary
  text extraction returns no usable text, so the appendix needs a bounded
  render/OCR/manual-verification pass.
- The Grade 2 correction skill already provides a unit-aware progression
  model: all MORE! 1 grammar is baseline, while MORE! 2 grammar becomes
  flaggable as the student reaches each unit. DomiGo should reuse that
  principle rather than invent a separate progress vocabulary.
- The source registry already points to the canonical MORE! master lists and
  committed transcripts in `packages/content-pipeline/src/paths.ts`.
- Mission Control's current governing plan is the Wave-2 Blueprint. This
  roadmap adds a new planned workstream; it does not replace the active
  GAME-ALIVE lane.

## Decomposition

### A7.1 — Teach the vocabulary before testing it

Replace the raw full-list wall with an authored **meet the words** view:

- group words into meaningful themes or scenes, not an algorithmic alphabetic
  dump;
- show the English word, German meaning, and one short, student-friendly
  example or image cue;
- use one group-level illustration or scene board per cluster, with authored
  alternative text, rather than generating 34 unrelated pictures;
- keep the full list available as a searchable fallback;
- make it clear that this is a learning view, not a demand that the student
  already knows every word;
- allow the student to reveal groups progressively so the page feels like a
  small lesson rather than a reference sheet.

**Recommendation:** group-level illustrations plus word cards. It gives the
student a memorable situation, avoids visual noise, and makes image generation
practical. One-image-per-word remains a later option for concrete nouns; it is
not the calibration default for abstract words such as `shall` or `keep`.

Likely contract: a separate authored `vocab-intro@1` artifact, with groups,
word IDs, rationale, image asset, image prompt, and alt text. The validator
will require every unit word to appear once unless a deliberate exception is
recorded.

### A7.2 — Make the carrier gap-fill fair and recoverable

Keep the current carrier pool as the main contextual task, but add a strict
three-step help ladder:

1. authored German meaning/context clue;
2. first-letter reveal for the requested answer;
3. word-length reveal, counting each word in a phrase separately.

The answer reveal remains the final post-failure feedback, not an early hint.
The same hint must never be repeated as if it were new. Test mode and other
no-hint surfaces continue to suppress the ladder.

The first letter and word lengths are deterministic presentation data derived
from the selected answer pool. They should not be hand-authored into every
item, because generated hints would drift from the real answer key.

The practice renderer must distinguish these states:

- not yet used;
- semantic help shown;
- first letter revealed;
- word lengths revealed;
- answer shown after the retry limit.

The existing boolean `hintUsed` can remain compatible. The first vertical
slice may carry the richer hint level in attempt context (a JSON field already
available for auxiliary data); a database column is only justified once a
teacher-facing hint analytics view is specified.

### A7.3 — Author from the cold student's point of view

Add a binding **cold-student test** to the content method:

> Can a student who has just opened this item, without seeing the unit list or
> relying on hidden course context, identify one intended answer from the
> prompt alone?

This applies to every carrier gap-fill in Grades 1–4, not just `g2-u03`.
The task may be challenging, but it must not be underdetermined. A richer
sentence or a second short sentence is allowed when it genuinely narrows the
meaning. Repeating the definition and the answer sentence in the same item
is not a substitute for authoring judgment.

The authoring rules will also require:

- one intended answer that survives the “could a competent student defend a
  different answer?” test;
- comparable length and complexity across items at the same difficulty;
- difficulty based on inference load, not on arbitrary obscurity;
- no fake errors, silly distractors, or context that only works if the student
  memorised the unit list;
- no near-synonyms competing for one blank;
- clear contextual separation between the carrier, definition, and translation
  pools so the same concept is not redundantly over-explained.

### A7.4 — Calibrate and repair `g2-u03`

Hand-author one calibration set before any mass rewrite. The calibration must
include the five observed failures plus representative easy, medium, and hard
items:

- `guys`: make the group-of-people meaning clear in the surrounding action;
- `wild`: show noisy running/jumping behavior in a second natural clause;
- `apple bobbing`: avoid duplicating the definition and carrier as two copies
  of the same clue;
- `shall`: frame an actual suggestion between named options, distinguishing it
  from `should` and `can` without teacher jargon;
- `keep`: show retaining something rather than merely mentioning possession;
- add examples with phrases, irregular forms, close distractors, and German
  hints so the ladder is tested against realistic edge cases.

The calibration artifact is not complete when the JSON validates. It is
complete when the content validators pass, three fresh-context blind solvers
agree, and Koki solves the rendered set in the real practice UX.

### A7.5 — Build the canonical vocabulary index

Create a derived, versioned `vocabulary-index@1` from the committed word banks,
approved vocab items, transcripts, and the MORE! appendix source. Each record
should contain, at minimum:

- stable word ID and headword;
- English definition, German translation, carrier, and the three recall
  materials;
- first taught occurrence: grade, unit, source book, and exact occurrence code
  where the source provides one;
- later occurrences, with source page/task references when verified;
- links back to the canonical DomiGo item IDs;
- grade/unit availability and whether the word is a regular course word or a
  student-added vault word;
- provenance: source file, page, extraction method, and verification status.

The index is separate from `VocabItem` so the item contract remains focused on
grading and the same vocabulary record can serve practice, word help,
correction, teacher views, and the future grammar index.

The appendix pass is a source-ingestion lane:

1. hash and register the four appendix PDFs and the four master-list sources;
2. render only the word-list pages into bounded images;
3. OCR or transcribe rows into a draft index;
4. match rows to existing word-bank IDs;
5. flag unmatched, duplicate, or conflicting rows;
6. visually verify every row in the first grade calibration and then every
   row before the index is called complete.

### A7.6 — Add word help and the student's practice vault

Every student-visible word that resolves to the index can open a compact word
card. The card shows the translation, definition, first occurrence, and a
plain action such as **Practise this later**. On touch devices this should be
tap/long-press accessible; right-click can be an additional desktop gesture,
not the only one.

The canonical-word vertical slice should add:

- a `student_word_vault` record keyed by student + word ID;
- an append-only vault event journal before the live vault state is changed;
- a student vault screen and a review queue entry point;
- review tasks reusing the existing authored definition, carrier, and
  translation material through the existing grading brain;
- a different task order or pool from the task that caused the word to be
  saved, so the vault is genuine retrieval rather than a replay;
- idempotent offline-safe writes through the existing outbox pattern.

Unknown words not in the regular course bank are a later lane. They can be
generated in a sandbox—a contained server-side workspace—only after a private
draft schema, validator, answer-key check, and privacy/cost policy exist.
They must never silently enter the shared course corpus.

### A7.7 — Add the grammar analogue after the vocabulary slice

Reuse the correction skill's unit-aware progression model to create a
`grammar-index@1`: structure name in plain German, what it does, first taught
unit, appendix/page/task references, and links to approved practice items.
Grammar help is deliberately sequenced after the vocabulary index so the
platform establishes one reliable lookup pattern before adding a second
knowledge graph.

### A7.8 — Encode the method change

The current `fable-method` is the workflow/orchestration method. Add a
companion test-design skill rather than making every future workflow reader
carry the full authoring manual:

- `fable-method`: ground truth, decomposition, calibration, RALF, independent
  verification, state-surface closeout;
- `fable-method-test-design`: cold-student answerability, level calibration,
  clue escalation, answer uniqueness, near-synonym defense, distractor
  quality, comparable item shape, and visual/UX leak checks;
- `fable-method-general`: remains the non-repository variant.

The new test-design skill must point to the actual DomiGo validators and the
frozen calibration exemplar, not become a second untested prose manual.

## Full-stack work sequence

### Phase 0 — source and contract inventory

**Status: PLANNED.** Machine-generate the 5,898-item worklist, the 57-unit
word-bank coverage table, all current `hintDe` values, all carrier sentences,
and all four source hashes. Produce an appendix reconciliation report before
changing student content.

### Phase 1 — calibration contract

**Status: PLANNED.** Freeze `vocab-intro@1`, `vocabulary-index@1`, hint-ladder
behavior, the cold-student validator shape, and the first `g2-u03` calibration
set. This is the human gate: Koki reviews the actual rendered set, not a JSON
dump.

### Phase 2 — runtime vertical slice

**Status: PLANNED.** Implement the hint ladder in `@domigo/task-ui`, connect it
to practice/review without changing checkup or test semantics, render the new
intro view, and expose the word card from the real student surface. Verify the
same item through client grading and `/api/attempts`, because the app has one
grading brain and the server must re-grade the selected pool.

### Phase 3 — `g2-u03` authoring wave

**Status: PLANNED.** Repair the 34 vocabulary items through the canonical
authoring/overlay path, not direct generated-JSON edits. Start with the
calibration subset, get Koki's UX verdict, then land bounded batches of no
more than 25 keyed items per PR. Record drafted, rejected, redesigned, and
blind-solve-disagreement counts.

### Phase 4 — index and vault MVP

**Status: PLANNED.** Land the appendix-backed index, canonical word card,
student vault, review routing, and offline-safe journalled persistence. Start
with regular course words only. This phase does not yet promise LLM-generated
tasks for arbitrary words.

### Phase 5 — Grades 1–4 content waves

**Status: PLANNED.** Sweep every carrier gap-fill and hint in all approved
units. Existing A-5 article/contraction clean-up is not re-opened; this is a
new defect class with its own validator, source worklist, and cold-student
blind-solve gate.

### Phase 6 — grammar help and private unknown-word generation

**Status: LATER.** Add the grammar index, then sandboxed private packs for
unknown words after cost, privacy, schema, and answer-key policy are accepted.

## Verification gates

1. **Deterministic checks:** schema, item membership, blank count, answer-pool
   selection, hint-state transitions, first-letter/length derivation, index
   referential integrity, source hashes, and vault idempotency.
2. **Intelligence checks:** LLM review of each authored item as the cold
   student sees it; no algorithmically assembled student-facing prose reaches
   the app without this pass.
3. **Blind solve:** three fresh-context solvers see the exact rendered frame,
   including prompt order and visible hints. Any defensible disagreement
   redesigns the item.
4. **Tamper checks:** inject a wrong answer, a spoiled hint, a missing index
   record, and a duplicate vault event; each harness must turn red.
5. **Human gate:** Koki reviews the calibration UX and one visual vocabulary
   scene before volume. Visual generation is a later asset step using the
   existing image pipeline and a calibrated style key.
6. **End-to-end:** solve the item in practice, retry it, use each hint, save it
   to the vault, reopen it, practise it in a different pool, and confirm the
   server returns the same authoritative tier.

## Decisions parked, with recommendations

### Presentation choice

**Question:** Should the first vocabulary view use one illustration per word,
one illustration per semantic group, or remain a text list with decoration?

- One per word: vivid for concrete nouns, expensive and misleading for abstract
  words.
- One per group: a coherent mini-scene, manageable asset count, works for
  abstract words when the words remain visible beside it.
- Text-only: fastest, but it preserves the current reference-sheet feeling.

**Recommendation:** one authored group-level illustration plus word cards,
with the text-only list as an accessible fallback.

### Hint timing

**Question:** Should the next clue appear automatically after a wrong answer,
or should the student press for each additional clue?

- Automatic: kinder when a child is stuck, but can reveal too much quickly.
- Press-to-reveal: preserves agency and makes the ladder visible, but a stuck
  child may not know what to do.

**Recommendation:** after a wrong answer, unlock a clearly labelled **More help**
button for the next rung; after the next wrong answer, unlock the final rung.
The semantic clue is visible first, so no child is left without a starting point.

### Unknown words

**Question:** Should arbitrary student-added words be generated immediately,
or should the first vault release support only words already in the course bank?

- Immediate arbitrary generation: broadest vision, but introduces privacy,
  cost, and answer-quality risk before the core loop is proven.
- Canonical words first: smaller first release, reuses approved content, and
  gives us evidence for the vault interaction.

**Recommendation:** canonical words first; unknown-word generation follows as a
private, sandboxed, schema-validated lane.

## State surfaces to update when this plan is accepted

- **Project repo:** this document, `docs/BLUEPRINT_V2.md` Part IV/Part V,
  `docs/STATUS_AND_ROADMAP.md`, and the relevant runbook/skill files.
- **Mission Control:** the DomiGo card, decisions queue, governing `plan`
  object, and the context brief.
- **iCloud canon:** `Domi Gym/PLATFORM MASTER/FOUNDATIONS/` for the method and
  foundation contract; `Domi Gym/DomiGo v2 Art Prompts/` for generated visual
  assets and calibration records.

## Definition of done for this planning pass

- The feedback is decomposed into visible work items and dependencies.
- The existing practice, schema, source, validator, and correction-skill
  boundaries are verified against live files.
- Grade 2 Unit 3 is named as the calibration slice, not silently treated as
  the whole repair.
- The four-grade sweep, word index, vault, grammar analogue, visual lane, and
  method extension are all represented.
- The plan is registered in the governing blueprint and Mission Control, with
  the iCloud write recorded as a pending cross-surface step if the sandbox
  cannot write outside the workspace.
