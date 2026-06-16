# Grammar generation brief — g4-u02 (MORE! 4, Unit 2)

<!-- domigo:gen grammar g4-u02 bank=68861df2eca4 prompt=4b9164076103 -->

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

### `g4u02.s.past-perfect` — Past perfect (Past perfect (Vorvergangenheit))

The past perfect (had + past participle) for an action that had already happened before another point or action in the past, used to make the order of past events clear in narratives. It marks the earlier event; the past simple marks the later one.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [use-earlier-past-event]: Use the past perfect when you want to stress that an action had already happened before a certain time or another action in the past.
  - DE: Du verwendest das Past perfect, wenn du betonen möchtest, dass eine Handlung vor einem bestimmten Zeitpunkt oder einer anderen Handlung in der Vergangenheit schon geschehen war.
  - "Nobody was in the building. All the employees had left." — "Niemand war im Gebäude. Alle Angestellten waren gegangen."
  - "When Harry got up, he realised that he had put his tent in the wrong place." — "Als Harry aufstand, merkte er, dass er sein Zelt am falschen Platz aufgestellt hatte."
- rule [form-had-past-participle]: Form it with subject + had(n't) + the past participle (3rd form) of the verb. had is the same for all persons.
  - DE: Du bildest es mit Subjekt + had(n't) + dem Partizip Perfekt (3. Form) des Verbs. had ist für alle Personen gleich.
  - "The murderer was an orang-utan. It had escaped from a sailor." — "Der Mörder war ein Orang-Utan. Er war einem Matrosen entkommen."
  - "By the time we got there, the shop had closed." — "Als wir dort ankamen, hatte der Laden schon geschlossen."
- rule [sequence-with-past-simple]: In a sentence with two past events, the past perfect marks the earlier event and the past simple marks the later one.
  - DE: In einem Satz mit zwei vergangenen Ereignissen markiert das Past perfect das frühere Ereignis und das Past simple das spätere.
  - "When we arrived, the film had already started." — "Als wir ankamen, hatte der Film schon begonnen."
  - "She was tired because she hadn't slept well." — "Sie war müde, weil sie nicht gut geschlafen hatte."

common errors:
- Using the past perfect for all past events, not just the earlier one: ✗ "I had eaten breakfast and then I had gone to school." → ✓ "I had eaten breakfast and then I went to school."
- Missing the past perfect when the order of events matters: ✗ "When I arrived, everyone left." → ✓ "When I arrived, everyone had left."
- Using the wrong (past simple) form after had instead of the past participle: ✗ "I had went to the shop." → ✓ "I had gone to the shop."

SB box `g4/sb/More 4 SB Unit 2.txt#grammar-1` — 🟦 Past perfect:
```
Du verwendest das Past perfect, wenn du betonen möchtest, dass eine Handlung vor einem bestimmten Zeitpunkt in der Vergangenheit geschehen war.
Example sentence:
 Nobody was in the building. All the employees had left.
How to form it:
 Subject + had(n’t) + past participle of the verb
Instruction box:
 Look at the sentence below. Circle the verb in the past simple. Underline the verb in the past perfect.
 The murderer was an orang-utan. It had escaped from a sailor.
[Image description: Cartoon drawing of a tent in the forest next to a lake. A boy in yellow pajamas rubs his head in confusion.]
Caption under the image:
 When Harry got up in the morning, he realised that he had put his tent in the wrong place.
```

v1 seed items (UNTRUSTED):
- `m4-u2-past-perfect-gf-001` [gap-fill, d1]: p="When we arrived at the cinema, the film ___ already started." c="had" a=["had"] ds=["has","was","have"]
- `m4-u2-past-perfect-gf-002` [gap-fill, d1]: p="She was tired because she ___ (not / sleep) well the night before." c="hadn't slept" a=["hadn't slept","had not slept"] ds=["didn't sleep","hasn't slept","wasn't sleeping"]
- `m4-u2-past-perfect-gf-003` [gap-fill, d2]: p="By the time we got to the station, the train ___ (leave)." c="had left" a=["had left","had already left"] ds=["left","has left","was leaving"]
- `m4-u2-past-perfect-gf-004` [gap-fill, d3]: p="I ___ never ___ (see) snow before I visited Austria." c="had ... seen" a=["had ... seen","had never seen"] ds=["have ... seen","had ... saw","did ... see"]
- `m4-u2-past-perfect-gf-005` [gap-fill, d4]: p="After she ___ (finish) her homework, she went out to play." c="had finished" a=["had finished"] ds=["finished","has finished","had finish"]
- `m4-u2-past-perfect-gf-006` [gap-fill, d5]: p="He realised he ___ (leave) his keys at home, so he ___ (go) back." c="had left ... went" a=["had left ... went"] ds=["left ... went","had left ... had gone","has left ... went"]
- `m4-u2-past-perfect-mc-001` [multiple-choice, d2]: p="Detective Brown is interviewing a witness about last night. Which sentence correctly uses past perfect to show what happened first?" c="When I got home, my sister had already eaten dinner." a=["When I got home, my sister had already eaten dinner."] ds=["When I got home, my sister already ate dinner.","When I had got home, my sister already ate dinner.","When I got home, my sister has already eaten dinner."]
- `m4-u2-past-perfect-mc-002` [multiple-choice, d3]: p="Which sentence has the WRONG past participle?" c="I had went to the supermarket before it closed." a=["I had went to the supermarket before it closed."] ds=["She had written the email before the meeting.","They had eaten breakfast before leaving.","We had taken the wrong bus."]
- `m4-u2-past-perfect-mc-003` [multiple-choice, d4]: p="Choose the correct option: Before I ___ to bed, I ___ my teeth." c="went ... had brushed" a=["went ... had brushed"] ds=["had gone ... brushed","went ... brushed","had gone ... had brushed"]
- `m4-u2-past-perfect-ec-001` [error-correction, d1]: p="Find and fix the mistake: When she arrived, everyone already left the party." c="When she arrived, everyone had already left the party." a=["When she arrived, everyone had already left the party.","When she arrived, everyone had already left the party","Everyone had already left the party when she arrived."] ds=[]
- `m4-u2-past-perfect-ec-002` [error-correction, d3]: p="Find and fix the mistake: He had went to the shop before it closed." c="He had gone to the shop before it closed." a=["He had gone to the shop before it closed.","He had gone to the shop before it closed","He'd gone to the shop before it closed."] ds=[]
- `m4-u2-past-perfect-ec-003` [error-correction, d2]: p="Find and fix the mistake: I had eaten breakfast and then I had walked to school." c="I had eaten breakfast and then I walked to school." a=["I had eaten breakfast and then I walked to school.","I had eaten breakfast and then I walked to school","After I had eaten breakfast, I walked to school."] ds=[]
- `m4-u2-past-perfect-tf-001` [transformation, d3]: p="You're telling a detective what happened. Complete: 'When I ___ (arrive) at the station, the bus ___ already ___ (leave).'" c="arrived ... had already left" a=["arrived ... had already left","arrived, had already left"] ds=[]
- `m4-u2-past-perfect-tf-002` [transformation, d4]: p="Describe Emma's evening routine: 'After she ___ (finish) her homework, she ___ (go) out to meet her friends.'" c="had finished ... went" a=["had finished ... went","had finished, went"] ds=[]
- `m4-u2-past-perfect-tf-003` [transformation, d5]: p="You arrived late to the airport. Tell your friend: 'By the time we ___ (get) to the airport, the plane ___ already ___ (take off).'" c="got ... had already taken off" a=["got ... had already taken off","got, had already taken off"] ds=[]
- `m4-u2-past-perfect-tr-001` [translation, d3]: p="🇩🇪 Als wir ankamen, hatte der Film schon angefangen." c="When we arrived, the film had already started." a=["When we arrived, the film had already started.","When we arrived, the movie had already started.","The film had already started when we arrived.","When we arrived, the film had already begun."] ds=[]
- `m4-u2-past-perfect-tr-002` [translation, d4]: p="🇩🇪 Er war muede, weil er nicht gut geschlafen hatte." c="He was tired because he hadn't slept well." a=["He was tired because he hadn't slept well.","He was tired because he had not slept well.","He was tired because he hadn't slept well","He was tired, because he hadn't slept well."] ds=[]
- `m4-u2-past-perfect-sb-001` [sentence-building, d2]: p="Put the words in the correct order: had / the / already / she / book / read / before / film / the / she / watched" c="She had already read the book before she watched the film." a=["She had already read the book before she watched the film.","She had already read the book before she watched the film"] ds=[]
- `m4-u2-past-perfect-mt-001` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: When the teacher came in, 2: By the time we arrived, 3: She was happy because 4: After they had finished eating, 5: He couldn't find his phone because" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"c\",\"4\":\"e\",\"5\":\"b\"}"] ds=["a: the concert had already started.","b: he had left it on the bus.","c: she had passed all her exams.","d: the students had already sat down.","e: they went for a walk."]
- `m4-u2-past-perfect-cp-001` [context-picker, d2]: p="Sarah arrived at the cinema at 7:30. The film started at 7:15. Which sentence is correct?" c="When Sarah arrived, the film had already started." a=["When Sarah arrived, the film had already started."] ds=["When Sarah arrived, the film already started.","When Sarah arrived, the film has already started.","When Sarah arrived, the film was already starting."]
- `m4-u2-past-perfect-gf-007` [gap-fill, d1]: p="When we got to the restaurant, our friends ___ already ___ (order)." c="had ... ordered" a=["had ... ordered","had already ordered"] ds=["have ... ordered","already ... ordered","were ... ordering"]
- `m4-u2-past-perfect-gf-008` [gap-fill, d2]: p="She couldn't pay because she ___ (forget) her wallet at home." c="had forgotten" a=["had forgotten"] ds=["forgot","has forgotten","was forgetting"]
- `m4-u2-past-perfect-gf-009` [gap-fill, d2]: p="The match ___ already ___ (begin) when we turned on the TV." c="had ... begun" a=["had ... begun","had already begun"] ds=["has ... begun","had ... began","was ... beginning"]
- `m4-u2-past-perfect-gf-010` [gap-fill, d3]: p="I was really nervous because I ___ never ___ (fly) in a plane before." c="had ... flown" a=["had ... flown","had never flown"] ds=["have ... flown","had ... flew","did ... fly"]
- `m4-u2-past-perfect-gf-011` [gap-fill, d4]: p="By the time the teacher arrived, the students ___ (sit) down and ___ (open) their books." c="had sat ... had opened" a=["had sat ... had opened","had sat ... opened"] ds=["sat ... opened","had sat ... were opening","were sitting ... opened"]
- `m4-u2-past-perfect-gf-012` [gap-fill, d5]: p="___ she ___ (finish) the book before the library closed?" c="Had ... finished" a=["Had ... finished","Had she finished"] ds=["Did ... finish","Has ... finished","Was ... finishing"]
- `m4-u2-past-perfect-mc-004` [multiple-choice, d1]: p="We were late. The bus ___." c="had already left" a=["had already left"] ds=["already left","has already left","was already leaving"]
- `m4-u2-past-perfect-mc-005` [multiple-choice, d3]: p="Choose the correct sentence about Tom's bad day:" c="Tom was upset because he had lost his phone." a=["Tom was upset because he had lost his phone."] ds=["Tom was upset because he lost his phone.","Tom was upset because he has lost his phone.","Tom had been upset because he lost his phone."]
- `m4-u2-past-perfect-mc-006` [multiple-choice, d4]: p="Which sentence has the WRONG past participle form?" c="She had drinked all the juice before breakfast." a=["She had drinked all the juice before breakfast."] ds=["They had spoken to the teacher before the lesson.","He had driven to the airport before sunrise.","I had chosen my outfit the night before."]
- `m4-u2-past-perfect-mc-007` [multiple-choice, d5]: p="Choose the correct option: After the rain ___, the sun came out." c="had stopped" a=["had stopped"] ds=["stopped","has stopped","was stopping"]
- `m4-u2-past-perfect-ec-004` [error-correction, d2]: p="Find and fix the mistake: After she has finished the test, she left the classroom." c="After she had finished the test, she left the classroom." a=["After she had finished the test, she left the classroom.","After she had finished the test, she left the classroom"] ds=[]
- `m4-u2-past-perfect-ec-005` [error-correction, d4]: p="Find and fix the mistake: She had wrote a long email to her friend." c="She had written a long email to her friend." a=["She had written a long email to her friend.","She had written a long email to her friend"] ds=[]
- `m4-u2-past-perfect-ec-006` [error-correction, d3]: p="Find and fix the mistake: When the concert had started, we arrived at the hall." c="When we arrived at the hall, the concert had already started." a=["When we arrived at the hall, the concert had already started.","The concert had already started when we arrived at the hall.","When we arrived at the hall, the concert had started."] ds=[]
- `m4-u2-past-perfect-tf-004` [transformation, d3]: p="Two things happened yesterday. First: your sister did the shopping. Then: you came home. Combine using 'when': 'When I ___ (come) home, my sister ___ already ___ (do) the shopping.'" c="came ... had already done" a=["came ... had already done","came, had already done"] ds=[]
- `m4-u2-past-perfect-tf-005` [transformation, d5]: p="You're writing a story. First: it stopped raining. Then: the children went outside. Combine using 'as soon as': 'As soon as it ___ (stop) raining, the children ___ (go) outside.'" c="had stopped ... went" a=["had stopped ... went","had stopped, went"] ds=[]
- `m4-u2-past-perfect-tr-003` [translation, d3]: p="🇩🇪 Nachdem er seine Hausaufgaben gemacht hatte, ging er in den Park." c="After he had done his homework, he went to the park." a=["After he had done his homework, he went to the park.","After he had finished his homework, he went to the park.","He went to the park after he had done his homework.","He went to the park after he had finished his homework."] ds=[]
- `m4-u2-past-perfect-tr-004` [translation, d5]: p="🇩🇪 Sie hatte noch nie Sushi probiert, bevor sie nach Japan reiste." c="She had never tried sushi before she travelled to Japan." a=["She had never tried sushi before she travelled to Japan.","She had never tried sushi before she traveled to Japan.","Before she travelled to Japan, she had never tried sushi.","She'd never tried sushi before she travelled to Japan."] ds=[]
- `m4-u2-past-perfect-sb-002` [sentence-building, d2]: p="Put the words in the correct order: the / train / had / when / left / we / arrived / at / the / station / already" c="The train had already left when we arrived at the station." a=["The train had already left when we arrived at the station.","When we arrived at the station, the train had already left.","The train had already left when we arrived at the station"] ds=[]
- `m4-u2-past-perfect-sb-003` [sentence-building, d4]: p="Put the words in the correct order: by / time / the / the / had / party / we / got / to / ended / already" c="By the time we got to the party, it had already ended." a=["By the time we got to the party, it had already ended.","By the time we got to the party it had already ended.","The party had already ended by the time we got there."] ds=[]
- `m4-u2-past-perfect-cp-002` [context-picker, d3]: p="Tom went to the fridge to get some milk. The milk was gone. His sister was in the kitchen. Which sentence explains the situation?" c="His sister had drunk all the milk." a=["His sister had drunk all the milk."] ds=["His sister drank all the milk.","His sister has drunk all the milk.","His sister was drinking all the milk."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charles, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Dempsey, Denver, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, Dunning, Dupin, During, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fell, Fidel, Fido, Fink, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jasper, Jay, Jefferson, Jenkins, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Mills, Miriam, Miss, Mma, Moher, Moira, Mongolian, Monica, Monroe, Moqueca, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Pro, Professor, Project, Protestant, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebellion, Recherche, Red, Redwood, Reihenfolge, Renato, Republic, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Washington, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Whodunit, Wilde, Will, William, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 2.txt -----
Unit 2 – Whodunit
Page 16–17
You learn
about locked-room mysteries
about the problem of cybercrime
how to use the past perfect
You can
talk about possible theories
talk about crime
write a summary / detective story
make a complaint
🔷 1
 Read scenes 1 and 2 of the murder mystery and the notes on the next page. Then complete the police crime report.
The curious case of the locked room
Scene 1
 At police headquarters
Sgt Jenkins: Excuse me, Inspector.
 Inspector Fell: What is it, Jenkins?
 Sgt Jenkins: Bad news, I’m afraid. We’ve just got a call from Murdoch Towers.
 Inspector Fell: The offices of the computer king?
 Sgt Jenkins: That’s right. There’s been a murder. John Murdoch is dead. He has a deep wound in his chest.
 Inspector Fell: I don’t believe it! Five thirty on a Friday! Let’s hope this is an easy one. Come on, Jenkins. Get your coat!
Scene 2
 At Murdoch Towers
Sgt Jenkins: Inspector, this is Detective Ward. He’s the reporting officer.
 Inspector Fell: OK, Ward. So, what have we got?
 Detective Ward: Well, sir, Murdoch was holding a small office party for just four of his employees. Nobody else was in the building. All the other employees had left.
 Inspector Fell: Good. So we know that it was one of them.
 Sgt Jenkins: Most probably. But which one?
(At the bottom of the page, there is a cartoon-style police line saying: "POLICE LINE / DO NOT CROSS")
📝 POLICE CRIME REPORT
 Victim – John Murdoch
 Crime – murder
 Weapon – __________
 Date – Friday 19th May
 Time of report – __________
 Reporting officer – __________
 Investigating officers – __________
 Suspects – __________
Inspector Fell: That’s what I’m going to find out.
 Detective Ward: There is one other thing, Inspector.
 Inspector Fell: Well?
 Detective Ward: Well, it’s very strange, but the room where Murdoch’s body was found was locked from the inside. All the witnesses …
 Inspector Fell: You mean suspects.
 Detective Ward: Yes, sir. All the suspects told me the same thing.
 Inspector Fell: So you’ve already questioned everyone?
 Detective Ward: Yes, sir. But only very quickly.
 Inspector Fell: What about the murder weapon?
 Detective Ward: We haven’t found it.
 Inspector Fell: Aha! Can I see your notes?
📘 2
 Read Detective Ward’s notes and write the names of the people under the pictures.
Jasper Ford / 40 years with the company / knew Murdoch’s father / office clerk
Oliver Wilson / nephew / computer programmer
Isabel Miller / project manager / attractive / was working with Murdoch on top secret project
Charles Dunning / head salesman / bit of a playboy / very good-looking
(Four cartoon-style images of suspects are shown with blank name and motive fields below each one)
 Name: __________ / Motive: __________
 Name: __________ / Motive: __________
 Name: __________ / Motive: __________
 Name: __________ / Motive: __________
📘 3
 Look at the information in 2 and say what motives the people might have had for the murder. Then read Scene 3 and make notes of Inspector Fell’s theories about each suspect’s motive in 2.
Scene 3
 Sgt Jenkins and Inspector Fell are looking at Detective Ward’s notes.
Sgt Jenkins: Jasper Ford. 40 years with the company. He’s a lot older than the others.
 Inspector Fell: And he doesn’t have such a good job as all the others. He’s just a clerk. All the others at the party have very good positions in the company. What he was doing there, I wonder? He’s probably a friend of the family.
 Sgt Jenkins: Or perhaps he had something to say about his boss.
 Inspector Fell: Do you think he was blackmailing Mr Murdoch, sir?
 Inspector Fell: Perhaps. He probably needs money for his old age. Keep an eye on him.
 Sgt Jenkins: OK. And what about Oliver Wilson, sir? Have you got any ideas there?
 Inspector Fell: The nephew. Hmm, that’s difficult. Did John Murdoch have any children?
 Sgt Jenkins: No, sir. Why?
Inspector Fell: Well, now that Murdoch’s dead, he might be the one who gets the company.
 Sgt Jenkins: And the other two – Charles Dunning and Isabel Miller?
 Inspector Fell: Isabel Miller. Hmm. Ward’s notes say that she’s very pretty. And Murdoch was rich! Maybe she had fallen in love with him.
 Sgt Jenkins: But then, why would she kill him?
 Inspector Fell: I’m not sure. Perhaps the secret project is the key. Let’s see.
 Sgt Jenkins: And Dunning?
 Inspector Fell: Good-looking and a bit of a playboy. Well, maybe he needs money for gambling, or perhaps he’s in love with Isabel Miller and he was angry about her relationship with Murdoch.
 Sgt Jenkins: Well, we’ve got a lot of ideas then.
 Inspector Fell: Yes, let’s start the interviews.
Page 18–19
🔷 4
 Listen and complete Inspector Fell’s notes.
Scenes 4 and 5 – Interviews with Jasper Ford and Oliver Wilson.
🗒️ What Jasper Ford said:
He was at the party because ...
Mr Murdoch went to his office to ...
Everyone else left the room sometime during the party.
  • Oliver Wilson left to ...
  • Jasper Ford left to ...
  • Isabel Miller went to ...
  • Charles Dunning left to ...
He believes that Oliver Wilson is going to be ...
Jasper Ford does not have a good relationship with ...
His plan now is ...
He says he has got money for his old age because ...
🗒️ What Oliver Wilson said:
He told me that next year Jasper Ford was going to ...
Mr Murdoch went to his office to ...
People who left the room: ...
When Isabel Miller broke the window she found the ...
[Image description: Two interview scenes. One shows Jasper Ford in a white shirt talking to Inspector Fell and Sgt Jenkins. The second shows Oliver Wilson wearing glasses in a brown sweater.]
🔷 5
 Listen to the interviews again and take notes about any other information you hear from Jasper Ford and Oliver Wilson.
🔷 6
 Listen to Inspector Fell’s theory and circle the sentences T (True) or F (False).
 Underline the false information in the sentences.
Scene 6 – Inspector Fell’s theory
Inspector Fell says the killer climbed in through the window. T / F
He thinks that the killer hid in a building across the road. T / F
They didn’t find an arrow in Mr Murdoch’s body. T / F
The window in Mr Murdoch’s room was closed. T / F
The murderer came through a secret door. T / F
Sergeant Jenkins thinks the killer had attached a rope to the arrow. T / F
b. Listen again and tick the correct answers.
Inspector Fell thinks
  ☐ he is cleverer than Jenkins.
  ☐ Jenkins is cleverer than he is.
  ☐ the room was not locked.
  ☐ the killer used a bow and arrow.
Inspector Fell mentions the theory because
  ☐ he is playing a trick on Jenkins.
  ☐ the window was closed.
  ☐ it is a complicated case.
  ☐ Jenkins never listens to him.
🔷 7
 Can you think of any more possible theories?
💬 It’s very likely that ... / Perhaps ...
 💬 It’s likely that ... / It’s possible that ... / I suppose ...
 💬 That’s a possibility.
 💬 I suppose ...
🔷 8
 Listen to the two interviews and take notes.
Scene 7 – Interview with Isabel Miller
 (Isabel’s notes area is blank, ready for students to fill in.)
Scene 8 – Interview with Charles Dunning
 (Charles’s notes area is blank, ready for students to fill in.)
[Image description: Isabel Miller is shown sitting in an office in front of a window. Charles Dunning is leaning against the wall near a door.]
🔷 9
 Read the end of Scene 8. Inspector Fell has solved the case. Who do you think is the murderer and why?
Detective Ward: Excuse me, sir. We’ve found something in the wastepaper bin. I think you might be interested.
 Inspector Fell: Thank you, Detective Ward. (Reads paper) Excellent, that’s what I thought. Jenkins, call in the suspects.
 Sgt Jenkins: All of them?
 Inspector Fell: Yes, Jenkins, all of them.
✏️ I think the murderer is ...
 ✏️ The murderer must be ... because ...
 ✏️ I’m not sure ... but it might be ...
 ✏️ I’m certain the murderer is ...
🔷 10
 Listen to the ending of the story and see if you were right. Then answer the questions.
Scene 9 – Inspector Fell presents the solution.
Who broke the window in the door of Mr Murdoch’s room?
What did the murderer do after killing Mr Murdoch?
How did they get the key into the lock on the inside of the door?
What motive did the murderer have?
What did Mr Ford try to hide, and where?
Why did Mr Ford hide it?
What did the murderer want from Mr Murdoch?
Where was the murderer’s weapon hidden?
🟦 11
 What is the purpose of the text The curious case of the locked room?
☐ To warn about criminals.
 ☐ To entertain.
 ☐ To give historical information.
 ☐ To inform about the work of a detective.
Page 20–21
🟦 12
 a Quickly read through the text and answer the following question:
 Who invented the locked-room mystery?
📘 The Locked-Room Mystery
What is it?
 Inside the room lies the victim – there is no one else. When the murder happened, nobody could enter or leave the room unseen. Now the detective not only has to work out who committed the crime, but also how they did it.
Other popular ingredients for this ‘impossible’ crime are:
 • The only door is locked from the inside with the key in the lock.
 • There is no fireplace or chimney for escape.
 • The only window is closed from the inside.
 • Outside, there is fresh snow and there are no footprints.
 • There is no secret door.
 • First, there seems to be no murder weapon.
Who invented it?
 The first writer to use the locked-room mystery was the master of the American detective story, Edgar Allan Poe (1809–1849) in his The Murders in the Rue Morgue.
Two women were found dead in their bedroom. The police had no idea who the murderer was. The room was locked from the inside and the windows were shut. They thought it was impossible for the murderer to climb in through the window because the room was on the fourth floor. There was no motive because the two women lived alone, everybody liked them and the police found a lot of money lying around on the floor, so nobody stole anything. The police weren’t able to solve the crime, but a clever man, Mr Dupin, could. He looked carefully at the window and discovered that something was broken. He believed that the killer was an excellent climber who had escaped through the window. Then the window closed automatically. When the police heard this, they laughed at Dupin’s theory, but he found the murderer – it was an orang-utan that had escaped from a sailor!
[Image description: A drawing of Edgar Allan Poe and an old-style bookplate reading “The Locked-Room Mystery” with stylized scrollwork.]
b Read the full text and tick the correct sentences.
In a locked-room mystery the murder weapon
  ☐ cannot usually be found.
  ☐ is something strange.
  ☐ is taken away by the murderer.
In The Murders in the Rue Morgue by Poe,
  ☐ the room was locked and none of the windows were open.
  ☐ the police found money and broken glass on the floor.
  ☐ the police asked detective Dupin for help.
Dupin’s investigation showed that
  ☐ the police were looking for two killers.
  ☐ the dead women knew their killer.
  ☐ the killer was someone very unusual.
The killer in the Poe story
  ☐ was a man who was an excellent climber.
  ☐ was a sailor who had escaped from prison.
  ☐ was not human.
This text might be found in
  ☐ a biography of Edgar Allan Poe.
  ☐ a guide to crime fiction.
  ☐ a book used to train policemen.
c What does the text do?
  ☐ It gives information about the life of an American writer.
  ☐ It tells a funny story about an animal.
  ☐ It explains a special kind of crime story.
  ☐ It tells you about the most famous mystery stories.
🟦 13
 Work in pairs. Take a guess at the numbers needed to complete the sentences.
[Center of image reads: CYBERCRIME IN NUMBERS. Background: A hooded figure at a computer.]
______ % of US companies were hacked last year.
Cybercrime costs the world economy £ ______ each year.
Every day there are ______ new malware* programmes.
______ % of personal computers were hacked last year.
There are ______ social media users in the world.
______ Facebook accounts are attacked every day.
______ % of people use only one password.
A completely random* password with eight characters takes a hacker ______ years to crack.
One of the most common passwords with eight characters is ______.
*Vocabulary:
 malware – Schadsoftware
 random – beliebig
🔷 14
 Listen and check. Then listen again and make notes to answer the questions. Then compare with a partner.
What do we learn about Mydoom? ..............................................................................................................
Why do criminals hack into personal computers? ................................................................................
How is social media making it easier for cyber criminals? ..............................................................
What other examples of bad passwords are given? ............................................................................
How long might it take a hacker to crack the password mother? ..............................................
How long might it take a hacker to crack the password michael? ...........................................
Page 22–23
Vocabulary
🟦 15 Complete these sentences from the listening text with the words in the box.
Box of words:
 crimes, suspect, steal, weapons, evidence, blackmail, illegal, witnesses, criminals, victims
Hackers use the computer and the internet as their "_________________________".
Their __________________________ are often invisible so there are never any __________________________.
This __________________________ activity is costing the global economy a lot of money.
It’s so difficult to catch the __________________________ because sometimes there is no __________________________ of the attack.
The __________________________ was probably from another country.
Most crimes involve hacking into the individual’s computer to __________________________ credit card information.
They then use this information to __________________________ their __________________________.
🟦 16 Choose four or five of the words in 15 and describe them for your partner to guess.
Speech bubble above a young man pointing to a book while talking to a girl:
 “People who see a crime happening.”
[Image description: A boy and a girl are sitting at a table with a laptop and textbook. They are smiling and appear to be discussing a vocabulary activity.]
Sounds right /ɑː/ vs. /ʌ/
🟦 17 Listen and tick.
Number	Word	/ɑː/	/ʌ/
1	dance	✔	
2	luck		✔
3	bar	✔	
4	just		
5	son		
6	guitar		

🟦 18 Listen and repeat.
We got in the car and drove to the park.
 We played the guitar and danced in the dark.
🟦 19 CHOICES
 Writing for your Portfolio
🟡 A Write a short comment about the play The curious case of the locked room (40–70 words).
 • Say what was (not) thrilling about the story.
 • Say why you liked / didn’t like it.
 • Say how easy/difficult it was for you to understand.
🟡 B Write your own detective story of at least 120 words with the help of the questions below. Give the story a title and think of a good name for the inspector.
 • Where was the inspector when the phone rang?
 • What information did he/she get?
 • How did he/she feel about it and why?
 • What did he/she see when he came to the crime scene?
 • Who were his/her assistants at the crime scene?
 • Who were the suspects?
 • What possible motives did they have?
 • How did the inspector find the solution to the case?
 • Who was the murderer and why?
GRAMMAR
🟦 Past perfect
Du verwendest das Past perfect, wenn du betonen möchtest, dass eine Handlung vor einem bestimmten Zeitpunkt in der Vergangenheit geschehen war.
Example sentence:
 Nobody was in the building. All the employees had left.
How to form it:
 Subject + had(n’t) + past participle of the verb
Instruction box:
 Look at the sentence below. Circle the verb in the past simple. Underline the verb in the past perfect.
 The murderer was an orang-utan. It had escaped from a sailor.
[Image description: Cartoon drawing of a tent in the forest next to a lake. A boy in yellow pajamas rubs his head in confusion.]
Caption under the image:
 When Harry got up in the morning, he realised that he had put his tent in the wrong place.
Page 24–25
DEVELOPING SPEAKING COMPETENCIES
 The Girl Next Door 1
 Language function: Complaining
 Speaking strategy: Reacting to complaint
The headphones
🎧 1 Watch or listen to the dialogue. Then read it.
Kate: Hello, can we see the manager, please?
 Manager: I am the manager. How can I help you?
 Kate: Yes, I bought these headphones from you last week and they’ve broken already.
 Manager: Let me have a look. They look fine to me. So what’s the problem?
 Kate: Well, they don’t work. When I plug them into my phone, I can’t hear a thing.
 Manager: Are you sure there’s nothing wrong with your phone?
 Kate: Yes, I am. My phone works fine. Do you want to see it?
 Manager: No, that’s OK. I’ll believe you. So have they always not worked or did they work and then stop working?
 Kate: They worked for a while but then just stopped. I don’t know why.
 Manager: Maybe you dropped them?
 Kate: No, I didn’t.
 Manager: Or pulled too hard on the wire?
 Kate: No, I told you. They just stopped working. They’re just not good enough.
 Manager: Very strange. We’ve never had a problem with these before.
 Kate: Are you saying it’s my fault?
 Manager: No, no. I’m just saying it’s very strange. Can I see your receipt?
 Kate: Umm. I threw it away.
 Manager: That’s a shame.
 Kate: I know. I should always keep them. But these headphones are from your shop. You can’t get these in other shops.
 Manager: You should always keep your receipt. I can’t do anything without it.
 Kate: I hope you’re joking.
 Manager: I’m not. I’m sorry but I’ve got other customers to serve.
VOCABULARY: item = Gegenstand
2 Answer the questions.
Who does Kate want to speak to?
What has she got a problem with?
What is the problem?
What are his ideas for how the item* broke?
Why is he surprised the item has broken?
What does he ask to see?
Why does he not help Kate?
Useful phrases – Complaining
🟦 3 Complete the phrases with the words in the box. Then check with 🔊 1.
 Word box: fault, work, joking, manager, good
Can I see the ____________________?
They don’t ____________________ .
They’re just not ____________________ enough.
Are you saying it’s my ____________________ ?
I hope you’re ____________________ .
4 What do you think? Answer the questions.
Was the manager right? Why (not)?
What do you think Kate will do?
📱 Mobile homework
🟨 Watch the second part of the video and complete Tom’s diary entry.
Wow, Kate was really 1. ____________________ with the manager of Pro Audio. She was determined to sort out the problem on her own and didn’t want help from her 2. ____________________ . She posted her complaint online and in a day she already had 3. ____________________ likes and 4. ____________________ comments. People were really on her side. Some even said they wouldn’t shop there again. Then the 5. ____________________ sent a message saying there had been a 6. ____________________ and he asked her to come back to the shop. When we got there, he gave her a new 7. ____________________ headphones. Funny thing happened when he went to get them. He fell off the 8. ____________________ . Luckily, he wasn’t hurt.
Speaking strategy – Reacting to complaint
🟦 4 Try to complete the phrases. Then check with the dialogue in 🔊 1.
Manager: I ____________________ me the ____________________ . They look fine to me. So what’s the problem?
Manager: ____________________ there’s nothing wrong with your phone?
Manager: No, that’s OK. I ____________________ you. So have they always not worked or did they work and then stop working?
Manager: ____________________ . We’ve never had a problem with these before.
🗣 5 ROLE PLAY: Work in pairs. Look at the role cards. Take 4–5 minutes to practise your dialogue. Don’t write it down. Act it out for the rest of the class.
Student A:
 You bought a mobile phone from Pro Audio but there’s a problem with it. Decide what the problem is and go back to the shop to make a complaint.
Student B:
 You are the manager at Pro Audio. Listen to the customer’s complaint and decide if it’s their fault.


----- WB: More 4 WB Unit 2.txt -----
UNIT 2 Whodunit
Pages 12–13
Reading
 1 Read the text.
The ice cream parlour window*
 The ice cream parlour had just opened when Hannah got there at 9.00 in the morning. Mr Morris was outside the shop putting up a new sign saying that his prices had gone up by 20%. Hannah was a little surprised.
“Why have you put your prices up, Mr Morris?” asked Hannah.
 “I have to,” Mr Morris told her. “Life is expensive and I need money for lots of things now.” “Like what?” asked Hannah.
 “Well, for example, now I need a new window for my storeroom.”
 “Why’s that?” asked Hannah.
 “Somebody broke the window last night. They were trying to get into my store.”
 “Have you called the police?” Hannah asked.
 “No. The police won’t be interested because the thieves didn’t take anything. And come and see.” He took Hannah to a small room at the back of the parlour. The window was broken and the glass was lying all over the floor.
 “I use this space as an office. Last night, I sat here and made my poster about prices rising by 20%. When I finished, I left it on this desk. Then I went out, and I locked the door to this room. The person who broke the window couldn’t get into this room. And so they couldn’t steal anything. But they left me a real mess and now I’ve got to get a new window.”
 “You were lucky you’d locked the door,” Hannah said. “But you should still call the police.”
 Hannah smiled, and walked down to the sea front. Two boys from school, Toby and Andy, were sitting there, tired.
 “Did you hear that somebody broke a window in the ice cream parlour?” Hannah said.
 “Really?” Toby said. “I didn’t know that. We’ve been here since this morning. We haven’t talked to anybody. In fact, you’re the first person we’ve seen all morning.”
 Andy pointed to his bucket*. “And we’ve caught one big fish.”
 Toby stood up. “But now I’m hungry,” he said. “I’ve got a pound left from my pocket money. If Mr Morris is there now, I’m going up to the parlour to get a strawberry ice cream.”
 “Well, get another 20p from somewhere,” Andy told him. “You’ll need it because a pound isn’t enough any more. I’m hungry too, but it’s too early for ice cream, so I’m going home to get some breakfast.”
 “Hmm,” thought Hannah. “I think I know who broke Mr Morris’ window.” She knew it but how could she prove it?
VOCABULARY:
 ice cream parlour – Eissalon
 storeroom – Lagerraum
 bucket – Eimer, Kübel
2 How many of these tasks can you do? Check your answers with a partner.
1 The ice cream shop opens at 9 a.m.       T / F
 2 Mr Morris owns the ice cream shop.      T / F
 3 Someone tried to burgle* the shop last night.  T / F
4 Why didn’t Mr Morris call the police?
  □ Because he was too busy.
  □ Because he doesn’t think the crime is big enough.
  □ Because he forgot to.
5 What does Mr Morris do in the back room of the parlour?
  □ He makes his ice cream there.
  □ He keeps things he needs to clean the shop in there.
  □ He uses it to do his administration.
6 Why didn’t the thieves take anything from the store?
  □ There was nothing to take.
  □ They couldn’t get into the storeroom.
  □ Someone scared them away.
7 Is the broken window the real reason Mr Morris put up his prices? How do you know?
 8 How does Hannah know the boys broke the window?
 9 How do you think she can prove it?
VOCABULARY: burgle – einbrechen
Listening
 3 Listen and complete the crime scene report.
 (CD 2/3 icon)
 CRIME SCENE REPORT
 Name of victim: Isidor Fink
 Time of incident: ______________________________
 Reported by: _________________________________
 Crime: ______________________________________
 Weapon: ____________________________________
 Suspects: ___________________________________
VOCABULARY:
 laundry – Wäscherei
 suicide – Selbstmord
4 Listen again and choose the correct answers.
 (CD 2/4 icon)
1 What is the real mystery in a locked-room mystery?
  □ How the victim was killed.
  □ How the criminal escaped.
  □ How the doors and windows were locked.
2 Why did Fink leave Poland?
  □ He wanted a new beginning.
  □ He had a job in a laundry*.
  □ He wanted to see New York.
3 Why did the neighbour call a police officer?
  □ She thought somebody was in trouble.
  □ She heard a gunshot.
  □ She heard a scream coming from the laundry.
4 How did the policeman get inside the room?
  □ Through a small window.
  □ Through the neighbour’s house.
  □ Through the front door.
5 How many times had Fink been shot?
  □ One  □ two  □ three
6 Why did the police originally suspect it was suicide?
  □ Because they only found Fink’s fingerprints.
  □ Because nothing had been stolen.
  □ Because the room was locked.
7 What made them change their mind?
  □ They couldn’t find a weapon.
  □ They found a secret door the murderer used.
  □ They found the suspect.
Pages 14–15
Grammar Past perfect
5 Write the past perfect forms of the verbs.
1 do → had done
 2 make → _____________________
 3 meet → _____________________
 4 not find → __________________
 5 speak → ____________________
 6 not think → ________________
 7 go → _______________________
 8 not see → __________________
 9 drink → _____________________
6 Complete the sentences with the past perfect form of the verbs in brackets.
Image descriptions (from left to right, top to bottom):
A couple enters a ransacked room.
A man looks at a WANTED poster in the police station.
Three people look disappointed at a matchbox.
A woman in the kitchen stares at a dark room.
Two people on the beach look at an umbrella in the sand.
A man scolds a dog in front of an eaten chicken.
A man argues with a boy next to a "No Swimming" sign.
A woman jumps in surprise at a party.
1 The thieves ____________________________ (take) everything.
 2 He knew he ____________________________ (see) her face before.
 3 They ____________________________ (not bring) any matches with them.
 4 The lights went out because they ____________________________ (not pay) the electricity bill.
 5 They got wet because they ____________________________ (leave) their umbrella at home.
 6 Dad was angry because the dog ____________________________ (eat) the chicken.
 7 He got into trouble because they ____________________________ (not read) the sign.
 8 The party was a big surprise because no one ____________________________ (tell) her about it.
7 Complete the sentences with the past simple or past perfect form of the verbs in brackets.
1 I ____________________________ (not do) my homework, so I ____________________________ (not want) to go to school.
 2 We ____________________________ (leave) early because we ____________________________ (not see) the film before.
 3 They ____________________________ (be) upset with Liz because she ____________________________ (forget) my birthday.
 4 Mr Davis ____________________________ (have) my phone because I ____________________________ (leave) it in his classroom.
 5 I ____________________________ (be) starving because I ____________________________ (not eat) since breakfast.
 6 James ____________________________ (go) on holiday so I ____________________________ (have) no one to play with.
 7 The dog ____________________________ (not eat) for three days so we ____________________________ (take) him to the vet.
 8 I ____________________________ (not recognise) her because she ____________________________ (have) a haircut.
8 Match the sentence starts with the endings from the box. There are two for each one.
Endings box:
 – so I didn’t invite him to my party.
 – because it was her birthday.
 – because I’d spent all my money on sweets.
 – because we hadn’t slept for hours.
 – and my teacher wasn’t happy.
 – so we took a bus.
 – because she had got a new job.
 – so we went to bed.
 – so I failed badly.
 – so I borrowed it from the library.
 – because he still hadn’t paid me the money.
 – because we had taken too long to get ready.
1 We were tired
  a ________________________________________
  b ________________________________________
2 I wasn’t happy with Jim
  a ________________________________________
  b ________________________________________
3 We missed the train
  a ________________________________________
  b ________________________________________
4 Mum took us to a nice restaurant
  a ________________________________________
  b ________________________________________
5 I only got 20% in the test
  a ________________________________________
  b ________________________________________
6 I couldn’t buy the book
  a ________________________________________
  b ________________________________________
9 Choose the correct options.
1 She didn’t recognise him because she __ didn’t see / hadn’t seen __ him before.
 2 Dave __ phoned / had phoned __ me last night.
 3 Last week, we __ went / had gone __ to Paris for a short holiday.
 4 I couldn’t start my computer because I __ forgot / had forgotten __ my password.
 5 The game on Friday __ didn’t finish / hadn’t finished __ until 7 o’clock.
 6 I wanted some orange juice, but someone __ drank / had drunk __ it all.
 7 I __ went / had gone __ to bed early last night.
 8 I had a really big dinner because I __ didn’t eat / hadn’t eaten __ all day.
10 Complete with the past simple or past perfect form of the verb.
When I 1 ____________________________ (come) home, I 2 ____________________________ (see) that the burglars*
 3 ____________________________ (take) everything. No, not everything. They 4 ____________________________ (leave) one single book on my desk. But all the books, DVDs, the TV set and the DVD player were gone.
 So was the money I 5 ____________________________ (leave) in the kitchen.
I 6 ____________________________ (phone) the police, but they
 7 ____________________________ (say) there wasn’t much they could do. There 8 ____________________________ (be) quite a lot of break-ins in the area, and so far they
 9 ____________________________ (not catch) anybody. I put down the phone, 10 ____________________________ (look) around and 11 ____________________________ (pick) up the book the burglars* 12 ____________________________ (not take).
It was a crime novel called Bernie the Burglar.
VOCABULARY: burglar – Einbrecher
Pages 16–17
11 Complete the sentences with your own ideas. Use the past perfect.
1 The teacher was angry because ..................................................................................................................................
 2 I didn’t go to the cinema with Jack and Dave because ....................................................................................
 3 Sheena didn’t take the dog for a walk because ...................................................................................................
 4 My parents were really worried because ..............................................................................................................
 5 Evelyn felt sick because .................................................................................................................................................
 6 Our car was really dirty because ...............................................................................................................................
 7 Mum said I couldn’t go to the party because ........................................................................................................
 8 I was really embarrassed because ............................................................................................................................
Vocabulary
12 Find ten words about crime in the grid. (↖↑↗↓↙)
Word search grid (10x12):
 S K U S S E N T I W R
 F W A L R E M S R L
 E L D E I C O I T F S
 V A L I A N H A E L U
 S X W N A P P S A V S
 D I Y O K Z O G L I P
 N Y Z W L A G O A T C
 C R S E L E A L M I T
 E C A L B K I Y L M S
[Ten blank lines for writing the crime-related words.]
13 Use the words from 12 to complete the sentences.
1 Call 999 if you want to report a ________________________________.
 2 A gun? A knife? What was the ________________________________ that was used in the crime?
 3 The police aren’t sure who did it, but they have two ________________________________.
 4 The police are looking for ________________________________ at the scene of the crime.
 5 I saw what happened — I’m a ________________________________ to the crime.
 6 Police say the ________________________________ is dangerous and are telling people to be careful.
 7 She tried to ________________________________ £10 from my purse but I caught her.
 8 It’s ________________________________ to sell cigarettes to people under 18.
 9 You want £100 or you will tell my wife — that’s ________________________________!
 10 Have you ever been the ________________________________ of a crime?
14 Match the questions and answers.
1 What was the crime?
 2 What was the murder weapon?
 3 Have the police found any evidence?
 4 What was the victim’s name?
 5 Are there any suspects?
 6 Were there any witnesses?
Answers box:
 □ They’re not sure – maybe a big, heavy stick.
 □ The police are questioning his brother.
 □ Blackmail. He wanted £1,000 to destroy the photos he had.
 □ No, no one saw what happened.
 □ No one knows who he was.
 □ Yes, there was some hair on the carpet.
15 Here are some more possible answers to the questions in 14. Write the number of the question in the box.
□ A gun.
 □ She was Lady Muriel Bennett.
 □ Everyone in the family, because they all hated her.
 □ They found lots of fingerprints on the knife.
 □ It’s possible that one of the servants saw it.
 □ There wasn’t one. What he did wasn’t illegal.
Developing speaking competencies
16 Complete the dialogue with the phrases in the box. There is one extra phrase.
Phrase box:
 that’s not why  it’s my fault  the problem  very strange
 believe you  doesn’t work  you’re joking  can I see
Ben: Hello, ‘__________________________ the manager, please?’
 Manager: I am the manager. How can I help you?
 Ben: I bought this control for a game console from you and it ‘.’
 Manager: So what’s ‘’ exactly?
 Ben: It won’t turn on.
 Manager: Let me have a look. Did you charge it up?
 Ben: Yes, I did.
 Manager: That’s ‘.’ There doesn’t seem to be anything wrong with it. I mean the light comes on and …
 Ben: Well, there is. It’s not working.
 Manager: I’ll ‘.’ Are you sure you didn’t drop it at home?
 Ben: No, I didn’t. Are you saying ‘’?
 Manager: Well, it’s just that we’ve never had a problem with this model before. They’re very reliable*.
 Ben: So you think I did something wrong? ‘?’
 Manager: I’ll tell you what. You leave it here with me and I’ll get my tech guy to have a look at it.
 Ben: How long will that be?
 Manager: It won’t be long. I’ll give you a call when it’s ready.
 Ben: OK, but please be quick. I’ve got a new game and I can’t wait to play it.
VOCABULARY: reliable – zuverlässig
17 Now listen and check.
Page 18–19
18 Read the task and the short story from the book Half-minute horrors in 19. What trick does Jimmy play on his mum?
Task
 Write a short story based on the idea that someone you know has been replaced by an alien (120–180 words). In your story:
write about how you found out
write about what you did to trick him/her
write about how he/she reacted
write about what you did next
introduce some unexpected events
finish with a surprise ending
19 Read the story. Find three ‘surprises’ and underline them.
FRANCINE PROSE
 Chocolate Cake
 Lately, I’ve had the definite feeling that my parents aren’t my parents.
 I can’t exactly explain it. But I’m convinced that they’re space aliens
 who look and act like my parents and have taken their places.
 I’ve been asking them trick questions to trip them up. “Dad, what was
 the name of my first puppy?”
 “Uh … Fluffy?”
 “His name was Ernest,” I say.
 “I’ve got a ton on my mind,” says ‘Dad’.
 Tonight I’m trying something new. My real mom is horribly allergic to chocolate. She breaks out in
 a skin rash if she even looks at chocolate.
 I bake my fake mom a chocolate birthday cake. I watch her eat it. No rash. She smiles.
 “Delicious,” she says. “Thank you, Timmy.” “My name is Jimmy,” I say.
Writing tip:
 Creating intrigue
 A good story often contains surprises for its readers. Things happen that no one really expects.
 This creates intrigue for the reader. Their interest is increased and they want to find out more.
An open ending is another way of creating intrigue. By not fully explaining what happens, the
 author is letting the reader use his or her imagination to decide how the story ends.
20 Now write your own answer to the following task.
Task
 Write a short story based on the idea that your home is not really your
 home (120–180 words). Before writing consider the following:
what made you first suspect this
what you did to test your idea
what happened
what you did next
create surprises for the reader
leave the ending open
WORD FILE
 Crime
 illegal
 suspect
 criminal
 to steal
 evidence
 victim
 blackmail
 murder
 weapon
 witness
MORE Words and Phrases
chest – The murdered man had a knife wound in his chest. – Brust
employee – Employees are the people that work for a company. – Angestellte/r
mystery – Her disappearance is still a mystery. – Rätsel; Geheimnis
report – According to the report, police arrested the criminal. – Bericht
attractive – Lots of people like the way she looks, they think she's a very attractive woman. – attraktiv
nephew – He's my nephew. You know, my brother's son. – Neffe
office clerk – She works for a TV company as an office clerk. – Büroangestellte/r
keep an eye on – Don't forget to keep an eye on the children while they're at the zoo. – aufpassen auf
confusion – After the accident, there was great confusion. – Verwirrung
relative – We had a big party last week. All my friends and relatives were there. – Verwandte/r
retire – When you've worked enough in your life, you can retire. – in Pension gehen
right away – We'd like some more water, please. –Right away, sir! – sofort
take over – When he retires, his son will take over the company. – übernehmen
unlock – Give me the key and I'll unlock the door for you. – aufschließen
upset – When she heard the bad news, she was very upset. – verstört
consider – To find out if we have to move house or not. – erwägen
mention – Don't forget to mention me in your letter home. – erwähnen
likely – It's likely that we'll get more rain tomorrow. – wahrscheinlich
besides – No, thanks. I'm not hungry. And besides, I hate tofu. – außerdem, im Übrigen
expect – I expect she'll get good marks at the test tomorrow. – erwarten
handkerchief – I have a terrible cold. I need a handkerchief. – Taschentuch
Never mind. – I'm sorry I'm late. – Never mind. I'm fine. – Macht nichts., Egal.
suspicion – My suspicion is that it was John. – Verdacht
wastepaper bin – He threw all the letters into the wastepaper bin. – Papierkorb
excellent – Her new movie has received excellent reviews. – hervorragend, großartig
conclusion – He came to the conclusion that the murderer was a woman. – Schlussfolgerung
get hold of sth – A reporter got hold of the story and put it was in all the newspapers. – an etwas gelangen
prove – I know he's the murderer, but I can't prove it. – beweisen
historical – The Old State House is an important historical building. – historisch
commit – If you commit a crime, you become a criminal. – begehen
escape – The thieves escaped from prison. – entkommen, flüchten
investigation – The police started their investigation of the crime immediately. – Untersuchung
common – The most common word in the English language is 'the'. – häufig; gewöhnlich
personal – A lot of personal computers were hacked last year. – persönlich
crime scene – The police arrived at the crime scene very quickly. – Tatort
realise – She didn't realise the risk she was taking. – erkennen; begreifen

```

## Output contract

Write `content/corpus/units/g4-u02/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u02",
  "briefBank": "68861df2eca4",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u02.s.past-perfect",
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
