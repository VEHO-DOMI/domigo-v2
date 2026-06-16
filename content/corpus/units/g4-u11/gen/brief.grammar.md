# Grammar generation brief — g4-u11 (MORE! 4, Unit 11)

<!-- domigo:gen grammar g4-u11 bank=143b60cf5aef prompt=4b9164076103 -->

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

### `g4u11.s.reflexive-pronouns` — Reflexive pronouns (Reflexivpronomen)

Reflexive pronouns (myself, yourself, himself, herself, itself, ourselves, yourselves, themselves) used as the object when the subject and object are the same person, and for emphasis ('without help / personally'). Some German reflexive verbs do not take a reflexive pronoun in English.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [subject-equals-object]: Use a reflexive pronoun as the object when the subject and the object of the verb are the same person.
  - DE: Du verwendest ein Reflexivpronomen als Objekt, wenn das Subjekt und das Objekt des Verbs dieselbe Person sind.
  - "She asks herself a big question." — "Sie stellt sich eine große Frage."
  - "Did you hurt yourself?" — "Hast du dich verletzt?"
- rule [emphatic-use]: Use a reflexive pronoun for emphasis to stress that the person did something themselves (without help). by + reflexive pronoun means 'alone'.
  - DE: Du verwendest ein Reflexivpronomen zur Betonung, um zu unterstreichen, dass die Person etwas selbst (ohne Hilfe) getan hat. by + Reflexivpronomen bedeutet 'allein'.
  - "I wrote the book myself." — "Ich habe das Buch selbst geschrieben."
  - "You'll have to read the book yourself." — "Du wirst das Buch selbst lesen müssen."
- rule [no-reflexive-in-english]: Some verbs that are reflexive in German do NOT take a reflexive pronoun in English: enjoy, decide, feel, concentrate, remember, meet, hurry.
  - DE: Einige Verben, die im Deutschen reflexiv sind, haben im Englischen KEIN Reflexivpronomen: enjoy, decide, feel, concentrate, remember, meet, hurry.
  - "They're free to have parties and enjoy themselves. (BUT: I enjoyed the party, not 'I enjoyed myself the party.')" — "Sie können Partys feiern und sich vergnügen. (ABER: I enjoyed the party, nicht 'I enjoyed myself the party.')"
  - "He decides to enjoy himself by travelling with his wife." — "Er beschließt, sich zu vergnügen, indem er mit seiner Frau verreist."

common errors:
- Using a reflexive pronoun where English does not need one (German reflexive transfer): ✗ "I enjoyed myself the party." → ✓ "I enjoyed the party."
- Using the wrong reflexive pronoun form: ✗ "He hurt hisself." → ✓ "He hurt himself."
- Leaving out the reflexive pronoun where one is needed: ✗ "He hurt when he fell." → ✓ "He hurt himself when he fell."

SB box `g4/sb/More 4 SB Unit 11.txt#grammar-1` — Reflexive pronouns:
```
How to use it:
Wenn das Subjekt und das Objekt eines Verbs die gleiche Person sind, verwendest du ein Reflexivpronomen als Objekt.
Mithilfe des Reflexivpronomens kannst du betonen, dass die jeweilige Person etwas selbst getan hat / tun wird oder der Person selbst etwas zugestoßen ist.
Which kind of reflexive is it?
Write 1 or 2 after each example sentence:
He decides to enjoy himself by travelling with his wife.
1
I wrote the book myself. (= only me, no one helped me)
2
I’ll look after myself.
……
She asks herself a big question.
……
They’re free to have parties and enjoy themselves.
……
We bought the book ourselves.
……
We’re going to enjoy ourselves a lot.
……
Would you call yourself a reader?
……
You’ll have to read the book yourself.
……
[Image description: A cartoon of a person in a hospital bed fully bandaged, with one leg and both arms elevated, and their head wrapped in bandages. A visitor is standing next to the bed holding a bunch of colorful balloons. The visitor says: “I heard about your accident. Did you hurt yourself?”]
```

v1 seed items (UNTRUSTED):
- `m4-u11-reflexive-pronouns-gf-001` [gap-fill, d1]: p="Be careful with the knife! You might cut ___." c="yourself" a=["yourself"] ds=["you","your","yours"]
- `m4-u11-reflexive-pronouns-gf-002` [gap-fill, d1]: p="The cat licked ___ after dinner." c="itself" a=["itself"] ds=["it","his","herself"]
- `m4-u11-reflexive-pronouns-gf-003` [gap-fill, d2]: p="My little brother is only three, but he can already dress ___." c="himself" a=["himself"] ds=["hisself","him","herself"]
- `m4-u11-reflexive-pronouns-gf-004` [gap-fill, d3]: p="We really ___ the party last night." c="enjoyed" a=["enjoyed"] ds=["enjoyed ourselves at","enjoyed us","enjoyed ourselves"]
- `m4-u11-reflexive-pronouns-gf-005` [gap-fill, d4]: p="She looked at ___ in the mirror and smiled." c="herself" a=["herself"] ds=["her","itself","themselves"]
- `m4-u11-reflexive-pronouns-gf-006` [gap-fill, d5]: p="We need to concentrate ___ on the task. No distractions!" c="---" a=["---",""] ds=["ourselves","us","ourself"]
- `m4-u11-reflexive-pronouns-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="The children enjoyed the trip to the zoo." a=["The children enjoyed the trip to the zoo."] ds=["The children enjoyed themselves the trip to the zoo.","The children enjoyed them the trip to the zoo.","The children enjoyed themself the trip to the zoo."]
- `m4-u11-reflexive-pronouns-mc-002` [multiple-choice, d3]: p="Choose the correct option: 'She painted the picture all by ___.'" c="herself" a=["herself"] ds=["her","itself","sheself"]
- `m4-u11-reflexive-pronouns-mc-003` [multiple-choice, d4]: p="Which sentence uses the reflexive pronoun correctly?" c="He hurt himself while playing football." a=["He hurt himself while playing football."] ds=["He hurt hisself while playing football.","She decided herself to stay home.","We met ourselves at the cinema."]
- `m4-u11-reflexive-pronouns-ec-001` [error-correction, d2]: p="Find and fix the mistake: He hurt hisself when he fell off the bike." c="He hurt himself when he fell off the bike." a=["He hurt himself when he fell off the bike.","He hurt himself when he fell off the bike","He hurt himself when he fell off his bike."] ds=[]
- `m4-u11-reflexive-pronouns-ec-002` [error-correction, d3]: p="Find and fix the mistake: I can't remember myself where I put my keys." c="I can't remember where I put my keys." a=["I can't remember where I put my keys.","I can't remember where I put my keys","I cannot remember where I put my keys."] ds=[]
- `m4-u11-reflexive-pronouns-ec-003` [error-correction, d4]: p="Find and fix the mistake: The children enjoyed themselves the new playground." c="The children enjoyed the new playground." a=["The children enjoyed the new playground.","The children enjoyed the new playground","The kids enjoyed the new playground."] ds=[]
- `m4-u11-reflexive-pronouns-tf-001` [transformation, d2]: p="Your friend asks if someone helped you paint. Tell them: 'No, I painted this picture all by ___.'" c="myself" a=["myself"] ds=[]
- `m4-u11-reflexive-pronouns-tf-002` [transformation, d3]: p="Your parents weren't home last night. Tell them what you did: 'Don't worry — I made dinner ___!'" c="myself" a=["myself"] ds=[]
- `m4-u11-reflexive-pronouns-tf-003` [transformation, d4]: p="Your friend wrote 'they taught theyself.' Fix the reflexive pronoun: 'They taught ___.'" c="themselves" a=["themselves"] ds=[]
- `m4-u11-reflexive-pronouns-tr-001` [translation, d3]: p="🇩🇪 Er hat sich beim Fussballspielen verletzt." c="He hurt himself while playing football." a=["He hurt himself while playing football.","He hurt himself while playing football","He hurt himself playing football.","He injured himself while playing football."] ds=[]
- `m4-u11-reflexive-pronouns-tr-002` [translation, d5]: p="🇩🇪 Ich kann mich nicht erinnern, wo ich meinen Schluessel hingelegt habe." c="I can't remember where I put my key." a=["I can't remember where I put my key.","I cannot remember where I put my key.","I can't remember where I put my key","I can't remember where I left my key."] ds=[]
- `m4-u11-reflexive-pronouns-sb-001` [sentence-building, d1]: p="Put the words in the correct order: herself / she / in / the / looked / at / mirror" c="She looked at herself in the mirror." a=["She looked at herself in the mirror.","She looked at herself in the mirror"] ds=[]
- `m4-u11-reflexive-pronouns-mt-001` [matching, d2]: p="Match each subject with the correct reflexive pronoun. 1: I 2: he 3: they 4: we 5: she" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"e\",\"4\":\"d\",\"5\":\"b\"}"] ds=["a: himself","b: herself","c: myself","d: ourselves","e: themselves"]
- `m4-u11-reflexive-pronouns-qf-001` [question-formation, d3]: p="Tom taught himself to play the guitar. Ask about: who taught Tom" c="Who taught Tom to play the guitar?" a=["Who taught Tom to play the guitar?","Who taught Tom to play guitar?","Who taught him to play the guitar?"] ds=[]
- `m4-u11-reflexive-pronouns-gf-007` [gap-fill, d1]: p="Be careful with the knife! Don't cut ___!" c="yourself" a=["yourself"] ds=["you","yourselves","itself"]
- `m4-u11-reflexive-pronouns-gf-008` [gap-fill, d2]: p="The children made the birthday cake all by ___." c="themselves" a=["themselves"] ds=["theirselves","their self","yourselves"]
- `m4-u11-reflexive-pronouns-gf-009` [gap-fill, d2]: p="He looked at ___ in the mirror and smiled." c="himself" a=["himself"] ds=["him","his","hisself"]
- `m4-u11-reflexive-pronouns-gf-010` [gap-fill, d3]: p="I taught ___ to play the guitar using YouTube videos." c="myself" a=["myself"] ds=["me","my","I"]
- `m4-u11-reflexive-pronouns-gf-011` [gap-fill, d4]: p="She introduced ___ to the new neighbours when she moved in." c="herself" a=["herself"] ds=["her","she","hers"]
- `m4-u11-reflexive-pronouns-gf-012` [gap-fill, d5]: p="In English, we say 'I can't remember' — NOT 'I can't remember ___'." c="myself" a=["myself"] ds=["me","itself","ourselves"]
- `m4-u11-reflexive-pronouns-mc-004` [multiple-choice, d2]: p="Which sentence correctly uses a reflexive pronoun?" c="She burnt herself while cooking dinner." a=["She burnt herself while cooking dinner."] ds=["She burnt her while cooking dinner.","She burnt himself while cooking dinner.","She burnt themselves while cooking dinner."]
- `m4-u11-reflexive-pronouns-mc-005` [multiple-choice, d3]: p="Which sentence does NOT need a reflexive pronoun?" c="I feel great today!" a=["I feel great today!"] ds=["She hurt herself during the match.","We enjoyed ourselves at the party.","He taught himself to code."]
- `m4-u11-reflexive-pronouns-mc-006` [multiple-choice, d5]: p="Choose the correct sentence with 'by + reflexive pronoun':" c="She prefers to travel by herself." a=["She prefers to travel by herself."] ds=["She prefers to travel by her.","She prefers to travel by sheself.","She prefers to travel by herselves."]
- `m4-u11-reflexive-pronouns-ec-004` [error-correction, d2]: p="Find and fix the mistake: We really enjoyed us at the beach yesterday." c="We really enjoyed ourselves at the beach yesterday." a=["We really enjoyed ourselves at the beach yesterday.","We really enjoyed ourselves at the beach yesterday"] ds=[]
- `m4-u11-reflexive-pronouns-ec-005` [error-correction, d3]: p="Find and fix the mistake: I can't concentrate myself when there's loud music." c="I can't concentrate when there's loud music." a=["I can't concentrate when there's loud music.","I can't concentrate when there's loud music"] ds=[]
- `m4-u11-reflexive-pronouns-ec-006` [error-correction, d4]: p="Find and fix the mistake: The children dressed theirselves quickly because they were late." c="The children dressed themselves quickly because they were late." a=["The children dressed themselves quickly because they were late.","The children dressed themselves quickly because they were late"] ds=[]
- `m4-u11-reflexive-pronouns-tf-004` [transformation, d3]: p="Rewrite with 'by + reflexive pronoun' to mean 'alone': My little sister cleaned her room without any help. → My little sister cleaned her room ___." c="by herself" a=["by herself","My little sister cleaned her room by herself.","all by herself"] ds=[]
- `m4-u11-reflexive-pronouns-tf-005` [transformation, d4]: p="Add the correct reflexive pronoun where needed. If no reflexive is needed, write 'no change': I need to relax ___ after this stressful week." c="no change" a=["no change","No change","I need to relax after this stressful week."] ds=[]
- `m4-u11-reflexive-pronouns-tr-003` [translation, d3]: p="🇩🇪 Ich habe mich verletzt, als ich Fussball gespielt habe." c="I hurt myself when I was playing football." a=["I hurt myself when I was playing football.","I hurt myself when I was playing football","I hurt myself playing football.","I hurt myself while playing football.","I injured myself when I was playing football."] ds=[]
- `m4-u11-reflexive-pronouns-tr-004` [translation, d5]: p="🇩🇪 Ich erinnere mich nicht an seinen Namen." c="I don't remember his name." a=["I don't remember his name.","I don't remember his name","I can't remember his name.","I do not remember his name."] ds=[]
- `m4-u11-reflexive-pronouns-sb-002` [sentence-building, d1]: p="Put the words in the correct order: himself / he / cut / shaving / while" c="He cut himself while shaving." a=["He cut himself while shaving.","He cut himself while shaving"] ds=[]
- `m4-u11-reflexive-pronouns-sb-003` [sentence-building, d3]: p="Put the words in the correct order: by / the / project / ourselves / we / did / whole" c="We did the whole project by ourselves." a=["We did the whole project by ourselves.","We did the whole project by ourselves"] ds=[]
- `m4-u11-reflexive-pronouns-mt-002` [matching, d3]: p="Match each subject with the correct reflexive pronoun. 1: I 2: you (singular) 3: he 4: she 5: we 6: they" c="{\"1\":\"b\",\"2\":\"f\",\"3\":\"d\",\"4\":\"a\",\"5\":\"c\",\"6\":\"e\"}" a=["{\"1\":\"b\",\"2\":\"f\",\"3\":\"d\",\"4\":\"a\",\"5\":\"c\",\"6\":\"e\"}"] ds=["a: herself","b: myself","c: ourselves","d: himself","e: themselves","f: yourself"]
- `m4-u11-reflexive-pronouns-qf-002` [question-formation, d4]: p="Your friend fell off her bike yesterday. Ask if she hurt herself. Start with 'Did...'" c="Did you hurt yourself?" a=["Did you hurt yourself?","Did you hurt yourself","Did she hurt herself?"] ds=[]

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
- **g4-u09**: border, communicate, fashionable, firstly, funeral, health risk, in common, needle, permanent, pierced, rebellious, religious, ceremony, bury, devil, confused, Far East, gesture, greet, index finger, insult, nod the head, palm, pass something on, thumb, victory, zero, decent-looking, embarrassed, giggle, goth, hastily, ignore, sigh, sitting room, scare off, sleeve, possibility, wedding dress, wedding suit, bride, bridegroom, bridesmaid
- **g4-u10**: oil, Fair Trade, farmer, make a living, pay rise, pesticide, select, agreement, increase, rate, brother-in-law, defeat, harmony, human being, hurtful, ignorance, overcome, painful, racism, racist, recognition, slavery, son-in-law, angry, annoy, helpless, hurt, misunderstood, proud, shocked, surprised, claim, bicycle, fairness, hell, introduction, pollution
- **g4-u11**: Fiction, Reference, Poetry, Non-fiction, Classics, comic, screenplay, play, anthology, dictionary, biography, novel, short story, book review, fence, innocent, disappointment, prefer, blurb, millionaire, fairy, historical novel, reference, trilogy, answer the door, clear up, goggles, kilt, sort oneself out, spot of bother, wee, obey, scratch

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Africans, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Aztecs, Bacon, Bagsley, Baker, Balcony, Barbie, Barcelona, Barker, Barry, Bartholdi, Beast, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Body, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Boyce, Boyne, Bradley, Brazil, Brazilian, Brenda, Brian, Bridge, Brighton, British, Broome, Brown, Bruno, Buckells, Buckingham, Buddy, Bulgaria, Burgers, Busy, Butterfly, Buy, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celeste, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Conditional, Continuous, Control, Convention, Cooperative, Costa, Cottrell, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dracula, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Elizabethan, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, Fair, False, Fame, Fang, Far, Faye, Feeling, Felicity, Fell, Fidel, Fido, Fink, Fleming, Flicka, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Greece, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Iceman, Imagine, Imperatives, Inc, India, Indonesia, Indonesian, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Ishmael, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Japanese, Jasmine, Jason, Jasper, Jay, Jeff, Jefferson, Jeffery, Jekyll, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jim, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Jr, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katia, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Kwame, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Lauren, Laurie, Lauriston, Lawrence, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Luther, Machu, Madonna, Mail, Malala, Malaysia, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Martin, Marvel, Mary, Matt, Matterhorn, Maun, Max, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Millers, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Nancy, Napa, Natasha, Nathan, National, Natural, Navy, Neill, Neither, Nelson, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekt, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Potter, Prepositions, Present, President, Prez, Priestly, Princess, Pro, Professor, Project, Protestant, Pulitzer, Pump, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Ready, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricks, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scobie, Scotland, Scott, Scottish, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shmuel, Shrek, Sicily, Sie, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sofia, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Sprecher, Sputnik, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thailand, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trade, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Twain, Types, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willow, Wilson, Wise, Wolf, Work, Workout, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 11.txt -----
Unit 11 Ready for reading
Page 90–91
You learn
about different types of books
how to use reflexive pronouns
You can
talk about what you like to read
read extracts from novels written in English
write a book report
Get talking
1 Which of these books looks interesting to you? If you had to pick one, which one would it be and why?
I’d pick ... because ...
it looks interesting/funny/thrilling/exciting …
I like thrillers, love/horror/sci-fi stories.
I’ve already read ... by the same author.
[Book covers shown: Jacqueline Wilson, Harry Potter, The Curious Incident of the Dog in the Night-Time, Malorie Blackman - Double Cross]
2 Read Brenda’s book review. Does she recommend the book?
Brenda’s Books [Image of Brenda with caption: Hi, this is Brenda’s Books online, and this week I’m recommending a book that really, really grabbed me. It’s The Boy in the Striped Pyjamas by John Boyne. It came out in 2006. My History teacher told me about it, so I myself got a copy and I finished the book in one go. I passed it on to some of my friends and they were all really moved by the book.]
The Boy in the Striped Pyjamas
by John Boyne ★★★★★
Bruno is nine and he lives in Berlin with his parents. His father is a soldier. One day his father and the family are sent to a place called Out-With. The place is terrible. There is nobody to play with and Bruno is bored. So he starts exploring and finds out that there are people living in a large camp on the other side of a high fence. Bruno notices that they all wear striped pyjamas. Then he sees a boy on the other side of the fence. The boy is called Shmuel. They get talking, but they can’t play together because of the fence between them.
Bruno visits Shmuel as often as he can. One day Shmuel tells Bruno that his people were missing somewhere in the camp. Bruno crawls through a small hole in the fence, puts on striped pyjamas and helps Shmuel explore the camp.
The interesting thing about the book is that we see everything through Bruno’s eyes. Bruno has no idea that Out-With is the concentration camp of Auschwitz. He is mostly interested in the world of games and dreams and he only finds out the truth about the concentration camp very slowly. Through the eyes of this innocent little boy, the reader sees and feels the horrors of that time. A great read, not only for people who are interested in history, but for everyone.
3 Read the review again and put the events in the order they happen in the book. ☐ Bruno makes a new friend.
☐ Bruno’s friend tells him about a problem.
☐ Bruno sees many people wearing striped pyjamas.
☐ Bruno and his family move to another place.
☐ Bruno goes to help his friend.
☐ Bruno starts looking around his new home.
4 a Listen to Max and Chloe talking about The Boy in the Striped Pyjamas and answer the question.
Which is true of Max?
☐ He preferred the book.
☐ He liked the book and the film the same.
☐ He preferred the film.
b Listen again. What do they say about the film? What do they say about the ending?
Which other books do they recommend? Discuss in groups of four.
5 Look at the cover of the book. Then guess which blurb (the text on the back cover) goes with the book. [Image of book cover: millions by Frank Cottrell Boyce]
☐ 1 This is a great book for animal lovers! It’s about a boy who wins a lot of money and opens a donkey sanctuary with it.
☐ 2 This is a fantastic book about a boy who suddenly gets a lot of money – and has to spend it quickly.
☐ 3 This is a funny story about a young millionaire who gives away all his money and decides to enjoy himself by travelling around the world.
6 Listen to five people talking about books and match the people 1–5 with opinions A–F.
Use each letter only once. There is one letter left.
[Images of people and book covers: 1 Julie (millions), 2 Fred (Artemis Fowl), 3 Lisa (Pollyanna), 4 Farid (The Beautiful Game), 5 Soo-Min (Solo: Running Alone)]
A is too busy to read a lot.
B prefers watching films to reading.
C likes books about the past.
D only reads what the teachers give for homework.
E is a fan of fantasy novels.
F reads a book about every two weeks.
Page 92–93
Vocabulary – Types of books
7 Match the types of books with the definitions.
1 poetry anthology ☐ a collection of short pieces of fiction
2 novel ☐ a book about someone’s life
3 anthology of short stories ☐ a work of fiction to be performed on stage
4 biography ☐ a collection of poems
5 play ☐ a reference book used when you want to find the meaning of a word
6 dictionary ☐ a work of fiction to be filmed
7 screenplay ☐ a long piece of fiction
8 comic ☐ a fictional story in pictures
Free flow
8 Look at the questions and make notes of your answers. Then discuss the questions in small groups.
1 What other types of books can you think of?
2 Which of these types of books do you enjoy reading most?
3 Which of these types of books do you read least?
4 Imagine you can only look at four books for the rest of your life. What books would you choose and why?
9 Work in pairs. One of you will play the role of a librarian (A), the other will play the role of a student (B). Take 1 minute to prepare your discussion. Use the prompt cards to help you. Talk for 2–3 minutes.
Prompt Card A
You are a librarian. You are going to recommend some books to a teenager.
Find out what kind of books he/she likes.
Find out about his/her favourite authors.
Think about some books you have read and really enjoyed. What were they about and what did you like most about them?
Prompt Card B
You like reading but are not sure what to read. Ask the librarian for recommendations. Think about:
what kind of books you like and the last few books you read
the kind of books you don’t really like
what kind of books you only read when you have to
some authors you really like
Page 93–94
10 Look at the book cover and read the blurb. Would you be interested in reading the book?
Why / Why not?
[Image of the book cover: Sputnik’s Guide to Life on Earth by Frank Cottrell Boyce. The blurb reads:]
ONE SUMMER TO SAVE THE WORLD!
When Prez meets Sputnik – a small, loud alien – he’s shocked to hear that the world is about to be destroyed. Unless Prez can show Sputnik ten things worth seeing or doing on Earth ...
But Prez’s list of amazing things is not quite the same as Sputnik’s – will it be enough to save the planet?
11 Look at the illustration on the right that shows Sputnik. Can you think of an explanation for the illustration?
[Image shows a small character (Sputnik) reflected in a mirror not as himself, but as a dog.]
Vocabulary
12 Match the words and the definitions.
1 clear up ☐ go and open the door for a visitor
2 answer the door ☐ a small problem
3 wee ☐ special glasses that fit close to your face to protect your eyes
4 spot of bother ☐ successfully deal with a problem
5 sort oneself out ☐ making a place tidy
6 kilt ☐ very small (used mainly in Scotland)
7 goggles ☐ a traditional Scottish skirt for men
13 Prez is an orphan and lives in a home for orphans, called The Temporary. One summer he goes to spend some time with a farmer and his family where he meets Sputnik, a small alien from outer space. Sputnik is the only person Prez speaks to and only Prez sees Sputnik as he really is. The family just see a small dog. Listen to the passage when Prez first meets Sputnik and answer the questions.
1 Why does Prez answer the doorbell?
2 Why doesn’t he like answering doorbells?
3 Why can’t Prez live with his grandfather at the moment?
4 What is unusual about the way Sputnik looks?
5 What weapon does Sputnik have?
6 How does Prez greet Sputnik?
7 What does Sputnik do?
14 Sputnik comes to see if there are ten things worth seeing or doing on Earth. If there are, Earth will not be destroyed. Get together in groups of four and make your own list to save the planet. Compare your list with another group’s.
15 In Catherine MacPhail’s The Evil Within she tells the story of a young Henry Jekyll and a beast that runs wild in Edinburgh. The action is set before the events in Robert Louis Stevenson’s famous novella The Strange Case of Dr. Jekyll and Mr. Hyde (1886).
In this extract, Henry talks to Mary, a servant girl in the Jekyll-household.
“Good morning, Mary.” It is a moment before I dare to go on.
“I believe you had a very exciting night last night.”
Her face flushes. Even her freckles seem to glow. “Oh, sir, what a night it was indeed,” then she stops. Her hand flies to her mouth. “Get back in there, words,” she cries. “Don’t you dare come out!”
I smile. Mary always makes me smile. “No, Mary,” I say. “Please tell me everything. No one else will. It will be our secret. Did you see the creature? Is he really a monster?”
She says nothing for a moment. I can see she is unsure whether to obey me*, or to obey everyone else in the house, Mrs Kerrand her mistress, my mother.
At last, I win. Mary answers my question.
“I didn’t see him myself, no, sir,” she says. “My mother wouldn’t allow her bairns* to look at him in case their eyes crossed forever.” When she sees my smile she shakes her head. “That can happen you know, sir.”
I nod and try to look serious. “I believe so.”
“But my father saw him clear as day,” she goes on. “He said he was bent double*, out of shape, a strange creature with hair over his face and long nails like the claws of a bird on his feet and on his hands. And blood – and scratches all over him.” She pauses. “That would be from all the killing he does.”
I can picture him myself, crawling through the alleys of the Old Town, scratching with those long nails at windows and doors. My heart beats faster.
“But has he killed anyone, Mary?”
Mary does not hesitate for a second. “Oh yes, sir, for sure. Cats and stray dogs he has killed, we know that. But there will be more, everyone is saying it.” She nods her head. “Oh yes, sir. The bodies will turn up soon. You wait and see.”
“Has he confessed?” I ask her.
Now she shakes her head. “Not yet, sir.” She sounds disappointed. “He doesn’t talk at all. He grunts and roars like an animal. Oh I am so glad he’s been caught, sir.”
“So am I,” I tell her. “You will tell me if you hear anything else, Mary?”
“Oh, I don’t know, sir.” Her nose scrunches*. “I’m always being told I talk too much.”
“I won’t tell, I promise,” I say. I take a step closer to her. “You are the only one I can rely on, Mary.”
Her face beams with pleasure. “Then you can rely on me, sir. If I hear any more about the Beast, I will be sure to let you know.”
VOCABULARY: obey = gehorchen; bairns = Kinder; bent double = zusammengekrümmt; scrunch = rümpfen
Page 95–96
16 How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
Circle T (True) or F (False).
1 Mary isn’t very excited about the incident*. T / F
2 Mary shouldn’t tell young Jekyll about the monster. T / F
3 Henry promises it’ll be their secret. T / F
Complete the sentences.
4 Mary isn’t sure who to …
5 Mary believes when looking at a monster your …
6 The blood and the scratches on the creature came …
Answer the questions.
7 What evidence is there that the creature they caught is the monster?
8 How does Henry react to Mary’s story?
9 What does he make Mary promise?
VOCABULARY: incident = Zwischenfall
17 CHOICES
Writing for your Portfolio
A Next day Mary hears again about the Beast. She tells Henry about it.
Write that paragraph to continue the story (40–70 words). Write about:
where and when she has heard about the Beast
what exactly happened
how Henry reacts
B Write a book report on a book you’ve read. Use the text in 2 as a model. Write 120–180 words. Do not forget to use paragraphs. Include the following:
the title of the book and the author
what type of book it is
the content of the book
what you like about the book and why
what you don’t like about the book and why
who you would (not) recommend the book to
GRAMMAR
Reflexive pronouns
How to use it:
Wenn das Subjekt und das Objekt eines Verbs die gleiche Person sind, verwendest du ein Reflexivpronomen als Objekt.
Mithilfe des Reflexivpronomens kannst du betonen, dass die jeweilige Person etwas selbst getan hat / tun wird oder der Person selbst etwas zugestoßen ist.
Which kind of reflexive is it?
Write 1 or 2 after each example sentence:
He decides to enjoy himself by travelling with his wife.
1
I wrote the book myself. (= only me, no one helped me)
2
I’ll look after myself.
……
She asks herself a big question.
……
They’re free to have parties and enjoy themselves.
……
We bought the book ourselves.
……
We’re going to enjoy ourselves a lot.
……
Would you call yourself a reader?
……
You’ll have to read the book yourself.
……
[Image description: A cartoon of a person in a hospital bed fully bandaged, with one leg and both arms elevated, and their head wrapped in bandages. A visitor is standing next to the bed holding a bunch of colorful balloons. The visitor says: “I heard about your accident. Did you hurt yourself?”]
Page 97
The Mag 6
 Stern gets worried
1 🎧 Watch the story. Then circle T (True) or F (False).
1 Jessica and Stern aren’t going to the cinema any more. T / F
 2 Mr Ricks runs a theatre group at the school. T / F
 3 Liam goes with Jessica to interview Mr Ricks. T / F
 4 Linda is Stern’s new girlfriend. T / F
 5 Stern thinks Jessica likes Liam. T / F
2 Answer the questions and say what you think.
1 Stern says he and Jessica should not hang out with each other so often. Why does he say that?
 2 How does Jessica react and how does she feel about it?
 3 What happens when Lucy wants an interview with Mr Ricks, their teacher?
 4 One day Stern’s mum wakes him up in the middle of a rather bad dream. What was it about?
 5 How does Stern feel when he hears that Liam has a new girlfriend, Linda?
 6 Why does Stern ask Jessica at the end of the episode if she is disappointed?
Everyday English
3 Complete with the phrases in the box. Then practise the dialogues.
What are you up to  By the way  Let’s get cracking  Are we still on for
(Image 1: A boy and a girl are sitting on the grass in a field, talking.)
 Boy: Okay, that’s cool. Just one thing.
 1 ............................................................ the cinema tonight?
 Girl: Sure. Course we are.
(Image 2: A girl approaches a boy in a hallway.)
 Girl: Hey, Stern!
 2 ............................................................ ............................................................ ?
 Boy: Oh, it’s you. Errm… I was just daydreaming.
(Image 3: A boy and a girl are smiling and talking in a school corridor.)
 Boy: OK.
 3 ............................................................ !
(Image 4: A boy with a camera is standing in a library, talking to two other students.)
 Boy: Oh, hi guys. I just wanted to pick up my camera. Oh!
 4 ............................................................ ............................................................ come round to my place tonight. I want you both to meet Linda.


----- WB: More 4 WB Unit 11.txt -----
UNIT 11 – Ready for reading
Page 84–85
Reading
1 Match the words and the definitions. Use a dictionary if necessary.
collective – involving everyone
mild – not strong
impassively – showing no emotion
boost – make something grow or increase
glare – to look at someone in an angry way
dim – not bright
take a dim view – if you do not approve
twitch – a movement you can’t control
smolder – burning (with anger)
2 Michael Gerard Bauer’s novel Don’t Call Me Ishmael is about bullying and friendship. Ishmael Lesueur is in 9th grade and looking forward to another year of being bullied by Barry Bagsley. He’s trying to make himself as invisible as possible. But one day everything changes. A new pupil, James Scobie, joins the class. Scobie isn’t afraid of anything, not even Bagsley, who is trying hard to scare him.
Read an extract in which the teacher, Mr Barker, has just left the room and Bagsley is threatening Scobie.
“Why don’t you do yourself a favor and crawl back down your hole with the rest of the hobbits? I’m counting to five,” Bagsley said to Scobie.
The class took a collective breath.
[…]
“One.”
“Excellent start,” said James Scobie encouragingly.
“Two.”
“You’re going really well. Need any help with the next one?”
“Three.”
“If it’s easier for you, you could just tap it out with your foot.”
“Four.”
“There’s no shame in using a calculator at this point.”
“Five.”
“Bingo!”
Barry Bagsley’s eyes narrowed. I watched his hand mold into a fist and the muscles in his arms tighten. James Scobie blinked impassively. The room waited. What’s this, what’s going on here? Why are we out of our desks? Mr Bagsley? Mr Scobie? Are we choosing partners for the next dance? Mr Barker’s voice boomed into the room and shook it like an earthquake. “Well? I’m waiting.”
James Scobie turned around slowly to face Mr Barker. “It’s nothing, sir,” he said. “This boy was just explaining the school’s bullying policy to me.”
Mr Barker raised his eyebrows and glared at Barry Bagsley. “Was he? Was he indeed? Well, Mr Bagsley and I have had our own discussions on that subject in the past, haven’t we, Mr Bagsley? Yes, that’s right. Glad to see you remember. Well, I trust that you made it very clear to Mr Scobie that we don’t tolerate bullying in any format at St Daniel’s and we take a very dim view – a very dim view – of anyone who practices it.” Mr Barker looked around the room. “And I’m equally certain that if anyone here was bullied or anyone here witnessed another boy being bullied, they would immediately inform me or one of the other teachers. Everyone should feel safe at St Daniel’s. I’m sure Mr Bagsley pointed that out to you, because that’s what our bullying policy is all about, Mr Scobie. No one should be afraid here. Are you clear on that, Mr Scobie?”
“You don’t have to worry about me in that regard,” replied James Scobie. “I have every faith in the school’s bullying policy, and after talking with Mr Bagsley here, I also have a great respect for the quality of education that the school provides.”
“Really?” said Mr Barker cautiously.
“Absolutely. Mr Bagsley has just given us all a demonstration of how he can count to five …”
“Jab!”
“… and he didn’t use his fingers once.”
“Uppercut!”
The class laughed. Mr Barker frowned. James Scobie twitched. Barry Bagsley smoldered.
BRUIIIILLIANT!
“All right, move out, you lot. I’ll check those exercises tomorrow and that is a threat. Oh, and Mr Bagsley, could I have a word in your shell-like ear before you go?”
James Scobie and I packed up our books and drifted outside.
the words in italics are Ishmael’s thoughts
3 How many of these tasks can you do? Check your answers with a partner.
Barry is counting the seconds James has to leave the room.
T / F
While Barry is counting, James is making fun of him.
T / F
Barry makes a fist and hits James.
T / F
James tells the teacher that Barry told him about …
……………………………………………………….
It is not the first time that the teacher and Barry discuss …
……………………………………………………….
The teacher wants to be informed if anyone …
……………………………………………………….
What is the school bullying policy?
……………………………………………………….
Why does James say he has great respect for the quality of education at school?
……………………………………………………….
What is the interest the teacher makes? ……………………………………………………….
Listening
4 Listen to Ryan and Lauren talking about a book. Then answer the questions below.
Where are Lauren and Ryan?
What does Ryan want?
Lauren doesn’t want to get any ice cream right away. Why not?
What’s the title of the book?
What’s the main character’s name?
What happens when young people are 16?
What’s Ryan’s opinion of the book?
Why does the group The Smoke hide?
Why do the leaders try to spy on them?
Who is David?
What does David tell Tally?
Why doesn’t Ryan want to read the book first?
Page 86–87
Grammar – Reflexive pronouns
5 Complete the mini-dialogues with reflexive pronouns.
1 Angelina: Would you call ____________________ a reader, Lucas? Lucas: Sure. I’d call ____________________ not only a reader, but a bookworm.
2 Mum: I hope the kids enjoy ____________________ at camp. Dad: Why shouldn’t they? There’s plenty to do, and for rainy days they’ve got their books.
3 Sam: We suddenly found ____________________ in front of a nice bookshop, and we decided to go in. Ruby: So did you get ____________________ something good to read? Sam: No, I didn’t have any money.
4 Elli: That’s a great book review. Did you write it ____________________? Or did you copy it off the net? Ahmed: Of course, I wrote it. I always write the reviews ____________________.
5 Fred: Lisa really enjoyed ____________________ yesterday, she told me. Peter: What did she do? Fred: She went to see a play at the Globe.
6 Amy: Did you like the Warcross book by Marie Lu? Nina: I haven’t yet read it ____________________, but Adrian says it’s good.
7 Luke: The story about horses in World War I was really great. Andrew: And was anything about it true? Luke: Of course. The author says he researched every bit ____________________.
8 Joanna: My friends just self-published a little book on volcanoes. Tony: Really? Who helped them? Joanna: Nobody. They did ALL the work ____________________.
6 Complete the sentences with the correct reflexive pronouns. Then match the sentences and answers.
1 I don’t think Jeremy can look after ____________________. 2 Let’s make ____________________ a nice cup of tea and read for a bit. 3 What about the twins? Are they enjoying ____________________? 4 Late again! You’ve got ____________________ into big trouble this time. 5 She designs all the covers for her books ____________________.
□ But I’d really like to go out for a change!
□ Maybe she shouldn’t. I think they look terrible.
□ Yes, by coincidence they met other twins.
□ Don’t worry. I’m sure he can.
□ Sorry, sir, but we had to help in the library.
7 Write sentences with reflexive pronouns. Use these prompts.
1 I – bake cake
I baked the cake myself.
2 We – cook dinner
3 They – ask the same question
4 He – pick up the prize
5 You – review the book
6 She – not enjoy at the movies
8 Match the sentence halves.
1 Why don’t you two read a good book and enjoy □ yourself this question? 2 Honestly, Dave, how often have you asked □ ourselves. 3 I’m 16 – I really think I can look after □ herself. 4 I can remember what he looked like, but not what he called □ yourself? 5 We don’t need anyone to tell us how to behave □ themselves. 6 She played well, but then she fell and hurt □ himself. 7 This is such a good poem! I can’t believe you wrote it □ yourself! 8 I haven’t got any money left. They’ll have to buy it □ himself.
9 Look at the film titles below and fill in the missing reflexive pronouns.
1 Eddie Explains ____________________ 2 Honey, We Shrunk ____________________! 3 I Love ____________________ 4 Just Be ____________________ 5 Mother’s Not ____________________ Today 6 Sisters Are Doing It for ____________________ 7 The Brain That Changes ____________________ 8 The Man Who Spoke to ____________________
Vocabulary
10 Find nine words connected to books in the word search. Write them down.
S Y K M L S D W B E C S Y D D
V Y R E E C C U A D B B A L L
L L V T J R O R H D M F T O C
Y O X E E G A U E U O N A M T
N D R M R O C C K Q E C M N V
G W U Q A X P Z T Y O I F P D
O P G M G J V G Y T P M X N
S H O R T S T O R I E S H A A
Y G O V C I N T A N P L A Y A
S U V G A O Q P X L N S S V Y
Page 88–89
11 Complete the sentences with words from 10.
1 Yesterday we were at the theatre and saw a play by Shakespeare.
 2 I have always been interested in the life of Bob Dylan, and I’m happy I got his biography for my birthday.
 3 This summer I want to read all the Alex Rider adventures.
 4 I hate it when I read a book and have to look up words in the dictionary all the time.
 5 A novel’s too much for me — I’d prefer an anthology of short stories that I can choose from.
 6 Check with the encyclopaedia. You’ll find that not all scenes have been filmed.
 7 Every evening I read a bit of my anthology of classic English poems.
12 Write three sentences about what you prefer to read most. Give your reasons why.
.................................................................................................................................................
 .................................................................................................................................................
 .................................................................................................................................................
13 Complete the sentences with the words and phrases in the box.
wee, goggles, spot of bother, answer the door, kilt, clearing up, sort herself out
1 I think that was the bell. Can you go and answer the door, Paul?
 2 My uncle’s Scottish. He says wee instead of ‘small’.
 He also wears a kilt sometimes.
 3 I spent all day clearing up the mess you made in the kitchen.
 4 I always wear goggles when I swim so I can keep my eyes open under the water.
 5 My aunt spent six months in India to try and sort herself out.
 6 Can I help? It looks like you’re in a spot of bother.
Everyday English Stern gets worried
🎧 Complete the dialogue with the expressions from the box.
By the way / Let’s get cracking / Are we still on for / What are you up to
Dorian: Hi, Sophie. Are we still on for that cup of coffee after school?
 Sophie: I’d love to, but I can’t. I’ve got to do something else.
 Dorian: Really? ..............................................................
 Sophie: Nothing really, but I’ve got to see my Maths teacher after class about some extra work.
 Dorian: OK. Listen, what if I wait for you?
 Sophie: Would you? That’s so sweet of you. By the way, I’ve got something to tell you.
 Dorian: What is it?
 Sophie: I’ll tell you over coffee, okay. I’ve got to be in class. Oh, I’m late!
 Dorian: Me too! Let’s get cracking then. See you later!
Developing writing skills A review
14 Read the task and what a student wrote. Where does Nelson find the machine?
📘 Task
 Write a review of a book you liked (120–180 words). Include the following:
an opening to your review
a brief plot synopsis*
who the main characters are
reasons why the book was interesting/funny, etc.
how difficult it was to read
a recommendation
📖 VOCABULARY:
 synopsis = Zusammenfassung
JENNINGS, Garth: The Deadly 7 – Macmillan Children’s Books 2015; pp. 340
There are some books you simply can’t put down. The Deadly 7 is definitely one of them, because the adventures are so incredible, funny and wacky** and the characters are even wackier.
Nelson’s sister Celeste has disappeared in Spain, and her parents are off to help search for her. Nelson himself is in the care of his uncle Pogo, who is looking for a leak at St Paul’s cathedral in London. By chance Nelson discovers Sir Christopher Wren’s secret workroom and stumbles across** a machine that can extract the seven deadly sins from a person. They appear in the shape of rather strange creatures, only visible to Nelson, and they cause a series of rather turbulent events.
The Deadly 7 decide to help Nelson, and their adventures to find Celeste lead them to the Brazilian jungle where magic powers are at work.
This mix of embarrassing incidents and adventure offers easy and entertaining reading. It is Jennings’ first novel for kids and I certainly hope he writes more.
📝 Useful language:
plot
point of view
time-frame
narrator
hero/heroine
protagonist
antagonist
📌 VOCABULARY:
 wacky – verrückt, blöd
 stumble across – zufällig entdecken, über etw stolpern
📎 Image description: A book cover shows “THE DEADLY 7” in bold letters, with cartoon illustrations of quirky monster-like characters and a young boy.
Page 90–91
Writing Tip: When writing a book review, there are a few things to consider:
Mention the author, the title and the year of publication.
Try and come up with a sentence to introduce the feel of your review.
Summarise the content of the book but do NOT give the full plot away.
Say what you like or don’t like about the book.
Give reasons for your likes/dislikes.
Say if you would recommend the book to other readers. (Why / Why not?)
15 When describing the story of a book, here are some words you may need to help you. Match each one with its definition.
plot ☐
setting ☐
time-frame ☐
narrator ☐
protagonist ☐
antagonist ☐
a. how long it takes for the story to happen
b. who tells the story
c. the story, what actually happens
d. the hero/heroine
e. the villain
f. where the action takes place
16 Which of the words above does the reviewer talk about in 14?
17 Now write your own answer to the following task.
Task Write a book review for the school magazine (120–180 words). Pick a book you really liked (or disliked) and write about the following:
author and title
the setting
the characters
the dramatic situation
why you liked/disliked the book
recommendation (why / why not)
WORD FILE Types of books [Illustration of a bookshelf with the following labels:]
Fiction
Reference
Poetry
Non-fiction
Classics
Additional types listed:
comic
screenplay
play
poetry
anthology
dictionary
biography
novel
short story
MORE Words and Phrases
#	English	Example Sentence	German
2	book review	The book review was really good. – I’m definitely going to read it.	Buchrezension
2	fence	They built a fence around their garden so the dog can’t escape.	Zaun
2	innocent	During the war, many innocent people were killed.	unschuldig
3	disappointment	That new restaurant was a big disappointment. The food was awful.	Enttäuschung
3	prefer	I prefer jazz to rock music.	bevorzugen
5	blurb	Before I buy a book, I always read the blurb on the cover first.	Klappentext
6	millionaire	She won the lottery. Now she’s a millionaire.	Millionär/in
6	fairy	The good fairy gave me three wishes.	Fee
6	historical novel	Historical novels are books about the past.	historischer Roman
6	reference	There are a lot of references to famous songs in the book.	Bezug, Hinweis
6	trilogy	Have you read the last book of the trilogy?	Trilogie
12	answer the door	There is someone at the door. Can you answer it, please?	an die Tür gehen, jdn hereinbitten
12	clear up	Clear up your own mess!	aufräumen
12	goggles	Tom always wears goggles when he swims.	Schwimmbrille, Schutzbrille
12	kilt	He’s Scottish, so he’s wearing a kilt to his wedding.	Kilt, Schottenrock
12	sort oneself out	John took a week off work to sort himself out.	sich ordnen; zu sich selbst finden
12	spot of bother	He’s in a spot of bother with the police.	Problem; Ärger
15	wee	She’s playing on the field with her wee brother.	klein, winzig
15	obey	His dog has learned to obey several commands.	befolgen, gehorchen
15	scratch	That cat just scratched my arm.	kratzen

```

## Output contract

Write `content/corpus/units/g4-u11/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u11",
  "briefBank": "143b60cf5aef",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u11.s.reflexive-pronouns",
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
