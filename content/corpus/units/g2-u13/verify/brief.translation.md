# Verify lens — translation — g2-u13 (round 1)

<!-- domigo:verify translation g2-u13 items=376ee6dc23ce prompt=c6328b13b073 round=1 -->

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

## Vocab items (53)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u13.w.average | average | durchschnittlich | average (full) | durchschnittlich (full) ; Durchschnitts- (partial) |
| g2u13.w.axe | axe | Axt | axe (full) | Axt (full) |
| g2u13.w.below | below | unter(-halb) | below (full) | unter (full) ; unterhalb (full) |
| g2u13.w.binoculars | binoculars | Fernglas | binoculars (full) | Fernglas (full) |
| g2u13.w.bright | bright | hell | bright (full) | hell (full) |
| g2u13.w.career | career | Karriere | career (full) | Karriere (full) ; Laufbahn (full) |
| g2u13.w.cloudy | cloudy | bewölkt | cloudy (full) | bewölkt (full) ; wolkig (partial) |
| g2u13.w.coast | coast | Küste | coast (full) | Küste (full) |
| g2u13.w.cold | cold | kalt | cold (full) | kalt (full) |
| g2u13.w.cool | cool | kühl | cool (full) | kühl (full) |
| g2u13.w.degree | degree | Grad (°) | degree (full) ; degrees (full) | Grad (full) |
| g2u13.w.dry | dry | trocken | dry (full) | trocken (full) |
| g2u13.w.flash-of-light | flash of light | Lichtblitz | flash of light (full) | Lichtblitz (full) ; Blitz (partial) |
| g2u13.w.fog | fog | Nebel | fog (full) | Nebel (full) |
| g2u13.w.foggy | foggy | neblig | foggy (full) | neblig (full) |
| g2u13.w.forecast | forecast | Vorhersage | forecast (full) | Vorhersage (full) ; Wettervorhersage (full) |
| g2u13.w.formula | formula | Formel | formula (full) | Formel (full) |
| g2u13.w.generally | generally | im Allgemeinen | generally (full) ; usually (full) | im Allgemeinen (full) ; meistens (full) |
| g2u13.w.have-a-nice-day | Have a nice day! | Einen schönen Tag noch! | Have a nice day! (full) | Einen schönen Tag noch! (full) ; Schönen Tag noch! (full) |
| g2u13.w.heavy-rain | heavy rain | starker Regen | heavy rain (full) | starker Regen (full) |
| g2u13.w.hope | hope | Hoffnung | hope (full) | Hoffnung (full) |
| g2u13.w.hot | hot | heiß | hot (full) | heiß (full) |
| g2u13.w.inch | inch (pl inches) | Zoll | inch (full) ; inches (full) | Zoll (full) |
| g2u13.w.mild | mild | mild | mild (full) | mild (full) |
| g2u13.w.mile | mile | Meile (= 1,6 Kilometer) | mile (full) | Meile (full) |
| g2u13.w.outlook | outlook | Aussicht | outlook (full) | Aussicht (full) ; Ausblick (full) |
| g2u13.w.rainfall | rainfall | Niederschlag | rainfall (full) | Niederschlag (full) ; Regenmenge (full) |
| g2u13.w.rainy | rainy | regnerisch | rainy (full) | regnerisch (full) |
| g2u13.w.scale | scale | Skala | scale (full) | Skala (full) ; Maßstab (full) |
| g2u13.w.sea-level | sea level | Meeresspiegel | sea level (full) | Meeresspiegel (full) |
| g2u13.w.small-talk | small talk | Plauderei | small talk (full) | Plauderei (full) ; Small Talk (full) |
| g2u13.w.snowy | snowy | verschneit | snowy (full) | verschneit (full) ; schneereich (full) |
| g2u13.w.sunny | sunny | sonnig | sunny (full) | sonnig (full) |
| g2u13.w.sunshine | sunshine | Sonnenschein | sunshine (full) | Sonnenschein (full) |
| g2u13.w.tan | tan | (Sonnen-)Bräune | tan (full) | Bräune (full) ; Sonnenbräune (full) |
| g2u13.w.temperature | temperature | Temperatur | temperature (full) | Temperatur (full) |
| g2u13.w.thick | thick | dicht | thick (full) | dicht (full) ; dick (full) |
| g2u13.w.throughout-the-year | throughout the year | das ganze Jahr (über) | throughout the year (full) | das ganze Jahr über (full) ; das ganze Jahr (full) |
| g2u13.w.thunderstorm | thunderstorm | Gewitter | thunderstorm (full) | Gewitter (full) |
| g2u13.w.to-be-mad-about-sth | to be mad about sth. | für etw. schwärmen | be mad about (full) ; to be mad about (full) ; mad about (partial) | für etwas schwärmen (full) ; verrückt nach etwas sein (full) |
| g2u13.w.to-clear-up | to clear up | aufheitern | clear up (full) ; to clear up (full) | aufheitern (full) ; aufklaren (partial) |
| g2u13.w.to-continue | to continue | andauern | continue (full) ; to continue (full) | andauern (full) ; weitergehen (full) |
| g2u13.w.to-earn | to earn | (Geld) verdienen | earn (full) ; to earn (full) | verdienen (full) ; Geld verdienen (full) |
| g2u13.w.to-give-way | to give way | Platz machen | give way (full) ; to give way (full) | Platz machen (full) ; weichen (partial) |
| g2u13.w.to-make-sure | to make sure | darauf achten | make sure (full) ; to make sure (full) | darauf achten (full) ; sich vergewissern (full) ; dafür sorgen (partial) |
| g2u13.w.to-record | to record | aufzeichnen | record (full) ; to record (full) | aufzeichnen (full) ; festhalten (partial) |
| g2u13.w.to-rise | to rise | (an-)steigen | rise (full) ; to rise (full) | ansteigen (full) ; steigen (full) |
| g2u13.w.to-shine | to shine | scheinen | shine (full) ; to shine (full) | scheinen (full) ; leuchten (partial) |
| g2u13.w.towards | towards | in Richtung | towards (full) | in Richtung (full) ; gegen (partial) |
| g2u13.w.weather-presenter-meteorologist | weather presenter / meteorologist | Wettermoderator/in / Meteorologe/Meteorologin | weather presenter (full) ; meteorologist (full) | Wettermoderator (full) ; Wettermoderatorin (full) ; Meteorologe (full) ; Meteorologin (full) |
| g2u13.w.western | western | westlich | western (full) | westlich (full) ; West- (partial) |
| g2u13.w.wet | wet | nass | wet (full) | nass (full) |
| g2u13.w.windy | windy | windig | windy (full) | windig (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u13.gi.adverbs-manner.tr.001 | translation | Er spricht sehr leise. [de] | He speaks very quietly. (full) ; He talks very quietly. (partial) | deToEn |
| g2u13.gi.adverbs-manner.tr.002 | translation | Er liest sehr gut. [de] | He reads very well. (full) ; He can read very well. (partial) | deToEn |
| g2u13.gi.will-future.tr.001 | translation | Ich werde dir helfen. [de] | I will help you. (full) ; I'll help you. (full) | deToEn |
| g2u13.gi.will-future.tr.002 | translation | Er wird morgen nicht kommen. [de] | He won't come tomorrow. (full) ; He will not come tomorrow. (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u13/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u13",
  "lens": "translation",
  "itemsHash": "376ee6dc23ce",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 57, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
