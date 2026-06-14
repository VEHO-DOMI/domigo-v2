# Verify lens — translation — g3-u11 (round 1)

<!-- domigo:verify translation g3-u11 items=85249bab4f34 prompt=c6328b13b073 round=1 -->

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

## Vocab items (37)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u11.w.a-dry-place | a dry place | ein trockener Ort | a dry place (full) ; dry place (full) | ein trockener Ort (full) ; trockener Ort (full) |
| g3u11.w.backpack | backpack | Rucksack | backpack (full) ; a backpack (full) ; rucksack (partial) | Rucksack (full) |
| g3u11.w.canyon | canyon | Schlucht | canyon (full) ; a canyon (full) | Schlucht (full) ; Canyon (full) |
| g3u11.w.capital | capital | Hauptstadt | capital (full) | Hauptstadt (full) |
| g3u11.w.connection | connection | Verbindung | connection (full) | Verbindung (full) |
| g3u11.w.criminal | criminal | Krimineller/Kriminelle | criminal (full) | Krimineller (full) ; Kriminelle (full) ; Verbrecher (partial) |
| g3u11.w.cyclist | cyclist | Radfahrer/Radfahrerin | cyclist (full) | Radfahrer (full) ; Radfahrerin (full) ; Radfahrer/Radfahrerin (full) |
| g3u11.w.dirt-road | dirt road | unbefestigte Straße | dirt road (full) ; a dirt road (full) | unbefestigte Straße (full) ; Schotterstraße (partial) |
| g3u11.w.fabulous | fabulous | fabelhaft | fabulous (full) | fabelhaft (full) ; großartig (partial) ; wunderbar (partial) |
| g3u11.w.familiar | familiar | vertraut | familiar (full) | vertraut (full) ; bekannt (full) |
| g3u11.w.ferry | ferry | Fähre | ferry (full) | Fähre (full) |
| g3u11.w.four-wheel-drive | four-wheel drive | Allradantrieb | four-wheel drive (full) | Allradantrieb (full) ; Vierradantrieb (partial) |
| g3u11.w.gold-digger | gold digger | Goldgräber/Goldgräberin | gold digger (full) | Goldgräber (full) ; Goldgräberin (full) ; Goldgräber/Goldgräberin (full) |
| g3u11.w.gold-rush | gold rush | Goldrausch | gold rush (full) | Goldrausch (full) |
| g3u11.w.guided | guided | geführt | guided (full) | geführt (full) ; geleitet (full) |
| g3u11.w.headquarters | headquarters (pl) | Hauptquartier | headquarters (full) | Hauptquartier (full) ; Zentrale (partial) |
| g3u11.w.height | height | Höhe | height (full) | Höhe (full) |
| g3u11.w.independent | independent | unabhängig | independent (full) | unabhängig (full) |
| g3u11.w.information-office | information office | Informationsbüro | information office (full) | Informationsbüro (full) ; Auskunftsbüro (full) |
| g3u11.w.innovation | innovation | Neuerung | innovation (full) | Neuerung (full) ; Innovation (full) |
| g3u11.w.lip | lip | Lippe | lip (full) ; lips (full) | Lippe (full) ; Lippen (full) |
| g3u11.w.mountain-range | mountain range | Bergkette | mountain range (full) | Bergkette (full) ; Gebirge (partial) |
| g3u11.w.programmer | programmer | Programmierer/Programmiererin | programmer (full) | Programmierer (full) ; Programmiererin (full) ; Programmierer/Programmiererin (full) |
| g3u11.w.railway | railway | Eisenbahn | railway (full) | Eisenbahn (full) ; Zug (full) ; Bahn (partial) |
| g3u11.w.ridge | ridge | Bergrücken | ridge (full) ; a ridge (full) | Bergrücken (full) ; Grat (full) ; Kamm (partial) |
| g3u11.w.shade | shade (no pl) | Schatten | shade (full) | Schatten (full) |
| g3u11.w.state | state | Staat | state (full) | Staat (full) ; Bundesstaat (full) |
| g3u11.w.steep | steep | steil | steep (full) | steil (full) |
| g3u11.w.thirst | thirst | Durst | thirst (full) | Durst (full) |
| g3u11.w.to-be-situated | to be situated | liegen | to be situated (full) ; be situated (full) | liegen (full) ; sich befinden (full) ; gelegen sein (partial) |
| g3u11.w.to-catch | to catch (the train) | (den Zug) erwischen | to catch the train (full) ; catch the train (full) ; to catch (full) | den Zug erwischen (full) ; erwischen (full) ; den Zug erreichen (partial) |
| g3u11.w.to-commute | to commute | pendeln | to commute (full) ; commute (full) | pendeln (full) |
| g3u11.w.to-crack | to crack | aufbrechen | to crack (full) ; crack (full) | aufbrechen (full) ; zerbrechen (full) ; aufspringen (partial) |
| g3u11.w.to-have-no-signal | to have no signal | kein Signal haben | to have no signal (full) ; have no signal (full) | kein Signal haben (full) ; keinen Empfang haben (partial) |
| g3u11.w.to-spot-sth | to spot sth. | etw. entdecken | to spot (full) ; spot (full) | entdecken (full) ; erspähen (partial) ; bemerken (partial) |
| g3u11.w.to-take-over | to take over | übernehmen | to take over (full) ; take over (full) | übernehmen (full) |
| g3u11.w.totally | totally | total | totally (full) | total (full) ; völlig (full) ; ganz (partial) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u11.gi.present-perfect-continuous.tr.002 | translation | Übersetze ins Englische: 'Er lernt seit September Gitarre.' [de] | He has been learning the guitar since September. (full) ; He's been learning the guitar since September. (partial) ; He has been learning guitar since September. (partial) | deToEn |
| g3u11.gi.present-perfect-continuous.tr.003 | translation | Übersetze ins Englische: 'Wir warten seit dem Morgen auf den Zug.' [de] | We have been waiting for the train all morning. (full) ; We've been waiting for the train all morning. (partial) ; We have been waiting for the train since this morning. (full) ; We've been waiting for the train since this morning. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g3-u11/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u11",
  "lens": "translation",
  "itemsHash": "85249bab4f34",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 39, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
