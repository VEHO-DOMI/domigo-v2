# Verify lens — translation — g3-u09 (round 1)

<!-- domigo:verify translation g3-u09 items=154d2fd32a41 prompt=c6328b13b073 round=1 -->

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

## Vocab items (39)

| id | w | g | deToEn | enToDe |
|---|---|---|---|---|
| g3u09.w.community | community | Gemeinschaft | community (full) | Gemeinschaft (full) ; Gemeinde (full) |
| g3u09.w.conservative | conservative | konservativ | conservative (full) | konservativ (full) |
| g3u09.w.for-a-change | for a change | zur Abwechslung | for a change (full) | zur Abwechslung (full) |
| g3u09.w.it-depends | It depends. | Es kommt darauf an. | It depends. (full) ; It depends (full) | Es kommt darauf an. (full) ; Das hängt davon ab. (full) |
| g3u09.w.it-s-a-pity | It's a pity. | Das ist schade. | It's a pity. (full) ; It's a pity (full) | Das ist schade. (full) ; Schade. (full) |
| g3u09.w.journalist | journalist | Journalist/Journalistin | journalist (full) | Journalist (full) ; Journalistin (full) |
| g3u09.w.litter-picking | litter-picking | Müllsammeln | litter-picking (full) ; litter picking (full) | Müllsammeln (full) |
| g3u09.w.modern-technology | modern technology | moderne Technologie | modern technology (full) | moderne Technologie (full) ; moderne Technik (full) |
| g3u09.w.never-mind | Never mind! | Egal! | Never mind! (full) ; Never mind (full) | Egal! (full) ; Schon gut! (full) |
| g3u09.w.plenty | plenty | reichlich | plenty (full) | reichlich (full) ; genug (full) |
| g3u09.w.rude | rude | unhöflich | rude (full) | unhöflich (full) ; unverschämt (full) |
| g3u09.w.strict | strict | streng | strict (full) | streng (full) |
| g3u09.w.to-adopt | to adopt | annehmen | to adopt (full) ; adopt (full) | annehmen (full) ; übernehmen (full) |
| g3u09.w.to-be-allowed-to-do-sth | to be allowed to do sth. | etw. tun dürfen | to be allowed to do sth. (full) ; to be allowed to do something (full) ; be allowed to do sth. (full) | etw. tun dürfen (full) ; etwas tun dürfen (full) |
| g3u09.w.to-buy-your-own-clothes | to buy your own clothes | deine eigene Kleidung kaufen | to buy your own clothes (full) ; buy your own clothes (full) | deine eigene Kleidung kaufen (full) ; deine eigenen Sachen kaufen (full) |
| g3u09.w.to-come-home-after-ten | to come home after ten | nach zehn Uhr nach Hause kommen | to come home after ten (full) ; come home after ten (full) | nach zehn Uhr nach Hause kommen (full) ; nach zehn nach Hause kommen (full) |
| g3u09.w.to-dye-your-hair | to dye your hair | deine Haare färben | to dye your hair (full) ; dye your hair (full) | deine Haare färben (full) ; sich die Haare färben (full) |
| g3u09.w.to-eat-too-many-sweets | to eat too many sweets | zu viele Süßigkeiten essen | to eat too many sweets (full) ; eat too many sweets (full) | zu viele Süßigkeiten essen (full) ; zu viel Süßes essen (full) |
| g3u09.w.to-freeze | to freeze | (er-)frieren | to freeze (full) ; freeze (full) | frieren (full) ; erfrieren (full) |
| g3u09.w.to-get-a-nose-stud | to get a nose stud | sich einen Nasenstecker stechen lassen | to get a nose stud (full) ; get a nose stud (full) | sich einen Nasenstecker stechen lassen (full) ; einen Nasenstecker bekommen (full) |
| g3u09.w.to-get-a-tattoo | to get a tattoo | sich tätowieren lassen | to get a tattoo (full) ; get a tattoo (full) | sich tätowieren lassen (full) ; sich ein Tattoo machen lassen (full) |
| g3u09.w.to-go-roller-skating-without-pads | to go roller-skating without pads | ohne Schützer Rollschuh fahren | to go roller-skating without pads (full) ; go roller-skating without pads (full) | ohne Schützer Rollschuh fahren (full) ; ohne Schoner Rollschuh fahren (full) |
| g3u09.w.to-go-to-the-disco | to go to the disco | in die Disco gehen | to go to the disco (full) ; go to the disco (full) | in die Disco gehen (full) ; auf die Disco gehen (full) |
| g3u09.w.to-hang-out-in-shopping-centres | to hang out in shopping centres | in Einkaufszentren abhängen | to hang out in shopping centres (full) ; hang out in shopping centres (full) | in Einkaufszentren abhängen (full) ; in Einkaufszentren herumhängen (full) |
| g3u09.w.to-have-a-party-at-home | to have a party at home | zu Hause eine Party machen | to have a party at home (full) ; have a party at home (full) | zu Hause eine Party machen (full) ; zu Hause eine Party feiern (full) |
| g3u09.w.to-invite-sb-over | to invite sb. over | jdn. zu sich einladen | to invite sb. over (full) ; invite sb. over (full) ; to invite somebody over (full) | jdn. zu sich einladen (full) ; jemanden zu sich einladen (full) |
| g3u09.w.to-lend | to lend | (ver-)leihen | to lend (full) ; lend (full) | leihen (full) ; verleihen (full) |
| g3u09.w.to-play-video-games-all-day | to play video games all day | den ganzen Tag Videospiele spielen | to play video games all day (full) ; play video games all day (full) | den ganzen Tag Videospiele spielen (full) ; den ganzen Tag Videospiele zocken (full) |
| g3u09.w.to-pray | to pray | beten | to pray (full) ; pray (full) | beten (full) |
| g3u09.w.to-punish | to punish | bestrafen | to punish (full) ; punish (full) | bestrafen (full) |
| g3u09.w.to-remind-sb | to remind sb. | jdn. erinnern | to remind sb. (full) ; remind sb. (full) ; to remind somebody (full) | jdn. erinnern (full) ; jemanden erinnern (full) |
| g3u09.w.to-ride-your-bike-without-a-helmet | to ride your bike without a helmet | ohne Helm Fahrrad fahren | to ride your bike without a helmet (full) ; ride your bike without a helmet (full) | ohne Helm Fahrrad fahren (full) ; ohne Helm Rad fahren (full) |
| g3u09.w.to-scroll-through-your-phone | to scroll through your phone | durch dein Handy scrollen | to scroll through your phone (full) ; scroll through your phone (full) | durch dein Handy scrollen (full) ; durch das Handy scrollen (full) |
| g3u09.w.to-sort-out | to sort out | aussortieren | to sort out (full) ; sort out (full) | aussortieren (full) |
| g3u09.w.to-stay-up | to stay up | aufbleiben | to stay up (full) ; stay up (full) | aufbleiben (full) ; wach bleiben (full) |
| g3u09.w.to-turn-your-music-up-loud | to turn your music up loud | deine Musik laut aufdrehen | to turn your music up loud (full) ; turn your music up loud (full) | deine Musik laut aufdrehen (full) ; die Musik laut aufdrehen (full) |
| g3u09.w.to-watch-tv-after-10-o-clock | to watch TV after 10 o'clock | nach 22 Uhr fernsehen | to watch TV after 10 o'clock (full) ; watch TV after 10 o'clock (full) | nach 22 Uhr fernsehen (full) ; nach zehn Uhr fernsehen (full) |
| g3u09.w.to-wear-earrings | to wear earrings | Ohrringe tragen | to wear earrings (full) ; wear earrings (full) | Ohrringe tragen (full) |
| g3u09.w.unbelievable | unbelievable | unglaublich | unbelievable (full) | unglaublich (full) |

## Grammar items (8 — translation format only)

| id | fmt | prompt | answers | direction |
|---|---|---|---|---|
| g3u09.gi.be-allowed-to.tr.001 | translation | Wir dürfen im Unterricht keine Handys benutzen. [de] | We aren't allowed to use phones in class. (full) ; We are not allowed to use phones in class. (full) ; We aren't allowed to use our phones in class. (full) ; We aren't allowed to use phones in class (full) | deToEn |
| g3u09.gi.be-allowed-to.tr.002 | translation | Darf ich hier Fotos machen? [de] | Am I allowed to take photos here? (full) ; Am I allowed to take pictures here? (full) ; Am I allowed to take photos here (full) | deToEn |
| g3u09.gi.be-allowed-to.tr.003 | translation | Darf er nach zehn Uhr noch fernsehen? [de] | Is he allowed to watch TV after 10 o'clock? (full) ; Is he allowed to watch TV after ten o'clock? (full) ; Is he allowed to watch TV after 10 o'clock (full) | deToEn |
| g3u09.gi.be-allowed-to.tr.004 | translation | Darfst du zu Hause Partys feiern? [de] | Are you allowed to have parties at home? (full) ; Are you allowed to have parties at home (full) | deToEn |
| g3u09.gi.let.tr.001 | translation | Meine Eltern lassen mich am Wochenende länger aufbleiben. [de] | My parents let me stay up longer at the weekend. (full) ; My parents let me stay up later at the weekend. (full) ; My parents let me stay up longer at weekends. (full) ; My parents let me stay up later at weekends. (full) | deToEn |
| g3u09.gi.let.tr.002 | translation | Der Lehrer lässt uns im Unterricht nicht essen. [de] | The teacher doesn't let us eat in class. (full) ; The teacher does not let us eat in class. (full) ; The teacher doesn't let us eat during class. (full) | deToEn |
| g3u09.gi.let.tr.003 | translation | Meine Eltern lassen mich meine Haare nicht färben. [de] | My parents don't let me dye my hair. (full) ; My parents do not let me dye my hair. (full) | deToEn |
| g3u09.gi.let.tr.004 | translation | Meine Schwester lässt mich ihre Ohrringe tragen. [de] | My sister lets me wear her earrings. (full) | deToEn |

## Output contract

Write `content/corpus/units/g3-u09/verify/translation.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u09",
  "lens": "translation",
  "itemsHash": "154d2fd32a41",
  "promptHash": "c6328b13b073",
  "round": 1,
  "by": "fable-lens-translation",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 47, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
