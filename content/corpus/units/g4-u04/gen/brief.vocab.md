# Vocab generation brief — g4-u04 (MORE! 4, Unit 4)

<!-- domigo:gen vocab g4-u04 bank=ed0525f1c242 prompt=346902f9f0f1 -->

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
| g4u04.w.accountant | accountant | Buchhalter/in | wordfile | Jobs and Professions | — | — | accountant |
| g4u04.w.receptionist | receptionist | Rezeptionist/in | wordfile | Jobs and Professions | — | — | receptionist |
| g4u04.w.mechanic | mechanic | Mechaniker/in | wordfile | Jobs and Professions | — | — | mechanic |
| g4u04.w.nurse | nurse | Krankenpfleger/in | wordfile | Jobs and Professions | — | — | nurse |
| g4u04.w.health-care | health care | Gesundheitswesen | wordfile | Jobs and Professions | — | — | health care |
| g4u04.w.marketing | marketing | Marketing | wordfile | Jobs and Professions | — | — | marketing |
| g4u04.w.finance | finance | Finanzwesen | wordfile | Jobs and Professions | — | — | finance |
| g4u04.w.electrician | electrician | Elektriker/in | wordfile | Jobs and Professions | — | — | electrician |
| g4u04.w.secretary | secretary | Sekretär/in | wordfile | Jobs and Professions | — | — | secretary |
| g4u04.w.flight-attendant | flight attendant | Flugbegleiter/in | wordfile | Jobs and Professions | — | — | flight attendant |
| g4u04.w.computing | computing | Datenverarbeitung ; Computerwesen | wordfile | Jobs and Professions | — | — | computing |
| g4u04.w.computing-2 | computing | Datenverarbeitung ; Computerwesen | phrase | — | I love programming, so I'm glad I found a job in computing. | — | computing |
| g4u04.w.finance-2 | finance | Finanzwesen | phrase | — | She works in finance. She's an accountant. | — | finance |
| g4u04.w.health-care-2 | health care | Gesundheitswesen | phrase | — | If you want to work in health care, you need to be flexible. | — | health care |
| g4u04.w.sales-and-marketing | sales and marketing | Verkauf und Marketing | phrase | — | He has good people skills. No wonder he works in sales and marketing. | — | sales and marketing |
| g4u04.w.deserve | deserve | verdienen | phrase | — | The team played well and really deserved to win. | — | deserve |
| g4u04.w.female | female | weiblich | phrase | — | My dog's a girl, so it's female, not male. | — | female |
| g4u04.w.male | male | männlich | phrase | — | Male ducks are called drakes. | — | male |
| g4u04.w.satisfaction | satisfaction | Genugtuung ; Zufriedenheit | phrase | — | I love my job. It gives me a lot of satisfaction. | — | satisfaction |
| g4u04.w.unemployed | unemployed | arbeitslos | phrase | — | I lost my job last week. Now I'm unemployed. | — | unemployed |
| g4u04.w.career | career | Karriere ; Berufslaufbahn | phrase | — | She started her career as a model ten years ago. | — | career |
| g4u04.w.be-keen-on | be keen on | von etw. begeistert sein | phrase | — | I was very tired, so I wasn't keen on going to the party. | — | be keen on |
| g4u04.w.be-responsible-for | be responsible for | für etw. verantwortlich sein | phrase | — | The architect is responsible for designing the project. | — | be responsible for |
| g4u04.w.bonus | bonus | Bonus ; Zulage ; Prämie | phrase | — | The staff got a bonus for finishing the project on time. | — | bonus |
| g4u04.w.deadline | deadline | Frist ; Abgabetermin | phrase | — | We had to hurry to meet the deadline. | — | deadline |
| g4u04.w.develop | develop | entwickeln | phrase | — | The company develops new software programmes. | — | develop |
| g4u04.w.earn | earn | verdienen | phrase | — | I need to earn a lot of money if I want to go on holiday to Australia. | — | earn |
| g4u04.w.launch | launch | einführen ; auf den Markt bringen | phrase | — | The new product will be launched in July. | — | launch |
| g4u04.w.pros-and-cons | pros and cons | Vor- und Nachteile | phrase | — | Each technology has its pros and cons. | — | pros and cons |
| g4u04.w.salary | salary | Gehalt | phrase | — | She earns a good salary. | — | salary |
| g4u04.w.think-up | think up | ausdenken ; erfinden | phrase | — | Can't you think up a better excuse than that? | — | think up |
| g4u04.w.working-hours | working hours | Arbeitszeit | phrase | — | Most people enjoy shorter working hours and more leisure time. | — | working hours |
| g4u04.w.advice | advice | Ratschlag | phrase | — | Take my advice. Don't do it. | — | advice |
| g4u04.w.ambition | ambition | Ehrgeiz | phrase | — | His ambition is to become world champion. | — | ambition |
| g4u04.w.casual | casual | lässig ; locker | phrase | — | Don't be too casual during an interview for a new job. | — | casual |
| g4u04.w.company | company | Unternehmen ; Firma | phrase | — | I've worked for the company for 2 years now. | — | company |
| g4u04.w.confidently | confidently | selbstbewusst | phrase | — | Try to speak and act confidently, but don't be cheeky. | — | confidently |
| g4u04.w.employer | employer | Arbeitgeber/in | phrase | — | My new employer is a big computer company. | — | employer |
| g4u04.w.enthusiastic | enthusiastic | enthusiastisch ; begeistert | phrase | — | My parents love classical music, but I'm not so enthusiastic. | — | enthusiastic |
| g4u04.w.eye-contact | eye contact | Augenkontakt | phrase | — | Look at your interviewer and try to keep eye contact. | — | eye contact |
| g4u04.w.interview | (job) interview | Vorstellungsgespräch | phrase | — | She has an interview next week for the manager's job. | — | interview ; interview job |
| g4u04.w.memorise | memorise | sich einprägen | phrase | — | Read the text and try to memorise all the facts. | — | memorise |
| g4u04.w.naturally | naturally | natürlich | phrase | — | Act naturally. Don't try to be like another person. | — | naturally |
| g4u04.w.skills | skills | Fähigkeiten | phrase | — | We need someone with practical skills for the job. | — | skills |
| g4u04.w.journalism | journalism | Journalismus | phrase | — | She can write well. She's looking for a career in journalism. | — | journalism |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leeds, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebellion, Recherche, Red, Redwood, Reihenfolge, Renato, Republic, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g4u04.w.accountant` ← v1 `accountant`: d="A person whose job is to keep or check financial records" · s="She hired an _____ to help her with her company's taxes." · a=["accountants"] · mc=["consultant","economist","cashier"]
- `g4u04.w.receptionist` ← v1 `receptionist`: d="A person who works at a desk in a hotel or office welcoming visitors" · s="The friendly _____ at the hotel gave us our room keys and a map of the city." · a=["receptionists"] · mc=["secretary","assistant","cashier"]
- `g4u04.w.mechanic` ← v1 `mechanic`: d="A person who repairs and maintains machines, especially cars" · s="I took my car to the _____ because the engine was making a strange noise." · a=["mechanics"] · mc=["technician","engineer","plumber"]
- `g4u04.w.nurse` ← v1 `nurse`: d="A person trained to care for sick or injured people, usually in a hospital" · s="The _____ checked my blood pressure and gave me my medication." · a=["nurses"] · mc=["surgeon","pharmacist","dentist"]
- `g4u04.w.health-care` ← v1 `health care`: d="The services provided by a country or organisation for treating people who are ill" · s="Good _____ should be available to everyone, not just rich people." · a=["healthcare"] · mc=["social work","child care","welfare"]
- `g4u04.w.marketing` ← v1 `marketing`: d="The business activity of promoting and selling products or services" · s="The _____ team came up with a brilliant idea for the new advert." · a=[] · mc=["advertising","management","accounting"]
- `g4u04.w.finance` ← v1 `finance`: d="The management of money by governments, companies, or individuals" · s="He studied _____ at university because he wanted to work at a bank." · a=[] · mc=["banking","economics","commerce"]
- `g4u04.w.electrician` ← v1 `electrician`: d="A person whose job is to install and repair electrical systems" · s="We called an _____ to fix the broken wiring in the kitchen." · a=["electricians"] · mc=["plumber","carpenter","technician"]
- `g4u04.w.secretary` ← v1 `secretary`: d="A person who works in an office typing letters, making calls, and organising meetings" · s="The _____ answered the phone and scheduled an appointment for me." · a=["secretaries"] · mc=["receptionist","assistant","manager"]
- `g4u04.w.flight-attendant` ← v1 `flight attendant`: d="A person who looks after passengers on an aircraft" · s="The _____ showed us how to use the safety equipment before takeoff." · a=["flight attendants"] · mc=["travel agent","pilot","tour guide"]
- `g4u04.w.computing` ← v1 `computing`: d="The use of computers and technology for processing information" · s="She wants to study _____ because she dreams of creating video games." · a=[] · mc=["engineering","programming","technology"]
- `g4u04.w.computing-2` ← v1 `computing`: d="The use of computers and technology for processing information" · s="She wants to study _____ because she dreams of creating video games." · a=[] · mc=["engineering","programming","technology"]
- `g4u04.w.finance-2` ← v1 `finance`: d="The management of money by governments, companies, or individuals" · s="He studied _____ at university because he wanted to work at a bank." · a=[] · mc=["banking","economics","commerce"]
- `g4u04.w.health-care-2` ← v1 `health care`: d="The services provided by a country or organisation for treating people who are ill" · s="Good _____ should be available to everyone, not just rich people." · a=["healthcare"] · mc=["social work","child care","welfare"]
- `g4u04.w.sales-and-marketing` ← v1 `sales and marketing`: d="The combined business activities of selling products and promoting them" · s="After university, she got a job in _____, where she promotes and sells sportswear for a big brand." · a=[] · mc=["research and development","human resources","customer service"]
- `g4u04.w.deserve` ← v1 `deserve`: d="To have earned something through your actions or qualities" · s="You studied so hard for this exam — you _____ a great result." · a=["deserve","deserved"] · mc=["demand","desire","require"]
- `g4u04.w.female` ← v1 `female`: d="Relating to women or girls" · s="The first _____ astronaut went into space in 1963." · a=[] · mc=["feminine","gentle","adult"]
- `g4u04.w.male` ← v1 `male`: d="Relating to men or boys" · s="In many bird species, the _____ is more colourful than the female." · a=[] · mc=["masculine","mature","adult"]
- `g4u04.w.satisfaction` ← v1 `satisfaction`: d="A pleasant feeling you get when you achieve something or when something you wanted happens" · s="Finishing the marathon gave her a great feeling of _____." · a=[] · mc=["achievement","pleasure","happiness"]
- `g4u04.w.unemployed` ← v1 `unemployed`: d="Not having a paid job" · s="After the factory closed, hundreds of workers became _____." · a=[] · mc=["retired","underpaid","unskilled"]
- `g4u04.w.career` ← v1 `career`: d="The series of jobs that a person has in a particular area of work" · s="He wants a _____ in medicine and hopes to become a surgeon one day." · a=["careers"] · mc=["profession","position","occupation"]
- `g4u04.w.be-keen-on` ← v1 `be keen on`: d="To be very interested in or enthusiastic about something" · s="She's really _____ cooking and tries a new recipe every weekend." · a=["be keen on","keen on"] · mc=["be fond of","be good at","be used to"]
- `g4u04.w.be-responsible-for` ← v1 `be responsible for`: d="To be in charge of something or to have it as your duty" · s="As class president, Tom is _____ organising school events." · a=["be responsible for","responsible for"] · mc=["be capable of","be in charge of","be involved in"]
- `g4u04.w.bonus` ← v1 `bonus`: d="Extra money added to someone's pay as a reward for good work" · s="Everyone in the office got a Christmas _____ this year." · a=["bonuses"] · mc=["reward","tip","raise"]
- `g4u04.w.deadline` ← v1 `deadline`: d="The latest time or date by which something must be finished" · s="The _____ for the essay is Friday, so you'd better start writing today." · a=["deadlines"] · mc=["timetable","schedule","due date"]
- `g4u04.w.develop` ← v1 `develop`: d="To grow, change, or create something new over time" · s="Scientists are trying to _____ a new vaccine against the virus." · a=["develop","develops"] · mc=["design","discover","improve"]
- `g4u04.w.earn` ← v1 `earn`: d="To receive money for work that you do" · s="She works at a cafe after school to _____ some extra pocket money." · a=[] · mc=["gain","win","receive"]
- `g4u04.w.launch` ← v1 `launch`: d="To start or introduce a new product, service, or project" · s="Apple plans to _____ a new smartphone next month." · a=["launch","launched"] · mc=["release","publish","promote"]
- `g4u04.w.pros-and-cons` ← v1 `pros and cons`: d="The advantages and disadvantages of something" · s="We made a list of the _____ before deciding which school to choose." · a=[] · mc=["strengths and weaknesses","dos and don'ts","rights and wrongs"]
- `g4u04.w.salary` ← v1 `salary`: d="A fixed amount of money paid to an employee every month" · s="Teachers in Austria don't always get a high _____, but they love their job." · a=["salaries"] · mc=["wage","income","pension"]
- `g4u04.w.think-up` ← v1 `think up`: d="To create or invent an idea using your imagination" · s="We need to _____ a name for our new school band." · a=[] · mc=["make up","look up","come up with"]
- `g4u04.w.working-hours` ← v1 `working hours`: d="The times of the day during which a person is at their job" · s="The company has flexible _____, so employees can choose when to start and finish." · a=[] · mc=["opening hours","office hours","overtime"]
- `g4u04.w.advice` ← v1 `advice`: d="Suggestions about what someone should do in a particular situation" · s="My mum gave me some good _____ about how to deal with stress." · a=[] · mc=["suggestion","instruction","warning"]
- `g4u04.w.ambition` ← v1 `ambition`: d="A strong desire to achieve something great, like success or power" · s="Her biggest _____ is to travel around the world before she turns thirty." · a=["ambitions"] · mc=["motivation","determination","aspiration"]
- `g4u04.w.casual` ← v1 `casual`: d="Relaxed and informal in style or manner" · s="You can wear _____ clothes to the party — jeans and a T-shirt are fine." · a=[] · mc=["comfortable","elegant","formal"]
- `g4u04.w.company` ← v1 `company`: d="A business organisation that makes or sells goods or services" · s="My dad works for a small _____ that makes furniture." · a=["companies"] · mc=["corporation","organisation","agency"]
- `g4u04.w.confidently` ← v1 `confidently`: d="In a way that shows you believe in yourself and your abilities" · s="Even though she was nervous, she spoke _____ during the presentation and nobody noticed her fear." · a=[] · mc=["proudly","bravely","loudly"]
- `g4u04.w.employer` ← v1 `employer`: d="A person or company that pays people to work for them" · s="A good _____ treats their workers fairly and pays them on time." · a=["employers"] · mc=["employee","manager","colleague"]
- `g4u04.w.enthusiastic` ← v1 `enthusiastic`: d="Showing a lot of excitement and interest about something" · s="The students were very _____ about the idea of a school trip to London." · a=[] · mc=["passionate","motivated","curious"]
- `g4u04.w.eye-contact` ← v1 `eye contact`: d="The act of looking directly into another person's eyes during a conversation" · s="When giving a presentation, try to make _____ with your audience." · a=[] · mc=["body language","facial expression","handshake"]
- `g4u04.w.interview` ← v1 `(job) interview`: d="A formal meeting where someone is asked questions to see if they are right for a position" · s="He was very nervous before his first _____ at the new company." · a=["job interview","interview"] · mc=["job application","job offer","job training"]
- `g4u04.w.memorise` ← v1 `memorise`: d="To learn something so well that you can remember it perfectly" · s="I need to _____ all these new vocabulary words before the test." · a=["memorise","memorize"] · mc=["recognise","revise","recall"]
- `g4u04.w.naturally` ← v1 `naturally`: d="In a way that is normal and expected; of course" · s="She plays the violin so well that the music seems to flow _____." · a=[] · mc=["obviously","certainly","automatically"]
- `g4u04.w.skills` ← v1 `skills`: d="The abilities and knowledge needed to do something well" · s="Learning a musical instrument helps you develop many useful _____." · a=["skill"] · mc=["talents","qualities","abilities"]
- `g4u04.w.journalism` ← v1 `journalism`: d="The work of collecting, writing, and publishing news and information" · s="He studied _____ because he wanted to become a reporter for a newspaper." · a=[] · mc=["broadcasting","publishing","media"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 4 SB Unit 4.txt -----
Unit 4 A working life
Page 34–35
You learn
about different job areas
about how to do a good job interview
how to use questions in reported speech
You can
talk about jobs and job interviews
do a job interview
write a job description
Vocabulary Professions
1 Look at the photos. What jobs do they show? Choose from the words in the box. What do you know about the jobs that aren’t shown in the photos?
Word box:
doctor
cook
website designer
flight attendant
tour guide
shop assistant
factory worker
dentist
secretary
nurse
soldier
accountant
bank clerk
farmer
travel agent
waiter
teacher
receptionist
mechanic
electrician
Image descriptions:
A young woman typing on a computer at a desk (possibly a website designer).
A man in a chef's uniform in a kitchen (cook).
A man in a pilot's uniform standing in an airport.
A man working with a machine in a factory (factory worker).
A person in army uniform (soldier).
A woman helping a customer in a clothing store (shop assistant).
A construction worker holding a yellow helmet and tools (possibly a mechanic or electrician).
A woman in a hotel uniform at a reception desk (receptionist).
A flight attendant in uniform on a plane.
A doctor examining a patient in a hospital.
A teacher writing on the blackboard in a classroom.
A nurse speaking to an elderly woman in a hospital bed.
A man sculpting a statue (possibly an artist or sculptor – not listed).
Sounds right /ə/
2 🎧 Listen. Pay attention to the underlined sounds.
Don’t want to be a secretary.
 A waiter’s life is not for me.
 A flight attendant, that’s my dream.
 Be an accountant? No — I’d scream!
3 🎧 Listen again and say the rhyme.
4 People often talk about the areas they work in. Which of the people above could say:
I work in …
computing
health care
finance
education
sales and marketing
the travel
the hotel
the food
industry
Free flow
5 Work in pairs. Each of you picks two jobs that you’d like to do. Then ask each other about these jobs and why you picked them.
6 🎧 a Listen to Philip and Mandy. What are they talking about? Take notes.
 b Listen again. Write P (Philip), M (Mandy) or P&M (Philip and Mandy) next to the questions.
Who says that men and women should get paid the same for doing the same job? _______
Who says that money is more important than job satisfaction? _______
Whose dad doesn’t work? _______
Whose family doesn’t support them? _______
Images:
 Top right: A boy in a dance pose is labelled “Philip.” Below him, a girl in army uniform is labelled “Mandy.”
7 🎧 Listen again and answer the questions.
Why does Philip want to be a dancer?
What do his family and friends think about his dancing?
What jobs does he think only men should do?
Why does Mandy want to be a soldier?
What do her friends think about her plans?
What job would Mandy hate to do and why?
What does she say about having a family and working at the same time?
Free flow
8 Work in pairs. One of you will play the role of a career advisor (A), the other will play the role of a student (B). Take 1 minute to prepare your part of the interview. Use the prompt cards to help you. Talk for 4–5 minutes. Then swap roles.
Prompt Card A
You are a career advisor. You are going to interview a student and recommend one or several jobs for him/her. Before you make your recommendations you will need to find out:
what he/she most enjoys doing
what he/she doesn’t like doing
how important money is for him/her
if he/she wants to work long hours
if he/she wants to (rather) work alone or in a team
if he/she wants to go to university
What other things would be good to ask?
Prompt Card B
You are a student. You are going to talk to a career advisor.
 Tell him/her:
what you enjoy doing
what you don’t like doing
how important money is for you
if you want to work long hours
if you want to (rather) work alone or in a team
if you want to go to university
What questions do you expect the career advisor to ask you?
Page 36–37
UNIT 4
9 Discuss what’s your favourite app and why. Then read the text.
So you want to be … an app developer
Every time you open your mobile phone to check the weather, or play Candy Crush you probably open an app. Have you ever stopped to think about who makes this all possible? The answer is: an app developer.
Gillian Plant from Leeds is an app developer. She designs and develops apps for a mobile company in London where she works. She earns about £35,000 a year and she really loves her job.
What does she do? As an app developer Gillian has to work in a team to think up new games for people to play on their mobile phones. She is then responsible for making sure the app is developed quickly to make sure it is launched on time. We asked Gillian to tell us about the pros and cons of her job.
The Pros:
 “Job satisfaction, because this is my dream job. I love seeing a project go from an idea in a room to becoming an app on my phone. There are lots of jobs for app developers so the salaries are always good. I often have to travel to meet with clients, which I enjoy at the moment, but maybe when I have children I won’t be so keen on that.”
The Cons:
 “Although my working hours are officially nine to five, I often have to work much later than this. When we’re at the end of a project I sometimes need to work weekends too. But then I get paid bonuses for meeting my deadlines. I also spend a lot of time in front of a computer, which isn’t great for my back.”
Image description:
 A woman with long dark hair, wearing a dark suit and holding a tablet, stands smiling in front of a red and orange background.
10 🎧 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Gillian works with technology. T / F
Gillian works in Leeds. T / F
She’s not keen on her job. T / F
Gillian works ..................................................................................... people.
She is responsible for ........................................................................... to finish.
Gillian thinks her salary ............................................................................... .
What part of her job might be a problem in the future? ......................................................................................
Why does she sometimes need to work at weekends? ......................................................................................
What doesn’t she like about sitting at the computer for a long time? ......................................................................................
Vocabulary Doing your job
11 Read through the text again. Then match the words/phrases with the definitions.
pros and cons
earn
job satisfaction
working hours
bonus
deadline
salary
think up
Definitions:
 a. the happiness you get from doing your job
 b. extra money you get for doing your job well
 c. the time when your work needs to be finished
 d. the amount of money you get for doing your job
 e. good and bad things
 f. when you start and finish work
 g. create something
 h. get money for your work
12 a Look at the text below quickly and answer these two questions.
What does this text tell you?
Who would (not) be interested in reading it?
How to do a good job interview
Before the interview
Find out about:
the employer you want to work for. Use the internet or talk to someone who works there.
the job. 🗹
yourself. If you ask yourself why you want this job, you will be able to give the interviewer better answers. 🗹
Think about the questions the interviewer might ask you and prepare your answers. Question areas are likely to be:
Skills – what you can do.
Your plans and ambitions for the future.
What kind of person you think you are. 🗹
Practise your answers to possible questions, but don’t memorise them. Speak naturally. 🗹
On the day
Make sure you get a good night’s sleep before the interview.
Dress smartly. Find out what people at the company usually wear and dress like this or a bit smarter. Make sure your clothes are clean and ironed. 🗹
At the interview
DO
Shake the interviewer’s hand.
Smile confidently and sit up straight.
Listen carefully to the questions and say if you don’t understand. 🗹
Take your time and think about your answers.
Be positive and enthusiastic.
Be honest. They want to know who you really are. 🗹
DON’T
Chew gum.
Be too casual. 🗹
Be negative.
Use expressions like ‘uh huh’ or ‘you know’. 🗹
Image descriptions:
Top right: A woman in a skirt and blazer, holding a clipboard.
Below that: A handshake between two hands.
Bottom of the page: Two cartoon-style people—one smiling positively with a check mark next to him, the other slouching with a cross mark next to him.
b Read the text carefully and put the missing advice in the correct places. Write 1–6.
Lie about your skills and experiences.
Give yourself enough time to get to the interview in plenty of time.
Make eye contact with the interviewer.
What skills will you need to do it? Do you have them?
Do a practice interview with a friend or member of your family.
Why you want the job.
Page 38–39
13 Rachel went for a job interview. She wrote an email to her friend after the interview.
 Complete the email.
📧
 Hi Annie,
 Well, I had the interview today. I’m sure I won’t get the job! Why? First, I was late because I didn’t __________ myself enough time to get there. Then I forgot to __________ hands with the interviewer. I tried to answer everything quickly, and didn’t __________ my time – big mistake! I was so nervous! That’s why I just looked at the floor, I didn’t __________ eye contact at all.
 Oh, and I __________ gum during the interview, too!
 Another interview on Friday – I’m going to __________ for that one!
 Bye,
 Rachel
Get talking Job interviews
14 Use these pictures to talk about how you should behave in interviews. Say:
what they are doing wrong
what they should do instead
what you think are the two most important rules for job interviews
Speech frames:
 He/She … and I think that was a bad idea!
 It wasn’t a great idea to …
 He/She should never have …
 It was a big mistake to …
I agree / I disagree, because …
Image descriptions:
 A: Interviewee is on their phone during the interview.
 B: Interviewee is slouching and chewing gum.
 C: Interviewee is shouting and gesturing wildly with “I WANT THE JOB!” sign.
 D: Interviewee is dressed in a swimsuit and flippers.
15 🎧 Listen to two people talking about their job interviews. Find out who said what and write
 K (Kelly) or L (Liam) next to each one.
Dialogue 1 – Kelly
 Dialogue 2 – Liam
He asked me why I’d got a dog with me. ⬜
They asked me if I had experience in journalism. ⬜
He asked me where I had worked before. ⬜
He asked me what my ambition was. ⬜
He asked me if I liked working with people. ⬜
He asked me why I wanted to work there. ⬜
They asked me when I could start. ⬜
16 CHOICES
 Writing for your Portfolio
A Look at Rachel’s email in 13 again. Imagine she got the second job and is writing an email (40–70 words) to her friend telling her how happy she is.
 Write about:
how the interview went in general
what she liked best about it
how the job interviewer reacted
B Pick one of the jobs from the list in 1 and write a job description (120–180 words). Use the internet to find information, but do not copy from there. In your text, say:
what kind of work you’d like to do
what the working hours and the salary are like
what the pros/cons of the job are
why it is (not) a family-friendly job
what the career prospects are*
why you would (not) like to do that job
VOCABULARY: ‘prospects – Aussichten
GRAMMAR
 Questions in reported speech
Wenn du über Fragen berichtest, verwendest du kein do, does oder did.
 “Where do you live?” → She asked me where I lived.
Wenn du über Fragen berichtest, ändert sich die Zeit um eine Zeitstufe (z. B. present → past) so wie in der indirekten Rede (siehe Unit 3).
Außerdem behältst du dann das Fragewort (why / where / who / when / how etc.).
“Why do you have a dog with you?” → He asked me why I had a dog with me.
 “Where have you worked before?” → He asked me where I had worked before.
 “When can you start?” → They asked me when I could start.
Wenn du über eine Ja/Nein-Frage berichtest, verwendest du if und veränderst die Zeiten (…, ob …).
 “Do you like working with people?” → He asked me if I liked working with people.
Image description:
 A nervous-looking boy is standing outside a door labelled “INTERVIEWS HERE” holding a dog on a leash. He’s pulling at his collar.
 Caption:
 “I didn’t get the job – but they asked Rover if he could start tomorrow!”
Page 40–41
The Girl Next Door 2
 DEVELOPING SPEAKING COMPETENCIES
 Language function: Describing symptoms
 Speaking strategy: Sympathising
The injury
1 🎧 Watch or listen to the dialogue. Then read it.
Tom: Argh!
 Kate: What’s the matter, Tom?
 Tom: I’ve hurt my ankle. It’s really painful.
 Kate: Oh, dear. What happened?
 Tom: Well, I was running over here to hit the ball back and I think I twisted it. It really hurts.
 Kate: Ouch. Let me see. Well, it doesn’t look too bad. There’s no obvious bruising.
 Tom: It really hurts. I feel quite dizzy, too.
 Kate: Then you must be in pain.
 Tom: I am. I am! I don’t think I can walk.
 Kate: Why don’t you take your shoe off and we can have a better look.
 Tom: No, no. It hurts too much.
 Kate: So I guess we won’t be able to finish the game.
 Tom: No, I’m sorry. I can’t go on. I need to get home and put some ice on this before it gets any worse.
Kate: That’s a shame. Just when I was about to win too.
 Tom: Were you winning?
 Kate: Yes, the score was five games to two to me. I was forty – love up in that game. A point away from winning, in fact.
 Tom: Oh, sorry. I guess we’ll just have to call that game a draw then.
 Kate: Yeah, I guess we will. I think we should get you to the doctor’s. I’ll call an ambulance.
 Tom: No, no. Don’t be silly. I’ll be fine. I’m sure I can push myself back on my bike. But you could take my racket and bag.
Image description (top left):
 A boy (Tom) is lying on the ground clutching his ankle while a girl (Kate) kneels next to him, holding a tennis racket. A tennis ball and another racket are on the court next to them.
2 Complete the sentences.
Tom is in pain because ......................................................................................................................
He hurt it while ......................................................................................................................
Kate doesn’t think it’s too bad as she can’t see ......................................................................................................................
Tom isn’t sure he ......................................................................................................................
Tom wants to get home and ......................................................................................................................
Kate was really close to ......................................................................................................................
Kate suggests ......................................................................................................................
Tom asks Kate to ......................................................................................................................
Useful phrases
 Describing symptoms
3 Match the sentence halves. Check in the text in 1.
I’ve hurt …
It’s really …
It really …
I feel …
I can’t …
a. go on.
 b. my ankle.
 c. hurts.
 d. painful.
 e. quite dizzy.
4 What do you think? Answer the questions.
Is Tom really hurt?
What might he do next?
Mobile homework
Watch the second part of the video. Read Tom’s diary entry, find and correct five mistakes.
Kate was pretty annoyed with me. Because of my leg I couldn’t help out with the big clear-up of the playing field, of course. The thing is that in the afternoon Ian called to see if I wanted to play basketball and because my leg was feeling much better I said yes. Problem was that Kate saw me when she was walking home with Liam. She was really angry, shouted at me and then walked off. Anyway she got the last laugh because I broke my arm! I think she’s forgiven me now because she gave me a kiss.
Speaking strategy
 Sympathising
4 Complete. Then check with the dialogue in 1.
Tom: I’ve hurt my ankle. It’s really painful.
 Kate: Oh, d……………… . L……………………… me
 S……………………… . Well, it doesn’t look too bad.
 There’s no obvious bruising.
 Tom: It really hurts. I feel quite dizzy, too.
 Kate: Then you m……………… be in p………………
5 ROLE PLAY: Work in pairs. Look at the role cards. Take 1 minute to practise your dialogue.
 Don’t write it down. Act it out for the rest of the class. Talk for 4–5 minutes.
Student A
 You have had an accident and hurt yourself.
 Think about:
 • what happened
 • where you’re hurt
 • how it feels
 Tell your partner and look for some sympathy.
Student B
 Listen to your partner. Talk about the accident. Ask questions and show sympathy.


----- WB: More 4 WB Unit 4.txt -----
UNIT 4 A working life
Pages 28–29
Reading
 1 Read the text. Who lives in the bigger town – Chris or Jeff?
TEENAGE MAYORS
 Many teenagers like to try and make a bit of money. They might deliver newspapers, work in a shop at the weekends or do a bit of gardening. Americans Chris Portman and Jeff Dunkel were no different.
 Last year, however, they both decided to try for a different type of job. But to get this job there was no job interview, for this job they needed to get elected by the public. They both stood for election to be mayor of the towns where they live and they both won.
19-year-old Portman and 18-year-old Dunkel must now try and balance their lives as students with the responsibilities of being a mayor including attending meetings, fund-raising and making personal appearances.
Dunkel’s interest in politics started when he was at high school. He was doing a project on local government and started going to public meetings in his town. But he got frustrated because he felt that nobody was really doing anything to help the local people. So he asked a lot of questions and annoyed a lot of people. They told him if he could do better, he should try and be mayor. And that’s exactly what he did.
At first, people in his hometown of Mount Carbon thought he was joking but he soon showed them he wasn’t. He put up signs, delivered letters to every house and organised a car show. With a lot of support from his family and friends, Dunkel won the majority of votes from the 100 people who live in the town and was elected their mayor.
Portman also had to work for people to take him seriously. When he announced he wanted to be mayor, his friends just laughed. However, he started studying politics, learned how to make speeches in public and got to know all the local politicians. He said he knew exactly what he wanted and how to get it. Finally, he managed to show the local people how serious he was and was elected by the 2,000 people who live in his hometown of Pittsburgh.
Now both men are responsible for organising the communities where they live, including everything from collecting rubbish, to dealing with the local police forces, to finding the money to build a new playground.
 Both men are also studying at college. And when their time is finished, they plan to enter politics full time and their ambitions don’t stop there. Both men one day hope to be the president of their country. But for now they are happy showing that young people have a lot to offer and can be trusted to take on great responsibilities, and they hope their stories will inspire more young people to get involved in politics.
(Image description: Two young men in suits, standing outdoors next to each other, smiling. The left one has darker hair and a striped tie, the right one is blond with a lighter tie.)
2 How many of these tasks can you do? Check your answers with a partner.
Give an example of one of the ‘teenage jobs’ mentioned in the text.
 ........................................................................................................................
How old are Chris and Jeff?
 ........................................................................................................................
Give an example of one of the responsibilities of a mayor mentioned in the text.
 ........................................................................................................................
Dunkel got involved in politics because
 ☐ he was doing a school project.
 ☐ he thought he could make a difference.
 ☐ nobody could answer his questions.
In his campaign, Dunkel
 ☐ spoke to everyone in his town.
 ☐ had a lot of help from family and friends.
 ☐ made a lot of jokes.
Like Dunkel, Portman also had to
 ☐ prove that he really wanted the job.
 ☐ meet a lot of important people.
 ☐ learn how to talk in front of a lot of people.
Organising rubbish collections is an example of ................................ both men now have.
Jeff and Chris would like ................................ of the US one day.
Jeff and Chris would like to be seen ................................ to young people.
Listening
 3 Listen to the job interview and fill in the form.
Name: * ....................................................
 Age: * ....................................................
 Phone number: * ....................................................
 Position applied for: * ....................................................
 Impression: * good / bad
4 Listen again and circle T (True) or F (False).
Billy hasn’t worked in a café before. T / F
He is confident in his ability to do the job. T / F
Billy is not interested in a career in catering. T / F
The job is full-time. T / F
Billy can only work weekends over the summer months. T / F
The café is only open at the weekends. T / F
Billy says that having good people skills is important for a waiter. T / F
Billy says that he wouldn’t let the café down if he got the job. T / F
Billy wants to know more about the salary. T / F
Billy is the last candidate to be interviewed. T / F
Pages 30–31
5 Choose the correct options.
 1 Mum asked me where have you been / I had been.
 2 She asked me who have you been / I had been with.
 3 She asked me are you / if I was hungry.
 4 She asked me if I wanted / do you want some soup.
 5 She asked me what I wanted / do you want to do later.
 6 She asked me have you / if I had got any homework.
6 Write what the interviewer asked Karen.
 A terrible interview!
 1 The interviewer asked me what my name was. .......................................................................................?
 2 She asked me why I was right for this job. .......................................................................................?
 3 She asked me where I had worked before. .......................................................................................?
 4 She asked me if I had any experience. .......................................................................................?
 5 She asked me if I knew how to use a computer. .......................................................................................?
 6 She asked me why I wanted the job. .......................................................................................?
 7 She asked me who my business hero was. .......................................................................................?
 8 She asked me if I could work Saturdays. .......................................................................................?
I could only answer the first question confidently!
7 Complete the questions with what, who, where, how, why, when or if.
 1 I asked Victoria ................... she was going.     "To Japan," she said.
 2 I asked her ................... she was going to get there.  "By plane," she said.
 3 I asked her ................... she was going with.    "My parents," she said.
 4 I asked her ................... they were going there.   "My dad's working there," she said.
 5 I asked her ................... they would be coming back. "In two weeks," she said.
 6 I asked her ................... she was going to buy for me. "Something nice!" she said.
 7 I asked her ................... she would miss me.     "Of course!" she said.
8 Write the reported questions.
 [Image description: A band is being interviewed. Around them are question bubbles with the following direct questions:
 1: How long have you been a singer?
 2: What was your first hit?
 3: Who did you perform with first?
 4: Where was your last concert?
 5: When is your next concert going to be?
 6: Are you going to release a new record soon?
 7: Did you always want to be a singer?
 8: Which singers do you like best?]
1 She asked him ......................................................................................................................
 2 She .....................................................................................................................................................
 3 .....................................................................................................................................................
 4 .....................................................................................................................................................
 5 .....................................................................................................................................................
 6 .....................................................................................................................................................
 7 .....................................................................................................................................................
 8 .....................................................................................................................................................
9 Read the dialogue. Then complete the summary in reported speech.
James: I don't want to go to school today, Mum.
 Mum: Why not? Are you ill?
 James: No, I'm not ill. But I hate school.
 Mum: Why?
 James: Because nobody likes me and everyone calls me names behind my back. They don't listen to me and they laugh at me.
 Mum: But you have to go to school, son.
 James: Why, Mum?
 Mum: Because you're 53, James, and you're the headmaster.
James was lying in bed one morning. He didn’t want to get up, so he told his mum that
 ...................................................................................................................................................
 ................................................................................................................................................... ill. He answered that he ...................................................................................................................................................
 ................................................................................................................................................... but said that
 ................................................................................................................................................... school. His mother asked him ................................................................................................................................................... it.
 James said that “...................................................................................................................................................” and everyone
 “...................................................................................................................................................” back. He said “...................................................................................................................................................”
 and they “...................................................................................................................................................”.
In the end, his mother told “...................................................................................................................................................” . When he asked why, she said it was because “...................................................................................................................................................”.
Pages 32–33
10 Choose a title and complete the sentences about you.
 A great / terrible day!
 1 My mum asked me ...............................................................................................................................................................................
 2 My dad asked me ..................................................................................................................................................................................
 3 My mum told me ....................................................................................................................................................................................
 4 My dad told me .........................................................................................................................................................................................
 5 My best friend asked me ....................................................................................................................................................................
 6 My best friend told me .......................................................................................................................................................................
 7 My teacher asked me .........................................................................................................................................................................
 8 My teacher told me ...............................................................................................................................................................................
Vocabulary
 11 Complete the words for the jobs by writing in the missing letters.
 1 c _ _ _ _ k
 2 s h _ _ _ _ p _ _ s _ _ s _ _ _ _ n t
 3 d _ _ _ t _ _
 4 s _ _ c _ _ _ t _ _ _ y
 5 d _ _ _ _ s t
 6 _ _ c _ _ _ _ n _ _ _ _ n t
 7 w _ _ _ _ _
 8 s _ _ _ l d _ _ _ _
 9 n _ _ _ _
 10 t _ _ _ r g _ _ _ _ d _ _
 11 f _ _ _ _ r
 12 r _ _ _ _ _ p _ _ _ _ _ _ _ _ _ _ _ st
 13 b _ _ _ _ k _ _ _ l _ _ _
 14 w _ _ b _ _ _ _ _ _ _ d _ _ _ _ _ g _ _ _ r
 15 t _ _ _ _ _ _ _ _
 16 _ _ _ _ c _ _ _ _ _ _ _ _ _ n
 17 tr _ _ _ _ _ _ l _ _ g _ _ _ _ t
 18 m _ _ _ _ _ _ _ c
 19 fl _ _ _ _ t _ _ _ _ _ _ _ _ d _ _ _ _ _ t
 20 f _ _ _ _ _ _ r _ _ w _ _ _ _ _ _ r
12 Who said these things, do you think? Write the name of the job. Choose from 11.
 (Speech bubbles with the following quotes and empty lines below them)
• OK – now it’s time to take your temperature.
 .......................................................................................
• Would you like tea or coffee, madam?
 .......................................................................................
• There are some wonderful places to see in Madrid.
 .......................................................................................
• Now can you open your mouth just a little bit more?
 .......................................................................................
• I’ve got to get this tractor fixed.
 .......................................................................................
13 Write something you might expect these people to say.
 1 teacher: ............................................................................................................................................................
 2 secretary: .........................................................................................................................................................
 3 bank clerk: .......................................................................................................................................................
 4 electrician: .......................................................................................................................................................
 5 cook: ....................................................................................................................................................................
14 Complete the poem with the words in the box. There is one extra word.
 Box: earn working hours deadline job satisfaction industry pros and cons bonus salary
There are 1 '..................................................................................' to being a nurse.
 The 2 '..................................................................................' is not great but it could be worse.
 The money I 3 '..................................................................................' – it isn’t so much.
 There’s no big 4 '..................................................................................' for people like us.
 My 5 '..................................................................................' are never the same.
 There’s no “9–5” in the health 6 '..................................................................................' game.
 I can see you thinking, “That’s a job I’d hate”.
 But it’s 7 '..................................................................................' that makes it great.
VOCABULARY: ‘9–5’ – (US) Bürojob, geregelter Arbeitstag (9–17 Uhr)
Developing speaking competencies
 15 Complete the dialogue with the missing words.
 Anne Ow!!
 Tom What’s the matter?
 Anne It’s my shoulder. I’ve h................................ my shoulder.
 Tom L................................ me s................................. Where does it hurt?
 Anne Ouch! Don’t touch it. It’s f................................ p................................ !
 Tom Can you move it?
 Anne No, I can’t. It really h................................
 Tom Oh dear. You’r................................ be in a l................................ of p................................ What do you want to do?
 Anne Well, I f................................ g................................ on walking. We’ll have to go home.
 Tom OK, do you need help?
 Anne I think I do. I f................................ quite d................................
 Tom Maybe we should call an ambulance.
 Anne Maybe I just need to rest a bit.
 Tom OK, but if it doesn’t get better, I’m calling an ambulance.
16 Now listen and check your answers.
Pages 34–35
17 Read the letter of application. Why is Helen looking for a new job?
23 Ashleigh Road
 Symington
 KA1 5DZ
 Scotland
10 South Road
 Kilmarnock
 KA1 1QB
 Scotland
12/06/2019
Dear Mr Carter,
I am writing to apply for the post of a babysitter which I saw advertised in the Daily Record.
 I am 17 and I am currently attending Kilmarnock Grange Academy.
For two years, I have been looking after two children aged seven and nine, but since the family are moving to Glasgow in a month I am looking for another job as a babysitter. The family were very satisfied with my work and I am including a letter of recommendation from them.
I would like to say that I really enjoy looking after children and it would be a pleasure for me to look after your children.
Looking forward to hearing from you.
 Yours sincerely,
Helen O’Neill
 (Helen O’Neill)
Writing tip: Letter of application
Check your spelling and grammar carefully.
Avoid informal language and don’t use contracted forms.
Only include relevant information.
Include both the employer’s address and your address in the correct places.
Start the letter with Dear Mr/Mrs and end with Yours sincerely.
Explain why you are writing and say how you found out about the job.
Say why you are good for the job.
18 Now write your own answer to the following task.
Task
 Reply to the following job advertisement (120–180 words).
 Say:
 • who you are
 • what experience you have
 • when you could work
 • why you would like to work at Metro Pizza
 • why you are good for the job
 • that you hope for a reply
METRO PIZZA
 RESTAURANT
WAITER / WAITRESS
 METRO PIZZA RESTAURANT is seeking a friendly
 WAITER/WAITRESS
 to join their team in Derby.
 £10/hour plus tips.
 Must be able to work weekends.
Contact Giovanni at Pizza World, Green Street, Derby, DB6 1FT
VOCABULARY: seek – suchen
WORD FILE
 Jobs and professions
(Image description: Illustration of a job centre board with many notes pinned on it. Two people – one male, one female – are standing in front of it and pointing at the postings.)
accountant
receptionist
mechanic
nurse
health care
marketing
finance
electrician
secretary
flight attendant
computing
Page 36
MORE Words and Phrases
4
 computing
 I love programming, so I’m glad I found a job in computing.
 Datenverarbeitung; Computerwesen
finance
 She works in finance. She’s an accountant.
 Finanzwesen
health care
 If you want to work in health care, you need to be flexible.
 Gesundheitswesen
sales and marketing
 He has good people skills. No wonder he works in sales and marketing.
 Verkauf und Marketing
6
 deserve
 The team played well and really deserved to win.
 verdienen
female
 My dog’s a girl, so it’s female, not male.
 weiblich
male
 Male ducks are called drakes.
 männlich
satisfaction
 I love my job. It gives me a lot of satisfaction.
 Genugtuung; Zufriedenheit
unemployed
 I lost my job last week. Now I’m unemployed.
 arbeitslos
8
 career
 She started her career as a model ten years ago.
 Karriere; Berufslaufbahn
9
 be keen on
 I was very tired, so I wasn’t keen on going to the party.
 von etw begeistert sein
be responsible for
 The architect is responsible for designing the project.
 für etw verantwortlich sein
bonus
 The staff got a bonus for finishing the project on time.
 Bonus, Zulage; Prämie
deadline
 We had to hurry to meet the deadline.
 Frist, Abgabetermin
develop
 The company develops new software programmes.
 entwickeln
earn
 I need to earn a lot of money if I want to go on holiday to Australia.
 verdienen
launch
 The new product will be launched in July.
 einführen, auf den Markt bringen
pros and cons
 Each technology has its pros and cons.
 Vor- und Nachteile
salary
 She earns a good salary.
 Gehalt
think up
 Can’t you think up a better excuse than that?
 ausdenken, erfinden
working hours
 Most people enjoy shorter working hours and more leisure time.
 Arbeitszeit
12
 advice
 Take my advice. Don’t do it.
 Ratschlag
ambition
 His ambition is to become world champion.
 Ehrgeiz
casual
 Don’t be too casual during an interview for a new job.
 lässig; locker
company
 I’ve worked for the company for 2 years now.
 Unternehmen, Firma
confidently
 Try to speak and act confidently, but don’t be cheeky.
 selbstbewusst
employer
 My new employer is a big computer company.
 Arbeitgeber/in
enthusiastic
 My parents love classical music, but I’m not so enthusiastic.
 enthusiastisch, begeistert
eye contact
 Look at your interviewer and try to keep eye contact.
 Augenkontakt
(job) interview
 She has an interview next week for the manager’s job.
 Vorstellungsgespräch
memorise
 Read the text and try to memorise all the facts.
 sich einprägen
naturally
 Act naturally. Don’t try to be like another person.
 natürlich
skills
 We need someone with practical skills for the job.
 Fähigkeiten
15
 journalism
 She can write well. She’s looking for a career in journalism.
 Journalismus

```

## Output contract

Write `content/corpus/units/g4-u04/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g4-u04",
  "briefBank": "ed0525f1c242",
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
