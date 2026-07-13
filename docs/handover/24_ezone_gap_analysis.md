# 24 · eZone Cyber-Homework gap analysis (EZ-1) — what DomiGo adopts, has, and skips

*Fable 5, 2026-07-14. Status: **DRAFT pending Koki's gate.** Source: Koki's agent-run study of the
Helbling eZone Cyber Homework, MORE! 1 + MORE! 2 complete (90 packages, 403 exercises; iCloud
`Domi Gym/Claude/E-Zone Study /MORE Analysis Cyber Homework.docx`). Y3/Y4 fold in when crawled.
Purpose: feed G-A4 (battle task variety), C-1.1 (checkup variety), and the D/J waves — so "it's not
all the same" (Koki, 2026-07-14).*

## 1 · The verdict table — 15 eZone task types × DomiGo

| # | eZone type (Y1+Y2 study) | Verdict | Where it lands · effort |
|---|--------------------------|---------|--------------------------|
| 1 | Text gap-fill, free-typed (the workhorse) | **COVERED** | `gap-fill` format + vocab carrier pool — DomiGo's workhorse too |
| 2 | Word-bank cloze (bank shown, fill the gaps) | **ADOPT — cheap** | Presentation-only: render a shuffled answer-bank chip row above existing gap-fill/carrier items; grading untouched. Great for battles + checkups (scaffolds weaker kids) |
| 3 | Running-text cloze (paragraph, 8–10 gaps, + L1 gloss) | **ADOPT — later (content-bound)** | Needs authored passages (a new `cloze-passage` wrapper over existing items). J-wave/checkup variety; not a quick win |
| 4 | Image-cued gap-fill (cartoon/photo cue) | **ADOPT — now unblocked** | ART-2's sheet pipeline makes cue-images cheap; pairs with the deferred `picture-mc` checkup kind. One renderer prop (`cueImage`) |
| 5 | Labelled-diagram gap-fill (numbered callouts) | ADOPT — later | Same family as #4, needs per-diagram assets; park with picture decisions |
| 6 | Number-word conversion (digit↔word) | **COVERED (content, not code)** | `transformation`/`translation` formats express it; add as an authoring pattern note in the curation standard |
| 7 | Listening gap-fill / listening-label | ADOPT — AU-wave | Blocked on the audio wave (no audio infra for items yet); the story `listening` surface is separate |
| 8 | Word-order / sentence-building (drag chevrons) | **COVERED — DomiGo is richer** | `sentence-building` + `anagram` tactile formats already exceed the eZone version |
| 9 | Matching by typed number/letter code | **SKIP — deliberately** | A paper-ism ported to screen; DomiGo's `matching`/`matching-pairs`/dropdowns do the same job without the indirection |
| 10 | Free-writing (WYSIWYG, teacher-graded) | **COVERED — by design, better** | The W-wave (writing capture + AI feedback + teacher release) is this, plus everything eZone lacks |
| 11 | Dropdown/select MC cloze (native `<select>`) | **ADOPT — cheap** | A render variant of `multiple-choice` (inline dropdown instead of radio list). Mobile-friendly, checkup-friendly, battle-safe |
| 12 | First-letter-scaffolded spelling | **COVERED — shipped** | C-1's `mask: "first-letter"` (built from Koki's own papers, which predate eZone's version) |
| 13 | Two-column Q&A matching | **COVERED** | `matching` format |
| 14 | Spatial "picture-gap" listening (numbered boxes over a scene) | ADOPT — later, flagged **the most distinctive idea** | Audio + a scene image + spatial anchors; a natural fit for story-world scenes once AU lands. Bank the design |
| 15 | Rich writing stimuli (timetables, colour-coded messages) | **COVERED (doctrine)** | W-wave prompt-design note: stimuli as structured props, not prose walls |

**And the gap runs the other way:** eZone Y1/Y2 has NO crossword, NO memory/pairs, NO drag-onto-target,
NO radio-MC — DomiGo's tactile formats and the coming Word-Battles already out-vary the commercial
platform. The adopt-list is about *rounding out*, not catching up.

## 2 · What G-A4 wires into the battles (the immediate slice)

1. **Widen the battle format gate** (`DEFAULT_BATTLE_FORMATS`, encounter.ts:12-17): add `matching`,
   `sentence-building`, `transformation`; rotate vocab pools per node (`carrier`/`deToEn`/`enToDe` —
   the knob exists unused).
2. **Word-bank chip row** (#2) as a battle presentation variant — scaffolding that fits the
   Schluckwort fiction (the stolen word hides among decoys).
3. **Dropdown cloze** (#11) as an MC render variant.
Effort: all three are renderer/recipe wiring — no engine, no schema, no content changes.

## 3 · What lands where (beyond battles)

- **C-1.1 checkup variety:** word-bank cloze + dropdown cloze as section options (post-September
  polish, not blocking).
- **J-wave:** running-text cloze (#3) as a journey "lesson" node type; picture-cued (#4) once the
  first cue-sheets are generated.
- **AU-wave:** #7 + #14 (the spatial-listening design is banked here — it is the one genuinely
  novel interaction in the whole study).
- **Curation standard:** #6 + #15 as authoring patterns (content expressiveness, zero code).

## 4 · The Koki gate (~10 min)

① Sign off the verdict table (esp. the two SKIPs: typed-code matching, and nothing else dropped).
② Priority of the adopt-cheap pair (word-bank + dropdown): fold into G-A1's battle build directly
(my recommendation — they ship inside the Word-Battle PR) vs. a separate small PR after.
③ Ack that #7/#14 wait for the audio wave. — Y3/Y4 crawl continues on your side with the same brief;
this doc gains a Y3/Y4 delta section when they land.
