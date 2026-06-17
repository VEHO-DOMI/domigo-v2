# Vocab generation brief — g3-u02 (MORE! 3, Unit 2)

<!-- domigo:gen vocab g3-u02 bank=35ae89a6b59c prompt=346902f9f0f1 -->

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
| g3u02.w.to-buy-sth | to buy sth. | etw. kaufen | wordfile | Activities | — | buy sth. | to buy sth. ; buy sth. |
| g3u02.w.to-listen-to-music | to listen to music | Musik hören | wordfile | Activities | — | listen to music | to listen to music ; listen to music |
| g3u02.w.to-try-on-sunglasses | to try on sunglasses | Sonnenbrillen anprobieren | wordfile | Activities | — | try on sunglasses | to try on sunglasses ; try on sunglasses |
| g3u02.w.to-pay-the-bill | to pay the bill | die Rechnung bezahlen | wordfile | Activities | — | pay the bill | to pay the bill ; pay the bill |
| g3u02.w.to-drink-eat-sth | to drink/eat sth. | etw. trinken/essen | wordfile | Activities | — | drink/eat sth. | to drink/eat sth. ; drink/eat sth. |
| g3u02.w.to-look-at-sth | to look at sth. | etw. ansehen | wordfile | Activities | — | look at sth. | to look at sth. ; look at sth. |
| g3u02.w.to-talk-on-the-mobile | to talk on the mobile | am Handy telefonieren | wordfile | Activities | — | talk on the mobile | to talk on the mobile ; talk on the mobile |
| g3u02.w.coincidence | coincidence | Zufall | phrase | — | What a coincidence! | — | coincidence |
| g3u02.w.married | married | verheiratet | phrase | — | When they got married, his wife changed her name. | — | married |
| g3u02.w.similar | similar | ähnlich | phrase | — | They both like similar music. | — | similar |
| g3u02.w.to-return | to return | zurückgeben ; zurückkehren | phrase | — | Please return the balloon to the following address. | return | to return ; return |
| g3u02.w.what-a | What a ...! | Was für ein/e ...! | phrase | — | What a mess! | — | What a ...! |
| g3u02.w.author | author | Autor/Autorin | phrase | — | This author wrote a lot of novels. | — | author |
| g3u02.w.member | member | Mitglied | phrase | — | A member of the crew remembered the famous night. | — | member |
| g3u02.w.passenger | passenger | Passagier/Passagierin | phrase | — | Of the 2,200 passengers, only 705 survived. | — | passenger |
| g3u02.w.to-sink | to sink | sinken | phrase | — | When the ship sank, most of its 2,500 passengers died. | sink | to sink ; sink |
| g3u02.w.to-survive | to survive | überleben | phrase | — | Most people didn't survive. | survive | to survive ; survive |
| g3u02.w.careless | careless | unvorsichtig ; leichtsinnig | phrase | — | I've lost my phone because I was careless. | — | careless |
| g3u02.w.handbag | handbag | Handtasche | phrase | — | She put the phone in her handbag. | — | handbag |
| g3u02.w.i-beg-your-pardon | I beg your pardon. | Entschuldigung ; Verzeihen Sie bitte. | phrase | — | I beg your pardon. | — | I beg your pardon. |
| g3u02.w.to-steal | to steal | stehlen | phrase | — | The thief wanted to steal the woman's money. | steal | to steal ; steal |
| g3u02.w.thief | thief (pl thieves) | Dieb/Diebin | phrase | — | The thief was watching the two boys. | — | thief ; thieves |
| g3u02.w.north-pole | North Pole | Nordpol | phrase | — | I want to travel to the North Pole one day. | — | North Pole |
| g3u02.w.south-pole | South Pole | Südpol | phrase | — | An imaginary line connects the North and the South Pole. | — | South Pole |
| g3u02.w.awful | awful | furchtbar ; schrecklich ; scheußlich | phrase | — | There is an awful smell. | — | awful |
| g3u02.w.entrance | entrance | Eingang | phrase | — | They were all queuing up at the entrance. | — | entrance |
| g3u02.w.to-hand-sth-in | to hand sth. in | einreichen ; abgeben | phrase | — | I'm sure someone found it and handed it in. | hand sth. in | to hand sth. in ; hand sth. in |
| g3u02.w.hold-on | Hold on! | Warte(t)! | phrase | — | Hold on! | — | Hold on! |
| g3u02.w.to-leave-sb-alone | to leave sb. alone | jdn. in Ruhe lassen | phrase | — | Lucas didn't leave his sister alone. | leave sb. alone | to leave sb. alone ; leave sb. alone |
| g3u02.w.to-look-forward-to-sth | to look forward to sth. | sich auf etw. freuen | phrase | — | Lucas was very much looking forward to it. | look forward to sth. | to look forward to sth. ; look forward to sth. |
| g3u02.w.queue | queue | Warteschlange | phrase | — | The queue was getting shorter and shorter. | — | queue |
| g3u02.w.to-queue | to queue (up) | sich anstellen | phrase | — | They were all queuing up to get in the museum. | queue | to queue ; queue ; to queue up ; queue up |
| g3u02.w.to-wave | to wave | winken | phrase | — | Someone is waving at us from the front of the queue. | wave | to wave ; wave |
| g3u02.w.date-of-birth | date of birth | Geburtsdatum | phrase | — | We talked about our date of birth. | — | date of birth |
| g3u02.w.hang-on-a-minute | Hang on a minute. | Ein Augenblick (mal). | phrase | — | Hang on a minute. | — | Hang on a minute. |
| g3u02.w.to-achieve | to achieve (a goal) | (ein Ziel) erreichen | phrase | — | Think of a time you were trying to achieve a goal. | achieve | to achieve ; achieve ; to achieve a goal ; achieve a goal |
| g3u02.w.laugh | laugh | Lacher | phrase | — | I got no laugh for my jokes. | — | laugh |
| g3u02.w.note | note | Geldschein | phrase | — | The £50 note was mine. | — | note |
| g3u02.w.per-cent | per cent | Prozent | phrase | — | 50 per cent of the jokes weren't even funny. | — | per cent |
| g3u02.w.speech | speech | Rede ; Ansprache | phrase | — | I'm writing a motivational speech. | — | speech |
| g3u02.w.stage | stage | Bühne | phrase | — | I went to the front of the stage. | — | stage |
| g3u02.w.to-try-out | to try out | ausprobieren | phrase | — | Try out your jokes before you go on stage. | try out | to try out ; try out |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adrian, Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Beatles, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Bolt, Bond, Bottlemen, Box, Bradley, Brian, Bridge, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Celsius, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, Column, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Every, Excuse, Expressing, Fab, Fahrenheit, False, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Hayes, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Jun, Jupiter, Just, Justyna, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kitty, Korea, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Lulu, Luna, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Mott, Mountain, Mr, Mrs, Ms, Mum, Musical, Natasha, Nathan, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Patti, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Robert, Robertson, Rome, Ron, Ronald, Rose, Rosey, Rosie, Ruby, Sacks, Sally, Salma, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Seoul, Sessions, Shannon, Shelter, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spotify, Spotless, Square, States, Station, Steve, Stoke, Stradivarius, Style, Sue, Sunborn, Superstar, Susan, Suzy, Swaton, Sweet, Tag, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, War, Waterloo, Watson, Way, Welcome, Well, White, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u02.w.to-buy-sth` ← v1 `to buy sth.`: d="To get something by paying money for it" · s="I want to _____ a special present for my friend's birthday party on Saturday at the toy shop." · a=["buy","bought"] · mc=["to sell sth.","to give away sth.","to throw away sth."]
- `g3u02.w.to-listen-to-music` ← v1 `to listen to music`: d="To enjoy songs or melodies through your ears" · s="He always puts on his wireless headphones to _____ on the long bus ride to school every morning." · a=["listen to music","listens to music","listening to music"] · mc=["to play music","to compose music","to record music"]
- `g3u02.w.to-try-on-sunglasses` ← v1 `to try on sunglasses`: d="To put on a pair to see if they look good on you" · s="She _____ five different pairs of sunglasses in front of the mirror in the shop to see which looked best on her face." · a=["try on sunglasses","tried on sunglasses"] · mc=["to buy sunglasses","to design sunglasses","to break sunglasses"]
- `g3u02.w.to-pay-the-bill` ← v1 `to pay the bill`: d="To give money for what you owe" · s="After a delicious dinner at the restaurant, my dad _____ at the cash desk with his credit card." · a=["pay the bill","paid the bill"] · mc=["to cook the dinner","to serve the food","to prepare the table"]
- `g3u02.w.to-drink-eat-sth` ← v1 `to drink/eat sth.`: d="To have food or a drink" · s="Would you like to _____ something hot or cold at the café — a coffee, a tea, or a slice of cake?" · a=["drink","eat","drank","ate"] · mc=["to make sth.","to sell sth.","to grow sth."]
- `g3u02.w.to-look-at-sth` ← v1 `to look at sth.`: d="To turn your eyes to see something" · s="We _____ the beautiful photos from our holiday on my phone together last night after dinner." · a=["look at","looked at"] · mc=["to look for sth.","to look after sth.","to look down on sth."]
- `g3u02.w.to-talk-on-the-mobile` ← v1 `to talk on the mobile`: d="To have a conversation on your phone" · s="Please don't _____ during class with your phone — put it away now and focus on the lesson." · a=["talk on the mobile","talking on the mobile"] · mc=["to text on the mobile","to read on the mobile","to play on the mobile"]
- `g3u02.w.coincidence` ← v1 `coincidence`: d="When two things happen at the same time by chance" · s="We wore exactly the same red dress to the party — what a _____! Neither of us knew in advance." · a=["coincidences"] · mc=["plan","rehearsal","agreement"]
- `g3u02.w.married` ← v1 `married`: d="Having a husband or wife" · s="My aunt and uncle got _____ last summer in a beautiful garden ceremony with 100 guests." · a=[] · mc=["divorced","separated","single"]
- `g3u02.w.similar` ← v1 `similar`: d="Almost the same but not exactly" · s="Your new red handbag and mine are very _____. They are both the same size and colour." · a=[] · mc=["different","opposite","nothing alike"]
- `g3u02.w.to-return` ← v1 `to return`: d="To go back to a place, or to give something back" · s="Please _____ the library book about dinosaurs before Friday, or you will have to pay a late fee." · a=["return","returned"] · mc=["to keep","to take","to find"]
- `g3u02.w.what-a` ← v1 `What a ...!`: d="An expression to show surprise or a strong feeling" · s="_____ beautiful sunny day outside with blue sky and warm temperatures! Let's go to the park!" · a=["What a"] · mc=["What ...","Such a ...","Very ..."]
- `g3u02.w.author` ← v1 `author`: d="A person who writes books or stories" · s="This famous children's book _____ has written more than twenty adventure novels for young readers aged 10-14." · a=["authors"] · mc=["reader","librarian","printer"]
- `g3u02.w.member` ← v1 `member`: d="A person who belongs to a group or club" · s="Every _____ of our football club got a gold medal and certificate at the end-of-season party last Friday." · a=["members"] · mc=["visitor","fan","coach"]
- `g3u02.w.passenger` ← v1 `passenger`: d="A person who travels in a bus, train, car or plane" · s="Every _____ on the aeroplane had to fasten their seatbelt tightly before take-off from Vienna airport." · a=["passengers"] · mc=["pilot","air steward","mechanic"]
- `g3u02.w.to-sink` ← v1 `to sink`: d="To go down below the surface of water" · s="The small toy wooden boat started to _____ slowly to the bottom of the swimming pool with water inside it." · a=["sink","sank","sunk"] · mc=["to float","to swim","to jump"]
- `g3u02.w.to-survive` ← v1 `to survive`: d="To stay alive after something dangerous" · s="The cat fell from the tall tree but _____ the fall without any serious injuries — it landed on its feet." · a=["survive","survived"] · mc=["to die","to disappear","to faint"]
- `g3u02.w.careless` ← v1 `careless`: d="Not thinking enough about what you do" · s="He was _____ with his new phone and dropped it on the hard concrete ground because he wasn't paying attention." · a=[] · mc=["careful","cautious","attentive"]
- `g3u02.w.handbag` ← v1 `handbag`: d="A small bag for carrying personal things" · s="She put her keys, wallet, phone, and lipstick neatly in her small leather _____ before leaving the house." · a=["handbags"] · mc=["school bag","suitcase","backpack"]
- `g3u02.w.i-beg-your-pardon` ← v1 `I beg your pardon.`: d="A polite way to say sorry or to ask someone to repeat something" · s="_____. I didn't quite hear what you said. Could you please repeat that a bit louder?" · a=["I beg your pardon"] · mc=["Goodbye.","Thank you.","You're welcome."]
- `g3u02.w.to-steal` ← v1 `to steal`: d="To take something that is not yours" · s="Someone _____ my expensive red bicycle from the school yard last week without permission, and I never got it back." · a=["steal","stole","stolen"] · mc=["to borrow","to fix","to paint"]
- `g3u02.w.thief` ← v1 `thief (pl thieves)`: d="A person who steals things" · s="The police finally caught the _____ who took the old woman's handbag at the train station last Tuesday." · a=["thief","thieves"] · mc=["victim","witness","police officer"]
- `g3u02.w.north-pole` ← v1 `North Pole`: d="The very top point of the Earth" · s="It is extremely cold at the _____ where polar bears live on the ice in the far north of Earth." · a=["North Pole"] · mc=["equator","beach","desert"]
- `g3u02.w.south-pole` ← v1 `South Pole`: d="The very bottom point of the Earth" · s="Penguins live near the _____ in the icy cold south of Earth where it snows almost every day of the year." · a=["South Pole"] · mc=["North Pole","equator","desert"]
- `g3u02.w.awful` ← v1 `awful`: d="Very bad or unpleasant" · s="The weather last Saturday was absolutely _____ — it rained heavily all day and we couldn't go outside at all." · a=[] · mc=["wonderful","perfect","lovely"]
- `g3u02.w.entrance` ← v1 `entrance`: d="The door or opening where you go into a place" · s="We'll meet at the main _____ of the big shopping centre at three o'clock in the afternoon near the big fountain." · a=["entrances"] · mc=["exit","car park","roof"]
- `g3u02.w.to-hand-sth-in` ← v1 `to hand sth. in`: d="To give something to a person in charge" · s="Don't forget to _____ your homework to the teacher before Friday morning or you will lose marks." · a=["hand in","handed in"] · mc=["to throw sth. away","to lose sth.","to keep sth."]
- `g3u02.w.hold-on` ← v1 `Hold on!`: d="A way to tell someone to wait" · s="_____! I need to tie my shoelaces properly before we can start running to catch the bus." · a=["Hold on"] · mc=["Go away!","Leave me!","Don't wait!"]
- `g3u02.w.to-leave-sb-alone` ← v1 `to leave sb. alone`: d="To stop bothering someone" · s="Please _____! I need some quiet peaceful time by myself to finish my school project without interruptions." · a=["leave alone","left alone"] · mc=["to bother sb.","to annoy sb.","to follow sb."]
- `g3u02.w.to-look-forward-to-sth` ← v1 `to look forward to sth.`: d="To feel happy about something that will happen" · s="I am very _____ to the exciting school trip to Rome next week — we're going to see the Colosseum!" · a=["look forward to","looking forward to","looked forward to"] · mc=["to worry about sth.","to give up sth.","to put off sth."]
- `g3u02.w.queue` ← v1 `queue`: d="A line of people waiting for something" · s="There was a long _____ of thirty people waiting to buy ice cream at the popular shop in the town square." · a=["queues"] · mc=["crowd","party","mess"]
- `g3u02.w.to-queue` ← v1 `queue`: d="A line of people waiting for something" · s="There was a long _____ of thirty people waiting to buy ice cream at the popular shop in the town square." · a=["queues"] · mc=["crowd","party","mess"]
- `g3u02.w.to-wave` ← v1 `to wave`: d="To move your hand to say hello or goodbye" · s="She _____ her hand high in the air at her best friend across the crowded playground to get her attention." · a=["wave","waved"] · mc=["to hide from","to ignore","to turn away from"]
- `g3u02.w.date-of-birth` ← v1 `date of birth`: d="The day, month and year when you were born" · s="Please write your _____ on the form — we need the exact day, month, and year you were born." · a=["date of birth"] · mc=["first name","address","phone number"]
- `g3u02.w.hang-on-a-minute` ← v1 `Hang on a minute.`: d="A way to ask someone to wait a short time" · s="_____, I just need to find my house keys before we can leave. Don't go without me." · a=["Hang on a minute","Hang on"] · mc=["Hurry up!","Leave now!","Go ahead!"]
- `g3u02.w.to-achieve` ← v1 `to achieve (a goal)`: d="To get what you wanted after trying hard" · s="She worked really hard all year and finally _____ her goal of getting straight As on her school report." · a=["achieve","achieved"] · mc=["to forget (a goal)","to give up (a goal)","to fail (a goal)"]
- `g3u02.w.laugh` ← v1 `laugh`: d="The sound you make when something is funny" · s="His funny joke about the chicken crossing the road got a big loud _____ from the whole class of 30 students." · a=["laughs"] · mc=["sigh","yawn","frown"]
- `g3u02.w.note` ← v1 `note`: d="A piece of paper money" · s="She found a €20 paper _____ on the ground near the bus stop and handed it to her teacher to find the owner." · a=["notes"] · mc=["coin","receipt","letter"]
- `g3u02.w.per-cent` ← v1 `per cent`: d="A part of a hundred, shown with the % sign" · s="About 80 _____ of the students in our year group passed the difficult maths test on the first try." · a=["per cent","percent"] · mc=["euros","hours","metres"]
- `g3u02.w.speech` ← v1 `speech`: d="A talk given to a group of people" · s="The headteacher gave a short 5-minute welcome _____ at the whole-school assembly on the first day of term." · a=["speeches"] · mc=["song","video","book"]
- `g3u02.w.stage` ← v1 `stage`: d="The raised area where actors or singers perform" · s="The rock band walked onto the brightly lit _____ and the huge crowd of 5000 fans cheered loudly." · a=["stages"] · mc=["audience","dressing room","bar"]
- `g3u02.w.to-try-out` ← v1 `to try out`: d="To test something to see how it works or if you like it" · s="I really want to _____ this new board game — my friend says it looks really fun and interesting." · a=["try out","tried out"] · mc=["to throw away","to sell","to hide"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 2.txt -----
Unit 2 Would you believe it?
Pages 16–17
At the end of unit 2 …
 you know
 ☐ 8 phrases for activities
 ☐ how to use the past continuous
can
 ☐ understand a short documentary video
 ☐ understand, talk and ask about past events
 ☐ understand and tell a story about coincidences
can
 ☐ write an ending to a story
 ☐ set goals and learn from your mistakes
🎥 Teen Talk 1
1 a Watch the video. How many stories about coincidences do Mia and Jack tell?
b Circle T (True) or F (False).
 1 Two men called Jim met for the first time when they were 39 years old. T / F
 2 Both men had a son and a dog. T / F
 3 The two girls had the same name and they both found a balloon. T / F
 4 Both girls had a brown dog. T / F
2 In pairs, tell each other as much as you can remember about each story.
 Do you think the stories are true? Why (not)?
READING
3 a Before you read the text, go through it quickly and find out:
 • where the accidents happened
 • the names of the ships
CRAZY BUT TRUE – The Titanic disaster story
 In 1898, the American author Morgan Robertson wrote a novel called Futility.
 It is about a huge ship on its first trip from the UK to America. In the story this “unsinkable” ship hits an iceberg halfway across the ocean. It sinks and most of its 2,500 passengers die. The name of this fictional ship? The Titan.
Fourteen years later in real life, the world’s most famous ship, the Titanic, was also crossing the Atlantic when it hit an iceberg. Of the 2,200 passengers, only 705 survived. And there are more similarities between these two stories. Both ships were crossing the ocean in April and both were big and fast and had very few lifeboats.
But the coincidences don’t stop there. In 1935, another ship was crossing the Atlantic in April. This time it was travelling from England to Canada.
As the ship got close to the area of the Titanic tragedy, one of the crew remembered the famous ship and called the captain to stop. When the ship finally stopped, it was metres away from a giant iceberg. All the crew were saved. And the name of that ship? The Titanian!
b Now read the text carefully. Then answer the questions.
1 Which of these ships were real?
 2 How many passengers died in the Titanic disaster?
 3 What coincidences between the Titan and the Titanic are there?
 4 Where was the Titanian going to in 1935?
 5 Why did a member of the Titanian crew ask the captain to stop the ship?
 6 How long after Robertson’s book did the Titanian nearly hit an iceberg?
VOCABULARY Activities
4 Study the picture for half a minute. Then cover it up.
Image description for Activity 4:
 A colorful and busy illustration of a shopping street or mall scene. From left to right:
A Media Shop stand with a man and woman talking near posters and CDs.
A News stand with magazines and newspapers.
People walking around or talking.
A woman and child eating ice cream.
A man at a table reading a newspaper.
A woman sitting alone with a drink.
A shop with the sign TUNES selling music and tablets.
A woman on her phone walking past a man in black watching her.
5 What did the man in black see? Tell your partner. Then check with the picture.
| The man with a brown hat | buying | on her mobile. |
 | The man with a green cap | drinking | the bill. |
 | The woman with a baby | eating | some tablets. |
 | A man in shorts | was listening | sunglasses. |
 | A boy and a girl | were talking | orange juice. |
 | The woman at the table | trying on | a newspaper. |
 | Two boys | paying | to music. |
 | Two girls | looking at | ice cream. |
SPEAKING & LISTENING Talking about past events
6 With a partner try to guess what happened next in the picture above. Use these phrases.
The man in black saw that …
 … went to the police.
 Suddenly the … shouted, “My money!”
 Suddenly he saw …
7 🎧 Listen to what happened. Then correct these sentences.
 1 The thief was watching the two boys and the woman with the mobile phone.
 2 He decided that he wanted to steal the woman’s money.
 3 Suddenly the woman noticed that her money was missing.
 4 She went to the police station and saw a handbag on a policewoman’s desk.
 5 The mobile phone looked exactly like hers.
 6 When the policeman opened the handbag, there was a photo of the woman’s boyfriend.
 7 The woman found out that her boyfriend was the policewoman’s brother.
 8 The policewoman phoned the brother up and told him the story of the coincidence.
Pages 18–19
READING Understanding a story about coincidences
8 Read the information box quickly and find out.
1 Where was the photo taken?
 2 Why do lots of tourists visit this place every year?
Did you know?
 The Greenwich Meridian is an imaginary line around the Earth that connects the South Pole and the North Pole. It divides* the eastern and western hemispheres* of the Earth – just as the Equator divides the northern and southern hemispheres. With these two imaginary lines to guide them, people were able to create the first precise maps of the world.
 VOCABULARY: divide – trennen; hemisphere – Hemisphäre, Erdkugelhälfte
(Image description: A pair of feet stands on either side of a brass line in the ground. The caption reads:)
 Thousands of people come to visit the Royal Greenwich Museum every year. They want their picture taken standing with one foot in the eastern hemisphere, and the other in the western hemisphere.
9 Look at the pictures first. Guess what the story is about. Then read the text.
The lost phone
 Image description: A large group of people, mostly children and teenagers with backpacks, are queuing at the entrance of the Greenwich Museum on a sunny day. There is also a small image of the observatory dome included in the circular inset.
It was a great day. The sun was shining and we were having a lot of fun. But then, we saw the people. Lots of them. They were all queuing up at the entrance of the Greenwich Museum.
We were there with our kids, Amelia and Lucas. They wanted to see the Meridian. Lucas was very much looking forward to it. “We learnt about it in science,” he said.
While we were waiting, Amelia suddenly cried out.
“Oh no,” she said.
 Quite a few people turned around to look at us.
“What is it?” my husband said. “Why aren’t you leaving your sister alone, Lucas?”
 “Honestly, I didn’t do anything,” Lucas said.
 “That’s right,” added Amelia. “Lucas didn’t do anything; it’s just that I’ve lost my phone. We’ve got to go and look for it.”
 “Don’t panic,” I said. “When did you last have it?”
 “At the River Gardens Café. I took a few pictures and sent them to Grandma. It’s awful. Can we go back there?”
 “Maybe you lost it on the way here,” my husband suggested.
 “Or someone took it out of your pocket?” Lucas asked.
 “No way,” Amelia said.
 “Please, please, please. Let’s go back and check.”
“Look, Amelia,” I said. “We’ve paid for the tickets to see the Meridian. Let’s do that first. We can go back to the café afterwards. I’m sure someone found it and handed it in to the café.”
 Amelia was crying a little bit, but I said it would be alright. And the queue was getting shorter and shorter.
“Look, Dad! I think someone was using it at the front of the queue,” Lucas said suddenly.
 “I can’t see who it is. I’ll go and check?”
 “Sure,” my husband said.
When Lucas came back, he said, “It’s your friends, Margaret and Dave Buckell from Scotland.”
 “What?” my husband said. “I can’t believe it. We haven’t seen them for more than a year, and now we’re meeting them here! What a coincidence!”
The queue was now moving a bit faster.
 “They’ll wait for us inside,” Lucas said.
A few minutes later, we were in. We looked at the Meridian, took some photos, and then we met up with the Buckells.
 “How amazing to see you here,” my husband said.
 “Well, we’re spending a few days with Margaret’s sister in London, and so we thought it would be a good idea to come here for a change,” said Dave. “And kids, what about you? Are you alright?”
 “I am,” Lucas said, “but Amelia isn’t.”
 “Oh dear, why not?” Margaret wanted to know.
 “I’ve lost my mobile! And I wanted to go back to the café, but Mum said …”
 “Hold on, hold on,” Dave said. “Which café was that?”
 “The River Gardens Café,” Amelia said.
 “That’s funny,” Margaret said. “We picked up some coffee to go from there before we came here. I think her mum was quite worried by something.”
 “Another coincidence,” I said.
 “Let’s go back and find out,” my husband said.
Margaret continued, “While Dave was getting the coffee, I sat down at a nearby table. And there, on the table – was a mobile phone.”
 “Really?” Amelia shouted. “What did you do with it?!”
Pages 20–21
10 How many of these tasks can you do?
Circle T (True) or F (False).
1 The family weren’t enjoying the day. T / F
 2 Lucas didn’t know what the Meridian was. T / F
 3 In the queue Lucas started to annoy Amelia. T / F
Complete the sentences with no more than 4 words.
4 Amelia was upset because she couldn’t …
 5 Amelia last used her phone to send some …
 6 Amelia’s mum is sure someone …
Answer the questions.
7 Why are the Buckells in London? ....................................................
 8 Where did Margaret find the mobile phone? ....................................................
 9 What are the two coincidences in the story? ....................................................
11 🎧 Check your answers with a partner. Then listen to the story.
12 Read and complete the summary of the story The lost phone. Then check with a partner.
Two English children, Amelia and Lucas, were in Greenwich with their parents. It was a beautiful day and the sun 1 ____________________________________________________. The family wanted to see the Greenwich Meridian. When they arrived, they saw a lot of people. They were all 2 ____________________________________________________ at the entrance. Suddenly, Amelia noticed that she 3 ____________________________________________________ any more. She remembered that she last had it 4 ____________________________________________________. The girl wanted to go back straight away. Mum said it was best to see 5 ____________________________________________________ first and then go and look for the phone.
The family went inside and looked at the Meridian. They 6 ____________________________________________________, and then they had a chat with the Buckells from Scotland. They are friends of the children’s parents, and it was 7 ____________________________________________________ that they were at the place on the same day. When they heard the story of the missing mobile, they remembered that they saw a mobile on 8 ____________________________________________________ at the River Gardens Café. When Amelia heard that, she 9 ____________________________________________________ what they did with it.
13 🎧 Read and listen to the poem.
The coincidence
I saw her at the bus stop.
 She looked a lot like me.
 I asked her, “Have we ever met?”
 We went to have some tea.
She said, “My name is Deborah.”
 I said, “That’s my name, too.”
 She said, “I am from Chichester,
 but tell me more of you.”
We talked and talked and soon found out
 that so much was the same:
 our date of birth, our favourite film,
 and both our pet dogs’ names.
“It’s time to go. Goodbye,” she said.
 She walked out through the door.
 And me? I am still sitting here,
 just looking at the floor.
14 How many coincidences can you find with your classmates? Ask questions and write names in the table.
Image description: Four children are speaking in comic-style speech bubbles.
Girl 1: What were you doing at 8 p.m. last night?
 Girl 2: Me too! What a coincidence!
 Boy 1: Hang on a minute. Oh, I know. I was walking my dog.
 Girl 3: What day of the month were you born on?
 Boy 2: I was born on the 5th. What about you?
 Girl 3: I was born on the 14th.
Find someone who | Name
 1 was doing the same thing as you at 8 p.m. last night. | ........................................................
 2 was doing the same thing as you last Sunday at 11 a.m. | ........................................................
 3 was born on the same day of the month as you. | ........................................................
 4 likes the same singers as you. | ........................................................
 5 has got the same number of brothers and sisters as you. | ........................................................
15 🎧 Listen and repeat the words.
1 waiter woman wonderful went when
 2 very video voice visit vegetable
16 WRITING
A Write an ending to the story on pages 18–19 (60–80 words). Use the questions below to help you.
 • Did they go back to the café?
 • Did Amelia get her mobile phone?
 • What happened then?
B Write what happened next in the story (100–120 words). Use the beginning below to help you.
They hurried back to the café. Amelia asked the waiter about her phone, but he ...
Pages 22–23
GRAMMAR
 🎧 Past continuous
How to use it:
 (1) You use the past continuous to talk or write about a longer action that happened at a certain time in the past.
What were you doing at 8 o’clock?
 I was walking my dog.
(Illustration description: A hunter is sitting in a tree, looking through binoculars. Below, forest animals gather and seem to be plotting a plan. A speech bubble says: “While the hunter was looking through his binoculars, the animals got an idea.”)
(2) You also use the past continuous to describe what happens at the beginning of a story (in the background). When the actual action begins, you often use the past simple.
It was a great day. The sun was shining and we were having a lot of fun. But then, we saw the people. Lots of them. They were all queuing up at the entrance of the Greenwich Museum.
The Titanic was crossing the Atlantic when it hit an iceberg.
📘 Look at the examples above. Then complete the rule with past simple and past continuous.
You often use the ’ ………………………………………’ for longer actions in the past, that are interrupted by a shorter action. You use the ’ ………………………………………’ for the shorter action.
How to form it:
 To form the past continuous, we use the past tense of be and the –ing form of the verb.
🖊️ Read and write (1) or (2).
☐ The children were sleeping. Mum and Dad were watching TV in the living room. Suddenly, Blackie the dog started to bark.
 ☐ The detective was driving down the street. It was raining. The wind was blowing hard. Nobody was walking in the street. Suddenly, he saw a man with a knife on the other side of the street.
 ☐ At 6 o’clock I was having a shower.
➡️ Now go back to page 16. ✔️ Check with a partner what you know / can do.
OUR YOUNG WORLD 1
 🎥 Ruby’s talent show coincidence
1 Watch the video. How much of her act did Ruby do?
 ........................................................................................................................
2 Watch again and answer the questions.
 1 How much was the prize for the talent show? ..............................................................................
 2 Why did her mum and dad suggest doing jokes? ........................................................................
 3 How did she find her jokes? ..................................................................................................................
 4 How many school children watched the show? ..............................................................................
 5 How many acts were there in the show? .........................................................................................
 6 Who won the talent show? ...................................................................................................................
FIND OUT
 🎯 Trying to achieve a goal
3 Match the verb with the noun.
1 to draw    2 to learn    3 to achieve
⬜ from a mistake
 ⬜ a goal
 ⬜ the right conclusion
4 Write the phrases from 3 next to the correct definition.
1 To see where you went wrong and make sure you don’t do it again. – ..............................
 2 To look at all the information you have to help you make a correct decision. – ..............................
 3 To know what you want and how to get it. – ..............................
Learning from mistakes
5 In pairs, discuss these questions about the video.
1 What goal was Ruby trying to achieve?
 2 What mistakes did she make?
 3 What conclusions did she draw from her mistakes?
(Speech bubbles on the right side of the page):
 “She didn’t find out if her jokes were funny before she memorised them.”
 “Never go last in a talent show.”
CYBER PROJECT: My motivational speech
6 Think about a time you were trying to achieve a goal and made mistakes. Think about:
 • What was the goal?
 • What mistake(s) did you make?
 • What did you learn from your mistake(s)?
Use your story to prepare a motivational speech and make a video of it.


----- WB: More 3 WB Unit 2.txt -----
UNIT 2 Would you believe it?
Pages 12–13
UNDERSTANDING VOCABULARY Activities
1 Look at the objects. Say which of these things you can …
 1 pay 2 try on 3 listen to 4 talk on
 5 buy 6 drink 7 eat 8 look at
Sometimes more than one answer is possible.
Image description: Various items scattered around the page — a green T-shirt, a newspaper, a teacup and saucer with tea, a sandwich, a receipt, a pair of sunglasses, and music notes on a staff. These represent the vocabulary items used in the exercise.
USING VOCABULARY Activities
2 Complete the sentences with verbs and objects from 1. Use the correct tense.
1 They were so angry that they left the restaurant and they didn’t _________________________.
 2 I _________________________, but they didn’t look good on me.
 3 I don’t think he can hear you. He’s _________________________.
 4 Don’t try and ask Mum anything. Can’t you see she’s _________________________ with her sister.
 5 I read the news online. I never _________________________.
 6 No, thanks. I already _________________________ this morning with my breakfast.
 7 I’m not hungry. I _________________________.
 8 She’s _________________________ in the shop window.
3 Choose the correct option to complete the sentences.
1 My mum spends hours looking _____ paintings when we go to the art gallery.
  □ for □ at □ on
2 Put your money away. I’ll _____ for the lunch.
  □ pay □ buy □ try on
3 Can I try _____ this jumper, please?
  □ over □ on □ –
4 Be quiet. Can’t you see I’m talking _____ the phone.
  □ at □ by □ on
5 I need to _____ a new pen.
  □ pay □ buy □ try on
6 I always listen _____ music before I go to sleep.
  □ for □ to □ –
UNDERSTANDING GRAMMAR Past continuous
4 Match the sentence halves.
1 □ At 9 a.m. I was walking
 2 □ At 10 a.m. I was trying
 3 □ At 11 a.m. I was doing
 4 □ At 12 a.m. I was playing
 5 □ At 1 p.m. I was eating
 6 □ At 2 p.m. I was talking
 7 □ At 3 p.m. I was waiting
 8 □ At 4 p.m. I was sitting
 9 □ At 5 p.m. I was helping
 10 □ At 6 p.m. I was washing
 11 □ At 7 p.m. I was doing
 12 □ At 8 p.m. I was sleeping
a □ in detention.
  b □ the piano in the music lesson.
  c □ my homework.
  d □ Mum in the kitchen.
  e □ up the dishes.
  f □ outside the headmaster’s office.
  g □ not to fall asleep while my maths teacher was talking.
  h □ at my desk.
  i □ to my friends in the French lesson
    (my teacher wasn’t happy).
  j □ my lunch.
  k □ to school.
  l □ experiments in the science lesson.
Image descriptions:
 – A boy walking with a backpack, passing a school wall.
 – A boy playing a piano while a girl looks on.
 – A boy and girl sitting on a bench, talking.
 – A boy waiting outside the “Headmaster’s Office” door with a worried expression.
5 Find six more verbs in the correct form to complete the sentences. (↔↕↖↘)
Wordsearch grid (6 words hidden, one shown: WATCHING):
 W O R K I N G Z
 A R E A D I N G
 T F P O D P O L
 2 E E L L E E E
 I L I O E F E A
 H L I A T E E A
 N G N G A V I A
 G F A E I S F S
 S T A R T E D E
1 I was _________ TV when the phone rang.
 2 We were playing tennis when it _____________________ to rain.
 3 When the ball broke the window, we were _____________________ breakfast.
 4 When the lights went out, I was _____________________ at the computer.
 5 She was dancing when she _____________________ over.
 6 When the alarm clock _____________________, I was having a bath.
 7 Bob was _____________________ a book when there was a knock at the door.
Pages 14–15
USING GRAMMAR Past continuous
6 Complete the sentences about your day yesterday. Use the past continuous.
1 At 5 a.m. I ..........................................................................................................................................................
 2 At 8 a.m. I ..........................................................................................................................................................
 3 At 11 a.m. I ..........................................................................................................................................................
 4 At 1 p.m. I ..........................................................................................................................................................
 5 At 3 p.m. I ..........................................................................................................................................................
 6 At 6 p.m. I ..........................................................................................................................................................
 7 At 7 p.m. I ..........................................................................................................................................................
 8 At 8 p.m. I ..........................................................................................................................................................
7 Use the pictures and words to write sentences.
1 break leg / play football
 Dawn broke her leg while she was playing football.
2 drink coffee / drop cup
 Henry ..................................................................................................................
3 start raining / walk dog
 June ..................................................................................................................
4 work at the computer / chair break
 Pip ..................................................................................................................
5 read a book / headache start
 Miriam ..................................................................................................................
6 look at his phone / crash into a lamp post
 Billy ..................................................................................................................
7 fall asleep / teacher talk
 Sue ..................................................................................................................
8 eat apple / tooth fall out
 Richard ..................................................................................................................
Image descriptions:
 – Dawn playing football and falling on the ground in pain (image 1).
 – Henry dropping a cup of coffee in surprise (image 2).
 – June getting soaked as it suddenly starts to rain while walking a dog (image 3).
 – Pip falling from a broken chair while working at a computer (image 4).
 – Miriam reading a book with a hand on her forehead in pain (image 5).
 – Billy bumping into a lamp post while using his phone (image 6).
 – Sue asleep at her desk while the teacher is speaking (image 7).
 – Richard holding an apple and a tooth that just fell out (image 8).
8 Put the verb in brackets in the past simple or past continuous and complete the story.
I 1 ‘__________ (walk)’ down the road when I 2 ‘__________ (see)’ a wallet on the ground. I 3 ‘__________ (open)’ it and 4 ‘__________ (find)’ a £10 note in it.
 There was nothing else, no name, no address, no credit cards – nothing. I 5 ‘__________ (think)’ about what to do when I 6 ‘__________ (see)’ my friend Daisy.
 She 7 ‘__________ (shop)’, but she 8 ‘__________ (not look)’ very happy. I 9 ‘__________ (ask)’ her what was wrong. She really wanted to buy a beautiful handbag for her mum’s birthday. It was £20 but she only had £10. Then I 10 ‘__________ (know)’ what to do with the money from the wallet.
Image description: A girl running in sporty clothes and kneeling down to pick something up from the pavement, possibly a wallet.
DIALOGUE WORK Asking and talking about past events
 9 CHOICES
A Complete the dialogue with the sentences. Then listen and check.
I saw Brian Vickery yesterday!
 Really? What was it about?
 I did. He was here visiting his grandparents. They still live here.
 Of course, he went to our school.
 Was it that long ago? But what happened in your dream?
 Well, you aren’t going to believe this.
A I had a really strange dream last night.
 B 1 ______________________________
 A Did you, do you remember Brian Vickery?
 B 2 ______________________________
 A That’s right, but he moved away two years ago.
 B 3 ______________________________
 A I can’t really remember, but Brian was in it.
 B 4 ______________________________
 A Believe what?
 B 5 ______________________________
 A No way.
 B 6 ______________________________
 A What a coincidence!
B Put the sentences in the correct order. Then listen and check.
1 □ What were you doing at 8 p.m. last night?
 □ The Money Train?
 □ That’s right. It’s my favourite show. I didn’t want anybody to disturb me.
 □ So why didn’t you turn it on after the programme?
 □ Because I tried to phone you, but you didn’t answer your phone.
 □ I really can’t remember. I guess it wasn’t important.
 □ Why did you turn your phone off?
 □ That’s because I turned my phone off.
 6 □ Because I was watching the last episode of The Money Train. That’s what I was doing at 8 p.m.!
 □ B I can’t remember. Why?
 □ A Hmm …
 □ B OK, well, phone me again when you remember.
10 Write questions for the answers.
1
 A: ..............................................................................................................................?
 B: At 6 p.m. I was having dinner.
2
 A: ..............................................................................................................................?
 B: Pizza and chips.
3
 A: ..............................................................................................................................?
 B: It was a cheese and ham pizza.
4
 A: ..............................................................................................................................?
 B: Yes, it was delicious.
5
 A: ..............................................................................................................................?
 B: After that, I did my homework.
6
 A: ..............................................................................................................................?
 B: I went to bed at about 10 p.m.
Pages 16–17
READING Understanding a text about coincidences
11 Read the text quickly. Which president knew Marilyn Monroe?
It’s a weird world
 The strange case of two presidents
 Abraham Lincoln and John F. Kennedy were two of the most famous presidents the USA has ever seen. But being the president of the world’s richest country is not the only thing these two men had in common. Famously, both men died while doing the job. But this is just the start of the coincidences.
Image descriptions: Left – statue of Abraham Lincoln; Right – black-and-white photo of John F. Kennedy; Bottom left – J.W. Booth; Bottom right – L.H. Oswald.
Abraham Lincoln first became a politician in 1846. Kennedy became a politician exactly 100 years later, in 1946. Lincoln became president 14 years later. In 1860. And yes, you’ve guessed it – Kennedy also took 14 years before he became president in 1960.
Both men really wanted to help people. Lincoln helped bring about the end to slavery in the USA. Kennedy introduced a law that said that no American should suffer discrimination* because of colour, sex or religion. Lincoln had a secretary called Kennedy and Kennedy had a secretary called Lincoln. Finally, after Lincoln’s death, the next president was called Andrew Johnson (born in 1808). After Kennedy died, the next president was a man called Lyndon B. Johnson (born in 1908).
But there are also a lot of coincidences with their deaths. For a start, both men died on Friday. The cause of death for both was a gunshot to the head. Lincoln was in the Ford Theatre in Washington when he was shot. He was in the back of a car and it was from the Ford motor company.
But it’s not just the presidents who had so many things in common. There are a lot of strange connections. For a start, both men were shot in the south of the USA. They both had three names. But it gets better.
A man called John Wilkes Booth killed Lincoln. Booth was born in 1839. A man called Lee Harvey Oswald killed Kennedy. Oswald was born exactly 100 years later, in 1939.
Both men ran into a warehouse* after the shooting. Oswald shot from a warehouse and then ran into a theatre. Booth ran into a theatre and then hid in a warehouse.
But that’s not the final coincidence of all. One week before he died, Lincoln visited a town called Monroe in Maryland. A week before he died, Kennedy visited Marilyn Monroe!
VOCABULARY: bring about – verursachen, erreichen, discrimination – Diskriminierung, to shoot sb. – jdn. erschießen; warehouse – Lagerhaus; go to court – vor Gericht gehen; trial – Gerichtsverhandlung, Prozess
12 How many of these tasks can you do?
1 Both Lincoln and Kennedy died while they were president. T / F
 2 Lincoln and Kennedy were politicians before they became president. T / F
 3 Both presidents wanted to make the world fairer. T / F
4 After both presidents died, the next president was ............................................................
 5 Both presidents died from a ........................................................................................................
 6 Both killers had .................................................................................................................................
7 Where were the killers arrested?
 .........................................................................................................................................................
8 Why did neither man have a trial in court?
 .........................................................................................................................................................
9 Where were both presidents the week before they died?
 .........................................................................................................................................................
13 Listen and check your answers.
LISTENING Understanding a conversation
14 How much are you like Dan?
 Do you think the same as him?
 Tick each of the sentences that are true for you too, and then add up the total.
#	Statement	Me	Sarah	John
1	I’ve got no idea what I want to be when I’m older.	☐	☐	☐
2	I’m worried about the future of our Earth.	☐	☐	☐
3	I couldn’t live without loud music.	☐	☐	☐
4	The mornings are the best part of the day.	☐	☐	☐
5	I love maths.	☐	☐	☐
6	I like to get up late at the weekends.	☐	☐	☐
7	I need more holidays.	☐	☐	☐
8	I talk too much on the phone.	☐	☐	☐
9	There’s more to life than money.	☐	☐	☐
10	You never have to say sorry to a true friend.	☐	☐	☐

TOTAL ………………… ………………… …………………
Image description: Three teenagers labelled “Dan” (a boy with long blond hair), “Sarah” (a smiling girl with blond hair), and “John” (a boy with short dark hair in a striped shirt).
15 Listen to Sarah and John discussing the task and tick the boxes above for them. Who is most like Dan?
Pages 18–19
DEVELOPING WRITING SKILLS Stories (1)
16 Read the task and what a student wrote. How many coincidences were there?
Task
 Write a story called Coincidence (120–150 words).
 In your story, focus on:
 ✔ the people involved
 ✔ where the story happened
 ✔ what the surprise was
Coincidence
 A funny thing happened to me and my parents. They were taking me to London to see the musical War Horse. I think it’s nice to go to London sometimes to see a nice musical.
Anyway, on the train down to London the first funny thing happened. A friend of my mum and her daughter were on the train, too. They were also going to London to see War Horse. “What a coincidence,” Mum said. “See you at the musical!”
At the theatre, we went to our seats. We had very nice ones with a good view. The two seats next to Mum were empty. A minute before the show started, the next funny thing happened. My mum’s friend and her daughter arrived to sit down right next to us. “What a coincidence,” they said and we all laughed. (139 words)
Language tip: Using a good variety of vocabulary
 When writing a text, try not to use the same words all the time. Texts are better when you use a variety of words. For example, in the text the word funny is used three times. We could use the words odd and strange to add variety to the vocabulary.
17 The words musical and nice are also used three times. Use the words in the box to replace some of these examples.
awesome show theatre comfortable popular
Writing tip: Creating a story (1)
 ✔ When writing a story, don’t start writing immediately.
 ✔ Plan the story in your head and write notes on a piece of paper.
 ✔ Think about your own life. Are there any experiences you can use for the story?
 ✔ Think about the punchline. It’s the last thing your readers see. You want it to make an impression.
 ✔ Organise your paragraphs well. When there is a change in action, use a new paragraph.
18 Now write your own answer to the task in 16 above.
 ✔ Plan on a piece of paper.
 ✔ Think carefully about the words you use.
 ✔ Use your paragraphs well.
WORD FILE Activities
to buy sth.  to listen to music  to try on sunglasses  to pay the bill
 to drink/eat sth.  to look at sth.  to talk on the mobile
MORE Words and Phrases
Word / Phrase	Example Sentence	German Translation
coincidence	What a coincidence!	Zufall
married	When they got married, his wife changed her name.	verheiratet
similar	They both like similar music.	ähnlich
to return	Please return the balloon to the following address.	zurückgeben; zurückkehren
What a ...!	What a mess!	Was für ein/e ...!
author	This author wrote a lot of novels.	Autor/Autorin
member	A member of the crew remembered the famous night.	Mitglied
passenger	Of the 2,200 passengers, only 705 survived.	Passagier/Passagierin
to sink	When the ship sank, most of its 2,500 passengers died.	sinken
to survive	Most people didn’t survive.	überleben
careless	I’ve lost my phone because I was careless.	unvorsichtig, leichtsinnig
handbag	She put the phone in her handbag.	Handtasche
I beg your pardon.	I beg your pardon.	Entschuldigung, Verzeihen Sie bitte.
to steal	The thief wanted to steal the woman’s money.	stehlen
thief (iel thieves)	The thief was watching the two boys.	Dieb/Diebin
North Pole	I want to travel to the North Pole one day.	Nordpol
South Pole	An imaginary line connects the North and the South Pole.	Südpol
awful	There is an awful smell.	furchtbar, schrecklich, scheußlich
entrance	They were all queuing up at the entrance.	Eingang
to hand sth. in	I’m sure someone found it and handed it in.	einreichen, abgeben
Hold on!	Wait!	Warte(t)!
to leave sb. alone	Lucas didn’t leave his sister alone.	jdn. in Ruhe lassen
to look forward to sth.	Lucas was very much looking forward to it.	sich auf etw. freuen
queue	The queue was getting shorter and shorter.	Warteschlange
to queue (up)	They were all queuing up to get in the museum.	sich anstellen
to wave	Someone is waving at us from the front of the queue.	winken
date of birth	We talked about our date of birth.	Geburtsdatum
Hang on a minute.	Ein Augenblick (mal).	
to achieve (a goal)	Think of a time you were trying to achieve a goal.	(ein Ziel) erreichen
laugh	I got no laugh for my jokes.	Lacher
note	The £50 note was mine.	Geldschein
per cent	50 per cent of the jokes weren’t even funny.	Prozent
speech	I’m writing a motivational speech.	Rede, Ansprache
stage	I went to the front of the stage.	Bühne
to try out	Try out your jokes before you go on stage.	ausprobieren

```

## Output contract

Write `content/corpus/units/g3-u02/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u02",
  "briefBank": "35ae89a6b59c",
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
