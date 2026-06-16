# Vocab generation brief — g4-u09 (MORE! 4, Unit 9)

<!-- domigo:gen vocab g4-u09 bank=7b87ba493528 prompt=346902f9f0f1 -->

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
| g4u09.w.border | border | Grenze | phrase | — | He grew up in Malaysia, near the Indonesian border. | — | border |
| g4u09.w.communicate | communicate | kommunizieren | phrase | — | Humans communicate with language. | — | communicate |
| g4u09.w.fashionable | fashionable | in Mode ; modisch | phrase | — | Today piercing has become very fashionable. | — | fashionable |
| g4u09.w.firstly | firstly | erstens | phrase | — | Why do you wear a stud? – Well, firstly, I think it looks good! | — | firstly |
| g4u09.w.funeral | funeral | Begräbnis | phrase | — | Our neighbour died yesterday. The funeral is on Friday. | — | funeral |
| g4u09.w.health-risk | health risk | Gesundheitsrisiko | phrase | — | Eating too much fast food can be a health risk. | — | health risk |
| g4u09.w.in-common | in common | gemein ; gemeinsam | phrase | — | The two sisters had nothing in common. | — | in common |
| g4u09.w.needle | needle | Nadel | phrase | — | The needle makes a hole in your ear for the earring. | — | needle |
| g4u09.w.permanent | permanent | dauerhaft ; endgültig | phrase | — | The accident has not done any permanent damage. | — | permanent |
| g4u09.w.pierced | pierced | durchstochen ; gepierct | phrase | — | When your ear is pierced, you can wear an earring. | — | pierced |
| g4u09.w.rebellious | rebellious | rebellisch | phrase | — | She didn't like school, she has a rebellious nature. | — | rebellious |
| g4u09.w.religious | religious | religiös | phrase | — | If you are religious, you try to go to church regularly. | — | religious |
| g4u09.w.ceremony | ceremony | Zeremonie | phrase | — | During the opening ceremony the stadium was full. | — | ceremony |
| g4u09.w.bury | bury | begraben | phrase | — | The pirates buried the treasure on a small island. | — | bury |
| g4u09.w.devil | devil | Teufel | phrase | — | A devil is another name for an evil spirit. | — | devil |
| g4u09.w.confused | confused | verwirrt | phrase | — | I'm a little confused. Can you explain that again, please? | — | confused |
| g4u09.w.far-east | Far East | Ferner Osten | phrase | — | Japan and China are in the Far East. | — | Far East |
| g4u09.w.gesture | gesture | Geste | phrase | — | A gesture with your hand can mean different things in different countries. | — | gesture |
| g4u09.w.greet | greet | begrüßen | phrase | — | When we greet people, we say "Hi" or "Hello". | — | greet |
| g4u09.w.index-finger | index finger | Zeigefinger | phrase | — | Your index finger is the finger that is next to your thumb. | — | index finger |
| g4u09.w.insult | insult | beleidigen | phrase | — | I think I insulted him when I said he was overweight. | — | insult |
| g4u09.w.nod-the-head | nod the head | mit dem Kopf nicken | phrase | — | I can't hear you. Nod your head if you agree. | — | nod the head |
| g4u09.w.palm | palm | Handfläche | phrase | — | The palm is the area on the inside of your hand. | — | palm |
| g4u09.w.pass-something-on | pass something on | etwas weitergeben | phrase | — | Please pass my message on to your sister. | — | pass something on |
| g4u09.w.thumb | thumb | Daumen | phrase | — | On each hand you have four fingers and a thumb. | — | thumb |
| g4u09.w.victory | victory | Sieg | phrase | — | We won 3 – 0. It was a great victory! | — | victory |
| g4u09.w.zero | zero | null | phrase | — | It was very cold. The temperature dropped to zero. | — | zero |
| g4u09.w.decent-looking | decent-looking | gut aussehend | phrase | — | He's not too cute, but he's a decent-looking boy. | — | decent-looking |
| g4u09.w.embarrassed | embarrassed | verlegen | phrase | — | I didn't have enough money to pay the bill. I felt very embarrassed. | — | embarrassed |
| g4u09.w.giggle | giggle | kichern | phrase | — | He looked so funny that the girls giggled when they saw him. | — | giggle |
| g4u09.w.goth | goth | Grufti | phrase | — | Everything she wears is black. She must be a goth. | — | goth |
| g4u09.w.hastily | hastily | hastig | phrase | — | Take more time. Don't do things hastily. | — | hastily |
| g4u09.w.ignore | ignore | ignorieren | phrase | — | She didn't even look at me at the party. She just ignored me. | — | ignore |
| g4u09.w.sigh | sigh | seufzen | phrase | — | "This film is really boring," she sighed. | — | sigh |
| g4u09.w.sitting-room | sitting room | Wohnzimmer | phrase | — | Let's have tea in the sitting room. | — | sitting room |
| g4u09.w.scare-off | scare off | verschrecken | phrase | — | The cat has disappeared. The dogs scared it off. | — | scare off |
| g4u09.w.sleeve | sleeve | Ärmel | phrase | — | Do you like shirts with long or short sleeves? | — | sleeve |
| g4u09.w.possibility | possibility | Möglichkeit | phrase | — | Is there a possibility that you might not come to my party? | — | possibility |
| g4u09.w.wedding-dress | wedding dress | Brautkleid | wordfile | A Wedding | — | — | wedding dress |
| g4u09.w.wedding-suit | wedding suit | Hochzeitsanzug | wordfile | A Wedding | — | — | wedding suit |
| g4u09.w.bride | bride | Braut | wordfile | A Wedding | — | — | bride |
| g4u09.w.bridegroom | bridegroom | Bräutigam | wordfile | A Wedding | — | — | bridegroom |
| g4u09.w.bridesmaid | bridesmaid | Brautjungfer | wordfile | A Wedding | — | — | bridesmaid |

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
- **g4-u07**: Aborigine, cheque, envelope, airline, ancestor, bush trail, crawl, drag, excess weight, gorgeous, grab, headlight, heritage, jump-start, pressure, shade, string, reed, track, survival skills, walkabout, aircraft, ambulance, detailed, distance, drugs, first aid, landing, (the) outback, provide
- **g4-u08**: black market, collect, collection, fascination, rare, auction, burn to the ground, copy, execute, furious, judge, librarian, library, monastery, monk, precious, preserve, rob, sentence to death, shorten, addict, addiction, command, go crazy, miss out on sth, pale, turn up, whisper, sheet, confuse sb, kitschy
- **g4-u09**: border, communicate, fashionable, firstly, funeral, health risk, in common, needle, permanent, pierced, rebellious, religious, ceremony, bury, devil, confused, Far East, gesture, greet, index finger, insult, nod the head, palm, pass something on, thumb, victory, zero, decent-looking, embarrassed, giggle, goth, hastily, ignore, sigh, sitting room, scare off, sleeve, possibility, wedding dress, wedding suit, bride, bridegroom, bridesmaid

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Aztecs, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Body, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Broome, Brown, Buckells, Buckingham, Buddy, Bulgaria, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Cooperative, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dracula, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Elizabethan, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Far, Faye, Feeling, Felicity, Fell, Fidel, Fido, Fink, Fleming, Flicka, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Greece, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Iceman, Imagine, Imperatives, Inc, India, Indonesia, Indonesian, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Japanese, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katia, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Lawrence, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malaysia, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Nancy, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Pump, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thailand, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, Workout, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g4u09.w.border` ← v1 `border`: d="The line that separates two countries or regions" · s="We had to show our passports when we crossed the _____ into Italy." · a=["borders"] · mc=["boundary","frontier","limit"]
- `g4u09.w.communicate` ← v1 `communicate`: d="To share information, ideas, or feelings with another person" · s="It's hard to _____ with someone who speaks a completely different language." · a=[] · mc=["negotiate","translate","interact"]
- `g4u09.w.fashionable` ← v1 `fashionable`: d="Popular and considered stylish at a particular time" · s="Those trainers were really _____ last year, but now nobody wears them." · a=[] · mc=["trendy","stylish","modern"]
- `g4u09.w.firstly` ← v1 `firstly`: d="Used to introduce the first point in a list of arguments" · s="There are two reasons I can't come: _____, I have too much homework, and secondly, I'm not feeling well." · a=[] · mc=["finally","secondly","mainly"]
- `g4u09.w.funeral` ← v1 `funeral`: d="A ceremony held after someone has died, where the body is buried or cremated" · s="Many people came to the _____ to say goodbye to the old man." · a=["funerals"] · mc=["burial","wedding","ceremony"]
- `g4u09.w.health-risk` ← v1 `health risk`: d="Something that could be dangerous or harmful to your body" · s="Not wearing a helmet when cycling is a serious _____." · a=["health risks"] · mc=["side effect","safety rule","warning sign"]
- `g4u09.w.in-common` ← v1 `in common`: d="Shared by two or more people or things" · s="We became friends because we have a lot _____." · a=[] · mc=["in general","in public","in particular"]
- `g4u09.w.needle` ← v1 `needle`: d="A thin, sharp piece of metal used for sewing or injections" · s="Be careful with that sewing _____ — it's very sharp!" · a=["needles"] · mc=["pin","hook","blade"]
- `g4u09.w.permanent` ← v1 `permanent`: d="Lasting forever or for a very long time; not temporary" · s="Think carefully before you get a tattoo — it's _____." · a=[] · mc=["temporary","constant","lifelong"]
- `g4u09.w.pierced` ← v1 `pierced`: d="Having a small hole made through a part of the body for wearing jewellery" · s="She got her ears _____ at a shop in the city centre." · a=[] · mc=["tattooed","scarred","decorated"]
- `g4u09.w.rebellious` ← v1 `rebellious`: d="Refusing to obey rules or accept normal behaviour" · s="As a teenager, he was quite _____ and often broke the school rules." · a=[] · mc=["disobedient","stubborn","adventurous"]
- `g4u09.w.religious` ← v1 `religious`: d="Relating to or believing in a religion" · s="Christmas and Easter are important _____ holidays in Austria." · a=[] · mc=["spiritual","traditional","cultural"]
- `g4u09.w.ceremony` ← v1 `ceremony`: d="A formal event held to mark an important occasion" · s="The graduation _____ took place in the school hall last Friday." · a=["ceremonies"] · mc=["celebration","ritual","reception"]
- `g4u09.w.bury` ← v1 `bury`: d="To put a dead body in the ground" · s="In many cultures, people _____ their dead in a cemetery." · a=["buried"] · mc=["cremate","mourn","honour"]
- `g4u09.w.devil` ← v1 `devil`: d="An evil spirit or the most powerful evil being in some religions" · s="In old stories, the _____ often tries to trick people into doing bad things." · a=[] · mc=["angel","ghost","demon"]
- `g4u09.w.confused` ← v1 `confused`: d="Unable to understand something or think clearly about it" · s="The instructions were so complicated that everyone in class was _____." · a=[] · mc=["curious","surprised","puzzled"]
- `g4u09.w.far-east` ← v1 `Far East`: d="The countries of eastern Asia, such as China, Japan, and Korea" · s="Many spices and teas that we use every day originally come from the _____." · a=[] · mc=["Middle East","Near East","Far West"]
- `g4u09.w.gesture` ← v1 `gesture`: d="A movement of your hand or body that expresses a feeling or idea" · s="Waving hello is a friendly _____ that most people understand." · a=["gestures"] · mc=["posture","signal","expression"]
- `g4u09.w.greet` ← v1 `greet`: d="To welcome someone with words or actions when you meet them" · s="In Austria, people often _____ each other with a handshake." · a=[] · mc=["welcome","introduce","farewell"]
- `g4u09.w.index-finger` ← v1 `index finger`: d="The one next to your thumb, used for pointing" · s="She pointed at the map with her _____ to show us where we were." · a=["index fingers"] · mc=["middle finger","ring finger","little finger"]
- `g4u09.w.insult` ← v1 `insult`: d="To say or do something rude that offends someone" · s="Be careful what you say — you don't want to _____ anyone." · a=["insulted"] · mc=["offend","tease","criticise"]
- `g4u09.w.nod-the-head` ← v1 `nod the head`: d="To move up and down to show agreement or understanding" · s="If you agree with me, just _____ and we'll go ahead with the plan." · a=["nod the head","nod your head"] · mc=["shake the head","bow the head","tilt the head"]
- `g4u09.w.palm` ← v1 `palm`: d="The inside part of your hand between your wrist and fingers" · s="He held the small bird carefully in the _____ of his hand." · a=["palms"] · mc=["wrist","fist","fingertip"]
- `g4u09.w.pass-something-on` ← v1 `pass something on`: d="To hand over to another person after you have received it" · s="When you've finished reading this note, please _____ to the next person." · a=["pass something on","pass on","pass it on"] · mc=["hand something in","give something back","throw something away"]
- `g4u09.w.thumb` ← v1 `thumb`: d="The short, thick finger on each hand, set apart from the other four" · s="He gave us a _____ up to show that everything was OK." · a=["thumbs"] · mc=["index finger","wrist","knuckle"]
- `g4u09.w.victory` ← v1 `victory`: d="The act of winning a battle, game, or competition" · s="The team celebrated their _____ with a big party after the match." · a=["victories"] · mc=["triumph","defeat","championship"]
- `g4u09.w.zero` ← v1 `zero`: d="The number 0; nothing" · s="Last winter, the temperature fell below _____ for two whole weeks." · a=[] · mc=["double","dozen","minus"]
- `g4u09.w.decent-looking` ← v1 `decent-looking`: d="Having a pleasant and attractive appearance" · s="She said her date was _____ — not the most handsome person, but pleasant enough." · a=[] · mc=["good-looking","plain-looking","stylish-looking"]
- `g4u09.w.embarrassed` ← v1 `embarrassed`: d="Feeling shy, awkward, or ashamed in front of other people" · s="I tripped and fell in front of the whole class — I was so _____!" · a=[] · mc=["ashamed","awkward","nervous"]
- `g4u09.w.giggle` ← v1 `giggle`: d="To laugh quietly in a nervous or silly way" · s="The children started to _____ when the teacher made a funny mistake." · a=["giggled"] · mc=["chuckle","snicker","grin"]
- `g4u09.w.goth` ← v1 `goth`: d="A person who dresses in black and likes dark music and style" · s="She dresses in all black and listens to dark music — her friends call her a _____." · a=["goths"] · mc=["punk","hipster","emo"]
- `g4u09.w.hastily` ← v1 `hastily`: d="Done quickly and often without enough care" · s="He _____ threw his books into his bag and rushed out because he was already ten minutes late." · a=[] · mc=["slowly","carefully","eagerly"]
- `g4u09.w.ignore` ← v1 `ignore`: d="To deliberately not pay attention to someone or something" · s="I said hello three times, but he chose to _____ me completely." · a=["ignored"] · mc=["avoid","reject","overlook"]
- `g4u09.w.sigh` ← v1 `sigh`: d="To breathe out slowly and audibly, expressing sadness, tiredness, or relief" · s="She looked at the huge pile of homework and began to _____." · a=["sighed"] · mc=["groan","gasp","yawn"]
- `g4u09.w.sitting-room` ← v1 `sitting room`: d="A comfortable space in a house where people relax (British English)" · s="The family gathered in the _____ to watch a film together." · a=["sitting rooms","living room"] · mc=["dining room","bedroom","living room"]
- `g4u09.w.scare-off` ← v1 `scare off`: d="To frighten someone or something so that they go away" · s="The loud noise from the fireworks _____ all the birds in the garden." · a=["scare off","scared off","scare away"] · mc=["chase away","drive out","put off"]
- `g4u09.w.sleeve` ← v1 `sleeve`: d="The part of a piece of clothing that covers your arm" · s="It's hot today — I wish I had a T-shirt with short _____ instead of this jumper." · a=["sleeve","sleeves"] · mc=["collar","pocket","hem"]
- `g4u09.w.possibility` ← v1 `possibility`: d="Something that might happen or be true" · s="There is always the _____ that it might rain, so bring an umbrella." · a=["possibilities"] · mc=["opportunity","probability","ability"]
- `g4u09.w.wedding-dress` ← v1 `wedding dress`: d="The special white gown a bride wears on her big day" · s="She chose a beautiful white _____ with lace and tiny pearls." · a=["wedding dresses","wedding gown"] · mc=["evening gown","bridesmaid dress","prom dress"]
- `g4u09.w.wedding-suit` ← v1 `wedding suit`: d="The formal outfit a groom wears on the big day" · s="The groom looked very handsome in his dark blue _____ as he waited at the altar." · a=["wedding suits"] · mc=["dinner jacket","school uniform","business suit"]
- `g4u09.w.bride` ← v1 `bride`: d="A woman on her wedding day or just before and after it" · s="The _____ looked absolutely stunning as she walked down the aisle." · a=["brides"] · mc=["bridesmaid","bridegroom","maid of honour"]
- `g4u09.w.bridegroom` ← v1 `bridegroom`: d="A man on his wedding day or just before and after it" · s="The nervous _____ waited at the altar for his future wife." · a=["groom","bridegrooms"] · mc=["best man","bride","groomsman"]
- `g4u09.w.bridesmaid` ← v1 `bridesmaid`: d="A girl or woman who helps the bride at her wedding" · s="She asked her best friend to be her _____ at the wedding." · a=["bridesmaids"] · mc=["maid of honour","flower girl","bride"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 4 SB Unit 9.txt -----
Unit 9 Body talk
Pages 74–75
You learn
 ☑ about the history of body modifications
 ☑ about body language around the world
 ☑ how to use might/may/could for possibility
You can
 ☑ talk about your appearance
 ☑ talk about your culture
 ☑ write an ending to a story
1 🔊
 a Look at the text for a minute. Then write down the names of the countries in it.
 b Read the text and check your answer to task a.
A SHORT HISTORY OF Body art
The trendy Iceman
 What does Ötzi (the mummy found in 1991 near the Austrian-Italian border) have in common with people who want to be trendy? Body piercing! The “Iceman” from about more than 5,000 years ago had pierced ears!
Piercing in the ancient world
 In the ancient world, body piercing was a symbol of courage, religion and class. That’s why it was popular with the Pharaohs in Egypt and with soldiers and gladiators in ancient Rome. The oldest mummy found in Egypt had ear piercing is over 5,000 years old. Tongue piercing was part of religious ritual of the high priests of the Aztecs. They believed that when tongues were pierced, they could communicate better with the gods.
Piercing in Africa and Central America
 In these areas, people believed that demons could enter the body through the ears. So they pierced their ears and put ornaments in.
 They thought that the metal would stop demons from getting into the body.
Piercing in the time of Queen Elizabeth I
 In Elizabethan England, a lot of famous men like Shakespeare, Sir Walter Raleigh and Sir Francis Drake had gold or silver earrings in their ears. It showed their wealth. In those days, sailors wore earrings, too, for two reasons: firstly, they thought people could see better if their ears were pierced and secondly, they thought, “If our ship sinks and we die, and our dead bodies are found on the beach, the gold earring will pay for our funeral.”
Piercing today
 It was in the 1960s that body piercing became popular in Western cultures. It became so popular that people began to travel to India and nose piercings became popular. In the United States in the 1990s, body piercing became a form of rebellion for young people. Then it lost its rebellious meaning, and just became fashionable.
Tattoos
 Tattoos, another popular form of body art, also have a long history. The Ötzi Iceman is also the oldest man discovered in Europe with tattooed skin.
 The word tattoo comes from the Tahitian “tatau”, which means to mark something. It was introduced to the English language in the 18th century by the explorer Captain James Cook.
 In 1769, he wrote in his ship’s log book that the men and women of Tahiti painted their bodies. He also noted that it was called “tattoo” in their language. The sailors with him liked the word and the sound that it was new and different. So tattooing became a painful operation and was done once in their lifetime. Ötzi’s science officer, Joseph Banks, discovered England with a tattoo. Many of the men in his class came back with tattoos.
 Tattooing also became more popular with sailors in Europe. However, many European kings such as George V of England, King Alfonso XIII of Spain, Kaiser Wilhelm II and Tsar Nicholas II of Russia also had tattoos.
VOCABULARY
 courage – Mut, Tapferkeit
🔹 Did you know … ?
 Body piercing and tattooing can be a serious health risk. Every year a large number of people get infections and other illnesses (even hepatitis!) when needles that are not sterile are used for piercing. In Austria nobody can have a tattoo under the age of 16. Young people from ages 16 to 18 need their parents’ written consent. Doctors say that tattoos might create health problems later on in life.
2
 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Choose the correct answer.
 1 Ötzi, the Iceman, was found in
 □ Egypt. □ South America. □ Europe.
 2 He had his … pierced.
 □ ears □ tongue □ lips
 3 In ancient Egypt, piercing showed that you were
 □ poor. □ brave. □ unhappy.
Complete the sentences with words from the box. There are 4 extra words.
 marriage intelligent religious rich teach Asia Africa
4 The Aztecs performed tongue piercings as a part of a ………………………………… ceremony.
 5 In ………………………………… , people pierced their ears to keep bad spirits out.
 6 Having a pierced ear in Elizabethan England showed that you were ………………………………… .
Answer the questions.
 7 In 1960s America, how did young people rebel? ......................................................
 8 How was the word tattoo introduced into the English language? ......................................................
 9 What do you think has the tattoo become today? ......................................................
3
 Find words in the text that mean:
 1 very fashionable
 2 very old / from a long time ago
 3 devils
 4 a ceremony when a dead body is buried or burned
 5 a journal where the captain records the daily activity on a ship
 6 staying forever
4
 Free flow
 Work in pairs. One of you will play the role of a teenager (A), the other one the role of a parent (B). Take 1 minute to prepare your discussion. Use the prompt cards to help you. Talk for 4–5 minutes.
Prompt Card A
 You are 14 and want to have your nose pierced. Your parents are very strict. You don’t want a fight, but you want to discuss the situation with your parents and hope they will give you permission.
 You start the discussion – you can use the following arguments if you want to:
 • body piercing isn’t new (Give examples.)
 • you think it looks good (Some stars have it, too.)
 • you are 14 – you want to decide for yourself
 • your friends have done it
 • you will pay for it with your pocket money
Prompt Card B
 You are a strict parent and are absolutely against body piercing. Your son/daughter wants to talk with you about getting their nose pierced. You are very worried about this, but you want to talk about the situation.
Your son/daughter starts the discussion. You can use the following arguments if you want to:
 • you aren’t interested in hearing how old body piercing is
 • you think body piercing looks awful
 • 14-year-olds can’t decide for themselves – their parents have to
 • you don’t care what your son’s/daughter’s friends do
 • piercing can be a health risk
Pages 76–77
5 Look at the photos.
 a Work in pairs. Choose three of the photos. Create a short story to explain what happens in each of them.
Example: Photo 2 shows a girl. She’s 16 and Japanese, her name is Aki. She’s going to a shopping centre with one of her friends. She’s happy, this is why she’s smiling. Her friend has taken the photo on her mobile.
b Compare your stories in class.
Image note:
Photo 1 shows two people (one male, one female) in a library; the boy is pointing at a book.
Photo 2 shows a smiling girl with long dark hair in front of a white background.
Photo 3 shows a girl with curly red hair making a V-sign with her fingers.
Photo 4 shows a girl smiling and making a V-sign with her hand.
Photo 5 shows a boy and a girl sitting on a park bench.
Photo 6 shows a person lying on a hammock with their bare feet up.
Photo 7 shows a smiling man holding up his hand in an "OK" gesture.
Note
 index finger → thumb
 palm
In the Middle and Far East, it is not polite to point out with your index finger. You should only point with an open hand (or your thumb in Indonesia), never with your index finger.
If you show the soles of your feet or shoes in Thailand, people could think you want to insult them. The soles are the lowest part of the body, so people think they ...
Do you smile when you want to greet someone in a friendly way? In some cultures people don’t smile in this situation and in others people smile for different reasons. The Japanese, for example, may smile when they .................. or angry.
The “V” sign means victory in many cultures. But if the palm of your hand .................. towards your face, it is a rude sign in some cultures and might insult people.
In countries of the Middle and Far East, you should never pass something to another person with your left hand. People think the left hand is .................. . In Japan, always use both hands to pass something on.
In many countries of the world, this gesture means “OK”. But it could get you into trouble in some countries. In Brazil, for example, the sign is .................. . In Japan, by the way, it means “money”, and in France, it means “zero” or “worthless”.
Every culture has a “comfort zone” for personal space when people talk to one another. For Western Europeans and Americans, a distance between people of 35 – 50 cm .................. . In the UK, people prefer a little more distance (60 cm), in Japan, even more (90 cm). People in the Middle East may feel strange if the person they’re talking to keeps so far away; they prefer smaller distances of 20 – 25 cm.
Do you think nodding your head up and down means “yes” all over the world? You might be surprised if you go to Greece or Bulgaria. In those countries, nodding means “no”!
VOCABULARY: insult = beleidigen
6 Read the texts. For each one say which of the photos it goes with.
 (One text doesn’t have a photo!)
b Put the missing expressions in the text.
are dirty  is comfortable
 is very rude  are confused  is turned  is unclean
c Discuss with a partner. Which countries might you have the most problems in? Explain why.
 Japan would be difficult because there are so many things to remember.
Get talking
7 Read the questions. Take a few minutes to think about them.
 Make notes of your thoughts. Then discuss your answers in groups or with the whole class.
1 Which countries have you been to?
 2 How many people from different cultures have you met?
 3 What things are the same in other cultures as in your own? (food, family life, school life, sports, ...)
 4 What things are different?
I know a family who moved to Austria from ... They ...
 One of our neighbours is from ... . He/She ...
I’ve been to ...
 A few years ago I went to ...
 My mum/dad/sister/brother/ friend went on a trip to ...
 He/She told me that there ... / people don’t ...
Pages 78–79
Vocabulary Weddings
 8 Look at the picture.
 Where can you see …
a a bride?
 b a wedding dress?
 c a bridegroom?
 d a wedding suit?
 e a bridesmaid?
The bride is number …
Image description: A wedding photo with five people standing in a garden.
 1 – A young man in a black suit.
 2 – A girl in a purple bridesmaid dress holding a bouquet.
 3 – A young man, smiling, in a black wedding suit with a purple ribbon.
 4 – A young woman in a bridesmaid dress.
 5 – A girl in a white wedding dress smiling and holding a bouquet (the bride).
9 a Look at the girl in the picture below. Would you like to be her friend? Why / Why not?
b Read the story and choose the best title for it.
☐ They both giggled
 ☐ A goth bridesmaid
 ☐ The spider’s web
 ☐ It must be her age
Image description: A teenage girl with pale skin, dark makeup, black lipstick, and a serious expression. She is wearing dark clothes in goth style.
When Mum and I came into the sitting room, Aunt Nancy sighed and Uncle Jack looked at me and shouted, “Look, it’s Dracula’s daughter!” and then he laughed like mad.
I ignored them and walked across their horrible orange carpet to the sofa. From there I could see myself in the mirror.
 I looked cool.
 I looked goth.
 Black clothes, fishnet stockings, heavy boots. White face, black eyeliner, black lipstick. Totally, totally goth.
 They all looked at me. Mum said, “It’s her age, you know. It’s a phase.” Aunt Nancy smiled sadly and Uncle Jack said, “Does it speak?” “Ha-ha!” I said. “Yes, I can hear and speak.” “Good,” he said, “because with all that black stuff round your eyes, you probably can’t see.” He looked at Mum and his wife for some applause and they both giggled.
 “I hope she doesn’t look like that on the wedding day.” Aunt Nancy said. “Joy wouldn’t want her to look like that.” “Oh no,” Mum said quickly. “She’ll wear the dress Joy bought for her. Won’t you, Felicity?” “Mum, please!” I said. “Sorry, Flicka – as she likes to be called now,” Mum said to Aunt Nancy. “And what’s that on its neck?” Uncle Jack shouted. “A tattoo,” I said. “A tattoo of a spider’s web.” “Not a real one!” Mum said hastily again. “It’s a wash-off one.” “Wash-off, eh?” my uncle said.
 I ignored him because I was embarrassed. I would have liked a real tattoo and not my wash-off one, so I didn’t say anything for the rest of the evening.
 The dress Joy gave me was terrible. All violet and white and cute. But I’ve always liked my cousin Joy. “I know I’m asking a lot, but I really want you to wear it for the wedding,” Joy said. “You’re my bridesmaid and I want everything to be just right.”
 On the day of the wedding, I felt terrible. But Joy looked really happy, so I tried to smile, too. Everyone was wearing suits and flowery dresses – and then I saw a decent-looking boy. He had a suit and short hair, but he didn’t look bad. Not bad at all.
 A few minutes later he walked over to me. “Cousin of the bride?” he said. “Yes,” I said. “And who are you?” “I’m Lawrence. Cousin of the bridegroom.”
B1S1
 10 Read the story again. Write letters for the people’s names next to the sentences.
Mum = M  Uncle Jack = U
 Felicity = F  Joy = J
 Aunt Nancy = A  Lawrence = L
Which of the people in the story:
 1 was a goth? .............................................................
 2 called Felicity “Dracula’s daughter”? .............................................................
 3 found Uncle Jack’s jokes funny? .............................................................
 4 didn’t find Uncle Jack’s jokes funny at all? .............................................................
 5 had a wedding? .............................................................
 6 was the bridesmaid? .............................................................
 7 bought a dress for Felicity? .............................................................
 8 wanted to be called Flicka? .............................................................
 9 had a tattoo that could be washed off? .............................................................
 10 wasn’t very happy on the day of the wedding? .............................................................
 11 was the cousin of Joy’s future husband? .............................................................
 12 thought Lawrence was good-looking? .............................................................
Free flow
 11
 a In pairs, do the following: Choose one question and tell your partner all you can think of. Talk as long as you can. Your partner times you.
1 Would you ever consider getting your nose pierced? Why / Why not?
 2 Would you ever consider getting a tattoo? Why / Why not?
 3 Would you like to have a school uniform? Why / Why not?
 4 How much do you care about what you look like? Why / Why not?
b Tell your partner which of his/her ideas you found most interesting and why. Tell your partner how long he/she was talking.
Pages 80–81
12 CHOICES
 Writing for your Portfolio
A Imagine you’ve just got a nose stud.
 Write a message about it to your best friend (40–70 words) and explain:
 • why you decided on a nose stud
 • how the piercing went
 • what your parents said before and after the piercing
B Write an ending for Felicity’s story on pp. 78/79. Use the questions to help you and write about 120–180 words. Take about 20 minutes. Do not forget to use paragraphs!
Did Lawrence like Felicity?
Did Felicity like Lawrence?
Did Felicity wear the violet and white dress all evening?
What was a big surprise for Felicity?
How did Uncle Jack react to that?
What happened with Felicity and Lawrence in the end?
13 🎧 Listen to the ending of the story. Then answer the questions in 12 B.
GRAMMAR
 might / may / could
 (possibility)
Circle the correct words:
 Wenn du über Möglichkeiten / Sicherheiten sprechen willst, kannst du die Modalverben might / may / could verwenden.
If you go to Greece or Bulgaria, you might be surprised.
It is a rude sign in some cultures and might insult people.
 Japanese people may smile when they are confused or angry.
 These questions may help you.
It could get you into trouble in some countries.
Nach einem Modalverb kommt immer die Nennform / -ing-Form.
There are also other ways of talking about possibility:
 There is a chance that a smile could get you into trouble.
You use likelihood + of + gerund:
 The likelihood of insulting someone is quite high.
You use likely + to + infinitive:
 You are likely to offend the Japanese if you blow your nose into a handkerchief.
 She’s not likely to win, if she doesn’t practise more.
Cartoon image description: Two boys are standing on a beach looking at a pair of seagulls. One boy says, “They might not be hungry!”
The Mag 5 A visitor abroad
1 🎥 Watch the story. Circle the correct words.
 1 Katia is Jessica’s / Lucy’s penfriend.
 2 Katia’s mum / dad is from Hungary.
 3 The headmaster didn’t like Katia’s shoes / boots.
 4 Lucy wants / doesn’t want to do a story on school uniforms.
 5 Most people at the school are / aren’t in favour of school uniforms.
 6 Nick / Liam wants to take photos of Katia.
2 Complete the sentences.
 1 Nick speaks slowly to Katia because …
 2 Katia speaks perfect English because …
 3 The headmaster objects* to Katia’s shoes because …
 4 Lucy doesn’t want to do an article on school uniforms because …
 5 Nick wants to take photos of Katia because …
*VOCABULARY: object = ablehnen
Everyday English
 3 Complete with the missing phrases. Then practise the dialogues.
 That’s settled  I’ll see what I can do  Pleased to meet you  Don’t mention it
1
 Man: Oh yes, Mrs Butler told me about you.
 Girl: “...................., Katia.”
 Image: Katia shaking hands with a smiling man behind a desk.
2
 Girl: It’s very kind of you to have me here. Thank you.
 Man: ?
 Girl: It’s our pleasure.
 Image: Katia and the man continuing the conversation.
3
 Man: They weren’t really made for schools, were they? So maybe you can find another pair of shoes. Can you do that?
 Girl: Well, “...................”
 Image: Katia nodding and smiling in reply.
4
 Man: I’ll ask Jessica. She might be the same size as me.
 Girl: “...................”
 Image: The man smiling confidently, arms on the table.


----- WB: More 4 WB Unit 9.txt -----
UNIT 9 Body talk
Pages 68–69
Reading
1 Read the notice and decide if each statement is true or false.
Gym classes
 Want to get in shape for the summer holidays? We’re running a series of weekday courses at a discount price to help you get your body looking its best.
12 weeks courses run from April 1st through to July 1st.
 Holiday break during week starting Mon, May 14th.
Class	Level	Days	Time	Venue	Cost (per person)
Mind and Body	Beginners (adults)	Mondays, Wednesdays	4 – 5 p.m.	Main sports hall	£120
Spin	Intermediate (adults)	Thursdays, Fridays	4 – 5 p.m.	Main sports hall	£120
Body Pump	Advanced (adults)	Mondays, Thursdays	6 – 7.30 p.m.	Main sports hall	£150
Aqua Workout	Mixed (adults)	All days except Mondays	3.30 – 5 p.m.	Swimming pool	£150
Teen Workout	12 – 18 year olds (mixed)	Mondays, Wednesdays, Fridays	4.30 – 6 p.m.	Small sports hall	£60

1 The courses run for 12 weeks. ☐ True ☐ False
 2 The longest classes are 90 minutes. ☐ True ☐ False
 3 Body Pump starts in the main gym straight after Spin on a Thursday. ☐ True ☐ False
 4 None of these classes are available at the weekend. ☐ True ☐ False
 5 There is no water-based activity for children. ☐ True ☐ False
2 Now search the notice in 1 for the following information and write down the answer in the space.
1 Week when there are no lessons: .................................................................
 2 Day of the week when there are most classes: .................................................................
Listening
3 Listen to the radio programme and write the names of the countries under the correct pictures. Choose from China, Japan, Thailand, Indonesia and India. There are two extra choices.
Image 1: Cartoon of a person saying “selamat” with palms together in greeting.
 Image 2: Cartoon of a person with hands pressed together at the chest, bowing slightly.
 Image 3: Cartoon of a smiling person bowing politely with hands folded.
1 .................................................................
 2 .................................................................
 3 .................................................................
4 Listen again and answer the questions.
1 What does June do for her job?
 ………………………………………………………………………………………………………………
 2 Why is it important for people to know about other cultures?
 ………………………………………………………………………………………………………………
 3 How do you say hello to an older person in China?
 ………………………………………………………………………………………………………………
 4 How can you avoid confusion when greeting an old or young person in China?
 ………………………………………………………………………………………………………………
 5 When does the presenter’s wife use a ‘namaste’?
 ………………………………………………………………………………………………………………
6 What does ‘selamat’ mean?
 ………………………………………………………………………………………………………………
Pages 70–71
Grammar might / may / could (possibility)
5 Complete the sentences with the words in the box.
could hit
 may need
 might explode
 may bite
 could miss
 might win
Image 1: A boy pointing at a large red button.
 1 Don’t touch it! It ........................................ .
 Image 2: A boy kneeling in front of a broken water pipe.
 2 What are you doing? It ........................................ .
 Image 3: A zookeeper in front of a snake enclosure.
 3 Don’t worry! He ........................................ .
 Image 4: A child walking near a swinging door.
 4 Be careful. You ........................................ your head.
 Image 5: A man playing a slot machine.
 5 Think positive. We ........................................ a lot of money.
 Image 6: A woman looking in the mirror holding an umbrella.
 6 Don’t forget the umbrella. We ........................................ it.
6 Look at the words below. What languages are they from?
(Each word is followed by a checkbox)
☐ 平和
 ☐ Ειρήνη
 ☐ שלום
 ☐ Friede
 ☐ Paz
 ☐ سلام
VOCABULARY
 Hebrew – Hebräisch
 Arabic – Arabisch
Number 4 is German.
 Now try and guess the others.
 Number 1 might be Chinese or it may be Japanese. I’m not sure.
7 Rewrite the sentences so they sound more natural. Use the words in brackets.
1 Ask Joe. It’s possible he knows the answer. (may)
 Ask Joe. He may know the answer.
2 I’m not sure. It’s possibly a problem with your internet provider. (might)
 .........................................................................................................................
3 Don’t stroke the dog. It’s possible it bites. (could)
 .........................................................................................................................
4 She’s very upset. It’s possible she’ll start crying. (may)
 .........................................................................................................................
5 It’s possibly the best film I’ve ever seen. (might)
 .........................................................................................................................
Grammar Other ways of talking about possibility
8 Put the words in order to make sentences for each picture.
Image 1: A man and woman in the rain with no umbrella.
 1 this / likely / ride / You’re / wet / get / to / on
 .........................................................................................................................
Image 2: A man in a car, stuck in traffic, looking at his watch.
 2 a / might / late / chance / I / be / There’s
 .........................................................................................................................
Image 3: A man pointing to a weather chart with snow symbols.
 3 of / high / snow / this / weekend / likelihood / The / is
 .........................................................................................................................
Image 4: Two children looking at the stars out the window.
 4 tonight / likely / to / We’re / get / not / sleep / much
 .........................................................................................................................
9 Rewrite the sentences using the new beginnings.
1 I might get in the school football team this year.
 There’s a ....................................................................................................
2 The likelihood of me passing the test is low.
 I might .......................................................................................................
3 You’re likely to have an accident if you climb up there.
 You could .................................................................................................
4 You probably won’t have time to finish everything.
 You’re not ...............................................................................................
5 I don’t think I’ll get married before 30.
 The likelihood .........................................................................................
6 You might see Tom if you go to the park today.
 You’re .......................................................................................................
10 Complete the sentences with predictions about your life.
Today
 1 There’s a chance ...................................................................................
 2 It’s not likely that ..................................................................................
This week
 3 The likelihood of ..................................................................................
 4 It’s likely ................................................................................................
This year
 5 It’s not likely that ..................................................................................
 6 The likelihood of ..................................................................................
By the time I’m 30
 7 It’s likely ...............................................................................................
 8 There’s a chance ..................................................................................
Pages 72–73
11 Find the words and phrases in the word snake.
[Word snake reads: Trendyancientimitatefermanen†flogbookdemonssfuneral]
 Words hidden include: trendy, ancient, imitate, permanent, logbook, demons, funeral
12 Use the words from 11 to complete the sentences. You might have to change the form.
1 Your coat is .................................................. . You’ve had it for years. It’s time to buy a new one.
 2 There were hundreds of people at my granddad’s .................................................. . I never knew he was so popular.
 3 Julia always .................................................. everything I do. I find it really annoying.
 4 People used to think sick people had .................................................. inside their heads.
 5 He always buys the latest fashions. He’s very .................................................. .
 6 The whole story of the journey was written down in the captain’s .................................................. .
 7 You know if you have a tattoo it’s .................................................. . You can never take it off.
13 Complete the poem with the words in the box.
 wedding suit
 dress
 bride
 bridesmaids
 groom
What do you need for a wedding?
The first thing you need is a beautiful ............................
 Sparkling in white, eyes open wide.
 Heads will turn as she walks in the room
 And walks down the church to meet with her ............................ .
 Him standing there in his best ............................
 Trying not to look, he knows she’ll look cute.
 ............................ follow her holding her ............................
 Keep it off the ground, we don’t want a mess.
 But most of all the thing that they want
 Is that special first kiss in front of the font*.
*VOCABULARY: font – hier: Brunnen
14 Now label the picture with the words from 13.
Image description: A cartoon of a wedding scene showing a group of people around the bride and groom. Labels are to be placed on five individuals or elements.
1 ..................................................
 2 ..................................................
 3 ..................................................
 4 ..................................................
 5 ..................................................
Everyday English A visitor abroad
DVD
 Look at the phrases in the box. Use them to complete the dialogues.
[Phrases in the box: Pleased to meet you / Don’t mention it / I’ll see what I can do / That’s settled]
1
 Joanne: James, this is Carol.
 James: Oh, hi, Carol. .................................................. I’m so glad you could come.
 Joanne: Thanks, James.
2
 Tom: My new laptop’s broken.
 Sandra: What’s the problem?
 Tom: Well, if only I knew! Each time I switch it on I hear the start-up jingle, but the screen stays just black.
 Sandra: Give me two minutes. .................................................. (Goes off)
 (Two minutes later)
 Sandra: ..................................................
 James: What do you mean?
 Sandra: Well, my brother is a genius when it comes to computers. If he can’t fix it, nobody can. He’ll be here in half an hour.
 James: Oh, really? Thanks so much!
 Sandra: .............................................. !
Developing writing skills Description (of a person)
15 Read the task and what a student wrote. When does Sarah get really angry?
Task
 Write a brief description of a friend (120–180 words).
 Write about:
 • what your friend looks like (give details)
 • what he/she is fond of
 • what his/her favourite clothes are
 • if he/she has a particular habit
 • what his/her character is like
 • what he/she is like as a friend
In a word, my best friend Sarah is gorgeous! Sarah is fairly tall (170 cm, I believe) and she’s rather skinny but in a good way. She’s very pale even in summer and she’s got long curly red hair. When she talks to somebody she often twirls a lock of her hair around her finger. Her eyes are emerald green, and she’s got a pretty, small mouth, small ears and a straight nose.
 Sarah loves rings and bracelets, so she never goes out without them. Her favourite clothes are jeans, T-shirts and sweaters – always in red or green. She’s casual but always looks nice.
 Sarah is a friendly and lively person. Most of the time she’s very cheerful and she smiles a lot, but sometimes she can get really furious, especially when someone breaks her badly. Then she explodes.
 All in all, however, Sarah is not only beautiful, she’s smart, helpful and a really great friend who’s always there for me.
VOCABULARY: twirl – zwirbeln, herumwickeln
Pages 74–75
16 Read the text again and make notes in these categories.
Appearance	Personality
[empty boxes for student answers]	

17 Find these adjectives in the text. Are they used to describe appearance or personality?
stunning curly skinny gorgeous lively cheerful
 casual pale friendly smart helpful beautiful
18 Think of five more adjectives for each category.
Writing tip:
 The main areas to concentrate on when describing a person are their appearance and personality. This is a chance to use a good selection of vocabulary, especially adjectives. Use one paragraph to describe each area and add some of their habits to the description. For example, in the text on p. 73, the writer describes Sarah’s hair and then mentions her habit of twirling it around her finger when she talks to people.
 When talking about appearance, avoid sensitive* issues. Keep in mind that you should be able to read your description out to the person described without causing a fight or upsetting them.
 *VOCABULARY: sensitive – hier: heikel
19 Now write your own answer to the following task.
Task
 Write a description of yourself (120–180 words). Carefully think about what information you want to include.
 Write about:
 • your appearance
 • your habits
 • your typical character features
 • your emotions in general
 • how you relate to other people
 • how you see yourself in one sentence (to finish off the description)
WORD FILE
 A wedding
 • wedding dress
 • wedding suit
 • bride
 • bridegroom
 • bridesmaid
[Image of a cartoon wedding ceremony, showing bride, groom, bridesmaids and guests]
MORE Words and Phrases
	English word or phrase	Example sentence	German
1	border	He grew up in Malaysia, near the Indonesian border.	Grenze
2	communicate	Humans communicate with language.	kommunizieren
3	fashionable	Today piercing has become very fashionable.	in Mode, modisch
4	firstly	Why do you wear a stud? – Well, firstly, I think it looks good!	erstens
5	funeral	Our neighbour died yesterday. The funeral is on Friday.	Begräbnis
6	health risk	Eating too much fast food can be a health risk.	Gesundheitsrisiko
7	in common	The two sisters had nothing in common.	gemein, gemeinsam
8	needle	The needle makes a hole in your ear for the earring.	Nadel
9	permanent	The accident has not done any permanent damage.	dauerhaft, endgültig
10	pierced	When your ear is pierced, you can wear an earring.	durchstochen, gepierct
11	rebellious	She didn’t like school, she has a rebellious nature.	rebellisch
12	religious	If you are religious, you try to go to church regularly.	religiös
13	ceremony	During the opening ceremony the stadium was full.	Zeremonie
14	bury	The pirates buried the treasure on a small island.	begraben
15	devil	A devil is another name for an evil spirit.	Teufel
16	confused	I’m a little confused. Can you explain that again, please?	verwirrt
17	Far East	Japan and China are in the Far East.	Ferner Osten
18	gesture	A gesture with your hand can mean different things in different countries.	Geste
19	greet	When we greet people, we say “Hi” or “Hello”.	begrüßen
20	index finger	Your index finger is the finger that is next to your thumb.	Zeigefinger
21	insult	I think I insulted him when I said he was overweight.	beleidigen
22	nod the head	I can’t hear you. Nod your head if you agree.	mit dem Kopf nicken
23	palm	The palm is the area on the inside of your hand.	Handfläche
24	pass something on	Please pass my message on to your sister.	etwas weitergeben
25	thumb	On each hand you have four fingers and a thumb.	Daumen
26	victory	We won 3 – 0. It was a great victory!	Sieg
27	zero	It was very cold. The temperature dropped to zero.	null

	More expressions	Example sentence	German
28	decent-looking	He’s not too cute, but he’s a decent-looking boy.	gut aussehend
29	embarrassed	I didn’t have enough money to pay the bill. I felt very embarrassed.	verlegen
30	giggle	He looked so funny that the girls giggled when they saw him.	kichern
31	goth	Everything she wears is black. She must be a goth.	Grufti
32	hastily	Take more time. Don’t do things hastily.	hastig
33	ignore	She didn’t even look at me at the party. She just ignored me.	ignorieren
34	sigh	“This film is really boring,” she sighed.	seufzen
35	sitting room	Let’s have tea in the sitting room.	Wohnzimmer
36	scare off	The cat has disappeared. The dogs scared it off.	verschrecken
37	sleeve	Do you like shirts with long or short sleeves?	Ärmel
38	possibility	Is there a possibility that you might not come to my party?	Möglichkeit

```

## Output contract

Write `content/corpus/units/g4-u09/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g4-u09",
  "briefBank": "7b87ba493528",
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
