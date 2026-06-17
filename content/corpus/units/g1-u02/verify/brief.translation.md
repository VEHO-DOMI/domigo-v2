# Verify lens — translation — g1-u02 (round 1)

<!-- domigo:verify translation g1-u02 items=70212a6b7573 prompt=c6328b13b073 round=1 -->

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

## Vocab items (52)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u02.w.adult | adult | Erwachsene/r | adult (full) | Erwachsener (full) ; Erwachsene (full) ; Erwachsene/r (full) |
| g1u02.w.at | at | bei | at (full) | bei (full) ; an (full) ; im (full) ; in (partial) |
| g1u02.w.at-last | At last. | Endlich. | At last. (full) ; At last (full) | Endlich. (full) ; Endlich (full) |
| g1u02.w.beautiful | beautiful | schön | beautiful (full) | schön (full) ; hübsch (full) |
| g1u02.w.behind | behind | hinter | behind (full) | hinter (full) |
| g1u02.w.behind-2 | behind | hinter | behind (full) | hinter (full) |
| g1u02.w.big | big | groß | big (full) | groß (full) |
| g1u02.w.but | but | aber | but (full) | aber (full) |
| g1u02.w.car | car | Auto | car (full) | Auto (full) ; Wagen (partial) |
| g1u02.w.child | child (pl children) | Kind | child (full) ; children (full) | Kind (full) ; Kinder (full) |
| g1u02.w.dog | dog | Hund | dog (full) | Hund (full) |
| g1u02.w.family | family | Familie | family (full) | Familie (full) |
| g1u02.w.for | for | für | for (full) | für (full) |
| g1u02.w.free | free | kostenlos | free (full) | kostenlos (full) ; gratis (full) |
| g1u02.w.from | from | aus | from (full) | aus (full) ; von (full) |
| g1u02.w.giraffe | giraffe | Giraffe | giraffe (full) | Giraffe (full) |
| g1u02.w.grandma | Grandma | Oma | Grandma (full) | Oma (full) |
| g1u02.w.group | group | Gruppe | group (full) | Gruppe (full) |
| g1u02.w.guide | guide | Führer/Führerin | guide (full) ; Guide (full) | Führer (full) ; Führerin (full) ; Guide (full) ; Reiseführer (full) ; Reiseführerin (full) |
| g1u02.w.happy | happy | glücklich | happy (full) | glücklich (full) ; fröhlich (full) ; zufrieden (full) |
| g1u02.w.he | he | er | he (full) | er (full) |
| g1u02.w.how-strange | How strange! | Wie komisch! | How strange! (full) ; How strange (full) | Wie komisch! (full) ; Wie komisch (full) ; Wie seltsam! (full) |
| g1u02.w.in | in | in | in (full) | in (full) |
| g1u02.w.in-front-of | in front of | vor | in front of (full) | vor (full) |
| g1u02.w.in-front-of-2 | in front of | vor | in front of (full) | vor (full) |
| g1u02.w.let-me-see | Let me see. | Lass mich mal schauen. | Let me see. (full) ; Let me see (full) | Lass mich mal schauen. (full) ; Lass mich mal schauen (full) ; Lass mich sehen. (full) |
| g1u02.w.lion | lion | Löwe | lion (full) | Löwe (full) |
| g1u02.w.long | long | lang | long (full) | lang (full) |
| g1u02.w.monkey | monkey | Affe | monkey (full) | Affe (full) |
| g1u02.w.next-to | next to | neben | next to (full) | neben (full) |
| g1u02.w.next-to-2 | next to | neben | next to (full) | neben (full) |
| g1u02.w.on | on | auf | on (full) | auf (full) |
| g1u02.w.parrot | parrot | Papagei | parrot (full) | Papagei (full) |
| g1u02.w.penguin | penguin | Pinguin | penguin (full) | Pinguin (full) |
| g1u02.w.she | she | sie | she (full) | sie (full) |
| g1u02.w.small | small | klein | small (full) | klein (full) |
| g1u02.w.stone | stone | Stein | stone (full) | Stein (full) |
| g1u02.w.they | they | sie | they (full) | sie (full) |
| g1u02.w.ticket | ticket | Eintrittskarte | ticket (full) | Eintrittskarte (full) ; Ticket (full) ; Karte (partial) |
| g1u02.w.to-bring | to bring | (mit-)bringen | bring (full) ; to bring (full) | bringen (full) ; mitbringen (full) |
| g1u02.w.to-let-somebody-out | to let somebody out | jemanden herauslassen | let out (full) ; let somebody out (full) ; to let somebody out (full) | herauslassen (full) ; jemanden herauslassen (full) ; rauslassen (full) |
| g1u02.w.to-talk | to talk | sprechen | talk (full) ; to talk (full) | sprechen (full) ; reden (full) ; sich unterhalten (full) |
| g1u02.w.to-want | to want | wollen | want (full) ; to want (full) | wollen (full) ; möchten (full) |
| g1u02.w.train | train | Zug | train (full) | Zug (full) |
| g1u02.w.tree | tree | Baum | tree (full) | Baum (full) |
| g1u02.w.under | under | unter | under (full) | unter (full) |
| g1u02.w.under-2 | under | unter | under (full) | unter (full) |
| g1u02.w.us | us | uns | us (full) | uns (full) |
| g1u02.w.we | we | wir | we (full) | wir (full) |
| g1u02.w.where | where | wo | where (full) | wo (full) |
| g1u02.w.year | year | Jahr | year (full) | Jahr (full) ; Jahrgangsstufe (full) ; Klasse (partial) |
| g1u02.w.zoo | zoo | Zoo | zoo (full) | Zoo (full) ; Tierpark (partial) |

## Grammar items (20 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u02.gi.prepositions-place.tr.001 | translation | Das Buch ist auf dem Pult. [de] | The book is on the desk. (full) ; The book is on the desk (partial) | deToEn |
| g1u02.gi.prepositions-place.tr.002 | translation | Der Hund ist unter dem Stuhl. [de] | The dog is under the chair. (full) ; The dog is under the chair (partial) | deToEn |
| g1u02.gi.prepositions-place.tr.003 | translation | Der Baum ist vor dem Zug. [de] | The tree is in front of the train. (full) ; The tree is in front of the train (partial) | deToEn |
| g1u02.gi.prepositions-place.tr.004 | translation | Wo ist der Papagei? Er ist im Baum. [de] | Where is the parrot? It's in the tree. (full) ; Where is the parrot? It is in the tree. (full) ; Where's the parrot? It's in the tree. (full) | deToEn |
| g1u02.gi.prepositions-place.tr.005 | translation | The lion is behind the car. [en] | Der Löwe ist hinter dem Auto. (full) | enToDe |
| g1u02.gi.prepositions-place.tr.006 | translation | The guide is next to the giraffe. [en] | Der Reiseführer ist neben der Giraffe. (full) ; Die Reiseführerin ist neben der Giraffe. (partial) | enToDe |
| g1u02.gi.subject-pronouns.tr.001 | translation | Er ist aus London. (ein Junge) [de] | He is from London. (full) ; He's from London. (full) | deToEn |
| g1u02.gi.subject-pronouns.tr.002 | translation | Das Auto ist klein. Es ist vor dem Zoo. (Auto ist kein Mensch!) [de] | The car is small. It is in front of the zoo. (full) ; The car is small. It's in front of the zoo. (full) | deToEn |
| g1u02.gi.there-is-are.tr.001 | translation | Es gibt einen Papagei im Baum. [de] | There is a parrot in the tree. (full) ; There's a parrot in the tree. (full) | deToEn |
| g1u02.gi.there-is-are.tr.002 | translation | Es gibt drei Affen hinter dem Baum. [de] | There are three monkeys behind the tree. (full) | deToEn |
| g1u02.gi.there-is-are.tr.003 | translation | Gibt es einen Löwen im Zoo? [de] | Is there a lion at the zoo? (full) ; Is there a lion in the zoo? (full) | deToEn |
| g1u02.gi.there-is-are.tr.004 | translation | Gibt es Pinguine im Zoo? [de] | Are there penguins at the zoo? (full) ; Are there any penguins at the zoo? (full) ; Are there penguins in the zoo? (full) | deToEn |
| g1u02.gi.there-is-are.tr.005 | translation | Es gibt kein Lineal auf dem Tisch. [de] | There isn't a ruler on the desk. (full) ; There is no ruler on the desk. (full) ; There's no ruler on the desk. (full) | deToEn |
| g1u02.gi.to-be.tr.002 | translation | Wir sind im Zoo. [de] | We are at the zoo. (full) ; We're at the zoo. (full) | deToEn |
| g1u02.gi.to-be.tr.003 | translation | Sie ist aus Manchester. (ein Mädchen) [de] | She is from Manchester. (full) ; She's from Manchester. (full) | deToEn |
| g1u02.gi.to-be.tr.004 | translation | He is from York. [en] | Er ist aus York. (full) ; Er kommt aus York. (partial) | enToDe |
| g1u02.gi.to-be.tr.005 | translation | I am happy. [en] | Ich bin glücklich. (full) ; Ich bin froh. (partial) | enToDe |
| g1u02.gi.to-be.tr.006 | translation | Sie sind aus York. (mehrere Personen) [de] | They are from York. (full) ; They're from York. (full) | deToEn |
| g1u02.gi.to-be.tr.008 | translation | Wir sind in der Klasse 7. [de] | We are in class 7. (full) ; We're in class 7. (full) | deToEn |
| g1u02.gi.to-be.tr.009 | translation | Der Pinguin ist klein. [de] | The penguin is small. (full) ; It is small. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u02/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u02",
  "lens": "translation",
  "itemsHash": "70212a6b7573",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 72, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
