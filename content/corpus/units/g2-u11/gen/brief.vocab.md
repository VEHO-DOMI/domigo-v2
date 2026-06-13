# Vocab generation brief — g2-u11 (MORE! 2, Unit 11)

<!-- domigo:gen vocab g2-u11 bank=dbdedfccfbc4 prompt=346902f9f0f1 -->

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
| g2u11.w.wardrobe | wardrobe | Kleiderschrank | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | wardrobe |
| g2u11.w.bed | bed | Bett | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | bed |
| g2u11.w.bedside-table | bedside table | Nachttisch | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | bedside table |
| g2u11.w.carpet | carpet | Teppich(boden) | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | carpet |
| g2u11.w.fridge | fridge | Kühlschrank | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | fridge |
| g2u11.w.cooker | cooker | Herd | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | cooker |
| g2u11.w.curtain | curtain | Vorhang | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | curtain |
| g2u11.w.sink | sink | Spülbecken | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | sink |
| g2u11.w.cupboard | cupboard | Schrank | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | cupboard |
| g2u11.w.table | table | Tisch | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | table |
| g2u11.w.chair | chair | Stuhl | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | chair |
| g2u11.w.sofa | sofa | Sofa | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | sofa |
| g2u11.w.armchair | armchair | Sessel | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | armchair |
| g2u11.w.lamp | lamp | Lampe | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | lamp |
| g2u11.w.radiator | radiator | Heizkörper | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | radiator |
| g2u11.w.rug | rug | Teppich | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | rug |
| g2u11.w.roof | roof | Dach | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | roof |
| g2u11.w.wall | wall | Wand ; Mauer | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | wall |
| g2u11.w.window | window | Fenster | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | window |
| g2u11.w.staircase | staircase | Treppe | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | staircase |
| g2u11.w.cellar | cellar | Keller | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | cellar |
| g2u11.w.trailer | trailer (American English) | Wohnwagen | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | trailer ; American English |
| g2u11.w.tree-house | tree house | Baumhaus | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | tree house |
| g2u11.w.stilts | stilts | Stelzen | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | stilts |
| g2u11.w.reed | reed | Schilf | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | reed |
| g2u11.w.island | island | Insel | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | island |
| g2u11.w.ground | ground | Boden | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | ground |
| g2u11.w.ours | ours | unsere/r/s | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | ours |
| g2u11.w.theirs | theirs | ihre/r/s | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | theirs |
| g2u11.w.mine | mine | meine/r/s | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | mine |
| g2u11.w.hers | hers | ihre/r/s (Singular) | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | hers |
| g2u11.w.his | his | seine/r/s | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | his |
| g2u11.w.yours | yours | deine/r/s ; Ihre/r/s | wordfile | Inside a Room / Houses and Homes / Possessive Pronouns | — | — | yours |
| g2u11.w.furniture | furniture | Möbel | phrase | — | In our house, there's lots of furniture. | — | furniture |
| g2u11.w.whose | whose | wessen | phrase | — | Whose pen is this? | — | whose |
| g2u11.w.american | American | Amerikaner/in ; amerikanisch | phrase | — | My mom is American. | — | American |
| g2u11.w.cellar-2 | cellar | Keller | phrase | — | There's a big cellar underneath our house. | — | cellar |
| g2u11.w.central-asia | Central Asia | Zentralasien | phrase | — | The Mongolian people in Central Asia move their houses a lot. | — | Central Asia |
| g2u11.w.electricity | electricity | Elektrizität | phrase | — | The trailers can be connected to electricity and water. | — | electricity |
| g2u11.w.to-float | to float | treiben ; schweben | phrase | — | Fifty islands of reed float on the water. | float | to float ; float |
| g2u11.w.moveable | moveable | beweglich | phrase | — | The Mongolian people have moveable houses. | — | moveable |
| g2u11.w.underneath | underneath | unterhalb | phrase | — | There might be a cellar underneath the house. | — | underneath |
| g2u11.w.to-transport | to transport | transportieren | phrase | — | They can transport their homes. | transport | to transport ; transport |
| g2u11.w.hammock | hammock | Hängematte | phrase | — | I have a new hammock. I like sleeping in it. | — | hammock |
| g2u11.w.cotton | cotton | Baumwolle | phrase | — | My jacket is made of cotton. | — | cotton |
| g2u11.w.leather | leather | Leder | phrase | — | She doesn't wear leather shoes because she wants to protect animals. | — | leather |
| g2u11.w.material | material | Material | phrase | — | What material did they use to build this house? | — | material |
| g2u11.w.metal | metal | Metall | phrase | — | It's made of metal. | — | metal |
| g2u11.w.pattern | pattern | Muster | phrase | — | The shirt has a striped pattern. | — | pattern |
| g2u11.w.plain | plain | einfarbig | phrase | — | It's plain white. | — | plain |
| g2u11.w.plastic | plastic | Plastik | phrase | — | This bottle is made of plastic. | — | plastic |
| g2u11.w.pond | pond | Teich | phrase | — | She falls in the pond. | — | pond |
| g2u11.w.seat | seat | (Sitz-)Platz | phrase | — | Take a seat. | — | seat |
| g2u11.w.spotted | spotted | gepunktet | phrase | — | I can't find my spotted sunglasses. | — | spotted |
| g2u11.w.strap | strap | Band | phrase | — | I've got a watch with a blue strap. | — | strap |
| g2u11.w.striped | striped | gestreift | phrase | — | My T-shirt is striped. | — | striped |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alison, Alphabet, Alps, America, Americans, Amherst, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Hanna, Hannah, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homes, Homework, Hook, Hoople, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g2u11.w.wardrobe` ← v1 `wardrobe`: d="A tall piece of furniture where you hang your clothes" · s="I put my dresses and jackets in the _____." · a=["wardrobes"] · mc=["cupboard","chest of drawers","bookshelf"]
- `g2u11.w.bed` ← v1 `bed`: d="The place where you sleep at night" · s="I go to _____ at nine o'clock every night." · a=["beds"] · mc=["sofa","hammock","mattress"]
- `g2u11.w.bedside-table` ← v1 `bedside table`: d="A small table next to where you sleep" · s="I put my phone on the _____ before I go to sleep." · a=["bedside table","bedside tables"] · mc=["desk","shelf","cupboard"]
- `g2u11.w.carpet` ← v1 `carpet`: d="A soft covering on the floor that you walk on" · s="We have a new blue _____ covering the whole floor of the living room." · a=["carpets"] · mc=["sofa","lamp","picture"]
- `g2u11.w.fridge` ← v1 `fridge`: d="A cold box in the kitchen where you keep food fresh" · s="The milk is in the _____ next to the yoghurt and cheese. It stays cool there." · a=["fridges"] · mc=["drawer","oven","bag"]
- `g2u11.w.cooker` ← v1 `cooker`: d="A machine in the kitchen where you heat food" · s="Be careful near the _____ — it has four burners and is very hot when you cook on it." · a=["cookers"] · mc=["table","sink","window"]
- `g2u11.w.curtain` ← v1 `curtain`: d="A piece of cloth that hangs over a window" · s="Close the long _____ in front of the window please. The sun is too bright." · a=["curtain","curtains"] · mc=["book","laptop","box"]
- `g2u11.w.sink` ← v1 `sink`: d="The place in the kitchen where you wash dishes" · s="Put the dirty plates in the kitchen _____ so we can wash them." · a=["sinks"] · mc=["cupboard","fridge","oven"]
- `g2u11.w.cupboard` ← v1 `cupboard`: d="A piece of furniture with doors where you keep cups and food" · s="The glasses are in the wooden _____ on the wall above the kitchen counter." · a=["cupboards"] · mc=["fridge","floor","ceiling"]
- `g2u11.w.table` ← v1 `table`: d="A flat piece of furniture with legs where you eat or work" · s="We eat dinner at the _____ every evening." · a=["tables"] · mc=["desk","counter","bench"]
- `g2u11.w.chair` ← v1 `chair`: d="A piece of furniture you sit on, with a back and four legs" · s="Please sit on the small wooden _____ with four legs and a back, and wait for your turn." · a=["chairs"] · mc=["floor","bed","sofa"]
- `g2u11.w.sofa` ← v1 `sofa`: d="A long soft seat for two or more people in the living room" · s="The whole family of four sits together on the big soft _____ to watch TV in the living room." · a=["sofas"] · mc=["chair","table","bed"]
- `g2u11.w.armchair` ← v1 `armchair`: d="A big soft seat with sides where you rest your arms" · s="Grandpa always reads his book in his favourite _____." · a=["armchairs"] · mc=["sofa","chair","stool"]
- `g2u11.w.lamp` ← v1 `lamp`: d="A thing that gives you light when it is dark" · s="Turn on the desk _____ please. I cannot see my book in the dark corner." · a=["lamps"] · mc=["fan","radio","clock"]
- `g2u11.w.radiator` ← v1 `radiator`: d="A metal thing on the wall that makes the room warm" · s="My cat loves to sleep next to the warm _____ in winter when the heating is on." · a=["radiators"] · mc=["fridge","door","window"]
- `g2u11.w.rug` ← v1 `rug`: d="A small soft cover you put on the floor" · s="There is a nice small _____ on the floor in front of the fireplace." · a=["rugs"] · mc=["carpet","mat","blanket"]
- `g2u11.w.roof` ← v1 `roof`: d="The top part of a building that keeps the rain out" · s="A bird is sitting on the _____ of our house." · a=["roofs"] · mc=["ceiling","floor","wall"]
- `g2u11.w.wall` ← v1 `wall`: d="The flat side of a room or building" · s="I put a poster of my favourite band on my bedroom _____." · a=["walls"] · mc=["ceiling","floor","roof"]
- `g2u11.w.window` ← v1 `window`: d="A glass opening in a room that lets you see outside" · s="Open the _____ please. It is too hot in here." · a=["windows"] · mc=["door","curtain","balcony"]
- `g2u11.w.staircase` ← v1 `staircase`: d="Steps inside a building that take you up or down" · s="Be careful on the marble _____ in the main hall. The steps are slippery." · a=["staircases"] · mc=["floor","carpet","door"]
- `g2u11.w.cellar` ← v1 `cellar`: d="A room under the ground floor of a house" · s="We keep old boxes and bottles in the dark _____ below the ground floor." · a=["cellars"] · mc=["kitchen","bedroom","garden"]
- `g2u11.w.trailer` ← v1 `trailer (American English)`: d="A home on wheels that you can pull with a car" · s="They live in a _____ near the lake. It has wheels and they can pull it with their car." · a=["trailers"] · mc=["caravan","tent","cabin"]
- `g2u11.w.tree-house` ← v1 `tree house`: d="A small room built in a tree to play in" · s="We read books and played games in our _____ up in the big oak tree." · a=["tree house","tree houses","treehouse"] · mc=["garden shed","tent","cabin"]
- `g2u11.w.stilts` ← v1 `stilts`: d="Long sticks or poles that hold something up above the ground" · s="In some countries, houses stand on _____ over the water." · a=[] · mc=["pillars","poles","ladders"]
- `g2u11.w.reed` ← v1 `reed`: d="A tall plant that grows near water" · s="The birds hide in the _____ at the edge of the lake." · a=["reeds"] · mc=["bamboo","grass","straw"]
- `g2u11.w.island` ← v1 `island`: d="A piece of land with water all around it" · s="We took a boat to a small _____ in the lake." · a=["islands"] · mc=["peninsula","coast","continent"]
- `g2u11.w.ground` ← v1 `ground`: d="The flat surface you walk on outside" · s="The apple fell from the high tree branch down to the _____ outside the house." · a=[] · mc=["sky","ceiling","roof"]
- `g2u11.w.ours` ← v1 `ours`: d="A word that means it belongs to us" · s="That house is not theirs. It is _____." · a=[] · mc=["theirs","yours","mine"]
- `g2u11.w.theirs` ← v1 `theirs`: d="A word that means it belongs to them" · s="Our garden is small, but _____ is very big." · a=[] · mc=["ours","yours","hers"]
- `g2u11.w.mine` ← v1 `mine`: d="A word that means it belongs to me" · s="This blue bag is _____. I bought it last week." · a=[] · mc=["yours","hers","his"]
- `g2u11.w.hers` ← v1 `hers`: d="A word that means it belongs to her" · s="That is not my jacket. It is _____." · a=[] · mc=["his","mine","yours"]
- `g2u11.w.his` ← v1 `his`: d="A word that means it belongs to him" · s="Tom forgot _____ lunch box at home today." · a=[] · mc=["hers","theirs","ours"]
- `g2u11.w.yours` ← v1 `yours`: d="A word that means it belongs to you" · s="Is this pencil _____? It has your name on it." · a=[] · mc=["mine","ours","theirs"]
- `g2u11.w.furniture` ← v1 `furniture`: d="Things like tables, chairs, and beds in a room" · s="We need new _____ for the living room — a sofa, a table, and some chairs." · a=[] · mc=["paint","carpets","curtains"]
- `g2u11.w.whose` ← v1 `whose`: d="A question word to ask who owns something" · s="_____ bag is this? Someone left it in the classroom." · a=["whose"] · mc=["who","which","where"]
- `g2u11.w.american` ← v1 `American`: d="A person from the USA, or something from that country" · s="My pen pal is _____. She lives in New York." · a=["Americans"] · mc=["British","Australian","Canadian"]
- `g2u11.w.cellar-2` ← v1 `cellar`: d="A room under the ground floor of a house" · s="We keep old boxes and bottles in the dark _____ below the ground floor." · a=["cellars"] · mc=["kitchen","bedroom","garden"]
- `g2u11.w.central-asia` ← v1 `Central Asia`: d="The area in the middle of the biggest continent" · s="Some families in _____ live in special round tents." · a=["Central Asia"] · mc=["South America","East Africa","Northern Europe"]
- `g2u11.w.electricity` ← v1 `electricity`: d="The power that makes lights, TVs, and fridges work" · s="We had no _____ last night because of the storm." · a=[] · mc=["gas","water","energy"]
- `g2u11.w.to-float` ← v1 `to float`: d="To stay on top of water without going down" · s="The toy boat _____ on the water in the bathtub." · a=["float","floats","floated"] · mc=["to sink","to swim","to drift"]
- `g2u11.w.moveable` ← v1 `moveable`: d="Can be moved from one place to another" · s="The desk has wheels so it is easy to move around the room. It is very _____." · a=["movable"] · mc=["heavy","fixed","stuck"]
- `g2u11.w.underneath` ← v1 `underneath`: d="Below or under something" · s="The cat is sleeping _____ the kitchen table, right below the chairs." · a=[] · mc=["on top of","next to","behind"]
- `g2u11.w.to-transport` ← v1 `to transport`: d="To take something from one place to another" · s="We used a big van to _____ the old furniture." · a=["transport","transports","transported"] · mc=["to deliver","to carry","to move"]
- `g2u11.w.hammock` ← v1 `hammock`: d="A piece of cloth you hang between two trees and lie in" · s="I love reading in the _____ in our garden." · a=["hammocks"] · mc=["swing","bench","bed"]
- `g2u11.w.cotton` ← v1 `cotton`: d="A soft white material used to make clothes" · s="This T-shirt is made of _____ and feels very soft." · a=[] · mc=["wool","silk","linen"]
- `g2u11.w.leather` ← v1 `leather`: d="Material made from animal skin, used for shoes and bags" · s="My dad has a brown _____ jacket. It is made from animal skin." · a=[] · mc=["suede","fabric","rubber"]
- `g2u11.w.material` ← v1 `material`: d="What something is made of" · s="What _____ is your school bag made of — leather, cotton, or plastic?" · a=["materials"] · mc=["colour","size","shape"]
- `g2u11.w.metal` ← v1 `metal`: d="A hard shiny thing like iron or gold" · s="The spoon is cold and made of _____. It is shiny and heavy." · a=["metals"] · mc=["wood","plastic","glass"]
- `g2u11.w.pattern` ← v1 `pattern`: d="A design with shapes, lines, or colours on something" · s="My new dress has a flower _____ on it." · a=["patterns"] · mc=["design","shape","colour"]
- `g2u11.w.plain` ← v1 `plain`: d="Only one colour, with no design on it" · s="She wore a _____ white T-shirt with jeans." · a=[] · mc=["striped","spotted","patterned"]
- `g2u11.w.plastic` ← v1 `plastic`: d="A light, cheap material used to make many things" · s="We should use less _____ to help the environment." · a=[] · mc=["rubber","metal","glass"]
- `g2u11.w.pond` ← v1 `pond`: d="A small area of water, smaller than a lake" · s="There are frogs in the _____ in our garden." · a=["ponds"] · mc=["puddle","lake","pool"]
- `g2u11.w.seat` ← v1 `seat`: d="A place where you sit, like a chair or bench" · s="Please take a _____ and wait for the doctor." · a=["seats"] · mc=["nap","shower","photo"]
- `g2u11.w.spotted` ← v1 `spotted`: d="Having small round shapes on it" · s="She wore a _____ dress that made her look like a ladybug." · a=[] · mc=["striped","plain","checked"]
- `g2u11.w.strap` ← v1 `strap`: d="A thin piece of cloth or other stuff that holds something" · s="The _____ of my watch broke and it fell off." · a=["straps"] · mc=["belt","buckle","ribbon"]
- `g2u11.w.striped` ← v1 `striped`: d="Having long lines of different colours" · s="He wore a _____ shirt that made him look like a zebra." · a=[] · mc=["spotted","plain","checked"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 2 SB Unit 11.txt -----
Unit 11 Homes
Pages 84–85
At the end of unit 11 ...
you know
 ☐ 16 words for furniture inside a room
 ☐ how to form questions with who and whose
 ☐ how to use possessive pronouns
 ☐ how to use the possessive ’s
you can
 ☐ understand a text about different types of houses and homes
 ☐ understand a group interview
 ☐ talk about your bedroom
 ☐ talk about rooms and furniture
 ☐ talk and ask about possessions
 ☐ write a text about the best place in your home
READING
1 Read the text.
Houses and Homes
We all know what a house is. It has a roof, walls, rooms, windows and doors. There might be a staircase. There might be a cellar underneath it or a garden around it. But not all houses are like this. Take a look around the world and see how different houses can be.
Image 1 (top left):
 Photo of trailer homes in a green park.
 Text:
 Around twenty million Americans live in trailer homes. They usually keep them in special parks. They are like little villages. In the park the owners connect their trailers to electricity and water. Trailers are a cheap way of living in your own home and, if you get tired of one place, you can always move your home to another park.
Image 2 (middle left):
 Photo of a yurt and people riding camels in a dry, grassy area.
 Text:
 The Americans aren’t the only people who have moveable houses. Traditionally, the Mongolian people in Central Asia move their houses a lot. Their houses are “Yurts”. When there isn’t enough grass for their sheep any more, they take down their houses. They put the parts on the backs of their camels and horses. They then carry the parts to other places where there is enough food for the animals.
Image 3 (bottom left):
 Photo of floating reed houses on a lake.
 Text:
 Other people actually live on the water. The Uros people live on Lake Titicaca in Peru. There are about two thousand of them on fifty floating islands of reeds. Reeds are long, strong grasses. They use the reeds to build their houses. When the Uros want to visit a neighbour, they move from island to island by boat.
Image 4 (top centre):
 Photo of a stilt house in Southeast Asia.
 Text:
 In some parts of the world, people live in houses that are not on the ground. For example, some people in South East Asia build their houses on stilts*. They do this because their houses are near water. The stilts keep their homes high above the water and out of danger.
 VOCABULARY: stilt – Pfahl
Image 5 (bottom right):
 Photo of a wooden treehouse in the jungle.
 Text:
 Finally, in the jungle of Costa Rica some people live in tree houses. There is even a tree house hotel. There are wooden bridges between the houses so that people can visit their neighbours easily.
2 How many of these tasks can you do?
Trailer home parks are like little villages. T / F
Trailer homes cannot be moved to other parks. T / F
Only Mongolian people move their homes. T / F
Why do Mongolian people transport their homes? .........................................................
How do they transport their homes? .........................................................
Why do people build their houses on stilts? .........................................................
The Uros people use .........................................................
The Uros people visit .........................................................
To visit your neighbours in a special hotel in Costa Rica, you .........................................................
VOCABULARY
Inside a room
3 🎧 Listen and look at the picture. Then number the words.
Word list (to be matched with numbers in the image):
 ☐ wardrobe
 ☐ bed
 ☐ table
 ☐ chair
 ☐ fridge
 ☐ cooker
 ☐ bedside table
 ☐ armchair
 ☐ sink
 ☐ cupboard
 ☐ carpet
 ☐ rug
 ☐ radiator
 ☐ sofa
 ☐ curtains
 ☐ lamp
Image Description:
 Illustration of a colourful bedroom/living room and kitchen scene with each item clearly numbered 1–16. Furniture and items are scattered across the room and labeled for identification (e.g., sofa, bed, fridge, etc.).
4 Work in pairs. One of you closes the book. Test each other.
Student A: What colour’s the table?
 Student B: It’s ...
 Student A: That’s right. / No, it’s ...
SOUNDS RIGHT
/ʊə/ /ʌ/
5 🎧 Listen and repeat.
New curtains for the window,
 new cupboards for my books.
 A wardrobe for my clothes,
 and how nice my bedroom looks!
Image: A girl smiling in her bedroom, surrounded by curtains, cupboards, and a wardrobe.
Pages 86–87
READING & SPEAKING
Talking about your bedroom
6 Look at the results of the group interview. Work in pairs. Ask questions with Who has got a ...? and Who hasn’t got a ...?
What’s in your bedroom?
	bed	computer	armchair	sofa	TV	ice cream machine
Robert	no	yes	no	yes	yes	no
Julia	yes	no	yes	yes	no	no
Sean	yes	yes	no	no	no	no

7 Read the text. Then answer the questions.
Robert: Hey Julia! Hi Sean! OK, here are the results of the interview.
 Julia: Hi Robert, wow. Why don’t you have a bed?
 Robert: I did have a bed. But it broke. Now I have a hammock!
 Sean: That’s cool.
 Julia: Who broke your bed?
 Robert: Umm ... I broke my bed!
 Sean: Oh no!
Sean: Well, I want a big bed and a big TV.
 Julia: You had a big TV!
 Sean: I did. But someone took it.
 Robert: Who took your TV?
 Sean: My mum! She thinks I watch too many cartoons.
Julia: So what’s the last one?
 Robert: You don’t remember? That’s the one thing we all want, but don’t have!
 Julia: Oh! I remember! A fridge for food!
 Robert: No, that’s not it. What we all want is ... an ice cream machine!
 Julia: Ha! Yes, that’s even better.
Questions:
What does Robert sleep in?
 ............................................................
Who wants a TV?
 ............................................................
Who wants a fridge?
 ............................................................
Who wants an ice cream machine?
 ............................................................
8 Work in pairs. Talk about your perfect bedroom.
A What’s in your perfect bedroom?
 B In my perfect bedroom, there’s a ... and a ... What about you?
A In my perfect bedroom, there’s a special machine! It does my homework!
 B Wow! My special machine ...
SPEAKING
Talking about rooms and furniture
9 Work in pairs. Look at the plan of the house. Close your book. Say what’s in each room.
Speech bubbles:
 In the living room, there’s a television, and ...
 In the kitchen, there are ...
Image Description: Floor plan of a house divided into labeled rooms: “Joanna’s room”, “bathroom”, “Mike and Nick’s room”, “living room”, “kitchen”. Each room is drawn in isometric view, showing furniture and everyday objects inside (e.g., beds, sofas, TV, chairs, table, shower, etc.).
LISTENING & SPEAKING
Talking/Asking about possessions
10
a 🎧 Listen. Which room in 9 are the people in?
 Conversation 1: .................................................
 Conversation 2: .................................................
 Conversation 3: .................................................
 Conversation 4: .................................................
b Listen again and complete with the words in the box.
Words in the box:
 mine
 yours
 hers
 his
 whose
 ours
 theirs
Dialogue 1
 Mum: 1 ‘................................... school bag is this?’
 Mike: It’s Joanna’s.
 Mum: Well, it shouldn’t be on the sofa. Take it to her room, please.
 Mike: Why me? It’s 2 ‘...................................’, not 3 ‘...................................’!
Dialogue 2
 Simon: I like your room.
 Nick: Thanks. I share it with my brother. This is my bed, and that’s 4 ‘...................................’.
 Simon: Right. Is this your laptop?
 Nick: Yes and no – I mean, it’s 5 ‘...................................’!
Dialogue 3
 Mum: 6 ‘................................... trainers are those? Are they 7 ‘...................................’?
 Joanna: No, they’re Mike’s! I borrowed them, and they got dirty – so now I’m cleaning them.
 Mum: OK, but don’t clean them here! Wash them in the kitchen!
Dialogue 4
 Mike: Dad, why is there a book here on top of the fridge?
 Dad: Oh, that – yes, can you take it to Mr and Mrs Smith next door, please?
 Mike: OK. Is it 8 ‘...................................’?
 Dad: No, it’s ours, but they want to borrow it.
Pages 88–89
🎧 11 Listen to the dialogue. Then act out similar dialogues using the things in the pictures.
Susan: Whose pen is this? Is it yours?
 Mark: No. It’s hers.
Image description:
 A girl and a boy talking at a desk. Below are five objects: a black cap, a pair of blue and white trainers, a blue ruler, a red backpack, and a pink notebook.
🎧 12 Listen and complete. Then repeat.
Whose is it? Is it yours?
 No, it isn’t 1 ______.
Whose is it? Is it Mike’s?
 No, it isn’t 2 ______.
Whose is it? Is it Sue’s?
 No, it isn’t 3 ______.
Whose is it? Jane and Paul’s?
 No, it isn’t 4 ______.
Whose is it? Whose is it?
 Give it to us.
 It’s ours!
 And it’s so good!
 Mmm!
Image description:
 A group of children sit and stand around a yellow table with snacks, laughing and talking.
WRITING
✏️ 13 Read Emily’s text and answer the questions.
Which is her favourite room?
Why does Emily like this room best?
Text box: The best place in my house
 The best place in my house is the kitchen. There’s a big table and four chairs where we have breakfast and dinner. There’s a big window and we can look into the garden. There’s a sink and a fridge, but no washing machine (that’s in the garage). Our cat’s basket is in the kitchen, too, and she sleeps there at night.
 I like the kitchen because it’s a place for all the family. It’s always warm in there, too!
Image description:
 A girl smiling at the camera, with a group of people eating at a kitchen table in the background.
✏️ 14 Write a text about the best place in your house or flat. Write 60–80 words.
Think about:
where the place is
what you do there
what it looks like
why it is your special place
GRAMMAR
❓ Questions with “Who ... ?”
Wenn du mit Who ...? nach dem Subjekt fragst, verwendest du kein do/does oder did:
 Who broke your bed?
 (Not: Who did break your bed?)
 Who wants an ice cream machine?
 (Not: Who does want an ice cream machine?)
❓ Whose ... ?
Wenn du fragen willst, wem etwas gehört, fragst du mit Whose ...?
 Whose school bag is this?
 (oder: Whose is this school bag?)
 Whose trainers are those?
 (oder: Whose are those trainers?)
’s – Possessive ’s
Wenn du sagen willst, wem etwas gehört, hängst du an den Namen der Person oder das Nomen ein ’s an:
 Whose bag is this? – It’s Joanna’s.
 They’re Mike’s trainers.
 This is my brother’s bed.
Wenn der Name oder das Nomen im Plural steht oder auf -s endet, setzt du das ’s an das Ende des Wortes ein:
 This is my parents’ room.
 It’s our neighbours’ dog.
 That’s Les’ mum.
Bei Wörtern mit unregelmäßigem Pluralform setzt du ’s ans Ende des Wortes:
 That’s the children’s school.
 Don’t take other people’s things!
🔍 Complete with he / I / it / they / she.
It’s mine.
... you ... Are they yours?
This is my bed, and that’s his.
The bag is hers.
The laptop is ours.
The book isn’t theirs.
Comic: MORE FUN WITH FIDO!
1st panel: Dog sits on a rug beside a dog basket.
 2nd panel: Girl says, “Look Fido! A new basket. It’s yours.”
 3rd panel: Dog happily lies in the new basket and says, “Home, sweet home!”
Pages 90–91
THE TWINS 5
Leo’s watch
 🔴 ▶️
Developing speaking competencies
Language function
 ☑️ I can describe an object (einen Gegenstand beschreiben)
Speaking strategy
 ☑️ I can check what someone says (bei jemandem nochmal nachhaken)
VOCABULARY
Materials and patterns
1 Match the materials and the patterns with the pictures.
MATERIALS:
 1 made of leather
 2 made of plastic
 3 made of cotton
PATTERNS:
 A spotted
 B plain
 C striped
Image descriptions (with numbers matching objects):
 1: Pink and yellow striped cotton T-shirt
 2: Black jacket with white stripes
 3: Blue plain armchair
 Also shown: sunglasses (with plastic frame), a brown leather watch strap
🎧 2 Watch or listen to the dialogue. Then read it. What’s Leo’s problem?
Leo: Hello. I’m looking for my watch. I think I lost it at school this morning.
 Assistant: OK, let’s see what we can do. What’s it like?
 Leo: Well, it’s white. It’s made of plastic.
 Assistant: OK, so it’s plain white, is it?
 Leo: No, sorry. The watch face is white with some orange on it, but the strap is different.
 Assistant: OK. So what’s the strap like?
 Leo: It’s striped. Orange, green, purple and … erm … red.
 Assistant: Are you certain?
 Leo: Yes, it’s orange, green, purple and red.
 Assistant: And what’s the strap made of?
 Leo: It’s made of metal. No, sorry. It’s made of plastic.
 Assistant: Are you sure?
 Leo: Yes, yes. It’s made of plastic, and it’s striped orange, green, purple and red.
 Assistant: OK, so let’s see what we’ve got.
Image description:
 Leo and the assistant are talking at a school’s lost-and-found desk. There are various items on the counter including a pink box.
3 Cover up the dialogue in 2. Try to answer the questions. Then check.
Where does Leo think he lost his watch?
 ………………………………………………………………………..
What’s the watch face like?
 ………………………………………………………………………..
What’s the watch strap like?
 ………………………………………………………………………..
USEFUL PHRASES
Describing an object
4 Write two sentences to describe each object.
Images:
Striped pink and yellow cotton T-shirt
Spotted black and pink sock
Blue plain armchair
It’s made of plastic.
 It’s ..........................................................................
..................................................................................
..................................................................................
❓ What do you think? Answer the questions.
Where did Leo lose his watch?
How does he find it?
📱 MOBILE HOMEWORK
Watch part 2 of the video. Read the sentences and correct them.
The assistant hasn’t got any lost and found watches.
The librarian shows Leo a watch, but it’s not his.
Leo goes to the gym to do some exercise there.
Leo talks to his friends. They don’t want to help him.
In the end, Leo finds the watch. He is wearing it.
SPEAKING STRATEGY
Checking what someone says
5 Fill in the correct words. Then check with the dialogue in 2.
1
 Leo: It’s striped. Orange, green, purple and … erm … red.
 Assistant: A…………………… you C……………………… ?
2
 Leo: It’s made of metal. No, sorry. It’s made of plastic.
 Assistant: A…………………… you S……………………… ?
6 🟥 CHOICES
A Work in pairs. A says what he/she can’t find and describes it. B checks what A says.
A: I can’t find my T-shirt. It’s … erm … blue.
 B: Are you sure?
 A: Yes, I am. It’s blue.
B ROLE PLAY: You are in a lost and found office. One of you is the assistant in the office. The other one lost something a few days ago (a watch, a phone, a pen, etc.). Work in pairs and extend it into a longer dialogue. Take 2 or 3 minutes to practise it. Don’t write it down. Act it out in class.


----- WB: More 2 WB Unit 11.txt -----
UNIT 11 – Homes
Page 87
UNDERSTANDING VOCABULARY
Inside a room
1 Match the words with the pictures. Then listen and check. 🔊
armchair
bed
bedside table
carpet
chair
cooker
cupboard
curtains
fridge
lamp
radiator
rug
sink
sofa
table
wardrobe
Image Description:
 Illustration of a room with furniture labeled A to P.
A = wardrobe
B = curtains
C = radiator
D = sofa
E = cupboard
F = sink
G = fridge
H = bedside table
I = lamp
J = armchair
K = rug
L = table
M = bed
N = carpet
O = chair
P = cooker
2 Do the puzzle and find the secret word.
Image Description:
 Pictures of furniture items numbered 1 to 8 next to a crossword puzzle. The central column of the puzzle is highlighted in pink.
Image clues:
chair
curtains
rug
wardrobe
cooker
radiator
fridge
bed
The secret word is ………………………………………… .
Page 88–89
USING VOCABULARY
Inside a room
3 There are 14 more household objects in the word search (→↓). Some of them are repeated.
 Find them and write sentences about how many objects are in the room.
Word search grid (letters in 13x13 block):
mathematica
KopierenBearbeiten
B E D P W F T O L G
E D P T A B L E Z
D R F R I D G E R
S Y R A D I A T O R
Z X H Y A Z I D
L B A X E S B E D H
E E T T Y J O M A
T S O F A U I P N I
T F R I D G E W Y R
Sample sentence prompts:
There are two fridges.
There’s one …
(Lines for student to continue writing more sentences.)
4 a Draw these items of furniture in the room below.
Items to draw (each with icon):
cupboard
rug
sofa
armchair
radiator
TV
Grid:
 A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
 1
 2
 3
 4
 5
 6
 7
 8
 9
4 b Work with a partner. Take turns to guess where your partner’s furniture is.
 The person who finds all the furniture first wins the game.
Dialogue sample:
 A: Is there anything on B9?
 B: Yes, my sofa. Have another guess.
 B: No, there isn’t. It’s my turn now.
UNDERSTANDING GRAMMAR
Possessive ’s
5 Here are some inventions* from the Ideas Office. Are the sentences T (True) or F (False)?
Characters shown above inventions (from left to right):
Professor Albu
Professor Grape
Professor Spallanzani
Doctor Hoople
Doctor Mott
Machines shown (each connected to a professor with a line):
homework machine
pizza machine
reading machine
automatic flower picker
breakfast machine
Sentences to evaluate (T / F):
Dr Mott’s machine is the breakfast machine.
Professor Albu’s invention is the pizza machine.
Professor Grape’s invention is the homework machine.
Professor Spallanzani’s invention is the automatic flower picker.
Doctor Hoople’s invention is the reading machine.
Vocabulary box:
 *invention = Erfindung
 picker = Pflücker(in)
USING GRAMMAR
Whose … ? / Possessive ’s
6 Write the questions for the answers.
Whose idea was the .................................................. ?
 → The automatic vegetable picker was Professor Newt’s idea.
.................................................................................................
 → The automatic vegetable cooker was Professor Toad’s idea.
.................................................................................................
 → The automatic vegetable feeder was my idea.
.................................................................................................
 → The reading machine was Professor Grape’s idea.
.................................................................................................
 → The homework machine was Professor Albu’s idea.
Page 90–91
7 Write the questions and answers.
[Photos of 8 children left to right:]
 Nick, Simon, Ben, James, Monica, Janet, Sue, Annabel
[Images of objects numbered 1–8:]
 1 – ear pods
 2 – pen
 3 – backpack
 4 – phone
 5 – red cap
 6 – jeans
 7 – table
 8 – guitar
1
 A Whose are those ear pods?
 B They’re Monica’s.
2
 A Whose is ............................................................
 B It’s ........................................................................
3
 A ....................................................................................
 B ....................................................................................
4
 A ....................................................................................
 B ....................................................................................
5
 A ....................................................................................
 B ....................................................................................
6
 A ....................................................................................
 B ....................................................................................
7
 A ....................................................................................
 B ....................................................................................
8
 A ....................................................................................
 B ....................................................................................
UNDERSTANDING GRAMMAR
Possessive pronouns
8 Complete the table with the possessive pronouns in the box.
 Box:
 theirs, hers, their, his, yours, his, our, her, ours, your
Subject	It’s ... cat.	The cat is ...
I	1 my	7 mine
you	2 ___________	8 ___________
he	3 ___________	9 ___________
she	4 ___________	10 ___________
we	5 ___________	11 ___________
they	6 ___________	12 ___________

USING GRAMMAR
Possessive pronouns
9 Complete the dialogue with the possessive pronouns in the box.
 Box: hers, yours, mine
Dimitri: I hate this!
 Ron: Well, whose idea was it to go for a walk?
 Dimitri: It certainly wasn’t 1 ____________.
 Ron: No? I thought it was 2 ____________.
 Dimitri: Never. Check with Anna, I think it was 3 ____________.
 Ron: I can’t, she’s too far ahead already.
10 Complete with the possessive pronouns in the box.
 Box: mine, theirs, ours, his, mine, theirs
Camp guide: Fred and Hannah, is this your key?
 Fred and Hannah: Yes, it’s 1 ____________.
 Camp guide: And is this your cap, Samir?
 Samir: No, it isn’t 2 ____________. Ask Marco. I think it’s 3 ____________.
 Camp guide: And what about these trainers?
 Maria: They’re 4 ____________, sir.
 Camp guide: Right, here you go, Maria. And these books belong to the Hart twins, right?
 Samir: No, they aren’t 5 ____________. They’re Anita’s, 6 ____________ are in their bag.
UNDERSTANDING GRAMMAR
Questions with “Who … ?”
11 Do the quiz. Match the questions and answers.
Who discovered America?
Who plays Harry Potter in the films?
Who painted the Mona Lisa?
Who sings “Born this way”?
Who wrote Romeo and Juliet?
Who invented the telephone?
Who found Tutankhamun’s tomb?
Who wrote Harry Potter?
Answers (match with numbers):
 A. Leonardo da Vinci
 B. Christopher Columbus
 C. Lady Gaga
 D. J.K. Rowling
 E. Alexander Graham Bell
 F. Howard Carter
 G. William Shakespeare
 H. Daniel Radcliffe
USING GRAMMAR
Questions with “Who … ?”
12 Write the questions.
Someone phoned me last night!
 Who phoned you ................................................................................... ?
Someone stayed at our home yesterday.
 ............................................................................................................................. ?
Someone cleaned the kitchen.
 ............................................................................................................................. ?
Someone put the lamp on the sofa.
 ............................................................................................................................. ?
I’ve got a lot of friends – one of them lives in that house.
 ............................................................................................................................. ?
Someone made a hole in the carpet.
 ............................................................................................................................. ?
Someone bought the old armchair.
 ............................................................................................................................. ?
One of you left all the cupboards open.
 ............................................................................................................................. ?
Page 92–93
READING & WRITING
Understanding/Writing a text about houses and homes
13 Read the text Houses and Homes on Student’s Book page 84 again. Match the type of home with the part of the world where they are found.
1 trailer
 2 yurt
 3 stilt house
 4 tree house
 5 reed house
☐ Mongolia
 ☐ Costa Rica
 ☐ Peru
 ☐ the USA
 ☐ South East Asia
14 CHOICES
A 1 Match the sentence halves.
1 Joanna’s favourite room
 2 When she gets home from work, she lies
 3 She can look out of the big
 4 Sometimes she also watches her favourite
 5 After her rest, she gets
☐ in her
 ☐ window and see the lake.
 ☐ up and makes dinner.
 ☐ series on the TV in the bedroom.
 ☐ house is her bedroom.
 ☐ down on the bed for half an hour.
2 Put the sentences in the correct order.
☐ laptop. He uses the laptop to watch films and listen to
 ☐ can see a big garden with lots of trees. Max spends most
 ☐ Max’s favourite room is made of wood only. From it he
 ☐ tree house. And it’s all his.
 ☐ music. But most of the time he sits there in an armchair
 ☐ of his time in his room. He has his books there and a
 ☐ and reads. It’s the only room in this house because it’s a
B Choose one of the following people. Write about the favourite room in their house.
[Image with four illustrated characters:]
Natasha Black, computer expert
Anita Snicket, teacher
Tony Galore, music fan
Rufus Rumbleodore, hypnotist
Example:
 Natasha Black lives in London. She’s a computer expert. Her favourite room is her study. There, she has got a very powerful computer with a large flat screen. She loves working on her computer. She also uses it to write emails to her friends and make phone calls to her sister in New York.
......................................................................................................................
 ......................................................................................................................
 ......................................................................................................................
 ......................................................................................................................
VOCABULARY: study = Arbeitszimmer
READING
Understanding a text about different types of houses and homes
15 a Read the blog post. What is the house made of?
 .......................................................................................................................
[Image: Blog-style interface with sections: ABOUT ME, MY POSTS (My hobbies, My bedroom, My favourite food, My holiday stone house), WRITE TO ME, FOLLOW ME]
 [Top right photo: A wooden bench in front of a scenic mountain view]
 [Below: A photo of a stone house in a mountainous area]
Blog Title: My holiday stone house
Hi, I’m Jonathan, and this is our holiday house. We don’t live there, but we spend a lot of our holidays there. The house belonged to my grandparents and they bought it from somebody else. The house is really really old. The people who built it used stones they found in the mountains.
In winter, it is very cold up there in the mountains. My grandparents moved to the village below when it got cold. We only use it in summer and then the house is wonderful. Mum, Dad, my brother and I love walking and climbing, and the house is a great starting point. Downstairs we’ve got a kitchen and a living room (all in one room) with a large open fire, because even in summer it can get pretty cold in the evenings. At the back there’s a little room with a shower and a toilet. Upstairs there are two small bedrooms. That’s enough for us, because we spend most of the day outside. We walk, climb, look for animals, read books (the internet doesn’t really work there) or play games. And it’s really quiet up there. My parents like that a lot. And my brother and I always listen to music.
b Read again. How many of these tasks can you do?
1 The house belonged to Jonathan’s grandparents.
   T / F
2 People transported the stones up the mountain.
   T / F
3 You can’t live in that house in winter.
   T / F
4 Why do they like the house so much?
   ..........................................................................................................
5 How many rooms are there?
   ..........................................................................................................
6 What rooms are they?
   ..........................................................................................................
7 When they’re there, they spend a lot of time
   ..........................................................................................................
8 They read books because
   ..........................................................................................................
9 Jonathan’s parents really like
   ..........................................................................................................
Page 94–95
LISTENING
Talking about your bedroom
17 a Listen to Chris and Ola talking about their rooms. Tick the rooms they are talking about.
[Images: Two cartoon-style bedroom illustrations for each speaker.]
Chris: Room A and Room B
Ola: Room A and Room B
VOCABULARY:
 bookshelf = Bücherregal
b Listen again and write Chris’ or Ola’s.
1 There’s a gaming computer in the room. – It’s ____________________________ room.
 2 The bed is huge. – It’s ____________________________ room.
 3 There are two armchairs. – It’s ____________________________ room.
 4 There are no curtains. – It’s ____________________________ room.
 5 There are lots of books. – It’s ____________________________ room.
 6 There are two large windows. – It’s ____________________________ room.
DIALOGUE WORK
Describing an object / Checking what someone says
18 Match the pictures and the sentences.
[Images A–F: Illustrations of various items made of different materials, including a red T-shirt, a blue plastic cup, black leather jacket, spotted bag, striped socks, and spotted coin purse.]
1 It’s made of leather. It’s plain.
 2 It’s made of leather. It’s spotted.
 3 It’s made of plastic. It’s striped.
 4 It’s made of plastic. It’s plain.
 5 It’s made of cotton. It’s plain.
 6 It’s made of cotton. It’s striped.
19 Put the words in order to make dialogues. Then listen and check.
1 A made / your / what’s / of / bag / ?
     What’s your bag made of?
   B made / it’s / leather / of / .
     It’s made of leather.
2 C tie / your / what’s / like / ?
     What’s your tie like?
   D blue / it’s / white spots / with / .
     It’s blue with white spots.
3 E sure / you / are / ?
     Are you sure?
   F am / yes, / I / was it / expensive / really / .
     Yes, I am. It was really expensive.
4 G certain / are / you / ?
     Are you certain?
   H not / no, / I / ’m / with / blue spots / it’s / white / .
     No, I’m not. It’s white with blue spots.
WORD FILE
Inside a room
[Image: Cross-section view of a modern apartment interior, labelled with vocabulary items]
wardrobe
bed
bedside table
carpet
fridge
cooker
curtain
sink
cupboard
table
chair
sofa
armchair
lamp
radiator
rug
Houses and homes
[Image: House exterior with garden and trailer. A separate inset shows a stilt house on an island.]
roof
wall
window
staircase
cellar
trailer (American English)
tree house
stilts
reed
island
ground
Page 96
Possessive pronouns
[Illustration description: A colorful park scene with different people and animals. Each person is associated with a possessive pronoun using yellow speech bubbles:]
A woman and man walking two dogs → “ours”
A woman on a bench reaching out → “theirs”
A boy sitting on grass holding a cat → “mine”
A woman pointing at something → “hers”
A boy with a bird on his shoulder → “his”
A girl handing a star-shaped object to a boy → “yours”
MORE Words and Phrases
English	Example Sentence	Deutsch
furniture	In our house, there’s lots of furniture.	Möbel
whose	Whose pen is this?	wessen
American	My mom is American.	Amerikaner/in; amerikanisch
cellar	There’s a big cellar underneath our house.	Keller
Central Asia	The Mongolian people in Central Asia move their houses a lot.	Zentralasien
electricity	The trailers can be connected to electricity and water.	Elektrizität
to float	Fifty islands of reed float on the water.	treiben; schweben
moveable	The Mongolian people have moveable houses.	beweglich
underneath	There might be a cellar underneath the house.	unterhalb
to transport	They can transport their homes.	transportieren
hammock	I have a new hammock. I like sleeping in it.	Hängematte
cotton	My jacket is made of cotton.	Baumwolle
leather	She doesn’t wear leather shoes because she wants to protect animals.	Leder
material	What material did they use to build this house?	Material
metal	It’s made of metal.	Metall
pattern	The shirt has a striped pattern.	Muster
plain	It’s plain white.	einfarbig
plastic	This bottle is made of plastic.	Plastik
pond	She falls in the pond.	Teich
seat	Take a seat.	(Sitz-)Platz
spotted	I can’t find my spotted sunglasses.	gepunktet
strap	I’ve got a watch with a blue strap.	Band
striped	My T-shirt is striped.	gestreift

```

## Output contract

Write `content/corpus/units/g2-u11/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g2-u11",
  "briefBank": "dbdedfccfbc4",
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
