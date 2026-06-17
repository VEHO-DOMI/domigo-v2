# Grammar generation brief — g3-u11 (MORE! 3, Unit 11)

<!-- domigo:gen grammar g3-u11 bank=d6e86622941b prompt=4b9164076103 -->

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

### `g3u11.s.present-perfect-continuous` — Present perfect continuous (Present perfect continuous (Verlaufsform des Present perfect))

have/has + been + -ing for an activity that has been going on for some time and is still continuing, often with for/since, contrasted with the present perfect simple, which focuses on the result. This unit has no SB grammar box; the structure comes from the v1 seed.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [form-have-been-ing]: Form it with person + have/has + been + the -ing form of the verb. Use it for an activity that has been going on for some time and is still continuing.
  - DE: Du bildest es mit Person + have/has + been + der -ing-Form des Verbs. Du verwendest es für eine Aktivität, die seit einiger Zeit andauert und noch weitergeht.
  - "I've been living here for six weeks." — "Ich wohne seit sechs Wochen hier."
  - "She has been working all morning." — "Sie arbeitet schon den ganzen Vormittag."
- rule [activity-vs-result]: Use the continuous to focus on the ongoing activity, and the present perfect simple to focus on the finished result.
  - DE: Du verwendest die Verlaufsform, um die laufende Aktivität zu betonen, und das einfache Present perfect, um das fertige Ergebnis zu betonen.
  - "I've been reading all morning." — "Ich lese schon den ganzen Vormittag."
  - "I've read three books this month." — "Ich habe diesen Monat drei Bücher gelesen."
- rule [no-stative-verbs]: Stative verbs (know, like, want, be, have) do not take the continuous form - use the present perfect simple instead.
  - DE: Zustandsverben (know, like, want, be, have) verwenden keine Verlaufsform - nimm stattdessen das einfache Present perfect.
  - "I've known her since primary school." — "Ich kenne sie seit der Volksschule."

common errors:
- Missing the -ing form after been: ✗ "I have been live here for six weeks." → ✓ "I have been living here for six weeks."
- Omitting been from the construction: ✗ "I have living here for six weeks." → ✓ "I have been living here for six weeks."
- Using the continuous with a stative verb: ✗ "I've been knowing her for years." → ✓ "I've known her for years."

v1 seed items (UNTRUSTED):
- `m3-u11-present-perfect-continuous-tf-003` [gap-fill, d5]: p="You arrive at the sports ground and see your friends are exhausted and sweaty. They started playing at 3 pm and it's now 5 pm. You say: 'You ________ (play) football for two hours!'" c="have been playing" a=["have been playing","'ve been playing"] ds=["has been playing","had been playing","been playing"]
- `m3-u11-present-perfect-continuous-gf-020` [gap-fill, d1]: p="I ___ (wait) for the bus for twenty minutes." c="have been waiting" a=["have been waiting","'ve been waiting"] ds=["has been waiting","am waiting","waited"]
- `m3-u11-present-perfect-continuous-gf-021` [gap-fill, d1]: p="She ___ (learn) French since September." c="has been learning" a=["has been learning","'s been learning"] ds=["have been learning","is learning","learns"]
- `m3-u11-present-perfect-continuous-gf-022` [gap-fill, d2]: p="They ___ (play) football for two hours. They must be tired!" c="have been playing" a=["have been playing","'ve been playing"] ds=["has been playing","are playing","played"]
- `m3-u11-present-perfect-continuous-gf-023` [gap-fill, d3]: p="How long ___ you ___ (study) for the test?" c="have ... been studying" a=["have ... been studying","have you been studying"] ds=["has ... been studying","are ... studying","did ... study"]
- `m3-u11-present-perfect-continuous-gf-024` [gap-fill, d4]: p="My dad ___ (paint) the house since last weekend. He still hasn't finished!" c="has been painting" a=["has been painting","'s been painting"] ds=["have been painting","is painting","painted"]
- `m3-u11-present-perfect-continuous-gf-025` [gap-fill, d5]: p="It ___ (rain) all day. The streets are completely flooded." c="has been raining" a=["has been raining","'s been raining"] ds=["have been raining","is raining","rained"]
- `m3-u11-present-perfect-continuous-mc-020` [multiple-choice, d2]: p="Your friend looks exhausted. Which sentence explains why?" c="She has been running for an hour." a=["She has been running for an hour."] ds=["She has run for an hour.","She is running for an hour.","She ran for an hour."]
- `m3-u11-present-perfect-continuous-mc-021` [multiple-choice, d3]: p="Choose the correct question to ask about the duration of an ongoing activity." c="How long have you been learning English?" a=["How long have you been learning English?"] ds=["How long do you learn English?","How long are you learning English?","How long did you learn English?"]
- `m3-u11-present-perfect-continuous-mc-022` [multiple-choice, d4]: p="Which word completes the sentence correctly? 'I've been reading this book ___ two weeks.'" c="for" a=["for"] ds=["since","during","from"]
- `m3-u11-present-perfect-continuous-ec-020` [error-correction, d2]: p="Find and fix the mistake: She have been working here since 2020." c="has been working" a=["has been working","She has been working here since 2020.","She has been working here since 2020"] ds=[]
- `m3-u11-present-perfect-continuous-ec-021` [error-correction, d3]: p="Find and fix the mistake: We have been waiting since three hours." c="for three hours" a=["for three hours","We have been waiting for three hours.","We have been waiting for three hours"] ds=[]
- `m3-u11-present-perfect-continuous-ec-022` [error-correction, d4]: p="Find and fix the mistake: He has been play tennis for two hours." c="been playing" a=["been playing","has been playing","He has been playing tennis for two hours.","He has been playing tennis for two hours"] ds=[]
- `m3-u11-present-perfect-continuous-tf-020` [gap-fill, d3]: p="You notice your friend's eyes are red. Ask how long they've been crying: 'How long ___?'" c="have you been crying" a=["have you been crying"] ds=["has you been crying","had you been crying","you been crying"]
- `m3-u11-present-perfect-continuous-tf-021` [transformation, d4]: p="Your brother started cooking at 4 pm. It's now 6 pm. He's still cooking. Complete: 'My brother ___ for two hours.'" c="has been cooking for two hours" a=["has been cooking for two hours","has been cooking"] ds=[]
- `m3-u11-present-perfect-continuous-tr-020` [translation, d3]: p="Translate into English: 'Wir warten seit einer Stunde auf den Bus.'" c="We have been waiting for the bus for an hour." a=["We have been waiting for the bus for an hour.","We've been waiting for the bus for an hour."] ds=[]
- `m3-u11-present-perfect-continuous-tr-021` [translation, d4]: p="Translate into English: 'Er lernt seit September Gitarre.'" c="He has been learning guitar since September." a=["He has been learning guitar since September.","He has been learning the guitar since September.","He's been learning guitar since September."] ds=[]
- `m3-u11-present-perfect-continuous-sb-020` [sentence-building, d2]: p="Put the words in order: been / has / she / reading / since / morning / the" c="She has been reading since the morning." a=["She has been reading since the morning.","She has been reading since the morning"] ds=[]
- `m3-u11-present-perfect-continuous-sb-021` [sentence-building, d3]: p="Put the words in order: long / how / have / been / they / for / waiting / the / concert" c="How long have they been waiting for the concert?" a=["How long have they been waiting for the concert?","How long have they been waiting for the concert"] ds=[]
- `m3-u11-present-perfect-continuous-mt-020` [matching, d3]: p="Match the sentence with the correct time expression. 1: I've been studying 2: She's been dancing 3: We've been living here 4: He's been sleeping 5: They've been travelling" c="{\"1\":\"c\",\"2\":\"b\",\"3\":\"e\",\"4\":\"a\",\"5\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"b\",\"3\":\"e\",\"4\":\"a\",\"5\":\"d\"}"] ds=["a: for ten hours.","b: since she was four.","c: for three hours.","d: since last Monday.","e: since 2018."]
- `m3-u11-present-perfect-continuous-cp-020` [context-picker, d2]: p="Your hands are covered in paint. Someone asks what you've been doing. Which answer fits?" c="I've been painting my room all afternoon." a=["I've been painting my room all afternoon."] ds=["I painted my room all afternoon.","I paint my room all afternoon.","I'm painting my room all afternoon."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrew, Andy, Angeles, Anger, Animal, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chito, Chloe, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Red, Redwood, Reihenfolge, Renato, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Sylvester, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 11.txt -----
Unit 11 The Golden State
Pages 92–93
At the end of unit 11 ...
 you know
 8 words for describing places and sights in Death Valley
 how to use the present perfect continuous
you can
 understand information in a commercial
 understand a quiz and a blog about California
 understand an interview in a magazine
 understand a story about a holiday in Death Valley
 understand information on a tourist website
 talk about your holiday
 write a postcard
 write a text about places you would like to visit
▶ LISTENING
 Understanding information in a commercial
1 Listen to the commercial. Number the places in the order you hear them.
 (Image: Illustrated map showing California and part of Nevada, with labeled landmarks such as Lake Tahoe, Napa Valley, Redwood National Park, Lassen Volcanic, Yosemite National Park, Mount Whitney, San Francisco, Sacramento, Monterey, Death Valley, Calico Ghost City, Fallbrook, Los Angeles, San Diego, and the Pacific Ocean. Circular markers on the map are left empty for numbering.)
▶ 2 Listen again and complete the missing information.
 (Image 1: Levi’s Stadium)
 (Image 2: Hollywood Walk of Fame)
 (Image 3: El Capitan in Yosemite)
 (Image 4: Redwood National Park, trees towering above)
 (Image 5: Death Valley desert)
 (Image 6: Monterey coast)
1 The Levi’s Stadium – home to the San Francisco …………………………ers.
 2 The Hollywood Walk of Fame in ………………………………………
 3 El Capitan in Yosemite. You might see a …………………………………
 4 Redwood National Park – some of the trees are ………………………… years old and ………………………… tall.
 5 Death Valley – where the temperature has reached ………………………
 6 Monterey – we’re off to see a ……………………………………………
▶ READING & LISTENING
3 Do the quiz. Then listen and check your answers.
How much do you know about California?
1 How many people live in California?
 a) about 20 million  b) about 30 million  c) about 40 million
2 Which city is the state capital of California?
 a) Los Angeles  b) Sacramento  c) San Francisco
3 How many Californians were not born in the US?
 a) 10%  b) 15%  c) 25%
4 When was California made a state?
 a) 1750  b) 1850  c) 1950
5 How many earthquakes does California have every year?
 a) 10,000  b) 100,000  c) 1 million
6 The lowest point of the US is in Death Valley National Park. How many metres below sea level is it?
 a) 26 m  b) 56 m  c) 86 m
7 What is California sometimes called?
 a) the Beach State  b) the Golden State  c) the Film State
8 What is California’s biggest export?
 a) wine  b) almonds  c) oranges
9 Which of these things were invented in California?
 a) Barbie dolls  b) skateboards  c) the internet
10 What creature is on the state flag?
 a) a grizzly bear  b) a whale  c) an eagle
 (Image: Photos include the California state capitol, Chinatown street in San Francisco, and a Barbie doll with the American flag.)
Pages 94–95
▶ READING
 Understanding an interview in a magazine
4 Read the interview with Olivia.
Home from home ➜
A few months ago, Olivia Thornbury’s mother, Claire, got a job as a programmer in Silicon Valley, so she moved to California with her 15-year-old daughter from Manchester in England. Amelia, a classmate of Olivia’s from her previous school in Manchester, has interviewed her for the school magazine.
Amelia How long have you been living in California, Olivia?
 Olivia A bit less than half a year.
 Amelia And where do you live?
 Olivia In Silicon Valley, but everybody calls it “The Valley” here, just as they call San Francisco “The City”. Actually, we lived in San Francisco at first, and my mum commuted* to the Valley every day. But she really didn’t like driving for more than two hours every day – or much longer when the traffic was bad. So we moved. We’ve been living here for about six weeks now.
 Amelia How do you like living in your new neighbourhood?
 Olivia We’ve got an awesome house. It has windows all over the place, as many of the houses here do. The weather here is so beautiful. Most of the time, it’s sunny and warm. Californians want to feel as though they’re ALWAYS outside! And when you walk round, it’s not uncommon* to hear many different languages in the street. There is such a great mix of different cultures, which is just awesome. It always reminds me that people exist outside of our little bubble, that the world is huge and wonderful. And people are all smiles, it seems everybody loves living here. I’ve never heard anybody complain about the place.
 Amelia Your mum works as a programmer, and Silicon Valley is the world’s most famous place for IT companies. How does that feel?
 Olivia It’s great. I’m so proud of Mum and it’s fascinating to hear her talking about her work. But I seriously need to stop thinking like I’ve just met a celebrity when I meet someone who works (or has worked) at Google or Meta. Because that’s pretty normal around here. But STILL – it is awesome. Oh, and another fun thing. The techies – as they call themselves – speak a different language sometimes.
Amelia What do you mean?
 Olivia Well, I’ll give you an example. They use ‘bandwidth’ for ‘time’.
 Amelia ‘Bandwidth’ for time? What does that mean?
 Olivia Let me give you an example. A friend of mine said the other day, “I don’t think I have the bandwidth for this! I think I’d need some help”. He didn’t mean that he needed help because his internet connection was slow. He meant that he hadn’t got enough TIME ...
 Amelia What other things are you finding different in California?
 Olivia Well, fruits and vegetables are fresher. A lot of the fruit you buy from the grocery store is actually local, so you can really taste the difference in freshness. There are farmers’ markets on nearly every corner too. And then there’s the best avocado in the world – it’s like butter! I’ve been eating avocado every day since we first came here. Before I didn’t even like it. Californians put avocado into everything!
 Amelia And finally, is there anything that is completely different from how you imagined it?
 Olivia Yes, boots. All the girls wear boots. And it’s summer now and really hot. “Why would I need boots in sunny California?” I thought, and I left all mine at home. Big mistake. Everyone wears boots. I look silly in my flip-flops. But now I’ve got some. I’m on my way to our garage.
 Amelia Sorry?
 Olivia Yes, I’m building the next multi-million dollar tech company!
 Amelia In your dreams!
VOCABULARY: commute – pendeln; uncommon – ungewöhnlich
▶ 5 How many of these tasks can you do?
1 Olivia has been living in Silicon Valley for
 ☐ almost six months. ☐ a month. ☐ one and a half months.
2 Olivia’s house
 ☐ is different from other houses in Silicon Valley.
 ☐ has a lot of glass.
 ☐ is very warm.
3 Most Californians
 ☐ speak more than one language.
 ☐ are happy living there.
 ☐ complain about the weather.
4 Olivia meets a lot of famous people in Silicon Valley. T / F
 5 Californian avocados are delicious but quite hard. T / F
 6 Olivia didn’t bring her boots with her from the UK. T / F
7 How happy do you think Olivia is, living in California?
 8 Which of the things she talks about sounds most attractive to you?
 9 What things would you miss most about Austria if you moved to another country?
6 Check your answers with a partner. Then listen to the interview.
VOCABULARY
 Places and sights in Death Valley
7 Match the words with the definitions.
1 dry
 2 you have no signal
 3 to spot
 4 backpack
 5 headquarters
 6 dirt road
 7 ridge
 8 canyon
☐ rucksack
 ☐ deep valley with steep sides of rock
 ☐ road made of hard earth
 ☐ to notice (someone)
 ☐ area at the top of a mountain
 ☐ your mobile phone doesn’t work here
 ☐ without water
 ☐ main buildings or offices
▶ LISTENING
 Understanding a story about a holiday in Death Valley
8 Now listen to Christine’s story about a dramatic adventure in Death Valley and answer the questions.
1 What sort of car did Oliver and Christine rent?
 2 Where did Oliver want to take photos?
 3 Why did they stop the car?
 4 What did they do then?
 5 How much water did they take with them?
 6 What did Oliver do when they found out that they were in the wrong canyon?
 7 What did Christine do?
 8 How was Christine rescued?
DID YOU KNOW ... ?
 Death Valley is about 320 km northeast of L.A. The valley is situated between two mountain ranges. It gets less than 5 cm of rain a year and is very hot – often up to 50 degrees in the summer months. In 1849, during the gold rush in California, a group of gold diggers got lost in this valley and died of thirst – that’s why it’s called Death Valley.
 (Image: A stunning view of a dry, rugged canyon with red and orange rock formations and layered ridges under a blue sky.)
Pages 96–97
▶ READING
 Understanding information on a tourist website
9 Read the website. Which of these things would you like to do most and why?
TRAVEL BUG
 DESTINATIONS PLAN YOUR TRIP NEWS & ADVICE SUBSCRIBE
Four things to do in San Francisco
1 Walk across the Golden Gate Bridge
 The Golden Gate Bridge was first opened in 1937 and its famous 230 m tall orange towers have become one of the most familiar sights in San Francisco. With the sea and nature on one side and the city on the other, a walk over this bridge is spectacular. People take more photos of the Golden Gate Bridge than any other bridge in the world [1].
2 Take a ferry to Alcatraz Island
 Alcatraz was once a lighthouse helping to keep ships from the fog safely away from the shore. In 1870, it became one of the most famous prisons in the world. Only five men ever escaped from ‘the Rock’, but as they were never seen again, they probably all drowned. These days, you can go on a guided tour while listening to the stories of some of the famous criminals [2].
3 Have a picnic in Golden Gate Park
 Bigger than New York’s Central Park, Golden Gate Park is home to many famous buildings in San Francisco including an art museum and an academy of science. But for many people it is the perfect place to hang out and enjoy the views [3]. On Sundays, the road that runs through it is closed to cars, and the cyclists and roller skaters take over.
4 Walk down Lombard Street
 Lombard Street is the craziest street in San Francisco and maybe in all of the US, too. This zigzag road turns sharply eight times from top to bottom. For the complete experience, take one of the famous San Francisco trams to the top. Enjoy the view and then walk down while you look at the amazing houses. Even better, why not hire a bike and ride down this road yourself – [4]!
10 Read again. Put the phrases A–E in the correct places. There is one extra phrase.
A who spent time there
 B It’ll be a journey you never forget
 C but these days it is closed to tourists
 D while relaxing in one of the many gardens
 E and once you see it, you’ll understand why
▶ SOUNDS RIGHT
 Intonation
11 Match the beginnings and endings of the questions. Then listen and check.
1 How long did you        ☐ go first?     ↑ / ↓
 2 Where did you          ☐ a good time?  ↑ / ↓
 3 Did you have           ☐ over the bridge? ↑ / ↓
 4 Did you walk           ☐ come back?   ↑ / ↓
 5 Did you go on           ☐ sightseeing?   ↑ / ↓
 6 Did you go            ☐ spend there?  ↑ / ↓
 7 When did you           ☐ a guided tour? ↑ / ↓
12 Listen again and repeat the questions. Does the voice go up or down at the end of each question? Circle the correct arrows in 11.
▶ SPEAKING
 Talking about your holiday
13 Imagine that you have come back from a holiday. Choose 5 places (cities, parks, attractions, etc.) that you went to see. In pairs, ask and answer questions. Use the questions in 11 to help you.
▶ WRITING
 14 CHOICES
A Here’s a postcard that Megan wrote to a friend in the UK.
 Read it and imagine you are that friend. Write a postcard back (60–80 words). In your postcard:
 • react to what she’s saying
 • write about what you’re doing
 • suggest when you could meet again
(Image: A postcard written in a circular spiral. The message reads:
 “Dear Julie,
 San Francisco is great! We’ve been sightseeing all day and I’m just sitting in the park during the day but come back to the Golden Gate Bridge tomorrow. I think! Hope you’re OK. Love, Megan.”
 On the right side is the printed name and address:
 Julie Waring
 96 Leafield Rd
 Oxford OX4 9XP
 England)
B Search the internet for more information about California. Write a text (120–180 words) about places you would like to visit. Download some photos to add to the page. In your text, include information:
 • on the place you’d like to visit
 • on where it is in California
 • on the reason(s) why you would like to visit these places
 • on how long you want to stay there
 • on who you think might like the places too
▶ GRAMMAR
 Present perfect continuous
How to use it:
 You use the present perfect continuous to say what someone has been dealing with or what has been going on for some time.
How long have you been living in California, Olivia?
 We’ve been living here for about six weeks now.
 I’ve been eating avocado every day since we first came here.
How to form it:
 Person + have/has + been + -ing form of the verb
(Image: Comic speech bubble says:
 “Have you been waiting a long time?”)
🔁 Now go back to page 92. Check ✅ with a partner what you know / can do.
Pages 98–99
▶ 1 Watch or listen to the dialogue. Then read it.
Tom Now, it’s not the quickest way to get to Chichester. But trust me, you’ll love it. And besides, there are hardly any steam train lines left.
 Kate But do you really need to go to the information desk? I can get it all on my phone! Oh, he’s gone.
 Tom Hello. We want to go to Chichester using the Bluebell steam service. And we need some information.
 Assistant Sure. How can I help you?
 Tom So, let’s see. How long does it take to get there?
 Assistant It’s about two hours.
 Tom Really? It’s not that far away.
 Assistant Yes, you have to change at East Grinstead onto main line services, I’m afraid.
 Tom And how much is a return with a young person’s railcard?
 Assistant £8.40.
 Tom That’s not too bad. And what time is the next train?
 Assistant It’s at 10.45.
 Tom OK, that gives us thirty minutes. And if we want to come back at around 7 p.m., what train should we get?
 Assistant There’s one at 17.44.
 Tom And what’s the next one after that?
 Assistant 18.44. They’re every hour until 20.44.
 Tom Then that’s the last train. Would you like a copy of the timetable?
 Tom No, it’s OK. I’m writing it all down. OK, I think that’s all. No. Actually, there is another thing. Can you get food on the train?
 Assistant Not on this one. But there’s a café on the platform.
 Tom Can we have two returns, please?
 Assistant Sure, that’ll be £16.80.
 Tom And, sorry, just one more thing. What platform does the train leave from?
 Assistant Platform 1. Here are your tickets. Have a nice journey.
 Tom Thanks. Come on, Kate, let’s get something to eat before we get on the train.
 Kate Finally!
2 Complete the sentences with the missing numbers and times.
1 It takes ………………………………… hours to get to Chichester by train.
 2 The journey involves ………………………………… change.
 3 It costs £………………………………… to get there and back.
 4 Tom decides to get the train at ………………………………… .
 5 The time now is ………………………………… .
 6 The last train back is at ………………………………… .
 7 Tom pays £………………………………… for the tickets.
 8 They have to go to platform ………………………………… to catch the train.
▶ USEFUL PHRASES
 Asking for information
3 Match the questions and answers.
1 How long does it take to get there?
 2 How much is a return with a young person’s railcard?
 3 What time is the next train?
 4 Can you get food on the train?
 5 Can we have two returns, please?
 6 What platform does the train leave from?
☐ It’s £8.40.
 ☐ Not on this one.
 ☐ It’s at 10.45.
 ☐ Platform 1.
 ☐ It’s about two hours.
 ☐ Sure, that’ll be £16.80.
? What do you think? Answer the questions.
 • Will they catch the train?
 • How do they spend the rest of the day?
▶ MOBILE HOMEWORK
Watch part 2 of the video and put the events in Kate’s diary in order.
☐ Took a photo of Tom’s paper – he really needs to start using technology.
 ☐ Tom lost all the train info.
 ☐ Found out my phone had no battery.
 ☐ We started thinking about going back home.
▶ SPEAKING STRATEGY
 Asking for more information
4 Complete. Then check with the dialogue in 1.
1 Tom A…………………, W…………………………… the next one after that?
 2 Tom I think that’s all. No. A………………………… , t………………………… I……………………………
      a…………………………: ‘……………………………, can you get food on the train?’
 3 Tom S………………………… , J………………………… o………………………… m…………………………
      t…………………………: What platform does the train leave from?
▶ 5 ROLE PLAY: Work in pairs. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You work in an information office. Make up the length of the journey to London, number of changes, cost of a ticket, times of the trains there and back, if you can get food on the train and the platform.
Student B
 You want to go to London by train. Ask about the journey, including cost of ticket, number of changes, times of the trains there and back, if there is any food on the train and the platform.


----- WB: More 3 WB Unit 11.txt -----
UNIT 11 The Golden State
Pages 92–93
UNDERSTANDING VOCABULARY
 Places and sights in Death Valley
1 Fill in the missing letters to make vocabulary items from the story A holiday in Death Valley in your Student’s Book on page 95.
1 d _ _ y
 2 s _ _ g _ _
 3 s _ _ o _
 4 c _ _ n _ _
 5 b _ _ c _ _ p _ _ c _
 6 r _ _ d _ e
 7 h _ _ a _ _ q _ _ a _ _ t _ _ r _
 8 d _ _ r
USING VOCABULARY
 Places and sights in Death Valley
2 Complete the dialogues with the words from 1.
1 A We’re in trouble! Call your parents on your mobile phone.
 B I can’t! There’s no ................................................ here!
2 A Look at this photo. Do you know what this building is?
 B Yes, it’s the United Nations ................................................ in New York.
3 A How do you carry things when you’re cycling?
 B I put everything in my ................................................
4 A Do you like cycling?
 B Yes, but not in the city – I like to go to the mountains and cycle on ................................................ roads.
5 A I was at the match yesterday, too.
 B I know – but there were so many people there, I couldn’t ................................................ you in the crowd.
6 A Why don’t you wear your jeans?
 B Because I washed them this morning and they aren’t ................................................ yet.
7 A We’re going hiking across the grand ................................................ this summer.
 B Don’t get too close to the edge of any ................................................! I don’t want you falling off!
3 Complete the text with the correct form of the words in the box.
spot backpack headquarters dirt road ridge canyon have no signal
Our plan was clear. We wanted to take a walk through a 1 ................................................ in a national park and then climb up to the top for the great views. Each of us had a 2 ................................................ full of food and water and all the stuff you need for a one-day walk. First, we followed a 3 ................................................ and after an hour we 4 ................................................ a small path up the canyon. We were sure that it was a good path up to the 5 ................................................. After three hours of climbing we were lost. We really couldn’t go on, because the path was getting too difficult, and we couldn’t find the way down. We tried to phone our parents, but we 6 ................................................. After another three hours, we heard voices. Two rangers from the park’s 7 ................................................ were there on a training session. We were really lucky. They helped us down and we got back safely.
UNDERSTANDING GRAMMAR
 Present perfect continuous
4 Match the sentences and the pictures.
1 They look tired. They’ve been running for three hours.
 2 He’s been watching TV all night.
 3 He’s only been playing for a month.
 4 He’s been talking on his mobile for an hour.
 5 They’ve been practising this song for a long time.
 6 She’s been dreaming of a new mountain bike for months.
 7 You’ve been chasing cats again!
 8 She’s been waiting for twenty minutes.
Images A–H:
Image A: A girl with closed eyes pointing at a cat that looks guilty beside a broken flowerpot.
Image B: A man with a bald head sitting on a red sofa, eyes wide open, with a glowing TV in front of him.
Image C: A teenage boy wearing a white jersey with the number 14, holding a basketball.
Image D: A man with dark skin in an orange t-shirt talking into a mobile phone with no expression.
Image E: A blonde woman in hiking gear dreaming of a mountain bike shown in a thought bubble.
Image F: Two people playing guitars in front of microphones, performing together.
Image G: A young woman with long blonde hair holding a mobile phone and looking frustrated while glancing at the wall clock.
Image H: Two young people, a boy and a girl, in running gear looking exhausted with sweat marks.
USING GRAMMAR
 Present perfect continuous
5 Put the words in the correct order and write the sentences.
1 raining / all day / has been / It / .
 ................................................................................................. ☐
2 have been / I / presents / for / shopping / .
 ................................................................................................. ☐
3 He / two months / has been / for / as a waiter / working / .
 ................................................................................................. ☐
4 April / has been / She / the two children / since / looking after / .
 ................................................................................................. ☐
5 have been / They / in the doctor’s waiting room / sitting / for an hour / .
 ................................................................................................. ☐
6 have been / three days / I / for the test / to / studying / .
 ................................................................................................. ☐
6 Each sentence here comes after a sentence from 5. Write A–F after the sentences in 5 to match them.
A That’s why you haven’t seen him for a while.
 B That’s why she’s so tired.
 C That’s why they’re so bored.
 D That’s why we haven’t been outside today.
 E That’s why you haven’t seen me online recently.
 F That’s why I haven’t got any money to buy you a coffee.
Pages 94–95
7 Complete the dialogues with the present perfect continuous form of the verbs in brackets.
1 A Why are you so tired?
 B I ................................................ very hard. (work)
2 A Please get off the phone! You ................................................ for almost an hour! (talk)
 B Sorry! Here you are.
3 A Are you angry with me?
 B Yes, I am! I ................................................ for you for an hour! (wait)
4 A You play the piano very well.
 B Thank you. I ................................................ lessons for three years. (take)
5 A How long ................................................ you ................................................ English? (learn)
 B For about two years.
6 A ................................................ you ................................................ in this house for a long time? (live)
 B Yes — since I was born.
8 Right or wrong? Put in a ✔ or ✘.
1 I have known Henry for three years. ☐
 2 We having been walking for hours and I’m tired. ☐
 3 My sister’s been annoying me all morning. ☐
 4 We have been having our dog since last year. ☐
 5 It’s been snowing all day. It looks beautiful outside. ☐
 6 They aren’t at home because they have been going on holiday. ☐
 7 James has been playing the guitar since he was six. ☐
 8 You have been getting the answer to question 3 wrong. ☐
9 Correct the wrong sentences in 8.
......................................................................................................................................................
 ......................................................................................................................................................
 ......................................................................................................................................................
 ......................................................................................................................................................
10 Complete with the present perfect simple or continuous form of the verbs in brackets.
Lisa Hi, Anna, it’s me.
 Anna What? From California?
 Lisa Yeah, so let’s keep it short. Tell everybody I’m fine.
 Anna I will. Where exactly are you?
 Lisa San Francisco.
 Anna Oh. 1 ................................................ (ride) the cable cars?
 Lisa Sure. And John and I 2 ................................................ (walk) around a lot too. The others are just hanging out.
 Anna Right. 3 ................................................ (be) to any other places around San Francisco yet?
 Lisa Well, we 4 ................................................ (see) some great places down south, and we’re planning to go north to a national park tomorrow. We 5 ................................................ (have) a really good time.
 Anna Good. Love to everybody. And Lisa?
 Lisa Yeah?
 Anna 6 ................................................ (buy) the California T-shirts I asked you about?
 Lisa Not yet. I 7 ................................................ (look), but I ................................................ (not find) them yet. But I will.
 Anna OK, thanks. Love you, big sis.
 Lisa Love you too, little sis. Bye.
 Anna Bye.
11 Read Carol’s tips for California.
6 tips for your first trip to California
Millions of visitors go to California every year, and most of them have a great time. However, if you’re a first-time visitor, check out my tips. You might enjoy your trip even more!
1 Remember that California is a big state!
 Driving from north to south without stopping will take you up to 14 hours. So don’t try to do it all in one day. Ideally, you should spend at least two weeks in California, one week in the north, one in the south. And if you have plenty of time, you can spend another full week in the interior*.
2 Think about renting a car.
 It’s OK to get around in the cities without a car, but if you want to go to places outside the cities, to some wild parts of the coast or to the national parks, then it’s better to have a car. If you plan to have a car in the cities, plan lots of time for your journeys. The traffic is very bad there.
3 Go and see the national parks.
 California has nine national parks. The most famous is Yosemite. Take at least a day to explore there. If possible, go to Death Valley and to Redwood National Park, where you can see trees that are more than 2,000 years old. If you want to go to more than two parks, buy a year pass – it’s cheaper.
4 Book in advance online.
 You can be more relaxed if you book your hotels and camping grounds in advance. Looking for a room can take up a lot of your time – time which you want to spend sightseeing or having a good time.
5 Use weekdays for visiting popular spots.
 Plan visits to Disneyland or Hollywood on weekdays. These places will be full of people at weekends. Check out crowd calendars online where you can see the best times to visit.
6 Take your time!
 Once again – take your time to enjoy California. Relax, enjoy the food, spend some time on deserted beaches. For the perfect two-week holiday, take a trip to Northern California, see San Francisco, the Napa Valley and Yosemite in one week. Then take another week to see Los Angeles, Disneyland and San Diego. And then come back next year!
*interior = hier: Landesinnere
Image descriptions:
Top left photo shows Yosemite National Park with cliffs and trees.
Top center photo shows a desert highway leading into Death Valley.
Top right photo shows tall, old trees in Redwood National Park.
Bottom photo shows the Hollywood sign on the hills under a blue sky.
A circular yellow badge on the left contains an image of a woman with curly hair and the text: “CAROL’S TRAVEL BLOG.”
Pages 96–97
12 How many of these tasks can you do?
1 California is very popular with tourists.
 T / F
2 To drive through California from north to south will take you more than a day.
 T / F
3 You should take at least two weeks to visit California.
 T / F
Complete the sentences with no more than 4 words.
4 A car is a big help if you want ...........................................................
 .........................................................................................................................
5 Spend at least a day ...........................................................
 .........................................................................................................................
6 Some redwood trees are more ...........................................................
 .........................................................................................................................
7 Why should you book places to stay in advance?
 .........................................................................................................................
8 What is a crowd calendar good for?
 .........................................................................................................................
9 How does the writer suggest you spend your time in California?
 .........................................................................................................................
13 Listen and check your answers.
14
 A Complete the dialogue with the sentences from the box. Then listen and check.
a Yes, it had 26 rooms. Jack London actually wanted to rebuild it.
 b Like Jack London’s “Wolf House.”
 c He died a few years after the fire.
 d Well, you can only see the ruins of it.
 e Because it burnt down in 1913, weeks before the Londons wanted to move in.
 f It was great. We saw lots of interesting places.
 g That’s right. He wrote White Fang. Remember, we had to read it last year.
Martin How was your California trip?
 Carina 1 ...........................................................
 Martin Like what?
 Carina 2 ...........................................................
 Martin Jack London? The author?
 Carina 3 ...........................................................
 Martin Ah, yes. I remember. So what about “Wolf House”?
 Carina 4 ...........................................................
 Martin Why only ruins?
 Carina 5 ...........................................................
 Martin That sounds like very bad luck. Was it a big house?
 Carina 6 ...........................................................
 Martin Why didn’t he?
 Carina 7 ...........................................................
Image: A large stone ruin in a forest, with an arched entrance and windows, surrounded by trees. The ground is covered in leaves, and the sun is shining from the right.
8 Put the dialogue in the correct order. Then listen and check.
1 ☐ Sharon Did you know that lots of famous people come from California?
 ☐ Sharon He has the same name as you.
 ☐ Sharon Hmm, difficult to choose just one. Dwayne Johnson, maybe?
 ☐ Sharon No, his mother was. He was born in California.
 ☐ Clint My parents named me after him. Who is your favourite actor from California?
 ☐ Clint Yes, I know. Like the film star Clint Eastwood.
 ☐ Clint What? The Rock? I’ve seen him in many films. But I thought he was from Samoa.
 ☐ Clint So he’s only half Californian then.
Image: Dwayne “The Rock” Johnson smiling in a light grey checked suit and purple tie. Background shows a step-and-repeat wall with logos.
15
a Listen. Which of these bridges does Billy cross to get to work?
Image 1: Golden Gate Bridge – iconic red suspension bridge over water with mountains in background.
 Image 2: Bay Bridge – white suspension bridge with blue sky and buildings in background.
☐ Golden Gate Bridge
 ☐ Bay Bridge
b Listen again and choose the correct answer.
1 Billy is in the UK to
  ☐ spend time with his family.
  ☐ do some work for his company.
  ☐ organise his move to San Francisco.
2 How many times does Billy cross the Bay Bridge for work every week?
  ☐ 3 ☐ 4 ☐ 6
3 Why does Anne want to go to San Francisco?
  ☐ to see the Golden Gate Bridge
  ☐ because she’s got friends living there
  ☐ because it always looks good in the films
4 What does Billy like about his journey to work?
  ☐ the roads have little traffic
  ☐ the view
  ☐ the weather
5 Why does Billy never get tired of living in San Francisco?
  ☐ because loads of good bands play there
  ☐ because there’s lots of things to do there
  ☐ because it’s cheap
6 What does Anne want Billy to do?
  ☐ invite her to his house in San Francisco
  ☐ find her work at his company
  ☐ show her some photos of California
Pages 98–99
16 Complete the dialogue with the questions in the box.
a How much is a return with a young person’s railcard?
 b And one last thing. Can we get food on the train?
 c Sorry, just one more thing. What platform does the train leave from?
 d And what’s the next one after that?
 e How long does it take to get there?
 f Excuse me, what time is the next train to Manchester?
 g Can we have two returns, please?
Pauline 1 ................................................................................
 Assistant Let me see. It’s at 10.56.
 Pauline 2 ................................................................................
       ................................................................................
 Assistant 12.42.
 Pauline 3 ................................................................................
 Assistant About an hour and a half. The 12.42 is a bit quicker because you don’t need to change.
 Pauline 4 ................................................................................
 Assistant It’s £13.
 Pauline 5 ................................................................................
 Assistant Certainly. That’s £26.
 Pauline 6 ................................................................................
 Assistant Yes, there is a buffet car.
 Pauline 7 ................................................................................
 Assistant Eight, it’s on the other side of the station.
Image description: A colorful cartoon showing a ticket office at a train station. A woman assistant is behind the glass window marked “Tickets.” In front of the counter are a woman in a purple coat and hat and a man in a green hat and yellow scarf, both holding bags and tickets. There is a red rope barrier, and a sign with a large orange “T” above the counter.
17 Listen and check your answers.
18 Read the task and what a student wrote. What does Caroline want to know about the ticket?
Task
 You’ve been invited to a friend’s holiday cottage. You’re sending her an email (60–80 words) to ask for some information.
In your email, ask:
 ✔ about bus connections
 ✔ about getting a ticket
 ✔ if you have to bring something along
Email
FROM: caro13@mailconnect.com
 SUBJECT: Details please :)
Hi Sarah,
 Thank you for inviting me. I’ve already got the train ticket, but not the bus ticket to your village. Could you let me know how often there are buses and how long it takes? And do I get the ticket on the bus?
 Should I bring my sleeping bag? Is there anything else I can bring with me?
 Looking forward to seeing you.
 Love,
 Caroline
Useful Language
 Asking for information
 • How long does it take ...?
 • How do I get to ...?
 • How far is it ...?
 • Is the walk ...?
 • When does ... leave?
 • How much is a ticket?
 • Can I book it online?
 • Should I bring ...?
 • Do you want me to ...?
 • Do I have to change ... at ...?
19 Now write your own answer to the following task.
Task
 You’ve been invited to your aunt’s new house in the mountains. You’re sending her an email (40–70 words) to ask for some information.
In your email, ask:
 ✔ where exactly her house is
 ✔ how you can get there
 ✔ what kind of clothes/shoes you should bring
[Four dotted lines for writing response]
Page 100
UNIT 11 The Golden State
WORD FILE
 Places and sights in Death Valley
canyon
 dirt road
 ridge
 headquarters (pl)
 to spot sth.
 a dry place
 to have no signal
 backpack
MORE Words and Phrases
#	English	Example sentence	German
1	fabulous	Don’t forget our fabulous national parks.	fabelhaft
2	height	The giant redwood trees can reach heights of more than 100 m.	Höhe
3	capital	Which city is the state capital of California?	Hauptstadt
	independent	California was an independent country for one month in 1846.	unabhängig
	innovation	California is famous for its innovations.	Neuerung, Innovation
	state	There are about 40 million people living in the state of California.	Staat
4	to commute	My mum commuted to the Valley every day.	pendeln
	connection	His internet connection was slow.	Verbindung
	programmer	Your mum works as a programmer.	Programmierer/Programmiererin
7	steep	A canyon is deep with steep sides of rock.	steil
8	to crack	My mouth was dry and my lips began to crack.	aufbrechen; zerbrechen
	four-wheel drive	We need a jeep with four-wheel drive in the desert.	Allradantrieb
	gold digger	Gold diggers were the people trying to find gold.	Goldgräber/Goldgräberin
	gold rush	The California gold rush began in 1849.	Goldrausch
	lip	Her lips were shaking and she started to cry.	Lippe
	mountain range	The valley is situated between two mountain ranges.	Bergkette
	shade (no pl)	I stayed in the shade of a giant rock.	Schatten
	to be situated	Where is Death Valley situated?	liegen, sich befinden
	thirst	A group of gold diggers got lost in the valley and died of thirst.	Durst
9	criminal	Alcatraz was home to some famous criminals.	Krimineller/Kriminelle
	cyclist	On Sundays, the road is only open to cyclists and roller skaters.	Radfahrer/Radfahrerin
	familiar	The Golden Gate Bridge is one of the most familiar sights of San Francisco.	vertraut, bekannt
	ferry	You can take a ferry to Alcatraz Island.	Fähre
	guided	These days you can go on a guided tour to Alcatraz Island.	geführt, geleitet
	to take over	On Sundays, the cyclists and roller skaters take over the street.	übernehmen
🔊	to catch (the train)	They have to go to the platform to catch the train.	(den Zug) erwischen
	information office	If you need help, you can ask someone in the information office.	Informationsbüro, Auskunftsbüro
	railway	The railway service to Manchester is leaving from platform 3.	Zug, Eisenbahn
	totally	You are totally right about this.	total

Image description: Two children wearing backpacks and holding flashlights are inside a canyon cave. They look surprised or startled, with wide eyes, as if they heard or saw something unexpected. The background is a cross-section of canyon rock. Yellow word bubbles highlight the terms: “canyon,” “dirt road,” “ridge,” “headquarters (pl),” “to spot sth.,” “a dry place,” “to have no signal,” and “backpack.” A purple speaker icon labeled “A12” is in the upper left corner.

```

## Output contract

Write `content/corpus/units/g3-u11/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u11",
  "briefBank": "d6e86622941b",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u11.s.present-perfect-continuous",
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
