# Verify lens — translation — g1-u11 (round 2)

<!-- domigo:verify translation g1-u11 items=e2b0f58f9867 prompt=c6328b13b073 round=2 -->

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

## Vocab items (58)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g1u11.w.9-a-m | 9 a.m. | 9 Uhr morgens | 9 a.m. (full) | 9 Uhr morgens (full) ; 9 Uhr vormittags (partial) |
| g1u11.w.9-o-clock | 9 o'clock | 9 Uhr | 9 o'clock (full) | 9 Uhr (full) |
| g1u11.w.9-p-m | 9 p.m. | 9 Uhr abends | 9 p.m. (full) | 9 Uhr abends (full) |
| g1u11.w.amazing | amazing | großartig | amazing (full) | großartig (full) ; erstaunlich (full) |
| g1u11.w.bedtime | bedtime | Schlafenszeit | bedtime (full) | Schlafenszeit (full) |
| g1u11.w.break | break | Pause | break (full) | Pause (full) |
| g1u11.w.bush | bush | Busch | bush (full) | Busch (full) |
| g1u11.w.clock | clock | Uhr | clock (full) | Uhr (full) |
| g1u11.w.clue | clue | Hinweis | clue (full) | Hinweis (full) ; Tipp (full) |
| g1u11.w.daily | daily | täglich | daily (full) | täglich (full) |
| g1u11.w.excuse-me | Excuse me. | Entschuldigung. | Excuse me. (full) | Entschuldigung. (full) ; Entschuldige. (partial) |
| g1u11.w.exercise | exercise | (körperliche) Bewegung | exercise (full) | Bewegung (full) ; Übung (partial) |
| g1u11.w.free-time | free time | Freizeit | free time (full) | Freizeit (full) |
| g1u11.w.half-an-hour | half an hour | eine halbe Stunde | half an hour (full) | eine halbe Stunde (full) |
| g1u11.w.half-past-nine | half past nine | halb zehn | half past nine (full) | halb zehn (full) |
| g1u11.w.have-fun | Have fun! | Viel Spaß! | Have fun! (full) | Viel Spaß! (full) |
| g1u11.w.hurry-up | Hurry up. | Beeil dich. / Beeilt euch. | Hurry up. (full) | Beeil dich. (full) ; Beeilt euch. (full) |
| g1u11.w.it-s-10-a-m | It's 10 a.m. | Es ist 10 Uhr morgens/vormittags. | It's 10 a.m. (full) | Es ist 10 Uhr morgens. (full) ; Es ist 10 Uhr vormittags. (full) |
| g1u11.w.it-s-8-p-m | It's 8 p.m. | Es ist 8 Uhr abends. | It's 8 p.m. (full) | Es ist 8 Uhr abends. (full) |
| g1u11.w.knock | knock | Klopfen | knock (full) | Klopfen (full) |
| g1u11.w.living-room | living room | Wohnzimmer | living room (full) | Wohnzimmer (full) |
| g1u11.w.midday | midday | Mittag | midday (full) | Mittag (full) |
| g1u11.w.midnight | midnight | Mitternacht | midnight (full) | Mitternacht (full) |
| g1u11.w.outside | outside | draußen | outside (full) | draußen (full) ; außerhalb (partial) |
| g1u11.w.place | place | Zuhause | place (full) | Zuhause (partial) ; Wohnung (partial) ; Ort (full) |
| g1u11.w.programme | programme | Sendung | programme (full) | Sendung (full) ; Programm (full) |
| g1u11.w.quarter-past-nine | (a) quarter past nine | Viertel nach neun | quarter past nine (full) ; a quarter past nine (full) | Viertel nach neun (full) |
| g1u11.w.quarter-to-ten | (a) quarter to ten | Viertel vor zehn | quarter to ten (full) ; a quarter to ten (full) | Viertel vor zehn (full) |
| g1u11.w.road | road | Straße | road (full) | Straße (full) ; Weg (partial) |
| g1u11.w.see-you-soon | See you soon. | Bis bald. | See you soon. (full) | Bis bald. (full) |
| g1u11.w.surprise | surprise | Überraschung | surprise (full) | Überraschung (full) |
| g1u11.w.text-message | text message | Textnachricht | text message (full) | Textnachricht (full) ; SMS (full) |
| g1u11.w.to-answer-the-door | to answer the door | die Tür aufmachen | answer the door (full) ; to answer the door (full) | die Tür aufmachen (full) |
| g1u11.w.to-cook | to cook | kochen | cook (full) ; to cook (full) | kochen (full) |
| g1u11.w.to-cook-2 | to cook | kochen | cook (full) ; to cook (full) | kochen (full) |
| g1u11.w.to-go-to-bed | to go to bed | schlafen gehen | go to bed (full) ; to go to bed (full) | schlafen gehen (full) ; ins Bett gehen (full) |
| g1u11.w.to-go-to-school | to go to school | in die Schule gehen | go to school (full) ; to go to school (full) | in die Schule gehen (full) |
| g1u11.w.to-hide | to hide | (sich) verstecken | hide (full) ; to hide (full) | sich verstecken (full) ; verstecken (full) |
| g1u11.w.to-hurry | to hurry | sich beeilen | hurry (full) ; to hurry (full) | sich beeilen (full) |
| g1u11.w.to-look-after | to look after | sich kümmern | look after (full) ; to look after (full) | sich kümmern (full) ; sich kümmern um (full) |
| g1u11.w.to-play-computer-games | to play computer games | Computerspiele spielen | play computer games (full) ; to play computer games (full) | Computerspiele spielen (full) |
| g1u11.w.to-play-football | to play football | Fußball spielen | play football (full) ; to play football (full) | Fußball spielen (full) |
| g1u11.w.to-play-the-piano | to play the piano | Klavier spielen | play the piano (full) ; to play the piano (full) | Klavier spielen (full) |
| g1u11.w.to-push | to push | schieben | push (full) ; to push (full) | schieben (full) ; drücken (full) |
| g1u11.w.to-ride-a-bike | to ride a bike | Fahrrad fahren | ride a bike (full) ; to ride a bike (full) | Fahrrad fahren (full) |
| g1u11.w.to-ride-a-horse | to ride a horse | reiten | ride a horse (full) ; to ride a horse (full) | reiten (full) |
| g1u11.w.to-ride-a-scooter | to ride a scooter | Roller fahren | ride a scooter (full) ; to ride a scooter (full) | Roller fahren (full) |
| g1u11.w.to-skate | to skate | Schlittschuh laufen | skate (full) ; to skate (full) | Schlittschuh laufen (full) ; eislaufen (partial) |
| g1u11.w.to-skateboard | to skateboard | Skateboard fahren | skateboard (full) ; to skateboard (full) | Skateboard fahren (full) |
| g1u11.w.to-ski | to ski | Ski fahren | ski (full) ; to ski (full) | Ski fahren (full) |
| g1u11.w.to-snow | to snow | schneien | snow (full) ; to snow (full) | schneien (full) |
| g1u11.w.to-snowboard | to snowboard | snowboarden | snowboard (full) ; to snowboard (full) | snowboarden (full) |
| g1u11.w.to-study | to study | lernen | study (full) ; to study (full) | lernen (full) ; studieren (partial) |
| g1u11.w.to-wake-somebody-up | to wake somebody up | jemanden aufwecken | wake somebody up (full) ; to wake somebody up (full) | jemanden aufwecken (full) |
| g1u11.w.to-watch-tv | to watch TV | fernsehen | watch TV (full) ; to watch TV (full) | fernsehen (full) |
| g1u11.w.weather | weather | Wetter | weather (full) | Wetter (full) |
| g1u11.w.what-s-the-time | What's the time? | Wie spät ist es? | What's the time? (full) ; What time is it? (partial) | Wie spät ist es? (full) |
| g1u11.w.what-time-is-it | What time is it? | Wie spät ist es? | What time is it? (full) ; What's the time? (partial) | Wie spät ist es? (full) |

## Grammar items (2 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g1u11.gi.present-continuous.tr.001 | translation | Sie spielt gerade Klavier. [de] | She is playing the piano. (full) ; She's playing the piano. (partial) | deToEn |
| g1u11.gi.present-continuous.tr.002 | translation | Schläfst du gerade? – Nein. [de] | Are you sleeping? – No, I'm not. (full) ; Are you sleeping? No, I am not. (full) ; Are you sleeping? No, I'm not. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g1-u11/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u11",
  "lens": "translation",
  "itemsHash": "e2b0f58f9867",
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
