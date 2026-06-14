# Verify lens — translation — g1-u09 (round 1)

<!-- domigo:verify translation g1-u09 items=ba1d244426bd prompt=c6328b13b073 round=1 -->

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

## Vocab items (57)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u09.w.a-day | (...) a day | (...) am Tag | a day (full) ; per day (partial) | am Tag (full) ; pro Tag (full) ; täglich (partial) |
| g1u09.w.a-week | (...) a week | (...) in der Woche | a week (full) ; per week (partial) | in der Woche (full) ; pro Woche (full) |
| g1u09.w.across | across (Britain) | in ganz (Großbritannien) | across (full) | in ganz (full) ; überall in (partial) |
| g1u09.w.aunty | aunty | Tante (Koseform) | aunty (full) ; auntie (partial) ; aunt (partial) | Tante (full) |
| g1u09.w.basket | basket | Korb | basket (full) | Korb (full) |
| g1u09.w.bat | bat | Fledermaus | bat (full) | Fledermaus (full) |
| g1u09.w.beginning | beginning | Anfang | beginning (full) ; start (partial) | Anfang (full) ; Beginn (full) |
| g1u09.w.best-wishes | best wishes | herzliche Grüße | best wishes (full) | herzliche Grüße (full) ; viele Grüße (partial) |
| g1u09.w.box | box | Schachtel | box (full) | Schachtel (full) ; Kiste (full) |
| g1u09.w.budgie | budgie | Wellensittich | budgie (full) ; budgerigar (partial) | Wellensittich (full) |
| g1u09.w.cage | cage | Käfig | cage (full) | Käfig (full) |
| g1u09.w.camel | camel | Kamel | camel (full) | Kamel (full) |
| g1u09.w.cuddly-toy | cuddly toy | Stofftier | cuddly toy (full) ; soft toy (partial) | Stofftier (full) ; Kuscheltier (full) |
| g1u09.w.dangerous | dangerous | gefährlich | dangerous (full) | gefährlich (full) |
| g1u09.w.daughter | daughter | Tochter | daughter (full) | Tochter (full) |
| g1u09.w.dear | dear | liebe/r (Anrede) | dear (full) | liebe (full) ; lieber (full) |
| g1u09.w.elephant | elephant | Elefant | elephant (full) | Elefant (full) |
| g1u09.w.ending | ending | Ende | ending (full) ; end (partial) | Ende (full) ; Schluss (full) |
| g1u09.w.everybody | everybody | jede/r | everybody (full) ; everyone (partial) | jeder (full) ; jede (full) ; alle (full) |
| g1u09.w.far-away | far away | weit weg | far away (full) | weit weg (full) |
| g1u09.w.farm | farm | Bauernhof | farm (full) | Bauernhof (full) |
| g1u09.w.fish | fish | Fisch | fish (full) | Fisch (full) |
| g1u09.w.fur | fur | Fell | fur (full) | Fell (full) |
| g1u09.w.grandpa | grandpa | Opa | grandpa (full) ; grandfather (partial) ; grandad (partial) | Opa (full) ; Großvater (full) |
| g1u09.w.guinea-pig | guinea pig | Meerschweinchen | guinea pig (full) | Meerschweinchen (full) |
| g1u09.w.letter | letter | Brief | letter (full) | Brief (full) |
| g1u09.w.lizard | lizard | Eidechse | lizard (full) | Eidechse (full) |
| g1u09.w.man | man (pl men) | Mann | man (full) ; men (full) | Mann (full) ; Männer (full) |
| g1u09.w.mother | mother | Mutter | mother (full) ; mum (partial) | Mutter (full) ; Mama (full) |
| g1u09.w.mouse | mouse | Maus | mouse (full) | Maus (full) |
| g1u09.w.mouse-2 | mouse (pl mice) | Maus | mouse (full) ; mice (full) | Maus (full) ; Mäuse (full) |
| g1u09.w.near | near | in der Nähe von | near (full) ; close to (partial) | in der Nähe von (full) ; nahe (full) |
| g1u09.w.newspaper | newspaper | Zeitung | newspaper (full) | Zeitung (full) |
| g1u09.w.noise | noise | Geräusch | noise (full) ; sound (partial) | Geräusch (full) ; Lärm (partial) |
| g1u09.w.once | once | einmal | once (full) ; one time (full) | einmal (full) |
| g1u09.w.owl | owl | Eule | owl (full) | Eule (full) |
| g1u09.w.owner | owner | Besitzer/Besitzerin | owner (full) | Besitzer (full) ; Besitzerin (full) |
| g1u09.w.personal | personal | persönlich | personal (full) | persönlich (full) |
| g1u09.w.pig | pig | Schwein | pig (full) | Schwein (full) |
| g1u09.w.pony | pony | Pony | pony (full) | Pony (full) |
| g1u09.w.rabbit | rabbit | Kaninchen | rabbit (full) ; bunny (partial) | Kaninchen (full) ; Hase (full) |
| g1u09.w.rat | rat | Ratte | rat (full) | Ratte (full) |
| g1u09.w.shark | shark | Hai | shark (full) | Hai (full) |
| g1u09.w.spider | spider | Spinne | spider (full) | Spinne (full) |
| g1u09.w.tank | tank | Aquarium | tank (full) | Aquarium (full) ; Terrarium (partial) |
| g1u09.w.terrarium | terrarium | Terrarium | terrarium (full) | Terrarium (full) |
| g1u09.w.to-be-interested-in | to be interested in | an etw. interessiert sein | be interested in (full) ; interested in (full) | interessiert sein an (full) ; sich interessieren für (full) |
| g1u09.w.to-begin | to begin | anfangen | begin (full) ; to begin (full) ; start (partial) | anfangen (full) ; beginnen (full) |
| g1u09.w.to-bite | to bite | beißen | bite (full) ; to bite (full) | beißen (full) |
| g1u09.w.to-drive | to drive | fahren | drive (full) ; to drive (full) | fahren (full) |
| g1u09.w.to-need | to need | brauchen | need (full) ; to need (full) | brauchen (full) |
| g1u09.w.to-stay | to stay | bleiben | stay (full) ; to stay (full) | bleiben (full) |
| g1u09.w.to-visit | to visit | besuchen | visit (full) ; to visit (full) | besuchen (full) |
| g1u09.w.tortoise | tortoise | Schildkröte | tortoise (full) ; turtle (partial) | Schildkröte (full) |
| g1u09.w.twice | twice | zweimal | twice (full) ; two times (full) | zweimal (full) |
| g1u09.w.unusual | unusual | ungewöhnlich | unusual (full) | ungewöhnlich (full) ; außergewöhnlich (full) |
| g1u09.w.zebra | zebra | Zebra | zebra (full) | Zebra (full) |

## Grammar items (7 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u09.gi.irregular-plurals-3.tr.001 | translation | Ich habe zwei Mäuse. [de] | I have got two mice. (full) ; I have two mice. (partial) | deToEn |
| g1u09.gi.object-pronouns.tr.001 | translation | Kannst du mir helfen? [de] | Can you help me? (full) | deToEn |
| g1u09.gi.object-pronouns.tr.002 | translation | Wir mögen sie nicht. (= Bob) [de] | We don't like him. (full) | deToEn |
| g1u09.gi.possessive-s.tr.002 | translation | Das Auto meiner Mutter ist rot. [de] | My mother's car is red. (full) ; My mum's car is red. (full) | deToEn |
| g1u09.gi.possessive-s.tr.003 | translation | Toms Kaninchen ist im Käfig. [de] | Tom's rabbit is in the cage. (full) ; Tom's rabbit is in a cage. (full) | deToEn |
| g1u09.gi.question-words.tr.001 | translation | Wo wohnst du? [de] | Where do you live? (full) | deToEn |
| g1u09.gi.question-words.tr.002 | translation | Wie oft fütterst du deinen Hund? [de] | How often do you feed your dog? (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u09/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u09",
  "lens": "translation",
  "itemsHash": "ba1d244426bd",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 64, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
