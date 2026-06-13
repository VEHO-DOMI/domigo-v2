# Grammar generation brief — g2-u05 (MORE! 2, Unit 5)

<!-- domigo:gen grammar g2-u05 bank=e4e84149755f prompt=4b9164076103 -->

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

### `g2u05.s.prepositions-directions` — Directions (prepositions of place) (Wegbeschreibungen (Ortspräpositionen))

Giving directions with imperatives (go straight ahead, turn left, go past ...) and saying where places are with prepositions of place (opposite, behind, next to, beside, on the corner of).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [giving-directions]: Tell someone the way with imperatives: Go straight ahead. Take the first left / second right. Go past ... Turn left/right. Cross the bridge/street. Walk up ... as far as ...
  - DE: So sagst du jemandem, wie er/sie an ein bestimmtes Ziel gelangen kann: Go straight ahead. Take the first left / second right. Go past ... Turn left/right. Cross the bridge/street. Walk up ... as far as ...
  - "Go past the post office." — "Geh an der Post vorbei."
  - "Take the first left." — "Nimm die erste Straße links."
  - "Walk up the hill as far as the church." — "Geh den Hügel hinauf bis zur Kirche."
- rule [saying-where]: Say where a place is with prepositions of place: behind, next to, opposite, in front of, on the corner of, round the corner, beside.
  - DE: So sagst du jemandem, wo ein bestimmtes Ziel zu finden ist: behind, next to, opposite, in front of, on the corner of, round the corner, beside.
  - "The cinema is behind the shopping centre." — "Das Kino ist hinter dem Einkaufszentrum."
  - "The restaurant is opposite the church." — "Das Restaurant ist gegenüber der Kirche."
  - "It's just round the corner, beside the bank." — "Es ist gleich um die Ecke, neben der Bank."
- rule [asking-politely]: Ask for directions politely: Excuse me, how do I get to ...? / Excuse me, I'm trying to find ...
  - DE: So fragst du höflich nach dem Weg: Excuse me, how do I get to ...? / Excuse me, I'm trying to find ...
  - "Excuse me, how do I get to the station?" — "Entschuldigung, wie komme ich zum Bahnhof?"
  - "Excuse me, I'm trying to find the supermarket." — "Entschuldigung, ich suche den Supermarkt."

common errors:
- Adding of after opposite: ✗ "It's opposite of the bank." → ✓ "It's opposite the bank."
- Omitting the after prepositions of place: ✗ "Go past post office." → ✓ "Go past the post office."
- L1 preposition transfer when giving directions: ✗ "Go in the left." → ✓ "Turn left."

SB box `g2/sb/More 2 SB Unit 5.txt#grammar-1` — Directions (prepositions of place):
```
So sagst du jemandem, wie er/sie an ein bestimmtes Ziel gelangen kann:
 Go straight ahead.
 Take the first left / second right.
 Go past the post office.
 Turn left / right.
 Cross the bridge / street.
 Walk up the hill as far as the church.
So sagst du jemandem, wo ein bestimmtes Ziel zu finden ist:
 The cinema is behind the shopping centre.
 Next to the bank, there’s the post office.
 The restaurant is opposite the church.
 There’s a little park in front of you.
 On the corner of the next street, there’s a large bank.
 It’s just round the corner, beside the bank.
(Image: Three illustrations labeled “opposite,” “in front of,” and “round the corner.”)
```

v1 seed items (UNTRUSTED):
- `m2-u5-prepositions-directions-gf-001` [gap-fill, d1]: p="The bank is ___ the supermarket. You can see it from there." c="opposite" a=["opposite"] ds=["opposite of","in front","across"]
- `m2-u5-prepositions-directions-gf-002` [gap-fill, d1]: p="The bookshop is ___ the café. They are next to each other." c="beside" a=["beside","next to"] ds=["besides","beside of","near of"]
- `m2-u5-prepositions-directions-gf-003` [gap-fill, d2]: p="Don't turn here. Go ___ for 100 metres and then turn right at the traffic lights." c="straight" a=["straight","straight on","straight ahead"] ds=["straightly","direct","forwards"]
- `m2-u5-prepositions-directions-gf-004` [gap-fill, d3]: p="The pharmacy is ___ the corner from the post office." c="round" a=["round","around"] ds=["in","at","on"]
- `m2-u5-prepositions-directions-gf-005` [gap-fill, d3]: p="Turn ___ at the church and the school is on your right." c="left" a=["left"] ds=["in the left","to left","on left"]
- `m2-u5-prepositions-directions-gf-006` [gap-fill, d4]: p="Go ___ the park and the library is on the other side." c="past" a=["past"] ds=["passed","pass","over"]
- `m2-u5-prepositions-directions-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="The cinema is opposite the train station." a=["The cinema is opposite the train station."] ds=["The cinema is opposite of the train station.","The cinema is opposite to the train station.","The cinema is opposite from the train station."]
- `m2-u5-prepositions-directions-mc-002` [multiple-choice, d3]: p="Which direction instruction is correct?" c="Go straight and turn right at the corner." a=["Go straight and turn right at the corner."] ds=["Go straight and turn in the right at the corner.","Go straightly and turn right at the corner.","Go straight and turn on right at the corner."]
- `m2-u5-prepositions-directions-mc-003` [gap-fill, d5]: p="Choose the correct option: The bakery is ___ the shoe shop." c="beside" a=["beside"] ds=["besides","beside of","next"]
- `m2-u5-prepositions-directions-ec-001` [error-correction, d2]: p="Find and fix the mistake: The school is opposite of the hospital." c="The school is opposite the hospital." a=["The school is opposite the hospital.","The school is opposite the hospital","opposite the hospital","opposite"] ds=[]
- `m2-u5-prepositions-directions-ec-002` [error-correction, d3]: p="Find and fix the mistake: Turn in the left at the church." c="Turn left at the church." a=["Turn left at the church.","Turn left at the church","Turn left"] ds=[]
- `m2-u5-prepositions-directions-ec-003` [error-correction, d4]: p="Find and fix the mistake: Go straightly down the road and the park is on your left." c="Go straight down the road and the park is on your left." a=["Go straight down the road and the park is on your left.","Go straight down the road and the park is on your left","straight"] ds=[]
- `m2-u5-prepositions-directions-tf-001` [transformation, d3]: p="A tourist asks you for help on the street. Say it more politely: 'Turn left here.' → 'Could you ___?'" c="turn left here, please" a=["turn left here, please","turn left here please","please turn left here"] ds=[]
- `m2-u5-prepositions-directions-tf-002` [gap-fill, d4]: p="You're explaining where your house is to a friend. The park is across the road from the library. Say: 'The park is ___ the library.'" c="opposite the library" a=["opposite the library","opposite"] ds=["next to the","Go past","Turn left at"]
- `m2-u5-prepositions-directions-tf-003` [gap-fill, d5]: p="You're giving directions to the new student. Tell them how to find the gym: '___ the cinema and keep going straight.'" c="Go past" a=["Go past","Go past the cinema"] ds=["opposite the","next to the","Turn left at"]
- `m2-u5-prepositions-directions-tr-001` [translation, d3]: p="🇩🇪 Die Bäckerei ist gegenüber der Schule." c="The bakery is opposite the school." a=["The bakery is opposite the school.","The bakery is opposite the school","The bakery is across from the school.","The bakery is across from the school"] ds=[]
- `m2-u5-prepositions-directions-tr-002` [translation, d5]: p="🇩🇪 Geh geradeaus und dann biege rechts ab." c="Go straight and then turn right." a=["Go straight and then turn right.","Go straight and then turn right","Go straight on and then turn right.","Go straight on and then turn right","Go straight ahead and then turn right.","Go straight ahead and then turn right"] ds=[]
- `m2-u5-prepositions-directions-sb-001` [sentence-building, d2]: p="Put the words in the correct order: the / turn / at / left / traffic lights" c="Turn left at the traffic lights." a=["Turn left at the traffic lights.","Turn left at the traffic lights"] ds=[]
- `m2-u5-prepositions-directions-mt-001` [matching, d1]: p="Match the English direction with its meaning: 1) go straight  2) turn left  3) go past  4) opposite  5) beside" c="{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"d\",\"5\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"e\",\"3\":\"a\",\"4\":\"d\",\"5\":\"b\"}"] ds=["a: continue past something","b: next to something","c: keep going forward","d: directly across from something","e: make a left turn"]
- `m2-u5-prepositions-directions-qf-001` [question-formation, d4]: p="You are lost and want to find the train station. Ask for directions politely." c="Excuse me, how do I get to the train station?" a=["Excuse me, how do I get to the train station?","Excuse me, how do I get to the train station","How do I get to the train station?","How do I get to the train station","Excuse me, where is the train station?","Where is the train station?","Could you tell me the way to the train station?","Can you tell me the way to the train station?"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Amherst, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, Excuse, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Lauriston, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, South, Square, States, Station, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vasile, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 5.txt -----
Unit 5  Where’s the supermarket?
Page 40–41
At the end of unit 5 …
you know
 ✔ 5 phrases for giving directions
 ✔ 12 words for buildings
 ✔ how to use prepositions of place
you can
 ✔ understand directions
 ✔ ask for and give directions
 ✔ understand a short newspaper article about a missing tourist
 ✔ write a text message with directions
VOCABULARY – Directions
1
 a Listen to the conversation and answer the questions.
Where do they want to go?
How long does it take to walk there?
(Image: Two girls looking at a map or phone for directions)
b Listen again and draw the route on the map.
[Map image with labeled streets: Columbus Avenue, Broadstreet, 58th Street, 63rd Street. Starting point marked with “You are here” at the bottom left.]
Direction illustrations:
go past the little park
go straight ahead
cross the street
turn right
take the second left
VOCABULARY – Buildings
2 Listen and look at the pictures. Then write the numbers next to the words.
Word list:
bank
 church
 police station
 supermarket
 chemist’s
 cinema
 post office
 restaurant
 tourist office
 music shop
 railway station
 hospital
(Image: Illustration with 12 pictures. Numbers 1–12 are used to match to words.)
READING & LISTENING – Understanding directions
3 CHOICES
(Image: Small map excerpt with building icons and “You are here” marked.)
A Read the dialogue and draw the sign for the post office on the map.
DIALOGUE 1
Woman: Excuse me, where’s the post office?
 Man: The post office? Go straight ahead. Go past the supermarket.
 Woman: Alright. And then?
 Man: Then take the first left.
 Woman: OK.
 Man: Go past the bank. The post office is next to it.
B Read the dialogue and draw the sign for the cinema on the map.
DIALOGUE 2
Boy: Excuse me.
 Woman: Yes, dear?
 Boy: Can you tell me where the Odeon cinema is?
 Woman: The Odeon? Well, let me think. It’s in Hill Road.
 Boy: How do I get there?
 Woman: Go straight on, take the second right and go past the police station.
 Boy: OK, past the police station …
 Woman: Then there’s a little park in front of you. Go through the park. Turn right, then left, and then right again. The cinema is behind the large music shop.
 Boy: Thank you.
 Woman: Not at all.
4 Listen to two more dialogues and draw the other two signs on the map in 3.
DIALOGUE WORK
5 Put the dialogue in the correct order. Compare with your partner. Then act it out.
Photos of characters: Jasmine and Ron
Jasmine: The Carlton? The film’s at the Odeon. Hurry up!
 Jasmine: I’m in front of the cinema too. The Odeon cinema.
 Jasmine: Hey, Ron, where are you?
 Jasmine: Go up Broad Street and turn left after the bank.
Ron: What’s the quickest way?
 Ron: I’m in front of the cinema.
 Ron: Right. See you in five minutes.
 Ron: Oh dear. Wrong cinema. I’m in front of the Carlton cinema.
Page 42–43
SPEAKING – Asking for and giving directions
6 Work in pairs. Student A works with the map here, student B works with the map in the Workbook (page 41).
(Image: Map showing roads named KINGS ROAD, RICHMOND ROAD, NEW ROAD, SIDWELL STREET, GEORGE STREET, MANOR ROAD, EAST STREET. Landmarks include a police station, shop, post office, hospital, church, school, and a “You are here” pin on the bottom left.)
You ask your partner the way to the supermarket, cinema, school and the post office.
A Excuse me, how do I get to ... / Excuse me, I’m trying to find ... / Excuse me, I’m looking for ... ?
(Image: Girl speaking)
B That’s easy.
 Take the ...
(Image: Boy responding)
READING
7 Read the newspaper article.
Missing tourist finally found!
 Romanian tourist found safe and well after three days.
Mr Vasile Belea (63) from Romania came to London three days ago. He wanted to have a holiday with his son’s family. His son picked him up from the airport and they went into London by underground.
 When they changed trains at Stockwell Station, Mr Belea’s son, Radu, jumped on the next train and the doors closed. Mr Belea was too slow and the doors closed in front of him.
“I came back right away,” Radu Belea said, “but Dad wasn’t there. So I looked around the station, and then I went to the next stop again, but I really couldn’t find him.”
We know now that Mr Belea went back into the street and tried to ask a policeman for help. When he finally found one, the policeman was very friendly, but he didn’t understand a word Mr Belea said to him. And Mr Belea didn’t know a word of English! So he walked around and hoped to see his son somewhere, but, of course, he didn’t. He asked another policeman and another – they were all very friendly, but they didn’t understand him and he didn’t understand them. Mr Belea had only £17 in his pockets, he didn’t know where his son lived, and he couldn’t talk to people.
 When it got dark, he sat in a bus stop and spent the night there. In the morning, he started walking again. When he was cold, he went into a shopping centre. He stayed there most of the time, and in the evening he went to a bus stop again.
 After two days and nights like this, he saw a man reading a newspaper. On the cover of this newspaper he saw a picture: it was him!
(Image: Mr Belea holding a newspaper and smiling)
Mr Belea had one pound left. So he bought a newspaper and went to the police station. He showed the paper to a policeman there, and after half an hour, Mr Belea was back with his son’s family.
“We’re so glad to have him back,” his son said. “And I think it’s great that the paper helped us so much. They put an extra large photo of my dad on the cover. I really want to thank everybody for their help.”
8 How many of these tasks can you do?
1 □ Mr Vasile Belea is
  □ English.  □ British.  □ Romanian.
2 □ Vasile Belea was in London
  □ on business.  □ for a conference.  □ for a holiday with his son’s family.
3 □ Mr Belea got lost
  □ on the underground.  □ on a bus.  □ in a shopping centre.
4 The policeman didn’t speak ................................................... .
5 Vasile Belea only had a little ................................................... on him.
6 Vasile Belea didn’t know his son’s ................................................... .
7 Where did Vasile Belea spend the nights? ...................................................
8 Why did Vasile Belea buy the newspaper? ...................................................
9 Why was the paper a big help? ...................................................
9 Check your answers with a partner. Then listen to the story.
Page 44–45
A SONG 4 U
10 Listen and sing.
This is where you go
You want to go to Newtown?
 Then simply go ahead.
 Just cross the bridge and don’t forget
 to stop when lights are red.
Right and left and straight ahead,
 this is where you go.
 Right and left and straight ahead,
 that’s what you need to know. (x2)
You want to go to Market Square?
 Then take the second right.
 Then turn left and left again.
 That’s Market Square alright.
Right and left and straight ahead ...
You want to find the cinema?
 Go past the music shop.
 It’s opposite the restaurant.
 A few more steps, then stop.
Right and left and straight ahead ...
(Image: A family in a car, driving, with signs pointing directions like “Newtown” and “Market Square.”)
WRITING
11 Your friend is coming to visit you. She sent you a text message. Send her a text message (40–60 words) with directions to your house.
Hi, coming 2 see u tomorrow.
 Can you send me a text message
 how to get to your house?
 Details, please!!!
 And address again! cya Susan
GRAMMAR
Directions (prepositions of place)
So sagst du jemandem, wie er/sie an ein bestimmtes Ziel gelangen kann:
 Go straight ahead.
 Take the first left / second right.
 Go past the post office.
 Turn left / right.
 Cross the bridge / street.
 Walk up the hill as far as the church.
So sagst du jemandem, wo ein bestimmtes Ziel zu finden ist:
 The cinema is behind the shopping centre.
 Next to the bank, there’s the post office.
 The restaurant is opposite the church.
 There’s a little park in front of you.
 On the corner of the next street, there’s a large bank.
 It’s just round the corner, beside the bank.
(Image: Three illustrations labeled “opposite,” “in front of,” and “round the corner.”)
OUR YOUNG WORLD 2
 Jamie’s pizza problem
1 Watch the video. Who wrote the positive comment on Mickey’s Place?
2 Watch again and answer the questions.
 1 Does Jamie eat pizza every day? .......................................................
 2 Where did Jamie find the reviews? .......................................................
 3 What were most of the reviews like? .......................................................
 4 Who wrote that Luigi’s pizza was the worst pizza ever? .......................................................
 5 What were the comments like on Mickey’s Place? .......................................................
FIND OUT – Using media
3 Match the words and the definitions.
1 □ review   a □ a bad review
 2 □ fake     b □ not real
 3 □ to comment c □ to say what you think about something
 4 □ negative feedback d □ an opinion about a place / an event etc.
Our media world
4 Work in pairs. Who do you think wrote the social media comments below? Say why.
1 What a wonderful book. One of the best romantic novels I know! Buy it! Read it!
 □ a reader  □ the author  □ we can’t be sure
2 Chappy’s Burgers are the worst in town. Why not try Ron’s Burger Place? His burgers are great and the price is right, too.
 □ Chappy  □ Ron  □ a customer
3 Stay at our hotel in the Amherst. We offer you the rights for the price of two nights. Contact Amherst Star Hotel.
 □ the hotel owner  □ a guest  □ we can’t be sure
4 Mrs French teacher is so unfair. She lets the girls do what they want to do. The boys are always in trouble.
 □ the teacher  □ a boy  □ a girl
(Image: Social media comment box from Luigi’s Pizza with reviews and usernames.)
CYBER PROJECT: An online review
5 Work in groups. There is a new shopping centre opening.
 • Write four positive and four negative comments about it.
 • Collect the comments and upload your project.
 • Present it to the class.
Here’s an example:
Alex ★★★★★
 We had a great day at the Funfair. Nice rides and super food.
Mum30 ★★★★☆
 Had a lovely day. Plenty of things to do for small kids.
Tomtom ★☆☆☆☆
 Booooring!! I was so bored I fell asleep.
Maxine ★★☆☆☆
 It’s for small kids. Don’t go there if you’re older than 10.
Page 46–47
THE TWINS 2
 🎥 The way to the station
Developing speaking competencies
Language function
 ☑ I can interrupt politely (jemanden höflich unterbrechen)
Speaking strategy
 ☑ I can check understanding (nachfragen, ob man etwas richtig verstanden hat)
VOCABULARY
 Around town
1 Match the places and the pictures. Then listen and check.
Options:
 bridge
 bus stop
 statue
 traffic lights
 fountain
 clock tower
Image descriptions (top to bottom, left to right):
1 – A large stone fountain in a park.
 2 – A small arched bridge over a river.
 3 – A bus stop with people waiting.
 4 – A clock tower in front of red-brick buildings.
 5 – A white statue of a person on a horse.
 6 – A traffic light showing red.
Answer lines:
1 __________________________
 2 __________________________
 3 __________________________
 4 __________________________
 5 __________________________
 6 __________________________
2 Watch or listen to the dialogue. Then read it. What items from 1 do Lucy and Leo mention?
Tourist: Excuse me.
 Leo: Yes?
 Tourist: I’m sorry to bother you, but can you tell me the way to the railway station?
 Leo: Sure, no problem.
 Lucy: Can you see that bus stop over there?
 Tourist: Yes.
 Lucy: Go past it and take the second left.
 Tourist: Second left.
 Lucy: Yes, the second left. Then go straight ahead and turn left at the traffic lights.
 Tourist: Sorry?
 Lucy: Straight ahead and then left at the traffic lights. The railway station is at the end of the road.
 Tourist: So that’s second left after the bus stop, then left at the traffic lights.
 Lucy: That’s right. You can’t go wrong.
 Tourist: Thank you.
(Image: Lucy and Leo talking to a tourist with a bus stop in the background.)
3 Cover up the dialogue in 2. Try to complete the directions. Then check.
Walk past the 1 _____________________ and then take the 2 ____________________ left. Go straight ahead until you get to some 3 _____________________ lights. Turn 4 _____________________. The 5 ______________________ is at the end of the road.
USEFUL PHRASES
 Interrupting politely
4 Write the words in the correct order to make sentences. Then check with the dialogue in 2 to find a good answer to the phrases.
me / excuse ___________________________________________________________
sorry / bother / I’m / to / you ___________________________________________________________
❓ What do you think? Answer the questions.
 • The tourist asks Leo for directions. Why does Lucy tell him the way?
 • What happens next?
📱 MOBILE HOMEWORK
Watch part 2 of the video and complete the sentences with Lucy and/or Leo.
1 __________________________ is angry with __________________________.
 2 __________________________ gives the directions to the next tourist.
 3 __________________________ tells the tourist to follow the man.
 4 __________________________ laugh at the end.
SPEAKING STRATEGY
 Checking understanding
5 Complete. Check with the dialogue in 2.
Lucy: Then go straight ahead and turn left at the traffic lights.
 Tourist: 1 ___________________________?
 Lucy: Straight ahead and then left at the traffic lights. The railway station is at the end of the road.
 Tourist: 2 ___________________________ second left after the bus stop, then left at the traffic lights.
 Lucy: That’s right. You can’t go wrong.
6 CHOICES
A Work in pairs. Use the prompts.
 Prompts:
 first / second / third right
 first / second / third left
Example:
A: Take the third right. Then take the second left and then the first right.
 B: Sorry?
🟨 A. ✅ Give directions.
 🟨 B. ✅ Check understanding.
B ROLE PLAY: Work in pairs. Then swap roles.
Student A: You are a tourist. Where do you want to go? Ask student B the way. Interrupt politely and check his/her directions.
Student B: Give student A directions. Make sure he/she understands.


----- WB: More 2 WB Unit 5.txt -----
UNIT 5 Where’s the supermarket?
Page 37
UNDERSTANDING VOCABULARY  Buildings
① Match the sentences to the pictures.
Image descriptions (A–L, left to right, top to bottom):
A: Two people walking into a building marked with a fork and knife – a restaurant.
B: Two people carrying instrument cases, walking toward a shop – music shop.
C: A boy walking near a church with a cross on the tower.
D: A girl with short hair walking past a shop with the sign “SHOP” – general store or supermarket.
E: A woman entering a building marked “Cool Food” – likely a supermarket.
F: A man with a guitar standing outside a music store.
G: Two people approaching a building with a bank sign and euro symbol.
H: Two girls talking with a police station behind them.
I: A girl entering a hospital marked with a red cross.
J: A girl entering a chemist’s marked with a green cross.
K: A man walking toward a post office (envelope symbol).
L: A man and woman in front of a tourist information center.
Match to the following sentences:
They’re going to the restaurant.
I’m going to the music shop.
She’s going to the hospital.
They’re going to the supermarket.
They’re going to the bank.
She’s going to the railway station.
He’s going to the church.
They’re going to the police station.
We’re going to the cinema.
She’s going to the chemist’s.
They’re going to the tourist office.
He’s going to the post office.
② Find the words for buildings in the word snake.
The word snake contains the following building words:
railwaystationbankpolicestationchemistspostofficetouristofficesupermarkethospitalcinemarestaurant
USING VOCABULARY  Buildings
③ Complete the sentences with the words from ②.
I’ve got a cold. Can you go to the .......................................................... for me.
We haven’t got any food. Please go to the .......................................................... .
I want to see the latest Disney film. Let’s go to the .......................................................... .
I haven’t got any money left. I need a .......................................................... .
Somebody stole my passport. Where’s the nearest .......................................................... ?
I need some stamps. Is there a .......................................................... around here?
I don’t want to cook today. Let’s go to the .......................................................... .
We should make a tour with a river boat. Let’s ask at the .......................................................... .
I don’t have a car. Let’s go to the .......................................................... and take the train to York.
The ambulance drives to the .......................................................... .
Pages 38–39
UNDERSTANDING VOCABULARY   Directions
④ Read the instructions in the box and write them under the pictures.
Instructions box:
 take the second left
 opposite
 go through the park
 turn right
 cross the bridge
 go straight ahead
 go past the traffic lights
Image descriptions (1–7):
 1 – A straight road continuing ahead
 2 – A person turning left at the second side street
 3 – A bridge over water
 4 – A person walking on the opposite side of the road
 5 – A person going through a green park with a path
 6 – A person turning right at a corner
 7 – A person walking past a traffic light
Write answers (1–7) under the images.
⑤ Read the dialogue and circle the correct answer.
A: Excuse me. How do I get to the railway station?
 B: The railway station? OK. Go straight ahead / left this road. Go until / as far as the large supermarket on your left. OK? After the supermarket, go / take the second right. After about 20 metres, turn ahead / right again. Go past / down the post office, turn on / right at the Station Hotel and there, in front of you, is the railway station. It’s a 20-minute walk.
 A: Thanks.
 B: No problem.
USING VOCABULARY   Directions
⑥ Complete the dialogues with the words in the box.
Word box:
 cross
 ahead
 opposite
 straight
 right
 second
 turn
 take
 far
1 Bank robber: Excuse me, where’s the nearest bank?
  Police officer: __________ the street and go as ____________________ as the cinema. The bank is next door.
2 Tourist: Excuse me, where’s the railway station?
  Police officer: Go ____________________ ahead and take the ____________________ right.
3 Man: Excuse me, where’s the nearest post office?
  Police officer: Go ____________________ left, go as far as the cinema and turn ____________________ .
4 Tourist: Excuse me, where’s the Chelsea Hotel?
  Police officer: Go straight ____________________ . Go past the shopping centre and ____________________ the first right.
5 Tourist: Excuse me, where’s the tourist office?
  Police officer: It’s right over there, ____________________ the church.
⑦ Put the words in the correct order to make sentences.
straight / go / ahead.
the / left. / take / second
past / right. / the / go / turn / park / and
the / left. / cinema / on / the / is
there. / bank / the / is / over
the / as / as / post / go / office. / far
tourist / right / the / office. / turn / at / and
bridge / river. / cross / the / over / the
UNDERSTANDING GRAMMAR   Prepositions of place
⑧ Look at the picture and circle T (True) or F (False).
Image shows a town map: Central Park is at the center, with Oak Lane and High Street intersecting. There's a shop, bookshop, café, hotel, and restaurant marked.
The bookshop is next to the music shop. T / F
The restaurant is behind Central Park. T / F
Oak Lane Park is in front of the hotel. T / F
The hotel is on the corner of Oak Lane and High Street. T / F
The café is opposite the hotel. T / F
USING GRAMMAR   Prepositions of place
⑨ Look at the picture in ⑧ again. Complete the sentences using prepositions of place.
Central Park __________________________________________ the music shop.
The restaurant __________________________________________ the bookshop
Oak Lane Park __________________________________________ the bookshop.
Central Park __________________________________________ Oak Lane and High Street.
The hotel __________________________________________ the music shop.
The café __________________________________________ High Street and Hill Street.
⑩ Write sentences about places in your town.
______________________ is opposite ______________________ .
______________________ is behind ______________________ .
______________________ is next to ______________________ .
______________________ is in front of ______________________ .
______________________ is on the corner of ______________________.
Pages 40–41
READING   Understanding directions
11 CHOICES
Look at the map of Edinburgh. Read text A or B and draw the routes on your map.
 Find out where you are going.
Image: A city map of Edinburgh with various streets labeled (e.g., Lauriston Place, Forrest Road, South Bridge, Nicolson Street, etc.). A red location marker shows “You are here” at a car park near Lauriston Place.
A
 🔄 Go out of the car park* and turn right into Lauriston Place.
 ➡ Walk along Lauriston Place.
 ⬅ Turn left into Forrest Road and then take the second right.
 ⬅ At the end of Chambers Street, turn left into South Bridge.
 ⬆ Go straight ahead. At the end of North Bridge, there’s ___________________________
 ___________________________ opposite the post office.
B
 ➡ Go out of the car park and turn right.
 ➡ At the end of Lauriston Place, turn right into Potterrow.
 ⬅ Follow it and then take the first small lane to the left.
 ➡ Cross over Nicolson Street. When you get to Pleasance, turn left.
 ⬆ Go ahead until you get to High Street.
 ➡ When you get to High Street turn right.
 ➡ High Street becomes Canongate. Go past Canongate Kirk on your left and the Scottish Parliament Building on your right. When Canongate ends, you will see the ___________________________
 ___________________________ . It’s right in front of you.
*VOCABULARY: *car park = Parkplatz; Tiefgarage
LISTENING & DIALOGUE WORK   Asking for and giving directions
12 Work in pairs. Student B works with the map here, student A works with the map in the Student’s Book (page 42).
Image: A simplified street map with labeled streets (e.g., Kings Road, Richmond Road, Sidwell Street, East Street, Manor Road). Buildings are illustrated and labeled (e.g., supermarket, café, cinema, shop, hospital, police station, school, church, hotel, chemist). A red marker says “You are here” near the bottom of the map.
You ask your partner the way to the railway station, hotel, hospital and the chemist’s.
🗨 B: Excuse me, how do I get to … / Excuse me, I’m trying to find … / Excuse me, I’m looking for … ?
 🗨 A: That’s easy. Take the …
13 a
 🎧 Listen to the directions and draw the routes on the map in 12. Use a different colour for each tourist.
13 b
 🎧 Listen again and write down where each tourist wants to go.
1 Tourist 1 – ____________________________________________
 2 Tourist 2 – ____________________________________________
 3 Tourist 3 – ____________________________________________
 4 Tourist 4 – ____________________________________________
Pages 42–43
14 CHOICES
A
 🎧 Put the dialogue in the correct order. Then listen and check.
☐ Man OK, so right at the shopping centre.
 ☐ Woman Yes, and the bank’s just round the corner from there.
 ☐ Man Thank you.
 ☐ Woman You’re welcome.
 ☐ ① Man Excuse me, I’m looking for a bank.
 ☐ Man Where’s that?
 ☐ Woman Just follow this road. It’s on your left. At the shopping centre turn right …
 ☐ Woman A bank? OK, so go to the shopping centre …
B
 🎧 Complete the dialogue with the sentences in the box. There are two extra sentences.
 Then listen and check.
Yes, and then you’re in Maple Road. The post office is right in front of you.
 The post office? There’s one in Maple Road.
 Go past the post office and turn left.
 Do you see the traffic lights up there?
 The church is behind the bank.
 Go to the traffic lights, turn right, go straight ahead and then turn left.
Man Excuse me, can you tell me the way to the post office?
 Woman 1 ________________________________________________________
 Man Maple Road? How do I get there?
 Woman 2 ________________________________________________________
 Man Yes …
 Woman 3 ________________________________________________________
 Man So that’s right, straight ahead, then left.
 Woman 4 ________________________________________________________
 Man Thank you.
15 WRITING   Writing a text message with directions
CHOICES
A
 Write a text message to a friend explaining the way from your home to one of the places below.
the nearest supermarket
the post office
your school
your favourite shop
the nearest bus stop
the railway station
B
 Look at the map in 11 again. Write directions from the car park to the following places.
The Royal Museum of Scotland
The Castle
16 DIALOGUE WORK   Interrupting politely / Checking understanding
🎧 Complete the two mini-dialogues. Then listen and check.
1
 Man ‘E ________________________.
 Woman Yes?
 Man Have you got the time?
 Woman Yes, it’s 4.45.
 Man ‘S ________________________?
 Woman It’s a quarter to five.
 Man Thank you.
2
 Woman ‘I’m s________________________, but when’s the next bus?
 Man The next bus is in half an hour.
 Woman ‘S________________________ at half past four?
 Man Yes, that’s right.
WORD FILE   Buildings
Image: A colourful illustrated city block showing various labelled buildings. The layout includes roads, vehicles, trees, and sidewalks. Key buildings are labeled:
cinema
church
bank
restaurant
railway station
chemist’s
tourist office
music shop
post office
supermarket
hospital
police station
Page 44
Directions
[Images: Nine labeled illustrations of road navigation signs.]
Image label: to go past
 (Illustration shows a road with a person walking past a lamppost on the left.)
Image label: to go straight ahead
 (Illustration shows a pedestrian walkway with a red arrow pointing straight forward.)
Image label: to cross the street
 (Illustration shows a zebra crossing with a red arrow going across.)
Image label: to turn left
 (Illustration shows a street corner with a red arrow turning left.)
Image label: to take the second right
 (Illustration shows a road with the second street on the right highlighted.)
Image label: round the corner
 (Illustration shows a building and a red arrow going around it.)
Image label: as far as
 (Illustration shows buildings and a red arrow extending along the sidewalk.)
Image label: opposite
 (Illustration shows a street with buildings on opposite sides.)
Image label: next to
 (Illustration shows two buildings side by side.)
MORE Words and Phrases
No.	English term/phrase	Example sentence	German translation
1	to cross	We have to cross the street.	überqueren
	map	You can see where you are on the map.	(Land-)Karte
	second	Take the second right.	zweiter/zweite/zweites; Sekunde
3	to go straight on	Go straight on, then turn left.	geradeaus weitergehen
7	airport	His son picked him up from the airport.	Flughafen
	to change trains	We have to change trains at Waterloo Station.	umsteigen
	most of the time	In Ireland, it rains most of the time.	meistens
	pocket	He put his ticket into his coat pocket.	Tasche (bei Kleidungsstücken)
	slow	Tortoises are slow animals.	langsam
	somewhere	He hoped to see his son somewhere.	irgendwo
	underground	They went into London by underground.	U-Bahn
10	market square	We can meet on market square.	Marktplatz
	simply	Then simply go ahead.	einfach
	comment	Who wrote the positive comment?	Kommentar
	to comment	You can comment on the postings.	kommentieren
	feedback	You can give positive and negative feedback.	Feedback
	guest	She invited ten guests to dinner.	Gast
	to offer	We offer you three nights for the price of two.	anbieten
	opening	There is a new shopping centre opening.	Eröffnung
	positive	Write a positive comment.	positiv
	review	The restaurant got a bad review online.	Rezension
	the worst	Luigi’s pizza is the worst pizza ever!	der/die/das schlechteste
T2	to bother	I’m sorry to bother you.	stören
	bus stop	I saw her standing at the bus stop waiting for the bus to arrive.	Bushaltestelle
	fountain	There’s a big fountain at market square.	(Spring-)Brunnen
	to interrupt	You can interrupt politely.	unterbrechen
	politely	You should always ask politely and say please.	höflich
	traffic lights	Turn left at the traffic lights.	Verkehrsampel

```

## Output contract

Write `content/corpus/units/g2-u05/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u05",
  "briefBank": "e4e84149755f",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u05.s.prepositions-directions",
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
