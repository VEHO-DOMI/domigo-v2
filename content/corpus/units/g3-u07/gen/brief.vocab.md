# Vocab generation brief — g3-u07 (MORE! 3, Unit 7)

<!-- domigo:gen vocab g3-u07 bank=c74971b27547 prompt=346902f9f0f1 -->

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
| g3u07.w.to-fall-out-with-sb | to fall out with sb. | sich mit jdm. zerstreiten | wordfile | Relationships | — | fall out with sb. | to fall out with sb. ; fall out with sb. |
| g3u07.w.to-storm-out-of | to storm out of | wütend hinausstürmen | wordfile | Relationships | — | storm out of | to storm out of ; storm out of |
| g3u07.w.to-break-up-with-sb | to break up with sb. | mit jdm. Schluss machen | wordfile | Relationships | — | break up with sb. | to break up with sb. ; break up with sb. |
| g3u07.w.to-mind-your-own-business | to mind your own business | sich um seine eigenen Angelegenheiten kümmern | wordfile | Relationships | — | mind your own business | to mind your own business ; mind your own business |
| g3u07.w.to-make-up-with-sb | to make up with sb. | sich mit jdm. versöhnen | wordfile | Relationships | — | make up with sb. | to make up with sb. ; make up with sb. |
| g3u07.w.to-get-on-well-with-sb | to get on well with sb. | sich gut mit jdm. verstehen | wordfile | Relationships | — | get on well with sb. | to get on well with sb. ; get on well with sb. |
| g3u07.w.it-s-none-of-my-business | It's none of my business. | Das geht mich nichts an. | phrase | — | It's none of my business. | — | It's none of my business. |
| g3u07.w.to-laugh-at-sb | to laugh at sb. | jdn. auslachen | phrase | — | Some of the kids laughed at me at school. | laugh at sb. | to laugh at sb. ; laugh at sb. |
| g3u07.w.to-make-up-one-s-mind | to make up one's mind | einen Entschluss fassen | phrase | — | Once she has made up her mind about something, she doesn't let go. | make up one's mind | to make up one's mind ; make up one's mind |
| g3u07.w.to-make-fun-of-sb | to make fun of sb. | sich über jdn. lustig machen | phrase | — | Then one day, a kid was making fun of her at school. | make fun of sb. | to make fun of sb. ; make fun of sb. |
| g3u07.w.to-move | to move | umziehen ; übersiedeln | phrase | — | My parents want to move to California. | move | to move ; move |
| g3u07.w.soft-toy | soft toy | Stofftier | phrase | — | I've had these soft toys since I was a baby. | — | soft toy |
| g3u07.w.to-step-in | to step in | eingreifen ; dazwischen gehen | phrase | — | If a kid makes fun of your friend, you should step in. | step in | to step in ; step in |
| g3u07.w.relationship | relationship | Beziehung | phrase | — | George's relationship with Alessia changes over time. | — | relationship |
| g3u07.w.to-own | to own | besitzen | phrase | — | Which of the things you own do you like a lot? | own | to own ; own |
| g3u07.w.childhood | childhood (no pl) | Kindheit | phrase | — | I have lived in this house since my childhood. | — | childhood ; childhood no pl |
| g3u07.w.earring | earring | Ohrring | phrase | — | I lost my earring in the sea. | — | earring |
| g3u07.w.jealous | jealous | eifersüchtig | phrase | — | Your best friend has a new friend and you are feeling a bit jealous. | — | jealous |
| g3u07.w.to-keep-secret | to keep (a) secret | ein Geheimnis für sich behalten | phrase | — | My best friend can keep a secret. | keep secret | to keep secret ; keep secret ; to keep secret a ; keep secret a |
| g3u07.w.questionnaire | questionnaire | Fragebogen | phrase | — | Do the questionnaire to find out if you're a good friend. | — | questionnaire |
| g3u07.w.to-tell-sb-off | to tell sb. off | mit jdm. schimpfen | phrase | — | Your teacher tells you off in front of the class for not doing your homework. | tell sb. off | to tell sb. off ; tell sb. off |
| g3u07.w.to-solve | to solve | lösen | phrase | — | This solves all our problems. | solve | to solve ; solve |
| g3u07.w.beloved | beloved | geliebt | phrase | — | With a broken heart Stallone sold his beloved dog. | — | beloved |
| g3u07.w.nowhere | nowhere | nirgends | phrase | — | Stallone had no money left and nowhere to sleep. | — | nowhere |
| g3u07.w.script | script | Drehbuch | phrase | — | Stallone was trying to sell his script. | — | script |
| g3u07.w.to-struggle | to struggle | kämpfen ; sich abmühen | phrase | — | As an actor he struggled a lot. | struggle | to struggle ; struggle |
| g3u07.w.to-lie-to-sb | to lie to sb. | jdn. anlügen | phrase | — | A good friend never lies to you. | lie to sb. | to lie to sb. ; lie to sb. |
| g3u07.w.to-admit | to admit | zugeben | phrase | — | I told Tom to admit what happened. | admit | to admit ; admit |
| g3u07.w.to-blackmail | to blackmail | erpressen | phrase | — | Ollie saw me and then he tried to blackmail me. | blackmail | to blackmail ; blackmail |
| g3u07.w.clumsy | clumsy | ungeschickt | phrase | — | He knocked the books into the sink because he is so clumsy. | — | clumsy |
| g3u07.w.honest | honest | ehrlich | phrase | — | She lies a lot and is never honest. | — | honest |
| g3u07.w.a-pile-of | a pile of | ein Stapel an | phrase | — | I put my homework on the pile of books. | — | a pile of |
| g3u07.w.rash | rash | Hautausschlag | phrase | — | My skin's a bit red – I think it's a rash. | — | rash |
| g3u07.w.unwell | unwell | unwohl ; krank | phrase | — | She looks a bit unwell. | — | unwell |

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ana, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Candyman, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Russell, Ryan, Sacks, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Tell, Telling, Text, Thames, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Uros, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## v1 seeds (UNTRUSTED — mine for ideas, never copy unverified)

Known v1 defect classes: invented above-level carrier words, out-of-bank MC distractors, over-strict answers.

- `g3u07.w.to-fall-out-with-sb` ← v1 `to fall out with sb.`: d="To have a big argument and stop being friendly" · s="I _____ with my best friend Anna last week because she told everyone my private secret at school." · a=["fall out with","fell out with","fallen out with"] · mc=["to become friends with sb.","to meet sb.","to visit sb."]
- `g3u07.w.to-storm-out-of` ← v1 `to storm out of`: d="To leave a room quickly because you are angry" · s="He was so angry that he _____ out of the classroom, slamming the door loudly behind him." · a=["storm out of","stormed out of"] · mc=["to tiptoe out of","to creep out of","to sit in"]
- `g3u07.w.to-break-up-with-sb` ← v1 `to break up with sb.`: d="To end a romantic connection" · s="She decided to _____ with her boyfriend of two years after a big argument last weekend." · a=["break up with","broke up with"] · mc=["to marry sb.","to move in with sb.","to date sb."]
- `g3u07.w.to-mind-your-own-business` ← v1 `to mind your own business`: d="To not ask about things that are not about you" · s="Stop asking me so many personal questions about my family and _____ your own business!" · a=["mind your own business"] · mc=["to ask even more questions","to get involved","to gossip"]
- `g3u07.w.to-make-up-with-sb` ← v1 `to make up with sb.`: d="To become friends again after an argument" · s="They had a big fight yesterday morning, but today they _____ up and are best friends again." · a=["make up with","made up with"] · mc=["to break up","to fall out","to argue"]
- `g3u07.w.to-get-on-well-with-sb` ← v1 `to get on well with sb.`: d="To have a good, friendly connection" · s="I _____ on really well with my older cousin Sarah — we always laugh together and never argue about anything." · a=["get on well with","gets on well with","got on well with"] · mc=["to argue with sb.","to fight with sb.","to dislike sb."]
- `g3u07.w.it-s-none-of-my-business` ← v1 `It's none of my business.`: d="A way to say that something is not your problem" · s="Who she chooses to talk to at break time is _____. I should not get involved or ask questions." · a=["It's none of my business","none of my business"] · mc=["my responsibility","my problem","my job"]
- `g3u07.w.to-laugh-at-sb` ← v1 `to laugh at sb.`: d="To make fun of someone by laughing" · s="The mean children in the playground pointed and _____ him when he tripped over his shoelace and fell on the ground." · a=["laugh at","laughed at"] · mc=["to help sb. up","to comfort sb.","to apologise to sb."]
- `g3u07.w.to-make-up-one-s-mind` ← v1 `to make up one's mind`: d="To decide something after thinking about it" · s="I can't _____ my mind — should I buy the blue jumper or the red one for my sister's birthday present?" · a=["make up my mind","make up your mind","made up my mind","made up her mind"] · mc=["to lose one's mind","to speak one's mind","to have one's mind set"]
- `g3u07.w.to-make-fun-of-sb` ← v1 `to make fun of sb.`: d="To say or do things to laugh at someone in a mean way" · s="Don't _____ of him just because he's new at school and doesn't know anyone yet — that's mean and unkind." · a=["make fun of","made fun of","making fun of"] · mc=["to welcome sb.","to help sb.","to include sb."]
- `g3u07.w.to-move` ← v1 `to move`: d="To go and live in a different place" · s="We're going to _____ to a much bigger new flat next month in a different neighbourhood across town." · a=["move","moved"] · mc=["to stay in our current flat","to clean our flat","to sell our flat"]
- `g3u07.w.soft-toy` ← v1 `soft toy`: d="A cuddly animal made of fabric and stuffing" · s="She sleeps every night with her favourite _____ — a fluffy stuffed elephant made of very soft brown fabric." · a=["soft toy","soft toys"] · mc=["metal robot","hard wooden doll","plastic action figure"]
- `g3u07.w.to-step-in` ← v1 `to step in`: d="To help or do something when there is a problem" · s="When the two angry boys started pushing each other in the playground, the teacher had to _____ and stop the fight." · a=["step in","stepped in"] · mc=["to step back","to walk away","to pretend not to see"]
- `g3u07.w.relationship` ← v1 `relationship`: d="The way two people feel about and behave towards each other" · s="A good, healthy _____ with your close friends based on trust and respect is very important in life." · a=["relationships"] · mc=["meal","job","hobby"]
- `g3u07.w.to-own` ← v1 `to own`: d="To have something that is yours" · s="Does your family _____ a car, or do you rent one every time you need to drive somewhere?" · a=["own","owned","owns"] · mc=["to sell","to destroy","to give away"]
- `g3u07.w.childhood` ← v1 `childhood (no pl)`: d="The time when you are a child" · s="My happiest _____ memories are from summer holidays swimming at the lake with my cousins when I was 7 or 8." · a=["childhood"] · mc=["adulthood","old age","teenage years"]
- `g3u07.w.earring` ← v1 `earring`: d="A piece of jewellery you wear on your ear" · s="She lost one of her favourite gold _____ at the swimming pool — it must have fallen out of her ear in the water." · a=["earring","earrings"] · mc=["bracelet","necklace","ring"]
- `g3u07.w.jealous` ← v1 `jealous`: d="Wanting what someone else has, or not wanting to share" · s="She was very _____ because her classmate got a better grade on the test than she did, even though she studied harder." · a=[] · mc=["proud","happy for her","glad"]
- `g3u07.w.to-keep-secret` ← v1 `to keep (a) secret`: d="To not tell anyone about something private" · s="Can you _____ a secret? I have something important and personal to tell you — please don't tell anyone else." · a=["keep a secret","keep secret","kept a secret","kept secret"] · mc=["to tell (a) secret","to share (a) secret","to reveal (a) secret"]
- `g3u07.w.questionnaire` ← v1 `questionnaire`: d="A list of questions you answer, often on paper" · s="Please fill in this _____ form with 20 questions about your reading habits and favourite types of books." · a=["questionnaires"] · mc=["poem","song","drawing"]
- `g3u07.w.to-tell-sb-off` ← v1 `to tell sb. off`: d="To speak to someone angrily because they did something wrong" · s="My strict mum _____ me off for coming home too late from my friend's house last Friday night — I was an hour late." · a=["tell off","told off","tells off"] · mc=["to praise sb.","to thank sb.","to reward sb."]
- `g3u07.w.to-solve` ← v1 `to solve`: d="To find the answer to a problem" · s="Can you please help me _____ this tricky maths word problem? I've been stuck on it for 30 minutes already." · a=["solve","solved"] · mc=["to create","to make harder","to cause"]
- `g3u07.w.beloved` ← v1 `beloved`: d="Loved very much" · s="The kind old woman sat peacefully with her _____ old cat Whiskers on her lap, gently stroking its soft fur." · a=[] · mc=["unwanted","hated","annoying"]
- `g3u07.w.nowhere` ← v1 `nowhere`: d="Not in any place, not anywhere" · s="There was _____ to sit because all twenty seats on the train were already taken by other passengers." · a=[] · mc=["everywhere","somewhere","a place"]
- `g3u07.w.script` ← v1 `script`: d="The written text of a film or play" · s="The film actors all read the _____ together around a table before they started filming the scenes with cameras." · a=["scripts"] · mc=["instructions for the camera","costumes and props","lighting equipment"]
- `g3u07.w.to-struggle` ← v1 `to struggle`: d="To try very hard to do something that is difficult" · s="He _____ a lot with his English homework because it was very hard and he didn't understand the new grammar rules." · a=["struggle","struggled"] · mc=["to enjoy","to find easy","to finish quickly"]
- `g3u07.w.to-lie-to-sb` ← v1 `to lie to sb.`: d="To say something that is not true on purpose" · s="She _____ her teacher about why she was late to school this morning — she said the bus was late but it wasn't true." · a=["lie to","lied to"] · mc=["to tell the truth to sb.","to be honest with sb.","to give correct information to sb."]
- `g3u07.w.to-admit` ← v1 `to admit`: d="To say that something is true, especially something bad" · s="He didn't want to _____ that he broke the classroom window with his football, even though everyone saw him do it." · a=["admit","admitted"] · mc=["to deny","to hide","to reject"]
- `g3u07.w.to-blackmail` ← v1 `to blackmail`: d="To force someone to do what you want by saying you will tell a secret" · s="He _____ his classmate by saying he would tell the whole class her embarrassing secret unless she gave him €10." · a=["blackmail","blackmailed"] · mc=["to help","to befriend","to protect"]
- `g3u07.w.clumsy` ← v1 `clumsy`: d="Often dropping things or falling over by accident" · s="I'm so _____ today — I've already knocked over my glass of water twice at the lunch table without meaning to." · a=[] · mc=["graceful","coordinated","careful"]
- `g3u07.w.honest` ← v1 `honest`: d="Always telling the truth" · s="Please be _____ with me and tell me the truth — did you really like my drawing or were you just being polite?" · a=[] · mc=["dishonest","fake","insincere"]
- `g3u07.w.a-pile-of` ← v1 `a pile of`: d="A lot of things put on top of each other" · s="There is _____ dirty, smelly clothes stacked high on the floor of his messy bedroom that he hasn't washed for weeks." · a=["a pile of","pile of"] · mc=["a single","one piece of","two"]
- `g3u07.w.rash` ← v1 `rash`: d="Red spots on your skin, often because of an allergy" · s="She got an itchy red _____ with bumps all over her arms and neck after touching the strange poisonous plant in the forest." · a=["rashes"] · mc=["tan","sunburn","scratch"]
- `g3u07.w.unwell` ← v1 `unwell`: d="Not feeling well, a bit ill" · s="He looked very pale and _____, so the school teacher sent him home to rest in bed with some hot tea." · a=[] · mc=["very healthy","full of energy","perfectly fine"]

## Unit transcripts (textbook sentences live here — use them first)

```
----- SB: More 3 SB Unit 7.txt -----
Unit 7 Friends forever
Pages 58–59
At the end of unit 7 …
 you know
 ☑ 6 verb phrases to talk about relationships
 ☑ how to use the present perfect for and since
you can
 ☑ understand a story and a newspaper article about friendship
 ☑ understand interviews about possessions
 ☑ talk about friendship, possession and duration
 ☑ understand a questionnaire
 ☑ write about your favourite possession
 ☑ write an email to the editor about your best friend
READING Understanding a story about friendship
1 Read the story.
 Alessia
I’ve been friends with Alessia for two years, but it wasn’t always that way. When she and her family moved here, I wasn’t really happy.
A girl from another country – so it would be difficult to talk to her. “She still has to learn the language,” Mum said. Fine by me, I thought, let her learn it, but it’s none of my business. But I knew my mum. “George,” she said, “you must help her.” “Why me?” I said.
 “I’ve never done anything like that. I’m not a teacher. All I can do is teach her how to play football.” “Don’t be silly,” Mum said. “And take her some of your old books, the simple ones, and maybe one or two soft toys.” “Mum!” I cried, “I’ve had those books for years. I like them. They were my favourites when I was little. And the soft toys too. I’ve had them since I was a baby.” “I didn’t say take all of them; just one or two. And I’m sure you’ll get the books back once she can read them. And take her one or two games as well.”
 I knew my mum. Once she has made up her mind about something, she doesn’t let go. So I did as she told me; I took the stuff and said hello to the family. They seemed really happy, and Alessia smiled and smiled – but didn’t say a word.
“You’ve been a great help,” Mum said when I came back. “Now let’s see what else we can do for them.” “Oh damn,” I thought, “why can’t I have parents that are kind to others without the help of their son?”
 From then on it was like this: Mum: Take these headphones to Alessia! Me: But … Mum: No but, you haven’t used them for years, you listen to your music on your new ear pods, so give them anyway. Or: Mum: Take this skateboard to Alessia. Me: But Mum, I’ve just started to use it again. Mum: Only because you knew I wanted to give it away.
 Anyway, again and again I went next door, and of course, I talked to Alessia about this and that. And I kind of liked the way she smiled when she got these presents. And I liked the cookies her mum gave me.
 Then one day, a kid was making fun of her at school and I stepped in.* Some of the kids laughed at me for that, but I didn’t really mind. After all, I am the school’s best footballer, so nobody would give me a hard time.
 Anyway, what happened was that Alessia and I became friends. Just like that, I think. We talked to each other every day, and sometimes we smiled together. I quite liked talking to her, and I also noticed that her English got so much better. For some reason her parents kept saying, “You’ve been such a big help, George, thank you very much.” But then they stopped because they began to understand that I quite liked helping her. And I actually like Alessia, too. There’s only one little problem now. Her parents are talking about moving to another city. And Alessia and I are now talking about how we can stop them.
VOCABULARY: step in – eingreifen, dazwischengehen
2 How many of these tasks can you do?
 1 When Alessia’s family moved in near George’s,
 ☐ he didn’t want to help Alessia.
 ☐ he was happy.
 ☐ he invited her to play football.
2 George’s mum told him to
 ☐ teach her how to play football.
 ☐ go and say hello.
 ☐ take her some of his things.
3 When he first took Alessia some of his things,
 ☐ she said thank you.
 ☐ she looked happy.
 ☐ her parents didn’t seem very happy.
4 George was happy to give away his headphones. T / F
 5 George was worried about children bullying him at school. T / F
 6 George doesn’t want Alessia’s family to move again. T / F
7 Where do you think this text comes from?
 8 How does George’s relationship with Alessia change over time?
 9 What do you think happens next?
3 Check your answers with a partner. Then listen to the story.
LISTENING & SPEAKING Talking about possession and duration
4 a Listen and write the names under the pictures.
 (Images left to right: a dog, a mobile phone, a purple bicycle, a teddy bear)
 Names: Jack, Liam, Chloe, Sonia
1 ……………………
 2 ……………………
 3 ……………………
 4 ……………………
b Listen again and complete the table.
Name	How long have you had it?	How often do you use it? / How much time do you spend with it?
Liam	1 ………………………………	2 ………………………………
Sonia	3 ………………………………	4 ………………………………
Jack	5 ………………………………	6 ………………………………
Chloe	7 ………………………………	8 ………………………………

5 Look at the questions in 4 again. Now listen to two more interviews and take notes for John and Pat in your exercise book.
Pages 60–61
SPEAKING Talking about duration
 6 In pairs, ask and answer questions.
How long have you ...
known your best friend?
had your camera (mobile phone, surfboard, earrings, skateboard, mountain bike, necklace ...)?
lived in your house/flat?
Note:
 How long have you lived in your house/flat?
 For 2 months / 3 years / a long time.
 Since 2010 / Christmas / I was ten / my childhood.
 Use for when you can say lang in German:
 2 Monate lang, 3 Jahre lang, etc.
READING Understanding a questionnaire
 7 Read the questionnaire and tick your answers.
Are you a good friend?
 So just how good a friend are you? Answer these questions honestly and we’ll tell you!
1 Your friend bought you a T-shirt for your birthday that you really don’t like. What do you do?
 ⬜ a Tell your friend you hate it and ask for another present.
 ⬜ b Thank them. Say you like it, but never wear it.
 ⬜ c Thank them, but explain it’s not your favourite colour and ask if you could exchange it.
2 Your teacher told you off* in front of the class for not doing your homework. After the lesson your friend asks you if you’re OK. What do you say?
 ⬜ a Tell them to mind their own business.
 ⬜ b Say everything is OK and tell them not to worry about you.
 ⬜ c Tell them about the problems you’ve been having with the subject.
3 Your best friend has a new boyfriend/girlfriend and you are feeling a bit jealous. What do you do?
 ⬜ a Tell them they need to break up with their boyfriend/girlfriend.
 ⬜ b Do nothing and try to stop feeling that way.
 ⬜ c Get to know the new boyfriend/girlfriend so you can all hang out together.
4 Your friend says they can’t come to your birthday party because they want to watch a football game on TV. What do you do?
 ⬜ a Storm out of the room and never speak to them again.
 ⬜ b Explain that you will feel quite upset if they don’t come.
 ⬜ c Tell them to come and they can watch the game at the party.
5 You have a huge argument with your best friend and you don’t speak for a week. What do you do?
 ⬜ a Find a new best friend.
 ⬜ b Send them a text saying you’ll say “sorry” if they say “sorry”.
 ⬜ c Go around to their house to make up with them.
6 Your friend tells you about a boy/girl they like. They ask you to keep it secret. What do you do?
 ⬜ a Tell everyone.
 ⬜ b Listen politely, but you’re not really very interested.
 ⬜ c Start planning with your friend how to talk to the person they like.
VOCABULARY: tell sb. off – mit jdm. schimpfen
b Work out how many times you chose a, b and c, and check your result on page 62.
VOCABULARY Relationships
 8 Find the phrases in the quiz in 7 and the results and match them with their meanings.
1 break up with ⬜
 2 fall out with ⬜
 3 make up with ⬜
 4 get on well with ⬜
 5 mind your own business ⬜
 6 storm out of ⬜
a to solve your problems and be friends again
 b to not interfere with other people’s lives
 c to finish a (romantic) relationship
 d to leave a place angrily
 e to have a good relationship with someone
 f to stop speaking to someone
READING Understanding a newspaper article
 9 Read the newspaper article and choose the best title for it.
⬜ Man’s Best Friend
 ⬜ The Actor, his Friend and the Dog
IT’S A DOG’S LIFE
They say that a dog is man’s best friend. Well, there’s one famous Hollywood star who might just agree. Sylvester Stallone has been a successful actor for over 45 years and films such as Rocky, Rambo and The Expendables have made him a household name all over the world.
But like many actors, before he found success, life wasn’t always so easy. In 1975, Stallone was a struggling actor trying to sell his script for a film about boxing called Rocky. No one was interested and soon Stallone had no money left and nowhere to sleep. He only had one possession left and he was determined to hang on to it. With a broken heart Stallone sold his beloved dog to a man called Little Jimmy for $50.
A week later, Stallone sold the script for a huge sum. As soon as he had the money, he immediately went to see Little Jimmy and asked to buy his dog back. Little Jimmy wasn’t interested because his children already loved the dog, so Stallone made him another offer for $3,000 – 60 times the original price. Now Little Jimmy was interested but he still wanted one more thing: he wanted a role in the film. Stallone agreed. And that is how Sylvester Stallone got his best friend back and gave Little Jimmy and (of himself) a small part in one of the biggest films of that year. In fact, Rocky went on to win three Oscars at the 1976 Academy Awards including one for best picture.
(Image description: A photo of young Sylvester Stallone cuddling his dog, smiling.)
10 Write the words in italics from the text in 9 next to their definitions.
1 finding it difficult to be successful – …………………………………
 2 a part (in a film) – …………………………………
 3 the words in a film in written form – …………………………………
 4 a lot of money – …………………………………
 5 a very famous person – …………………………………
 6 something you own – …………………………………
Pages 62–63
11 Match the sentence halves.
1 Stallone has been a ⬜
 2 As a young man, however, ⬜
 3 Stallone tried to sell the script ⬜
 4 So with a broken ⬜
 5 A week later, he sold the ⬜
 6 The new owner, Little Jimmy, didn’t ⬜
 7 So Stallone offered him ⬜
 8 He also offered him ⬜
 9 Little Jimmy agreed and Stallone ⬜
⬜ for Rocky, but couldn’t.
 ⬜ a lot of money.
 ⬜ got his dog back.
 ⬜ successful actor for many years.
 ⬜ want to sell it.
 ⬜ a part in the film.
 ⬜ he didn’t have a lot of money.
 ⬜ script and wanted to buy his dog back.
 ⬜ heart he sold his dog for $50.
SPEAKING Talking about friendship
 12 Complete the statements with the verbs from the box in their correct form.
 Then listen and check.
 (Box with verbs: lie, listen, hear, keep)
1 A good friend always ………………………… a secret for you. ⬜
 2 A good friend never ………………………… to you. ⬜
 3 A good friend ………………………… to your problems. ⬜
 4 Good friends don’t just say what you want to ………………………… . ⬜
13 In 12, tick the statements you agree with. Then say what you think.
Girl 1: I think it’s important / not important in a friend that he/she …
 Boy: I think a good friend … / doesn’t …
 Girl 2: I think that with a good friend, you can …
(Texts under images of three teens):
Mostly a:
 You probably fall out with a lot of people. Try to be a bit more understanding! Then you'll make good friends.
Mostly b:
 Lots of people would like to be friends with you. You haven’t found your best friend yet? Take it easy – you soon will.
Mostly c:
 You’re an excellent friend and get on well with everyone. Other people love being with you. Congratulations!
WRITING CHOICES
 14
A Write about an object you like (60–80 words). Read your text out to your class. The others guess what it is. In your text, don’t say what the object is, but include:
how long you’ve had it
how often you use it
what it is made of
B An English teen magazine is asking its readers to write about their best friends. Write an email of 120–180 words to the editor with your ideas.
 In your email:
give a few facts about your friend
say since when you have been friends
mention why you are such good friends
say what you (don’t) like about your friend
say why you will be friends for many years
GRAMMAR Present perfect with for / since
Read the sentences and answer the questions.
I’ve been friends with Alessia for two years.
 1 Is the speaker still friends with Alessia?
 yes ⬜ no ⬜
I’ve had those books for years.
 2 Does the speaker still have the books?
 yes ⬜ no ⬜
(Image of a woman standing next to a knight in armor with caption: "He's been in the family for 800 years.")
How to use it:
 You use the present perfect to talk about actions and events that started in the past and continue in the present.
How to form it:
 Person + have/has + past participle
If you want to say how long something has been going on, you can use for or since. Use for when you can say lang in German.
You haven’t used it for years / for two months / for a week, etc.
 (jahrelang, zwei Monate lang, eine Woche lang)
I’ve had those toys since Christmas / since 2015 / since I was seven / since I was a baby, etc.
Pages 64–65
1 Watch or listen to the dialogue. Then read it. How does Kate think Tom is feeling?
Kate There you are. I’ve spent the last hour looking for you. And you weren’t on the bus this morning or yesterday.
 Tom What?
 Kate I said … Tom, what’s the matter? Are you alright?
 Tom Yeah. Yeah. It’s nothing. I’m just a bit tired.
 Kate It’s not nothing. You don’t look at all well.
 Tom I told you. I’m just a bit tired. I haven’t slept well for a few nights.
 Kate Poor you. Have you got any idea why?
 Tom No, not really. I’ve got a bit of a stomach ache too. That doesn’t help.
 Kate That’s terrible! Did you eat something bad?
 Tom I don’t think so. Nothing I can remember anyway.
 Kate And what’s that on your skin?
 Tom Where?
 Kate There on your arm. It looks a bit red.
 Tom Oh that. It’s just a bit of a rash. It’s on my legs and stomach too.
 Kate How awful. When did this start?
 Tom A couple of days ago.
 Kate About the same time you started sleeping badly and getting stomach ache?
 Tom Yeah, I suppose so.
 Kate I don’t think you’re ill, Tom. I think you’re stressed.
 Tom Stressed? What do you mean?
 Kate I think something happened a few days ago and you’re worried about it. That’s why you’re feeling this way. Now, if I’m right and you consider me a good friend, I think you should tell me. After all, that’s what good friends are for.
2 Complete the medical report for Tom.
1 Tom is feeling …………………………………………. because he’s finding it difficult to ………………………………………….
 2 He’s also got a pain in ………………………………………….
 3 There are red marks on his …………………………………………. and ………………………………………….
 4 This all started ………………………………………….
3 Write A (asking about someone’s health) or T (talking about how you feel).
☐ 1 What’s the matter?
 ☐ 2 Are you alright?
 ☐ 3 I’m just a bit tired.
 ☐ 4 You don’t look at all well.
 ☐ 5 I’ve got a bit of a stomach ache.
 ☐ 6 What’s that on your skin?
 ☐ 7 Your arm looks a bit red.
 ☐ 8 It’s just a bit of a rash.
❓What do you think? Answer the questions.
🔶 What do you think is wrong with Tom?
 🔶 Will Kate be able to help him?
MOBILE HOMEWORK
Watch part 2 of the video and complete Kate’s diary entry.
Found out why Tom was feeling bad. He forgot to give in his 1 ………………………………………. homework after the lesson so he went back to the classroom. His teacher, 2 ………………………………………. wasn’t there so he left his book on the table, but he knocked the books 3 ………………………………………, which was full of water. How clumsy. Anyway, he left without saying anything, but Ollie Woods 4 ………………………………………. it and he wanted 5 ………………………………………. every day otherwise he would tell on Tom. I told Tom to admit what happened. He did and Mr Leathers was really 6 ………………………………………. with him.
4 Complete. Then check with the dialogue in 1.
1 Tom I told you. I’m just a bit tired. I haven’t slept well for a few nights.
  Kate P………………………………………. y………………………………………. . Have you got any idea why?
 2 Tom No, not really. I’ve got a bit of a stomach ache too.
  Kate T………………………………………. t………………………………………. !
 3 Tom Oh that. It’s just a bit of a rash. It’s on my legs and stomach too.
  Kate H………………………………………. a………………………………………. .
5 ROLE PLAY: Work in pairs. Look at your role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You don’t feel well. Make a list of three problems you have. When your partner asks you about your health, tell him/her what’s wrong.
Student B
 Your friend looks unwell. Ask where the problem is, and offer some sympathy.


----- WB: More 3 WB Unit 7.txt -----
UNIT 7 Friends forever
Pages 56–57
UNDERSTANDING VOCABULARY Relationships
1 Match the sentences.
 1 Tom has broken up with Dawn again.
 2 I went out with my mum last night.
 3 I've made up with Lucy.
 4 I got on really well with my dad.
 5 I asked Mehmet what had happened.
 6 I told Barbara I didn’t like what she said.
 □ We're best friends again.
 □ I love going to football games with him.
 □ It’s the third time they’ve done it this month!
 □ He told me to mind my own business.
 □ She stormed out of my house.
 □ She wanted help in the kitchen, but I was too tired.
USING VOCABULARY Relationships
2 Complete the text. Choose the correct option to complete each space.
1 a) up   b) on     c) through
 2 a) up   b) out   c) on
 3 a) up   b) down  c) off
 4 a) take  b) do     c) mind
 5 a) blew  b) rained    c) stormed
 6 a) in    b) on     c) over
Have you heard the news? James has fallen 1. …………………… with Brenda. No, he hasn’t broken 2. …………………… with her because they weren’t girlfriend and boyfriend – although I think she quite likes him.
 I say that because she really wants to make 3. …………………… with him. She even tried to say sorry. He wasn’t interested. He’s really angry with her. The problem started when she said that she didn’t like his nose stud. He told her to 4. …………………… her own business.
 I think that was a bit rude. But then she told him to take the stud out. Well, that made him really angry and he 5. …………………… out of the room. He hasn’t spoken to her for a week now. It’s a shame because they were really good friends and got 6. …………………… really well with each other.
3 Match the phrases in italics in 2 with their meanings. Write the numbers next to the letters.
A don’t give advice* to people if they didn’t ask you
 B start a romantic relationship with someone
 C leave somewhere angrily
 D have a good relationship with someone
 E stop talking to a friend
 F become friends again
VOCABULARY: *advice – Ratschlag
4 Answer the questions about you.
 1 What sort of things do you fall out with your best friend about?
 2 What’s the best way to make up with a friend?
 3 What kind of people do you get on really well with?
 4 Have you ever stormed out of a room? What was the reason?
UNDERSTANDING GRAMMAR Present perfect with for/since
5 Match the sentences and the pictures.
 1 They’ve been married for 25 years.
 2 I’ve known her since we were born.
 3 They’ve had that TV since the 1970s!
 4 You’ve only had it for a day!
(Image A: Two elderly people watching an old TV.)
 (Image B: A girl holding a large pencil talks to another girl in front of lockers.)
 (Image C: A wedding couple under a banner that says “25 YEARS”.)
 (Image D: Two girls wearing matching outfits, one with an arm around the other.)
6 Write the words in the correct columns. Then add three more examples of your own.
Words to sort:
 a few weeks, many years, this morning, the weekend, a lifetime, she was a child, three days, 10 p.m., 1999, a few seconds, last Friday, a couple of hours
for
 ............................................................
 ............................................................
 ............................................................
 ............................................................
 ............................................................
 ............................................................
since
 ............................................................
 ............................................................
 ............................................................
 ............................................................
 ............................................................
 ............................................................
7 Complete with for or since.
 1 I have had my laptop …………………………… half a year.
 2 Molly has had her cat …………………………… December.
 3 Ben has had his piano …………………………… he was six years old.
 4 Mohammed has had his skateboard …………………………… three months.
 5 Amber has had her roller skates …………………………… yesterday.
 6 We have had our dog …………………………… six years.
 7 We have known Mr Thomas …………………………… 2015.
 8 I have liked Ed Sheeran …………………………… ages.
Pages 58–59
8 Use the table to write five sentences that are true for you.
 I’ve had my sunglasses for four months.
Table:
 I've had my
 watch
 laptop
 bike
 snowboard
 earrings
 sunglasses
 necklace
 ear pods
 dog
 friendship band
 roller skates
for
 ... months.
 ... years.
 yesterday.
 the end of the school year.
 Christmas.
 my birthday.
 last summer.
 Easter.
 last year.
 2016.
 ... weeks.
 ... days.
since
 (Same list as above)
9 Write sentences with for or since.
 1 I / have / smartphone / Christmas
   I’ve had my smartphone since Christmas.
 2 I / have / laptop / six months.
 ………………………………………………………………………………………………………
 3 My father / work / in that office / two years.
 ………………………………………………………………………………………………………
 4 My sister / have / tattoo / July.
 ………………………………………………………………………………………………………
 5 They / live / in that flat / 2004.
 ………………………………………………………………………………………………………
 6 You / have / this problem / two weeks.
 ………………………………………………………………………………………………………
 7 I / not play / football / last year.
 ………………………………………………………………………………………………………
 8 We / be / students at this school / a very long time!
 ………………………………………………………………………………………………………
10 Complete the sentences with the present perfect form of the verbs in the box.
 play wear be know live have like
1 His wife …………………………………………… a doctor for twenty years.
 2 He …………………………………………… always …………………………………………… black clothes since he was a teenager.
 3 They …………………………………………… next door to us for six months.
 4 You …………………………………………… my family for a long time.
 5 She …………………………………………… a dog since March.
 6 My brother …………………………………………… mushrooms since he was a baby.
 7 Dave …………………………………………… tennis since he was ten.
 8 We …………………………………………… best friends for years.
11 Complete the sentences about you. Use the present perfect and for and since.
1 I …………………………………………………………………………………………………… (know my best friend)
 2 My family ……………………………………………………………………………………… (live in our house/flat)
 3 I …………………………………………………………………………………………………… (be at this school)
 4 My best friend ……………………………………………………………………………… (live in this town)
 5 I …………………………………………………………………………………………………… (had a mobile phone)
 6 Mr/Ms …………………………………………………………………………………………… (be my English teacher)
12 Complete the dialogues with the correct form of the verbs in brackets.
DIALOGUE 1
 Interviewer Hi, Jenny. Tell me, which of the things that you own do you like the most?
 Jenny Oh, that’s easy. My tablet.
 Interviewer Your tablet? OK. How long 1 ……………………………… you ……………………………… it? (have)
 Jenny I 2 ……………………………… it since last Christmas. (have)
 Interviewer And how often 3 ……………………………… you ……………………………… it? (use)
 Jenny I 4 ……………………………… it every day. (use) In fact, I 5 ……………………………… it right now. (use)
DIALOGUE 2
 Interviewer Hi, Roland. Tell me, which of the things that you own do you like the most?
 Roland Hmmm, my mobile phone, I suppose.
 Interviewer How long 1 ……………………………… you ……………………………… it? (have)
 Roland I 2 ……………………………… it for about a month. (have)
 Interviewer So, 3 ……………………………… you ……………………………… it a lot? (use)
 Roland Sure, I can play games on it, and take pictures and even videos.
         I 4 ……………………………… a video of my English lesson. (take) 5 ……………………………… you ……………………………… to see it? (want)
13 Write a short similar dialogue of your own.
 [Blank lined box for student writing]
Pages 60–61
14 Read the story. Which of the writer’s friends went to his wedding?
 Friends reunited
When I was younger, my family lived in a small village in the Welsh countryside. The population was only about 1,000 so everybody knew everybody.
I went to the village school. There were about 20 children in my class and we were all friends. I had two best friends, Nigel and Miriam, who I got on really well with. We went everywhere and did everything together. Nigel and I were born on the same day, so each year we had a big birthday party together.
I was very happy there, so you can imagine how upset I was one day when my father told us that we were moving. I was nine. My parents promised we’d come back to visit, but I didn’t believe them. My brother and I begged my parents not to go, but it was no use.
A month later, we were living in a new town. I had a new school to go to and I had new friends to make. We never went back and apart from a birthday card each year from Nigel, I never heard from my friends again. After a few years, even the birthday cards stopped coming.
At first, I thought I’d never be happy again. However, after a few weeks, I had new friends, and after a few months, I didn’t want to be anywhere else.
When I was 18, I left home and went to university to study engineering. I made many new friends there. After university, I found a job working for a railway company and again I made new friends. Then, one day, when I was about 25, someone offered me a new job to work in Nigeria in Africa. I was still young and I liked the idea of adventure, so I accepted.
At first, I was quite lonely. I was living by myself in a small flat in a big busy city. For the first time in my life I wasn’t surrounded by friends. One day, someone at work told me about a club in the city where people from different countries hung out. I decided to go and try and make some new friends. I was a bit nervous but the people there were really welcoming. There was one girl who seemed very interesting and soon we started talking. She was British, like me, but when I asked her where she was from, I couldn’t believe what I heard. She was born in London, but when she was nine, her family moved to the very same village I left when I was the same age. In fact, her family arrived a month after mine left. Her best friend was Miriam. She also knew Nigel.
To cut a long story short. We started dating and a year later we got married. There were lots of people at the wedding: my family, my friends from university, my friends from work, my friends from school and our first best friends, Miriam and Nigel!
15 How many of these tasks can you do?
1 The writer shared a birthday with
 ☐ Miriam. ☐ his dad. ☐ Nigel.
2 The writer was …………… when he moved to a new home.
 ☐ eight ☐ nine ☐ ten
3 They moved home …………… weeks after their dad first told them the news.
 ☐ four ☐ six ☐ eight
4 Nigel sent him birthday cards until he was 18. T / F
5 The writer studied economics at university. T / F
6 The writer’s company sent him to Africa to work. T / F
7 Where was the writer living in Africa?
 ………………………………………………………………………………………………………………………
8 Why did he go to the club?
 ………………………………………………………………………………………………………………………
9 What did he have in common with the girl he met at the club?
 ………………………………………………………………………………………………………………………
16 Listen and check your answers.
17 Listen to Jack’s parents talking about friendship. Then complete the sentences.
1 The most important thing for young people is
 ………………………………………………………………………………………………………………………
 ………………………………………………………………………………………………………………………
 ………………………………………………………………………………………………………………………
2 Most young people only have a few
 ………………………………………………………………………………………………………………………
 ………………………………………………………………………………………………………………………
3 Tina and Leonie have been best friends since they
 ………………………………………………………………………………………………………………………
4 Best friends have known each other
 ………………………………………………………………………………………………………………
5 You hang out with other friends at
 ………………………………………………………………………………………………………………
6 Best friends tell each other
 ………………………………………………………………………………………………………………
7 With best friends you can talk about
 ………………………………………………………………………………………………………………
Image descriptions:
On page 60, two illustrations appear in the reading section:
One shows a red-roofed house in a green hilly countryside area with a family car driving away, with a boy looking back sadly.
The second shows a wedding scene outdoors with four people: a man and a woman getting married and two guests cheering with flower petals.
On page 61, in the listening section, there's a photo of two smiling teenage girls with their arms around each other, suggesting a strong friendship.
Pages 62–63
18
 CHOICES
 A Complete the dialogues with the sentences in the box. Then listen and check.
a I think I’ll put some cream on it.
 b I’m just a bit tired.
 c I’ve just got a bit of stomach ache.
 d You’re right. I think I might go to bed.
 e It’s just a bit of a rash.
 f I don’t think so.
1 Alfie
 Ray 1 ……………………………………………………………………………………..
 Alfie Oh dear. Did you eat something bad?
 Ray 2 ……………………………………………………………………………………..
2 Cole
 Cole What’s that on your leg?
 Sonia 3 ……………………………………………………………………………………..
 Cole Yes, it doesn’t look very good.
 Sonia 4 ……………………………………………………………………………………..
3 Freddy
 Freddy Are you alright?
 Sara 5 ……………………………………………………………………………………..
 Freddy You don’t look well at all.
 Sara 6 ……………………………………………………………………………………..
B Complete the mini-dialogues with the missing words. Then listen and check.
1
 Sue What’s the 1 m……………………………? Are you 2 a……………………………?
 Glen I’ve got a 3 b…………………………… of a headache.
 Sue 4 P…………………………… you. You should lie down for a bit.
2
 Mike You don’t look 5 w…………………………… at all.
 Alison I’m 6 j…………………………… a bit tired. I didn’t sleep at all last night.
 Mike How 7 t…………………………… you? Why don’t you go and lie down for a while?
3
 Andy What’s that on your skin? Your leg looks a bit red.
 Gaby It’s just a bit of a 8 r……………………………. Actually, it’s all over my body.
 Andy How 9 a…………………………… you? You need to see a doctor.
19 Read the task and what a student wrote. What should George let Jessie know?
Task
 Your friend just texted you to say he/she won’t be at school today because he/she is feeling bad. You send him/her a message (60–80 words).
 In your message:
 ✔ ask why he/she is feeling bad
 ✔ say what he/she looked like when you last saw him/her
 ✔ wish him/her well
Message:
 FROM: j.foster@mailconnect.com
 SUBJECT: How are you?
Hi George,
 Sorry to hear you are not well. Is it your headaches again? Or do you think it’s the flu? You looked a bit tired yesterday evening after the movie. I hope you’ll feel better in the afternoon. Let me know how you are, maybe I can drop by.
 Take care and have a good rest.
 Hugs,
 Jessie
Useful Language:
 Asking about health
 • How are you?
 • Is there anything wrong?
 • Are you alright?
 • Can I bring you …?
 • You don’t look … What’s the matter?
 • Could it be the flu / something you ate …?
20 Now write your own answer to the following task.
Task
 You wanted to meet your friend in the evening but you don’t feel well. Send him/her a message (60–80 words).
 In your message, you tell him/her:
 ✔ why you can’t meet
 ✔ why you don’t feel well
 ✔ that you hope he/she’s OK
[Blank blue-lined space for writing the message]
Image descriptions:
On page 62, there is a cartoon-style image of two teenagers. One is visibly unwell, holding a hand to their stomach with a concerned expression. The other is gesturing sympathetically while listening.
On page 63, there is a graphic of a smartphone or email interface showing the message from Jessie to George. Next to it, a pale blue box displays the "Useful Language" section.
Page 64
WORD FILE
 Relationships
to fall out with sb.
 to storm out of
 to break up with sb.
 to mind your own business
 to make up with sb.
 to get on well with sb.
[Image description: A group of teenagers interacting in various ways. On the left, two girls are arguing. One is shouting, and the other looks upset. In the middle, a boy storms off angrily. On the right, three teens are smiling and chatting, two of them with arms around each other.]
MORE Words and Phrases
1
 It’s none of my business.
 Das geht mich nichts an.
to laugh at sb.
 Some of the kids laughed at me at school.
 jdn. auslachen
to make up one’s mind
 Once she has made up her mind about something, she doesn’t let go.
 einen Entschluss fassen
to make fun of sb.
 Then one day, a kid was making fun of her at school.
 sich über jdn. lustig machen
to move
 My parents want to move to California.
 umziehen, übersiedeln
soft toy
 I’ve had these soft toys since I was a baby.
 Stofftier
to step in
 If a kid makes fun of your friend, you should step in.
 hier: eingreifen, dazwischen gehen
2
 relationship
 George’s relationship with Alessia changes over time.
 Beziehung
4
 to own
 Which of the things you own do you like a lot?
 besitzen
6
 childhood (no pl)
 I have lived in this house since my childhood.
 Kindheit
earring
 I lost my earring in the sea.
 Ohrring
7
 jealous
 Your best friend has a new friend and you are feeling a bit jealous.
 eifersüchtig
to keep (a) secret
 My best friend can keep a secret.
 ein Geheimnis für sich behalten
questionnaire
 Do the questionnaire to find out if you’re a good friend.
 Fragebogen
to tell sb. off
 Your teacher tells you off in front of the class for not doing your homework.
 mit jdm. schimpfen
8
 to solve
 This solves all our problems.
 lösen
9
 beloved
 With a broken heart Stallone sold his beloved dog.
 geliebt
nowhere
 Stallone had no money left and nowhere to sleep.
 nirgends
script
 Stallone was trying to sell his script.
 Drehbuch
to struggle
 As an actor he struggled a lot.
 kämpfen, sich abmühen
12
 to lie to sb.
 A good friend never lies to you.
 jdn. anlügen
to admit
 I told Tom to admit what happened.
 zugeben
to blackmail
 Ollie saw me and then he tried to blackmail me.
 erpressen
clumsy
 He knocked the books into the sink because he is so clumsy.
 ungeschickt
honest
 She lies a lot and is never honest.
 ehrlich
a pile of
 I put my homework on the pile of books.
 ein Stapel an
rash
 My skin’s a bit red – I think it’s a rash.
 Hautausschlag
unwell
 She looks a bit unwell.
 unwohl, krank

```

## Output contract

Write `content/corpus/units/g3-u07/gen/vocab.draft.json`:

```jsonc
{
  "schema": "vocab-draft@1",
  "slug": "g3-u07",
  "briefBank": "c74971b27547",
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
