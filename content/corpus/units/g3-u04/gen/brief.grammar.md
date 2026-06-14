# Grammar generation brief — g3-u04 (MORE! 3, Unit 4)

<!-- domigo:gen grammar g3-u04 bank=53100d4d15f9 prompt=4b9164076103 -->

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

### `g3u04.s.comparative-intensifiers` — Comparative intensifiers (much/a bit ...; (not) nearly as ... as) (Verstärker bei Vergleichen (much/a bit ...; (not) nearly as ... as))

Words that make comparisons stronger or weaker: much/a lot for a big difference and a bit/a little for a small one before a comparative, plus (not) nearly as ... as and the fewer/less distinction. This unit has no SB grammar box; the structure comes from the v1 seed.

v1 floor for this structure: **39 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [much-vs-a-bit]: Put much or a lot before a comparative for a big difference, and a bit or a little for a small difference.
  - DE: Du stellst much oder a lot vor den Komparativ für einen großen Unterschied und a bit oder a little für einen kleinen Unterschied.
  - "Elephants are much bigger than dogs." — "Elefanten sind viel größer als Hunde."
  - "She is a bit taller than her sister." — "Sie ist ein bisschen größer als ihre Schwester."
- rule [not-nearly-as]: nearly as ... as means almost the same; not nearly as ... as means there is a big difference.
  - DE: nearly as ... as bedeutet fast gleich; not nearly as ... as bedeutet, dass es einen großen Unterschied gibt.
  - "He is nearly as tall as his father." — "Er ist fast so groß wie sein Vater."
  - "A cat is not nearly as dangerous as a lion." — "Eine Katze ist bei weitem nicht so gefährlich wie ein Löwe."
- rule [fewer-vs-less]: Use fewer with countable nouns (fewer people) and less with uncountable nouns (less water).
  - DE: Du verwendest fewer bei zählbaren Nomen (fewer people) und less bei nicht zählbaren Nomen (less water).
  - "There are fewer students in our class than in yours." — "In unserer Klasse sind weniger Schüler als in eurer."
  - "I have less time than yesterday." — "Ich habe weniger Zeit als gestern."

common errors:
- Double comparative (more together with the -er form): ✗ "She is much more bigger than her sister." → ✓ "She is much bigger than her sister."
- Putting the intensifier after the comparative instead of before: ✗ "He is taller much than me." → ✓ "He is much taller than me."
- Using less with a countable noun instead of fewer: ✗ "There are less people in the park today." → ✓ "There are fewer people in the park today."

v1 seed items (UNTRUSTED):
- `m3-u4-comparative-intensifiers-gf-001` [gap-fill, d1]: p="An elephant is ___ bigger than a cat." c="much" a=["much"] ds=["very","more","most"]
- `m3-u4-comparative-intensifiers-gf-002` [gap-fill, d2]: p="This film is ___ more interesting than the last one." c="a lot" a=["a lot"] ds=["very","many","really"]
- `m3-u4-comparative-intensifiers-gf-003` [gap-fill, d3]: p="There are ___ students in our class than in theirs." c="fewer" a=["fewer"] ds=["less","few","lesser"]
- `m3-u4-comparative-intensifiers-gf-004` [gap-fill, d3]: p="We should drink ___ sugar in our tea." c="less" a=["less"] ds=["fewer","least","lesser"]
- `m3-u4-comparative-intensifiers-gf-005` [gap-fill, d4]: p="My new phone is ___ better than my old one." c="far" a=["far"] ds=["very","so","too"]
- `m3-u4-comparative-intensifiers-gf-006` [gap-fill, d5]: p="After the training, she ran ___ faster than before." c="even" a=["even"] ds=["very","more","still"]
- `m3-u4-comparative-intensifiers-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="This book is much more exciting than that one." a=["This book is much more exciting than that one."] ds=["This book is very more exciting than that one.","This book is more much exciting than that one.","This book is much more excitinger than that one."]
- `m3-u4-comparative-intensifiers-mc-002` [multiple-choice, d3]: p="Choose the correct sentence:" c="There are fewer cars on the road today." a=["There are fewer cars on the road today."] ds=["There are less cars on the road today.","There are more fewer cars on the road today.","There are fewest cars on the road today."]
- `m3-u4-comparative-intensifiers-mc-003` [multiple-choice, d4]: p="Which sentence uses 'fewer' and 'less' correctly?" c="You should eat less sugar and fewer sweets." a=["You should eat less sugar and fewer sweets."] ds=["You should eat fewer sugar and less sweets.","You should eat less sugar and less sweets.","You should eat fewer sugar and fewer sweets."]
- `m3-u4-comparative-intensifiers-ec-001` [error-correction, d2]: p="Find and fix the mistake: My sister is very taller than me." c="My sister is much taller than me." a=["My sister is much taller than me.","My sister is a lot taller than me.","My sister is far taller than me."] ds=[]
- `m3-u4-comparative-intensifiers-ec-002` [error-correction, d3]: p="Find and fix the mistake: There is less apples in this box." c="There are fewer apples in this box." a=["There are fewer apples in this box.","There are less apples in this box.","There are fewer apples in this box"] ds=[]
- `m3-u4-comparative-intensifiers-ec-003` [error-correction, d4]: p="Find and fix the mistake: He is more faster than his brother." c="He is much faster than his brother." a=["He is much faster than his brother.","He is a lot faster than his brother.","He is far faster than his brother.","He is faster than his brother."] ds=[]
- `m3-u4-comparative-intensifiers-tf-001` [gap-fill, d2]: p="You're shopping for a phone with a friend. The iPhone costs 1200 EUR and the Samsung costs 400 EUR. Emphasise the difference: 'The iPhone is ________ more expensive than the Samsung.'" c="much" a=["much","a lot","far"] ds=["a bit","a lot","slightly"]
- `m3-u4-comparative-intensifiers-tf-002` [gap-fill, d3]: p="You're describing your family to a new friend. Your brother is 175 cm and you're 172 cm. It's a small difference. Tell your friend: 'My brother is ________ taller than me.'" c="a bit" a=["a bit","slightly","a little"] ds=["much","a lot","slightly"]
- `m3-u4-comparative-intensifiers-tf-003` [gap-fill, d4]: p="After a maths test, your classmate asks how it was compared to the last one. You got 95% this time vs. 60% last time. Complete: 'It was ________ easier than the last one!'" c="much" a=["much","a lot","far"] ds=["a bit","a lot","slightly"]
- `m3-u4-comparative-intensifiers-tr-001` [translation, d3]: p="🇩🇪 Mein Bruder ist viel größer als ich." c="My brother is much taller than me." a=["My brother is much taller than me.","My brother is a lot taller than me.","My brother is much taller than I am.","My brother is far taller than me."] ds=[]
- `m3-u4-comparative-intensifiers-tr-002` [translation, d5]: p="🇩🇪 Wir haben weniger Hausaufgaben als letzte Woche." c="We have less homework than last week." a=["We have less homework than last week.","We've got less homework than last week.","We have less homework than last week","We've got less homework than last week"] ds=[]
- `m3-u4-comparative-intensifiers-sb-001` [sentence-building, d1]: p="Put the words in the correct order: taller / is / brother / much / my / than / me" c="My brother is much taller than me." a=["My brother is much taller than me.","My brother is much taller than me"] ds=[]
- `m3-u4-comparative-intensifiers-mt-001` [matching, d2]: p="Match each noun with the correct word (fewer or less). 1: ___ homework 2: ___ friends 3: ___ money 4: ___ books 5: ___ time" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\",\"5\":\"b\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\",\"5\":\"b\"}"] ds=["a: fewer","b: less"]
- `m3-u4-comparative-intensifiers-qf-001` [question-formation, d1]: p="Form a question: 'London is much bigger than Vienna.' → Ask about London. Start with 'Is'." c="Is London much bigger than Vienna?" a=["Is London much bigger than Vienna?","Is London much bigger than Vienna"] ds=[]
- `m3-u4-comparative-intensifiers-gf-020` [gap-fill, d1]: p="A cheetah is ___ faster than a human." c="much" a=["much"] ds=["very","more","most"]
- `m3-u4-comparative-intensifiers-gf-021` [gap-fill, d2]: p="My new phone is ___ better than my old one." c="a lot" a=["a lot"] ds=["very","really","so"]
- `m3-u4-comparative-intensifiers-gf-022` [gap-fill, d2]: p="This test was only ___ harder than the last one. Don't worry!" c="a bit" a=["a bit","a little"] ds=["very","much","a lot"]
- `m3-u4-comparative-intensifiers-gf-023` [gap-fill, d3]: p="Today is ___ colder than yesterday. I need a warmer jacket." c="much" a=["much","a lot","far"] ds=["very","more","too"]
- `m3-u4-comparative-intensifiers-gf-024` [gap-fill, d4]: p="The book is ___ more exciting than the film. You should read it!" c="far" a=["far","much","a lot"] ds=["very","many","so"]
- `m3-u4-comparative-intensifiers-gf-025` [gap-fill, d5]: p="The new computer is only ___ more expensive than the old model, but it's ___ faster." c="slightly ... much" a=["slightly ... much","slightly...much","a bit ... much","a bit...much","a little ... much","a little...much"] ds=["very ... very","much ... slightly","more ... most"]
- `m3-u4-comparative-intensifiers-mc-020` [multiple-choice, d2]: p="Which sentence is correct?" c="Summer is much hotter than winter." a=["Summer is much hotter than winter."] ds=["Summer is very hotter than winter.","Summer is more hotter than winter.","Summer is most hotter than winter."]
- `m3-u4-comparative-intensifiers-mc-021` [multiple-choice, d3]: p="My new school is ___ bigger than my old one." c="a lot" a=["a lot"] ds=["very","so","too"]
- `m3-u4-comparative-intensifiers-mc-022` [multiple-choice, d5]: p="Which pair of sentences uses intensifiers correctly?" c="The film was a bit longer than I expected, but it was much better than the first one." a=["The film was a bit longer than I expected, but it was much better than the first one."] ds=["The film was very longer than I expected, but it was very better than the first one.","The film was a bit longer than I expected, but it was very better than the first one.","The film was more longer than I expected, but it was much more better than the first one."]
- `m3-u4-comparative-intensifiers-ec-020` [error-correction, d2]: p="Find and fix the mistake: My dog is very bigger than yours." c="much bigger" a=["much bigger","a lot bigger","My dog is much bigger than yours.","My dog is a lot bigger than yours."] ds=[]
- `m3-u4-comparative-intensifiers-ec-021` [error-correction, d3]: p="Find and fix the mistake: Science is much more harder than art." c="much harder" a=["much harder","Science is much harder than art.","Science is much harder than art"] ds=[]
- `m3-u4-comparative-intensifiers-ec-022` [error-correction, d4]: p="Find and fix the mistake: The maths test was very more difficult than the English test." c="much more difficult" a=["much more difficult","a lot more difficult","far more difficult","The maths test was much more difficult than the English test."] ds=[]
- `m3-u4-comparative-intensifiers-tf-020` [transformation, d3]: p="You're comparing two holiday destinations for your family. Complete: 'Croatia is ________ (much/cheap) than Switzerland, but Switzerland is ________ (a bit/beautiful).'" c="much cheaper ... a bit more beautiful" a=["much cheaper ... a bit more beautiful","much cheaper...a bit more beautiful"] ds=[]
- `m3-u4-comparative-intensifiers-tf-021` [transformation, d4]: p="You're telling a friend about two video games. Complete: 'Game A is only ________ (slightly/easy) than Game B, but Game B is ________ (far/exciting).'" c="slightly easier ... far more exciting" a=["slightly easier ... far more exciting","slightly easier...far more exciting"] ds=[]
- `m3-u4-comparative-intensifiers-tr-021` [translation, d4]: p="🇩🇪 Das neue Videospiel ist nur ein bisschen teurer als das alte, aber es ist viel besser." c="The new video game is only a bit more expensive than the old one, but it is much better." a=["The new video game is only a bit more expensive than the old one, but it is much better.","The new video game is only a bit more expensive than the old one, but it is much better","The new video game is only a little more expensive than the old one, but it is much better.","The new video game is only slightly more expensive than the old one, but it's much better.","The new video game is only a bit more expensive than the old one, but it's a lot better."] ds=[]
- `m3-u4-comparative-intensifiers-sb-020` [sentence-building, d2]: p="Put the words in the correct order: than / is / a lot / football / popular / more / tennis" c="Football is a lot more popular than tennis." a=["Football is a lot more popular than tennis.","Football is a lot more popular than tennis"] ds=[]
- `m3-u4-comparative-intensifiers-sb-021` [sentence-building, d3]: p="Put the words in the correct order: only / is / a bit / tablet / the / lighter / than / the / laptop" c="The tablet is only a bit lighter than the laptop." a=["The tablet is only a bit lighter than the laptop.","The tablet is only a bit lighter than the laptop"] ds=[]
- `m3-u4-comparative-intensifiers-mt-020` [matching, d3]: p="Match each intensifier with the best sentence. 1: much 2: a lot 3: a bit 4: slightly 5: far" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}"] ds=["a: ___ more dangerous than I thought. (The river was very rough!)","b: ___ more interesting than the last unit. (I really love this topic!)","c: ___ taller than his sister. (They are almost the same height.)","d: ___ better than yesterday. (I feel great now!)","e: ___ harder than I expected. (But I still passed.)"]
- `m3-u4-comparative-intensifiers-qf-020` [question-formation, d4]: p="Your friend says: 'I think basketball is better than football.' You want to know how much better. Form a question using a comparative intensifier. Start with: 'Is it...' or 'How much...'" c="Is it much better or just a bit better?" a=["Is it much better or just a bit better?","How much better is basketball than football?","Is it a lot better or only a bit better?","How much better do you think it is?"] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Ahmed, Alan, Albu, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amy, Ancient, Anderson, Andrew, Andy, Anger, Animal, Annette, Annie, Antarctic, Anthony, Anti, Arbeit, Archie, Arconia, Arconians, Arenas, Arousing, Articles, Aryan, Asia, Atlantic, Aussage, Australia, Austria, Austrians, Bacon, Baker, Balcony, Barcelona, Beatles, Befehlsformen, Beitrag, Belea, Bella, Ben, Benson, Bert, Betty, Beyonc, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Blues, Bob, Boer, Bolt, Bond, Bottlemen, Box, Bradley, Brazil, Brian, Bridge, Brown, Buckells, Buckingham, Buddy, Burgers, Butterfly, Caf, Cairn, California, Californian, Cambridge, Came, Cameroon, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chile, China, Chito, Chloe, Chris, Christie, Christine, Chuck, Claire, Clare, Clark, Classroom, Clothes, Clown, Coach, Coldeye, Coldplay, Column, Come, Complimenting, Control, Costa, Creta, Croatia, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Denver, Despereaux, Dialog, Dialoge, Diana, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dragons, Dua, During, Earthlings, East, Eddie, Edinburgh, Edwina, Egypt, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Europe, European, Europeans, Every, Excuse, Expressing, Fab, Fahrenheit, False, Fang, Faye, Feeling, Fido, Fluff, Food, Ford, France, Frank, Fred, Freddy, Gangnam, Gegenwart, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Hadfield, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, Hull, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Jolly, Jonathan, Jones, Josh, Julia, Jun, Jupiter, Just, Justyna, Kansas, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Korea, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linking, Lipa, Lisa, Liszt, London, Lord, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malverns, Manchester, Mandy, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Megan, Mei, Meridian, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mr, Mrs, Ms, Mum, Munich, Musical, Natasha, Nathan, Navy, Neither, Nelson, New, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nina, Nomen, Norman, North, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Ola, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Paige, Palace, Pardon, Paris, Parsons, Past, Patti, Paul, Paula, Paws, People, Peru, Pete, Peter, Pets, Philosopher, Phoenix, Picchu, Pirates, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Possessives, Potter, Prepositions, Present, Priestly, Professor, Project, Punta, Put, Radu, Rain, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Rica, Richard, Richmond, Rick, Ricky, Ride, Ringo, Robert, Robertson, Rome, Ron, Ronald, Rose, Rosey, Rosie, Royal, Ruby, Russell, Ryan, Sacks, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Seoul, Sessions, Shannon, Shelter, Sherlock, Shrek, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Spallanzani, Spanish, Spotify, Spotless, Square, States, Station, Steve, Stirling, Stoke, Stradivarius, Style, Sue, Sunborn, Superstar, Susan, Suzy, Svalbard, Swaton, Sweet, Tag, Take, Tale, Tamar, Tamara, Tammy, Targon, Tasmania, Tell, Telling, Text, Think, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, True, Turan, Uhr, Um, United, Uros, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walker, Wall, Wallace, War, Waterloo, Watson, Way, Welcome, Well, White, Will, William, Willow, Wise, Work, World, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 3 SB Unit 4.txt -----
Unit 4 Wild and dangerous?
Pages 34–35
At the end of unit 4 …
you know
 ☐ 9 adjectives for describing animals
 ☐ how to form comparatives and superlatives (revision)
 ☐ how to use as … as (revision)
 ☐ how to use much and nearly
you can
 ☐ understand a documentary about brown bears
 ☐ describe, compare and talk about (wild) animals
 ☐ understand a magazine and website article
 ☐ understand an interview about shark attacks
 ☐ understand and write a film review / fact file about an animal
 ☐ get your message across
🎥 Teen Talk 2
1 a Watch the video. How many types of bears are mentioned?
b Choose the correct option.
1 There are about 22,000 / 17,000 brown bears in Europe.
 2 When a brown bear is born, it is smaller than a rabbit / mouse.
 3 Female brown bears can be as heavy as polar bears / lions.
 4 Brown bears can run as fast as / faster than humans.
2 Which facts in the video do you think are most surprising? Compare with a partner.
READING Understanding a magazine article
3 a Read the magazine article.
Cute but deadly
 Not all animals are as lovely as they look. Here are some that you probably don’t want to get too close to.
The slow loris
 Among the trees in the forests of Southeast Asia you might find a slow loris. It’s the cutest animal in the world. 🟨 But be careful. This creature produces a poison to protect its young. One bite from this cute cannon can cause a lot of pain and could even kill you.
Pfeffer’s flamboyant cuttlefish
 This stunning 8 cm creature looks like something from another world. But it isn’t. You’ll find it on the ocean around Australia. This cuttlefish is definitely one sea creature you don’t want to pick up. 🟨 Its poison is as deadly as the famous blue-ringed octopus.
The leopard seal
 Everyone loves a baby seal. They’re soft and white and furry. But their parents are not as adorable. 🟨 An adult leopard seal is as dangerous as a killer whale. They attack penguins, large fish and even humans. This is one animal you don’t want to go for a swim with.
The poison dart frog
 These tiny frogs come in an amazing variety of colours: yellows, reds, blues, greens and oranges. 🟨 As their name suggests, these frogs are very poisonous, so don’t touch them, even if they swim in. It could make you very ill.
The swan
 Swans are commonly found on lakes and rivers in Europe and other countries. They are one of the most elegant of all birds, but they are also more dangerous than other birds. 🟨 Swans are often very aggressive. They attack anyone who gets close to their nests. They stay on the water and don’t stop until they are sure their young are safe.
The Siberian chipmunk
 What could be so dangerous about this cuddly mammal from North America and Asia? Chipmunks really are sweet, and they aren’t aggressive at all. The worst thing they might do to you is try and take a sandwich from your picnic. But they are famous for spreading diseases like rabies. 🟨 It’s best to stay away from them.
b Which two of these animals are the best parents?
Image description: Circular thumbnails of six animals with numbered labels.
 1: Slow loris
 2: Leopard seal
 3: Poison dart frog
 4: Swan
 5: Chipmunk
 6: Cuttlefish
4 Now read the article again. Complete it with the lines below. Write the letters in the boxes.
A when you are snorkelling
 B And for this reason
 C Just look at those big eyes
 D But these colours are a warning
 E In the sea
 F When they are nesting
🎧 VOCABULARY Adjectives describing animals
5 Listen and complete the dialogues with the expressions in the box.
 Practise the dialogues in pairs.
cuter than  cooler than  the cutest  the most aggressive  not as cool as
1 A Have you seen Dave’s new lizard?
  B Yes, I have.
  A What did you think of it?
  B I thought it was really cute.
  A Cute! Are you crazy? It tried to bite my finger off. It’s .......................................................... pet ever.
2 A Have you seen Jade’s new dog Fido?
  B No, I haven’t. What’s it like?
  A It’s really cute. In fact, it’s .......................................................... dog I’ve ever seen.
  B Really? But her last dog Spike was cute. He was really furry and cuddly.
  A I know, but Fido’s .......................................................... Spike. He’s adorable.
3 A Have you seen Brian’s pet spider?
  B I have. I thought it was really cool.
  A It is pretty cool, but it’s .......................................................... his snake.
  B I don’t agree. I think it’s .......................................................... his snake.
6 Look at the adjectives that can be used to describe animals. In your exercise book, put them into two lists: positive and negative. Add three of your own adjectives to each list.
elegant aggressive dangerous poisonous adorable furry stunning deadly cute
SPEAKING Talking about animals
7 In pairs, think of three dangerous animals.
 • Describe the animals.
 • Say why these animals are dangerous.
 • Say what we can admire about these animals.
Pages 36–37
READING Understanding a website article
8 Look at the photos. What injuries did the girl suffer from, and why do you think they happened to her?
 Read the text very quickly to find out if you were right. Then read the story carefully.
TEEN LIFE
 Online magazine
 AN AMAZING YOUNG PERSON
 (Image description: A digitally edited layout showing a shark in the background, and a photo of a young woman with long light purple hair and a black-and-white patterned dress. There are also pictures of a helicopter in the sky, an empty beach access with stairs, and a hospital operation scene.)
What happened on June 2, 2019, at Fort Macon Beach in North Carolina, USA, was a terrible tragedy. It changed the life of 17-year-old Paige Winter and her family forever. Paige, her sister, her best friend Kate and her parents, Charlie and Marcy, wanted to have a great day out on the beach. They were standing in water that was only a metre deep. There was a lot of rain the day before, so the water wasn’t very clear. Paige and the others were having fun, when she suddenly stepped on something and could feel it moving. At first, she thought it was her dad. A moment later, she felt a sharp pain on her leg. Her sister Alana was the first one to notice what was going on. There was a big bull shark, and it was pulling Paige down into the water. When Paige came up again for a moment, there was a lot of blood, and the shark was still pulling at her leg.
Paige’s father Charlie didn’t wait for a moment. He dived into the water, and tried to lift the girl out. But the shark didn’t let go of her. Charlie started to beat the shark with his fists*. He beat as hard as he could. Finally, after what seemed like ages, he managed to chase the big fish away. Charlie saw that his daughter had horrible injuries. It was difficult for him to carry her, but he managed to get her out of the water. Several people were on the beach. They were watching the drama, but they also called for the air ambulance, and one of them managed to stop the blood that was flowing from her injured leg.
As soon as Paige was in hospital, the doctors started to fight to save her life, and that fight was a success. Paige survived, but she suffered very bad injuries. She lost a leg and two fingers. The doctors said that there were several heroes in the story: Paige’s parents, the person who managed to stop the bleeding, and Paige herself:
 “A patient who is optimistic has a much greater chance to survive bad injuries,” a doctor we spoke to explained.
The situation wasn’t easy for Paige, but she showed a lot of strength. The hospital staff and the other patients were surprised to see how often she smiled. She never complained. She stayed optimistic and positive, and that helped her with her extremely difficult new life situation.
Maybe the most amazing thing about Paige is that she isn’t scared or sad any more about what happened. She accepts things as they are, even if that isn’t always easy. In a film that was produced about her story, Paige tells us that she has always loved all animals, especially Sushi, her cat. But she says that she doesn’t feel angry about the shark that injured her so badly. Paige still thinks that sharks are as fascinating as other creatures, and she hopes that if people hear that from her, they will feel the same way too!
*VOCABULARY: beat with your fists – mit den Fäusten schlagen
9 How many of these tasks can you do?
1 Paige couldn’t really see what was in the water because
 ☐ there were too many people in it.
 ☐ there was so much blood.
 ☐ the water was dirty after heavy rain.
2 The shark injured the girl and left
 ☐ before the family even saw it.
 ☐ after her father beat it with his fists.
 ☐ when Paige’s sister screamed loudly.
3 Paige’s father found it difficult to carry his daughter. She
 ☐ was badly injured.
 ☐ wasn’t bleeding any more.
 ☐ said she was OK.
4 The first person to stop the bleeding was a young doctor at the hospital.  T / F
 5 A doctor said that it was important that Paige was such a positive person. T / F
 6 Paige tries to accept her situation and she doesn’t even feel angry about sharks. T / F
7 How do you think Paige felt immediately after the attack?
 ……………………………………………………………………………………………
8 How do you think Paige managed to smile so often?
 ……………………………………………………………………………………………
9 Do you agree with Paige that sharks are wonderful creatures? Why (not)?
 ……………………………………………………………………………………………
10 ✅ Check your answers with a partner. Then listen to the story.
Pages 38–39
LISTENING Understanding an interview
11 Listen to an expert talking about shark attacks. Tick the correct answer.
The truth about ...
SHARK ATTACKS
With Gillian Hitchcock
[Image: Tiger shark swimming near a diver in blue water]
[Image: Close-up of a great white shark with mouth slightly open]
1 Gillian is
☐ a news reporter.
☐ a scientist who knows the truth about sea life.
☐ a scientist with the Californian Shark Institute.
2 Gillian advises against
☐ holidaying on the Californian coast.
☐ swimming and surfing out too far at the moment.
☐ letting kids play too close to the water.
3 Gillian says that
☐ most of the sharks we know don't attack humans.
☐ about 30 species of sharks in the world are very dangerous.
☐ there have been 500 shark attacks so far.
4 Gillian explains that the most-feared shark is
☐ the bull shark.
☐ the great white shark.
☐ the tiger shark.
A great white shark
Tiger shark and diver
5 The great white shark kills by
☐ quickly biting off big bite after big bite.
☐ letting people bleed to death.
☐ biting off the legs first and then the head.
6 Sharks kill
☐ to feed themselves and their families.
☐ when you swim into their territory in daylight.
☐ to get food or to defend their territory.
7 Sharks also attack humans
☐ because it is in their nature.
☐ because of the noise humans make.
☐ because they mistake them for seals or sea lions.
8 Gillian explains that
☐ sharks usually attack under water.
☐ swimmers and people snorkelling are in more danger than scuba divers.
☐ slow swimmers are in more danger than fast swimmers.
People snorkelling are in greater danger.
Seals and sea lions – the great white's favourite food
READING
12 Read and listen to the poem.
The crocodile
Oh, she sailed away
on a fine and sunny day
on the back of a crocodile.
"You see," said she,
"he's as tame as tame can be.
I'll ride him down the Nile."
The croc winked his eye
as the lady waved goodbye,
wearing a great big smile.
But at the end of the ride,
the lady was inside
and the smile was on the crocodile!
[Image: Cartoon illustration of a woman riding on a crocodile]
13 Read the film review. Answer the questions.
1 What's the film about? Say it in one sentence.
2 What's the story of the film?
3 Did the writer like the film? Say why (not).
FILM of the WEEK
Troodon World: The Rise of the Troodons
[Image: Movie poster showing a dinosaur in a forest setting with green glow]
Troodon World is the latest and truly fantastic film by director Julia Wells and stars up-and-coming actors Tasmin Archer and Brad Ford.
Dr Lydia Russell has built a time machine, and she decides to go back 65 million years to study dinosaurs. There she finds the Troodon, a dinosaur that was only 1.2 m tall and weighed not more than 70 kg. They are the most dangerous meat-eaters, and Dr Russell and her two assistants have to be very careful.
Soon they find out that Troodons can communicate. Dr Russell thinks that they are so intelligent that they could one day become the dominant creature on Earth and become a real danger for humans.
Dr Russell's team don't know what to do. They don't know if they should try and fight the Troodons. But after making friends with a Troodon they call Creta, that becomes impossible anyway. Then they find out that an asteroid might hit Earth. Can they save Creta – and humans?
TROODON WORLD
This is a first-class adventure film with great visual effects. There are some scary and some funny scenes too. If you like exciting adventure films, this is for you!
★★★★★
SOUNDS RIGHT Word stress
14 Put the words in the correct column. Then listen, check and repeat.
●●● (e.g. crocodile)                    ●●●● (e.g. expensive)
amazing
ambulance
dangerous
exciting
fantastic
horrible
hospital
scientist
Pages 40–41
15 🎯 CHOICES
A Look at the film posters. Imagine you have seen one of these films. Write a short review of it for your school magazine (60–80 words). In your review:
tell the story of the film
say what you thought about it
say who starred in it
say who the film is for
B Your class is doing a biology project in English on a dangerous animal. Search the internet for information. Write a fact file (120–180 words). Say:
what the animal is and what it looks like
where it can be found
what is dangerous about the animal
what happens if a person comes into contact with it
what humans can do to avoid dangerous situations with it
how scary you personally find the animal
🎬 (Four film posters are shown with titles: "Chaos in the Zoo", "The Monster from Mars", "The Pizza That Ate New York", "Tarantula!")
📘 GRAMMAR
Comparatives (revision)
 Swans are more dangerous than other birds.
 Brian’s spider is cooler than his snake.
 Leopards are bigger than cheetahs.
much / nearly
 You can use the words much and nearly to stress comparatives.
Swans are much more dangerous than other birds.
 The parents are not nearly as adorable as the young. (D: nicht annähernd so reizend wie …)
Superlatives (revision)
 The slow loris is the cutest animal in the world.
 The three most dangerous sharks are the bull shark, the tiger shark and everyone’s greatest fear, the great white shark.
as ... as (revision)
 Paige still thinks sharks are as fascinating as other creatures.
 The parents are not as adorable as the young.
🔲 Complete with as / the / than:
 The test was easier ’........’ last week’s.
 This is ’........’ best holiday I’ve ever had.
 I’m good at tennis, but I’m not as good ’........’ you!
🎨 (Cartoon of a girl with a pink surfboard at the beach, thinking: “She was hoping for bigger waves!”)
🎬 OUR YOUNG WORLD 2
 Luke’s animal campaign
1 ▶️ Watch the video and complete the quotation from Abraham Lincoln.
"You can please 1 ‘...........’ of the people 2 ‘...........’ of the time,
 you can please 3 ‘...........’ of the people 4 ‘...........’ of the time,
 but you can never please 5 ‘...........’ of the people 6 ‘...........’ of the time."
🖼️ (Image of Abraham Lincoln)
 🖼️ (Image of Luke in video still)
2 ▶️ Watch again and answer the questions.
 1 Why do some people want foxes off the streets?
 2 What do foxes usually eat?
 3 What does HOOF mean?
 4 How many visitors has Luke had to his webpage?
 5 Who has Luke written letters to and why?
 6 Why is Luke going to the radio station?
🔎 FIND OUT Getting your message across
3 Match the phrases and the definitions.
 1 to target an audience
 2 to reach an audience
 3 to get your message across
a ☐ to make people understand what you want to say
 b ☐ to decide which people you need to communicate with
 c ☐ to find a way of communicating with the people you want to talk to
📣 Reaching an audience
 4 Read the situations. For each one, think about:
 1 who might want to get each message across
 2 the best ways they can do this
Warn teenagers about the dangers of swimming in rivers.
Tell primary school children about eating healthily.
Inform the public about changes to the voting system.
Tell the elderly* about a new charity that helps with loneliness*.
VOCABULARY: the elderly = Senioren/Seniorinnen; loneliness = Einsamkeit
💻 CYBER PROJECT: A class presentation
5 Work in groups. Decide on a message you want to get across or use one of the ideas in the box. Decide:
who you want to target
how you’re going to reach them
what you want to say and how you’re going to say it
Present your ideas to the class.
🎤 (Box with message ideas:)
 1 Let’s keep our street clean.
 2 Be careful when you cross the street.
 3 Bullying ruins* lives.
VOCABULARY: ruin = ruinieren, zerstören


----- WB: More 3 WB Unit 4.txt -----
UNIT 4 Wild and dangerous?
Page 29
UNDERSTANDING VOCABULARY
 Adjectives describing animals
1 Find nine adjectives in the word snake. Then write them down.
Word snake (orange, curved text):
 elegantaggressivedangerouspoisonouscuddlyfurrystunningdeadlycute
1 ....................................................
 2 ....................................................
 3 ....................................................
 4 ....................................................
 5 ....................................................
 6 ....................................................
 7 ....................................................
 8 ....................................................
 9 ....................................................
2 Unscramble the words to complete the dialogue.
Helena
 Look at that animal. It’s 1 .................................................... (tuce). What is it?
Juliet
 It’s a slow loris. But don’t be fooled by those 2 .................................................... (unginst) eyes. It can be quite 3 .................................................... (osaendgru).
Helena
 Really? Why?
Juliet
 It produces a liquid* when it’s feeding its young that is 4 .................................................... (oospsioun). In fact, it can be 5 .................................................... (adeddyl).
Helena
 Really?
Juliet
 Yes, it can be quite 6 .................................................... (gsrevasige) if you go near it.
Helena
 But it’s so 7 .................................................... (ruryf) and 8 .................................................... (dlycud). I just want to stroke it.
VOCABULARY: liquid – Flüssigkeit
Image description: A small round photo of a slow loris, showing its big eyes and soft-looking fur.
USING VOCABULARY
 Adjectives describing animals
3 Choose the correct adjective.
1 That snake is deadly / furry / stunning. One bite and it kills you.
 2 Her dog is so aggressive / cuddly / elegant. I just want to hold it in my arms.
 3 His rabbit’s got a lot of hair. It’s very stunning / furry / dangerous.
 4 That bird is bright red, yellow and blue. It’s absolutely stunning / deadly / cute.
 5 Don’t drink that! It’s cuddly / aggressive / poisonous.
 6 It’s a very dangerous / stunning / poisonous part of town. Never go there at night.
 7 Don’t touch that dog. It’s very furry / stunning / aggressive and might attack you.
 8 Dave wore a beautiful suit and tie to the party. He looked very furry / elegant / poisonous.
4 Think of an animal for each pair of adjectives and write a sentence about it.
1 stunning / poisonous
 The blue-ringed octopus looks stunning, but don’t touch one because they are poisonous.
 2 elegant / dangerous
 3 cute / deadly
 4 cuddly / aggressive
Pages 30–31
5 Look at the information about three cars. Circle T (True) or F (False).
A
 speed 160 km/h
 year 2013
 length 3 m
 comfort HHH
 price £8,000
B
 speed 180 km/h
 year 1985
 length 4 m
 comfort HH
 price £8,000
C
 speed 200 km/h
 year 1967
 length 3 m
 comfort H
 price £25,000
1 Car C is more expensive than car B but not as expensive as car A. T / F
 2 Car A is faster than car B but not as fast as car C. T / F
 3 Car B is older than car A but not as old as car C. T / F
 4 Car A is as long as car B but not as long as car C. T / F
 5 Car C is more comfortable than car A and B. T / F
 6 Car A is as expensive as car B. T / F
 7 Car B is the longest. T / F
 8 Car C is the fastest. T / F
 9 Car C is as new as car B, but car A is the newest. T / F
 10 Car A is the most uncomfortable. T / F
6 Read the sentences. Write C if they contain a comparative and S if they contain a superlative.
1 Farid is a better friend than Amelia. ☐
 2 This is the best day of my life! ☐
 3 It’s the funniest book I’ve ever read. ☐
 4 I’m much taller than my mum. ☐
 5 It’s much hotter today than it was yesterday. ☐
 6 Australia is the most beautiful country I’ve ever visited. ☐
 7 Playing football is certainly more tiring than watching it on TV. ☐
 8 This question is much easier than the last one. ☐
7 Complete the table with the correct forms.
Comparative	Superlative	(not) as ... as
1 better		bad
2	the biggest	
3 louder		
		early
	the most interesting	

8 Complete the sentences with a superlative.
1 A Charles and George are good at maths.
  B Yeah, but I’m ............................................................ .
2 A Tammy and Georgina have got really cute dogs.
  B Yeah, but my dog is ............................................................ .
3 A Nigel’s and Geoff’s girlfriends are really pretty.
  B Yeah, but my girlfriend is ............................................................ .
4 A Paul and Steve have got really cool bikes.
  B Yeah, but my bike is ............................................................ .
5 A The teacher said that the twins are really intelligent.
  B Yeah, but I’m ............................................................ .
6 A My mum and dad have got really expensive cars.
  B Yeah, but my dad’s car is ............................................................ .
9 Rewrite the comparative sentences so that they mean the same.
Example: Anna is older than Janet. ➞ Janet is not as old as Anna.
1 Squash is more exciting than tennis.
 2 Rome is bigger than Naples.
 3 Finland is not as hot as Greece.
 4 Hungarian is not as easy as Spanish.
 5 Natasha is much friendlier than Victoria.
 6 The hotel in Edinburgh was much worse than the hotel in Glasgow.
 7 Romantic films are not nearly as exciting as fantasy films.
 8 Detective films are not nearly as funny as cartoons.
10 Complete the text using the correct form of the adjectives in brackets.
Sequels* are never usually as 1 ............................................................ (good) as the first film in a series. For example, Creed was an 2 ............................................................ (awesome) film. Creed II was 3 ............................................................ (bad) film ever made. Spiderman is 4 ............................................................ (exciting) superhero film I’ve seen. Spiderman II is 5 ............................................................ (boring) ever made.
Of course, this isn’t always true. What about Shrek, for example?
 I think that Shrek II is 6 ............................................................ (good) than Shrek. I think that it is 7 ............................................................ (funny) and I also think the story is 8 ............................................................ (interesting).
Don’t get me wrong. I like Shrek, it’s a 9 ............................................................ (great) film. It’s a lot 10 ............................................................ (intelligent) than most Hollywood films. But I just don’t think it is as 11 ............................................................ (funny) as the sequel. I think Shrek II is 12 ............................................................ (great) animated film ever made.
VOCABULARY: sequel – Folge, Fortsetzung
Image description: A picture of the animated character Shrek smiling with his hand on his chest.
Pages 32–33
11 What do you think of these paintings? Write eight sentences to compare them. Use the adjectives in the box to help you.
old beautiful good modern exciting interesting ugly colourful famous valuable
I think painting A is much better than painting B.
I think painting C is the most interesting.
 ..................................................................................................................
 ..................................................................................................................
 ..................................................................................................................
 ..................................................................................................................
 ..................................................................................................................
 ..................................................................................................................
Images (top of page, left to right):
 Painting A: A version of Van Gogh’s The Starry Night, showing a vivid swirling night sky over a village.
 Painting B: A stylized cartoon-like artwork with characters, bright colors, and angular forms.
 Painting C: A Picasso-style cubist painting with abstract human figures and bold shapes.
12 Listen and write Ryan, Helen or Steve under the correct picture. There are two extra pictures.
(Images of six animals, numbered 1–6)
Dog with long ears walking on a path
Tabby cat looking alert
Bright orange snake coiled around a branch
Fluffy white dog (possibly a Pomeranian)
Large brown tarantula on white background
Greyhound running
12b Listen again and answer the questions.
1 What kind of pet does Paul think Ryan has?
 ..................................................................................................................
 2 How does Janet describe Ryan’s dog?
 ..................................................................................................................
 3 What pets does Lucy guess that Helen has?
 ..................................................................................................................
 4 How does Ben describe Helen’s snake?
 ..................................................................................................................
 5 Why wasn’t Steve allowed a dog?
 ..................................................................................................................
 6 How does Olga describe the spider?
 ..................................................................................................................
13 Read the text. Complete the facts with the missing numbers.
The Animal Olympics
Imagine animals were allowed to take part in the Olympic Games. How many medals would humans win? The answer is not many, maybe none.
Let’s start with running.
 The fastest humans run at around 43 km/h.
 The fastest mammal is the cheetah with a speed of more than 112 km/h. We wouldn’t stand a chance*.
 Even our pet cats at 48 km/h or pet rabbits at 56 km/h would beat us. Humans wouldn’t even qualify for the finals.
We wouldn’t do any better in the jumping.
 The best human long jump is just under 9 m.
 The best human high jump is just under 2.5 m.
 The gold medal in long jump would go to the kangaroo that can do nearly 13 m in a single jump. In the high jump, the top prize goes to the puma with a leap* of more than 7 m.
But when we consider body size, the jack rabbit would win.
 Its jump of 6 m is ten times the length of its body.
 The kangaroo jumps 8 times its body length, but humans can only jump 5 times their body length.
When insects enter the competition, they beat us all.
 A grasshopper ‘only’ jumps 75 cm. But compared to its body length it would be the same as a human jumping over a football field.
 But the gold medal goes to the flea. It can jump 350 times its body length.
 A human would need to jump over 800 m to beat that.
In the water, humans would really have a hard time.
 The top speed of a human in the pool is just 8 km/h.
 Whales and dolphins can reach speeds of around 50 km/h, which is about as fast as a human can run on land.
 The fastest fish in the sea, however, is the sailfish with a top speed of around 110 km/h.
 That’s twice as fast as a nuclear submarine*!
In weightlifting, the elephant can lift more than 300 kg with its trunk.
 The most a human can lift is around 267 kg. So again, no medals here.
 But for its size the true Olympic champion is the ant. It can carry 50 times its weight using their mouth!
Luckily for us, there isn’t a flying category in the Olympics.
 We would not have a chance because the world’s fastest animal is the peregrine falcon.
 It can reach speeds of 389 km/h.
VOCABULARY:
 *stand a chance – eine Chance haben
 *leap – Sprung
 *nuclear submarine – Atom-U-Boot
Facts to complete (right column):
 Cheetahs can run at 1. ............. km/h.
 Pumas can jump 2. ............. m.
 Grasshoppers can jump 3. ............. cm.
 The sailfish has a top speed of 4. ............. km/h.
 Elephants can lift 5. ............. kg.
 The peregrine falcon can reach speeds of 6. ............. km/h.
Images (right side of page):
Cheetah running at full speed
Puma mid-jump
Grasshopper on leaf
Sailfish leaping out of water
Elephant lifting log with trunk
Peregrine falcon diving mid-flight
Pages 34–35
14 How many of these tasks can you do?
1 No mammal is faster than a cheetah.
  T / F
 2 Humans can jump more than 2.5 m in the air.
  T / F
 3 The puma is the animal that can jump the highest.
  T / F
 4 Jack rabbits can ................................................ the length of their body.
 5 Insects are ................................................ than mammals or humans.
 6 Dolphins in the sea are ................................................ humans on earth.
 7 How fast is a sailfish compared to a nuclear submarine?
  ..................................................................................................................
 8 How strong are ants?
  ..................................................................................................................
 9 Why are humans ‘lucky’ to have sports like football?
  ..................................................................................................................
15 Listen and check your answers.
16
 A Complete the dialogue with the sentences in the box. There are two extra sentences.
 Then listen and check.
Oscar ................................................
 Fatima Yes, I have.
 Oscar ................................................
 Fatima I don’t agree. It tried to bite me. His last dog was much friendlier.
 Oscar ................................................
 Fatima I tried to stroke its head and it barked at me.
 Oscar ................................................
 Fatima Why?
 Oscar ................................................
Sentence box:
 a Because it doesn’t like people touching it.
 b I think cats are friendlier than dogs.
 c What do you mean, it tried to bite you?
 d Have you seen Liam’s new dog?
 e It’s the most aggressive dog I know.
 f Well, of course it barked at you.
 g Isn’t it cute? It’s much cuter than his last dog.
B Put the dialogue in the correct order. Then listen and check.
□ Connor When was the last time you were there?
 □ Connor Have you seen the baby elephant at the zoo?
 □ Connor It’s so cute. It’s the cutest animal there.
 □ Connor You should, before the baby elephant is as big as its mum.
 □ Connor The baby monkeys aren’t babies any more. They’re as big as the adults now.
 □ Donna Even cuter than the baby monkeys?
 □ Donna Really? Last time I was there, they were tiny.
 □ Donna No, I haven’t. What’s it like?
 □ Donna About a year ago. I must go again soon.
17 Read the task and what a student wrote. Why do we need sharks?
Task
 Write a fact file about an endangered animal (120–170 words).
 In your fact file, say:
 ✔ what the animal is and what it looks like
 ✔ where it can be found
 ✔ why it is endangered
 ✔ what we could do to save it
 ✔ why it is important to you to save it
The endangered animal I want to write about is the mako shark.
Here’s what you need to know.
 • There are two types, shortfin and longfin.
 • They are big (3.2 to 4.5 metres).
 • They can weigh up to 800 kgs.
 • They hardly ever attack humans.
Mako sharks are found in all warm oceans.
 They live in the seas of Asia, Brazil and in the Gulf Stream, but there have also been mako shark sightings around France and Italy.
 They are endangered because fishing boats (especially in Asia) hunt them.
 • because their meat is great
 • because their fins* are used for medicine
Some fishermen only take the fins and throw the fish back to die. This is terrible. That is why we should forbid the fishing of mako sharks. And we shouldn’t buy their meat.
I think that sharks are important because
 • they eat older and dying fish
 • they keep the ocean clean from other dangerous fish
Save the mako shark!!!!!!!!!!!!
Image description: A photo of a mako shark swimming in blue ocean water, taken from the side and slightly above.
VOCABULARY: fin – Flosse
Language tip: Using good punctuation
 When writing a text, be consistent*. For example, when you are doing bullet points, use one type of bullet point only and lay them out clearly. But only use them when you have several points to make.
 For strong messages use exclamation marks (!) but don’t overdo them. And never use more than one exclamation mark in a row!
VOCABULARY: consistent – einheitlich
Pages 36–37
18 Look at the text in 17 again and answer the questions.
1 What is wrong with the bullet points?
  .................................................................................................................
 2 Should you use them in all of the examples above? Why (not)?
  .................................................................................................................
 3 Where else could you put exclamation marks? Mark them in.
  .................................................................................................................
 4 Where in the text is the writer using too many exclamation marks?
  .................................................................................................................
Writing tip: Writing a fact file
 ✔ Carefully check your facts.
 ✔ If you use the internet, don’t only look at one site. Check the information on several.
 ✔ Do not copy the text but rephrase using your own words.
 ✔ Do not copy over difficult words you do not understand.
 ✔ Lay your page out well. Use one or two pictures to help the reader understand your text.
19 Now write your own answer to the following task.
Task
 Write a fact file about your favourite animal (120–170 words).
 In your fact file, say:
 ✔ what the animal is and what it looks like
 ✔ where it can be found
 ✔ what its life is like
 ✔ why it is your favourite animal
 ✔ why it is important to you
WORD FILE
 Adjectives describing animals
Image descriptions:
A red and black frog with the label poisonous.
A gray shark with the labels aggressive, dangerous, and deadly.
A white swan with the labels elegant and stunning.
A brown bear cub with the labels cute, furry, and cuddly.
MORE Words and Phrases
#	Phrase	Example Sentence	Translation
TT2	cub	A baby bear is called a ‘cub’.	(Bären-)Junges
	Good luck!	Viel Glück!	
	polar bear	There are 3,000 polar bears on the Svalbard Islands in Norway.	Eisbär
1	adorable	The baby seal’s parents are not as adorable.	bezaubernd, liebenswert
2	bite	A bite from a slow lorris can be deadly.	Biss
3	to cause	One bite can cause a lot of pain and could even kill you.	verursachen
4	poison	The slow loris produces a poison to protect its young.	Gift
5	rabies	Chipmunks can spread diseases like rabies.	Tollwut
6	seal	Everyone loves a baby leopard seal.	Robbe
7	swan	Swans are commonly found on lakes and rivers.	Schwan
8	to bite (off)	His lizard tried to bite my finger off.	(ab-)beißen
9	lizard	Dave’s got a new lizard as a pet.	Eidechse
10	to chase away	He managed to chase the big fish away.	verjagen
11	to complain	She smiles a lot and never complains.	sich beschweren
12	injury	Charlie saw that his daughter had terrible injuries.	Verletzung
13	to lift	He dived into the water, and tried to lift the girl out.	aufheben
14	to pull down	There was a big surf shark, and it was pulling Paige down into the water.	hinunterziehen
15	to accept	Paige tries to accept her situation.	akzeptieren
16	immediately	Why didn’t they go back to the café immediately?	sofort
17	to advise (sb.) against sth.	I would advise against surfing or swimming out too far.	(jdn.) von etw. abraten, (jdn.) vor etw. warnen
18	to bleed	The great white shark let’s people bleed to death.	bluten
19	death	Great white sharks want their victims bleed to death.	Tod
20	to defend	Sharks attack to defend their territory.	verteidigen
21	to mistake sth. for sth.	They attack humans because they mistake them for seals or sea lions.	etw. mit etw. verwechseln
22	on average	They only kill one person every eight years on average.	durchschnittlich, im Durchschnitt
23	scuba diver	Swimmers are in more danger than a scuba diver.	Sporttaucher/Sporttaucherin
24	shape	From below, the shape of a swimmer can look like a seal to a shark.	Form
25	to suppose	I suppose so.	vermuten, annehmen
26	to take care	People should take care when they go swimming.	aufpassen, sich hüten
27	victim	Sharks watch their victims bleed before eating.	Opfer
28	to communicate	Soon they find out that Troodons can communicate.	kommunizieren
29	audience	There are different ways to reach an audience.	Publikum
30	environment	Foxes are a part of our environment.	Umwelt
ZW40	Hands off!	You need to inform the public about changes to the voting system.	Finger weg!
31	to inform		informieren
32	to lock sb. up	You should lock up the chickens at night.	jdn. einsperren
33	politician	They’re asking for the local politicians to get the foxes off our streets.	Politiker/Politikerin

```

## Output contract

Write `content/corpus/units/g3-u04/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g3-u04",
  "briefBank": "53100d4d15f9",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g3u04.s.comparative-intensifiers",
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
