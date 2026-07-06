---
name: domigo-listening-comprehension-a
description: Author DomiGo v2 listening.json units (A1–A2+, MORE! 1–4, ages 10–14) — transcript-grounded tasks with the strategy layer (predictChips, cue, phase, trickDe, distractorMeta) that the Vorschau→Hören-1→Hören-2 runtime teaches from. Used by executor sessions during the content waves; NOT a platform-runtime skill.
---

# DomiGo listening authoring (A-level)

You are authoring ONE unit's `content/corpus/units/<slug>/listening.json` for the wave program
(BLUEPRINT Part III.2). The gold standards: `g2-u01` (authored to this skill, 0 warnings) and the
retrofitted `g2-u03` pilot. Validate with `pnpm content validate-listening` until 0 errors, then
0 V-LC5 warnings for YOUR unit (legacy-pilot warnings are not yours to fix).

## Band calibration (pick by the unit's `level`)

| | A1 (g1 early) | A1+ (g1 late/g2 early) | A2 (g2 late/g3) | A2+ (g4) |
|---|---|---|---|---|
| Script length | 60–90 words | 90–120 | 120–170 | 170–220 |
| Sentence cap | 8 words | 11 | 14 | 18 |
| Structures | present simple, have got, can | + past simple, adverbs of time | + going-to, comparatives, connectors (because/but/then) | + present perfect, past continuous, reported fragments |
| Speaker(s) | 1 monologue | 1 monologue | monologue or 2-voice dialogue | dialogue allowed |
| New (unglossed-in-items) words in script | ≤3 | ≤4 | ≤5 | ≤5 |
| Numbers per script | ≥2, all different | ≥3 (one a near-pair, e.g. 8/10) | ≥3 incl. a time contrast | ≥3 incl. a corrected number ("actually…") |

The script must live inside the unit's CUMULATIVE bank (all lower grades + units ≤ this one),
except the ≤3–5 new words (comprehensible input). Speaker names: short, common (Ben, Anna, Mia);
the script is not level-gated by machine — YOU are the gate for it.

## The task shape

One task per unit (`g<G>u<NN>.lt.<key>`), `titleDe` "Hör zu: …", `audio.script === transcript`
(TTS reads `script`; `transcript` is the hidden answer key), `voice/file: null` (AU-1 fills them).
**`predictChips`: exactly 3 German chips** for the Vorschau ritual — one true topic + two plausible
neighbours ("Jemand erzählt von der Schule / von einer Reise / vom Wochenende"). ~5 items:
1 gist MC (difficulty 1) + 3–4 detail items across formats (gf number, mc signal-word trap,
mt matching, ff short answer). Item ids `g<G>u<NN>.li.<key>.<fmt>.<NNN>`.

## The strategy layer (MANDATORY on every item — this is what the runtime teaches from)

- `phase`: `"gist"` (1–2 per task, the difficulty-1 opener) or `"detail"`.
- `cue`: `{type, quote}` — `type` ∈ number-time · spelling · signal-word · list-intonation ·
  speaker-id · place-prep · gist · detail-fact; **`quote` VERBATIM from the transcript** (V-LC1
  fails otherwise — feedback may only quote audio that exists).
- `trickDe`: ≤12 words, du-form, imperative-ish — the REUSABLE move, not the answer
  ("Nach because kommt der Grund — favourite ist dein Signal."). Never restate the fact.
- `distractorMeta`: parallel to `distractors`; every entry a du-form `whyDe` naming the lure;
  MC at difficulty ≥2 needs ≥1 `lure` tag (echo · near-number · similar-name). **The echo lure
  is the pedagogy**: at least one wrong option must contain a word the student really hears —
  "Du hörst X — aber es beantwortet eine andere Frage."

## The firewall (every item)

1. NOT answerable without the audio (no world-knowledge giveaways, no grammar-only solvable).
2. No verbatim lift as the correct MC option when a distractor is also verbatim — the CORRECT
   answer may paraphrase lightly; the echo lure carries the verbatim bait.
3. Answers tier-complete: gf numbers accept word AND digit ("eight"/"8"); ff accepts with/without
   article; every full variant a student could fairly produce is listed (the E-2 rules).
4. Prompts + distractors in-bank (V-LC5 must print 0 warnings for your unit); hintDe points at
   the cue type, never the answer; explainDe quotes the transcript line (du-form, warm).
5. Difficulty honest: 1 = gist/opener, 2 = single-cue detail, 3 = cross-sentence or contrast.

## Workflow

Draft script (read it aloud mentally at 0.85× — a 10-year-old's ear) → items → strategy layer →
`pnpm content validate-listening` to 0 errors + 0 own-unit warnings → engine spot-check (dev
server, POST each item's authored answer via /api/attempts with x-dev headers ⇒ every tier
"correct") → one-unit commit `g<G>-u<NN> listening` → wave stats in the PR body.
