# Verify lens — translation — g4-u12 (round 1)

<!-- domigo:verify translation g4-u12 items=21864bde9cfd prompt=c6328b13b073 round=1 -->

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

## Vocab items (36)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g4u12.w.advert | advert | Reklame | advert (full) ; advertisement (full) ; an advert (full) ; ad (partial) | Reklame (full) ; Anzeige (full) ; Werbung (full) ; eine Anzeige (full) |
| g4u12.w.altogether | altogether | insgesamt | altogether (full) ; in all (partial) | insgesamt (full) ; alles in allem (partial) |
| g4u12.w.asteroid | asteroid | Asteroid | asteroid (full) ; an asteroid (full) ; asteroids (full) | Asteroid (full) ; ein Asteroid (full) ; Asteroiden (full) |
| g4u12.w.astronaut | astronaut | Astronaut/in | astronaut (full) ; an astronaut (full) ; astronauts (full) | Astronaut (full) ; Astronautin (full) ; ein Astronaut (full) ; Astronauten (full) |
| g4u12.w.atmosphere | atmosphere | Atmosphäre | atmosphere (full) ; an atmosphere (full) ; the atmosphere (full) | Atmosphäre (full) ; die Atmosphäre (full) ; Lufthülle (partial) |
| g4u12.w.biosphere | biosphere | Lebensraum | biosphere (full) ; a biosphere (full) | Lebensraum (full) ; Biosphäre (full) ; die Biosphäre (full) |
| g4u12.w.celebrate | celebrate | feiern | celebrate (full) ; to celebrate (full) | feiern (full) |
| g4u12.w.commander | commander | Kommandant/in | commander (full) ; a commander (full) ; the commander (full) | Kommandant (full) ; Kommandantin (full) ; der Kommandant (full) |
| g4u12.w.commercial | commercial | kommerziell | commercial (full) | kommerziell (full) ; geschäftlich (partial) |
| g4u12.w.crew | crew | Mannschaft | crew (full) ; a crew (full) ; the crew (full) | Mannschaft (full) ; Besatzung (full) ; die Mannschaft (full) ; die Besatzung (full) |
| g4u12.w.demand | demand | verlangen | demand (full) ; to demand (full) | verlangen (full) ; fordern (full) |
| g4u12.w.depressed | depressed | deprimiert | depressed (full) | deprimiert (full) ; niedergeschlagen (partial) |
| g4u12.w.disgusting | disgusting | ekelhaft | disgusting (full) ; revolting (partial) | ekelhaft (full) ; eklig (full) ; widerlich (full) |
| g4u12.w.disturb | disturb | stören | disturb (full) ; to disturb (full) ; interrupt (partial) | stören (full) |
| g4u12.w.engineering | engineering | Maschinenbau | engineering (full) | Maschinenbau (full) ; Ingenieurswesen (full) ; Technik (partial) |
| g4u12.w.explosion | explosion | Explosion | explosion (full) ; an explosion (full) ; explosions (full) | Explosion (full) ; eine Explosion (full) ; Explosionen (full) |
| g4u12.w.genetic-engineering | genetic engineering | Gentechnik | genetic engineering (full) | Gentechnik (full) ; die Gentechnik (full) ; Gentechnologie (full) |
| g4u12.w.gravity | gravity | Schwerkraft | gravity (full) | Schwerkraft (full) ; die Schwerkraft (full) ; Gravitation (full) |
| g4u12.w.mankind | mankind | Menschheit | mankind (full) ; humankind (partial) ; humanity (partial) | Menschheit (full) ; die Menschheit (full) |
| g4u12.w.masterpiece | masterpiece | Meisterwerk | masterpiece (full) ; a masterpiece (full) | Meisterwerk (full) ; ein Meisterwerk (full) |
| g4u12.w.multibillion | multibillion | Multimilliarden- | multibillion (full) | Multimilliarden- (full) ; milliardenschwer (partial) |
| g4u12.w.neither-nor | neither ... nor | weder ... noch | neither ... nor (full) ; neither nor (full) | weder ... noch (full) ; weder noch (full) |
| g4u12.w.orbit | orbit | Umlaufbahn | orbit (full) ; an orbit (full) ; orbits (full) | Umlaufbahn (full) ; eine Umlaufbahn (full) ; Umlaufbahnen (full) |
| g4u12.w.plaque | plaque | Plakette | plaque (full) ; a plaque (full) ; plaques (full) | Plakette (full) ; eine Plakette (full) ; Plaketten (full) ; Gedenktafel (partial) |
| g4u12.w.privately-owned | privately owned | im Privatbesitz befindlich | privately owned (full) | im Privatbesitz befindlich (full) ; in Privatbesitz (full) ; privat (partial) |
| g4u12.w.reply | reply | antworten | reply (full) ; to reply (full) ; answer (full) ; respond (partial) | antworten (full) ; erwidern (full) |
| g4u12.w.resource | resource | Quelle | resource (full) ; a resource (full) ; resources (full) | Quelle (full) ; Rohstoff (full) ; Mittel (full) |
| g4u12.w.space-shuttle | space shuttle | Raumfähre | space shuttle (full) ; a space shuttle (full) ; space shuttles (full) | Raumfähre (full) ; eine Raumfähre (full) ; Raumfähren (full) |
| g4u12.w.space-travel | space travel | Raumfahrt | space travel (full) | Raumfahrt (full) ; die Raumfahrt (full) ; Weltraumfahrt (full) |
| g4u12.w.spacecraft | spacecraft | Raumfahrzeug | spacecraft (full) ; a spacecraft (full) | Raumfahrzeug (full) ; ein Raumfahrzeug (full) ; Raumfahrzeuge (full) |
| g4u12.w.sunrise | sunrise | Sonnenaufgang | sunrise (full) ; a sunrise (full) ; sunrises (full) | Sonnenaufgang (full) ; der Sonnenaufgang (full) ; Sonnenaufgänge (full) |
| g4u12.w.sunset | sunset | Sonnenuntergang | sunset (full) ; a sunset (full) ; sunsets (full) | Sonnenuntergang (full) ; der Sonnenuntergang (full) ; Sonnenuntergänge (full) |
| g4u12.w.surface | surface | Oberfläche | surface (full) ; the surface (full) ; surfaces (full) | Oberfläche (full) ; die Oberfläche (full) |
| g4u12.w.tiring | tiring | ermüdend | tiring (full) | ermüdend (full) ; anstrengend (full) |
| g4u12.w.uninhabitable | uninhabitable | unbewohnbar | uninhabitable (full) | unbewohnbar (full) |
| g4u12.w.warning | warning | Warnung | warning (full) ; a warning (full) ; warnings (full) | Warnung (full) ; eine Warnung (full) ; Warnungen (full) |

## Grammar items (7 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g4u12.gi.phrasal-verbs.tr.001 | translation | Zieh deinen Raumanzug an! [de] | Put on your spacesuit! (full) ; Put your spacesuit on! (full) | deToEn |
| g4u12.gi.phrasal-verbs.tr.002 | translation | Wer passt auf den Hund auf, während ich weg bin? [de] | Who looks after the dog while I'm away? (full) ; Who looks after the dog while I am away? (full) ; Who is looking after the dog while I'm away? (partial) | deToEn |
| g4u12.gi.phrasal-verbs.tr.003 | translation | Wir haben kein Essen mehr. Wir müssen zurück zur Erde. [de] | We have run out of food. We must go back to Earth. (full) ; We've run out of food. We must go back to Earth. (full) ; We have run out of food. We have to go back to Earth. (partial) | deToEn |
| g4u12.gi.phrasal-verbs.tr.004 | translation | Don't give up, astronaut! [en] | Gib nicht auf, Astronaut! (full) ; Gib nicht auf, Astronautin! (full) | enToDe |
| g4u12.gi.phrasal-verbs.tr.005 | translation | The space shuttle took a long time to take off. [en] | Die Raumfähre brauchte lange, um abzuheben. (full) ; Das Space Shuttle brauchte lange, um abzuheben. (partial) | enToDe |
| g4u12.gi.phrasal-verbs.tr.006 | translation | Die Mannschaft brach früh zum Mond auf. [de] | The crew set off for the moon early. (full) ; The crew set off early for the moon. (full) | deToEn |
| g4u12.gi.phrasal-verbs.tr.007 | translation | Mach weiter! Du kannst es schaffen. [de] | Carry on! You can do it. (full) ; Carry on! You can do this. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g4-u12/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g4-u12",
  "lens": "translation",
  "itemsHash": "21864bde9cfd",
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
