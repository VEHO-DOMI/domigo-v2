# Grammar generation brief — g2-u14 (MORE! 2, Unit 14)

<!-- domigo:gen grammar g2-u14 bank=dd3a79bc401b prompt=4b9164076103 -->

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

### `g2u14.s.present-perfect-already-yet` — Present perfect with already / yet (Present perfect mit already / yet)

already to say something is already done (positive sentences) and (not) yet for things that haven't happened so far (negatives and questions).

v1 floor for this structure: **18 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [remember-no-time]: Remember: use the present perfect when you are not talking about a specific time in the past.
  - DE: Zur Erinnerung: Du verwendest das Present perfect dann, wenn du nicht über einen bestimmten Zeitpunkt in der Vergangenheit sprichst.
  - "I've tried lots of ball sports." — "Ich habe viele Ballsportarten ausprobiert. (Wann ist nicht wichtig.)"
  - "I've given up volleyball." — "Ich habe mit Volleyball aufgehört. (Wann ist unwichtig.)"
- rule [already-done]: Use already to say that something is already done. already goes between have/has and the past participle, in positive sentences.
  - DE: Wenn du sagen willst, dass jemand etwas schon gemacht hat, verwendest du already. Das Wort already steht zwischen have/has und dem Past participle.
  - "She has already been to three competitions." — "Sie war schon bei drei Wettkämpfen."
  - "She has already won one." — "Einen hat sie schon gewonnen."
- rule [not-yet]: Use not ... yet to say that something hasn't happened so far; yet goes at the end of the sentence. In questions, yet asks whether something has happened by now.
  - DE: Wenn etwas noch nicht geschehen ist, verwendest du not ... yet. Das Wort yet kommt ans Satzende. In Fragen fragst du mit yet, ob etwas schon passiert ist.
  - "They haven't won a competition yet." — "Sie haben noch keinen Wettkampf gewonnen."
  - "He hasn't been to Europe yet." — "Er war noch nicht in Europa."
  - "Have you eaten yet?" — "Hast du schon gegessen?"

common errors:
- Wrong position of already: ✗ "I already have done it." → ✓ "I've already done it."
- Wrong position of yet: ✗ "I haven't yet finished." → ✓ "I haven't finished yet."
- Using already in a negative sentence instead of yet: ✗ "I haven't already finished." → ✓ "I haven't finished yet."

SB box `g2/sb/More 2 SB Unit 14.txt#grammar-1` — Present perfect with already / yet:
```
Zur Erinnerung: Du verwendest das Present perfect dann, wenn du nicht über einen bestimmten Zeitpunkt in der Vergangenheit sprichst.
Examples:
I’ve tried lots of ball sports. (Ich habe viele Ballsportarten ausprobiert, es ist nicht wichtig, wann das war!)
I’ve given up volleyball. (Ich habe Volleyball aufgegeben, aber es ist unwichtig, wann das war.)
Wenn du sagen willst, dass jemand etwas schon gemacht hat bzw. etwas schon erledigt ist, kannst du das Present perfect mit dem Wort already verwenden. Das Wort already steht zwischen has/have und dem Past participle (3. Form des Verbs).
Examples:
She has already been to three competitions.
She has already won one.
Wenn du sagen willst, dass etwas noch nicht geschehen ist, verwendest du not yet mit Present perfect. Das Wort yet kommt dabei ans Satzende.
Examples:
They haven’t won a competition yet.
He hasn’t been to Europe yet.
```

v1 seed items (UNTRUSTED):
- `m2-u14-present-perfect-signals-gf-001` [gap-fill, d1]: p="I have ___ finished my homework. I can play now." c="already" a=["already"] ds=["yet","ever","never"]
- `m2-u14-present-perfect-signals-gf-002` [gap-fill, d1]: p="Have you ___ been to London?" c="ever" a=["ever"] ds=["already","yet","never"]
- `m2-u14-present-perfect-signals-gf-003` [gap-fill, d2]: p="She hasn't called me ___." c="yet" a=["yet"] ds=["already","ever","never"]
- `m2-u14-present-perfect-signals-gf-004` [gap-fill, d3]: p="I have ___ eaten sushi. I don't know what it tastes like." c="never" a=["never"] ds=["ever","yet","already"]
- `m2-u14-present-perfect-signals-gf-005` [gap-fill, d3]: p="Has Tom finished the test ___? — No, he's still writing." c="yet" a=["yet"] ds=["already","never","ever"]
- `m2-u14-present-perfect-signals-gf-006` [gap-fill, d4]: p="We have ___ visited three museums today. Let's go to another one!" c="already" a=["already"] ds=["yet","ever","still"]
- `m2-u14-present-perfect-signals-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="I have never tried skateboarding." a=["I have never tried skateboarding."] ds=["I haven't never tried skateboarding.","I have tried never skateboarding.","I never have tried skateboarding."]
- `m2-u14-present-perfect-signals-ec-001` [error-correction, d2]: p="Find and fix the mistake: I haven't never been to Paris." c="I have never been to Paris." a=["I have never been to Paris.","I have never been to Paris","have never been","I have never been"] ds=[]
- `m2-u14-present-perfect-signals-ec-002` [sentence-building, d3]: p="Put the words in the correct order: We / have / already / visited / the / museum" c="We have already visited the museum." a=["We have already visited the museum.","We have already visited the museum"] ds=[]
- `m2-u14-present-perfect-signals-ec-003` [error-correction, d2]: p="Find and fix the mistake: Have you ever been yet to New York?" c="Have you ever been to New York?" a=["Have you ever been to New York?","Have you ever been to New York","Have you been to New York yet?","Have you been to New York yet"] ds=[]
- `m2-u14-present-perfect-signals-tf-001` [transformation, d3]: p="Your teacher asks if you've done the project. You haven't! Say: 'I ___ (not do) my project ___.'" c="haven't done my project yet" a=["haven't done my project yet","have not done my project yet","I haven't done my project yet."] ds=[]
- `m2-u14-present-perfect-signals-tf-002` [transformation, d4]: p="Your friend asks if you've tried octopus. You haven't, ever. Say: 'I ___ (never / eat) octopus.'" c="have never eaten octopus" a=["have never eaten octopus","I have never eaten octopus.","I have never eaten octopus"] ds=[]
- `m2-u14-present-perfect-signals-tf-003` [transformation, d5]: p="You want to know about your pen pal's experiences. Ask: '___ you ___ (ever / ride) a horse?'" c="Have you ever ridden a horse?" a=["Have you ever ridden a horse?","Have you ever ridden a horse","Have ... ever ridden"] ds=[]
- `m2-u14-present-perfect-signals-tr-001` [translation, d3]: p="🇩🇪 Ich habe noch nie einen Delfin gesehen." c="I have never seen a dolphin." a=["I have never seen a dolphin.","I have never seen a dolphin","I've never seen a dolphin.","I've never seen a dolphin"] ds=[]
- `m2-u14-present-perfect-signals-tr-002` [translation, d4]: p="🇩🇪 Hast du schon das neue Buch gelesen?" c="Have you already read the new book?" a=["Have you already read the new book?","Have you already read the new book","Have you read the new book yet?","Have you read the new book yet"] ds=[]
- `m2-u14-present-perfect-signals-sb-001` [sentence-building, d2]: p="Put the words in the correct order: already / has / eaten / she / lunch" c="She has already eaten lunch." a=["She has already eaten lunch.","She has already eaten lunch"] ds=[]
- `m2-u14-present-perfect-signals-mt-001` [matching, d5]: p="Match each signal word with its correct use:\n1. already\n2. yet\n3. ever\n4. never\na. questions about life experience (between have and pp)\nb. positive sentences (between have and pp, = sooner than expected)\nc. negative sentences and questions (at the end)\nd. negative meaning without 'not' (between have and pp)" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}"] ds=[]
- `m2-u14-present-perfect-signals-cp-001` [context-picker, d2]: p="Your friend asks: 'Do you want to see this film?' You saw it last week. Which answer uses present perfect correctly?" c="No thanks, I have already seen it." a=["No thanks, I have already seen it."] ds=["No thanks, I already saw it.","No thanks, I have already saw it.","No thanks, I seen it already."]

### `g2u14.s.present-perfect-ever-never` — Present perfect with ever / never (Present perfect mit ever / never)

Talking and asking about life experiences: ever in present perfect questions, never in statements meaning 'at no time' (with positive sentence structure).

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [ever-questions]: Use ever in present perfect questions to ask whether someone has done or experienced something at any time in their life. Form: have/has + ever + past participle.
  - DE: Um danach zu fragen, ob jemand irgendwann in der Vergangenheit etwas getan oder erlebt hat, verwendest du ever. Bildung: have/has + ever + Past participle (3. Form des Verbs).
  - "Have you ever seen a bear?" — "Hast du jemals einen Bären gesehen?"
  - "Have you ever won a competition?" — "Hast du jemals einen Wettkampf gewonnen?"
- rule [never-no-experience]: Use never to say that something has not happened at any time. The sentence stays positive in structure - no extra not! Form: have/has + never + past participle.
  - DE: Mit never sagst du, dass jemand etwas noch nie getan oder erlebt hat. Der Satz bleibt positiv gebaut - kein zusätzliches not! Bildung: have/has + never + Past participle.
  - "I've never had an accident." — "Ich hatte noch nie einen Unfall."
  - "I've never met a famous person." — "Ich habe noch nie eine berühmte Person getroffen."

common errors:
- Double negative with never: ✗ "I haven't never been to London." → ✓ "I've never been to London."
- Using ever in positive statements instead of questions: ✗ "I have ever been to London." → ✓ "I have been to London."

SB box `g2/sb/More 2 SB Unit 14.txt#grammar-2` — Present perfect with ever / never:
```
Um über persönliche Erfahrungen zu sprechen oder danach zu fragen, ob jemand irgendwann in der Vergangenheit etwas getan oder erlebt hat, verwendest du das Present perfect mit ever und never.
Bildung: have/has + ever/never + Past participle (3. Form des Verbs)
Examples:
Have you ever seen a bear?
Have you ever won a competition?
I’ve never had an accident.
I’ve never met a famous person.
Footer: Now go back to page 108. Check ✔ with a partner what you know / can do.
WB p. 118, 119, 120, 122
CYBER Homework 42
My personal learning track
```

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Aryan, Asia, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carter, Castle, Celsius, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Column, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Every, Excuse, Expressing, Fahrenheit, False, Faye, Feeling, Fido, Food, France, Frank, Fred, Freddy, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Groats, Guess, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Hayes, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katie, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mountain, Mr, Mrs, Ms, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Ola, Oliver, Olivia, Olympic, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salma, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Stoke, Sue, Sunborn, Susan, Suzy, Swaton, Tag, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Volleyball, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 14.txt -----
Unit 14 Move and keep fit!
Page 108–109
At the end of unit 14 … you know:
16 words for sports
how to use the present perfect with already/yet/ever/never
you can:
talk and ask about sports
understand short interviews about sports
ask questions with Have you ever …?
understand information in a factual text about (crazy) sports
understand a poem
write a text about sports you’ve done or haven’t done yet
write diary entries
VOCABULARY: Sports
Activity 1:
Write the numbers of the sports in each picture.
Sport list:
play: 1 football, 2 tennis, 3 basketball, 4 volleyball
go: 5 mountain climbing, 6 cycling, 7 mountain biking, 8 roller-skating, 9 ice skating, 10 skateboarding, 11 swimming, 12 snowboarding, 13 surfing, 14 windsurfing, 15 skiing, 16 running
Image descriptions (A–P): A – Windsurfing (person on board with sail in water)
B – Ice skating (two people holding hands on ice rink)
C – Snowboarding (person descending snowy slope)
D – Mountain climbing (person scaling a rocky cliff)
E – Running (two people jogging outdoors)
F – Football (person kicking a ball)
G – Tennis (girl swinging a racket)
H – Swimming (person underwater in a pool)
I – Mountain biking (person riding downhill on a trail)
J – Skateboarding (young person mid-air on a ramp)
K – Cycling (two kids on road bikes)
L – Roller-skating (people skating in a line)
M – Surfing (person inside a wave)
N – Volleyball (people jumping at net in a gym)
O – Basketball (team celebrating with ball)
P – Skiing (skier with poles on snow)
Activity 2:
Listen and check your answers.
SPEAKING: Talking/Asking about sports
Activity 3:
Ask and answer questions about some of the sports in 1.
Speech bubbles with example questions:
Do you like … ?
What’s your favourite … team?
Do you play/go … ?
How often do you … ?
Do you like watching … on TV?
Who’s your favourite sportsman/sportswoman?
LISTENING: Understanding interviews about sports
Activity 4:
a. Listen to the interviews with two American teenagers and answer the questions.
What does Liam want to be one day?
Who are the people who help Katie most?
b. Listen to the interviews again and complete their profiles.
Profile 1: Liam Hayes (windsurfing) Image shows Liam doing a windsurfing jump over a wave.
16-year-old Liam Hayes started windsurfing when 1 _______________. He got his first “windsurfing gear” at the age of 2 _______________. During the summer and at the weekends, he goes windsurfing _______________. During the year, he can only go 4 _______________. As from next year, he’ll be a 5 _______________.
Vocabulary: gear = Ausrüstung
Profile 2: Katie Hull (mountain biking) Image shows Katie on a mountain bike on a trail at sunset.
This is 15-year-old Katie Hull. She’s from Texas in the US. Her favourite sport is mountain biking. She got her first mountain bike when she was 1 _______________ years old. She is a member of her High School mountain biking team and 2 _______________ now. When she was a young girl, she did a lot of sports, but now she doesn’t have 3 _______________ for that. Katie’s biggest fan is her 4 _______________. Her dad helps her to be 5 _______________ and 6 _______________.
Activity 5:
Look at the questions from the interviews below. Which questions are for Liam, and which for Katie or which are for both? Write L, K or B in the boxes.
Have you ever been to Europe?
Have you ever had an accident?
Have you ever had any serious accidents?
Have you ever lost your way?
Have you ever seen a bear?
Have you ever won a race?
Activity 6:
Listen and check. Then listen again. Take notes. What are their answers to the questions?
Footer: WB p. 117, 118
CYBER Homework 40 (Revision)
WB p. 123
CYBER Homework 41
UNIT 14
Pages 108–109
Page 110–111
SPEAKING: Asking questions with Have you ever … ?
Activity 7:
Work in small groups. Ask and answer questions to find someone who has …
met a famous person.
won a competition.
appeared on television.
found some money.
lived in another country.
been to a pop concert.
fallen asleep in a lesson.
written a poem.
Dialogue example: A: Have you ever met a famous person?
B: Yes, I have.
A: Who?
B: …
A: When was that?
B: …
READING: Understanding factual texts about sports
Activity 8: CHOICES A. Read through the magazine article quickly. When did this sport start?
Article 1: Egg Throwing
What’s the history?
Egg throwing goes back to the 14th century. After a heavy rainfall, there was a flood in a small village north of Cambridge named Swaton. Only one person in the village had chickens. That person lived on one side of the river, and everybody else lived on the other side. Nobody could cross the bridge because of the flood. So the chicken owner started throwing the eggs across the river. And that was the beginning of a rather unusual sport.
What’s the record?
Has there ever been an official world record in egg throwing? Yes, absolutely. The world champions now are two people from New Zealand. Their record is 93.60 m.
What does one egg thrower say?
Neil Short, 57: “I was on holiday in Swaton with a friend, when I heard about egg throwing for the first time. It looked like a fun idea and we both liked it. That was six years ago. We’ve already taken part in four competitions together. We’ve never won a competition, but that’s fine. I’ve learnt that a crazy sport can be a lot of fun!”
What is the challenge?
Egg throwing is played in teams of two. In a competition, the winning pair is the one that can throw an egg over the largest distance without breaking it. So, one person in each team has to be good at throwing, and the partner has to be good at catching the egg, of course.
Activity B: Read the text again and match the sentence halves.
Egg throwing has been a sport – □ for hundreds of years.
Only people good at throwing or catching – □ can win an egg throwing competition.
Egg throwing started – □ in a little village near Cambridge.
It started because the village people – □ broke after a big flood.
An egg throwing team has to have – □ more than one player.
A team from New Zealand managed – □ to set a new world record: almost 100 m!
Activity C: Add the missing words in italics to each sentence.
Neil and his friend taken part in four competitions together. → have
They’ve a lot of fun. → had
They won a competition yet. → haven’t
Neil learnt that an unusual sport can be a lot of fun. → ’s
READING continued
Activity 8 continued B. Read through the magazine article quickly. What gear do you need to do this sport?
Article 2: Bog Snorkelling
What is the challenge?
You want to take part in a bog snorkelling competition? Yes? Then the first thing you have to forget is your idea of snorkelling. Bog snorkelling isn’t about colourful fish in tropical waters, that’s for sure! It’s a swimming competition. You have to swim about 100 m in a muddy ditch. The water is of course extremely dirty and you can’t use your hands to swim. You can only use your feet. On your feet you’ve got flippers. And on your head, you’ve got a diving mask* and a snorkel. But you won’t see a lot, of course!
What’s the history?
The first bog snorkelling competition took place in 1985 in a town called Llanwrtyd Wells in Wales in England. Some people had this crazy idea, just for fun! And it was the start of an annual competition!
What’s the record?
Has there ever been an official world record in bog snorkelling? Yes, absolutely. At the moment, the world record is 1 minute and 18.81 seconds. You want to break it? Then start looking for some muddy water, so you can train to be a bog snorkeller.
What does one bog snorkeller say?
Sally Ellis, 28: “Bog snorkelling’s a crazy sport. But I’ve had so much fun doing it. I’ve made so many friends. I’ve already been to three competitions, and I’ve already won one. But I’m not doing it to win. I’m doing it for fun!”
Vocabulary:
bog = Moor; muddy = schlammiger Graben; diving mask = Tauchermaske; annual = jährlich
Activity B: Read the text again and complete the sentences.
Bog snorkelling is ________________.
In a bog snorkelling competition you mustn’t ________________.
It’s a difficult sport because ________________.
Bog snorkelling first took place in ________________.
The world record in bog snorkelling is ________________.
Sally has already been ________________.
Activity C: Put the words in the correct order to make the sentences.
has / Bog / fun / been / for / Sally. / snorkelling / a lot of
lots of / made / friends. / She’s
to / been / more / already / competitions / than / She / two / has
already / one. / She’s / won
Footer: WB p. 120, 121, 122, 123
UNIT 14
Pages 110–111
Page 112–113
SOUNDS RIGHT: /ɔː/ /əʊ/
Activity 9:
Which is the odd one out? Listen and check.
a more, b board, c coat
a door, b go, c slow
a four, b know, c saw
a sport, b bought, c toe
READING: Understanding a poem
Activity 10:
Listen to the poem. Then read it.
The Game
Eleven of us were on the field.
The other team looked scared.
“We’re going to win,” our trainer said.
“We’re really well prepared.”
Then Johnny kicked the ball to Paul
and Paul kicked it to Sue,
when Sue’s mum shouted, “Come home, Sue.
There’s work for you to do.”
Ten of us were on the field
and Helen tackled Eddie.
Then Mr Sutton arrived and said,
“Triplets, your dinner’s ready.”
Seven of us were on the field.
The other team then scored.
And Tom and Helen said, “We’re off.
We’re getting really bored.”
Five of us were on the field,
when Roland hurt his knee.
He left, and Lisa went with him.
And then we were only three.
Three of us were on the field.
The score was twenty–nil.
“I’ve had enough. It’s a waste of time.”
And off the field went Phil.
Two of us were on the field
and we tried our very best.
But then Johnny turned to me and said,
“I’m off, I need a rest.”
So there I was all on my own,
a goalie without a team.
Then Dad called out, “Wake up! You’re late.”
Thank God – it was just a dream.
Activity 11:
Read the poem again. Circle T (True) or F (False).
The poem is about a sports team. T / F
Sue kicked the ball to Sam. T / F
Tom and Helen were really bored. T / F
Lisa hurt her knee. T / F
Johnny didn’t need a rest. T / F
The goalie was in bed. T / F
Footer: WB p. 118, 119, 120, 122
UNIT 14
Page 112
WRITING
Activity 12:
a. Read the text. What sports has the writer already tried or not?
“I love sports. I’ve tried lots of ball sports: football, volleyball, tennis and table tennis. I’ve never tried basketball. I don’t think I’d like it. Maybe I’m not tall enough for it 😏. But I like watching a good basketball match on TV. I’ve done a lot of mountain biking. I started mountain biking last year with my older brother. I love it! I’ve tried many extreme sports, and I’ve never taken part in an egg throwing competition. I think that isn’t a sport for me.”
b. Write a text about sports you’ve already done or tried (60–80 words). Think about:
what sports you’ve tried
when you started that sport
what sports you’ve never tried
why you like it
a sport you’ve done a lot of
GRAMMAR: Present perfect with already / yet
Zur Erinnerung: Du verwendest das Present perfect dann, wenn du nicht über einen bestimmten Zeitpunkt in der Vergangenheit sprichst.
Examples:
I’ve tried lots of ball sports. (Ich habe viele Ballsportarten ausprobiert, es ist nicht wichtig, wann das war!)
I’ve given up volleyball. (Ich habe Volleyball aufgegeben, aber es ist unwichtig, wann das war.)
Wenn du sagen willst, dass jemand etwas schon gemacht hat bzw. etwas schon erledigt ist, kannst du das Present perfect mit dem Wort already verwenden. Das Wort already steht zwischen has/have und dem Past participle (3. Form des Verbs).
Examples:
She has already been to three competitions.
She has already won one.
Wenn du sagen willst, dass etwas noch nicht geschehen ist, verwendest du not yet mit Present perfect. Das Wort yet kommt dabei ans Satzende.
Examples:
They haven’t won a competition yet.
He hasn’t been to Europe yet.
GRAMMAR: Present perfect with ever / never
Um über persönliche Erfahrungen zu sprechen oder danach zu fragen, ob jemand irgendwann in der Vergangenheit etwas getan oder erlebt hat, verwendest du das Present perfect mit ever und never.
Bildung: have/has + ever/never + Past participle (3. Form des Verbs)
Examples:
Have you ever seen a bear?
Have you ever won a competition?
I’ve never had an accident.
I’ve never met a famous person.
Footer: Now go back to page 108. Check ✔ with a partner what you know / can do.
WB p. 118, 119, 120, 122
CYBER Homework 42
My personal learning track
UNIT 14
Page 113
Pages 114–115
THE TWINS 6
🎬 The sports party
Developing speaking competencies
Language function
 ☑ I can make requests and offers (einen Wunsch äußern und Vorschläge machen)
 Speaking strategy
 ☑ I can respond to requests and offers (auf Wünsche und Vorschläge reagieren)
VOCABULARY
Sports
🎧 1 Match the sports and the pictures. Listen and check.
Word bank (left column):
 football
 rugby
 tennis
 cricket
 golf
 swimming
Images:
A group of children playing rugby (boys in red and blue shirts tackling each other)
A swimmer in a pool with goggles and swim cap
A person playing tennis on an orange court
A football match, a player about to shoot the ball
A person swinging a golf club on a golf course
A cricket match, batter in white uniform swinging the bat
🎬 2 Watch or listen to the dialogue. Then read it. What sports do Lucy and Leo want at their party?
Dialogue (with image of Lucy and Leo at a table eating fruit):
Lucy: So we’re having a sports party for our birthday this year.
 Leo: Yeah. Football and tennis. It’s going to be cool.
 Lucy: Why don’t I write the invitations?
 Leo: That’s great. And I’ll organise the equipment.
 Lucy: Fantastic. What else do we need to do?
 Leo: Well, Mum’s already booked the sports centre.
 Lucy: What about food? Can you make a list of the food?
 Leo: Sure, no problem. And could you organise the drinks?
 Lucy: Of course.
 Leo: Football, tennis, food and drink. This is going to be the best party ever.
 Lucy: I just hope the weather’s good.
 Leo: Don’t be so silly. I checked the forecast. It’s going to be sunny all day.
✅ 3 Read the to-do list for Lucy and Leo’s party and tick ☑ for ‘done’ or cross ✗ for ‘to do’.
Decide what kind of party to have. ☐
Write the invitations. ☐
Organise the equipment. ☐
Hire the sports centre. ☐
Make a list of food and drink. ☐
Check the weather forecast. ☐
USEFUL PHRASES
Making requests and offers
🎯 4 Read the sentences. Write R (Request) or O (Offer).
I’ll organise the equipment. ______
Can you make a list of the food? ______
Could you organise the drinks? ______
Why don’t I write the invitations? ______
❓ What do you think? Answer the questions.
Is the party a success? .................................................................
Why (not)? ........................................................................................
📱 MOBILE HOMEWORK
🎬 Watch part 2 of the video and answer the questions.
What other sports does Lucy suggest? ..........................................................
What does Leo think about these suggestions? ............................................
What’s the weather like on the day of the party? ..........................................
What sports do they play at the party? .........................................................
Is the party a success? ....................................................................................
SPEAKING STRATEGY
Responding to requests and offers
🎯 5 Match the responses with sentences 1–4 in 4. Check with the dialogue in 2.
🗨 Of course.
 🗨 Fantastic.
 🗨 Sure, no problem.
 🗨 That’s great.
🎲 CHOICES
6 A Work in pairs. Use the prompts.
A Make a request or offer.
REQUEST
 make me / sandwich
 take me to / party
 help me with / homework
OFFER
 play tennis / you
 do / washing-up
 wash / car
B Respond.
 A: Can you make me a sandwich?
 B: Of course.
8 ROLE PLAY: Work in pairs. You are organising a party.
Make a list of all the things you need to organise (e.g. what kind of party, food, drink, music, invitation, etc.).
Discuss the list. Make offers and requests.


----- WB: More 2 WB Unit 14.txt -----
UNIT 14: Move and keep fit!
Page 117
UNDERSTANDING VOCABULARY: Sports
1. Match the words with the pictures. Then listen and check.
☐ basketball
☐ cycling
☐ football
☐ ice skating
☐ mountain biking
☐ snowboarding
☐ mountain climbing
☐ roller-skating
☐ running
☐ skateboarding
☐ skiing
☐ surfing
☐ swimming
☐ tennis
☐ volleyball
☐ windsurfing
Image description (left to right, top to bottom):
Two children climbing a rocky wall with harnesses – mountain climbing
Boy riding a mountain bike downhill – mountain biking
Girl windsurfing on a lake – windsurfing
Girl water-skiing – skiing
Person snowboarding down a slope – snowboarding
Person skiing down a slope – skiing
Girl ice skating on a frozen pond – ice skating
Girl jumping for a basketball near a hoop – basketball
Girl swimming in the lake – swimming
Girl serving a volleyball on a sand court – volleyball
Two kids playing football/soccer – football
Two players rallying in a tennis match – tennis
Boy roller-skating – roller-skating
Girl cycling on a path – cycling
Girl skateboarding – skateboarding
Group of people jogging – running
2. Find and circle the odd one out.
football / mountain biking / basketball / volleyball
surfing / swimming / running / windsurfing
surfing / cycling / swimming / snowboarding
skiing / mountain climbing / football / snowboarding
surfing / skateboarding / snowboarding / ice skating
Page 118–119
USING VOCABULARY: Sports
3. Read the texts. Which sport(s) are they talking about?
I usually play in the summer – it’s too cold in the winter. It’s good because you only need two people. But sometimes you can play with four people, of course.
I love this sport! You can play indoors but I like playing it on the beach. All you need is a net and a ball – but even on the beach you need four people to play. But that isn’t usually a problem.
The first time I did this sport I hated it because I got so cold! But in the summer the weather is warmer and then it’s great to be in the warm water! I go with my friends now, at the weekends. The board’s a bit expensive, but that’s all.
This is the best sport in the world because all you need is a pair of good trainers and off you go! No special equipment and you don’t even need other people!
My favourite sport is a problem for me because there aren’t any mountains where I live. So I have to go to another country. And I can only do it in winter! It’s difficult and the boards are expensive, but I still love it!
UNDERSTANDING GRAMMAR: Present perfect with already / yet
4. Match the pictures with the sentences.
Image descriptions (A–F): A. Girl sitting at a desk with a pencil in hand, thinking
B. Mechanic standing beside a red car on a lift
C. Girl happily holding a trophy
D. Girl talking on a landline phone
E. Girl looking disappointed, no trophy in hand
F. Girl standing near a red car in the rain
Sentences:
She has already got the trophy.*
They haven’t phoned her yet.
She hasn’t found the answer yet.
She has already phoned for help.
The mechanic* hasn’t fixed her car yet.
She hasn’t got the trophy yet.
VOCABULARY: trophy – Pokal; mechanic – Mechanikerin
5. Match the questions and answers.
Questions:
Have you ever met anybody famous?
Have you ever been on television?
Have you ever been to the sea?
Have you ever written a poem?
Have you ever won a competition?
Have you ever gone snowboarding?
Have you ever fallen asleep in a lesson?
Have you ever seen a ghost?
Answers: ☐ a. No, I never have – and I’m never going to! I hate mountains and snow!
☐ b. Well, I met a footballer in a shop once, but I can’t say he was really famous.
☐ c. Once. But the teacher didn’t see me so it was OK.
☐ d. No, I haven’t. But my mum has. She was really scared.
☐ e. Yes, I have. Two years ago, I won the tennis competition at school!
☐ f. Yes, I have. And I love reading them, too.
☐ g. Yes, I have. We went swimming every day.
☐ h. No, but my sister has. She was on a quiz programme once. She lost!
USING GRAMMAR: Present perfect with already / yet
6. Write the words in the correct order to make questions with already or yet. Then match the questions with the answers in the box.
Word box (example): Has he done his homework yet?
(g)
Questions:
he / has / his / yet / done / homework / ?
→ Has he done his homework yet? (g)
seen / you / Jurassic World film / have / new / already / the / ?
have / arrived / Mum, / we / yet / ?
you / present / you / have / birthday / bought / for / already / a / friend / ?
Harriet’s dog / puppies* / had / yet / has / ?
she / skatepark / new / visited / has / already / the / ?
all / have / yet / vegetables / of / eaten / they / their / ?
cooking / Dad / yet / has / finished / dinner / ?
Answer options: ☐ a. No, they haven’t, so don’t give them any ice cream.
☐ b. No, I haven’t. Is it on already?
☐ c. Yes, he has. We can eat in 10 minutes.
☐ d. Yes, I have. It’s a necklace – she’ll love it!
☐ e. Another 10 minutes, then we’re there.
☐ f. Yes, she has. She goes there every weekend.
☐ g. No, he hasn’t. He’s still working on it!
☐ h. Yes, she has. Do you want one?
VOCABULARY: puppy – Welpe
Page 120–121
UNDERSTANDING GRAMMAR: Present perfect with ever / never
7. Complete the poem with ever or never.
Have you ever ...?
Have you 1. _____________ played tennis?
Have you 2. _____________ won a game?
Have you 3. _____________ been champion?
Have you 4. _____________ heard fans call your name?
No, I’ve 5. _____________ played tennis
And I’ve 6. _____________ won a game.
And I’ve 7. _____________ been a champion.
But I like it all the same*.
VOCABULARY: all the same – trotzdem, dennoch
USING GRAMMAR: Present perfect with ever / never
8. Write the words in the correct order to make sentences or questions.
you / have / handball / ever / played / ?
→ Have you ever played handball?
Japanese / eaten / you / have / food / ever / ?
.......................................................................................................................
never / I’ve / Olympic Games / to / been / the / .
.......................................................................................................................
ever / you / broken / arm / have / your / ?
.......................................................................................................................
competition / never / I’ve / a / won / .
.......................................................................................................................
brother / my / a / poem / never / has / written / .
.......................................................................................................................
parents / never / my / have / France / to / been / .
.......................................................................................................................
dinner / family / you / ever / have / for / your / cooked / ?
.......................................................................................................................
READING & WRITING: Understanding texts about sports / Writing diary entries
9. CHOICES
A. Read the story and put the sentences in the correct order.
Coach Carter
Last week, I saw a film called Coach Carter. It’s about a basketball team at Richmond High School in the USA. They lose most of their games – until they get a new coach, a man called Mr Carter. He makes them work very hard, they have to practise every day. And then they win some games, so they’re very happy! And everything seems OK, but there’s a problem: the players are also at school and they aren’t working very much so they don’t get good grades.* And Mr Carter locks the school gym! Now the players can’t practise.
The headmaster* of the school thinks Carter is wrong and he opens the gym again. The boys can play and practise again, and the team gets to the big final – but they lose to St Francis School 70–68 in a very exciting game. The players are very unhappy, but Coach Carter thinks they have done very well and he congratulates them. It’s not a bad story.
VOCABULARY: high school – Oberstufengymnasium; grade – Note; headmaster – Schulleiter/Schulleiterin
Sentences (to order): ☐ But then their grades weren’t good any more.
☐ 1. The basketball team of Richmond High School wasn’t very good.
☐ The team lost the big final, but their coach was happy.
☐ Then they got a new coach.
☐ So their coach locked the gym.
☐ The students practised every day.
☐ But the headmaster opened it again.
B. Put the text about Emma Sanderson, a famous yachtswoman, in the correct order.*
☐ she was five, her family bought a house in Helensborough, Scotland. That was an ideal place for sailing. When she was eleven, she already started winning competitions.
☐ Emma Sanderson, from England, is a yachtswoman. When she was 25, but she is most famous for winning the Around Alone Race in 2002/03. She was the youngest woman to complete the 29,000 mile solo race, and she was alone at sea for 132 days. Now Emma enjoys telling children about her sailing. Emma is married and has a daughter.
☐ later sailed a yacht, in team races or alone, and won.
☐ Round Britain and Ireland Race in 2000, when she was 25.
VOCABULARY: yachtswoman – Seglerin
Page 122–123
10. a. Read the article. Was Jasmine the first person to swim the length of the UK?
Jasmine Harrison is first woman to swim the length of UK
23-year-old Jasmine Harrison has become the first woman to swim the entire length of the UK from Land’s End in the south to John O’Groats in the north. “To swim that way is better,” she said, “because the waves are not against you.”
Jasmine Harrison swam 900 miles (1,448 km) along the west coast of the UK. And this is not her first record. In 2021, she was the youngest woman to row solo across the Atlantic. She spent 70 days alone in her boat and greatly enjoyed it. It was a distance of 3,000 miles (4,828 km).
She began her swim in July 2022 and finished in October. This means she was in the water for more than 110 days. Ms Harrison swam between four and twelve hours a day and then she rested. Her longest day was a swim of 31 miles or 50 km. “Sometimes it was terribly cold, and sometimes jellyfish attacked me. But it was worth it,” she said.
So far, only two people have swum from Land’s End to John O’Groats, one man in 2013 and another man in 2018.
VOCABULARY: row – rudern; jellyfish – Qualle
b. Read again. How many of these tasks can you do?
Jasmine Harrison was the second woman to swim the length of the UK. T / F
She was only 23 when she did the swim. T / F
She picked the west coast because there aren’t so many waves against you. T / F
What was her first record? ..............................................................
When was that? ..............................................................
When did Ms Harrison start her UK swim record attempt? ..............................................................
For more than 110 days, she ..............................................................
Every day, she swam for ..............................................................
There were two major problems: One was jellyfish and the other was ..............................................................
VOCABULARY: attempt – Versuch
11. Listen and check your answers.
12. Write three or four diary entries about your week in sports.
Example:
Monday: Not much sport today. I went to school by skateboard and we had one PE lesson. We played volleyball, but I hurt my right hand a bit and gave up after 20 minutes.
13. Read the text on tuk-tuk polo.
Traditionally, polo was played on horses and elephants. The idea is to score goals using sticks and a small ball. Now, polo can also be played from tuk-tuks! A tuk-tuk is a very small open car with three wheels. Tuk-tuks can transport people and goods*.
There has been a ban on polo with elephants since 2007. So, since 2016, they have used tuk-tuks instead. Each team has a tuk-tuk with two people. One player is the driver and the other one strikes* the ball. Believe it or not, but today there are even tuk-tuk polo championships. One of the best countries is Sri Lanka.
VOCABULARY: goods (pl) – Waren; strike – treffen, stoßen
14. Now write a text message (30–40 words) to a friend telling him/her about tuk-tuk polo. All the important information should be in it.
....................................................................................................................
....................................................................................................................
....................................................................................................................
LISTENING: Talking about sports
15. Listen to Leila, Danny and Nico talking about their sports. Then answer the questions.
How long has Leila played football? ...............................................
How often does she train? ...............................................
Where’s her coach from? ...............................................
Why are they a good team? ...............................................
What’s Danny’s game? ...............................................
How often does he train? ...............................................
What is he excellent at? ...............................................
How often do Nico and his group meet? ...............................................
How long has he been in the group? ...............................................
When doing the kickflip, what do you do after the rotation of the board? ...............................................
VOCABULARY: rotation – Drehung
DIALOGUE WORK: Making / Responding to requests and offers
16. Match the requests and offers with the replies. Then listen and check.
Can you phone Jamal?
Could you make me a sandwich?
I’ll take the dog for a walk.
Why don’t I talk to Selina?
☐ That’s a great idea! She always listens to you.
☐ Sure, no problem. Cheese or ham?
☐ Of course. I’ll call him tomorrow.
☐ Fantastic. He really needs one.
17. Write offers or requests to complete the dialogues.
Viv: .......................................................
Ian: Sure, no problem. I can buy some on my way home from school.
Rob: .......................................................
Liz: Fantastic. I’m finding it really difficult.
Tim: .......................................................
Deb: Of course. It’s getting quite cold in here.
Jim: .......................................................
Baz: That’s great. They’re really heavy.
Page 124
WORD FILE: Sports
Image description: The top half of the page shows cartoon illustrations of various sports, each labeled in yellow boxes:
roller-skating: a girl roller-skating
sportsman and sportswoman: two runners
ice skating: girl ice skating
snowboarding: person on a snowboard
skiing: person skiing
surfing: girl on a wave with a surfboard
mountain climbing: climber on a rock face
windsurfing: person on a windsurf board
swimming: swimmer with goggles
mountain biking: person biking on rough terrain
cycling: two cyclists
skateboarding: girl on a skateboard
MORE Words and Phrases
Expression	Example sentence	German translation
to grow up	When I grow up, I want to be an Olympic skier.	erwachsen werden; aufwachsen
member	She’s a member of the school team.	Mitglied
professional	I want to play professional basketball.	professionell; hauptberuflich
race	I won my first race last week.	Wettfahrt; Rennen
serious	Have you ever had any serious accidents?	ernst(haft); gravierend
to appear	Would you like to appear on television?	erscheinen
competition	Have you ever won a competition?	Wettbewerb
challenge	The competition was a big challenge for me.	Herausforderung
distance	You have to throw an egg over a large distance.	Abstand, Distanz
extreme	I’ve never tried any extreme sports.	extrem
flood	The bridge broke after a big flood.	Flut
to manage	A team from New Zealand managed to set a new record.	etw. schaffen
official	Has there ever been an official record?	offiziell
rather	Egg throwing is a rather unusual sport.	ziemlich, eher
to snorkel	I love to snorkel in the sea.	schnorcheln
to take part (in)	Do you want to take part in a competition?	an etw. teilnehmen
without	You have to throw an egg without breaking it.	ohne
world record	There’s an official world record in egg throwing.	Weltrekord
nil	The score was twenty – nil.	null
on one’s own	I was all on my own.	alleine
to score	I want to score the next goal.	erreichen, erzielen (Tore)
to tackle	Helen tackled Eddie.	attackieren (im Sport)
waste of time	I’ve had enough. It’s a waste of time.	Zeitverschwendung
equipment	You don’t need a lot of equipment to do this sport.	Ausrüstung
success	Was the party a success?	Erfolg

```

## Output contract

Write `content/corpus/units/g2-u14/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u14",
  "briefBank": "dd3a79bc401b",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u14.s.present-perfect-already-yet",
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
