# Verify lens — answers — g3-u11 (round 1)

<!-- domigo:verify answers g3-u11 items=85249bab4f34 prompt=70fa2d8cdf22 round=1 -->

<!-- domigo:prompt verify-answers v=1 -->
# Lens 2 — answer-set completeness + in-sentence grammaticality (adversarial)

You are an independent, adversarial verifier. You did NOT write these items. For every
item, attack the answer machinery:

1. **Completeness:** put yourself in the student's seat and enumerate every answer a
   competent student could legitimately give. Is each one in the answer set at the
   right tier? A CORRECT answer marked wrong is the single worst failure this app can
   ship (it is exactly how v1 died). Check especially: contractions (we should not /
   we shouldn't), British/American variants, optional subjects, word-order variants,
   plural/singular both fitting, synonyms within the bank.
2. **Grammaticality:** substitute EVERY full-tier answer into the blank/carrier and
   read the whole sentence aloud. Wrong a/an, broken agreement, double words,
   capitalization mismatches at sentence start — all `fix`.
3. **Distractor safety:** for choice formats, could any distractor be defended as
   correct in this exact context? A defensible distractor = `fix`
   (kind `distractor-plausible-correct`). Distractors must be unambiguously wrong.
4. **Blank arity:** the declared blanks, the `___` markers, and the per-blank pipe
   segments in answers must agree (the machine checks counts; you check SENSE — does
   each segment actually fit its blank?).
5. **strict flag:** items where fuzzy matching would wrongly accept near-misses
   (minimal pairs like "should/shouldn't"!) need `strict: true` — flag if missing
   (kind `answer-incomplete`, say so in the note).

Flag kind menu: `answer-incomplete`, `answer-ungrammatical`,
`distractor-plausible-correct`. Severity `fix` for anything that would mis-grade a
real student; `warn` for defensible-but-improvable.

## Vocab items (37)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u11.w.a-dry-place | a dry place | a spot with very little rain and no wet ground. | Always keep your matches in ___ so they stay dry and still light when you need them. | a dry place (full) ; dry place (partial) | a dry place (full) ; dry place (full) | a backpack ; a ridge ; a ferry |
| g3u11.w.backpack | backpack | a big bag you carry on your back, with your food and a drink inside for a long walk. | We all had a ___ on our back, with food and a drink inside for the one-day walk. | backpack (full) ; backpacks (partial) | backpack (full) ; a backpack (full) | ferry ; ridge ; canyon |
| g3u11.w.canyon | canyon | a deep valley where high steep walls of rock go up on both sides. | We climbed down into the huge ___ where the walls of rock go up so high. | canyon (full) ; canyons (partial) | canyon (full) ; a canyon (full) | ridge ; mountain range ; ferry |
| g3u11.w.capital | capital | the most important city of a country or state, where the country is run from. | Which city is the state ___ of California - Los Angeles, Sacramento or San Francisco? | capital (full) ; capitals (partial) | capital (full) ; the capital (full) | state ; connection ; railway |
| g3u11.w.connection | connection | a link that joins two things, like the way your computer joins the internet. | His internet ___ in the old hotel was so slow that the videos would not play. | connection (full) ; connections (partial) | connection (full) ; a connection (full) | capital ; thirst ; innovation |
| g3u11.w.criminal | criminal | the man or woman who has done a crime. | Alcatraz was a famous prison and home to some of the most dangerous ___ in the US. | criminals (full) ; criminal (partial) | criminal (full) ; a criminal (full) | cyclist ; programmer ; gold digger |
| g3u11.w.cyclist | cyclist | the man or woman who is out on a bike. | There is a special lane along the road just for every ___ to ride a bike. | cyclist (full) ; cyclists (partial) | cyclist (full) ; a cyclist (full) | criminal ; programmer ; gold digger |
| g3u11.w.dirt-road | dirt road | a way for cars of hard ground with no stones on it, often way out in the country. | Out of the city, we drove along a bumpy brown ___ all the way to the old farm. | dirt road (full) ; dirt roads (partial) | dirt road (full) ; a dirt road (full) | canyon ; ridge ; railway |
| g3u11.w.fabulous | fabulous | really great and wonderful, much more than just good. | Don't forget our ___ national parks - they are some of the best in the whole world! | fabulous (full) | fabulous (full) | steep ; familiar ; guided |
| g3u11.w.familiar | familiar | well known to you, so you know it well when you look at it. | The Golden Gate Bridge is one of the most ___ sights of San Francisco. | familiar (full) | familiar (full) | steep ; guided ; independent |
| g3u11.w.ferry | ferry | a boat that carries people and cars over the sea or a river. | You can take a ___ over the water to Alcatraz Island and back. | ferry (full) ; ferries (partial) | ferry (full) ; a ferry (full) | railway ; backpack ; ridge |
| g3u11.w.four-wheel-drive | four-wheel drive | a system that gives a car a lot of power, so it holds the road well on rough ground. | We need a jeep with ___ to drive over the rough roads in the desert. | four-wheel drive (full) | four-wheel drive (full) | connection ; innovation ; shade |
| g3u11.w.gold-digger | gold digger | the man or woman who looks in the earth and in rivers to find a shiny yellow metal. | Very many ___ came to California hoping to become rich from gold. | gold diggers (full) ; gold digger (partial) | gold digger (full) ; a gold digger (full) | criminal ; cyclist ; programmer |
| g3u11.w.gold-rush | gold rush | a time when very many people hurry to one place to look for a shiny yellow metal. | The California ___ in 1849 was a time when very many people came to the American West for gold. | gold rush (full) | gold rush (full) ; the gold rush (full) | thirst ; shade ; connection |
| g3u11.w.guided | guided | led by somebody who shows you the way and talks about it. | These days you can go on a ___ tour of Alcatraz Island with a real guide. | guided (full) | guided (full) | steep ; familiar ; thirsty |
| g3u11.w.headquarters | headquarters (pl) | the main building or office of a big firm or group, where the bosses work. | Two park rangers from the park's ___ came and helped us safely back down. | headquarters (full) | headquarters (full) | canyon ; ferry ; ridge |
| g3u11.w.height | height | how tall or how high a thing is, from the ground up to the very top. | These giant redwood trees can reach a ___ of more than 100 metres. | height (full) | height (full) ; the height (full) | shade ; thirst ; connection |
| g3u11.w.independent | independent | free and not ruled by another country. | For just one month in 1846, California was an ___ country and ruled over itself. | independent (full) | independent (full) | familiar ; fabulous ; steep |
| g3u11.w.information-office | information office | a place at a station where you can ask for help, times and the way. | Ask at the ___ if you need a free map of the city or the times of the trains. | information office (full) | information office (full) ; an information office (full) | railway ; ferry ; backpack |
| g3u11.w.innovation | innovation | a clever new way of doing things, or a new machine nobody had before. | The first mobile phone was a great ___ that completely changed how people live. | innovation (full) ; innovations (partial) | innovation (full) ; an innovation (full) | connection ; capital ; thirst |
| g3u11.w.lip | lip | one of the two soft red parts of your mouth. | Her ___ were dry and red, and she was shaking and about to cry. | lips (full) ; lip (partial) | lip (full) ; lips (full) | ridge ; shade ; ferry |
| g3u11.w.mountain-range | mountain range | a long row of high rocky hills, all joined up. | The Alps are the longest ___ in Europe and run across many countries. | mountain range (full) ; mountain ranges (partial) | mountain range (full) ; a mountain range (full) | canyon ; ridge ; railway |
| g3u11.w.programmer | programmer | the man or woman whose job is to write the instructions that make computers work. | Olivia's mum has a ___ job at a big firm in Silicon Valley. | programmer (full) ; programmers (partial) | programmer (full) ; a programmer (full) | criminal ; cyclist ; gold digger |
| g3u11.w.railway | railway | the trains and the long metal tracks they run on. | The ___ service to Manchester is leaving from platform 3 in ten minutes. | railway (full) ; railways (partial) | railway (full) ; the railway (full) | ferry ; canyon ; headquarters (pl) |
| g3u11.w.ridge | ridge | the long high rocky top that runs along a mountain or hill, where you can walk along it. | From the high ___ at the top, we could look down into the valleys way down below on both sides. | ridge (full) ; ridges (partial) | ridge (full) ; a ridge (full) | canyon ; dirt road ; shade |
| g3u11.w.shade | shade (no pl) | a cooler dark area out of the bright sun. | I sat down in the cool ___ of a big rock to keep out of the burning sun. | shade (full) | shade (full) ; the shade (full) | ridge ; thirst ; height |
| g3u11.w.state | state | a part of a country that has its own government, like California in the US. | California is a big ___ in the west of the US, with cities like Los Angeles. | state (full) ; states (partial) | state (full) ; a state (full) | capital ; connection ; canyon |
| g3u11.w.steep | steep | going up or down very fast, nearly straight, so it is not easy to climb. | A canyon is deep, with ___ walls of rock that go up high on both sides. | steep (full) | steep (full) | familiar ; guided ; independent |
| g3u11.w.thirst | thirst | the feeling when you really want to drink. | After a long time in the hot sun, their ___ was so bad that they died for want of water. | thirst (full) | thirst (full) | shade ; height ; connection |
| g3u11.w.to-be-situated | to be situated | to be in a certain place or in a certain part of a country. | Death Valley is ___ between two long mountain ranges in California. | situated (full) | to be situated (full) ; be situated (full) ; situated (full) | to take over ; to commute ; to crack |
| g3u11.w.to-catch | to catch (the train) | to be at the platform in time to get on it before it leaves. | We had to run to the platform to ___ the train before it left without us. | catch (full) ; catch the train (full) ; caught (partial) | to catch (full) ; catch (full) ; to catch the train (full) ; catch the train (full) | to spot sth. ; to take over ; to commute |
| g3u11.w.to-commute | to commute | to travel to work and home again every day. | My mum ___ to the Valley every day, but she did not like the long drive at all. | commuted (full) ; commute (partial) ; commutes (partial) | to commute (full) ; commute (full) | to take over ; to spot sth. ; to crack |
| g3u11.w.to-crack | to crack | to break open or break into pieces, often with a sharp noise. | My mouth was so dry that my lips were sore and about to ___. | crack (full) ; cracked (partial) | to crack (full) ; crack (full) | to spot sth. ; to commute ; to take over |
| g3u11.w.to-have-no-signal | to have no signal | when your mobile phone does not work because it cannot connect here. | High up in the mountains we ___, so we could not call anyone for help. | have no signal (full) ; had no signal (full) | to have no signal (full) ; have no signal (full) | to be situated ; to commute ; to take over |
| g3u11.w.to-spot-sth | to spot sth. | to suddenly find somebody hiding, or a small thing that was hard to find. | It was so crowded that I couldn't ___ you in the big crowd at the match. | spot (full) ; spotted (partial) | to spot (full) ; spot (full) ; to spot sth. (full) | to commute ; to crack ; to take over |
| g3u11.w.to-take-over | to take over | to come into control of a place or thing that was not yours before. | On Sundays the road has no cars, and the cyclists ___ the whole street. | take over (full) ; took over (partial) | to take over (full) ; take over (full) | to commute ; to spot sth. ; to be situated |
| g3u11.w.totally | totally | completely, in every way, with nothing missing. | You are ___ right about this, and I agree with you. | totally (full) | totally (full) | familiar ; steep ; guided |

## Grammar items (28)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u11.gi.present-perfect-continuous.cp.001 | context-picker | Deine Hände sind voller Farbe. Jemand fragt, was du gemacht hast. Welche Antwort passt? [de] | I've been painting my room all afternoon. (full) | — | I've painting my room all afternoon. ; I've been paint my room all afternoon. ; I'm been painting my room all afternoon. | — | — | false |
| g3u11.gi.present-perfect-continuous.cp.002 | context-picker | Amelia fragt Olivia, wie lange sie schon in Kalifornien wohnt. Welche Antwort passt? [de] | We've been living here for six weeks. (full) | — | We've living here for six weeks. ; We've been live here for six weeks. ; We's been living here for six weeks. | — | — | false |
| g3u11.gi.present-perfect-continuous.ec.001 | error-correction | Finde und verbessere den Fehler: She have been working here since 2020. [de] | She has been working here since 2020. (full) ; has been working (partial) | — | — | — | — | true |
| g3u11.gi.present-perfect-continuous.ec.002 | error-correction | Finde und verbessere den Fehler: He has been play the guitar since September. [de] | He has been playing the guitar since September. (full) ; been playing (partial) ; has been playing (partial) | — | — | — | — | true |
| g3u11.gi.present-perfect-continuous.ec.003 | error-correction | Finde und verbessere den Fehler: I have living here since April. [de] | I have been living here since April. (full) ; have been living (partial) | — | — | — | — | true |
| g3u11.gi.present-perfect-continuous.ec.004 | error-correction | Finde und verbessere den Fehler: I've been knowing her since we were little. [de] | I've known her since we were little. (full) ; I have known her since we were little. (full) ; known (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.001 | gap-fill | I ___ (wait) for you all morning. [en, 1 blank(s)] | have been waiting (full) ; 've been waiting (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.002 | gap-fill | She ___ (learn) French since September. [en, 1 blank(s)] | has been learning (full) ; 's been learning (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.003 | gap-fill | It ___ (rain) all day. The streets are completely flooded. [en, 1 blank(s)] | has been raining (full) ; 's been raining (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.004 | gap-fill | My dad ___ (paint) the house all week. The house still isn't done! [en, 1 blank(s)] | has been painting (full) ; 's been painting (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.005 | gap-fill | We ___ (live) here for about six weeks now. [en, 1 blank(s)] | have been living (full) ; 've been living (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.006 | gap-fill | How long ___ you ___ (live) in California, Olivia? [en, 2 blank(s)] | have \| been living (full) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gf.007 | gap-fill | They look tired. They ___ (run) all morning. [en, 1 blank(s)] | have been running (full) ; 've been running (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.gs.003 | group-sort | Sortiere: Betont der Satz die laufende Tätigkeit oder das fertige Ergebnis? [de] | — | — | — | — | been reading: I've been reading all morning., She has been painting the house all week., They have been waiting for a long time. \| read it: I've read three books this month., She has painted the house., They have done their homework. | false |
| g3u11.gi.present-perfect-continuous.gs.004 | group-sort | Sortiere die Sätze: richtig gebaut oder falsch gebaut? [de] | — | — | — | — | ✓: She has been working all morning., We have been sightseeing all day., It has been raining all day. \| ✗: She has working all morning., We have been live here for six weeks., It have been raining all day. | false |
| g3u11.gi.present-perfect-continuous.mc.001 | multiple-choice | Wähle den richtigen Satz: Olivia wohnt seit sechs Wochen dort und immer noch. [de] | She has been living there for six weeks. (full) | — | She has living there for six weeks. ; She has been live there for six weeks. ; She have been living there for six weeks. | — | — | false |
| g3u11.gi.present-perfect-continuous.mc.002 | multiple-choice | Deine Freundin sieht müde aus. Welcher Satz erklärt, warum? [de] | She has been running all morning. (full) | — | She has running all morning. ; She has been run all morning. ; She have been running all morning. | — | — | false |
| g3u11.gi.present-perfect-continuous.mc.003 | multiple-choice | Welches Wort passt? 'I've been reading this book ___ two weeks.' [de, 1 blank(s)] | for (full) | — | since ; during ; from | — | — | false |
| g3u11.gi.present-perfect-continuous.mc.004 | multiple-choice | Welche Frage passt, um nach der Dauer einer laufenden Tätigkeit zu fragen? [de] | How long have you been learning English? (full) | — | How long are you learning English? ; How long you have been learning English? ; How long has you been learning English? | — | — | false |
| g3u11.gi.present-perfect-continuous.mt.001 | matching | Verbinde die Satzhälften. [de] | — | — | — | It's been snowing ↔ all day. ; She has been learning French ↔ since September. ; We have been living here ↔ for six weeks. ; They've been waiting ↔ since Monday. | — | false |
| g3u11.gi.present-perfect-continuous.mt.002 | matching | Verbinde die Tätigkeit mit dem Grund. [de] | — | — | — | They've been running all morning. ↔ That's why they're so tired. ; I've been studying all day. ↔ That's why I haven't been outside. ; He's been practising the guitar all evening. ↔ That's why his fingers hurt. ; She's been sleeping all afternoon. ↔ That's why she isn't awake. | — | false |
| g3u11.gi.present-perfect-continuous.qf.001 | question-formation | Bilde eine Frage mit How long: 'They have been waiting for the train.' [de] | How long have they been waiting for the train? (full) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.sb.001 | sentence-building | she / has / been / reading / since / the / morning [en] | She has been reading since the morning. (full) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.sb.002 | sentence-building | how / long / have / they / been / waiting / for / us [en] | How long have they been waiting for us? (full) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.tf.002 | transformation | Bilde aus den Angaben einen Satz: she / sit / in the waiting room / all morning. [de] | She has been sitting in the waiting room all morning. (full) ; She's been sitting in the waiting room all morning. (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.tf.003 | transformation | Schreib den Satz weiter: Deine Schwester hat um 4 Uhr zu kochen begonnen. Jetzt ist es Abend und sie kocht immer noch. 'My sister ___ all afternoon.' [de, 1 blank(s)] | has been cooking (full) ; 's been cooking (partial) | — | — | — | — | false |
| g3u11.gi.present-perfect-continuous.tr.002 | translation | Übersetze ins Englische: 'Er lernt seit September Gitarre.' [de] | He has been learning the guitar since September. (full) ; He's been learning the guitar since September. (partial) ; He has been learning guitar since September. (partial) | deToEn | — | — | — | false |
| g3u11.gi.present-perfect-continuous.tr.003 | translation | Übersetze ins Englische: 'Wir warten seit dem Morgen auf den Zug.' [de] | We have been waiting for the train all morning. (full) ; We've been waiting for the train all morning. (partial) ; We have been waiting for the train since this morning. (full) ; We've been waiting for the train since this morning. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u11/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u11",
  "lens": "answers",
  "itemsHash": "85249bab4f34",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 65, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
