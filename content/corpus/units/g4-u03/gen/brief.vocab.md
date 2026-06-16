# Vocab generation brief — g4-u03 (MORE! 4, Unit 3)

<!-- domigo:gen vocab g4-u03 bank=6d02af1cc935 prompt=346902f9f0f1 -->

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
| g4u03.w.busy | busy | belebt ; hektisch | phrase | — | New York is one of the busiest cities in the world. | — | busy |
| g4u03.w.cuisine | cuisine | Küche ; Kulinarik | phrase | — | This restaurant is famous for its spicy cuisine. | — | cuisine |
| g4u03.w.immigrant | immigrant | Einwanderer/Einwanderin | phrase | — | Millions of immigrants came to America in the 19th century. | — | immigrant |
| g4u03.w.native | native | einheimisch ; ursprünglich | phrase | — | Native Americans arrived in the US at least 15,000 years ago. | — | native |
| g4u03.w.nearby | nearby | in der Nähe | phrase | — | We were very hungry. Luckily we found a restaurant nearby. | — | nearby |
| g4u03.w.origin | origin | Herkunft ; Ursprung | phrase | — | She is of French origin. She was born in Paris. | — | origin |
| g4u03.w.politics | politics | Politik | phrase | — | Politics are the business of government. | — | politics |
| g4u03.w.announcement | announcement | Durchsage ; Ankündigung | phrase | — | I heard the announcement on the speakers saying that the store was closing soon. | — | announcement |
| g4u03.w.be-in-trouble | be in trouble | in Schwierigkeiten sein | phrase | — | James was in trouble with the police. | — | be in trouble |
| g4u03.w.blow-up | blow up | explodieren | phrase | — | The bomb blew up. | — | blow up |
| g4u03.w.emergency-landing | emergency landing | Notlandung | phrase | — | The pilot had to make an emergency landing. | — | emergency landing |
| g4u03.w.evacuate | evacuate | evakuieren | phrase | — | People who live along the coast were evacuated because of the hurricane. | — | evacuate |
| g4u03.w.flock-of-birds | flock of birds | Vogelschwarm | phrase | — | A flock of birds flew over our heads. | — | flock of birds |
| g4u03.w.glide-down | glide down | hinuntergleiten | phrase | — | We watched the skiers glide down the slope. | — | glide down |
| g4u03.w.miracle | miracle | Wunder | phrase | — | It would take a miracle for this team to win. | — | miracle |
| g4u03.w.on-duty | on duty | im Dienst | phrase | — | I'm not allowed to make private calls while I'm on duty. | — | on duty |
| g4u03.w.rescue-boat | rescue boat | Rettungsboot | phrase | — | There weren't enough rescue boats to save all the people on the ship. | — | rescue boat |
| g4u03.w.runway | runway | Landebahn | phrase | — | The airplane landed safely on the runway. | — | runway |
| g4u03.w.takeoff | takeoff | Abflug ; Start | phrase | — | Please remain seated during takeoff. | — | takeoff |
| g4u03.w.treatment | treatment | Behandlung | phrase | — | There are various treatments available at the hotel spa. | — | treatment |
| g4u03.w.wing | wing | Flügel | phrase | — | The bird spread its wings and flew away. | — | wing |
| g4u03.w.become-desperate | become desperate | verzweifelt ; verzweifeln ; in Schwierigkeiten geraten | phrase | — | As the supply of food ran out, people became desperate. | — | become desperate |
| g4u03.w.collide | collide | zusammenstoßen ; kollidieren | phrase | — | Two football players collided on the field. | — | collide |
| g4u03.w.explode | explode | explodieren | phrase | — | The firework exploded in his hand. | — | explode |
| g4u03.w.bravery | bravery | Mut ; Tapferkeit | phrase | — | She received an award for her bravery. | — | bravery |
| g4u03.w.reward-sb | reward sb | jemanden prämieren | phrase | — | The firefighters were rewarded for their brave actions. | — | reward sb |
| g4u03.w.critic | critic | Kritiker/in | phrase | — | The critics loved the movie. | — | critic |
| g4u03.w.elevator | elevator (AE) | Aufzug | phrase | — | The office is on the fifth floor, so we should take the elevator. | — | elevator ; AE |
| g4u03.w.campaign | campaign | Kampagne ; Aktion | phrase | — | The university is organising a campaign to attract more students. | — | campaign |
| g4u03.w.charge | charge | berechnen ; verlangen | phrase | — | The museum charges visitors $20. | — | charge |
| g4u03.w.crowd-funding | crowd-funding | Gruppenfinanzierung | phrase | — | They raised the money for the film through crowd-funding. | — | crowd-funding |
| g4u03.w.statement | statement | Aussage | phrase | — | He went to the police station to make a statement. | — | statement |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Dempsey, Denver, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunning, Dupin, During, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philadelphia, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebellion, Recherche, Red, Redwood, Reihenfolge, Renato, Republic, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g4u03.w.busy` ← v1 `busy`: d="Full of activity or people" · s="London is one of the _____ cities in Europe, with millions of tourists every year." · a=["busy","busiest"] · mc=["crowded","noisy","popular"]
- `g4u03.w.cuisine` ← v1 `cuisine`: d="A style of cooking, especially from a particular country or region" · s="I love Italian _____, especially pizza and pasta." · a=[] · mc=["recipe","menu","dish"]
- `g4u03.w.immigrant` ← v1 `immigrant`: d="A person who comes to live permanently in a different country" · s="Her grandparents were _____ who came to Austria from Turkey in the 1960s." · a=["immigrant","immigrants"] · mc=["emigrant","refugee","foreigner"]
- `g4u03.w.native` ← v1 `native`: d="Belonging to the place where you were born or grew up" · s="She is a _____ speaker of German because she grew up in Vienna." · a=[] · mc=["foreign","local","original"]
- `g4u03.w.nearby` ← v1 `nearby`: d="Not far away; close by" · s="Is there a pharmacy _____? I need to buy some medicine." · a=[] · mc=["close","surrounding","opposite"]
- `g4u03.w.origin` ← v1 `origin`: d="The place, situation, or type of family that someone comes from" · s="The word 'kindergarten' is of German _____." · a=["origins"] · mc=["nationality","background","tradition"]
- `g4u03.w.politics` ← v1 `politics`: d="Activities related to governing a country and making public decisions" · s="My uncle is very interested in _____ and always watches the news." · a=[] · mc=["economics","diplomacy","government"]
- `g4u03.w.announcement` ← v1 `announcement`: d="A public or official statement giving information about something" · s="The _____ at the train station said that our train would be twenty minutes late." · a=["announcements"] · mc=["advertisement","instruction","broadcast"]
- `g4u03.w.be-in-trouble` ← v1 `be in trouble`: d="To be in a difficult or dangerous situation" · s="If you don't finish your homework, you'll _____ with the teacher." · a=["be in trouble","in trouble"] · mc=["be in danger","be in charge","be in doubt"]
- `g4u03.w.blow-up` ← v1 `blow up`: d="To suddenly burst or explode with great force" · s="The old building _____ after a gas leak was discovered too late." · a=["blow up","blew up"] · mc=["break down","burn down","fall apart"]
- `g4u03.w.emergency-landing` ← v1 `emergency landing`: d="When a pilot has to bring the plane down quickly because of a serious problem" · s="The plane had engine problems and had to make an _____ in a field." · a=["emergency landings"] · mc=["crash landing","forced takeoff","rough touchdown"]
- `g4u03.w.evacuate` ← v1 `evacuate`: d="To move people away from a dangerous place to somewhere safe" · s="The school had to _____ all students when smoke was seen in the building." · a=["evacuate","evacuated"] · mc=["escape","abandon","relocate"]
- `g4u03.w.flock-of-birds` ← v1 `flock of birds`: d="A large group of feathered animals flying or resting together" · s="A huge _____ flew over our heads in a V-shape as we walked along the beach." · a=[] · mc=["herd of cattle","pack of wolves","swarm of bees"]
- `g4u03.w.glide-down` ← v1 `glide down`: d="To move smoothly and quietly downward through the air" · s="The eagle spread its wings and began to _____ towards the river." · a=[] · mc=["slide down","float down","dive down"]
- `g4u03.w.miracle` ← v1 `miracle`: d="An amazing event that cannot be explained and is believed to be caused by God or luck" · s="It was a _____ that nobody was hurt in the car crash." · a=["miracles"] · mc=["wonder","mystery","blessing"]
- `g4u03.w.on-duty` ← v1 `on duty`: d="Currently working or responsible, especially as part of one's job" · s="The nurse couldn't leave the hospital because she was _____ until six in the morning." · a=[] · mc=["on call","on guard","on leave"]
- `g4u03.w.rescue-boat` ← v1 `rescue boat`: d="A vessel used to save people from danger, especially at sea" · s="A _____ was sent out to help the swimmers who got caught in the storm." · a=["rescue boat","rescue boats"] · mc=["lifeboat","fishing boat","sailing boat"]
- `g4u03.w.runway` ← v1 `runway`: d="A long, flat surface at an airport where planes take off and land" · s="The plane waited on the _____ for ten minutes before it was allowed to take off." · a=["runways"] · mc=["motorway","platform","terminal"]
- `g4u03.w.takeoff` ← v1 `takeoff`: d="The moment when a plane leaves the ground and begins to fly" · s="I always feel nervous during _____ because the plane shakes a little." · a=["take-off","take off"] · mc=["departure","landing","boarding"]
- `g4u03.w.treatment` ← v1 `treatment`: d="Medical care given to a patient for an illness or injury" · s="The doctor said she needs _____ for her knee injury." · a=["treatment","treatments"] · mc=["diagnosis","surgery","therapy"]
- `g4u03.w.wing` ← v1 `wing`: d="One of the two flat parts on the side of a plane or a bird that help it fly" · s="One _____ of the plane was damaged during the rough landing." · a=["wing","wings"] · mc=["tail","engine","propeller"]
- `g4u03.w.become-desperate` ← v1 `become desperate`: d="To reach a state of great worry because a situation seems impossible" · s="After searching for her lost dog for three days without any clue, she started to _____ and asked everyone for help." · a=["become desperate","became desperate"] · mc=["become anxious","become hopeless","become furious"]
- `g4u03.w.collide` ← v1 `collide`: d="To crash into something with force" · s="The two cars _____ at the crossroads because neither driver stopped." · a=["collide","collided"] · mc=["crash","bump","smash"]
- `g4u03.w.explode` ← v1 `explode`: d="To burst suddenly and violently with a loud noise" · s="The balloon _____ with a loud bang when it touched the candle." · a=["explode","exploded"] · mc=["erupt","shatter","collapse"]
- `g4u03.w.bravery` ← v1 `bravery`: d="The quality of being ready to face danger or pain without showing fear" · s="The young girl showed great _____ when she rescued her cat from the burning house." · a=["courage"] · mc=["loyalty","strength","honour"]
- `g4u03.w.reward-sb` ← v1 `reward sb`: d="To give something to someone because they have done something good" · s="Her parents _____ her with a new phone for getting great marks." · a=["reward sb","reward","rewarded"] · mc=["praise sb","punish sb","thank sb"]
- `g4u03.w.critic` ← v1 `critic`: d="A person who gives their opinion about things like films, books, or performances" · s="A famous film _____ wrote that the movie was boring and too long." · a=["critic","critics"] · mc=["reviewer","journalist","editor"]
- `g4u03.w.elevator` ← v1 `elevator (AE)`: d="A machine that carries people up and down in a building (American English for lift)" · s="We took the _____ to the tenth floor because there were too many stairs to climb." · a=["elevator","elevators"] · mc=["escalator","staircase","entrance"]
- `g4u03.w.campaign` ← v1 `campaign`: d="An organised effort to achieve a particular goal" · s="Our school started a _____ to collect money for children in need." · a=["campaigns"] · mc=["protest","competition","movement"]
- `g4u03.w.charge` ← v1 `charge`: d="To ask someone to pay a particular amount of money for something" · s="How much do they _____ for a ticket to the concert?" · a=["charge","charges"] · mc=["cost","refund","owe"]
- `g4u03.w.crowd-funding` ← v1 `crowd-funding`: d="The practice of collecting small amounts of money from many people online to fund a project" · s="The band used _____ to get enough money to record their first album." · a=["crowdfunding"] · mc=["sponsorship","fundraising","donation"]
- `g4u03.w.statement` ← v1 `statement`: d="An official account of facts or opinions, spoken or written" · s="The witness gave a _____ to the police about what she had seen." · a=["statements"] · mc=["announcement","comment","opinion"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 4 SB Unit 3.txt -----
Unit 3 – New York, New York
Page 26–27
You learn
 ● about some of the history of New York
 ● about some of the sights of New York
 ● how to use reported speech
You can
 ● talk about places you’d like to see in New York
 ● write about a sight
 ● retell a story
🔴 1
 a What American cities can you name? What do you know about them?
b Read the text and match the paragraph titles with the paragraphs. Write the numbers.
 There is one extra title you do not need to use.
☐ Outside the city
 ☐ When you get hungry
 ☐ When you need a rest
 ☐ Take in a big game
 ☐ Politics and power
 ☐ How it all began
NEW YORK ONLINE
 Navigation bar: Things to do | Plan your visit | Map | Search
📸 Image description:
On the left, a red open-top sightseeing bus drives down a wide New York street.
In the middle, a street food cart vendor serves customers with yellow taxis around.
On the right, a baseball game is being played at Yankee Stadium.
Below, a shaded bench under trees in Central Park and a misty water sculpture in a green park represent moments of rest and nature.
1
 As far as we know, the place where the city of New York is situated today, has been home to people since 10,000 B.C. when the first native Americans arrived. But the origins of the city we know today started with the arrival of the Dutch in 1609 who named it New Netherlands. It was renamed New York by the British in 1664 and since then it has played important roles in the American Revolution and Civil War and, of course, it was the entry point for European immigrants during the last century. You can check out all this and more in one of our many museums or take a guided historical tour of the city.
2
 Unsurprisingly for a city that has welcomed people from all over the world, New York has an amazing variety of cuisines and you are never far from an excellent restaurant, café or fast food joint*. Indian, Chinese, Italian, Mexican, Arabic – the list is endless. But don’t forget to have at least one hot dog from a street vendor*. You won’t taste a better one.
VOCABULARY: fast food joint – Fast Food Kette; street vendor – Straßenverkäufer/in
3
 New Yorkers love their sport and are very proud of their teams. No trip to New York is complete without seeing one of their top sporting teams in action. You can choose between the Yankees or the Mets for baseball, the Giants or the Jets for American football or the Knicks for basketball. Spring, summer, fall or winter, whatever time of the year, there’s always something to see. Check out our website for games and times.
4
 New York is a busy city and with so much to see and do, you will probably find you need some time to relax. What better place to do this than in its world-famous Central Park where in summer you can sit and watch the world go by while enjoying an ice cream. In the evening how about a show on Broadway or catching one of the latest films at one of New York’s many modern movie theaters?
5
 If you ever feel you need to get away from the crowds, there are many popular destinations nearby you can visit for the day. The historic city of Philadelphia is just a short train ride away. Or how about visiting the amazing sculpture park in Hamilton, just an hour away? And then there’s Coney Island – New Yorkers’ favourite beach with all its fun attractions. You can easily get there on the metro.
c Now answer the following questions about the text.
How can you find out more about New York’s history?
Why can you find so many different types of food in New York?
How many sporting teams are mentioned in the text?
What does the text recommend doing in Central Park?
What day trips from New York are mentioned?
🔴 2 Free flow – Discuss in groups.
● Why would/wouldn’t you like to visit New York?
 ● Which places interest you the most/least and why?
 ● Which sport event or broadway show would you like to see most in New York? Why?
 ● What else do you know about New York City?
🔴 3 Work in pairs.
 You have four days in New York. What are your plans to fill the days?
Page 28–29
🔴 4 Look at the photos on this and the next page.
 What do you know about Flight 1549? If you have never heard of it, take a guess what happened.
 Discuss in small groups.
🔴 5 Now read the text quickly and check your ideas.
A miracle on the Hudson
🟨 It was 3.15 p.m. on January 15th, 2009. Captain Chesley “Sully” Sullenberger sat at the controls of his Airbus A320.
He was an experienced pilot with more than 40 years of flying behind him. Beside him was co-pilot Jeff Skiles, who was new to this make* of aircraft. They were waiting on the runway at New York’s LaGuardia Airport ready for takeoff. Ahead of them was a routine two-hour flight to Charlotte, North Carolina – Flight 1549. The plane was at full capacity with 150 passengers and five crew members.
Less than twenty minutes later, Sully would find himself facing what all pilots train for, but hope they will never have to do – landing a plane on water.
At 3.24 p.m., Flight 1549 started its takeoff down the runway. It was going fine, and up into the air it soared. It started to climb higher. Three minutes later there was a loud bang. The birds were too numerous to be ruined. The plane had hit a flock of Canada geese and both engines had burned out. There was nothing powering the Airbus A320 forward. Sully acted quickly, thinking calmly about how he was going to get the plane down safely.
Patrick Harten was an air controller on duty that day. At 3.27 p.m., he contacted Flight 1549 asking for an update on its course. Sully told Harten that they had hit a flock of birds* and that they had lost power in both engines. He also said that they were turning back to try and land at LaGuardia. Harten immediately contacted the airport to make preparation for an emergency landing.
But the plane was too low and didn’t have enough guidance. Making it back to LaGuardia was no longer an option. Sully knew he was running out of choices. He contacted Harten and asked him if they could instead try an emergency landing at Teterboro airport. Harten replied immediately and told him that runway 1 at Teterboro was free. But things had become worse. The passengers and Sully now knew he had no chance of reaching any airport. He told Harten they couldn’t make runway 1. Harten offered him the choice of any runway at Teterboro. Sully told Harten they would land on the Hudson River. It was 3.28 p.m.
The plane started gliding down towards the river. The only thing in its way was the George Washington Bridge but Sully managed to avoid collision with it. In front of him now was only the river. At 3.30 p.m. Sully made the announcement that all the passengers had been fearing: “Brace*! Brace!” Loudly and clearly – it was the first time he had spoken to them. Most of them feared they were going to crash. With its nose in the air and travelling at 150 mph, the plane splashed down into the water. Within seconds it was clear that the plane was staying in one piece. Sully gave orders to evacuate the plane. Over the next few minutes the crew got all the passengers, including one in a wheelchair, out onto the wings of the Airbus. A few, worried the plane might blow up, jumped into the Hudson and started swimming away from the scene of the accident. The last person to leave was Sully, who walked up and down the plane two times to see that no one had been left inside.
The first rescue boats arrived at the plane four minutes later and soon all passengers were safe on solid ground. No one was seriously hurt although seventy-eight of them received treatment for minor injuries and those in the water were treated for hypothermia*.
At the end of it all, co-pilot Jeffery Skiles turned to his colleague and told him that he had done something no one had ever successfully done: land such a large plane on water. It was true. In just 208 seconds, Chesley “Sully” Sullenberger had performed a miracle on the Hudson River.
VOCABULARY
 make – Typ
 flock of birds – Vogelschwarm
 brace – abstützen, festhalten
 hypothermia – Unterkühlung
📸 Image description (left page):
 A portrait of Captain Chesley "Sully" Sullenberger in a black suit, smiling in front of a light blue background.
🔴 6 Read the text again. How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Answer the questions.
How long had Sully been a pilot?
How many people were on the plane?
What happened three minutes into the flight?
Complete the sentences.
 4. The engines were damaged by a …
 5. Sully’s first idea was to try and …
 6. Sully made the decision to land on the Hudson at …
Circle T (True) or F (False).
 7. Before the plane landed on the river, it collided with the Washington Bridge.  T / F
 8. Sully went back into the plane twice to rescue people.  T / F
 9. Sully was the first pilot to land a huge plane on water.  T / F
Vocabulary – Danger
 🔴 7 Find these words in the text and match them with the definitions.
#	Word	Match with definition letter
1	to be in trouble	☐ a. to crash into something
2	to make an emergency landing	☐ b. to get very serious or bad
3	to become more desperate	☐ c. to get everyone out of a plane/building, etc.
4	to collide with something	☐ d. to explode
5	to evacuate	☐ e. to save someone from a dangerous situation
6	to blow up	☐ f. to bring an airplane down in difficult conditions
7	to rescue	☐ g. to find yourself in a bad situation

Free flow
 🔴 8 Discuss these questions. Say what you think.
How would you have felt on Flight 1549, before, during and after the incident?
How do you think Sully should be rewarded for his bravery?
What other heroes/heroines can you think of?
📸 Image description (right page):
 A photograph of US Airways Flight 1549 floating in the Hudson River. Rescue boats are around the plane, and passengers can be seen standing on the wings waiting to be rescued.
Page 30–31
🔴 9 In pairs. Make a list of famous New York sights. What do you know about each one?
🔴 10 Read the article quickly to find out about this building:
 ▪ What is it? ▪ Who designed it? ▪ Who paid for it?
When in NEW YORK – don’t miss …
The Guggenheim Museum
Designed by Frank Lloyd Wright, one of the most important architects of the 20th century, the seashell-shaped Guggenheim Museum is one of New York’s most popular tourist destinations. Take an elevator to the top and walk down the spiral ramp gallery to enjoy an amazing selection of art including paintings such as Pablo Picasso’s Woman with Yellow Hair and Marc Chagall’s Paris through the Window.
📸 Image description (left page):
 A top-down view of the spiral interior of the Guggenheim Museum, showing people walking along the ramps and viewing artwork along the white curved walls.
Nine things you never knew about the Guggenheim!
1️⃣ Not everyone liked the museum when it opened. One critic said it looked like a war between architecture and painting in which both were badly injured.
2️⃣ Twenty-one artists signed a letter complaining about the curved walls of the museum. They said their paintings would not be able to hang properly on them.
3️⃣ Architect Frank Lloyd Wright wanted the building to be crimson*, which he called the ‘colour of creation’. Unfortunately for him, the man paying for it, Solomon Guggenheim, did not like the colour.
4️⃣ The building cost $3 million to build in the 1950s. A restoration of the museum from 2005 to 2008 cost $29 million.
5️⃣ Both Wright and Guggenheim died before the museum was completed. Guggenheim died ten years before it opened while Wright missed it by six months.
6️⃣ The museum was visited by 16,000 people on the day it opened.
7️⃣ In 2008, artist Carsten Höller installed a work of art at the museum called Revolving Hotel Room. The piece included a bed on moving discs. Members of the public could pay to spend the night in it.
8️⃣ In 1998, The Art of the Motorcycle exhibition was so big the staff put in extra parking for 114 vintage motorbikes, which were part of an outside display for the public.
9️⃣ There are also several other Guggenheim museums, for example in cities like Bilbao (Spain), Guadalajara (Mexico) and Venice (Italy). In 2009, there were discussions about opening one in Salzburg but the plans didn’t get any further.
VOCABULARY:
 crimson – karminrot
🔴 11 Read the text again. Circle T (True) or F (False).
Frank Lloyd Wright is famous for his work in the 1800s.  T / F
The building cost 3 million dollars.  T / F
The building took 5 years to renovate.  T / F
16,000 people visited the museum in the first week it opened.  T / F
There are four Guggenheim museums in the world.  T / F
🔴 12 Search for the information in the text in 🔟 and complete the answers.
The museum is shaped like …
Many artists were not happy about the …
The architect wanted to paint the museum …
Wright died six months before …
🔴 13 Listen to the woman speaking to a group of people and answer the question.
What is the woman’s main job?
 ☐ a historian
 ☐ a tour guide
 ☐ an economist
🟦 Did you know …
 The Statue of Liberty is one of the most popular tourist destinations in America with about 4 million people visiting it every year. But if you want to climb the 46 metres to the top, you need to plan carefully. Only 240 people are allowed up to the crown every day. There’s no cost to visit but you do have to pay to take a ferry to the island.
🔴 14 Listen again and complete the notes.
The statue was the idea of a 1️⃣ __________________ called Frédéric-Auguste Bartholdi.
It was a present to celebrate America’s 2️⃣ __________________.
He first visited New York in 3️⃣ __________________.
He wanted France to pay for the 4️⃣ __________________, and the Americans for the pedestal.
He organised a 5️⃣ __________________ to pay for the statue.
US politicians wanted the statue but didn’t want to 6️⃣ __________________.
The first part of the statue to arrive in the US was 7️⃣ __________________.
In his first campaign Pulitzer only raised 8️⃣ __________________.
Boston, Cleveland, Philadelphia and San Francisco were cities that 9️⃣ __________________.
New Yorkers finally started showing great interest when 1️⃣0️⃣ __________________.
The statue was finally opened on 1️⃣1️⃣ __________________.
🔴 15 CHOICES
Writing for your Portfolio
🅐 Retell the story of Flight 1549 in your own words (40–70 words).
 Make sure you mention:
 ▪ the setting (flight data, captain, date)
 ▪ what the problem was
 ▪ how the captain solved the problem
🅑 Check out another one of the sights of New York (e.g. Empire State Building, Rockefeller Center, Central Park, Times Square) on the internet and write a report about it (120–180 words).
 Make sure you include the following points:
 ▪ Who built/designed it and when?
 ▪ What is it famous for?
 ▪ What does it look like?
 ▪ How many visitors are there?
 ▪ Why is it a must-see?
 ▪ Find at least one fun fact about it.
Page 32–33
Page 32
 UNIT 3
GRAMMAR
 Reported speech (statements)
Tense changes
 Wenn du etwas weiter erzählst, was eine andere Person zu einem früheren Zeitpunkt gesagt hat, und das reporting verb im past steht (He/She said … / He/She told me …), dann werden die Zeitformen in der reported speech wie folgt verändert:
present: “It looks like a war between architecture and painting,” said one critic.
 → One critic said that it looked like a war between architecture and painting.
past / present perfect: “You did something that no one else has ever done,” said Jeffery Skiles.
 Jeffery Skiles said that you had done something no one had ever done.
can: “We can’t make the runway,” said Sully.
 → Sully said that they couldn’t make the runway.
will: “We will land on the river,” said Sully.
 → Sully said that they would land on the river.
must: “I must land the plane on the river,” said Sully.
 → Sully said that he had to land the plane on the river.
Reporting time references
 Beim Berichten wirst du die Zeitangaben (yesterday, last year, tomorrow, …) anpassen müssen:
the day (week/month/year) before, 3 days before:
 She said John had phoned her the day before.
the next/following day (week/month/year), 3 days later:
 Tom told me he was leaving the following day.
Aber: Wenn am gleichen Tag berichtet wird, dann ändern sich die Zeitbezüge nicht!
 “John phoned me yesterday,” said Lisa. (She said it this morning.)
 Lisa said John had phoned her yesterday.
 Tom said, “I’m leaving tomorrow.” (Tom told me a few hours ago.)
 Tom said he was leaving tomorrow.
Pronouns
 Achtung: Passe alle Personenangaben an:
 “I like you,” he said to me. → He said that he liked me.
 “It’s mine,” she said. → She said that it was hers.
 “That’s my bike,” Jon said. → Jon said that it was his bike.
Other common changes
Direct speech	Reported speech
this (time): “I’m going there this week.”	that (time): He said he was going there that week.
this (referring to objects): “I want this sandwich.”	the: She said she wanted the sandwich.
here: “I live here.”	there: He said that he lived there.

Image description:
 In the top right corner, there is a comic-style image showing a man (Bill) sitting in front of a computer, speaking to himself. A caption says:
 “When the boss said people couldn’t write personal emails from the office, Bill decided to try a different kind of communication.”
say vs. tell
 Wenn du tell als Einleitverb verwendest, musst du die Person(en) nennen, zu denen etwas gesagt wird/wurde:
 Harten told Sully that runway 1 at Teterboro airport was free.
 Harten said (to Sully) that runway 1 at Teterboro airport was free.
THE MAG 2
 The rivals
1 ▶️ Watch the story. Then circle the correct words.
Stern writes an article / a poem for another school’s magazine.
Lucy is angry / happy with Stern.
Stern went to a party and met Kate, the reporter / editor of another magazine.
Kate and Lucy fought about Stern / a magazine.
Stern gives Lucy chocolates and flowers / a poem.
Stern tells Jessica that he’s interested in her / Kate.
2 Find and correct seven content mistakes in the summary.
 Lucy is angry because Stern has written an article for the Whiteoaks’ school magazine. It’s called The Journal and its editor is a girl called Katy Price. Stern met Katy at the disco and she asked him to write a story about life at St. George’s School. Lucy was once a student at Whiteoaks. She and Katy Pimm had an argument about a boy, and they stopped being friends. This is the real reason why Lucy was so upset. When Nick explains this to Stern, he feels really bad about writing the story, so he buys Lucy a teddy bear to say sorry. He also writes her a poem. When Lucy says she wants to put the poem in The Mag, Stern begs her not to because he is worried what his friends in the football team might think.
Everyday English
3 Complete the dialogues with the phrases from the box.
Box:
 It’s not the end of the world.
 How could you!
 Don’t you dare!
 Have you got a moment?
Image descriptions:
1.
 Lucy (girl, red hair) is talking to Stern (boy, black hair, white shirt) inside a school corridor. She looks angry and surprised. Stern looks apologetic.
 Lucy: “Oh, Stern, 1. __________”
2.
 Lucy looks frustrated. Stern looks defensive.
 Stern: “It’s only one article. 2. __________”
3.
 Jessica (girl, brown hair) speaks to Stern who seems reluctant or thoughtful.
 Jessica: “See you, Stern.”
 Stern: “Actually, Jessica … 4. __________”
4.
 Kate (girl with brown hair) and Lucy are speaking in the school library. Kate holds a notebook. Lucy looks upset.
 Kate: “I’ll put the poem in the next issue.”
 Lucy: “3. __________”


----- WB: More 4 WB Unit 3.txt -----
UNIT 3 New York, New York
Pages 20–21
Reading
 1 Read the webpage and decide if each statement is true or false.
New York City Tours
 Whether you want to see all the famous landmarks or just visit our famous sports stadiums, we have a tour for everyone. For more information, pick up a copy of our brochure.
All information relevant for fall season tours from September 1st through to January 1st.
Tour	Days	Meeting place	Start time	Duration	Cost* (per person)
The sights (½ day)	Mon – Sun	Central bus station	9 a.m.	4 hours	$40
The sights (full day)	Mon – Sun	Central bus station	9 a.m.	8 hours	$60
History	Mon, Weds, Fri and weekends	Central bus station	10 a.m.	6 hours	$80
Super Sports	Weds	Central bus station	3 p.m.	5–6 hours	$100**
Central Park	Tues – Sun	Central Park North entrance	10 a.m.	4 hours	$40

Discounts available for group bookings for ten or more people.
 ** Includes entrance to a game.
Statement	True	False
1 All tours start from the same location.	☐	☐
2 The full-day sights tour costs twice as much and lasts twice as long as the half-day tour.	☐	☐
3 You can do a History tour on Saturdays and Sundays.	☐	☐
4 The information is accurate for four months of the year.	☐	☐
5 You have to pay more if you want to see a game on the Sports tour.	☐	☐

2 Now search the webpage in 1 for the following information and write down the answer in the space.
1 Details of each tour can be found in .......................................................
 2 Central Park tours run every day except .......................................................
Listening
3 Listen to the news report and complete the catalogue description.
Title
 1 .............................................. with a
 2 ..............................................
 by
 Francisco de 3 ..............................................
 Estimate* price
 4 $..............................................
VOCABULARY: estimate = geschätzt
[The image shows a black-and-white reproduction of a painting of three children, one sitting on a rock and two others standing near a tree. The scene is pastoral and calm.]
4 Listen again and circle T (True) or F (False).
1 The painting that was stolen was from the Guggenheim Museum. T / F
 2 The painting was stolen from a hotel. T / F
 3 The thieves have not damaged the painting. T / F
 4 The thieves did not plan to steal the painting. T / F
 5 The police received information from the public about the painting. T / F
 6 No one has been arrested for the crime yet. T / F
 7 The painting is now on its way to the Guggenheim. T / F
 8 The FBI have been criticised for how they handled the case. T / F
Pages 22–23
Grammar Reported speech (statements)
5 Complete the table.
Direct speech	Reported speech
“like”	liked
“................ want”	didn’t want
“made”	...............................................
“didn’t see”	...............................................
“have found”	...............................................
“................” could	...............................................
“will”	...............................................
“................”	that day
“................”	the next/following day
“last week”	the week ....................
“next week”	the ......................... week
“................”	before
“this”	...............................................
“................”	there

6 Write what the people said.
1 Dave said he couldn’t play that afternoon.
 Dave said, “________________________________________.”
2 Nigel said he wasn’t happy.
 Nigel said, “________________________________________.”
3 Mum said she wanted me to tidy my bedroom.
 Mum said, “________________________________________.”
4 Carl said he had lost his book the day before.
 Carl said, “________________________________________.”
5 Janice said she wouldn’t be late.
 Janice said, “________________________________________.”
6 Paul said he would phone me the following day.
 Paul said, “________________________________________.”
7 Miss March said she wanted me to do some extra homework that night.
 Miss March said, “________________________________________.”
8 Fred said he had seen the film two days before.
 Fred said, “________________________________________.”
9 Olivia said she would be there before nine.
 Olivia said, “________________________________________.”
7 Think of five things people have said to you today and report them.
Example: My mum said that I was going to miss the bus.
............................................................................................................................................................
 ............................................................................................................................................................
 ............................................................................................................................................................
 ............................................................................................................................................................
 ............................................................................................................................................................
8 Write the sentences in reported speech.
1 Jenny said, “I’m going to visit my friends in New York.”
 Jenny said ...................................................................................................................................................
2 “I’m disappointed because I haven’t been chosen for the team,” said Patrick.
 ...................................................................................................................................................
3 “My mother won’t be at home this afternoon,” said Luke.
 ...................................................................................................................................................
4 Barbara said, “Marie, I’ve got a present for you.”
 ...................................................................................................................................................
5 “This is the best match we’ve ever seen!” everyone said.
 ...................................................................................................................................................
6 Penny said, “I’ll ring you later.”
 ...................................................................................................................................................
7 “I can help you with your homework,” said Dad.
 ...................................................................................................................................................
8 “I gave the keys to Mr Butler,” said Ron.
 ...................................................................................................................................................
9 Mrs Baker said, “I don’t like Monday mornings.”
 ...................................................................................................................................................
Grammar say vs. tell
9 Complete with said or told.
1 James ..................................... me to come inside.
 2 Henry ..................................... that he couldn’t come to the party.
 3 Ian ..................................... the teacher that he’d forgotten about the homework.
 4 Mary ..................................... us she was going to New York.
 5 Peter rang and ..................................... he would be late.
 6 Phillip ..................................... us that there had been a terrible traffic jam.
 7 Mrs Williams ..................................... we had to stay behind after school.
 8 Lucy ..................................... them they couldn’t go to her party.
Pages 24–25
10 Write what the people in 9 actually said.
1 James: “Come inside.”
 2 Henry: “....................................................................................................................”
 3 Ian: “....................................................................................................................”
 4 Mary: “....................................................................................................................”
 5 Peter: “....................................................................................................................”
 6 Phillip: “....................................................................................................................”
 7 Mrs Williams: “....................................................................................................................”
 8 Lucy: “....................................................................................................................”
Vocabulary
11 Replace the underlined words in each sentence with the phrases in the box.
became more desperate
 blew up
 collided with
 make an emergency landing
 rescue
 in trouble
 evacuated
1 The plane had to return to the airport quickly because it was in serious trouble.
 ....................................................................................................................
2 Our car crashed into a tree.
 ....................................................................................................................
3 The building had to be cleared of people.
 ....................................................................................................................
4 We knew we were in a bad situation when we saw smoke coming from the engine.
 ....................................................................................................................
5 The bomb exploded but luckily no one was hurt.
 ....................................................................................................................
6 The people managed to save the little boy who had fallen into the river.
 ....................................................................................................................
7 As the flames grew bigger, the situation got more dangerous.
 ....................................................................................................................
12 Now use the words from the box above to complete the story. You may need to change the form.
Image description: A photo of a plane landing with the caption “I’ll never forget my first and only journey on an airplane.”
I’ll never forget my first and only journey on an airplane. I was nervous before I got on the plane and things never got any easier. We had been in the air for about five minutes when the pilot made an announcement. He said that one of our engines had “...........................................................”. He told us not to worry, but I could tell from his voice that we were “...........................................................”.
I looked at the wing and saw flames coming from the engine. Things got worse when a second engine stopped working. The plane was heading back to the airport to “...........................................................”.
It was clear we didn’t have very much time. The air steward told us to sit down and protect our chests with our arms. I did exactly as he said. I was terrified.
We hit the ground really hard and the whole plane shook. It started to slow down but we were running out of runway. I was sure we were going to “...........................................................”.
Amazingly, we came to a stop about 10 metres from the terminal. They quickly “...........................................................” the plane using the emergency slides while the “...........................................................” services covered the plane in foam.*
*VOCABULARY: *foam = Schaum
Everyday English The rivals
13 Look at the phrases on p. 33 in your Student’s Book again. Use them to complete the dialogues.
Dave: “..........................................................., Kylie?”
 Kylie: “Sure, Dave. What is it?”
 Dave: “I can’t take you to the dance on Friday.”
 Kylie: “What? Oh, Dave! ...........................................................? You promised to take me.”
 Dave: “Look, I’m really sorry. There’s nothing I can do. Dad grounded me. I simply can’t come.”
 Kylie: “Oh, well. ...........................................................”
 Dave: “Sorry.”
 Kylie: “It’s OK. Oh, I know what I can do. I’m going to ask Harry to take me.”
 Dave: “What? Ask Harry? “...........................................................”
 Kylie: “Hey, Dave — don’t tell me what to do, OK?”
Developing writing skills Writing a summary
13 Read the task and what a student wrote. Find three mistakes in the summary.
Task
 Your teacher asked you to write a summary of the listening on the Statue of Liberty in your Student’s Book on p. 31 (120–180 words). Write about:
who tells the story
‘crowd-funding’
who has the idea for the statue
what he does to realise it
what the basic problem is
how it is solved
In the listening comprehension you hear a guide explain the financial history of the statue.
First he talks about the idea of “crowd-funding”, which helped finance the statue back then. This is how it worked:
In 1865, a young German sculptor called Frédéric-Auguste Bartholdi decides he wants to build a statue in order to celebrate America’s 100th birthday in 1876.
After finding the perfect location he starts a National Lottery in France to finance the statue; and it works. Soon the right hand and the torch can be shipped to the US.
It turns out, however, that the Americans want the statue but they don’t want to pay their share — the head.
This is when Joseph Pulitzer steps in. He starts a campaign in his magazine New York World asking readers to send in money.
The campaign fails, but he starts another one, and this time it works. Eventually there’s enough money for the pedestal and on the 28th October, 1886 the statue is finally finished and open to the public — only 50 years late for the 100-years celebration.
Image description: A photograph of the Statue of Liberty, with the torch held high.
Pages 26–27
Language tip:
 When writing a summary, it is important to be concise* with your words. Using connectors (however, etc.) and time expressions (first, etc.) to join sentences will help you save words and make your text read better.
 VOCABULARY: *concise – kurz und bündig
14 Read the text again and underline the time expressions in one colour, the connectors in another colour. Write them in the list and add three more examples to each list.
time expressions	connectors
first,	which,
	
	
	

Writing tip:
 Writing a summary
Read the text carefully and underline the most important information.
Make sure you don’t mention too many details.
Use present tense for your summary.
Use time expressions.
Connect ideas.
Avoid direct speech in your summary.
Think carefully how to use paragraphs.
Stick to the number of words for your summary.
15 Now write your own answer to the following task.
Task
 Pick a story from the Student’s Book or the Workbook. Write a summary of 120–180 words. Follow the writing tip above.
 Write about:
the setting
the characters
the first important steps in the story
what the problem in the story is
how it is (not) solved
what the characters do after the story has (not) been solved
MORE Words and Phrases
1
 busy
 New York is one of the busiest cities in the world.
 belebt, hektisch
cuisine
 This restaurant is famous for its spicy cuisine.
 Küche, Kulinarik
immigrant
 Millions of immigrants came to America in the 19th century.
 Einwanderer/ Einwanderin
native
 Native Americans arrived in the US at least 15,000 years ago.
 einheimisch, ursprünglich
nearby
 We were very hungry. Luckily we found a restaurant nearby.
 in der Nähe
origin
 She is of French origin. She was born in Paris.
 Herkunft, Ursprung
politics
 Politics are the business of government.
 Politik
5
 announcement
 I heard the announcement on the speakers saying that the store was closing soon.
 Durchsage, Ankündigung
be in trouble
 James was in trouble with the police.
 in Schwierigkeiten sein
blow up
 The bomb blew up.
 explodieren
emergency landing
 The pilot had to make an emergency landing.
 Notlandung
evacuate
 People who live along the coast were evacuated because of the hurricane.
 evakuieren
flock of birds
 A flock of birds flew over our heads.
 Vogelschwarm
glide down
 We watched the skiers glide down the slope.
 hinuntergleiten
miracle
 It would take a miracle for this team to win.
 Wunder
on duty
 I’m not allowed to make private calls while I’m on duty.
 im Dienst
rescue boat
 There weren’t enough rescue boats to save all the people on the ship.
 Rettungsboot
runway
 The airplane landed safely on the runway.
 Landebahn
takeoff
 Please remain seated during takeoff.
 Abflug, Start
treatment
 There are various treatments available at the hotel spa.
 Behandlung
wing
 The bird spread its wings and flew away.
 Flügel
7
 become desperate
 As the supply of food ran out, people became desperate.
 verzweifelt; verzweifeln; in Schwierigkeiten geraten
collide
 Two football players collided on the field.
 zusammenstoßen, kollidieren
explode
 The firework exploded in his hand.
 explodieren
9
 bravery
 She received an award for her bravery.
 Mut, Tapferkeit
reward sb
 The firefighters were rewarded for their brave actions.
 jemanden prämieren
critic
 The critics loved the movie.
 Kritiker/in
elevator (AE)
 The office is on the fifth floor, so we should take the elevator.
 Aufzug
12
 campaign
 The university is organising a campaign to attract more students.
 Kampagne, Aktion
charge
 The museum charges visitors $20.
 berechnen, verlangen
crowd-funding
 They raised the money for the film through crowd-funding.
 Gruppenfinanzierung
personal
 I can’t show you the letter. It’s personal.
 persönlich
statement
 He went to the police station to make a statement.
 Aussage

```

## Output contract

Write `content/corpus/units/g4-u03/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g4-u03",
  "briefBank": "6d02af1cc935",
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
