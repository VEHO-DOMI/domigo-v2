# Verify lens — translation — g1-u04 (round 1)

<!-- domigo:verify translation g1-u04 items=22d315a2d185 prompt=c6328b13b073 round=1 -->

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

## Vocab items (61)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u04.w.a-day-in-the-life-of | a day in the life of | ein Tag im Leben von | a day in the life of (full) | ein Tag im Leben von (full) |
| g1u04.w.after | after | nach | after (full) | nach (full) |
| g1u04.w.afternoon | afternoon | Nachmittag | afternoon (full) | Nachmittag (full) |
| g1u04.w.angry | angry | wütend | angry (full) ; mad (partial) | wütend (full) ; böse (full) ; zornig (partial) |
| g1u04.w.are-you-ok | Are you OK? | Geht's dir/euch/Ihnen gut? | Are you OK (full) ; Are you OK? (full) | Geht's dir gut? (full) ; Geht es dir gut? (full) ; Alles okay? (partial) |
| g1u04.w.bad | bad | schlecht | bad (full) | schlecht (full) ; böse (partial) |
| g1u04.w.be-yourself | Be yourself. | Sei du selbst. | Be yourself (full) ; Be yourself. (full) | Sei du selbst. (full) ; Sei du selbst (full) |
| g1u04.w.because | because | weil | because (full) | weil (full) |
| g1u04.w.birthday | birthday | Geburtstag | birthday (full) | Geburtstag (full) |
| g1u04.w.bored | bored | gelangweilt | bored (full) | gelangweilt (full) |
| g1u04.w.bottle | bottle | Flasche | bottle (full) | Flasche (full) |
| g1u04.w.cold | cold | kalt | cold (full) | kalt (full) |
| g1u04.w.day | day | Tag | day (full) | Tag (full) |
| g1u04.w.don-t-be-late | Don't be late. | Komm(t) nicht zu spät. | Don't be late (full) ; Don't be late. (full) | Komm nicht zu spät. (full) ; Sei pünktlich. (full) ; Kommt nicht zu spät. (full) |
| g1u04.w.early | early | früh | early (full) | früh (full) |
| g1u04.w.end | end | Ende | end (full) | Ende (full) |
| g1u04.w.evening | evening | Abend | evening (full) | Abend (full) |
| g1u04.w.excited | excited | aufgeregt | excited (full) | aufgeregt (full) |
| g1u04.w.friday | Friday | Freitag | Friday (full) | Freitag (full) |
| g1u04.w.friend | friend | Freund/Freundin | friend (full) | Freund (full) ; Freundin (full) |
| g1u04.w.fun | fun | Spaß | fun (full) | Spaß (full) |
| g1u04.w.go-away | Go away! | Geh weg! | Go away (full) | Geh weg (full) ; Geh weg! (full) |
| g1u04.w.happy | happy | glücklich | happy (full) | glücklich (full) ; fröhlich (full) |
| g1u04.w.homework | homework (no pl) | Hausaufgaben | homework (full) | Hausaufgaben (full) ; Hausübung (full) |
| g1u04.w.hot | hot | heiß | hot (full) | heiß (full) |
| g1u04.w.hungry | hungry | hungrig | hungry (full) | hungrig (full) |
| g1u04.w.into | into | in (… hinein) | into (full) | hinein (full) ; ins (full) ; in (partial) |
| g1u04.w.it-s-me | It's me. | Ich bin's. | It's me (full) ; It's me. (full) | Ich bin's. (full) ; Ich bin es. (full) |
| g1u04.w.let-go | Let go! | Lass(t) los! | Let go (full) ; Let go! (full) | Lass los! (full) ; Lasst los! (full) |
| g1u04.w.life | life | Leben | life (full) | Leben (full) |
| g1u04.w.lunchtime | lunchtime | Mittagszeit | lunchtime (full) ; lunch time (partial) | Mittagszeit (full) ; Mittagspause (full) |
| g1u04.w.mad | mad | wütend | mad (full) ; angry (partial) | wütend (full) ; zornig (full) |
| g1u04.w.magic | magic | magisch | magic (full) ; magical (partial) | magisch (full) ; Zauber- (full) |
| g1u04.w.monday | Monday | Montag | Monday (full) | Montag (full) |
| g1u04.w.morning | morning | Morgen | morning (full) | Morgen (full) |
| g1u04.w.nervous | nervous | nervös | nervous (full) | nervös (full) |
| g1u04.w.night | night | Nacht | night (full) | Nacht (full) |
| g1u04.w.no-one-else | no one else | niemand anders | no one else (full) | niemand anders (full) ; sonst niemand (full) |
| g1u04.w.oh-dear | Oh dear! | Du meine Güte! | Oh dear (full) ; Oh dear! (full) | Du meine Güte! (full) ; Oje! (full) ; Oh je! (full) |
| g1u04.w.proud | proud | stolz | proud (full) | stolz (full) |
| g1u04.w.room | room | Raum | room (full) | Raum (full) ; Zimmer (full) |
| g1u04.w.sad | sad | traurig | sad (full) | traurig (full) |
| g1u04.w.saturday | Saturday | Samstag | Saturday (full) | Samstag (full) |
| g1u04.w.scared | scared | ängstlich | scared (full) ; afraid (partial) | ängstlich (full) ; verängstigt (full) |
| g1u04.w.show | show | Show | show (full) | Show (full) ; Vorführung (full) |
| g1u04.w.still | still | noch immer | still (full) | noch immer (full) ; immer noch (full) ; noch (partial) |
| g1u04.w.story | story | Geschichte | story (full) | Geschichte (full) |
| g1u04.w.sunday | Sunday | Sonntag | Sunday (full) | Sonntag (full) |
| g1u04.w.thursday | Thursday | Donnerstag | Thursday (full) | Donnerstag (full) |
| g1u04.w.tired | tired | müde | tired (full) | müde (full) |
| g1u04.w.to-be-asleep | to be asleep | schlafen | be asleep (full) ; to be asleep (full) ; asleep (full) | schlafen (full) |
| g1u04.w.to-break | to break | (zer-)brechen | break (full) ; to break (full) | brechen (full) ; zerbrechen (full) ; kaputt machen (partial) |
| g1u04.w.to-get-back | to get back | zurückholen | get back (full) ; to get back (full) | zurückholen (full) ; zurückbekommen (full) |
| g1u04.w.to-go-to-sleep | to go to sleep | schlafen gehen | go to sleep (full) ; to go to sleep (full) | schlafen gehen (full) ; einschlafen (partial) |
| g1u04.w.to-happen | to happen | passieren | happen (full) ; to happen (full) | passieren (full) ; geschehen (full) |
| g1u04.w.today | today | heute | today (full) | heute (full) |
| g1u04.w.tomorrow | tomorrow | morgen | tomorrow (full) | morgen (full) |
| g1u04.w.try-it | Try it! | Versuch es! | Try it (full) ; Try it! (full) | Versuch es! (full) ; Probier es! (full) ; Probier's! (full) |
| g1u04.w.tuesday | Tuesday | Dienstag | Tuesday (full) | Dienstag (full) |
| g1u04.w.wednesday | Wednesday | Mittwoch | Wednesday (full) | Mittwoch (full) |
| g1u04.w.what-s-happening | What's happening? | Was ist (hier) los? | What's happening (full) ; What's happening? (full) ; What is happening? (full) | Was ist los? (full) ; Was ist hier los? (full) ; Was passiert? (full) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u04.gi.to-be-negative.tr.001 | translation | Ich bin nicht müde. [de] | I'm not tired. (full) ; I am not tired. (full) | deToEn |
| g1u04.gi.to-be-negative.tr.002 | translation | Sie sind nicht wütend. Sie sind glücklich. [de] | They aren't angry. They're happy. (full) ; They are not angry. They are happy. (full) | deToEn |
| g1u04.gi.to-be-questions.tr.001 | translation | Bist du müde? [de] | Are you tired? (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u04/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u04",
  "lens": "translation",
  "itemsHash": "22d315a2d185",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 64, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
