# Verify lens — answers — g3-u02 (round 1)

<!-- domigo:verify answers g3-u02 items=64ae9f12e91f prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (42)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g3u02.w.author | author | a man or woman who writes books | This famous ___ writes many books for children. | author (full) ; authors (partial) | author (full) ; an author (full) | member ; passenger ; thief |
| g3u02.w.awful | awful | very bad and not nice at all | The weather was ___ all day — it was cold, dark and wet. | awful (full) | awful (full) | careless ; similar ; married |
| g3u02.w.careless | careless | when you do not think about a thing or look after it well | He was so ___ that he dropped his new tablet. | careless (full) | careless (full) | awful ; similar ; married |
| g3u02.w.coincidence | coincidence | a big surprise when two of them happen at one time and you did not think it would happen | We are both wearing a red hat to school today — what a ___! | coincidence (full) ; coincidences (partial) | coincidence (full) ; a coincidence (full) | speech ; queue ; entrance |
| g3u02.w.date-of-birth | date of birth | the day, month and year you have your birthday | Please write down your ___ — the day, month and year of your birthday. | date of birth (full) | date of birth (full) ; your date of birth (full) | speech ; stage ; entrance |
| g3u02.w.entrance | entrance | the door where you go into a building or a place | We are going to meet at the big ___ of the museum at three o'clock. | entrance (full) ; entrances (partial) | entrance (full) ; an entrance (full) | queue ; stage ; handbag |
| g3u02.w.handbag | handbag | a small thing a woman carries her keys and money in | She keeps her keys and money in her ___. | handbag (full) ; handbags (partial) | handbag (full) ; a handbag (full) | note ; queue ; entrance |
| g3u02.w.hang-on-a-minute | Hang on a minute. | a way to ask somebody to wait for a short time | ___ I just need to find my keys before we go. | Hang on a minute. (full) ; Hang on a minute (full) ; Hang on (partial) | Hang on a minute. (full) ; Hang on a minute (full) ; Hang on (partial) | awful ; I beg your pardon. ; What a ...! |
| g3u02.w.hold-on | Hold on! | a way to tell somebody to wait for a short time | ___ I need to put on my shoes before we go. | Hold on! (full) ; Hold on (full) | Hold on! (full) ; Hold on (full) | awful ; I beg your pardon. ; What a ...! |
| g3u02.w.i-beg-your-pardon | I beg your pardon. | a way to tell somebody you are sorry, or to ask them to tell you a thing again | ___ Can you tell me that again, please? I did not understand you. | I beg your pardon. (full) ; I beg your pardon (full) | I beg your pardon. (full) ; I beg your pardon (full) | Hold on! ; Hang on a minute. ; What a ...! |
| g3u02.w.laugh | laugh | the sound you make when you think a thing is funny | When a joke is very funny, you give a big ___. | laugh (full) ; laughs (partial) | laugh (full) ; a laugh (full) | note ; speech ; stage |
| g3u02.w.married | married | when you have a husband or a wife | My aunt is now ___ to my uncle. | married (full) | married (full) | divorced ; similar ; careless |
| g3u02.w.member | member | one of the people in a group | Every ___ of the group has a job to do. | member (full) ; members (partial) | member (full) ; a member (full) | author ; passenger ; thief |
| g3u02.w.north-pole | North Pole | the very cold place high up on the Earth, where there is a lot of snow and ice | I want to travel to the ___ one day to look at the snow and ice. | North Pole (full) | North Pole (full) ; the North Pole (full) | queue ; entrance ; stage |
| g3u02.w.note | note | money like a 50-pound one — it is not metal | The £50 ___ on the floor was mine. | note (full) ; notes (partial) | note (full) ; a note (full) | handbag ; queue ; speech |
| g3u02.w.passenger | passenger | one of the people who travel in a train, a ship or a plane | Every ___ on the ship was happy when it came to land. | passenger (full) ; passengers (partial) | passenger (full) ; a passenger (full) | member ; author ; thief |
| g3u02.w.per-cent | per cent | a number out of one hundred, with the % after it | About 80 ___ of the children in our year are very good at maths. | per cent (full) ; percent (partial) | per cent (full) ; percent (partial) | note ; speech ; stage |
| g3u02.w.queue | queue | a lot of people who wait to go into a place | There was a very long ___ of people waiting to go into the museum. | queue (full) ; queues (partial) | queue (full) ; a queue (full) | entrance ; stage ; speech |
| g3u02.w.similar | similar | when one thing looks very much like the other thing | My new sweater looks very much like yours, so they are very ___. | similar (full) | similar (full) | careless ; awful ; married |
| g3u02.w.south-pole | South Pole | the very cold place at the bottom of the Earth, where penguins live | Penguins live near the ___ in the cold south of the Earth. | South Pole (full) | South Pole (full) ; the South Pole (full) | North Pole ; entrance ; stage |
| g3u02.w.speech | speech | a talk that one man or woman gives in front of a lot of people | My teacher was giving a short ___ to the whole school in the morning. | speech (full) ; speeches (partial) | speech (full) ; a speech (full) | stage ; note ; queue |
| g3u02.w.stage | stage | a high place where a singer is, up in front of a lot of people | The singer was standing on the ___ while a lot of people watched. | stage (full) ; stages (partial) | stage (full) ; a stage (full) | speech ; entrance ; queue |
| g3u02.w.thief | thief (pl thieves) | a man or woman who steals | The police want to find the ___ who has the woman's handbag now. | thief (full) ; thieves (partial) | thief (full) ; a thief (full) ; thieves (partial) | member ; passenger ; author |
| g3u02.w.to-achieve | to achieve (a goal) | to do the thing you really wanted to do | After a long time, at last she ___ what she wanted. | achieved (full) | achieve (full) ; to achieve (full) ; achieved (full) | to survive ; to return ; to hand sth. in |
| g3u02.w.to-buy-sth | to buy sth. | you do this to a thing when you give money for it | I want to ___ a new book with my pocket money. | buy (full) ; bought (partial) | buy (full) ; buy sth. (full) ; to buy sth. (full) ; bought (partial) | to pay the bill ; to look at sth. ; to return |
| g3u02.w.to-drink-eat-sth | to drink/eat sth. | to put food or tea into your mouth | Would you like to ___ a tea or a piece of cake at the café? | drink (full) ; eat (full) ; drank (partial) ; ate (partial) | drink (full) ; eat (full) ; drink/eat sth. (full) ; to drink/eat sth. (full) | to buy sth. ; to pay the bill ; to look at sth. |
| g3u02.w.to-hand-sth-in | to hand sth. in | to give your work to a teacher or to somebody who looks after it | Please ___ your homework to the teacher before Friday. | hand in (full) ; handed in (partial) | hand in (full) ; hand sth. in (full) ; to hand sth. in (full) ; handed in (partial) | to return ; to steal ; to buy sth. |
| g3u02.w.to-leave-sb-alone | to leave sb. alone | to go away and not bother somebody | Lucas, please ___ your sister! She wants to read her book. | leave alone (full) ; leave her alone (full) ; left alone (partial) | leave sb. alone (full) ; to leave sb. alone (full) ; leave alone (full) | to wave ; to return ; to hand sth. in |
| g3u02.w.to-listen-to-music | to listen to music | to enjoy the sound of a singer with your ears, often with headphones on | He likes to put on his headphones and ___ on the long way to school. | listen to music (full) ; listened to music (partial) | listen to music (full) ; to listen to music (full) ; listening to music (partial) | to look at sth. ; to talk on the mobile ; to buy sth. |
| g3u02.w.to-look-at-sth | to look at sth. | to watch a thing with your eyes so you can enjoy it or study it | We were ___ at the pictures from our holiday on my tablet. | looking (full) | look at (full) ; look at sth. (full) ; to look at sth. (full) ; looked at (partial) | to listen to music ; to buy sth. ; to talk on the mobile |
| g3u02.w.to-look-forward-to-sth | to look forward to sth. | to feel happy about a good thing that is going to happen | Lucas was very much ___ to the school holidays in summer. | looking forward (full) | look forward to (full) ; look forward to sth. (full) ; to look forward to sth. (full) ; looking forward to (full) | to hand sth. in ; to return ; to wave |
| g3u02.w.to-pay-the-bill | to pay the bill | to give money for your food and drinks in a café or restaurant | After dinner my dad asked the waiter so he could ___ at the restaurant. | pay the bill (full) ; paid the bill (partial) | pay the bill (full) ; to pay the bill (full) ; paid the bill (partial) | to buy sth. ; to drink/eat sth. ; to look at sth. |
| g3u02.w.to-queue | to queue (up) | to wait with a lot of people to go into a place | They were all ___ up at the door to go into the museum. | queuing (full) ; queueing (partial) | queue (full) ; queue up (full) ; to queue up (full) ; queuing up (full) | to wave ; to return ; to hand sth. in |
| g3u02.w.to-return | to return | to bring a thing back to a place, or to go back to a place | Please ___ the library book before Friday. | return (full) ; returned (partial) | return (full) ; to return (full) ; returned (partial) | to steal ; to hand sth. in ; to buy sth. |
| g3u02.w.to-sink | to sink | to go down under the sea | A heavy stone is going to ___ to the bottom of the sea. | sink (full) ; sank (partial) ; sunk (partial) | sink (full) ; to sink (full) ; sank (partial) | to survive ; to wave ; to steal |
| g3u02.w.to-steal | to steal | to keep a thing that is not yours, like a thief does | The thief wanted to ___ the woman's money, but a man was watching him. | steal (full) ; stole (partial) ; stolen (partial) | steal (full) ; to steal (full) ; stole (partial) | to survive ; to return ; to hand sth. in |
| g3u02.w.to-survive | to survive | to stay alive after a very dangerous thing | The people on the small ship were very happy to ___ the big storm. | survive (full) ; survived (partial) | survive (full) ; to survive (full) ; survived (partial) | to sink ; to return ; to steal |
| g3u02.w.to-talk-on-the-mobile | to talk on the mobile | to speak with a friend who is not with you | Please do not ___ in class. | talk on the mobile (full) ; talked on the mobile (partial) | talk on the mobile (full) ; to talk on the mobile (full) ; talking on the mobile (partial) | to listen to music ; to look at sth. ; to pay the bill |
| g3u02.w.to-try-on-sunglasses | to try on sunglasses | to put a pair of these over your eyes to look if they are good on you | She wanted to ___ to look which ones were best on her. | try on sunglasses (full) ; tried on sunglasses (partial) | try on sunglasses (full) ; to try on sunglasses (full) ; trying on sunglasses (partial) | to buy sth. ; to look at sth. ; to pay the bill |
| g3u02.w.to-try-out | to try out | to do a new thing to find out if you like it or how good it is | Before you go on stage, ___ your jokes with a friend. | try out (full) ; tried out (partial) | try out (full) ; to try out (full) ; tried out (partial) | to hand sth. in ; to return ; to pay the bill |
| g3u02.w.to-wave | to wave | to put your arm up high to tell somebody hello or goodbye when they are far away | At the door of the museum, a girl was ___ at us to come over. | waving (full) | wave (full) ; to wave (full) ; waved (partial) | to queue (up) ; to return ; to hand sth. in |
| g3u02.w.what-a | What a ...! | a way to show a strong feeling about a thing | ___ beautiful day it is today! Let's go to the park. | What a (full) | What a (full) ; What a ...! (full) | Hold on! ; Hang on a minute. ; I beg your pardon. |

## Grammar items (51)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u02.gi.past-continuous.ag.001 | anagram | Die Form von 'sit', die nach was/were kommt: [de] | sitting (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.ag.002 | anagram | Die Form von 'run', die nach was/were kommt: [de] | running (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.ag.003 | anagram | Die Form von 'cross' im Satz 'The Titanic was ___ the Atlantic.': [de, 1 blank(s)] | crossing (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.cp.001 | context-picker | Gestern um 8 Uhr abends — welcher Satz beschreibt, was gerade passierte? [de] | My sister was cooking dinner. (full) | — | My sister cooked dinner. ; My sister cooks dinner every night. ; My sister has cooked dinner. | — | — | false |
| g3u02.gi.past-continuous.cp.002 | context-picker | Du erzählst von dem Moment, als der Feueralarm in der Schule losging. Welcher Satz passt? [de] | Our teacher was reading a story when the alarm went off. (full) | — | Our teacher read a story when the alarm went off. ; Our teacher reads a story when the alarm goes off. ; Our teacher was reading a story when the alarm was going off. | — | — | false |
| g3u02.gi.past-continuous.ec.001 | error-correction | I were playing football when Mum called. [en] | I was playing football when Mum called. (full) ; was playing (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.ec.002 | error-correction | She was walk to the shop when she met her friend. [en] | She was walking to the shop when she met her friend. (full) ; walking (partial) ; was walking (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.ec.003 | error-correction | I was walking to school when I was seeing a dog. [en] | I was walking to school when I saw a dog. (full) ; saw (partial) ; I saw a dog (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.ec.004 | error-correction | They was having a picnic in the park. [en] | They were having a picnic in the park. (full) ; were having (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.ec.005 | error-correction | She was reading a magazine while the dog was siting on the sofa. [en] | She was reading a magazine while the dog was sitting on the sofa. (full) ; sitting (partial) ; was sitting (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.ec.006 | error-correction | The thief was watch the two boys and the woman. [en] | The thief was watching the two boys and the woman. (full) ; watching (partial) ; was watching (partial) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.001 | gap-fill | The sun ___ (shine) and we ___ (have) a lot of fun. [en, 2 blank(s)] | was shining \| were having (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.002 | gap-fill | The Titanic ___ (cross) the Atlantic when it hit an iceberg. [en, 1 blank(s)] | was crossing (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.003 | gap-fill | While the hunter ___ (look) at the animals, they ran away. [en, 1 blank(s)] | was looking (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.004 | gap-fill | They ___ (queue) up at the entrance of the museum. [en, 1 blank(s)] | were queuing (full) ; were queueing (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.005 | gap-fill | At 8 o'clock I ___ (walk) my dog. [en, 1 blank(s)] | was walking (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.006 | gap-fill | The detective ___ (drive) down the street and it ___ (rain). [en, 2 blank(s)] | was driving \| was raining (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.007 | gap-fill | At 6 o'clock I ___ (have) a bath and my sister ___ (do) her homework. [en, 2 blank(s)] | was having \| was doing (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.008 | gap-fill | Mum and Dad ___ (watch) TV in the living room. [en, 1 blank(s)] | were watching (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.009 | gap-fill | At 8 p.m. last night, what ___ you ___ (do)? [en, 2 blank(s)] | were \| doing (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.010 | gap-fill | Lucas ___ (not / do) anything — Amelia just lost her phone. [en, 1 blank(s)] | wasn't doing (full) ; was not doing (full) | — | — | — | — | true |
| g3u02.gi.past-continuous.gf.011 | gap-fill | She ___ (not / wait) for the bus. She ___ (walk) home. [en, 2 blank(s)] | wasn't waiting \| was walking (full) ; was not waiting \| was walking (full) | — | — | — | — | true |
| g3u02.gi.past-continuous.gf.012 | gap-fill | The two boys ___ (not / look) at the thief. [en, 1 blank(s)] | weren't looking (full) ; were not looking (full) | — | — | — | — | true |
| g3u02.gi.past-continuous.gf.013 | gap-fill | We ___ (not / queue) — we were inside the museum. [en, 1 blank(s)] | weren't queuing (full) ; were not queuing (full) ; weren't queueing (full) ; were not queueing (full) | — | — | — | — | true |
| g3u02.gi.past-continuous.gf.014 | gap-fill | ___ you ___ (sleep) when I phoned you? [en, 2 blank(s)] | Were \| sleeping (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gf.015 | gap-fill | ___ the sun ___ (shine) when you arrived? [en, 2 blank(s)] | Was \| shining (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.gs.003 | group-sort | Richtig oder falsch? Sortiere die Sätze. [de] | — | — | — | — | ✓: I was walking to school., They were playing football., She was doing her homework. \| ✗: I were walking to school., They was playing football., She was do her homework. | false |
| g3u02.gi.past-continuous.gs.004 | group-sort | Welche Form passt? Sortiere die Personen. [de] | — | — | — | — | was: I ___ walking., She ___ reading., The dog ___ sleeping., He ___ driving. \| were: You ___ waiting., We ___ having fun., They ___ playing., The boys ___ talking. | false |
| g3u02.gi.past-continuous.gs.005 | group-sort | Lange oder kurze Handlung? Sortiere die Satzteile. [de] | — | — | — | — | was crossing: The Titanic was crossing the Atlantic, We were having dinner, I was walking my dog, The sun was shining \| hit: it hit an iceberg, the phone rang, I saw a dog, we saw the people | false |
| g3u02.gi.past-continuous.mc.001 | multiple-choice | The sun ___ when we arrived at the museum. [en, 1 blank(s)] | was shining (full) | — | were shining ; was shine ; shining | — | — | false |
| g3u02.gi.past-continuous.mc.002 | multiple-choice | My sister ___ the guitar when I came home. [en, 1 blank(s)] | was playing (full) | — | were playing ; was play ; playing | — | — | false |
| g3u02.gi.past-continuous.mc.003 | multiple-choice | They ___ a picnic in the park at 5 o'clock. [en, 1 blank(s)] | were having (full) | — | was having ; were have ; having | — | — | false |
| g3u02.gi.past-continuous.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | I was having dinner when the phone rang. (full) | — | I was having dinner when the phone was ringing. ; I had dinner when the phone rang. ; I were having dinner when the phone rang. | — | — | false |
| g3u02.gi.past-continuous.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | While we were eating, the lights went out. (full) | — | While we eating, the lights went out. ; While we were eating, the lights were going out. ; While we was eating, the lights went out. | — | — | false |
| g3u02.gi.past-continuous.mp.001 | matching-pairs | Welche Form von be passt zur Person? [de] | — | — | — | I ___ walking ↔ was ; They ___ playing ↔ were ; She ___ reading ↔ wasn't ; We ___ queuing ↔ weren't | — | true |
| g3u02.gi.past-continuous.mt.001 | matching | Anfang und passendes Ende [de] | — | — | — | The Titanic was crossing the Atlantic ↔ when it hit an iceberg. ; While we were having dinner, ↔ the phone rang. ; I was walking my dog ↔ when I saw a dog. ; The sun was shining and ↔ we were having a lot of fun. | — | false |
| g3u02.gi.past-continuous.mt.002 | matching | Frage und passende Antwort [de] | — | — | — | What were you doing at 8 p.m.? ↔ I was walking my dog. ; Was your sister sleeping? ↔ No, she was reading. ; Were the boys playing football? ↔ Yes, they were. ; What was the detective doing? ↔ He was driving down the street. | — | false |
| g3u02.gi.past-continuous.qf.001 | question-formation | you / sleep / when I phoned you [en] | Were you sleeping when I phoned you? (full) ; Were you sleeping when I called you? (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.qf.002 | question-formation | what / your sister / do / at 6 p.m. [en] | What was your sister doing at 6 p.m.? (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.sb.001 | sentence-building | she / was / cooking / dinner / at / 6 / pm [en] | She was cooking dinner at 6 pm. (full) ; At 6 pm she was cooking dinner. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.sb.002 | sentence-building | she / was / doing / her / homework / when / the / phone / rang [en] | She was doing her homework when the phone rang. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.sb.003 | sentence-building | the / sun / was / shining / and / we / were / having / fun [en] | The sun was shining and we were having fun. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.tf.001 | transformation | The phone rang. We were having dinner. (join with WHILE) [en] | While we were having dinner, the phone rang. (full) ; The phone rang while we were having dinner. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.tf.002 | transformation | I walk my dog. (8 o'clock last night) [en] | I was walking my dog at 8 o'clock last night. (full) ; At 8 o'clock last night I was walking my dog. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.tf.003 | transformation | She reads a book. The phone rings. (join with WHILE) [en] | While she was reading a book, the phone rang. (full) ; The phone rang while she was reading a book. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.tf.004 | transformation | He looks at his phone. He walks into a lamp post. (join with WHILE) [en] | While he was looking at his phone, he walked into a lamp post. (full) ; He walked into a lamp post while he was looking at his phone. (full) | — | — | — | — | false |
| g3u02.gi.past-continuous.tr.001 | translation | Ich ging gerade zur Schule, als es zu regnen begann. [de] | I was walking to school when it began to rain. (full) ; I was walking to school when it began raining. (full) | deToEn | — | — | — | false |
| g3u02.gi.past-continuous.tr.002 | translation | Während wir zu Abend aßen, klingelte plötzlich das Telefon. [de] | While we were having dinner, the phone suddenly rang. (full) ; While we were eating dinner, the phone suddenly rang. (full) ; While we were having dinner, the phone rang suddenly. (full) | deToEn | — | — | — | false |
| g3u02.gi.past-continuous.tr.003 | translation | Was hast du gestern um 9 Uhr gemacht? [de] | What were you doing at 9 o'clock yesterday? (full) ; What were you doing yesterday at 9 o'clock? (full) | deToEn | — | — | — | false |
| g3u02.gi.past-continuous.tr.004 | translation | Die Sonne schien und alle stellten sich am Eingang an. [de] | The sun was shining and everybody was queuing at the entrance. (full) ; The sun was shining and everybody was queueing at the entrance. (full) | deToEn | — | — | — | false |
| g3u02.gi.past-continuous.tr.005 | translation | Ich habe gerade ein Buch gelesen, als du mich angerufen hast. [de] | I was reading a book when you called me. (full) ; I was reading a book when you phoned me. (full) ; I was reading a book when you rang me. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u02/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u02",
  "lens": "answers",
  "itemsHash": "64ae9f12e91f",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 93, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
