# Grammar generation brief — g1-u10 (MORE! 1, Unit 10)

<!-- domigo:gen grammar g1-u10 bank=219f364b86ff prompt=4b9164076103 -->

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

### `g1u10.s.how-much` — How much is / are …? (How much is / are …? – Wie viel kostet …?)

Asking about prices: How much is …? for singular, How much are …? for plural (note jeans = plural).

v1 floor for this structure: **19 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [how-much-singular]: Use How much is …? with a singular noun.
  - DE: Verwende How much is …? mit einem Nomen in der Einzahl.
  - "How much is this scooter?" — "Wie viel kostet dieser Roller?"
- rule [how-much-plural]: Use How much are …? with a plural noun. Note: jeans = plural.
  - DE: Verwende How much are …? mit einem Nomen in der Mehrzahl. Achtung: jeans = Plural.
  - "How much are the green T-shirts?" — "Wie viel kosten die grünen T-Shirts?"
  - "How much are the jeans?" — "Wie viel kostet die Jeans?"

common errors:
- Using is with a plural noun.: ✗ "How much is the shoes?" → ✓ "How much are the shoes?"
- Using costs instead of the be structure.: ✗ "How much costs it?" → ✓ "How much is it?"

SB box `g1/sb/SB Unit 10- In a shop.txt#grammar-1` — ▶️ this/that – these/those:
```
[Image description: Illustrations showing T-shirt, shoes, and trainers with numbered labels 1-4]
1 I'd like this T-shirt, Dad. 3 I'd like that red sweater. 2 I'd like these shoes. 4 I'd like those blue trainers.
🔍 Schreib "weiter weg" und "nahe" in die Lücken und bilde die Regel.
Du verwendest this/these, um auf etwas hinzuweisen, das ¹.................................................... ist. Du verwendest that/those, um auf etwas hinzuweisen, das ².................................................... ist.
How much is/are ...?
So fragst du nach dem Preis: How much is ...? wird mit der Einzahl (Singular) verwendet, How much are ...? mit der Mehrzahl (Plural). Achtung: jeans = Plural!
How much is this scooter? How much are the green T-shirts? How much are the jeans? How much is that scooter? How much are those green T-shirts? How much are the jeans?
⏪ Now go back to page 76. Check ☑ with a partner what you know / can do.
🔵 WB p. 87, 88, 89, 90 🌐 CYBER Homework 30
```

v1 seed items (UNTRUSTED):
- `m1-u10-how-much-gf-001` [gap-fill, d1]: p="How much _____ the bag?" c="is" a=["is"] ds=["are","costs","does"]
- `m1-u10-how-much-gf-002` [gap-fill, d1]: p="How much _____ the trainers?" c="are" a=["are"] ds=["is","costs","cost"]
- `m1-u10-how-much-gf-003` [gap-fill, d2]: p="How much _____ this computer game?" c="is" a=["is"] ds=["are","costs","does"]
- `m1-u10-how-much-gf-004` [gap-fill, d2]: p="How much _____ those jeans?" c="are" a=["are"] ds=["is","cost","does"]
- `m1-u10-how-much-gf-005` [gap-fill, d3]: p="_____ _____ is the T-shirt? – It's fifteen euros." c="How much" a=["How much"] ds=["How many","How much are","What price"]
- `m1-u10-how-much-mc-001` [multiple-choice, d2]: p="Which question is correct?" c="How much are the shoes?" a=["How much are the shoes?"] ds=["How much is the shoes?","How much costs the shoes?","How many are the shoes?"]
- `m1-u10-how-much-mc-002` [gap-fill, d3]: p="Which answer is correct? 'How much is the hat?' – '_____ ten euros.'" c="It's" a=["It's"] ds=["They're","Is","It costs"]
- `m1-u10-how-much-mc-003` [gap-fill, d2]: p="Which answer is correct? 'How much are the sunglasses?' – '_____ twenty-five euros.'" c="They're" a=["They're"] ds=["It's","They costs","Are"]
- `m1-u10-how-much-ec-001` [error-correction, d2]: p="Find and fix the mistake: How much costs it?" c="How much is it?" a=["How much is it?","is"] ds=[]
- `m1-u10-how-much-ec-002` [error-correction, d2]: p="Find and fix the mistake: How much is the bananas?" c="How much are the bananas?" a=["How much are the bananas?","are"] ds=[]
- `m1-u10-how-much-ec-003` [error-correction, d3]: p="Find and fix the mistake: How many is the book?" c="How much is the book?" a=["How much is the book?","much"] ds=[]
- `m1-u10-how-much-tf-001` [transformation, d2]: p="Change the noun from singular to plural and adjust the verb: How much is the apple? → How much ___ the _____?" c="are" a=["are","How much are the apples?","How much are the apples"] ds=[]
- `m1-u10-how-much-qf-001` [question-formation, d3]: p="The pencil case costs twelve euros. Ask about the price." c="How much is the pencil case?" a=["How much is the pencil case?","How much is this pencil case?","How much is it?"] ds=[]
- `m1-u10-how-much-qf-002` [question-formation, d3]: p="The sunglasses cost thirty euros. Ask about the price." c="How much are the sunglasses?" a=["How much are the sunglasses?","How much are these sunglasses?","How much are they?"] ds=[]
- `m1-u10-how-much-tr-001` [translation, d2]: p="Translate into English: Wie viel kostet das T-Shirt?" c="How much is the T-shirt?" a=["How much is the T-shirt?","How much is the t-shirt?","How much is this T-shirt?"] ds=[]
- `m1-u10-how-much-tr-002` [translation, d3]: p="Translate into English: Wie viel kosten die Schuhe? – Sie kosten dreissig Euro." c="How much are the shoes? – They're thirty euros." a=["How much are the shoes? – They're thirty euros.","How much are the shoes? - They're thirty euros.","How much are the shoes? They're thirty euros.","How much are the shoes? – They are thirty euros.","How much are the shoes? – They're thirty euros","How much are the shoes? - they are thirty euros.","How much are the shoes? they are thirty euros."] ds=[]
- `m1-u10-how-much-gf-007` [gap-fill, d2]: p="How much ___ the jacket?" c="is" a=["is"] ds=["are","does","do"]
- `m1-u10-how-much-gf-008` [gap-fill, d2]: p="How much ___ the headphones?" c="are" a=["are"] ds=["is","does","do"]
- `m1-u10-how-much-gs-001` [group-sort, d2]: p="Sort: \"How much is\" or \"How much are\"?" c="{\"How much is\":[\"the book\",\"this pen\",\"a ticket\",\"the pizza\"],\"How much are\":[\"the shoes\",\"these apples\",\"two tickets\",\"the bananas\"]}" a=[] ds=[]

### `g1u10.s.this-that-these-those` — this/that – these/those (this/that – these/those (Demonstrativpronomen))

Pointing words: this/these for things near you, that/those for things further away.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [demonstratives-near]: Use this (singular) and these (plural) for things near you.
  - DE: Verwende this (Einzahl) und these (Mehrzahl) für Dinge in deiner Nähe.
  - "I'd like this T-shirt, Dad." — "Ich hätte gern dieses T-Shirt, Papa."
  - "I'd like these shoes." — "Ich hätte gern diese Schuhe."
- rule [demonstratives-far]: Use that (singular) and those (plural) for things further away.
  - DE: Verwende that (Einzahl) und those (Mehrzahl) für Dinge, die weiter weg sind.
  - "I'd like that red sweater." — "Ich hätte gern diesen roten Pullover (dort)."
  - "I'd like those blue trainers." — "Ich hätte gern diese blauen Turnschuhe (dort)."

common errors:
- Using a singular demonstrative with a plural noun.: ✗ "This shoes are nice." → ✓ "These shoes are nice."
- Using that with a plural noun.: ✗ "That books are interesting." → ✓ "Those books are interesting."

SB box `g1/sb/SB Unit 10- In a shop.txt#grammar-1` — ▶️ this/that – these/those:
```
[Image description: Illustrations showing T-shirt, shoes, and trainers with numbered labels 1-4]
1 I'd like this T-shirt, Dad. 3 I'd like that red sweater. 2 I'd like these shoes. 4 I'd like those blue trainers.
🔍 Schreib "weiter weg" und "nahe" in die Lücken und bilde die Regel.
Du verwendest this/these, um auf etwas hinzuweisen, das ¹.................................................... ist. Du verwendest that/those, um auf etwas hinzuweisen, das ².................................................... ist.
How much is/are ...?
So fragst du nach dem Preis: How much is ...? wird mit der Einzahl (Singular) verwendet, How much are ...? mit der Mehrzahl (Plural). Achtung: jeans = Plural!
How much is this scooter? How much are the green T-shirts? How much are the jeans? How much is that scooter? How much are those green T-shirts? How much are the jeans?
⏪ Now go back to page 76. Check ☑ with a partner what you know / can do.
🔵 WB p. 87, 88, 89, 90 🌐 CYBER Homework 30
```

v1 seed items (UNTRUSTED):
- `m1-u10-demonstratives-gf-001` [gap-fill, d1]: p="_____ is my pencil. (It's here in my hand.)" c="This" a=["This"] ds=["That","These","Those"]
- `m1-u10-demonstratives-gf-002` [gap-fill, d1]: p="_____ are my books. (They're here on my desk.)" c="These" a=["These"] ds=["This","That","Those"]
- `m1-u10-demonstratives-gf-003` [gap-fill, d2]: p="Look at _____ bird over there in the tree!" c="that" a=["that"] ds=["this","these","those"]
- `m1-u10-demonstratives-gf-004` [gap-fill, d2]: p="_____ shoes over there are really cool!" c="Those" a=["Those"] ds=["This","That","These"]
- `m1-u10-demonstratives-gf-005` [gap-fill, d3]: p="I like _____ T-shirt here, but I don't like _____ sweater over there." c="this, that" a=["this, that"] ds=["that, this","these, those","those, these"]
- `m1-u10-demonstratives-gf-006` [gap-fill, d3]: p="Are _____ your keys here on the table?" c="these" a=["these"] ds=["this","that","those"]
- `m1-u10-demonstratives-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="Those dogs over there are very loud." a=["Those dogs over there are very loud."] ds=["That dogs over there are very loud.","This dogs over there are very loud.","These dogs over there are very loud."]
- `m1-u10-demonstratives-mc-003` [gap-fill, d3]: p="Choose the correct option: '_____ flowers in the garden are beautiful.'" c="Those" a=["Those"] ds=["That","This","These"]
- `m1-u10-demonstratives-ec-001` [error-correction, d2]: p="Find and fix the mistake: This shoes are really nice." c="These shoes are really nice." a=["These shoes are really nice.","these"] ds=[]
- `m1-u10-demonstratives-ec-002` [error-correction, d2]: p="Find and fix the mistake: That books over there are interesting." c="Those books over there are interesting." a=["Those books over there are interesting.","those"] ds=[]
- `m1-u10-demonstratives-ec-003` [error-correction, d3]: p="Find and fix the mistake: These computer here is very fast." c="This computer here is very fast." a=["This computer here is very fast.","this"] ds=[]
- `m1-u10-demonstratives-tf-001` [transformation, d2]: p="Change from near to far: This pen is blue. → _____ pen over there is blue." c="That" a=["That","That pen over there is blue.","That pen over there is blue"] ds=[]
- `m1-u10-demonstratives-tf-002` [transformation, d3]: p="Change from singular to plural: This apple is green. → _____ apples are green." c="These" a=["These","These apples are green.","These apples are green"] ds=[]
- `m1-u10-demonstratives-tr-001` [translation, d2]: p="Translate into English: Das ist mein Hund. (The dog is near you.)" c="This is my dog." a=["This is my dog.","This is my dog"] ds=[]
- `m1-u10-demonstratives-tr-002` [translation, d3]: p="Translate into English: Das sind meine Buecher dort drueben." c="Those are my books over there." a=["Those are my books over there.","Those are my books over there"] ds=[]
- `m1-u10-demonstratives-sb-001` [sentence-building, d2]: p="Put the words in the correct order: are / these / favourite / my / shoes" c="These are my favourite shoes." a=["These are my favourite shoes."] ds=[]
- `m1-u10-demonstratives-mt-001` [matching, d2]: p="Match the demonstrative with the correct situation:" c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}"] ds=["1: one thing, near you|2: many things, near you|3: one thing, far away|4: many things, far away","a: that|b: this|c: those|d: these"]
- `m1-u10-demonstratives-gf-007` [gap-fill, d2]: p="___ trainers over there are really cool!" c="Those" a=["Those"] ds=["These","This","That"]
- `m1-u10-demonstratives-gf-008` [gap-fill, d2]: p="Can I have ___ apple here, please?" c="this" a=["this"] ds=["that","these","those"]
- `m1-u10-demonstratives-gs-001` [group-sort, d2]: p="Sort: which demonstrative — near (here) or far (there)?" c="{\"this / these (near)\":[\"book (here, one)|this book\",\"shoes (here, many)|these shoes\",\"___ is nice. (here)|This is nice.\",\"___ are mine. (here)|These are mine.\"],\"that / those (far)\":[\"house (there, one)|that house\",\"children (there, many)|those children\",\"___ is big. (there)|That is big.\",\"___ are old. (there)|Those are old.\"]}" a=[] ds=[]
- `m1-u10-demonstratives-gs-002` [group-sort, d2]: p="Sort: singular or plural demonstrative?" c="{\"Singular\":[\"this\",\"that\"],\"Plural\":[\"these\",\"those\"]}" a=[] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anderson, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chester, Chloe, Christie, Clare, Classroom, Clothes, Clown, Come, Complimenting, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Jenny, Jessica, Jill, John, Jolly, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mandy, Manson, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mrs, Mum, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Palace, Pardon, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Steve, Sue, Tamar, Tamara, Tammy, Text, Think, Tick, Toby, Tock, Tom, Tony, True, Um, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 10- In a shop.txt -----
Page 76
Unit 10: In a shop
At the end of unit 10 ...
you know ☐ the numbers 25–1,000 ☐ how to use this/that – these/those ☐ how to use How much is/are ...? ☐ what to say when shopping
you can ☐ understand and talk about prices ☐ understand a story in a shop ☐ write a shopping dialogue
VOCABULARY Numbers
3/11 🔊 1 Listen and tick. Then listen and repeat.
☐ thirty ☐ ninety ☐ forty ☐ one hundred ☐ fifty ☐ three hundred and twelve ☐ sixty ☐ four hundred and eighty-two ☐ seventy ☐ nine hundred and ninety-nine ☐ eighty ☐ one thousand
SPEAKING Talking about prices
3/12 🔊 2 Listen and say the prices.
£6.99 £29.99 £81.45 £12.25 £1,299.00 £117.50
[Image description: British banknotes and coins showing various denominations including £20, £10, £50, and £5 notes along with various coins]
🔵 WB p. 85, 86 🌐 CYBER Homework 28 (Revision)
Page 77
3 C H O I C E S
Find out How much are these prices in €?
3/13 🔊 A Work in pairs. Guess how much the objects are. Then listen and check.
[Image description: 12 numbered items with price tags showing: 1-T-shirt, 2-mobile phone, 3-sweets, 4-magazine, 5-computer game, 6-ear pods, 7-book, 8-headphones, 9-dog food, 10-key ring, 11-jeans, 12-scooter. Price tags on left show £8.99, £179.00, £34.99, £46.50, £3.50, £9.00. Price tags on right show 99p, £79.99, £5.50, £1.99, £69.99, £104.99]
3/14 🔊 B Listen to the shopping dialogues. Then read them and act them out.
👥
DIALOGUE 1
Boy How much are the jeans? Assistant They're £69.99. Boy And the T-shirt? Assistant It's £8.99. Or £13.99 for two. Boy Thank you.
DIALOGUE 2
Assistant Can I help you? Girl How much is the key ring? There's no price on it. Assistant The key rings are all £3.50. Girl Thank you. Assistant But look. You can get three for the price of two. Girl OK. I'll take three then. Assistant Anything else? Girl No, thank you.
LISTENING
3/15 🔊 4 Listen to The price is right, a guessing game. Then write the guesses and the real price.
(guess 1) (guess 2) (real price) £....................... £....................... £.......................
3/16 🔊 5 In pairs, guess how much the mobile phone and the headphones are. Then listen and check.
[Image description: Mobile phone and headphones with blank price tags showing £...................]
🔵 WB p. 88, 91 🌐 CYBER Homework 29
Page 78
READING
📖 6 Read the story.
The horse in the shop
Mr Anderson has got a small shop in a small town in the Midwest of the USA. Mr Anderson has got everything: food, things for the house and the garden, and clothes too.
Mr Anderson knows all his customers' names. Many of them are his friends. They like the shop, they like the food, the things for the house and the garden, and the clothes too. And they all love their chats with Mr Anderson.
It's a Wednesday. Mr Anderson is in the shop. There are no customers this morning. Mr Anderson sits down on his chair. He falls asleep.
Suddenly, he hears the doorbell. He opens his eyes. There's a horse in the shop!
"Can you help me, please?" someone says. It's the horse.
"Erm ... yes, of course!" Mr Anderson answers. "How can I help you, Mr ...?"
"The name is Jolly. Jolly Horse. I want to buy a lot of things today."
"Great," Mr Anderson thinks. "So, what would you like?"
[Image description: Illustration of a shop with shelves showing clothes and supplies, and a horse standing in the shop with a price tag showing $228.60]
"Well, first I'd like 40 kilos of beans. I love beans!" "Right. Beans. 40 kilos. What else?" "Then I'd like 30 kilos of rice." "OK, rice is nice," Mr Anderson says and he laughs. "And then I want 20 kilos of carrots." "OK," says Mr Anderson. "That's $120 for the beans, $60.60 for the rice and $48 for the carrots. So, that's ..." "$228.60," says the horse and gives him the money. "What a clever horse", Mr Anderson thinks. "Erm ... we don't often see horses in this shop!" he says. The horse looks around the shop. "No wonder, with your prices. Your things are very expensive! Goodbye!" The horse picks up the food and walks away.
7 How many of these tasks can you do?
1 Mr Anderson's shop is big / not big. 2 The customers think it's boring / great to have a chat with him. 3 On a Wednesday morning, there are no / lots of customers there. 4 Mr Anderson falls asleep. What happens then? ................................................................................ 5 Who says, "How can I help you?" ...................................................................................................... 6 What does the horse buy? ................................................................................................................. 7 Mr Anderson knows the horse. T / F 8 Mr Anderson thinks the horse is clever. T / F 9 Horses often come to the shop to buy things. T / F
3/17+18 🔊 8 Check your answers with a partner. Then listen to the story.
🔵 WB p. 90
Page 79
A SONG 4 U
3/19+20 🔊 9 Listen and sing.
Clever Jolly
Jolly is so clever. Yeah, Jolly is so wise. Jolly is the smartest horse. Hey, give that horse a prize.
Now Joe's in a bank. There are robbers everywhere. The horse pulls out a gun and shoots into the air.
Jolly is so clever. Yeah, Jolly is so wise. Jolly is the smartest horse. Hey, give that horse a prize.
[Image description: Illustration of a bank scene with robbers and a horse]
The robbers run away with horror in their eyes. Joe comes and pats his horse and says, "My horse is wise."
Jolly is so clever. Yeah, Jolly is so wise. Jolly is the smartest horse. Hey, give that horse a prize.
TIME FOR A SKETCH The jeans
3/21 🔊 10 Listen to the sketch. Then read it.
Assistant Can I help you? Boy Yes, please. How much is this T-shirt? Assistant £16.80. Do you like it? Boy I'm not sure. Assistant Look. That T-shirt is nice. Boy I don't like yellow. Forget T-shirts. I think I'd like a pair of socks first. How much are these socks? Assistant The blue socks? They're £19.99. Boy OK. How much are those socks over there in the window? Assistant Those are £11.99. Boy OK. I'm not sure. Forget socks. I think I'd like a pair of jeans. Assistant Do you like these blue jeans? Boy No. I don't like blue. Assistant No problem. What about those green jeans over there? Boy Erm ... I don't like green.
[Image description: Illustration of a clothing shop with people shopping]
Assistant You don't like the blue jeans. You don't like the green jeans. But don't worry. Do you like those orange jeans? Boy No. I don't like orange. Assistant Hmm ... Let me think. Boy Ah, I know. Can I try on the black jeans in the window, please? Assistant Try them on ... in the window? No, sorry. You can't try them on in the window. Go to the changing room*, please.
VOCABULARY: *changing room – Umkleidekabine
🔵 WB p. 89, 91
Page 80
SOUNDS RIGHT /ð/
3/22 🔊 11 Listen and repeat.
This blue shirt and these green socks – I can put them in this box! Those black trousers, this red sweater – in the drawer? Yes, that's better!
[Image description: Illustration of person organizing clothes]
WRITING
12 Look at the useful phrases for shopping below. Who says them? Write C (Customer), S (Shop assistant) or B (Both) next to the sentences.
☐ Can I help you? ☐ Have you got ... ? ☐ How much is this / are these? ☐ I'd like a ... . ☐ What can I do for you? ☐ You're welcome. ☐ What would you like? ☐ Good morning. Can I help you? ☐ Thank you very much, Madam. ☐ Can I try them on? ☐ That's £12.30. ☐ Goodbye. Have a nice day.
13 Now write your own shopping dialogue (60–80 words). Then act it out with a partner.
• Think about what things you want to buy. • Don't forget to say hello and goodbye. • Ask for the price, too.
GRAMMAR
▶️ this/that – these/those
[Image description: Illustrations showing T-shirt, shoes, and trainers with numbered labels 1-4]
1 I'd like this T-shirt, Dad. 3 I'd like that red sweater. 2 I'd like these shoes. 4 I'd like those blue trainers.
🔍 Schreib "weiter weg" und "nahe" in die Lücken und bilde die Regel.
Du verwendest this/these, um auf etwas hinzuweisen, das ¹.................................................... ist. Du verwendest that/those, um auf etwas hinzuweisen, das ².................................................... ist.
How much is/are ...?
So fragst du nach dem Preis: How much is ...? wird mit der Einzahl (Singular) verwendet, How much are ...? mit der Mehrzahl (Plural). Achtung: jeans = Plural!
How much is this scooter? How much are the green T-shirts? How much are the jeans? How much is that scooter? How much are those green T-shirts? How much are the jeans?
⏪ Now go back to page 76. Check ☑ with a partner what you know / can do.
🔵 WB p. 87, 88, 89, 90 🌐 CYBER Homework 30
Page 81
THE STORY OF THE STONES 5
▶️ Two more to go!
[Image description: Illustration showing two characters looking at a flying figure with eagle wings against a sunset sky]
Go to Reewood Hovel! It's on the foot. He needs on the foot! help! Go quick!
1 Before you watch episode 5, find out what the text message on Daniel's mobile is:
EVERYDAY ENGLISH
▶️ 2 Watch episode 5. Complete the dialogue with the phrases from the box.
Oh, come on I'm not sure be careful Just a minute
Emma ¹.......................................................................... . This message is from ... ? Daniel I don't know. Sunborn, I guess – but ².......................................................................... . Emma I'm sure it's a trap. Let's not go! Sarah ³.......................................................................... . We're fast. We're strong. We're clever. What do you think, Daniel? Daniel I'm not sure ... Remember the net! Remember Darkman! He's bad and he's clever. Sarah Listen. I can fly. Nothing can happen to me. I want to check it out, OK? Emma OK. But Sarah – ⁴.......................................................................... !
3 Do the puzzle. Find the name of the person.
1 The name of the boy who changes into a rat. 2 The name of the girl who changes into an eagle. 3 The colour of Emma's stone. 4 Come at seven o'........................ . 5 The name of the girl who changes into a tiger. 6 Sarah changes into this animal. 7 There are three of them.
[Image description: Crossword puzzle grid with numbered rows 1-7]


----- WB: WB Unit 10 In a shop.txt -----
Unit 10 In a shop
Pages 85-86
UNDERSTANDING VOCABULARY Numbers and prices
1 Write the words from the box next to the numbers.
[Word bank:] fifty eighty sixty forty seventy ninety one hundred thirty five hundred one thousand
[Image of a notebook with numbers and decorative elements like pencils, croissant, and pill]
30 ......................................... 80 ......................................... 40 ......................................... 90 ......................................... 50 ......................................... 100 ......................................... 60 ......................................... 500 ......................................... 70 ......................................... 1,000 .........................................
2 Write the prices into the picture.
[Speech bubble text:] Four T-shirts for thirty pounds! Jeans for only twenty-five pounds. All dresses only forty-two pounds.
[Large illustration of a clothing shop with numbered items 1-6 showing: T-shirts, jeans, dresses, leather jacket, trainers, and sweaters. A shop assistant and customer are shown.]
[Bottom speech bubble text:] A leather jacket for eighty pounds! Trainers for fifty pounds only. Three sweaters for ninety pounds.
Pages 86-87
USING VOCABULARY Numbers and prices
3 Match the sentences with the prices.
1 The book is seven pounds ninety-nine. £60.75 2 The T-shirt is nine pounds eighty. £276 3 The shoes are fifty-five pounds ninety. £3.90 4 The trainers are sixty pounds seventy-five. £22.55 5 The laptop is four hundred and forty-five pounds. £55.90 6 The guitar is two hundred and seventy-six pounds. £7.99 7 The pen is three pounds ninety. £445 8 The jeans are twenty-two pounds fifty-five. £9.80
4 Write the words.
37 ......................................... 13 ......................................... 44 91 19 ......................................... .........................................
246 .........................................
29 12 1,000 ......................................... ......................................... ......................................... 173 .........................................
358 .........................................
14 54 15 31 ......................................... ......................................... ......................................... ......................................... 87 .........................................
792 .........................................
Pages 87-88
UNDERSTANDING GRAMMAR How much is / are ... ?
5 Complete the sentences with is or are.
1 How much ......................... the pen? – It ..................... £1.50. 2 How much ......................... the scissors? – They ..................... £2.92. 3 How much ......................... the jeans? – They ..................... £69.99. 4 How much ......................... the book? – It ..................... £9.55. 5 How much ......................... the trainers? – They ..................... £74.59. 6 How much ......................... the pencil case? – It ..................... £8.59.
UNDERSTANDING GRAMMAR this / that – these / those
6 Circle the correct word.
1 How much are that / those shoes? 5 How much are this / these bananas? 2 Do you know this / these boys? 6 I don't like that / those dog. 3 She doesn't want that / those dress. 7 I'd like this / these cap, please. 4 Do you want this / these sandwich? 8 That / Those boys are in a band.
7 Look at the pictures and complete the sentences with this, that, these or those.
[Nine illustrations showing various scenarios:
Two people at lockers
Two people at a table with food
People at a hamburger stand
People at pink lockers
Two people with sports equipment
Person in a room with furniture
Two people outdoors
Person holding colorful items
Three people near a bus]
1 Who are those girls? 6 ......................... shoes are too big! 2 I don't like ......................... chicken. 7 Are ......................... your dogs? 3 Is ......................... hamburger good? 8 I really like ......................... socks! 4 Are ......................... your trainers? 9 Is ......................... your sister? 5 ......................... is my favourite video game!
Pages 88-89
USING GRAMMAR How much is / are ...?
8 CHOICES
A Match the clothes with the prices. Then write the questions and the answers.
[Illustration showing 8 clothing items with tangled lines connecting to price tags:]
Green jacket
Blue shirt
Pink dress
Red shoes
Green trousers
Beige trainers
Cap
Teal sweater
[Price tags: £34.99, £19.00, £45.00, £28.50, £75.00, £12.50, £27.50, £55.00]
1 How much is the jacket? It's £75.00. 2 ............................................................................................... ................................................ 3 ............................................................................................... ................................................ 4 ............................................................................................... ................................................ 5 ............................................................................................... ................................................ 6 ............................................................................................... ................................................ 7 ............................................................................................... ................................................ 8 ............................................................................................... ................................................
B Look at the pictures. Write about the different prices.
[Two illustrations labeled A and B showing clothing displays with price tags: Picture A shows: coat (£129), dress (£92), shirt (£19.92), skirt (£27.93), shoes (£19.2), hat (£8.50) Picture B shows: jacket (£135), t-shirt (£99), trousers (£21.99), skirt (£19), shoes (£38), hat (£8.20)]
In picture A, the cap is £8.50, in picture B it is £8.20. ............................................................................................... ............................................................................................... ............................................................................................... ............................................................................................... ............................................................................................... ............................................................................................... ...............................................................................................
Pages 89-90
USING GRAMMAR this / that – these / those
1/32
9 Complete the dialogue with this, that, these or those. Then listen and check.
Shop assistant Can I help you?
Boy Yes, please. I'd like running shoes. How much are ¹.......................... trainers here?
Shop assistant ².......................... here aren't for running. They're for basketball.
Boy Alright. Then give me ³.......................... green trainers over there.
Shop assistant I'm sorry. ⁴.......................... over there are all for volleyball.
Boy And ⁵.......................... blue shoes in the box here?
Shop assistant Well, ⁶.......................... shoes here are for running in the woods, and ⁷.......................... shoes over there are ...
Boy Alright. Stop it, please! Give me the blue running shoes. And I'd like a T-shirt.
Shop assistant ⁸.......................... T-shirt here is for basketball. And ⁹.......................... T-shirt over there is for beach volleyball. And ¹⁰.......................... blue T-shirt over there is for running. What would you like?
Boy The blue running shoes and the blue T-shirt, of course.
10 Complete the dialogue. There are two words missing in each line.
Shop assistant Good ¹...... morning ..... . .......... Can .......... I help you?
Girl Yes. I want to ².......................... .......................... shoes.
Shop assistant I've got ³.......................... .......................... ones.
Girl I don't like ⁴.......................... .......................... much. I don't like red.
Shop assistant OK. How ⁵.......................... .......................... green walking shoes in the window?
Girl Yes, I like those shoes. How ⁶.......................... .......................... they?
Shop assistant ⁷.......................... .......................... £32.
Girl Great. I'll take them!
Shop assistant Of course. Is there anything else?
Girl ⁸.......................... .......................... see that cap up there behind you?
Shop assistant Yes, here you are.
Girl I like it. How much ⁹.......................... .......................... cap?
Shop assistant It's £12.
Girl OK. Can I have this cap as well?
Shop assistant Certainly. That ¹⁰.......................... .......................... , please.
[Illustration showing a shop scene with a girl and shop assistant, with shelves of shoes and caps visible]
Pages 90-91
READING & WRITING Understanding a story in a shop / Writing a shopping dialogue
11 Read the story. How many of the tasks below can you do?
One more surprise for Mr Anderson
It's a Sunday. Mr Anderson goes to town with Mrs Anderson. She wants to see the flower* show. Mr Anderson is not very interested in flowers. So he sits down under a tree and reads a book. He loves the book. It's about his favourite sport, horse racing*.
[Illustration showing people at a flower show]
An hour later, a strong wind starts. It's really cold now. "Let's run home!" says Mrs Anderson. They run home as fast as* they can.
In the evening, Mr Anderson wants to read his book again. But he can't find it! Mr Anderson is very sad. "How silly I am!" he thinks.
The next day, Mr Anderson is in his shop. Mr Anderson is still very sad about his book. Suddenly he can hear the doorbell. "Ah, a customer," he thinks. And who does he see? It's Jolly Horse. "Oh, hello!" says Mr Anderson, "What would you like to buy this morning?" "Oh, I don't want to buy anything today. But I'd like to give you this!" Jolly puts something on the table. "Erm ... but ... this ... is ... my er ... book!" says Mr Anderson. "I know you are a clever horse, but how do you know this is MY book?" says Mr Anderson.
"That's easy!" says Jolly. "It's got your name in it!" Then the horse leaves the shop.
[Illustration showing Mr Anderson with a book labeled "Mr Anderson"]
1 On Sunday, Mr Anderson is in town with ☐ his daughter. ☐ a friend. ☐ his wife*.
2 Mrs Anderson goes to a flower show. Mr Anderson ☐ reads the newspaper. ☐ talks to a friend. ☐ reads his book.
3 A strong wind starts and Mr and Mrs Anderson ☐ feel hungry. ☐ feel sad. ☐ run home.
4 In the evening, Mr Anderson is sad about his book. T / F
5 The next day, Mr Anderson doesn't go to his shop. T / F
6 In the afternoon, Jolly Horse enters the shop. T / F
7 What does Mr Anderson think? .........................................................................................................
8 What does the horse want to do in the shop? ..................................................................................
9 How do you think Jolly feels when he leaves the shop? ..................................................................
*VOCABULARY: flower – Blume; horse racing – Pferderennen, as ... as – so ... wie; wife – Ehefrau
1/33
12 Listen and check your answers.
13 Mrs Anderson wants to buy 12 roses. She wants them to be three different colours. Write a shopping dialogue.
[Illustration showing a flower shop with colorful roses]
Pages 91-92
LISTENING & DIALOGUE WORK Talking about prices
1/34
14 Put the dialogues in the correct order. Then listen and check.
[Two illustrations showing shop scenes - one in a shoe shop, one in a stationery/pen shop]
DIALOGUE 1 ☐ A Bye. ☐ A How much are the trainers? ☐ A Are they good for running? ☐ A OK. Here you are. ☐ B Thank you. ☐ B They're £34.90. ☐ B Bye. ☐ B Yes, they're very good.
DIALOGUE 2 ☐ A Thank you. ☐ A That's £4, please. ☐ A That pen. It's £1.50. Or three for £4. ☐ A Can I help you? ☐ B Here you are. ☐ B Yes, please. How much is this pen? There's no price on it. ☐ B OK. Three pens, please.
1/35
15 Listen and write the prices.
[Large illustration of a shop showing various items with blank price tags: mobile phones, clothing items (jacket, hoodie, trousers, t-shirt), scooter, computer games, and keychains]
Page 92
WORD FILE
Numbers
20 twenty 30 thirty 40 forty 50 fifty 60 sixty 70 seventy 80 eighty 90 ninety 100 one hundred 1000 one thousand
MORE Words and Phrases
	English	Example	German
	how much is/are ...	How much are the trainers?	wie viel kostet/kosten ...
	price	The price is six pounds ninety-nine.	Preis, Rechnungsbetrag
	these	I'd like these shoes here.	diese
	those	I'd like those trainers over there.	jene
8	Anything else?		Darf es noch etwas sein?
	Can I help you?		Kann ich dir/Ihnen behilflich sein?
	computer game	How much is the computer game?	Computerspiel
	headphones	She can't hear you. She has headphones on.	Kopfhörer
	key ring	I put my key on a key ring.	Schlüsselanhänger
	magazine	Can I buy this magazine?	Zeitschrift, Magazin
	mobile phone	Can I have a new mobile phone?	Mobiltelefon, Handy
	scooter	I ride my scooter to school.	Roller
	sweets (pl)	The sweets are one ninety-nine.	Süßigkeiten
	tin	A tin of chicken soup, please.	Dose
4	Congratulations!		Herzlichen Glückwunsch!
	rule	You know the rules.	Regel
6	customer	His customers like to come to the shop.	Kunde/Kundin
	everything	Have you got everything?	alles
	expensive	The things in this shop are very expensive.	teuer
	to fall asleep	Mr Anderson sits on his chair and falls asleep.	einschlafen
	Goodbye.		Auf Wiedersehen., Tschüss.
	I'd like ...	I'd like 20 kilos of rice.	Ich hätte gerne ... , Ich möchte ...
	No wonder.		Kein Wunder.
	suddenly	Suddenly, he hears the doorbell.	plötzlich, auf einmal
	town	There's an old shop in the town.	Stadt
	to walk away	The horse picks up the food and walks away.	weggehen, fortgehen
10	changing room	You can try them on in the changing room.	Umkleidekabine
	No problem.		Kein Problem.
	over there	How much are those socks over there in the window?	da/dort drüben
11	drawer	All my socks are in the drawer.	Schublade
	That's better.		So ist es besser.
12	What can I do for you?		Was kann ich für dich/Sie tun?
S5	Be careful.		Pass(t) auf.; Sei(d) vorsichtig.
	Just a minute.		Einen Augenblick bitte., Moment mal.

```

## Output contract

Write `content/corpus/units/g1-u10/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u10",
  "briefBank": "219f364b86ff",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u10.s.how-much",
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
