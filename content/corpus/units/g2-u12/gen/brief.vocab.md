# Vocab generation brief — g2-u12 (MORE! 2, Unit 12)

<!-- domigo:gen vocab g2-u12 bank=2b2627e1bbe4 prompt=346902f9f0f1 -->

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
| g2u12.w.headache | headache | Kopfschmerzen | wordfile | Aches and Pains | — | — | headache |
| g2u12.w.toothache | toothache | Zahnschmerzen | wordfile | Aches and Pains | — | — | toothache |
| g2u12.w.earache | earache | Ohrenschmerzen | wordfile | Aches and Pains | — | — | earache |
| g2u12.w.stomach-ache | stomach ache | Bauchschmerzen | wordfile | Aches and Pains | — | — | stomach ache |
| g2u12.w.pain-in-ankle | pain in ankle | Schmerzen im Knöchel | wordfile | Aches and Pains | — | — | pain in ankle |
| g2u12.w.knee | knee | Knie | wordfile | Aches and Pains | — | — | knee |
| g2u12.w.backache | backache | Rückenschmerzen | wordfile | Aches and Pains | — | — | backache |
| g2u12.w.throat | throat | Hals | wordfile | Aches and Pains | — | — | throat |
| g2u12.w.bath | bath | Bad | phrase | — | I have to give my dog a bath. She's very dirty. | — | bath |
| g2u12.w.medicine | medicine | Medizin | phrase | — | The doctor says you should take your medicine. | — | medicine |
| g2u12.w.memory | memory | Gedächtnis | phrase | — | Her memory is very good. She can remember lots of facts. | — | memory |
| g2u12.w.patient | patient | Patient/Patientin | phrase | — | There are many patient and doctor jokes. | — | patient |
| g2u12.w.spoon | spoon | Löffel | phrase | — | I need a spoon to eat my soup. | — | spoon |
| g2u12.w.blood | blood | Blut | phrase | — | There's blood on your T-shirt. It's all red. | — | blood |
| g2u12.w.lamp-post | lamp post | Laternenmast | phrase | — | Ouch – I've just walked into a lamp post. | — | lamp post |
| g2u12.w.cure | cure | Heilmittel | phrase | — | In Ancient Egypt, a dead mouse was a cure for toothache. | — | cure |
| g2u12.w.to-cure | to cure | heilen | phrase | — | Worms cured stomach ache. | cure | to cure ; cure |
| g2u12.w.dentist | dentist | Zahnarzt/Zahnärztin | phrase | — | I want to become a dentist. | — | dentist |
| g2u12.w.to-mash | to mash | zerdrücken ; zerstampfen | phrase | — | They mashed a dead mouse and mixed it with food to get a paste. | mash | to mash ; mash |
| g2u12.w.to-mix | to mix | vermischen | phrase | — | I mix my pet's medicine with its food. | mix | to mix ; mix |
| g2u12.w.taste | taste | Geschmack | phrase | — | The taste was very good. | — | taste |
| g2u12.w.toothpaste | toothpaste | Zahnpasta | phrase | — | In Ancient Rome, people didn't have toothpaste. | — | toothpaste |
| g2u12.w.worm | worm | Wurm | phrase | — | A worm lives under the ground. | — | worm |
| g2u12.w.smell | smell | Geruch | phrase | — | The smell of fish was really bad. | — | smell |
| g2u12.w.first-aid | first aid | Erste Hilfe | phrase | — | We have first aid classes at school. | — | first aid |
| g2u12.w.helpful | helpful | hilfsbereit | phrase | — | She has always been a great and helpful friend. | — | helpful |
| g2u12.w.horrible | horrible | schrecklich | phrase | — | The accident was horrible! | — | horrible |
| g2u12.w.pupil | pupil | Schüler/Schülerin | phrase | — | Sam is a very helpful pupil. | — | pupil |
| g2u12.w.since | since | seit | phrase | — | I've been in hospital since last week. | — | since |
| g2u12.w.believe-me | Believe me! | Glaub mir! | phrase | — | It's true. Believe me! | — | Believe me! |
| g2u12.w.to-injure | to injure | verletzen | phrase | — | I don't want to injure my knee again. | injure | to injure ; injure |
| g2u12.w.it-doesn-t-matter | It doesn't matter. | Das macht nichts ; egal | phrase | — | It doesn't matter. | — | It doesn't matter. |
| g2u12.w.writer | writer | Schriftsteller/-in | phrase | — | I don't know who the writer of this text is. | — | writer |

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
- **g2-u08**: spaceship, commander, spacesuit, alien, UFO, space centre, planet, boss, cable, capital, to connect, hero, heroine, machine, to repair, space, statue, to take over, traveller, visitor, key, crew, aeroplane, expert, hoax, investigation, photograph, to destroy, to kidnap, nonsense, comfortable, Calm down!, in that case
- **g2-u09**: grapes, plums, pumpkin pie, rice pudding, chocolate ice cream, turkey, ham, beef, chicken, apple juice, cheesecake, pancakes, mineral water, tomato (pl tomatoes), cabbage, sausages, lamb, pears, peppers, onions, olives, mushrooms, potato (pl potatoes), peaches, strawberries, chef, recipe, waiter, cloche, menu, slice, actor, actress, main course, to pour, soup, starter, straightaway, completely, crane, to drop, to entertain, glasses (pl), platform, to serve, several, stew, fridge, to complain, consumer, delivery, to download, refund, certain, to change one's mind, gym, to miss
- **g2-u10**: auntie, calm, girlfriend, to be proud of, sense of humour, ugly, virus, to breathe, to burn, foreign language, to panic, tractor, tool, divorced, to be related to, to delete, file, to print out, public, ice skating, fault, hopefully
- **g2-u11**: wardrobe, bed, bedside table, carpet, fridge, cooker, curtain, sink, cupboard, table, chair, sofa, armchair, lamp, radiator, rug, roof, wall, window, staircase, cellar, trailer (American English), tree house, stilts, reed, island, ground, ours, theirs, mine, hers, his, yours, furniture, whose, American, cellar, Central Asia, electricity, to float, moveable, underneath, to transport, hammock, cotton, leather, material, metal, pattern, plain, plastic, pond, seat, spotted, strap, striped
- **g2-u12**: headache, toothache, earache, stomach ache, pain in ankle, knee, backache, throat, bath, medicine, memory, patient, spoon, blood, lamp post, cure, to cure, dentist, to mash, to mix, taste, toothpaste, worm, smell, first aid, helpful, horrible, pupil, since, Believe me!, to injure, It doesn't matter., writer

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Feeling, Fido, Food, France, Frank, Fred, Freddy, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Ms, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salma, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u12.w.headache` ← v1 `headache`: d="A pain in your head that makes it hard to think" · s="I have a bad _____ and need to lie down." · a=["headaches"] · mc=["toothache","earache","backache"]
- `g2u12.w.toothache` ← v1 `toothache`: d="A pain in your tooth that really hurts" · s="I can't eat anything because I have a _____." · a=["toothaches"] · mc=["headache","earache","stomach ache"]
- `g2u12.w.earache` ← v1 `earache`: d="A pain deep inside your ear" · s="My left ear hurts. I think I have an _____." · a=["earaches"] · mc=["headache","toothache","backache"]
- `g2u12.w.stomach-ache` ← v1 `stomach ache`: d="A pain in your tummy" · s="I ate too much cake and now I have a _____." · a=["stomach ache","stomachache","tummy ache"] · mc=["headache","backache","toothache"]
- `g2u12.w.pain-in-ankle` ← v1 `pain in the ankle`: d="When the joint above your foot hurts" · s="I can't walk well because of the _____. The joint above my foot really hurts." · a=["pain in the ankle","pain in ankle","pain in my ankle","ankle pain"] · mc=["pain in knee","backache","headache"]
- `g2u12.w.knee` ← v1 `knee`: d="The joint in the middle of your leg that bends" · s="I fell and hurt my _____ on the playground." · a=["knees"] · mc=["ankle","elbow","hip"]
- `g2u12.w.backache` ← v1 `backache`: d="A pain along the back of your body" · s="My grandpa has _____ and finds it hard to sit for long." · a=["backaches"] · mc=["headache","stomach ache","toothache"]
- `g2u12.w.throat` ← v1 `throat`: d="The inside part of your neck where food goes down" · s="My _____ hurts when I try to swallow water." · a=["throats"] · mc=["tongue","neck","chest"]
- `g2u12.w.bath` ← v1 `bath`: d="When you sit in warm water to get clean" · s="After playing in the mud, I need a hot _____." · a=["baths"] · mc=["shower","pool","sink"]
- `g2u12.w.medicine` ← v1 `medicine`: d="Something you take to feel better when you are sick" · s="The doctor gave me some _____ for my cold." · a=["medicines"] · mc=["vitamin","pill","bandage"]
- `g2u12.w.memory` ← v1 `memory`: d="The part of your mind that remembers things" · s="She has a very good _____ and never forgets a birthday." · a=["memories"] · mc=["dream","thought","imagination"]
- `g2u12.w.patient` ← v1 `patient`: d="A person who is sick and sees a doctor" · s="The doctor is talking to her _____ about the test results." · a=["patients"] · mc=["doctor","nurse","dentist"]
- `g2u12.w.spoon` ← v1 `spoon`: d="A small tool with a round part you use to eat soup" · s="I need a _____ for my yoghurt, not a fork." · a=["spoons"] · mc=["fork","knife","cup"]
- `g2u12.w.blood` ← v1 `blood`: d="The red liquid inside your body" · s="There was a little _____ on his knee after he fell." · a=[] · mc=["sweat","tears","bone"]
- `g2u12.w.lamp-post` ← v1 `lamp post`: d="A tall pole with a light on top next to the road" · s="The car hit the _____ on the corner of the street." · a=["lamp post","lamp posts","lamppost"] · mc=["traffic light","sign post","fence"]
- `g2u12.w.cure` ← v1 `cure`: d="Something that makes a sick person well again" · s="Scientists are looking for a _____ that will make sick people completely healthy again." · a=["cures"] · mc=["reason","name","picture"]
- `g2u12.w.to-cure` ← v1 `cure`: d="Something that makes a sick person well again" · s="Scientists are looking for a _____ that will make sick people completely healthy again." · a=["cures"] · mc=["reason","name","picture"]
- `g2u12.w.dentist` ← v1 `dentist`: d="A doctor who looks after your teeth" · s="I go to the _____ twice a year to check my teeth." · a=["dentists"] · mc=["doctor","nurse","optician"]
- `g2u12.w.to-mash` ← v1 `to mash`: d="To press food into a soft mixture" · s="We cooked the potatoes, then _____ them into a soft, smooth paste and added butter." · a=["mash","mashes","mashed"] · mc=["to eat","to bake","to grow"]
- `g2u12.w.to-mix` ← v1 `to mix`: d="To put two or more things together and stir them" · s="_____ the eggs and the flour together in a big bowl until the dough is smooth." · a=["mix","mixes","mixed"] · mc=["to bake","to freeze","to serve"]
- `g2u12.w.taste` ← v1 `taste`: d="How food or drink feels in your mouth" · s="This soup has a really nice _____ — sweet and salty at the same time." · a=["tastes"] · mc=["colour","name","price"]
- `g2u12.w.toothpaste` ← v1 `toothpaste`: d="A cream you put on your toothbrush to clean your teeth" · s="I need new _____. The tube is empty." · a=[] · mc=["toothbrush","mouthwash","floss"]
- `g2u12.w.worm` ← v1 `worm`: d="A small long thin animal without legs that lives in the earth" · s="I found a _____ in the garden when I was digging." · a=["worms"] · mc=["caterpillar","snail","beetle"]
- `g2u12.w.smell` ← v1 `smell`: d="What you notice with your nose" · s="The _____ of fresh bread from the kitchen made me hungry. It went up my nose." · a=["smells"] · mc=["colour","shape","size"]
- `g2u12.w.first-aid` ← v1 `first aid`: d="The first help you give to someone who is hurt" · s="We learned _____ at school so we can help in an emergency." · a=["first aid"] · mc=["medicine","ambulance","hospital"]
- `g2u12.w.helpful` ← v1 `helpful`: d="Wanting to help and doing things for others" · s="My classmate is very _____. She always shares her notes and explains things to me when I don't understand." · a=[] · mc=["lazy","mean","shy"]
- `g2u12.w.horrible` ← v1 `horrible`: d="Very bad or very ugly" · s="The weather was _____ yesterday — rain all day!" · a=[] · mc=["wonderful","purple","sunny"]
- `g2u12.w.pupil` ← v1 `pupil`: d="A child who goes to school" · s="Every _____ in our class has to do a presentation in front of the teacher." · a=["pupils"] · mc=["parent","visitor","animal"]
- `g2u12.w.since` ← v1 `since`: d="From a time in the past until now" · s="I have lived in Vienna _____ I was five years old." · a=[] · mc=["until","before","during"]
- `g2u12.w.believe-me` ← v1 `Believe me!`: d="Words you say when you want someone to know you are telling the truth" · s="It's true, I saw a fox in the garden! _____" · a=["Believe me","Believe me!"] · mc=["Trust me!","I promise!","Listen to me!"]
- `g2u12.w.to-injure` ← v1 `to injure`: d="To hurt a part of your body" · s="She badly _____ her leg while playing football yesterday. Now she walks with crutches." · a=["injure","injures","injured"] · mc=["to stretch","to clean","to paint"]
- `g2u12.w.it-doesn-t-matter` ← v1 `It doesn't matter.`: d="Words to say something is not important or not a problem" · s="I forgot my pencil. — _____. You can use mine." · a=["It doesn't matter","It does not matter"] · mc=["Never mind.","Don't worry.","That's OK."]
- `g2u12.w.writer` ← v1 `writer`: d="A person who writes books or stories" · s="My favourite _____ of children's stories has a new book coming out next month in all the bookshops." · a=["writers"] · mc=["singer","actor","painter"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 12.txt -----
Unit 12 Feeling bad and feeling better
Page 92–93
At the end of unit 12 ... you know:
6 words for aches and pains
how to use the present perfect
how to use past participles
you can:
understand jokes
talk about aches and pains
say and ask what has happened to someone
understand and talk about a text about medicine (in the past)
understand a text and a newspaper article about an accident
write a reply to a comment
write a text message / email to someone who has had an accident
understand and write notes
fill in a form
LISTENING & READING
Understanding jokes
Activity 1:
Listen to the jokes. Then read them and colour 1–5 stars ★☆☆☆☆ to give a score for each joke.
(A mock webpage titled "Jenny's Jokes" is shown, featuring a welcome message from Jenny and six illustrated "Doctor, doctor" jokes. Each joke includes a star rating bar to color in.)
Jenny’s message:
Hi! My name’s Jenny and welcome to my joke page. Every week, I choose a topic and ask you to send me your favourite jokes. Last week, I chose “doctor, doctor” jokes. You sent me hundreds. Here are my favourite six. What do you think? Vote for each joke on the star chart and let’s find out which is the best “doctor, doctor” joke.
Jokes: 1.
Patient: Doctor, doctor, every time I drink a cup of hot chocolate I get a pain in the eye.
Doctor: Try taking the spoon out first.
Vote now: ★★★★★
Patient: Doctor, doctor, please come to my house quickly. My son has swallowed my pen. What should I do?
Doctor: Use a pencil until I arrive.
Vote now: ★★★★☆
Patient: Doctor, doctor, I’ve only got 59 seconds to live.
Doctor: OK. Give me a minute and I’ll call you back.
Vote now: ★★★☆☆
Patient: Doctor, doctor, I’ve broken my arm in two places.
Doctor: Don’t go back to either of them.
Vote now: ★★★★☆
Patient: Doctor, doctor, I’ve lost my memory.
Doctor: When did this happen?
Patient: When did what happen?
Vote now: ★★★★★
Patient: Doctor, doctor, I couldn’t drink my medicine after my bath like you told me.
Doctor: Why not?
Patient: Well, after I drank my bath, I didn’t have room for the medicine.
Vote now: ★★★☆☆
Vocabulary: swallow = hinunterschlucken
Activity 2:
Here are three more “doctor, doctor” jokes. In pairs, think of an ending for each one. Then listen and check.
Patient: Doctor, doctor, I think I need glasses.
Doctor: You certainly do.
Patient: Doctor, doctor, I think I’m a sheep.
Doctor: How do you feel?
Patient: _______ (complete the punchline)
Patient: Doctor, doctor, what’s the quickest way to get to hospital?
Doctor: _______ (complete the punchline)
VOCABULARY: Aches and pains
Activity 3:
Write the names of the people under the pictures.
Emily has got a pain in her back.
Jacob’s knee hurts.
Aisha has got stomach ache.
Mila has got a pain in her ankle.
William’s throat hurts.
Lia’s head hurts.
Image Descriptions: Image 1: Girl holding her lower back in pain (Emily)
Image 2: Boy clutching his knee (Jacob)
Image 3: Girl holding her stomach (Aisha)
Image 4: Girl sitting down and holding her ankle (Mila)
Image 5: Boy touching his throat and looking unwell (William)
Image 6: Girl holding both sides of her head (Lia)
Note:
I’ve got stomach ache (or stomachache).
I’ve got earache.
I’ve got toothache.
I’ve got backache.
But we usually say “I’ve got a headache.”
SOUNDS RIGHT: /p/ /b/ /æ/ /e/
Activity 4:
Listen and repeat.
A pain in your hand?
A pain in your back?
That’s too bad!
A pain in your leg?
A pain in your head?
Then stay in bed!
(Image: A sick child lying in bed with tissues and thermometer, looking tired.)
SPEAKING: Talking about aches and pains
Activity 5:
Work in groups of three. Act out a problem and talk about it.
(Image: Three students acting out a dialogue. One student asks, “What’s the matter with Jonas?” Another responds, “He has got stomach ache.”)
Page 94–95
UNIT 12: Feeling bad and feeling better
LISTENING & SPEAKING
Saying/Asking what has happened to so.
Activity 6
Listen and number the pictures in the order you hear them.
(There are six pictures featuring different scenarios involving minor injuries or mishaps. The images show:)
A boy holding his head, wincing in pain as if he has hit it.
A girl looking shocked and holding her toe in pain.
A girl calling for help while pointing at a boy who has fallen from a tree.
A boy limping with his hand on his ankle.
A girl sitting on the floor holding her foot in pain with a fallen box next to her.
A boy looking at his hand with a concerned expression; there is visible blood.
Activity 7
Complete the dialogues with the words in the box. Then practise the dialogues in pairs.
Word box: dropped, cut, broken, walked, fallen, hurt
A: Does your head hurt?
B: Yes, I’ve just walked into a lamp post.
A: What’s the matter?
B: I think I’ve cut my toe.
A: Come quickly!
B: Why? What’s the matter?
A: Kevin has fallen out of the tree!
A: Why is he walking like that?
B: He has hurt his ankle.
A: Why is she crying?
B: She has just dropped a heavy box on her foot.
A: There’s blood on your shirt.
B: Yes, I’ve just cut my hand.
Activity 8
Look at the dialogues in 7 again and find the past participles of these verbs. Write them.
walk – walked
break – broken
cut – cut
hurt – hurt
fall – fallen
drop – dropped
Activity 9
Here are some more past participles. What do you think the base forms of the verbs are? Write them.
eaten – eat
loved – love
thought – think
hit – hit
told – tell
played – play
put – put
met – meet
known – know
wanted – want
rung – ring
read – read
READING & SPEAKING
Understanding a text about medicine in the past
Activity 10
Read the text and guess what the underlined words could mean.
Text title: Medicine from the past
Toothache is terrible. In Ancient Egypt people didn’t have dentists. One cure they had was the following: They mashed a dead mouse and mixed it with food to get a paste. And for very bad toothache they put a dead mouse on the tooth.
Today, if you want white teeth, your dentist can help you. In Ancient Rome, a few thousand years ago, people also wanted to have white teeth. Of course, they didn’t have any toothpaste. So they used their own urine.
What about stomach ache? Well, people believed rotten fish might help you. The problem was it smelled so bad you had to put it in a lot of drink or food to hide the taste.
Another cure for stomach ache was to eat live worms. The doctor gave a patient five to seven worms and he or she had to swallow them. They believed that when the worms moved in your stomach, it cured the stomach ache.
Finally, some doctors thought that taking blood from a person helped cure many problems. They used leeches to do this. Very often doctors used so many leeches on a person that they lost too much blood and died.
Vocabulary: cure = Heilmittel
rotten = verfault
leech = Blutegel
Activity 11
Read the text again. Circle T (True) or F (False).
For a bad toothache, doctors in Ancient Egypt used dead mice. T / F
In Ancient Egypt, they also used urine for the teeth. T / F
The smell of rotten fish was awful. T / F
Three live worms cured your stomach ache. T / F
Taking blood from a person only cured a headache. T / F
Using too many leeches on a person is dangerous. T / F
Activity 12
Check your answers with a partner.
Activity 13
Two of the methods in 10 are "made-up". Which are they? Discuss with a partner. Say what you think and give a reason.
Vocabulary: made-up = erfunden
Page 96–97
READING & WRITING
Understanding a newspaper article / Writing a comment
Activity 14:
Read the newspaper article. How many of the tasks below can you do?
Article title: Saved by a friend
(Image shows three children practicing CPR during a first aid class.)
Text: The day after finishing her first aid class, teen uses CPR* to save her friend’s life.
Two days ago, Salma Hernández (13) had a first aid class at her school in San Diego, California. Yesterday she used that lesson to save her best friend’s life!
“We were on our bikes going quite fast, when Alice suddenly crashed into a tree. I’ve never seen anybody in an accident like that. It was horrible,” Salma said. “Alice was on the ground and she couldn’t move. I ran over to her and I checked her pulse. Then I put my head against her chest, and I didn’t hear anything. That’s when I started doing CPR on her. After about 30 compressions*, and breathing into her mouth, Alice moved a little. There were people around us and I shouted, ‘Someone call an ambulance!’ ‘I’ve already called one,’ a guy said. And a few minutes later, the ambulance arrived and took Alice to the hospital!”
Alice told us, “I don’t remember the accident. All I can remember is that I woke up in hospital. And there they said, ‘Your friend has saved your life!’ I’m so happy that Salma was there. I had my first aid class and learnt about CPR.”
“I was glad I could help,” Salma said. “Alice and I have been friends for years. I’m so happy I could help her.”
Salma’s first aid teacher told us, “Salma has always been a great and helpful pupil. I’m so proud that she could use what she learnt.”
And what does Salma want to do when she leaves school? “I really want to be a doctor or a nurse when I’m older. I like helping people. And I’m so happy I could help my best friend.”
Vocabulary: *CPR = Herzdrückmassage, Wiederbelebungsmaßnahme
chest = Brustkorb
compression = hier: Kompression, Druck
Comprehension Questions:
Salma saved her best friend’s life at school. T / F
Alice crashed into a tree with her bike. T / F
Alice shouted for help. T / F
After the CPR, Alice …………………………………………
An ambulance …………………………………………
All Alice can remember is that …………………………………………
What did they tell Alice at the hospital? …………………………………………
Why is Salma’s teacher proud? …………………………………………
What are Salma’s plans for the future? …………………………………………
Activity 15:
Check your answers with a partner. Then listen to the story.
Activity 16:
Read the comments on the newspaper article. Choose two and write a reply.
Comments section:
cleverclever: I don’t believe that a 13-year-old can do CPR. This can’t be a true story.
Rontheman: How can you have an accident like that? I don’t believe it.
Cheryl: I’m in a first aid class at the moment. Salma is my heroine.
Sunny2010: What a great story! Well done, Salma!
GRAMMAR CHANT: Present perfect
Activity 17:
A chant. Listen and repeat.
I’ve hurt my head.
I’ve hurt my back.
I’ve hurt both of my knees.
I’ve hurt my arm.
I’ve hurt my leg.
Please, call a doctor, please.
She’s hurt her head.
She’s hurt her back.
She’s hurt both of her knees.
She’s hurt her arm.
She’s hurt her leg.
Please, call a doctor, please.
(Image: A girl with multiple injuries is sitting in a wheelchair with bandages on her legs and arm, and her friend is comforting her. A football and crutches are nearby.)
WRITING: Choices
Activity 18:
Read the text message and answer the questions.
Text message:
Hi guys, I’m in hospital. No school for ten days 😪 Want to know why? I had a bike accident!!! Both knees badly injured. I’ve broken my ankle. Terrible headache. I’ve got to stay in bed for a week. Boooooooooring! CU soon!
Questions:
Where is the writer?
What’s the problem?
Who gets the message?
A:
Imagine the writer of the text message is your friend. Write a text message (30–40 words) to make him/her feel better. Think of the following points:
say how you feel about the fact that he/she can’t come to school
make suggestions what he/she could do to make the time in hospital less boring
say you are going to phone him/her soon
B:
Imagine the writer of the text message above is your friend. Write an email (about 150 words). In your email:
try to make him/her feel better
tell him/her about something funny/interesting that happened in school since he/she has been in hospital
make suggestions what he/she could do while in hospital so it’s less boring
Page 98–99
GRAMMAR
Present perfect
Du verwendest das Present perfect, um über Ereignisse/Handlungen zu berichten, die zu einem unbestimmten Zeitpunkt in der Vergangenheit stattgefunden haben und bis in die Gegenwart andauern bzw. Auswirkungen auf die Gegenwart haben.
Diagramm: Past (Ereignis) → Now (Folge)
Bildung: have/has + Past participle
(3. Form des Verbs)
Ereignis:
He has fallen off his bike.
I’ve lost my cat.
David has broken his leg.
We’ve bought a new car.
They’ve gone on holiday.
She’s cut her finger.
Folge:
es schmerzt
sie ist weg
er hat einen Gips
hier parkt es
sie sind weg
der Finger blutet
Wenn du betonen willst, dass etwas erst vor Kurzem geschehen ist, ergänzt du just zwischen have/has und dem Past participle (3. Form des Verbs).
Beispiele:
I’ve just passed my English test.
He’s just walked into a lamp post.
We’ve just moved house.
(Bildbeschreibung: Eine Gruppe jubelnder Fußballspieler auf dem Feld. Eine Spielerin hebt die Arme zum Jubel, während andere sie umarmen. Im Hintergrund ist ein Torwart zu sehen.)
Bildunterschrift: They’ve just scored a goal.
Past participles
Das Past participle findest du in der dritten Spalte der Verblisten. Bei regelmäßigen Verben hat das Past participle die gleiche Form wie das Past simple. Hänge einfach -ed (oder -d) an die Grundform an.
Beispiele regelmäßiger Verben:
pass – passed – passed
walk – walked – walked
move – moved – moved
Die Formen der unregelmäßigen Verben solltest du am besten auswendig lernen (siehe auch S. 125):
Grundform	Simple Past	Past Participle
go	went	gone
buy	bought	bought
fall	fell	fallen
break	broke	broken
find	found	found
lose	lost	lost
cut	cut	cut
hurt	hurt	hurt
win	won	won
see	saw	seen
be	was/were	been
meet	met	met
put	put	put
write	wrote	written
eat	ate	eaten
think	thought	thought
hit	hit	hit
ring	rang	rung
read	read	read
know	knew	known
tell	told	told

THE STORY OF THE STONES 6
🎬 Farewell!
1 Use the pictures to tell the story of episode 5.
Image descriptions (left to right):
Children face the Queen and a golden glowing character.
The Queen stretches out her hand toward the girl with long brown hair.
The girl looks determined and gestures at something unseen.
The villain (Lord of the Fire) looks angry and raises his arm.
2 What do you think happens to these in the final episode?
Images:
Evil glowing green eyes in the dark.
The three magical stones (blue, green, orange).
The Queen looks peaceful and smiling.
🎥 3 Watch episode 6 and answer the questions.
Why does Sunborn destroy the belt and stones?
 ………………………………………………………………………..
What happens when she destroys the belt and stones?
 ………………………………………………………………………..
What can the children no longer do?
 ………………………………………………………………………..
4 Complete the sentences about you.
My favourite character in The Story of the Stones is
 ...................................................................................................................................
 because ..........................................................................................................................
My least favourite character in The Story of the Stones is
 ...................................................................................................................................
 because ..........................................................................................................................
My favourite scene was ...............................................................................
EVERYDAY ENGLISH
🎥 5 Watch episode 6 again. Complete the sentences (1–4) with the words in the box.
Then match them to the questions (a–d).
Word Box:
 I'm afraid so
 believe me
 it doesn’t matter
 I'm afraid not
Sentences:
That’s right, Daniel. But ......................................................
...................................................... There’s no place for me here on Earth.
The Lord of the Fire still lives. He won’t give up, ......................................................
......................................................, Sarah. But I’ll never forget you.
Match to questions:
 a ☐ Will it all start again?
 b ☐ So we can’t morph any longer?
 c ☐ Does this mean we won’t see you again?
 d ☐ Can’t you stay here?


----- WB: More 2 WB Unit 12.txt -----
UNIT 12 – Feeling bad and feeling better
Page 97
UNDERSTANDING VOCABULARY
Aches and pains
Activity 1:
Look at the picture. Match the sentences with the numbers.
Sentences:
His back hurts.
He has stomach ache.
She has earache.
She has a headache.
Her throat hurts.
He has toothache.
He has a pain in his ankle.
Image description: A hospital waiting room is shown. Seven people are sitting or standing, each labeled with a number from 1 to 7. 1: An elderly man is holding his back with a pained expression. 2: A young woman is holding her head on one side as if she has a headache. 3: A basketball player has one shoe off and is clutching his ankle. 4: A woman in orange is talking to the receptionist and holding her lower back. 5: A girl is standing, holding her throat. 6: A boy is standing, holding his cheek, indicating toothache. 7: An elderly woman is touching her ear as if in pain.
USING VOCABULARY
Aches and pains
Activity 2:
Look at the pictures and complete the crossword puzzle.
Picture clues:
A person holding their cheek in pain – TOOTHACHE (fits 1 Down).
A girl holding her ear – EARACHE (fits 2 Across).
A person rubbing their lower back – BACKACHE (fits 3 Down).
A boy pressing his forehead – HEADACHE (fits 4 Across).
A boy clutching his stomach – STOMACH ACHE (fits 5 Across).
Page 98–99
UNDERSTANDING GRAMMAR
Present perfect / Past participle
Activity 3:
Match the sentences and pictures.
He has broken his toe.
I’ve cut my leg.
She has walked into a lamp post.
She has hurt her back.
He has fallen off his bike.
I think I’ve hurt my ankle.
I’ve eaten too much!
Image description: Seven cartoon characters in different situations: 1: A boy has fallen off his bike and is on the ground, stars around his head. 2: A girl is sitting on the ground next to a lamppost, holding her head. 3: A girl is holding a leg with a cut on it. 4: A boy is standing with a foot turned awkwardly. 5: A boy is sitting with a painful toe. 6: A girl is sitting, holding her lower back. 7: A boy is standing, holding his stomach.
Activity 4:
Complete the table.
Infinitive	Past simple	Past participle
go	went	gone
eat	...	...
have	...	...
do	...	...
want	...	...
play	...	...
see	...	...
think	...	...
ask	...	...
watch	...	...
lose	...	...
win	...	...

Activity 5:
Find nine more past participles. (←→↑↓↘) A word search puzzle is shown with "broken" already found. Space is provided to list the other nine.
USING GRAMMAR
Present perfect / Past participle
Activity 6:
Match the sentence halves.
I’ve fixed – two books.
I’ve read – my bike.
I’ve done – my arm.
I’ve broken – all my homework.
I’ve bought – out of a tree.
I’ve been – an interesting person.
I’ve met – a new dress.
I’ve fallen – to a party.
Activity 7:
Complete the sentences with the present perfect form of the verbs in brackets.
I think I ... my leg. (break)
We ... our cat. (lose)
Dad ... his car. (crash)
You ... your money. (drop)
I ... my homework. (finish)
Mrs Green ... an accident. (have)
They ... house again. (move)
She ... her knee. (hurt)
Activity 8:
What about you? Write down eight things you’ve done this week.
Page 100–101
Activity 9:
Read Rachel’s email and complete it with the verbs in the box. Verbs: passed, broken, bought, hurt, gone, fallen, met, broken
A digital email is shown. Text: Hi Arnold,
How are things? I hope you’re well. I’m writing with all the news about our family. Do you remember my brother Joshua? He has bought a guitar and now he plays music really loud all the time. He wants to start a rock band! But this will take some time because he has broken a finger. And my dad has hurt his arm. He went to sleep on the sofa and fell off! He can’t go to work, so he’s very sad. My aunt and uncle have gone on holiday – to Iceland! My sister Patricia has passed her driving test. Now she drives round and round the town – she never stops! My other brother, Hamilton, has met a girl from Japan and has fallen in love with her. Now he’s learning the language – he wants to go and live in Tokyo!
And me? Well, I’ve hurt my ankle, but when I’m well again, I’m going to leave home. My family are completely mad!
Lots of love,
Rachel
Activity 10:
Complete with the present perfect form of one of the verbs in the box. Verbs: break, eat, pass, want, go, fall
Image clues:
A dog licking an empty bowl.
A girl showing her test paper with a smile.
A woman arriving in town with shopping.
A boy holding his foot in pain.
A child looking up at a boy in a tree.
A girl receiving a box of chocolates from her grandmother.
Sentences:
There’s nothing left. The dog has eaten it all.
I have passed my tests!
Sorry, Jane isn’t here. She has gone into town.
I think I have broken my toe.
Dad! Quickly! Jimmy has fallen out of the tree!
Oh, thanks, Grandma. I have always wanted one of these.
READING & WRITING
Understanding jokes and notes
Activity 11:
Here are some more doctor, doctor jokes. Match them with the endings.
Doctor, doctor. I think I’m a bell. → Doctor: Sit!
Doctor, doctor. I think I’m invisible. → Doctor: Take the legs off your bed!
Doctor, doctor. I dream there are monsters under my bed. What can I do? → Doctor: Take these and if it doesn’t help give me a ring!
Doctor, doctor. I feel like a dog! → Doctor: Next!
Activity 12:
Write the words in the correct order to complete the doctor’s conversations.
Doctor: How are you today?
Amanda: My ankle hurts a bit.
Doctor: Does your leg hurt?
Marc: No, it’s my knee. My knee just hurts.
Doctor: What’s the matter?
Sebastian: My back. I’ve got a pain in my back.
Doctor: Do you feel better today?
Fatima: No. I’ve still got a headache.
Activity 13:
Read the notes and write the names under the pictures. Note 1: Dear Ms Chen, I’m sorry, but Jeremiah can’t come to school today because he can’t find his pet snake. Now he has to look for it.
Note 2: Dear Ms Hamilton, Please excuse my son Gordon from school for the next few days. He is on his way to Hollywood because he wants to be a film star.
Note 3: Dear Mr Cartwright, Michael can’t come to school – he has a very bad stomach ache. The doctor says he must stay at home.
Image descriptions:
1: A boy walking with a suitcase and holding a sign that says "To Hollywood."
2: A boy lying in bed with a thermometer.
3: A boy looking under furniture with a flashlight.
Pages 102–103
Activity 14 Imagine you are a parent. Write two notes for children who cannot go to school.
Note template: Dear __________, Please excuse my __________. He/She __________.
READING
Understanding a text about medicine
Activity 15 – CHOICES
A. Complete the sentences with the words in the box. Then check in the Student’s Book on page 95. There are two extra words. Words in the box: worms, medicine, died, toothpaste, stomach ache, cured, toothache
People in Ancient Egypt __________ toothache with a dead mouse.
They didn’t have any __________ in Ancient Rome.
People believed rotten fish might cure __________.
Patients had to swallow live __________ to cure stomach ache.
Some people __________ because doctors used dangerous methods to help cure their problems.
B. Complete the text with the words in the box. Words in the box: money, medicine, world, river, farming, plants, trees
The Amazon ‘’ in South America is in the middle of a rainforest.
There is a big problem in the rainforest – people cut down the ‘’ because they want to make a lot of ‘’ very quickly. They also cut down the trees and plants* so that they have more land for their ‘’.
The Amazon is a very important place for three reasons. First, it is the home to lots of animals, birds, reptiles and insects.
Second, it is the place where a lot of the world’s oxygen* comes from. Third, there are thousands of ‘’ that are important for making ‘’ that can help against illnesses* like cancer*.
Indian medicine men know how to use the plants to make the medicines. But now there are not very many medicine men, and they are very old. It is important for the ‘__________’ that we learn what they know!
Vocabulary:
plant = Pflanze
oxygen = Sauerstoff
illness = Krankheit
cancer = Krebs
READING
Understanding a text about an accident
Activity 16 – Read the story. Why did Jacob have stomach ache?
What a week!
I’ve had a terrible week! And it started so well. On Monday, I went to football training as usual. We learnt some great skills, but five minutes before the end of the training session, my friend Bilal ran into me and I hurt my ankle. “So sorry, Jacob,” he said. “It was too fast.” I said OK, but my ankle has hurt for five days now.
Anyway, I hobbled* around and, of course, I went to school the next day. On Tuesday we had design and technology. I quite like it. I was busy making a fish from wood, but then I cut my finger. There was a lot of blood and I had to go and see the school nurse. She said it isn’t as bad as it looks. Still, an ankle that hurts, and a finger that hurts too!
Wednesday was OK. I played a bit of football in the park, but nothing happened. The only thing was: it started to rain. When I got home, I was really wet.
No surprise that on Thursday I had a cold. I wanted to stay at home because my throat hurt a lot. But Mum just said, “Don’t talk too much at school.” So I didn’t. My friend and I went to a pizzeria after school, and I had two pizzas because I was so hungry.
That wasn’t such a good idea, because on Friday I had stomach ache. On Saturday and Sunday, I’m going to stay at home. I don’t want any more aches or accidents.
Vocabulary: hobble = humpeln
Activity 16b – Read the story again. How many of these tasks can you do?
Jacob hurt his ankle when crashing into the goal. T / F
Jacob’s ankle has hurt for five days. T / F
Jacob cut his finger in the PE lesson. T / F
Who did he see about his finger?
What did he do on Wednesday?
What was his problem on Thursday?
On Thursday, he and his friend _________________________________.
He ate two pizzas because _________________________________.
At the weekend, he’s _________________________________.
Page 104–105
LISTENING & DIALOGUE WORK – Filling in a form
Activity 18 – Listen to a coach interviewing a volleyball player. Fill in the form below.
Name ____________________________
Date of birth _____________________
Degree* of fitness (1–10):
☐ 1 ☐ 2 ☐ 3 ☐ 4 ☐ 5 ☐ 6 ☐ 7 ☐ 8 ☐ 9 ☐ 10
Have you had any aches recently?
☐ Yes ☐ No
Have you seen a doctor recently?
☐ Yes ☐ No
Which day(s) can you play? ____________________
Vocabulary: degree = Grad
Activity 19 – Work with a partner. Interview him/her to fill in the form.
Form is identical to Activity 18. It is repeated for pair practice.
WORD FILE – Aches and pains
Illustration showing people with labeled pain locations. Words attached to characters:
headache (girl holding her head)
toothache (boy with hand on cheek)
earache (girl covering her ear)
stomach ache (boy holding belly)
pain in ankle (girl sitting, holding ankle)
knee (boy with bandaged knee)
backache (woman stretching her back)
throat (girl with scarf around neck)
MORE Words and Phrases
No.	Word	Example Sentence	Translation
1	bath	I have to give my dog a bath. She’s very dirty.	Bad
2	medicine	The doctor says you should take your medicine.	Medizin
3	memory	Her memory is very good. She can remember lots of facts.	Gedächtnis
4	patient	There are many patient and doctor jokes.	Patient/Patientin
5	spoon	I need a spoon to eat my soup.	Löffel
6	blood	There’s blood on your T-shirt. It’s all red.	Blut
7	lamp post	Ouch – I’ve just walked into a lamp post.	Laternenmast
8	cure	In Ancient Egypt, a dead mouse was a cure for toothache.	Heilmittel
9	to cure	Worms cured stomach ache.	heilen
10	dentist	I want to become a dentist.	Zahnarzt/Zahnärztin
11	to mash	They mashed a dead mouse and mixed it with food to get a paste.	zerdrücken, zerstampfen
12	to mix	I mix my pet’s medicine with its food.	vermischen
13	taste	The taste was very good.	Geschmack
14	toothpaste	In Ancient Rome, people didn’t have toothpaste.	Zahnpasta
15	worm	A worm lives under the ground.	Wurm
16	smell	The smell of fish was really bad.	Geruch
17	first aid	We have first aid classes at school.	Erste Hilfe
18	helpful	She has always been a great and helpful friend.	hilfsbereit
19	horrible	The accident was horrible!	schrecklich
20	pupil	Sam is a very helpful pupil.	Schüler/Schülerin
21	since	I’ve been in hospital since last week.	seit
22	Believe me!	It’s true. Believe me!	Glaub mir!
23	to injure	I don’t want to injure my knee again.	verletzen
24	It doesn’t matter.	It doesn’t matter.	Das macht nichts, egal
25	writer	I don’t know who the writer of this text is.	Schriftsteller/-in

```

## Output contract

Write `content/corpus/units/g2-u12/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u12",
  "briefBank": "2b2627e1bbe4",
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
