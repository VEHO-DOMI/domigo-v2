# Verify lens — answers — g1-u10 (round 1)

<!-- domigo:verify answers g1-u10 items=5c0bbc31ed04 prompt=70fa2d8cdf22 round=1 -->

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

## Vocab items (44)

| id | w | d | s | sAnswers | dAnswers | mc |
|---|---|---|---|---|---|---|
| g1u10.w.100-one-hundred | 100 one hundred | It is ten times ten. | The mobile phone is over ___ pounds. It is very expensive. | one hundred (full) ; a hundred (partial) ; hundred (partial) ; 100 (full) | one hundred (full) ; a hundred (partial) ; hundred (partial) ; 100 (full) | one thousand ; ninety ; ten |
| g1u10.w.1000-one-thousand | 1000 one thousand | It is ten times a hundred. | This mobile phone is over ___ pounds! That is a lot of money. | one thousand (full) ; a thousand (partial) ; thousand (partial) ; 1000 (full) ; 1,000 (full) | one thousand (full) ; a thousand (partial) ; thousand (partial) ; 1000 (full) ; 1,000 (full) | one hundred ; ninety ; fifty |
| g1u10.w.20-twenty | 20 twenty | The number after 19 and before 21. It is two times ten. | Look at the price tag: the headphones are ___ pounds. | twenty (full) ; 20 (full) | twenty (full) ; 20 (full) | thirty ; fifty ; ten |
| g1u10.w.30-thirty | 30 thirty | The number after 29 and before 31. It is three times ten. | Look at the price tag. The book is ___ pounds. | thirty (full) ; 30 (full) | thirty (full) ; 30 (full) | twenty ; forty ; ten |
| g1u10.w.40-forty | 40 forty | The number after 39 and before 41. It is four times ten. | I'd like ___ kilos of beans, please. I love beans! | forty (full) ; 40 (full) | forty (full) ; 40 (full) | fifty ; twenty ; thirty |
| g1u10.w.50-fifty | 50 fifty | The number after 49 and before 51. It is five times ten. | Trainers for ___ pounds! Come and see them in the window. | fifty (full) ; 50 (full) | fifty (full) ; 50 (full) | forty ; sixty ; twenty |
| g1u10.w.60-sixty | 60 sixty | The number after 59 and before 61. It is six times ten. | How much is the magazine? It's ___ pence. | sixty (full) ; 60 (full) | sixty (full) ; 60 (full) | fifty ; seventy ; twenty |
| g1u10.w.70-seventy | 70 seventy | The number after 69 and before 71. It is seven times ten. | The price of the shoes in the window is ___ pounds. | seventy (full) ; 70 (full) | seventy (full) ; 70 (full) | sixty ; eighty ; twenty |
| g1u10.w.80-eighty | 80 eighty | The number after 79 and before 81. It is eight times ten. | A jacket for ___ pounds! Look at the price tag. | eighty (full) ; 80 (full) | eighty (full) ; 80 (full) | seventy ; ninety ; twenty |
| g1u10.w.90-ninety | 90 ninety | The number after 89 and before 91. Ten more and you have one hundred. | Three sweaters for ___ pounds! That's a good price. | ninety (full) ; 90 (full) | ninety (full) ; 90 (full) | eighty ; seventy ; one hundred |
| g1u10.w.anything-else | Anything else? | In a shop, you ask this to find out if the customer wants more. | Here are your three key rings. ___ — No, thank you. | Anything else? (full) ; Anything else (partial) | Anything else? (full) ; Anything else (partial) | No problem. ; Goodbye. ; That's better. |
| g1u10.w.be-careful | Be careful. | You want a friend to look out, so they are not hurt. | The floor is wet over there. ___ Don't fall down! | Be careful. (full) ; Be careful (partial) | Be careful. (full) ; Be careful (partial) | No problem. ; Goodbye. ; Just a minute. |
| g1u10.w.can-i-help-you | Can I help you? | In a shop, you ask this when a customer comes in. | ___ — Yes, please. How much is this magazine? | Can I help you? (full) ; Can I help you (partial) | Can I help you? (full) ; Can I help you (partial) | What can I do for you? ; Anything else? ; No wonder. |
| g1u10.w.changing-room | changing room | In a shop, you go in here to try on clothes. | You can't try the trousers on here. Go to the ___, please. | changing room (full) | changing room (full) | drawer ; town ; window |
| g1u10.w.computer-game | computer game | Something fun you play on a screen. | How much is this ___? — It's 34 pounds. | computer game (full) | computer game (full) | magazine ; scooter ; headphones |
| g1u10.w.congratulations | Congratulations! | You are very happy for a friend who did something very well. | You are the best in the class! ___ Well done! | Congratulations! (full) ; Congratulations (partial) | Congratulations! (full) ; Congratulations (partial) | No wonder. ; Be careful. ; Goodbye. |
| g1u10.w.customer | customer | Somebody who comes to a shop and gives money for food and clothes. | Mr Anderson is nice to every ___ in his shop. | customer (full) | customer (full) | price ; town ; rule |
| g1u10.w.drawer | drawer | A box in a desk that you pull open. Your socks or pens are in it. | All my socks are in the ___ — I pull it open to get them. | drawer (full) | drawer (full) | window ; door ; changing room |
| g1u10.w.everything | everything | All of it, with nothing forgotten. | Have you got ___ for the trip — your bag, your shoes and your hat? | everything (full) | everything (full) | nothing ; those ; these |
| g1u10.w.expensive | expensive | It is a lot of money. You need a lot of money to get it. | Everything in this shop is very ___. I can't get it all. | expensive (full) | expensive (full) | happy ; free ; small |
| g1u10.w.goodbye | Goodbye. | A nice bye, when you go away or leave. | Thank you for your money. Here are your sweets. ___ | Goodbye. (full) ; Goodbye (partial) ; Bye. (partial) | Goodbye. (full) ; Goodbye (partial) ; Bye. (partial) | Hello. ; No wonder. ; Anything else? |
| g1u10.w.headphones | headphones | You put them over your two ears so you can listen to music. | She can't listen to you now. She has ___ on for her music. | headphones (full) | headphones (full) | sunglasses ; magazine ; scooter |
| g1u10.w.how-much-is-are | how much is/are ... | You ask this in a shop when you want to find out the price of something. | ___ the trainers? — They're 69 pounds. | How much are (full) ; How much is (partial) | how much is (full) ; how much are (full) | Anything else? ; No problem. ; That's better. |
| g1u10.w.i-d-like | I'd like ... | You want something in a shop, so you ask for it. | ___ 20 kilos of rice, please. And then some carrots. | I'd like (full) ; I would like (full) | I'd like (full) ; I would like (full) | No problem. ; Be careful. ; Anything else? |
| g1u10.w.just-a-minute | Just a minute. | You ask a friend to wait a very short time. | ___ I want to find my keys before we go out. | Just a minute. (full) ; Just a minute (partial) | Just a minute. (full) ; Just a minute (partial) | No wonder. ; Be careful. ; That's better. |
| g1u10.w.key-ring | key ring | You open your door with what is on it. Then you don't lose it. | I put my door key on my ___ so I don't lose it. | key ring (full) | key ring (full) | magazine ; tin ; scooter |
| g1u10.w.magazine | magazine | A thin book with lots of pictures and short stories. You read it for fun. | Can I have this ___, please? I want to read it on the train. | magazine (full) | magazine (full) | computer game ; headphones ; tin |
| g1u10.w.mobile-phone | mobile phone | A small thing you take with you. You can call your friends and read messages on it. | I'd like a ___, please. I want to call my friends with it. | mobile phone (full) ; mobile (partial) | mobile phone (full) ; mobile (partial) | computer game ; scooter ; magazine |
| g1u10.w.no-problem | No problem. | It is all good. You are happy to help. | I don't like the jeans. — ___ What about the trousers over there? | No problem. (full) ; No problem (partial) | No problem. (full) ; No problem (partial) | No wonder. ; Be careful. ; Anything else? |
| g1u10.w.no-wonder | No wonder. | You understand why it happens. It is not a big surprise. | Everything here is so expensive! ___ I can't get it all. | No wonder. (full) ; No wonder (partial) | No wonder. (full) ; No wonder (partial) | No problem. ; Be careful. ; That's better. |
| g1u10.w.over-there | over there | Not near you. It is far away, but you can still see it. | How much are those socks ___ in the window? | over there (full) | over there (full) | over here ; next to ; in front of |
| g1u10.w.price | price | How much money you give for something. You can see it on the tag. | There's no ___ on the key ring, so I can't see how much it is. | price (full) | price (full) | rule ; town ; drawer |
| g1u10.w.rule | rule | Something that you must do or must not do. In class you cannot break it. | One ___ in our shop is: be nice to every customer. | rule (full) | rule (full) | price ; town ; drawer |
| g1u10.w.scooter | scooter | You stand on it and push with one foot. It has two small wheels. | I ride my ___ to school every morning. | scooter (full) | scooter (full) | computer game ; headphones ; magazine |
| g1u10.w.suddenly | suddenly | When something happens all at once. You do not understand it before. | Mr Anderson is asleep. ___, a horse comes into the shop! | Suddenly (full) ; suddenly (full) | suddenly (full) | always ; usually ; often |
| g1u10.w.sweets | sweets (pl) | You eat them and they have a lot of sugar. They are very nice, but bad for your teeth. | The ___ are one pound 99. Don't eat too many! | sweets (full) | sweets (full) | headphones ; tin ; magazine |
| g1u10.w.that-s-better | That's better. | Something is good now, but it was not good before. | Put the sweater in the drawer. ___ Now it looks nice. | That's better. (full) ; That's better (partial) ; That is better. (partial) | That's better. (full) ; That's better (partial) | No wonder. ; Be careful. ; No problem. |
| g1u10.w.these | these | When there is more than one and it is here, close to you. | I'd like ___ shoes here in front of me, please. | these (full) | these (full) | those ; that ; everything |
| g1u10.w.those | those | When there is more than one and it is over there, far from you. | I'd like ___ trainers over there in the window. | those (full) | those (full) | these ; this ; everything |
| g1u10.w.tin | tin | There is food in it. You open it to get the chicken soup out. | A ___ of chicken soup, please. We can have it for dinner. | tin (full) | tin (full) | scooter ; headphones ; magazine |
| g1u10.w.to-fall-asleep | to fall asleep | To go to sleep. You are tired and then your eyes close. | There are no customers, so Mr Anderson sits on his chair and ___. | falls asleep (full) ; fall asleep (partial) | to fall asleep (full) ; fall asleep (full) ; falls asleep (partial) | walk away ; sit down ; stand up |
| g1u10.w.to-walk-away | to walk away | To leave a room on your feet. | The horse picks up the food and ___ from the shop. | walks away (full) ; walk away (partial) | to walk away (full) ; walk away (full) ; walks away (partial) | come back ; fall asleep ; stand up |
| g1u10.w.town | town | A small city with streets, houses and shops. Many families live here. | There's a small shop in our ___ on Baker Street. | town (full) | town (full) | city ; park ; river |
| g1u10.w.what-can-i-do-for-you | What can I do for you? | In a shop, you ask a customer this to find out how to help. | Good morning! ___ — Yes, I'd like a magazine, please. | What can I do for you? (full) ; What can I do for you (partial) | What can I do for you? (full) ; What can I do for you (partial) | Can I help you? ; Anything else? ; No wonder. |

## Grammar items (63)

| id | fmt | prompt | answers | direction | distractors | pairs | groups | strict |
|---|---|---|---|---|---|---|---|---|
| g1u10.gi.how-much.ag.001 | anagram | Das Wort fehlt: How ___ is the scooter? (wie viel?) [de, 1 blank(s)] | much (full) | — | — | — | — | false |
| g1u10.gi.how-much.ag.002 | anagram | Das Wort fehlt: How much is the computer ___? (das Computerspiel) [de, 1 blank(s)] | game (full) | — | — | — | — | false |
| g1u10.gi.how-much.cp.001 | context-picker | Du stehst im Geschäft und zeigst auf einen Roller. Frag, wie viel er kostet. [de] | How much is this scooter? (full) | — | How much are this scooter? ; How much is these scooter? ; How much costs this scooter? | — | — | false |
| g1u10.gi.how-much.cp.002 | context-picker | Du zeigst auf Kopfhörer im Regal. Frag, wie viel sie kosten. [de] | How much are these headphones? (full) | — | How much is these headphones? ; How much are this headphones? ; How much costs these headphones? | — | — | false |
| g1u10.gi.how-much.ec.001 | error-correction | How much is the headphones? [en] | How much are the headphones? (full) ; are (partial) | — | — | — | — | false |
| g1u10.gi.how-much.ec.002 | error-correction | How much costs it? [en] | How much is it? (full) ; is (partial) | — | — | — | — | false |
| g1u10.gi.how-much.ec.003 | error-correction | How much are this magazine? [en] | How much is this magazine? (full) ; is (partial) | — | — | — | — | false |
| g1u10.gi.how-much.gf.001 | gap-fill | How much ___ the scooter? [en, 1 blank(s)] | is (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.002 | gap-fill | How much ___ the headphones? [en, 1 blank(s)] | are (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.003 | gap-fill | How much ___ the key ring? [en, 1 blank(s)] | is (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.004 | gap-fill | How much ___ these sweets? [en, 1 blank(s)] | are (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.005 | gap-fill | How much ___ this computer game? [en, 1 blank(s)] | is (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.006 | gap-fill | How much ___ those jeans? [en, 1 blank(s)] | are (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.007 | gap-fill | How much ___ the magazine? [en, 1 blank(s)] | is (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.008 | gap-fill | ___ ___ is the mobile phone? [en, 2 blank(s)] | How \| much (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.009 | gap-fill | How ___ ___ the headphones? [en, 2 blank(s)] | much \| are (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.010 | gap-fill | How much ___ the tin? [en, 1 blank(s)] | is (full) | — | — | — | — | false |
| g1u10.gi.how-much.gf.011 | gap-fill | How much ___ those headphones over there? [en, 1 blank(s)] | are (full) | — | — | — | — | false |
| g1u10.gi.how-much.gs.001 | group-sort | Womit fragst du nach dem Preis – mit "is" oder mit "are"? [de] | — | — | — | — | How much is ...?: the scooter, this magazine, the key ring, the computer game \| How much are ...?: the headphones, these sweets, the jeans, those trainers | false |
| g1u10.gi.how-much.mc.001 | multiple-choice | How much ___ the mobile phone? [en, 1 blank(s)] | is (full) | — | are ; do ; does | — | — | false |
| g1u10.gi.how-much.mc.002 | multiple-choice | How much ___ the sweets? [en, 1 blank(s)] | are (full) | — | is ; does ; do | — | — | false |
| g1u10.gi.how-much.mc.005 | multiple-choice | How much ___ the jeans? [en, 1 blank(s)] | are (full) | — | is ; do ; does | — | — | false |
| g1u10.gi.how-much.mc.006 | multiple-choice | Welche Frage ist richtig? [de] | How much are the headphones? (full) | — | How much is the headphones? ; How much costs the headphones? ; How many are the headphones? | — | — | false |
| g1u10.gi.how-much.mc.007 | multiple-choice | Welche Frage ist richtig? [de] | How much is the scooter? (full) | — | How much are the scooter? ; How much costs the scooter? ; How much is the scooters? | — | — | false |
| g1u10.gi.how-much.mp.001 | matching-pairs | Welches kleine Wort passt zu welchem Ding? [de] | — | — | — | How much ___ the scooter? ↔ is ; How much ___ the jeans? ↔ are ; How much ___ this computer game? ↔ is, please ; How much ___ these headphones? ↔ are, please | — | false |
| g1u10.gi.how-much.mt.001 | matching | Welche Frage passt zu welcher Antwort? [de] | — | — | — | How much is the scooter? ↔ It's €80. ; How much are the headphones? ↔ They're €30. ; How much is the magazine? ↔ It's €3. ; How much are these sweets? ↔ They're €2. | — | false |
| g1u10.gi.how-much.qf.001 | question-formation | Du möchtest wissen, was der Roller kostet. Stell die Frage. [de] | How much is the scooter? (full) ; How much is this scooter? (full) ; How much is that scooter? (full) ; How much is it? (partial) | — | — | — | — | false |
| g1u10.gi.how-much.qf.002 | question-formation | Du möchtest wissen, was die Kopfhörer kosten. Stell die Frage. [de] | How much are the headphones? (full) ; How much are these headphones? (full) ; How much are those headphones? (full) ; How much are they? (partial) | — | — | — | — | false |
| g1u10.gi.how-much.sb.001 | sentence-building | How / much / is / the / scooter [en] | How much is the scooter? (full) | — | are | — | — | false |
| g1u10.gi.how-much.sb.002 | sentence-building | How / much / are / these / sweets [en] | How much are these sweets? (full) | — | is | — | — | false |
| g1u10.gi.how-much.tf.001 | transformation | How much is the key ring? (→ key rings) [en] | How much are the key rings? (full) ; are (partial) | — | — | — | — | false |
| g1u10.gi.how-much.tf.002 | transformation | How much are the magazines? (→ magazine) [en] | How much is the magazine? (full) ; is (partial) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.ag.001 | anagram | Viele Dinge, ganz nah bei dir (hier). Wie heißt das Wort? (Buchstaben: e h e s t) [de] | these (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.ag.002 | anagram | Viele Dinge, weiter weg (over there). Wie heißt das Wort? (Buchstaben: o h e s t) [de] | those (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.cp.001 | context-picker | Du hältst einen Schlüsselanhänger in der Hand. Was sagst du? [de] | This key ring is nice. (full) | — | These key ring is nice. ; Those key ring is nice. ; These key rings is nice. | — | — | false |
| g1u10.gi.this-that-these-those.cp.002 | context-picker | Du zeigst auf Schuhe weit weg im Schaufenster (over there). Was sagst du? [de] | Those shoes over there are big. (full) | — | That shoes over there are big. ; This shoes over there are big. ; These shoes over there are big. | — | — | false |
| g1u10.gi.this-that-these-those.ec.001 | error-correction | This shoes here are nice. [en] | These shoes here are nice. (full) ; These (partial) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.ec.002 | error-correction | That headphones over there are expensive. [en] | Those headphones over there are expensive. (full) ; Those (partial) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.ec.003 | error-correction | These computer game here is nice. [en] | This computer game here is nice. (full) ; This (partial) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.ec.004 | error-correction | Those magazine over there is nice. [en] | That magazine over there is nice. (full) ; That (partial) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.001 | gap-fill | ___ magazine here is nice. [en, 1 blank(s)] | This (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.002 | gap-fill | ___ sweets here are nice. [en, 1 blank(s)] | These (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.003 | gap-fill | Look at ___ scooter over there! [en, 1 blank(s)] | that (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.004 | gap-fill | ___ headphones over there are expensive. [en, 1 blank(s)] | Those (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.005 | gap-fill | Can I have ___ key ring here, please? [en, 1 blank(s)] | this (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.006 | gap-fill | ___ trainers over there are big. [en, 1 blank(s)] | Those (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.008 | gap-fill | I'd like ___ sweets here and ___ headphones over there. [en, 2 blank(s)] | these \| those (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gf.009 | gap-fill | ___ magazine here is nice. ___ scooter over there is expensive. [en, 2 blank(s)] | This \| That (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.gs.002 | group-sort | Near you (here), or far away (over there)? [en] | — | — | — | — | near you (here): this magazine, these sweets, this key ring, these shoes \| far away (over there): that scooter, those headphones, that mobile phone, those trainers | false |
| g1u10.gi.this-that-these-those.gs.003 | group-sort | Eins oder viele? [de] | — | — | — | — | one: this magazine, that scooter, this key ring, that mobile phone \| many: these sweets, those headphones, these shoes, those trainers | false |
| g1u10.gi.this-that-these-those.mc.001 | multiple-choice | ___ shoes here are nice. [en, 1 blank(s)] | These (full) | — | This ; That ; Those | — | — | false |
| g1u10.gi.this-that-these-those.mc.002 | multiple-choice | How much is ___ mobile phone over there? [en, 1 blank(s)] | that (full) | — | this ; these ; those | — | — | false |
| g1u10.gi.this-that-these-those.mc.005 | multiple-choice | Welcher Satz ist richtig? [de] | These sweets here are nice. (full) | — | This sweets here are nice. ; That sweets here are nice. ; Those sweets here are nice. | — | — | false |
| g1u10.gi.this-that-these-those.mc.006 | multiple-choice | Welcher Satz ist richtig? [de] | Those headphones over there are expensive. (full) | — | That headphones over there are expensive. ; This headphones over there are expensive. ; These headphones over there are expensive. | — | — | false |
| g1u10.gi.this-that-these-those.mt.003 | matching | Verbinde jedes Ding mit dem passenden Wort. [de] | — | — | — | one magazine, here ↔ this magazine ; many sweets, here ↔ these sweets ; one scooter, over there ↔ that scooter ; many headphones, over there ↔ those headphones | — | false |
| g1u10.gi.this-that-these-those.mt.004 | matching | Verbinde jeden „here“-Satz mit dem gleichen Satz mit „over there“. [de] | — | — | — | This scooter is nice. ↔ That scooter over there is nice. ; These shoes are big. ↔ Those shoes over there are big. ; This magazine is nice. ↔ That magazine over there is nice. ; These sweets are nice. ↔ Those sweets over there are nice. | — | false |
| g1u10.gi.this-that-these-those.sb.001 | sentence-building | these / shoes / nice / are [en] | These shoes are nice. (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.sb.002 | sentence-building | those / over there / are / headphones / expensive [en] | Those headphones over there are expensive. (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.tf.001 | transformation | This scooter is nice. (over there) → ___ scooter over there is nice. [en, 1 blank(s)] | That (full) ; That scooter over there is nice. (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.tf.002 | transformation | This book is nice. (many) → ___ books are nice. [en, 1 blank(s)] | These (full) ; These books are nice. (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.tf.003 | transformation | That dog over there is big. (many) → ___ dogs over there are big. [en, 1 blank(s)] | Those (full) ; Those dogs over there are big. (full) | — | — | — | — | false |
| g1u10.gi.this-that-these-those.tr.001 | translation | Sag auf Englisch: Diese Süßigkeiten hier sind toll. (toll = nice) [de] | These sweets here are nice. (full) ; These sweets are nice. (full) | deToEn | — | — | — | false |
| g1u10.gi.this-that-these-those.tr.002 | translation | Sag auf Englisch: Jene Kopfhörer dort drüben sind teuer. [de] | Those headphones over there are expensive. (full) ; Those headphones are expensive. (full) | deToEn | — | — | — | false |

## Output contract

Write `content/corpus/units/g1-u10/verify/answers.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u10",
  "lens": "answers",
  "itemsHash": "5c0bbc31ed04",
  "promptHash": "70fa2d8cdf22",
  "round": 1,
  "by": "fable-lens-answers",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 107, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
