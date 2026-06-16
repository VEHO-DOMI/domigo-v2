# Verify lens — translation — g4-u05 (round 1)

<!-- domigo:verify translation g4-u05 items=85d993378c1a prompt=c6328b13b073 round=1 -->

<!-- domigo:prompt verify-translation v=1 -->
# Lens 3 — translation, both directions (adversarial)

You are an independent, adversarial verifier and a bilingual DE/EN speaker (Austrian
German). You did NOT write these items. For every translation surface (vocab items'
`translation.deToEn` AND `translation.enToDe`; grammar items with format
`translation`):

1. **Meaning:** does each full-tier answer actually translate the prompt — register,
   number, tense, particles included? ("(sich) fürchten (vor)" ↔ "to fear", not
   "to frighten".)
2. **Direction:** is the language of prompt and answers consistent with the declared
   direction? (kind `translation-direction`)
3. **Completeness in BOTH directions:** German has synonyms too — would a student's
   natural "Ich habe Angst vor…" be accepted where defensible (partial), or wrongly
   marked wrong? English side likewise.
4. **Naturalness:** stilted or word-by-word renderings that no Austrian teenager would
   say = `translation-unnatural` (usually warn; fix when actively misteaching).
5. **du-form:** German prompts/answers address the student informally.

Flag kind menu: `translation-meaning`, `translation-direction`,
`translation-unnatural`. Severity `fix` when a correct student answer would be
rejected or a wrong meaning taught; `warn` otherwise. Cite the exact text in every
note.

## Vocab items (34)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u05.w.accept | accept | hinnehmen | accept (full) | hinnehmen (full) ; akzeptieren (full) |
| g4u05.w.afford | afford | sich leisten können | afford (full) | sich leisten (full) ; sich leisten können (full) |
| g4u05.w.afterwards | afterwards | nachher | afterwards (full) | nachher (full) ; danach (full) |
| g4u05.w.artificial | artificial | künstlich | artificial (full) ; man-made (partial) | künstlich (full) |
| g4u05.w.ashamed | (be) ashamed | sich schämen | ashamed (full) ; be ashamed (full) | sich schämen (full) |
| g4u05.w.contain | contain | enthalten | contain (full) | enthalten (full) |
| g4u05.w.cookery | cookery | Kochkunst | cookery (full) | Kochkunst (full) ; Kochen (partial) |
| g4u05.w.diet | diet | Ernährung | diet (full) | Ernährung (full) |
| g4u05.w.dislike | dislike | nicht mögen | dislike (full) | nicht mögen (full) |
| g4u05.w.eating-disorder | eating disorder | Essstörung | eating disorder (full) | Essstörung (full) |
| g4u05.w.even-though | even though | obwohl | even though (full) | obwohl (full) |
| g4u05.w.fattening | fattening | dick machend | fattening (full) | dick machend (full) ; macht dick (partial) |
| g4u05.w.feed | feed | ernähren | feed (full) | ernähren (full) ; füttern (partial) |
| g4u05.w.filling | filling | sättigend | filling (full) | sättigend (full) ; macht satt (partial) |
| g4u05.w.fresh | fresh | frisch | fresh (full) | frisch (full) |
| g4u05.w.gain | gain | zunehmen | gain (full) ; put on (partial) | zunehmen (full) |
| g4u05.w.gym | gym | Turnhalle | gym (full) | Turnhalle (full) |
| g4u05.w.habits | habits | Gewohnheiten | habits (full) | Gewohnheiten (full) |
| g4u05.w.harmful | harmful | schädlich | harmful (full) | schädlich (full) |
| g4u05.w.health | health | Gesundheit | health (full) | Gesundheit (full) |
| g4u05.w.healthy | healthy | gesund | healthy (full) | gesund (full) |
| g4u05.w.hunger | hunger | Hunger | hunger (full) | Hunger (full) |
| g4u05.w.intake | intake | Aufnahme | intake (full) | Aufnahme (full) |
| g4u05.w.nutrition | nutrition | Ernährung | nutrition (full) | Ernährung (full) |
| g4u05.w.nutritious | nutritious | nahrhaft | nutritious (full) | nahrhaft (full) |
| g4u05.w.overweight | overweight | übergewichtig | overweight (full) | übergewichtig (full) |
| g4u05.w.regularly | regularly | regelmäßig | regularly (full) | regelmäßig (full) |
| g4u05.w.revolting | revolting | ekelhaft | revolting (full) ; disgusting (partial) | ekelhaft (full) ; widerlich (full) |
| g4u05.w.tasty | tasty | lecker | tasty (full) ; delicious (partial) | lecker (full) ; schmackhaft (full) |
| g4u05.w.thin | thin | dünn | thin (full) | dünn (full) |
| g4u05.w.throw-up | throw up | erbrechen | throw up (full) | erbrechen (full) ; sich übergeben (full) |
| g4u05.w.trust | trust | vertrauen | trust (full) | vertrauen (full) |
| g4u05.w.vegetarian | vegetarian | Vegetarier/in | vegetarian (full) | Vegetarier (full) ; Vegetarierin (full) |
| g4u05.w.waste | waste | verschwenden | waste (full) | verschwenden (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u05.gi.past-perfect-connectors.tr.001 | translation | Übersetze ins Englische: ⏎  ⏎ Nachdem er gekocht hatte, wusch er das Geschirr. [de] | After he had cooked, he washed the dishes. (full) ; He washed the dishes after he had cooked. (full) ; After he had cooked, he washed the plates. (full) | deToEn |
| g4u05.gi.past-perfect-connectors.tr.002 | translation | Übersetze ins Englische: ⏎  ⏎ Bevor sie ins Bett ging, hatte sie ihre Zähne geputzt. [de] | Before she went to bed, she had brushed her teeth. (full) ; She had brushed her teeth before she went to bed. (full) | deToEn |
| g4u05.gi.past-perfect-connectors.tr.003 | translation | Übersetze ins Englische: ⏎  ⏎ Als wir ankamen, hatte das Spiel schon begonnen. [de] | When we arrived, the game had already started. (full) ; The game had already started when we arrived. (full) ; By the time we arrived, the game had already started. (full) ; When we arrived, the game had started. (partial) | deToEn |
| g4u05.gi.past-perfect-connectors.tr.004 | translation | Übersetze ins Englische: ⏎  ⏎ Obwohl er das Buch schon gelesen hatte, schaute er sich den Film an. [de] | Although he had already read the book, he watched the film. (full) ; He watched the film although he had already read the book. (full) ; Even though he had already read the book, he watched the film. (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u05/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u05",
  "lens": "translation",
  "itemsHash": "85d993378c1a",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 38, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
