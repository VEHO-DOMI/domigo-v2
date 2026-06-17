# Verify lens — translation — g1-u07 (round 1)

<!-- domigo:verify translation g1-u07 items=ca45f99fa37b prompt=c6328b13b073 round=1 -->

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

## Vocab items (67)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u07.w.always | always | immer | always (full) | immer (full) |
| g1u07.w.an-apple | an apple | ein Apfel | an apple (full) ; apple (partial) | ein Apfel (full) ; Apfel (full) |
| g1u07.w.an-orange | an orange | eine Orange | an orange (full) ; orange (partial) | eine Orange (full) ; Orange (full) |
| g1u07.w.any | any | irgendwelche | any (full) | irgendwelche (full) ; welche (partial) |
| g1u07.w.beans | beans | Bohnen | beans (full) | Bohnen (full) |
| g1u07.w.bread | bread | Brot | bread (full) | Brot (full) |
| g1u07.w.breakfast | breakfast | Frühstück | breakfast (full) | Frühstück (full) |
| g1u07.w.broccoli | broccoli | Brokkoli | broccoli (full) | Brokkoli (full) |
| g1u07.w.butter | butter | Butter | butter (full) | Butter (full) |
| g1u07.w.cake | cake | Kuchen | cake (full) | Kuchen (full) |
| g1u07.w.carrot | carrot | Karotte | carrot (full) | Karotte (full) ; Möhre (full) |
| g1u07.w.cheese | cheese | Käse | cheese (full) | Käse (full) |
| g1u07.w.chicken | chicken | Huhn | chicken (full) | Huhn (full) ; Hühnchen (full) ; Hähnchen (partial) |
| g1u07.w.chillies | chillies | Chilischoten | chillies (full) | Chilischoten (full) ; Chilis (partial) |
| g1u07.w.chips | chips | Chips | chips (full) | Chips (full) ; Pommes (partial) |
| g1u07.w.chocolate | chocolate | Schokolade | chocolate (full) | Schokolade (full) |
| g1u07.w.cucumber | cucumber | Gurke | cucumber (full) | Gurke (full) |
| g1u07.w.dinner | dinner | Abendessen | dinner (full) | Abendessen (full) |
| g1u07.w.egg | egg | Ei | egg (full) | Ei (full) |
| g1u07.w.fish | fish | Fisch | fish (full) | Fisch (full) |
| g1u07.w.fries | fries | Pommes frites | fries (full) | Pommes frites (full) ; Pommes (full) |
| g1u07.w.glass | glass | Glas | glass (full) | Glas (full) |
| g1u07.w.grapes | grapes | Weintrauben | grapes (full) | Weintrauben (full) ; Trauben (full) |
| g1u07.w.ham | ham | Schinken | ham (full) | Schinken (full) |
| g1u07.w.hamburger | hamburger | Hamburger | hamburger (full) | Hamburger (full) |
| g1u07.w.have-you-got | Have you got …? | Hast du / Habt ihr / Haben Sie ...? | Have you got …? (full) | Hast du …? (full) ; Habt ihr …? (full) |
| g1u07.w.healthy | healthy | gesund | healthy (full) | gesund (full) |
| g1u07.w.i-ve-got | I've got … | Ich habe … | I've got … (full) | Ich habe … (full) |
| g1u07.w.ice-cream | ice cream | Eis | ice cream (full) | Eis (full) ; Eiscreme (full) |
| g1u07.w.junk-food | junk food | Junk Food | junk food (full) | Junk Food (full) ; ungesundes Essen (partial) |
| g1u07.w.kiwi | kiwi | Kiwi | kiwi (full) | Kiwi (full) |
| g1u07.w.lunch | lunch | Mittagessen | lunch (full) | Mittagessen (full) |
| g1u07.w.meat | meat | Fleisch | meat (full) | Fleisch (full) |
| g1u07.w.menu | menu | Speisekarte | menu (full) | Speisekarte (full) ; Menü (partial) |
| g1u07.w.milk | milk | Milch | milk (full) | Milch (full) |
| g1u07.w.mineral-water | mineral water | Mineralwasser | mineral water (full) | Mineralwasser (full) |
| g1u07.w.money | money | Geld | money (full) | Geld (full) |
| g1u07.w.mum | Mum | Mama | Mum (full) | Mama (full) ; Mutti (full) |
| g1u07.w.never | never | nie | never (full) | nie (full) ; niemals (full) |
| g1u07.w.often | often | oft | often (full) | oft (full) ; häufig (full) |
| g1u07.w.onion | onion | Zwiebel | onion (full) | Zwiebel (full) |
| g1u07.w.orange-juice | orange juice | Orangensaft | orange juice (full) | Orangensaft (full) |
| g1u07.w.pasta | pasta | Nudeln | pasta (full) | Nudeln (full) ; Pasta (full) |
| g1u07.w.peas | peas | Erbsen | peas (full) | Erbsen (full) |
| g1u07.w.pizza | pizza | Pizza | pizza (full) | Pizza (full) |
| g1u07.w.plate | plate | Teller | plate (full) | Teller (full) |
| g1u07.w.red-pepper | red pepper | rote Paprika | red pepper (full) | rote Paprika (full) ; Paprika (full) |
| g1u07.w.restaurant | restaurant | Restaurant | restaurant (full) | Restaurant (full) |
| g1u07.w.rice | rice | Reis | rice (full) | Reis (full) |
| g1u07.w.salad | salad | Salat | salad (full) | Salat (full) |
| g1u07.w.sandwich | sandwich | Sandwich | sandwich (full) | Sandwich (full) ; belegtes Brot (full) |
| g1u07.w.sausages | sausages | Würstchen | sausages (full) | Würstchen (full) ; Würste (partial) |
| g1u07.w.some | some | etwas | some (full) | etwas (full) ; einige (full) ; ein bisschen (partial) |
| g1u07.w.sometimes | sometimes | manchmal | sometimes (full) | manchmal (full) |
| g1u07.w.soup | soup | Suppe | soup (full) | Suppe (full) |
| g1u07.w.spinach | spinach | Spinat | spinach (full) | Spinat (full) |
| g1u07.w.strawberry | strawberry | Erdbeere | strawberry (full) | Erdbeere (full) |
| g1u07.w.sugar | sugar | Zucker | sugar (full) | Zucker (full) |
| g1u07.w.tea | tea | Tee | tea (full) | Tee (full) |
| g1u07.w.that-s-nice | That's nice. | Das ist nett. | That's nice. (full) | Das ist nett. (full) ; Das ist schön. (full) |
| g1u07.w.to-drink | to drink | trinken | to drink (full) ; drink (full) | trinken (full) |
| g1u07.w.to-like | to like | mögen | to like (full) ; like (full) | mögen (full) ; gernhaben (partial) |
| g1u07.w.to-make | to make | machen | to make (full) ; make (full) | machen (full) ; zubereiten (full) |
| g1u07.w.tomato | tomato (pl tomatoes) | Tomate (pl Tomaten) | tomato (full) ; tomatoes (full) | Tomate (full) ; Tomaten (full) |
| g1u07.w.usually | usually | normalerweise | usually (full) | normalerweise (full) ; gewöhnlich (full) ; meistens (partial) |
| g1u07.w.vegetable | vegetable | Gemüse | vegetable (full) | Gemüse (full) |
| g1u07.w.waiter | waiter | Kellner/Kellnerin | waiter (full) | Kellner (full) ; Kellnerin (full) |

## Grammar items (7 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u07.gi.adverbs-frequency.tr.001 | translation | Ich esse immer Frühstück. [de] | I always eat breakfast. (full) ; I always have breakfast. (full) | deToEn |
| g1u07.gi.adverbs-frequency.tr.002 | translation | Sie ist manchmal hungrig. [de] | She is sometimes hungry. (full) ; Sometimes she is hungry. (full) ; She's sometimes hungry. (full) | deToEn |
| g1u07.gi.articles-a-an.tr.001 | translation | Ich möchte einen Apfel. [de] | I want an apple. (full) ; I would like an apple. (partial) | deToEn |
| g1u07.gi.articles-a-an.tr.002 | translation | Sie isst eine Pizza. [de] | She eats a pizza. (full) ; She has a pizza. (partial) | deToEn |
| g1u07.gi.present-simple-negative.tr.001 | translation | Ich mag keinen Fisch. [de] | I don't like fish. (full) ; I do not like fish. (full) | deToEn |
| g1u07.gi.present-simple-negative.tr.002 | translation | Meine Schwester mag keinen Reis. [de] | My sister doesn't like rice. (full) ; My sister does not like rice. (full) | deToEn |
| g1u07.gi.present-simple-negative.tr.003 | translation | I don't like soup. [en] | Ich mag keine Suppe. (full) ; Ich mag Suppe nicht. (full) | enToDe |

## Output contract

Write `content/corpus/units/g1-u07/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u07",
  "lens": "translation",
  "itemsHash": "ca45f99fa37b",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 74, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
