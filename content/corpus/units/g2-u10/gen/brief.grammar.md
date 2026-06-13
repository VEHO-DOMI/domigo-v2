# Grammar generation brief — g2-u10 (MORE! 2, Unit 10)

<!-- domigo:gen grammar g2-u10 bank=96a3bd6f6117 prompt=4b9164076103 -->

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

### `g2u10.s.like-ing` — like + -ing (like + -ing (gern etwas tun))

Saying that someone enjoys (or doesn't enjoy) an activity with like(s) / don't like + verb-ing.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [like-ing-form]: To say that someone enjoys doing something: person + like(s) + verb-ing.
  - DE: So sagst du, dass jemand etwas gerne macht: Person + like(s) + Verb mit -ing.
  - "I like reading." — "Ich lese gerne."
  - "She likes dancing." — "Sie tanzt gerne."
- rule [like-ing-negative]: Negative: don't like / doesn't like + verb-ing.
  - DE: Verneinung: don't like / doesn't like + Verb mit -ing.
  - "She doesn't like going shopping." — "Sie geht nicht gerne einkaufen."
  - "I don't like ice skating." — "Ich gehe nicht gerne eislaufen."
- rule [ing-spelling]: Watch the -ing spelling: run - running, swim - swimming (double the consonant); dance - dancing, write - writing (drop the -e).
  - DE: Achte auf die Schreibweise von -ing: run - running, swim - swimming (Konsonant verdoppeln); dance - dancing, write - writing (-e fällt weg).
  - "He likes running in the park." — "Er läuft gerne im Park."
  - "We don't like getting up early." — "Wir stehen nicht gerne früh auf."

common errors:
- Using the base form instead of -ing after like: ✗ "I like swim." → ✓ "I like swimming."
- Mixing to and -ing: ✗ "I like to swimming." → ✓ "I like swimming."
- Spelling error in the -ing form: ✗ "She likes runing every day." → ✓ "She likes running every day."

SB box `g2/sb/More 2 SB Unit 10.txt#grammar-1` — like + -ing:
```
So sagst du, dass jemand etwas gerne macht:
 I like reading.
 She likes dancing.
 She doesn’t like going shopping.
🔎 Complete. Write in the right order: -ing / like / person.
 Bildung: 1. .................................................. + 2. .................................................. + 3. ..................................................
Image: A child has slipped and fallen on ice skates. Text in speech bubble: “I don’t like ice skating.”
must / mustn’t
Du verwendest must, um zu sagen, dass jemand etwas tun muss.
 ✔ You must be home by eight.
Achtung: mustn’t bedeutet im Deutschen „nicht dürfen“ und nicht „nicht müssen“.
 Bildung: Person + mustn’t (must not) + Grundform des Verbs
 ✘ You mustn’t print things out.
 ✘ You mustn’t be late. The film starts at 8!
Image: Two children on a beach. One child says to the other: “You mustn’t swim here.”
🔎 must = 1. .............................
 mustn’t = 2. .............................
 doesn’t/don’t have to = 3. ............................. nicht müssen
```

v1 seed items (UNTRUSTED):
- `m2-u10-like-ing-gf-001` [gap-fill, d1]: p="I like ___ football after school." c="playing" a=["playing"] ds=["play","to playing","played"]
- `m2-u10-like-ing-gf-002` [gap-fill, d1]: p="She likes ___ books before bedtime." c="reading" a=["reading"] ds=["read","reads","to reading"]
- `m2-u10-like-ing-gf-003` [gap-fill, d2]: p="My brother likes ___ in the lake in summer." c="swimming" a=["swimming"] ds=["swim","swiming","to swimming"]
- `m2-u10-like-ing-gf-004` [gap-fill, d3]: p="We don't like ___ up early on Saturdays." c="getting" a=["getting"] ds=["get","geting","to get"]
- `m2-u10-like-ing-gf-005` [gap-fill, d3]: p="Does your cat like ___ with a ball?" c="playing" a=["playing"] ds=["play","plays","to playing"]
- `m2-u10-like-ing-gf-006` [gap-fill, d4]: p="Tom and Lisa like ___ videos and ___ them online." c="making ... sharing" a=["making ... sharing","making...sharing"] ds=["make ... share","making ... share","make ... sharing"]
- `m2-u10-like-ing-mc-001` [multiple-choice, d2]: p="Choose the correct sentence about Anna's hobby." c="Anna likes dancing." a=["Anna likes dancing."] ds=["Anna likes dance.","Anna like dancing.","Anna likes to dancing."]
- `m2-u10-like-ing-mc-002` [multiple-choice, d3]: p="Choose the correct question." c="Do you like cooking?" a=["Do you like cooking?"] ds=["Do you like cook?","Does you like cooking?","Do you likes cooking?"]
- `m2-u10-like-ing-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="My dad doesn't like running in the rain." a=["My dad doesn't like running in the rain."] ds=["My dad doesn't like run in the rain.","My dad doesn't likes running in the rain.","My dad not like running in the rain."]
- `m2-u10-like-ing-ec-001` [error-correction, d1]: p="Find and fix the mistake: I like swim in the sea." c="swimming" a=["swimming","I like swimming in the sea.","I like swimming in the sea"] ds=[]
- `m2-u10-like-ing-ec-002` [error-correction, d3]: p="Find and fix the mistake: He like playing computer games." c="likes" a=["likes","He likes playing computer games.","He likes playing computer games"] ds=[]
- `m2-u10-like-ing-ec-003` [error-correction, d4]: p="Find and fix the mistake: She likes to singing in the shower." c="singing" a=["singing","She likes singing in the shower.","She likes singing in the shower"] ds=[]
- `m2-u10-like-ing-tf-001` [transformation, d2]: p="Your pen pal asks about your hobbies. Make a sentence: 'I / like / draw pictures' →" c="I like drawing pictures." a=["I like drawing pictures.","I like drawing pictures"] ds=[]
- `m2-u10-like-ing-tf-002` [transformation, d3]: p="Your friend says Tom watches too much TV. Make it negative: 'He ___ (not like / watch) TV.'" c="He doesn't like watching TV." a=["He doesn't like watching TV.","He doesn't like watching TV","doesn't like watching"] ds=[]
- `m2-u10-like-ing-tf-003` [transformation, d5]: p="You want to know about your classmates' hobbies. Ask them: '___ (they / like / ride) bikes?'" c="Do they like riding bikes?" a=["Do they like riding bikes?","Do they like riding bikes"] ds=[]
- `m2-u10-like-ing-tr-001` [translation, d2]: p="🇩🇪 Ich spiele gern Gitarre." c="I like playing the guitar." a=["I like playing the guitar.","I like playing the guitar","I like playing guitar.","I like playing guitar"] ds=[]
- `m2-u10-like-ing-tr-002` [translation, d4]: p="🇩🇪 Meine Schwester kocht nicht gern." c="My sister doesn't like cooking." a=["My sister doesn't like cooking.","My sister doesn't like cooking","My sister does not like cooking.","My sister does not like cooking"] ds=[]
- `m2-u10-like-ing-sb-001` [sentence-building, d3]: p="Put the words in the correct order: likes / she / riding / her / bike" c="She likes riding her bike." a=["She likes riding her bike.","She likes riding her bike"] ds=[]
- `m2-u10-like-ing-mt-001` [matching, d5]: p="Match each subject with the correct ending. 1: I like 2: She likes 3: We don't like 4: Does he like 5: They like" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"d\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"d\"}"] ds=["a: playing tennis.","b: swimming?","c: drawing pictures.","d: watching films.","e: doing homework."]
- `m2-u10-like-ing-mc-004` [multiple-choice, d2]: p="Your friend asks about your hobbies. Which sentence is correct?" c="I like playing basketball after school." a=["I like playing basketball after school."] ds=["I like play basketball after school.","I am like playing basketball after school.","I like to playing basketball after school."]

### `g2u10.s.must` — must / mustn't (must / mustn't (Verpflichtung und Verbot))

must for strong obligation and mustn't for prohibition. Crucially, mustn't means 'nicht dürfen' - NOT 'nicht müssen' (that is don't have to).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [must-obligation]: Use must + base form to say that someone has to do something.
  - DE: Du verwendest must, um zu sagen, dass jemand etwas tun muss.
  - "You must be home by eight." — "Du musst um acht zu Hause sein."
- rule [mustnt-prohibition]: mustn't (must not) + base form = it is forbidden. Careful: mustn't means 'nicht dürfen', not 'nicht müssen'.
  - DE: Achtung: mustn't bedeutet im Deutschen "nicht dürfen" und nicht "nicht müssen". Bildung: Person + mustn't (must not) + Grundform des Verbs.
  - "You mustn't print things out." — "Du darfst nichts ausdrucken."
  - "You mustn't be late. The film starts at 8!" — "Du darfst nicht zu spät kommen. Der Film beginnt um 8!"
  - "You mustn't swim here." — "Du darfst hier nicht schwimmen."
- rule [must-mustnt-dont-have-to]: Keep the three meanings apart: must = necessary (müssen), mustn't = forbidden (nicht dürfen), don't/doesn't have to = not necessary (nicht müssen).
  - DE: Halte die drei Bedeutungen auseinander: must = müssen, mustn't = nicht dürfen (verboten), don't/doesn't have to = nicht müssen (nicht notwendig).
  - "You mustn't run in the corridor." — "Du darfst im Gang nicht laufen. (= verboten)"
  - "You don't have to bring lunch." — "Du musst kein Mittagessen mitbringen. (= nicht notwendig)"

common errors:
- Adding to after must: ✗ "You must to go home now." → ✓ "You must go home now."
- Using mustn't when the meaning is 'not necessary': ✗ "You mustn't bring lunch. (meaning: not necessary)" → ✓ "You don't have to bring lunch."
- Adding -s for the third person: ✗ "She musts go home." → ✓ "She must go home."
- Negating must with don't: ✗ "You don't must go." → ✓ "You mustn't go."

SB box `g2/sb/More 2 SB Unit 10.txt#grammar-1` — like + -ing:
```
So sagst du, dass jemand etwas gerne macht:
 I like reading.
 She likes dancing.
 She doesn’t like going shopping.
🔎 Complete. Write in the right order: -ing / like / person.
 Bildung: 1. .................................................. + 2. .................................................. + 3. ..................................................
Image: A child has slipped and fallen on ice skates. Text in speech bubble: “I don’t like ice skating.”
must / mustn’t
Du verwendest must, um zu sagen, dass jemand etwas tun muss.
 ✔ You must be home by eight.
Achtung: mustn’t bedeutet im Deutschen „nicht dürfen“ und nicht „nicht müssen“.
 Bildung: Person + mustn’t (must not) + Grundform des Verbs
 ✘ You mustn’t print things out.
 ✘ You mustn’t be late. The film starts at 8!
Image: Two children on a beach. One child says to the other: “You mustn’t swim here.”
🔎 must = 1. .............................
 mustn’t = 2. .............................
 doesn’t/don’t have to = 3. ............................. nicht müssen
```

v1 seed items (UNTRUSTED):
- `m2-u10-must-gf-001` [gap-fill, d1]: p="You ___ do your homework before you play outside." c="must" a=["must"] ds=["must to","musts","mustn't"]
- `m2-u10-must-gf-002` [gap-fill, d1]: p="You ___ run in the corridors. It's dangerous!" c="mustn't" a=["mustn't","must not"] ds=["don't have to","don't must","must"]
- `m2-u10-must-gf-003` [gap-fill, d2]: p="She ___ wear a helmet when she rides her bike." c="must" a=["must"] ds=["must to","musts","don't must"]
- `m2-u10-must-gf-004` [gap-fill, d3]: p="You ___ touch the animals at the zoo. It's against the rules." c="mustn't" a=["mustn't","must not"] ds=["don't have to","must","can't to"]
- `m2-u10-must-gf-005` [gap-fill, d4]: p="Tomorrow is a holiday. We ___ go to school." c="don't have to" a=["don't have to"] ds=["mustn't","must","haven't to"]
- `m2-u10-must-gf-006` [gap-fill, d5]: p="You ___ use your phone during the test. But you ___ bring a pencil — a pen is also fine." c="mustn't ... don't have to" a=["mustn't ... don't have to","mustn't...don't have to","must not ... don't have to","must not...don't have to"] ds=["don't have to ... mustn't","mustn't ... mustn't","must ... don't must"]
- `m2-u10-must-mc-001` [multiple-choice, d2]: p="The sign says 'No swimming'. Choose the correct sentence." c="You mustn't swim here." a=["You mustn't swim here."] ds=["You don't have to swim here.","You don't must swim here.","You must swim here."]
- `m2-u10-must-mc-002` [multiple-choice, d3]: p="It's Saturday. Choose the correct sentence about school." c="We don't have to go to school today." a=["We don't have to go to school today."] ds=["We mustn't go to school today.","We must go to school today.","We don't must go to school today."]
- `m2-u10-must-mc-003` [multiple-choice, d5]: p="In the library: Choose the correct sentence." c="You mustn't talk loudly, but you don't have to whisper." a=["You mustn't talk loudly, but you don't have to whisper."] ds=["You don't have to talk loudly, but you mustn't whisper.","You mustn't talk loudly, but you mustn't whisper.","You don't must talk loudly, but you don't must whisper."]
- `m2-u10-must-ec-001` [error-correction, d2]: p="Find and fix the mistake: You must to wear a seatbelt in the car." c="must wear" a=["must wear","You must wear a seatbelt in the car.","You must wear a seatbelt in the car"] ds=[]
- `m2-u10-must-ec-002` [error-correction, d3]: p="Find and fix the mistake: You don't must eat in the classroom." c="mustn't" a=["mustn't","must not","You mustn't eat in the classroom.","You mustn't eat in the classroom","You must not eat in the classroom.","You must not eat in the classroom"] ds=[]
- `m2-u10-must-ec-003` [error-correction, d4]: p="Find and fix the mistake: It's a holiday. We mustn't go to school." c="don't have to" a=["don't have to","We don't have to go to school.","We don't have to go to school","We do not have to go to school.","We do not have to go to school"] ds=[]
- `m2-u10-must-tf-001` [gap-fill, d2]: p="Your little sister forgot to brush her teeth. Tell her: 'You ___ (brush) your teeth before bed!'" c="must brush" a=["must brush","You must brush your teeth.","You must brush your teeth before bed!"] ds=["mustn't brush","should brush","can brush"]
- `m2-u10-must-tf-002` [gap-fill, d3]: p="You see a 'NO PHONES' sign at school. Tell the new student: 'You ___ (use) phones in class.'" c="mustn't use" a=["mustn't use","must not use","You mustn't use phones in class."] ds=["must use","don't have to use","should use"]
- `m2-u10-must-tf-003` [transformation, d4]: p="Your friend is packing too much food for the trip. Tell him it's not necessary: 'You ___ (bring) food. The school provides lunch.'" c="don't have to bring" a=["don't have to bring","do not have to bring","You don't have to bring food."] ds=[]
- `m2-u10-must-tr-001` [translation, d3]: p="🇩🇪 Du musst leise sein." c="You must be quiet." a=["You must be quiet.","You must be quiet","You have to be quiet.","You have to be quiet"] ds=[]
- `m2-u10-must-tr-002` [translation, d2]: p="🇩🇪 Du musst nicht warten. (= Es ist nicht nötig.)" c="You don't have to wait." a=["You don't have to wait.","You don't have to wait","You do not have to wait.","You do not have to wait"] ds=[]
- `m2-u10-must-sb-001` [sentence-building, d3]: p="Put the words in the correct order: mustn't / the / you / feed / animals" c="You mustn't feed the animals." a=["You mustn't feed the animals.","You mustn't feed the animals"] ds=[]
- `m2-u10-must-mt-001` [matching, d4]: p="Match each situation with the correct rule. 1: There's a test tomorrow. 2: It's Saturday, no school. 3: The sign says 'No photos'. 4: You can wear trainers or school shoes. 5: The teacher is talking." c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"b\",\"5\":\"e\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"b\",\"5\":\"e\"}"] ds=["a: You don't have to get up early.","b: You don't have to wear school shoes.","c: You mustn't take photos.","d: You must study.","e: You mustn't talk."]
- `m2-u10-must-cp-001` [context-picker, d2]: p="You see this sign at the swimming pool: 'NO RUNNING.' What does it mean?" c="You mustn't run at the swimming pool." a=["You mustn't run at the swimming pool."] ds=["You don't have to run at the swimming pool.","You shouldn't run at the swimming pool.","You must run at the swimming pool."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Americans, Amherst, Anderson, Andrew, Andy, Anger, Annie, Anthony, Arbeit, Archie, Arconia, Arconians, Arousing, Articles, Australia, Austria, Austrians, Bacon, Baker, Befehlsformen, Beitrag, Belea, Ben, Benson, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Bond, Box, Bridge, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Came, Canongate, Caribbean, Carina, Carl, Carla, Carlton, Castle, Centre, Chamber, Changing, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Claire, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Control, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Dragon, Dua, Earthlings, Edinburgh, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, Eric, European, Every, Excuse, Expressing, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gillian, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Hanna, Harris, Harry, Help, Henry, High, Hill, Hmm, Holmes, Homework, Hook, Hotel, Humor, Hungary, Hunt, Hutton, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Jo, Joanna, Joe, John, Jolly, Jonathan, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Katy, Ken, Kerr, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Laurie, Lauriston, Leah, Lena, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lipa, Lisa, London, Lord, Lucas, Lucy, Luigi, Luna, Mail, Manchester, Mandy, Manju, Manson, Maple, Mario, Mark, Marple, Mars, Mary, Matt, Mayan, Mei, Mexico, Mia, Michael, Mickey, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Natasha, Nathan, Nelson, New, Newtown, Nibbs, Nice, Nick, Nicolson, Nina, Nomen, North, Number, Numbers, Oak, Object, Objekte, Odeon, Oliver, Olivia, Omar, Order, Ordering, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plans, Plural, Plurals, Pluto, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Radu, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Rick, Ricky, Robert, Rome, Ron, Ronald, Rose, Rosey, Rosie, Sally, Salzburg, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, Sound, South, Square, States, Station, Steve, Sue, Sunborn, Susan, Suzy, Tale, Tamar, Tamara, Tammy, Targon, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, True, Turan, Uhr, Um, United, Vasile, Vicky, Vienna, Walker, Wall, Waterloo, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 10.txt -----
Unit 10 Who’s in your family?
Pages 78–79
At the end of unit 10 …
you know
 ☑ 9 family words
 ☑ 8 words for activities
 ☑ how to use like + -ing
 ☑ how to use must / mustn't
you can
 ☑ understand a diary entry
 ☑ understand short interviews
 ☑ talk about things you like doing
 ☑ understand a text about different types of families
 ☑ talk about your family
 ☑ talk about rules at school/home
 ☑ write sentences about what people must(n’t) do
 ☑ write a short poem
🎧 VOCABULARY — Families
1 Listen and write the first names.
 William Natasha Anthony
 Susan Fred Jo Lisa
2 Work in pairs. Write down the first names of people in your family (uncles, cousins, parents, etc.). Give the list to your partner. Your partner asks you who is who.
Example exchanges:
 Who’s Vera? — She’s my aunt.
 Who are Charlotte and Tina? — They’re my cousins.
Image: A family tree with photos
William is Anthony’s son.
Jo is Susan’s daughter.
Family Tree:
 Top row:
grandma (image of older woman)
grandpa (image of older man)
 Middle row:
uncle (William)
aunt (Jo)
father (Anthony)
mother (Susan)
 Bottom row:
cousin (Lisa)
Ben (another child)
READING
3 📘 Read Sophie’s diary entry. What does she think about her grandpa?
 📘 Read the text again. Complete it with because, and, or but.
Today I’m really proud of myself. We had a family get-together __________ that’s when I get a bit difficult at times. That’s what Mum says. __________ I stayed calm this time. Uncle Laurie and Auntie Mildred arrived first. I really don’t like them. Of course, they wanted a kiss from me __________ as soon as they came up to me, I started to cough. “I’m so sorry, I’ve got this virus,” Laurie asked me all day if I was OK. I said, “I’m fine as long as others don’t come too close, so I know there’s no danger they’ll get the virus!” And then I heard him say to his wife, “She’s so caring. Other teenagers wouldn’t say anything.” My grandpa arrived next. He has a new girlfriend __________ my grandma died a few years ago. His new girlfriend Caroline wears the weirdest hats. And she loves hearing compliments about them. Maybe it wasn’t such a good idea when I said, “Your hat’s so ugly!” She didn’t look too happy.
 “Ugly” is a word my friends and I use to say that something looks super cool,” I said.
 “Oh, really. That’s sweet,” she answered. Grandpa is great. He couldn’t stop smiling. I think we’ve got the same sense of humour.” Grandpa and I.
VOCABULARY: cough – husten, weird – seltsam, schräg, sense of humour – Sinn für Humor
4 📘 Read the text in 3 again. Circle T (True) or F (False).
Sophie’s mum thinks her daughter is always difficult. T / F
Sophie’s aunt’s name is Laurie. T / F
Grandpa’s girlfriend likes compliments about her hats, but Sophie didn’t give her one. T / F
Sophie thinks her grandpa hasn’t got a good sense of humour. T / F
🎧 LISTENING & SPEAKING
Talking about things you like doing
5 Listen to the interviews with Joanna, Vicky and Jonathan. What did they learn to do?
Image description:
Joanna (12) – sitting in a garden with purple flowers
Vicky (12) – sitting on the grass with apples and autumn leaves
Jonathan (13) – sitting on a red tractor
Joanna: ....................................................
 Vicky: ....................................................
 Jonathan: ....................................................
VOCABULARY: stay/keep calm – ruhig bleiben, decision – Entscheidung
6 Listen again. Then answer the questions.
What does Joanna like cooking on a fire? ....................................................
What does she like doing with friends around the fire? ....................................................
Why does Vicky think it’s important to keep cool? ....................................................
How does Vicky keep calm? ....................................................
What did Jonathan think of their farm holidays at first? ....................................................
What did he want to say when the farmer asked for some help? ....................................................
7 Work in pairs. What is the coolest thing you can do?
VOCABULARY — Activities
8 🎧 Listen and find out what things Natalie and Dylan like doing. Write N, D, or B for both.
☐ making a fire
 ☐ building things
 ☐ reading
 ☐ playing football
 ☐ using tools
 ☐ climbing trees
 ☐ going shopping
 ☐ dancing
9 Work in pairs. Tell your partner what you like doing. Look at 5 and 8.
Pages 80–81
READING & SPEAKING
Talking about your family
10 Quickly read through the text. Which of the children live in a house?
Who’s in your FAMILY?
RICK
How many are you and where do you live?
 Hi, I’m Rick and there are three people in my family. My mum, my brother and I.
 We live in a flat in Saffron Walden in England.
What’s your story?
 My parents don’t live together any more, but they are not divorced*. My dad lives in Cambridge and he’s got a new partner now. Cambridge is 30 miles from our town. My brother and I spend every other* weekend with Dad.
 He’s a travel agent*. In the summer, we sometimes go on holidays together.
 I like spending time with my dad.
LUCAS
How many are you and where do you live?
 We’re a big family. There are my two sisters, Emma and Amelia. They’re both older than me. I’m 12 and my name’s Lucas. We live in an old farm house in Scotland with our parents and my grandparents. And we have a lovely family dog, Rover.
What’s your story?
 My grandma says that when she was young, most families were bigger than today. I can’t imagine living in a family with only one or two other people. What I like most is when we’re all together.
 I love sitting around the big table in our living room. After dinner on Saturday, we often play games together. Sometimes, my grandpa and my grandma tell stories. I like listening to them talk.
LILY
How many are you and where do you live?
 Our family is pretty small. It’s my mum Claire, our cat Leo and me, Lily. We live in a small house in York.
What’s your story?
 I think my mum and I have the best family in the world. She’s my mum, of course, but she’s also my best friend. I never call her Mum, but always Claire. We do a lot of things together, and we have a lot of fun.
 Then we laugh a lot. And we often sit and talk. She’s a great listener.
VOCABULARY: divorced – geschieden; every other – jeder/j/s zweite; travel agent – Reisebüromitarbeiter/in
11 📘 Read the text again. How many of these tasks can you do?
Rick lives with his mum and brother / dad.
Rick’s parents are divorced / not together.
His dad and his new partner live in Cambridge / 30 miles from Cambridge.
Rover is ....................................................................................................................
Lucas really likes it most when ....................................................................................
Lily lives in a ...............................................................................................................
Why is Lily’s mum special? ..........................................................................................
Who of these three children do you think has the best life, and why?
Compare Lily and Lucas. What’s the same about them?
12 ✅ Check your answers with a partner.
13 🗣 Work in groups of three. Talk to your partners about your family. Talk about:
 ☐ their names and how they are related to you
 ☐ what you like best about each one
 ☐ what they do
LISTENING & SPEAKING
Talking about rules at home/school
14 🎧 Put the dialogue in the correct order. Check it with a partner.
☐ Dad: Yes, but you must be home by eight. You mustn’t be late, Rory!
 ☐ Dad: No, you mustn’t stay out so late. Let’s say you must be home by 9.30.
 ☐ Dad: I don’t care about the others.
 ☐ Rory: Dad, please. I just want to stay till ten.
 ☐ Rory: But Dad. That’s not fair. All the others stay till ten.
 ☐ Rory: Great. Thanks, Dad.
 ☐ Rory: Dad, can I go?
15 🎧 a. Listen to the dialogue between Eric and his mum. Tick the things he mustn’t do.
☐ go into private files
 ☐ delete a file
 ☐ print out everything
 ☐ chat
 ☐ check social media
b. Listen again. Take notes to answer the questions.
Why does Eric need his mum’s laptop?
How does Eric react when his mum looks at photos and messages on his phone?
Why does his mum say he mustn’t print things out?
How does Eric react when his mum tells him about the printing?
What does Eric say his mum mustn’t do?
How does the conversation end?
16 📘 Read through these rules for teens at a school in England in the 1950s. Work with a partner and rank them 1–7: 1 = least ridiculous, 7 = most ridiculous. Then compare your answers in class.
SCHOOL RULES
 ... Girls must wear skirts all the time.
 ... Boys mustn’t wear jeans outside in public.
 ... Young people mustn’t dance to rock’n’roll music.
 ... Young people must say “Please, may I have ...”.
   They mustn’t say “I want ...”.
 ... When an adult comes into a room, a young person must stand up.
 ... Young people must always use Sir or Madam when talking to an adult.
 ... Young people mustn’t eat using their fingers.
VOCABULARY: least ridiculous – am wenigsten lächerlich
WRITING
17 🖊 Imagine a family living in space. Work in groups and write up rules for them.
 Example: You mustn’t feed the robots water or fruit. You must feed them oil and old batteries.
18 🗣 Read out your rules in class. Take notes and say which you think are the best.
Pages 82–83
GRAMMAR
like + -ing
So sagst du, dass jemand etwas gerne macht:
 I like reading.
 She likes dancing.
 She doesn’t like going shopping.
🔎 Complete. Write in the right order: -ing / like / person.
 Bildung: 1. .................................................. + 2. .................................................. + 3. ..................................................
Image: A child has slipped and fallen on ice skates. Text in speech bubble: “I don’t like ice skating.”
must / mustn’t
Du verwendest must, um zu sagen, dass jemand etwas tun muss.
 ✔ You must be home by eight.
Achtung: mustn’t bedeutet im Deutschen „nicht dürfen“ und nicht „nicht müssen“.
 Bildung: Person + mustn’t (must not) + Grundform des Verbs
 ✘ You mustn’t print things out.
 ✘ You mustn’t be late. The film starts at 8!
Image: Two children on a beach. One child says to the other: “You mustn’t swim here.”
🔎 must = 1. .............................
 mustn’t = 2. .............................
 doesn’t/don’t have to = 3. ............................. nicht müssen
MORE FUN WITH FIDO!
Three-panel cartoon:
(Dog walking into a room)
 Text: “Fido, you mustn’t come in here.”
(Dog chewing on a shoe)
 Text: “Stop it, Fido. You mustn’t do that.”
(Dog barking)
 Text: “You mustn’t shout at Fido!”
➡️ Now go back to page 78. Check ✅ with a partner what you know / can do.
THE STORY OF THE STONES 5
📽 It’s you!
1 How well do you remember episode 4? Circle T (True) or F (False).
Daniel thinks Darkman is trying to kill them. T / F
Darkman attacked Gillian on the beach. T / F
Gillian hit Darkman with her bag. T / F
Gillian doesn’t want to join the team. T / F
Gillian is going to meet Sunborn. T / F
2 Look at the picture. Who do you think says:
Image: Gillian facing three team members (Sunborn, Daniel, Sarah) in a control room.
Hello, Gillian. And welcome to the team.
Do you know where he is?
How about a wolf?
Isn’t there a stone for me?
Darkman is very close.
3 📽 Watch episode 5. Complete the sentences with the words in the box. There are some words you don’t need.
Word box:
 wolf snake Darkman kill
 Gillian Sunborn an alien
 Emma Daniel Darkman
Darkman is trying to ............................................................. the children.
Gillian wants to be a ............................................................. .
Gillian is really ............................................................. .
............................................................. kills ............................................................. .
EVERYDAY ENGLISH
4 📽 Watch episode 5 again. Complete the sentences.
Word box:
 hopefully it wasn’t your fault that’s for sure Not exactly
Conversation 1:
 Sunborn: Yes. Hello, Gillian.
 And welcome to the team. We’re happy to have you, “..........................”
Conversation 2:
 Daniel: Do you know where he is?
 Sunborn: “..........................”, but he’s close.
Conversation 3:
 Emma: … but you didn’t know that we had brought him here.
 Sunborn: No, I didn’t. But “..........................” –
 Sarah: and you’ve helped me again.
 And “..........................”
 for the last time!


----- WB: More 2 WB Unit 10.txt -----
UNIT 10 Who’s in your family?
Page 79
UNDERSTANDING VOCABULARY
Families
1 Write the words in the family tree.
(Left margin vocabulary box:)
 grandpa
 grandma
 father
 mother
 aunt
 uncle
 cousin
 brother
 sister
(Family tree illustration:
 At the top level, there are two older adults – a woman and a man.)
(Second level: Two adult couples.)
 3. __________
 4. __________
 5. __________
 6. __________
(Third level: Four children and one labeled "me".)
 7. __________
 8. __________
 (me)
 9. __________
USING VOCABULARY
Families
2 Match the letters to make words.
1 gran ☐ cle
 2 grand ☐ sin
 3 mo ☐ ther
 4 cou ☐ ily
 5 daugh ☐ dma
 6 au ☐ ter
 7 fat ☐ nt
 8 un ☐ her
 9 fam ☐ pa
3 Use the words from 2 to complete the sentences. Sometimes you need to change the form.
My name’s Mehmet and this is my ______________________ .
My mum’s mother is my ________________________________ .
Steve, my ________________________________ , is my uncle’s son.
My mum’s sister is my ________________________________ .
My dad’s father is my ________________________________ .
My dad’s brothers are my ________________________________ .
My mum’s ________________________________ is old. He’s 78.
My ________________________________ is only 45. She’s still young.
My mum has two ________________________________ , Emily and Sue. They’re my sisters, but I’m her only son.
Pages 80–81
4 Find the nine family words. (→→ ↑↓) Write a sentence with each word.
Word Search Grid (10×10):
M E L C N U R
 R C O U S I N
 G R A N D M A
 K E L G T S D
 A U T F R D S
 N G A N T H B
 F A H P U N T
 A D O F A M S
 S O R A M E M
UNDERSTANDING VOCABULARY
Activities
5 Match the words and the pictures.
1 climbing trees
 2 playing football
 3 going shopping
 4 making a fire
 5 building things
 6 dancing
 7 reading
 8 using tools
(Image descriptions – Children engaged in activities, with names under each picture:)
 Amy – (making a fire)
 Sara – (going shopping)
 James – (building things with sticks)
 Ayshe – (climbing trees)
 Quasim – (using tools)
 Ava and Benjamin – (dancing)
 Sophie – (playing football)
 Lenny – (reading)
USING VOCABULARY
Activities
6 Look at the pictures in 5. Write the sentences in your exercise book.
 Example:
 Amy is good at making a fire. Sara likes ...
UNDERSTANDING GRAMMAR
must / mustn't
7 Look at the pictures. Write must or mustn’t.
(Image descriptions – Prohibition or obligation signs:)
Picture of animals being fed
Picture of a roundabout sign
Picture of a sheep crossing sign
Picture of a "Do not swim" sign
Picture of boots and a red prohibition sign
Picture of a red crossed-out running figure in a corridor
You ____________________ feed the animals.
You ____________________ turn right at the crossing.
You ____________________ stop for sheep crossing.
You ____________________ swim here.
You ____________________ leave your boots here.
You ____________________ run in the corridors.
USING GRAMMAR
must / mustn’t
8 Complete the dialogue with the sentences in the box.
Box:
Is there anything I can do?
10 o’clock as usual.
or you’ll feel bad all night.
You must be home by 10 o’clock.
Dialogue:
Jo: OK, Mum, I’m off to the youth club.
 Mum: Wait, Jo. 1. ___________________________
 Jo: I know, Mum. 2. ___________________________
 Mum: And you mustn’t eat and drink too much, 3. ___________________________
 Jo: I know, Mum. I never eat too much.
 Mum: But you drink too much cola, I know you. You mustn’t. OK?
 Jo: OK. …
 Mum: Sure. You must have fun.
 Jo: Ha ha. Is that an order?
9 Aunt Mary doesn’t like children. Write down the things you mustn’t do in her house. Use the words in the box to help you.
Box:
run down the stairs
use
listen
take
put
(Image descriptions – children doing various forbidden activities:)
Using Aunt Mary’s stereo
Lying in Aunt Mary’s bed
Taking a book
Not listening
Running down the stairs
10 Write six rules about your school. Say what students must or mustn’t do.
Pages 82–83
UNDERSTANDING GRAMMAR
like + -ing
11 Match the sentences with the pictures.
(Pictures are labeled 1–6, each showing a pair of scenes: one activity the person likes and one they don’t like. Match them with the following sentences.)
Ada likes reading, but she doesn’t like writing.
My grandpa likes watching TV, but he doesn’t like going to the cinema.
Tanya likes cooking, but she doesn’t like washing up.
Joe likes juggling, but he doesn’t like dancing.
Harry likes skateboarding, but he doesn’t like roller-skating.
Christopher likes dancing, but he doesn’t like singing.
USING GRAMMAR
like + -ing
12 Complete the sentences so they are true for you.
1 (basketball)
 I don’t like playing basketball. / I like playing basketball.
 2 (reading) ................................................................................................................
 3 (swimming) ..........................................................................................................
 4 (playing computer games) ................................................................................
 5 (climbing trees) ....................................................................................................
 6 (playing football) ..................................................................................................
13 Complete the text.
When I was a kid, I liked all kinds of sports. I liked 1 __________________________.
 I liked 2 __________________________, and I even liked 3 __________________________.
 Today I’m a bit lazy. I don’t like 4 __________________________ in the morning.
 I don’t like 5 __________________________ or 6 _________________________.
 What do I like? I like 7 __________________________ films,
 8 __________________________ and 9 _________________________.
(Images illustrate children doing activities like biking, swimming, reading books, playing on a computer, and watching movies.)
14 Write sentences about when you were younger.
1 (sport) When I was a kid, I didn’t like playing football, but now I love it.
 When I was a kid, I liked playing football, but now I like playing tennis.
 2 (TV programmes) ............................................................................................
 3 (books, magazines, etc.) ..............................................................................
 4 (school subjects) ............................................................................................
 5 (food) ................................................................................................................
 6 (free time activity) ..........................................................................................
READING & WRITING
15 Read the text about the Trapp family. How many Trapp children were there?
THE SOUND OF THE TRAPP FAMILY
 (Image: The Trapp Family in traditional Austrian clothing standing together. A smaller image shows a movie poster from "The Sound of Music.")
Text:
 Many people in America think of the musical and the film The Sound of Music when they talk about Austria. But only a few know that it is based on Maria von Trapp’s book The Story of the Trapp Family Singers.
So what is the background story? Trapp’s book appeared in* 1949. The book is about the Trapps, a family of singers who were very successful* between 1935 and 1957. Originally, they were from Salzburg, but when the Nazis came to Austria in 1938, they left the country and became successful singers in the USA, where they called themselves “The Trapp Family Singers.”
Based on their story, a musical called The Sound of Music opened in New York in 1959. It was very successful, and in 1965 a film of the same title appeared. The film was extremely successful; in fact it is one of the most successful films of all times, and even today when many Americans watch it, they want to visit Austria to see the places where the filming took place. The Austrians, however, didn’t really watch the movie or printed out the Trapp family of old Austria and doesn’t much care for the Trapps. This is why the movie isn’t as popular in Austria as it is in the USA.
The Trapps, however, were a real and successful family of singers. There was even a live show called The Sound of Music on American TV in 2013, and a movie about the young Trapp children aired on German TV in 2014 at the same time.
VOCABULARY: appear – erscheinen, successful – erfolgreich
Pages 84–85
b Read the text again. How many of these tasks can you do?
The Sound of Music is the title of a musical and a film.
     T / F
Maria von Trapp’s book appeared in 1957.
     T / F
The Trapps were from Salzburg.
     T / F
They left because ...............................................................................................................
They left Austria in ..............................................................................................................
The Sound of Music was very ..........................................................................................
Why do Americans want to come to Austria after watching The Sound of Music?
 .............................................................................................................................................
What do Austrians normally think of the film?
 .............................................................................................................................................
When did the last of the Trapp children die?
 .............................................................................................................................................
16 Listen and check your answers.
17 CHOICES
A Work out how old the following people are.
Mr King is nine times as old as his granddaughter Hanna.
     Mr King: ___________
His son John is three years older than his daughter Susan.
     John King: ___________
Susan is half as old as Mrs King.
     Susan King: ___________
     Mrs King: ___________
Together John’s children, the twins, are as old as their aunt Susan.
     The twins: ___________
Susan’s daughter Hanna is 8. She’s half as old as the twins.
     Hanna: 8
     The twins: ___________
B Find answers to the following riddles*.
Farid has 10 siblings*: 4 boys and 6 girls; he has a mother and father. How many people are in the family?
 __________
Mr and Mrs Kerr have six daughters and each daughter has one brother. How many people are there in the Kerr family?
 __________
A boy has as many sisters as brothers, but each sister has only half as many sisters as brothers.
 How many brothers and sisters are there in the family?
 __________
VOCABULARY: riddle – Rätsel; siblings – Geschwister
18 Read the two acrostics. Complete them with the words in the box.
Word box:
 sun, great, love, days, best, morning, game, difficult, all
First acrostic:
 Ben is my brother’s name,
 Rugby is his 1 ________________
 Other sports he likes:
 Tennis and basketball,
 He really does them 2 ________________
 Everybody likes him a lot.
 Really 3 ________________ to have such a brother.
Second acrostic:
 Sister, oh sister,
 I think you’re the 4 ________________
 So great to go out,
 To see you is great.
 Early in the 5 ________________
 Rising* like the 6 ________________
 Sometimes you’re the best.
 I like these 7 ________________
 Sometimes you’re worse?
 To get along with,
 Every moment –
 Rachel, my sister.
VOCABULARY: rise – aufgehen, steigen
19 Now write your own acrostic. Choose one of the family words, for example: Mother. Note that the acrostic doesn’t have to rhyme.
LISTENING
Talking about rules / things you like doing
20
a Listen to two children talking about what they like doing. Who likes reading books?
(Photo: Rose)
 (Photo: Kenzo)
b Listen again and answer the questions.
Why do Rose’s parents ask her to put things together?
 ..................................................................................................................................
Why does she go shopping on her own?
 ..................................................................................................................................
What does she use for reading?
 ..................................................................................................................................
What sport does Kenzo like?
 ..................................................................................................................................
When are the matches?
 ..................................................................................................................................
What kind of books does he like?
 ..................................................................................................................................
Where does he go once a week?
 ..................................................................................................................................
What is he pretty good at?
 ..................................................................................................................................
VOCABULARY: cupboard – (Geschirr-)Schrank; drive sb. crazy – jdn. verrückt machen
21 Listen to the dialogue. List what they must and mustn’t do.
must	mustn't
	

Page 86
MORE Words and Phrases
No.	Word / Phrase	Example Sentence	German Translation
3	auntie	My auntie arrived first.	Tantchen
	calm	It’s difficult for me to stay calm.	ruhig, gelassen
	girlfriend	My dad has a new girlfriend.	feste Freundin
	to be proud of	I’m very proud of myself.	stolz sein auf
	sense of humour	We’ve got the same sense of humour.	Sinn für Humor
	ugly	Your hat’s so ugly!	hässlich
	virus	I’ve got this virus.	Virus
5	to breathe	I like to breathe the clean air in the mountains.	(ein-)atmen
	to burn	You can burn wood on a fire.	(ver-)brennen
	foreign language	She doesn’t speak a foreign language.	Fremdsprache
	to panic	When you get scared, try not to panic.	in Panik geraten
	tractor	The farmer has a big tractor on his farm.	Traktor
	tool	You use a tool to make or build something.	Werkzeug
10	divorced	Rick’s parents are divorced.	geschieden
13	to be related to	Talk about the people and how they are related to you.	mit jdm. verwandt sein
15	to delete	Don’t delete the last email I sent you.	löschen
	file	You mustn’t go into my private files.	Ordner; Datei
	to print out	I should print out everything.	ausdrucken
16	public	You mustn’t shout in public.	öffentlich; in der Öffentlichkeit
	ice skating	I don’t like ice skating.	Eislaufen
S5	fault	It’s not my fault.	Schuld
	hopefully	This was hopefully the last time.	hoffentlich

```

## Output contract

Write `content/corpus/units/g2-u10/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u10",
  "briefBank": "96a3bd6f6117",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u10.s.like-ing",
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
