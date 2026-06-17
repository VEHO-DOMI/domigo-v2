# Verify lens — answers — g3-u03 (round 1)

<!-- domigo:verify answers g3-u03 items=5593126519b1 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (54)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u03.w.all-in-all | all in all | this shows that you have everything in your head at once | ___, we had a great time and we want to go back one day. | All in all (full) ; all in all (full) | all in all (full) | even though ; unfortunately ; on foot |
| g3u03.w.awake | awake | not sleeping | It was very dark outside, but the children were still wide ___. | awake (full) | awake (full) | thirsty ; lonely ; curious |
| g3u03.w.curious | curious | really wanting to find out about a new thing | Reading about all these faraway places makes me very ___. | curious (full) | curious (full) | lonely ; thirsty ; awake |
| g3u03.w.decision | decision | what you think is the best thing to do | For Holman, travelling was the best ___ of his whole life. | decision (full) ; decisions (partial) | decision (full) ; decisions (partial) | journey ; experience ; departure |
| g3u03.w.departure | departure | the time when a plane or train leaves | The big screen at the airport shows the ___ time of every plane. | departure (full) ; departures (partial) | departure (full) ; departures (partial) | flight ; journey ; experience |
| g3u03.w.even-though | even though | this shows that a thing is still true | ___ it was cold, we still had a great time on holiday. | Even though (full) ; even though (full) | even though (full) | all in all ; unfortunately ; recently |
| g3u03.w.experience | experience | a thing that happens to you and that you keep in your head | And in China he had a very painful ___. | experience (full) ; experiences (partial) | experience (full) ; experiences (partial) | decision ; journey ; departure |
| g3u03.w.explorer | explorer | somebody who travels to new places to find out about them | Mary Kingsley is still one of the great female ___ of the 19th century. | explorers (full) ; explorer (partial) | explorer (full) ; explorers (partial) | traveller ; journey ; decision |
| g3u03.w.flight | flight | a trip in a plane from one place to a faraway place | Our ___ to London leaves from gate 12 at 3 p.m. | flight (full) ; flights (partial) | flight (full) ; flights (partial) | departure ; journey ; decision |
| g3u03.w.hut | hut | a very small and simple home to live in | Mary lived with the people in their ___ and shared their food. | huts (full) ; hut (partial) | hut (full) ; huts (partial) | wilderness ; journey ; departure |
| g3u03.w.impossible | impossible | not able to be done at all | The room was so noisy all night that it was ___ to close my eyes. | impossible (full) | impossible (full) | painful ; thirsty ; curious |
| g3u03.w.it-takes | it takes (an hour) | this shows how much time you need to do a thing | ___ Celia many days to cross the whole country on her journey. | It takes (full) ; it takes (full) ; It took (partial) | it takes (full) ; it takes an hour (full) ; it took (partial) | to land ; to fly (back) ; to drive (home) |
| g3u03.w.journey | journey | the long way you travel from one place to a place far away | Holman's first ___ to France was long and lonely. | journey (full) ; journeys (partial) | journey (full) ; journeys (partial) | decision ; experience ; explorer |
| g3u03.w.lonely | lonely | feeling sad because you are all alone | Holman's first journey to France was ___ because no one near him could speak English. | lonely (full) | lonely (full) | curious ; thirsty ; awake |
| g3u03.w.on-foot | on foot | when you go to a place on your two feet, not in a car or train | Holman crossed Zanzibar and Tasmania ___. | on foot (full) | on foot (full) | all in all ; even though ; pretty |
| g3u03.w.painful | painful | hurting you very much | The wasps in China hurt Holman, and it was very ___. | painful (full) | painful (full) | thirsty ; curious ; awake |
| g3u03.w.pretty | pretty | rather, but not very much | The lake was ___ cold, but after a while it wasn't too bad. | pretty (full) | pretty (full) | unfortunately ; recently ; all in all |
| g3u03.w.recently | recently | a short time ago, not long ago | Your family had a short holiday ___, but it was a really bad journey. | recently (full) | recently (full) | unfortunately ; pretty ; all in all |
| g3u03.w.thirsty | thirsty | wanting a drink | I was really ___, so I asked for a glass of cold water. | thirsty (full) | thirsty (full) | awake ; curious ; lonely |
| g3u03.w.to-become | to become | to begin to be a thing that you were not before | Holman loved travelling so much that he wanted to ___ a man of adventure. | become (full) ; became (partial) ; becomes (partial) | become (full) ; to become (full) ; became (partial) | to reach ; to explore ; to behave |
| g3u03.w.to-behave | to behave | to do what is good and nice when you are with people | When we visit a new country, we must ___ well. | behave (full) ; behaved (partial) ; behaves (partial) | behave (full) ; to behave (full) ; behaved (partial) | to become ; to reach ; to explore |
| g3u03.w.to-criticise | to criticise | to tell people what is bad about a thing they do | Back in England, Mary ___ the Europeans for what they did in Africa. | criticised (full) ; criticise (partial) ; criticises (partial) | criticise (full) ; to criticise (full) ; criticised (partial) | to recommend ; to promise ; to explore |
| g3u03.w.to-cross | to cross (a river) | to go over water or a road to where you want to be. | Celia carried her backpack to ___ a river on her way across the country. | cross (full) ; cross a river (full) ; crossed (partial) | cross (full) ; to cross (full) ; to cross a river (full) ; crossed (partial) | to escape (the midday heat) ; to reach ; to rent (a car) |
| g3u03.w.to-drive | to drive (home) | to make a car go where you want to go | After the flight back, she ___ home from the airport in her car. | drives (full) ; drives home (full) ; drive (partial) ; drove (partial) | drive (full) ; to drive (full) ; drive home (full) ; drove (partial) | to fly (back) ; to sail ; to rent (a car) |
| g3u03.w.to-escape | to escape (the midday heat) | to go away from a thing that is not nice | On a long hot day you cannot ___ the midday sun. | escape (full) ; escape the midday heat (full) ; escaped (partial) | escape (full) ; to escape (full) ; to escape the midday heat (full) ; escaped (partial) | to reach ; to cross (a river) ; to behave |
| g3u03.w.to-explore | to explore | to travel into a new place to find out what is there | Holman loved to ___ the streets of a new city all alone. | explore (full) ; explored (partial) ; explores (partial) | explore (full) ; to explore (full) ; explored (partial) | to reach ; to escape (the midday heat) ; to criticise |
| g3u03.w.to-fix-sth | to fix sth. | to make a thing work again after it breaks | My dad is good with tools and can ___ anything in our home. | fix (full) ; fix sth. (full) ; fixed (partial) ; fixes (partial) | fix sth. (full) ; to fix sth. (full) ; fix (partial) ; fixed (partial) | to note ; to promise ; to recommend |
| g3u03.w.to-fly | to fly (back) | to travel high up in the sky in a plane | After a short break in Munich, she will ___ back to London in the afternoon. | fly (full) ; fly back (full) ; flew (partial) ; flew back (partial) | fly (full) ; to fly (full) ; fly back (full) ; flew (partial) | to drive (home) ; to sail ; to land |
| g3u03.w.to-get-close-to | to get close to (nature) | to come very near to a thing | On her long journey across the country, Celia wanted to ___ nature. | get close to (full) ; got close to (partial) | get close to (full) ; to get close to (full) ; to get close to nature (full) ; got close to (partial) | to escape (the midday heat) ; to cross (a river) ; to sleep in a tent |
| g3u03.w.to-get-into | to get into (a car) | to climb inside and sit down to travel somewhere. | Celia opens the door and ___ her green car. | gets into (full) ; get into (partial) ; got into (partial) | get into (full) ; to get into (full) ; to get into a car (full) ; got into (partial) | to get out of (the car) ; to rent (a car) ; to drive (home) |
| g3u03.w.to-get-lost | to get lost | to lose your way so you cannot find where you are | People often ___ in this big dark forest with no map. | get lost (full) ; got lost (partial) | get lost (full) ; to get lost (full) ; got lost (partial) | to set off (for work) ; to reach ; to turn out |
| g3u03.w.to-get-off | to get off (the plane) | to climb out of a train or a bus after you travel in it. | When she flies back, she ___ the plane at about 3 p.m. | gets off (full) ; get off (partial) ; got off (partial) | get off (full) ; to get off (full) ; to get off the plane (full) ; got off (partial) | to get on (a plane) ; to take off ; to fly (back) |
| g3u03.w.to-get-on | to get on (a plane) | to climb on a train or a bus so you can travel in it. | She ___ the plane at 6.50 a.m., before the passengers. | gets on (full) ; get on (partial) ; got on (partial) | get on (full) ; to get on (full) ; to get on a plane (full) ; got on (partial) | to get off (the plane) ; to take off ; to land |
| g3u03.w.to-get-out-of | to get out of (the car) | to climb out and come down when you arrive somewhere. | She drives home and ___ the car at about 5 p.m. | gets out of (full) ; get out of (partial) ; got out of (partial) | get out of (full) ; to get out of (full) ; to get out of the car (full) ; got out of (partial) | to get into (a car) ; to drive (home) ; to rent (a car) |
| g3u03.w.to-get-to | to get to (the airport) | to arrive at a place where you want to be | She drives fast in the morning so she can ___ the airport in time. | get to (full) ; get to the airport (full) ; got to (partial) | get to (full) ; to get to (full) ; to get to the airport (full) ; got to (partial) | to take off ; to land ; to fly (back) |
| g3u03.w.to-get-to-know-sb-sth | to get to know sb./sth. | to find out more and more about a place or a friend | Kate wanted to ___ the area near her new home. | get to know (full) ; get to know sb./sth. (full) ; got to know (partial) | get to know sb./sth. (full) ; to get to know sb./sth. (full) ; get to know (partial) ; got to know (partial) | to meet up with (people) ; to set off (for work) ; to get lost |
| g3u03.w.to-land | to land | when a plane touches the ground at the end of a flight | After a long flight, the plane ___ at the airport at about 9 a.m. | lands (full) ; land (partial) ; landed (partial) | land (full) ; to land (full) ; landed (partial) | to take off ; to get on (a plane) ; to fly (back) |
| g3u03.w.to-make-a-reservation | to make a reservation | to book a table or seat before you come | I want to ___ for a table for two people at seven o'clock tonight. | make a reservation (full) ; made a reservation (partial) | make a reservation (full) ; to make a reservation (full) ; made a reservation (partial) | to set off (for work) ; to get lost ; to fix sth. |
| g3u03.w.to-meet-up-with | to meet up with (people) | to come and be with friends at a time you both agree on | Near the end of the journey, Celia is going to ___ with her boyfriend. | meet up (full) ; meet up with (full) ; met up with (partial) | meet up with (full) ; to meet up with (full) ; to meet up with people (full) ; met up with (partial) | to get close to (nature) ; to escape (the midday heat) ; to set off (for work) |
| g3u03.w.to-note | to note | to read a thing well and keep it in your head because it is a big thing | Please ___ that you have to be at the airport early for your flight. | note (full) ; noted (partial) ; notes (partial) | note (full) ; to note (full) ; noted (partial) | to promise ; to recommend ; to behave |
| g3u03.w.to-promise | to promise | to tell somebody that you will really do a thing | I ___ to help you with your homework after school today. | promise (full) ; promised (partial) ; promises (partial) | promise (full) ; to promise (full) ; promised (partial) | to recommend ; to note ; to behave |
| g3u03.w.to-reach | to reach | to arrive at the place you were going to | After a long climb up the mountain, they were happy to ___ the hut. | reach (full) ; reached (partial) ; reaches (partial) | reach (full) ; to reach (full) ; reached (partial) | to explore ; to escape (the midday heat) ; to behave |
| g3u03.w.to-recommend | to recommend | to tell people a thing is good so they will try it too | There's a short way and a long way, but I ___ the long way because it's prettier. | recommend (full) ; recommended (partial) ; recommends (partial) | recommend (full) ; to recommend (full) ; recommended (partial) | to promise ; to note ; to criticise |
| g3u03.w.to-rent | to rent (a car) | to pay money so you can have a thing for a short time | Some people ___ a car to visit more of the country. | rent (full) ; rent a car (full) ; rented (partial) | rent (full) ; to rent (full) ; to rent a car (full) ; rented (partial) | to drive (home) ; to fly (back) ; to sail |
| g3u03.w.to-sail | to sail | to travel across the sea on a ship | Holman was on a ship to ___ across the Atlantic Ocean. | sail (full) ; sailed (partial) ; sails (partial) | sail (full) ; to sail (full) ; sailed (partial) | to fly (back) ; to drive (home) ; to reach |
| g3u03.w.to-set-off | to set off (for work) | to leave home and begin a journey | Celia ___ for work at about 5.30 a.m. while it is still dark outside. | sets off (full) ; set off (partial) ; set off for work (partial) | set off (full) ; to set off (full) ; to set off for work (full) | to get to (the airport) ; to land ; to turn out |
| g3u03.w.to-sleep-in-a-tent | to sleep in a tent | to spend the night outside under a small cloth home | On the long journey you ___ at night, far away from any hotel. | sleep in a tent (full) ; slept in a tent (partial) | sleep in a tent (full) ; to sleep in a tent (full) ; slept in a tent (partial) | to rent (a car) ; to cross (a river) ; to escape (the midday heat) |
| g3u03.w.to-suffer-from-altitude-sickness | to suffer from altitude sickness | to feel sick because you are very high up in the mountains | Very high up in the mountains, some people ___. | suffer from altitude sickness (full) ; suffered from altitude sickness (partial) | suffer from altitude sickness (full) ; to suffer from altitude sickness (full) ; suffered from altitude sickness (partial) | to take off ; to set off (for work) ; to make a reservation |
| g3u03.w.to-take-off | to take off | when a plane leaves the ground and rises into the sky | The plane ___ at 7.30 a.m. and climbs up into the sky. | takes off (full) ; take off (partial) ; took off (partial) | take off (full) ; to take off (full) ; took off (partial) | to land ; to drive (home) ; to sail |
| g3u03.w.to-turn-out | to turn out | to be true in the end | The Fang people ___ to be quite nice, which surprised Mary. | turned out (full) ; turn out (partial) ; turns out (partial) | turn out (full) ; to turn out (full) ; turned out (partial) | to become ; to behave ; to reach |
| g3u03.w.to-work-on | to work on (a blog) | to spend time making or doing a thing | Every evening, Celia ___ her blog and posts pictures from the day. | works on (full) ; work on (partial) ; worked on (partial) | work on (full) ; to work on (full) ; to work on a blog (full) ; worked on (partial) | to escape (the midday heat) ; to rent (a car) ; to behave |
| g3u03.w.traveller | traveller | somebody who travels to many places | James Holman was a record ___ who travelled more than anyone before him. | traveller (full) ; travellers (partial) ; traveler (partial) | traveller (full) ; travellers (partial) ; traveler (partial) | explorer ; decision ; journey |
| g3u03.w.unfortunately | unfortunately | this shows that you are sorry about a thing | ___, our holiday came to an end and we had to fly home after a week. | Unfortunately (full) ; unfortunately (full) | unfortunately (full) | recently ; pretty ; all in all |
| g3u03.w.wilderness | wilderness | a wild area, a long way from any town, where no people live | Mary had many dangerous adventures in the ___, a long way from any town. | wilderness (full) | wilderness (full) | hut ; journey ; departure |

## Grammar items (114)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u03.gi.it-takes.cp.004 | context-picker | Ein neuer Mitschüler fragt, wie lange dein Schulweg am Morgen dauert. Sag es ihm. [de] | It takes me twenty minutes to walk to school. (full) | — | I take twenty minutes to walk to school. ; It takes me twenty minutes walk to school. ; It takes me twenty minutes for walk to school. | — | — | false |
| g3u03.gi.it-takes.cp.005 | context-picker | Gestern hat deine Klasse gemeinsam das Zimmer geputzt. Sag, wie lange es gedauert hat. [de] | It took us an hour to clean the room. (full) | — | It takes us an hour to clean the room yesterday. ; It taked us an hour to clean the room. ; We took an hour to clean the room. | — | — | false |
| g3u03.gi.it-takes.cp.006 | context-picker | Du willst deinen Brieffreund fragen, wie lange sein Schulweg dauert. Wähle die richtige Frage. [de] | How long does it take you to get to school? (full) | — | How long do you take to get to school? ; How long does it take you get to school? ; How long it takes you to get to school? | — | — | false |
| g3u03.gi.it-takes.ec.001 | error-correction | Finde und verbessere den Fehler: I take twenty minutes to get to school. [de] | It takes me twenty minutes to get to school. (full) ; It takes me (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.002 | error-correction | Finde und verbessere den Fehler: It takes me ten minutes walk to the bus stop. [de] | It takes me ten minutes to walk to the bus stop. (full) ; to walk (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.003 | error-correction | Finde und verbessere den Fehler: It takes me two hours to get to my grandma's village yesterday. [de] | It took me two hours to get to my grandma's village yesterday. (full) ; took (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.004 | error-correction | Finde und verbessere den Fehler: It needs me twenty minutes to walk to school. [de] | It takes me twenty minutes to walk to school. (full) ; takes (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.005 | error-correction | Finde und verbessere den Fehler: It taked us a long time to reach the village. [de] | It took us a long time to reach the village. (full) ; took (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.006 | error-correction | Finde und verbessere den Fehler: I take an hour to do my homework. [de] | It takes me an hour to do my homework. (full) ; It takes me (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.ec.007 | error-correction | Finde und verbessere den Fehler: How long it takes you to cycle to school? [de] | How long does it take you to cycle to school? (full) ; does it take (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.gf.001 | gap-fill | It ___ me twenty minutes to walk to school every day. [en, 1 blank(s)] | takes (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.002 | gap-fill | It ___ her about fifteen minutes to get dressed in the morning. [en, 1 blank(s)] | takes (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.003 | gap-fill | It ___ us two hours to drive to Vienna last weekend. [en, 1 blank(s)] | took (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.004 | gap-fill | It takes her an hour ___ finish her homework. [en, 1 blank(s)] | to (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.005 | gap-fill | It takes me an hour ___ do my homework every day. [en, 1 blank(s)] | to (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.006 | gap-fill | How long does ___ take you to get to school? [en, 1 blank(s)] | it (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.007 | gap-fill | How long does it ___ you to cycle to school? [en, 1 blank(s)] | take (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.008 | gap-fill | It doesn't ___ long to learn this dance. [en, 1 blank(s)] | take (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.009 | gap-fill | It will ___ us about three hours to drive to the beach. [en, 1 blank(s)] | take (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.010 | gap-fill | It ___ the whole class thirty minutes to finish the project yesterday. [en, 1 blank(s)] | took (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.011 | gap-fill | It ___ me five minutes to make a sandwich. [en, 1 blank(s)] | takes (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.012 | gap-fill | It ___ (take) my dad three years to learn English when he was young. [en, 1 blank(s)] | took (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gf.013 | gap-fill | Fülle beide Lücken: It ___ us about an hour ___ cook dinner. [de, 2 blank(s)] | takes \| to (full) | — | — | — | — | false |
| g3u03.gi.it-takes.gf.014 | gap-fill | It ___ them an hour to clean the room. [en, 1 blank(s)] | took (full) ; takes (full) | — | — | — | — | false |
| g3u03.gi.it-takes.gf.015 | gap-fill | It ___ me ten minutes to cycle to the lake. [en, 1 blank(s)] | takes (full) | — | — | — | — | true |
| g3u03.gi.it-takes.gs.004 | group-sort | Sortiere: richtig oder falsch? [de] | — | — | — | — | ✓: It takes me twenty minutes to walk to school., It took us an hour to cook dinner., How long does it take you to get to school? \| ✗: I take twenty minutes to walk to school., It takes me twenty minutes walk to school., It taked us an hour to cook dinner. | false |
| g3u03.gi.it-takes.gs.005 | group-sort | Sortiere: takes (jetzt) oder took (früher)? [de] | — | — | — | — | Now (takes): It takes me ten minutes to walk to school., It takes her an hour to cook dinner., How long does it take you to get dressed? \| Yesterday (took): It took us two hours to drive home., It took the class an hour to finish the project., How long did it take you to read the book? | false |
| g3u03.gi.it-takes.mc.005 | multiple-choice | It ___ me twenty minutes to cycle to school. [en, 1 blank(s)] | takes (full) | — | take ; took ; taking | — | — | false |
| g3u03.gi.it-takes.mc.006 | multiple-choice | It ___ us three hours to drive to the city last weekend. [en, 1 blank(s)] | took (full) | — | takes ; take ; taking | — | — | false |
| g3u03.gi.it-takes.mc.007 | multiple-choice | Welcher Satz ist richtig? [de] | It takes me thirty minutes to get to school. (full) | — | I take thirty minutes to get to school. ; It takes me thirty minutes get to school. ; It needs me thirty minutes to get to school. | — | — | false |
| g3u03.gi.it-takes.mc.008 | multiple-choice | Welcher Satz ist richtig? [de] | It takes me ten minutes to walk to the bus stop. (full) | — | It takes me ten minutes for walk to the bus stop. ; It takes I ten minutes to walk to the bus stop. ; I take ten minutes to walk to the bus stop. | — | — | false |
| g3u03.gi.it-takes.mc.010 | multiple-choice | Welche Frage ist richtig? [de] | How long does it take you to get to school? (full) | — | How long does it takes you to get to school? ; How long it takes you to get to school? ; How long do you take to get to school? | — | — | false |
| g3u03.gi.it-takes.mc.011 | multiple-choice | Welcher Satz erzählt richtig von gestern? [de] | It took us two hours to finish the project. (full) | — | It taked us two hours to finish the project. ; It takes us two hours to finish the project yesterday. ; It was taking us two hours to finish the project. | — | — | false |
| g3u03.gi.it-takes.mp.002 | matching-pairs | Welche Antwort passt zu welcher Frage? [de] | — | — | — | How long does it take you to walk to school? ↔ It takes me ten minutes. ; How long does it take to fly to Vienna? ↔ It takes about an hour. ; How long did it take to drive home? ↔ It took us two hours. ; How long does it take to make a cake? ↔ It takes half an hour. | — | false |
| g3u03.gi.it-takes.mt.002 | matching | Welches Ende passt zu welchem Anfang? [de] | — | — | — | It takes me five minutes ↔ to brush my teeth. ; It took us all day ↔ to climb the mountain. ; How long does it take you ↔ to get to school? ; It doesn't take long ↔ to learn this dance. | — | false |
| g3u03.gi.it-takes.qf.001 | question-formation | It takes Amy thirty minutes to get dressed. Ask how long it takes Amy. [en] | How long does it take Amy to get dressed? (full) ; How long does it take her to get dressed? (full) | — | — | — | — | false |
| g3u03.gi.it-takes.qf.003 | question-formation | Dein neuer Mitschüler wohnt weit weg. Frag, wie lange er zur Schule braucht. Beginne mit: How long ... [de] | How long does it take you to get to school? (full) ; How long does it take you to come to school? (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.sb.001 | sentence-building | it / takes / me / twenty / minutes / to / walk / to / school [en] | It takes me twenty minutes to walk to school. (full) | — | — | — | — | false |
| g3u03.gi.it-takes.sb.002 | sentence-building | it / takes / to / me / half an hour / homework / do / my [en] | It takes me half an hour to do my homework. (full) | — | — | — | — | false |
| g3u03.gi.it-takes.sb.003 | sentence-building | how / long / did / it / take / you / to / get / there / ? [en] | How long did it take you to get there? (full) | — | — | — | — | false |
| g3u03.gi.it-takes.sb.004 | sentence-building | it / took / us / two / hours / to / cook / dinner [en] | It took us two hours to cook dinner. (full) | — | — | — | — | false |
| g3u03.gi.it-takes.tf.002 | transformation | Mach eine Frage daraus: It takes Lisa thirty minutes to cycle to school. (How long ...?) [de] | How long does it take Lisa to cycle to school? (full) ; How long does it take her to cycle to school? (full) | — | — | — | — | false |
| g3u03.gi.it-takes.tf.004 | transformation | Fülle beide Lücken: 'It ___ (take) me about five minutes ___ (brush) my teeth.' [de, 2 blank(s)] | takes \| to brush (full) | — | — | — | — | false |
| g3u03.gi.it-takes.tf.005 | transformation | Fülle beide Lücken über das letzte Wochenende: 'It ___ (take) us four hours ___ (reach) the mountain.' [de, 2 blank(s)] | took \| to reach (full) | — | — | — | — | false |
| g3u03.gi.it-takes.tf.006 | transformation | Erzähl den Satz von gestern: It takes us an hour to drive to the beach. (yesterday) [de] | It took us an hour to drive to the beach yesterday. (full) ; It took us an hour to drive to the beach. (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.tf.007 | transformation | Mach eine Frage mit did: It took you an hour to read the book. (How long ...?) [de] | How long did it take you to read the book? (full) ; How long did it take to read the book? (partial) | — | — | — | — | false |
| g3u03.gi.it-takes.tr.002 | translation | Wie lange hast du gebraucht, um das Buch zu lesen? [de] | How long did it take you to read the book? (full) ; How long did it take to read the book? (partial) | deToEn | — | — | — | false |
| g3u03.gi.it-takes.tr.003 | translation | Es hat uns zwei Stunden gedauert, um nach Hause zu fahren. [de] | It took us two hours to drive home. (full) ; It took us two hours to get home. (full) | deToEn | — | — | — | false |
| g3u03.gi.it-takes.tr.004 | translation | It takes me an hour to do my homework. [en] | Ich brauche eine Stunde, um meine Hausaufgaben zu machen. (full) ; Ich brauche eine Stunde für meine Hausaufgaben. (partial) | enToDe | — | — | — | false |
| g3u03.gi.it-takes.tr.005 | translation | Ich brauche zehn Minuten, um zur Schule zu gehen. [de] | It takes me ten minutes to walk to school. (full) ; It takes me ten minutes to get to school. (full) ; It takes me 10 minutes to walk to school. (full) ; It takes me ten minutes to go to school. (full) | deToEn | — | — | — | false |
| g3u03.gi.time-connectors.cp.001 | context-picker | Du möchtest sagen, dass du den ganzen Flug über gelesen hast. Welcher Satz ist richtig? [de] | I was reading during the whole flight. (full) | — | I was reading while the whole flight. ; I was reading during I was on the plane. ; I was reading by the flight. | — | — | false |
| g3u03.gi.time-connectors.cp.002 | context-picker | Zwei Dinge passieren gleichzeitig: Mum fährt, du liest. Welcher Satz ist richtig? [de] | While Mum was driving, I was reading. (full) | — | During Mum was driving, I was reading. ; While the drive, I was reading. ; During I was reading, Mum was driving. | — | — | false |
| g3u03.gi.time-connectors.cp.003 | context-picker | Du möchtest sagen: Als sie ankamen, hatte der Film schon begonnen. Welcher Satz ist richtig? [de] | By the time they arrived, the film had already started. (full) | — | By they arrived, the film had already started. ; During they arrived, the film had already started. ; By the time of they arrived, the film had already started. | — | — | false |
| g3u03.gi.time-connectors.ec.001 | error-correction | During I was sleeping, the dog ran into my room. [en] | While I was sleeping, the dog ran into my room. (full) ; While (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.ec.002 | error-correction | We went swimming while the summer holidays. [en] | We went swimming during the summer holidays. (full) ; during (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.ec.003 | error-correction | By they arrived at the cinema, the film was over. [en] | By the time they arrived at the cinema, the film was over. (full) ; By the time (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.ec.004 | error-correction | While the lunch break, we played football. [en] | During the lunch break, we played football. (full) ; During (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.ec.005 | error-correction | During my mum was cooking, I was watching a film. [en] | While my mum was cooking, I was watching a film. (full) ; While (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.ec.006 | error-correction | I always clean my room during my mum is cooking. [en] | I always clean my room while my mum is cooking. (full) ; while (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.001 | gap-fill | We stayed inside ___ the storm. [en, 1 blank(s)] | during (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.002 | gap-fill | ___ they were cooking dinner, the dog ran into the kitchen. [en, 1 blank(s)] | While (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.003 | gap-fill | I fell asleep ___ the film. I didn't watch the ending. [en, 1 blank(s)] | during (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.005 | gap-fill | ___ she cleaned her room, she went outside to play. [en, 1 blank(s)] | After (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.006 | gap-fill | They waited at the bus stop ___ the bus came. [en, 1 blank(s)] | until (full) ; till (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.007 | gap-fill | The baby fell asleep ___ the car ride. [en, 1 blank(s)] | during (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.008 | gap-fill | I was reading my book ___ my brother was playing a computer game. [en, 1 blank(s)] | while (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.009 | gap-fill | We always clean our teeth ___ we go to bed. [en, 1 blank(s)] | before (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.010 | gap-fill | We didn't leave the cinema ___ the film was over. [en, 1 blank(s)] | until (full) ; till (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.011 | gap-fill | ___ he was 25, James Holman was completely blind. [en, 1 blank(s)] | By the time (full) ; When (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.012 | gap-fill | ___ she was resting in her tent, Mary heard a noise outside. [en, 1 blank(s)] | While (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.013 | gap-fill | ___ his lifetime, James Holman travelled very far. [en, 1 blank(s)] | During (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.014 | gap-fill | ___ her travels, Mary wrote two books about Africa. [en, 1 blank(s)] | After (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.015 | gap-fill | James Holman stayed in the Royal Navy ___ 1810. [en, 1 blank(s)] | until (full) ; till (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.016 | gap-fill | I saw my favourite singer ___ the concert last Saturday. [en, 1 blank(s)] | during (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.017 | gap-fill | ___ the teacher was reading the story, some children were talking. [en, 1 blank(s)] | While (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.018 | gap-fill | ___ we came back to the house, Grandma's breakfast was ready. [en, 1 blank(s)] | By the time (full) ; When (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.019 | gap-fill | ___ the flight, Amy was reading and eating lunch. [en, 1 blank(s)] | During (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.020 | gap-fill | ___ the match, the players drank some water. [en, 1 blank(s)] | During (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.021 | gap-fill | ___ Mary was climbing the mountain, the men were waiting at the bottom. [en, 1 blank(s)] | While (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.022 | gap-fill | Minnie gets to the airport ___ the plane takes off. [en, 1 blank(s)] | before (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.023 | gap-fill | ___ Celia reached the coast, she had already cycled very far. [en, 1 blank(s)] | By the time (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.024 | gap-fill | We didn't go home ___ the rain stopped. [en, 1 blank(s)] | until (full) ; till (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.025 | gap-fill | ___ the long flight, Amy was watching a film. [en, 1 blank(s)] | During (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.026 | gap-fill | Mary returned to Africa ___ the Second Boer War broke out. [en, 1 blank(s)] | before (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.027 | gap-fill | ___ we arrived at the beach, it started to rain. [en, 1 blank(s)] | When (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gf.028 | gap-fill | ___ she leaves home, she always closes all the windows. [en, 1 blank(s)] | Before (full) ; When (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.gs.001 | group-sort | Was kommt nach while und was nach during? [de] | — | — | — | — | while: she was studying, I was reading, they were cooking, Dad was driving \| during: the storm, the concert, the lesson, the flight | false |
| g3u03.gi.time-connectors.gs.002 | group-sort | Welche Wörter stehen vor einem Nomen, welche vor einem Satz? [de] | — | — | — | — | during the …: storm, concert, lesson, flight \| while she …: was reading, was cooking, was waiting, was studying | false |
| g3u03.gi.time-connectors.mc.001 | multiple-choice | We had lunch ___ the break. [en, 1 blank(s)] | during (full) | — | while ; until ; by the time | — | — | false |
| g3u03.gi.time-connectors.mc.002 | multiple-choice | ___ Dad was cooking, I was washing the plates. [en, 1 blank(s)] | While (full) | — | During ; Until ; By the time | — | — | false |
| g3u03.gi.time-connectors.mc.003 | multiple-choice | They waited at the airport ___ the plane was ready. [en, 1 blank(s)] | until (full) | — | during ; while ; after | — | — | false |
| g3u03.gi.time-connectors.mc.004 | multiple-choice | ___ the long car ride, the children fell asleep. [en, 1 blank(s)] | During (full) | — | While ; Until ; By the time | — | — | false |
| g3u03.gi.time-connectors.mc.005 | multiple-choice | We had breakfast ___ we went to school. [en, 1 blank(s)] | before (full) | — | during ; until ; by the time | — | — | false |
| g3u03.gi.time-connectors.mc.006 | multiple-choice | ___ Holman was 25, he was already completely blind. [en, 1 blank(s)] | By the time (full) | — | During ; While ; Until | — | — | false |
| g3u03.gi.time-connectors.mc.007 | multiple-choice | ___ her travels, Mary visited many countries in Africa. [en, 1 blank(s)] | During (full) | — | While ; Until ; By the time | — | — | false |
| g3u03.gi.time-connectors.mc.008 | multiple-choice | ___ some hippos blocked her way, Mary hit them with her umbrella. [en, 1 blank(s)] | When (full) | — | During ; Until ; By the time | — | — | false |
| g3u03.gi.time-connectors.mp.001 | matching-pairs | Welcher Anfang passt zu welchem Ende? [de] | — | — | — | During the storm, ↔ we stayed inside. ; While Dad was cooking, ↔ I was reading a book. ; Before we went to bed, ↔ we cleaned our teeth. ; After the match, ↔ we came home. ; They waited until ↔ the rain stopped. ; By the time we came back, ↔ dinner was ready. | — | false |
| g3u03.gi.time-connectors.mt.001 | matching | Welcher Anfang passt zu welchem Ende? [de] | — | — | — | While she was studying, ↔ she heard a noise outside. ; During the concert, ↔ all the people were happy. ; Before we left, ↔ we cleaned the kitchen. ; After the lesson, ↔ we went to the park. ; They waited until ↔ the bus came. | — | false |
| g3u03.gi.time-connectors.mt.002 | matching | Welcher Satzanfang passt zu welchem Ende? [de] | — | — | — | While I was washing the plates, ↔ my cat jumped on the table. ; During the film, ↔ we had some ice cream. ; Before the lesson, ↔ I cleaned the board. ; After we washed the plates, ↔ we went to bed. ; When the teacher came in, ↔ all the children were quiet. | — | false |
| g3u03.gi.time-connectors.qf.001 | question-formation | Tom was reading during the lesson. (Frage danach, was Tom während des Unterrichts gemacht hat.) [de] | What was Tom doing during the lesson? (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.qf.002 | question-formation | Dein Freund sagt: 'I saw a famous singer.' Frag, ob er die Person beim Einkaufen gesehen hat. Beginne mit 'Did you see them while...'. [de] | Did you see them while you were shopping? (full) ; Did you see them while you were in town? (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.sb.001 | sentence-building | the / stayed / we / storm / during / inside [en] | We stayed inside during the storm. (full) ; During the storm, we stayed inside. (full) ; During the storm we stayed inside. (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.sb.002 | sentence-building | after / home / came / we / watched / we / a film [en] | After we came home, we watched a film. (full) ; We watched a film after we came home. (full) ; After we came home we watched a film. (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.sb.003 | sentence-building | while / reading / was / I / the / rang / alarm clock [en] | While I was reading, the alarm clock rang. (full) ; The alarm clock rang while I was reading. (full) ; While I was reading the alarm clock rang. (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.tf.001 | transformation | Mary was resting in her tent. She heard a noise. (Verbinde die Sätze mit while.) [de] | While Mary was resting in her tent, she heard a noise. (full) ; Mary heard a noise while she was resting in her tent. (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.tf.002 | transformation | We had breakfast. Then we went to school. (Verbinde die Sätze mit before.) [de] | We had breakfast before we went to school. (full) ; Before we went to school, we had breakfast. (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.tf.003 | transformation | Schreibe einen Satz mit until: Die Kinder warteten lange. Dann kam der Bus. [de] | They waited a long time until the bus came. (full) ; They waited until the bus came. (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.tf.004 | transformation | Schreibe einen Satz mit by the time: Das Flugzeug landet. Dann ist die Reise vorbei. [de] | By the time the plane lands, the journey is over. (full) ; By the time the plane landed, the journey was over. (partial) | — | — | — | — | false |
| g3u03.gi.time-connectors.tf.005 | transformation | Verbinde die Sätze mit during: Der Sturm war laut. Wir blieben drinnen. [de] | We stayed inside during the storm. (full) ; During the storm, we stayed inside. (full) | — | — | — | — | false |
| g3u03.gi.time-connectors.tr.001 | translation | Während des Unterrichts darf man nicht essen. [de] | During the lesson, you mustn't eat. (full) ; You mustn't eat during the lesson. (full) ; During class, you mustn't eat. (partial) | deToEn | — | — | — | false |
| g3u03.gi.time-connectors.tr.002 | translation | Während wir auf den Bus warteten, begann es zu schneien. [de] | While we were waiting for the bus, it started to snow. (full) ; It started to snow while we were waiting for the bus. (full) ; While we were waiting for the bus, it started snowing. (partial) | deToEn | — | — | — | false |
| g3u03.gi.time-connectors.tr.003 | translation | Bevor wir ins Kino gingen, haben wir Pizza gegessen. [de] | Before we went to the cinema, we ate pizza. (full) ; We ate pizza before we went to the cinema. (full) ; Before we went to the cinema, we had pizza. (partial) | deToEn | — | — | — | false |
| g3u03.gi.time-connectors.tr.004 | translation | Während der Pause hat es angefangen zu regnen. [de] | During the break, it started to rain. (full) ; It started to rain during the break. (full) ; During the break, it started raining. (partial) | deToEn | — | — | — | false |
| g3u03.gi.time-connectors.tr.006 | translation | Die Kinder warteten, bis der Zug kam. [de] | They waited until the train came. (full) ; They waited until the train arrived. (partial) ; The children waited until the train came. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u03/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u03",
  "lens": "answers",
  "itemsHash": "5593126519b1",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 168, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
