# Runbook — Listening + Mock-Test content waves

_Authoring `listening.json` + `test.json` for the 57 units, on top of the B3/B2 runtime. Mirrors `items-wave.md`. The runtime + a `g2-u03` pilot are done (PRs [#26], [#27]); this wave fills the corpus. **Large + multi-session — scope per session** (e.g. one grade's listening, then its tests)._

## §1 — Status
| Grade | Units | listening.json | test.json |
|---|---|---|---|
| g1 | 15 | 0 | 0 |
| g2 | 15 | 1 (`g2-u03` pilot) | 1 (`g2-u03` pilot) |
| g3 | 14 | 0 | 0 |
| g4 | 13 | 0 | 0 |

Progress receipt = the git log. `pnpm content validate-listening` / `validate-test` print the file/item counts.

## §2 — Standing decisions
- **Method:** the `srdp-listening-comprehension` + `srdp-reading-comprehension` skills, **re-leveled to A1/A1+/A2/A2+** (grades 1–4). The skills carry the item-quality firewall (not answerable without the source, no verbatim lifts, plausible distractors, locked key) + format calibration; re-level the vocabulary/syntax down.
- **Schemas:** `listening@1` / `test@1` (inline in `content-schema/src/index.ts`). Listening/reading items are **sibling gradeable schemas** (own `.li.`/`.ri.` id, **no `structureId`**), GrammarItem-shaped so they grade via `@domigo/engine` + render via `GrammarItemView`.
- **Reference vs embed (tests):** REFERENCE sections (vocab/grammar/listening) point at **already-approved** ids — never copy, never forward-ref a future unit. READING + WRITING sections embed test-only content.
- **TF → `multiple-choice`** with True/False options (there is no `true-false` format; the `tf` id-code is *transformation*).
- **Audio:** `audio.file:null` for now → the player speaks the transcript via Web Speech. Pre-generated TTS files come in a later pass (`11_remaining_work.md §3`).
- **Gate stays green:** the monolithic `pnpm content validate` never reads these files. Keep coverage via the opt-in `validate-listening`/`validate-test` + the app E2E.
- **PRs:** one per wave (e.g. `feat/listening-g2`), CI-green, **left unmerged for Koki**. Commits end with the `Co-Authored-By` line; never a bare `#N`.

## §3 — Per-unit rhythm
1. **Author** (skill, re-leveled) → write `content/corpus/units/<slug>/listening.json` (one task: transcript + ~5 items) and/or `test.json` (ref sections + reading + writing).
2. **Validate schema:** `pnpm content validate-listening` / `pnpm content validate-test` → fix any reported path/message until 0 failures.
3. **E2E spot-check** (dev server + `x-dev-*` headers, per `11_remaining_work.md` §0): POST each item with its authored key → every tier `correct`; for tests, confirm reference ids resolve (loadUnit/loadListening). A wrong-grading item = a bad key → fix the answer set.
4. **Gate:** `pnpm -r run typecheck && pnpm lint && pnpm -r run test && pnpm content validate && pnpm build` (the new JSON is ignored by the main validate but must not break anything).
5. **Commit** per unit (`g<G>-u<NN> listening` / `… test`).

## §3a — Invariants (check before commit)
- `schema` literal correct (`listening@1` / `test@1`); `grade`/`unit`/`slug` consistent (`g<G>-u<NN>`).
- Id schemes: listening `g<G>u<NN>.li.<key>.<fmt>.<NNN>` (task `…lt.<key>`); reading `g<G>u<NN>.ri.<key>.<fmt>.<NNN>`; writing prompt `g<G>u<NN>.ti.wr.<NNN>`; test container `g<G>u<NN>.tt.<key>`. `<fmt>` ∈ `gf|mc|cp|tr|ec|tf|qf|ff|sb|mt|ag|gs|mp`.
- Each task's item ids embed the task `key` (superRefine enforces).
- **Level gate** on student-facing `prompt` + `distractors`: above-level words glossed via the item `gloss` field. The audio `transcript` may introduce ~3–5 new words (glossed) — comprehensible input.
- Test reference sections point only at **approved** ids of the SAME or an EARLIER unit.
- `answers` carry `tier:"full"` for the correct option(s); MC distractors are plausible; matching has ≥2 pairs; writing `minWords`/`maxWords` sane; `rubric:null` (B2b adds grading).

## §4 — After the wave
- **TTS:** run the `gen-audio` pass (`11_remaining_work.md §3`) to populate `AudioRef.file`.
- **B2b:** the teacher writing-grading UI surfaces the captured `writing_submissions` (`11 §1`).

## §5 — Recurring fix-patterns
- Level-leak in a prompt/distractor → gloss it or simplify.
- A reference id that doesn't resolve (typo / wrong unit / not approved) → fix the id; the app E2E catches it.
- An MC key that doesn't exactly match an option → the option text must equal a `tier:"full"` answer verbatim.
- German scaffolds (hintDe/explainDe/titleDe) are du-form, zero meta-talk; grammar names never shown to students.

## §6 — Key paths & commands
- Schemas: `packages/content-schema/src/index.ts` (`listening@1`, `test@1`, `AudioRef`, the sibling refs).
- Loaders: `packages/content-loader/src/index.ts` (`loadListening`/`loadTest`/`list*Units`).
- Validators: `packages/content-pipeline/src/validate-{listening,test}.ts`; run via `pnpm content validate-listening` / `validate-test`.
- Pilots (copy these shapes): `content/corpus/units/g2-u03/{listening,test}.json`.
- Surfaces: `/listening`, `/listening/[slug]`, `/tests`, `/tests/[slug]`.

---

## 2026-07-06 — the wave-blocking upgrade (W-0; BLUEPRINT Part III.2)

**Authoring now goes through the in-repo skills** — read them first, they are the contract:
`skills/domigo-listening-comprehension-a/SKILL.md` and `skills/domigo-reading-test-a/SKILL.md`.
Gold standards: `g2-u01` (authored to the skills, 0 warnings) and the retrofitted `g2-u03` pilot.

**New MANDATORY fields for wave content** (additive in `listening@1`/`test@1`; the D-3 runtime
ritual and D-1 feedback card consume them): task `predictChips[3]` · per-item `phase`
(gist|detail), `cue {type, quote-verbatim-from-source}`, `trickDe` (≤12 du-form words),
`distractorMeta` (parallel; ≥1 lure on MC difficulty ≥2) · writing `checklistDe[3–5]` +
`exemplar {textEn fully-in-bank, calloutsDe ≤3 quoting textEn}`.

**Validators** (step 2 of the rhythm now enforces): `pnpm content validate-listening` — V-LC1
quote-verbatim, V-LC2 gist discipline, V-LC3 echo-lure firewall + meta parity, V-LC4 trick
budget/register, V-LC5 prompt/distractor level probe (WARN-only; your new unit must print 0);
`pnpm content validate-test` — V-LC1r/V-LC4r on reading, V-EX1 callout quotes, V-EX2 exemplar
fully-in-bank (no gloss escape), V-CK1 checklist du-form.

**Wave stats in every PR body:** items authored · strategy-complete count (the validator prints
it) · V-LC5 warning count for your unit (must be 0) · engine spot-check result.
