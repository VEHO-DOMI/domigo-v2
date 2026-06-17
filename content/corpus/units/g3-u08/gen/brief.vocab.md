# Vocab generation brief — g3-u08 (MORE! 3, Unit 8)

<!-- domigo:gen vocab g3-u08 bank=7622da26418c prompt=346902f9f0f1 -->

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
| g3u08.w.to-invent | to invent | erfinden | wordfile | Inventions | — | invent | to invent ; invent |
| g3u08.w.to-experiment | to experiment | experimentieren | wordfile | Inventions | — | experiment | to experiment ; experiment |
| g3u08.w.to-improve | to improve | verbessern | wordfile | Inventions | — | improve | to improve ; improve |
| g3u08.w.to-discover | to discover | entdecken | wordfile | Inventions | — | discover | to discover ; discover |
| g3u08.w.to-work-sth-out | to work sth. out | etw. herausfinden | wordfile | Inventions | — | work sth. out | to work sth. out ; work sth. out |
| g3u08.w.to-design | to design | entwerfen ; gestalten | wordfile | Inventions | — | design | to design ; design |
| g3u08.w.to-try-out | to try out | ausprobieren | wordfile | Inventions | — | try out | to try out ; try out |
| g3u08.w.to-produce | to produce | produzieren ; herstellen | wordfile | Inventions | — | produce | to produce ; produce |
| g3u08.w.bacon | bacon | Speck | phrase | — | Lots of people love bacon and egg for breakfast. | — | bacon |
| g3u08.w.to-decorate | to decorate | dekorieren | phrase | — | Then someone invented electric lights to decorate houses. | decorate | to decorate ; decorate |
| g3u08.w.dish | dish | Gericht | phrase | — | I invented a new dish with the cook of the restaurant. | — | dish |
| g3u08.w.fat | fat | Fett | phrase | — | I like bacon with less fat. | — | fat |
| g3u08.w.invention | invention | Erfindung | phrase | — | He worked on his invention for a number of years. | — | invention |
| g3u08.w.crowd | crowd | Publikum ; Menschenmenge | phrase | — | He can make a huge crowd laugh. | — | crowd |
| g3u08.w.current | current | (elektrischer) Strom | phrase | — | He passed current through his body. | — | current |
| g3u08.w.to-develop | to develop | entwickeln | phrase | — | In the late 1880s, Tesla developed a new kind of electricity. | develop | to develop ; develop |
| g3u08.w.electric | electric (motor) | elektrisch ; (Elektro)motor | phrase | — | Tesla invented the electric motor. | — | electric ; electric motor |
| g3u08.w.energy | energy | Energie ; Strom | phrase | — | He said he could send energy waves through water. | — | energy |
| g3u08.w.influence | influence | Einfluss | phrase | — | Edison used his influence to tell people that AC was too dangerous. | — | influence |
| g3u08.w.inventor | inventor | Erfinder/Erfinderin | phrase | — | Thomas Edison was perhaps the most famous inventor of his time. | — | inventor |
| g3u08.w.to-invest | to invest | investieren | phrase | — | Edison invested all his money in DC. | invest | to invest ; invest |
| g3u08.w.perhaps | perhaps | vielleicht ; eventuell | phrase | — | Perhaps it was his mother. | — | perhaps |
| g3u08.w.to-be-responsible-for | to be responsible for | für etw. verantwortlich sein | phrase | — | The invention was also responsible for his bad luck. | be responsible for | to be responsible for ; be responsible for |
| g3u08.w.to-shoot | to shoot | schießen | phrase | — | He used the Tesla coil to shoot large electric lightning bolts into the room. | shoot | to shoot ; shoot |
| g3u08.w.confident | confident | (selbst)sicher ; zuversichtlich | phrase | — | I'm quite confident it will work. | — | confident |
| g3u08.w.to-impress | to impress | beeindrucken | phrase | — | I've invented something that I think might impress my teacher. | impress | to impress ; impress |
| g3u08.w.soap | soap | Seife | phrase | — | Use soap to wash your hands. | — | soap |
| g3u08.w.device | device | Gerät | phrase | — | This device allows people to talk under water. | — | device |
| g3u08.w.product | product | Produkt | phrase | — | He started a company to produce his product. | — | product |
| g3u08.w.remarkable | remarkable | bemerkenswert | phrase | — | Kids can sometimes produce something quite remarkable. | — | remarkable |
| g3u08.w.to-research | to research | erforschen ; recherchieren | phrase | — | He decided to research underwater acoustics. | research | to research ; research |
| g3u08.w.wrist | wrist | Handgelenk | phrase | — | Her wrist was hurting from the cold. | — | wrist |
| g3u08.w.crutches | crutches | Krücken | phrase | — | She uses a walker or crutches to move about. | — | crutches |
| g3u08.w.illness | illness | Krankheit | phrase | — | Her illness had stopped Sadie from entering the competition. | — | illness |
| g3u08.w.ramp | ramp | Rampe | phrase | — | She needs to look for ramps to get up and down steps. | — | ramp |
| g3u08.w.wheelchair | wheelchair | Rollstuhl | phrase | — | A wheelchair helps her get around. | — | wheelchair |
| g3u08.w.to-adapt | to adapt | anpassen | phrase | — | She is able to adapt easily to different situations. | adapt | to adapt ; adapt |
| g3u08.w.to-attach | to attach | anfügen ; anhängen | phrase | — | I'll attach a picture to my email. | attach | to attach ; attach |
| g3u08.w.glove | glove | Handschuh | phrase | — | Wear some gloves to keep your hands warm in winter. | — | glove |
| g3u08.w.housework | housework | Hausarbeit | phrase | — | Busy parents don't have enough time for housework. | — | housework |
| g3u08.w.automatically | automatically | automatisch | phrase | — | When the cat wants to go inside, the flap opens automatically. | — | automatically |
| g3u08.w.collar | collar | Kragen | phrase | — | I've created a collar for our cat. | — | collar |
| g3u08.w.computer-science | computer science | Informatik | phrase | — | His best subject at school is computer science. | — | computer science |
| g3u08.w.engineer | engineer | Techniker/Technikerin | phrase | — | What subjects do you need to study to be an engineer? | — | engineer |
| g3u08.w.inspiration | inspiration | Inspiration | phrase | — | This is not the kind of inspiration I'm looking for right now. | — | inspiration |
| g3u08.w.to-repair | to repair | reparieren | phrase | — | I love repairing things and playing around with new ideas. | repair | to repair ; repair |
| g3u08.w.to-support | to support | unterstützen | phrase | — | I want to do things that will support my dream for the future. | support | to support ; support |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Mangano, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Russell, Ryan, Sacks, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u08.w.to-invent` ← v1 `to invent`: d="To create something completely new that didn't exist before" · s="Who first _____ the telephone back in 1876? It was Alexander Graham Bell — no one had created one before." · a=["invent","invented"] · mc=["to find","to use","to buy"]
- `g3u08.w.to-experiment` ← v1 `to experiment`: d="To try new things to find out what happens" · s="Scientists in their white lab coats _____ in their clean labs with chemicals to discover brand new things about the world." · a=["experiment","experimented"] · mc=["to sleep","to eat","to dance"]
- `g3u08.w.to-improve` ← v1 `to improve`: d="To make something better than before" · s="She _____ her English speaking skills a lot over one year by watching English films without subtitles every single day." · a=["improve","improved"] · mc=["to worsen","to forget","to ruin"]
- `g3u08.w.to-discover` ← v1 `to discover`: d="To find something or learn about something for the first time" · s="The curious children _____ a secret hidden path in the forest that nobody in the village had ever seen before." · a=["discover","discovered"] · mc=["to invent","to build","to draw"]
- `g3u08.w.to-work-sth-out` ← v1 `to work sth. out`: d="To find the answer by thinking about it" · s="I can't _____ the correct answer to question five in the maths test — the numbers don't add up no matter what I try." · a=["work out","worked out"] · mc=["to give up on","to ignore","to forget about"]
- `g3u08.w.to-design` ← v1 `to design`: d="To make a plan or drawing for how something will look" · s="She loves fashion and wants to _____ her own unique collection of stylish clothes one day with her own logo and brand." · a=["design","designed"] · mc=["to copy","to steal","to destroy"]
- `g3u08.w.to-try-out` ← v1 `to try out`: d="To test something to see how it works or if you like it" · s="Let's _____ this new chocolate cake recipe from the cookbook today — it looks delicious and sounds easy to make." · a=["try out","tried out"] · mc=["to avoid","to refuse","to throw away"]
- `g3u08.w.to-produce` ← v1 `to produce`: d="To make or create something in large amounts" · s="This big factory in China _____ more than one million colourful plastic toys every single year for children around the world." · a=["produce","produced","produces"] · mc=["to destroy","to eat","to sell only"]
- `g3u08.w.bacon` ← v1 `bacon`: d="Thin slices of salted or smoked meat from a pig" · s="I like to have scrambled eggs and crispy fried _____ — thin strips of pork meat — for breakfast on lazy Sunday mornings." · a=[] · mc=["bread","cheese","fruit"]
- `g3u08.w.to-decorate` ← v1 `to decorate`: d="To make something look more beautiful by adding things to it" · s="We _____ the classroom brightly with colourful balloons, paper chains, and streamers for the birthday party this afternoon." · a=["decorate","decorated"] · mc=["to clean","to destroy","to empty"]
- `g3u08.w.dish` ← v1 `dish`: d="Food that has been prepared in a particular way" · s="My absolute favourite _____ is pasta with homemade tomato sauce — my grandmother's special recipe that she taught my mum." · a=["dishes"] · mc=["drink","toy","game"]
- `g3u08.w.fat` ← v1 `fat`: d="The oily substance in food or under the skin" · s="Too much unhealthy _____ in fast food like burgers and fries is really not good for your health and can make you sick." · a=["fats"] · mc=["vitamins","water","fresh air"]
- `g3u08.w.invention` ← v1 `invention`: d="Something new that someone has created" · s="The electric light bulb in 1879 was an amazing _____ by Thomas Edison that completely changed the world at night." · a=["inventions"] · mc=["natural phenomenon","animal","weather event"]
- `g3u08.w.crowd` ← v1 `crowd`: d="A large group of people in one place" · s="A big noisy _____ of about 500 people waited outside the cinema for two hours for the new Marvel film to start." · a=["crowds"] · mc=["single person","empty space","no one"]
- `g3u08.w.current` ← v1 `current`: d="The flow of electricity through a wire" · s="Be very careful — there is a strong electric _____ flowing through these exposed wires and it could give you a bad shock." · a=["currents"] · mc=["flower","hole","sound"]
- `g3u08.w.to-develop` ← v1 `to develop`: d="To create something new over a period of time" · s="The clever software team _____ a new mobile app for learning Spanish and French over the past six months." · a=["develop","developed"] · mc=["to delete","to destroy","to forget"]
- `g3u08.w.electric` ← v1 `electric (motor)`: d="Using or producing electricity" · s="My dad wants to buy a new modern car with a quiet _____ motor that uses batteries instead of petrol." · a=["electric"] · mc=["broken","old","loud"]
- `g3u08.w.energy` ← v1 `energy`: d="Power that makes machines work or keeps things moving" · s="Wind turbines and solar panels can give us clean renewable _____ without polluting the environment or using fossil fuels." · a=[] · mc=["noise","rubbish","pollution"]
- `g3u08.w.influence` ← v1 `influence`: d="The power to change what other people think or do" · s="Good kind teachers have a big positive _____ on their students' lives and can shape who they become as adults." · a=["influences"] · mc=["weight","height","age"]
- `g3u08.w.inventor` ← v1 `inventor`: d="A person who creates something new" · s="She wants to be a creative _____ and make new helpful machines that solve everyday problems for people around the world." · a=["inventors"] · mc=["consumer","user only","seller"]
- `g3u08.w.to-invest` ← v1 `to invest`: d="To spend money on something hoping to get more back" · s="He _____ all his savings of €5000 in a new small coffee shop business that opened last year in his town." · a=["invest","invested"] · mc=["to spend on junk","to throw away","to lose"]
- `g3u08.w.perhaps` ← v1 `perhaps`: d="Maybe, possibly" · s="_____ we can go to the cinema this weekend — maybe on Saturday afternoon, but I'm not completely sure yet." · a=["perhaps"] · mc=["certainly","definitely","absolutely"]
- `g3u08.w.to-be-responsible-for` ← v1 `to be responsible for`: d="To be the one who caused something or must take care of it" · s="Who is _____ for cleaning the whole classroom today after the last lesson — it needs sweeping and wiping." · a=["be responsible for","responsible for"] · mc=["to be distracted by","to be afraid of","to be bored with"]
- `g3u08.w.to-shoot` ← v1 `to shoot`: d="To send something out fast, like a ball or an arrow" · s="He _____ the football directly into the goal from ten metres away and his team scored the winning point." · a=["shoot","shot"] · mc=["to throw","to catch","to touch"]
- `g3u08.w.confident` ← v1 `confident`: d="Feeling sure about yourself and your abilities" · s="She felt _____ about the big maths test because she had studied very hard for it for two whole weeks." · a=[] · mc=["nervous","scared","unsure"]
- `g3u08.w.to-impress` ← v1 `to impress`: d="To make someone think you are very good at something" · s="He _____ all his friends at the birthday party with an amazing magic card trick that nobody could figure out." · a=["impress","impressed"] · mc=["to bore","to upset","to anger"]
- `g3u08.w.soap` ← v1 `soap`: d="Something you use with water to wash your hands and body" · s="Always use _____ and warm water when you wash your dirty hands to kill the germs and keep yourself healthy." · a=["soaps"] · mc=["just water","perfume","lotion"]
- `g3u08.w.device` ← v1 `device`: d="A piece of equipment made for a special purpose" · s="A smartphone is a very useful electronic _____ — a small portable machine with a screen that you carry everywhere in your pocket." · a=["devices"] · mc=["animal","food","plant"]
- `g3u08.w.product` ← v1 `product`: d="Something that is made to be sold" · s="This supermarket sells only _____ that are made in Austria — milk, cheese, honey, and bread all from local farmers." · a=["product","products"] · mc=["foreign goods","imported items","international brands"]
- `g3u08.w.remarkable` ← v1 `remarkable`: d="Very special and worth noticing" · s="She gave a _____ five-minute speech about saving the environment that impressed everyone in the audience with clever ideas." · a=[] · mc=["ordinary","boring","forgettable"]
- `g3u08.w.to-research` ← v1 `to research`: d="To study something carefully to learn more about it" · s="The students _____ the topic of climate change online for two hours before writing their homework essays for science class." · a=["research","researched"] · mc=["to ignore","to forget","to avoid"]
- `g3u08.w.wrist` ← v1 `wrist`: d="The part of your body between your hand and your arm" · s="She wears a beautiful silver bracelet on her left _____ — the joint between her hand and her arm." · a=["wrists"] · mc=["head","foot","knee"]
- `g3u08.w.crutches` ← v1 `crutches`: d="Sticks you put under your arms to help you walk when your leg is hurt" · s="He had to use wooden _____ under his arms to walk around for three weeks after he broke his foot playing football." · a=[] · mc=["a hat","gloves","sunglasses"]
- `g3u08.w.illness` ← v1 `illness`: d="A health problem that makes you feel unwell" · s="She missed a lot of school because of a long serious _____ that kept her in hospital for two months." · a=["illnesses"] · mc=["holiday","school trip","birthday"]
- `g3u08.w.ramp` ← v1 `ramp`: d="A slope that connects two different levels" · s="There is a smooth _____ at the entrance of the school instead of steps, so people in wheelchairs can easily get inside." · a=["ramps"] · mc=["wall","gate","statue"]
- `g3u08.w.wheelchair` ← v1 `wheelchair`: d="A chair with wheels for people who cannot walk" · s="The injured boy uses a silver _____ with four wheels to move around the school corridors while his broken leg heals." · a=["wheelchairs"] · mc=["scooter","bicycle","car"]
- `g3u08.w.to-adapt` ← v1 `to adapt`: d="To change something or yourself to fit a new situation" · s="She quickly _____ to her new school in a different country and made lots of new friends within the first two weeks." · a=["adapt","adapted"] · mc=["to refuse","to complain about","to run away from"]
- `g3u08.w.to-attach` ← v1 `to attach`: d="To join or fix one thing to another" · s="I accidentally _____ the wrong file to my important email to the teacher — I sent my music playlist instead of my homework." · a=["attach","attached"] · mc=["to detach","to remove","to delete"]
- `g3u08.w.glove` ← v1 `glove`: d="A piece of clothing you wear on your hand to keep it warm" · s="It's freezing cold outside with snow on the ground — don't forget your warm woolly _____ for your hands!" · a=["glove","gloves"] · mc=["shoe","hat","scarf"]
- `g3u08.w.housework` ← v1 `housework`: d="The work you do to keep a house clean, like washing and cooking" · s="Everyone in our family of four has to help with the _____ — washing dishes, vacuuming, and taking out the bins on Sundays." · a=[] · mc=["school homework","office work","factory work"]
- `g3u08.w.automatically` ← v1 `automatically`: d="Working by itself, without a person doing it" · s="The sliding glass doors of the big supermarket open _____ when you walk near them without you having to push or touch anything." · a=[] · mc=["manually","by hand","with effort"]
- `g3u08.w.collar` ← v1 `collar`: d="The part of a shirt around the neck, or a band around an animal's neck" · s="The big brown dog has a red leather _____ around its neck with its name 'Rex' and owner's phone number." · a=["collars"] · mc=["cap","sock","jacket"]
- `g3u08.w.computer-science` ← v1 `computer science`: d="The study of how computers work and how to program them" · s="She is very interested in _____ and wants to learn computer programming and coding in Python this year." · a=["computer science"] · mc=["cooking","music","painting"]
- `g3u08.w.engineer` ← v1 `engineer`: d="A person who designs or builds machines, roads or bridges" · s="The clever _____ designed and built a small helpful robot that can vacuum and clean floors by itself in 30 minutes." · a=["engineers"] · mc=["clown","poet","chef"]
- `g3u08.w.inspiration` ← v1 `inspiration`: d="A feeling or idea that makes you want to create or do something" · s="Beautiful nature is often a great _____ for famous artists who paint landscapes, trees, flowers, and mountains." · a=["inspirations"] · mc=["distraction","obstacle","problem"]
- `g3u08.w.to-repair` ← v1 `to repair`: d="To fix something that is broken" · s="The experienced mechanic said he could _____ the broken washing machine with new parts and make it work again like new." · a=["repair","repaired"] · mc=["to break","to destroy","to throw away"]
- `g3u08.w.to-support` ← v1 `to support`: d="To help someone or give them what they need" · s="My kind parents always _____ me emotionally when I have a problem at school — they listen and give good advice." · a=["support","supported"] · mc=["to ignore","to abandon","to laugh at"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 8.txt -----
Unit 8 Inventors and inventions
Pages 66–67
At the end of unit 8 …
 you know
 ✅ 8 verbs and phrases to talk about inventions
 ✅ when to use the past simple or the present perfect
you can
 ✅ understand a documentary about inventions
 ✅ understand a text and people talking about inventions
 ✅ talk about inventions and past experiences
 ✅ write an email / a description of a crazy invention
 ✅ talk about your future job
1 a Watch the video. How many different inventions do Mia and Jack talk about?
b Circle T (True) or F (False).
 1 Albert Sadacca invented lights that were too expensive for most people. T / F
 2 An eight-year-old girl invented something to cook food in a better way. T / F
 3 Chester Greenwood made something to wear in summer. T / F
 4 An American from Lake City invented snow skis in 1922. T / F
READING
 Understanding a text about inventions
2 What do you know about the Serbian-Austrian inventor Nikola Tesla? Make a class list. Read through the text quickly to see if it mentions any of your facts. Then read the text carefully.
Nikola Tesla: The man who invented the 20th century
When Nikola Tesla arrived in New York in June 1884, he only had 4 cents in his pocket. When he died alone on January 7th 1943 in room 3327 of the Hotel New Yorker, he was penniless.
In the 59 years between those two dates, Tesla came up with some of the most important inventions of the 20th century. He invented the electric motor, fluorescent light bulbs, the neon lamp, the first remote-controlled boat and the first speedometer for cars. He also designed the world’s first hydroelectric power plant* at Niagara Falls, which used the power of the water to produce electricity.
So why wasn’t Tesla a billionaire when he died? Perhaps it was his most important invention that was also responsible for his bad luck. In the late 1880s, Tesla developed a new kind of electricity. After testing, alternating current (AC*) was cheaper and easier to use than the direct current (DC*) that people used at the time.
Unfortunately for Tesla, Thomas Edison, perhaps the most famous inventor of the time, had all his money invested in DC. Edison used his influence to tell people that AC was too dangerous. In 1893, at the World Exposition in Chicago, Tesla went on stage and used electricity to show how safe AC was. He passed a huge current through his body to power eight light bulbs and then used Tesla coils to shoot large electric lightning bolts into the crowd.
In the second half of his life Tesla had to spend much of his life trying to show people how great his ideas were. Many of them weren’t a success before their time. People thought he was ‘crazy’ when he said he had invented a wireless broadcasting system to send pictures and sounds around the world. They laughed at him when he said he could send energy waves through water to detect* German submarines at the beginning of the First World War. Tesla had so many brilliant ideas, but the little money he made from them he used on his next invention.
But these days we can see his influence all around us. We all use AC in our homes to power our computers and televisions. Militaries around the world use radar to defend their countries. These and many others are all inventions from the brilliant mind of Nikola Tesla.
*VOCABULARY: hydroelectric power plant – Wasserkraftwerk; alternating current (AC) – Wechselstrom; direct current (DC) – Gleichstrom; wireless broadcasting system – drahtloses Sendesystem; detect – aufspüren
3 How many of these tasks can you do?
 ☐ 1 Tesla made a lot of money in his life. T / F
 ☐ 2 Tesla invented the speedboat. T / F
 ☐ 3 Edison told people not to use Tesla’s electricity. T / F
 ☐ 4 Tesla went on stage and passed electrical current through his body
    ☐ to show it wasn’t dangerous.
    ☐ to entertain people.
    ☐ to turn on some lights.
 ☐ 5 One of Tesla’s biggest problems was
    ☐ he spent too much money.
    ☐ he was mad.
    ☐ people didn’t believe his ideas were possible.
 ☐ 6 These days,
    ☐ people call Tesla the greatest inventor of all time.
    ☐ Tesla’s ideas are everywhere.
    ☐ not many people know about Tesla.
7 Which of Tesla’s inventions do you think is the most important?
 ………………………………………………………………………………………………………
8 Who do you think is the greatest inventor of all time and why?
 ………………………………………………………………………………………………………
9 Do you think Tesla was a happy man? Give your reasons.
 ………………………………………………………………………………………………………
4 Check your answers with a partner. Then listen to the text.
VOCABULARY
 Inventions
5 Read the text and match the words in italics with the meanings.
I’ve invented something that I think might impress my science teacher – it’s a time-travelling machine. It wasn’t easy. First, I had to discover a way of making time travel possible. That took me a few weeks, but once I had worked that out it wasn’t too difficult.
I sat down with some pens and designed my machine on paper. I experimented with different shapes and colours for the machine and found that a red rectangle worked, so I used an old telephone box. I improved it by putting an armchair in it. It’s important to be comfortable when you travel through time. I’ve built a prototype, but I haven’t tried it out yet. I’m quite confident it will work, and if it does, I think I’ll have to start producing my machines so that all families can have one.
Matchings:
 ☐ 1 to test to see if something works –
 ☐ 2 to make better –
 ☐ 3 to try different ways of doing something –
 ☐ 4 to find out something that no one knew before –
 ☐ 5 to draw plans –
 ☐ 6 build something (usually so it can be sold) –
 ☐ 7 to find a solution to a problem –
 ☐ 8 to create something new –
Pages 68–69
6 In pairs, take a guess. Match the inventions with the inventors and the dates. Then check with your teacher.
1 Babylonians (2800 BC)
 2 Johannes Gutenberg (1439)
 3 Alexander Graham Bell (1876)
 4 Karl Benz (1886)
 5 Alexander Fleming (1929)
 6 Ole Kirk Christiansen (1949)
 7 Tim Berners-Lee (1989)
 8 IBM and Bellsouth (1992)
☐ World Wide Web
 ☐ Lego
 ☐ smartphone
 ☐ telephone
 ☐ motor car
 ☐ printing press
 ☐ soap
 ☐ antibiotics
7 In pairs, discuss why each of these inventions was important. Decide on the most and least important.
The … was important because it allowed us to …
 The … meant people could …
8 What are these inventions? Match the pictures with the words in the box.
☐ Water-Talkie
 ☐ wristies
 ☐ ice-lolly
 ☐ hot dog
 ☐ trampoline
 ☐ football goal
Pictures:
Yellow-red ice lolly
Blue trampoline
Football goal
Girl underwater with Water-Talkie
Hot dog in a bun
A pair of blue wristies (fingerless gloves)
9 Which of the objects above do you think were invented by children? Why? Listen and check your answers.
10 Listen again and match the sentences with the objects in 8.
1 It was invented by the youngest of these four inventors.
 2 It was built in a garage.
 3 The idea came to the inventor on holiday.
 4 The inventor waited several years before producing his invention.
 5 The inventor now owns a company.
 6 The idea came to the inventor when he was at the circus.
 7 It got a lot of interest from a toy shop.
 8 It was an accidental invention.
11 Look at the photo. What do you think this young girl’s invention is and why do you think she invented it? Read the article quickly to see if you were right.
Helping herself, helping others
9-year-old Sadie McCallum suffers from Spastic Diplegia Cerebral Palsy. This means that problems with her muscles make it difficult for her to move about and she uses a wheelchair, crutches* or a walker* to help her get around.
Since her family first learnt about her disability more than eight years ago, Sadie has always spent a lot of time in hospital and she has had two big operations. When she was seven, she had operations on both legs. It was very complicated, but the doctors hoped it would allow Sadie to walk on her own.
Sadie was in hospital for a week and after that she had to spend another four weeks resting in bed. She had a lot of time to think. One of Sadie’s biggest hobbies is writing and she spends a lot of time visiting the library. She thought about how difficult the journey to the library can be for her. She can’t just get up and down steps with a walker so she needs to look for ‘ramps’ and these aren’t always in the most practical places. She started thinking of ways to make her walker more flexible.
After several different drawings, Sadie had a design she thought might work. Now she just needed to bring her bright plans to life. And she had another reason for wanting to make her ideas a reality. Every year, her school holds an Invention Convention where students can bring in their inventions* and compete for prizes. For the last two years her illness had stopped Sadie entering. Now was her big chance. With a little help from her family Sadie built her Amazing ‘Curb* Climber’ in time for the competition.
Her invention won first place in the ‘Best Use of a Wheel’ category at the school convention. But success didn’t stop there – Sadie has since gone on to win more prizes including a ‘Microsoft Technology Award’.
Sadie already wants to improve on her designs and make the walker even better. She’s also working on ideas for other inventions to help disabled people, including a wheelchair with an umbrella.
*VOCABULARY: curb – Randstein
12 Match the titles with the paragraphs. There are two extra titles.
 ☐ 1 Seven operations
 ☐ 2 Making an idea come true
 ☐ 3 Unable to move
 ☐ 4 More ideas
 ☐ 5 Sports competitions
 ☐ 6 A lot of awards
 ☐ 7 Steps that make life difficult
13 Match the words in italics (1–6) from the text in 11 with the definitions here.
1 taking part in ☐
 2 able to adapt easily to different situations ☐
 3 something that has never been made before ☐
 4 sticks to help people who have problems with walking ☐
 5 a slope for wheelchairs to go up ☐
 6 a metal frame with four legs for people who can’t walk very well ☐
Pages 70–71
14 In pairs, practise the dialogue.
A Have you ever entered a competition?
 B Yes, I’ve entered quite a few.
 A Really? What sort of competitions?
 B Competitions for inventors. I like inventing things.
 A Have you ever won one?
 B Yes, I’ve won three. In fact, I won a competition last week.
 A What was your invention?
 B I created some computer software to help people keep their passwords safe.
 A And what did you win?
 B I got £600.
15 Complete the questions with the correct form of the verbs in the box.
 have enter be
1 Have you ever ___________________________ a competition?
 2 Have you ever ___________________________ to hospital?
 3 Have you ever ___________________________ an idea for an invention?
16 Match the follow-up questions with the questions in 15.
 ☐ a) What was it?
 ☐ b) How long did you stay there for?
 ☐ c) Did you win?
17 Think of two more follow-up questions for each of the questions in 15.
18 In pairs, ask and answer questions and find out about your partner’s experiences.
19 Listen and tick.
	/ɒ/	/ɔː/
1 lot	✓	
2 caught		✓
3 thought		✓
4 hot	✓	
5 got	✓	
6 saw		✓

20 Listen and repeat.
 I bought a horse that cost a lot.
 And then I bought four more.
21 Look at these crazy inventions. Match each one with its short description.
Image 1: Two socks fastened together with baby gloves in between.
 Image 2: A baby crawling with a cleaning suit.
 Image 3: A plastic bag with mouldy bread printed on it.
 Image 4: Slippers with blue LED lights.
 Image 5: A belt with a tape measure printed on it.
 Image 6: A pram with a scooter attached to the back.
☐ a tape measure that is also a belt
 ☐ a pair of slippers with LED lights at the front
 ☐ a pram attached to a scooter
 ☐ a plastic bag with fake mould*
 ☐ a babygro* with cleaning pads attached to the arms and the legs
 ☐ a pair of children’s gloves attached to a pair of adult gloves
*VOCABULARY: mould – Schimmel; babygro – Krabbelanzug, Strampler
22
 Work in pairs. Choose three of the inventions above. Think of a name for each one and decide who might buy it. Complete the table.
Name	Who is it for?
The baby-powered floor cleaner	Busy parents who don’t have enough time for housework.
	
	

Pages 72–73
23 CHOICES
 A
 You have just read about an inventor on the internet. Write an email to your friend (60–80 words) in which you tell him/her what you’ve read.
Say who the inventor is.
Say what he/she invented.
Say why you think it is an interesting/important/great invention.
B
 Search the internet for crazy inventions and describe two of them, or come up with a crazy invention yourself and write a description (120–150 words). Write about:
what the invention looks like
who invented it
what it is good for
who is interested in it
where you can get it and how much it is
GRAMMAR
 Past simple and present perfect
You use the past simple to talk about something that happened in the past. You often use it in combination with time markers like a date, a time period, a time of day, or signal words such as last Monday/month/year,
 a week/year ago, yesterday.
 When Sadie was seven, she had operations on both hips.
You use the present perfect to talk about something that has happened recently. You are not interested in the exact time.
 In general, you want to know if something took place at all, and not when exactly something happened. Signal words are:
 ever, never, always, just.
Sadie has had two big operations.
 Sadie’s invention has won two more prizes.
 Sadie has always spent a lot of time in hospital.
Now circle the correct options.
 1 At the end of the school year, she won / has won first place in the Invention Convention.
 2 Not every young inventor was always / has always been successful.
1 Watch the video. What invention has Luke already made?
2 Watch again and answer the questions.
1 What kind of things does Luke’s grandpa tell him to dream of?
 2 What two hobbies does Luke talk about?
 3 What does Luke often do with his dad at the weekend?
 4 What subjects does he need to study to be an engineer?
 5 Where does he want to go to university?
 6 What’s so special about the cat flap?
3 Complete the sentences with the words in the box.
 in on with as for
1 My mum works …………… a lot of people – more than 100!
 2 I’m not sure exactly what I want to do but I’d like to work …………… the film industry.
 3 I’d like to work …………… a multinational company when I finish university.
 4 I’m working …………… a project for my science teacher.
 5 My dad works …………… a teacher in the local high school.
4 Read about the three people. In pairs, think of jobs that might be good for each one.
DAVE really likes history. It’s his favourite subject at school. He really likes sport and plays for the school football team. He is a very sociable person and likes talking to people. People always say they find him very interesting.
OLIVIA is really good at drawing. She spends a lot of her free time writing stories in her hand. At school, she is very good in science and maths and she finds school interesting. She works well in a team and has really good ideas. She also plays the violin in an orchestra.
SAM has an amazing imagination and his teacher says he writes the best stories. He has a few good friends but is quite shy and enjoys working on his own. He loves playing video games in his free time. His best subject at school is computer science.
[Image descriptions:
TV presenter: a person speaking into a microphone
teacher: a woman holding a book and gesturing to someone
architect: a person with drawings and a model of a building
computer game designer: a boy with headphones, using a computer]
5 Think of someone you know who is very good at their job. Think about:
what they work as/in
who they work with/for
why they are good at their job
Make a short presentation about this person. Produce a short video and show it to the class.


----- WB: More 3 WB Unit 8.txt -----
UNIT 8 Inventors and inventions
Page 65
UNDERSTANDING VOCABULARY Inventions
1 Look at the text on page 67 of your Student’s Book. Do the crossword puzzle.
Down ↓
 1 to find a way for something to work
 2 to find something new
 3 to make a plan of something
 4 to see if something works
 7 to make something better
Across ➝
 5 to make an item or many items
 6 to come up with something new
 8 to make tests to find out something
[Image description: A crossword puzzle is shown with eight items. It contains vertical and horizontal answer spaces with numbered clues corresponding to the vocabulary activity above.]
USING VOCABULARY Inventions
2 Fill in the correct form of the words in the box.
invent – work out – try it out – experiment – discover – improve – design – find – produce
1 I ................................................... the plans for the spaceship by accident. Somebody called Helen R.
 2 ................................................... a hyper-hyper drive. I don’t know how she
 3 ................................................... the science but she did. And she
 4 ................................................... the most beautiful spaceship I’ve ever seen.
 She 5 ................................................... with the hyper-hyper drive for years.
 And every year, she 6 ................................................... it a bit.
 If she ever 7 ................................................... it, I really want to
 8 ................................................... with her. That is, if I ever
 9 ................................................... her.
3
 Complete the mini-dialogues with the correct form of the words from the word box in 2.
1
 A Who ................................................... the neon lamp?
 B Tesla did.
2
 A Tesla also ................................................... antibiotics.
 B I think you’re wrong there. That was Fleming.
3
 A In 2022, Tesla ................................................... nearly 1.4 million cars.
 B Really? And do you know the figures* for this year?
 A No, you have to check online.
VOCABULARY:
 figure = hier: Zahl
[Image description: A colorful, cartoon-style illustration of a spaceship pointing to the bottom right corner, in orange, red, white, and grey colors.]
Page 66–67
UNDERSTANDING GRAMMAR Past simple and present perfect
4 Match the questions and the answers.
1 Have you ever been to Spain?
 2 Has June finished her homework?
 3 Have they found their cat?
 4 Has he written you an email?
 5 Have they found a new house?
 6 Has the film started yet?
☐ Yes, she finished ten minutes ago.
 ☐ No, but he phoned me.
 ☐ Yes, and it’s a very nice house.
 ☐ Yes, we went to Madrid last year.
 ☐ Yes, it started about 15 minutes ago.
 ☐ Yes, it was in the garden.
5 Choose the correct verb forms.
1 My sister got / has got married last Sunday.
 2 She has met / met her husband three years ago.
 3 I’ve never met / meet a famous person.
 4 Jacqueline isn’t very happy because she has just broken / breaks up with her boyfriend.
 5 My team has lost / lost the cup final two–nil last night.
 6 The flight from Belfast has already arrived / arrived.
USING GRAMMAR Past simple and present perfect
6 Complete the dialogues with the correct form of the verbs in brackets.
1
 A 1 ................................................... you ................................................... (be) to Italy?
 B Yes, I 2 ................................................... (go) there last year.
 A Which cities 3 ................................................... you ................................................... (visit)?
 B We 4 ................................................... (visit) Rome and Naples. We 5 ................................................... (have) a great time.
2
 A 6 ................................................... you ................................................... (meet) a famous person?
 B Yes, I 7 ................................................... (meet) Mark Zuckerberg when I was 12.
 A Wow! What 8 ................................................... you ................................................... (say) to him?
 B I 9 ................................................... (ask) him for some money.
7 Write two more dialogues using these first lines.
1
 A Have you ever found a lot of money?
 B ......................................................................................................................
 A ......................................................................................................................
 B ......................................................................................................................
2
 A Have you ever had a bad accident?
 B ......................................................................................................................
 A ......................................................................................................................
 B ......................................................................................................................
8 Complete with the past simple or the present perfect forms.
Chris: Could I borrow some money from you?
 Tom: You still 1 ................................................... (not pay) back the money you 2 ................................................... (borrow) from me last week.
 Chris: What? I 3 ................................................... (not borrow) any money from you last week.
 Tom: Yes, you did. Remember? When you 4 ................................................... (buy) that new game in which inventors fight each other.
 Chris: Oh, yes. You’re right. I 5 ................................................... (need) a present for Jenny.
 Tom: What? You 6 ................................................... (give) it to her? I 7 ................................................... (want) to play it too.
 It’s all Jenny this, Jenny that. What about me?
9 Complete with the past simple or present perfect form of the verbs in brackets.
1 I ................................................... (always be) interested in inventing something. Two years ago, I
 2 ................................................... (invent) the automatic-reply-to-your-parents gadget. You could sit in the living room with my little gadget and press a button, and the machine would say things in your voice like “uhu, hmmm, aha, yeah fine, ts–ts”. It really works. I
 3 ................................................... (try) it a million times, believe me. I
 4 ................................................... (not have) a good idea for some time, but yesterday I
 5 ................................................... (have) a brilliant one. I
 6 ................................................... (come up with) the new homework writer that is far better than ChatGPT. All you do is feed it some paper. Then dial Article or Story or Letter or Email.
 Put in a few clever keywords from my keyword collector – and hey presto! There’s your text. I
 7 ................................................... (already try) it with my English teacher. He
 8 ................................................... (say), “What a brilliant story, Jasmin! And so different.” I know why. I
 9 ................................................... (put) in a lot of difficult words and he probably
 10 ................................................... (think) I was so clever. I
 11 ................................................... (just send) an email to my best friend Jessica using my machine, but she
 12 ................................................... (not reply) yet. It looks like she really needs my new invention.
[Image description: A cartoon of a girl wearing glasses, working with a futuristic machine that looks like a printer and computer combination. She looks proud and excited.]
10 Complete with the words from the box in the correct tense.
invent – see – take – say – transport – not watch – think – answer
1 I ................................................... just ................................................... such a silly movie. It was about a guy who
 2 ................................................... time machines for different times in the past. So, for example, with the blue one you could travel 200 years in the past, the red one
 3 ................................................... you back 2,000 years, the yellow one 4 ................................................... you back only a day. It was complete chaos. “5 ................................................... anybody ever
 6 ................................................... the director ever ................................................... the movie?” Tony
 7 ................................................... . “It’s all about running to the wrong machines and going back to the wrong time, because people can’t remember the colour codes.” “See?” I
 8 ................................................... . “Why 9 ................................................... you ................................................... your movie before you showed it to us?” I asked him.
Page 68–69
11 CHOICES
A Complete the dialogue with the sentences from the box. Then listen and check.
a My favourite!
 b Anything? And does it really work?
 c Really? What kind of machine is it?
 d What? Cook it?
 e OK, when it’s fixed, I want you to cook something for me.
Alissa: I’ve just invented a new machine.
 Benny: 1 ....................................................
 Alissa: It’s a cooking machine. I call it CookEat.
 Benny: 2 ....................................................
 Alissa: No, CookEat. Cool, eh? And it can cook anything.
 Benny: 3 ....................................................
 Alissa: Well, there are a few problems, but I’m working on them.
 Benny: 4 ....................................................
 Alissa: OK, I’ll do pasta and chicken.
 Benny: 5 ....................................................
[Image description: A white kitchen robot with mechanical arms is in the process of cooking. It is stirring, frying, and splashing food messily across the kitchen counter. Pots are boiling over, spaghetti is flying in the air, and a fish is being tossed. The robot is clearly malfunctioning.]
B Put the dialogue into the correct order. Then listen and check.
☐ 1 Albert: Have you ever heard of Albert Sadacca?
 ☐ Albert: Well, he and his brothers went into business.
 ☐ Albert: Well, he knew candles on Christmas trees often caught fire and burnt down houses.
 ☐ Albert: Exactly, his lights were safe, looked good and weren’t expensive.
 ☐ Albert: He was an inventor. He invented Christmas tree lights.
 ☐ Albert: One that produced Christmas tree lights, of course.
 ☐ Caroline: No, I haven’t. Who was he?
 ☐ Caroline: And what did he do then?
 ☐ Caroline: Christmas tree lights. How did he come up with that idea?
 ☐ Caroline: What kind of business?
 ☐ Caroline: So he was looking for something safer.
12 Read the story.
HEDY LAMARR
 A FAMOUS INVENTOR
Hedy Lamarr was one of the most beautiful actresses in Hollywood during the 1940s and 1950s. She starred in over 20 films, including Samson and Delilah, which was the most successful film of 1949. But what many people do not know is that she was also an inventor. In fact, some people say that she came up with the technology that made today’s smartphones and GPS possible.
Hedy was born in Vienna in 1914 and as a child she always wanted to know how things worked. When she was 18, she married Fritz Mandl, an extremely rich man who ran a company that made weapons. Although she was unhappy in her marriage, she learnt a lot about technology from her husband’s business. One day, she decided to run away from her husband. She arrived in Paris where she met the famous film producer Louis B. Mayer. He invited her to Hollywood where she started on her career as a Hollywood actress.
Her films were successful, but Hedy found acting boring. She only played the part of beautiful women and never had many lines to say. She also found the Hollywood lifestyle uninteresting. She didn’t like to drink or go to the parties of the rich and famous. She needed a hobby. That’s when she decided to become an inventor and she turned one of the rooms in her home into a laboratory.
One of her first inventions was a tablet that when added to a glass of water turned it into a fizzy drink. However, this wasn’t very successful and even Hedy said it didn’t taste very good. Other inventions included a special collar for dogs to wear at night so you could see them, and a new kind of traffic light.
[Image description top: A glamorous portrait photo of Hedy Lamarr wearing a violet blouse, white pearl necklace, and classic makeup, with styled dark hair. She looks slightly away from the camera with a confident expression.]
One evening, she met a Hollywood composer called George Antheil, who was also interested in technology. The world was at war. Hedy was sad because the German submarines were firing at and destroying ships which brought food to them. Together they decided to find a way of stopping the submarines. They came up with a system to block the signals used to control the torpedoes. At the time, the US military wasn’t interested, probably because they needed a hobby. That’s when she decided to become an inventor and she turned one of the rooms in her home into a laboratory.
Her idea finally had the recognition it earned. Today many scientists say that Hedy’s work was the base of the technology used in today’s wireless technology. We can see it in our mobile phones.
In 1997, she got the Electronic Frontier Foundation Pioneer Award. Then in 2014, fourteen years after her death, the National Inventors Hall of Fame added her name to the list of America’s most important inventors.
[Image description bottom: A photo of a dark grey military submarine floating in the ocean, partly submerged, with its conning tower clearly visible. It is calm and overcast.]
Page 70–71
13 How many of these tasks can you do?
1 Hedy Lamarr starred in 20 films.
  T / F
 2 Hedy worked for a technology company.
  T / F
 3 Hedy was born in Austria.
  T / F
 4 Hedy married a man who
  ☐ was in the film business.
  ☐ had a company that made weapons.
  ☐ tried to become rich.
 5 Hedy’s films were successful,
  ☐ but she found acting boring.
  ☐ and she liked her life in Hollywood.
  ☐ but she wanted her husband with her.
 6 Hedy’s first invention was
  ☐ a huge success right away.
  ☐ not really successful.
  ☐ well-liked in Hollywood.
7 How did Hedy’s inventions stop torpedoes from hitting boats?
 ..................................................................................................................
 8 Why didn’t the army take Hedy seriously?
 ..................................................................................................................
 9 How do people remember Hedy today?
 ..................................................................................................................
14 Listen and check your answers.
15 Listen to Monica’s presentation on Joy Mangano and circle T (True) or F (False).
1 Jennifer Lawrence plays the part of Joy Mangano in a movie.
  T / F
 2 Joy started inventing things when she was 25.
  T / F
 3 Joy wanted to invent things that made life easier.
  T / F
 4 The miracle mop was her first hit.
  T / F
 5 You can wring* the mop without getting your hands wet.
  T / F
 6 The mop sold extremely well from the first day on.
  T / F
 7 When Joy went on shopping TV, she immediately sold lots of miracle mops.
  T / F
 8 Joy encourages girls to become inventors too.
  T / F
*VOCABULARY: wring = auswringen, auspressen
[Image description: A smiling woman with blonde hair, wearing a black top and gold necklace, stands in front of a display with “joy” and “macy’s” logos. Behind her are shelves with colorful products.]
16
 Think of a useful/funny/weird invention. What could it be? How would it work? How would you sell it? Who would you sell it to? Then present your ideas to the class.
17
 Read the task and what a student wrote. How many objects are there on how many floors?
Task
 Imagine you have been to a museum and have to write a description (120–180 words) of that museum.
 Write about:
 ✔ where the museum is and what history it has
 ✔ how big it is and what you can see there
 ✔ your favourite object
 ✔ how much time you spent there
Last week, our school went to the Science Museum in London. It is in South Kensington and it is a massive old building. Originally, the science collection was in a museum across the road, but in 1862 it moved into the building that is now the Science Museum. It is one of London’s top attractions and more than 3 million people visit it every year. There are more than 300,000 items on four floors. Some items are very famous, such as the early steam locomotives or the first jet engine or the Clock of the Long Now that keeps time for 10,000 years. There are also good displays on medical history, and in 2014 a gallery on the Information Age opened. There are many more galleries, and they are all very interesting. One of my favourite objects is Eric, England’s first robot. He was built in 1928 and has been recreated for the Science Museum. Eric can talk and move – in a mechanical way. We spent half a day at the Science Museum, but you need days to see everything.
[Image description: Interior photo of the Science Museum in London. A large globe structure is suspended in the center, glowing with orange and red light. Visitors walk underneath. There is a dark exhibit area on the right and a curved white arrow pointing into the space.]
Language tip: Making paragraphs
 Use paragraphs to help structure your text. Each one should focus on one idea (or maybe two connected ideas). When you want to focus on a new idea, start a new paragraph. This is important because it makes it easier for the reader to understand the text.
 It’s a good idea to use bullet points in the task to help you organise your paragraphs. Think which of the points can be combined into a single paragraph.
Page 72–73
18 Look at the text and the bullet points in 17 again. Use the bullet points to help you divide the text into four paragraphs. Put a 🟧 to show the start of a new paragraph.
Writing tip: Writing a description
 When writing a description, think carefully about:
 ✔ how many facts you include – remember the word limit
 ✔ how much detail you want to include
 ✔ the technical or special vocabulary you want to use
 ✔ who your readers are
19  Now write your own answer to the following task.
Task
 Write a description of a house – either your house or the house of a person you know (120–180 words).
 Write about:
 ✔ where the house is and what it looks like
 ✔ how big it is and what kind of rooms there are
 ✔ how the rooms are furnished
 ✔ your favourite room
WORD FILE
 Inventions
to invent
 to experiment
 to improve
 to discover
 to work sth. out
 to design
 to try out
 to produce
[Image description: Two cartoon scientists (a boy and a girl) stand in front of a chemistry set. Light bulbs are glowing above their heads, symbolizing invention and ideas.]
MORE Words and Phrases
Word	Example sentence	German
bacon	Lots of people love bacon and egg for breakfast.	Speck
to decorate	Then someone invented electric lights to decorate houses.	dekorieren
dish	I invented a new dish with the cook of the restaurant.	Gericht
fat	I like bacon with less fat.	Fett
invention	He worked on his invention for a number of years.	Erfindung

Word	Example sentence	German
➊ crowd	He can make a huge crowd laugh.	Publikum, Menschenmenge
current	He passed current through his body.	(elektrischer) Strom
to develop	In the late 1880s, Tesla developed a new kind of electricity.	entwickeln
electric (motor)	Tesla invented the electric motor.	elektrisch; (Elektro)motor
energy	He said he could send energy waves through water.	Energie; Strom
influence	Edison used his influence to tell people that AC was too dangerous.	Einfluss
inventor	Thomas Edison was perhaps the most famous inventor of his time.	Erfinder/Erfinderin
to invest	Edison invested all his money in DC.	investieren
perhaps	Perhaps it was his mother.	vielleicht, eventuell
to be responsible for	The invention was also responsible for his bad luck.	für etw. verantwortlich sein
to shoot	He used the Tesla coil to shoot large electric lightning bolts into the room.	schießen
➌ confident	I’m quite confident it will work.	(selbst)sicher; zuversichtlich
to impress	I’ve invented something that I think might impress my teacher.	beeindrucken
➍ soap	Use soap to wash your hands.	Seife
device	This device allows people to talk under water.	Gerät
product	He started a company to produce his product.	Produkt
remarkable	Kids can sometimes produce something quite remarkable.	bemerkenswert
to research	He decided to research underwater acoustics.	erforschen, recherchieren
wrist	Her wrist was hurting from the cold.	Handgelenk
crutches	She uses a walker or crutches to move about.	Krücken
illness	Her illness had stopped Sadie from entering the competition.	Krankheit
ramp	She needs to look for ramps to get up and down steps.	Rampe
wheelchair	A wheelchair helps her get around.	Rollstuhl
➎ to adapt	She is able to adapt easily to different situations.	anpassen
to attach	I’ll attach a picture to my email.	anfügen, anhängen
glove	Wear some gloves to keep your hands warm in winter.	Handschuh
housework	Busy parents don’t have enough time for housework.	Hausarbeit
automatically	When the cat wants to go inside, the flap opens automatically.	automatisch
collar	I’ve created a collar for our cat.	Kragen
computer science	His best subject at school is computer science.	Informatik
engineer	What subjects do you need to study to be an engineer?	Techniker/Technikerin
inspiration	This is not the kind of inspiration I’m looking for right now.	Inspiration
to repair	I love repairing things and playing around with new ideas.	reparieren
to support	I want to do things that will support my dream for the future.	unterstützen

```

## Output contract

Write `content/corpus/units/g3-u08/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u08",
  "briefBank": "7622da26418c",
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
