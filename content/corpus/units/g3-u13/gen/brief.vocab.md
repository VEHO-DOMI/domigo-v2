# Vocab generation brief — g3-u13 (MORE! 3, Unit 13)

<!-- domigo:gen vocab g3-u13 bank=d52a2c701363 prompt=346902f9f0f1 -->

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
| g3u13.w.to-make-up-your-mind | to make up your mind | sich entscheiden | wordfile | Making Decisions | — | make up your mind | to make up your mind ; make up your mind |
| g3u13.w.to-sleep-on-it | to sleep on it | eine Nacht darüber schlafen | wordfile | Making Decisions | — | sleep on it | to sleep on it ; sleep on it |
| g3u13.w.to-find-a-way-out-of-a-dilemma | to find a way out of a dilemma | einen Ausweg aus einem Dilemma finden | wordfile | Making Decisions | — | find a way out of a dilemma | to find a way out of a dilemma ; find a way out of a dilemma |
| g3u13.w.to-be-in-two-minds-about-sth | to be in two minds about sth. | bei etw. unentschlossen sein | wordfile | Making Decisions | — | be in two minds about sth. | to be in two minds about sth. ; be in two minds about sth. |
| g3u13.w.to-have-second-thoughts-about-sth | to have second thoughts about sth. | etw. noch einmal überdenken | wordfile | Making Decisions | — | have second thoughts about sth. | to have second thoughts about sth. ; have second thoughts about sth. |
| g3u13.w.to-be-at-a-loss | to be at a loss | ratlos sein | wordfile | Making Decisions | — | be at a loss | to be at a loss ; be at a loss |
| g3u13.w.dilemma | dilemma | Dilemma ; Zwangslage | phrase | — | I'm sure we'll find a way out of this dilemma. | — | dilemma |
| g3u13.w.to-reach-a-decision | to reach a decision | eine Entscheidung treffen | phrase | — | I'm happy we could reach a decision. | reach a decision | to reach a decision ; reach a decision |
| g3u13.w.to-cancel | to cancel | absagen | phrase | — | You can't just cancel because you want to play football! | cancel | to cancel ; cancel |
| g3u13.w.disappointment | disappointment | Enttäuschung | phrase | — | It's a big disappointment that you can't play on Saturday. | — | disappointment |
| g3u13.w.granddad | granddad | Opa | phrase | — | We are going to visit granddad in the afternoon. | — | granddad |
| g3u13.w.to-kick-sb-off | to kick sb. off | rausschmeißen | phrase | — | My coach is going to kick me off the team. | kick sb. off | to kick sb. off ; kick sb. off |
| g3u13.w.to-move | to move | (sich) bewegen ; umziehen ; verschieben | phrase | — | They have asked me to move the game to Saturday. | move | to move ; move |
| g3u13.w.to-rethink | to rethink | überdenken | phrase | — | I'll have to rethink my decision. | rethink | to rethink ; rethink |
| g3u13.w.to-deserve | to deserve | verdienen | phrase | — | You deserve to feel special on your birthday. | deserve | to deserve ; deserve |
| g3u13.w.except | except | außer | phrase | — | Everyone knew – except you. | — | except |
| g3u13.w.it-s-a-shame | It's a shame. | Das ist schade. | phrase | — | It's a shame. | — | It's a shame. |
| g3u13.w.lift | lift | Mitfahrgelegenheit | phrase | — | Can you give me a lift home? | — | lift |
| g3u13.w.alibi | alibi | Alibi | phrase | — | Your brother asked you to give him an alibi for last night. | — | alibi |
| g3u13.w.id | ID (=identification) | Personalausweis | phrase | — | Can I see your ID? | — | ID |
| g3u13.w.to-keep-quiet | to keep quiet | still sein ; schweigen | phrase | — | I'd keep quiet if the teacher asked me what happened. | keep quiet | to keep quiet ; keep quiet |
| g3u13.w.to-tell-on-sb | to tell on sb. | jdn. verpetzen | phrase | — | I'm not going to tell on my friend. | tell on sb. | to tell on sb. ; tell on sb. |
| g3u13.w.detention | detention | Nachsitzen | phrase | — | If you didn't say anything, you'd probably get detention. | — | detention |
| g3u13.w.to-put-up | to put up | aufhängen | phrase | — | I put up a note on the fridge. | put up | to put up ; put up |
| g3u13.w.to-ask-sb-out | to ask sb. out | jdn. nach einem Date fragen | phrase | — | Jim has asked me out, but I don't want to go out with him. | ask sb. out | to ask sb. out ; ask sb. out |
| g3u13.w.accidentally | accidentally | versehentlich | phrase | — | When running down the stairs, you accidentally broke a vase. | — | accidentally |
| g3u13.w.to-argue | to argue | streiten ; diskutieren | phrase | — | I don't like to argue with my parents. | argue | to argue ; argue |
| g3u13.w.to-look-the-other-way | to look the other way | wegsehen | phrase | — | If someone needs help, don't look the other way. | look the other way | to look the other way ; look the other way |
| g3u13.w.to-pretend | to pretend | vortäuschen ; so tun ; als ob | phrase | — | Would you pretend you weren't my friend? | pretend | to pretend ; pretend |
| g3u13.w.to-reject | to reject | ablehnen ; zurückweisen | phrase | — | Tanja just rejected my advice. | reject | to reject ; reject |
| g3u13.w.homemade | homemade | hausgemacht | phrase | — | I could give him some homemade vouchers. | — | homemade |
| g3u13.w.neither-of | neither of | keiner von | phrase | — | Neither of us has any money. | — | neither of |
| g3u13.w.voucher | voucher | Gutschein | phrase | — | I make a voucher that says: maths homework. | — | voucher |
| g3u13.w.to-wrap | to wrap | verpacken | phrase | — | I'll wrap the present and give it to him. | wrap | to wrap ; wrap |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Derek, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Matterhorn, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Recherche, Red, Redwood, Reihenfolge, Renato, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Smith, Sophia, Sophie, Sound, South, Southeast, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u13.w.to-make-up-your-mind` ← v1 `to make up your mind`: d="To decide what to do after thinking about it" · s="Have you _____ up your mind yet about which new T-shirt you want to buy — the blue one or the red one?" · a=["make up your mind","made up my mind","made up your mind"] · mc=["to lose your mind","to change your mind easily","to hesitate forever"]
- `g3u13.w.to-sleep-on-it` ← v1 `to sleep on it`: d="To wait until the next day before making a decision" · s="I'm not sure yet what to do about the big decision. I think I'll _____ and decide in the morning when I'm less tired." · a=["sleep on it","slept on it"] · mc=["to forget about it","to ignore it forever","to rush a decision"]
- `g3u13.w.to-find-a-way-out-of-a-dilemma` ← v1 `to find a way out of a dilemma`: d="To discover a solution to a difficult problem" · s="Let's try to _____ a way out of this really difficult situation together by brainstorming possible solutions." · a=["find a way out of a dilemma","find a way out"] · mc=["to stay stuck in","to give up on","to make worse"]
- `g3u13.w.to-be-in-two-minds-about-sth` ← v1 `to be in two minds about sth.`: d="To be unsure because you are thinking both yes and no" · s="I'm _____ two minds about going to Anna's birthday party tonight — part of me wants to go, part of me wants to stay home." · a=["be in two minds","in two minds"] · mc=["to be definitely sure about","to have decided firmly about","to know exactly about"]
- `g3u13.w.to-have-second-thoughts-about-sth` ← v1 `to have second thoughts about sth.`: d="To start thinking that maybe your first idea wasn't good" · s="I _____ second thoughts about buying this very expensive new phone because it costs a lot more than I can afford right now." · a=["have second thoughts","had second thoughts","having second thoughts"] · mc=["to be completely certain about","to have no doubts about","to be fully committed to"]
- `g3u13.w.to-be-at-a-loss` ← v1 `to be at a loss`: d="To not know what to do or say" · s="When her friend got terrible news she stood completely _____, with no idea what to say or do." · a=["be at a loss","at a loss"] · mc=["to know exactly what to do","to have a plan","to be confident"]
- `g3u13.w.dilemma` ← v1 `dilemma`: d="A difficult situation where you must choose between two things" · s="It's a real _____ — I want to go to both parties tonight but they are at exactly the same time in different places." · a=["dilemmas"] · mc=["simple choice","clear decision","easy problem"]
- `g3u13.w.to-reach-a-decision` ← v1 `to reach a decision`: d="To finally decide something after thinking about it" · s="After a long discussion for two hours, they finally _____ a decision to go on holiday to Italy instead of Spain." · a=["reach a decision","reached a decision"] · mc=["to avoid a decision","to delay a decision","to reverse a decision"]
- `g3u13.w.to-cancel` ← v1 `to cancel`: d="To say that something planned will not happen" · s="We had to _____ the outdoor picnic at the last minute because of the sudden heavy thunderstorm that arrived." · a=["cancel","cancelled","canceled"] · mc=["to go ahead with","to enjoy","to continue"]
- `g3u13.w.disappointment` ← v1 `disappointment`: d="A feeling of sadness when something is not as good as you hoped" · s="Not getting the job she had applied for was a big _____ for her — she had really wanted it and prepared hard for the interview." · a=["disappointments"] · mc=["success","victory","achievement"]
- `g3u13.w.granddad` ← v1 `granddad`: d="Your grandfather, your parent's father" · s="My old _____ — my dad's father — always tells us funny stories from when he was young boy during the war." · a=["granddads","grandad"] · mc=["big brother","baby cousin","uncle's son"]
- `g3u13.w.to-kick-sb-off` ← v1 `to kick sb. off`: d="To force someone to leave a team or group" · s="The strict football coach will _____ the team if you miss practice again without a good reason like illness." · a=["kick off","kicked off"] · mc=["to welcome sb. to","to promote sb. on","to keep sb. on"]
- `g3u13.w.to-move` ← v1 `to move`: d="To change the time or date of something (in this context)" · s="Can we _____ the important class meeting from Wednesday afternoon to Thursday morning instead, because of the school trip?" · a=["move","moved"] · mc=["to cancel forever","to delete","to forget"]
- `g3u13.w.to-rethink` ← v1 `to rethink`: d="To think about something again because you might change your mind" · s="Maybe I should _____ my original holiday plan and try something completely different this year, like going camping instead of to the beach." · a=["rethink"] · mc=["to forget","to celebrate","to complete"]
- `g3u13.w.to-deserve` ← v1 `to deserve`: d="To have earned something good (or bad) because of what you did" · s="She worked so incredibly hard all year on her homework and studies — she really _____ the top grade on her final report." · a=["deserve","deserved","deserves"] · mc=["to not earn","to fail at","to accidentally get"]
- `g3u13.w.except` ← v1 `except`: d="Not including, but not" · s="Everyone in our class of 25 students is here today _____ Tom — he's still at home sick with the flu." · a=[] · mc=["including","with","plus"]
- `g3u13.w.it-s-a-shame` ← v1 `It's a shame.`: d="A way to say you feel sorry about something" · s="She didn't win the first place prize after all her hard work and months of preparation. _____." · a=["It's a shame"] · mc=["It's great.","It's wonderful.","It's fantastic."]
- `g3u13.w.lift` ← v1 `lift`: d="A free ride in someone's car" · s="Can you give me a _____ to the train station in your car? I'm in a hurry and it's too far to walk in time." · a=["lifts"] · mc=["a hug","a present","a cup of tea"]
- `g3u13.w.alibi` ← v1 `alibi`: d="Proof that you were somewhere else when something happened" · s="The police officers asked the suspect for a proper _____ — proof of where he was during the time of the crime last night." · a=["alibis"] · mc=["punishment","confession","prison sentence"]
- `g3u13.w.id` ← v1 `ID (=identification)`: d="A card or document that shows who you are" · s="You need to show your official _____ card with your photo and name to get into the concert venue at the entrance." · a=["ID","identification"] · mc=["friend list","favourite song","ticket only"]
- `g3u13.w.to-keep-quiet` ← v1 `to keep quiet`: d="To not say anything about something" · s="He decided to _____ about what he saw and not tell anyone, even though he knew he had witnessed the incident clearly." · a=["keep quiet","kept quiet"] · mc=["to shout loudly","to tell everyone","to gossip"]
- `g3u13.w.to-tell-on-sb` ← v1 `to tell on sb.`: d="To report to a teacher or parent what someone did wrong" · s="Please don't _____ on me to the teacher — I promise I won't break the classroom rules about phones again, it was just one time." · a=["tell on","told on"] · mc=["to protect sb.","to defend sb.","to forgive sb."]
- `g3u13.w.detention` ← v1 `detention`: d="A punishment where you have to stay at school after classes end" · s="He got _____ for one hour after school for talking loudly during class again, even after the teacher had warned him twice." · a=["detentions"] · mc=["praise","a reward","a medal"]
- `g3u13.w.to-put-up` ← v1 `to put up`: d="To hang or fix something on a wall or board" · s="The art teacher _____ our colourful drawings of animals on the classroom wall last week for everyone to see." · a=["put up"] · mc=["to pull down","to hide away","to destroy"]
- `g3u13.w.to-ask-sb-out` ← v1 `to ask sb. out`: d="To invite someone on a date" · s="He was too shy to _____ her on a date for coffee at the café — he had liked her secretly for months but couldn't find the courage." · a=["ask out","asked out"] · mc=["to avoid sb.","to ignore sb.","to run from sb."]
- `g3u13.w.accidentally` ← v1 `accidentally`: d="Without meaning to do it, by mistake" · s="I _____ deleted all my favourite photos from my phone last night — I didn't mean to do it at all, my finger slipped on the button!" · a=[] · mc=["on purpose","deliberately","intentionally"]
- `g3u13.w.to-argue` ← v1 `to argue`: d="To have a fight with words, to disagree strongly" · s="My little brother and I sometimes _____ about which TV show to watch on Saturday mornings — he wants cartoons and I want quiz shows." · a=["argue","argued"] · mc=["to agree","to compromise","to say nothing"]
- `g3u13.w.to-look-the-other-way` ← v1 `to look the other way`: d="To pretend you don't see something wrong" · s="When she saw the boy being bullied by two older students, she _____ instead of helping — she pretended not to see." · a=["look the other way","looked the other way"] · mc=["to step in and help","to tell a teacher","to run to help"]
- `g3u13.w.to-pretend` ← v1 `to pretend`: d="To act as if something is true when it is not" · s="She _____ to be completely asleep in bed so that she didn't have to talk to her annoying aunt who was visiting." · a=["pretend","pretended"] · mc=["to actually sleep","to genuinely rest","to really dream"]
- `g3u13.w.to-reject` ← v1 `to reject`: d="To say no to something or someone" · s="The strict teacher _____ my excuse for not doing homework because it wasn't believable — I said my dog ate it but I don't have a dog." · a=["reject","rejected"] · mc=["to accept kindly","to believe","to forgive"]
- `g3u13.w.homemade` ← v1 `homemade`: d="Made at home, not bought in a shop" · s="My grandma's delicious _____ chocolate cake baked in her own kitchen is much better than any cake you can buy from a bakery." · a=[] · mc=["shop-bought","factory-made","ready-made"]
- `g3u13.w.neither-of` ← v1 `neither of`: d="Not one and not the other of two things or people" · s="_____ us wanted to go into the dark haunted house first, so we waited outside for a whole minute arguing about who should go." · a=["neither of"] · mc=["both of","one of","all of"]
- `g3u13.w.voucher` ← v1 `voucher`: d="A piece of paper that you can use instead of money" · s="She got a paper €20 _____ for the big bookshop as a generous birthday present from her godmother last week." · a=["vouchers"] · mc=["receipt","bill","invoice"]
- `g3u13.w.to-wrap` ← v1 `to wrap`: d="To cover something with paper or cloth" · s="I need to carefully _____ this present in colourful paper with a ribbon before the birthday party starts at three o'clock." · a=["wrap","wrapped"] · mc=["to unwrap","to open","to throw away"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 13.txt -----
Unit 13 Difficult decisions
Pages 108–109
At the end of unit 13 ...
 you know
 ☐ 6 phrases to talk about making decisions
 ☐ how to use if-sentences (2nd conditional)
you can
 ☐ understand a play about a dilemma
 ☐ understand someone talking about dilemmas
 ☐ talk about dilemmas and give advice
 ☐ understand and do a questionnaire
 ☐ write a text message / a dialogue about a dilemma
 ☐ write a poem
▶ VOCABULARY Making decisions
1 Read the sentences and match the underlined words with the definitions.
1 Pizza or salad or both! I really can’t make up my mind.
 2 I might go to Jo’s party or I might not. I’m in two minds about it.
 3 I’m not sure if I want to enter the tennis competition – let me sleep on it.
 4 I don’t know what to get Dad for his birthday. I’m really at a loss.
 5 I’m sure we’ll find a way out of this dilemma if we think hard enough.
 6 I’m not happy about the present we decided to get for Mum. I’m having second thoughts.
☐ to really have no idea what to do
 ☐ to be unsure
 ☐ to find the solution to a problem
 ☐ to not be sure about a decision you made
 ☐ to take some time to think about things
 ☐ to reach a decision
▶ READING Understanding a play
2 A Work in pairs. Look at the illustrations for the play. What do you think it is about?
B Now read the play. Check your ideas with a partner.
Party or football?
Scene 1
 Tania: I haven’t given you an invitation yet, have I?
 Rose: For your birthday party? Yes, you sent me one on WhatsApp.
 Tania: Ah, of course. But I’ve made an invitation too. I designed it myself. Here you are.
 Rose: That’s brilliant – thanks.
 Tania: And you’re still OK to come?
 Rose: Absolutely. It’s at 3 p.m., isn’t it?
 Tania: That’s right. 3 p.m. at the cinema, and then pizza afterwards.
 Rose: Sounds great. I can’t wait!
Scene 2
 Tania: Thanks for picking me up, Mum.
 Mum: That’s alright. How was the training?
 Tania: Great. I think I might get in the first team next year. Miss Williams says I’m doing really well.
 Mum: Really? I’m glad your coach is working you hard.
 Tania: If she wasn’t a good coach, I would find another team. We’re top of the league and that’s where I want to be.
 Mum: I know, I know. And I’m proud of you.
 Tania: Thanks, Mum.
Scene 3
 Rose: Are you going to Tania’s party on Saturday?
 Derek: Of course. I’m her best friend.
 Rose: No, you’re not. I am.
 Derek: Well, I’m her best male friend.
 Rose: Have you got her a present yet?
 Derek: Of course. I’ve got her something really cool.
 Rose: What is it?
 Derek: I’m not telling you. It’s going to be a surprise.
 Rose: Go on, tell me. I need some inspiration.
 Derek: What! You don’t know what to get her?
 Rose: Well, I might get her a dress, but I’m in two minds about it. I’m not sure if she’ll really like it.
 Derek: But I thought you were her best friend?
 Rose: Ha ha. Very funny.
Scene 4
 Coach: OK, girls. Before we start, I have to tell you that Sunday’s game is now on Saturday.
 Tania: Saturday!
 Coach: Yes, the other team can’t make Sunday, so they’ve asked to move it to Saturday. I hope that isn’t going to be a problem for anyone. Remember: It’s a semi-final. Win this game and we’re in the final!
 (shouts of hooray)
 Tania: Coach, can I talk to you after the training?
 Coach: Sure.
Scene 5
 Tania: I’ve got a real problem with Saturday, coach.
 Coach: I don’t want to hear this, Tania. We need you. I’ve already made up my mind – you’re going to be captain for this game.
 Tania: That’s great – but … it’s just that I’m having my birthday party on Saturday. I’ve invited eight friends to the cinema at 3 p.m.
 Coach: Can’t you go to a later showing?
 Tania: Mum’s already bought the tickets. And we’re having pizza after.
 Coach: Well, I can’t make your play, Tania. But it’s going to be a big disappointment. As I said, I want you to be captain for this game. But now I’m having second thoughts … it could be your big chance.
 Tania: I know, coach. And you know how much I love playing in this team.
 Coach: Why don’t you go and sleep on it? But please let me know what you decide soon. If you can’t make it, then I’m going to have to rethink the team and find a new captain.
 Tania: OK, I’ll see if I can find a way out.
 Coach: Please do, Tania. We really need you.
Pages 110–111
Scene 6
Tania: Rose, I’ve got a big problem.
 Rose: Really? What is it?
 Tania: I’ve got a match on Saturday at 3 p.m. and coach wants me to be the team captain.
 Rose: What! But that’s when your birthday party is.
 Tania: I know. Is there any chance we could do it all on Sunday?
 Rose: I can’t make Sunday, no way. I’m going to my grandparents with my mum. It’s my granddad’s birthday.
Tania: Oh Rose, I really don’t know what to do. Coach said if I didn’t turn up tomorrow …
 Rose: Then what? She’d kick you off the team?
 Tania: She didn’t say that exactly, but she did say that this was my big chance.
 Rose: Look, we’re all excited about your birthday. We’ve got your presents, Derek’s even arranged a special surprise. You can’t just cancel it because you want to play football instead. What kind of friend are you?
 Tania: Rose, don’t make it so difficult for me, please. It’s just a really important game.
 Rose: More important than your birthday party? If you cared about your friends, this wouldn’t be a difficult decision.
 Tania: That’s not true. Anyway, maybe the others can make it on Sunday?
 Rose: Maybe they can, but I can’t.
 Tania: Don’t be like that, Rose. I’m really at a loss here.
 Rose: Whatever, Tania – do what you want.
3 How many of these tasks can you do?
1 The party starts at .........................................................
 2 Mum is glad that .........................................................
 3 Tania plays for the ......................................................... team in the league.
4 Rose has already bought Tania a present. T / F
 5 Tania’s football game is now a day earlier. T / F
 6 Tania’s team are in the final. T / F
7 Why does the coach really want Tania to play in the game?
 .........................................................................................................................
 8 Why can’t Rose make the party on Sunday?
 .........................................................................................................................
 9 Why is Rose disappointed by the news?
 .........................................................................................................................
4 Check your answers with a partner. Then listen to the play.
5 How do you think the dilemma is solved? Listen to scene 7 and compare your ideas.
6 Match the titles to the scenes in the play.
 A A change of plans. ☐
 B A disappointed coach. ☐
 C A lift home. ☐
 D Everyone is happy. ☐
 E A disappointed friend. ☐
 F What shall we get her? ☐
 G An invitation. ☐
7 Read the dilemmas and match them with the pictures.
Dilemma 1
 Imagine your older brother asked you to give him an alibi for last night. He asked you to tell your parents he was with you. What would you do?
Dilemma 2
 Imagine someone broke the classroom window when your teacher wasn’t there. When she returned, she asked you who it was. What would you do?
Dilemma 3
 Imagine you were walking down the street and you found a wallet on the ground. What would you do?
A: A boy is sitting at a table while his older brother talks to him.
 B: A girl stands in a classroom with a broken window and three other children.
 C: A girl is kneeling to pick up a wallet from the pavement.
8 Listen to Carla and Derek talking about the dilemmas. Tick the correct answer.
1 Carla says
 ☐ she would never give an alibi if it wasn’t true.
 ☐ she would definitely give her brother an alibi if he told her why.
 ☐ she would give her brother an alibi without knowing why.
 ☐ she’s sure her brother would never ask her for an alibi.
2 Derek says
 ☐ he would give his brother an alibi if his parents told him to.
 ☐ he would definitely not give his brother an alibi.
 ☐ his brother would tell their parents to ask him for an alibi.
 ☐ he would give his brother an alibi if he told him the truth.
3 Carla says
 ☐ she would tell the teacher immediately.
 ☐ she would find it difficult to know what to do.
 ☐ she would tell the teacher after the lesson.
 ☐ she would keep quiet.
4 Derek says
 ☐ he would wait for the other kids to tell the teacher about the broken window.
 ☐ he would not tell the teacher what had happened. He would say he did it.
 ☐ he would tell on the other person.
5 Carla says
 ☐ she would keep it if there was no ID.
 ☐ she would put the wallet back where she found it.
 ☐ she would phone the person so he/she could pick it up.
 ☐ she would give it back or take it to the police station.
6 Derek says
 ☐ he would try to find the owner or give it to the police.
 ☐ he would keep the money.
 ☐ he would keep the money and drop the wallet in front of a police station.
 ☐ he wouldn’t pick it up.
Pages 112–113
9 Match the sentence halves.
DILEMMA 1
 a If he asked me to give him an alibi, ☐ I wouldn’t give him an alibi.
 b If he didn’t tell me why he wanted one, ☐ I’d tell them.
 c If my parents asked me where he was, ☐ I’d definitely give him one.
DILEMMA 2
 a If you told the teacher, ☐ you’d probably get detention.
 b If you didn’t say anything, ☐ I’d say that I didn’t know.
 c If the teacher asked me what happened, ☐ the other students would hate you.
DILEMMA 3
 a If there was an ID card in the wallet, ☐ I’d keep it and leave the wallet.
 b If there wasn’t an ID card in the wallet, ☐ I’d take it to the police station.
 c If I needed the money, ☐ I’d find the owner and give it back.
10 Listen and repeat.
DIALOGUE 1
 Girl: Why are you looking at me like that?
 Boy: If I were you, I wouldn’t wear that weird outfit.
 Girl: I think it looks cool.
DIALOGUE 2
 Boy: I need some extra money.
 Girl: If I were you, I’d put up a note that says you can fix computers.
 Boy: That’s a good idea.
11 Make dialogues using the sentences below as starters.
1 I need more time to finish my portfolio.
 If I were you, I’d ......................................................................................... .
2 I think Conny hates me.
 If I were you, I’d ......................................................................................... .
3 The coach doesn’t want me to be on the football team.
 If I were you, I’d ......................................................................................... .
4 I don’t know what to give Peter for his birthday.
 If I were you, I’d ......................................................................................... .
5 Jim has asked me out, but I don’t want to go out with him.
 If I were you, I’d ......................................................................................... .
6 She owes me 20 pounds and I really need the money.
 If I were you, I’d ......................................................................................... .
(Image: On the left page, a child sits at a computer desk. There is a tall, teetering pile of books and files on the desk beside them, higher than their head.)
12 Do the questionnaire and discuss your answers with a partner.
 How BRAVE are you?
1 Imagine you were at a friend’s house. When running down the stairs, you accidentally broke a vase. Nobody saw you. What would you do?
 A ☐ I’d just say goodbye and hope nobody noticed.
 B ☐ I’d call my friend later and apologise.
 C ☐ I’d own up* immediately and promise to buy a new vase.
2 Imagine your teacher asked you to give a presentation in front of a large group of pupils. What would you do?
 A ☐ I’d argue with my teacher and tell them I didn’t want to do it.
 B ☐ I’d call in sick* on the day of the presentation.
 C ☐ I’d be happy and look forward to doing it.
3 Imagine there was a large spider in your room. What would you do?
 A ☐ I’d shout for help.
 B ☐ I’d throw whatever I could find at the spider.
 C ☐ I’d pick it up and put it outside the window.
4 Imagine you saw an older boy taking away the mobile phone from a younger kid and then run away. What would you do?
 A ☐ I’d run after him.
 B ☐ I’d call 112.
 C ☐ I’d just look the other way.
5 Imagine people were talking about a friend of yours and making fun of them. What would you do?
 A ☐ I’d join in and laugh with them.
 B ☐ I’d pretend I wasn’t their friend.
 C ☐ I’d stand up for my friend.
Vocabulary:
 own up – zugeben, sich zu etw. bekennen;
 call in sick – sich krank melden
(Image: At the top, a boy looks thoughtful with “How BRAVE are you?” above his head in colourful letters. Below each scenario is a cartoon-style drawing matching the question. For example, Question 1 shows a broken vase; Question 3 shows a boy reacting to a spider; Question 5 shows one child looking uncomfortable as others laugh.)
Pages 114–115
13 CHOICES
A
 You are one of the friends invited to Tania’s party. Tania texts you about her dilemma. Send a text message (30–50 words) back to her.
 In your message:
 • tell her what you think of her dilemma
 • tell her what you think she should do
[Text message shown in image on a phone screen:]
 Hi Micky! I need your help, please! I am supposed to have my birthday party on Saturday, but now we have a football match at the same time. And my coach wants me to be captain for this game. What should I do? I want to have the party but I also want to play in the game – and be captain for my team. I’m really at a loss…
B
 Write a dialogue between Tania and her mother (100–120 words). In your dialogue, include:
 • Tania explaining her dilemma
 • her mother offering her advice
 • Tania accepting or rejecting this advice
GRAMMAR
 if-sentences (2nd conditional)
 You use the 2nd conditional if you want to talk about impossible or unlikely situations and their future results.
How to form it:
 If-clause
 If + person + past simple
 Main clause
 person + would + base form of the verb
Examples:
 If she wasn’t a good coach, I would find another team.
 If you cared about your friends, this wouldn’t be a difficult decision.
 Carla would give her brother an alibi if he told her why he needs one.
 If I needed the money, I’d keep it and leave the wallet.
Sometimes you also hear or see the forms If he/she/it were … However, these forms are rarely used in everyday English.
Choose the correct option.
 We use the 2nd conditional to talk about something that will / might happen.
(Image: A child holding a paper with the caption “If he wasn’t my friend, I wouldn’t read his poem.”)
OUR YOUNG WORLD 6
 Luke’s birthday present dilemma
1 Watch the video. What does Luke decide to give his friend as a birthday present?
 ....................................................................................................................................................
2 Watch again and answer the questions.
1 Why does Luke have a problem with the present? .........................................................
 2 What did he give his friend Mo last year? .........................................................
 3 What does BOGOF mean? .........................................................
 4 What does a ‘maths homework’ voucher mean? .........................................................
 5 What does a ‘school bag 500’ voucher mean? .........................................................
 6 Why does his mum interrupt the vlog? .........................................................
Find out
 3 Complete the sentences with the words in the box.
about of about for
1 That’s a lovely present. I’ll think ...................... you every time I wear it.
 2 I’m thinking ...................... buying Sara some cool shoes for her birthday.
 3 Tim cares ...................... his little brother while his mum is at work.
 4 Of course I care ...................... you – you’re my best friend!
Creative presents
 4 In pairs, discuss.
1 In the vlog, Luke discusses the idea of vouchers.
 What exactly is his idea? .........................................................................................
2 Think of vouchers you could write for the following people:
 • your parents
 • your best friend
 • your teacher
3 Choose one of the vouchers and design it.
(Image: A hand-drawn voucher labelled "SCHOOL BAG 500 VOUCHER" with the text: “I promise to carry your school bag for 500m (and no more!) – Only valid for one use.”)
CYBER PROJECT: A sketch on video
 5 In pairs, write a sketch for the situation below. Create a short video and present it to the class.
You want to get your teacher a present to say thank you for teaching you. Neither of you has any money. Discuss what you should do.


----- WB: More 3 WB Unit 13.txt -----
UNIT 13 Difficult decisions
Page 109
UNDERSTANDING VOCABULARY
 Making decisions
1 Match the sentences to make dialogues.
1 Do you want cake or ice cream or both?
 2 Tomorrow I might watch the match or I might go for a walk.
 3 I’m not sure I want to do this job.
 4 Have you decided what you’re getting your mother for her birthday?
 5 This is a difficult decision.
 6 Are you still planning to go to Spain for your holidays?
☐ Why don’t you sleep on it and tell me if you want it in the morning.
 ☐ I’m really at a loss. I can’t get her another bottle of perfume.
 ☐ Hmm. Both sound good. I can’t make up my mind. Maybe both.
 ☐ We’re actually having second thoughts and thinking about Portugal instead.
 ☐ It is. But I’m sure we’ll find a way out. And you don’t have to decide right now.
 ☐ Are you still in two minds about it? I’d say let’s watch the match.
USING VOCABULARY
 Making decisions
2 Complete with the missing words.
1 It’s a difficult situation, but I’m sure we can find a ........................... out of it.
 2 I’m really at a ........................... . I’m not sure if I should invite Ben to the party next Saturday.
 3 I really can’t make up my ........................... which one I should buy – the blue or the black T-shirt. I like them both.
 4 I don’t know if I can join you on the trip – let me ........................... on it.
 5 I’m not sure if I’m going to the cinema tonight. I’m in ........................... minds about it.
 6 I’m having ........................... thoughts about camping this weekend. The weather is going to be terrible.
3 Use phrases from 1 and 2 to complete the mini-dialogues. Sometimes more are possible.
1 Mona Should we go to Nihan’s party on Friday or to the show at the Galaxy?
   Silvie Hmm. That’s a difficult decision. What would you like to do?
   Mona I don’t really know. That’s why I’m asking.
   Silvie Hmm. I don’t know either. ............................................................... . I’ll tell you tomorrow.
2 Farid Shall we go on with the project about cats?
   Jamie I don’t know. ............................................................... .
   Farid Why?
   Jamie On the one hand, it’s really interesting. On the other hand, I’ve got enough of cats.
3 Amy The headmaster said no to our party.
   Luke Did he? But why?
   Amy Too many kids, not enough space, no teachers to supervise*.
   Luke I don’t believe it. ............................................................... . There must be a solution.
      We’ve always had that party.
VOCABULARY: supervise = beaufsichtigen, betreuen
Pages 110–111
UNDERSTANDING GRAMMAR
 2nd conditional
4 Match the beginnings and endings of the sentences.
1 If I had enough money,
 2 If my brother had a problem,
 3 If I found some money in the street,
 4 If you worked harder,
 5 If I was president of Austria,
 6 If you knew the answer,
☐ you’d get better marks.
 ☐ I’d buy a new computer.
 ☐ would you tell me?
 ☐ I’d take it to the police station.
 ☐ I’d change lots of things.
 ☐ I’d help him.
5 Circle the correct word.
1 If I have / had more money, I’d help the hat for you.
 2 If you go / went to London, you’d learn a lot of English.
 3 If it was my birthday today, I’d get / I got a lot of presents.
 4 I would help you if I didn’t / wouldn’t have homework to do.
 5 If he would have / had a girlfriend, he’d be very happy.
 6 If there was a test tomorrow, I wouldn’t / didn’t pass.
 7 What did / would you do if you found money in the street?
 8 He didn’t / wouldn’t like New York if he lived there.
6 Put the dialogue in the correct order.
☐ A I’d like to get better marks at school.
 ☐ A That’s right. And then I’d lose marks for being late.
 ☐ A Well, if I got tired, I’d need to sleep more.
 ☐ A Yeah, but if I studied more, I’d get tired in the evening.
 ☐ B What’s the problem with being tired?
 ☐ B Well, if you studied more, you’d get better marks.
 ☐ B Oh dear. My head hurts!
 ☐ B And if you slept more, you wouldn’t wake up in time for school.
USING GRAMMAR
 2nd conditional
7 Put the verbs in brackets into the correct form.
1 If my father ..................... (be) here, I ..................... (be) very happy.
 2 If she ..................... (not live) in London, I ..................... (see) her more often.
 3 If I ..................... (have) a dictionary, I ..................... (look) this word up.
 4 If my computer ..................... (not be) broken, I ..................... (write) some emails.
 5 If your mother ..................... (be) here, she ..................... (not let) you do that!
 6 The teacher ..................... (be) angry if she ..................... (know).
 7 If I ..................... (not be) so tired, I ..................... (play) football with you.
 8 We ..................... (not see) them very often if they ..................... (not live) next door.
 9 My parents ..................... (buy) a bigger car if they ..................... (have) the money.
8 Write the sentences using If ...
1 I don’t like Sally. I don’t talk to her.
 If I liked Sally, I’d talk to her.
2 He doesn’t have a laptop. I don’t send him emails.
 If ........................................................................................................................
3 She’s ill. She isn’t at school.
 If ........................................................................................................................
4 I like you. I help you with your homework.
 If ........................................................................................................................
5 They’re on holiday. They aren’t here today.
 If ........................................................................................................................
6 Her phone is out of battery. She doesn’t call you.
 If ........................................................................................................................
9 Look at the pictures. Write three more dialogues.
Image 1: Girl standing outside a locked door, looking worried. (Caption: lose your key)
 Image 2: Two teenagers looking surprised as they see a celebrity. (Caption: see a famous person)
 Image 3: Two students pointing at a teacher dancing at a school disco. (Caption: see your teacher at the school disco)
 Image 4: A student in a suit sitting behind a principal’s desk. (Caption: be headmaster of your school)
1 A What would you do if you lost your key?
   B I’d go to my friend’s house.
2 A ............................................................................................................................
   B ........................................................................................................................
3 A ............................................................................................................................
   B ........................................................................................................................
4 A ............................................................................................................................
   B ........................................................................................................................
10 Write your own answers to the questions.
1 What would you do if your best friend stopped talking to you?
 ........................................................................................................................
2 What would you do if you lost your wallet?
 ........................................................................................................................
3 What would you do if you won a lot of money?
 ........................................................................................................................
4 What would you do if you were the president of your country?
 ........................................................................................................................
5 What would you do if you could travel in time?
 ........................................................................................................................
6 What would you do if you forgot who you were?
 ........................................................................................................................
Pages 112–113
11 Read the text. What is Carl’s dilemma?
A difficult decision
Image description (top left): A boy with arms crossed and a serious face.
 Image description (top right): A girl with long dark hair and a scarf taking something out of a red locker at school.
Hi, I’m Carl. I work on the school paper. Elvira is the boss and I’m her assistant. We’re doing well. Every month, we print 300 copies, we get lots of ads for our paper, and we have an online version where you can leave comments. Oh, I forgot to tell you the name of the paper: It’s called The Light, because we shine a light on* what is happening at school.
Here’s an example of how we work. A few weeks ago, Elvira asked me to look into a case at school. Things were disappearing from the lockers: small stuff and money. “There must be a thief,” Elvira said. “Talk to the kids whose things are missing and see if you can find out anything.”
“Great,” I thought. “Now I get to play detective.” But I did what she said. I talked to 20 kids and found out that money was stolen, that books and bags disappeared, that an expensive jacket and a camera were gone. But people weren’t angry. I think many said: “Could I write about it?” A lot of students wouldn’t write to anybody. But if I could find out who was behind it, that would make a great story.
It was Saturday, and on Monday I had to tell Elvira that I couldn’t come up with a story. On Saturday I decided to go to the market to see if there are interesting old magazines.
I walked around as usual and I spotted two kids from our school: a boy I didn’t really know and a girl I knew well because she lived next door. The boy was wearing a cool jacket just like the one that was missing.
In the afternoon, I went to see Astrid, the girl next door. She invited me in and we had a chat about school. And then I told her about my visit to the market. Astrid looked frightened and then she started to cry. “My boyfriend Ben and I have been opening lockers and stealing things,” she said.
“You have to stop that right away,” I said. “Or I will have to take it to the headmaster. And you have to return the things you stole.”
“Please, don’t tell anyone,” she said. “We will stop it right away. And we’ll return the things. I promise.”
No more things were stolen the next week. And I didn’t tell Elvira about Astrid and her boyfriend. I told her that I couldn’t find out who the thief was.
But then, a week later, another bag was stolen. I talked to Astrid right away and she said, “Ben and I didn’t do anything. Honestly.”
Now I’m not sure what to do. Should I believe Astrid? Should I talk to Elvira or the headmaster? I have no idea.
VOCABULARY: shine a light on sth. – etw. beleuchten, deutlich machen; come up with sth. – sich etw. einfallen lassen
12 How many of these tasks can you do?
1 300 copies of The Light are printed every week.
 T / F
2 Carl was trying to find out who stole things and money from the lockers.
 T / F
3 He talked to kids and teachers.
 T / F
Complete the sentences with no more than 4 words.
4 On Monday, Carl wanted to tell Elvira that ........................................................
 .........................................................................................................................
5 At the market, he spotted two ........................................................
 .........................................................................................................................
6 Carl went to see ........................................................
 .........................................................................................................................
Answer the questions in one sentence.
7 What did Carl ask Astrid to do?
 .........................................................................................................................
8 What happened a week after the talk between Carl and Astrid?
 .........................................................................................................................
9 What would you do in Carl’s position?
 .........................................................................................................................
13 Listen and check your answers.
14
 a Listen to Eve and Ken playing the dilemma game. Put the situations in the order that you hear them.
Image A: A boy and girl sitting at a table. The boy is surprised and asking a question.
 Image B: A girl finding a wallet on the floor in a busy hallway.
 Image C: Two boys looking at a window that is broken, in a school hallway.
...............
...............
...............
b Listen again and answer the questions with Eve or Ken.
Who would …
1 want to know where their brother spent the night?
 .........................................................................................................................
2 do what their brother wanted them to do?
 .........................................................................................................................
3 refuse to tell the teacher all they knew?
 .........................................................................................................................
4 say nothing about the window if they were the guilty person?
 .........................................................................................................................
5 leave the wallet on the ground?
 .........................................................................................................................
6 try and find out who the wallet belonged to?
 .........................................................................................................................
15 Now write your answer to each dilemma from 14.
Dilemma A .......................................................................................................................
 Dilemma B .......................................................................................................................
 Dilemma C .......................................................................................................................
Pages 114–115
16
 A Complete the dialogue with the sentences from the box. There is one extra sentence.
 Then listen and check.
a I failed the last test.
 b I’m not sure. Maybe we should speak to Andrea first and ask why she does it.
 c And we work hard, but always do worse.
 d It’s not fair on us really.
 e Did you see Andrea cheating in her biology test?
 f She always cheats, and she gets away with it.
Derek 1 ...............................................................................................................
 Mo Yes, I did.
 Derek 2 ...............................................................................................................
 Mo She does. The teacher never catches her.
 Derek 3 ...............................................................................................................
 Mo I agree, because she always gets the best grade.
 Derek 4 ...............................................................................................................
 Mo Do you think we should tell the teacher?
 Derek 5 ...............................................................................................................
 Mo That’s a good idea.
Image description: Two boys sitting outside on steps talking; one is holding a school folder, the other looks thoughtful.
B Put the dialogue into the correct order. Then listen and check.
☐ Alissa Can you keep a secret, Susan?
 ☐ Alissa Yeah. But he was holding hands with her!
 ☐ Alissa I saw Terry at the cinema yesterday.
 ☐ Alissa I think so too. My problem is, should I tell Sandra?
 ☐ Alissa I saw him with another girl, not with his girlfriend Sandra.
 ☐ Susan So? What’s the problem? Why can’t he be at the cinema?
 ☐ Susan Of course, I can. What is it?
 ☐ Susan Definitely. I’d tell her if I were you.
 ☐ Susan Oh dear, now I get it. Sandra will be furious.
 ☐ Susan I still don’t understand. So there was another girl there.
Image description: Two girls sitting on a bench in a hallway, one whispering to the other.
17 Read the task and what a student wrote. What is the Butterfly Lady’s wish for herself?
Task
 You were asked to contribute an IF-poem to a poetry website.
 Write a poem.
Think about:
 ✔ a situation / a person / an incident for your poem
 ✔ a way to repeat the if-construction
 ✔ a punchline
 ✔ a title
The Butterfly Lady
If I could have three wishes,
 I’d wish for another three.
 But I know that in all fairy tales
 This is something that cannot be.
 So if I had three wishes,
 I’d wish for a peaceful world
 In which nobody has to go hungry,
 In which nobody is without a home.
 But for me I would wish for twelve butterflies
 That fly around or behind me,
 So wherever I go
 People would know
 Here comes the butterfly lady
 Who makes them smile
 At least for a while.
Image description: A woman with long brown hair and tan skin, wearing a butterfly in her hair and surrounded by flying, colorful butterflies. She is smiling gently and looking to the side.
Language tip: Writing poetry
 When writing a poem always think carefully about the language.
● Which word is the best?
 ● Which words or phrases should I repeat?
 ● Should I use rhyming words or not?
 ● How long are the lines of the poem?
 ● Think of a strong opening line to attract the reader’s attention.
Pages 116–117
18 Read the text in 17 again and find out:
● how many if-sentences there are
 ● how many repetitions there are
 ● how many rhymes there are
Writing tip: Writing a poem
 There are many ways to write a poem. Here are some things to consider:
● Think of what you want to write about (e.g. the seasons, a person, an animal).
 ● Think of how long your poem should be (e.g. is it a one-stanza poem?).
 ● Think about rhyming words – a poem doesn’t have to rhyme!
 ● If you want to rhyme, there are some good rhyming dictionaries online.
The most important thing is:
 Just write. And write. And write.
 And then rewrite and rewrite.
 Ask a friend for feedback. And rewrite and rewrite.
19 Now write your own answer to the following task.
Task
 You were asked to contribute a poem about summer to a poetry website. Write the poem.
 Think about:
 ✔ what aspect of summer you want to write about
 ✔ if it’s a nature poem or a people poem
 ✔ whether you want to use rhymes
 ✔ a good title for your poem
(Page contains lined space for writing.)
WORD FILE
 Making decisions
to make up your mind
 to sleep on it
 to find a way out of a dilemma
 to be in two minds about sth.
 to have second thoughts about sth.
 to be at a loss
MORE Words and Phrases
#	Word/Phrase	Example Sentence	German Translation
1	dilemma	I’m sure we’ll find a way out of this dilemma.	Dilemma, Zwangslage
	to reach a decision	I’m happy we could reach a decision.	eine Entscheidung treffen
2	to cancel	You can’t just cancel because you want to play football!	absagen
3	disappointment	It’s a big disappointment that you can’t play on Saturday.	Enttäuschung
4	granddad	We are going to visit granddad in the afternoon.	Opa
	to kick sb. off	My coach is going to kick me off the team.	raus­schmeißen
5	to move	They have asked me to move the game to Saturday.	(sich) bewegen; umziehen; hier: verschieben
	to rethink	I’ll have to rethink my decision.	überdenken
6	to deserve	You deserve to feel special on your birthday.	verdienen
	except	Everyone knew – except you.	außer
	It’s a shame.		Das ist schade.
7	lift	Can you give me a lift home?	hier: Mitfahrgelegenheit
8	alibi	Your brother asked you to give him an alibi for last night.	Alibi
9	ID (=identification)	Can I see your ID?	Personalausweis
	to keep quiet	I’d keep quiet if the teacher asked me what happened.	still sein, schweigen
	to tell on sb.	I’m not going to tell on my friend.	jdn. verpetzen
10	detention	If you didn’t say anything, you’d probably get detention.	Nachsitzen
11	to put up	I put up a note on the fridge.	aufhängen
	to ask sb. out	Jim has asked me out, but I don’t want to go out with him.	jdn. nach einem Date fragen
12	accidentally	When running down the stairs, you accidentally broke a vase.	versehentlich
	to argue	I don’t like to argue with my parents.	streiten, diskutieren
	to look the other way	If someone needs help, don’t look the other way.	wegsehen
	to pretend	Would you pretend you weren’t my friend?	vortäuschen, so tun, als ob
13	to reject	Tanja just rejected my advice.	ablehnen, zurückweisen
	homemade	I could give him some homemade vouchers.	hausgemacht
	neither of	Neither of us has any money.	keiner von
	voucher	I make a voucher that says: maths homework.	Gutschein
	to wrap	I’ll wrap the present and give it to him.	verpacken

```

## Output contract

Write `content/corpus/units/g3-u13/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u13",
  "briefBank": "d52a2c701363",
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
