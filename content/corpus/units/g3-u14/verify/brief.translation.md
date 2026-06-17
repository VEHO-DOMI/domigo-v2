# Verify lens — translation — g3-u14 (round 1)

<!-- domigo:verify translation g3-u14 items=fa94353c94ba prompt=c6328b13b073 round=1 -->

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
| g3u14.w.at-once | at once | sofort | at once (full) ; immediately (partial) | sofort (full) ; auf der Stelle (full) |
| g3u14.w.balcony | balcony | Balkon | balcony (full) | Balkon (full) |
| g3u14.w.branch | branch | Ast | branch (full) | Ast (full) ; Zweig (partial) |
| g3u14.w.bug | bug | Insekt | bug (full) ; insect (partial) | Insekt (full) ; Käfer (partial) |
| g3u14.w.bush | bush | Busch | bush (full) | Busch (full) ; Strauch (partial) |
| g3u14.w.by-the-way | by the way | übrigens | by the way (full) | übrigens (full) ; apropos (partial) |
| g3u14.w.crash | crash | Unfall | crash (full) ; accident (partial) | Unfall (full) ; Zusammenstoß (full) |
| g3u14.w.crime | crime | Verbrechen | crime (full) | Verbrechen (full) ; Straftat (partial) |
| g3u14.w.cut | cut | Schnitt(-wunde) | cut (full) | Schnittwunde (full) ; Schnitt (full) |
| g3u14.w.engine | engine | Motor | engine (full) ; motor (partial) | Motor (full) |
| g3u14.w.front-seat | front seat | Vordersitz | front seat (full) | Vordersitz (full) ; Beifahrersitz (partial) |
| g3u14.w.impolite | impolite | unhöflich | impolite (full) ; rude (partial) | unhöflich (full) |
| g3u14.w.official-language | official language | Amtssprache | official language (full) | Amtssprache (full) ; offizielle Sprache (full) |
| g3u14.w.otherwise | otherwise | andernfalls | otherwise (full) | andernfalls (full) ; sonst (full) |
| g3u14.w.park-ranger | park ranger | Parkwächter/Parkwächterin | park ranger (full) | Parkwächter (full) ; Parkwächterin (full) |
| g3u14.w.round-a-bend | round a bend | um eine Ecke | round a bend (full) ; around a bend (full) | um eine Ecke (full) ; um eine Kurve (full) |
| g3u14.w.shocked | shocked | schockiert | shocked (full) | schockiert (full) ; erschüttert (partial) |
| g3u14.w.stuffed | stuffed | ausgestopft | stuffed (full) | ausgestopft (full) |
| g3u14.w.sunburn | sunburn | Sonnenbrand | sunburn (full) | Sonnenbrand (full) |
| g3u14.w.to-book-a-holiday | to book a holiday | einen Urlaub buchen | to book a holiday (full) ; book a holiday (full) | einen Urlaub buchen (full) ; Ferien buchen (partial) |
| g3u14.w.to-buy-a-dictionary | to buy a dictionary | ein Wörterbuch kaufen | to buy a dictionary (full) ; buy a dictionary (full) | ein Wörterbuch kaufen (full) |
| g3u14.w.to-check-the-area-out-online | to check the area out online | die Gegend online erkunden | to check the area out online (full) ; check the area out online (full) | die Gegend online erkunden (full) ; sich die Gegend im Internet ansehen (partial) |
| g3u14.w.to-dig | to dig | graben | to dig (full) ; dig (full) | graben (full) |
| g3u14.w.to-drive-off | to drive off | wegfahren | to drive off (full) ; drive off (full) | wegfahren (full) ; losfahren (partial) |
| g3u14.w.to-find-information-about-the-best-beaches | to find information about the best beaches | Informationen über die besten Strände finden | to find information about the best beaches (full) ; find information about the best beaches (full) | Informationen über die besten Strände finden (full) ; die schönsten Strände herausfinden (partial) |
| g3u14.w.to-find-out-about-good-restaurants | to find out about good restaurants | gute Restaurants herausfinden | to find out about good restaurants (full) ; find out about good restaurants (full) | gute Restaurants herausfinden (full) ; gute Lokale ausfindig machen (partial) |
| g3u14.w.to-find-out-what-to-do-there | to find out what to do there | herausfinden | to find out what to do there (full) ; find out what to do there (full) | herausfinden, was man dort machen kann (full) ; herausfinden (partial) |
| g3u14.w.to-hire-a-car | to hire a car | ein Auto mieten | to hire a car (full) ; hire a car (full) ; to rent a car (partial) | ein Auto mieten (full) ; sich ein Auto leihen (partial) |
| g3u14.w.to-look-at-a-map-of-the-area | to look at a map of the area | sich eine Karte der Gegend ansehen | to look at a map of the area (full) ; look at a map of the area (full) | sich eine Karte der Gegend ansehen (full) ; auf eine Karte der Umgebung schauen (partial) |
| g3u14.w.to-make-a-hotel-reservation | to make a hotel reservation | eine Hotelreservierung vornehmen | to make a hotel reservation (full) ; make a hotel reservation (full) | eine Hotelreservierung vornehmen (full) ; ein Hotelzimmer reservieren (partial) |
| g3u14.w.to-plan-a-trip | to plan a trip | eine Reise planen | to plan a trip (full) ; plan a trip (full) | eine Reise planen (full) ; einen Ausflug planen (partial) |
| g3u14.w.to-prefer | to prefer | bevorzugen | to prefer (full) ; prefer (full) | bevorzugen (full) ; lieber mögen (full) |
| g3u14.w.to-turn-over | to turn over | (sich) überschlagen | to turn over (full) ; turn over (full) | sich überschlagen (full) ; umkippen (partial) |
| g3u14.w.to-whisper | to whisper | flüstern | to whisper (full) ; whisper (full) | flüstern (full) |
| g3u14.w.wetland | wetland | Sumpfgebiet | wetland (full) | Sumpfgebiet (full) ; Feuchtgebiet (full) |
| g3u14.w.wild-animal | wild animal | Wildtier | wild animal (full) | Wildtier (full) ; wildes Tier (full) |
| g3u14.w.wildlife | wildlife | wilde Tierwelt | wildlife (full) | wilde Tierwelt (full) ; Tierwelt (partial) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u14.gi.going-to-evidence.tr.002 | translation | Übersetze ins Englische (du siehst es gerade passieren): 'Pass auf! Die Tasse wird hinunterfallen!' [de] | Watch out! The cup is going to fall down! (full) ; Look out! The cup is going to fall down! (full) | deToEn |
| g3u14.gi.going-to-evidence.tr.003 | translation | Übersetze ins Englische (du siehst den Beweis): 'Schau dir die Wolken an! Es wird regnen.' [de] | Look at the clouds! It's going to rain. (full) ; Look at the clouds! It is going to rain. (full) ; Look at those clouds! It's going to rain. (full) ; Look at those clouds! It is going to rain. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u14/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u14",
  "lens": "translation",
  "itemsHash": "fa94353c94ba",
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
