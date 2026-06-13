# Verify lens — translation — g2-u08 (round 2)

<!-- domigo:verify translation g2-u08 items=60f1cbb5b841 prompt=c6328b13b073 round=2 -->

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

## Vocab items (32)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u08.w.aeroplane | aeroplane | Flugzeug | aeroplane (full) ; airplane (partial) ; plane (partial) | Flugzeug (full) ; das Flugzeug (full) |
| g2u08.w.alien | alien | Außerirdische/r | alien (full) ; aliens (full) | Außerirdischer (full) ; Außerirdische (full) ; Außerirdische/r (full) |
| g2u08.w.boss | boss | Chef/Chefin | boss (full) ; bosses (full) | Chef (full) ; Chefin (full) ; Chef/Chefin (full) |
| g2u08.w.cable | cable | Kabel | cable (full) ; cables (full) | Kabel (full) ; das Kabel (full) |
| g2u08.w.calm-down | Calm down! | Beruhige dich! | Calm down (full) ; Calm down! (full) | Beruhige dich (full) ; Beruhige dich! (full) ; Beruhig dich! (full) |
| g2u08.w.capital | capital | Hauptstadt | capital (full) ; capitals (full) | Hauptstadt (full) ; die Hauptstadt (full) |
| g2u08.w.comfortable | comfortable | bequem | comfortable (full) | bequem (full) ; gemütlich (partial) |
| g2u08.w.commander | commander | Kommandant/in | commander (full) | Kommandant (full) ; Kommandantin (full) ; Kommandant/in (full) |
| g2u08.w.crew | crew | Besatzung | crew (full) ; crews (full) | Besatzung (full) ; die Besatzung (full) ; Mannschaft (partial) |
| g2u08.w.expert | expert | Experte/Expertin | expert (full) ; experts (full) | Experte (full) ; Expertin (full) ; Experte/Expertin (full) ; Fachmann (partial) |
| g2u08.w.hero-heroine | hero, heroine | Held | hero (full) ; heroine (full) | Held (full) ; Heldin (full) |
| g2u08.w.hoax | hoax | Täuschung | hoax (full) ; hoaxes (full) | Täuschung (full) ; Streich (partial) ; Schwindel (full) |
| g2u08.w.in-that-case | in that case | in diesem Fall | in that case (full) | in diesem Fall (full) ; dann (partial) |
| g2u08.w.investigation | investigation | Untersuchung | investigation (full) ; investigations (full) | Untersuchung (full) ; Ermittlung (full) ; die Untersuchung (full) |
| g2u08.w.key | key | Schlüssel | key (full) ; keys (full) | Schlüssel (full) ; der Schlüssel (full) |
| g2u08.w.machine | machine | Maschine | machine (full) ; machines (full) | Maschine (full) ; die Maschine (full) |
| g2u08.w.nonsense | nonsense | Unsinn | nonsense (full) | Unsinn (full) ; Quatsch (full) ; Blödsinn (partial) |
| g2u08.w.photograph | photograph | Foto | photograph (full) ; photo (partial) | Foto (full) ; das Foto (full) ; Fotografie (partial) |
| g2u08.w.planet | planet | Planet | planet (full) ; planets (full) | Planet (full) ; der Planet (full) |
| g2u08.w.space | space | Weltall | space (full) | Weltall (full) ; das Weltall (full) ; All (partial) |
| g2u08.w.space-centre | space centre | Raumfahrtzentrum | space centre (full) ; space center (partial) | Raumfahrtzentrum (full) ; das Raumfahrtzentrum (full) |
| g2u08.w.spaceship | spaceship | Raumschiff | spaceship (full) ; spaceships (full) | Raumschiff (full) ; das Raumschiff (full) |
| g2u08.w.spacesuit | spacesuit | Raumanzug | spacesuit (full) ; spacesuits (full) | Raumanzug (full) ; der Raumanzug (full) |
| g2u08.w.statue | statue | Statue | statue (full) ; statues (full) | Statue (full) ; die Statue (full) ; Standbild (partial) |
| g2u08.w.to-connect | to connect | verbinden | connect (full) ; to connect (full) ; join (partial) | verbinden (full) ; anschließen (full) |
| g2u08.w.to-destroy | to destroy | zerstören | destroy (full) ; to destroy (full) | zerstören (full) |
| g2u08.w.to-kidnap | to kidnap | entführen | kidnap (full) ; to kidnap (full) | entführen (full) |
| g2u08.w.to-repair | to repair | reparieren | repair (full) ; to repair (full) | reparieren (full) |
| g2u08.w.to-take-over | to take over | erobern | take over (full) ; to take over (full) | erobern (full) ; die Führung übernehmen (full) ; übernehmen (full) |
| g2u08.w.traveller | traveller | Reisender/Reisende | traveller (full) ; traveler (partial) | Reisender (full) ; Reisende (full) ; Reisender/Reisende (full) |
| g2u08.w.ufo | UFO | UFO | UFO (full) ; UFOs (full) | UFO (full) ; das UFO (full) |
| g2u08.w.visitor | visitor | Besucher/Besucherin | visitor (full) ; visitors (full) | Besucher (full) ; Besucherin (full) ; Besucher/Besucherin (full) ; Gast (partial) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u08.gi.past-time-markers.tr.001 | translation | Letzte Nacht landete ein Raumschiff in unserem Garten. [de] | Last night, a spaceship landed in our garden. (full) ; Last night a spaceship landed in our garden. (full) ; Last night, a spaceship landed in our garden (full) | deToEn |
| g2u08.gi.past-time-markers.tr.002 | translation | Dann ging er zum Raumfahrtzentrum. [de] | Then he went to the space centre. (full) ; Then, he went to the space centre. (full) ; Then he went to the space centre (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u08/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u08",
  "lens": "translation",
  "itemsHash": "60f1cbb5b841",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 34, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
