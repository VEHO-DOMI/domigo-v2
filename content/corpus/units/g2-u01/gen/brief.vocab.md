# Vocab generation brief — g2-u01 (MORE! 2, Unit 1)

<!-- domigo:gen vocab g2-u01 bank=d2d12476b358 prompt=346902f9f0f1 -->

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
| g2u01.w.english | English | Englisch | wordfile | School Subjects | — | — | English |
| g2u01.w.french | French | Französisch | wordfile | School Subjects | — | — | French |
| g2u01.w.music | music | Musik | wordfile | School Subjects | — | — | music |
| g2u01.w.maths | maths | Mathematik | wordfile | School Subjects | — | — | maths |
| g2u01.w.geography | geography | Geografie | wordfile | School Subjects | — | — | geography |
| g2u01.w.science | science | Naturwissenschaften | wordfile | School Subjects | — | — | science |
| g2u01.w.physical-education | physical education (PE) | Sport ; Leibeserziehung | wordfile | School Subjects | — | — | physical education ; PE |
| g2u01.w.art | art | Kunst | wordfile | School Subjects | — | — | art |
| g2u01.w.history | history | Geschichte | wordfile | School Subjects | — | — | history |
| g2u01.w.information-technology | information technology (IT) | Informatik | wordfile | School Subjects | — | — | information technology ; IT |
| g2u01.w.design-and-technology | design and technology | Werken | wordfile | School Subjects | — | — | design and technology |
| g2u01.w.glad | glad | froh | phrase | — | I was glad to stay at home. | — | glad |
| g2u01.w.kilometre | kilometre | Kilometer | phrase | — | My school's one kilometre from my house. | — | kilometre |
| g2u01.w.to-stay-at-home | to stay at home | zu Hause bleiben | phrase | — | Are you going to stay at home? | stay at home | to stay at home ; stay at home |
| g2u01.w.to-travel | to travel | reisen | phrase | — | Did you travel far? | travel | to travel ; travel |
| g2u01.w.as-soon-as | as soon as | sobald (wie) | phrase | — | I do my homework as soon as I get home. | — | as soon as |
| g2u01.w.to-get-dressed | to get dressed | sich anziehen | phrase | — | I get dressed at 7.45. | get dressed | to get dressed ; get dressed |
| g2u01.w.to-go-for-a-walk | to go for a walk | spazieren gehen | phrase | — | I go for a walk with my dog. | go for a walk | to go for a walk ; go for a walk |
| g2u01.w.lesson | lesson | Unterrichtsstunde | phrase | — | Our first lesson starts at 7.30 a.m. | — | lesson |
| g2u01.w.to-prepare | to prepare | (zu-)bereiten | phrase | — | I help my mum to prepare food for our supper. | prepare | to prepare ; prepare |
| g2u01.w.to-put-on | to put on | anziehen (Kleidung) | phrase | — | After breakfast, I put on my school uniform. | put on | to put on ; put on |
| g2u01.w.supper | supper | Abendessen | phrase | — | I do my homework after supper. | — | supper |
| g2u01.w.daily | daily | täglich | phrase | — | My daily routine starts when I get up in the morning. | — | daily |
| g2u01.w.calendar | calendar | Kalender | phrase | — | It's like a big calendar. | — | calendar |
| g2u01.w.grandmother | grandmother | Großmutter | phrase | — | My grandmother lives in Mexico. | — | grandmother |
| g2u01.w.joke | joke | Witz | phrase | — | It wasn't a joke. | — | joke |
| g2u01.w.scary | scary | furchterregend ; unheimlich | phrase | — | My family and I had a scary holiday. | — | scary |
| g2u01.w.spring | spring | Frühling | phrase | — | In the spring and summer, the shadows of the steps look like a huge snake. | — | spring |
| g2u01.w.area | area | Gebiet ; Region | phrase | — | There are lots of animals in the area. | — | area |
| g2u01.w.to-book | to book | buchen | phrase | — | You can book your holiday today. | book | to book ; book |
| g2u01.w.popular | popular | beliebt | phrase | — | Chichen Itza is a popular tourist attraction. | — | popular |
| g2u01.w.shadow | shadow | Schatten | phrase | — | You can see a shadow move down the side of the pyramid steps. | — | shadow |
| g2u01.w.to-visit | to visit | besichtigen | phrase | — | A lot of tourists visit the Mayan city of Chichen Itza. | visit | to visit ; visit |
| g2u01.w.colourful | colourful | bunt ; farbenfroh | phrase | — | There are many colourful parrots at the zoo. | — | colourful |
| g2u01.w.along | along | entlang | phrase | — | Snakes slide along the sand. | — | along |
| g2u01.w.to-crawl | to crawl | kriechen | phrase | — | Snakes crawl around and into stones. | crawl | to crawl ; crawl |
| g2u01.w.to-take-a-rest | to take a rest | sich ausruhen | phrase | — | I take a rest after school. | take a rest | to take a rest ; take a rest |
| g2u01.w.subject | (school) subject | (Schul-)Fach | phrase | — | English is my favourite subject. | — | subject ; subject school |
| g2u01.w.break | break | Pause | phrase | — | After the break, we have history. | — | break |
| g2u01.w.timetable | timetable | Stundenplan | phrase | — | She has four English lessons in her timetable. | — | timetable |
| g2u01.w.bicycle-lane | bicycle lane | Radweg | phrase | — | There's a new bicycle lane in my town. | — | bicycle lane |
| g2u01.w.king | king | König | phrase | — | A king can make the rules. | — | king |
| g2u01.w.noisy | noisy | laut ; geräuschvoll | phrase | — | I don't like noisy people. | — | noisy |
| g2u01.w.queen | queen | Königin | phrase | — | A queen can make the rules. | — | queen |
| g2u01.w.rubbish | rubbish | Müll ; Abfall | phrase | — | A big problem in our area is rubbish in the street. | — | rubbish |
| g2u01.w.online-safety | online safety | Internetsicherheit | phrase | — | You can find helpful tips for online safety on this website. | — | online safety |
| g2u01.w.opinion | opinion | Meinung | phrase | — | I always say my opinion. | — | opinion |
| g2u01.w.webpage | webpage | Internetseite | phrase | — | Go online and read the webpage. | — | webpage |

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.
- **g1-u07**: ice cream, chillies, fish, chicken, milk, butter, cheese, orange juice, tea, cucumber, sausages, beans, broccoli, carrot, onion, peas, an apple, mineral water, grapes, an orange, tomato (pl tomatoes), red pepper, kiwi, spinach, strawberry, sugar, bread, rice, egg, pasta, pizza, fries, chips, hamburger, chocolate, cake, breakfast, lunch, dinner, restaurant, always, usually, often, sometimes, never, meat, ham, healthy, to like, That's nice., any, to drink, to make, money, sandwich, some, vegetable, waiter, Have you got …?, I've got …, junk food, menu, Mum, plate, salad, soup, glass
- **g1-u08**: cap, mask, jacket, sweater, blouse, trousers, hoodie, cape, pyjamas, tights, shoes, boots, trainers, belt, hole, anything, to borrow, to fit, to try on, to wear, to hurt, poem, to tickle, somebody, backwards, exciting, tonight, horse, building, Let's get out of here.
- **g1-u09**: owl, budgie, elephant, spider, bat, shark, zebra, camel, pony, guinea pig, fish, pig, rabbit, lizard, rat, mouse, tortoise, box, tank, cage, terrarium, unusual, mouse (pl mice), (...) a day, once, twice, across (Britain), dangerous, farm, man (pl men), near, newspaper, (...) a week, basket, daughter, to drive, everybody, far away, grandpa, mother, noise, to stay, cuddly toy, to visit, to be interested in, fur, personal, owner, aunty, dear, letter, to bite, beginning, to begin, best wishes, ending, to need
- **g1-u10**: 20 twenty, 30 thirty, 40 forty, 50 fifty, 60 sixty, 70 seventy, 80 eighty, 90 ninety, 100 one hundred, 1000 one thousand, how much is/are ..., price, these, those, Anything else?, Can I help you?, computer game, headphones, key ring, magazine, mobile phone, scooter, sweets (pl), tin, Congratulations!, rule, customer, everything, expensive, to fall asleep, Goodbye., I'd like ..., No wonder., suddenly, town, to walk away, changing room, No problem., over there, drawer, That's better., What can I do for you?, Be careful., Just a minute.
- **g1-u11**: 9 a.m., midday, 9 p.m., midnight, 9 o'clock, (a) quarter past nine, half past nine, (a) quarter to ten, to ride a bike, to watch TV, to play football, to play computer games, to play the piano, to ride a horse, to skateboard, to cook, to ride a scooter, to ski, to snowboard, to skate, daily, free time, What's the time?, Excuse me., to hurry, clock, It's 10 a.m., It's 8 p.m., What time is it?, bedtime, break, exercise, to go to bed, to go to school, outside, to study, to wake somebody up, amazing, to answer the door, bush, Have fun!, to hide, knock, living room, surprise, to push, to cook, text message, to look after, road, place, programme, clue, See you soon., to snow, weather, half an hour, Hurry up.
- **g1-u12**: January, February, March, April, May, June, July, August, September, October, November, December, bedroom, library, living room, dining room, bathroom, hall, kitchen, garden, garage, 1st first, 2nd second, 3rd third, 4th fourth, 5th fifth, 6th sixth, 7th seventh, 8th eighth, 9th ninth, 10th tenth, 11th eleventh, 12th twelfth, 13th thirteenth, 14th fourteenth, 15th fifteenth, 16th sixteenth, 17th seventeenth, 18th eighteenth, 19th nineteenth, 20th twentieth, 21st twenty-first, 22nd twenty-second, 23rd twenty-third, 24th twenty-fourth, 25th twenty-fifth, 30th thirtieth, 31st thirty-first, birthday cake, eater, ill, messy, piece, cinema, excellent, finally, match, It's my birthday., date, month, How old are you?, candle, delicious, last, robber, robbery, yesterday, alarm clock, probably, Good for you!, inspector, How dare you!, That was close., You're welcome.
- **g1-u13**: storm, jetpack, helicopter, coastguard, fire brigade, ambulance, police, mountain rescue, to shout for help, to be lucky, to break, country, crime, fire, accident, to be in danger, to fly up the mountain, to radio, rescue team, rock, to shout for help, to slip, storm, wet, to arrive, to be safe, to dream, to fall down, to land, medicine, sky, windy, dark, young, alone, backpack, to happen, to chase, sunny, class speaker, democracy, mayor, political, to vote, button, cloud, Earth, to die, forest, introduction, space, to notice, to press, screen, adventure, character, Guess what?, Tell me more.
- **g1-u14**: nature programme, fantasy film, reality show, fantasy story, quiz show, science fiction film, the news, detective story, romantic film, sports programme, horror story, drama series, adventure story, music video, romantic story, cartoon, screen time, headline, latest, comedy, episode, gamer, kind of, quite, to stream, weekend, to freeze (froze), huge, inside, to pay (paid), to point to, power, remote control, to reply (replied), to sell (sold), tiny, voice, wide, to fight (fought), shopkeeper, to disappear, to hold (held), to spend, to bend down (bent down), to hug, lake, leaf (pl leaves), to lie, skin, spot, weak, dead, once upon a time, one day, adventure, cover, friendship, poem, neighbour
- **g1-u15**: to fly to, to go fishing, to stay at a campsite, to swim in the sea, to play badminton, to lie in the sun, to write a postcard, to play board games, to visit a castle, aunt, beach, board game, campsite, cook, to drive, holiday, national park, parents, plane, summer, hippo, to join, to invite
- **g2-u01**: English, French, music, maths, geography, science, physical education (PE), art, history, information technology (IT), design and technology, glad, kilometre, to stay at home, to travel, as soon as, to get dressed, to go for a walk, lesson, to prepare, to put on, supper, daily, calendar, grandmother, joke, scary, spring, area, to book, popular, shadow, to visit, colourful, along, to crawl, to take a rest, (school) subject, break, timetable, bicycle lane, king, noisy, queen, rubbish, online safety, opinion, webpage

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Castle, Chester, Chichen, China, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Disneyland, Doctor, Doctors, Don, Dragon, Elisabeth, Ellie, Emergency, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Grey, Greybeard, Groans, Guess, Hammond, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Joe, John, Jolly, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Leah, Leo, Lethabo, Leute, Lewis, Li, Liam, Linking, Lisa, London, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Olivia, Omar, Ordinal, Palace, Pardon, Paris, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Robert, Ronald, Rose, Rosie, Sally, Sam, Samuel, Sandra, Sara, Saying, School, Scotland, Sean, Sherlock, Smith, Sophia, Sophie, States, Steve, Sue, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u01.w.english` ← v1 `English`: d="The language people speak in Britain and the USA" · s="We have _____ class and read stories from Britain and the USA." · a=[] · mc=["French","German","Spanish"]
- `g2u01.w.french` ← v1 `French`: d="The language people speak in France" · s="My sister is learning _____ so she can talk to people in Paris." · a=[] · mc=["English","Spanish","Italian"]
- `g2u01.w.music` ← v1 `music`: d="Sounds that people sing or play on instruments" · s="We play guitar and sing in our _____ lesson." · a=[] · mc=["art","drama","dance"]
- `g2u01.w.maths` ← v1 `maths`: d="The subject where you work with numbers" · s="I like _____ because I am good with numbers." · a=["math"] · mc=["science","geography","physics"]
- `g2u01.w.geography` ← v1 `geography`: d="The subject about countries and the world" · s="In _____ we are learning about mountains and rivers." · a=[] · mc=["history","science","maths"]
- `g2u01.w.science` ← v1 `science`: d="The subject about how the world works" · s="We did a cool experiment in _____ class today." · a=["sciences"] · mc=["maths","geography","history"]
- `g2u01.w.physical-education` ← v1 `physical education (PE)`: d="The school subject where you run and play sports" · s="We play football and run in _____ class." · a=["PE","physical education"] · mc=["art","music","design and technology"]
- `g2u01.w.art` ← v1 `art`: d="The subject where you draw and paint" · s="I painted a picture of my dog in _____ class." · a=[] · mc=["music","design and technology","drama"]
- `g2u01.w.history` ← v1 `history`: d="The subject about things that happened long ago" · s="We learned about the Romans in _____ today." · a=[] · mc=["geography","science","maths"]
- `g2u01.w.information-technology` ← v1 `information technology (IT)`: d="The school subject about computers" · s="We use laptops in _____ class every Friday." · a=["IT","information technology"] · mc=["design and technology","science","maths"]
- `g2u01.w.design-and-technology` ← v1 `design and technology`: d="The subject where you make things with your hands" · s="We built a small car in _____ last week." · a=["design and technology","D&T"] · mc=["art","information technology (IT)","science"]
- `g2u01.w.glad` ← v1 `glad`: d="Happy about something good" · s="She was very _____ when she found her lost cat and had a big smile on her face." · a=[] · mc=["sad","angry","worried"]
- `g2u01.w.kilometre` ← v1 `kilometre`: d="A way to measure how far something is (1000 metres)" · s="The park is only one _____ from our house." · a=["kilometer","kilometres","kilometers"] · mc=["metre","centimetre","mile"]
- `g2u01.w.to-stay-at-home` ← v1 `to stay at home`: d="To not go out and be in your house" · s="It is raining, so I want to _____ today." · a=["stay at home","stayed at home","stays at home"] · mc=["to go out","to go for a walk","to travel"]
- `g2u01.w.to-travel` ← v1 `to travel`: d="To go from one place to another place" · s="My family _____ to Italy every summer by plane." · a=["travel","travels","travelled","traveled"] · mc=["to stay at home","to arrive","to visit"]
- `g2u01.w.as-soon-as` ← v1 `as soon as`: d="At the same moment that something happens" · s="I eat breakfast _____ I wake up -- I don't wait even one minute." · a=["as soon as"] · mc=["as long as","as far as","as well as"]
- `g2u01.w.to-get-dressed` ← v1 `to get dressed`: d="To put your clothes on" · s="Every morning I _____ and put on my school uniform." · a=["get dressed","gets dressed","got dressed"] · mc=["to put on","to get up","to get undressed"]
- `g2u01.w.to-go-for-a-walk` ← v1 `to go for a walk`: d="To walk outside for fun or exercise" · s="We _____ in the park with our dog every evening." · a=["go for a walk","went for a walk","goes for a walk"] · mc=["to go for a run","to go for a ride","to take a rest"]
- `g2u01.w.lesson` ← v1 `lesson`: d="A time at school when you learn something" · s="Our English _____ starts at eight o'clock." · a=["lessons"] · mc=["break","homework","subject"]
- `g2u01.w.to-prepare` ← v1 `to prepare`: d="To get something ready" · s="My dad spends an hour _____ dinner by cutting vegetables and boiling water before we eat." · a=["prepare","prepares","prepared","preparing"] · mc=["to eat","to order","to clean"]
- `g2u01.w.to-put-on` ← v1 `to put on`: d="To place clothes on your body" · s="It is cold outside, so _____ a warm jacket." · a=["put on","puts on"] · mc=["to take off","to get dressed","to pick up"]
- `g2u01.w.supper` ← v1 `supper`: d="The meal you eat in the evening" · s="We eat our evening meal, called _____, at seven o'clock." · a=["suppers"] · mc=["lunch","breakfast","brunch"]
- `g2u01.w.daily` ← v1 `daily`: d="Something that happens every day" · s="Brushing your teeth is part of your _____ routine." · a=[] · mc=["weekly","monthly","yearly"]
- `g2u01.w.calendar` ← v1 `calendar`: d="A list that shows all the days and months of a year" · s="I wrote the test date on my _____ so I can see all the days of the month." · a=["calendars"] · mc=["notebook","schoolbag","pencil case"]
- `g2u01.w.grandmother` ← v1 `grandmother`: d="Your mum's or dad's mother" · s="My _____ always bakes the best cakes. She is my mum's mother." · a=["grandmothers"] · mc=["grandfather","auntie","mother"]
- `g2u01.w.joke` ← v1 `joke`: d="A short funny story that makes you laugh" · s="Tom told a funny _____ that ended with a clever punchline." · a=["jokes"] · mc=["song","speech","question"]
- `g2u01.w.scary` ← v1 `scary`: d="Something that makes you feel afraid" · s="The old house in our street looks very _____ at night. No one dares to go inside." · a=[] · mc=["pretty","welcoming","cosy"]
- `g2u01.w.spring` ← v1 `spring`: d="The time of year after winter when flowers grow" · s="The trees get green leaves in _____." · a=[] · mc=["summer","autumn","winter"]
- `g2u01.w.area` ← v1 `area`: d="A part of a place or town" · s="There are many shops and houses in the _____ around our street where we live." · a=["areas"] · mc=["country","continent","planet"]
- `g2u01.w.to-book` ← v1 `to book`: d="To pay for a place or ticket before you go" · s="We _____ a hotel room for our holiday last week." · a=["book","booked","books"] · mc=["to cancel","to order","to buy"]
- `g2u01.w.popular` ← v1 `popular`: d="Liked by many people" · s="This game is very _____ with kids at our school. Almost everyone plays it every day." · a=[] · mc=["unknown","hated","boring"]
- `g2u01.w.shadow` ← v1 `shadow`: d="A dark shape on the ground when something blocks the sun" · s="I can see my _____ on the ground when the sun shines." · a=["shadows"] · mc=["sunshine","light","reflection"]
- `g2u01.w.to-visit` ← v1 `to visit`: d="To go to a place to see it or someone" · s="We _____ our grandparents every Sunday and bring them flowers." · a=["visit","visits","visited"] · mc=["to travel","to arrive","to explore"]
- `g2u01.w.colourful` ← v1 `colourful`: d="Having many bright colours" · s="She is wearing a _____ dress with red, blue, and yellow." · a=["colorful"] · mc=["plain","dark","striped"]
- `g2u01.w.along` ← v1 `along`: d="From one end to the other of something" · s="We walked _____ the river from one end of the park to the other." · a=[] · mc=["across","through","towards"]
- `g2u01.w.to-crawl` ← v1 `to crawl`: d="To move slowly on the ground like a baby or a snake" · s="The baby _____ on her hands and knees across the floor to get her toy." · a=["crawl","crawled","crawls"] · mc=["to run","to jump","to walk"]
- `g2u01.w.to-take-a-rest` ← v1 `to take a rest`: d="To stop and relax for a short time" · s="After the long walk, we were very tired so we sat down under a tree to _____." · a=["take a rest","took a rest","takes a rest"] · mc=["to hurry","to run","to exercise"]
- `g2u01.w.subject` ← v1 `(school) subject`: d="A topic you learn about at school" · s="Maths is my favourite _____. I study it four times a week." · a=["subject","subjects","school subject"] · mc=["day","teacher","book"]
- `g2u01.w.break` ← v1 `break`: d="A short time to rest between lessons" · s="We play in the playground during morning _____ between lessons." · a=["breaks"] · mc=["class","homework","assembly"]
- `g2u01.w.timetable` ← v1 `timetable`: d="A list that shows when your lessons are" · s="I always check my class _____ to see what lessons I have on Monday, Tuesday, and the rest of the week." · a=["timetables"] · mc=["bag","book","pen"]
- `g2u01.w.bicycle-lane` ← v1 `bicycle lane`: d="A special path on the road for bikes" · s="You should ride your bike on the _____ -- the special path just for bikes." · a=["bicycle lane","bicycle lanes","bike lane"] · mc=["motorway","pavement","bus stop"]
- `g2u01.w.king` ← v1 `king`: d="A man who rules a country" · s="The _____ lived in a big castle on the hill." · a=["kings"] · mc=["queen","prince","emperor"]
- `g2u01.w.noisy` ← v1 `noisy`: d="Making a lot of loud sounds" · s="The classroom was very _____ during the break — everyone was shouting and laughing." · a=[] · mc=["quiet","calm","empty"]
- `g2u01.w.queen` ← v1 `queen`: d="A woman who rules a country" · s="The _____ wore a beautiful golden crown and a long pink dress." · a=["queens"] · mc=["king","prince","knight"]
- `g2u01.w.rubbish` ← v1 `rubbish`: d="Things you throw away because you do not need them" · s="Please put your _____ in the bin — banana peels and dirty tissues." · a=[] · mc=["books","toys","clothes"]
- `g2u01.w.online-safety` ← v1 `online safety`: d="How to stay safe when you use the internet" · s="Our teacher talked about _____ and how to protect our passwords." · a=["online safety"] · mc=["social media","group chat","password"]
- `g2u01.w.opinion` ← v1 `opinion`: d="What you think about something" · s="In my _____, chocolate ice cream is the best. What do you think?" · a=["opinions"] · mc=["dream","memory","plan"]
- `g2u01.w.webpage` ← v1 `webpage`: d="A page on the internet with information" · s="I found a nice _____ about dinosaurs with pictures and videos." · a=["webpages","web page","web pages"] · mc=["book","poster","letter"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 1.txt -----
Unit 1 First Day Back at School
Page 8–9
UNIT 1
 First day back at school
At the end of unit 1 …
you know
11 words for school subjects
how to use the present simple (revision)
how to use the past simple (revision)
you can
talk about your holidays
understand, ask and talk about daily routines
understand a story about a past holiday
understand a leaflet about a tourist attraction
understand a poem about an animal
understand and talk about a timetable
write an email about a past holiday/weekend
A SONG 4 U
 1 Listen and sing.
 Where did you go?
Hey, hey, hey!
 Where did you go for your holiday?
Did you go to Paris?
 And did you go to Rome?
 Did you go to Lisbon?
 Or did you stay at home?
I didn’t go away,
 I didn’t go away.
 I was glad to stay
 at home.
Were you on a cruise ship?
 Were you at a spa?
 Were you in the jungle?
 Did you travel far?
I didn’t go away,
 I didn’t go away.
 I was glad to stay
 at home.
Did you see the North Pole?
 Did you see Madrid?
 Did you go Down Under?
 Tell me what you did.
I didn’t go away,
 I didn’t go away.
 I was glad to stay
 at home.
 Yeah, I was glad to stay
 at home.
(Image description: Illustration of a child lying in bed daydreaming with various holiday destination icons floating around the room, such as the Eiffel Tower, a cruise ship, pyramids, and a jungle scene.)
SPEAKING
 Talking about your holidays
2 Say what you did in your holidays.
Speech bubbles below the prompt:
I went to ...
I stayed at home.
I swam a lot.
I went to see ...
I really liked ...
READING
 3 CHOICES
A
 a Read about Michael’s day quickly.
 Has he got a lot of free time?
b Read again. Then write the times.
Michael wakes up at 7.30 a.m.
Michael goes to school at ___________
Michael’s lessons start at ___________
Michael gets home at ___________
Michael goes to bed at ___________
(Text box with photo of a boy)
 My name’s Michael. I live in Perth in the west of Australia. I usually wake up at 7.30. I wash, get dressed and have breakfast with my mum and dad. At ten past eight my mum drives me to school.
 I play with my friends there. School starts at 8.45. I really like school. My teacher takes us on a lot of trips – I like that. School ends at 4 o’clock. Then I usually go to rugby practice with my friends.
 I get home at 6 o’clock. Then I go for a quick walk with my dog. At 8 o’clock, we have dinner. After dinner, I watch TV or read a bit. I usually go to bed at 9.30.
B
 a Read about Grace’s day quickly. Has she got a lot of free time?
b Read again. Then cover up the text and write notes in the boxes.
 Check with a partner.
(Text box with photo of a girl)
 My name’s Grace and I go to school in a village 100 kilometres from Kigali in Rwanda.
 I usually wake up early in the morning, around 4 a.m., so I can study a bit and do my household chores. People here get up early because it is better to do your chores when it is not so hot. First, I say my morning prayers. Then I sweep the house, wash, make breakfast and put on my school uniform. I always get to school around 6.30 a.m. As soon as I get to school, I sweep my classroom – this is what my friends and I do every day. At 7 a.m., we all meet in assembly*, where we usually hear some important information. Our first lesson starts at 7.30 a.m., and lasts for 80 minutes. Every day, we have five lessons. We have a break at 10 a.m. and we start again at 10.40 a.m. The older kids have more lessons, of course. But when we finish, I don’t go home right away. I stay for private classes with one of our teachers.
 I get home at about 3.30 p.m. I have my lunch, then go for water for the house. After that, I help my mum to prepare food for our supper. I do my homework after supper. I usually go to bed at 10 p.m.*
VOCABULARY: household chores – Aufgaben im Haushalt; assembly – Versammlung
(Small table on bottom left of the paragraph)
| 4 a.m. | Grace wakes up |
 | 6.30 a.m. | |
 | 7.30 a.m. | |
 | 3.30 p.m. | |
 | 10 p.m. | |
SPEAKING
 Talking about your daily routine
4 Work in pairs. Talk about your daily routines.
Speech bubble:
I wake up at … I go to school at …
Page 10–11
READING
5 Read through the story quickly and answer the questions.
Who are Jenny and Danielle?
Where are they?
Where were they?
Snake adventures
It was the first day back to school, and Jenny saw her best friend Danielle. They said hello and walked to school together.
 “How was your summer, Danielle?” asked Jenny.
 “Oh, it was OK,” said Danielle. “We went to France and stayed in Paris. We went to Disneyland! It was amazing, but there were too many people. I didn’t like it. And I didn’t like the food there!”
 “Wow, that’s amazing! I love Disneyland,” said Jenny. “My family and I had a scary holiday.”
 “You did?” asked Danielle.
 “Oh yes. My brother works in Mexico! So, we all went to see him. My dad, my mum, my grandmother and I,” said Jenny. “We went to Chichen Itza!”
 “Is that a beach?” asked Danielle.
 “No, it’s an old city in Mexico. There’s a pyramid. It’s a temple to the Mayan god Kukulkan – a snake god. It’s over 1,500 years old!” said Jenny.
 “Wow, that’s amazing.”
“Yes, and the pyramid has 365 steps, one for every day of the year. It’s like a big calendar. And my brother told us that twice a year, the snake god comes down the steps!” said Jenny.
 “What? That can’t be true!” said Danielle.
 “It is! In the spring and summer, the shadows of the steps look like a huge snake moving down!” said Jenny.
 “I want to see that!” said Danielle.
 “Yes, but ... I hate scary things! And there were lots of strange statues around the temple. It was really scary. And then we walked near the jungle. I sat down on a stone and my brother shouted: ‘There’s a snake on your shoe!’ I didn’t believe him, and I threw my water in his face,” Jenny laughed.
 “And then what?” asked Danielle.
 “It wasn’t a joke!” – There was a snake on my foot!”
“Oh no!”
 “Yes, it was a milk snake! He picked it up and put it back in the forest!” said Jenny.
 “Wow. Your brother was very brave,” said Danielle.
 “Not really ... milk snakes aren’t dangerous at all. But I’m very happy there aren’t any snakes at school! Come on, let’s go.”
VOCABULARY: brave – mutig
(Image description: On the left is an illustration of two girls walking toward a school, one holding a book with a snake on it. Above them is an image of a stepped pyramid with the words "shadow" and "steps" indicating where the shadows fall. To the left are Mayan-style illustrations including a carved face and a stylized snake.)
6 How many of these tasks can you do?
Circle T (True) or F (False).
It’s the last day of the school year. T / F
Jenny and Danielle are best friends. T / F
Danielle went to Disneyland, Florida. T / F
Choose the correct answer.
How many people of Jenny’s family were in Chichen Itza?
 ☐ three ☐ five ☐ seven
What is in Chichen Itza?
 ☐ a beach ☐ a city ☐ a temple
How many steps does the pyramid have?
 ☐ 1,500 ☐ 1,000 ☐ 365
Answer the questions.
What looks like a moving snake?
 .....................................................
How did Jenny’s brother help her?
 .....................................................
Why is Jenny happy about her school?
 .....................................................
7 Check your answers with a partner. Then listen to the story.
READING
8 a Quickly read the extract from a tourist leaflet about Chichen Itza, the place that Jenny visited. Answer the question.
 How do we know that Chichen Itza is well-liked with tourists?
b Read the text again and discuss the questions in pairs.
Why do you think many people want to visit Chichen Itza?
Why might other people maybe not want to come to the place?
What about you? Would you like to visit a place like that? Why (not)?
How many reasons can you think of why people should be careful in the forests?
VOCABULARY:
 shadow – Schatten;
 It’s not for the faint-hearted – Es ist nichts für schwache Nerven;
 local – ortsansässig, einheimisch
TRAVEL MEXICO
Welcome to beautiful CHICHEN ITZA!
This is a very popular tourist attraction in Mexico, in fact more than two million people come here every year.
 You should be one of them – it’s an amazing place.
Chichen Itza is a Mayan city and is over 1,500 years old. It is very important in the history of Mexico. And, of course, it is the home of the snake god Kukulkan, who visits twice a year! In March and September the shadows make his amazing shape move down the side of the pyramid! Wow!
Come and visit Chichen Itza and see for yourself what the ancient people (and the snake) were – it’s not for the faint-hearted*, but be careful when you take a walk in the forests around the pyramid.
Join us for an amazing tour of this special place – with the best local guides. Contact us to book today!*
 📧 tourist@travelmexico.com
(Image description: The right page includes a photo of the Chichen Itza pyramid, bright blue skies, and a text box pointing out “Kukulkan” – the snake god – in the image. Below is the promotional text for the tourist attraction.)
Page 12–13
9 Read the text about milk and coral snakes. Would the rhyme below always help you to tell the difference between the two snakes? Why (not)?
Milk snakes and coral snakes – what’s the difference?
Most people think that coral snakes and milk snakes look the same. But there is a difference, and if you are going to visit a country in Central America, you should know what it is.
How can you tell the difference between them? You have to look at the colour of their stripes. Milk snakes are red, black and yellow. They are not dangerous, so don’t worry! But coral snakes are very dangerous, and they are usually red, yellow and black too. The trick is to look at the order of the colours!
People say you should remember this:
 “Red touching black – you’re OK, Jack.
 Red touching yellow – can kill a fellow!”
But to make things even more complicated – in some areas, the colour patterns* on milk snakes and coral snakes are different, so the rhyme above would not help you in those areas! So here’s some good advice – if you see a snake with such colours, you should leave it alone!
VOCABULARY: fellow – Kerl, Freund; Typ, pattern – Muster, Struktur
(Image description: Two photographs showing the difference between a milk snake and a coral snake. The milk snake has red bands bordered by black, while the coral snake has red bands bordered by yellow.)
10 How much can you remember about the texts on pages 11 and 12? Complete the questions with the question words in the box. Then write the answers to the questions.
Question words in the box:
 How What What Where When How
____________ is Chichen Itza?
____________ many people come to Chichen Itza every year?
____________ old is Chichen Itza?
____________ does the snake god come to Chichen Itza?
____________ snakes are very colourful?
____________ snakes are very dangerous?
11 Listen to the poem. Then read it. What snake is it?
I sleep all day and work at night, that is what I do.
 Don’t touch me when I’m asleep, or I might not like you.
My lovely skin is red and black, and it is yellow too.
 You might think that I’m dangerous, but that is just not true.
I wake up when the sun goes down, and start to move around.
 I crawl around the rocks and stones, and slide* along the ground.
It’s nice and cool here in the dark, and no one can hear me.
 The rats and mice think they’re safe, because I’m not hungry.
I just slide around on the ground, and then I take a rest.
 The other snakes think they’re good, but I know I’m the best!
VOCABULARY: slide – gleiten
(Image description: Illustrated scene showing the snake from the poem crawling at night through forest undergrowth and among stones, with other snakes and animals in the background.)
VOCABULARY
 School subjects
12 Listen and number the school subjects. Say which subject you like best.
(Image shows 10 cartoon children doing different school-related activities. The school subjects are displayed with circles next to each one to write numbers.)
English
maths
music
physical education (PE)
science
design and technology
French
geography
history
art
information technology (IT)
LISTENING & SPEAKING
 Talking about a timetable
13 Oliver is from England. Here is his timetable. Listen and complete.
Time	Monday	Tuesday	Wednesday	Thursday	Friday
9 – 9.55 a.m.	English	maths	science	French	1 __________
10 – 10.55	English	history	science	2 ________	IT
BREAK					
11.15 – 12.10	design and technology	4 __________	maths	5 ________	history
LUNCH					
1 – 1.55 p.m.	maths	science	7 ________	English	12 _________
2 – 2.55	art	French		10 _______	English
3 – 3.55	5 ____________			music	geography

14 Look at your timetable and talk about it with a partner.
Speech bubbles:
“On Mondays we have … in the morning.”
“In the afternoon …”
“I (don’t) like …”
“… is my favourite subject.”
“After the break we’ve got …”
(Image description: Two students pointing at a timetable and talking. One is a boy wearing a white T-shirt, the other is a girl in a black hoodie holding a timetable.)
Page 13–14
WRITING
 15 CHOICES
Tricia is from Brighton in the UK. Read her email to you.
A
 Write an email answer to Tricia (50–60 words). Tell her about your holidays.
 Write about:
the place (I was in … / We went to …)
who was with you (My parents, my …)
what the weather was like (It was sunny / …)
how good it was (The holidays were good / …)
(Email box graphic with a photo of a smiling girl in the top-right corner)
From: tricia_p05@mailconnect.com
 Subject: My summer holidays
Hi,
 This year, my family stayed at home. I got up late every day. In the mornings, I usually watched TV. After lunch, I played volleyball or went swimming. In the evenings, I played games on my computer.
 I sometimes went to the cinema. It was the perfect holiday.
 Bye,
 Tricia
B
 Write your answer to Tricia (70–80 words). Tell her:
where you went
who you went with
how long you stayed
what you did all day
who you met
what interesting things you did
why you enjoyed / didn’t enjoy your holidays
GRAMMAR
▶️ Present simple (revision)
Du verwendest das Present simple, um über Tatsachen und Gewohnheiten zu sprechen.
The milk snake eats mice and rats.
 They have beautiful red, yellow and black skin.
 They sleep in the day and hunt at night.
I do my homework after supper.
 Our first lesson starts at 7.30 a.m.
 I don’t believe you.
▶️ Past simple (revision)
Mithilfe des Past simple berichtest du über Ereignisse und Situationen in der Vergangenheit.
Bei regelmäßigen Verben (regular verbs) hängst du ein -ed an das Verb:
 walk – On Monday, they walked to school.
 pick – He picked the snake up.
Einige Verben haben unregelmäßige Formen im Past simple:
 go – We went to Disneyland in Paris.
 sit – I sat down on a stone.
 say – They said hello and walked to school together.
 have – My family and I had a scary holiday.
 put – I picked the snake up and put it back in the forest.
 do – Tell me what you did.
 swim – I swam a lot.
📘 Now go back to page 8. Check ✅ with a partner what you know / can do.
Page 15
OUR YOUNG WORLD 1
 ▶️ Luna’s ‘Call to action!’
▶️ 1 Watch the video. What’s the new rule about the school uniform for girls at Luna’s school?
........................................................................................................................
▶️ 2 Watch again and answer the questions.
Is Luna happy back at school?
  ........................................................................................................................
What can’t girls wear at school?
  ........................................................................................................................
What can boys wear at school?
  ........................................................................................................................
What did the boys do?
  ........................................................................................................................
Who voted on* the new rule?
  ........................................................................................................................
What was the result?
  ........................................................................................................................
VOCABULARY: vote on sth. – für etw. stimmen
FIND OUT
 Democracy
3 Match the questions with the answers.
What is democracy?
What is another way of making rules?
What is freedom of speech?
☐ You can say what you really think.
 ☐ A king, queen or person can make the rules.
 ☐ Everyone can vote on the rules.
Our local world
💬 4 Discuss in pairs. How bad are the problems in your area? Rank the problems below:
 (1 = terrible!, 2 = bad!, 3 = not a problem!)
☐ rubbish in the street
 ☐ no parks
 ☐ speeding cars
 ☐ no sports centre
 ☐ no bicycle lanes
 ☐ no trees
 ☐ noisy people
 ☐ dangerous animals
(Image description: Photo of an overflowing bin surrounded by litter and bags in front of a fence, illustrating local pollution.)
CYBER PROJECT: Our call to action
5 Work in groups. Choose one of the problems in 4 or think of one of your own. Produce a short video to present to the class. In your video, include:
what the problem is
what you and your group think about it
interviews with members of your group
ideas for new rules to fix the problem
the results of a group vote


----- WB: More 2 WB Unit 1.txt -----
UNIT 1 First day back at school
Pages 4–5
UNDERSTANDING VOCABULARY
School subjects
1 Choose the correct school subject.
(Blackboard with maths equations: 2(4+1)=3y, 8y+2=3z, 5y=2, y=…)
 → design and technology / French / maths
(Drawing tools: ruler, pencil, triangle, paper with sketches)
 → geography / design and technology / art
(Boy looking at green leaves on a tree; science experiment setting)
 → science / art / French
(Blackboard says "1939–1945 World War II")
 → music / English / history
(Board says “Bonjour! Comment ça va?”)
 → French / English / science
(Map of the world on a whiteboard)
 → IT / science / geography
(Sheet music with musical notes)
 → music / history / PE
(Board shows “I am, you are, he/she/it is…”)
 → art / maths / English
(Board with chemical equation: 2H₂ + O₂ = 2H₂O)
 → science / IT / maths
(Girl hitting a volleyball in a gym)
 → geography / history / PE
(Board with computer terms: "READY: GRAPHICS 04")
 → maths / history / IT
USING VOCABULARY
School subjects
2 Complete the timetable with the correct school subjects.
Timetable table:
Time	Monday	Tuesday	Wednesday	Thursday	Friday
9–9.55 a.m.	💻 (IT)	🌍 (Geography)	🧪 (Science)	💻 (IT)	🌍 (Geography)
10–10.55	🇬🇧 (English)	🇬🇧 (English)	✏️ (Art)	🇫🇷 (French)	🇫🇷 (French)
BREAK					
11.15–12.10	❎ (Maths)	❎ (Maths)	🇬🇧 (English)	❎ (Maths)	🇬🇧 (English)
LUNCH					
1–1.55 p.m.	🏃 (PE)	🎵 (Music)	🔺 (Maths)	🎵 (Music)	🌍 (Geography)
2–2.55					
3–3.55					

3 Who has got what on Monday at 1 o’clock?
Names and Subjects:
Mona → maths
Oliver → geography
Lina → history
Elena → French
Gabriel → PE
Bilal → design and technology
Line matching puzzle illustration connects names to subjects.
Example sentence:
Mona has got maths on Monday at 1 o’clock.
4 What subject do you have? Write a sentence for each day.
On Mondays I have ..............................................................
On Tuesdays I ..............................................................
On Wednesdays ..............................................................
On Thursdays ..............................................................
On ..............................................................
5 What is your best/worst day of the week at school? Write a sentence to say why.
.......................................................................................................................
.......................................................................................................................
Pages 6–7
UNDERSTANDING GRAMMAR
Present simple (revision)
6 Write short answers.
Does Jane play tennis on Tuesday afternoons? (✓)
   → Yes, she does.
Does she go to bed early on Friday evenings? (✗)
   → No, she doesn’t.
Does she often go shopping with her mum at the weekend? (✓)
   → ...............................................................
Does she go to school on Sundays? (✗)
   → ...............................................................
Does she go skating on Saturday afternoons? (✓)
   → ...............................................................
Does she watch TV every evening? (✓)
   → ...............................................................
Does she like pizza and chips? (✗)
   → ...............................................................
Does she phone her best friend every day? (✓)
   → ...............................................................
USING GRAMMAR
Present simple (revision)
7 Complete the questions.
Interviewer: Where do you find a coral snake?
 Expert: You can find it in North and South America.
Interviewer: How many .............................................................?
 Expert: It hasn’t got any legs. It’s a snake!
Interviewer: What .............................................................?
 Expert: It’s red, yellow and black.
Interviewer: What .............................................................?
 Expert: It eats insects and small animals.
Interviewer: Is .............................................................?
 Expert: Yes, it is. Its poison* can kill a man.
Interviewer: Where .............................................................?
 Expert: They usually live underground* and only come out when it rains.
VOCABULARY: *poison = Gift; underground = unter der Erde
8 Complete the sentences with your own ideas.
I never play computer games after school. (never / play)
My best friend ............................................................. (always / phone)
My mum ............................................................. (usually / go)
I ............................................................. (sometimes / watch)
I ............................................................. (often / listen)
My dad ............................................................. (never / do)
UNDERSTANDING GRAMMAR
Past simple (revision)
9 Match the pictures with the sentences.
 My holidays
Image descriptions:
 1 – Girl watching TV in the morning
 2 – Girl playing computer games
 3 – Girl reading a book
 4 – Girl playing beach volleyball
 5 – Girl going to the cinema
 6 – Girl looking tired
Sentences (to match with pictures):
 ☐ In the morning, I watched TV.
 ☐ At lunchtime, I played computer games.
 ☐ In the afternoon, I played beach volleyball.
 ☐ In the evening, I went to the cinema.
 ☐ And after the cinema, I read a book.
 ☐ After my holidays, I was really tired.
USING GRAMMAR
Past simple (revision)
10 Find the verbs in the word snake and write them in the past simple.
Word snake:
 sitholdremembermeetgollovereadtakerunput
sit → sat
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
................................... → ...................................
11 Use some of the verbs in 10 in the past simple to complete the sentences.
When I was young, I ............................................................. my mum’s hand all the way to school.
I ............................................................. my little sister to the cinema last night.
We were late, so we ............................................................. for the school bus this morning.
I’m sure I ............................................................. my homework in my school bag last night. So where is it now?
The film was really long. We ............................................................. in the cinema for three hours!
Our family ............................................................. to Jamaica on holiday this year.
My sister ............................................................. King Charles III last year.
I ............................................................. the TV show Bob the Builder when I was a little kid.
Pages 8–9
12 Complete the text with the past simple form of the verbs in brackets.
🟠 The shell on the beach*
 (Image: a close-up photo of a blue-ringed octopus)
I ¹.................. (see) a really nice shell on the beach. I ².................. (pick) it up because I ³.................. (want) to show it to Mum.
 “Oh Michael,” Mum ⁴.................. (say), “that looks lovely. What a nice shell.”
 “And it’s got something blue and yellow inside. Do you want to see it?” I said.
 Suddenly, my sister Sara ⁵.................. (shout): “Don’t touch it.”
 “Ouch!” I ⁶.................. (say). “What’s wrong?”
“Sara!” Mum ⁷.................. (say). “Leave Michael alone.” But look!”
 Sara ⁸.................. (shout), and ⁹.................. (point) at the nice shell.
 “There’s a blue-ringed octopus inside. It can kill you!”
 “There, lying in the sand,” I ¹⁰.................. (be) a little octopus. It ¹¹.................. (look) nice, but Mum ¹².................. (say), “Don’t touch it!” And she ¹³.................. (hug) me and then she ¹⁴.................. (hug) Sara.
VOCABULARY: *shell = Muschel; blue-ringed octopus = Blau­ring-Oktopus
WRITING
Writing about a past holiday/weekend
13 Write sentences about Olivia’s holiday last month.
(Images in boxes labeled 1–6 show:
museum, 2. girl seeing animal in zoo, 3. girl at beach, 4. girl swimming, 5. friends playing, 6. friends talking, 7. girl enjoying food)
Olivia went to a museum.
............................................................
............................................................
............................................................
............................................................
............................................................
............................................................
14 CHOICES
A Use the notes to write a short text about what Samuel did last Saturday.
Saturday
 Morning: got up late / watch TV / lunch
 Afternoon: football match with Dad
 Evening: dinner in restaurant / bed late
✏️ Last Saturday, Samuel got up late – at 11 a.m.! Then …
B Make notes of eight things you did last Saturday or Sunday. Write a short email about your day to an English-speaking friend (60–80 words).
READING
Understanding people talking about daily routines
15 Read the texts. How many of the tasks below can you do?
📍Fatih (Türkiye)
 Hi, my name’s Fatih. I’m twelve and I’ve got two sisters and two brothers. I live in a village about 50 kilometres from Istanbul. My favourite food is Lahmacun. It’s like pizza. I like video games and nature programmes. I also play football and I swim a lot. With my pocket money (it’s not much!) I buy sweets. I don’t have a pet, because my mum doesn’t like animals.
📍Clare (Scotland)
 Hi, I’m Clare. I live in Dundee in Scotland. I’m twelve. I’ve got one brother. He’s 21 and he works in Edinburgh. My favourite food is chicken. And I also like chocolate a lot! My friend Moira and I often go to the park (we’re skateboarders) and in the evenings we watch TV together. We like sitcoms best. I really like books (Moira doesn’t, she doesn’t want to read the Harry Potter books) and horses. I’ve got two pets – a cat and a guinea pig.
📍Justyna (Poland)
 Hi, I’m Justyna. I live in Krakow and I’ve got two little brothers. I’m thirteen and my brothers are five and eight. My favourite food is fish, but we don’t eat it very often. I play handball in our school team and I’m also in the swimming team. I love the cinema. A lot of films are in English. That’s good for me. I can listen to English a lot. I buy magazines with my pocket money.
 I haven’t got a pet.
📍Sean (Ireland)
 Hi, I’m Sean. I’m from Sligo in Ireland. I live on a farm and I really like animals. We’ve got lots of animals, but I don’t have a real pet. We’ve got six horses and I really like horse-riding. I also like computer games. I often help at home. My dad gives me money for doing that. I buy computer games with the money. My favourite food is pizza.
1 Fatih has got four sisters. T / F
 2 Lahmacun is a type of food. T / F
 3 Fatih gets a lot of pocket money. T / F
4 ............................................................ is 21 years old.
 5 Clare and Moira go ............................................................ in the park.
 6 Justyna is in the school team for ............................................................
 7 What are Justyna’s hobbies?
  → ............................................................
 8 Why does Sean’s family have room for six horses?
  → ............................................................
 9 What does Sean spend his money on?
  → ............................................................
16 🔊 Listen and check your answers.
Pages 10–11
LISTENING & DIALOGUE WORK
Talking about a timetable
17 a 🔊 Listen to Faye talking about her timetable and write the subjects.
Monday	...............	BREAK	...............	LUNCH	...............	...............
Tuesday	...............	BREAK	...............	LUNCH	...............	...............

VOCABULARY: drama club = Theatergruppe
b 🔊 Listen again and answer the questions.
What is Faye’s favourite subject?
 ........................................................................................................................
How long is break?
 ........................................................................................................................
How long is lunch?
 ........................................................................................................................
What does Faye eat for lunch?
 ........................................................................................................................
What are her worst subjects?
 ........................................................................................................................
What’s her favourite day?
 ........................................................................................................................
What does she do in PE?
 ........................................................................................................................
18 CHOICES
A ✅ Put the dialogue in the correct order. Then listen and check.
☐ Interviewer Maths? Interesting. How many maths lessons do you have a week?
 ☐ Interviewer So that’s four lessons a week.
 ☐ Interviewer What’s your favourite school subject, Tony?
 ☐ Interviewer Every day! It’s lucky you like maths then.
 ☐ Tony Yes, four. That’s right.
 ☐ Tony I really like maths.
 ☐ Tony Actually, I’m wrong. We don’t have maths on Tuesdays.
 ☐ Tony We have maths every day, I think.
B Complete the questions.
Interviewer What’s ................................................................. Mia?
 Mia English. I love it.
Interviewer How many .................................................................?
 Mia We have three lessons a week.
Interviewer What .................................................................?
 Mia We have English lessons on Mondays, Tuesdays and Fridays.
Interviewer How .................................................................?
 Mia Each lesson is an hour long.
Interviewer And .................................................................?
 Mia My worst subject is biology*. I really don’t like it.
VOCABULARY: biology = Biologie
WORD FILE
School subjects
 (Images of children representing different school subjects: English, French, music, maths, geography, science, physical education (PE), art, history, information technology (IT), design and technology)
MORE Words and Phrases
glad
  I was glad to stay at home. → froh
kilometre
  My school’s one kilometre from my house. → Kilometer
to stay at home
  Are you going to stay at home? → zu Hause bleiben
to travel
  Did you travel far? → reisen
as soon as
  I do my homework as soon as I get home. → sobald (wie)
to get dressed
  I get dressed at 7.45. → sich anziehen
to go for a walk
  I go for a walk with my dog. → spazieren gehen
lesson
  Our first lesson starts at 7.30 a.m. → Unterrichtsstunde
to prepare
  I help my mum to prepare food for our supper. → (zu-)bereiten
to put on
  After breakfast, I put on my school uniform. → anziehen (Kleidung)
supper
  I do my homework after supper. → Abendessen
daily
  My daily routine starts when I get up in the morning. → täglich
calendar
  It’s like a big calendar. → Kalender
grandmother
  My grandmother lives in Mexico. → Großmutter
joke
  It wasn’t a joke. → Witz
scary
  My family and I had a scary holiday. → furchterregend, unheimlich
spring
  In the spring and summer, the shadows of the steps look like a huge snake. → Frühling
area
  There are lots of animals in the area. → Gebiet, Region
to book
  You can book your holiday today. → buchen
popular
  Chichen Itza is a popular tourist attraction. → beliebt
shadow
  You can see a shadow move down the side of the pyramid steps. → Schatten
to visit
  A lot of tourists visit the Mayan city of Chichen Itza. → besichtigen
colourful
  There are many colourful parrots at the zoo. → bunt, farbenfroh
along
  Snakes slide along the sand. → entlang
to crawl
  Snakes crawl around and into stones. → kriechen
to take a rest
  I take a rest after school. → sich ausruhen
(school) subject
  English is my favourite subject. → (Schul-)Fach
break
  After the break, we have history. → Pause
timetable
  She has four English lessons in her timetable. → Stundenplan
bicycle lane
  There’s a new bicycle lane in my town. → Radweg
king
  A king can make the rules. → König
noisy
  I don’t like noisy people. → laut, geräuschvoll
queen
  A queen can make the rules. → Königin
rubbish
  A big problem in our area is rubbish in the street. → Müll, Abfal

```

## Output contract

Write `content/corpus/units/g2-u01/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u01",
  "briefBank": "d2d12476b358",
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
