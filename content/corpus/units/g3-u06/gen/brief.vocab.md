# Vocab generation brief — g3-u06 (MORE! 3, Unit 6)

<!-- domigo:gen vocab g3-u06 bank=9580793d8313 prompt=346902f9f0f1 -->

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
| g3u06.w.bridge | bridge | Brücke | wordfile | Places Around Town | — | — | bridge |
| g3u06.w.river | river | Fluss | wordfile | Places Around Town | — | — | river |
| g3u06.w.art-gallery | art gallery | Kunstgalerie | wordfile | Places Around Town | — | — | art gallery |
| g3u06.w.square | square | Platz | wordfile | Places Around Town | — | — | square |
| g3u06.w.park | park | Park | wordfile | Places Around Town | — | — | park |
| g3u06.w.tower | tower | Turm | wordfile | Places Around Town | — | — | tower |
| g3u06.w.district | district | Bezirk ; Viertel | wordfile | Places Around Town | — | — | district |
| g3u06.w.building | building | Gebäude | wordfile | Places Around Town | — | — | building |
| g3u06.w.street | street | Straße | wordfile | Places Around Town | — | — | street |
| g3u06.w.shop | shop | Geschäft | wordfile | Places Around Town | — | — | shop |
| g3u06.w.shopping-centre | shopping centre | Einkaufszentrum | wordfile | Places Around Town | — | — | shopping centre |
| g3u06.w.stadium | stadium | Stadion | phrase | — | This stadium is home to the England national football team. | — | stadium |
| g3u06.w.to-burn-down | to burn down | niederbrennen | phrase | — | The old Globe Theatre burnt down, but there's a new one. | burn down | to burn down ; burn down |
| g3u06.w.collection | collection | Sammlung | phrase | — | This is an art gallery whose collection of modern art is one of the best in the world. | — | collection |
| g3u06.w.government | government | Regierung | phrase | — | It is where the British government meets. | — | government |
| g3u06.w.the-houses-of-parliament | the Houses of Parliament | das Parlament (von Großbritannien) | phrase | — | The government meets at the Houses of Parliament. | — | the Houses of Parliament |
| g3u06.w.in-advance | in advance | im Voraus | phrase | — | If you want to avoid the long queues – book in advance. | — | in advance |
| g3u06.w.to-photograph | to photograph | fotografieren | phrase | — | A lot of people photograph these places. | photograph | to photograph ; photograph |
| g3u06.w.play | play | Theaterstück | phrase | — | You can watch a Shakespeare play at the Globe. | — | play |
| g3u06.w.prison | prison | Gefängnis | phrase | — | It was built in 1078 as a castle, later it was a prison. | — | prison |
| g3u06.w.to-raise | to raise | anheben ; erhöhen | phrase | — | They can raise the bridge for big ships. | raise | to raise ; raise |
| g3u06.w.raven | raven | Rabe | phrase | — | The ravens should never leave the Tower of London. | — | raven |
| g3u06.w.to-take-a-walk | to take a walk | einen Spaziergang machen | phrase | — | Take a walk along the banks of the river. | take a walk | to take a walk ; take a walk |
| g3u06.w.theatre | theatre | Theater | phrase | — | There was a round theatre here, where Shakespeare acted. | — | theatre |
| g3u06.w.view | view | Ausblick ; Aussicht | phrase | — | The 25-minute ride on the wheel gives you some of the best views of London. | — | view |
| g3u06.w.visitor | visitor | Besucher/Besucherin | phrase | — | More than 3.5 million visitors take a ride on the wheel each year. | — | visitor |
| g3u06.w.thrilling | thrilling | aufregend | phrase | — | Let's throw a thrilling party on Thursday. | — | thrilling |
| g3u06.w.approximately | approximately | ungefähr | phrase | — | The Great Plague killed approximately 100,000 people in London. | — | approximately |
| g3u06.w.to-cough | to cough (up) | (aus-)husten | phrase | — | Usual symptoms were fever and coughing up blood. | cough | to cough ; cough ; to cough up ; cough up |
| g3u06.w.cruel | cruel | grausam | phrase | — | The Great Plague was a cruel killer. | — | cruel |
| g3u06.w.empty | empty | leer | phrase | — | The streets were empty. There were no people. | — | empty |
| g3u06.w.fever | fever | Fieber | phrase | — | If you had the Plague, you also had fever. | — | fever |
| g3u06.w.to-report | to report | berichten ; melden | phrase | — | Many people didn't report their symptoms. | report | to report ; report |
| g3u06.w.path | path | Weg | phrase | — | There's a long path, a lake and lots of trees. | — | path |
| g3u06.w.spectacular | spectacular | spektakulär | phrase | — | What I loved most was the spectacular light show. | — | spectacular |
| g3u06.w.tourist-attraction | tourist attraction | Sehenswürdigkeit | phrase | — | Madame Tussauds has been a popular tourist attraction for many years. | — | tourist attraction |
| g3u06.w.to-experience | to experience | erleben ; erfahren | phrase | — | You can experience one of the many interactive attractions. | experience | to experience ; experience |
| g3u06.w.traffic | traffic | Verkehr | phrase | — | There's a lot of traffic on the street. It's very noisy. | — | traffic |
| g3u06.w.multicultural | multicultural | multikulturell | phrase | — | London is very multicultural. | — | multicultural |
| g3u06.w.contract | contract | Vertrag | phrase | — | We signed a contract. | — | contract |
| g3u06.w.to-lead | to lead | leiten | phrase | — | I should be helping Dad to lead a healthier lifestyle. | lead | to lead ; lead |
| g3u06.w.sugar | sugar | Zucker | phrase | — | I want to eat less sugar. | — | sugar |
| g3u06.w.to-earn | to earn (money) | (Geld) verdienen | phrase | — | My other job earns me £10 a week. | earn | to earn ; earn ; to earn money ; earn money |
| g3u06.w.to-save-up-for | to save up for | ansparen | phrase | — | I need to save up money for our new project. | save up for | to save up for ; save up for |
| g3u06.w.to-sign | to sign | unterschreiben | phrase | — | He agreed and signed the contract. | sign | to sign ; sign |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lane, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Russell, Ryan, Sacks, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Tag, Take, Tale, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Tell, Telling, Text, Thames, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Uros, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u06.w.bridge` ← v1 `bridge`: d="A structure built over a river, road, or railway so people can cross" · s="We walked across the old stone _____ over the river to get to the other side of the valley." · a=["bridges"] · mc=["tunnel","wall","gate"]
- `g3u06.w.river` ← v1 `river`: d="A large, long flow of water that goes to the sea" · s="The _____ was very wide and flowing fast, so we definitely needed a boat with an engine to cross it safely." · a=["rivers"] · mc=["puddle","bathtub","sink"]
- `g3u06.w.art-gallery` ← v1 `art gallery`: d="A place where you can look at paintings and sculptures" · s="We visited an _____ in the city centre and saw famous paintings by Monet and Picasso on the walls." · a=["art gallery","art galleries"] · mc=["library","swimming pool","shopping mall"]
- `g3u06.w.square` ← v1 `square`: d="An open area in a town, usually with buildings around it" · s="There is a big beautiful stone fountain in the middle of the old town _____ surrounded by cafés and historic buildings." · a=["squares"] · mc=["river","park","bridge"]
- `g3u06.w.park` ← v1 `park`: d="A large area with grass and trees where people can walk and play" · s="Let's meet at the _____ near the slides and the football pitch and play football together after school today." · a=["parks"] · mc=["hospital","supermarket","library"]
- `g3u06.w.tower` ← v1 `tower`: d="A tall, narrow building or part of a building" · s="The tall old church _____ with a bell at the top is the tallest building in our small town — you can see it from 10km away." · a=["towers"] · mc=["basement","roof","door"]
- `g3u06.w.district` ← v1 `district`: d="An area of a city or town" · s="The busy shopping _____ in the city centre has lots of nice cafés, boutique shops, and restaurants on every street." · a=["districts"] · mc=["swimming pool","forest","beach"]
- `g3u06.w.building` ← v1 `building`: d="A structure with walls and a roof, like a house or school" · s="The brand new school _____ has three floors, a big gym, and a modern library for all the students." · a=["buildings"] · mc=["bridge","road","tree"]
- `g3u06.w.street` ← v1 `street`: d="A road in a city or town with houses and shops" · s="Our quiet residential _____ is very peaceful because there are no shops and not much traffic or noise." · a=["streets"] · mc=["playground","kitchen","bedroom"]
- `g3u06.w.shop` ← v1 `shop`: d="A place where you buy things" · s="There's a cute little _____ near my house on the corner that sells colourful sweets, chocolate, and crisps to children." · a=["shops"] · mc=["forest","park","church"]
- `g3u06.w.shopping-centre` ← v1 `shopping centre`: d="A large building with many shops inside" · s="We went to the huge indoor _____ with 100 shops on three floors to buy new running shoes for school." · a=["shopping centre","shopping centres","shopping center"] · mc=["small kiosk","street market","pharmacy"]
- `g3u06.w.stadium` ← v1 `stadium`: d="A large building where people watch sports" · s="The giant football _____ was full of 50,000 excited fans cheering loudly for their favourite team." · a=["stadiums"] · mc=["classroom","living room","bedroom"]
- `g3u06.w.to-burn-down` ← v1 `to burn down`: d="To be destroyed by fire" · s="The old abandoned factory _____ completely to the ground last winter during a huge electrical fire." · a=["burn down","burnt down","burned down"] · mc=["to be built","to open","to expand"]
- `g3u06.w.collection` ← v1 `collection`: d="A group of things that have been gathered together" · s="My dad has a huge _____ of more than 500 old stamps from many different countries around the world, stored in albums." · a=["collections"] · mc=["single stamp","one album","empty box"]
- `g3u06.w.government` ← v1 `government`: d="The group of people who run a country" · s="The _____ of our country decided last week to build more free public schools in the remote countryside regions." · a=["governments"] · mc=["family","band","school class"]
- `g3u06.w.the-houses-of-parliament` ← v1 `the Houses of Parliament`: d="The building in London where British laws are made" · s="We took a photo in front of _____ with the famous Big Ben clock tower when we visited London last summer." · a=["the Houses of Parliament","Houses of Parliament"] · mc=["Disneyland","the Eiffel Tower","the Colosseum"]
- `g3u06.w.in-advance` ← v1 `in advance`: d="Before something happens, ahead of time" · s="You should definitely buy your concert tickets _____ — at least two weeks before — because they sell out very quickly." · a=["in advance"] · mc=["too late","after the event","during the concert"]
- `g3u06.w.to-photograph` ← v1 `to photograph`: d="To take a photo of someone or something" · s="My photographer sister loves to _____ wild birds and deer in the forest with her big professional camera with a zoom lens." · a=["photograph","photographed"] · mc=["to hunt","to scare","to feed"]
- `g3u06.w.play` ← v1 `play`: d="A story performed by actors on a stage" · s="Our drama class is going to perform a Shakespeare _____ on the school stage at the end of the school year in June." · a=["plays"] · mc=["football match","song","speech"]
- `g3u06.w.prison` ← v1 `prison`: d="A building where people are kept as punishment for a crime" · s="The convicted thief was sent to _____ for two years by the judge after stealing jewellery from the shop." · a=["prisons"] · mc=["school","hospital","hotel"]
- `g3u06.w.to-raise` ← v1 `to raise`: d="To move something up to a higher position" · s="Please _____ your hand high up in the air if you know the correct answer to the teacher's question." · a=["raise","raised"] · mc=["to lower","to hide","to drop"]
- `g3u06.w.raven` ← v1 `raven`: d="A large black bird" · s="A big black _____ was sitting on the wooden fence and cawing loudly at us as we walked past." · a=["ravens"] · mc=["butterfly","rabbit","fish"]
- `g3u06.w.to-take-a-walk` ← v1 `to take a walk`: d="To go on a stroll, usually for pleasure" · s="Let's _____ together in the big park — the warm sunny weather is absolutely lovely today." · a=["take a walk","took a walk"] · mc=["to run a marathon","to drive the car","to swim"]
- `g3u06.w.theatre` ← v1 `theatre`: d="A building where you go to watch plays and shows" · s="We're going to the _____ tonight in Vienna to see a famous musical with live singers and an orchestra playing." · a=["theatres","theater","theaters"] · mc=["cinema","concert hall","stadium"]
- `g3u06.w.view` ← v1 `view`: d="What you can see from a place" · s="The _____ from our tall hotel room on the 20th floor was truly amazing — we could see the whole blue sea and beach." · a=["views"] · mc=["menu","price","size"]
- `g3u06.w.visitor` ← v1 `visitor`: d="A person who goes to see a place or another person" · s="The popular history museum has thousands of _____ every single year from countries all over the world." · a=["visitor","visitors"] · mc=["staff member","owner","cleaner"]
- `g3u06.w.thrilling` ← v1 `thrilling`: d="Very exciting and a little bit scary" · s="The huge loop-the-loop roller coaster ride at the theme park was really _____ — my heart was beating super fast!" · a=[] · mc=["boring","slow","relaxing"]
- `g3u06.w.approximately` ← v1 `approximately`: d="Close to an exact number but not exact" · s="There are _____ 200 students at our school, give or take about 10 students either way — we don't count exactly." · a=[] · mc=["exactly","precisely","definitely"]
- `g3u06.w.to-cough` ← v1 `to cough (up)`: d="To push air out of your mouth and throat with a loud noise" · s="She has been _____ loudly all day since morning because she has a bad chest cold with lots of mucus." · a=["cough","coughed","coughing"] · mc=["to sing","to laugh","to smile"]
- `g3u06.w.cruel` ← v1 `cruel`: d="Making other people or animals suffer on purpose" · s="It is very _____ and wrong to keep wild animals like elephants or lions in small cramped cages at the circus." · a=[] · mc=["kind","gentle","loving"]
- `g3u06.w.empty` ← v1 `empty`: d="With nothing or no one inside" · s="The kitchen fridge is completely _____ inside — there's no food or drinks left at all. We need to go shopping right away." · a=[] · mc=["full","packed","overflowing"]
- `g3u06.w.fever` ← v1 `fever`: d="When your body temperature is higher than normal because you are ill" · s="She stayed in bed all day because she had a high _____ of 39 degrees Celsius — the thermometer was way above normal." · a=["fevers"] · mc=["cough","rash","bandage"]
- `g3u06.w.to-report` ← v1 `to report`: d="To tell someone about something that has happened" · s="If you see something strange or suspicious in the school building, please _____ it immediately to the nearest teacher." · a=["report","reported"] · mc=["to hide","to ignore","to forget about"]
- `g3u06.w.path` ← v1 `path`: d="A narrow way for walking" · s="Follow this narrow winding _____ carefully through the green forest and you'll arrive at the beautiful hidden lake." · a=["paths"] · mc=["swimming pool","river","street"]
- `g3u06.w.spectacular` ← v1 `spectacular`: d="Very impressive and beautiful to look at" · s="The huge colourful fireworks show on New Year's Eve over the river was absolutely _____ — I've never seen anything so impressive." · a=[] · mc=["dull","ordinary","boring"]
- `g3u06.w.tourist-attraction` ← v1 `tourist attraction`: d="A place that many tourists visit" · s="The big old medieval castle on the hill is the most popular _____ in our town — thousands of tourists visit each summer." · a=["tourist attraction","tourist attractions"] · mc=["secret hideout","private house","empty field"]
- `g3u06.w.to-experience` ← v1 `to experience`: d="To see, feel or do something, especially for the first time" · s="On this school trip to a farm, you will _____ real farm life for three days — feeding animals and milking cows." · a=["experience","experienced"] · mc=["to avoid","to ignore","to read about only"]
- `g3u06.w.traffic` ← v1 `traffic`: d="Cars, buses and other vehicles moving on a road" · s="There is always a lot of _____ with many cars, buses, and lorries in the city centre during rush hour at 8 am." · a=[] · mc=["silence","emptiness","peace"]
- `g3u06.w.multicultural` ← v1 `multicultural`: d="Having people from many different countries and cultures" · s="Vienna is a very _____ city with many people from all over the world living together — from Turkey, Japan, Nigeria, and more." · a=[] · mc=["single-culture","homogeneous","one-nation"]
- `g3u06.w.contract` ← v1 `contract`: d="A written agreement between two people or groups" · s="Before you start the new summer job at the café, you need to sign an official paper _____ with the company owner." · a=["contracts"] · mc=["a drawing","a photograph","a recipe"]
- `g3u06.w.to-lead` ← v1 `to lead`: d="To be in charge of or to guide" · s="The experienced tour guide will _____ us through the narrow streets of the old part of the historic city for two hours." · a=["lead","led"] · mc=["to follow behind","to stand still","to avoid"]
- `g3u06.w.sugar` ← v1 `sugar`: d="A sweet white or brown substance used in food and drinks" · s="Do you take _____ in your morning tea or do you prefer it without anything sweet, just plain?" · a=[] · mc=["salt","pepper","vinegar"]
- `g3u06.w.to-earn` ← v1 `to earn (money)`: d="To receive payment for work that you do" · s="She _____ some extra pocket money by walking her neighbour's big dog in the park every afternoon after school." · a=["earn","earned","earns"] · mc=["to lose money","to waste money","to steal money"]
- `g3u06.w.to-save-up-for` ← v1 `to save up for`: d="To keep money so you can buy something later" · s="I'm _____ up hard for a new pair of expensive trainers that cost €120 — I put aside €10 every week from my pocket money." · a=["save up for","saved up for","saving up for"] · mc=["to throw away money","to spend money on","to lose money for"]
- `g3u06.w.to-sign` ← v1 `to sign`: d="To write your name on a document" · s="Please _____ your full name at the bottom of the form with a black pen to confirm you agree with everything written." · a=["sign","signed"] · mc=["to draw","to tear","to fold"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 6.txt -----
Unit 6 We love London!
Pages 50–51
At the end of unit 6 ... you can
 🟡 know 12 words for buildings and places around town
 🟡 know how to use relative pronouns
 🟡 understand a documentary about London
 🟡 understand a tourist text about London
 🟡 talk about London and your town
 🟡 understand a historical text about the Plague
 🟡 give recommendations
 🟡 write an email about a trip to London
▶️ Teen Talk 3
 1 a Watch the video. Which of these are mentioned?
 ☐ football ☐ rugby ☐ tennis
 ☐ planes ☐ trains ☐ buses
b Watch again. What do these numbers refer to?
 54,000 90,000 (about) 9,000 22 (over) 4,000
2 Which of the things in the video would you most like to go to or see? Tell a partner.
📖 READING
 3 Read the text about London.
Walking through London
The Thames
 Length: 5 km
 Time needed: 6–7 hours
One of the best ways to see many of London’s most celebrated sights is to take a walk along the banks of its river – the Thames. But it’s not just about the famous buildings, a walk by the river brings you closer to the people who make London such a fascinating city.
Start your walk at the Houses of Parliament (nearest tube station: Westminster). This is one of the most photographed places in London. It is where the British government meets, but it’s also open to visitors. At the end of the Parliament buildings is the famous clock tower. It’s 98m tall. Many people think it’s called Big Ben, but they are wrong. Big Ben is actually the name of the clock’s great bell and not the tower.
🟨 Fascinating fact: The clock hands are 2.7 and 4.3 metres long!
Cross over the River Thames at Westminster Bridge. Don’t forget to look back for a great view of the Houses of Parliament and Big Ben!
On the other side of the river, walk down the steps and along to the London Aquarium. Here you can see sharks, fish and all kinds of other sea creatures.
Next door to the Aquarium is the London Dungeon. If you are feeling brave, then go inside and enjoy the history of horror in the city. There are 18 shows, 20 actors and three rides – all telling the dark side of London to life, including the Great Fire of London, the Plague and Jack the Ripper.
🟨 Fascinating fact: Jack the Ripper probably killed 18 people, but was never caught. Among the suspects were many people, including members of the Royal Family, a Lord, and Lewis Carroll (author of Alice in Wonderland).
The next building of interest is the Globe Theatre. Back in the early 1600s, there was a theatre here, where Shakespeare acted. The old theatre burnt down, but now there’s a new Globe Theatre which looks almost the same as the old one. Today you can watch Shakespeare’s plays at the Globe, but bring an umbrella – the Globe does not have a roof.
🟨 Fascinating fact: The original Globe Theatre had 3,000 seats, but people could also watch a play on the stage – near the floor! It cost only a penny!
Not far from the Dungeon is one of London’s more modern attractions, the London Eye. It opened on December 31st, 1999 and for this reason it is also called the Millennium Wheel. The 25-minute ride on the wheel gives you some of the best views of London you can get. If you want to avoid long queues – book in advance.
🟨 Fascinating fact: The London Eye has 32 capsules and can carry up to 800 people. More than 3.5 million visitors take a ride on the wheel each year!
From the London Eye walk on, past the street artists and galleries, past the National Theatre, until you get to Tate Modern. This was an old power station* and is now an art gallery whose collection of modern art is one of the best in the world. It was opened in 2001. Every year around five million people from all over the world go to the free exhibitions. The walk ends at the Millennium Bridge and St Paul’s Cathedral.
🟨 Fascinating fact: In 2016, the museum added a new futuristic building. More than 143,000 visitors came on the day it opened – a record number of visitors!
Continue your way towards Tower Bridge. On the left is a famous battleship, the HMS Belfast, which fought in the Second World War. Tower Bridge is one of the oldest bridges in London. It is a drawbridge, so when a big ship comes up the Thames, they raise the bridge so that the ship can go through.
🟨 Fascinating fact: In 1952, the bridge began to open while a bus was still on it. The driver went as fast as he could and jumped a small, five-foot gap. He got £10! for his bravery!
On the other side of the river is the Tower of London and this is where your walk ends. The Tower has an interesting and often dark history. It was a prison and a place of execution. Check out not just the Tower itself, but also the museum and the Jewel House. Don’t forget to look at the Beefeaters – they protect the King’s Crown Jewels. Look out for the black ravens too. Legend says that if they leave the Tower of London, the crown and England itself will fall!
🟨 Fascinating fact: There is a legend that when the ravens leave the Tower of London, the crown and the country will fall. That’s why even the Queen and the Royal Family and the British Isles ...
VOCABULARY: avoid = vermeiden; power station = Kraftwerk; bravery = Mut
Pages 52–53
4 How many of these tasks can you do?
 1 Tourists can’t go into the Houses of Parliament. T / F
 2 Some people find the London Dungeon scary. T / F
 3 You may have to wait for a long time to go on the London Eye. T / F
Complete the sentences with no more than 4 words.
 4 People can …………………………………………. at the new Globe Theatre.
 5 There aren’t many bridges in London that are as …………………………………………. Tower Bridge.
 6 The Tower of London was originally ………………………………………….
 7 Where do you think you would find this text? ......................................................
 8 Which of the attractions would you like to see most and why? ......................................................
 9 Which of the fascinating facts is most interesting? ......................................................
5 Check your answers with a partner. Then listen to the text.
🎤 SPEAKING
 6 You have one day in London. You can go to three places. Which ones do you want to see and why?
I'd like to see / go to ... because I'm interested in ...
 It would be great to see ... because ...
🧠 VOCABULARY
 7 Which three places in your town/area would you recommend for visitors? Why? Here are some places you could talk about.
a street  a building  a museum /
 a bridge  a river  an art gallery
 a square  a park  a shop /
 a tower  a district  shopping centre
Student speech bubble:
 I would recommend going to the park in our town. You can play football or volleyball, or have a picnic there. There’s also a pond with lots of ducks.
🎧 SOUNDS RIGHT /ð/ vs. /θ/
 8 Listen and tick.
	/ð/	/θ/
1 thing		✓
2 there	✓	
3 that	✓	
4 there	✓	
5 throw		✓
6 Thursday		✓

9 Listen and repeat.
 Let’s throw a thrilling party on Thursday the thirteenth!
📖 READING
 10 a Look at the text quickly. What were the worst things about the Plague for the people?
The Great Plague – the cruel killer
 In the 16th and 17th centuries, Britain suffered very badly because of the Plague. In 1563, the London Plague killed nearly 25% of the city’s population, and in the early years of the 17th century, the Plague returned to Britain many times. But it was in 1665 and 1666 that the Great Plague killed approximately 100,000 people in London. That was 20% of the total population.
If somebody caught the Plague and showed the usual symptoms like fever and coughing up blood, the house where they lived was closed for 40 days and the people couldn’t go out. But many people didn’t want to be locked in, and so they didn’t report their symptoms. Of course many people who were ill wanted to leave the city, but the poor had to stay – only people who were rich were able to escape. When they left, they often carried the disease to other parts of the country.
The worst point of the epidemic was the week of 19–26 September 1665, when 7,165 people died. In his diary, the writer Samuel Pepys (1633–1703) wrote: “But, Lord! How sad a sight it is to see the streets so empty.” Pepys said that out of every three shops, only one was still open.
Where did people think the Plague came from? Many believed it came from other countries. Even more thought that a comet which they saw in 1664 caused it. Scientists later said that bad smells caused the Plague, so they put herbs and flowers around their homes and burned them to help people.
They also thought that good smells could fight the Plague – but 300 years later, scientists found out that black rats and fleas carried the Plague.
Finally, in the summer of 1666, the Plague ended. In September of the same year, however, another tragedy happened: The Great Fire of London, which destroyed much of the city.
VOCABULARY: herbs = Kräuter
b Now read the text carefully. Then circle T (True) or F (False).
 1 The Plague hit Britain twice over a period of two hundred years. T / F
 2 The Great Plague of London killed millions of people. T / F
 3 People who caught the Plague had to stay in their house for more than a month. T / F
 4 Many people didn’t want to talk about their symptoms. T / F
 5 Poor people carried the Plague to areas outside of the city. T / F
 6 During the worst week, more than 8,000 people died. T / F
 7 Doctors thought that a comet caused the Plague. T / F
 8 When the Plague finished, people in London had many years of a happy life. T / F
Pages 54–55
11 Look at the photos first. Which of the places do you know? What do you know about them?
 Then read.
Your top 5 places in LONDON
1 Madame Tussauds
 Madame Tussauds has been a popular tourist attraction for many years and the queues outside it these days are as long as they have always been. People go there to see the waxworks of famous people: kings and queens alongside Taylor Swift and Cristiano Ronaldo. You can also take a selfie with your favourite character from the Star Wars universe or experience one of the many interactive attractions.
 “I loved it! There’s a fantastic Chamber of Horrors that is REALLY scary. But my favourite was the Marvel 4D Experience. The Marvel Super Heroes battle it out to save London!”
 —Alan, 14
2 Covent Garden
 Until the 1970s, Covent Garden was a flower market, but now it has cool shops, cafés, restaurants and street theatre. Theatres and museums are close, too.
 “I love going there in the summer. You can stand in the square and watch the street entertainment – it’s great!”
 —Aisha, 14
3 The BBC Earth Experience
 This is an amazing new London attraction for everyone who admires nature. It uses the latest audio-visual technology and takes you on a 360-degree journey to the most stunning places on each of the world’s seven continents.
 “I loved it all, but what I loved most was the spectacular light show created by fireflies in North America. What an experience!”
 —Barney, 14
4 The Science Museum
 In Kensington, there’s an area where three of London’s biggest museums can be found together: The Natural History Museum, The Victoria and Albert Museum, and The Science Museum. The last of these is the most popular with teenagers – and not only because it’s free!
 “I love it because there’s a lot of ‘hands-on’ things. You know, things to touch and pull and play with. Lots of fun!”
 —Andy, 13
5 Hyde Park
 One of several parks in central London, Hyde Park is great for people that like fresh air! With kilometres of paths, a lake and lots of trees, it’s a nice place to relax or take a bit of exercise. You can also see a memorial to Princess Diana.
 “Hyde Park is one of the reasons I like living in London. When I’m there, I’m a long way away from traffic and noise. Do you like nature? Go there!”
 —Joanna, 15
12 Here are five more comments about the places. Which place is each comment about? Write the numbers.
1 “Scared of spiders? You’ll see lots of creepy-crawlies – they are all on screen, but if you’re really scared of spiders, you might want to close your eyes!”
 —Laila, 15
2 “I love it – especially the singers like Lady Gaga. She’s my favourite.”
 —Jane, 13
3 “It’s cool. The old buildings are really nice and there are good shops.”
 —Enzo, 15
4 “I like running there at the weekend. When I get tired, I stop and feed the ducks. It’s one of my favourite places in the whole city.”
 —Marsha, 14
5 “It’s just got so many different things – old cars, machines, planes, and things like that. Great on a rainy Sunday!”
 —Mila, 14
13 a Listen to three teenagers. Who talks about these things?
 1 adventure .........................
 2 Hyde Park .........................
 3 clothes .........................
 4 traffic .........................
 5 new places .........................
 6 hair .........................
Julie – Cindy – Anthony
13 b Listen again and answer the questions.
 1 How long has Cindy lived in London?
 2 What does Cindy say about shops near her house?
 3 What does Anthony think are bad things about London?
 4 What sometimes happens in Hyde Park?
 5 What does Julie like doing on the underground train?
 6 What did Julie find last week?
Pages 56–57
14 CHOICES
A
 You are in London for the weekend. Write a short email (60–80 words) to your friend Millie in Scotland in which you:
 • say where you are
 • say what you did yesterday and how you liked it
 • say what other things you want to do during the rest of your stay
B
 You are in London with your family. You are writing an email (120–180 words) to a friend.
 Write about:
 • where you’re staying
 • some of the sights
 • the thing(s) you like best
 • what you’ve bought
 • the weather
 • your plans for tomorrow
GRAMMAR
 Relative pronouns
How to use them: You can use relative pronouns to add new information about a person or a thing.
The old theatre burnt down, but now there’s a new Globe Theatre which / that looks almost the same.
 A walk by the river brings you closer to the people who / that make London such a fascinating city.
Read the sentences above and complete the rule with who / which / that.
 We use 1 …………………………… or …………………………… for people.
 We use 2 …………………………… or …………………………… for things.
You use whose when you can use dessen or deren in German. Whose can refer to people, things or animals.
Check out the Beefeaters whose job is to protect the King’s Crown Jewels.
 Tate Modern is an art gallery whose collection of modern art is one of the best in the world.
(Caption under image of a cyclist riding through traffic in London)
 Cycling is great for people who like fresh air.
OUR YOUNG WORLD 3
 Ruby’s money-making ideas
1 Watch the video. How much money does Ruby earn each week?
 [Image of money with boxes to write the amount]
2 Watch again and answer the questions.
 1 Why does Ruby need money?
 2 What was Ruby’s first idea for getting some money?
 3 What does she do for her Uncle Martin?
 4 What is her other job?
 5 Why does her father often go to the petrol station?
 6 Why did she decide not to sell her father sweets?
3 FIND OUT: Money
 Match the phrases and the definitions.
 1 to sign a contract
 2 to save up for
 3 to make a profit
 4 to earn ethically
☐ a to get paid for doing something
 ☐ b to formally* agree to do something
 ☐ c to not spend money, so you can add to it until you have enough to buy a specific thing
 ☐ d to get money in a way that is good and does not harm* other people
VOCABULARY: formally – förmlich; harm – verletzen; schaden
Earning money
4 In pairs, decide if each of these ways of making money is ethical or not. Say why (not).
 1 Jamie does his friends’ homework for them. He charges* them £3.
 2 Henry helps his mother design the website for her business. She pays him £5 an hour.
 3 Lucy does the shopping for an elderly woman. She charges her £5 each time.
 4 Ian buys cans of sugary drinks and sells them to his friends at school for twice the price.
 5 Chris picks flowers from the local woods and sells them to his mother and her friends.
 6 Liane works in the local shop for four hours every Saturday morning.
VOCABULARY: charge – berechnen
5 CYBER PROJECT: Our money-making ideas
 In groups, think of a project which you need to save up money for.
 • Think of three ethical ways of making money for it.
 • Think of two unethical ways of making money for it.
 • Make a video of your ideas and present it to the class.
 • Can your classmates decide which methods are unethical?


----- WB: More 3 WB Unit 6.txt -----
UNIT 6 We love London!
Pages 46–47
UNDERSTANDING VOCABULARY Places around town
1 Unscramble the words to make places around town.
usaeqr ................................................
ponhpsig cnetre ................................................
bdgire ................................................
ctirtsid ................................................
eirvr ................................................
trewo ................................................
tar legyrla ................................................
mmseueu ................................................
rpka ................................................
treets ................................................
spho ................................................
bglduini ................................................
2 Write the words in 1 under the pictures.
Image descriptions (from left to right, top to bottom):
Image 1: Nelson’s Column in a square with people walking.
 Image 2: Colorful small shops and restaurants in a row on a shopping street.
 Image 3: River view with old town buildings and reflections.
 Image 4: Tower on a hill with clock.
 Image 5: Modern white building, likely a school or government building.
 Image 6: River bend with historic buildings and bridges.
 Image 7: Museum interior with people observing exhibits.
 Image 8: Art gallery with paintings.
 Image 9: Clothing shop with mannequins and people.
 Image 10: Shopping centre with escalators.
 Image 11: Park with fountain in the middle.
 Image 12: Map showing a black highlighted district.
................................................
................................................
................................................
................................................
................................................
................................................
................................................
................................................
................................................
................................................
................................................
................................................
USING VOCABULARY Places around town
3 Use the clues to complete the crossword and find the secret word.
 Clue: It’s the name of one of London’s railway stations.
Relax and watch the world go by in Hyde _ _ _ _.
Take a photo of Nelson and his lions in Trafalgar _ _ _ _ _ _.
Watch boats sail under Tower _ _ _ _ _ _.
Visit Soho, one of London’s most famous _ _ _ _ _ _ _.
Take a boat trip on the _ _ _ _ Thames.
Take a train ride from one of London’s many _ _ _ _ _ _ _ _.
Visit Tate Modern. One of the best _ _ _ _ _ _ _ in the world.
Walk down Oxford _ _ _ _ _ and look in the shops.
Covent Garden has cool _ _ _ _ _.
Go and look at some of London’s modern _ _ _ _ _ _ _ _ _ _ – like City Hall and The Shard.
4 Choose eight of the words from 1 and write a sentence about each place in your town.
Examples:
 There is a strange building in our town that looks like a UFO. I think it’s a government building.
 I like to hang out with my friends in the Northgate shopping centre.
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
..........................................................................................
Pages 48–49
5 Do the quiz.
HOW WELL DO YOU KNOW LONDON
1 What’s the name of the river which flows* through London?
 a) ☐ the Severn
 b) ☐ the Dee
 c) ☐ the Thames
2 Many tourists who go to London want to see Big Ben. But what is Big Ben?
 a) ☐ a clock
 b) ☐ a tower
 c) ☐ a bell
3 What is the name of the giant wheel which you can find on the south bank of the river?
 a) ☐ the London Eye
 b) ☐ the London Wheel
 c) ☐ the London Roundabout
4 What is the art gallery called that was once an old power station?
 a) ☐ the National Theatre
 b) ☐ Tate Modern
 c) ☐ the Globe
5 What do you call the guards who protect the Crown Jewels?
 a) ☐ Stakemen
 b) ☐ Porklovers
 c) ☐ Beefeaters
6 Who was the famous writer who kept a diary of London life in the 1600s?
 a) ☐ Samuel Pepys
 b) ☐ Christopher Wren
 c) ☐ William Shakespeare
7 What’s the name of the area of London which was a flower market until about 40 years ago?
 a) ☐ Covent Garden
 b) ☐ Waterloo
 c) ☐ Hyde Park
8 What is the name of the famous fictional detective whose address is 221B Baker Street?
 a) ☐ James Bond
 b) ☐ Sherlock Holmes
 c) ☐ Alex Rider
9 What is the name of the London football team whose stadium is called Stamford Bridge?
 a) ☐ Arsenal
 b) ☐ West Ham
 c) ☐ Chelsea
Vocabulary: flow = fließen
6 Look at the questions in 5 again. Circle the relative pronoun in each question.
7 Choose the correct word to complete the sentences.
La Trattoria is the restaurant who / whose / which makes the best pizza in town.
Jude Bellingham is the footballer who / whose / which Real Madrid paid a lot of money for.
Janet is the girl who / whose / which sits next to me in French.
He’s the man who / whose / which dog wakes me up every morning at 6 a.m.
Manchester is the city who / whose / which has the best football teams in the UK.
They’re the people who / whose / which daughter is an opera singer.
Miriam is the girl who / whose / which birthday is on the same day as yours.
Euston is the station who / whose / which is the busiest in London.
Mr Thomas is the teacher who / whose / which teaches us English.
8 In which of the sentences in 7 is that also possible. Tick the boxes.
☐ 1 ☐ 2 ☐ 3 ☐ 4 ☐ 5 ☐ 6 ☐ 7 ☐ 8 ☐ 9
9 Put the words in order to make sentences.
man / made the film / Jurassic Park. / the / who / is / Spielberg
  Spielberg is the man who made the film Jurassic Park.
the girl / know / lives upstairs? / Do / that / you
  ……………………………………………………………………
to / this / goes / which / Piccadilly Circus? / Is / the bus
  ……………………………………………………………………
I’ve got / London. / lives / who / a / in / friend
  ……………………………………………………………………
you / you / much? / liked / T-shirt / which / Did / the / so / buy
  ……………………………………………………………………
the / Where’s / this door? / who / key / the / has / to / woman
  ……………………………………………………………………
10 Complete the sentences with your own ideas. Write them in your exercise book.
Mum is the person in our house who …
My bedroom is the place that …
The headmaster is the person whose …
My best friend is the person who …
Reading is a hobby that …
Parents are the people whose …
11 Write sentences like in the example in your exercise book. Use your own ideas.
Example: William Shakespeare is the man who wrote Romeo and Juliet.
(Image descriptions from left to right:
 Portrait of William Shakespeare; Portrait of Christopher Columbus; Photo of Daniel Radcliffe; Photo of Taylor Swift; Photo of Erling Haaland; Photo of Princess Diana)
Name labels under images:
 William Shakespeare Christopher Columbus Daniel Radcliffe Taylor Swift Erling Haaland Princess Diana
Pages 50–51
12 Read the school trip report. Put the places in the order that Sam visited them.
 (Images labeled A, B, C, D showing various London landmarks)
Our school trip to London
Last week, Mr Mills and Miss Turnham took 15 students on a school trip to London for three days. We had a great time and as I happily agreed to do a trip report, here it is.
We got around London by tube and bus. Of course, we also did a lot of walking too, but that was OK and there were so many things to see. I think we managed to see most of the famous places, so I feel like I ‘know’ London a bit now. Of course, I know there’s plenty more to see. I think my favourite place was the London Eye. We went there on the first morning! It was a bright sunny day and we had fabulous views over the city. After that, we went to St Paul’s Cathedral. There are more than 500 steps to the top and I was exhausted when we finally got there. From the top we could see the theatre where we would go that evening! It was the London Eye, where we saw the evening of the first day, we went to a theatre to see a play. It was The Mousetrap, a thriller that’s been on stage in London since 1952 – it’s a world record for the longest running play. I enjoyed it even though I guessed who the murderer was early on! I won’t tell you just in case you want to see it one day. I liked the theatre too – it was very old but very elegant.
We spent the second day doing the classic sightseeing tour of London. We had a big red bus all to ourselves, with a tour guide who took us all along the city and showed us all the main attractions. I didn’t enjoy that as much as the theatre and museum, but I really enjoyed the bus tour. I also think history is my favourite subject.
In the afternoon, we went to Buckingham Palace to see the King – but he wasn’t in, so we had to have tea in a café instead. We also went to the Houses of Parliament where the government meets. We also saw 10 Downing Street, but the Prime Minister wasn’t in. He was probably having tea with the King somewhere. In the evening we just relaxed in the hotel, which was fine as I was tired.
On the final morning we went shopping (the teachers gave us three hours to do what we wanted), so we went to Covent Garden. I didn’t buy anything because everything was very expensive, but it was great to have a look around and watch the street artists. In the afternoon, we went to the Natural History Museum, but we didn’t see much apart from some dinosaur skeletons because we didn’t have time. Mr Mills said he and Miss Turnham could easily spend three days there. Then we went to the station to get the train back home. Our parents were all waiting for us at the station. I slept really well that night.
Big thank you to Mr Mills and Miss Turnham! We all had a brilliant time and I hope we weren’t too much trouble for you.
Sam, 8B
(Image descriptions:
Image A: Red building with flags (possibly a museum or theatre)
Image B: Front view of a government building with columns
Image C: Dome of St Paul’s Cathedral
Image D: Busy Covent Garden scene
Bottom corner: Red London tour bus in front of a historic building)
13 How many of these tasks can you do?
Sam didn’t really want to write the trip report. T / F
Sam feels he didn’t really see much of London. T / F
Sam had good views of London from two different places on the first day. T / F
The Mousetrap has a ............................................................... for how long it has been running.
On the second day, Sam saw London from ............................................................... .
Sam .................................................................................................................................................... hearing about the history of London.
What political institutions did Sam visit?
 .............................................................................................................................................
What did Sam do on the second evening?
 .............................................................................................................................................
Why wasn’t an afternoon enough for the Natural History Museum?
 .............................................................................................................................................
14 Listen and check your answers.
15 First, read about Dick Whittington. Then listen to the conversation about him. Are the sentences (1–8) fact or fiction? Circle the correct option.
(Image of Dick Whittington in period clothing with a feathered hat and a long coat, holding a staff)
Most of us have heard the story of Dick Whittington, the poor man who became extremely rich and then became the mayor of London. And most of us probably think the story is a legend – a bit like Robin Hood. But in fact, he was a real person. However, the story we heard when we were children is not completely true.
He came from a poor family. fact / fiction
He was mayor of London four times. fact / fiction
He had a cat. fact / fiction
He made a lot of money selling his cat. fact / fiction
After hearing some bells, he decided to return to London. fact / fiction
He made money from the Royal Family. fact / fiction
He knew kings. fact / fiction
He gave a lot of money to the poor. fact / fiction
Pages 52–53
16 CHOICES
A Put the dialogue in the correct order. Then listen and check.
 ⬜ Ian And what would you like to do in Paris?
 ⬜ Poppy Yes, I’d love to do that too. Imagine the view from the top.
 ⬜ Ian And what would be the last thing you’d do?
 ⬜ Ian If you could visit any city in the world, where would you go?
 ⬜ Ian The art gallery?
 ⬜ Poppy To end the day, I’d like to walk along the banks of the river Seine as it gets dark.
 ⬜ Poppy Paris – definitely.
 ⬜ Poppy Well, for a start, it would be great to go up the Eiffel Tower.
 ⬜ Poppy Yes, I’d love to see the Mona Lisa.
 ⬜ Poppy Yes. You can see all of Paris. After that, I’d like to go to the Louvre.
(Image: Eiffel Tower lit up at night)
B Complete the dialogue with the missing sentences. There are two extra sentences.
 Then listen and check.
Options:
 a And what would you do after Sugarloaf Mountain?
 b Really? When do we go?
 c I don’t really like travelling.
 d I’d recommend going to a restaurant.
 e Really? Walk up a mountain? That sounds like hard work.
 f Yes, I guess you have to see a football match if you go to Brazil.
 g Rio de Janeiro, where’s that?
 h That’s a great idea. I’d love to do that too.
 i And what would you do there?
Ben: I’d love to visit Rio de Janeiro one day.
 Martha: 1. .....................................................
 Ben: In Brazil. It’s one of the most beautiful cities in the world.
 Martha: 2. .....................................................
 Ben: Well, I’d love to go up Sugarloaf Mountain.
 Martha: 3. .....................................................
 Ben: No, there’s a cable car that takes you to the top.
 Martha: I’d go and see a football match in the Maracana Stadium.
 Ben: 4. .....................................................
 Martha: 5. .....................................................
 Ben: OK, you can come with me.
 Martha: 6. .....................................................
(Image: Cable car ascending Sugarloaf Mountain in Rio)
17 Read the task and what a student wrote. What is Hanna really interested in?
Task
 Imagine you are on a holiday in Oxford. Write an email or letter to your uncle (120–180 words).
 Write about:
 ✔ where you’re staying   ✔ what you’ve bought
 ✔ some of the sights    ✔ your plans for tomorrow
 ✔ the things you like best
(Student email below is handwritten in lined paper design)
Dear Uncle Lawrence,
 Finally! We’ve made it to Oxford for the weekend, and Mum and Dad are visiting old friends, so I’ve got some time for myself.
 We’re staying at a bed & breakfast in Abingdon Road.
 It’s only a 20-minute walk to the city centre, so that’s OK. This morning Mum and Dad dragged me to the Ashmolean Museum, but after that, I went to Christ Church College on my own to see the Harry Potter dining hall there. Awesome! I took some really great photo’s. There are some great places in Oxford, but Christ Church with its hall is the best.
I also went to that large bookshop you told me about. I didn’t buy a book, but they had a magic wand like Harry uses so I bought that. Thank you for the money you gave me, it was a big help.
Tomorrow it’s going to rain so I can’t go punting on the river. I hope the day won’t be boring.
 Maybe I’ll go to the cinema. There’s an afternoon show of Fantastic Beasts 2.
Best wishes,
 Hanna
(Image: Dining hall at Christ Church College)
 (Image: Small photo captioned "punting" showing people in a boat on a river)
Language tip: Apostrophes
 Apostrophes can be difficult to get right. Sometimes students add them when they are not needed (No Dog’s Allowed), other times they miss them out altogether (Carolines letter).
Pages 54–55
18 Look at the text in 17 again. Look at the highlighted words and correct the ones that are wrong.
Writing tip: Writing an email / a letter to a friend, a relative …*
 Consider the following for your writing:
 • Who are you writing to?
 • Are there any questions from their letter you have to answer?
 • Do you want to say thank you for anything?
 • Do you have questions yourself?
 • What do you want to tell them? What is your news?
 • Don’t forget to ask how the other person is.
 • End your letter with Best wishes, Love, Yours, etc.
VOCABULARY: relative – Verwandte/r
19 Now write your own answer to the following task.
Task
 Imagine you are on holiday somewhere in Austria. Write an email or letter to a relative (120–180 words).
 Write about:
 ✔ where you're staying
 ✔ what you're doing
 ✔ people you have met
 ✔ food and weather
 ✔ things you like best
 ✔ your plans for tomorrow
WORD FILE
 Places around town
 (Image: Illustrated town scene with labels on different buildings and locations)
 Labels visible on the image:
 • bridge
 • river
 • art gallery
 • square
 • park
 • tower
 • district
 • building
 • street
 • shop
 • shopping centre
MORE Words and Phrases
TT3
 stadium This stadium is home to the England national football team. Stadion
3
 to burn down The old Globe Theatre burnt down, but there’s a new one. niederbrennen
 collection This is an art gallery whose collection of modern art is one of the best in the world. Sammlung
 government It is where the British government meets. Regierung
 the Houses of Parliament The government meets at the Houses of Parliament. das Parlament (von Großbritannien)
 in advance If you want to avoid the long queues – book in advance. im Voraus
 to photograph A lot of people photograph these places. fotografieren
 play You can watch a Shakespeare play at the Globe. Theaterstück
 prison It was built in 1078 as a castle, later it was a prison. Gefängnis
 to raise They can raise the bridge for big ships. anheben, erhöhen
 raven The ravens should never leave the Tower of London. Rabe
 to take a walk Take a walk along the banks of the river. einen Spaziergang machen
 theatre There was a round theatre here, where Shakespeare acted. Theater
 view The 25-minute ride on the wheel gives you some of the best views of London. Ausblick, Aussicht
 visitor More than 3.5 million visitors take a ride on the wheel each year. Besucher/Besucherin
 thrilling Let’s throw a thrilling party on Thursday. aufregend
10
 approximately The Great Plague killed approximately 100,000 people in London. ungefähr
 to cough (up) Usual symptoms were fever and coughing up blood. (aus-)husten
 cruel The Great Plague was a cruel killer. grausam
 empty The streets were empty. There were no people. leer
 fever If you had the Plague, you also had fever. Fieber
 to report Many people didn’t report their symptoms. berichten, melden
11
 path There’s a long path, a lake and lots of trees. Weg
 spectacular What I loved most was the spectacular light show. spektakulär
 tourist attraction Madame Tussauds has been a popular tourist attraction for many years. Sehenswürdigkeit
 to experience You can experience one of the many interactive attractions. erleben, erfahren
 traffic There’s a lot of traffic on the street. It’s very noisy. Verkehr
 multicultural London is very multicultural. multikulturell
OWN
 contract We signed a contract. Vertrag
 to lead I should be helping Dad to lead a healthier lifestyle. leiten
 sugar I want to eat less sugar. Zucker
 to earn (money) My other job earns me £10 a week. (Geld) verdienen
 to save up for I need to save up money for our new project. ansparen
 to sign He agreed and signed the contract. unterschreiben

```

## Output contract

Write `content/corpus/units/g3-u06/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u06",
  "briefBank": "9580793d8313",
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
