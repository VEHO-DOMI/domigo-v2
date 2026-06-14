# Grammar generation brief — g1-u02 (MORE! 1, Unit 2)

<!-- domigo:gen grammar g1-u02 bank=8964a98699d2 prompt=4b9164076103 -->

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

### `g1u02.s.prepositions-place` — Prepositions of place (Ortspräpositionen)

Saying where something is: in, on, under, behind, next to, in front of.

v1 floor for this structure: **41 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [prepositions-place-basic]: Use in (inside), on (on a surface), under (below), behind (at the back), next to (beside) and in front of (facing).
  - DE: Verwende in (drinnen), on (auf einer Oberfläche), under (darunter), behind (dahinter), next to (daneben) und in front of (davor).
  - "Where's the frog? – It's in the shoe." — "Wo ist der Frosch? – Er ist im Schuh."
  - "The cat is under the bed." — "Die Katze ist unter dem Bett."
  - "The car is in front of the house." — "Das Auto ist vor dem Haus."

common errors:
- Forgetting of in in front of.: ✗ "The tree is in front the house." → ✓ "The tree is in front of the house."
- Using in instead of at for a location.: ✗ "I am in school." → ✓ "I am at school."

SB box `g1/sb/SB Unit 2- At the zoo.txt#grammar-1` — ▶️ there is / there are:
```
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
```

v1 seed items (UNTRUSTED):
- `m1-u2-prepositions-place-gf-001` [gap-fill, d1]: p="The book is ___ the table. (on a surface)" c="on" a=["on"] ds=["in","under","behind"]
- `m1-u2-prepositions-place-gf-002` [gap-fill, d1]: p="The cat is ___ the box. (inside)" c="in" a=["in"] ds=["on","under","next to"]
- `m1-u2-prepositions-place-gf-003` [gap-fill, d2]: p="The dog is ___ the bed. (below it)" c="under" a=["under"] ds=["on","in","behind"]
- `m1-u2-prepositions-place-gf-004` [gap-fill, d3]: p="The tree is ___ ___ ___ the house. (facing the house)" c="in front of" a=["in front of"] ds=["in front","behind of","next of"]
- `m1-u2-prepositions-place-gf-005` [gap-fill, d2]: p="The supermarket is ___ ___ the school. (beside it)" c="next to" a=["next to"] ds=["next","near of","beside of"]
- `m1-u2-prepositions-place-gf-006` [gap-fill, d4]: p="The children are ___ the tree. (at the back of the tree)" c="behind" a=["behind"] ds=["behind of","in back","after"]
- `m1-u2-prepositions-place-mc-001` [gap-fill, d1]: p="The pen is ___ my bag. (inside my bag)" c="in" a=["in"] ds=["on","under","behind"]
- `m1-u2-prepositions-place-mc-002` [gap-fill, d2]: p="Which sentence is correct? The park is ___ the school." c="next to" a=["next to"] ds=["next","near of","beside from"]
- `m1-u2-prepositions-place-mc-003` [multiple-choice, d3]: p="Which is correct? The bus stop is ___." c="in front of the school" a=["in front of the school"] ds=["in front the school","in front from the school","front of the school"]
- `m1-u2-prepositions-place-ec-001` [error-correction, d2]: p="Find and fix the mistake: The tree is in front the house." c="The tree is in front of the house." a=["The tree is in front of the house.","of"] ds=[]
- `m1-u2-prepositions-place-ec-002` [error-correction, d3]: p="Find and fix the mistake: The shop is next the cinema." c="The shop is next to the cinema." a=["The shop is next to the cinema.","to"] ds=[]
- `m1-u2-prepositions-place-ec-003` [error-correction, d4]: p="Find and fix the mistake: I am at school at Monday." c="I am at school on Monday." a=["I am at school on Monday.","on"] ds=[]
- `m1-u2-prepositions-place-tf-001` [transformation, d2]: p="Change the preposition to the opposite: The cat is under the table. → The cat is ___ the table." c="on" a=["on","The cat is on the table.","The cat is on the table"] ds=[]
- `m1-u2-prepositions-place-tf-002` [transformation, d3]: p="Change the preposition to the opposite: The car is behind the house. → The car is ___ ___ ___ the house." c="in front of" a=["in front of","The car is in front of in front of in front of the house.","The car is in front of in front of in front of the house"] ds=[]
- `m1-u2-prepositions-place-tr-001` [translation, d2]: p="🇩🇪 Die Katze ist unter dem Bett." c="The cat is under the bed." a=["The cat is under the bed."] ds=[]
- `m1-u2-prepositions-place-tr-002` [translation, d4]: p="🇩🇪 Das Auto ist vor dem Haus." c="The car is in front of the house." a=["The car is in front of the house."] ds=[]
- `m1-u2-prepositions-place-gf-007` [gap-fill, d4]: p="The cat is hiding ___ the sofa." c="behind" a=["behind"] ds=["under","on","in front of"]
- `m1-u2-prepositions-place-sb-001` [sentence-building, d2]: p="Put the words in the correct order: the / is / behind / cat / door / the" c="The cat is behind the door." a=["The cat is behind the door."] ds=[]
- `m1-u2-prepositions-place-mt-001` [matching, d2]: p="Match the English preposition to the German word: 1) on 2) under 3) behind 4) next to — a) neben b) hinter c) auf d) unter" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}"] ds=[]
- `m1-u2-prepositions-place-gf-008` [gap-fill, d3]: p="The ball is ___ the box. You can't see it." c="in" a=["in","inside"] ds=["on","under","next to"]
- `m1-u2-prepositions-place-gf-009` [gap-fill, d1]: p="The ball is ___ the table." c="under" a=["under"] ds=["on","in","behind"]
- `m1-u2-prepositions-place-gf-010` [gap-fill, d1]: p="My book is ___ my bag." c="in" a=["in"] ds=["on","under","behind"]
- `m1-u2-prepositions-place-gf-011` [gap-fill, d1]: p="The picture is ___ the wall." c="on" a=["on"] ds=["in","under","behind"]
- `m1-u2-prepositions-place-gf-012` [gap-fill, d2]: p="The shop is ___ the school and the bank." c="between" a=["between"] ds=["next to","in front of","behind"]
- `m1-u2-prepositions-place-gf-013` [gap-fill, d2]: p="There is a tree ___ the house." c="in front of" a=["in front of"] ds=["behind","next to","under"]
- `m1-u2-prepositions-place-gf-014` [gap-fill, d2]: p="My cat sleeps ___ my bed." c="on" a=["on"] ds=["in","under","between"]
- `m1-u2-prepositions-place-mc-004` [multiple-choice, d1]: p="Cat is under the chair. Which is correct?" c="The cat is under the chair." a=["The cat is under the chair."] ds=["The cat is on the chair.","The cat is in the chair.","The cat is behind the chair."]
- `m1-u2-prepositions-place-mc-005` [multiple-choice, d1]: p="Book on the shelf. Which is correct?" c="The book is on the shelf." a=["The book is on the shelf."] ds=["The book is in the shelf.","The book is under the shelf.","The book is between the shelf."]
- `m1-u2-prepositions-place-mc-006` [multiple-choice, d2]: p="Dog sleeping under the bed. Which is correct?" c="The dog is under the bed." a=["The dog is under the bed."] ds=["The dog is on the bed.","The dog is in the bed.","The dog is next to the bed."]
- `m1-u2-prepositions-place-ec-004` [error-correction, d3]: p="Find and fix the mistake: The bank is among the shop and school." c="The bank is between the shop and school." a=["The bank is between the shop and school.","between"] ds=[]
- `m1-u2-prepositions-place-ec-005` [error-correction, d2]: p="Find and fix the mistake: I can't find my pen. Oh wait, it's on my bag! (I can see it inside.)" c="It's in my bag!" a=["It's in my bag!","It is in my bag!","My pen is in my bag.","in"] ds=[]
- `m1-u2-prepositions-place-ec-006` [error-correction, d2]: p="Find and fix the mistake: The cat is in the table. (You can see it sitting on top.)" c="The cat is on the table." a=["The cat is on the table.","on"] ds=[]
- `m1-u2-prepositions-place-tf-003` [transformation, d2]: p="Opposite: 'under the bed' → ___ the bed" c="on" a=["on"] ds=[]
- `m1-u2-prepositions-place-tf-004` [transformation, d3]: p="Opposite: 'behind the tree' → ___ the tree" c="in front of" a=["in front of"] ds=[]
- `m1-u2-prepositions-place-tr-003` [translation, d2]: p="Translate: Die Katze ist unter dem Tisch." c="The cat is under the table." a=["The cat is under the table."] ds=[]
- `m1-u2-prepositions-place-tr-004` [translation, d1]: p="Translate: Das Buch ist auf dem Regal." c="The book is on the shelf." a=["The book is on the shelf."] ds=[]
- `m1-u2-prepositions-place-sb-002` [sentence-building, d2]: p="Put in order: is / behind / cat / the / sofa / the" c="The cat is behind the sofa." a=["The cat is behind the sofa."] ds=[]
- `m1-u2-prepositions-place-sb-003` [sentence-building, d3]: p="Put in order: between / bank / the / is / school / the / and / shop / the" c="The bank is between the school and the shop." a=["The bank is between the school and the shop."] ds=[]
- `m1-u2-prepositions-place-mt-002` [matching, d1]: p="Match: 1) on 2) in 3) under 4) behind — a) darunter b) auf c) hinter d) in/drinnen" c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"a\",\"4\":\"c\"}"] ds=[]
- `m1-u2-prepositions-place-cp-001` [context-picker, d1]: p="Can't find your pen. Friend says it's beneath your book. Which sentence?" c="The pen is under the book." a=["The pen is under the book."] ds=["The pen is on the book.","The pen is in the book.","The pen is behind the book."]
- `m1-u2-prepositions-place-gs-001` [group-sort, d2]: p="Sort: which preposition — in, on, or under?" c="{\"in\":[\"my bag|in my bag\",\"the box|in the box\",\"the kitchen|in the kitchen\"],\"on\":[\"the wall|on the wall\",\"the table|on the table\",\"the floor|on the floor\"],\"under\":[\"the bed|under the bed\",\"the chair|under the chair\",\"the desk|under the desk\"]}" a=[] ds=[]

### `g1u02.s.subject-pronouns` — Subject pronouns (Subjektpronomen (Personalpronomen im Nominativ))

The personal pronouns used as the subject of a sentence: I, you, he, she, it, we, they.

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [subject-pronouns-list]: Subject pronouns replace a noun as the subject: I, you, he, she, it, we, they.
  - DE: Subjektpronomen ersetzen ein Nomen als Subjekt: I, you, he, she, it, we, they.
  - "Tom is my friend. He is twelve." — "Tom ist mein Freund. Er ist zwölf."
  - "The book is new. It is interesting." — "Das Buch ist neu. Es ist interessant."
- rule [subject-pronouns-it]: Use it for things and for animals (when you don't know the gender), never for people.
  - DE: Verwende it für Dinge und für Tiere (wenn du das Geschlecht nicht kennst), nie für Menschen.
  - "Where is the dog? – It is in the garden." — "Wo ist der Hund? – Er ist im Garten."
  - "This is my sister. She is nice." — "Das ist meine Schwester. Sie ist nett."

common errors:
- Using he or she for an object.: ✗ "The table is big. He is brown." → ✓ "The table is big. It is brown."
- Using it for a person.: ✗ "This is my teacher. It is very nice." → ✓ "This is my teacher. She is very nice."

SB box `g1/sb/SB Unit 2- At the zoo.txt#grammar-1` — ▶️ there is / there are:
```
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
```

v1 seed items (UNTRUSTED):
- `m1-u2-subject-pronouns-gf-001` [gap-fill, d1]: p="Maria is my friend. ___ is very nice. (he / she / it)" c="She" a=["She"] ds=["He","It","They"]
- `m1-u2-subject-pronouns-gf-002` [gap-fill, d1]: p="Tom and Anna are friends. ___ are in Year 7. (he / she / they)" c="They" a=["They"] ds=["He","She","We"]
- `m1-u2-subject-pronouns-gf-003` [gap-fill, d2]: p="The book is new. ___ is very interesting. (he / she / it)" c="It" a=["It"] ds=["He","She","They"]
- `m1-u2-subject-pronouns-gf-004` [gap-fill, d2]: p="The table is big. ___ is brown. (he / she / it)" c="It" a=["It"] ds=["He","She","They"]
- `m1-u2-subject-pronouns-gf-005` [gap-fill, d3]: p="My sister and I love sports. ___ play tennis every week. (we / they / you)" c="We" a=["We"] ds=["They","You","She"]
- `m1-u2-subject-pronouns-gf-006` [gap-fill, d4]: p="Where is the dog? ___ is in the garden. (he / she / it)" c="It" a=["It","He","She"] ds=["They","We","You"]
- `m1-u2-subject-pronouns-mc-001` [gap-fill, d1]: p="Max is in class 1B. ___ is from Linz." c="He" a=["He"] ds=["She","It","They"]
- `m1-u2-subject-pronouns-mc-002` [gap-fill, d3]: p="The door is old. ___ is brown." c="It" a=["It"] ds=["He","She","They"]
- `m1-u2-subject-pronouns-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="This is my teacher. She is very nice." a=["This is my teacher. She is very nice."] ds=["This is my teacher. It is very nice.","This is my teacher. He is very nice she.","This is my teacher. Her is very nice."]
- `m1-u2-subject-pronouns-ec-001` [error-correction, d2]: p="Find and fix the mistake: The table is big. He is brown." c="The table is big. It is brown." a=["The table is big. It is brown.","The table is big. It's brown.","The table is big. It is brown","it"] ds=[]
- `m1-u2-subject-pronouns-ec-002` [error-correction, d3]: p="Find and fix the mistake: This is my brother. It is eleven." c="This is my brother. He is eleven." a=["This is my brother. He is eleven.","This is my brother. He's eleven.","This is my brother. He is eleven","he"] ds=[]
- `m1-u2-subject-pronouns-ec-003` [error-correction, d4]: p="Find and fix the mistake: The bag is new. She is very nice." c="The bag is new. It is very nice." a=["The bag is new. It is very nice.","The bag is new. It's very nice.","The bag is new. It is very nice","it"] ds=[]
- `m1-u2-subject-pronouns-tf-001` [transformation, d2]: p="Replace the noun with a pronoun: Lisa is happy. → ___ is happy." c="She" a=["She","She is happy.","She is happy","She's happy."] ds=[]
- `m1-u2-subject-pronouns-tf-002` [transformation, d3]: p="Replace the nouns with pronouns: The children are tired. → ___ are tired." c="They" a=["They","They are tired.","They are tired","they're tired."] ds=[]
- `m1-u2-subject-pronouns-tr-001` [translation, d2]: p="🇩🇪 Er ist mein Freund. (male friend)" c="He is my friend." a=["He is my friend.","He's my friend."] ds=[]
- `m1-u2-subject-pronouns-tr-002` [translation, d4]: p="🇩🇪 Der Stuhl ist alt. Er ist braun. (Chair is not a person!)" c="The chair is old. It is brown." a=["The chair is old. It is brown.","The chair is old. It's brown.","The chair is old. It is brown"] ds=[]
- `m1-u2-subject-pronouns-sb-001` [sentence-building, d2]: p="Put the words in the correct order: is / she / my / sister" c="She is my sister." a=["She is my sister.","She's my sister."] ds=[]
- `m1-u2-subject-pronouns-mt-001` [matching, d1]: p="Match the noun to the correct pronoun: 1) Tom 2) Lisa 3) Tom and Lisa 4) the book — a) they b) it c) he d) she" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"a\",\"4\":\"b\"}"] ds=[]
- `m1-u2-subject-pronouns-gf-007` [gap-fill, d2]: p="Tom and I are friends. ___ go to the same school." c="We" a=["We"] ds=["Us","They","I"]
- `m1-u2-subject-pronouns-gf-008` [gap-fill, d3]: p="My sister likes sport. ___ plays tennis every day." c="She" a=["She"] ds=["Her","He","It"]
- `m1-u2-subject-pronouns-mp-001` [matching-pairs, d1]: p="Find the pairs: name/noun ↔ subject pronoun." c="[[\"Tom\",\"he\"],[\"Lisa\",\"she\"],[\"the dog\",\"it\"],[\"Tom and I\",\"we\"],[\"the children\",\"they\"],[\"my friend (talking to)\",\"you\"]]" a=[] ds=[]
- `m1-u2-subject-pronouns-gs-001` [group-sort, d1]: p="Sort: singular or plural pronoun?" c="{\"Singular\":[\"I\",\"he\",\"she\",\"it\"],\"Plural\":[\"we\",\"they\",\"you\"]}" a=[] ds=[]

### `g1u02.s.there-is-are` — there is / there are (there is / there are – es gibt)

Saying that something exists: there is for singular, there are for plural.

v1 floor for this structure: **41 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [there-is-singular]: Use there is (there's) for one thing (singular).
  - DE: Verwende there is (there's) für eine Sache (Einzahl).
  - "There is a train." — "Es gibt einen Zug."
  - "There's a parrot in the tree." — "Es gibt einen Papagei im Baum."
- rule [there-are-plural]: Use there are for more than one thing (plural).
  - DE: Verwende there are für mehrere Sachen (Mehrzahl).
  - "There are two trains." — "Es gibt zwei Züge."
  - "There are three frogs on the desk." — "Es gibt drei Frösche auf dem Tisch."

common errors:
- Using there is with a plural noun.: ✗ "There is three monkeys in the zoo." → ✓ "There are three monkeys in the zoo."
- Using it has instead of there is.: ✗ "It has a park in our town." → ✓ "There is a park in our town."

SB box `g1/sb/SB Unit 2- At the zoo.txt#grammar-1` — ▶️ there is / there are:
```
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
```

v1 seed items (UNTRUSTED):
- `m1-u2-there-is-are-gf-001` [gap-fill, d1]: p="___ a cat on the sofa. (there is / there are)" c="There is" a=["There is","There's"] ds=["There are","It is","It has"]
- `m1-u2-there-is-are-gf-002` [gap-fill, d1]: p="___ twenty students in our class. (there is / there are)" c="There are" a=["There are"] ds=["There is","It has","They are"]
- `m1-u2-there-is-are-gf-003` [gap-fill, d2]: p="___ three monkeys in the zoo. (there is / there are)" c="There are" a=["There are"] ds=["There is","It has","There has"]
- `m1-u2-there-is-are-gf-004` [gap-fill, d3]: p="___ a swimming pool in our town? (question form)" c="Is there" a=["Is there"] ds=["There is","Has there","Does there"]
- `m1-u2-there-is-are-gf-005` [gap-fill, d3]: p="___ any parks near your house? (question, plural)" c="Are there" a=["Are there"] ds=["Is there","There are","Have there"]
- `m1-u2-there-is-are-gf-006` [gap-fill, d4]: p="There ___ a big garden but there ___ any trees. (is/are, negative)" c="is ... aren't" a=["is ... aren't","is ... are not"] ds=["are ... isn't","is ... isn't","are ... aren't"]
- `m1-u2-there-is-are-mc-001` [multiple-choice, d2]: p="Which sentence is correct?" c="There are five dogs in the park." a=["There are five dogs in the park."] ds=["There is five dogs in the park.","It has five dogs in the park.","It gives five dogs in the park."]
- `m1-u2-there-is-are-mc-002` [gap-fill, d2]: p="___ a library in your school?" c="Is there" a=["Is there"] ds=["Are there","Has there","There is"]
- `m1-u2-there-is-are-mc-003` [multiple-choice, d4]: p="Which sentence is WRONG?" c="It has a park in our town." a=["It has a park in our town."] ds=["There is a park in our town.","There's a park in our town.","There are parks in our town."]
- `m1-u2-there-is-are-ec-001` [error-correction, d2]: p="Find and fix the mistake: There is many children in the zoo." c="There are many children in the zoo." a=["There are many children in the zoo.","are"] ds=[]
- `m1-u2-there-is-are-ec-002` [error-correction, d3]: p="Find and fix the mistake: It has a big park in our town." c="There is a big park in our town." a=["There is a big park in our town.","There's a big park in our town.","there","is"] ds=[]
- `m1-u2-there-is-are-ec-003` [error-correction, d4]: p="Find and fix the mistake: There is two bedrooms and a big kitchen." c="There are two bedrooms and a big kitchen." a=["There are two bedrooms and a big kitchen.","are"] ds=[]
- `m1-u2-there-is-are-tf-001` [transformation, d2]: p="A friend says there's a cinema in your town, but there isn't one! Make this negative: There is a cinema in our town. → There ___ a cinema in our town." c="isn't" a=["isn't","is not","is no","There isn't a cinema in our town.","There isn't a cinema in our town","There is not a cinema in our town."] ds=[]
- `m1-u2-there-is-are-tf-002` [transformation, d3]: p="Make this a question: There are shops near the school. → ___ there shops near the school?" c="Are" a=["Are","Are there shops near the school?","Are there shops near the school"] ds=[]
- `m1-u2-there-is-are-tr-001` [translation, d2]: p="🇩🇪 Es gibt einen Park in unserer Stadt." c="There is a park in our town." a=["There is a park in our town.","There's a park in our town."] ds=[]
- `m1-u2-there-is-are-tr-002` [translation, d4]: p="🇩🇪 Gibt es ein Schwimmbad in deiner Stadt?" c="Is there a swimming pool in your town?" a=["Is there a swimming pool in your town?","Is there a pool in your town?"] ds=[]
- `m1-u2-there-is-are-sb-001` [sentence-building, d2]: p="Put the words in the correct order: are / in / students / there / the / twenty / class" c="There are twenty students in the class." a=["There are twenty students in the class."] ds=[]
- `m1-u2-there-is-are-mt-001` [matching, d2]: p="Match the beginning to the correct ending: 1) There is 2) There are 3) Is there 4) Are there — a) any shops near here? b) a cat in the garden. c) three books on the table. d) a cinema in town?" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"d\",\"4\":\"a\"}"] ds=[]
- `m1-u2-there-is-are-gf-007` [gap-fill, d2]: p="___ 25 students in our class." c="There are" a=["There are"] ds=["There is","They are","It is"]
- `m1-u2-there-is-are-gf-008` [gap-fill, d2]: p="___ a new teacher at our school this year." c="There is" a=["There is","There's"] ds=["There are","It is","He is"]
- `m1-u2-there-is-are-gf-009` [gap-fill, d1]: p="___ a dog in the garden." c="There is" a=["There is","There's"] ds=["There are","It is","They are"]
- `m1-u2-there-is-are-gf-010` [gap-fill, d1]: p="___ three cats on the sofa." c="There are" a=["There are"] ds=["There is","It is","They is"]
- `m1-u2-there-is-are-gf-011` [gap-fill, d2]: p="___ any milk in the fridge?" c="Is there" a=["Is there"] ds=["Are there","There is","Does there"]
- `m1-u2-there-is-are-gf-012` [gap-fill, d2]: p="There ___ a cinema in our town." c="isn't" a=["isn't","is not"] ds=["aren't","doesn't","don't"]
- `m1-u2-there-is-are-gf-013` [gap-fill, d2]: p="___ any shops near here?" c="Are there" a=["Are there"] ds=["Is there","There are","Does there"]
- `m1-u2-there-is-are-gf-014` [gap-fill, d1]: p="___ a park near my school." c="There is" a=["There is","There's"] ds=["There are","It has","Is there"]
- `m1-u2-there-is-are-mc-004` [multiple-choice, d1]: p="One book on the table. Which is correct?" c="There is a book on the table." a=["There is a book on the table."] ds=["There are a book on the table.","It is a book on the table.","A book there is on the table."]
- `m1-u2-there-is-are-mc-005` [multiple-choice, d2]: p="No cinema in this town. Which is correct?" c="There isn't a cinema." a=["There isn't a cinema."] ds=["There aren't a cinema.","There doesn't a cinema.","There not a cinema."]
- `m1-u2-there-is-are-mc-006` [multiple-choice, d2]: p="Asking about shops. Which question is correct?" c="Are there any shops nearby?" a=["Are there any shops nearby?"] ds=["Is there any shops nearby?","Does there any shops?","There are any shops?"]
- `m1-u2-there-is-are-ec-004` [error-correction, d1]: p="Find and fix the mistake: There are a cat in the garden." c="There is a cat in the garden." a=["There is a cat in the garden.","is"] ds=[]
- `m1-u2-there-is-are-ec-005` [error-correction, d2]: p="Find and fix the mistake: There is 30 students in class." c="There are 30 students in class." a=["There are 30 students in class.","are"] ds=[]
- `m1-u2-there-is-are-ec-006` [error-correction, d2]: p="Find and fix the mistake: It is a museum near our school." c="There is a museum near our school." a=["There is a museum near our school.","there"] ds=[]
- `m1-u2-there-is-are-tf-003` [transformation, d2]: p="Negative: 'There is a pool.' → There ___ a pool." c="isn't" a=["isn't","is not"] ds=[]
- `m1-u2-there-is-are-tf-004` [transformation, d2]: p="Question: 'There are shops.' → ___ there shops?" c="Are" a=["Are"] ds=[]
- `m1-u2-there-is-are-tr-003` [translation, d1]: p="Translate: Es gibt einen Park hier." c="There is a park here." a=["There is a park here.","There's a park here."] ds=[]
- `m1-u2-there-is-are-tr-004` [translation, d2]: p="Translate: Gibt es ein Kino?" c="Is there a cinema?" a=["Is there a cinema?"] ds=[]
- `m1-u2-there-is-are-sb-002` [sentence-building, d1]: p="Put in order: is / a / there / in / cat / the / garden" c="There is a cat in the garden." a=["There is a cat in the garden."] ds=[]
- `m1-u2-there-is-are-sb-003` [sentence-building, d2]: p="Put in order: are / any / there / near / shops / here" c="Are there any shops near here?" a=["Are there any shops near here?"] ds=[]
- `m1-u2-there-is-are-mt-002` [matching, d2]: p="Match: 1) a dog (1) 2) two birds (2+) 3) no milk (0) 4) three books (2+) — a) There are b) There is c) There isn't d) There are" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u2-there-is-are-cp-001` [context-picker, d2]: p="You arrive at a new school. Which sentence describes what you see?" c="There are lots of students in the playground." a=["There are lots of students in the playground."] ds=["There is lots of students.","It is lots of students.","They are lots of students."]
- `m1-u2-there-is-are-gs-001` [group-sort, d2]: p="Sort: there is or there are?" c="{\"there is\":[\"a cat\",\"a museum\",\"one student\",\"a swimming pool\"],\"there are\":[\"two dogs\",\"twenty students\",\"three books\",\"many shops\"]}" a=[] ds=[]

### `g1u02.s.to-be` — to be (affirmative) (to be – sein (bejahte Form))

The affirmative forms of the verb be (am/is/are) in long and short form.

v1 floor for this structure: **43 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [to-be-affirmative]: The verb be has the forms I am, you are, he/she/it is, we/you/they are. You can write the long form (I am) or the short form (I'm).
  - DE: Das Verb be hat die Formen I am, you are, he/she/it is, we/you/they are. Du kannst die Langform (I am) oder die Kurzform (I'm) schreiben.
  - "I'm fine. (I am fine.)" — "Mir geht es gut."
  - "He's in class 4A. (He is in class 4A.)" — "Er ist in der Klasse 4A."
  - "They're from London. (They are from London.)" — "Sie sind aus London."

common errors:
- Leaving out the verb be (copula).: ✗ "She very nice." → ✓ "She is very nice."
- Using the wrong form of be for the subject.: ✗ "I are happy." → ✓ "I am happy."

SB box `g1/sb/SB Unit 2- At the zoo.txt#grammar-1` — ▶️ there is / there are:
```
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
```

v1 seed items (UNTRUSTED):
- `m1-u2-to-be-gf-001` [gap-fill, d1]: p="I ___ twelve years old. (be)" c="am" a=["am","'m"] ds=["is","are","be"]
- `m1-u2-to-be-gf-002` [gap-fill, d1]: p="She ___ from Vienna. (be)" c="is" a=["is","'s"] ds=["am","are","be"]
- `m1-u2-to-be-gf-003` [gap-fill, d2]: p="Tom and Lisa ___ in class 1A. (be)" c="are" a=["are","'re"] ds=["is","am","be"]
- `m1-u2-to-be-gf-004` [gap-fill, d3]: p="He ___ at home today. He is sick. (not / be)" c="isn't" a=["isn't","is not","'s not"] ds=["aren't","don't","not is"]
- `m1-u2-to-be-gf-005` [gap-fill, d4]: p="___ you happy? — Yes, I ___. (be questions & short answers)" c="Are ... am" a=["Are ... am"] ds=["Do ... am","Is ... are","Be ... is"]
- `m1-u2-to-be-mc-001` [gap-fill, d1]: p="They ___ my friends." c="are" a=["are"] ds=["is","am","be"]
- `m1-u2-to-be-mc-002` [multiple-choice, d2]: p="Which sentence is correct?" c="We are from Graz." a=["We are from Graz."] ds=["We is from Graz.","We am from Graz.","We be from Graz."]
- `m1-u2-to-be-mc-003` [gap-fill, d4]: p="Which short answer is correct? — 'Is she your sister?' — '___'" c="No, she isn't." a=["No, she isn't.","No, she's not."] ds=["No, she doesn't.","No, she aren't.","No, she not."]
- `m1-u2-to-be-ec-001` [error-correction, d2]: p="Find and fix the mistake: He are a teacher." c="He is a teacher." a=["He is a teacher.","He's a teacher.","is"] ds=[]
- `m1-u2-to-be-ec-002` [error-correction, d3]: p="Find and fix the mistake: Do you are happy?" c="Are you happy?" a=["Are you happy?","are you"] ds=[]
- `m1-u2-to-be-ec-003` [error-correction, d4]: p="Find and fix the mistake: Are you from Salzburg? — Yes, I'm." c="Are you from Salzburg? — Yes, I am." a=["Are you from Salzburg? — Yes, I am.","Are you from Salzburg? — Yes, I am","i am"] ds=[]
- `m1-u2-to-be-tf-001` [transformation, d2]: p="Your friend says 'I am tired' but it's not true for you. Make this negative: I am tired. → I ___ tired." c="am not" a=["am not","'m not","I am not tired.","I am not tired","I'm not tired."] ds=[]
- `m1-u2-to-be-tf-002` [transformation, d3]: p="You want to check if your new classmate is from London. Make this a question: She is from London. → ___ she from London?" c="Is" a=["Is","Is she from London?","Is she from London"] ds=[]
- `m1-u2-to-be-tr-001` [translation, d2]: p="🇩🇪 Wir sind in der 1A." c="We are in class 1A." a=["We are in class 1A.","We're in class 1A."] ds=[]
- `m1-u2-to-be-tr-002` [translation, d4]: p="🇩🇪 Bist du muede? — Nein, bin ich nicht." c="Are you tired? — No, I'm not." a=["Are you tired? — No, I'm not.","Are you tired? — No, I am not.","Are you tired? — No, I'm not"] ds=[]
- `m1-u2-to-be-sb-001` [sentence-building, d2]: p="Put the words in the correct order: from / are / they / Salzburg" c="They are from Salzburg." a=["They are from Salzburg.","they're from Salzburg."] ds=[]
- `m1-u2-to-be-mt-001` [matching, d1]: p="Match the subject to the correct form of 'be': 1) I 2) she 3) we 4) they — a) are b) am c) is d) are" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}"] ds=[]
- `m1-u2-to-be-cp-001` [context-picker, d2]: p="Your friend asks about your sister. Which sentence uses 'to be' correctly?" c="She is my best friend." a=["She is my best friend."] ds=["She are my best friend.","She am my best friend.","She be my best friend."]
- `m1-u2-to-be-gf-007` [gap-fill, d1]: p="My sister ___ (be) twelve years old." c="is" a=["is"] ds=["are","am","be"]
- `m1-u2-to-be-ff-002` [free-form, d3]: p="You want to check if your friends are from Vienna. Make it a question: They are from Vienna. → ___ from Vienna?" c="Are they" a=["Are they","Are they from Vienna","Are they from Vienna?"] ds=[]
- `m1-u2-to-be-gf-008` [gap-fill, d1]: p="My brother ___ 15 years old." c="is" a=["is"] ds=["are","am","be"]
- `m1-u2-to-be-gf-009` [gap-fill, d1]: p="We ___ in the classroom." c="are" a=["are"] ds=["is","am","be"]
- `m1-u2-to-be-gf-010` [gap-fill, d1]: p="I ___ not tired today." c="am" a=["am"] ds=["is","are","be"]
- `m1-u2-to-be-gf-011` [gap-fill, d2]: p="___ they from Austria?" c="Are" a=["Are"] ds=["Is","Am","Do"]
- `m1-u2-to-be-gf-012` [gap-fill, d1]: p="She ___ very happy today." c="is" a=["is"] ds=["are","am","was"]
- `m1-u2-to-be-gf-013` [gap-fill, d2]: p="The dogs ___ in the garden." c="are" a=["are"] ds=["is","am","be"]
- `m1-u2-to-be-mc-004` [multiple-choice, d1]: p="Which is correct?" c="I am a student." a=["I am a student."] ds=["I is a student.","I are a student.","I be a student."]
- `m1-u2-to-be-mc-005` [gap-fill, d2]: p="'Tom and Lisa ___ friends.'" c="are" a=["are"] ds=["is","am","be"]
- `m1-u2-to-be-mc-006` [multiple-choice, d2]: p="Correct question?" c="Is she from Vienna?" a=["Is she from Vienna?"] ds=["Are she from Vienna?","Am she from Vienna?","Does she from Vienna?"]
- `m1-u2-to-be-ec-004` [error-correction, d2]: p="Find and fix the mistake: She are a good singer." c="She is a good singer." a=["She is a good singer.","is"] ds=[]
- `m1-u2-to-be-ec-005` [error-correction, d1]: p="Find and fix the mistake: I is from Austria." c="I am from Austria." a=["I am from Austria.","am"] ds=[]
- `m1-u2-to-be-ec-006` [error-correction, d2]: p="Find and fix the mistake: Are he at school?." c="Is he at school?" a=["Is he at school?","is"] ds=[]
- `m1-u2-to-be-tf-003` [transformation, d2]: p="Negative: 'I am hungry.' → I ___ hungry." c="am not" a=["am not","'m not"] ds=[]
- `m1-u2-to-be-tf-004` [transformation, d2]: p="Question: 'He is at home.' → ___ he at home?" c="Is" a=["Is"] ds=[]
- `m1-u2-to-be-tr-003` [translation, d1]: p="Translate: Wir sind in der Schule." c="We are at school." a=["We are at school.","We're at school."] ds=[]
- `m1-u2-to-be-tr-004` [translation, d2]: p="Translate: Bist du müde?" c="Are you tired?" a=["Are you tired?"] ds=[]
- `m1-u2-to-be-sb-002` [sentence-building, d1]: p="Put in order: is / she / London / from" c="She is from London." a=["She is from London."] ds=[]
- `m1-u2-to-be-sb-003` [sentence-building, d2]: p="Put in order: are / where / from / you" c="Where are you from?" a=["Where are you from?"] ds=[]
- `m1-u2-to-be-mt-002` [matching, d1]: p="Match: 1) I 2) she 3) we 4) they — a) are b) am c) is d) are" c="{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"c\",\"3\":\"a\",\"4\":\"d\"}"] ds=[]
- `m1-u2-to-be-qf-001` [question-formation, d2]: p="Ask where your pen pal lives: '___'" c="Where are you from?" a=["Where are you from?","Where do you live?"] ds=[]
- `m1-u2-to-be-gs-001` [group-sort, d1]: p="Sort: which form of \"be\" goes with which subject?" c="{\"am\":[\"I\"],\"is\":[\"he\",\"she\",\"it\"],\"are\":[\"you\",\"we\",\"they\"]}" a=[] ds=[]
- `m1-u2-to-be-gs-002` [group-sort, d2]: p="Sort: affirmative or negative form of \"be\"?" c="{\"Affirmative\":[\"I am\",\"she is\",\"they are\",\"he's\"],\"Negative\":[\"I'm not\",\"she isn't\",\"they aren't\",\"he's not\"]}" a=[] ds=[]
- `m1-u2-to-be-mp-001` [matching-pairs, d1]: p="Find the pairs: subject ↔ correct \"be\" form." c="[[\"I\",\"am\"],[\"he\",\"is\"],[\"she\",\"is\"],[\"we\",\"are\"],[\"they\",\"are\"],[\"you\",\"are\"]]" a=[] ds=[]

### Allowed vocabulary (the deterministic level gate enforces exactly this)

Cumulative bank — every headword below (plus its inflections and listed forms) is taught:

- **g1-u01**: sound system, projector, board, window, door, desk, scissors, ruler, tablet, chair, school bag, pen, exercise book, pencil case, pencil, rubber, book, hairband, sunglasses, hat, school tie, shirt, sweater, skirt, socks, shoe, to give, time, to understand, to write, to enjoy, to listen, to love, more, to read, their, to ask, (email) address, How are you?, I am (= I'm) fine., to meet, then, your, to look, or, to eat, to go, must, how many, to hate, here, it, Let's …, midnight, our, favourite, to find, light, child, to clean, to close, to open, picture, to sit down, to speak, to stand up, to take out, class
- **g1-u02**: tree, monkey, parrot, giraffe, train, penguin, guide, lion, next to, in, behind, under, on, in front of, zoo, beautiful, behind, big, in front of, next to, under, where, small, adult, at, to bring, but, child (pl children), dog, family, free, Grandma, group, long, ticket, to want, from, year, he, she, to talk, they, we, for, happy, to let somebody out, us, car, At last., How strange!, Let me see., stone

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Ahmed, Arbeit, Befehlsformen, Betty, Bild, Box, Buddy, California, Cambridge, Carina, Carl, Chloe, Classroom, Dave, Dialog, Don, England, English, False, Freddy, Gordon, Homework, Imperatives, Irregular, Jenny, Julia, Leah, London, Mail, Manchester, Mike, Nice, Nomen, Number, Numbers, Omar, Plural, Prepositions, Rajit, Reihenfolge, Saying, School, Sue, Text, True, Welcome, Well, Work, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 2- At the zoo.txt -----
Page 16
Unit 2: At the zoo
At the end of unit 2 ...
you know ☐ the verb to be ☐ how to use prepositions of place ☐ how to use there is / there are ☐ 11 words for animals and things in a wildlife park
you can ☐ talk and write about yourself and others ☐ understand others talking about themselves ☐ understand, ask and say where things are ☐ write about school things and objects
READING
📖 1 Read the story.
Note [Image: Simple illustrations showing prepositions] next to behind on under in front of
Where's the parrot?
Maria Hey, David, look! There's a big giraffe. David Cool! And ... there's a parrot under the giraffe! Maria Where? David There! The parrot is blue and yellow. It's beautiful. Maria Oh, yes. Buddy, you like giraffes! Buddy WOOF! David Look – there are three monkeys. They're behind the tree. Maria The tree? David Yes, the tree in front of you! Maria Oh, yes! And there's the parrot! David Where? Maria It's next to the brown monkey. I like monkeys! Buddy WOOF, WOOF, WOOF! Maria What is it, Buddy? David The parrot! Maria Where? David It's on Buddy now! Buddy WOOF?!
[Image description: Illustrations showing a giraffe, tree with children and dog at a zoo]
Note where's = where is there's = there is they're = they are
2 How many of these tasks can you do?
Choose the correct answer. 1 The giraffe is big / small. 2 The parrot is blue and yellow / green and yellow.
Circle T (True) or F (False). 3 There are two monkeys. T / F 4 The tree is behind Maria. T / F
Answer the questions. 5 Where is the brown monkey? ..................................................... 6 Where is the parrot now? .....................................................
1/16+17 🔊 3 Check your answers with a partner. Then listen to the story.
🔵 WB p. 14, 15, 18 🌐 CYBER Homework 4 (Revision)
Page 17
LISTENING & SPEAKING Understanding/Saying where animals are
1/18 🔊 4 a Look at the poster. Where is this?
☐ in England ☐ in Italy
b Listen to the guide. What is the order of the sentences? Write the numbers.
[Image description: A colorful poster for "WELCOME TO COTSWOLD WILDLIFE PARK AND GARDENS!" featuring a guide, a train, a lion, giraffes, penguins, and a dog. Various activities are labeled with speech bubbles:]
See a lion.
Go on a train.
Feed the giraffes.
Feed the penguins.
Bring your dog.
Adults £14.40
Children £9.90
Fact box Dogs are welcome at Cotswold Wildlife Park and Gardens! But they can't run around!
👥 5 Look at the pictures in 4 and say.
There is | a train. There are | penguins. | giraffes. | ...
You can | go on ... . | see ... . | ...
🔵 WB p. 14, 19
Page 18
LISTENING & SPEAKING Talking about yourself and others
1/19 🔊 6 Listen and tick what the children say.
1 ☐ I'm Rebecca. ☐ I'm from Oxford. ☐ I'm 11. ☐ I'm in Year 7. ☐ I'm Veronica. ☐ I'm from Cambridge. ☐ I'm 12. ☐ I'm in Year 8.
2 ☐ I'm Robert. ☐ I'm from York. ☐ I'm 12. ☐ I'm in Year 7. ☐ I'm Roger. ☐ I'm from Cork. ☐ I'm 13. ☐ I'm in Year 8.
3 ☐ We're Sam and Catherine. ☐ We're from London. ☐ We're 13. ☐ We're in Year 8. ☐ We're Karen and Benny. ☐ We're from Liverpool. ☐ We're 14. ☐ We're in Year 9.
👤 7 Talk about the boys and girls in 6.
1 Veronica's from ... . She's ... . She's in ... . 2 ... from ... . He's ... . He's in ... . 3 ... and ... are from ... . They're ... . They're in ... .
Note I'm = I am you're = you are he's / she's = he is / she is we're = we are they're = they are
👤 8 In pairs, talk about yourself. Listen and then talk about your partner.
[Image description: Two student photos with speech bubbles] I'm ... | I'm from ... | I'm ... | I'm in ...
You're ... | You're from ... | You're ... | You're in ...
GRAMMAR CHANT to be
1/20 🔊 9 A chant. Listen and repeat.
Monkeys, monkeys, monkeys in the zoo. Monkeys, monkeys – here's a chant for you.
[Image description: Illustration of City Zoo with people looking at monkeys in a cage]
I am in. You are out. I'm not happy. Let me out.
Monkeys, monkeys ...
Ken is in. Lucy's out. Ken's not happy. Let Ken out.
Monkeys, monkeys ...
We are in. They are out. We're not happy. Let us out.
Monkeys, monkeys ...
🔵 WB p. 17, 18 🌐 CYBER Homework 5
Page 19
SPEAKING Asking/Saying where things are
1/21 🔊 10 Where's the parrot? Complete with in / on / under / in front of / behind / next to. Then listen and check.
Note it's = it is
[Image description: Six panels showing a parrot in different positions relative to a car]
1 It's ........................... the car. 2 It's ........................... the car. 3 It's ........................... the car.
4 It's ........................... the car. 5 It's ........................... the car. 6 It's ........................... the car.
11 C H O I C E S
[Image description: Illustration of a bedroom/study with desk, chair, computer, cat, dog, plant, and school bag]
👥 A Work in pairs. Look at the things in the picture. Ask and answer.
Where's the chair? Where's the frog? Where's the cat? Where's the dog? Where's the banana?
It's | in | under | behind | on | next to | in front of
the desk. the school bag. the chair. the computer.
👥 B Work in pairs. Look at the things in the picture. Ask about the following things: desk, window, school bag, book.
🔵 WB p. 15, 16, 17
Page 20
WRITING
12 C H O I C E S
A Write what's in your pencil case.
In my pencil case there is a ... , there are ... , there is a ... and ...
B Look at the picture and write.
There is a book on the desk. Next to ...
[Image description: Illustration of a desk with books, pencils, and a school bag underneath]
GRAMMAR
▶️ there is / there are
So kannst du ausdrücken, dass etwas vorhanden ist:
There is a train. | There are two trains. There is a penguin. | There are two penguins.
▶️ Prepositions of place
So fragst du, wo sich etwas befindet: So antwortest du:
Where's the frog? It's in the shoe.
[Image description: Illustrations of a frog in different positions relative to a shoe, labeled: behind, under, in, on, next to, in front of]
▶️ to be (affirmative)
Das Verb „sein" (ich bin, du bist, er ist, ...) hat im Englischen die folgenden Formen:
I'm fine. (I am fine.) | We're from York. (We are from York.) You're nice. (You are nice.) | You're happy. (You are happy.) He's in class 4A. (He is in class 4A.) | They're from London. (They are from London.) She's 11. (She is 11.) It's yellow. (It is yellow.)
⏪ Now go back to page 16. Check ☑ with a partner what you know / can do.
🔵 WB p. 16, 17, 19 🌐 CYBER Homework 6
Page 21
THE STORY OF THE STONES 1
▶️ They're here!
1 Look and say.
☐ I think it's a fantasy story. ☐ I think it's a real story.
▶️ 2 Watch episode 1. Write the names.
[Image description: Three character portraits labeled 1, 2, and 3 with blank lines below for names]
1/22 🔊 3 Listen and complete the rhyme. Then choose a colour. Draw your face or stick in a photo. Complete the sentence and colour your stone.
[Image description: Scenic landscape with water and mountains at sunset/sunrise]
One stone is ...................................... . One stone is ...................................... . One stone is ...................................... . Watch our story. Here's what they can do!
My stone is ...................................... .
[Image: Empty frame with a stone outline at the bottom]
EVERYDAY ENGLISH
4 Match the pictures with the phrases.
1 Let me see. 2 How strange! 3 At last!
[Image description: Three comic-style panels showing characters in different scenes]
5 Can you do the puzzle?
CODE: ♦ = P ⚙ = W ⭕ = E ⬜ = S
♦ ⚙ ⭕ ⬜ ⭕ ⬜


----- WB: WB Unit 2 At the zoo.txt -----
Unit 2 At the zoo
Page 14–15
UNDERSTANDING VOCABULARY
At the wildlife park / Prepositions of place
1 Schreib die Wörter in das Bild.
giraffe
parrot
tree
monkey
dog
train
penguin
guide
[Image description: A large illustration of a wildlife park. On the left, three visitors stand next to a guide wearing a hat and pointing. Behind them is a small train with people inside. In the foreground, a giraffe bends its long neck toward a penguin near water. A monkey is sitting in a tree on the right, and a colourful parrot is perched on a branch. A dog is barking near the tree. Numbered blank labels (1–8) are placed near objects and animals in the picture to be filled in with the words.]
2 Verbinde die Wörter mit den Bildern.
in
on
under
behind
in front of
next to
[Image description: Six small pictures of a hamster and a cage, each numbered 1–6. The hamster is shown in different positions: in the cage, on the cage, under the cage, behind the cage, in front of the cage, and next to the cage.]
3 Wo sind alle? Schreib die Zahlen in die Bilder.
1 She’s under a tree.
2 It’s behind the tree.
3 He’s next to a giraffe.
4 They’re on a car.
5 It’s in the water.
6 She’s on the chair.
[Image description: Six pictures labelled A–F.
A: A crocodile partly in the water near grass.
B: A girl sitting on a chair.
C: A girl sitting under a tree.
D: A boy standing next to a giraffe.
E: Two frogs sitting on top of a red car.
F: A monkey behind a tree.]
USING VOCABULARY
At the wildlife park / Prepositions of place
4 Vervollständige die Dialoge. Verwende behind / in / on / under.
1
There’s a monkey over there.
Where?
It’s _____________________________.
[Image description: Two children looking through binoculars. In the picture on the right, a monkey is sitting in a tree.]
2
There’s a giraffe over there.
Where?
_____________________________.
[Image description: Two children with binoculars. A giraffe is standing behind trees in the distance.]
3
There are lions over there.
Where?
_____________________________.
[Image description: Lions sitting under a tree while children watch from nearby.]
4
There’s a parrot …
Where?
_____________________________ cap.
WOW!
[Image description: A parrot sitting on a boy’s cap.]
Page 16–17
UNDERSTANDING GRAMMAR
there is / there are
5 Schau dir das Bild an und hake T (True/richtig) oder F (False/falsch) an.
1 There are four monkeys. T ☐ F ☐
2 There are two frogs. T ☐ F ☐
3 There are five dogs. T ☐ F ☐
4 There are nine penguins. T ☐ F ☐
5 There is one lion. T ☐ F ☐
6 There are two cats. T ☐ F ☐
[Image description: Many animals shown together: monkeys, lions, dogs, penguins, frogs, cats, and other animals.]
6 Schreib is oder are in die Lücken.
1 There ______________ six lions in the wildlife park.
2 There ______________ a blue and yellow parrot.
3 There ______________ three monkeys in the tree.
4 There ______________ a train.
5 There ______________ four children.
6 There ______________ a dog.
UNDERSTANDING GRAMMAR
there is / there are + prepositions of place
7 Schau dir das Bild genau an. Lies die Sätze und trage die sechs richtigen Zahlen ein.
☐ There’s a cat behind the desk.
☐ There’s a frog on the board.
☐ There’s a dog under the desk.
☐ There’s a tablet in front of the books.
☐ There are three cats in the desk.
☐ There’s a lion next to the door.
[Image description: A classroom scene with numbered animals and objects: frogs on a board, cats in and under desks, a lion next to a door, a dog under a desk, books and a tablet on a table.]
8 Schau dir das Bild in 7 nochmal an und vervollständige die Sätze. Dann trage die richtigen Zahlen ein.
☐ There are two frogs _______________________________.
☐ There’s a penguin _______________________________.
☐ There’s a pencil _______________________________.
☐ There are three books _______________________________.
Page 18–19
USING GRAMMAR
to be
9 Ergänze die Sätze.
1 ______________ ten.
2 ______________ not happy.
3 ______________ happy.
4 ______________ fifteen and ten.
5 ______________ black and white.
6 ______________ fine.
[Image description: Children holding signs with numbers, smiling or talking, and a girl holding a black-and-white dog.]
USING GRAMMAR
Prepositions of place
10 Schau dir das Bild an und vervollständige die Sätze.
1 Where is the frog?
It’s __________________ the bus.
2 Where are the penguins?
They’re __________________ the bus.
3 Where are the monkeys?
They’re __________________ the bus.
4 Where is the giraffe?
It’s __________________ the bus.
5 Where is the dog?
It’s __________________ the bus.
6 Where are the cats?
They’re __________________ the bus.
[Image description: A red bus driving through a park. Monkeys are on top of the bus, penguins are inside, a frog is under the bus, a giraffe is next to the bus, cats are in front of the bus, and a dog is behind the bus.]
READING & WRITING
Where things are / About yourself and others
11 Schreib Sätze über die Kinder.
Aileen
11 / Cambridge / 7A
Aileen is eleven. She is from Cambridge. She is in class 7A.
Mark
10 / Manchester / 6B
Mark ______________________________________________
Kylie
13 / London / 9B
Kylie _____________________________________________
Jenny and Omar
12 / Liverpool / 8C
Jenny and Omar ____________________________________
Amrita and Rajit
11 / Bradford / 7C
Amrita and Rajit ___________________________________
12 Schreib einen Text über dich.
I’m ____________________________ . (name)
I’m ____________________________ . (how old)
I’m from ________________________ .
I’m in __________________________ . (your class)
VOCABULARY: how old – wie alt
13 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–6 ein. Höre dir den Dialog an und überprüfe deine Arbeit.
☐ Aaaah! A cat! Help!
☐ And there’s a cat behind you.
☐ There’s a frog on the sofa.
☐ Cool. I love dogs.
☐ Great. I love frogs.
☐ There’s a dog next to the chair.
14 Bring den Dialog in die richtige Reihenfolge. Setze die Zahlen 1–7 ein. Höre dir den Dialog an und überprüfe deine Arbeit.
☐ A OK.
☐ B Next to the giraffe?
☐ A There’s a frog on the giraffe!
☐ B I can’t see a frog on the giraffe. Where is it?
☐ A Yes … Ah, now it’s behind the giraffe.
☐ A Now it’s next to the giraffe.
☐ B I can’t see it. Let’s go and see the lions.
Page 20–21
15 Schau dir das Bild an. Schreib so viele Sätze mit there is / there are wie du kannst. Schreib auch, wo sich die Gegenstände/Tiere befinden.
[Image description: A classroom with desks, children, backpacks, books, scissors, a computer, a teacher at the door, and animals hidden under desks.]
16 Schau dich in deinem Zimmer um. Versuche so viele Sätze wie nur möglich über dein Zimmer zu schreiben, die mit There is / There are beginnen.
LISTENING
Understanding others talking about themselves
17 Höre dir den Text an und ergänze die Sätze.
1 Ellie is from _______________________________.
2 She is _______________________________ years old.
3 She is at the _______________________________.
VOCABULARY: lots – viel/e; funny – lustig
18 Höre dir den Text nochmal an und hake T (True/richtig) oder F (False/falsch) an.
1 Ellie’s brother likes the train. T ☐ F ☐
2 Ellie’s favourite animals are the monkeys. T ☐ F ☐
3 Ellie has a dog. T ☐ F ☐
4 Ellie’s mother likes the giraffes. T ☐ F ☐
5 Ellie’s father likes the parrots. T ☐ F ☐
6 There are yellow birds at the wildlife park. T ☐ F ☐
Page 20–21
WORD FILE
At the wildlife park
tree
monkey
parrot
giraffe
train
penguin
guide
lion
[Image description: A big picture of a wildlife park. A monkey is on a tree branch with a large parrot behind it. A giraffe stands in the background. A blue train with people inside is driving along tracks. Penguins are near icy rocks and water. A guide stands with two children. A lion is lying in the front.]
Prepositions of place
next to
in
behind
under
on
in front of
[Image description: Six small pictures show a cat and a bowl of red yarn balls to demonstrate prepositions: the cat is next to the bowl, in the bowl, behind the bowl, under the bowl, on the bowl, and in front of the bowl.]
MORE Words and Phrases
zoo — There are many animals in the zoo. — Zoo
1
beautiful — The parrot is blue and yellow. It’s beautiful. — schön, hübsch
behind — The chair is behind the desk. — hinter
big — There’s a big giraffe. — groß
in front of — The tree is in front of you. — vor
next to — The parrot is next to the monkeys. — neben
now — Where is it now? — jetzt
on — Look! The parrot is on Buddy now. — auf
there is (there’s) — There’s a book on my desk. — es gibt, da ist
there are — There are three books on my desk. — es gibt, da sind
tree — The monkeys are behind the tree. — Baum
under — There’s a book under my desk. — unter
What is it? — — Was ist los?
where — Where is it? — wo
2
small — The monkey isn’t big. It’s small. — klein
4
adult — Adults are €14.40. — Erwachsene/r
at — The children are at the zoo. — bei; an; hier: in
to bring — Can I bring my dog, Buddy? — (mit-)bringen
but — Dogs are welcome. But they can’t run around. — aber
to feed — Let’s go and feed the penguins. — füttern
guide — Listen to the guide. — (Reise-)Führer/in
to run around — Dogs are welcome, but they can’t run around. — herumlaufen
train — Let’s go on a train. — Zug
to — Welcome to the wildlife park! — zu; bis; vor; hier: in
welcome — Welcome to London. — willkommen
6
from — They are from California. — aus
year — I’m in Year 7. — Jahr; Jahrgangsstufe
7
he — He likes animals. — er
she — She is from England. — sie
to talk — Talk about the boys and girls. — sprechen, sich unterhalten
they — Rahim and Sue are 11. They are from Manchester. — sie
we — We’re Sophie and John. — wir
9
for — Here’s a chant for you. — für
happy — Buddy is happy. — glücklich, fröhlich; zufrieden
to let somebody out — Let us out! — jemanden herauslassen
us — Can you see us? — uns
10
car — The parrot is in the car. — Auto
S1
At last. — — Endlich.
How strange! — — Wie komisch!
Let me see. — — Lass mich mal schauen.
stone — Colour your stone. — Stein

```

## Output contract

Write `content/corpus/units/g1-u02/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u02",
  "briefBank": "8964a98699d2",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u02.s.prepositions-place",
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
