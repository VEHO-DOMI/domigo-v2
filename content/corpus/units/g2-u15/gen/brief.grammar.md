# Grammar generation brief — g2-u15 (MORE! 2, Unit 15)

<!-- domigo:gen grammar g2-u15 bank=87dba11ed315 prompt=4b9164076103 -->

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

### `g2u15.s.so-do-i` — So do/have I. - Neither do/have I. (So do/have I. - Neither do/have I. (Zustimmung))

Agreeing with a positive statement (So do/have I.) and with a negative statement (Neither do/have I.), matching the auxiliary of the original statement.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [so-agree-positive]: Agree with a positive statement using So + auxiliary + I.
  - DE: Du verwendest 'so ... do/have ...', um einer positiven Aussage zuzustimmen: So + Hilfsverb + I.
  - "I've got a fear of rats. - So have I." — "Ich habe Angst vor Ratten. - Ich auch."
  - "I think we're going to find something in here. - So do I." — "Ich glaube, wir finden hier etwas. - Ich auch."
- rule [neither-agree-negative]: Agree with a negative statement using Neither + auxiliary + I.
  - DE: Du verwendest 'neither ... do/have ...', um einer negativen Aussage zuzustimmen: Neither + Hilfsverb + I.
  - "I haven't thought of a name for her yet. - Neither have I." — "Ich habe mir noch keinen Namen für sie überlegt. - Ich auch nicht."
  - "I don't really like cats. - Neither do I." — "Ich mag Katzen nicht besonders. - Ich auch nicht."
- rule [match-auxiliary]: The auxiliary must match the first statement: do/does for the present simple, have/has for have got and the present perfect, can for can.
  - DE: Das Hilfsverb muss zum ersten Satz passen: do/does beim Present simple, have/has bei have got und Present perfect, can bei can.
  - "She likes music. - So does he." — "Sie mag Musik. - Er auch."
  - "I can swim. - So can I." — "Ich kann schwimmen. - Ich auch."

common errors:
- Using the wrong auxiliary: ✗ "I've been to Paris. - So do I." → ✓ "I've been to Paris. - So have I."
- Missing inversion: ✗ "I like pizza. - So I do." → ✓ "I like pizza. - So do I."
- Using So with a negative statement instead of Neither: ✗ "I don't like spiders. - So don't I." → ✓ "I don't like spiders. - Neither do I."

SB box `g2/sb/More 2 SB Unit 15.txt#grammar-1` — So do/have I. – Neither do/have I.:
```
Read the examples. A: Rats! No way. I’ve got a fear of rats.
B: So have I.
A: I haven’t thought of a name for her yet.
B: Neither have I.
A: I think we’re going to find something in here.
B: So do I.
A: I don’t really like cats.
B: Neither do I.
Complete the sentences with neither or so. Du verwendest ‘so … do/have …’ um einer positiven Aussage zuzustimmen.
Du verwendest ‘neither … do/have …’ um einer negativen Aussage zuzustimmen.
Comic strip – More fun with Fido! Dog 1: Why doesn’t she clean my bowl?
Dog 2: Why doesn’t he tidy up my basket?
Dog 3: I have to do everything myself.
```

v1 seed items (UNTRUSTED):
- `m2-u15-so-do-i-gf-001` [gap-fill, d1]: p="\"I like pizza.\" — \"So ___ I.\"" c="do" a=["do"] ds=["am","have","can"]
- `m2-u15-so-do-i-gf-002` [gap-fill, d1]: p="\"I can't swim.\" — \"Neither ___ I.\"" c="can" a=["can"] ds=["do","am","don't"]
- `m2-u15-so-do-i-gf-003` [gap-fill, d2]: p="\"She has been to Rome.\" — \"So ___ I.\"" c="have" a=["have"] ds=["do","has","am"]
- `m2-u15-so-do-i-gf-004` [gap-fill, d3]: p="\"Tom doesn't like spiders.\" — \"___ do I.\"" c="Neither" a=["Neither"] ds=["So","Not","Nor not"]
- `m2-u15-so-do-i-gf-005` [gap-fill, d4]: p="\"My sister will travel to Spain.\" — \"So ___ my brother.\"" c="will" a=["will"] ds=["does","is","has"]
- `m2-u15-so-do-i-gf-006` [gap-fill, d4]: p="\"She doesn't have a pet.\" — \"Neither ___ he.\"" c="does" a=["does"] ds=["do","is","doesn't"]
- `m2-u15-so-do-i-mc-001` [multiple-choice, d2]: p="\"I love chocolate.\" — Which response means 'Me too'?" c="So do I." a=["So do I."] ds=["So I do.","Neither do I.","So am I."]
- `m2-u15-so-do-i-mc-002` [multiple-choice, d3]: p="\"I haven't finished the book.\" — Which is the correct agreement?" c="Neither have I." a=["Neither have I."] ds=["So have I.","Neither haven't I.","Neither I have."]
- `m2-u15-so-do-i-mc-003` [multiple-choice, d3]: p="\"She is very tired.\" — Which is the correct agreement?" c="So am I." a=["So am I."] ds=["So do I.","So I am.","So is I."]
- `m2-u15-so-do-i-ec-001` [error-correction, d2]: p="Find and fix the mistake: \"I like football.\" — \"So I do.\"" c="So do I." a=["So do I.","So do I","do I","So do I!"] ds=[]
- `m2-u15-so-do-i-ec-002` [error-correction, d2]: p="Find and fix the mistake: \"I can't ride a bike.\" — \"So can't I.\"" c="Neither can I." a=["Neither can I.","Neither can I","Neither can I!"] ds=[]
- `m2-u15-so-do-i-ec-003` [error-correction, d5]: p="Find and fix the mistake: \"She has visited Paris.\" — \"So do I.\"" c="So have I." a=["So have I.","So have I","So have I!"] ds=[]
- `m2-u15-so-do-i-tf-001` [transformation, d3]: p="Your friend says: 'I enjoy reading.' You feel the same! Agree using 'So... I.'" c="So do I." a=["So do I.","So do I"] ds=[]
- `m2-u15-so-do-i-tf-002` [transformation, d4]: p="Your friend says: 'I won't be at the party.' You can't go either. Agree using 'Neither... I.'" c="Neither will I." a=["Neither will I.","Neither will I"] ds=[]
- `m2-u15-so-do-i-tf-003` [transformation, d3]: p="Your friend says: 'He is tired.' You're tired too! Agree using 'So... I.'" c="So am I." a=["So am I.","So am I"] ds=[]
- `m2-u15-so-do-i-tr-001` [translation, d3]: p="🇩🇪 \"Ich mag Musik.\" — \"Ich auch.\"" c="\"I like music.\" — \"So do I.\"" a=["\"I like music.\" — \"So do I.\"","I like music. — So do I.","I like music. So do I.","I like music — So do I"] ds=[]
- `m2-u15-so-do-i-tr-002` [translation, d4]: p="🇩🇪 \"Ich kann nicht kochen.\" — \"Ich auch nicht.\"" c="\"I can't cook.\" — \"Neither can I.\"" a=["\"I can't cook.\" — \"Neither can I.\"","I can't cook. — Neither can I.","I can't cook. Neither can I.","I cannot cook. Neither can I."] ds=[]
- `m2-u15-so-do-i-sb-001` [sentence-building, d2]: p="Put the words in the correct order: have / so / I" c="So have I." a=["So have I.","So have I","So have I!"] ds=[]
- `m2-u15-so-do-i-mt-001` [matching, d5]: p="Match each statement with the correct agreement response:\n1. \"I love cats.\"\n2. \"I can't drive.\"\n3. \"I have visited Berlin.\"\n4. \"I am hungry.\"\n5. \"I don't like spiders.\"\na. So have I.\nb. Neither do I.\nc. So am I.\nd. So do I.\ne. Neither can I." c="{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"c\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"c\",\"5\":\"b\"}"] ds=[]
- `m2-u15-so-do-i-qf-001` [question-formation, d1]: p="Your friend says: \"I like ice cream.\" You agree. Write your response using 'So... I.'" c="So do I." a=["So do I.","So do I","So do I!"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, America, Americans, Amherst, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Aryan, Asia, Aussage, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carter, Castle, Celsius, Central, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Column, Come, Complimenting, Control, Costa, Croatia, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Every, Excuse, Expressing, Fahrenheit, False, Faye, Feeling, Fido, Fluff, Food, France, Frank, Fred, Freddy, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Grey, Greybeard, Groans, Groats, Guess, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Hayes, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katie, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Lulu, Luna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Mott, Mountain, Mr, Mrs, Ms, Mum, Natasha, Nathan, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ringo, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salma, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Shelter, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Square, States, Station, Steve, Stoke, Sue, Sunborn, Susan, Suzy, Swaton, Tag, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Uros, Vasile, Vicky, Vienna, Volleyball, Walker, Wall, Waterloo, Watson, Way, Welcome, Well, White, William, Willow, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 15.txt -----
Unit 15 Caring for animals
Page 116–117
At the end of unit 15 … you know:
10 words for looking after a pet
how to use do/does + have / and neither do/have I
you can:
talk and ask questions about pets
understand a picture story
say if something is (not) true for you
write a text about your/a pet
VOCABULARY: Looking after a pet
Activity 1:
Listen and look at the pictures. Then number the words.
☐ play with your pet
☐ dry your pet
☐ take your pet to the vet
☐ clean out your pet’s cage
☐ stroke your pet
☐ clean out the litter tray
☐ brush your pet
☐ walk your pet
☐ feed your pet
☐ give your pet a bath
Image descriptions (numbered 1–10): 1 – A person holding and playing with a yellow bird.
2 – Two children walking a dog outside.
3 – Someone cleaning a litter tray with a scoop.
4 – A close-up of a dog being brushed.
5 – A girl feeding a cat.
6 – A person giving a small dog a bath in a sink.
7 – A girl brushing a horse.
8 – A dog at the vet being examined.
9 – A boy petting a kangaroo.
10 – A girl holding and feeding a guinea pig.
Activity 2:
Play a memory game.
Dialogue under image: Girl: What did you do yesterday?
Boy: 5, 2, 9.
Girl: Ah, you fed your pet, you walked your pet and you took your pet to the vet.
Boy: That’s right.
Footer: WB p. 125
CYBER Homework 43 (Revision)
UNIT 15
Page 116
LISTENING & SPEAKING: Talking/Asking about pets
Activity 3:
Listen to the interviews and tick the correct answers.
MEGAN
What is Megan’s pet?
☐ a cat ☐ a hamster ☑ a dog
What colour is she?
☐ black and white ☐ black and grey ☑ black, grey and brown
Where does she sleep?
☑ in Megan’s room ☐ in the bathroom ☐ in the living room
How often does she feed her?
☐ once a day ☑ twice a day ☐ three times a day
How much time a day does she spend on her?
☐ 15 minutes ☐ 50 minutes ☑ 90 minutes
DAVID 6. What is David’s pet?
☐ a cat ☐ a hamster ☑ a dog
What colour is he?
☐ black ☑ brown ☐ black and white
How often does he feed him?
☐ once a day ☑ twice a day ☐ three times a day
How much time a day does he spend on him?
☐ 15 minutes ☑ 50 minutes ☐ 90 minutes
Where does he sleep?
☐ in the hall ☑ in David’s room ☐ in the living room
Activity 4:
Listen to the interviews again and complete the sentences.
Megan doesn’t often …
When Megan does her homework, Princess …
Megan doesn’t like to …
When it rains, David has to …
David’s sister doesn’t …
David plays a lot with Buddy when he …
Activity 5:
Hold interviews. Ask two classmates. Take notes.
QUESTIONS:
Have you got a pet?
What is it?
What colour is it?
How often do you feed it?
Where does it sleep?
How much time a day do you spend on it?
What would you like?
ANSWERS (speech bubble illustration): Yes, I have. A mouse / …
No, I don’t. A …
Activity 6:
Report to the class.
Nathalie has got a … It’s … It sleeps … She feeds it … She spends … minutes on it.
Page 118–119
READING
Activity 7:
Read the picture story. Then listen to it.
A new pet
Image 1: Bob and Alice are sitting on a couch. Bob is speaking. Bob: Do you know what this house needs, Alice?
Alice: What does it need, Bob?
Bob: A pet. This house needs a pet. A pet to keep us company.
Alice: That’s a great idea. Let’s get one.
Image 2: Bob and Alice are outside the Animal Shelter. Alice: “The Animal Shelter”. I think we’re going to find something in here.
Bob: So do I. Something very special to make our house the perfect home.
Image 3: Alice looks at a dog in a kennel. Alice: How about a dog? They’ve got some lovely dogs here.
Bob: Hmm, I’m not too sure. Think of the mess they make and the noise. Then we need to take them for walks …
Alice: Yes, that’s a good point. Let’s look at the cats.
Image 4: Bob and Alice looking at a cat. Bob: Cats. They’re cleaner than dogs, but they’re not very good company. I don’t really like cats.
Alice: Neither do I. Let’s forget about cats and look for something else.
Bob: Let’s go to the pet shop.
Image 5: Close-up of a rat behind glass. Bob: “The Perfect Pet”. The best pet shop in town. What are these?
Alice: Rats! No way. I’ve got a fear of rats.
Bob: So have I. There’s no way I want a rat in the house.
Image 6: Alice suggests a budgie. Alice: What about a budgie? They’re easy to look after and they’re great company.
Bob: No. I don’t really like the idea of birds in cages. Birds need to fly.
Image 7: Bob suggests a snake. Bob: Snakes. Hmm. Interesting. They’re easy to look after, for sure. And they’ll keep the house safe. Nobody’s going to break into a house with a snake like this in it. It’s going to need a big glass cage, but we’ve got lots of space in the living room.
Alice: No way! I’m scared of snakes.
Bob: So what are we going to get, Alice?
Alice: Come with me. I think I’ve got the perfect pet for us.
Image 8: Alice and Bob look at a fishbowl. Bob: A goldfish. Perfect.
Alice: Isn’t it beautiful?
Bob: I haven’t thought of a name for it yet.
Alice: Neither have I. But we’ve got all day to think of one.
Activity 8:
Read the picture story again and answer the questions.
Why does Bob say they need a pet?
Why doesn’t Bob want a dog?
Why don’t Bob and Alice want a cat?
Why don’t Bob and Alice want a rat?
Why doesn’t Bob want a bird?
Why does Bob think a snake might be a good idea?
A SONG 4 U
Activity 9:
Listen and sing.
Getting a pet
We’ve got to get a pet,
something for our home.
We’ve got to get a pet.
Don’t want to be alone.
Shall we get a cat?
Or shall we get a dog?
Shall we get a snake?
Or shall we get a frog?
Hmmmmmmmmmmm …
A dog is too much work.
A cat is much too proud.
A snake is far too dangerous.
A frog is much too loud.
We’ve got to get a pet …
Shall we get a bird?
Or shall we get a rat?
Or shall we get a goldfish?
What do you say to that?
Hmmmmmmmmmmmm …
Bird in a cage? No way!
I’ve got a fear of rats.
I’d really love a goldfish.
So would the neighbours’ cats.
We’ve got to get a pet …
Pages 120–121
READING
Activity 10:
Read the story.
The story of Happy Feet
In June 2011, some people found an emperor penguin on a beach in New Zealand. It was really unusual because there are no emperor penguins in New Zealand. The penguin was more than 2,500 kilometres from home! Penguins are excellent swimmers, but that’s a very long way to swim, even for a penguin.
The people saw that the penguin ate sand. They also saw that the bird was quite sick. Why did he eat sand? Because the poor bird thought it was snow.
They took the penguin to the zoo in Wellington, the capital of New Zealand. They called the emperor penguin “Happy Feet”. Happy Feet soon became a star. Lots of people wanted to see him. At the zoo they fed Happy Feet fish and after some months Happy Feet was fine again. They decided to take him back home. They fixed a transmitter to the bird and put him on a ship. They took him about 600 kilometres south. Then they said goodbye to him and put him in the sea to swim home.
But what happened to Happy Feet? After five days there was no signal from the transmitter any more. Did he get home? Did a shark eat him? We will never know.
Vocabulary: transmitter = Sender
Did you know?
The emperor penguin is the tallest and heaviest of all penguins. They can be 120 cm tall and weigh up to 45 kilos. They eat fish and other small animals that live in the Antarctic Ocean.
Activity 11:
How many of these tasks can you do?
The penguin wasn’t a very long way from home. T / F
Penguins often swim more than 2,500 km. T / F
The penguin wasn’t well. T / F
The penguin ate sand because he …
The penguin stayed …………………………………………. for a while.
Before they let Happy Feet go, they …………………………………………. on him.
Where did they release Happy Feet? ………………………………………….
What happened to Happy Feet? ………………………………………….
How are emperor penguins different from other penguins? ………………………………………….
Activity 12:
Check your answers with a partner. Then listen to the story.
WRITING: CHOICES
Activity 13:
Read the texts. Then write your own text.
Text A:
I haven’t got a pet. We live in a flat and my parents always say no. I’d like a dog. My parents say dogs are a lot of work, but I don’t think so. One of my friends has got a dog. He doesn’t spend a lot of time on it. We sometimes play with it in the park.
Text B:
My pet is a rat. He’s brown and his name is Fluff. I often play with Fluff. He likes it when I put him inside my shirt. Some of my friends are scared of Fluff. When I take Fluff out of my shirt or jacket, they scream. I don’t understand that. I clean the cage every second day and I put in clean water twice every day. At night, Fluff sleeps in his cage. When I get up at the weekend, I put him in the pocket of my pyjamas. Then I go into the kitchen and hug my mum. When she feels Fluff, she screams.
GRAMMAR
So do/have I. – Neither do/have I.
Read the examples. A: Rats! No way. I’ve got a fear of rats.
B: So have I.
A: I haven’t thought of a name for her yet.
B: Neither have I.
A: I think we’re going to find something in here.
B: So do I.
A: I don’t really like cats.
B: Neither do I.
Complete the sentences with neither or so. Du verwendest ‘so … do/have …’ um einer positiven Aussage zuzustimmen.
Du verwendest ‘neither … do/have …’ um einer negativen Aussage zuzustimmen.
Comic strip – More fun with Fido! Dog 1: Why doesn’t she clean my bowl?
Dog 2: Why doesn’t he tidy up my basket?
Dog 3: I have to do everything myself.


----- WB: More 2 WB Unit 15.txt -----
UNIT 15: Caring for animals
Page 125
UNDERSTANDING VOCABULARY: Looking after a pet
1. Match the pictures and the phrases. Write numbers.
☐ take your pet to the vet
☐ feed your pet
☐ stroke your pet
☐ brush your pet
☐ give your pet a bath
☐ clean out the litter tray
☐ dry your pet
☐ clean out your pet’s cage
☐ play with your pet
☐ walk your pet
Image descriptions (numbered 1–10):
Girl cleaning a litter tray with a scoop while cat watches
Girl standing in front of veterinary sign, holding her pet
Girl cleaning out a small animal’s cage
Girl hugging and stroking her dog
Girl giving a bath to a pet
Girl drying her pet with a towel
Dog running to food bowl labeled “Buzz”
Girl playing with her dog and a ball
Girl walking her dog on a leash
Girl brushing her dog’s fur
USING VOCABULARY: Looking after a pet
2. Look at the pictures and complete the sentences.
Images 1–6 show a girl named Robin caring for her pet in different ways:
Robin is .......... stroking .......... her pet.
Robin is .......................................... her pet.
Robin is .......................................... her pet’s cage.
Robin is .......................................... her pet.
Robin is .......................................... her pet.
Robin is .......................................... her pet to the vet.
Page 126–127
UNDERSTANDING GRAMMAR: So do/have I. – Neither do/have I.
3. Match the sentences.
I’ve got a big family. ☐ So have I. It was really easy.
I love horror films. ☐ Neither have I. I’m scared I’ll fall off.
I don’t want to go to bed. ☐ So do I. I’m the goalie.
I haven’t got a pet. ☐ Neither do I. I’ve just had a big sandwich.
I don’t feel hungry. ☐ So have I. I’ve got eight brothers and sisters.
I’ve never ridden a horse. ☐ Neither do I. I’m not tired.
I’ve just finished my homework. ☐ So do I. I love getting scared.
I play football for the school team. ☐ Neither have I, but I’d really like one.
USING GRAMMAR: So do/have I. – Neither do/have I.
4. Complete with have or do.
A I haven’t got a mountain bike.
B Neither __________ I.
A I’ve already eaten lunch.
B So __________ I.
A I speak Spanish.
B So __________ I.
A I don’t like chocolate.
B Neither __________ I.
A I play the piano.
B So __________ I.
A I haven’t seen Bob.
B Neither __________ I.
5. Complete the dialogues with the sentences in the box. So do I. – So have I. – So have I. – Neither do I. – Neither have I. – Neither have I.
A I really like punk rock music.
B .................................................................................................
A I’ve got a problem.
B .................................................................................................
A I haven’t seen this film yet.
B .................................................................................................
A I’ve already done my homework.
B .................................................................................................
A I don’t want to go to school today.
B .................................................................................................
A I haven’t got any money.
B .................................................................................................
6. Complete the dialogues. Begin with So or Neither.
A I live in Austria.
B so do I.
A Daniel has got ear pods.
B .................................................................................................
A I don’t know what to do.
B .................................................................................................
A I’ve never been to Paris.
B .................................................................................................
A I want to go home.
B .................................................................................................
A I’ve lost my homework.
B .................................................................................................
7. Write So ... I or Neither ... I next to the statements. Then decide which are also true for you and compare with a partner.
I love football.
☐ ..................................................................................
I read a lot of magazines.
☐ ..................................................................................
I think hip-hop is great.
☐ ..................................................................................
I haven’t been to England.
☐ ..................................................................................
I’ve got a pet.
☐ ..................................................................................
I don’t like art.
☐ ..................................................................................
I haven’t got a mountain bike.
☐ ..................................................................................
I’ve met a famous person.
☐ ..................................................................................
8. Complete the cartoons so the animals agree.
Image descriptions:
Two dogs. First says, “I love this park.” → second replies: ...........................................................
Two parrots on a perch. First says, “I’ve been here before.” → second replies: ...........................................................
Kangaroo with joey. First says, “I don’t want to leave home.” → second replies: ...........................................................
Two camels in the desert. First says, “I haven’t drunk anything for weeks.” → second replies: ...........................................................
Two snakes. First says, “I’ve just eaten.” → second replies: ...........................................................
Crocodile in dentist chair. First says, “I hate going to the dentist.” → second replies: ...........................................................
Page 128–129
DIALOGUE WORK: Talking/Asking about pets
9. Complete the dialogue with the sentences in the box. Then listen and check.
Yes, their names are Clever and Smart.
Yes, two rats.
No, they sleep in a box in my room.
Yes, that’s right.
No. When I come home from school, we play for half an hour.
Yes, they do. Sometimes they come to sleep in my bed.
Dialogue:
Interviewer: Have you got a pet, Ruby?
Ruby: 1 ............................................................
Interviewer: Rats?
Ruby: 2 ............................................................
Interviewer: So your rats are very intelligent.
Ruby: 3 ............................................................
Interviewer: Do the rats sleep in a cage?
Ruby: 4 ............................................................
Interviewer: Don’t they run around at night?
Ruby: 5 ............................................................
Interviewer: Do you spend a lot of time with them?
Ruby: 6 ............................................................
10. Read the interview and write the questions. Then listen and check.
Prompts for questions:
How often do you feed it?
What does it eat?
Where does it come from?
Is it a difficult pet to keep?
And where does it live?
What colour is it?
Interview: My pet (Image of a green chameleon)
Interviewer: You’ve got an unusual pet. Tell us more about it.
Amira: It’s a chameleon.
Interviewer: Wow, a chameleon. 1 ............................................................
Amira: It’s usually green, but when it gets angry it changes colour to red. It can change colour to orange and yellow, too. But I don’t know why.
Interviewer: 2 ............................................................
Amira: No. It’s quite easy really. I mean you don’t have to give it a bath or anything like that. You just have to give it food and clean its glass tank once a week.
Interviewer: 3 ............................................................
Amira: Just once a day.
Interviewer: 4 ............................................................
Amira: Insects and things like that.
Interviewer: 5 ............................................................
Amira: In a big glass tank. It’s about two metres high and one metre wide. It’s got a tree in it.
11. Read the interview again and circle T (True) or F (False).
You can only find chameleons in Madagascar. T / F
Amira’s chameleon changes to red when it’s angry. T / F
His chameleon doesn’t need a bath. T / F
Amira cleans the tank every day. T / F
The chameleon eats insects. T / F
The chameleon lives in a tree in the garden. T / F
READING & WRITING: Understanding/Writing a text about pets
12. Think of the story A new pet on pages 118–119 in your Student’s Book. Match the reasons for and against the pets Bob and Alice go to see.
Pets	Reasons for/against
1. dogs	☐ Bob is afraid of them.
2. cats	☐ They shouldn’t be kept in cages.
3. rats	☐ They make too much mess.
4. bird	☐ They’re the perfect pet.
5. snakes	☐ They’re not great company.
6. goldfish	☐ Alice is really afraid of them.

13. What do you think these people are saying? Write sentences.
Image descriptions:
Girl with puppy at vet’s: .....................................................................................................
Girl and vet smiling at puppy: .....................................................................................................
Girl and mum looking at goldfish in a tank: .....................................................................................................
Mum smiling at daughter: .....................................................................................................
Girl with boy looking at guinea pig in pet shop: .....................................................................................................
Boy with girl commenting: .....................................................................................................
Girl looking at large rabbit: .....................................................................................................
Boy beside girl with bird: .....................................................................................................
Page 130–131
CHOICES
A. Read the text and answer the questions.
Norman the dog
Norman is a Labrador. He is blind. He lived in a dog sanctuary*. One day, Annette came and gave Norman a home. On a sunny day, Annette and Norman were on the beach. The beach is the only place where Norman can run freely. Suddenly, Norman started running. He heard something. Nobody else could hear it. It was a girl calling for help. Norman jumped into the sea. He found the girl and pulled her back to the beach. A blind dog saved a girl’s life.
VOCABULARY: *sanctuary – Tierheim
What sort of dog is Norman? ..................................................
Why is the beach the only place where he can run freely? ..................................................
What did Norman hear? ..................................................
What did he do? ..................................................
B. Read the texts and put the sentences in the correct places.
☐ 1 He called for an ambulance.
☐ 2 Lulu knew something was wrong.
☐ 3 They arrived and solved the problem.
☐ 4 But Ringo didn’t want to go outside on his own.
Ringo the cat
Ray and Carol were in bed. Both of them had headaches and they were very tired. Their cat Ringo wanted to go outside, so Carol got up and opened the door. He looked at Carol. She understood this look and followed him into the garden. Ringo started digging and Carol smelt gas. She called the gas company. ☐ The company told Ray and Carol that the gas leak* was very dangerous. Ringo saved their lives.
VOCABULARY: *gas leak – undichte Stelle in einer Gasleitung
Lulu the pig
Sue has an unusual pet called Lulu. Lulu is a pig. One day, Sue went away for a few days and her mother JoAnn went to Sue’s house to look after Lulu.
Suddenly, JoAnn had a heart attack* and fell on the floor. ☐ She ran into the street and sat in the middle of the road to stop the cars. A car stopped. The driver followed the little pig into the house and found JoAnn on the floor. JoAnn was taken to hospital. The little pig saved her life.
VOCABULARY: *heart attack – Herzanfall
15. Write a short story about a clever animal or pet (80–100 words). Finish the story with the words ... saved my life.
16. a. Read the text. What type of text is it? ☐ a film review ☐ a summary of a film ☐ an advertisement* for a film
A Dog’s Way Home
A Dog’s Way Home is a 2019 family adventure film based on the 2017 book of the same name by W. Bruce Cameron. It’s about Lucas and his friend Olivia, who live in Denver, Colorado. One day, they find a young dog. Lucas names the dog Bella and takes her home. But a neighbour doesn’t like Lucas and the dog. He tells an animal control officer (Chuck) that Bella is a pit bull. Pit bulls aren’t allowed in the city. The next day, Chuck takes Bella to an animal shelter. Lucas gets her back and takes her to the animal shelter, but he sends Bella to Olivia’s aunt and uncle in Farmington, New Mexico. Bella misses Lucas and starts a 400-mile-journey* home. This journey will take her two and a half years. On the way, she has many adventures. She rescues a man with a heart problem, helps a friend with a homeless old man out of the snow, and has to fight other animals. Finally, she gets home.
The film cost $18 million and earned $80.7 million worldwide.
A critic said: “It’s a good dog movie with its heart in the right place,” and gave it 4 out of 5 stars.
VOCABULARY: *advertisement – Werbung; be allowed – erlaubt sein; journey – Reise; avalanche – Lawine
b. Read the text again. How many of these tasks can you do?
The film is based on a book. T / F
Lucas and his friend find a dog. T / F
Lucas takes the dog home and calls her Olivia. T / F
Why is Bella not allowed to stay in Denver? ..................................................
Where does Lucas send her? ..................................................
Why does Bella go on her journey? ..................................................
Bella covers 400 miles in ..................................................
Bella spends some time with ..................................................
Chuck can’t take ..................................................
17. Listen and check your answers.
LISTENING: Understanding an interview about pets/animals
18. Listen to the interview with Dr Laura Bushnell about dogs and how they can find their way home. Then answer the questions.
What’s the average distance a dog can find its way home? ..................................................
How do most dogs find their way home? ..................................................
How many per cent (%) of dogs find their way home by landmarks*? ..................................................
When is it not very easy for a dog to find its way home? ..................................................
How do dogs find their way home over long distances? ..................................................
VOCABULARY: *landmark – Denkmal, Wahrzeichen; depend on – von etw. abhängen; explanation – Erklärung
Page 132
WORD FILE: Looking after a pet
Image Descriptions:
A boy is kneeling and pouring food into a bowl next to a dog. (to feed your pet)
A girl is cleaning a litter tray while a cat watches. (to clean out the litter tray)
A boy is holding an open cage and cleaning inside it. (to clean out your pet’s cage)
A girl is throwing a toy while a dog jumps in the air. (to play with your pet)
A girl is using a towel to dry a wet dog. (to dry your pet)
A girl is stroking a large dog lovingly. (to stroke)
A boy is brushing a cat. (to brush)
A boy is walking a dog on a leash. (to walk your pet)
A girl is holding a cat while talking to a vet. (to take your pet to the vet)
A boy is giving a bubbly bath to a dog sitting in a tub. (to give your pet a bath)
MORE Words and Phrases
	Word or Phrase	Example Sentence	German Translation
1	cage	My snake lives in a big glass cage.	Käfig
	litter tray	I have to clean out the cat’s litter tray.	Katzenklo
	vet (veterinarian)	My cat is sick. I should take her to the vet.	Tierarzt/Tierärztin
7	to have got a fear of	She’s got a terrible fear of snakes.	Angst haben vor
	to keep sb. company	A pet can keep us company.	jdm. Gesellschaft leisten
	Neither do I.	She doesn’t like dogs. Neither do I.	Ich auch nicht.
	So do I.	They like pizza. So do I.	Ich auch.
	space	We don’t have enough space to keep a dog.	Platz; Raum
10	Antarctic Ocean	Penguins eat fish that live in the Antarctic Ocean.	Antarktischer Ozean
	emperor penguin	The emperor penguin is the biggest penguin of all.	Kaiserpinguin
	to release	Where did they release the penguin?	befreien, frei lassen
11	sand	The penguin was trying to eat sand.	Sand
13	pyjamas	He wears striped pyjamas in bed.	Pyjama, Schlafanzug
F	to tidy (up)	Why doesn’t he tidy up my basket?	aufräumen

```

## Output contract

Write `content/corpus/units/g2-u15/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u15",
  "briefBank": "87dba11ed315",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u15.s.so-do-i",
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
