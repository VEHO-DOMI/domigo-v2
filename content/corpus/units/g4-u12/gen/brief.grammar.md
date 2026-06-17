# Grammar generation brief — g4-u12 (MORE! 4, Unit 12)

<!-- domigo:gen grammar g4-u12 bank=8238afa2164f prompt=4b9164076103 -->

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

### `g4u12.s.phrasal-verbs` — Phrasal verbs (Phrasal verbs (Verben mit Partikel))

Phrasal verbs - a verb plus a preposition/particle. Sometimes the particle just belongs to the verb; sometimes it gives the verb a special or completely different meaning (take off, set off, set up, come up with, get on with, run out of, pick up). Because the English particle is often different from the German one, it must be learned with the verb.

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [verb-plus-particle]: Many English verbs are followed by a preposition/particle. Sometimes the particle gives the verb a special or completely different meaning, so phrasal verbs must be learned as vocabulary.
  - DE: Viele englische Verben stehen mit einer Präposition/Partikel. Manchmal gibt die Partikel dem Verb eine spezielle oder völlig andere Bedeutung, daher musst du Phrasal verbs als Vokabeln lernen.
  - "We already have the technology to take off from our planet. (= leave the ground)" — "Wir haben schon die Technologie, um von unserem Planeten abzuheben."
  - "He hadn't come up with anything good for a long time. (= thought of)" — "Ihm war lange nichts Gutes eingefallen."
- rule [core-m4-phrasal-verbs]: Learn the core M4 phrasal verbs and their meanings: set off (start a journey), take off (leave the ground), set up (start a new life/business), come up with (think of an idea), get on with (have a relationship with), run out of (be finished completely).
  - DE: Lerne die wichtigsten M4 Phrasal verbs und ihre Bedeutung: set off (eine Reise beginnen), take off (vom Boden abheben), set up (ein neues Leben/Geschäft beginnen), come up with (eine Idee haben), get on with (sich verstehen mit), run out of (völlig aufgebraucht sein).
  - "She set off for the art shop." — "Sie machte sich auf den Weg zum Kunstgeschäft."
  - "She got on well with everyone." — "Sie kam mit allen gut aus."
- rule [learn-the-preposition]: The preposition in an English verb is often different from the German one, so always learn the preposition together with the verb (wait for = warten auf, think of = denken an).
  - DE: Die Präposition bei einem englischen Verb ist oft anders als im Deutschen, daher lerne die Präposition immer zusammen mit dem Verb (wait for = warten auf, think of = denken an).
  - "What are you waiting for?" — "Worauf wartest du?"
  - "She spent all her pocket money on paint and paper." — "Sie gab ihr ganzes Taschengeld für Farbe und Papier aus."

common errors:
- Putting the pronoun after the particle in a separable phrasal verb: ✗ "He picked up it." → ✓ "He picked it up."
- Using the wrong particle with the phrasal verb: ✗ "She set off a new business." → ✓ "She set up a new business."
- Using a German-style preposition instead of the English one: ✗ "I'm waiting on the bus. (meaning: warten auf)" → ✓ "I'm waiting for the bus."

SB box `g4/sb/More 4 SB Unit 12.txt#grammar-1` — Phrasal verbs:
```
How to use it: Im Englischen stehen Präpositionen, die zu einem Verb gehören, häufig nach dem Verb: What are you waiting for?
She spent all her pocket money on paint and paper.
Gelegentlich gibt die Präposition dem Verb eine spezielle Bedeutung: Astronauts can choose from 100 different food items.
The Challenger broke up when it re-entered the Earth’s atmosphere.
When Emily’s mother looked at the paintings, she felt a little bit uncomfortable.
She picked up some of her paintings.
Manchmal erhält das Verb durch die Verwendung einer oder mehrerer Präposition(en) eine völlig andere Bedeutung: We already have the technology to take off from our planet.
She got on well with everyone.
She set off for the art shop.
She’d run out of paint, but she had no pocket money left.
He hadn’t come up with anything good for a long time.
The second option is to set up our new homes on other planets or moons.
Write the phrasal verbs above next to their meanings.
1 start (a journey, a trip)
.............................................................
2 leave the ground and go into the sky
.............................................................
3 to build/make/start a new life/business
.............................................................
4 think of an idea
.............................................................
5 have a relationship with
.............................................................
6 finished completely
.............................................................
Vorsicht: Wie im Deutschen sind Verben auch im Englischen oft mit einer Präposition verbunden. Die Präpositionen sind im Englischen aber häufig anders als im Deutschen, daher musst du die jeweilige Präposition immer mit dem Verb mitlernen.
warten auf / wait for
denken an / think of
[Image description: A cartoon image shows Mr Green dressed in a fur coat and hat, setting off to hunt for bears with binoculars and a large stick. His neighbors are watching from the window looking surprised. Caption: “When Mr Green set off to hunt for bears, his neighbours couldn’t believe their eyes.”]
```

v1 seed items (UNTRUSTED):
- `m4-u12-phrasal-verbs-gf-001` [gap-fill, d1]: p="It's cold outside. Please put ___ your jacket." c="on" a=["on"] ds=["off","up","in"]
- `m4-u12-phrasal-verbs-gf-002` [gap-fill, d2]: p="We've ___ of milk. Can you buy some?" c="run out" a=["run out"] ds=["run off","run up","run away"]
- `m4-u12-phrasal-verbs-gf-003` [gap-fill, d2]: p="She ___ a great idea for the school project." c="came up with" a=["came up with"] ds=["came up for","came out with","came on with"]
- `m4-u12-phrasal-verbs-gf-004` [gap-fill, d3]: p="Your shoes are dirty. Please take ___ off before coming in." c="them" a=["them"] ds=["off them","it","their"]
- `m4-u12-phrasal-verbs-gf-005` [gap-fill, d4]: p="I found this old photo while I was ___ my room." c="tidying up" a=["tidying up","cleaning up"] ds=["picking up","setting up","turning up"]
- `m4-u12-phrasal-verbs-gf-006` [gap-fill, d5]: p="Don't give ___! You can do it if you keep trying." c="up" a=["up"] ds=["in","off","away"]
- `m4-u12-phrasal-verbs-mc-001` [multiple-choice, d3]: p="Which sentence uses the correct word order?" c="She picked it up from the floor." a=["She picked it up from the floor."] ds=["She picked up it from the floor.","She it picked up from the floor.","She picked from the floor it up."]
- `m4-u12-phrasal-verbs-mc-002` [multiple-choice, d3]: p="Choose the correct option: 'The plane ___ at 7 a.m.'" c="took off" a=["took off"] ds=["took on","took up","took out"]
- `m4-u12-phrasal-verbs-mc-003` [multiple-choice, d4]: p="Which sentence is INCORRECT?" c="She looks after it well. -> She looks it after well." a=["She looks after it well. -> She looks it after well."] ds=["She turned on the TV. -> She turned it on.","He picked up the ball. -> He picked it up.","I put on my coat. -> I put it on."]
- `m4-u12-phrasal-verbs-ec-001` [error-correction, d2]: p="Find and fix the mistake: He picked up it from the floor." c="He picked it up from the floor." a=["He picked it up from the floor.","He picked it up from the floor","He picked it up off the floor."] ds=[]
- `m4-u12-phrasal-verbs-ec-002` [error-correction, d3]: p="Find and fix the mistake: She set off a new club at school." c="She set up a new club at school." a=["She set up a new club at school.","She set up a new club at school","She started a new club at school."] ds=[]
- `m4-u12-phrasal-verbs-ec-003` [error-correction, d4]: p="Find and fix the mistake: She looked the children after while their mum was out." c="She looked after the children while their mum was out." a=["She looked after the children while their mum was out.","She looked after the children while their mum was out","She looked after the kids while their mum was out."] ds=[]
- `m4-u12-phrasal-verbs-tf-001` [transformation, d1]: p="Your mum says: 'Turn on the TV.' You already did. Tell your brother: 'I've already turned ___ ___.'" c="it on" a=["it on"] ds=[]
- `m4-u12-phrasal-verbs-tf-002` [transformation, d1]: p="Your friend dropped a pen. Tell them: 'Here, I ___ it ___ for you.'" c="picked ... up" a=["picked ... up","picked it up"] ds=[]
- `m4-u12-phrasal-verbs-tf-003` [transformation, d4]: p="Replace the underlined word with a phrasal verb. Your friend says she invented a great story. You say: 'She ___ ___ ___ a great story!'" c="came up with" a=["came up with"] ds=[]
- `m4-u12-phrasal-verbs-tr-001` [translation, d3]: p="🇩🇪 Zieh deine Schuhe aus, bevor du reinkommst." c="Take off your shoes before you come in." a=["Take off your shoes before you come in.","Take your shoes off before you come in.","Take off your shoes before coming in.","Take your shoes off before coming in."] ds=[]
- `m4-u12-phrasal-verbs-tr-002` [translation, d5]: p="🇩🇪 Wer passt auf die Kinder auf, wenn du nicht da bist?" c="Who looks after the children when you're not there?" a=["Who looks after the children when you're not there?","Who looks after the children when you are not there?","Who looks after the kids when you're not there?","Who looks after the kids when you are not there?"] ds=[]
- `m4-u12-phrasal-verbs-sb-001` [sentence-building, d2]: p="Put the words in the correct order: it / turn / please / off / can / you / ?" c="Can you turn it off, please?" a=["Can you turn it off, please?","Can you turn it off please?","Please can you turn it off?"] ds=[]
- `m4-u12-phrasal-verbs-mt-001` [matching, d2]: p="Match each phrasal verb with its meaning. 1: give up 2: take off 3: set up 4: run out of 5: come up with" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"e\",\"4\":\"b\",\"5\":\"c\"}"] ds=["a: remove (clothing) / leave the ground","b: have nothing left of","c: think of (an idea)","d: stop trying","e: start or establish"]
- `m4-u12-phrasal-verbs-qf-001` [question-formation, d3]: p="Tom picked up the phone. Ask about: what Tom picked up" c="What did Tom pick up?" a=["What did Tom pick up?","What did Tom pick up"] ds=[]
- `m4-u12-phrasal-verbs-gf-007` [gap-fill, d1]: p="Can you turn ___ the lights? It's too dark in here." c="on" a=["on"] ds=["off","up","in"]
- `m4-u12-phrasal-verbs-gf-008` [gap-fill, d2]: p="My car broke ___ on the motorway and I had to call for help." c="down" a=["down"] ds=["up","off","out"]
- `m4-u12-phrasal-verbs-gf-009` [gap-fill, d2]: p="She gave ___ smoking last year and feels much healthier now." c="up" a=["up"] ds=["in","off","away"]
- `m4-u12-phrasal-verbs-gf-010` [gap-fill, d3]: p="Could you look ___ my dog while I'm on holiday?" c="after" a=["after"] ds=["at","for","up"]
- `m4-u12-phrasal-verbs-gf-011` [gap-fill, d4]: p="The music is too loud. Please turn ___ ___! (pronoun: it)" c="it down" a=["it down"] ds=["down it","it off","off it"]
- `m4-u12-phrasal-verbs-gf-012` [gap-fill, d5]: p="We've run ___ ___ milk. Can you go to the shop?" c="out of" a=["out of"] ds=["out from","away from","off of"]
- `m4-u12-phrasal-verbs-mc-004` [multiple-choice, d2]: p="Which sentence correctly places the pronoun with the phrasal verb?" c="Please pick it up from the floor." a=["Please pick it up from the floor."] ds=["Please pick up it from the floor.","Please pick from the floor it up.","Please it pick up from the floor."]
- `m4-u12-phrasal-verbs-mc-005` [multiple-choice, d3]: p="What does 'take off' mean in this sentence? 'The business was slow at first, but then it really took off.'" c="became very successful suddenly" a=["became very successful suddenly"] ds=["removed clothing","left the ground (like a plane)","took a holiday from work"]
- `m4-u12-phrasal-verbs-mc-006` [multiple-choice, d4]: p="Which phrasal verb is INSEPARABLE (the pronoun cannot go in the middle)?" c="look after" a=["look after"] ds=["turn off","pick up","put away"]
- `m4-u12-phrasal-verbs-ec-004` [error-correction, d2]: p="Find and fix the mistake: Can you turn off it? The TV is too loud." c="Can you turn it off? The TV is too loud." a=["Can you turn it off? The TV is too loud.","Can you turn it off? The TV is too loud"] ds=[]
- `m4-u12-phrasal-verbs-ec-005` [error-correction, d3]: p="Find and fix the mistake: She looks after very well her little brother." c="She looks after her little brother very well." a=["She looks after her little brother very well.","She looks after her little brother very well"] ds=[]
- `m4-u12-phrasal-verbs-ec-006` [error-correction, d5]: p="Find and fix the mistake: I need to come up an idea for the school project." c="I need to come up with an idea for the school project." a=["I need to come up with an idea for the school project.","I need to come up with an idea for the school project"] ds=[]
- `m4-u12-phrasal-verbs-tf-004` [transformation, d3]: p="Replace the underlined word with a phrasal verb: She STOPPED eating chocolate for health reasons. → She ___." c="gave up eating chocolate for health reasons" a=["gave up eating chocolate for health reasons","She gave up eating chocolate for health reasons.","She gave up eating chocolate for health reasons"] ds=[]
- `m4-u12-phrasal-verbs-tf-005` [transformation, d4]: p="Replace the noun with 'it' and rewrite: Please put away your phone. → Please ___." c="put it away" a=["put it away","Please put it away.","Please put it away"] ds=[]
- `m4-u12-phrasal-verbs-tr-003` [translation, d3]: p="🇩🇪 Kannst du auf meinen Hund aufpassen, waehrend ich weg bin?" c="Can you look after my dog while I'm away?" a=["Can you look after my dog while I'm away?","Can you look after my dog while I'm away","Can you look after my dog while I am away?","Could you look after my dog while I'm away?"] ds=[]
- `m4-u12-phrasal-verbs-tr-004` [translation, d5]: p="🇩🇪 Ich habe die Heizung eingeschaltet, weil mir kalt war, aber mein Bruder hat sie wieder ausgeschaltet." c="I turned on the heating because I was cold, but my brother turned it off again." a=["I turned on the heating because I was cold, but my brother turned it off again.","I turned on the heating because I was cold, but my brother turned it off again","I turned the heating on because I was cold, but my brother turned it off again."] ds=[]
- `m4-u12-phrasal-verbs-sb-002` [sentence-building, d2]: p="Put the words in the correct order: up / picked / I / the / from / book / floor / the" c="I picked up the book from the floor." a=["I picked up the book from the floor.","I picked up the book from the floor","I picked the book up from the floor."] ds=[]
- `m4-u12-phrasal-verbs-sb-003` [sentence-building, d4]: p="Put the words in the correct order: with / a / come / we / up / solution / need / to" c="We need to come up with a solution." a=["We need to come up with a solution.","We need to come up with a solution"] ds=[]
- `m4-u12-phrasal-verbs-mt-002` [matching, d3]: p="Match each phrasal verb with its meaning. 1: pick up 2: give up 3: look after 4: break down 5: come up with 6: set off" c="{\"1\":\"d\",\"2\":\"a\",\"3\":\"f\",\"4\":\"c\",\"5\":\"b\",\"6\":\"e\"}" a=["{\"1\":\"d\",\"2\":\"a\",\"3\":\"f\",\"4\":\"c\",\"5\":\"b\",\"6\":\"e\"}"] ds=["a: stop trying","b: think of an idea","c: stop working","d: collect someone or something","e: start a journey","f: take care of"]
- `m4-u12-phrasal-verbs-qf-002` [question-formation, d4]: p="Your friend is looking for her keys. Ask what time she picked them up last. Start with 'When...'" c="When did you last pick them up?" a=["When did you last pick them up?","When did you last pick them up","When did you pick them up last?"] ds=[]

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
- **g4-u12**: asteroid, astronaut, explosion, orbit, plaque, space shuttle, altogether, atmosphere, crew, disgusting, engineering, mankind, space travel, sunrise, sunset, warning, advert, spacecraft, commercial, demand, multibillion, privately owned, celebrate, depressed, disturb, masterpiece, neither ... nor, reply, biosphere, genetic engineering, gravity, resource, surface, uninhabitable, commander, tiring

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Africans, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Allen, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Ansari, Antarctic, Anthony, Anti, Antonio, Apollo, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Armstrong, Army, Arousing, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Aztecs, Bacon, Bagsley, Baker, Balcony, Barbie, Barcelona, Barker, Barry, Bartholdi, Beast, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Binnie, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Body, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Boyce, Boyne, Bradley, Brazil, Brazilian, Brenda, Brian, Bridge, Brighton, British, Broome, Brown, Bruno, Buckells, Buckingham, Buddy, Bulgaria, Burgers, Busy, Butterfly, Buy, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celeste, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbia, Columbus, Column, Come, Complimenting, Conditional, Continuous, Control, Convention, Cooperative, Costa, Cottrell, Covent, Craig, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Deutschen, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Douglas, Dr, Dracula, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Elizabethan, Ellen, Ellie, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, Englischen, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, Fair, False, Fame, Fang, Far, Faye, Feeling, Felicity, Fell, Fidel, Fido, Fink, Fleming, Flicka, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Greece, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hawking, Hayes, Head, Hedy, Helen, Help, Henry, Herman, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Iceman, Imagine, Imperatives, Inc, India, Indonesia, Indonesian, Infinitiv, International, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Ishmael, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Japanese, Jasmine, Jason, Jasper, Jay, Jeff, Jefferson, Jeffery, Jekyll, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jim, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Jr, Julia, Julian, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katia, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Kwame, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Lauren, Laurie, Lauriston, Lawrence, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Luther, Machu, Madonna, Mail, Malala, Malaysia, Malverns, Manchester, Mandy, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Martin, Marvel, Mary, Matt, Matterhorn, Maun, Max, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Millers, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Nancy, Napa, Natasha, Nathan, National, Natural, Navy, Neil, Neill, Neither, Nelson, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Noble, Nomen, Norman, North, Northern, Norway, Number, Numbers, Oak, Object, Objekt, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Poto, Potter, Prepositions, Present, President, Prez, Priestly, Princess, Prize, Pro, Professor, Project, Protestant, Pulitzer, Pump, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Ready, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricks, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scobie, Scotland, Scott, Scottish, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shmuel, Shrek, Sicily, Sie, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sofia, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Sprecher, Sputnik, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thailand, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trade, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Twain, Types, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willis, Willow, Wilson, Wise, Wolf, Work, Workout, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 12.txt -----
Unit 12 Space
Page 98–99
You learn
about space travel
about living in outer space
how to use phrasal verbs
You can
check facts
talk and write about life in space
write a sequel to a story
Vocabulary 1 Make sure you know what the words in the box mean. Use a dictionary to help you.
a space shuttle
an astronaut
an orbit
explosion
a plaque
an asteroid
Free flow 2 Discuss the questions in pairs. 1 Would you like to travel into space?
Why / Why not?
2 What facts do you know about space travel?
BIST 3 Read the text. Match the titles with the paragraphs. There is one title you won’t use.
1 A day in space
2 When things go wrong
3 Eating in space
4 A message on the moon
5 Paying passengers
6 Who owns space?
Get talking 4 Make notes of 6 facts from the text. Then get together with a partner and test each other.
Who was the first ...?
When did he set foot ...?
Why did the McDonnell Douglas company want to ...?
How often ...?
How much ...?
[Text paragraphs]
🔹 In 1984, the engineering company McDonnell Douglas gave NASA $66,000 to take Charlie Walker, a person who worked for them, on their STS-41D flight to do some research. In 2001, Dennis Tito paid $20 million to become officially the world’s first space tourist.
🔹 A space shuttle takes 90 minutes to orbit the Earth. In these 90 minutes, daylight and night time constantly change for the astronauts. In fact, they see 16 sunsets and 16 sunrises! Altogether, 45 minutes of the journey are spent in daylight, and 45 minutes in the dark.
🔹 Astronauts on the shuttle can choose from about 100 different food items and 50 drinks. However, one word of warning – the taste of food often changes in space and your favourite food on the ground might taste disgusting 200 kilometres above the Earth.
🔹 Everyone knows that Neil Armstrong was the first man to walk on the moon. But did you know that his Apollo 11 mission left a plaque on the moon? It says, Here men from planet Earth first set foot upon the Moon. July 1969, A.D. We came in peace for all mankind.
🔹 Space travel has always been a dangerous business. Two of the most tragic accidents in the last 30 years were the Challenger and Columbia space shuttle disasters. The Challenger exploded after 1 minute of its flight in 1986. In 2003, the Columbia broke up when it re-entered the Earth’s atmosphere. On both flights all seven members of the crew died.
5 Listen to the radio advert and complete the text.
The race for space
Human history is full of stories of explorers who have risked their lives to go places no one has ever been before – from the top of the highest mountain to the bottom of the deepest sea. Would you like to join them? You can win $! ………………… at the same time!
We offer the Ansari X Prize to the first people to build a spaceship that can be used more than once. Interested? These are the rules:
The spaceship must be able to carry … adults.
The spaceship must reach a height of …. This height is where a space orbit begins.
The spaceship must return with no … and no injury to any of the crew.
A second flight must be made within … weeks, using the same spacecraft.
No government … can be used in the project.
Does that sound easy? What are you waiting for?
6 Listen to the radio news and tick the correct options.
1 How high did the spaceship fly?
☐ 110 km
☐ 115 km
☐ 125 km
2 When did the flight take place?
☐ 04/10/2004
☐ 04/11/2004
☐ 14/10/2004
3 What is the main idea behind the Ansari X Prize?
☐ To get to a height of about 100 km.
☐ To get people to develop private space travel.
☐ To fly 3,000 people into space over the next 5 years.
4 Who flew the plane?
☐ Peter Diamandis
☐ Paul Binnie
☐ Brian Binnie
5 Which company wants to use SpaceShipOne for commercial flights?
☐ Virgin Space
☐ Virgin Galaxy
☐ Virgin Galactic
6 How much will a flight into space cost?
☐ $20,000
☐ $200,000
☐ $2,000,000
7 The Ansari X Prize was sponsored by
☐ A man named Paul Allen.
☐ A man named Richard Branson.
☐ Two businessmen.
Page 100–101
7 a The Price is a story about a girl called Emily who loves to paint. Look at the pictures. What kind of things does she paint? Read the first part of the story quickly to check.
b Read the story and answer the questions at the end of each section.
The Price
Emily was a quiet kid. She didn’t say much, even to her mother. Her father was always too busy to listen anyway. She never caused any problems. Her grades at school were good. She got on well with everyone. So her mother never worried. Until the space paintings.
Emily had always loved to paint and she was good at it, too – very good. She spent all her pocket money on paint and paper. When she was seven, she’d started painting. At first it had always been animals, flowers and other things that she saw out of her bedroom window. As she got older, her subjects changed: cars, then people and then sports events. Nothing strange there.
But then one day Emily found something new to paint – scenes of outer space. But these weren’t pictures of Mars or Saturn and its rings. These were paintings of weird and wonderful worlds. They showed alien cities on a planet that had three suns. And there were strange forests where strange animals lived. Emily’s mother sometimes looked at the paintings and although she didn’t know why, she felt a little bit scared. There was something a bit too real about the scenes. She asked her daughter where her ideas came from.
“They’re places I go at night,” she explained.
“What, in your dreams?” she asked.
“Yeah, sort of,” Emily replied.
1 Why was Emily’s mother not worried at first about her daughter?
2 What things had Emily liked to paint at different times in her life?
3 What did Emily say about her ideas for her space paintings?
Emily’s mother wanted to talk to her husband about the pictures, but she didn’t. Emily’s father was a writer. A few years before, he had written a very successful science-fiction series for TV. He was famous and got lots of work. But now people were starting to forget about him, because he hadn’t come up with anything good for a very long time. So he had become depressed. He didn’t want to talk to anyone and he often got angry very quickly if someone disturbed him.
Emily was in her room. She had run out of paint, but she had no pocket money left. She couldn’t disturb her dad. He was in his office and no one was allowed to go in there – not even Emily’s mother. Emily didn’t want to wait, so she picked up some of her paintings and set off for the art shop. She explained to the owner that she needed some paint, but she hadn’t got any money. She asked the man if he wanted to buy some of her space scenes.
“OK,” said the man, “I’ll give you £20 for all four of them.” Emily didn’t think twice. She took the money, bought some paint and ran home.
A few days later, Emily’s dad was walking past the art shop when he stopped and looked in the window. He saw the four paintings that Emily had done and was fascinated by them. He walked into the shop and bought them.
4 Why was Emily’s dad unhappy?
5 Why did Emily go to the art shop?
6 What happened when Emily’s dad saw the paintings?
Emily’s dad took the paintings home and put them on the wall in his office. He sat down in his chair, looked at the paintings and started to write. For the next week, Emily didn’t see him. Her mother saw her dad. Day after day, night after night, he locked himself in his office. All they heard was the sound of him working at his computer. The only time he came out of the office. They had never seen him so happy.
“It’s finished,” he told them. “My masterpiece.”
A week later they were celebrating. The TV studio had loved his ideas for his new series and they were going to start it in a month’s time. A famous Hollywood actor was going to be in it. The series was simply called Alien Worlds.
The next morning, Emily’s mum went into her daughter’s bedroom. There was no sign of Emily. Her mum knew that something was wrong. She shouted for her husband. He came quickly. The window was open. They looked into the garden, but there was no sign of Emily. Then they walked over to the table where Emily usually did her painting. There was a picture lying there.
For some reason they didn’t want to look, but they had to.
It was Emily’s most perfect picture ever – an alien spaceship taking off from Earth. Emily’s father looked at the picture more closely. There at the door was a teenage girl. It was Emily. Emily’s father and mother looked at each other. They knew she was never coming back.
7 What effect did the paintings have on Emily’s dad?
8 Why do you think her parents knew their daughter would never come back?
Page 102–103
8 You are going to read an article about humans living in outer space. In pairs, discuss your ideas about these questions.
1 When might this happen?
2 What are the greatest challenges?
3 Where would we go?
4 Who would be the first humans to go?
5 How might future humans evolve?
6 Why would we want to live in space?
9 Read the text and match the questions in 8 with the paragraphs that answer them.
There are two extra questions.
LIFE IN SPACE – Science-fiction or reality?
There are several answers. Firstly, we’re simply running out of space. There are now more than 7.5 billion people living on our planet and this number is rising every day. There is a danger that one day we’ll use up all of the resources we need to live on our planet. If this happens, we won’t have a choice, we will need to look to outer space for people to live. In fact, the world-famous scientist Stephen Hawking has predicted that we only have another 1,000 years before the Earth will be uninhabitable.
Secondly, human beings have always liked to explore and go further. There are few places on Earth that we haven’t been to. Space is the next great challenge. We already have the technology to take off from our planet and the technology we need to set up homes elsewhere in our solar system is not so far away. Soon there will be nothing to stop us from going to places we once thought were impossible to reach.
There are two options. Our new homes may be enormous spaceships that orbit around the Earth, like the moon. An Austro-Hungarian rocket scientist called Herman Potočnik first had this idea in the 1920s. He imagined huge circular crafts* that rotate to create an artificial gravity*. They would also use a large mirror to focus the sun’s light which could be used for energy. There could be many of these spaceships floating above the Earth, each one inhabited by thousands of people.
The second option is to set up our new homes on other planets or moons. The idea is to build enormous dome-shaped cities called biospheres on the surface and then create the same atmosphere inside them so that people could live inside them. The most likely place that we would set up homes is Mars because it’s the closest planet to us, but there is even the possibility of people living on one of the moons of Jupiter. There are no plans though to find new homes further out in the system because of the enormous amount of time it would take to travel to them.
There are many. One of the biggest would be the need for the new colony to become self-sufficient* – people living there would need to be able to find their own sources of food and water. It would not be possible to send water and food from the Earth. There are the challenges to our bodies. Living in space or with lower levels of gravity can lead to serious problems with bones and muscles. It can increase blood pressure in the head causing bad headaches and problems with the eyes.
And finally we would need to look seriously at how the people living in these new environments might behave. A research project called the Mars-500 was set up to look at this. Six people were locked in a small room for 520 days – the time it would take to travel to the planet. Three of them suffered serious psychological or physical problems.
The big question is would we be able to reproduce* in space? It is likely that over time each colony would start to develop its own culture and possibly start speaking new languages. There would also probably be physical changes. For example, as our bodies adapt to living with lower gravity. We might even use genetic engineering to design new organs that will let us breathe carbon dioxide. With that we mean we could leave the biospheres and start living on the surface of our new planet.
VOCABULARY: craft = Fahrzeug; gravity = Schwerkraft
10 Read the text again. How many of these tasks can you do? Check your answers with a partner. Then listen to the text.
1 The population of Earth is ..................................................... 2 Stephen Hawking thought we can only survive on the Earth for ..................................................... 3 The spaceships that Herman Potočnik talked about were ..................................................... in shape.
4 On Mars we would live in biospheres because
☐ it would be too dangerous to live on the surface of the planet.
☐ we would need to create an atmosphere like Earth’s.
☐ it would be easier to control the experiment.
5 Colonising outside our solar system would be
☐ too expensive.
☐ impractical.
☐ impossible.
6 Food and water would have to come from
☐ the new colony.
☐ Earth.
☐ new technologies.
7 What physical problem might colonists experience?
.........................................................................................................................................................
8 What did the Mars-500 project show?
.........................................................................................................................................................
9 Why might the colonists’ bodies begin to change over time?
.........................................................................................................................................................
VOCABULARY: self-sufficient = autark, selbstversorgend; reproduce = sich vermehren
Page 104–105
11 Discuss in groups.
1 Do you think the colonisation of space will happen in your lifetime? Why (not)?
2 Would you like the idea of living in space? Why (not)?
3 Imagine you had to leave Earth, what would you miss most?
4 You can only take three items, what would they be?
12 CHOICES
Writing for your Portfolio
A Finally life in space is possible. Text (40–70 words) your friends from space and let them know what life in space is like. Write about:
the living conditions
things to do there
the best and worst thing in space
B Remember the story The Price (p. 100/101). How could the story continue? Choose one of these three texts to start and then write your sequel (120–180 words).
Think about:
Who is the main character? (Who are the main characters?)
What will happen to him/her? (them)
What will be the twist*?
Will there be an open ending?
Will there be a final solution?
VOCABULARY: twist – (unerwartete) Wendung
A It was exactly ten years after Emily had left. Her mum and dad were in her room. They hadn’t changed anything and they came here every day to think of their daughter. Suddenly Emily’s mum saw something strange.
B The flight had been long and tiring for Emily, but she was glad to be back in her real world. She landed her spaceship close to the city. The commander was waiting for her at headquarters. “I have an important message for you,” he said.
C Claire, a girl from Emily’s class, was sitting in her room. She wanted to check her emails when suddenly a window popped up on the screen on her computer. “Click here if you want to help a friend,” it said. At first, Claire didn’t want to open it, but then she clicked on the window.
GRAMMAR
Phrasal verbs
How to use it: Im Englischen stehen Präpositionen, die zu einem Verb gehören, häufig nach dem Verb: What are you waiting for?
She spent all her pocket money on paint and paper.
Gelegentlich gibt die Präposition dem Verb eine spezielle Bedeutung: Astronauts can choose from 100 different food items.
The Challenger broke up when it re-entered the Earth’s atmosphere.
When Emily’s mother looked at the paintings, she felt a little bit uncomfortable.
She picked up some of her paintings.
Manchmal erhält das Verb durch die Verwendung einer oder mehrerer Präposition(en) eine völlig andere Bedeutung: We already have the technology to take off from our planet.
She got on well with everyone.
She set off for the art shop.
She’d run out of paint, but she had no pocket money left.
He hadn’t come up with anything good for a long time.
The second option is to set up our new homes on other planets or moons.
Write the phrasal verbs above next to their meanings.
1 start (a journey, a trip)
.............................................................
2 leave the ground and go into the sky
.............................................................
3 to build/make/start a new life/business
.............................................................
4 think of an idea
.............................................................
5 have a relationship with
.............................................................
6 finished completely
.............................................................
Vorsicht: Wie im Deutschen sind Verben auch im Englischen oft mit einer Präposition verbunden. Die Präpositionen sind im Englischen aber häufig anders als im Deutschen, daher musst du die jeweilige Präposition immer mit dem Verb mitlernen.
warten auf / wait for
denken an / think of
[Image description: A cartoon image shows Mr Green dressed in a fur coat and hat, setting off to hunt for bears with binoculars and a large stick. His neighbors are watching from the window looking surprised. Caption: “When Mr Green set off to hunt for bears, his neighbours couldn’t believe their eyes.”]
Page 106
The Mag 7
 UFOs
1 🎧 Watch the story. Cross out the incorrect word(s) and make the correction.
1 Liam shows Jessica the photos on his camera. .................................
 2 The photos on the camera are of ghosts. .................................
 3 Liam’s school bag goes missing from the computer lab. .................................
 4 Lucy has the key to the library. .................................
 5 They tell the headmaster the photos are of a tennis match. .................................
2 Complete the sentences with the missing names.
 Lucy Stern Liam
1 .................................................. believes they’ve got a really big story.
 2 .................................................. leaves the camera in the lab.
 3 .................................................. doesn’t believe the photos are of UFOs.
 4 .................................................. suggests that aliens have taken the camera.
 5 .................................................. tells the headmaster that the photos are of a sports match.
 6 .................................................. is embarrassed by their visit to the headmaster.
Everyday English
3 Complete with the missing phrases. Then practise the dialogues.
 cross my heart  a matter of life and death  don’t just stand there  I might have known.
(Image 1: A teacher is sitting at a desk, speaking to Lucy, Liam, and Stern, who are standing. The teacher is concerned.)
 Teacher: So Lucy, what’s the matter?
 My secretary said it was
 1 ..................................................
(Image 2: A girl is looking frustrated and gesturing. Other students are standing around.)
 Girl: Come on,
 2 ..................................................
 .................................................. Help me look.
(Image 3: A boy is holding something suspiciously. Lucy sits on the floor, looking up.)
 Boy: Is this a trick?
 Lucy: No,
 3 ..................................................
 It’s what I saw.
(Image 4: A girl is frustrated, speaking to two boys.)
 Girl: Oh,
 4 ..................................................
 You two are pathetic!
 Boy (gesturing): But they were here!


----- WB: More 4 WB Unit 12.txt -----
UNIT 12 Space
Page 92–93
Reading 1 Read about three space missions and the statements in the box on page 93. Decide for which mission each statement is TRUE and put a cross ✘ in the correct box. The statement may be correct for more than one mission.
MISSIONS TO SPACE
MISSION: EXPLORER 1 DATE: 1958 WHAT HAPPENED: This was the first time that the United States entered into outer space. This small unmanned satellite was taken out of the Earth’s atmosphere on the Juno 1 rockets and spent 100 days orbiting around the Earth making a study of the cosmic rays in the Van Allen radiation belt. After completing its work, the spacecraft spent another twelve years in space before returning back down towards Earth. As expected though, it never made it to the surface of the planet but broke up into thousands of pieces as it re-entered the Earth’s atmosphere.
MISSION: APOLLO 11 DATE: 1969 WHAT HAPPENED: On July 20th 1969, after ten years of test flights into space, NASA finally realised one of mankind’s biggest dreams when astronauts Neil Armstrong and Buzz Aldrin guided their Eagle lander onto the surface of the moon. After 21 and a half hours the pair returned to join the other member of their crew, Michael Collins, who had waited above them in the command module Columbia. Four days later, after a total time of eight days in space, all three astronauts returned safely to Earth when the spacecraft splashed down in the middle of the Pacific Ocean.
MISSION: CHALLENGER DATE: 1986 WHAT HAPPENED: In 1981, NASA introduced the world to its space shuttles. These were reusable spacecrafts that could make more than one journey into space. The success of the programmes made many people believe that space travel would soon be commonplace. However, this all changed on January 28th 1986, when the Challenger space shuttle spectacularly exploded moments after taking off, killing all seven astronauts on board. It was the first time that NASA had seen people killed since 1967 when three astronauts were killed on the ground in a test for Apollo 1.
Put a cross ✘ to show which statements are TRUE.
This space mission: 1 was a success. 2 had no people on it. 3 changed how people saw space travel. 4 spent just over a week in space.
Boxes to tick: Explorer 1, Apollo 11, Challenger
Listening 2 Listen to a class of children asking questions to astronaut Dr Andrew Wilson and choose the correct answers.
1 Dr Wilson was inspired to become an astronaut
☑ by a real life event.
☑ while watching a film about space at the cinema.
☑ by a professor he had at college.
☑ because he wanted to be famous.
2 The first thing he did when he decided to become an astronaut was
☑ write to NASA.
☑ find out more about the job on his own.
☑ talk to his professor about his dream.
☑ go to college.
3 On his first flight Dr Wilson
☑ had to bring home used parts of the International Space Station.
☑ felt different emotions.
☑ wanted to get back to Earth as quickly as possible.
☑ stayed on the International Space Station for four weeks.
4 The astronaut’s parents
☑ were very surprised when they heard about his career choice.
☑ didn’t think he would make the decision to become an astronaut.
☑ have supported his dream to become an astronaut.
☑ used to read books about space to him before bed.
5 If you want to become an astronaut you have to be
☑ an engineer, a scientist and a doctor.
☑ an engineer or a scientist or a doctor.
☑ an engineer and a scientist, but not a doctor.
☑ an engineer and a scientist, or a doctor.
6 The most important thing you need to become an astronaut is
☑ knowing the right people.
☑ intelligence.
☑ luck.
☑ determination.
VOCABULARY: determination – Entschlossenheit
Page 94–95
Grammar: Phrasal verbs
3 Match the sentence halves.
I don't want to spend any more money ☐ a) at that screen.
It's been five hours now. I don't want to wait ☐ b) from over 50 flavours of ice cream.
It was a terrible accident. The spaceship broke ☐ c) for him any longer!
Come on. You've spent five hours looking ☐ d) up two minutes after take-off.
I love this shop. You can choose ☐ e) up and put it in the bin.
Don't drop litter. Pick your crisp packet ☐ f) on my hobbies.
4 Tick the sentences with phrasal verbs and underline them.
☐ 1 What are you waiting for? Let's go!
☐ 2 Ian doesn't really get on well with anyone in his class.
☐ 3 We've run out of milk. Can you go to the shops and get some?
☐ 4 What are you looking at?
☐ 5 We set off on holiday at 3 a.m.!
☐ 6 I hope you like the present. I spent all my money on it.
☐ 7 We need to come up with a new idea soon.
☐ 8 The plane takes off at 3 p.m.
5 Match five of the sentences above with the pictures below.
1 ______________________________
2 ______________________________
3 ______________________________
4 ______________________________
5 ______________________________
6 Circle the correct words.
I think Molly likes you a lot. You two really seem to be getting on / off well with one another.
Our plan didn't work. I think we'll have to come up / down with some new ideas.
The weather was so bad that the space shuttle could not take out / off yesterday.
We wanted to stay on holiday for three weeks, but we ran on / out of money and had to go home earlier.
When the lights went out, the situation in the street turned around / into real chaos.
If you want to find a good story, there are thousands of books to choose of / from.
7 Complete the sentences with 1–3 words. Make use of phrasal verbs only.
She's really popular. She gets _____________________ everyone.
They ___________________________ early so they should be home soon.
I ___________________________ of money so you can't have an ice cream.
Who came ___________________________ idea? It's terrible!
You have to wear your seat belt when the plane ___________________________ off.
8 Match these phrasal verbs with their meaning. Use a dictionary if necessary.
go out with someone ☐ a) discover (more) about a subject or a person
find out about someone/ ☐ b) buy something (usually when on your way somewhere) something
pick up something ☐ c) spend time with someone (usually doing nothing special)
sort out ☐ d) become someone's boyfriend/girlfriend
hang out ☐ e) have a good relationship with someone
get on well with someone ☐ f) find a solution to a problem
9 Read the dialogue with your partner. Use some of the phrasal verbs in 8 to complete it.
Alex So, are you '__________________________ with Sam, or not?
Jo No. We're just good friends. We just like '__________________________, and having a good time.
Alex I'm not sure Sam sees it that way. I think he's keen on you and I think he's serious.
Jo Don't be silly. What makes you say that?
Alex Well, last night I went to the shops to '__________________________ some milk, and when I got back to my house he was waiting for me.
Jo So?
Alex Well, he asked me if I could '__________________________ what you feel about him. So that's what I'm doing.
Jo Really! Oh no. I mean I really like him. I '__________________________ really well with him, but nothing more than that.
Alex Well, it looks like you've got a problem, and you need to '__________________________ it because he's really keen on you.
10 Complete the sentences with your own ideas.
I find out what's happening with my friends by __________________________.
I get on really well with __________________________ because __________________________.
I like hanging out with my friends because __________________________.
If I need to sort out a problem I usually __________________________.
I set off for school at __________________________.
I usually run out of pocket money because __________________________.
The best idea I ever came up with was __________________________.
Page 96–97
Vocabulary
11 Write the words under the pictures.
space shuttle asteroid orbit astronaut plaque explosion
1 .......................................................... 2 .......................................................... 3 .......................................................... 4 .......................................................... 5 .......................................................... 6 ..........................................................
12 Complete the film summary with the words from above. You may have to change the form of the words.
Once I saw a film called Armageddon which I really liked. I can’t remember exactly what happened but it’s about an 1 .......................................................... that has stopped 2 .......................................................... Earth and is now heading towards the planet. Unless something is done, it’s going to destroy the whole of mankind. Bruce Willis is an 3 .........................................................., I think, who has a plan to fly a 4 .......................................................... (or some other kind of rocket) to land on a giant rock. When they get there, they plan to blow up a huge bomb on it and hope that the 5 .......................................................... will stop it from colliding with Earth. I forgot what exactly happens but, of course, the plan works. Bruce Willis doesn’t make it back to Earth. He is a hero and probably gets a 6 .......................................................... with his name on it so future generations will know what he did. It’s a bit silly but it is very exciting.
Everyday English UFOs
13 Look at the phrases in the box. Use them to complete the dialogues.
Cross my heart a matter of life and death don’t just stand there I might have known
1 A What? You saw a UFO? I don’t believe a word! B .........................................................., Jane. I really did.
2 A Oh, no. There’s water everywhere. Someone left the window open! B Well, .......................................................... Do something about it!
3 A Why are you shouting as if this was ..........................................................? Calm down.
4 B Calm down? How can I calm down when I can’t find my money?
5 A Do you know what the dogs did? They pulled out all the flowers in the neighbours’ garden. B .......................................................... Why didn’t I lock the garden door? I could kick myself!
Developing writing skills Picture story
13 Read the task and what a student wrote. Who is Ms Craig?
Task Look at the pictures below and write the story (120–180 words). Remember to give your story a good title. Write about:
the situation
the solution
the worries
the twist
the (open) ending
Image description: A sequence of six comic-style illustrations. A worried boy talks to the headmaster about his teacher Ms Craig. The headmaster suggests she talk to the boy. The boy and teacher talk. Ms Craig talks to the headmaster. Then Ms Craig and the headmaster watch from behind a window as the boy is escorted to a spaceship. Later, Ms Craig says she hasn’t seen the boy in a week.
The dream Julian woke up, sweating. What a horrible dream! Ms Craig, his favourite teacher, was coming at him – and she was an alien! For five nights Julian dreamt the same dream again and again. So he went to see the headmaster. “Sorry for saying this, sir, but I believe my English teacher is an alien.” And he told him about his dreams. The headmaster smiled. “Don’t worry, Julian, I’ll talk to her,” he said.
“I don’t know why he dreamt this dream,” Ms Craig said. “But we have to do something.” “I know,” the headmaster replied. “So what are you going to do about it?” Ms Craig asked. “We’ll send him off in our spaceship. We need new kids anyway.” The next day they caught Julian after school and late at night they put him into the spaceship. After a week Julian’s friend Stella turned up. “Sir, Julian talked to me about his dreams. He seemed worried. And now I haven’t seen him for more than a week.” “That’s strange. Why don’t you meet me and Ms Craig here in my office at five?”
14 Read the text and put in a / where a new paragraph should be.
Page 98–99
Writing tip:
 When writing a picture story
 • make sure you study the pictures carefully
 • fill in the ‘spaces’ between the pictures
   (e.g. if a step in the story is not clear)
 • give the characters names if possible
 • let your imagination work
 • if possible, include a twist
 • think carefully about paragraphs
 • think of a suitable title
15 Now write your own answer to the following task.
Task
 Look at the pictures below and write the story (120–180 words).
 Remember to give your story a good title. Write about:
  • why the girl wanted a spacesuit  • the setting  • the characters
  • the twist  • the adventure  • the open ending
Image descriptions:
 (1) A girl is celebrating her birthday and has just unwrapped a present—a spacesuit. Her parents stand smiling beside her.
 (2) The girl is wearing the spacesuit and holding a toy shield and sword. A clock shows time has passed.
 (3) She imagines herself on a planet with a rocket and alien landscape in the background.
 (4) She confronts a giant tentacled alien in a dark cave or spaceship setting.
 (5) She and an ally fight a sea creature with lightsabers or glowing swords.
 (6) She runs toward a spaceship on a launchpad.
 (7) The spaceship lies broken in pieces.
 (8) The girl wakes up in bed in the same spacesuit, smiling. A robot toy is on the floor, and space-themed items are in the room.
 (9) Her mother enters the room with a smile.
 (10) The girl, now in bed again, looks up at the ceiling with a dreamy face. A large question mark floats above her head, suggesting wonder or an open ending.
MORE Words and Phrases
No.	Word/Phrase	Example Sentence	Translation
1	asteroid	Most asteroids are found between Mars and Jupiter.	Asteroid
	astronaut	Astronauts travel into space in a spacecraft.	Astronaut/in
	explosion	There were two loud explosions and then the building collapsed.	Explosion
	orbit	The space shuttle stayed in orbit around the Earth.	Umlaufbahn
	plaque	There is a plaque on the moon that says when the first landing took place.	Plakette
	space shuttle	A space shuttle is used to travel between the Earth and a space station.	Raumfähre
3	altogether	Altogether there are 8 planets in our solar system.	insgesamt
	atmosphere	The atmosphere surrounds the Earth and protects it from the sun's rays.	Atmosphäre
	crew	The crew of a spaceship have to train very hard before they can go into space.	Mannschaft, Besatzung
	disgusting	Sorry, but this pizza is disgusting. It tastes horrible.	ekelhaft
	engineering	A spaceship is a fantastic work of engineering.	Maschinenbau, Ingenieurswesen
	mankind	One day mankind might need a new home on another planet.	Menschheit
	space travel	Space travel has made it possible to land on the moon.	Raumfahrt
	sunrise	Sunrise tomorrow is around 6 a.m.	Sonnenaufgang
	sunset	Sunset tomorrow is around 8.30 p.m.	Sonnenuntergang
	warning	There's a warning not to go into the water. There are jellyfish.	Warnung
5	advert	You want to sell your car? I saw your advert in the local newspaper.	Reklame, Anzeige
	spacecraft	In the future there will probably be several kinds of spacecraft to take us into space.	Raumfahrzeug
	commercial	We use the plane for private and commercial flights.	kommerziell
	demand	Tell me why you did that. I demand an answer.	verlangen
	multibillion	It's a very expensive multibillion-dollar project.	Multimilliarden-
	privately owned	The race was won by a privately owned yacht.	im Privatbesitz befindlich
6	celebrate	She wants to celebrate her birthday next weekend.	feiern
	depressed	He and his girlfriend broke up last week. He's miserable and feeling very depressed.	deprimiert
	disturb	I'm sorry to disturb you, but I think you should see this now.	stören
	masterpiece	Her picture was a brilliant piece of art – a masterpiece.	Meisterwerk
	neither ... nor	Neither you nor I will be able to travel to other planets for many years.	weder ... noch
7	reply	She replied to his question immediately.	erwidern, antworten
8	biosphere	The biosphere is the area of the planet where organisms live, including the ground and the air.	Lebensraum, Biosphäre
	genetic engineering	Cloning is an example of genetic engineering.	Gentechnik
9	gravity	It's gravity that makes satellites move around the Earth.	Schwerkraft
	resource	The computer lab is an essential resource for students.	Hilfs-/Mittel, Quelle
	surface	About one third of the Earth's surface is land.	Oberfläche
	uninhabitable	After the earthquake, many of the ruined houses were uninhabitable.	unbewohnbar
12	commander	The commander of the spaceship gave his orders to the crew.	Kommandant/in
	tiring	Shopping all day was very tiring. I'm exhausted!	ermüdend

```

## Output contract

Write `content/corpus/units/g4-u12/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u12",
  "briefBank": "8238afa2164f",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u12.s.phrasal-verbs",
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
