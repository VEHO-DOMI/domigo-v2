# Grammar generation brief — g1-u03 (MORE! 1, Unit 3)

<!-- domigo:gen grammar g1-u03 bank=4c3046921b06 prompt=4b9164076103 -->

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

### `g1u03.s.have-got` — have got / haven't got (have got – haben)

Expressing possession with have got in affirmative, negative and question forms (has got for he/she/it).

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [have-got-affirmative]: Use have got to say you possess something. For he/she/it the form is has got.
  - DE: Mit have got sagst du, dass du etwas hast. Für he/she/it lautet die Form has got.
  - "I have got a cat. / I've got a cat." — "Ich habe eine Katze."
  - "He has got a small nose. / He's got a small nose." — "Er hat eine kleine Nase."
- rule [have-got-negative]: The negative is haven't got / hasn't got.
  - DE: Die Verneinung lautet haven't got / hasn't got.
  - "I haven't got blue eyes." — "Ich habe keine blauen Augen."
  - "He hasn't got a dog." — "Er hat keinen Hund."
- rule [have-got-questions]: Questions: Have you got …? / Has she got …? Short answers: Yes, I have. / No, she hasn't.
  - DE: Fragen: Have you got …? / Has she got …? Kurzantworten: Yes, I have. / No, she hasn't.
  - "Have you got a cat? – Yes, I have." — "Hast du eine Katze? – Ja."
  - "Has he got a dog? – No, he hasn't." — "Hat er einen Hund? – Nein."

common errors:
- Using have instead of has with he/she/it.: ✗ "He have got a new bike." → ✓ "He has got a new bike."
- Using do/does for have got questions.: ✗ "Does he has got a cat?" → ✓ "Has he got a cat?"

SB box `g1/sb/SB Unit 3- Pirates.txt#grammar-1` — ▶️ have got – haven't got:
```
[THIS IS TABLE: Three-column table showing positive, negative, and question forms of "have got"] + | – | ? I/You have got a cat. | I/You haven't got a cat. | Have I/you got ...? He/She/It has got a small nose. | He/She/It hasn't got a small nose. | Has he/she/it got ...? We/You/They have got a big ship. | We/You/They haven't got a big ship. | Have we/you/they got ...?
🔍 Setze I haven't got oder I've got ein:
Mithilfe von ¹...................................................... sagst du, dass du etwas hast. Mithilfe von ²...................................................... sagst du, dass du etwas nicht hast.
Note: He has got a cat. = He's got a cat. They have got strong arms. = They've got strong arms. I have not got blue eyes. = I haven't got blue eyes. He has not got a dog. = He hasn't got a dog.
Ooh! You've got strong arms!
[Image description: Cartoon of a pirate flexing muscles]
▶️ Irregular plurals (2)
one foot → two feet one tooth → five teeth
```

v1 seed items (UNTRUSTED):
- `m1-u3-have-got-gf-001` [gap-fill, d1]: p="I ___ got a new bike. (have / has)" c="have" a=["have","'ve"] ds=["has","am","is"]
- `m1-u3-have-got-gf-002` [gap-fill, d1]: p="She ___ got blue eyes. (have / has)" c="has" a=["has","'s"] ds=["have","is","got"]
- `m1-u3-have-got-gf-003` [gap-fill, d2]: p="He ___ got a sister. (have / has — negative)" c="hasn't" a=["hasn't","has not"] ds=["haven't","don't have","not has"]
- `m1-u3-have-got-gf-004` [gap-fill, d3]: p="___ you got a pet? (have / has — question form)" c="Have" a=["Have"] ds=["Has","Do","Are"]
- `m1-u3-have-got-gf-005` [gap-fill, d3]: p="___ she got a computer? — No, she ___. (question + short answer)" c="Has ... hasn't" a=["Has ... hasn't"] ds=["Have ... haven't","Does ... doesn't","Is ... isn't"]
- `m1-u3-have-got-gf-006` [gap-fill, d4]: p="I ___ got any money. (negative)" c="haven't" a=["haven't","have not"] ds=["hasn't","don't have","haven't no"]
- `m1-u3-have-got-mc-001` [gap-fill, d2]: p="Tom ___ a new bike." c="has got" a=["has got","'s got"] ds=["have got","is got","haves got"]
- `m1-u3-have-got-mc-002` [multiple-choice, d3]: p="Which question is correct?" c="Has he got a dog?" a=["Has he got a dog?"] ds=["Does he has got a dog?","Have he got a dog?","Is he got a dog?"]
- `m1-u3-have-got-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="They haven't got any pets." a=["They haven't got any pets."] ds=["They haven't got no pets.","They hasn't got any pets.","They don't have got any pets."]
- `m1-u3-have-got-ec-001` [error-correction, d2]: p="Find and fix the mistake: He have got a new phone." c="He has got a new phone." a=["He has got a new phone.","He's got a new phone.","has","he is got a new phone."] ds=[]
- `m1-u3-have-got-ec-002` [error-correction, d3]: p="Find and fix the mistake: Does he has got a cat?" c="Has he got a cat?" a=["Has he got a cat?","has he"] ds=[]
- `m1-u3-have-got-ec-003` [error-correction, d4]: p="Find and fix the mistake: I haven't got no friends here." c="I haven't got any friends here." a=["I haven't got any friends here.","any","I have not got any friends here."] ds=[]
- `m1-u3-have-got-tf-001` [transformation, d2]: p="Your friend says Lisa has a cat, but that's wrong! Make this negative: She has got a cat. → She ___ got a cat." c="hasn't" a=["hasn't","has not","She hasn't got a cat.","She hasn't got a cat"] ds=[]
- `m1-u3-have-got-tf-002` [transformation, d3]: p="You want to ask your new classmate about pets. Make this a question: They have got two dogs. → ___ they ___ two dogs?" c="Have ... got" a=["Have ... got","Have ... got they Have ... got two dogs?","Have ... got they Have ... got two dogs","Have ... got they Have ... got two dogs"] ds=[]
- `m1-u3-have-got-tr-001` [translation, d2]: p="🇩🇪 Ich habe einen Bruder." c="I have got a brother." a=["I have got a brother.","I've got a brother.","I have a brother.","I've a brother."] ds=[]
- `m1-u3-have-got-tr-002` [translation, d4]: p="🇩🇪 Hat er einen Hund? — Nein, hat er nicht." c="Has he got a dog? — No, he hasn't." a=["Has he got a dog? — No, he hasn't.","Has he got a dog? — No, he has not.","Has he got a dog? — No, he hasn't"] ds=[]
- `m1-u3-have-got-sb-001` [sentence-building, d2]: p="Put the words in the correct order: got / a / has / pen / he / ?" c="Has he got a pen?" a=["Has he got a pen?"] ds=[]
- `m1-u3-have-got-mt-001` [matching, d2]: p="Match the subject to the correct form: 1) I 2) She 3) We 4) He — a) has got b) have got c) have got d) has got" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u3-have-got-gf-007` [gap-fill, d2]: p="She ___ got a beautiful garden." c="has" a=["has"] ds=["have","is","got"]
- `m1-u3-have-got-ff-002` [free-form, d3]: p="You want to ask your new neighbour about pets. Make it a question: You have got a pet. → ___ a pet?" c="Have you got" a=["Have you got","Have you got a pet","Have you got a pet?"] ds=[]
- `m1-u3-have-got-gs-001` [group-sort, d2]: p="Sort: \"have got\" or \"has got\"?" c="{\"have got\":[\"I\",\"you\",\"we\",\"they\"],\"has got\":[\"he\",\"she\",\"it\"]}" a=[] ds=[]
- `m1-u3-have-got-mp-001` [matching-pairs, d2]: p="Find the pairs: affirmative ↔ negative." c="[[\"I've got\",\"I haven't got\"],[\"she's got\",\"she hasn't got\"],[\"we've got\",\"we haven't got\"],[\"he's got\",\"he hasn't got\"],[\"they've got\",\"they haven't got\"]]" a=[] ds=[]

### `g1u03.s.irregular-plurals-2` — Irregular plurals (2) (Unregelmäßige Plurale (2))

More irregular plurals with a vowel change: foot–feet, tooth–teeth. Recurs from the unit-1 plurals box.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [irregular-plurals-vowel-change]: Some nouns make the plural by changing a vowel, not by adding -s. Learn them by heart.
  - DE: Manche Nomen bilden den Plural durch einen Vokalwechsel, nicht mit -s. Lerne sie auswendig.
  - "one foot → two feet" — "ein Fuß → zwei Füße"
  - "one tooth → five teeth" — "ein Zahn → fünf Zähne"

common errors:
- Regularising a vowel-change plural.: ✗ "My foots are cold." → ✓ "My feet are cold."
- Regularising tooth.: ✗ "I brush my tooths." → ✓ "I brush my teeth."

SB box `g1/sb/SB Unit 3- Pirates.txt#grammar-1` — ▶️ have got – haven't got:
```
[THIS IS TABLE: Three-column table showing positive, negative, and question forms of "have got"] + | – | ? I/You have got a cat. | I/You haven't got a cat. | Have I/you got ...? He/She/It has got a small nose. | He/She/It hasn't got a small nose. | Has he/she/it got ...? We/You/They have got a big ship. | We/You/They haven't got a big ship. | Have we/you/they got ...?
🔍 Setze I haven't got oder I've got ein:
Mithilfe von ¹...................................................... sagst du, dass du etwas hast. Mithilfe von ²...................................................... sagst du, dass du etwas nicht hast.
Note: He has got a cat. = He's got a cat. They have got strong arms. = They've got strong arms. I have not got blue eyes. = I haven't got blue eyes. He has not got a dog. = He hasn't got a dog.
Ooh! You've got strong arms!
[Image description: Cartoon of a pirate flexing muscles]
▶️ Irregular plurals (2)
one foot → two feet one tooth → five teeth
```

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Box, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Good, Gordon, Greybeard, Guess, Homework, Hook, Imperatives, Irregular, Jenny, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Nice, Nomen, Number, Numbers, Omar, Peter, Pirates, Plural, Polly, Prepositions, Rajit, Reihenfolge, Ronald, Saying, School, Sue, Tamara, Text, Tick, Tock, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 3- Pirates.txt -----
Page 22
Unit 3: Pirates
At the end of unit 3 ...
you know ☐ 14 words for parts of the body ☐ how to use have got – haven't got ☐ a few irregular plural forms
you can ☐ understand descriptions of people ☐ describe yourself and other people ☐ understand what other people have or haven't got ☐ say what you and other people have or haven't got ☐ use a mind map to write a description of somebody
1 Read and number the pictures.
Pirates of the Caribbean
1 This is Eduard Teach. He's a pirate. His pirate name is Blackbeard. People are very scared of him.
2 Blackbeard has got a ship. It's called Queen Anne's Revenge. It's a big ship. It's 32 metres long. It has got 40 cannons.
3 There is a famous series of pirate films called Pirates of the Caribbean. Blackbeard is also in the films. In the film, Blackbeard has got very long hair.
[Image description: Illustrations showing a Pirates of the Caribbean movie poster, a pirate figure resembling Blackbeard, and a large sailing ship]
VOCABULARY Parts of the body
1/23 🔊 2 Listen and point. Then number the words.
☐ beard ☐ left arm ☐ right leg ☐ fingers ☐ mouth ☐ eyes ☐ nose ☐ tooth/teeth ☐ wooden leg ☐ ear ☐ left foot ☐ feet ☐ left shoulder ☐ hair
[Image description: Illustration of two pirates on a ship deck with numbered body parts 1-14]
Note [Image description: Illustrations showing the difference between long/short and tall/short] long short tall short
Note 1 tooth – 2 teeth 1 foot – 2 feet
🔵 WB p. 22, 23 🌐 CYBER Homework 7 (Revision)
Page 23
LISTENING & SPEAKING Talking about what you have got / haven't got
1/24 🔊 3 Listen to the pirate and tick the correct picture.
Note I've got = I have got
[Image description: Three pirate illustrations numbered 1, 2, and 3 showing different pirate characters with various features]
👥 4 Work in pairs. One of you is Captain Tick and one of you is Captain Tock. Tell your partner what you have got / haven't got.
Captain Tick
I haven't got a red ship. I've got a blue ship.
Captain Tock
[Image description: Maze puzzle connecting Captain Tick and Captain Tock with various pirate-related items including ships, parrot, cat, and dog]
SOUNDS RIGHT /p/
1/25 🔊 5 Listen and repeat.
Purple hair and pink eyes, Polly Pym – the pretty pirate.
[Image description: Illustration of a female pirate character with purple hair]
🔵 WB p. 24, 28 🌐 CYBER Homework 8
Page 24
READING
1/26 🔊 6 a Look and tick.
Dana is ☐ a pirate. ☐ a girl.
b Read the story. Then listen to it.
Dana, the pirate
[Image description: Story panels showing Dana in various pirate-related scenes]
1 This is Dana. Dana loves pirates. She's got a lot of books about pirates.
2 Lots of books.
Zzzzz
3 Dana is in bed now. She is tired. She is very tired.
4 Dana is a pirate. She's got a parrot on her shoulder and she's got a golden tooth in her mouth. And she's got a ship. A big ship.
5 But Dana hasn't got friends. And the pirates haven't got a ship.
Don't look down.
6 Oh, no ...! Dana hasn't got a ship now.
7 [continues scene]
8 It's a dream!
9 Just a dream ...
7 Look at the pictures and answer the questions.
[Image description: Four numbered panels showing key moments from the story]
Note Answer with: Yes, she has. / No, she hasn't.
1 Has Dana got a book? 3 Has Dana got a pirate ship? ................................................. .................................................
2 Has Dana got a wooden leg? 4 Has Dana got a pirate ship? ................................................. .................................................
🔵 WB p. 25, 26, 28
Page 25
LISTENING & SPEAKING Saying what another person has got / hasn't got
1/27 🔊 8 Listen to Matt and Anna play "Guess my pirate". Complete.
1 Matt's pirate is ........................................... . 2 Anna's pirate is ........................................... .
[Image description: Grid of 15 pirate character portraits labeled with names: Alf, Bob, Chris, Dave, Ed, Fred, Greg, Harry, Ian, John, Kev, Liam, Nigel, Mark, Owen]
9 Read and complete.
Boy OK. Has your pirate got a big nose? Girl A big nose? Yes, he's got a big nose. Boy Has he got black hair? Girl No, he hasn't got black hair. He's got grey hair. Boy Has he got a beard? Girl No, he hasn't got a beard. Boy Has he got blue eyes?
Girl His eyes are brown, but he's only got one eye. Boy OK, he's got a big nose. He's got grey hair. He hasn't got a beard and he's got one brown eye. Is your pirate ........................................... ? Girl Yes, he is!
👥 10 In pairs, play "Guess my pirate". Ask questions to find your partner's pirate.
Has your pirate got ...? Yes, he's got ... / No, he hasn't got ... Is your pirate ...? He's got a ... Yes, he is. / No, he isn't.
🔵 WB p. 25
Page 26
11 C H O I C E S
A Read and look at the picture to find the two mistakes. Say what's wrong.
This is Tamara the Terrible. She is tall. She has got red hair. She hasn't got a big nose. She has got blue eyes. She has got a pelican, Trevor. Trevor hasn't got a real left leg. He has got a wooden left leg.
[Image description: Illustration of a female pirate character with a pelican]
B Read the texts and look at the pictures. How many mistakes can you find?
This is Greybeard the Great. He is short. He has got a black beard. He has got grey hair. He has got one green eye. He hasn't got a left ear. He hasn't got a strong left leg. He has got a wooden left leg. He has got a small blue nose. He has got a dog.
[Image description: Illustration of a pirate character labeled Greybeard]
Fred and Frank are brothers. Fred has got a pelican on his right shoulder, and Frank has got a pelican on his left shoulder. Fred has got a brown beard. Frank hasn't got a beard. They've got blonde hair. Frank has got a small nose. Fred has got a wooden leg.
[Image description: Illustration of two pirates labeled Fred and Frank with pelicans]
A SONG 4 U
1/28+29 🔊 12 Listen and sing.
The pirate song
[Image description: Comic-style illustrations of pirates and pirate-related imagery]
Ho, ho, hey, hey! Ho, ho, hey, hey! Hey, ho, this is the pirate song. Hey, ho, and here we go:
A cutlass* swings. A pirate sings. Ho, ho, hey, hey! Ho, ho, hey, hey! We're pirates – yes! The very best. Ho, ho, hey, hey! Ho, ho, hey, hey!
We're ready for action. Let's go on a trip. We're ready for action. Let's board the ship.
Ho, ho, hey, hey! Ho, ho, hey, hey! A cannonball*. The pirates call. Ho, ho, hey, hey! Ho, ho, hey, hey! We're pirates true. And we want you! Ho, ho, hey, hey! Ho, ho, hey, hey!
We're ready for action. Let's go on a trip. We're ready for action. Let's board the ship.
Ho, ho, hey, hey! Ho, ho, hey, hey! Hey, ho, this is the pirate song. Hey, ho, and here we go.
VOCABULARY: *cutlass – Piratensäbel; cannonball – Kanonenkugel
🔵 WB p. 26, 27
Page 27
WRITING
13 Look at the mind map. Use it to write a short text about a pirate (40–50 words).
[Image description: Mind map showing "Captain Hook" in the center with connected bubbles: "very strong" - "is" - "hasn't got" - "a cat"; "a big nose" - "has got" - "a hook" - "left arm" - "a wooden leg"; "brown hair" - "brown eyes" - "a dog" - "a cutlass"]
This is Captain Hook, the pirate. He has got brown hair and brown eyes ...
GRAMMAR
▶️ have got – haven't got
[THIS IS TABLE: Three-column table showing positive, negative, and question forms of "have got"] + | – | ? I/You have got a cat. | I/You haven't got a cat. | Have I/you got ...? He/She/It has got a small nose. | He/She/It hasn't got a small nose. | Has he/she/it got ...? We/You/They have got a big ship. | We/You/They haven't got a big ship. | Have we/you/they got ...?
🔍 Setze I haven't got oder I've got ein:
Mithilfe von ¹...................................................... sagst du, dass du etwas hast. Mithilfe von ²...................................................... sagst du, dass du etwas nicht hast.
Note: He has got a cat. = He's got a cat. They have got strong arms. = They've got strong arms. I have not got blue eyes. = I haven't got blue eyes. He has not got a dog. = He hasn't got a dog.
Ooh! You've got strong arms!
[Image description: Cartoon of a pirate flexing muscles]
▶️ Irregular plurals (2)
one foot → two feet one tooth → five teeth
MORE FUN WITH FIDO!
[Image description: Comic strip showing pirates discovering Captain Fido's treasure with speech bubble "Woof! Captain Fido's treasure!"]
⏪ Now go back to page 22. Check ☑ with a partner what you know / can do.
🔵 WB p. 24, 25 🌐 CYBER Homework 9
Page 28
THE TWINS 1
▶️ Feeling bored?
Developing speaking competencies
Language function | Speaking strategy ☐ I can make suggestions (Vorschläge machen) | ☐ I can respond (auf Vorschläge antworten)
VOCABULARY Activities
1/30 🔊 1 Write the activities under the pictures. Then listen and check.
go to the cinema go shopping go bowling go swimming go skateboarding go to the theme park
[Image description: Six photographs showing different activities numbered 1-6]
1 ..................................................... 2 ..................................................... 3 .....................................................
4 ..................................................... 5 ..................................................... 6 .....................................................
1/31 🔊 2 Watch or listen to the dialogue. Then read it. What activities does Lucy suggest?
▶️
Leo I'm bored. Lucy Me too. Let's do something. Leo Good idea. But what? Lucy Let's go swimming. Leo Swimming? No, I hate swimming. Lucy OK, we could go shopping. Leo Boring. Lucy OK, no swimming, no shopping. I know! Let's go to the cinema. Leo The cinema?
[Image description: Photograph showing two people in a bedroom setting]
Lucy Yes, there's a great new pirate film at the Odeon. Leo No, I hate pirates. Lucy I give up!
Page 29
3 Read and circle T (True) or F (False).
[Image description: Two photographs of children labeled Lucy and Leo with speech bubbles]
1 I'm bored. T / F
2 Let's go to the cinema. T / F
3 Swimming is a bad idea. T / F
4 A pirate film? No, thanks! T / F
USEFUL PHRASES Making suggestions
4 Write the words in the correct order to make sentences.
1 shopping / we / go / could We could go shopping. 2 swimming / go / let's .....................................................................................................
? What do you think? Complete the sentence.
Lucy and Leo go .......................................................................................................................................
MOBILE HOMEWORK
▶️ Watch part 2 of the video and check your answer.
SPEAKING STRATEGY Responding
5 Look at the responses. Draw ☺ or ☹ next to each one.
Boring. ☐ Good idea! ☐ I love swimming. ☐ I hate swimming. ☐
6 C H O I C E S
👥 A Work in pairs.
A Suggest an activity from 1. → B Respond.
A Let's go swimming. B Good idea!
👥 B ROLE PLAY: Work in pairs. Look at your role card and act out.
Student A You are bored. Tell student B and suggest: • go to the cinema • go to the theme park • go skateboarding • go shopping • go swimming • go bowling
Student B You are bored. Listen to student A's suggestions and respond: • the cinema – • skateboarding – • swimming – • bowling – • the theme park – • shopping –
🔵 WB p. 28


----- WB: WB Unit 3 Pirates.txt -----
Unit 3 Pirates
Page 22–23
UNDERSTANDING VOCABULARY
Parts of the body / Pirates
1 Kreise die restlichen 12 Wörter für die Körperteile ein (→). Dann schreib sie auf.
L E G H B E A R D D
D N M H U L F I M F
S H O U L D E R Y O
O L U O A F H Y W O
A D T T T X F E E T
R A H H O W D P A A
M E T N O S E J R Y
N Y Q H T Y M F P F
T E E T H S H A I R
……………………………… leg
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
………………………………
2 Kreise die Wörter ein und schreib sie auf.
hookshippiratewoodenlegtreasuresea
[Image description: A cartoon pirate with a hook for a hand stands on a beach. He has a parrot on his shoulder. A pirate ship with a skull flag is in the sea behind him. A treasure chest full of gold is open on the sand. Numbers 1–6 point to different objects.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
5 …………………………
6 …………………………
3 Schau dir das Bild an und schreib die Zahlen in die Kästchen.
□ big
□ small
□ tall
□ short
□ long
□ short
[Image description: Two cartoon pirates of different sizes. Numbers 1–6 are placed next to body parts and animals to compare size and length.]
USING VOCABULARY
Parts of the body
4 Schreib die richtigen Wörter.
[Image description: A pirate girl stands on an island holding a map. Numbers 1–11 point to parts of her body.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
5 …………………………
6 …………………………
7 …………………………
8 …………………………
9 …………………………
10 …………………………
11 …………………………
5 Schau dir das Bild an und schreib die richtigen Wörter aus 3.
[Image description: Two pirates and two monkeys. Numbers 1–6 point to different characters.]
1 …………………………
2 …………………………
3 small
4 …………………………
5 …………………………
6 …………………………
Page 24–25
UNDERSTANDING GRAMMAR
have got – haven’t got
6 Schau dir die Bilder an und kreise in jedem Satz die richtige Form ein.
[Image description: Six small pictures showing people, animals and objects.]
1 He hasn’t / haven’t got long hair.
2 She hasn’t / haven’t got a car.
3 It hasn’t / haven’t got legs.
4 I hasn’t / haven’t got a computer.
5 We hasn’t / haven’t got a big house.
6 He hasn’t / haven’t got apples. He’s got bananas.
USING GRAMMAR
have got – haven’t got
7 Schau dir die Bilder an und schreib die Sätze.
1 She / red hair
She’s got red hair.
2 They / new car
……………………………………
3 You / laptop
……………………………………
4 We / big feet
……………………………………
5 He / dog
……………………………………
6 I / a skateboard
……………………………………
8 Bring die Wörter in die richtige Reihenfolge und schreib die Fragen.
1 got / a / has / pen? / he
Has he got a pen?
2 they / laptop? / got / have / a
……………………………………
3 you / problem? / have / a / got
……………………………………
4 green / got / she / eyes? / has
……………………………………
5 you / have / a / dog? / big / got
……………………………………
6 he / hair? / long / got / has
……………………………………
7 she / hair? / got / red / has
……………………………………
8 house / your / garage? / a / got / has
……………………………………
9 Schreib die Antworten.
1 Has Ronald got black hair? (✗)
No, he hasn’t.
2 Have you got a dog? (✓)
Yes, I have.
3 Has Aileen got a cat? (✗)
……………………………………
4 Have they got a computer in their house? (✗)
……………………………………
5 Have they got hamburgers in this restaurant? (✓)
……………………………………
6 Has the house got a garage? (✓)
……………………………………
10 Schreib die Antworten.
1
A Has Peter got a cat?
B Yes, he has. It’s black and white.
2
A Have they got black hair?
B ………………………… It’s brown.
3
A Has Mary got a laptop?
B ………………………… – and it’s new!
4
A Have you got a new teacher?
B ………………………… – she’s great!
5
A Have we got apples?
B ………………………… . We’ve got bananas!
11 Wer hat was? Schreib die Sätze.
[Image description: Seven children named Sheila, Mary, Aylin, James, Ken, Julia, Marcus. Lines connect them to objects: a ship, a laptop, a hat, an apple, a cat, a ball, a crocodile.]
Sheila has got a cat.
……………………………………
……………………………………
……………………………………
……………………………………
……………………………………
12 Beantworte die Fragen zu deiner Person.
Have you got long hair? …………………………
Have you got short hair? …………………………
Have you got blue eyes? …………………………
Have you got brown eyes? …………………………
Have you got a sister? …………………………
Have you got a brother? …………………………
Have you got a cat? …………………………
Have you got a tablet? …………………………
13 Schreib einen kurzen Text über dich selbst.
Hello, my name is ……………………………………… .
I have got ……………………………………… .
I haven’t got ……………………………………… .
Page 26–27
14 Mal die Piraten an. Beschreibe Ruby und Ronald.
[Image description: Two black-and-white drawings. Ruby is a female pirate with a hat and a cat on her shoulder. Ronald is a male pirate with a beard, a pipe and a wooden leg.]
READING & WRITING
Understanding what other people have(n’t) got / Describing other people
15 Wer hat was? Hake T (True/richtig) oder F (False/falsch) an.
[Image description: Greybeard, Tamara, Fred and Frank with various objects connected by lines.]
1 Tamara has got a lot of books. T ☐ F ☐
2 Tamara has got a small crocodile. T ☐ F ☐
3 Tamara has got a laptop. T ☐ F ☐
4 Greybeard hasn’t got a bed. T ☐ F ☐
5 Greybeard has got a big ice cream. T ☐ F ☐
6 Fred and Frank have got two monkeys. T ☐ F ☐
7 Fred and Frank haven’t got a laptop. T ☐ F ☐
8 Fred and Frank have got lots of books. T ☐ F ☐
16 CHOICES
A Lies die Texte und ordne sie den Bildern zu. Mal dann die Bilder an.
1
2
3
Steve is 13 years old. He’s from Chicago.
He has got short brown hair and blue eyes.
He has got a small mouth and a small nose.
Sara is 13 years old. She’s from Berlin.
She has got short blonde hair and blue eyes.
She has got a big mouth and a small nose.
Mel is 12 years old. She is from London.
She has got long brown hair and green eyes.
She has got a small mouth and a big nose.
B Schreib über einen Freund / eine Freundin.
My friend ……………………………………… is ……………………………………… .
He/She is from ……………………………………… .
He/She has got ……………………………………… .
He/She has got a ……………………………………… .
17 Bring die Dialoge in die richtige Reihenfolge. Dann höre dir die Dialoge an und überprüfe deine Arbeit.
DIALOGUE 1
☐ A How old is he?
☐ A Have you got a brother?
☐ A What’s his name?
☐ B He’s 12.
☐ B Peter.
☐ B Yes, I have.
DIALOGUE 2
☐ A What’s its* name?
☐ A Have you got a dog?
☐ A Blackie, hmm. What colour is it?
☐ A And how old is it?
☐ B It is black.
☐ B Yes, we have.
☐ B Erm – eight.
☐ B Blackie.
Page 28–29
LISTENING
Understanding what other people have got
18 Höre dir die Gedichte an und ergänze die Namen.
Belinda
Pat
Lucinda
Ben
[Image description: Four pirates on a ship. Numbers 1–4 mark each character.]
1 …………………………
2 …………………………
3 …………………………
4 …………………………
DIALOGUE WORK
Making and responding to suggestions
19 Bring die Sätze in die richtige Reihenfolge. Dann höre dir den Dialog an und überprüfe deine Arbeit.
Ben No, I hate skateboarding. Let’s go bowling.
Ben No, I hate pirate films. We could go swimming.
Ben Let’s go shopping.
Ben OK, let’s go to the swimming pool then.
Ben Is there a good film on?
Mia Yes, a pirate film.
Mia No, I hate shopping. Let’s go skateboarding.
Mia Yes, swimming is a good idea.
Mia No, I hate bowling. Let’s go to the cinema.
20 Ordne jeweils zwei Sätze einander zu. Setze die Zahlen 1–6 ein.
1 I’m bored.
2 There’s a pirate film at the Roxy.
3 We could go shopping.
4 Let’s do something.
5 Let’s go to the cinema.
6 We could go swimming.
☐ Pirates are boring.
☐ OK, but what?
☐ Good idea. What film is on?
☐ Me too.
☐ Yes, I love swimming.
☐ Good idea. I like shopping.
Page 30
WORD FILE
The body
[Image description: A cartoon man with labels pointing to body parts.]
finger
ear
nose
hair
eye
mouth
beard
right arm
left arm
shoulder
leg
foot
feet
[Image description: A tooth and teeth.]
tooth
teeth
[Image description: Animals showing size and length.]
tall
short
big
small
short
long
MORE Words and Phrases
also – Tamara is also a pirate.
famous – Greybeard is a famous pirate.
him – Peter is nice. We like him.
his – His pirate name is Blackbeard.
ship – Greybeard has got a big ship.
to be scared (of) – The kids are scared of the ship.
very – They are very scared.
strong – Greybeard hasn’t got a strong left leg.
captain – The captain has got a blue ship.
have got / has got – I have got brown hair. Tamara has got red hair.
pretty – Polly is a pretty pirate.
purple – She has got purple hair.
a lot of / lots of – She has got a lot of books about pirates.
bed – Dana is in bed now.
dream – It’s a dream!
tired – Dana is in bed. She is tired.
to guess – Listen and guess the pirate.
It’s your turn.
brother – Fred is Frank’s brother.
blonde – He has got blonde hair.
real – His left leg isn’t real. It’s wooden.
short – Greybeard is short.
tall – Tamara is tall.
wrong – Say what’s wrong.
true – Is it true?

```

## Output contract

Write `content/corpus/units/g1-u03/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u03",
  "briefBank": "4c3046921b06",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u03.s.have-got",
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
