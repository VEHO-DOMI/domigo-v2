# Grammar generation brief — g2-u06 (MORE! 2, Unit 6)

<!-- domigo:gen grammar g2-u06 bank=37f6ae9948d7 prompt=4b9164076103 -->

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

### `g2u06.s.have-to` — have to / don't have to (have to / don't have to (Notwendigkeit))

Expressing that something is necessary (have to / has to) or not necessary (don't/doesn't have to). Crucially, don't have to is NOT the same as mustn't.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [have-to-necessary]: Use have to / has to + base form to say that something is necessary. Third person singular: has to.
  - DE: Mit have to / has to + Grundform sagst du, dass etwas notwendig ist. 3. Person Einzahl: has to.
  - "You have to wear a helmet!" — "Du musst einen Helm tragen!"
  - "You have to wear a life jacket." — "Du musst eine Schwimmweste tragen."
  - "She has to get up early." — "Sie muss früh aufstehen."
- rule [dont-have-to]: don't have to / doesn't have to = it is not necessary (but you can if you want). This is NOT the same as mustn't!
  - DE: Mit don't have to / doesn't have to sagst du, dass etwas nicht notwendig ist (aber du darfst, wenn du willst). Das ist NICHT dasselbe wie mustn't!
  - "You don't have to wash up." — "Du musst nicht abwaschen."
  - "He doesn't have to wear a uniform." — "Er muss keine Uniform tragen."
- rule [have-to-questions]: Form questions with Do/Does + subject + have to + base form.
  - DE: Fragen bildest du mit Do/Does + Subjekt + have to + Grundform.
  - "Do you have to wear a uniform?" — "Musst du eine Uniform tragen?"
  - "Does she have to get up early?" — "Muss sie früh aufstehen?"

common errors:
- Wrong third-person form: ✗ "She have to go early." → ✓ "She has to go early."
- Negating have to without do-support: ✗ "She hasn't to go." → ✓ "She doesn't have to go."
- Omitting to from have to: ✗ "You have wear a helmet." → ✓ "You have to wear a helmet."

SB box `g2/sb/More 2 SB Unit 6.txt#grammar-1` — have to / don’t have to:
```
You have to wear a helmet!
 You have to wear a life jacket.
 You don’t have to wash up.
Complete the rule with have to or don’t have to.
 Mit 1 "" sagst du, dass etwas notwendig ist.
 Mit 2 "" sagst du, dass etwas nicht notwendig ist.
[Image description: A cartoon showing kids in helmets and life jackets at a camp. A character points at a sign saying “You have to wear a helmet!”]
🔁 Go back to page 48. Check ✓ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m2-u6-have-to-gf-001` [gap-fill, d1]: p="I ___ do my homework before I can play." c="have to" a=["have to"] ds=["has to","must to","have"]
- `m2-u6-have-to-gf-002` [gap-fill, d1]: p="She ___ wear a school uniform every day." c="has to" a=["has to"] ds=["have to","has","haves to"]
- `m2-u6-have-to-gf-003` [gap-fill, d2]: p="You ___ bring your own lunch. The school gives you food." c="don't have to" a=["don't have to","do not have to"] ds=["mustn't","hasn't to","doesn't have to"]
- `m2-u6-have-to-gf-004` [gap-fill, d3]: p="Tom ___ get up early tomorrow. It's a school day." c="has to" a=["has to"] ds=["have to","has","haven't to"]
- `m2-u6-have-to-gf-005` [gap-fill, d4]: p="She ___ clean her room. Her mum already did it." c="doesn't have to" a=["doesn't have to","does not have to"] ds=["mustn't","don't have to","hasn't to"]
- `m2-u6-have-to-gf-006` [gap-fill, d5]: p="We ___ run in the corridors. It's a school rule." c="mustn't" a=["mustn't","must not"] ds=["don't have to","haven't to","not must"]
- `m2-u6-have-to-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="She has to finish her project by Friday." a=["She has to finish her project by Friday."] ds=["She have to finish her project by Friday.","She has finish her project by Friday.","She haves to finish her project by Friday."]
- `m2-u6-have-to-mc-002` [multiple-choice, d3]: p="Which sentence means 'It is not necessary'?" c="You don't have to wear a tie." a=["You don't have to wear a tie."] ds=["You mustn't wear a tie.","You hasn't to wear a tie.","You haven't to wear a tie."]
- `m2-u6-have-to-mc-003` [gap-fill, d5]: p="Choose the correct sentence: The sign says 'No swimming'. You ___." c="mustn't swim here" a=["mustn't swim here"] ds=["don't have to swim here","haven't to swim here","must not to swim here"]
- `m2-u6-have-to-ec-001` [error-correction, d2]: p="Find and fix the mistake: She have to study for the test." c="She has to study for the test." a=["She has to study for the test.","She has to study for the test","has to"] ds=[]
- `m2-u6-have-to-ec-002` [error-correction, d3]: p="Find and fix the mistake: He hasn't to go to school on Saturday." c="He doesn't have to go to school on Saturday." a=["He doesn't have to go to school on Saturday.","He doesn't have to go to school on Saturday","He does not have to go to school on Saturday.","doesn't have to"] ds=[]
- `m2-u6-have-to-ec-003` [error-correction, d4]: p="Find and fix the mistake: You must not forget your homework. It's not necessary." c="You don't have to forget your homework. It's not necessary." a=["You don't have to forget your homework.","You don't have to forget your homework. It's not necessary.","You don't have to forget your homework. It's not necessary","don't have to"] ds=[]
- `m2-u6-have-to-tf-001` [transformation, d3]: p="Your friend is new at school and asks about the rules. Explain: 'We ___ (be quiet) in the library.'" c="have to be quiet in the library" a=["have to be quiet in the library","have to be quiet"] ds=[]
- `m2-u6-have-to-tf-002` [transformation, d4]: p="Your little brother is worried about getting up early on Saturday. Reassure him: 'He ___ (not / come early) — it's the weekend!'" c="doesn't have to come early" a=["doesn't have to come early","does not have to come early"] ds=[]
- `m2-u6-have-to-tf-003` [transformation, d5]: p="You see a 'NO PHONES' sign in class. Tell the new student the rule: 'You ___ (use) phones in class.'" c="mustn't use phones in class" a=["mustn't use phones in class","must not use phones in class","mustn't use"] ds=[]
- `m2-u6-have-to-tr-001` [translation, d3]: p="🇩🇪 Wir müssen um 8 Uhr in der Schule sein." c="We have to be at school at 8 o'clock." a=["We have to be at school at 8 o'clock.","We have to be at school at 8 o'clock","We have to be at school at eight o'clock.","We have to be at school at 8.","We have to be at school by 8 o'clock.","We have to be at school by 8."] ds=[]
- `m2-u6-have-to-tr-002` [translation, d4]: p="🇩🇪 Du musst dein Zimmer nicht aufräumen. Mama hat es schon gemacht." c="You don't have to tidy your room. Mum has already done it." a=["You don't have to tidy your room. Mum has already done it.","You don't have to tidy your room. Mum has already done it","You don't have to tidy your room.","You don't have to tidy up your room.","You don't have to clean your room.","You do not have to tidy your room.","You don't have to tidy your room. Mum already did it."] ds=[]
- `m2-u6-have-to-sb-001` [sentence-building, d1]: p="Put the words in the correct order: to / have / we / early / get up / tomorrow" c="We have to get up early tomorrow." a=["We have to get up early tomorrow.","We have to get up early tomorrow","Tomorrow we have to get up early.","Tomorrow we have to get up early"] ds=[]
- `m2-u6-have-to-mt-001` [matching, d3]: p="Match each situation with the correct expression: 1) It's a school rule — no phones.  2) The bus is free for children.  3) He's the team captain.  4) Saturday is not a school day." c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}"] ds=["a: You don't have to pay.","b: You don't have to go to school.","c: You have to turn off your phone.","d: He has to lead the team."]
- `m2-u6-have-to-qf-001` [question-formation, d4]: p="She has to wear a uniform. Ask about: the uniform rule." c="Does she have to wear a uniform?" a=["Does she have to wear a uniform?","Does she have to wear a uniform"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imagine, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 6.txt -----
Unit 6 Time for adventure
Page 48–49
At the end of unit 6 …
 you know
 ☑ 16 words for places
 ☑ how to use have to – don’t have to
you can
 ☑ describe a picture
 ☑ understand a story about an adventure camp
 ☑ make and suggest plans
 ☑ understand and write an email
VOCABULARY
Places
1 Listen and look. Then write the numbers next to the words.
Image description: A colorful landscape illustration showing natural and man-made features such as mountains, lakes, fields, bridges, towns, and rivers. The following words need to be matched to numbered items in the image:
hill
stars
valley
sea
motorway
town
forest
sun
fields
lake
road
village
mountain
river
moon
beach
[Boxes for ticking each word are present on the left.]
SPEAKING
Describing a picture
2 Work in pairs. Look at the picture above for half a minute. Student B closes the book.
 Ask and answer questions. Then swap roles.
Student A
 Where ’s the
 Where are the
 village?
 sea?
 lake?
 fields?
 …
Student B
 On the right-hand side.
 On the left-hand side.
 In the middle.
 In the top right-hand corner.
 In the bottom left-hand corner.
 Next to the …
SPEAKING
Making and suggesting plans
3 Listen and complete the dialogue.
A Let’s 1 __________________________ on Monday.
 B Canoeing? I’m not sure.
 A Well, you don’t have to come along. I’ll go alone, then.
 B Wait a minute. I think I’ll join you.
 A Great. But bring __________________________! And you have to 2 __________________________ – a life jacket in the boat all the time.
 B Of course. I know that.
4 Work in pairs. Look at the notices and act out dialogues.
A Let’s visit/go/build …
 B … I’m not …
 A Well, you don’t …
 B Wait …
 A Great. But … And you …
Poster Notices:
GO ROCK CLIMBING!
 When: Friday 11 a.m.
 Bring warm clothes and good shoes.
 Read the camp guide carefully.
Build a tree house!
 When: Thursday 3 p.m.
 Don’t be late!
 Bring a hard hat!
Visit the waterfall!
 When: Saturday 2 p.m.
 Don’t be late!
 Wear an anorak near the waterfall.
Go for a picnic!
 When: Sunday 12 a.m.
 Bring your own food and drink!
 Clean up the picnic area after the picnic!
SOUNDS RIGHT
have to
5 Listen and repeat.
A I can’t stay here, I have to go.
 B You have to go? But why?
A I have to move to London!
 B I have to say goodbye.
[Image of a red moving van with boxes.]
LISTENING
6 Listen to Emma and Harry talking about a treasure hunt. Take notes.
Name	When?	What did you find?	Where did you find it?
Emma			
Harry			

Page 50–51
READING
7
 a. Read part 1 of the story. Circle the best summary.
 1 ◯ The story is about animals in the countryside.
 2 ◯ The story is about a girl going to an adventure camp.
 3 ◯ The story is about working in a forest.
b. Read the story.
The Forest of Fear
Part 1
"Look out!" I shouted to my dad as he drove down the hill. There were lots of sheep running through the field and across the road. My dad stopped the car and watched the animals go by.
“We are a long way from the motorway!” he laughed. “Where is the adventure camp?”
 I checked the address on the brochure and looked at the map on my phone again.
 “It’s not far, only 6 kilometres. Just past a small town and through the valley. Then a short drive into a big forest. Hmm … But Dad, I’m not sure about the adventure camp. Maybe it’s not a good idea.”
 He looked at me and smiled. “Dana, you wanted an adventure holiday this summer! I’m sorry I have to work, but this is really the best thing for you. When I was young, I loved adventure camps! You can make new friends, go canoeing, rock climbing, build tree houses in the forest … tell scary stories by the campfire!”
 “But Dad, look at it! It’s called The Forest of Fear! That sounds like the name of a horror film to me,” I said.
 “It’s called The Forest of Fear because you can face your fears*, do something different, learn to be brave! Trust me.” He smiled at me, but I didn’t feel better.
VOCABULARY: face one’s fears = sich seinen Ängsten stellen;
 gate = Gatter, Tor
Part 2
Welcome to The Forest of Fear!
Soon we were in a dark forest and arriving at the camp. There was a huge gate* with a big sign on it: “Welcome to The Forest of Fear!”
There were lots of teenagers carrying big backpacks and talking to the guides. The guides looked very cool in green camouflage clothes and big boots.
 “OK kid,” said Dad. “Look, you don’t have to do all the activities, OK? Just … do what you want. It’s only a few days. Go! Have fun! Love you!”
 I gave him a hug and watched him drive away.
“Hi! Welcome to the camp. Are you Dana?” said a young woman. She had a blonde ponytail and glasses.
 “That’s me!” I said.
“Great! I’m Polly, and I’m one of the guides. Come with me. Here’s your room, and your roommates! This is Alice and Lena.”
 I smiled at the two other girls in the room.
 They were the same age as me and looked friendly. Alice was taller than me and thin with red hair, and Lena was the same height as me, but a lot stronger.
“So! It’s lunchtime soon, and then we are going to build a tree house in the forest, and after that we are going to visit a waterfall by canoe! Sounds good, right?” Polly made it sound quite exciting.
 I chatted to the girls for a while, and they were really nice. The rest of the day was actually fun! The forest was beautiful, and although I wasn’t very good at building a tree house, I really enjoyed canoeing by the waterfall. Most of the other people were cool, although a few of the boys were always trying to show off.
One of them called Bob climbed up to the top of the waterfall and jumped into the lake! He was fine, he swam around for a while and then got out.
 But the guides were absolutely furious!
 They said that we have to follow the rules or go home.
That evening after dinner, we sat around the campfire in the middle of the forest and toasted marshmallows. And that’s when things went strange.
One of the older guides, a man called Peter, stood up. It was very dark and cold in the forest now, and the only sound came from the fire. His face looked very scary in the light from the flames.
“Listen carefully. I want to tell you a story. Once upon a time there was a young shepherd boy who lived in this forest. Every day, he let the sheep go where they wanted! His father told him a hundred times, ‘you have to watch the sheep.’ The boy didn’t care. He wanted to swim and climb trees and play.
One day, he climbed to the top of the waterfall. He wasn’t afraid. He jumped down into the lake! And … he never came out again.
 They say that at night you can hear him … water dripping from his little hands and feet … drip … drip … drip.
 And sometimes he comes up behind you and puts his wet hands on your face!”
Everyone was very quiet. We all listened to the story. What we didn’t know was that all the other guides were standing behind us!
 They had white makeup on and then they suddenly reached around and put their cold wet hands on our faces!!
 Everyone screamed! Especially Bob – the boy who jumped down the waterfall. He ran straight back to his room!
 After a while, we all laughed. It was a clever trick. And after that, everyone followed the rules.
 The Forest of Fear was a pretty cool adventure, so believe it or not, my dad was right!
VOCABULARY: shepherd boy = Hirtenjunge
8 How many of these tasks can you do?
Dana thought it was a great idea to go to the camp. T / F
Dana’s dad hated adventure camps when he was a child. T / F
Dana’s dad wanted her to try all of the activities. T / F
First thing after lunch, Dana and the others
 ☐ went swimming.
 ☐ built a tree house.
 ☐ went canoeing.
The guides were
 ☐ happy with Bob.
 ☐ angry with Bob.
 ☐ confused by Bob.
The shepherd boy loved to
 ☐ look after sheep.
 ☐ listen to his father.
 ☐ play in the forest.
What did the other guides do?
 …………………………………………………………
What did Bob do at the end of the story?
 …………………………………………………………
Why did Peter tell the story?
 …………………………………………………………
Page 52–53
WRITING
10
 Samantha is at a youth camp.
 Read her email to her mum.
 Which paragraph (1, 2 or 3) talks about:
 ◯ what she did yesterday?
 ◯ the rules at the camp?
 ◯ all the different things you can do at the camp?
FROM: sam06@hello.uk
 SUBJECT: Youth camp
Hi Mum,
 1 The camp is really great!
 There are lots of things to do here like football and volleyball, for example.
 We can go horse riding too. We go swimming in the river – it’s fantastic!
 We never get bored.
2 Yesterday I went on a great canoeing trip! We went down the river for two hours and then we had a picnic. Jack, our guide, made a fire and we sang*.
 songs and played games.
3 Everything is great, but of course there are rules.
 We have to go to bed at ten. We have to help in the kitchen. We have to make our beds. But we don’t have to wash up – that’s good.
 I hope you and Dad are well. See you soon.
 Love,
 Sam
*sang – past form of sing (irregular verb)
VOCABULARY: sang – past form of sing (irregular verb)
11 CHOICES
A Imagine you are at the same youth camp as Samantha.
 Write an email to a friend (30–40 words). Write about:
 • what sports you can do
 • what sport you played yesterday
B Imagine you are at a different youth camp. Write an email to your parents (100–120 words).
 Write about:
 • what the camp is like
 • how you like it there
 • what you can do there
 • the rules at the camp
 • what you did yesterday
 • what you are going to do tomorrow
 • what you like best
 • what you don’t like
GRAMMAR
have to / don’t have to
You have to wear a helmet!
 You have to wear a life jacket.
 You don’t have to wash up.
Complete the rule with have to or don’t have to.
 Mit 1 "" sagst du, dass etwas notwendig ist.
 Mit 2 "" sagst du, dass etwas nicht notwendig ist.
[Image description: A cartoon showing kids in helmets and life jackets at a camp. A character points at a sign saying “You have to wear a helmet!”]
🔁 Go back to page 48. Check ✓ with a partner what you know / can do.
Page 53
 THE STORY OF THE STONES 3
 The new girl
🎬 1 Match the sentence halves to complete the summary of episode 2.
 1 ☐ The children tell Sunborn
 2 ☐ The children learn that
 3 ☐ Sunborn tells the children
 4 ☐ Sunborn gives the stones
 5 ☐ The children morph
☐ a. Darkman is alive.
 ☐ b. to the children.
 ☐ c. about their dreams.
 ☐ d. into animals.
 ☐ e. the story of the stones.
2 Look at the picture from episode 3 and say what you can see.
 What do you think happens in this episode?
[Image description: A girl is in a river, looking scared, as a tiger appears to rescue her.]
🎬 3 Watch episode 3 and put the sentences in order to tell the story.
 ☐ The children hear a cry for help.
 ☐ The children talk about their dreams.
 ☐ The children learn the new girl’s name is Gillian.
 ☐ The tiger rescues the girl.
 ☐ Emma morphs and jumps in the river.
 ☐ Daniel thinks it’s a trap.
EVERYDAY ENGLISH
4 Watch episode 3 again. Match the pictures with the expressions.
💬 I’m off now.
 💬 Too late … !
 💬 Poor you!
 💬 Hang on.
[Image descriptions:]
 1 – A boy talking to two girls. Text bubble: “Maybe it’s a trap.”
 2 – A girl looks shocked with a cup in her hand.
 3 – A girl consoles another girl who is holding a pillow.
 4 – A girl is drawing at a desk while another girl leans over her.


----- WB: More 2 WB Unit 6.txt -----
UNIT 6 Time for adventure
Page 45
UNDERSTANDING VOCABULARY** Places
1 Look at the pictures. Tick T (True) or F (False).
Picture 1
 (Numbers 1–8 are labeled on different landscape features in the picture: 1 is the sun in the top right, 2 is the road in the top left, 3 is a lake in the middle, 4 is a town on the left, 5 is a river, 6 is a bridge, 7 is a forest in the bottom left, 8 is a field in the bottom right.)
Picture 2
 (Numbers 9–16 are labeled on features: 9 is the moon in the top right, 10 is the sky, 11 is a mountain in the top left, 12 is a forest in the middle right, 13 is a town near the bottom, 14 is a lake, 15 is a beach, 16 is a road curving near the bottom of the image.)
The sun is in the top right-hand corner of the picture. T ☐ F ☐
The road is in the top left-hand corner of the picture. T ☐ F ☐
The lake is in the middle of the picture. T ☐ F ☐
The fields are on the left-hand side of the picture. T ☐ F ☐
The moon is in the top right-hand corner of the picture. T ☐ F ☐
The forest is on the right-hand side of the picture. T ☐ F ☐
The mountain is in the top left-hand corner of the picture. T ☐ F ☐
The mountain is below the moon. T ☐ F ☐
USING VOCABULARY Places
2 Write the words. Then match the words to the pictures in 1.
wont …………………………………… ☐
 droa …………………………………… ☐
 dfilse …………………………………… ☐
 elavy …………………………………… ☐
 ievrr …………………………………… ☐
 kale …………………………………… ☐
 uns …………………………………… ☐
 nomo …………………………………… ☐
 rtssa …………………………………… ☐
 tferso …………………………………… ☐
 noitaunm …………………………………… ☐
 lihls …………………………………… ☐
 cheab …………………………………… ☐
 awtmroyo …………………………………… ☐
 ase …………………………………… ☐
 vglaleli …………………………………… ☐
Pages 46–47
3 Which word is the odd one out in each group. Give your reason.
1 stars beach moon sun
    beach …………………………………………
    The others are all in the sky.
2 river lake field sea
    …………………………………………………………
3 mountain forest hills moon
    …………………………………………………………
4 river road motorway street
    …………………………………………………………
5 village valley city town
    …………………………………………………………
6 moon motorway mountain sun
    …………………………………………………………
UNDERSTANDING GRAMMAR have to / don’t have to
4 Match the rules on the hotel sign with the sentences.
[Hotel sign reads:]
 Welcome to HAPPY HARRY’S HOTEL!
DOOR LOCKED AT 9 P.M.
LIGHTS OUT AT 10 P.M.
BREAKFAST AT 6 A.M.
NO PETS!
NO HOT WATER
NO FOOTWEAR INSIDE THE HOTEL
☐ You have to leave your shoes outside.
 ☐ You have to go to sleep at ten o’clock.
 ☐ You have to leave your dogs at home.
 ☐ You have to get up early.
 ☐ You have to be in the hotel by nine o’clock.
 ☐ You have to have cold showers.
5 Look at the signs and circle the correct options.
[Image descriptions:]
Red circle with number 18 – nightclub sign.
Cinema sign with mobile phone and red line.
Zoo sign – “MON–FRI £5, SUN FREE”.
Colourful sign: “THIS FRIDAY Wear what you want!!”
“AFTER 10 P.M.” sign – nightclub.
Ride entrance sign with arrow and “TO ENTER”.
You have to / don’t have to be 18 or older to get into the night-club.
You have to / don’t have to turn off your mobile phone in the cinema.
You have to / don’t have to buy a ticket for the zoo on Sundays.
We have to / don’t have to wear our school uniform this Friday.
You have to / don’t have to be quiet after 10 p.m.
You have to / don’t have to be taller than 1 metre to go on the ride.
6 Tick the sentences that are true for you.
☐ I have to do a lot of homework today.
 ☐ I have to see my whole family this weekend.
 ☐ I don’t have to go to school tomorrow.
 ☐ I don’t have to help my mum and dad in the house.
 ☐ I have to go to the dentist’s soon.
 ☐ I don’t have to go to bed early tonight.
 ☐ I have to study for a test this week.
 ☐ I have to get up at 6 a.m. Mondays to Fridays.
USING GRAMMAR have to / don’t have to
7 Complete the sentences with the correct form of (not) have to and the words in the box.
 (Box contains: invite, do, study, take, go, run, eat, be)
1 A I’m really not very hungry.
   B Well, you don’t have to eat everything.
2 A Can you help me make dinner?
   B I’m sorry, but I ………………………………… my homework.
3 A I think there’s a problem with your laptop.
   B I know. I ………………………………… it to the shop.
4 A The bus leaves at 3 p.m. We’ve got lots of time.
   B Good. So we …………………………………
5 A We’ve got a big test tomorrow.
   B Yeah. I ………………………………… a lot tonight.
6 A I don’t really like Colin Wood.
   B Well, it’s your party. You ………………………………… him.
7 A Where’s Mum?
   B Her head hurts. She’s in bed, so you ………………………………… quiet.
8 A Don’t forget you’ve got to see the doctor after school.
   B But I don’t feel ill any more so I …………………………………
8 Match the sentences.
You don’t have to cook.
You have to cook.
We don’t have to run.
We have to run.
John has to study.
John doesn’t have to study.
The children don’t have to tidy their room.
The children have to tidy their room.
a. He already knows everything on the test.
 b. The train leaves in two minutes.
 c. I did it this morning.
 d. I made dinner for you.
 e. There are toys everywhere!
 f. The test is really difficult.
 g. I’m really hungry!
 h. We’ve got lots of time to get to the station.
9 Complete each sentence with your own ideas.
1 You have to get up early. Your train leaves at 6 a.m.
   You don’t have to get up early. It’s Saturday.
2 We have to phone Vicky. ……………………………………………………………………………
   We don’t have to phone Vicky. ……………………………………………………………………………
3 Dad, you have to help me with my homework.
   Dad, you don’t have to help me with my homework. ……………………………………………
4 The children have to walk to school today. ……………………………………………………………
   The children don’t have to walk to school today. …………………………………………………
5 The dog has to stay outside. ………………………………………………………………………………
   The dog doesn’t have to stay outside. ……………………………………………………………………
Pages 48–49
LISTENING
10 a Listen to the story and put the pictures in the correct order.
Note: geocaching: people use their mobile phone or GPS unit to find hidden treasures or objects
[Picture descriptions:]
A: Three people (two children and an adult) start walking near a castle-like building.
B: The group, now on a path, points to something with interest.
C: They are in a forest. One child is holding a phone, the others are looking at it.
D: The group has stopped to look into a book or map.
E: They are crossing a river by jumping across stones.
F: They are in a field of flowers, smiling and searching.
b Listen again and choose the correct answers.
How many people went geocaching?
  ☐ two ☐ three ☐ four
Where did they meet to start their adventure?
  ☐ at Sue’s house
  ☐ at Charlie’s house
  ☐ at the top of the road
Which of these things did they walk through first?
  ☐ a forest
  ☐ two hills
  ☐ some fields
What did they forget to take with them?
  ☐ food
  ☐ water
  ☐ a coat
How far was the treasure inside the forest?
  ☐ 1 km ☐ 500 m ☐ 50 m
What was the last thing they crossed before they got to the treasure?
  ☐ a river ☐ a bridge ☐ a road
VOCABULARY: go geocaching = auf GPS-Schnitzeljagd gehen
11 Write two or three sentences to complete the story in your exercise book.
DIALOGUE WORK & WRITING
Making and suggesting plans
12 CHOICES
A Complete the dialogue with the words in the box. Then listen and check.
(Box: right, tomorrow, picnic, area, drink, bags)
A Let’s go for a picnic 1 ……………………………………!
 B A 2 ……………………………………? Good idea.
 A OK, can you bring some sandwiches? I’ll bring something to 3 …………………………………….
 B Sure.
 A And can you bring some bags?
 B 4 ……………………………………? What for?
 A We need them. We have to clean up the 5 …………………………………… after the picnic.
 B That’s 6 ……………………………………. Good thinking!
[Image: “COME ALONG FOR A PICNIC”]
Friday 2 p.m.
Bring sandwiches and drinks.
Bring some bags – clean up the picnic area after the picnic.
B Put the dialogue in the correct order. Then listen and check.
[Image: “Let’s go ROCK CLIMBING”]
Tuesday 3 p.m.
Wear warm clothes and a good pair of boots.
Wear a climbing helmet all the time!
A Oh, come on. Everyone’s going.
 B Let’s go rock climbing tomorrow.
 A Great. But bring some warm clothes and a good pair of boots. And you have to wear a climbing helmet all the time!
 B Of course. I know that.
 B Rock climbing? I’m not sure.
 B Everyone? Oh, alright. I hope it’s fun.
13 Write similar dialogues for these notices in your exercise book.
[Image: “Let’s go and build a TREE HOUSE”]
Monday 10 a.m.
Get a hard hat from the office and wear it all the time.
[Image: “Let’s go on a picnic”]
Wednesday 1 p.m.
Bring your own food.
Free cola and orange juice
Don’t forget to clean up the picnic area after the picnic.
Pages 50–51
READING
Understanding a story about an adventure
14 Read the story. How many of the tasks below can you do?
Lost in the forest
Jeremy and Scott were best friends. One day Jeremy said, “Let’s go geocaching next weekend.” Scott loved the idea. On Friday, they put some food and some orange juice in a bag. First, Jeremy’s dad took them in his car. They left the town and drove on the motorway for twenty minutes before they came to a smaller road. There were beautiful fields on both sides. They drove through a valley, crossed a river, and when they arrived at a little village, the boys got out of the car and said goodbye to Jeremy’s dad. They walked for half an hour. Then they came to a lake with a beautiful waterfall. The boys had a picnic.
The sun was very hot, so they drank a lot of the orange juice. Then they took out their phones to use the geocaching app and started walking towards the mountains. They hoped to find the cache* soon. But they just couldn’t find it. They walked higher up the mountain and then through a forest for three or four hours. They were tired, hot and hungry. They had very little food and no juice left. Suddenly, their phones didn’t work any more. The battery was dead!
 The two friends started to worry. How could they find their way back now?
They didn’t know what to do, and they got very worried. Suddenly, they heard some voices. It was a group of kids with their guide. They were from a camp not far away. “It’s too late for you to go back now,” the guide said. He had a mobile phone and called Jeremy’s dad. He was very happy to hear that the boys were safe. Jeremy and Scott stayed at the camp for the night. It was a beautiful night – there were lots of stars and the moon was very bright.
VOCABULARY: cache = hier: Versteck
1 Jeremy and Scott were brothers / friends.
 2 They got to the village by car / on foot.
 3 It was a very warm / cold day.
 4 They walked for a long time and then they felt ......................................................
 5 Their phones stopped working because ......................................................
 6 They were worried that without their phones they couldn’t ......................................................
 7 Who did the boys meet up the mountain? ......................................................
 8 Why did the guide use his mobile phone? ......................................................
 9 How do you think Jeremy and Scott felt when they came to the camp? ......................................................
15 Listen and check your answers.
16 Read the notes on the notice board at an adventure camp. Write 1, 2, 3 or 4 next to the sentences.
☐ It’s at the weekend.
 ☐ You have to wear a raincoat.
 ☐ You have to talk to your mother and father first.
 ☐ It starts at the bottom of a mountain.
 ☐ You have to wear a special jacket and a hat.
 ☐ You have to bring things to eat and to drink.
 ☐ You don’t have to bring food and drinks.
 ☐ You have to get up early.
[Notice board images:]
1 COME CANOEING WITH US!
 When: Thursday 7 a.m.
 Meet at the river.
 Wear a life jacket and a helmet in the canoe all the time!
2 Go rock climbing!
 When: Friday 3 p.m.
 Meet at the bottom of Gorse Mountain.
 Get permission from your parents.
 Bring strong shoes.
3 VISIT the waterfalls!
 When: Friday 2 p.m.
 Meet at the river.
 Wear an anorak near the waterfalls.
 Don’t be late!
 Bring your own food and drink.
4 Come for a picnic!
 When: Saturday 1 p.m.
 Meet at the camp gate.
 Free food and drinks.
VOCABULARY: permission = Erlaubnis
WORD FILE
Places
[Illustrated scene with labeled items]
sun (top left in the sky)
sea (blue body of water, left side)
beach (sandy area next to the sea)
town (cluster of buildings, lower left)
motorway (large road with red bridge)
road (smaller roads winding through)
river (winding blue stream through image)
village (small group of houses near fields)
field (yellow and green rectangular areas)
hill (small raised green area)
valley (area between mountains)
lake (blue body of water on the right)
forest (cluster of trees)
mountains (white peaks in the background)
stars (in the sky, top right)
moon (top right, next to stars)
Page 52
At an adventure camp
[Illustrated image of a lively adventure camp scene showing the following labeled elements:]
to build a tree house (top left: children building a tree house on a platform in a tree)
camp (cluster of tents and cabins in the background with children walking)
life jacket (child in a yellow life jacket near the river)
guide (adult with a clipboard and whistle, supervising children)
campfire (children sitting around a campfire, roasting marshmallows)
picnic (two children having a picnic on a blanket, bottom left)
canoe (two children paddling a canoe in the river)
canoeing (label refers to the canoe activity in the river)
waterfall (top right: waterfall cascading from a cliff)
rock climbing (far right: two children climbing a rock wall with helmets and harnesses)
MORE Words and Phrases
2	bottom	The lake is on the bottom left corner of the picture.	unten; unterer/untere/unteres
	left-hand	On the left-hand side there’s a lake.	linker/linke/linkes
	middle	We sat around the campfire in the middle of the forest.	Mitte
	right-hand	On the right-hand side there’s a waterfall.	rechter/rechte/rechtes
4	anorak	Wear an anorak near the waterfall.	Anorak
	hard hat	Wear a hard hat when building a tree house.	Schutzhelm
7	absolutely	The guides were absolutely furious!	völlig, absolut
	actually	The rest of the day was actually fun.	eigentlich; tatsächlich
	adventure camp	The children are going to spend some days at the adventure camp.	Abenteuercamp
	to be afraid (of)	He wasn’t afraid of the ghost.	Angst haben (vor)
	although	I enjoyed it, although I wasn’t good at it.	obwohl
	to care	The boy didn’t care.	sich kümmern
	drive	It was a short drive into the forest.	Fahrt
	gate	There was a huge gate with a big sign on it.	Tor
	to be good at sth.	I wasn’t very good at building a tree house.	etw. gut können, gut in etw. sein
	once upon a time	Once upon a time, there was a young boy who lived in this forest.	es war einmal
	sheep (pl sheep)	There were lots of sheep in the fields.	Schaf
	shepherd	The shepherd boy loved to play in the forest.	Schäfer/Schäferin
	to trust	Follow me! You can trust me.	vertrauen
	while	We chatted with our friends for a while.	Weile
10	to wash up	We don’t have to wash up.	abspülen, abwaschen
S3	alive	Darkman is alive.	lebendig, am Leben
	cry	The children hear a cry for help.	Schrei
	I’m off now.	I’m off now. Bye.	Ich bin jetzt weg.
	Poor you!	Poor you! You look very hungry.	Du Armer!/Arme!

```

## Output contract

Write `content/corpus/units/g2-u06/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u06",
  "briefBank": "37f6ae9948d7",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u06.s.have-to",
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
