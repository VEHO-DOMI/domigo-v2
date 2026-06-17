# Vocab generation brief — g4-u05 (MORE! 4, Unit 5)

<!-- domigo:gen vocab g4-u05 bank=d475a7bb945f prompt=346902f9f0f1 -->

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
| g4u05.w.artificial | artificial | künstlich | wordfile | Food | — | — | artificial |
| g4u05.w.fattening | fattening | dick machend | wordfile | Food | — | — | fattening |
| g4u05.w.filling | filling | sättigend | wordfile | Food | — | — | filling |
| g4u05.w.revolting | revolting | ekelhaft ; widerlich | wordfile | Food | — | — | revolting |
| g4u05.w.harmful | harmful | schädlich | wordfile | Food | — | — | harmful |
| g4u05.w.healthy | healthy | gesund | wordfile | Food | — | — | healthy |
| g4u05.w.nutritious | nutritious | nahrhaft | wordfile | Food | — | — | nutritious |
| g4u05.w.fresh | fresh | frisch | wordfile | Food | — | — | fresh |
| g4u05.w.tasty | tasty | lecker ; schmackhaft | wordfile | Food | — | — | tasty |
| g4u05.w.vegetarian | vegetarian | Vegetarier/in | phrase | — | She doesn't eat meat. She's a vegetarian. | — | vegetarian |
| g4u05.w.afford | afford | sich leisten können | phrase | — | We can't afford to go abroad this summer. | — | afford |
| g4u05.w.feed | feed | ernähren | phrase | — | They have a large family to feed. | — | feed |
| g4u05.w.hunger | hunger | Hunger | phrase | — | Many people die of hunger every day. | — | hunger |
| g4u05.w.intake | intake | Aufnahme | phrase | — | People in America have a higher intake of calories than people in Africa. | — | intake |
| g4u05.w.waste | waste | verschwenden | phrase | — | We need to stop wasting food and help the hungry. | — | waste |
| g4u05.w.contain | contain | enthalten | phrase | — | What's in that box? What does it contain? | — | contain |
| g4u05.w.cookery | cookery | Koch ; Kochkunst | phrase | — | Learn to cook by watching a cookery programme on TV. | — | cookery |
| g4u05.w.diet | diet | Ernährung | phrase | — | To stay fit you need a healthy diet. | — | diet |
| g4u05.w.even-though | even though | obwohl | phrase | — | I had to eat the spinach even though I didn't like it. | — | even though |
| g4u05.w.health | health | Gesundheit | phrase | — | Good health is the most important thing in anyone's life. | — | health |
| g4u05.w.nutrition | nutrition | Ernährung | phrase | — | Good nutrition means eating good food regularly. | — | nutrition |
| g4u05.w.overweight | overweight | übergewichtig | phrase | — | If you eat too much too often, you will soon be overweight. | — | overweight |
| g4u05.w.regularly | regularly | regelmäßig | phrase | — | He plays football regularly every week. | — | regularly |
| g4u05.w.dislike | dislike | nicht mögen | phrase | — | I like tomatoes, but I dislike spinach. | — | dislike |
| g4u05.w.habits | habits | Gewohnheiten | phrase | — | "Old habits die hard" means it's often difficult to change the way you do things. | — | habits |
| g4u05.w.accept | accept | hinnehmen ; akzeptieren | phrase | — | I didn't get the job, so I'll just have to accept their decision. | — | accept |
| g4u05.w.afterwards | afterwards | nachher | phrase | — | Let's watch TV. Afterwards we can have a pizza. | — | afterwards |
| g4u05.w.eating-disorder | eating disorder | Essstörung | phrase | — | Some people might have an eating disorder because they imagine they are too fat. | — | eating disorder |
| g4u05.w.gain | gain | zunehmen | phrase | — | He started to eat more and gained 10 kilos in a month. | — | gain |
| g4u05.w.gym | gym | Turnhalle | phrase | — | PE usually takes place in the school gym. | — | gym |
| g4u05.w.thin | thin | dünn | phrase | — | You look very thin. You need to eat more. | — | thin |
| g4u05.w.throw-up | throw up | erbrechen | phrase | — | She suddenly felt very sick and had to throw up. | — | throw up |
| g4u05.w.ashamed | (be) ashamed | sich schämen | phrase | — | You don't have to be ashamed if you get too fat. | — | ashamed ; ashamed be |
| g4u05.w.trust | trust | vertrauen | phrase | — | Trust me. I know what I'm talking about. | — | trust |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leeds, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g4u05.w.artificial` ← v1 `artificial`: d="Made by people rather than occurring naturally" · s="This cake contains no _____ colours or flavours — everything is natural." · a=[] · mc=["organic","synthetic","natural"]
- `g4u05.w.fattening` ← v1 `fattening`: d="Likely to make you gain weight because it contains a lot of fat or sugar" · s="Chocolate cake is delicious but very _____ if you eat too much of it." · a=[] · mc=["nutritious","filling","unhealthy"]
- `g4u05.w.filling` ← v1 `filling`: d="Making your stomach feel full after eating" · s="I'm not hungry yet because lunch was very _____ — I had a huge plate of pasta." · a=[] · mc=["fattening","satisfying","heavy"]
- `g4u05.w.revolting` ← v1 `revolting`: d="Extremely unpleasant; disgusting" · s="The smell from the rubbish bin was absolutely _____ — I almost felt sick." · a=[] · mc=["disgusting","unpleasant","bitter"]
- `g4u05.w.harmful` ← v1 `harmful`: d="Causing or likely to cause damage or injury" · s="Smoking is extremely _____ to your lungs and overall health." · a=[] · mc=["dangerous","poisonous","unhealthy"]
- `g4u05.w.healthy` ← v1 `healthy`: d="Good for your body and helping you to stay well" · s="If you want to stay _____, you should exercise regularly and get enough sleep." · a=[] · mc=["fit","nutritious","organic"]
- `g4u05.w.nutritious` ← v1 `nutritious`: d="Containing many of the substances needed for life and growth" · s="The school is trying to offer more _____ meals with extra vitamins and protein for the students." · a=[] · mc=["delicious","healthy","organic"]
- `g4u05.w.fresh` ← v1 `fresh`: d="Recently made, picked, or prepared; not frozen or preserved" · s="The market sells _____ bread that is baked every morning." · a=[] · mc=["frozen","raw","ripe"]
- `g4u05.w.tasty` ← v1 `tasty`: d="Having a pleasant and enjoyable flavour" · s="The soup was really _____ — I had two bowls and wanted more." · a=[] · mc=["delicious","spicy","flavoured"]
- `g4u05.w.vegetarian` ← v1 `vegetarian`: d="A person who does not eat meat or fish" · s="My cousin never eats meat or fish because she is a _____." · a=["vegetarians"] · mc=["vegan","pescatarian","flexitarian"]
- `g4u05.w.afford` ← v1 `afford`: d="To have enough money to pay for something" · s="I really want those trainers, but I can't _____ them right now." · a=[] · mc=["earn","save","spend"]
- `g4u05.w.feed` ← v1 `feed`: d="To give food to a person or an animal" · s="Don't forget to _____ the cat before you leave for school." · a=[] · mc=["provide","supply","serve"]
- `g4u05.w.hunger` ← v1 `hunger`: d="The feeling or state of needing food" · s="After the long hike, we were weak with _____." · a=[] · mc=["thirst","appetite","starvation"]
- `g4u05.w.intake` ← v1 `intake`: d="The amount of food, drink, or other substance that you take into your body" · s="The doctor told him to reduce his sugar _____ to stay healthy." · a=[] · mc=["portion","amount","consumption"]
- `g4u05.w.waste` ← v1 `waste`: d="To use more of something than is necessary or to throw it away carelessly" · s="Please don't _____ water — turn off the tap while brushing your teeth." · a=["wasting"] · mc=["recycle","consume","dispose"]
- `g4u05.w.contain` ← v1 `contain`: d="To have something inside or as a part of it" · s="These sweets _____ a lot of sugar, so don't eat too many." · a=[] · mc=["include","consist","involve"]
- `g4u05.w.cookery` ← v1 `cookery`: d="The art or activity of preparing and cooking food" · s="My sister bought a _____ book with over 200 Italian recipes." · a=[] · mc=["bakery","cuisine","catering"]
- `g4u05.w.diet` ← v1 `diet`: d="The food that a person or animal regularly eats" · s="A balanced _____ includes fruit, vegetables, protein, and grains." · a=["diets"] · mc=["nutrition","menu","appetite"]
- `g4u05.w.even-though` ← v1 `even though`: d="Used to introduce a fact that makes the main statement surprising" · s="She went to school _____ she had a terrible headache." · a=[] · mc=["as long as","in case","as if"]
- `g4u05.w.health` ← v1 `health`: d="The state of being free from illness or injury" · s="Too much screen time can be bad for your _____." · a=[] · mc=["fitness","wellness","strength"]
- `g4u05.w.nutrition` ← v1 `nutrition`: d="The process of eating the right kind of food for health and growth" · s="We learned about _____ in biology — how vitamins, proteins, and minerals keep our bodies healthy." · a=[] · mc=["digestion","diet","metabolism"]
- `g4u05.w.overweight` ← v1 `overweight`: d="Heavier than is considered healthy for your height" · s="The doctor said he was slightly _____ and should exercise more." · a=[] · mc=["obese","chubby","underweight"]
- `g4u05.w.regularly` ← v1 `regularly`: d="At the same time or in the same way, again and again" · s="She goes swimming _____, three times a week." · a=[] · mc=["frequently","constantly","occasionally"]
- `g4u05.w.dislike` ← v1 `dislike`: d="To not like someone or something" · s="I really _____ the taste of olives — they make me feel sick." · a=[] · mc=["hate","avoid","refuse"]
- `g4u05.w.habits` ← v1 `habits`: d="Things that you do often or regularly, sometimes without thinking" · s="Eating breakfast every day and going to bed on time are good _____." · a=["habit"] · mc=["routines","customs","manners"]
- `g4u05.w.accept` ← v1 `accept`: d="To agree to take or receive something, or to recognise something as true" · s="You have to _____ that you made a mistake and try again." · a=[] · mc=["admit","agree","approve"]
- `g4u05.w.afterwards` ← v1 `afterwards`: d="At a later time; after something else has happened" · s="First we had dinner at a restaurant, and _____ we went to the cinema." · a=[] · mc=["meanwhile","eventually","later"]
- `g4u05.w.eating-disorder` ← v1 `eating disorder`: d="A serious mental health condition involving unhealthy attitudes and habits around food" · s="An _____ is a serious illness that needs professional help." · a=["eating disorders"] · mc=["food allergy","food poisoning","eating habit"]
- `g4u05.w.gain` ← v1 `gain`: d="To increase in weight, amount, or value" · s="If you eat fast food every day, you will quickly _____ weight." · a=["gained"] · mc=["lose","increase","put on"]
- `g4u05.w.gym` ← v1 `gym`: d="A room or building with equipment for physical exercise" · s="We have basketball practice in the _____ every Tuesday after school." · a=["gyms"] · mc=["stadium","court","pitch"]
- `g4u05.w.thin` ← v1 `thin`: d="Having very little fat on the body; not thick" · s="She was so _____ that you could see her ribs through her T-shirt." · a=[] · mc=["slim","skinny","lean"]
- `g4u05.w.throw-up` ← v1 `throw up`: d="To bring food back up from the stomach through the mouth; to vomit" · s="He felt so sick after the roller coaster that he had to _____ into a bin." · a=[] · mc=["pass out","break down","give up"]
- `g4u05.w.ashamed` ← v1 `(be) ashamed`: d="To feel embarrassed or guilty about something" · s="He was _____ of his bad behaviour in front of the whole class." · a=["be ashamed","ashamed"] · mc=["(be) embarrassed","(be) guilty","(be) sorry"]
- `g4u05.w.trust` ← v1 `trust`: d="To believe that someone is honest and will not hurt you" · s="I _____ my best friend with all my secrets." · a=[] · mc=["rely on","believe","respect"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 4 SB Unit 5.txt -----
Unit 5 Hungry?
Page 42–43
You learn
about world hunger
about a campaign for healthy eating
about eating disorders
how to use past perfect with just and after
how to connect ideas
You can
talk about food and your eating habits
design a poster for a food event
write a letter to an editor
Vocabulary Food items (Revision)
1 Look at the food items here. For each one:
a Give it a number to show how much you like it.
 I don’t like it/them. 1 2 3 4 5 I like it/them very much.
b Give it a letter to show if you think it’s healthy.
 It’s/They’re very healthy. A B C D E It’s/They’re unhealthy.
Image layout (left to right, top to bottom):
spinach
eggs
milk
chips
chicken
fish
pork
carrots
rice
beef
orange juice
crisps
tomatoes
pizza
apples
bread
Each food item is labeled with a checkbox pair: [number] [letter]
Get talking Talking about food
2 Compare your ideas in class.
“I gave … to chips because I … them.”
 “What letter/number did you give to orange juice?”
 “I gave it … because I … it.”
3 Talk about food in your family. Work in pairs.
“My dad/mum/sister/brother likes … / We never have … because …”
 “Nobody in my family likes … / My … is a vegetarian. He/She never …”
Speech bubbles:
 “Oh, really?”
 “Well, in my family …”
Sounds right /æ/ (apple) /ʌ/ (hungry) /e/ (egg)
4 🎧 Listen and repeat the rhymes.
1
 Eggs are healthy,
 apples, too.
 If you’re hungry,
 eat a few.
2
 I love carrots.
 I eat a ton.
 I get angry
 when there’s none.
3
 I’ll eat anything,
 can’t get enough.
 Bread and butter?
 It’s great stuff!
5 Read the information about hunger in the world. Where do you think these numbers should go? Use a dictionary for words you don’t know.
WORLD HUNGER
 (SOME FACTS)
Main text below a photo of children holding out bowls for food:
 The population of the world is around 1. _______ billion people.
 One in nine people will go to bed hungry each night.
The world can produce enough food to feed 12 billion people so that’s enough food to feed everybody. Sadly, 2. _______ billion tons of the food we produce isn’t eaten. That is one third of the food we produce. Food wasted in Europe could feed 200 million people. However, the problem is not just in Africa and Asia.
In 2016, 3. _______ million people around the world went hungry because they couldn’t afford to eat.
Poverty is the main cause of hunger. However, climate change and war are also a cause of hunger. Every day, 4. _______ million people die of hunger.
Every 5. _______ seconds, somewhere in the world, a child dies because they are not eating the right kind of food. Children don’t get the vitamins they need to be healthy and they die from common illnesses such as measles.
Most people suffering from hunger live in countries affected by war and conflict. Just one example is South Sudan. In 2017, it was reported that more than 6. _______ million people (over 42 percent of the population) went hungry.
Drought is another cause of hunger. In Sub-Saharan Africa, 7. _______ million people face hunger in countries with dry climates like Ethiopia, Niger and Mali.
There are people around the world who get so little food that they suffer from what is called “extreme hunger”. What is extreme hunger? It’s when someone only gets about 8. _______ calories a day.
In the USA, adults have an average intake* of 9. _______ calories a day.
VOCABULARY: intake – Aufnahme
Number options provided at the top of the task:
 227, 21,000, 2,000–3,000, 10, 1.3, 300, 4.9, 815, 7.6
6 🎧 Listen and check.
Page 44–45
7 🔷 Look at the text for 10 seconds. How much can you find out about the man in the picture? Compare in class.
📖 Now read the text about Jamie Oliver.
Jamie Oliver – THE FOOD REVOLUTION
EVERY CHILD DESERVES GOOD FOOD.
Jamie Oliver is a world-famous English chef* who owns and runs his own restaurants and trains new chefs. He has also done cookery programmes on television. A few years ago, he did a TV programme called Jamie’s School Dinners.
Many schools in Britain give the kids a meal at lunchtime – the meals are called ‘school dinners’ (even though they’re lunches, not dinners!). There are people called ‘dinner ladies’ who make the meals for the kids. In his TV programme, Jamie Oliver found that a lot of school dinners are just ‘junk food’.
WHAT’S JUNK FOOD?
It’s food that is filling, but not very healthy because it has artificial things in it. It’s fattening and it’s harmful. But a school dinner should give young people 33% of the nutrition that they need every day. That’s why it should have fresh food and also all the proteins, minerals and vitamins that kids need to be healthy and grow.
Jamie is calling on us all to join the Food Revolution. The Food Revolution is a global campaign for better food and food education for all children. Around the world, 41 million children under the age of five are overweight or obese. For the first time ever, a lot of today’s children will live shorter lives than their parents, because of what they eat. That’s shocking! Jamie has a six-point plan of action to deal with childhood obesity.
HERE IS HIS 6-POINT PLAN
🍭 A SUGAR TAX* – Put a tax on sugary drinks*. They are fattening.
 🚫 NO JUNK FOOD ADS – Ban junk food adverts from TV before 9 p.m.
 📊 CLEAR LABELS – Put labels on drink cans and food packets and make the quantity of sugar in them clear.
 ❌ LESS SUGAR – Reduce the huge amount of sugar in food and drinks.
 🏫 AT SCHOOL – Give all children access to nutritious school breakfasts and lunches.
 🏠 AT HOME – Parents should regularly check the weight and height of children under 11. Health starts at home.
Sugary drinks are the biggest contributor of sugar in the diets of children and teenagers. Jamie Oliver campaigned for a drinks tax in the UK. He asked for a 20p tax on each can of drink. The government has agreed to a tax of 18p a litre for drinks with 5g of sugar per 100ml and 24p a litre for those with more than 8g per 100ml. Some well-known fizzy drinks contain 35g of sugar. Some countries have already introduced a tax, including Mexico and France.
VOCABULARY
 *chef – Koch/Köchin
 sugar tax – Steuer auf Zucker
 sugary drinks – zuckerhaltige Getränke
Poster at bottom:
 FOOD REVOLUTION
 BE A REVOLUTIONARY
8 🔷 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Circle the correct word to complete the sentences.
Jamie Oliver is a famous English teacher / TV chef.
His TV programme was called Jamie’s School Dinners / Lunches.
Junk food is tasty and nutritious / filling but unhealthy.
Answer the questions.
 4. What food should kids get in schools?
 …………………………………………………………………………………
 5. What do kids need to grow?
 …………………………………………………………………………………
 6. Where is the Food Revolution taking place?
 …………………………………………………………………………………
Complete the sentences with 4–6 words.
 7. Many children won’t live as long as their parents because of ………………………………………
 8. Jamie believes that the main cause of obesity is the ………………………………………
 9. Jamie has successfully campaigned for the government in the UK to ………………………………………
Image description:
 Top right corner: Jamie Oliver is standing outdoors holding two apples in the air. A group of smiling school children in yellow t-shirts are standing in front of him.
Vocabulary Food quality
9 Work in pairs. Match each word about food with a definition.
1 ⬜ artificial
 2 ⬜ harmful
 3 ⬜ healthy
 4 ⬜ nutritious
 5 ⬜ fresh
 6 ⬜ tasty
 7 ⬜ revolting
 8 ⬜ filling
 9 ⬜ fattening
Definitions:
 ☐ has good effects on your body
 ☐ makes you become heavier
 ☐ full of the natural things your body needs
 ☐ not natural; man-made
 ☐ tastes very good
 ☐ makes you feel full, that you have eaten a lot of food
 ☐ new; not frozen; or in a tin
 ☐ has bad effects; doesn’t do you any good
 ☐ tastes very bad
Free flow
10 🔷 Talk for 3–4 minutes about your eating habits. Talk about:
what you eat for breakfast/lunch/dinner
what your favourites are and how often you have them
what you totally dislike
what your intake of healthy/unhealthy food is
how many sugary drinks you have a day / a week
how much fresh food / freshly prepared food you eat
if eating together with your family plays an important part
the food ads you know from TV and why you (don’t) like them
Page 46–47
11 🔷 Look at the text for 30 seconds to find the answers to these questions. Then read the text carefully and check.
What problem does Shannon talk about?
Does Shannon still have this problem?
Shannon
I was never really fat and I was never really thin. I was somewhere in the middle. That’s what I thought. Maybe I was a little overweight.
One day, when I was fourteen, I was invited to Rebecca’s birthday party. When Rebecca ate the third piece of cake, I heard her sister say, “If you go on eating like that, you’ll get as fat as Shannon!” That hurt. Most of my friends at school were thinner than me and being thin like a model was a topic all the girls talked about all the time.
Not long after the party, I started to throw up after eating. At first, I threw up only once or twice a week. But soon I felt that this wasn’t enough. Whenever I ate something, I had the feeling it was too much. Whenever I had the chance, I looked in the mirror. I didn’t like what I saw. “Fat, fat, fat,” I thought.
And there were times when I opened the fridge as soon as I got home from school. I stuffed myself with food and afterwards I felt so bad about it that I ran into the bathroom.
It was a terrible time because I often had stomach ache. I often felt very weak and I often felt sick. So I didn’t enjoy eating any more. It didn’t matter what I ate. My friends knew that something was going on, but I never talked to them about my problem.
When we were on holiday in Italy, I tried to stop throwing up after eating. But I couldn’t. When I looked in the mirror, I was sure I had gained 20 kilos, but of course I hadn’t.
Then one day I collapsed in the gym at school. After the lesson my P.E. teacher told me to come to her room. She offered me a cup of tea and she talked to me. I couldn’t tell her about my problem, but I promised I would talk to my mum.
So I wrote a letter to my mum and left it on the kitchen table one day before I left the house.
I was scared when I came home, but my mother hugged me and said, “We’ll solve this problem together.”
Now, every week I go to a meeting of a group of girls who have eating disorders. We talk about our problems and I feel much better. I eat regularly and don’t throw up any more. And I don’t look in the mirror all the time. I’m a little overweight again, but I have learned to accept it.
At Rebecca’s party for her fifteenth birthday, I had a really good time. When I went home, I knew I had finally beaten my problem.
Image description:
 A smiling girl with curly hair stands next to her name written in blue “Shannon”. She is wearing a yellow striped t-shirt and jeans, hands folded.
12 🔷 What does the text do?
☐ It tells you how a girl learnt to solve her eating problems.
 ☐ It tells mothers how they can help their children with problems.
 ☐ It tries to tell young people how they can lose weight.
 ☐ It tells you how to keep fit and eat well.
13 Circle T (True) or F (False).
Her eating problem started when she was fourteen.  T / F
Right from the beginning she threw up after every meal.  T / F
She tried to stop throwing up when on holiday.  T / F
Her friends never knew what was going on.  T / F
She told her P.E. teacher about her problem.  T / F
She is happy that she can talk about her problem to others.  T / F
Get talking
14 🔷 What are your answers to the questions?
 Work in groups of three.
Why did Shannon want to be “as thin as a model”?
What things did she do that were not “normal” and showed that she had a real problem?
What do you think of her mother’s reaction to her letter?
Why is it important for her to meet with the group of girls?
Shannon couldn’t talk about her problem to her friends, her mother and her teacher. Why?
Speech bubbles:
 “She was ashamed.”
 “She was depressed.”
 “She was very unhappy.”
 “She didn’t trust …”
 “She didn’t think they could …”
 “I see.”
 “Maybe she thought …”
15 CHOICES
 Writing for your Portfolio
A For your class you’re organising an event with the following motto:
 Good Food = Cool School!
 Design and write a poster for that event. Say:
that everybody has to bring some healthy food/drinks
that a committee will judge the ten best items
where and when the event will take place
B You have just read Paul’s text in a youth magazine. Write a letter to the editor of the magazine (120–180 words). Check on p. 34 in your Workbook on how to write a formal letter. Do not forget to use paragraphs!
Say: why you are writing
 Describe: what your diet is like
 Write about: your ideal meal
 Say: what you think of Paul’s diet
 Say: what is different from / similar to his diet
 Write about: healthy things you would like to eat more often
Paul’s text:
 I often miss breakfast – I get up too late and I’m not very hungry in the morning. If I eat anything, it’s just a bowl of cereal and milk and maybe some orange juice. At school I eat some crisps and have a cola during the morning, in the break. I have lunch at school – it’s usually something with chips, a hamburger perhaps or some chicken nuggets. When I get home in the afternoon my mum makes me something like a ham and cheese sandwich, with some cola. In the evening we usually all have dinner at different times – I have something like sausages and chips, normally. Weekends are a bit different. Sometimes I meet friends and we go for a pizza or something. I guess my diet isn’t very healthy, but I enjoy what I eat and I don’t think I eat too much, so I’m not really worried.
 Paul, 13
Page 48–49
GRAMMAR
Past perfect (Revision)
1 Circle the correct option. Then complete the rule.
Du verwendest das Past perfect, wenn du unterstreichen möchtest, dass eine Handlung
 vor / nach einem bestimmten Zeitpunkt in der Vergangenheit geschehen war.
 Du bildest das Past perfect mit
 had + 3rd form / past form
 des Hauptverbs.
When I went home, I knew I had finally beaten my problem.
Wenn du before oder after im (Glied-)Satz verwendest, brauchst du meist das Past perfect nicht zu verwenden.
 My friends had left before I got there.
Past perfect with just / after
Mit just und after und dem Past perfect kannst du Ereignisse in die richtige Reihenfolge bringen.
 Für das erste Ereignis verwendest du past perfect tense. Für das zweite Ereignis verwendest du past.
For example:
 After James had eaten the two pizzas, the burger and chips, he felt very ill.
 First, James ate the two pizzas and the burger and chips.
 Then, he felt very ill.
Sally had just finished her meal when Tom came home.
 First, Sally finished her meal.
 Then, Tom came home.
Connecting ideas
So kannst du Sätze miteinander verknüpfen. Beispiele:
Cause/Result (Ursache/Ergebnis)
 Children will live shorter lives than their parents, because of the food they eat.
Contrast (Gegensatz)
 In the USA the average intake for adults is between 2,000 and 3,000 calories a day, although sometimes it’s much more.
 However, the problem is not just in Africa and Asia.
Purpose (Absicht)
 He did a TV programme called Jamie’s School Dinners in order to educate people about food.
 After the lesson my P.E. teacher told me to come to her room so that she could talk to me.
The Mag 3
 The meat debate
1 🎧 Watch the story. Complete the sentences with the words in the box. There are four you won’t use.
Word box:
 animal headmaster Maths teacher loves handbag sandwiches pizza pocket police hates
The school offers veggie burgers and veggie _________________.
Stern ________________ meat.
Vegans don’t eat any ________________ products at all.
Mr Davis nearly got into trouble with the _________________.
Mr Johnson is the _________________.
Miss Chappell put the steak in her ________________.
2 Match the people with what they think.
1 ⬜ Miss Chappell
 2 ⬜ Mr Davis
 3 ⬜ Nick
 4 ⬜ Jessica
a. ⬜ understands why the demonstrators are unhappy.
 b. ⬜ used to demonstrate for animal rights.
 c. ⬜ found it difficult to get good vegetarian food.
 d. ⬜ enjoys cooking vegetarian food.
 e. ⬜ thinks there’s enough vegetarian food on the menu.
 f. ⬜ feels healthier not eating meat.
Everyday English
3 Complete with the phrases in the box. Then practise the dialogues.
Phrase box:
 Beats me  Go right ahead  Between me and you  Not as far as I know
Image descriptions and captions:
Image 1
 Mr Davis, I’d like to talk to you a bit about being a vegetarian.
 “__________________________.”
Image 2
 “… and his wife had cooked us a big steak. ________, it was a bit of a shock when she put it in front of me.”
 “______________________.”
Image 3
 Does Mr Johnson know?
 “__________________________.”
Image 4
 “They’ve got veggie burgers and vegetarian pizzas. What more do they want?”
 “__________________________.”


----- WB: More 4 WB Unit 5.txt -----
UNIT 5 Hungry?
Page 37
Reading
1 Read the text. What do these numbers refer to?
1 266
 ………………………………………………………………………………………………………………
 2 1.6 kg
 ………………………………………………………………………………………………………………
 3 10%
 ………………………………………………………………………………………………………………
 4 73%
 ………………………………………………………………………………………………………………
Chocolate – A very British love affair
A new survey has found that British people are the chocolate eating champions of Europe.
 The figures show that between us we eat around 660 million kilograms of chocolate and chocolate-based foods every year. That’s 11.2 kg for every man, woman or child or, in other words, about 266 Mars bars each! The questionnaire also showed that 17% of us eat chocolate more than four times a week and 25% eat it daily. Only 5% of people asked said they don’t eat chocolate at all.
In fact, we eat so much more than the rest of Europe that the UK market makes up nearly thirty-three percent of all European sales. In second place are the Belgians who only manage 8.4 kg each per year and they live in the country that is famous for producing the best chocolate in the world! In third place come the French with 6.7 kg a year followed by the Germans who manage just 4.9 kg. That’s less than half of what the British eat!
The survey also shows that the hotter your country is, the less likely you are to eat chocolate. The Italians eat 1.7 kg on average and the Spanish only 1.6 kg. Maybe it’s because chocolate is more difficult to keep fresh in warmer climates, but I think it’s probably because chocolate helps cheer you up when you’re feeling cold.
But it’s not only chocolate that the British eat more of. We’re also champions of Europe when it comes to eating other sugary sweets. Fizzy drinks are also very popular and account two-thirds of the UK soft drinks market.
Of course, all of this means that we are also starting to see the negative side of our unhealthy diets. The number of people classified as obese has risen dramatically in recent years and around 10% of school children are worryingly overweight.
A leading doctor from the British Dietetic Association has warned against our obsession with all things sweet and called on the government to take action.
Dr Tony Harper says that children are getting twice the recommended daily calories from chocolate and sweets and that this is causing serious health problems for many young people. He also admits that there is room for chocolate in a healthy diet but that people need education about the dangers of eating too much.
However, Sally James from the Chocolate Society has better news for us. She says that the quality of chocolate in the UK is improving and that chocolate with a high cocoa content can actually be good for our health as it helps lower cholesterol. Unfortunately though the number of people who prefer chocolate with a higher cocoa content is much lower than those who go for the more sugary milk chocolate, which is preferred by 73% of the population.
Image description:
 The background of the page is styled like a chocolate wrapper with swirled blue and silver foil patterns. A rectangular banner at the top of the article says Chocolate – A very British love affair written in stylized silver letters on a dark chocolate bar with a smiley face in a circle.
 At the bottom right, there are two images of heart-shaped pieces of chocolate, one partly bitten.
Pages 38–39
2 How many of these tasks can you do? Check your answers with a partner.
 1 British people eat more chocolate than other Europeans. T / F
 2 A quarter of British people eat chocolate every day. T / F
 3 More than half the chocolate sold in Europe is bought by the British. T / F
 4 The best ………………………………………………………… comes from Belgium.
 5 The Italians and Spanish don’t eat …………………………………………. the French and the Germans.
 6 The British also eat ………………………………………………….. than other Europeans.
 7 Why is Dr Tony Harper worried? ..................................................................................
 8 What does he want the government to do? ................................................................
 9 Why is Sally James more optimistic? ...........................................................................
Listening
 🎧 3 Listen to the story and tick the best title for it.
 ☐ No more oranges
 ☐ A job lost
 ☐ Food for the family
(Image: A boy with a sad expression holding a basket full of oranges stands under an orange tree. Nearby are baskets of oranges and a man pointing in the direction of a cart.)
🎧 4 Listen again. Decide who might think these things. Write N (narrator*), B (boy), F (foreman*) or T (Mr Thomas).
 1 Why don’t I ever get to eat things like these oranges? ☐
 2 I’m really in trouble. ☐
 3 He’s got me. ☐
 4 The boss is going to be pleased with me. ☐
 5 What did he do with those oranges? ☐
 6 Why did I leave my house for this? ☐
 7 This man is a fool. ☐
 8 I feel sick. ☐
 9 What a clever boy. ☐
VOCABULARY: narrator – Erzähler/in, foreman – Vorarbeiter, Polier
Grammar Past perfect (Revision)
5 Complete the sentences with the past perfect form of the verbs in brackets.
 1 A “Why was the teacher angry with Ivan yesterday?”
   B “Because he ……………………………………… his homework.” (not do)
 2 I was just getting on the bus when I realised I ……………………………………… a ticket. (not buy)
 3 When I went to bed it was raining, but when I woke up it ……………………………………… . (stop)
 4 Suddenly I remembered where I ……………………………………… her before. (meet)
 5 I was disappointed when I heard that I ……………………………………… the test. (not pass)
 6 The river bed was completely dry. It ……………………………………… for months. (not rain)
 7 Mum was upset because no one ……………………………………… her birthday. (remember)
 8 Ben was annoyed because Liam ……………………………………… him to his party. (not invite)
6 Complete the sentences using the correct forms of the verbs in brackets. For each sentence use one example each of the past perfect and the past simple.
 1 When I ……………………………………… her face, I knew I ……………………………………… her before. (see/meet)
 2 She ……………………………………… the film three times already, but she still ……………………………………… to see it again. (see/want)
 3 He ……………………………………… two pizzas because he ……………………………………… all day. (order/not eat)
 4 I ……………………………………… , so I ……………………………………… the test really difficult. (not study/find)
 5 Anna ……………………………………… anything else because she ……………………………………… all her money. (not buy/spend)
 6 Dad was furious. I ……………………………………… home at two, although I ……………………………………… to be home at midnight. (get/promise)
7 Complete the story with the words in the box.
had eaten had never been came had been had gone out had just arrived
 had just sat down had just opened looked decided had taken off
1 ……………………………………… home and I was really hungry. After I
 2 ……………………………………… my coat and my shoes I went into the kitchen. Mum was not there. She
 3 ……………………………………… somewhere. I opened the fridge to see what there was to eat. There wasn’t anything. So I
 4 ……………………………………… in the cupboard for a biscuit, but my brother
 5 ……………………………………… there before me. There were no biscuits left, only some dried pasta and a tin of dog food. “Dog food,” I thought. “How bad can it be?” I
 6 ……………………………………… it in a bowl and
 7 ……………………………………… it. It was brown, and it made a funny noise. He was clearly hungry too. I couldn’t eat his food, so I gave it to him. After he
 8 ……………………………………… everything he went to his basket and fell asleep. “At least he’s happy,” I thought. But I was still hungry. I was really hungry, so I
 9 ……………………………………… to do my homework to take my mind off food. It was home economics* homework. I
 10 ……………………………………… to start when the door opened. It was Mum carrying lots of bags of supermarket shopping. I
 11 ……………………………………… so happy to see her!
VOCABULARY: home economics – Hauswirtschaftslehre
Pages 40–41
8 Complete the sentences with your own ideas.
 1 I had just gone to bed, when suddenly ............................................................................................ .
 2 After they had eaten the pizza .......................................................................................................... .
 3 ...................................................................................................................... when there was a loud noise in the kitchen.
 4 After ...................................................................................................................... , we decided to get a taxi home.
 5 Dad had just washed the car, when suddenly .................................................................................. .
 6 After ...................................................................................................................... I decided never to speak to him again.
Grammar Connecting ideas
9 Use the connecting words in the box to complete the sentences.
so that   however   because of   in order to   although
1 We left home early .......................................................... the traffic.
 2 We left home early .......................................................... we had plenty of time to get to the station.
 3 We left home early .......................................................... we wouldn’t miss the train.
 4 We left home early .......................................................... , we still missed the train.
 5 We left home early .......................................................... arrive on time.
10 Rewrite the sentences using the word(s) in brackets.
1 School dinners were so bad that Jamie Oliver came up with an idea. (because of)
   Because of bad school dinners Jamie Oliver came up with an idea.
2 The world can produce enough food. Millions of people die of hunger. (although)
   ..................................................................................................................................................
3 Children need to get lots of vitamins. They should eat as much fresh food as possible. (in order to)
   ..................................................................................................................................................
4 I talked a lot at dinner because then nobody would notice I wasn’t eating. (so that)
   ..................................................................................................................................................
5 An adult from the US has a calorie intake of 2,500–3,000 a day. In Africa there are people who only get 300 a day. (however)
   ..................................................................................................................................................
6 I weighed only 45 kilos. I called myself fat. (although)
   ..................................................................................................................................................
7 He didn’t eat anything for three days. He wanted to fit into his jeans. (in order to)
   ..................................................................................................................................................
8 There were too many people in the queue so I didn’t have lunch at school today. (because of)
   ..................................................................................................................................................
11 Now use your own ideas to complete each of the sentences.
 1 I invited Dana to my party so that ...................................................................................................... .
 2 I invited Dana to my party. However, ................................................................................................. .
 3 I invited Dana to my party because of ................................................................................................. .
 4 I invited Dana to my party in order to ................................................................................................... .
 5 I invited Dana to my party, although ..................................................................................................... .
Vocabulary
12 Write down as many words as you can think of for each category. Spend thirty seconds on each one.
Meat
 [empty box]
Fruit and vegetables
 [empty box]
Dairy products*
 [empty box]
Carbohydrates*
 [empty box]
VOCABULARY: dairy products – Milchprodukte; carbohydrates – Kohlenhydrate
13 Complete the crossword puzzle with vocabulary from p. 45 in your Student’s Book.
Across
 3 Food that is not good for your body or health is …
 4 Food that is … has a lot of healthy things in it.
 5 Food that makes you feel full is …
 6 Food that makes you put on weight is …
 8 Food that is very good for your body is …
Down
 1 Food that is not natural is …
 2 Food that tastes awful is …
 5 Food that doesn’t come from a packet or tin is …
 7 Food that you enjoy eating because it is very good is …
Pages 42–43
14 Fill in the missing words. Use the words from the crossword in 13.
 1 A There aren’t any real strawberries in this “strawberry ice cream”!
   B You’re right. It tastes ............................................................ .
 2 A You shouldn’t eat so much ............................................................ food.
 3 B Well, I do a lot of sports. So I’m not really worried.
 4 Eating too much red meat can be very ............................................................ for your heart.
 5 In most restaurants in Austria, it is difficult to get ............................................................ fish.
   Most of the time it is frozen.
 6 This is the best cheese I’ve eaten for a long time. It’s really ............................................................ .
 7 Tomatoes are very ............................................................ , especially when they’re cooked.
 8 Thanks, I don’t want to eat more. The soup was really ............................................................ .
 9 The opposite of “unhealthy” is ............................................................ .
Everyday English The meat debate
 DVD Use the phrases to complete the dialogues.
Beats me  Go right ahead  Between me and you  Not as far as I know
1 A What city comes number ten in the list of unhealthy cities in the UK?
   B ............................................................................. ! I saw the list, but I can’t remember all the cities.
2 A Are tomatoes vegetables?
   B ............................................................................. I’m sure they are fruit.
3 A I’d like to ask you a few questions about the menu before we decide what we’re going to eat.
   B ............................................................................. What would you like to know?
4 A What does your mum think about you eating all this junk food?
   B ............................................................................. , she doesn’t know. So don’t say anything to her, OK?
Developing writing skills Instructions (recipe)
 15 Read the task and what a student wrote. What’s the difficult part of making an omelette?
Task
 Your friend asked you for your favourite recipe. Write it down for him/her (120–180 words).
 Include:
 • what it’s called
 • the ingredients you need
 • a step-by-step guide on how to make it
 • what he/she might find difficult
 • tips on how to serve the dish
 • why you like it
[Handwritten letter image transcription:]
 Hi Clemens,
 This is one of my favourite meals based on a Jamie Oliver recipe. It’s for a scrambled egg omelette. The ingredients you need are 350 g of ripe yellow and red tomatoes, some fresh basil, 1 red chili, 125 g of mozzarella and four large eggs.
 First, slice the tomatoes and put them on a plate. Then add olive oil, salt, vinegar and pepper. Pound the basil leaves in a little olive oil.
 Next, slice the chili and chop the mozzarella. Then heat some olive oil in a pan. Beat the eggs in a cup and pour them into the pan. Stir gently. When they are lightly scrambled, add the mozzarella and the basil oil.
 And now comes the tricky part. Pick up the pan and see if you can shake it so the omelette folds (if not, use a spatula*).
 Turn it upside down on the plate of tomatoes. Scatter over the chili (as much as you dare) and a few basil leaves. Then tuck in*.
 Try it – it’s not classic Jamie, but it’s awesome. I especially like the chili idea!
 Bye,
 Amy
VOCABULARY: spatula – Pfannenwender; tuck in – ugs. greifen zu
16 Read the recipe again and underline the verbs that instruct you how to do something.
 Guess from the context what they mean, then check in a dictionary.
Language tip:
 Writing a recipe needs special vocabulary. You need to know the food and cooking words. Use the internet to help you. Checking out recipes in English is also a big help in learning some of the vocabulary.
Writing tip:
 A recipe normally gives you a list of ingredients and then the instructions of what to do with them. When writing follow that procedure.
 Make sure you:
 • list all the ingredients
 • say exactly how much you need of each ingredient
 • think about the order of the list
 • keep your instructions clear and easy to follow
 • finish with serving instructions
17 Now write your own answer to the following task.
Task
 Write an email to a friend (120–180 words) in which you give him/her the recipe of one of your favourite simple dishes.
 Write about:
 • what it is called
 • why you like it
 • why it is simple to make
 • the list of ingredients
 • instructions on how to make the dish
 • how to serve the dish
Page 44
WORD FILE
 Food
[Image description: Illustration of a sandwich with ingredient layers. Adjectives describing food are placed around it in labeled boxes with arrows pointing to the sandwich. On the left: “artificial,” “fattening,” “filling,” “revolting.” On the right: “harmful,” “healthy,” “nutritious,” “fresh,” “tasty.”]
MORE Words and Phrases
	English word	Example sentence	German translation
3	vegetarian	She doesn’t eat meat. She’s a vegetarian.	Vegetarier/in
5	afford	We can’t afford to go abroad this summer.	sich leisten können
	feed	They have a large family to feed.	ernähren
	hunger	Many people die of hunger every day.	Hunger
	intake	People in America have a higher intake of calories than people in Africa.	Aufnahme
	waste	We need to stop wasting food and help the hungry.	verschwenden
7	contain	What’s in that box? What does it contain?	enthalten
	cookery	Learn to cook by watching a cookery programme on TV.	Koch; Kochkunst
	diet	To stay fit you need a healthy diet.	Ernährung
	even though	I had to eat the spinach even though I didn’t like it.	obwohl
	health	Good health is the most important thing in anyone’s life.	Gesundheit
	nutrition	Good nutrition means eating good food regularly.	Ernährung
	overweight	If you eat too much too often, you will soon be overweight.	übergewichtig
	regularly	He plays football regularly every week.	regelmäßig
10	dislike	I like tomatoes, but I dislike spinach.	nicht mögen
	habits	“Old habits die hard” means it’s often difficult to change the way you do things.	Gewohnheiten
11	accept	I didn’t get the job, so I’ll just have to accept their decision.	hinnehmen; akzeptieren
	afterwards	Let’s watch TV. Afterwards we can have a pizza.	nachher
	eating disorder	Some people might have an eating disorder because they imagine they are too fat.	Essstörung
	gain	He started to eat more and gained 10 kilos in a month.	zunehmen
	gym	PE usually takes place in the school gym.	Turnhalle
	thin	You look very thin. You need to eat more.	dünn
	throw up	She suddenly felt very sick and had to throw up.	erbrechen
14	(be) ashamed	You don’t have to be ashamed if you get too fat.	sich schämen
	trust	Trust me. I know what I’m talking about.	vertrauen

```

## Output contract

Write `content/corpus/units/g4-u05/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g4-u05",
  "briefBank": "d475a7bb945f",
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
