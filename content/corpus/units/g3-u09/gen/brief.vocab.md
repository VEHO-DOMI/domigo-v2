# Vocab generation brief — g3-u09 (MORE! 3, Unit 9)

<!-- domigo:gen vocab g3-u09 bank=d66ad0eea339 prompt=346902f9f0f1 -->

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
| g3u09.w.to-dye-your-hair | to dye your hair | deine Haare färben | wordfile | Teen Activities | — | dye your hair | to dye your hair ; dye your hair |
| g3u09.w.to-get-a-tattoo | to get a tattoo | sich tätowieren lassen | wordfile | Teen Activities | — | get a tattoo | to get a tattoo ; get a tattoo |
| g3u09.w.to-hang-out-in-shopping-centres | to hang out in shopping centres | in Einkaufszentren abhängen | wordfile | Teen Activities | — | hang out in shopping centres | to hang out in shopping centres ; hang out in shopping centres |
| g3u09.w.to-go-roller-skating-without-pads | to go roller-skating without pads | ohne Schützer Rollschuh fahren | wordfile | Teen Activities | — | go roller-skating without pads | to go roller-skating without pads ; go roller-skating without pads |
| g3u09.w.to-get-a-nose-stud | to get a nose stud | sich einen Nasenstecker stechen lassen | wordfile | Teen Activities | — | get a nose stud | to get a nose stud ; get a nose stud |
| g3u09.w.to-scroll-through-your-phone | to scroll through your phone | durch dein Handy scrollen | wordfile | Teen Activities | — | scroll through your phone | to scroll through your phone ; scroll through your phone |
| g3u09.w.to-have-a-party-at-home | to have a party at home | zu Hause eine Party machen | wordfile | Teen Activities | — | have a party at home | to have a party at home ; have a party at home |
| g3u09.w.to-buy-your-own-clothes | to buy your own clothes | deine eigene Kleidung kaufen | wordfile | Teen Activities | — | buy your own clothes | to buy your own clothes ; buy your own clothes |
| g3u09.w.to-eat-too-many-sweets | to eat too many sweets | zu viele Süßigkeiten essen | wordfile | Teen Activities | — | eat too many sweets | to eat too many sweets ; eat too many sweets |
| g3u09.w.to-wear-earrings | to wear earrings | Ohrringe tragen | wordfile | Teen Activities | — | wear earrings | to wear earrings ; wear earrings |
| g3u09.w.to-ride-your-bike-without-a-helmet | to ride your bike without a helmet | ohne Helm Fahrrad fahren | wordfile | Teen Activities | — | ride your bike without a helmet | to ride your bike without a helmet ; ride your bike without a helmet |
| g3u09.w.to-come-home-after-ten | to come home after ten | nach zehn Uhr nach Hause kommen | wordfile | Teen Activities | — | come home after ten | to come home after ten ; come home after ten |
| g3u09.w.to-turn-your-music-up-loud | to turn your music up loud | deine Musik laut aufdrehen | wordfile | Teen Activities | — | turn your music up loud | to turn your music up loud ; turn your music up loud |
| g3u09.w.to-go-to-the-disco | to go to the disco | in die Disco gehen | wordfile | Teen Activities | — | go to the disco | to go to the disco ; go to the disco |
| g3u09.w.to-play-video-games-all-day | to play video games all day | den ganzen Tag Videospiele spielen | wordfile | Teen Activities | — | play video games all day | to play video games all day ; play video games all day |
| g3u09.w.to-watch-tv-after-10-o-clock | to watch TV after 10 o'clock | nach 22 Uhr fernsehen | wordfile | Teen Activities | — | watch TV after 10 o'clock | to watch TV after 10 o'clock ; watch TV after 10 o'clock |
| g3u09.w.to-be-allowed-to-do-sth | to be allowed to do sth. | etw. tun dürfen | phrase | — | They are allowed to hold and feed the animals. | be allowed to do sth. | to be allowed to do sth. ; be allowed to do sth. |
| g3u09.w.it-s-a-pity | It's a pity. | Das ist schade. | phrase | — | It's a pity. | — | It's a pity. |
| g3u09.w.strict | strict | streng | phrase | — | Mum's very strict about that. | — | strict |
| g3u09.w.to-adopt | to adopt | annehmen | phrase | — | The Amish are known for being slow to adopt modern technology. | adopt | to adopt ; adopt |
| g3u09.w.community | community | Gemeinschaft ; Gemeinde | phrase | — | There are many different groups, but the strongest community is the Old Order Amish. | — | community |
| g3u09.w.conservative | conservative | konservativ | phrase | — | The most conservative Amish groups don't allow the use of machines. | — | conservative |
| g3u09.w.modern-technology | modern technology | moderne Technologie | phrase | — | Most Amish groups don't use modern technology. | — | modern technology |
| g3u09.w.plenty | plenty | reichlich | phrase | — | We're a church group of 35 families, and we've got plenty to do. | — | plenty |
| g3u09.w.to-pray | to pray | beten | phrase | — | We often get together and pray. | pray | to pray ; pray |
| g3u09.w.to-punish | to punish | bestrafen | phrase | — | You can go to parties and your parents don't punish you for it. | punish | to punish ; punish |
| g3u09.w.it-depends | It depends. | Es kommt darauf an. | phrase | — | It depends. | — | It depends. |
| g3u09.w.to-stay-up | to stay up | aufbleiben | phrase | — | Well, I can stay up, but only on Saturdays. | stay up | to stay up ; stay up |
| g3u09.w.to-invite-sb-over | to invite sb. over | jdn. zu sich einladen | phrase | — | Are you allowed to invite friends over? | invite sb. over | to invite sb. over ; invite sb. over |
| g3u09.w.for-a-change | for a change | zur Abwechslung | phrase | — | I'll write something positive about young people for a change. | — | for a change |
| g3u09.w.journalist | journalist | Journalist/Journalistin | phrase | — | My dad's friend works as a journalist at the local paper. | — | journalist |
| g3u09.w.litter-picking | litter-picking | Müllsammeln | phrase | — | How about we organise a litter-picking day? | — | litter-picking |
| g3u09.w.rude | rude | unhöflich ; unverschämt | phrase | — | When some people asked them to stop, they were rude. | — | rude |
| g3u09.w.unbelievable | unbelievable | unglaublich | phrase | — | They left their rubbish all over the place. It's unbelievable. | — | unbelievable |
| g3u09.w.to-freeze | to freeze | (er-)frieren | phrase | — | She's from a hot country. She'll freeze over here. | freeze | to freeze ; freeze |
| g3u09.w.to-lend | to lend | (ver-)leihen | phrase | — | I could lend her some of my clothes if you like. | lend | to lend ; lend |
| g3u09.w.never-mind | Never mind! | Egal! ; Schon gut! | phrase | — | Never mind! | — | Never mind! |
| g3u09.w.to-remind-sb | to remind sb. | jdn. erinnern | phrase | — | Kate reminds him that Laura is from Portugal. | remind sb. | to remind sb. ; remind sb. |
| g3u09.w.to-sort-out | to sort out | aussortieren | phrase | — | I'm going to sort out my clothes for Bianca. | sort out | to sort out ; sort out |

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
- **g2-u13**: snowy, thunderstorm, cloudy, windy, rainy, sunny, foggy, hot, cold, weather presenter / meteorologist, coast, to continue, cool, degree, dry, formula, to give way, scale, sunshine, temperature, to clear up, fog, forecast, hope, outlook, small talk, thick, towards, Have a nice day!, to make sure, to rise, axe, bright, flash of light, to shine, average, below, generally, inch (pl inches), mild, mile, rainfall, to record, sea level, throughout the year, western, wet, heavy rain, tan, binoculars, career, to earn, to be mad about sth.
- **g2-u14**: roller-skating, sportsman and sportswoman, ice skating, snowboarding, skiing, surfing, mountain climbing, windsurfing, swimming, mountain biking, cycling, skateboarding, to grow up, member, professional, race, serious, to appear, competition, challenge, distance, extreme, flood, to manage, official, rather, to snorkel, to take part (in), without, world record, nil, on one's own, to score, to tackle, waste of time, equipment, success
- **g2-u15**: to feed your pet, to clean out the litter tray, to clean out your pet's cage, to play with your pet, to dry your pet, to stroke, to brush, to walk your pet, to take your pet to the vet, to give your pet a bath, cage, litter tray, vet (veterinarian), to have got a fear of, to keep sb. company, Neither do I., So do I., space, Antarctic Ocean, emperor penguin, to release, sand, pyjamas, to tidy (up)
- **g3-u01**: to give sth. a try, to give up, audition, to have got what it takes, to make it, to be on the way up, to get back to sb., to agree, to belong to, to celebrate, extremely, flute, singer, successful, talented, to spill, whole, critic, brave, not even, suit, unhappy, to waste, to feel, to get tired of sth., lyrics, to make up, record, to seem, to sing along, tune, I can't stand it., I don't mind (it)., to come along, to take place, afterwards, apart from, in my opinion, to be interested in, Me neither.
- **g3-u02**: to buy sth., to listen to music, to try on sunglasses, to pay the bill, to drink/eat sth., to look at sth., to talk on the mobile, coincidence, married, similar, to return, What a ...!, author, member, passenger, to sink, to survive, careless, handbag, I beg your pardon., to steal, thief (pl thieves), North Pole, South Pole, awful, entrance, to hand sth. in, Hold on!, to leave sb. alone, to look forward to sth., queue, to queue (up), to wave, date of birth, Hang on a minute., to achieve (a goal), laugh, note, per cent, speech, stage, to try out
- **g3-u03**: to get to (the airport), to take off, to get on (a plane), to fly (back), to get off (the plane), to suffer from altitude sickness, to land, it takes (an hour), to get into (a car), to rent (a car), to get out of (the car), to drive (home), to set off (for work), to work on (a blog), to get close to (nature), to sleep in a tent, to escape (the midday heat), to cross (a river), to meet up with (people), to become, curious, decision, experience, to explore, journey, on foot, painful, to reach, to sail, traveller, lonely, to criticise, explorer, even though, hut, to turn out, wilderness, to behave, all in all, awake, pretty, unfortunately, departure, flight, to make a reservation, to note, to fix sth., thirsty, impossible, recently, to get lost, to get to know sb./sth., to promise, to recommend
- **g3-u04**: poisonous, aggressive, dangerous, deadly, elegant, stunning, cute, furry, cuddly, cub, Good luck!, polar bear, adorable, bite, to cause, poison, rabies, seal, swan, to bite (off), lizard, to chase away, to complain, injury, to lift, to pull down, to accept, immediately, to advise (sb.) against sth., to bleed, death, to defend, to mistake sth. for sth., on average, scuba diver, shape, to suppose, to take care, victim, to communicate, audience, environment, Hands off!, to inform, to lock sb. up, politician
- **g3-u05**: to be unlucky, to make a wish, to wish for sth., to bring (good/bad) luck, to come true, spooky, to have (good/bad) luck, to believe in superstitions, alarm clock, Any luck?, beside, Do you mind ...?, evil, I'm joking., to ignore, satisfied, to scream, sleeping bag, spirit, superstition, to attract, to enter, haircut, obvious, traditional, to trick, unlucky, to whistle, crack, cuckoo, pavement, rich, to shake, superstitious, to catch a cold, toothbrush, to arrange, I'm sure., lucky charm, salt, seriously
- **g3-u06**: bridge, river, art gallery, square, park, tower, district, building, street, shop, shopping centre, stadium, to burn down, collection, government, the Houses of Parliament, in advance, to photograph, play, prison, to raise, raven, to take a walk, theatre, view, visitor, thrilling, approximately, to cough (up), cruel, empty, fever, to report, path, spectacular, tourist attraction, to experience, traffic, multicultural, contract, to lead, sugar, to earn (money), to save up for, to sign
- **g3-u07**: to fall out with sb., to storm out of, to break up with sb., to mind your own business, to make up with sb., to get on well with sb., It's none of my business., to laugh at sb., to make up one's mind, to make fun of sb., to move, soft toy, to step in, relationship, to own, childhood (no pl), earring, jealous, to keep (a) secret, questionnaire, to tell sb. off, to solve, beloved, nowhere, script, to struggle, to lie to sb., to admit, to blackmail, clumsy, honest, a pile of, rash, unwell
- **g3-u08**: to invent, to experiment, to improve, to discover, to work sth. out, to design, to try out, to produce, bacon, to decorate, dish, fat, invention, crowd, current, to develop, electric (motor), energy, influence, inventor, to invest, perhaps, to be responsible for, to shoot, confident, to impress, soap, device, product, remarkable, to research, wrist, crutches, illness, ramp, wheelchair, to adapt, to attach, glove, housework, automatically, collar, computer science, engineer, inspiration, to repair, to support
- **g3-u09**: to dye your hair, to get a tattoo, to hang out in shopping centres, to go roller-skating without pads, to get a nose stud, to scroll through your phone, to have a party at home, to buy your own clothes, to eat too many sweets, to wear earrings, to ride your bike without a helmet, to come home after ten, to turn your music up loud, to go to the disco, to play video games all day, to watch TV after 10 o'clock, to be allowed to do sth., It's a pity., strict, to adopt, community, conservative, modern technology, plenty, to pray, to punish, It depends., to stay up, to invite sb. over, for a change, journalist, litter-picking, rude, unbelievable, to freeze, to lend, Never mind!, to remind sb., to sort out

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Mangano, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Red, Reihenfolge, Renato, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u09.w.to-dye-your-hair` ← v1 `to dye your hair`: d="To change the colour of your locks using a special product" · s="I really want to _____ bright pink this summer for fun — I'll use permanent colour to change it from brown." · a=["dye your hair","dye my hair","dye her hair","dyed my hair"] · mc=["to cut your hair","to style your hair","to wash your hair"]
- `g3u09.w.to-get-a-tattoo` ← v1 `to get a tattoo`: d="To have a permanent picture or design put on your skin" · s="My older cousin _____ a small rose permanently on her arm for her 18th birthday at the tattoo parlour." · a=["get a tattoo","got a tattoo"] · mc=["to get a haircut","to get a sunburn","to get new clothes"]
- `g3u09.w.to-hang-out-in-shopping-centres` ← v1 `to hang out in shopping centres`: d="To spend time doing nothing special in a mall" · s="Some bored teenagers like to _____ after school, walking around the shops and just meeting friends without buying anything." · a=["hang out in shopping centres","hang out"] · mc=["to study hard in shopping centres","to work in shopping centres","to perform in shopping centres"]
- `g3u09.w.to-go-roller-skating-without-pads` ← v1 `to go roller-skating without pads`: d="To roller-skate without wearing protection on your knees and elbows" · s="It's very dangerous to _____ without pads on your knees and elbows — you could hurt yourself badly if you fall down." · a=["go roller-skating without pads"] · mc=["to go roller-skating with full protective pads","to go for a walk without shoes","to sit on the sofa without cushions"]
- `g3u09.w.to-get-a-nose-stud` ← v1 `to get a nose stud`: d="To have a small piece of jewellery put through your nostril" · s="She asked her parents nervously if she could _____ — a tiny piece of silver jewellery for her nose piercing." · a=["get a nose stud","got a nose stud"] · mc=["to get a new computer","to get a puppy","to get new trainers"]
- `g3u09.w.to-scroll-through-your-phone` ← v1 `to scroll through your phone`: d="To move your finger up and down on your screen to look at things" · s="He spends hours every evening just _____ through his phone, looking at social media photos and videos without really doing anything." · a=["scroll through your phone","scrolling through your phone"] · mc=["to exercise with your phone","to cook with your phone","to sleep with your phone"]
- `g3u09.w.to-have-a-party-at-home` ← v1 `to have a party at home`: d="To invite friends over to celebrate at your place" · s="Can I please _____ a party at home for my 13th birthday? I want to invite 10 friends over for pizza and cake." · a=["have a party at home","had a party at home"] · mc=["to cancel a party","to skip a party","to stay home alone"]
- `g3u09.w.to-buy-your-own-clothes` ← v1 `to buy your own clothes`: d="To choose and pay for what you wear yourself" · s="My parents finally let me _____ my own clothes now with my pocket money instead of them choosing for me." · a=["buy your own clothes","buy my own clothes"] · mc=["to wear hand-me-downs","to share clothes with siblings","to make your own clothes"]
- `g3u09.w.to-eat-too-many-sweets` ← v1 `to eat too many sweets`: d="To have more candy and sugar than is good for you" · s="The dentist strongly said I should stop _____ too many sweets like chocolate and candy, because they're bad for my teeth." · a=["eat too many sweets","eating too many sweets"] · mc=["to eat too many vegetables","to drink too much water","to exercise too much"]
- `g3u09.w.to-wear-earrings` ← v1 `to wear earrings`: d="To put on small pieces of jewellery on your ears" · s="She got her ears pierced last month at the jewellery shop and now she _____ every single day to school." · a=["wear earrings"] · mc=["to wear a hat","to wear gloves","to wear a scarf"]
- `g3u09.w.to-ride-your-bike-without-a-helmet` ← v1 `to ride your bike without a helmet`: d="To cycle without wearing head protection" · s="You shouldn't _____ your bike without a helmet on busy roads — it's really not safe if you fall and hit your head." · a=["ride your bike without a helmet","ride my bike without a helmet"] · mc=["to ride your bike with a helmet","to walk without shoes","to drive a car"]
- `g3u09.w.to-come-home-after-ten` ← v1 `to come home after ten`: d="To arrive at your house later than 10 p.m." · s="My strict parents don't want me to _____ home after ten o'clock at night on school nights — I must be back by 9 pm." · a=["come home after ten","came home after ten"] · mc=["to come home before ten","to stay at home after ten","to leave home after ten"]
- `g3u09.w.to-turn-your-music-up-loud` ← v1 `to turn your music up loud`: d="To increase the volume so everyone can hear" · s="Please don't _____ your music up so incredibly loud right now — I'm trying really hard to study for my exam in my bedroom." · a=["turn your music up loud","turn my music up loud"] · mc=["to turn your music down quietly","to switch your music off","to change your music"]
- `g3u09.w.to-go-to-the-disco` ← v1 `to go to the disco`: d="To spend an evening out dancing at a club" · s="Are you allowed by your parents to _____ to the school disco on Saturday night with loud music and dancing until 11 pm?" · a=["go to the disco","went to the disco"] · mc=["to go to bed early","to go to the library","to stay home"]
- `g3u09.w.to-play-video-games-all-day` ← v1 `to play video games all day`: d="To spend hours and hours on your console or computer without stopping" · s="On rainy boring weekends at home, he really likes to _____ video games all day long from morning until evening on his console." · a=["play video games all day"] · mc=["to read books all day","to do homework all day","to exercise outside all day"]
- `g3u09.w.to-watch-tv-after-10-o-clock` ← v1 `to watch TV after 10 o'clock`: d="To be in front of the screen later than ten in the evening" · s="I'm not allowed to _____ TV after 10 o'clock at night on school nights because mum says I need to sleep." · a=["watch TV after 10 o'clock","watch TV after ten"] · mc=["to watch TV before dinner","to watch TV with family on weekends","to watch TV at lunchtime"]
- `g3u09.w.to-be-allowed-to-do-sth` ← v1 `to be allowed to do sth.`: d="To have permission to do something" · s="We are _____ to use our mobile phones during the 15-minute morning break but not during lessons in the classroom." · a=["be allowed to","allowed to"] · mc=["to be banned from doing sth.","to be forbidden from doing sth.","to be punished for doing sth."]
- `g3u09.w.it-s-a-pity` ← v1 `It's a pity.`: d="A way to say you are sorry about something disappointing" · s="You really can't come to the important football match on Saturday? _____ We really wanted you on the team because we need a goalkeeper." · a=["It's a pity"] · mc=["Great!","How lucky!","Good for you!"]
- `g3u09.w.strict` ← v1 `strict`: d="Having many rules and expecting people to follow them" · s="Our maths teacher Mrs Schmidt is very _____ about homework deadlines — if you don't hand it in on time, you lose marks." · a=[] · mc=["lazy","forgetful","relaxed"]
- `g3u09.w.to-adopt` ← v1 `to adopt`: d="To start using or accepting something new" · s="Our school _____ a new rule last September about mobile phones being banned during all school hours, from 8 am to 3 pm." · a=["adopt","adopted"] · mc=["to forget","to ignore","to remove"]
- `g3u09.w.community` ← v1 `community`: d="A group of people who live in the same area or share something" · s="Everyone in our local _____ helped to clean up the big public park together on Saturday morning, from children to grandparents." · a=["communities"] · mc=["military","prison","school class only"]
- `g3u09.w.conservative` ← v1 `conservative`: d="Preferring traditional ways and not wanting to change" · s="Some _____ elderly people prefer to keep all the old traditions unchanged and don't want anything new or modern to replace them." · a=[] · mc=["progressive","modern","innovative"]
- `g3u09.w.modern-technology` ← v1 `modern technology`: d="New machines, computers and other tools we use today" · s="_____ like smartphones, laptops, and tablets makes our daily lives easier in many ways by connecting us instantly to information." · a=["modern technology"] · mc=["Ancient history","Old-fashioned machines","Outdated equipment"]
- `g3u09.w.plenty` ← v1 `plenty`: d="More than enough, a lot of" · s="There is _____ of hot pizza left in the kitchen for everyone at the party — don't worry, we ordered six large pizzas!" · a=[] · mc=["not enough","very little","hardly any"]
- `g3u09.w.to-pray` ← v1 `to pray`: d="To talk to God or a higher power" · s="Some religious people _____ silently with their hands together before they go to bed at night, thanking God for the day." · a=["pray","prayed"] · mc=["to dance","to sing loudly","to shout"]
- `g3u09.w.to-punish` ← v1 `to punish`: d="To make someone suffer because they did something wrong" · s="My angry parents _____ me for my bad behaviour by taking away my phone and tablet for a whole week." · a=["punish","punished"] · mc=["to reward","to celebrate","to thank"]
- `g3u09.w.it-depends` ← v1 `It depends.`: d="A way to say the answer changes depending on the situation" · s="Are you coming to my party on Saturday? — _____. If it doesn't rain heavily, I'll definitely be there with a present." · a=["It depends"] · mc=["Certainly yes.","Absolutely not.","Definitely no."]
- `g3u09.w.to-stay-up` ← v1 `to stay up`: d="To not go to bed and remain awake late" · s="We _____ awake until after midnight last Friday night watching a really scary horror film on TV with our best friends." · a=["stay up","stayed up"] · mc=["to go to sleep early","to take a nap","to fall asleep"]
- `g3u09.w.to-invite-sb-over` ← v1 `to invite sb. over`: d="To ask someone to come to your house" · s="Can I _____ my best friend Tom for dinner tonight? Mum and Dad said it's okay and there will be enough spaghetti." · a=["invite over","invited over","invite … over"] · mc=["to turn sb. away","to send sb. home","to push sb. out"]
- `g3u09.w.for-a-change` ← v1 `for a change`: d="To do something different from what you usually do" · s="Let's walk to school today _____ — we always take the lazy bus every day, so it would be nice to try something different for once." · a=["for a change"] · mc=["as usual","like always","the same way"]
- `g3u09.w.journalist` ← v1 `journalist`: d="A person who writes news for a newspaper, TV or website" · s="The _____ from the local newspaper wrote a long interesting article about our school's new science lab last week." · a=["journalists"] · mc=["teacher","librarian","student"]
- `g3u09.w.litter-picking` ← v1 `litter-picking`: d="Collecting rubbish from the ground outside" · s="Our class organised a _____ volunteer day to clean up all the rubbish and plastic bottles in the public park." · a=["litter-picking","litter picking"] · mc=["music-making","tree-climbing","flower-planting"]
- `g3u09.w.rude` ← v1 `rude`: d="Not polite, saying or doing things that upset others" · s="It's very _____ to talk loudly with your mouth full of food — close your mouth and finish chewing before you speak." · a=[] · mc=["polite","well-mannered","respectful"]
- `g3u09.w.unbelievable` ← v1 `unbelievable`: d="So amazing or strange that it is hard to believe" · s="The orange and pink sunset over the sea last night was _____! I've never seen anything so beautiful and stunning in my whole life." · a=[] · mc=["ordinary","plain","dull"]
- `g3u09.w.to-freeze` ← v1 `to freeze`: d="To be or become very cold" · s="I forgot to bring my warm winter jacket to school and almost _____ on the long walk home in the snowy cold wind." · a=["freeze","froze","frozen"] · mc=["to boil","to warm up","to sweat"]
- `g3u09.w.to-lend` ← v1 `to lend`: d="To give something to someone for a short time" · s="Can you please _____ me your black pen just for this one lesson? I forgot mine at home on my desk and I'll give it back after." · a=["lend","lent"] · mc=["to keep","to hide from me","to throw away"]
- `g3u09.w.never-mind` ← v1 `Never mind!`: d="A way to say it's OK, don't worry about it" · s="Sorry I'm three minutes late for the meeting! — _____! We literally just started one minute ago, so you haven't missed anything." · a=["Never mind"] · mc=["How terrible!","That's unforgivable!","I'm furious!"]
- `g3u09.w.to-remind-sb` ← v1 `to remind sb.`: d="To help someone remember something" · s="Please _____ me tomorrow morning to bring my big sports bag for PE class — I always forget on Wednesdays." · a=["remind","reminded"] · mc=["to distract sb.","to confuse sb.","to ignore sb."]
- `g3u09.w.to-sort-out` ← v1 `to sort out`: d="To organise things or decide which ones to keep" · s="I really need to _____ my messy wardrobe this weekend and give away all the old clothes I don't wear anymore." · a=["sort out","sorted out"] · mc=["to mess up","to ignore","to leave alone"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 9.txt -----
Unit 9 My world
Pages 74–75
At the end of unit 9 …
 you know
 ☑ 16 words and phrases for teen activities
 ☑ how to use be allowed to and let
you can
 ☑ understand a text about the world of different teenagers
 ☑ understand a text about the Amish
 ☑ understand an interview with two Amish teenagers
 ☑ talk about permission and take part in a group discussion
 ☑ write a short report
 ☑ understand and write messages in a group chat
1 Read the texts quickly. How do Amy and Sean help their local communities?
A helping hand
 Teenagers trying to make a difference
I'm Amy. I'm 13 and I live near Adelaide, which is the capital of South Australia. My parents run a small farm with a difference. It’s a farm for children. They can come with their families or with their school and see what life on an animal farm is like.
 They’re allowed to hold and feed the animals – and it’s all very safe. My parents look after everything.
We let children milk a cow or bottle-feed baby lambs or hold baby chicks. But they aren’t allowed to do these activities without help from someone on the farm. I often help out, but I also spend a lot of my free time on another project: the Murray River.
Adelaide is one of the driest areas in the world so everybody needs a lot of water. Most of that water comes from the Murray River. The farmers want water for their fields, the people want water for their homes, the government wants water for the dams* to produce electricity. The problem is, there is less and less water in the river each year.
So I’ve organised a group to make people aware of this problem. We have a list of rules we want the politicians to make:
 • Don’t let farmers take out so much water from the river.
 • People aren’t allowed to take long showers.
 • People aren’t allowed to waste electricity.
One of the things we do is to take young children to see the river, so they can learn how important it is to protect it.
VOCABULARY: dam = Damm
I'm Sean. I’m 14 and I live in Roundstone. Roundstone is a small village in the west of Ireland and we get lots of tourists because it’s very beautiful. I live there with my mum and my dad and two brothers and one sister. My dad runs a ceramics shop, and many tourists buy presents there. Dad lets us help in the shop sometimes.
And Mum sometimes works for film companies, because Roundstone is a great place for filming nature scenes. It’s a pity we’re never allowed to hang around the film sets. Mum doesn’t let us do that. She’s very strict about it.
My brothers and I are often busy with other things anyway. We help our tourist office by taking tourists on tours of the village and the countryside around it.
 We aren’t allowed to charge money for it, but sometimes tourists give us a tip or buy us an ice cream.
The other thing we do is help the older people of the village. When you’re 75 in Ireland, you have to take a regular driving test every three years, and not everybody passes. Those who aren’t allowed to drive their cars any longer still need food and stuff from the shops, so we ride our bikes to a town called Clifden, which has got more shops, and get the things they need for them.
2 Read the texts again. How many of these tasks can you do?
1 Amy’s parents’ farm only has sheep. T / F
 2 At the farm, kids are always allowed to milk cows. T / F
 3 Adelaide is a very dry area. T / F
 4 The problem with the Murray River is .................................................................
 5 Amy takes children to the river so .................................................................
 6 Sean lives in Roundstone with .................................................................
 7 What are Sean and his brothers and his sister not allowed to do? .................................................................
 8 How do they help tourists? .................................................................
 9 Why do they help old people with shopping? .................................................................
3 Check your answers with a partner. Then listen to the texts.
4 Get together in groups of three or four. Think of three questions you would like to ask Amy and Sean.
Pages 76–77
5 Read the text about the Amish. Where do the biggest groups live?
The Old Order Amish
The Amish are a group of Christian people that ___________________ to 1693. There are many different groups, but the ___________________ community is the Old Order Amish.
 In 2022, there were over 370,000 Old Order Amish in the United States.
 They ___________________ separate from non-Amish people who they call “the English”.
The Amish are known for simple living, plain dress, pacifism and for being slow to adopt modern ___________________.
What is most important for the Amish are the ___________________ of the Church (often called ‘Ordnung’) and family life.
The largest groups live in Pennsylvania, Indiana, and Ohio.
 The most conservative Amish groups don’t allow the use of machines such as ___________________. They believe in hard work using only your hands.
 Of course, there are also groups of Amish people that are not so strict.
6 Read again and fill in the missing words from the box.
keep tractors strongest technology go back rules
LISTENING
7 Listen to the interviews and circle T (True) or F (False).
1 Linda is happy with her life. T / F
 2 Linda doesn’t use a mobile phone very often. T / F
 3 The families in her church group often pray together. T / F
 4 At the time of ‘rumspringa’ you’re allowed to be a bit wild. T / F
 5 Linda met her future husband during ‘rumspringa’. T / F
 6 Jacob likes very big cities. T / F
 7 Jacob followed all the rules during ‘rumspringa’. T / F
 8 Jacob’s family doesn’t use electricity. T / F
 9 Jacob never wants to see his family any more. T / F
 10 Jacob likes a quiet life best. T / F
VOCABULARY Teen activities
8 Look, read and match.
(Images 1–16 depict various teen activities such as shopping, roller-skating, partying, and using smartphones. Each number matches with one of the activities in the list below.)
☐ dye your hair (purple)
 ☐ get a tattoo
 ☐ go roller-skating without pads
 ☐ buy your own clothes
 ☐ have a party at home
 ☐ scroll through your phone
 ☐ go to the disco
 ☐ ride your bike without a helmet
 ☐ come home after ten at the weekend
 ☐ turn your music up really loud
 ☐ eat too many sweets
 ☐ get a nose stud
 ☐ play video games all day
 ☐ watch TV after 10 o’clock
 ☐ wear earrings
 ☐ hang out in shopping centres
Pages 78–79
9 Read the dialogues. Then act them out.
DIALOGUE 1
 A Are you allowed to stay up late and watch TV?
 B It depends.
 A What do you mean?
 B Well, I can stay up, but only on Saturdays.
 A Really? Until when?
 B Until eleven. What about you?
 A When there’s a good film on, my parents let me watch it.
 B Even if it’s a late-night film?
 A Well, if it’s a really good film ... yes!
DIALOGUE 2
 A That’s a beautiful tattoo.
 B Yeah, do you like it?
 A Yes, I do. I’m not allowed to have one. Did it hurt?
 B No, it didn’t hurt at all. It’s fake!
 A Really? Where did you get it? I think I’m going to get one too.
 To scare my mum.
10 Work in pairs. Use the prompts to make short conversations.
🗨️ A Are you allowed to ...?
 🗨️ B Yes, but I’m not allowed to ...
🗨️ A Do your parents let you ...?
 🗨️ B Yes, but they don’t let me ...
✅ go to parties
 ❌ come home very late
✅ invite friends over
 ❌ make a lot of noise
✅ surf the internet
 ❌ use your phone in bed
✅ buy your own clothes
 ❌ dye my hair
✅ go to fast food restaurants
 ❌ eat fast food every day
11 Work in groups. Look at the pictures in 8. Choose three questions. Ask your partners.
(Image shows a group of students talking around a table. Speech bubbles say:
 "Are you allowed to have parties at home?"
 "No, my mum doesn’t allow parties in our flat."
 "It’s OK with my parents, but we aren’t allowed to have the music too loud."
 "We have a garden. I can have parties there.")
A Are you allowed to get a nose stud?
 B No way!
 C Really? Why’s that?
 B My parents hate them! They’ve already said no!
 A Well, I think my parents might let me, but I don’t want to have a stud anyway.
 C Why not?
 A I don’t think studs look cool. What about you?
 C I’m not sure really. My older sister has a nose stud and I think it looks nice, but I don’t want one for myself.
12 Write a group report and read it out to the class.
In our group, one student isn’t allowed to have a nose stud. His parents hate them. One student thinks her parents might allow it, but she doesn’t think studs look cool and so she doesn’t want to have one. Another student doesn’t know if he wants to have a stud or not.
Pages 80–81
13 Read the thread from a group chat.
 Draw the emojis in the spaces.
(Image of a phone screen showing a group chat named “Chat group online”)
Robbie
 Have you heard the news? They aren’t allowing kids in the park after 8 p.m. any more.
Ronja
 What! They can’t do that!
Celina
 😮
Robbie
 The mayor says young people are causing too much trouble there. There was some trouble there last weekend. A group of teenagers were having a party and making a lot of noise, and when some people asked them to stop, they were rude. And then somebody called the police. And when they finally left the park, there was loads of rubbish all over the place.
Conny
 It’s unbelievable. Just because of the behaviour of some kids, none of us are allowed to go there any more. The problem is people are too quick to judge teenagers. I think some people want to believe we’re all the same. They forget there were kids once too!
Celina
 The problem is that those kids who were making trouble will just go and find a new place to do it. They’ll probably start hanging out in the town centre instead.
Robbie
 So what should we do? Any ideas?
Ronja
 I think we should all write to the mayor and let him know what we think of his plans. Let’s send him 100 emails a day!!!
Conny
 😠 Good idea!
Robbie
 No, he’ll just say we’re troublemakers and that’s exactly why he’s closing the park. We need to do something that shows him that we aren’t all the same and that most teenagers are responsible and can be trusted. How about we organise a litter-picking day? We can all meet at the park and clear up all the rubbish.
Ronja
 Yeah – and then we can leave all the bags of rubbish outside of his house. That’s a great idea! I love it!
Celina
 I like it, but maybe not the bit about leaving the rubbish outside the mayor’s house. Hope you were joking, Ronja.
Ronja
 🙂
Robbie
 Brilliant. How about this Saturday? Let’s meet in the park at 9 a.m. My dad’s got a friend who’s a journalist at the local paper. I’ll see if he can come along and do an article on us – something positive about young people for a change.
Celina
 Can’t make it until 10, but I’ll be there.
Ronja
 👍
Conny
 See you there!
14 Imagine you are part of the group chat. Write three entries for the discussion. Write an * in the thread above to show where they go.
15 Listen and repeat. Pay attention to the weak sound of the underlined parts.
1 We aren’t allowed to play in the street.
 2 I’m not allowed to get a tattoo.
 3 My brother and sister aren’t allowed to go out.
 4 We can’t watch television after eleven.
 5 We’re leaving to go and live in another town.
16
 A You have been asked to hand in a short report on what you are (not) allowed to do at school. Write a text of 60–80 words. In your text, write down:
three things that you are not allowed to do
two things you are allowed to do
one sentence about what you think of the rules
B Read the beginning of a chat thread and write five more responses. Consider the following:
Each reply should be short (max. 60 words).
Each reply should refer to the one before it.
One of the replies can be an emoji.
Have you heard the news? The headmaster says we aren’t allowed to take our phones into school as from Monday!!! 😡📵
GRAMMAR
 be allowed to / let
You use be (not) allowed to to say someone has or doesn’t have permission to do something.
I’m not allowed to go out when it’s dark – my parents say it’s too dangerous.
 We aren’t allowed to play ballgames there.
 Are you allowed to have parties at home?
🔍 Match:
 1 You use be allowed to to say □
 2 You use be not allowed to to say □
a you don’t have permission to do something.
 b you have permission to do something.
How to form it: person + be (not) + allowed to + verb
You use (not) let to say that someone gives or doesn’t give permission to do something.
When there’s a good film on, my parents let me watch it.
 I think my parents might let me have a stud anyway.
Negation:
My parents don’t let me dye my hair.
 They don’t let me eat fast food every day.
Pages 82–83
1 Watch or listen to the dialogue. Then read it.
 What is the final thing that Kate offers to do?
Kate So, why did you want to see me, Tom?
 What’s up? You look worried.
 Tom I am. Mum’s just told me.
 Kate Told you what?
 Tom We’ve got a visitor next week. And I’ve got to look after her.
 Kate So? What’s the problem?
 Tom Did you hear what I said. Her – I’ve got to look after her. It’s a girl. Bianca!
 Kate Oh don’t be so silly. Who is she anyway?
 Tom Remember I told you my mum lived in Brazil for a few years when she was younger. Well, she’s the daughter of one of my mum’s Brazilian friends.
 Kate Would you like me to help you?
 Tom Would you? That would be great.
 Kate So what are you so worried about?
 Tom Well, she’s from a hot country. She’ll freeze over here.
 Kate I’m sure she’s thought of that, Tom. But, if not, then I could lend her some of my clothes if you like.
 Tom What if they don’t fit?
 Kate Tom!
 Tom Sorry. That would really help. But another thing. What if her English isn’t very good? How am I going to talk to her?
 Kate I’m sure her English will be fine. But, listen. Why don’t I talk to Laura from school. She’s from Portugal.
 Tom Really? Thanks, Kate. That’s a great idea.
 Kate It’s no trouble. I’m sure you’ll have a great time.
 Tom Yeah, but the worst thing is she’s going to stay in my bedroom. That means I’ve got to sleep on the sofa.
 Kate Do you want me to ask my parents if she can stay with us? She could sleep in my room with me.
 Tom Kate, what would I do without you?
2 Complete the sentences.
Tom is worried because …
Their visitor is from …
Tom’s worried she’ll think the UK is …
Kate says she can borrow …
Tom is also worried he won’t be able …
Kate reminds him that Laura …
Tom is worried because he has to …
Kate is going to talk with …
3 Complete with the verbs in the box.
 ask help talk lend
Kate Would you like me to 1. ………………… you?
 Kate I could 2. ………………… her some of my clothes if you like.
 Kate Why don’t I 3. ………………… to Laura from school.
 Kate Do you want me to 4. ………………… my parents if she can stay with us?
What do you think? Answer the questions.
How will Kate and Bianca get on?
Will the visit be a success?
Watch part 2 of the video and complete Kate’s diary entry.
 TO DO:
Go to book shop and buy a 1. ............................................................
 → Done – Pick up on 2. ............................................................
Sort clothes out for Bianca – 3. ............................................................ and ............................................................
Get Brazilian snacks from shop in 4. ............................................................
UPDATE:
 Don’t believe it! Bianca is 5. ............................................................ because “ ............................................................ ”
4 Complete the sentences. Then check with the dialogue in 1.
Kate Would you like me to help you?
  Tom W……………… y……………… ? That would be great.
Kate I could lend her some of my clothes.
  Tom T……………… . W……………… b……………… . I d……………… w……………… a……………… .
Kate Why don’t I talk to Laura from school. She’s from Portugal.
  Tom R……………… ? T……………… , Kate.
Kate Do you want me to ask my parents if she can stay with us?
  Tom Kate, w……………… w……………… I d……………… w……………… y……………… ?
5 ROLE PLAY: Work in pairs. Look at your role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You are going to spend a month with your Spanish penfriend next week. Make a list of all your worries and of all the things you still need to do before you go. Tell your partner about these things.
Student B
 Listen to your partner’s worries. Offer to help.


----- WB: More 3 WB Unit 9.txt -----
UNIT 9 My world
Page 74–75
UNDERSTANDING VOCABULARY Teen activities
 1 Find 13 activities in the word snake.
dyeyourhairgetatattoogorollerskatingwithoutpads
 uyourclotheshangout
 uyourhomeworksendtextmessages
 endturnyour
 mweekendthe
 atterhome
 omehomea
 rgotothedisco
 urphone
 tooclockeattoomanysweets
USING VOCABULARY Teen activities
 2 Look at the picture. Which of the activities in 1 are these people doing?
They’re having a party at home.
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
 ……………………………………………………………………
[Image description: A cartoon-style picture shows a group of teenagers at home. There are colorful party decorations like bunting, a speaker playing music, snacks on the table, one boy dancing, one girl sitting with a mobile phone, and another girl preparing drinks in the background. It’s a casual teen party scene.]
3 Complete the text with the words from the box.
earrings tattoo bike stud video games dyed computer hang out music
Arguments with parents
 Last week, I had a lot of arguments with my parents. After getting a small
 1 _______________ a month ago, I now wanted a nose 2 _______________ . “No way,” Dad said. “You’ve already got these weird 3 _______________ and you’ve already
 4 _______________ your hair. That’s enough!” So I decided to talk to Mum.
Later, when Mum came into my room, she asked me to turn off the 5 _______________ .
 “You play 6 _______________ all day, or you play loud 7 _______________ all day. Why don’t you get out of the house for a while?”
“OK,” I said and rode my 8 _______________ to the shopping centre. There I could
 9 _______________ with my friends in peace.
UNDERSTANDING GRAMMAR be allowed to / let
 4 Match the signs and the sentences.
[Image description: Six circular red signs with diagonal red lines across them, indicating prohibition.]
 1 – camera with flash
 2 – parked car
 3 – person swimming
 4 – hat
 5 – burger
 6 – person walking on grass
A You aren’t allowed to park here.
 B You aren’t allowed to swim here.
 C You aren’t allowed to walk on the grass.
 D You aren’t allowed to go in here.
 E You aren’t allowed to eat food in here.
 F You aren’t allowed to take photographs.
5 Draw two signs for your bedroom door and write a sentence under each one to explain what they mean.
1
 ……………………………………………………………………
 2
 ……………………………………………………………………
6 Match the questions and answers.
1 Are you allowed to invite your friends over?
 2 Do your parents let you come home late?
 3 Are you allowed to get your hair dyed?
 4 Are you allowed to get a tattoo?
 5 Do your parents let you surf the internet?
 6 Are you allowed to have a pet at home?
 7 Do your parents let you have parties at home?
 8 Does your mum let you drive her car?
☐ Maybe if I choose a nice colour.
 ☐ Yes, but I’m not allowed to go into chat rooms.
 ☐ No, because my dad hates animals.
 ☐ Yes, but I have to be back by 9 p.m. on weeknights.
 ☐ Yes, but we aren’t allowed to make too much noise.
 ☐ No. My dad would kill me.
 ☐ Of course she doesn’t. I’m only 12.
 ☐ Yes, they do if I promise to tidy up after.
Page 76–77
USING GRAMMAR be allowed to / let
7 Look at the sentences in 6 again. Write your own answers to the questions.
 1 ...............................................................................................................
 2 ...............................................................................................................
 3 ...............................................................................................................
 4 ...............................................................................................................
 5 ...............................................................................................................
 6 ...............................................................................................................
 7 ...............................................................................................................
 8 ...............................................................................................................
8 Fill in the correct forms of be allowed to.
“On the school trip, you 1 ____________________________ (not allow) to stay up later than 10 o’clock,” our teacher said. “And you 2 ____________________________ (not allow) to get together in one room and make a lot of noise.” That was before the trip, but during the trip it was even worse.
 We 3 ____________________________ (not allow) to use our mobile phones for games and we
 4 ____________________________ (not allow) to listen to music during meals. “Is there anything we 5 ____________________________ (allow) to do?” I asked the teacher. “I’ll think about it,” he said. “Ask me again next week.” I think teachers like him shouldn’t 6 ____________________________ (allow) to go on school trips.
9 Write sentences using the correct form of be (not) allowed to.
 1 James ✔ watch TV / ✘ not watch TV after 10 o’clock.
 James is allowed to watch TV, but he isn’t allowed to watch TV after 10 o’clock.
2 Sarah ✔ go to bed late / ✘ not get up late.
 ...............................................................................................................
3 We ✔ wear jeans to school / ✘ not wear shorts.
 ...............................................................................................................
4 They ✔ listen to music / ✘ not listen without headphones.
 ...............................................................................................................
5 I ✔ go to my friend’s house / ✘ not stay for the night.
 ...............................................................................................................
6 She ✔ have parties at home / ✘ not play loud music.
 ...............................................................................................................
10 Rewrite the sentences in 9 using let.
 1 James’ parents let him watch TV, but they don’t let him watch it after 10 o’clock.
 2 Sarah’s dad ............................................................................................
 3 The headmaster .....................................................................................
 4 Mum ........................................................................................................
 5 Dad ..........................................................................................................
 6 Her parents ............................................................................................
DIALOGUE WORK Talking about permission
 11 CHOICES
 A Complete the dialogue with the sentences from the box. There are two extra sentences.
 Then listen and check.
a Like what?
 b And are you allowed to spend as much money as you want to?
 c I never go shopping at the weekend.
 d So do you often spend your own money on clothes?
 e Unless what?
 f Are you allowed to buy your own clothes?
 g Me? I spend all my money on clothes.
 h I don’t have enough money.
Amy 1 Are you allowed to buy your own clothes?
 Fred Yes, of course.
 Amy 2 .........................................................................................
 Fred Of course not. Dad gives me some money, and I can’t spend more. Unless ...
 Amy 3 .........................................................................................
 Fred Unless I pay for it myself.
 Amy 4 .........................................................................................
 Fred Never. I’ve got better things to spend my money on.
 Amy 5 .........................................................................................
 Fred Video games, books, music. What about you?
 Amy 6 .........................................................................................
 Fred That’s why you always look so good.
[Image description: A smiling boy is trying on a jacket in a clothing store, with mirrors and hangers in the background. He holds a shopping bag and looks pleased.]
B Put the dialogue in the correct order. Then listen and check.
☐ Sandra Are you allowed to stay out late during the week?
 ☐ Sandra Yeah, I’m allowed to go out till 10 during the week.
 ☐ Sandra Well, say, 10 p.m.
 ☐ Sandra So what time do you have to be back at the weekends?
 ☐ Sandra Wow, it sounds like your parents are pretty strict.
 ☐ Sandra On Saturdays and Sundays I’m allowed out until midnight. What about you?
 ☐ Alison No, I’m not allowed out that late. Are you?
 ☐ Alison What do you mean by late?
 ☐ Alison 11. And Dad always picks me up.
 ☐ Alison And at the weekend?
 ☐ Alison I’m allowed out at the weekend, but not until midnight.
Page 78–79
READING Understanding a text about a teenager
 12 Read the text about a 15-year-old teenager from Wyoming.
MY BLOG
Welcome to JACKSON
Hi, I’m Lisa and I live in Jackson, Wyoming. Jackson is in a valley that is called Jackson Hole. The valley is about 88 km long, and there are a lot of beautiful mountains which are good for skiing.
Anyway, I live in Jackson with my parents and my brother Will. Will is a park ranger like my dad, and they both work in Yellowstone National Park. The entrance to the park is a 45-minute drive away, and Dad and Will often stay there for two or three days because they don’t want to drive too much. They stay at a cabin, and sometimes I’m allowed to go with them.
I really enjoy Yellowstone. There’s so much to do and so much to see. For example, there is the Yellowstone River, which is really impressive. Unfortunately, we don’t often go there because it’s a three-hour drive to a good spot on the river.
When Dad and Will take me to the park, I spend my time watching animals. There’s a large number of birds, and I’ve become quite an expert on them.
But there are also a lot of large animals, like mountain lions, wolves, black bears, grizzly bears – and bison. Many people believe it’s dangerous to meet bears, but they are usually not interested in contact with people. Actually, bison are more dangerous. If they want to protect their young, they will attack you. And they can run pretty fast!
Dad and Will drive around the park and check on the wildlife. But they also check on the people who visit. For example, they make very loud noises outside. Bears hear them and run off. Sometimes tourists come when looking for food. This can be quite dangerous. If people follow the animals, they can come too close.
What else can I tell you about my life here? Well, I still go to school and much of my time I help Mum – or she’s a “mum’s chick” learner, I’m no longer fine. I go skateboarding with my friends. People around me often ski. In winter, we also go skiing and snowboarding. Jackson is a great place to do that. I wouldn’t want to live anywhere else.
VOCABULARY: run – hier: leiten
[Image descriptions:
A photo of a teenage girl with a cap sitting on a skateboard smiling (Lisa).
A “Welcome to Jackson” sign.
Four small photos: A bison, a snow-covered mountain range, a bluebird perched on a fence, and a river in winter.]
13 How many of these tasks can you do?
1 Lisa lives in a valley.                    T / F
 2 Both her parents work as park rangers.             T / F
 3 Her dad and her brother drive to Yellowstone Park every day.  T / F
Complete with no more than 4 words.
 4 They don’t often go to the Yellowstone River because it’s .................................................. .
 5 Bears are usually too .................................................. .
 6 Bison can run .................................................. .
Answer the questions in one sentence.
 7 What is the problem with some tourists?
 ....................................................................................................................
 8 What does Lisa help her mum with?
 ....................................................................................................................
 9 What does she do in her free time?
 ....................................................................................................................
14 Listen and check your answers.
LISTENING
 15 a Listen and write the countries under the photos.
[Image descriptions:
A boy with short hair and a green shirt says: Hi, I’m José and I’m from ________.
A boy with a surfboard in the background says: Hey. My name’s Renato and I’m from ________.
A girl in red with mountains behind her says: My name’s Agripina and I’m from ________.
A girl with dark hair in the forest says: My name’s Raukani and I’m from ________.]
b Write Raukani, Renato, Agripina or José.
1 Who doesn’t go to school? .............................................................
 2 Who lives at a high altitude? .............................................................
 3 Who helps his father grow things to eat? .............................................................
 4 Who likes water sports? .............................................................
 5 Who travels by water? .............................................................
 6 Who gets angry about pollution? .............................................................
 7 Who doesn’t live with his/her sister? .............................................................
 8 Who looks after animals? .............................................................
VOCABULARY: pollution – Umweltverschmutzung
Page 80–81
16
 A Listen again. Write a short report about one of the kids in 15.
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
B Work in pairs. Ask your partner questions about his/her life using the interviews as a model. Then write a short report about your partner.
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
17 Put the words in order to make offers.
 1 some / I / lend / could / you / .
 2 I / brother / his / ask / my / Why / to / don’t / you / lend / .
 3 you / like / Would / you / me / with / to / come / ?
 4 want / you / here / me / have / you / can / to / ask / my / Do / mum / if / it / ?
18 Write the offers from 17 into the correct mini-dialogues.
1 Fred: I want to get a nose stud, but I’m a bit afraid.
   Donna: .................................................................................................................
   Fred: Would you? I’d feel much braver.
2 Jack: I want to go roller-skating, but I can’t find my pads.
   Lana: .................................................................................................................
   Jack: Really? That’s so kind of you.
3 May: Mum won’t let me have a birthday party at home.
   James: .................................................................................................................
   May: That would be really nice. Thank you.
4 Liz: Mum said I can buy my own clothes for the party, but she didn’t give me any money.
   Andy: .................................................................................................................
   Liz: Really? What would I do without you?
19 Listen and check.
20 Read the task and what a student wrote. When can Martin meet?
Task
 Your friend David asked you to get together with a few others for a maths study group. You send him an email (60–80 words) about the idea.
 In your email:
 ✔ say when you have time
 ✔ say where you could meet
 ✔ offer to organise a few things
Email:
FROM: martin_h@mailconnect.com
 SUBJECT: Maths study group
Hi David,
 About that study group for maths: I could meet tomorrow afternoon with you all. Why don’t we use one of the empty classrooms? Would you like me to bring the books or will you? And do you want me to check out if it’s OK to use a classroom? Looking forward to our first meeting.
 See you,
 Martin
Useful Language: Making offers
 • I could …
 • Why don’t I … ?
 • Let me …
 • If you want me to …, I can …
 • It’s no problem for me to …
 • Can I get you … ?
21 Now write your own answer to the following task.
Task
 Your friend Carla asked you to help her with moving her things to her new flat. Write her an email (60–80 words).
 In your email:
 ✔ say when you have time
 ✔ say who else you/she could ask for help
 ✔ offer to organise a few things
.........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
 .........................................................................................................................................................
Page 82
UNIT 9
WORD FILE
 Teen activities
to dye your hair
 to get a tattoo
 to hang out in shopping centres
 to go roller-skating without pads
 to get a nose stud
 to scroll through your phone
 to have a party at home
 to buy your own clothes
 to eat too many sweets
 to wear earrings
 to ride your bike without a helmet
 to come home after ten
 to turn your music up loud
 to go to the disco
 to play video games all day
 to watch TV after 10 o’clock
MORE Words and Phrases
#	Phrase/Word	Example Sentence	German Translation
1	to be allowed to do sth.	They are allowed to hold and feed the animals.	etw. tun dürfen
	It's a pity.		Das ist schade.
	strict	Mum’s very strict about that.	streng
5	to adopt	The Amish are known for being slow to adopt modern technology.	hier: annehmen
	community	There are many different groups, but the strongest community is the Old Order Amish.	Gemeinschaft, Gemeinde
	conservative	The most conservative Amish groups don’t allow the use of machines.	konservativ
	modern technology	Most Amish groups don’t use modern technology.	moderne Technologie
7	plenty	We’re a church group of 35 families, and we’ve got plenty to do.	reichlich
	to pray	We often get together and pray.	beten
	to punish	You can go to parties and your parents don’t punish you for it.	bestrafen
9	It depends.		Es kommt darauf an.
	to stay up	Well, I can stay up, but only on Saturdays.	aufbleiben
10	to invite sb. over	Are you allowed to invite friends over?	jdn. zu sich einladen
13	for a change	I’ll write something positive about young people for a change.	zur Abwechslung
	journalist	My dad’s friend works as a journalist at the local paper.	Journalist/Journalistin
	litter-picking	How about we organise a litter-picking day?	Müllsammeln
	rude	When some people asked them to stop, they were rude.	unhöflich, unverschämt
	unbelievable	They left their rubbish all over the place. It’s unbelievable.	unglaublich
	to freeze	She’s from a hot country. She’ll freeze over here.	(er-)frieren
	to lend	I could lend her some of my clothes if you like.	(ver-)leihen
	Never mind!		Egal!, Schon gut!
	to remind sb.	Kate reminds him that Laura is from Portugal.	jdn. erinnern
	to sort out	I’m going to sort out my clothes for Bianca.	aussortieren

Image Description:
 A teenage girl with red headphones is sitting cross-legged in a blue chair, smiling and looking at her phone. She wears a blue T-shirt and black trousers. Around her, yellow and orange speech bubbles display the vocabulary phrases from the “Teen activities” section.

```

## Output contract

Write `content/corpus/units/g3-u09/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u09",
  "briefBank": "d66ad0eea339",
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
