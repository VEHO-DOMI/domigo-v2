# Vocab generation brief — g2-u13 (MORE! 2, Unit 13)

<!-- domigo:gen vocab g2-u13 bank=5a9152db8a34 prompt=346902f9f0f1 -->

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
| g2u13.w.snowy | snowy | schneereich ; verschneit | wordfile | Weather Forecast | — | — | snowy |
| g2u13.w.thunderstorm | thunderstorm | Gewitter | wordfile | Weather Forecast | — | — | thunderstorm |
| g2u13.w.cloudy | cloudy | bewölkt | wordfile | Weather Forecast | — | — | cloudy |
| g2u13.w.windy | windy | windig | wordfile | Weather Forecast | — | — | windy |
| g2u13.w.rainy | rainy | regnerisch | wordfile | Weather Forecast | — | — | rainy |
| g2u13.w.sunny | sunny | sonnig | wordfile | Weather Forecast | — | — | sunny |
| g2u13.w.foggy | foggy | neblig | wordfile | Weather Forecast | — | — | foggy |
| g2u13.w.hot | hot | heiß | wordfile | Weather Forecast | — | — | hot |
| g2u13.w.cold | cold | kalt | wordfile | Weather Forecast | — | — | cold |
| g2u13.w.weather-presenter-meteorologist | weather presenter / meteorologist | Wettermoderator/in / Meteorologe/Meteorologin | wordfile | Weather Forecast | — | — | weather presenter / meteorologist ; weather presenter ; meteorologist |
| g2u13.w.coast | coast | Küste | phrase | — | It's nice and dry at the coast. | — | coast |
| g2u13.w.to-continue | to continue | andauern ; weitergehen | phrase | — | The rain will continue until tomorrow. | continue | to continue ; continue |
| g2u13.w.cool | cool | kühl | phrase | — | It's warm during the day, but quite cool at night. | — | cool |
| g2u13.w.degree | degree | Grad (°) | phrase | — | It will be 104 degrees Fahrenheit in San Diego. | — | degree |
| g2u13.w.dry | dry | trocken | phrase | — | We had very dry weather for our holidays last year. | — | dry |
| g2u13.w.formula | formula | Formel | phrase | — | The formula is (°F - 32) : 1.8. | — | formula |
| g2u13.w.to-give-way | to give way | ausweichen ; Platz machen | phrase | — | Rain in the morning will give way to sun later on. | give way | to give way ; give way |
| g2u13.w.scale | scale | Skala ; Maßstab | phrase | — | On a scale from 1 to 10: How good was your day? | — | scale |
| g2u13.w.sunshine | sunshine | Sonnenschein | phrase | — | There will be lots of sunshine tomorrow. Perfect weather for a picnic. | — | sunshine |
| g2u13.w.temperature | temperature | Temperatur | phrase | — | The highest temperature ever recorded in the USA was 134°F. | — | temperature |
| g2u13.w.to-clear-up | to clear up | aufheitern | phrase | — | The bad weather will clear up by this evening. | clear up | to clear up ; clear up |
| g2u13.w.fog | fog | Nebel | phrase | — | Heavy fog in the South will clear up later. | — | fog |
| g2u13.w.forecast | forecast | Vorhersage | phrase | — | The forecast is very good for tomorrow. | — | forecast |
| g2u13.w.hope | hope | Hoffnung | phrase | — | Don't give up. There's still hope! | — | hope |
| g2u13.w.outlook | outlook | Aussicht ; Ausblick | phrase | — | The outlook for the weekend is warm and sunny. | — | outlook |
| g2u13.w.small-talk | small talk | Small Talk ; Plauderei | phrase | — | There's lots of small talk about the weather. | — | small talk |
| g2u13.w.thick | thick | dicht ; dick | phrase | — | Watch out! There's thick fog here. | — | thick |
| g2u13.w.towards | towards | in Richtung ; auf ... zu | phrase | — | It will be sunny towards the end of the week. | — | towards |
| g2u13.w.have-a-nice-day | Have a nice day! | Einen schönen Tag noch! | phrase | — | Have a nice day! | — | Have a nice day! |
| g2u13.w.to-make-sure | to make sure | sich versichern ; darauf achten | phrase | — | Make sure you take your umbrella! It's raining. | make sure | to make sure ; make sure |
| g2u13.w.to-rise | to rise | (an-)steigen | phrase | — | The temperatures will rise to 20°C. | rise | to rise ; rise |
| g2u13.w.axe | axe | Axt | phrase | — | The old man put down his axe. | — | axe |
| g2u13.w.bright | bright | hell | phrase | — | There was a bright flash of light. | — | bright |
| g2u13.w.flash-of-light | flash of light | Lichtblitz | phrase | — | Suddenly, there was a flash of light in the sky. | — | flash of light |
| g2u13.w.to-shine | to shine | scheinen | phrase | — | I'll shine my light all over the world. | shine | to shine ; shine |
| g2u13.w.average | average | durchschnittlich | phrase | — | The average rainfall in Death Valley is 2 inches. | — | average |
| g2u13.w.below | below | unter(-halb) ; unten | phrase | — | The temperature will be below 0°C tomorrow. | — | below |
| g2u13.w.generally | generally | im Allgemeinen | phrase | — | Death Valley is generally sunny, dry and clear. | — | generally |
| g2u13.w.inch | inch (pl inches) | Zoll | phrase | — | One inch is 2.54 centimetres. | — | inch ; inches |
| g2u13.w.mild | mild | mild | phrase | — | In Death Valley, the winters are mild. | — | mild |
| g2u13.w.mile | mile | Meile (= 1,6 Kilometer) | phrase | — | Seathwaite is one mile away from Seatoller. | — | mile |
| g2u13.w.rainfall | rainfall | Niederschlag | phrase | — | The average rainfall each year is 120 inches. | — | rainfall |
| g2u13.w.to-record | to record | aufzeichnen | phrase | — | It was the lowest temperature ever recorded. | record | to record ; record |
| g2u13.w.sea-level | sea level | Meeresspiegel | phrase | — | Death Valley is 282 feet below sea level. | — | sea level |
| g2u13.w.throughout-the-year | throughout the year | das ganze Jahr (über) | phrase | — | It's usually sunny throughout the year. | — | throughout the year |
| g2u13.w.western | western | westlich | phrase | — | Death Valley is the lowest point in the western world. | — | western |
| g2u13.w.wet | wet | nass | phrase | — | All my clothes are wet because of the rain. | — | wet |
| g2u13.w.heavy-rain | heavy rain | starker Regen | phrase | — | It got colder and then the heavy rain came. | — | heavy rain |
| g2u13.w.tan | tan | (Sonnen-)Bräune | phrase | — | Where did you go on holiday? You have a great tan. | — | tan |
| g2u13.w.binoculars | binoculars | Fernglas | phrase | — | I can watch birds from far away with my binoculars. | — | binoculars |
| g2u13.w.career | career | Karriere | phrase | — | She started her career as a meteorologist in 2015. | — | career |
| g2u13.w.to-earn | to earn | (Geld) verdienen | phrase | — | Most people don't earn money with their hobby. | earn | to earn ; earn |
| g2u13.w.to-be-mad-about-sth | to be mad about sth. | für etw. schwärmen | phrase | — | My dad's mad about birdwatching. | be mad about sth. | to be mad about sth. ; be mad about sth. |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Aryan, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Celsius, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Column, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Death, Debbie, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, Fahrenheit, False, Faye, Feeling, Fido, Food, France, Frank, Fred, Freddy, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Ms, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salma, Salzburg, Sam, Samuel, San, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Stoke, Sue, Sunborn, Susan, Suzy, Tag, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u13.w.snowy` ← v1 `snowy`: d="When there is a lot of white frozen water on the ground" · s="It was a cold, _____ day and the children played outside." · a=["snowier","snowiest"] · mc=["icy","frosty","rainy"]
- `g2u13.w.thunderstorm` ← v1 `thunderstorm`: d="A storm with loud booms and bright flashes in the sky" · s="We stayed inside because of the big _____ last night." · a=["thunderstorms"] · mc=["hurricane","tornado","blizzard"]
- `g2u13.w.cloudy` ← v1 `cloudy`: d="When grey shapes cover the sky and you cannot see the sun" · s="It is very _____ today. I think it will rain." · a=["cloudier","cloudiest"] · mc=["foggy","sunny","hot"]
- `g2u13.w.windy` ← v1 `windy`: d="When the air moves a lot and blows things around" · s="Hold your hat! It is very _____ outside — the trees are bending." · a=["windier","windiest"] · mc=["sunny","quiet","hot"]
- `g2u13.w.rainy` ← v1 `rainy`: d="When water falls from the sky for a long time" · s="Take your umbrella. It is going to be a _____ day." · a=["rainier","rainiest"] · mc=["cloudy","snowy","stormy"]
- `g2u13.w.sunny` ← v1 `sunny`: d="When the sky is clear and bright with no clouds" · s="It is a _____ day — perfect for a picnic in the park." · a=["sunnier","sunniest"] · mc=["cloudy","bright","warm"]
- `g2u13.w.foggy` ← v1 `foggy`: d="When the air is thick and grey and you cannot see far" · s="Drive slowly — it is very _____ this morning and you cannot see the road." · a=["foggier","foggiest"] · mc=["clear","bright","sunny"]
- `g2u13.w.hot` ← v1 `hot`: d="A very high temperature that makes you feel warm" · s="It is so _____ today! Let's go swimming in the pool." · a=["hotter","hottest"] · mc=["warm","rainy","cold"]
- `g2u13.w.cold` ← v1 `cold`: d="A low temperature that makes you want a warm coat" · s="Wear a thick jacket — it is very _____ outside." · a=["colder","coldest"] · mc=["cool","sunny","beautiful"]
- `g2u13.w.weather-presenter-meteorologist` ← v1 `weather presenter / meteorologist`: d="A person on TV who tells you what the sky and air will be like" · s="The _____ on the TV news showed the weather map and said it will be warm tomorrow." · a=["weather presenter","meteorologist","weather presenters","meteorologists"] · mc=["cook","gardener","driver"]
- `g2u13.w.coast` ← v1 `coast`: d="The land next to the sea" · s="We drove to the _____ and spent the day by the water." · a=["coasts"] · mc=["beach","shore","cliff"]
- `g2u13.w.to-continue` ← v1 `to continue`: d="To keep going and not stop" · s="The bad weather will _____ all week without any change." · a=["continue","continues","continued"] · mc=["to stop","to end","to finish"]
- `g2u13.w.cool` ← v1 `cool`: d="A little bit cold, but not too much" · s="The evenings are _____ in September -- not hot but not really cold either." · a=["cooler","coolest"] · mc=["cold","mild","warm"]
- `g2u13.w.degree` ← v1 `degree`: d="A unit to measure how warm or cold it is" · s="Tomorrow it will be 25 _____ — nice and warm!" · a=["degree","degrees"] · mc=["percent","unit","point"]
- `g2u13.w.dry` ← v1 `dry`: d="Having no water or rain" · s="The summer was very _____. It did not rain for weeks." · a=["drier","driest"] · mc=["wet","damp","humid"]
- `g2u13.w.formula` ← v1 `formula`: d="A special set of numbers and letters to work something out" · s="We used a _____ to change Fahrenheit to Celsius." · a=["formulas","formulae"] · mc=["equation","method","sum"]
- `g2u13.w.to-give-way` ← v1 `to give way`: d="To change and be replaced by something else" · s="The clouds will _____ to sunshine in the afternoon." · a=["give way","gives way","gave way"] · mc=["to replace","to take over","to make way"]
- `g2u13.w.scale` ← v1 `scale`: d="A set of numbers used to measure something" · s="On a _____ of one to ten, how much do you like maths?" · a=["scales"] · mc=["chart","graph","ruler"]
- `g2u13.w.sunshine` ← v1 `sunshine`: d="light and warmth from the sun" · s="We had lovely warm _____ all day with a blue sky, so we stayed outside." · a=[] · mc=["rain","snow","fog"]
- `g2u13.w.temperature` ← v1 `temperature`: d="How warm or cold something is" · s="The _____ dropped to zero degrees last night and water froze in the puddles." · a=["temperatures"] · mc=["rain","wind","clock"]
- `g2u13.w.to-clear-up` ← v1 `to clear up`: d="When bad sky conditions go away and it gets nice" · s="Don't worry — the rain will _____ by lunchtime." · a=["clear up","clears up","cleared up"] · mc=["to cloud over","to calm down","to warm up"]
- `g2u13.w.fog` ← v1 `fog`: d="A thick grey cloud near the ground that makes it hard to see" · s="I could not see the road because of the thick white _____ in the early morning." · a=["fogs"] · mc=["rain","snow","wind"]
- `g2u13.w.forecast` ← v1 `forecast`: d="A report that tells you what the sky and air will be like" · s="I checked the weather _____ on TV for tomorrow and it said it would rain all afternoon." · a=["forecasts"] · mc=["temperature","cloud","storm"]
- `g2u13.w.hope` ← v1 `hope`: d="The feeling that something good will happen" · s="There is _____ that the weather will get better soon." · a=["hopes"] · mc=["wish","dream","fear"]
- `g2u13.w.outlook` ← v1 `outlook`: d="What things will probably be like in the future" · s="The weather _____ for the next few weeks shows warm and dry conditions ahead." · a=["outlooks"] · mc=["forecast","prediction","view"]
- `g2u13.w.small-talk` ← v1 `small talk`: d="light conversation about the weather or weekend plans" · s="British people love making _____ about the weather. They have short, friendly chats everywhere." · a=["small talk"] · mc=["conversation","discussion","gossip"]
- `g2u13.w.thick` ← v1 `thick`: d="Wide, heavy, or closely packed together" · s="She wore a _____ winter coat made of wool to stay warm in the freezing cold." · a=["thicker","thickest"] · mc=["thin","light","summer"]
- `g2u13.w.towards` ← v1 `towards`: d="In the direction of something" · s="Walk _____ the park -- in its direction -- and you will find the shop." · a=[] · mc=["away from","past","along"]
- `g2u13.w.have-a-nice-day` ← v1 `Have a nice day!`: d="A friendly thing you say when someone is leaving" · s="See you tomorrow. _____ Enjoy your time until then." · a=["Have a nice day","Have a nice day!"] · mc=["Good night.","Sleep well.","Sweet dreams."]
- `g2u13.w.to-make-sure` ← v1 `to make sure`: d="To check that something is right or done" · s="_____ you close the windows carefully before you leave. Don't forget — it might rain." · a=["make sure","makes sure","made sure"] · mc=["to forget","to try not to","to pretend"]
- `g2u13.w.to-rise` ← v1 `to rise`: d="To go up, to get higher" · s="In summer, temperatures _____ up to thirty-five degrees in the afternoon." · a=["rise","rises","rose","risen"] · mc=["to fall","to freeze","to drop"]
- `g2u13.w.axe` ← v1 `axe`: d="A heavy tool with a sharp metal part used to cut wood" · s="The farmer used an _____ to chop the firewood." · a=["axes"] · mc=["saw","hammer","knife"]
- `g2u13.w.bright` ← v1 `bright`: d="Full of light, easy to see" · s="The stars were very _____ in the sky last night." · a=["brighter","brightest"] · mc=["dim","dark","pale"]
- `g2u13.w.flash-of-light` ← v1 `flash of light`: d="A very quick burst of brightness" · s="There was a _____ in the sky, then thunder." · a=["flash of light","flashes of light"] · mc=["ray of sunshine","beam of light","spark"]
- `g2u13.w.to-shine` ← v1 `to shine`: d="To give off light" · s="The sun _____ through the clouds after the rain stopped." · a=["shine","shines","shone","shined"] · mc=["to glow","to sparkle","to fade"]
- `g2u13.w.average` ← v1 `average`: d="The normal or middle amount" · s="The _____ price of a meal here is ten euros — some meals cost less, some cost more." · a=[] · mc=["highest","cheapest","total"]
- `g2u13.w.below` ← v1 `below`: d="Lower than something, under" · s="The temperature dropped _____ zero and it was freezing." · a=[] · mc=["above","beyond","beneath"]
- `g2u13.w.generally` ← v1 `generally`: d="Most of the time, usually" · s="Summers in Austria are _____ warm and nice, but not every single year." · a=[] · mc=["never","sometimes","rarely"]
- `g2u13.w.inch` ← v1 `inch (pl inches)`: d="A small unit to measure length, used in the UK and USA" · s="My phone screen is about six _____ wide — that's around 15 centimetres." · a=["inch","inches"] · mc=["kilometres","metres","millimetres"]
- `g2u13.w.mild` ← v1 `mild`: d="Not too hot and not too cold, gentle" · s="The winters here are quite _____. It rarely snows and the temperature stays above freezing." · a=["milder","mildest"] · mc=["harsh","freezing","extreme"]
- `g2u13.w.mile` ← v1 `mile`: d="A unit to measure how far something is, used in the UK and USA" · s="The next town is about five _____ from here." · a=["mile","miles"] · mc=["kilometre","yard","foot"]
- `g2u13.w.rainfall` ← v1 `rainfall`: d="The amount of water that comes down from the sky" · s="This area has a lot of _____ in autumn." · a=[] · mc=["snowfall","sunshine","drought"]
- `g2u13.w.to-record` ← v1 `to record`: d="To write down or save information" · s="Scientists _____ the temperatures every day and save the data on a computer." · a=["record","records","recorded"] · mc=["to forget","to guess","to ignore"]
- `g2u13.w.sea-level` ← v1 `sea level`: d="The average height of the sea, used to measure how high land is" · s="This city is 300 metres above _____ — the line where the ocean meets the land." · a=["sea level"] · mc=["the clouds","the ground","the buildings"]
- `g2u13.w.throughout-the-year` ← v1 `throughout the year`: d="During every part of the year, all twelve months" · s="It is warm in this country _____, from January to December." · a=["throughout the year"] · mc=["only in summer","only at night","only on weekends"]
- `g2u13.w.western` ← v1 `western`: d="In or from the west, where the sun goes down" · s="The _____ part of Austria is very mountainous." · a=[] · mc=["eastern","northern","southern"]
- `g2u13.w.wet` ← v1 `wet`: d="Covered with water or full of water" · s="My shoes are _____ because I walked through a puddle." · a=["wetter","wettest"] · mc=["damp","dry","clean"]
- `g2u13.w.heavy-rain` ← v1 `heavy rain`: d="When a lot of water falls from the sky very fast" · s="We could not play outside because of the _____." · a=["heavy rain"] · mc=["light rain","drizzle","thunderstorm"]
- `g2u13.w.tan` ← v1 `tan`: d="When your skin gets darker because of the sun" · s="You have a nice _____! Were you on holiday?" · a=["tans"] · mc=["sunburn","freckles","pale skin"]
- `g2u13.w.binoculars` ← v1 `binoculars`: d="A tool with two lenses you look through to see things far away" · s="I used my _____ to watch the birds on the lake." · a=[] · mc=["telescope","magnifying glass","microscope"]
- `g2u13.w.career` ← v1 `career`: d="The job or work someone does for many years" · s="She wants a long _____ as a doctor when she finishes school — maybe 30 or 40 years in the same profession." · a=["careers"] · mc=["holiday","hobby","friendship"]
- `g2u13.w.to-earn` ← v1 `to earn`: d="To get money by working" · s="My brother _____ 50 euros a week by helping at a bakery after school — the baker pays him." · a=["earn","earns","earned"] · mc=["to spend","to lose","to borrow"]
- `g2u13.w.to-be-mad-about-sth` ← v1 `to be mad about sth.`: d="To like something very, very much" · s="My sister is _____ horses. She rides every day." · a=["be mad about","mad about"] · mc=["to be interested in","to be bored with","to be afraid of"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 13.txt -----
Unit 13 Rain and sun
Page 100–101
At the end of unit 13 … you know:
9 words to describe the weather
how to use the will-future
how to use adverbs of manner
you can:
understand and write weather forecasts
talk about the weather
talk about hopes and expectations
understand a story about the weather
express a spontaneous decision
write an email about a holiday and the weather
READING
Activity 1:
Look at the map and read the text. Change the Fahrenheit temperatures into Celsius. Use this scale to help you.
A horizontal temperature conversion scale from Fahrenheit to Celsius is shown: F: 0 – 10 – 20 – 30 – 40 – 50 – 60 – 70 – 80 – 90 – 100
C: -18 – -12 – -7 – -1 – 4 – 10 – 16 – 21 – 27 – 32 – 38
Note: To change Fahrenheit to Celsius, use this formula:
(°F - 32) x 5/9 = °C
0°F = -18°C
Map of California:
Shows locations with temperature bubbles:
San Francisco: 78°F
San Jose: 92°F
Fresno: 84°F
Los Angeles: 100°F
San Diego: 104°F
The weather today
The good weather continues. Early morning clouds give way to lots of sunshine. Nicely cool and dry at the coast with lower temperatures in the north. Very hot in the south with temperatures in the 100s: it will be 104 degrees Fahrenheit in San Diego.
VOCABULARY: Weather
Activity 2:
Listen and look. Then fill in the numbers. Test your partner.
Nine weather icons with numbers to match:
Windy – icon shows a red and white wind sock blowing sideways.
Rainy – icon shows dark clouds with raindrops.
Thunderstorm – icon shows dark clouds with a lightning bolt.
Snowy – icon shows a cloud with snowflakes.
Hot – icon shows a red thermometer.
Sunny – icon shows a large yellow sun.
Cloudy – icon shows fluffy white clouds.
Cold – icon shows a blue thermometer.
Foggy – icon shows a grey cloud with lines indicating fog.
(Speech bubble from a girl: “What’s ‘neblig’ in English?”)
LISTENING: Understanding weather forecasts
Activity 3:
Listen to the weather forecast. Then read it and draw the missing symbols on the maps.
Note: * = degrees
Today
Sunny, some clouds north of Leicester. Thick fog in the Stoke area will clear up later. Temperatures between 3°C and 12°C. Winds 10–20 mph.
Map of central England with city labels:
Chesterfield (partly sunny symbol)
Stoke (empty box for symbol)
Leicester (empty box for symbol)
The Malverns (sunny symbol)
Outlook for tomorrow
Light rain in the Stoke area. Sunny in the Leicester area. More rain in the Malverns and thunderstorms coming from the north in the evening. Strong winds. Temperatures between 8°C and 15°C.
Map of same region:
Chesterfield (empty box for symbol)
Stoke (rainy symbol)
Leicester (sunny symbol)
The Malverns (empty box for symbol)
Activity 4:
Look at the maps of the UK. Listen to the weather forecasts and draw the symbols.
There are three maps labeled A, B, and C. Each one includes regions of the UK labeled as:
Scotland
Northern Ireland
Wales
The Midlands
London
No weather symbols are shown; students are expected to draw them after listening.
Page 102–103
LISTENING & SPEAKING: Talking about the weather
Activity 5: CHOICES Listen to the dialogues. Then read them. Make some changes and act them out.
A. DIALOGUE 1: Weather small talk
Monica: Nice day today.
Robert: That’s right. It’s really nice. But …
Monica: But what?
Robert: They say it’ll rain later.
Monica: Oh, really. That’s bad.
Robert: Why’s that?
Monica: I wanted to go for a walk with you.
Robert: Really? Let’s go. But …
Monica: But what?
Robert: I’ll get an umbrella.
VOCABULARY:
hiking holiday = Wanderurlaub
B. DIALOGUE 2: Planning a trip
Receptionist: Highland Hotel, can I help you?
Tourist: Yes, I’d like to ask you about a hiking holiday.*
Receptionist: Yes.
Tourist: What’s the weather like at your place right now? I’m asking because my mobile phone says it’s snowing.
Receptionist: Well, that’s not true. But it’s raining and it’s pretty cold.
Tourist: What about next week?
Receptionist: They say it’ll be a bit warmer.
Tourist: But are you sure?
Receptionist: Well, I can’t promise, of course. But we all hope it’ll be warmer and less windy. The weather forecast says towards the end of the week, it’ll be sunny.
Tourist: Lovely. Thank you.
Activity 6: Work in pairs. Look at the map and say what the weather is like in an area. Your partner tries to guess the place.
Speech bubble: “There will be thick fog and the temperature will be 10°C.”
Answer: “It’s London.”
Map shows cities and temperatures:
Oban: 3°C
Edinburgh: -1°C
Glasgow: 2°C
Belfast: 8°C
Manchester: 7°C
Birmingham: 8°C
Cardiff: 9°C
London: 10°C
Plymouth: 10°C
SPEAKING: Talking about hopes and expectations
Activity 7: Work in pairs. Talk to your partner about your hopes for the weather next week.
Prompts:
I hope it’ll be warmer. I hope we can …
I think it’ll rain, so I don’t have to …
I hope there won’t be so much …
READING
Activity 8: Read the story quickly. How many wishes did the old man make?
Title: The old man and the mountain
Narrator: Many years ago, in a country far far away, there was an old man. Every day, he walked slowly to the mountain and worked from morning until night, cutting the stone. Bang, bang, bang! In sun, rain, wind and snow, he carefully broke the stone so people could build their houses.
Old man: I’m too old for this! Every day for so many years … hot weather, cold weather … cloudy days, sunny days, rainy days! Thunderstorms and snow … It will never end … All this hard work will kill me.
Narrator: One day, the old man put down his axe and sat on the stone. It was too hot, and the sun was too strong. He was very tired.
Old man: I’ve had enough! I want to be strong! Strong like the sun! Oh please, please make me as strong as the sun!
Narrator: The old man shouted angrily at the sky. Suddenly, there was a bright flash of light, and the man disappeared. When he opened his eyes, he was not a man any more, he was the sun!
Old man: YES! I have all the power of the sun! Look at me. I’ll shine my light all over the world. Ha ha ha!
Narrator: But then, clouds covered the Earth, and he couldn’t see the people.
Old man: I’ve had enough! I want to be strong! Strong like the clouds! Oh please, please make me as strong as the clouds!
Narrator: The old man shouted angrily at the sky. Suddenly, there was a bright flash of light, and the man disappeared. When he opened his eyes, he was not the sun any more, he was a cloud!
Old man: YES! I have all the power of the clouds! Look at me, I can easily stop the sun! Ha ha ha!
Narrator: But then, the wind blew the clouds all over the world and he couldn’t stop the sun.
Old man: I’ve had enough! I want to be strong! Strong like the wind! Oh please, please make me as strong as the wind!
Image descriptions:
The old man working at the mountain with an axe.
The sun smiling brightly and covering the earth with light.
A cloud blowing wind across the globe.
The old man transformed into different natural forces.
Page 104–105
Narrator: The old man shouted angrily at the sky. Suddenly, there was a bright flash of light, and the man disappeared. When he opened his eyes, he was not a cloud any more, he was the wind!
Old man: YES! I have all the power of the wind! Look at me. I’ll fly around the world. Ha ha ha!
Narrator: But then, the wind stopped! It hit a mountain.
Image description: Wind blowing against a tall mountain, stopping abruptly.
Old man: I’ve had enough! I want to be strong! Strong like the mountain! Oh please, please make me as strong as the mountain!
Narrator: The old man shouted angrily at the sky. Suddenly, there was a bright flash of light, and the man disappeared. When he opened his eyes, he was not the wind any more, he was the mountain!
Old man: YES! I have all the power of the mountain! Ha ha ha! Nothing can stop me!
Narrator: But then, he felt something. Somebody was breaking off stone from the mountain! He looked down and saw an old man carefully cutting the mountain stone into small pieces …
Image description: The mountain with the sun in the sky and an old man at its base chipping away with an axe.
Activity 9: Read the story again. How many of these tasks can you do?
This happened a long time ago. T / F
The man was young. T / F
The stone was for building houses. T / F
The man sat down on: □ an axe □ a stone □ the floor
The clouds are stronger than the: □ wind □ sun □ mountain
The man learnt that the wind is stronger than the: □ sun □ sky □ clouds
Why does the man think the mountain is the strongest? …………………………………………
In the end, who was cutting the mountain? …………………………………………
What do you think is the meaning of the story? …………………………………………
Activity 10: Check your answers with a partner. Then listen to the story.
READING
Activity 11: Read the two texts and convert the numbers from Fahrenheit to Celsius, feet to metres and inches to centimetres.
Note:
1 ft (foot) = 30.48 centimetres
1 inch = 2.54 centimetres
The hottest place in the USA
Death Valley is generally sunny, dry and clear throughout the year. The winters are mild, but summers are very hot and dry. In fact, Death Valley is one of the hottest places on Earth. The highest temperature ever recorded in the USA was 134°F on July 10th, 1913. Summer high temperatures are usually around 120°F. The average rainfall each year is two inches.
Death Valley has the lowest point in the western world – 282 feet below sea level near Badwater – as well as many high mountains such as Telescope Peak at over 11,000 feet.
The wettest place in England
The wettest place in England is in the Lake District. It is a small village called Seathwaite. Seathwaite is the starting point for some great walks.
But bring good clothes against the rain. The average rainfall each year is 120 inches. Some people say there is even more rainfall in Seathwaite (one mile away): 130 inches.
Seathwaite doesn’t have more rainy days than other places – but when it rains, it rains more.
WRITING
Activity 12: Read Carina’s email to Tony. Draw a line where she should start a new paragraph.
Email on screen: To: tony@home.co.uk
SUBJECT: bad weather 😕
Hi Tony,
I’m sitting at the computer in the hotel lobby – guess why? No swimming, no lying in the sun. Outside it’s raining heavily. It all started with a thunderstorm yesterday. The weather changed so fast! It got colder and then the heavy rain came. No tan* when I come back! 😒
And the outlook? The weather forecast says it’ll rain all week. How boring. It isn’t going well for me. Hope I can go and see a movie in town. How are things with you? Alright? Write back. Maybe we can chat a bit.
Love,
Carina
Vocabulary: tan = Bräune
Activity 13: Think back on your last holiday. Write an email (60–80 words) to a friend about what it was like. Write as much as possible about the weather.
Page 106–107
SOUNDS RIGHT: /l/
Activity 14:
Listen. Number the sentences as you hear them.
☐ I do it every day.
☐ I’ll speak English to her.
☐ We tell jokes a lot.
☐ I speak English quite well.
☐ They see us on Fridays.
☐ We’ll tell you a joke.
☐ They’ll see us on Friday.
☐ I’ll do it my way.
GRAMMAR
Will-future
(Image: A TV screen showing a weather forecast with a cartoon rain cloud and umbrella. Speech bubble says: “There’ll be some showers today.”)
Mithilfe der will-future drückst du Erwartungen, Vermutungen und Hoffnungen für die Zukunft aus:
It will never end. (It’ll never end.)
All this hard work will kill me.
Du verwendest die will-future auch dann, wenn du etwas vorhersagen willst:
Some heavy rain will come in from Northern Scotland.
The south of England will have quite a lot of fog near the coast.
The sun won’t come out for another few days.
Du verwendest die will-future auch dann, wenn du dich spontan entschließt oder spontan versprichst, etwas zu tun:
I’ll get an umbrella.
I’ll fly all around the world.
Box: Complete with ’ll / will / won’t. Bildung: Person + 1 _______ (not) + Grundform des Verbs
Kurzformen: I will = I’2 _______
I will not = I 3 _______
Adverbs of manner
Mit dem Adverb der Art und Weise drückst du aus, wie jemand etwas macht oder wie etwas geschieht.
Examples:
He walked slowly to the mountain.
He carefully broke the stone.
The old man shouted angrily at the sky.
Look at me, shining beautifully.
I can easily stop the sun.
Look at me, flying quickly.
Bildung: Adjektiv + ly
slow → slowly
quick → quickly
careful → carefully
Bei den Adjektiven, die auf y enden, wird das y zu einem i:
happy → happily
easy → easily
angry → angrily
Ausnahmen:
fast → fast
The weather changed so fast.
good → well
I speak English quite well.
Box: Complete with adverb or adjective. Mit einem 1 ____________ kannst du ein Nomen beschreiben.
Mit einem 2 ____________ kannst du ein Verb beschreiben.
OUR YOUNG WORLD 4
🎬 Luna’s dream job
Image description:
 A smiling girl (Luna) wearing a colorful sombrero and sitting in front of a camera. She is holding a microphone.
🎥 1 Watch the video. What is Luna’s dream job?
..................................................................................................
🎥 2 Watch again and answer the questions.
How old is Luna? ...............................................................................
What other two jobs does she mention? ...............................................
What four types of weather does she talk about? .................................
What school subject does she need to be good at? ...............................
What social skill does she need to be good at? .....................................
What kind of meteorologist does she want to be? .................................
FIND OUT 💡 Jobs
3 Match the words and the definitions.
☐ 1 career
 ☐ 2 part-time job
 ☐ 3 hobby
 ☐ 4 vocation
a) a job that you usually do for a long time (maybe all your life)
 b) a job that you only do for a few hours a day/week
 c) something you do in your free time (not to earn money)
 d) work you feel that you were born to do
Our working world
4 In pairs, decide if these people are talking about a career, part-time job, hobby or vocation.
“My dad’s mad about birdwatching. Any time he’s got any free time he picks up his binoculars and goes off into the countryside.”
“I help my dad in the shop on Saturday mornings. I really enjoy it and I get to talk to lots of interesting people.”
“I’ve always known I want to help people so being a doctor is my dream job.”
“My mum works in a bank. I think she quite enjoys it and she gets paid quite a lot of money.”
VOCABULARY: binoculars = Fernglas
CYBER PROJECT: My dream job on video
5 Think about your dream job. Think about what school subjects you need to be good at to do this job. What social skills do you need?
Make a short presentation about this job.
Produce a short video to present it to the class.


----- WB: More 2 WB Unit 13.txt -----
Unit 13 – Rain and Sun
Page 106–107
UNDERSTANDING VOCABULARY: Weather
1. Complete the words.
sun _ _ _ _ _ _ _ _ _
thunder _ _ _ _ _ _ _
snow _ _ _ _
wind _ _ _
clou _ _ _
ra _ _ _ _ _
h _ _ _ _ _ _ _
fog _ _ _
co _ _ _ _ _
The three-column prompt box provides letter fragments:
Row 1: y / dy / ld
Row 2: ny / iny / ot
Row 3: y / gy / storm
These are intended to be combined with the partial words (1–9) to form complete weather-related words.
2 Find the nine weather words in the wordsearch. (→→↑↓)
[The word search is a 12x12 letter grid with nine hidden weather words.]
F E Q S C O L D R S R
 E O U L A E A T U E A
 Y G C O F F H O T I G
 B S E I E X Q T O Y I
 B S K C P F G C N O S
 K D U H D S K A D N I
 L O Y K U O C L A O C
 N W N S O P I C L O U
 O I W D N O I I D W D
 R A A Y U O T T A H T
 M R O T S R E D N U H
[List of blank lines to write the words found in the word search.]
USING VOCABULARY
 Weather
3 Write the words from 2 under the pictures.
Images:
A grey cloud with snowflakes falling below it.
A thermometer showing a low temperature: 10°.
A thermometer showing a high temperature: 35°.
A white cloud with light grey inside, no rain or snow.
A yellow sun shining.
A grey cloud with yellow lightning bolts below.
A grey cloud with rain below.
A red and white windsock blowing in the wind.
A grey cloud with snowflakes and raindrops below.
[Nine blank lines for writing vocabulary words.]
UNDERSTANDING GRAMMAR
 will-future
4 Complete the sentences with the words in the box.
Word box:
 rain – do – drive – meet – finish – help – go – tell
Here, I’ll ___________ you with your homework.
The weather isn’t good. I think it’ll ___________ later.
One day, I’ll ___________ around in a Ferrari. One day!
I’ll ___________ you outside the cinema at 8 p.m., OK?
I’m feeling tired. I think I’ll ___________ to bed.
I’m bored. I won’t ___________ any more work tonight.
It’s a secret. Promise you won’t ___________ anybody.
It’s a long job. We won’t ___________ before midnight.
5 Write the sentences in the correct speech bubbles.
Sentence bank:
 – I’ll give you some.
 – I haven’t got enough money.
 – Oh! It really hurts.
 – I’ll bring it tomorrow. I promise.
 – I’m really scared of dogs.
 – OK, leave it. I’ll do it later.
 – I’ve got lots of homework tonight.
 – I’ll carry it for you.
 – I’ll take you to hospital.
 – I’m not. I’ll get it.
 – This suitcase* is heavy.
 (*Vocabulary: suitcase – Koffer)
Speech bubble images (cartoons):
1. A woman, hands on hips, scolding a boy. She says, “Where’s your homework?” The boy looks nervous and holds a sheet of paper.
 [Two lines below for writing.]
2. A boy running away from a barking dog.
 [Two lines below for writing.]
3. A girl fell off her skateboard and is sitting on the ground holding her leg. A friend stands beside her, concerned.
 [Two lines below for writing.]
4. A girl and boy at a table, the girl is eating and has food all over her plate. She looks frustrated.
 [Two lines below for writing.]
5. A girl carrying a large suitcase is struggling. A boy is next to her, ready to help.
 [Two lines below for writing.]
6. A girl in a shop looking at a dress. She’s holding her wallet open, looking disappointed.
 [Two lines below for writing.]
Page 108–109
6. Match the pictures and the sentences.
Sentence Options: [ ] It won't hurt.
[ ] It won't bite you.
[ ] I won't be home for dinner.
[ ] I won't pass.
[ ] She won't phone me.
[ ] You won't wear it.
Pictures:
A dentist holding a tool while a girl nervously opens her mouth in the dentist's chair.
A woman leaving the house while calling out to a child inside.
A man encouraging a scared girl to pet a friendly dog.
A woman holding a dress up to a girl who looks unimpressed.
A girl at a window, clearly upset, looking at her phone.
A boy holding a test result with a very low score and looking worried.
USING GRAMMAR: will-future
7. Look at the pictures and write the sentences.
anyone / I / it. / buy / don’t / will / think
today. / think / coat / need / my / I / I’ll
you’ll / test / is / The / and / easy / pass. / very
on / sleep / You’ll / well / bed. / very / this
berries / make / Those / sick. / you / will
gold / so / It’s / expensive. / will / it / be
Image descriptions:
Two boys looking at a bike in a shop window.
A boy looking out the window at snowy weather.
Girl holding a "TODAY TEST" paper and smiling.
A couple looking at a brand-new bed in a furniture store.
Two children sitting at a table. One offers a bowl of berries.
A boy watching TV and reacting to a show about gold.
8. Match the sentences.
Left Column:
It’s my birthday tomorrow.
The film starts at six. Don’t forget!
How am I going to get home?
The car’s really dirty.
Here’s £5.
I’m going to miss the game on TV.
I’m really hungry.
It’s cold in here.
The phone’s ringing.
It’s a secret.
Right Column: [ ] I’ll close the window.
[ ] I won’t tell anybody.
[ ] OK. I’ll record it for you.
[ ] Thanks. I’ll give it back to you tomorrow.
[ ] I’ll answer it.
[ ] I’ll make a cake.
[ ] Don’t worry – I’ll be there.
[ ] I’ll clean it for you.
[ ] I’ll make you a sandwich.
[ ] My dad will take you in our car.
9. Look at the pictures and write the people’s dreams.
1. Boy standing confidently in front of a race car and lounging by a pool. Text: "I’ll be rich one day."
2. Girl dreaming of being a mother, holding a baby and standing outside a house.
3. Girl dreaming of her wedding day with a happy couple in a wedding dress and suit.
4. Girl dreaming of working in a perfume or cosmetics shop.
5. Boy dreaming of holding a sports trophy, wearing a uniform, crowd cheering.
6. Girl dreaming of riding a horse and winning a medal.
Page 110–111
10. Complete with your own ideas.
A: The party starts at eight, Dave.
B: I know, but I’ll be a bit late because .............................................................
A: Lunch will be ready in an hour.
B: OK, so I won’t .............................................................
A: What’s Mike going to do when he finishes school?
B: He isn’t sure yet, but I think he’ll .............................................................
A: What chance have Manchester United got in the cup final?
B: They won’t win because .............................................................
A: Where are you going on holiday this year?
B: I’m not sure, but it won’t .............................................................
A: I only slept two hours last night.
B: Well, you will .............................................................
UNDERSTANDING GRAMMAR: Adverbs of manner
11. Write the adverbs.
adjective	adverb	adjective	adverb
loud	1. loudly	easy	7. ________
beautiful	2. _______	bad	8. ________
quick	3. _______	happy	9. ________
slow	4. _______	angry	10. ________
nervous	5. _______	fast	11. ________
careful	6. _______	good	12. ________

12. Read the sentences. Underline the adjective and circle the adverb in each one.
Dad washed his new car carefully.
The children walked carefully over the dangerous bridge.
The pizza was delicious and Sally ate it quickly.
The game was difficult and United played badly.
The weather was good, but then it changed fast.
John’s bike was old, but he rode it easily.
USING GRAMMAR: Adverbs of manner
13. Complete the sentences with the adverbs of the adjectives in the box.
Word box: bad, careful, good, happy, fast, slow
She’s running very __________.
He’s working really __________.
It’s walking __________ to the other side of the street.
She’s laughing __________.
I did __________ in the test today.
They’re playing very __________.
Image descriptions:
Girl running in sportswear.
Scientist working in a lab.
Turtle crossing the street slowly.
Girl laughing with eyes closed.
Boy holding a test paper with bad grade.
Boys playing tennis intensely.
14. Complete the sentences with the adverbs of the adjectives in brackets.
A: He plays football really __________. (good)
B: Yes, he wants to be a star.
A: I don’t think the teacher was very happy.
B: No, she looked at us really __________. (angry)
A: Shh! Talk __________. (quiet)
B: Why?
A: Henry’s trying to sleep.
A: Is the climb very difficult?
B: Yes, so you should go very __________. (careful)
A: Slower, Dad, slower!
B: Yes, you’re driving too __________. (fast)
A: Are we in a hurry?
B: No.
A: So, don’t walk so __________. (quick)
15. Answer the questions about yourself.
What do you do well? .............................................................
What do you do badly? .............................................................
What do you do carefully? .............................................................
What do you do easily? .............................................................
What do you do quickly? .............................................................
What do you do happily? .............................................................
Page 112–113
READING & WRITING — Understanding stories about the weather / Writing about the weather
16. CHOICES
A. Read the story and choose the best title for it. Then choose T (True) or F (False).
Options:
A hot day
Friends in the park
Rain and sun
Story: "When I was six years old, I was in the back garden of our house with my friends. We were playing football. It was sunny. Then I saw some black clouds in the sky. I went around the house. There was the washing on the line*. I said to my mum, 'It’ll be rainy soon.' At that moment it started to rain. I quickly helped my mum take the washing off the line. Then I went back to my friends in the back garden. It was sunny. I went back to the front garden – rain! Strange! When I looked one way, it was sun. When I looked the other way, it was rain! (Jamie, 13)"
VOCABULARY: *line = Wäscheleine
Questions:
The story is about a time when Jamie was 13 years old. T □ F □
Jamie was playing football in the back garden. T □ F □
There was the washing on the line on the other side of the house. T □ F □
Jamie’s friends helped his mother. T □ F □
It was raining on both sides of the house. T □ F □
B. Read the story and choose the best title for it. Then answer the questions below.
Options:
The water went away
Buying sandbags*
When I was twelve
Story: "I was about 12. There was a river at the end of our garden. On a Thursday in October, it started to rain and rain. On Saturday morning, I went into the garden and I saw that the river was higher than usual. The water started to come into our garden and I shouted to my mum and dad. They ran out, and my dad went to get some sandbags. But at that moment the rain stopped and the water began to go back again. My dad came back and we watched the water go away. We were so happy, and the three of us laughed and danced around. (Aryan, 14)"
VOCABULARY: *sandbag = Sandsack
Questions:
Why did Aryan shout to his parents? .............................................................
What did Aryan’s dad do when he saw what the problem was? .............................................................
What happened in the end? .............................................................
17. Look at the map and write the weather forecast.
Image description: Map of Europe with weather symbols over six cities:
London (cloudy)
Paris (stormy/lightning)
Munich (cloudy)
Vienna (snowy)
Turin (cloudy)
Madrid (sunny)
1. It will be sunny in Madrid.
2. ....................................................................................
3. ....................................................................................
4. ....................................................................................
5. ....................................................................................
18. Remember the formula. Tick T (True) or F (False) for the sentences.
To convert Fahrenheit temperatures into Centigrade:
(°F - 32) × 5⁄9 = °C
Begin by subtracting 32 from the Fahrenheit number.
Multiply* the answer by 5.
Then divide* that answer by 9.
VOCABULARY: *subtract = subtrahieren, multiply = multiplizieren, divide = dividieren
Sentences:
100°C is hotter than 200°F. T □ F □
86°F is colder than 25°C. T □ F □
122°F is the same as 50°C. T □ F □
30°C is not as hot as 94°F. T □ F □
40°F is not as cold as 10°C. T □ F □
0°C is as cold as 32°F. T □ F □
Footer:
WB | UNIT 13
Refer to Student’s Book pp. 100, 101, 103, 104
Page 114–115
19. CHOICES
A. You are on holiday and the weather is really bad. Write a text message to a friend (30–40 words) telling him/her about it.
Image: Illustration of a smartphone screen with a message app open. The screen has a message area for students to write in.
B. Write a short text (60–80 words) about the wettest/hottest/coldest/driest place you’ve been to.
.................................................................................................................... .................................................................................................................... .................................................................................................................... .................................................................................................................... ....................................................................................................................
LISTENING & DIALOGUE WORK: Talking about the weather
20. Put the dialogue in the correct order. Then listen and check.
□ Mira And the air conditioning in the car didn’t work.
□ Mira I think that’s something like 40°C.
□ Mira Dad, do you remember our trip to Baker in Nevada?
□ Mira I think it was about 110°F.
□ Dad What is that in °C?
□ Dad I’m not sure. I think it’s more.
□ Dad Of course, I do. It was really hot.
□ Dad That’s right. It never worked. How hot was it?
Image: Road sign in a desert showing distances: “Baker 40 / Las Vegas 132”.
21. Listen to Willow talking about a trip to Ireland. Then answer the questions.
What does Willow’s dad want them to pack?
........................................................................................
How many wet days can you have in the West?
........................................................................................
How many wet days can you get in the East?
........................................................................................
What do the Irish call a soft day?
........................................................................................
What was the weather like when they left?
........................................................................................
WORD FILE: Weather forecast
Image description: Weather map of the UK with icons representing weather conditions. A compass rose is shown indicating North, East, South, and West. Two people stand near the map, a male and a female weather presenter.
North Scotland: snowy
Northern Ireland: thunderstorm
Central England: cloudy
Eastern England: windy
South East: rainy
South West: sunny
Northern England: foggy
Labels:
hot (sun and red thermometer)
cold (snowflake and blue thermometer)
weather presenter / meteorologist
Page 116
WORD FILE: Weather forecast
Word/Phrase	Example Sentence	Translation
coast	It’s nice and dry at the coast.	Küste
to continue	The rain will continue until tomorrow.	andauern; weitergehen
cool	It’s warm during the day, but quite cool at night.	kühl
degree	It will be 104 degrees Fahrenheit in San Diego.	Grad (°)
dry	We had very dry weather for our holidays last year.	trocken
formula	The formula is (°F - 32) : 1.8.	Formel
to give way	Rain in the morning will give way to sun later on.	ausweichen, Platz machen
scale	On a scale from 1 to 10: How good was your day?	Skala, Maßstab
sunshine	There will be lots of sunshine tomorrow. Perfect weather for a picnic.	Sonnenschein
temperature	The highest temperature ever recorded in the USA was 134°F.	Temperatur
to clear up	The bad weather will clear up by this evening.	hier: aufheitern
fog	Heavy fog in the South will clear up later.	Nebel
forecast	The forecast is very good for tomorrow.	Vorhersage
hope	Don’t give up. There’s still hope!	Hoffnung
outlook	The outlook for the weekend is warm and sunny.	Aussicht, Ausblick
small talk	There’s lots of small talk about the weather.	Small Talk, Plauderei
thick	Watch out! There’s thick fog here.	dicht; dick
towards	It will be sunny towards the end of the week.	in Richtung, auf ... zu
Have a nice day!	Einen schönen Tag noch!	Einen schönen Tag noch!
to make sure	Make sure you take your umbrella! It’s raining.	sich versichern, darauf achten
to rise	The temperatures will rise to 20°C.	(an-)steigen
axe	The old man put down his axe.	Axt
bright	There was a bright flash of light.	hell
flash of light	Suddenly, there was a flash of light in the sky.	Lichtblitz
to shine	I’ll shine my light all over the world.	scheinen
average	The average rainfall in Death Valley is 2 inches.	durchschnittlich
below	The temperature will be below 0°C tomorrow.	unter(-halb); unten
generally	Death Valley is generally sunny, dry and clear.	im Allgemeinen
inch (pl inches)	One inch is 2.54 centimetres.	Zoll
mild	In Death Valley, the winters are mild.	mild
mile	Seathwaite is one mile away from Seatoller.	Meile (= 1,6 Kilometer)
rainfall	The average rainfall each year is 120 inches.	Niederschlag
to record	It was the lowest temperature ever recorded.	aufzeichnen
sea level	Death Valley is 282 feet below sea level.	Meeresspiegel
throughout the year	It’s usually sunny throughout the year.	das ganze Jahr (über)
western	Death Valley is the lowest point in the western world.	westlich
wet	All my clothes are wet because of the rain.	nass
heavy rain	It got colder and then the heavy rain came.	starker Regen
tan	Where did you go on holiday? You have a great tan.	(Sonnen-)Bräune
binoculars	I can watch birds from far away with my binoculars.	Fernglas
career	She started her career as a meteorologist in 2015.	Karriere
to earn	Most people don’t earn money with their hobby.	(Geld) verdienen
to be mad about sth.	My dad’s mad about birdwatching.	für etw. schwärmen

```

## Output contract

Write `content/corpus/units/g2-u13/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u13",
  "briefBank": "5a9152db8a34",
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
