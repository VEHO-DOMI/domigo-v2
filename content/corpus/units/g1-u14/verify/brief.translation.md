# Verify lens — translation — g1-u14 (round 1)

<!-- domigo:verify translation g1-u14 items=90d713f573be prompt=c6328b13b073 round=1 -->

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

## Vocab items (59)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u14.w.adventure | adventure | Abenteuer | adventure (full) | Abenteuer (full) |
| g1u14.w.adventure-story | adventure story | Abenteuergeschichte | adventure story (full) | Abenteuergeschichte (full) |
| g1u14.w.cartoon | cartoon | Zeichentrick(-film/-serie) | cartoon (full) | Zeichentrickfilm (full) ; Zeichentrickserie (full) ; Zeichentrick (full) |
| g1u14.w.comedy | comedy | Komödie | comedy (full) | Komödie (full) |
| g1u14.w.cover | cover | (Buch-)Umschlag | cover (full) | Umschlag (full) ; Buchumschlag (full) |
| g1u14.w.dead | dead | tot | dead (full) | tot (full) |
| g1u14.w.detective-story | detective story | Kriminalgeschichte | detective story (full) | Kriminalgeschichte (full) ; Krimi (full) |
| g1u14.w.drama-series | drama series | Dramaserie | drama series (full) | Dramaserie (full) |
| g1u14.w.episode | episode | Episode | episode (full) | Episode (full) ; Folge (full) |
| g1u14.w.fantasy-film | fantasy film | Fantasyfilm | fantasy film (full) | Fantasyfilm (full) |
| g1u14.w.fantasy-story | fantasy story | Fantasygeschichte | fantasy story (full) | Fantasygeschichte (full) |
| g1u14.w.friendship | friendship | Freundschaft | friendship (full) | Freundschaft (full) |
| g1u14.w.gamer | gamer | Spieler/Spielerin | gamer (full) | Spieler (full) ; Spielerin (full) ; Zocker (full) ; Zockerin (full) |
| g1u14.w.headline | headline | Schlagzeile | headline (full) | Schlagzeile (full) |
| g1u14.w.horror-story | horror story | Horrorgeschichte | horror story (full) | Horrorgeschichte (full) ; Gruselgeschichte (partial) |
| g1u14.w.huge | huge | riesig | huge (full) | riesig (full) |
| g1u14.w.inside | inside | in | inside (full) | in (partial) ; drinnen (full) |
| g1u14.w.kind-of | kind of | eine Art von | kind of (full) | eine Art von (full) |
| g1u14.w.lake | lake | See | lake (full) | See (full) |
| g1u14.w.latest | latest | neuester/neueste/neuestes | latest (full) | neueste (full) ; neuester (full) ; neuestes (full) |
| g1u14.w.leaf | leaf (pl leaves) | Blatt (Blätter) | leaf (full) ; leaves (full) | Blatt (full) ; Blätter (full) |
| g1u14.w.music-video | music video | Musikvideo | music video (full) | Musikvideo (full) |
| g1u14.w.nature-programme | nature programme | Naturdokumentation | nature programme (full) | Naturdokumentation (full) ; Tierdokumentation (partial) |
| g1u14.w.neighbour | neighbour | Nachbar/Nachbarin | neighbour (full) | Nachbar (full) ; Nachbarin (full) |
| g1u14.w.once-upon-a-time | once upon a time | es war einmal | once upon a time (full) | es war einmal (full) |
| g1u14.w.one-day | one day | eines Tages | one day (full) | eines Tages (full) |
| g1u14.w.poem | poem | Gedicht | poem (full) | Gedicht (full) |
| g1u14.w.power | power | Kraft | power (full) | Kraft (full) |
| g1u14.w.quite | quite | ziemlich | quite (full) | ziemlich (full) |
| g1u14.w.quiz-show | quiz show | Quizshow | quiz show (full) | Quizshow (full) |
| g1u14.w.reality-show | reality show | Reality-Show | reality show (full) | Reality-Show (full) ; Realityshow (full) |
| g1u14.w.remote-control | remote control | Fernbedienung | remote control (full) | Fernbedienung (full) |
| g1u14.w.romantic-film | romantic film | Liebesfilm | romantic film (full) | Liebesfilm (full) |
| g1u14.w.romantic-story | romantic story | Liebesgeschichte | romantic story (full) | Liebesgeschichte (full) |
| g1u14.w.science-fiction-film | science fiction film | Science-Fiction-Film | science fiction film (full) | Science-Fiction-Film (full) |
| g1u14.w.screen-time | screen time | Zeit vor einem Bildschirm | screen time (full) | Zeit vor einem Bildschirm (full) ; Bildschirmzeit (full) |
| g1u14.w.shopkeeper | shopkeeper | Ladenbesitzer/Ladenbesitzerin | shopkeeper (full) | Ladenbesitzer (full) ; Ladenbesitzerin (full) |
| g1u14.w.skin | skin | Haut | skin (full) | Haut (full) |
| g1u14.w.sports-programme | sports programme | Sportsendung | sports programme (full) | Sportsendung (full) |
| g1u14.w.spot | spot | Punkt | spot (full) ; spots (full) | Punkt (full) ; Fleck (partial) |
| g1u14.w.the-news | the news | die Nachrichten | the news (full) | die Nachrichten (full) ; Nachrichten (full) |
| g1u14.w.tiny | tiny | winzig | tiny (full) | winzig (full) |
| g1u14.w.to-bend-down | to bend down (bent down) | (sich) hinunterbeugen | bend down (full) ; to bend down (full) ; bent down (partial) | sich hinunterbeugen (full) ; hinunterbeugen (full) |
| g1u14.w.to-disappear | to disappear | verschwinden | disappear (full) ; to disappear (full) | verschwinden (full) |
| g1u14.w.to-fight | to fight (fought) | kämpfen (mit) | fight (full) ; to fight (full) ; fought (partial) | kämpfen (full) |
| g1u14.w.to-freeze | to freeze (froze) | erstarren | freeze (full) ; to freeze (full) ; froze (partial) | erstarren (full) ; anhalten (full) |
| g1u14.w.to-hold | to hold (held) | halten | hold (full) ; to hold (full) ; held (partial) | halten (full) |
| g1u14.w.to-hug | to hug | umarmen | hug (full) ; to hug (full) | umarmen (full) |
| g1u14.w.to-lie | to lie | liegen | lie (full) ; to lie (full) | liegen (full) |
| g1u14.w.to-pay | to pay (paid) | (be-)zahlen | pay (full) ; to pay (full) ; paid (partial) | zahlen (full) ; bezahlen (full) |
| g1u14.w.to-point-to | to point to | zeigen auf | point to (full) ; to point to (full) | zeigen auf (full) ; deuten auf (partial) |
| g1u14.w.to-reply | to reply (replied) | antworten | reply (full) ; to reply (full) ; replied (partial) | antworten (full) |
| g1u14.w.to-sell | to sell (sold) | verkaufen | sell (full) ; to sell (full) ; sold (partial) | verkaufen (full) |
| g1u14.w.to-spend | to spend | verbringen (mit) | spend (full) ; to spend (full) | verbringen (full) |
| g1u14.w.to-stream | to stream | streamen | stream (full) ; to stream (full) | streamen (full) |
| g1u14.w.voice | voice | Stimme | voice (full) | Stimme (full) |
| g1u14.w.weak | weak | schwach | weak (full) | schwach (full) |
| g1u14.w.weekend | weekend | Wochenende | weekend (full) | Wochenende (full) |
| g1u14.w.wide | wide | breit | wide (full) | breit (full) ; weit (full) |

## Grammar items (4 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u14.gi.past-simple-irregular.tr.001 | translation | Ich bin gestern in die Schule gegangen. [de] | I went to school yesterday. (full) ; Yesterday I went to school. (full) | deToEn |
| g1u14.gi.past-simple-irregular.tr.002 | translation | Sie sah eine Katze und nahm ein Foto. [de] | She saw a cat and took a photo. (full) ; She saw a cat and she took a photo. (full) | deToEn |
| g1u14.gi.past-simple-negative.tr.001 | translation | Ich habe den Film nicht gesehen. [de] | I didn't see the film. (full) ; I did not see the film. (full) | deToEn |
| g1u14.gi.past-simple-negative.tr.002 | translation | Sie hat das Buch nicht gelesen. [de] | She didn't read the book. (full) ; She did not read the book. (full) | deToEn |

## Output contract

Write `content/corpus/units/g1-u14/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u14",
  "lens": "translation",
  "itemsHash": "90d713f573be",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 63, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
