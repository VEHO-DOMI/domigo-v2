# Verify lens — translation — g2-u09 (round 2)

<!-- domigo:verify translation g2-u09 items=701ca1d81149 prompt=c6328b13b073 round=2 -->

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
| g2u09.w.actor-actress | actor, actress | Schauspieler | actor (full) ; actress (full) | Schauspieler (full) ; Schauspielerin (full) ; der Schauspieler (full) ; die Schauspielerin (full) |
| g2u09.w.apple-juice | apple juice | Apfelsaft | apple juice (full) | Apfelsaft (full) ; der Apfelsaft (full) |
| g2u09.w.beef | beef | Rindfleisch | beef (full) | Rindfleisch (full) ; das Rindfleisch (full) ; Rind (partial) |
| g2u09.w.cabbage | cabbage | Kohl | cabbage (full) | Kohl (full) ; der Kohl (full) ; Kraut (partial) |
| g2u09.w.certain | certain | sicher | certain (full) ; sure (partial) | sicher (full) ; gewiss (full) |
| g2u09.w.cheesecake | cheesecake | Käsekuchen | cheesecake (full) | Käsekuchen (full) ; der Käsekuchen (full) ; Topfenkuchen (partial) |
| g2u09.w.chef | chef | Koch/Köchin | chef (full) ; chefs (partial) | Koch (full) ; Köchin (full) ; der Koch (full) ; die Köchin (full) |
| g2u09.w.chicken | chicken | Huhn | chicken (full) | Huhn (full) ; Hühnerfleisch (full) ; das Huhn (full) ; Hähnchen (partial) |
| g2u09.w.chocolate-ice-cream | chocolate ice cream | Schokoladeneis | chocolate ice cream (full) | Schokoladeneis (full) ; das Schokoladeneis (full) |
| g2u09.w.cloche | cloche | Speiseglocke | cloche (full) ; cloches (partial) | Speiseglocke (full) ; die Speiseglocke (full) ; Glocke (partial) |
| g2u09.w.completely | completely | vollständig | completely (full) | vollständig (full) ; völlig (full) ; ganz (full) ; komplett (partial) |
| g2u09.w.consumer | consumer | Konsument/Konsumentin | consumer (full) ; consumers (partial) | Konsument (full) ; Konsumentin (full) ; der Konsument (full) ; Verbraucher (partial) |
| g2u09.w.crane | crane | Kran | crane (full) ; cranes (partial) | Kran (full) ; der Kran (full) ; Baukran (partial) |
| g2u09.w.delivery | delivery | Lieferung | delivery (full) ; deliveries (partial) | Lieferung (full) ; die Lieferung (full) |
| g2u09.w.fridge | fridge | Kühlschrank | fridge (full) ; fridges (partial) | Kühlschrank (full) ; der Kühlschrank (full) |
| g2u09.w.glasses | glasses (pl) | Brille | glasses (full) | Brille (full) ; die Brille (full) ; Augengläser (partial) |
| g2u09.w.grapes | grapes | Trauben | grapes (full) ; grape (partial) | Trauben (full) ; Weintrauben (full) ; die Trauben (full) |
| g2u09.w.gym | gym | Turnhalle | gym (full) ; gyms (partial) | Turnhalle (full) ; die Turnhalle (full) ; Fitnesscenter (full) ; Fitnessstudio (partial) |
| g2u09.w.ham | ham | Schinken | ham (full) | Schinken (full) ; der Schinken (full) |
| g2u09.w.lamb | lamb | Lamm | lamb (full) | Lamm (full) ; Lammfleisch (full) ; das Lamm (full) |
| g2u09.w.main-course | main course | Hauptgang | main course (full) | Hauptgang (full) ; Hauptspeise (full) ; der Hauptgang (full) ; die Hauptspeise (full) |
| g2u09.w.menu | menu | Speisekarte | menu (full) ; menus (partial) | Speisekarte (full) ; die Speisekarte (full) ; Karte (partial) |
| g2u09.w.mineral-water | mineral water | Mineralwasser | mineral water (full) | Mineralwasser (full) ; das Mineralwasser (full) ; Sprudelwasser (partial) |
| g2u09.w.mushrooms | mushrooms | Pilze | mushrooms (full) ; mushroom (partial) | Pilze (full) ; die Pilze (full) ; Pilz (partial) ; Champignons (partial) |
| g2u09.w.olives | olives | Oliven | olives (full) ; olive (partial) | Oliven (full) ; die Oliven (full) ; Olive (partial) |
| g2u09.w.onions | onions | Zwiebeln | onions (full) ; onion (partial) | Zwiebeln (full) ; die Zwiebeln (full) ; Zwiebel (partial) |
| g2u09.w.pancakes | pancakes | Pfannkuchen | pancakes (full) ; pancake (partial) | Pfannkuchen (full) ; die Pfannkuchen (full) ; Palatschinken (partial) |
| g2u09.w.peaches | peaches | Pfirsiche | peaches (full) ; peach (partial) | Pfirsiche (full) ; die Pfirsiche (full) ; Pfirsich (partial) |
| g2u09.w.pears | pears | Birnen | pears (full) ; pear (partial) | Birnen (full) ; die Birnen (full) ; Birne (partial) |
| g2u09.w.peppers | peppers | Paprika | peppers (full) ; pepper (partial) | Paprika (full) ; die Paprika (full) ; Paprikaschoten (partial) |
| g2u09.w.platform | platform | Plattform | platform (full) ; platforms (partial) | Plattform (full) ; die Plattform (full) |
| g2u09.w.plums | plums | Pflaumen | plums (full) ; plum (partial) | Pflaumen (full) ; die Pflaumen (full) ; Zwetschken (partial) |
| g2u09.w.potato | potato (pl potatoes) | Kartoffel | potato (full) ; potatoes (full) | Kartoffel (full) ; die Kartoffel (full) ; Kartoffeln (full) ; Erdäpfel (partial) |
| g2u09.w.pumpkin-pie | pumpkin pie | Kürbiskuchen | pumpkin pie (full) | Kürbiskuchen (full) ; der Kürbiskuchen (full) |
| g2u09.w.recipe | recipe | Rezept | recipe (full) ; recipes (partial) | Rezept (full) ; das Rezept (full) ; Kochrezept (partial) |
| g2u09.w.refund | refund | Rückerstattung | refund (full) ; refunds (partial) | Rückerstattung (full) ; die Rückerstattung (full) ; Geld zurück (partial) |
| g2u09.w.rice-pudding | rice pudding | Milchreis | rice pudding (full) | Milchreis (full) ; der Milchreis (full) |
| g2u09.w.sausages | sausages | Würstchen | sausages (full) ; sausage (partial) | Würstchen (full) ; die Würstchen (full) ; Würste (partial) |
| g2u09.w.several | several | einige | several (full) | einige (full) ; mehrere (full) |
| g2u09.w.slice | slice | Stück | slice (full) ; slices (partial) ; piece (partial) | Stück (full) ; Scheibe (full) ; das Stück (full) ; die Scheibe (full) |
| g2u09.w.soup | soup | Suppe | soup (full) ; soups (partial) | Suppe (full) ; die Suppe (full) |
| g2u09.w.starter | starter | Vorspeise | starter (full) ; starters (full) | Vorspeise (full) ; die Vorspeise (full) |
| g2u09.w.stew | stew | Eintopf | stew (full) ; stews (partial) | Eintopf (full) ; der Eintopf (full) |
| g2u09.w.straightaway | straightaway | sofort | straightaway (full) ; straight away (partial) | sofort (full) ; gleich (full) ; auf der Stelle (partial) |
| g2u09.w.strawberries | strawberries | Erdbeeren | strawberries (full) ; strawberry (partial) | Erdbeeren (full) ; die Erdbeeren (full) ; Erdbeere (partial) |
| g2u09.w.to-change-one-s-mind | to change one's mind | seine Meinung ändern | change one's mind (full) ; change my mind (full) ; changed my mind (full) | seine Meinung ändern (full) ; die Meinung ändern (full) ; es sich anders überlegen (partial) |
| g2u09.w.to-complain | to complain | sich beschweren | complain (full) ; to complain (full) | sich beschweren (full) ; beschweren (full) ; reklamieren (partial) |
| g2u09.w.to-download | to download | herunterladen | download (full) ; to download (full) | herunterladen (full) ; runterladen (full) ; downloaden (partial) |
| g2u09.w.to-drop | to drop | fallen (lassen) | drop (full) ; to drop (full) | fallen lassen (full) ; fallenlassen (full) ; fallen (partial) |
| g2u09.w.to-entertain | to entertain | unterhalten | entertain (full) ; to entertain (full) | unterhalten (full) ; belustigen (partial) |
| g2u09.w.to-miss | to miss | verpassen | miss (full) ; to miss (full) | verpassen (full) ; versäumen (partial) |
| g2u09.w.to-pour | to pour | einschenken | pour (full) ; to pour (full) | einschenken (full) ; eingießen (full) ; schütten (full) |
| g2u09.w.to-serve | to serve | servieren | serve (full) ; to serve (full) | servieren (full) ; bringen (partial) |
| g2u09.w.tomato | tomato (pl tomatoes) | Tomate | tomato (full) ; tomatoes (full) | Tomate (full) ; die Tomate (full) ; Tomaten (full) ; Paradeiser (partial) |
| g2u09.w.turkey | turkey | Truthahn | turkey (full) | Truthahn (full) ; der Truthahn (full) ; Pute (partial) |
| g2u09.w.waiter | waiter | Kellner | waiter (full) ; waiters (partial) | Kellner (full) ; der Kellner (full) ; Kellnerin (partial) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u09.gi.one-ones.tr.001 | translation | Welche Suppe möchtest du? — Die Tomatensuppe. [de] | Which soup do you want? — The tomato one. (full) ; Which soup would you like? — The tomato one. (full) ; Which soup do you want? The tomato one. (full) | deToEn |
| g2u09.gi.one-ones.tr.002 | translation | Ich mag die grünen nicht. Ich mag die roten. (Trauben) [de] | I don't like the green ones. I like the red ones. (full) ; I do not like the green ones. I like the red ones. (full) | deToEn |
| g2u09.gi.some-any.tr.002 | translation | Gibt es noch Trauben? — Nein, es gibt keine Trauben mehr. [de] | Are there any grapes? — No, there aren't any grapes. (full) ; Are there any grapes? No, there aren't any grapes. (full) ; Are there any grapes? — No, there aren't any. (full) | deToEn |
| g2u09.gi.some-any.tr.003 | translation | Möchtest du etwas Kuchen? [de] | Would you like some cake? (full) ; Do you want some cake? (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u09/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u09",
  "lens": "translation",
  "itemsHash": "701ca1d81149",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 60, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
