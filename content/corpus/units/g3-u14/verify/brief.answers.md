# Verify lens — answers — g3-u14 (round 1)

<!-- domigo:verify answers g3-u14 items=fa94353c94ba prompt=70fa2d8cdf22 round=1 -->

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
| g3u14.w.at-once | at once | now, this very second | If you find him, tell me ___! | at once (full) | at once (full) | otherwise ; by the way ; round a bend |
| g3u14.w.balcony | balcony | a small place outside a window where you can stand up | We had a hotel room with a ___ and we watched the sea from there. | balcony (full) ; balconies (partial) | balcony (full) ; balconies (full) | engine ; branch ; bush |
| g3u14.w.branch | branch | a piece of a tree that the leaves are on | The lion was high up on a thick ___ in the old tree. | branch (full) ; branches (partial) | branch (full) ; branches (full) | bush ; bug ; engine |
| g3u14.w.bug | bug | a very small animal like a fly that lives in a garden | There was a tiny ___ with black spots on the window in the garden. | bug (full) ; bugs (partial) | bug (full) ; bugs (full) ; insect (partial) | branch ; bush ; crash |
| g3u14.w.bush | bush | a short, thick green thing in a garden with many small branches | The wild dog was hiding behind the big green ___ in the garden. | bush (full) ; bushes (partial) | bush (full) ; bushes (full) | branch ; bug ; wetland |
| g3u14.w.by-the-way | by the way | you can use this to add a new thing while you are talking | ___, did I tell you that we have homework tomorrow? | By the way (full) ; by the way (full) | by the way (full) | at once ; otherwise ; round a bend |
| g3u14.w.crash | crash | an accident when a car drives into a thing very fast | There was a bad car ___ on the road and the police closed it. | crash (full) ; crashes (partial) | crash (full) ; crashes (full) | cut ; sunburn ; crime |
| g3u14.w.crime | crime | a very bad thing that the police can punish you for | Stealing money from a shop is a ___ and the police can punish you for it. | crime (full) ; crimes (partial) | crime (full) ; crimes (full) | crash ; cut ; sunburn |
| g3u14.w.cut | cut | a small hurt place on your skin from a knife | The man had a small ___ on his finger from the knife. | cut (full) ; cuts (partial) | cut (full) ; cuts (full) | sunburn ; crash ; crime |
| g3u14.w.engine | engine | the machine in a car that makes it move | We could not drive because the car ___ did not work. | engine (full) ; engines (partial) | engine (full) ; engines (full) | front seat ; branch ; bush |
| g3u14.w.front-seat | front seat | the place in a car next to the driver | I always travel in the ___ next to the driver. | front seat (full) ; front seats (partial) | front seat (full) ; front seats (full) | engine ; balcony ; branch |
| g3u14.w.impolite | impolite | not at all nice to people, the way rude people are | It is very ___ to interrupt people while they are speaking. | impolite (full) | impolite (full) | shocked ; stuffed ; otherwise |
| g3u14.w.official-language | official language | the way of speaking and writing that a country uses for its government | English is the ___ of Botswana, and most people use it every day. | official language (full) | official language (full) | wild animal ; park ranger ; front seat |
| g3u14.w.otherwise | otherwise | if you do not, or if that does not happen | You must leave now, ___ you will miss the last train home. | otherwise (full) | otherwise (full) | at once ; by the way ; round a bend |
| g3u14.w.park-ranger | park ranger | a man or woman whose job is to look after the wild animals and the trees | The ___ at the national park looks after the wild animals and the trees. | park ranger (full) ; park rangers (partial) | park ranger (full) ; park rangers (full) | wild animal ; official language ; front seat |
| g3u14.w.round-a-bend | round a bend | when a car has to drive to the right to stay on the road | Our car came ___, and after that we could drive home. | round a bend (full) ; around a bend (partial) | round a bend (full) ; around a bend (full) | at once ; otherwise ; by the way |
| g3u14.w.shocked | shocked | very surprised and upset about a bad thing | Everyone was really ___ about the bad accident on the road. | shocked (full) | shocked (full) | stuffed ; impolite ; otherwise |
| g3u14.w.stuffed | stuffed | with material inside to keep its shape, like a dead animal in a museum | There was a ___ brown wolf with glass eyes in the museum — it looked alive but was dead. | stuffed (full) | stuffed (full) | shocked ; impolite ; otherwise |
| g3u14.w.sunburn | sunburn | red, painful skin from too much sun | I was in the sun for too long and now I have a bad red ___ on my shoulders. | sunburn (full) | sunburn (full) | cut ; crash ; crime |
| g3u14.w.to-book-a-holiday | to book a holiday | to pay for a trip away before you travel, so your place is saved | My parents are going to ___ to Italy, and we will stay in a nice hotel for a week. | book a holiday (full) ; booked a holiday (partial) ; to book a holiday (partial) | book a holiday (full) ; to book a holiday (full) ; booked a holiday (full) | to plan a trip ; to hire a car ; to make a hotel reservation |
| g3u14.w.to-buy-a-dictionary | to buy a dictionary | a book to help you understand a language that is new to you | She wants to ___ so she can understand more French on holiday. | buy a dictionary (full) ; bought a dictionary (partial) ; to buy a dictionary (partial) | buy a dictionary (full) ; to buy a dictionary (full) ; bought a dictionary (full) | to book a holiday ; to hire a car ; to plan a trip |
| g3u14.w.to-check-the-area-out-online | to check the area out online | to read about a place on a screen before you travel there | Let's ___ to find the streets and good places before we travel. | check the area out online (full) ; checked the area out online (partial) ; to check the area out online (partial) | check the area out online (full) ; to check the area out online (full) ; checked the area out online (full) | to look at a map of the area ; to find out what to do there ; to hire a car |
| g3u14.w.to-dig | to dig | to make a hole in the ground | My dog loves to ___ big holes in the garden ground with his paws. | dig (full) ; to dig (partial) | dig (full) ; to dig (full) | to prefer ; to whisper ; to turn over |
| g3u14.w.to-drive-off | to drive off | to leave a place very fast in a car | Suddenly the black car ___ very fast and we could not stop it. | drove off (full) ; drives off (partial) ; drive off (partial) ; to drive off (partial) | drive off (full) ; to drive off (full) ; drove off (full) | to turn over ; to dig ; to whisper |
| g3u14.w.to-find-information-about-the-best-beaches | to find information about the best beaches | to look up which places near the sea are the nicest for swimming | We are going to ___ for our summer holiday near the sea. | find information about the best beaches (full) ; to find information about the best beaches (partial) | find information about the best beaches (full) ; to find information about the best beaches (full) | to find out about good restaurants ; to find out what to do there ; to hire a car |
| g3u14.w.to-find-out-about-good-restaurants | to find out about good restaurants | to look up which places to eat are nice before you go there | Let's ___ near our hotel so we know where to eat dinner. | find out about good restaurants (full) ; to find out about good restaurants (partial) | find out about good restaurants (full) ; to find out about good restaurants (full) | to find information about the best beaches ; to find out what to do there ; to book a holiday |
| g3u14.w.to-find-out-what-to-do-there | to find out what to do there | to look up the fun things a place has before you go | Before we travel, let's ___ — museums, parks, beaches, and more. | find out what to do there (full) ; to find out what to do there (partial) | find out what to do there (full) ; to find out what to do there (full) | to find out about good restaurants ; to look at a map of the area ; to hire a car |
| g3u14.w.to-hire-a-car | to hire a car | to pay money so you can use it for a short time, then give it back | At the airport we are going to ___ so we can drive to the beach on our own. | hire a car (full) ; hired a car (partial) ; to hire a car (partial) | hire a car (full) ; to hire a car (full) ; hired a car (full) | to book a holiday ; to plan a trip ; to make a hotel reservation |
| g3u14.w.to-look-at-a-map-of-the-area | to look at a map of the area | to study a plan of the streets so you can find your way in a place | Let's ___ so we do not get lost in the old town. | look at a map of the area (full) ; looked at a map of the area (partial) ; to look at a map of the area (partial) | look at a map of the area (full) ; to look at a map of the area (full) ; looked at a map of the area (full) | to check the area out online ; to find out what to do there ; to hire a car |
| g3u14.w.to-make-a-hotel-reservation | to make a hotel reservation | to ask for a room where you will stay before you travel there | We need to ___ so we have a room when we travel to the hotel at night. | make a hotel reservation (full) ; made a hotel reservation (partial) ; to make a hotel reservation (partial) | make a hotel reservation (full) ; to make a hotel reservation (full) ; made a hotel reservation (full) | to book a holiday ; to hire a car ; to plan a trip |
| g3u14.w.to-plan-a-trip | to plan a trip | to think about where to go and what to do on a journey | Before our holiday, we want to ___ so we know where to travel and what to do. | plan a trip (full) ; to plan a trip (partial) | plan a trip (full) ; to plan a trip (full) | to book a holiday ; to hire a car ; to look at a map of the area |
| g3u14.w.to-prefer | to prefer | to want one thing more than you want a second thing | My mum ___ tea to milk because she likes tea more. | prefers (full) ; prefer (partial) ; preferred (partial) | prefer (full) ; to prefer (full) ; prefers (full) ; preferred (full) | to dig ; to whisper ; to drive off |
| g3u14.w.to-turn-over | to turn over | when a car lands with its roof down on the ground | The car ___ on the road and landed on its roof. | turned over (full) ; turns over (partial) ; turn over (partial) ; to turn over (partial) | turn over (full) ; to turn over (full) ; turned over (full) | to drive off ; to dig ; to whisper |
| g3u14.w.to-whisper | to whisper | to use a very small voice so just one man or woman can understand you | He ___ the secret in my ear so nobody could know it. | whispered (full) ; whispers (partial) ; whisper (partial) ; to whisper (partial) | whisper (full) ; to whisper (full) ; whispered (full) | to dig ; to drive off ; to turn over |
| g3u14.w.wetland | wetland | a big area of land that is always very wet | Many wild animals live in the ___ near the river, where the ground is always wet. | wetland (full) ; wetlands (partial) | wetland (full) ; wetlands (full) | bush ; branch ; balcony |
| g3u14.w.wild-animal | wild animal | a lion or a wolf that lives free and that people do not keep at home | You must never touch a ___ like a wolf because it can hurt you. | wild animal (full) ; wild animals (partial) | wild animal (full) ; wild animals (full) | official language ; park ranger ; front seat |
| g3u14.w.wildlife | wildlife | wild animals that live free in their home in the wild | This national park is famous for its ___ — lions, elephants, and many wild animals. | wildlife (full) | wildlife (full) | wetland ; wild animal ; official language |

## Grammar items (28)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g3u14.gi.going-to-evidence.cp.001 | context-picker | Du siehst dunkle Wolken am Himmel. Welcher Satz passt? [de] | It's going to rain. (full) | — | It rains every day in November. ; It will rain tomorrow, I think. ; It rained this morning. | — | — | false |
| g3u14.gi.going-to-evidence.cp.002 | context-picker | Im Restaurant ruft jemand zu dir: 'Can someone get the phone?' Du springst spontan auf, ohne es vorher geplant zu haben. Was sagst du? [de] | I'll get it! (full) | — | I'm going to get it. ; I get it. ; I'm getting it tomorrow. | — | — | false |
| g3u14.gi.going-to-evidence.ec.001 | error-correction | Finde und verbessere den Fehler: Look at those clouds! It going to rain. [de] | Look at those clouds! It's going to rain. (full) ; Look at those clouds! It is going to rain. (full) ; It's going to rain (partial) ; It is going to rain (partial) | — | — | — | — | true |
| g3u14.gi.going-to-evidence.ec.002 | error-correction | Finde und verbessere den Fehler: The baby is crying. She is going to wants her mum. [de] | The baby is crying. She is going to want her mum. (full) ; She is going to want her mum. (partial) ; is going to want (partial) | — | — | — | — | true |
| g3u14.gi.going-to-evidence.ec.003 | error-correction | Finde und verbessere den Fehler: Look at the dog! It are going to chase the cat. [de] | Look at the dog! It is going to chase the cat. (full) ; It is going to chase the cat. (partial) ; is going to chase (partial) | — | — | — | — | true |
| g3u14.gi.going-to-evidence.gf.001 | gap-fill | Du siehst dunkle Wolken am Himmel und sagst voraus, was gleich passiert: 'Look at those dark clouds! It ___ (rain).' [de, 1 blank(s)] | is going to rain (full) ; 's going to rain (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.002 | gap-fill | Das Auto ist außer Kontrolle. Du siehst es kommen und sagst: 'The car is out of control - it ___ (crash)!' [de, 1 blank(s)] | is going to crash (full) ; 's going to crash (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.003 | gap-fill | Dein kleiner Bruder lehnt sich auf seinem Sessel weit zurück. Du warnst deine Eltern: 'Watch out! He ___ (fall) down!' [de, 1 blank(s)] | is going to fall (full) ; 's going to fall (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.004 | gap-fill | Deine Freundin trägt einen riesigen Stapel Teller, und er wackelt. Du machst eine Vorhersage: 'Careful! You ___ (drop) those plates!' [de, 1 blank(s)] | are going to drop (full) ; 're going to drop (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.006 | gap-fill | Schau auf die Uhr und den Stau! Fülle beide Lücken: 'Look at the traffic! We ___ (not / be) there on time. We ___ (be) late again.' (Schreib die Form mit going to.) [de, 2 blank(s)] | aren't going to be \| are going to be (full) ; are not going to be \| are going to be (full) ; 're not going to be \| 're going to be (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.007 | gap-fill | Oliver schreibt aus Botswana über seinen Plan für morgen: 'I ___ (dig) for diamonds tomorrow.' [de, 1 blank(s)] | am going to dig (full) ; 'm going to dig (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gf.008 | gap-fill | Das Mädchen sieht sehr müde aus, ihre Augen schließen sich. Du sagst voraus: 'She ___ (fall) asleep in class.' [de, 1 blank(s)] | is going to fall (full) ; 's going to fall (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.gs.001 | group-sort | Sortiere: Siehst du einen Beweis JETZT (going to) oder ist es nur eine Meinung über später (will)? [de] | — | — | — | — | going to: Look at those clouds - it's going to rain., The car is out of control - it's going to crash., Watch out, he's going to fall down! \| will: I think it will be sunny tomorrow., Maybe our team will play well this year., I'm sure you will like it. | false |
| g3u14.gi.going-to-evidence.gs.002 | group-sort | Sortiere die Sätze: richtig (✓) oder falsch (✗) gebaut? [de] | — | — | — | — | ✓: It's going to rain., They are going to drop the plates., He is going to fall down. \| ✗: It going to rain., They is going to drop the plates., He is going to falls down. | false |
| g3u14.gi.going-to-evidence.mc.001 | multiple-choice | Der Himmel wird ganz dunkel. Welche Vorhersage passt, wenn du den Beweis vor dir siehst? [de] | It's going to storm. (full) | — | It storms. ; It stormed. ; It will storm, I think. | — | — | false |
| g3u14.gi.going-to-evidence.mc.002 | multiple-choice | Welcher Satz benutzt going to richtig für eine Vorhersage, die du gerade vor dir siehst? [de] | Look! The dog is jumping at the table. It's going to drop the food! (full) | — | I'm going to be a doctor when I grow up. ; We're going to visit Grandma next weekend. ; She's going to have a party on Saturday. | — | — | false |
| g3u14.gi.going-to-evidence.mc.003 | multiple-choice | Du hast gerade keinen Beweis - es ist nur deine Meinung über morgen. Welcher Satz passt? [de] | I think it will rain tomorrow. (full) | — | Look, it's going to rain right now! ; It's going to rain, look at those clouds. ; The clouds are dark, it's going to rain. | — | — | false |
| g3u14.gi.going-to-evidence.mc.004 | multiple-choice | Welche Form gehört in die Lücke? 'Watch out! The plates ___ off the table!' [de, 1 blank(s)] | are going to fall (full) | — | is going to fall ; are going to falls ; going to fall | — | — | false |
| g3u14.gi.going-to-evidence.mt.001 | matching | Verbinde jeden Beweis mit der passenden Vorhersage. [de] | — | — | — | The sky is full of dark clouds. ↔ It's going to rain. ; The dog is running at the parrot. ↔ It's going to chase it. ; He's eaten lots of cake. ↔ He's going to be sick. ; Her eyes are closing. ↔ She's going to fall asleep. ; The car is out of control. ↔ It's going to crash. | — | false |
| g3u14.gi.going-to-evidence.qf.001 | question-formation | Deine Freundin trägt einen riesigen Stapel Teller. Stell eine besorgte Frage mit den Wörtern: you / going to / those / drop / are [de] | Are you going to drop those? (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.qf.002 | question-formation | Oliver hat einen Plan. Frag ihn danach mit den Wörtern: are / going to / what / do / you / in Botswana [de] | What are you going to do in Botswana? (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.sb.001 | sentence-building | is / to / it / rain / going [en] | It is going to rain. (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.sb.002 | sentence-building | going / they / to / aren't / drop / the / plates [en] | They aren't going to drop the plates. (full) ; They're not going to drop the plates. (partial) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.tf.003 | transformation | Mach aus dieser Aussage eine Frage mit going to: 'Your parents are going to call the police.' (Frage) [de] | Are your parents going to call the police? (full) ; Are they going to call the police? (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.tf.004 | transformation | Schreib den Satz mit going to so um, dass er das Gegenteil sagt (mit not): 'We're going to be on time.' [de] | We aren't going to be on time. (full) ; We're not going to be on time. (full) ; We are not going to be on time. (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.tf.005 | transformation | Schreib den Satz mit going to um. Der Beweis ist sichtbar. 'The cup is at the end of the table.' (Vorhersage mit fall down) [de] | It's going to fall down. (full) ; It is going to fall down. (full) ; The cup is going to fall down. (full) | — | — | — | — | false |
| g3u14.gi.going-to-evidence.tr.002 | translation | Übersetze ins Englische (du siehst es gerade passieren): 'Pass auf! Die Tasse wird hinunterfallen!' [de] | Watch out! The cup is going to fall down! (full) ; Look out! The cup is going to fall down! (full) | deToEn | — | — | — | false |
| g3u14.gi.going-to-evidence.tr.003 | translation | Übersetze ins Englische (du siehst den Beweis): 'Schau dir die Wolken an! Es wird regnen.' [de] | Look at the clouds! It's going to rain. (full) ; Look at the clouds! It is going to rain. (full) ; Look at those clouds! It's going to rain. (full) ; Look at those clouds! It is going to rain. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g3-u14/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g3-u14",
  "lens": "answers",
  "itemsHash": "fa94353c94ba",
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
