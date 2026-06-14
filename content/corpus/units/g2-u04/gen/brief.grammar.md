# Grammar generation brief — g2-u04 (MORE! 2, Unit 4)

<!-- domigo:gen grammar g2-u04 bank=072502363e27 prompt=4b9164076103 -->

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

### `g2u04.s.as-as` — as ... as / not as ... as (as ... as / not as ... as (Gleichheit))

Expressing that two things are equal with as + adjective + as, and that they are not equal with not as ... as.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [as-as-equal]: Use as + adjective (base form) + as to say that two things, animals or people are the same in some way.
  - DE: Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß oder klein sind), verwendest du as ... as.
  - "It was as small as a mouse." — "Es war so klein wie eine Maus."
  - "It was as dangerous as a snake." — "Es war so gefährlich wie eine Schlange."
- rule [not-as-as]: Use not as + adjective + as to say the first thing has less of the quality than the second.
  - DE: Wenn sie sich nicht gleichen, verwendest du not as ... as - das Erste hat dann weniger von der Eigenschaft als das Zweite.
  - "The female golden toad is not as colourful as the male animal." — "Die weibliche Goldkröte ist nicht so bunt wie das männliche Tier."
  - "A leopard is not as fast as a cheetah." — "Ein Leopard ist nicht so schnell wie ein Gepard."

common errors:
- Using so ... as instead of as ... as (L1 transfer): ✗ "She is so fast as a cheetah." → ✓ "She is as fast as a cheetah."
- Using the comparative form between as ... as: ✗ "He is as taller as his dad." → ✓ "He is as tall as his dad."
- Using like instead of the second as: ✗ "She is as fast like a cheetah." → ✓ "She is as fast as a cheetah."

SB box `g2/sb/More 2 SB Unit 4.txt#grammar-1` — Comparatives:
```
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m2-u4-as-as-gf-001` [gap-fill, d1]: p="My bike is ___ your bike. They are the same speed." c="as fast as" a=["as fast as"] ds=["so fast as","as faster as","as fast like"]
- `m2-u4-as-as-gf-002` [gap-fill, d1]: p="Tom is ___ his brother. They are the same height." c="as tall as" a=["as tall as"] ds=["so tall as","as taller as","as tall like"]
- `m2-u4-as-as-gf-003` [gap-fill, d2]: p="This pizza is ___ that one. I like both!" c="as good as" a=["as good as"] ds=["so good as","as better as","as good like"]
- `m2-u4-as-as-gf-004` [gap-fill, d3]: p="The test was ___ I expected. It was easier!" c="not as hard as" a=["not as hard as","not as difficult as"] ds=["not so hard as","not as harder as","as not hard as"]
- `m2-u4-as-as-gf-005` [gap-fill, d4]: p="My cat is ___ your dog. They both weigh 5 kg." c="as heavy as" a=["as heavy as"] ds=["so heavy as","as heavier as","as heavy like"]
- `m2-u4-as-as-gf-006` [gap-fill, d5]: p="This homework isn't ___ yesterday's homework. Yesterday's was more difficult." c="as difficult as" a=["as difficult as","as hard as"] ds=["so difficult as","as more difficult as","as difficult like"]
- `m2-u4-as-as-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="She is as clever as her sister." a=["She is as clever as her sister."] ds=["She is so clever as her sister.","She is as cleverer as her sister.","She is as clever like her sister."]
- `m2-u4-as-as-mc-002` [multiple-choice, d3]: p="Which sentence uses 'not as...as' correctly?" c="The blue car is not as expensive as the red one." a=["The blue car is not as expensive as the red one."] ds=["The blue car is not so expensive as the red one.","The blue car is as not expensive as the red one.","The blue car is not as more expensive as the red one."]
- `m2-u4-as-as-mc-003` [gap-fill, d5]: p="Choose the correct option: The maths test was ___ the English test." c="not as easy as" a=["not as easy as"] ds=["not so easy as","not as easier as","as not easy as"]
- `m2-u4-as-as-ec-001` [error-correction, d2]: p="Find and fix the mistake: She is so tall as her mum." c="She is as tall as her mum." a=["She is as tall as her mum.","She is as tall as her mum","as tall as"] ds=[]
- `m2-u4-as-as-ec-002` [error-correction, d3]: p="Find and fix the mistake: This bag is as cheaper as that one." c="This bag is as cheap as that one." a=["This bag is as cheap as that one.","This bag is as cheap as that one","as cheap as"] ds=[]
- `m2-u4-as-as-ec-003` [error-correction, d4]: p="Find and fix the mistake: My phone is as good like yours." c="My phone is as good as yours." a=["My phone is as good as yours.","My phone is as good as yours","as good as"] ds=[]
- `m2-u4-as-as-tf-001` [transformation, d3]: p="You and your friend are racing. The dog is slower than the cat. Describe it differently: 'The dog is ___.'" c="not as fast as the cat" a=["not as fast as the cat","not as fast as the cat."] ds=[]
- `m2-u4-as-as-tf-002` [transformation, d4]: p="Lisa and Anna measured their height. They're both 150 cm! Tell your mum: 'Lisa is ___.'" c="as tall as Anna" a=["as tall as Anna","as tall as Anna."] ds=[]
- `m2-u4-as-as-tf-003` [transformation, d4]: p="You're comparing bedrooms with your friend. Your room is smaller. Say: 'My room is ___.'" c="not as big as your room" a=["not as big as your room","not as big as your room.","not as large as your room"] ds=[]
- `m2-u4-as-as-tr-001` [translation, d3]: p="🇩🇪 Mein Bruder ist so groß wie mein Vater." c="My brother is as tall as my father." a=["My brother is as tall as my father.","My brother is as tall as my father","My brother is as tall as my dad.","My brother is as tall as my dad"] ds=[]
- `m2-u4-as-as-tr-002` [translation, d5]: p="🇩🇪 Das Buch ist nicht so spannend wie der Film." c="The book is not as exciting as the film." a=["The book is not as exciting as the film.","The book is not as exciting as the film","The book isn't as exciting as the film.","The book isn't as exciting as the film","The book is not as exciting as the movie.","The book isn't as exciting as the movie.","The book isn't as exciting as the movie"] ds=[]
- `m2-u4-as-as-sb-001` [sentence-building, d2]: p="Put the words in the correct order: as / is / my / old / as / your / cat / cat" c="My cat is as old as your cat." a=["My cat is as old as your cat.","My cat is as old as your cat"] ds=[]
- `m2-u4-as-as-mt-001` [matching, d1]: p="Match the beginnings with the correct endings: 1) She is as old  2) He isn't as strong  3) The test was as easy  4) This pizza isn't as tasty" c="{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"a\",\"3\":\"d\",\"4\":\"b\"}"] ds=["a: as his father.","b: as the one we had yesterday.","c: as my brother.","d: as I expected."]
- `m2-u4-as-as-qf-001` [question-formation, d4]: p="Tom is as old as Lucy. Ask about: Lucy's age compared to Tom's." c="Is Lucy as old as Tom?" a=["Is Lucy as old as Tom?","Is Lucy as old as Tom"] ds=[]

### `g2u04.s.comparatives` — Comparatives (Komparativ (Vergleichsstufe))

Comparing two different things with -er + than for short adjectives, more + adjective + than for long ones, and the irregular forms better and worse.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [short-er-than]: When comparing two different things, use than. One-syllable adjectives and two-syllable adjectives ending in -y, -le or -ow add -er.
  - DE: Wenn du zwei Dinge vergleichst, die verschieden sind, verwendest du than. An Adjektive mit einer Silbe und an zweisilbige Adjektive auf -y, -le und -ow hängst du -er an.
  - "He's older than me." — "Er ist älter als ich."
  - "She's faster than me." — "Sie ist schneller als ich."
- rule [comp-spelling]: Watch the spelling: hot - hotter, big - bigger, fat - fatter (double the final consonant); heavy - heavier, angry - angrier (-y becomes -ier).
  - DE: Achte auf die Schreibweise: hot - hotter, big - bigger, fat - fatter (Endkonsonant verdoppeln); heavy - heavier, angry - angrier (-y wird zu -ier).
  - "It's hotter today than yesterday." — "Heute ist es heißer als gestern."
  - "The whale is bigger than a dolphin." — "Der Wal ist größer als ein Delfin."
  - "An elephant is heavier than a mouse." — "Ein Elefant ist schwerer als eine Maus."
- rule [long-more-than]: Adjectives with more than two syllables (dangerous, difficult, interesting ...) use more + adjective + than.
  - DE: Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting ...), verwendest du more + Adjektiv + than.
  - "The book is more interesting than the film." — "Das Buch ist interessanter als der Film."
- rule [comp-irregular]: Irregular comparatives must be learnt by heart: good - better, bad - worse.
  - DE: Ausnahmen musst du auswendig lernen: good - better, bad - worse.
  - "He was better than Jeff." — "Er war besser als Jeff."
  - "I'm bad at football, but he's worse than me!" — "Ich bin schlecht im Fußball, aber er ist noch schlechter als ich!"

common errors:
- Using more with short adjectives: ✗ "A lion is more fast than a turtle." → ✓ "A lion is faster than a turtle."
- Double comparative (more + -er): ✗ "She is more bigger than her sister." → ✓ "She is bigger than her sister."
- Regularising irregular comparatives: ✗ "She is gooder at sports." → ✓ "She is better at sports."
- Forgetting to double the final consonant: ✗ "The elephant is biger than the horse." → ✓ "The elephant is bigger than the horse."

SB box `g2/sb/More 2 SB Unit 4.txt#grammar-1` — Comparatives:
```
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m2-u4-comparatives-gf-001` [gap-fill, d1]: p="A cheetah is ___ (fast) than a horse." c="faster" a=["faster"] ds=["more fast","fastest","more faster"]
- `m2-u4-comparatives-gf-002` [gap-fill, d1]: p="My sister is ___ (tall) than me." c="taller" a=["taller"] ds=["more tall","tallest","more taller"]
- `m2-u4-comparatives-gf-003` [gap-fill, d2]: p="This bag is ___ (heavy) than that one." c="heavier" a=["heavier"] ds=["more heavy","heavyer","more heavier"]
- `m2-u4-comparatives-gf-004` [gap-fill, d3]: p="The elephant is ___ (big) than the horse." c="bigger" a=["bigger"] ds=["biger","more big","more bigger"]
- `m2-u4-comparatives-gf-005` [gap-fill, d3]: p="Science is ___ (interesting) than geography, I think." c="more interesting" a=["more interesting"] ds=["interestinger","most interesting","more interestinger"]
- `m2-u4-comparatives-gf-006` [gap-fill, d4]: p="My brother is ___ (good) at maths than I am." c="better" a=["better"] ds=["gooder","more good","more better"]
- `m2-u4-comparatives-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="Dogs are friendlier than cats." a=["Dogs are friendlier than cats."] ds=["Dogs are more friendly than cats.","Dogs are friendlyer than cats.","Dogs are more friendlier than cats."]
- `m2-u4-comparatives-mc-002` [multiple-choice, d3]: p="Which sentence about the weather is correct?" c="The weather is worse today than yesterday." a=["The weather is worse today than yesterday."] ds=["The weather is worser today than yesterday.","The weather is more bad today than yesterday.","The weather is more worse today than yesterday."]
- `m2-u4-comparatives-mc-003` [multiple-choice, d5]: p="Which sentence about a school exercise is correct?" c="This exercise is more difficult than the last one." a=["This exercise is more difficult than the last one."] ds=["This exercise is difficulter than the last one.","This exercise is more difficulter than the last one.","This exercise is most difficult than the last one."]
- `m2-u4-comparatives-ec-001` [error-correction, d3]: p="Find and fix the mistake: A lion is more fast than a turtle." c="A lion is faster than a turtle." a=["A lion is faster than a turtle.","A lion is faster than a turtle","faster"] ds=[]
- `m2-u4-comparatives-ec-002` [error-correction, d4]: p="Find and fix the mistake: She is more bigger than her sister." c="She is bigger than her sister." a=["She is bigger than her sister.","She is bigger than her sister","bigger"] ds=[]
- `m2-u4-comparatives-ec-003` [error-correction, d5]: p="Find and fix the mistake: He is gooder at football than his brother." c="He is better at football than his brother." a=["He is better at football than his brother.","He is better at football than his brother","better"] ds=[]
- `m2-u4-comparatives-tf-001` [gap-fill, d2]: p="You're comparing two friends in PE class. Tom is tall, Ben is short. Tell your teacher: 'Tom is ___ Ben.'" c="taller than" a=["taller than","taller than Ben"] ds=["taller as","tallest","more taller"]
- `m2-u4-comparatives-tf-002` [gap-fill, d4]: p="You're talking about school subjects with a friend. You find English easy but maths hard. Say: 'Maths is ___ English.'" c="more difficult than" a=["more difficult than","more difficult than English","harder than"] ds=["more difficult as","difficulter than","most difficult than"]
- `m2-u4-comparatives-tf-003` [gap-fill, d3]: p="You're comparing your grades with your friend. Your English grade is bad, your maths grade is good. Say: 'My English grade is ___ my maths grade.'" c="worse than" a=["worse than","worse than my maths grade"] ds=["worse as","more bad than","baddest"]
- `m2-u4-comparatives-tr-001` [translation, d3]: p="🇩🇪 Mein Hund ist größer als deine Katze." c="My dog is bigger than your cat." a=["My dog is bigger than your cat.","My dog is bigger than your cat","My dog is larger than your cat.","My dog is larger than your cat"] ds=[]
- `m2-u4-comparatives-tr-002` [translation, d4]: p="🇩🇪 Dieses Buch ist interessanter als der Film." c="This book is more interesting than the film." a=["This book is more interesting than the film.","This book is more interesting than the film","This book is more interesting than the movie.","This book is more interesting than the movie"] ds=[]
- `m2-u4-comparatives-sb-001` [sentence-building, d1]: p="Put the words in the correct order: is / a / cat / smaller / a / dog / than" c="A cat is smaller than a dog." a=["A cat is smaller than a dog.","A cat is smaller than a dog"] ds=[]
- `m2-u4-comparatives-mt-001` [matching, d2]: p="Match each adjective with its correct comparative form:\n1. good\n2. big\n3. happy\n4. dangerous\n5. bad\n\na. bigger\nb. worse\nc. happier\nd. more dangerous\ne. better" c="{\"1\":\"e\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\",\"5\":\"b\"}" a=["{\"1\":\"e\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\",\"5\":\"b\"}"] ds=[]
- `m2-u4-comparatives-mc-004` [multiple-choice, d2]: p="You're describing your pet to a friend. Which sentence uses the comparative correctly?" c="My dog is bigger than my cat." a=["My dog is bigger than my cat."] ds=["My dog is more bigger than my cat.","My dog is biger than my cat.","My dog is big than my cat."]

### `g2u04.s.superlatives` — Superlatives (Superlativ (Höchststufe))

Expressing the highest degree with the + -est for short adjectives, the most + adjective for long ones, and the irregular forms the best and the worst.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [the-est]: To say that something is the biggest, heaviest, fastest etc., use the and add -est to the adjective.
  - DE: Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du the und hängst -est an das Adjektiv an.
  - "The cheetah is the fastest mammal in the world." — "Der Gepard ist das schnellste Säugetier der Welt."
- rule [super-spelling]: Watch the spelling: hot - the hottest, big - the biggest, fat - the fattest (double the final consonant); heavy - the heaviest, angry - the angriest (-y becomes -iest).
  - DE: Bei einigen Adjektiven ändert sich die Schreibweise: hot - the hottest, big - the biggest, fat - the fattest (Endkonsonant verdoppeln); heavy - the heaviest, angry - the angriest (-y wird zu -iest).
  - "This is the hottest day of the year." — "Das ist der heißeste Tag des Jahres."
  - "The blue whale is the heaviest animal in the world." — "Der Blauwal ist das schwerste Tier der Welt."
- rule [the-most]: Adjectives with three or more syllables (dangerous, difficult, interesting ...) use the most + adjective.
  - DE: Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting ...), verwendest du the most + Adjektiv.
  - "The mosquito is the most dangerous animal in the world." — "Die Stechmücke ist das gefährlichste Tier der Welt."
- rule [super-irregular]: Irregular superlatives must be learnt by heart: good - the best, bad - the worst.
  - DE: Ausnahmen musst du auswendig lernen: good - the best, bad - the worst.
  - "She's the best player in the team." — "Sie ist die beste Spielerin im Team."
  - "It's the worst restaurant in town." — "Es ist das schlechteste Restaurant der Stadt."

common errors:
- Missing the before the superlative: ✗ "He is fastest runner in the school." → ✓ "He is the fastest runner in the school."
- Double superlative (most + -est): ✗ "The blue whale is the most biggest animal." → ✓ "The blue whale is the biggest animal."
- Regularising irregular superlatives: ✗ "She is the goodest student." → ✓ "She is the best student."

SB box `g2/sb/More 2 SB Unit 4.txt#grammar-1` — Comparatives:
```
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
```

v1 seed items (UNTRUSTED):
- `m2-u4-superlatives-gf-001` [gap-fill, d1]: p="Mount Everest is ___ mountain in the world." c="the highest" a=["the highest"] ds=["highest","the most high","the higher"]
- `m2-u4-superlatives-gf-002` [gap-fill, d1]: p="This is ___ book I have ever read." c="the best" a=["the best"] ds=["the goodest","the most good","best"]
- `m2-u4-superlatives-gf-003` [gap-fill, d2]: p="English is ___ subject at our school." c="the most popular" a=["the most popular"] ds=["the popularest","most popular","the more popular"]
- `m2-u4-superlatives-gf-004` [gap-fill, d3]: p="My sister is ___ person in our family." c="the funniest" a=["the funniest"] ds=["the most funny","the funnyest","funniest"]
- `m2-u4-superlatives-gf-005` [gap-fill, d3]: p="Winter is ___ season in Austria." c="the coldest" a=["the coldest"] ds=["the most cold","coldest","the colder"]
- `m2-u4-superlatives-gf-006` [gap-fill, d4]: p="That was ___ film I have ever seen." c="the worst" a=["the worst"] ds=["the baddest","the most bad","worst"]
- `m2-u4-superlatives-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="She is the tallest girl in our class." a=["She is the tallest girl in our class."] ds=["She is tallest girl in our class.","She is the most tallest girl in our class.","She is the taller girl in our class."]
- `m2-u4-superlatives-mc-002` [multiple-choice, d3]: p="Which sentence uses the superlative correctly?" c="This is the most expensive phone in the shop." a=["This is the most expensive phone in the shop."] ds=["This is the expensivest phone in the shop.","This is most expensive phone in the shop.","This is the more expensive phone in the shop."]
- `m2-u4-superlatives-mc-003` [gap-fill, d4]: p="Choose the correct option: My dog is ___ pet in the neighbourhood." c="the friendliest" a=["the friendliest"] ds=["the most friendly","the friendlyest","friendliest"]
- `m2-u4-superlatives-ec-001` [sentence-building, d2]: p="Put the words in the correct order: He / is / the / fastest / runner / in / the / school" c="He is the fastest runner in the school." a=["He is the fastest runner in the school.","He is the fastest runner in the school"] ds=[]
- `m2-u4-superlatives-ec-002` [error-correction, d3]: p="Find and fix the mistake: This is the most biggest cake I have ever seen." c="This is the biggest cake I have ever seen." a=["This is the biggest cake I have ever seen.","This is the biggest cake I have ever seen","the biggest"] ds=[]
- `m2-u4-superlatives-ec-003` [error-correction, d4]: p="Find and fix the mistake: She is the goodest singer in the choir." c="She is the best singer in the choir." a=["She is the best singer in the choir.","She is the best singer in the choir","the best"] ds=[]
- `m2-u4-superlatives-tf-001` [gap-fill, d3]: p="Your class is talking about heights. Tom is the tallest. Tell a new student: 'Tom is ___ boy in the class.'" c="the tallest" a=["the tallest","the tallest boy in the class"] ds=["tallest","the taller","most tall"]
- `m2-u4-superlatives-tf-002` [gap-fill, d4]: p="Your family visited a museum at the weekend. You loved it! Tell your friend: 'It is ___ place in our town.'" c="the most interesting" a=["the most interesting","the most interesting place in our town"] ds=["most interesting","the most interer thaning","the more interesting"]
- `m2-u4-superlatives-tf-003` [gap-fill, d5]: p="You're complaining about homework. This exercise was terrible. Say: 'It is ___ exercise in the book!'" c="the worst" a=["the worst","the worst exercise in the book"] ds=["worst","the baddest","more bad"]
- `m2-u4-superlatives-tr-001` [translation, d3]: p="🇩🇪 Das ist das größte Haus in der Straße." c="That is the biggest house in the street." a=["That is the biggest house in the street.","That is the biggest house in the street","This is the biggest house in the street.","This is the biggest house in the street","That's the biggest house in the street.","That's the biggest house in the street","It is the biggest house in the street.","It's the biggest house in the street."] ds=[]
- `m2-u4-superlatives-tr-002` [translation, d5]: p="🇩🇪 Mathe ist das schwierigste Fach." c="Maths is the most difficult subject." a=["Maths is the most difficult subject.","Maths is the most difficult subject","Math is the most difficult subject.","Math is the most difficult subject","Maths is the hardest subject.","Maths is the hardest subject","Math is the hardest subject.","Math is the hardest subject"] ds=[]
- `m2-u4-superlatives-sb-001` [sentence-building, d2]: p="Put the words in the correct order: youngest / is / the / she / in / player / the team" c="She is the youngest player in the team." a=["She is the youngest player in the team.","She is the youngest player in the team"] ds=[]
- `m2-u4-superlatives-mt-001` [matching, d3]: p="Match each adjective with its correct superlative form: 1) good  2) bad  3) happy  4) beautiful  5) big" c="{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"c\"}" a=["{\"1\":\"d\",\"2\":\"e\",\"3\":\"a\",\"4\":\"b\",\"5\":\"c\"}"] ds=["a: happiest","b: most beautiful","c: biggest","d: best","e: worst"]
- `m2-u4-superlatives-mc-004` [multiple-choice, d2]: p="Your PE teacher asks who is the fastest runner. Which sentence is correct?" c="Anna is the fastest runner in our class." a=["Anna is the fastest runner in our class."] ds=["Anna is the most fastest runner in our class.","Anna is the faster runner in our class.","Anna is fastest runner in our class."]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alan, Alison, Alphabet, Alps, America, Anderson, Andrew, Andy, Anger, Annie, Arbeit, Archie, Arousing, Articles, Australia, Austria, Bacon, Baker, Befehlsformen, Beitrag, Ben, Bert, Betty, Bilal, Bild, Bilder, Bill, Black, Blackbeard, Blackie, Bob, Bolt, Box, Brown, Buckingham, Buddy, Burgers, Cairn, California, Cambridge, Caribbean, Carina, Carl, Carla, Castle, Chamber, Chester, Chichen, China, Chito, Chloe, Christie, Christine, Clare, Clark, Classroom, Clothes, Clown, Coldeye, Come, Complimenting, Croatia, Dad, Dan, Dana, Daniel, Danielle, Darkman, Darren, Dave, David, Davis, Debbie, Despereaux, Dialog, Dialoge, Diana, Dinge, Disneyland, Doctor, Doctors, Don, Dragon, Edwina, Elisabeth, Ellie, Emergency, Emily, Emma, Encouraging, England, English, European, Every, False, Faye, Fido, Food, France, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Grace, Great, Green, Grey, Greybeard, Groans, Guess, Halloween, Hammond, Harris, Harry, Help, Henry, Hmm, Holmes, Homework, Hook, Hungary, Hunt, Imperatives, Infinitiv, Interviewer, Ireland, Irish, Irregular, Italian, Itza, Jack, Jacob, James, Jamie, Jane, Janet, Jay, Jefferson, Jennifer, Jenny, Jeremy, Jessica, Jessie, Jill, Jimmy, Joe, John, Jolly, Jones, Julia, Jun, Jupiter, Just, Justyna, Kate, Ken, Kinds, Kitty, Kukulkan, Lane, Lara, Laura, Leah, Leo, Leonie, Lethabo, Leute, Lewis, Li, Liam, Lily, Linking, Lisa, London, Lord, Lucy, Luna, Mail, Manchester, Mandy, Manju, Manson, Mario, Mark, Marple, Mary, Matt, Mayan, Mei, Mexico, Michael, Mike, Mill, Miriam, Miss, Moira, Mr, Mrs, Mum, Nathan, New, Nibbs, Nice, Nick, Nomen, North, Number, Numbers, Object, Objekte, Oliver, Olivia, Omar, Order, Ordinal, Palace, Pardon, Paris, Parsons, Past, Paul, Paula, Paws, People, Pete, Peter, Pets, Philosopher, Phoenix, Pirates, Plural, Plurals, Polly, Possessives, Potter, Prepositions, Present, Priestly, Project, Put, Rajit, Ranjit, Rashmi, Really, Red, Reihenfolge, Richard, Ricky, Robert, Ron, Ronald, Rose, Rosey, Rosie, Sally, Sam, Samuel, Sandra, Sara, Sarah, Saying, School, Scotland, Sean, Sherlock, Sicily, Silben, Smith, Sophia, Sophie, States, Steve, Sue, Sunborn, Suzy, Tale, Tamar, Tamara, Tammy, Tell, Telling, Text, Think, Tick, Tim, Toby, Tock, Tom, Tony, Tricia, Trick, True, Turan, Uhr, Um, United, Vienna, Walker, Wall, Watson, Welcome, Well, White, William, Wise, Work, Wortes, Would, Wow, Wu, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: More 2 SB Unit 4.txt -----
Unit 4  What an animal!
Page 32–33
At the end of unit 4 ...
 you know
 ☑ adjectives to describe animals
 ☑ 14 words for animals
 ☑ how to use the comparative and superlative
 ☑ how to use as ... as
you can
 ☑ understand a newspaper article about a friendship with an animal
 ☑ describe animals and compare them
 ☑ understand facts and stories about animals
 ☑ understand and take part in a group discussion
 ☑ find out information online and take notes
 ☑ write a magazine article about an extinct animal
 ☑ write about animals and compare them
READING
1 Read through the story quickly and answer the questions.
What was the problem with the crocodile when the man found it?
What did he do to help it?
How a fisherman saved a crocodile from dying
 The incredible, but true story of a friendship between a man and a crocodile
More than 30 years ago, a farmer in Costa Rica saw a huge crocodile trying to get to one of his cows. The man went back to the farmhouse, came back with a gun and shot the crocodile in its head.
The next day, a fisherman named Chito found the croc on the bank of the river near his house. He saw that the animal was bigger than all the other crocodiles in that area, but it was almost dead.
This week, an amazing film comes to the cinema. It’s called The Man Who Swims With Crocodiles. We sent a reporter to find out more about the story. “When I first saw the crocodile, I wanted to show the animal that not all humans are bad,” Chito told us. “So I gave it food and I stayed with it and spoke to it. I was happy to see that the next day the animal was already a little stronger than it was the day before. I gave it a name too, Pocho.”
A few weeks later, the crocodile was much healthier. It went to the river. Then it started to swim. It went into a part of the river where the water was deeper. “I was a little sad when it was gone. But the next day, the crocodile was back. It was on my veranda when I opened the door in the morning!”
The man and the dangerous animal became friends, and soon they started swimming in the river together. “When we went into the water, it opened its big mouth. As soon as I got near, it closed it. I was a little scared first, but I felt better when I saw that. I knew it liked me,” Chito said. “And I never felt scared again when the animal was near me.”
2 Read the text again. How many of these tasks can you do?
The story happened last year. T / F
A farmer shot the crocodile because it wanted to eat his cow. T / F
There is now a film about the fisherman and the crocodile. T / F
Chito gave the crocodile ............................... : Pocho.
He gave the croc food and the next day it was ............................... .
More than a month later, the crocodile was ............................... than the day before.
What happened when the crocodile went into the river one day?
Was the man ever scared of the crocodile? Why (not)?
How did the man feel in different parts of the story, and why?
3 Check your answers with a partner.
VOCABULARY
 Adjectives
4 Match the pictures with the adjectives. Write the numbers.
☐ small
 ☐ hairy
 ☐ heavy
 ☐ dangerous
 ☐ strong
 ☐ clever
 ☐ big
(Image description: Seven animals are pictured and numbered: 1 a small green frog, 2 a large elephant, 3 a hairy orangutan, 4 a dangerous-looking crocodile, 5 a clever-looking monkey, 6 a strong ox, 7 a heavy hippopotamus.)
SPEAKING
 Comparing animals
5 Choose one of the animals. Make sentences using comparatives. Your partner guesses what animal it is. Use the words in the box in 4 to help you.
A: It’s bigger than a mouse.
 B: Is it a guinea pig?
 A: No, it’s heavier than a guinea pig.
 B: Is it a rabbit?
 A: That’s right.
(Image description: Illustrations of a mouse, a guinea pig, and a rabbit in conversation bubbles.)
READING
 Understanding facts about animals
6 Read the facts about animals that became extinct in the last two hundred years.
PARADISE PARROT
 The paradise parrot lived in parts of Australia and became extinct in 1927. It was more colourful than most other birds in the area, but why was it darker green? People don’t know. Nobody knows exactly why it became extinct?
 Nobody knows. But wildfires killed many of the beautiful birds.
GOLDEN TOADS
 Golden toads were as big as the frogs you can see in our gardens. But they were more colourful. The male was golden red, the female was dark green. People liked the bright colour.
 Scientists think that golden toads died out because of climate change.
PASSENGER PIGEONS
 About 150 years ago, there were a lot more passenger pigeons than there were pigeons in Europe. Many people ate them! But people also hunted them because of their meat. Only a few birds stayed alive.
 After a while, the birds became extinct.
WESTERN BLACK RHINO
 Western black rhinos were amazing animals. They could run very fast. Females can’t run at 40 km/h.
 Western black rhino was faster – up to 55 km/h. But people hunted them for their horns. People killed them, and they became extinct in 2011.
VOCABULARY: extinct = ausgestorben
7 Read the facts again and circle T (True) or F (False).
Most other Australian birds were more colourful than the paradise parrot. T / F
The frogs we have in our gardens are not bigger than the golden toad. T / F
The golden toad was not as colourful as the frogs are today. T / F
The golden toad died out earlier than the paradise parrot. T / F
Before 1900, people in North America saw as many passenger pigeons as other birds. T / F
In about 50 years, people killed billions of pigeons. T / F
Elephants cannot run as fast as the western black rhino. T / F
The western black rhino ran fast, but less than 60 km/h. T / F
Page 34–35
8 Read the magazine article. Complete it with the numbers from the box. Then listen and check.
 [Box: 150 2 8 3 110 1]
The most INCREDIBLE ANIMALS in the world
(Image description: Several animal photographs with labels and fact boxes: a taipan snake, bumblebee bat, mosquito, estuarine crocodile, cheetah, and blue whale.)
The world’s most venomous snake is the TAIPAN.* It lives in the deserts of Australia. It can be more than 3 metres long.
The BUMBLEBEE BAT from Thailand is the smallest mammal in the world. It is 3 centimetres long and weighs 2 grams.
The most dangerous animal in the world is the MOSQUITO. It can carry malaria. Every year, more than 1 million people worldwide die from malaria.
The fastest land animal in the world is the CHEETAH. It can run very fast – more than 110 km/h.
The ESTUARINE CROCODILES of South East Asia are the longest crocodiles in the world. They can be 8 metres long – as long as two cars together!
The biggest animal on land or in the sea is the BLUE WHALE. It’s also the heaviest. It weighs 150 tons.
VOCABULARY: venomous = giftig
9 Look at the fact file. Write six sentences comparing the snakes. Use superlatives and comparatives. Use adjectives from the box.
[Box: long heavy fast dangerous venomous]
Fact file
	Anaconda	Boa constrictor	Python
maximum length	6 m	2.4 m	6 m
maximum weight	227 kg	15 kg	75 kg
speed on land	8 km/h	2 km/h	8 km/h
venomous	yes	no	no

10 SOUNDS RIGHT /dʒ/ /tʃ/
Listen and repeat.
His name’s Jim, I’m more beautiful than him.
 He’s a chimpanzee, and he’s as big as me.
(Image description: A girl and a chimpanzee lie on the grass side-by-side.)
VOCABULARY Animals
11 Match the eyes and the animals.
[Options: antelope giraffe rhino ostrich chimpanzee dolphin]
Whose eye is it?
(Image description: Six close-up photographs of different animal eyes, labelled 1 to 6.)
Girl: I think number ... is the ostrich’s eye.
12 Listen and check.
SPEAKING Describing animals
13 Put the animals in order. Write 1, 2 and 3 in the boxes.
THE ANIMAL QUIZ
Which is the tallest?
  a ☐ giraffe
  b ☐ an ostrich
  c ☐ an elephant
(Image: A large giraffe head and neck)
Which is the longest?
  a ☐ an anaconda
  b ☐ a whale shark
  c ☐ a crocodile
(Image: Whale shark)
Which is the fastest?
  a ☐ a lion
  b ☐ a rabbit
  c ☐ an antelope
(Image: Lion)
Which is the heaviest?
  a ☐ a rhino
  b ☐ a blue whale
  c ☐ an elephant
(Image: Elephant)
Which is the most intelligent?
  a ☐ a dolphin
  b ☐ a pig
  c ☐ a chimpanzee
(Image: Chimpanzee)
14 Discuss your answers with a partner. Then listen and check.
Boy: I think the elephant is the tallest.
 Girl: I don’t think so. I think the …
Page 36–37
SPEAKING & LISTENING Taking part in a group discussion
15 Read and match. Then listen and check.
1 cheetah 2 fox 3 lion 4 leopard 5 ladybird 6 antelope 7 dolphin 8 owl
(Image descriptions:
 A: Antelope standing in the desert.
 B: Leopard walking through dry grass.
 C: Dolphin jumping in the water.
 D: Cheetah climbing a tree.
 E: Owl sitting on a tree branch.
 F: Lion standing in the savanna.
 G: Fox in a snowy forest.
 H: Ladybird on a leaf.)
16 Read through the useful language for a group discussion:
Making suggestions and giving reasons:
 I think the … would be a good mascot because …
 It is …er than a …
 It isn’t as … as …
 Let’s choose …
 Do you know what I think?
Asking for repetition:
 Sorry?
 Can you say that again, please?
Asking to give reasons:
 Can you say why you think so?
 Are you sure about that?
 Why do you think so?
Making simple remarks to show that you follow:
 I see.
 I see what you mean.
 OK.
 I understand.
 Good point.
Inviting others to speak:
 What do you think, (Tom)?
 Do you agree, (Tina)?
(Image description: Three children talking in a group.)
17 Listen to the group discussion and answer the questions.
What are they talking about? What suggestions do they make and why?
Listen again. Which of the language suggestions in 16 do they use in the discussion?
Take notes. Share your notes with a partner.
18 a Work in groups. Imagine your class needs to decide on an animal as a mascot for the school volleyball team. Use the language in 16.
b Think about your discussion. What was easy or difficult? How can you make it even better?
c Work in groups again. Imagine your class needs to decide on an animal as a mascot for the school football team. You can suggest other animals too.
A SONG 4 U
19 Listen and sing.
A mascot for the school team
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
Why don’t we choose a dolphin?
 Dolphins are so cool.
 They are the smartest animals.
 Ideal for our school!
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
I’d say let’s pick a rhino,
 bigger than a truck.
 Rhinos are so powerful,
 rhinos don’t get stuck.
We need a mascot for the school team
 that’s as brilliant as we are.
 What animal can bring us luck
 in races near and far? (x2)
The mascot for the dream team
 that helps us all the time.
 Should really be a ladybird.
 A ladybird? That’s fine!
We’ve got our mascot for the school team.
 It’s as brilliant as we are.
 It’s a ladybird that brings us luck
 in races near and far! (x2)
(Image description: Cartoon of a dolphin, a rhino, and a ladybird dressed as athletes, cheering and playing sports.)
WRITING
20 CHOICES
Do an internet search. Find an animal that became extinct. Take notes about:
• the animal’s name
 • where and when it lived
 • what it looked like
 • why it became extinct
A Use your notes to write four sentences about the animal.
B You have been invited to write a short article of 80–100 words for your online school magazine about an animal that became extinct. Include the following information:
• the place where and the time when the animal lived
 • what the animal looked like (use one comparative and one superlative)
 • the reason(s) why the animal became extinct
Page 38–39
GRAMMAR
Comparatives
Wenn du zwei Dinge vergleichst, die verschieden sind, dann verwendest du das Wort than. An die Adjektive mit einer Silbe (fast, slow, deep, old, …) hängst du -er an.
He’s older than me.
She’s faster than me.
An die Adjektive mit zwei Silben, die auf -y, -le und -ow enden (happy, simple, …) hängst du ebenfalls -er an.
hot → It’s hotter today than yesterday.
big → The whale is bigger than a dolphin.
fat → A rhino is fatter than a cheetah.
heavy → An elephant is heavier than a mouse.
angry → My mum was angrier than my dad.
hungry → I was hungrier than my sister.
Wenn das Adjektiv mehr als zwei Silben hat (dangerous, difficult, interesting, …), dann verwendest du
 more + adjective + than.
The book is more interesting than the film.
Ausnahmen:
good → better
  He was better than Jeff.
bad → worse
  I’m bad at football, but he’s worse than me!
as … as
Wenn du sagen willst, dass sich zwei Dinge/Tiere/Personen in irgendeiner Weise gleichen (z. B. gleich groß, klein usw. sind), dann verwendest du as … as:
It was as small as a mouse.
It was as dangerous as a snake.
Wenn sie sich nicht gleichen, verwendest du not as … as:
The female golden toad is not as colourful as the male animal.
Superlatives
Wenn du ausdrücken willst, dass etwas am größten, schwersten, schnellsten usw. ist, verwendest du das the und hängst -est an das Adjektiv an:
fast, slow, deep, old, etc. → The cheetah is the fastest mammal in the world.
Bei einigen Adjektiven ändert sich die Schreibweise:
hot → This is the hottest day of the year.
big → The blue whale is the biggest animal in the world.
fat → This is the fattest snake in the zoo.
heavy → The blue whale is the heaviest animal in the world.
angry → He is the angriest person I know.
hungry → I was the hungriest one on our school trip.
Bei Adjektiven, die aus drei oder mehr Silben bestehen (dangerous, difficult, interesting, …) verwendest du
 the most + adjective:
The mosquito is the most dangerous animal in the world.
Ausnahmen:
good → the best
  She’s the best player in the team.
bad → the worst
  It’s the worst restaurant in town.
Now go back to page 32. Check ✅ with a partner what you know / can do.
THE STORY OF THE STONES 2
 We’re all in danger
1 Look at the pictures from episode 1 and put them in the correct order.
(Image descriptions:
 Four cartoon panels showing characters from the story.
 1: Girl talking to a woman in a bedroom.
 2: Girl with concerned look lying on bed.
 3: Girl and two others discussing.
 4: Girl holding a glowing object.)
2 Can you remember who morphs into each of these animals? Write the names.
(Images left to right:
 1: Cartoon of a black mouse
 2: Cartoon of an eagle
 3: Cartoon of a tiger)
1 ________
 2 ________
 3 ________
3 Watch episode 2 and answer the questions. Circle a, b or c.
Who is Darkman’s master?
 a The Black Knight
 b Demon Eyes
 c The Lord of the Fire
What does Darkman’s master want?
 a the belt and stones
 b a spaceship
 c the three stones
Which Lord wanted all the stones?
 a The Lord of the Earth
 b The Lord of the Fire
 c The Lord of the Water
Who is trying to find the stones?
 a Sunborn
 b Darkman
 c The Lords
EVERYDAY ENGLISH
4 Watch episode 2 again. Complete the sentences and match them with the person who said them.
Here you are  get it  How can that be?
________ , he’s dead, isn’t he?
Only your stones can protect you now. ___________________________
But I still don’t ___________________________ . Why didn’t Darkman die?
☐ Emma
 ☐ Sarah
 ☐ Sunborn


----- WB: More 2 WB Unit 4.txt -----
UNIT 4 What an animal!
Page 29
UNDERSTANDING VOCABULARY
Animals & adjectives
1 Match the words with the pictures.
Word List:
pig
dolphin
antelope
mosquito
anaconda
chimpanzee
giraffe
cheetah
whale
rhino
ostrich
crocodile
Image descriptions with numbers:
A large bird with long neck and legs — ostrich
A small flying insect — mosquito
A sea animal with a curved mouth and fins — dolphin
A tall animal with a long neck and spots — giraffe
A pink farm animal — pig
A fast spotted wild cat — cheetah
A large animal with thick skin and a horn — rhino
A graceful animal with horns — antelope
A small ape — chimpanzee
A green reptile with a long tail and teeth — crocodile
A large blue sea animal — whale
A large green snake — anaconda
2 Circle the correct word.
Image 1: Two children standing outside, smiling at each other.
 Options: friendly / dangerous
Image 2: A girl writing complex math on a whiteboard.
 Options: clever / big
Image 3: A hippo standing on a scale.
 Options: heavy / small
Image 4: A mosquito under a magnifying glass.
 Options: small / heavy
Image 5: A giraffe with a small animal.
 Options: hairy / big
Image 6: A crocodile with its mouth open.
 Options: dangerous / friendly
Image 7: A girl lifting dumbbells.
 Options: clever / strong
Image 8: A hand with a lot of hair.
 Options: heavy / hairy
Page 30–31
USING VOCABULARY
Animals & adjectives
3 Do the crossword puzzle and find the mystery word.
Someone who is 93 is really …
I can’t carry this bag. It’s too …
Everyone likes them because they’re very …
The opposite of small.
The opposite of stupid.
With lots of hair on the body.
She can carry three suitcases. She’s quite …
The opposite of old.
It’s difficult to see the animal because it’s so …
(Crossword puzzle grid present, 9-across forms the mystery word.)
4 Write down some of the animals from 1.
These animals are very fast: ..........................................................
These animals are very tall: ..........................................................
These animals are very dangerous: ..................................................
These animals are very heavy: .........................................................
These animals are very long: ..........................................................
UNDERSTANDING GRAMMAR
Comparatives
5 Match the sentences and the pictures. There are two extra pictures.
(Images show comparative situations: temperatures, children measuring height, two pizzas, race running, etc.)
The pizza at Tony’s is better than the pizza at Little Italy.
It’s hotter today than yesterday.
My bag is heavier than your bag.
Tom is faster than George.
My brother is five years older than me.
USING GRAMMAR
Comparatives
6 Write sentences comparing the animals. Use some of the adjectives in the box.
Use a different adjective for each picture.
Word Box:
hairy
strong
fast
big
funny
dangerous
scary
small
long
Elephants are bigger than rhinos.
...............................................................
...............................................................
...............................................................
...............................................................
...............................................................
(Images show animal pairs: elephant and rhino, lion and tiger, monkey and cat, etc.)
UNDERSTANDING GRAMMAR
as ... as
7 Read the sentences. Tick the ones you think are true. Listen and check.
The Eiffel Tower isn’t as tall as the Empire State Building.
The River Nile isn’t as long as the River Amazon.
There aren’t as many people in Belgium* as in Austria.
There aren’t as many lakes in Finland as in Germany.
The blue-ringed octopus isn’t as dangerous as the mosquito.
The Estuarine crocodile isn’t as long as the taipan snake.
Elephants aren’t as heavy as blue whales.
Austria isn’t as big as Hungary.
*VOCABULARY: Belgium – Belgien
USING GRAMMAR
as ... as
8 Complete B’s answers. Use the same adjective as A and as ... as.
1
 A I don’t think squash is exciting.
 B Really? I think it’s as exciting as tennis.
2
 A I don’t think rabbits are interesting.
 B Really? I think .................................................... hamsters.
3
 A I don’t think spiders are scary.
 B Really? I think .................................................... snakes.
4
 A I don’t think your dog is clever.
 B Really? I think .................................................... your cat!
5
 A I don’t think this film is good.
 B Really? I think .................................................... the other one.
6
 A I don’t think you’re very strong.
 B Really? I think .................................................... you!
Page 32–33
9 Complete the text. Use as ... as or comparative adjectives.
Lin: I see you’ve got all the Harry Potter books. What do you think of them?
 Ciara: I really like all the Harry Potter books but I think that The Chamber of Secrets is a 1. ......................................................... (good) book than The Order of the Phoenix.
The Chamber of Secrets is 2. ......................................................... (interesting) and
 3. ......................................................... (exciting) than The Order of the Phoenix. And
 The Order of the Phoenix is much 4. ......................................................... (long).
Lin: What do you think of the films?
 Ciara: Well, The Philosopher’s Stone film isn’t as 5. ......................................................... (good) the book. I really like the books much 6. ......................................................... (good) than the films.
Lin: Tell me more about the books.
 Ciara: Well, The Goblet of Fire was 7. ......................................................... (good) than The Chamber of Secrets. And The Chamber of Secrets was 8. ......................................................... (exciting) than The Prisoner of Azkaban.
Lin: So what should I read?
 Ciara: Start at the beginning with The Philosopher’s Stone, of course.
10 Write five sentences comparing Ronnie and Reggie. Use as ... as or comparative adjectives.
	date of birth	weight	height*	school report	running 100m
Ronnie	March 22nd 2012	50kg	1.56m	A+	18 seconds
Reggie	March 22nd 2012	52kg	1.56m	C-	16 seconds

1 .................................................................................... (old)
 2 .................................................................................... (heavy)
 3 .................................................................................... (tall)
 4 .................................................................................... (clever)
 5 .................................................................................... (fast)
VOCABULARY: height – Größe
UNDERSTANDING GRAMMAR
Superlatives
11 Circle the correct word.
Ostriches are faster / fastest than people.
The taipan is the venomous / most venomous snake in the world.
The anaconda is one of the longer / longest snakes in the world.
This book about animals is the best / better.
Gorillas are bigger / biggest than chimpanzees.
Cheetahs are faster / fast than rhinos.
Spike was the ugliest / uglier dog in the dog show.
The cat is the most popular / popular pet in the UK.
USING GRAMMAR
Superlatives
12 Harry, Larry and Barry are brothers – triplets! Look at the picture and the table and write sentences using superlatives. Use the adjectives in the box.
	date of birth	school report	weight	running 100m
Harry	02/02/12, 10.20 a.m.	All ‘C’s	47kg	12.5 seconds
Barry	02/02/12, 10.50 a.m.	All ‘B’s	43kg	18 seconds
Larry	02/02/12, 11.40 a.m.	All ‘A’s	53kg	14.6 seconds

Adjective box:
tall
old
heavy
slow
intelligent
short
young
fast
Larry is the tallest ...................................................................................
 .................................................................................................................
 .................................................................................................................
VOCABULARY: triplets – Drillinge
13 Answer the questions for you.
Who is the tallest person in your family?
What is the best thing in your bedroom?
What is the heaviest thing in your house or flat?
What is the most expensive thing in your house or flat?
What is the most interesting animal in the world?
What is your best subject at school?
LISTENING
14 a Listen to the story and write the names.
Names: Rosey, Debbie, Lily
(Image description: A girl, a woman, and a golden retriever dog standing at the beach.)
1 _________________________
 2 _________________________
 3 _________________________
b Listen again and tick T (True) or F (False).
Lily was eight years old.
   ☐ T  ☐ F
Lily was a better swimmer than Rosey.
   ☐ T  ☐ F
Debbie got out of the river to get the food.
   ☐ T  ☐ F
The water was deep in the middle of the river.
   ☐ T  ☐ F
Debbie got to Lily before Rosey.
   ☐ T  ☐ F
Lily was smaller than her dog.
   ☐ T  ☐ F
Page 34–35
READING
Understanding a story about animals
15 Read the text. How many of the tasks below can you do?
Ricky’s Blog
 My safari trip
PHOTO of Ricky with a safari background
 PHOTO of rhinos and birds on a back
DECEMBER 9TH, 10:15 A.M.
Last year, we went on safari to Kenya. It was great – we saw lots of brilliant birds and I really liked them. We also saw a rhino one day. It was very big (about 1.5 metres high) and I’m sure it was really heavy too. The guide said that sometimes a rhino can weigh 2,000 kilograms!! But I wasn’t scared. My dad told me that rhinos normally aren’t very dangerous animals. Rhinos are almost blind and so they can’t see well. There were lots of small grey and white birds on the rhinoceros’ back. I think the birds eat very small insects from the rhino’s skin.
Later the same day, we saw some baboons*. There was a big family of them. I thought they looked nice and friendly, but we didn’t go very close. You have to be careful, because male baboons are strong and they aren’t very friendly! Some people think baboons are very intelligent, too. I don’t know about that, but I’m sure they’re more intelligent than rhinos! At the end of the day, when we went back to the hotel – guess what? In my parents’ room there was a big, black, hairy tarantula! My dad was really scared, but my mum just picked it up and put it outside. My mum’s really cool!
VOCABULARY: baboon – Pavian
Comprehension Questions:
Ricky really liked the birds.
   ☐ T  ☐ F
The rhino was more than 2 metres tall.
   ☐ T  ☐ F
Rhinos aren’t usually very dangerous.
   ☐ T  ☐ F
What was not on the rhino’s back?
 ☐ birds  ☐ insects  ☐ small mice
What was the second animal Ricky saw?
 ☐ rhinos  ☐ baboons  ☐ spiders
Why is it not a good idea to go close to baboons?
 ☐ they take your food  ☐ they are shy  ☐ they are dangerous
Who does Ricky believe to be more intelligent than rhinos?
 ........................................................................................................
Where was the spider?
 ........................................................................................................
What did Ricky’s mum do with the spider?
 ........................................................................................................
16 Listen and check your answers.
LISTENING & DIALOGUE WORK
Describing and comparing animals
17 CHOICES
A Put the lines in the correct order to make a dialogue. Then listen and check.
Jill: Are you sure about that? I think dogs are more intelligent.
 Jill: Why do you think that?
 Jill: What animal do you think would make the best pet?
 Will: I think a cat would be great.
 Will: No way. Cats are more intelligent than dogs.
 Will: Because cats are very intelligent.
8 Complete the dialogue with the sentences in the box. There are three extra sentences.
Then listen and check.
Sentence box:
Why not?
I don’t like animals.
But they are hairy, too – and dogs are friendlier than cats.
OK, so what do you want?
Hamsters are so cute.
If you want an easy pet, let’s get a fish.
Let’s ask Mum and Dad.
Great idea. Let’s get a dog.
Dialogue:
Tom: Let’s choose a pet for our house.
 Ruby: 1 ..............................................................
 Tom: A dog? No way!
 Ruby: 2 ..............................................................
 Tom: Dogs are too hairy. They leave hair all over the house.
 Ruby: 3 ..............................................................
 Tom: A cat, of course, cats are really cool.
 Ruby: 4 ..............................................................
 Tom: Yes, but dogs need a lot of time. Cats are easier to look after.
 Ruby: 5 ..............................................................
 Tom: A fish. That’s a good idea!
WRITING
Writing about animals and comparing them
18 CHOICES
A Write a short text (50 words) about an animal you like. Use at least one comparative and one superlative.
 Write about:
 • what the animal looks like (colour, size)
 • why you like the animal
B Choose two animals to compare and write about which one you would like most as a pet (80–100 words).
 Think about:
 • what each animal is like
 • why one animal is better than the other
WORD FILE
Animals (illustrated section)
Animals are grouped by type with images and labels:
INSECTS
mosquito
BIRDS
pigeon
parrot
ostrich
MAMMALS
chimpanzee
antelope
bat
giraffe
rhino
cheetah
REPTILES
anaconda
crocodile
SEA ANIMALS
dolphin
whale
shark
(Image shows a colorful scene with cartoon-style animals labelled as above.)
Page 36
MORE Words and Phrases
🔢	English word or phrase	Example sentence	German translation
1	(two days) ago	Two days ago, I saw a crocodile.	vor (zwei Tagen)
	farmer	A farmer saw a huge crocodile.	Bauer/Bäuerin
	human	I wanted to show the animal that not all humans are bad.	Mensch
	incredible	That’s an incredible but true story.	unglaublich
4	dangerous	The taipan snake can be very dangerous.	gefährlich
	hairy	My pet rat has got lots of fur. It’s very hairy.	haarig, stark behaart
	heavy	This bag is too heavy. I can’t carry it.	schwer
	strong	I’m not as strong as my best friend.	stark
6	climate change	Many animals die because of climate change.	Klimawandel
	fast	Cheetahs can run very fast.	schnell
	female	The female is dark green.	weiblich; Weibchen (Tierwelt)
	male	The male toad is golden red.	männlich
	nobody	Nobody knows why the paradise parrot became extinct.	niemand
	scientist	I want to become a scientist and study animals.	Wissenschaftler/Wissenschaftlerin
7	to die out	Many animals are dying out.	aussterben
	less	The rhino was fast, but less than 60 km/h.	weniger
8	to carry	Mosquitos can carry malaria.	tragen; hier: übertragen
	centimetre	One centimetre is 10 millimetres.	Zentimeter
	desert	There are no deserts in England.	Wüste
	to die	Millions of people die from malaria.	sterben
	mammal	Elephants and lions are mammals.	Säugetier
	ton	One ton is 1000 kg.	Tonne (1000 kg)
	venomous	A venomous animal produces poison to kill other animals.	giftig
	to weigh	A python can weigh up to 100 kg.	wiegen
9	length	The maximum length is 6 m.	Länge
	speed	Their speed on land is 8 km/h.	Geschwindigkeit, Tempo
13	intelligent	Dolphins are very intelligent animals.	intelligent
16	reason	Is there a reason why you don’t want to come over?	Grund
17	to share	Share your notes with a partner.	teilen; zeigen
19	luck	What animal can bring us luck?	Glück
	powerful	Rhinos are very powerful animals.	mächtig, kräftig
	smart	Cats are very smart animals.	schlau
	truck	A rhino can be bigger than a truck.	Lastwagen
S2	forever	We want to be best friends forever.	für immer
	to protect	Our stones can protect you.	(be-)schützen

```

## Output contract

Write `content/corpus/units/g2-u04/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g2-u04",
  "briefBank": "072502363e27",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g2u04.s.as-as",
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
