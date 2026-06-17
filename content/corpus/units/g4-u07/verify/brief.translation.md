# Verify lens — translation — g4-u07 (round 1)

<!-- domigo:verify translation g4-u07 items=fa13b94a59e9 prompt=c6328b13b073 round=1 -->

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

## Vocab items (30)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u07.w.aborigine | Aborigine | Ureinwohner/in Australiens | Aborigine (full) ; Aborigines (full) ; Aboriginal (partial) | Ureinwohner Australiens (full) ; Ureinwohnerin Australiens (full) ; Ureinwohner/in Australiens (full) ; Aborigine (partial) |
| g4u07.w.aircraft | aircraft | Flugzeug | aircraft (full) ; plane (partial) | Flugzeug (full) ; Maschine (partial) |
| g4u07.w.airline | airline | Fluglinie | airline (full) | Fluglinie (full) ; Fluggesellschaft (full) ; Airline (partial) |
| g4u07.w.ambulance | ambulance | Krankenwagen | ambulance (full) | Krankenwagen (full) ; Rettungswagen (full) ; Rettung (partial) |
| g4u07.w.ancestor | ancestor | Vorfahr/in | ancestor (full) ; ancestors (full) | Vorfahr (full) ; Vorfahrin (full) ; Vorfahr/in (full) ; Ahne (full) ; Ahnin (full) ; Vorfahren (partial) |
| g4u07.w.bush-trail | bush trail | Buschpfad | bush trail (full) | Buschpfad (full) ; Buschweg (partial) |
| g4u07.w.cheque | cheque | Scheck | cheque (full) ; check (partial) | Scheck (full) ; ein Scheck (partial) |
| g4u07.w.crawl | crawl | kriechen | crawl (full) ; to crawl (full) ; crawled (partial) | kriechen (full) ; krabbeln (partial) |
| g4u07.w.detailed | detailed | ausführlich | detailed (full) | ausführlich (full) ; detailliert (full) ; genau (partial) |
| g4u07.w.distance | distance | Entfernung | distance (full) ; distances (full) | Entfernung (full) ; Distanz (full) ; Strecke (partial) |
| g4u07.w.drag | drag | schleppen | drag (full) ; to drag (full) ; pull (partial) | schleppen (full) ; ziehen (partial) |
| g4u07.w.drugs | drugs | Medikamente | drugs (full) ; medicines (partial) ; medicine (partial) | Medikamente (full) ; Arzneien (full) ; Medizin (partial) |
| g4u07.w.envelope | envelope | Kuvert | envelope (full) | Kuvert (full) ; Briefumschlag (full) ; Umschlag (partial) |
| g4u07.w.excess-weight | excess weight | Übergewicht (bei Gepäck) | excess weight (full) ; excess baggage (partial) | Übergewicht (full) ; Übergewicht bei Gepäck (full) ; Mehrgewicht (partial) |
| g4u07.w.first-aid | first aid | Erste Hilfe | first aid (full) | Erste Hilfe (full) ; erste Hilfe (full) |
| g4u07.w.gorgeous | gorgeous | wunderschön | gorgeous (full) | wunderschön (full) ; herrlich (full) ; traumhaft (partial) |
| g4u07.w.grab | grab | packen | grab (full) ; to grab (full) ; grabbed (partial) | packen (full) ; schnappen (full) ; greifen (partial) |
| g4u07.w.headlight | headlight | Scheinwerfer | headlight (full) ; headlights (full) | Scheinwerfer (full) ; Autoscheinwerfer (partial) |
| g4u07.w.heritage | heritage | Erbe | heritage (full) | Erbe (full) ; Tradition (full) ; Kulturerbe (partial) |
| g4u07.w.jump-start | jump-start | Starthilfe geben | jump-start (full) ; to jump-start (full) ; jumpstart (partial) | Starthilfe geben (full) ; überbrücken (partial) |
| g4u07.w.landing | landing | Landung | landing (full) | Landung (full) |
| g4u07.w.outback | (the) outback | Hinterland Australiens | outback (full) ; the outback (full) | Hinterland Australiens (full) ; Hinterland (full) ; Outback (partial) |
| g4u07.w.pressure | pressure | Druck | pressure (full) ; stress (partial) | Druck (full) ; Stress (partial) |
| g4u07.w.provide | provide | versorgen | provide (full) ; to provide (full) | versorgen (full) ; verschaffen (full) ; bereitstellen (partial) |
| g4u07.w.reed | reed | Schilfrohr | reed (full) ; reeds (full) | Schilfrohr (full) ; Schilf (full) ; Rohr (partial) |
| g4u07.w.shade | shade | Schatten | shade (full) | Schatten (full) |
| g4u07.w.string | string | Schnur | string (full) | Schnur (full) ; Bindfaden (full) ; Faden (partial) |
| g4u07.w.survival-skills | survival skills | Überlebenstechniken | survival skills (full) | Überlebenstechniken (full) ; Überlebenskünste (partial) |
| g4u07.w.track | track | (Tier)Fährte | track (full) ; tracks (full) ; trail (partial) | Fährte (full) ; Tierfährte (full) ; Spur (full) |
| g4u07.w.walkabout | walkabout | Buschwanderung | walkabout (full) | Buschwanderung (full) ; Wanderung (partial) |

## Grammar items (13 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u07.gi.present-simple-future.tr.001 | translation | Der Zug fährt um 9 Uhr ab. [de] | The train leaves at 9 o'clock. (full) ; The train leaves at 9. (full) ; The train leaves at 9 a.m. (partial) | deToEn |
| g4u07.gi.present-simple-future.tr.002 | translation | Wann beginnt die Vorstellung? [de] | When does the show begin? (full) ; What time does the show begin? (full) ; When does the concert begin? (partial) | deToEn |
| g4u07.gi.present-simple-future.tr.003 | translation | Das Flugzeug landet um 14:30 Uhr. [de] | The plane lands at 2:30 p.m. (full) ; The plane lands at 14:30. (full) ; The plane arrives at 2:30 p.m. (partial) | deToEn |
| g4u07.gi.present-simple-future.tr.004 | translation | Wann macht das Museum morgen auf? [de] | When does the museum open tomorrow? (full) ; What time does the museum open tomorrow? (full) | deToEn |
| g4u07.gi.present-simple-future.tr.005 | translation | Diesen Sonntag gibt es ein Konzert. [de] | There's a concert this Sunday. (full) ; There is a concert this Sunday. (full) | deToEn |
| g4u07.gi.present-simple-future.tr.006 | translation | Wir haben morgen einen Flug. [de] | We have got a flight tomorrow. (full) ; We have a flight tomorrow. (partial) | deToEn |
| g4u07.gi.present-simple-future.tr.007 | translation | Das Geschäft schließt heute um 9 Uhr abends. [de] | The shop closes at 9 p.m. today. (full) ; The shop closes at 9 o'clock today. (partial) | deToEn |
| g4u07.gi.want-someone-to.tr.001 | translation | Ich will, dass du mir zuhörst. [de] | I want you to listen to me. (full) ; I want you to listen to me (full) ; I'd like you to listen to me. (partial) | deToEn |
| g4u07.gi.want-someone-to.tr.002 | translation | Meine Eltern wollen, dass ich mehr lese. [de] | My parents want me to read more. (full) ; My parents want me to read more (full) | deToEn |
| g4u07.gi.want-someone-to.tr.003 | translation | Er bat mich, ihm bei den Hausaufgaben zu helfen. [de] | He asked me to help him with his homework. (full) ; He asked me to help him with his homework (full) ; He asked me to help him with the homework. (partial) | deToEn |
| g4u07.gi.want-someone-to.tr.004 | translation | Willst du, dass ich dir bei den Hausaufgaben helfe? [de] | Do you want me to help you with your homework? (full) ; Do you want me to help you with your homework (full) ; Do you want me to help you with the homework? (partial) | deToEn |
| g4u07.gi.want-someone-to.tr.005 | translation | Die Lehrerin will, dass wir ruhig arbeiten. [de] | The teacher wants us to work quietly. (full) ; The teacher wants us to work quietly (full) | deToEn |
| g4u07.gi.want-someone-to.tr.006 | translation | Unser Trainer will, dass wir härter trainieren. [de] | Our coach wants us to train harder. (full) ; Our coach wants us to train harder (full) | deToEn |

## Output contract

Write `content/corpus/units/g4-u07/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u07",
  "lens": "translation",
  "itemsHash": "fa13b94a59e9",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 43, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
