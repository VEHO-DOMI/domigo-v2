# Verify lens — translation — g2-u14 (round 1)

<!-- domigo:verify translation g2-u14 items=3b3f1280995c prompt=c6328b13b073 round=1 -->

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
| g2u14.w.challenge | challenge | Herausforderung | challenge (full) | Herausforderung (full) |
| g2u14.w.competition | competition | Wettbewerb | competition (full) | Wettbewerb (full) ; Wettkampf (full) |
| g2u14.w.cycling | cycling | Radfahren | cycling (full) | Radfahren (full) ; Rad fahren (full) |
| g2u14.w.distance | distance | Distanz | distance (full) | Distanz (full) ; Abstand (full) ; Entfernung (full) |
| g2u14.w.equipment | equipment | Ausrüstung | equipment (full) | Ausrüstung (full) |
| g2u14.w.extreme | extreme | extrem | extreme (full) | extrem (full) |
| g2u14.w.flood | flood | Flut | flood (full) | Flut (full) ; Überschwemmung (full) ; Hochwasser (full) |
| g2u14.w.ice-skating | ice skating | Eislaufen | ice skating (full) ; ice-skating (full) | Eislaufen (full) ; Schlittschuhlaufen (full) |
| g2u14.w.member | member | Mitglied | member (full) | Mitglied (full) |
| g2u14.w.mountain-biking | mountain biking | Mountainbiken | mountain biking (full) ; mountain-biking (full) | Mountainbiken (full) ; Mountainbike fahren (full) |
| g2u14.w.mountain-climbing | mountain climbing | Bergsteigen | mountain climbing (full) ; mountain-climbing (full) | Bergsteigen (full) ; Klettern (partial) |
| g2u14.w.nil | nil | null | nil (full) ; zero (partial) | null (full) |
| g2u14.w.official | official | offiziell | official (full) | offiziell (full) |
| g2u14.w.on-one-s-own | on one's own | alleine | on one's own (full) ; on my own (full) ; alone (partial) | alleine (full) ; allein (full) ; für sich (partial) |
| g2u14.w.professional | professional | professionell | professional (full) | professionell (full) ; hauptberuflich (partial) ; Profi- (partial) |
| g2u14.w.race | race | Rennen | race (full) | Rennen (full) ; Wettfahrt (full) ; Wettrennen (full) |
| g2u14.w.rather | rather | ziemlich | rather (full) | ziemlich (full) ; eher (full) |
| g2u14.w.roller-skating | roller-skating | Rollschuhlaufen | roller-skating (full) ; roller skating (full) | Rollschuhlaufen (full) ; Rollschuh fahren (full) |
| g2u14.w.serious | serious | ernst(haft) | serious (full) | ernst (full) ; ernsthaft (full) ; schlimm (full) ; gravierend (full) |
| g2u14.w.skateboarding | skateboarding | Skateboardfahren | skateboarding (full) | Skateboardfahren (full) ; Skateboard fahren (full) |
| g2u14.w.skiing | skiing | Skifahren | skiing (full) | Skifahren (full) ; Ski fahren (full) |
| g2u14.w.snowboarding | snowboarding | Snowboarden | snowboarding (full) | Snowboarden (full) ; Snowboard fahren (full) |
| g2u14.w.sportsman-and-sportswoman | sportsman and sportswoman | Sportler und Sportlerin | sportsman (full) ; sportswoman (full) ; sportsman and sportswoman (full) | Sportler (full) ; Sportlerin (full) ; Sportler und Sportlerin (full) |
| g2u14.w.success | success | Erfolg | success (full) | Erfolg (full) |
| g2u14.w.surfing | surfing | Surfen | surfing (full) | Surfen (full) ; Wellenreiten (full) |
| g2u14.w.swimming | swimming | Schwimmen | swimming (full) | Schwimmen (full) |
| g2u14.w.to-appear | to appear | erscheinen | appear (full) ; to appear (full) | erscheinen (full) ; auftreten (full) ; auftauchen (full) |
| g2u14.w.to-grow-up | to grow up | aufwachsen | grow up (full) ; to grow up (full) | erwachsen werden (full) ; aufwachsen (full) ; groß werden (full) |
| g2u14.w.to-manage | to manage | etw. schaffen | manage (full) ; to manage (full) | schaffen (full) ; etwas schaffen (full) ; hinbekommen (full) |
| g2u14.w.to-score | to score | erzielen (Tore) | score (full) ; to score (full) | erzielen (full) ; ein Tor erzielen (full) ; erreichen (full) ; punkten (full) |
| g2u14.w.to-snorkel | to snorkel | schnorcheln | snorkel (full) ; to snorkel (full) | schnorcheln (full) |
| g2u14.w.to-tackle | to tackle | attackieren (im Sport) | tackle (full) ; to tackle (full) | attackieren (full) ; angreifen (full) ; tackeln (full) |
| g2u14.w.to-take-part | to take part (in) | an etw. teilnehmen | take part (full) ; to take part (full) ; take part in (full) | teilnehmen (full) ; an etwas teilnehmen (full) ; mitmachen (full) |
| g2u14.w.waste-of-time | waste of time | Zeitverschwendung | waste of time (full) | Zeitverschwendung (full) |
| g2u14.w.windsurfing | windsurfing | Windsurfen | windsurfing (full) | Windsurfen (full) ; Windsurfing (full) |
| g2u14.w.without | without | ohne | without (full) | ohne (full) |
| g2u14.w.world-record | world record | Weltrekord | world record (full) | Weltrekord (full) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u14.gi.present-perfect-already-yet.tr.001 | translation | Sie hat schon drei Wettkämpfe gewonnen. [de] | She has already won three competitions. (full) ; She's already won three competitions. (full) | deToEn |
| g2u14.gi.present-perfect-already-yet.tr.002 | translation | Er war noch nicht bei einem Wettkampf. [de] | He hasn't been to a competition yet. (full) ; He has not been to a competition yet. (full) | deToEn |
| g2u14.gi.present-perfect-ever-never.tr.001 | translation | Ich habe noch nie berühmte Leute getroffen. [de] | I have never met famous people. (full) ; I've never met famous people. (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u14/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u14",
  "lens": "translation",
  "itemsHash": "3b3f1280995c",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 40, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
