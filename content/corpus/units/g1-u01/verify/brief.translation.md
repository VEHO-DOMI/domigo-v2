# Verify lens — translation — g1-u01 (round 1)

<!-- domigo:verify translation g1-u01 items=f420e20d1860 prompt=c6328b13b073 round=1 -->

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

## Vocab items (68)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u01.w.address | (email) address | (E-Mail-)Adresse | address (full) ; email address (full) | Adresse (full) ; E-Mail-Adresse (full) |
| g1u01.w.board | board | Tafel | board (full) | Tafel (full) |
| g1u01.w.book | book | Buch | book (full) | Buch (full) |
| g1u01.w.chair | chair | Stuhl | chair (full) | Stuhl (full) ; Sessel (full) |
| g1u01.w.child | child | Kind | child (full) | Kind (full) |
| g1u01.w.class | class | (Schul-)Klasse | class (full) | Klasse (full) ; Schulklasse (full) |
| g1u01.w.desk | desk | Schreibtisch | desk (full) | Schreibtisch (full) ; Pult (full) ; Tisch (partial) |
| g1u01.w.door | door | Tür | door (full) | Tür (full) |
| g1u01.w.exercise-book | exercise book | Heft | exercise book (full) | Heft (full) ; Schreibheft (full) |
| g1u01.w.favourite | favourite | Lieblings- | favourite (full) ; favorite (partial) | Lieblings- (full) ; liebste (full) |
| g1u01.w.hairband | hairband | Haarreif | hairband (full) | Haarreif (full) ; Stirnband (partial) ; Haarband (partial) |
| g1u01.w.hat | hat | Hut | hat (full) | Hut (full) ; Mütze (partial) |
| g1u01.w.here | here | hier | here (full) | hier (full) |
| g1u01.w.how-are-you | How are you? | Wie geht es dir/Ihnen/euch? | How are you? (full) | Wie geht es dir? (full) ; Wie geht's? (full) |
| g1u01.w.how-many | how many | wie viele | how many (full) | wie viele (full) |
| g1u01.w.i-am-fine | I am (= I'm) fine. | Es geht mir gut. | I'm fine. (full) ; I am fine. (full) | Es geht mir gut. (full) ; Mir geht's gut. (full) |
| g1u01.w.it | it | es | it (full) | es (full) |
| g1u01.w.let-s | Let's … | Lass(t) … | Let's (full) | Lass uns (full) ; Lasst uns (full) |
| g1u01.w.light | light | hell | light (full) | hell (full) |
| g1u01.w.midnight | midnight | Mitternacht | midnight (full) | Mitternacht (full) |
| g1u01.w.more | more | mehr | more (full) | mehr (full) |
| g1u01.w.must | must | müssen | must (full) | müssen (full) ; muss (full) |
| g1u01.w.or | or | oder | or (full) | oder (full) |
| g1u01.w.our | our | unser/e | our (full) | unser (full) ; unsere (full) |
| g1u01.w.pen | pen | Kugelschreiber | pen (full) | Kugelschreiber (full) ; Kuli (full) ; Stift (partial) |
| g1u01.w.pencil | pencil | Bleistift | pencil (full) | Bleistift (full) ; Stift (partial) |
| g1u01.w.pencil-case | pencil case | Federmäppchen | pencil case (full) | Federmäppchen (full) ; Federpennal (full) ; Mäppchen (partial) |
| g1u01.w.picture | picture | Bild | picture (full) | Bild (full) |
| g1u01.w.projector | projector | Projektor | projector (full) ; beamer (partial) | Projektor (full) ; Beamer (full) |
| g1u01.w.rubber | rubber | Radiergummi | rubber (full) | Radiergummi (full) ; Gummi (partial) |
| g1u01.w.ruler | ruler | Lineal | ruler (full) | Lineal (full) |
| g1u01.w.school-bag | school bag | Schultasche | school bag (full) | Schultasche (full) ; Schulrucksack (partial) |
| g1u01.w.school-tie | school tie | Schulkrawatte | school tie (full) | Schulkrawatte (full) ; Krawatte (partial) |
| g1u01.w.scissors | scissors | Schere | scissors (full) | Schere (full) |
| g1u01.w.shirt | shirt | Hemd | shirt (full) | Hemd (full) |
| g1u01.w.shoe | shoe | Schuh | shoe (full) | Schuh (full) |
| g1u01.w.skirt | skirt | Rock | skirt (full) | Rock (full) |
| g1u01.w.socks | socks | Socken | socks (full) | Socken (full) |
| g1u01.w.sound-system | sound system | Soundsystem | sound system (full) | Soundsystem (full) ; Musikanlage (full) ; Anlage (partial) |
| g1u01.w.sunglasses | sunglasses | Sonnenbrille | sunglasses (full) | Sonnenbrille (full) |
| g1u01.w.sweater | sweater | Pullover | sweater (full) ; jumper (partial) ; pullover (partial) | Pullover (full) ; Pulli (full) |
| g1u01.w.tablet | tablet | Tablet | tablet (full) | Tablet (full) |
| g1u01.w.their | their | ihr/e | their (full) | ihr (full) ; ihre (full) |
| g1u01.w.then | then | dann | then (full) | dann (full) ; danach (full) |
| g1u01.w.time | time | Zeit | time (full) | Zeit (full) ; Uhrzeit (full) |
| g1u01.w.to-ask | to ask | fragen | to ask (full) ; ask (full) | fragen (full) |
| g1u01.w.to-clean | to clean | sauber machen | to clean (full) ; clean (full) | sauber machen (full) ; putzen (full) |
| g1u01.w.to-close | to close | schließen | to close (full) ; close (full) | schließen (full) ; zumachen (full) |
| g1u01.w.to-eat | to eat | essen | to eat (full) ; eat (full) | essen (full) ; fressen (partial) |
| g1u01.w.to-enjoy | to enjoy | genießen | to enjoy (full) ; enjoy (full) | genießen (full) |
| g1u01.w.to-find | to find | finden | to find (full) ; find (full) | finden (full) |
| g1u01.w.to-give | to give | geben | to give (full) ; give (full) | geben (full) |
| g1u01.w.to-go | to go | gehen | to go (full) ; go (full) | gehen (full) |
| g1u01.w.to-hate | to hate | hassen | to hate (full) ; hate (full) | hassen (full) ; nicht ausstehen können (partial) |
| g1u01.w.to-listen | to listen | zuhören | to listen (full) ; listen (full) | zuhören (full) |
| g1u01.w.to-look | to look | schauen | to look (full) ; look (full) | schauen (full) ; sehen (full) ; anschauen (partial) |
| g1u01.w.to-love | to love | lieben | to love (full) ; love (full) | lieben (full) |
| g1u01.w.to-meet | to meet | kennenlernen | to meet (full) ; meet (full) | kennenlernen (full) ; treffen (full) ; sich treffen (partial) |
| g1u01.w.to-open | to open | öffnen | to open (full) ; open (full) | öffnen (full) ; aufmachen (full) |
| g1u01.w.to-read | to read | lesen | to read (full) ; read (full) | lesen (full) |
| g1u01.w.to-sit-down | to sit down | sich (hin-)setzen | to sit down (full) ; sit down (full) | sich setzen (full) ; sich hinsetzen (full) |
| g1u01.w.to-speak | to speak | sprechen | to speak (full) ; speak (full) ; talk (partial) | sprechen (full) ; reden (full) |
| g1u01.w.to-stand-up | to stand up | aufstehen | to stand up (full) ; stand up (full) | aufstehen (full) |
| g1u01.w.to-take-out | to take out | herausnehmen | to take out (full) ; take out (full) | herausnehmen (full) ; rausnehmen (full) |
| g1u01.w.to-understand | to understand | verstehen | to understand (full) ; understand (full) | verstehen (full) |
| g1u01.w.to-write | to write | schreiben | to write (full) ; write (full) | schreiben (full) |
| g1u01.w.window | window | Fenster | window (full) | Fenster (full) |
| g1u01.w.your | your | dein/e | your (full) | dein (full) ; deine (full) ; euer (partial) |

## Grammar items (15 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u01.gi.contractions.tr.001 | translation | Schreib die Kurzform: Ich bin in Klasse eins. [de] | I'm in class one. (full) ; I am in class one. (partial) | deToEn |
| g1u01.gi.contractions.tr.002 | translation | Schreib die Kurzform: Es ist ein Tablet. [de] | It's a tablet. (full) ; It is a tablet. (partial) | deToEn |
| g1u01.gi.contractions.tr.003 | translation | Schreib die Kurzform: Das ist nicht mein Stift. [de] | That isn't my pen. (full) ; That's not my pen. (full) ; That is not my pen. (partial) | deToEn |
| g1u01.gi.contractions.tr.004 | translation | Schreib die Kurzform: Lass uns lesen! [de] | Let's read! (full) | deToEn |
| g1u01.gi.imperatives.tr.001 | translation | 🇩🇪 Mach das Fenster auf! [de] | Open the window! (full) ; Open the window. (full) | deToEn |
| g1u01.gi.imperatives.tr.002 | translation | 🇩🇪 Mach die Tür zu! [de] | Close the door! (full) ; Close the door. (full) | deToEn |
| g1u01.gi.imperatives.tr.003 | translation | 🇩🇪 Lauf nicht! [de] | Don't run! (full) ; Do not run! (full) | deToEn |
| g1u01.gi.imperatives.tr.004 | translation | 🇩🇪 Öffne deine Bücher nicht! [de] | Don't open your books! (full) ; Do not open your books! (full) ; Don't open your books. (full) | deToEn |
| g1u01.gi.imperatives.tr.005 | translation | Sit down! [en] | Setz dich! (full) ; Setzt euch! (full) ; Setz dich. (partial) | enToDe |
| g1u01.gi.plurals.tr.001 | translation | Ich habe drei Stifte. [de] | I have three pens. (full) ; I have got three pens. (partial) | deToEn |
| g1u01.gi.plurals.tr.002 | translation | Es gibt fünf Kinder in der Klasse. [de] | There are five children in the class. (full) ; There are five children in the classroom. (full) | deToEn |
| g1u01.gi.plurals.tr.003 | translation | two desks [en] | zwei Tische (full) ; zwei Schreibtische (full) ; zwei Pulte (partial) | enToDe |
| g1u01.gi.plurals.tr.004 | translation | drei Fische [de] | three fish (full) | deToEn |
| g1u01.gi.questions-personal-info.tr.001 | translation | Wie geht es dir? – Mir geht es gut, danke. Und dir? [de] | How are you? – I'm fine, thanks. And you? (full) ; How are you? – I'm fine, thanks. (partial) | deToEn |
| g1u01.gi.questions-personal-info.tr.002 | translation | Wie heißt du? [de] | What's your name? (full) ; What is your name? (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u01/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u01",
  "lens": "translation",
  "itemsHash": "f420e20d1860",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 83, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
