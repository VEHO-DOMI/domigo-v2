# Verify lens — translation — g2-u11 (round 2)

<!-- domigo:verify translation g2-u11 items=0d6edd9ab760 prompt=c6328b13b073 round=2 -->

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

## Vocab items (56)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u11.w.american | American | amerikanisch | American (full) | amerikanisch (full) ; Amerikaner (full) ; Amerikanerin (full) |
| g2u11.w.armchair | armchair | Sessel | armchair (full) | Sessel (full) ; Lehnstuhl (partial) |
| g2u11.w.bed | bed | Bett | bed (full) | Bett (full) |
| g2u11.w.bedside-table | bedside table | Nachttisch | bedside table (full) | Nachttisch (full) |
| g2u11.w.carpet | carpet | Teppich(boden) | carpet (full) | Teppichboden (full) ; Teppich (full) |
| g2u11.w.cellar | cellar | Keller | cellar (full) | Keller (full) |
| g2u11.w.cellar-2 | cellar | Keller | cellar (full) | Keller (full) |
| g2u11.w.central-asia | Central Asia | Zentralasien | Central Asia (full) | Zentralasien (full) ; Mittelasien (partial) |
| g2u11.w.chair | chair | Stuhl | chair (full) | Stuhl (full) |
| g2u11.w.cooker | cooker | Herd | cooker (full) | Herd (full) |
| g2u11.w.cotton | cotton | Baumwolle | cotton (full) | Baumwolle (full) |
| g2u11.w.cupboard | cupboard | Schrank | cupboard (full) | Schrank (full) ; Küchenschrank (partial) |
| g2u11.w.curtain | curtain | Vorhang | curtain (full) ; curtains (full) | Vorhang (full) ; Vorhänge (partial) |
| g2u11.w.electricity | electricity | Elektrizität | electricity (full) | Elektrizität (full) ; Strom (full) |
| g2u11.w.fridge | fridge | Kühlschrank | fridge (full) | Kühlschrank (full) |
| g2u11.w.furniture | furniture | Möbel | furniture (full) | Möbel (full) ; Möbelstücke (partial) |
| g2u11.w.ground | ground | Boden | ground (full) | Boden (full) |
| g2u11.w.hammock | hammock | Hängematte | hammock (full) | Hängematte (full) |
| g2u11.w.hers | hers | ihre/r/s (Singular) | hers (full) | ihre (full) ; ihrer (full) ; ihres (full) |
| g2u11.w.his | his | seine/r/s | his (full) | seine (full) ; seiner (full) ; seines (full) ; seins (full) |
| g2u11.w.island | island | Insel | island (full) | Insel (full) |
| g2u11.w.lamp | lamp | Lampe | lamp (full) | Lampe (full) |
| g2u11.w.leather | leather | Leder | leather (full) | Leder (full) |
| g2u11.w.material | material | Material | material (full) | Material (full) ; Stoff (partial) |
| g2u11.w.metal | metal | Metall | metal (full) | Metall (full) |
| g2u11.w.mine | mine | meine/r/s | mine (full) | meine (full) ; meiner (full) ; meines (full) ; meins (full) |
| g2u11.w.moveable | moveable | beweglich | moveable (full) ; movable (partial) | beweglich (full) |
| g2u11.w.ours | ours | unsere/r/s | ours (full) | unsere (full) ; unserer (full) ; unseres (full) ; unser (partial) |
| g2u11.w.pattern | pattern | Muster | pattern (full) | Muster (full) |
| g2u11.w.plain | plain | einfarbig | plain (full) | einfarbig (full) ; schlicht (partial) |
| g2u11.w.plastic | plastic | Plastik | plastic (full) | Plastik (full) ; Kunststoff (partial) |
| g2u11.w.pond | pond | Teich | pond (full) | Teich (full) |
| g2u11.w.radiator | radiator | Heizkörper | radiator (full) | Heizkörper (full) ; Heizung (partial) |
| g2u11.w.reed | reed | Schilf | reed (full) ; reeds (full) | Schilf (full) |
| g2u11.w.roof | roof | Dach | roof (full) | Dach (full) |
| g2u11.w.rug | rug | Teppich | rug (full) | Teppich (full) ; Vorleger (partial) |
| g2u11.w.seat | seat | (Sitz-)Platz | seat (full) | Sitzplatz (full) ; Platz (full) ; Sitz (partial) |
| g2u11.w.sink | sink | Spülbecken | sink (full) | Spülbecken (full) ; Waschbecken (partial) |
| g2u11.w.sofa | sofa | Sofa | sofa (full) | Sofa (full) ; Couch (partial) |
| g2u11.w.spotted | spotted | gepunktet | spotted (full) | gepunktet (full) ; getupft (partial) |
| g2u11.w.staircase | staircase | Treppe | staircase (full) | Treppe (full) ; Stiege (partial) |
| g2u11.w.stilts | stilts | Stelzen | stilts (full) | Stelzen (full) ; Pfähle (partial) |
| g2u11.w.strap | strap | Band | strap (full) | Band (full) ; Armband (partial) ; Riemen (partial) |
| g2u11.w.striped | striped | gestreift | striped (full) | gestreift (full) |
| g2u11.w.table | table | Tisch | table (full) | Tisch (full) |
| g2u11.w.theirs | theirs | ihre/r/s | theirs (full) | ihre (full) ; ihrer (full) ; ihres (full) |
| g2u11.w.to-float | to float | treiben | float (full) ; to float (full) | treiben (full) ; schweben (full) ; schwimmen (partial) |
| g2u11.w.to-transport | to transport | transportieren | transport (full) ; to transport (full) | transportieren (full) ; befördern (partial) |
| g2u11.w.trailer | trailer (American English) | Wohnwagen | trailer (full) ; caravan (partial) | Wohnwagen (full) |
| g2u11.w.tree-house | tree house | Baumhaus | tree house (full) ; treehouse (partial) | Baumhaus (full) |
| g2u11.w.underneath | underneath | unterhalb | underneath (full) | unterhalb (full) ; unter (full) ; darunter (full) |
| g2u11.w.wall | wall | Wand | wall (full) | Wand (full) ; Mauer (full) |
| g2u11.w.wardrobe | wardrobe | Kleiderschrank | wardrobe (full) | Kleiderschrank (full) ; Schrank (partial) |
| g2u11.w.whose | whose | wessen | whose (full) | wessen (full) |
| g2u11.w.window | window | Fenster | window (full) | Fenster (full) |
| g2u11.w.yours | yours | deine/r/s | yours (full) | deine (full) ; deiner (full) ; deines (full) ; deins (full) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u11.gi.possessive-pronouns.tr.001 | translation | Dieses Bett gehört mir. [de] | This bed is mine. (full) ; This is my bed. (partial) | deToEn |
| g2u11.gi.possessive-pronouns.tr.002 | translation | Ist dieser Rucksack deiner oder ihrer? [de] | Is this backpack yours or hers? (full) ; Is that backpack yours or hers? (full) | deToEn |
| g2u11.gi.possessive-s.tr.001 | translation | Sams Bett ist neu. [de] | Sam's bed is new. (full) | deToEn |
| g2u11.gi.possessive-s.tr.002 | translation | Das ist das Zimmer der Kinder. [de] | This is the children's room. (full) ; It's the children's room. (partial) | deToEn |
| g2u11.gi.who-whose.tr.001 | translation | Wessen Hund ist das? [de] | Whose dog is that? (full) ; Whose dog is this? (full) | deToEn |
| g2u11.gi.who-whose.tr.002 | translation | Wer hat die Vorhänge gewaschen? [de] | Who washed the curtains? (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u11/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u11",
  "lens": "translation",
  "itemsHash": "0d6edd9ab760",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 62, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
