# Verify lens — translation — g1-u03 (round 1)

<!-- domigo:verify translation g1-u03 items=ba126dc65b37 prompt=c6328b13b073 round=1 -->

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

## Vocab items (42)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u03.w.again | again | wieder | again (full) | wieder (full) ; nochmal (full) ; noch einmal (full) |
| g1u03.w.also | also | auch | also (full) ; too (full) | auch (full) |
| g1u03.w.back | back | zurück | back (full) | zurück (full) |
| g1u03.w.beard | beard | Bart | beard (full) | Bart (full) |
| g1u03.w.big | big | groß | big (full) | groß (full) |
| g1u03.w.boy | boy | Junge | boy (full) | Junge (full) ; Bub (full) |
| g1u03.w.captain | captain | Kapitän/Kapitänin | captain (full) | Kapitän (full) ; Kapitänin (full) |
| g1u03.w.ear | ear | Ohr | ear (full) ; ears (full) | Ohr (full) ; Ohren (full) |
| g1u03.w.eye | eye | Auge | eye (full) ; eyes (full) | Auge (full) ; Augen (full) |
| g1u03.w.famous | famous | berühmt | famous (full) | berühmt (full) |
| g1u03.w.feet | feet | Füße | feet (full) | Füße (full) |
| g1u03.w.finger | finger | Finger | finger (full) ; fingers (full) | Finger (full) |
| g1u03.w.foot | foot | Fuß | foot (full) | Fuß (full) |
| g1u03.w.girl | girl | Mädchen | girl (full) | Mädchen (full) |
| g1u03.w.hair | hair | Haar(e) | hair (full) | Haare (full) ; Haar (full) |
| g1u03.w.have-got-has-got | have got / has got | haben | have got (full) ; has got (full) | haben (full) |
| g1u03.w.her-name-is | Her name is … | Sie heißt … | Her name is (full) | Sie heißt (full) |
| g1u03.w.him | him | ihn | him (full) | ihn (full) ; ihm (partial) |
| g1u03.w.his | his | sein/e | his (full) | sein (full) ; seine (full) |
| g1u03.w.his-name-is | His name is … | Er heißt … | His name is (full) | Er heißt (full) ; Sein Name ist (full) |
| g1u03.w.left-arm | left arm | linker Arm | left arm (full) | linker Arm (full) ; der linke Arm (full) |
| g1u03.w.leg | leg | Bein | leg (full) ; legs (full) | Bein (full) ; Beine (full) |
| g1u03.w.long | long | lang | long (full) | lang (full) |
| g1u03.w.man | man (pl men) | Mann | man (full) ; men (full) | Mann (full) ; Männer (full) |
| g1u03.w.mouth | mouth | Mund | mouth (full) | Mund (full) |
| g1u03.w.nose | nose | Nase | nose (full) | Nase (full) |
| g1u03.w.pretty | pretty | hübsch | pretty (full) | hübsch (full) ; schön (partial) |
| g1u03.w.purple | purple | lila | purple (full) ; violet (partial) | lila (full) ; violett (full) |
| g1u03.w.right-arm | right arm | rechter Arm | right arm (full) | rechter Arm (full) ; der rechte Arm (full) |
| g1u03.w.ship | ship | Schiff | ship (full) ; boat (partial) | Schiff (full) |
| g1u03.w.short | short | kurz | short (full) | kurz (full) ; klein (full) |
| g1u03.w.shoulder | shoulder | Schulter | shoulder (full) | Schulter (full) |
| g1u03.w.sister | sister | Schwester | sister (full) | Schwester (full) |
| g1u03.w.small | small | klein | small (full) | klein (full) |
| g1u03.w.strong | strong | stark | strong (full) | stark (full) |
| g1u03.w.tall | tall | groß | tall (full) | groß (full) |
| g1u03.w.teeth | teeth | Zähne | teeth (full) | Zähne (full) |
| g1u03.w.to-be-scared | to be scared (of) | Angst haben (vor) | to be scared (full) ; be scared (full) ; scared (full) ; to be scared of (full) | Angst haben (full) ; Angst haben vor (full) ; sich fürchten (partial) |
| g1u03.w.to-paint | to paint | malen | to paint (full) ; paint (full) | malen (full) ; anmalen (full) |
| g1u03.w.tooth | tooth | Zahn | tooth (full) | Zahn (full) |
| g1u03.w.week | week | Woche | week (full) | Woche (full) |
| g1u03.w.woman | woman (pl women) | Frau | woman (full) ; women (full) | Frau (full) ; Frauen (full) |

## Grammar items (5 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u03.gi.have-got.tr.001 | translation | Ich habe einen Hut. [de] | I have got a hat. (full) ; I've got a hat. (full) ; I have a hat. (partial) | deToEn |
| g1u03.gi.have-got.tr.003 | translation | She has got purple hair. [en] | Sie hat lila Haare. (full) ; Sie hat violette Haare. (full) ; Sie hat purpurne Haare. (partial) | enToDe |
| g1u03.gi.have-got.tr.004 | translation | Hat er einen Hund? — Nein, er hat keinen. [de] | Has he got a dog? — No, he hasn't. (full) ; Has he got a dog? — No, he has not. (full) | deToEn |
| g1u03.gi.irregular-plurals-2.tr.001 | translation | Ich habe zwei Füße. [de] | I have got two feet. (full) ; I have two feet. (partial) | deToEn |
| g1u03.gi.irregular-plurals-2.tr.002 | translation | Der Kapitän hat fünf Zähne. [de] | The captain has got five teeth. (full) ; The captain has five teeth. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u03/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u03",
  "lens": "translation",
  "itemsHash": "ba126dc65b37",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 47, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
