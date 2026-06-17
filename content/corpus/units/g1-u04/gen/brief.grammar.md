# Grammar generation brief — g1-u04 (MORE! 1, Unit 4)

<!-- domigo:gen grammar g1-u04 bank=07ed93df8cb9 prompt=4b9164076103 -->

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

### `g1u04.s.to-be-negative` — to be (negative) + adjectives (to be – sein (verneinte Form) mit Adjektiven)

The negative of be (am not / isn't / aren't), typically with an adjective after it.

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [to-be-negative-forms]: Make the negative of be with am not / isn't (is not) / aren't (are not). Note: I'm not (there is no amn't).
  - DE: Die Verneinung von be bildest du mit am not / isn't (is not) / aren't (are not). Beachte: I'm not (es gibt kein amn't).
  - "I'm not (am not) happy." — "Ich bin nicht glücklich."
  - "He isn't (is not) cold." — "Ihm ist nicht kalt."
  - "They aren't (are not) angry." — "Sie sind nicht wütend."
- rule [adjectives-be-position]: An adjective comes after be and never changes for singular, plural or gender.
  - DE: Ein Adjektiv steht nach be und verändert sich nie für Einzahl, Mehrzahl oder Geschlecht.
  - "The boy is tall. The girls are tall." — "Der Bub ist groß. Die Mädchen sind groß."
  - "I am very happy." — "Ich bin sehr glücklich."

common errors:
- Putting very before be instead of before the adjective.: ✗ "I very am tired." → ✓ "I am very tired."
- Leaving out be before an adjective.: ✗ "She very nice." → ✓ "She is very nice."

SB box `g1/sb/SB Unit 4- Emotions.txt#grammar-1` — ▶️ to be (negative):
```
So bildest du die Verneinung mit to be:
I'm not (am not) happy. You aren't (are not) excited. He/She/It isn't (is not) cold. We aren't (are not) hungry. You aren't (are not) hot. They aren't (are not) angry.
[Image description: Illustration of a polar bear and penguin with speech bubble "Are you cold?"]
▶️ Questions with to be
So bildest du Fragen und Antworten mit den verschiedenen Formen von be:
?	+	–
Are you happy?	Yes, I am.	No, I'm not.
Is he happy?	Yes, he is.	No, he isn't.
Is she happy?	Yes, she is.	No, she isn't.
Is it happy?	Yes, it is.	No, it isn't.
Are you happy?	Yes, we are.	No, we aren't.
Are they happy?	Yes, they are.	No, they aren't.

⏪ Now go back to page 30. Check ☑ with a partner what you know / can do.
🔵 WB p. 33, 34, 35 🌐 CYBER Homework 12
```

v1 seed items (UNTRUSTED):
- `m1-u4-adjectives-be-gf-001` [gap-fill, d1]: p="I ___ tired. (be)" c="am" a=["am","'m"] ds=["is","are","be"]
- `m1-u4-adjectives-be-gf-002` [gap-fill, d1]: p="The film ___ interesting. (be)" c="is" a=["is","'s"] ds=["am","are","be"]
- `m1-u4-adjectives-be-gf-003` [gap-fill, d2]: p="They ___ very happy today. (be)" c="are" a=["are","'re"] ds=["is","am","be"]
- `m1-u4-adjectives-be-gf-004` [gap-fill, d3]: p="She ___ very ___. (be + hungry)" c="is ... hungry" a=["is ... hungry","'s ... hungry"] ds=["is ... hungrily","very ... is hungry","has ... hungry"]
- `m1-u4-adjectives-be-gf-005` [gap-fill, d4]: p="The boys ___ loud. The girl ___ quiet. (be — two gaps!)" c="are ... is" a=["are ... is"] ds=["is ... are","is ... is","are ... are"]
- `m1-u4-adjectives-be-gf-006` [gap-fill, d4]: p="He ___ angry. He ___ very nice. (negative)" c="isn't ... is" a=["isn't ... is","is not ... is"] ds=["aren't ... are","don't ... is","not is ... is"]
- `m1-u4-adjectives-be-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="I am very tired." a=["I am very tired."] ds=["I very am tired.","I am tired very.","Very I am tired."]
- `m1-u4-adjectives-be-mc-002` [gap-fill, d2]: p="The dogs are ___." c="loud" a=["loud"] ds=["louds","louden","louding"]
- `m1-u4-adjectives-be-ec-001` [error-correction, d2]: p="Find and fix the mistake: She very nice." c="She is very nice." a=["She is very nice.","She's very nice.","is"] ds=[]
- `m1-u4-adjectives-be-sb-002` [sentence-building, d3]: p="Put the words in the correct order: very / am / I / tired" c="I am very tired." a=["I am very tired.","I am very tired"] ds=[]
- `m1-u4-adjectives-be-ec-003` [error-correction, d4]: p="Find and fix the mistake: The children are happys." c="The children are happy." a=["The children are happy.","happy"] ds=[]
- `m1-u4-adjectives-be-tf-001` [transformation, d2]: p="You just had a big lunch, so you're not hungry now. Make this negative: I am hungry. → I ___ hungry." c="am not" a=["am not","'m not","I am not hungry.","I am not hungry","I'm not hungry."] ds=[]
- `m1-u4-adjectives-be-tf-002` [transformation, d3]: p="Your friend looks upset. You want to check. Make this a question: He is sad. → ___ he sad?" c="Is" a=["Is","Is he sad?","Is he sad"] ds=[]
- `m1-u4-adjectives-be-tr-001` [translation, d2]: p="🇩🇪 Ich bin muede." c="I am tired." a=["I am tired.","I'm tired."] ds=[]
- `m1-u4-adjectives-be-tr-002` [translation, d4]: p="🇩🇪 Bist du hungrig? — Nein, ich bin nicht hungrig." c="Are you hungry? — No, I'm not hungry." a=["Are you hungry? — No, I'm not hungry.","Are you hungry? — No, I am not hungry.","Are you hungry? — No, I'm not hungry"] ds=[]
- `m1-u4-adjectives-be-sb-001` [sentence-building, d2]: p="Put the words in the correct order: very / she / is / happy" c="She is very happy." a=["She is very happy.","She's very happy."] ds=[]
- `m1-u4-adjectives-be-mt-001` [matching, d2]: p="Match the emoji to the adjective: 1) 😊 2) 😢 3) 😡 4) 😴 — a) tired b) angry c) happy d) sad" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}"] ds=[]
- `m1-u4-adjectives-be-gf-007` [gap-fill, d2]: p="The film ___ (be) really boring." c="is" a=["is","was"] ds=["are","am","be"]
- `m1-u4-adjectives-be-gf-008` [gap-fill, d2]: p="The children ___ (be) very happy today." c="are" a=["are"] ds=["is","am","be"]
- `m1-u4-adjectives-be-gs-001` [group-sort, d2]: p="Sort: adjective or noun?" c="{\"Adjective\":[\"happy\",\"tall\",\"tired\",\"hungry\",\"loud\"],\"Noun\":[\"dog\",\"school\",\"teacher\",\"pizza\",\"book\"]}" a=[] ds=[]

### `g1u04.s.to-be-questions` — Questions with to be (Fragen mit to be)

Forming yes/no questions and short answers with the verb be by swapping subject and verb.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [to-be-questions-form]: Make questions with be by swapping the subject and be: Am I …? / Is he …? / Are they …? Short answers: Yes, I am. / No, he isn't.
  - DE: Fragen mit be bildest du, indem du Subjekt und be tauschst: Am I …? / Is he …? / Are they …? Kurzantworten: Yes, I am. / No, he isn't.
  - "Are you happy? – Yes, I am." — "Bist du glücklich? – Ja."
  - "Is she happy? – No, she isn't." — "Ist sie glücklich? – Nein."

common errors:
- Adding do to make a be question.: ✗ "Do you are happy?" → ✓ "Are you happy?"
- Using a contraction in an affirmative short answer.: ✗ "Yes, I'm." → ✓ "Yes, I am."

SB box `g1/sb/SB Unit 4- Emotions.txt#grammar-1` — ▶️ to be (negative):
```
So bildest du die Verneinung mit to be:
I'm not (am not) happy. You aren't (are not) excited. He/She/It isn't (is not) cold. We aren't (are not) hungry. You aren't (are not) hot. They aren't (are not) angry.
[Image description: Illustration of a polar bear and penguin with speech bubble "Are you cold?"]
▶️ Questions with to be
So bildest du Fragen und Antworten mit den verschiedenen Formen von be:
?	+	–
Are you happy?	Yes, I am.	No, I'm not.
Is he happy?	Yes, he is.	No, he isn't.
Is she happy?	Yes, she is.	No, she isn't.
Is it happy?	Yes, it is.	No, it isn't.
Are you happy?	Yes, we are.	No, we aren't.
Are they happy?	Yes, they are.	No, they aren't.

⏪ Now go back to page 30. Check ☑ with a partner what you know / can do.
🔵 WB p. 33, 34, 35 🌐 CYBER Homework 12
```

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone
- **g1-u03**: finger, ear, nose, hair, eye, mouth, beard, right arm, left arm, shoulder, leg, foot, feet, tooth, teeth, tall, short, big, small, long, also, famous, him, his, ship, to be scared (of), strong, captain, have got / has got, pretty, purple, week, again, back, to paint, sister, boy, girl, man (pl men), woman (pl women), Her name is …, His name is …
- **g1-u04**: cold, angry, happy, scared, excited, hot, bored, sad, hungry, nervous, tired, proud, morning, lunchtime, afternoon, evening, night, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, after, day, end, fun, Go away!, to happen, show, a day in the life of, to be asleep, early, life, still, story, today, Are you OK?, homework (no pl), into, Oh dear!, room, bad, Don't be late., tomorrow, birthday, friend, Be yourself., no one else, bottle, to get back, mad, magic, to break, to go to sleep, because, It's me., Try it!, Let go!, What's happening?

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Baker, Befehlsformen, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, California, Cambridge, Caribbean, Carina, Carl, Chloe, Classroom, Dana, Dave, David, Dialog, Dialoge, Don, England, English, False, Fido, Frank, Fred, Freddy, Gina, Good, Gordon, Great, Greybeard, Guess, Harry, Homework, Hook, Imperatives, Irregular, Jenny, Jill, Julia, Leah, Leo, London, Lucy, Mail, Manchester, Mary, Mike, Miss, Mr, Mum, Nibbs, Nice, Nomen, Number, Numbers, Omar, Palace, Peter, Pirates, Plural, Polly, Prepositions, Put, Rajit, Reihenfolge, Richard, Ronald, Saying, School, Sue, Tamara, Text, Tick, Toby, Tock, Tom, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 4- Emotions.txt -----
Page 30
Unit 4: Emotions
At the end of unit 4 ...
you know ☐ 11 words for feelings ☐ the days of the week and times of the day ☐ how to make questions with the verb to be ☐ how to use the negative form of to be
you can ☐ talk about your and other people's feelings ☐ understand others talking about their feelings and week ☐ talk and write about your week
VOCABULARY Feelings
1 Follow the lines and say the sentences.
John's happy.
[Image description: A web diagram connecting character names (Linda, John, Paul, Vanessa, Jason, Fiona, Lucy, Wayne, Emma, Becky, Victor) with feeling words (cold, hot, bored, excited, angry, happy, proud, nervous, sad, scared, hungry) using interconnecting lines]
1/32 🔊 2 Listen and circle the correct words.
1 He is cold / hot. 2 She is angry / sad. 3 They are happy / sad. 4 He is bored / scared. 5 She is proud / hungry. 6 They are bored / excited. 7 He is angry / happy. 8 She is nervous / excited. 9 He is hot / proud.
READING
1/33 🔊 3 a Look at the story on page 31. Where are they? .....................................
b Listen to the story. Then read it and answer the questions.
1 Is Mike happy at the end of the story? 2 Is Miss Baker angry at the end of the story? 3 Is Mike's mum proud at the end of the story?
🔵 WB p. 31, 32 🌐 CYBER Homework 10 (Revision)
Page 31
The school play
[Image description: Comic-style story panels showing scenes from a school play]
I've got a part in the school play. I'm Harry Potter!
That's great!
Mike is excited.
The next day. On the stage.
I haven't got many friends.
No, no, no, Mike. In this scene Harry isn't happy. He's sad!
Miss Baker isn't happy.
Be quiet, Malfoy!
No, no, no, Mike. Now Harry is angry. He isn't happy!
Miss Baker still isn't happy.
Please, go away!
In this scene Harry isn't happy. He's scared.
Miss Baker still isn't happy.
Later at home.
It's no good, Mum. I'm terrible.
No, you're not, Mike. Let me help you.
It's a lot of work, but it's fun.
The big day.
There are a lot of people!
Mike is nervous.
After the play.
Bravo!
Great!
Fantastic!
Miss Baker is proud. Mum is proud. Mike is happy. He's very happy.
Page 32
READING
1/34 🔊 4 a Look. Find out the name of the city.
b Listen to the story. Then read it.
A day in the life of Richard
[Image description: Illustrations showing a royal guard at Buckingham Palace throughout a day]
Richard is a guard at Buckingham Palace. He has got a red jacket and a big black hat. It's early morning. It's wet. Richard's cold.
There are five tourists. The tourists are excited. They've got a camera. Is Richard excited? No, he isn't. He's angry.
It's lunchtime. The tourists have got hamburgers. Richard hasn't got a hamburger. Richard isn't happy. He's hungry.
It's afternoon. The sun is out. Richard isn't cold now. He's hot. He's really hot!
It's evening. Is Richard tired? No, he's just bored.
Richard isn't at work now. Richard's at home. Is he happy? No idea. He's asleep.
5 How many of these tasks can you do?
Choose the correct answer. 1 Richard's hat is red / black / brown. 2 Richard is wet / cold / tired. 3 The tourists are bored / happy / excited.
Circle T (True) or F (False). 4 All the tourists have got cameras. T / F 5 One tourist has got a hamburger. T / F 6 Richard has got no lunch. T / F
Complete the sentences. 7 When the sun is out, Richard ...................................................... . 8 In the evening, Richard isn't ......................................................... . 9 Now, he's .................................................................................. .
🔵 WB p. 34, 35
Page 33
SPEAKING Talking about feelings
1/35 🔊 6 C H O I C E S
Listen and put the two dialogues in the correct order. Act one of them out.
👥 A DIALOGUE 1
☐ Oh dear. Why? ☐ How are you today? ☐ I've got a lot of homework. ☐ I'm not very happy.
👥 B DIALOGUE 2
☐ Is it big? ☐ Are you OK? ☐ Scared? Why? ☐ Oh dear. Why?
☐ No, we aren't. ☐ There's a rat in our room. ☐ We're very scared. ☐ Yes, very big.
👥 7 Work in pairs. Draw on each face how the kids are feeling. Then find out about your partner's kids and draw.
[Image description: Six blank face outlines and character illustrations for Student A (Liz, Ben, Peter and Ahmet, Karen) and Student B (Sue, Noah, Yasmin and Jane, Jim)]
A Is ... happy? B Yes, he/she is.
A Is ... happy? B No, he/she isn't. He/She is sad.
A Are ... and ... happy? B Yes, they are. / No, they aren't.
SOUNDS RIGHT Days of the week
1/36 🔊 8 A chant. Listen and repeat.
Monday, Tuesday, Wednesday – cool.
Thursday, Friday – no more school!
Saturday and Sunday – great!
Tomorrow's Monday – don't be late!
[Image description: Cartoon illustrations of days of the week personified as characters celebrating]
🔵 WB p. 32, 33, 36 🌐 CYBER Homework 11
Page 34
9 Look at Gina's diary. Write the days of the week under the pictures.
[Image description: An open diary showing weekly schedule with various activities including football, school play, birthday, ballet, disco, tennis, and party]
1 .................Tuesday.................
[Image description: Seven numbered illustrations showing different activities throughout the week]
2 .............................................. 3 .............................................. 4 ..............................................
5 .............................................. 6 .............................................. 7 ..............................................
👤 10 Work in pairs. Talk about each picture in 9.
It's Monday. Gina is tired. It's Tuesday. Gina is ...
A SONG 4 U
1/37+38 🔊 11 Listen and sing.
Just be you
I am happy. I'm not sad. Things are good. They're not so bad.
I am proud of who I am. I'm not scared, I've got a plan.
Just be you. It's what you do. Be yourself and no one else. Happy, scared, bored or sad. It's who you are. So just be glad.
I'm excited for today. I've a feeling I know the way.
I'm so happy. I'm OK. I'm with my friends at school today.
Just be you...
[Image description: Cartoon illustration showing diverse children including one in a wheelchair]
🔵 WB p. 32
Page 35
LISTENING
1/39 🔊 12 Listen to Bob and Jill. Sing along.
THE MAGIC BOTTLE
I'm a monster, my name's Bob. I'm a monster and I rob*, yeah I rob, rob, rob feelings, hey, hey, hey, every day, I rob feelings.
I am Jill, Jill, Jill and I will*, will, will get the feelings back. I am good, Bob is bad. I am nice, Bob is mad*.
VOCABULARY: *rob – stehlen; will – werden; mad – zornig, wütend
1/40 🔊 13 Listen to the radio play The magic bottle and complete the sentences with the words from the box.
sad bored happy tired angry
1 Tim is .................................... . 2 Lilian is ................................. . 3 Rose is .................................. .
4 Jill is ...................................... . 5 Bob is ..................................... .
1/40 🔊 14 Put the pictures in the correct order. Then listen again and check.
[Image description: Six comic panels showing scenes with speech bubbles "So boring!", "Later.", "Zzzzz", "Where are my books?", "Kitty?", and "WHERE ARE MY BOOKS?"]
🔵 WB p. 37
Page 36
WRITING
15 C H O I C E S
A Use Gina's diary in 9 to complete the sentences.
1 I've got ................................................ on Thursday. 2 It's ................................................ today. I've got football and I'm tired. 3 I'm happy because it's my birthday on ................................................ . 4 It's the school play on ................................................ and I'm nervous. 5 I'm so excited there's a ................................................ on ................................................ .
B Choose four days from your week and write a sentence for each.
..................................................................................................................................................................... ..................................................................................................................................................................... ..................................................................................................................................................................... .....................................................................................................................................................................
GRAMMAR
▶️ to be (negative)
So bildest du die Verneinung mit to be:
I'm not (am not) happy. You aren't (are not) excited. He/She/It isn't (is not) cold. We aren't (are not) hungry. You aren't (are not) hot. They aren't (are not) angry.
[Image description: Illustration of a polar bear and penguin with speech bubble "Are you cold?"]
▶️ Questions with to be
So bildest du Fragen und Antworten mit den verschiedenen Formen von be:
?	+	–
Are you happy?	Yes, I am.	No, I'm not.
Is he happy?	Yes, he is.	No, he isn't.
Is she happy?	Yes, she is.	No, she isn't.
Is it happy?	Yes, it is.	No, it isn't.
Are you happy?	Yes, we are.	No, we aren't.
Are they happy?	Yes, they are.	No, they aren't.

⏪ Now go back to page 30. Check ☑ with a partner what you know / can do.
🔵 WB p. 33, 34, 35 🌐 CYBER Homework 12
Page 37
THE STORY OF THE STONES 2
▶️ Don't worry – it's me!
1 Remember and say: The green stone is for ... The orange ...
2 Can you say the rhyme of the stones?
I sl i e. I sl i q. I sl i b. W o s. H w t c d!
▶️ 3 Watch episode 2. Write the names of the animals.
rat eagle tiger
[Image description: Three animal illustrations - an eagle, a rat, and a tiger]
1 .............................................. 2 .............................................. 3 ..............................................
EVERYDAY ENGLISH
4 Match the pictures with the phrases. Write the numbers.
1 Try it! 2 Let go! 3 What's happening?
[Image description: Three comic-style panels showing action scenes]


----- WB: WB Unit 4 Emotions.txt -----
Unit 4 Emotions
Page 31
UNDERSTANDING VOCABULARY
Feelings / Days of the week
1 Circle the words and write them under the pictures.
angry bored cold happy hot hungry sad scared proud
1 She is ................................
2 She is ................................
3 They are ..............................
4 He is ................................
5 She is ................................
6 They are ..............................
7 He is ................................
8 He is ................................
9 They are ..............................
Page 32
2 Look at Tom’s diary. Write the days of the week.
1 Monday
2 T.................................
3 W.................................
4 T.................................
5 F.................................
6 S.................................
7 S.................................
USING VOCABULARY
Feelings / Days of the week
3 Match to make dialogues.
1 I’m tired.
2 I’m hungry.
3 I’m bored.
4 I’m hot.
5 I’m cold.
Eat a sandwich.
Close the door.
Sit down.
Open the window.
Read a good book.
4 Look at the pictures and write sentences about Mr Nibbs.
1 It’s Monday. Mr Nibbs is .................
2 It’s ................ Mr Nibbs ................
3 It’s .........................................
4 ...............................................
5 ...............................................
6 ...............................................
5 Answer the questions with Yes, he is or No, he isn’t.
1 It’s Saturday. Is Mr Nibbs hungry?
...............................................
2 It’s Wednesday. Is Mr Nibbs happy?
...............................................
3 It’s Monday. Is Mr Nibbs sad?
...............................................
4 It’s Thursday. Is Mr Nibbs angry?
...............................................
5 It’s Tuesday. Is Mr Nibbs excited?
...............................................
6 It’s Friday. Is Mr Nibbs cold?
...............................................
Page 33
UNDERSTANDING GRAMMAR
to be (negative) / questions with to be
6 Match the questions and answers.
1 Is it cold?
2 Are you hungry, Sue?
3 Are we late?
4 Is she angry?
5 Are they excited?
6 Is he English?
Yes, we are.
No, she isn’t.
Yes, it is.
Yes, he is.
No, I’m not.
Yes, they are.
7 Complete the dialogues with the words from the box.
I’m not
isn’t
isn’t
isn’t
aren’t
aren’t
1
A Look at that small dog!
B It ................ a dog. It’s a cat!
2
A Hi, James!
B I ................ James. I’m Mike.
3
A They are from London.
B No, they ................ from London.
They are from Vienna.
4
A Alison is angry.
B She ................ angry. She is bored.
5
A Is today Wednesday?
B No, it ................ Wednesday today.
It’s Thursday.
6
A Yes — I’m right!
B You ................ right. You are wrong.
7
A We are late!
B No, we ................ late. It’s only eight o’clock.
USING GRAMMAR
to be (negative) / questions with to be
8 Complete the questions and short answers.
1
A ................ Nadia from London?
B No, she ................ .
2
A ................ you nervous?
B Yes, I ................ .
3
A ................ I right?
B No, you ................ .
4
A ................ it a cat?
B Yes, it ................ .
5
A ................ they excited?
B Yes, ................ .
6
A ................ we right?
B No, ................ .
7
A ................ Steve sixteen?
B No, ................ .
8
A ................ you hot?
B No, ................ .
9 Look at the pictures. Complete the questions and short answers.
1 ................ Jenny in London?
No, she ................ .
2 ................ it Sarah’s dog?
Yes, it ................ .
3 ................ Steve twelve?
No, he ................ .
4 ................ they hungry?
Yes, they ................ .
5 ................ you nervous?
Yes, I ................ .
6 ................ we late?
Yes, you ................ .
Page 34
10 Follow the lines and write the sentences.
1 Sharon isn’t tired. She’s bored.
2 ...............................................
3 ...............................................
4 ...............................................
5 ...............................................
6 ...............................................
11 Look at the story A day in the life of Richard on page 32 in the Student’s Book and correct the sentences.
1 It’s early morning. Richard is hot.
...............................................
2 The tourists are hungry.
...............................................
3 It’s lunchtime. Richard is thirsty*.
...............................................
4 The sun is out. Richard is angry.
...............................................
5 It’s late. Richard is tired.
...............................................
6 Richard’s in bed. He’s sad.
...............................................
VOCABULARY: *thirsty – durstig
12 Write short answers.
1 Are Brian and Nadia here? (✓)
...............................................
2 Are you cold? (✗)
...............................................
3 Is it your dog? (✗)
...............................................
4 Is she bored? (✓)
...............................................
5 Is it Friday today? (✓)
...............................................
6 Am I right? (✗)
...............................................
Page 35
READING & WRITING
Talking about your and other people’s feelings / Writing about your week
13 Look at the pictures and write dialogues.
1
A How is William?
B He is nervous.
2
A ...............................................
B ...............................................
3
A ...............................................
B ...............................................
4
A ...............................................
B ...............................................
5
A ...............................................
B ...............................................
6
A ...............................................
B ...............................................
14 Write your answers to the questions.
1 What day of the week is it today?
...............................................
2 What day is tomorrow?
...............................................
3 Are you happy today?
...............................................
4 Are you hungry?
...............................................
15 Complete the dialogue with the correct words.
Andy Hello, Tony. Hello, Emily. How 1 ................ you today?
Emily We 2 ................ very excited.
Andy Great! Why 3 ................ you excited?
Tony Tomorrow 4 ................ the weekend!
Andy Oh, 5 ................ it Friday today?
Emily Yes, it 6 ................ . 7 ................ you happy, Andy?
Andy No, I 8 ................ . I 9 ................ very bored.
Tony Why?
Andy Saturday 10 ................ a good day for me.
Emily Why?
Andy Mum and I go shopping.
Page 36
16 CHOICES
A 1 Put the dialogue in the correct order.
A Great! Why?
B There’s no homework today!
A How are you today?
B I’m very happy.
2 Complete the dialogues with the sentences from the box.
Why not?
How are you today?
I’m very tired.
DIALOGUE 1
A 1 ...............................................
B Not so good.
A 2 ...............................................
B I’m nervous. There’s a test tomorrow.
DIALOGUE 2
A How are you today?
B 3 ...............................................
A Then go to bed.
B OK.
B 1 Put the dialogue in the correct order.
A OK. Read a good book.
A How are you today?
A Oh dear. Why are you bored?
B But I haven’t got a good book!
B There’s nothing* good on TV.
B I’m very bored.
2 Write your own dialogue.
A How are you today?
B ...............................................
A ...............................................
B ...............................................
A ...............................................
B ...............................................
VOCABULARY: *nothing – nichts
Page 37
LISTENING & DIALOGUE WORK
Understanding others talking about their feelings and week
17 Listen to Sara. Match the days of the week with her feelings.
1 Monday
2 Tuesday
3 Wednesday
4 Thursday
5 Friday
6 Saturday
7 Sunday
excited
sad
tired
nervous
bored
angry
happy
VOCABULARY: *get up – aufstehen
18 Complete the dialogues with the sentences from the box. There are two extra sentences.
No, I’m not.
I’m angry.
I’m tired.
Are you OK?
It’s my birthday.
No, they aren’t.
I’m excited.
They’re from Spain.
Yes, we are.
We’re from France.
Oh, I’m sorry.
1
Paula Hi, Toby. How are you?
Toby ...............................................
Paula Why?
Toby ...............................................
Paula Happy Birthday, Toby.
Toby Thank you.
2
Bob Are you happy, Olivia?
Olivia ...............................................
Bob What’s the problem?
Olivia You’ve got my sandwich in your mouth.
Bob ...............................................
3
Clara ...............................................
Ben No, I’m not.
Clara Oh dear. What’s the problem?
Ben ...............................................
Clara Go to bed.
Ben That’s a good idea.
4
Oliver Are they from Italy?
Tim ...............................................
Oliver Where are they from?
Tim ...............................................
19 Listen and check your answers.
Page 38
WORD FILE
Feelings
cold
angry
happy
scared
excited
hot
bored
sad
hungry
nervous
tired
proud
Times of the day
morning
lunchtime
afternoon
evening
night
Days of the week
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday
Sunday
Page 39
MORE Words and Phrases
after – After school I meet my friends. – nach
day – On the big day, Mike is nervous. – Tag
end – At the end of the play, Mike is very happy. – Ende
fun – It’s great fun. – Spaß
Go away! – Geh weg!
to help – Let me help you. – helfen
home – Mike is at home. – zu/nach Hause; Zuhause
It’s no good. – Es hat keinen Zweck.
mum – She is his mum. – Mama, Mutti
next – The next day. – nächster/nächste/nächstes
still (not) – Miss Baker still isn’t happy. – immer noch (nicht)
a day in the life of – The story is about a day in the life of Richard. – ein Tag im Leben von
to be asleep – He’s in bed and he’s asleep. – schlafen
early – It’s early. He’s still in bed. – früh
life (pl lives) – Elephants have a long life. – Leben
lunchtime – It’s lunchtime. He’s hungry. – Mittagspause
sun – The sun is out. – Sonne
Are you OK? – Geht’s dir/euch/Ihnen gut?
homework (no pl) – We have got a lot of homework today. – Hausaufgaben
into – Go into the classroom! – in (… hinein)
Oh dear! – Du meine Güte!
room – There’s a rat in our room. – Zimmer, Raum
why – Why are you tired? – warum
bad – Thursday and Friday aren’t bad. – schlecht, böse
Don’t be late. – Komm(t) nicht zu spät., Sei(d) pünktlich.
tomorrow – Tomorrow is Monday. – morgen
birthday – Happy birthday, David! – Geburtstag
friend – Tom is his friend. – Freund/Freundin
Be yourself. – Sei du selbst.
no one else – Be yourself and no one else. – niemand anders
bottle – The feelings are in the bottle. – Flasche
to get back – I will get the feelings back. – zurückholen, zurückbekommen
mad – I am nice, Bob is mad. – wütend, zornig
magic – This is a magic bottle. – magisch
to break – I must break the bottle. – (zer-)brechen
to go to sleep – Go back to sleep. – schlafen gehen
because – I’m happy because it’s the weekend. – weil
It’s me. – Ich bin’s.
Try it! – Versuch es!
Let go! – Lass(t) los!
What’s happening? – Was ist (hier) los?

```

## Output contract

Write `content/corpus/units/g1-u04/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u04",
  "briefBank": "07ed93df8cb9",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u04.s.to-be-negative",
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
