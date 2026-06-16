# Grammar generation brief — g3-u12 (MORE! 3, Unit 12)

<!-- domigo:gen grammar g3-u12 bank=6732fa924d08 prompt=4b9164076103 -->

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

### `g3u12.s.passive-voice` — Passive voice (present and past simple) (Passiv (Gegenwart und Vergangenheit))

The present simple passive (am/is/are + past participle) and past simple passive (was/were + past participle), used when the action or the thing it happens to matters more than who does it. The doer can be named with by. This unit has no SB grammar box; the structure comes from the v1 seed.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [present-passive]: Form the present simple passive with subject + am/is/are + the past participle. Use it when the action or object matters more than who does it.
  - DE: Das Gegenwartspassiv bildest du mit Subjekt + am/is/are + Partizip Perfekt. Du verwendest es, wenn die Handlung oder das Objekt wichtiger ist als der Handelnde.
  - "English is spoken in many countries." — "Englisch wird in vielen Ländern gesprochen."
  - "The letters are delivered every morning." — "Die Briefe werden jeden Morgen zugestellt."
- rule [past-passive]: Form the past simple passive with subject + was/were + the past participle, for a completed passive event in the past.
  - DE: Das Vergangenheitspassiv bildest du mit Subjekt + was/were + Partizip Perfekt, für ein abgeschlossenes passives Ereignis in der Vergangenheit.
  - "The city was destroyed by an earthquake." — "Die Stadt wurde durch ein Erdbeben zerstört."
  - "Hundreds of people were rescued." — "Hunderte Menschen wurden gerettet."
- rule [by-agent]: Name the doer with by, but only when it adds important information; leave it out if the doer is unknown or unimportant.
  - DE: Den Handelnden nennst du mit by, aber nur wenn er wichtige Information hinzufügt; lass ihn weg, wenn er unbekannt oder unwichtig ist.
  - "The book was written by J.K. Rowling." — "Das Buch wurde von J.K. Rowling geschrieben."
  - "The window was broken." — "Das Fenster wurde zerbrochen."

common errors:
- Using the wrong past participle (base form or past simple): ✗ "The house was build in 1960." → ✓ "The house was built in 1960."
- Omitting the form of be from the passive: ✗ "The city destroyed by an earthquake." → ✓ "The city was destroyed by an earthquake."
- Using from instead of by for the agent: ✗ "The city was hit from an earthquake." → ✓ "The city was hit by an earthquake."

v1 seed items (UNTRUSTED):
- `m3-u12-passive-voice-tf-003` [transformation, d5]: p="You're writing a paragraph for English class about why English is important. Write: 'English ________ (speak) in more than 50 countries and it ________ (use) in international business.'" c="is spoken ... is used" a=["is spoken ... is used","is spoken, is used"] ds=[]
- `m3-u12-passive-voice-gf-020` [gap-fill, d1]: p="Pizza ___ (eat) all over the world." c="is eaten" a=["is eaten"] ds=["are eaten","is eat","was eaten"]
- `m3-u12-passive-voice-gf-021` [gap-fill, d1]: p="These cars ___ (make) in Germany." c="are made" a=["are made"] ds=["is made","are make","were made"]
- `m3-u12-passive-voice-gf-022` [gap-fill, d2]: p="The school ___ (build) in 1965." c="was built" a=["was built"] ds=["were built","is built","was build"]
- `m3-u12-passive-voice-gf-023` [gap-fill, d3]: p="Millions of emails ___ (send) every day." c="are sent" a=["are sent"] ds=["is sent","are send","were sent"]
- `m3-u12-passive-voice-gf-024` [gap-fill, d4]: p="The Olympic Games ___ (hold) every four years. The last ones ___ (hold) in Paris." c="are held ... were held" a=["are held ... were held"] ds=["is held ... was held","are held ... are held","were held ... were held"]
- `m3-u12-passive-voice-gf-025` [gap-fill, d5]: p="Thousands of trees ___ (plant) in the park last spring. Now new flowers ___ (plant) there every year." c="were planted ... are planted" a=["were planted ... are planted"] ds=["was planted ... is planted","were planted ... were planted","are planted ... were planted"]
- `m3-u12-passive-voice-mc-020` [multiple-choice, d2]: p="Which sentence is in the passive voice?" c="Cheese is produced in many countries." a=["Cheese is produced in many countries."] ds=["Many countries produce cheese.","People make cheese in many countries.","They eat a lot of cheese in France."]
- `m3-u12-passive-voice-mc-021` [multiple-choice, d3]: p="Which sentence correctly uses the past simple passive?" c="The Eiffel Tower was built in 1889." a=["The Eiffel Tower was built in 1889."] ds=["The Eiffel Tower is built in 1889.","The Eiffel Tower were built in 1889.","The Eiffel Tower was build in 1889."]
- `m3-u12-passive-voice-mc-022` [multiple-choice, d4]: p="Choose the correct passive sentence: 'Millions of litres of water ___ every day.'" c="are used" a=["are used"] ds=["is used","are use","were used"]
- `m3-u12-passive-voice-ec-020` [error-correction, d2]: p="Find and fix the mistake: Rice are grown in Asia." c="is grown" a=["is grown","Rice is grown in Asia.","Rice is grown in Asia"] ds=[]
- `m3-u12-passive-voice-ec-021` [error-correction, d3]: p="Find and fix the mistake: The first computer was invent in the 1940s." c="was invented" a=["was invented","The first computer was invented in the 1940s.","The first computer was invented in the 1940s"] ds=[]
- `m3-u12-passive-voice-ec-022` [error-correction, d4]: p="Find and fix the mistake: These songs is listened to by millions of people." c="are listened" a=["are listened","These songs are listened to by millions of people.","These songs are listened to by millions of people"] ds=[]
- `m3-u12-passive-voice-tf-020` [gap-fill, d3]: p="You are writing a report about your school. Rewrite in the passive: 'They clean the classrooms every evening.' → The classrooms ___." c="are cleaned every evening" a=["are cleaned every evening"] ds=["is cleaned every evening","were cleaned every evening","clean every evening"]
- `m3-u12-passive-voice-tf-021` [transformation, d4]: p="You are telling someone about old buildings. Rewrite in the passive: 'They built this castle 500 years ago.' → This castle ___." c="was built 500 years ago" a=["was built 500 years ago"] ds=[]
- `m3-u12-passive-voice-tr-020` [translation, d3]: p="Translate into English: 'In Österreich wird viel Schokolade gegessen.'" c="A lot of chocolate is eaten in Austria." a=["A lot of chocolate is eaten in Austria.","Lots of chocolate is eaten in Austria.","In Austria, a lot of chocolate is eaten."] ds=[]
- `m3-u12-passive-voice-tr-021` [translation, d4]: p="Translate into English: 'Dieses Lied wurde 2020 geschrieben.'" c="This song was written in 2020." a=["This song was written in 2020.","This song was written in 2020"] ds=[]
- `m3-u12-passive-voice-sb-020` [sentence-building, d2]: p="Put the words in order: spoken / English / is / in / many / countries" c="English is spoken in many countries." a=["English is spoken in many countries.","English is spoken in many countries"] ds=[]
- `m3-u12-passive-voice-sb-021` [sentence-building, d3]: p="Put the words in order: were / the / letters / sent / yesterday / all" c="All the letters were sent yesterday." a=["All the letters were sent yesterday.","All the letters were sent yesterday"] ds=[]
- `m3-u12-passive-voice-mt-020` [matching, d3]: p="Match each active sentence with its passive form. 1: They grow coffee in Brazil. 2: Someone stole my bike yesterday. 3: People speak Spanish in Mexico. 4: They invented the telephone in 1876. 5: They recycle paper at our school." c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"e\",\"4\":\"a\",\"5\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"e\",\"4\":\"a\",\"5\":\"c\"}"] ds=["a: The telephone was invented in 1876.","b: Coffee is grown in Brazil.","c: Paper is recycled at our school.","d: My bike was stolen yesterday.","e: Spanish is spoken in Mexico."]
- `m3-u12-passive-voice-cp-020` [context-picker, d2]: p="You are reading a factsheet about your town. Which sentence fits a factsheet style?" c="The town hall was built in 1820." a=["The town hall was built in 1820."] ds=["Someone built the town hall in 1820.","They built the town hall in 1820.","A builder built the town hall in 1820."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrew, Andy, Angeles, Anger, Animal, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, Dungeon, During, Earthlings, East, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fido, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lamarr, Lane, Language, Lara, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Marvel, Mary, Matt, Matterhorn, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oxford, Paige, Palace, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ranjit, Rashmi, Raukani, Really, Recherche, Red, Redwood, Reihenfolge, Renato, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Royal, Ruby, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Smith, Sophia, Sophie, Sound, South, Southeast, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Turnham, Tussauds, Uhr, Um, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Will, William, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 12.txt -----
Unit 12 Natural disasters
Pages 100–101
At the end of unit 12 ...
 you know
 9 words for natural disasters
 7 phrases to talk about fire safety
 how to use the present and past simple passive
you can
 understand a documentary
 understand a factual text about volcanoes
 understand a magazine article about disasters
 understand a radio interview
 explain your choices
 write a message/story about survival
▶ Teen Talk 6
1 a Watch the video. What does it tell you?
 ☐ facts about avalanches  ☐ how to survive an avalanche  ☑ both
 (Image: Photo of a snowy mountain slope with a red sign saying "CLOSED avalanche danger.")
b Watch again. Choose the correct option.
1 Austria / Switzerland has the most avalanches in Europe.
 2 Every year in Switzerland, around 20 / 25 houses are destroyed by avalanches.
 3 In January 2017, a hotel / school was hit by an avalanche in Rigopiano in Italy.
 4 If you are in an avalanche, you should start shouting / swimming.
VOCABULARY: research – Forschung, Recherche
2 Work in pairs. How many of the facts and tips in the video can you remember?
 Tell your partner.
▶ VOCABULARY
 Natural disasters
3 Write the words under the pictures.
 Then listen and check.
 an earthquake an avalanche a volcanic eruption
 a flood a drought a tsunami
 a forest fire a mudslide a hurricane
1 __________________
 2 __________________
 3 __________________
 4 __________________
 5 __________________
 6 __________________
 7 __________________
 8 __________________
 9 __________________
 (Images from left to right:
 1 – Earthquake ruins of collapsed building,
 2 – Flooded street with water halfway up house walls,
 3 – Collapsed snowy slope with avalanche damage,
 4 – Dry cracked earth,
 5 – Mud-covered road with fallen trees,
 6 – Giant wave crashing toward land,
 7 – Lava spewing from volcano,
 8 – Burnt forest and smoke,
 9 – Cyclone hurricane cloud.)
▶ READING
 4 Read the text about volcanoes.
ALL YOU NEED TO KNOW ABOUT ... VOLCANOES
So what exactly is a volcano?
 A volcano is often (but not always) a mountain. It is an opening in the Earth’s crust and often has a crater at the top. A volcano also has a hole running down through it to a pool of magma under the surface of the Earth. Think of it as a gateway to the centre of the Earth!
Why do volcanoes erupt?
 Inside the volcano there is a lot of gas and this gas creates a lot of pressure. An eruption happens when the pressure becomes too much and the gases force their way out through the crater. This causes a huge explosion and huge rocks are thrown into the sky. Lava is sent down the sides of the mountain, destroying everything that gets in its way. The power of a volcano is enormous. For example, an eruption of Mount St Helen’s in 1980 had the power of 500 atom bombs – and that wasn’t a very big eruption.
How many volcanoes are there in the world?
 It’s impossible to know because many volcanoes are under the sea, but on Earth there are about 1,500 that have erupted sometime over the last 10,000 years. Most of these are now dormant, which means they aren’t expected to erupt very soon. But there are also between 50–70 volcanoes that are active every year.
What is the world’s biggest volcano?
 Mauna Loa in Hawaii is the world’s biggest volcano. It is formed by layers and layers of dried lava and is more than 4,000 m high. It is also one of the world’s most active volcanoes and has erupted 39 times since 1843. The last eruption was in 2022. The largest volcano in our solar system is Olympus Mons on Mars although it is now extinct.
DID YOU KNOW ... ?
 The word volcano comes from the Roman god of fire. He was called Vulcan.
 Early man thought that volcanoes were punishment from the gods. About 280,000 people have been killed in volcanic eruptions over the last 400 years.
 In 1963, an undersea volcano erupted to form the world’s newest land mass – Surtsey island off the coast of Iceland.
 (Image: Lava erupting from a volcano crater; side info graphic labeled "DID YOU KNOW...?" in a burst circle.)
WORDS YOU NEED TO KNOW
magma – melted rock found inside volcanoes
 lava – magma that is thrown out of a volcano in an eruption and runs down the side of the mountain
 crater – the top of the volcano
 dormant volcano – a volcano that hasn’t erupted for a long time
 extinct volcano – a volcano that no longer has eruptions
▶ 5 Complete the sentences with one or two words.
1 A volcano is a mountain which is open at the …………………………… .
 2 Huge rocks …………………………… into the sky.
 3 Lava …………………………… down the sides of the mountain.
 4 Many volcanoes are under the …………………………… .
 5 Many volcanoes on Earth are now …………………………… so they won’t erupt soon.
 6 One of the world’s …………………………… volcanoes has erupted 39 times since 1843.
 7 The …………………………… volcano in our solar system is on Mars.
 8 Over the last 400 years, about 280,000 people have died as a consequence of …………………………… .
Pages 102–103
6 Look at the text quickly and decide what type of text it is.
 ☐ adventure story  ☐ magazine article  ☑ news report  ☐ letter
Great disasters of the modern world
In January 2010, the island of Haiti was hit by a terrible earthquake.
 It measured 7.0 on the Richter scale, with 52 aftershocks* measuring 4.5 or greater. About 230,000 people were killed, 300,000 were injured and over a million people were made homeless. Approximately 300,000 homes and buildings were destroyed. It was the worst earthquake in the history of Haiti.
 The damage caused by the earthquake was even worse than the one in Türkiye and Syria in 2023, where about 60,000 people lost their lives altogether and which was 7.8 on the Richter scale.
Throughout the summer of 2019/20, a large part of Southeast Australia was burnt down by bushfires. The fires burnt mainly from September 2019 to March 2020. They couldn’t be controlled for a long time. That is why the fires were called a megafire, and the period was called the Black Summer.
 All in all, 338,000 km² were destroyed. Hundreds of people were rescued from the fire and were evacuated by air. But 34 people were killed by the fires, and more than 3,500 people lost their homes.
 The disaster cost billions of dollars. The smoke from the fires drifted* more than 11,000 kilometres and was seen in countries as far away as Chile and Argentina. Finally, the situation became better when a third of the fires were extinguished* by the heavy rains in February 2020.
The southwest of the USA has been hit by long periods without rain. The so-called “southwestern North American megadrought” began in 2000 and is still ongoing. The regions that are affected* by it reach from North Mexico to California, and include the areas of Colorado and the Colorado River. This means that Lake Mead, the largest reservoir in the United States, is affected too.
 Scientists say climate change could make the situation a lot worse.
 Many people are suffering from the consequences. Often, farmers are hit by severe water cuts. Near the Mexican border with North America, fights over water have led to violent conflicts several times. It is feared that such water wars are only the beginning of what could happen in the future in other parts of the world too.
VOCABULARY:
 aftershock – Nachbeben
 drift – treiben
 extinguish – auslöschen
 affect – betreffen, beeinflussen
(Image 1: Rescue workers and citizens walk through rubble and destruction after the 2010 Haiti earthquake.)
 (Image 2: Burnt trees and blackened landscape near a rural house in Australia after a bushfire.)
 (Image 3: A drastically low water level in Lake Mead, USA, showing exposed canyon walls.)
▶ 7 Read the text carefully. Circle T (True) or F (False). Then listen to the text and check.
1 A lot of people lost their lives in the Haiti earthquake, and even more were injured. T / F
 2 The earthquakes in Türkiye and Syria were stronger than the one in Haiti. T / F
 3 Almost all of Southeast Australia was burnt down by bushfires in 2019/20. T / F
 4 During the megafire, a lot of people were rescued by planes and helicopters. T / F
 5 The water level in Lake Mead has been the same since 2000. T / F
 6 Experts believe that the droughts could be made worse by violent conflicts. T / F
▶ 8 Read and complete with away / near / under.
What to do in an EARTHQUAKE
1 If you are INDOORS
 ☑ Stay inside so you don’t get injured by falling glass or parts of buildings.
 ☑ Keep away from windows and from heavy furniture that might fall over.
 ☑ Get down onto the floor.
 ☑ Get ……………………… a strong desk, table or other piece of furniture. Hold on to it.
2 If you are OUTDOORS
 ☑ Go to an open space.
 ☑ Keep ……………………… from buildings and power lines.
3 If you are DRIVING
 ☑ Stop and stay inside your car.
 ☑ Try not to stop ……………………… buildings or under trees and power lines.
▶ LISTENING
9 Listen and find out how Sally and Tom survived an earthquake. Complete the sentences.
1 Sally was getting breakfast ready when ………………………………………………………………………
 2 She looked out of the window and saw ………………………………………………………………………
 3 When the big earthquake happened, she ……………………………………………………………………
 4 She shouted and some men came. They ……………………………………………………………………
 5 Tom was on his way ……………………………………………………………………………………………
 6 He stopped his car and …………………………………………………………………………………………
 7 He ran as fast as he could until he ……………………………………………………………………………
 8 When he came back to the car, ………………………………………………………………………………
Pages 104–105
▶ READING
 10 Read the first part of the story.
Castaway
 Chuck worked for a worldwide delivery company in the USA. It was his job to get the really important parcels to their addresses. He often had to travel many kilometres with these parcels across land and sea so he could safely deliver them to the places written on them.
One fateful night, Chuck was travelling with parcels on one of the company’s planes when disaster struck. The plane got caught in the middle of a huge tropical storm. There was nothing the pilot could do as the plane fell from the night sky into the ocean below.
Chuck woke up. He was lying on a golden sandy beach. His body was covered in cuts and bruises. His clothes were wet and torn. For a while, he remembered nothing, but then his memories came back. He remembered the plane hitting the water and breaking in two. He remembered seeing the island at night in the light of the flashes of lightning in the sky. He remembered swimming towards the island. He remembered how he was almost dying as he was climbing over the rocks.
The first few hours were full of hope. He hoped maybe the pilot was also somewhere on the island. He hoped that a rescue party was on its way. He was happy to be alive. There were a few parcels from the plane on the beach. Chuck didn’t open them. He still hoped to deliver them unopened one day. But as the hours turned into days, the hope slowly disappeared. When the dead body of the pilot washed up on the beach, all he could do was bury his friend in the sand. There was no rescue plane coming. Chuck was on his own.
Now he had to use all his energy to survive. He had to learn how to make fire. It took him days. When he finally saw some flames, he laughed with joy. He couldn’t just sit around and wait for water. He had to learn how to catch fish. It took him days and when he finally caught one, he cried with happiness. He built himself a shelter from the rain, he built himself a bed from coconut tree leaves. He didn’t want to die on this island and he did everything he could to survive.
 One day, he decided to open the parcels.
 There was little in them – just clothes and a volleyball with ‘Wilson’ written on it.
 Chuck looked at the ball. Using ash from the fire he drew a mouth and two eyes on it. Now Chuck had a friend. His name was ‘Wilson’. There was still one parcel left.
 ‘Anna Bracebridge, Jacksonville, USA,’ the address on it said. Chuck was not sure why, but he decided to leave it unopened.
As the years went by, Chuck got so used to the island that he knew it as well as he knew his hometown. And Chuck got used to ‘having conversations’ with Wilson. In his imagination, the volleyball wasn’t a ball any more, he was a person. So Wilson heard all about Chuck’s life back in the USA. He heard all of Chuck’s dreams for the future. He shared Chuck’s hopes when occasionally a ship passed by far away on the horizon. He shared his sadness as the ship disappeared.
Then one day, Chuck woke up and he knew he could stay on the island no longer. He had to get back home even if it killed him. From now on he spent every day building a raft from pieces of wood he found on the island. He took his time. After a few months, he was finally happy with his work. He picked up ‘Wilson’ and placed him on the raft. He put the unopened parcel next to him. Chuck pushed the raft into the water and jumped on.
(Image: Illustration of Chuck sitting on the beach next to a volleyball with a face drawn on it. There is a raft and parcel nearby.)
▶ 11 How many of these tasks can you do?
1 Chuck was on the aeroplane for work.  T / F
 2 Chuck didn’t know how he got to the island.  T / F
 3 At first, Chuck thought he wouldn’t be on the island for very long.  T / F
Complete the sentences with no more than 4 words.
4 Chuck wasn’t ……………………………………… he didn’t open the last parcel.
 5 Sometimes Chuck saw ships in the distance but ……………………………………… .
 6 Chuck used ……………………………………… to build his raft.
7 What do you think happens next?
 8 Why do you think Wilson was so important for Chuck?
 9 How would you spend your time if you were a castaway? ………………………………………………………………………………
▶ 12 Check your answers with a partner. Then listen to the story.
▶ 13 Discuss what you think happened next. Then listen to the end of the story.
▶ LISTENING & SPEAKING
 Explaining choices
14 Listen to the radio programme. Write down the things Tom Newman chooses.
Radio 1
 7.00–7.30 p.m.: Castaway Choices.
 Every week, Janice Jones asks a famous star to imagine spending a year on a small island. Guests are allowed to take four things with them that they really like. The guest in the studio this week is actor Tom Newman from The Bad and the Beautiful.
1 song – ……………………………………………
 2 film – ……………………………………………
 3 book – ……………………………………………
 4 special thing – …………………………………
▶ 15 Listen again and match the things in 14 with his reasons for taking them.
	song	film	book	special thing
1 It makes me feel happy.   ☐  ☐  ☐  ☐				
2 It makes me feel that I’m at home.   ☐  ☐  ☐  ☐				
3 It’s got lots of practical advice on how to survive.  ☐  ☐  ☐  ☐				
4 It’s really interesting. ☐  ☐  ☐  ☐				

▶ 16 Work in pairs. Choose your items for Castaway Choices and interview each other.
What (film) are you going to take?
 I want / I’m going to / I’d like to take (Star Wars) because …
• it always makes me feel happy.
 • I never get tired of (watching) it.
 • it’s my favourite (film).
 • it’s a moving (film).
Pages 106–107
▶ VOCABULARY
 Fire safety
17 Match the words to the sentences.
1 Smoke detectors
 2 Escape route
 3 Fire drills
 4 Meeting place
 5 Check doors
 6 Crawl low
 7 Stop, drop & roll
☐ Decide on a place to meet after leaving the house.
 ☐ Feel the door – if it’s hot, don’t open it.
 ☐ Get under the smoke – crawl on your hands and knees to the nearest exit.
 ☐ Plan two ways to get out of every room.
 ☐ What you do if your clothes are on fire.
 ☐ Check the batteries and change them.
 ☐ Practise the escape plan again and again.
18 Read and complete the sentences with the words from the box. There is one extra word.
hole  emergency  smoke detectors  running  drop  crawl  missing  practise  matches
Fire safety
🔥 Don’t play with 1 ………………………………… and lighters.
 🔥 Install 2 ………………………………… on every floor and in the sleeping areas of your home. They can save lives.
 🔥 In case of fire don’t 3 …………………………………. Go outside!
 🔥 To escape during a fire: Fall & 4 …………………………………. It is easier to breathe in a fire if you stay low while getting out.
 🔥 If your clothes are on fire: Stop, 5 ………………………………… & roll until the fire is out. Shout for help, but don’t run. Running makes a fire burn faster.
 🔥 Have an escape plan and 6 ………………………………… it with your family.
 🔥 NEVER go back into a burning building for any reason. If someone is 7 …………………………………, tell the firefighters.
 🔥 Know your local 8 ………………………………… number.
(Image: Two firefighters using a hose to extinguish a fire inside a building. A second image shows a firefighter rescuing a child from water.)
▶ DIALOGUE WORK
19 Listen and repeat.
1 A My camping holiday was a disaster.
  B Why?
  A My tent was blown away by the wind.
2 B My trip to Italy was a disaster.
  A Why?
  B The flight was cancelled.
20 In pairs, have similar conversations.
 1 trip to the restaurant / food burnt
 2 picnic / forest fire started
 3 canoe trip / canoe hit a rock and sank
 4 shopping trip / wallet stolen
▶ WRITING
 21 CHOICES
A Someone has just survived an earthquake and is writing a message to a friend about it. Write that message (60–80 words). In your message, say:
• when and where the earthquake happened
 • where you were and what happened to you
 • how you survived and what you saw around you
B Write a story about someone who survived an earthquake (120–180 words). Use some of these words to help you.
 to escape  to rescue  to crush  to shake  safe  to crack  to collapse
▶ GRAMMAR
 Passive
How to use it: You use the passive to express what is or was done to an object or to a person. It is not important (or not clear) who does/did the action.
How to form it:
 subject + be + past participle
Present simple passive
 Huge rocks are thrown into the sky.
 Lava is sent down the sides of the mountain.
Past simple passive
 A large part of Southeast Australia was destroyed.
 Hundreds of people were evacuated.
If you want to mention who does or did the action, use by + object.
 Haiti was hit by a terrible earthquake.
(Image: A cartoon of a footballer with a speech bubble: “And the winning goal was scored by ... ME!”)
🔁 Now go back to page 100. Check ✅ with a partner what you know / can do.


----- WB: More 3 WB Unit 12.txt -----
UNIT 12 Natural disasters
Page 101
UNDERSTANDING VOCABULARY
 Natural disasters
1 Match the pictures and the sentences.
Images:
A: A volcano erupting, with bright red lava coming out of the crater.
 B: A large avalanche of snow descending down a mountain.
 C: A huge tsunami wave crashing into rocks.
 D: A man crouching under a desk, covering his head.
 E: A muddy slope with fallen trees and soil, indicating a mudslide.
 F: A forest on fire, with flames and smoke rising over the trees.
Sentences:
During a forest fire, people often have to leave their homes.
There was a mudslide and it covered half of the village.
If there’s an earthquake, it’s a good idea to lie under a desk or table.
In an avalanche, an airbag might save your life.
Keep away from a volcano if you know it’s going to erupt.
During a tsunami, buildings near the coast are in great danger.
USING VOCABULARY
 Natural disasters
2 Complete the sentences with words for natural disasters.
There was a terrible ................................................ last night in Japan. It measured 7.2 on the Richter scale.
Last year was the worst ................................................ ever. Many animals died because they didn’t have any water.
We aren’t going skiing next weekend. There’s a warning that there might be ................................................ .
After the ................................................ , many houses were under water.
It was difficult to put out the ................................................ because of the strong winds. The helicopters weren’t allowed to take off.
After the ................................................ , everything was covered in water and it took weeks for the water level to go down.
UNDERSTANDING VOCABULARY
 Fire safety
3 Unscramble the missing words.
(kosme) ................................................ detectors
escape (turoe) ................................................
fire (Ilsrid) ................................................
(etignem) ................................................ place
(ccekh) ................................................ doors
(wrlac) ................................................ low
Stop, (prod) ................................................ & (lolr) ................................................ .
Pages 102–103
USING VOCABULARY
 Fire safety
4 Use expressions from 3 to complete the mini-dialogues.
1
 A How do I escape a fire?
 B One important thing is: ................................................
 It’s easier to breathe when you’re on the floor.
2
 A Check out this corridor.
 B Why?
 A In case of fire we have to walk down here. It’s our ................................................
3
 A Sir, when we hear the fire alarm, where do we go?
 B You should know that the ................................................ is behind the sports field.
4
 A Did you hear? Jenny’s house caught fire last night.
 B Yes, luckily the ................................................ rang, so they were all able to get out of the house safely.
5
 A What happens if my clothes catch fire?
 B The best thing you can do is ................................................
 And shout for help.
UNDERSTANDING GRAMMAR
 Passive (present and past)
5 Decide if the sentences are active or passive.
1 The hurricane destroyed thousands of homes. ☐ Active ☐ Passive
 2 The hotel was hit by a mudslide. ☐ Active ☐ Passive
 3 He was paid a lot of money for the rescue operation. ☐ Active ☐ Passive
 4 We aren’t very happy with our room. ☐ Active ☐ Passive
 5 Fights over water have led to lots of conflicts. ☐ Active ☐ Passive
 6 The people were evacuated by helicopter. ☐ Active ☐ Passive
USING GRAMMAR
 Passive (present and past)
6 Complete the text with the correct form of the verbs in the present simple passive.
Text in leaflet-style box:
How a new MEGASTAR is found!
 Read this leaflet carefully – you could be the megastar in our reality show
3 AGAINST THE JUNGLE!
 Complete the entry card on the back and send it to us.
Tell us why you think you could be a SUPERSTAR
All the cards 1 ................................................ (read) by our jury.
 25 young people 2 ................................................ (choose).
 They 3 ................................................ (invite) to our studio. They
 4 ................................................ (ask) to show how fit they are in front of a camera. Their performance 5 ................................................ (film).
 Then the film 6 ................................................ (watch) by the members of our jury. It’s that easy. Send in this card — and you could become a new MEGASTAR!
 A week later, each of the final 10 young people
 7 ................................................ (ask) to do some difficult tasks in front of a lot of people. Then the 3 winners
 8 ................................................ (choose) by these people — and the winner could be YOU!
7 Read the report by Mariangela Melata. Complete with past passive forms.
At three o’clock, the people of Chiuso 1 ................................................ (wake) by an earthquake. I 2 ................................................ (throw) out of my bed and in a few minutes most of my apartment 3 ................................................ (destroy). I ran out into the streets. Many of the buildings around me 4 ................................................ (damage) and most of the windows 5 ................................................ (break). The main street 6 ................................................ (block) by two fallen trees. During the day, all the shops 7 ................................................ (close).
8 Write sentences for the pictures. Use the past simple passive.
1 worm* / eat / bird
 The worm was eaten by the bird.
 2 football / hit / girl
 ........................................................................................................................
 3 race / win / boy
 ........................................................................................................................
 4 dinner / make / Dad
 ........................................................................................................................
5 house / destroy / earthquake
 ........................................................................................................................
6 boys / chase / dog
 ........................................................................................................................
7 plane / delay / fog
 ........................................................................................................................
8 glass / break / cat
 ........................................................................................................................
VOCABULARY: worm = Wurm; delay = aufhalten, verzögern
9 Complete the text with the past passive form of the verbs in the box.
Box:
 damage injure close take treat kill destroy
In yesterday’s avalanche, two people 1 ................................................ and eight
 2 ................................................ and
 3 ................................................ to hospital.
 They 4 ................................................ for shock and some cuts. One ski lift
 5 ................................................ and a small hut*
 6 ................................................ .
 The ski lifts
 7 ................................................ for the rest of the day.
VOCABULARY: hut = Hütte
Pages 104–105
10 Read the newspaper article.
Super typhoon Yolanda*
 In 2013, South East Asia – especially the Philippines – was hit by Super Typhoon Yolanda. Yolanda was one of the deadliest typhoons ever, with winds of more than 300 km/h. At least 6,300 people were killed in the Philippines alone. Here is what a young girl tells us about surviving the typhoon.
Image description (top left): Map of the Philippines with red stars marking Manila and Tacloban. A large white spiral (typhoon) is seen over the ocean.
 Image (top right): A photo of damaged houses and streets, showing debris and destruction.
 Image (bottom right): A wrecked coastal area with wooden ruins and brown water filled with debris.
My name’s Reyna, and I was 12 when our home near Tacloban was hit by the typhoon. Tacloban is 580 km southeast of Manila, and back in 2013 much of it was destroyed by Yolanda. Luckily, our family survived.
We heard about the typhoon on the radio, but we weren’t really worried. “Another typhoon,” Dad said, “but it won’t be so bad.”
When it started, we were knee-deep in water. My sister said we should go to our friend’s house. We were running and the water was getting higher. “We’d better go back!” said my brother. We ran back, but the water was rising fast and people are screaming.
We were having breakfast when suddenly the wind blew stronger and stronger. After one or two minutes, the windows broke and we could see sea water that covered the house of our neighbour below us. Later we learnt the wind speed was more than 300 kilometres per hour.
Then the roof of our house went. The wind just lifted it off. Then we heard a loud bang and tiles started flying through the room. I saw one cut my brother’s leg.
My dad shouted, “We have to get out!” He opened the door, but water came in and pushed him to the ground. Then the front door broke and we all fell into the water. I got lost. Someone came back and helped me up, but it was getting more and more difficult to walk. So my two brothers and my little sister, and me and my mum, had to crawl uphill. Our friend was waiting up there to help us into his “two-storey” house.
Our neighbour’s house was new, so we were well protected by its walls, but the road was gone too.
We were all cold and wet, but we were safe. In the afternoon, the winds died and the sun was out, but we could see the effects of the disaster all around us. There was no electricity, and there was also the danger of gangs breaking into homes. We were all lucky, and nothing happened to us. But we knew that not everybody was so lucky.
VOCABULARY: typhoon = Taifun; two-storey = zweistöckig
11 How many of these tasks can you do?
1 Yolanda had winds of more than 380 km/h.
 T / F
2 Reyna lived near the city of Tacloban.
 T / F
3 The family weren’t worried, because every year only one typhoon hits the country.
 T / F
4 First, Dad suggested they
  ☐ stayed inside.
  ☐ climbed onto the roof.
  ☐ got the car to drive away.
5 The windows broke,
  ☐ and the doors broke too.
  ☐ but the water didn’t get in.
  ☐ and a huge wave covered the neighbour’s house below.
6 Dad told them
  ☐ to go up the hill to the neighbour’s house.
  ☐ to climb onto the roof.
  ☐ to shout for help.
7 How did they go up the hill?
 ........................................................................................................................
8 What was good about the neighbour’s house?
 ........................................................................................................................
9 What were two of the effects of the typhoon?
 ........................................................................................................................
12 Listen and check your answers.
13 Listen to Sharon’s story about an earthquake. Put the events into the correct order.
Image: Photograph of San Francisco skyline under a clear blue sky with tall modern buildings and the bay in the background.
☐ They were relaxing at the hotel.
 ☐ Sharon crashed into her dad and her nose started to bleed.
 ☐ She was glad she didn’t live in San Francisco.
 ☐ Suddenly the room began to shake.
 ☐ An English girl, Sharon, and her family were staying in a hotel in San Francisco.
 ☐ Then the room shook again and they all rushed to the doorway.
 ☐ She also said they should stand in a doorway if there was another earthquake.
 ☐ Later she checked the internet and read that there were around 387 earthquakes a year.
 ☐ Then a painting fell on her ankle.
 ☐ The receptionist told them it was an earthquake.
Pages 106–107
14
 A Complete the dialogue with the sentences from the box. There are two extra sentences. Then listen and check.
a We’re going there to learn some survival skills.
 b We’ve never been to Rio.
 c Well, for example, how to build a hut, how to make a fire, how to fish with a bamboo spear,* how to find water and so on.
 d Sure, what’s the question?
 e That’s right. Dad and I are going to a jungle camp in the Amazon.
 f I’d like that too.
 g I don’t need them here, obviously. But they’re good skills for life.
Fatima Hi, Joel. I hear you’re going to Brazil?
 Joel 1 ............................................................................................................
 Fatima Really? To do what?
 Joel 2 ............................................................................................................
 Fatima What kind of survival skills?
 Joel 3 ............................................................................................................
 Fatima That’s quite a lot you have to learn. But I’ve got one question.
 Joel 4 ............................................................................................................
 Fatima Why do you need these survival skills here in Oxford?
 Joel 5 ............................................................................................................
VOCABULARY: bamboo spear = Bambusspeer
8 Put the dialogue in the correct order. Then listen and check.
☐ Dad Come on, Rose. We have to leave right away.
 ☐ Dad They say the fire is getting closer. We must all evacuate.
 ☐ Dad That’s right. It might burn down.
 ☐ Dad Because I just got a phone call from the police.
 ☐ Rose So we’re in real danger. OK, let’s leave now.
 ☐ Rose So they want us to leave our lovely holiday cottage?
 ☐ Rose What now? Why?
 ☐ Rose What did they say?
15 Read the task and what a student wrote. What was the climber’s mistake?
Task
 Imagine you got caught in an avalanche. Write the story of what happened (120–150 words).
 In your story, say:
 ✔ where you were and who was with you
 ✔ why the avalanche happened
 ✔ how it affected you
 ✔ how you were rescued
 ✔ what happened afterwards
Image: A photograph of the Matterhorn mountain with a clear blue sky and snow-covered peak.
Text:
There were four of us, and we climbed the Matterhorn up the ‘normal route’, past the ‘Hörnli­grat’. We were all good climbers and the sun shone, so we thought it would be no problem. When we were up at around 4,000 metres, we took a brief rest. I put my rucksack down, but I made the mistake of putting it too far away from me and it started sliding down. I tried to grab it and suddenly I slid down too. I only stopped after about a hundred metres, but everything seemed OK.
As I tried to climb back up, the snow broke away under me and it started an avalanche. It was not a big one, but it carried me away and soon I was under the snow – how deep, I didn’t know. There was a small pocket of air next to my face, and I was able to shout, but nobody heard me. I breathed hard and I felt very dizzy.
After what seemed an eternity*, a hand reached down to my face, and a few minutes later, my friends dug me out of the snow. It turned out my right arm was broken. That was the end of my Matterhorn dream.
VOCABULARY: eternity = Ewigkeit
Language tip: Narrative tenses
 We usually use past forms to tell stories. We use past simple to describe most of the action, but don’t forget to use the past continuous to:
• set the scene
 • describe an action happening at a certain time
 • describe a longer action that is interrupted by a short action
16 There are six cases in the text where the past continuous would be better. Replace the past simple forms with the past continuous ones.
was breathing was shining was sliding
 was trying were climbing were digging
Writing tip: Writing a story (2) – Adding drama
• Try and use dramatic vocabulary, e.g. grab (not hold), huge or enormous (not very big).
 • Use repetitions (He hoped that … And he hoped that … And he also hoped that …).
 • Check your story develops in a logical way.
 • If possible, put in something unexpected/surprising/dramatic …
 • Use good introductory words to your sentences. Do not only use and, but, also.
17  Now write your own answer to the following task.
Task
 Imagine you were in a boating accident. Write a story about it (120–150 words).
 In your story, say:
 ✔ where you were and who was with you
 ✔ why the accident happened
 ✔ what happened to you / the others
 ✔ how you were rescued
 ✔ what happened afterwards
[Five dotted lines for writing]
Page 108
WORD FILE
Natural disasters
 drought
 earthquake
 hurricane
 volcanic eruption
 mudslide
 avalanche
 forest fire
 tsunami
 flood
Fire safety
 fire drill
 escape route
 smoke detector
 meeting place
 to check doors
 to crawl low
 to stop, drop & roll
MORE Words and Phrases
#	English	Example sentence	German
TT6	research	A lot of money is spent on the research of avalanches.	Forschung, Recherche
	to be trapped	If you are trapped in an avalanche, no one can hear you.	gefangen sein, festsitzen
4	pressure	The gas inside a volcano creates a lot of pressure.	Druck
	surface	There’s a pool of magma under the surface of the Earth.	Oberfläche
	undersea	There are also undersea volcanoes that can erupt.	unter Wasser
6	border	There were fights at the Mexican border with North America.	Grenze
	damage	The damage caused by the earthquake was bad.	Schaden
	to evacuate	Hundreds of people were evacuated by air.	evakuieren
	to measure	The earthquake measured 7.0 on the Richter scale.	messen
	region	The region was hit by long periods without rain.	Region, Gebiet
	violent	Droughts have led to violent conflicts between the regions.	gewalttätig
8	to keep away from	Keep away from heavy furniture that might fall over.	fernbleiben von
9	to fall down	A few trees fell down because of the earthquake.	hinunterfallen
	to realise	I realised it was serious when I saw people running away.	realisieren, erkennen
	survival	We are looking for people with amazing survival stories.	Überleben
	underneath	I just got underneath the kitchen table.	unter
10	ash	He used ash from the fire to draw a face on the ball.	Asche
	castaway	How would you spend your time if you were a castaway?	Schiffbrüchiger/Schiffbrüchige
	to deliver	He still hoped to deliver the parcels unopened one day.	zustellen, liefern
	delivery company	Chuck worked for a worldwide delivery company.	Zustelldienst
	flame	He was trying to make fire and finally he saw a flame.	Flamme
	to get used to	As the years went by, Chuck got used to the island.	sich an etw. gewöhnen
	hometown	Chuck knew the island as well as his hometown.	Heimatstadt
	joy	He laughed with joy.	Freude
	parcel	He put the unopened parcel next to him.	Paket
	raft	Chuck built a raft to escape the island.	Floß
	shelter	He built himself a shelter from the rain.	Unterschlupf, Unterkunft
	to turn into	The rainfall quickly turned into heavy snowfall.	verwandeln, hier: zu etw. werden
13	miracle	It’s a miracle that we survived the earthquake.	Wunder
14	desert island	What would you take on a desert island?	einsame Insel
	pleasure (no pl)	It’s a pleasure to be here.	Freude, Vergnügen
18	in case of	In case of fire go outside!	im Falle von
	lighter	Don’t play with lighters.	Feuerzeug
21	to collapse	The house could collapse during an earthquake.	zusammenbrechen

```

## Output contract

Write `content/corpus/units/g3-u12/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u12",
  "briefBank": "6732fa924d08",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u12.s.passive-voice",
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
