# Verify lens — translation — g2-u03 (round 4)

<!-- domigo:verify translation g2-u03 items=8a00bfa24670 prompt=c6328b13b073 round=4 -->

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

## Vocab items (34)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u03.w.apple-bobbing | apple bobbing | Äpfeltauchen | apple bobbing (full) | Äpfeltauchen (full) ; Apfeltauchen (full) ; das Äpfeltauchen (full) |
| g2u03.w.century | century | Jahrhundert | century (full) ; a century (full) ; one hundred years (partial) ; hundred years (partial) ; 100 years (partial) | Jahrhundert (full) ; das Jahrhundert (full) ; hundert Jahre (partial) ; 100 Jahre (partial) |
| g2u03.w.costume | costume | Kostüm | costume (full) ; a costume (full) | Kostüm (full) ; das Kostüm (full) ; Verkleidung (full) |
| g2u03.w.couldn-t | couldn't | konnte/n nicht | couldn't (full) ; could not (full) ; was not able to (partial) ; wasn't able to (partial) | konnte nicht (full) ; konnten nicht (full) ; konntest nicht (full) |
| g2u03.w.cute | cute | niedlich | cute (full) ; sweet (partial) ; pretty (partial) | niedlich (full) ; süß (full) ; herzig (full) ; putzig (partial) ; hübsch (partial) |
| g2u03.w.cycle-helmet | cycle helmet | Fahrradhelm | cycle helmet (full) ; bike helmet (partial) ; helmet (partial) | Fahrradhelm (full) ; Radhelm (full) ; Helm (partial) |
| g2u03.w.dress | dress | Kleid | dress (full) ; a dress (full) | Kleid (full) ; das Kleid (full) |
| g2u03.w.front-window | front window | Vorderfenster | front window (full) ; window (partial) | Vorderfenster (full) ; vorderes Fenster (full) ; Fenster (partial) |
| g2u03.w.ghost | ghost | Geist | ghost (full) ; a ghost (full) ; ghosts (partial) | Geist (full) ; der Geist (full) ; ein Geist (full) ; Gespenst (full) ; das Gespenst (full) ; ein Gespenst (full) ; Geister (partial) |
| g2u03.w.graveyard | graveyard | Friedhof | graveyard (full) ; a graveyard (full) ; cemetery (partial) | Friedhof (full) ; der Friedhof (full) |
| g2u03.w.guys | guys | Leute | guys (full) ; people (full) ; folks (partial) | Leute (full) ; Jungs (partial) ; Freunde (partial) |
| g2u03.w.knife | knife (pl knives) | Messer | knife (full) ; a knife (full) ; knives (full) | Messer (full) ; das Messer (full) |
| g2u03.w.mask | mask | Maske | mask (full) ; a mask (full) ; masks (partial) | Maske (full) ; die Maske (full) ; eine Maske (full) ; Masken (partial) |
| g2u03.w.myself | myself | mich selbst | myself (full) ; me (partial) | mich selbst (full) ; mir selbst (full) ; mich (partial) ; mir (partial) ; ich selbst (partial) ; selbst (partial) |
| g2u03.w.picnic | picnic | Picknick | picnic (full) ; a picnic (full) | Picknick (full) ; das Picknick (full) |
| g2u03.w.pumpkin-bucket | pumpkin bucket | Kürbiseimer | pumpkin bucket (full) ; a pumpkin bucket (full) ; pumpkin buckets (partial) | Kürbiseimer (full) ; der Kürbiseimer (full) ; ein Kürbiseimer (full) ; Eimer (partial) |
| g2u03.w.shall | shall | sollen | shall (full) ; should (full) | sollen (full) ; wollen (full) |
| g2u03.w.sick | sick | übel | sick (full) ; ill (partial) | krank (full) ; übel (full) ; schlecht (partial) |
| g2u03.w.stairs | stairs | Treppe | stairs (full) ; the stairs (full) | Treppe (full) ; die Treppe (full) ; Stiege (full) ; Treppen (partial) ; Stiegen (partial) |
| g2u03.w.sticker | sticker | Aufkleber | sticker (full) ; stickers (partial) | Aufkleber (full) ; Sticker (full) ; Pickerl (partial) |
| g2u03.w.superheroine | superheroine | Superheldin | superheroine (full) ; superhero (partial) | Superheldin (full) ; Superheld (partial) ; Heldin (partial) |
| g2u03.w.sweets | sweets | Süßigkeiten | sweets (full) ; candy (partial) | Süßigkeiten (full) ; die Süßigkeiten (full) ; Süßes (full) ; Zuckerl (partial) ; Zuckerln (partial) |
| g2u03.w.to-be-proud | to be proud (of) | stolz sein (auf) | to be proud of (full) ; to be proud (full) ; be proud of (full) ; be proud (full) ; proud (partial) | stolz sein (auf) (full) ; stolz sein auf (full) ; stolz sein (full) ; auf etwas stolz sein (full) ; stolz (partial) |
| g2u03.w.to-cut-off | to cut off | abschneiden | to cut off (full) ; cut off (full) | abschneiden (full) ; wegschneiden (partial) ; schneiden (partial) |
| g2u03.w.to-fear | to fear | (sich) fürchten (vor) | to fear (full) ; fear (full) ; to be scared of (full) ; be scared of (full) ; to be scared (full) ; be scared (full) ; to be afraid of (partial) ; be afraid of (partial) ; to be afraid (partial) ; be afraid (partial) | fürchten (full) ; sich fürchten (full) ; sich fürchten vor (full) ; Angst haben vor (full) ; Angst haben (full) ; sich erschrecken (partial) ; Angst (partial) |
| g2u03.w.to-keep | to keep | (be-)halten | to keep (full) ; keep (full) ; to hold (partial) ; hold (partial) | behalten (full) ; halten (full) ; aufheben (partial) |
| g2u03.w.to-lose | to lose | verlieren | lose (full) ; to lose (full) ; lost (partial) | verlieren (full) ; verlegen (partial) |
| g2u03.w.to-scare | to scare | Angst machen | scare (full) ; to scare (full) ; frighten (partial) ; to frighten (partial) | erschrecken (full) ; jemanden erschrecken (full) ; Angst machen (full) ; jemandem Angst machen (full) |
| g2u03.w.tradition | tradition | Tradition | tradition (full) ; a tradition (full) ; traditions (partial) | Tradition (full) ; die Tradition (full) ; eine Tradition (full) ; Brauch (full) ; der Brauch (full) ; ein Brauch (full) |
| g2u03.w.trick-or-treat | trick or treat | Süßes oder Saures | trick or treat (full) ; trick-or-treat (full) | Süßes oder Saures (full) ; Süßes, sonst gibt's Saures (full) |
| g2u03.w.trick-or-treat-2 | Trick or treat! | Süßes oder Saures (Frage beim Halloween-Umzug) | Trick or treat! (full) ; Trick or treat (full) ; trick or treat (full) ; trick or treating (partial) | Süßes oder Saures (full) ; Süßes oder Saures! (full) ; Süßes, sonst gibt's Saures (partial) ; Streich oder Süßes (partial) |
| g2u03.w.vampire | vampire | Vampir | vampire (full) ; a vampire (full) ; vampires (partial) | Vampir (full) ; der Vampir (full) ; ein Vampir (full) ; Vampire (partial) |
| g2u03.w.wild | wild | wild | wild (full) ; crazy (partial) ; mad (partial) | wild (full) ; verrückt (partial) |
| g2u03.w.witch | witch | Hexe | witch (full) ; a witch (full) ; witches (partial) | Hexe (full) ; die Hexe (full) ; eine Hexe (full) ; Hexen (partial) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u03.gi.should.tr.001 | translation | Du solltest immer mit Freunden gehen. [de] | You should always go with friends. (full) ; You should always go with friends (full) ; You should always go with your friends. (partial) ; You should always go with your friends (partial) | deToEn |
| g2u03.gi.should.tr.002 | translation | Lara sollte nicht so viele Süßigkeiten essen. [de] | Lara shouldn't eat so many sweets. (full) ; Lara shouldn't eat so many sweets (full) ; Lara should not eat so many sweets. (full) ; Lara should not eat so many sweets (full) ; Lara shouldn't have so many sweets. (partial) ; Lara shouldn't have so many sweets (partial) ; Lara shouldn't eat so much candy. (partial) ; Lara shouldn't eat so much candy (partial) ; Lara shouldn't eat so many candies. (partial) ; Lara should not eat so much candy. (partial) ; Lara should not eat so many candies. (partial) | deToEn |
| g2u03.gi.should.tr.003 | translation | What should I do? [en] | Was soll ich tun? (full) ; Was soll ich tun (full) ; Was soll ich machen? (full) ; Was soll ich machen (full) ; Was sollte ich tun? (full) ; Was sollte ich tun (full) ; Was sollte ich machen? (full) ; Was sollte ich machen (full) | enToDe |

## Output contract

Write `content/corpus/units/g2-u03/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u03",
  "lens": "translation",
  "itemsHash": "8a00bfa24670",
  "promptHash": "c6328b13b073",
  "round": 4,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 37, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
