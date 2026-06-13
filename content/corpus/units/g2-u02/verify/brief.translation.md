# Verify lens — translation — g2-u02 (round 2)

<!-- domigo:verify translation g2-u02 items=0316b35dcf62 prompt=c6328b13b073 round=2 -->

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

## Vocab items (36)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u02.w.admission-fee | admission fee | Eintritt | admission fee (full) | Eintritt (full) ; Eintrittspreis (full) ; Eintrittsgeld (partial) |
| g2u02.w.anyone | anyone | irgendjemand | anyone (full) ; anybody (partial) | irgendjemand (full) ; jemand (partial) |
| g2u02.w.artist | artist | Künstler/Künstlerin | artist (full) | Künstler (full) ; Künstlerin (full) ; Künstler/Künstlerin (full) |
| g2u02.w.awesome | awesome | großartig | awesome (full) | großartig (full) ; fantastisch (full) ; beeindruckend (partial) |
| g2u02.w.behaviour | behaviour | Verhalten | behaviour (full) ; behavior (partial) | Verhalten (full) ; Benehmen (partial) |
| g2u02.w.boring | boring | langweilig | boring (full) | langweilig (full) |
| g2u02.w.confusing | confusing | verwirrend | confusing (full) | verwirrend (full) |
| g2u02.w.difficult | difficult | schwierig | difficult (full) | schwierig (full) ; schwer (full) |
| g2u02.w.dirty | dirty | schmutzig | dirty (full) | schmutzig (full) ; dreckig (full) |
| g2u02.w.embarrassed | embarrassed | verlegen | embarrassed (full) | verlegen (full) ; beschämt (full) ; es war mir peinlich (partial) |
| g2u02.w.exciting | exciting | spannend | exciting (full) | spannend (full) ; aufregend (full) |
| g2u02.w.exhibition | exhibition | Ausstellung | exhibition (full) | Ausstellung (full) |
| g2u02.w.funny | funny | lustig | funny (full) | lustig (full) ; komisch (full) ; witzig (partial) |
| g2u02.w.i-promise | I promise. | Ich verspreche es. | I promise. (full) ; I promise (full) | Ich verspreche es. (full) ; Versprochen! (partial) |
| g2u02.w.mess | mess | Unordnung | mess (full) | Unordnung (full) ; Durcheinander (full) ; Chaos (partial) |
| g2u02.w.modern | modern | modern | modern (full) | modern (full) ; neu (partial) |
| g2u02.w.museum | museum | Museum | museum (full) | Museum (full) |
| g2u02.w.password | password | Passwort | password (full) | Passwort (full) ; Kennwort (partial) |
| g2u02.w.plate | plate | Teller | plate (full) | Teller (full) |
| g2u02.w.possible | possible | möglich | possible (full) | möglich (full) |
| g2u02.w.posting | posting | Posting | posting (full) | Posting (full) ; Beitrag (full) |
| g2u02.w.sculpture | sculpture | Skulptur | sculpture (full) | Skulptur (full) ; Statue (partial) |
| g2u02.w.secret | secret | Geheimnis | secret (full) | Geheimnis (full) |
| g2u02.w.such | such | so (ein) | such (full) | so ein (full) ; solch (full) ; so eine (partial) |
| g2u02.w.surprise-party | surprise party | Überraschungsparty | surprise party (full) | Überraschungsparty (full) ; Überraschungsfest (partial) |
| g2u02.w.tip | tip | Tipp | tip (full) | Tipp (full) ; Hinweis (full) ; Ratschlag (partial) |
| g2u02.w.to-add | to add | hinzufügen | add (full) ; to add (full) | hinzufügen (full) ; dazugeben (full) |
| g2u02.w.to-be-part-of | to be part of | Teil von etw. sein | be part of (full) ; to be part of (full) ; part of (full) | Teil von etwas sein (full) ; zu etwas gehören (partial) |
| g2u02.w.to-be-worth | to be worth | wert sein | be worth (full) ; to be worth (full) ; worth (full) | wert sein (full) ; wert (partial) |
| g2u02.w.to-contact | to contact | kontaktieren | contact (full) ; to contact (full) | kontaktieren (full) ; sich melden bei (partial) |
| g2u02.w.to-fail | to fail | durchfallen | fail (full) ; to fail (full) | durchfallen (full) ; scheitern (full) ; nicht bestehen (partial) |
| g2u02.w.to-organise | to organise | organisieren | organise (full) ; to organise (full) ; organize (partial) | organisieren (full) ; veranstalten (partial) |
| g2u02.w.to-pass-on | to pass on | weitergeben | pass on (full) ; to pass on (full) | weitergeben (full) ; weiterleiten (partial) |
| g2u02.w.to-post | to post | posten | post (full) ; to post (full) | posten (full) ; online stellen (partial) |
| g2u02.w.upset | upset | verärgert | upset (full) | verärgert (full) ; aufgebracht (full) ; traurig (partial) |
| g2u02.w.what-s-the-matter | What's the matter? | Was ist los? | What's the matter? (full) ; What is the matter? (full) | Was ist los? (full) ; Was ist denn los? (partial) |

## Grammar items (6 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u02.gi.irregular-verbs.tr.001 | translation | Ich habe gestern ein Buch gekauft. [de] | I bought a book yesterday. (full) ; I bought a book yesterday (full) ; Yesterday I bought a book. (full) ; Yesterday I bought a book (full) ; I bought a new book yesterday. (partial) ; I bought a new book yesterday (partial) | deToEn |
| g2u02.gi.irregular-verbs.tr.002 | translation | Er hat keinen Kuchen gemacht. [de] | He didn't make a cake. (full) ; He didn't make a cake (full) ; He did not make a cake. (full) ; He did not make a cake (full) | deToEn |
| g2u02.gi.past-simple-negation.tr.001 | translation | Sie hat den Brief nicht gelesen. [de] | She didn't read the letter. (full) ; She didn't read the letter (full) ; She did not read the letter. (full) ; She did not read the letter (full) | deToEn |
| g2u02.gi.past-simple-questions.tr.001 | translation | Hast du die Geschichte gelesen? [de] | Did you read the story? (full) ; Did you read the story (full) | deToEn |
| g2u02.gi.past-simple-questions.tr.002 | translation | War Tom gestern krank? [de] | Was Tom ill yesterday? (full) ; Was Tom ill yesterday (full) | deToEn |
| g2u02.gi.why-because.tr.001 | translation | Warum bist du so glücklich? — Weil ich einen Hund habe. [de] | Why are you so happy? — Because I have a dog. (full) ; Why are you so happy? Because I have a dog. (full) ; Why are you so happy? — Because I have got a dog. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u02/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u02",
  "lens": "translation",
  "itemsHash": "0316b35dcf62",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 42, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
