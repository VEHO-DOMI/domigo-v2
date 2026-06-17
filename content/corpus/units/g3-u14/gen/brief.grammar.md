# Grammar generation brief — g3-u14 (MORE! 3, Unit 14)

<!-- domigo:gen grammar g3-u14 bank=bccbac027fe5 prompt=4b9164076103 -->

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

<!-- domigo:prompt gen-grammar v=1 -->
# Grammar item generation

Produce grammar items for the unit's structures (listed in the brief with their SB
grammar-box evidence and v1 seed items). Obligations per structure:

- **Volume:** at least the v1 floor stated in the brief; aim for the floor + ~20%.
- **Formats:** ≥3 distinct formats per structure; prefer ≥5 when the structure supports
  them. Match format to what the structure naturally exercises (the v1 format mix is a
  hint, not a law).
- **Difficulty spread:** items at difficulty 1, 2 AND 3 (recognition → guided → free).
- **Unit theme:** carriers should live in the unit's world (the transcript's topics,
  characters, situations) — items feel like the textbook, not like a worksheet from
  nowhere.

Per-format data contract (fields not listed stay empty/null):

- `gap-fill` (gf): prompt with 1–2 `___` blanks; answers = full fills (+ partial).
- `multiple-choice` (mc): prompt usually with one `___`; answers = the correct
  option(s); `distractors` = exactly 3 wrong in-bank options; `gameMeta` REQUIRED
  (pool ≥4).
- `context-picker` (cp): prompt = a short context; answers = the one correct SENTENCE;
  `distractors` = 3 wrong sentences (each flawed in exactly the structure under test);
  `gameMeta` REQUIRED.
- `translation` (tr): `direction` REQUIRED. deToEn: prompt German (du-form), answers
  English. enToDe: prompt English, answers German. Tiered both ways.
- `error-correction` (ec): prompt = one sentence containing exactly ONE error in the
  target structure; answers = the corrected sentence (full; also accept the corrected
  fragment alone as partial).
- `transformation` (tf): prompt = source sentence + trigger in parentheses; answers =
  transformed sentence.
- `question-formation` (qf): prompt = chips/statement; answers = the question.
- `free-form` (ff): prompt = a situation; answers = model answers (full) + looser
  acceptable ones (partial). Use sparingly — hardest to grade.
- `sentence-building` (sb): prompt = shuffled chips joined with " / "; answers = the
  sentence(s). Chip count (answer tokens + distractor chips) ≤ 12; `gameMeta` REQUIRED
  with `chipBudget`.
- `matching` (mt): 3–6 pairs (sentence halves, question↔answer) — English↔English;
  prompt = a one-line framing (no instructions).
- `anagram` (ag): answers = exactly one single word; prompt = a du-form German cue or
  English context line.
- `group-sort` (gs): ≥2 groups with ≥2 members each, label = category, members =
  English words/sentences; prompt = one-line framing.
- `matching-pairs` (mp): 4–8 pairs, English↔English.

Every item: `structureId` from the brief, honest `difficulty`, `hintDe` (du-form nudge,
light German grammar terms allowed), `explainDe` (1–2 sentence du-form explanation of
WHY, shown after a wrong answer), `seedV1` = the v1 item id you mined (or null),
`sbRef` = transcript evidence if the carrier comes from the book.

## Structures of this unit

### `g3u14.s.going-to-evidence` — going to for evidence-based predictions (going to für Vorhersagen aufgrund von Beweisen)

Widening the going to future to predictions based on evidence you can see right now (something is clearly about to happen), alongside its known use for plans, and contrasting it with will for opinions and spontaneous decisions. This unit has no SB grammar box; the structure comes from the v1 seed.

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [going-to-evidence]: Use going to for a prediction based on evidence you can see or know about right now - something that is clearly about to happen.
  - DE: Du verwendest going to für eine Vorhersage, die auf Beweisen beruht, die du gerade sehen oder wissen kannst - etwas, das offensichtlich gleich passieren wird.
  - "Look at those clouds - it's going to rain." — "Schau dir die Wolken an - es wird regnen."
  - "The car is out of control - it's going to crash!" — "Das Auto ist außer Kontrolle - es wird gleich verunglücken!"
- rule [going-to-vs-will]: Use going to for evidence-based predictions and for plans. Use will for opinions, general predictions without evidence, and spontaneous decisions.
  - DE: Du verwendest going to für Vorhersagen mit Beweisen und für Pläne. Du verwendest will für Meinungen, allgemeine Vorhersagen ohne Beweis und spontane Entscheidungen.
  - "It's going to rain. (I can see dark clouds)" — "Es wird regnen. (Ich sehe dunkle Wolken)"
  - "I think it will rain tomorrow. (my opinion, no evidence)" — "Ich glaube, es wird morgen regnen. (meine Meinung, kein Beweis)"
- rule [going-to-plans]: Remember that going to is also used for planned future actions - intentions you had before the moment of speaking.
  - DE: Denk daran, dass going to auch für geplante zukünftige Handlungen verwendet wird - Absichten, die du schon vor dem Sprechen hattest.
  - "I'm going to visit London next summer." — "Ich werde nächsten Sommer London besuchen."
  - "Are you going to book a hotel?" — "Wirst du ein Hotel buchen?"

common errors:
- Using will for an evidence-based prediction instead of going to: ✗ "Look at those clouds - it will rain!" → ✓ "Look at those clouds - it's going to rain!"
- Omitting the be verb from the going to construction: ✗ "I going to go to the cinema." → ✓ "I'm going to go to the cinema."
- Writing gonna in formal contexts: ✗ "I'm gonna visit London next summer." → ✓ "I'm going to visit London next summer."

v1 seed items (UNTRUSTED):
- `m3-u14-going-to-evidence-tf-003` [gap-fill, d5]: p="You're in the school corridor and you see a classmate carrying a huge pile of books. The books are wobbling. You warn her: 'Careful! You ________ (drop) those books!'" c="are going to drop" a=["are going to drop","'re going to drop"] ds=["is going to drop","will drop","were going to drop"]
- `m3-u14-going-to-evidence-cp-001` [context-picker, d2]: p="You see dark clouds in the sky. Which sentence fits?" c="It's going to rain." a=["It's going to rain."] ds=["It rains every day in November.","It will rain tomorrow.","It rained this morning."]
- `m3-u14-going-to-evidence-gf-020` [gap-fill, d1]: p="Look at those dark clouds! It ___ (rain)." c="is going to rain" a=["is going to rain","'s going to rain"] ds=["will rain","rains","is raining"]
- `m3-u14-going-to-evidence-gf-021` [gap-fill, d1]: p="Watch out! That vase ___ (fall)!" c="is going to fall" a=["is going to fall","'s going to fall"] ds=["will fall","falls","is falling"]
- `m3-u14-going-to-evidence-gf-022` [gap-fill, d2]: p="She looks really tired. She ___ (fall) asleep in class." c="is going to fall" a=["is going to fall","'s going to fall"] ds=["will fall","falls","fell"]
- `m3-u14-going-to-evidence-gf-023` [gap-fill, d3]: p="The team has scored three goals already. They ___ (win) the match!" c="are going to win" a=["are going to win","'re going to win"] ds=["will win","win","are winning"]
- `m3-u14-going-to-evidence-gf-024` [gap-fill, d4]: p="Oh no! The little boy is running towards the road. He ___ (get) hit by a car if nobody stops him!" c="is going to get" a=["is going to get","'s going to get"] ds=["will get","gets","got"]
- `m3-u14-going-to-evidence-gf-025` [gap-fill, d5]: p="Look at the traffic! We ___ (not / be) there on time. We ___ (be) late again." c="aren't going to be ... are going to be" a=["aren't going to be ... are going to be","are not going to be ... are going to be","'re not going to be ... 're going to be"] ds=["won't be ... will be","aren't going to be ... will be","isn't going to be ... is going to be"]
- `m3-u14-going-to-evidence-mc-020` [multiple-choice, d2]: p="The sky is getting very dark. Which prediction is best?" c="It's going to storm." a=["It's going to storm."] ds=["It storms.","It stormed.","It will storm."]
- `m3-u14-going-to-evidence-mc-021` [multiple-choice, d3]: p="When do we use 'going to' instead of 'will' for predictions?" c="When there is visible evidence for what will happen." a=["When there is visible evidence for what will happen."] ds=["When we make a spontaneous decision.","When we are not sure about the future.","When we talk about scheduled events."]
- `m3-u14-going-to-evidence-mc-022` [multiple-choice, d4]: p="Which sentence uses 'going to' correctly for an evidence-based prediction?" c="Look! The cat is climbing the curtains. It's going to rip them!" a=["Look! The cat is climbing the curtains. It's going to rip them!"] ds=["I'm going to be a doctor when I grow up.","We're going to visit Grandma next weekend.","She's going to have a birthday party on Saturday."]
- `m3-u14-going-to-evidence-ec-020` [error-correction, d2]: p="Find and fix the mistake: Look at those clouds! It going to rain." c="It's going to rain" a=["It's going to rain","It is going to rain","Look at those clouds! It's going to rain.","Look at those clouds! It is going to rain."] ds=[]
- `m3-u14-going-to-evidence-ec-021` [error-correction, d3]: p="Find and fix the mistake: The baby is crying. She is going to wants her mum." c="is going to want" a=["is going to want","She is going to want her mum.","The baby is crying. She is going to want her mum."] ds=[]
- `m3-u14-going-to-evidence-ec-022` [error-correction, d4]: p="Find and fix the mistake: Look at the score! Our team are going to loses the game." c="is going to lose" a=["is going to lose","Our team is going to lose the game.","Look at the score! Our team is going to lose the game."] ds=[]
- `m3-u14-going-to-evidence-tf-020` [gap-fill, d3]: p="You see your friend carrying too many books. Make a prediction: 'She ___ (drop) them!'" c="is going to drop" a=["is going to drop","'s going to drop"] ds=["are going to drop","will drop","was going to drop"]
- `m3-u14-going-to-evidence-tf-021` [gap-fill, d4]: p="You're at a restaurant. Your little brother is leaning back on his chair. Warn your parents: 'Watch out! He ___ (fall) off his chair!'" c="is going to fall" a=["is going to fall","'s going to fall"] ds=["are going to fall","will fall","was going to fall"]
- `m3-u14-going-to-evidence-tr-020` [translation, d3]: p="Translate into English: 'Schau dir die Wolken an! Es wird regnen.' (You can see the evidence.)" c="Look at the clouds! It's going to rain." a=["Look at the clouds! It's going to rain.","Look at the clouds! It is going to rain.","Look at those clouds! It's going to rain."] ds=[]
- `m3-u14-going-to-evidence-tr-021` [translation, d4]: p="Translate into English: 'Pass auf! Die Tasse wird vom Tisch fallen!' (You can see it happening.)" c="Watch out! The cup is going to fall off the table!" a=["Watch out! The cup is going to fall off the table!","Careful! The cup is going to fall off the table!","Look out! The cup is going to fall off the table!"] ds=[]
- `m3-u14-going-to-evidence-sb-020` [sentence-building, d2]: p="Put the words in order: is / to / it / rain / going" c="It is going to rain." a=["It is going to rain.","It is going to rain"] ds=[]
- `m3-u14-going-to-evidence-sb-021` [sentence-building, d3]: p="Put the words in order: going / they / to / aren't / win / the / game" c="They aren't going to win the game." a=["They aren't going to win the game.","They aren't going to win the game","They're not going to win the game."] ds=[]
- `m3-u14-going-to-evidence-mt-020` [matching, d3]: p="Match each situation (evidence) with the correct prediction. 1: The sky is full of dark clouds. 2: The dog is running towards the cat. 3: She hasn't studied at all. 4: He's eaten three burgers already. 5: The baby's eyes are closing." c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}"] ds=["a: It's going to chase it!","b: She's going to fall asleep.","c: She's going to fail the test.","d: It's going to rain.","e: He's going to feel sick."]
- `m3-u14-going-to-evidence-qf-020` [question-formation, d3]: p="Your friend is carrying a huge pile of plates. Ask a worried question: ___ ?" c="Are you going to drop those?" a=["Are you going to drop those?","Are you going to drop them?","Is he going to drop those?","Is she going to drop those?"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Denver, Derek, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Mma, Moher, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Recherche, Red, Redwood, Reihenfolge, Renato, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Smith, Sophia, Sophie, Sound, South, Southeast, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 14.txt -----
UNIT 14 Into the wild
Pages 116–117
At the end of unit 14 ...
 you know
 ✔ 10 verb phrases to talk about holiday plans
 ✔ how to use be going to (revision)
you can
 ✔ understand a documentary
 ✔ understand emails and messages about a holiday in Africa
 ✔ talk about holidays and holiday plans
 ✔ write a summary
 ✔ write a story about a holiday adventure
1
 a Watch the video. What are Mia and Jack going to do this summer?
(Image: A wide-angle scenic view of a mountain lake with hiking trails, cabins, and trees.)
b Watch again. Make a note of five facts that you think are interesting. Compare with a partner.
2 Work in pairs. Would you like to go on holiday to the places mentioned in the video? Why (not)?
VOCABULARY
 Holiday plans
3 a Complete the phrases with the words from the box.
book find look at make plan check buy hire
1 ________ a holiday
 2 ________ a trip
 3 ________ a hotel reservation
 4 ________ a car
 5 ________ a dictionary
 6 ________ a map of the area
 7 ________ the area out online
 8 ________ out what to do there
 9 ________ out about good restaurants
 10 ________ information about the best beaches
b Your partner closes the book. Ask questions to check how much he/she can remember.
A What’s number 1?
 B Book a holiday.
READING & LISTENING
4 Oliver is going to Botswana with his parents. Read the emails he writes to his friend Sam.
(Image of a boy with curly hair on a video call or writing, seated at a desk.)
 FROM: oliver_07@hello.uk
 SUBJECT: My holiday
Hi Sam,
 Great news. Guess what! I’m going to spend my holidays in Botswana with my parents.
 “Where’s that?” you’ll ask. I’ll tell you in a minute because I’ve checked it out.
The story is this: Mum and Dad are going to help people in Botswana. They show them how they can use the little water they have in a better way. I’m not sure exactly what they’re going to do, but if you’re interested, I’ll find out for you. Yesterday they told me that I can come along. Brilliant! We’re going to fly out next week. Can you imagine it? Cool!
 See you,
 Oliver
(Handwritten bubble on email: Facts for dimwits like my friend Sam. – Just kidding!)
(Image collage:
 – One image of a few children playing at a water pump with buckets and a tree nearby.
 – Another image of a girl walking on dry ground carrying a bucket on her head.
 – A third image shows a map of Southern Africa with Botswana in the center. The capital, Gaborone, is marked clearly. Arrows and a red circle highlight Botswana and its neighboring countries: Namibia, Angola, Zambia, Zimbabwe, and South Africa.)
BOTSWANA
It’s not in South America, it’s in Africa. Just north of South Africa. It’s almost two and a half times bigger than Great Britain. Any idea how many people live there? You’ll never guess. 2.6 million! Imagine. Two and a half times the size of Britain, but only 2.6 million people.
 There are 68 million of us in the UK, in case you’ve forgotten. Most of Botswana is desert, so water must be a very serious thing. The official language is – you won’t be able to guess again – English. Most people speak English and Setswana. So that’s enough of the little head. Look at the map. Check out where Gaborone, the capital, is. That’s where we’re going to fly first.
(Handwritten caption next to plane image at bottom right: We’re flying to BOTSWANA – imagine that!)
5 Read the texts in 4 again and answer the questions.
1 Who does Oliver write his emails to? ................................................
 2 Where is Oliver going with his parents? ................................................
 3 What are his parents going to do there? ................................................
 4 How does Botswana compare to Britain (size and number of people)? ................................................
 5 Why is water so important for people in Botswana? ................................................
 6 Where does Oliver’s journey start? ................................................
Pages 118–119
6 Find out what Oliver wrote from Gaborone and what he was doing there.
Email 1
 Hi Sam,
 Sunday. Boring, boring, boring. There isn’t much to see here in Gaborone. Mum and Dad have to talk to lots of people. I’ve been to the museum. I’ve found out that there are lots of diamond mines in Botswana. I’m going to dig for diamonds tomorrow 😅. We’re going to fly to Maun on Tuesday.
 Check it out on the map I sent you.
 CU
 Oliver
(Text next to the email: My email to Sam on Tuesday)
 (Image: Airplane flying in the sky with caption “What a view!”)
 (Image: Zebra with speech bubble “Hello, Oliver! Is that a new camera?”)
Email 2
 Hi Sam,
 Tuesday. We’re in Maun now. Mum’s going to do some work with people in the desert for a few days and Dad’s going to take me to the Okavango Delta for 6 days. The Okavango is a large wetland. There are lots of wild animals there. I hope we’ll see lions, leopards, buffalo, rhinos, elephants, giraffes, zebras, and crocodiles. I’m glad I brought my new camera with me.
 We’re going to fly into the delta tomorrow in a small plane.
 Cheers,
 Oliver
Email 3
 Hi Sam,
 Still Tuesday. You know what happened at lunchtime? Mum and Dad went to the restaurant, but I didn’t go because I wasn’t hungry. The window of my room in the hotel was open and I saw a man on the balcony next to our room. He had a black beard and was wearing sunglasses. He was making a phone call. I didn’t hear everything, but one thing was clear: the man wanted to kill a leopard. 🐆 He said:
 “OK. Let’s meet in two days’ time at Chitabe.” That’s a camp and it’s where we’re going. I told Mum and Dad when they came back from the restaurant. “Are you going to call the police?” I asked them. Dad laughed. “No way!” he said. Killing leopards isn’t allowed. It’s a crime. They don’t believe me! Parents!
 CU
 Oliver
P.S.: A surprise for you. In the afternoon, I went for a walk. And then guess what I saw? A little shop – and in the window they had leopard skins! So I went in and I talked to the man in the shop. I asked if I could record our conversation. I’m attaching the MP3-file! Cool, eh?
(Text next to email: I was really shocked when I went into this shop!)
7 Read the emails in 6 again. Then complete the sentences.
1 Oliver didn’t like it in Gaborone because …
 2 The Okavango Delta is …
 3 There you can see …
 4 At lunchtime, Oliver heard a man who wanted to …
8 Listen to the conversation between Oliver and the man in the shop.
 Circle T (True) or F (False).
1 Oliver thinks there are leopard skins in the shop window. T / F
 2 They are just imitations. T / F
 3 The shop sells lots of animal products. T / F
 4 The shop doesn’t sell anything made of wood. T / F
 5 Leopards are in danger. T / F
 6 Tourists never buy wildlife souvenirs in Africa. T / F
 7 Tourists bring 5,000 illegal wildlife souvenirs back to Britain every year. T / F
 8 It is illegal to bring things made of ivory into Britain. T / F
9 Read Oliver’s messages from the camp.
 Going into the Okavango Delta
 (Image: A small airplane labelled “our plane”)
 (Image: A thatched-roof hut labelled “our lodge”)
Message:
 Hi Sam!
 Wednesday. The alarm clock rang at 5.30 this morning! Dad was ready ten minutes later. “Get up, Oliver!” he said with a smile. 😄 He was wearing beige trousers and a yellow T-shirt with a hippo on it. Why do dads always look so uncool? “Today we’re going to see the Big Five: a lion, a rhino, an elephant, a buffalo and a leopard!” he said. He looked like a five-year-old in front of the Christmas tree!
The plane was already waiting for us when we got to the airport. The pilot was called Simon – he was really nice. The flight was only half an hour and when I looked down, I saw hundreds of rivers. Then Simon said to me, “In five years’ time, you can come back and learn to fly this plane!” “I’m going to be a jet pilot one day,” I thought. But I didn’t say anything – I didn’t want to be impolite.
Pages 120–121
In the afternoon, we had our first trip in a Land Rover.
 When we drove out of the lodge, we saw a young elephant. It was blocking our road and we had to drive around it. The driver was our guide too – his name was Alex. He explained that elephants sometimes run after humans and that you have to run zigzag if this happens.
 I’m glad we weren’t allowed to get out of the car. I’m really not into running zigzag! (Oh, by the way – I was really glad that the driver didn’t say, “In five years’ time, you can come back and learn to drive this Land Rover!”)
(Image: Two men in a safari Land Rover, one driving, the other looking ahead)
When the elephant slowly walked away, I saw some giraffes and zebras on the other side of the river. They were so cute, especially the young ones! I took lots of photos and then I suddenly saw my first leopard! What a great cat!
(Image of elephant, labelled: “Really cute!”)
 (Image of giraffes and zebras)
 (Image of a leopard lying down, labelled: “What a great cat!”)
LEOPARD FACTS – collected by Oliver, the leopard expert – with a lot of help from my friend Alex (our guide) 😊
Leopards can hear five times better than humans. They can hear sounds that we can’t hear at all!
Leopards like to climb trees and sleep on the branches.
Leopards like water and they’re strong swimmers.
They can run very fast (58 kilometres an hour), jump 6 metres forward and 3 metres straight up.
Leopards are extremely strong. A leopard can climb as high as 15 metres up a tree holding a dead animal in its mouth, even one that’s bigger and heavier than itself! They hide their food up in the trees so that lions or hyenas can’t get it. Then they can return later and eat more.
(Image of leopard standing on rock)
Message to Sam
 Sam,
 When we were driving back, I told Alex about the man in the hotel who wanted to kill a leopard. Alex was very worried when he heard it. I told him the man wanted to go to Chitabe.
 “Keep your eyes open!” he said. “If you see him, tell me at once!”
 Good night!
 Oliver
10 Answer the questions.
1 What was Oliver’s dad wearing in the morning?
 2 What are the ‘Big Five’?
 3 How long did the flight to the camp take?
 4 What did they see when they were driving out of the lodge?
 5 Leopards are very strong. What can they do?
 6 Who did Oliver tell about the man who wanted to kill the leopard?
11 Read the ending of Oliver’s story.
 The day I saved a leopard’s life!
Email to Sam
 Dear Sam,
 4 days after my last message.
Today was the most exciting day of my life. We had a great trip in the morning. We saw buffalo, a lion, lots of elephants and the ears of two hippos. They were in the river and didn’t want to come out! You know what Alex said? During the day, hippos stay under water because they’re afraid of getting a sunburn!
Later in the afternoon, we went out again. We were driving down the river when Alex suddenly stopped. “There’s a black car in the bushes over there!” he said. “I’ve never seen it before. It’s not from our camp. Have you seen this car before?” he asked the other guide who was with us. He looked worried. “No, I haven’t,” the other guide said. “Let’s check it out!”
Alex drove slowly towards the black car. Suddenly, the black car drove off very fast. Alex shook his head. “That’s dangerous!” he said. We followed the car and when we came round a bend, he shouted, “There it is! And it’s going to crash!” The driver had lost control and the car went off the road and down a slope. It turned over and landed on its roof!
(Image of buffalo and lion, with speech bubbles:
 “That’s really true – no kidding!”
 “The lions are easy to find, but this is all we saw of the hippo!”)
(Image of elephants drinking water, caption: “Elephants are really quiet!”)
Pages 122–123
Alex drove a bit closer. There were two men in the car. Alex and the other guide got out and helped them. One of the men had a broken arm, the other had a cut on his head. When I looked at the man with the broken arm, I couldn’t believe my eyes! It was the man from the hotel who wanted to kill a leopard.
“Alex!” I whispered. “That’s the man I told you about!” Alex told us to go back to the car and wait there. Then he and the other guide went into the car. They found two big guns in it. Then Alex took out his walkie-talkie and called the park rangers. Half an hour later, they arrived on the scene and arrested the two men. When we were driving home, Alex said, “The men wanted to kill a leopard. The animal is protected.” And then my father and Alex said, “Your son saved a leopard’s life! With his help we arrested two criminals!” Dad looked really proud.
(Text box)
That same evening, Alex took me for a ride alone with my father. “Oliver was a great help today,” he told my father. “I’d like to take him out to see something.” Five minutes later, I was sitting in the front seat of the big Land Rover, next to Alex. He drove for some time and then he stopped and switched the engine off. We waited for quite a long time. Neither of us said a word. And then suddenly we saw a beautiful leopard coming out of some bushes. “Look!” Alex whispered. “See that leopard? You saved its life!” I didn’t say anything. I took out my digital camera and then I took the most beautiful photo of my whole life.
 Oliver
(Image of a leopard in the bush, captioned “And here it is!” and “A great way to finish a perfect day!”)
12 SPEAKING Talking about holiday plans
A Complete the dialogue with the correct words. Act it out.
camping made booked surfing holiday
A Where are you going on 1 ......................... this year?
 B We’re going to Australia on a camping holiday. I’m going to learn 2 ........................ and windsurfing.
 A Cool! Have you 3 ........................ the flight yet?
 B Yes, we have.
 A Have you 4 ........................ a hotel reservation?
 B No, we haven’t. It’s a 5 ........................ holiday!
(Image of two teens at the airport talking)
13 WRITING CHOICES
A Write a short summary (60–80 words) of Oliver’s adventure with the leopard hunter.
 Make sure you write about:
what he heard in the hotel
what happened when they slowly drove towards the black car
what happened after the car crash
B Write a story about an adventure in a wildlife camp (120–180 words). Give it a good title.
 You can use these ideas.
In the afternoon, a group of tourists left the camp in a Land Rover.
 They stopped when they saw ...
 One tourist got out of the car and ...
14 GRAMMAR be going to (revision)
Match the examples and the rules. Write 1, 2 or 3.
1 You use be going to when you want to talk about planned future actions.
 2 You use be going to when you ask questions about planned future actions.
 3 You use be going to when you want to express that something is very likely to happen in the future.
☐ The car’s out of control – it’s going to crash.
 Look at all those clouds – it’s going to rain.
☐ I’m going to dig for diamonds tomorrow.
 Dad’s going to take me to the Okavango Delta for 6 days.
 I’m not going to buy anything that puts animals in danger.
☐ Are you going to call the police?
 Is he going to shoot the leopard?
(Image of hippo under a tree saying “I’m going to stay here all day!”; another hippo under the sun saying “He’s going to get a sunburn!”)


----- WB: More 3 WB Unit 14.txt -----
Unit 14 Into the wild
Pages 118–119
UNDERSTANDING VOCABULARY Holiday plans
 1 Match the sentence halves.
 a Can I make
 b Sorry, you can’t book a direct
 c I’m not sure what time it finishes. We’ll find
 d There’s no station. We’ll need to hire
 e Look, here’s the map. Let’s plan our
 f Let’s check
□ out when we get there.
     □ a car to get there.
     □ route to Vienna.
     □ a reservation for two nights, please?
     □ out some places to eat online.
     □ flight to Cape Town.
USING VOCABULARY Holiday plans
 2 Choose the correct answers.
1 a planned  b found  c looked
 2 a checked  b hired  c made
 3 a done    b made    c had
 4 a found    b booked   c asked
 5 a look    b surf    c check
 6 a buy     b watch   c look
 7 a buy     b hire     c make
A Have you 1 …………… your trip yet?
 B Most of it. My dad’s 2 …………… a car to drive us to the airport and we’ve 3 …………… the hotel reservation.
 A What are you going to do there?
 B I’m not sure. We haven’t 4 …………… out about all the things there are to do.
 A Why don’t you 5 …………… out the area on the internet?
 B That’s not a bad idea. Maybe I can 6 …………… at a map of the area online.
 A What about the language? Are you taking lessons?
 B No. I think I’ll 7 …………… a dictionary to use there.
 A Well good luck, and don’t forget to send me a postcard.
 B I won’t!
3 Tick the verbs and phrases that go together.
	a holiday	a trip	a reservation	a hotel	a car	a dictionary	a map of the area	out the area online	out about restaurants	information on the beaches
find	☐	☐	☑	☐	☐	☐	☐	☑	☑	☑
book	☑	☐	☑	☑	☐	☐	☐	☐	☐	☐
make	☑	☑	☑	☐	☐	☐	☐	☐	☐	☐
plan	☑	☑	☐	☐	☐	☐	☑	☐	☐	☐
buy	☐	☐	☐	☐	☐	☑	☐	☐	☐	☐
hire	☐	☐	☐	☐	☑	☐	☐	☐	☐	☐
check	☐	☐	☐	☐	☐	☐	☑	☑	☑	☑
look at	☐	☐	☐	☐	☐	☐	☑	☐	☐	☐

UNDERSTANDING GRAMMAR be going to
 4 Write what they are going to do in 10 years.
Image description: Eight cartoon characters are labeled with names and plans for the future. From left to right:
Jonathan – work in a restaurant
George – write successful books
Maria – be a French teacher
Miriam – open a shop
Sid – marry Maria
Mike – run in the London Marathon
Hannah – win a lot of money
Anna – design furniture
1 Jonathan is going to work in a restaurant.
 2
 3
 4
 5
 6
 7
 8
USING GRAMMAR be going to
 5 Complete the questions.
1 A What ..................................................... do at the weekend?
   B I’m going to do nothing!
 2 A What ..................................................... do in the holidays?
   B I’m going to stay home for three weeks.
 3 A Who ..................................................... organise the party?
   B My friends are going to help me.
 4 A Why ..................................................... play football today?
   B Because my leg hurts.
 5 A What ..................................................... do when you leave school?
   B I’m going to work in a bank.
6 Complete with the correct form of be going to and the verbs in brackets.
Email box:
 FROM: val14@mailconnect.com
 SUBJECT: Our holiday this year
Hi Marleen,
 We’ve planned our holiday – I think. We 1 …………………………… (drive) around Scotland, since you’ve never been there. We 2 …………………………… (see) as many places as possible. We 3 …………………………… (not go) camping this year. We 4 …………………………… (stay) in small hotels. Dad 5 …………………………… (rent) a car, unless he forgets. Don’t worry – I 6 …………………………… (remind) him right away.
Best,
 Valerie
Pages 120–121
7 Read the poem and complete with the be going to forms.
What am I going to do?
I 1 ……………………………………… (get) on a plane
 And fly away.
 I 2 ……………………………………… (choose) a country
 Where I want to stay.
 I 3 ……………………………………… (find) a job there
 And buy a welcome mat.
 I 4 ……………………………………… (earn) a lot of money
 And buy a flat.
 I 5 ……………………………………… (put) the mat
 In front of the door.
 I 6 ……………………………………… (wait) and wait
 And sit on the floor.
 One day, I 7 ……………………………………… (hear) a knock
 And there’s a lovely girl outside.
 We 8 ……………………………………… (fall) in love and then
 A year after that, she’ll be my bride.
 And NOW I 9 ……………………………………… (wake)
 From my dreams.
 I 10 ……………………………………… (make) some tea …
 Yeah, and a good idea it seems.
8 Complete the email with the correct form of be going to and the verbs in the box.
fly meet take stay be use go
Image description: Boy wearing headphones smiling in front of a laptop, appearing to be on a video call.
Email box:
 FROM: alex.s@mailconnect.com
 SUBJECT: Holiday plans!
Hi Tim,
 Guess what! We 1 ……………………………………… to Botswana in July because that is when you can see a lot of animals. First, we 2 ……………………………………… to Gaborone. Dad 3 ……………………………………… some people there and then we 4 ……………………………………… in the Okavango Delta for a few days.
 Of course, I 5 ……………………………………… a lot of pictures, and I 6 ……………………………………… them for a slide show at school. I’m sure it 7 ……………………………………… awfully interesting.
 See you,
 Alex
9 Read the text about a tour to the Okavango Delta in Botswana.
Classic Botswana
What is the Okavango Delta?
 It is one of the world’s most famous wilderness areas. The delta is formed by thousands of channels* of the Okavango River with clear water. There are a lot of small islands and larger dry open areas with bush and a lot of trees. The Okavango is home to more than 400 different kinds of birds and large herds* of buffalo, antelopes and elephants. You will also find crocodiles, hippos, cheetahs, leopards, lions and different kinds of monkeys. In July and August, during Botswana’s dry winter months, the delta swells to three times its size. That makes the area one with Africa’s greatest concentration of wildlife.
What are the camps like?
 There are camps with stone bungalows or very nice tents, each with a private shower and toilet. In each camp there is also a large dining room where meals are taken by the guests, and a shop where you can buy souvenirs. Of course, there are also luxury camps with private balconies and very large rooms. Many camps offer great views of the country, and you can enjoy waking to the sounds of wildlife. Normally, people go to at least one water camp and one bush camp.
What can you do at the camp?
 You get up at six o’clock and have a wonderful breakfast. Then at half past six, the first drive of the day starts, and it ends at ten or eleven. When you stay in a camp in one of the larger dry areas you will go for a drive in a Land Rover.
 When you stay in a water camp you usually go on a ‘mokoro’. There are two seats for two people and the mokoro is pushed along the river by the guide as you sit and watch the animals.
Back at the camp, the second drive of the day starts at around three o’clock and finishes when the sun goes down at about nine, dinner is at half past eight. After that, you may have a ‘bushman story hour’.
When you go back home, you will go with your journal to explain what it means to be wild and like elephants, giraffes and birds.
VOCABULARY:
 *channel – Kanal
 *herd – Herde
 spotlight – Suchscheinwerfer
Image descriptions (right page):
Aerial photo of the Okavango Delta, showing water channels, green islands, and trees
An elephant standing on a grassy plain
A person riding in a mokoro (traditional canoe) being pushed through a narrow river channel by a local guide
Pages 122–123
10 How many of these tasks can you do?
Complete the sentences with no more than 4 words.
1 Thousands of channels from the Okavango River ................................................................. .
 2 More than 400 birds .................................................................................................................. .
 3 The delta is three times bigger in ............................................................................................ .
4 Bungalows and tents
 ☐ all have private showers and toilets.
 ☐ all have a kitchen.
 ☐ are often very uncomfortable.
5 In each camp,
 ☐ you can cook your meal yourself.
 ☐ there is a large dining room where you can take your meals.
 ☐ there is a dining room for dinner only.
6 Most people
 ☐ wake up early in the camps.
 ☐ stay in two different types of camp.
 ☐ stay in luxury camps.
7 What do guests do in the morning?
 .....................................................................................................................................................
8 What do guests do in the afternoon?
 .....................................................................................................................................................
9 What do guests do in the early evening?
 .....................................................................................................................................................
11 Listen and check your answers.
12 Listen to Larissa talking about Mma Ramotswe.
 Then answer the questions.
1 What are the two favourite hobbies of Larissa’s family?
 .....................................................................................................................................................
2 Who is Mma Ramotswe?
 .....................................................................................................................................................
3 How many books has Alexander McCall Smith written so far about Mma Ramotswe?
 .....................................................................................................................................................
4 What kind of character is she?
 .....................................................................................................................................................
5 What does Mma Ramotswe teach us about Africa?
 .....................................................................................................................................................
6 Why does Larissa think that McCall Smith is good at writing about Africa?
 .....................................................................................................................................................
Image description: Older man with white hair wearing a blue and red striped jacket, holding a book titled "The No.1 Ladies' Detective Agency."
13 A Complete the dialogue with the sentences from the box. Then listen and check.
a Then we’re renting a car and touring the country.
 b No, I don’t think so. Just a few famous places, like the Cliffs of Moher or Galway.
 c We’re going to Ireland.
 d I’m sure you will.
 e First, we’re going to stay in Dublin for three days.
 f My sister and my parents. And me, of course.
Sharon: Linus, where are you going for your next holiday?
 Linus: 1 ...............................................................................
 Sharon: Who’s we?
 Linus: 2 ...............................................................................
 Sharon: And what are your plans?
 Linus: 3 ...............................................................................
 Sharon: ... and then?
 Linus: 4 ...............................................................................
 Sharon: All of Ireland?
 Linus: 5 ...............................................................................
 Sharon: Sounds great. I’ve never seen the Cliffs of Moher, but one day, I want to go there.
 Linus: 6 ...............................................................................
Image description: Photo of cliffs next to the ocean, identified as the Cliffs of Moher.
B Put the dialogue in the correct order. Then listen and check.
□ Zen How was your holiday in Cape Town?
 □ Zen MOCAA? What’s that?
 □ Zen I see. And did you also go up Table Mountain?
 □ Zen Really? How long did that take? Walking down, I mean.
 □ Zen What did you do there?
 □ Lily Something like four hours.
 □ Lily We walked around and we went to some great museums like the MOCAA.
 □ Lily That’s the Museum of Contemporary Art Africa. It was very impressive.
 □ Lily Yes, we did. We took the cable car up the mountain, and then we walked down.
 □ Lily It was really great.
Image descriptions:
Bottom left: Table Mountain with the cable car station visible
Middle right: Person taking photo of a museum sign that says “MOCAA”
Pages 124–125
14 Read the task and what a student wrote. Why are Alessia and George worried?
Task
 Your teacher asked you to write a summary of the story Alessia (SB p. 58; 140–170 words).
 Write about:
 ✔ who Alessia is
 ✔ what George thinks about her
 ✔ what his mum wants him to do
 ✔ how he reacts
 ✔ how George and Alessia slowly become friends
 ✔ what their problem is
Student response:
 Alessia is about a girl who comes to England from another country and who can’t speak English. The boy next door is a bit disappointed because he was hoping for a boy he could play football with.
Soon after Alessia and her parents move in, George’s mother asks him to take things to her like old books and games. George doesn’t like this, and suddenly thinks he needs all these things himself.
But George’s mother insists*, and George actually likes the way Alessia smiles at him when George goes there.
George goes to see Alessia more and more often, and after a while, George quite likes Alessia. Alessia’s English improves and George often talks to Alessia. George even steps in when someone is bullying Alessia at school.
Two years later, George and Alessia are good friends. Unfortunately, Alessia’s parents are talking about moving, and George and Alessia are rather unhappy about this.
VOCABULARY: *insist – auf etw. bestehen
Language tip: Using pronouns
 Pronouns are useful because they help you avoid repetition of nouns in your writing. However, it is important to use the correct ones and make sure it’s clear what they refer to. Otherwise you can easily confuse your reader.
15 Read the text in 14 again. In the first paragraph, six pronouns have been highlighted.
 a What do they refer to?
 b In the rest of the text, no pronouns have been used for George and Alessia. Be careful not to replace them all.
 How could you replace the names with pronouns?
Writing tip: Writing a summary
 ✔ Read the text carefully and underline the most important information.
 ✔ Make sure you don’t mention too many details.
 ✔ Use the present tense for your summary.
 ✔ Use time expressions (soon after, a while after, two years later …).
 ✔ Connect ideas (and, but, because, actually …).
 ✔ Avoid direct speech in your summary.
 ✔ Think carefully how to use paragraphs.
 ✔ Stick to the number of words for your summary.
16 Now write your own answer to the following task.
Task
 Your teacher asked you to write a summary of the story An Argentinian adventure (WB p. 24; 140–170 words).
 Write about:
 ✔ who Will is
 ✔ what his plans are
 ✔ how he passes his days
 ✔ what the most difficult thing for him is
 ✔ what happens with Will and the farmer in the field
 ✔ what happens after the shooting
[Empty lined box for student to write the summary]
Page 126
UNIT 14
WORD FILE
 Holiday plans
Phrases shown in yellow bubbles around an illustration of a girl and a boy looking at a laptop:
 to plan a trip
 to book a holiday
 to make a hotel reservation
 to hire a car
 to check the area out online
 to buy a dictionary
 to find out about good restaurants
 to find information about the best beaches
 to look at a map of the area
 to find out what to do there
MORE Words and Phrases
#	Words	Example Sentence	German
TT7	bug	We built a hotel for all kinds of bugs.	Insekt
	to prefer	I like bananas, but I prefer apples.	bevorzugen
4	official language	The official language in Botswana is English.	Amtssprache
	balcony	I saw a man on the balcony next to our room.	Balkon
	crime	Killing leopards is a crime.	Verbrechen
	to dig	I’m going to dig for diamonds tomorrow.	graben
	shocked	I was really shocked when I saw the car crash.	schockiert
	wild animal	There are lots of wild animals in Botswana.	Wildtier
	wetland	The Okavango is a large wetland.	Sumpfgebiet
8	otherwise	We need to protect the leopards. Otherwise they’ll die out.	andernfalls, sonst
	stuffed	Stuffed baby crocodiles are an illegal wildlife souvenir.	ausgestopft
	wildlife	Tourists take about 50,000 illegal wildlife souvenirs back to Britain!	wilde Tierwelt
9	at once	If you see him, tell me at once!	sofort
	branch	Leopards like to climb trees and sleep on the branches.	Ast
	by the way	Oh, by the way, I was really glad to see you again.	übrigens
	impolite	I didn’t say anything because I didn’t want to be impolite.	unhöflich
11	round a bend	We followed the car and drove round a bend.	um eine Ecke, um eine Kurve
	bush	There’s a black car in the bushes over there.	Busch
	cut	The man had a cut on his head.	Schnitt(-wunde)
	to drive off	Suddenly, the black car drove off very fast.	wegfahren
	engine	He stopped the car and switched the engine off.	Motor
	front seat	I was sitting in the front seat of the big Land Rover.	Vordersitz
	park ranger	Alex took out his walkie-talkie and called the park rangers.	Parkwächter/Parkwächterin
	sunburn	Hippos stay under water because they’re afraid of getting a sunburn.	Sonnenbrand
	to turn over	The Land Rover turned over and landed on its roof.	(sich) überschlagen
	to whisper	He whispered the secret in my ear.	flüstern
	crash	There was a car crash on May Street.	Unfall, Zusammenstoß

```

## Output contract

Write `content/corpus/units/g3-u14/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u14",
  "briefBank": "bccbac027fe5",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u14.s.going-to-evidence",
      "format": "gap-fill",             // gap-fill|multiple-choice|context-picker|translation|error-correction|transformation|question-formation|free-form|sentence-building|matching|anagram|group-sort|matching-pairs
      "difficulty": 1,
      "prompt": { "text": "…", "lang": "en", "blanks": 1 },
      "answers": [{ "text": "…", "tier": "full" }],
      "direction": null,                 // REQUIRED ("deToEn"|"enToDe") iff format=translation
      "distractors": ["plain string", "another"],   // ARRAY OF PLAIN STRINGS — never {"text":…} objects; [] for non-choice formats
      "pairs": [],                       // [{ "left": "…", "right": "…" }] for matching/matching-pairs, else []
      "groups": [],                      // [{ "label": "…", "members": ["…","…"] }] for group-sort, else []
      "hintDe": "…", "hintEn": null,
      "explainDe": "…", "explainEn": null,
      "strict": false,                   // true for minimal pairs (should/shouldn't, study/studies!)
      "gloss": [],
      "gameMeta": null,                  // null, OR for mc/context-picker/sentence-building: { "distractorPool": ["…","…","…","…"], "chipBudget": null, "minOptions": 4 } — the key is "distractorPool" (NOT "pool"), ≥4 in-bank entries
      "seedV1": null, "sbRef": null, "note": null
    }
  ]
}
```

Field shapes are STRICT: `distractors` is an array of plain strings (not objects); `gameMeta` uses the key `distractorPool` (not `pool`). Do NOT include ids — the pipeline mints them. No two items may share the same carrier+answers (duplicates are rejected).
