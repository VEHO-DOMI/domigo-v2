# Verify lens — level-gloss — g1-u04 (round 1)

<!-- domigo:verify level-gloss g1-u04 items=22d315a2d185 prompt=aefb997bf664 round=1 -->

<!-- domigo:prompt verify-level-gloss v=1 -->
# Lens 1 — level + gloss (adversarial)

You are an independent, adversarial verifier. You did NOT write these items; assume
they are wrong until the text proves otherwise. Your single question, for every
student-facing English string of every item (carriers, definitions, options,
distractors, pair sides, group members, answers):

**Could a student at exactly this point in the book read this?**

- The brief lists the allowed vocabulary (cumulative bank + closed-class allowlist +
  harvested proper nouns + numbers). A deterministic gate already checks token
  membership — your job is what the machine cannot see:
  - words that are technically in the bank but used in an UNTAUGHT meaning or idiom
    ("treat" taught only inside "trick or treat" but used as "a special treat");
  - phrases whose individual words are taught but whose combination is opaque;
  - glosses that are present but WRONG (German doesn't match the meaning in context),
    unidiomatic, or attached to the wrong word;
  - glosses for words that are actually taught (gloss-unneeded — it teaches students
    to distrust glosses);
  - definitions (`d`) above the reading level even when every token is technically
    taught (syntax too complex, relative clauses stacked, …).
- Flag kind menu: `above-level`, `gloss-missing`, `gloss-wrong`, `gloss-unneeded`.
- Severity: `fix` = a student would be blocked or mistaught; `warn` = defensible but
  worth a human look.

Be precise: every flag names the exact token/phrase and where it occurs. Do not flag
style preferences. Do not re-litigate the deterministic gate's allowlist decisions.

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, David, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jenny, Jill, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Peter, Pirates, Plural, Polly, Prepositions, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Vocab items (61)

| id | d | s | mc | pool | gloss |
|---|---|---|---|---|---|
| g1u04.w.a-day-in-the-life-of | from morning to night for one boy or girl | The story is about ___ Richard. | no one else ; Are you OK? ; Oh dear! | no one else ; Are you OK? ; Oh dear! ; It's me. | — |
| g1u04.w.after | it is later in time, not before | ___ school I meet my friends. | into ; still ; early | into ; still ; early ; today | later (= später) |
| g1u04.w.afternoon | it is the time after lunchtime, before the evening | It's ___. It is not cold now. Richard is hot. | morning ; evening ; night | morning ; evening ; night ; lunchtime | — |
| g1u04.w.angry | you are very mad, not happy | No, no, no, Mike. Now Harry is ___. He isn't happy! | happy ; proud ; excited | happy ; proud ; excited ; bored | — |
| g1u04.w.are-you-ok | ask a friend this when they look sad, is everything fine | You look sad. ___ Why? | What's happening? ; Try it! ; Let go! | What's happening? ; Try it! ; Let go! ; Go away! | fine (= in Ordnung, gut) ; everything (= alles) |
| g1u04.w.bad | it is not good | Thursday and Friday aren't ___. | happy ; proud ; excited | happy ; proud ; excited ; tired | — |
| g1u04.w.be-yourself | you want a friend to be who they are, not a new boy or girl | ___ and no one else. | Let go! ; Try it! ; Go away! | Let go! ; Try it! ; Go away! ; Don't be late. | new (= neu, anders) |
| g1u04.w.because | you give the why for it with this | I'm happy ___ it's the weekend. | after ; still ; today | after ; still ; today ; into | weekend (= Wochenende) |
| g1u04.w.birthday | it is your big day in the year, with a cake | Happy ___, David! | day ; end ; show | day ; end ; show ; story | cake (= Kuchen, Torte) |
| g1u04.w.bored | you have no work and no fun to do, so the time is long | It's evening. Is Richard tired? No, he's ___. | excited ; happy ; hungry | excited ; happy ; hungry ; proud | — |
| g1u04.w.bottle | you can put water in it and drink from it | The feelings are in the magic ___. | room ; story ; show | room ; story ; show ; day | water (= Wasser) ; drink (= trinken) ; feelings (= Gefühle) |
| g1u04.w.cold | it is not hot | It is early morning. Richard is ___. | hot ; happy ; tired | hot ; happy ; tired ; sad | — |
| g1u04.w.day | it has morning, afternoon and night in it; Monday is one | On the big ___, Mike is nervous. | night ; end ; story | night ; end ; story ; life | — |
| g1u04.w.don-t-be-late | you want a friend here on time, not after the time | Tomorrow's Monday – ___ | Be yourself. ; Let go! ; Try it! | Be yourself. ; Let go! ; Try it! ; Go away! | — |
| g1u04.w.early | it is at the start of the day, when it is still morning | It's ___. He's still in bed. | today ; still ; after | today ; still ; after ; tomorrow | start (= Anfang) |
| g1u04.w.end | it is at the back of a story or a show, not at the start | At the ___ of the play, Mike is very happy. | day ; room ; story | day ; room ; story ; morning | start (= Anfang) ; play (= Theaterstück) |
| g1u04.w.evening | it is the time after the afternoon, before night | It's ___. Is Richard tired? No, he's bored. | morning ; afternoon ; night | morning ; afternoon ; night ; lunchtime | — |
| g1u04.w.excited | a good thing is here now and you want it now | Tomorrow is the school show. I'm in it! Mike is ___. | bored ; tired ; sad | bored ; tired ; sad ; cold | — |
| g1u04.w.friday | it is the day before Saturday | Thursday, ___ – no more school! | Thursday ; Saturday ; Wednesday | Thursday ; Saturday ; Wednesday ; Monday | — |
| g1u04.w.friend | a boy or girl you like and play with | Tom is his ___. | story ; room ; day | story ; room ; day ; show | like (= mögen) ; play (= spielen) |
| g1u04.w.fun | it is a thing you enjoy, not work | It's a lot of work, but it's ___. | story ; room ; show | story ; room ; show ; bottle | lot (= viel, eine Menge) |
| g1u04.w.go-away | you want a friend to go from here, not to be next to you | Please, ___! I don't want you here. | Try it! ; Let go! ; Be yourself. | Try it! ; Let go! ; Be yourself. ; Don't be late. | — |
| g1u04.w.happy | you are glad and not sad. | Mike is ___. He is not sad. | sad ; angry ; bored | sad ; angry ; bored ; tired | glad (= froh) |
| g1u04.w.homework | it is school work you do for class, but not in class | We have got a big ___ for school today. | fun ; story ; room | fun ; story ; room ; show | — |
| g1u04.w.hot | it is not cold | It's afternoon. Richard isn't cold now. He's ___! | cold ; bored ; sad | cold ; bored ; sad ; nervous | — |
| g1u04.w.hungry | you want to eat now | It's lunchtime. Richard isn't happy. He wants to eat. He's ___. | tired ; cold ; proud | tired ; cold ; proud ; bored | — |
| g1u04.w.into | you go in, you do not go out | Go ___ the classroom! | after ; still ; early | after ; still ; early ; today | — |
| g1u04.w.it-s-me | a friend is at the door, and the one there is you. | Who is at the door? — ___ Open the door! | Try it! ; Let go! ; Go away! | Try it! ; Let go! ; Go away! ; Be yourself. | — |
| g1u04.w.let-go | you want a friend to open the hand and not hold your arm. | You are holding my arm too tight! ___ | Try it! ; Go away! ; Be yourself. | Try it! ; Go away! ; Be yourself. ; Don't be late. | arm (= Arm) ; holding (= halten, festhalten) ; tight (= fest) ; hold (= halten) ; hand (= Hand) |
| g1u04.w.life | all your time, from when you are small to when you are big | The story is about a day in the ___ of Richard. | day ; story ; end | day ; story ; end ; night | — |
| g1u04.w.lunchtime | it is the time in the day when you eat | It's ___ and the children eat at school. | morning ; evening ; night | morning ; evening ; night ; afternoon | — |
| g1u04.w.mad | you are very, very angry. | I am good, Bob is bad. I am nice, Bob is ___. | happy ; proud ; excited | happy ; proud ; excited ; bored | — |
| g1u04.w.magic | you find it in stories; it can do what is not for real | This is a ___ bottle. | bad ; cold ; hot | bad ; cold ; hot ; mad | real (= echt, wirklich) |
| g1u04.w.monday | it is the day after the weekend, before Tuesday | The day after Sunday is ___. | Tuesday ; Sunday ; Wednesday | Tuesday ; Sunday ; Wednesday ; Friday | weekend (= Wochenende) |
| g1u04.w.morning | it is the time of the day when you open your eyes in bed | It's early ___. Richard's cold. | evening ; night ; afternoon | evening ; night ; afternoon ; lunchtime | — |
| g1u04.w.nervous | a big day is here and you can't be still | There are a lot of girls and boys here! Mike is ___. | proud ; happy ; cold | proud ; happy ; cold ; bored | lot (= viele, eine Menge) |
| g1u04.w.night | it is the dark time when you go to bed | It's late at ___ and we are in bed. | morning ; afternoon ; lunchtime | morning ; afternoon ; lunchtime ; evening | dark (= dunkel) ; late (= spät) |
| g1u04.w.no-one-else | you, and not a boy or a girl is with you. | Be yourself and ___. | Go away! ; Try it! ; Let go! | Go away! ; Try it! ; Let go! ; Be yourself. | — |
| g1u04.w.oh-dear | a thing is bad, not good, and you are not happy | ___ Why? I'm not very happy. | Try it! ; Let go! ; Go away! | Try it! ; Let go! ; Go away! ; Be yourself. | — |
| g1u04.w.proud | you do good work and it is very good for you | Mum is very ___ of me today. | sad ; scared ; bored | sad ; scared ; bored ; angry | — |
| g1u04.w.room | it has a door and a window; you go to bed in it | There's a dog in our ___. | story ; show ; day | story ; show ; day ; bottle | — |
| g1u04.w.sad | you are not happy; you want to cry. | No, no, no, Mike. Harry isn't happy now. He's ___! | happy ; excited ; proud | happy ; excited ; proud ; hot | cry (= weinen) |
| g1u04.w.saturday | it is the day after Friday, with no school | ___ and Sunday – great! | Sunday ; Friday ; Monday | Sunday ; Friday ; Monday ; Tuesday | — |
| g1u04.w.scared | a big dog can do this to you, so you don't want it here | We're very ___. There's a dog in our room. | happy ; proud ; hot | happy ; proud ; hot ; excited | — |
| g1u04.w.show | you go and look at it, with boys and girls in it at school | At the end of the ___, she's proud. | story ; room ; bottle | story ; room ; bottle ; end | — |
| g1u04.w.still | it is now and it is not over, it goes on | It's early. He's ___ in bed. | today ; early ; after | today ; early ; after ; tomorrow | goes (= geht (weiter)) |
| g1u04.w.story | you read it or Mum tells it to you in bed | It's a ___ about a boy in a school play. | show ; room ; day | show ; room ; day ; bottle | tells (= erzählt) ; play (= Theaterstück) |
| g1u04.w.sunday | it is the day after Saturday, before Monday | Saturday and ___ – great! | Saturday ; Monday ; Friday | Saturday ; Monday ; Friday ; Wednesday | — |
| g1u04.w.thursday | it is the day after Wednesday | ___, Friday – no more school! | Wednesday ; Friday ; Tuesday | Wednesday ; Friday ; Tuesday ; Sunday | — |
| g1u04.w.tired | you want to go to bed and close your eyes | It's Monday. Gina is ___. | excited ; happy ; hot | excited ; happy ; hot ; angry | — |
| g1u04.w.to-be-asleep | you are in bed and your eyes are not open | Richard is in bed. He's ___. | to break ; to get back ; to happen | to break ; to get back ; to happen ; to go to sleep | — |
| g1u04.w.to-break | to put it into two or more, so it is not one | I must ___ the bottle. | to happen ; to get back ; to go to sleep | to happen ; to get back ; to go to sleep ; to be asleep | — |
| g1u04.w.to-get-back | to have it with you one more time | I am Jill and I will ___ the feelings. | to break ; to happen ; to go to sleep | to break ; to happen ; to go to sleep ; to be asleep | will (= werde(n)) ; feelings (= Gefühle) |
| g1u04.w.to-go-to-sleep | to close your eyes in bed at night | It's late. Go back to ___. | to break ; to happen ; to get back | to break ; to happen ; to get back ; to be asleep | late (= spät) |
| g1u04.w.to-happen | to go on, when you ask what is here now | What's ___? Is it OK? | to break ; to get back ; to go to sleep | to break ; to get back ; to go to sleep ; to be asleep | — |
| g1u04.w.today | it is this day, now, not tomorrow | It is not tomorrow; it is ___. | tomorrow ; morning ; evening | tomorrow ; morning ; evening ; night | — |
| g1u04.w.tomorrow | it is the day after today | It is not today. The day after today is ___. | today ; morning ; night | today ; morning ; night ; evening | — |
| g1u04.w.try-it | you want a friend to do a new thing one time | This birthday cake is very good. ___ You will love it! | Let go! ; Go away! ; Be yourself. | Let go! ; Go away! ; Be yourself. ; Don't be late. | new (= neu) ; cake (= Kuchen, Torte) ; will (= wirst) |
| g1u04.w.tuesday | it is the day after Monday | The day after Monday is ___. | Monday ; Wednesday ; Thursday | Monday ; Wednesday ; Thursday ; Sunday | — |
| g1u04.w.wednesday | it is the day after Tuesday | Monday, Tuesday, ___ – no more school! | Tuesday ; Thursday ; Friday | Tuesday ; Thursday ; Friday ; Monday | — |
| g1u04.w.what-s-happening | you ask about a thing that is here now; you cannot look at it. | I can hear it. ___ Is it OK? | Try it! ; Let go! ; Go away! | Try it! ; Let go! ; Go away! ; Are you OK? | hear (= hören) |

## Grammar items (44)

| id | fmt | prompt | answers | distractors | pairs | groups | gloss |
|---|---|---|---|---|---|---|---|
| g1u04.gi.to-be-negative.ag.001 | anagram | Richard ist nicht glücklich, er ist … (das Gegenteil von happy) [de] | sad (full) | — | — | — | — |
| g1u04.gi.to-be-negative.cp.001 | context-picker | Du sprichst über Mike. Er ist nicht glücklich. Welcher Satz ist richtig? [de] | He isn't happy. (full) | He aren't happy. ; He not is happy. ; He doesn't happy. | — | — | — |
| g1u04.gi.to-be-negative.cp.002 | context-picker | Du sprichst über dich und deinen Freund. Ihr seid nicht müde. Welcher Satz ist richtig? [de] | We aren't tired. (full) | We isn't tired. ; We aren't tired not. ; We don't tired. | — | — | — |
| g1u04.gi.to-be-negative.ec.001 | error-correction | Finde und verbessere den Fehler: She aren't sad. [de] | She isn't sad. (full) ; isn't (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.ec.002 | error-correction | Finde und verbessere den Fehler: They isn't hungry. [de] | They aren't hungry. (full) ; aren't (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.ec.003 | error-correction | Finde und verbessere den Fehler: I amn't cold. [de] | I'm not cold. (full) ; I am not cold. (full) ; I'm not (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.007 | gap-fill | I ___ happy. I'm sad. (–) [de, 1 blank(s)] | am not (full) ; I'm not happy. (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.008 | gap-fill | He ___ cold. He's hot. (–) [de, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.009 | gap-fill | They ___ angry. They're happy. (–) [de, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.010 | gap-fill | Richard ___ happy. He's hungry. (–) [de, 1 blank(s)] | isn't (full) ; is not (full) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.011 | gap-fill | We ___ hungry. We're hot. (–) [de, 1 blank(s)] | aren't (full) ; are not (full) | — | — | — | — |
| g1u04.gi.to-be-negative.gf.012 | gap-fill | Mike ___ happy. He's scared. The girls ___ scared. They're excited. (–) [de, 2 blank(s)] | isn't \| aren't (full) ; is not \| are not (full) | — | — | — | — |
| g1u04.gi.to-be-negative.gs.002 | group-sort | isn't oder aren't? Sortiere die Wörter. [de] | — | — | — | isn't: he, she, it \| aren't: you, we, they | — |
| g1u04.gi.to-be-negative.mc.001 | multiple-choice | She ___ sad. She's happy. [en, 1 blank(s)] | isn't (full) | aren't ; am not ; don't | — | — | — |
| g1u04.gi.to-be-negative.mc.002 | multiple-choice | The dogs ___ hungry. They're bored. [en, 1 blank(s)] | aren't (full) | isn't ; am not ; doesn't | — | — | — |
| g1u04.gi.to-be-negative.mc.003 | multiple-choice | I ___ nervous. I'm excited. [en, 1 blank(s)] | am not (full) | isn't ; aren't ; doesn't | — | — | — |
| g1u04.gi.to-be-negative.mc.004 | multiple-choice | Welcher Satz ist richtig? [de] | We aren't hungry. (full) | We isn't hungry. ; We not are hungry. ; We don't hungry. | — | — | — |
| g1u04.gi.to-be-negative.mp.001 | matching-pairs | Welche Sätze passen zusammen? [de] | — | — | I am happy. ↔ I'm not happy. ; He is cold. ↔ He isn't cold. ; We are hungry. ↔ We aren't hungry. ; They are angry. ↔ They aren't angry. | — | — |
| g1u04.gi.to-be-negative.mt.001 | matching | Was passt zusammen? [de] | — | — | Is he cold? ↔ No, he isn't. ; Are you hungry? ↔ No, I'm not. ; Are they happy? ↔ No, they aren't. ; Is she sad? ↔ No, she isn't sad. She's happy. | — | — |
| g1u04.gi.to-be-negative.sb.001 | sentence-building | isn't / He / cold / . [en] | He isn't cold. (full) | — | — | — | — |
| g1u04.gi.to-be-negative.sb.002 | sentence-building | aren't / We / hungry / . [en] | We aren't hungry. (full) | — | — | — | — |
| g1u04.gi.to-be-negative.tf.001 | transformation | He is cold. → He ___ cold. (–) [en, 1 blank(s)] | isn't (full) ; is not (full) ; He isn't cold. (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.tf.002 | transformation | They are bored. → They ___ bored. (–) [en, 1 blank(s)] | aren't (full) ; are not (full) ; They aren't bored. (partial) | — | — | — | — |
| g1u04.gi.to-be-negative.tf.003 | transformation | I am hungry. → I ___ hungry. (–) [en, 1 blank(s)] | am not (full) ; I'm not hungry. (full) ; I am not hungry. (full) | — | — | — | — |
| g1u04.gi.to-be-negative.tr.001 | translation | Ich bin nicht müde. [de] | I'm not tired. (full) ; I am not tired. (full) | — | — | — | — |
| g1u04.gi.to-be-negative.tr.002 | translation | Sie sind nicht wütend. Sie sind glücklich. [de] | They aren't angry. They're happy. (full) ; They are not angry. They are happy. (full) | — | — | — | — |
| g1u04.gi.to-be-questions.ag.001 | anagram | Is she …? Wie geht es ihr, wenn sie lacht? (Gefühl) [de] | happy (full) | — | — | — | — |
| g1u04.gi.to-be-questions.cp.001 | context-picker | Du willst deine Freundin fragen, ob sie glücklich ist. Welcher Satz ist richtig? [de] | Are you happy? (full) | Do you happy? ; You are happy? ; Are happy you? | — | — | — |
| g1u04.gi.to-be-questions.cp.003 | context-picker | Tom ist nicht glücklich, er ist traurig. Du fragst und gibst die richtige Antwort. Welche Zeile ist richtig? [de] | Is he happy? — No, he isn't. (full) | Is he happy? — No, he aren't. ; Is he happy? — No, he not. ; Are he happy? — No, he isn't. | — | — | — |
| g1u04.gi.to-be-questions.ec.001 | error-correction | Do you are happy? [en] | Are you happy? (full) ; Are you happy (partial) | — | — | — | — |
| g1u04.gi.to-be-questions.ec.002 | error-correction | Are you hungry? — Yes, I'm. [en] | Are you hungry? — Yes, I am. (full) ; Yes, I am. (partial) ; Yes, I am (partial) | — | — | — | — |
| g1u04.gi.to-be-questions.gf.001 | gap-fill | ___ you happy? [en, 1 blank(s)] | Are (full) | — | — | — | — |
| g1u04.gi.to-be-questions.gf.002 | gap-fill | ___ he cold? [en, 1 blank(s)] | Is (full) | — | — | — | — |
| g1u04.gi.to-be-questions.gf.003 | gap-fill | ___ she sad? — Yes, she ___. [en, 2 blank(s)] | Is \| is (full) | — | — | — | — |
| g1u04.gi.to-be-questions.gs.001 | group-sort | Sortiere die Fragen nach ihrem ersten Wort. [de] | — | — | — | Is …?: Is he cold?, Is she happy?, Is it hot? \| Are …?: Are you sad?, Are they tired?, Are we hungry? | — |
| g1u04.gi.to-be-questions.mc.001 | multiple-choice | ___ they hungry? [en, 1 blank(s)] | Are (full) | Is ; Am ; Do | — | — | — |
| g1u04.gi.to-be-questions.mc.002 | multiple-choice | Are you cold? — ___ [en, 1 blank(s)] | Yes, I am. (full) | Yes, I'm. ; Yes, you are. ; Yes, he is. | — | — | — |
| g1u04.gi.to-be-questions.mt.002 | matching | Frage und passende Antwort verbinden. [de] | — | — | Are you happy? ↔ Yes, I am. ; Is he sad? ↔ No, he isn't. ; Are they cold? ↔ Yes, they are. ; Is she tired? ↔ No, she isn't. | — | — |
| g1u04.gi.to-be-questions.qf.001 | question-formation | she / is / nervous [en] | Is she nervous? (full) | — | — | — | — |
| g1u04.gi.to-be-questions.qf.002 | question-formation | the dog / hungry / is [en] | Is the dog hungry? (full) | — | — | — | — |
| g1u04.gi.to-be-questions.sb.001 | sentence-building | are / they / excited / ? [en] | Are they excited? (full) | — | — | — | — |
| g1u04.gi.to-be-questions.tf.001 | transformation | He is sad. → ? [en] | Is he sad? (full) | — | — | — | — |
| g1u04.gi.to-be-questions.tf.002 | transformation | They are scared. → ? [en] | Are they scared? (full) | — | — | — | — |
| g1u04.gi.to-be-questions.tr.001 | translation | Bist du müde? [de] | Are you tired? (full) | — | — | — | — |

## Output contract

Write `content/corpus/units/g1-u04/verify/level-gloss.flags.json`:

```jsonc
{
  "schema": "verify-flags@1",
  "slug": "g1-u04",
  "lens": "level-gloss",
  "itemsHash": "22d315a2d185",
  "promptHash": "aefb997bf664",
  "round": 1,
  "by": "fable-lens-level-gloss",
  "flags": [
    { "key": "<kind>:<itemId>", "kind": "…", "itemId": "…",
      "severity": "fix" | "warn", "note": "exact, cites the text", "suggestion": null }
  ],
  "summary": { "itemsSeen": 105, "flagged": 0 }
}
```

A clean lens returns an empty flags array — do NOT invent findings to look busy. One flag per (kind, item).
