# 04 — Content Rework (P0) — the item-by-item audit

**This is the most important document.** Beta failed on content, not features. Every vocab entry and
grammar item must be verified against the textbook and fixed to the rules below. ~2,800 vocab + ~2,505
grammar = **~5,300 items**. Do not trust the existing corpus or any sub-agent import — **verify**.

## The defects found in beta (with the rule that fixes each)

1. **Above-level vocabulary, no help.** Lower-grade example/context/definition sentences contain words a
   beginner can't infer from context. *Evidence:* G2 Unit 3 (`data/vocab/2/unit-03.json`) — "tradition",
   "century", "carols", "apple bobbing" appear with no gloss. A real student couldn't decode the context.
   - **RULE:** any word above the unit's level (A1 for G1–2, A1+/A2 for G3–4) that appears in a
     student-facing sentence gets an **inline gloss on the same line**: **`word (= deutsches Wort)`**.
     Determine "above level" from the cumulative MORE! word lists up to that unit (a word is fair game
     only if it was taught at/before this unit).

2. **Over-strict answers / verbatim form breaks the sentence.** Items were generated around the exact
   vocab-list citation form, but some carrier sentences need a different inflection or word order — and
   only the verbatim list form is accepted, producing an ungrammatical "correct" answer or rejecting the
   genuinely correct one.
   - **RULE:** the accepted answer set is **the form(s) correct in that sentence**, plus every valid
     variant. Never force a citation form that makes the sentence wrong. Audit each gap-fill/translation
     /transformation for "is the required answer actually grammatical here, and are all valid answers
     accepted?"

3. **Translation task (DE↔EN) is shaky.** Direction and alignment need a full audit. *(v1 stores
   translation as a text-input item: `p` = source-language prompt, `c`+`a[]` = accepted target-language
   answers; grading is direction-agnostic text matching.)*
   - **RULE:** for every `translation` item, confirm the German is natural + correct, the English is
     natural + correct, they actually mean the same thing, and the accepted-answer set covers the natural
     variants in the **required** direction. Make the direction explicit in the data.

4. **Formal "Sie" in German meta-text.** Some hints/instructions address the student formally.
   - **RULE:** all student-facing German is informal **"du"**. Replace every "Sie/Ihnen/Ihr(e)" used as
     address with "du/dir/dein(e)". (Keep "sie" = she/they, which is correct.)

5. **Near-misses are unrewarded.** A near-synonym or a different-but-valid phrasing is marked fully
   wrong; only typo-level "close" gives 50% XP.
   - **RULE:** accept **multiple correct iterations**, and award **partial credit / half-XP** for a
     near-synonym or acceptable alternative. Extend the "close" mechanism from typo-distance to
     **semantic** near-matches (curated alternates with a `partial` tier, or a model-checked accept).

6. **`matching` is all-or-nothing** (3/4 right → 0 XP). Add **per-pair partial credit** in v2.

7. **No meta/teacher-talk in front of students.** Keep rationale in teacher-only surfaces.

## The methodology (how to actually do ~5,300 items without shipping garbage)

> Koki's explicit instruction: **don't blindly trust the import or sub-agents — case-by-case,
> item-by-item, complete from scratch, because real students will use this.**

1. **Re-root in the textbook.** Build the corpus from the MORE! 1–4 SB/WB transcripts + master vocab
   lists (`05`), not the legacy HTML trainers. For each unit, first produce the **word bank** (words +
   phrases, `06`/`3.1`) from the master list; that defines the allowed vocabulary up to that unit.
2. **Generate → adversarially verify → spot-check.** For each item: a generator proposes the fix; an
   **independent** verifier (different prompt/lens) checks it against the rules and the unit word bank
   (is every word in-level-or-glossed? is the answer grammatical? du-not-Sie? translation correct both
   ways? alternates complete?); only items that pass two independent checks advance; **Koki spot-checks**
   a sample per unit. This mirrors the verify-before-trust pattern that caught the matching bugs.
3. **Deterministic validators wherever the format allows.** Codify machine-checkable invariants and run
   them over the whole corpus (like the matching-renderer check in
   [#41](https://github.com/VEHO-DOMI/domigo/pull/41)): e.g. every gap-fill `c` is non-empty and, when
   substituted into `p`, yields a grammatical sentence; no student-facing sentence contains an
   out-of-word-bank token without a `(= …)` gloss; no German field contains "Sie/Ihnen" as address; every
   `matching`/`group-sort` renders. A red validator blocks go-live.
4. **One unit at a time, gated.** A unit is "done" only when its validator is green AND Koki has
   spot-checked it. Track per-unit status. Never ship a half-audited grade to students.
5. **Keep it regenerable.** Author into the canonical source + validation gate (`02` → "For v2"), so a
   re-run reproduces the corrected corpus rather than re-introducing the old bugs.

## Acceptance (per unit, before students see it)
- Validator green: no unanswerable items, no out-of-bank unglossed words, no "Sie" address, every blank
  has a sentence-correct accepted-answer set, every structured item renders.
- Human pass: Koki confirms a sample reads naturally for a 10–14-year-old and the answers are fair.
- The unit's **word bank** matches the MORE! master vocab list for that unit.
