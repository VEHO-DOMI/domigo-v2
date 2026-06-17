# Grammar generation brief — g4-u13 (MORE! 4, Unit 13)

<!-- domigo:gen grammar g4-u13 bank=55d3506ce699 prompt=4b9164076103 -->

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

### `g4u13.s.word-formation` — Prefixes and suffixes (word formation) (Vorsilben und Nachsilben (Wortbildung))

Building new words with affixes: negative prefixes in-/il-/im-/ir-/un- on adjectives, dis- and mis- on verbs, mini- on nouns, and the suffixes -ness (adjective -> noun), -ful (noun -> adjective, 'full of') and -less (noun -> adjective, 'without').

v1 floor for this structure: **40 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [negative-adjective-prefixes]: The prefixes in-, il-, im-, ir- and un- on adjectives mean 'not' or 'the opposite of': correct -> incorrect, legal -> illegal, possible -> impossible, regular -> irregular, fair -> unfair.
  - DE: Die Vorsilben in-, il-, im-, ir- und un- bei Adjektiven bedeuten 'nicht' oder 'das Gegenteil von': correct -> incorrect, legal -> illegal, possible -> impossible, regular -> irregular, fair -> unfair.
  - "It's impossible to finish this today." — "Es ist unmöglich, das heute fertigzustellen."
  - "That answer is incorrect." — "Diese Antwort ist falsch."
- rule [verb-prefixes-dis-mis]: On verbs, dis- means 'not / the opposite of' (agree -> disagree) and mis- means 'badly / wrongly' (understand -> misunderstand). The prefix mini- on nouns means 'small' (skirt -> miniskirt).
  - DE: Bei Verben bedeutet dis- 'nicht / das Gegenteil von' (agree -> disagree) und mis- 'schlecht / falsch' (understand -> misunderstand). Die Vorsilbe mini- bei Nomen bedeutet 'klein' (skirt -> miniskirt).
  - "I completely disagree with you." — "Ich bin völlig anderer Meinung als du."
  - "Don't misunderstand me." — "Missversteh mich nicht."
- rule [suffixes-ness-ful-less]: The suffix -ness turns an adjective into a noun (happy -> happiness). -ful turns a noun into an adjective (care -> careful) - note: only one 'l'. -less turns a noun into an adjective meaning 'without' (hope -> hopeless).
  - DE: Die Nachsilbe -ness macht aus einem Adjektiv ein Nomen (happy -> happiness). -ful macht aus einem Nomen ein Adjektiv (care -> careful) - beachte: nur ein 'l'. -less macht aus einem Nomen ein Adjektiv mit der Bedeutung 'ohne' (hope -> hopeless).
  - "Her kindness surprised everyone." — "Ihre Freundlichkeit überraschte alle."
  - "The situation seemed hopeless, but she remained hopeful." — "Die Situation schien hoffnungslos, aber sie blieb hoffnungsvoll."

common errors:
- Using the wrong negative prefix: ✗ "That's inpossible." → ✓ "That's impossible."
- Spelling -ful with a double l: ✗ "She was beautifull." → ✓ "She was beautiful."
- Confusing -ful (full of) and -less (without): ✗ "Be careless when you cross the road! (meaning: be careful)" → ✓ "Be careful when you cross the road!"

SB box `g4/sb/More 4 SB Unit 13.txt#grammar-1` — Prefixes (Vorsilben):
```
Die Vorsilben in-, il-, im-, ir- oder un- in Adjektiven bedeuten nicht oder das Gegenteil von:
correct – incorrect / legal – illegal / possible – impossible / regular – irregular / fair – unfair
Die Vorsilbe mini- in Nomen bedeutet klein:
skirt – miniskirt / bus – minibus / cam – minicam (cam = camera)
Die Vorsilben dis- in Verben bedeuten nicht oder das Gegenteil von, und mis- bedeutet schlecht:
agree – disagree / understand – misunderstand
Suffixes (Nachsilben)
Die Nachsilbe -ness verändert ein Adjektiv in ein Nomen:
happy – happiness / dark – darkness / blind – blindness
Die Nachsilbe -ful verändert ein Nomen in ein Adjektiv:
success – successful / care – careful / meaning – meaningful / beauty – beautiful
Die Nachsilbe -less verändert ein Nomen in ein Adjektiv und bedeutet ohne:
hope – hopeless / home – homeless / meaning – meaningless
(Image at the bottom shows a man reading a vocabulary list aloud to a dog. The list includes “hope → hopeless, home → homeless, meaning → meaningless.” The dog responds with: “I disagree!”)
```

v1 seed items (UNTRUSTED):
- `m4-u13-word-formation-gf-001` [gap-fill, d1]: p="The opposite of 'happy' is ___." c="unhappy" a=["unhappy"] ds=["dishappy","inhappy","unhappyness"]
- `m4-u13-word-formation-gf-002` [gap-fill, d2]: p="It's ___ (possible) to finish all this homework in one hour." c="impossible" a=["impossible"] ds=["unpossible","inpossible","dispossible"]
- `m4-u13-word-formation-gf-003` [gap-fill, d2]: p="Her ___ (kind) really surprised everyone. She helped all the new students." c="kindness" a=["kindness"] ds=["kindful","kindly","kindment"]
- `m4-u13-word-formation-gf-004` [gap-fill, d3]: p="Be ___ (care) when you cross the street!" c="careful" a=["careful"] ds=["careless","careness","caring"]
- `m4-u13-word-formation-gf-005` [gap-fill, d4]: p="His behaviour was completely ___ (responsible)." c="irresponsible" a=["irresponsible"] ds=["unresponsible","inresponsible","disresponsible"]
- `m4-u13-word-formation-gf-006` [gap-fill, d5]: p="I think you ___ (understand) me. Let me explain again." c="misunderstood" a=["misunderstood"] ds=["disunderstood","ununderstood","misunderstand"]
- `m4-u13-word-formation-mc-001` [multiple-choice, d3]: p="Choose the correct option: 'The children behaved very badly. Their ___ was terrible.'" c="behaviour" a=["behaviour"] ds=["behavement","behaveness","behavetion"]
- `m4-u13-word-formation-mc-002` [multiple-choice, d4]: p="Which word is formed correctly?" c="illegal" a=["illegal"] ds=["inlegal","unlegal","dislegal"]
- `m4-u13-word-formation-mc-003` [multiple-choice, d3]: p="Which word is formed correctly?" c="unhappiness" a=["unhappiness"] ds=["inresponsible","disappolite","unhonest"]
- `m4-u13-word-formation-ec-001` [error-correction, d2]: p="Find and fix the mistake: The homework was unpossible to finish in one hour." c="The homework was impossible to finish in one hour." a=["The homework was impossible to finish in one hour.","The homework was impossible to finish in one hour","It was impossible to finish the homework in one hour."] ds=[]
- `m4-u13-word-formation-ec-002` [error-correction, d3]: p="Find and fix the mistake: She drove very careless and had an accident." c="She drove very carelessly and had an accident." a=["She drove very carelessly and had an accident.","She drove very carelessly and had an accident","She drove carelessly and had an accident."] ds=[]
- `m4-u13-word-formation-ec-003` [error-correction, d4]: p="Find and fix the mistake: The teacher was very unpatient with the noisy students." c="The teacher was very impatient with the noisy students." a=["The teacher was very impatient with the noisy students.","The teacher was very impatient with the noisy students","The teacher was impatient with the noisy students."] ds=[]
- `m4-u13-word-formation-tf-001` [transformation, d2]: p="Your friend asks what the opposite of 'kind' is. Answer in a sentence: 'Her ___ (kind) really upset everyone.'" c="unkindness" a=["unkindness"] ds=[]
- `m4-u13-word-formation-tf-002` [transformation, d3]: p="Describe the road: 'Driving on this road is very ___ (danger). It's really ___ (safe)!'" c="dangerous ... unsafe" a=["dangerous ... unsafe","dangerous, unsafe"] ds=[]
- `m4-u13-word-formation-tf-003` [transformation, d4]: p="Your teacher says your essay needs work: 'Your conclusion is a bit ___ (hope). Try to make it more ___ (hope).'" c="hopeless ... hopeful" a=["hopeless ... hopeful","hopeless, hopeful"] ds=[]
- `m4-u13-word-formation-tr-001` [translation, d3]: p="🇩🇪 Sein Verhalten war unverantwortlich." c="His behaviour was irresponsible." a=["His behaviour was irresponsible.","His behavior was irresponsible.","His behaviour was irresponsible","His behavior was irresponsible"] ds=[]
- `m4-u13-word-formation-tr-002` [translation, d5]: p="🇩🇪 Ihre Freundlichkeit hat mich sehr ueberrascht." c="Her friendliness surprised me a lot." a=["Her friendliness surprised me a lot.","Her friendliness really surprised me.","Her kindness surprised me a lot.","Her friendliness surprised me very much."] ds=[]
- `m4-u13-word-formation-sb-001` [sentence-building, d1]: p="Put the words in the correct order: is / behaviour / completely / his / unacceptable" c="His behaviour is completely unacceptable." a=["His behaviour is completely unacceptable.","His behaviour is completely unacceptable","His behavior is completely unacceptable."] ds=[]
- `m4-u13-word-formation-mt-001` [matching, d3]: p="Match each base word with the correct negative prefix. 1: possible 2: legal 3: regular 4: agree 5: happy 6: spell" c="{\"1\":\"c\",\"2\":\"b\",\"3\":\"d\",\"4\":\"a\",\"5\":\"e\",\"6\":\"f\"}" a=["{\"1\":\"c\",\"2\":\"b\",\"3\":\"d\",\"4\":\"a\",\"5\":\"e\",\"6\":\"f\"}"] ds=["a: dis-","b: il-","c: im-","d: ir-","e: un-","f: mis-"]
- `m4-u13-word-formation-qf-001` [question-formation, d2]: p="Tom's painting was beautiful. Ask about the beauty: 'Did you see the ___ (beautiful) of his painting?'" c="beauty" a=["beauty"] ds=[]
- `m4-u13-word-formation-gf-007` [gap-fill, d1]: p="This exercise is very ___. I can't do it. (possible → NOT possible)" c="impossible" a=["impossible"] ds=["unpossible","dispossible","inpossible"]
- `m4-u13-word-formation-gf-008` [gap-fill, d1]: p="She's very ___. She always thinks about other people's feelings. (care + suffix)" c="careful" a=["careful"] ds=["careness","careless","caring"]
- `m4-u13-word-formation-gf-009` [gap-fill, d2]: p="The ___ of the team surprised everyone. They won every game! (successful → noun)" c="success" a=["success"] ds=["successness","successment","successfulness"]
- `m4-u13-word-formation-gf-010` [gap-fill, d3]: p="Don't be so ___! Everything will be fine. (patience → opposite adjective)" c="impatient" a=["impatient"] ds=["unpatient","dispatient","inpatient"]
- `m4-u13-word-formation-gf-011` [gap-fill, d4]: p="The homework was completely ___. The teacher didn't understand what I wrote. (meaning + suffix → adjective meaning 'without meaning')" c="meaningless" a=["meaningless"] ds=["meaningful","unmeaningful","meaningment"]
- `m4-u13-word-formation-gf-012` [gap-fill, d5]: p="I'm sorry, I completely ___ your instructions. That's why I did it wrong. (understood → prefix for 'wrongly')" c="misunderstood" a=["misunderstood"] ds=["disunderstood","ununderstood","misunderstand"]
- `m4-u13-word-formation-mc-004` [multiple-choice, d2]: p="Which word is correctly formed with a prefix?" c="unhappy" a=["unhappy"] ds=["inhappy","dishappy","mishappy"]
- `m4-u13-word-formation-mc-005` [multiple-choice, d3]: p="Choose the correct word to complete: 'The ___ of his new book was a big surprise.' (publish)" c="publication" a=["publication"] ds=["publishment","publishness","publishable"]
- `m4-u13-word-formation-mc-006` [multiple-choice, d5]: p="Which of these words uses the prefix 'il-' correctly?" c="illegal" a=["illegal"] ds=["ilhappy","ilpossible","ilcorrect"]
- `m4-u13-word-formation-ec-004` [error-correction, d2]: p="Find and fix the mistake: It's very unpossible to finish this in one hour." c="It's very impossible to finish this in one hour." a=["It's very impossible to finish this in one hour.","It's very impossible to finish this in one hour","It's impossible to finish this in one hour."] ds=[]
- `m4-u13-word-formation-ec-005` [error-correction, d3]: p="Find and fix the mistake: Her kindful nature makes everyone feel welcome." c="Her kind nature makes everyone feel welcome." a=["Her kind nature makes everyone feel welcome.","Her kind nature makes everyone feel welcome","Her kindness makes everyone feel welcome."] ds=[]
- `m4-u13-word-formation-ec-006` [error-correction, d4]: p="Find and fix the mistake: I think it's very inresponsible to drive without a seatbelt." c="I think it's very irresponsible to drive without a seatbelt." a=["I think it's very irresponsible to drive without a seatbelt.","I think it's very irresponsible to drive without a seatbelt"] ds=[]
- `m4-u13-word-formation-tf-004` [transformation, d3]: p="Rewrite the sentence using the word in brackets: That word doesn't make any sense. (meaningless) → That word is ___." c="meaningless" a=["meaningless","That word is meaningless.","That word is meaningless"] ds=[]
- `m4-u13-word-formation-tf-005` [transformation, d4]: p="Rewrite using the word in brackets: I don't agree with what you said. (disagree) → I ___ with what you said." c="disagree" a=["disagree","I disagree with what you said.","I disagree with what you said"] ds=[]
- `m4-u13-word-formation-tr-003` [translation, d3]: p="🇩🇪 Sein Verhalten war sehr unhöflich." c="His behaviour was very impolite." a=["His behaviour was very impolite.","His behaviour was very impolite","His behavior was very impolite.","His behaviour was very rude."] ds=[]
- `m4-u13-word-formation-tr-004` [translation, d5]: p="🇩🇪 Seine Sorglosigkeit hat zu einem schweren Unfall gefuehrt." c="His carelessness led to a serious accident." a=["His carelessness led to a serious accident.","His carelessness led to a serious accident","His carelessness caused a serious accident.","His carelessness resulted in a serious accident."] ds=[]
- `m4-u13-word-formation-sb-002` [sentence-building, d1]: p="Put the words in the correct order: is / behaviour / his / unacceptable / totally" c="His behaviour is totally unacceptable." a=["His behaviour is totally unacceptable.","His behaviour is totally unacceptable","His behavior is totally unacceptable."] ds=[]
- `m4-u13-word-formation-sb-003` [sentence-building, d3]: p="Put the words in the correct order: her / the / of / happiness / made / gift / filled / with" c="The gift made her filled with happiness." a=["The gift made her filled with happiness.","The gift filled her with happiness."] ds=[]
- `m4-u13-word-formation-mt-002` [matching, d3]: p="Match each word with its correct negative form. 1: happy 2: possible 3: legal 4: responsible 5: agree 6: understand" c="{\"1\":\"c\",\"2\":\"b\",\"3\":\"d\",\"4\":\"e\",\"5\":\"a\",\"6\":\"f\"}" a=["{\"1\":\"c\",\"2\":\"b\",\"3\":\"d\",\"4\":\"e\",\"5\":\"a\",\"6\":\"f\"}"] ds=["a: disagree","b: impossible","c: unhappy","d: illegal","e: irresponsible","f: misunderstand"]
- `m4-u13-word-formation-qf-002` [question-formation, d4]: p="Your friend says driving without a licence is acceptable. You disagree! Form a question to challenge this: Is it really ___ to drive without a licence? (Use the opposite of 'acceptable')" c="Is it really unacceptable to drive without a licence?" a=["Is it really unacceptable to drive without a licence?","Is it really unacceptable to drive without a licence","Is it really unacceptable to drive without a license?","Isn't it unacceptable to drive without a licence?"] ds=[]

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
- **g4-u13**: best wishes, edition, scuba-diving, water-proof, artist, autograph, chill out, elder, highlight, last but not least, leisure centre, occasionally, apply (for), discipline, honestly, tough, tournament, beggar, coal, legend, ripe, catch up on, get involved with, help out, kill time, make money, take care of, take up, attend

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank, song, band

Harvested proper nouns (≤ this unit): Abigail, Aboriginal, Abraham, Adrian, Adverbs, Africa, African, Africans, Agripina, Ahmed, Airbus, Alan, Albu, Alcatraz, Alessia, Alex, Alice, Alison, Allan, Allen, Alphabet, Alps, Amazon, Amber, Amelia, America, Americans, Amherst, Amish, Amy, Ana, Ancient, Anderson, Andrea, Andrew, Andy, Angeles, Anger, Animal, Anna, Anne, Annette, Annie, Ansari, Antarctic, Anthony, Anti, Antonio, Apollo, Aquarium, Arbeit, Archie, Arconia, Arconians, Arenas, Armstrong, Army, Arousing, Arthur, Articles, Aryan, Asia, Astrid, Atlantic, Auguste, Augustino, Aussage, Australia, Australian, Australiens, Austria, Austrians, Award, Ayers, Aztecs, Bacon, Bagsley, Baker, Balcony, Barbie, Barcelona, Barker, Barry, Bartholdi, Beast, Beatles, Beefeaters, Befehlsformen, Beitrag, Belea, Belfast, Bella, Ben, Benson, Bert, Betty, Between, Beyonc, Bianca, Bilal, Bild, Bilder, Bill, Billy, Binnie, Black, Blackbeard, Blackie, Blarney, Blues, Bluetooth, Bob, Body, Boer, Bolt, Bond, Bondi, Botanic, Botswana, Bottlemen, Box, Boyce, Boyne, Bradley, Brazil, Brazilian, Brenda, Brian, Bridge, Brighton, British, Broome, Brown, Bruno, Buckells, Buckingham, Buddy, Bulgaria, Burgers, Busy, Butterfly, Buy, Caf, Cairn, California, Californian, Californians, Cambridge, Came, Cameroon, Candyman, Canongate, Canterville, Capitan, Card, Caribbean, Carina, Carl, Carla, Carlton, Carol, Carolina, Carolyn, Carter, Castle, Catfish, Cathedral, Celeste, Celia, Celsius, Central, Centre, Chamber, Changing, Chappell, Charles, Charlie, Checking, Chesley, Chester, Chichen, Chichester, Chile, China, Chitabe, Chito, Chloe, Choices, Chris, Christ, Christie, Christine, Christmas, Christopher, Chuck, Cindy, Claire, Clare, Clark, Classroom, Cliffs, Clothes, Clown, Coach, Coldeye, Coldplay, College, Colorado, Columbia, Columbus, Column, Come, Complimenting, Conditional, Continuous, Control, Convention, Cooperative, Costa, Cottrell, Covent, Craig, Creta, Croatia, Crown, Cuckmere, Dad, Dan, Dana, Daniel, Danielle, Danny, Darkman, Darren, Dave, David, Davis, Dawn, Dean, Death, Debbie, Delta, Dempsey, Denver, Derby, Derek, Despereaux, Detergent, Deutschen, Dialog, Dialoge, Diana, Dias, Dick, Diego, Dinge, Directions, Disneyland, Doctor, Doctors, Don, Donabate, Douglas, Dr, Dracula, Dragon, Dragons, Dua, Dublin, Dungeon, Dunkel, Dunning, Dupin, During, Dutch, Earthlings, East, Easter, Eddie, Edgar, Edinburgh, Edison, Edwina, Egypt, Elisabeth, Elizabethan, Ellen, Ellie, Elliot, Elton, Elvira, Emergency, Emily, Emma, Encouraging, Ende, England, Englischen, English, Ereignis, Eric, Erling, Europe, European, Europeans, Eve, Every, Everyone, Excuse, Expressing, Fab, Fahrenheit, Fair, False, Fame, Fang, Far, Faye, Feeling, Felicity, Fell, Ferm, Festival, Fidel, Fido, Fiesta, Fink, Fleming, Flicka, Fluff, Food, Ford, Fr, France, Francisco, Frank, Fred, Freddy, Fund, Gaborone, Gangnam, Gary, Gegenteil, Gegenwart, Geige, George, Georgia, German, Getty, Gillian, Gina, Glendalough, Globe, Golden, Good, Gordon, Grace, Grape, Great, Greece, Green, Greenwich, Grey, Greybeard, Groans, Groats, Guess, Guggenheim, Guildford, Guilfest, Gulbenkian, Haaland, Hadfield, Haiti, Halloween, Hamilton, Hammond, Hanna, Hannah, Harbour, Harper, Harris, Harrison, Harry, Harten, Haven, Hawking, Hayes, Head, Hedy, Helen, Help, Henry, Herman, High, Hilfsverb, Hill, Hmm, Hollywood, Holman, Holmes, Home, Homes, Homework, Hook, Hoople, Hotel, House, Houses, Hudson, Hull, Humor, Hungary, Hunger, Hunt, Hutton, Hyde, Iceman, Imagine, Imperatives, Inc, India, Indonesia, Indonesian, Infinitiv, International, Interview, Interviewer, Ireland, Irish, Irregular, Isaac, Isabel, Ishmael, Italian, Italians, Italy, Itza, Jack, Jackson, Jacob, James, Jamie, Jane, Janeiro, Janet, Japan, Japanese, Jasmine, Jason, Jasper, Jay, Jeff, Jefferson, Jeffery, Jekyll, Jenkins, Jennifer, Jenny, Jensen, Jeremy, Jessica, Jessie, Jewels, Jill, Jim, Jimmy, Jo, Joanna, Joe, John, Johnny, Johnson, Jolly, Jonathan, Jones, Jos, Josh, Joy, Jr, Julia, Julian, Julie, Jun, Jupiter, Jurassic, Just, Justyna, Kansas, Karim, Kate, Katia, Katie, Katy, Kelly, Ken, Kennedy, Kerr, Kids, Kinds, Kingsley, Kitty, Know, Korea, Kukulkan, Kwame, Lady, Lamarr, Lane, Language, Lara, Larissa, Latin, Laura, Lauren, Laurie, Lauriston, Lawrence, Leah, Leeds, Legion, Leicester, Leila, Lemons, Lena, Lenny, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Liberty, Lily, Lincoln, Linda, Linking, Lipa, Lisa, Liszt, Little, Lloyd, Locked, London, Lord, Los, Lucas, Lucy, Luigi, Luke, Lulu, Luna, Luther, Machu, Madonna, Mag, Mail, Malala, Malaysia, Malverns, Manchester, Mandy, Mangani, Mangano, Manila, Manju, Manson, Manubay, Maple, Margaret, Marilyn, Mario, Mark, Marley, Marlo, Marple, Mars, Martello, Martin, Marvel, Mary, Matt, Matterhorn, Maun, Max, Mayan, Maybe, Mead, Megan, Mei, Meridian, Message, Mexican, Mexico, Mia, Michael, Mickey, Mike, Mill, Millennium, Miller, Millers, Mills, Miriam, Miss, Mma, Moher, Moira, Mon, Mongolian, Monica, Monroe, Moqueca, Morgan, Morgue, Morris, Mott, Mount, Mountain, Mousetrap, Mr, Mrs, Ms, Mum, Munich, Murdoch, Murray, Musical, Myers, Nachsilbe, Nancy, Napa, Natasha, Nathan, National, Natural, Navy, Neil, Neill, Neither, Nelson, Netflix, New, Newman, Newtown, Next, Nibbs, Nice, Nick, Nico, Nicolson, Nigel, Nikola, Nina, Nizlopi, Noble, Nomen, Norman, North, Northern, Norway, Numan, Number, Numbers, Oak, Oaks, Object, Objekt, Objekte, Obsessed, Ocean, Odeon, Okavango, Ola, Old, Oliver, Olivia, Olympic, Olympics, Omar, Opera, Order, Ordering, Ordinal, Oscar, Otis, Otises, Oxford, Paige, Palace, Pamplona, Paragon, Pardon, Paris, Parliament, Parsons, Passive, Past, Patricia, Patti, Patxot, Paul, Paula, Paws, People, Pepys, Perth, Peru, Pete, Peter, Pets, Philadelphia, Philip, Philippines, Philosopher, Phoenix, Picchu, Pirates, Plague, Plans, Plants, Plural, Plurals, Pluto, Poe, Pole, Polly, Pop, Portman, Portugal, Possessives, Poto, Potter, Prepositions, Present, President, Prez, Priestly, Princess, Prize, Pro, Professor, Project, Protestant, Pulitzer, Pump, Punta, Put, Radcliffe, Radu, Rain, Rajit, Ramotswe, Ranjit, Rashmi, Raukani, Ready, Really, Rebecca, Rebellion, Recherche, Recyclers, Red, Redwood, Reihenfolge, Renato, Republic, Revision, Revolution, Rica, Richard, Richmond, Richter, Rick, Ricks, Ricky, Ride, Ringo, Rio, Ripper, Robert, Robertson, Rocky, Rome, Ron, Ronald, Rosa, Rose, Rosey, Rosie, Rottnest, Roundstone, Rover, Royal, Ruby, Rue, Russell, Ryan, Sacks, Sacramento, Sadacca, Sadie, Sally, Salma, Salvador, Salzburg, Sam, Samuel, San, Sanderson, Sandra, Sara, Sarah, Saying, School, Schwierigkeiten, Scobie, Scotland, Scott, Scottish, Sean, Seathwaite, Seatoller, Sentence, Seoul, Sessions, Shakespeare, Shannon, Sharon, Sheila, Shelter, Sherlock, Shiva, Shmuel, Shrek, Sicily, Sie, Silben, Silicon, Simon, Sinead, Sir, Skiles, Smith, Society, Sofia, Sophia, Sophie, Sound, South, Southeast, Spain, Spallanzani, Spanish, Sports, Spotify, Spotless, Sprecher, Sputnik, Square, St, Stallone, Star, Start, States, Station, Stern, Steve, Stirling, Stoke, Stop, Stradivarius, Style, Sue, Sugarloaf, Sullenberger, Sully, Sunborn, Superstar, Sure, Susan, Suzy, Svalbard, Swaton, Sweet, Swift, Switzerland, Sydney, Sylvester, Syracuse, Syria, Tacloban, Tag, Take, Tale, Talkie, Tamar, Tamara, Tammy, Tania, Targon, Tasmania, Tate, Taylor, Teen, Tell, Telling, Territory, Tesla, Teterboro, Text, Thailand, Thames, Think, Thomas, Tick, Tim, Titan, Titanian, Titanic, Toby, Tock, Tom, Tony, Trade, Trafalgar, Trapp, Trapps, Trent, Trents, Tricia, Trick, Troin, Troodon, Troodons, Troubles, True, Turan, Turnham, Tussauds, Twain, Types, Uhr, Uluru, Ulysses, Um, Umney, United, Unless, Uros, Use, Vapata, Vasile, Vesuvius, Vicente, Vickery, Vicky, Vienna, Volleyball, Vorsilben, Walk, Walker, Wall, Wallace, Wallis, War, Ward, Wars, Washington, Waterloo, Watson, Way, Weds, Welcome, Well, Wheel, White, Whiteoaks, Whittington, Whodunit, Wilde, Will, William, Williams, Willis, Willow, Wilson, Wimbledon, Wise, Wolf, Work, Workout, World, Wortes, Would, Wow, Wright, Wu, Wyoming, Yeah, Yellowstone, Yolanda, York, Yorkers, Yosemite, Zahlen, Zanzibar, Zealand, Ziel, Zimmer, Zoe, Zukunft

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 4 SB Unit 13.txt -----
Unit 13 A school mag
Page 107–108
You learn
about the Guilfest
about being a ball boy/girl at Wimbledon
about the Mangani festival in India
how to use prefixes and suffixes
You can
talk about your holiday plans
write about a sports event
write an article for a school magazine
Get talking 1 a What’s so great about July? Talk in groups. Use the prompts in the speech bubbles to answer the question.
Speech bubbles:
What makes July great is …
It’s the time when …
I love it when …
There’s nothing better than …
Actually, I don’t really like it because …
b Read the letter from the editor. What summer activities does she mention?
FLY HIGH
Five Oaks Middle School Magazine
What’s so great about July?
The next issue of the school magazine is all about our favourite month – July! And we want to know what makes it so great. Send us your ideas.
JULY AROUND THE WORLD
A letter from the editor
Hi,
Welcome to the new edition of FLY HIGH, the school magazine of Five Oaks Middle School. The last two weeks have been terribly busy for the magazine team, thanks to you. You sent us so many great ideas, photos and texts – a clear sign that making July around the world the topic for this issue was a good choice.
Whenever you decide to read this edition – right now before the end of the school year, or later during the holidays when you’re lying on the beach, climbing in the Himalayas, scuba-diving (sorry, there isn’t a water-proof edition of FLY HIGH), or whatever – enjoy your holidays!
With best wishes from me and the team,
Claire, 4a
2 Imagine your perfect festival. Which five artists/bands would play?
Read the text below quickly and find the names of five artists/bands who played at the Guilfest.
CHILL OUT AT THE GUILFEST
Want some ideas for things to do in July? Here’s my highlight from last July. My elder brother Daniel and I went to the Guilfest in Guildford.
What is it? A three-day festival with six stages. It started on Friday and went on for three days. Great bands! I liked Morning Runner, Nizlopi, Gary Numan, Big Wednesday and Billy Idol best. As for autographs go, I was really successful. I got autographs from John and Luke of Nizlopi and one from Gary Numan. Daniel’s been going to the Guilfest for a couple of years. And know what he told me? The first time Nizlopi came to the Guilfest, they played in a tent with about a thousand people in it. When they’d been playing for some time, they got off the stage and went down in the middle of the crowd. Suddenly two or three people sat down and then everyone else did the same. Daniel says that it was a really special moment. Everyone felt really quiet, and Daniel says he had the feeling that the band were playing just for him.
We camped at the Guilfest and if you have the money, you can rent a camper. And if you get tired of listening to the bands, you can walk over to the Guildford outdoor swimming pool and spend some time there.
Four more things I liked: 1 There’s a big leisure centre nearby. So having a shower’s not a problem.
2 Stoke Park, where the festival’s held, is really beautiful.
3 There was a theatre tent, too. We went to the Guilfest for the music, of course, but it’s nice to have something else to do occasionally.
4 Last but not least, the toilets were clean.
Page 109–110
3 Read the text again carefully and answer the following questions.
1 Who did Olivia go with?
2 How many days does the festival last?
3 Which band did Olivia get autographs from?
4 Where did they stay?
5 What can you do if you get tired of listening to the bands?
6 Where in Guildford is the festival?
4 Read the text. What do these numbers refer to?
☐ 400
☐ 160
☐ 1,500
☐ 14
5 In which paragraphs does James talk about these things? Write numbers in the boxes.
☐ Accidents that can happen to BBGs.
☐ How difficult it is to get a ticket.
☐ How to get into Wimbledon without paying.
☐ How popular Wimbledon is.
☐ Minimum age for BBGs.
☐ How fit BBGs need to be.
☐ How BBGs are chosen.
☐ How being a BBG can help you in later life.
WIMBLEDON FOR FREE
1 Thousands of people would love to get a ticket for the world’s most important tennis tournament at the end of June / beginning of July every year. But only a few of them actually get a chance to see the matches live, for a price of about £1,500 per match!
2 But you can get in for free – honestly! If you’re keen on tennis, know the rules and are in year 10 (so at least 14 years old). Why? Because then you can apply to become a ball boy or girl (a BBG, as they are called) in next year’s tournament. But don’t think it’s easy!
3 About 400 boys and girls apply to become a BBG every year, but only 200 are chosen, after they’ve been for training (four times a week, from mid-February to mid-July). BBGs don’t get paid. But if you’ve been a BBG, it can help later when you’re looking for a job. “If you were a BBG as a teenager, it tells the interviewer that you’ve probably got a lot of discipline,” says Kay Williams, a BBG some years ago herself and now a student at Oxford University.
4 “What’s so difficult about picking up a tennis ball?” you might ask. Sorry, but you have no idea! Being a BBG can be tough. When you apply, for example, you have to show that you can run for twelve minutes and stand still for four minutes!
5 And it can be dangerous! One year, a ball boy broke his leg running into the net during a match. He finished the match and then he was taken to hospital! And don’t forget that in some of the serves, the ball can reach speeds of more than 160 kph. A few years ago, a BBG called Abdulla was hit by a 200 kph serve from champion Pete Sampras. “The crowd let out an ‘Ooooh!’, and it hurt, but I had to smile and keep going,” he said. And in 1995, Tim Henman was disqualified from Wimbledon after hitting a ball at a ball girl’s head!
6 As you can see, there are easier things than being a BBG at Wimbledon. But not many are as interesting!
6 Read the text. Which of these does Nayana not talk about?
☐ How long the Mangani festival lasts.
☐ What people wear in the Mangani festival.
☐ The story behind the Mangani festival.
☐ Where the Mangani festival takes place.
7 Match the sentence halves.
1 Nayana’s grandmother
2 In the Mangani Festival, people carry
3 They also throw
4 Nayana’s mum
5 Karaikal’s husband gave his wife
6 Karaikal was scared because
7 Karaikal told her husband that
8 Nayana wants to see
a a picture of Shiva.
b the people who walk over red-hot coals.
c two mangoes.
d the second mango was a present from Shiva.
e lives in southern India.
f told her the story behind the legend.
g she had given the second mango away.
h ripe mangoes.
FLY HIGH
A FESTIVAL IN SOUTHERN INDIA
Hurray! In July I’m going to visit my grandmother in Pondicherry in southern India. There’s an interesting event there, the Mangani Festival. It lasts for a month. At picture of the god Shiva is carried through the streets and people go to the roof of their houses and throw ripe mangoes. Imagine a ripe mango hitting your head! Wham! Ouch! I asked my mum about the legend behind the festival. Here’s what she told me.
Karaikal Ammayai was the wife of a rich man. One day, her husband got two very good mangoes as a present. He gave them to his wife to keep for him. Then he went to work. A little later, a beggar arrived at the house. (In fact, it was the god Shiva.) Karaikal wanted to give the poor beggar some food, so she gave him some rice and one of the mangoes. When her husband came back from work, he ate the other mango along with his lunch. The mango tasted so good that he wanted the second one. His wife was scared of her husband’s reaction and didn’t know what to do. So she prayed to Shiva and suddenly, there was a mango in her hand. She gave it to her husband and told him that it was a present from Shiva. Her husband didn’t believe her. So she went away and prayed again. And suddenly another mango was in her hands. From that day on, her husband believed whatever his wife said.
Mum said that there’s another festival in July, too. In the other one, people dressed in yellow clothes who haven’t eaten for 40 days walk over red-hot coals. I must really see that, but I don’t think I’ll try it.
See you in September.
Best,
Nayana
Page 111–112
8 Read the two summaries of interviews FLY HIGH did with two students about July. Then listen to the interviews and find the mistakes in the summaries. There are three mistakes in each one.
Vocabulary Holiday plans 9 Use the verbs in the box to complete the phrases. Listen to the interviews again to check.
Verbs in the box:
help, stay, take, catch, go, kill, get involved, make, hang, make, do, take
1 to ......................... plans
2 to ......................... nothing
3 to ......................... out around the house
4 to ......................... out with friends
5 to ......................... up on Netflix series
6 to ......................... some money
7 to ......................... away somewhere for a holiday
8 to ......................... at home
9 to ......................... in a project
10 to ......................... time
11 to ......................... up a new sport
12 to ......................... care of the kids
Free flow 10 Get together with a partner and ask him/her about his/her July. Then switch roles.
Speech bubbles:
What are you up to this July?
I’m not sure yet. I’ve got loads of plans. I might …
FLY HIGH
Amy is very much looking forward to July. For the first week she wants to do nothing at all, even though her mum expects her to take care of her little sister. After chilling out for a week she’s got a summer job lined up for a few weeks. This means she won’t be able to catch up on some Netflix series, but she really quite enjoys her job at the ice cream parlour and she is glad she can earn some money and save up for some clothes. She’ll be going away in August, but doesn’t yet know where.
Adrian is also looking forward to July, because he’ll be off to Scotland. He’s going to be involved in a summer camp project and will be taking care of a group of 12-year-olds. He’ll help out the official camp leaders and go rafting with the kids. He’s looking forward to that because he is a very active person. Every afternoon he has three hours to himself so he won’t have to work all the time. To kill time he’ll be taking up a new sport, taekwondo. Adrian can stay at the camp for free, the course is very cheap and in addition he’ll get some pocket money.
11 CHOICES
Writing for your Portfolio
A You are attending a sports event and it’s the break. Text a friend (40–70 words) and tell him/her about the event. Write about:
what kind of event it is
what the current situation is
what you are looking forward to
B Work in groups. Choose a month that you want to write about. Look at the texts from FLY HIGH in this unit again. Brainstorm possible topics that take place in this month, e.g. important sports events, international festivals, music events, famous people whose birthday it is, etc.
Use the internet, your school library, magazines and books to find information. Then write an article for your school magazine (120–180 words). Make sure you download attractive pictures from the internet.
In your text, include the following:
What is the article about?
What are all the necessary facts?
What is the history of the event?
How has it changed over the years?
What do you like about it?
Why would you like to go there?
(Images on the page include a rock concert, a classical orchestra, a football match, the Queen’s Guard, and a festival crowd throwing coloured powder into the air.)
Page 113–
Sounds right Word stress
12 Listen and mark the stress in the words.
meaningless illegal disagree impossible beautiful irregular incorrect misunderstand
13 Listen again and repeat.
GRAMMAR
Prefixes (Vorsilben)
Die Vorsilben in-, il-, im-, ir- oder un- in Adjektiven bedeuten nicht oder das Gegenteil von:
correct – incorrect / legal – illegal / possible – impossible / regular – irregular / fair – unfair
Die Vorsilbe mini- in Nomen bedeutet klein:
skirt – miniskirt / bus – minibus / cam – minicam (cam = camera)
Die Vorsilben dis- in Verben bedeuten nicht oder das Gegenteil von, und mis- bedeutet schlecht:
agree – disagree / understand – misunderstand
Suffixes (Nachsilben)
Die Nachsilbe -ness verändert ein Adjektiv in ein Nomen:
happy – happiness / dark – darkness / blind – blindness
Die Nachsilbe -ful verändert ein Nomen in ein Adjektiv:
success – successful / care – careful / meaning – meaningful / beauty – beautiful
Die Nachsilbe -less verändert ein Nomen in ein Adjektiv und bedeutet ohne:
hope – hopeless / home – homeless / meaning – meaningless
(Image at the bottom shows a man reading a vocabulary list aloud to a dog. The list includes “hope → hopeless, home → homeless, meaning → meaningless.” The dog responds with: “I disagree!”)
Page 114
The Mag 8
 Sales figures
1 🎧 Watch the story. Complete the sentences with the words in the box. There are four you won’t use.
120  down  Lucy  music column  up  150  horoscope  Jessica  librarian  doctor
1 Sales of The Mag are going .................................................. .
 2 The last issue of the magazine sold .................................................. copies.
 3 Miss Elliot is the school .................................................. .
 4 Liam suggests putting a .................................................. in the magazine.
 5 Nick wants to do a .................................................. in the magazine.
 6 In the end, .................................................. gets a really good idea.
2 Answer the questions.
1 Why is Lucy worried? .............................................................................................................................................
 2 Why don’t they want to do another raffle? ........................................................................................................
 3 What does Miss Elliot think? ..................................................................................................................................
 4 Why doesn’t Jessica think Stern would be a good agony uncle? ...................................................................
 5 Why doesn’t Stern think Nick would be a good music critic? .........................................................................
Everyday English
3 Complete with the phrases in the box. Then practise the dialogues.
Leave it out  The penny’s dropped  I doubt it  You must be joking
(Image 1: Jessica and Stern are standing and talking in a classroom. Stern is speaking seriously, Jessica looks surprised.)
 Stern: I’d want to be an agony uncle.
 Jessica: You?! 1 ..................................................
(Image 2: Lucy and Stern are sitting at a desk. Stern is speaking. Lucy looks surprised.)
 Stern: So sales are going down.
 Lucy: Wow. 2 ..................................................
(Image 3: A teacher is standing and talking to Stern and Lucy, who are seated. They look like they’re in a discussion.)
 Teacher: 3 .................................................. you two. We need ideas here.
(Image 4: Jessica, Stern, and Lucy are sitting and talking in a classroom. Jessica is gesturing with her hands.)
 Jessica: Maybe they don’t want a magazine any more.
 Lucy: 4 ..................................................!


----- WB: More 4 WB Unit 13.txt -----
UNIT 13 – A school mag
Page 100–101
Reading 1 Read the text as quickly as possible. What kind of text is it? Say what in the text made you sure of the text type. Then read the text carefully.
☐ an email ☐ a blog ☐ a magazine article ☐ a letter in a magazine
TOM WILKINSON MONDAY, 6TH JULY
1 As most of you know, I don’t like running. I never go jogging and I wouldn’t run a marathon even if I was paid to. But one thing that would make me run for my life: several hundred bulls chasing after me!
2 Running away from bulls: that’s exactly what people are coming here to do tomorrow. (And to be fair – they’re not running away from hundreds of bulls but from ‘only’ six fighting bulls.) I’m at the San Fermín Fiesta in Pamplona, Spain. It lasts for a week during July, when the city is full of red and white flags. Red and white are the official colours of the festival, which first took place more than 500 years ago.
3 Before the bull ring was built, bull fights were held in a large square in the city. Running ahead of the bulls started when the bulls had to be moved from outside the city to the bull ring.
4 Anyone who wants to take part in the run has to enter the special area by 7.30 a.m. The gates are then closed. Just before 8 a.m., the runners ask the statue of San Fermín to protect them. At 8 o’clock, two rockets are fired. With the first rocket, the gates are opened and with the second, the bulls are set free to run. They chase the runners down the length of the bull run, which is about 800 metres. The whole thing lasts for about two to three minutes.
5 It sounds easier than it is. You can’t just run straight ahead – the route goes up and down and there are only five places for runners to hide. The end of the run, just before the bulls enter the ring, is one of the most dangerous spots – runners have fallen here, and have hurt themselves, or even died when bulls are killed. Actually, more than a dozen people have been killed since 1925.
6 Don’t worry if you’re reading this, Mum – nobody under 18 is allowed to take part. I’ll be watching from the balcony of our hotel!
7 And don’t forget – there are also quite a few protesters who are totally against cruelty* to animals, especially bullfighting. (The running of the bulls is always followed by bullfights in the late afternoon.) Their numbers are growing, but still many locals and tourists are enjoying the fiesta. I’ve read somewhere that more than a million people attend every year.
8 The fiesta is especially popular with American tourists because the famous writer Ernest Hemingway made Pamplona the setting for his novel The Sun Also Rises (1926; later called Fiesta).
VOCABULARY: cruelty – Quälerei
2 How many of these tasks can you do? Check your answers with a partner.
1 Tom’s favourite sport is jogging. T / F
2 This year’s run is on July 7th. T / F
3 The fiesta is more than 100 years old. T / F
4 If you want to run, you have to go to a special place ………………………………………
5 In the narrow streets there aren’t many places to ………………………………………
6 There’s the risk of ………………………………………
7 Why is Tom addressing his mother? …………………………………………………………………………………
8 Is everyone happy about the Pamplona fiesta? Why (not)? …………………………………………………………………………………
9 Why do American tourists come to the fiesta in Pamplona? …………………………………………………………………………………
Listening
3 Match the words and the definitions.
1 rarity .................... ☐ a to tell people about something officially
2 announce ............ ☐ b to find and correct mistakes in a text before it is printed
3 make an effort .... ☐ c a typical quality, or important part of something
4 regular ................. ☐ d something unusual
5 proofreading ...... ☐ e someone who often goes to a particular shop, restaurant, etc.
6 feature ................ ☐ f to try hard
4 Listen to the interview with Joanna and Aryan, who are the editors of a school magazine, and answer the questions below.
1 What is so special about the school magazine? ............................................................................................
2 What are its online features? .........................................................................................................................
3 Why do they still print it? (2 reasons) ...........................................................................................................
4 Why do the editors have to wait so much? ..................................................................................................
5 How do they finance the paper? ....................................................................................................................
6 How does the teacher help the team? ..........................................................................................................
7 Why do they sometimes get a lesson off? ....................................................................................................
8 What are some of the things discussed in the next paper? (2 examples) ..................................................
9 Why are they organising a workshop on speed reading? (2 reasons) ......................................................
Page 102–103
Grammar – Prefixes and suffixes
5 Write the opposites of the adjectives.
1 correct _________________________ 2 polite _________________________ 3 meaningful _________________________ 4 legal _________________________ 5 possible _________________________ 6 fair _________________________ 7 friendly _________________________ 8 successful _________________________
6 Complete each sentence with the opposite of one word from the box.
possible friendly legal fair successful understanding agree meaningful
1 You could never be a waiter. You’re much too _________________________ . 2 I think they’re a great band, but all my friends _________________________ . 3 I thought she said 6 o’clock, but she said 7 – it was a _________________________ . 4 Me? Run a marathon in under three hours? That’s _________________________ ! 5 He opened a shop, but it was completely _________________________ . 6 My brother won’t let me watch my favourite TV programme. I think it’s really _________________________ . 7 The words to this song are crazy – they’re just _________________________ . 8 The police arrested him because what he’d done was _________________________ .
7 What are the opposites of these adjectives? Write them in sentences that show their meanings.
clear credible patient regular tasteful
1 ........................................................................................................................................................................ 2 ........................................................................................................................................................................ 3 ........................................................................................................................................................................ 4 ........................................................................................................................................................................ 5 ........................................................................................................................................................................
8 Look at the words in the box. Add -ness, -ful or -less where appropriate and complete the sentences.
sad dark happy home success blind hand hope meaning
1 There was so much _________________________ in his voice that I started to cry. 2 No idea what she wanted to tell me – what she said was pretty _________________________ . 3 All this praise* filled me with _________________________ . 4 I grabbed a _________________________ of apples and ran. 5 We’ve got to collect some money for the _________________________ people in our street. 6 When _________________________ fell, we noticed that we hadn’t got any torches. 7 For a moment we were both struck with _________________________ from the flash. 8 He was only 24, but he was already a very _________________________ businessman. 9 The situation looks pretty _________________________ to me. And I don’t think we’ve got a chance of winning.
VOCABULARY: praise – Lob
9 Fill in the correct forms of the dis- words in the box.
dislike disappoint disappear disagree disqualify disable distrust
1 I’m very _________________________ about the results of your Maths tests. 2 I don’t _________________________ Jim, but he’s not a very easy person to get on with. 3 In the final race three runners _________________________ . 4 My dad _________________________ most of what politicians say. 5 In the near future more and more animals will _________________________ from our planet. 6 We have to _________________________ all the computers, there’s a virus we can’t delete. 7 I strongly _________________________ with what you’re saying.
Page 104–105
Vocabulary
10 Complete the poem with the words in the box.
time nothing sport work brother project money house away friends plan home
The weekend’s here and it’s time to make a 1 ____________________________ . To use my time the best I can. Make some 2 ____________________________ ? Take up a new 3 ____________________________ ? Neither of those – time’s too short. I could catch up on some 4 ____________________________ from school. But no work at the weekend – that’s my rule. Hang out with my 5 ____________________________ – could be fun, But it’s raining outside – there’s no sign of sun. One thing’s for sure, I’ll keep away from my mother. She’ll only want me to take care of my 6 ____________________________ , Or help out doing things around the 7 ____________________________ . I better keep quiet – quiet as a mouse. I could kill some 8 ____________________________ watching TV, But nothing that’s on seems fun to me. And I’m tired of playing games on my phone. And I can’t go 9 ____________________________ , I’ve got to stay 10 ____________________________ . Get involved in a 11 ____________________________ – but what would it be? And now all this thinking is tiring me. It’s tiring me and getting to my head. I think I’ll do 12 ____________________________ – and stay in bed.
11 Look at the poem in 10 again. Then try to make three plans each for
a) a perfect weekend. 1 ____________________________ 2 ____________________________ 3 ____________________________
b) a nightmare weekend. 4 ____________________________ 5 ____________________________ 6 ____________________________
Developing writing skills – A magazine article
12 Read the task and what a student wrote. What was the last song Elton John played?
Task You were asked to write an article about a concert you’ve been to (120–180 words). Write about: • who you saw • why you went there • what the concert was like • some of the highlights • the reaction of the audience • a punchline ending
KEEP THE HITS COMING
Elton John? For the oldies, definitely! The man’s been around for more than 50 years, longer than even my parents can remember. Still, they took me since they’re big fans. I only really knew him from his appearance in Kingsman 2, The Golden Circle, but I have to admit: most of the 2 ½ hours he was playing were amazingly awesome. He walked onto the stage with “Funeral for a Friend” playing over the speakers. Then he sat down at his piano and played hit after hit. He had to look wonderful dressed in a sparkling black suit and a blue shirt. He even listened to requests from the audience and played what they wanted right away. “Bennie and the Jets” and “Daniel” were particularly good. He must be more than 70 but Elton John can still move those fingers up and down the piano keys as quickly as anyone. He finished off the main set with “Saturday Night’s Alright for Fighting”, while all the band members joined in for the grand ending. With just a two-song encore, John ended the night with the crowd dancing to “Crocodile Rock”. A smashing success! What a show!
Language tip: Adding emphasis
You can help bring your writing alive by using emphasis to highlight the good and bad points. Here are some techniques to help you do this: • use a short alliterative adjective (starting with the same letter or sound) and noun phrase: sparkling suit • use a What a ... ! phrase • use extreme adjectives: absolutely brilliant, completely amazing, ... • use an extra auxiliary to stress what you’re saying: do like / did think
Page 106–107
13 Look through the review again. Find and write down an example of:
a short alliterative adjective and noun phrase _______________________
a What a ... ! phrase _______________________
an extreme adjective _______________________
an extra auxiliary _______________________
Writing tip:
Writing a review
always think about who your readers are
brainstorm your ideas before you start writing
get their attention with a catchy headline
get their attention with a snappy* introduction
mention examples/highlights
sometimes put in a quote
make it easy to read
find a good (punchline) ending
VOCABULARY: *snappy - schmissig
14 Now write your own answer to the following task.
Task
Write a review of an event (a music show, sports match, play, etc.) for your school magazine (120-180 words). Consider:
what the event was
why you went there
what it was like
the best/worst part of it
the reaction of the audience
punchline ending
Everyday English Sales figures
DV Complete the dialogue with the expressions from the box.
leave it out    the penny's dropped    I doubt it    You must be joking
A: So, you don't want to be one of the Pretties? Do you think they'll let you go?
B: _______________________. They're hunting down everybody who doesn't want an operation.
A: You mean they make you have the operation? You have no choice? You can't _______________________?
B: So, _______________________. You finally understand.
A: _______________________! Why should I believe you and your friends anyway?
B: You don't have to. It's your choice.
MORE Words and Phrases
English	Example	German
best wishes	I sent her a birthday card with best wishes from us all.	mit den besten Wünschen
edition	The latest edition of the book has new photos and a longer introduction.	Ausgabe
scuba-diving	Last year we went scuba-diving in California.	(Sport-)Tauchen
water-proof	My feet are wet. And I thought my new shoes were water-proof!	wasserdicht
artist	He's a well-known recording artist.	Künstler/in
autograph	I saw Madonna and asked her for her autograph.	Autogramm
chill out	I feel really tired after the race. I need to chill out at home for a few hours.	relaxen, sich entspannen
elder	My elder brother is 19. I'm 15.	älter
highlight	Our holiday in California was the highlight of the year for the whole family.	Höhepunkt
last but not least	That was today's news. And now, last but not least – the weather.	nicht zuletzt
leisure centre	Let's go down to the leisure centre and have a game of table tennis.	Freizeitzentrum
occasionally	There's an ice cream parlour on the corner. We go there occasionally in the summer.	ab und zu; hin und wieder
apply (for)	If you want the job, you'll have to apply immediately.	sich bewerben (für)
discipline	To be successful in any sport, you need skill and discipline.	Disziplin
honestly	I didn't know. Honestly, I didn't.	ehrlich
tough	Life is tough at the moment. I don't have any pocket money left.	hart; schwierig
tournament	Who won the tennis tournament this year?	Turnier
beggar	There was a poor beggar on the street who asked me for money.	Bettler/in
coal	We burn oil, wood or coal to heat our homes in winter.	Kohle
legend	The legend tells us that one day King Arthur will return to save the world.	Legende
ripe	I love strawberries, but they must be ripe.	reif
catch up on	She reads the newspaper on Sunday morning to catch up on the news.	aufholen (Versäumtes); nachholen
get involved with	This is too dangerous. I am not getting involved.	sich auf etw einlassen; mitmischen (bei)
help out	I sometimes help out in the kitchen.	(aus-)helfen
kill time	We killed time watching the boats on the river.	sich die Zeit vertreiben
make money	She's making a lot of money with her job.	Geld machen/verdienen
take care of	Don't worry about your broken ankle. I'm going to take care of you.	Acht geben auf; sorgen für
take up	He did not want to take up a new sport. He had too much to do.	anfangen
attend	How many people attended the baseball game?	an etw teilnehmen; etw besuchen

```

## Output contract

Write `content/corpus/units/g4-u13/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g4-u13",
  "briefBank": "55d3506ce699",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g4u13.s.word-formation",
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
