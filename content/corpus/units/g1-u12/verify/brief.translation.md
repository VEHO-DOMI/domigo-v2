# Verify lens — translation — g1-u12 (round 1)

<!-- domigo:verify translation g1-u12 items=08c10551a0cb prompt=c6328b13b073 round=1 -->

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

## Vocab items (74)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u12.w.10th-tenth | 10th tenth | 10. zehnte/r/s | tenth (full) ; 10th (full) | zehnte (full) ; 10. (full) ; zehnter (partial) ; zehntes (partial) |
| g1u12.w.11th-eleventh | 11th eleventh | 11. elfte/r/s | eleventh (full) ; 11th (full) | elfte (full) ; 11. (full) ; elfter (partial) ; elftes (partial) |
| g1u12.w.12th-twelfth | 12th twelfth | 12. zwölfte/r/s | twelfth (full) ; 12th (full) | zwölfte (full) ; 12. (full) ; zwölfter (partial) ; zwölftes (partial) |
| g1u12.w.13th-thirteenth | 13th thirteenth | 13. dreizehnte/r/s | thirteenth (full) ; 13th (full) | dreizehnte (full) ; 13. (full) ; dreizehnter (partial) ; dreizehntes (partial) |
| g1u12.w.14th-fourteenth | 14th fourteenth | 14. vierzehnte/r/s | fourteenth (full) ; 14th (full) | vierzehnte (full) ; 14. (full) ; vierzehnter (partial) ; vierzehntes (partial) |
| g1u12.w.15th-fifteenth | 15th fifteenth | 15. fünfzehnte/r/s | fifteenth (full) ; 15th (full) | fünfzehnte (full) ; 15. (full) ; fünfzehnter (partial) ; fünfzehntes (partial) |
| g1u12.w.16th-sixteenth | 16th sixteenth | 16. sechzehnte/r/s | sixteenth (full) ; 16th (full) | sechzehnte (full) ; 16. (full) ; sechzehnter (partial) ; sechzehntes (partial) |
| g1u12.w.17th-seventeenth | 17th seventeenth | 17. siebzehnte/r/s | seventeenth (full) ; 17th (full) | siebzehnte (full) ; 17. (full) ; siebzehnter (partial) ; siebzehntes (partial) |
| g1u12.w.18th-eighteenth | 18th eighteenth | 18. achtzehnte/r/s | eighteenth (full) ; 18th (full) | achtzehnte (full) ; 18. (full) ; achtzehnter (partial) ; achtzehntes (partial) |
| g1u12.w.19th-nineteenth | 19th nineteenth | 19. neunzehnte/r/s | nineteenth (full) ; 19th (full) | neunzehnte (full) ; 19. (full) ; neunzehnter (partial) ; neunzehntes (partial) |
| g1u12.w.1st-first | 1st first | 1. erste/r/s | first (full) ; 1st (full) | erste (full) ; 1. (full) ; erster (partial) ; erstes (partial) |
| g1u12.w.20th-twentieth | 20th twentieth | 20. zwanzigste/r/s | twentieth (full) ; 20th (full) | zwanzigste (full) ; 20. (full) ; zwanzigster (partial) ; zwanzigstes (partial) |
| g1u12.w.21st-twenty-first | 21st twenty-first | 21. einundzwanzigste/r/s | twenty-first (full) ; 21st (full) | einundzwanzigste (full) ; 21. (full) ; einundzwanzigster (partial) ; einundzwanzigstes (partial) |
| g1u12.w.22nd-twenty-second | 22nd twenty-second | 22. zweiundzwanzigste/r/s | twenty-second (full) ; 22nd (full) | zweiundzwanzigste (full) ; 22. (full) ; zweiundzwanzigster (partial) ; zweiundzwanzigstes (partial) |
| g1u12.w.23rd-twenty-third | 23rd twenty-third | 23. dreiundzwanzigste/r/s | twenty-third (full) ; 23rd (full) | dreiundzwanzigste (full) ; 23. (full) ; dreiundzwanzigster (partial) ; dreiundzwanzigstes (partial) |
| g1u12.w.24th-twenty-fourth | 24th twenty-fourth | 24. vierundzwanzigste/r/s | twenty-fourth (full) ; 24th (full) | vierundzwanzigste (full) ; 24. (full) ; vierundzwanzigster (partial) ; vierundzwanzigstes (partial) |
| g1u12.w.25th-twenty-fifth | 25th twenty-fifth | 25. fünfundzwanzigste/r/s | twenty-fifth (full) ; 25th (full) | fünfundzwanzigste (full) ; 25. (full) ; fünfundzwanzigster (partial) ; fünfundzwanzigstes (partial) |
| g1u12.w.2nd-second | 2nd second | 2. zweite/r/s | second (full) ; 2nd (full) | zweite (full) ; 2. (full) ; zweiter (partial) ; zweites (partial) |
| g1u12.w.30th-thirtieth | 30th thirtieth | 30. dreißigste/r/s | thirtieth (full) ; 30th (full) | dreißigste (full) ; 30. (full) ; dreißigster (partial) ; dreißigstes (partial) |
| g1u12.w.31st-thirty-first | 31st thirty-first | 31. einunddreißigste/r/s | thirty-first (full) ; 31st (full) | einunddreißigste (full) ; 31. (full) ; einunddreißigster (partial) ; einunddreißigstes (partial) |
| g1u12.w.3rd-third | 3rd third | 3. dritte/r/s | third (full) ; 3rd (full) | dritte (full) ; 3. (full) ; dritter (partial) ; drittes (partial) |
| g1u12.w.4th-fourth | 4th fourth | 4. vierte/r/s | fourth (full) ; 4th (full) | vierte (full) ; 4. (full) ; vierter (partial) ; viertes (partial) |
| g1u12.w.5th-fifth | 5th fifth | 5. fünfte/r/s | fifth (full) ; 5th (full) | fünfte (full) ; 5. (full) ; fünfter (partial) ; fünftes (partial) |
| g1u12.w.6th-sixth | 6th sixth | 6. sechste/r/s | sixth (full) ; 6th (full) | sechste (full) ; 6. (full) ; sechster (partial) ; sechstes (partial) |
| g1u12.w.7th-seventh | 7th seventh | 7. siebte/r/s | seventh (full) ; 7th (full) | siebte (full) ; 7. (full) ; siebter (partial) ; siebtes (partial) |
| g1u12.w.8th-eighth | 8th eighth | 8. achte/r/s | eighth (full) ; 8th (full) | achte (full) ; 8. (full) ; achter (partial) ; achtes (partial) |
| g1u12.w.9th-ninth | 9th ninth | 9. neunte/r/s | ninth (full) ; 9th (full) | neunte (full) ; 9. (full) ; neunter (partial) ; neuntes (partial) |
| g1u12.w.alarm-clock | alarm clock | Wecker | alarm clock (full) | Wecker (full) |
| g1u12.w.april | April | April | April (full) | April (full) |
| g1u12.w.august | August | August | August (full) | August (full) |
| g1u12.w.bathroom | bathroom | Badezimmer | bathroom (full) | Badezimmer (full) |
| g1u12.w.bedroom | bedroom | Schlafzimmer | bedroom (full) | Schlafzimmer (full) |
| g1u12.w.birthday-cake | birthday cake | Geburtstagskuchen/-torte | birthday cake (full) | Geburtstagskuchen/-torte (full) |
| g1u12.w.candle | candle | Kerze | candle (full) | Kerze (full) |
| g1u12.w.cinema | cinema | Kino | cinema (full) ; movies (partial) | Kino (full) |
| g1u12.w.date | date | Datum | date (full) | Datum (full) |
| g1u12.w.december | December | Dezember | December (full) | Dezember (full) |
| g1u12.w.delicious | delicious | köstlich | delicious (full) ; tasty (partial) ; yummy (partial) | köstlich (full) |
| g1u12.w.dining-room | dining room | Esszimmer | dining room (full) | Esszimmer (full) |
| g1u12.w.eater | eater | Esser/Esserin | eater (full) ; diner (partial) | Esser/Esserin (full) |
| g1u12.w.excellent | excellent | ausgezeichnet | excellent (full) ; great (partial) | ausgezeichnet (full) |
| g1u12.w.february | February | Februar | February (full) | Februar (full) |
| g1u12.w.finally | finally | endlich | finally (full) ; at last (partial) | endlich (full) ; schließlich (partial) |
| g1u12.w.garage | garage | Garage | garage (full) | Garage (full) |
| g1u12.w.garden | garden | Garten | garden (full) | Garten (full) |
| g1u12.w.good-for-you | Good for you! | Schön für dich! | Good for you! (full) | Schön für dich! (full) |
| g1u12.w.hall | hall | Flur | hall (full) | Flur (full) ; Diele (partial) |
| g1u12.w.how-dare-you | How dare you! | Wie kannst du es wagen! | How dare you! (full) | Wie kannst du es wagen! (full) |
| g1u12.w.how-old-are-you | How old are you? | Wie alt bist du? | How old are you? (full) | Wie alt bist du? (full) |
| g1u12.w.ill | ill | krank | ill (full) ; sick (partial) ; unwell (partial) | krank (full) |
| g1u12.w.inspector | inspector | Inspektor/Inspektorin | inspector (full) ; detective (partial) | Inspektor/Inspektorin (full) |
| g1u12.w.it-s-my-birthday | It's my birthday. | Ich habe Geburtstag. | It's my birthday. (full) | Ich habe Geburtstag. (full) |
| g1u12.w.january | January | Jänner | January (full) | Jänner (full) |
| g1u12.w.july | July | Juli | July (full) | Juli (full) |
| g1u12.w.june | June | Juni | June (full) | Juni (full) |
| g1u12.w.kitchen | kitchen | Küche | kitchen (full) | Küche (full) |
| g1u12.w.last | last | letzter/letzte/letztes | last (full) | letzte (full) ; letzter (partial) ; letztes (partial) |
| g1u12.w.library | library | Bibliothek | library (full) | Bibliothek (full) |
| g1u12.w.living-room | living room | Wohnzimmer | living room (full) | Wohnzimmer (full) |
| g1u12.w.march | March | März | March (full) | März (full) |
| g1u12.w.match | match | Match | match (full) ; game (partial) | Match (full) ; Spiel (partial) |
| g1u12.w.may | May | Mai | May (full) | Mai (full) |
| g1u12.w.messy | messy | unordentlich | messy (full) ; untidy (partial) | unordentlich (full) ; schlampig (partial) |
| g1u12.w.month | month | Monat | month (full) | Monat (full) |
| g1u12.w.november | November | November | November (full) | November (full) |
| g1u12.w.october | October | Oktober | October (full) | Oktober (full) |
| g1u12.w.piece | piece | Stück | piece (full) ; bit (partial) ; slice (partial) | Stück (full) |
| g1u12.w.probably | probably | wahrscheinlich | probably (full) ; maybe (partial) | wahrscheinlich (full) |
| g1u12.w.robber | robber | Räuber/Räuberin | robber (full) ; thief (partial) | Räuber/Räuberin (full) |
| g1u12.w.robbery | robbery | Raubüberfall | robbery (full) | Raubüberfall (full) |
| g1u12.w.september | September | September | September (full) | September (full) |
| g1u12.w.that-was-close | That was close. | Das war knapp. | That was close. (full) | Das war knapp. (full) |
| g1u12.w.yesterday | yesterday | gestern | yesterday (full) | gestern (full) |
| g1u12.w.you-re-welcome | You're welcome. | Nichts zu danken. | You're welcome. (full) | Nichts zu danken. (full) ; Keine Ursache. (partial) ; Gern geschehen. (partial) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u12.gi.ordinal-numbers.tr.001 | translation | Mein Geburtstag ist am dritten Mai. [de] | My birthday is on the third of May. (full) ; My birthday is on the 3rd of May. (partial) | deToEn |
| g1u12.gi.ordinal-numbers.tr.002 | translation | Heute ist der fünfzehnte Dezember. [de] | Today is the fifteenth of December. (full) ; Today is the 15th of December. (partial) | deToEn |
| g1u12.gi.past-simple-was-were.tr.001 | translation | Wir waren gestern im Kino. [de] | We were at the cinema yesterday. (full) ; Yesterday we were at the cinema. (full) | deToEn |
| g1u12.gi.past-simple-was-were.tr.002 | translation | Er war gestern nicht in der Schule. [de] | He wasn't at school yesterday. (full) ; He was not at school yesterday. (full) ; Yesterday he wasn't at school. (full) | deToEn |
| g1u12.gi.prepositions-time.tr.001 | translation | Ich habe am Freitag ein Match. [de] | I have a match on Friday. (full) ; I have got a match on Friday. (full) ; I've got a match on Friday. (full) | deToEn |
| g1u12.gi.prepositions-time.tr.002 | translation | Der Geburtstag meiner Schwester ist im Dezember. [de] | My sister's birthday is in December. (full) ; My sister's birthday's in December. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u12/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u12",
  "lens": "translation",
  "itemsHash": "08c10551a0cb",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 80, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
