# Verify lens — translation — g2-u01 (round 6)

<!-- domigo:verify translation g2-u01 items=015265583952 prompt=c6328b13b073 round=6 -->

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

## Vocab items (48)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g2u01.w.along | along | entlang | along (full) | entlang (full) ; an etwas entlang (partial) |
| g2u01.w.area | area | Gebiet | area (full) | Gebiet (full) ; Region (full) ; Gegend (partial) |
| g2u01.w.art | art | Kunst | art (full) | Kunst (full) |
| g2u01.w.as-soon-as | as soon as | sobald (wie) | as soon as (full) | sobald (full) ; sobald wie (full) |
| g2u01.w.bicycle-lane | bicycle lane | Radweg | bicycle lane (full) ; bike lane (partial) | Radweg (full) ; Fahrradweg (partial) |
| g2u01.w.break | break | Pause | break (full) ; breaks (full) | Pause (full) ; die Pause (partial) |
| g2u01.w.calendar | calendar | Kalender | calendar (full) | Kalender (full) |
| g2u01.w.colourful | colourful | bunt | colourful (full) ; colorful (partial) | bunt (full) ; farbenfroh (full) ; farbig (partial) |
| g2u01.w.daily | daily | täglich | daily (full) | täglich (full) |
| g2u01.w.design-and-technology | design and technology | Werken | design and technology (full) | Werken (full) |
| g2u01.w.english | English | Englisch | English (full) | Englisch (full) |
| g2u01.w.french | French | Französisch | French (full) | Französisch (full) |
| g2u01.w.geography | geography | Geografie | geography (full) | Geografie (full) ; Geographie (full) |
| g2u01.w.glad | glad | froh | glad (full) ; happy (partial) | froh (full) ; glücklich (partial) |
| g2u01.w.grandmother | grandmother | Großmutter | grandmother (full) ; grandma (partial) | Großmutter (full) ; Oma (partial) |
| g2u01.w.history | history | Geschichte | history (full) | Geschichte (full) |
| g2u01.w.information-technology | information technology (IT) | Informatik | information technology (full) ; IT (full) | Informatik (full) |
| g2u01.w.joke | joke | Witz | joke (full) | Witz (full) ; Scherz (partial) |
| g2u01.w.kilometre | kilometre | Kilometer | kilometre (full) ; kilometer (partial) | Kilometer (full) |
| g2u01.w.king | king | König | king (full) | König (full) |
| g2u01.w.lesson | lesson | Unterrichtsstunde | lesson (full) | Unterrichtsstunde (full) ; Stunde (full) ; Schulstunde (partial) |
| g2u01.w.maths | maths | Mathematik | maths (full) ; math (partial) | Mathematik (full) ; Mathe (full) |
| g2u01.w.music | music | Musik | music (full) | Musik (full) |
| g2u01.w.noisy | noisy | laut | noisy (full) ; loud (partial) | laut (full) ; geräuschvoll (partial) |
| g2u01.w.online-safety | online safety | Internetsicherheit | online safety (full) | Internetsicherheit (full) ; Online-Sicherheit (partial) |
| g2u01.w.opinion | opinion | Meinung | opinion (full) | Meinung (full) ; Ansicht (partial) |
| g2u01.w.physical-education | physical education (PE) | Sport | PE (full) ; physical education (full) | Sport (full) ; Leibeserziehung (full) ; Turnen (full) |
| g2u01.w.popular | popular | beliebt | popular (full) | beliebt (full) |
| g2u01.w.queen | queen | Königin | queen (full) | Königin (full) |
| g2u01.w.rubbish | rubbish | Müll | rubbish (full) ; trash (partial) ; garbage (partial) | Müll (full) ; Abfall (full) |
| g2u01.w.scary | scary | furchterregend | scary (full) | furchterregend (full) ; unheimlich (full) ; gruselig (partial) |
| g2u01.w.science | science | Naturwissenschaften | science (full) | Naturwissenschaften (full) ; Naturwissenschaft (full) |
| g2u01.w.shadow | shadow | Schatten | shadow (full) | Schatten (full) |
| g2u01.w.spring | spring | Frühling | spring (full) | Frühling (full) ; Frühjahr (partial) |
| g2u01.w.subject | (school) subject | (Schul-)Fach | subject (full) ; school subject (full) ; subjects (full) | Fach (full) ; Schulfach (full) ; Unterrichtsfach (partial) |
| g2u01.w.supper | supper | Abendessen | supper (full) | Abendessen (full) ; Nachtmahl (full) ; Abendbrot (partial) |
| g2u01.w.timetable | timetable | Stundenplan | timetable (full) ; timetables (full) | Stundenplan (full) ; der Stundenplan (partial) |
| g2u01.w.to-book | to book | buchen | book (full) ; to book (full) | buchen (full) ; reservieren (partial) |
| g2u01.w.to-crawl | to crawl | kriechen | crawl (full) ; to crawl (full) ; crawled (full) ; crawls (full) | kriechen (full) ; krabbeln (full) |
| g2u01.w.to-get-dressed | to get dressed | sich anziehen | to get dressed (full) ; get dressed (full) | sich anziehen (full) ; anziehen (partial) |
| g2u01.w.to-go-for-a-walk | to go for a walk | spazieren gehen | to go for a walk (full) ; go for a walk (full) | spazieren gehen (full) ; einen Spaziergang machen (partial) |
| g2u01.w.to-prepare | to prepare | (zu-)bereiten | to prepare (full) ; prepare (full) | zubereiten (full) ; bereiten (full) ; vorbereiten (partial) |
| g2u01.w.to-put-on | to put on | anziehen (Kleidung) | to put on (full) ; put on (full) | anziehen (full) ; anlegen (partial) |
| g2u01.w.to-stay-at-home | to stay at home | zu Hause bleiben | stay at home (full) ; to stay at home (full) | zu Hause bleiben (full) ; daheim bleiben (partial) |
| g2u01.w.to-take-a-rest | to take a rest | sich ausruhen | take a rest (full) ; to take a rest (full) ; takes a rest (full) | sich ausruhen (full) ; eine Pause machen (full) ; ausruhen (partial) |
| g2u01.w.to-travel | to travel | reisen | travel (full) ; to travel (full) | reisen (full) |
| g2u01.w.to-visit | to visit | besichtigen | visit (full) ; to visit (full) ; visited (full) ; visits (full) | besichtigen (full) ; besuchen (full) ; ansehen (partial) |
| g2u01.w.webpage | webpage | Internetseite | webpage (full) ; web page (partial) | Internetseite (full) ; Webseite (partial) |

## Grammar items (1 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g2u01.gi.past-simple.tr.001 | translation | Gestern habe ich nach dem Abendessen ferngesehen. [de] | Yesterday, I watched TV after dinner. (full) ; I watched TV after dinner yesterday. (full) ; Yesterday I watched TV after supper. (full) ; Yesterday, I watched television after dinner. (partial) | deToEn |

## Output contract

Write `content/corpus/units/g2-u01/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g2-u01",
  "lens": "translation",
  "itemsHash": "015265583952",
  "promptHash": "c6328b13b073",
  "round": 6,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 49, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
