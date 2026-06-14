# Vocab generation brief — g3-u05 (MORE! 3, Unit 5)

<!-- domigo:gen vocab g3-u05 bank=b87cdd08c5c9 prompt=346902f9f0f1 -->

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
| g3u05.w.to-be-unlucky | to be unlucky | Pech haben | wordfile | Luck | — | be unlucky | to be unlucky ; be unlucky |
| g3u05.w.to-make-a-wish | to make a wish | sich etwas wünschen | wordfile | Luck | — | make a wish | to make a wish ; make a wish |
| g3u05.w.to-wish-for-sth | to wish for sth. | sich etw. wünschen | wordfile | Luck | — | wish for sth. | to wish for sth. ; wish for sth. |
| g3u05.w.to-bring-luck | to bring (good/bad) luck | (Glück/Pech) bringen | wordfile | Luck | — | bring luck | to bring luck ; bring luck ; good/bad |
| g3u05.w.to-come-true | to come true | wahr werden | wordfile | Luck | — | come true | to come true ; come true |
| g3u05.w.spooky | spooky | unheimlich ; gruselig | wordfile | Luck | — | — | spooky |
| g3u05.w.to-have-luck | to have (good/bad) luck | (Glück/Pech) haben | wordfile | Luck | — | have luck | to have luck ; have luck ; good/bad |
| g3u05.w.to-believe-in-superstitions | to believe in superstitions | an Aberglauben glauben | wordfile | Luck | — | believe in superstitions | to believe in superstitions ; believe in superstitions |
| g3u05.w.alarm-clock | alarm clock | Wecker | phrase | — | I really didn't want to get up when my alarm clock rang. | — | alarm clock |
| g3u05.w.any-luck | Any luck? | Hattest du Glück? | phrase | — | Any luck? | — | Any luck? |
| g3u05.w.beside | beside | neben | phrase | — | Mr. Wallis, the teacher, arrives and sits down beside me. | — | beside |
| g3u05.w.do-you-mind | Do you mind ...? | Macht es dir etwas aus ...? | phrase | — | Do you mind ...? | — | Do you mind ...? |
| g3u05.w.evil | evil | böse | phrase | — | Candyman is an evil spirit. | — | evil |
| g3u05.w.i-m-joking | I'm joking. | Ich scherze nur. | phrase | — | I'm joking. | — | I'm joking. |
| g3u05.w.to-ignore | to ignore | ignorieren | phrase | — | Ignore him – he's just being silly. | ignore | to ignore ; ignore |
| g3u05.w.satisfied | satisfied | zufrieden | phrase | — | I am not really satisfied with your answer. | — | satisfied |
| g3u05.w.to-scream | to scream | schreien | phrase | — | I heard your scream in the middle of the night. | scream | to scream ; scream |
| g3u05.w.sleeping-bag | sleeping bag | Schlafsack | phrase | — | Nick is lying in his sleeping bag. | — | sleeping bag |
| g3u05.w.spirit | spirit | Geist | phrase | — | There is a spirit by the name of Candyman. | — | spirit |
| g3u05.w.superstition | superstition | Aberglaube | phrase | — | It's only a silly superstition, after all. | — | superstition |
| g3u05.w.to-attract | to attract | anziehen ; anlocken | phrase | — | If you whistle, you'll attract a spirit. | attract | to attract ; attract |
| g3u05.w.to-enter | to enter | betreten ; eintreten | phrase | — | When you want to enter your home, you have to turn sharply to the left or right. | enter | to enter ; enter |
| g3u05.w.haircut | haircut | Haarschnitt | phrase | — | If you get a haircut before an exam, you'll forget everything. | — | haircut |
| g3u05.w.obvious | obvious | offensichtlich | phrase | — | Isn't it obvious that you should watch your handbag carefully? | — | obvious |
| g3u05.w.traditional | traditional | traditionell | phrase | — | Traditional homes in China have large spirit screens. | — | traditional |
| g3u05.w.to-trick | to trick | austricksen | phrase | — | Some homes in China have spirit screens to trick ghosts. | trick | to trick ; trick |
| g3u05.w.unlucky | unlucky | unglücklich ; glücklos | phrase | — | In Italy, the unlucky number is 17. | — | unlucky |
| g3u05.w.to-whistle | to whistle | pfeifen | phrase | — | If you whistle when the sun is shining, it will shine for more than two hours. | whistle | to whistle ; whistle |
| g3u05.w.crack | crack | Riss ; Spalt ; Fuge | phrase | — | You'll have bad luck if you walk on the cracks in the pavement. | — | crack |
| g3u05.w.cuckoo | cuckoo | Kuckuck | phrase | — | I can hear a cuckoo in the woods. | — | cuckoo |
| g3u05.w.pavement | pavement | Gehsteig | phrase | — | I sometimes don't walk on the cracks in the pavement. | — | pavement |
| g3u05.w.rich | rich | reich | phrase | — | You'll get rich if you hear a cuckoo and shake your money. | — | rich |
| g3u05.w.to-shake | to shake | schütteln | phrase | — | I always shake the money in my pocket if I hear a cuckoo. | shake | to shake ; shake |
| g3u05.w.superstitious | superstitious | abergläubisch | phrase | — | Are you superstitious? | — | superstitious |
| g3u05.w.to-catch-a-cold | to catch a cold | sich verkühlen | phrase | — | If you don't wear a jacket, you'll catch a cold. | catch a cold | to catch a cold ; catch a cold |
| g3u05.w.toothbrush | toothbrush | Zahnbürste | phrase | — | If you drop your toothbrush, you'll have to wash it. | — | toothbrush |
| g3u05.w.to-arrange | to arrange | vereinbaren ; arrangieren | phrase | — | Have you got something else arranged? | arrange | to arrange ; arrange |
| g3u05.w.i-m-sure | I'm sure. | Ich bin mir sicher. | phrase | — | I'm sure. | — | I'm sure. |
| g3u05.w.lucky-charm | lucky charm | Glücksbringer | phrase | — | I just found a lucky charm. | — | lucky charm |
| g3u05.w.salt | salt | Salz | phrase | — | Oh no, I spilled the salt on the table. | — | salt |
| g3u05.w.seriously | seriously | ernsthaft ; im Ernst | phrase | — | You seriously believe in all these things? | — | seriously |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Barcelona, Beatles, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brighton, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, Column, Come, Complimenting, Control, Costa, Creta, Croatia, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, During, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Jun, Jupiter, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lane, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Paige, Palace, Pardon, Paris, Parsons, Past, Patti, Paul, Paula, Paws, People, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Punta, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Robert, Robertson, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Russell, Ryan, Sacks, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Tag, Take, Tale, Tamar, Tamara, Tammy, Targon, Tasmania, Tell, Telling, Text, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Uhr, Um, United, Uros, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, White, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u05.w.to-be-unlucky` ← v1 `to be unlucky`: d="To have bad luck" · s="She was very _____ today and missed the bus by just one single minute — she saw it driving away." · a=["be unlucky","unlucky"] · mc=["to be lucky","to be early","to be on time"]
- `g3u05.w.to-make-a-wish` ← v1 `to make a wish`: d="To think of something you really want and hope it happens" · s="She closed her eyes tightly and _____ silently in her head before blowing out all twelve candles on her birthday cake." · a=["make a wish","made a wish"] · mc=["to sing a song","to open her mouth","to count aloud"]
- `g3u05.w.to-wish-for-sth` ← v1 `to wish for sth.`: d="To want something very much and hope to get it" · s="What did you secretly _____ for when you blew out the candles on your birthday cake?" · a=["wish for","wished for"] · mc=["to ask aloud for sth.","to pay for sth.","to sell sth."]
- `g3u05.w.to-bring-luck` ← v1 `to bring (good/bad) luck`: d="To cause good or bad things to happen" · s="Some superstitious people think that seeing a black cat crossing your path _____ bad luck to you." · a=["bring luck","brings luck","brought luck","bring bad luck","brings bad luck"] · mc=["to take away luck","to cancel luck","to clean up luck"]
- `g3u05.w.to-come-true` ← v1 `to come true`: d="When a wish or dream really happens" · s="I really hope my biggest dream of visiting Japan next year will _____ one day soon when I save enough money." · a=["come true","came true"] · mc=["to never happen","to stay a dream","to be impossible"]
- `g3u05.w.spooky` ← v1 `spooky`: d="A bit scary and strange, like ghosts" · s="The old abandoned house on the dark hill at night looks really _____ with broken windows and creaking doors." · a=[] · mc=["cheerful","bright","friendly"]
- `g3u05.w.to-have-luck` ← v1 `to have (good/bad) luck`: d="When good or bad things happen to you by chance" · s="I _____ really good luck today — I found a €5 note on the street on my way to school!" · a=["have luck","have good luck","have bad luck","had luck"] · mc=["to miss out on luck","to lose all luck","to need more luck"]
- `g3u05.w.to-believe-in-superstitions` ← v1 `to believe in superstitions`: d="To think that old beliefs about luck are true" · s="Do you really _____ in silly superstitions like walking under ladders being bad, or are you just joking?" · a=["believe in superstitions"] · mc=["to laugh at superstitions","to study superstitions","to forget superstitions"]
- `g3u05.w.alarm-clock` ← v1 `alarm clock`: d="A device next to your bed that makes a noise to wake you up" · s="My loud ringing _____ didn't work this morning at 7 am, so I overslept and was late for the school bus." · a=["alarm clock","alarm clocks"] · mc=["phone","TV","radio"]
- `g3u05.w.any-luck` ← v1 `Any luck?`: d="A question to ask if someone was successful" · s="Did you finally find your lost house keys under the sofa? _____" · a=["Any luck"] · mc=["Good luck!","Have fun!","Take care!"]
- `g3u05.w.beside` ← v1 `beside`: d="Next to, at the side of" · s="She sat down quietly _____ me on the sofa so close that our shoulders touched." · a=[] · mc=["far from","across from","opposite"]
- `g3u05.w.do-you-mind` ← v1 `Do you mind ...?`: d="A polite way to ask if something is OK" · s="_____ if I open the big window? It's very hot in here and I need fresh air to cool down." · a=["Do you mind"] · mc=["Do you like ...?","Do you want ...?","Can you ...?"]
- `g3u05.w.evil` ← v1 `evil`: d="Very bad, wanting to hurt others" · s="In the classic fairy tale, the _____ queen wanted to poison the beautiful young princess with a red apple." · a=[] · mc=["kind","good","friendly"]
- `g3u05.w.i-m-joking` ← v1 `I'm joking.`: d="A way to tell someone you are not being serious" · s="Don't worry and don't be upset, _____! I didn't really eat your last chocolate bar — it's in the fridge." · a=["I'm joking"] · mc=["I'm serious.","It's true.","I mean it."]
- `g3u05.w.to-ignore` ← v1 `to ignore`: d="To act as if someone or something is not there" · s="She was very angry at her little brother and decided to _____ him all day by not talking or looking at him." · a=["ignore","ignored"] · mc=["to hug","to play with","to help"]
- `g3u05.w.satisfied` ← v1 `satisfied`: d="Happy with what you have or what happened" · s="The teacher was very _____ with my excellent test results — I got 95% and she gave me a big smile." · a=[] · mc=["disappointed","angry","upset"]
- `g3u05.w.to-scream` ← v1 `to scream`: d="To shout very loudly, often because you are scared" · s="She _____ out loud in fright when she saw the huge black spider crawling on the kitchen wall." · a=["scream","screamed"] · mc=["to whisper","to smile","to sing"]
- `g3u05.w.sleeping-bag` ← v1 `sleeping bag`: d="A warm cover you lie in when camping outdoors" · s="Don't forget to bring your warm _____ for the overnight school trip — we'll sleep inside them in the tent." · a=["sleeping bag","sleeping bags"] · mc=["pillow","blanket","duvet"]
- `g3u05.w.spirit` ← v1 `spirit`: d="A ghost or the soul of a dead person" · s="The scared children told ghost stories about a white _____ that lives in the old haunted castle on the hill." · a=["spirits"] · mc=["fairy","goblin","dragon"]
- `g3u05.w.superstition` ← v1 `superstition`: d="A belief that certain things bring good or bad luck" · s="The silly idea that the number 13 is unlucky is just a _____ — there's no real proof that it causes bad luck." · a=["superstitions"] · mc=["fact","law","science"]
- `g3u05.w.to-attract` ← v1 `to attract`: d="To make someone or something come closer" · s="The bright colourful flowers in our garden _____ many honey bees and butterflies during the warm summer months." · a=["attract","attracted"] · mc=["to chase away","to scare","to hurt"]
- `g3u05.w.to-enter` ← v1 `to enter`: d="To go into a place" · s="Please take off your dirty shoes at the door before you _____ the clean house — it's our family rule." · a=["enter","entered"] · mc=["to leave","to exit","to run out of"]
- `g3u05.w.haircut` ← v1 `haircut`: d="When your hair is cut shorter by a hairdresser" · s="You look very different today — did you just get a new _____ at the hair salon? It's much shorter now." · a=["haircuts"] · mc=["new hat","new jacket","new jewellery"]
- `g3u05.w.obvious` ← v1 `obvious`: d="Easy to see or understand" · s="It was absolutely _____ that she was really tired because she kept yawning and rubbing her eyes in class." · a=[] · mc=["hidden","secret","mysterious"]
- `g3u05.w.traditional` ← v1 `traditional`: d="Done in the same way for a long time" · s="On Christmas Day, we always eat a _____ turkey dinner with the whole family, just like my grandparents did." · a=[] · mc=["modern","new","unusual"]
- `g3u05.w.to-trick` ← v1 `to trick`: d="To make someone believe something that is not true" · s="My clever brother _____ me into eating a really hot chilli yesterday by telling me it was a sweet pepper." · a=["trick","tricked"] · mc=["to help","to warn","to tell the truth to"]
- `g3u05.w.unlucky` ← v1 `unlucky`: d="Having or bringing bad luck" · s="Many people think that the number 13 is _____ and avoid choosing hotel rooms or flights with that number." · a=[] · mc=["fortunate","blessed","favourite"]
- `g3u05.w.to-whistle` ← v1 `to whistle`: d="To make a high sound by blowing air through your lips" · s="He always _____ his favourite pop song while walking happily to school in the morning with his lips." · a=["whistle","whistled","whistles"] · mc=["to silently think","to write","to read"]
- `g3u05.w.crack` ← v1 `crack`: d="A thin line or opening in a surface" · s="There is a big zigzag _____ in the old plaster wall of our house that needs to be fixed by a builder soon." · a=["cracks"] · mc=["painting","poster","window"]
- `g3u05.w.cuckoo` ← v1 `cuckoo`: d="A small grey forest bird known for its repeated two-syllable call in spring." · s="We could clearly hear a _____ calling its name over and over from the tall green forest trees on our spring walk." · a=["cuckoos"] · mc=["wolf","owl","bat"]
- `g3u05.w.pavement` ← v1 `pavement`: d="The hard path next to a road where people walk" · s="Walk on the _____ next to the buildings, not on the busy road — it's much safer for pedestrians." · a=["pavements"] · mc=["road","grass","railway"]
- `g3u05.w.rich` ← v1 `rich`: d="Having a lot of money" · s="The _____ businessman bought a huge mansion with 20 rooms, a swimming pool, and three sports cars." · a=[] · mc=["poor","broke","homeless"]
- `g3u05.w.to-shake` ← v1 `to shake`: d="To move something quickly from side to side or up and down" · s="_____ the juice bottle well with your hand up and down before you drink to mix the pulp at the bottom." · a=["shake","shook","shaken"] · mc=["to open","to hold","to carry"]
- `g3u05.w.superstitious` ← v1 `superstitious`: d="Believing that certain things bring good or bad luck" · s="My elderly grandmother is very _____ and refuses to walk under a ladder or break a mirror because of bad luck." · a=[] · mc=["logical","scientific","realistic"]
- `g3u05.w.to-catch-a-cold` ← v1 `to catch a cold`: d="To get ill with a runny nose and cough" · s="Wear a thick warm jacket in the snow or you might _____ and be sick in bed for a week with a runny nose." · a=["catch a cold","caught a cold"] · mc=["to stay perfectly healthy","to feel great","to get stronger"]
- `g3u05.w.toothbrush` ← v1 `toothbrush`: d="A small brush you use to clean your teeth" · s="I need a new _____ — the old one I use to clean my teeth every morning is too worn out with bent bristles." · a=["toothbrushes"] · mc=["hairbrush","paintbrush","makeup brush"]
- `g3u05.w.to-arrange` ← v1 `to arrange`: d="To plan or organise something" · s="Let's _____ a meeting for next Tuesday after school at 4 pm in the library to work on our project." · a=["arrange","arranged"] · mc=["to cancel","to skip","to forget"]
- `g3u05.w.i-m-sure` ← v1 `I'm sure.`: d="A way to say you are certain about something" · s="Will the train come soon? — _____. It's always exactly on time at 3:15 pm every day without fail." · a=["I'm sure"] · mc=["I doubt it.","Maybe.","Probably not."]
- `g3u05.w.lucky-charm` ← v1 `lucky charm`: d="An object that you think brings you good luck" · s="She always carries her small _____ — a tiny silver horseshoe — in her pocket during every school exam for good luck." · a=["lucky charm","lucky charms"] · mc=["spelling book","calculator","pencil case"]
- `g3u05.w.salt` ← v1 `salt`: d="White powder you put on food to give it more taste" · s="Can you please pass me the _____ shaker, please? My vegetable soup tastes a bit too bland and needs seasoning." · a=[] · mc=["sugar","honey","jam"]
- `g3u05.w.seriously` ← v1 `seriously`: d="Really, not joking" · s="Are you _____ going to try to eat all five big burgers by yourself? That's way too much food for one person!" · a=[] · mc=["jokingly","never","pretending to be"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 5.txt -----
Unit 5 Superstitions
Pages 42–43
At the end of unit 5 …
you know
 ☑ 8 words and phrases to talk about superstitions in different countries
 ☑ how to use the 1st conditional
 ☑ how to use unless
you can
 ☑ understand a play and a text about superstitions
 ☑ understand an interview about superstitions
 ☑ talk about superstitions and consequences
 ☑ write if-sentences about superstitions
 ☑ write a dialogue about superstitions
READING
Understanding a play
 🔹 1 Read the play.
Candyman
Scene 1
Ana, Nick and Dan are on a school trip in the countryside. They are sitting around a late-night campfire.
Ana That’s just silly. Of course it’s not true.
 Nick Are you sure? Why don’t you try it?
 Ana Because I don’t want to. What do you think, Dan? Dan!
 Dan What … What … I’m sorry. I think I fell asleep for a few minutes. What are you talking about?
 Ana Nick says that if you look into a mirror and say “Candyman” three times, an evil spirit will appear in front of you.
 Nick Yes, and then he leaves the mirror to come and … GET YOU!
 Ana Stop it, Nick. It’s not funny.
 Nick Did I make you jump?
 Dan Don’t listen to him, Ana. He just wants to scare you.
 Nick Well, that’s what people are supposed to do around campfires, Dan. Scare each other. So it’s not true.
 Dan Of course not. It’s just a silly superstition like if you break a mirror, it brings you seven years’ bad luck.
 Nick Or if you see a rainbow, you can make a wish.
 Dan Exactly. Those wishes never come true, do they?
 Nick They do if you wish for something bad, but no one ever does that.
 Dan Ignore him, Ana. He’s just being silly.
Scene 2
Mr Wallis, the teacher, arrives and sits down beside them.
Mr Wallis Are you three still awake? Everyone else is already in bed.
 Nick Sorry, Mr Wallis. We’re just telling some campfire stories.
 Mr Wallis Nothing too scary I hope. (laughing) I don’t want any of you waking me up in the middle of the night with your screams.
 Ana Well, Nick is trying to scare me, but I know he’s just being silly.
 Mr Wallis Good, because I want you three in your tents and fast asleep in ten minutes. We’ve got a big day tomorrow and I want everyone up and having breakfast by 7 a.m.
 Dan OK, I’m really ready for bed anyway.
 Nick I know you are. You keep falling asleep.
 Mr Wallis OK then. Goodnight and remember, be careful what you dream about.
 Ana What do you mean?
 Mr Wallis Well, you know what they say about your first night in a new bed.
 Nick No, what do they say?
 Mr Wallis They say that whatever you dream about comes true.
 Dan Mr Wallis! You’re worse than Nick!
Scene 3
Nick is in his sleeping bag. He is dreaming.
Ana Come on, Nick. Follow me.
 Nick Where are we going?
 Ana Don’t you worry. Just come with me.
 Nick Wow, this house is really spooky. Who lives here?
 Ana Oh, no one special. Just a spirit by the name of Candyman.
 Nick I’m not scared.
 Ana Here we are – the bathroom. After you.
 Nick Dan, what are you doing here?
 Dan I’m waiting for you.
 Nick And Mr Wallis. Is that you?
 Mr Wallis Yes, it is. Nick. We’re all here.
 Nick So what are you waiting for?
 Ana What do you mean?
 Dan There’s the mirror. Remember: three times. Nice and loud.
 Mr Wallis Do it.
 Nick Oh, alright. Candyman. Is that OK?
 Ana And again.
 Nick Candyman. Satisfied?
 Dan And one more time.
 Nick Really? Do I really have to do this?
 Mr Wallis Of course you do. Come on now.
 Nick CANDYMAN!
Scene 4
It’s the next morning. Dan is sitting eating his breakfast. Ana joins him with a tray of food.
Ana Hi, Dan, do you mind if I sit and join you?
 Dan Not at all. Have a seat.
 Ana So, did you sleep well?
 Dan I had a wonderful night’s sleep. I really didn’t want to get up when my alarm clock rang.
 Ana Me too. I never knew sleeping in a tent could be so good.
 Dan It’s all that fresh country air.
 Ana So did your dreams come true?
 Dan Did my dreams come true?
 Ana I’m not sure what you mean.
 Dan Don’t you remember, before we went to bed last night? Mr Wallis said that dreams in a new bed always come true.
 Ana Oh yes, I remember. Well, I guess he was right.
 Dan He was right?
Image descriptions
Scene 1: Three students (Ana, Nick, and Dan) sit around a glowing campfire at night, surrounded by trees. They are talking and seem slightly nervous.
Scene 3: Nick is lying in his sleeping bag, dreaming. In his dream, Ana, Dan, and Mr Wallis are near a glowing mirror, asking him to say “Candyman.”
Scene 4: Dan is eating breakfast with a tray. Ana arrives with her tray to sit next to him. Both look relaxed and cheerful.
Pages 44–45
Scene 5
 Dan and Ana meet outside the camp washrooms.
Ana Any luck?
 Dan No. There’s no sign of him anywhere.
 Ana I’m starting to get really worried.
 Dan Don’t be silly. You know Nick. It’s just one of his silly jokes.
 Ana But Mr Wallis wants us all ready to go in five minutes.
 Dan He’ll be here. I promise you. Now, if you’ll excuse me.
 Ana Where are you going?
 Dan In here. I’m just going to wash my face and brush my teeth.
Scene 6
 Dan is in the washroom brushing his teeth.
Dan 🎵 Because I’m happy ... happy ...
 h.a.p.p.y ... happy 🎵🎵
 Voice Help me! Help!
 Dan What! Who’s that? Who’s there?
 Voice It’s me, Dan. Nick. It’s Nick.
 Dan Nick? Nick, is that you? Where are you?
 Voice I’m here, Dan. I’m right in front of you. Look.
 Dan What does he mean, right in front of me? There’s nothing but a mirror in front of ... Oh my god! Nick – what happened?
 Voice Help me! Help ...
🔹 2 How many of these tasks can you do?
1 Complete the sentences with no more than 4 words.
 1 Candyman is an evil spirit who lives …
 2 Tomorrow the children have to wake up ……………………………………… 7 a.m.
 3 In his dream, Nick talks to ……………………………………… and Mr Wallis.
 4 When Dan woke up, he ☐ wanted to stay in bed. ☐ felt strange.
 ☐ forgot he was in the countryside.
 5 Ana’s dream ☐ was very unusual. ☐ was funny. ☐ came true.
 6 In scene 5, Dan is ☐ more worried than Ana about Nick. ☐ ready to go out for the day.
 ☐ sure that Nick is playing a trick on them.
 7 What do you think happened to Nick?
 ……………………………………………………………………………………………………………………………
 8 What do you think happens next?
 ……………………………………………………………………………………………………………………………
 9 What superstitions do you have?
 ……………………………………………………………………………………………………………………………
🔹 3 Check your answers with a partner. Then listen to the play.
VOCABULARY Luck
 🔹 4 Complete the sentences with the words in the box.
 superstitions – brings – spooky – believe – wish – unlucky – come – make
1 If you break a mirror, it …………………………………… you seven years’ bad luck.
 2 If you see a rainbow, you can …………………………………… a wish.
 3 Those wishes never …………………………………… true, do they?
 4 They come true if you …………………………………… for something bad.
 5 I think …………………………………… are silly and so are the people who believe them.
 6 Do you …………………………………… in ghosts?
 7 Dan’s so …………………………………… . Bad things always seem to happen to him.
 8 I broke a mirror and bad things are happening to me. It’s a bit …………………………………… .
READING & SPEAKING Talking about superstitions
 🔹 5 a Read the texts about superstitions in different countries.
1 China
 Traditional homes in China have large spirit screens to trick ghosts. When you want to enter your home, you have to turn sharply to the left or right. Ghosts can only go in straight lines, so they will end up in the spirit screen.
2 The Caribbean
 If you put your handbag on the floor, you will never have money.
3 Japan
 If you don’t cover your ears when it thunders, Raijū, the thunder beast, will come and eat you.
4 Vietnam
 If you get a haircut before an exam, you’ll forget everything you’ve learnt.
5 Norway
 If you whistle when the sun is shining, it will shine for more than two hours.
6 Italy
 In Italy, the unlucky number is 17. And 13 is a lucky number. Why 17? If you know Latin, you’ll know the answer. The Latin XVII is an anagram of VIXI which means, “I lived.”
🔹 b Some of these superstitions are not true. Discuss with a partner which ones you think are made up. Then listen and find out.
(Three children appear in the discussion bubble below the texts.)
Child 1: I don’t think number 1 is true. If there are ghosts, they couldn’t be tricked like that.
 Child 2: Hmmm … good point. I agree with you.
 Child 3: Well, I’m not so sure. Look at the photograph!
Image descriptions:
Scene 5: Ana and Dan stand in the cold morning light outside the washrooms, looking worried.
Scene 6: Dan is brushing his teeth in front of a mirror; he looks surprised and disturbed.
China: A decorative screen in a hallway.
The Caribbean: A brown handbag lies on a tiled floor.
Japan: A mythical beast with claws, horns, and lightning surrounds a person.
Vietnam: A child receives a haircut.
Norway: A girl whistles with the sun shining on her.
Italy: The Roman numeral XVII carved into a stone.
Pages 46–47
🔹 6 Listen to the interviews with Aileen, Brian, Catherine and Damon. Write the first letters of their names (A, B, C and D) beside the superstitions they believe in.
☐ If you break a mirror, you’ll have bad luck.
 ☐ If a black cat crosses the street in front of you, you’ll have bad luck.
 ☐ If you have a tiger’s eye on you, it will bring you good luck.
 ☐ You’ll get rich if you hear a cuckoo and shake your money.
 ☐ If you kill a spider in the house, you’ll have bad luck.
 ☐ If you buy a ticket with the number 13 on it, you’ll have bad luck.
 ☐ If you walk under a ladder, you’ll have bad luck.
 ☐ You’ll have bad luck if you walk on the cracks in the pavement.
Image: A tiger’s eye stone with a label "tiger’s eye".
🔹 7 Listen to the sentences and mark the stressed words. Then say the sentences yourself.
1 If you break a mirror, you’ll have bad luck.
 2 If you kill a spider, you’ll have bad luck.
 3 If you don’t whistle, there won’t be any rain.
 4 If you see a magpie*, you’ll get bad news.
 5 If you close your eyes and make a wish, your wish will come true.
*VOCABULARY: magpie – Elster
🔹 8 Work in pairs. Ask and answer questions. Think of funny dialogues.
 A choose a picture, B a sentence.
A: What will happen if you dance on your desk for two hours?
 B: You will be a social media star next month.
Pictures:
for two hours
at midnight
in the afternoon
in the morning
late on Sunday
at Easter
Sentences:
You will wake up as a princess the next day.
You will only get up at lunchtime the next day.
You will do great in the next school test.
You will win a lot of money.
You will meet the president.
You will be a social media star next month.
🔹 9 A Make up six funny superstitions (60–80 words). Write them down.
 e.g. If you drop your toothbrush in the morning, you’ll catch a cold the next day.
Make sure you use correct if-sentences.
Make sure they have a surprise element so your readers find them funny.
Make sure you don’t repeat yourself with your ideas.
🔹 B Write a dialogue between two people (100–120 words). One of them tells the other about a superstition and how he/she believes in it. The other person doesn’t believe in superstitions.
Use at least two examples of the 1st conditional.
Use at least one sentence using unless.
Tip box:
 Try working in pairs.
 If you do that, you’ll probably have more ideas and you can help each other to get the language right.
GRAMMAR
 🔹 1st conditional
 You use the 1st conditional to describe what consequences an action or a situation will have.
If you put your handbag on the floor, you’ll never have money.
 You’ll have bad luck if you walk on cracks in the pavement.
 If you don’t whistle, there won’t be any rain.
What will happen if you break a mirror?
Complete with will / present simple / verb:
If-clause: If + person + 1 …………………………………………
 Main clause: person + 2 ………………………………………… + 3 …………………………………………
🔹 unless
 How to use it: Unless means if … not.
I’ll go and look for him after breakfast, unless he comes here first. (= if he doesn’t come here first)
 Unless you put up a spirit screen, the ghosts can follow you into your home.
 (= if you don’t put up a spirit screen, …)
Image: A person walking on pavement cracks. Caption: “You’ll have bad luck if you walk on cracks in the pavement.”
Pages 48–49
🔴 1 Watch or listen to the dialogue. Then read it.
 What’s Kate’s problem?
Tom Hey, Kate. Just the person I wanted to see.
 Kate Really? Lucky me.
 Tom The 1975 are playing in Brighton a week on Friday! Are you free?
 Kate Let me see. Am I free? Of course I’m free!
 Tom So how about that? Do you want to go and see them?
 Kate I’d love to. I’ll have to check with my mum and dad, but I’m sure they won’t mind. How do you want to get there?
 Tom We could go by train. It’s only half an hour away from here.
 Kate Hmm – possibly, but I’m not sure my dad would like that. He still thinks I’m a little girl.
 Tom We could ask my mum. She’d take us, I’m sure. Her best friend lives in Brighton so she could go and see her and pick us up after the show.
 Kate That’d be great. Your mum is so cool.
 Tom I know. She’ll probably let me use her credit card to buy the tickets too.
 Kate I’ll get my dad to give me some money to pay you back. So let me just put this in my diary. So Friday next week, you say?
 Tom That’s right.
 Kate Oh! Oh dear. Tom, I’m really sorry but I can’t make it.
 Tom Have you got something else arranged?
 Kate No, I haven’t. It’s just that next Friday is the 13th!
 Tom And?
 Kate Friday the 13th! I can’t travel anywhere. It’s unlucky!
 Tom You’re joking, right.
 Kate I’m not. Sorry.
 Tom Wait. So, we’re not going to see The 1975 because of a superstition.
 Kate I’m sorry. I’m superstitious.
 There’s nothing I can do about it.
🔴 2 Correct the sentences.
1 One of Tom’s favourite bands have a concert in Brighton this Friday.
 …………………………………………………………………………………
 2 Kate doesn’t really like The 1975.
 …………………………………………………………………………………
 3 Tom thinks they should take a bus to the concert.
 …………………………………………………………………………………
 4 Tom’s dad doesn’t always let him do what he wants to do.
 …………………………………………………………………………………
 5 Tom’s mum’s sister lives in Brighton.
 …………………………………………………………………………………
 6 Tom’s going to ask his dad for the credit card.
 …………………………………………………………………………………
🟠 3 Match the sentence halves. Check in the dialogue.
☐ 1 Are you
 ☐ 2 How about
 ☐ 3 We could
 ☐ 4 Do you want
 ☐ 5 That’d
 ☐ 6 I’d love
a. to go and see them?
 b. free?
 c. be great.
 d. go by train?
 e. to.
 f. that?
❓What do you think? Answer the questions.
Is Kate really superstitious?
Do they go to the concert?
🟠 Mobile Homework
 Watch part 2 of the video and complete Kate’s diary entry.
A list of the superstitions I told Tom I believed in (and he believed me!):
Never travel on 1……………………………………………………………………
Never walk under a 2……………………………………………………………………
Always knock on wood 3…………………………………………………………………… for good luck.
Breaking a mirror brings 4……………………………………………………………………
Never have a 5…………………………………………………………………… cat.
Throw spilled salt over 6…………………………………………………………………… for good luck.
🟠 4 Complete. Then check with the dialogue in 1.
1 Tom The 1975 are playing in Brighton a week on Friday! Are you free?
 2 Kate I …………………………… m_……………………………. S……………………………. Am I free? Of course I’m free!
 3 Tom We could go by train. It’s only half an hour away from here.
 4 Kate Hmm … p……………………………_, but I’m not sure my dad would like that.
🟠 5 ROLE PLAY: Work in pairs. Look at your role cards. Take 4–5 minutes to practise your dialogue.
 Don’t write it down. Act it out for the rest of the class.
Student A
 Think of a list of things to do for a perfect Saturday. Find out if your partner is free and arrange to do these things with him/her.
Student B
 Listen to your partner. Think about accepting the invitation.


----- WB: More 3 WB Unit 5.txt -----
Unit 5 Superstitions
Pages 38–39
1 Put the dialogues in the correct order.
DIALOGUE 1
 A □ What other things do you do?
 B □ Why not?
 C □ Are you superstitious?
 D □ Well, for example, I never walk under a ladder.
 E □ Because it’ll bring me bad luck, of course.
 F □ Yes, I am. I’m the kind of person who always makes a wish when I blow out the candles on my birthday cake.
DIALOGUE 2
 A □ Why not?
 B □ Do you believe if you make a wish, it can come true?
 C □ So you don’t have a lucky charm, for example?
 D □ No, I don’t. I think they’re silly.
 E □ I just don’t. I don’t believe in superstitions.
 F □ No, not at all.
2 Complete with the words from the box.
wished for unlucky spooky my wish didn’t come true bring you luck make a wish believe in good luck
I know this is a silly story and if you don’t ............................................................. superstitions, you’ll laugh about it. I once bought one of those ribbons* that ............................................................. .
One day in winter, I climbed a ladder to get a good view of a building. It was a bit scary because there was nobody else around and there was strong wind. Suddenly I slipped. I held on tight, but I couldn’t get my legs back on the ladder. I ............................................................. someone to save me, but ............................................................. and I fell. I landed in the snow. That was the last thing I remember.
When I woke up again, I was sitting at a table in a dark room. It was a bit ............................................................. . A man said, “I found you in the snow and brought you here. I’ve no idea how long you were there. I think I’m lucky to be alive. I’m sure I had such good luck because I was wearing the ribbon. No broken bones and I didn’t even catch a cold! Now, whenever I ............................................................. , I always touch my ribbon first. I’ll never be ............................................................. again.
VOCABULARY: *ribbon – Schleife
3 Fill in the correct forms of bring, make, come.
If you break a mirror, it ............................................................. bad luck they say.
 And if you break a vase, would that be OK?
If you see a rainbow, ............................................................. you ............................................................. a wish? Yes or no?
 Will the wish ............................................................. true, I don’t think so; well, do you?
I ............................................................. so many wishes, none’s ............................................................. ever true.
 Maybe I ............................................................. many wishes, 7 ............................................................. bad luck to you.
4 Match the sentence halves.
1 If you wear that T-shirt,
 2 If you invite her to the cinema,
 3 If you touch that dog,
 4 If it’s hot tomorrow,
 5 If I phone you at nine,
 6 If he drives that fast,
 7 If we leave now,
 8 If I give you some money,
□ it’ll bite you.
 □ will you be at home?
 □ he’ll have an accident.
 □ we’ll go to the beach.
 □ we’ll be home by ten.
 □ you’ll look really good.
 □ will you buy some chocolate for me?
 □ I’m sure she’ll say yes.
5 Match four of the sentences in 4 with the pictures.
Image A: Two girls standing together, one giving money to the other.
 Image B: Two girls, one looks surprised or happy; they seem to be at school.
 Image C: A girl giving chocolate to a boy who looks pleased.
 Image D: A car accident involving a boy and his bike.
6 Choose the correct forms.
1 A Come on. Hurry up.
  B Don’t worry. If we miss / will miss the bus, we take / will take a taxi.
2 A I don’t want to eat an orange, Mum.
  B But if you don’t eat / won’t eat fruit, you get / will get a cold.
3 A I’m sorry. I’m really busy.
  B Oh please! If you help / will help me, I give / will give you my best pen.
4 A Jeff eats too many sweets.
  B I know. If he doesn’t stop / won’t stop eating sweets, he has / will have problems with his teeth.
5 A Oh no! I’m going to be late for school again.
  B Then go now. You are / will be OK if you run / will run.
6 A She goes / will go to the party if you invite / will invite her.
  B Do you think so? I don’t think she likes me very much.
7 Complete with the correct form of the verbs in brackets.
1 If I ............................................................. (break) your phone, I ............................................................. (buy) you a new one.
 2 If you ............................................................. (not understand) your homework, I ............................................................. (help) you.
 3 I ............................................................. (not tell) anyone if you ............................................................. (tell) me.
 4 If you ............................................................. (practise) more, you ............................................................. (get) better.
 5 If you ............................................................. (drive) so fast, we ............................................................. (have) an accident.
 6 My mum ............................................................. (give) us a lift home if we ............................................................. (go) to the party.
 7 If it ............................................................. (not rain), we ............................................................. (go) to the beach.
 8 I ............................................................. (send) him a text if he ............................................................. (not call).
Pages 40–41
8 Use the words to make questions.
1 What / you do / rain / at the weekend?
 What will you do if it rains at the weekend?
2 What programme / you watch / turn on the TV tonight?
 .......................................................................................................................
3 What / you eat / feel hungry / after dinner tonight?
 .......................................................................................................................
4 Where / you go / go away / this weekend?
 .......................................................................................................................
5 What / you play / play sport / this weekend?
 .......................................................................................................................
6 Who / you talk to / phone someone / tonight?
 .......................................................................................................................
9 Rewrite the sentences using unless.
1 I won’t help him with his work if he doesn’t ask me to.
 I won’t help him with his work unless he asks me to.
2 If it is not very important, he won’t phone me.
 He won’t phone me ...................................................
3 He will be sick if he doesn’t stop eating.
 .......................................................................................................................
4 If you don’t study for the test, there won’t be a party.
 .......................................................................................................................
5 You won’t be here in time if you don’t run.
 .......................................................................................................................
6 Mary won’t have to go there if she doesn’t want to.
 .......................................................................................................................
7 He won’t speak if you don’t speak to him first.
 .......................................................................................................................
10 Look at the pictures. Write down what Lucas says.
Image descriptions (from top left to bottom right):
A boy holding his arm, apparently hurt, and a man pointing.
A red car crashed into a tree.
A girl pointing angrily.
A boy crossing his arms.
A smiling girl pointing at the boy.
A barking dog looking angry.
1 If my dad is angry with me, … he won’t speak to me for a week.
 2 If my mother is angry with me, ...................................................
 3 If my grandfather is angry with me, ...................................................
 4 If my sister is angry with me, ...................................................
 5 If my friend is angry with me, ...................................................
 6 If my dog is angry with me, ...................................................
11 Read the story. Why was Carla happy at the end of the story?
Bad luck?
 (Image of a girl with hands up in doubt. She has brown hair and is wearing a purple hoodie. Behind her is a large number 13 and the word “Friday” suggesting Friday the 13th.)
Text:
Carla was superstitious. In fact, Carla was so superstitious she hated leaving her house. There was lots of danger outside: Black cats and all the bad luck they bring. Ladders over pavements blocking her way and all those cracks in the pavement. Everyone knows what bad luck it is to step on a crack.
Carla liked her house. Her house was nice and safe. It was superstition-proof. There were no mirrors, so she was in no danger of seven years bad luck if she was to break one. And because it is bad luck to open an umbrella inside a house, she had no umbrellas in hers. There was no salt, so she never had to worry about what to do if she ever spilled any. Carla loved her house and she tried to spend as much time in it as she could.
But, of course, no one can stay in their house forever. Carla needed money to pay for her house, so five times a week, Carla left her house at exactly 8.30 and walked the 20 minutes it took her to get to the pet shop where she worked. Then at 5 p.m., she walked the 20 minutes back to her house. On Wednesdays, she stopped for 15 minutes at One Stop to do her shopping for the week.
It was a Friday. It was not only Friday. It was Friday the 13th. When Carla woke up and saw that date on her phone, she started to panic. She phoned the shop to ask for the day off, but Mr Morris, her boss, needed her. The shop was expecting a delivery of 13 black cats and he needed her to be there.
She opened the front door. The wind was blowing hard. The rain was pouring down. Of course, she had no umbrella so she stepped out into the storm and made her way to work. She got to One Stop. They were fixing the roof and there was a ladder on the pavement. She took a deep breath, closed her eyes and ran under the ladder.
Carla made it to work. She was wet, but nothing too bad had happened to her. The cats arrived. Even Carla had to agree they were cute.
At 3 p.m. a police officer entered the shop looking for someone. She had some bad news. A storm had brought down the huge tree opposite her house. It had crashed through the roof into Carla’s bedroom. Carla panicked until the police officer said she was alive! The insurance would fix the house. Carla picked up one of the black cats and smiled. She would need a pet for her house when it was fixed.
VOCABULARY: proof – sicher; insurance – Versicherung
Pages 42–43
12 How many of these tasks can you do?
1 Carla didn’t like leaving her house because she was superstitious. T / F
 2 Carla thought stepping on a crack in the pavement brought bad luck. T / F
 3 Carla’s house had a lot of mirrors. T / F
4 Carla worked .................................................................................................................................................. every week.
 5 The shop she worked at sold ......................................................................................................................
 6 On Wednesdays, she always did ..............................................................................................................
 7 How did Carla feel when she saw the date?
 .........................................................................................................................................................
 8 How was her walk to work?
 .........................................................................................................................................................
 9 What happened to her house during the storm?
 ....................................................................................................................................................................................
13 Listen and check your answers.
14 Listen to Akira (Japan), Carmita (Mexico) and Luis (Spain) talking about superstitions in their countries. Then circle T (True) or F (False).
Akira
 1 In Japan, people are quite superstitious. T / F
 2 Japanese people consider white snakes to be a good thing. T / F
 3 There are a lot of white snakes in Japan. T / F
 Image: smiling boy with short black hair in front of greenery. Image of a white snake on a branch.
Carmita
 4 In Mexico, you have to pray to San Antonio for 10 nights if you want him to help you. T / F
 5 Carmita is going to buy a statue of San Antonio. T / F
 6 Carmita is sure she’ll find a boyfriend without San Antonio. T / F
 Image: smiling girl with dark braided hair, standing in front of a wall. Image of a San Antonio statue holding a child.
Luis
 7 A lot of students live in Salamanca. T / F
 8 The frog on the wall of the university is made of stone. T / F
 9 Students touch the frog with both hands for good luck. T / F
 Image: smiling boy with short dark hair, wearing a red hoodie. Image of a frog sculpture on an old stone wall.
15
 A Complete the dialogue with the missing sentences.
 There are three extra sentences. Then listen and check.
 Options:
 a We could go by bus.
 b Brilliant. See you Saturday.
 c What’s the weather like on Saturday?
 d Can you surf?
 e Are you free on Saturday?
 f Should we take a picnic?
 g What time shall we meet?
 h How about going to the beach?
Gemma 1. ___ Are you free on Saturday?
 Carl Yes, I haven’t got any plans.
 Gemma 2. ..........................................................................................................................
 Carl I’d love that.
 Gemma 3. ..........................................................................................................................
 Carl Good idea. It’s too far to walk.
 Gemma 4. ..........................................................................................................................
 Carl That would be great. I’ll make the sandwiches.
 Gemma 5. ..........................................................................................................................
 Carl I’m looking forward to it.
B Put the dialogue in the correct order. Then listen and check.
 ☐ Connor There’s a new roller disco opening. Do you want to go?
 ☐ Connor It’s at the sport centre.
 ☑ Connor Are you free on Friday evening?
 ☐ Connor That’d be great. I won’t be late.
 ☐ Connor Roller disco and pizza. Sounds like the perfect evening.
 ☐ Connor Around half past seven, eight o’clock.
 ☐ Dawn Neither will I. And after we could go to the pizza restaurant. How about it?
 ☐ Dawn I’d love to. Where is it?
 ☐ Dawn Eight, that should be OK. Why?
 ☐ Dawn Let me see. What time?
 ☐ Dawn OK, why don’t we meet outside at about 7.45?
16 Put the words in the correct order.
1 tomorrow / are / free / you / ?
 ...........................................................................................................................
 2 cinema / about / how / to / going / the / ?
 ...........................................................................................................................
 3 could / we / there / walk / .
 ...........................................................................................................................
 4 pizza / do / want / after / to / you / have / a / ?
 ...........................................................................................................................
 5 would / be / great / that / .
 ...........................................................................................................................
 6 to / love / I /’d / .
 ...........................................................................................................................
17 Bob wants to invite Alice to the cinema on Sunday afternoon. Write a short dialogue. Use the expressions in 16 to help you.
Pages 44–45
18 Read the task and what a student wrote. What should Mum do if there is a problem?
Task
 You’ve just found a note on the refrigerator door. It says:
 Had to leave early. What about the arrangements for the evening? Let me know and be back by 6. Love, Mum
You write a note (40–70 words) back in which you say:
 ✔ what your plans are
 ✔ what Mum should do
 ✔ what you suggest
Example student note:
 Dear Mum,
 Can’t be back by 6. I suggest we meet at the train station.
 I’ll phone Kate to let her know we’ll get to her place around nine. Let’s just take a taxi.
 What about bringing her that cake in the fridge as a surprise?
 See you at the station. If there’s a problem, phone me in the afternoon.
 Love,
 Amy
Useful Language: Making arrangements
Let’s meet / go to / do …
Why don’t you … ?
Why can’t you … ?
I suggest …
What about meeting … ?
19 Now write your own answer to the following task.
Task
 You’ve just found a note on the refrigerator door. It says:
 Tim, you sleepyhead. What about football training in the afternoon? Leave me a note, phone’s dead. Bye, Karim
You write a note (40–70 words) back in which you tell Karim:
 ✔ when the football training is
 ✔ where to meet to go to football training together
 ✔ that he should take your bag with him
WORD FILE
 Luck
to be unlucky
to make a wish
to wish for sth.
to bring (good/bad) luck
to come true
spooky
to have (good/bad) luck
to believe in superstitions
MORE Words and Phrases
	English	Example Sentence	German
1	alarm clock	I really didn’t want to get up when my alarm clock rang.	Wecker
	Any luck?	Hattest du Glück?	
2	beside	Mr. Wallis, the teacher, arrives and sits down beside me.	neben
	Do you mind …?	Macht es dir etwas aus …?	
3	evil	Candyman is an evil spirit.	böse
	I’m joking.	Ich scherze nur.	
4	to ignore	Ignore him – he’s just being silly.	ignorieren
	satisfied	I am not really satisfied with your answer.	zufrieden
5	to scream	I heard your scream in the middle of the night.	schreien
	sleeping bag	Nick is lying in his sleeping bag.	Schlafsack
6	spirit	There is a spirit by the name of Candyman.	Geist
	superstition	It’s only a silly superstition, after all.	Aberglaube
7	to attract	If you whistle, you’ll attract a spirit.	anziehen, anlocken
	to enter	When you want to enter your home, you have to turn sharply to the left or right.	betreten, eintreten
8	haircut	If you get a haircut before an exam, you’ll forget everything.	Haarschnitt
	obvious	Isn’t it obvious that you should watch your handbag carefully?	offensichtlich
9	traditional	Traditional homes in China have large spirit screens.	traditionell
	to trick	Some homes in China have spirit screens to trick ghosts.	austricksen
10	unlucky	In Italy, the unlucky number is 17.	unglücklich, glücklos
	to whistle	If you whistle when the sun is shining, it will shine for more than two hours.	pfeifen
11	crack	You’ll have bad luck if you walk on the cracks in the pavement.	Riss, Spalt; hier: Fuge
	cuckoo	I can hear a cuckoo in the woods.	Kuckuck
12	pavement	I sometimes don’t walk on the cracks in the pavement.	Gehsteig
	rich	You’ll get rich if you hear a cuckoo and shake your money.	reich
13	to shake	I always shake the money in my pocket if I hear a cuckoo.	schütteln
	superstitious	Are you superstitious?	abergläubisch

EXTRA
	English	Example Sentence	German
1	to catch a cold	If you don’t wear a jacket, you’ll catch a cold.	sich verkühlen
2	toothbrush	If you drop your toothbrush, you’ll have to wash it.	Zahnbürste
3	to arrange	Have you got something else arranged?	vereinbaren, arrangieren
4	I’m sure.	Ich bin mir sicher.	
5	lucky charm	I just found a lucky charm.	Glücksbringer
6	salt	Oh no, I spilled the salt on the table.	Salz
7	seriously	You seriously believe in all these things?	ernsthaft, im Ernst

```

## Output contract

Write `content/corpus/units/g3-u05/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u05",
  "briefBank": "b87cdd08c5c9",
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
