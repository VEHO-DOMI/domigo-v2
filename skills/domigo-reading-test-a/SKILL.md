---
name: domigo-reading-test-a
description: Author DomiGo v2 test.json units (A1–A2+, MORE! 1–4) — the Schularbeit-practice assembly (reference sections + reading passage with the strategy layer + the writing prompt with checklistDe and a locked in-bank exemplar). Used by executor sessions during the content waves.
---

# DomiGo unit-test authoring (A-level)

You are authoring ONE unit's `content/corpus/units/<slug>/test.json`. Gold standards: `g2-u01`
(authored to this skill) and the retrofitted `g2-u03`. Validate with `pnpm content validate-test`
until 0 errors. The listening file must exist FIRST (its items are referenced).

## Assembly (5 sections, `g<G>u<NN>.tt.<key>`)

1. **grammar** (ref): 2–3 item ids of the unit's structures, format variety (gf + cp/mc + ec),
   difficulty spread. Only APPROVED ids of this or an EARLIER unit — never forward references.
2. **vocab** (ref): 2–3 `g<G>u<NN>.w.<key>` ids that carry the unit topic.
3. **listening** (ref): 2 ids from the unit's listening.json (the gist MC + one detail).
4. **reading**: an original passage + 3 `.ri.` items (below).
5. **writing**: the prompt + the didactic fields (below).

## The reading section

Passage: 60–90 words (A1/A1+) / 90–130 (A2/A2+), first-person or simple narrative, topic = the
unit's; vocabulary in the cumulative bank; above-bank words (max 2) go in `passageGloss`.
3 items with the SAME strategy layer as listening (`phase`, `cue` quoting the PASSAGE verbatim —
V-LC1r —, `trickDe` ≤12 du-form words, `distractorMeta` with ≥1 echo lure on difficulty-≥2 MC:
"steht im Text — aber beim falschen Satz"). Reading tricks teach ANCHOR WORDS ("after school ist
dein Anker — lies den Satz dahinter"), not answers.

## The writing section (the didactic heart — D-5)

- `promptDe` du-form, names the text type + the 2–3 content points; `taskEn` mirrors it simply.
- Words by grade band: G1 20–45 · G2 40–70 · G3 60–100 · G4 80–130. Text types per the
  BLUEPRINT III.6 map (G1 postcard/profile/email · G2 invitation/diary/email/event · G3
  blog/story/report/opinion · G4 opinion/formal email/review/article). `rubric: null` (B2b).
- **`checklistDe`** (3–5): tap-questions a child can self-answer — one CONTENT check ("Steht
  dabei: wann und wo?"), one FORM check ("Beginnt jeder Satz mit einem großen Buchstaben?"),
  one LENGTH check ("Hast du 40 bis 70 Wörter?"). Never blocks submission — it teaches checking.
- **`exemplar`**: the "So kann's aussehen" model (runtime unlocks it AFTER first submission).
  `textEn` mid-band length, first person, warm, and **FULLY in the cumulative bank — V-EX2 fails
  on ANY out-of-bank word, no gloss escape** (a model the student can't read is not a model).
  Expect to iterate: names must be in the proper-noun registry, and everyday words (party, home,
  house) are often out-of-bank — rephrase, don't fight. `calloutsDe` (≤3): each quotes a span
  VERBATIM from textEn (V-EX1) + a du-form whyDe naming the transferable move ("Zeit UND Ort in
  einem Satz — das braucht jede Einladung.").

## Workflow

listening.json first → assemble refs (verify ids exist in the unit files) → passage + items +
strategy layer → writing block → `pnpm content validate-test` to 0 errors → engine spot-check
(POST each ri/li item's authored key ⇒ "correct"; refs resolve in /tests/<slug> on the dev
server) → one-unit commit `g<G>-u<NN> test`.
