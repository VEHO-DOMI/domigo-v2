# Grammar generation brief — g1-u06 (MORE! 1, Unit 6)

<!-- domigo:gen grammar g1-u06 bank=dfbe7bb08bcd prompt=4b9164076103 -->

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

### `g1u06.s.a-lot-of` — a lot of / lots of (a lot of / lots of – viel(e))

Expressing a large quantity with a lot of or lots of, used with countable and uncountable nouns.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [a-lot-of-usage]: a lot of and lots of both mean many/much and work with countable and uncountable nouns.
  - DE: a lot of und lots of bedeuten beide viel/viele und passen zu zählbaren und unzählbaren Nomen.
  - "a lot of homework / lots of homework" — "viel Hausübung"
  - "a lot of books / lots of books" — "viele Bücher"

common errors:
- Writing a lots of instead of a lot of.: ✗ "I have a lots of books." → ✓ "I have a lot of books."
- Leaving out of before the noun.: ✗ "She has a lot friends." → ✓ "She has a lot of friends."

SB box `g1/sb/SB Unit 6- The world's best detective.txt#grammar-1` — ▶️ Present simple:
```
Wenn du sagst I like ice cream, dann bedeutet das, dass du im Allgemeinen gern Eis magst. Diese Zeitform nennt man das Present simple.
Singular	Plural
I love dogs.	We love our cat.
You live in Vienna.	They live in Oxford.

Wenn du über eine Person, ein Tier oder ein Ding sprichst, dann musst du beim Verb ein -s anhängen.
He lives in London. My dog loves ice cream. She plays football.
Achtung:
go – goes carry – carries watch – watches catch – catches wash – washes
[Image description: Illustration of a dog playing football with text "Our dog plays football."]
Du verwendest das Present simple auch, um eine Geschichte oder einen Witz im Präsens zu erzählen.
I'm in bed. I hear something. I get up. I ... Sherlock Groans leaves his house. He goes to the park. He sees ...
a lot of / lots of
Für "viel/viele" kannst du im Englischen sowohl a lot of als auch lots of verwenden.
a lot of homework / lots of homework a lot of books / lots of books a lot of different colours / lots of different colours
⏪ Now go back to page 46. Check ☑ with a partner what you know / can do.
🔵 WB p. 51, 52, 55 🌐 CYBER Homework 18
```

v1 seed items (UNTRUSTED):
- `m1-u6-a-lot-of-gf-001` [gap-fill, d1]: p="She has got ___ friends at school.." c="a lot of" a=["a lot of","lots of"] ds=["a lots of","lot of","a lot"]
- `m1-u6-a-lot-of-gf-002` [gap-fill, d2]: p="There are ___ trees in the park.." c="lots of" a=["lots of","a lot of"] ds=["a lots of","lot of","lots"]
- `m1-u6-a-lot-of-gf-003` [gap-fill, d2]: p="My brother eats ___ fruit every day.." c="a lot of" a=["a lot of","lots of"] ds=["a lots of","a lot","many of"]
- `m1-u6-a-lot-of-gf-004` [gap-fill, d3]: p="We have got ___ homework today." c="a lot of" a=["a lot of","lots of"] ds=["a lots of","a lot","lot of"]
- `m1-u6-a-lot-of-gf-005` [gap-fill, d4]: p="He drinks ___ water, but he doesn't drink ___ juice." c="a lot of ... a lot of" a=["a lot of ... a lot of","lots of ... lots of","a lot of ... lots of","lots of ... a lot of"] ds=["a lots of ... a lots of","a lot ... a lot","lot of ... lot of"]
- `m1-u6-a-lot-of-mc-001` [multiple-choice, d1]: p="Choose the correct sentence:" c="I have a lot of books." a=["I have a lot of books."] ds=["I have a lots of books.","I have a lot books.","I have lot of books."]
- `m1-u6-a-lot-of-mc-003` [multiple-choice, d4]: p="Which TWO sentences are correct?" c="She has a lot of friends. / She has lots of friends." a=["She has a lot of friends. / She has lots of friends."] ds=["She has a lots of friends.","She has a lot friends.","She has lot of friends."]
- `m1-u6-a-lot-of-ec-001` [error-correction, d2]: p="Find and fix the mistake: There are a lots of animals in the zoo." c="There are a lot of animals in the zoo." a=["There are a lot of animals in the zoo.","There are lots of animals in the zoo.","lot"] ds=[]
- `m1-u6-a-lot-of-ec-002` [error-correction, d3]: p="Find and fix the mistake: She has a lot friends in her class." c="She has a lot of friends in her class." a=["She has a lot of friends in her class.","She has lots of friends in her class.","of"] ds=[]
- `m1-u6-a-lot-of-ec-003` [error-correction, d4]: p="Find and fix the mistake: I eat lot of fruit every day." c="I eat a lot of fruit every day." a=["I eat a lot of fruit every day.","I eat lots of fruit every day."] ds=[]
- `m1-u6-a-lot-of-tf-001` [transformation, d2]: p="Rewrite using 'a lot of': She has many books. → She has ___ books." c="a lot of" a=["a lot of","lots of","She has a lot of books.","She has a lot of books"] ds=[]
- `m1-u6-a-lot-of-tf-002` [transformation, d4]: p="Rewrite using 'lots of': We have a lot of homework. → We have ___ homework." c="lots of" a=["lots of","We have lots of homework.","We have lots of homework"] ds=[]
- `m1-u6-a-lot-of-tr-001` [translation, d2]: p="🇩🇪 Es gibt viele Kinder im Park." c="There are a lot of children in the park." a=["There are a lot of children in the park.","There are lots of children in the park.","There are a lot of kids in the park.","There are lots of kids in the park."] ds=[]
- `m1-u6-a-lot-of-tr-002` [translation, d4]: p="🇩🇪 Wir haben viel Wasser, aber nicht viel Saft." c="We have a lot of water, but not a lot of juice." a=["We have a lot of water, but not a lot of juice.","We have lots of water, but not lots of juice.","We have a lot of water but not a lot of juice.","we've a lot of water, but not a lot of juice.","we've lots of water, but not lots of juice.","we've a lot of water but not a lot of juice.","We have lots of water but not lots of juice.","we've lots of water but not lots of juice."] ds=[]
- `m1-u6-a-lot-of-sb-001` [sentence-building, d2]: p="Put the words in the correct order: of / has / a / She / friends / lot" c="She has a lot of friends." a=["She has a lot of friends.","She has lots of friends."] ds=[]
- `m1-u6-a-lot-of-mt-001` [matching, d3]: p="Match the correct form to the sentence: 1) She has ___ books.  2) There is ___ water.  3) They eat ___ fruit.  4) We have ___ homework. — a) a lot of  b) a lot of  c) lots of  d) a lot of" c="{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"a\",\"2\":\"b\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u6-a-lot-of-gf-006` [gap-fill, d5]: p="They have got ___ (a lot of / pets) and ___ (a lot of / toys) for them." c="a lot of pets and a lot of toys" a=["a lot of pets and a lot of toys","lots of pets and lots of toys"] ds=["a lots of pets and a lots of toys","a lot pets and a lot toys","lot of pets and lot of toys"]
- `m1-u6-a-lot-of-gf-007` [gap-fill, d2]: p="We have got ___ friends at school." c="a lot of" a=["a lot of","lots of"] ds=["a lot","lot of","many of"]
- `m1-u6-a-lot-of-gf-008` [gap-fill, d2]: p="There is ___ water in the bottle." c="a lot of" a=["a lot of","lots of"] ds=["a lot","many","much"]
- `m1-u6-a-lot-of-gs-001` [group-sort, d2]: p="Sort: countable or uncountable noun?" c="{\"Countable\":[\"books\",\"friends\",\"dogs\",\"apples\",\"students\"],\"Uncountable\":[\"water\",\"homework\",\"money\",\"time\",\"music\"]}" a=[] ds=[]

### `g1u06.s.present-simple` — Present simple (affirmative) (Present simple (bejahte Form))

Talking about habits, likes and facts. Base form for I/you/we/they; add -s for he/she/it.

v1 floor for this structure: **26 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [present-simple-base]: Use the present simple for habits, likes and general facts. I/you/we/they use the base form of the verb.
  - DE: Das Present simple verwendest du für Gewohnheiten, Vorlieben und allgemeine Tatsachen. I/you/we/they verwenden die Grundform des Verbs.
  - "I love dogs." — "Ich liebe Hunde."
  - "They live in Oxford." — "Sie wohnen in Oxford."
- rule [present-simple-third-person-s]: For he/she/it add -s to the verb.
  - DE: Bei he/she/it hängst du ein -s an das Verb.
  - "He lives in London." — "Er wohnt in London."
  - "She plays football." — "Sie spielt Fußball."
- rule [present-simple-spelling]: Spelling for he/she/it: verbs ending in -o, -ch, -sh, -s, -x add -es; consonant + y changes to -ies.
  - DE: Schreibweise bei he/she/it: Verben auf -o, -ch, -sh, -s, -x bekommen -es; Konsonant + y wird zu -ies.
  - "go → goes, watch → watches" — "go → goes, watch → watches"
  - "carry → carries" — "carry → carries"

common errors:
- Forgetting the -s for he/she/it (the #1 learner error).: ✗ "She play tennis every day." → ✓ "She plays tennis every day."
- Wrong spelling of a third-person form.: ✗ "He playes football." → ✓ "He plays football."

SB box `g1/sb/SB Unit 6- The world's best detective.txt#grammar-1` — ▶️ Present simple:
```
Wenn du sagst I like ice cream, dann bedeutet das, dass du im Allgemeinen gern Eis magst. Diese Zeitform nennt man das Present simple.
Singular	Plural
I love dogs.	We love our cat.
You live in Vienna.	They live in Oxford.

Wenn du über eine Person, ein Tier oder ein Ding sprichst, dann musst du beim Verb ein -s anhängen.
He lives in London. My dog loves ice cream. She plays football.
Achtung:
go – goes carry – carries watch – watches catch – catches wash – washes
[Image description: Illustration of a dog playing football with text "Our dog plays football."]
Du verwendest das Present simple auch, um eine Geschichte oder einen Witz im Präsens zu erzählen.
I'm in bed. I hear something. I get up. I ... Sherlock Groans leaves his house. He goes to the park. He sees ...
a lot of / lots of
Für "viel/viele" kannst du im Englischen sowohl a lot of als auch lots of verwenden.
a lot of homework / lots of homework a lot of books / lots of books a lot of different colours / lots of different colours
⏪ Now go back to page 46. Check ☑ with a partner what you know / can do.
🔵 WB p. 51, 52, 55 🌐 CYBER Homework 18
```

v1 seed items (UNTRUSTED):
- `m1-u6-present-simple-affirmative-gf-001` [gap-fill, d1]: p="She ___ (play) tennis every Saturday." c="plays" a=["plays"] ds=["play","playes","plais"]
- `m1-u6-present-simple-affirmative-gf-002` [gap-fill, d2]: p="He ___ (watch) TV every evening." c="watches" a=["watches"] ds=["watchs","watch","watchies"]
- `m1-u6-present-simple-affirmative-gf-003` [gap-fill, d2]: p="My dad ___ (go) to work by bus." c="goes" a=["goes"] ds=["gos","go","gois"]
- `m1-u6-present-simple-affirmative-gf-004` [gap-fill, d3]: p="She ___ (carry) her books to school every day." c="carries" a=["carries"] ds=["carrys","carry","carryes"]
- `m1-u6-present-simple-affirmative-gf-005` [gap-fill, d3]: p="We ___ (like) pizza and they ___ (like) pasta." c="like ... like" a=["like ... like"] ds=["likes ... like","like ... likes","likes ... likes"]
- `m1-u6-present-simple-affirmative-mc-001` [gap-fill, d1]: p="My sister ___ to school every day." c="walks" a=["walks"] ds=["walk","walkes","walking"]
- `m1-u6-present-simple-affirmative-mc-002` [gap-fill, d3]: p="She ___ very hard for her tests." c="studies" a=["studies"] ds=["studys","studyes","study"]
- `m1-u6-present-simple-affirmative-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="Every day she eats an apple." a=["Every day she eats an apple."] ds=["Every day eats she an apple.","Every day she eat an apple.","She every day eats an apple."]
- `m1-u6-present-simple-affirmative-ec-001` [error-correction, d2]: p="Find and fix the mistake: She drink milk every morning." c="She drinks milk every morning." a=["She drinks milk every morning.","drinks"] ds=[]
- `m1-u6-present-simple-affirmative-ec-002` [error-correction, d3]: p="Find and fix the mistake: He gos to school by bus." c="He goes to school by bus." a=["He goes to school by bus.","goes"] ds=[]
- `m1-u6-present-simple-affirmative-sb-003` [sentence-building, d4]: p="Put the words in the correct order: morning / Every / walks / she / to / school" c="Every morning she walks to school." a=["Every morning she walks to school.","Every morning she walks to school"] ds=[]
- `m1-u6-present-simple-affirmative-tf-001` [transformation, d2]: p="Change the subject to 'he': I play football every day. → He ___ football every day." c="plays" a=["plays","He plays football every day.","He plays football every day"] ds=[]
- `m1-u6-present-simple-affirmative-tf-002` [transformation, d3]: p="Change the subject to 'she': I wash the dishes. → She ___ the dishes." c="washes" a=["washes","She washes the dishes.","She washes the dishes"] ds=[]
- `m1-u6-present-simple-affirmative-tr-001` [translation, d2]: p="🇩🇪 Er spielt jeden Tag Fussball." c="He plays football every day." a=["He plays football every day.","He plays soccer every day.","Every day he plays football","Every day he plays soccer"] ds=[]
- `m1-u6-present-simple-affirmative-tr-002` [translation, d4]: p="🇩🇪 Jeden Morgen geht sie in die Schule." c="Every morning she goes to school." a=["Every morning she goes to school.","She goes to school every morning."] ds=[]
- `m1-u6-present-simple-affirmative-sb-001` [sentence-building, d3]: p="Put the words in the correct order: to / every / she / school / walks / day" c="She walks to school every day." a=["She walks to school every day.","Every day she walks to school."] ds=[]
- `m1-u6-present-simple-affirmative-mt-001` [matching, d2]: p="Match the verb to its correct 3rd person form: 1) go  2) watch  3) study  4) play — a) watches  b) plays  c) studies  d) goes" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"b\"}"] ds=[]
- `m1-u6-present-simple-affirmative-ec-004` [error-correction, d5]: p="Find and fix the mistake: My cat wash its face every day." c="My cat washes its face every day." a=["My cat washes its face every day.","washes"] ds=[]
- `m1-u6-present-simple-affirmative-gf-007` [gap-fill, d2]: p="She ___ (walk) to school every morning." c="walks" a=["walks"] ds=["walk","is walking","walkes"]
- `m1-u6-present-simple-affirmative-gf-008` [gap-fill, d3]: p="He ___ (watch) TV after dinner every day." c="watches" a=["watches"] ds=["watchs","watch","watching"]
- `m1-u6-present-simple-affirmative-cp-001` [context-picker, d2]: p="Your friend does sport every Saturday. Which sentence describes her habit correctly?" c="She plays tennis every Saturday." a=["She plays tennis every Saturday."] ds=["She is playing tennis every Saturday.","She play tennis every Saturday.","She played tennis every Saturday."]
- `m1-u6-present-simple-affirmative-cp-002` [context-picker, d2]: p="You talk about your morning routine. Which sentence is correct?" c="I usually walk to school." a=["I usually walk to school."] ds=["I am usually walking to school.","I usually walks to school.","I usually walked to school."]
- `m1-u6-present-simple-affirmative-qf-001` [question-formation, d3]: p="Statement: She likes chocolate. Ask about WHAT." c="What does she like?" a=["What does she like?","What does she like"] ds=[]
- `m1-u6-present-simple-affirmative-gs-001` [group-sort, d2]: p="Which subjects use the base form, and which add -s?" c="{\"Base form (no -s)\":[\"I + play|I play\",\"you + play|you play\",\"we + play|we play\",\"they + play|they play\"],\"Third person (-s)\":[\"he + play|he plays\",\"she + play|she plays\",\"it + play|it plays\"]}" a=[] ds=[]
- `m1-u6-present-simple-affirmative-gs-002` [group-sort, d3]: p="How does each verb form the third person -s?" c="{\"Add -s\":[\"play|plays\",\"eat|eats\",\"read|reads\",\"like|likes\"],\"Add -es\":[\"go|goes\",\"watch|watches\",\"wash|washes\",\"do|does\"],\"Change -y to -ies\":[\"study|studies\",\"carry|carries\",\"try|tries\"]}" a=[] ds=[]
- `m1-u6-present-simple-affirmative-mp-001` [matching-pairs, d2]: p="Find the pairs: base form ↔ third person form." c="[[\"play\",\"plays\"],[\"go\",\"goes\"],[\"watch\",\"watches\"],[\"study\",\"studies\"],[\"have\",\"has\"],[\"do\",\"does\"]]" a=[] ds=[]

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?
- **g1-u05**: keyboard player, keyboard, singer, drummer, drums, saxophone player, saxophone, guitarist, guitar, boyfriend, its, to play, sister, can, cannot / can't, concert, to dance, Don't worry., job, perfect, to carry, to stand on, tongue, to touch, to walk on, to wiggle, can, to drink, hundred, in one go, Is that so?, This is me., economy, hospital, to laugh, (pocket) money, pound, profit, school canteen, table, teacher, uncle, to wash, nothing, Sorry?
- **g1-u06**: city, park, street, market, supermarket, river, woods, tree, to jump into the river, to look out the window, to pick something up, to sit in a tree, to fall out of the tree, to bump into a tree, to go to the park, to pull, to climb up a tree, to leave the office, to look in the mirror, to climb, to jump, to leave, mirror, to put on, away, (world's) best, detective, Help me!, office, to run, to find, to pull, to catch, clever, to come to, to live, nice, a lot of / lots of, to call, Come on!, to solve, to wait, to watch, street, to get up, to become, But it's true!, Go on., Well done.

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Annie, Arbeit, Bacon, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Christie, Classroom, Clown, Dan, Dana, Daniel, Dave, David, Davis, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, England, English, False, Fido, Frank, Fred, Freddy, George, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Holmes, Homework, Hook, Imperatives, Irregular, Jack, James, Jamie, Jenny, Jessica, Jill, Julia, Jun, Kitty, Leah, Leo, Lewis, London, Lucy, Mail, Manchester, Marple, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Pardon, Paws, Pete, Peter, Pirates, Plural, Polly, Possessives, Prepositions, Present, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Saying, School, Sherlock, Steve, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Watson, Welcome, Well, Work, Wortes, Wow, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 6- The world's best detective.txt -----
Page 46
Unit 6: The world's best detective
At the end of unit 6 ...
you know ☐ 14 action verbs ☐ how to use the present simple ☐ how to use a lot of / lots of
you can ☐ understand and tell a detective story ☐ understand a comic ☐ write a detective story
VOCABULARY
2/12 🔊 1 Listen and look at the pictures. Then number the words.
[Image description: 10 numbered illustrations showing various actions]
☐ fall out of the window ☐ mirror ☐ climb up a tree ☐ close a door ☐ smile ☐ put on a hat ☐ take off a hat ☐ open a window ☐ jump ☐ leave
READING
📖 2 Read the story.
The lost bird
Sherlock Groans is in his office. He looks in the mirror. He smiles. He puts his hat on. He's the world's best detective! He opens the window. It's a nice day.
"Sherlock!" says a woman. It's his friend, Doctor Grey.
"Good morning, Doctor!" says Sherlock. "How are you?"
"I'm fine, thank you, Sherlock," says Doctor Grey. "There is a man here. He has a problem. Can you help him?"
"Yes! I can help him," says Sherlock. "Bring him in!"
Doctor Grey leaves the office and closes the door. Sherlock looks out the window. Oh no! His hat! His hat falls out of the window.
Sherlock runs out of the office and into the reception room*.
"Sherlock, this is ...", says Doctor Grey. There is an old man next to her.
"Sorry!" says Sherlock.
Sherlock goes out the door and runs down the street. He looks for his hat. There! It's in a tree. He climbs up the tree. He picks up his hat. There's a blue bird in his hat!
"Go away!" says Sherlock. The bird jumps on his head.
"OK. Fine!" says Sherlock. He puts the hat on his head. Sherlock climbs down the tree. He walks back to the office. Doctor Grey and the old man are in his office.
"Good morning. Sherlock Groans," says the man. "Please help me. I can't find my bird!"
Sherlock looks at the man. He takes his hat off.
"Umm ... is this your bird?" asks Sherlock. The old man looks at the blue bird.
"Yes! WOW! Sherlock Groans, you are the world's best detective!"
[Image description: Illustration of Sherlock with the old man and the bird]
VOCABULARY: *reception room – Wartezimmer
🔵 WB p. 49, 53 🌐 CYBER Homework 16 (Revision)
Page 47
3 How many of these tasks can you do?
1 Sherlock Groans is in the park. T / F 2 Sherlock Groans closes the window. T / F 3 Doctor Grey is Sherlock's friend. T / F 4 Sherlock Groans looks for his hat / his bird / his friend. 5 The hat is in the street / on the window / in the tree. 6 Sherlock Groans puts the bird in the tree / in his jacket / under his hat. 7 Doctor Grey and the old man are .................................................................................................... . 8 The old man can't find ..................................................................................................................... . 9 The old man thinks Sherlock Groans is ........................................................................................... .
2/13+14 🔊 4 Check your answers with a partner. Then listen to the story.
SPEAKING Telling a detective story
👤 5 Look at the pictures. Tell the story "Sherlock Groans finds the dog". Use the words below.
[Image description: Photo of a smiling person and a speech bubble]
Sherlock Groans leaves his office. First, he goes to the park. He ... the dog. Then he ... a tree. He ... his head. Then he ... the tree. The dog ... Sherlock Groans. Now, the dog ... Sherlock Groans to a hospital.
[Image description: 8 numbered illustrations showing a sequence of actions with labels:] 1 leave 2 go to 3 look for 4 climb (up) 5 bump 6 fall out of 7 find 8 pull
🔵 WB p. 50, 53, 55 🌐 CYBER Homework 17
Page 48
6 Read the text.
A FAMOUS DETECTIVE
[Image description: Silhouette of Sherlock Holmes]
It's the year 1887. Sir Conan Doyle writes a book about a detective. His name is Sherlock Holmes. He lives at 221B Baker Street in London. Holmes wears a funny hat and smokes a pipe. He is very tall and has got brown hair. Holmes plays the violin. It helps him to think.
Sherlock has got a friend. His name is Dr Watson. Dr Watson helps Sherlock Holmes. People come to Holmes and ask for help. Holmes and Watson are very clever. They catch all the bad people.
There are four books and 56 short stories about Sherlock Holmes. He is also in lots of films.
7 Cover up the text and complete the sentences.
1 Sherlock Holmes l__ __ __ __ in London. 2 He s__ __ __ __ __ a pipe. 3 Sherlock Holmes p__ __ __ __ __ the violin. 4 Holmes h__ __ g__ __ a very good friend. 5 People c__ __ __ to Holmes and ask for help. 6 Holmes and Watson a__ __ very clever. 7 Holmes c__ __ __ __ __ __ all the bad people. 8 There a__ __ __ __ __ a lot of films about Sherlock Holmes.
SOUNDS RIGHT /w/
2/15 🔊 8 Listen and repeat.
There's a wolf, a wolf, a wild wolf in the wood. He's looking for Little Red Riding Hood.
[Image description: Illustration of a wolf in the woods]
A SONG 4 U
2/16+17 🔊 9 Listen and sing.
Call Groans
The cat is lost! The dog is gone! Call Sherlock Groans. Come on, come on!
Groans – he solves the problem, Groans – he finds your stuff. Groans – he knows the answer, Groans – that is enough.
A watch is lost! A keyboard's gone! Call Sherlock Groans. Come on, come on!
[Image description: Illustration showing people calling for help and detective Groans]
Groans – he solves the problem ...
A drum is lost! My goldfish's gone! Call Sherlock Groans. Come on, come on!
Groans – he solves the problem ...
🔵 WB p. 54
Page 49
LISTENING
2/18 🔊 10 Listen and put the pictures in order. Then read the comic.
PAWS AND CLAWS ANIMAL DETECTIVES
[Image description: Comic strip panels showing a manga-style story with characters looking for a hat and a necklace. The panels include dialogue:]
"My hat! Where is my hat?!"
"He's here! It's Kapu... Let's go!"
"My doll*! I want my doll!"
"Claws! Can you see him?"
"I see him! He is on the bridge."
"Oh, now we get him!"
"Detective Paws! What can you see?"
"I see a lot of happy people, Detective Claws. But ... wait ... what's that?"
"My necklace*! My necklace! Oh, no!"
VOCABULARY: *doll – Puppe; necklace – Halskette
Fact box This picture story is a Manga. Manga is the name for Japanese comic books.
11 Who says what? Match the sentences with the people. There is one extra name.
1 "My doll! I want my doll!" ☐ woman ☐ man 2 "OK, now we get him!" ☐ Detective Paws ☐ little girl 3 "My hat!"
2/19 🔊 12 Choose a picture for the ending. Listen and check your answer.
[Image description: Three numbered ending options showing different scenes]
🔵 WB p. 55
Page 50
WRITING
13 C H O I C E S
A You are a detective. Write four sentences.
I'm a detective. My name is ... I live ... My friend is ... We look for ...
B Write the story "Sherlock Groans finds the dog!"
How to start: Groans leaves his office. "Find the dog, find the dog," he thinks. He goes ...
How to go on (start with a new paragraph):* First he looks for ... Then he ... And then he ... Oh no! He ...
How to end (start with a new paragraph): Now Mr Groans is ... And the dog is ...
VOCABULARY: *paragraph – Absatz
GRAMMAR
▶️ Present simple
Wenn du sagst I like ice cream, dann bedeutet das, dass du im Allgemeinen gern Eis magst. Diese Zeitform nennt man das Present simple.
Singular	Plural
I love dogs.	We love our cat.
You live in Vienna.	They live in Oxford.

Wenn du über eine Person, ein Tier oder ein Ding sprichst, dann musst du beim Verb ein -s anhängen.
He lives in London. My dog loves ice cream. She plays football.
Achtung:
go – goes carry – carries watch – watches catch – catches wash – washes
[Image description: Illustration of a dog playing football with text "Our dog plays football."]
Du verwendest das Present simple auch, um eine Geschichte oder einen Witz im Präsens zu erzählen.
I'm in bed. I hear something. I get up. I ... Sherlock Groans leaves his house. He goes to the park. He sees ...
a lot of / lots of
Für "viel/viele" kannst du im Englischen sowohl a lot of als auch lots of verwenden.
a lot of homework / lots of homework a lot of books / lots of books a lot of different colours / lots of different colours
⏪ Now go back to page 46. Check ☑ with a partner what you know / can do.
🔵 WB p. 51, 52, 55 🌐 CYBER Homework 18
Page 51
THE STORY OF THE STONES 3
▶️ Don't be scared!
1 Remember and say the sentences.
Sarah has got the ... stone. She rubs it. She becomes ... Emma has got the ... stone. She rubs it. She becomes ... Daniel has got the ... stone.
[Image description: Character illustration]
2 Imagine that Daniel rubs his stone. Say what you think he becomes. Ask your teacher for more words for animals.
I think he becomes a ...
[Image description: Various animals including a fish, gorilla, and lion]
What's 'Schwan' in English? Swan.
[Image description: Classroom scene]
EVERYDAY ENGLISH
▶️ 3 Watch episode 3. Complete the dialogues with the phrases from the box.
Go on But it's true Well done Promise
Daniel Don't make fun of me! Sarah ¹................................................ ! Daniel ³................................................ ! Sarah Great, Daniel! Emma ²................................................ , Daniel. ⁴................................................ ! Rub your stone! Daniel No, I don't want to.
4 Can you do the puzzle and find out what Sunborn says to the children?
[Image description: Crossword puzzle grid and character illustrations]
Wait for my __ __ __ __ __ __ !
1 His name is ... 2 Emma rubs her stone. She becomes a ... 3 Emma, Sarah and Daniel find three ... 4 Her name is ...
5 His name is ... 6 Sarah rubs her stone. She becomes an ... 7 Sarah's stone is ...


----- WB: WB Unit 6 The world’s best detective.txt -----
Unit 6 The world’s best detective
Page 49–50
UNDERSTANDING VOCABULARY
Action verbs
1 Look at the pictures and number the words.
□ mirror
□ close a door
□ smile
□ open a window
□ put a hat on
□ take a hat off
□ jump
□ fall out of a window
□ climb up a tree
□ leave
Image descriptions (numbered pictures 1–10):
1 A smiling girl’s face, looking straight ahead.
2 A boy climbing up a tree trunk.
3 A hand opening a window with a plant on the windowsill.
4 A girl jumping in the air.
5 A boy putting a hat on his head.
6 A person leaving through a door.
7 A girl closing a door.
8 A boy taking a hat off his head.
9 A hand mirror.
10 An open window with flowers outside.
2 Remember the story The lost bird. Read and circle the correct options.
Sherlock Groans is in his office. He looks in the ¹ mirror / window. He ² puts his hat on / takes his hat off. He ³ smiles / runs. He’s the world’s best detective! He ⁴ closes / opens the window and ⁵ looks in / looks out. His hat ⁶ falls out of / takes off the window. Sherlock’s friend, Doctor Grey, comes to the office. An old man is next to her.
“Sorry!” says Sherlock. He runs down the street. He climbs up a tree. There’s his hat.
He ⁷ picks it up / takes it off. There’s a bird in it! The bird ⁸ jumps / goes on his head.
Now Sherlock’s back at the office. The old man says, “Please help me. I can’t find my bird!”
Sherlock ⁹ puts his hat on / takes his hat off. “Here you are!” he says. The man ¹⁰ runs / smiles.
3 Match the words with the pictures. There are four extra words.
climb fall out of leave find go to look for pull bump
Image descriptions (1–4):
1 A detective bumping his head on a desk, stars around his head.
2 A detective looking closely at a computer screen with a magnifying glass.
3 A person falling out of a bed in surprise.
4 A detective climbing up a pole to reach a light.
1 ………………………………………
2 ………………………………………
3 ………………………………………
4 ………………………………………
Page 50–51
USING VOCABULARY
Action verbs
4 Find and circle the verbs and prepositions from the box in the wordsearch. (← → ↑ ↓)
Then write a sentence for each one.
fall out of
go to
jump into
look for
bump into
put on
take off
Wordsearch grid shown.
1 ………………………………………
2 ………………………………………
3 ………………………………………
4 ………………………………………
5 ………………………………………
6 ………………………………………
7 ………………………………………
5 Complete the text with the words from the box.
goes
bumps into
looks for
leaves
looks for
Sherlock Groans ¹ ……………………………… the house at eight o’clock. He ² ……………………………… his umbrella*. Sherlock Groans thinks: “Where is my umbrella? Is it in the woods? Is it in the park? Or is it at the café?”
He ³ ……………………………… to the café. No umbrella. Then he goes to the park. No umbrella. Then he goes to the woods. He ⁴ ……………………………… his umbrella under the bushes. No umbrella. Later he ⁵ ……………………………… a tree. And from the tree – falls his umbrella. Sherlock Groans is very happy.
Image description: Sherlock Groans bumps into a tree; his umbrella is stuck in the branches above his head.
VOCABULARY: *umbrella – Regenschirm
6 Write a short story called Sherlock Groans and the lost drum. Use the verbs in the box and the picture to help you.
go to
climb
fall out of
leave
find
bump
look for
jump into
Image description: Sherlock Groans stands by a river, looking at something floating away in the water.
Page 51–52
UNDERSTANDING GRAMMAR
Present simple
7 Circle the correct words. Then number the pictures.
1 My sister Sheila play / plays football every day.
2 In the afternoon, I play / plays computer games.
3 Dad wash / washes his car on Saturdays.
4 We clean / cleans our bikes* at the weekend.
5 My mum leave / leaves the office at five.
6 We all love / loves our dog.
7 On Sunday, Mike go / goes to the park with his dog.
8 On Sunday, Dawn and I go / goes to the cinema.
VOCABULARY: *bike – Fahrrad
Pictures A–H:
A A boy playing computer games at a desk.
B Two children playing with a dog in a park.
C Two girls going into a cinema.
D A man walking a dog in a park.
E A man washing a car.
F A woman leaving an office with bags.
G A girl playing football.
H Two children cleaning bicycles.
8 Complete with the correct form of the verbs in brackets.
1 Our cat ……………………………… football. (play)
2 I ……………………………… computer games in the evening. (play)
3 I ……………………………… my sister with her homework. (help)
4 And my sister ……………………………… me to clean my bike. (help)
5 My father ……………………………… to work at seven every morning. (go)
6 We ……………………………… to the cinema on Friday. (go)
7 We ……………………………… the car at the weekend. (wash)
8 And on Sunday, my sister ……………………………… the dog! (wash)
Page 52–53
9 Read Alyssa’s story. Complete the text with the correct form of the verbs in brackets.
My parrot Coco really ¹ ……………………………… (like) bananas. Every day we ² ……………………………… (go) and ³ ……………………………… (buy*) a big banana. First, I ⁴ ……………………………… (eat) half of* the banana and then my parrot ⁵ ……………………………… (eat) the other half of the banana. My parrot also ⁶ ……………………………… (like) melons and strawberries.
Image description: A girl kneeling and feeding a parrot a banana.
VOCABULARY: *buy – kaufen; half of – die Hälfte von
10 What do they do every day? Write the sentences under the pictures.
Tony / eat
Li Jun / play
Mara and Lewis / watch
Anna / go
Fred / climb
Kathy / play
Pictures show:
Tony eating an apple.
Li Jun playing football.
Mara and Lewis watching TV.
Anna going to the cinema.
Fred climbing a tree.
Kathy playing the drums.
1 Every day Tony eats an apple.
2 ………………………………………
3 ………………………………………
4 ………………………………………
5 ………………………………………
6 ………………………………………
Page 53–54
11 Complete the text with the missing letters.
Fiona is in bed. Suddenly* she ¹ he____ something. She ² ge__ up and ³ go__ to the window. Nothing. She ⁴ r____ to the door and ⁵ wai___ . Nothing. She ⁶ lis_____ for a minute. Nothing. Then she ⁷ lo____ at her desk. There is a big teddy bear with a big red card* on it. The card ⁸ sa___ : “For Fiona. Love you, Mum and Dad.”
VOCABULARY: *suddenly – plötzlich; card – Karte
12 Complete the text with the verbs from the box.
likes
go to
calls*
say
Susan ¹ ……………………………… basketball and volleyball, too.
Everyone ² ……………………………… her Volleyball Sue.
And what about football? She’s good at that, too.
“OK,” ³ ……………………………… her friends. “You’re Ballchampion Sue.”
Her friends all love her and ⁴ ……………………………… every game*.
VOCABULARY: *call – hier: nennen; game – Spiel
Page 54–55
READING & WRITING
Understanding and writing a detective story
13 CHOICES
A Look at the pictures and number the sentences.
Sherlock Groans and the garden gnome *
Sentences:
□ The garden gnome hits* Groans with a little hammer.
□ Today Groans wants to find a garden gnome.
□ He looks for it in the park.
□ Then the garden gnome runs away.
□ He falls into the grass. There he sees the garden gnome.
□ He bumps into a tree.
Pictures 1–6 show the story in sequence, including Sherlock Groans searching, bumping into a tree, falling, being hit by a gnome, the gnome running away, and Groans holding his head.
VOCABULARY: *garden gnome – Gartenzwerg; hit – schlagen
B Sherlock Groans is on the phone with Doctor Grey. Put the dialogue in the correct order.
□ Doctor Grey Where are you?
□ Doctor Grey OK, Groans. Give me twenty minutes.
□ Doctor Grey A tree?
□ Doctor Grey Yes? Who is it?
□ Doctor Grey OK, come home, Groans.
□ Doctor Grey Is my lost cat with you?
□ Groans In a tree.
□ Groans I can’t, Doctor Grey. There’s a wolf under the tree. Help me, please.
□ Groans Yes, it is.
□ Groans Yes, a tree in the woods.
□ Groans Groans here, Doctor Grey.
Image description: Sherlock Groans sitting in a tree on the phone; a cat is with him, and a wolf is below.
Page 55–56
14 Read the text A famous detective on page 48 of the Student’s Book again. Write the answers.
Name:
1 ………………………………………
Job:
2 ………………………………………
Address:
3 ………………………………………
Clothes:
4 ………………………………………
Hobby:
5 ………………………………………
Best friend:
6 ………………………………………
15 Read about two famous detectives. How many of the tasks below can you do?
Text 1:
She is Georgina from The Famous Five, but she prefers* the name George. Every summer holidays George and her friends Dick, Julian, Anne and her dog Timmy have lots of adventures* and solve cases* in the countryside*.
Text 2:
Miss Marple is a detective in a lot of books by the famous crime author* Agatha Christie. Miss Marple is a little old lady. She lives in a small town* in the English countryside. She watches people all the time. She is very clever and she always* finds the killer.
VOCABULARY: *prefer – lieber haben; adventure – Abenteuer; case – (Kriminal-)Fall; countryside – ländliche Gegend; author – Autor/Autorin; town – Stadt; always – immer
Choose the correct answers.
1 Georgina has a dog. Its name is
□ Dick. □ Anne. □ Timmy.
2 Agatha Christie is the author of books about
□ Miss Marple. □ Georgina. □ The Famous Five.
Circle T (True) or F (False).
3 There are four children in The Famous Five. T / F
4 Miss Marple lives in London. T / F
Complete the sentences.
5 Georgina likes the name ……………………………………… best.
6 Agatha Christie is ……………………………………… .
Page 56–57
17 Look at the pictures. Tell the story “The lost dog”. Use the words from the box. Then write the story in your exercise book.
Sherlock Groans goes to the park. He … Doctor Grey’s dog. Then he … a tree.
He … his head. Then he … the tree. The dog … Sherlock Groans.
Now, the dog … Sherlock Groans to a hospital.
Pictures 1–6 show: Groans going to the park, climbing a tree, bumping his head, falling out of the tree, being found by the dog, and being taken to hospital.
LISTENING
Understanding a detective story
18 Listen and complete the sentences.
1 Nate is a young ……………………………………… .
2 His friend Annie can’t find her ……………………………………… .
3 There’s a ……………………………………… dog in it.
VOCABULARY: *Red and yellow make orange. – Rot und gelb ergeben orange.; It’s still wet. – Es ist noch nass.
19 Listen again and tick T (True) or F (False).
1 Nate looks in the garden and the woods. T □ F □
2 He looks in Annie’s room. T □ F □
3 He looks in her brother’s room. T □ F □
4 There are lots of pictures and they’re all orange. T □ F □
5 Annie’s brother only paints red pictures. T □ F □
6 Nate says, “Red and yellow make orange. The orange picture is your picture!” T □ F □
WORD FILE
Around town
Image description: A town scene with labeled places: city, park, street, market, supermarket, river, woods, tree.
Action verbs
to jump into the river
to look out the window
to pick something up
to sit in a tree
to fall out of the tree
to bump into a tree
to go to the park
to pull
to climb up a tree
to leave the office
to look in the mirror
to look for something
MORE Words and Phrases
1 to climb – Sherlock Groans climbs up a tree. – klettern
to jump – A bird jumps on Sherlock Groans’ head. – hüpfen
to leave – Doctor Grey leaves the office. – verlassen, weggehen
mirror – There is a mirror on a wall. – Spiegel
to put on – Sherlock puts his hat on. – aufsetzen, anziehen
to smile – He smiles in the mirror. – lächeln
to take off – He takes off his hat. – abnehmen, ausziehen
2 away – Go away! – weg
(world’s) best – Sherlock Groans is the world’s best detective! – (welt-)bester/beste/bestes
detective – He’s the world’s best detective. – Detektiv/Detektivin
Help me! – Hilf mir!
to look for – He looks for his hat in the park. – suchen
old – His skateboard isn’t new. It’s very old. – alt
to pick up – He picks up the hat. – aufheben
to run out (of) – Sherlock runs out of the office. – hinausrennen (aus)
to run down (the street) – Sherlock runs down the street. – (die Straße) hinunterlaufen
5 to find – The dog finds Sherlock Groans. – finden
to pull – The dog pulls Sherlock Groans out of the river. – ziehen
6 to catch – He always catches the bad people. – fangen; erwischen; festnehmen
clever – Sherlock is really clever. – klug, schlau
to come to – He comes to a park. – (zu etwas) hinkommen
to live – Peter lives in London. – leben, wohnen
pipe – Sherlock often has a pipe in his mouth. – Pfeife
to smoke – Groans smokes a pipe. – rauchen
violin – He can play the violin. – Geige
to wear – Trevor wears a black hat. – tragen
7 a lot of / lots of – There are lots of beautiful trees in the park. – viel/e, jede Menge
9 to call – Sherlock Groans calls Doctor Grey. – (an-)rufen
Come on! – Komm(t) jetzt!, Mach(t) schon!
10 to solve – Detectives solve problems. – lösen
to wait – But … wait … what’s that? – warten
to watch – He watches the people in the streets. – beobachten, zuschauen
street – Anna lives in York Street. – Straße
G to get up – He gets up at 7 o’clock in the morning. – aufstehen
S3 to become – Emma becomes a tiger. – werden
But it’s true! – Aber es stimmt!
Go on. – weitermachen; Erzähl weiter!
Well done. – Gut gemacht.

```

## Output contract

Write `content/corpus/units/g1-u06/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u06",
  "briefBank": "dfbe7bb08bcd",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u06.s.a-lot-of",
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
