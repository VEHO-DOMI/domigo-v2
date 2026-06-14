# Grammar generation brief — g1-u09 (MORE! 1, Unit 9)

<!-- domigo:gen grammar g1-u09 bank=3757b4788b29 prompt=4b9164076103 -->

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

### `g1u09.s.irregular-plurals-3` — Irregular plurals (3) (Unregelmäßige Plurale (3))

More irregular plurals: mouse–mice and the consonant + y → -ies spelling (pony–ponies). Recurs from the unit-1 plurals box.

v1 floor for this structure: **0 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [irregular-plurals-mouse-pony]: mouse has the special plural mice. Nouns ending in consonant + y change -y to -ies, e.g. pony – ponies.
  - DE: mouse hat den besonderen Plural mice. Nomen auf Konsonant + y werden zu -ies, z. B. pony – ponies.
  - "one mouse → two mice" — "eine Maus → zwei Mäuse"
  - "one pony → two ponies" — "ein Pony → zwei Ponys"

common errors:
- Regularising mouse.: ✗ "I see two mouses." → ✓ "I see two mice."
- Forgetting to change -y to -ies in pony.: ✗ "two ponys" → ✓ "two ponies"

SB box `g1/sb/SB Unit 9- Unusual pets.txt#grammar-1` — ▶️ Question words:
```
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
```

### `g1u09.s.object-pronouns` — Object pronouns (Objektpronomen)

Personal pronouns used as the object of a verb or after a preposition: me, you, him, her, it, us, them.

v1 floor for this structure: **22 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [object-pronouns-list]: Object pronouns replace a noun as the object: me, you, him, her, it, us, them.
  - DE: Objektpronomen ersetzen ein Nomen als Objekt: me, you, him, her, it, us, them.
  - "We don't like him." — "Wir mögen ihn nicht."
  - "She carries us to school." — "Sie trägt uns zur Schule."
  - "We hate them." — "Wir hassen sie."

common errors:
- Using a subject pronoun as the object.: ✗ "I like he." → ✓ "I like him."
- Using a subject pronoun after a preposition.: ✗ "This is for she." → ✓ "This is for her."

SB box `g1/sb/SB Unit 9- Unusual pets.txt#grammar-1` — ▶️ Question words:
```
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
```

v1 seed items (UNTRUSTED):
- `m1-u9-object-pronouns-gf-001` [gap-fill, d1]: p="I like Tom. I like ___." c="him" a=["him"] ds=["he","his","them"]
- `m1-u9-object-pronouns-gf-002` [gap-fill, d1]: p="Can you help ___? (I)" c="me" a=["me"] ds=["I","my","we"]
- `m1-u9-object-pronouns-gf-003` [gap-fill, d2]: p="Maria is nice. I like ___." c="her" a=["her"] ds=["she","him","hers"]
- `m1-u9-object-pronouns-gf-004` [gap-fill, d3]: p="The present is for ___. (we)" c="us" a=["us"] ds=["we","our","them"]
- `m1-u9-object-pronouns-gf-005` [gap-fill, d4]: p="I see Tom and Lisa every day. I see ___ at school." c="them" a=["them"] ds=["they","their","him"]
- `m1-u9-object-pronouns-mc-001` [gap-fill, d2]: p="Tom sees Anna every day. He sees ___ at school." c="her" a=["her"] ds=["she","him","hers"]
- `m1-u9-object-pronouns-mc-002` [gap-fill, d3]: p="Please give the book to ___. (I)" c="me" a=["me"] ds=["I","my","mine"]
- `m1-u9-object-pronouns-mc-003` [multiple-choice, d4]: p="Which sentence is correct?" c="Come with us to the park!" a=["Come with us to the park!"] ds=["Come with we to the park!","Come with our to the park!","Come with they to the park!"]
- `m1-u9-object-pronouns-ec-001` [error-correction, d2]: p="Find and fix the mistake: I like he very much." c="I like him very much." a=["I like him very much.","him"] ds=[]
- `m1-u9-object-pronouns-ec-002` [error-correction, d3]: p="Find and fix the mistake: This cake is for she." c="This cake is for her." a=["This cake is for her.","her"] ds=[]
- `m1-u9-object-pronouns-ec-003` [error-correction, d4]: p="Find and fix the mistake: Give the pencils to they, please." c="Give the pencils to them, please." a=["Give the pencils to them, please.","them"] ds=[]
- `m1-u9-object-pronouns-tf-001` [transformation, d2]: p="Replace the noun with a pronoun: I know the girls. → I know ___." c="them" a=["them","I know them.","I know them"] ds=[]
- `m1-u9-object-pronouns-tf-002` [transformation, d4]: p="Replace the noun with a pronoun: Give the ball to my sister and me. → Give it to ___." c="us" a=["us","Give it to us.","Give it to us"] ds=[]
- `m1-u9-object-pronouns-tr-001` [translation, d2]: p="🇩🇪 Kannst du mir helfen?" c="Can you help me?" a=["Can you help me?"] ds=[]
- `m1-u9-object-pronouns-tr-002` [translation, d4]: p="🇩🇪 Ich mag sie (= Anna und Lisa). Ich sehe sie jeden Tag." c="I like them. I see them every day." a=["I like them. I see them every day.","I like them. I see them every day","Every day i like them i see them"] ds=[]
- `m1-u9-object-pronouns-sb-001` [sentence-building, d2]: p="Put the words in the correct order: me / help / please / Can / you / ?" c="Can you help me, please?" a=["Can you help me, please?","Can you please help me?","Please can you help me?"] ds=[]
- `m1-u9-object-pronouns-mt-001` [matching, d1]: p="Match the subject pronoun to its object form: 1) I  2) he  3) she  4) they — a) them  b) me  c) her  d) him" c="{\"1\":\"b\",\"2\":\"d\",\"3\":\"c\",\"4\":\"a\"}" a=["{\"1\":\"b\",\"2\":\"d\",\"3\":\"c\",\"4\":\"a\"}"] ds=[]
- `m1-u9-object-pronouns-gf-006` [gap-fill, d5]: p="My parents are great. I love ___ and they love ___." c="them ... me" a=["them ... me"] ds=["they ... I","their ... my","them ... I"]
- `m1-u9-object-pronouns-gf-007` [gap-fill, d2]: p="I like my teacher. I listen to ___ every day." c="her" a=["her","him"] ds=["she","hers","they"]
- `m1-u9-object-pronouns-gf-008` [gap-fill, d3]: p="Tom and Lisa are my friends. I play with ___ every day." c="them" a=["them"] ds=["they","their","us"]
- `m1-u9-object-pronouns-mp-001` [matching-pairs, d1]: p="Find the pairs: subject pronoun ↔ object pronoun." c="[[\"I\",\"me\"],[\"he\",\"him\"],[\"she\",\"her\"],[\"we\",\"us\"],[\"they\",\"them\"],[\"it\",\"it\"]]" a=[] ds=[]
- `m1-u9-object-pronouns-gs-001` [group-sort, d2]: p="Sort: subject pronoun or object pronoun?" c="{\"Subject Pronoun\":[\"I\",\"he\",\"she\",\"we\",\"they\"],\"Object Pronoun\":[\"me\",\"him\",\"her\",\"us\",\"them\"]}" a=[] ds=[]

### `g1u09.s.possessive-s` — Possessive 's (Genitiv-s (Besitz mit 's))

Showing that something belongs to a person by adding 's to a name or noun.

v1 floor for this structure: **21 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [possessive-s-formation]: Add 's to a name or person word to say something belongs to them: Name + 's + thing.
  - DE: Hänge 's an einen Namen oder eine Personenbezeichnung, um zu sagen, dass etwas dazugehört: Name + 's + Sache.
  - "Mandy's brother is the problem." — "Mandys Bruder ist das Problem."
  - "Mr White's pet is a shark." — "Mr Whites Haustier ist ein Hai."
- rule [possessive-s-vs-is]: Don't confuse possessive 's with the 's of is. The context tells you which one it is.
  - DE: Verwechsle das Besitz-'s nicht mit dem 's von is. Der Kontext zeigt dir, was gemeint ist.
  - "Tom's school bag is big. (belonging to Tom)" — "Toms Schultasche ist groß."
  - "Tom's happy. (= Tom is happy)" — "Tom ist glücklich."

common errors:
- Leaving out the possessive 's.: ✗ "This is Tom bag." → ✓ "This is Tom's bag."
- Confusing possessive 's with the is contraction.: ✗ "Tom's is nice. (meaning Tom's bag)" → ✓ "Tom's bag is nice."

SB box `g1/sb/SB Unit 9- Unusual pets.txt#grammar-1` — ▶️ Question words:
```
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
```

v1 seed items (UNTRUSTED):
- `m1-u3-possessive-s-gf-001` [gap-fill, d1]: p="This is ___ bag.." c="Tom's" a=["Tom's"] ds=["Tom","Toms","Tom is"]
- `m1-u3-possessive-s-gf-002` [gap-fill, d1]: p="___ name is Anna.." c="My sister's" a=["My sister's"] ds=["My sister","My sisters","My sister is"]
- `m1-u3-possessive-s-gf-003` [gap-fill, d2]: p="Where is ___ phone?." c="Sarah's" a=["Sarah's"] ds=["Sarah","Sarahs","Sarahs'"]
- `m1-u3-possessive-s-gf-004` [gap-fill, d3]: p="My ___ birthday is in June.." c="mum's" a=["mum's","mom's"] ds=["mum","mums","mum is"]
- `m1-u3-possessive-s-gf-005` [gap-fill, d4]: p="___ is nice. (meaning: Tom is nice — NOT possession!)" c="Tom's" a=["Tom's"] ds=["Tom","Toms","Tom his"]
- `m1-u3-possessive-s-gf-006` [gap-fill, d4]: p="___ cat is very cute.." c="Lisa's" a=["Lisa's"] ds=["Lisa","Lisas","Lisa her"]
- `m1-u3-possessive-s-mc-001` [gap-fill, d1]: p="Which is correct? ___ is red." c="Anna's bag" a=["Anna's bag"] ds=["Annas bag","Anna bag","Annas's bag"]
- `m1-u3-possessive-s-mc-002` [multiple-choice, d3]: p="What does 'Tom's happy' mean?" c="Tom is happy." a=["Tom is happy."] ds=["The happy thing belongs to Tom.","Tom has happy.","Toms are happy."]
- `m1-u3-possessive-s-mc-003` [multiple-choice, d5]: p="In which sentence does 's mean POSSESSION (not 'is')?" c="My dad's car is blue." a=["My dad's car is blue."] ds=["Tom's happy today.","She's my best friend.","It's a nice day."]
- `m1-u3-possessive-s-ec-001` [error-correction, d2]: p="Find and fix the mistake: This is Tom bag." c="This is Tom's bag." a=["This is Tom's bag.","tom's"] ds=[]
- `m1-u3-possessive-s-ec-002` [error-correction, d3]: p="Find and fix the mistake: Marias cat is cute." c="Maria's cat is cute." a=["Maria's cat is cute.","maria's"] ds=[]
- `m1-u3-possessive-s-sb-003` [sentence-building, d5]: p="Put the words in the correct order: is / nice / Tom's / bag" c="Tom's bag is nice." a=["Tom's bag is nice.","Tom's bag is nice"] ds=[]
- `m1-u3-possessive-s-tf-001` [transformation, d2]: p="You're introducing your friend's pet. Show who owns the dog. Rewrite: The dog belongs to Maria. → It's ___ dog." c="Maria's" a=["Maria's","It's Maria's dog.","It's Maria's dog","it is Maria's dog."] ds=[]
- `m1-u3-possessive-s-tf-002` [transformation, d3]: p="You're labelling things in class. Use the short form with 's. Rewrite using 's: the bike of my brother → my ___" c="brother's bike" a=["brother's bike","my brother's bike"] ds=[]
- `m1-u3-possessive-s-tr-001` [translation, d2]: p="🇩🇪 Lisas Katze ist schwarz." c="Lisa's cat is black." a=["Lisa's cat is black."] ds=[]
- `m1-u3-possessive-s-tr-002` [translation, d4]: p="🇩🇪 Der Geburtstag meiner Mutter ist im Mai." c="My mum's birthday is in May." a=["My mum's birthday is in May.","My mother's birthday is in May.","My mom's birthday is in May."] ds=[]
- `m1-u3-possessive-s-sb-001` [sentence-building, d2]: p="Put the words in the correct order: is / Lisa's / new / phone" c="Lisa's phone is new." a=["Lisa's phone is new."] ds=[]
- `m1-u3-possessive-s-mt-001` [matching, d2]: p="Match the meaning: 1) Tom's happy 2) Tom's bag 3) She's nice 4) The girl's cat — a) possession b) contraction (is) c) contraction (is) d) possession" c="{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}" a=["{\"1\":\"b\",\"2\":\"a\",\"3\":\"c\",\"4\":\"d\"}"] ds=[]
- `m1-u3-possessive-s-ff-001` [free-form, d2]: p="You see a nice bike in the playground. It belongs to Tom. Rewrite: The bike belongs to Tom. → It is ___ bike." c="Tom's" a=["Tom's","Tom's bike","It is Tom's bike","It is Tom's bike."] ds=[]
- `m1-u3-possessive-s-gf-007` [gap-fill, d3]: p="That is my ___ car. (dad)" c="dad's" a=["dad's"] ds=["dads","dads'","dad"]
- `m1-u3-possessive-s-mp-001` [matching-pairs, d2]: p="Find the pairs: which means the same?" c="[[\"Lisa's cat\",\"the cat of Lisa\"],[\"my mum's car\",\"the car of my mum\"],[\"Tom's book\",\"the book of Tom\"],[\"the dog's ball\",\"the ball of the dog\"],[\"Dad's phone\",\"the phone of Dad\"]]" a=[] ds=[]

### `g1u09.s.question-words` — Question words (Fragewörter (W-Fragen))

Asking open questions with question words: what, where, how often (and who, why).

v1 floor for this structure: **20 item(s)** — generate at least that many, ≥3 formats, difficulties 1–3.

- rule [question-words-list]: Use a question word + do/does + subject + base verb to ask for more than a yes/no answer: what (thing), where (place), how often (frequency).
  - DE: Verwende Fragewort + do/does + Subjekt + Grundform, wenn du mehr als ja/nein wissen willst: what (Sache), where (Ort), how often (Häufigkeit).
  - "What does it eat?" — "Was frisst es?"
  - "Where do you live?" — "Wo wohnst du?"
  - "How often do you phone your friends?" — "Wie oft rufst du deine Freunde an?"
- rule [question-words-who-subject]: When who is the subject, don't use do/does.
  - DE: Wenn who das Subjekt ist, verwendest du kein do/does.
  - "Who likes pizza?" — "Wer mag Pizza?"

common errors:
- Using the wrong question word.: ✗ "Where is your name?" → ✓ "What is your name?"
- Leaving out do-support in a Wh-question.: ✗ "Where you live?" → ✓ "Where do you live?"

SB box `g1/sb/SB Unit 9- Unusual pets.txt#grammar-1` — ▶️ Question words:
```
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
```

v1 seed items (UNTRUSTED):
- `m1-u9-question-words-gf-001` [gap-fill, d1]: p="___ is your name? — My name is Anna." c="What" a=["What"] ds=["Where","Who","How"]
- `m1-u9-question-words-gf-002` [gap-fill, d1]: p="___ do you live? — I live in Vienna." c="Where" a=["Where"] ds=["What","Who","Why"]
- `m1-u9-question-words-gf-003` [gap-fill, d2]: p="___ is your best friend? — Tom is my best friend." c="Who" a=["Who"] ds=["What","Where","How"]
- `m1-u9-question-words-gf-004` [gap-fill, d3]: p="___ do you feed your cat? — Twice a day." c="How often" a=["How often"] ds=["How many","How much","Why"]
- `m1-u9-question-words-gf-005` [gap-fill, d4]: p="___ are you sad? — Because my dog is sick." c="Why" a=["Why"] ds=["What","How","Where"]
- `m1-u9-question-words-mc-001` [gap-fill, d2]: p="___ do you eat for breakfast? — I eat cereal." c="What" a=["What"] ds=["Where","Who","When"]
- `m1-u9-question-words-mc-002` [multiple-choice, d3]: p="Which question is correct?" c="Where does she live?" a=["Where does she live?"] ds=["Where she lives?","Where does she lives?","Where she does live?"]
- `m1-u9-question-words-mc-003` [multiple-choice, d5]: p="Choose the correct question with 'who' as the subject:" c="Who speaks French in your class?" a=["Who speaks French in your class?"] ds=["Who does speak French in your class?","Who do speak French in your class?","Who speak French in your class?"]
- `m1-u9-question-words-ec-001` [error-correction, d2]: p="Find and fix the mistake: Where you live?" c="Where do you live?" a=["Where do you live?","do"] ds=[]
- `m1-u9-question-words-ec-002` [error-correction, d3]: p="Find and fix the mistake: What does she likes?" c="What does she like?" a=["What does she like?","like"] ds=[]
- `m1-u9-question-words-ec-003` [error-correction, d4]: p="Find and fix the mistake: Where is your name?" c="What is your name?" a=["What is your name?","what"] ds=[]
- `m1-u9-question-words-tf-001` [transformation, d3]: p="Write a question for this answer: 'I live in Salzburg.' → ___ do you live?" c="Where" a=["Where","Where do you live?","Where do you live"] ds=[]
- `m1-u9-question-words-tf-002` [transformation, d4]: p="Write a question for this answer: 'I feed my dog three times a day.' → ___ ___ do you feed your dog?" c="How often" a=["How often","How often How often do you feed your dog?","How often How often do you feed your dog"] ds=[]
- `m1-u9-question-words-tr-001` [translation, d2]: p="🇩🇪 Wo wohnst du?" c="Where do you live?" a=["Where do you live?"] ds=[]
- `m1-u9-question-words-tr-002` [translation, d4]: p="🇩🇪 Warum magst du Katzen?" c="Why do you like cats?" a=["Why do you like cats?"] ds=[]
- `m1-u9-question-words-sb-001` [sentence-building, d3]: p="Put the words in the correct order: does / What / like / she / ?" c="What does she like?" a=["What does she like?"] ds=[]
- `m1-u9-question-words-mt-001` [matching, d2]: p="Match the question word to the answer type: 1) Who  2) What  3) Where  4) Why — a) a reason  b) a place  c) a person  d) a thing" c="{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}" a=["{\"1\":\"c\",\"2\":\"d\",\"3\":\"b\",\"4\":\"a\"}"] ds=[]
- `m1-u9-question-words-qf-001` [question-formation, d3]: p="Tom lives in London. Ask about the place: ___ does Tom live?" c="Where does Tom live?" a=["Where does Tom live?","Where does he live?"] ds=[]
- `m1-u9-question-words-gf-007` [gap-fill, d2]: p="___ is your favourite colour?" c="What" a=["What"] ds=["Who","Where","When"]
- `m1-u9-question-words-mp-001` [matching-pairs, d2]: p="Find the pairs: question word ↔ what it asks about." c="[[\"who\",\"a person\"],[\"what\",\"a thing\"],[\"where\",\"a place\"],[\"when\",\"a time\"],[\"why\",\"a reason\"],[\"how\",\"a way/method\"]]" a=[] ds=[]

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

Core allowlist (closed-class, always allowed): a, an, the, i, you, he, she, it, we, they, me, him, her, us, them, my, your, his, its, our, their, this, that, these, those, who, what, which, when, where, why, how, be, am, is, are, was, were, isn't, aren't, wasn't, weren't, i'm, you're, he's, she's, it's, we're, they're, do, does, did, done, doing, don't, doesn't, didn't, have, has, had, having, haven't, hasn't, i've, you've, we've, they've, can, can't, cannot, let's, and, or, but, because, so, if, than, then, in, on, at, to, of, for, with, from, up, down, about, into, out, over, under, after, before, not, no, yes, n't, some, any, all, both, many, much, more, most, one, two, three, four, five, six, seven, eight, nine, ten, here, there, now, today, very, too, also, there's, please, sorry, ok, hello, hi, bye, goodbye, thanks, thank

Harvested proper nouns (≤ this unit): Adverbs, Ahmed, Alphabet, Anger, Annie, Arbeit, Archie, Articles, Austria, Bacon, Baker, Befehlsformen, Bert, Betty, Bild, Bilder, Blackbeard, Blackie, Bob, Box, Buckingham, Buddy, Burgers, California, Cambridge, Caribbean, Carina, Carl, Chester, Chloe, Christie, Clare, Classroom, Clothes, Clown, Come, Complimenting, Dan, Dana, Daniel, Dave, David, Davis, Debbie, Dialog, Dialoge, Doctor, Doctors, Don, Ellie, Emma, England, English, False, Fido, Food, Frank, Fred, Freddy, George, Georgia, German, Gina, Good, Gordon, Great, Grey, Greybeard, Groans, Guess, Harry, Hmm, Holmes, Homework, Hook, Imperatives, Irregular, Italian, Jack, Jacob, James, Jamie, Jane, Jenny, Jessica, Jill, John, Julia, Jun, Kitty, Leah, Leo, Lethabo, Lewis, London, Lucy, Mail, Manchester, Mandy, Manson, Mark, Marple, Mary, Matt, Mike, Miss, Mr, Mum, Nibbs, Nice, Nick, Nomen, Number, Numbers, Object, Objekte, Olivia, Omar, Palace, Pardon, Paws, Pete, Peter, Pets, Pirates, Plural, Plurals, Polly, Possessives, Prepositions, Present, Priestly, Project, Put, Rajit, Red, Reihenfolge, Richard, Ronald, Rosie, Sally, Sam, Sandra, Saying, School, Sherlock, Smith, Sophia, Steve, Sue, Tamar, Tamara, Tammy, Text, Think, Tick, Toby, Tock, Tom, Tony, True, Um, Walker, Wall, Watson, Welcome, Well, White, Wise, Work, Wortes, Would, Wow, Yeah, York, Zahlen, Zimmer

Bare numbers (2026, 14, …) always pass. ANY other word must be glossed `word (= deutsches Wort)` and recorded in the item's `gloss[]` — or better, rephrased away.

## Unit transcripts (carrier material — the unit's world)

```
----- SB: SB Unit 9- Unusual pets.txt -----
Page 66
Unit 9: Unusual pets
At the end of unit 9 ...
you know ☐ 11 words for pets ☐ how to use question words (what, where, how often) ☐ how to use object pronouns (Pronomen als Objekte) ☐ how to use the possessive 's ☐ more irregular plural forms
you can ☐ talk and ask questions about pets ☐ understand a short newspaper article about pets ☐ understand a letter about a problem ☐ write an email about a problem
VOCABULARY Pets
mouse rabbit pony cat guinea pig tortoise fish dog rat budgie hamster
3/1 🔊 1 Look and write the words and the correct number of animals under the pictures. Then listen and check.
[Image description: 4 rows of animal pictures in colored boxes showing various pets including dogs, mice, birds, fish, rats, guinea pigs, ponies, fish, cats, tortoises, rabbits, and hamsters]
1 .......one dog........ .......six mice........ ................................. .................................
2 ................................. ................................. ................................. .................................
3 ................................. ................................. ................................. .................................
4 .......two ponies..... ................................. ................................. .................................
LISTENING
3/2 🔊 2 Listen to Mr White talking about his unusual pet and tick the correct answers.
[Image description: Photos showing a shark, pig, owl, cage, aquarium, and pool]
1 Mr White's pet is: ☐ a shark ☐ a pig ☐ an owl 2 His pet's name is: ☐ Mr Big Mouth ☐ Mr Bacon ☐ Mr One-Eye 3 His pet lives in: ☐ a cage ☐ a tank ☐ a swimming pool 4 His pet eats: ☐ fish and beef ☐ bananas ☐ fish and chips 5 He feeds his pet: ☐ once a day ☐ twice a day ☐ three times a day
🔵 WB p. 75, 76, 80 🌐 CYBER Homework 25 (Revision)
Page 67
READING
3 Read the newspaper article.
Pets in the UK*
There are more than 66 million people in the UK and between them they own about 51 million pets. In fact, 45% of the population have a pet, so many families have more than one. The UK's favourite pets are dogs. There are 9 million dogs and 8 million cats in the UK. Other pets are fish, rabbits, birds, guinea pigs, hamsters, lizards, mice, spiders and ponies.
Some families in the UK have very unusual or dangerous pets. At the moment, there are about 700 dangerous snakes, 36 camels, 36 scorpions, about 75 crocodiles, nearly 300 big cats and one zebra in homes across Britain. A family in Cambridge has got a snow leopard. A man near Chester has a cheetah at an old farm.
[Image description: Photos of various animals labeled - lizard, zebra, spider, camel, snow leopard, cheetah]
VOCABULARY: *UK (United Kingdom) – Vereinigtes Königreich
4 How many of these tasks can you do?
1 Dogs are the number 1 pets in the UK. T / F 2 There are 7 million cats in the UK. T / F 3 Hamsters are the UK's favourite pets. T / F 4 How many people are there in the UK? ☐ about 51 million ☐ about 60 million ☐ about 66 million 5 What animal is not a pet in the UK? ☐ a camel ☐ a snake ☐ a bear 6 What pet has a man got in Chester? ☐ a cheetah ☐ a tiger ☐ a snow leopard 7 Are there more dogs or cats in the UK? ................................................................................................. 8 Can you name three big cats? ................................................................................................. 9 Can you name two dangerous pets? .................................................................................................
3/3 🔊 5 Check your answers with a partner. Then listen to the text.
6 Read the interview and complete it with the questions from the box.
What does he eat? Where do you keep him? What is it? What's his name? How often do you feed him?
Presenter Mrs Manson, you've got an unusual pet. ¹......................................................................................................... Mrs Manson An elephant. Presenter Wow. ²................................................................................................. Mrs Manson Mr Big Ears. Presenter ³......................................................................................................... Mrs Manson Three or four times a day. Presenter ⁴......................................................................................................... Mrs Manson A lot of grass and fruit. Presenter ⁵......................................................................................................... Mrs Manson In my garden. It's very big.
3/4 🔊 7 Now listen and check.
🔵 WB p. 77, 80
Page 68
SPEAKING Talking/Asking about pets
8 C H O I C E S
👥 A Read the dialogue. Then act it out.
Girl Have you got a pet? Boy Yes, a cat. His name is Roonie. Girl What colour is he? Boy Brown and white.
👥 B Work in pairs. Student A asks questions about his/her partner's pet and completes the information in box 2. Student B looks at box 1 on page 83 in the Workbook. Then swap roles.
[Image description: Photos of two students with speech bubbles showing conversation prompts]
What's your unusual pet? What's its name? What does it eat? Where do you keep it? How often do you feed it?
1 Your pet: • Your pet is a spider. • Its name is Mr Longlegs. • It lives in a box. • You feed it once a week. • It eats insects.
2 Your partner's pet: • .................................... has got an unusual pet. • It's a .................................... . • Its name is .................................... . • It lives in a big .................................... . • .................................... feeds his/her pet .................................... a day. • It eats .................................... .
A SONG 4 U
3/5+6 🔊 9 Listen and sing.
Hamster Blues
Day after day, Day after day, running in a wheel. it's the same old meal. Day after day, Day after day, well – how would you feel? well – how would you feel?
Let me go. Let me go Let me go. Let me go ... where the hamsters are free. Let me be. Let me be, I run and I run, let me just be me. day after day. And so I think I'll just run away.
[Image description: Illustration of a hamster in a cage]
Hooray!
Now listen and see –
I'm free!
🔵 WB p. 83 🌐 CYBER Homework 26
Page 69
READING
📖 10 Read the story.
Archie's toys
[Image description: Illustration of a dog]
"I'm sorry, Clare," Mum says one morning to her daughter*. "We can't keep Archie, he must go and live with Grandpa. The country is good for Archie, the city isn't the right place for him. All day long he plays with his cuddly toys* but he doesn't often go out to play."
"Oh, Mum," Clare answers. "NO! That's too far away."
"I'm really sorry," Mum says. Clare is very sad.
On Sunday they drive to Grandpa's house. Archie likes it there, he can run and run. There is also a cat and Archie likes the cat because he can chase* it.
[Image description: Illustration of dog chasing cat]
But when Clare and her mother leave, Archie also looks very sad, and he doesn't want to run any more and he doesn't want to chase the cat any more.
A week later, Grandpa calls Clare's mother. "I'm very sorry, dear, but I can't find Archie." Clare's mother doesn't tell her daughter. The next day, Grandpa calls again. "Sorry, I still can't find him."
Now Clare's mother tells her about Archie. She wants to go to Grandpa right now, but Mum says, "Let's wait until Sunday."
On Sunday they visit Grandpa, but there's no Archie. Everybody is sad. Grandpa gives Clare two baskets of apples and plums* from his garden. Clare likes that, but she is still sad about Archie and does not eat them.
When they get home again, Mum opens the door to the apartment. Then she goes back to the car and she and Clare carry the fruit baskets into the apartment. Clare hears a noise. "What's that?" she says. She goes into her room – and there is Archie. In his mouth are his two favourite cuddly toys.
"Oh dear, oh dear," Mum says, "he wants his toys." "Yes," Clare says, "and he can find his way home! What a clever dog!"
Archie stays a week with Clare and then they take him back to Grandpa. With his cuddly toys, of course.
[Image description: Illustration of Archie with toys]
VOCABULARY: *daughter – Tochter; cuddly toy – Stofftier; chase – jagen; plum – Zwetschke
11 How many of these tasks can you do?
1 What place is good for Archie? ☐ the country ☐ the apartment ☐ the city 2 At Grandpa's place, Archie can now ☐ play with his toys. ☐ chase the cat. ☐ play with the birds. 3 Archie is sad when ☐ he sees Grandpa. ☐ Clare and her mum leave. ☐ the cat stops playing. 4 Grandpa calls twice to say that he can't find Archie. T / F 5 Clare and Mum wait for two days before they go to Grandpa again. T / F 6 At Grandpa's place, Clare eats oranges and plums. T / F 7 How does Clare feel at Grandpa's place? ................................................................................... 8 Why does Clare call Archie a clever dog? ................................................................................... 9 Where does Archie live at the end of the story? ...................................................................................
3/7+8 🔊 12 Check your answers with a partner. Then listen to the story.
🔵 WB p. 80, 81
Page 70
OUR YOUNG WORLD 3
▶️ Jamie's pet
[Image description: Video frame of Jamie holding papers]
▶️ 1 Which of these do you think is Jamie's pet? Watch and tick.
[Image description: 6 animal photos labeled 1-6 showing frog, cat, dog, turtle, spider, and parakeet]
▶️ 2 Watch again and answer the questions.
1 How many teeth does Tammy have? ................................................................................................. 2 What are her teeth called? ................................................................................................. 3 Where is Tammy in her tank? ................................................................................................. 4 What have both Tammy and Jamie got? ................................................................................................. 5 What does Tammy eat? ................................................................................................. 6 Who doesn't like Tammy very much? .................................................................................................
VOCABULARY: *fur – Fell
FIND OUT
3 In pairs. Write two questions for Tammy.
1 .................................................................................................................................................................................. ? 2 .................................................................................................................................................................................. ?
4 Swap questions with another pair. Find the answers to their questions.
Our digital world
5 In pairs. Read and answer the questions.
Having your own blog can be a cool hobby. You can tell people about the things you are interested in. It's also a good way to meet people who are interested in the same things.
[Image description: Photo of person filming a blog]
1 What would you talk about on your blog?
But be careful. Don't put personal information on your blog.
2 What things should you not put on your blog?
CYBER PROJECT: The digital world
6 Work in groups. What should you (not) put on your blog? • Create a powerpoint presentation. • Show it in class.
🌐 CYBER Project 3
Page 71
READING
13 Read the letter.
[Image description: Cartoon hamster character with note "Have you got a problem? write to Olivia, the clever owl."]
Dear Aunty Olivia,
I've got a problem. I'm a hamster. I live in a small cage with my brother and my sister. Our owners are a boy and a girl. The girl's name is Mandy. We like her a lot. She gives us lots of nice food. She often plays with us. Mandy's school bag is big. She sometimes carries us to school in her school bag. Yes, we love her.
The problem is Mandy's brother Bob. We don't like him very much. He doesn't give us nice food. He only feeds us spiders – we hate them. Bob sometimes pulls my ears. I don't like it. What can I do?
Best wishes, Harry the hamster
Contact: harry@hamster.co.uk
[Image description: Illustration of girl with hamsters]
14 How many of these tasks can you do?
1 Harry is a hamster. T / F 2 Mandy often plays with the hamsters. T / F 3 Harry the hamster has an email address. T / F 4 The hamsters ........................................................................ in a small cage. 5 Bob is Mandy's ........................................................................ . 6 The hamsters do not ........................................................................ Bob. 7 How many hamsters are there? ................................................................................................................. 8 Why does Harry like Mandy? ................................................................................................................. 9 What is the problem with Bob? .................................................................................................................
15 Check your answers with a partner.
16 Read Aunty Olivia's answer. Complete it with the words from the box.
her them he they you him
To: harry@hamster.co.uk Subject: Your problem with Bob
Dear Harry,
Thank you for your letter. It's great that Mandy is so nice. It's great that she loves ¹.................................. and you love ².................................. . Bob isn't bad. He likes you, but ³................................ doesn't understand hamsters. He thinks ⁴................................ eat spiders. He doesn't know that hamsters don't eat ⁵.................................. . The next time Bob pulls your ears, bite ⁶.................................. ! Love, Aunty Olivia
🔵 WB p. 81
Page 72
SOUNDS RIGHT /æ/
3/9 🔊 17 Listen and repeat.
Sam the rat had a chat with Billy the bat and Carl the cat on a mat in front of my flat.
[Image description: Illustration of animals on a mat]
WRITING
18 Look at Harry's letter in 13 and Olivia's email in 16. What do they say at the beginning? And at the end?
............................................................................................................................................................. .............................................................................................................................................................
19 Read the different ways to begin or end a letter or an email. Write B (Beginning) or E (End) next to them.
Hi John, ⭕ Bye for now, Sam ⭕ Dear Peter, ⭕
Best wishes, Anne ⭕ Hello Tony, ⭕ Love, Sheila ⭕
20 Imagine you are a pet and you've got a problem.
Think about: • what pet you are • your name • where you live • what you eat • what problem you have
[Image description: Illustration of two cats on a couch]
21 Now write an email (60–80 words) about your problem to Olivia, the owl. Use Harry's letter in 13 to help you. Use a good beginning and ending.
🔵 WB p. 81
Page 73
GRAMMAR
▶️ Question words
So stellst du Fragen mithilfe der Fragewörter What / Where / How often:
What is your pet? is its name? does it eat?
Where is your dog? does she keep her hamster? do you live?
How often does he feed his pet? do you phone your friends?
[Image description: Cartoon showing two people on a couch with a crocodile, with speech bubble "Where do you keep your crocodile?"]
▶️ Object pronouns
Pronomen als Objekte:
I – me Do you like me? you – you Nice to meet you. he – him We don't like him. she – her We love her. it – it How often do you feed it? we – us She carries us to school. they – them We hate them.
Irregular plurals (3)
one mouse → two mice one pony → two ponies
▶️ Possessive 's
So sagst du, dass ein Ding, ein Tier oder eine Person zu jemandem gehört:
Mandy's brother is the problem. Mr White's pet is a shark. Mandy's school bag is big.
MORE FUN WITH FIDO!
[Image description: Four-panel comic strip showing a dog and people by a fence with speech bubble "Well, I am an unusual pet!"]
⏪ Now go back to page 66. Check ☑ with a partner what you know / can do.
🔵 WB p. 77, 78, 79 🌐 CYBER Homework 27
Page 74
THE TWINS 4
▶️ The blue T-shirt
Developing speaking competencies
Language function | Speaking strategy ☐ I can compliment someone (jemandem | ☐ I can respond to compliments (sich für Komplimente machen) | ein Kompliment bedanken)
VOCABULARY Clothes
1 Look at the photos. What clothes can you see? Guess who they belong to. Lucy or Leo? Discuss with a partner.
[Image description: 6 numbered photos showing clothing items - dress/skirt, red cap, blue t-shirt with heart design, red sneakers, floral skirt, and jeans]
3/10 🔊 2 Watch or listen to the dialogue. Then read it. What clothes do Lucy and Leo talk about?
▶️
Lucy Hey, Leo. I can't find my blue T-shirt. Do you know where it is? Leo Your blue T-shirt? Lucy Yes, my blue T-shirt. My favourite blue T-shirt. Do you know where it is? Leo Um ... No, I don't. Lucy Oh, that's a shame. I want to go out and I really need it. Leo Well, I really like your T-shirt, the T-shirt you've got on now. Lucy Thank you. Leo Yes, your T-shirt really suits you. Lucy Um ... That's kind of you. Leo You look good in red.
[Image description: Photo of two children with bikes outdoors]
Lucy Um ... Thanks. Leo, are you OK? I mean is everything alright? Leo Yes, I'm fine. Why? Lucy No reason.
Page 75
3 Complete the sentences with one word.
1 Lucy can't ................................................................. her blue T-shirt. 2 Leo ................................................................. know where Lucy's T-shirt is. 3 Lucy has got a ................................................................. T-shirt on. 4 Leo ................................................................. likes her T-shirt.
USEFUL PHRASES Complimenting
4 Write the words in the correct order to make sentences.
1 your / I / T-shirt / like / really ........................................................................................................... 2 really / T-shirt / you / your / suits ........................................................................................................... 3 look / red / good / you / in ...........................................................................................................
? What do you think? Answer the questions.
• Why is Leo so nice? • Where is Lucy's T-shirt?
MOBILE HOMEWORK
▶️ Watch part 2 of the video and put the events in the correct order.
☐ Lucy finds her T-shirt. ☐ Lucy gets her bike from the garage. ☐ Lucy asks Leo for some help. ☐ Lucy washes her bike. ☐ Leo turns Lucy's bike over. ☐ Lucy asks for Leo's cloth. ☐ Lucy splashes Leo with water.
SPEAKING STRATEGY Responding to compliments
5 Complete the dialogue with the correct words. Then check with the dialogue in 2.
Leo Well, I really like your T-shirt, the T-shirt you've got on now. Lucy T................................................ y................................................ . Leo Yes, your T-shirt really suits you. Lucy That's k................................................ of y................................................ .
6 C H O I C E S
👥 A Work in pairs.
A Compliment your friend's shoes/shirt/socks. → B Respond.
A I like your shoes.
B Thank you.
👥 B Walk around the classroom.
• Compliment the other students on their clothes. • Respond to their compliments.
🔵 WB p. 82


----- WB: WB Unit 9 Unusual pets.txt -----
Unit 9 Unusual pets
Pages 75-76
UNDERSTANDING VOCABULARY Pets
1 Write the names of the animals under the pictures.
[Word bank on left side:] lizard dog cat fish rabbit hamster pony mouse tortoise guinea pig mice budgie
[Images numbered 1-12 showing various pets:]
[Image of a hamster/mouse]
[Image of a rabbit]
[Image of a pony]
[Image of a cat]
[Image of a guinea pig]
[Image of a tortoise]
[Image of a goldfish]
[Image of a black dog]
[Image of a hamster]
[Image of a budgie]
[Image of two mice]
[Image of a lizard]
2 Look at the pictures and tick T (True) or F (False).
1 There is one cat. T ☐ F ☐ 2 There are two tortoises. T ☐ F ☐ 3 There are eight budgies. T ☐ F ☐ 4 There are five fish. T ☐ F ☐ 5 There are nine mice. T ☐ F ☐ 6 There are five ponies. T ☐ F ☐ 7 There are two dogs. T ☐ F ☐ 8 There are four rabbits. T ☐ F ☐
[Large illustration on right showing various animals including cats, dogs, ponies, fish, birds, rabbits, and tortoises]
Pages 76-77
3 Find and circle eleven pet words in the wordsearch. (← → ↑ ↓)
[Word search grid with 10x10 letters:] N R A B B I T Y N B P L I Z A R D M B R D E G S U B Y J U E O S F C E G T K D T G U I N E A P I G S V O S W D T O Z I M M M H H K A N R E A Y N T A C I Y O P H R U E S I O T R O T
USING VOCABULARY Pets
4 Find the correct words in the box and write them under the pictures.
[Word bank on left:] low khasr plaeetnth gfor mcale ziradl hheecta ezbar alligor capinel girte gip kanse rta raeb
[Images numbered 1-15 showing various animals:]
[Zebra]
[Shark]
[Monkey/Ape]
[Pig]
[Elephant]
[Camel]
[Bear]
[Tiger]
[Owl]
[Cheetah]
[Pelican]
[Giraffe]
[Snake]
[Rat]
[Lizard]
5 Complete the text with the correct words.
My pet ¹............................ a lizard. Its name ²............................ Claws. It ³............................ in a big glass box. I ⁴............................ it three times a week. It ⁵............................ insects.
[Illustration showing a girl with a pet lizard in a glass tank]
Pages 77-78
UNDERSTANDING GRAMMAR Question words
6 Match the questions and answers.
1 Have you got a pet? ☐ One year. 2 What is it? ☐ In a big cage. 3 What's the name of your pet? ☐ Carrots, broccoli and apples. 4 What does it eat? ☐ Every day. 5 Where do you keep it? ☐ Its name is Nutcracker. 6 What colour is it? ☐ Yes, I have. 7 How old is it? ☐ A hamster. 8 How often do you feed it? ☐ Brown.
UNDERSTANDING GRAMMAR Object pronouns
7 Circle the correct sentence.
1 I like Sandra. I like her. / I like him. 2 I don't like Tony. I don't like them. / I don't like him. 3 Give the books to Nick and me. Give them to me. / Give them to us. 4 Where are you, John? I can't see you. / I can't see us. 5 Look at this mountain bike. I like it. / I like her. 6 Give the book to Nick and Sandra. Give it to us. / Give it to them.
8 Look at the pictures and number the sentences.
☐ Give it to me! ☐ I don't like them. ☐ Don't touch it! ☐ He loves her. ☐ Please help us! ☐ Let's ask him.
[Six illustrations showing various scenarios:
Two people in a laboratory/science setting
Two people with hearts around them, appearing romantic
Three people near the Eiffel Tower with a policeman
People in water near a boat
Two people exchanging a gift
Two people at a shoe shop]
Pages 78-79
UNDERSTANDING GRAMMAR (Irregular) Plurals
9 Complete the sentences. Write numbers and plural nouns.
1 My friend Leonie has got six hamsters. (hamster / 6) 2 My friend Elisabeth has got ................................................................ . (pony / 2) 3 My friend Sam has got ................................................................ . (guinea pig / 4) 4 My friend Emily has got ................................................................ . (budgie / 7) 5 My friend Tim has got ................................................................ . (fish / 13) 6 And my friends Jacob and Fred have got ................................................................ . (mouse / 3)
USING GRAMMAR Question words
10 Complete the dialogues with the words from the box.
[Word bank:] Does Can Where How often Is Do What How
1 A ......................... do you feed your hamster? 5 A ......................... you like pets? B Milk and corn. B Yes, I do.
2 A ......................... do you feed your cat? 6 A ......................... your sister like pets? B Once a day. B No, she doesn't.
3 A ......................... do you keep it? 7 A ......................... are you today? B In a basket in my room. B I'm fine, thanks.
4 A ......................... you ride* a pony? 8 A ......................... this your dog? B No, I can't. B No, it isn't.
*VOCABULARY: ride – reiten
11 Write the questions for the answers.
1 What's your pet's name? – Billy. 2 .................................................................................................... – He's a dog. 3 .................................................................................................... – Dog food and carrots. 4 .................................................................................................... – In my bedroom. 5 .................................................................................................... – Twice a day.
USING GRAMMAR Object pronouns
12 Complete the sentences with the words from the box.
[Word bank:] it her it us me them him
1 This is my pet. Do you like .......................... ? 2 There's Steve. Let's talk to .......................... ! 3 We play football on Sundays. Come and play with .......................... ! 4 Jennifer is in my class. Do you like .......................... ? 5 Please phone .......................... on Sunday. I'm home all day. 6 I don't like this game – I can't play .......................... ! 7 We haven't got cats at home – we don't like .......................... .
Pages 79-80
USING GRAMMAR (Irregular) Plurals
13 Look at the picture and write sentences about the pets.
[Large illustration showing a pet shop scene with various animals: rabbits hanging from ceiling, dogs, cats, fish in tanks, tortoises, birds, hamsters in cages, and lizards]
1 There are two dogs. 2 ............................................................................................... 3 ............................................................................................... 4 ............................................................................................... 5 ............................................................................................... 6 ...............................................................................................
USING GRAMMAR Possessive 's
14 Rewrite the sentences.
1 John has got a black and white dog. John's dog is black and white.
2 Lily has got three friends: Isabella, Olivia and Sophie. ...............................................................................................
3 My brother has got a blue mountain bike. ...............................................................................................
4 Bob has got a sister. She's 15 years old. ...............................................................................................
5 Harry the hamster has got this email address: harry@hamster.co.uk. ...............................................................................................
6 My dad has got a car. It's a VW. ...............................................................................................
7 Mr Roger has got an unusual pet: a lizard. ...............................................................................................
Pages 80-81
READING & WRITING Talking about pets / Writing notes / Writing about a problem
15 Write the words in the correct order to make sentences about Mr White's pet.
1 unusual / Mr White / got / pet / has / an ...............................................................................................
2 shark / got / has / He / a ...............................................................................................
3 shark's / The / is / Mr One-Eye / name ...............................................................................................
4 keeps / swimming pool / He / him / the / in ...............................................................................................
5 shark / eats / The / fish / beef / and ...............................................................................................
6 Mr White / four times / feeds / a day / shark / the ...............................................................................................
[Illustration of a shark in a swimming pool]
1/29
16 Complete the sentences with the words from the box. Then listen and check.
[Word bank:] How often What Where What's
Interviewer Ms Priestly, tell me about your unusual pet. Ms Priestly Sure. Ask me a question. Interviewer ¹................................................................ is it? Ms Priestly A crocodile. Interviewer Wow. ²................................................................. its name? Ms Priestly Mr Big Teeth. Interviewer Ha ha ha. ³................................................................. do you feed him? Ms Priestly Once a day. Interviewer ⁴................................................................. do you keep him? Ms Priestly In my swimming pool.
17 Read the notes and match them with the pictures.
[Three note images shown on a refrigerator/board:]
"James, can you feed my hamster tonight? I'm staying at Oliver's house. Thanks, Ian"
"Lucy, can you take the dog for a walk before dinner? Thanks, Mum"
"Mum, can you get some dog food when you go to the shops? Thanks, Jenny"
18 Write notes for these situations in your exercise book.
1 You want your brother to feed your fish. 2 You want your mum to give your dog a bath*. 3 You want your dad to buy you some cat food.
*VOCABULARY: have a bath – ein Bad nehmen
Pages 81-82
19 CHOICES
A Read Emma's text. Then tick T (True) or F (False).
Hi, my name's Emma. I've got an unusual pet. It's an owl. Her name's Wise One. She lives in a big, old tree next to our house. In the evening, I open the window. Then Wise One comes into my room. She can speak and she tells me lots of stories. She is very clever. At midnight, Wise One flies away. Then she flies around and tries to find food. She eats mice. So I don't feed her. In the morning, Wise One flies back to her tree. She sleeps in the tree during* the day.
[Illustration of a girl at a window with an owl]
*VOCABULARY: during – während
1 Emma's pet is an owl. T ☐ F ☐ 2 Her pet's name is Wally. T ☐ F ☐ 3 Emma keeps the owl in a box in her room. T ☐ F ☐ 4 The owl comes to Emma's room in the evening. T ☐ F ☐ 5 The owl can juggle. T ☐ F ☐ 6 The owl is very clever. T ☐ F ☐ 7 Emma's owl eats chocolate. T ☐ F ☐ 8 She flies away again in the morning. T ☐ F ☐
B 1 Read the letter. Then answer the questions.
Dear Aunty Olivia,
I've got a problem. My name's Blackie. I'm a dog and I'm very big. I live in a basket in a house. My owner's are two boys, Dan and Matt. Dan is 12. He's very nice. He plays with me, feeds me twice a day and cleans my basket. Matt is six years old - and that's a big problem. Matt thinks I'm a pony. He wants to ride on me all the time. He feeds me hay*. I don't like hay, and I'm not a pony. Sometimes Matt pulls my ears! What can I do?
Love, Blackie
*VOCABULARY: hay – Heu
[Illustration of a dog with two boys, one on horseback with hay]
1 What animal is Blackie? ............................................................................................... 2 Where does he live? ............................................................................................... 3 Who are his owners? ............................................................................................... 4 How old are they? ............................................................................................... 5 What does Dan do? ............................................................................................... 6 What does Matt do? ...............................................................................................
2 Write an answer to Blackie from Aunty Olivia. Write 80–100 words.
Pages 82-83
LISTENING & DIALOGUE WORK Talking and asking about pets / Complimenting
1/30
20 Listen to Rosie talking about her pet and answer the questions.
1 Why does Rosie like her pet? ...............................................................................................
2 Is Rosie's tarantula dangerous? ...............................................................................................
3 What does it eat? ...............................................................................................
4 What does Rosie do with her pet? ...............................................................................................
5 Where does she keep it? ...............................................................................................
6 What's the name of her pet? ...............................................................................................
[Image of a rose hair tarantula spider]
1/31
21 Complete the speech bubbles. Then listen and check.
[Four comic-style scenes with speech bubbles:]
[Scene in a clothing store] "That dress r........................... s........................... you. You l........................... really g........................... in pink."
[Scene on street] "T........................... k........................... of you."
[Scene with two people] "I r........................... l........................... y........................... cap."
[Scene with two people] "T........................... y........................... ."
22 Look at the picture and write your own dialogue.
A ................................................................................... B ................................................................................... A ................................................................................... B ................................................................................... A ................................................................................... B ...................................................................................
[Illustration showing two people in what appears to be a clothing store or dressing room]
Pages 83-84
23 Work in pairs. Student A asks questions from page 68 in the Student's Book. Student B answers the questions with the information in box 1 in the Workbook. Then swap roles.
1 Your pet: • Your pet is a crocodile. • Its name is Snap. • It lives in a big tank. • You feed it five times a day. • It eats fish and mice.
2 Your partner's pet: • .................................... has got an unusual pet. • It's a .................................... . • Its name is .................................... . • The pet lives in .................................... . • .................................... feeds his/her pet .................................... a week. • It eats .................................... .
WORD FILE
(Unusual) Pets
[Large illustrated scene showing various unusual pets in enclosures and tanks, with labels:]
owl (on perch)
budgie (on wire)
elephant (in enclosure)
spider (hanging)
bat (hanging)
shark (in water tank)
zebra (in enclosure)
camel (in enclosure)
pony (in enclosure)
guinea pig (with person)
fish (in water)
pig (on floor)
rabbit (on floor)
lizard (on floor)
rat (on floor)
mouse (on floor)
tortoise (on floor)
Where you keep pets/animals
[Four illustrations showing different animal enclosures:]
box [shallow tray with bedding]
tank [aquarium-style tank]
cage [wire cage]
terrarium [glass terrarium]
MORE Words and Phrases
Number	English	German Example	German Translation
1	unusual	A snake is a very unusual pet.	ungewöhnlich, außergewöhnlich
2	mouse (pl mice)	I have a mouse and a dog and my friend has four mice.	Maus
	(...) a day	She walks her dog three times a day.	(...) am Tag
	once	He feeds his hamster once a day.	einmal
	twice	I only feed my spider twice a week.	zweimal
3	across (Britain)	There are lots of pets in homes across Britain.	hier: in ganz (Großbritannien)
	dangerous	Crocodiles are dangerous animals.	gefährlich
	farm	She lives on a farm with horses and pigs.	Bauernhof
	man (pl men)	The man's name is John.	Mann
	near	The Smith family lives near London.	in der Nähe von
	newspaper	My dad always reads the newspaper in the morning.	Zeitung
10	(...) a week	He feeds his spider once a week.	(...) in der Woche
	basket	Grandpa gives her two baskets of apples and plums.	Korb
	daughter	Clare is her daughter.	Tochter
	to drive	On Sunday, they drive to Grandpa's house.	fahren
	everybody	Everybody in class is sad today.	jede/r
	far away	Grandpa's house is far away.	weit weg
	grandpa	My grandpa lives on a farm.	Opa
	mother	She lives at home with her mother.	Mutter
	noise	Clare hears a noise in the apartment.	Geräusch
	to stay	We can't stay here.	bleiben
	cuddly toy	All day long he plays with his cuddly toys.	Stofftier
	to visit	On Sunday, they visit Grandpa.	besuchen
OWB	to be interested in	Tell me about the things you are interested in.	an etw. interessiert sein
	fur	My pet has fur – lots of it.	Fell
	personal	Don't put personal information on your blog.	persönlich
	owner	Jamie is the owner of an unusual pet.	Besitzer/Besitzerin
13	aunty	Aunty Jane is Mum's sister.	Tante (Koseform)
	dear	Dear Aunty Olivia, ...	liebe/r (Anrede)
	letter	Thank you for your letter.	Brief
16	to bite	I don't like that dog. It bites!	beißen
18	beginning	The beginning of the film is fantastic.	Anfang
19	to begin	He always begins his emails with "Hi!".	anfangen, beginnen
	best wishes	Best wishes to your mum and dad, Peter.	herzliche Grüße
21	ending	The ending of the book is very strange.	Ende, Schluss
T4	to need	I really need your help.	brauchen

```

## Output contract

Write `content/corpus/units/g1-u09/gen/grammar.draft.json`:

```jsonc
{
  "schema": "grammar-draft@1",
  "slug": "g1-u09",
  "briefBank": "3757b4788b29",
  "briefPrompt": "4b9164076103",
  "items": [
    {
      "structureId": "g1u09.s.irregular-plurals-3",
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
