# Verify lens — translation — g1-u05 (round 2)

<!-- domigo:verify translation g1-u05 items=564df2a033b6 prompt=c6328b13b073 round=2 -->

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

## Vocab items (44)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u05.w.boyfriend | boyfriend | fester Freund | boyfriend (full) | fester Freund (full) ; Freund (partial) |
| g1u05.w.can | can | Dose | can (full) ; tin (partial) | Dose (full) |
| g1u05.w.can-cannot-can-t | can, cannot / can't | können | can (full) | können (full) |
| g1u05.w.concert | concert | Konzert | concert (full) | Konzert (full) |
| g1u05.w.don-t-worry | Don't worry. | Keine Sorge. | Don't worry. (full) ; Don't worry (full) | Keine Sorge. (full) ; Keine Sorge (full) ; Mach dir keine Sorgen. (full) |
| g1u05.w.drummer | drummer | Schlagzeuger/Schlagzeugerin | drummer (full) | Schlagzeuger (full) ; Schlagzeugerin (full) |
| g1u05.w.drums | drums | Schlagzeug | drums (full) | Schlagzeug (full) |
| g1u05.w.economy | economy | Wirtschaft | economy (full) | Wirtschaft (full) |
| g1u05.w.guitar | guitar | Gitarre | guitar (full) | Gitarre (full) |
| g1u05.w.guitarist | guitarist | Gitarrist/Gitarristin | guitarist (full) ; guitar player (partial) | Gitarrist (full) ; Gitarristin (full) |
| g1u05.w.hospital | hospital | Krankenhaus | hospital (full) | Krankenhaus (full) ; Spital (full) |
| g1u05.w.hundred | hundred | hundert | hundred (full) | hundert (full) |
| g1u05.w.in-one-go | in one go | in einem Zug | in one go (full) | in einem Zug (full) ; auf einmal (full) |
| g1u05.w.is-that-so | Is that so? | Ach wirklich? | Is that so? (full) | Ach wirklich? (full) ; Wirklich? (full) ; Ist das so? (partial) |
| g1u05.w.its | its | sein/e | its (full) | sein (full) ; seine (full) ; ihr (partial) ; ihre (partial) |
| g1u05.w.job | job | Arbeit | job (full) ; work (partial) | Arbeit (full) ; Aufgabe (full) ; Job (full) |
| g1u05.w.keyboard | keyboard | Keyboard | keyboard (full) | Keyboard (full) |
| g1u05.w.keyboard-player | keyboard player | Keyboarder/Keyboarderin | keyboard player (full) | Keyboarder (full) ; Keyboarderin (full) |
| g1u05.w.money | (pocket) money | (Taschen-)Geld | pocket money (full) ; money (full) | Taschengeld (full) ; Geld (full) |
| g1u05.w.nothing | nothing | nichts | nothing (full) | nichts (full) |
| g1u05.w.perfect | perfect | perfekt | perfect (full) | perfekt (full) |
| g1u05.w.pound | pound | Pfund | pound (full) ; pounds (full) | Pfund (full) |
| g1u05.w.profit | profit | Gewinn | profit (full) | Gewinn (full) ; Profit (full) |
| g1u05.w.saxophone | saxophone | Saxophon | saxophone (full) | Saxophon (full) |
| g1u05.w.saxophone-player | saxophone player | Saxophonist/Saxophonistin | saxophone player (full) | Saxophonist (full) ; Saxophonistin (full) |
| g1u05.w.school-canteen | school canteen | Schulkantine | school canteen (full) ; canteen (partial) | Schulkantine (full) ; Kantine (partial) |
| g1u05.w.singer | singer | Sänger/Sängerin | singer (full) | Sänger (full) ; Sängerin (full) |
| g1u05.w.sister | sister | Schwester | sister (full) | Schwester (full) |
| g1u05.w.sorry | Sorry? | Entschuldigung? | Sorry? (full) | Entschuldigung? (full) ; Wie bitte? (full) |
| g1u05.w.table | table | Tisch | table (full) | Tisch (full) |
| g1u05.w.teacher | teacher | Lehrer/Lehrerin | teacher (full) | Lehrer (full) ; Lehrerin (full) |
| g1u05.w.this-is-me | This is me. | Das bin ich. | This is me. (full) | Das bin ich. (full) |
| g1u05.w.to-carry | to carry | tragen | carry (full) ; to carry (full) | tragen (full) |
| g1u05.w.to-dance | to dance | tanzen | dance (full) ; to dance (full) | tanzen (full) |
| g1u05.w.to-drink | to drink | trinken | drink (full) ; to drink (full) | trinken (full) |
| g1u05.w.to-laugh | to laugh | lachen | laugh (full) ; to laugh (full) | lachen (full) |
| g1u05.w.to-play | to play | spielen | play (full) ; to play (full) | spielen (full) |
| g1u05.w.to-stand-on | to stand on | auf etwas stehen | stand on (full) ; to stand on (full) | auf etwas stehen (full) ; stehen auf (full) |
| g1u05.w.to-touch | to touch | berühren | touch (full) ; to touch (full) | berühren (full) ; anfassen (full) |
| g1u05.w.to-walk-on | to walk on | auf etwas gehen | walk on (full) ; to walk on (full) | auf etwas gehen (full) ; gehen auf (full) |
| g1u05.w.to-wash | to wash | waschen | wash (full) ; to wash (full) | waschen (full) |
| g1u05.w.to-wiggle | to wiggle | wackeln | wiggle (full) ; to wiggle (full) | wackeln (full) ; wackeln mit (full) |
| g1u05.w.tongue | tongue | Zunge | tongue (full) | Zunge (full) |
| g1u05.w.uncle | uncle | Onkel | uncle (full) | Onkel (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u05.gi.can.tr.001 | translation | Meine Schwester kann Schlagzeug spielen. [de] | My sister can play the drums. (full) | deToEn |
| g1u05.gi.can.tr.002 | translation | Kannst du Keyboard spielen? [de] | Can you play the keyboard? (full) | deToEn |
| g1u05.gi.possessives.tr.001 | translation | Das ist meine Schwester. [de] | This is my sister. (full) ; That is my sister. (partial) | deToEn |
| g1u05.gi.possessives.tr.004 | translation | Ihr Hund ist Bacon. [de] | Their dog is Bacon. (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u05/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u05",
  "lens": "translation",
  "itemsHash": "564df2a033b6",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 48, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
