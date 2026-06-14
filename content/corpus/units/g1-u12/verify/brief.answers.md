# Verify lens — answers — g1-u12 (round 1)

<!-- domigo:verify answers g1-u12 items=08c10551a0cb prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (74)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u12.w.10th-tenth | 10th tenth | It is just after the ninth one. Number 10. | The ___ and last piece of cake is for me! | tenth (full) ; 10th (full) | tenth (full) ; 10th (full) | ninth ; eleventh ; eighth |
| g1u12.w.11th-eleventh | 11th eleventh | It is just after the tenth one. Number 11. | Her birthday is on the ___ of May. | eleventh (full) ; 11th (full) | eleventh (full) ; 11th (full) | tenth ; twelfth ; ninth |
| g1u12.w.12th-twelfth | 12th twelfth | It is just after the eleventh one. Number 12. | My birthday is on the ___ of June. | twelfth (full) ; 12th (full) | twelfth (full) ; 12th (full) | eleventh ; thirteenth ; tenth |
| g1u12.w.13th-thirteenth | 13th thirteenth | It is just after the twelfth one. Number 13. | His birthday is on the ___ of April. | thirteenth (full) ; 13th (full) | thirteenth (full) ; 13th (full) | twelfth ; fourteenth ; eleventh |
| g1u12.w.14th-fourteenth | 14th fourteenth | It is just after the thirteenth one. Number 14. | The school day is on the ___ of February. | fourteenth (full) ; 14th (full) | fourteenth (full) ; 14th (full) | thirteenth ; fifteenth ; twelfth |
| g1u12.w.15th-fifteenth | 15th fifteenth | It is just after the fourteenth one. Number 15. | Mario's birthday is on the ___ of May. | fifteenth (full) ; 15th (full) | fifteenth (full) ; 15th (full) | fourteenth ; sixteenth ; thirteenth |
| g1u12.w.16th-sixteenth | 16th sixteenth | It is just after the fifteenth one. Number 16. | The match is on the ___ of June. | sixteenth (full) ; 16th (full) | sixteenth (full) ; 16th (full) | fifteenth ; seventeenth ; fourteenth |
| g1u12.w.17th-seventeenth | 17th seventeenth | It is just after the sixteenth one. Number 17. | The concert is on the ___ of November. | seventeenth (full) ; 17th (full) | seventeenth (full) ; 17th (full) | sixteenth ; eighteenth ; fifteenth |
| g1u12.w.18th-eighteenth | 18th eighteenth | It is just after the seventeenth one. Number 18. | His birthday is on the ___ of October. | eighteenth (full) ; 18th (full) | eighteenth (full) ; 18th (full) | seventeenth ; nineteenth ; sixteenth |
| g1u12.w.19th-nineteenth | 19th nineteenth | It is just after the eighteenth one. Number 19. | The party is on the ___ of July. | nineteenth (full) ; 19th (full) | nineteenth (full) ; 19th (full) | eighteenth ; twentieth ; seventeenth |
| g1u12.w.1st-first | 1st first | It is the one at the very beginning. It is number 1. | Monday is the ___ day of our school week. | first (full) ; 1st (full) | first (full) ; 1st (full) | second ; third ; last |
| g1u12.w.20th-twentieth | 20th twentieth | It is just after the nineteenth one. Number 20. | The school holiday begins on the ___ of December. | twentieth (full) ; 20th (full) | twentieth (full) ; 20th (full) | nineteenth ; twenty-first ; thirtieth |
| g1u12.w.21st-twenty-first | 21st twenty-first | It is number 21. It is the one just after number 20. | The school trip is on the ___ of July. | twenty-first (full) ; 21st (full) | twenty-first (full) ; 21st (full) | twentieth ; twenty-second ; thirty-first |
| g1u12.w.22nd-twenty-second | 22nd twenty-second | It is number 22. It is the one just after number 21. | Tom's birthday is on the ___ of March. | twenty-second (full) ; 22nd (full) | twenty-second (full) ; 22nd (full) | twenty-first ; twenty-third ; twentieth |
| g1u12.w.23rd-twenty-third | 23rd twenty-third | It is number 23. It is the one just after number 22. | The match is on the ___ of January. | twenty-third (full) ; 23rd (full) | twenty-third (full) ; 23rd (full) | twenty-second ; twenty-fourth ; twenty-first |
| g1u12.w.24th-twenty-fourth | 24th twenty-fourth | It is number 24. It is the one just after number 23. | Sue's birthday is on the ___ of December. | twenty-fourth (full) ; 24th (full) | twenty-fourth (full) ; 24th (full) | twenty-third ; twenty-fifth ; twenty-second |
| g1u12.w.25th-twenty-fifth | 25th twenty-fifth | It is number 25. It is the one just after number 24. | We open our presents on the ___ of December. | twenty-fifth (full) ; 25th (full) | twenty-fifth (full) ; 25th (full) | twenty-fourth ; twentieth ; thirtieth |
| g1u12.w.2nd-second | 2nd second | It is just after the first one. Number 2. | Tuesday is the ___ day of the school week, after Monday. | second (full) ; 2nd (full) | second (full) ; 2nd (full) | first ; third ; fourth |
| g1u12.w.30th-thirtieth | 30th thirtieth | It is number 30. It is the last day of many months. | The last day of April is the ___. | thirtieth (full) ; 30th (full) | thirtieth (full) ; 30th (full) | twentieth ; thirty-first ; first |
| g1u12.w.31st-thirty-first | 31st thirty-first | It is number 31. It is the very last day of some months. | The last day of the year is the ___ of December. | thirty-first (full) ; 31st (full) | thirty-first (full) ; 31st (full) | thirtieth ; twenty-first ; first |
| g1u12.w.3rd-third | 3rd third | It is just after the second one. Number 3. | Wednesday is the ___ day of the school week. | third (full) ; 3rd (full) | third (full) ; 3rd (full) | second ; fourth ; fifth |
| g1u12.w.4th-fourth | 4th fourth | It is just after the third one. Number 4. | Thursday is the ___ day of the school week. | fourth (full) ; 4th (full) | fourth (full) ; 4th (full) | third ; fifth ; sixth |
| g1u12.w.5th-fifth | 5th fifth | It is just after the fourth one. Number 5. | Friday is the ___ day of the school week. | fifth (full) ; 5th (full) | fifth (full) ; 5th (full) | fourth ; sixth ; third |
| g1u12.w.6th-sixth | 6th sixth | It is just after the fifth one. Number 6. | The ___ piece of cake is for Bill. | sixth (full) ; 6th (full) | sixth (full) ; 6th (full) | fifth ; seventh ; fourth |
| g1u12.w.7th-seventh | 7th seventh | It is just after the sixth one. Number 7. | The ___ piece of cake is also for Bill. | seventh (full) ; 7th (full) | seventh (full) ; 7th (full) | sixth ; eighth ; fifth |
| g1u12.w.8th-eighth | 8th eighth | It is just after the seventh one. Number 8. | The ___ piece of cake is for you. | eighth (full) ; 8th (full) | eighth (full) ; 8th (full) | seventh ; ninth ; sixth |
| g1u12.w.9th-ninth | 9th ninth | It is just after the eighth one. Number 9. | The ___ piece of cake is for Jeremy. | ninth (full) ; 9th (full) | ninth (full) ; 9th (full) | eighth ; tenth ; seventh |
| g1u12.w.alarm-clock | alarm clock | It stands next to your bed and makes a loud noise to wake you up in the morning. | My ___ makes a loud noise at seven in the morning. | alarm clock (full) | alarm clock (full) | candle ; piece ; robber |
| g1u12.w.april | April | It is the month after March, when it often rains and the trees have new leaves. | It often rains and the trees have new leaves in ___. | April (full) | April (full) | March ; May ; June |
| g1u12.w.august | August | It is a hot month of summer, when many families go away on a long holiday. | Many families go away on a long holiday in ___. | August (full) | August (full) | July ; September ; June |
| g1u12.w.bathroom | bathroom | It is the room where you wash and clean your teeth. | I wash and clean my teeth in the ___. | bathroom (full) | bathroom (full) | bedroom ; kitchen ; living room |
| g1u12.w.bedroom | bedroom | It is the room with your bed, where you go at night. | At night I go to my ___, where my bed is. | bedroom (full) | bedroom (full) | kitchen ; bathroom ; garage |
| g1u12.w.birthday-cake | birthday cake | It is the special, sweet thing with candles that you have on your big day in the year. | Mum is making a big ___ with 12 candles for my birthday. | birthday cake (full) | birthday cake (full) | candle ; piece ; robbery |
| g1u12.w.candle | candle | It is a small thing that gives a tiny light on top of a birthday cake. | We put 12 ___ on the birthday cake and light them. | candles (full) ; candle (partial) | candle (full) | piece ; date ; match |
| g1u12.w.cinema | cinema | It is the place where you go to watch a new film on a very big screen. | Let's go to the ___ on Friday and watch the new film. | cinema (full) | cinema (full) | library ; kitchen ; garage |
| g1u12.w.date | date | It is the day and the month, like the 5th of March. | What is today's ___? It is the 7th of July. | date (full) | date (full) | month ; piece ; match |
| g1u12.w.december | December | It is the last, cold month of the year, when we put up a tree with lights. | We put up a tree with many lights in ___, the last month of the year. | December (full) | December (full) | November ; January ; October |
| g1u12.w.delicious | delicious | When food is very, very good to eat. | This chocolate cake is so ___! I want more. | delicious (full) | delicious (full) ; tasty (partial) ; yummy (partial) | excellent ; messy ; ill |
| g1u12.w.dining-room | dining room | It is where the family eats dinner at a big table. | We eat our dinner at the big table in the ___. | dining room (full) | dining room (full) | garage ; bathroom ; garden |
| g1u12.w.eater | eater | It is what you call somebody, when you talk about their food at the table. | Peter is a messy ___ and has food all over the table. | eater (full) | eater (full) | robber ; inspector ; candle |
| g1u12.w.excellent | excellent | When something is very, very good, the best it can be. | Ten out of ten! That is ___ work! | excellent (full) | excellent (full) ; great (partial) | delicious ; messy ; ill |
| g1u12.w.february | February | It is the short, cold month after January, when many children ski in the snow. | We go skiing on the cold, white snow in ___. | February (full) | February (full) | January ; March ; November |
| g1u12.w.finally | finally | When you wait a long time and then at last the thing happens. | We waited a long time, and ___ the bus came! | finally (full) | finally (full) ; at last (partial) | probably ; yesterday ; excellent |
| g1u12.w.garage | garage | It is the place where the car stays at night. | Dad parks the car in the ___ at night. | garage (full) | garage (full) | living room ; bedroom ; kitchen |
| g1u12.w.garden | garden | It is the place outside, with grass and flowers, where you can play. | We play outside on the grass in the ___. | garden (full) | garden (full) | living room ; bathroom ; kitchen |
| g1u12.w.good-for-you | Good for you! | A happy thing you say when something nice happens to another person. | You won the match? ___ I am so happy for you! | Good for you! (full) | Good for you! (full) | How dare you! ; You're welcome. ; That was close. |
| g1u12.w.hall | hall | It is the first small room when you come in, where you put your jacket. | Please put your jacket here in the ___ when you come in. | hall (full) | hall (full) | kitchen ; bathroom ; bedroom |
| g1u12.w.how-dare-you | How dare you! | An angry thing you say when a person does a very bad thing to you. | You had my cake without asking me? ___ | How dare you! (full) | How dare you! (full) | Good for you! ; You're welcome. ; That was close. |
| g1u12.w.how-old-are-you | How old are you? | You ask this to find out somebody's age in years. | ___ I am 11, and my birthday is in June. | How old are you? (full) | How old are you? (full) | It's my birthday. ; Good for you! ; You're welcome. |
| g1u12.w.ill | ill | When you feel bad and have to stay in bed and cannot go to school. | Bill had too much cake and now he is ___ in bed. | ill (full) | ill (full) ; sick (partial) | messy ; excellent ; delicious |
| g1u12.w.inspector | inspector | It is the person who asks everybody many things to find the robber. | The police ___ asked everybody where they were last night. | inspector (full) | inspector (full) | robber ; eater ; candle |
| g1u12.w.it-s-my-birthday | It's my birthday. | Today is your special day with a cake, and you are one year older. | ___ I am 11 today, and we have a big cake! | It's my birthday. (full) | It's my birthday. (full) | How old are you? ; Good for you! ; You're welcome. |
| g1u12.w.january | January | It is the first cold month of the year, when we can play in the snow. | We can ski in the white snow in ___, the first month of the year. | January (full) | January (full) | February ; June ; December |
| g1u12.w.july | July | It is a hot month of summer, when many children play at the sea. | It is very hot and we play at the sea in ___. | July (full) | July (full) | June ; August ; September |
| g1u12.w.june | June | It is the first warm month of summer, before the long school holiday. | The days are long and the school year ends soon in ___. | June (full) | June (full) | July ; May ; August |
| g1u12.w.kitchen | kitchen | It is the room where Mum makes the food and we cook. | Mum makes our breakfast and we cook in the ___. | kitchen (full) | kitchen (full) | bathroom ; bedroom ; living room |
| g1u12.w.last | last | It is the one just before this one, the time before now. | There was a robbery here ___ night, before today. | last (full) | last (full) | excellent ; delicious ; messy |
| g1u12.w.library | library | It is a room with many books to read. | I read my books in the ___. | library (full) | library (full) | kitchen ; bathroom ; bedroom |
| g1u12.w.living-room | living room | It is where the family watches TV in the evening. | We watch TV with the family in the ___. | living room (full) | living room (full) | bathroom ; kitchen ; bedroom |
| g1u12.w.march | March | It is the cool month when the cold days end and the first new leaves come. | The first new leaves come on the trees in ___. | March (full) | March (full) | April ; February ; May |
| g1u12.w.match | match | It is when two groups of children play, and we watch who is best. | There is a volleyball ___ on Saturday. | match (full) | match (full) | piece ; candle ; date |
| g1u12.w.may | May | It is the month before June, when the garden has many pretty flowers. | The garden has many beautiful flowers in ___. | May (full) | May (full) | April ; June ; March |
| g1u12.w.messy | messy | When something is not clean and there is food or things all over the place. | Peter is a ___ eater and has food all over the table. | messy (full) | messy (full) | ill ; delicious ; excellent |
| g1u12.w.month | month | It is one of the twelve parts of a year, like May or June. | May is the fifth ___ of the year. | month (full) | month (full) | date ; piece ; candle |
| g1u12.w.november | November | It is the cold, grey month when the days are short and it often rains. | The days are short and grey in ___, before December. | November (full) | November (full) | October ; December ; September |
| g1u12.w.october | October | It is the cool month when the leaves on the trees go brown and red. | The brown and red leaves come down from the trees in ___. | October (full) | October (full) | September ; November ; December |
| g1u12.w.piece | piece | It is one part of a bigger thing, like one part of a cake. | Can I have a ___ of your birthday cake, please? | piece (full) | piece (full) | candle ; match ; date |
| g1u12.w.probably | probably | When you think something is true, but you do not know it for sure. | It is very grey outside, so it is ___ going to rain later. | probably (full) | probably (full) ; maybe (partial) | finally ; yesterday ; last |
| g1u12.w.robber | robber | It is a bad person who takes things that are not theirs. | Jessie wants to find the ___ who took her cake. | robber (full) | robber (full) ; thief (partial) | inspector ; eater ; candle |
| g1u12.w.robbery | robbery | It is when a bad person takes things from a place like a shop. | There was a ___ at the big shop, and all the money was gone. | robbery (full) | robbery (full) | robber ; inspector ; date |
| g1u12.w.september | September | It is the month when the hot days end and children go back to school. | We go back to school after the long holiday in ___. | September (full) | September (full) | October ; August ; November |
| g1u12.w.that-was-close | That was close. | You say this when a bad thing nearly happens but in the end does not happen. | That car was very close to us! ___ | That was close. (full) | That was close. (full) | Good for you! ; You're welcome. ; How dare you! |
| g1u12.w.yesterday | yesterday | It is the day that was just before today. | Where were you ___, the day before today? | yesterday (full) | yesterday (full) | finally ; probably ; last |
| g1u12.w.you-re-welcome | You're welcome. | You say this back to a person after they say thank you to you. | Thank you for your help! — ___ | You're welcome. (full) | You're welcome. (full) | Good for you! ; How dare you! ; That was close. |

## Grammar items (87)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u12.gi.ordinal-numbers.ag.003 | anagram | 8. als Wort — wie heißt es? [de] | eighth (full) | — | — | — | — | true |
| g1u12.gi.ordinal-numbers.ag.004 | anagram | 12. als Wort — wie heißt es? [de] | twelfth (full) | — | — | — | — | true |
| g1u12.gi.ordinal-numbers.ec.001 | error-correction | My birthday is on the nineth of June. [en] | My birthday is on the ninth of June. (full) ; ninth (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.ec.002 | error-correction | She was fiveth in the race. [en] | She was fifth in the race. (full) ; fifth (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.ec.003 | error-correction | December is the twelveth month. [en] | December is the twelfth month. (full) ; twelfth (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.ec.004 | error-correction | The eightth piece of cake is for you. [en] | The eighth piece of cake is for you. (full) ; eighth (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.001 | gap-fill | The ___ piece is for Sue. (1) [en, 1 blank(s)] | first (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.002 | gap-fill | The ___ piece is for Peter. (3) [en, 1 blank(s)] | third (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.003 | gap-fill | January is the ___ month of the year. (1) [en, 1 blank(s)] | first (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.004 | gap-fill | February is the ___ month of the year. (2) [en, 1 blank(s)] | second (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.005 | gap-fill | She came ___ in the race. (5th place) [en, 1 blank(s)] | fifth (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.006 | gap-fill | Today is the ___ of March. (9) [en, 1 blank(s)] | ninth (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.007 | gap-fill | December is the ___ month of the year. (12) [en, 1 blank(s)] | twelfth (full) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.008 | gap-fill | My birthday is on the ___ of June. (21) [en, 1 blank(s)] | twenty-first (full) ; 21st (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.009 | gap-fill | December has 31 days. The last day is the ___. (31) [en, 1 blank(s)] | thirty-first (full) ; 31st (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gf.010 | gap-fill | Jessie's cake had twelve candles. The robbery was on the ___ of May, on her birthday. (23) [en, 1 blank(s)] | twenty-third (full) ; 23rd (partial) | — | — | — | — | false |
| g1u12.gi.ordinal-numbers.gs.002 | group-sort | Sortiere: einfach -th anhängen oder Schreibweise ändern? [de] | — | — | — | — | like sixth: fourth, sixth, seventh, tenth \| like fifth: fifth, ninth, twelfth, twentieth | false |
| g1u12.gi.ordinal-numbers.mc.005 | multiple-choice | Wie schreibt man 2. als Wort? [de] | second (full) | — | twoth ; twond ; secend | — | — | false |
| g1u12.gi.ordinal-numbers.mc.006 | multiple-choice | Wie schreibt man 12. als Wort richtig? [de] | twelfth (full) | — | twelveth ; twelvth ; twelfeth | — | — | false |
| g1u12.gi.ordinal-numbers.mc.007 | multiple-choice | Wie schreibt man 8. als Wort richtig? [de] | eighth (full) | — | eightth ; eigthth ; eighteth | — | — | false |
| g1u12.gi.ordinal-numbers.mc.008 | multiple-choice | Wie schreibt man 5. als Wort richtig? [de] | fifth (full) | — | fiveth ; fith ; fifeth | — | — | false |
| g1u12.gi.ordinal-numbers.mp.003 | matching-pairs | Was passt zusammen? Zahl und Wort. [de] | — | — | — | one ↔ first ; two ↔ second ; three ↔ third ; five ↔ fifth ; eight ↔ eighth ; twelve ↔ twelfth | — | false |
| g1u12.gi.ordinal-numbers.mp.004 | matching-pairs | Was passt zusammen? Verbinde jede Zahl mit dem passenden Wort. [de] | — | — | — | four ↔ fourth ; six ↔ sixth ; seven ↔ seventh ; nine ↔ ninth ; ten ↔ tenth ; eleven ↔ eleventh | — | false |
| g1u12.gi.ordinal-numbers.tf.004 | transformation | Schreib als Wort: 20th → ___ [de, 1 blank(s)] | twentieth (full) | — | — | — | — | true |
| g1u12.gi.ordinal-numbers.tf.005 | transformation | Schreib als Wort: 30th → ___ [de, 1 blank(s)] | thirtieth (full) | — | — | — | — | true |
| g1u12.gi.ordinal-numbers.tf.006 | transformation | Heute ist der letzte Tag des Monats. Schreib als Wort: 31st → ___ [de, 1 blank(s)] | thirty-first (full) | — | — | — | — | true |
| g1u12.gi.ordinal-numbers.tr.001 | translation | Mein Geburtstag ist am dritten Mai. [de] | My birthday is on the third of May. (full) ; My birthday is on the 3rd of May. (partial) | deToEn | — | — | — | false |
| g1u12.gi.ordinal-numbers.tr.002 | translation | Heute ist der fünfzehnte Dezember. [de] | Today is the fifteenth of December. (full) ; Today is the 15th of December. (partial) | deToEn | — | — | — | false |
| g1u12.gi.past-simple-was-were.ag.001 | anagram | Die Vergangenheits-Form von be zu they: [de] | were (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.ag.002 | anagram | Die verneinte Form von was: [de] | wasn't (full) | — | — | — | — | true |
| g1u12.gi.past-simple-was-were.cp.001 | context-picker | Du erzählst von gestern. Welcher Satz ist richtig? [de] | We were at the zoo yesterday. (full) | — | We was at the zoo yesterday. ; We are at the zoo yesterday. ; We is at the zoo yesterday. | — | — | false |
| g1u12.gi.past-simple-was-were.cp.002 | context-picker | Deine Lehrerin fragt nach dem Schulausflug von gestern. Welche Antwort ist richtig? [de] | It was excellent! (full) | — | It were excellent! ; It is excellent! ; It are excellent! | — | — | false |
| g1u12.gi.past-simple-was-were.ec.001 | error-correction | They was at the zoo yesterday. [en] | They were at the zoo yesterday. (full) ; were (partial) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.ec.002 | error-correction | I were at the cinema last night. [en] | I was at the cinema last night. (full) ; was (partial) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.ec.003 | error-correction | I was been tired yesterday. [en] | I was tired yesterday. (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.001 | gap-fill | I ___ at school yesterday. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.002 | gap-fill | Peter and John ___ at school last Monday. [en, 1 blank(s)] | were (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.003 | gap-fill | She ___ very tired after the birthday party. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.004 | gap-fill | We ___ in London last night. [en, 1 blank(s)] | were (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.005 | gap-fill | The birthday cake ___ delicious! [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.006 | gap-fill | ___ you at the cinema yesterday? [en, 1 blank(s)] | Were (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gf.007 | gap-fill | She ___ happy because her dog ___ ill. [en, 2 blank(s)] | wasn't \| was (full) ; was not \| was (full) | — | — | — | — | true |
| g1u12.gi.past-simple-was-were.gf.008 | gap-fill | The children ___ in the garden. They were in the kitchen. [en, 1 blank(s)] | weren't (full) ; were not (full) | — | — | — | — | true |
| g1u12.gi.past-simple-was-were.gf.009 | gap-fill | Last night there ___ a robbery in the kitchen. [en, 1 blank(s)] | was (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.gs.001 | group-sort | was oder were? Sortiere die Wörter. [de] | — | — | — | — | was: I, he, she, it \| were: you, we, they | false |
| g1u12.gi.past-simple-was-were.gs.003 | group-sort | Sortiere: ein Satz ohne nicht oder ein Satz mit nicht (verneint)? [de] | — | — | — | — | Yes: I was happy., She was in the kitchen., They were at school. \| No: I wasn't tired., Tom wasn't there., They weren't at the zoo. | false |
| g1u12.gi.past-simple-was-were.mc.001 | multiple-choice | Welcher Satz ist richtig? [de] | They were very happy yesterday. (full) | — | They was very happy yesterday. ; They are very happy yesterday. ; They is very happy yesterday. | — | — | false |
| g1u12.gi.past-simple-was-were.mc.002 | multiple-choice | Welcher Satz ist richtig? [de] | I was at the park last Saturday. (full) | — | I were at the park last Saturday. ; I am at the park last Saturday. ; I are at the park last Saturday. | — | — | false |
| g1u12.gi.past-simple-was-were.mc.003 | multiple-choice | 'Were you at the party?' – 'No, ___.' Welche Antwort ist richtig? [de, 1 blank(s)] | I wasn't (full) | — | I weren't ; I wasn't not ; you wasn't | — | — | true |
| g1u12.gi.past-simple-was-were.mt.001 | matching | Frage und passende Kurzantwort [de] | — | — | — | Was Tom in the garden? ↔ Yes, he was. ; Were you at the cinema? ↔ Yes, I was. ; Were Sandra and Kate there? ↔ No, they weren't. ; Was the cake delicious? ↔ Yes, it was. | — | false |
| g1u12.gi.past-simple-was-were.qf.001 | question-formation | She was in the kitchen. Stell eine Ja/Nein-Frage. [de] | Was she in the kitchen? (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.qf.002 | question-formation | Sandra and Kate were in the garden. Stell eine Ja/Nein-Frage. [de] | Were Sandra and Kate in the garden? (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.sb.001 | sentence-building | we / were / yesterday / at / the park [en] | We were at the park yesterday. (full) ; Yesterday we were at the park. (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.sb.002 | sentence-building | Tom / at / wasn't / the / party [en] | Tom wasn't at the party. (full) ; Tom was not at the party. (full) | — | — | — | — | true |
| g1u12.gi.past-simple-was-were.tf.001 | transformation | I am happy. → Yesterday I ___ happy. [en, 1 blank(s)] | was (full) ; Yesterday I was happy. (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.tf.002 | transformation | He was in the living room. → ___ he in the living room? [en, 1 blank(s)] | Was (full) ; Was he in the living room? (full) | — | — | — | — | false |
| g1u12.gi.past-simple-was-were.tf.003 | transformation | They were at school. → Mach den Satz verneint: They ___ at school. [de, 1 blank(s)] | weren't (full) ; were not (full) ; They weren't at school. (full) | — | — | — | — | true |
| g1u12.gi.past-simple-was-were.tr.001 | translation | Wir waren gestern im Kino. [de] | We were at the cinema yesterday. (full) ; Yesterday we were at the cinema. (full) | deToEn | — | — | — | false |
| g1u12.gi.past-simple-was-were.tr.002 | translation | Er war gestern nicht in der Schule. [de] | He wasn't at school yesterday. (full) ; He was not at school yesterday. (full) ; Yesterday he wasn't at school. (full) | deToEn | — | — | — | true |
| g1u12.gi.prepositions-time.cp.001 | context-picker | Du erzählst, wann dein Geburtstag ist. Welcher Satz ist richtig? [de] | My birthday is in May. (full) | — | My birthday is on May. ; My birthday is at May. ; My birthday is to May. | — | — | false |
| g1u12.gi.prepositions-time.cp.002 | context-picker | Du sagst, wann du ins Bett gehst. Welcher Satz ist richtig? [de] | I go to bed at night. (full) | — | I go to bed in night. ; I go to bed on night. ; I go to bed in the night. | — | — | false |
| g1u12.gi.prepositions-time.ec.001 | error-correction | I have English in Monday. [en] | I have English on Monday. (full) ; on (partial) | — | — | — | — | false |
| g1u12.gi.prepositions-time.ec.002 | error-correction | My birthday is on December. [en] | My birthday is in December. (full) ; in (partial) | — | — | — | — | false |
| g1u12.gi.prepositions-time.ec.003 | error-correction | The concert is on 7 o'clock. [en] | The concert is at 7 o'clock. (full) ; at (partial) | — | — | — | — | false |
| g1u12.gi.prepositions-time.ec.004 | error-correction | I wake up in the morning, but my sister gets up on the afternoon. [en] | I wake up in the morning, but my sister gets up in the afternoon. (full) ; in (partial) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.001 | gap-fill | I have English ___ Monday. [en, 1 blank(s)] | on (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.002 | gap-fill | My birthday is ___ March. [en, 1 blank(s)] | in (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.003 | gap-fill | The concert is ___ 8 o'clock. [en, 1 blank(s)] | at (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.006 | gap-fill | I wake up early ___ the morning. [en, 1 blank(s)] | in (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.007 | gap-fill | We have a match ___ Saturday. [en, 1 blank(s)] | on (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.008 | gap-fill | The cinema opens ___ half past six ___ the evening. [en, 2 blank(s)] | at \| in (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.009 | gap-fill | My birthday is ___ December, ___ the 21st. [en, 2 blank(s)] | in \| on (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.010 | gap-fill | We go to bed ___ night. [en, 1 blank(s)] | at (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gf.011 | gap-fill | Her birthday is ___ May 25th. [en, 1 blank(s)] | on (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.gs.004 | group-sort | Sortiere die Zeitangaben nach dem richtigen kleinen Wort. [de] | — | — | — | — | in: May, December, the morning, the afternoon \| on: Monday, Saturday, May 25th, my birthday \| at: 7 o'clock, half past eight, night, midnight | false |
| g1u12.gi.prepositions-time.gs.005 | group-sort | Welches kleine Wort passt? Sortiere in zwei Gruppen. [de] | — | — | — | — | in: January, June, October \| on: Tuesday, Friday, Sunday | false |
| g1u12.gi.prepositions-time.mc.001 | multiple-choice | My sister's birthday is ___ June. [en, 1 blank(s)] | in (full) | — | on ; at ; to | — | — | false |
| g1u12.gi.prepositions-time.mc.002 | multiple-choice | I have English ___ the afternoon. [en, 1 blank(s)] | in (full) | — | on ; at ; to | — | — | false |
| g1u12.gi.prepositions-time.mc.003 | multiple-choice | The match is ___ Thursday. [en, 1 blank(s)] | on (full) | — | in ; at ; to | — | — | false |
| g1u12.gi.prepositions-time.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | The concert is on Saturday at 7 o'clock. (full) | — | The concert is in Saturday at 7 o'clock. ; The concert is on Saturday in 7 o'clock. ; The concert is at Saturday on 7 o'clock. | — | — | false |
| g1u12.gi.prepositions-time.mp.001 | matching-pairs | Verbinde jede Zeitangabe mit der richtigen Form. [de] | — | — | — | Monday ↔ on Monday ; May ↔ in May ; 7 o'clock ↔ at 7 o'clock ; night ↔ at night ; the morning ↔ in the morning ; my birthday ↔ on my birthday | — | false |
| g1u12.gi.prepositions-time.sb.001 | sentence-building | is / on / The match / Saturday / . [en] | The match is on Saturday. (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.sb.002 | sentence-building | go to bed / at / We / night / . [en] | We go to bed at night. (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.tf.001 | transformation | Setze die richtigen Vorwörter ein: I go skating ___ Thursdays ___ January. [de, 2 blank(s)] | on \| in (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.tf.002 | transformation | Setze die richtigen Vorwörter ein: The match is ___ Saturday, ___ the afternoon, ___ 3 o'clock. [de, 3 blank(s)] | on \| in \| at (full) | — | — | — | — | false |
| g1u12.gi.prepositions-time.tr.001 | translation | Ich habe am Freitag ein Match. [de] | I have a match on Friday. (full) ; I have got a match on Friday. (full) ; I've got a match on Friday. (full) | deToEn | — | — | — | false |
| g1u12.gi.prepositions-time.tr.002 | translation | Der Geburtstag meiner Schwester ist im Dezember. [de] | My sister's birthday is in December. (full) ; My sister's birthday's in December. (partial) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u12/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u12",
  "lens": "answers",
  "itemsHash": "08c10551a0cb",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 161, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
