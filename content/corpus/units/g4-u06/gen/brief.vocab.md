# Vocab generation brief — g4-u06 (MORE! 4, Unit 6)

<!-- domigo:gen vocab g4-u06 bank=4ede02fd891e prompt=346902f9f0f1 -->

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
| g4u06.w.achieve | achieve | erreichen | phrase | — | After all this hard work, they finally achieved their goal. | — | achieve |
| g4u06.w.donate | donate | spenden | phrase | — | We donated our old clothes to charity. | — | donate |
| g4u06.w.drop-out | drop out (of school) | (die Schule) abbrechen | phrase | — | He dropped out of high school at the age of 16. | — | drop out ; drop out of school |
| g4u06.w.goal | goal | Ziel | phrase | — | Her primary goal is to get a college degree. | — | goal |
| g4u06.w.income | income | Einkommen | phrase | — | I have an income of 25,000 pounds a year. | — | income |
| g4u06.w.inspire | inspire | inspirieren | phrase | — | She inspired generations of future scientists. | — | inspire |
| g4u06.w.support | support | unterstützen | phrase | — | I completely support your decision. | — | support |
| g4u06.w.encouragement | encouragement | Ermutigung ; Förderung | phrase | — | Teachers should give their students a lot of encouragement. | — | encouragement |
| g4u06.w.community | community | Gemeinschaft | phrase | — | The festival was a great way for the local community to get together. | — | community |
| g4u06.w.exceed | exceed | übertreffen | phrase | — | The cost must not exceed 10 dollars. | — | exceed |
| g4u06.w.frustrated | frustrated | frustriert | phrase | — | He lost the match and was really frustrated. | — | frustrated |
| g4u06.w.grateful | grateful | dankbar | phrase | — | I'm sure the museum will be grateful for all the donations. | — | grateful |
| g4u06.w.in-particular | in particular | besonders ; im Speziellen | phrase | — | She didn't know anybody in particular. | — | in particular |
| g4u06.w.learn-a-lesson | learn a lesson | eine Lehre aus etw. ziehen | phrase | — | My computer crashed before I saved the document – I've learned my lesson, and now I save everything all the time. | — | learn a lesson |
| g4u06.w.range-of | range of | eine Reihe von ; zahlreiche | phrase | — | We discussed a wide range of topics. | — | range of |
| g4u06.w.relate-to | relate to | sich mit jdm./etw. identifizieren ; nachempfinden | phrase | — | The same thing happened to me; I can relate to your feelings. | — | relate to |
| g4u06.w.small-wonder | Small wonder | Kein Wunder | phrase | — | Small wonder that we're lost, since we didn't ask for directions. | — | Small wonder |
| g4u06.w.transmit | transmit | senden ; übermitteln | phrase | — | The data is transmitted via Bluetooth. | — | transmit |

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
- **g3-u10**: to hand out leaflets, to sign a petition, to go on a protest march, to organise a meeting, to send out emails, to recycle paper, glass, plastic and cans, to save water and energy, to buy locally produced food, Don't drop litter., Don't drive short distances., Don't leave bottles or cans on the beach., Don't buy a new bag. Bring your own., ability, to exist, right(s), in general, quality, to be able to do, cottage, compromise, Good point., to take action, town hall, way out, majority, argument, to protest, city council, cloth bag, hardly ever, lazy, wrapping, to stand up for, suffrage, suffragette, to vote, to attend, to be equal, law, nowadays, to treat, to arrest, education, to speak out, to refuse, to close down, non-violent, businessman (pl businessmen), concern, debate, headteacher, to involve, organisation
- **g3-u11**: canyon, dirt road, ridge, headquarters (pl), to spot sth., a dry place, to have no signal, backpack, fabulous, height, capital, independent, innovation, state, to commute, connection, programmer, steep, to crack, four-wheel drive, gold digger, gold rush, lip, mountain range, shade (no pl), to be situated, thirst, criminal, cyclist, familiar, ferry, guided, to take over, to catch (the train), information office, railway, totally
- **g3-u12**: drought, earthquake, hurricane, volcanic eruption, mudslide, avalanche, forest fire, tsunami, flood, fire drill, escape route, smoke detector, meeting place, to check doors, to crawl low, to stop, drop & roll, research, to be trapped, pressure, surface, undersea, border, damage, to evacuate, to measure, region, violent, to keep away from, to fall down, to realise, survival, underneath, ash, castaway, to deliver, delivery company, flame, to get used to, hometown, joy, parcel, raft, shelter, to turn into, miracle, desert island, pleasure (no pl), in case of, lighter, to collapse
- **g3-u13**: to make up your mind, to sleep on it, to find a way out of a dilemma, to be in two minds about sth., to have second thoughts about sth., to be at a loss, dilemma, to reach a decision, to cancel, disappointment, granddad, to kick sb. off, to move, to rethink, to deserve, except, It's a shame., lift, alibi, ID (=identification), to keep quiet, to tell on sb., detention, to put up, to ask sb. out, accidentally, to argue, to look the other way, to pretend, to reject, homemade, neither of, voucher, to wrap
- **g3-u14**: to plan a trip, to book a holiday, to make a hotel reservation, to hire a car, to check the area out online, to buy a dictionary, to find out about good restaurants, to find information about the best beaches, to look at a map of the area, to find out what to do there, bug, to prefer, official language, balcony, crime, to dig, shocked, wild animal, wetland, otherwise, stuffed, wildlife, at once, branch, by the way, impolite, round a bend, bush, cut, to drive off, engine, front seat, park ranger, sunburn, to turn over, to whisper, crash
- **g4-u01**: be aware of sth, Catholic, fluent, independent, leading, member, primary school, cattle, cheer, crop, famine, found, free state, fungus, government, grain, incident, intention, interfere, landlord, majority, put down, shake hands, starve, Guess!, I'd rather, foreigner, improve, tax, hiking, proper, admire, be terrified, nonsense, thunder, unconscious
- **g4-u02**: illegal, suspect, criminal, to steal, evidence, victim, blackmail, murder, weapon, witness, chest, employee, mystery, report, attractive, nephew, office clerk, keep an eye on, confusion, relative, retire, right away, take over, unlock, upset, consider, mention, likely, besides, expect, handkerchief, Never mind., suspicion, wastepaper bin, excellent, conclusion, get hold of sth, prove, historical, commit, escape, investigation, common, personal, crime scene, realise
- **g4-u03**: busy, cuisine, immigrant, native, nearby, origin, politics, announcement, be in trouble, blow up, emergency landing, evacuate, flock of birds, glide down, miracle, on duty, rescue boat, runway, takeoff, treatment, wing, become desperate, collide, explode, bravery, reward sb, critic, elevator (AE), campaign, charge, crowd-funding, statement
- **g4-u04**: accountant, receptionist, mechanic, nurse, health care, marketing, finance, electrician, secretary, flight attendant, computing, computing, finance, health care, sales and marketing, deserve, female, male, satisfaction, unemployed, career, be keen on, be responsible for, bonus, deadline, develop, earn, launch, pros and cons, salary, think up, working hours, advice, ambition, casual, company, confidently, employer, enthusiastic, eye contact, (job) interview, memorise, naturally, skills, journalism
- **g4-u05**: artificial, fattening, filling, revolting, harmful, healthy, nutritious, fresh, tasty, vegetarian, afford, feed, hunger, intake, waste, contain, cookery, diet, even though, health, nutrition, overweight, regularly, dislike, habits, accept, afterwards, eating disorder, gain, gym, thin, throw up, (be) ashamed, trust
- **g4-u06**: achieve, donate, drop out (of school), goal, income, inspire, support, encouragement, community, exceed, frustrated, grateful, in particular, learn a lesson, range of, relate to, Small wonder, transmit

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Cooperative, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leeds, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g4u06.w.achieve` ← v1 `achieve`: d="To succeed in doing something good after working hard" · s="If you study hard enough, you can _____ anything you want." · a=["achieved"] · mc=["accomplish","succeed","obtain"]
- `g4u06.w.donate` ← v1 `donate`: d="To give money, food, or goods to help a person or organisation" · s="Our school decided to _____ books to the children's hospital." · a=["donated"] · mc=["contribute","invest","collect"]
- `g4u06.w.drop-out` ← v1 `drop out (of school)`: d="To quit your studies before finishing your education" · s="She wanted to _____ at 15, but her parents convinced her to stay." · a=["drop out","dropped out","drop out of school","dropped out of school"] · mc=["fail (at school)","skip (school)","graduate (from school)"]
- `g4u06.w.goal` ← v1 `goal`: d="Something that you are trying to achieve" · s="My biggest _____ this year is to pass all my exams." · a=["goals"] · mc=["aim","dream","purpose"]
- `g4u06.w.income` ← v1 `income`: d="The money that a person earns from work or receives regularly" · s="Many families find it hard to live on a low _____." · a=[] · mc=["salary","profit","budget"]
- `g4u06.w.inspire` ← v1 `inspire`: d="To give someone the desire or confidence to do something great" · s="My art teacher really _____ me to start painting every day." · a=["inspire","inspired"] · mc=["motivate","encourage","influence"]
- `g4u06.w.support` ← v1 `support`: d="To help someone by giving them encouragement, money, or practical assistance" · s="My parents always _____ me when I have problems at school." · a=[] · mc=["assist","encourage","sponsor"]
- `g4u06.w.encouragement` ← v1 `encouragement`: d="Words or actions that give someone confidence or hope" · s="A few words of _____ from my coach helped me win the race." · a=[] · mc=["motivation","praise","guidance"]
- `g4u06.w.community` ← v1 `community`: d="A group of people who live in the same area or share something in common" · s="Everyone in our _____ helped clean up the park last weekend." · a=["communities"] · mc=["society","neighbourhood","population"]
- `g4u06.w.exceed` ← v1 `exceed`: d="To go beyond a limit or to do more than expected" · s="Your essay should not _____ 200 words — if it is longer, the teacher will not accept it." · a=[] · mc=["surpass","extend","increase"]
- `g4u06.w.frustrated` ← v1 `frustrated`: d="Feeling annoyed and upset because you cannot do or achieve what you want" · s="She felt _____ because she couldn't solve the maths problem." · a=[] · mc=["disappointed","confused","impatient"]
- `g4u06.w.grateful` ← v1 `grateful`: d="Feeling or showing thanks for something kind that someone has done" · s="I'm so _____ that you helped me carry all those bags." · a=[] · mc=["thankful","pleased","generous"]
- `g4u06.w.in-particular` ← v1 `in particular`: d="Especially; more than others" · s="I like all sports, but tennis _____ is my favourite." · a=[] · mc=["in general","for example","above all"]
- `g4u06.w.learn-a-lesson` ← v1 `learn a lesson`: d="To gain wisdom or understanding from a mistake or experience" · s="After I forgot my homework twice, I _____ and started using a planner." · a=["learn a lesson","learned a lesson","learnt a lesson","learned my lesson"] · mc=["make a mistake","set an example","take a chance"]
- `g4u06.w.range-of` ← v1 `range of`: d="A variety of different things of the same general type" · s="The shop offers a wide _____ snacks and drinks." · a=[] · mc=["variety of","number of","selection of"]
- `g4u06.w.relate-to` ← v1 `relate to`: d="To understand someone's feelings or experiences because you have had similar ones" · s="I can really _____ what you're going through — I had the same problem." · a=[] · mc=["refer to","belong to","respond to"]
- `g4u06.w.small-wonder` ← v1 `Small wonder`: d="It is not surprising at all" · s="She eats ice cream for every meal. _____ she doesn't feel well." · a=["small wonder"] · mc=["No doubt","Of course","How come"]
- `g4u06.w.transmit` ← v1 `transmit`: d="To send or pass something from one person or place to another" · s="Mobile phones _____ signals to towers that can be many kilometres away." · a=["transmitted"] · mc=["transfer","broadcast","deliver"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 4 SB Unit 6.txt -----
Unit 6 Kids make a difference
Page 50–51
You learn
about inspirational teenagers
how to use adverbs of manner
how to use question tags
You can
talk about what inspires you
write about your own project
agree or disagree
Vocabulary Making a difference
1 Match the words with the definitions.
1 ⬜ launch
 2 ⬜ inspire
 3 ⬜ award
 4 ⬜ goal
 5 ⬜ ambitions
 6 ⬜ support
 7 ⬜ donate
 8 ⬜ in need
 9 ⬜ income
 10 ⬜ drop out
☐ the aim of what you are doing
 ☐ to make people want to do good things
 ☐ to start something (e.g. website, campaign, etc.)
 ☐ to want help (financially, emotionally, etc.)
 ☐ to agree with a cause (and maybe help with it too)
 ☐ to give money or your time for free
 ☐ to stop doing something
 ☐ the money you earn from doing something
 ☐ the things you want to achieve
 ☐ prize
2 Look at the pictures. What difference do you think Patricia has made?
3 Read the text and write the phrases A–F in the gaps.
A. the importance of dreams and ambitions
 B. to reach your goals and dreams
 C. contains a letter
 D. community service helps
 E. donate a box
 F. to be successful in school
Making a difference
There are over 16 million children in America living in families with incomes below the poverty level and many of them drop out of school because school supplies are too expensive. Patricia Manubay decided to do something about it.
In 2016, Patricia Manubay, a student at El Camino High School in San Francisco, was given an award for her project Dream Boxes. The purpose of Dream Boxes was to give children the supplies they needed 1 and to give them the support they needed to make their dreams happen.
Patricia launched her project at the Jefferson Awards in New York City in 2015. The idea for it came from Patricia’s love for education, learning, reading and writing, but also from her own struggle with bullying and her lack of confidence.
Here’s how she says Dream Boxes works: “People from around the country can 2 that’s packed with school supplies such as pencils, erasers, one or two books to read, a few notebooks, a backpack, a dream journal, and a letter of encouragement to help inspire kids on their academic journey. The boxes are then given in need among various communities to students in need. Every Dream Box is different.
The coolest part is you’re encouraged to make your own Dream Box and share your contribution using the hashtag #DreamBoxes.
The goal for the first year of the project was to have 100,000 Dream Boxes distributed to children across the country. Patricia hoped the project would have a positive impact on young students and that it would inspire her peers to get involved in community service. “Doing 3, your leadership skills, and project planning skills that help you live in the future,” she said.
Dream Boxes believe that students should be able to find a job they are passionate about in spite of difficulties at home. Dream Boxes are mainly distributed to elementary and middle schools to talk about 4. Each month, more and more Dream Boxes are being sent to students and dreamers.
Everybody involved in the project worked hard and by the end of 2015, Dream Boxes were successfully distributed to over 50,000 students across the United States and continue to support students to this day. Dream Boxes has also been featured on MTV News, and has won many awards. The project continues to provide school supplies to students, schools and families nationwide, and talks are given to students about 5.
How can I help?
 All young people are encouraged to help. They can collect basic school supplies and spread the word. You can donate money or you can write a letter of encouragement. Each Dream Box 6 telling other students the importance of education and dreams. Sharing your experience on social media will help Dream Boxes to expand across the country. Use the hashtag #DreamBoxes.
Patricia is just one of the many young people making a difference in the world today. Why don’t you join her and make a difference too?
4 🔷 How many of these tasks can you do?
 Check your answers with a partner. Then listen to the text.
Circle T (True) or F (False).
More than 16 million children’s families don’t earn enough to live on* in America.  T / F
Many children in America leave school early because they want to.  T / F
Patricia wanted her Dream Boxes to provide children with the school things they needed.  T / F
Complete the sentences with words from the box. There are 3 extra options.
ambitious confident teach
 people of her own age inspire older people
Patricia was not very __________________________ at school.
The letters in the boxes should __________________________ children to learn.
Patricia wanted __________________________ to take part.
Answer the questions.
What was the result of all the hard work in 2015?
 ………………………………………………………………………………
What are young people taught to value?
 ………………………………………………………………………………
What can you do to bring Dream Boxes to more young people?
 ………………………………………………………………………………
VOCABULARY: live on (sth) – von etw leben
Free flow
5 Discuss the questions below.
What would you put in your letter of encouragement?
What encourages you to study?
Why is education important?
Why do we need an educated society?
Image descriptions:
 Top left: A group of teenagers smiling and holding up blue gift boxes and school supplies with “Dream Boxes” labels.
 Bottom center: A girl smiling and holding a box that says “DREAM BOXES – Education. Dreams. Success.”
Page 52–53
6 Check the meaning of these words in the dictionary. Then read the text.
frustrated relate to donation campaign range of exceed transmit
ALL KINDS OF BOOKS FOR ALL KINDS OF READERS
“You always have words. You’re able to express your emotions when you read.”
 — YOUNG ACTIVIST, MARLEY DIAS
I am sure you can remember your favourite book in primary school, can’t you? I am sure you can remember more than one. Who was the hero or heroine of the book? Was it someone like you?
An American school girl, Marley Dias, was frustrated by the books in her school library. They were all about characters she couldn’t relate to. She wanted to read about someone like her, so she started her campaign #1000blackgirlbooks. Her goal was to find 1,000 ‘black girl books’. That is books with a black girl as the main character.
Marley Dias told her mother she was bored by the books that she was being given at school. Her mother, Janice Johnson Dias, asked her what she was going to do about it. In November 2015, with the help of her mother, Marley launched her campaign to find and donate ‘black girl books’ to communities in America.
“I started this because in my fifth-grade class I was only able to read books about white boys and their dogs. I understood that my teacher could relate to those characters, so he asked us to read those books. But I didn’t relate to them, so I didn’t learn lessons from those stories,” said Marley. Now, she has exceeded her goal after huge support both online and offline. Online, her hashtag #1000blackgirlbooks has taken off, and offline the author and blogger Kelly Jensen raised nearly $3,000 in donations to help Marley collect the books she wanted. What’s more, she sent Marley a huge range of picture books and young adult titles.
The bookseller Barnes&Noble also donated books to the campaign. They said that, “Some books introduce us to characters who are different from us, and that lets us see the world from a different view point. But it is also important for children to read stories about characters they can relate to and see themselves in.”
When Marley had collected around 700 books, and she appeared on the US chat show Ellen, and she said, “In the beginning, I was worried that we weren’t going to reach our goal, but now there are strangers thanking me for doing this. It makes me feel happy because there are strangers on Facebook who are so grateful and say ‘because of this book campaign my son wants to do this’ and ‘my daughter wants to do that’, and I think that’s kind of cool.”
Now that she has exceeded her aim of #1000blackgirlbooks, Marley Dias hopes she will continue to receive donations, so she can pass them on to other schools where students are experiencing the same frustration. “We are having a book festival and donating books to St Mary, the town in Jamaica where my mother is from,” she said. “I also plan on donating books to other schools in America, including West Orange, my elementary school … where my frustration began.”
Writing on Stacked Books, blogger Kelly Jensen said she was thrilled to have been able to send so many books to Marley, but she hadn’t thought it would be so difficult to find ‘black girl books’. She also said that, “these books are not out there, not obvious, and that needs to change.”
According to statistics collected by the Cooperative Children’s Book Centre, of 3,500 children’s books surveyed in 2014, just 84 were by Africans or African Americans, and just 180 featured African or African American characters.
“Books transmit values. What is the message when we see only white children and their dogs in books?” wrote Walter Dean Myers, the late* children’s author, in The New York Times in 2014. “Where are the black children going to get a sense of who they are and what they can be? … I’m told that black children, and boys in particular, don’t read. Small wonder. There is work to be done.”
In June 2017, Marley had collected 9,000 ‘black girl books’ and she had become an author herself. Her book is called Marley Dias Gets it Done – And So Can You. So why not take her advice and start campaigning for something you believe in?
VOCABULARY: late – verstorben
7 Find words in the text (in italics) that mean:
thankful
very happy
I’m not surprised
feeling angry and upset
especially
8 Read the text again. Then answer the questions.
Why did Marley start her campaign?
 …………………………………………………………………………………
What helped her online and offline to reach her goal?
 …………………………………………………………………………………
Who are these people and how did they help Marley?
 ☐ Janice Johnson Dias
 ☐ Kelly Jensen
 ☐ Barnes&Noble
 ☐ Ellen
 ☐ Walter Dean Myers
 …………………………………………………………………………………
What did the statistics from the Cooperative Children’s Book Centre show?
 …………………………………………………………………………………
What else has Marley done recently?
 …………………………………………………………………………………
Get talking
9 Discuss in class.
What kind of characters do you look for in books?
What can you learn from characters in books? Think of an example.
Are there any books you would like to see in your local bookshop or library that aren’t there? Give examples.
Do you have a problem finding a book about someone like you? Why (not)?
Image descriptions:
 Left: Marley Dias is smiling and wearing glasses, a pink dress, and a necklace. She stands in front of a blurred background. A circular quote reads:
 “You always have words. You’re able to express your emotions when you read.”
 —YOUNG ACTIVIST, MARLEY DIAS
Bottom: Three book covers Marley likes: “I Love My Hair!”, “Brown Girl Dreaming”, and “The Summer of the Swans”. Caption: Marley with some of her favourite books.
Page 54–55
Listening
10 🎧 Listen to the interview with Ellen about the young star who inspires her and answer the question.
What is the main reason why Ellen finds Amber so inspiring?
 ☐ She has helped her change her life.
 ☐ She has shown her how to eat healthily.
 ☐ She has shown her what a young person can do.
11 🎧 Listen again and complete the text.
Inspired
 The girl who has inspired me most is Amber Kelley.
 She’s an American 1. ____________ with a YouTube
 show called 2. “____________________ With Amber.” When I
 started watching her show, I was 3. ____________ and I was being
 4. ____________ at school. She cooks 5. ____________ healthy food and
 her recipes are 6. ____________ to make. Amber has always eaten healthy
 food because her parents are wellness 7. “”. But she was bullied
 for bringing healthy packed 8. ____________ to school. When she was 9. , she shot
 a video of herself cooking. Her videos were really popular. She cooks lots of 10. “__________”
 things like raspberry ice cream with only three ingredients – almond milk, frozen raspberries and
 bananas. That’s easy, isn’t it?
 Now that I eat healthily, I have a lot more 11. “” and I do more sports. Thanks to Amber,
 we’ve started our own 12. “__________” club at school. We’re all a lot 13. “______” too.
Image description:
 Top right: A girl with long brown hair smiles while holding a bowl of food. She wears a blue apron with the logo “Cook With Amber.”
12 CHOICES
 Writing for your Portfolio
A Read the text about Marley Dias again. Then write an email (40–70 words) to a friend in which you tell him/her about a book project of your own. Write about:
what kind of books you are interested in
how you think you can come up with a collection
who might be interested in your idea
B Your local council is organising a competition to find young people who are making a difference in the world. Write a text of about 120–180 words about a project you would like to start or an inspiring project you have read or heard about. Remember to use paragraphs.
Introduce the young person and tell us a little about him or her and why he/she started the project.
Describe the project.
Say how it will benefit others.
Explain how successful it has been and what it has achieved.
Say why it is a great project.
Comment on the future of the project.
GRAMMAR
Adverbs of manner (Revision)
Mit dem Adverb der Art und Weise drückst du aus, wie jemand etwas macht oder wie etwas geschieht.
Dream Boxes were successfully distributed to over 50,000 students.
 Dream Boxes are mainly distributed to elementary and middle schools.
Complete: Regelmäßige Adverbien werden mit dem Adjektiv + -ly gebildet.
Beachte die Ausnahmen:
 good – well  fast – fast  hard – hard (→ hardly = kaum, e.g. I hardly slept at all last night.)
 Everybody worked hard.
 The project did really well in its first year.
Bei einigen Zeitwörtern (look, sound, feel, taste, smell, find) werden Adjektive und nicht Adverbien verwendet.
 Things look really bad.  That doesn’t sound good.  This food tastes awful.
Question tags
Um die deutschen Fragen oder? bzw. nicht wahr? zu bilden, verwendest du im Englischen sogenannte question tags. Hierbei gelten folgende Regeln:
Bei bejahenden Sätzen verwendest du einen verneinenden tag, bei verneinenden einen bejahenden.
That’s easy, isn’t it?
 You have cleaned your room, haven’t you?
 You aren’t from here, are you?
Im question tag wiederholst du das Hilfsverb (be oder have) bzw. das modal verb (z. B. can / should / will / might).
 She is going to London tomorrow, isn’t she?
 They haven’t done their homework yet, have they?
 All kids should eat healthily, shouldn’t they?
 You can remember your favourite book in primary school, can’t you?
 It will be sunny tomorrow, won’t it?
Wenn im Satz kein Hilfsverb oder modal verb vorkommt, verwendest du eine Form von do im question tag.
 She started her healthy cooking channel, didn’t she?
Das Nomen wird durch ein Pronomen ersetzt.
 Amber was only 11 at the time, wasn’t she?
Image description:
 Bottom right: A girl kisses a boy on the cheek. He looks shocked. Caption:
 She kissed you again, didn’t she?
Page 56–57
The Girl Next Door 3
 DEVELOPING SPEAKING COMPETENCIES
 Language function: Agreeing and disagreeing
 Speaking strategy: Being dismissive
The party
1 🎧 Watch or listen to the dialogue. Then read it.
Kate: Did you get that text from Hannah about the party on Saturday?
 Tom: Yeah, I did.
 Kate: You don’t sound very excited.
 Tom: I’m not. It’s a fancy dress party. I hate fancy dress parties.
 Kate: What?! Are you mad? Everyone likes fancy dress parties.
 Tom: Well, that’s not entirely true because I don’t. I really don’t like them.
 Kate: Why not? I mean, what’s wrong with you?
 Tom: Well, they’re just like fashion shows. Everyone just wants to show off.
 Kate: I’m not so sure about that. I think people just like dressing up.
 Tom: Well, what about those people that spend a fortune on their costumes?
 Kate: OK, you’ve got a point there, but most people just make their own. They hardly spend anything.
 Tom: Oh, please, just wait until Saturday. Everyone will be there in designer costumes.
Kate: Well, I won’t. And I already know what I’m going as. I’m not telling you though. It’s a secret. What about you? Superman, Batman, Spiderman?
 Tom: Thanks, but no! I’m a bit old for superheroes!
 Kate: Yeah, you might be right. So, what are you going to wear?
 Tom: I’ve no idea. I might not go.
 Kate: Oh, you’re so grumpy.
 Tom: You’re absolutely right. I am and I don’t care. Hang on, I’ve just got a message.
 Kate: Me too. It’s from Simon. He’s having a party on Friday. Two parties in one week!
 Tom: Please tell me it’s not another fancy dress party.
 Kate: Relax. It’s not.
2 Complete the sentences with a name.
_______________ has invited Kate to a party on Saturday.
_______________ is not looking forward to the party.
_______________ thinks fancy dress parties are for show-offs.
_______________ thinks most people like to make their own costumes.
_______________ is keeping her costume a secret.
_______________ hasn’t decided whether or not to go to the party yet.
_______________ is having a party on Friday.
Useful phrases
 Agreeing and disagreeing
3 Do you use the sentences to agree (A) or disagree (D)? Write the correct letters.
That’s not entirely true. ⬜
I’m not so sure about that. ⬜
You’ve got a point there. ⬜
You might be right. ⬜
You’re absolutely right. ⬜
4 What do you think? Answer the questions.
Who do you agree with most about fancy dress parties, Tom or Kate?
Will Tom go to the party? Why (not)?
📺 Mobile homework
🎧 Watch the second part of the video. Put the lines from Tom’s diary entry in order.
⬜ Kate goes bright red – she’s so embarrassed.
 ⬜ She suggests I go as a superhero.
 ⬜ She suggests I go as a pirate.
 ⬜ She suggests I go as a gangster.
 ⬜ Kate dresses up as a giant white rabbit.
 ⬜ She suggests I go as a cowboy.
 ⬜ I decide not to wear a costume.
Speaking strategy
 Being dismissive
4 Complete. Then check with the dialogue in 1.
Tom: I hate fancy dress parties.
 Kate: I “”?! A ________________ you “”? Everyone likes fancy dress parties.
 Tom: Well, that’s not entirely true because I don’t. I really don’t like them.
 Kate: Why not? I mean, “w__________________ w__________________ you?”
 Kate: “__________________ most people just make their own. They hardly spend anything.”
 Tom: Oh, “p__________________”. Just wait until Saturday. Everyone will be there in designer costumes.
5 ROLE PLAY: You have decided to have a party to celebrate the end of school. In pairs, decide on the following:
the theme of the party
what to wear
what food to have
what music to play
where to have the party
when it starts and finishes
Agree and disagree with each other until you have come up with a party you are both happy with. Take 1 minute to practise your dialogue. Don’t write it down. Act it out for the rest of the class (4–5 minutes).


----- WB: More 4 WB Unit 6.txt -----
UNIT 6 Kids make a difference
Page 45
Reading
 1️⃣ Read about three young activists and the statements in the box on page 46. Decide for which activist each statement is TRUE and put a cross ⓧ in the correct box.
 The statement may be correct for more than one activist.
TEENAGE ACTIVISTS
[Image description: Three oval black-and-white photos arranged horizontally.
 Left: A bird sitting on a branch (related to Simon Jones).
 Middle: A smiling girl holding a microphone in a school setting (related to Dawn Smith).
 Right: A person standing on a beach holding a litter picker with rubbish (related to Liam Right).]
NAME: SIMON JONES
 AGE: 15
 PROJECT: SAVE THE HOUSE SPARROW
WHAT THEY SAY:
 The house sparrow is still our most common bird but its numbers have declined by more than 70% over the last 10 years. If this continues there may well not be any left by the year 2050. I believe we need to act now to stop this happening.
 We can help this situation immediately by protecting the environment they need to live in: our gardens. We can put up nesting boxes and bird feeders.
 But I believe we need to think about the long-term solutions and we can only do this by educating our children. This is why we go into schools to show what is happening to our wildlife and show how we can help stop this.
NAME: DAWN SMITH
 AGE: 14
 PROJECT: YOUNG PEOPLE IN POLITICS
WHAT THEY SAY:
 Too many young people are not interested in politics. They are happy for people much older than themselves to make decisions about their future. We want to encourage children of all ages to get more involved. We believe that if the voting age was reduced to 16, more young people would be interested and we are campaigning to make this happen.
 We also visit schools and colleges to talk to students about politics and organise activities to show them how important it is. We help them set up school committees to show them how politics can work on a smaller scale.
NAME: LIAM RIGHT
 AGE: 13
 PROJECT: CLEAN UP OUR BEACHES
WHAT THEY SAY:
 We are tired of the litter that is left behind on our beaches and we are determined to make this stop. Once a fortnight we organise a litter-picking-up day where volunteers go to the beach and clean up the mess. But, of course, this doesn’t solve the long-term problem, so we also go up to people on the beach and talk to them about the problem. Most people are very happy to hear what we have to say.
 One small thing that we have done is to get the local council to put up more litter bins on the beaches and this has certainly helped in the fight against litter.
Pages 46–47
Put a cross ⓧ to show which statements are TRUE.
This person	Simon Jones	Dawn Smith	Liam Right
1 believes that schools are a good place to get their message across.	☐	☐	☐
2 has already seen an improvement in the situation they want to change.	☐	☐	☐
3 wants to see a change in the law.	☐	☐	☐
4 is concerned about the environment.	☐	☐	☐

Listening
 2️⃣ Listen to the interview with Sheila (12) and tick the correct answer.
Sheila and her helpers collect
 ☐ any garbage.
 ☐ only aluminium cans.
 ☐ plastic and glass bottles and aluminium cans.
 ☐ whatever families give them.
Sheila and her helpers
 ☐ are collecting from neighbours.
 ☐ walk around and see if there’s anything to collect.
 ☐ collect from recycling centres.
 ☐ collect 24/7 if possible.
Sheila’s idea
 ☐ didn’t really work.
 ☐ spread to other communities.
 ☐ was taken up by recycling centres.
 ☐ was taken up by a seven-year-old.
Sheila was inspired by
 ☐ a website.
 ☐ a seven-year-old boy.
 ☐ her parents.
 ☐ a company called The Recyclers.
In the Santa Rosa area
 ☐ hers is the only recycling project.
 ☐ there’s a professional organisation that supports Sheila.
 ☐ the Recyclers earn a lot of money with plastic bottles.
 ☐ there are something like 20 projects that do the same.
[Image description: A young girl wearing a light-coloured t-shirt smiles at the camera. She stands in front of large bags filled with recyclables such as plastic bottles and cans.]
Grammar
 Adverbs of manner
3️⃣ Circle the correct option.
Amber eats really healthily / healthy.
She accepted the donation grateful / gratefully.
The meeting was really quick / quickly. It was over in ten minutes.
The meals always tasted delicious / deliciously.
The collection of books grew rapid / rapidly.
Some families can hard / hardly afford school supplies.
To distribute everything was a really easy / easily job.
She manages the project very good / well.
4️⃣ Complete the sentences with the correct adverbs.
[Image 1: Girl with a guitar.]
She plays the guitar really __________.
[Image 2: Two people walking together.]
 2. Slow down. You’re walking too __________.
[Image 3: Boy holding his head, looking unwell.]
 3. He’s not feeling very __________.
[Image 4: Boy on a skateboard.]
 4. He likes to live __________.
5️⃣ Adjective or adverb? Fill in the correct form of the word in brackets.
Like many schools, our school had the idea to donate food to a group of refugees that lived 1 __________ (close) to our school. One of the religious education teachers said she would 2 __________ (happy) help us to organise everything
 3 __________ (efficient).
 4 __________ (quick) we established a committee to run everything
 5 __________ (professional). We fixed two days on which everybody could bring in food items like pasta, rice, cans, coffee, tea – in short, anything that could be stored
 6 __________ (easy).
Then we worked 7 __________ (hard) on creating a dozen posters telling the kids of our school when to bring in food and where to take it. (We had an extra room for the stuff.)
 And we 8 __________ (prompt) fixed a date for a handful of refugees to pick up the food and distribute it 9 __________ (fair) at their place.
 It was 10 __________ (amazing) how many items were brought in. Our extra room was 11 __________ (total) full, and we had to help the refugees to carry all the stuff to their home. I must say, I felt really 12 __________ (good) about being part of that project.
Pages 48–49
6️⃣ Fill in the correct forms of the words in brackets.
This idea sounds really _____________________________ (different) from all the others.
I _____________________________ (total) agree that it’s a good idea.
It feels _____________________________ (good) to be able to help.
I _____________________________ (serious) believe that your hopes are too high.
We should organise the project more _____________________________ (efficient).
You can _____________________________ (hard) call that a good plan.
Can I remind you that the plan worked _____________________________ (good) in the first year?
I believe this project is developing too _____________________________ (fast).
We should _____________________________ (quick) rethink our strategy.
Your idea sounds _____________________________ (good) to me.
Grammar
 Question tags
7️⃣ Complete the sentences with the correct question tags.
[Image 1: Girl with glasses holding a huge pile of groceries.]
You didn’t collect all the bottles yourself, _____________________________ ?
[Image 2: Woman carrying a tall stack of boxes.]
 2. It’s a lot of work, _____________________________ ?
[Image 3: Woman frowning and reading a letter.]
 3. She doesn’t like the books she’s given, _____________________________ ?
[Image 4: Boy eating a fast-food meal.]
 4. Tim should eat healthily, _____________________________ ?
[Image 5: Girl with glasses holding a pile of books and smiling.]
 5. One woman has donated more than 100 books, _____________________________ ?
[Image 6: Girl placing items into a recycling bin.]
 6. You are a member of the wastewatchers, _____________________________ ?
8️⃣ Circle the correct question tags.
I’m pretty good at running a project, aren’t I? / am I?
They haven’t been to the recycling centre for weeks, haven’t they? / have they?
She can’t collect everything on her own, can she? / can they?
They’d been able to help the community a lot, didn’t they? / hadn’t they?
We should take part in the project as well, shouldn’t we? / couldn’t we?
9️⃣ Complete the dialogue with the correct question tags.
A So you are still willing to take part in the project, 1. _____________________________ ?
 B Sure. It’s been a lot of work so far, 2. _____________________________ ?
 A Yes, indeed.
 B Well, I could help you with driving the truck, 3. _____________________________ ?
 A Really? Could you? You’ve got a licence, 4. _____________________________ ?
 B Sure, no problem.
 A That’s settled then, 5. _____________________________ ?
 B Yes. I’ll start tomorrow, 6. _____________________________ ?
 A Yes, please.
🔟 Choose the correct word to complete each sentence.
We hope to _______________ our new website on Monday.
 ☐ inspire
 ☐ donate
 ☐ launch
The company’s _______________ for the last year was over £10 million.
 ☐ goal
 ☐ in need
 ☐ income
Her amazing story has _______________ children all over the world.
 ☐ dropped out
 ☐ launched
 ☐ inspired
He was given the _______________ for his work with disabled children.
 ☐ award
 ☐ ambition
 ☐ goal
I would like to thank all the people who have _______________ me on my amazing journey.
 ☐ donated
 ☐ supported
 ☐ dropped out
I don’t really have any _______________ to make a lot of money. I just want to be happy.
 ☐ ambition
 ☐ goal
 ☐ income
He _______________ £1 million to an animal charity.
 ☐ inspired
 ☐ supported
 ☐ donated
All the money will go to children _______________ of a better future.
 ☐ in need
 ☐ dropped out
 ☐ inspired
My grandfather _______________ of school when he was only 14.
 ☐ launched
 ☐ dropped out
 ☐ inspired
Our _______________ is to bring fresh water to 20 villages in the next year.
 ☐ ambition
 ☐ goal
 ☐ award
Pages 50–51
1️⃣1️⃣ Complete the text with the words in the box.
Box:
 donate launched inspired income support drop out goal award
A few months ago I saw an amazing programme about a TV presenter who has lived with autism all his life. Even though he had problems at school and had to 1. ______________________ when he was 16, he went on to have a really successful career earning a really good 2. ______________________. His story really 3. ______________________ me and I decided to find out more about the subject and to see if I could do anything to help 4. ______________________ children at my school with autism. I don’t have a lot of money so I decided to 5. ______________________ as much of time as possible to helping out. I found out that many of the children find it difficult to make friends, so I 6. ______________________ a scheme* to help solve this problem. My 7. ______________________ was that no child should have to spend playtime on their own. A lot of my time was spent trying to help other people understand what it’s like to live with autism. The scheme was really successful and I was given an 8. ______________________ by the head teacher for making a difference.
VOCABULARY: *scheme – Plan, Projekt
Developing speaking competencies
1️⃣2️⃣ Read the dialogues and complete them with words from the box.
Box:
 right entirely might you What please true sure not point wrong absolutely right mad
Mike: Did you see Neymar’s goal in the game last night?
 Tim: Yes, it was alright.
 Mike: Alright? What’s 1. ______________________ with 2. ______________________? It was brilliant.
 Tim: I’m 3. ______________________ so 4. ______________________ about that. It was good. But brilliant? I’ve seen better.
 Mike: Oh, 5. ______________________! You won’t see a better goal this year. I promise.
 Tim: Well, you would say that. You are Brazilian.
 Mike: That’s not 6. ______________________. I’m half Brazilian.
 Tim: But you’re still biased.*
 Mike: You’ve got a 7. ______________________ there, but I still think it was an amazing goal.
VOCABULARY: *biased – voreingenommen
Alice: I’m not so keen on the new Ed Sheeran song.
 Lucy: 8. ______________________? Are you 9. ______________________? It’s really good.
 Alice: I’m not so sure. I mean he has done better.
 Lucy: You’re 10. ______________________ 11. ______________________ there, but it doesn’t mean this one isn’t good.
 Alice: You 12. ______________________ be 13. ______________________. Maybe I need to listen to it a few more times.
 Lucy: Yes, do that. I’m sure you’ll change your mind.
1️⃣3️⃣ Now listen and check your answers.
Developing writing skills
 Biography
1️⃣4️⃣ Read the task and what a student wrote. What did Abigail get from the President?
Task
 Pick a person of interest and write his/her biography (120–180 words). Write about:
when he/she was born
where he/she was born
how he/she grew up
what he/she is especially good at
what one of his/her major projects is at the moment
where you can learn more about him/her
Abigail Lupi
Abigail was born in Stockholm, NJ in 2001, and she has become quite a celebrity. She performed her first musical show when she was seven at an old people’s home in honour of her great-grandmother’s 100th birthday. There she discovered many of the elderly didn’t have visitors. Abigail then had the idea to invite friends to perform with her at nursing homes and children’s hospitals throughout the state. CareGirlz, Abigail’s ensemble of 13 girls, age 6 to 13, has a repertoire of more than 90 Broadway and pop songs, and they have performed in over 20 different places. For her work Abigail was given the President’s Award in 2011. She then moved on into theatre and film, and in 2015 she received the Young Artist Award. Abigail also writes poetry (for which she got another award) and she has a black belt in Taekwondo. She is certainly a very busy girl. If you want to find out more about Abigail, check the internet and see if she’s still writing her blog.
1️⃣5️⃣ Read the text again. Then complete the timeline for Abi.
2001
 Abi is born in
 Stockholm, NJ.
2015
 [blank space for student to complete]
Pages 52
Writing tip
 Writing a biography
 When writing a biography it is usual to write about their life in chronological order. Drawing a timeline can help you organise this and help you structure your writing. If you are writing about a famous person the internet is a good source of information, but make sure you don’t just copy directly from a website. Here is some of the information you might want to include:
 • the date and place of birth
 • the educational background
 • the major events in their life
 • their major achievements
 • any awards they have won
 • the importance of the person in the community
1️⃣6️⃣ Now write your own answer to the following task.
Task
 Pick an important person from the field of entertainment, science, or sport and write a short biography (120–180 words).
 Include:
 • why they are famous
 • when and where they were born
 • a few facts from their childhood
 • how they became famous
 • what they have achieved
 • why you admire them
MORE Words and Phrases
	Word	Example sentence	German Translation
1	achieve	After all this hard work, they finally achieved their goal.	erreichen
	donate	We donated our old clothes to charity.	spenden
	drop out (of school)	He dropped out of high school at the age of 16.	(die Schule) abbrechen
	goal	Her primary goal is to get a college degree.	Ziel
	income	I have an income of 25,000 pounds a year.	Einkommen
	inspire	She inspired generations of future scientists.	inspirieren
	support	I completely support your decision.	unterstützen
3	encouragement	Teachers should give their students a lot of encouragement.	Ermutigung; Förderung
8	community	The festival was a great way for the local community to get together.	Gemeinschaft
	exceed	The cost must not exceed 10 dollars.	übertreffen
	frustrated	He lost the match and was really frustrated.	frustriert
	grateful	I’m sure the museum will be grateful for all the donations.	dankbar
	in particular	She didn’t know anybody in particular.	besonders; im Speziellen
	learn a lesson	My computer crashed before I saved the document – I’ve learned my lesson, and now I save everything all the time.	eine Lehre aus etw ziehen
	range of	We discussed a wide range of topics.	eine Reihe von, zahlreiche
	relate to	The same thing happened to me; I can relate to your feelings.	sich mit jdm/etw identifizieren; nachempfinden
	Small wonder	Small wonder that we’re lost, since we didn’t ask for directions.	Kein Wunder
	transmit	The data is transmitted via Bluetooth.	senden, übermitteln

```

## Output contract

Write `content/corpus/units/g4-u06/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g4-u06",
  "briefBank": "4ede02fd891e",
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
