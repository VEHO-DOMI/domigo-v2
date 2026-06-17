# Grammar generation brief — g4-u01 (MORE! 4, Unit 1)

<!-- domigo:gen grammar g4-u01 bank=05dcb9424620 prompt=4b9164076103 -->

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

### `g4u01.s.past-continuous-revision` — Past continuous (revision) (Past continuous (Wiederholung))

Revision of the past continuous (was/were + -ing) for a longer action that was going on in the past, for a longer action interrupted by a shorter one (past simple), and for two longer actions happening at the same time. The unit-1 box recaps the form and contrasts it with the past simple.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [form-was-were-ing]: Form the past continuous with was/were + the -ing form of the verb. Use was with I/he/she/it and were with you/we/they.
  - DE: Du bildest das Past continuous mit was/were + der -ing-Form des Verbs. was steht bei I/he/she/it, were bei you/we/they.
  - "From 2014 onwards, everything was getting better for Ireland." — "Ab 2014 wurde alles besser für Irland."
  - "While his mum was reading, Johnny gave her a surprise." — "Während seine Mutter las, überraschte Johnny sie."
- rule [interrupted-by-past-simple]: Use the past continuous for a longer action and the past simple for a shorter action that interrupts it, often with when or while.
  - DE: Du verwendest das Past continuous für eine längere Handlung und das Past simple für eine kürzere, die sie unterbricht - oft mit when oder while.
  - "I was walking home when it started to rain." — "Ich ging gerade nach Hause, als es zu regnen begann."
  - "While they were trying to find food, one million of them died." — "Während sie versuchten, Nahrung zu finden, starben eine Million von ihnen."
- rule [two-simultaneous-actions]: Use the past continuous in both halves for two longer actions happening at the same time in the past. Pattern: While X was doing ..., Y was doing ...
  - DE: Du verwendest das Past continuous in beiden Satzteilen für zwei längere Handlungen, die gleichzeitig in der Vergangenheit stattfanden. Muster: While X was doing ..., Y was doing ...
  - "While many poor people were starving, the landlords were sending grain to England." — "Während viele arme Menschen hungerten, schickten die Grundbesitzer Getreide nach England."
  - "She was cooking while he was cleaning the house." — "Sie kochte, während er das Haus putzte."

common errors:
- Using the past continuous for the short interrupting action too: ✗ "While he was walking, he was seeing a dog." → ✓ "While he was walking, he saw a dog."
- Using the past simple for the longer background action instead of the continuous: ✗ "While he walked, he saw a dog." → ✓ "While he was walking, he saw a dog."
- Using the continuous with a stative verb: ✗ "I was knowing the answer." → ✓ "I knew the answer."

v1 seed items (UNTRUSTED):
- `m4-u1-past-continuous-revision-gf-001` [gap-fill, d1]: p="While I ___ (walk) to school, I met my friend Tom." c="was walking" a=["was walking"] ds=["walked","were walking","am walking"]
- `m4-u1-past-continuous-revision-gf-002` [gap-fill, d1]: p="They ___ (play) football when it started to rain." c="were playing" a=["were playing"] ds=["played","was playing","are playing"]
- `m4-u1-past-continuous-revision-gf-003` [gap-fill, d2]: p="At 8 o'clock last night, she ___ (read) a book." c="was reading" a=["was reading"] ds=["read","were reading","has read"]
- `m4-u1-past-continuous-revision-gf-004` [gap-fill, d3]: p="While Mum ___ (cook), Dad ___ (set) the table." c="was cooking ... was setting" a=["was cooking ... was setting"] ds=["cooked ... set","was cooking ... set","cooked ... was setting"]
- `m4-u1-past-continuous-revision-gf-005` [gap-fill, d4]: p="The sun ___ (shine) and the birds ___ (sing) when we left the house." c="was shining ... were singing" a=["was shining ... were singing"] ds=["shone ... sang","was shining ... was singing","were shining ... were singing"]
- `m4-u1-past-continuous-revision-gf-006` [gap-fill, d5]: p="While everyone ___ (dance), the lights suddenly ___ (go) out." c="was dancing ... went" a=["was dancing ... went"] ds=["danced ... went","was dancing ... was going","were dancing ... went"]
- `m4-u1-past-continuous-revision-mc-001` [multiple-choice, d2]: p="You're describing what was happening at the park yesterday at 3pm. Which sentence correctly uses past continuous for the background action?" c="While she was sleeping, someone knocked on the door." a=["While she was sleeping, someone knocked on the door."] ds=["While she slept, someone was knocking on the door.","While she was sleeping, someone was knocking on the door.","While she slept, someone knocked on the door."]
- `m4-u1-past-continuous-revision-mc-002` [multiple-choice, d3]: p="Choose the correct sentence to describe the scene:" c="It was raining and the wind was blowing hard." a=["It was raining and the wind was blowing hard."] ds=["It rained and the wind blew hard.","It was raining and the wind blew hard.","It rained and the wind was blowing hard."]
- `m4-u1-past-continuous-revision-mc-003` [multiple-choice, d4]: p="Which sentence is NOT correct?" c="I was knowing the answer when the teacher asked." a=["I was knowing the answer when the teacher asked."] ds=["I was reading a book when the phone rang.","She was listening to music while he was cooking.","We were walking home when we saw a rainbow."]
- `m4-u1-past-continuous-revision-ec-001` [error-correction, d2]: p="Find and fix the mistake: While he walked to the bus stop, he dropped his phone." c="While he was walking to the bus stop, he dropped his phone." a=["While he was walking to the bus stop, he dropped his phone.","While he was walking to the bus stop, he dropped his phone","He was walking to the bus stop when he dropped his phone."] ds=[]
- `m4-u1-past-continuous-revision-ec-002` [error-correction, d3]: p="Find and fix the mistake: She were watching TV when her mum called." c="She was watching TV when her mum called." a=["She was watching TV when her mum called.","She was watching TV when her mum called","She was watching television when her mum called."] ds=[]
- `m4-u1-past-continuous-revision-ec-003` [error-correction, d3]: p="Find and fix the mistake: When I was doing my homework, the doorbell was ringing." c="When I was doing my homework, the doorbell rang." a=["When I was doing my homework, the doorbell rang.","When I was doing my homework, the doorbell rang","I was doing my homework when the doorbell rang."] ds=[]
- `m4-u1-past-continuous-revision-tf-001` [transformation, d3]: p="You're telling your friend about yesterday evening. Complete: 'I ___ (have) a shower when the phone ___ (ring).'" c="was having ... rang" a=["was having ... rang","was having, rang","was having a shower when the phone rang"] ds=[]
- `m4-u1-past-continuous-revision-tf-002` [transformation, d4]: p="Describe what happened to Emma on her way to school: 'While she ___ (cycle) to school, she ___ (see) an accident.'" c="was cycling ... saw" a=["was cycling ... saw","was cycling, saw","was cycling to school, she saw an accident"] ds=[]
- `m4-u1-past-continuous-revision-tf-003` [transformation, d4]: p="Set the scene for a story about last Saturday: 'It ___ (snow) heavily and the children ___ (build) a snowman when suddenly...'" c="was snowing ... were building" a=["was snowing ... were building","was snowing, were building"] ds=[]
- `m4-u1-past-continuous-revision-tr-001` [translation, d2]: p="🇩🇪 Waehrend ich lernte, rief mein Freund an." c="While I was studying, my friend called." a=["While I was studying, my friend called.","While I was studying, my friend called","My friend called while I was studying.","While I was learning, my friend called."] ds=[]
- `m4-u1-past-continuous-revision-tr-002` [translation, d5]: p="🇩🇪 Es regnete und die Kinder spielten im Garten, als ploetzlich ein Hund ueber den Zaun sprang." c="It was raining and the children were playing in the garden when suddenly a dog jumped over the fence." a=["It was raining and the children were playing in the garden when suddenly a dog jumped over the fence.","It was raining and the children were playing in the garden when a dog suddenly jumped over the fence.","It was raining and the kids were playing in the garden when suddenly a dog jumped over the fence.","It was raining and the children were playing in the garden, when suddenly a dog jumped over the fence."] ds=[]
- `m4-u1-past-continuous-revision-sb-001` [sentence-building, d1]: p="Put the words in the correct order: was / she / when / sleeping / the / alarm / rang" c="She was sleeping when the alarm rang." a=["She was sleeping when the alarm rang.","She was sleeping when the alarm rang"] ds=[]
- `m4-u1-past-continuous-revision-mt-001` [matching, d3]: p="Match each sentence beginning with the correct ending. 1: While I was reading, 2: When the bell rang, 3: She was cooking dinner 4: While they were watching TV," c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}"] ds=["a: everyone was sitting in class.","b: the lights went out.","c: the dog jumped on the sofa.","d: when her brother came home."]
- `m4-u1-past-continuous-revision-cp-001` [context-picker, d2]: p="It's midnight. The whole family is in the living room. Which sentence fits best?" c="The whole family was watching a film together." a=["The whole family was watching a film together."] ds=["The whole family watched a film together.","The whole family watches a film together.","The whole family had watched a film together."]
- `m4-u1-past-continuous-revision-gf-007` [gap-fill, d1]: p="At 10 o'clock last night, we ___ (watch) a documentary about sharks." c="were watching" a=["were watching"] ds=["watched","was watching","are watching"]
- `m4-u1-past-continuous-revision-gf-008` [gap-fill, d2]: p="My brother ___ (listen) to music when I came into his room." c="was listening" a=["was listening"] ds=["listened","were listening","is listening"]
- `m4-u1-past-continuous-revision-gf-009` [gap-fill, d3]: p="While the teacher ___ (explain) the exercise, some students ___ (talk) to each other." c="was explaining ... were talking" a=["was explaining ... were talking"] ds=["explained ... talked","was explaining ... was talking","were explaining ... were talking"]
- `m4-u1-past-continuous-revision-gf-010` [gap-fill, d3]: p="I ___ (not / sleep) when the earthquake happened." c="wasn't sleeping" a=["wasn't sleeping","was not sleeping"] ds=["didn't sleep","weren't sleeping","not sleeping"]
- `m4-u1-past-continuous-revision-gf-011` [gap-fill, d4]: p="The dog ___ (bark) loudly while the cat ___ (sit) on the fence." c="was barking ... was sitting" a=["was barking ... was sitting"] ds=["barked ... sat","was barking ... were sitting","barked ... was sitting"]
- `m4-u1-past-continuous-revision-gf-012` [gap-fill, d5]: p="___ you ___ (wait) for the bus when it ___ (start) snowing?" c="Were ... waiting ... started" a=["Were ... waiting ... started","Were you waiting ... started"] ds=["Did ... wait ... started","Were ... waiting ... was starting","Was ... waiting ... started"]
- `m4-u1-past-continuous-revision-mc-004` [multiple-choice, d1]: p="Yesterday at 5pm, my sister ___." c="was doing her homework" a=["was doing her homework"] ds=["did her homework","does her homework","has done her homework"]
- `m4-u1-past-continuous-revision-mc-005` [multiple-choice, d3]: p="Which sentence correctly describes two actions happening at the same time?" c="While Dad was washing the car, Mum was cleaning the kitchen." a=["While Dad was washing the car, Mum was cleaning the kitchen."] ds=["While Dad washed the car, Mum cleaned the kitchen.","While Dad was washing the car, Mum cleaned the kitchen.","While Dad washed the car, Mum was cleaning the kitchen."]
- `m4-u1-past-continuous-revision-mc-006` [multiple-choice, d4]: p="Which sentence is NOT correct?" c="I was wanting a new bike for my birthday." a=["I was wanting a new bike for my birthday."] ds=["She was running in the park when it started to rain.","They were having dinner when the lights went out.","We were waiting for the bus when our teacher drove past."]
- `m4-u1-past-continuous-revision-mc-007` [multiple-choice, d5]: p="Choose the correct option: While we ___ in the garden, a bird ___ into the window." c="were sitting ... flew" a=["were sitting ... flew"] ds=["sat ... flew","were sitting ... was flying","was sitting ... flew"]
- `m4-u1-past-continuous-revision-ec-004` [error-correction, d1]: p="Find and fix the mistake: The children was playing in the garden." c="The children were playing in the garden." a=["The children were playing in the garden.","The children were playing in the garden"] ds=[]
- `m4-u1-past-continuous-revision-ec-005` [error-correction, d4]: p="Find and fix the mistake: While she was cooking dinner, the phone was ringing." c="While she was cooking dinner, the phone rang." a=["While she was cooking dinner, the phone rang.","While she was cooking dinner, the phone rang","She was cooking dinner when the phone rang."] ds=[]
- `m4-u1-past-continuous-revision-ec-006` [error-correction, d5]: p="Find and fix the mistake: I was believing that the test was easy." c="I believed that the test was easy." a=["I believed that the test was easy.","I believed that the test was easy","I believed the test was easy."] ds=[]
- `m4-u1-past-continuous-revision-tf-004` [transformation, d2]: p="You're writing in your diary about yesterday. Two things happened at the same time: your dad was driving and you were listening to music. Write one sentence using 'while'." c="While my dad was driving, I was listening to music." a=["While my dad was driving, I was listening to music.","While Dad was driving, I was listening to music.","I was listening to music while my dad was driving.","I was listening to music while Dad was driving."] ds=[]
- `m4-u1-past-continuous-revision-tf-005` [transformation, d4]: p="You're telling a friend about a funny moment. You were eating lunch in the school canteen. A bird flew through the window. Write one sentence using 'when'." c="I was eating lunch in the school canteen when a bird flew through the window." a=["I was eating lunch in the school canteen when a bird flew through the window.","I was eating lunch in the canteen when a bird flew through the window.","When a bird flew through the window, I was eating lunch in the school canteen."] ds=[]
- `m4-u1-past-continuous-revision-tr-003` [translation, d3]: p="🇩🇪 Um 9 Uhr gestern Abend schlief sie schon." c="At 9 o'clock last night, she was already sleeping." a=["At 9 o'clock last night, she was already sleeping.","She was already sleeping at 9 o'clock last night.","At 9 o'clock yesterday evening, she was already sleeping.","At 9 last night she was already sleeping."] ds=[]
- `m4-u1-past-continuous-revision-tr-004` [translation, d4]: p="🇩🇪 Die Sonne schien und die Voegel sangen, als wir aufwachten." c="The sun was shining and the birds were singing when we woke up." a=["The sun was shining and the birds were singing when we woke up.","When we woke up, the sun was shining and the birds were singing.","The sun was shining and the birds were singing when we woke up"] ds=[]
- `m4-u1-past-continuous-revision-sb-002` [sentence-building, d2]: p="Put the words in the correct order: while / were / dinner / having / they / the / doorbell / rang" c="While they were having dinner, the doorbell rang." a=["While they were having dinner, the doorbell rang.","While they were having dinner, the doorbell rang","The doorbell rang while they were having dinner."] ds=[]
- `m4-u1-past-continuous-revision-sb-003` [sentence-building, d3]: p="Put the words in the correct order: at / 7pm / I / was / my / reading / favourite / book / last / night" c="At 7pm last night, I was reading my favourite book." a=["At 7pm last night, I was reading my favourite book.","At 7pm last night I was reading my favourite book.","I was reading my favourite book at 7pm last night.","Last night at 7pm, I was reading my favourite book."] ds=[]
- `m4-u1-past-continuous-revision-cp-002` [context-picker, d3]: p="You looked out of the window at 6am. The street was covered in snow. A man was outside. Which sentence best describes what you saw?" c="A man was clearing the snow from the pavement." a=["A man was clearing the snow from the pavement."] ds=["A man cleared the snow from the pavement.","A man is clearing the snow from the pavement.","A man had cleared the snow from the pavement."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abraham, Adrian, Adverbs, Africa, African, Agripina, Ahmed, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Alphabet, Alps, Amazon, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Antarctic, Anthony, Anti, Antonio, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Aussage, Australia, Austria, Austrians, Award, Bacon, Baker, Balcony, Barbie, Barcelona, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Black, Blackbeard, Blackie, Blarney, Blues, Bob, Boer, Bolt, Bond, Botanic, Botswana, Bottlemen, Box, Bradley, Brazil, Brazilian, Brian, Bridge, Brighton, British, Brown, Buckells, Buckingham, Buddy, Burgers, Busy, Butterfly, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolyn, Carter, Castle, Catfish, Cathedral, Celia, Celsius, Central, Centre, Chamber, Changing, Charlie, Checking, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbus, Column, Come, Complimenting, Continuous, Control, Convention, Costa, Covent, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Death, Debbie, Delta, Dempsey, Denver, Derek, Despereaux, Detergent, Dialog, Dialoge, Diana, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Dragon, Dragons, Dua, Dublin, Dungeon, During, Earthlings, East, Easter, Eddie, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, English, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, False, Fame, Fang, Faye, Feeling, Fidel, Fido, Fleming, Fluff, Food, Ford, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harris, Harrison, Harry, Haven, Hayes, Head, Hedy, Helen, Help, Henry, High, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Imagine, Imperatives, Inc, Infinitiv, Interviewer, Ireland, Irish, Irregular, Isaac, Italian, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Jasmine, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jewels, Jill, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Julia, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katie, Katy, Ken, Kennedy, Kerr, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Laurie, Lauriston, Leah, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Machu, Madonna, Mail, Malala, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Maple, Margaret, Marilyn, Mario, Mark, Marple, Mars, Martello, Marvel, Mary, Matt, Matterhorn, Maun, Mayan, Mead, Megan, Mei, Meridian, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Mills, Miriam, Miss, Mma, Moher, Moira, Mongolian, Monica, Monroe, Moqueca, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murray, Musical, Napa, Natasha, Nathan, National, Natural, Navy, Neither, Nelson, New, Newman, Newtown, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekte, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patti, Paul, Paula, Paws, People, Pepys, Peru, Pete, Peter, Pets, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plural, Plurals, Pluto, Pole, Polly, Pop, Portugal, Possessives, Potter, Prepositions, Present, Priestly, Princess, Professor, Project, Protestant, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Really, Rebellion, Recherche, Red, Redwood, Reihenfolge, Renato, Republic, Rica, Richard, Richmond, Richter, Rick, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Roundstone, Rover, Royal, Ruby, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Scotland, Scott, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Shelter, Sherlock, Shrek, Sicily, Silben, Silicon, Simon, Sinead, Sir, Smith, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Spotify, Spotless, Square, St, Stallone, States, Station, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Tesla, Text, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Uhr, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Washington, Waterloo, Watson, Way, Welcome, Well, Wheel, White, Whittington, Wilde, Will, William, Willow, Wilson, Wise, Wolf, Work, World, Wortes, Would, Wow, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 1.txt -----
Unit 1 Welcome to Ireland
Page 8–9
You learn
about Ireland and its history
about Oscar Wilde and his work
how to use the past continuous
You can
express your surprise and interest
talk about places you’d like to visit
write about holidays
🎧 1
 a Look at the photos. Find the places on the map.
 b Do the Ireland quiz in pairs.
 Circle T (True) or F (False).
 Then listen and check your answers.
Do you know Ireland?
The capital of the Republic of Ireland is Belfast. T / F
There are about five million people in the Republic of Ireland. T / F
The official languages of Ireland are English and Irish. T / F
More than a million Irish people are fluent in Irish. T / F
Irish is spoken primarily in the west of Ireland. T / F
The Republic of Ireland is not a member of the EU. T / F
The Irish money is the pound. T / F
The Republic of Ireland is part of the United Kingdom. T / F
Ireland exports a lot of software. T / F
Northern Ireland is not part of the Republic of Ireland. T / F
The capital of Northern Ireland is Derry. T / F
Most Irish people in the Republic are Catholics. T / F
[Image descriptions:]
Lough Erne: A lake with a pier and trees.
The Glendalough Tower: A tall round stone tower in a green area.
Map of Ireland: Highlighting Republic of Ireland and Northern Ireland, with capital cities, rivers, and key locations marked.
The Rock of Cashel: A medieval complex of buildings on a hill.
Get talking – Expressing surprise / Asking your partner to say something
🗨 1 Work in pairs. Tell your partner three things that surprised you from the quiz.
“I wasn’t aware that …”
 “I didn’t know that …”
 “How about you?”
 “I had no idea that …”
📖 2
 a Look quickly at the text below. What kind of text do you think it is?
 □ a story □ a diary entry ☑ a news report □ a magazine article
b Quickly go through the text and find out what happened in these years.
 1845 1916 1922 1972 2007 2012
c Read the full text.
A VERY SHORT HISTORY OF IRELAND
Why do Irish football fans never support or cheer for England?
History is the answer. For many centuries the Irish fought against the British and hundreds of thousands of Irish people were killed.
In September 1845, the situation of the people in Ireland was dramatic. A fungus destroyed the potato crop. The following year, there were no potatoes again. While many poor people in Ireland were starving, Protestant Irish landlords sent badly needed grain and cattle to England to sell it there. The British government didn’t help either, because they believed that a government should not interfere with the economy. One official said in 1846, “It is not our intention at all to export food for the use of the people of Ireland.”
There were about eight million people in Ireland in 1850. While they were trying to find food, one million of them died and between 1845 and 1855 about two million left the island for the USA, Australia and New Zealand. After the famine, the population never rose to the level of eight million again.
In the late 19th century Charles Stewart Parnell and others fought for “Home Rule”. They wanted autonomy, but it took some time to become independent. In 1916, the “Easter Rebellion” of the Irish was put down by the British and 15 leaders of the rebellion were shot. A guerrilla war followed. In 1922, the Irish Free State was founded. But the Irish had to pay a price. Of the 32 counties in Ireland only 26 formed the Free State.
The rest of Ulster (which is the UK part of Northern Ireland) and its six counties, where the majority of the people were Protestant, did not become part of the Free State, then known as the Republic of Ireland.
What followed in Northern Ireland was a period called “the Troubles”. It began in the late 1960s when Catholic groups (most famously: the IRA), who wanted to join the Republic of Ireland, and Protestant groups, who wanted to stay with the UK, began to fight each other. One of the most famous incidents was the Bloody Sunday Massacre. On 30th January 1972, the British Army shot dead 13 civilians (one more man died later). This was the largest number killed in one day and Irish Catholics hated the British Army even more. All in all, more than 3,500 people were killed in the conflict, which more or less ended in 1998 with the Good Friday Agreement.
In 2007, the British government called its soldiers home. In 2012 former IRA commander Martin McGuinness formally shook hands with Queen Elizabeth II in Belfast. Hopefully this will really be the end of the Troubles forever.
[Image at the bottom right:]
 Caption: “Dublin Memorial to the Famine of 1846” – Bronze statues of emaciated people holding bags or sticks, symbolizing starvation during the famine.
Page 10–11
🎧 3
 How many of these tasks can you do?
 Check your answers with a partner. Then listen to the text.
Circle T (True) or F (False).
A fungus destroyed all the crops.
  T / F
Protestant land owners did not have any food at all.
  T / F
During the famine the British government helped out as much as possible.
  T / F
Complete the sentences.
Within ten years, Ireland lost 2 million people because they ...
The idea of autonomy for Ireland was called ...
After the Easter Rebellion ...
Answer the questions.
What did six counties not become part of?
What do we understand by the Troubles?
What happened that hopefully has ended the Troubles?
🟩 Vocabulary
 4 Match the words/phrases from the text in ➋ with the definitions.
Number	Word/Phrase	Definition
1	put down	g use military power to stop something
2	interfere	i to get involved in something
3	intention	o a plan to do something
4	majority	h most people
5	starve	c become ill or die because you do not have enough food
6	cattle	f cows and bulls
7	cheer	e shout as a way of showing you’re happy
8	famine	d extreme hunger because there’s no food
9	potato crop	b all the potatoes produced in a year
10	landlord	a a man who owns land

🎧 Sounds right – Elision
 5 Listen to the dialogue. Pay attention to the underlined parts.
 Then listen and repeat.
Alan I’d like to visit Dublin.
 Brenda Why?
 Alan My friend went there. He loved it.
      It must be a great city.
 Chris I’d rather go to Spain.
 Brenda Why Spain?
 Chris Because it’s hot there. Where would you like to go?
 Brenda Guesst!
 Chris I haven’t got a clue.
 Brenda Nowhere. I don’t like travelling.
💬 Get talking – Expressing interest
 6 Work with a partner. Talk about a place you’d (not) like to visit and give your reasons. Ask and answer questions.
I’d love to visit …
 I’d never go to …
 Why (not)?
 With whom … ?
 How long … ?
 What else … ?
🎧 7
 a Listen to the interview and complete the sentence below.
 The main reason Anna is in Dublin is
 ☐ to learn English. ☐ for tourism. ☐ to work.
b Listen again and answer the questions.**
Where is Anna from?
What does the interviewer think of Anna’s English?
What does Anna like about Dublin?
What does she think about the economic situation?
What doesn’t she like about Dublin?
What is LUAS and what does Anna think about it?
What is her favourite place in Dublin?
What does she think about the weather?
📖 8
 Look at the magazine text giving information about what to do in Dublin.
 Then read the statements and circle T (True) or F (False).
WHAT’S ON IN DUBLIN
JULY 12th
ART
 Inside, Outside and Beyond
 Celebrating thirty years of painting in the National Botanic Gardens.
 See Gerard Byrne’s spectacular garden paintings at the National Botanic Gardens.
 Opening times: 9:00–17:00.
 Admission free.
THEATRE
 Ulysses
 Dermot Bolger’s version of James Joyce’s Ulysses was a massive hit at last year’s Dublin Theatre Festival. Now at the Abbey Theatre at 8 p.m.
 Tickets: €13 – €45
MUSIC
 Damien Dempsey
 Iveagh Gardens, Clonmel Street, 19:00–22:00
 Known as one of Ireland’s greatest singer-songwriters, Damien Dempsey will give a special summer outdoor gig in Dublin’s stunning Iveagh Gardens.
 Tickets: €40
EXHIBITIONS
 Irish Famine Exhibition
 Explore the Irish Potato Famine of 1845 to 1852, also known as the Great Hunger.
 Stephen’s Green Shopping Centre, 12:00 to 18:00.
 Tickets: €6 – €10
SIGHTSEEING
 Guided Cliff Walk Tours
 Martello Tower Donabate, New Road, Donabate
 Enjoy a guided walking tour from the Martello Tower in Donabate to the Martello Tower in Portrane, taking in the stunning views along the cliff walk and a history of the local sights along the coast to North County Dublin from your guide.
 Tickets: €12 – €20 (There are reduced rates for children and groups)
True / False Statements
The Botanic Gardens are open for ten hours. T / F
The cheapest tickets to see the play are €13. T / F
Damien Dempsey is playing songs outside. T / F
The potato famine lasted ten years. T / F
If you do the tour with other people you can get cheaper tickets. T / F
Page 12–13
🔍 9
 Search for the information in the text in ➑ and complete the sentences.
There have been paintings at the Botanic Gardens for …
The production of Ulysses starts …
Damien Dempsey is from …
The Great Hunger is another name for …
The walking tour finishes in …
🧭 10
 A group of British students are going on a school trip to Glendalough in Ireland.
 Look at the pictures and answer the questions.
a
Do you think these are good places for a school trip? Why / Why not?
What kind of places for school trips do you like best? Give your reasons.
(Image descriptions embedded in the page:)
The bell tower – an ideal place to hide from attackers.
There are two beautiful lakes in the valley.
Glendalough is great for hiking.
b
 Read the questions. Listen and take notes. Then compare your notes.
What would the boys like to do at the lakes? Is it possible to do these things? Why / Why not?
How do the boys feel about the trip? Give examples.
How do the boys try to be funny? Give examples.
What does the teacher say about the bell tower that you can see in one of the photos?
📖 Oscar Wilde
 (1854–1900) was one of the great Irish writers. He was born in Dublin and studied there and at Oxford in the UK.
 Wilde is the author of many short stories such as The Happy Prince, a famous novel which shocked people back then (The Picture of Dorian Gray) and many plays such as The Importance of Being Earnest. He died in a hotel room in Paris in 1900.
One of his stories is The Canterville Ghost (1887). It has been filmed several times. It is about the Otises – an American family who buy the Canterville Chase, an old house, from the English Lord Canterville. With it comes a ghost that has haunted the house for 300 years. The Otises do not believe in ghosts, and when they meet Sir Simon, the ghost, they are not scared. This depresses the ghost; everybody makes fun of him and only young Virginia Otis takes pity on him.
Suddenly Mrs Otis caught sight of a dull red mark on the floor just by the fireplace and, quite unconscious of what it really meant, said to Mrs Umney, “I’m afraid something has been spilt there.”
 “Yes, madam,” replied the old housekeeper in a low voice; “blood has been spilt on that spot.”
 “How horrible,” cried Mrs Otis. “I don’t care for bloodstains in a sitting room. It must be removed at once.”
The old woman smiled, and answered in a low, mysterious voice. “It is the blood of Lady Eleanore de Canterville, who was murdered on that very spot by her husband, Sir Simon de Canterville, in 1572. Sir Simon survived her by nine years, and disappeared suddenly in very mysterious circumstances. His body has never been discovered, but he still haunts the castle as a ghost. The bloodstain has been much admired by tourists and others, and cannot be removed.”
“That is all nonsense,” cried Washington Otis. “Pinkerton’s Champion Stain Remover and Paragon Detergent® will clean it up in no time.” And before the terrified housekeeper could interfere he had fallen upon his knees, and was rapidly scouring the floor with a small stick of what looked like a black cosmetic. In a few moments no sign of the bloodstain could be seen.
“I knew Pinkerton would do it,” he exclaimed triumphantly as he looked round at his admiring family; he had hardly finished the sentence when a terrible flash of lightning lit up the dark room, a frightening clap of thunder made them all jump to their feet, and Mrs Umney fainted.”
 […]
The next morning, however, when they came down to breakfast, they found the terrible stain of blood once again on the floor.
 “I don’t think it is the fault of the Paragon Detergent,” said Washington, “for I have tried it with everything. It must be the ghost.”
 Then he rubbed out the stain a second time, but the following morning it appeared again.
VOCABULARY
haunt = heimsuchen, spuken
detergent = Reinigungsmittel, scoure = reinigen
souvenir, faint = in Ohnmacht fallen
💬 11
 Quickly read the texts on p. 13 and say what the ghost’s problem is.
 Then read the texts again and answer the questions below.
What is Oscar Wilde famous for?
What is so special about the Canterville country house?
Does Mr Otis believe in ghosts?
Why is there blood on the floor?
Why doesn’t the blood disappear?
How does Mr Otis react to the bloodstain?
What did Washington learn in the end?
💡 12
 Now get together with a partner and speculate what will happen next.
 Then get together with another pair and compare your ideas.
Page 14–15
🔶 13 CHOICES
 Writing for your Portfolio
A
 Write an email to tell a friend about a place where you would like to go for a holiday.
 Write 40–70 words and do not take more than 10 minutes.
Tell your friend:
where you would like to go
why you think it would be a great place to go
what you would like to do there
B
 You have been invited to write a story for your school magazine. The story should be about a holiday adventure. It should be about 120–180 words. Do not forget to use paragraphs and do not take more than 20 minutes.
In your story, say:
where you went
who went with you
what happened
how you felt and why
what the ending of the story was
📘 GRAMMAR
 Past continuous (Revision)
While they were trying to find food, one million of them died.
How to form it: past tense von be + -ing-Form des Verbs.
Complete:
 Du verwendest das 1️⃣ __________, um eine längere Handlung in der Vergangenheit zu beschreiben, die durch eine kürzere unterbrochen wird. Für die kürzere Handlung verwendest du das 2️⃣ __________.
Du verwendest das 3️⃣ __________ auch, wenn du über eine länger andauernde Handlung in der Vergangenheit sprichst oder schreibst.
From 2014 onwards, everything was getting better for Ireland.
Du verwendest das Past Continuous außerdem, um zwei längere Handlungen zu beschreiben, die zur gleichen Zeit in der Vergangenheit stattgefunden haben. Für beide Handlungen verwendest du dann das Past Continuous.
While many poor people in Ireland were starving, Protestant Irish landlords were sending badly needed grain and cattle to England.
Image caption:
 While his mum was reading, Johnny gave her a surprise.
 (A cartoon illustration shows a boy with a party horn and a present behind his back, surprising his mother who is sitting on the couch reading.)
📀 THE MAG 1 – The competition
📺 1
 Watch the story. Then circle T (True) or F (False).
Liam is new to their school.
He wants to be a journalist on The Mag.
Lucy chooses more of Liam’s photos than Nick’s photos.
Liam took all of his photos off the net.
Lucy didn’t know about Nick and Liam’s competition.
Lucy agrees to give Liam a second chance.
 T / F (for each)
📘 2
 Complete the sentences with no more than four words each.
Liam is new at the school and wants to join …
When Nick hears that Liam is also a photographer, he isn’t …
Lucy wants five photographs from each of them so she can …
Nick suggests to Liam that the one whose photos get picked should …
Liam’s photos are brilliant, but the others find out he got them …
Lucy says Liam can’t …
💬 Everyday English
🗨 3
 Complete the dialogues with the phrases from the box.
 Box:
Whatever.
Piece of cake!
How does that grab you?
What a nerve!
Dialogue 1 (three students discussing photo layouts)
 Student A: And I want black and white. We’ve got four pages to fill.
 Student B: (blank line)
 → Fill in with a phrase from the box.
Dialogue 2 (two boys discussing fairness in photo selection)
 Boy 1: If she picks more of yours than mine, then you stay on. If she picks more of mine, then I stay on.
 Boy 2: (blank line)
Dialogue 3 (Liam thanking Nick for complimenting his photos)
 Liam: They’re brilliant, Nick. Thanks.
 Nick: Yeah. (blank line)
Dialogue 4 (Lucy confronting Liam)
 Lucy: He just stole them off the net.
 Student: (blank line)
(Photos show various teenagers in classroom/library settings having the above dialogues.)


----- WB: More 4 WB Unit 1.txt -----
UNIT 1 Welcome to Ireland
Pages 4–5
Reading
 1 Read the text about St. Patrick’s Day.
St. Patrick’s Day
 My family and I were in Syracuse in the state of New York on the 17th of March when suddenly we were right in the middle of a huge St. Patrick’s Day parade.
There were about 100,000 visitors, somebody told us. It was pretty cool and I saw that they even had green drinks.
 We live near Manchester in the UK and I had been to the Irish festival there once or twice, which is usually two weeks before St. Patrick’s Day, but I didn’t know that it was so important in the USA. Back home we put on a bit of green on St. Patrick’s Day and learnt about the first St. Patrick’s Day parade that was held in Boston in 1737 at school. But this was actually in New York City! There were Irish soldiers in the English army and they marched through New York City.
Along with their music, the parade helped the soldiers reconnect with their Irish roots, as well as with fellow Irishmen in the English army.
 Today, there are parades almost everywhere. Some in Dublin, of course, where there are something like 500,000 visitors. The largest one, though, is in New York, with about 150,000 people marching and about 2,000,000 people watching.
 Wherever the party, people drink special beer and eat Irish food such as corned beef and cabbage and potatoes. Nowadays, there are often Irish wolves, which is more American than Irish, and they wear little plastic shamrocks* or stickers saying “Kiss me, I’m Irish.” For many people it is also important to wear something green, since green was the colour of the Irish Catholics.
 I also found out that St. Patrick lived in the 5th century. When he was sixteen, he was made a slave in Ireland. He lived there for six years before he managed to run away. Later he returned as a missionary* and he stayed there for most of his life. Naturally, there are many legends concerning St. Patrick. One of them is that he chased all the snakes of Ireland into the sea after they attacked him. Another one is that his walking stick turned into a tree. While St. Patrick was talking to a group of people, he stuck his walking stick into the ground. It took the group a long time to understand his message, so in the end the walking stick had turned into a tree.
 The shamrock also goes back to St. Patrick. He used it to illustrate the Christian idea of three persons in one god.
 People think Patrick died on March 17th and he is buried* in Downpatrick in Northern Ireland.
 St. Patrick is the patron saint* of Ireland and for many years St. Patrick’s Day was a church festival. But now it has become a holiday for Irish and non-Irish people all over the world – in Dublin, Belfast, Manchester, Seoul, New York – or Syracuse.
VOCABULARY: shamrock – Kleeblatt; missionary – Missionar/in; buried – begraben; patron saint – Schutzheilige/r
2 How many of these tasks can you do? Check your answers with a partner.
1 The writer was surprised to see that the drinks had many colours.  T / F
 2 In Manchester people start celebrating long before St. Patrick’s Day.  T / F
 3 St. Patrick’s Day helped English soldiers to reconnect with their homeland.  T / F
 4 The largest parade for St. Patrick’s Day is in
   ☐ New York  ☐ Dublin  ☐ Syracuse  ☐ Manchester.
 5 On St. Patrick’s Day, people have
   ☐ corned beef and potatoes.  ☐ Irish food.
   ☐ cabbage and potatoes.  ☐ Irish food and drink.
 6 St. Patrick was a slave
   ☐ until he was 20.  ☐ until he ran away at 22.
   ☐ before he was set free by his master.  ☐ but didn’t really mind.
 7 Why did St. Patrick’s walking stick turn into a tree? ...................................................
 8 Why is the shamrock an important symbol? .................................................................
 9 How did St. Patrick’s Day change? .................................................................................
Listening
 3 🎧 Listen to an Irish joke. Then answer the questions below.
1 What is the first thing the man asks for? ............................................................................
 2 How much is the first item he wants to buy? .....................................................................
 3 What is the woman’s reaction? .........................................................................................
 4 How much is the leather jacket he wants to buy? ............................................................
 5 What is the woman’s reaction to the car deal? What does she want for that price? ........
 6 What is the last thing the man wants to buy? ....................................................................
 7 What offer does the woman say the man should make? ................................................
 8 How do the women in the changing room react to the conversation? ............................
 9 What is the punchline* of the joke? ....................................................................................
VOCABULARY: astonished – erstaunt; punchline – Pointe
Image description (left page, top half):
 A photograph showing a parade of musicians in kilts, playing bagpipes. In the foreground, a drum reads "Pipes & Drums" and "ORA". Over the photo in bold white letters: "St. Patrick’s Day".
Image description (right page, bottom right):
 Cartoon drawing of two women in a clothing store changing room. They are reacting with surprised expressions as they overhear a man’s conversation outside.
Pages 6–7
Grammar Past continuous
4 Join the sentences. Use the past simple and past continuous tenses.
1 Liam / play / on his mobile – the battery / go dead
   Liam was playing on his mobile when the battery went dead.
 2 Mary / run down the street – she / lose a shoe
 .......................................................................................................................................................
 3 We / do an exercise – the bell / ring
 .......................................................................................................................................................
 4 Diana / work in the kitchen – ghost / appear
 .......................................................................................................................................................
 5 The people / dance – lights / go out
 .......................................................................................................................................................
 6 The teacher / talk about monks – a boy / make a joke
 .......................................................................................................................................................
5 Look at the pictures. What were the people doing before they were “frozen”?
1 Kevin ............................................................
 2 Mike and Rose ............................................................
 3 Pete ............................................................
 4 James and Kate ............................................................
 5 Sinead ............................................................
VOCABULARY: fiddle – Geige, Fidel
Image descriptions (for task 5):
 1: Boy with a bow playing a violin (fiddle).
 2: A boy and a girl dancing.
 3: A boy reading a book.
 4: A boy and a girl holding soft drinks, smiling.
 5: A girl dressed as a fairy with wings and wand.
6 Join the sentences. Use the past continuous.
1 Lucas / talk / on his mobile – his friends / listen / to every word he said
   While Lucas was talking on his mobile, his friends were listening to every word he said.
 2 people / dance in the street – fighting / go on
 .......................................................................................................................................................
 3 people / starve in Ireland – England / try not to interfere
 .......................................................................................................................................................
 4 Washington Otis / clean the floor – his family / watch
 .......................................................................................................................................................
 5 St. Patrick / talk to the people – his stick / turn into a tree
 .......................................................................................................................................................
7 Fill in the past continuous or past simple form of the verbs in brackets.
When James 1.................................................. (arrive) at the hall, the people 2.................................................. (sit) at the tables and nobody 3.................................................. (dance). So James 4.................................................. (take out) his fiddle* and 5.................................................. (start) playing. Two minutes later, when James 6.................................................. (look) around the hall, he saw that half of the people 7.................................................. (dance) to the sound of the beautiful music and the other half 8.................................................. (cry) with happiness.
 Then some girls 9.................................................. (go) up to James. “You must be from the land of fairies.” They said. “We’ve never heard anything like that before.” James 10.................................................. (stop). Suddenly there was a flash and James 11.................................................. (disappear).
VOCABULARY: fiddle – Geige, Fidel
8 Complete the text with the correct form of the verbs in the box (past continuous or past simple).
 cough move travel try kiss climb blow shiver really look forward
We 1.................................................. to Blarney Castle and I
 2.................................................. to it. Maybe you know the story of the Blarney Stone. If you kiss it, then you get “the gift of the gab”, which means that you will be very good at talking for the rest of your life.
 When we got there, we 3.................................................. the stairs to the Blarney Stone. The stone was at the top of the castle and you had to lean out to kiss it. A strong wind 4.................................................. .
 For some minutes I 5.................................................. to put my head out through the hole, but the wind was so strong that I couldn’t see where the stone was. So I 6.................................................. all the stone parts left and right and below and above. When I 7.................................................. my head back in, I 8.................................................. with cold. An hour later I 9.................................................. a lot. “Sounds like a nice cold,” my friend said. And he was right. For a few days I couldn’t talk at all.
9 Fill in the past continuous or past simple form of the verbs in brackets.
I 1.................................................. (sit) with my friend.
 We 2.................................................. (wait) for the end
 Of the movie on TV
 When she quickly 3.................................................. (turn) to me
 Saying, “I don’t want to be
 With you any longer. We
 Do nothing – just hang around.”
First I 4.................................................. (not make) a sound.
 Then I 5.................................................. (look) at her and said,
 “If you think so, go ahead.
 But I remember we 6.................................................. (walk)
 By the river, always talking,
 And I remember we 7.................................................. (kiss).
 I don’t know what you are missing.
 I remember... “Stop!” she 8.................................................. (say),
 “All these things are in your head.”
 She got up and 9.................................................. (leave). And I
 Could do nothing – only cry.
Pages 8–9
10 Read the summary of the Irish potato famine and complete the missing vocabulary.
When the Irish potato 1. ..................................................... failed in 1845 the results were disastrous*. There was a huge 2. ..................................................... across the land and the 3. ..................................................... of poor people started to 4. ..................................................... as there was not enough food to go around. The 5. ....................................................., who owned the farms sent their grain and 6. ..................................................... to England where they could get more money for them. The British government did nothing to 7. ..................................................... with the situation saying that it was not their 8. ..................................................... to start exporting food to Ireland. As a result millions of Irish people had to leave and start new lives in other countries. Years later a rebellion of the Irish against the English in 1916 was quickly and violently 9. ..................................................... .
   With all this history it’s perhaps no surprise that the Irish rarely 10. ..................................................... for English sporting teams in international competitions.
VOCABULARY: disastrous – verheerend
11 Find the seven words in the word snake.
 Word snake illustration with the following hidden words:
stain, remove, over, fireplace, blood, stains, faint, thunder, haunted, restless
12 Complete the sentences with the words from 11.
1 Jim couldn’t believe his eyes when he entered the sitting room – there were ..................................................... all over the floor.
2 It was snowing outside, so Carmen sat by the ..................................................... to keep warm.
3 Some people believe that the house on the hill is ..................................................... by the ghost of an old housekeeper.
4 Luke bought a ..................................................... and was finally able to get the couch clean again.
5 There was a ..................................................... across the sky and we could hear loud .....................................................
6 I haven’t eaten anything for hours. I feel very weak and dizzy – I think I am going to .....................................................
13 Do the puzzle. Start in the top left corner and move clockwise*. The last letter of one word is the first of the next. The words are all from the unit in your Student’s Book.
Puzzle Grid:
G
1 A word for food. (informal) (4 letters)
 2 If you are not scared of anything, you are … . (5 letters)
 3 The rebellion in 1916 was at this time of the year. (6 letters)
 4 Politically*, Ireland is a … . (8 letters)
 5 Dublin is the … of Ireland. (7 letters)
 6 The opposite of high is … . (3 letters)
 7 Most Irish speakers live in the … . (4 letters)
 8 Ireland is a good place to … around. (6 letters)
VOCABULARY: clockwise – im Uhrzeigersinn, politically – politisch gesehen
Everyday English The competition
 Complete the dialogue with the missing phrases.
 [phrases: whatever, piece of cake, How does that grab you, What a nerve]
Liam: We’ve got band practice in half an hour and Sinead has just left.
       What a nerve
 Ron:  I ..................................................... ! I told her to stay here for another two hours.
       We need to practise the first two songs.
 Liam: Come on! They’re a ..................................................... for Sinead. Let’s just go on from the instrumental part.
 Ron:  3 ..................................................... ?
 Liam: Yeah, OK, 4 .....................................................
Developing writing skills Postcard/Letter/Email (Opinions)
14 Read the task and what a student wrote in 16. Why does Linda like the new rooms?
Task
 Imagine you’re in a hotel in a city of your choice. Write a holiday card to a friend (40–70 words).
 Write about:
 • where you are
 • what you like about your room
 • how it compares to other rooms
 • what somebody who is with you says about the room
15 Read the text in 16 again and answer the questions.
1 Where is Linda staying?
 .....................................................................................................................................................
2 What has happened to the rooms?
 .....................................................................................................................................................
3 How do they compare with the old rooms?
 .....................................................................................................................................................
4 What doesn’t her mother like?
 .....................................................................................................................................................
Pages 10–11
16 Read the text and complete it with the words/phrases in the box.
as far as I’m concerned believe you ask me seems
Hi Loretta,
 We’re staying at the Russell Hotel in London again and I 1 ............................................... it’s better than ever. The rooms have been redone, and I 2 ............................................... they’re even more comfortable than the old rooms.
 And it 3 ............................................... to me that they’re even larger than before. Mum says it’s all a bit too colourful, but 4 ............................................... they’re totally awesome.
 See you on Monday when I get back.
 Hugs,
 Linda
Useful phrases:
 • I believe/suppose/think …
 • In my opinion …
 • It seems to me …
 • As far as I am concerned, …
 • Personally, I think …
 • I’d say that …
Writing tip:
 When offering an opinion in a postcard / an email / a letter:
 • make sure you clearly say what you think
 • make sure you use different phrases (and don’t repeat, e.g. I think all the time)
 • if possible, contrast* your opinion with someone else’s
VOCABULARY: contrast – vergleichen
17 Now write your own answer to the following task.
Task
 Write a letter to a relative (120–180 words) in which you tell them about your holidays in another country.
 Give your opinions on:
 • accommodation
 • food
 • entertainment
 • what the people there are like
 • what other tourists are like
 • what your parents think of all that
MORE Words and Phrases
1 be aware of sth
  I wasn’t aware of that.
  sich etw bewusst sein
2 Catholic
  Most people in the Republic of Ireland are Catholics.
  katholisch, Katholik/in
3 fluent
  She speaks fluent English.
  fließend
4 independent
  The Republic of Ireland is an independent country.
  unabhängig
5 leading
  Some leading computer firms have their base in Ireland.
  führend
6 member
  The club has 300 members.
  Mitglied
7 primary school
  Children in primary school are between 6 and 10 years old.
  Volksschule
8 cattle
  He keeps horses and cattle on his farm.
  Rinder, Vieh
9 cheer
  The fans cheered for their team.
  jubeln
10 crop
  In 1845, the potato crop in Ireland was destroyed.
  Ernte
11 famine
  In a famine, people die because they have nothing to eat.
  Hungersnot
12 found
  The Irish Republic was founded in 1922.
  gründen
13 free state
  Ireland became a free state in 1922.
  Freistaat
14 fungus
  A fungus destroyed all the potatoes in Ireland.
  Pilz
15 government
  The government didn’t react fast enough to the crisis.
  Regierung
16 grain
  You can make bread from grain. It grows in fields.
  Getreide
17 incident
  Someone just stole that lady’s handbag. We should report the incident to the police.
  Zwischenfall
18 intention
  She announced her intention to run for president.
  Absicht, Vorhaben
19 interfere
  You should not interfere in other people’s business.
  sich einmischen; in Konflikt geraten
20 landlord
  The landlord is the owner of the house or the land where people live or work.
  Grundbesitzer; Vermieter
21 majority
  Most of the people in the north were Protestant. They were the majority.
  Mehrheit
22 put down
  British soldiers put down the rebellion.
  niederschlagen
23 shake hands
  It’s normal to shake hands with somebody you’ve just met.
  Hände schütteln
24 starve
  The people had nothing to eat. They were starving.
  verhungern
25 Guess!
  You want to know what I bought? Guess!
  Rate!
26 I’d rather
  I’d rather stay at home than go on holiday this year.
  Ich möchte eher
27 foreigner
  I met many foreigners from Asia who was working at the hotel.
  Ausländer/-in
28 improve
  I wanted to improve my English and get better marks.
  verbessern
29 tax
  Nearly everyone in the country has to pay taxes to the government.
  Steuer
30 hiking
  National Parks are always great places for hiking.
  Wandern
31 proper
  That’s not a proper job. Do it again!
  richtig, angemessen
32 admire
  They all admired her courage.
  bewundern
33 be terrified
  Scared? I was absolutely terrified!
  fürchterliche Angst haben
34 nonsense
  She thinks that astrology is nonsense.
  Unsinn, Quatsch
35 thunder
  Lightning is usually followed by thunder.
  Donner
36 unconscious
  She was unconscious for three days after the accident.
  bewusstlos; unbewusst

```

## Output contract

Write `content/corpus/units/g4-u01/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u01",
  "briefBank": "05dcb9424620",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u01.s.past-continuous-revision",
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
