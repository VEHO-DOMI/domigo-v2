# Verify lens — translation — g2-u04 (round 2)

<!-- domigo:verify translation g2-u04 items=b34faed5561b prompt=c6328b13b073 round=2 -->

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

## Vocab items (50)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u04.w.ago | (two days) ago | vor (zwei Tagen) | ago (full) | vor (full) ; vor zwei Tagen (full) |
| g2u04.w.anaconda | anaconda | Anakonda | anaconda (full) ; anacondas (full) | Anakonda (full) ; Anakondas (full) |
| g2u04.w.antelope | antelope | Antilope | antelope (full) ; antelopes (full) | Antilope (full) ; Antilopen (full) |
| g2u04.w.bat | bat | Fledermaus | bat (full) ; bats (full) | Fledermaus (full) ; Fledermäuse (full) |
| g2u04.w.centimetre | centimetre | Zentimeter | centimetre (full) ; centimetres (full) ; centimeter (partial) | Zentimeter (full) |
| g2u04.w.cheetah | cheetah | Gepard | cheetah (full) ; cheetahs (full) | Gepard (full) ; Geparde (full) ; Geparden (full) |
| g2u04.w.chimpanzee | chimpanzee | Schimpanse | chimpanzee (full) ; chimpanzees (full) | Schimpanse (full) ; Schimpansen (full) |
| g2u04.w.climate-change | climate change | Klimawandel | climate change (full) | Klimawandel (full) ; Klimaveränderung (partial) |
| g2u04.w.crocodile | crocodile | Krokodil | crocodile (full) ; crocodiles (full) | Krokodil (full) ; Krokodile (full) |
| g2u04.w.dangerous | dangerous | gefährlich | dangerous (full) | gefährlich (full) |
| g2u04.w.desert | desert | Wüste | desert (full) ; deserts (full) | Wüste (full) ; Wüsten (full) |
| g2u04.w.dolphin | dolphin | Delfin | dolphin (full) ; dolphins (full) | Delfin (full) ; Delfine (full) ; Delphin (full) |
| g2u04.w.farmer | farmer | Bauer/Bäuerin | farmer (full) | Bauer (full) ; Bäuerin (full) ; Landwirt (partial) ; Landwirtin (partial) |
| g2u04.w.fast | fast | schnell | fast (full) ; quick (partial) | schnell (full) |
| g2u04.w.female | female | weiblich | female (full) | weiblich (full) ; Weibchen (full) |
| g2u04.w.forever | forever | für immer | forever (full) | für immer (full) |
| g2u04.w.giraffe | giraffe | Giraffe | giraffe (full) ; giraffes (full) | Giraffe (full) ; Giraffen (full) |
| g2u04.w.hairy | hairy | haarig | hairy (full) | haarig (full) ; stark behaart (full) ; behaart (full) |
| g2u04.w.heavy | heavy | schwer | heavy (full) | schwer (full) |
| g2u04.w.human | human | Mensch | human (full) ; humans (full) ; human being (partial) ; person (partial) | Mensch (full) ; Menschen (full) |
| g2u04.w.incredible | incredible | unglaublich | incredible (full) ; amazing (partial) | unglaublich (full) ; unfassbar (partial) |
| g2u04.w.intelligent | intelligent | intelligent | intelligent (full) ; clever (partial) ; smart (partial) | intelligent (full) ; klug (partial) |
| g2u04.w.length | length | Länge | length (full) | Länge (full) |
| g2u04.w.less | less | weniger | less (full) | weniger (full) |
| g2u04.w.luck | luck | Glück | luck (full) | Glück (full) |
| g2u04.w.male | male | männlich | male (full) | männlich (full) ; Männchen (full) |
| g2u04.w.mammal | mammal | Säugetier | mammal (full) ; mammals (full) | Säugetier (full) ; Säugetiere (full) |
| g2u04.w.mosquito | mosquito | Stechmücke | mosquito (full) ; mosquitos (full) ; mosquitoes (full) | Stechmücke (full) ; Moskito (full) ; Mücke (partial) |
| g2u04.w.nobody | nobody | niemand | nobody (full) ; no one (full) | niemand (full) ; keiner (partial) |
| g2u04.w.ostrich | ostrich | Strauß | ostrich (full) ; ostriches (full) | Strauß (full) ; Strauße (full) ; Vogel Strauß (partial) |
| g2u04.w.parrot | parrot | Papagei | parrot (full) ; parrots (full) | Papagei (full) ; Papageien (full) |
| g2u04.w.pigeon | pigeon | Taube | pigeon (full) ; pigeons (full) | Taube (full) ; Tauben (full) |
| g2u04.w.powerful | powerful | mächtig | powerful (full) | mächtig (full) ; kräftig (full) |
| g2u04.w.reason | reason | Grund | reason (full) | Grund (full) |
| g2u04.w.rhino | rhino | Nashorn | rhino (full) ; rhinos (full) | Nashorn (full) ; Nashörner (full) |
| g2u04.w.scientist | scientist | Wissenschaftler/Wissenschaftlerin | scientist (full) | Wissenschaftler (full) ; Wissenschaftlerin (full) ; Forscher (partial) ; Forscherin (partial) |
| g2u04.w.shark | shark | Hai | shark (full) ; sharks (full) | Hai (full) ; Haie (full) ; Haifisch (full) |
| g2u04.w.smart | smart | schlau | smart (full) ; clever (partial) ; intelligent (partial) | schlau (full) ; klug (full) |
| g2u04.w.speed | speed | Geschwindigkeit | speed (full) | Geschwindigkeit (full) ; Tempo (full) |
| g2u04.w.strong | strong | stark | strong (full) | stark (full) ; kräftig (partial) |
| g2u04.w.to-carry | to carry | tragen | carry (full) ; to carry (full) ; transport (partial) | tragen (full) ; übertragen (full) |
| g2u04.w.to-die | to die | sterben | die (full) ; to die (full) | sterben (full) |
| g2u04.w.to-die-out | to die out | aussterben | die out (full) ; to die out (full) | aussterben (full) |
| g2u04.w.to-protect | to protect | (be-)schützen | protect (full) ; to protect (full) | schützen (full) ; beschützen (full) |
| g2u04.w.to-share | to share | teilen | share (full) ; to share (full) | teilen (full) |
| g2u04.w.to-weigh | to weigh | wiegen | weigh (full) ; to weigh (full) | wiegen (full) |
| g2u04.w.ton | ton | Tonne (1000 kg) | ton (full) ; tons (full) ; tonne (partial) | Tonne (full) ; Tonnen (full) |
| g2u04.w.truck | truck | Lastwagen | truck (full) ; lorry (partial) | Lastwagen (full) ; Lkw (full) ; Laster (partial) |
| g2u04.w.venomous | venomous | giftig | venomous (full) ; poisonous (partial) | giftig (full) |
| g2u04.w.whale | whale | Wal | whale (full) ; whales (full) | Wal (full) ; Wale (full) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u04.gi.as-as.tr.001 | translation | Ich bin so groß wie mein Papa. [de] | I am as tall as my dad. (full) ; I am as tall as my dad (full) ; I'm as tall as my dad. (full) ; I'm as tall as my dad (full) | deToEn |
| g2u04.gi.as-as.tr.002 | translation | Ein Delfin ist nicht so gefährlich wie ein Hai. [de] | A dolphin is not as dangerous as a shark. (full) ; A dolphin is not as dangerous as a shark (full) ; A dolphin isn't as dangerous as a shark. (full) ; A dolphin isn't as dangerous as a shark (full) | deToEn |
| g2u04.gi.comparatives.tr.001 | translation | Mein Hund ist größer als deine Maus. [de] | My dog is bigger than your mouse. (full) ; My dog is bigger than your mouse (full) | deToEn |
| g2u04.gi.comparatives.tr.002 | translation | Ein Wal ist schwerer als ein Delfin. [de] | A whale is heavier than a dolphin. (full) ; A whale is heavier than a dolphin (full) | deToEn |
| g2u04.gi.superlatives.tr.001 | translation | Der Wal ist das größte Säugetier. [de] | The whale is the biggest mammal. (full) ; The whale is the biggest mammal (full) | deToEn |
| g2u04.gi.superlatives.tr.002 | translation | Mathe ist das schwierigste Fach. [de] | Maths is the most difficult subject. (full) ; Maths is the most difficult subject (full) | deToEn |

## Output contract

Write `content/corpus/units/g2-u04/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u04",
  "lens": "translation",
  "itemsHash": "b34faed5561b",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 56, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
