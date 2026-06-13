# Verify lens — translation — g2-u05 (round 2)

<!-- domigo:verify translation g2-u05 items=3621d84f92f0 prompt=c6328b13b073 round=2 -->

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

## Vocab items (49)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u05.w.airport | airport | Flughafen | airport (full) ; airports (full) | Flughafen (full) ; der Flughafen (full) |
| g2u05.w.as-far-as | as far as | bis zu | as far as (full) | bis zu (full) ; bis zur (full) ; bis zum (full) |
| g2u05.w.bank | bank | Bank | bank (full) ; banks (full) | Bank (full) ; die Bank (full) |
| g2u05.w.bus-stop | bus stop | Bushaltestelle | bus stop (full) ; bus stops (full) | Bushaltestelle (full) ; die Bushaltestelle (full) ; Haltestelle (partial) |
| g2u05.w.chemist-s | chemist's | Apotheke | chemist's (full) ; chemist (partial) ; pharmacy (partial) | Apotheke (full) ; die Apotheke (full) |
| g2u05.w.church | church | Kirche | church (full) ; churches (full) | Kirche (full) ; die Kirche (full) |
| g2u05.w.cinema | cinema | Kino | cinema (full) ; cinemas (full) | Kino (full) ; das Kino (full) |
| g2u05.w.comment | comment | Kommentar | comment (full) ; comments (full) | Kommentar (full) ; der Kommentar (full) |
| g2u05.w.feedback | feedback | Feedback | feedback (full) | Feedback (full) ; das Feedback (full) ; Rückmeldung (partial) |
| g2u05.w.fountain | fountain | (Spring-)Brunnen | fountain (full) ; fountains (full) | Brunnen (full) ; Springbrunnen (full) ; der Brunnen (full) |
| g2u05.w.guest | guest | Gast | guest (full) ; guests (full) | Gast (full) ; Gäste (full) ; der Gast (full) |
| g2u05.w.hospital | hospital | Krankenhaus | hospital (full) ; hospitals (full) | Krankenhaus (full) ; das Krankenhaus (full) ; Spital (partial) |
| g2u05.w.map | map | (Land-)Karte | map (full) ; maps (full) | Karte (full) ; Landkarte (full) ; Stadtplan (partial) ; Plan (partial) |
| g2u05.w.market-square | market square | Marktplatz | market square (full) ; market squares (full) | Marktplatz (full) ; der Marktplatz (full) |
| g2u05.w.most-of-the-time | most of the time | meistens | most of the time (full) | meistens (full) ; die meiste Zeit (full) ; fast immer (partial) |
| g2u05.w.music-shop | music shop | Musikgeschäft | music shop (full) ; music shops (full) | Musikgeschäft (full) ; das Musikgeschäft (full) ; Musikladen (partial) |
| g2u05.w.next-to | next to | neben | next to (full) | neben (full) ; gleich neben (full) ; direkt neben (partial) |
| g2u05.w.opening | opening | Eröffnung | opening (full) ; openings (full) | Eröffnung (full) ; die Eröffnung (full) |
| g2u05.w.opposite | opposite | gegenüber | opposite (full) | gegenüber (full) ; gegenüber von (full) ; vis-à-vis (partial) |
| g2u05.w.pocket | pocket | Tasche (bei Kleidungsstücken) | pocket (full) ; pockets (full) | Tasche (full) ; Hosentasche (partial) ; Jackentasche (partial) |
| g2u05.w.police-station | police station | Polizeistation | police station (full) ; police stations (full) | Polizeistation (full) ; die Polizeistation (full) ; Polizeiwache (partial) |
| g2u05.w.politely | politely | höflich | politely (full) | höflich (full) ; auf höfliche Art (partial) |
| g2u05.w.positive | positive | positiv | positive (full) | positiv (full) |
| g2u05.w.post-office | post office | Postamt | post office (full) ; post offices (full) | Postamt (full) ; das Postamt (full) ; die Post (partial) |
| g2u05.w.railway-station | railway station | Bahnhof | railway station (full) ; train station (partial) ; station (partial) | Bahnhof (full) ; der Bahnhof (full) |
| g2u05.w.restaurant | restaurant | Restaurant | restaurant (full) ; restaurants (full) | Restaurant (full) ; das Restaurant (full) |
| g2u05.w.review | review | Rezension | review (full) ; reviews (full) | Rezension (full) ; die Rezension (full) ; Bewertung (partial) ; Kritik (partial) |
| g2u05.w.round-the-corner | round the corner | um die Ecke | round the corner (full) ; around the corner (partial) | um die Ecke (full) ; gleich um die Ecke (full) |
| g2u05.w.second | second | zweiter/zweite/zweites | second (full) | zweiter (full) ; zweite (full) ; zweites (full) ; Sekunde (partial) |
| g2u05.w.simply | simply | einfach | simply (full) ; just (partial) | einfach (full) ; ganz einfach (full) |
| g2u05.w.slow | slow | langsam | slow (full) | langsam (full) |
| g2u05.w.somewhere | somewhere | irgendwo | somewhere (full) | irgendwo (full) ; irgendwohin (partial) |
| g2u05.w.supermarket | supermarket | Supermarkt | supermarket (full) ; supermarkets (full) | Supermarkt (full) ; der Supermarkt (full) |
| g2u05.w.the-worst | the worst | der/die/das schlechteste | the worst (full) ; worst (partial) | der schlechteste (full) ; die schlechteste (full) ; das schlechteste (full) ; am schlechtesten (partial) |
| g2u05.w.to-bother | to bother | stören | bother (full) ; to bother (full) | stören (full) ; belästigen (partial) |
| g2u05.w.to-change-trains | to change trains | umsteigen | change trains (full) ; to change trains (full) | umsteigen (full) ; den Zug wechseln (partial) |
| g2u05.w.to-comment | to comment | kommentieren | comment (full) ; to comment (full) | kommentieren (full) ; einen Kommentar schreiben (partial) |
| g2u05.w.to-cross | to cross | überqueren | cross (full) ; to cross (full) | überqueren (full) ; hinübergehen (partial) |
| g2u05.w.to-cross-the-street | to cross the street | die Straße überqueren | cross the street (full) ; to cross the street (full) | die Straße überqueren (full) ; über die Straße gehen (partial) |
| g2u05.w.to-go-past | to go past | vorbeigehen | go past (full) ; to go past (full) | vorbeigehen (full) ; vorbeigehen an (full) ; vorbei gehen (partial) |
| g2u05.w.to-go-straight-ahead | to go straight ahead | geradeaus gehen | go straight ahead (full) ; to go straight ahead (full) | geradeaus gehen (full) ; geradeaus weitergehen (partial) |
| g2u05.w.to-go-straight-on | to go straight on | geradeaus weitergehen | go straight on (full) ; to go straight on (full) | geradeaus weitergehen (full) ; geradeaus gehen (partial) |
| g2u05.w.to-interrupt | to interrupt | unterbrechen | interrupt (full) ; to interrupt (full) | unterbrechen (full) ; jemanden unterbrechen (partial) ; dazwischenreden (partial) |
| g2u05.w.to-offer | to offer | anbieten | offer (full) ; to offer (full) | anbieten (full) ; bieten (partial) |
| g2u05.w.to-take-the-second-right | to take the second right | die zweite rechts nehmen | take the second right (full) ; to take the second right (full) | die zweite rechts nehmen (full) ; die zweite Straße rechts nehmen (full) ; rechts die zweite nehmen (partial) |
| g2u05.w.to-turn-left | to turn left | links abbiegen | turn left (full) ; to turn left (full) | links abbiegen (full) ; nach links abbiegen (full) ; links abzweigen (partial) |
| g2u05.w.tourist-office | tourist office | Touristeninformation | tourist office (full) ; tourist information (partial) | Touristeninformation (full) ; die Touristeninformation (full) ; Touristenbüro (partial) |
| g2u05.w.traffic-lights | traffic lights | Verkehrsampel | traffic lights (full) ; traffic light (partial) | Verkehrsampel (full) ; die Ampel (full) ; Ampel (full) |
| g2u05.w.underground | underground | U-Bahn | underground (full) | U-Bahn (full) ; die U-Bahn (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u05.gi.prepositions-directions.tr.001 | translation | Das Restaurant ist gegenüber der Kirche. [de] | The restaurant is opposite the church. (full) ; The restaurant is opposite the church (full) ; The restaurant is across from the church. (partial) | deToEn |
| g2u05.gi.prepositions-directions.tr.002 | translation | Geh geradeaus und biege dann rechts ab. [de] | Go straight ahead and then turn right. (full) ; Go straight ahead and then turn right (full) ; Go straight on and then turn right. (full) ; Go straight and then turn right. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u05/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u05",
  "lens": "translation",
  "itemsHash": "3621d84f92f0",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 51, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
