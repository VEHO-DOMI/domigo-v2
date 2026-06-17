# Vocab generation brief — g1-u04 (MORE! 1, Unit 4)

<!-- domigo:gen vocab g1-u04 bank=07ed93df8cb9 prompt=346902f9f0f1 -->

<!-- domigo:prompt shared-rules v=1 -->
# Shared content rules (every generator and fixer reads these)

You are authoring practice items for Austrian AHS students (10–14, EFL, MORE! textbooks,
A1→A2). A broken item in front of a child is the failure that matters most. The v1 app
died on content quality — these rules are the law:

1. **The textbook is the source of truth.** Carrier sentences come from the textbook
   FIRST: the master list's example sentence (`exampleSb`), then a sentence from the
   SB/WB transcript (verbatim or minimally adapted), invention is the LAST resort.
   Record honestly in `sSource`/`sbRef`: `masterlist` | `sb` | `wb` | `invented`.
2. **The cumulative word bank is the level gate.** Every English word a student sees
   (carriers, definitions, distractors, options, pair sides, group members) must be
   taught at or below this unit — the brief lists the allowed vocabulary. Anything
   above level MUST carry an inline gloss recorded in the item's `gloss[]` array and
   appear in the text exactly as written. Glossing is the exception, not the routine:
   prefer rephrasing with taught words. A deterministic validator REJECTS any unglossed
   unknown token — do not gamble.
3. **Answer sets are forgiving and correct.** Accept EVERY variant that is correct in
   the sentence (tier `full`); near-synonyms / reasonable-but-imperfect alternatives go
   in as tier `partial`. Never demand a citation form that makes the sentence
   ungrammatical. Spelling tolerance (`close`) is computed by the grader — never author
   misspellings.
4. **German is informal du-form, always.** Never "Sie/Ihnen/Ihr" as address. Natural,
   age-appropriate German (Austrian standard; ß/ä/ö/ü correct — never ASCII "ue").
5. **Zero meta-talk in student-facing carriers.** No grammar terminology in prompts,
   carriers, answers, distractors, options ("past simple", "modal verb", …) — the task
   shows, it never lectures. Instruction text lives in the renderer, NOT in your prompt
   text. EXCEPTION: `hintDe`/`explainDe` MAY use the light German grammar vocabulary the
   textbook itself uses (Grundform, Vergangenheit, Verneinung …) — English grammar
   jargon is banned even there.
6. **v1 seeds are UNTRUSTED.** The brief includes v1 items as idea material. Known v1
   defect classes: invented above-level carrier words, out-of-bank MC distractors,
   over-strict answer sets, meta-talk. Mine them; never copy unverified.
7. **Distractors are real words from the bank**, plausible but unambiguously wrong in
   context, never lemma-variants of an accepted answer.
8. **Pairs and groups are English↔English** (sentence halves, question↔answer,
   category sorting). German belongs in translation surfaces only.
9. **Difficulty is honest:** 1 = recognition/single-token, 2 = guided production,
   3 = free production / multi-step. Spread items across difficulties.
10. **Blanks** are `___` (3+ underscores). Multi-blank answers join per-blank fills
    with ` | ` in blank order.

<!-- domigo:prompt gen-vocab v=1 -->
# Vocab item generation

Produce EXACTLY ONE vocab item per word-bank entry listed in the brief (no more, no
fewer). Each item exercises one word across all its surfaces:

- `d` — an English definition in taught-only words that does NOT contain the headword
  or any inflection of it. Simple, concrete, age-appropriate.
- `s` — the carrier sentence with exactly one `___` blank where the headword (or one of
  its forms) fits. Textbook sentences first (rule 1). The sentence must make the word
  unambiguous (a sentence where five other bank words also fit is a bad carrier).
- `sAnswers` — every form of the headword that is correct in the blank (tier full);
  defensible alternatives as partial. The blank-substituted sentence must be
  grammatical for every full answer (watch a/an, singular/plural, capitalization).
- `dAnswers` — accepted answers when the student produces the word from the definition
  (headword + natural variants).
- `translation.deToEn` — the German prompt is the bank's German; answers = every correct
  English rendering (full) + near-misses (partial).
- `translation.enToDe` — answers = every natural German rendering (full) + acceptable
  variants (partial). Both directions must be INDEPENDENTLY correct.
- `mc` — exactly 3 distractors, in-bank, same word class where possible, plausible but
  clearly wrong for the definition/sentence.
- `gameMeta.distractorPool` — ≥4 in-bank wrong options for game encounters (may extend
  `mc`); `chipBudget` null unless chip-input makes sense; `minOptions` 4.
- `hintDe` — one short du-form German nudge (meaning hint, not the answer).
- `gloss` — ONLY if the carrier/definition truly needs an above-level word (rule 2).
- `difficulty` — 1–3 honestly (frequency + abstractness + production load).

Quality bar: a teacher reading any single item should find nothing to fix.

## Word bank (one item per row — this is your work list)

| id | en | de | kind | theme | exampleSb | cf | forms |
|---|---|---|---|---|---|---|---|
| g1u04.w.cold | cold | kalt | wordfile | — | — | — | cold |
| g1u04.w.angry | angry | wütend ; böse | wordfile | — | — | — | angry |
| g1u04.w.happy | happy | glücklich ; fröhlich | wordfile | — | — | — | happy |
| g1u04.w.scared | scared | ängstlich ; verängstigt | wordfile | — | — | — | scared |
| g1u04.w.excited | excited | aufgeregt | wordfile | — | — | — | excited |
| g1u04.w.hot | hot | heiß | wordfile | — | — | — | hot |
| g1u04.w.bored | bored | gelangweilt | wordfile | — | — | — | bored |
| g1u04.w.sad | sad | traurig | wordfile | — | — | — | sad |
| g1u04.w.hungry | hungry | hungrig | wordfile | — | — | — | hungry |
| g1u04.w.nervous | nervous | nervös | wordfile | — | — | — | nervous |
| g1u04.w.tired | tired | müde | wordfile | — | — | — | tired |
| g1u04.w.proud | proud | stolz | wordfile | — | — | — | proud |
| g1u04.w.morning | morning | Morgen | wordfile | — | — | — | morning |
| g1u04.w.lunchtime | lunchtime | Mittagszeit | wordfile | — | — | — | lunchtime |
| g1u04.w.afternoon | afternoon | Nachmittag | wordfile | — | — | — | afternoon |
| g1u04.w.evening | evening | Abend | wordfile | — | — | — | evening |
| g1u04.w.night | night | Nacht | wordfile | — | — | — | night |
| g1u04.w.monday | Monday | Montag | wordfile | — | — | — | Monday |
| g1u04.w.tuesday | Tuesday | Dienstag | wordfile | — | — | — | Tuesday |
| g1u04.w.wednesday | Wednesday | Mittwoch | wordfile | — | — | — | Wednesday |
| g1u04.w.thursday | Thursday | Donnerstag | wordfile | — | — | — | Thursday |
| g1u04.w.friday | Friday | Freitag | wordfile | — | — | — | Friday |
| g1u04.w.saturday | Saturday | Samstag | wordfile | — | — | — | Saturday |
| g1u04.w.sunday | Sunday | Sonntag | wordfile | — | — | — | Sunday |
| g1u04.w.after | after | nach | phrase | — | After school I meet my friends. | — | after |
| g1u04.w.day | day | Tag | phrase | — | On the big day, Mike is nervous. | — | day |
| g1u04.w.end | end | Ende | phrase | — | At the end of the play, Mike is very happy. | — | end |
| g1u04.w.fun | fun | Spaß | phrase | — | It's great fun. | — | fun |
| g1u04.w.go-away | Go away! | Geh weg! | phrase | — | — | — | Go away! |
| g1u04.w.to-happen | to happen | passieren ; geschehen | phrase | — | What's happening? | happen | to happen ; happen |
| g1u04.w.show | show | Show ; Vorführung | phrase | — | At the end of the show, she's proud. | — | show |
| g1u04.w.a-day-in-the-life-of | a day in the life of | ein Tag im Leben von | phrase | — | The story is about a day in the life of Richard. | — | a day in the life of |
| g1u04.w.to-be-asleep | to be asleep | schlafen | phrase | — | He's in bed and he's asleep. | be asleep | to be asleep ; be asleep |
| g1u04.w.early | early | früh | phrase | — | It's early. He's still in bed. | — | early |
| g1u04.w.life | life | Leben | phrase | — | A day in the life of … | — | life |
| g1u04.w.still | still | noch immer | phrase | — | Richard is still asleep. | — | still |
| g1u04.w.story | story | Geschichte | phrase | — | It's a story about a boy. | — | story |
| g1u04.w.today | today | heute | phrase | — | Today is Tuesday. | — | today |
| g1u04.w.are-you-ok | Are you OK? | Geht's dir/euch/Ihnen gut? | phrase | — | — | — | Are you OK? |
| g1u04.w.homework | homework (no pl) | Hausaufgaben | phrase | — | We have got a lot of homework today. | — | homework ; homework no pl |
| g1u04.w.into | into | in (… hinein) | phrase | — | Go into the classroom! | — | into |
| g1u04.w.oh-dear | Oh dear! | Du meine Güte! | phrase | — | — | — | Oh dear! |
| g1u04.w.room | room | Raum ; Zimmer | phrase | — | There's a bird in the room! | — | room |
| g1u04.w.bad | bad | schlecht ; böse | phrase | — | Thursday and Friday aren't bad. | — | bad |
| g1u04.w.don-t-be-late | Don't be late. | Komm(t) nicht zu spät. ; Sei(d) pünktlich. | phrase | — | — | — | Don't be late. |
| g1u04.w.tomorrow | tomorrow | morgen | phrase | — | Tomorrow is Monday. | — | tomorrow |
| g1u04.w.birthday | birthday | Geburtstag | phrase | — | Happy birthday, David! | — | birthday |
| g1u04.w.friend | friend | Freund/Freundin | phrase | — | Tom is his friend. | — | friend |
| g1u04.w.be-yourself | Be yourself. | Sei du selbst. | phrase | — | — | — | Be yourself. |
| g1u04.w.no-one-else | no one else | niemand anders | phrase | — | Be yourself and no one else. | — | no one else |
| g1u04.w.bottle | bottle | Flasche | phrase | — | The feelings are in the bottle. | — | bottle |
| g1u04.w.to-get-back | to get back | zurückholen ; zurückbekommen | phrase | — | I will get the feelings back. | get back | to get back ; get back |
| g1u04.w.mad | mad | wütend ; zornig | phrase | — | I am nice, Bob is mad. | — | mad |
| g1u04.w.magic | magic | magisch ; Zauber- | phrase | — | This is a magic bottle. | — | magic |
| g1u04.w.to-break | to break | (zer-)brechen | phrase | — | I must break the bottle. | break | to break ; break |
| g1u04.w.to-go-to-sleep | to go to sleep | schlafen gehen | phrase | — | Go back to sleep. | go to sleep | to go to sleep ; go to sleep |
| g1u04.w.because | because | weil | phrase | — | I'm happy because it's the weekend. | — | because |
| g1u04.w.it-s-me | It's me. | Ich bin's. | phrase | — | — | — | It's me. |
| g1u04.w.try-it | Try it! | Versuch es! | phrase | — | — | — | Try it! |
| g1u04.w.let-go | Let go! | Lass(t) los! | phrase | — | — | — | Let go! |
| g1u04.w.what-s-happening | What's happening? | Was ist (hier) los? | phrase | — | — | — | What's happening? |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, David, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jenny, Jill, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Peter, Pirates, Plural, Polly, Prepositions, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g1u04.w.cold` ← v1 `cold`: d="not warm, low temperature" · s="Please close the window — it is very _____ today. My fingers are turning blue!" · a=[] · mc=["hot","warm","dry"]
- `g1u04.w.angry` ← v1 `angry`: d="feeling mad about something" · s="Mum is _____ because I broke her favourite cup. She is shouting at me." · a=["mad"] · mc=["happy","glad","excited"]
- `g1u04.w.scared` ← v1 `scared`: d="feeling afraid of something" · s="The little boy is _____ of the big loud dog. He is crying and hiding behind his mother." · a=["afraid"] · mc=["brave","calm","angry"]
- `g1u04.w.excited` ← v1 `excited`: d="feeling very happy about something coming" · s="Tomorrow is Christmas morning! The children are so _____ they can't sleep." · a=[] · mc=["bored","tired","sad"]
- `g1u04.w.hot` ← v1 `hot`: d="very warm, high temperature" · s="In summer it is very _____ outside. The sun is burning and everyone is sweating." · a=[] · mc=["cold","freezing","snowy"]
- `g1u04.w.bored` ← v1 `bored`: d="not interested, nothing to do" · s="There is nothing fun to do here. I am so _____ that I am just staring at the wall." · a=[] · mc=["excited","busy","interested"]
- `g1u04.w.sad` ← v1 `sad`: d="feeling unhappy" · s="Her pet cat is lost and she feels very _____. Tears are running down her face." · a=["unhappy"] · mc=["happy","excited","proud"]
- `g1u04.w.hungry` ← v1 `hungry`: d="wanting to eat food" · s="I did not have any breakfast this morning, and now my stomach is making loud noises. I am _____." · a=[] · mc=["thirsty","full","sleepy"]
- `g1u04.w.nervous` ← v1 `nervous`: d="feeling worried before something happens" · s="He has a big maths test today and he is _____. His hands are shaking." · a=[] · mc=["calm","excited","confident"]
- `g1u04.w.tired` ← v1 `tired`: d="wanting to sleep or rest" · s="It is very late at night and the baby is so _____ that her eyes are closing." · a=[] · mc=["awake","hungry","bored"]
- `g1u04.w.proud` ← v1 `proud`: d="feeling good about something you did" · s="She won first place in the race and her dad is very _____. He is telling everyone about it." · a=[] · mc=["sad","ashamed","disappointed"]
- `g1u04.w.morning` ← v1 `morning`: d="the early part of the day" · s="I eat cereal and toast for breakfast every _____ before I go to school at 8 am." · a=[] · mc=["evening","night","midnight"]
- `g1u04.w.lunchtime` ← v1 `lunchtime`: d="the time when you eat lunch" · s="At _____, which is 12 o'clock, we go to the canteen and eat our sandwiches." · a=["lunch time"] · mc=["midnight","bedtime","breakfast time"]
- `g1u04.w.afternoon` ← v1 `afternoon`: d="the time between lunch and evening" · s="School finishes at three o'clock in the _____, after the lunch break." · a=[] · mc=["morning","evening","midnight"]
- `g1u04.w.evening` ← v1 `evening`: d="the time after afternoon and before night" · s="We eat dinner together as a family at 7 o'clock in the _____ after work." · a=[] · mc=["morning","noon","midnight"]
- `g1u04.w.night` ← v1 `night`: d="the dark time when you sleep" · s="The stars come out and the sky is dark at _____ when everyone is sleeping." · a=[] · mc=["morning","noon","afternoon"]
- `g1u04.w.monday` ← v1 `Monday`: d="the first day of the week" · s="The weekend is over. Today is _____." · a=[] · mc=["Tuesday","Sunday","Wednesday"]
- `g1u04.w.tuesday` ← v1 `Tuesday`: d="the second day of the week" · s="Yesterday was Monday, so today is _____." · a=[] · mc=["Monday","Wednesday","Thursday"]
- `g1u04.w.wednesday` ← v1 `Wednesday`: d="the third day of the week" · s="It is the middle of the week. Today is _____." · a=[] · mc=["Tuesday","Thursday","Friday"]
- `g1u04.w.thursday` ← v1 `Thursday`: d="the fourth day of the week" · s="Tomorrow is Friday, so today is _____." · a=[] · mc=["Wednesday","Friday","Tuesday"]
- `g1u04.w.friday` ← v1 `Friday`: d="the fifth day of the week" · s="Tomorrow is Saturday! Today is _____." · a=[] · mc=["Thursday","Saturday","Wednesday"]
- `g1u04.w.saturday` ← v1 `Saturday`: d="the sixth day, first weekend day" · s="There is no school today because it is _____." · a=[] · mc=["Sunday","Friday","Monday"]
- `g1u04.w.sunday` ← v1 `Sunday`: d="the seventh day of the week" · s="We always visit grandma on _____." · a=[] · mc=["Saturday","Monday","Friday"]
- `g1u04.w.after` ← v1 `after`: d="later than, next in time" · s="We always play football _____ school." · a=[] · mc=["before","during","until"]
- `g1u04.w.day` ← v1 `day`: d="a time of 24 hours" · s="What _____ is it today? It is Monday." · a=[] · mc=["night","week","hour"]
- `g1u04.w.end` ← v1 `end`: d="the last part of something" · s="At the _____ of the film, the credits start rolling and everyone claps." · a=[] · mc=["beginning","middle","opening"]
- `g1u04.w.fun` ← v1 `fun`: d="something you enjoy doing" · s="Playing board games with my friends on a rainy day is great _____ for all of us." · a=[] · mc=["work","trouble","homework"]
- `g1u04.w.go-away` ← v1 `Go away!`: d="telling someone to leave" · s="I don't want to talk to you right now. _____ and leave me alone!" · a=[] · mc=["Come here!","Come closer!","Stand up!"]
- `g1u04.w.to-happen` ← v1 `to happen`: d="to take place" · s="What is _____ over there in the corner? I can hear shouting and people running." · a=["happening"] · mc=["to rest","to sleep","to stop"]
- `g1u04.w.show` ← v1 `show`: d="a performance for people to watch" · s="We are going to watch a live _____ at the theatre with music, dancing, and actors." · a=[] · mc=["book","game","homework"]
- `g1u04.w.a-day-in-the-life-of` ← v1 `a day in the life of`: d="one typical day of a person" · s="This short story is about _____ a farmer who works from sunrise to sunset." · a=[] · mc=["a minute in the life of","a moment in the life of","a dream of"]
- `g1u04.w.to-be-asleep` ← v1 `to be asleep`: d="to be sleeping" · s="Be very quiet! The baby is _____ in her cot, with her eyes closed." · a=["sleeping"] · mc=["to be awake","to be running","to be eating"]
- `g1u04.w.early` ← v1 `early`: d="near the start of the day" · s="Dad gets up at 5am, very _____. It is still dark outside and everyone else is asleep." · a=[] · mc=["late","noon","afternoon"]
- `g1u04.w.life` ← v1 `life`: d="the time when you are alive" · s="My grandma tells long stories about her childhood and her whole _____ in the village 80 years ago." · a=[] · mc=["day","minute","second"]
- `g1u04.w.still` ← v1 `still`: d="even now, continuing" · s="It is ten o'clock in the morning and he is _____ in bed sleeping. He is so lazy!" · a=[] · mc=["already","never","sometimes"]
- `g1u04.w.story` ← v1 `story`: d="something you read or someone tells you" · s="Mum reads me a bedtime _____ with princes and dragons before I go to sleep." · a=[] · mc=["song","recipe","menu"]
- `g1u04.w.today` ← v1 `today`: d="this day, now" · s="_____ is my tenth birthday! I am going to have a party later." · a=[] · mc=["yesterday","last week","next year"]
- `g1u04.w.are-you-ok` ← v1 `Are you OK?`: d="asking if someone is fine" · s="You look very sad and your eyes are red. _____ Please tell me what is wrong." · a=[] · mc=["Goodbye!","See you later!","Well done!"]
- `g1u04.w.homework` ← v1 `homework`: d="school work you do at home" · s="I must do my maths _____ assigned by the teacher before I can play outside." · a=[] · mc=["sleeping","shopping","cooking"]
- `g1u04.w.into` ← v1 `into`: d="going inside something" · s="The curious cat jumped _____ the big cardboard box and hid inside." · a=[] · mc=["out of","under","away from"]
- `g1u04.w.oh-dear` ← v1 `Oh dear!`: d="you say this when something is wrong" · s="_____ I forgot my expensive school bag on the bus this morning and now it is lost!" · a=[] · mc=["Hooray!","Yippee!","Great news!"]
- `g1u04.w.room` ← v1 `room`: d="a part of a house or building" · s="My little sister and I share a small bedroom _____ with two beds and one wardrobe." · a=[] · mc=["bed","chair","shelf"]
- `g1u04.w.bad` ← v1 `bad`: d="not good" · s="The weather is very _____ today. It is raining hard and the wind is blowing." · a=[] · mc=["good","nice","lovely"]
- `g1u04.w.don-t-be-late` ← v1 `Don't be late.`: d="telling someone to come on time" · s="The school bus leaves at exactly eight o'clock. _____ Or you will miss it!" · a=["Don't be late"] · mc=["Don't hurry.","Don't worry.","Don't rush."]
- `g1u04.w.tomorrow` ← v1 `tomorrow`: d="the day after today" · s="Today is Monday, so _____ — the day after — is Tuesday." · a=[] · mc=["yesterday","last week","two days ago"]
- `g1u04.w.birthday` ← v1 `birthday`: d="the day you were born, celebrated yearly" · s="I get lots of presents and a chocolate cake with candles on my _____ every year." · a=[] · mc=["homework","test","lesson"]
- `g1u04.w.friend` ← v1 `friend`: d="a person you like and play with" · s="Tom is my best _____. We do homework together and play at each other's houses." · a=[] · mc=["teacher","parent","baby"]
- `g1u04.w.be-yourself` ← v1 `Be yourself.`: d="act how you really are" · s="Don't try to copy someone else at the party. _____ People will like the real you." · a=["Be yourself"] · mc=["Be quiet.","Be fast.","Be still."]
- `g1u04.w.no-one-else` ← v1 `no one else`: d="not any other person" · s="Be yourself and be sure that _____ can be a better you than you can." · a=[] · mc=["everyone","anyone","someone"]
- `g1u04.w.bottle` ← v1 `bottle`: d="a container for drinks" · s="Can I have a plastic _____ of cold water, please? I am very thirsty." · a=[] · mc=["plate","bowl","spoon"]
- `g1u04.w.to-get-back` ← v1 `to get back`: d="to have something returned to you" · s="I lent Anna my favourite book last week. I want to _____ it from her today." · a=[] · mc=["to throw away","to lose","to give away"]
- `g1u04.w.mad` ← v1 `mad`: d="feeling very angry" · s="Dad is very _____ because my football broke his favourite window. He is shouting at me." · a=["angry"] · mc=["happy","proud","glad"]
- `g1u04.w.magic` ← v1 `magic`: d="having special, impossible powers" · s="The wizard's _____ wand can make things disappear and reappear in a puff of smoke." · a=["magical"] · mc=["broken","normal","real"]
- `g1u04.w.to-break` ← v1 `to break`: d="to make something go into pieces" · s="Be careful with that glass cup! Don't drop it and _____ it into pieces." · a=[] · mc=["to hold","to clean","to keep"]
- `g1u04.w.to-go-to-sleep` ← v1 `to go to sleep`: d="to close your eyes and rest at night" · s="It is past bedtime and you have school tomorrow. You must _____ right now in your bed." · a=[] · mc=["to wake up","to get up","to run around"]
- `g1u04.w.because` ← v1 `because`: d="for the reason that" · s="I am very happy today _____ it is the start of the weekend and I have no school." · a=[] · mc=["but","although","however"]
- `g1u04.w.it-s-me` ← v1 `It's me.`: d="saying who you are" · s="Who is knocking at the door? — _____ Open the door, it's Anna from next door!" · a=["It's me"] · mc=["It's a stranger.","Nobody is here.","I don't know."]
- `g1u04.w.try-it` ← v1 `Try it!`: d="telling someone to do something new" · s="This chocolate birthday cake is delicious — the best I've ever eaten. _____ You'll love it!" · a=["Try it"] · mc=["Don't eat it!","Throw it away!","Leave it alone!"]
- `g1u04.w.let-go` ← v1 `Let go!`: d="telling someone to stop holding" · s="You are holding my arm too tight and it hurts! _____ Stop pulling me!" · a=["Let go"] · mc=["Hold on!","Hold tight!","Grab it!"]
- `g1u04.w.what-s-happening` ← v1 `What's happening?`: d="asking what is going on" · s="I can hear a loud noise and shouting from upstairs. _____ Is everything OK?" · a=["What is happening?"] · mc=["Who is there?","Where am I?","When is it?"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: SB Unit 4- Emotions.txt -----
Page 30
Unit 4: Emotions
At the end of unit 4 ...
you know ☐ 11 words for feelings ☐ the days of the week and times of the day ☐ how to make questions with the verb to be ☐ how to use the negative form of to be
you can ☐ talk about your and other people's feelings ☐ understand others talking about their feelings and week ☐ talk and write about your week
VOCABULARY Feelings
1 Follow the lines and say the sentences.
John's happy.
[Image description: A web diagram connecting character names (Linda, John, Paul, Vanessa, Jason, Fiona, Lucy, Wayne, Emma, Becky, Victor) with feeling words (cold, hot, bored, excited, angry, happy, proud, nervous, sad, scared, hungry) using interconnecting lines]
1/32 🔊 2 Listen and circle the correct words.
1 He is cold / hot. 2 She is angry / sad. 3 They are happy / sad. 4 He is bored / scared. 5 She is proud / hungry. 6 They are bored / excited. 7 He is angry / happy. 8 She is nervous / excited. 9 He is hot / proud.
READING
1/33 🔊 3 a Look at the story on page 31. Where are they? .....................................
b Listen to the story. Then read it and answer the questions.
1 Is Mike happy at the end of the story? 2 Is Miss Baker angry at the end of the story? 3 Is Mike's mum proud at the end of the story?
🔵 WB p. 31, 32 🌐 CYBER Homework 10 (Revision)
Page 31
The school play
[Image description: Comic-style story panels showing scenes from a school play]
I've got a part in the school play. I'm Harry Potter!
That's great!
Mike is excited.
The next day. On the stage.
I haven't got many friends.
No, no, no, Mike. In this scene Harry isn't happy. He's sad!
Miss Baker isn't happy.
Be quiet, Malfoy!
No, no, no, Mike. Now Harry is angry. He isn't happy!
Miss Baker still isn't happy.
Please, go away!
In this scene Harry isn't happy. He's scared.
Miss Baker still isn't happy.
Later at home.
It's no good, Mum. I'm terrible.
No, you're not, Mike. Let me help you.
It's a lot of work, but it's fun.
The big day.
There are a lot of people!
Mike is nervous.
After the play.
Bravo!
Great!
Fantastic!
Miss Baker is proud. Mum is proud. Mike is happy. He's very happy.
Page 32
READING
1/34 🔊 4 a Look. Find out the name of the city.
b Listen to the story. Then read it.
A day in the life of Richard
[Image description: Illustrations showing a royal guard at Buckingham Palace throughout a day]
Richard is a guard at Buckingham Palace. He has got a red jacket and a big black hat. It's early morning. It's wet. Richard's cold.
There are five tourists. The tourists are excited. They've got a camera. Is Richard excited? No, he isn't. He's angry.
It's lunchtime. The tourists have got hamburgers. Richard hasn't got a hamburger. Richard isn't happy. He's hungry.
It's afternoon. The sun is out. Richard isn't cold now. He's hot. He's really hot!
It's evening. Is Richard tired? No, he's just bored.
Richard isn't at work now. Richard's at home. Is he happy? No idea. He's asleep.
5 How many of these tasks can you do?
Choose the correct answer. 1 Richard's hat is red / black / brown. 2 Richard is wet / cold / tired. 3 The tourists are bored / happy / excited.
Circle T (True) or F (False). 4 All the tourists have got cameras. T / F 5 One tourist has got a hamburger. T / F 6 Richard has got no lunch. T / F
Complete the sentences. 7 When the sun is out, Richard ...................................................... . 8 In the evening, Richard isn't ......................................................... . 9 Now, he's .................................................................................. .
🔵 WB p. 34, 35
Page 33
SPEAKING Talking about feelings
1/35 🔊 6 C H O I C E S
Listen and put the two dialogues in the correct order. Act one of them out.
👥 A DIALOGUE 1
☐ Oh dear. Why? ☐ How are you today? ☐ I've got a lot of homework. ☐ I'm not very happy.
👥 B DIALOGUE 2
☐ Is it big? ☐ Are you OK? ☐ Scared? Why? ☐ Oh dear. Why?
☐ No, we aren't. ☐ There's a rat in our room. ☐ We're very scared. ☐ Yes, very big.
👥 7 Work in pairs. Draw on each face how the kids are feeling. Then find out about your partner's kids and draw.
[Image description: Six blank face outlines and character illustrations for Student A (Liz, Ben, Peter and Ahmet, Karen) and Student B (Sue, Noah, Yasmin and Jane, Jim)]
A Is ... happy? B Yes, he/she is.
A Is ... happy? B No, he/she isn't. He/She is sad.
A Are ... and ... happy? B Yes, they are. / No, they aren't.
SOUNDS RIGHT Days of the week
1/36 🔊 8 A chant. Listen and repeat.
Monday, Tuesday, Wednesday – cool.
Thursday, Friday – no more school!
Saturday and Sunday – great!
Tomorrow's Monday – don't be late!
[Image description: Cartoon illustrations of days of the week personified as characters celebrating]
🔵 WB p. 32, 33, 36 🌐 CYBER Homework 11
Page 34
9 Look at Gina's diary. Write the days of the week under the pictures.
[Image description: An open diary showing weekly schedule with various activities including football, school play, birthday, ballet, disco, tennis, and party]
1 .................Tuesday.................
[Image description: Seven numbered illustrations showing different activities throughout the week]
2 .............................................. 3 .............................................. 4 ..............................................
5 .............................................. 6 .............................................. 7 ..............................................
👤 10 Work in pairs. Talk about each picture in 9.
It's Monday. Gina is tired. It's Tuesday. Gina is ...
A SONG 4 U
1/37+38 🔊 11 Listen and sing.
Just be you
I am happy. I'm not sad. Things are good. They're not so bad.
I am proud of who I am. I'm not scared, I've got a plan.
Just be you. It's what you do. Be yourself and no one else. Happy, scared, bored or sad. It's who you are. So just be glad.
I'm excited for today. I've a feeling I know the way.
I'm so happy. I'm OK. I'm with my friends at school today.
Just be you...
[Image description: Cartoon illustration showing diverse children including one in a wheelchair]
🔵 WB p. 32
Page 35
LISTENING
1/39 🔊 12 Listen to Bob and Jill. Sing along.
THE MAGIC BOTTLE
I'm a monster, my name's Bob. I'm a monster and I rob*, yeah I rob, rob, rob feelings, hey, hey, hey, every day, I rob feelings.
I am Jill, Jill, Jill and I will*, will, will get the feelings back. I am good, Bob is bad. I am nice, Bob is mad*.
VOCABULARY: *rob – stehlen; will – werden; mad – zornig, wütend
1/40 🔊 13 Listen to the radio play The magic bottle and complete the sentences with the words from the box.
sad bored happy tired angry
1 Tim is .................................... . 2 Lilian is ................................. . 3 Rose is .................................. .
4 Jill is ...................................... . 5 Bob is ..................................... .
1/40 🔊 14 Put the pictures in the correct order. Then listen again and check.
[Image description: Six comic panels showing scenes with speech bubbles "So boring!", "Later.", "Zzzzz", "Where are my books?", "Kitty?", and "WHERE ARE MY BOOKS?"]
🔵 WB p. 37
Page 36
WRITING
15 C H O I C E S
A Use Gina's diary in 9 to complete the sentences.
1 I've got ................................................ on Thursday. 2 It's ................................................ today. I've got football and I'm tired. 3 I'm happy because it's my birthday on ................................................ . 4 It's the school play on ................................................ and I'm nervous. 5 I'm so excited there's a ................................................ on ................................................ .
B Choose four days from your week and write a sentence for each.
..................................................................................................................................................................... ..................................................................................................................................................................... ..................................................................................................................................................................... .....................................................................................................................................................................
GRAMMAR
▶️ to be (negative)
So bildest du die Verneinung mit to be:
I'm not (am not) happy. You aren't (are not) excited. He/She/It isn't (is not) cold. We aren't (are not) hungry. You aren't (are not) hot. They aren't (are not) angry.
[Image description: Illustration of a polar bear and penguin with speech bubble "Are you cold?"]
▶️ Questions with to be
So bildest du Fragen und Antworten mit den verschiedenen Formen von be:
?	+	–
Are you happy?	Yes, I am.	No, I'm not.
Is he happy?	Yes, he is.	No, he isn't.
Is she happy?	Yes, she is.	No, she isn't.
Is it happy?	Yes, it is.	No, it isn't.
Are you happy?	Yes, we are.	No, we aren't.
Are they happy?	Yes, they are.	No, they aren't.

⏪ Now go back to page 30. Check ☑ with a partner what you know / can do.
🔵 WB p. 33, 34, 35 🌐 CYBER Homework 12
Page 37
THE STORY OF THE STONES 2
▶️ Don't worry – it's me!
1 Remember and say: The green stone is for ... The orange ...
2 Can you say the rhyme of the stones?
I sl i e. I sl i q. I sl i b. W o s. H w t c d!
▶️ 3 Watch episode 2. Write the names of the animals.
rat eagle tiger
[Image description: Three animal illustrations - an eagle, a rat, and a tiger]
1 .............................................. 2 .............................................. 3 ..............................................
EVERYDAY ENGLISH
4 Match the pictures with the phrases. Write the numbers.
1 Try it! 2 Let go! 3 What's happening?
[Image description: Three comic-style panels showing action scenes]


----- WB: WB Unit 4 Emotions.txt -----
Unit 4 Emotions
Page 31
UNDERSTANDING VOCABULARY
Feelings / Days of the week
1 Circle the words and write them under the pictures.
angry bored cold happy hot hungry sad scared proud
1 She is ................................
2 She is ................................
3 They are ..............................
4 He is ................................
5 She is ................................
6 They are ..............................
7 He is ................................
8 He is ................................
9 They are ..............................
Page 32
2 Look at Tom’s diary. Write the days of the week.
1 Monday
2 T.................................
3 W.................................
4 T.................................
5 F.................................
6 S.................................
7 S.................................
USING VOCABULARY
Feelings / Days of the week
3 Match to make dialogues.
1 I’m tired.
2 I’m hungry.
3 I’m bored.
4 I’m hot.
5 I’m cold.
Eat a sandwich.
Close the door.
Sit down.
Open the window.
Read a good book.
4 Look at the pictures and write sentences about Mr Nibbs.
1 It’s Monday. Mr Nibbs is .................
2 It’s ................ Mr Nibbs ................
3 It’s .........................................
4 ...............................................
5 ...............................................
6 ...............................................
5 Answer the questions with Yes, he is or No, he isn’t.
1 It’s Saturday. Is Mr Nibbs hungry?
...............................................
2 It’s Wednesday. Is Mr Nibbs happy?
...............................................
3 It’s Monday. Is Mr Nibbs sad?
...............................................
4 It’s Thursday. Is Mr Nibbs angry?
...............................................
5 It’s Tuesday. Is Mr Nibbs excited?
...............................................
6 It’s Friday. Is Mr Nibbs cold?
...............................................
Page 33
UNDERSTANDING GRAMMAR
to be (negative) / questions with to be
6 Match the questions and answers.
1 Is it cold?
2 Are you hungry, Sue?
3 Are we late?
4 Is she angry?
5 Are they excited?
6 Is he English?
Yes, we are.
No, she isn’t.
Yes, it is.
Yes, he is.
No, I’m not.
Yes, they are.
7 Complete the dialogues with the words from the box.
I’m not
isn’t
isn’t
isn’t
aren’t
aren’t
1
A Look at that small dog!
B It ................ a dog. It’s a cat!
2
A Hi, James!
B I ................ James. I’m Mike.
3
A They are from London.
B No, they ................ from London.
They are from Vienna.
4
A Alison is angry.
B She ................ angry. She is bored.
5
A Is today Wednesday?
B No, it ................ Wednesday today.
It’s Thursday.
6
A Yes — I’m right!
B You ................ right. You are wrong.
7
A We are late!
B No, we ................ late. It’s only eight o’clock.
USING GRAMMAR
to be (negative) / questions with to be
8 Complete the questions and short answers.
1
A ................ Nadia from London?
B No, she ................ .
2
A ................ you nervous?
B Yes, I ................ .
3
A ................ I right?
B No, you ................ .
4
A ................ it a cat?
B Yes, it ................ .
5
A ................ they excited?
B Yes, ................ .
6
A ................ we right?
B No, ................ .
7
A ................ Steve sixteen?
B No, ................ .
8
A ................ you hot?
B No, ................ .
9 Look at the pictures. Complete the questions and short answers.
1 ................ Jenny in London?
No, she ................ .
2 ................ it Sarah’s dog?
Yes, it ................ .
3 ................ Steve twelve?
No, he ................ .
4 ................ they hungry?
Yes, they ................ .
5 ................ you nervous?
Yes, I ................ .
6 ................ we late?
Yes, you ................ .
Page 34
10 Follow the lines and write the sentences.
1 Sharon isn’t tired. She’s bored.
2 ...............................................
3 ...............................................
4 ...............................................
5 ...............................................
6 ...............................................
11 Look at the story A day in the life of Richard on page 32 in the Student’s Book and correct the sentences.
1 It’s early morning. Richard is hot.
...............................................
2 The tourists are hungry.
...............................................
3 It’s lunchtime. Richard is thirsty*.
...............................................
4 The sun is out. Richard is angry.
...............................................
5 It’s late. Richard is tired.
...............................................
6 Richard’s in bed. He’s sad.
...............................................
VOCABULARY: *thirsty – durstig
12 Write short answers.
1 Are Brian and Nadia here? (✓)
...............................................
2 Are you cold? (✗)
...............................................
3 Is it your dog? (✗)
...............................................
4 Is she bored? (✓)
...............................................
5 Is it Friday today? (✓)
...............................................
6 Am I right? (✗)
...............................................
Page 35
READING & WRITING
Talking about your and other people’s feelings / Writing about your week
13 Look at the pictures and write dialogues.
1
A How is William?
B He is nervous.
2
A ...............................................
B ...............................................
3
A ...............................................
B ...............................................
4
A ...............................................
B ...............................................
5
A ...............................................
B ...............................................
6
A ...............................................
B ...............................................
14 Write your answers to the questions.
1 What day of the week is it today?
...............................................
2 What day is tomorrow?
...............................................
3 Are you happy today?
...............................................
4 Are you hungry?
...............................................
15 Complete the dialogue with the correct words.
Andy Hello, Tony. Hello, Emily. How 1 ................ you today?
Emily We 2 ................ very excited.
Andy Great! Why 3 ................ you excited?
Tony Tomorrow 4 ................ the weekend!
Andy Oh, 5 ................ it Friday today?
Emily Yes, it 6 ................ . 7 ................ you happy, Andy?
Andy No, I 8 ................ . I 9 ................ very bored.
Tony Why?
Andy Saturday 10 ................ a good day for me.
Emily Why?
Andy Mum and I go shopping.
Page 36
16 CHOICES
A 1 Put the dialogue in the correct order.
A Great! Why?
B There’s no homework today!
A How are you today?
B I’m very happy.
2 Complete the dialogues with the sentences from the box.
Why not?
How are you today?
I’m very tired.
DIALOGUE 1
A 1 ...............................................
B Not so good.
A 2 ...............................................
B I’m nervous. There’s a test tomorrow.
DIALOGUE 2
A How are you today?
B 3 ...............................................
A Then go to bed.
B OK.
B 1 Put the dialogue in the correct order.
A OK. Read a good book.
A How are you today?
A Oh dear. Why are you bored?
B But I haven’t got a good book!
B There’s nothing* good on TV.
B I’m very bored.
2 Write your own dialogue.
A How are you today?
B ...............................................
A ...............................................
B ...............................................
A ...............................................
B ...............................................
VOCABULARY: *nothing – nichts
Page 37
LISTENING & DIALOGUE WORK
Understanding others talking about their feelings and week
17 Listen to Sara. Match the days of the week with her feelings.
1 Monday
2 Tuesday
3 Wednesday
4 Thursday
5 Friday
6 Saturday
7 Sunday
excited
sad
tired
nervous
bored
angry
happy
VOCABULARY: *get up – aufstehen
18 Complete the dialogues with the sentences from the box. There are two extra sentences.
No, I’m not.
I’m angry.
I’m tired.
Are you OK?
It’s my birthday.
No, they aren’t.
I’m excited.
They’re from Spain.
Yes, we are.
We’re from France.
Oh, I’m sorry.
1
Paula Hi, Toby. How are you?
Toby ...............................................
Paula Why?
Toby ...............................................
Paula Happy Birthday, Toby.
Toby Thank you.
2
Bob Are you happy, Olivia?
Olivia ...............................................
Bob What’s the problem?
Olivia You’ve got my sandwich in your mouth.
Bob ...............................................
3
Clara ...............................................
Ben No, I’m not.
Clara Oh dear. What’s the problem?
Ben ...............................................
Clara Go to bed.
Ben That’s a good idea.
4
Oliver Are they from Italy?
Tim ...............................................
Oliver Where are they from?
Tim ...............................................
19 Listen and check your answers.
Page 38
WORD FILE
Feelings
cold
angry
happy
scared
excited
hot
bored
sad
hungry
nervous
tired
proud
Times of the day
morning
lunchtime
afternoon
evening
night
Days of the week
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
Page 39
MORE Words and Phrases
after – After school I meet my friends. – nach
day – On the big day, Mike is nervous. – Tag
end – At the end of the play, Mike is very happy. – Ende
fun – It’s great fun. – Spaß
Go away! – Geh weg!
to help – Let me help you. – helfen
home – Mike is at home. – zu/nach Hause; Zuhause
It’s no good. – Es hat keinen Zweck.
mum – She is his mum. – Mama, Mutti
next – The next day. – nächster/nächste/nächstes
still (not) – Miss Baker still isn’t happy. – immer noch (nicht)
a day in the life of – The story is about a day in the life of Richard. – ein Tag im Leben von
to be asleep – He’s in bed and he’s asleep. – schlafen
early – It’s early. He’s still in bed. – früh
life (pl lives) – Elephants have a long life. – Leben
lunchtime – It’s lunchtime. He’s hungry. – Mittagspause
sun – The sun is out. – Sonne
Are you OK? – Geht’s dir/euch/Ihnen gut?
homework (no pl) – We have got a lot of homework today. – Hausaufgaben
into – Go into the classroom! – in (… hinein)
Oh dear! – Du meine Güte!
room – There’s a rat in our room. – Zimmer, Raum
why – Why are you tired? – warum
bad – Thursday and Friday aren’t bad. – schlecht, böse
Don’t be late. – Komm(t) nicht zu spät., Sei(d) pünktlich.
tomorrow – Tomorrow is Monday. – morgen
birthday – Happy birthday, David! – Geburtstag
friend – Tom is his friend. – Freund/Freundin
Be yourself. – Sei du selbst.
no one else – Be yourself and no one else. – niemand anders
bottle – The feelings are in the bottle. – Flasche
to get back – I will get the feelings back. – zurückholen, zurückbekommen
mad – I am nice, Bob is mad. – wütend, zornig
magic – This is a magic bottle. – magisch
to break – I must break the bottle. – (zer-)brechen
to go to sleep – Go back to sleep. – schlafen gehen
because – I’m happy because it’s the weekend. – weil
It’s me. – Ich bin’s.
Try it! – Versuch es!
Let go! – Lass(t) los!
What’s happening? – Was ist (hier) los?

```

## Output contract

Write `content/corpus/units/g1-u04/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g1-u04",
  "briefBank": "07ed93df8cb9",
  "briefPrompt": "346902f9f0f1",
  "items": [
    {
      "wordId": "g2u03.w.witch",        // the bank id this item teaches (EVERY bank row exactly once)
      "w": "witch",                     // == bank en, verbatim
      "g": "Hexe",                      // one of the bank's de values (the primary sense)
      "d": "…", "s": "… ___ …", "sSource": "masterlist|sb|wb|invented",
      "sAnswers": [{ "text": "…", "tier": "full|partial" }],
      "dAnswers": [{ "text": "…", "tier": "full" }],
      "translation": { "deToEn": [{ "text": "…", "tier": "full" }], "enToDe": [{ "text": "…", "tier": "full" }] },
      "gloss": [],                      // [{ "word": "…", "de": "…", "scope": "s"|"d"|null }]
      "mc": ["…", "…", "…"],
      "hintDe": "…",
      "difficulty": 1,
      "gameMeta": { "distractorPool": ["…", "…", "…", "…"], "chipBudget": null, "minOptions": 4 },
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```
