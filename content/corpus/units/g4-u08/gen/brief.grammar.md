# Grammar generation brief — g4-u08 (MORE! 4, Unit 8)

<!-- domigo:gen grammar g4-u08 bank=c2962a2f7b3c prompt=4b9164076103 -->

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

### `g4u08.s.tense-time-expression-review` — Present perfect vs. past simple (revision) (Present perfect und Past simple (Wiederholung))

A systematic review that makes the link between the two tenses and their time expressions explicit: the past simple goes with finished-time words (yesterday, last year, ago, in 2013) and the present perfect with words connecting to now (just, already, never, recently, (not) yet, for, since).

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [past-simple-finished-time]: Use the past simple for finished actions with a finished-time expression: yesterday, last year/month/weekend, in 2013, two months ago.
  - DE: Du verwendest das Past simple für abgeschlossene Handlungen mit einem abgeschlossenen Zeitausdruck: yesterday, last year/month/weekend, in 2013, two months ago.
  - "Last year I got a wonderful collection from a geology professor." — "Letztes Jahr bekam ich eine wunderbare Sammlung von einem Geologieprofessor."
  - "A few hours later I started playing again." — "Ein paar Stunden später begann ich wieder zu spielen."
- rule [present-perfect-now-words]: Use the present perfect for actions connected to now, with words like just, already, never, recently and (not) yet.
  - DE: Du verwendest das Present perfect für Handlungen mit Gegenwartsbezug, mit Wörtern wie just, already, never, recently und (not) yet.
  - "It hasn't turned up on the black market yet." — "Es ist noch nicht auf dem Schwarzmarkt aufgetaucht."
  - "I've collected between 18,000 and 19,000 different kinds of sand." — "Ich habe zwischen 18.000 und 19.000 verschiedene Arten von Sand gesammelt."
- rule [for-and-since]: With the present perfect, use for for a length of time (for two years) and since for a starting point (since 2013, since I started).
  - DE: Mit dem Present perfect verwendest du for für eine Zeitspanne (for two years) und since für einen Anfangspunkt (since 2013, since I started).
  - "I've collected sand since I started my hobby." — "Ich sammle Sand, seit ich mein Hobby begonnen habe."
  - "I've lived here for ten years." — "Ich wohne seit zehn Jahren hier."

common errors:
- Using the present perfect with a finished-time marker: ✗ "I have been there yesterday." → ✓ "I was there yesterday."
- Using the past simple with a present perfect marker (ever): ✗ "Did you ever eat sushi?" → ✓ "Have you ever eaten sushi?"
- Confusing for and since: ✗ "I've lived here since ten years." → ✓ "I've lived here for ten years."

SB box `g4/sb/More 4 SB Unit 8.txt#grammar-1` — Present perfect vs. past simple (Revision):
```
Read the sentences. Then answer the questions.
I’ve collected between 18,000 and 19,000 different kinds of sand since I started my hobby.
Last year I got a wonderful collection from a geology professor in North Carolina.
A few hours later I started playing again with a new player.
It hasn’t turned up on the black market yet.
1 Which of these sentences talk about actions that:
 a. began in the past and are still going on?
 b. began in the past and are finished?
2 Which of the sentences are in the past simple and which are in the present perfect?
Time expressions
Look at the sentences. Then complete the rule with the correct tense.
You often use the following time expressions with the __________:
 yesterday / last year (month, weekend, Friday, …) / in 2013 / 2 months ago
You often use the following time expressions with the __________:
 just / already / never / recently / (not) yet
Image: Two cave people looking at a third person holding a phone, with the caption: “Haven’t you heard of modern technology?”
```

v1 seed items (UNTRUSTED):
- `m4-u8-tense-time-expression-review-gf-001` [gap-fill, d1]: p="I ___ (visit) my grandparents last weekend." c="visited" a=["visited"] ds=["have visited","was visiting","visit"]
- `m4-u8-tense-time-expression-review-gf-002` [gap-fill, d1]: p="She has ___ finished her homework." c="already" a=["already","just"] ds=["yesterday","ago","last week"]
- `m4-u8-tense-time-expression-review-gf-003` [gap-fill, d2]: p="We ___ (live) in Vienna for ten years." c="have lived" a=["have lived","'ve lived"] ds=["lived","live","are living"]
- `m4-u8-tense-time-expression-review-gf-004` [gap-fill, d3]: p="I ___ (not / see) Tom since Monday." c="haven't seen" a=["haven't seen","have not seen"] ds=["didn't see","don't see","wasn't seeing"]
- `m4-u8-tense-time-expression-review-gf-005` [gap-fill, d4]: p="She ___ (move) to London two years ago, and she ___ (live) there ever since." c="moved ... has lived" a=["moved ... has lived","moved ... 's lived"] ds=["has moved ... has lived","moved ... lived","has moved ... lived"]
- `m4-u8-tense-time-expression-review-gf-006` [gap-fill, d5]: p="___ you ever ___ (try) bungee jumping? — Yes, I ___ (do) it in Australia in 2023." c="Have ... tried ... did" a=["Have ... tried ... did"] ds=["Did ... try ... did","Have ... tried ... have done","Did ... tried ... did"]
- `m4-u8-tense-time-expression-review-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="I have never eaten sushi." a=["I have never eaten sushi."] ds=["I never ate sushi.","I have never ate sushi.","I ate never sushi."]
- `m4-u8-tense-time-expression-review-mc-002` [multiple-choice, d3]: p="Which time expression can NOT be used with present perfect?" c="yesterday" a=["yesterday"] ds=["already","just","recently"]
- `m4-u8-tense-time-expression-review-mc-003` [multiple-choice, d4]: p="Choose the correct pair: I ___ here ___ 2019." c="have lived ... since" a=["have lived ... since"] ds=["have lived ... for","live ... since","lived ... since"]
- `m4-u8-tense-time-expression-review-ec-001` [error-correction, d2]: p="Find and fix the mistake: I have been to Paris last summer." c="I went to Paris last summer." a=["I went to Paris last summer.","I went to Paris last summer","I was in Paris last summer."] ds=[]
- `m4-u8-tense-time-expression-review-ec-002` [error-correction, d3]: p="Find and fix the mistake: I live in this house since five years." c="I have lived in this house for five years." a=["I have lived in this house for five years.","I have lived in this house for five years","I've lived in this house for five years."] ds=[]
- `m4-u8-tense-time-expression-review-ec-003` [error-correction, d4]: p="Find and fix the mistake: Did you ever eat insects?" c="Have you ever eaten insects?" a=["Have you ever eaten insects?","Have you ever eaten insects","Have you ever tried insects?"] ds=[]
- `m4-u8-tense-time-expression-review-tf-001` [transformation, d3]: p="Your friend asks how long you've lived here. Answer: 'I ___ (live) here ___ ten years.'" c="have lived ... for" a=["have lived ... for","have lived, for","'ve lived ... for"] ds=[]
- `m4-u8-tense-time-expression-review-tf-002` [transformation, d3]: p="Tell your pen pal when you last saw Tom: 'I ___ (not / see) Tom ___ last Monday.'" c="haven't seen ... since" a=["haven't seen ... since","have not seen ... since"] ds=[]
- `m4-u8-tense-time-expression-review-tf-003` [transformation, d5]: p="Your mum asks about your project. Tell her: 'I ___ already ___ (finish) it, but Anna ___ (not / start) hers ___.'" c="have already finished ... hasn't started ... yet" a=["have already finished ... hasn't started ... yet","'ve already finished ... hasn't started ... yet"] ds=[]
- `m4-u8-tense-time-expression-review-tr-001` [translation, d2]: p="🇩🇪 Ich lebe seit drei Jahren in Graz." c="I have lived in Graz for three years." a=["I have lived in Graz for three years.","I've lived in Graz for three years.","I have been living in Graz for three years.","I've been living in Graz for three years."] ds=[]
- `m4-u8-tense-time-expression-review-tr-002` [translation, d4]: p="🇩🇪 Hast du schon einmal Sushi gegessen?" c="Have you ever eaten sushi?" a=["Have you ever eaten sushi?","Have you ever eaten sushi","Have you ever tried sushi?","Have you ever had sushi?"] ds=[]
- `m4-u8-tense-time-expression-review-sb-001` [sentence-building, d2]: p="Put the words in the correct order: hasn't / yet / she / replied / to / email / the" c="She hasn't replied to the email yet." a=["She hasn't replied to the email yet.","She hasn't replied to the email yet"] ds=[]
- `m4-u8-tense-time-expression-review-mt-001` [matching, d3]: p="Match each time expression with the correct tense. 1: yesterday 2: already 3: two weeks ago 4: since Monday 5: just 6: last summer" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\",\"5\":\"a\",\"6\":\"b\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"b\",\"4\":\"a\",\"5\":\"a\",\"6\":\"b\"}"] ds=["a: present perfect","b: past simple"]
- `m4-u8-tense-time-expression-review-cp-001` [context-picker, d2]: p="Tom started learning English in 2020. He's still learning now. Which sentence is correct?" c="He has been learning English since 2020." a=["He has been learning English since 2020."] ds=["He learned English since 2020.","He has learned English in 2020.","He was learning English since 2020."]
- `m4-u8-tense-time-expression-review-gf-007` [gap-fill, d1]: p="I ___ (play) football every weekend. It's my favourite hobby." c="play" a=["play"] ds=["am playing","played","have played"]
- `m4-u8-tense-time-expression-review-gf-008` [gap-fill, d2]: p="Look! The cat ___ (climb) up the tree!" c="is climbing" a=["is climbing","'s climbing"] ds=["climbs","climbed","has climbed"]
- `m4-u8-tense-time-expression-review-gf-009` [gap-fill, d2]: p="We ___ (visit) our grandparents last Sunday." c="visited" a=["visited"] ds=["have visited","visit","are visiting"]
- `m4-u8-tense-time-expression-review-gf-010` [gap-fill, d3]: p="She ___ (live) in Vienna since 2019." c="has lived" a=["has lived","'s lived","has been living"] ds=["lives","lived","is living"]
- `m4-u8-tense-time-expression-review-gf-011` [gap-fill, d4]: p="By the time we arrived, the concert ___ already ___ (start)." c="had ... started" a=["had ... started","had already started"] ds=["has ... started","was ... starting","did ... start"]
- `m4-u8-tense-time-expression-review-gf-012` [gap-fill, d5]: p="I ___ (read) six books so far this year, and I ___ (read) another one right now." c="have read ... am reading" a=["have read ... am reading","'ve read ... 'm reading"] ds=["read ... read","have read ... read","read ... am reading"]
- `m4-u8-tense-time-expression-review-mc-004` [multiple-choice, d2]: p="Which sentence uses the correct tense for the time expression?" c="I have never been to Australia." a=["I have never been to Australia."] ds=["I never went to Australia.","I am never going to Australia.","I never go to Australia."]
- `m4-u8-tense-time-expression-review-mc-005` [multiple-choice, d3]: p="Choose the correct sentence:" c="I was doing my homework when my friend called." a=["I was doing my homework when my friend called."] ds=["I did my homework when my friend was calling.","I have done my homework when my friend called.","I was doing my homework when my friend has called."]
- `m4-u8-tense-time-expression-review-mc-006` [multiple-choice, d5]: p="Which sentence is NOT correct?" c="I have seen that film yesterday." a=["I have seen that film yesterday."] ds=["I saw that film yesterday.","I have already seen that film.","I had seen that film before she recommended it."]
- `m4-u8-tense-time-expression-review-ec-004` [error-correction, d2]: p="Find and fix the mistake: She has visited London last summer." c="She visited London last summer." a=["She visited London last summer.","She visited London last summer"] ds=[]
- `m4-u8-tense-time-expression-review-ec-005` [error-correction, d3]: p="Find and fix the mistake: I am living in Graz since I was born." c="I have lived in Graz since I was born." a=["I have lived in Graz since I was born.","I have lived in Graz since I was born","I've lived in Graz since I was born.","I have been living in Graz since I was born."] ds=[]
- `m4-u8-tense-time-expression-review-ec-006` [error-correction, d4]: p="Find and fix the mistake: When I came home, my sister already ate all the pizza." c="When I came home, my sister had already eaten all the pizza." a=["When I came home, my sister had already eaten all the pizza.","When I came home, my sister had already eaten all the pizza"] ds=[]
- `m4-u8-tense-time-expression-review-tf-004` [transformation, d3]: p="Change the time expression and adjust the tense: 'I go swimming every Friday.' → Change to 'last Friday': I ___." c="went swimming last Friday" a=["went swimming last Friday","I went swimming last Friday.","I went swimming last Friday"] ds=[]
- `m4-u8-tense-time-expression-review-tf-005` [transformation, d4]: p="Change the time expression and adjust the tense: 'She bought a new phone yesterday.' → Change to 'just': She ___." c="has just bought a new phone" a=["has just bought a new phone","She has just bought a new phone.","She has just bought a new phone","She's just bought a new phone."] ds=[]
- `m4-u8-tense-time-expression-review-tr-003` [translation, d3]: p="🇩🇪 Ich lerne seit drei Jahren Englisch." c="I have been learning English for three years." a=["I have been learning English for three years.","I have been learning English for three years","I've been learning English for three years.","I have learned English for three years.","I have learnt English for three years."] ds=[]
- `m4-u8-tense-time-expression-review-tr-004` [translation, d5]: p="🇩🇪 Als wir im Restaurant ankamen, hatte unser Essen schon begonnen kalt zu werden." c="When we arrived at the restaurant, our food had already started to get cold." a=["When we arrived at the restaurant, our food had already started to get cold.","When we arrived at the restaurant, our food had already started to get cold","When we arrived at the restaurant, our food had already begun to get cold.","When we got to the restaurant, our food had already started to get cold."] ds=[]
- `m4-u8-tense-time-expression-review-sb-002` [sentence-building, d2]: p="Put the words in the correct order: for / she / lived / has / ten / here / years" c="She has lived here for ten years." a=["She has lived here for ten years.","She has lived here for ten years"] ds=[]
- `m4-u8-tense-time-expression-review-sb-003` [sentence-building, d4]: p="Put the words in the correct order: the / had / train / we / already / arrived / left / when" c="The train had already left when we arrived." a=["The train had already left when we arrived.","The train had already left when we arrived","When we arrived, the train had already left."] ds=[]
- `m4-u8-tense-time-expression-review-mt-002` [matching, d3]: p="Match each time expression with the correct tense. 1: every day 2: right now 3: yesterday 4: since 2020 5: before we arrived 6: just" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"e\",\"5\":\"b\",\"6\":\"f\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"e\",\"5\":\"b\",\"6\":\"f\"}"] ds=["a: Past Simple","b: Past Perfect","c: Present Simple","d: Present Continuous","e: Present Perfect Continuous","f: Present Perfect"]
- `m4-u8-tense-time-expression-review-cp-002` [context-picker, d3]: p="Your friend tells you about her trip to London. She went there last week and is now back home. Which sentence fits?" c="I visited the Tower of London last week." a=["I visited the Tower of London last week."] ds=["I have visited the Tower of London last week.","I was visiting the Tower of London last week.","I had visited the Tower of London last week."]

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
- **g4-u01**: be aware of sth, Catholic, fluent, independent, leading, member, primary school, cattle, cheer, crop, famine, found, free state, fungus, government, grain, incident, intention, interfere, landlord, majority, put down, shake hands, starve, Guess!, I'd rather, foreigner, improve, tax, hiking, proper, admire, be terrified, nonsense, thunder, unconscious
- **g4-u02**: illegal, suspect, criminal, to steal, evidence, victim, blackmail, murder, weapon, witness, chest, employee, mystery, report, attractive, nephew, office clerk, keep an eye on, confusion, relative, retire, right away, take over, unlock, upset, consider, mention, likely, besides, expect, handkerchief, Never mind., suspicion, wastepaper bin, excellent, conclusion, get hold of sth, prove, historical, commit, escape, investigation, common, personal, crime scene, realise
- **g4-u03**: busy, cuisine, immigrant, native, nearby, origin, politics, announcement, be in trouble, blow up, emergency landing, evacuate, flock of birds, glide down, miracle, on duty, rescue boat, runway, takeoff, treatment, wing, become desperate, collide, explode, bravery, reward sb, critic, elevator (AE), campaign, charge, crowd-funding, statement
- **g4-u04**: accountant, receptionist, mechanic, nurse, health care, marketing, finance, electrician, secretary, flight attendant, computing, computing, finance, health care, sales and marketing, deserve, female, male, satisfaction, unemployed, career, be keen on, be responsible for, bonus, deadline, develop, earn, launch, pros and cons, salary, think up, working hours, advice, ambition, casual, company, confidently, employer, enthusiastic, eye contact, (job) interview, memorise, naturally, skills, journalism
- **g4-u05**: artificial, fattening, filling, revolting, harmful, healthy, nutritious, fresh, tasty, vegetarian, afford, feed, hunger, intake, waste, contain, cookery, diet, even though, health, nutrition, overweight, regularly, dislike, habits, accept, afterwards, eating disorder, gain, gym, thin, throw up, (be) ashamed, trust
- **g4-u06**: achieve, donate, drop out (of school), goal, income, inspire, support, encouragement, community, exceed, frustrated, grateful, in particular, learn a lesson, range of, relate to, Small wonder, transmit
- **g4-u07**: Aborigine, cheque, envelope, airline, ancestor, bush trail, crawl, drag, excess weight, gorgeous, grab, headlight, heritage, jump-start, pressure, shade, string, reed, track, survival skills, walkabout, aircraft, ambulance, detailed, distance, drugs, first aid, landing, (the) outback, provide
- **g4-u08**: black market, collect, collection, fascination, rare, auction, burn to the ground, copy, execute, furious, judge, librarian, library, monastery, monk, precious, preserve, rob, sentence to death, shorten, addict, addiction, command, go crazy, miss out on sth, pale, turn up, whisper, sheet, confuse sb, kitschy

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Bacon, Baker, Balcony, Barbie, Barcelona, Bartholdi, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Broome, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Cooperative, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jeff, Jefferson, Jeffery, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 8.txt -----
Unit 8 Obsessed!
Pages 66–67
You learn
about people with unusual collections
when to use the present perfect or the past simple
about time expressions
You can
talk about collecting things
write a biography / a summary
order food in a fast food restaurant
1 Look at the photo and the text for thirty seconds. What does the man collect? When did he start? Then read the magazine article carefully and check your answers.
Mr Sandman
Sun, sea and surf are the last things on Nick D’Errico’s mind during a trip to the beach. An interview with a sand collector.
Images show jars and samples of sand grains close-up, each with a label: (1) Red Sand, Tonga, South Pacific; (2) Sonoran, Mèxico; (3) Coromandel, New Zealand; (4) Papohaku, Hawaii.
How did your fascination with sand begin?
 It all started on my honeymoon. My wife and I went to Jamaica. When I was walking along the beach one day, I decided to collect some sand to take home with me. I did it to have some memories of our wonderful holiday. I wasn’t thinking of starting a new hobby then.
Why did you change your mind?
 My wife worked for a travel agency and her colleagues soon started bringing sand for me from lots of exotic places. When I looked at the sands through a microscope, I discovered that they were all different. It was fascinating. That’s how it all started.
How many kinds of sand do you have and where do you keep them?
 I’ve collected between 18,000 and 19,000 different kinds of sand since I started my hobby. Last year I got a wonderful collection from a geology professor in North Carolina. It took him his whole life of work to pack everything up. The total weight was 2,722 kilos. 🟦 They’re still in the garage. My wife is worried that they will have taken over the whole house.
What’s the most expensive sand?
 Probably moon sand. 🟦 It hasn’t turned up yet in the market yet, but when it does, it will go for a lot of money.
If I wanted to become a sand collector, how would I go about it?
 Just go to the beach and stand there. Take your time and look closely. 🟦 Start comparing the sands. When you see how different they all are, your fascination will begin.
How many members are there in the Sand Society?
 The Sand Society started about 50 years ago. It had only six members, but since then around 240 people in 14 countries have joined. We also have a magazine called The Sand Paper with news for our members.
🟦 = missing sentence placeholders.
Check out
 www.sandcollectors.org
 for more!
Note:
sand is normally only used in singular
sands is rare and means "types of sand"
2 Four sentences are missing from the text on p. 66. Find them in the list below and write the correct numbers in the boxes in the text. Careful – one sentence is not from the text!
I have not unpacked most of them.
It costs thousands and thousands of dollars to make a few tons.
The sands were different in colour, size and shape.
Not long ago some very rare moon sand was stolen.
Take sand from different places on the beach.
3 The man in the pictures below, Don Vicente, was a monk who later had a bookshop. He suffered from “bibliomania”. What do you think that is?
4 a Look at the pictures and think of a story. Take notes. Then tell your story to a partner.
Image descriptions, numbered in random order with white circles for writing correct order:
Don Vicente enters a book auction and sees a rare book.
Don Vicente is in court.
Don Vicente buys or acquires the rare book.
Don Vicente is in prison behind bars.
Don Vicente is in a monastery, copying or reading books.
Don Vicente opens a bookshop.
Don Vicente walks through a city.
Don Vicente hears the verdict in court, looking emotional.
b Now listen and put the pictures in the correct order. Write numbers 1–8.
5 Listen again and take notes to answer the questions.
Don Vicente was a monk in a monastery in Tarragona, Spain. What work did he do there?
When Don Vicente left the monastery, he went to a city. What was the name of the city?
In 1836, there was an auction of a very old, rare book. Why did Vicente want to have it?
What happened to a bookseller called Augustino Patxot?
Why was Don Vicente arrested?
What did Don Vicente answer when the judge asked, “Are you sorry for what you have done?”
Pages 68–69
Vocabulary
6 Use a dictionary to check the words and phrases in the box you don’t know. Use the words to write a summary of the Don Vicente story (150 words).
Word box:
 monk · a library · a monastery · precious · an auction · a copy · furious · to burn to the ground · must be presented to · sentence to death · to execute · someone
Note: Writing a summary
use present tense
use important information only
type the text, so that you can easily shorten it if it is too long
7 Read through the text quickly to answer the questions. Then read the text carefully.
What is a FOMO?
Where in the schoolyard does the narrator want people to leave him presents?
The collector
Illustration of a teenage boy with the quote:
 OK, so I’m a FOMO-guy, like 90% of all the other kids in school.
The first to call us this was my History teacher – he thought he was being witty. But then other teachers started calling us it too, which is kind of funny, because most of them spend all day on their phones too. Maybe I should explain: FOMO means Fear Of Missing Out. But I guess their fears are different from mine. They are in family WhatsApp-groups or trying to be clever on some old-fashioned social media site.
But I use my phone mainly for gaming because I’m a gamer. And I play a lot. I collect all kinds of games – and I’m good at them. Some people call it an addiction, but I call it a hobby.
Of course, I use my phone for texting, chatting and looking up stuff too. I like to know what’s going on. That’s only normal for a 15-year-old boy.
 But all this doesn’t really make me a mobile phone addict, does it?
 But then one day something happened …
 I was playing Legion online. The other player was new to the game, so I could’ve killed him easily, but I didn’t, because that wouldn’t have been so much fun. Then a really weird thing happened. Suddenly I could hear his thoughts in my head. I was so surprised that I couldn’t concentrate on the game and lost the game. I also thought I had gone crazy, so I decided to take a break.
A few hours later I started playing again with a new player; it was a girl. I could hear her thoughts. It wasn’t weird any more – it was cool! This was also addictive. I spent more and more time on my mobile phone, so I got little sleep, and I looked pale and a bit unhealthy. Then I found out another thing. I could influence the other players! By whispering commands that gave me an advantage, I could influence the game. I was the king of the gaming world!
However, after a while it all got a bit boring. If all you do is win, there’s no fun in gaming. And then I had a brilliant idea. I was playing a friend, and I gave him the command, “Meet me at seven in the park.” I laughed at my idea, but I was curious so I went there a few minutes before seven – and he really turned up! I stayed hidden – it was a little bit scary.
So that was my new thing. Giving out commands for the real world – and they all worked! I found it very hard to believe … was I going crazy or was I on my way to being the Master of the Universe? I wanted to tell someone, but who? They’d have taken me away to the mad house.
So I’m currently adding new people to my personal collection of online slaves. So far I have quite a nice collection. I don’t think that makes me anything stupid! But I’m thinking about giving out more precise commands like “Leave me a present under the tree in the schoolyard” and stuff like that. That would be OK, wouldn’t it?
But …
 I have a feeling things aren’t quite as simple as they seem.
 What am I doing in bed still? It’s 2 p.m., I’m not tired and I don’t feel well. I want to get out. And why am I turning on my phone? What’s that? No, I don’t want to delete my contact list. I don’t. I’ve spent weeks collecting. I really don’t want to …
 It’s happening. My finger is moving towards that button. But there’s nothing I can do to stop it!
8 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Circle T (True) or F (False).
The narrator doesn’t think he’s a FOMO-guy. T / F
The teachers use their mobile phones as much as the students. T / F
The narrator uses his mobile phone for gaming mostly. T / F
Choose the correct answer.
 4. The narrator thinks his gaming is
 ☐ an addiction.
 ☐ a hobby.
 ☐ a way of meeting friends.
The narrator lost the Legion game
 ☐ because he was new to it.
 ☐ because he couldn’t concentrate.
 ☐ because the other player could hear him.
6 When the narrator discovered his new power he
 ☐ thought he had gone mad.
 ☐ wanted to keep on gaming.
 ☐ felt tired.
7–9 Answer the questions.
 7. Why did the narrator feel bored after some time?
 8. Why did the narrator not tell anyone about what was happening?
 9. What do you think is happening to the narrator at the end of the story?
9 In pairs, discuss how the story could continue. Write down five keywords and give them to another pair. They have to use the keywords to create an ending to the story.
Free flow
10 Think about these questions and take notes on a sheet of paper. Take three minutes.
You have read/heard about three people. What does/did each of them collect?
What do you think about them? Are/Were they all “crazy collectors”? Why / Why not?
Do you know anybody who collects unusual things? What do they collect?
Would you like to be a collector? Why / Why not?
What things should it be illegal to collect?
Get talking
11 Interview three classmates about collecting things.
Speech bubble prompts:
 Have you ever collected anything?
 What was it?
 When did you collect … ?
 How long have you had your collection of … ?
 How long did you collect … ?
 How many … did you collect?
 Have you still got any … ?
12
Report to the class.
 I interviewed three classmates. One collected … when she was … . She still has got …
 One collects … . He has collected … since/for … . He’s got …
 One has never collected anything.
Pages 70–71
13 Read the following texts quickly and answer the questions.
What do these people collect?
What is the basic difference in their collections?
THREE COLLECTORS
🌟 JANET WISE (16) collects souvenirs. But not any souvenirs; if possible, she tries to find kitschy ones. Her parents travel a lot and often take her with them. One day, when she was ten, in a small town in Germany, she saw a little porcelain deer, and she asked her parents to buy it for her.
Now Janet has a room full of souvenirs from many different countries. Her favourites are a small painting from Vietnam, a plastic skull and a little brass gondola from Venice – and the little porcelain deer, of course. She has them all on a shelf in her bedroom.
🌟 JAMES SCULLY (13) doesn’t collect things in the real world. His collections are online. James spends a lot of his time playing games on his game console. His favourite game is Plants vs Zombies. There are many different characters in the game and by collecting coins and completing tasks, James can unlock new ones. He can also get different costumes for each character. You can also get these things by paying for them but James thinks this is too easy. “My parents don’t really understand my collection,” says James. “They think collecting should be about things like stamps or real coins.”
Image: Screenshot from the game 'Plants vs Zombies' with colorful characters and coins.
🌟 MARTIN SHAW (19) has more than 30 football shirts in his collection. He got his first one when he was ten. It was a birthday present and it was the shirt of his favourite team Leeds United. Of course, he can’t wear it any more because it’s too small for him. He collects shirts from teams all over the world. His dad travels a lot for work and often brings him a shirt when he returns home. He sometimes wears his shirts but mostly he keeps them in the wardrobe in his bedroom.
Image: Martin Shaw wearing a football shirt standing in front of a wardrobe with football shirts.
14 Read the texts again and put a ☓ in the correct boxes. Sometimes a ☓ can be for more than one person.
This person’s collection …	Janet	James	Martin
1 started on his/her tenth birthday.	☓		☓
2 is virtual.		☓	
3 has things from different countries in it.	☓		☓
4 is kept in his/her bedroom.	☓		☓
5 started with a model of an animal.	☓		
6 confuses his/her parents.		☓	

15 CHOICES
Writing for your Portfolio
A Decide on something you (want to) collect. Then write an email (40–70 words) to all your friends in which you ask them to help you with your collection. Write about:
what kind of objects you (want to) collect
what the aim of your collection is
how they can help you
B Invent your own collector. Write the biography (120–180 words) of him/her.
 Write about:
who the person is/was and when and where he/she lives/lived
what he/she collects/collected
how large the collection is/was
what is/was special about the collection
where the collection is/was stored
whether the collector is in contact with other collectors
If possible, illustrate your text.
GRAMMAR
Present perfect vs. past simple (Revision)
Read the sentences. Then answer the questions.
I’ve collected between 18,000 and 19,000 different kinds of sand since I started my hobby.
Last year I got a wonderful collection from a geology professor in North Carolina.
A few hours later I started playing again with a new player.
It hasn’t turned up on the black market yet.
1 Which of these sentences talk about actions that:
 a. began in the past and are still going on?
 b. began in the past and are finished?
2 Which of the sentences are in the past simple and which are in the present perfect?
Time expressions
Look at the sentences. Then complete the rule with the correct tense.
You often use the following time expressions with the __________:
 yesterday / last year (month, weekend, Friday, …) / in 2013 / 2 months ago
You often use the following time expressions with the __________:
 just / already / never / recently / (not) yet
Image: Two cave people looking at a third person holding a phone, with the caption: “Haven’t you heard of modern technology?”
Pages 72–73
The Girl Next Door 4
DEVELOPING SPEAKING COMPETENCIES
 Language function
 Ordering in a fast food restaurant
 Speaking strategy
 Buying time to check facts
The collection
1 🔊 Watch or listen to the dialogue. Then read it.
Assistant: Next, please.
 Kate: Yes, can I have the big burger meal deal, please?
 Assistant: Certainly. Would you like a large or a small meal?
 Kate: A small, please. Does the hamburger have any sauce in it?
 Assistant: Let me see. Yes, it does. It’s got tomato ketchup.
 Kate: Could I have it without, please?
 Assistant: I’m not sure. It’s my first day here. I’ll just check … Yes, you can. It will be a few extra minutes.
 Kate: That’s no problem. I’ll wait.
 Assistant: And you, mate. Are you ready to order?
 Tom: Yes, I am. I’ll have the fried chicken meal. Does that come with a drink?
 Assistant: Yes, coke, orange juice or milk.
 Tom: I’ll have orange juice.
 Assistant: And I forgot to ask you. What drink would you like with your hamburger meal?
 Kate: I’ll have orange juice too, thanks.
 Assistant: Are you paying together or separately?
 Kate: I’m paying.
 Assistant: OK, that’s £12 exactly, please. Thank you. Your meal will be ready in a few minutes.
(Tom picks up some sugar sachets and puts them in his pocket.)
 Kate: What are you doing? You’re not going to put sugar in orange juice surely?
 Tom: No, it’s for my collection.
 Kate: Collection? What do you mean?
 Tom: My collection of packets of sugar.
 Kate: Didn’t you know that I collect them?
 Kate: No, I didn’t. I learn something new about you every day.
 Tom: Well, after we finish here, you’ll have to come back to my house and see it.
 Kate: I can’t wait!
2  Complete the order form.
1 x __________________________ big burger meal with no
 1 x __________________________ meal
 2 x __________________________
 Total: £ ____________
Useful phrases
 Ordering in a fast food restaurant
3  Write A (assistant) or C (customer).
□ 1 Next, please.
 □ 2 Can I have the … , please?
 □ 3 Would you like a … ?
 □ 4 Does the hamburger have any sauce in it?
 □ 5 Could I have it without … ?
 □ 6 Are you ready to order?
 □ 7 Does that come with a … ?
 □ 8 What drink would you like?
 □ 9 Are you paying together or separately?
❓
 What do you think? Answer the questions.
 1 Do they enjoy their meals? Why (not)?
 2 What does Kate think about Tom’s collection when she sees it? Why?
📱
 Mobile homework
🎥 Watch the second part of the video and complete the notes about Tom’s sugar collection.
Tom’s sugar collection
has been collecting for 1 __________
number of packets at last count: 2 __________
has packets from countries such as 3 __________
favourite is from 4 __________
the packets have 5 __________
latest packets are from 6 __________
Speaking strategy
 Buying time to check facts
4  Complete the sentences. Then check with the dialogue in 1.
Kate: A small, please. Does the hamburger have any sauce in it?
 Assistant: I __________. It’s my first day
 There. I __________. Yes, you can. It will be a few extra minutes.
 Kate: Could I have it without, please?
5  ROLE PLAY: Look at the role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A
 You are in a fast food restaurant. You want a burger and chips with no ketchup. You also want an apple juice. Give your partner your order.
Student B
 You work in a fast food restaurant. Ask your partner for his/her order. Then answer his/her questions.


----- WB: More 4 WB Unit 8.txt -----
UNIT 8 Obsessed!
Pages 60–61
Reading
 1️⃣ Read the text about an art collector.
Art collector Paul Getty
 The oil billionaire J. Paul Getty (1892–1976) was famous for being ‘tight-fisted’ and didn’t like to spend money freely. He installed a payphone in his home in Surrey, England, to stop visitors from making long-distance calls. And when one of his grandsons was kidnapped, he refused to pay money to the kidnappers. He spent hundreds of millions on art, and millions more to build the Getty Museum in Los Angeles. He called himself an art addict, or even an addict. Several times he said he would stop collecting, but he could never last long.
Funny enough, he never saw his museum, because he was afraid of flying and too busy to take the time to sail to California.
Getty is only one of the many people through history who have spent their lives collecting art – either by spending or even stealing. But what motivates these collectors?
One reason, of course, is to profit financially. But that doesn’t explain why some art collectors are totally addicted to their collections. Some collect not just objects, they spend huge sums of money and build museums so they have their museums. Experts say one reason is that they want to be part of a social network. They want to show off to other people what grand pieces of art they own.
Getty wanted to send out the message: I’m an intellectual European, not an uncivilised American. Collecting Greek and Roman antiquities – which was not very popular in the 1920s – gave him a special identity. This is what he really liked. He was obsessed with demonstrating that he was an expert on European cultures. He even learnt languages from records so he could understand European cultures better.
There are exceptions. Another wealthy oilman, Calouste Gulbenkian (1869–1955), had a great art collection and called the works ‘my children’. But he wasn’t interested in showing off his paintings and kept his collection private.
Whatever drives collectors – we are lucky they leave their collections for us to see in private and public museums. We, the visitors, do not ask ourselves how the collectors got hold of the objects. We benefit from one man’s or woman’s obsession: what type of obsession it was, doesn’t really interest us.
VOCABULARY: tight-fisted – geizig; antiquities – Antiquitäten
2️⃣ How many of the tasks can you do? Check your answers with a partner.
1 Paul Getty was always very generous with his money. T / F
 2 His guests were allowed to use his private phone as often as they liked. T / F
 3 Getty was addicted to art. T / F
 4 One of the reasons why Getty never saw his museum was that he .................................................................................................
 5 Apart from financial reasons art collectors are often motivated by ...................................................................................................
 6 For Gulbenkian artworks were .................................................................................................................................................................................
 7 What did Getty want to tell people with his collection? .............................................................................................................................
 8 What was Getty’s special field of collecting? .................................................................................................................................................
 9 Why do we all benefit from a collector’s obsession? ....................................................................................................................................
Listening
 3️⃣ Listen to the programme Collecting Collectors and write Roy or David next to the questions.
 (Images show a pile of orange traffic cones and a pile of nails.)
Who …
 1 has a list of all the things in his collection? .........................................................
 2 keeps things from the collection in his garden? ................................................
 3 believes that you can learn from his collection? ..............................................
 4 started his collection through working with his father? ................................
 5 started his collection through working in a company? ..................................
 6 has someone in his family who likes his collection? ........................................
VOCABULARY: carpenter – Tischler/in; traffic cone – Verkehrshütchen
4️⃣ Listen again and circle T (True) or F (False).
1 Roy helped his father to make nails. T / F
 2 Roy has been collecting nails for more than 50 years. T / F
 3 Roy has nails that are more than 60 cm long. T / F
 4 David Morgan lives in Oxford. T / F
 5 David’s favourite item in his collection is more than 60 years old. T / F
 6 David’s wife is used to his collection. T / F
Pages 62–63
5️⃣ In the grid, find the past simple form and the past participle form of five more verbs (→↓↘). Write them in pairs.
(Puzzle grid contains words in different directions. Example provided below the grid.)
Past simple	Past participle
ran	run
	
	
	
	

6️⃣ Use the verb forms you found in 5️⃣ to complete the dialogues.
1 A Have you ever ...................... run ...................... a 1,500 metre race?
  B Yes, I ...................... ...................... one last year. Boy, was I tired at the end!
2 A I ...................... ...................... my homework to the teacher this morning. What about you?
  B No, I haven’t ...................... mine to her yet.
3 A Have you ever ...................... ...................... your leg?
  B Yes, I have. I ...................... my right leg playing football two years ago.
4 A Is Jenny here?
  B No, she’s ...................... ...................... to the shops. She ...................... ...................... half an hour ago.
5 A Steve – have you ...................... ...................... the rubbish out?
  B Yes, Mum – I ...................... it out before dinner.
6 A Have you ...................... ...................... all the biscuits?
  B Yes, I ...................... a few last night, but I think there are still some left.
7️⃣ Complete the sentences with the correct form of the verbs in the box.
eat live find‧out lose tell give
1 A I ...................... just ...................... ...................... that Karen has got a new boyfriend.
  B Really? I ...................... ...................... ...................... about that a week ago.
2 A Have you ever ...................... ...................... in another country?
  B Oh, yes. We ...................... in Ireland for two years.
3 A Do you think you’ve never ...................... ...................... frog legs. Have you?
  B Yes, I have. I ...................... them once in Paris, but I really didn’t like them.
4 A What are you looking for? ...................... you ...................... something?
  B Yes, I ...................... my keys in the garden this morning. I can’t find them anywhere.
5 A Do you remember when Kate ...................... me that money back?
  B Yes, she ...................... it back two days after she borrowed it.
6 A She ...................... ...................... me about her plans yet.
  B Really? She ...................... me about them a long time ago.
8️⃣ Complete the dialogue with the present perfect or past simple form of the verbs in brackets.
(An illustration shows a girl standing outside a cinema, waiting.)
Paula At last – you’re here! You’re late.
     I ...................... ...................... (be) here since three o’clock!
Harry I know. I’m sorry.
     I ...................... ...................... (want) to finish my homework before coming here.
Paula What homework?
Harry Don’t you remember? Mrs Lewis
     ...................... ...................... (give) us two exercises this afternoon, and then she
     ...................... ...................... (tell) us to do another one for homework.
Paula Mrs Lewis? She’s the French teacher. Harry, I don’t study French any more.
     I ...................... ...................... (not study) French since Easter.
Harry You’re right. Sorry, I ...................... ...................... (forget) about that.
Paula OK, never mind. Come on, let’s go in and watch the film.
9️⃣ Choose the correct option.
Adrian When ’did you start / have you started collecting?
 Amy   I ’started / have started some years ago.
 Adrian And what do you actually collect?
 Amy   I collect cinema tickets, I mean I collect the stubs*.
 Adrian How many ’did you collect / have you collected so far?
 Amy   322.
 Adrian Oh. So you ’were / have been to the cinema quite often in the last few years.
 Amy   Indeed. It’s my obsession – watching movies at the cinema.
 Adrian And ’did / have your parents ’pay / paid for all these tickets?
 Amy   For many of them, yes.
 Adrian ’Did you try / Have you tried to find friends who collect stubs, too?
 Amy   No, not really. But I ’showed / have shown my stubs to a few friends yesterday. And then they ’shouted out / have shouted out, “Oh, that’s a movie I ’saw / have seen three times already!” That’s good fun, I think.
VOCABULARY: stub – hier: Abrisszettel
Pages 64–65
🔟 Read this short version of the story about Don Vicente. Complete the missing words by writing the missing letters.
Don Vicente was a m _ _ _, i _ _, k _ who worked in a l _ _ _ _ _ _ _. He loved the books – they weren’t his, but they were like his own personal collection. But one day some thieves broke into the m _ _ _ _ _ _ _ _ where he lived, and they stole some of his very p _ _ _ _ _ _ _ _ _ books. After that, Don Vicente went to live in Barcelona.
One day he went to an a _ _ _ _ _ to try to buy a very special book – it was the only c _ _ _ of the book in the world. But another man, called Augustino Patxot, bought the book. Don Vicente was f _ _ _ _ _ _!
Three days later, Patxot’s bookshop was burned to the g _ _ _ _ _ and Patxot was found dead. Don Vicente was arrested and tried* for the murder.
He was found guilty. He said he killed Patxot because “good books must be p _ _ _ _ _ _ _ _ _ d.” The judge sentenced him to d _ _ _ _ h and a few days later, Don Vicente was e _ _ _ _ _ _ _ d.
VOCABULARY: tried – hier: vor Gericht gestellt werden
1️⃣1️⃣ Write the words and expressions (1–11) from the text above to their definitions.
1 a building where religious men live = .................................................................
 2 kept in good condition = ....................................................................................
 3 worth a lot of money = .....................................................................................
 4 edition = ................................................................................................................
 5 order to be killed = .............................................................................................
 6 a religious man = ................................................................................................
 7 destroyed by fire completely = .......................................................................
 8 killed as a form of punishment = .................................................................
 9 a building where books are kept = ...............................................................
 🔟 very angry = .........................................................................................................
 1️⃣1 a sale where people bid* to buy things = ................................................
VOCABULARY: bid – bieten
1️⃣2️⃣ Put the dialogue in the correct order.
☐ Assistant Let me see. ... Yes, it comes with ketchup.
 ☐ Assistant Are you paying together or separately?
 ☐ Assistant Sure. Would you like a drink with that?
 ☐ Assistant OK, chicken burger and orange juice. Anything else?
 ☐ Assistant Next, please.
 ☐ Assistant OK, let me check. That’s a hamburger meal and a chicken burger and orange juice.
 ☐ Assistant And what drink would you like?
 ☐ Assistant I’m not sure. ... Yes, you get chips and a drink.
 ☐ Assistant I’ll just check. ... Yes, that’s possible.
☐ Mike No, that’s all. What about you Paula? Are you ready to order?
 ☐ Mike Yes, I’d like an orange juice.
 ☐ Mike I think that’s me. Can I have a chicken burger, please?
☐ Paula I’ll have the hamburger meal then.
 ☐ Paula No, he’s paying for me.
 ☐ Paula And if I go for the hamburger meal, does that come with chips?
 ☐ Paula I think so. Does the hot dog have any sauce in it?
 ☐ Paula That’s right.
 ☐ Paula Could I have it without ketchup, please?
 ☐ Paula A coke, please.
1️⃣3️⃣ Now listen and check.
1️⃣4️⃣ Read the task and what a student wrote. How does Adrian answer the four points in the task? Write your answers below.
...............................................................................................................................................
 ...............................................................................................................................................
 ...............................................................................................................................................
 ...............................................................................................................................................
Task
 You’ve just broken something that your sister loved. Write a note of apology (50–70 words). Say:
what you are apologising for
what happened exactly
what you plan to do about it
when you can do that
Pages 66–67
15 Complete the note above with the words in the box.
apologise
 sorry
 forgive
 cross
Hi Joanna,
 I’m so _______, but I broke one of your glass butterflies. I accidentally knocked it off the shelf while I was putting my coat on. It was an accident, but I understand that you’ll be upset. Please, _______ me and let me get you another one. Could you tell me the name of the shop that sells them? I could pick it up tomorrow after school.
 Again – I _______. Please don’t be too _______.
 Bye,
 Adrian
Useful language:
I’m (deeply/truly/extremely/really/awfully) sorry …
I’m sorry that I have (broken, etc.) …
I’m ever so sorry.
I apologise for …
Please, accept my apologies.
Please, forgive me.
I’m sorry, I’m such a fool.
Please, don’t be too cross.
Language tip:
 Apologising
 When writing a note of apology, make sure you mean what you’re saying. Also make sure you choose the right language level, depending on how well you know the person you are apologising to. You can be formal (Please, accept my apologies) or less formal (I’m such a fool – I’m really sorry for ...). Be careful not to apologise too much. You won’t sound like you really mean it.
16 Now write your own answer to the following task.
Task
 You’ve just broken something that was dear to your friend/
 mum/dad/brother/sister/teacher/neighbour. Write a note of apology (50–70 words), in which you say:
what you broke
why you broke it
how you feel about it
what you plan to do about it
MORE Words and Phrases
No.	English	Example sentence	German
1	black market	You can’t get these things in a normal shop. We bought them on the black market.	Schwarzmarkt
2	collect	I’ve collected stamps since I was 12.	sammeln
3	collection	The painting comes from his private collection.	Sammlung
4	fascination	His fascination with garden gnomes started five years ago.	Faszination
5	rare	You don’t see many of those butterflies. They’re very rare.	selten
6	auction	I bought this painting at an auction.	Auktion, Versteigerung
7	burn to the ground	The building burned to the ground.	niederbrennen
8	copy	The book sold 20,000 copies within two weeks.	Kopie, Exemplar
9	execute	After the trial, the murderer was executed.	hinrichten
10	furious	I’m furious that I wasn’t told about it.	wütend, aufgebracht
11	judge	The judge sentenced him to five years in prison.	Richter/in
12	librarian	She works in the town library as a librarian.	Bibliothekar/in
13	library	I never buy books; I always go to the library.	Bibliothek
14	monastery	The monks lived in a big monastery outside the city.	Kloster
15	monk	A monk is a member of a religious group of men.	Mönch
16	precious	That ring means a lot to me. It’s very precious.	kostbar
17	preserve	We need to preserve our traditions and our heritage.	erhalten, schützen
18	rob	We’ve been robbed. The thieves have taken everything from the house.	ausrauben
19	sentence to death	He was sentenced to death for his crime.	zu Tode verurteilen
20	shorten	That film was much too long. I think they should shorten it.	kürzen
21	addict	Look at all the science-fiction addicts waiting outside the cinema! They want to see the new Star Wars movie.	Abhängiger, Süchtige/r
22	addiction	He spends all his time in front of the computer. He has an addiction.	Sucht
23	command	I gave her the command to stay at home.	Befehl
24	go crazy	I must be going crazy. I can’t find my car keys anywhere.	verrückt werden, durchdrehen
25	miss out on sth	Of course I’m coming. I don’t want to miss out on all the fun!	etw verpassen
26	pale	Are you really OK? You look pale.	blass
27	turn up	When do you think our guests will turn up?	auftauchen
28	whisper	He whispered in my ear to tell me the secret.	flüstern
29	sheet	Write this down on a sheet of paper.	Blatt
30	confuse sb	His comments only confused me even more.	verwirren
31	kitschy	The restaurant is decorated with kitschy furniture from the 1950s.	kitschig

```

## Output contract

Write `content/corpus/units/g4-u08/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u08",
  "briefBank": "c2962a2f7b3c",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u08.s.tense-time-expression-review",
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
