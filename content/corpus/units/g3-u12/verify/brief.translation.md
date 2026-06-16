# Verify lens — translation — g3-u12 (round 2)

<!-- domigo:verify translation g3-u12 items=ecaadbc4ea55 prompt=c6328b13b073 round=2 -->

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

## Vocab items (50)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u12.w.ash | ash | Asche | ash (full) | Asche (full) ; die Asche (full) |
| g3u12.w.avalanche | avalanche | Lawine | avalanche (full) ; an avalanche (full) | Lawine (full) ; die Lawine (full) |
| g3u12.w.border | border | Grenze | border (full) ; the border (full) | Grenze (full) ; die Grenze (full) |
| g3u12.w.castaway | castaway | Schiffbrüchiger/Schiffbrüchige | castaway (full) ; a castaway (full) | Schiffbrüchiger (full) ; Schiffbrüchige (full) ; ein Schiffbrüchiger (partial) |
| g3u12.w.damage | damage | Schaden | damage (full) | Schaden (full) ; der Schaden (full) ; Schäden (partial) |
| g3u12.w.delivery-company | delivery company | Zustelldienst | delivery company (full) ; a delivery company (full) | Zustelldienst (full) ; der Zustelldienst (full) ; Lieferdienst (full) ; Paketdienst (partial) |
| g3u12.w.desert-island | desert island | einsame Insel | desert island (full) ; a desert island (full) | einsame Insel (full) ; eine einsame Insel (full) ; verlassene Insel (partial) |
| g3u12.w.drought | drought | Dürre | drought (full) ; a drought (full) | Dürre (full) ; die Dürre (full) ; Trockenheit (partial) |
| g3u12.w.earthquake | earthquake | Erdbeben | earthquake (full) ; an earthquake (full) | Erdbeben (full) ; das Erdbeben (full) |
| g3u12.w.escape-route | escape route | Fluchtweg | escape route (full) ; an escape route (full) | Fluchtweg (full) ; der Fluchtweg (full) |
| g3u12.w.fire-drill | fire drill | Feueralarm-Übung | fire drill (full) ; a fire drill (full) | Feueralarm-Übung (full) ; Feuerübung (partial) ; Probealarm (partial) |
| g3u12.w.flame | flame | Flamme | flame (full) ; a flame (full) | Flamme (full) ; die Flamme (full) |
| g3u12.w.flood | flood | Überschwemmung | flood (full) ; a flood (full) | Überschwemmung (full) ; die Überschwemmung (full) ; Flut (partial) |
| g3u12.w.forest-fire | forest fire | Waldbrand | forest fire (full) ; a forest fire (full) | Waldbrand (full) ; der Waldbrand (full) |
| g3u12.w.hometown | hometown | Heimatstadt | hometown (full) | Heimatstadt (full) ; die Heimatstadt (full) ; Heimatort (partial) |
| g3u12.w.hurricane | hurricane | Hurrikan | hurricane (full) ; a hurricane (full) | Hurrikan (full) ; der Hurrikan (full) ; Wirbelsturm (partial) |
| g3u12.w.in-case-of | in case of | im Falle von | in case of (full) | im Falle von (full) ; im Fall von (full) ; bei (partial) |
| g3u12.w.joy | joy | Freude | joy (full) | Freude (full) ; die Freude (full) |
| g3u12.w.lighter | lighter | Feuerzeug | lighter (full) ; a lighter (full) | Feuerzeug (full) ; das Feuerzeug (full) |
| g3u12.w.meeting-place | meeting place | Treffpunkt | meeting place (full) ; a meeting place (full) | Treffpunkt (full) ; der Treffpunkt (full) |
| g3u12.w.miracle | miracle | Wunder | miracle (full) ; a miracle (full) | Wunder (full) ; das Wunder (full) |
| g3u12.w.mudslide | mudslide | Schlammlawine | mudslide (full) ; a mudslide (full) | Schlammlawine (full) ; die Schlammlawine (full) ; Mure (partial) |
| g3u12.w.parcel | parcel | Paket | parcel (full) ; a parcel (full) | Paket (full) ; das Paket (full) ; Päckchen (partial) |
| g3u12.w.pleasure | pleasure (no pl) | Freude | pleasure (full) ; a pleasure (full) | Freude (full) ; Vergnügen (full) ; das Vergnügen (partial) |
| g3u12.w.pressure | pressure | Druck | pressure (full) | Druck (full) ; der Druck (full) |
| g3u12.w.raft | raft | Floß | raft (full) ; a raft (full) | Floß (full) ; das Floß (full) |
| g3u12.w.region | region | Region | region (full) ; a region (full) | Region (full) ; die Region (full) ; Gebiet (full) |
| g3u12.w.research | research | Forschung | research (full) | Forschung (full) ; die Forschung (full) ; Recherche (full) |
| g3u12.w.shelter | shelter | Unterschlupf | shelter (full) ; a shelter (full) | Unterschlupf (full) ; Unterkunft (full) ; der Unterschlupf (partial) |
| g3u12.w.smoke-detector | smoke detector | Rauchmelder | smoke detector (full) ; a smoke detector (full) | Rauchmelder (full) ; der Rauchmelder (full) |
| g3u12.w.surface | surface | Oberfläche | surface (full) ; the surface (full) | Oberfläche (full) ; die Oberfläche (full) |
| g3u12.w.survival | survival | Überleben | survival (full) | Überleben (full) ; das Überleben (full) |
| g3u12.w.to-be-trapped | to be trapped | gefangen sein | be trapped (full) ; to be trapped (full) ; trapped (full) | gefangen sein (full) ; festsitzen (full) ; eingeschlossen sein (partial) |
| g3u12.w.to-check-doors | to check doors | Türen überprüfen | check doors (full) ; to check doors (full) ; check the doors (full) | Türen überprüfen (full) ; die Türen überprüfen (full) ; Türen kontrollieren (partial) |
| g3u12.w.to-collapse | to collapse | zusammenbrechen | collapse (full) ; to collapse (full) | zusammenbrechen (full) ; einstürzen (full) ; einbrechen (partial) |
| g3u12.w.to-crawl-low | to crawl low | niedrig kriechen | crawl low (full) ; to crawl low (full) | niedrig kriechen (full) ; tief kriechen (partial) ; am Boden kriechen (partial) |
| g3u12.w.to-deliver | to deliver | zustellen | deliver (full) ; to deliver (full) | zustellen (full) ; liefern (full) ; ausliefern (partial) ; bringen (partial) |
| g3u12.w.to-evacuate | to evacuate | evakuieren | evacuate (full) ; to evacuate (full) | evakuieren (full) ; in Sicherheit bringen (partial) |
| g3u12.w.to-fall-down | to fall down | hinunterfallen | fall down (full) ; to fall down (full) | hinunterfallen (full) ; umfallen (full) ; herunterfallen (partial) |
| g3u12.w.to-get-used-to | to get used to | sich an etw. gewöhnen | get used to (full) ; to get used to (full) | sich an etwas gewöhnen (full) ; sich gewöhnen an (full) |
| g3u12.w.to-keep-away-from | to keep away from | fernbleiben von | keep away from (full) ; to keep away from (full) | fernbleiben von (full) ; sich fernhalten von (full) ; wegbleiben von (partial) |
| g3u12.w.to-measure | to measure | messen | measure (full) ; to measure (full) | messen (full) ; ausmessen (partial) |
| g3u12.w.to-realise | to realise | realisieren | realise (full) ; to realise (full) ; realize (partial) | realisieren (full) ; erkennen (full) ; begreifen (partial) ; merken (partial) |
| g3u12.w.to-stop-drop-roll | to stop, drop & roll | stoppen | stop, drop and roll (full) ; stop, drop & roll (full) | stoppen, fallen und rollen (full) ; stehen bleiben, fallen und rollen (partial) |
| g3u12.w.to-turn-into | to turn into | verwandeln | turn into (full) ; to turn into (full) | sich verwandeln in (full) ; werden zu (full) ; verwandeln (partial) |
| g3u12.w.tsunami | tsunami | Tsunami | tsunami (full) ; a tsunami (full) | Tsunami (full) ; der Tsunami (full) ; Flutwelle (partial) |
| g3u12.w.underneath | underneath | unter | underneath (full) ; under (partial) ; below (partial) | unter (full) ; darunter (full) ; unterhalb (partial) |
| g3u12.w.undersea | undersea | unter Wasser | undersea (full) ; underwater (partial) | unter Wasser (full) ; unterseeisch (partial) ; im Meer (partial) |
| g3u12.w.violent | violent | gewalttätig | violent (full) | gewalttätig (full) ; heftig (partial) ; brutal (partial) |
| g3u12.w.volcanic-eruption | volcanic eruption | Vulkanausbruch | volcanic eruption (full) ; a volcanic eruption (full) | Vulkanausbruch (full) ; der Vulkanausbruch (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u12.gi.passive-voice.tr.001 | translation | Übersetze ins Englische: 'Hunderte Menschen wurden gerettet.' [de] | Hundreds of people were rescued. (full) ; Hundreds of people were saved. (partial) | deToEn |
| g3u12.gi.passive-voice.tr.002 | translation | Übersetze ins Englische: 'Die Stadt wurde durch ein Erdbeben zerstört.' [de] | The city was destroyed by an earthquake. (full) ; The town was destroyed by an earthquake. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g3-u12/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u12",
  "lens": "translation",
  "itemsHash": "ecaadbc4ea55",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 52, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
