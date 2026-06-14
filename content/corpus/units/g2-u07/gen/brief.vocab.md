# Vocab generation brief — g2-u07 (MORE! 2, Unit 7)

<!-- domigo:gen vocab g2-u07 bank=1fd181b8d7a9 prompt=346902f9f0f1 -->

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
| g2u07.w.to-do-nothing | to do nothing | nichts tun | wordfile | Activities | — | do nothing | to do nothing ; do nothing |
| g2u07.w.to-play-basketball | to play basketball | Basketball spielen | wordfile | Activities | — | play basketball | to play basketball ; play basketball |
| g2u07.w.to-stay-at-a-friend-s-house | to stay at a friend's house | bei einem Freund übernachten | wordfile | Activities | — | stay at a friend's house | to stay at a friend's house ; stay at a friend's house |
| g2u07.w.to-tidy-your-room | to tidy your room | dein Zimmer aufräumen | wordfile | Activities | — | tidy your room | to tidy your room ; tidy your room |
| g2u07.w.to-have-a-party | to have a party | eine Party machen | wordfile | Activities | — | have a party | to have a party ; have a party |
| g2u07.w.to-do-the-shopping | to do the shopping | einkaufen gehen | wordfile | Activities | — | do the shopping | to do the shopping ; do the shopping |
| g2u07.w.to-do-your-homework | to do your homework | Hausaufgaben machen | wordfile | Activities | — | do your homework | to do your homework ; do your homework |
| g2u07.w.to-watch-a-film | to watch a film | einen Film schauen | wordfile | Activities | — | watch a film | to watch a film ; watch a film |
| g2u07.w.honestly | honestly | ehrlich ; wirklich | phrase | — | Honestly, that was only a joke! | — | honestly |
| g2u07.w.instead | instead | stattdessen | phrase | — | I don't want to tidy my room. I'm going to do nothing instead. | — | instead |
| g2u07.w.to-take-it-easy | to take it easy | sich entspannen | phrase | — | I'm very tired. I'm going to take it easy this afternoon. | take it easy | to take it easy ; take it easy |
| g2u07.w.to-be-ashamed | to be ashamed | sich schämen | phrase | — | I was very ashamed. | be ashamed | to be ashamed ; be ashamed |
| g2u07.w.to-come-over | to come over | vorbeikommen | phrase | — | She isn't going to come over today. | come over | to come over ; come over |
| g2u07.w.communication | communication | Kommunikation | phrase | — | There are many types of communication. | — | communication |
| g2u07.w.excuse | excuse | Ausrede | phrase | — | There's no excuse. | — | excuse |
| g2u07.w.group-chat | group chat | Gruppenchat | phrase | — | My friends and I have a group chat. | — | group chat |
| g2u07.w.social-media | social media | soziale Medien | phrase | — | I'm writing a social media post. | — | social media |
| g2u07.w.to-tell-a-lie | to tell a lie | lügen | phrase | — | Don't tell me a lie. I know it was you! | tell a lie | to tell a lie ; tell a lie |
| g2u07.w.truth | truth | Wahrheit | phrase | — | I didn't tell her the truth. | — | truth |
| g2u07.w.to-be-worried | to be worried | besorgt sein | phrase | — | William is always worried. | be worried | to be worried ; be worried |
| g2u07.w.to-crash | to crash | einen Unfall bauen ; gegen etw. fahren | phrase | — | Be careful or you might crash. | crash | to crash ; crash |
| g2u07.w.to-get-into-trouble | to get into trouble | in Schwierigkeiten geraten ; Ärger bekommen | phrase | — | I might get into trouble if I do that. | get into trouble | to get into trouble ; get into trouble |
| g2u07.w.fancy-dress-party | fancy dress party | Kostümparty | phrase | — | My friend invited me to a fancy dress party. | — | fancy dress party |
| g2u07.w.disappointment | disappointment | Enttäuschung | phrase | — | She showed her disappointment. | — | disappointment |
| g2u07.w.german | German | Deutsch | phrase | — | How do you say this in German? | — | German |
| g2u07.w.row | row | (Sitz-)Reihe | phrase | — | Can we have tickets for row 12, please? | — | row |
| g2u07.w.sold-out | sold out | ausverkauft | phrase | — | The concert is sold out. | — | sold out |
| g2u07.w.that-s-a-pity | That's a pity. | Das ist schade! | phrase | — | There's only one ticket for the 5 o'clock showing. That's a pity! | — | That's a pity. |
| g2u07.w.ticket | ticket | Eintrittskarte ; Ticket | phrase | — | Can I have two tickets, please? | — | ticket |
| g2u07.w.what-a-shame | What a shame! | Wie schade! | phrase | — | The concert is sold out. What a shame! | — | What a shame! |

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
- **g2-u02**: to organise, surprise party, admission fee, artist, exhibition, dirty, modern, museum, to be part of, sculpture, to be worth, What's the matter?, anyone, behaviour, to contact, mess, to pass on, password, to post, posting, such, tip, possible, awesome, boring, confusing, difficult, exciting, funny, embarrassed, plate, secret, upset, to add, to fail, I promise.
- **g2-u03**: witch, ghost, pumpkin bucket, vampire, trick or treat, apple bobbing, mask, tradition, to fear, to cut off, front window, to keep, to be proud (of), stairs, sticker, sweets, Trick or treat!, knife (pl knives), century, costume, couldn't, cute, dress, graveyard, myself, shall, sick, superheroine, wild, to scare, cycle helmet, guys, to lose, picnic
- **g2-u04**: mosquito, pigeon, parrot, ostrich, chimpanzee, antelope, bat, giraffe, rhino, cheetah, anaconda, crocodile, dolphin, whale, shark, (two days) ago, farmer, human, incredible, dangerous, hairy, heavy, strong, climate change, fast, female, male, nobody, scientist, to die out, less, to carry, centimetre, desert, to die, mammal, ton, venomous, to weigh, length, speed, intelligent, reason, to share, luck, powerful, smart, truck, forever, to protect
- **g2-u05**: cinema, church, bank, restaurant, railway station, chemist's, tourist office, music shop, post office, supermarket, hospital, police station, to go past, to go straight ahead, to cross the street, to turn left, to take the second right, round the corner, as far as, opposite, next to, to cross, map, second, to go straight on, airport, to change trains, most of the time, pocket, slow, somewhere, underground, market square, simply, comment, to comment, feedback, guest, to offer, opening, positive, review, the worst, to bother, bus stop, fountain, to interrupt, politely, traffic lights
- **g2-u06**: sun, sea, beach, town, motorway, road, river, village, field, hill, valley, lake, forest, mountains, stars, moon, to build a tree house, camp, life jacket, guide, campfire, picnic, canoe, canoeing, waterfall, rock climbing, bottom, left-hand, middle, right-hand, anorak, hard hat, absolutely, actually, adventure camp, to be afraid (of), although, to care, drive, gate, to be good at sth., once upon a time, sheep (pl sheep), shepherd, to trust, while, to wash up, alive, cry, I'm off now., Poor you!
- **g2-u07**: to do nothing, to play basketball, to stay at a friend's house, to tidy your room, to have a party, to do the shopping, to do your homework, to watch a film, honestly, instead, to take it easy, to be ashamed, to come over, communication, excuse, group chat, social media, to tell a lie, truth, to be worried, to crash, to get into trouble, fancy dress party, disappointment, German, row, sold out, That's a pity., ticket, What a shame!

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imagine, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u07.w.to-do-nothing` ← v1 `to do nothing`: d="To not do anything at all, just rest" · s="On Sunday I want to _____ — not homework, not chores, just total laziness for once." · a=["do nothing","does nothing","did nothing"] · mc=["to take it easy","to relax","to stay at home"]
- `g2u07.w.to-play-basketball` ← v1 `to play basketball`: d="To take part in a game where you throw a ball into a high net" · s="I _____ with my friends — we throw the ball into the hoop." · a=["play basketball","plays basketball","played basketball"] · mc=["to play football","to play volleyball","to play tennis"]
- `g2u07.w.to-stay-at-a-friend-s-house` ← v1 `to stay at a friend's house`: d="To sleep at your friend's home for one night or more" · s="Can I _____ on Friday night? I will sleep there and come home Saturday." · a=["stay at a friend's house","stayed at a friend's house"] · mc=["to come over","to visit","to go out"]
- `g2u07.w.to-tidy-your-room` ← v1 `to tidy your room`: d="To make your room clean and neat" · s="Mum says I must _____ right now — my clothes are on the floor and my toys are on the bed." · a=["tidy your room","tidy my room","tidy his room","tidy her room","tidied my room"] · mc=["to lock your room","to paint your room","to leave your room"]
- `g2u07.w.to-have-a-party` ← v1 `to have a party`: d="To get friends together to celebrate or have fun" · s="We are going to _____ with cake, balloons and games for my birthday." · a=["have a party","has a party","had a party"] · mc=["to go to a party","to organise","to celebrate"]
- `g2u07.w.to-do-the-shopping` ← v1 `to do the shopping`: d="To go to the shop and buy things you need" · s="My mum always _____ at the supermarket on Saturday morning." · a=["do the shopping","does the shopping","did the shopping"] · mc=["to go to the supermarket","to buy groceries","to order online"]
- `g2u07.w.to-do-your-homework` ← v1 `to do your homework`: d="To finish the school work your teacher gave you" · s="I always _____ right after school before I play outside." · a=["do your homework","do my homework","does his homework","did my homework"] · mc=["to play games","to watch TV","to take a nap"]
- `g2u07.w.to-watch-a-film` ← v1 `to watch a film`: d="To look at a movie on TV or at the cinema" · s="We are going to _____ on the sofa tonight. It's a new comedy with our favourite actors." · a=["watch a film","watches a film","watched a film"] · mc=["to listen to music","to read a book","to play a game"]
- `g2u07.w.honestly` ← v1 `honestly`: d="In a true way, not telling lies" · s="_____, I did not eat the last biscuit! I am telling you the truth." · a=["honestly"] · mc=["maybe","sometimes","possibly"]
- `g2u07.w.instead` ← v1 `instead`: d="In place of something, as another choice" · s="I don't want tea. Can I have juice _____?" · a=[] · mc=["never","otherwise","however"]
- `g2u07.w.to-take-it-easy` ← v1 `to take it easy`: d="To rest and not do hard work" · s="You worked so hard today. Now just _____ on the sofa with a cup of tea and relax a bit." · a=["take it easy","takes it easy","took it easy"] · mc=["to work more","to study","to clean"]
- `g2u07.w.to-be-ashamed` ← v1 `to be ashamed`: d="To feel bad because you did something wrong or silly" · s="He was very _____ after he broke the window. He looked at the ground and could not say a word." · a=["be ashamed","ashamed"] · mc=["to be proud","to be happy","to be glad"]
- `g2u07.w.to-come-over` ← v1 `to come over`: d="To visit someone at their home" · s="Do you want to _____ to my house after school and play video games together?" · a=["come over","comes over","came over"] · mc=["to run away","to stay home","to disappear"]
- `g2u07.w.communication` ← v1 `communication`: d="When people talk or write to each other" · s="Good _____ is important between friends so they understand each other." · a=[] · mc=["silence","competition","distance"]
- `g2u07.w.excuse` ← v1 `excuse`: d="A reason you give for something bad you did" · s="That is not a good _____ for being late. 'I woke up late' is not a real reason." · a=["excuses"] · mc=["time","day","place"]
- `g2u07.w.group-chat` ← v1 `group chat`: d="A place online where many friends talk together" · s="We have a _____ for our class on the phone." · a=["group chat","group chats"] · mc=["social media","email","video call"]
- `g2u07.w.social-media` ← v1 `social media`: d="Apps and websites where people share photos and messages" · s="Many young people spend a lot of time on _____." · a=["social media"] · mc=["group chat","website","blog"]
- `g2u07.w.to-tell-a-lie` ← v1 `to tell a lie`: d="To say something that is not true" · s="You should never _____. Always say the truth." · a=["tell a lie","told a lie","tells a lie"] · mc=["to tell the truth","to make up","to cheat"]
- `g2u07.w.truth` ← v1 `truth`: d="What is real and not made up" · s="Please tell me the _____. Don't lie to me about what happened." · a=[] · mc=["story","joke","news"]
- `g2u07.w.to-be-worried` ← v1 `to be worried`: d="To feel that something bad might happen" · s="Mum was _____ because I came home late — she thought something bad happened." · a=["be worried","worried"] · mc=["happy","proud","glad"]
- `g2u07.w.to-crash` ← v1 `to crash`: d="To hit something hard, often by accident" · s="The bike went too fast and _____ straight into the wall with a loud bang. The boy fell off." · a=["crash","crashes","crashed"] · mc=["to stop","to fly","to jump"]
- `g2u07.w.to-get-into-trouble` ← v1 `to get into trouble`: d="To do something that makes you get punished" · s="If you don't listen to the teacher, you will _____ and get detention." · a=["get into trouble","got into trouble","gets into trouble"] · mc=["to have fun","to get a prize","to make friends"]
- `g2u07.w.fancy-dress-party` ← v1 `fancy dress party`: d="A party where everyone wears special clothes to look different" · s="I wore a pirate hat and an eye patch to the _____ and my friend came as a ghost." · a=["fancy dress party","fancy dress parties"] · mc=["wedding","concert","meeting"]
- `g2u07.w.disappointment` ← v1 `disappointment`: d="The sad feeling when something is not as good as you hoped" · s="Her face showed _____ when the trip was cancelled. She had looked forward to it for months." · a=[] · mc=["joy","excitement","happiness"]
- `g2u07.w.german` ← v1 `German`: d="The language people speak in Austria and Germany" · s="My mother tongue is _____ because I grew up in Vienna." · a=[] · mc=["English","French","Italian"]
- `g2u07.w.row` ← v1 `row`: d="A line of seats or people next to each other" · s="We sat in the front _____ at the cinema." · a=["rows"] · mc=["seat","column","line"]
- `g2u07.w.sold-out` ← v1 `sold out`: d="When there is nothing left to buy because everything is gone" · s="The concert tickets are all _____. There are no more." · a=["sold out"] · mc=["available","fully booked","on sale"]
- `g2u07.w.that-s-a-pity` ← v1 `That's a pity.`: d="Words you say when you feel sorry about something" · s="You can't come to the party? _____ We will miss you." · a=["That's a pity","That is a pity"] · mc=["That's fine!","No problem!","See you there!"]
- `g2u07.w.ticket` ← v1 `ticket`: d="A piece of paper that lets you go into a place or ride a bus" · s="I bought a _____ for the football match so I can sit in seat 24B and watch the game." · a=["tickets"] · mc=["programme","scarf","drink"]
- `g2u07.w.what-a-shame` ← v1 `What a shame!`: d="Words you say when something sad or bad happens" · s="The match was cancelled because of rain. _____ I was really looking forward to it." · a=["What a shame","What a shame!"] · mc=["Great news!","How lucky!","Wonderful!"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 7.txt -----
Unit 7 – Plans for the weekend
Page 54–55
At the end of unit 7 ...
you know
 ☑ 8 phrases for activities
 ☑ how to use going to (negative)
 ☑ how to use might / might not
you can
 ☑ understand and talk about (weekend) plans
 ☑ understand short messages, notes, posts and cards
 ☑ identify different text types
 ☑ write an invitation
VOCABULARY – Activities
1 Look at the pictures. What are these people’s plans? Talk about them with your partner.
 Use the words in the box to help you.
watch a film | do the shopping | tidy (your) room | play basketball
 do (your) homework | stay at a friend’s house | have a party | do nothing
A What’s she going to do?
 B She’s going to do her homework.
[Image descriptions for numbered pictures:]
 1 – A girl is sitting at a desk writing in a notebook (doing homework).
 2 – A boy is lying on the couch with snacks and the TV on (watching a film).
 3 – A boy and a girl are hanging decorations (having a party).
 4 – A girl is throwing a basketball (playing basketball).
 5 – A girl is vacuuming (tidying her room).
 6 – A boy and girl walking together with overnight bags (staying at a friend’s house).
 7 – A girl looks bored lying on a sofa (doing nothing).
 8 – A boy is pushing a shopping cart (doing the shopping).
LISTENING & SPEAKING – Talking about weekend plans
2 Listen to the dialogues and tick the correct boxes.
	Sharon	Nick	Chloe	Bill
have a party	☐	☐	☐	☐
do nothing	☐	☐	☐	☐
do homework	☐	☐	☐	☐
stay at a friend’s place	☐	☐	☐	☐

3 CHOICES
A Read the dialogue and complete it with the phrases from the box.
 There is one phrase you don’t need. Then listen and check. Act out the dialogue.
I’m going to watch TV.
 I’m going to do nothing.
 And your school project?
Steve: What are your plans for the weekend?
 Luke: 1 ".............................................................................................................................."
 Steve: What about TV?
 Luke: I’m not going to watch TV. There’s nothing good on.
 Steve: 2 ".............................................................................................................................."
 Luke: I’m not going to do any work this weekend.
B Work with a partner and complete the dialogue with your own ideas. Then act out the scene.
A – Have you got any special plans for the weekend?
 B – Well, I’m going to watch films tomorrow night. Do you want to watch them with me?
 A – I’d love to*, ..................................................................................................................... .
 B – Oh, why not?
 A – I’m going to Jenny’s party.
 B – ............................................................................................................................................... !
VOCABULARY: *I’d love to … – Ich würde gerne …
4 Find out about your partner’s plans for this weekend.
A – Are you going to play basketball?
 B – No, I’m not. I’m going to watch films. What about you?
GRAMMAR CHANT – (not) going to
5 A chant. Listen and repeat.
Hey, Dad, listen. I’m sorry.
 But I’m not going to tidy my room.
 I’m not going to make my bed.
 I’m not going to work for school.
 I’m going to take it easy instead.
Listen, Sam. That’s fine, but ...
 I’m not going to cook for you.
 I’m not going to drive you around.
 I’m not going to buy you sweets.
 I’m not going to give you a pound.
Hey, listen Dad. That was only a joke. Honestly ...
 I am going to tidy my room.
 I am going to make my bed.
 I am going to do my work,
 I am now going to go ahead.
 Really! Believe me, Dad!
[Image: Cartoon of a boy talking to his dad while other scenes show the boy being lazy and later doing chores.]
Page 56–57
SOUNDS RIGHT – going to
6 When you hear someone say “gonna”, it is an informal way of saying “going to”.
 Listen and repeat.
I’m going to write a letter,
 I’m going to put it in the post.
 And the letter’s going to tell you
 that I love you the most.
READING – Understanding messages, notes, posts and cards
7 Look at the mixed-up messages. Match them with the types of communication in the box.
 Write letters A–I.
Types of communication:
 ☐ text messages
 ☐ note
 ☐ invitation
 ☐ social media post
 ☐ group chat
 ☐ email
Messages A–I:
A
 [Photo of a tree with a girl climbing it]
 "I’ve just come home. We had a great Sunday out. We, that’s Mum, Dad and me, visited my sister Mia. We went to Brighton to see Grandma. Mia and I climbed a tree – see the photo! She’s cool. I really like my sister."
B
 Mum: "No way! We’re all going to visit Grandma, and you’re going to come with us. You’ve got another 5 days to do your work for school. No excuses, please."
C
 Note on brown paper with handwriting:
 "Hi Zoe, There was a phone call from Mia. She’s not feeling well. She’s not going to come over today. Dad"
D
 Blue message bubble:
 "Hey, Mum. I’m really sorry. I’ve got a lot of work for school this week. So I’m not going to come along to see Grandma on Sunday."
E
 Green message bubble:
 "Hi Mia, I saw the photos your brother posted online. I can see you had a lot of fun. But why did you tell me you’re ill? Zoe"
F
 [Email screenshot]
 FROM: mia_hd@hello.co.uk
 SUBJECT: party
 "Hello Zoe, Thanks for your invitation for Sunday. Great! My parents and my little brother Lucas are going to visit Grandma. I’m not going with them. I’ll tell them I’ve got a lot of work for school. LOL! Mia"
G
 Blue message bubble:
 "OK. I understand. I’m going to join you all, of course."
H
 Green message bubble:
 "Hi there, I really, really, really wanted to see you today, Zoe. Then my mum said no. I felt so bad and didn’t want to tell you I had to go with them. It was a big mistake! Sorry for telling you a lie. Can we meet up tomorrow after school? Mia"
I
 [Note with hearts and flowers]
 "Dear Mia,
 Come to my birthday party next Sunday.
 Time: 10 a.m. – 6 p.m.
 Place: 7 Station Road
 Love, Zoe"
8 – Read the messages in 7 again. Tick the correct answer.
1 What does Mia say in her email to Zoe about Sunday?
 ☐ She’s going to visit her grandma with her family.
 ☐ She’s going to climb a tree with her brother.
 ☐ She isn’t going to visit her grandma with her family.
2 What message does Mia give Zoe’s dad?
 ☐ She’s going to come over to Zoe’s place two hours later.
 ☐ She isn’t feeling well and isn’t going to come over to Zoe’s place.
 ☐ She isn’t feeling well, but she’s going to come over anyway.
3 What does Zoe see on Mia’s brother’s social media page?
 ☐ A photo of Mia’s family and their grandma.
 ☐ A photo of Lucas and his grandma.
 ☐ A photo of Lucas and Mia.
4 How does Mia feel when Zoe finds out what she did?
 ☐ She feels sorry she didn’t tell Zoe the truth.
 ☐ She’s very angry with herself.
 ☐ She’s angry with Lucas because he posted the photo.
9 – Read the messages again. In what order do they come?
Write the letters A–I in the correct order.
1 ☐ 2 ☐ 3 ☐ 4 ☐ 5 ☐ 6 ☐ 7 ☐ 8 ☐ 9 ☐
READING – William, the worrier
10 Read the story.
1 William is going to do the shopping. He is worried.
 William is always worried.
[Image: William holding a shopping list, looking nervous.]
2 “I need a list. I might forget something.”
[Image: William sitting at the table, writing a list.]
3 “These bags are old. They might break.”
[Image: William with shopping bags, inspecting them.]
4 “Go by bike? No, I might crash.”
[Image: William looking worried, imagining falling off a bike.]
5 Finally, William leaves the house.
[Image: William walks out of his house with shopping bags.]
6 Too late!
 [Image: Supermarket door with “SHOP CLOSES at 6:00 p.m.” sign. William is arriving at 6:01.]
Page 58–59
11 Here are some more of William’s worries. Match the sentence halves.
I don’t want to go to the beach –
I don’t want to go skiing –
I’m going to study tonight –
I don’t want to go near that dog –
I don’t want to answer the teacher’s question –
I don’t want to ride your bike –
I’m not going to eat that –
I’m not going to go trick-or-treating –
a. I might break my leg.
 b. I might not get it right.
 c. I might fall off.
 d. It might be poisonous*.
 e. The sun might be too hot.
 f. I might get into trouble.
 g. We might have a test tomorrow.
 h. It might bite.
VOCABULARY: *poisonous – giftig
12
Work in pairs. Take turns to test your partner.
A: Why doesn’t William want to go to the beach?
 B: Because the sun might be too hot.
 A: That’s right.
WRITING – CHOICES
13A
 Read Jill’s invitation to her birthday party. Imagine it’s your birthday next week.
 Invite a friend (30–40 words). Write about:
 • why there is a party
 • when and where it is
 • what there is going to be at the party
Party invitation
 It’s my birthday on Friday and I’m going to have a party on Saturday at my place. There’s going to be lots of food and drink and there’s going to be a DJ, too. It’s going to be great.
 The party starts at 6 p.m. Don’t be late. See you on Saturday.
 Jill
13B
 Imagine there is going to be a fancy dress party at your school. Draw a mind map first – see the example below. Then use your ideas to write an invitation to a friend (60–70 words).
Mind map example:
FANCY DRESS PARTY
 → lots of food
 → DJ
 → midnight surprise
 → COSTUME:
   me: pirate
   you: catwoman?
 → 18:00–24:00
 → Friday evening
 → at school
14
In pairs, decide which of these are good to write in a birthday card.
 ☐ Have a great day.
 ☐ Hope you like the present.
 ☐ You’re old!
 ☐ With best wishes and lots of love.
 ☐ Birthdays – they’re nothing special.
15 Think of a friend and write your own birthday message in the card.
Image description: A folded birthday card with a panda holding balloons and a cupcake on the front.
 Front text: “Hip, hip, hooray!”
 Inside card: “Happy Birthday”
GRAMMAR
going to (negative)
Du verwendest going to, wenn du etwas planst oder beabsichtigst, etwas zu tun. Beim Verb go verwendest du normalerweise kein going to. Also: I’m going to a party.
So bildest du die Verneinung mit going to:
 Verneinung von be + going to + Grundform des Verbs
• I’m not going to play tennis tomorrow.
 • You aren’t going to like the film.
 • He/She isn’t going to do the shopping.
 • It isn’t going to rain this afternoon.
 • We aren’t going to do our homework.
 • They aren’t going to play volleyball on Sunday.
Image: A red square with a cartoon of a boy putting down a tennis racket and saying:
 “I’m not going to play tennis any more.”
might / might not
Wenn du sagen willst, dass etwas möglicherweise (nicht) eintreten wird, verwendest du:
 might (not) + Grundform des Verbs
• I might forget something.
 • I might not get it right.
 • The bags might break.
Image: A girl looking at a boy holding a present and saying:
 “He might not like chocolate!”
🡺 Now go back to page 54. Check ✅ with a partner what you know / can do.
Page 60–61
THE TWINS 3 – At the cinema
Developing speaking competencies
Language function
 ☑ I can buy a cinema ticket (Kinokarten kaufen)
Speaking strategy
 ☑ I can express disappointment (Enttäuschung ausdrücken)
VOCABULARY – Problems
Read what these signs say. How would you say them in German?
Image 1: A sign says "CLOSED"
 Image 2: A sign says "TICKETS SOLD OUT"
 Image 3: A sign says "Lift broken!"
 Image 4: A poster for a Rock Festival with the text "We’re sorry: no concert tonight"
2
Watch or listen to the dialogue. Then read it. What’s the problem for Lucy and Leo?
Leo: Two tickets for the 5 o’clock showing of They Came From Mars, please.
 Assistant: I’m sorry. It’s sold out.
 Leo: What a shame.
 Lucy: What time is the next showing, please?
 Assistant: It’s not until 7.30. However, there’s a showing at 5.30, but it’s in 3D.
 Lucy: What film is that?
 Assistant: It’s the same film: They Came From Mars.
 Assistant: But it’s in 3D, so it’s more expensive.
 Lucy: That’s a pity.
 Leo: Lucy? Are you crazy? It’s in 3D! Let’s go.
 Lucy: Oh, OK. Two tickets, please.
 Assistant: Where would you like to sit?
 Lucy: Just a moment. Er … row 12, please.
Image description: Lucy and Leo are at the cinema counter talking to a young assistant behind the till.
3
Read the sentences and correct them.
There is only one ticket for the 5 o’clock showing of They Came From Mars.
The showing at 7.30 is more expensive than the showing at 5 o’clock.
Leo doesn’t like 3D films very much.
Lucy doesn’t think it’s a problem that the 3D showing is more expensive.
The twins don’t buy tickets for the 3D showing.
USEFUL PHRASES – Buying a cinema ticket
4
Who says what? Write C (Customer) or A (Assistant).
I’m sorry. It’s sold out. [ ]
Two tickets for the … o’clock showing of …, please. [ ]
What time is the next showing, please? [ ]
It’s not until 7.30. [ ]
There’s a showing at 5.30, but it’s in 3D, so it’s more expensive. [ ]
Where would you like to sit? [ ]
Row 12, please. [ ]
? What do you think? Answer the questions.
• What do they do until the film begins?
 • Does the film begin on time?
MOBILE HOMEWORK
Watch part 2 of the video. Use the verbs from the box in the correct form and information from part 2 to complete the sentences.
Word box: have got buy begin win notice want
Lucy and Leo _____________________________ until the film …
First they _____________________________ a hot dog.
Leo _____________________________ play _____________________________ on the mobile.
Leo _____________________________ the game and he is very _____________________________.
Lucy suddenly _____________________________ started 15 minutes before.
SPEAKING STRATEGY – Expressing disappointment
5
Complete. Then check with the dialogue in 2.
Assistant: I’m sorry. It’s sold out.
 Leo: What a _______________. shame.
Assistant: It’s in 3D, so it’s more expensive.
 Lucy: ____________________________. That’s a pity.
6 – CHOICES
A
Work in pairs. A mentions a problem (from 1). B reacts and shows disappointment.
A: The shop’s closed.
 B: What a pity.
B – ROLE PLAY:
Look at the situations from (1). Choose one. Work in pairs and extend it into a longer dialogue. Take 2 or 3 minutes to practise it. Don’t write it down. Act it out in class.


----- WB: More 2 WB Unit 7.txt -----
UNIT 7 Plans for the weekend
Page 53
UNDERSTANDING VOCABULARY – Activities
1 What are they going to do? Complete the sentences with the words in the box.
 stay play do watch do tidy do have
[Image descriptions for numbered pictures:]
A boy is sitting on the sofa, watching a film on TV.
A man is shopping for vegetables.
A girl is tidying her bedroom.
A boy is playing basketball.
A boy is doing homework at a desk.
A girl is staying at a friend’s house (they are waving goodbye).
A girl is celebrating at a birthday party with a table full of food.
A boy is lying in a hammock, doing nothing.
Sentences:
Peter is going to watch a film.
Mehmet is going to do the shopping.
Azra is going to tidy her room.
Moe is going to play basketball.
Stew is going to do his homework.
Abi is going to stay at a friend’s house.
Jo is going to have a party.
Ron is going to do nothing.
USING VOCABULARY – Activities
2 How many words or phrases can you write with each verb?
watch
…a film
………………………………………
………………………………………
………………………………………
tidy
…your room
………………………………………
………………………………………
………………………………………
play
…basketball
………………………………………
………………………………………
………………………………………
do
…nothing
………………………………………
………………………………………
………………………………………
have
…a party
………………………………………
………………………………………
………………………………………
stay
…at a friend’s house
………………………………………
………………………………………
………………………………………
Page 54–55
3 Complete the dialogues with the words in the box.
Box:
 play do watch tidy do watch play do tidy do
Dialogue 1
 Cathy: Dad, can I watch the film at nine?
 Dad: Sure. But first you have to do your homework.
 Cathy: I’m going to do it right now.
 Dad: Good. And did you tidy your room?
 Cathy: My room’s always tidy, as you know.
 Dad: OK, no problem.
Dialogue 2
 Dad: So, you can tidy the living room with me.
 Aishe: Oh no.
 Dad: And you have to take the rubbish out*.
 Aishe: Dad!
 Mehmet: It’s going to be a nice quiet afternoon for me. I’m going to play a few games.
 Dad: No, you’re not! You’re going to do the washing-up*.
 Aishe: Ha, ha.
 Dad: So – come on, everyone. Let’s get busy*.
(Three hours later)
 Dad: That was quite a lot of work.
 Aishe: Yes, it was. I’m really tired. I’m going to do nothing at home tonight.
 Mehmet: Me too. Now I’m going to play my games.
 Dad: Oh, I forgot. We’re having guests here for dinner tonight.
 Aishe & Mehmet: Oh no!
Vocabulary:
 take the rubbish out – den Müll rausbringen
 do the washing-up – den Abwasch machen
 get busy – sich an die Arbeit machen
UNDERSTANDING GRAMMAR – going to
4 Look at the pictures and circle T (True) or F (False).
(Images show: Ben taking out the rubbish; Marco shopping; Carol picking up books; Sarah tidying room; Ali doing the washing-up.)
Ben is going to take the rubbish out. T / F
Marco is going to go shopping. T / F
Carol is going to pick up her books. T / F
Sarah is going to tidy her room. T / F
Ali is going to do the washing-up. T / F
USING GRAMMAR – going to
5 Correct the false sentences in 4. Write what they are going to do.
Ben is going to …
 .......................................................................................................................
 .......................................................................................................................
UNDERSTANDING GRAMMAR – going to (negative)
6 Match the pictures and the sentences.
Images A–F show various scenes:
A: girl jumping for joy
B: people missing the bus
C: girl looking sad
D: people getting on the bus
E: fish restaurant sign
F: people eating chicken
Sentences:
 ☐ 1. They aren’t going to catch the bus.
 ☐ 2. They’re going to catch the bus.
 ☐ 3. She’s going to win.
 ☐ 4. She isn’t going to win.
 ☐ 5. They’re going to have fish for lunch.
 ☐ 6. They aren’t going to have fish for lunch.
USING GRAMMAR – going to (negative)
7 Complete the sentences with not going to and the verb from the question.
A: Are you going to invite Ben to your party?
   B: Yes, but … I’m not going to invite his brother.
A: Are you going to do your English homework tonight, Stephanie?
   B: Yes, but … ........................................................................................................... all of it.
A: Is he going to tidy his room?
   B: Yes, but … .......................................................................................................... the living room.
A: Is she going to tell her mum?
   B: Yes, but … .......................................................................................................... her dad.
A: Are we going to have chicken for lunch?
   B: Yes, but … .......................................................................................................... it with chips.
8 Write down your plans.
Two things you’re (not) going to do tonight:
 1 ..............................................................................................................................
 2 ..............................................................................................................................
Two things you’re (not) going to do this weekend:
 1 ..............................................................................................................................
 2 ..............................................................................................................................
Two things you’re (not) going to do next week:
 1 ..............................................................................................................................
 2 ..............................................................................................................................
Page 56–57
UNDERSTANDING GRAMMAR might / might not
9 Match the pictures and the sentences.
1 Be careful. It might fall.
 2 It might be Ben.
 3 She might buy the teddy bear.
 4 They might take a taxi.
 5 You might be ill.
 6 Be careful. It might be dangerous.
 7 Don’t jump in. The water might be dirty.
 8 It might be a nice day.
(Images labeled A–H:
 A – person on a ladder with tool belt looking up at the sun and clouds
 B – child holding teddy bear and doll in a toy shop
 C – group of people getting into a taxi
 D – person being examined by another who holds their cheek
 E – two people canoeing on rapids
 F – woman looking at phone lying on table
 G – people on a mountain path pointing at rock formation
 H – person jumping into water near rocks)
10 Match the sentence halves.
1 It might rain …
 2 My head hurts …
 3 I need a new shirt …
 4 She quite likes Adele …
 5 He drank a lot of coffee …
 6 They didn’t study for the test …
… so they might not pass.
… so she might go to her concert.
… so I might go to bed.
… so I might go shopping tomorrow.
… so she’s going to take an umbrella.
… so he might not sleep well tonight.
USING GRAMMAR might / might not
11 Complete the sentences so they are true for you. Use might / might not.
1 After school today, I might …
 2 For dinner tonight, I might …
 3 This Sunday, I might …
 4 On Saturday morning, I might …
 5 When I’m 18, I might …
 6 When I’m 30, I might …
READING
12  a Read the story and complete it with the expressions in the box.
William, the worrier
Box:
 give her stomach ache* get it like films red and feel ill
 like you better than me be allergic* to them
Don: What’s the matter, William? Are you sad?
 William: No, I’m not sad. I’m sick.
 Don: Sick? What did you eat?
 William: No, I’m love sick.
 Don: Love sick?
 William: Yes, love sick. I’m in love with Katy Pimm, but she doesn’t even know my name.
 Don: You have to talk to her. It’s easy.
 William: Good idea, but there’s one problem. I’m too shy*. I might go 1 __________.
 Don: Well, send her a letter.
 William: That isn’t a very good idea. She might not 2 __________.
 Don: OK, then. Let me talk to her for you.
 William: No! No way! She might 3 __________!
 Don: Invite her to the cinema.
 William: No. She might not 4 __________.
 Don: Oh, come on.
 William: But she might say no.
 Don: Give her some chocolates.
 William: That isn’t a good idea. They might 5 __________.
 Don: I know! Do something romantic. Give her some flowers.
 William: No, no. That isn’t a good idea. She might 6 __________.
 Don: I give up. Look. Katy’s walking towards us.
 William: Is she? Quick – let’s hide!
 Don: Too late. Hi, Katy.
 Katy: Hi, Don. Hello, William. I’m Katy.
 William: Erm … hello.
 Katy: Hi. Would you like to come to the cinema tonight?
Vocabulary:
 shy – schüchtern; stomach ache – Bauchschmerzen; allergic – allergisch
b Read the story again. How many of the tasks can you do?
1 William is love sick. T / F
 2 William thinks Katy likes him. T / F
 3 William thinks he’s too shy to talk to Katy. T / F
 4 Don thinks William should send …
 5 Don also thinks it’s a good idea to invite …
 6 William worries that chocolate might give Katy …
 7 Why doesn’t William want to send Katy flowers?
 8 Why does William want to hide?
 9 What does Katy want?
13 Listen and check your answers.
Page 58–59
READING & WRITING
Understanding / Writing about weekend plans
14 CHOICES
A Read the dialogues and complete them with the phrases in the box.
not going to look after I only know what I’m not going to do I’m going to phone her then Is she not going to be
1
 Bob: What are your plans for the weekend?
 Sally: I don’t know. 1 _____________________________________________.
 Bob: And what’s that?
 Sally: I’m not going to do anything for school. And I’m
 2 _____________________________________________ my little sister.
2
 Ruth: Is Sophie going to be at the party?
 Tim: I don’t know.
 Ruth: What do you mean? 3 _____________________________________________
 at YOUR birthday party?
 Tim: I really don’t know.
 Ruth: 4 _____________________________________________. Is that OK?
 Tim: OK.
B Put the dialogues in the correct order.
1
 □ Lillian Dad, I’m not going to read another story to Mary.
 □ Lillian No, Dad, I’m not going to tidy my room.
 □ Lillian Because from now on I’m going to do – nothing.
 □ Dad Why not?
 □ Dad OK. And I’m not going to take you to your friend’s party on Saturday.
 □ Dad Nothing? Don’t forget to tidy your room. It’s a mess.
2
 □ Tony I said in a minute.
 □ Tony Mum, please stop it. First, I’m going to finish my lunch, and then I’m going
 to do the other things.
 □ Tony In a minute.
 □ Mum And aren’t you going to help Dad with the car?
 □ Mum Aren’t you going to take out the rubbish?
 □ Mum And aren’t you going to …
15 Now write your own dialogue in your exercise book.
A What are your plans for the weekend?
 B I’m going to … / I don’t know. I might …
16 Put the rhyme words in the box into the spaces. Then listen to the poem.
sea rain you sky
I might …
 I might travel to Spain.
 I might walk in the 1 _________________.
 I might eat lemon pie.
 I might look at the 2 _________________.
 I might swim in the 3 _________________.
 And I might waterski.
 But I might also think of 4 _________________.
 I might think of what you do
 Without me,
 Without me.
(Image: Girl in sunglasses on a pool chair imagining various travel and water scenes)
17 Now write your own ‘might (not)’ poem. Note: It doesn’t have to rhyme.
(Space provided in a large thought bubble with lines for writing. Illustration of girl thinking.)
LISTENING & DIALOGUE WORK
Talking about (weekend) plans / Expressing disappointment
18
 a Listen to the dialogue between Zoe and Nina. When’s the party?
 ……………………………………………………………………………………
b Listen again and answer the questions below.
1 Why is Nina surprised?
 ……………………………………………………………………………………
2 Why did Zoe change the date?
 ……………………………………………………………………………………
3 When will her brother definitely be there?
 ……………………………………………………………………………………
4 What does Nina suggest?
 ……………………………………………………………………………………
5 What kind of problem might Nina have?
 ……………………………………………………………………………………
6 What is Nina going to do?
 ……………………………………………………………………………………
VOCABULARY: let sb. off – hier: jdn. gehen lassen
Page 60–61
🗣️ 19
Work in pairs. Tell your partner three things you’re (not) going to do at the weekend.
 Your partner reacts to this.
Example:
 A I’m going to see the new Marvel film.
 B Really? Can I come?
20
🔶 a Complete the dialogues.
1 A My rabbit died last night.
   B W__________________ a p__________________.
2 A Tom’s ill so he can’t have a party.
   B T__________________ a s__________________.
🔶 b Complete the dialogues with your own ideas.
1 A ……………………………………………………………………
   B What a pity.
2 A ……………………………………………………………………
   B That’s a shame.
(Image in the corner labeled “THE TWINS” with two cartoon children reacting emotionally.)
🎧 21
Complete the dialogue with the words in the box. Then listen and check.
Word Box:
 pity sit expensive please a shame sold showing much ticket row
Ben One 1 ________________________ for the 5 o’clock showing of James Bond, please.
 Woman I’m sorry. It’s 2 ________________________ out.
 Ben That’s 3 ________________________. What time is the next showing, please?
 Woman It’s not until 8 p.m.
 Ben What a 4 ________________________. That’s too late.
 Woman There’s a 5 ________________________ of James Bond at 6 p.m., but it’s in 3D.
 Ben 3D?
 Woman Yes, so it’s more 6 ________________________.
 Ben How 7 ________________________ is it?
 Woman It’s £12.
 Ben That’s OK. I’ll have one ticket, 8 ________________________.
 Woman Where would you like to 9 ________________________?
 Ben 10 ________________________, please.
WORD FILE
Activities
(Image panel showing cartoon illustrations for each of the phrases below.)
to do nothing
to play basketball
to stay at a friend’s house
to tidy your room
to have a party
to do the shopping
to do your homework
to watch a film
MORE Words and Phrases
#	Phrase	Example Sentence (English)	German Translation
5	honestly	Honestly, that was only a joke!	ehrlich; wirklich
	instead	I don’t want to tidy my room. I’m going to do nothing instead.	stattdessen
6	to take it easy	I’m very tired. I’m going to take it easy this afternoon.	sich entspannen
	to be ashamed	I was very ashamed.	sich schämen
7	to come over	She isn’t going to come over today.	vorbeikommen
	communication	There are many types of communication.	Kommunikation
	excuse	There’s no excuse.	Ausrede
	group chat	My friends and I have a group chat.	Gruppenchat
	social media	I’m writing a social media post.	soziale Medien
	to tell a lie	Don’t tell me a lie. I know it was you!	lügen
	truth	I didn’t tell her the truth.	Wahrheit
	to be worried	William is always worried.	besorgt sein
8	to crash	Be careful or you might crash.	einen Unfall bauen, gegen etw. fahren
9	to get into trouble	I might get into trouble if I do that.	in Schwierigkeiten geraten, Ärger bekommen
10	fancy dress party	My friend invited me to a fancy dress party.	Kostümparty
T3	disappointment	She showed her disappointment.	Enttäuschung
	German	How do you say this in German?	Deutsch
	row	Can we have tickets for row 12, please?	(Sitz-)Reihe
	sold out	The concert is sold out.	ausverkauft
	That’s a pity.	There’s only one ticket for the 5 o’clock showing. That’s a pity!	Das ist schade!
	ticket		Eintrittskarte, Ticket
	What a shame!	The concert is sold out. What a shame!	Wie schade!

```

## Output contract

Write `content/corpus/units/g2-u07/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u07",
  "briefBank": "1fd181b8d7a9",
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
