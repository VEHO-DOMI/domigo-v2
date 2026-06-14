# Verify lens — translation — g2-u07 (round 2)

<!-- domigo:verify translation g2-u07 items=ce0bece2461f prompt=c6328b13b073 round=2 -->

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

## Vocab items (30)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u07.w.communication | communication | Kommunikation | communication (full) | Kommunikation (full) ; Verständigung (partial) |
| g2u07.w.disappointment | disappointment | Enttäuschung | disappointment (full) | Enttäuschung (full) ; die Enttäuschung (full) |
| g2u07.w.excuse | excuse | Ausrede | excuse (full) | Ausrede (full) ; Entschuldigung (partial) |
| g2u07.w.fancy-dress-party | fancy dress party | Kostümparty | fancy dress party (full) | Kostümparty (full) ; Verkleidungsparty (partial) |
| g2u07.w.german | German | Deutsch | German (full) | Deutsch (full) |
| g2u07.w.group-chat | group chat | Gruppenchat | group chat (full) | Gruppenchat (full) |
| g2u07.w.honestly | honestly | ehrlich | honestly (full) | ehrlich (full) ; wirklich (full) ; ehrlich gesagt (partial) |
| g2u07.w.instead | instead | stattdessen | instead (full) | stattdessen (full) ; dafür (partial) |
| g2u07.w.row | row | (Sitz-)Reihe | row (full) | Reihe (full) ; Sitzreihe (full) ; die Reihe (full) |
| g2u07.w.social-media | social media | soziale Medien | social media (full) | soziale Medien (full) |
| g2u07.w.sold-out | sold out | ausverkauft | sold out (full) | ausverkauft (full) |
| g2u07.w.that-s-a-pity | That's a pity. | Das ist schade! | That's a pity (full) ; That is a pity (full) | Das ist schade (full) ; Das ist schade! (full) ; Schade (partial) |
| g2u07.w.ticket | ticket | Eintrittskarte | ticket (full) | Eintrittskarte (full) ; Ticket (full) ; Karte (full) |
| g2u07.w.to-be-ashamed | to be ashamed | sich schämen | be ashamed (full) ; ashamed (full) ; to be ashamed (full) | sich schämen (full) ; beschämt sein (partial) |
| g2u07.w.to-be-worried | to be worried | besorgt sein | be worried (full) ; worried (full) ; to be worried (full) | besorgt sein (full) ; besorgt (full) ; sich Sorgen machen (partial) |
| g2u07.w.to-come-over | to come over | vorbeikommen | come over (full) ; to come over (full) | vorbeikommen (full) ; rüberkommen (partial) |
| g2u07.w.to-crash | to crash | einen Unfall bauen | crash (full) ; to crash (full) | einen Unfall bauen (full) ; verunglücken (partial) ; gegen etwas fahren (partial) |
| g2u07.w.to-do-nothing | to do nothing | nichts tun | do nothing (full) ; to do nothing (full) | nichts tun (full) ; nichts machen (full) |
| g2u07.w.to-do-the-shopping | to do the shopping | einkaufen gehen | do the shopping (full) ; to do the shopping (full) | einkaufen gehen (full) ; einkaufen (full) ; Einkäufe machen (partial) |
| g2u07.w.to-do-your-homework | to do your homework | Hausaufgaben machen | do your homework (full) ; to do your homework (full) ; do my homework (full) | Hausaufgaben machen (full) ; deine Hausaufgaben machen (full) ; die Hausaufgaben machen (partial) |
| g2u07.w.to-get-into-trouble | to get into trouble | in Schwierigkeiten geraten | get into trouble (full) ; to get into trouble (full) | in Schwierigkeiten geraten (full) ; Ärger bekommen (full) ; Ärger kriegen (partial) |
| g2u07.w.to-have-a-party | to have a party | eine Party machen | have a party (full) ; to have a party (full) | eine Party machen (full) ; eine Party haben (full) ; eine Party feiern (partial) |
| g2u07.w.to-play-basketball | to play basketball | Basketball spielen | play basketball (full) ; to play basketball (full) | Basketball spielen (full) |
| g2u07.w.to-stay-at-a-friend-s-house | to stay at a friend's house | bei einem Freund übernachten | stay at a friend's house (full) ; to stay at a friend's house (full) | bei einem Freund übernachten (full) ; bei einer Freundin übernachten (full) ; bei einem Freund schlafen (partial) |
| g2u07.w.to-take-it-easy | to take it easy | sich entspannen | take it easy (full) ; to take it easy (full) | sich entspannen (full) ; es ruhig angehen lassen (full) ; sich ausruhen (partial) |
| g2u07.w.to-tell-a-lie | to tell a lie | lügen | tell a lie (full) ; to tell a lie (full) ; tell lies (full) | lügen (full) ; eine Lüge erzählen (full) |
| g2u07.w.to-tidy-your-room | to tidy your room | dein Zimmer aufräumen | tidy your room (full) ; to tidy your room (full) ; tidy my room (full) | dein Zimmer aufräumen (full) ; mein Zimmer aufräumen (full) ; das Zimmer aufräumen (partial) |
| g2u07.w.to-watch-a-film | to watch a film | einen Film schauen | watch a film (full) ; to watch a film (full) | einen Film schauen (full) ; einen Film ansehen (full) ; einen Film anschauen (full) |
| g2u07.w.truth | truth | Wahrheit | truth (full) | Wahrheit (full) ; die Wahrheit (full) |
| g2u07.w.what-a-shame | What a shame! | Wie schade! | What a shame (full) ; What a shame! (full) | Wie schade (full) ; Wie schade! (full) ; So ein Pech (partial) |

## Grammar items (3 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u07.gi.going-to-negative.tr.001 | translation | Ich werde meine Hausaufgaben heute nicht machen. [de] | I'm not going to do my homework today. (full) ; I am not going to do my homework today. (full) ; I'm not going to do my homework today (full) | deToEn |
| g2u07.gi.might.tr.001 | translation | Wir gehen vielleicht morgen ins Kino. [de] | We might go to the cinema tomorrow. (full) ; We might go to the cinema tomorrow (full) | deToEn |
| g2u07.gi.might.tr.003 | translation | Er kommt heute vielleicht nicht vorbei. Es geht ihm nicht gut. [de] | He might not come over today. He is ill. (full) ; He might not come over today. He is ill (full) ; He might not come over today. He isn't well. (partial) ; He might not come over today. He's not well. (partial) ; He might not come over today. He's not feeling well. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u07/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u07",
  "lens": "translation",
  "itemsHash": "ce0bece2461f",
  "promptHash": "c6328b13b073",
  "round": 2,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 33, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
