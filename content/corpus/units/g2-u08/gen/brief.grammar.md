# Grammar generation brief — g2-u08 (MORE! 2, Unit 8)

<!-- domigo:gen grammar g2-u08 bank=7b3557fe606c prompt=4b9164076103 -->

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

### `g2u08.s.past-time-markers` — Past time markers (Zeitangaben in der Vergangenheit)

Sequencing past narratives with time markers (then, after that, finally) and saying when something happened with past time expressions (half an hour ago, last night, in 2013, one day).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [sequence-markers]: Use time markers to put the events of a past story in order: First, ... Then, ... After that, ... Finally, ...
  - DE: Mit Zeitwörtern ordnest du die Ereignisse einer Erzählung in der Vergangenheit: First, ... Then, ... After that, ... Finally, ...
  - "Then everything went black." — "Dann wurde alles schwarz."
  - "After that, Benson went to the old Space Centre." — "Danach ging Benson zum alten Raumfahrtzentrum."
  - "Finally, they took him back to Earth." — "Schließlich brachten sie ihn zurück zur Erde."
- rule [time-expressions]: Say when something happened with past time expressions: half an hour ago, after a minute, last night, one day, in 2013.
  - DE: So drückst du aus, wann sich etwas in der Vergangenheit ereignet hat: half an hour ago, after a minute, last night, one day, in 2013.
  - "Half an hour ago, we heard some funny noises." — "Vor einer halben Stunde hörten wir seltsame Geräusche."
  - "In 2013, there was a big investigation." — "2013 gab es eine große Untersuchung."
  - "Last night, a spaceship landed in our garden." — "Letzte Nacht landete ein Raumschiff in unserem Garten."
- rule [marker-position]: Time markers usually open the sentence, often followed by a comma; time expressions can go at the beginning or at the end.
  - DE: Zeitwörter stehen meist am Satzanfang, oft mit Komma danach. Zeitangaben können am Anfang oder am Ende des Satzes stehen.
  - "One day, James was alone in a town." — "Eines Tages war James allein in einer Stadt."
  - "After a minute, the chair stopped." — "Nach einer Minute blieb der Sessel stehen."

common errors:
- Mixing tenses within a past narrative: ✗ "First, we went to the park. Then we play football." → ✓ "First, we went to the park. Then we played football."
- German verb-second word order after a time marker (L1 transfer): ✗ "Then went he to school." → ✓ "Then he went to school."

SB box `g2/sb/More 2 SB Unit 8.txt#grammar-1` — Past simple (revision):
```
Bei regelmäßigen Verben bildest du das Past simple, indem du -ed anhängst:
 | open – opened | laugh – laughed | look – looked |
Es gibt auch viele unregelmäßige Verben:
 | be – was/were | take – took | come – came | go – went | run – ran |
 | see – saw | wake up – woke up | break – broke | can – could | know – knew |
 | sing – sang | buy – bought | win – won | lose – lost |
Die Verneinung bildest du mit didn’t + Verb:
 They didn’t believe her.
 She didn’t take another photograph.
Was/were verneinst du mit wasn’t/weren’t.
Past time markers
 So kannst du ausdrücken, wann sich etwas in der Vergangenheit ereignet hat:
 Half an hour ago, we heard some funny noises.
 Then everything went black.
 After that, Benson went to the old Space Centre.
 After a minute, the chair stopped.
Finally, they took him back to Earth.
 One day, James was alone in a town.
 In 2013, there was a big investigation.
 Last night, a spaceship landed in our garden.
Image description (bottom right of grammar box): Mr Brown didn’t look before he opened the door. A surprised-looking man sees a robot-like figure behind the door.
```

v1 seed items (UNTRUSTED):
- `m2-u8-past-time-markers-gf-001` [gap-fill, d1]: p="___, we went to the beach. Then, we had ice cream." c="First" a=["First"] ds=["Finally","After that","Suddenly"]
- `m2-u8-past-time-markers-gf-002` [gap-fill, d1]: p="First, we visited the museum. ___, we had lunch at a nice restaurant." c="Then" a=["Then","After that"] ds=["First","Finally","Yesterday"]
- `m2-u8-past-time-markers-gf-003` [gap-fill, d2]: p="We were walking in the forest. ___, a deer jumped out in front of us!" c="Suddenly" a=["Suddenly"] ds=["First","Finally","Then"]
- `m2-u8-past-time-markers-gf-004` [gap-fill, d3]: p="I saw that film two days ___." c="ago" a=["ago"] ds=["before","last","past"]
- `m2-u8-past-time-markers-gf-005` [gap-fill, d3]: p="First, we packed our bags. Then, we drove to the airport. ___, we got on the plane. ___, we arrived in London!" c="After that ... Finally" a=["After that ... Finally","After that...Finally"] ds=["Finally ... After that","Then ... First","Suddenly ... Then"]
- `m2-u8-past-time-markers-gf-006` [gap-fill, d4]: p="___ week, we went on a school trip to Salzburg." c="Last" a=["Last"] ds=["The last","Past","Before"]
- `m2-u8-past-time-markers-mc-001` [multiple-choice, d2]: p="Which sentence has the correct word order?" c="Then she ran to the door." a=["Then she ran to the door."] ds=["Then ran she to the door.","Then to the door she ran.","She then to the door ran."]
- `m2-u8-past-time-markers-mc-002` [multiple-choice, d4]: p="Which story is in the correct order?" c="First, I woke up. Then, I had breakfast. After that, I went to school. Finally, I came home." a=["First, I woke up. Then, I had breakfast. After that, I went to school. Finally, I came home."] ds=["Finally, I woke up. Then, I had breakfast. First, I went to school. After that, I came home.","Then, I woke up. After that, I had breakfast. Finally, I went to school. First, I came home.","After that, I woke up. First, I had breakfast. Finally, I went to school. Then, I came home."]
- `m2-u8-past-time-markers-mc-003` [multiple-choice, d3]: p="Choose the correct sentence:" c="Suddenly, the lights went out." a=["Suddenly, the lights went out."] ds=["Suddenly, the lights go out.","Suddenly went the lights out.","Suddenly, the lights are going out."]
- `m2-u8-past-time-markers-ec-001` [sentence-building, d2]: p="Put the words in the correct order: Then / she / went / to / the / shop" c="Then she went to the shop." a=["Then she went to the shop.","Then she went to the shop"] ds=[]
- `m2-u8-past-time-markers-ec-002` [error-correction, d3]: p="Find and fix the mistake: First, we ate pizza. Then we play football in the park." c="First, we ate pizza. Then we played football in the park." a=["First, we ate pizza. Then we played football in the park.","First, we ate pizza. Then we played football in the park","played"] ds=[]
- `m2-u8-past-time-markers-ec-003` [sentence-building, d2]: p="Put the words in the correct order: After / that, / he / watched / a / film / at / home" c="After that, he watched a film at home." a=["After that, he watched a film at home.","After that, he watched a film at home"] ds=[]
- `m2-u8-past-time-markers-tf-001` [transformation, d3]: p="Put the events in order: 'We arrived at the hotel. We went to the beach.' → '___, we arrived at the hotel. ___, we went to the beach.'" c="First, we arrived at the hotel. Then, we went to the beach." a=["First, we arrived at the hotel. Then, we went to the beach.","First ... Then"] ds=[]
- `m2-u8-past-time-markers-tf-002` [transformation, d4]: p="Write it in English: 'Dann spielte er mit seinen Freunden.' →" c="Then he played with his friends." a=["Then he played with his friends.","Then he played with his friends"] ds=[]
- `m2-u8-past-time-markers-tf-003` [transformation, d5]: p="You're writing a story about a zoo trip. Fix the mistake and connect: 'We went to the zoo. We see the elephants.' →" c="First, we went to the zoo. Then, we saw the elephants." a=["First, we went to the zoo. Then, we saw the elephants.","First we went to the zoo. Then we saw the elephants."] ds=[]
- `m2-u8-past-time-markers-tr-001` [translation, d3]: p="🇩🇪 Zuerst gingen wir ins Museum. Dann aßen wir ein Eis." c="First, we went to the museum. Then, we ate an ice cream." a=["First, we went to the museum. Then, we ate an ice cream.","First, we went to the museum. Then, we ate an ice cream","First we went to the museum. Then we ate an ice cream.","First, we went to the museum. Then we ate ice cream.","First, we went to the museum. Then, we had an ice cream.","First, we went to the museum. Then, we had ice cream."] ds=[]
- `m2-u8-past-time-markers-tr-002` [translation, d5]: p="🇩🇪 Plötzlich öffnete sich die Tür und ein Hund rannte herein." c="Suddenly, the door opened and a dog ran in." a=["Suddenly, the door opened and a dog ran in.","Suddenly, the door opened and a dog ran in","Suddenly the door opened and a dog ran in.","Suddenly, the door opened and a dog ran inside.","Suddenly the door opened and a dog ran inside."] ds=[]
- `m2-u8-past-time-markers-sb-001` [sentence-building, d2]: p="Put the words in the correct order: played / Then / we / football / , " c="Then, we played football." a=["Then, we played football.","Then, we played football","Then we played football.","Then we played football"] ds=[]
- `m2-u8-past-time-markers-mt-001` [matching, d4]: p="Match each time marker with its function:\n1. First\n2. Then / After that\n3. Finally\n4. Suddenly\n5. Yesterday\na. shows an unexpected event\nb. marks the last event in a sequence\nc. a specific past time (the day before today)\nd. starts a sequence\ne. shows the next event in order" c="{\"1\":\"d\",\"2\":\"e\",\"3\":\"b\",\"4\":\"a\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"e\",\"3\":\"b\",\"4\":\"a\",\"5\":\"c\"}"] ds=[]
- `m2-u8-past-time-markers-cp-001` [context-picker, d2]: p="You're reading a classmate's diary about a school trip. Which sentence correctly uses past time markers?" c="First, we walked to the park. Then, we played football." a=["First, we walked to the park. Then, we played football."] ds=["First, we walk to the park. Then, we play football.","First, we have walked to the park. Then, we have played football.","First, we walked to the park. Then, we play football."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 8.txt -----
Unit 8 Out of this world
Page 62–63
At the end of Unit 8 …
☑ read words for things in space
 ☑ understand a story set on another planet
 ☑ describe things from the past and present
 ☑ write an ending to a story
☑ understand a factual text and talk about UFOs
 ☑ understand and take notes from an interview
VOCABULARY – Science fiction
1 Match the words and the pictures.
 a. spaceship □
 b. commander □
 c. alien □
 d. spacesuit □
 e. planet □
 f. space centre □
Image row (1–6):
Illustration of a spaceship
Illustration of a person in a red uniform with a badge – likely a commander
Illustration of a green alien with antennae
Illustration of a spacesuit
Illustration of a planet with rings
Illustration of a building complex – space centre
READING & SPEAKING
2 Read the story quickly and answer the questions.
Who is Benson?
Why was he with the Arconians?
b Read the story again.
Benson’s bad luck
Commander Patrick Benson from Spaceship X9 was in bed when his first officer Tanja Andrews woke him up.
 “Commander,” she said, “we’ve got a problem. Half an hour ago, we heard some strange noises coming from the top of our spaceship.”
 “Did you talk to Chen from technology?” Benson asked.
 “Yes, but he says he can’t repair it from the inside. Somebody must go outside. It’s really dangerous. Shall I do it?”
 “No,” Benson replied, “I am the commander. Let me do it.”
Benson connected a cable to his spacesuit. Then he left the spaceship and started work. It took a long time. He finished the job and started to go back inside, but suddenly the cable broke. Benson was lost in space.
 “So this is how I die,” he thought. Then everything went black.
Ten hours later, Benson woke up. An alien was next to him and asked “Trkellan don?”
 “What?” Benson said. The alien gave him a little machine. It helped him to understand the language.
“Who are you?” the alien asked. Benson told him or her or it about his spaceship and about Earth.
 “We know there is a planet called Earth,” the alien said. “Good to have you as a visitor. Welcome Earthling*. I’m Troin.”
“Visitor?” Benson thought. “How did I get here?”
 “We found you in space. And we took you into our ship. We are travellers from the planet Arconia. We would like to study you.”
 “Study me?” Benson asked. “Yes, we want to know more about you and Earthlings.”
 What could Benson do? He stayed with the Arconians for many, many haktronyr (Arconian for “days”).
One day, after many years, Troin told him, “We’re taking you back to Earth. We know all about Earthlings now. One day, we’re going to take over the Earth.”
Image caption: Trkellan don?
So they took Commander Benson back to Earth, to the middle of the Earth’s capital city. Benson looked around and saw a huge statue. He went closer and looked at the statue. There was an inscription*.
 It said:
 TO COMMANDER PATRICK BENSON, HERO OF SPACE.
 The statue was of him!
 He went to the old Space Centre on Earth where he learnt the statue was more than 60 years old. Benson couldn’t believe it. He still looked exactly the same!
He talked to the boss of the Space Centre. “I’m Benson,” he said. “There are aliens who want to take over the Earth.”
The boss of the Space Centre phoned the hospital.
 “There’s a man here who is very confused. He needs some help.”
Image caption: Nobody believed Benson. But he knew the truth. But what could he do? He just watched and waited.
VOCABULARY:
 Earthling – Erdenbewohner/in
 inscription – Aufschrift, Inschrift
3 How many of these tasks can you do?
There was a problem with the spaceship.                      T / F
Commander Benson sent his first officer to repair the spaceship.        T / F
The cable to Commander Benson broke.                        T / F
4–10: Complete the sentences.
 4. When Benson woke up, ____________________________
 5. To understand the alien language, Benson used ____________________________
 6. The Arconians wanted to ____________________________
 7. Why did they take Benson back to Earth? ____________________________
 8. What did Benson see first on Earth? ____________________________
 9. Why do you think they didn’t believe Benson? ____________________________
4 Check your answers with a partner. Then listen to the story.
5 Get together in groups and think of an ending to the story. Then tell the end of the story to the class. Use the past simple.
Page 64–65
SOUNDS RIGHT /d/ /d/ /t/
6 Which is the odd one out? Listen and check.
1 ☐ arrived / landed / planned
 2 ☐ looked / started / barked
 3 ☐ asked / walked / visited
WRITING
7 Complete the sentences. Use the verbs in the box in the past simple.
 see pick go hear put see turn
They never saw him again!
James … was … alone in a town.
He _______________ a strange noise.
He _______________ round.
He _______________ a gold key on the ground.
He _______________ it up.
He _______________ a green light in a window.
He _______________ the key in the door of the house.
He _______________ into the house.
Image sequence (1–8):
James walking alone in town
James hearing something
James turning around
James seeing a key
James picking up the key
James seeing a green light
James putting the key in the door
James going into the house
8 Look at the pictures again. Then write the story.
 Sentence 1: One day, …
 Sentence 2: Suddenly, …
 Sentences 3–5: He …
 Sentence 6: After a few minutes, …
 Sentence 7: Then …
 Sentence 8: Finally, …
A SONG 4 U
9 Listen and sing.
Hero of space
Commander Benson’s our hero.
 He saved us all, but you must know.
 He saved us and got lost in space.
 A hero of the human race. (x2)
Earth Control to spaceship 9 –
 Commander Benson, are you fine?
 Commander Benson, let us know.
 How’s your day, how does it go?
Spaceship 9 to Earth Control.
 In our spaceship there’s a hole.
 Benson went out to repair.
 Now suddenly he’s not there.
Commander Benson’s our hero …
And the ship, is it OK?
 Yes, ’cause Benson saved the day.
 Yes, ’cause Benson saved the crew.
 Now he’s gone, what can we do?
Spaceship 9, what can we say?
 This really is a dreadful day.
 Let’s build a statue for this man.
 Can we do it? Yes, we can!
Commander Benson’s our hero …
READING & LISTENING – Talking about UFOs
10 Read the text and match the sentence halves.
UFOs – ARE THEY REALLY OUT THERE?
There are people who believe in UFOs, ufologists, and there are people who don’t. There are thousands of photos of unidentified flying objects (UFOs). Many of them are nothing but clouds or balloons and aeroplanes. And some of them are fakes. Here is one of the most famous UFO photos in the world.
On May 11ᵗʰ, 1950, Evelyn Trent was in the garden of her farm in McMinnville, Oregon. On her way back to the house, she saw a metallic disc flying in her direction. She called out to her husband. He quickly got a camera and took pictures of the disk.
Even today, ufologists believe that this photo shows a UFO; other people say it is a hoax, a trick to fool people. The Trents died many years ago, so we will never know the truth from them. In 2013, there was a big investigation into the photograph. Scientists used the most modern technology to study the photo, but the experts still couldn’t decide if it was real or not.
Image (right side of the page): Black-and-white UFO photo, disk shape in sky over a house.
Match:
A. A ufologist ☐
 B. Evelyn Trent ☐
 C. Mr Trent ☐
 D. The Trents ☐
 E. Scientists ☐
Options:
 ☐ thought she saw a UFO in the back garden.
 ☐ are no longer alive.
 ☐ studied the photo in 2013.
 ☐ believes in UFOs.
 ☐ took a photo of the “UFO”.
11 Listen to the interview with ufologist Paul Brady and George Brendel, who does not believe in UFOs. Take notes to answer the questions below.
What does Paul believe aliens are doing?
 ………………………………………………………………
Why are they doing this?
 ………………………………………………………………
What does George think about his ideas?
 ………………………………………………………………
Page 66–67
WRITING
12 Here are two endings for the story in 7. Choose the one you like best and say why.
ENDING 1
 James went into the house. He saw a chair and he sat down. It was very comfortable! Then he found a button on the floor, near the chair. “What’s this?” he said, and he pushed the button. The chair started to go round and round very quickly, but after a minute, it stopped. James went out of the house. He was in the year 2090!
ENDING 2
 James went into the house. He saw a chair and he sat down. It was very comfortable! He went to sleep. Five hours later, James woke up. In front of him were two strange people with pink eyes. “Why are you here?” said one of the strange people. “You shouldn’t be here! Now we have to take you to our planet!”
13 Write another ending.
GRAMMAR
Past simple (revision)
Bei regelmäßigen Verben bildest du das Past simple, indem du -ed anhängst:
 | open – opened | laugh – laughed | look – looked |
Es gibt auch viele unregelmäßige Verben:
 | be – was/were | take – took | come – came | go – went | run – ran |
 | see – saw | wake up – woke up | break – broke | can – could | know – knew |
 | sing – sang | buy – bought | win – won | lose – lost |
Die Verneinung bildest du mit didn’t + Verb:
 They didn’t believe her.
 She didn’t take another photograph.
Was/were verneinst du mit wasn’t/weren’t.
Past time markers
 So kannst du ausdrücken, wann sich etwas in der Vergangenheit ereignet hat:
 Half an hour ago, we heard some funny noises.
 Then everything went black.
 After that, Benson went to the old Space Centre.
 After a minute, the chair stopped.
Finally, they took him back to Earth.
 One day, James was alone in a town.
 In 2013, there was a big investigation.
 Last night, a spaceship landed in our garden.
Image description (bottom right of grammar box): Mr Brown didn’t look before he opened the door. A surprised-looking man sees a robot-like figure behind the door.
THE STORY OF THE STONES 4
You can run, but you can’t hide
1 Answer the questions about episode 3. Tick the right answers.
Where were the children?
 ☐ on the beach ☐ by a river ☐ by a lake
Who jumped in the water?
 ☐ the eagle ☐ the rat ☐ the tiger
What is the new girl’s name?
 ☐ Lillian ☐ Gillian ☐ Debbie
Why was she in the water?
 ☐ to save a dog ☐ to save a cat ☐ to save a rabbit
2 Complete the summary of episode 3 with Gillian, Emma, Sarah or Darkman.
___________________ goes to Emma’s house and gives the children a box of chocolates. Gillian tells them that she met a strange man. The children are worried it was probably ___________________. He wanted to know about the kids. Before she leaves, Gillian gives them a box that ___________________ gave to her. ___________________ opens the box. A gas escapes. She and ___________________ are unconscious. ___________________ returns and saves them.
___________________ tells her about the morphing.
VOCABULARY: unconscious – bewusstlos
3 Watch episode 4 and match the questions with the answers.
Why did Emma tell Gillian about the morphing?
 ☐ Because he wants the stones.
Why does Sunborn want to give Gillian morphing powers?
 ☐ Because she can help them make a stronger team.
Why does Gillian want them to close the door quickly?
 ☐ Because she doesn’t like fighting.
Why doesn’t Gillian want to join the team?
 ☐ Because Darkman is after her.
Why does Darkman break into the house?
 ☐ Because she saw the eagle on the floor.
EVERYDAY ENGLISH
4 Watch episode 4 again. Complete the sentences.
Gillian
 He was behind me.
 I know it.
Emma
1. ___________________, Gillian. You’re safe here with us.
Sarah
 2. ___________________ – we know who this man is. His name’s Darkman and he’s after us.
Sunborn
Sometimes I feel that Darkman is very close indeed.
Daniel
 3. ___________________, I think we should give Gillian morphing powers.
Sunborn
 4. ___________________, Daniel. First I have to meet her.
Language box:
In that case
One thing at a time
Calm down


----- WB: More 2 WB Unit 8.txt -----
Unit 8 Out of this world
Page 62–63
UNDERSTANDING VOCABULARY
Science fiction
1 Look at the picture and write the numbers.
☐ spaceship   ☐ commander   ☐ alien   ☐ spacesuit   ☐ planet   ☐ space centre
(Illustration of a spaceship in orbit above a planet, with an alien in a small flying craft, an astronaut in a spacesuit tethered to the ship, and a surface base on a nearby planet. Number labels 1–6 appear next to each item.)
USING VOCABULARY
Science fiction
2 Write the words from 1 on the lines. Sometimes you need to change the form.
1 The person who is responsible for* everything.
 …………………………………………………………………
2 It’s where the astronauts work and live.
 …………………………………………………………………
3 Earth and Mars are two of these.
 …………………………………………………………………
4 The astronauts travel in it.
 …………………………………………………………………
5 They come from another planet.
 …………………………………………………………………
6 What astronauts wear.
 …………………………………………………………………
*VOCABULARY: *be responsible for sth. – für etwas verantwortlich sein
UNDERSTANDING GRAMMAR
Past simple (revision)
3 Find nine more verbs and write them in the past simple. (←→↑↓)
mathematica
KopierenBearbeiten
L C O M E T W H
O P O B R E A K
S L U S B M T I
E S R T S A U T
T D U R K L P A
L N N Y W P R K
U E E D N I F E
N S S T O P H S
……… came………
 ………
 ………
 ………
 ………
 ………
 ………
 ………
 ………
USING GRAMMAR
Past simple (revision)
4 Complete the text with the past simple form of the verbs in brackets.
A week ago, I 1 ________________________ (watch) a science fiction film about aliens.
 They 2 ________________________ (look) like us, they had jobs like us, they had lives just like us.
 But they gave commands. The aliens were the bosses, and we were servants*. They
 3 ________________________ (send) messages through TV, and when people were almost sleeping
 in front of their TVs, the messages were always there. With the help of special glasses, you
 4 ________________________ (know) who was an alien. One day, a man 5 ________________________ (find) a pair of these glasses, and he 6 ________________________ (start) fighting the aliens. It was
 an old film, but I 7 ________________________ (like) it a lot.
*VOCABULARY: *servant – Bediensteter/Bedienstete
UNDERSTANDING GRAMMAR
Past time markers
5 Read the text and choose the correct options.
James went into the house. He didn’t see anything special in the living room, so he went upstairs to the bedroom. He looked around, and ¹ suddenly / a day later, he saw a big book on the bed. He opened it and started to read. There were lots of stories about life on other planets. In the book, he found a picture of a spaceship. James saw that there was a telephone number on the back of the book. ² Yesterday / At first, James didn’t know what to do. But then he picked up the phone and called the number. Somebody answered, but James didn’t understand a word.
James got into bed and slept all night. ³ The next morning / Next week, he woke up and heard a strange noise. He went to the window and looked out. There he saw the spaceship from the book.
⁴ The next morning / Suddenly, the door to the spaceship opened and a strange creature came out. “You called us ⁵ later / yesterday,” the creature said. “Come with us!”
⁶ Last week / Three days later, James was on another planet!
Page 64–65
6 Look at the picture story. Put the sentences in the correct order.
(Nine-panel sequence showing a boy finding an egg in a bush, taking it inside, keeping it on central heating, then after a week hearing a noise again, next day opening a box to find a small dinosaur, and five years later the dinosaur is the size of a house.)
Five years ago, my brother found an egg behind a bush in our garden.
He picked the egg up and took it to his room.
He put it in a box near the central heating* to keep it warm.
A week later, my brother was at the desk in his room again.
Suddenly, he heard a noise, but he didn’t know what it was.
The next day, he heard the noise again.
He opened the box to look at the egg.
There was no egg any more, but a little dinosaur.
Five years later, the dinosaur was as big as our house.
*VOCABULARY: *central heating – Zentralheizung
7 What happened to Natasha? Put the sentences in the correct order.
☐ A month ago, Natasha met a young man.
 ☐ Yesterday at 9 a.m. they left the city in his car.
 ☐ Three days ago, he invited her to his home town.
 ☐ An hour later, the car turned into a spaceship.
 ☐ Ten hours later, they were in the young man’s home town on THX-15.
 ☐ She liked him and after two days she fell in love with* him.
*VOCABULARY: *fall in love with – sich verlieben in
USING GRAMMAR
Past time markers
8 Write sentences that are true for you.
1 Two weeks ago, ……………………………………………………………….. .
 2 Last week, ……………………………………………………………….. .
 3 Yesterday, ……………………………………………………………….. .
 4 Five hours ago, ……………………………………………………………….. .
 5 At ten past eight this morning, ………………………………………. .
 6 Two hours ago, ……………………………………………………………….. .
 7 Last night, ……………………………………………………………….. .
 8 Last weekend, ……………………………………………………………….. .
LISTENING & DIALOGUE WORK
Talking about UFOs
9 a Listen to the five children talking about UFOs. Complete the table. Write yes or no.
	Does he/she believe in UFOs?	Does he/she believe in life in the universe?
Byron	1 ………………………………………	2 ………………………………………
Sara	3 ………………………………………	4 ………………………………………
Karen	5 ………………………………………	6 ………………………………………
Tonio	7 ………………………………………	8 ………………………………………
Sophie	9 ………………………………………	10 ………………………………………

*VOCABULARY: *illusion – Illusion; *society – hier: Verein
9 b Listen again and answer the questions.
1 What does Byron think of UFOs?
 …………………………………………………………………………..
2 Why does Sara believe in UFOs?
 …………………………………………………………………………..
3 What is Karen sure of?
 …………………………………………………………………………..
4 Where did Tonio’s friend of a friend wake up?
 …………………………………………………………………………..
5 Why is Sophie joking with us?
 …………………………………………………………………………..
Page 66–67
10
a Listen to the dialogue between the time traveller* and his wife. Where’s he going?
 b Listen again and tick T (True) or F (False).
The time traveller is going to the year 1066. ☐ T ☐ F
There was a famous battle* in 1066. ☐ T ☐ F
He’s going there because it’s his birthday next week. ☐ T ☐ F
Then he’s going to England in 1900. ☐ T ☐ F
His wife wants some cheese for the party on Sunday. ☐ T ☐ F
He’s going to get some Sacher tortes. ☐ T ☐ F
*VOCABULARY: *time traveller – Zeitreisender/Zeitreisende; *battle – Schlacht/Kampf
11
Work in pairs. A is the time traveller, B is his/her friend. Make up a dialogue of your own. Think about the following:
Where is the time traveller going?
Why is he/she going there?
Is he/she going to another place too?
What must he/she bring back?
(No written answer required.)
READING
Understanding a science fiction story
12
Remember the story Benson’s bad luck on pages 62–63 of the Student’s Book. Put the summary in the correct order.
☐ There was a problem with Spaceship X9 and the first officer woke up Commander Benson.
 ☐ He wanted to warn* the boss of the Space Centre about the aliens.
 ☐ Everything went black, but 10 hours later Benson woke up again.
 ☐ He went to the Space Centre on Earth and learned that it was 60 years after his accident.
 ☐ The boss didn’t believe him and sent him to a hospital.
 ☐ Now Benson is at the hospital. He’s watching the sky and waiting for the aliens to come.
 ☐ After many years, the aliens sent Benson back to Earth. They told him they wanted to take over Earth.
 ☐ When Benson came back, he saw a statue of him. It said that he was a hero.
 ☐ Commander Benson decided to go outside and repair the spaceship.
 ☐ An alien welcomed him. The aliens wanted to study the Earthlings.
 ☐ He finished his work, but when he wanted to go back inside the cable to his spaceship broke.
*VOCABULARY: *warn – warnen
13
a Read the story. Match the pictures with the paragraphs.
(Five illustrations A–E showing a man negotiating space travel, visiting Pluto, finding blue stones, returning.)
“I went into the office of Space Travel Inc. ‘How much is it to go to Mars?’ I asked the woman there. ‘2 000 units on your credit card,’ she said. ‘2 000? Really?’ I said. ‘And how much is it to go to Pluto?’ ‘That’s 3 500,’ she said. ‘Extra miles, extra time, extra sleep.’ I hadn’t got 3 500. I hadn’t even got 2 000. ‘I don’t have a lot of money. Is there any way of getting there for 500?’ I asked.
“‘Sure there is,’ she said. ‘You can pay 500 now. When you’re on Pluto, you can work there and pay us what you owe* us. Do you have any talents?’
 ‘Not really,’ I said. ‘I know a bit about birds and stones. And I’ve got my own spacesuit.’ ‘No birds on Mars or Pluto,’ she smiled, ‘but plenty of stones.’ ‘OK,’ I smiled back. ‘Send me to Pluto.’
“A few light years later I was there. 70 % of the planet was stones. Stones I didn’t really know. I was in a team that was looking for interesting stones. After a year, I still owed 2 000. I didn’t like that. I was really desperate*.
“One day, I found a place full of blue stones. I took one back to the bosses. ‘Where did you get that?’ they asked. ‘Why?’ I wanted to know. ‘They are really valuable. They have so much energy. With four or five of those stones you have enough energy for the whole of Earth for a year. Where did you get it?’ ‘OK,’ I said. ‘What do I get if I tell you?’ ‘You don’t have to pay us back the 2 500. And we’ll give you 50 000 units.’ ‘Well, that was a good deal, I thought. ‘Fine,’ I said, ‘I’ll show you tomorrow.’ Before I showed them the place, I went there and filled a bag with stones. Just to make sure, I’d always have enough units.
“Next day, I showed them, and then I went back to Earth. I went to Space Travel Inc. ‘Oh, you’re back,’ the same woman said. ‘Why are you here?’ she asked. I smiled at her. ‘Have spacesuit, will travel. Are there any interesting planets I can visit?’”
*VOCABULARY: *owe – schulden; *desperate – verzweifelt
b Read the story again and answer the questions.
How many units is it to go to Pluto?
 …………………………………………………………………………..
What are the man’s talents?
 …………………………………………………………………………..
How many units did he earn after a year?
 …………………………………………………………………………..
What did he do with one of the blue stones?
 …………………………………………………………………………..
Why were the blue stones valuable?
 …………………………………………………………………………..
Why did he fill a bag with stones?
 …………………………………………………………………………..
What are the man’s plans now?
 …………………………………………………………………………..
Page 68–69
14 WRITING Writing an ending to a story
CHOICES
Read the beginning of the story.
We are so lucky. Two days ago, we won a ticket for Targon, a planet just like Earth. And today we are going there.
Why are we so happy to go? Because Earth is too crowded*, there are far too many people on Earth, and there isn’t enough food for all of us.
But our great astronauts and our great leaders* found a planet for us that is exactly like Earth. Only not so crowded and not so polluted*. There are films that say Targon is like paradise. In these films you see happy people and beautiful places. So everybody wants to go there, but not everybody can. A lottery decides who can go and who can’t go.
And today is the day! We are all in a huge room. A large sign says: “This way to the spaceship”. My parents and my little sister Lea are at the front. I’m really happy.
*VOCABULARY: *crowded – überfüllt; *leader – Anführer/Anführerin; *polluted – verschmutzt
A
Continue the story. They are at Targon. What happens there? (120–150 words)
Think about:
Is it really like paradise?
What are the good/bad things about Targon?
What could go wrong?
Who do they meet?
What is the ending?
(Write your continuation here.)
B
Continue the story. Look at the picture below to continue. (150–200 words)
“Suddenly, a girl walked up to me. ‘Turn back,’ she said. ‘There’s no Targon and there’s no spaceship.’”
Think about:
Why does she say this?
How does she know?
What happens to the travellers if there’s no spaceship and no planet Targon?
What happens to the narrator? Does he/she turn back? Why / Why not?
What is the ending?
(Write your continuation here.)
WORD FILE
Science fiction
(Illustration of a red planet surface, a space centre, a spaceship with “commander” at the controls, an astronaut in a spacesuit, an alien in a UFO, and a planet in the sky, each labelled.)
spaceship
commander
spacesuit
alien
UFO
space centre
planet
📚 MORE Words and Phrases
#	Word/Phrase	Example Sentence	Translation (German)
2	boss	He wanted to warn the boss of the space centre.	Chef/Chefin
	cable	Benson connected a cable to his spacesuit.	Kabel
	capital	Vienna is the capital of Austria.	Hauptstadt
	to connect	You have to connect the cable to the spacesuit.	anschließen; verbinden
	hero, heroine	You saved us – you’re our hero.	Held, Heldin
	machine	The alien gave him a little machine that helped him to understand the language.	Maschine
	to repair	Benson went outside to repair the broken spaceship.	reparieren
	space	There are lots of stars and planets out there in space.	Weltall
	statue	There’s a statue of Lord Nelson at Trafalgar Square.	Statue
	to take over	The aliens want to take over the Earth.	erobern, die Führung übernehmen
	traveller	I’m a traveller from planet Arconia.	Reisender/Reisende
	visitor	Welcome! It’s good to have you as a visitor.	Besucher/Besucherin
7	key	He found a gold key on the ground.	Schlüssel
9	crew	Benson has to save his crew on the spaceship.	Besatzung
10	aeroplane	Yesterday, I saw a huge aeroplane in the sky.	Flugzeug
	expert	She’s an expert.	Experte/Expertin
	hoax	The news isn’t true. It’s a hoax.	Streich; Täuschung
	investigation	The police started their investigation yesterday.	Untersuchung, Ermittlung
	photograph	My grandma showed me an old photograph.	Foto
11	to destroy	In the film, aliens try to destroy Earth.	zerstören
	to kidnap	I think aliens want to kidnap people from Earth.	entführen
	nonsense	I’m sorry, but this is just nonsense.	Unsinn
12	comfortable	The chair was very comfortable!	bequem
S4	Calm down!	Calm down! You’re safe with us.	Beruhige dich!
	in that case	In that case, we should give him morphing powers.	in diesem Fall

```

## Output contract

Write `content/corpus/units/g2-u08/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u08",
  "briefBank": "7b3557fe606c",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u08.s.past-time-markers",
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
